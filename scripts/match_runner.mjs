// match_runner.mjs — versión FARM (cross-platform) del matcher CLIP. Corre en un runner
// de GitHub Actions: procesa un SHARD de beats (i % N === idx) del match list, puntúa con
// CLIP local y escribe out/match_part_<idx>.json. El agregador los une.
//
// v2 — misma lógica de búsqueda mejorada que matchclip.mjs (búsqueda ancha + re-rank por
// título, escaneo del video entero coarse→fine, penalización de texto graduada). Diferencia:
// usa `yt-dlp`/`ffmpeg` del PATH (no el .exe de bin/ ni el ffmpeg de Remotion).
//
// Uso:  node scripts/match_runner.mjs <slug> <idx> <total> [matchListPath]
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { pipeline } from "@huggingface/transformers";

const [slug, idxArg, totalArg, listArg] = process.argv.slice(2);
if (!slug || idxArg == null || !totalArg) {
  console.error("Uso: node scripts/match_runner.mjs <slug> <idx> <total> [matchList]");
  process.exit(1);
}
const IDX = +idxArg, TOTAL = +totalArg;
const YTDLP = process.env.YTDLP || "yt-dlp";
const FF = process.env.FFMPEG || "ffmpeg";
const LIST = listArg || `match_${slug}.json`;
if (!fs.existsSync(LIST)) { console.error("No existe match list:", LIST); process.exit(1); }
const allBeats = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
const beats = allBeats.filter((_, i) => i % TOTAL === IDX);
console.log(`shard ${IDX}/${TOTAL}: ${beats.length} beats`);

const CANDS = +(process.env.MATCH_CANDS || 6);
const POOL = +(process.env.MATCH_POOL || 16);
const MAXSPAN = +(process.env.MATCH_MAXSPAN || 360);
const COARSE = +(process.env.MATCH_COARSE || 44);
const FINE = +(process.env.MATCH_FINE || 0.5);
const HEAD = +(process.env.MATCH_HEAD || 6);
const TAIL = 0.06;

const TMP = "_match_" + IDX; // temp PROPIO por shard → seguro para correr en paralelo (matchlocal.mjs)
fs.mkdirSync(TMP, { recursive: true });

// COOKIES de cuentas QUEMADAS (logueadas en YouTube) para esquivar el throttle. Rota por
// shard: cada uno usa una cuenta distinta de cookies/*.txt → el límite se reparte entre
// cuentas y se puede ir a full sin que YouTube marque bot. Sin carpeta cookies/ → como antes.
const cookieDir = process.env.COOKIE_DIR || "cookies";
let COOKIE = [];
try {
  const cf = fs.readdirSync(cookieDir).filter((f) => f.endsWith(".txt") && f !== "proxies.txt").sort();
  if (cf.length) { COOKIE = ["--cookies", path.join(cookieDir, cf[IDX % cf.length])]; console.log(`shard ${IDX}: cookies ${cf[IDX % cf.length]}`); }
} catch { /* sin cookies */ }
// PROXY DEDICADO al scraping (NO el de tus canales ni tu IP de casa). yt-dlp lo usa solo
// para esto. Se EMPAREJA con la cuenta: cookies/proxies.txt = 1 proxy por línea, MISMO orden
// que cookies/1.txt,2.txt… → cada cuenta sale por SU IP fija (sticky, ideal para no marcar).
// Fallback: YTPROXY (uno solo para todos). Vacío → IP local.
let PROXY = process.env.YTPROXY ? ["--proxy", process.env.YTPROXY] : [];
try {
  const px = fs.readFileSync(path.join(cookieDir, "proxies.txt"), "utf8").split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#"));
  if (px.length) { PROXY = ["--proxy", px[IDX % px.length]]; console.log(`shard ${IDX}: proxy ${px[IDX % px.length].replace(/\/\/[^@]*@/, "//***@")}`); }
} catch { /* sin proxies.txt → YTPROXY o IP local */ }
const vidId = (u) => (u.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/) || u.match(/([A-Za-z0-9_-]{11})/) || [])[1];

const STOP = new Set(("a an the of to in on at by for with and or from into is are was were be " +
  "being this that it its as close up shot footage video clip hd 4k uhd full real best top").split(/\s+/));
const kw = (s) => [...new Set((s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/)
  .filter((w) => w.length > 2 && !STOP.has(w)))];
const BAD = /(reaction|react|podcast|full episode|interview|tier list|gameplay|let'?s play|trailer|unboxing|vlog|prank)/i;

const searchRanked = (queries, concept, limit = CANDS) => {
  const want = new Set([...kw(concept), ...queries.flatMap(kw)]);
  const seen = new Map();
  for (const q of queries) {
    if (!q) continue;
    const r = spawnSync(YTDLP, [
      `ytsearch${POOL}:${q}`, "--skip-download", "--no-warnings", ...COOKIE, ...PROXY,
      "--socket-timeout", "30", "--match-filter", "duration>40 & duration<3000 & !is_live",
      "--print", "%(id)s\t%(title)s\t%(duration)s",
    ], { encoding: "utf8", maxBuffer: 1 << 26, timeout: 60000, killSignal: "SIGKILL" });
    const lines = (r.stdout || "").trim().split(/\r?\n/).filter(Boolean);
    lines.forEach((line, ri) => {
      const [id, title = "", durS = ""] = line.split("\t");
      if (!id) return;
      if (seen.has(id)) { const e = seen.get(id); e.rank = Math.min(e.rank, ri); return; }
      const t = title.toLowerCase();
      const lex = [...want].reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
      const pen = BAD.test(t) ? 3 : 0;
      seen.set(id, { url: `https://youtu.be/${id}`, id, title, dur: +durS || 0, rank: ri, lex: lex - pen });
    });
  }
  return [...seen.values()].sort((a, b) => (b.lex - a.lex) || (a.rank - b.rank)).slice(0, limit);
};

const dlProxy = (url, a, b, tag) => {
  const proxy = path.join(TMP, `${tag}.mp4`);
  // --ffmpeg-location SOLO si FFMPEG es una ruta (local: ffmpeg de Remotion). En el farm
  // FFMPEG="ffmpeg" (en el PATH) → se omite. Sin esto, yt-dlp no puede cortar la sección.
  const ffloc = /[\\/]/.test(FF) ? ["--ffmpeg-location", path.dirname(FF)] : [];
  const dl = spawnSync(YTDLP, [
    url, ...COOKIE, ...PROXY, "--socket-timeout", "30", "--download-sections", `*${Math.max(0, a)}-${b}`, "--force-keyframes-at-cuts",
    "-f", "bv*[height<=240]/wv*/w", ...ffloc, "--merge-output-format", "mp4", "--no-playlist",
    "-o", proxy, "--force-overwrites", "--quiet", "--no-warnings",
  ], { encoding: "utf8", timeout: 120000, killSignal: "SIGKILL" });
  return (dl.status === 0 && fs.existsSync(proxy)) ? proxy : null;
};
const extract = (proxy, baseT, step, maxF, tag, ss = 0) => {
  const fdir = path.join(TMP, `${tag}_f`);
  fs.rmSync(fdir, { recursive: true, force: true });
  fs.mkdirSync(fdir, { recursive: true });
  const args = ["-y"];
  if (ss > 0) args.push("-ss", String(ss));
  args.push("-i", proxy, "-r", String(1 / step), "-frames:v", String(maxF), path.join(fdir, "f%04d.png"));
  spawnSync(FF, args, { encoding: "utf8", timeout: 90000, killSignal: "SIGKILL" });
  const files = fs.existsSync(fdir) ? fs.readdirSync(fdir).filter((f) => f.endsWith(".png")).sort() : [];
  return files.map((f, i) => ({ file: path.join(fdir, f), t: +(baseT + i * step).toFixed(1) }));
};

// Default = CPU q8 (idéntico a antes, no rompe runs en curso). Opt-in GPU/modelo grande:
//   CLIP_DEVICE=dml      → corre en la GPU (DirectML, sin CUDA). Sirve p/ modelos GRANDES.
//   CLIP_MODEL=...       → modelo distinto (ej. clip-vit-large) para MÁS calidad de match.
//   CLIP_DTYPE=fp32|fp16 → precisión (en GPU default fp32, en CPU default q8).
const CLIP_MODEL = process.env.CLIP_MODEL || "Xenova/clip-vit-base-patch32";
const CLIP_DEVICE = process.env.CLIP_DEVICE || "";
const CLIP_DTYPE = process.env.CLIP_DTYPE || (CLIP_DEVICE ? "fp32" : "q8");
console.log(`cargando CLIP (${CLIP_MODEL} · ${CLIP_DEVICE || "cpu"} · ${CLIP_DTYPE})...`);
const clf = await pipeline("zero-shot-image-classification", CLIP_MODEL, CLIP_DEVICE ? { device: CLIP_DEVICE, dtype: CLIP_DTYPE } : { dtype: CLIP_DTYPE });
const DISTRACTORS = [
  "a person talking to the camera, a talking head",
  "a blurry or unrelated indoor scene",
];
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
  const penalty = textMax <= 0.10 ? 1 : textMax >= 0.30 ? 0.10 : 1 - ((textMax - 0.10) / 0.20) * 0.90;
  return c * penalty;
};

const analyze = async (cand, beat, tag) => {
  const explicitWindow = beat.after != null || beat.scan != null;
  const a0 = explicitWindow ? (beat.after ?? 0) : HEAD;
  const dur = cand.dur || 0;
  const end = explicitWindow
    ? a0 + (beat.scan ?? 180)
    : Math.min(a0 + MAXSPAN, dur ? Math.floor(dur * (1 - TAIL)) : a0 + MAXSPAN);
  const span = Math.max(2, end - a0);
  const proxy = dlProxy(cand.url, a0, end, tag);
  if (!proxy) return null;
  const coarseStep = explicitWindow ? (beat.step || 2) : Math.max(2, +(span / COARSE).toFixed(2));
  const coarse = extract(proxy, a0, coarseStep, Math.ceil(span / coarseStep) + 2, tag + "_c");
  if (!coarse.length) return null;
  let bf = { score: -1, t: a0 };
  for (const fr of coarse) { const s = await scoreFrame(fr.file, beat.concept); if (s > bf.score) bf = { score: s, t: fr.t }; }
  if (coarseStep > FINE) {
    const fa = Math.max(a0, +(bf.t - coarseStep).toFixed(2));
    const fb = Math.min(end, +(bf.t + coarseStep).toFixed(2));
    const fine = extract(proxy, fa, FINE, Math.ceil((fb - fa) / FINE) + 2, tag + "_x", fa - a0);
    for (const fr of fine) { const s = await scoreFrame(fr.file, beat.concept); if (s > bf.score) bf = { score: s, t: fr.t }; }
  }
  return { score: bf.score, t: bf.t, url: cand.url, id: cand.id };
};

const results = [];
const usedIds = new Set();
for (const b of beats) {
  const { name, concept, dur = 6, lead = 1.0 } = b;
  let cands;
  if (b.urls) cands = b.urls.map((u) => ({ url: u, id: vidId(u), title: "", dur: 0 }));
  else cands = searchRanked(Array.isArray(b.query) ? b.query : [b.query], concept);
  if (!cands.length) { console.log(`✗ ${name}: sin candidatos`); continue; }
  const scored = [];
  for (let i = 0; i < cands.length; i++) {
    const res = await analyze(cands[i], b, `${name}_${i}`);
    if (res) scored.push(res);
  }
  if (!scored.length) { console.log(`✗ ${name}: sin frames`); continue; }
  scored.sort((a, b2) => b2.score - a.score);
  let best = scored[0];
  const fresh = scored.find((c) => c.id && !usedIds.has(c.id) && c.score >= scored[0].score * 0.88);
  if (fresh) best = fresh;
  if (best.id) usedIds.add(best.id);
  const start = Math.max(0, +(best.t - lead).toFixed(1));
  console.log(`  ${name}: ${best.score.toFixed(3)} @ ${best.t}s (${best.id})`);
  results.push({ name, url: best.url, start, dur, _score: +best.score.toFixed(3) });
}

fs.mkdirSync("out", { recursive: true });
const outPath = `out/match_part_${IDX}.json`;
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(`→ ${outPath} (${results.length} beats)`);
fs.rmSync(TMP, { recursive: true, force: true });
