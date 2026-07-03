// match_v3/3_assemble.mjs — elecciones del juez + beats → clips_<slug>_matched.json.
// Formato IDÉNTICO al de match_sb (name, concept, url, start, dur, _score, _sb) para que
// fetch_clips lo baje y `match_sb --refine` afine el segundo igual que siempre.
// picks.json (lo escribe el agente-juez): { "<beat>": {id, ts, reason?} | {src:"stock"|"photo"} | {skip:true} }
//
// Uso: node match_v3/3_assemble.mjs <beatsAutorados.json> <picks.json> <matchedOut.json>
import fs from "fs";

const [beatsArg, picksArg, outArg] = process.argv.slice(2);
if (!beatsArg || !picksArg || !outArg) { console.error("Uso: node 3_assemble.mjs <beats.json> <picks.json> <matched.json>"); process.exit(1); }
const beats = JSON.parse(fs.readFileSync(beatsArg, "utf8").replace(/^﻿/, ""));
const picks = JSON.parse(fs.readFileSync(picksArg, "utf8").replace(/^﻿/, ""));

const matched = [];
const needStock = [];   // beats a resolver por stock (Pexels/Pixabay via stockfallback.mjs)
const needPhoto = [];   // beats a resolver por foto real (still o archivo)
let skipped = 0;
for (const b of beats) {
  const p = picks[b.name] || {};
  const lead = 0;
  if (b.src === "stock" || p.src === "stock") { needStock.push({ name: b.name, concept: b.desc, dur: b.dur }); continue; }
  if (b.src === "photo" || p.src === "photo") { needPhoto.push({ name: b.name, concept: b.desc, dur: b.dur }); continue; }
  if (p.skip) { skipped++; continue; }
  if (!p.id || p.ts == null) { needStock.push({ name: b.name, concept: b.desc, dur: b.dur }); continue; } // sin elección → cae a stock
  matched.push({
    name: b.name, concept: b.desc || b.phrase, url: `https://youtu.be/${p.id}`,
    start: Math.max(0, +(+p.ts - lead).toFixed(1)), dur: b.dur,
    _score: 0.99, _sb: true, _v3: true, shot: b.shot || "", ms: b.ms,
  });
}
fs.writeFileSync(outArg, JSON.stringify(matched, null, 2));
const stem = outArg.replace(/\.json$/, "");
if (needStock.length) fs.writeFileSync(`${stem}_needstock.json`, JSON.stringify(needStock, null, 2));
if (needPhoto.length) fs.writeFileSync(`${stem}_needphoto.json`, JSON.stringify(needPhoto, null, 2));
console.log(`${matched.length} clips YouTube → ${outArg}`);
console.log(`  stock: ${needStock.length}${needStock.length ? ` → ${stem}_needstock.json` : ""}  ·  foto: ${needPhoto.length}${needPhoto.length ? ` → ${stem}_needphoto.json` : ""}  ·  skip: ${skipped}`);
console.log(`Siguiente: node scripts/fetch_clips (o fetch_parallel) → match_sb --refine ${outArg} → stockfallback para _needstock.`);
