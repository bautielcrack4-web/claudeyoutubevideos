// build_abono.mjs — Levi Lapp Jardín (ES) · "7 Basuras de Cocina Que Son Abono GRATIS (Deja de Tirarlas)".
// CLIPS-FIRST híbrido modo AVATAR (estilo corn/replantar/barcos): clips reales matcheados + imágenes
// deAPI de relleno + componentes hermosos encima del b-roll. Anclado al transcript MILIMÉTRICO (aligned).
//
// Modo:  node build_abono.mjs match  → public/broll/match_abono.json
//        node build_abono.mjs        → beatsheet/abono.json + avatar_abono.gen.ts
import fs from "fs";
import { SHOTS, SHOTS_EXTRA } from "./shots_abono.mjs";
// fusionar conceptos suplementarios (más variedad de footage real por sección)
for (const k in SHOTS_EXTRA) SHOTS[k] = [...(SHOTS[k] || []), ...SHOTS_EXTRA[k]];

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1745.37; // duración exacta del avatar (ffprobe 00:29:05.37)
const SLUG = "abono", AVATAR = "abono_opt.mp4";
const OPEN = 2.0;
const IMG_STYLE = ", realistic color photograph, natural soft daylight, sharp focus, shallow depth of field, rustic garden or kitchen, no text, no captions, no watermark, no logo";

// ── anclaje por captions MILIMÉTRICAS (forced-aligned) ──
const caps = JSON.parse(fs.readFileSync("public/captions_abono_aligned.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const W = caps.map((c) => ({ n: norm(c.text), ms: c.startMs }));
function at(phrase) {
  const t = norm(phrase).split(" ");
  for (let i = 0; i <= W.length - t.length; i++) {
    let ok = 1; for (let j = 0; j < t.length; j++) if (W[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return W[i].ms / 1000;
  }
  throw new Error("ANCHOR NOT FOUND: " + phrase);
}
// límites de FRASE del Whisper (ms exacto): cada clip del cuerpo corta acá (método barcos).
const PHRASE_BOUNDS = [];
for (let i = 0; i < caps.length; i++) {
  const prev = caps[i - 1];
  const prevPunct = prev ? /[.,;:!?…]$/.test(prev.text.trim()) : true;
  const gap = prev ? caps[i].startMs - prev.endMs : 9999;
  if (i === 0 || prevPunct || gap > 320) PHRASE_BOUNDS.push(caps[i].startMs / 1000);
}
// kphrase: frase cinética SINCRONIZADA a la transcript exacta (ms por palabra) — overlay.
const capW = caps.map((c) => ({ n: norm(c.text), raw: c.text.trim(), ms: c.startMs }));
let _kid = 0;
function kphrase(phrase, emph = []) {
  const tw = norm(phrase).split(" ");
  for (let i = 0; i <= capW.length - tw.length; i++) {
    let ok = 1; for (let j = 0; j < tw.length; j++) if (capW[i + j].n !== tw[j]) { ok = 0; break; }
    if (ok) {
      const span = capW.slice(i, i + tw.length);
      const t0 = span[0].ms;
      const eset = new Set(emph.map((e) => norm(e)));
      const words = span.map((w) => ({ t: w.raw, at: +((w.ms - t0) / 1000).toFixed(2), ...(eset.has(w.n) ? { hl: true } : {}) }));
      const dur = +(((span[span.length - 1].ms - t0) / 1000) + 1.7).toFixed(2);
      return { id: `kl${++_kid}`, start: +(t0 / 1000).toFixed(2), dur, kind: "kineticline", overlay: true, accent: "amber", words };
    }
  }
  console.warn("⚠ kphrase no encontrada:", phrase);
  return null;
}

// ── secciones (start de cada una; end = start de la próxima) ──
const SECT = [
  ["hook", at("si entraste a este video")],
  ["intro", at("pero primero dejame decirte una cosa rapida")],
  ["egg", at("numero uno la cascara de huevo")],
  ["coffee", at("la borra del cafe si tomas cafe")],
  ["banana", at("numero tres la cascara de banana")],
  ["water", at("numero cuatro el agua de coccion")],
  ["pause", at("para un momento si de todo este video")],
  ["onion", at("numero cinco la cascara de cebolla y de ajo")],
  ["tea", at("numero 6 la bolsita de te")],
  ["scraps", at("numero 7 los recortes de verdura")],
  ["trench", at("la sanja que comes sola")],
  ["recap", at("dejame cerrar repasandolos rapido")],
  ["closing", at("alimentar la planta es solo la mitad")],
];
const SECSTART = Object.fromEntries(SECT.map(([k, s]) => [k, s]));
const secEnd = (k) => { const i = SECT.findIndex((x) => x[0] === k); return i + 1 < SECT.length ? SECT[i + 1][1] : TOTAL; };
const POOLKEY = {}; // todas las secciones tienen SHOTS propios

// ── avatar a PANTALLA COMPLETA (apertura + cierre/teaser directo a cámara) ──
const AV_FULL = [
  [0, OPEN],
  [at("eso es exactamente lo que te voy a mostrar"), TOTAL], // teaser próximo video + firma
];

const S = SHOTS;

// ── densidad por sección (seg/clip): hook ráfaga, cuerpo dinámico, pausa que respira ──
const PACE = {
  hook: 1.0, intro: 2.4,
  egg: 3.0, coffee: 3.0, banana: 3.0, water: 3.0,
  pause: 4.0, onion: 3.0, tea: 3.0, scraps: 3.0,
  trench: 3.2, recap: 2.2, closing: 3.4,
};

const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const have = (nm) => fs.existsSync(`public/broll/${nm}.mp4`);
// imagen REAL de la web (fetch_bing → public/real/<name>.<ext>) para conceptos sin clip
const REAL_EXT = ["jpg", "jpeg", "png", "webp"];
const realImg = (nm) => { for (const suf of ["", "_1", "_2"]) for (const e of REAL_EXT) { const p = `real/${nm}${suf}.${e}`; if (fs.existsSync(`public/${p}`)) return p; } return null; };
const pickSrc = (own, secMatched) => {
  if (MODE !== "build") return { name: own, src: null };
  if (have(own)) return { name: own, src: `broll/${own}.mp4` };
  const ri = realImg(own);
  if (ri) return { name: own, src: ri };
  const nm = pickClip(own, secMatched);
  return { name: nm, src: have(nm) ? `broll/${nm}.mp4` : null };
};
const allMatched = MODE === "build" ? [...new Set(Object.values(S).flatMap((ls) => ls.map((s) => s[0])).filter(have))] : [];
const usage = {}; let lastClip = null;
const lastN = [];
const pickClip = (own, secMatched) => {
  if (MODE !== "build") return own;
  const recent = (nm) => lastN.includes(nm);
  const take = (nm) => { usage[nm] = (usage[nm] || 0) + 1; lastClip = nm; lastN.push(nm); if (lastN.length > 5) lastN.shift(); return nm; };
  if (have(own) && !recent(own) && (usage[own] || 0) < 2) return take(own);
  const pool = secMatched.length >= 3 ? secMatched : [...new Set([...secMatched, ...allMatched])];
  let best = null, bu = Infinity;
  for (const nm of pool) { const u = usage[nm] || 0; if (!recent(nm) && u < bu) { bu = u; best = nm; } }
  if (!best) { for (const nm of pool) { const u = usage[nm] || 0; if (nm !== lastClip && u < bu) { bu = u; best = nm; } } }
  if (!best) best = pool[0] || (have(own) ? own : allMatched[0]) || own;
  return take(best);
};

const CLIPS = [];
let _bid = 0;
for (const [key] of SECT) {
  const list = S[key] || S[POOLKEY[key]] || [];
  if (!list.length) continue;
  let s0 = SECSTART[key], e0 = secEnd(key);
  if (s0 < OPEN) s0 = OPEN;
  const span = e0 - s0;
  const pace = PACE[key] || 4.5;
  const secMatched = [...new Set(list.map((s) => s[0]).filter(have))];
  if (MODE === "match") {
    for (let i = 0; i < list.length; i++) {
      const t = +(s0 + (i + 0.5) * (span / list.length)).toFixed(2);
      const [own, query, concept] = list[i];
      CLIPS.push([t, `b${++_bid}_${own}`, own, Array.isArray(query) ? query : [query], concept]);
    }
    continue;
  }
  const minGap = Math.max(0.9, pace * 0.6);
  const bounds = []; let lastB = -99;
  for (const t of PHRASE_BOUNDS) { if (t >= s0 - 1e-6 && t < e0 && t - lastB >= minGap) { bounds.push(t); lastB = t; } }
  if (bounds.length === 0) bounds.push(s0);
  for (let i = 0; i < bounds.length; i++) {
    const t = +bounds[i].toFixed(2);
    if (inFull(t)) continue;
    const [own, query, concept] = list[i % list.length];
    const { name, src } = pickSrc(own, secMatched);
    CLIPS.push([t, `b${++_bid}_${name}`, name, Array.isArray(query) ? query : [query], concept, src]);
  }
}
CLIPS.sort((a, b) => a[0] - b[0]);

// ── modo MATCH ──
if (MODE === "match") {
  const seen = new Set(); const M = [];
  for (const [, , name, query, concept] of CLIPS) {
    if (seen.has(name)) continue; seen.add(name);
    M.push({ name, query, concept, dur: 6 });
  }
  fs.mkdirSync("public/broll", { recursive: true });
  fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(M, null, 2));
  console.log(`match_${SLUG}.json: ${M.length} clips · beats ${CLIPS.length}`);
  process.exit(0);
}

// ── modo BUILD ──
const avStarts = AV_FULL.map(([s]) => s);
const bounds = [...CLIPS.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;
const OV = 0.5;
let beats = CLIPS.map(([t, id, name, , concept, src]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  const s = src || (have(name) ? `broll/${name}.mp4` : realImg(name));
  if (s) return { id, start: t, dur, kind: "raw", src: s, darken: 0 };
  return { id, start: t, dur, kind: "raw", src: `img/${name}.png`, darken: 0, gen: { type: "image", name, prompt: concept + IMG_STYLE } };
});

const ck = (text) => ({ text, state: "done" });
const atc = (p) => { try { return at(p); } catch { console.warn("⚠ comp anchor missing:", p); return null; } };
const atO = (p, o = 0) => { const v = atc(p); return v == null ? null : +(v + o).toFixed(2); };
const _firstClip = (key) => { for (const [nm] of (SHOTS[key] || [])) if (fs.existsSync(`public/broll/${nm}.mp4`)) return nm; return null; };
const fileFor = (...nms) => { for (const nm of nms) { if (have(nm)) return `broll/${nm}.mp4`; const ri = realImg(nm); if (ri) return ri; } return null; };

// ── TARJETAS NUMERADAS (7) — clavadas al reveal de cada ítem, fondo = clip de la sección ──
const ITEMS = [
  ["numero uno la cascara de huevo", "1", "Cáscara de Huevo", "egg", "Calcio · anti-babosas"],
  ["la borra del cafe si tomas cafe", "2", "Borra de Café", "coffee", "Nitrógeno · lombrices"],
  ["numero tres la cascara de banana", "3", "Cáscara de Banana", "banana", "Potasio · flor y fruto"],
  ["numero cuatro el agua de coccion", "4", "Agua de Cocción", "water", "El caldo invisible"],
  ["numero cinco la cascara de cebolla y de ajo", "5", "Cebolla y Ajo", "onion", "Alimenta y espanta"],
  ["numero 6 la bolsita de te", "6", "Bolsita de Té", "tea", "Nitrógeno · lo chico suma"],
  ["numero 7 los recortes de verdura", "7", "Recortes de Verdura", "scraps", "Tierra negra gratis"],
];
const ITEMCARDS = ITEMS.map(([ph, num, name, key, eyebrow]) => {
  const t = atc(ph); if (t == null) return null;
  const cb = _firstClip(key);
  const o = { t, id: `cmp_item_${num}`, kind: "numcard", number: num, name, total: "7", accent: num === "7" ? "good" : "amber", dur: 3.0, eyebrow };
  if (cb) o.image = `broll/${cb}.mp4`;
  return o;
}).filter(Boolean);

const COMPONENTS = [
  // HOOK — PROMESA value-first (blurreveal overlay, ~15s) → engancha al toque
  { t: atc("lo que te voy a dar"), id: "cmp_hk_promise", kind: "blurreveal", overlay: true, dur: 2.8,
    eyebrow: "Sin vueltas · sin vender nada", title: "Los 7, gratis, de tu basura", accent: "good" },
  // HOOK — los 7 de un vistazo (chips ~18s) → dice QUÉ va a recibir = retención
  { t: atc("los 7 uno por uno"), id: "cmp_hk_seven", kind: "chips", hue: "amber",
    title: "Las 7 basuras que alimentan tu huerta", chips: ["Cáscara de huevo", "Borra de café", "Banana", "Agua de cocción", "Cebolla y ajo", "Té", "Recortes"] },
  // HOOK — anti-venta (callout ~24s)
  { t: atc("no te voy a vender ningun producto"), id: "cmp_hk_nosell", kind: "callout", hue: "amber", accent: "good",
    figure: "$0", eyebrow: "Cero productos · cero vivero", caption: "todo lo que tu tierra necesita ya lo tiras" },
  // HOOK — lo estás tirando (impacto ~36s)
  { t: atc("lo estas tirando a la basura"), id: "cmp_hk_trash", kind: "impact", dur: 4.0, hitAt: 1.0, boom: 0, darken: 0.45,
    setup: "Lo que el vivero te cobra...", impact: "lo estás tirando hoy.", impactAccent: "danger",
    bg: "overflowing kitchen trash bin full of vegetable food scraps" },
  // HOOK — el pago (callout ~57s) tomates enormes
  { t: atc("tomates del tamano de tu puno"), id: "cmp_hk_tomato", kind: "callout", hue: "amber", accent: "good",
    figure: "🍅", eyebrow: "La huerta del abuelo", caption: "tomates del tamaño de tu puño — gratis" },
  // HOOK — open loop: el #4 que casi nadie usa (curiosidad)
  { t: atc("ni siquiera sabe que existe"), id: "cmp_loop", kind: "mistake", number: "4", eyebrow: "EN ESTE VIDEO",
    title: "El truco que casi nadie usa", desc: "La mayoría ni sabe que sirve — y es el que más cambia tu tierra.",
    bg: "pouring cloudy vegetable cooking water from a pot in a rustic kitchen" },
  // HOOK — open loop 2: el secreto del abuelo (mistake ~83s) → segundo anzuelo al final
  { t: atc("el secreto de mi abuelo"), id: "cmp_hk_secret", kind: "mistake", number: "★", eyebrow: "AL FINAL DEL VIDEO",
    title: "El secreto de mi abuelo", desc: "Una sola cosa que vale más que los 7 trucos juntos.",
    bg: "an old amish farmer kneeling by a trench in a winter garden at dusk" },
  // HOOK — promesa (blur reveal overlay): tu basura ES el abono
  { t: atc("necesita tu basura"), id: "cmp_blur_promise", kind: "blurreveal", overlay: true, dur: 3.0,
    eyebrow: "Gratis · de tu cocina", title: "Tu basura ES el abono", accent: "good" },
  // INTRO — la bolsa del vivero cuesta una semana de comida (callout)
  { t: atc("por lo que te cuesta una semana de comida"), id: "cmp_price", kind: "callout", hue: "amber", accent: "danger",
    figure: "$$$", eyebrow: "Una bolsa de abono", caption: "lo que cuesta una semana de comida" },
  // INTRO — qué hay realmente en la bolsa (chips)
  { t: atc("calcio potasio nitrogeno materia que se pudre"), id: "cmp_npk", kind: "chips", hue: "amber",
    title: "Lo único que hay en la bolsa", chips: ["Calcio", "Potasio", "Nitrógeno"],
    bg: "close up of dark rich compost soil with eggshells and coffee grounds mixed in" },
  // INTRO — la cita del abuelo (quote)
  { t: atc("la tierra no se compra de comer"), id: "cmp_quote_feed", kind: "quote", hue: "amber", accent: "amber", fontSize: 84,
    text: "La tierra no se *compra* de comer. Se le *da* de comer.",
    bg: "weathered old farmer hands holding a handful of dark rich soil, golden hour" },
  // EGG — diagrama anotado: podredumbre apical (calcio)
  { t: atc("se te pudrio el tomate por abajo"), id: "cmp_anno_rot", kind: "annotated", hue: "amber", eyebrow: "Hambre de calcio",
    annotations: [
      { kind: "circle", x: 0.5, y: 0.7, w: 0.2, label: "Mancha negra = sin calcio", color: "danger" },
      { kind: "arrow", x: 0.5, y: 0.4, fromX: 0.85, fromY: 0.15, label: "No es un bicho", color: "amber" },
    ],
    bg: "a ripe tomato with dark blossom end rot spot on the bottom on a wooden table" },
  // EGG — proceso: cómo usar la cáscara
  { t: atc("esto es lo que haces paso por paso"), id: "cmp_proc_egg", kind: "process", hue: "amber", accent: "good", dur: 6.5,
    title: "La cáscara, paso a paso", eyebrow: "Calcio para la tierra",
    steps: [{ title: "Juntar y secar" }, { title: "Triturar bien fino" }, { title: "Al hoyo o alrededor del tallo" }] },
  // EGG — callout: el anillo anti-babosas
  { t: atc("le molesta muchisimo a la babosa"), id: "cmp_eg_slug", kind: "callout", hue: "amber", accent: "good",
    figure: "✂", eyebrow: "Cáscara rota = cerca", caption: "el filo frena a babosas y caracoles" },
  // COFFEE — el error más común (lielist)
  { t: atc("el cafe me quemo la planta"), id: "cmp_coffee_err", kind: "lielist", accent: "danger",
    title: "Por qué la gente lo arruina", items: ["La echan fresca y en montón", "Se apelmaza y cría moho", "Le tapa el aire a la raíz"],
    bg: "a thick wet clump of coffee grounds caked on garden soil close up" },
  // COFFEE — el secreto: es para la lombriz (callout)
  { t: atc("es para la lombriz"), id: "cmp_worm", kind: "callout", hue: "amber", accent: "good",
    figure: "🪱", eyebrow: "El verdadero secreto del café", caption: "no alimenta la planta — contrata lombrices, gratis" },
  // BANANA — dos maneras de usarla (splitlist)
  { t: atc("hay dos maneras de usar la cascara"), id: "cmp_banana_two", kind: "splitlist", palette: "D", cross: false, dur: 6.0,
    title: "Dos maneras, mismo potasio", items: ["Enterrada: se deshace en 2-3 semanas", "En té: 3 días en agua, rebajado", "Regla: enterrada o tapada, NUNCA al aire"] },
  // BANANA — potasio = flor a fruto (callout)
  { t: atc("florecer y a dar fruto"), id: "cmp_potasio", kind: "callout", hue: "amber", accent: "good",
    figure: "K", eyebrow: "Potasio", caption: "empuja la flor a volverse fruto" },
  // WATER — el caldo de oro que tiras (impacto)
  { t: atc("ese caldo de oro por la pileta"), id: "cmp_gold_water", kind: "impact", dur: 4.4, hitAt: 1.1, boom: 0, darken: 0.45,
    setup: "¿Tiras el agua de hervir verduras?", impact: "Es un caldo de nutrientes.", impactAccent: "good",
    bg: "pouring colored vegetable cooking water down a kitchen sink drain" },
  // WATER — las dos reglas (process)
  { t: atc("tiene que estar frio frio de verdad"), id: "cmp_proc_water", kind: "process", hue: "amber", accent: "good", dur: 6.5,
    title: "El agua de cocción, sin error", eyebrow: "Gratis dos veces",
    steps: [{ title: "Que enfríe del todo" }, { title: "Sin sal (la sal mata la tierra)" }, { title: "Regar como agua normal" }] },
  // PAUSE — la frase que sostiene todo (quote)
  { t: atc("premia al que vuelve"), id: "cmp_quote_return", kind: "quote", hue: "amber", accent: "amber", fontSize: 88,
    text: "La huerta no premia al que sabe mucho. Premia al que *vuelve*.",
    bg: "a calm vegetable garden at golden hour, soft light over the rows" },
  // ONION — alimenta y espanta (splitlist)
  { t: atc("por eso esta cascara vale doble"), id: "cmp_onion_double", kind: "splitlist", palette: "D", cross: false, dur: 6.0,
    title: "Cebolla y ajo: dos trabajos", items: ["Alimenta: potasio y azufre", "Espanta: el pulgón odia el olor", "Té dorado, rociar al atardecer"] },
  // ONION — sin veneno (callout)
  { t: atc("no envenenas nada"), id: "cmp_no_poison", kind: "callout", hue: "amber", accent: "good",
    figure: "0", eyebrow: "Cero químicos", caption: "un olor que la naturaleza ya fabricó" },
  // TEA — la trampa del plástico (impacto)
  { t: atc("tienen un plastico finito casi invisible"), id: "cmp_microplastic", kind: "impact", dur: 4.4, hitAt: 1.0, boom: 0, darken: 0.5,
    setup: "Muchas bolsitas tienen plástico...", impact: "Usa SOLO las hojas.", impactAccent: "danger",
    bg: "a pyramid mesh plastic tea bag held up close, synthetic shiny material" },
  // TRENCH — el ciclo de las estaciones (growthtimeline)
  { t: atc("durante todo el otono y todo el invierno"), id: "cmp_seasons", kind: "growthtimeline", dur: 6.5,
    title: "La zanja trabaja sola todo el invierno",
    stages: [{ label: "Otoño", sub: "cavar" }, { label: "Invierno", sub: "enterrar" }, { label: "Primavera", sub: "tierra negra" }, { label: "Cosecha", sub: "tomates" }],
    clipBg: _firstClip("trench") },
  // TRENCH — la frase del abuelo (quote)
  { t: atc("les echo el invierno"), id: "cmp_quote_winter", kind: "quote", hue: "amber", accent: "good", fontSize: 96,
    text: "—¿Qué les echas? —*Les echo el invierno.*",
    bg: "rows of huge ripe red tomatoes on healthy vines in a summer garden" },
  // RECAP — grilla de los 7 (cascada)
  { t: atc("dejame cerrar repasandolos rapido"), id: "cmp_grid", kind: "gridreveal", dur: 7.0,
    title: "7 basuras · 1 zanja · tierra gratis", subtitle: "El método del abuelo",
    tiles: ITEMS.map(([, num, name]) => ({ number: num, name })) },
  // RECAP — lo que NUNCA enterrar (lielist)
  { t: atc("hay cosas que nunca jamas debes enterrar"), id: "cmp_never", kind: "lielist", accent: "danger",
    title: "Lo que NUNCA enterrar", items: ["Carne y huesos", "Lácteos y queso", "Aceite y grasa", "Atrae ratas y huele mal"],
    bg: "raw meat scraps and bones on a board, set aside, warning concept" },
  // RECAP — la regla de una línea (quote)
  { t: atc("si crecio de la tierra vuelve a la tierra"), id: "cmp_rule", kind: "quote", hue: "amber", accent: "amber", fontSize: 86,
    text: "Si *creció de la tierra*, vuelve a la tierra. Si vino de un animal, no.",
    bg: "vegetable peels and scraps being returned to dark garden soil by hand" },
  // CLOSING — teaser próximo video (mistake / open loop)
  { t: atc("espantar a casi toda la plaga"), id: "cmp_teaser", kind: "mistake", number: "→", eyebrow: "PRÓXIMO VIDEO",
    title: "Espanta las plagas, sin veneno", desc: "La misma cocina esconde con qué defender tu huerta — gratis.",
    bg: "aphids and small pests on a green garden leaf, macro close up" },

  // ══ PASE de VARIEDAD ESTRUCTURADA (bars/process/checklist/cross/callout/annotated) ══
  // sin bg = renderizan sobre el tema ámbar (no gastan generación de imágenes)
  // EGG — descomposición: polvo fino vs trozo (bars)
  { t: atc("polvo fino semanas"), id: "cmp_bars_decomp", kind: "bars", hue: "amber", accent: "good", unit: "", dur: 6.5,
    title: "Cuánto tarda en comerlo la tierra", eyebrow: "Por eso se tritura",
    bars: [{ label: "Polvo bien fino", value: 100, display: "semanas", winner: true }, { label: "Trozo grande", value: 25, display: "meses", tone: "danger" }] },
  // EGG — la cerca gratis (callout)
  { t: atc("es una cerca que te regalo el desayuno"), id: "cmp_eg_fence", kind: "callout", hue: "amber", accent: "good",
    figure: "✂", eyebrow: "Anillo de cáscara rota", caption: "una cerca que te regaló el desayuno" },
  // COFFEE — cómo esparcir (process)
  { t: atc("esparces la borra finita sobre la tierra"), id: "cmp_proc_coffee", kind: "process", hue: "amber", accent: "good", dur: 6.5,
    title: "La borra, bien puesta", eyebrow: "Sin apelmazar",
    steps: [{ title: "Capa fina, no en montón" }, { title: "Rascar con el primer dedo de tierra" }, { title: "Una vez por semana" }] },
  // COFFEE — túneles y aire (annotated, necesita bg)
  { t: atc("hay tuneles hay aire bajando a la raiz"), id: "cmp_anno_worm", kind: "annotated", hue: "amber", eyebrow: "El trabajo invisible",
    annotations: [
      { kind: "arrow", x: 0.45, y: 0.5, fromX: 0.8, fromY: 0.2, label: "Túneles = aire a la raíz", color: "good" },
      { kind: "circle", x: 0.35, y: 0.6, w: 0.18, label: "Humus de lombriz", color: "good" },
    ],
    bg: "cross section of dark garden soil with earthworm tunnels and worms underground" },
  // COFFEE — el mejor abono (callout)
  { t: atc("el mejor abono que existe sobre esta tierra"), id: "cmp_cf_best", kind: "callout", hue: "amber", accent: "good",
    figure: "★", eyebrow: "Caca de lombriz", caption: "el mejor abono que existe — y no se compra" },
  // BANANA — té de banana paso a paso (process)
  { t: atc("metes dos o tres cascaras en un frasco"), id: "cmp_proc_banana", kind: "process", hue: "amber", accent: "good", dur: 6.5,
    title: "El té de banana", eyebrow: "Para macetas con flor",
    steps: [{ title: "2-3 cáscaras en un frasco con agua" }, { title: "3 días tapado a la sombra" }, { title: "Colar y rebajar a la mitad" }] },
  // BANANA — enterrada = invisible (callout)
  { t: atc("no huele no atrae moscas no se ve"), id: "cmp_bn_buried", kind: "callout", hue: "amber", accent: "good",
    figure: "🌱", eyebrow: "Enterrada", caption: "sin olor, sin moscas — trabaja en secreto" },
  // WATER — años de nutrientes a la cañería (callout)
  { t: atc("anos y anos de nutrientes directo a la caneria"), id: "cmp_wt_waste", kind: "callout", hue: "amber", accent: "danger",
    figure: "💧", eyebrow: "Lo que tiras cada día", caption: "años de nutrientes directo a la cañería" },
  // WATER — las reglas (checklist)
  { t: atc("es solo cambiar el orden"), id: "cmp_check_water", kind: "checklist", hue: "amber", accent: "good",
    title: "Agua de cocción, bien hecha", eyebrow: "Solo cambiar el orden",
    items: [ck("Hervir SIN sal"), ck("Dejar enfriar del todo"), ck("Regar como agua normal"), ck("Salar recién en el plato")] },
  // WATER — antes/después en la maceta (bars)
  { t: atc("verde oscuro lustroso que no les habia visto nunca"), id: "cmp_bars_water", kind: "bars", hue: "amber", accent: "good", unit: "", dur: 6.0,
    title: "La misma maceta", eyebrow: "Por agua que tiraba",
    bars: [{ label: "Con agua de cocción", value: 100, display: "verde lustroso", winner: true }, { label: "Antes", value: 45, display: "amarillenta", tone: "danger" }] },
  // ONION — té de cáscaras (process)
  { t: atc("las pones en un frasco con agua"), id: "cmp_proc_onion", kind: "process", hue: "amber", accent: "good", dur: 6.5,
    title: "El té de cebolla y ajo", eyebrow: "Repele al pulgón",
    steps: [{ title: "Cáscaras en un frasco con agua" }, { title: "2-3 días a la sombra" }, { title: "Colar y rociar las hojas" }] },
  // ONION — el pulgón bajo la hoja (annotated, bg)
  { t: atc("se te pega en racimos abajo de la hoja"), id: "cmp_anno_aphid", kind: "annotated", hue: "amber", eyebrow: "Dónde ataca",
    annotations: [
      { kind: "circle", x: 0.5, y: 0.62, w: 0.22, label: "Pulgón abajo de la hoja", color: "danger" },
      { kind: "arrow", x: 0.5, y: 0.4, fromX: 0.8, fromY: 0.15, label: "Rociar por abajo", color: "good" },
    ],
    bg: "macro of green aphids clustered on the underside of a garden leaf" },
  // ONION — escudo, no pared (callout)
  { t: atc("es un escudo no una pared"), id: "cmp_on_shield", kind: "callout", hue: "amber", accent: "amber",
    figure: "🛡", eyebrow: "Rociar al atardecer", caption: "es un escudo, no una pared — repetir cada 3-4 días" },
  // TEA — papel vs plástico (cross)
  { t: atc("muchisimas bolsitas de te de hoy en dia no son de papel"), id: "cmp_tea_cross", kind: "splitlist", palette: "D", cross: true, dur: 6.0,
    title: "La trampa de la bolsita", items: ["Papel puro: va entera a la tierra", "Con plástico: SOLO las hojas", "Si dudas: solo las hojas"] },
  // TEA — lo chico repetido (callout)
  { t: atc("una bolsita es un punadito de nada"), id: "cmp_te_small", kind: "callout", hue: "amber", accent: "good",
    figure: "∞", eyebrow: "Una bolsita por día", caption: "lo chico, repetido mil veces, manda en la huerta" },
  // SCRAPS — el pozo paso a paso (process)
  { t: atc("haces un pozo de un palmo de hondo entre dos plantas"), id: "cmp_proc_scraps", kind: "process", hue: "amber", accent: "good", dur: 6.5,
    title: "Sin compostera, sin nada", eyebrow: "Tierra negra gratis",
    steps: [{ title: "Bol de recortes al lado de la tabla" }, { title: "Pozo de un palmo entre plantas" }, { title: "Echar y tapar con la tierra" }] },
  // SCRAPS — huele a bosque (callout)
  { t: atc("huele a bosque despues de la lluvia"), id: "cmp_sc_smell", kind: "callout", hue: "amber", accent: "good",
    figure: "🌲", eyebrow: "Tierra negra de verdad", caption: "huele a bosque después de la lluvia" },
  // TRENCH — la zanja paso a paso (process)
  { t: atc("agarraba la pala y cavaba una sanja"), id: "cmp_proc_trench", kind: "process", hue: "amber", accent: "good", dur: 6.5,
    title: "La zanja del abuelo", eyebrow: "Todo junto, sin separar",
    steps: [{ title: "Cavar un surco al lado del cantero" }, { title: "Volcar el balde cada noche" }, { title: "Una palada de tierra encima" }] },
  // TRENCH — 30 segundos por noche (callout)
  { t: atc("30 segundos"), id: "cmp_tr_30s", kind: "callout", hue: "amber", accent: "good",
    figure: "30s", eyebrow: "Por noche, nada más", caption: "la tierra hace el trabajo mientras dormís" },
  // RECAP — el método completo (checklist)
  { t: atc("empieza por uno el que tengas mas a mano"), id: "cmp_check_method", kind: "checklist", hue: "amber", accent: "good",
    title: "El método completo", eyebrow: "Empezá por uno",
    items: [ck("Cáscara de huevo · calcio"), ck("Borra de café · nitrógeno"), ck("Banana · potasio"), ck("Agua de cocción · sin sal"), ck("Cebolla y ajo · espanta plagas"), ck("Bolsita de té · solo hojas"), ck("Recortes · la zanja")] },
  // CLOSING — sin gastar un peso (callout)
  { t: atc("sin gastar un peso"), id: "cmp_cl_free", kind: "callout", hue: "amber", accent: "good",
    figure: "$0", eyebrow: "Defender la huerta", caption: "con lo que ya tienes en la cocina" },

  // ══ MÁS COMPONENTES (densidad + variedad pedida) ══
  // INTRO — el truco de marketing (callout)
  { t: atc("le ponen un precio"), id: "cmp_in_label", kind: "callout", hue: "amber", accent: "danger",
    figure: "🏷", eyebrow: "De restos a producto", caption: "etiqueta bonita y un precio — eso es todo" },
  // COFFEE — trabajadores de noche (callout)
  { t: atc("trabajan de noche mientras tu duermes"), id: "cmp_cf_night", kind: "callout", hue: "amber", accent: "good",
    figure: "🌙", eyebrow: "Lombrices contratadas", caption: "trabajan de noche, mientras dormís — gratis" },
  // BANANA — qué cultivos piden potasio (chips)
  { t: atc("todo lo que da fruto te pide potasio"), id: "cmp_bn_crops", kind: "chips", hue: "amber",
    title: "Piden potasio cuando florecen", chips: ["Tomate", "Pimiento", "Pepino", "Zapallo"] },
  // WATER — el agua caliente mata (callout danger)
  { t: atc("el agua caliente le cocina la raiz a la planta y la mata"), id: "cmp_wt_hot", kind: "callout", hue: "amber", accent: "danger",
    figure: "🔥", eyebrow: "El error que mata la planta", caption: "tibia no — FRÍA del todo" },
  // ONION — la prueba del abuelo (callout)
  { t: atc("no tenian un solo bicho"), id: "cmp_on_proof", kind: "callout", hue: "amber", accent: "good",
    figure: "🥬", eyebrow: "Los repollos del abuelo", caption: "ni un solo bicho — y olía feo" },
  // TEA — al cabo de un año, baldes (callout)
  { t: atc("al cabo de un ano baldes"), id: "cmp_te_year", kind: "callout", hue: "amber", accent: "good",
    figure: "🪣", eyebrow: "Una bolsita por día", caption: "al cabo de un año: baldes de nitrógeno" },
  // SCRAPS — la tierra que cuesta una fortuna (callout)
  { t: atc("que en bolsa te cuesta una fortuna"), id: "cmp_sc_fortune", kind: "callout", hue: "amber", accent: "good",
    figure: "$$$", eyebrow: "Tierra negra de vivero", caption: "la fabricas con lo que pelas para la cena" },
  // TRENCH — la franja más viva (callout)
  { t: atc("la franja de tierra mas negra"), id: "cmp_tr_strip", kind: "callout", hue: "amber", accent: "good",
    figure: "★", eyebrow: "Para la primavera", caption: "la tierra más negra, rica y viva de la huerta" },
  // CLOSING — alimentar es la mitad (impacto, abre el loop al video 3)
  { t: atc("alimentar la planta es solo la mitad"), id: "cmp_cl_half", kind: "impact", dur: 4.2, hitAt: 1.0, boom: 0, darken: 0.45,
    setup: "Alimentar la tierra es solo...", impact: "la mitad del trabajo.", impactAccent: "amber",
    bg: "a healthy vegetable garden with a caterpillar pest on a chewed leaf" },
];

// ── insertar componentes (reemplazan los beats que cubren; respetan AV_FULL) ──
let nComp = 0;
const placedC = new Set();
const overlayComps = [];
for (const c of [...COMPONENTS].sort((a, b) => (a.t ?? 0) - (b.t ?? 0))) {
  if (c.t == null) continue;
  const { t, bg, leftBg, rightBg, clipBg, kind, overlay, ...rest } = c;
  if (["half", "loupe", "splitexplain", "focuscard", "termcard"].includes(kind) && !rest.srcFile && !rest.imgFile) { console.warn("⚠ composite sin archivo, salteado:", c.id); continue; }
  if (rest.srcFile) { rest.src = rest.srcFile; delete rest.srcFile; }
  if (rest.imgFile) { rest.image = rest.imgFile; delete rest.imgFile; }
  if (rest.imgFileBg || (kind === "focuscard" || kind === "splitexplain")) { rest.bg = rest.imgFileBg || rest.image; delete rest.imgFileBg; }
  if (overlay) {
    const ab = { id: c.id, start: +t.toFixed(2), dur: c.dur || 3.0, kind, overlay: true };
    delete rest.id; delete rest.dur; Object.assign(ab, rest);
    overlayComps.push(ab); nComp++; continue;
  }
  let idx = -1;
  for (let i = 0; i < beats.length; i++) { if (beats[i].start <= t + 0.01) { if (!placedC.has(beats[i].id)) idx = i; } else break; }
  if (idx < 0) continue;
  const start = beats[idx].start;
  const D = c.dur || 6.0;
  const ab = { id: c.id, start, dur: D, kind };
  delete rest.id; Object.assign(ab, rest);
  if (bg) { ab.image = `img/${c.id}_bg.png`; ab.gen = { type: "image", name: `${c.id}_bg`, prompt: bg + IMG_STYLE }; }
  if (clipBg) ab.image = `broll/${clipBg}.mp4`;
  if (c.image && !bg && !clipBg) ab.image = c.image;
  if (rightBg) { ab.src = `img/${c.id}_r.png`; ab.gen = { type: "image", name: `${c.id}_r`, prompt: rightBg + IMG_STYLE }; }
  let rm = 1;
  while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placedC.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab);
  placedC.add(c.id);
  const next = beats[idx + 1];
  const nextAv = avStarts.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
  ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + D + 1) - start).toFixed(2);
  nComp++;
}
// ITEMCARDS (numcard) — insertar igual que componentes con image=clip
for (const c of ITEMCARDS) {
  let idx = -1;
  for (let i = 0; i < beats.length; i++) { if (beats[i].start <= c.t + 0.01) { if (!placedC.has(beats[i].id)) idx = i; } else break; }
  if (idx < 0) continue;
  const start = beats[idx].start;
  const D = c.dur || 3.0;
  const { t, kind, ...rest } = c;
  const ab = { id: c.id, start, dur: D, kind }; delete rest.id; Object.assign(ab, rest);
  let rm = 1;
  while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placedC.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab);
  placedC.add(c.id);
  const next = beats[idx + 1];
  const nextAv = avStarts.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
  ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + D + 1) - start).toFixed(2);
  nComp++;
}

// ── HOOK BURST: partir tarjetas largas del primer minuto con clips de relleno (ráfaga real) ──
beats.sort((a, b) => a.start - b.start);
{
  const fillers = [];
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i];
    if (b.start >= 90 || b.overlay || b.kind === "raw") continue;
    const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
    let gap = nextStart - b.start;
    if (gap <= 5.5) continue;
    let t = +(b.start + 4.2).toFixed(2);
    while (nextStart - t > 1.6) {
      const nm = pickClip(allMatched[0], allMatched);
      if (!nm || !have(nm)) break;
      fillers.push({ id: `bf_${nm}_${Math.round(t * 10)}`, start: t, dur: 2.4, kind: "raw", src: `broll/${nm}.mp4`, darken: 0 });
      t = +(t + 2.6).toFixed(2);
    }
  }
  beats.push(...fillers);
  beats.sort((a, b) => a.start - b.start);
  if (fillers.length) console.log(`hook burst: +${fillers.length} clips de relleno`);
}

// ── tiling final: cero pantallas vacías ──
beats.sort((a, b) => a.start - b.start);
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  const avAfter = avStarts.filter((s) => s > b.start + 1e-6).sort((x, y) => x - y)[0] ?? Infinity;
  let end = Math.min(nextStart, TOTAL); if (avAfter < end) end = avAfter;
  const gap = end - b.start;
  const ov = b.kind === "raw" ? Math.min(OV, gap * 0.25) : 0;
  b.dur = +(Math.max(0.2, Math.min(end + ov, TOTAL) - b.start)).toFixed(2);
}

// ── frases cinéticas SINCRONIZADAS (overlays) ──
const KPHRASES = [
  kphrase("una razon muy simple", ["simple"]),
  kphrase("ese ultimo es el que de verdad lo cambia todo", ["cambia"]),
  kphrase("una huerta no necesita tu dinero", ["dinero"]),
  kphrase("premia la constancia no la informacion", ["constancia"]),
  kphrase("necesita tu basura", ["basura"]),
  kphrase("eso es hambre hambre de calcio", ["calcio"]),
  kphrase("es para la lombriz", ["lombriz"]),
  kphrase("o enterrada o en agua tapada", ["enterrada"]),
  kphrase("tiene que ser agua sin sal", ["sal"]),
  kphrase("premia al que vuelve", ["vuelve"]),
  kphrase("les echo el invierno", ["invierno"]),
  kphrase("dejar de tirar y empezar a enterrar", ["enterrar"]),
].filter(Boolean);
{
  const comps = beats.filter((b) => !b.overlay && b.kind !== "raw");
  const overComp = (o) => comps.some((c) => o.start < c.start + c.dur - 0.2 && o.start + o.dur > c.start + 0.2);
  const all = [...KPHRASES, ...overlayComps].sort((a, b) => a.start - b.start);
  const kept = [];
  let dropped = 0;
  for (const o of all) {
    if (overComp(o) || kept.some((k) => o.start < k.start + k.dur && o.start + o.dur > k.start)) { dropped++; continue; }
    kept.push(o);
  }
  beats.push(...kept);
  console.log(`overlays: ${kept.length} sobre clips (${dropped} descartados por chocar)`);
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, clipsfirst: true, beats }, null, 2));

// ── ventanas de avatar (full apertura/cierre · PiP rotando · resto hidden) ──
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = []; let kk = 0;
const _bw = beats.filter((b) => !b.overlay && b.kind === "raw");
for (let i = 0; i < _bw.length; i++) {
  if (i % 5 === 3 && !inFull(_bw[i].start)) { pip.push([_bw[i].start, _bw[i].start + Math.min(_bw[i].dur, 6), POS[kk % POS.length]]); kk++; }
}
const firstClip = CLIPS.length ? Math.max(CLIPS[0][0], OPEN) : OPEN;
const modeAt = (t) => {
  if (t < OPEN - 1e-6) return "full";
  if (AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
  return p ? p[2] : "hidden";
};
const pts = [...new Set([0, OPEN, firstClip, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) {
  if (t >= TOTAL - 1e-6) break;
  const m = modeAt(t);
  if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; }
}
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync("src/VideoEdit/avatar_abono.gen.ts", `// avatar_abono.gen.ts — GENERADO por build_abono.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_ABONO = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const isImg = (b) => b && b.kind === "raw" && b.gen;
const nClip = beats.filter((b) => b.kind === "raw" && !b.gen).length;
const nImg = beats.filter(isImg).length;
const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0);
console.log(`=== build_abono ===`);
console.log(`beats: ${beats.length} · clips reales: ${nClip} · imágenes IA: ${nImg} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
