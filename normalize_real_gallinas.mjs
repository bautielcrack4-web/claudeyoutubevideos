// normalize_real_gallinas.mjs — para cada concepto SIN clip, toma la mejor imagen web
// (<name>_1 preferido, luego _2; jpg>png>webp) y la deja como real/<name>.jpg (lo que
// busca pickSrc del build). Convierte png/webp→jpg con el ffmpeg de Remotion. Idempotente.
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const FF = path.join(process.cwd(), "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe");
const REAL = "public/real";
const m = JSON.parse(fs.readFileSync("public/broll/match_gallinas.json", "utf8"));
let ok = 0, conv = 0, miss = 0;
for (const { name } of m) {
  if (fs.existsSync(path.join("public/broll", `${name}.mp4`))) continue; // tiene clip → no necesita imagen
  const out = path.join(REAL, `${name}.jpg`);
  if (fs.existsSync(out)) { ok++; continue; }
  // candidatos: jpg PRIMERO (copia directa, siempre funciona), luego png (ffmpeg ok),
  // webp último (el ffmpeg mínimo de Remotion no siempre lo decodifica). Probar TODOS
  // hasta que uno produzca el jpg final.
  const cands = [];
  for (const ext of ["jpg", "png", "webp"]) for (const suf of ["_1", "_2", "_3", ""]) {
    const p = path.join(REAL, `${name}${suf}.${ext}`);
    if (fs.existsSync(p)) cands.push(p);
  }
  let done = false;
  for (const src of cands) {
    if (src.endsWith(".jpg")) { fs.copyFileSync(src, out); ok++; done = true; break; }
    const r = spawnSync(FF, ["-y", "-i", src, "-qscale:v", "3", out], { stdio: "ignore" });
    if (r.status === 0 && fs.existsSync(out)) { conv++; done = true; break; }
  }
  if (!done) miss++;
}
console.log(`real/<name>.jpg listos: ${ok} copiados + ${conv} convertidos · sin imagen: ${miss}`);
