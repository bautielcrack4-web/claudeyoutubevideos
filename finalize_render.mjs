// finalize_render.mjs — renombra el mp4 del farm a un nombre LEGIBLE (número + título
// real), deja la PORTADA (miniatura) al lado con el mismo nombre, y un .txt con título
// completo, descripción y estado (subido/falta subir + URL). Así en D:\videosdeclaude
// se ve de un vistazo qué es cada video y cuáles faltan subir.
// Uso: node finalize_render.mjs <slug> <num> "<Título real>" [youtube_url]
import fs from "fs";

const [slug, num, title, url] = process.argv.slice(2);
if (!slug || !num || !title) { console.error('Uso: node finalize_render.mjs <slug> <num> "<Título>" [url]'); process.exit(1); }
const OUT = "D:/videosdeclaude";
const src = `${OUT}/${slug}.mp4`;
if (!fs.existsSync(src)) { console.error("no existe el render:", src); process.exit(1); }

const safe = title.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ").trim().slice(0, 90);
const base = `${OUT}/${num} - ${safe}`;

fs.renameSync(src, `${base}.mp4`);
const thumb = `youtube/meta/thumb_${slug}.png`;
if (fs.existsSync(thumb)) fs.copyFileSync(thumb, `${base}.png`);

let desc = "", t = title, tags = "";
try { const m = JSON.parse(fs.readFileSync(`youtube/meta/${slug}.json`, "utf8")); desc = m.description || ""; t = m.title || title; tags = (m.tags || []).join(", "); } catch {}

const estado = url ? `SUBIDO ✅ → ${url}` : "RENDERIZADO — FALTA SUBIR ⬆️";
fs.writeFileSync(`${base}.txt`,
`TÍTULO: ${t}

ESTADO: ${estado}
CANAL: constructor_libre (El Constructor Libre)  ·  privado
SLUG: ${slug}
PORTADA: ${num} - ${safe}.png

TAGS: ${tags}

DESCRIPCIÓN:
${desc}
`);
console.log(`OK -> "${num} - ${safe}.mp4"  (+ .png portada  + .txt info)`);
console.log(`     estado: ${estado}`);
