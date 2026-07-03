// match_v3/2_search_mosaics.mjs — beats autorados → candidatos + mosaicos de storyboard.
// Para cada beat: busca (queries ancladas, API 2 keys), rerank por título, top NCAND candidatos,
// baja NFRAG fragmentos de storyboard (hoja de contactos) como PNG con la GEOMETRÍA en el nombre:
//   <beat>__c<rank>__<id>__f<frag>__c<COLS>r<ROWS>_int<INTERVAL>_base<BASE>.png
// El agente-juez mira esos PNG y elige video+tile. ts = (base + fila*cols + col + 0.5) × interval.
//
// Uso: node match_v3/2_search_mosaics.mjs <beatsAutorados.json> <outDir> [NCAND=3] [NFRAG=2]
import fs from "fs";
import path from "path";
import { apiSearch, rerank, apiDurations, ytInfo, pickStoryboard, curl, searchStats } from "./lib.mjs";

const [beatsArg, outArg, ncArg, nfArg] = process.argv.slice(2);
if (!beatsArg || !outArg) { console.error("Uso: node 2_search_mosaics.mjs <beats.json> <outDir> [NCAND] [NFRAG]"); process.exit(1); }
const NCAND = +(ncArg || 3), NFRAG = +(nfArg || 2);
const beats = JSON.parse(fs.readFileSync(beatsArg, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(outArg, { recursive: true });

const ytBeats = beats.filter((b) => (b.src || "youtube") === "youtube" && (b.queries || []).length);
console.log(`${beats.length} beats · ${ytBeats.length} a YouTube (resto stock/foto) · NCAND=${NCAND} NFRAG=${NFRAG}`);

// 1) buscar candidatos de cada beat
const perBeat = {};
for (const b of ytBeats) {
  const rows = [];
  for (const q of b.queries) { const r = await apiSearch(q); if (r) rows.push(...r); }
  const cands = rerank(rows, b.queries, NCAND);
  perBeat[b.name] = cands;
  console.log(`  ${b.name}: ${cands.length} cands  «${b.phrase.slice(0, 50)}»`);
}
// 2) duraciones de todos los ids (batch)
const allIds = [...new Set(Object.values(perBeat).flatMap((cs) => cs.map((c) => c.id)))];
const durMap = await apiDurations(allIds);

// 3) bajar mosaicos por candidato
const manifest = {};
for (const b of ytBeats) {
  const entry = { phrase: b.phrase, desc: b.desc, shot: b.shot || "", ms: b.ms, dur: b.dur, candidates: [] };
  let ci = 0;
  for (const cand of perBeat[b.name]) {
    ci++;
    const info = ytInfo(cand.id);
    if (!info) { console.log(`    ${b.name} c${ci} ${cand.id}: sin -J`); continue; }
    const sb = pickStoryboard(info);
    const duration = info.duration || durMap.get(cand.id) || 0;
    if (!sb || !duration) { console.log(`    ${b.name} c${ci} ${cand.id}: sin storyboard`); continue; }
    const interval = duration / (sb.columns * sb.rows * sb.fragments.length);
    const frags = [];
    for (let fi = 0; fi < Math.min(NFRAG, sb.fragments.length); fi++) {
      const base = fi * sb.columns * sb.rows;
      const fn = `${b.name}__c${ci}__${cand.id}__f${fi}__c${sb.columns}r${sb.rows}_int${interval.toFixed(1)}_base${base}.png`;
      if (curl(sb.fragments[fi].url, path.join(outArg, fn))) frags.push(fn);
    }
    if (frags.length) entry.candidates.push({ rank: ci, id: cand.id, title: cand.title, cols: sb.columns, rows: sb.rows, interval: +interval.toFixed(2), duration, frags });
  }
  manifest[b.name] = entry;
  console.log(`  ${b.name}: ${entry.candidates.length} cands con mosaico`);
}
fs.writeFileSync(path.join(outArg, "_manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`\nqueries únicas (≈ búsquedas API): ${searchStats().uniqueQueries}`);
console.log(`→ ${path.join(outArg, "_manifest.json")} + mosaicos en ${outArg}/`);
