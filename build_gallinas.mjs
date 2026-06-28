// build_gallinas.mjs — autorea beatsheet/gallinas.json + avatar_gallinas.gen.ts
// "Cuánto Dinero Te Dan 50 Gallinas Ponedoras" (Cosecha Prohibida, ES) · amish-doc AVATAR.
//
// Identidad Amish-avatar: el viejo abre/cierra y da conclusiones a pantalla completa
// ("AV"); el cuerpo es b-roll LITERAL real full-bleed (RawShot) anclado al ms exacto
// del caption (public/segments_gallinas.json). Componentes ESCASOS y a propósito:
//   · stat   → las cifras de plata (1200 huevos, 6 semanas codorniz)
//   · quote  → la frase del abuelo
//   · annotated → los 3 ERRORES (foto + marca dibujada, NO tarjeta de texto)
//   · checklist → el resumen final
// Pacing pausado (5-8s), motion sutil, marca serif terrosa, grade cálido golden-hour.
//
// Flujo:  node build_gallinas.mjs
//         node beatsheet.mjs beatsheet/gallinas.json   (deriva prompts_gallinas.json + cues)
//         node flowgen.mjs public/img/prompts_gallinas.json   (Nano Banana, gratis)
import fs from "fs";

const segs = JSON.parse(fs.readFileSync("public/segments_gallinas.json", "utf8"));
const TOTAL = 1605; // 26:45
const OPEN = 1.2;

// Fórmula Nano Banana / Flow (foto de celu real, NO IA cinematográfica). Ver memoria
// feedback-nano-banana-prompt-formula. Cada escena: PREFIX + escena mundana + SUFFIX.
const PREFIX = "";
const SUFFIX =
  ", plain casual phone snapshot, not cinematic, not stylized, flat natural light, muted desaturated low-contrast colors, slight grain, unedited, no HDR, no dramatic light, no blur, no text";
// sacar rastros "cinematográficos" de la escena (contradicen la foto real)
const normalize = (s) => s
  .replace(/,?\s*at golden hour/gi, "")
  .replace(/golden hour/gi, "midday")
  .replace(/warm,?\s*inviting light/gi, "plain indoor light")
  .replace(/soft warm light/gi, "plain daylight")
  .replace(/warm window light/gi, "plain window light")
  .replace(/,?\s*warm light/gi, "")
  .replace(/,?\s*soft light/gi, "")
  .replace(/cinematic/gi, "")
  .replace(/\s{2,}/g, " ").replace(/\s+,/g, ",").trim();
const mk = (scene) => PREFIX + normalize(scene) + SUFFIX;

// "C|" = hue frío (industria/super/deuda/advertencia); por defecto amber (cálido terroso)
function parse(p) {
  if (p.startsWith("C|")) return { hue: "cold", prompt: p.slice(2) };
  return { hue: "amber", prompt: p };
}

const A = "AV"; // avatar a pantalla completa

// 1 entrada por oración (238). string|array = imágenes literales; objeto = beat especial.
const plan = [
  /*L1   0   */ A,
  /*L2   1   */ ["hens pecking in a rustic grassy backyard at golden hour, an old farmhouse behind", "close up of brown hens scratching among weeds and dirt"],
  /*L3   2   */ A,
  /*L4   3   */ ["weathered old farmer hands counting worn cash bills and coins on a wooden table", "C|a tired office worker in a crowded grey morning commute"],
  /*L5   4   */ A,
  /*L6   5   */ A,
  /*L7   6   */ ["a humble family table with a bowl of fresh brown eggs and homemade bread, warm window light"],
  /*L8   7   */ A,
  /*L9   8   */ ["C|an abandoned rusty empty chicken coop overgrown with weeds, grey overcast"],
  /*L10  9   */ A,
  /*L11  10  */ ["a steaming mate gourd with a metal straw on a weathered wooden table, rustic morning"],
  /*L12  11  */ ["C|a slick online course advertisement glowing on a laptop screen in a dark room", "an old wooden apple crate and stacked rusty tin sheets in a barnyard"],
  /*L13  12  */ ["an old hand using a worn pocket calculator beside a notebook and a few coins on a kitchen table"],
  /*L14  13  */ A,
  /*L15  14  */ ["close up portrait of a healthy plump brown laying hen with glossy feathers in a sunny yard"],
  /*L16  15  */ ["a wooden nesting box full of fresh brown eggs", "weathered hands gently collecting eggs from straw"],
  /*L17  16  */ ["a wicker basket overflowing with brown eggs on a rustic table"],
  /*L18  17  */ ["two dozen brown eggs neatly arranged in open cartons on a wooden table"],
  /*L19  18  */ ["a flock of many brown hens spread across a sunny farmyard"],
  /*L20  19  */ ["a rustic table completely covered with dozens and dozens of brown eggs, abundance"],
  /*L21  20  */ { id: "stat_huevos", kind: "stat", value: 1200, suffix: " HUEVOS", label: "POR MES", eyebrow: "50 GALLINAS PONEN", hue: "amber" },
  /*L22  21  */ A,
  /*L23  22  */ ["overflowing stacks of egg cartons piled high on a farmhouse table", "C|a long checkout queue at a supermarket, people waiting with carts"],
  /*L24  23  */ ["C|close up of an expensive egg price tag on a supermarket shelf"],
  /*L25  24  */ ["C|a supermarket egg shelf with a rising price sign"],
  /*L26  25  */ ["an old hand multiplying numbers with a pencil on lined paper, close up"],
  /*L27  26  */ ["weathered hands holding a small fan of cash bills, warm light"],
  /*L28  27  */ A,
  /*L29  28  */ ["weathered hands receiving cash bills from another person's hand"],
  /*L30  29  */ A,
  /*L31  30  */ A,
  /*L32  31  */ A,
  /*L33  32  */ ["a modest refrigerator shelf holding just a few egg cartons"],
  /*L34  33  */ A,
  /*L35  34  */ A,
  /*L36  35  */ ["a refrigerator packed completely full of eggs, no room left"],
  /*L37  36  */ ["a modest family eating breakfast with eggs at a kitchen table, morning light"],
  /*L38  37  */ ["weathered hands holding up a single egg with baskets of surplus eggs behind"],
  /*L39  38  */ ["a neighbor at a wooden gate receiving a carton of eggs from a farmer", "a small neighborhood greengrocer shop with crates of produce"],
  /*L40  39  */ ["macro of a cracked farm egg with a deep orange yolk beside a pale watery supermarket yolk"],
  /*L41  40  */ ["a hand exchanging a carton of eggs for cash at a doorstep"],
  /*L42  41  */ A,
  /*L43  42  */ A,
  /*L44  43  */ ["a skeptical middle-aged man frowning with arms crossed in a backyard"],
  /*L45  44  */ A,
  /*L46  45  */ A,
  /*L47  46  */ A,
  /*L48  47  */ A,
  /*L49  48  */ A,
  /*L50  49  */ A,
  /*L51  50  */ A,
  /*L52  51  */ { id: "quote_prov", kind: "quote", spanSegs: 2, eyebrow: "LA FRASE DEL ABUELO", hue: "amber", text: "La gallina que come del *bolsillo* te funde. La que come de la *tierra* te mantiene.", image: "img/q_proverbio.jpg", gen: { name: "q_proverbio", prompt: "hens foraging and scratching in dark rich earth in a rustic yard, warm golden light" } },
  /*L53  52  */ A,
  /*L54  53  */ A,
  /*L55  54  */ A,
  /*L56  55  */ A,
  /*L57  56  */ ["C|a bright industrial feed store aisle stacked with expensive bags of chicken feed"],
  /*L58  57  */ ["C|a single expensive sack of commercial chicken feed with a high price tag"],
  /*L59  58  */ A,
  /*L60  59  */ A,
  /*L61  60  */ ["hens foraging freely, pecking bugs and seeds in a green weedy yard"],
  /*L62  61  */ ["a hen catching a worm in the dirt, close up", "hens scratching and foraging in tall grass"],
  /*L63  62  */ A,
  /*L64  63  */ A,
  /*L65  64  */ ["a kitchen scrap bucket full of vegetable peels and leftovers on a counter"],
  /*L66  65  */ ["close up of vegetable peels, stale bread, rice and cabbage leaves in a compost bucket"],
  /*L67  66  */ ["a tin bucket of kitchen scraps being carried out to the coop"],
  /*L68  67  */ ["hens eagerly devouring kitchen scraps thrown on the ground, a feast"],
  /*L69  68  */ ["weathered hands scattering cracked corn and scraps to a flock of hens"],
  /*L70  69  */ ["an old farmer emptying a bucket of kitchen scraps for his hens with a small bag of cracked corn nearby"],
  /*L71  70  */ ["hens crowding around a pile of feed and scraps, well fed and content"],
  /*L72  71  */ A,
  /*L73  72  */ A,
  /*L74  73  */ A,
  /*L75  74  */ A,
  /*L76  75  */ A,
  /*L77  76  */ ["an old hand writing egg tallies and numbers in a worn notebook"],
  /*L78  77  */ ["weathered hands setting aside one carton of eggs on a family kitchen table"],
  /*L79  78  */ ["hands stacking egg cartons ready to sell"],
  /*L80  79  */ A,
  /*L81  80  */ ["a neighbor handing over cash for eggs at a doorstep, friendly"],
  /*L82  81  */ ["weathered hands holding a fan of cash bills beside a wall calendar"],
  /*L83  82  */ ["a calm content hen resting in soft warm light, close up"],
  /*L84  83  */ A,
  /*L85  84  */ A,
  /*L86  85  */ { id: "err1", kind: "annotated", eyebrow: "ERROR 1", hue: "cold", annotations: [{ kind: "circle", x: 0.5, y: 0.5, w: 0.42, color: "cold", label: "TODO DE GOLPE" }], image: "img/an_err1.jpg", gen: { name: "an_err1", prompt: "a pile of brand new shiny chicken coop equipment, automatic feeders and stacked feed bags in a store" } },
  /*L87  86  */ ["C|a person unloading lots of brand new chicken equipment and feed bags from a car trunk"],
  /*L88  87  */ ["C|an anxious man staring at a pile of receipts and bills on a table"],
  /*L89  88  */ ["C|a discouraged man walking away from an empty coop, shoulders down"],
  /*L90  89  */ A,
  /*L91  90  */ ["a small rustic chicken coop built from old tin sheets and scrap wood with a few hens"],
  /*L92  91  */ ["a few hens in a humble scrap-wood coop with eggs in a straw nest"],
  /*L93  92  */ ["weathered hands holding earned cash with hens in the background"],
  /*L94  93  */ A,
  /*L95  94  */ A,
  /*L96  95  */ A,
  /*L97  96  */ A,
  /*L98  97  */ ["an old weathered farmers almanac open to moon phases on a wooden table in warm light"],
  /*L99  98  */ ["a rustic Amish gardening almanac book resting on a wooden table, warm inviting light"],
  /*L100 99  */ ["close up of weathered hands leafing through the aged pages of an old almanac book"],
  /*L101 100 */ A,
  /*L102 101 */ A,
  /*L103 102 */ A,
  /*L104 103 */ { id: "err2", kind: "annotated", eyebrow: "ERROR 2", hue: "cold", annotations: [{ kind: "circle", x: 0.5, y: 0.45, w: 0.42, color: "cold", label: "LINDA, NO PONE" }], image: "img/an_err2.jpg", gen: { name: "an_err2", prompt: "a fancy ornamental show chicken with fluffy feathers, pretty but unproductive, in a yard" } },
  /*L105 104 */ ["C|a fancy ornamental chicken strutting, decorative but a poor layer"],
  /*L106 105 */ ["a sturdy productive brown laying hen breed standing healthy in a yard"],
  /*L107 106 */ ["weathered hands inspecting a hen at a small local farm"],
  /*L108 107 */ A,
  /*L109 108 */ { id: "err3", kind: "annotated", eyebrow: "ERROR 3", hue: "cold", annotations: [{ kind: "circle", x: 0.5, y: 0.55, w: 0.4, color: "cold", label: "AGUA SUCIA = NO PONE" }], image: "img/an_err3.jpg", gen: { name: "an_err3", prompt: "a dirty algae filled water dish in the hot sun next to a panting hen" } },
  /*L110 109 */ A,
  /*L111 110 */ A,
  /*L112 111 */ ["C|a hen panting in the heat beside a dirty warm water dish"],
  /*L113 112 */ A,
  /*L114 113 */ ["a worried farmer staring into an empty nest box, confused"],
  /*L115 114 */ ["a clean dish of fresh water and a shaded corner inside a coop"],
  /*L116 115 */ A,
  /*L117 116 */ A,
  /*L118 117 */ A,
  /*L119 118 */ A,
  /*L120 119 */ A,
  /*L121 120 */ ["a hand choosing to drop scraps into a bucket instead of the trash can"],
  /*L122 121 */ A,
  /*L123 122 */ ["weathered hands opening the back door of a house onto a yard at dawn"],
  /*L124 123 */ A,
  /*L125 124 */ A,
  /*L126 125 */ ["a single hen walking freely and independently across a yard"],
  /*L127 126 */ A,
  /*L128 127 */ ["a hand scattering feed to hens"],
  /*L129 128 */ ["clean water being poured into a coop dish"],
  /*L130 129 */ ["a sturdy coop closed safely at dusk, a fox lurking far in the background"],
  /*L131 130 */ A,
  /*L132 131 */ A,
  /*L133 132 */ A,
  /*L134 133 */ A,
  /*L135 134 */ A,
  /*L136 135 */ ["a few hens in a small city backyard patio with potted plants"],
  /*L137 136 */ ["hens comfortable in a surprisingly small urban yard corner"],
  /*L138 137 */ ["a compact backyard chicken setup fitting in the space of a parked car"],
  /*L139 138 */ ["small quail cages tucked into a tiny corner of a balcony"],
  /*L140 139 */ A,
  /*L141 140 */ A,
  /*L142 141 */ A,
  /*L143 142 */ A,
  /*L144 143 */ A,
  /*L145 144 */ ["a healthy robust free-range hen standing in the sun"],
  /*L146 145 */ ["C|a dark crowded industrial chicken shed packed with thousands of hens"],
  /*L147 146 */ ["a single healthy backyard hen in fresh air and sunlight"],
  /*L148 147 */ A,
  /*L149 148 */ A,
  /*L150 149 */ A,
  /*L151 150 */ A,
  /*L152 151 */ ["a worried young man beside his pregnant wife at a humble kitchen table, low light"],
  /*L153 152 */ A,
  /*L154 153 */ A,
  /*L155 154 */ A,
  /*L156 155 */ ["six hens in a small scrap-wood coop, a fresh modest start"],
  /*L157 156 */ ["a young man building a coop from found wood and wire"],
  /*L158 157 */ A,
  /*L159 158 */ ["a young man smiling while collecting plenty of eggs after a few months"],
  /*L160 159 */ ["a young man buying a few more hens with his egg money"],
  /*L161 160 */ ["a growing flock of hens beside a wooden quail box"],
  /*L162 161 */ ["a young man selling eggs and quail eggs to neighbors at a small roadside stand"],
  /*L163 162 */ A,
  /*L164 163 */ A,
  /*L165 164 */ A,
  /*L166 165 */ A,
  /*L167 166 */ A,
  /*L168 167 */ A,
  /*L169 168 */ A,
  /*L170 169 */ ["weathered hands with coins and a hen, each new hen paid by the last"],
  /*L171 170 */ A,
  /*L172 171 */ ["C|a credit card on top of a pile of mounting bills on a table"],
  /*L173 172 */ A,
  /*L174 173 */ A,
  /*L175 174 */ A,
  /*L176 175 */ A,
  /*L177 176 */ A,
  /*L178 177 */ A,
  /*L179 178 */ A,
  /*L180 179 */ A,
  /*L181 180 */ A,
  /*L182 181 */ A,
  /*L183 182 */ A,
  /*L184 183 */ A,
  /*L185 184 */ A,
  /*L186 185 */ A,
  /*L187 186 */ ["a tiny corner of a yard with stacked quail cages beside a few hens"],
  /*L188 187 */ ["close up of a small spotted quail held gently in a hand"],
  /*L189 188 */ ["several quail in a wooden cage, close up"],
  /*L190 189 */ ["macro of a tiny quail most people overlook"],
  /*L191 190 */ ["a young quail beside a full-size hen for scale, the quail much smaller"],
  /*L192 191 */ { id: "stat_codorniz", kind: "stat", value: 6, suffix: " SEMANAS", label: "Y YA PONE", eyebrow: "LA CODORNIZ", hue: "amber" },
  /*L193 192 */ ["a quail laying a small speckled egg in a cage"],
  /*L194 193 */ ["a hand holding several tiny speckled quail eggs"],
  /*L195 194 */ ["ten quail in the cage space of a single hen, side by side"],
  /*L196 195 */ A,
  /*L197 196 */ A,
  /*L198 197 */ ["small speckled quail eggs displayed at a premium in a gourmet health shop"],
  /*L199 198 */ A,
  /*L200 199 */ A,
  /*L201 200 */ A,
  /*L202 201 */ ["hens for the family table on one side and a compact quail breeding rack on the other in a small space"],
  /*L203 202 */ A,
  /*L204 203 */ A,
  /*L205 204 */ A,
  /*L206 205 */ A,
  /*L207 206 */ A,
  /*L208 207 */ A,
  /*L209 208 */ { id: "checklist1", kind: "checklist", spanSegs: 5, title: "LA RECETA DEL VIEJO", eyebrow: "RESUMEN", hue: "amber", items: [{ text: "Empezá con pocas" }, { text: "Alimentalas con lo que tirás" }, { text: "Elegí una raza que trabaje" }, { text: "Agua limpia y sombra" }, { text: "Sumá codornices al lado" }] },
  /*L210 209 */ A,
  /*L211 210 */ A,
  /*L212 211 */ A,
  /*L213 212 */ A,
  /*L214 213 */ A,
  /*L215 214 */ A,
  /*L216 215 */ A,
  /*L217 216 */ A,
  /*L218 217 */ A,
  /*L219 218 */ ["weathered hands opening the back door of a farmhouse at dawn, soft light"],
  /*L220 219 */ ["hens stirring and clucking in the early morning light"],
  /*L221 220 */ ["weathered hands gathering fresh eggs and vegetables in the morning"],
  /*L222 221 */ A,
  /*L223 222 */ A,
  /*L224 223 */ ["a full family pantry with eggs, jars of preserves and bread, secure and abundant"],
  /*L225 224 */ A,
  /*L226 225 */ A,
  /*L227 226 */ A,
  /*L228 227 */ A,
  /*L229 228 */ A,
  /*L230 229 */ A,
  /*L231 230 */ A,
  /*L232 231 */ A,
  /*L233 232 */ A,
  /*L234 233 */ A,
  /*L235 234 */ ["the Amish gardening almanac book resting on a rustic wooden table, warm inviting light"],
  /*L236 235 */ A,
  /*L237 236 */ A,
  /*L238 237 */ A,
];

if (plan.length !== segs.length) {
  console.error(`plan (${plan.length}) != segments (${segs.length}) — corregí el plan`);
  process.exit(1);
}

const segEnd = (i) => (i + 1 < segs.length ? segs[i + 1].t : TOTAL);
const consumed = new Array(segs.length).fill(false);
const imgs = [];      // {start, prompt, hue}
const specials = [];  // {start, beat}
const avIntervals = [];

for (let i = 0; i < segs.length; i++) {
  if (consumed[i]) continue;
  const s0 = segs[i].t;
  const s1 = segEnd(i);
  const entry = plan[i];
  if (entry === A) { avIntervals.push([s0, s1]); continue; }
  if (entry && typeof entry === "object" && !Array.isArray(entry)) {
    const span = entry.spanSegs || 1;
    for (let k = 1; k < span; k++) consumed[i + k] = true;
    specials.push({ start: +s0.toFixed(2), beat: entry });
    continue;
  }
  const arr = Array.isArray(entry) ? entry : [entry];
  for (let kk = 0; kk < arr.length; kk++) {
    let st = s0 + (kk * (s1 - s0)) / arr.length;
    if (i === 0 && kk === 0) st = Math.max(OPEN, st);
    const { hue, prompt } = parse(arr[kk]);
    imgs.push({ start: +st.toFixed(2), scene: normalize(prompt), hue });
  }
}

// densificar: ningún hold largo de imagen > MAXHOLD; se parte en tomas DISTINTAS.
const avStarts = avIntervals.map(([s]) => s);
const specialStarts = specials.map((s) => s.start);
const evt = [...imgs.map((b) => b.start), ...specialStarts, ...avStarts, TOTAL].sort((a, b) => a - b);
const nextEvt = (t) => evt.find((b) => b > t + 1e-6) ?? TOTAL;
const MAXHOLD = 7.0;
const VARI = ["", ", a wider establishing shot", ", an extreme close-up macro detail", ", seen from a slightly different angle", ", a low overhead view", ", a softer out-of-focus background"];
const expanded = [];
for (const im of imgs) {
  const span = nextEvt(im.start) - im.start;
  const k = span > 8.0 ? Math.ceil(span / MAXHOLD) : 1;
  for (let j = 0; j < k; j++) {
    const st = im.start + (j * span) / k;
    const scene = j === 0 ? im.scene : im.scene + VARI[j % VARI.length];
    expanded.push({ start: +st.toFixed(2), scene, hue: im.hue });
  }
}

// límites para dur (incluye imágenes, especiales, avatar-full)
const allStarts = [...expanded.map((e) => e.start), ...specialStarts, ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => allStarts.find((b) => b > t + 1e-6) ?? TOTAL;

// ── CLIPS-FIRST: cada b-roll = clip REAL de YouTube matcheado a la narración.
// Prioridad de src (pickSrc): clip matcheado (broll/*.mp4) > imagen web real (real/*.jpg)
// > imagen IA (img/*.jpg, último recurso). La query del clip = la escena (ya visual y
// anclada al tema). El match list (match_gallinas.json) lo consume scripts/matchfarm.mjs.
const matchList = []; // {name, query, concept, dur} para el farm de matcheo
let nn = 0;
const pickSrc = (name) =>
  fs.existsSync(`public/broll/${name}.mp4`) ? `broll/${name}.mp4`
  : fs.existsSync(`public/real/${name}.jpg`) ? `real/${name}.jpg`
  : `img/${name}.jpg`;
const rawBeats = expanded.sort((a, b) => a.start - b.start).map((e) => {
  nn++;
  const name = `g${String(nn).padStart(3, "0")}`;
  const dur = +(nextBound(e.start) - e.start).toFixed(2);
  const query = normalize(e.scene);
  matchList.push({ name, query: [query], concept: query, dur: Math.max(4, Math.ceil(dur) + 1) });
  return {
    id: name, start: e.start, dur,
    kind: "raw", src: pickSrc(name), hue: e.hue,
    gen: { type: "image", name, prompt: mk(e.scene) }, // fallback IA si no hay clip ni web
  };
});
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync("public/broll/match_gallinas.json", JSON.stringify(matchList, null, 2));

const specialBeats = specials.map((sp) => {
  const b = sp.beat;
  const out = { id: b.id, start: sp.start, dur: +(nextBound(sp.start) - sp.start).toFixed(2), kind: b.kind };
  for (const f of ["value", "prefix", "suffix", "decimals", "label", "eyebrow", "accent", "hue", "items", "title", "text", "caption", "annotations", "number"]) {
    if (b[f] !== undefined) out[f] = b[f];
  }
  if (b.image) out.image = b.image;
  if (b.gen) out.gen = { type: "image", name: b.gen.name, prompt: mk(b.gen.prompt) };
  return out;
});

const beats = [...rawBeats, ...specialBeats].sort((a, b) => a.start - b.start);

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/gallinas.json", JSON.stringify({ video: "gallinas", avatar: "gallinas_avatar.mp4", beats }, null, 2));

// ── avatar windows: full en [0,OPEN) y en cada intervalo AV; hidden el resto ──
avIntervals.sort((a, b) => a[0] - b[0]);
const merged = [];
for (const iv of avIntervals) {
  const last = merged[merged.length - 1];
  if (last && iv[0] <= last[1] + 1e-6) last[1] = Math.max(last[1], iv[1]);
  else merged.push([...iv]);
}
const windows = [{ start: 0, mode: "full" }];
let cur = "full";
const push = (start, mode) => { if (mode !== cur) { windows.push({ start: +start.toFixed(2), mode }); cur = mode; } };
// si el primer beat de imagen arranca después de OPEN, el avatar sigue full hasta ahí
const firstImg = Math.min(...beats.filter((b) => b.kind !== "talk").map((b) => b.start));
push(Math.max(OPEN, firstImg), "hidden");
for (const [s, e] of merged) { push(s, "full"); if (e < TOTAL - 1e-6) push(e, "hidden"); }
windows.push({ start: TOTAL, mode: "hidden" });

const avTs = `// avatar_gallinas.gen.ts — GENERADO por build_gallinas.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_GALLINAS = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_gallinas.gen.ts", avTs);

const avSecs = merged.reduce((a, [s, e]) => a + (e - s), 0);
console.log(`=== build_gallinas ===`);
console.log(`beats: ${beats.length}  ·  raw: ${rawBeats.length}  ·  especiales: ${specialBeats.length}  (${specialBeats.map((b) => b.kind).join(",")})`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min de ${(TOTAL / 60).toFixed(1)}min  ·  windows: ${windows.length}`);
console.log(`dur min/max imagen: ${Math.min(...rawBeats.map((b) => b.dur))}s / ${Math.max(...rawBeats.map((b) => b.dur))}s`);
console.log(`→ beatsheet/gallinas.json · src/VideoEdit/avatar_gallinas.gen.ts`);
