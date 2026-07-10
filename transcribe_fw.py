# transcribe_fw.py — transcripción con faster-whisper (CTranslate2, CPU int8).
# Reemplazo rápido de whisper.cpp en esta PC (Ryzen 5 3350G, GPU AMD = sin CUDA).
# int8 + greedy en CPU: ~varias veces más rápido que whisper.cpp beam-search.
# Salida en el MISMO formato del proyecto (igual que transcribe_cuda.mjs):
#   public/captions_<slug>.json  ->  [{text,startMs,endMs,timestampMs,confidence}]  (word-level)
#   transcript_<slug>.txt, transcript_<slug>_timed.txt
#
# Uso:  python transcribe_fw.py <slug> [modelo]
#   espera public/<slug>_16k.wav (o public/<slug>.wav). modelo default = medium.
import sys, os, json

slug = sys.argv[1] if len(sys.argv) > 1 else None
if not slug:
    print("Uso: python transcribe_fw.py <slug> [modelo]"); sys.exit(1)
model_name = sys.argv[2] if len(sys.argv) > 2 else "medium"
lang = os.environ.get("WHISPER_LANG", "es")

root = os.getcwd()
wav = os.path.join(root, "public", f"{slug}_16k.wav")
if not os.path.exists(wav):
    wav = os.path.join(root, "public", f"{slug}.wav")
if not os.path.exists(wav):
    print(f"No existe wav para {slug}"); sys.exit(1)

from faster_whisper import WhisperModel
import time

# CPU int8: el mejor balance velocidad/calidad sin GPU. cpu_threads=0 => todos.
print(f"Cargando modelo {model_name} (CPU int8)...", flush=True)
model = WhisperModel(model_name, device="cpu", compute_type="int8", cpu_threads=8)

print(f"Transcribiendo {slug} ({lang})...", flush=True)
t0 = time.time()
segments, info = model.transcribe(
    wav,
    language=lang,
    word_timestamps=True,
    beam_size=1,          # greedy = rápido
    vad_filter=True,      # salta silencios largos -> más rápido y limpio
    vad_parameters=dict(min_silence_duration_ms=500),
)

captions = []
for seg in segments:
    if seg.words:
        for w in seg.words:
            txt = w.word
            if txt.strip() == "":
                continue
            captions.append({
                "text": txt,
                "startMs": int(round(w.start * 1000)),
                "endMs": int(round(w.end * 1000)),
                "timestampMs": int(round(w.end * 1000)),
                "confidence": round(float(w.probability), 3),
            })
    else:
        captions.append({
            "text": seg.text,
            "startMs": int(round(seg.start * 1000)),
            "endMs": int(round(seg.end * 1000)),
            "timestampMs": int(round(seg.end * 1000)),
            "confidence": 1,
        })
    # progreso en vivo
    print(f"  {seg.end:7.1f}s  {seg.text[:60]}", flush=True)

secs = round(time.time() - t0, 1)

with open(os.path.join(root, "public", f"captions_{slug}.json"), "w", encoding="utf-8") as f:
    json.dump(captions, f, ensure_ascii=False, indent=2)

plain = "".join(c["text"] for c in captions).strip()
with open(os.path.join(root, f"transcript_{slug}.txt"), "w", encoding="utf-8") as f:
    f.write(plain)

def fmt(ms):
    s = ms / 1000; m = int(s // 60); r = f"{s - m*60:05.2f}"
    return f"{m:02d}:{r}"
with open(os.path.join(root, f"transcript_{slug}_timed.txt"), "w", encoding="utf-8") as f:
    f.write("\n".join(f"[{fmt(c['startMs'])}] {c['text']}" for c in captions))

print(f"\n=== DONE en {secs}s · {len(captions)} palabras · captions_{slug}.json ===", flush=True)
