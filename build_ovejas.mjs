// build_ovejas.mjs — comp del video micro-rancho. B-roll MIXTO: 138 imágenes IA casuales
// (ov001..ov138, en orden del guion) + clips reales (os*, matchfarm) intercalados.
// Distribuye anclando a cortes de frase (segments_ovejas.json), avatar en apertura/cierre
// + teaser de la guía, y componentes hermosos over-footage en los picos.
// Flujo: node build_ovejas.mjs · node beatsheet.mjs beatsheet/ovejas.json
import fs from "fs";

const segs = JSON.parse(fs.readFileSync("public/segments_ovejas.json", "utf8"));
const TOTAL = 1290;            // 21:30
const OPEN = 6;                // avatar full abre
const CLOSE = TOTAL - 9;       // avatar full cierra

// ── avatar full windows: apertura, teaser de la guía (él lo dice a cámara), cierre ──
const AV = [[0, OPEN], [333, 366], [CLOSE, TOTAL]];
const inAV = (t) => AV.some(([a, b]) => t >= a - 1e-6 && t < b - 1e-6);

// ── componentes hermosos over-footage en los picos (bg = imagen relevante de las 138) ──
const SPECIAL = [
  { start: 115, dur: 6, kind: "callout", figure: "$225.000", eyebrow: "DE $2.500 A", caption: "en unos pocos años", image: "img/ov006.jpg", hue: "amber" },
  { start: 256, dur: 5.5, kind: "keyphrase", text: "Interés compuesto... pero con *patas*", src: "img/ov063.jpg", accent: "good" },
  { start: 552, dur: 6, kind: "callout", figure: "$200.000", eyebrow: "UN PATRIMONIO", caption: "que crece solo", image: "img/ov068.jpg", hue: "amber" },
  { start: 575, dur: 5.5, kind: "keyphrase", text: "El error que funde al *90%*", src: "img/ov111.jpg", accent: "danger" },
];
const inSP = (t) => SPECIAL.some((s) => t >= s.start - 1e-6 && t < s.start + s.dur - 1e-6);

// ── asset list: imágenes en orden + clips reales intercalados (1 clip cada 2 imgs) ──
const imgs = [];
for (let i = 1; i <= 138; i++) imgs.push(`img/ov${String(i).padStart(3, "0")}.jpg`);
const clips = [];
for (let i = 1; i <= 50; i++) { const p = `broll/os${String(i).padStart(3, "0")}.mp4`; if (fs.existsSync("public/" + p)) clips.push(p); }
const assets = [];
let ci = 0;
for (let i = 0; i < imgs.length; i++) {
  assets.push(imgs[i]);
  if (i % 2 === 1 && ci < clips.length) assets.push(clips[ci++]); // intercala un clip cada 2 imgs
}
while (ci < clips.length) assets.push(clips[ci++]); // clips restantes al final del cuerpo

// ── slots = inicios de frase en [OPEN,CLOSE] fuera de avatar-full y de los especiales ──
const slots = segs.map((s) => s.t).filter((t) => t >= OPEN && t < CLOSE && !inAV(t) && !inSP(t));
// repartir los assets uniformemente sobre los slots
const placed = [];
for (let k = 0; k < assets.length; k++) {
  const idx = assets.length === 1 ? 0 : Math.round((k * (slots.length - 1)) / (assets.length - 1));
  placed.push({ start: slots[idx], src: assets[k] });
}
// dedup de starts (si dos caen en el mismo slot, empujar al siguiente slot libre)
const used = new Set();
for (const p of placed) {
  let i = slots.indexOf(p.start);
  while (i < slots.length && used.has(slots[i])) i++;
  if (i >= slots.length) i = slots.length - 1;
  p.start = slots[i]; used.add(slots[i]);
}
placed.sort((a, b) => a.start - b.start);

// ── armar beats raw + especiales, dur = hasta el próximo borde ──
const bounds = [...placed.map((p) => p.start), ...SPECIAL.map((s) => s.start), ...AV.flat(), TOTAL].sort((a, b) => a - b);
const nextB = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;
let id = 0;
const rawBeats = placed.map((p) => {
  id++;
  const hue = /^(img\/ov00[1-9]|img\/ov01[0-9]|img\/ov020)/.test(p.src) ? "amber" : "amber";
  return { id: `b${id}`, start: +p.start.toFixed(2), dur: +(nextB(p.start) - p.start).toFixed(2), kind: "raw", src: p.src, hue };
});
const spBeats = SPECIAL.map((s, i) => {
  const out = { id: `sp${i + 1}`, start: s.start, dur: +(nextB(s.start) - s.start).toFixed(2), kind: s.kind };
  for (const f of ["figure", "eyebrow", "caption", "text", "src", "image", "accent", "hue"]) if (s[f] !== undefined) out[f] = s[f];
  return out;
});
const beats = [...rawBeats, ...spBeats].sort((a, b) => a.start - b.start);

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/ovejas.json", JSON.stringify({ video: "ovejas", avatar: "ovejas_opt.mp4", beats }, null, 2));

// ── avatar windows gen ──
const windows = [{ start: 0, mode: "full" }];
let cur = "full";
const push = (t, m) => { if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } };
push(OPEN, "hidden");
for (const [a, b] of AV.slice(1)) { push(a, "full"); if (b < TOTAL - 1e-6) push(b, "hidden"); }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync("src/VideoEdit/avatar_ovejas.gen.ts",
  `// avatar_ovejas.gen.ts — GENERADO por build_ovejas.mjs. NO editar.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_OVEJAS = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

console.log(`=== build_ovejas ===`);
console.log(`beats: ${beats.length} (raw ${rawBeats.length} + esp ${spBeats.length}) · imgs ${imgs.length} · clips ${clips.length}`);
console.log(`dur prom raw: ${(rawBeats.reduce((a, b) => a + b.dur, 0) / rawBeats.length).toFixed(1)}s`);
console.log(`→ beatsheet/ovejas.json · avatar_ovejas.gen.ts`);
