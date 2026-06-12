// match_runner.mjs — versión FARM (cross-platform) del matcher CLIP. Corre en un
// runner de GitHub Actions: procesa un SHARD de beats (i % N === idx) del match list,
// puntúa con CLIP local y escribe out/match_part_<idx>.json. El agregador los une.
//
// Diferencias con matchclip.mjs (local Windows): usa `yt-dlp` y `ffmpeg` del PATH
// (no el .exe de bin/ ni el ffmpeg de Remotion). Todo lo demás (CLIP) es igual.
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

const TMP = "_match";
fs.mkdirSync(TMP, { recursive: true });
const vidId = (u) => (u.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/) || u.match(/([A-Za-z0-9_-]{11})/) || [])[1];

const ytSearch = (q, n = 3) => {
  const r = spawnSync(YTDLP, [`ytsearch${n}:${q}`, "--skip-download", "--no-warnings", "--print", "%(id)s"], { encoding: "utf8" });
  return (r.stdout || "").trim().split(/\r?\n/).filter(Boolean).map((id) => `https://youtu.be/${id}`);
};

const proxyFrames = (url, after, scan, step, tag) => {
  const proxy = path.join(TMP, `${tag}.mp4`);
  const a = Math.max(0, after), b = after + scan;
  const dl = spawnSync(YTDLP, [
    url, "--download-sections", `*${a}-${b}`, "--force-keyframes-at-cuts",
    "-f", "bv*[height<=240]/wv*/w", "--merge-output-format", "mp4", "--no-playlist",
    "-o", proxy, "--force-overwrites", "--quiet", "--no-warnings",
  ], { encoding: "utf8" });
  if (dl.status !== 0 || !fs.existsSync(proxy)) return [];
  const fdir = path.join(TMP, `${tag}_f`);
  fs.rmSync(fdir, { recursive: true, force: true });
  fs.mkdirSync(fdir, { recursive: true });
  const maxF = Math.ceil(scan / step) + 2;
  spawnSync(FF, ["-y", "-i", proxy, "-r", String(1 / step), "-frames:v", String(maxF), path.join(fdir, "f%04d.png")], { encoding: "utf8" });
  const files = fs.existsSync(fdir) ? fs.readdirSync(fdir).filter((f) => f.endsWith(".png")).sort() : [];
  return files.map((f, i) => ({ file: path.join(fdir, f), t: +(a + i * step).toFixed(1) }));
};

console.log("cargando CLIP...");
const clf = await pipeline("zero-shot-image-classification", "Xenova/clip-vit-base-patch32");
const DISTRACTORS = [
  "a person talking to the camera, a talking head",
  "a title screen or text overlay",
  "a channel logo or watermark",
  "a blurry or unrelated indoor scene",
];
const scoreFrame = async (file, concept) => {
  const out = await clf(file, [concept, ...DISTRACTORS]);
  const hit = out.find((o) => o.label === concept);
  return hit ? hit.score : 0;
};

const results = [];
for (const b of beats) {
  const { name, concept, dur = 6, after = 0, scan = 180, step = 2, lead = 1.0 } = b;
  const urls = b.urls || (b.query ? ytSearch(b.query, 3) : []);
  if (!urls.length) { console.log(`✗ ${name}: sin candidatos`); continue; }
  let best = { score: -1 };
  for (let i = 0; i < urls.length; i++) {
    const frames = proxyFrames(urls[i], after, scan, step, `${name}_${i}`);
    if (!frames.length) continue;
    let bf = { score: -1 };
    for (const fr of frames) {
      const s = await scoreFrame(fr.file, concept);
      if (s > bf.score) bf = { score: s, t: fr.t };
    }
    if (bf.score > best.score) best = { ...bf, url: urls[i] };
  }
  const start = Math.max(0, +(best.t - lead).toFixed(1));
  console.log(`  ${name}: ${best.score.toFixed(3)} @ ${best.t}s (${vidId(best.url || "")})`);
  results.push({ name, url: best.url, start, dur, _score: +best.score.toFixed(3) });
}

fs.mkdirSync("out", { recursive: true });
const outPath = `out/match_part_${IDX}.json`;
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(`→ ${outPath} (${results.length} beats)`);
fs.rmSync(TMP, { recursive: true, force: true });
