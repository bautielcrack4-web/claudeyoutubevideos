// build_construcciones.mjs — FLAGSHIP (nivel barcos): densifica (corte ~3.5s reusando los
// 97 clips por sección) + KIT de componentes (rule/stat/timeline/scalecolossus/datestamp/
// doclabel/placetag/countrail). Anclado al TIMING EXACTO de gen_tts (construcciones_timing.json).
// Emite beatsheet/construcciones.json + public/real/bing_construcciones.json (imgs de componentes).
//   node build_construcciones.mjs  →  node beatsheet.mjs beatsheet/construcciones.json
import fs from "fs";

const TM = JSON.parse(fs.readFileSync("public/construcciones_timing.json", "utf8"));
const CUES = JSON.parse(fs.readFileSync("src/VideoEdit/construcciones_cues.json", "utf8"));
const END = TM[TM.length - 1].start + 6;

// ── agrupar los 97 clips por sección (prefijo del name) ──
const SEC = { intro: [], gt: [], sx: [], bk: [], lg: [], pp: [], gp: [], se: [], cl: [] };
const pref = (n) => { for (const k of ["gt", "sx", "bk", "lg", "pp", "gp", "se", "cl"]) if (n.startsWith(k + "_")) return k; return "intro"; };
for (const c of CUES) SEC[pref(c.name)].push(c.name);
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

// ── datos por construcción (para los componentes) ──
const HUE = { gt: "amber", sx: "blue", bk: "amber", lg: "blue", pp: "blue", gp: "amber", se: "red" };
const DATA = [
  { k: "gt", n: "07", name: "Göbekli Tepe", loc: "Anatolia, Turquía", age: "≈ 9.600 a.C.", img: "gt_pillar", imgq: "Gobekli Tepe T pillar carved stone", imgc: "a massive carved T-shaped stone pillar at Gobekli Tepe", m: 5, unit: "m", scl: "de alto · 20 toneladas", stat: { value: 11600, suffix: " años", label: "más antiguo que la escritura y la rueda", eyebrow: "Antes de la agricultura" } },
  { k: "sx", n: "06", name: "Sacsayhuamán", loc: "Cusco, Perú", age: "s. XV (o antes)", img: "sx_wall", imgq: "Sacsayhuaman giant polygonal wall person", imgc: "a colossal polygonal stone of Sacsayhuaman with a person for scale", m: 125, unit: "t", scl: "por bloque · encaje perfecto", stat: { value: 0, prefix: "0", suffix: " mm", label: "no entra ni una hoja entre las piedras", eyebrow: "Sin mortero" } },
  { k: "bk", n: "05", name: "Baalbek", loc: "Valle de la Bekaa, Líbano", age: "Pre-romano", img: "bk_trilithon", imgq: "Baalbek trilithon megalith stones", imgc: "the colossal Trilithon stones of Baalbek", m: 1000, unit: "t", scl: "la Piedra Embarazada", stat: { value: 1600, suffix: " toneladas", label: "el bloque labrado más pesado del mundo antiguo", eyebrow: "Imposible de mover hoy" } },
  { k: "lg", n: "04", name: "Cuevas de Longyou", loc: "Zhejiang, China", age: "Desconocida", img: "lg_cave", imgq: "Longyou caves carved chamber pillar", imgc: "the giant carved interior of a Longyou cave", m: 30, unit: "m", scl: "de altura · talladas a mano", stat: { value: 0, prefix: "0", suffix: " registros", label: "nadie escribió quién las cavó", eyebrow: "Borradas de la historia" } },
  { k: "pp", n: "03", name: "Puma Punku", loc: "Tiahuanaco, Bolivia", age: "≈ 500 d.C.", img: "pp_hblock", imgq: "Puma Punku H block precise stone", imgc: "a machine-precise H-shaped andesite block at Puma Punku", m: 3850, unit: "m", scl: "de altitud · cortes de máquina", stat: { value: 90, suffix: "° exactos", label: "ángulos perfectos en diorita durísima", eyebrow: "Sin metal ni rueda" } },
  { k: "gp", n: "02", name: "Gran Pirámide de Guiza", loc: "Guiza, Egipto", age: "≈ 2.560 a.C.", img: "gp_pyramid", imgq: "great pyramid giza blocks close", imgc: "the Great Pyramid of Giza close up of its blocks", m: 2300000, unit: "", scl: "bloques de piedra", stat: { value: 6000000, suffix: " toneladas", label: "alineada con las estrellas, casi sin error", eyebrow: "En unos 20 años" } },
  { k: "se", n: "01", name: "El Serapeum de Saqqara", loc: "Saqqara, Egipto", age: "≈ 1.300 a.C.", img: "se_box", imgq: "Serapeum granite box saqqara", imgc: "a giant precision granite box in the Serapeum of Saqqara", m: 100, unit: "t", scl: "por caja de granito", stat: { value: 0, prefix: "±", suffix: " mm", label: "planitud de milésimas, a mano", eyebrow: "Precisión imposible" } },
];

// ── COLD OPEN / INTRO (densifica intro + headline) ──
const introClips = SEC.intro.length ? SEC.intro : CUES.slice(0, 12).map((c) => c.name);
const headTitle = startOf("siete_construcciones");
fill(0, headTitle, introClips, "cold");
C(headTitle, 6.0, { kind: "headline", tokens: tk([["7", "hl"], "construcciones", "que", "la", "ciencia", "no", "puede", ["explicar", "hl"]]), bg: "image", image: spImg("constr_hero", "ancient megalithic ruins dramatic", "dramatic ancient megalithic ruins"), hue: "amber", size: 92 });
const introEnd = startOf("gt_intro");
fill(headTitle + 6.0, introEnd, introClips, "cold");

// ── 7 CONSTRUCCIONES ──
for (let di = 0; di < DATA.length; di++) {
  const d = DATA[di];
  const pool = SEC[d.k].length ? SEC[d.k] : introClips;
  const secStart = startOf(d.k + "_intro");
  const next = di + 1 < DATA.length ? startOf(DATA[di + 1].k + "_intro") : startOf("cl_hilo");
  const hue = HUE[d.k];
  // 1) tarjeta de regla (Nº + nombre + lugar) al arrancar la sección
  C(secStart, 4.2, { kind: "rule", number: d.n, title: d.name, label: d.loc, hue });
  // overlays persistentes los primeros segundos
  ov(secStart + 4.2, 6.0, { kind: "doclabel", label: d.name, sub: d.loc, accent: hue });
  ov(secStart + 4.2, next - secStart - 4.4, { kind: "countrail", total: 7, rank: di + 1, name: d.name, accent: hue });
  // 2) densifica el resto de la sección con sus clips, e injerta componentes a 1/3 y 2/3
  const a = secStart + 4.2, b = next;
  const third = a + (b - a) / 3, twoThird = a + 2 * (b - a) / 3;
  fill(a, third, pool, hue);
  // scalecolossus (tamaño del megalito) con imagen propia
  C(third, 6.0, { kind: "scalecolossus", image: spImg(d.img, d.imgq, d.imgc), meters: d.m, unit: d.unit, eyebrow: d.name, label: d.scl, accent: hue });
  ov(third + 0.2, 5.0, { kind: "datestamp", value: d.age, label: d.name, accent: hue });
  fill(third + 6.0, twoThird, pool, hue);
  // stat del dato imposible
  C(twoThird, 5.2, { kind: "stat", ...d.stat, accent: di < 3 ? "accent" : "danger", hue });
  fill(twoThird + 5.2, b, pool, hue);
}

// ── CIERRE: timeline de las 7 + densifica + headline final ──
const clStart = startOf("cl_hilo");
const clPool = SEC.cl.length ? SEC.cl : introClips;
fill(clStart, startOf("cl_patron"), clPool, "amber");
C(startOf("cl_patron"), 8.5, { kind: "timeline", eyebrow: "Repartidas por el planeta y los milenios", title: "Lo imposible, una y otra vez", events: [
  { year: "9600 a.C.", label: "Göbekli Tepe" }, { year: "2560 a.C.", label: "Gran Pirámide" }, { year: "1300 a.C.", label: "Serapeum" }, { year: "500 d.C.", label: "Puma Punku" }, { year: "s. XV", label: "Sacsayhuamán" },
] });
fill(startOf("cl_patron") + 8.5, startOf("cl_teaser"), clPool, "amber");
C(startOf("cl_teaser"), 6.0, { kind: "headline", tokens: tk(["¿Y", "si", "supieron", "más", "de", "lo", "que", ["creemos?", "hl"]]), bg: "image", image: spImg("constr_dark", "ancient ruins mysterious dark sky", "mysterious ancient ruins under a dark sky"), hue: "red", size: 88 });
fill(startOf("cl_teaser") + 6.0, END, clPool, "amber");

// ordenar por start
B.sort((x, y) => x.start - y.start);
fs.writeFileSync("beatsheet/construcciones.json", JSON.stringify({ video: "construcciones", beats: B }, null, 1));
fs.writeFileSync("public/real/bing_construcciones.json", JSON.stringify(I, null, 1));
const raws = B.filter((b) => b.kind === "raw").length;
const comps = B.filter((b) => b.kind !== "raw" && !b.overlay).length;
const ovs = B.filter((b) => b.overlay).length;
console.log(`beats: ${B.length} · clips: ${raws} (corte ~${CUT}s) · componentes: ${comps} · overlays: ${ovs} · imgs nuevas: ${I.length}`);
console.log(`dur: ${(END / 60).toFixed(1)} min · → beatsheet/construcciones.json + bing_construcciones.json`);
