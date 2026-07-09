// dense_prep3.mjs — igual que dense_prep.mjs pero para el slug federer3.
// Toma public/broll/dense_federer3.json ({at,query}) → anclа cada 'at' al ms del
// caption, afina a ~2.3s, asigna dNNN y escribe:
//   public/broll/dense_thinned3.json  ·  public/broll/stock_dense3.json (fetch_pexels)
//   src/VideoEdit/federer3_broll.ts   (FED3_BROLL, capa continua para Main_federer3)
import fs from "fs";
const MINGAP = 2.2;
const caps = JSON.parse(fs.readFileSync("public/captions_federer3.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = caps.map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after = 0) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const dense = JSON.parse(fs.readFileSync("public/broll/dense_federer3.json", "utf8"));
let cursor = 0, kept = [], miss = 0;
for (const b of dense) {
  const t = findMs(b.at, Math.max(0, cursor - 1));
  if (t == null) { miss++; continue; }
  if (t < cursor + MINGAP) continue;
  cursor = t;
  kept.push({ name: `d${String(kept.length).padStart(3, "0")}`, at: b.at, query: b.query, t: +t.toFixed(2) });
}
// array para fetchstock.mjs ({name, query, type, orientation})
const stock = kept.map((k) => ({ name: k.name, query: k.query, type: "video", orientation: "landscape" }));
fs.writeFileSync("public/broll/dense_thinned3.json", JSON.stringify(kept, null, 1));
fs.writeFileSync("public/broll/stock_dense3.json", JSON.stringify(stock, null, 1));

const VEND = (CW[CW.length - 1]?.s || 1590) + 2;
const broll = kept.map((k, i) => ({
  name: k.name, src: `broll/${k.name}.mp4`,
  start: k.t, dur: +(((i + 1 < kept.length ? kept[i + 1].t : VEND) - k.t)).toFixed(2),
  query: k.query,
}));
fs.writeFileSync("src/VideoEdit/federer3_broll.ts",
  `// AUTO-GENERADO por scripts/dense_prep3.mjs — b-roll denso (footage real cada ~2.5s).\n` +
  `export const FED3_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`);
const gaps = kept.slice(1).map((k, i) => k.t - kept[i].t);
const avg = gaps.reduce((a, b) => a + b, 0) / (gaps.length || 1);
console.log(`dense: ${dense.length} → afinado ${kept.length} clips · sep media ${avg.toFixed(2)}s · no-ancladas ${miss}`);
console.log("primeros:", kept.slice(0, 5).map((k) => `${k.t}s ${k.query}`).join(" | "));
