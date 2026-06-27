// build_hugel.mjs — Levi Lapp Jardín (ES) · "Mi abuelo enterró troncos podridos... 20 años sin regar".
// Hugelkultur. CLIPS-FIRST + imágenes web + imágenes bespoke del abuelo (gpt-image-2) + HugelDiagram.
//   node build_hugel.mjs match  → public/broll/match_hugel.json
//   node build_hugel.mjs        → beatsheet/hugel.json + avatar_hugel.gen.ts
import fs from "fs";
import { SHOTS } from "./shots_hugel.mjs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1228.62; // avatar 00:20:28.62
const SLUG = "hugel", AVATAR = "hugel_opt.mp4";
const OPEN = 2.0;
const IMG_STYLE = ", realistic color photograph, natural soft daylight, sharp focus, shallow depth of field, rustic farm or garden, no text, no captions, no watermark, no logo";

const caps = JSON.parse(fs.readFileSync("public/captions_hugel_aligned.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const W = caps.map((c) => ({ n: norm(c.text), ms: c.startMs }));
function at(phrase) {
  const t = norm(phrase).split(" ");
  for (let i = 0; i <= W.length - t.length; i++) { let ok = 1; for (let j = 0; j < t.length; j++) if (W[i + j].n !== t[j]) { ok = 0; break; } if (ok) return W[i].ms / 1000; }
  throw new Error("ANCHOR NOT FOUND: " + phrase);
}
const PHRASE_BOUNDS = [];
for (let i = 0; i < caps.length; i++) {
  const prev = caps[i - 1];
  const prevPunct = prev ? /[.,;:!?…]$/.test(prev.text.trim()) : true;
  const gap = prev ? caps[i].startMs - prev.endMs : 9999;
  if (i === 0 || prevPunct || gap > 320) PHRASE_BOUNDS.push(caps[i].startMs / 1000);
}
const capW = caps.map((c) => ({ n: norm(c.text), raw: c.text.trim(), ms: c.startMs }));
let _kid = 0;
function kphrase(phrase, emph = []) {
  const tw = norm(phrase).split(" ");
  for (let i = 0; i <= capW.length - tw.length; i++) {
    let ok = 1; for (let j = 0; j < tw.length; j++) if (capW[i + j].n !== tw[j]) { ok = 0; break; }
    if (ok) {
      const span = capW.slice(i, i + tw.length), t0 = span[0].ms, eset = new Set(emph.map((e) => norm(e)));
      const words = span.map((w) => ({ t: w.raw, at: +((w.ms - t0) / 1000).toFixed(2), ...(eset.has(w.n) ? { hl: true } : {}) }));
      const dur = +(((span[span.length - 1].ms - t0) / 1000) + 1.7).toFixed(2);
      return { id: `kl${++_kid}`, start: +(t0 / 1000).toFixed(2), dur, kind: "kineticline", overlay: true, accent: "amber", words };
    }
  }
  console.warn("⚠ kphrase no encontrada:", phrase); return null;
}

const SECT = [
  ["hook1", at("si estas cansado de regar")],
  ["hook2", at("te voy a dar todo")],
  ["levi", at("me llamo levi")],
  ["truth", at("tu huerta te tiene de esclavo")],
  ["villain", at("pensa en como es tu cantero")],
  ["industry", at("el vivero no te va a contar")],
  ["abuelo", at("la parte que suena a magia")],
  ["mech", at("aca esta el corazon de todo")],
  ["mech2", at("mientras esa madera se pudre")],
  ["mech3", at("larga un calor suave")],
  ["forest", at("lo que hace en el monte")],
  ["drought", at("el del roble enterrado")],
  ["build", at("lo primero es conseguir la madera")],
  ["size", at("el primero es el tamano")],
  ["error", at("ahora si el error")],
  ["wood", at("evita el cedro")],
  ["yearplan", at("el plan de que plantar")],
  ["cost", at("te venden el riego por goteo")],
  ["count", at("hagamos la cuenta")],
  ["emotional", at("la gente escucha amish")],
  ["cta", at("esta semana te pido")],
];
const SECSTART = Object.fromEntries(SECT.map(([k, s]) => [k, s]));
const secEnd = (k) => { const i = SECT.findIndex((x) => x[0] === k); return i + 1 < SECT.length ? SECT[i + 1][1] : TOTAL; };
const POOLKEY = { truth: "villain", industry: "villain", mech2: "mech", mech3: "mech", count: "cost" };

const AV_FULL = [[0, OPEN], [SECSTART.levi, SECSTART.truth], [SECSTART.cta, TOTAL]];
const S = SHOTS;
const PACE = {
  hook1: 0.95, hook2: 1.6, levi: 4.0, truth: 2.5,
  villain: 2.8, industry: 2.8, abuelo: 2.8, mech: 2.8, mech2: 2.8, mech3: 2.8, forest: 2.8, drought: 2.8,
  build: 2.7, size: 2.8, error: 2.8, wood: 2.8, yearplan: 2.8, cost: 2.8, count: 2.8,
  emotional: 3.2, cta: 3.6,
};

const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const have = (nm) => fs.existsSync(`public/broll/${nm}.mp4`);
const REAL_EXT = ["jpg", "jpeg", "png", "webp"];
const realImg = (nm) => { for (const suf of ["", "_1", "_2"]) for (const e of REAL_EXT) { const p = `real/${nm}${suf}.${e}`; if (fs.existsSync(`public/${p}`)) return p; } return null; };
const allMatched = MODE === "build" ? [...new Set(Object.values(S).flatMap((ls) => ls.map((s) => s[0])).filter(have))] : [];
const usage = {}; let lastClip = null; const lastN = [];
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
const pickSrc = (own, secMatched) => {
  if (MODE !== "build") return { name: own, src: null };
  if (have(own)) return { name: own, src: `broll/${own}.mp4` };
  const ri = realImg(own); if (ri) return { name: own, src: ri };
  const nm = pickClip(own, secMatched); return { name: nm, src: have(nm) ? `broll/${nm}.mp4` : null };
};
const fileFor = (...nms) => { for (const nm of nms) { if (have(nm)) return `broll/${nm}.mp4`; const ri = realImg(nm); if (ri) return ri; } return null; };
const imgFor = (...nms) => { for (const nm of nms) { const ri = realImg(nm); if (ri) return ri; } return null; };

const CLIPS = []; let _bid = 0;
for (const [key] of SECT) {
  if (MODE === "build" && key === "hook1") continue;
  const list = S[key] || S[POOLKEY[key]] || [];
  if (!list.length) continue;
  let s0 = SECSTART[key], e0 = secEnd(key); if (s0 < OPEN) s0 = OPEN;
  const span = e0 - s0, pace = PACE[key] || 4.5;
  const secMatched = [...new Set(list.map((s) => s[0]).filter(have))];
  if (MODE === "match") {
    for (let i = 0; i < list.length; i++) { const t = +(s0 + (i + 0.5) * (span / list.length)).toFixed(2); const [own, query, concept] = list[i]; CLIPS.push([t, `b${++_bid}_${own}`, own, Array.isArray(query) ? query : [query], concept]); }
    continue;
  }
  const minGap = Math.max(0.9, pace * 0.6); const bounds = []; let lastB = -99;
  for (const t of PHRASE_BOUNDS) { if (t >= s0 - 1e-6 && t < e0 && t - lastB >= minGap) { bounds.push(t); lastB = t; } }
  if (bounds.length === 0) bounds.push(s0);
  for (let i = 0; i < bounds.length; i++) { const t = +bounds[i].toFixed(2); if (inFull(t)) continue; const [own, query, concept] = list[i % list.length]; const { name, src } = pickSrc(own, secMatched); CLIPS.push([t, `b${++_bid}_${name}`, name, Array.isArray(query) ? query : [query], concept, src]); }
}

if (MODE === "build") {
  const _at = (p) => { try { return at(p); } catch { return null; } };
  const hpick = (cands, used) => { for (const c of cands) if (have(c) && !used.has(c)) return c; for (const c of cands) if (have(c)) return c; return null; };
  const HOOKSEQ = [
    ["si estas cansado de regar", ["hugel_h_watering_can_daily"]],
    ["verla morirse apenas pega el calor", ["hugel_h_dry_wilting_garden"]],
    ["gastar plata en fertilizante", ["hugel_h_fertilizer_bag"]],
    ["con madera que vos hoy estas tirando", ["hugel_h_logs_pile", "hugel_h_axe_log"]],
    ["se riega solo y se abona solo", ["hugel_h_lush_mound", "hugel_h_rain_on_garden"]],
    ["el mas verde de toda", ["hugel_h_old_farmer_garden", "hugel_h_squash_vine"]],
    ["el unico error que arruina todo", ["hugel_h2_yellow_plants"]],
    ["cosas que ya tenes tiradas en el fondo", ["hugel_h_logs_pile", "hugel_h_axe_log"]],
  ];
  const placed = HOOKSEQ.map(([ph, cands]) => ({ t: _at(ph), cands })).filter((x) => x.t != null).sort((a, b) => a.t - b.t);
  let hid = 0; const usedH = new Set();
  for (let i = 0; i < placed.length; i++) {
    const t = i === 0 ? OPEN : placed[i].t; const nm = hpick(placed[i].cands, usedH); if (!nm) continue; usedH.add(nm);
    CLIPS.push([+(t + 0.05).toFixed(2), `bh${++hid}_${nm}`, nm, [""], "hook"]);
    const nt = i + 1 < placed.length ? placed[i + 1].t : t + 4; const gap = nt - t;
    if (gap > 2.6) { const slots = Math.min(3, Math.floor(gap / 2.4)); for (let k = 1; k <= slots; k++) { const alt = pickClip(placed[i].cands.find((c) => have(c)) || placed[i].cands[0], allMatched); if (alt) CLIPS.push([+(t + (gap * k) / (slots + 1)).toFixed(2), `bh${++hid}_${alt}`, alt, [""], "hook"]); } }
  }
  console.log(`hook1 anclado: ${placed.length}/${HOOKSEQ.length} · ${hid} clips`);
}
CLIPS.sort((a, b) => a[0] - b[0]);

if (MODE === "match") {
  const seen = new Set(); const M = [];
  for (const [, , name, query, concept] of CLIPS) { if (seen.has(name)) continue; seen.add(name); M.push({ name, query, concept, dur: 6 }); }
  fs.mkdirSync("public/broll", { recursive: true });
  fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(M, null, 2));
  console.log(`match_${SLUG}.json: ${M.length}`); process.exit(0);
}

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

// ── ANECSEQ: imágenes BESPOKE del abuelo en el ms EXACTO de su anécdota ──
const ANECSEQ = [
  ["se cayo un roble grande", "hugel_gf_fallen_oak"],
  ["agarro el hacha para hacer lena", "hugel_gf_axe_log"],
  ["vale mas enterrada que quemada", "hugel_gf_elder_stops"],
  ["tiraron adentro el tronco entero", "hugel_gf_bury_logs"],
  ["le pusieron estiercol y unos restos arriba", "hugel_gf_cover_soil"],
  ["plantaron encima", "hugel_gf_boy_plant_mound"],
  ["el del roble enterrado", "hugel_gf_green_mound_drought"],
  ["regaba lo que podia con baldes", "hugel_gf_water_garden"],
  ["se llaman miselio", "hugel_gf_mycelium_wood"],
  ["la tierra mas negra y mas rica", "hugel_gf_black_soil"],
  ["un pecado quemar algo", "hugel_gf_brush_pile"],
];
{
  let n = 0;
  for (const [ph, img] of ANECSEQ) {
    if (!fs.existsSync(`public/img/${img}.png`)) continue;
    let t; try { t = at(ph); } catch { continue; }
    if (inFull(t)) continue;
    let idx = -1; for (let i = 0; i < beats.length; i++) { if (beats[i].start <= t + 0.01) idx = i; else break; }
    if (idx < 0 || beats[idx].kind !== "raw") continue;
    beats[idx] = { id: beats[idx].id, start: beats[idx].start, dur: beats[idx].dur, kind: "raw", src: `img/${img}.png`, darken: 0, anec: true }; n++;
  }
  console.log(`anecseq: ${n}/${ANECSEQ.length} imágenes del abuelo`);
}

const ck = (text) => ({ text, state: "done" });
const atc = (p) => { try { return at(p); } catch { console.warn("⚠ comp anchor missing:", p); return null; } };
const atO = (p, o = 0) => { const v = atc(p); return v == null ? null : +(v + o).toFixed(2); };
const _firstClip = (key) => { for (const [nm] of (SHOTS[key] || [])) if (fs.existsSync(`public/broll/${nm}.mp4`)) return nm; return null; };

const COMPONENTS = [
  // HOOK — open loop el error
  { t: atc("el unico error que arruina todo"), id: "cmp_loop", kind: "mistake", number: "!", eyebrow: "EN ESTE VIDEO",
    title: "El error que arruina todo el primer año", desc: "Casi todos lo cometen, les sale mal, y creen que no servía.",
    bg: "yellowing nitrogen starved vegetable plants in a garden bed" },
  { t: atc("se riega solo y se abona solo"), id: "cmp_blur_promise", kind: "blurreveal", overlay: true, dur: 3.0,
    eyebrow: "Una sola vez · 20 años", title: "Se riega y se abona solo", accent: "amber" },
  // VILLANO — el balde agujereado (impacto)
  { t: atc("un balde que tiene el fondo agujereado"), id: "cmp_bucket", kind: "impact", dur: 4.4, hitAt: 1.1, boom: 0, darken: 0.45,
    setup: "¿Regás y al otro día está seco?", impact: "Tu cantero NO guarda agua.", impactAccent: "danger",
    bg: "water draining away from dry cracked garden soil" },
  // VILLANO — la suscripción del vivero (lielist)
  { t: atc("el vivero no te va a contar"), id: "cmp_vivero", kind: "lielist", accent: "danger",
    title: "Por qué el vivero quiere tu suelo pobre", items: ["Riego por goteo", "Fertilizante cada temporada", "Canteros de plástico"],
    bg: "shelves of fertilizer bags and irrigation kits at a garden store" },
  // ABUELO — la cita del viejo (quote)
  { t: atc("vale mas enterrada que quemada"), id: "cmp_quote_wood", kind: "quote", hue: "amber", accent: "amber", fontSize: 88,
    text: "Esa madera vale más *enterrada* que quemada.",
    bg: "an old amish farmer holding an axe beside a fallen oak log, serious" },
  // ★ HugelDiagram — el mecanismo (corte transversal animado)
  { t: atc("aca esta el corazon de todo"), id: "cmp_hugel_diag", kind: "hugel", dur: 9.0, mode: "anatomy",
    title: "Qué hay debajo del montículo" },
  // MECANISMO — la esponja (callout)
  { t: atc("varias veces su propio peso en agua"), id: "cmp_sponge", kind: "callout", hue: "amber", accent: "good",
    figure: "×Varias", eyebrow: "Agua que guarda la madera", caption: "un tronco podrido bebe la lluvia y la devuelve por semanas" },
  // ★ HugelDiagram modo flujo — el agua sube de la madera
  { t: atc("riega la madera desde abajo sola"), id: "cmp_hugel_flow", kind: "hugel", dur: 8.0, mode: "flow",
    title: "El agua sube de la madera a las raíces" },
  // MECANISMO comida (callout)
  { t: atc("se libera de agotas durante veinte anos"), id: "cmp_food", kind: "callout", hue: "amber", accent: "good",
    figure: "20 años", eyebrow: "Alimento de a gotas", caption: "todo lo que el árbol juntó vuelve despacio al suelo" },
  // las 3 cosas (chips)
  { t: atc("esponja de agua despensa de comida"), id: "cmp_three", kind: "chips", hue: "amber",
    title: "Un tronco enterrado hace 3 cosas", chips: ["Esponja de agua", "Despensa de comida", "Calor suave"],
    bg: "rich dark garden soil with a buried rotting log and roots" },
  // BUILD — el método (process)
  { t: atc("abajo de todo van los troncos mas gruesos"), id: "cmp_build_proc", kind: "process", hue: "amber", accent: "good", dur: 8.0,
    title: "Cómo se arma", eyebrow: "Una tarde, una sola vez",
    steps: [{ title: "Troncos gruesos abajo" }, { title: "Ramas, hojas y verde" }, { title: "Estiércol y tierra arriba — y plantás" }] },
  // BUILD — checklist de capas
  { t: atc("madera abajo ramas verde estiercol"), id: "cmp_layers", kind: "checklist", hue: "amber", accent: "good",
    title: "Las capas, de abajo a arriba", eyebrow: "El montículo",
    items: [ck("Troncos gruesos"), ck("Ramas finas"), ck("Hojas y pasto verde"), ck("Estiércol / compost"), ck("Tierra — y a plantar")],
    bg: "a freshly built tall garden mound ready to plant" },
  // SIZE — alto (callout)
  { t: atc("no tengas miedo de hacerlo alto"), id: "cmp_tall", kind: "callout", hue: "amber", accent: "good",
    figure: "Alto", eyebrow: "Más madera = más años", caption: "medio metro, 70 cm, hasta un metro: cuanto más alto, mejor" },
  // ERROR — impacto
  { t: atc("ahora si el error"), id: "cmp_error", kind: "impact", dur: 4.6, hitAt: 1.1, boom: 0, darken: 0.5,
    setup: "El primer año, la madera fresca...", impact: "Te ROBA el nitrógeno.", impactAccent: "danger",
    bg: "yellowing pale nitrogen deficient vegetable plants" },
  // ERROR — las 2 reglas (process)
  { t: atc("son dos las reglas que no podes saltarte"), id: "cmp_rules", kind: "process", hue: "amber", accent: "good", dur: 8.0,
    title: "Las 2 reglas del primer año", eyebrow: "El peaje",
    steps: [{ title: "Capa gruesa de estiércol sobre la madera" }, { title: "Año 1: raíz poco profunda (zapallo, lechuga, papa)" }, { title: "Tomates recién del año 2" }] },
  // WOOD — a evitar (splitlist)
  { t: atc("evita el cedro"), id: "cmp_avoid", kind: "splitlist", palette: "D", cross: true, dur: 7.0,
    title: "Madera que NO sirve", items: ["Cedro, ciprés, eucalipto (resinosas)", "Nogal negro (veneno para tomates)", "Madera tratada o barnizada"] },
  // WOOD — la que sí (checklist)
  { t: atc("roble fresno alamo sauce"), id: "cmp_good_wood", kind: "checklist", hue: "amber", accent: "good",
    title: "Madera perfecta", eyebrow: "La que tenés a mano",
    items: [ck("Roble"), ck("Fresno"), ck("Álamo / sauce"), ck("Frutales viejos"), ck("Cuanto más vieja, mejor")],
    bg: "a stack of hardwood oak and fruit tree logs on a farm" },
  // YEARPLAN — growthtimeline (año por año)
  { t: atc("el plan de que plantar"), id: "cmp_years", kind: "growthtimeline", dur: 7.0,
    title: "Qué plantar, año por año",
    stages: [{ label: "Año 1", sub: "zapallo, lechuga, papa" }, { label: "Año 2", sub: "tomates, pimientos" }, { label: "Año 3-4", sub: "explota" }, { label: "Año 10-20", sub: "tierra negra" }],
    clipBg: _firstClip("yearplan") || _firstClip("build") },
  // COST — la suscripción (bars)
  { t: atc("pagando una suscripcion una cuota mensual"), id: "cmp_subs", kind: "bars", hue: "amber", accent: "good", unit: "", dur: 8.0,
    title: "Lo que te ahorrás en 10 años", eyebrow: "Comprado vs enterrado",
    bars: [{ label: "Goteo + canteros + fertilizante", value: 100, display: "Una cuota sin fin", tone: "danger" }, { label: "Madera enterrada", value: 0, display: "$0", winner: true }] },
  // COUNT — el resumen (process)
  { t: atc("hagamos la cuenta"), id: "cmp_count", kind: "process", hue: "amber", accent: "good", dur: 8.0,
    title: "Lo que ganás", eyebrow: "Con un montículo bien hecho",
    steps: [{ title: "Regás 1 vez por semana (o menos)" }, { title: "$0 en fertilizante por años" }, { title: "Dura 10-20 años → tierra negra" }] },
  // EMOCIONAL — cita
  { t: atc("en la naturaleza nada se muere del todo"), id: "cmp_quote_nature", kind: "quote", hue: "amber", accent: "amber", fontSize: 80,
    text: "El árbol que cae *alimenta* al que viene.",
    bg: "a green seedling growing from a rotting log on the forest floor, golden hour" },
  // EMOCIONAL — gratis (callout)
  { t: atc("solo hay que enterrarla en lugar de quemarla"), id: "cmp_free", kind: "callout", hue: "amber", accent: "good",
    figure: "Gratis", eyebrow: "La madera que ibas a quemar", caption: "es justo lo que tu huerta necesita" },

  // ── composites imagen+texto (fotos reales) ──
  { t: atc("se convierte en una esponja"), id: "cmp_half_sponge", kind: "half", side: "right", hue: "amber",
    srcFile: fileFor("hugel_m_wet_sponge_wood", "hugel_m_log_holds_water", "hugel_gf_mycelium_wood"), kicker: "La madera\nbebe la lluvia\ny la guarda" },
  { t: atc("seguia verde"), id: "cmp_half_drought", kind: "half", side: "left", hue: "amber",
    srcFile: fileFor("hugel_gf_green_mound_drought", "hugel_d_green_mound"), kicker: "Verde en plena\nsequía —\nsin regarlo" },
  { t: atc("se llena de hongos"), id: "cmp_loupe_myc", kind: "loupe", accent: "good",
    imgFile: imgFor("hugel_gf_mycelium_wood", "hugel_s_mycelium_white", "hugel_f_moss_log_macro"), focusX: 0.5, focusY: 0.5, zoom: 1.8, label: "Micelio: la red que reparte el agua" },
  { t: atc("la tierra mas negra y mas rica"), id: "cmp_focus_soil", kind: "focuscard", accent: "good", imageSide: "right",
    imgFileBg: imgFor("hugel_gf_black_soil", "hugel_h_rich_dark_soil"), imgFile: imgFor("hugel_gf_black_soil", "hugel_h_rich_dark_soil"),
    eyebrow: "A los 10-20 años", title: "La tierra más negra de tu vida", desc: "Cuando la madera se descompone del todo, te queda oro negro." },

  // ── variedad estructurada extra (peso) ──
  { t: atc("te venden el riego por goteo"), id: "cmp_bars_goteo", kind: "bars", hue: "amber", accent: "good", unit: "", dur: 9.0,
    title: "Lo que te vende el vivero", eyebrow: "Para hacer lo mismo, gratis",
    bars: [{ label: "Riego por goteo + bomba", value: 80, display: "$$$", tone: "danger" }, { label: "Cantero elevado", value: 60, display: "$$", tone: "danger" }, { label: "Fertilizante cada año", value: 90, display: "$$$/año", tone: "danger" }, { label: "Troncos enterrados", value: 0, display: "$0", winner: true }] },
  { t: atc("del segundo ano en adelante"), id: "cmp_proc_years", kind: "process", hue: "amber", accent: "good", dur: 9.0,
    title: "Qué plantar, año por año", eyebrow: "Para no equivocarte",
    steps: [{ title: "Año 1: zapallo, calabaza, lechuga, papa" }, { title: "Año 2+: tomate, pimiento, maíz — todo lo exigente" }, { title: "Año 3+: solo plantás y cosechás, el cantero hace el resto" }] },
  { t: atc("plantas amarillas y flacas"), id: "cmp_split_mistake", kind: "splitlist", palette: "D", cross: true, dur: 9.0,
    title: "El error del primer año", items: ["Usar madera fresca sin estiércol arriba", "Plantar tomates exigentes el año 1", "Hacer el montículo chico y finito"] },
  { t: atc("madera abajo ramas verde estiercol tierra arriba"), id: "cmp_recap_build", kind: "checklist", hue: "amber", accent: "good", dur: 10.0,
    title: "El montículo, de abajo hacia arriba", eyebrow: "Una sola tarde",
    items: [ck("Troncos gruesos (la esponja)"), ck("Ramas finas en los huecos"), ck("Hojas, pasto, restos verdes"), ck("Capa de estiércol o compost"), ck("Tierra arriba — y plantás")] },
  { t: atc("elegis un lugar con sol"), id: "cmp_proc_two", kind: "process", hue: "amber", accent: "good", dur: 10.0,
    title: "Dos formas de armarlo", eyebrow: "Elegí según tu suelo",
    steps: [{ title: "Fácil: apilás todo arriba del suelo, como una loma" }, { title: "Mejor: cavás una zanja de medio metro y enterrás" }, { title: "Las dos funcionan — la zanja dura más años" }] },
  { t: atc("regas una vez por semana"), id: "cmp_bars_water", kind: "bars", hue: "amber", accent: "good", unit: "", dur: 11.0,
    title: "Cuánto vas a regar", eyebrow: "Cantero común vs montículo",
    bars: [{ label: "Cantero común, en verano", value: 100, display: "Todos los días", tone: "danger" }, { label: "Montículo de troncos", value: 12, display: "1 vez/semana", winner: true }] },
  { t: atc("una buena capa de estiercol"), id: "cmp_proc_nitro", kind: "process", hue: "amber", accent: "good", dur: 12.0,
    title: "El peaje del nitrógeno", eyebrow: "La capa que no podés saltarte",
    steps: [{ title: "Los hongos chupan nitrógeno al empezar" }, { title: "El estiércol arriba se los da a ellos" }, { title: "Así no se lo roban a tus plantas" }] },
  { t: atc("te queda como una loma"), id: "cmp_anno_mound", kind: "annotated", hue: "amber", eyebrow: "El montículo terminado", dur: 7.0,
    imgFile: (fs.existsSync("public/img/hugel_gf_mound_lush.png") ? "img/hugel_gf_mound_lush.png" : "img/hugel_gf_cover_soil.png"),
    annotations: [
      { kind: "arrow", x: 0.5, y: 0.32, fromX: 0.78, fromY: 0.1, label: "Plantás acá arriba", color: "good" },
      { kind: "circle", x: 0.5, y: 0.72, w: 0.26, label: "Madera enterrada = esponja", color: "amber" },
    ] },
];

// ── insertar componentes ──
let nComp = 0; const placedC = new Set(); const overlayComps = [];
for (const c of [...COMPONENTS].sort((a, b) => (a.t ?? 0) - (b.t ?? 0))) {
  if (c.t == null) continue;
  const { t, bg, leftBg, rightBg, clipBg, kind, overlay, ...rest } = c;
  if (["half", "loupe", "splitexplain", "focuscard", "termcard"].includes(kind) && !rest.srcFile && !rest.imgFile) { console.warn("⚠ composite sin archivo:", c.id); continue; }
  if (rest.srcFile) { rest.src = rest.srcFile; delete rest.srcFile; }
  if (rest.imgFile) { rest.image = rest.imgFile; delete rest.imgFile; }
  if (rest.imgFileBg || (kind === "focuscard" || kind === "splitexplain")) { rest.bg = rest.imgFileBg || rest.image; delete rest.imgFileBg; }
  if (overlay) { const ab = { id: c.id, start: +t.toFixed(2), dur: c.dur || 3.0, kind, overlay: true }; delete rest.id; delete rest.dur; Object.assign(ab, rest); overlayComps.push(ab); nComp++; continue; }
  let idx = -1; for (let i = 0; i < beats.length; i++) { if (beats[i].start <= t + 0.01) { if (!placedC.has(beats[i].id)) idx = i; } else break; }
  if (idx < 0) continue;
  const start = beats[idx].start, D = c.dur || 6.0;
  const ab = { id: c.id, start, dur: D, kind }; delete rest.id; Object.assign(ab, rest);
  if (bg) { ab.image = `img/${c.id}_bg.png`; ab.gen = { type: "image", name: `${c.id}_bg`, prompt: bg + IMG_STYLE }; }
  if (clipBg) ab.image = `broll/${clipBg}.mp4`;
  if (c.image && !bg && !clipBg) ab.image = c.image;
  let rm = 1; while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placedC.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab); placedC.add(c.id);
  const next = beats[idx + 1], nextAv = avStarts.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
  ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + D + 1) - start).toFixed(2); nComp++;
}

// ── HOOK BURST + tiling ──
beats.sort((a, b) => a.start - b.start);
{
  const fillers = [];
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i]; if (b.start >= 64 || b.overlay || b.kind === "raw") continue;
    const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL; if (nextStart - b.start <= 5.5) continue;
    let t = +(b.start + 4.2).toFixed(2);
    while (nextStart - t > 1.6) { const nm = pickClip(allMatched[0], allMatched); if (!nm || !have(nm)) break; fillers.push({ id: `bf_${nm}_${Math.round(t * 10)}`, start: t, dur: 2.4, kind: "raw", src: `broll/${nm}.mp4`, darken: 0 }); t = +(t + 2.6).toFixed(2); }
  }
  beats.push(...fillers); beats.sort((a, b) => a.start - b.start);
}
for (let i = 0; i < beats.length; i++) {
  const b = beats[i], nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  const avAfter = avStarts.filter((s) => s > b.start + 1e-6).sort((x, y) => x - y)[0] ?? Infinity;
  let end = Math.min(nextStart, TOTAL); if (avAfter < end) end = avAfter;
  const gap = end - b.start, ov = b.kind === "raw" ? Math.min(OV, gap * 0.25) : 0;
  b.dur = +(Math.max(0.2, Math.min(end + ov, TOTAL) - b.start)).toFixed(2);
}

// ── overlays SOLO sobre clips ──
const KPHRASES = [
  kphrase("se riega solo y se abona solo durante veinte anos", ["solo", "veinte"]),
  kphrase("vale mas enterrada que quemada", ["enterrada"]),
  kphrase("riega la madera desde abajo sola", ["sola"]),
  kphrase("el primer año es el peaje el resto es todo ganancia", ["ganancia"]),
  kphrase("vale mas enterrado que quemado", ["enterrado"]),
].filter(Boolean);
{
  const comps = beats.filter((b) => !b.overlay && b.kind !== "raw");
  const overComp = (o) => comps.some((c) => o.start < c.start + c.dur - 0.2 && o.start + o.dur > c.start + 0.2);
  const all = [...KPHRASES, ...overlayComps].sort((a, b) => a.start - b.start); const kept = [];
  for (const o of all) { if (overComp(o) || kept.some((k) => o.start < k.start + k.dur && o.start + o.dur > k.start)) continue; kept.push(o); }
  beats.push(...kept); console.log(`overlays: ${kept.length} sobre clips`);
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, clipsfirst: true, beats }, null, 2));

const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"]; const pip = []; let k = 0;
const _bw = beats.filter((b) => !b.overlay && b.kind === "raw");
for (let i = 0; i < _bw.length; i++) { if (i % 5 === 3 && !inFull(_bw[i].start)) { pip.push([_bw[i].start, _bw[i].start + Math.min(_bw[i].dur, 6), POS[k % POS.length]]); k++; } }
const firstClip = CLIPS.length ? Math.max(CLIPS[0][0], OPEN) : OPEN;
const modeAt = (t) => { if (t < OPEN - 1e-6) return "full"; if (AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full"; const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6); return p ? p[2] : "hidden"; };
const pts = [...new Set([0, OPEN, firstClip, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync("src/VideoEdit/avatar_hugel.gen.ts", `// avatar_hugel.gen.ts — GENERADO por build_hugel.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_HUGEL = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const isImg = (b) => b && b.kind === "raw" && b.gen;
console.log(`=== build_hugel ===`);
console.log(`beats: ${beats.length} · clips: ${beats.filter((b) => !b.overlay && b.kind === "raw" && (b.src || "").startsWith("broll/")).length} · web: ${beats.filter((b) => !b.overlay && b.kind === "raw" && (b.src || "").startsWith("real/")).length} · IA: ${beats.filter(isImg).length} · componentes: ${nComp}`);
