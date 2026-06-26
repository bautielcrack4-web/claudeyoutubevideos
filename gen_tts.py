# gen_tts.py — narración larga con voz CLONADA (Chatterbox), local + GPU + gratis.
# Parte el guion en chunks (oraciones), genera cada uno condicionado a la MISMA
# muestra de referencia (voz consistente todo el video) y concatena a un wav.
#
# ★ HUMANIZADO: pausas VARIABLES (no uniformes) según puntuación + respiros sutiles,
#   con jitter aleatorio → no suena metronómico/robótico. Lo que delata al TTS es la
#   falta de pausas y el ritmo parejo; esto lo arregla.
#     - fin de oración (. ! ?)  → pausa media
#     - "…" / ":" (suspenso)    → pausa más larga (dramática)
#     - fin de PÁRRAFO (línea en blanco en el guion) → pausa larga + RESPIRO
#     - coma/; dentro de chunk   → lo maneja el modelo
#
# Uso:
#   ttsenv\Scripts\python gen_tts.py --text guion.txt --out public/<slug>.wav \
#       [--ref ref_trevor.wav] [--lang es] [--exaggeration 0.7] [--cfg 0.5] [--seed 1234]
#       [--gap-sentence 0.45] [--gap-para 0.95] [--breath 0.05]   (--breath 0 = sin respiros)
#   · Párrafos = separá bloques con UNA LÍNEA EN BLANCO en el guion → ahí respira.
import argparse, os, re, random, json
import torch, torchaudio
import torchaudio.functional as AF


# Parte en (chunk, tipo_de_pausa_al_final, es_inicio_de_parrafo)
def split_blocks(t, maxlen=280):
    paras = [p.strip() for p in re.split(r"\n\s*\n", t.strip()) if p.strip()]
    out = []
    for pi, para in enumerate(paras):
        sents = [s.strip() for s in re.split(r"(?<=[.!?…])\s+", para.strip()) if s.strip()]
        # agrupar oraciones en chunks <= maxlen
        groups, cur = [], ""
        for s in sents:
            if len(cur) + len(s) + 1 <= maxlen:
                cur = (cur + " " + s).strip()
            else:
                if cur:
                    groups.append(cur)
                cur = s if len(s) <= maxlen else ""
                if len(s) > maxlen:  # oración larguísima: cortar por comas
                    for p in re.split(r"(?<=[,;:])\s+", s):
                        if len(cur) + len(p) + 1 <= maxlen:
                            cur = (cur + " " + p).strip()
                        else:
                            if cur:
                                groups.append(cur)
                            cur = p
        if cur:
            groups.append(cur)
        for gi, g in enumerate(groups):
            last = gi == len(groups) - 1
            tail = g.rstrip()[-1:] if g else "."
            if last:
                kind = "para"                       # fin de párrafo → pausa larga + respiro
            elif tail in "…:" or g.rstrip().endswith("..."):
                kind = "suspense"                   # suspenso → pausa larga
            else:
                kind = "sentence"                   # fin de oración normal
            out.append((g, kind, gi == 0 and pi > 0))  # 3º: arranca párrafo (no el 1º)
    return out


# respiro sutil sintético: ruido con envolvente de inhalación, grave y bajito.
def make_breath(sr, amp, rng):
    dur = rng.uniform(0.28, 0.40)
    n = int(sr * dur)
    noise = torch.randn(n)
    # suavizar (low-pass casero: media móvil) → un respiro es opaco, no brillante
    k = max(3, int(sr * 0.004))
    noise = torch.nn.functional.avg_pool1d(noise.view(1, 1, -1), k, 1, k // 2).view(-1)[:n]
    tt = torch.linspace(0, 1, n)
    env = (tt ** 0.55) * ((1 - tt) ** 0.9)          # sube rápido, baja lento = inhalar
    env = env / (env.max() + 1e-9)
    return (noise * env * amp).unsqueeze(0)


# ★ HORNEADO en la creación: deja la voz ya MEZCLADA como narrador real miked —
# EQ cálido + presencia + de-ess + loudness (sube el volumen flojo de Chatterbox) + glue.
def humanize(x, sr, rms_db=-18.0, drive=1.5, room=0.0):
    if x.size(0) > 1:
        x = x.mean(0, keepdim=True)
    x = AF.highpass_biquad(x, sr, 85)                       # saca retumbe/boom
    x = AF.equalizer_biquad(x, sr, 115, gain=2.5, Q=0.9)   # cuerpo/calidez
    x = AF.equalizer_biquad(x, sr, 350, gain=-2.0, Q=1.0)  # quita barro
    x = AF.equalizer_biquad(x, sr, 4500, gain=2.5, Q=1.2)  # presencia
    x = AF.equalizer_biquad(x, sr, 7200, gain=-3.5, Q=1.6) # de-ess
    if room > 0:
        ir_n = int(sr * 0.12); t = torch.linspace(0, 1, ir_n)
        ir = (torch.randn(ir_n) * torch.exp(-t * 28)) * room; ir[0] = 1.0
        x = x + AF.fftconvolve(x, ir.unsqueeze(0))[:, : x.size(1)] * 0.5
    rms = x.pow(2).mean().sqrt().clamp_min(1e-9)
    x = x * (10 ** (rms_db / 20) / rms)                     # loudness (volumen)
    x = torch.tanh(x * drive)                              # glue/limit suave
    peak = x.abs().max().clamp_min(1e-9)
    return x * (10 ** (-1.0 / 20) / peak)                  # techo -1 dBFS


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--text", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--ref", default=None)
    ap.add_argument("--lang", default="en")
    ap.add_argument("--exaggeration", type=float, default=0.5)
    ap.add_argument("--cfg", type=float, default=0.5)
    ap.add_argument("--seed", type=int, default=1234)  # FIJO → wav+timing REPRODUCIBLES (si se borra el wav, se regenera idéntico)
    ap.add_argument("--gap-sentence", type=float, default=0.45)   # pausa media (s)
    ap.add_argument("--gap-para", type=float, default=0.95)       # pausa de párrafo (s)
    ap.add_argument("--breath", type=float, default=0.05)         # amplitud respiro (0 = off)
    ap.add_argument("--rms", type=float, default=-18.0)           # loudness (sube el volumen flojo)
    ap.add_argument("--drive", type=float, default=1.5)           # glue/compresión suave
    ap.add_argument("--room", type=float, default=0.0)            # toque de sala (0 = seco)
    a = ap.parse_args()

    device = "cuda" if torch.cuda.is_available() else "cpu"
    text = open(a.text, encoding="utf-8").read() if os.path.exists(a.text) else a.text
    blocks = split_blocks(text)
    print(f"device={device} | chunks={len(blocks)} | lang={a.lang} | ref={a.ref or 'default'} | pausas+respiros ON")
    rng = random.Random(a.seed or None)
    if a.seed:
        torch.manual_seed(a.seed)

    multilingual = a.lang != "en"
    if multilingual:
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
        model = ChatterboxMultilingualTTS.from_pretrained(device=device)
    else:
        from chatterbox.tts import ChatterboxTTS
        model = ChatterboxTTS.from_pretrained(device=device)
    sr = model.sr

    def silence(seconds):
        return torch.zeros(1, max(1, int(sr * seconds)))

    segs = []
    timing = []          # ★ mapa exacto: cada chunk → segundo de inicio en el wav final
    nsamp = 0
    def add(seg):
        nonlocal nsamp
        segs.append(seg); nsamp += seg.shape[1]
    for i, (c, kind, starts_para) in enumerate(blocks):
        # respiro ANTES de arrancar un párrafo nuevo (después de la pausa larga)
        if starts_para and a.breath > 0:
            add(make_breath(sr, a.breath, rng))
            add(silence(rng.uniform(0.05, 0.12)))
        timing.append({"text": c, "start": round(nsamp / sr, 2)})   # inicio de ESTE chunk
        kw = dict(exaggeration=a.exaggeration, cfg_weight=a.cfg)
        if a.ref:
            kw["audio_prompt_path"] = a.ref
        if multilingual:
            kw["language_id"] = a.lang
        wav = model.generate(c, **kw)
        if wav.dim() == 1:
            wav = wav.unsqueeze(0)
        add(wav.detach().cpu())
        # pausa DESPUÉS, variable según el tipo + jitter (±20%) para que no sea metronómico
        base = {"para": a.gap_para, "suspense": a.gap_para * 0.8, "sentence": a.gap_sentence}[kind]
        add(silence(base * rng.uniform(0.8, 1.2)))
        print(f"  [{i+1}/{len(blocks)}] {len(c)} chars · pausa={kind}{' · +respiro' if starts_para and a.breath>0 else ''}")

    full = torch.cat(segs, dim=1)
    full = humanize(full, sr, a.rms, a.drive, a.room)   # ★ no cambia la duración → timing válido
    os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
    torchaudio.save(a.out, full, sr)
    timing_path = os.path.splitext(a.out)[0] + "_timing.json"   # ★ anclaje exacto, sin whisper
    json.dump(timing, open(timing_path, "w", encoding="utf-8"), ensure_ascii=False)
    print(f"OK -> {a.out} | {full.shape[1]/sr:.1f}s @ {sr}Hz | humanizada | timing -> {timing_path}")


if __name__ == "__main__":
    main()
