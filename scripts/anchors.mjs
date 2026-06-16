// anchors.mjs — convierte captions_<slug>.json (palabra-por-palabra) en ANCLAS de
// FRASE con timestamp, para diseñar el beatsheet pegado al ms real de la narración.
// Una frase corta = un beat candidato. Rompe por fin de oración (. ! ? …) y también
// por coma/largo si la oración se hace muy larga (para que ningún beat dure 12s+).
//
//   node scripts/anchors.mjs <slug> [fromSec] [toSec]
//   → imprime [mm:ss.cc dur] texto   y escribe beatsheet/_<slug>_anchors.json
import fs from "fs";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node scripts/anchors.mjs <slug> [fromSec] [toSec]"); process.exit(1); }
const FROM = process.argv[3] != null ? +process.argv[3] : 0;
const TO = process.argv[4] != null ? +process.argv[4] : Infinity;

const caps = JSON.parse(fs.readFileSync(`public/captions_${slug}.json`, "utf8"));
const MAXW = +(process.env.ANCHOR_MAXW || 14);   // máx palabras por frase antes de cortar en coma
const MAXMS = +(process.env.ANCHOR_MAXMS || 7000); // máx duración por frase

const phrases = [];
let cur = null;
const flush = () => { if (cur && cur.text.trim()) phrases.push(cur); cur = null; };
for (const w of caps) {
  const t = (w.text || "");
  if (!cur) cur = { start: w.startMs, end: w.endMs, text: "", n: 0 };
  cur.text += t;
  cur.end = w.endMs;
  cur.n++;
  const endsSentence = /[.!?…]["')]?\s*$/.test(t);
  const longSoftBreak = (cur.n >= MAXW || cur.end - cur.start >= MAXMS) && /[,;:]\s*$/.test(t);
  if (endsSentence || longSoftBreak) flush();
}
flush();

const fmt = (ms) => { const s = ms / 1000, m = Math.floor(s / 60); return `${String(m).padStart(2, "0")}:${(s - m * 60).toFixed(2).padStart(5, "0")}`; };
const out = phrases
  .filter((p) => p.end / 1000 >= FROM && p.start / 1000 <= TO)
  .map((p) => ({ start: +(p.start / 1000).toFixed(2), dur: +((p.end - p.start) / 1000).toFixed(2), text: p.text.trim() }));

for (const p of out) console.log(`[${fmt(p.start * 1000)}  ${p.dur.toFixed(1)}s]  ${p.text}`);
fs.writeFileSync(`beatsheet/_${slug}_anchors.json`, JSON.stringify(out, null, 1));
console.log(`\n=== ${out.length} frases (${FROM}-${TO === Infinity ? "fin" : TO}s) → beatsheet/_${slug}_anchors.json ===`);
