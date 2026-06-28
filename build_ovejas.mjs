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
const AV = [[0, OPEN], [333, 348], [CLOSE, TOTAL]];
const inAV = (t) => AV.some(([a, b]) => t >= a - 1e-6 && t < b - 1e-6);

// ── ~25 componentes (variedad máxima, bien usados), anclados a su frase. Over-footage
// donde aplica (bg/imagen de las 138). dur ≈ ventana que ocupan (los slots de imagen se excluyen). ──
const SPECIAL = [
  { start: 7, dur: 6, kind: "callout", figure: "$225.000", eyebrow: "DE $2.500 A", caption: "en unos pocos años", image: "img/ov006.jpg", hue: "amber" },
  { start: 90.6, dur: 6, kind: "lielist", title: "Te dicen que necesitás:", items: ["Millones de dólares", "Mil hectáreas", "Un tractor gigante"], image: "img/ov035.jpg", hue: "cold" },
  { start: 114.5, dur: 6, kind: "chips", bg: "image", image: "img/ov006.jpg", title: "Hoy vas a ver", chips: ["La cuenta real", "El animal exacto", "El método"], hue: "amber" },
  { start: 154.6, dur: 6.5, kind: "bars", eyebrow: "VACA vs OVEJA", title: "¿Cuál se multiplica?", bars: [{ label: "Vaca", value: 1, display: "1 cría/año" }, { label: "Oveja", value: 3, display: "2 cada 8 meses" }], hue: "amber" },
  { start: 193.7, dur: 6, kind: "chips", bg: "image", image: "img/ov017.jpg", title: "Oveja de pelo · Dorper", chips: ["No se esquila", "Suelta el pelo sola", "Solo carne, bien pagada"], hue: "amber" },
  { start: 240, dur: 5.5, kind: "stat", value: 2, suffix: " CRÍAS", label: "cada 8 meses", eyebrow: "LA DORPER", hue: "amber" },
  { start: 258.1, dur: 7, kind: "gridreveal", title: "Interés compuesto... con patas", subtitle: "el rebaño se duplica solo", tiles: [{ number: "10", name: "hoy" }, { number: "20", name: "año 1" }, { number: "40", name: "año 2" }, { number: "80", name: "año 3" }] },
  { start: 349, dur: 13, kind: "aged", eyebrow: "¿La publico o me la guardo?", heading: "La guía del micro-rancho", lines: [{ text: "Cuántos animales por parcela", mark: true }, { text: "Los tiempos exactos" }, { text: "Los números reales, paso a paso" }], hue: "amber" },
  { start: 389.1, dur: 8, kind: "process", eyebrow: "PASTOREO ROTATIVO", steps: [{ title: "Parcela chica", desc: "con alambre eléctrico" }, { title: "Comen y abonan", desc: "1 o 2 días" }, { title: "Mover al lado", desc: "tira fresca" }, { title: "Descansar 30-40 días", desc: "el pasto resucita" }] },
  { start: 454.6, dur: 6, kind: "bars", eyebrow: "MISMA HECTÁREA", title: "Animales por hectárea", unit: " ovejas", bars: [{ label: "Suelto", value: 1, display: "1" }, { label: "Rotativo", value: 5, display: "5" }], hue: "amber" },
  { start: 467.2, dur: 6, kind: "regrow", title: "El pasto vuelve más fuerte", leftImage: "img/ov087.jpg", rightImage: "img/ov090.jpg", leftLabel: "Comido", rightLabel: "Resucitado", hue: "amber" },
  { start: 492.7, dur: 6.5, kind: "ingredients", items: [{ image: "img/ov066.jpg", label: "12 ovejas madre" }, { image: "img/ov097.jpg", label: "1 buen carnero" }], resultLabel: "Tu fábrica viva" },
  { start: 540, dur: 7, kind: "timeline", eyebrow: "LA BOLA DE NIEVE", title: "De $2.500 a un patrimonio", events: [{ year: "Año 1", label: "20 corderos" }, { year: "Año 3", label: "40 madres" }, { year: "Año 4", label: "80 animales" }, { year: "Año 6", label: "$200.000", accent: "amber" }] },
  { start: 554.9, dur: 6, kind: "goldvault", label: "$200.000", caption: "un capital que se reproduce solo" },
  { start: 583.8, dur: 7, kind: "mistake", number: "!", eyebrow: "EL ERROR QUE FUNDE AL 90%", title: "El apuro", desc: "Vender antes de tiempo y comerte las hembras jóvenes que iban a multiplicar el rebaño", image: "img/ov111.jpg" },
  { start: 647, dur: 7, kind: "splitexplain", eyebrow: "PASTOREO MIXTO", title: "Dos productos, una tierra", bg: "img/ov123.jpg", image: "img/ov124.jpg", points: ["La vaca come lo alto", "La oveja limpia lo bajo", "Nada se desperdicia", "Se enferman menos"], accent: "amber" },
  { start: 699.4, dur: 6, kind: "chips", bg: "image", image: "img/ov129.jpg", title: "«No tengo tierra»", chips: ["Alquilá barato", "Trabajá a porcentaje", "Campos abandonados de sobra"], hue: "amber" },
  { start: 776.8, dur: 6, kind: "statpills", pills: ["No se esquila", "Aguanta frío y calor", "Pare sola en el campo", "Casi no se enferma"] },
  { start: 856.3, dur: 7, kind: "growthtimeline", title: "De 8 a más de 100", stages: [{ label: "8 ovejas", sub: "el arranque" }, { label: "25", sub: "2do año" }, { label: "+100", sub: "4to año" }] },
  { start: 898, dur: 6.5, kind: "quote", eyebrow: "EL MUCHACHO DEL CAMPITO", text: "El campo que nadie quería hoy me da *más que el sueldo* que tenía", image: "img/ov130.jpg" },
  { start: 975.1, dur: 6, kind: "splitlist", title: "Te quieren cliente de:", items: ["el banco", "el supermercado", "el patrón"], palette: "D", cross: true },
  { start: 1031.8, dur: 8, kind: "process", eyebrow: "PRIMEROS PASOS", steps: [{ title: "Tierra prestada o alquilada" }, { title: "Hembras de mellizos" }, { title: "Un buen carnero" }, { title: "Cerco eléctrico portátil" }, { title: "Aguantá dos años" }] },
  { start: 1076.7, dur: 5.5, kind: "stat", value: 50, suffix: "%", label: "de la sangre del rebaño", eyebrow: "EL CARNERO", hue: "amber" },
  { start: 1140.5, dur: 7, kind: "checklist", eyebrow: "RESUMEN", title: "LA RECETA DEL MICRO-RANCHO", items: [{ text: "Pedazo chico, bien manejado" }, { text: "Un animal que se multiplica" }, { text: "Aguantar dos años" }, { text: "Mover el pasto" }, { text: "Sumar unas vacas" }], hue: "amber" },
  { start: 1258, dur: 9, kind: "nextvideo", kicker: "Próximo video", title: "Codornices: $1.000 al mes en el patio", sub: "el animal chiquito que rinde como uno grande" },
  // — annotated: foto casual + marca dibujada a mano, anclada a su sección (sube variedad + pulido humano) —
  { start: 215, dur: 5, kind: "annotated", image: "img/ov017.jpg", eyebrow: "OVEJA DE PELO", caption: "No se esquila — suelta el pelo sola", annotations: [{ kind: "circle", x: 0.52, y: 0.5, w: 0.2, label: "Pelo, no lana" }], hue: "amber" },
  { start: 295, dur: 5, kind: "annotated", image: "img/ov066.jpg", eyebrow: "SE MULTIPLICA SOLO", caption: "2 crías cada 8 meses, casi siempre mellizos", annotations: [{ kind: "circle", x: 0.5, y: 0.55, w: 0.22, label: "El rebaño crece" }], hue: "amber" },
  { start: 425, dur: 5, kind: "annotated", image: "img/ov087.jpg", eyebrow: "PASTOREO ROTATIVO", caption: "Comen una tira, la dejás descansar 30 días", annotations: [{ kind: "arrow", x: 0.45, y: 0.5, fromX: 0.82, fromY: 0.72, label: "Tira fresca" }], hue: "amber" },
  { start: 620, dur: 5, kind: "annotated", image: "img/ov097.jpg", eyebrow: "EL CARNERO", caption: "Es la mitad de la sangre del rebaño", annotations: [{ kind: "circle", x: 0.5, y: 0.48, w: 0.2, label: "El mejor" }], hue: "amber" },
  { start: 730, dur: 5, kind: "annotated", image: "img/ov129.jpg", eyebrow: "«NO TENGO TIERRA»", caption: "Campos abandonados hay de sobra", annotations: [{ kind: "circle", x: 0.5, y: 0.55, w: 0.24, label: "Tierra de sobra" }], hue: "amber" },
  { start: 940, dur: 5, kind: "annotated", image: "img/ov130.jpg", eyebrow: "EL CAMPO QUE NADIE QUERÍA", caption: "Hoy le da más que el sueldo que tenía", annotations: [{ kind: "circle", x: 0.5, y: 0.5, w: 0.22, label: "Transformado" }], hue: "amber" },
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
  for (const f of ["figure", "eyebrow", "caption", "text", "src", "image", "accent", "hue", "items", "title", "bars", "unit", "stages", "tiles", "steps", "events", "lines", "points", "pills", "chips", "number", "desc", "leftImage", "rightImage", "leftLabel", "rightLabel", "value", "suffix", "label", "sub", "kicker", "heading", "resultLabel", "subtitle", "palette", "cross", "bg", "annotations"]) if (s[f] !== undefined) out[f] = s[f];
  return out;
});
const beats = [...rawBeats, ...spBeats].sort((a, b) => a.start - b.start);

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/ovejas.json", JSON.stringify({ video: "ovejas", avatar: "ovejas_opt.mp4", clipsfirst: true, beats }, null, 2));

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
