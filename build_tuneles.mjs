// build_tuneles.mjs — FLAGSHIP, anclado al timing de gen_tts (tuneles_timing.json).
//   node build_tuneles.mjs  →  node beatsheet.mjs beatsheet/tuneles.json
import fs from "fs";
const TM = JSON.parse(fs.readFileSync("public/tuneles_timing.json", "utf8"));
const CUES = JSON.parse(fs.readFileSync("src/VideoEdit/tuneles_cues.json", "utf8"));
const END = TM[TM.length - 1].start + 6;
const SEC = { intro: [], hs: [], ba: [], ta: [], lg: [], st: [], rv: [], dk: [], cl: [] };
const pref = (n) => { for (const k of ["hs", "ba", "ta", "lg", "st", "rv", "dk", "cl"]) if (n.startsWith(k + "_")) return k; return "intro"; };
const hasClip = (n) => fs.existsSync("public/broll/" + n + ".mp4");
for (const c of CUES) if (hasClip(c.name)) SEC[pref(c.name)].push(c.name);
const _missing = CUES.filter((c) => !hasClip(c.name)).length;
if (_missing) console.log(`⚠ ${_missing}/${CUES.length} sin clip (se reusan los de su sección)`);
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
  for (let j = 0; j < k; j++) { const s = a + (b - a) * j / k, e = a + (b - a) * (j + 1) / k; raw(s, e - s, "broll/" + pool[j % pool.length] + ".mp4", hue); }
};
const HUE = { hs: "amber", ba: "red", ta: "blue", lg: "amber", st: "blue", rv: "red", dk: "amber" };
const DATA = [
  { k: "hs", n: "07", name: "Hipogeo de Hal Saflieni", loc: "Malta", age: "≈ 3.000 a.C.", img: "hs_chamber", imgq: "Hal Saflieni Hypogeum carved underground chamber malta", imgc: "the carved underground oracle chamber of the Hal Saflieni Hypogeum", m: 3, unit: "niveles", scl: "excavados en la roca hace 5.000 años", stat: { value: 5000, suffix: " años", label: "una cámara que amplifica la voz humana", eyebrow: "Acústica imposible" } },
  { k: "ba", n: "06", name: "El túnel del inframundo", loc: "Baiae, Italia", age: "Romano", img: "ba_tunnel", imgq: "long straight dark ancient tunnel torch", imgc: "an impossibly straight dark ancient tunnel into a hillside", m: 200, unit: "m", scl: "de túnel recto perfecto hacia un río de fuego", stat: { value: 0, prefix: "≈0", suffix: " desviación", label: "cortado en línea recta perfecta bajo la montaña", eyebrow: "Entrada al inframundo" } },
  { k: "ta", n: "05", name: "Cuevas de los Tayos", loc: "Ecuador", age: "Desconocida", img: "ta_cave", imgq: "huge jungle cave gallery deep ecuador", imgc: "the colossal deep jungle cave galleries of Los Tayos", m: 200, unit: "m", scl: "de galerías que se hunden en la selva", stat: { value: 0, prefix: "¿", suffix: " biblioteca?", label: "la leyenda de láminas de metal grabadas", eyebrow: "Cuevas reales, mito incierto" } },
  { k: "lg", n: "04", name: "Cuevas de Longyou", loc: "Zhejiang, China", age: "Desconocida", img: "lg_cavern", imgq: "Longyou caves giant carved pillar cavern china", imgc: "a cathedral-sized hand-carved Longyou cavern with pillars", m: 24, unit: "cavernas", scl: "talladas a mano, del tamaño de catedrales", stat: { value: 0, prefix: "0", suffix: " registros", label: "nadie escribió quién las cavó ni para qué", eyebrow: "Obra titánica, borrada" } },
  { k: "st", n: "03", name: "La red de la Edad de Piedra", loc: "Escocia → Turquía", age: "≈ 12.000 años", img: "st_map", imgq: "map of europe ancient tunnels network", imgc: "a map of Stone Age tunnels stretching across Europe", m: 3000, unit: "km", scl: "de túneles repartidos por medio continente", stat: { value: 12000, suffix: " años", label: "túneles del Neolítico por toda Europa", eyebrow: "Antes de las pirámides" } },
  { k: "rv", n: "02", name: "Los túneles de Ravne", loc: "Bosnia", age: "Discutida", img: "rv_tunnel", imgq: "long underground dug tunnel dark bosnia", imgc: "kilometers of man-made tunnels under a hill, some sealed", m: 3, unit: "km", scl: "de pasadizos sellados a propósito", stat: { value: 0, prefix: "¿", suffix: " sellados?", label: "kilómetros de túneles tapados deliberadamente", eyebrow: "¿Quién los cerró?" } },
  { k: "dk", n: "01", name: "Derinkuyu", loc: "Capadocia, Turquía", age: "Hallada en 1963", img: "dk_city", imgq: "Derinkuyu underground city carved tunnels turkey", imgc: "the vast carved underground city of Derinkuyu descending deep", m: 85, unit: "m", scl: "de profundidad · 18 niveles · para 20.000 personas", stat: { value: 20000, suffix: " personas", label: "una ciudad entera 85 m bajo tierra", eyebrow: "Puertas que cierran desde adentro" } },
];
const introClips = SEC.intro.length ? SEC.intro : CUES.slice(0, 12).map((c) => c.name);
const headTitle = startOf("intro_tuneles");
fill(0, headTitle, introClips, "cold");
C(headTitle, 6.0, { kind: "headline", tokens: tk([["7", "hl"], "túneles", "antiguos", "que", "la", "ciencia", "no", "puede", ["explicar", "hl"]]), bg: "image", image: spImg("tun_hero", "ancient carved tunnel dark torch dramatic", "a dramatic dark hand-carved ancient tunnel"), hue: "amber", size: 86 });
const introEnd = startOf("hs_intro");
fill(headTitle + 6.0, introEnd, introClips, "cold");
for (let di = 0; di < DATA.length; di++) {
  const d = DATA[di];
  const pool = SEC[d.k].length ? SEC[d.k] : introClips;
  const secStart = startOf(d.k + "_intro");
  const next = di + 1 < DATA.length ? startOf(DATA[di + 1].k + "_intro") : startOf("cl_agujeros");
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
const clStart = startOf("cl_agujeros");
const clPool = SEC.cl.length ? SEC.cl : introClips;
fill(clStart, startOf("cl_otravez"), clPool, "amber");
C(startOf("cl_otravez"), 8.5, { kind: "timeline", eyebrow: "El ser humano dejó de mirar al cielo", title: "Una y otra vez, cavó hacia abajo", events: [
  { year: "12.000 a.C.", label: "Red europea" }, { year: "3.000 a.C.", label: "Hal Saflieni" }, { year: "¿?", label: "Longyou" }, { year: "Romano", label: "Inframundo" }, { year: "1963", label: "Derinkuyu" },
] });
fill(startOf("cl_otravez") + 8.5, startOf("cl_proximo"), clPool, "amber");
C(startOf("cl_proximo"), 6.0, { kind: "headline", tokens: tk(["¿Qué", "hay", "tras", "las", "puertas", "que", "nadie", ["abrió?", "hl"]]), bg: "image", image: spImg("tun_door", "ancient sealed stone door mysterious", "a mysterious sealed ancient stone door"), hue: "red", size: 82 });
fill(startOf("cl_proximo") + 6.0, END, clPool, "amber");
B.sort((x, y) => x.start - y.start);
fs.writeFileSync("beatsheet/tuneles.json", JSON.stringify({ video: "tuneles", beats: B }, null, 1));
fs.writeFileSync("public/real/bing_tuneles.json", JSON.stringify(I, null, 1));
const raws = B.filter((b) => b.kind === "raw").length, comps = B.filter((b) => b.kind !== "raw" && !b.overlay).length, ovs = B.filter((b) => b.overlay).length;
console.log(`beats: ${B.length} · clips: ${raws} · comp: ${comps} · ov: ${ovs} · imgs: ${I.length} · dur ${(END / 60).toFixed(1)}min`);
