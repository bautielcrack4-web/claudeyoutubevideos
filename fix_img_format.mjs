// fix_img_format.mjs — re-guarda imágenes como PNG REAL con sharp. fetch_bing las baja
// como <name>.png pero el CONTENIDO puede ser jpg/gif/webp → ffmpeg (preblur) demuxea por
// extensión y falla. sharp decodifica cualquier formato y reescribe PNG verdadero.
// Uso: node fix_img_format.mjs public/real/bing_<slug>.json  (o un glob de nombres)
import fs from "fs";
import path from "path";
import sharp from "sharp";

const listArg = process.argv[2] || "public/real/bing_medicaid.json";
const list = JSON.parse(fs.readFileSync(listArg, "utf8"));
const DIR = "public/img";
let fixed = 0, ok = 0, miss = 0;

for (const { name } of list) {
  const p = path.join(DIR, `${name}.png`);
  if (!fs.existsSync(p)) { miss++; continue; }
  const buf = fs.readFileSync(p);
  // ya es PNG real? (firma \x89PNG)
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) { ok++; continue; }
  try {
    const out = await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).png({ quality: 92 }).toBuffer();
    fs.writeFileSync(p, out);
    fixed++;
  } catch (e) {
    console.log(`✗ ${name}: ${e.message}`);
  }
}
console.log(`fix_img_format: ${fixed} convertidas a PNG real · ${ok} ya PNG · ${miss} faltan`);
