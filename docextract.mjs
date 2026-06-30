// docextract.mjs — MULTI-EXTRACCIÓN eficiente: baja cada documental UNA vez, extrae TODOS sus
// frames, y con CLIP asigna a cada concepto (de los que tienen `urls`) su mejor momento DISTINTO
// (sin solapar, gap ≥ MINGAP). Decenas de clips reales de pocos documentales. $0, local, GPU.
//
// Uso:  node docextract.mjs <slug>   (lee public/broll/match_<slug>.json, conceptos con urls)
//   escribe/mergea  public/broll/clips_<slug>_matched.json   → luego fetch_clips.mjs
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { pipeline } from "@huggingface/transformers";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node docextract.mjs <slug>"); process.exit(1); }
const YTDLP = path.join(process.cwd(), "bin", "yt-dlp.exe");
const FFDIR = path.join(process.cwd(), "node_modules", "@remotion", "compositor-win32-x64-msvc");
const FF = path.join(FFDIR, "ffmpeg.exe");
const STEP = +(process.env.DOC_STEP || 4);        // 1 frame cada STEP seg
const MINGAP = +(process.env.DOC_MINGAP || 12);   // gap mín entre clips del mismo doc
const DUR = +(process.env.DOC_DUR || 6);
const HEAD = 8, TAILFRAC = 0.04;                  // saltea intro/outro
const DOCS = "_docs";
fs.mkdirSync(DOCS, { recursive: true });
const vidId = (u) => (u.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/) || u.match(/([A-Za-z0-9_-]{11})/) || [])[1];

const beats = JSON.parse(fs.readFileSync(`public/broll/match_${slug}.json`, "utf8")).filter((b) => b.urls && b.urls.length);
if (!beats.length) { console.error("no hay conceptos con urls en el match list"); process.exit(1); }
const docUrls = [...new Set(beats.flatMap((b) => b.urls))];
console.log(`${beats.length} conceptos · ${docUrls.length} documentales fuente`);

// 1) bajar cada doc UNA vez @240p (cache) + extraer frames
const dlFull = (url, id) => {
  const out = path.join(DOCS, `${id}.mp4`);
  if (fs.existsSync(out) && fs.statSync(out).size > 200000) return out;
  console.log(`  ↓ bajando doc ${id} ...`);
  const r = spawnSync(YTDLP, [url, "-f", "bv*[height<=240]/wv*/w", "--ffmpeg-location", FFDIR,
    "--merge-output-format", "mp4", "--no-playlist", "-o", out, "--force-overwrites", "--quiet", "--no-warnings"],
    { encoding: "utf8", timeout: 600000 });
  return (r.status === 0 && fs.existsSync(out)) ? out : null;
};
const probeDur = (file) => {
  const r = spawnSync(path.join(FFDIR, "ffprobe.exe"), ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" });
  return Math.floor(+(r.stdout || "0").trim() || 0);
};
const extractAll = (file, id) => {
  const fdir = path.join(DOCS, `${id}_f`);
  if (fs.existsSync(fdir) && fs.readdirSync(fdir).length > 5) {
    const dur = probeDur(file);
    return fs.readdirSync(fdir).filter((f) => f.endsWith(".png")).sort().map((f, i) => ({ file: path.join(fdir, f), t: +(HEAD + i * STEP).toFixed(1) }));
  }
  fs.rmSync(fdir, { recursive: true, force: true }); fs.mkdirSync(fdir, { recursive: true });
  const dur = probeDur(file);
  const end = Math.floor(dur * (1 - TAILFRAC));
  const maxF = Math.max(4, Math.floor((end - HEAD) / STEP));
  spawnSync(FF, ["-y", "-ss", String(HEAD), "-i", file, "-r", String(1 / STEP), "-frames:v", String(maxF), path.join(fdir, "f%04d.png")], { encoding: "utf8" });
  return fs.readdirSync(fdir).filter((f) => f.endsWith(".png")).sort().map((f, i) => ({ file: path.join(fdir, f), t: +(HEAD + i * STEP).toFixed(1) }));
};

const docFrames = {};
for (const url of docUrls) {
  const id = vidId(url);
  const file = dlFull(url, id);
  if (!file) { console.log(`  ✗ no pude bajar ${id}`); docFrames[id] = []; continue; }
  const fr = extractAll(file, id);
  docFrames[id] = fr.map((f) => ({ ...f, id, url }));
  console.log(`  ✓ ${id}: ${fr.length} frames`);
}

// 2) CLIP
const MODEL = process.env.MATCH_MODEL || "Xenova/clip-vit-base-patch32";
const DEVICE = process.env.MATCH_DEVICE || "dml";
console.log(`cargando CLIP (${MODEL}, ${DEVICE.toUpperCase()})...`);
let clf;
try { clf = await pipeline("zero-shot-image-classification", MODEL, { device: DEVICE, dtype: DEVICE === "cpu" ? "q8" : "fp32" }); }
catch { clf = await pipeline("zero-shot-image-classification", MODEL, { dtype: "q8" }); }
const TEXT_LABELS = ["a title card or large bold text overlay", "big subtitles or captions on screen", "a channel logo or watermark"];

// 3) puntuar: por cada frame de cada doc, score contra los conceptos ruteados a ESE doc
const cand = {}; // name -> [{id,url,t,score}]
for (const b of beats) cand[b.name] = [];
let scored = 0;
for (const id of Object.keys(docFrames)) {
  const frames = docFrames[id];
  if (!frames.length) continue;
  const here = beats.filter((b) => b.urls.map(vidId).includes(id));
  const labels = here.map((b) => b.concept);
  for (const fr of frames) {
    let out;
    try { out = await clf(fr.file, [...labels, ...TEXT_LABELS]); } catch { continue; }
    const get = (l) => out.find((o) => o.label === l)?.score || 0;
    const textMax = Math.max(...TEXT_LABELS.map(get));
    const pen = textMax <= 0.10 ? 1 : textMax >= 0.30 ? 0.10 : 1 - ((textMax - 0.10) / 0.20) * 0.90;
    for (const b of here) cand[b.name].push({ id, url: fr.url, t: fr.t, score: get(b.concept) * pen });
    scored++;
    if (scored % 200 === 0) process.stdout.write(`  ...${scored} frames puntuados\n`);
  }
}

// 4) asignación greedy global: mejor (concepto,doc,t) primero, sin repetir concepto, gap por doc
const usedTs = {}; // id -> [t]
const near = (id, t) => (usedTs[id] || []).some((u) => Math.abs(u - t) < MINGAP);
const all = [];
for (const name of Object.keys(cand)) for (const c of cand[name]) all.push({ name, ...c });
all.sort((a, b) => b.score - a.score);
const assigned = {};
for (const c of all) {
  if (assigned[c.name]) continue;
  if (near(c.id, c.t)) continue;
  assigned[c.name] = c;
  (usedTs[c.id] = usedTs[c.id] || []).push(c.t);
}

// 5) merge a clips_<slug>_matched.json
const outPath = `public/broll/clips_${slug}_matched.json`;
const prev = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, "utf8")) : [];
const prevNames = new Set(prev.map((p) => p.name));
let added = 0;
for (const name of Object.keys(assigned)) {
  if (prevNames.has(name)) continue;
  const a = assigned[name];
  prev.push({ name, url: a.url, start: Math.max(0, +(a.t - 1).toFixed(1)), dur: DUR, _score: +a.score.toFixed(3) });
  added++;
}
fs.writeFileSync(outPath, JSON.stringify(prev, null, 2));
const miss = beats.filter((b) => !assigned[b.name]).map((b) => b.name);
console.log(`\n✅ asignados ${Object.keys(assigned).length}/${beats.length} · agregados ${added} a ${outPath}`);
if (miss.length) console.log(`sin asignar: ${miss.join(", ")}`);
console.log(`Luego: node fetch_clips.mjs ${outPath}`);
