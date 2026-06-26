// dyncheck.mjs — GARANTIZA dinamismo CONSTANTE de punta a punta (lección barcos: la misma
// energía/densidad del minuto 1 al final, nunca aflojar en la 2ª mitad). Divide el video en
// ventanas de 60s y reporta: cortes (clips) por minuto, componentes por minuto, y la toma
// sostenida más larga de cada minuto. Frena (exit 1) si algún minuto está flojo.
//   node scripts/dyncheck.mjs <slug>
import fs from "fs";
const slug = process.argv[2];
if (!slug) { console.error("Uso: node scripts/dyncheck.mjs <slug>"); process.exit(1); }
const bs = JSON.parse(fs.readFileSync(`beatsheet/${slug}.json`, "utf8"));
const beats = bs.beats;
const end = Math.max(...beats.map((b) => b.start + b.dur));
const raws = beats.filter((b) => b.kind === "raw");
const comps = beats.filter((b) => b.kind !== "raw" && !b.overlay);

// umbrales (ritmo barcos): ≥9 cortes/min, sin tomas >9s, y que ningún tramo quede sin componentes por mucho
const MIN_CUTS = +(process.env.DYN_MIN_CUTS || 9);
const MAX_HOLD = +(process.env.DYN_MAX_HOLD || 9);
const MINS = Math.ceil(end / 60);
let weak = 0, worstHold = 0;
console.log(`dyncheck ${slug} · ${(end / 60).toFixed(1)} min · ${raws.length} clips · ${comps.length} comp\n  min │ cortes │ comp │ toma+larga`);
for (let m = 0; m < MINS; m++) {
  const a = m * 60, b = (m + 1) * 60;
  const inWin = (x) => x.start < b && x.start + x.dur > a;
  const cuts = raws.filter(inWin).length;
  const cmp = comps.filter(inWin).length;
  // toma sostenida más larga (clip raw) que cae en este minuto
  const hold = Math.max(0, ...raws.filter(inWin).map((x) => x.dur));
  worstHold = Math.max(worstHold, hold);
  const bad = cuts < MIN_CUTS || hold > MAX_HOLD;
  if (bad) weak++;
  console.log(`  ${String(m + 1).padStart(3)} │ ${String(cuts).padStart(6)} │ ${String(cmp).padStart(4)} │ ${hold.toFixed(1)}s${bad ? "  ⚠" : ""}`);
}
const cpm = (raws.length / (end / 60)).toFixed(1);
console.log(`\npromedio: ${cpm} cortes/min · toma más larga del video: ${worstHold.toFixed(1)}s`);
if (weak > 0) {
  console.log(`\n❌ DINAMISMO IRREGULAR — ${weak} minuto(s) flojos (cortes<${MIN_CUTS} o toma>${MAX_HOLD}s). La energía debe ser pareja de punta a punta (lección barcos). Densificá esos tramos (más clips matcheados) o insertá componentes.`);
  process.exit(1);
}
console.log(`\n✅ dinamismo PAREJO de punta a punta — ${cpm} cortes/min, ninguna toma sostenida > ${MAX_HOLD}s.`);
