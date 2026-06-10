// farm.mjs — ORQUESTADOR del render gratis en GitHub Actions.
// Hace todo el ciclo desde tu máquina (o desde donde corra Claude), sin que toques nada:
//   1) empaqueta los assets del video en un tarball
//   2) lo sube como RELEASE asset  assets-<slug>
//   3) dispara el workflow render.yml (render por rangos en paralelo)
//   4) espera a que termine y DESCARGA el mp4 final a out/<slug>.mp4
//
// Requisitos (una vez):
//   - repo PÚBLICO con este proyecto (.github/workflows/render.yml incluido)
//   - GitHub CLI `gh` instalado y autenticado (gh auth login)
//   - estar parado en la raíz del repo
//
// Uso:
//   node scripts/farm.mjs <slug> <comp_id> <total_frames> [chunks=24] [prefijoAssets]
//   ej:  node scripts/farm.mjs fly Fly 43380 24 fl
// (prefijoAssets opcional: si lo pasás, solo empaqueta img/<pref>* y vid/<pref>* +
//  los diagramas dg_*; si no, empaqueta img/ y vid/ enteros.)
import { execSync, execFileSync } from "node:child_process";
import fs from "node:fs";

const [slug, comp, total, chunks = "24", pref] = process.argv.slice(2);
if (!slug || !comp || !total) {
  console.error("Uso: node scripts/farm.mjs <slug> <comp_id> <total_frames> [chunks] [prefijo]");
  process.exit(1);
}
const sh = (c) => execSync(c, { stdio: "inherit" });
const out = (c) => execSync(c, { encoding: "utf8" }).trim();

// 1) tarball de assets
const tar = `assets-${slug}.tar`;
const avatar = `public/${slug}_opt.mp4`;
const wav = `public/${slug}.wav`;
for (const f of [avatar, wav]) if (!fs.existsSync(f)) { console.error("falta:", f); process.exit(1); }
// rutas relativas a public/ (el workflow extrae con -C public)
let items = [`${slug}_opt.mp4`, `${slug}.wav`];
if (fs.existsSync("public/sfx")) items.push("sfx"); // camas ambientales + efectos (siempre)
if (pref) {
  // solo lo de este video + diagramas (gpt-image, prefijo dg_)
  const img = fs.readdirSync("public/img").filter((f) => f.startsWith(pref) || f.startsWith("dg_"));
  const vid = fs.existsSync("public/vid") ? fs.readdirSync("public/vid").filter((f) => f.startsWith(pref)) : [];
  items.push(...img.map((f) => `img/${f}`), ...vid.map((f) => `vid/${f}`));
  // footage REAL: fotos de archivo (public/real/*) + video de stock (public/broll/*)
  if (fs.existsSync("public/real"))
    items.push(...fs.readdirSync("public/real").filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f)).map((f) => `real/${f}`));
  if (fs.existsSync("public/broll"))
    items.push(...fs.readdirSync("public/broll").filter((f) => /\.(mp4|jpg|jpeg|png)$/i.test(f)).map((f) => `broll/${f}`));
} else {
  items.push("img", "vid");
  if (fs.existsSync("public/real")) items.push("real");
  if (fs.existsSync("public/broll")) items.push("broll");
}
fs.writeFileSync("_assets_list.txt", items.join("\n"));
console.log(`empaquetando ${items.length} entradas → ${tar} ...`);
execFileSync("tar", ["-cf", tar, "-C", "public", "-T", "_assets_list.txt"], { stdio: "inherit" });
fs.rmSync("_assets_list.txt");

// 2) subir como release asset (reemplaza si ya existe)
const relTag = `assets-${slug}`;
try { out(`gh release view ${relTag}`); sh(`gh release delete ${relTag} --yes --cleanup-tag`); } catch { /* no existe */ }
sh(`gh release create ${relTag} ${tar} --title ${relTag} --notes "assets del render"`);
fs.rmSync(tar);

// 3) disparar el workflow
console.log("disparando render.yml ...");
sh(`gh workflow run render.yml -f slug=${slug} -f comp_id=${comp} -f total_frames=${total} -f chunks=${chunks}`);

// 4) esperar y descargar el mp4 final
console.log("esperando que aparezca la corrida ...");
execSync("sleep 8 2>/dev/null || ping -n 9 127.0.0.1 >NUL", { stdio: "ignore", shell: true });
const runId = out(`gh run list --workflow=render.yml --limit 1 --json databaseId --jq ".[0].databaseId"`);
console.log("corrida:", runId, "— siguiendo (esto tarda según los pedazos)...");
try { sh(`gh run watch ${runId} --exit-status`); } catch { console.error("la corrida fallo; revisá: gh run view " + runId); process.exit(1); }
fs.mkdirSync("out", { recursive: true });
sh(`gh run download ${runId} -n final-${slug} -D out`);
console.log(`\n✅ listo → out/${slug}.mp4`);
