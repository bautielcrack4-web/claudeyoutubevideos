// matchclip.mjs — ELIGE automáticamente el clip + el SEGUNDO que mejor MUESTRAN lo
// que dice el guión, usando CLIP local (visión gratis, 0 tokens de Claude). Resuelve
// el "segundo al azar que no muestra la acción".
//
// Cómo: por cada beat, baja proxies 240p de varios candidatos de YouTube, extrae 1
// frame cada `step` seg con ffmpeg, y CLIP puntúa cada frame contra el CONCEPTO (texto).
// Devuelve el (clip, segundo) con mayor parecido. Escribe una lista lista para
// fetch_clips.mjs + una tabla de puntajes (números, no imágenes → 0 tokens).
//
// Requisitos: bin/yt-dlp.exe, ffmpeg de Remotion, @huggingface/transformers (instalado).
//
// Entrada — public/broll/match_<slug>.json:
//   [
//     { "name":"rb_dig", "concept":"hands digging dark soil with a shovel",
//       "query":"digging garden soil shovel", "dur":5, "after":0, "scan":180, "step":2 },
//     { "name":"rb_manure", "concept":"pile of cow manure on a farm",
//       "urls":["https://youtu.be/XXad","https://youtu.be/YYYY"], "dur":7 }
//   ]
//   · concept = texto EN que describe lo que se debe VER (no lo que se dice).
//   · query   = búsqueda YouTube (toma 3 candidatos)  |  urls = candidatos explícitos.
//   · scan    = seg a escanear desde `after` (def 180)   step = seg entre frames (def 2)
//   · dur/after/lead = como en fetch_clips.
//
// Uso:  node matchclip.mjs <slug>   (lee public/broll/match_<slug>.json)
// Salida: public/broll/clips_<slug>_matched.json  (→ pasar a fetch_clips.mjs)
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { pipeline } from "@huggingface/transformers";

const YTDLP = path.join(process.cwd(), "bin", "yt-dlp.exe");
const FF = path.join(process.cwd(), "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe");
const slug = process.argv[2];
if (!slug) { console.error("Uso: node matchclip.mjs <slug>"); process.exit(1); }
const LIST = `public/broll/match_${slug}.json`;
if (!fs.existsSync(LIST)) { console.error("No existe:", LIST); process.exit(1); }
const beats = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));

const TMP = "_match";
fs.mkdirSync(TMP, { recursive: true });
const vidId = (u) => (u.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/) || u.match(/([A-Za-z0-9_-]{11})/) || [])[1];

const CANDS = +(process.env.MATCH_CANDS || 5); // más candidatos = mejor match (def 5)
// filtro de CALIDAD: nada de shorts (<40s, suelen ser verticales/baja calidad), nada de
// videos larguísimos (>45min, descarga lenta), ni en vivo. Busca el doble y filtra.
const ytSearch = (q, n = CANDS) => {
  const r = spawnSync(YTDLP, [
    `ytsearch${n * 2}:${q}`, "--skip-download", "--no-warnings",
    "--match-filter", "duration>40 & duration<2700 & !is_live",
    "--print", "%(id)s",
  ], { encoding: "utf8" });
  const ids = (r.stdout || "").trim().split(/\r?\n/).filter(Boolean).slice(0, n);
  return ids.map((id) => `https://youtu.be/${id}`);
};

// baja proxy 240p de [after, after+scan] y extrae frames cada step seg → [{file, t}]
const proxyFrames = (url, after, scan, step, tag) => {
  const proxy = path.join(TMP, `${tag}.mp4`);
  const a = Math.max(0, after), b = after + scan;
  const dl = spawnSync(YTDLP, [
    url, "--download-sections", `*${a}-${b}`, "--force-keyframes-at-cuts",
    "-f", "bv*[height<=240]/wv*/w", "--ffmpeg-location", path.dirname(FF),
    "--merge-output-format", "mp4", "--no-playlist", "-o", proxy,
    "--force-overwrites", "--quiet", "--no-warnings",
  ], { encoding: "utf8" });
  if (dl.status !== 0 || !fs.existsSync(proxy)) return [];
  const fdir = path.join(TMP, `${tag}_f`);
  fs.rmSync(fdir, { recursive: true, force: true });
  fs.mkdirSync(fdir, { recursive: true });
  // ⚠ este build de ffmpeg (Remotion n7.1) FALLA con `-vf fps=...` + patrón numerado
  // ("Invalid argument"). Usar `-r` (rate de salida) funciona. CLIP reescala a 224 solo,
  // así que no hace falta escalar acá.
  const maxF = Math.ceil(scan / step) + 2;
  spawnSync(FF, ["-y", "-i", proxy, "-r", String(1 / step), "-frames:v", String(maxF), path.join(fdir, "f%04d.png")], { encoding: "utf8" });
  const files = fs.existsSync(fdir) ? fs.readdirSync(fdir).filter((f) => f.endsWith(".png")).sort() : [];
  return files.map((f, i) => ({ file: path.join(fdir, f), t: +(a + i * step).toFixed(1) }));
};

// Modelo CLIP: base patch32 = rápido (default). Para más PRECISIÓN de match (más lento en
// CPU) → MATCH_MODEL=Xenova/clip-vit-large-patch14. Corre en CPU (no toca la GPU de 6GB).
const MODEL = process.env.MATCH_MODEL || "Xenova/clip-vit-base-patch32";
console.log(`cargando CLIP local (${MODEL}, q8, CPU)...`);
const clf = await pipeline("zero-shot-image-classification", MODEL, { dtype: "q8" });
// puntaje de 1 frame: softmax del concepto contra un PANEL de distractores que son
// justo nuestros modos de fallo (presentador hablando, cartel de título, logo, interior
// neutro). Así el score discrimina de verdad y los planos "cabeza parlante"/intro pierden.
const DISTRACTORS = [
  "a person talking to the camera, a talking head",
  "a blurry or unrelated indoor scene",
];
// ★ frames a RECHAZAR por texto/marca quemada (el usuario odia los clips con texto
// gigante / subtítulos / watermark de otro canal). Se penalizan FUERTE, no compiten.
const TEXT_LABELS = [
  "a title card or large bold text overlay across the screen",
  "big subtitles or captions text on screen",
  "a channel logo, watermark or banner",
];
const scoreFrame = async (file, concept) => {
  const out = await clf(file, [concept, ...DISTRACTORS, ...TEXT_LABELS]);
  const get = (l) => out.find((o) => o.label === l)?.score || 0;
  const c = get(concept);
  const textMax = Math.max(...TEXT_LABELS.map(get));
  // si hay texto/marca prominente en el frame → casi descartado (×0.12)
  return c * (textMax > 0.16 ? 0.12 : 1);
};

const results = [];
const usedIds = new Set(); // diversidad: no repetir el mismo video de YT entre beats
for (const b of beats) {
  const { name, concept, dur = 6, after = 0, scan = 180, step = 2, lead = 1.0 } = b;
  const queries = b.urls ? null : (Array.isArray(b.query) ? b.query : [b.query]);
  const urls = b.urls || [...new Set((queries || []).flatMap((q) => (q ? ytSearch(q) : [])))];
  if (!urls.length) { console.log(`✗ ${name}: sin candidatos`); continue; }
  process.stdout.write(`• ${name}  "${concept}"  (${urls.length} candidatos)\n`);
  const cands = [];
  for (let i = 0; i < urls.length; i++) {
    const frames = proxyFrames(urls[i], after, scan, step, `${name}_${i}`);
    if (!frames.length) { console.log(`    cand ${i + 1}: sin frames`); continue; }
    let bf = { score: -1 };
    for (const fr of frames) {
      const s = await scoreFrame(fr.file, concept);
      if (s > bf.score) bf = { score: s, t: fr.t };
    }
    console.log(`    cand ${i + 1} (${vidId(urls[i])}): mejor ${bf.score.toFixed(3)} @ ${bf.t}s`);
    cands.push({ ...bf, url: urls[i], id: vidId(urls[i]) });
  }
  if (!cands.length) { console.log(`✗ ${name}: sin frames en ningún candidato`); continue; }
  cands.sort((a, b2) => b2.score - a.score);
  // DIVERSIDAD: si hay un video todavía no usado con score decente (≥88% del top), preferirlo
  // → evita que el mismo clip de YouTube se repita en varios beats.
  let best = cands[0];
  const fresh = cands.find((c) => c.id && !usedIds.has(c.id) && c.score >= cands[0].score * 0.88);
  if (fresh) best = fresh;
  if (best.id) usedIds.add(best.id);
  const start = Math.max(0, +(best.t - lead).toFixed(1));
  const flag = best.score < 0.55 ? "  ⚠ DUDOSO" : "";
  console.log(`  → ${name}: ${best.score.toFixed(3)} @ ${best.t}s  start=${start}${flag}${fresh ? " (diverso)" : ""}`);
  results.push({ name, url: best.url, start, dur, _score: +best.score.toFixed(3) });
}

const outPath = `public/broll/clips_${slug}_matched.json`;
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(`\n=== ${results.length} beats → ${outPath} ===`);
console.log("Revisá los _score (números, 0 tokens). Luego: node fetch_clips.mjs " + outPath);
fs.rmSync(TMP, { recursive: true, force: true });
