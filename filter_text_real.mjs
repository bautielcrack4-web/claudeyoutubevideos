// filter_text_real.mjs — detecta imágenes reales con TEXTO QUEMADO (miniaturas de
// YouTube, carteles) usando el CLIP local (mismo modelo que match_runner) y las saca
// a public/real/_quarantine/ para que el build no las use. El usuario odia el texto
// quemado. Uso:  node filter_text_real.mjs <slug> [thr=0.30] [--apply]
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "@huggingface/transformers";

const slug = process.argv[2] || "abono";
const THR = parseFloat(process.argv.find((a) => /^\d?\.\d+$/.test(a)) || "0.30");
const APPLY = process.argv.includes("--apply");
const dir = "public/real";
const qdir = path.join(dir, "_quarantine");
const files = fs.readdirSync(dir).filter((f) => new RegExp(`^${slug}_.*\\.(jpg|jpeg|png|webp)$`, "i").test(f));
console.log(`${files.length} imágenes · thr=${THR} · ${APPLY ? "APLICAR (mover)" : "DRY-RUN"}`);

const clf = await pipeline("zero-shot-image-classification", "Xenova/clip-vit-base-patch32", { dtype: "q8" });
const CLEAN = "a clean documentary photograph of garden soil, food, hands or plants with no text";
const TEXT_LABELS = [
  "a title card or large bold text overlay across the screen",
  "a youtube thumbnail with big bold text and arrows",
  "big subtitles or captions text on screen",
  "an infographic or diagram with labels and words",
];
let texty = 0; const bad = [];
for (const f of files) {
  try {
    const out = await clf(path.join(dir, f), [CLEAN, ...TEXT_LABELS]);
    const get = (l) => out.find((o) => o.label === l)?.score || 0;
    const tmax = Math.max(...TEXT_LABELS.map(get));
    const clean = get(CLEAN);
    if (tmax > THR && tmax > clean) { texty++; bad.push([f, +tmax.toFixed(2)]); }
  } catch (e) { console.warn("✗", f, e.message); }
}
bad.sort((a, b) => b[1] - a[1]);
console.log(`\nCON TEXTO: ${texty}/${files.length} (${Math.round(100 * texty / files.length)}%)`);
console.log(bad.slice(0, 40).map(([f, s]) => `  ${s}  ${f}`).join("\n"));
if (APPLY && bad.length) {
  fs.mkdirSync(qdir, { recursive: true });
  for (const [f] of bad) fs.renameSync(path.join(dir, f), path.join(qdir, f));
  console.log(`\n→ ${bad.length} movidas a ${qdir}`);
}
