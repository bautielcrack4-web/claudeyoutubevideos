// build_ollas.mjs — Levi Lapp Jardín (ES) · "Enterrás una olla de barro y tu huerta se riega sola".
// Riego con ollas. CLIPS-FIRST + imágenes web + imágenes bespoke abuela/abuelo (gpt-image-2) + OllaDiagram.
//   node build_ollas.mjs match  → public/broll/match_ollas.json
//   node build_ollas.mjs        → beatsheet/ollas.json + avatar_ollas.gen.ts
import fs from "fs";
import { SHOTS } from "./shots_ollas.mjs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1064.36; // avatar ollas, último endMs alineado
const SLUG = "ollas", AVATAR = "ollas_opt.mp4";
const OPEN = 2.0;
const IMG_STYLE = ", realistic color photograph, natural soft daylight, sharp focus, shallow depth of field, rustic farm or garden, no text, no captions, no watermark, no logo";

const caps = JSON.parse(fs.readFileSync("public/captions_ollas_aligned.json", "utf8"));
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
  ["hook2", at("te voy a mostrar exactamente")],
  ["levi", at("me llamo levi")],
  ["villain", at("pensa en lo que pasa")],
  ["industry", at("lo que ninguna casa de jardineria")],
  ["abuela", at("la primera olla la enterro")],
  ["mech", at("aca esta el corazon de todo")],
  ["mech2", at("pensalo bien porque es algo")],
  ["nature", at("nunca viste como en la naturaleza")],
  ["history", at("tiene por lo menos dos mil anos")],
  ["abuela2", at("ahora dejame terminar la historia")],
  ["build", at("ahora te muestro como armas")],
  ["build1", at("el primero el mas facil")],
  ["build2", at("el segundo camino el clasico")],
  ["install", at("tengas la que tengas")],
  ["plants", at("que te diga que plantar alrededor")],
  ["error", at("ahora si el error")],
  ["rules", at("las otras tres reglas")],
  ["count", at("hagamos la cuenta")],
  ["amish", at("la gente escucha amish")],
  ["close", at("esa maceta rajada que tenes tirada")],
  ["cta", at("esta semana te pido una cosa")],
  ["next", at("espera al proximo")],
  ["outro", at("cuidense entre ustedes")],
];
const SECSTART = Object.fromEntries(SECT.map(([k, s]) => [k, s]));
const secEnd = (k) => { const i = SECT.findIndex((x) => x[0] === k); return i + 1 < SECT.length ? SECT[i + 1][1] : TOTAL; };
const POOLKEY = { mech2: "mech", nature: "mech", abuela2: "abuela", build1: "build", build2: "build", close: "cta", next: "outro" };

const AV_FULL = [[0, OPEN], [SECSTART.levi, SECSTART.villain], [SECSTART.cta, SECSTART.next], [SECSTART.outro, TOTAL]];
const S = SHOTS;
const PACE = {
  hook1: 0.95, hook2: 1.6, levi: 4.0,
  villain: 2.8, industry: 2.8, abuela: 2.8, mech: 2.6, mech2: 2.8, nature: 3.0, history: 2.8, abuela2: 2.8,
  build: 2.8, build1: 2.8, build2: 2.8, install: 2.6, plants: 2.8, error: 2.6, rules: 2.8, count: 2.8,
  amish: 3.2, close: 3.2, cta: 3.4, next: 3.0, outro: 3.6,
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
    ["si estas cansado de regar", ["ollas_h_watering_daily"]],
    ["el agua se evapora apenas la echas", ["ollas_h_water_evaporating"]],
    ["tus plantas pasen sed en pleno verano", ["ollas_h_wilting_plants"]],
    ["enteras una simple olla de barro", ["ollas_h_terracotta_pot", "ollas_h_bury_pot_garden"]],
    ["esa olla riega tu huerta sola", ["ollas_h_fill_pot_water", "ollas_h_roots_water_soil"]],
    ["setenta por ciento menos de agua", ["ollas_h_water_meter_low", "ollas_h_water_drop_slow"]],
    ["mi abuelo tenia ollas enterradas", ["ollas_h_old_farmer_relaxed", "ollas_h_lush_garden_thriving"]],
    ["tiene dos mil anos y suena a brujeria", ["ollas_h_ancient_pottery"]],
  ];
  const placed = HOOKSEQ.map(([ph, cands]) => ({ t: _at(ph), cands })).filter((x) => x.t != null).sort((a, b) => a.t - b.t);
  let hid = 0; const usedH = new Set();
  for (let i = 0; i < placed.length; i++) {
    const t = i === 0 ? OPEN : placed[i].t; let nm = hpick(placed[i].cands, usedH); if (!nm) nm = pickClip(allMatched[0], allMatched); if (!nm) continue; usedH.add(nm);
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

// ── ANECSEQ: imágenes BESPOKE de la abuela/abuelo en el ms EXACTO ──
const ANECSEQ = [
  ["la primera olla la enterro su abuela", "ollas_gf_grandma_bury"],
  ["una piedra plana arriba de tapa", "ollas_gf_stone_lid"],
  ["dando de tomar a la tierra", "ollas_gf_grandma_pour"],
  ["los tomates de la abuela", "ollas_gf_drought_tomatoes"],
  ["valia mas enterrada en la huerta", "ollas_gf_cracked_buried"],
  ["la suya cuadriculada de ollas", "ollas_gf_grid_pots"],
  ["una olla esmaltada es un balde de plastico", "ollas_gf_glazed_vs_raw"],
  ["las raices de tus plantas buscan el agua", "ollas_gf_roots_wrap"],
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
  console.log(`anecseq: ${n}/${ANECSEQ.length} imágenes bespoke`);
}

const ck = (text) => ({ text, state: "done" });
const atc = (p) => { try { return at(p); } catch { console.warn("⚠ comp anchor missing:", p); return null; } };
const atO = (p, o = 0) => { const v = atc(p); return v == null ? null : +(v + o).toFixed(2); };
const _firstClip = (key) => { for (const [nm] of (SHOTS[key] || [])) if (fs.existsSync(`public/broll/${nm}.mp4`)) return nm; return null; };

const COMPONENTS = [
  // HOOK — open loop: el error que arruina todo
  { t: atc("el unico error que la mayoria comete"), id: "cmp_loop", kind: "mistake", number: "!", eyebrow: "EN ESTE VIDEO",
    title: "El error que hace que no funcione", desc: "Casi todos lo cometen, la planta se seca igual, y creen que era un cuento.",
    bg: "a dead dried up plant next to a shiny glazed ceramic pot in a garden" },
  { t: atc("esa olla riega tu huerta sola"), id: "cmp_blur_promise", kind: "blurreveal", overlay: true, dur: 3.0,
    eyebrow: "Llenás 1 vez por semana", title: "La olla riega sola", accent: "amber" },
  // VILLANO — el agua que se pierde (impact)
  { t: atc("una parte se evapora al instante"), id: "cmp_waste", kind: "impact", dur: 4.4, hitAt: 1.1, boom: 0, darken: 0.45,
    setup: "¿Regás arriba de la tierra?", impact: "Casi toda el agua NO llega a la raíz.", impactAccent: "danger",
    bg: "water evaporating and running off dry garden soil under hot sun" },
  // VILLANO — adónde se va el agua (splitlist)
  { t: atc("estas mojando toda la superficie"), id: "cmp_where", kind: "splitlist", palette: "D", cross: true, dur: 7.0,
    title: "Adónde se va el agua que tirás", items: ["Se evapora al aire con el sol", "Escurre por los costados", "Se filtra más hondo que las raíces"] },
  // INDUSTRIA — la suscripción del vivero (lielist)
  { t: atc("te venden el riego por goteo"), id: "cmp_vivero", kind: "lielist", accent: "danger",
    title: "Lo que te vende el vivero", items: ["Riego por goteo con bomba", "Mangueritas que se tapan", "Programadores que se rompen"],
    bg: "shelves of drip irrigation kits and timers at a garden store" },
  // ★ OllaDiagram — el mecanismo (corte transversal animado)
  { t: atc("aca esta el corazon de todo"), id: "cmp_olla_anat", kind: "olla", dur: 9.0, mode: "anatomy",
    title: "Qué pasa bajo la tierra" },
  // MECÁNICA — el barro poroso (callout)
  { t: atc("millones de poros microscopicos"), id: "cmp_pores", kind: "callout", hue: "amber", accent: "good",
    figure: "Poros", eyebrow: "Barro cocido sin esmaltar", caption: "el agua pasa de a poco por la pared de barro" },
  // ★ OllaDiagram modo flujo — el agua sale sola cuando la tierra está seca
  { t: atc("la tierra seca empieza a chupar el agua"), id: "cmp_olla_flow", kind: "olla", dur: 8.0, mode: "flow",
    title: "La tierra decide cuánta agua sacar" },
  // MECÁNICA — cero desperdicio (chips)
  { t: atc("cero evaporacion cero escurrimiento"), id: "cmp_zero", kind: "chips", hue: "amber",
    title: "Lo que la olla elimina", chips: ["Cero evaporación", "Cero escurrimiento", "Cero agua perdida"],
    bg: "moist dark soil with plant roots around a buried clay pot" },
  // MECÁNICA — −70% (callout)
  { t: atc("setenta por ciento menos"), id: "cmp_70", kind: "callout", hue: "amber", accent: "good",
    figure: "−70%", eyebrow: "Agua que ahorrás", caption: "no es que la planta tome menos: ya no se desperdicia nada" },
  // HISTORIA — 2000 años (growthtimeline)
  { t: atc("tiene por lo menos dos mil anos"), id: "cmp_history", kind: "growthtimeline", dur: 7.0,
    title: "Dos mil años regando así",
    stages: [{ label: "China antigua", sub: "vasijas enterradas" }, { label: "Norte de África", sub: "huertos en el desierto" }, { label: "Hoy", sub: "tu huerta" }],
    clipBg: _firstClip("history") },
  // ABUELA — la cita (quote)
  { t: atc("valia mas enterrada en la huerta"), id: "cmp_quote_pot", kind: "quote", hue: "amber", accent: "amber", fontSize: 80,
    text: "Vale más *enterrada* en la huerta que entera en la cocina.",
    bg: "an old cracked terracotta pot buried beside a thriving tomato plant, golden hour" },
  // BUILD — las dos formas (process)
  { t: atc("tenes dos caminos"), id: "cmp_build_proc", kind: "process", hue: "amber", accent: "good", dur: 8.0,
    title: "Dos formas de hacer tu olla", eyebrow: "Según lo que tengas",
    steps: [{ title: "Fácil: una maceta de terracota, tapás el agujero" }, { title: "Clásica: dos macetas pegadas boca con boca" }, { title: "Las dos riegan igual de bien" }] },
  // INSTALL — el método (checklist)
  { t: atc("cavas un pozo al lado"), id: "cmp_install", kind: "checklist", hue: "amber", accent: "good", dur: 8.0,
    title: "Cómo se entierra", eyebrow: "Treinta segundos por semana después",
    items: [ck("Cavás un pozo al lado de la planta"), ck("Enterrás la olla hasta el cuello"), ck("La llenás de agua y la tapás"), ck("Plantás en círculo alrededor"), ck("Rellenás 1 vez por semana")],
    bg: "burying a terracotta pot up to its neck in a vegetable garden bed" },
  // PLANTAS — qué plantar (checklist)
  { t: atc("las que mas la agradecen"), id: "cmp_plants", kind: "checklist", hue: "amber", accent: "good",
    title: "Lo que crece como nunca", eyebrow: "Raíz que busca a los costados",
    items: [ck("Tomates"), ck("Pimientos y berenjenas"), ck("Zapallos, pepinos, melones"), ck("Lechugas")],
    bg: "thriving tomatoes peppers and squash in a lush vegetable garden" },
  // ERROR — impacto: el barro esmaltado
  { t: atc("ahora si el error"), id: "cmp_error", kind: "impact", dur: 4.6, hitAt: 1.1, boom: 0, darken: 0.5,
    setup: "Usás una olla linda, esmaltada...", impact: "Sella los poros. No riega NADA.", impactAccent: "danger",
    bg: "a shiny glazed colorful ceramic pot, glossy surface close up" },
  // ERROR — poroso vs esmaltado (splitlist)
  { t: atc("tiene que ser barro crudo"), id: "cmp_porous", kind: "splitlist", palette: "D", cross: true, dur: 7.0,
    title: "El barro que SÍ riega", items: ["Crudo, mate, opaco, áspero", "Sin esmaltar, sin pintar, sin barniz", "Mojado se oscurece y chupa el agua"] },
  // REGLAS — las tres (process)
  { t: atc("las otras tres reglas"), id: "cmp_rules", kind: "process", hue: "amber", accent: "good", dur: 8.0,
    title: "Las 3 reglas que importan", eyebrow: "Para que no te decepciones",
    steps: [{ title: "Tapá siempre (evaporación y mosquitos)" }, { title: "En invierno, vaciá y desenterrá (el hielo raja)" }, { title: "Revisá que las raíces no la tapen" }] },
  // CUENTA — lo que ganás (bars)
  { t: atc("hagamos la cuenta"), id: "cmp_count", kind: "bars", hue: "amber", accent: "good", unit: "", dur: 9.0,
    title: "Manguera vs olla de barro", eyebrow: "Lo que ganás",
    bars: [{ label: "Regar con manguera, en verano", value: 100, display: "Todos los días", tone: "danger" }, { label: "Olla de barro enterrada", value: 14, display: "1 vez/semana · −70% agua", winner: true }] },
  // CUENTA — gratis (callout)
  { t: atc("o directamente gratis"), id: "cmp_free", kind: "callout", hue: "amber", accent: "good",
    figure: "Gratis", eyebrow: "La maceta rajada que ibas a tirar", caption: "la grieta de arriba no importa: enterrada igual transpira y riega" },
  // AMISH — la cita del agua (quote)
  { t: atc("el agua no se le da a la tierra de arriba"), id: "cmp_quote_water", kind: "quote", hue: "amber", accent: "amber", fontSize: 76,
    text: "El agua se da despacio, abajo, en la raíz — como a un *recién nacido*.",
    bg: "gentle hands watering the base of a small plant, soft golden light" },

  // ── estructurados extra (peso/variedad para varcheck) ──
  { t: atc("una pequena fortuna"), id: "cmp_fortune_bars", kind: "bars", hue: "amber", accent: "good", unit: "", dur: 8.0,
    title: "Riego por goteo vs olla de barro", eyebrow: "Lo que sale cada uno",
    bars: [{ label: "Goteo: bomba, mangueras, programador", value: 100, display: "Una fortuna", tone: "danger" }, { label: "Una olla de terracota", value: 6, display: "$5 o gratis", winner: true }] },
  { t: atc("por lo menos dos mil anos"), id: "cmp_2000_callout", kind: "callout", hue: "amber", accent: "good",
    figure: "2000", eyebrow: "Años regando así", caption: "de la China antigua al desierto de África: lo más eficiente que se inventó" },
  { t: atc("treinta segundos"), id: "cmp_30s_callout", kind: "callout", hue: "amber", accent: "good",
    figure: "30 seg", eyebrow: "Tu trabajo por semana", caption: "levantar la tapa, llenar, tapar — el resto lo hace la tierra" },
  { t: atc("una olla mediana riega"), id: "cmp_circle_callout", kind: "callout", hue: "amber", accent: "good",
    figure: "½ metro", eyebrow: "Lo que riega una olla mediana", caption: "para una huerta grande, una cada medio metro" },
  { t: atc("el agua al congelarse"), id: "cmp_winter_callout", kind: "callout", hue: "amber", accent: "danger",
    figure: "Invierno", eyebrow: "La regla que salva la olla", caption: "si hiela, vaciala y desenterrala: el hielo la raja" },

  // ── composites imagen+texto ──
  { t: atc("se enroscan alrededor de la olla"), id: "cmp_loupe_roots", kind: "loupe", accent: "good",
    imgFile: (fs.existsSync("public/img/ollas_gf_roots_wrap.png") ? "img/ollas_gf_roots_wrap.png" : imgFor("ollas_m_roots_wrap_pot")), focusX: 0.5, focusY: 0.5, zoom: 1.8, label: "Las raíces se pegan al barro y beben directo" },
  { t: atc("los tomates de la abuela"), id: "cmp_half_drought", kind: "half", side: "left", hue: "amber",
    srcFile: fileFor("ollas_gf_drought_tomatoes", "ollas_a2_standing_tomatoes"), kicker: "Tomates verdes\nen plena sequía —\ncasi sin regar" },
  { t: atc("el barro bueno"), id: "cmp_focus_clay", kind: "focuscard", accent: "good", imageSide: "right",
    imgFileBg: "img/ollas_gf_glazed_vs_raw.png", imgFile: "img/ollas_gf_glazed_vs_raw.png",
    eyebrow: "La prueba del agua", title: "Barro bueno = barro que chupa", desc: "El poroso se oscurece y absorbe. El esmaltado, no. Esa es toda la diferencia." },
  { t: atc("la suya cuadriculada de ollas"), id: "cmp_anno_grid", kind: "annotated", hue: "amber", eyebrow: "La huerta del abuelo", dur: 7.0,
    imgFile: (fs.existsSync("public/img/ollas_gf_grid_pots.png") ? "img/ollas_gf_grid_pots.png" : null),
    annotations: [
      { kind: "circle", x: 0.5, y: 0.5, w: 0.24, label: "Una olla cada medio metro", color: "amber" },
      { kind: "arrow", x: 0.5, y: 0.3, fromX: 0.78, fromY: 0.08, label: "Toda la huerta se riega sola", color: "good" },
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
  kphrase("esa olla riega tu huerta sola", ["sola"]),
  kphrase("setenta por ciento menos", ["setenta"]),
  kphrase("vale mas enterrada en la huerta que entera en la cocina", ["enterrada"]),
  kphrase("tiene que ser barro crudo", ["crudo"]),
  kphrase("le estoy dando de tomar a la tierra", ["tomar"]),
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
fs.writeFileSync("src/VideoEdit/avatar_ollas.gen.ts", `// avatar_ollas.gen.ts — GENERADO por build_ollas.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_OLLAS = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const isImg = (b) => b && b.kind === "raw" && b.gen;
console.log(`=== build_ollas ===`);
console.log(`beats: ${beats.length} · clips: ${beats.filter((b) => !b.overlay && b.kind === "raw" && (b.src || "").startsWith("broll/")).length} · web: ${beats.filter((b) => !b.overlay && b.kind === "raw" && (b.src || "").startsWith("real/")).length} · IA: ${beats.filter(isImg).length} · componentes: ${nComp}`);
