// build_choclo.mjs — LeviLappJardín (ES) · "Cómo elegir el choclo más dulce... a la antigua amish".
// Versión ESPAÑOLA del video corn. REUSA shots_corn.mjs + los assets corn_* (clips + imágenes web)
// — el visual es idéntico; solo cambian las anclas (transcript ES milimétrico) y los textos.
// Mismos ids de componente (cmp_*) → reusa los fondos cmp_*_bg.png ya generados (gen_deapi los saltea).
//
//   node build_choclo.mjs match  (no necesario: reusa los matches de corn)
//   node build_choclo.mjs        → beatsheet/choclo.json + avatar_choclo.gen.ts
import fs from "fs";
import { SHOTS } from "./shots_corn.mjs"; // mismos conceptos/visuales corn_*

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1362.94; // duración avatar ES (00:22:42.94)
const SLUG = "choclo", AVATAR = "choclo_opt.mp4";
const OPEN = 2.0;
const IMG_STYLE = ", realistic color photograph, natural soft daylight, sharp focus, shallow depth of field, rustic farm or kitchen, no text, no captions, no watermark, no logo";

// ── anclaje por captions MILIMÉTRICAS ES ──
const caps = JSON.parse(fs.readFileSync("public/captions_choclo_aligned.json", "utf8"));
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

// ── secciones (anclas ES) ──
const SECT = [
  ["hook1", at("para cuando termine este video")],
  ["hook2", at("por que importa")],
  ["levi", at("me llamo levi")],
  ["truth", at("antes de las seis senales")],
  ["villain", at("el maiz dulce tiene un secreto")],
  ["store", at("ahora pensa en el maiz")],
  ["heirloom", at("una segunda razon")],
  ["heirloom2", at("el maiz que cultivaba mi abuelo")],
  ["s1", at("mira las hojas")],
  ["anec1", at("te cuento una historia cortita")],
  ["s2", at("la senal que sigue son los pelos")],
  ["s3", at("vas a palpar la mazorca")],
  ["anec2", at("cuando queriamos saber al dia")],
  ["s4", at("la senal que sigue es la mas rapida")],
  ["s5", at("casi nadie la revisa")],
  ["anec3", at("quiero contarte una cosa mas")],
  ["s6", at("me guardaba la que mas sorprende")],
  ["roast", at("podes asarlas con todo y hojas")],
  ["recap", at("dejame juntarlo todo")],
  ["emotional", at("la gente escucha amish")],
  ["cta", at("si esto te sirvio")],
];
const SECSTART = Object.fromEntries(SECT.map(([k, s]) => [k, s]));
const secEnd = (k) => { const i = SECT.findIndex((x) => x[0] === k); return i + 1 < SECT.length ? SECT[i + 1][1] : TOTAL; };
const POOLKEY = { store: "villain", heirloom: "villain", heirloom2: "heirloom" };

const AV_FULL = [
  [0, OPEN],
  [SECSTART.levi, SECSTART.truth],
  [SECSTART.cta, TOTAL],
];

const S = SHOTS;
const PACE = {
  hook1: 0.95, hook2: 1.6, levi: 4.0, truth: 2.3,
  villain: 2.8, store: 2.8, heirloom: 2.8, heirloom2: 2.8,
  s1: 2.8, anec1: 2.8, s2: 2.8, s3: 2.8, anec2: 2.8, s4: 2.6, s5: 2.6, anec3: 2.8, s6: 2.8,
  roast: 2.6, recap: 2.2, emotional: 3.2, cta: 3.6,
};

const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const have = (nm) => fs.existsSync(`public/broll/${nm}.mp4`);
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
const fileFor = (...nms) => { for (const nm of nms) { if (have(nm)) return `broll/${nm}.mp4`; const ri = realImg(nm); if (ri) return ri; } return null; };
const imgFor = (...nms) => { for (const nm of nms) { const ri = realImg(nm); if (ri) return ri; } return null; };

const CLIPS = [];
let _bid = 0;
for (const [key] of SECT) {
  if (MODE === "build" && key === "hook1") continue;
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

// ── HOOK1 anclado frase-por-frase (ES) ──
if (MODE === "build") {
  const _at = (p) => { try { return at(p); } catch { return null; } };
  const hpick = (cands, used) => {
    for (const c of cands) if (have(c) && !used.has(c)) return c;
    for (const c of cands) if (have(c)) return c;
    return null;
  };
  const HOOKSEQ = [
    ["cualquier monton de maiz dulce", ["corn_h1_bin_pile_store", "corn_h1_market_corn_crates"]],
    ["en un puesto al borde del camino", ["corn_h1_roadside_stand", "corn_h1_basket_market_corn"]],
    ["la mazorca mas dulce de todas", ["corn_h1_hand_grab_ear", "corn_h1_hand_point_corn"]],
    ["en unos 10 segundos", ["corn_h1_corn_close_spin", "corn_h1_hands_feel_ear"]],
    ["con las manos", ["corn_h1_hands_feel_ear", "corn_h1_hands_husk_open"]],
    ["sin pelar una sola hoja", ["corn_h1_husk_green_tight", "corn_h1_husk_peel_reveal"]],
    ["como sabian los viejos", ["corn_h1_grandfather_hands", "corn_h1_amish_farmer_field"]],
    ["nunca mas vas a llevarte a casa una mazorca mala", ["corn_h1_husk_pale_dry", "corn_h1_husk_papery_edge"]],
    ["la ultima la sexta", ["corn_h1_husk_peel_reveal", "corn_h1_torn_husks_pile"]],
    ["mas sorprende a la gente", ["corn_h1_hands_husk_open", "corn_h1_peel_husk_store"]],
    ["quedate hasta el final", ["corn_h1_field_dawn", "corn_h1_pull_ear_stalk"]],
  ];
  const placed = HOOKSEQ.map(([ph, cands]) => ({ t: _at(ph), cands })).filter((x) => x.t != null);
  placed.sort((a, b) => a.t - b.t);
  let hid = 0; const usedH = new Set();
  for (let i = 0; i < placed.length; i++) {
    const t = i === 0 ? OPEN : placed[i].t;
    const nm = hpick(placed[i].cands, usedH);
    if (!nm) continue;
    usedH.add(nm);
    CLIPS.push([+(t + 0.05).toFixed(2), `bh${++hid}_${nm}`, nm, [""], "hook"]);
    const nt = i + 1 < placed.length ? placed[i + 1].t : t + 4;
    const gap = nt - t;
    if (gap > 2.6) {
      const slots = Math.min(3, Math.floor(gap / 2.4));
      for (let k = 1; k <= slots; k++) {
        const alt = pickClip(placed[i].cands.find((c) => have(c)) || placed[i].cands[0], allMatched);
        if (alt) CLIPS.push([+(t + (gap * k) / (slots + 1)).toFixed(2), `bh${++hid}_${alt}`, alt, [""], "hook"]);
      }
    }
  }
  console.log(`hook1 anclado: ${placed.length}/${HOOKSEQ.length} frases · ${hid} clips`);
}
CLIPS.sort((a, b) => a[0] - b[0]);

if (MODE === "match") {
  const seen = new Set(); const M = [];
  for (const [, , name, query, concept] of CLIPS) { if (seen.has(name)) continue; seen.add(name); M.push({ name, query, concept, dur: 6 }); }
  fs.mkdirSync("public/broll", { recursive: true });
  fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(M, null, 2));
  console.log(`match_${SLUG}.json: ${M.length}`); process.exit(0);
}

// ── BUILD ──
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

// ── ANECSEQ: imágenes BESPOKE del abuelo (gpt-image-2) en el ms EXACTO de cada anécdota ──
const ANECSEQ = [
  ["sacaba la mas dulce de la mesa", "corn_gf_pick_stand"],
  ["lo bastante alto para llegar al canasto", "corn_gf_amos_portrait"],
  ["la caminata del campo a la cocina", "corn_gf_walk_field"],
  ["guardaba semilla ano tras ano", "corn_gf_seed_save"],
  ["no hay nada en esta tierra que sepa como el", "corn_gf_heirloom_hold"],
  ["agarraba las mazorcas de arriba del monton", "corn_gf_hurried_man"],
  ["en la sombra del monton", "corn_gf_reach_shade"],
  ["tres mazorcas con las hojas tan verdes", "corn_gf_hand_over"],
  ["frotaba los pelos entre dos dedos", "corn_gf_roll_silk"],
  ["clavaba la una del pulgar en un solo grano", "corn_gf_thumbnail"],
  ["dejalo en la cana", "corn_gf_check_field"],
  ["una en cada mano", "corn_gf_weigh_two"],
  ["con el rocio todavia sobre todo", "corn_gf_dawn_harvest"],
  ["de la misma forma que sabia su padre", "corn_gf_hands_golden"],
  ["la comida en su mesa", "corn_gf_table_food"],
];
{
  let n = 0;
  for (const [ph, img] of ANECSEQ) {
    if (!fs.existsSync(`public/img/${img}.png`)) continue;
    let t; try { t = at(ph); } catch { continue; }
    if (inFull(t)) continue;
    let idx = -1;
    for (let i = 0; i < beats.length; i++) { if (beats[i].start <= t + 0.01) idx = i; else break; }
    if (idx < 0 || beats[idx].kind !== "raw") continue;
    beats[idx] = { id: beats[idx].id, start: beats[idx].start, dur: beats[idx].dur, kind: "raw", src: `img/${img}.png`, darken: 0, anec: true };
    n++;
  }
  console.log(`anecseq: ${n}/${ANECSEQ.length} imágenes del abuelo ancladas`);
}

const ck = (text) => ({ text, state: "done" });
const atc = (p) => { try { return at(p); } catch { console.warn("⚠ comp anchor missing:", p); return null; } };
const atO = (p, o = 0) => { const v = atc(p); return v == null ? null : +(v + o).toFixed(2); };
const _firstClip = (key) => { for (const [nm] of (SHOTS[key] || [])) if (fs.existsSync(`public/broll/${nm}.mp4`)) return nm; return null; };

const SIGNS = [
  ["mira las hojas", "1", "Las hojas", "s1"],
  ["la senal que sigue son los pelos", "2", "Los pelos", "s2"],
  ["vas a palpar la mazorca", "3", "Palpá los granos", "s3"],
  ["la senal que sigue es la mas rapida", "4", "El peso", "s4"],
  ["casi nadie la revisa", "5", "El corte del tallo", "s5"],
  ["me guardaba la que mas sorprende", "6", "No la peles", "s6"],
];
const SIGNCARDS = SIGNS.map(([ph, num, name, key]) => {
  const t = atc(ph); if (t == null) return null;
  const cb = _firstClip(key);
  const o = { t, id: `cmp_sign_${num}`, kind: "numcard", number: num, name, total: "6", accent: num === "6" ? "good" : "amber", dur: 3.0, eyebrow: num === "6" ? "La que nadie hace" : "Leéla desde afuera" };
  if (cb) o.image = `broll/${cb}.mp4`;
  return o;
}).filter(Boolean);

const COMPONENTS = [
  { t: atc("quedate hasta el final"), id: "cmp_loop", kind: "mistake", number: "!", eyebrow: "EN ESTE VIDEO",
    title: "El error que arruina tu choclo", desc: "Casi todos lo hacen en el súper — y les cuesta el dulzor.",
    bg: "a man tearing open corn husks at a grocery store, mess of husks" },
  { t: atc("sin pelar una sola hoja"), id: "cmp_blur_promise", kind: "blurreveal", overlay: true, dur: 3.0,
    eyebrow: "Sin herramientas · 10 segundos", title: "Leé la mazorca desde afuera", accent: "amber" },
  { t: atc("ese dulzor esta contrarreloj"), id: "cmp_clock", kind: "growthtimeline", dur: 6.0,
    title: "El azúcar se vuelve almidón — rápido",
    stages: [{ label: "Recién cortada", sub: "100% dulce" }, { label: "1 hora" }, { label: "1 día", sub: "mitad" }, { label: "En la góndola", sub: "harinosa" }],
    clipBg: _firstClip("villain") },
  { t: atc("convertir su propio azucar en almidon"), id: "cmp_sugar", kind: "callout", hue: "amber", accent: "danger",
    figure: "50%", eyebrow: "Azúcar perdido en un día", caption: "desde que sale de la caña" },
  { t: atc("el agua hirviendo antes de ir a cortar el maiz"), id: "cmp_quote_water", kind: "quote", hue: "amber", accent: "amber", fontSize: 84,
    text: "Tené el agua *hirviendo* antes de cortar el maíz.",
    bg: "a pot of water boiling on a wood stove in a rustic farmhouse kitchen" },
  { t: atc("haciendose pasar por fresco"), id: "cmp_oldcorn", kind: "impact", dur: 4.4, hitAt: 1.1, boom: 0, darken: 0.45,
    setup: "¿Soso, duro, a cartón?", impact: "Es maíz VIEJO.", impactAccent: "danger",
    bg: "a dull dried out ear of corn with shriveled kernels on a table" },
  { t: atc("se llama golden bantam"), id: "cmp_heirloom", kind: "chips", hue: "amber",
    title: "Las variedades de antes", chips: ["Golden Bantam", "Stowell's Evergreen", "Polinización abierta"],
    bg: "heirloom yellow and white corn cobs on a rustic wooden table" },
  { t: atc("para que aguante el viaje"), id: "cmp_ship", kind: "lielist", accent: "danger",
    title: "Criado para la góndola, no para vos", items: ["Madura todo junto para las máquinas", "Se ve lindo una semana", "El sabor es lo último"],
    bg: "a large combine harvester cutting through a corn field, industrial farming" },
  { t: atc("hojas palidas y papelosas"), id: "cmp_anno_husk", kind: "annotated", hue: "amber", eyebrow: "Leé las hojas",
    annotations: [
      { kind: "circle", x: 0.38, y: 0.45, w: 0.2, label: "Verde brillante = fresco", color: "good" },
      { kind: "arrow", x: 0.7, y: 0.5, fromX: 0.9, fromY: 0.2, label: "Pálidas = viejo", color: "danger" },
    ],
    bg: "two ears of corn side by side, one bright green husk and one pale dry husk, on a wooden table" },
  { t: atc("un dorado a marron claro"), id: "cmp_anno_silk", kind: "annotated", hue: "amber", eyebrow: "Leé los pelos",
    annotations: [
      { kind: "circle", x: 0.5, y: 0.28, w: 0.22, label: "Dorados, blandos, pegajosos", color: "good" },
      { kind: "arrow", x: 0.5, y: 0.6, fromX: 0.82, fromY: 0.85, label: "No negros, no verdes", color: "amber" },
    ],
    bg: "macro close up of golden corn silk at the top of a fresh corn cob" },
  { t: atc("la verdad de una mazorca esta en la punta"), id: "cmp_anno_tip", kind: "annotated", hue: "amber", eyebrow: "Palpá la PUNTA",
    annotations: [
      { kind: "circle", x: 0.78, y: 0.5, w: 0.18, label: "Punta llena = repleta", color: "good" },
      { kind: "arrow", x: 0.78, y: 0.5, fromX: 0.95, fromY: 0.85, label: "Punta fina = huecos", color: "danger" },
    ],
    bg: "close up of the tip of an ear of corn with rows of plump kernels" },
  { t: atc("etapa de leche"), id: "cmp_milk", kind: "callout", hue: "amber", accent: "good",
    figure: "Leche", eyebrow: "Pico de dulzor", caption: "gordito, elástico, lleno — eso buscan tus dedos" },
  { t: atc("pesada es fresca"), id: "cmp_weight_half", kind: "half", side: "right", hue: "amber",
    kicker: "Pesada = fresca\nLiviana = vieja",
    srcFile: fileFor("corn_s4_two_ears_balance", "corn_s4_heavy_ear", "corn_h1_weigh_two_ears") },
  { t: atc("marron y seco es viejo"), id: "cmp_anno_stem", kind: "annotated", hue: "amber", eyebrow: "Dala vuelta",
    annotations: [
      { kind: "circle", x: 0.42, y: 0.55, w: 0.18, label: "Pálido y húmedo = nuevo", color: "good" },
      { kind: "arrow", x: 0.66, y: 0.55, fromX: 0.9, fromY: 0.85, label: "Marrón y seco = viejo", color: "danger" },
    ],
    bg: "extreme close up of the cut stem end of two corn cobs, one pale one brown" },
  { t: atc("punto mas dulce justo al amanecer"), id: "cmp_dawn", kind: "callout", hue: "amber", accent: "good",
    figure: "Amanecer", eyebrow: "Más dulce a primera luz", caption: "comprá temprano: día, semana, temporada" },
  { t: atc("no la peles"), id: "cmp_nopeel", kind: "impact", dur: 4.6, hitAt: 1.1, boom: 0, darken: 0.5,
    setup: "Todos hacen esto...", impact: "NO la peles.", impactAccent: "danger",
    bg: "hands pulling back a corn husk at a grocery store" },
  { t: atc("el maiz trae de fabrica"), id: "cmp_blur_husk", kind: "blurreveal", overlay: true, dur: 3.0,
    eyebrow: "Dejale las hojas", title: "Las hojas son su envase natural", accent: "good" },
  { t: atc("dejame juntarlo todo"), id: "cmp_grid", kind: "gridreveal", dur: 7.0,
    title: "6 señales · 10 segundos · sin pelar", subtitle: "Como los viejos",
    tiles: SIGNS.map(([, num, name]) => ({ number: num, name })) },
  { t: atO("seis cosas", 0), id: "cmp_checklist", kind: "checklist", hue: "amber", accent: "good",
    title: "El método entero", eyebrow: "Frente al maíz",
    items: [ck("Hojas verdes y ajustadas"), ck("Pelos dorados y pegajosos"), ck("Granos llenos hasta la punta"), ck("Pesada para su tamaño"), ck("Corte pálido y húmedo"), ck("Dejale las hojas puestas")],
    bg: "a basket of perfect fresh sweet corn on a rustic table" },
  { t: atc("no ser derrochadores"), id: "cmp_quote_amish", kind: "quote", hue: "amber", accent: "amber", fontSize: 80,
    text: "Es no ser *derrochadores*, y no dejarse *engañar*.",
    bg: "weathered old hands cradling an ear of corn, golden hour light on an Amish farm" },
  { t: atc("ese saber no les costo nada"), id: "cmp_free", kind: "callout", hue: "amber", accent: "good",
    figure: "Gratis", eyebrow: "Un saber heredado", caption: "y ahora es tuyo" },

  // ── variedad estructurada (bars/process/splitlist) ──
  { t: atc("lo cortaron hace dias"), id: "cmp_bars_days", kind: "bars", hue: "amber", accent: "good", unit: "dias", dur: 8.0,
    title: "Días desde que se cortó", eyebrow: "Puesto vs súper",
    bars: [{ label: "Del puesto, esta mañana", value: 0, display: "0 días", winner: true }, { label: "Del supermercado", value: 5, display: "3–5 días", tone: "danger" }] },
  { t: atc("se escapa cada hora"), id: "cmp_bars_dawn", kind: "bars", hue: "amber", accent: "good", unit: "%", dur: 6.0,
    title: "Dulzor según la hora", eyebrow: "Por qué importa el amanecer",
    bars: [{ label: "Cortado al amanecer", value: 100, display: "El más dulce", winner: true }, { label: "Bajo el sol fuerte", value: 70, display: "Menos dulce", tone: "danger" }] },
  { t: atc("compra tu maiz temprano"), id: "cmp_proc_early", kind: "process", hue: "amber", accent: "good", dur: 6.5,
    title: "Compralo temprano", eyebrow: "El maíz más fresco",
    steps: [{ title: "Temprano en el día" }, { title: "Temprano en la semana" }, { title: "Temprano en la temporada" }] },
  { t: atc("compralo sellado"), id: "cmp_proc_husk", kind: "process", hue: "amber", accent: "good", dur: 6.5,
    title: "La regla de las hojas", eyebrow: "Sellá el dulzor",
    steps: [{ title: "Leé la mazorca desde afuera" }, { title: "Dejale las hojas puestas" }, { title: "Pelala recién con el agua hirviendo" }] },
  { t: atc("pelos negros babosos blandos"), id: "cmp_split_silk", kind: "splitlist", palette: "D", cross: true, dur: 6.0,
    title: "Pelos para evitar", items: ["Negros, babosos, blandos", "Verdes y tiesos", "Secos y polvorientos"] },
  { t: atc("palpan el medio"), id: "cmp_split_fooled", kind: "splitlist", palette: "D", cross: true, dur: 6.0,
    title: "Donde se engaña la gente", items: ["Palpan solo el medio", "Confían en un centro gordo", "Se saltean la punta"] },
  { t: atc("sin nada que memorizar"), id: "cmp_split_notools", kind: "splitlist", palette: "D", cross: true, dur: 8.0,
    title: "Sin trucos, sin aparatos", items: ["Sin herramientas", "Nada que memorizar", "Sin pelar"] },
  { t: atc("al doble de velocidad"), id: "cmp_proc_peel", kind: "process", hue: "amber", accent: "danger", dur: 8.0,
    title: "Qué hace pelarla", eyebrow: "Acelerás el reloj",
    steps: [{ title: "Se escapa la humedad" }, { title: "Entra el aire" }, { title: "El azúcar se vuelve almidón — al doble" }] },
  { t: atc("hace eso y te prometo"), id: "cmp_proc_bin", kind: "process", hue: "amber", accent: "good", dur: 8.0,
    title: "Frente al maíz", eyebrow: "Diez segundos, sin pelar",
    steps: [{ title: "Mirá: hojas verdes, pelos dorados" }, { title: "Palpá: lleno hasta la punta, pesada" }, { title: "Dala vuelta: corte pálido — y dejala sellada" }] },
  { t: atc("vamos a ensenarte a leer el maiz"), id: "cmp_proc_read", kind: "process", hue: "amber", accent: "good", dur: 8.0,
    title: "Cómo leer el maíz", eyebrow: "Sin abrir nada",
    steps: [{ title: "Mirá las hojas y los pelos" }, { title: "Palpá los granos hasta la punta" }, { title: "Sopesá y mirá el corte del tallo" }] },
  { t: atc("ya se convirtio en almidon"), id: "cmp_bars_sugar", kind: "bars", hue: "amber", accent: "good", unit: "%", dur: 8.0,
    title: "Azúcar que queda en el grano", eyebrow: "¿Qué tan fresco está?",
    bars: [{ label: "Cortado esta mañana", value: 100, display: "100%", winner: true }, { label: "De un día", value: 50, display: "~50%", tone: "danger" }, { label: "Días en la góndola", value: 20, display: "~20%", tone: "danger" }] },
  { t: atc("no estas eligiendo el mejor maiz"), id: "cmp_split_myth", kind: "splitlist", palette: "D", cross: true, dur: 9.0,
    title: "Lo que el súper no te dice", items: ["Lo cortaron hace días", "Viajó y esperó en góndola", "Criado para viajar, no para vos"] },
  { t: atc("esos pelos pegajosos y apenas humedos"), id: "cmp_proc_silk", kind: "process", hue: "amber", accent: "good", dur: 9.0,
    title: "Qué dicen los pelos", eyebrow: "Sin abrir la hoja",
    steps: [{ title: "Dorados y blandos = madura" }, { title: "Apenas pegajosos = fresca" }, { title: "Negros o verdes = descartar" }] },
  { t: atc("los granos secos son granos harinosos"), id: "cmp_bars_kernels", kind: "bars", hue: "amber", accent: "good", unit: "%", dur: 9.0,
    title: "Humedad en el grano", eyebrow: "Fresco vs reseco",
    bars: [{ label: "Grano fresco, jugoso", value: 100, display: "Dulce", winner: true }, { label: "Grano seco", value: 30, display: "Harinoso", tone: "danger" }] },

  // ── composites imagen+texto (fotos reales corn_*) ──
  { t: atc("un verde profundo vivo"), id: "cmp_half_husk", kind: "half", side: "right", hue: "amber",
    srcFile: fileFor("corn_s1_husk_bright_green", "corn_h1_husk_green_tight"), kicker: "Verde brillante,\nbien ajustadas\n= fresco" },
  { t: atc("busca en la sombra"), id: "cmp_half_shade", kind: "half", side: "left", hue: "amber",
    srcFile: fileFor("corn_a1_shade_cool_corn", "corn_a1_glowing_green_husk", "corn_a1_reach_under_pile"), kicker: "Las buenas se\nesconden donde\nestá fresco" },
  { t: atc("que los pelos se sequen hacia el dorado"), id: "cmp_loupe_silk", kind: "loupe", accent: "amber",
    imgFile: imgFor("corn_s2_silk_golden", "corn_s2_silk_tip_macro"), focusX: 0.5, focusY: 0.28, zoom: 1.7, label: "Dorados, blandos, pegajosos" },
  { t: atc("palpa hasta la punta"), id: "cmp_loupe_tip", kind: "loupe", accent: "good",
    imgFile: imgFor("corn_s3_tip_full_round", "corn_s3_kernels_pearls"), focusX: 0.8, focusY: 0.5, zoom: 1.8, label: "Llena hasta la punta" },
  { t: atc("hileras de perlitas regordetas"), id: "cmp_split_kernels", kind: "splitexplain", accent: "good", eyebrow: "Palpá los granos",
    imgFile: imgFor("corn_s3_kernels_pearls", "corn_s3_press_kernel_give"), title: "Como hileras de perlas",
    points: ["Gorditos y parejos", "Firmes pero ceden un poco", "Hasta la punta misma"] },
  { t: atc("ese corte esta palido"), id: "cmp_split_stem", kind: "splitexplain", accent: "amber", eyebrow: "Dala vuelta",
    imgFile: imgFor("corn_s5_stem_end_macro", "corn_s5_stem_pale_moist"), title: "Leé el corte del tallo",
    points: ["Pálido y húmedo = nuevo", "Marrón y seco = viejo", "El corte no miente"] },
  { t: atc("la llamabamos la etapa de leche"), id: "cmp_focus_milk", kind: "focuscard", accent: "good", imageSide: "right",
    imgFileBg: imgFor("corn_s3_kernels_pearls", "corn_a2_thumbnail_kernel"), imgFile: imgFor("corn_a2_thumbnail_kernel", "corn_s3_press_kernel_give", "corn_s3_kernels_pearls"),
    eyebrow: "La etapa de leche", title: "Lechoso = pico de dulzor", desc: "Gordito, elástico, lleno — justo lo que buscan tus dedos." },
  { t: atc("un dia perfecto en la cana"), id: "cmp_focus_heirloom", kind: "focuscard", accent: "amber", imageSide: "left",
    imgFileBg: imgFor("corn_hr_heirloom_basket", "corn_hr_dried_seed_corn"), imgFile: imgFor("corn_hr_golden_bantam", "corn_hr_white_corn"),
    eyebrow: "Maíz de antes", title: "Un día perfecto", desc: "Demasiado tierno para viajar — pero nada sabe como él." },
];

// ── insertar componentes ──
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
  let rm = 1;
  while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placedC.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab);
  placedC.add(c.id);
  const next = beats[idx + 1];
  const nextAv = avStarts.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
  ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + D + 1) - start).toFixed(2);
  nComp++;
}
for (const c of SIGNCARDS) {
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

// ── HOOK BURST: partir tarjetas largas del minuto 1 con relleno ──
beats.sort((a, b) => a.start - b.start);
{
  const fillers = [];
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i];
    if (b.start >= 64 || b.overlay || b.kind === "raw") continue;
    const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
    if (nextStart - b.start <= 5.5) continue;
    let t = +(b.start + 4.2).toFixed(2);
    while (nextStart - t > 1.6) {
      const nm = pickClip(allMatched[0], allMatched);
      if (!nm || !have(nm)) break;
      fillers.push({ id: `bf_${nm}_${Math.round(t * 10)}`, start: t, dur: 2.4, kind: "raw", src: `broll/${nm}.mp4`, darken: 0 });
      t = +(t + 2.6).toFixed(2);
    }
  }
  beats.push(...fillers); beats.sort((a, b) => a.start - b.start);
  if (fillers.length) console.log(`hook burst: +${fillers.length} clips de relleno`);
}

// ── tiling final ──
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

// ── frases cinéticas (overlays) ES ──
const KPHRASES = [
  kphrase("sin pelar una sola hoja", ["hoja"]),
  kphrase("nunca mas vas a llevarte a casa una mazorca mala", ["nunca"]),
  kphrase("la verdad de una mazorca esta en la punta", ["punta"]),
  kphrase("pesada es fresca", ["pesada"]),
  kphrase("marron y seco es viejo", ["viejo"]),
  kphrase("no la peles", ["no"]),
  kphrase("maiz temprano es maiz dulce", ["dulce"]),
].filter(Boolean);
// ── overlays (kineticline/blurreveal): SOLO sobre clips, nunca sobre componentes ni
//    pisándose entre sí (evita el amontonamiento texto+componente poco profesional) ──
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
  console.log(`overlays: ${kept.length} sobre clips (${dropped} descartados por chocar con componentes/overlays)`);
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, clipsfirst: true, beats }, null, 2));

// ── avatar windows ──
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = []; let k = 0;
// PiP candidato SOLO sobre clips reales (no overlays ni componentes full-screen → quedan limpios)
const _bw = beats.filter((b) => !b.overlay && b.kind === "raw");
for (let i = 0; i < _bw.length; i++) { if (i % 5 === 3 && !inFull(_bw[i].start)) { pip.push([_bw[i].start, _bw[i].start + Math.min(_bw[i].dur, 6), POS[k % POS.length]]); k++; } }
const firstClip = CLIPS.length ? Math.max(CLIPS[0][0], OPEN) : OPEN;
const modeAt = (t) => {
  if (t < OPEN - 1e-6) return "full";
  if (AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
  return p ? p[2] : "hidden";
};
const pts = [...new Set([0, OPEN, firstClip, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync("src/VideoEdit/avatar_choclo.gen.ts", `// avatar_choclo.gen.ts — GENERADO por build_choclo.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_CHOCLO = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const isImg = (b) => b && b.kind === "raw" && b.gen;
console.log(`=== build_choclo ===`);
console.log(`beats: ${beats.length} · clips: ${beats.filter((b) => !b.overlay && b.kind === "raw" && (b.src || "").startsWith("broll/")).length} · web: ${beats.filter((b) => !b.overlay && b.kind === "raw" && (b.src || "").startsWith("real/")).length} · IA: ${beats.filter(isImg).length} · componentes: ${nComp}`);
