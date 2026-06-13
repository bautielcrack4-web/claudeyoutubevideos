// gen_jabon.mjs — beatsheet/jabon.json para "Nunca Más Compres Jabón" (Constructor
// Libre v4, FACELESS, voz clonada de Tomás). Mezcla clips/fotos REALES (Pexels) +
// diagramas gpt-image-2 + componentes estructurados. Anclaje POR FRASE a los
// captions (sync exacto). Modo TUTORIAL (raw <=65%). Clonado de gen_meriendas.
import fs from "fs";

// ── resolver de assets ───────────────────────────────────────────────────────
const srcOf = (name) => {
  if (name.startsWith("dg_")) return `img/${name}.png`;       // diagrama
  if (name.endsWith("_v")) return `broll/${name}.mp4`;        // clip Pexels
  if (name.startsWith("jb_")) return `broll/${name}.mp4`;     // clip YouTube (matchclip)
  return `broll/${name}.jpg`;                                  // foto Pexels
};

const HUES = ["amber", "red", "blue"];

// ── helpers de beat ───────────────────────────────────────────────────────────
const r = (name, o = {}) => ({ t: "raw", name, ...o });
const dg = (name, o = {}) => ({ t: "raw", name, zoom: [1.0, 1.05], hold: true, ...o }); // diagrama: casi estático
const c = (kind, props = {}) => ({ t: kind, ...props });
let fSide = 0;
const f = (name, o = {}) => ({ t: "float", src: srcOf(name), side: fSide++ % 2 ? "left" : "right", ...o });

const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.05, stat: 1.0, aged: 1.2,
  checklist: 1.25, splitlist: 1.1, bars: 1.25, process: 1.5, journey: 2.4, infzoom: 1.3,
  annotated: 1.35, callout: 1.05, chips: 1.0 };

// ── SECCIONES (start = inicio real de captions del audio recortado) ───────────
const SECTIONS = [
  // 0 — HOOK (0–70): la barra que nunca compraste, de ceniza + grasa
  { key: "intro", start: 0.1, hue: "amber", beats: [
    r("sp_hold_soap", { kicker: "No la compré en ningún lado", w: 0.7 }),
    r("sp_soap_natural", { w: 0.5 }),
    f("sp_ash", { kicker: "Ceniza del fogón", w: 0.5 }),
    r("sp_lard", { kicker: "Grasa que iba a la basura", w: 0.5 }),
    c("quote", { image: srcOf("sp_soap_bars"), text: "Más suave con su piel que los jabones de colores del *supermercado*." }),
    r("sp_lather_v", { hold: true }),
    r("sp_wash_hands_p", { w: 0.6 }),
    c("quote", { image: srcOf("sp_money_coins"), text: "No es solo que sea barato. Es que *dura* años." }),
    r("sp_supermarket", { kicker: "Mes a mes, toda la vida", hold: true }),
    c("headline", { tokens: ["Nunca", "más", "compres", { t: "jabón" }], eyebrow: "Lo que tu bisabuela sabía", bg: "image", image: srcOf("sp_soap_stack") }),
  ]},
  // 1 — TOMÁS (70–133.6): quién es, la primera tanda fallida
  { key: "tomas", start: 70.12, hue: "blue", beats: [
    r("sp_country_house", { kicker: "Hace veinte años dejé la ciudad", hold: true }),
    r("sp_woman_cooking", { w: 0.6 }),
    c("quote", { image: srcOf("sp_grandma_hands"), text: "La primera tanda me salió mal, se lo confieso. Y la segunda *también*." }),
    r("sp_kitchen", { w: 0.6 }),
    c("aged", { heading: "Lo que le voy a enseñar", lines: ["Sacar la lejía de la ceniza.", "Limpiar la grasa.", "Cocinar, cortar y curar el jabón."], image: srcOf("sp_soap_mold") }),
    f("sp_hold_soap", { kicker: "Una cosa menos que comprar" }),
    c("stat", { value: 20, suffix: " años", label: "haciendo mi propio jabón", eyebrow: "Sin comprar una barra" }),
    r("sp_freedom_field", { hold: true }),
  ]},
  // 2 — QUÉ ES EL JABÓN (133.6–189): saponificación
  { key: "quees", start: 133.62, hue: "amber", beats: [
    c("headline", { tokens: ["¿Qué", "es", "el", { t: "jabón" }, "?"], eyebrow: "Entendé esto y nunca le temés", bg: "image", image: srcOf("sp_soap_bars") }),
    r("sp_lard", { kicker: "Una grasa", w: 0.55 }),
    r("sp_ash", { kicker: "Un álcali", w: 0.55 }),
    c("quote", { image: srcOf("sp_stir_pot_v"), text: "Es lo que pasa cuando uno junta una grasa con un *álcali* fuerte." }),
    dg("dg_saponificacion", { kicker: "Saponificación" }),
    c("splitlist", { title: "El jabón sale de dos cosas", items: ["Una grasa", "Un álcali (lejía)"], palette: "A" }),
    c("quote", { image: srcOf("sp_fireplace"), text: "No hay magia. Es química vieja, de hace cinco *mil* años." }),
    c("stat", { value: 5000, suffix: " años", label: "limpiándose así", eyebrow: "La humanidad", accent: "amber" }),
  ]},
  // 3 — DOS MITADES / EL ÁLCALI DE LA CENIZA (189–264.9)
  { key: "dos", start: 189.11, hue: "blue", beats: [
    dg("dg_dos_mitades", { kicker: "Dos mitades que se unen" }),
    c("quote", { image: srcOf("sp_fireplace"), text: "El álcali salió de un solo lugar, gratis: del fondo del *fogón*." }),
    r("sp_wood_fire_v", { hold: true }),
    r("sp_ash_pour_v", { kicker: "La ceniza guarda el álcali" }),
    c("chips", { bg: "image", image: srcOf("sp_wood_oak"), title: "La mejor ceniza", chips: ["madera dura", "roble, fresno", "frutales"], hue: "amber" }),
    c("splitlist", { title: "Ceniza que SÍ y que NO", items: ["Madera limpia natural", "Nunca pintada ni tratada", "Nunca carbón con químicos"], palette: "D", cross: true }),
    c("quote", { image: srcOf("sp_ash"), text: "Madera limpia, ceniza limpia. Eso es *ley*." }),
  ]},
  // 4 — SACAR LA LEJÍA (264.9–324.8)
  { key: "lejia", start: 264.9, hue: "amber", beats: [
    c("headline", { tokens: ["Sacar", "la", { t: "lejía" }], eyebrow: "El agua fuerte de los antiguos", bg: "image", image: srcOf("sp_barrel") }),
    r("sp_barrel", { kicker: "Un balde o un barril", w: 0.6 }),
    dg("dg_lixiviado", { kicker: "Cómo gotea la lejía" }),
    r("sp_pour_water_v", { kicker: "Agua de lluvia tibia", hold: true }),
    r("sp_drip_v", { kicker: "Sale oscura y resbalosa" }),
    c("process", { title: "Sacar la lejía", steps: [
      { title: "Paja en el fondo", image: srcOf("sp_barrel") },
      { title: "Ceniza encima", image: srcOf("sp_ash") },
      { title: "Echar agua", image: srcOf("sp_pour_water_v") },
      { title: "Gotea la lejía", image: srcOf("sp_drip_v") },
    ]}),
    c("quote", { image: srcOf("sp_drops_water"), text: "Ese líquido jabonoso entre los dedos, *es* la lejía." }),
  ]},
  // 5 — LA PRUEBA + ADVERTENCIA (324.8–419)
  { key: "prueba", start: 324.83, hue: "blue", beats: [
    c("headline", { tokens: ["¿Está", "en", "su", { t: "punto" }, "?"], eyebrow: "Sin instrumentos, como los viejos", bg: "image", image: srcOf("sp_egg_glass") }),
    r("sp_egg_glass", { kicker: "La prueba del huevo", hold: true }),
    dg("dg_huevo", { kicker: "Floja, en punto o fuerte" }),
    c("quote", { image: srcOf("sp_egg_glass"), text: "El huevo flota y asoma un pedacito del tamaño de una *moneda*." }),
    r("sp_feather", { kicker: "La pluma se empieza a deshacer" }),
    c("annotated", { image: srcOf("sp_gloves"), caption: "La lejía quema: respeto, no pánico", annotations: [
      { x: 30, y: 40, label: "Guantes" },
      { x: 68, y: 38, label: "Proteja los ojos" },
      { x: 50, y: 75, label: "Lugar ventilado" },
    ]}),
    c("quote", { image: srcOf("sp_gloves"), text: "No le tenga pánico. Téngale *respeto*. Como al fuego." }),
    r("sp_gloves", { w: 0.6 }),
  ]},
  // 6 — INJERTO 1 (suave) (419–455)
  { key: "injerto1", start: 419, hue: "amber", beats: [
    c("aged", { heading: "Uno de 35 sistemas", lines: ["Las proporciones exactas, las pasadas de ceniza,", "cómo concentrar una lejía floja…", "todo medido y probado en mi cocina."], image: srcOf("sp_parchment") }),
    f("sp_soap_stack", { kicker: "Todo junto en el manual" }),
    r("sp_parchment", { w: 0.7 }),
    c("quote", { image: srcOf("sp_kitchen"), text: "Ahora viene la grasa, y no le voy a esconder ni un solo *paso*." }),
  ]},
  // 7 — LA GRASA (455–545)
  { key: "grasa", start: 455, hue: "red", beats: [
    c("headline", { tokens: ["La", "otra", "mitad", ":", { t: "grasa" }], eyebrow: "Lo que también se tira", bg: "image", image: srcOf("sp_lard") }),
    r("sp_meat_raw", { kicker: "Grasa que le saca a la carne", w: 0.6 }),
    r("sp_lard", { hold: true }),
    c("chips", { bg: "image", image: srcOf("sp_meat_raw"), title: "Cualquier grasa sirve", chips: ["sebo de vaca", "manteca de cerdo", "o aceite vegetal"], hue: "red" }),
    r("sp_melt_v", { kicker: "Se derrite en agua", hold: true }),
    c("process", { title: "Limpiar la grasa", steps: [
      { title: "Grasa + agua al fuego", image: srcOf("sp_melt_v") },
      { title: "Enfriar toda la noche", image: srcOf("sp_pot_stove") },
      { title: "Sube y se solidifica", image: srcOf("sp_lard") },
      { title: "Raspar lo sucio", image: srcOf("sp_knife_cut") },
    ]}),
    r("sp_pot_stove", { w: 0.7 }),
    c("quote", { image: srcOf("sp_lard"), text: "La grasa más limpia da el jabón más blanco y más *suave*." }),
  ]},
  // 8 — COCCIÓN / EL PUNTO (545–643)
  { key: "coccion", start: 545, hue: "amber", beats: [
    c("quote", { image: srcOf("sp_stir_pot_v"), text: "Esta es la parte donde se hace el jabón de *verdad*." }),
    r("sp_melt_v", { kicker: "Grasa tibia, no hirviendo", w: 0.6 }),
    r("sp_stir_pot_v", { kicker: "La lejía de a poco, revolviendo", hold: true }),
    dg("dg_proceso", { kicker: "Los cuatro pasos" }),
    r("sp_ladle_pot", { kicker: "Se pone cremosa, espesa" }),
    c("annotated", { image: srcOf("sp_wood_spoon"), caption: "La prueba del rastro", annotations: [
      { x: 50, y: 45, label: "La gota deja una marca" },
      { x: 50, y: 75, label: "= llegó al punto" },
    ]}),
    c("checklist", { title: "Si quiere, al final", items: ["Un puñado de sal: más dura", "Aromas: lavanda, romero", "Avena: más suave"] }),
    r("sp_salt_v", { w: 0.5 }),
    r("sp_lavender", { w: 0.5 }),
    c("quote", { image: srcOf("sp_stir_pot_v"), text: "El mismo movimiento del brazo que hicieron millones de manos antes que la *suya*." }),
  ]},
  // 9 — MOLDE Y CURADO (643–716)
  { key: "curar", start: 643.1, hue: "blue", beats: [
    r("sp_soap_mold", { kicker: "Verter en moldes", hold: true }),
    r("sp_knife_cut", { kicker: "Cortar en barras" }),
    r("sp_soap_stack", { w: 0.6 }),
    c("bars", { title: "Tiempo de curado", unit: "semanas", bars: [{ label: "Mínimo", value: 4 }, { label: "Ideal", value: 8 }] }),
    c("quote", { image: srcOf("sp_soap_natural"), text: "El jabón curado, viejo, es el *mejor* jabón." }),
    r("sp_towel_fold", { kicker: "Secar al aire, separadas" }),
    c("quote", { image: srcOf("sp_soap_bars"), text: "La prisa es la enemiga del *buen* jabón." }),
  ]},
  // 10 — INJERTO 2 (anti-corporación) (716–780)
  { key: "injerto2", start: 716, hue: "red", beats: [
    c("headline", { tokens: ["¿Por", "qué", "nadie", "te", "lo", { t: "enseñó" }, "?"], eyebrow: "La parte incómoda", bg: "image", image: srcOf("sp_supermarket") }),
    r("sp_shop_cart", { kicker: "Un producto con marca y publicidad", hold: true }),
    c("quote", { image: srcOf("sp_money_coins"), text: "Con algo gratis que sale de la ceniza, nadie gana *dinero*." }),
    c("bars", { title: "Lo que entrega gota a gota", unit: "", bars: [{ label: "Jabón casero", value: 1 }, { label: "Toda una vida comprando", value: 12 }] }),
    c("quote", { image: srcOf("sp_supermarket"), text: "Alcanza con que deje de enseñarse una sola *generación*." }),
    r("sp_money_coins", { w: 0.6 }),
    c("aged", { heading: "Por eso junté todo", lines: ["Treinta y cinco sistemas, ordenados y probados.", "Para devolverle el saber que le sacaron."], image: srcOf("sp_parchment") }),
  ]},
  // 11 — PREGUNTAS (780–855)
  { key: "preguntas", start: 780.34, hue: "amber", beats: [
    c("splitlist", { title: "¿Y si es peligroso por la lejía?", items: ["Empiece por el jabón", "Después saque su lejía", "Empiece por donde se sienta cómodo"], palette: "G" }),
    r("sp_gloves", { w: 0.6 }),
    c("quote", { image: srcOf("sp_kitchen"), text: "Le va a salir mal alguna vez, y no pasa nada. Cada error le *enseña*." }),
    r("sp_hold_soap", { w: 0.6 }),
    c("chips", { bg: "image", image: srcOf("sp_lather_v"), title: "Una sola receta sirve para", chips: ["manos y cuerpo", "lavar la ropa", "los platos", "la casa"], hue: "blue" }),
    c("quote", { image: srcOf("sp_soap_stack"), text: "Una sola receta le resuelve la limpieza entera de su *hogar*." }),
    r("sp_dishes_v", { w: 0.6 }),
    r("sp_laundry_v", { hold: true }),
  ]},
  // 12 — PANORAMA (855–907.5)
  { key: "panorama", start: 855, hue: "blue", beats: [
    c("quote", { image: srcOf("sp_country_house"), text: "El jabón, el pan, conservar la comida… dejamos de *enseñarlas*." }),
    r("sp_woman_cooking", { hold: true }),
    c("splitlist", { title: "No tenés que hacer todo", items: ["Tené la opción", "Sepé hacerlo", "No dependas de nadie"], palette: "A" }),
    r("sp_hold_soap", { w: 0.6 }),
    c("quote", { image: srcOf("sp_freedom_field"), text: "Esa tranquilidad de saber que podría hacerlo… no la compra el *dinero*." }),
    r("sp_freedom_field", { hold: true }),
  ]},
  // 13 — ACCIÓN ESTE FIN DE SEMANA (907.5–958)
  { key: "accion", start: 907.53, hue: "amber", beats: [
    c("checklist", { title: "Este fin de semana", items: ["Junte grasa de cocinar", "Guarde ceniza de madera limpia", "Guantes y algo para los ojos", "Una tanda chica, sin apuro"] }),
    r("sp_ash", { w: 0.5 }),
    r("sp_lard", { w: 0.5 }),
    r("sp_gloves", { w: 0.5 }),
    c("journey", { eyebrow: "Su primera barra", title: "Paso a paso, sin miedo", accent: "accent", waypoints: [
      { x: 0, y: 0, z: 0, image: srcOf("sp_ash"), label: "Ceniza", num: "1", dwell: 2.4, travel: 1.5 },
      { x: 1.2, y: -0.3, z: 0.3, image: srcOf("sp_drip_v"), label: "Lejía", num: "2", dwell: 2.4, travel: 1.5 },
      { x: 2.4, y: 0.2, z: -0.2, image: srcOf("sp_stir_pot_v"), label: "Cocinar", num: "3", dwell: 2.4, travel: 1.5 },
      { x: 3.6, y: -0.2, z: 0.2, image: srcOf("sp_soap_stack"), label: "Curar", num: "4", dwell: 2.6, travel: 1.4 },
    ]}),
    c("quote", { image: srcOf("sp_hold_soap"), text: "Es una sensación que no se *compra*." }),
  ]},
  // 14 — INJERTO 3 (CTA stack) (958–1013.7)
  { key: "injerto3", start: 958, hue: "red", beats: [
    c("aged", { heading: "Todo en el manual", lines: ["Proporciones, tiempos de curado,", "jabón de ropa y jabón de bebé,", "y cómo arreglar una tanda que salió mal."], image: srcOf("sp_parchment") }),
    r("sp_soap_stack", { hold: true }),
    c("bars", { title: "El precio de hoy", unit: "", bars: [{ label: "Por separado", value: 158 }, { label: "Hoy", value: 27 }] }),
    c("quote", { image: srcOf("sp_hold_soap"), text: "Si no es para usted, le devuelvo cada centavo. Todo el riesgo lo pongo *yo*." }),
    f("sp_soap_natural", { kicker: "Quedan pocas copias" }),
  ]},
  // 15 — CIERRE + PRÓXIMO VIDEO (1013.7–1070.5)
  { key: "cierre", start: 1013.75, hue: "blue", beats: [
    c("quote", { image: srcOf("sp_kitchen"), text: "Cuénteme si su abuela lo hacía. Esas historias me *encantan*." }),
    r("sp_grandma_hands", { w: 0.6 }),
    c("headline", { tokens: ["No", "tire", "más", "la", { t: "ceniza" }], eyebrow: "La próxima vez", bg: "image", image: srcOf("sp_ash") }),
    r("sp_ash_pour_v", { kicker: "Fertilizante, limpieza, plagas", hold: true }),
    c("quote", { image: srcOf("sp_freedom_field"), text: "No es magia. Es *oficio*. Y todavía se puede aprender." }),
    r("sp_hold_soap", { hold: true }),
  ]},
];

const VIDEO_END = 1070.52;

// ── ANCLAJE POR FRASE (sync fino) ─────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_jabon.json", "utf8"));
const CW = (CAPS.words || CAPS).map((x) => ({ t: x.text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(), s: (x.startMs || 0) / 1000 }));
const normTok = (phrase) => phrase.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
const matchAt = (p, i) => { let ok = 0; for (let j = 0; j < p.length; j++) if (CW[i + j] && CW[i + j].t === p[j]) ok++; return ok; };
const findMs = (phrase, after) => {
  const full = normTok(phrase);
  // probar ventanas decrecientes (6→5→4→3) y aceptar el mejor match >=70%
  for (const len of [6, 5, 4, 3]) {
    const p = full.slice(0, len);
    if (p.length < 3) continue;
    for (let i = 0; i < CW.length - p.length; i++) {
      if (CW[i].s < after) continue;
      if (matchAt(p, i) >= Math.ceil(p.length * 0.8)) return CW[i].s;
    }
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
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b);
    if (!ph) return null;
    const ms = findMs(ph, start + 0.5);
    return ms != null && ms > start + 1 && ms < end - 1.5 ? ms : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.5) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i);
  fixed.push(n);
  const startT = new Array(n);
  for (let fx = 0; fx < fixed.length - 1; fx++) {
    const a = fixed[fx], b = fixed[fx + 1];
    const ta = pin[a], tb = b === n ? end : pin[b];
    let sw = 0; for (let i = a; i < b; i++) sw += ws[i];
    let acc = ta;
    for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); }
  }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2);
    const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2);
    const dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`;
    const hue = b.hue || sec.hue || HUES[(si + i) % HUES.length];
    const beat = { id, start: +cursor.toFixed(2), dur };
    if (b.t === "raw") { beat.kind = "raw"; beat.src = srcOf(b.name); beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.zoom) beat.zoom = b.zoom; }
    else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = +cursor.toFixed(2); beat.dur = dur;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (beat.kind === "annotated" && Array.isArray(beat.annotations)) beat.annotations = beat.annotations.map((a) => ({ kind: a.kind || "circle", ...a }));
      if (beat.kind === "journey") delete beat.accent;
      if (beat.kind !== "journey" && !beat.hue) beat.hue = hue;
    }
    beats.push(beat);
  });
}
fs.writeFileSync("beatsheet/jabon.json", JSON.stringify({ video: "jabon", tutorial: true, beats }, null, 1));
const raw = beats.filter((b) => b.kind === "raw").length;
const kinds = new Set(beats.map((b) => b.kind));
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · tipos: ${[...kinds].join(",")}`);
console.log(`dur total: ${(beats[beats.length - 1].start + beats[beats.length - 1].dur).toFixed(0)}s`);
