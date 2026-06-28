// qc_clean_gallinas.mjs — detecta b-roll con texto/logo quemado y arma la lista a reemplazar por IA.
// clips: usa _text del matcher (>0.30). web (real/*.jpg): corre CLIP zero-shot local.
import fs from "fs";
import { pipeline } from "@huggingface/transformers";

const beats = JSON.parse(fs.readFileSync("beatsheet/gallinas.json", "utf8")).beats.filter((b) => b.kind === "raw" && b.src);
const matched = JSON.parse(fs.readFileSync("public/broll/clips_gallinas_matched.json", "utf8"));
const textOf = Object.fromEntries(matched.map((m) => [m.name, m._text || 0]));
const prompts = Object.fromEntries(JSON.parse(fs.readFileSync("public/img/prompts_gallinas.json", "utf8")).map((p) => [p.name, p.prompt]));

const TEXT_LABELS = [
  "a title card or large bold text overlay across the screen",
  "big subtitles or captions text on screen",
  "a news lower-third graphic with a channel logo and headline text",
  "a red YouTube subscribe button or social media UI overlay",
];
const MARK_LABELS = ["a channel logo, watermark or banner", "a tv news broadcast graphic overlay"];
const CLEAN = "a plain photo with no text and no logo";

const nameOf = (src) => src.split("/").pop().replace(/\.(mp4|jpg|png|webp)$/, "");
const bad = [];
let clipBad = 0, webBad = 0;

console.log("cargando CLIP local…");
const clf = await pipeline("zero-shot-image-classification", "Xenova/clip-vit-base-patch32", { dtype: "q8" });

for (const b of beats) {
  const name = nameOf(b.src);
  if (b.src.startsWith("broll/")) {
    if ((textOf[name] || 0) > 0.45) { bad.push(name); clipBad++; }
  } else if (b.src.startsWith("real/")) {
    const out = await clf(`public/${b.src}`, [CLEAN, ...TEXT_LABELS, ...MARK_LABELS]);
    const get = (l) => out.find((o) => o.label === l)?.score || 0;
    const text = Math.max(...TEXT_LABELS.map(get));
    const mark = Math.max(...MARK_LABELS.map(get));
    if (text > 0.40 || mark > 0.35) { bad.push(name); webBad++; }
  }
}

const list = bad.map((n) => ({ name: n, prompt: prompts[n] })).filter((x) => x.prompt);
fs.writeFileSync("public/img/prompts_gallinas_clean.json", JSON.stringify(list, null, 2));
fs.writeFileSync("public/_bad_gallinas.json", JSON.stringify(bad, null, 2));
console.log(`SUCIOS: ${bad.length}  (clips ${clipBad} + web ${webBad}) → prompts_gallinas_clean.json`);
