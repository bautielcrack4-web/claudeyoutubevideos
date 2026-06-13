// gen_domingos.mjs — beatsheet/domingos.json (Video 3). Motor igual a gen_postres.
import fs from "fs";
const PHOTOS = new Set(["do_buzon", "do_vajilla", "do_fotos_viejas"]);
const srcOf = (name) => {
  if (name.startsWith("do_ai_")) return `img/${name}.png`;
  if (PHOTOS.has(name)) return `broll/${name}.jpg`;
  return `broll/${name}.mp4`;
};
const HUES = ["amber", "red", "blue"];
const r = (name, o = {}) => ({ t: "raw", name, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
let fSide = 0;
const f = (name, o = {}) => ({ t: "float", src: srcOf(name), side: (fSide++ % 2 ? "left" : "right"), ...o });
const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.05, stat: 1.0, aged: 1.2, checklist: 1.2, splitlist: 1.1, bars: 1.25, process: 1.45, journey: 2.4, infzoom: 1.3, annotated: 1.3, callout: 1.0, chips: 1.0, teasecards: 1.0 };
const STARTS = JSON.parse(fs.readFileSync("beatsheet/_domingos_starts.json", "utf8"));
const S = (k) => STARTS[k];

const SECTIONS = [
  { key: "intro", start: S("intro"), beats: [
    c("teasecards", { w: 1.1, eyebrow: "El día más lindo de la semana", title: "¿Te acordás del domingo de antes?", cards: [
      { src: srcOf("do_sobremesa"), label: "La sobremesa" }, { src: srcOf("do_almuerzo"), label: "El almuerzo" },
      { src: srcOf("do_mate_ronda"), label: "El mate en ronda" }, { src: srcOf("do_cartas_jugar"), label: "Las cartas" },
      { src: srcOf("do_plaza_paseo"), label: "El paseo" }, { src: srcOf("do_baile"), label: "El baile" },
    ]}),
    r("do_familia_70s", { kicker: "El domingo de antes", w: 0.5 }), f("do_mesa_charla", { w: 0.45 }),
    r("do_abuela_nietos", { w: 0.5 }),
    c("quote", { image: srcOf("do_ai_almuerzo70s"), text: "Un domingo entero, sagrado, que era para la *familia*.", w: 0.8 }),
    c("stat", { value: 15, suffix: " costumbres", label: "que ya nadie respeta", eyebrow: "Hoy te cuento" }),
    f("do_ai_almuerzo70s"),
    c("headline", { tokens: ["Casi", "ninguna", "costaba", { t: "plata" }], eyebrow: "Costaban tiempo y ganas", bg: "image", image: srcOf("do_mesa_larga") }),
    r("do_mesa_larga", { hold: true }),
  ]},
  { key: "s01_sobremesa", start: S("s01_sobremesa"), beats: [
    c("rule", { number: "01", title: "La sobremesa" }),
    r("do_sobremesa", { hold: true }), f("do_ai_abuela_cuenta"), r("do_mesa_charla"),
    c("callout", { image: srcOf("do_sobremesa"), figure: "«Horas»", caption: "Nadie se movía de la mesa. Ahí se contaba el mundo." }),
    c("splitlist", { title: "Ahí se transmitía todo", items: ["Quiénes éramos", "Las historias viejas", "Los chistes de la familia"], palette: "A" }),
    c("quote", { image: srcOf("do_sobremesa"), text: "Las mejores conversaciones de nuestra vida, perdidas en el *apuro*." }),
  ]},
  { key: "s02_misa", start: S("s02_misa"), beats: [
    c("rule", { number: "02", title: "La misa de los domingos" }),
    r("do_iglesia_pueblo"), r("do_iglesia", { hold: true, kicker: "Todo el pueblo se encontraba" }),
    c("quote", { image: srcOf("do_iglesia"), text: "Mirarse a la cara era lo que hacía que un pueblo fuera un *pueblo*." }),
  ]},
  { key: "s03_almuerzo", start: S("s03_almuerzo"), beats: [
    c("rule", { number: "03", title: "El almuerzo de los domingos" }),
    r("do_almuerzo", { hold: true }), f("do_mesa_larga"), r("do_ai_almuerzo70s", { kicker: "Tres generaciones" }),
    c("checklist", { title: "El almuerzo del domingo", items: ["Venían abuelos, tíos, primos", "La mesa con tablas", "Sillas prestadas", "Todos codo con codo"] }),
    c("aged", { heading: "No era una comida, era un acontecimiento", lines: ["La mesa se estiraba con tablas.", "Sillas prestadas de los vecinos."], image: srcOf("do_almuerzo") }),
  ]},
  { key: "s04_siesta", start: S("s04_siesta"), beats: [
    c("rule", { number: "04", title: "La siesta" }),
    r("do_siesta_calle", { hold: true, kicker: "El pueblo entero dormía" }), r("do_siesta_persona"),
    c("quote", { image: srcOf("do_siesta_calle"), text: "Aprendíamos a no hacer nada, y que estuviera *bien*." }),
  ]},
  { key: "s05_visitar", start: S("s05_visitar"), beats: [
    c("rule", { number: "05", title: "Visitar sin avisar" }),
    r("do_puerta_tocar"), r("do_recibir", { hold: true, kicker: "Caer de sorpresa era alegría" }),
    c("quote", { image: srcOf("do_recibir"), text: "Aparecer en la puerta de alguien solo porque tenías ganas de *verlo*." }),
  ]},
  { key: "s06_juegos", start: S("s06_juegos"), beats: [
    c("rule", { number: "06", title: "Los juegos de mesa y las cartas" }),
    r("do_cartas_jugar", { hold: true }), f("do_dados"), r("do_ai_cartas_familia"),
    c("quote", { image: srcOf("do_cartas_jugar"), text: "Tenemos mil juegos en el bolsillo y jugamos más *solos* que nunca." }),
  ]},
  { key: "s07_radiotv", start: S("s07_radiotv"), beats: [
    c("rule", { number: "07", title: "La radio y la televisión en familia" }),
    r("do_radio_vieja"), r("do_tv_vintage", { hold: true }), f("do_ai_tv_familia"),
    c("bars", { title: "Pantallas en la casa", unit: "", bars: [{ label: "Antes", value: 1 }, { label: "Hoy", value: 8 }] }),
    c("quote", { image: srcOf("do_ai_tv_familia"), text: "Mirar algo hombro con hombro, y comentarlo en el *momento*." }),
  ]},
  { key: "s08_ropa", start: S("s08_ropa"), beats: [
    c("rule", { number: "08", title: "La ropa de domingo" }),
    r("do_ropa_domingo", { hold: true }), f("do_zapatos_lustrar"),
    c("quote", { image: srcOf("do_ropa_domingo"), text: "El domingo era una pequeña *fiesta* semanal. Y dejamos de festejarlo." }),
  ]},
  { key: "s09_telefono", start: S("s09_telefono"), beats: [
    c("rule", { number: "09", title: "El teléfono y las cartas" }),
    r("do_telefono_viejo"), r("do_carta_escribir", { hold: true, kicker: "Escrita a mano" }), r("do_buzon"),
    c("bars", { title: "Mensajes por día", unit: "", bars: [{ label: "Antes", value: 1 }, { label: "Hoy", value: 100 }] }),
    c("quote", { image: srcOf("do_carta_escribir"), text: "Una carta tenía más amor que mil mensajes de *hoy*." }),
  ]},
  { key: "s10_chicos", start: S("s10_chicos"), beats: [
    c("rule", { number: "10", title: "Los chicos en la calle" }),
    r("do_chicos_calle", { hold: true }), f("do_rayuela"), r("do_pelota_calle"),
    c("splitlist", { title: "La calle llena de chicos era", items: ["Un barrio vivo", "Vecinos que se conocían", "Chicos que se arreglaban solos"], palette: "G" }),
    c("quote", { image: srcOf("do_chicos_calle"), text: "Hoy es un barrio de puertas *cerradas*." }),
  ]},
  { key: "s11_mantel", start: S("s11_mantel"), beats: [
    c("rule", { number: "11", title: "El mantel y la vajilla buena" }),
    r("do_mantel_poner", { hold: true }), r("do_vajilla", { kicker: "Guardada, esperando" }),
    c("annotated", { image: srcOf("do_mantel_poner"), caption: "Honrar el momento y a los que venían", annotations: [
      { x: 30, y: 40, label: "El mantel bordado" },
      { x: 70, y: 55, label: "La vajilla buena" },
    ]}),
    c("quote", { image: srcOf("do_mantel_poner"), text: "Tratar bien a los que queremos con la mesa puesta como *Dios manda*." }),
  ]},
  { key: "s12_mate", start: S("s12_mate"), beats: [
    c("rule", { number: "12", title: "El mate en familia" }),
    r("do_mate_ronda", { hold: true, kicker: "La ronda no se cortaba" }),
    c("quote", { image: srcOf("do_mate_ronda"), text: "Lo lindo del mate nunca fue el mate. Fueron las *personas* alrededor." }),
  ]},
  { key: "s13_merienda", start: S("s13_merienda"), beats: [
    c("rule", { number: "13", title: "La merienda compartida" }),
    r("do_mesa_charla", { hold: true }), f("do_abuela_nietos"),
    c("quote", { image: srcOf("do_mesa_charla"), text: "Lo que extraño no es la comida. Es la mesa *llena*." }),
  ]},
  { key: "s14_musica", start: S("s14_musica"), beats: [
    c("rule", { number: "14", title: "Cantar y tocar en familia" }),
    r("do_guitarra", { hold: true }), r("do_acordeon", { kicter: "Una guitarra desafinada", kicker: "Una guitarra desafinada" }),
    c("quote", { image: srcOf("do_guitarra"), text: "Cantábamos mal, pero con el *alma*. Y dejamos de cantar juntos." }),
  ]},
  { key: "s15_nada", start: S("s15_nada"), beats: [
    c("rule", { number: "15", title: "No hacer nada, y que estuviera bien" }),
    r("do_patio_sentado", { hold: true }), f("do_cielo_mirar"), r("do_ventana_tarde"),
    c("aged", { heading: "El descanso del alma", lines: ["El aburrimiento estaba permitido.", "La calma estaba permitida."], image: srcOf("do_patio_sentado") }),
    c("quote", { image: srcOf("do_ventana_tarde"), text: "Perdimos el descanso de verdad: simplemente *estar*, en paz." }),
  ]},
  { key: "extras", start: S("extras"), beats: [
    r("do_plaza_paseo", { kicker: "El paseo del domingo" }), f("do_plaza"),
    r("do_album_fotos", { hold: true, kicker: "Mirar fotos juntos" }), r("do_fotos_viejas"),
    r("do_cine_viejo", { kicker: "El club, el cine" }),
    r("do_baile_pareja", { hold: true }), f("do_baile"),
    c("splitlist", { title: "Lugares donde el pueblo se encontraba", items: ["La plaza", "El cine, el club", "El baile"], palette: "B" }),
  ]},
  { key: "cierre", start: S("cierre"), beats: [
    c("quote", { image: srcOf("do_ventana_tarde"), text: "No te cuento esto para que sientas nostalgia y *nada más*." }),
    r("do_reloj_pared", { hold: true }),
    c("journey", { eyebrow: "El domingo que viene", title: "Recuperá uno", waypoints: [
      { x: 0, y: 0, z: 0, image: srcOf("do_sobremesa"), label: "Quedate en la sobremesa", num: "1", dwell: 2.6, travel: 1.6 },
      { x: 1.2, y: -0.4, z: 0.3, image: srcOf("do_cartas_jugar"), label: "Sacá un mazo de cartas", num: "2", dwell: 2.6, travel: 1.6 },
      { x: 2.4, y: 0.3, z: -0.2, image: srcOf("do_mate_ronda"), label: "Mate en ronda", num: "3", dwell: 2.6, travel: 1.6 },
      { x: 3.6, y: -0.2, z: 0.2, image: srcOf("do_abuela_nietos"), label: "Con quien quieras", num: "4", dwell: 3.0, travel: 1.4 },
    ]}),
    c("aged", { heading: "Quedate en la cadena", lines: ["Ya te conté las meriendas y los postres.", "Pronto, la cocina de antes de los supermercados."] }),
    r("do_abuela_nietos", { hold: true }),
    c("quote", { image: srcOf("do_familia_70s"), text: "Regalale una tarde entera, sin apuro. Es lo más valioso que tenés para *dar*." }),
  ]},
];

const VIDEO_END = STARTS.__end;

// ── ANCLAJE POR FRASE (sync fino) ─────────────────────────────────────────────
// Cada beat de texto (quote / o con `at`) se clava al ms EXACTO en que la voz dice
// esa frase; las fotos se reparten proporcionalmente en los huecos entre anclas.
const CAPS = JSON.parse(fs.readFileSync("public/captions_domingos.json", "utf8"));
const CW = (CAPS.words || CAPS).map((x) => ({ t: x.text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = phrase.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 3) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  // anclas: el primer beat al inicio de sección; los beats de texto a su frase
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b);
    if (!ph) return null;
    const ms = findMs(ph, start + 0.5);
    return ms != null && ms > start + 1 && ms < end - 1.5 ? ms : null;
  });
  // monotónico: descartar anclas que no respeten ≥1.5s sobre la anterior
  let lastPin = start; // pin[0] = start, ya fijo
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.5) pin[i] = null; else lastPin = pin[i]; } }
  // repartir: entre cada par de anclas fijas, las fotos por peso
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i);
  fixed.push(n); // centinela = fin de sección
  const startT = new Array(n);
  for (let f = 0; f < fixed.length - 1; f++) {
    const a = fixed[f], b = fixed[f + 1];
    const ta = pin[a], tb = b === n ? end : pin[b];
    let sw = 0; for (let i = a; i < b; i++) sw += ws[i];
    let acc = ta;
    for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); }
  }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2);
    const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2);
    let dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`;
    const hue = b.hue || HUES[(si + i) % HUES.length];
    const beat = { id, start: +cursor.toFixed(2), dur };
    if (b.t === "raw") { beat.kind = "raw"; beat.src = srcOf(b.name); beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; }
    else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = +cursor.toFixed(2); beat.dur = dur;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (beat.kind === "infzoom" && Array.isArray(beat.images)) beat.images = beat.images.map((im) => (typeof im === "string" ? { src: im } : im));
      if (beat.kind === "annotated" && Array.isArray(beat.annotations)) beat.annotations = beat.annotations.map((a) => ({ kind: a.kind || "circle", ...a }));
      if (beat.kind === "journey") delete beat.accent;
      if (beat.kind !== "journey" && !beat.hue) beat.hue = hue;
    }
    beats.push(beat);
  });
}
fs.writeFileSync("beatsheet/domingos.json", JSON.stringify({ video: "domingos", beats }, null, 1));
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · dur: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s`);
