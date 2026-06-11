// build_animales.mjs — construye beatsheet/animales.json (+ prompts de diagramas y
// stills-fuente de clips) para "El Abuelo Revela los 7 Animales Más Rentables que
// Puedes Criar en Tu Patio". Avatar = animales_opt.mp4 (AÚN NO grabado: las marcas
// de tiempo son PROVISIONALES — timeline por DURACIÓN acumulada; cuando llegue el
// audio se transcribe y se re-anclan los start a los captions reales).
//
// Patrón calcado de build_objetos, con una diferencia clave: acá los beats se
// authoran por DURACIÓN (no por start absoluto). Cada helper toma `dur` como primer
// argumento y un cursor global acumula el start. TALK(dur) = hueco hablado (avatar
// full, sin cue). Así re-anclar = reescalar/ajustar, no recomputar 180 starts.
//
// Flujo: node build_animales.mjs → node beatsheet.mjs beatsheet/animales.json →
//        node scripts/varcheck.mjs animales → (generar) → wirear Main → render.
import fs from "fs";

const AVATAR = "animales_opt.mp4";

// ── wrappers de prompt (formato realista validado) ───────────────────────────
const REAL =
  "realistic imperfect handheld camera angle, slightly tilted frame, practical documentary look, no cinematic lighting, no perfect studio setup, natural video compression, low-resolution YouTube documentary screenshot look, not staged, ultra realistic";
const NEG =
  "Negative prompt: clean studio photo, cinematic lighting, overly saturated colors, cartoon, CGI, 3D render, luxury advertisement, sharp perfect text, fake labels, dramatic shadows, watermark, logo overlay, perfect symmetrical face, extra fingers, distorted hands, blurry face, fantasy style, illustration.";
const ph = (desc, light = "natural soft outdoor daylight, slightly overcast, muted natural colors") =>
  `Realistic handheld 16:9 documentary-style video frame of ${desc}. ${light}. ${REAL}. ${NEG}`;
const arch = (desc) =>
  `Realistic handheld 16:9 documentary-style video frame of a faded vintage archival photograph of ${desc}, scratched grain, sun-faded yellowed sepia tones. ${REAL}. ${NEG}`;

// diagrama gpt-image-2 (lámina editorial artesanal earthy, esquina sup-der libre)
const dg = (panel) =>
  `Crear una infografía horizontal en RELACIÓN DE ASPECTO EXACTA 16:9 (panorámica ancha, 1792x1024), estilo ilustración hecha a mano pero muy profesional, limpia, premium y editorial — lámina botánica/agrícola artesanal moderna, NO póster escolar. ${panel} Fondo marfil/crema claro con textura de papel muy sutil, alto contraste, líneas marrón oscuro o casi negras, acentos en verde salvia apagado y terracota/sepia apagado, estética de lámina botánica vintage de campo. Dejá COMPLETAMENTE LIBRE la esquina superior derecha (limpia, luminosa, sin texto ni dibujos) para colocar después el avatar. Composición minimalista, hermosa, MUY clara, mucho espacio respirable, ocupando TODO el ancho 16:9, pocos bloques grandes, números grandes, texto mínimo en español, ilustraciones de tinta fina y acuarela suave, flechas elegantes, se entiende en 1 segundo. Evitá saturación, íconos de más, textos chicos, look escolar o infantil.`;

const diagPrompts = [];
const addDiag = (name, panel) => {
  if (!diagPrompts.find((d) => d.name === "dg_" + name)) diagPrompts.push({ name: "dg_" + name, prompt: dg(panel), size: "auto" });
  return `img/dg_${name}.png`;
};

// ── prompt para fotos CON EL AVATAR (gpt-image-2 edit sobre _avatar_ref.png) ──
// El MISMO viejo de la referencia HACIENDO la acción, look casero/documental. Se
// generan con gen_images_ref.mjs (DIFERIDAS hasta tener su frame de cara real).
const him = (action) =>
  `Editar usando la persona de la imagen de referencia: el MISMO hombre mayor — misma cara curtida, LARGA barba gris/canosa, SOMBRERO DE PAJA, camisa clara sin cuello y tiradores/breteles oscuros — ${action}. Foto documental real, hecha a mano (handheld), ligeramente inclinada, luz natural suave, colores apagados, look de captura de video casero de YouTube, nada de estudio ni cine, ultra realista, sin texto legible. Fondo: el patio / fondo rústico de una casa de campo modesta, madera y verde.`;

// ── timing ANCLADO a los captions reales (sync exacto) ───────────────────────
// Cada beat se ancla a una FRASE de la narración; el start = ms donde se dice (con
// un pequeño J-cut: la imagen entra ~0.2s antes de la palabra). dur = hasta el
// próximo beat (cap 9s; los huecos largos = avatar full). Re-anclar = re-correr.
const CAPS = JSON.parse(fs.readFileSync("public/captions_animales.json", "utf8"));
const stripWord = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
// reconstruir PALABRAS con su startMs (los tokens son sub-palabras con espacios)
const WORDS = [];
{
  let cur = null;
  for (const t of CAPS) {
    for (const p of t.text.split(/(\s+)/)) {
      if (p === "") continue;
      if (/^\s+$/.test(p)) { if (cur) { WORDS.push(cur); cur = null; } continue; }
      if (!cur) cur = { w: "", ms: t.startMs };
      cur.w += p;
    }
  }
  if (cur) WORDS.push(cur);
  for (const x of WORDS) x.w = stripWord(x.w);
}
const END = CAPS[CAPS.length - 1].endMs / 1000;
const LEAD = 0.2; // J-cut: la imagen adelanta a la palabra
function findMs(phrase, nth = 0) {
  const pw = phrase.split(/\s+/).map(stripWord).filter(Boolean);
  let count = 0;
  for (let i = 0; i + pw.length <= WORDS.length; i++) {
    let ok = true;
    for (let k = 0; k < pw.length; k++) if (WORDS[i + k].w !== pw[k]) { ok = false; break; }
    if (ok) { if (count === nth) return Math.max(0, WORDS[i].ms / 1000 - LEAD); count++; }
  }
  throw new Error(`ANCLA no encontrada (#${nth}): "${phrase}"`);
}
// anchor = frase (string) | [frase, nth] | número (segundos absolutos)
const resolve = (anchor) =>
  typeof anchor === "number" ? anchor : Array.isArray(anchor) ? findMs(anchor[0], anchor[1]) : findMs(anchor);

const beats = [];
let auto = 0;
const nid = (p) => `${p}${String(++auto).padStart(3, "0")}`;
const push = (anchor, b) => {
  beats.push({ ...b, start: +resolve(anchor).toFixed(2), idx: beats.length, ...(b._dur != null ? {} : {}) });
};

// Todos los helpers: 1er arg = ANCLA (frase del guion | [frase,nth] | segundos).
// `_dur` en opciones = duración fija (para journeys/diagramas largos); si no, la
// duración se calcula sola hasta el próximo beat (cap 9s).

// foto FLUX (recreación documental — productos / animales / escenas)
function P(at, name, desc, { hue = "amber", kicker, light, arch: isArch, _dur } = {}) {
  push(at, { id: name, kind: "raw", src: `img/${name}.png`, hue, ...(kicker ? { kicker } : {}), ...(_dur != null ? { _dur } : {}),
    gen: { type: "image", name, prompt: isArch ? arch(desc) : ph(desc, light) } });
}
// SPLIT 50/50 (estilo Elias Yoder): imagen en una mitad, avatar en la otra. La imagen
// es una foto generada (FLUX). El Main pone el avatar en halfL (imagen derecha por def).
function HALF(at, name, desc, { hue = "amber", kicker, side, light, _dur } = {}) {
  push(at, { id: name, kind: "half", src: `img/${name}.png`, hue, ...(side ? { side } : {}), ...(kicker ? { kicker } : {}), ...(_dur != null ? { _dur } : {}),
    gen: { type: "image", name, prompt: ph(desc, light) } });
}
// foto CON EL AVATAR (él haciendo la acción) — gpt-image-2 ref, DIFERIDA al avatar.
const avatarRef = [];
function PA(at, name, action, { hue = "amber", kicker, _dur } = {}) {
  if (!avatarRef.find((a) => a.name === name)) avatarRef.push({ name, ref: ["_avatar_ref_animales.png"], prompt: him(action), size: "1536x1024" });
  push(at, { id: name, kind: "raw", src: `img/${name}.png`, hue, ...(kicker ? { kicker } : {}), ...(_dur != null ? { _dur } : {}) });
}
// clip LTX (img2video): genera el STILL fuente (FLUX, name+"_src") y lo anima.
const clipSrc = [];
function C(at, name, desc, { hue = "amber", kicker, frames = 90, _dur } = {}) {
  const srcName = name + "_src";
  if (!clipSrc.find((c) => c.name === srcName)) clipSrc.push({ name: srcName, prompt: ph(desc) });
  push(at, { id: name, kind: "raw", src: `vid/${srcName}.mp4`, hue, ...(kicker ? { kicker } : {}), ...(_dur != null ? { _dur } : {}),
    gen: { type: "clip", image: srcName, prompt: desc, frames } });
}
function ST(at, value, { prefix, suffix, decimals, label, eyebrow, accent = "amber", hue = "amber", _dur } = {}) {
  push(at, { id: nid("st"), kind: "stat", value, prefix, suffix, decimals, label, eyebrow, accent, hue, ...(_dur != null ? { _dur } : {}) });
}
function D(at, eyebrow, slides, { hue = "amber", accent = "amber", _dur } = {}) {
  push(at, { id: nid("d"), kind: "diagram", eyebrow, hue, accent, ...(_dur != null ? { _dur } : {}),
    slides: slides.map((s) => ({ image: addDiag(s.name, s.panel), title: s.title, note: s.note })) });
}
function Q(at, text, { image, eyebrow, accent = "amber", hue = "amber", fontSize, _dur } = {}) {
  push(at, { id: nid("q"), kind: "quote", text, image, eyebrow, accent, hue, fontSize, ...(_dur != null ? { _dur } : {}) });
}
function HEAD(at, tokens, { eyebrow, hue = "amber", size, bg, image, _dur } = {}) {
  push(at, { id: nid("h"), kind: "headline", tokens, eyebrow, hue, size, bg, image, ...(_dur != null ? { _dur } : {}) });
}
function AGED(at, heading, lines, { eyebrow, image, accent = "amber", hue = "amber", _dur } = {}) {
  push(at, { id: nid("ag"), kind: "aged", heading, lines, eyebrow, image, accent, hue, ...(_dur != null ? { _dur } : {}) });
}
function IMP(at, image, impact, { setup, impactAccent = "danger", hitAt, boom = 1, darken, _dur } = {}) {
  push(at, { id: nid("im"), kind: "impact", image, impact, setup, impactAccent, hitAt, boom, darken, ...(_dur != null ? { _dur } : {}) });
}
function CH(at, chips, { title, image, bg = "image", hue = "amber", _dur } = {}) {
  push(at, { id: nid("ch"), kind: "chips", chips, title, image, bg, hue, ...(_dur != null ? { _dur } : {}) });
}
function SPL(at, title, items, { palette = "A", cross, _dur } = {}) {
  push(at, { id: nid("sp"), kind: "splitlist", title, items, palette, cross, ...(_dur != null ? { _dur } : {}) });
}
function BARS(at, bars, { title, eyebrow, orientation, unit, accent = "amber", hue = "amber", _dur } = {}) {
  push(at, { id: nid("ba"), kind: "bars", bars, title, eyebrow, orientation, unit, accent, hue, ...(_dur != null ? { _dur } : {}) });
}
function CROSS(at, layers, { title, eyebrow, marker, hue = "amber", _dur } = {}) {
  push(at, { id: nid("cr"), kind: "cross", layers, title, eyebrow, marker, hue, ...(_dur != null ? { _dur } : {}) });
}
function PROC(at, steps, { title, eyebrow, accent = "amber", hue = "amber", _dur } = {}) {
  push(at, { id: nid("pr"), kind: "process", steps, title, eyebrow, accent, hue, ...(_dur != null ? { _dur } : {}) });
}
function CHK(at, title, items, { eyebrow, accent = "amber", hue = "amber", image, _dur } = {}) {
  push(at, { id: nid("ck"), kind: "checklist", title, items, eyebrow, accent, hue, image, ...(_dur != null ? { _dur } : {}) });
}
function ANN(at, image, annotations, { eyebrow, caption, hue = "amber", _dur } = {}) {
  push(at, { id: nid("an"), kind: "annotated", image, annotations, eyebrow, caption, hue, ...(_dur != null ? { _dur } : {}) });
}
function CALL(at, figure, { image, eyebrow, caption, accent = "amber", hue = "amber", _dur } = {}) {
  push(at, { id: nid("ca"), kind: "callout", figure, image, eyebrow, caption, accent, hue, ...(_dur != null ? { _dur } : {}) });
}
function JNY(at, eyebrow, title, waypoints, { worldImage, accent = "amber", _dur } = {}) {
  push(at, { id: nid("jn"), kind: "journey", eyebrow, title, waypoints, worldImage, accent, ...(_dur != null ? { _dur } : {}) });
}
function INFZ(at, images, { accent = "amber", _dur } = {}) {
  push(at, { id: nid("iz"), kind: "infzoom", images, accent, ...(_dur != null ? { _dur } : {}) });
}
// ★ TOP7 — tarjeta de revelación del puesto, con foto-héroe (gen) + riel de progreso
function TOP7(at, rank, name, benefit, heroName, heroDesc, { accent = "accent", hue = "amber", label, _dur } = {}) {
  push(at, { id: nid("t7"), kind: "top7", rank, name, benefit, image: `img/${heroName}.png`, accent, hue, label, ...(_dur != null ? { _dur } : {}),
    gen: { type: "image", name: heroName, prompt: ph(heroDesc) } });
}

// =============================================================================
const ctx = { P, PA, HALF, C, ST, D, Q, HEAD, AGED, IMP, CH, SPL, BARS, CROSS, PROC, CHK, ANN, CALL, JNY, INFZ, TOP7 };
const { authorBeats } = await import("./build_animales_beats.mjs");
authorBeats(ctx);

// ── ordenar por start; espaciado mínimo; dur = _dur | (próximo - start, cap 9) ──
beats.sort((a, b) => a.start - b.start || a.idx - b.idx);
const MIN = 1.1, MAXHOLD = 9;
for (let i = 1; i < beats.length; i++)
  if (beats[i]._dur == null && beats[i].start < beats[i - 1].start + MIN)
    beats[i].start = +(beats[i - 1].start + MIN).toFixed(2);
for (let i = 0; i < beats.length; i++) {
  const next = beats[i + 1];
  const gap = next ? next.start - beats[i].start : END - beats[i].start;
  // _dur = duración deseada pero CLAMP al gap para no solapar el próximo beat
  beats[i].dur = beats[i]._dur != null
    ? +Math.max(1.2, Math.min(beats[i]._dur, gap)).toFixed(2)
    : +Math.max(1.2, Math.min(gap, MAXHOLD)).toFixed(2);
  delete beats[i]._dur; delete beats[i].idx;
}

// ── Top7Ladder: adjuntar la lista de los 7 a CADA beat top7 (para el leaderboard) ──
{
  const t7 = beats.filter((b) => b.kind === "top7");
  const byRank = {};
  for (const b of t7) if (b.rank && !byRank[b.rank]) byRank[b.rank] = { name: b.name, benefit: b.benefit, image: b.image, accent: b.accent };
  const items = [];
  for (let r = 1; r <= 7; r++) if (byRank[r]) items.push(byRank[r]);
  for (const b of t7) b.items = items;
}

const out = { video: "animales", avatar: AVATAR, end: END, beats };
fs.writeFileSync("beatsheet/animales.json", JSON.stringify(out, null, 2));
fs.writeFileSync("public/img/prompts_animales_diag.json", JSON.stringify(diagPrompts, null, 2));
fs.writeFileSync("public/img/prompts_animales_clipsrc.json", JSON.stringify(clipSrc, null, 2));
fs.writeFileSync("public/img/prompts_animales_avatarref.json", JSON.stringify(avatarRef, null, 2));
const gens = beats.filter((b) => b.gen);
console.log(`beats: ${beats.length} · duración real: ${(END / 60).toFixed(1)} min (${END}s) · 1 cada ${(END / beats.length).toFixed(1)}s`);
console.log(`diagramas (gpt-image-2): ${diagPrompts.length} · clips (LTX): ${clipSrc.length}`);
console.log(`gens deAPI: ${gens.length} (img ${gens.filter((b) => b.gen.type === "image").length} + clip ${gens.filter((b) => b.gen.type === "clip").length}) · avatar-ref: ${avatarRef.length}`);
