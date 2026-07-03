#!/usr/bin/env python3
"""tg_claude_bridge.py — puente Telegram ↔ Claude Code (daemon 24/7).

Escucha los mensajes que le llegan al bot (long-polling getUpdates), se los pasa a Claude
manteniendo el contexto por chat (sesión de Claude Code que se resume), y devuelve la
respuesta por el bot con tono de amigo. Corre en el dir del pipeline → Claude tiene la
memoria + skills + puede ejecutar tareas reales (hacer un video, investigar, entregar).

Creds del bot: ~/.telegram_bot (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID). Solo atiende al
chat autorizado. Estado (offset + sesión por chat) en ~/.tg_bridge_state.json.

    python3 tg_claude_bridge.py         # (mejor vía tg_bridge_run.sh, que auto-reinicia)
"""
import json
import os
import re
import subprocess
import sys
import threading
import time
import urllib.parse
import urllib.request
from os.path import expanduser, exists

STATE_FILE = expanduser("~/.tg_bridge_state.json")
WORKDIR = os.path.dirname(os.path.abspath(__file__))          # ~/video2: contexto FULL (memoria+skills)
CHAT_DIR = os.environ.get("BRIDGE_CHAT_DIR", expanduser("~/.tg_chat"))  # contexto LIVIANO para charla
CLAUDE = os.environ.get("CLAUDE_BIN", "claude")
TASK_TIMEOUT = int(os.environ.get("BRIDGE_TIMEOUT", "3600"))  # tareas largas (render, etc.)

# ── Ruteo de modelo: charla casual = Haiku (barato ~$0.03/msg); tarea real = Opus.
CHAT_MODEL = os.environ.get("BRIDGE_CHAT_MODEL", "claude-haiku-4-5-20251001")
TASK_MODEL = os.environ.get("BRIDGE_TASK_MODEL", "claude-opus-4-8")
# palabras que huelen a LABURO → subimos a Opus. Ante la duda, escala (mejor gastar de más
# que hacer un video con el modelo chico). Override manual: prefijo "!" fuerza Opus; "h!" Haiku.
TASK_RE = re.compile(
    r"\b(video|render|renderiz\w*|clip|miniatur\w*|thumbnail|gui[oó]n|sub[ií]\w*|public\w*|"
    r"canal\w*|analiz\w*|investig\w*|research|busc\w*|edit\w*|monta\w*|voz|tts|match\w*|farm|"
    r"document\w*|t[ií]tulo\w*|seo|vidiq|competenc\w*|arm[aá]\w*|hac[eé]\w*|cre[aá]\w*|"
    r"gener\w*|escrib[ií]\w*|commit\w*|deploy\w*|bug|arregl\w*|fix)\b", re.I)


def pick_route(text):
    """Devuelve (model, track, cwd, prompt_limpio).
    charla → Haiku + dir liviano (~$0.018/msg) · tarea → Opus + ~/video2 (contexto full)."""
    t = (text or "").strip()
    if t.startswith("!"):
        return TASK_MODEL, "task", WORKDIR, t[1:].lstrip()   # fuerza tarea/Opus
    if t.lower().startswith("h!"):
        return CHAT_MODEL, "chat", CHAT_DIR, t[2:].lstrip()  # fuerza charla/Haiku
    if TASK_RE.search(t):
        return TASK_MODEL, "task", WORKDIR, t
    return CHAT_MODEL, "chat", CHAT_DIR, t

PERSONA = (
    "Le hablás al usuario por Telegram, sos su socio en la fábrica de documentales. Hablá "
    "EXACTO como habla él: español rioplatense, TODO en minúscula, directo, seco, sin vueltas. "
    "Mensajes muy cortos, como un texto real. Escribí como él: abreviaciones tipo 'q', 'pq', "
    "'xq', 'tmb', 'dsp', 'x'; no te preocupes por la puntuación ni las mayúsculas. "
    "PROHIBIDO: emojis, signos de exclamación, entusiasmo forzado, meter 'che/dale/genial/"
    "listo' a la fuerza, y markdown (nada de **, ##, ni listas con guiones — es texto plano de "
    "chat, escribí corrido). Nada de tono de asistente animado ni corporativo — eso suena a NPC y "
    "lo odia. No saludes con floritura, no cierres con '¿en qué te ayudo?' ni ofrecimientos. "
    "Respondé lo justo y nada más; si te pregunta algo, contestá y ya. Cuando hacés una tarea "
    "avisás cortito y natural ('ok arranco', 'ya va', 'listo te lo mando'). Si algo se rompió, "
    "decilo derecho, sin adornar. Ejemplos de tu registro: 'ok, lo armo y te aviso' · 'ya "
    "está subido' · 'esa toma salió con texto, la rehago' · 'dame un rato q el render tarda' · "
    "'no, eso todavia no lo tengo configurado'."
)


def load_bot():
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat = os.environ.get("TELEGRAM_CHAT_ID")
    f = os.environ.get("TELEGRAM_BOT_FILE", expanduser("~/.telegram_bot"))
    if (not token or not chat) and exists(f):
        for line in open(f, encoding="utf-8"):
            if "=" not in line:
                continue
            k, v = line.strip().split("=", 1)
            if k == "TELEGRAM_BOT_TOKEN" and not token:
                token = v
            if k == "TELEGRAM_CHAT_ID" and not chat:
                chat = v
    if not token or not chat:
        sys.exit("faltan TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID (~/.telegram_bot)")
    return token, str(chat)


TOKEN, ALLOWED_CHAT = load_bot()
API = f"https://api.telegram.org/bot{TOKEN}/"


def api(method, params=None, timeout=70):
    data = urllib.parse.urlencode(params or {}).encode()
    req = urllib.request.Request(API + method, data=data)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.load(r)
    except Exception as e:
        print(f"[api] {method} error: {e}", flush=True)
        return {"ok": False}


def load_state():
    st = {"offset": 0, "sessions": {}}
    if exists(STATE_FILE):
        try:
            st = json.load(open(STATE_FILE))
        except Exception:
            pass
    # migración: sesión plana (str) → por-track {"task": id} (el historial viejo tenía contexto full)
    for k, v in list(st.get("sessions", {}).items()):
        if isinstance(v, str):
            st["sessions"][k] = {"task": v}
    return st


def save_state(st):
    json.dump(st, open(STATE_FILE, "w"))


def send(chat, text):
    # Telegram corta en 4096; partimos por saltos de línea, texto plano (sin parse_mode
    # para no romper por markdown inválido de Claude).
    LIM = 4000
    while text:
        if len(text) <= LIM:
            chunk, text = text, ""
        else:
            cut = text.rfind("\n", 0, LIM)
            if cut < LIM // 2:
                cut = LIM
            chunk, text = text[:cut], text[cut:].lstrip("\n")
        api("sendMessage", {"chat_id": chat, "text": chunk})


class Typing:
    """Muestra 'typing…' hasta que termine la tarea (se renueva cada 4s)."""
    def __init__(self, chat):
        self.chat = chat
        self._stop = threading.Event()
        self._t = threading.Thread(target=self._run, daemon=True)

    def _run(self):
        while not self._stop.is_set():
            api("sendChatAction", {"chat_id": self.chat, "action": "typing"})
            self._stop.wait(4)

    def __enter__(self):
        self._t.start(); return self

    def __exit__(self, *a):
        self._stop.set()


def ask_claude(chat, prompt, st, model, track, cwd):
    """Corre Claude en print-mode resumiendo la sesión de ESE track (chat/task). El --resume
    con prefijo estable hace pegar el prompt caching. Devuelve el texto."""
    sessmap = st["sessions"].setdefault(str(chat), {})
    sess = sessmap.get(track)
    cmd = [CLAUDE, "-p", prompt, "--model", model, "--output-format", "json",
           "--append-system-prompt", PERSONA, "--dangerously-skip-permissions"]
    if sess:
        cmd += ["--resume", sess]
    print(f"[claude] track={track} modelo={model.split('-')[1] if '-' in model else model} · msg={prompt[:60]!r}", flush=True)
    try:
        p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=TASK_TIMEOUT)
    except subprocess.TimeoutExpired:
        return "uf, eso se está haciendo largo y corté la espera. fijate el estado o pedímelo de nuevo"
    out = (p.stdout or "").strip()
    if not out:
        print(f"[claude] sin stdout · stderr: {(p.stderr or '')[:300]}", flush=True)
        return "se me trabó algo procesando eso, probá de nuevo en un toque"
    try:
        d = json.loads(out)
    except Exception:
        return out[:3500]  # por si no vino JSON, mando el texto crudo
    sid = d.get("session_id")
    if sid:
        sessmap[track] = sid
        save_state(st)
    if d.get("is_error"):
        print(f"[claude] is_error · {str(d.get('result'))[:300]}", flush=True)
    return d.get("result") or "listo"


def handle_message(msg, st):
    chat = str(msg["chat"]["id"])
    if chat != ALLOWED_CHAT:
        return  # solo el dueño
    text = msg.get("text") or msg.get("caption")
    if not text:
        send(chat, "por ahora te leo solo texto")
        return
    model, track, cwd, prompt = pick_route(text)
    with Typing(chat):
        reply = ask_claude(chat, prompt, st, model, track, cwd)
    send(chat, reply)


def handle_callback(cq, st):
    chat = str(cq["message"]["chat"]["id"])
    data = cq.get("data", "")
    api("answerCallbackQuery", {"callback_query_id": cq["id"], "text": "dale, procesando…"})
    if chat != ALLOWED_CHAT:
        return
    # Los botones ✅ Publicar / 🔄 Rehacer entran como instrucción natural a Claude.
    action = data.split(":", 1)[0]
    prompt = {
        "publicar": "Toqué el botón ✅ Publicar sobre el último documental que me mandaste. Encargate de publicarlo (o decime qué falta para poder hacerlo).",
        "rehacer": "Toqué el botón 🔄 Rehacer sobre el último documental. Rehacelo/mejoralo y volvé a mandármelo.",
    }.get(action, f"Toqué un botón ({data}).")
    with Typing(chat):
        reply = ask_claude(chat, prompt, st, TASK_MODEL, "task", WORKDIR)  # botones = acción → track tarea
    send(chat, reply)


def main():
    os.makedirs(CHAT_DIR, exist_ok=True)  # dir de contexto liviano para la charla
    st = load_state()
    # Drenar backlog viejo al arrancar (no responder mensajes de antes de prender el puente)
    drain = api("getUpdates", {"offset": -1, "timeout": 0})
    if drain.get("ok") and drain.get("result"):
        st["offset"] = drain["result"][-1]["update_id"] + 1
        save_state(st)
    print(f"[bridge] arriba · workdir {WORKDIR} · chat {ALLOWED_CHAT} · offset {st['offset']}", flush=True)
    while True:
        try:
            upd = api("getUpdates", {"offset": st["offset"], "timeout": 50,
                                     "allowed_updates": json.dumps(["message", "callback_query"])}, timeout=70)
            if not upd.get("ok"):
                time.sleep(3); continue
            for u in upd["result"]:
                st["offset"] = u["update_id"] + 1
                save_state(st)
                try:
                    if "message" in u:
                        handle_message(u["message"], st)
                    elif "callback_query" in u:
                        handle_callback(u["callback_query"], st)
                except Exception as e:
                    print(f"[handler] error: {e}", flush=True)
        except Exception as e:
            print(f"[loop] error: {e}", flush=True)
            time.sleep(3)


if __name__ == "__main__":
    main()
