// build_corn.mjs — Levi Lapp Jardín (EN) · "How to Pick the Sweetest Corn... The Old Amish Way".
// CLIPS-FIRST híbrido modo AVATAR (estilo barcos/replantar): clips reales matcheados + imágenes
// deAPI de relleno + componentes hermosos encima del b-roll. Hook 0-52s HIPERDINÁMICO (~1s/clip)
// anclado frase-por-frase; cuerpo dinámico (~3.2s). Anclado al transcript MILIMÉTRICO (aligned).
//
// Modo:  node build_corn.mjs match  → public/broll/match_corn.json
//        node build_corn.mjs        → beatsheet/corn.json + avatar_corn.gen.ts
import fs from "fs";
import { SHOTS } from "./shots_corn.mjs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1125.44; // duración exacta del avatar (ffprobe 00:18:45.44)
const SLUG = "corn", AVATAR = "corn_opt.mp4";
const OPEN = 2.0;
const IMG_STYLE = ", realistic color photograph, natural soft daylight, sharp focus, shallow depth of field, rustic farm or kitchen, no text, no captions, no watermark, no logo";

// ── anclaje por captions MILIMÉTRICAS (forced-aligned) ──
const caps = JSON.parse(fs.readFileSync("public/captions_corn_aligned.json", "utf8"));
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
  ["hook1", at("by the time this video")],
  ["hook2", at("why this matters")],
  ["levi", at("you know why you can trust this")],   // AV_FULL personal
  ["truth", at("before the six signs")],
  ["villain", at("sweet corn has a secret")],
  ["store", at("so now think about the corn")],
  ["heirloom", at("second reason store corn")],
  ["heirloom2", at("was the old kind")],
  ["s1", at("look at the husk")],
  ["anec1", at("tell you a quick story")],
  ["s2", at("the next sign is the silk")],
  ["s3", at("the heart of the whole thing")],
  ["anec2", at("something we did on the farm")],
  ["s4", at("the quickest one of all")],
  ["s5", at("almost nobody checks")],
  ["anec3", at("one more thing my grandfather believed")],
  ["s6", at("saving the one that surprises")],
  ["roast", at("one more reason to keep it on")],
  ["recap", at("put it all together")],
  ["emotional", at("people hear amish")],
  ["cta", at("if this helped you")],                 // AV_FULL cierre
];
const SECSTART = Object.fromEntries(SECT.map(([k, s]) => [k, s]));
const secEnd = (k) => { const i = SECT.findIndex((x) => x[0] === k); return i + 1 < SECT.length ? SECT[i + 1][1] : TOTAL; };
// las secciones "store"/"heirloom" comparten pool con villain/heirloom (no tienen SHOTS propios)
const POOLKEY = { store: "villain", heirloom: "villain", heirloom2: "heirloom" };

// ── avatar a PANTALLA COMPLETA (apertura + intro personal + cierre) ──
const AV_FULL = [
  [0, OPEN],
  [SECSTART.levi, SECSTART.truth],   // "you know why you can trust this... My name's Levi... how we did it"
  [SECSTART.cta, TOTAL],             // try it this week + teaser tomate + firma
];

const S = SHOTS;

// ── densidad por sección (seg/clip): hook ráfaga, cuerpo dinámico, cierre que respira ──
const PACE = {
  hook1: 0.95, hook2: 1.6, levi: 4.0, truth: 2.3,
  villain: 2.8, store: 2.8, heirloom: 2.8, heirloom2: 2.8,
  s1: 2.8, anec1: 2.8, s2: 2.8, s3: 2.8, anec2: 2.8, s4: 2.6, s5: 2.6, anec3: 2.8, s6: 2.8,
  roast: 2.6, recap: 2.2, emotional: 3.2, cta: 3.6,
};

const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const have = (nm) => fs.existsSync(`public/broll/${nm}.mp4`);
// imagen REAL de la web (fetch_bing → public/real/<name>.<ext>) para conceptos sin clip
const REAL_EXT = ["jpg", "jpeg", "png", "webp"];
const realImg = (nm) => { for (const suf of ["", "_1", "_2"]) for (const e of REAL_EXT) { const p = `real/${nm}${suf}.${e}`; if (fs.existsSync(`public/${p}`)) return p; } return null; };
// fuente de un concepto: SU clip > SU imagen web (variedad on-topic) > clip ciclado (último recurso)
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
const lastN = []; // últimos clips usados (evita repetir en ventana, no solo el inmediato)
const pickClip = (own, secMatched) => {
  if (MODE !== "build") return own;
  const recent = (nm) => lastN.includes(nm);
  const take = (nm) => { usage[nm] = (usage[nm] || 0) + 1; lastClip = nm; lastN.push(nm); if (lastN.length > 5) lastN.shift(); return nm; };
  // 1) clip PROPIO del concepto si está fresco (no usado de más, no reciente)
  if (have(own) && !recent(own) && (usage[own] || 0) < 2) return take(own);
  // 2) pool: si la sección tiene ≥3 clips propios, usar esos (on-topic); si no, GLOBAL
  //    (evita el loop de 1 solo clip cuando la sección bajó pocos matches).
  const pool = secMatched.length >= 3 ? secMatched : [...new Set([...secMatched, ...allMatched])];
  // elegir el MENOS usado que no esté en la ventana reciente
  let best = null, bu = Infinity;
  for (const nm of pool) { const u = usage[nm] || 0; if (!recent(nm) && u < bu) { bu = u; best = nm; } }
  if (!best) { for (const nm of pool) { const u = usage[nm] || 0; if (nm !== lastClip && u < bu) { bu = u; best = nm; } } }
  if (!best) best = pool[0] || (have(own) ? own : allMatched[0]) || own;
  return take(best);
};

const CLIPS = [];
let _bid = 0;
for (const [key] of SECT) {
  if (MODE === "build" && key === "hook1") continue; // hook1 = frase-por-frase abajo
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

// ── HOOK1 anclado a la narración: cada clip CAE en el ms EXACTO de su frase ──
if (MODE === "build") {
  const _at = (p) => { try { return at(p); } catch { return null; } };
  const hpick = (cands, used) => {
    for (const c of cands) if (have(c) && !used.has(c)) return c;
    for (const c of cands) if (have(c)) return c;
    return null;
  };
  const HOOKSEQ = [
    ["walk up to any pile", ["corn_h1_bin_pile_store", "corn_h1_market_corn_crates"]],
    ["of sweet corn", ["corn_h1_corn_pyramid_market", "corn_h1_corn_on_table"]],
    ["at a roadside stand", ["corn_h1_roadside_stand", "corn_h1_basket_market_corn"]],
    ["pick out the single sweetest", ["corn_h1_hand_grab_ear", "corn_h1_hand_point_corn"]],
    ["in about 10 seconds", ["corn_h1_hands_feel_ear", "corn_h1_corn_close_spin"]],
    ["with your hands", ["corn_h1_hands_feel_ear", "corn_h1_hands_husk_open"]],
    ["without ever peeling back the husk", ["corn_h1_husk_green_tight", "corn_h1_husk_peel_reveal"]],
    ["the way the old folks knew", ["corn_h1_grandfather_hands", "corn_h1_amish_farmer_field"]],
    ["never bring home a bad ear", ["corn_h1_husk_pale_dry", "corn_h1_husk_papery_edge"]],
    ["works right there in the aisle", ["corn_h1_market_shopper", "corn_h1_corn_pyramid_market"]],
    ["the last one the sixth", ["corn_h1_husk_peel_reveal", "corn_h1_torn_husks_pile"]],
    ["surprises people the most", ["corn_h1_hands_husk_open", "corn_h1_peel_husk_store"]],
    ["stay with me to the end", ["corn_h1_field_dawn", "corn_h1_pull_ear_stalk"]],
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
    // rellenar huecos: 1 clip alterno cada ~2.5s para que el hook sea RÁFAGA real
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
  // src ya resuelto por pickSrc (clip propio / imagen web propia / clip ciclado)
  const s = src || (have(name) ? `broll/${name}.mp4` : realImg(name));
  if (s) return { id, start: t, dur, kind: "raw", src: s, darken: 0 };
  // sin clip ni imagen web → último recurso: imagen IA del concepto
  return { id, start: t, dur, kind: "raw", src: `img/${name}.png`, darken: 0, gen: { type: "image", name, prompt: concept + IMG_STYLE } };
});

// ── COMPONENTES (custom, anclados a frases reales) ──
// ── ANECSEQ: imágenes BESPOKE del abuelo (gpt-image-2) en el ms EXACTO de cada anécdota ──
const ANECSEQ = [
  ["pull out the sweetest corn on the table", "corn_gf_pick_stand"],
  ["tall enough to reach the bin", "corn_gf_amos_portrait"],
  ["the walk from the field back to the kitchen", "corn_gf_walk_field"],
  ["saved seed from year after year", "corn_gf_seed_save"],
  ["nothing on this earth that tastes like it", "corn_gf_heirloom_hold"],
  ["grab the ears off the top of the pile", "corn_gf_hurried_man"],
  ["into the shade of the pile", "corn_gf_reach_shade"],
  ["three ears with husks so green", "corn_gf_hand_over"],
  ["roll the silk between two fingers", "corn_gf_roll_silk"],
  ["press his thumbnail into a single kernel", "corn_gf_thumbnail"],
  ["leave it on the stalk", "corn_gf_check_field"],
  ["pick up two ears one in each hand", "corn_gf_weigh_two"],
  ["dew still on everything", "corn_gf_dawn_harvest"],
  ["the same way his father knew before him", "corn_gf_hands_golden"],
  ["the folks who taught me", "corn_gf_table_food"],
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
// fileFor: archivo visual de un concepto (clip propio o imagen web), o el primero disponible de una lista
const fileFor = (...nms) => { for (const nm of nms) { if (have(nm)) return `broll/${nm}.mp4`; const ri = realImg(nm); if (ri) return ri; } return null; };
const imgFor = (...nms) => { for (const nm of nms) { const ri = realImg(nm); if (ri) return ri; } return null; }; // SOLO imagen fija (loupe/focuscard/splitexplain usan <Img>, NO aceptan .mp4)

// TARJETAS DE SEÑAL (6) — clavadas al reveal de cada señal, fondo = clip de la sección
const SIGNS = [
  ["look at the husk", "1", "The Husk", "s1"],
  ["the next sign is the silk", "2", "The Silk", "s2"],
  ["the heart of the whole thing", "3", "Feel the Kernels", "s3"],
  ["the quickest one of all", "4", "The Weight", "s4"],
  ["almost nobody checks", "5", "The Stem End", "s5"],
  ["saving the one that surprises", "6", "Never Peel It", "s6"],
];
const SIGNCARDS = SIGNS.map(([ph, num, name, key]) => {
  const t = atc(ph); if (t == null) return null;
  const cb = _firstClip(key);
  const o = { t, id: `cmp_sign_${num}`, kind: "numcard", number: num, name, total: "6", accent: num === "6" ? "good" : "amber", dur: 3.0, eyebrow: num === "6" ? "The one nobody does" : "Read it from outside" };
  if (cb) o.image = `broll/${cb}.mp4`;
  return o;
}).filter(Boolean);

const COMPONENTS = [
  // HOOK — open loop "el error que todos cometen" (curiosidad)
  { t: atc("stay with me to the end"), id: "cmp_loop", kind: "mistake", number: "!", eyebrow: "IN THIS VIDEO",
    title: "The one mistake that ruins your corn", desc: "Almost everyone does it at the store — and it costs them the sweetness.",
    bg: "a man tearing open corn husks at a grocery store, mess of husks" },
  // BLUR REVEAL (overlay, clip se pone borroso y aparece texto) — promesa del hook
  { t: atc("without ever peeling back the husk"), id: "cmp_blur_promise", kind: "blurreveal", overlay: true, dur: 3.0,
    eyebrow: "No tools · 10 seconds", title: "Read the ear from the outside", accent: "amber" },
  // VILLANO — el reloj azúcar→almidón (timeline animada)
  { t: atc("sweetness is on a timer"), id: "cmp_clock", kind: "growthtimeline", dur: 6.0,
    title: "Sugar turns to starch — fast",
    stages: [{ label: "Picked", sub: "100% sweet" }, { label: "1 hour" }, { label: "1 day", sub: "half gone" }, { label: "On the shelf", sub: "starchy" }],
    clipBg: _firstClip("villain") },
  // VILLANO — cuánto se pierde (callout)
  { t: atc("turning its own sugar into starch"), id: "cmp_sugar", kind: "callout", hue: "amber", accent: "danger",
    figure: "50%", eyebrow: "Sugar lost in a day", caption: "from the second it leaves the stalk" },
  // VILLANO — la cita del abuelo
  { t: atc("have the water boiling before you go pick the corn"), id: "cmp_quote_water", kind: "quote", hue: "amber", accent: "amber", fontSize: 88,
    text: "Have the water *boiling* before you go pick the corn.",
    bg: "a pot of water boiling on a wood stove in a rustic farmhouse kitchen" },
  // VILLANO — el viaje del choclo viejo (impacto)
  { t: atc("old corn pretending to be fresh"), id: "cmp_oldcorn", kind: "impact", dur: 4.4, hitAt: 1.1, boom: 0, darken: 0.45,
    setup: "Bland, chewy, like cardboard?", impact: "That's OLD corn.", impactAccent: "danger",
    bg: "a dull dried out ear of corn with shriveled kernels on a table" },
  // HEIRLOOM — variedades antiguas (chips)
  { t: atc("called golden bantam"), id: "cmp_heirloom", kind: "chips", hue: "amber",
    title: "The old varieties", chips: ["Golden Bantam", "Stowell's Evergreen", "Open-pollinated"],
    bg: "heirloom yellow and white corn cobs on a rustic wooden table" },
  // HEIRLOOM — criado para viajar, no para sabor (lielist)
  { t: atc("grown to ship good"), id: "cmp_ship", kind: "lielist", accent: "danger",
    title: "Bred for the shelf, not for you", items: ["Ripens all at once for machines", "Looks pretty for a week", "Flavor is an afterthought"],
    bg: "a large combine harvester cutting through a corn field, industrial farming" },
  // SEÑAL 1 — diagrama anotado de la chala (good vs bad)
  { t: atc("pale papery husk means old corn"), id: "cmp_anno_husk", kind: "annotated", hue: "amber", eyebrow: "Read the husk",
    annotations: [
      { kind: "circle", x: 0.38, y: 0.45, w: 0.2, label: "Bright green = fresh", color: "good" },
      { kind: "arrow", x: 0.7, y: 0.5, fromX: 0.9, fromY: 0.2, label: "Pale & papery = old", color: "danger" },
    ],
    bg: "two ears of corn side by side, one bright green husk and one pale dry husk, on a wooden table" },
  // SEÑAL 2 — diagrama anotado de la seda
  { t: atc("golden to light brown at the very tip"), id: "cmp_anno_silk", kind: "annotated", hue: "amber", eyebrow: "Read the silk",
    annotations: [
      { kind: "circle", x: 0.5, y: 0.28, w: 0.22, label: "Golden, soft, sticky", color: "good" },
      { kind: "arrow", x: 0.5, y: 0.6, fromX: 0.82, fromY: 0.85, label: "Not black, not green", color: "amber" },
    ],
    bg: "macro close up of golden corn silk at the top of a fresh corn cob" },
  // SEÑAL 3 — diagrama anotado de la punta (la verdad está en la punta)
  { t: atc("the truth of an ear of corn is at the tip"), id: "cmp_anno_tip", kind: "annotated", hue: "amber", eyebrow: "Feel to the TIP",
    annotations: [
      { kind: "circle", x: 0.78, y: 0.5, w: 0.18, label: "Full tip = packed", color: "good" },
      { kind: "arrow", x: 0.78, y: 0.5, fromX: 0.95, fromY: 0.85, label: "Thin tip = gaps", color: "danger" },
    ],
    bg: "close up of the tip of an ear of corn with rows of plump kernels" },
  // ANÉCDOTA 2 — milk stage (callout)
  { t: atc("milky stage is peak sweetness"), id: "cmp_milk", kind: "callout", hue: "amber", accent: "good",
    figure: "Milk", eyebrow: "Peak sweetness", caption: "plump, springy, full — that's what your fingers feel for" },
  // SEÑAL 4 — peso (texto/imagen split)
  { t: atc("heavy is fresh"), id: "cmp_weight_half", kind: "half", side: "right", hue: "amber",
    kicker: "Heavy = fresh\nLight = old",
    srcFile: fileFor("corn_s4_two_ears_balance", "corn_s4_heavy_ear", "corn_h1_weigh_two_ears") },
  // SEÑAL 5 — diagrama anotado del tallo
  { t: atc("pale and moist means new"), id: "cmp_anno_stem", kind: "annotated", hue: "amber", eyebrow: "Flip it over",
    annotations: [
      { kind: "circle", x: 0.42, y: 0.55, w: 0.18, label: "Pale & moist = new", color: "good" },
      { kind: "arrow", x: 0.66, y: 0.55, fromX: 0.9, fromY: 0.85, label: "Brown & dry = old", color: "danger" },
    ],
    bg: "extreme close up of the cut stem end of two corn cobs, one pale one brown" },
  // ANÉCDOTA 3 — amanecer (callout)
  { t: atc("the corn is at its sweetest right at dawn"), id: "cmp_dawn", kind: "callout", hue: "amber", accent: "good",
    figure: "Dawn", eyebrow: "Sweetest at first light", caption: "buy it early in the day, the week, the season" },
  // SEÑAL 6 — NO PELAR (impacto, danger) — el revés que sorprende
  { t: atc("do not peel it"), id: "cmp_nopeel", kind: "impact", dur: 4.6, hitAt: 1.1, boom: 0, darken: 0.5,
    setup: "Everybody does this...", impact: "DON'T peel it.", impactAccent: "danger",
    bg: "hands pulling back a corn husk at a grocery store" },
  // SEÑAL 6 — la chala es el envoltorio (blur reveal overlay)
  { t: atc("nature wrapped it up tight for a reason"), id: "cmp_blur_husk", kind: "blurreveal", overlay: true, dur: 3.0,
    eyebrow: "Leave it on", title: "The husk is the corn's own packaging", accent: "good" },
  // RECAP — grilla de las 6 señales (cascada)
  { t: atc("put it all together"), id: "cmp_grid", kind: "gridreveal", dur: 7.0,
    title: "6 signs · 10 seconds · no peeling", subtitle: "The old Amish way",
    tiles: SIGNS.map(([, num, name]) => ({ number: num, name })) },
  // RECAP — checklist
  { t: atO("six things", 0), id: "cmp_checklist", kind: "checklist", hue: "amber", accent: "good",
    title: "The whole method", eyebrow: "At the corn bin",
    items: [ck("Bright green, tight husk"), ck("Golden, sticky silk"), ck("Full kernels to the tip"), ck("Heavy for its size"), ck("Pale, moist stem end"), ck("Leave the husk on")],
    bg: "a basket of perfect fresh sweet corn on a rustic table" },
  // EMOCIONAL — cita filosófica
  { t: atc("not being wasteful and not being fooled"), id: "cmp_quote_amish", kind: "quote", hue: "amber", accent: "amber", fontSize: 84,
    text: "It's about not being *wasteful*, and not being *fooled*.",
    bg: "weathered old hands cradling an ear of corn, golden hour light on an Amish farm" },
  // EMOCIONAL — gratis (callout)
  { t: atc("that knowledge cost them nothing"), id: "cmp_free", kind: "callout", hue: "amber", accent: "good",
    figure: "Free", eyebrow: "Knowledge passed down", caption: "now it's yours" },

  // ── PASE de VARIEDAD ESTRUCTURADA (bars/process/splitlist) — datos y comparaciones ──
  // bars 1 — el azúcar que se pierde con los días
  { t: atc("a good portion of the sugar"), id: "cmp_bars_sugar", kind: "bars", hue: "amber", accent: "good", unit: "%", dur: 6.5,
    title: "Sugar left in the kernel", eyebrow: "How fresh is the corn?",
    bars: [{ label: "Picked this morning", value: 100, display: "100%", winner: true }, { label: "A day old", value: 50, display: "~50%", tone: "danger" }, { label: "Days on the shelf", value: 20, display: "~20%", tone: "danger" }] },
  // bars 2 — dulzor por hora del día
  { t: atc("slips away every hour"), id: "cmp_bars_dawn", kind: "bars", hue: "amber", accent: "good", unit: "%", dur: 6.0,
    title: "Sweetness by time of day", eyebrow: "Why dawn matters",
    bars: [{ label: "Picked at dawn", value: 100, display: "Sweetest", winner: true }, { label: "Picked in the hot sun", value: 70, display: "Less sweet", tone: "danger" }] },
  // process 1 — comprar temprano
  { t: atc("buy your corn early"), id: "cmp_proc_early", kind: "process", hue: "amber", accent: "good", dur: 6.5,
    title: "Buy it early", eyebrow: "The freshest corn",
    steps: [{ title: "Early in the day" }, { title: "Early in the week" }, { title: "Early in the season" }] },
  // process 2 — la regla de la chala
  { t: atc("buy it sealed up the way the plant made it"), id: "cmp_proc_husk", kind: "process", hue: "amber", accent: "good", dur: 6.5,
    title: "The husk rule", eyebrow: "Lock in the sweetness",
    steps: [{ title: "Read the ear from the outside" }, { title: "Leave the husk fully on" }, { title: "Peel only when the water is hot" }] },
  // splitlist (cross) 1 — la seda que se evita
  { t: atc("now what you avoid"), id: "cmp_split_silk", kind: "splitlist", palette: "D", cross: true, dur: 6.0,
    title: "Silk to walk away from", items: ["Black, slimy, mushy", "Bright green and stiff", "Dry, dusty, crumbly"] },
  // splitlist (cross) 2 — el error de palpar solo el medio
  { t: atc("where most people get fooled"), id: "cmp_split_fooled", kind: "splitlist", palette: "D", cross: true, dur: 6.0,
    title: "Where people get fooled", items: ["They feel only the middle", "They trust a fat center", "They skip the tip"] },
  // splitlist (cross) 3 — sin herramientas (hook)
  { t: atc("nothing to remember"), id: "cmp_split_notools", kind: "splitlist", palette: "D", cross: true, dur: 8.0,
    title: "No tricks, no gear", items: ["No tools", "Nothing to memorize", "No peeling"] },
  // process 3 — qué pasa cuando pelás
  { t: atc("running twice as fast"), id: "cmp_proc_peel", kind: "process", hue: "amber", accent: "danger", dur: 8.0,
    title: "What peeling really does", eyebrow: "You speed up the clock",
    steps: [{ title: "Moisture escapes" }, { title: "Air gets in" }, { title: "Sugar turns to starch — twice as fast" }] },
  // bars 3 — días desde la cosecha
  { t: atc("picked days ago"), id: "cmp_bars_days", kind: "bars", hue: "amber", accent: "good", unit: "days", dur: 8.0,
    title: "Days since it was picked", eyebrow: "Field vs store",
    bars: [{ label: "Roadside, this morning", value: 0, display: "0 days", winner: true }, { label: "Grocery store", value: 5, display: "3–5 days", tone: "danger" }] },
  // process 4 — el método en el cajón (recap reforzado)
  { t: atc("do those and i promise you"), id: "cmp_proc_bin", kind: "process", hue: "amber", accent: "good", dur: 8.0,
    title: "At the corn bin", eyebrow: "Ten seconds, no peeling",
    steps: [{ title: "Look: green husk, golden silk" }, { title: "Feel: full to the tip, heavy" }, { title: "Flip: pale moist stem — then leave it sealed" }] },

  // ── PASE de CALIDAD: composites imagen+texto con FOTOS REALES (half / splitexplain / loupe / focuscard) ──
  // half (imagen mitad / texto mitad) — la chala verde
  { t: atc("a deep living green wrapped tight"), id: "cmp_half_husk", kind: "half", side: "right", hue: "amber",
    srcFile: fileFor("corn_s1_husk_bright_green", "corn_h1_husk_green_tight"), kicker: "Bright green,\nwrapped tight\n= fresh" },
  // half — la sombra (anécdota 1)
  { t: atc("reach into the shade"), id: "cmp_half_shade", kind: "half", side: "left", hue: "amber",
    srcFile: fileFor("corn_a1_shade_cool_corn", "corn_a1_glowing_green_husk", "corn_a1_reach_under_pile"), kicker: "The good ones\nhide where\nit's cool" },
  // loupe — zoom a la seda
  { t: atc("the silk drying to gold"), id: "cmp_loupe_silk", kind: "loupe", accent: "amber",
    imgFile: imgFor("corn_s2_silk_golden", "corn_s2_silk_tip_macro"), focusX: 0.5, focusY: 0.28, zoom: 1.7, label: "Golden, soft, sticky" },
  // loupe — zoom a la punta
  { t: atc("feel all the way up to the tip"), id: "cmp_loupe_tip", kind: "loupe", accent: "good",
    imgFile: imgFor("corn_s3_tip_full_round", "corn_s3_kernels_pearls"), focusX: 0.8, focusY: 0.5, zoom: 1.8, label: "Full to the tip" },
  // splitexplain — granos (imagen + bullets)
  { t: atc("rows of plump little pearls"), id: "cmp_split_kernels", kind: "splitexplain", accent: "good", eyebrow: "Feel the kernels",
    imgFile: imgFor("corn_s3_kernels_pearls", "corn_s3_press_kernel_give"), title: "Like rows of pearls",
    points: ["Plump and even", "Firm with slight give", "All the way to the tip"] },
  // splitexplain — el tallo (imagen + bullets)
  { t: atc("on a fresh ear"), id: "cmp_split_stem", kind: "splitexplain", accent: "amber", eyebrow: "Flip it over",
    imgFile: imgFor("corn_s5_stem_pale_moist", "corn_s5_stem_end_macro"), title: "Read the cut end",
    points: ["Pale & moist = new", "Brown & dry = old", "The stem can't lie"] },
  // focuscard — la etapa de leche (imagen + tarjeta)
  { t: atc("white like cream"), id: "cmp_focus_milk", kind: "focuscard", accent: "good", imageSide: "right",
    imgFileBg: imgFor("corn_s3_kernels_pearls", "corn_a2_thumbnail_kernel"), imgFile: imgFor("corn_a2_thumbnail_kernel", "corn_s3_press_kernel_give", "corn_s3_kernels_pearls"),
    eyebrow: "The milk stage", title: "Milky = peak sweetness", desc: "Plump, springy, full — exactly what your fingers feel for." },
  // focuscard — el choclo antiguo (heirloom)
  { t: atc("one perfect day on the stalk"), id: "cmp_focus_heirloom", kind: "focuscard", accent: "amber", imageSide: "left",
    imgFileBg: imgFor("corn_hr_heirloom_basket", "corn_hr_dried_seed_corn"), imgFile: imgFor("corn_hr_golden_bantam", "corn_hr_white_corn"),
    eyebrow: "Heirloom corn", title: "One perfect day", desc: "Too tender to ship — but nothing on earth tastes like it." },
  // half — el amanecer (anécdota 3)
  { t: atc("dew still on everything"), id: "cmp_half_dawn", kind: "half", side: "right", hue: "amber",
    srcFile: fileFor("corn_a3_dawn_field", "corn_a3_sun_rising_corn", "corn_a3_harvest_morning"), kicker: "Sweetest\nat first light" },
  // half — la mesa (cierre emocional)
  { t: atc("as good as any"), id: "cmp_half_table", kind: "half", side: "left", hue: "amber",
    srcFile: fileFor("corn_em_full_table_food", "corn_em_amish_table"), kicker: "As good as\nany king's table" },
];

// ── insertar componentes (reemplazan los beats que cubren; respetan AV_FULL) ──
let nComp = 0;
const placedC = new Set();
const overlayComps = [];
for (const c of [...COMPONENTS].sort((a, b) => (a.t ?? 0) - (b.t ?? 0))) {
  if (c.t == null) continue;
  const { t, bg, leftBg, rightBg, clipBg, kind, overlay, ...rest } = c;
  // composites con FOTOS REALES (no generar): mapear srcFile/imgFile/imgFileBg → src/image/bg
  if (["half", "loupe", "splitexplain", "focuscard", "termcard"].includes(kind) && !rest.srcFile && !rest.imgFile) { console.warn("⚠ composite sin archivo, salteado:", c.id); continue; }
  if (rest.srcFile) { rest.src = rest.srcFile; delete rest.srcFile; }
  if (rest.imgFile) { rest.image = rest.imgFile; delete rest.imgFile; }
  if (rest.imgFileBg || (kind === "focuscard" || kind === "splitexplain")) { rest.bg = rest.imgFileBg || rest.image; delete rest.imgFileBg; }
  if (overlay) {
    // overlay: NO reemplaza beats; va encima (como kineticline)
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
  if (c.image && !bg && !clipBg) ab.image = c.image; // signcard ya trae image=broll/...
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
// SIGNCARDS (numcard) — insertar igual que componentes con clipBg
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

// ── HOOK BURST: partir tarjetas largas (componentes) del primer minuto con clips
//    de relleno para que el hook NUNCA se quede estático (ráfaga real). ──
beats.sort((a, b) => a.start - b.start);
{
  const fillers = [];
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i];
    if (b.start >= 62 || b.overlay || b.kind === "raw") continue; // solo componentes del minuto 1
    const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
    let gap = nextStart - b.start;
    if (gap <= 5.5) continue;
    // dejar la tarjeta ~4.2s y rellenar el resto con clips de ráfaga ~2.6s
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
  kphrase("without ever peeling back the husk", ["husk"]),
  kphrase("never bring home a bad ear of corn again", ["never"]),
  kphrase("old corn pretending to be fresh", ["old"]),
  kphrase("the truth of an ear of corn is at the tip", ["tip"]),
  kphrase("pale and moist means new", ["new"]),
  kphrase("brown and dry means old", ["old"]),
  kphrase("leave the husk on", ["husk"]),
  kphrase("early corn is sweet corn", ["sweet"]),
].filter(Boolean);
// ── overlays SOLO sobre clips, nunca sobre componentes ni pisándose (anti-clutter) ──
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

// ── ventanas de avatar (full apertura/intro/cierre · PiP rotando · resto hidden) ──
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = []; let k = 0;
// PiP candidato SOLO sobre clips reales (componentes y overlays quedan limpios)
const _bw = beats.filter((b) => !b.overlay && b.kind === "raw");
for (let i = 0; i < _bw.length; i++) {
  if (i % 5 === 3 && !inFull(_bw[i].start)) { pip.push([_bw[i].start, _bw[i].start + Math.min(_bw[i].dur, 6), POS[k % POS.length]]); k++; }
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
fs.writeFileSync("src/VideoEdit/avatar_corn.gen.ts", `// avatar_corn.gen.ts — GENERADO por build_corn.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_CORN = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const isImg = (b) => b && b.kind === "raw" && b.gen;
const nClip = beats.filter((b) => b.kind === "raw" && !b.gen).length;
const nImg = beats.filter(isImg).length;
const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0);
console.log(`=== build_corn ===`);
console.log(`beats: ${beats.length} · clips reales: ${nClip} · imágenes IA: ${nImg} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
