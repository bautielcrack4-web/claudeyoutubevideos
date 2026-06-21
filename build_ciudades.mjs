// build_ciudades.mjs — FLAGSHIP (nivel barcos/construcciones): densifica (corte ~3.6s reusando
// los ~108 clips por sección) + KIT de componentes (rule/stat/timeline/scalecolossus/datestamp/
// doclabel/countrail). Anclado al TIMING EXACTO de gen_tts (ciudades_timing.json).
// Emite beatsheet/ciudades.json + public/real/bing_ciudades.json (imgs de componentes).
//   node build_ciudades.mjs  →  node beatsheet.mjs beatsheet/ciudades.json
import fs from "fs";

const TM = JSON.parse(fs.readFileSync("public/ciudades_timing.json", "utf8"));
const CUES = JSON.parse(fs.readFileSync("src/VideoEdit/ciudades_cues.json", "utf8"));
const END = TM[TM.length - 1].start + 6;

// ── agrupar los clips por sección (prefijo del name) ──
const SEC = { intro: [], pv: [], pr: [], ba: [], dw: [], he: [], yo: [], cu: [], cl: [] };
const pref = (n) => { for (const k of ["pv", "pr", "ba", "dw", "he", "yo", "cu", "cl"]) if (n.startsWith(k + "_")) return k; return "intro"; };
// SOLO clips que existen en disco (real bajado o stock) → el densificador nunca referencia un .mp4 inexistente
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

// DENSIFICA un tramo [a,b) con los clips de una sección (corte ~CUT, round-robin, sin repetir seguido)
const CUT = 3.6;
const fill = (a, b, pool, hue) => {
  if (b - a < 0.4 || !pool.length) return;
  const k = Math.max(1, Math.round((b - a) / CUT));
  for (let j = 0; j < k; j++) {
    const s = a + (b - a) * j / k, e = a + (b - a) * (j + 1) / k;
    raw(s, e - s, "broll/" + pool[j % pool.length] + ".mp4", hue);
  }
};

// ── datos por ciudad (para los componentes) · escala = PROFUNDIDAD (perfecto para ciudades sumergidas) ──
const HUE = { pv: "blue", pr: "red", ba: "blue", dw: "amber", he: "amber", yo: "blue", cu: "red" };
const DATA = [
  { k: "pv", n: "07", name: "Pavlopetri", loc: "Laconia, Grecia", age: "≈ 3.000 a.C.", img: "pv_layout", imgq: "Pavlopetri underwater city layout aerial", imgc: "the layout of the submerged city of Pavlopetri seen from above", m: 4, unit: "m", scl: "de profundidad · ciudad entera intacta", stat: { value: 5000, suffix: " años", label: "habitada antes de las grandes pirámides", eyebrow: "Edad de Bronce" } },
  { k: "pr", n: "06", name: "Port Royal", loc: "Jamaica, Caribe", age: "7 jun. 1692", img: "pr_town", imgq: "Port Royal sunken colonial town underwater", imgc: "the sunken colonial pirate town of Port Royal", m: 12, unit: "m", scl: "bajo el agua · tragada en minutos", stat: { value: 2000, suffix: " muertos", label: "el suelo se volvió líquido y los tragó", eyebrow: "Licuefacción del terreno" } },
  { k: "ba", n: "05", name: "Baiae", loc: "Bahía de Nápoles, Italia", age: "Imperio Romano", img: "ba_villa", imgq: "Baiae underwater roman ruins mosaic", imgc: "the submerged Roman villas and mosaics of Baiae", m: 6, unit: "m", scl: "bajo el agua · villas imperiales", stat: { value: 0, prefix: "≈", suffix: " refugio", label: "ni el imperio más rico pudo salvarla", eyebrow: "Hundida por el bradisismo" } },
  { k: "dw", n: "04", name: "Dwarka", loc: "Golfo de Cambay, India", age: "Mito → piedra", img: "dw_city", imgq: "Dwarka underwater stone blocks gujarat", imgc: "the submerged dressed-stone blocks found off Dwarka", m: 20, unit: "m", scl: "bajo el agua · la ciudad de un dios", stat: { value: 9000, prefix: "¿", suffix: " años?", label: "algunos restos llevan la zona mucho más atrás", eyebrow: "La leyenda de Krishna" } },
  { k: "he", n: "03", name: "Thonis-Heracleion", loc: "Bahía de Abukir, Egipto", age: "Hallada en 2000", img: "he_statue", imgq: "Heracleion colossal statue underwater egypt", imgc: "a colossal Egyptian statue from Heracleion lying on the seabed", m: 5, unit: "m", scl: "de estatuas colosales en el fondo", stat: { value: 64, suffix: " barcos", label: "hundidos junto a la ciudad que se creía un mito", eyebrow: "Una metrópolis entera" } },
  { k: "yo", n: "02", name: "Monumento de Yonaguni", loc: "Okinawa, Japón", age: "¿+10.000 años?", img: "yo_monument", imgq: "Yonaguni monument underwater terraces", imgc: "the terraced Yonaguni Monument rising from the seabed", m: 27, unit: "m", scl: "de altura · terrazas y ángulos rectos", stat: { value: 10000, prefix: "¿", suffix: " años?", label: "si es artificial, nadie debería haberlo construido", eyebrow: "¿Natural o humano?" } },
  { k: "cu", n: "01", name: "Estructura sumergida de Cuba", loc: "Cabo de San Antonio, Cuba", age: "Sonar, 2001", img: "cu_structure", imgq: "underwater pyramid structures deep sonar dark", imgc: "geometric pyramid-like structures on the deep dark seabed", m: 700, unit: "m", scl: "de profundidad · imposible para la cronología", stat: { value: 700, suffix: " metros", label: "demasiado profundo para cualquier ciudad conocida", eyebrow: "Detectada por sonar en 2001" } },
];

// ── COLD OPEN / INTRO (densifica intro + headline) ──
const introClips = SEC.intro.length ? SEC.intro : CUES.slice(0, 12).map((c) => c.name);
const headTitle = startOf("intro_siete");
fill(0, headTitle, introClips, "cold");
C(headTitle, 6.0, { kind: "headline", tokens: tk([["7", "hl"], "ciudades", "sumergidas", "que", "la", "ciencia", "no", "puede", ["explicar", "hl"]]), bg: "image", image: spImg("ciud_hero", "underwater sunken city ruins dramatic", "dramatic underwater ruins of a sunken city"), hue: "blue", size: 88 });
const introEnd = startOf("pv_intro");
fill(headTitle + 6.0, introEnd, introClips, "cold");

// ── 7 CIUDADES ──
for (let di = 0; di < DATA.length; di++) {
  const d = DATA[di];
  const pool = SEC[d.k].length ? SEC[d.k] : introClips;
  const secStart = startOf(d.k + "_intro");
  const next = di + 1 < DATA.length ? startOf(DATA[di + 1].k + "_intro") : startOf("cl_ventanas");
  const hue = HUE[d.k];
  // 1) tarjeta de regla (Nº + nombre + lugar) al arrancar la sección
  C(secStart, 4.2, { kind: "rule", number: d.n, title: d.name, label: d.loc, hue });
  // overlays persistentes los primeros segundos
  ov(secStart + 4.2, 6.0, { kind: "doclabel", label: d.name, sub: d.loc, accent: hue });
  ov(secStart + 4.2, next - secStart - 4.4, { kind: "countrail", total: 7, rank: +d.n, name: d.name, accent: hue });
  // 2) densifica el resto de la sección con sus clips, e injerta componentes a 1/3 y 2/3
  const a = secStart + 4.2, b = next;
  const third = a + (b - a) / 3, twoThird = a + 2 * (b - a) / 3;
  fill(a, third, pool, hue);
  // scalecolossus (profundidad / escala) con imagen propia
  C(third, 6.0, { kind: "scalecolossus", image: spImg(d.img, d.imgq, d.imgc), meters: d.m, unit: d.unit, eyebrow: d.name, label: d.scl, accent: hue });
  ov(third + 0.2, 5.0, { kind: "datestamp", value: d.age, label: d.name, accent: hue });
  fill(third + 6.0, twoThird, pool, hue);
  // stat del dato imposible
  C(twoThird, 5.2, { kind: "stat", ...d.stat, accent: di < 4 ? "accent" : "danger", hue });
  fill(twoThird + 5.2, b, pool, hue);
}

// ── CIERRE: timeline de las 7 + densifica + headline teaser ──
const clStart = startOf("cl_ventanas");
const clPool = SEC.cl.length ? SEC.cl : introClips;
fill(clStart, startOf("cl_doce_mil"), clPool, "blue");
C(startOf("cl_doce_mil"), 8.5, { kind: "timeline", eyebrow: "Repartidas por el planeta y los milenios", title: "El mar guardó lo que la tierra perdió", events: [
  { year: "¿remoto?", label: "Cuba" }, { year: "¿+10.000 a.C.?", label: "Yonaguni" }, { year: "3.000 a.C.", label: "Pavlopetri" }, { year: "s. II a.C.", label: "Heracleion" }, { year: "1692", label: "Port Royal" },
] });
fill(startOf("cl_doce_mil") + 8.5, startOf("cl_teaser_antartida"), clPool, "blue");
C(startOf("cl_teaser_antartida"), 6.0, { kind: "headline", tokens: tk(["¿Y", "si", "lo", "imposible", "duerme", "bajo", "el", ["hielo?", "hl"]]), bg: "image", image: spImg("ciud_ice", "antarctica ice sheet mysterious frozen", "mysterious shapes under the Antarctic ice"), hue: "blue", size: 84 });
fill(startOf("cl_teaser_antartida") + 6.0, END, clPool, "blue");

// ordenar por start
B.sort((x, y) => x.start - y.start);
fs.writeFileSync("beatsheet/ciudades.json", JSON.stringify({ video: "ciudades", beats: B }, null, 1));
fs.writeFileSync("public/real/bing_ciudades.json", JSON.stringify(I, null, 1));
const raws = B.filter((b) => b.kind === "raw").length;
const comps = B.filter((b) => b.kind !== "raw" && !b.overlay).length;
const ovs = B.filter((b) => b.overlay).length;
console.log(`beats: ${B.length} · clips: ${raws} (corte ~${CUT}s) · componentes: ${comps} · overlays: ${ovs} · imgs nuevas: ${I.length}`);
console.log(`dur: ${(END / 60).toFixed(1)} min · → beatsheet/ciudades.json + bing_ciudades.json`);
