// gen_postres.mjs — beatsheet/postres.json (Video 2). Mismo motor que gen_meriendas.
// STARTS se rellena con los ms reales tras transcribir (node anchors→starts).
import fs from "fs";

const PHOTOS = new Set(["po_frutillas", "po_canela", "po_nueces", "po_queso_dulce"]);
const srcOf = (name) => {
  if (name.startsWith("po_pasta") || name.startsWith("po_dulce_batata") || name.startsWith("po_zapallo") || name.startsWith("po_leche_asada") || name.startsWith("po_natillas") || name.startsWith("po_pan_dulce") || name.startsWith("po_rosca") || name.startsWith("po_pionono") || name.startsWith("po_higos") || name.startsWith("po_flan") || name.startsWith("po_membrillo") || name.startsWith("po_torta_negra") || name.startsWith("po_crema_quemada") || name.startsWith("po_marquise") || name.startsWith("po_abuela_almibar") || name.startsWith("po_mesa_dulces_70s"))
    return `img/${name}.png`; // las IA de postres
  if (name.startsWith("ai_") || name.startsWith("rc_")) return name.startsWith("ai_") ? `img/${name}.png` : `broll/${name}.mp4`;
  if (PHOTOS.has(name)) return `broll/${name}.jpg`;
  return `broll/${name}.mp4`;
};

const HUES = ["amber", "red", "blue"];
const r = (name, o = {}) => ({ t: "raw", name, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
let fSide = 0;
const f = (name, o = {}) => ({ t: "float", src: srcOf(name), side: (fSide++ % 2 ? "left" : "right"), ...o });
const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.05, stat: 1.0, aged: 1.2, checklist: 1.2, splitlist: 1.1, bars: 1.25, process: 1.45, journey: 2.4, infzoom: 1.3, annotated: 1.3, callout: 1.0, chips: 1.0, teasecards: 1.0 };

// inicios reales (se rellenan tras transcribir con node fill_starts.mjs postres)
const STARTS = JSON.parse(fs.readFileSync("beatsheet/_postres_starts.json", "utf8"));
const S = (k) => STARTS[k];

const SECTIONS = [
  { key: "intro", start: S("intro"), beats: [
    c("teasecards", { w: 1.15, eyebrow: "Algunos merecen volver…", title: "¿Cuántos probaste?", cards: [
      { src: srcOf("po_pasta_frola"), label: "Pasta frola" },
      { src: srcOf("po_flan_mixto"), label: "Flan mixto" },
      { src: srcOf("po_leche_asada"), label: "Leche asada" },
      { src: srcOf("po_pan_dulce"), label: "Pan dulce" },
      { src: srcOf("po_garrapinada"), label: "Garrapiñada" },
      { src: srcOf("po_pionono"), label: "Pionono" },
      { src: srcOf("po_merengues"), label: "Merengues" },
    ]}),
    r("po_abuela_postre", { kicker: "La memoria del azúcar", w: 0.5 }),
    f("po_almibar", { w: 0.45 }),
    r("po_caramelo_cuchara", { w: 0.5 }),
    c("quote", { image: srcOf("po_abuela_almibar"), text: "La memoria del azúcar no se me *borra*.", w: 0.8 }),
    r("po_mesa_dulces", { w: 0.7 }),
    c("stat", { value: 20, suffix: " postres", label: "que se fueron yendo despacito", eyebrow: "Hoy te cuento" }),
    f("po_mesa_dulces_70s"),
    c("headline", { tokens: ["Se", "fueron", "sin", { t: "avisar" }], eyebrow: "Y un día ya no estaban", bg: "image", image: srcOf("po_navidad_mesa") }),
    r("po_abuela_almibar", { hold: true }),
  ]},
  { key: "s01_frola", start: S("s01_frola"), beats: [
    c("rule", { number: "01", title: "Pasta frola" }),
    r("po_masa_estirar"), r("po_pasta_frola", { hold: true, kicker: "Membrillo casero" }),
    c("annotated", { image: srcOf("po_pasta_frola"), caption: "La reina de los domingos", annotations: [
      { x: 50, y: 28, label: "Tiritas cruzadas" },
      { x: 50, y: 62, label: "Membrillo casero" },
      { x: 20, y: 78, label: "Masa amanteca" },
    ]}),
    c("checklist", { title: "Pasta frola de verdad", items: ["Masa amanteca", "Membrillo casero", "Tiritas cruzadas", "La esquinita dorada"] }),
    c("quote", { image: srcOf("po_pasta_frola"), text: "El de ella tenía gusto a *otoño*, a paciencia." }),
  ]},
  { key: "s02_batata", start: S("s02_batata"), beats: [
    c("rule", { number: "02", title: "Dulce de batata casero" }),
    r("po_dulce_batata", { hold: true }), r("po_queso_dulce", { kicker: "Con un pedazo de queso" }),
    c("quote", { image: srcOf("po_dulce_batata"), text: "Un postre de lujo con la verdura más *barata*." }),
  ]},
  { key: "s03_zapallo", start: S("s03_zapallo"), beats: [
    c("rule", { number: "03", title: "Zapallo en almíbar" }),
    f("po_almibar"), r("po_zapallo_almibar", { hold: true, kicker: "Transparente, brillante" }),
    c("splitlist", { title: "El secreto", items: ["Zapallo duro", "Almíbar espeso", "Clavo de olor"], palette: "A" }),
    c("quote", { image: srcOf("po_zapallo_almibar"), text: "Casi todo, con paciencia y azúcar, se vuelve *glorioso*." }),
  ]},
  { key: "s04_lecheasada", start: S("s04_lecheasada"), beats: [
    c("rule", { number: "04", title: "Leche asada" }),
    r("po_horno_postre"), r("po_leche_asada", { hold: true, kicker: "La costra dorada arriba" }),
    c("quote", { image: srcOf("po_leche_asada"), text: "El confort hecho *postre*." }),
  ]},
  { key: "s05_natillas", start: S("s05_natillas"), beats: [
    c("rule", { number: "05", title: "Natillas y crema pastelera" }),
    r("po_crema_revolver", { hold: true }), r("po_natillas", { kicker: "Sin dejar de revolver" }),
    c("process", { title: "Crema pastelera", steps: [
      { title: "Yemas y azúcar", image: srcOf("po_batir_huevos") },
      { title: "Al fuego", image: srcOf("po_crema_revolver") },
      { title: "Revolver", image: srcOf("po_almibar") },
      { title: "Canela", image: srcOf("po_canela") },
    ]}),
    c("quote", { image: srcOf("po_natillas"), text: "Veinte minutos frente a la olla, *solo para vos*." }),
  ]},
  { key: "s06_bizcochuelo", start: S("s06_bizcochuelo"), beats: [
    c("rule", { number: "06", title: "Bizcochuelo casero" }),
    r("po_batir_huevos", { hold: true, kicker: "Aire, paciencia y brazo" }), r("po_bizcochuelo"),
    c("bars", { title: "Hacer un bizcochuelo", unit: "min", bars: [{ label: "A mano", value: 40 }, { label: "De caja", value: 10 }] }),
    c("quote", { image: srcOf("po_bizcochuelo"), text: "A veces se hundía en el medio. Era *nuestro*." }),
  ]},
  { key: "s07_pandulce", start: S("s07_pandulce"), beats: [
    c("rule", { number: "07", title: "Pan dulce de Navidad" }),
    f("po_manos_amasar"), r("po_pan_dulce", { hold: true }), r("po_navidad_mesa", { kicker: "El olor de la Navidad" }),
    c("callout", { image: srcOf("po_pan_dulce"), figure: "«Una vez al año»", caption: "Amasado en diciembre, con frutas y nueces." }),
    c("aged", { heading: "La ceremonia, no el sabor", lines: ["La abuela amasando en diciembre.", "La casa oliendo a fiesta tres días antes."], image: srcOf("po_pan_dulce") }),
  ]},
  { key: "s08_rosca", start: S("s08_rosca"), beats: [
    c("rule", { number: "08", title: "Rosca de Pascua" }),
    r("po_rosca_pascua", { hold: true }), f("po_crema_revolver"),
    c("quote", { image: srcOf("po_rosca_pascua"), text: "Comprás solo el pan. Hacerla te daba la *mañana en familia*." }),
  ]},
  { key: "s09_garrapinada", start: S("s09_garrapinada"), beats: [
    c("rule", { number: "09", title: "Garrapiñada casera" }),
    r("po_garrapinada", { hold: true, kicker: "Olor a caramelo hasta la vereda" }),
    c("quote", { image: srcOf("po_garrapinada"), text: "Mirar cómo nacía la golosina: química y *magia*." }),
  ]},
  { key: "s10_manzanas", start: S("s10_manzanas"), beats: [
    c("rule", { number: "10", title: "Manzanas acarameladas" }),
    r("po_manzana_caramel", { hold: true }), f("po_fruta_madura"),
    c("quote", { image: srcOf("po_manzana_caramel"), text: "Alegría desprolija. Y la desprolijidad feliz se está *perdiendo*." }),
  ]},
  { key: "s11_helado", start: S("s11_helado"), beats: [
    c("rule", { number: "11", title: "Helado casero a mano" }),
    r("po_helado_batir", { kicker: "Batir con tenedor cada rato" }), r("po_helado_casero", { hold: true }),
    c("splitlist", { title: "Sin freezer, con paciencia", items: ["Crema con yemas", "A la heladera", "Batir cada media hora"], palette: "B" }),
    c("quote", { image: srcOf("po_helado_casero"), text: "El premio sabía el doble porque lo *esperabas*." }),
  ]},
  { key: "s12_marquise", start: S("s12_marquise"), beats: [
    c("rule", { number: "12", title: "Postre de chocolate y galletitas" }),
    r("po_marquise", { hold: true }), f("po_torta_capas"),
    c("splitlist", { title: "Capas", items: ["Galletitas en café", "Crema de chocolate", "A la heladera"], palette: "A" }),
    c("quote", { image: srcOf("po_marquise"), text: "Robar un poco de crema con el *dedo*." }),
  ]},
  { key: "s13_pionono", start: S("s13_pionono"), beats: [
    c("rule", { number: "13", title: "Pionono de dulce de leche" }),
    r("po_pionono", { hold: true, kicker: "Enrollar sin que se rompa" }),
    c("quote", { image: srcOf("po_pionono"), text: "Animarse a algo que podía salir mal era parte de *cocinar*." }),
  ]},
  { key: "s14_budin", start: S("s14_budin"), beats: [
    c("rule", { number: "14", title: "Budín inglés" }),
    r("po_budin_ingles", { hold: true }), r("po_nueces"),
    c("quote", { image: srcOf("po_budin_ingles"), text: "Lo que cuesta trabajo dice cosas que lo comprado *no puede*." }),
  ]},
  { key: "s15_tartamanzana", start: S("s15_tartamanzana"), beats: [
    c("rule", { number: "15", title: "Tarta de manzana casera" }),
    r("po_manzanas_pelar", { kicker: "Pelar charlando" }), r("po_tarta_manzana", { hold: true }), f("po_horno_postre"),
    c("quote", { image: srcOf("po_tarta_manzana"), text: "Un postre que te obligaba a *frenar*." }),
  ]},
  { key: "s16_mermeladas", start: S("s16_mermeladas"), beats: [
    c("rule", { number: "16", title: "Mermeladas caseras" }),
    r("po_mermelada_hervir"), r("po_mermelada_frasco", { hold: true, kicker: "Guardar el verano" }),
    c("checklist", { title: "La despensa llena", items: ["Naranja", "Durazno", "Ciruela", "Hasta de tomate"] }),
    c("quote", { image: srcOf("po_mermelada_frasco"), text: "Cuando dejamos de hacer dulce, perdimos el *estar guardados*." }),
  ]},
  { key: "s17_merengues", start: S("s17_merengues"), beats: [
    c("rule", { number: "17", title: "Suspiros y merengues" }),
    r("po_claras_batir"), r("po_merengues", { hold: true, kicker: "Aprovechar las claras" }),
    c("quote", { image: srcOf("po_merengues"), text: "Algo tan fino, solo por el gusto de *hacerlo*." }),
  ]},
  { key: "s18_higos", start: S("s18_higos"), beats: [
    c("rule", { number: "18", title: "Higos en almíbar" }),
    f("po_higuera"), r("po_higos_almibar", { hold: true }),
    c("quote", { image: srcOf("po_higos_almibar"), text: "Perdimos la emoción de esperar que algo esté en su *época*." }),
  ]},
  { key: "s19_chantilly", start: S("s19_chantilly"), beats: [
    c("rule", { number: "19", title: "Chantilly con frutillas" }),
    r("po_chantilly", { hold: true }), r("po_frutillas", { kicker: "De la huerta" }),
    c("bars", { title: "Crema", unit: "", bars: [{ label: "Batida a mano", value: 10 }, { label: "Aerosol", value: 3 }] }),
    c("quote", { image: srcOf("po_chantilly"), text: "Cambiamos sabor por comodidad. Casi siempre *perdemos*." }),
  ]},
  { key: "s20_flanmixto", start: S("s20_flanmixto"), beats: [
    c("rule", { number: "20", title: "Flan mixto" }),
    r("po_flan_mixto", { hold: true, kicker: "Dulce de leche y crema" }), f("po_caramelo_cuchara"),
    c("quote", { image: srcOf("po_flan_mixto"), text: "Servir con esmero para las visitas era una forma de *cariño*." }),
  ]},
  { key: "extras", start: S("extras"), beats: [
    r("po_tarta_ricota", { kicker: "Torta de ricota" }),
    r("po_crema_quemada", { hold: true, kicker: "Crema quemada" }),
    f("po_torta_negra"),
    r("po_compota", { kicker: "Compota: rescate de la fruta" }),
    r("po_banana_dulce", { hold: true }),
    c("splitlist", { title: "Lo que casi nadie nombra ya", items: ["Torta de ricota", "Crema quemada", "Torta negra", "Compota"], palette: "B" }),
  ]},
  { key: "cierre", start: S("cierre"), beats: [
    c("quote", { image: srcOf("po_mesa_dulces"), text: "No se perdieron porque fueran malos. Se perdió el *gesto*." }),
    r("po_ninos_postre", { hold: true }),
    c("journey", { eyebrow: "Este domingo", title: "Elegí uno y hacelo", waypoints: [
      { x: 0, y: 0, z: 0, image: srcOf("po_leche_asada"), label: "Una leche asada", num: "1", dwell: 2.6, travel: 1.6 },
      { x: 1.2, y: -0.4, z: 0.3, image: srcOf("po_dulce_batata"), label: "Un dulce de batata", num: "2", dwell: 2.6, travel: 1.6 },
      { x: 2.4, y: 0.3, z: -0.2, image: srcOf("po_merengues"), label: "Unos merengues", num: "3", dwell: 2.6, travel: 1.6 },
      { x: 3.6, y: -0.2, z: 0.2, image: srcOf("po_mesa_dulces"), label: "Y compartilo", num: "4", dwell: 3.0, travel: 1.4 },
    ]}),
    c("aged", { heading: "Quedate en la cadena", lines: ["Ya te conté las meriendas de antes.", "Pronto, los domingos y la cocina de antes."] }),
    r("po_abuela_almibar", { hold: true }),
    c("quote", { image: srcOf("po_mesa_dulces_70s"), text: "Guardale la esquinita más dorada al que más *quieras*." }),
  ]},
];

const VIDEO_END = STARTS.__end;

// ── ANCLAJE POR FRASE (sync fino) ─────────────────────────────────────────────
// Cada beat de texto (quote / o con `at`) se clava al ms EXACTO en que la voz dice
// esa frase; las fotos se reparten proporcionalmente en los huecos entre anclas.
const CAPS = JSON.parse(fs.readFileSync("public/captions_postres.json", "utf8"));
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
fs.writeFileSync("beatsheet/postres.json", JSON.stringify({ video: "postres", beats }, null, 1));
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · dur: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s`);
