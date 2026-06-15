// make_bing.mjs — arma public/real/bing_<slug>.json (lista para fetch_bing) leyendo
// prompts_<slug>.json + beatsheet/<slug>.json (extraImages). Genérico para cualquier video.
// Los fondos del avatar (*_ben_*) usan una ESCENA NEUTRA (sin personas) para no chocar
// con el PiP. Excluye diagramas (dg_) y props transparentes (van por gpt-image-2).
//   node make_bing.mjs <slug>
import fs from "fs";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node make_bing.mjs <slug>"); process.exit(1); }

const prompts = JSON.parse(fs.readFileSync(`public/img/prompts_${slug}.json`, "utf8"));
const bs = JSON.parse(fs.readFileSync(`beatsheet/${slug}.json`, "utf8"));
const propNames = new Set((() => { try { return JSON.parse(fs.readFileSync(`public/img/prompts_${slug}_props.json`, "utf8")).map((p) => p.name); } catch { return []; } })());

const all = new Map();
for (const p of [...prompts, ...(bs.extraImages || [])]) {
  if (!p.name || p.name.startsWith("dg_") || propNames.has(p.name)) continue;
  if (!all.has(p.name)) all.set(p.name, p.prompt || "");
}

const subjectOf = (prompt) => {
  const m = prompt.split("16:9. ")[1];
  if (!m) return prompt;
  return m.split(". Como")[0].trim();
};

const list = [];
for (const [name, prompt] of all) {
  let query, concept;
  if (/_ben_/.test(name)) {
    query = "cozy warm home kitchen and living room interior, soft light, no people";
    concept = "a warm cozy home interior, kitchen or living room, empty";
  } else {
    const subj = subjectOf(prompt);
    query = subj.replace(/,?\s*(vintage|conceptual|dramatic|ominous|warm|stress.*|clinical|melancholic).*$/i, "").trim() || subj;
    concept = subj;
  }
  list.push({ name, query, concept, count: 1 });
}

fs.mkdirSync("public/real", { recursive: true });
fs.writeFileSync(`public/real/bing_${slug}.json`, JSON.stringify(list, null, 1));
console.log(`bing_${slug}.json — ${list.length} imágenes`);
