// gen_cocina.mjs — beatsheet/cocina.json (Video 4). Motor igual a gen_postres.
import fs from "fs";
const PHOTOS = new Set(["co_hielo_barra", "co_escabeche", "co_mandarinas"]);
const srcOf = (name) => {
  if (name.startsWith("co_ai_")) return `img/${name}.png`;
  if (PHOTOS.has(name)) return `broll/${name}.jpg`;
  return `broll/${name}.mp4`;
};
const HUES = ["amber", "red", "blue"];
const r = (name, o = {}) => ({ t: "raw", name, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
let fSide = 0;
const f = (name, o = {}) => ({ t: "float", src: srcOf(name), side: (fSide++ % 2 ? "left" : "right"), ...o });
const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.05, stat: 1.0, aged: 1.2, checklist: 1.2, splitlist: 1.1, bars: 1.25, process: 1.45, journey: 2.4, infzoom: 1.3, annotated: 1.3, callout: 1.0, chips: 1.0, teasecards: 1.0 };
const STARTS = JSON.parse(fs.readFileSync("beatsheet/_cocina_starts.json", "utf8"));
const S = (k) => STARTS[k];

const SECTIONS = [
  { key: "intro", start: S("intro"), beats: [
    c("teasecards", { w: 1.1, eyebrow: "Antes de los supermercados", title: "¿Te acordás de esta cocina?", cards: [
      { src: srcOf("co_huerta"), label: "La huerta" }, { src: srcOf("co_gallinero"), label: "El gallinero" },
      { src: srcOf("co_ai_almacen"), label: "El almacén" }, { src: srcOf("co_leche_botella"), label: "El lechero" },
      { src: srcOf("co_pan_amasar"), label: "El pan amasado" }, { src: srcOf("co_cocina_lena"), label: "La cocina a leña" },
    ]}),
    r("co_mercado_viejo", { kicker: "Cómo era la vida antes", w: 0.5 }), f("co_abuela_cocina", { w: 0.45 }),
    r("co_huerta", { w: 0.5 }),
    c("quote", { image: srcOf("co_ai_almacen"), text: "Teníamos mucho menos, pero en muchas cosas vivíamos *mejor*.", w: 0.8 }),
    c("stat", { value: 0, prefix: "", suffix: " plástico", label: "todo a granel, en tus frascos", eyebrow: "El almacén de antes" }),
    f("co_ai_almacen"),
    c("headline", { tokens: ["Menos", "cosas,", "más", { t: "sentido" }], eyebrow: "Todo está conectado", bg: "image", image: srcOf("co_huerta") }),
    r("co_abuela_cocina", { hold: true }),
  ]},
  { key: "s01_huerta", start: S("s01_huerta"), beats: [
    c("rule", { number: "01", title: "La huerta" }),
    r("co_huerta"), r("co_tomate_planta", { hold: true, kicker: "Tibio del sol" }), f("co_lechuga"), r("co_canasta_verdura"),
    c("annotated", { image: srcOf("co_tomate_planta"), caption: "Del fondo de la casa al plato", annotations: [
      { x: 55, y: 40, label: "Tomate de la planta" },
      { x: 30, y: 70, label: "Tibio del sol" },
    ]}),
    c("quote", { image: srcOf("co_tomate_planta"), text: "El tomate del súper es lindo pero no sabe a *nada*." }),
  ]},
  { key: "s02_gallinero", start: S("s02_gallinero"), beats: [
    c("rule", { number: "02", title: "El gallinero" }),
    r("co_gallinero"), r("co_huevos_juntar", { hold: true }), r("co_huevo_yema", { kicker: "Yema naranja, fuerte" }), f("co_ai_huerta_gallinas"),
    c("quote", { image: srcOf("co_huevo_yema"), text: "Comíamos sabiendo el *costo* de las cosas." }),
  ]},
  { key: "s03_almacen", start: S("s03_almacen"), beats: [
    c("rule", { number: "03", title: "El almacén de la esquina" }),
    r("co_ai_almacen", { hold: true }), f("co_balanza"), r("co_granel", { kicker: "Al peso, a granel" }),
    c("callout", { image: srcOf("co_ai_almacen"), figure: "«Fiado»", caption: "El almacenero te conocía y te anotaba en el cuaderno." }),
    c("splitlist", { title: "Lo que perdimos", items: ["El almacenero que te conocía", "El fiado a fin de mes", "Comprar sin envoltorios"], palette: "D", cross: true }),
    c("quote", { image: srcOf("co_ai_almacen"), text: "Cambiamos el trato humano por la góndola anónima y la *basura*." }),
  ]},
  { key: "s04_reparto", start: S("s04_reparto"), beats: [
    c("rule", { number: "04", title: "El lechero, el panadero, el verdulero" }),
    r("co_ai_lechero", { hold: true }), r("co_leche_botella", { kicker: "Vidrio que se devolvía" }), f("co_pan_reparto"), r("co_verduleria"),
    c("quote", { image: srcOf("co_leche_botella"), text: "La comida llegaba de la mano de un vecino, no de un camión *sin cara*." }),
  ]},
  { key: "s05_fiambrera", start: S("s05_fiambrera"), beats: [
    c("rule", { number: "05", title: "La fiambrera y la heladera de hielo" }),
    r("co_fiambrera", { hold: true }), r("co_hielo_barra"), f("co_ai_heladera_hielo"),
    c("bars", { title: "Comida que se desperdicia", unit: "", bars: [{ label: "Sin freezer", value: 1 }, { label: "Hoy", value: 9 }] }),
    c("quote", { image: srcOf("co_fiambrera"), text: "Vivíamos con lo justo, y no se tiraba *nada*." }),
  ]},
  { key: "s06_conservar", start: S("s06_conservar"), beats: [
    c("rule", { number: "06", title: "Conservar sin heladera" }),
    r("co_salar_carne"), r("co_embutidos", { hold: true }), r("co_escabeche", { kicker: "En vinagre, en escabeche" }), f("co_ai_despensa_frascos"),
    c("checklist", { title: "El arte de conservar", items: ["Frutas en almíbar", "Carne salada y al sol", "Embutidos caseros", "En grasa, en vinagre"] }),
    c("quote", { image: srcOf("co_despensa"), text: "Perdimos la independencia de alimentarnos sin depender de un *enchufe*." }),
  ]},
  { key: "s07_pan", start: S("s07_pan"), beats: [
    c("rule", { number: "07", title: "El pan amasado en casa" }),
    r("co_pan_amasar", { hold: true, kicker: "Harina, agua, sal y las manos" }), r("co_pan_horno"),
    c("process", { title: "Pan amasado en casa", steps: [
      { title: "Mezclar", image: srcOf("co_pan_amasar") },
      { title: "Levar", image: srcOf("co_despensa") },
      { title: "Al horno", image: srcOf("co_pan_horno") },
      { title: "El duro → budín", image: srcOf("co_sobras") },
    ]}),
    c("quote", { image: srcOf("co_pan_amasar"), text: "El pan de verdad dura un día. Con el duro hacíamos el *budín*." }),
  ]},
  { key: "s08_animal", start: S("s08_animal"), beats: [
    c("rule", { number: "08", title: "El animal, de la nariz a la cola" }),
    r("co_caldo", { hold: true, kicker: "Los huesos, caldo" }), f("co_embutidos"),
    c("splitlist", { title: "No se tiraba nada del animal", items: ["Huesos para el caldo", "Grasa para cocinar", "Achuras, morcilla"], palette: "A" }),
    c("quote", { image: srcOf("co_caldo"), text: "Comer se volvió algo sin *conciencia*." }),
  ]},
  { key: "s09_estacion", start: S("s09_estacion"), beats: [
    c("rule", { number: "09", title: "Las frutas y verduras de estación" }),
    r("co_verduras_temporada", { hold: true }), r("co_duraznos", { kicker: "Los duraznos en verano" }), r("co_mandarinas"),
    c("quote", { image: srcOf("co_duraznos"), text: "Cuando todo está siempre, nada es *especial*." }),
  ]},
  { key: "s10_notirar", start: S("s10_notirar"), beats: [
    c("rule", { number: "10", title: "No se tiraba nada" }),
    r("co_sobras"), r("co_croquetas", { hold: true, kicker: "Las sobras, croquetas" }),
    c("checklist", { title: "El arte de transformar", items: ["Pan duro → budín", "Puchero → croquetas", "Huesos → caldo", "Fruta pasada → dulce"] }),
    c("quote", { image: srcOf("co_sobras"), text: "Nosotros, que teníamos tan poco, valorábamos cada *miga*." }),
  ]},
  { key: "extras", start: S("extras"), beats: [
    r("co_cocina_lena", { hold: true, kicker: "El centro de la casa" }), f("co_olla_fuego"),
    r("co_leche_tambo", { kicker: "La leche del tambo" }), r("co_nata"),
    c("bars", { title: "Lo barato y lo sano", unit: "", bars: [{ label: "Antes: sano = barato", value: 10 }, { label: "Hoy: sano = caro", value: 3 }] }),
    c("quote", { image: srcOf("co_cocina_lena"), text: "El pobre comía sano porque lo sano era lo *barato*." }),
  ]},
  { key: "cierre", start: S("cierre"), beats: [
    c("headline", { tokens: ["Todo", "es", "la", "misma", { t: "historia" }], eyebrow: "¿Te das cuenta?", bg: "image", image: srcOf("co_huerta") }),
    r("co_supermercado", { kicker: "Lleno de todo y tan vacío" }),
    c("journey", { eyebrow: "Rescatá lo bueno", title: "Con tus propias manos", waypoints: [
      { x: 0, y: 0, z: 0, image: srcOf("co_tomate_planta"), label: "Plantá un tomate", num: "1", dwell: 2.6, travel: 1.6 },
      { x: 1.2, y: -0.4, z: 0.3, image: srcOf("co_pan_amasar"), label: "Amasá un pan", num: "2", dwell: 2.6, travel: 1.6 },
      { x: 2.4, y: 0.3, z: -0.2, image: srcOf("co_despensa"), label: "Hacé un dulce", num: "3", dwell: 2.6, travel: 1.6 },
      { x: 3.6, y: -0.2, z: 0.2, image: srcOf("co_abuela_cocina"), label: "Cociná para alguien", num: "4", dwell: 3.0, travel: 1.4 },
    ]}),
    c("aged", { heading: "Andá al principio de la cadena", lines: ["Las meriendas, los postres, los domingos.", "Es toda la misma historia."] }),
    r("co_abuela_cocina", { hold: true }),
    c("quote", { image: srcOf("co_huerta"), text: "Comé algo hecho en casa, por favor. Hacelo *por mí*." }),
  ]},
];

const VIDEO_END = STARTS.__end;

// ── ANCLAJE POR FRASE (sync fino) ─────────────────────────────────────────────
// Cada beat de texto (quote / o con `at`) se clava al ms EXACTO en que la voz dice
// esa frase; las fotos se reparten proporcionalmente en los huecos entre anclas.
const CAPS = JSON.parse(fs.readFileSync("public/captions_cocina.json", "utf8"));
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
fs.writeFileSync("beatsheet/cocina.json", JSON.stringify({ video: "cocina", beats }, null, 1));
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · dur: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s`);
