// match_v3/5_apply_verdicts.mjs — aplica los veredictos del agente VERIFICADOR.
// verdicts.json (lo escribe el verificador): { "<beat>": {"ok":true} | {"ok":false,"action":"stock"|"retry","reason":"..."} }
// Deja en el matched.json SOLO los clips aprobados; los reprobados van a _reject.json (para stock
// o para re-matchear con el próximo candidato). NO borra los .mp4 (por si se quiere revisar).
//
// Uso: node match_v3/5_apply_verdicts.mjs <matched.json> <verdicts.json> [matchedOut.json]
import fs from "fs";

const [matchedArg, verdArg, outArg] = process.argv.slice(2);
if (!matchedArg || !verdArg) { console.error("Uso: node 5_apply_verdicts.mjs <matched.json> <verdicts.json> [out.json]"); process.exit(1); }
const out = outArg || matchedArg;
const clips = JSON.parse(fs.readFileSync(matchedArg, "utf8").replace(/^﻿/, ""));
const verdicts = JSON.parse(fs.readFileSync(verdArg, "utf8").replace(/^﻿/, ""));

const keep = [], reject = [];
for (const c of clips) {
  const v = verdicts[c.name];
  if (!v || v.ok) keep.push(c);                       // sin veredicto = se conserva (no castigar por falta de dato)
  else reject.push({ name: c.name, concept: c.concept, dur: c.dur, action: v.action || "stock", reason: v.reason || "" });
}
fs.writeFileSync(out, JSON.stringify(keep, null, 2));
const stem = out.replace(/\.json$/, "");
if (reject.length) fs.writeFileSync(`${stem}_reject.json`, JSON.stringify(reject, null, 2));
const nStock = reject.filter((r) => r.action !== "retry").length;
const nRetry = reject.filter((r) => r.action === "retry").length;
console.log(`aprobados: ${keep.length}/${clips.length} → ${out}`);
console.log(`  reprobados: ${reject.length} (${nStock} a stock, ${nRetry} a re-matchear)${reject.length ? ` → ${stem}_reject.json` : ""}`);
reject.forEach((r) => console.log(`   ✗ ${r.name} [${r.action}] ${r.reason}`));
