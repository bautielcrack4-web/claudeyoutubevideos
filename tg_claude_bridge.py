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
import subprocess
import sys
import threading
import time
import urllib.parse
import urllib.request
from os.path import expanduser, exists

STATE_FILE = expanduser("~/.tg_bridge_state.json")
WORKDIR = os.path.dirname(os.path.abspath(__file__))
CLAUDE = os.environ.get("CLAUDE_BIN", "claude")
TASK_TIMEOUT = int(os.environ.get("BRIDGE_TIMEOUT", "3600"))  # tareas largas (render, etc.)

PERSONA = (
    "Sos el socio del usuario en su fábrica de documentales, y le hablás por Telegram como "
    "un amigo. Español rioplatense, informal y cálido. Mensajes cortos, como chat real. Usá "
    "'che', 'dale', 'genial', 'listo', emojis con moderación. Cero tono corporativo ni "
    "robótico, con humor cuando cabe. Cuando hacés una tarea, avisá en lenguaje humano "
    "('dale, arranco con el video', 'listo, te lo mando'). No expliques de más ni des "
    "respuestas largas salvo que te lo pidan."
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
    if exists(STATE_FILE):
        try:
            return json.load(open(STATE_FILE))
        except Exception:
            pass
    return {"offset": 0, "sessions": {}}


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


def ask_claude(chat, prompt, st):
    """Corre Claude en print-mode resumiendo la sesión del chat. Devuelve el texto."""
    sess = st["sessions"].get(str(chat))
    cmd = [CLAUDE, "-p", prompt, "--output-format", "json",
           "--append-system-prompt", PERSONA, "--dangerously-skip-permissions"]
    if sess:
        cmd += ["--resume", sess]
    try:
        p = subprocess.run(cmd, cwd=WORKDIR, capture_output=True, text=True, timeout=TASK_TIMEOUT)
    except subprocess.TimeoutExpired:
        return "uf, esa tarea se está haciendo larga y corté la espera. Fijate el estado o pedímelo de nuevo 🙏"
    out = (p.stdout or "").strip()
    if not out:
        print(f"[claude] sin stdout · stderr: {(p.stderr or '')[:300]}", flush=True)
        return "che, se me trabó algo procesando eso 😅 probá de nuevo en un toque."
    try:
        d = json.loads(out)
    except Exception:
        return out[:3500]  # por si no vino JSON, mando el texto crudo
    sid = d.get("session_id")
    if sid:
        st["sessions"][str(chat)] = sid
        save_state(st)
    if d.get("is_error"):
        print(f"[claude] is_error · {str(d.get('result'))[:300]}", flush=True)
    return d.get("result") or "listo ✅"


def handle_message(msg, st):
    chat = str(msg["chat"]["id"])
    if chat != ALLOWED_CHAT:
        return  # solo el dueño
    text = msg.get("text") or msg.get("caption")
    if not text:
        send(chat, "por ahora te leo solo texto, che 🙂")
        return
    with Typing(chat):
        reply = ask_claude(chat, text, st)
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
        reply = ask_claude(chat, prompt, st)
    send(chat, reply)


def main():
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
