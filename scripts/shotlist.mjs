// shotlist.mjs — GENERADOR DE "HOJA DE PLANOS" con CONTEXTO para autorear clips con sentido.
// Razón: el matcher encuentra exactamente lo que se le describe (el `concept`). Si el concept
// sale de la frase ancla SOLA, pierde el contexto (ej. "mojar el techo" cuando dos oraciones
// antes se dijo "con aceite de linaza" → el clip tiene que ser ACEITE sobre el techo, no agua).
// Esta herramienta corta el guion en beats de ~4-5s en límites de frase REALES y, al lado de
// cada beat, imprime el CONTEXTO (2 oraciones antes y 1 después) para que al escribir el
// concept se resuelva el sujeto activo. Salida: shotlist_<slug>.txt (worksheet para llenar).
//
// Uso:  node scripts/shotlist.mjs <slug> [segObjetivo=4.5]
import fs from "fs";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node scripts/shotlist.mjs <slug> [segObjetivo]"); process.exit(1); }
const TARGET = Number(process.argv[3]) || 4.5;
const caps = JSON.parse(fs.readFileSync(`public/captions_${slug}.json`, "utf8"));
const fmt = (s) => { const m = Math.floor(s / 60), x = Math.round(s % 60); return m + ":" + String(x).padStart(2, "0"); };

// 1) reconstruir ORACIONES (con su rango de tiempo) para el contexto
const sentences = [];
let cur = { text: "", start: caps[0].startMs / 1000, end: 0 };
for (const w of caps) {
  cur.text += (cur.text ? " " : "") + w.text;
  cur.end = w.endMs / 1000;
  if (/[.?!]$/.test(w.text.trim())) { sentences.push(cur); cur = { text: "", start: w.endMs / 1000, end: 0 }; }
}
if (cur.text) sentences.push(cur);
const sentAt = (t) => sentences.findIndex((s) => t >= s.start - 1e-6 && t < s.end + 1e-6);

// 2) límites de FRASE (puntuación o gap) = candidatos a corte de beat
const bounds = [];
for (let i = 0; i < caps.length; i++) {
  const prev = caps[i - 1];
  const punct = prev ? /[.,;:!?…"]$/.test(prev.text.trim()) : true;
  const gap = prev ? caps[i].startMs - prev.endMs : 9999;
  if (i === 0 || punct || gap > 200) bounds.push(caps[i].startMs / 1000);
}

// 3) agrupar frases consecutivas hasta ~TARGET seg → beats
const beats = [];
let bStart = bounds[0], bText = "";
let wi = 0;
for (let b = 0; b < bounds.length; b++) {
  const segStart = bounds[b], segEnd = b + 1 < bounds.length ? bounds[b + 1] : caps[caps.length - 1].endMs / 1000;
  // texto del tramo
  let txt = "";
  while (wi < caps.length && caps[wi].startMs / 1000 < segEnd - 1e-6) { if (caps[wi].startMs / 1000 >= segStart - 1e-6) txt += (txt ? " " : "") + caps[wi].text; wi++; }
  if (!bText) bStart = segStart;
  bText += (bText ? " " : "") + txt;
  const dur = segEnd - bStart;
  if (dur >= TARGET || b === bounds.length - 1) { beats.push({ start: bStart, text: bText.trim() }); bText = ""; }
}

// 4) emitir worksheet con CONTEXTO
const out = [];
out.push(`# SHOT LIST — ${slug}  (${beats.length} beats, objetivo ~${TARGET}s)`);
out.push(`# Para cada beat: leé el CONTEXTO y escribí el concept RESUELTO (sujeto+acción+objeto+material/herramienta+lugar).`);
out.push(`# Regla: el concept describe lo que la CÁMARA debe VER dado lo último que se dijo. NUNCA la palabra literal.`);
out.push("");
for (let i = 0; i < beats.length; i++) {
  const bt = beats[i];
  const si = Math.max(0, sentAt(bt.start));
  const ctxPrev = sentences.slice(Math.max(0, si - 2), si).map((s) => s.text).join(" ");
  const ctxNext = sentences[si + 1] ? sentences[si + 1].text : "";
  out.push(`[${fmt(bt.start)}]  «${bt.text}»`);
  out.push(`   contexto: …${ctxPrev}  >>>  ${ctxNext}…`);
  out.push(`   concept: `);
  out.push(`   query  : `);
  out.push("");
}
const file = `shotlist_${slug}.txt`;
fs.writeFileSync(file, out.join("\n"));
console.log(`✓ ${file} — ${beats.length} beats con contexto. Llená concept/query mirando el contexto.`);
