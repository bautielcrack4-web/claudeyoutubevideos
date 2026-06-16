// beatsheet.mjs — UNA sola fuente de verdad por video (nicho doc-broll).
//
// El problema que resuelve: hoy el prompts.json (qué imágenes generar) y los cues
// (cómo se cablean en Main) se escriben por separado → se desincronizan, hay que
// tipear cada nombre dos veces y wirear 150 cues a mano. Eso es de donde sale el
// caos y el gasto de tokens. Acá un único beatsheet/<video>.json describe CADA beat
// (timing + componente + props + el prompt para generar su asset), y este script
// DERIVA automáticamente:
//   1) public/img/prompts_<video>.json   (imágenes + láminas/diagramas a generar)
//   2) public/vid/clips_<video>.json     (clips img2video a generar)
//   3) src/VideoEdit/cues_<video>.gen.tsx (export CUES + REFRAME, listo para importar)
//
// Flujo optimizado (1 pasada):
//   node beatsheet.mjs beatsheet/termitas.json
//   node gen_deapi.mjs public/img/prompts_termitas.json    # genera TODO el lote
//   node gen_video.mjs public/vid/clips_termitas.json      # genera TODOS los clips
//   # en Main_<video>.tsx:  import { CUES, REFRAME } from "./cues_<video>.gen";
//   TMP=C:\rtmp TEMP=C:\rtmp npx remotion render <Comp> out/x.mp4 --concurrency=16
//
// ── Esquema beatsheet/<video>.json ───────────────────────────────────────────
// {
//   "video": "termitas",
//   "avatar": "termitas_opt.mp4",
//   "beats": [
//     // foto/clip crudo full-bleed (RawShot). gen.type "image" o "clip".
//     { "id":"m01","start":0.4,"dur":3.2,"kind":"raw","src":"vid/caja_polvo.mp4",
//       "hue":"amber","kicker":"El polvo de la caja",
//       "gen":{"type":"clip","image":"caja_polvo","prompt":"...","frames":90} },
//     { "id":"m03","start":6.0,"dur":2.4,"kind":"raw","src":"img/ferreteria.png",
//       "hue":"amber","kicker":"~1000 pesos",
//       "gen":{"type":"image","name":"ferreteria","prompt":"Realistic handheld..."} },
//
//     // ★ DIAGRAM BOARD (AvatarPresentation) — el mejor componente, usalo MUCHO.
//     // avatar chico arriba-derecha + láminas gpt-image-2 grandes que explican.
//     { "id":"d1","start":120,"dur":9,"kind":"diagram","eyebrow":"Cómo actúa el bórax",
//       "hue":"amber","accent":"accent",
//       "slides":[
//         {"image":"img/diag_borax_1.png","title":"La obrera come madera",
//          "gen":{"type":"image","name":"diag_borax_1","prompt":"clean explanatory diagram, flat vector, labels in Spanish, ..."}},
//         {"image":"img/diag_borax_2.png","title":"Lleva el bórax al nido",
//          "gen":{"type":"image","name":"diag_borax_2","prompt":"clean explanatory diagram ..."}}
//       ] },
//
//     // cita cinética sobre imagen (KineticQuote). *palabra* = resaltada.
//     { "id":"q1","start":47,"dur":3,"kind":"quote","image":"img/borax.png",
//       "eyebrow":"Lo que tengo en la caja","text":"No es un *veneno*",
//       "accent":"danger","hue":"cold","fontSize":104 },
//
//     // chips sobre imagen (ChipsCluster)
//     { "id":"c1","start":69,"dur":3,"kind":"chips","bg":"image","image":"img/termita.png",
//       "title":"Mata una sola cosa","chips":["lo que MUERDE","la madera"],"hue":"red" },
//
//     // lista lado-a-lado (SplitList). palette = token de color: A|G|D|B.
//     { "id":"s1","start":135,"dur":3.5,"kind":"splitlist","title":"Te venden la madera así",
//       "items":["Sin tratar","Sin protección","Lista para que la coman"],"palette":"D","cross":true },
//
//     // split avatar+contenido: agregá "reframe": true a CUALQUIER beat con
//     // componente que viva en la mitad libre → genera la ventana REFRAME (avatar
//     // se achica a la derecha). (raw es full-bleed: NO le pongas reframe.)
//     { "id":"sp1","start":200,"dur":8,"kind":"splitlist","reframe":true, "...":"..." },
//
//     // avatar hablando a pantalla completa: no emite cue (es documentación).
//     { "id":"talk1","start":80,"dur":10,"kind":"talk" }
//   ]
// }
import fs from "fs";
import path from "path";

const bsArg = process.argv[2];
if (!bsArg) {
  console.error("Uso: node beatsheet.mjs beatsheet/<video>.json");
  process.exit(1);
}
if (!fs.existsSync(bsArg)) {
  console.error("No existe el beatsheet:", bsArg);
  process.exit(1);
}
const bs = JSON.parse(fs.readFileSync(bsArg, "utf8"));
const VIDEO = bs.video || path.basename(bsArg).replace(/\.json$/, "");
const AVATAR = bs.avatar || "avatar.mp4";
const beats = bs.beats || [];

// ── 1+2) extraer assets a generar (dedup por nombre) ─────────────────────────
const images = new Map(); // name -> {name,prompt,width?,height?}
const clips = new Map(); // name -> {name,image,prompt,frames?}
const addImage = (g) => {
  if (!g || g.type !== "image" || !g.name || images.has(g.name)) return;
  const o = { name: g.name, prompt: g.prompt };
  if (g.width) o.width = g.width;
  if (g.height) o.height = g.height;
  images.set(g.name, o);
};
const addClip = (g) => {
  if (!g || g.type !== "clip" || !g.image || clips.has(g.image)) return;
  const o = { name: g.image, image: g.image, prompt: g.prompt };
  if (g.frames) o.frames = g.frames;
  clips.set(g.image, o);
};
for (const b of beats) {
  addImage(b.gen);
  addClip(b.gen);
  for (const s of b.slides || []) addImage(s.gen);
}

// ── validaciones suaves (avisos, no frenan) ──────────────────────────────────
const warnings = [];
// solapamiento de ventanas de cue
const cueBeats = beats.filter((b) => b.kind && b.kind !== "talk");
// floats son overlay INTENCIONAL sobre el avatar full → no cuentan como solape
const sorted = [...cueBeats].filter((b) => b.kind !== "float" && !b.overlay).sort((a, b) => a.start - b.start);
for (let i = 1; i < sorted.length; i++) {
  const prevEnd = sorted[i - 1].start + sorted[i - 1].dur;
  if (sorted[i].start < prevEnd - 1e-6) {
    warnings.push(
      `solapan: ${sorted[i - 1].id} (${sorted[i - 1].start}–${prevEnd.toFixed(1)}) y ${sorted[i].id} (desde ${sorted[i].start})`
    );
  }
}
// assets referenciados que no se generan ni existen en disco
const exists = (rel) => fs.existsSync(path.join("public", rel));
const refs = [];
for (const b of beats) {
  if (b.src) refs.push(b.src);
  if (b.image && b.kind !== "diagram") refs.push(b.image);
  for (const s of b.slides || []) if (s.image) refs.push(s.image);
  if (b.worldImage) refs.push(b.worldImage);
  for (const wp of b.waypoints || []) if (wp.image) refs.push(wp.image);
}
const willGen = new Set([
  ...[...images.keys()].map((n) => `img/${n}.png`),
  ...[...clips.keys()].map((n) => `vid/${n}.mp4`),
]);
for (const r of [...new Set(refs)]) {
  if (!willGen.has(r) && !exists(r)) warnings.push(`asset sin generar ni en disco: ${r}`);
}

// ── 3) emitir cues_<video>.gen.tsx ───────────────────────────────────────────
const j = (v) => JSON.stringify(v); // string/num/array/obj -> literal JS válido en JSX
const cleanSlides = (slides) =>
  (slides || []).map((s) => {
    const o = {};
    if (s.image) o.image = s.image;
    if (s.title) o.title = s.title;
    if (s.note) o.note = s.note;
    return o;
  });

function renderEl(b) {
  switch (b.kind) {
    case "raw":
      return (
        `<RawShot durationInFrames={d} src=${j(b.src)}` +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        (b.kicker ? ` kicker=${j(b.kicker)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.darken != null ? ` darken={${b.darken}}` : ``) +
        (b.blur != null ? ` blur={${b.blur}}` : ``) +
        (b.zoom != null ? ` zoom={${j(b.zoom)}}` : ``) +
        ` />`
      );
    case "diagram": {
      // DIAGRAMA ESTÁTICO (regla dura del nicho): DiagramBoard = lámina quieta +
      // avatar PiP esquina, hard-cut entre páginas, SIN zoom/Ken-Burns. Calmo y pro.
      const pages = (b.slides || []).map((s) => ({ image: s.image, eyebrow: s.title || s.eyebrow || b.eyebrow }));
      // clip CORTO del avatar (recortado a esta ventana por split_avatar_diagrams.mjs)
      // → DiagramBoard lo reproduce desde frame 0, sin deep-seek (no sale negro en el farm).
      return (
        `<DiagramBoard durationInFrames={d}` +
        ` clip=${j(`avatar_clips/${b.id}.mp4`)}` +
        ` pages={${j(pages)}} />`
      );
    }
    case "quote":
      return (
        `<KineticQuote durationInFrames={d}` +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        ` words={parseQuote(${j(b.text || "")})}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        (b.fontSize ? ` fontSize={${b.fontSize}}` : ``) +
        ` />`
      );
    case "chips":
      return (
        `<ChipsCluster durationInFrames={d}` +
        (b.bg ? ` bg=${j(b.bg)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        ` chips={${j(b.chips || [])}}` +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "splitlist": {
      const pal = { A: "A", G: "G", D: "D", B: "B" }[b.palette] || "A";
      return (
        `<SplitList durationInFrames={d}` +
        (b.title ? ` title=${j(b.title)}` : ``) +
        ` items={${j(b.items || [])}}` +
        ` accent={${pal}}` +
        (b.cross ? ` cross` : ``) +
        ` />`
      );
    }
    case "stat":
      return (
        `<StatBig durationInFrames={d} value={${b.value}}` +
        (b.prefix ? ` prefix=${j(b.prefix)}` : ``) +
        (b.suffix ? ` suffix=${j(b.suffix)}` : ``) +
        (b.decimals != null ? ` decimals={${b.decimals}}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "impact":
      return (
        `<ImpactReveal durationInFrames={d} image=${j(b.image)} impact=${j(b.impact)}` +
        (b.setup ? ` setup=${j(b.setup)}` : ``) +
        (b.impactAccent ? ` impactAccent=${j(b.impactAccent)}` : ``) +
        (b.hitAt != null ? ` hitAt={${b.hitAt}}` : ``) +
        (b.boom != null ? ` boom={${b.boom}}` : ``) +
        (b.darken != null ? ` darken={${b.darken}}` : ``) +
        ` />`
      );
    case "journey":
      return (
        `<JourneyCanvas durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.worldImage ? ` worldImage=${j(b.worldImage)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.dark ? ` dark` : ``) +
        ` waypoints={${j(b.waypoints || [])}} />`
      );
    case "float":
      return (
        `<FloatingInsert durationInFrames={d} src=${j(b.src)}` +
        (b.side ? ` side=${j(b.side)}` : ``) +
        (b.kicker ? ` kicker=${j(b.kicker)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "headline":
      return (
        `<KineticHeadline durationInFrames={d} tokens={${j(b.tokens || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        (b.size ? ` size={${b.size}}` : ``) +
        (b.bg ? ` bg=${j(b.bg)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        ` />`
      );
    case "aged":
      return (
        `<AgedDoc durationInFrames={d} heading=${j(b.heading || "")} lines={${j(b.lines || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "bars":
      return (
        `<BarCompare durationInFrames={d} bars={${j(b.bars || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.orientation ? ` orientation=${j(b.orientation)}` : ``) +
        (b.unit ? ` unit=${j(b.unit)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "cross":
      return (
        `<CrossSection durationInFrames={d} layers={${j(b.layers || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.marker !== undefined ? ` marker={${j(b.marker)}}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "process":
      return (
        `<ProcessSteps durationInFrames={d} steps={${j(b.steps || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "checklist":
      return (
        `<Checklist durationInFrames={d} title=${j(b.title || "")} items={${j(b.items || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        ` />`
      );
    case "rule":
      return (
        `<RuleNumberScene durationInFrames={d} number=${j(b.number || "01")} title=${j(b.title || "")}` +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "annotated":
      return (
        `<AnnotatedImage durationInFrames={d} image=${j(b.image)} annotations={${j(b.annotations || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.caption ? ` caption=${j(b.caption)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "callout":
      return (
        `<CalloutMark durationInFrames={d} figure=${j(b.figure || "")}` +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.caption ? ` caption=${j(b.caption)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "infzoom":
      return (
        `<InfiniteZoom durationInFrames={d} images={${j(b.images || [])}}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "teasecards":
      return (
        `<FoodTeaseCards durationInFrames={d} cards={${j(b.cards || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        ` />`
      );
    case "half":
      return (
        `<HalfShot durationInFrames={d} src=${j(b.src)}` +
        (b.side ? ` side=${j(b.side)}` : ``) +
        (b.kicker ? ` kicker=${j(b.kicker)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "top7":
      return (
        `<Top7Ladder durationInFrames={d} rank={${b.rank}}` +
        (b.total != null ? ` total={${b.total}}` : ``) +
        ` items={${j(b.items || [])}}` +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        ` />`
      );
    case "riskclock":
      return (
        `<RiskClock durationInFrames={d} steps={${j(b.steps || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "moat":
      return (
        `<TickLineMoat durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "sizescale":
      return (
        `<SizeScale durationInFrames={d} items={${j(b.items || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "loctag":
      return (
        `<LocationTag durationInFrames={d} mapImage=${j(b.mapImage)} pinX={${b.pinX}} pinY={${b.pinY}} place=${j(b.place)}` +
        (b.sub ? ` sub=${j(b.sub)}` : ``) +
        ` />`
      );
    case "chapter":
      return (
        `<ChapterTag durationInFrames={d} title=${j(b.title)}` +
        (b.num ? ` num=${j(b.num)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "nametag":
      return (
        `<NameTag durationInFrames={d} name=${j(b.name)}` +
        (b.sub ? ` sub=${j(b.sub)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "phrasetag":
      return (
        `<PhraseTag durationInFrames={d} text=${j(b.text)}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.pos ? ` pos=${j(b.pos)}` : ``) +
        ` />`
      );
    case "metertag":
      return (
        `<MeterTag durationInFrames={d} label=${j(b.label)}` +
        (b.fromPct != null ? ` fromPct={${b.fromPct}}` : ``) +
        (b.toPct != null ? ` toPct={${b.toPct}}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.corner ? ` corner=${j(b.corner)}` : ``) +
        ` />`
      );
    case "foundertree":
      return (
        `<FounderTree durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        ` />`
      );
    case "timeline":
      return (
        `<SagaTimeline durationInFrames={d} events={${j(b.events || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        ` />`
      );
    case "stattag":
      return (
        `<StatTag durationInFrames={d}` +
        (b.value != null ? ` value={${b.value}}` : ``) +
        (b.text ? ` text=${j(b.text)}` : ``) +
        (b.prefix ? ` prefix=${j(b.prefix)}` : ``) +
        (b.suffix ? ` suffix=${j(b.suffix)}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.corner ? ` corner=${j(b.corner)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "spreadmap":
      return (
        `<SpreadMap durationInFrames={d} mapImage=${j(b.mapImage)}` +
        (b.origin ? ` origin={${j(b.origin)}}` : ``) +
        (b.yearFrom != null ? ` yearFrom={${b.yearFrom}}` : ``) +
        (b.yearTo != null ? ` yearTo={${b.yearTo}}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "costtally":
      return (
        `<CostTally durationInFrames={d} left={${j(b.left)}} right={${j(b.right)}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "scent":
      return (
        `<ScentConfuse durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "depthtext":
      return (
        `<DepthText durationInFrames={d} back=${j(b.back)} fore=${j(b.fore)} title=${j(b.title || "")}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.fontSize ? ` fontSize={${b.fontSize}}` : ``) +
        ` />`
      );
    // ── componentes a medida del canal "Ben retirado" (look ALARMA) ──
    case "estateletter":
      return (
        `<EstateRecoveryLetter durationInFrames={d} amount=${j(b.amount)}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.hitAt != null ? ` hitAt={${b.hitAt}}` : ``) +
        ` />`
      );
    case "twomoments":
      return (
        `<TwoMomentsSplit durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.leftLabel ? ` leftLabel=${j(b.leftLabel)}` : ``) +
        (b.leftSub ? ` leftSub=${j(b.leftSub)}` : ``) +
        (b.rightLabel ? ` rightLabel=${j(b.rightLabel)}` : ``) +
        (b.rightSub ? ` rightSub=${j(b.rightSub)}` : ``) +
        ` />`
      );
    case "mistake":
      return (
        `<MistakeCard durationInFrames={d} number=${j(b.number)} title=${j(b.title)}` +
        (b.desc ? ` desc=${j(b.desc)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        ` />`
      );
    case "goldvault":
      return (
        `<GoldVault durationInFrames={d}` +
        (b.state ? ` state=${j(b.state)}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.caption ? ` caption=${j(b.caption)}` : ``) +
        ` />`
      );
    case "lookback":
      return (
        `<LookbackTimeline durationInFrames={d}` +
        (b.years != null ? ` years={${b.years}}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.flags ? ` flags={${j(b.flags)}}` : ``) +
        ` />`
      );
    case "tool":
      return (
        `<ProtectionTool durationInFrames={d} nameEs=${j(b.nameEs)} how=${j(b.how)}` +
        (b.number ? ` number=${j(b.number)}` : ``) +
        (b.nameEn ? ` nameEn=${j(b.nameEn)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        ` />`
      );
    case "deed":
      return (
        `<DeedStamp durationInFrames={d}` +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.stampText ? ` stampText=${j(b.stampText)}` : ``) +
        (b.caption ? ` caption=${j(b.caption)}` : ``) +
        (b.hitAt != null ? ` hitAt={${b.hitAt}}` : ``) +
        ` />`
      );
    case "odometer":
      return (
        `<CostOdometer durationInFrames={d} to={${b.to}}` +
        (b.prefix ? ` prefix=${j(b.prefix)}` : ``) +
        (b.suffix ? ` suffix=${j(b.suffix)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.repeat ? ` repeat=${j(b.repeat)}` : ``) +
        ` />`
      );
    case "signature":
      return (
        `<SignaturePhrase durationInFrames={d} lines={${j(b.lines || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        ` />`
      );
    case "vsmed":
      return (
        `<MedicareVsMedicaid durationInFrames={d} leftTitle=${j(b.leftTitle)} leftItems={${j(b.leftItems || [])}} rightTitle=${j(b.rightTitle)} rightItems={${j(b.rightItems || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        ` />`
      );
    case "action":
      return (
        `<ActionStepCard durationInFrames={d} step=${j(b.step)} question=${j(b.question)}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        ` />`
      );
    case "keyphrase":
      return (
        `<KeyPhrase durationInFrames={d} text=${j(b.text || "")}` +
        (b.src ? ` src=${j(b.src)}` : ``) +
        (b.blur === false ? ` blur={false}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.fontSize ? ` fontSize={${b.fontSize}}` : ``) +
        (b.position ? ` position=${j(b.position)}` : ``) +
        (b.times ? ` times={${j(b.times)}}` : ``) +
        ` />`
      );
    case "statpills":
      return (
        `<StatPills durationInFrames={d} pills={${j(b.pills || [])}}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.slider === false ? ` slider={false}` : ``) +
        ` />`
      );
    case "floatprop":
      return (
        `<FloatingProp durationInFrames={d} src=${j(b.src)}` +
        (b.bg ? ` bg=${j(b.bg)}` : ``) +
        (b.caption ? ` caption=${j(b.caption)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.scale != null ? ` scale={${b.scale}}` : ``) +
        ` />`
      );
    case "diorama":
      return (
        `<PngDiorama durationInFrames={d} src=${j(b.src)}` +
        (b.text ? ` text=${j(b.text)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.tint ? ` tint=${j(b.tint)}` : ``) +
        ` />`
      );
    case "nextvideo":
      return (
        `<NextVideoEndcard durationInFrames={d} title=${j(b.title)}` +
        (b.kicker ? ` kicker=${j(b.kicker)}` : ``) +
        (b.sub ? ` sub=${j(b.sub)}` : ``) +
        ` />`
      );
    default:
      return null; // talk
  }
}

const cueLines = [];
const overlayLines = [];
const reframe = [];
for (const b of beats) {
  if (b.reframe && b.kind !== "talk") reframe.push({ start: b.start, end: b.start + b.dur });
  const el = renderEl(b);
  if (!el) continue;
  const line = `  { key: ${j(b.id)}, start: ${b.start}, dur: ${b.dur}, kind: ${j(b.kind)}, el: (d) => ${el} },`;
  (b.overlay ? overlayLines : cueLines).push(line);
}

// imports + consts de paleta CONDICIONALES: solo lo que los kinds presentes usan
// (así no quedan unused-vars / unused-imports → tsc con noUnusedLocals limpio).
const kinds = new Set(cueBeats.map((b) => b.kind));
const usedPal = new Set();
for (const b of beats) {
  if (b.kind === "splitlist") usedPal.add({ A: "A", G: "G", D: "D", B: "B" }[b.palette] || "A");
}
const palTok = { A: "COLORS.accent", G: "COLORS.good", D: "COLORS.danger", B: "COLORS.cold" };
const themeImports = [];
if (usedPal.size) themeImports.push("COLORS");
const imports = [`import { ReactNode } from "react";`];
if (themeImports.length) imports.push(`import { ${themeImports.join(", ")} } from "./theme";`);
if (kinds.has("raw")) imports.push(`import { RawShot } from "./scenes/RawShot";`);
if (kinds.has("quote")) imports.push(`import { KineticQuote, parseQuote } from "./scenes/KineticQuote";`);
if (kinds.has("chips")) imports.push(`import { ChipsCluster } from "./scenes/ReframeContent";`);
if (kinds.has("splitlist")) imports.push(`import { SplitList } from "./scenes/SplitList";`);
if (kinds.has("diagram")) imports.push(`import { DiagramBoard } from "./scenes/DiagramBoard";`);
if (kinds.has("stat")) imports.push(`import { StatBig } from "./scenes/StatBig";`);
if (kinds.has("impact")) imports.push(`import { ImpactReveal } from "./scenes/ImpactReveal";`);
if (kinds.has("journey")) imports.push(`import { JourneyCanvas } from "./scenes/JourneyCanvas";`);
if (kinds.has("loctag")) imports.push(`import { LocationTag } from "./scenes/LocationTag";`);
if (kinds.has("stattag")) imports.push(`import { StatTag } from "./scenes/StatTag";`);
if (kinds.has("chapter")) imports.push(`import { ChapterTag } from "./scenes/ChapterTag";`);
if (kinds.has("nametag")) imports.push(`import { NameTag } from "./scenes/NameTag";`);
if (kinds.has("phrasetag")) imports.push(`import { PhraseTag } from "./scenes/PhraseTag";`);
if (kinds.has("timeline")) imports.push(`import { SagaTimeline } from "./scenes/SagaTimeline";`);
if (kinds.has("metertag")) imports.push(`import { MeterTag } from "./scenes/MeterTag";`);
if (kinds.has("foundertree")) imports.push(`import { FounderTree } from "./scenes/FounderTree";`);
if (kinds.has("float")) imports.push(`import { FloatingInsert } from "./scenes/FloatingInsert";`);
if (kinds.has("headline")) imports.push(`import { KineticHeadline } from "./scenes/KineticHeadline";`);
if (kinds.has("aged")) imports.push(`import { AgedDoc } from "./scenes/AgedDoc";`);
if (kinds.has("bars")) imports.push(`import { BarCompare } from "./scenes/BarCompare";`);
if (kinds.has("cross")) imports.push(`import { CrossSection } from "./scenes/CrossSection";`);
if (kinds.has("process")) imports.push(`import { ProcessSteps } from "./scenes/ProcessSteps";`);
if (kinds.has("checklist")) imports.push(`import { Checklist } from "./scenes/Checklist";`);
if (kinds.has("rule")) imports.push(`import { RuleNumberScene } from "./scenes/RuleNumberScene";`);
if (kinds.has("annotated")) imports.push(`import { AnnotatedImage } from "./scenes/AnnotatedImage";`);
if (kinds.has("callout")) imports.push(`import { CalloutMark } from "./scenes/CalloutMark";`);
if (kinds.has("infzoom")) imports.push(`import { InfiniteZoom } from "./scenes/InfiniteZoom";`);
if (kinds.has("teasecards")) imports.push(`import { FoodTeaseCards } from "./scenes/FoodTeaseCards";`);
if (kinds.has("top7")) imports.push(`import { Top7Ladder } from "./scenes/Top7Ladder";`);
if (kinds.has("half")) imports.push(`import { HalfShot } from "./scenes/HalfShot";`);
if (kinds.has("riskclock")) imports.push(`import { RiskClock } from "./scenes/RiskClock";`);
if (kinds.has("moat")) imports.push(`import { TickLineMoat } from "./scenes/TickLineMoat";`);
if (kinds.has("sizescale")) imports.push(`import { SizeScale } from "./scenes/SizeScale";`);
if (kinds.has("spreadmap")) imports.push(`import { SpreadMap } from "./scenes/SpreadMap";`);
if (kinds.has("costtally")) imports.push(`import { CostTally } from "./scenes/CostTally";`);
if (kinds.has("scent")) imports.push(`import { ScentConfuse } from "./scenes/ScentConfuse";`);
if (kinds.has("depthtext")) imports.push(`import { DepthText } from "./scenes/DepthText";`);
// ── kinds a medida del canal "Ben retirado" ──
if (kinds.has("estateletter")) imports.push(`import { EstateRecoveryLetter } from "./scenes/EstateRecoveryLetter";`);
if (kinds.has("twomoments")) imports.push(`import { TwoMomentsSplit } from "./scenes/TwoMomentsSplit";`);
if (kinds.has("mistake")) imports.push(`import { MistakeCard } from "./scenes/MistakeCard";`);
if (kinds.has("goldvault")) imports.push(`import { GoldVault } from "./scenes/GoldVault";`);
if (kinds.has("lookback")) imports.push(`import { LookbackTimeline } from "./scenes/LookbackTimeline";`);
if (kinds.has("tool")) imports.push(`import { ProtectionTool } from "./scenes/ProtectionTool";`);
if (kinds.has("deed")) imports.push(`import { DeedStamp } from "./scenes/DeedStamp";`);
if (kinds.has("odometer")) imports.push(`import { CostOdometer } from "./scenes/CostOdometer";`);
if (kinds.has("signature")) imports.push(`import { SignaturePhrase } from "./scenes/SignaturePhrase";`);
if (kinds.has("vsmed")) imports.push(`import { MedicareVsMedicaid } from "./scenes/MedicareVsMedicaid";`);
if (kinds.has("action")) imports.push(`import { ActionStepCard } from "./scenes/ActionStepCard";`);
if (kinds.has("nextvideo")) imports.push(`import { NextVideoEndcard } from "./scenes/NextVideoEndcard";`);
if (kinds.has("keyphrase")) imports.push(`import { KeyPhrase } from "./scenes/KeyPhrase";`);
if (kinds.has("statpills")) imports.push(`import { StatPills } from "./scenes/StatPills";`);
if (kinds.has("floatprop")) imports.push(`import { FloatingProp } from "./scenes/FloatingProp";`);
if (kinds.has("diorama")) imports.push(`import { PngDiorama } from "./scenes/PngDiorama";`);
const palLine = usedPal.size
  ? `\nconst ${[...usedPal].map((t) => `${t} = ${palTok[t]}`).join(", ")};\n`
  : "";

const header = `// cues_${VIDEO}.gen.tsx — GENERADO por beatsheet.mjs desde ${path.basename(bsArg)}.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs ${bsArg}
${imports.join("\n")}
${palLine}
export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
${cueLines.join("\n")}
];

export const REFRAME: { start: number; end: number }[] = ${j(reframe)};

export const OVERLAYS: Cue[] = [
${overlayLines.join("\n")}
];
`;

const outTsx = path.join("src", "VideoEdit", `cues_${VIDEO}.gen.tsx`);
fs.writeFileSync(outTsx, header);

const imgList = [...images.values()];
const clipList = [...clips.values()];
const promptsPath = path.join("public", "img", `prompts_${VIDEO}.json`);
const clipsPath = path.join("public", "vid", `clips_${VIDEO}.json`);
fs.writeFileSync(promptsPath, JSON.stringify(imgList, null, 2));
fs.writeFileSync(clipsPath, JSON.stringify(clipList, null, 2));

// ── resumen ──────────────────────────────────────────────────────────────────
console.log(`=== beatsheet ${VIDEO} ===`);
console.log(`beats: ${beats.length}  ·  cues: ${cueLines.length}  ·  reframe: ${reframe.length}`);
console.log(`imágenes a generar: ${imgList.length}  ·  clips: ${clipList.length}`);
console.log(`→ ${outTsx}`);
console.log(`→ ${promptsPath}`);
console.log(`→ ${clipsPath}`);
if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} avisos:`);
  for (const w of warnings) console.log(`  · ${w}`);
} else {
  console.log(`sin avisos (timing sin solapes, assets consistentes).`);
}
