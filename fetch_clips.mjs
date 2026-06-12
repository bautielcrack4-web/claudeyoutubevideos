// fetch_clips.mjs — baja TRAMOS CORTOS de videos de YouTube (b-roll real específico
// al guión), recortando solo el segmento pedido (no el video entero). Estilo de los
// canales faceless: clip real de otro creador → recorte → tu narración encima.
//
// ⚠ Zona gris de copyright: es metraje de terceros. Útil para probar; revisá antes
//    de monetizar en serio.
//
// Requisitos (ya en el repo): bin/yt-dlp.exe + el ffmpeg de Remotion (n7.1).
//
// Lista de tomas — public/broll/clips_<video>.json:
//   [
//     { "name":"vaca_bosta",  "url":"https://youtu.be/XXXX", "start":"00:01:12", "dur":6 },
//     { "name":"lombrices",   "url":"https://youtu.be/YYYY", "find":"worm",      "dur":7 },
//     { "name":"compost",     "url":"https://youtu.be/ZZZZ", "find":["dig","spade"], "dur":8, "lead":1.5 }
//   ]
//   · start = segundos (número) o "HH:MM:SS" / "MM:SS"  (momento fijo)
//   · find  = palabra(s) clave → ★ ubica el momento EXACTO usando los SUBTÍTULOS del
//            video fuente (cuando el creador DICE la acción, casi siempre la MUESTRA).
//            Mucho más preciso que un start al azar. Si encuentra, IGNORA `start`.
//   · lead  = segundos a arrancar ANTES de la palabra hallada (default 1.2)
//   · dur   = segundos del recorte
//
// Variables de entorno:
//   FORCE=1  → re-baja aunque el archivo ya exista (útil al corregir starts/find).
//
// Uso:
//   node fetch_clips.mjs [clips_<video>.json=public/broll/clips_estiercol.json] [outDir=public/broll]
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const YTDLP = path.join(process.cwd(), "bin", "yt-dlp.exe");
const FFDIR = path.join(process.cwd(), "node_modules", "@remotion", "compositor-win32-x64-msvc");
const FORCE = process.env.FORCE === "1";

const [listArg, outArg] = process.argv.slice(2);
const LIST = listArg || "public/broll/clips_estiercol.json";
const OUT = outArg || "public/broll";
const SUBDIR = path.join(OUT, "_subs");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(SUBDIR, { recursive: true });

if (!fs.existsSync(YTDLP)) {
  console.error("Falta bin/yt-dlp.exe");
  process.exit(1);
}
if (!fs.existsSync(LIST)) {
  console.error("No existe la lista:", LIST);
  process.exit(1);
}
const clips = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));

// "HH:MM:SS" | "MM:SS" | número → segundos
const toSec = (v) => {
  if (typeof v === "number") return v;
  const parts = String(v).split(":").map(Number);
  return parts.reduce((acc, p) => acc * 60 + p, 0);
};
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const vidId = (url) => {
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/) || url.match(/([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};

// VTT "HH:MM:SS.mmm" → segundos
const vttToSec = (t) => {
  const m = t.match(/(\d{2}):(\d{2}):(\d{2})[.,](\d{3})/);
  if (!m) return null;
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000;
};

// baja (una vez por id) los subs y devuelve [{start, text}]
const subsCache = new Map();
const getSubs = (url) => {
  const id = vidId(url);
  if (!id) return [];
  if (subsCache.has(id)) return subsCache.get(id);
  // ¿ya están en disco?
  let vtt = fs.readdirSync(SUBDIR).find((f) => f.startsWith(id) && f.endsWith(".vtt"));
  if (!vtt) {
    spawnSync(YTDLP, [
      url, "--skip-download", "--write-auto-subs", "--write-subs",
      "--sub-langs", "en.*,es.*", "--sub-format", "vtt", "--convert-subs", "vtt",
      "--no-playlist", "-o", path.join(SUBDIR, "%(id)s.%(ext)s"),
      "--quiet", "--no-warnings",
    ], { encoding: "utf8" });
    vtt = fs.readdirSync(SUBDIR).find((f) => f.startsWith(id) && f.endsWith(".vtt"));
  }
  if (!vtt) { subsCache.set(id, []); return []; }
  const raw = fs.readFileSync(path.join(SUBDIR, vtt), "utf8");
  const cues = [];
  const blocks = raw.split(/\r?\n\r?\n/);
  for (const b of blocks) {
    const lines = b.split(/\r?\n/);
    const tl = lines.find((l) => l.includes("-->"));
    if (!tl) continue;
    const start = vttToSec(tl.split("-->")[0].trim());
    if (start == null) continue;
    const text = lines.filter((l) => !l.includes("-->") && !/^WEBVTT|^\d+$|^Kind:|^Language:/.test(l))
      .join(" ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (text) cues.push({ start, text });
  }
  subsCache.set(id, cues);
  return cues;
};

// ubica el primer momento (después de `after` seg) donde se dice alguna keyword
const findMoment = (url, find, lead, after = 0) => {
  const keys = (Array.isArray(find) ? find : [find]).map(norm);
  const cues = getSubs(url);
  for (const c of cues) {
    if (c.start < after) continue; // saltea intro/menciones tempranas
    const t = norm(c.text);
    if (keys.some((k) => t.includes(k))) return Math.max(0, c.start - lead);
  }
  return null;
};

let ok = 0, fail = 0, refound = 0;
for (const c of clips) {
  const { name, url, dur = 6, find, lead = 1.2, after = 0 } = c;
  if (!name || !url) { console.warn("Toma inválida:", JSON.stringify(c)); continue; }
  const dest = path.join(OUT, `${name}.mp4`);
  if (fs.existsSync(dest) && !FORCE) { console.log(`• ${name}  (ya existe, salteo)`); ok++; continue; }

  let s = toSec(c.start ?? 0);
  let how = "start";
  if (find) {
    const m = findMoment(url, find, lead, after);
    if (m != null) { s = +m.toFixed(2); how = `find:"${Array.isArray(find) ? find.join("|") : find}"`; refound++; }
    else how = `start (find sin subs/match)`;
  }
  const e = s + toSec(dur);
  process.stdout.write(`• ${name}  ${url}  [${s}s → ${e.toFixed(1)}s · ${how}] … `);

  const args = [
    url,
    "--download-sections", `*${s}-${e}`,
    "--force-keyframes-at-cuts",
    "-f", "bv*[height<=1080]+ba/b[height<=1080]/b",
    "--ffmpeg-location", FFDIR,
    "--merge-output-format", "mp4",
    "--no-playlist",
    "-o", dest,
    "--force-overwrites",
    "--quiet", "--no-warnings",
  ];
  const r = spawnSync(YTDLP, args, { encoding: "utf8" });
  if (r.status === 0 && fs.existsSync(dest)) {
    const kb = (fs.statSync(dest).size / 1024).toFixed(0);
    console.log(`✓ broll/${name}.mp4  (${kb} KB)`);
    ok++;
  } else {
    console.log(`✗ ${(r.stderr || "").trim().split("\n").slice(-1)[0] || "error"}`);
    fail++;
  }
}
console.log(`\n=== ${ok} OK · ${fail} fallos · ${refound} ubicados por subtítulos ===  → ${OUT}`);
