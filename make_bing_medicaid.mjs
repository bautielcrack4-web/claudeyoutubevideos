// make_bing_medicaid.mjs — arma public/real/bing_medicaid.json (lista para fetch_bing)
// leyendo TODOS los nombres de imagen del beatsheet (prompts_medicaid.json + extraImages),
// y derivando query+concept en inglés del prompt. Los fondos del avatar (rb_ben_*) usan
// una ESCENA NEUTRA (interior cálido, sin personas) para no chocar con el PiP de Ben.
import fs from "fs";

const prompts = JSON.parse(fs.readFileSync("public/img/prompts_medicaid.json", "utf8")); // [{name,prompt}]
const bs = JSON.parse(fs.readFileSync("beatsheet/medicaid.json", "utf8"));
const extra = bs.extraImages || [];

const all = new Map();
for (const p of [...prompts, ...extra]) {
  if (!p.name || p.name.startsWith("dg_")) continue; // diagramas → gpt-image-2, no bing
  if (!all.has(p.name)) all.set(p.name, p.prompt || "");
}

// sujeto en inglés = lo que va entre "16:9. " y ". Como"
const subjectOf = (prompt) => {
  const m = prompt.split("16:9. ")[1];
  if (!m) return prompt;
  return m.split(". Como")[0].trim();
};

const list = [];
for (const [name, prompt] of all) {
  let query, concept;
  if (name.startsWith("rb_ben_")) {
    // fondo del narrador → escena neutra cálida, SIN personas (el avatar va encima)
    query = "cozy warm home kitchen and living room interior, soft light, no people";
    concept = "a warm cozy home interior, kitchen or living room, empty";
  } else {
    const subj = subjectOf(prompt);
    query = subj.replace(/,?\s*(vintage|conceptual|dramatic|ominous|warm|stress.*|clinical).*$/i, "").trim() || subj;
    concept = subj;
  }
  list.push({ name, query, concept, count: 1 });
}

fs.mkdirSync("public/real", { recursive: true });
fs.writeFileSync("public/real/bing_medicaid.json", JSON.stringify(list, null, 1));
console.log(`bing_medicaid.json — ${list.length} imágenes a bajar`);
for (const x of list.slice(0, 8)) console.log(`  ${x.name.padEnd(22)} ← "${x.query}"`);
