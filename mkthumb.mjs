// mkthumb.mjs — miniatura YouTube SIN Remotion: compone texto AMARILLO (borde negro)
// + flecha ROJA sobre el fondo gpt-image (th_<slug>.png) con sharp. Rápido y confiable.
// Uso: node mkthumb.mjs <slug> <fontSize> "LINEA1|LINEA2|LINEA3" ax1 ay1 ax2 ay2
import fs from "fs";
import sharp from "sharp";

const [slug, fsz = "118", linesArg = "", ax1 = "380", ay1 = "440", ax2 = "250", ay2 = "610", curveArg = "0.2"] = process.argv.slice(2);
const W = 1280, H = 720;
const lines = linesArg.split("|").filter(Boolean);
const fontSize = +fsz;
const x1 = +ax1, y1 = +ay1, x2 = +ax2, y2 = +ay2, curve = +curveArg;

// flecha curva roja con cabeza
const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1;
const cx = mx - dy * curve, cy = my + dx * curve;
const ang = Math.atan2(y2 - cy, x2 - cx), ah = 52;
const p1x = x2 + ah * Math.cos(ang + Math.PI - 0.5), p1y = y2 + ah * Math.sin(ang + Math.PI - 0.5);
const p2x = x2 + ah * Math.cos(ang + Math.PI + 0.5), p2y = y2 + ah * Math.sin(ang + Math.PI + 0.5);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const lineH = fontSize * 0.96;
const textY0 = 60 + fontSize;
const texts = lines.map((l, i) => {
  const y = textY0 + i * lineH;
  return `<text x="46" y="${y}" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="${fontSize}" fill="#FFD21A" stroke="#000000" stroke-width="9" paint-order="stroke" stroke-linejoin="round" letter-spacing="1">${esc(l.toUpperCase())}</text>`;
}).join("\n");

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="rgba(0,0,0,0.66)"/>
      <stop offset="0.42" stop-color="rgba(0,0,0,0.3)"/>
      <stop offset="0.62" stop-color="rgba(0,0,0,0)"/>
    </linearGradient>
    <filter id="ds" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="5" dy="6" stdDeviation="0" flood-color="#000" flood-opacity="0.95"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <g filter="url(#ds)">${texts}</g>
  <path d="M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}" stroke="#000" stroke-width="30" fill="none" stroke-linecap="round"/>
  <path d="M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}" stroke="#ED1C1C" stroke-width="17" fill="none" stroke-linecap="round"/>
  <polygon points="${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}" fill="#ED1C1C" stroke="#000" stroke-width="6" stroke-linejoin="round"/>
</svg>`;

const bg = `public/img/th_${slug}.png`;
if (!fs.existsSync(bg)) { console.error("no existe", bg); process.exit(1); }
const out = `youtube/meta/thumb_${slug}.png`;
const base = await sharp(bg).resize(W, H, { fit: "cover" }).toBuffer();
await sharp(base).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).png().toFile(out);
console.log("OK ->", out, `(${lines.length} líneas, fontSize ${fontSize})`);
