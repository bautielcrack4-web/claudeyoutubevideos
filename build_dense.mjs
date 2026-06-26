// build_dense.mjs — build SIN REUSO (estilo barcos): coloca los clips densos (1 por mini-frase,
// de <slug>_cues.json) uno por corte, e inserta los COMPONENTES (rule/scalecolossus/stat/headline/
// timeline + overlays) en sus momentos, recortando los clips que pisan. Las secciones se ubican
// anclando frases en el timing. Config por video en build_<slug>_cfg.mjs (DATA, anchors, headline...).
//   node build_dense.mjs <slug>
import fs from "fs";
const slug = process.argv[2];
if (!slug) { console.error("Uso: node build_dense.mjs <slug>"); process.exit(1); }
const cfg = (await import(`./build_${slug}_cfg.mjs`)).default;
const TM = JSON.parse(fs.readFileSync(`public/${slug}_timing.json`, "utf8"));
const CUES = JSON.parse(fs.readFileSync(`src/VideoEdit/${slug}_cues.json`, "utf8"));
const END = TM[TM.length - 1].start + 6;

// ── anclar frase en el timing (igual que gen) ──
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
let full = ""; const pos2t = [];
for (let i = 0; i < TM.length; i++) { const seg = norm(TM[i].text) + " "; if (seg.length <= 1) continue; const t0 = TM[i].start, t1 = i + 1 < TM.length ? TM[i + 1].start : t0 + seg.length / 14; for (let k = 0; k < seg.length; k++) pos2t.push(t0 + (t1 - t0) * (k / seg.length)); full += seg; }
let _cur = 0;
const at = (first) => { const q = norm(first); const idx = full.indexOf(q, _cur); if (idx < 0) return null; _cur = idx + q.length; return +pos2t[idx].toFixed(2); };

const B = [], I = []; let _n = 0;
const nid = (p) => p + String(++_n).padStart(3, "0");
const seenI = new Set();
const spImg = (name, query, concept) => { if (!seenI.has(name)) { seenI.add(name); I.push({ name, query: Array.isArray(query) ? query : [query], concept }); } return "real/" + name + ".jpg"; };
const C = (start, dur, o) => B.push({ id: nid(o.kind), start: +start.toFixed(2), dur: +dur.toFixed(2), ...o });
const ov = (start, dur, o) => B.push({ id: nid("o"), start: +start.toFixed(2), dur: +dur.toFixed(2), overlay: true, ...o });
const tk = (arr) => arr.map((x) => (Array.isArray(x) ? { t: x[0], [x[1]]: true } : { t: x }));

// ── tiempos de sección (anclados en orden) ──
const headT = at(cfg.headlineAt);
const secT = cfg.DATA.map((d) => at(d.at));
const clT = at(cfg.cierreAt), tlT = at(cfg.timelineAt), proxT = at(cfg.proximoAt);

// ── COMPONENTES (cues full-screen) + sus intervalos bloqueados ──
const comps = [];
const hue4 = (t) => { let h = "cold"; for (let i = 0; i < secT.length; i++) if (secT[i] != null && t >= secT[i]) h = cfg.DATA[i].hue; if (clT != null && t >= clT) h = "amber"; return h; };
// headline
comps.push({ start: headT, dur: 6.0, kind: "headline", tokens: tk(cfg.headline.tokens), bg: "image", image: spImg(cfg.headline.img, cfg.headline.q, cfg.headline.q), hue: cfg.headline.hue, size: cfg.headline.size || 84 });
// por sección: rule + scalecolossus + stat
for (let di = 0; di < cfg.DATA.length; di++) {
  const d = cfg.DATA[di], s = secT[di]; if (s == null) continue;
  const next = di + 1 < cfg.DATA.length ? secT[di + 1] : clT;
  comps.push({ start: s, dur: 4.2, kind: "rule", number: d.n, title: d.name, label: d.loc, hue: d.hue });
  ov(s + 4.2, 6.0, { kind: "doclabel", label: d.name, sub: d.loc, accent: d.hue });
  ov(s + 4.2, (next || s + 30) - s - 4.4, { kind: "countrail", total: 7, rank: +d.n, name: d.name, accent: d.hue });
  const third = s + (next - s) / 3, twoThird = s + 2 * (next - s) / 3;
  comps.push({ start: third, dur: 6.0, kind: "scalecolossus", image: spImg(d.img, d.imgq, d.imgc), meters: d.m, unit: d.unit, eyebrow: d.name, label: d.scl, accent: d.hue });
  ov(third + 0.2, 5.0, { kind: "datestamp", value: d.age, label: d.name, accent: d.hue });
  comps.push({ start: twoThird, dur: 5.2, kind: "stat", ...d.stat, accent: di < 4 ? "accent" : "danger", hue: d.hue });
}
// cierre: timeline + teaser headline
if (tlT != null) comps.push({ start: tlT, dur: 8.5, kind: "timeline", eyebrow: cfg.timeline.eyebrow, title: cfg.timeline.title, events: cfg.timeline.events });
if (proxT != null) comps.push({ start: proxT, dur: 6.0, kind: "headline", tokens: tk(cfg.teaser.tokens), bg: "image", image: spImg(cfg.teaser.img, cfg.teaser.q, cfg.teaser.q), hue: cfg.teaser.hue, size: cfg.teaser.size || 84 });
comps.sort((a, b) => a.start - b.start);
// ── DISEÑO DE SONIDO documental: riser+boom en cada apertura de sección/headline, boom en cada número ──
const sfx = [];
for (const c of comps) {
  if (c.kind === "rule" || c.kind === "headline") { sfx.push({ t: +(c.start - 1.2).toFixed(2), src: "sfx/cp_riser.wav", g: 0.5 }); sfx.push({ t: +c.start.toFixed(2), src: "sfx/cp_boom.wav", g: 0.55 }); }
  else if (c.kind === "stat") sfx.push({ t: +c.start.toFixed(2), src: "sfx/cp_boom.wav", g: 0.4 });
  else if (c.kind === "scalecolossus" || c.kind === "timeline") sfx.push({ t: +(c.start - 0.4).toFixed(2), src: "sfx/cp_whoosh.wav", g: 0.45 });
}
sfx.sort((a, b) => a.t - b.t);
fs.writeFileSync(`src/VideoEdit/sfx_${slug}.json`, JSON.stringify(sfx, null, 1));
const blocked = comps.map((c) => [c.start, c.start + c.dur]);
const inBlocked = (a, b) => blocked.some(([s, e]) => a < e && b > s);
const trimToFree = (a, b) => { for (const [s, e] of blocked) { if (a < e && b > s) { if (a < s) b = Math.min(b, s); else return null; } } return b > a + 0.3 ? [a, b] : null; };

// ── CLIPS DENSOS (1 por cue, SIN reuso). Cada clip disponible se extiende hasta el SIGUIENTE
//    disponible → rellena huecos (frases sin visual) sin repetir ni dejar negros. Recorta componentes. ──
const hasClip = (n) => fs.existsSync("public/broll/" + n + ".mp4");
const avail = CUES.filter((c) => hasClip(c.name)).sort((a, b) => a.start - b.start);
const missing = CUES.length - avail.length;
let placed = 0, segs = 0;
for (let i = 0; i < avail.length; i++) {
  const c = avail[i];
  const spanEnd = i + 1 < avail.length ? avail[i + 1].start : END;
  // emitir el clip en los sub-intervalos de [c.start, spanEnd] que NO pisan componentes
  let a = c.start;
  for (const [bs, be] of [...blocked, [END + 1, END + 2]].sort((x, y) => x[0] - y[0])) {
    if (be <= a || bs >= spanEnd) continue;
    if (bs > a) { B.push({ id: nid("c"), start: +a.toFixed(2), dur: +(Math.min(bs, spanEnd) - a).toFixed(2), kind: "raw", src: "broll/" + c.name + ".mp4", hue: hue4(c.start) }); segs++; }
    a = Math.max(a, be);
    if (a >= spanEnd) break;
  }
  if (a < spanEnd) { B.push({ id: nid("c"), start: +a.toFixed(2), dur: +(spanEnd - a).toFixed(2), kind: "raw", src: "broll/" + c.name + ".mp4", hue: hue4(c.start) }); segs++; }
  placed++;
}
for (const c of comps) C(c.start, c.dur, c);

B.sort((x, y) => x.start - y.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${slug}.json`, JSON.stringify({ video: slug, beats: B }, null, 1));
fs.writeFileSync(`public/real/bing_${slug}.json`, JSON.stringify(I, null, 1));
const raws = B.filter((b) => b.kind === "raw").length;
console.log(`beats: ${B.length} · clips REALES únicos: ${placed} (${missing} ventanas sin clip → absorbidas, 0 negros) · segmentos: ${segs} · comp: ${comps.length} · dur ${(END / 60).toFixed(1)}min`);
