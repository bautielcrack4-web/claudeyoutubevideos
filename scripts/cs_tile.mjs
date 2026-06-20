// cs_tile.mjs — arma contact sheets (grilla) de los thumbnails out/cs/t_*.jpg con sharp,
// etiquetando cada celda con su índice (para mapear contra out/cs/manifest.txt).
import fs from "fs";
import sharp from "sharp";

const DIR = "out/cs";
const TW = 240, TH = 135, GAP = 6, COLS = 6, ROWS = 4;
const PER = COLS * ROWS;
const CW = COLS * TW + (COLS + 1) * GAP;
const CH = ROWS * TH + (ROWS + 1) * GAP;

const thumbs = fs.readdirSync(DIR).filter((f) => /^t_\d+\.jpg$/.test(f)).sort();
const sheets = Math.ceil(thumbs.length / PER);
console.log(`${thumbs.length} thumbs → ${sheets} sheets (${COLS}x${ROWS})`);

const label = (n) =>
  Buffer.from(
    `<svg width="${TW}" height="22"><rect x="0" y="0" width="40" height="22" fill="black" opacity="0.75"/><text x="5" y="16" font-family="Arial" font-size="16" font-weight="bold" fill="yellow">${n}</text></svg>`
  );

for (let s = 0; s < sheets; s++) {
  const comp = [];
  for (let k = 0; k < PER; k++) {
    const gi = s * PER + k;
    if (gi >= thumbs.length) break;
    const col = k % COLS, row = Math.floor(k / COLS);
    const x = GAP + col * (TW + GAP), y = GAP + row * (TH + GAP);
    comp.push({ input: `${DIR}/${thumbs[gi]}`, left: x, top: y });
    comp.push({ input: label(gi), left: x, top: y });
  }
  const out = `${DIR}/sheet_${String(s).padStart(2, "0")}.jpg`;
  await sharp({ create: { width: CW, height: CH, channels: 3, background: { r: 25, g: 25, b: 25 } } })
    .composite(comp)
    .jpeg({ quality: 82 })
    .toFile(out);
  console.log("  " + out + `  (idx ${s * PER}–${Math.min(s * PER + PER - 1, thumbs.length - 1)})`);
}
