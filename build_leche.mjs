// build_leche.mjs — CLIPS-FIRST. NICHO: homestead/off-grid (canal Amish Off-Grid Claudio).
// "Milk, cream & butter fresh in summer — no electricity" (springhouse). Abuelo + imposible + sin luz.
// SOLO EL HOOK (0–184.4s): el usuario quiere ver el hook ULTRADINÁMICO renderizado y dar OK antes del resto.
// Anclado al ms del Whisper (transcript_leche_timed.txt / captions_leche.json). IMG_STYLE = imperfecciones.
//   node build_leche.mjs match  → public/broll/match_leche.json
//   node build_leche.mjs        → beatsheet/leche.json + avatar_leche.gen.ts
import fs from "fs";
import { BODY } from "./body_leche.mjs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1388.4;         // VIDEO COMPLETO (hook 0–184.4 + cuerpo 184.4–1388.4)
const OPEN = 0.06;
const DLDUR = 6;

const IMG_STYLE = ", documentary photo that looks like a real casual phone snapshot, slightly soft focus, uneven natural light, real texture, slightly messy, small imperfections, nothing perfect, nothing polished, no AI look, low saturation, soft muted colors, no text, no captions, no watermark, no logo";
const HERO = ", documentary photo, real and a bit raw, moody natural light, slightly soft, real texture, small imperfections, nothing polished, no AI look, low saturation, muted colors, no text, no watermark, no logo";

// Avatar FULL (cámara directa) — el resto del hook el avatar va en esquina (PiP) o se oculta (avhide).
const AV_FULL = [
  [0.06, 4.95],     // "You already know... the milk you buy isn't really milk"
  [31.11, 35.84],   // "Well, you were right. You were right all along."
  [82.76, 87.84],   // "I understand why they think that, because they've never seen it done"
  [126.40, 130.68], // "So let me show you exactly how it was done"
  // ── CUERPO: momentos personales del abuelo a cámara ──
  [213.7, 218.8],   // "the old people understood in their bones"
  [577.7, 585.6],   // "my grandfather had an iron rule... most important thing"
  [1179.3, 1187.4], // "let me be honest with you... I won't sell you a fairytale"
  [1260.7, 1266.0], // "the thought I want to leave in your mind tonight"
  [1333.4, 1342.6], // "if you felt it too, that quiet sense..."
  [1376.6, 1383.4], // "subscribe, and we'll dig the next one up together"
];

const CLIP = (name) => ({ _clip: true, name });
const img = (id, prompt) => ({ id, kind: "raw", _img: prompt });
const kp = (id, text, imgPrompt, accent = "cold", fontSize = 92) =>
  ({ id, kind: "keyphrase", text, _img: imgPrompt, accent, fontSize });

// ── TIMELINE PLANA (start ASC, anclado al ms del narrador) ───────────────────────────────────
const T = [
  // ── CONFIRMACIÓN: la leche del super no es leche ──
  // [0.06–4.95 AVATAR]
  [4.95,  img("lc_taste", "a hand pouring thin pale watery milk from a plastic jug into a clear glass on a kitchen counter, the milk looks gray and thin and unappealing")],
  [6.17,  kp("lc_kp_thin", "Thin. Grey. *Watery.*", "close up of pale thin grey watery milk in a glass on a counter, unappetizing", "cold", 100)],
  [8.50,  { id: "lc_jug_pour", kind: "raw", ...CLIP("lc_jug_pour"), q: "a plastic gallon milk jug pouring milk into a glass, modern supermarket milk" }],
  [10.70, img("lc_spoiled", "close up of spoiled curdled sour milk with slimy lumps in a glass, gone bad, off white chunks")],
  [14.32, kp("lc_kp_suspected", "It wasn't supposed to be *this way.*", "an empty farmhouse kitchen table at dusk, quiet and nostalgic", "cold", 84)],
  [20.44, img("lc_old_kitchen", "a dim vintage early 1900s farmhouse kitchen with a worn wooden table, nostalgic, warm low light")],
  [22.67, img("lc_golden_jar", "an old glass jar of fresh whole farm milk with a thick golden cream line at the top, on a rustic wooden table, warm morning light")],
  [27.34, { id: "lc_no_wire", kind: "raw", ...CLIP("lc_no_wire"), q: "an old farmhouse at dusk with no power lines anywhere, off grid rural homestead" }],
  // [31.11–35.84 AVATAR] "you were right"
  // ── el abuelo ──
  [35.84, { id: "lc_three_kept", kind: "ingredients", avhide: true, resultLabel: "Fresh all summer", items: [
            { image: "img/lc_ic_milk.png", label: "Milk", at: 0.0 },
            { image: "img/lc_ic_cream.png", label: "Cream", at: 1.84 },
            { image: "img/lc_ic_butter.png", label: "Butter", at: 2.55 },
          ] }],
  [41.97, kp("lc_kp_july", "July. August. The *dog days.*", "a blazing hot hazy humid summer day over a farm field, heat shimmer", "amber", 92)],
  [47.60, kp("lc_kp_nofridge", "No fridge. No *bill.*", "a plain Amish farmhouse kitchen with no refrigerator, just a wooden cupboard and a window", "cold", 96)],
  [52.56, { id: "lc_power_line", kind: "raw", ...CLIP("lc_power_line"), q: "a single power line pole at the end of a long empty rural dirt road" }],
  [56.04, img("lc_stubborn", "a stern stubborn old Amish farmer with arms crossed and a weathered face, refusing, plain clothes and hat")],
  [59.44, { id: "lc_cream_coffee", kind: "raw", ...CLIP("lc_cream_coffee"), q: "thick cream being poured into a cup of black coffee, swirling clouds in the cup" }],
  [63.71, img("lc_butter_table", "a golden mound of fresh churned butter on a plate on a farmhouse table, warm soft light")],
  [68.18, { id: "lc_buttermilk", kind: "raw", ...CLIP("lc_buttermilk"), q: "a tall cold glass of buttermilk with heavy condensation and frost on the outside" }],
  [72.85, { id: "lc_well", kind: "raw", ...CLIP("lc_well"), q: "drawing a wooden bucket of cold water up from an old stone well" }],
  // ── "imposible hoy" ──
  [75.72, kp("lc_kp_imposs", "Today we call it *impossible.*", "a glass of milk gone sour and curdled on a hot sunny kitchen counter", "amber", 92)],
  [78.30, img("lc_sour_lunch", "a glass of milk left out and gone sour and curdled on a warm sunny kitchen counter by midday")],
  // [82.76–87.84 AVATAR]
  [87.84, { id: "lc_fridge_light", kind: "raw", ...CLIP("lc_fridge_light"), q: "opening a modern refrigerator door and the interior light turns on in a dark kitchen" }],
  [96.18, img("lc_old_families", "a vintage sepia early 1900s photograph of a farm family with milk cans and stoneware crocks outside a farmhouse")],
  [98.22, { id: "lc_old_farm", kind: "raw", ...CLIP("lc_old_farm"), q: "vintage footage of an old farm family working with milk pails and a butter churn, rural life" }],
  [103.21, kp("lc_kp_hadto", "They *had to.* No other way.", "an old stone dairy room with stoneware crocks of milk set in cold running water", "cold", 96)],
  [106.07, img("lc_skim", "an old Amish woman skimming thick cream off a wide shallow pan of milk in a cool stone dairy")],
  [109.34, img("lc_clean_hands", "clean careful hands scalding a metal milk pail with steaming hot water in a farm kitchen")],
  [111.77, kp("lc_kp_precise", "Precise. *Clever.*", "a tidy stone springhouse interior with crocks set in a clear running water trough", "cold", 104)],
  [115.44, { id: "lc_spring_teaser", kind: "raw", ...CLIP("lc_spring_teaser"), q: "cold clear water running through a stone trough inside a springhouse with crocks of milk cooling" }],
  [119.78, img("lc_broken_fridge", "a broken down old refrigerator pulled apart with tools and a repair bill on top, dim kitchen")],
  [122.50, img("lc_bills", "a messy stack of electric utility bills next to a spinning electric meter, money worry, dim light")],
  // [126.40–130.68 AVATAR] "let me show you how it was done"
  // ── promesa + open loops ──
  [130.68, { id: "lc_grandfather", kind: "lowerthird", avpos: "cornerTR", image: "img/lc_grandfather.png", place: "Lancaster County", date: "as it was truly done" }],
  [133.35, img("lc_lineage", "an old faded sepia photo of three generations of Amish farmers, grandfather father and son, standing together")],
  [137.18, kp("lc_kp_real", "Not the postcard. The *real* version.", "a real working amish dairy with crocks and pails, unstaged and honest", "cold", 88)],
  [142.16, { id: "lc_loop_mistake", kind: "redacted", avhide: true, image: "img/lc_loop_mistake_bg.png",
            eyebrow: "It sours by suppertime", title: "The one mistake", redacted: "THE MISTAKE", sub: "I'll show you how to avoid it",
            _img: "a metal pail of fresh milk gone sour and ruined on a barn floor" }],
  [146.26, img("lc_spoiled_pail", "a metal pail of fresh milk gone sour and wasted, poured out onto the ground, a whole day's work lost")],
  [152.58, { id: "lc_loop_spring", kind: "blurexplainer", avhide: true, side: "left",
            clip: "broll/lc_trough.mp4", image: "img/lc_spring_inset.png",
            eyebrow: "The building", title: "It did the work of a fridge",
            body: "No motor, no wire — just the cold water coming up out of the hill." }],
  [157.55, { id: "lc_trough", kind: "raw", ...CLIP("lc_trough"), q: "clear cold water running through a stone channel with stoneware crocks of milk and butter cooling" }],
  [161.35, img("lc_butter_weeks", "golden salted butter packed down hard into a stoneware crock and sealed, kept for weeks")],
  [165.40, { id: "lc_loop_tall", kind: "redacted", avhide: true, image: "img/lc_loop_tall_bg.png",
            eyebrow: "Near the end", title: "Sounds like a tall tale", redacted: "THE TRICK", sub: "until you understand it",
            _img: "a clear starry summer night sky over a dark quiet farm, warm night" }],
  [172.66, img("lc_whip", "thick fresh cream being whipped into stiff peaks with a hand whisk in a metal bowl")],
  [175.77, { id: "lc_spoon", kind: "spooncream", avhide: true, image: "img/lc_spoon_bg.png",
            temp: "70°F", headline: "And the spoon still stood.", sub: "On a night that never once froze",
            _img: "a metal spoon standing straight up on its own in a bowl of very thick whipped cream, close up on a kitchen table" }],
];

// ════════ CUERPO (184.4 → 1388.4): una imagen contextual por mini-frase + clips reales + componentes ════════
// clips reales (ya descargados) en los momentos que encajan
const BODY_CLIP = {
  b_oldcountry: "lc_no_wire", b_amishfarms: "lc_old_farm", b_stonetrough: "lc_trough",
  b_flowing: "lc_trough", b_creamcoffee: "lc_cream_coffee",
  b_milkinwell: "lc_well", b_fridgedid: "lc_fridge_light", b_drain: "lc_jug_pour",
};
// componentes para los conceptos clave (reusan kinds existentes; imágenes ya generadas o del hook)
const BODY_COMP = {
  b_warmthtimedirt: { kind: "keyphrase", text: "Warmth. Time. *Dirt.*", src: "img/b_warmthtimedirt.png", accent: "amber", fontSize: 100 },
  b_double: { kind: "keyphrase", text: "Double — every *20 minutes.*", src: "img/b_double.png", accent: "amber", fontSize: 92 },
  b_fiftydeg: { kind: "stat", avhide: true, value: 50, suffix: "°F", eyebrow: "The cold from below", label: "all year round, ten feet down", accent: "accent", hue: "cold" },
  b_themistake: { kind: "redacted", avhide: true, image: "img/lc_loop_mistake_bg.png", eyebrow: "It spoils more milk than all of August", title: "The one mistake", redacted: "WARM MILK", sub: "cool it the second it leaves the cow" },
  b_notdeep: { kind: "splitba", avhide: true, beforeImg: "img/b_deepcan.png", afterImg: "img/b_shallowfast.png", beforeLabel: "Deep can — holds heat for hours", afterLabel: "Shallow pan — chills in minutes", eyebrow: "Why they used wide pans", title: "Spread it thin" },
  b_fourways: { kind: "keyphrase", text: "Springhouse. Cellar. Well. *Cloth.*", src: "img/b_fourways.png", accent: "cold", fontSize: 80 },
  b_notafridge: { kind: "keyphrase", text: "Not a fridge. The *real* way.", src: "img/b_notafridge.png", accent: "cold", fontSize: 88 },
};
for (const [t, slug] of BODY) {
  if (BODY_COMP[slug]) T.push([t, { id: slug, ...BODY_COMP[slug] }]);
  else if (BODY_CLIP[slug]) T.push([t, { id: slug, kind: "raw", src: `broll/${BODY_CLIP[slug]}.mp4`, darken: 0 }]);
  else T.push([t, { id: slug, kind: "raw", src: `img/${slug}.png`, darken: 0 }]);
}

// ── ICONOS de la ecuación (leche/crema/manteca) — prompts aparte (no son beats) ──
const ICONS = [
  { name: "lc_ic_milk", prompt: "a glass jar of fresh whole milk, simple, on plain background" },
  { name: "lc_ic_cream", prompt: "a small jug of thick cream, simple, on plain background" },
  { name: "lc_ic_butter", prompt: "a golden block of fresh butter, simple, on plain background" },
  // imágenes referenciadas directo por componentes (lowerthird / blurexplainer inset / spooncream)
  { name: "lc_grandfather", prompt: "a wise old Amish grandfather with a deeply weathered kind face, plain hat and beard, warm dim light" },
  { name: "lc_spring_inset", prompt: "a small stone springhouse built low over a spring on a green hillside, old and mossy" },
];

// ── modo MATCH ──
if (MODE === "match") {
  fs.mkdirSync("public/broll", { recursive: true });
  const match = T.filter(([t, b]) => b._clip).map(([t, b]) => ({ name: b.name, concept: b.q, query: [b.q], dur: DLDUR }));
  fs.writeFileSync("public/broll/match_leche.json", JSON.stringify(match, null, 2));
  console.log(`match_leche.json: ${match.length} clips (avatar-full: ${AV_FULL.length} bloques)`);
  process.exit(0);
}

// ── BUILD ──
const have = (name) => fs.existsSync(`public/broll/${name}.mp4`);
const realSrc = (name) => {
  for (const suf of ["_1", "", "_2"]) for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const p = `public/real/${name}${suf}.${ext}`;
    if (fs.existsSync(p)) return p;
  }
  return null;
};

const avStarts = AV_FULL.map(([s]) => s);
const starts = T.map(([t]) => t);
const nextBound = (t) => {
  const nb = starts.filter((s) => s > t + 1e-6).sort((a, b) => a - b)[0] ?? TOTAL;
  const na = avStarts.filter((s) => s > t + 1e-6).sort((a, b) => a - b)[0] ?? TOTAL;
  return Math.min(nb, na, TOTAL);
};

let nClip = 0;
const beats = T.map(([t, b]) => {
  const end = nextBound(t);
  const ov = b.kind === "raw" ? 0.5 : 0;
  const isLast = end >= TOTAL - 1e-6;
  const dur = +(Math.max(0.2, (isLast ? Math.min(t + 12, TOTAL) : Math.min(end + ov, TOTAL)) - t)).toFixed(2);
  const { _clip, _img, q, name, ...rest } = b;
  const beat = { ...rest, start: +t.toFixed(2), dur };
  if (_clip) {
    if (have(name)) { nClip++; return { ...beat, src: `broll/${name}.mp4`, darken: 0 }; }
    const r = realSrc(name);
    if (r) { return { ...beat, src: r, darken: 0 }; }
    return { ...beat, src: `img/${name}.png`, darken: 0, gen: { type: "image", name, prompt: q + IMG_STYLE } };
  }
  if (_img) {
    const nm = beat.id;
    const g = { type: "image", name: beat.image ? `${beat.id}_bg` : nm, prompt: _img + (beat.kind === "raw" ? IMG_STYLE : HERO) };
    if (beat.kind === "raw") return { ...beat, src: `img/${nm}.png`, darken: 0, gen: g };
    if (beat.kind === "keyphrase") return { ...beat, src: `img/${nm}.png`, gen: g };
    return { ...beat, gen: g };
  }
  return beat;
});

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/leche.json", JSON.stringify({ video: "leche", avatar: "leche_opt.mp4", clipsfirst: true, beats }, null, 2));

// iconos de la ecuación → prompts_leche_icons.json (gen aparte)
fs.writeFileSync("public/img/prompts_leche_icons.json",
  JSON.stringify(ICONS.map((i) => ({ name: i.name, prompt: i.prompt + IMG_STYLE })), null, 2));

// ── avatar windows ──
const POS = ["cornerTR", "cornerBL", "cornerTL", "cornerBR"];
const inAvF = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const pip = [];
const hide = [];
let k = 0;
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  if (inAvF(b.start)) continue;
  const end = +(b.start + b.dur).toFixed(2);
  if (b.avhide) { hide.push([b.start, end]); continue; }
  pip.push([b.start, end, b.avpos || POS[Math.floor(k / 3) % POS.length]]);
  k++;
}
const modeAt = (t) => {
  if (t < OPEN - 1e-6) return "full";
  if (AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
  if (p) return p[2];
  if (hide.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "hidden";
  return "full";
};
const pts = [...new Set([0, OPEN, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), ...hide.flat(), TOTAL])].sort((a, b) => a - b);
const windows = [];
let cur = null;
for (const t of pts) {
  if (t >= TOTAL - 1e-6) break;
  const m = modeAt(t);
  if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; }
}
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync("src/VideoEdit/avatar_leche.gen.ts",
  `// avatar_leche.gen.ts — GENERADO por build_leche.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_LECHE = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

console.log(`=== build_leche (HOOK) ===`);
console.log(`beats: ${beats.length} · clips reales: ${nClip} · PiP: ${pip.length} · hide: ${hide.length} · windows: ${windows.length}`);
console.log(`dur min/max: ${Math.min(...beats.map((b) => b.dur))}s / ${Math.max(...beats.map((b) => b.dur))}s`);
