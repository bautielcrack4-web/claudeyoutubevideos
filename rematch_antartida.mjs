// rematch_antartida.mjs — el footage específico de Antártida casi todo viene con logo de
// canal, así que NO_WATERMARK lo rechaza. Re-escribe TODAS las queries a genéricas LIMPIAS
// (hielo/glaciar/océano/cuevas/expedición/náutico) por sección → hay mucho clip limpio de eso.
// Mantiene el concept original (lo usa el CLIP para rankear). → match_antartidaB.json
import fs from "fs";
const all = JSON.parse(fs.readFileSync("public/broll/match_antartida.json", "utf8"));
const sec = (n) => { for (const k of ["vk", "mg", "pi", "ge", "cv", "rd", "hj", "cl"]) if (n.startsWith(k + "_")) return k; return "intro"; };

const BROAD = {
  intro: ["antarctica ice aerial drone", "glacier ice landscape", "vast ice sheet snow", "polar snow storm", "ice cliff blue"],
  vk: ["dark underwater deep", "ice drilling core", "glacier ice blue", "microbes microscope cells", "deep dark water"],
  mg: ["compass needle close", "science instrument lab", "researcher on ice field", "snow field scientist", "magnetic field abstract"],
  pi: ["snowy mountain peak sharp", "pyramid shaped mountain", "triangular peak snow", "mountain ridge ice", "remote peak fog"],
  ge: ["earth from satellite", "world map screen", "aerial snow terrain", "drone over ice", "globe spinning space"],
  cv: ["blue ice cave interior", "glacier cave tunnel", "ice cave light", "volcano steam snow", "cave explorer headlamp"],
  rd: ["radar screen monitor", "survey aircraft flying", "research plane snow", "sonar radar display", "airplane over ice aerial"],
  hj: ["navy ships ocean fleet", "icebreaker ship ice", "old ship sea waves", "warship sailing ocean", "ship deck crew sea"],
  cl: ["antarctica cinematic aerial", "epic ice landscape", "desert sand dunes aerial", "blue ice cave", "polar light sky"],
};

const out = [];
for (const a of all) {
  const k = sec(a.name);
  const broad = BROAD[k];
  const h = [...a.name].reduce((x, c) => x + c.charCodeAt(0), 0);
  const picks = [broad[h % broad.length], broad[(h + 2) % broad.length], broad[(h + 4) % broad.length], broad[(h + 1) % broad.length]];
  out.push({ name: a.name, query: [...new Set(picks)], concept: a.concept, dur: a.dur });
}
fs.writeFileSync("public/broll/match_antartidaB.json", JSON.stringify(out, null, 1));
console.log(`re-match LIMPIO: ${out.length} conceptos → match_antartidaB.json (queries genéricas)`);
