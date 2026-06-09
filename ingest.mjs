// ingest.mjs — convierte una carpeta con imágenes y/o videos MEZCLADOS (cualquier
// nombre, cualquier orden) en:
//   1) láminas de contacto numeradas (out/ingest_01.jpg, _02.jpg…) — miniaturas
//      chicas con su índice + nombre de archivo debajo. Para VIDEOS extrae 1 frame
//      representativo (~30% de la duración) y le pone ▶.
//   2) out/ingest_index.json — lista {i, file, type, durationSec?} para mapear.
//
// Con esto, TODA la biblioteca se reconoce en 1 sola pasada de visión (≈ el costo
// de mirar una imagen suelta, pero rinde por 30). Flujo: tirás archivos → corro
// `node ingest.mjs <carpeta>` → miro las láminas UNA vez → escribo descripciones
// en assets.json → armo la edición leyendo solo texto.
//
// Uso:
//   node ingest.mjs [srcDir=public/img] [outPrefix=out/ingest] [cols=5] [thumbW=360] [perSheet=30]
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const FF = path.join(
  process.cwd(),
  "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe",
);

const [srcArg, outArg, colsArg, wArg, perArg] = process.argv.slice(2);
const SRC = srcArg || "public/img";
const OUT = outArg || "out/ingest";
const COLS = Number(colsArg) || 5;
const W = Number(wArg) || 360;
const PER = Number(perArg) || 30;
const H = Math.round((W * 9) / 16);
const PAD = 8;
const LABEL_H = 30;

const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"];
const VID_EXT = [".mp4", ".mov", ".webm", ".mkv", ".avi", ".m4v"];

if (!fs.existsSync(SRC)) {
  console.error("no existe la carpeta:", SRC);
  process.exit(1);
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
const tmp = OUT + "_tmp";
fs.mkdirSync(tmp, { recursive: true });

const files = fs
  .readdirSync(SRC)
  .filter((f) => {
    const e = path.extname(f).toLowerCase();
    return IMG_EXT.includes(e) || VID_EXT.includes(e);
  })
  .sort();

if (files.length === 0) {
  console.error("no hay imágenes ni videos en:", SRC);
  process.exit(1);
}

const probeDur = (file) => {
  const r = spawnSync(FF, ["-i", file], { encoding: "utf8" });
  const m = (r.stderr || "").match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
  if (!m) return null;
  return +m[1] * 3600 + +m[2] * 60 + +m[3];
};

const index = [];
const thumbs = [];
for (let i = 0; i < files.length; i++) {
  const f = files[i];
  const full = path.join(SRC, f);
  const e = path.extname(f).toLowerCase();
  const isVid = VID_EXT.includes(e);
  if (isVid) {
    const dur = probeDur(full) || 6;
    const at = (dur * 0.3).toFixed(2);
    const tpath = path.join(tmp, `s${String(i).padStart(3, "0")}.jpg`);
    const r = spawnSync(
      FF,
      ["-y", "-ss", at, "-i", full, "-frames:v", "1", "-vf", `scale=${W * 2}:-1`, "-q:v", "4", tpath],
      { encoding: "utf8" },
    );
    if (r.status !== 0) {
      console.error("frame falló:", f, "\n", (r.stderr || "").slice(-300));
      continue;
    }
    index.push({ i, file: f, type: "video", durationSec: Number(dur.toFixed(2)) });
    thumbs.push({ i, file: f, src: tpath, isVid: true });
  } else {
    index.push({ i, file: f, type: "image" });
    thumbs.push({ i, file: f, src: full, isVid: false });
  }
}

const cellH = H + LABEL_H;
const cells = await Promise.all(
  thumbs.map(async (t) => {
    const base = await sharp(t.src)
      .resize(W, H, { fit: "contain", background: "#111418" })
      .toBuffer();
    const tag = `${t.i}  ${t.file}${t.isVid ? "  \u25B6" : ""}`;
    const safe = tag.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const strip = Buffer.from(
      `<svg width="${W}" height="${LABEL_H}"><rect width="${W}" height="${LABEL_H}" fill="#161b29"/><text x="8" y="20" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#dfe6f2">${safe}</text></svg>`,
    );
    return sharp({ create: { width: W, height: cellH, channels: 3, background: "#0b0e16" } })
      .composite([
        { input: base, top: 0, left: 0 },
        { input: strip, top: H, left: 0 },
      ])
      .jpeg()
      .toBuffer();
  }),
);

let sheetCount = 0;
for (let p = 0; p * PER < cells.length; p++) {
  const pageCells = cells.slice(p * PER, p * PER + PER);
  const rows = Math.ceil(pageCells.length / COLS);
  const cw = COLS * W + (COLS + 1) * PAD;
  const ch = rows * cellH + (rows + 1) * PAD;
  const comp = pageCells.map((buf, k) => ({
    input: buf,
    left: PAD + (k % COLS) * (W + PAD),
    top: PAD + Math.floor(k / COLS) * (cellH + PAD),
  }));
  const outFile = `${OUT}_${String(p + 1).padStart(2, "0")}.jpg`;
  await sharp({ create: { width: cw, height: ch, channels: 3, background: "#0b0e16" } })
    .composite(comp)
    .jpeg({ quality: 62 })
    .toFile(outFile);
  console.log(`escribí ${outFile} — ${pageCells.length} assets (${COLS}x${rows})`);
  sheetCount++;
}

fs.writeFileSync(`${OUT}_index.json`, JSON.stringify(index, null, 2));
fs.rmSync(tmp, { recursive: true, force: true });
console.log(
  `\n=== LISTO === ${index.length} assets · ${sheetCount} lámina(s) · índice en ${OUT}_index.json`,
);
