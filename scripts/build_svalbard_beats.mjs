// build_svalbard_beats.mjs — arma src/VideoEdit/svalbard_beats.json a partir de
// public/captions_svalbard_aligned.json (forced alignment, timestamps EXACTOS por
// palabra) + un mapeo fijo de qué imagen real le toca a cada tramo del guion.
// Uso: node scripts/build_svalbard_beats.mjs
import fs from "node:fs";

const words = JSON.parse(fs.readFileSync("public/captions_svalbard_aligned.json", "utf8"));

// cuántas palabras de `words` le tocan a cada beat, en orden, y qué foto real usa.
// (mapeado a mano contra el guion de transcript_svalbard.txt — cada imagen es la
// foto REAL más on-topic para ESE tramo, no relleno genérico.)
const PLAN = [
  { count: 18, img: "real/svb_town_wide_1.jpg" }, // remote island / northernmost town / Longyearbyen, Svalbard
  { count: 28, img: "real/svb_bear_sign_1.jpg" }, // snowmobiles / rifle / polar bears roam the streets
  { count: 14, img: "real/svb_street_1.jpg" }, // strangest rule / illegal to die in Longyearbyen
  { count: 9, img: "real/svb_graveyard_1.jpg" }, // permafrost never thaws / bodies never decompose
  { count: 18, img: "real/svb_graveyard_2.jpg" }, // 1918 flu virus survived frozen in the graves
  { count: 11, img: "real/svb_mountains_1.jpg" }, // gravely ill flown to mainland Norway
  { count: 10, img: "real/svb_graveyard_1.jpg" }, // no new burials for over seventy years
  { count: 15, img: "real/svb_mountains_2.jpg" }, // built entirely around survival, edge of the map
];

const totalPlanned = PLAN.reduce((s, p) => s + p.count, 0);
if (totalPlanned !== words.length) {
  console.error(`Descuadre: PLAN suma ${totalPlanned} palabras pero el aligned tiene ${words.length}. Revisar transcript_svalbard.txt vs PLAN.`);
  process.exit(1);
}

let i = 0;
const beats = PLAN.map(({ count, img }) => {
  const slice = words.slice(i, i + count);
  i += count;
  return {
    img,
    startMs: slice[0].startMs,
    endMs: slice[slice.length - 1].endMs,
    words: slice.map((w) => ({ t: w.text.trim(), s: w.startMs, e: w.endMs })),
  };
});

const audioEnd = beats[beats.length - 1].endMs;
const out = { audioEnd, total: audioEnd + 500, beats };
fs.writeFileSync("src/VideoEdit/svalbard_beats.json", JSON.stringify(out, null, 2));
console.log(`OK -> src/VideoEdit/svalbard_beats.json (${beats.length} beats, ${words.length} palabras, ${(audioEnd / 1000).toFixed(1)}s)`);
