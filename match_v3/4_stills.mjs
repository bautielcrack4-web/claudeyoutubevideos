// match_v3/4_stills.mjs — saca stills REALES de cada clip ya bajado, para que el agente
// VERIFICADOR confirme que el footage final (no la miniatura de storyboard) muestra la acción
// y está limpio. Cierra la brecha "el tile se veía bien" → "el clip real de 5s sirve".
//
// Corre DESPUÉS de fetch_clips (que deja public/broll/<name>.mp4). Saca 3 stills por clip
// (inicio/medio/fin de la ventana) a _v3_<slug>_stills/<name>_s{1,2,3}.jpg + un índice.
//
// Uso: node match_v3/4_stills.mjs <matched.json> <outDir> [brollDir=public/broll]
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { FF } from "./lib.mjs";

const [matchedArg, outArg, brollArg] = process.argv.slice(2);
if (!matchedArg || !outArg) { console.error("Uso: node 4_stills.mjs <matched.json> <outDir> [brollDir]"); process.exit(1); }
const BROLL = brollArg || "public/broll";
const clips = JSON.parse(fs.readFileSync(matchedArg, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(outArg, { recursive: true });

const grab = (src, t, dest) => {
  const r = spawnSync(FF, ["-y", "-hide_banner", "-loglevel", "error", "-ss", String(t), "-i", src, "-frames:v", "1", "-q:v", "3", dest], { encoding: "utf8", timeout: 30000 });
  return r.status === 0 && fs.existsSync(dest);
};

const index = {};
let ok = 0, miss = 0;
for (const c of clips) {
  const src = path.join(BROLL, `${c.name}.mp4`);
  if (!fs.existsSync(src)) { miss++; console.log(`  ✗ ${c.name}: no bajado`); continue; }
  const dur = c.dur || 6;
  // el clip local ya está recortado a [start, start+dur] → tomo dentro de 0..dur
  const times = [Math.min(0.5, dur * 0.15), dur * 0.5, Math.max(dur - 0.5, dur * 0.85)];
  const stills = [];
  times.forEach((t, i) => { const fn = `${c.name}_s${i + 1}.jpg`; if (grab(src, t.toFixed(2), path.join(outArg, fn))) stills.push(fn); });
  if (stills.length) { index[c.name] = { desc: c.concept, phrase: c.phrase || "", shot: c.shot || "", url: c.url, stills }; ok++; }
}
fs.writeFileSync(path.join(outArg, "_stills.json"), JSON.stringify(index, null, 2));
console.log(`stills de ${ok} clips (${miss} sin bajar) → ${outArg}/  + _stills.json`);
console.log(`Siguiente: agente VERIFICADOR (Haiku, visión) mira los stills → veredictos → 5_apply_verdicts.mjs`);
