// build_antartida.mjs — FLAGSHIP (nivel ciudades): densifica + KIT de componentes,
// anclado al TIMING de gen_tts (antartida_timing.json). NO_WATERMARK ya aplicado en el match.
//   node build_antartida.mjs  →  node beatsheet.mjs beatsheet/antartida.json
import fs from "fs";

const TM = JSON.parse(fs.readFileSync("public/antartida_timing.json", "utf8"));
const CUES = JSON.parse(fs.readFileSync("src/VideoEdit/antartida_cues.json", "utf8"));
const END = TM[TM.length - 1].start + 6;

const SEC = { intro: [], vk: [], mg: [], pi: [], ge: [], cv: [], rd: [], hj: [], cl: [] };
const pref = (n) => { for (const k of ["vk", "mg", "pi", "ge", "cv", "rd", "hj", "cl"]) if (n.startsWith(k + "_")) return k; return "intro"; };
const hasClip = (n) => fs.existsSync("public/broll/" + n + ".mp4");
for (const c of CUES) if (hasClip(c.name)) SEC[pref(c.name)].push(c.name);
const _missing = CUES.filter((c) => !hasClip(c.name)).length;
if (_missing) console.log(`⚠ ${_missing}/${CUES.length} conceptos sin clip en disco (se reusan los de su sección)`);
const startOf = (name) => CUES.find((c) => c.name === name)?.start ?? 0;

const B = [], I = []; let _n = 0;
const nid = (p) => p + String(++_n).padStart(3, "0");
const seenI = new Set();
const spImg = (name, query, concept) => { if (!seenI.has(name)) { seenI.add(name); I.push({ name, query: Array.isArray(query) ? query : [query], concept }); } return "real/" + name + ".jpg"; };
const raw = (start, dur, src, hue) => B.push({ id: nid("c"), start: +start.toFixed(2), dur: +dur.toFixed(2), kind: "raw", src, hue });
const C = (start, dur, o) => B.push({ id: nid(o.kind), start: +start.toFixed(2), dur: +dur.toFixed(2), ...o });
const ov = (start, dur, o) => B.push({ id: nid("o"), start: +start.toFixed(2), dur: +dur.toFixed(2), overlay: true, ...o });
const tk = (arr) => arr.map((x) => (Array.isArray(x) ? { t: x[0], [x[1]]: true } : { t: x }));

const CUT = 3.6;
const fill = (a, b, pool, hue) => {
  if (b - a < 0.4 || !pool.length) return;
  const k = Math.max(1, Math.round((b - a) / CUT));
  for (let j = 0; j < k; j++) {
    const s = a + (b - a) * j / k, e = a + (b - a) * (j + 1) / k;
    raw(s, e - s, "broll/" + pool[j % pool.length] + ".mp4", hue);
  }
};

const HUE = { vk: "blue", mg: "red", pi: "amber", ge: "blue", cv: "amber", rd: "blue", hj: "red" };
const DATA = [
  { k: "vk", n: "07", name: "Lago Vostok", loc: "Antártida Oriental", age: "Sellado ~15M años", img: "vk_lake", imgq: "subglacial lake vostok ice diagram", imgc: "the subglacial Lake Vostok sealed under kilometers of ice", m: 4000, unit: "m", scl: "de hielo encima · agua de millones de años", stat: { value: 15000000, suffix: " años", label: "aislado del mundo, con vida propia", eyebrow: "Un mundo bajo el hielo" } },
  { k: "mg", n: "06", name: "La anomalía magnética", loc: "Borde del lago Vostok", age: "Detectada 2001", img: "mg_anomaly", imgq: "magnetic anomaly map heat antarctica", imgc: "a huge magnetic anomaly heat map over the ice", m: 65, unit: "km", scl: "de anomalía que tuerce las brújulas", stat: { value: 0, prefix: "≈", suffix: " masa densa", label: "algo enorme distorsiona el magnetismo", eyebrow: "Bajo el hielo, sin ver" } },
  { k: "pi", n: "05", name: "Las pirámides de hielo", loc: "Montañas Ellsworth", age: "Erosión (¿?)", img: "pi_pyramid", imgq: "antarctica pyramid mountain symmetric", imgc: "a strikingly pyramid-shaped mountain in Antarctica", m: 1265, unit: "m", scl: "de alto · cuatro caras casi perfectas", stat: { value: 4, suffix: " caras", label: "demasiado simétrica para muchos ojos", eyebrow: "¿Natural o no?" } },
  { k: "ge", n: "04", name: "Las zonas borrosas", loc: "Coordenadas censuradas", age: "Mapas satelitales", img: "ge_blur", imgq: "blurred censored satellite image snow", imgc: "a deliberately blurred patch on a satellite map of snow", m: 0, unit: "nítido", scl: "justo donde queremos mirar", stat: { value: 0, prefix: "0", suffix: " explicación", label: "lo único borroso de un mapa nítido", eyebrow: "¿Quién lo borró?" } },
  { k: "cv", n: "03", name: "Las cuevas templadas", loc: "Monte Erebus", age: "Volcán activo", img: "cv_cave", imgq: "blue ice cave warm interior antarctica", imgc: "a warm glowing ice cave heated by a volcano", m: 3794, unit: "m", scl: "de volcán activo bajo el hielo", stat: { value: 25, suffix: " °C", label: "cuevas cálidas en el corazón del frío", eyebrow: "Refugios ocultos" } },
  { k: "rd", n: "02", name: "Los ecos de radar", loc: "Bajo cientos de metros de hielo", age: "Sin perforar", img: "rd_radar", imgq: "ice penetrating radar buried structure", imgc: "a symmetric structure outline revealed by ice-penetrating radar", m: 800, unit: "m", scl: "de hielo sobre formas demasiado rectas", stat: { value: 0, prefix: "?", suffix: " confirmado", label: "demasiado caro de perforar para saberlo", eyebrow: "Formas que no encajan" } },
  { k: "hj", n: "01", name: "La Operación Highjump", loc: "Antártida · 1946-47", age: "Replegada en semanas", img: "hj_fleet", imgq: "operation highjump navy fleet antarctica vintage", imgc: "the massive 1947 US Navy fleet of Operation Highjump in the ice", m: 4700, unit: "hombres", scl: "para un desierto supuestamente vacío", stat: { value: 4700, suffix: " hombres", label: "y se replegó mucho antes de lo previsto", eyebrow: "13 barcos · un portaaviones" } },
];

// ── COLD OPEN / INTRO ──
const introClips = SEC.intro.length ? SEC.intro : CUES.slice(0, 12).map((c) => c.name);
const headTitle = startOf("intro_siete");
fill(0, headTitle, introClips, "cold");
C(headTitle, 6.0, { kind: "headline", tokens: tk([["7", "hl"], "estructuras", "bajo", "el", "hielo", "que", "no", "deberían", ["existir", "hl"]]), bg: "image", image: spImg("ant_hero", "antarctica ice mysterious dark dramatic", "dramatic dark mysterious antarctic ice landscape"), hue: "blue", size: 84 });
const introEnd = startOf("vk_intro");
fill(headTitle + 6.0, introEnd, introClips, "cold");

// ── 7 ESTRUCTURAS ──
for (let di = 0; di < DATA.length; di++) {
  const d = DATA[di];
  const pool = SEC[d.k].length ? SEC[d.k] : introClips;
  const secStart = startOf(d.k + "_intro");
  const next = di + 1 < DATA.length ? startOf(DATA[di + 1].k + "_intro") : startOf("cl_bajado");
  const hue = HUE[d.k];
  C(secStart, 4.2, { kind: "rule", number: d.n, title: d.name, label: d.loc, hue });
  ov(secStart + 4.2, 6.0, { kind: "doclabel", label: d.name, sub: d.loc, accent: hue });
  ov(secStart + 4.2, next - secStart - 4.4, { kind: "countrail", total: 7, rank: +d.n, name: d.name, accent: hue });
  const a = secStart + 4.2, b = next;
  const third = a + (b - a) / 3, twoThird = a + 2 * (b - a) / 3;
  fill(a, third, pool, hue);
  C(third, 6.0, { kind: "scalecolossus", image: spImg(d.img, d.imgq, d.imgc), meters: d.m, unit: d.unit, eyebrow: d.name, label: d.scl, accent: hue });
  ov(third + 0.2, 5.0, { kind: "datestamp", value: d.age, label: d.name, accent: hue });
  fill(third + 6.0, twoThird, pool, hue);
  C(twoThird, 5.2, { kind: "stat", ...d.stat, accent: di < 4 ? "accent" : "danger", hue });
  fill(twoThird + 5.2, b, pool, hue);
}

// ── CIERRE ──
const clStart = startOf("cl_bajado");
const clPool = SEC.cl.length ? SEC.cl : introClips;
fill(clStart, startOf("cl_juntalas"), clPool, "blue");
C(startOf("cl_juntalas"), 8.5, { kind: "timeline", eyebrow: "Un continente que apenas vimos", title: "Bajo el hielo, una y otra vez", events: [
  { year: "15M años", label: "Lago Vostok" }, { year: "1946", label: "Op. Highjump" }, { year: "2001", label: "Anomalía magn." }, { year: "Hoy", label: "Ecos de radar" }, { year: "?", label: "Zonas borrosas" },
] });
fill(startOf("cl_juntalas") + 8.5, startOf("cl_proximo"), clPool, "blue");
C(startOf("cl_proximo"), 6.0, { kind: "headline", tokens: tk(["¿Y", "si", "lo", "imposible", "duerme", "bajo", "la", ["arena?", "hl"]]), bg: "image", image: spImg("ant_desert", "desert dunes buried ruins aerial", "ruins half buried under desert dunes"), hue: "amber", size: 84 });
fill(startOf("cl_proximo") + 6.0, END, clPool, "blue");

B.sort((x, y) => x.start - y.start);
fs.writeFileSync("beatsheet/antartida.json", JSON.stringify({ video: "antartida", beats: B }, null, 1));
fs.writeFileSync("public/real/bing_antartida.json", JSON.stringify(I, null, 1));
const raws = B.filter((b) => b.kind === "raw").length;
const comps = B.filter((b) => b.kind !== "raw" && !b.overlay).length;
const ovs = B.filter((b) => b.overlay).length;
console.log(`beats: ${B.length} · clips: ${raws} (corte ~${CUT}s) · componentes: ${comps} · overlays: ${ovs} · imgs nuevas: ${I.length}`);
console.log(`dur: ${(END / 60).toFixed(1)} min · → beatsheet/antartida.json + bing_antartida.json`);
