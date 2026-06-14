// gen_huevos.mjs — "Guarda Huevos 8 Meses Sin Heladera (cal)" (Constructor Libre v8,
// FACELESS, voz Tomás). gpt-image-2 matcheado + diagramas + clips reales + LTX. Guard.
import fs from "fs";

const IMAGES = new Map();
const P = (s) =>
  `Foto casual y real, 16:9 horizontal. ${s} Como una foto sacada con el celular en el campo: con imperfecciones, luz natural despareja, saturación baja, nada pulido, sin apariencia de IA.`;
const DGP = (s) =>
  `Infografía horizontal 16:9 (1792x1024), lámina artesanal editorial premium, muy limpia. Fondo marfil con textura de papel sutil, líneas marrón oscuro, acentos verde oliva y terracota apagado. ${s} Tipografía serif clásica, ilustraciones de tinta fina y acuarela suave, mucho espacio en blanco, se entiende en un segundo. Estética vintage de libro de texto antiguo, papel envejecido. Nada infantil ni recargado.`;
const IM = (name, subject) => { if (!IMAGES.has(name)) IMAGES.set(name, P(subject)); return `img/${name}.png`; };
const DIA = (name, subject) => { if (!IMAGES.has(name)) IMAGES.set(name, DGP(subject)); return `img/${name}.png`; };

const HUES = ["amber", "red", "blue"];
const r = (src, o = {}) => ({ t: "raw", src, ...o });
const dgb = (src, o = {}) => ({ t: "raw", src, zoom: [1.0, 1.05], hold: true, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
let fSide = 0;
const f = (src, o = {}) => ({ t: "float", src, side: fSide++ % 2 ? "left" : "right", ...o });
const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.05, stat: 1.0, aged: 1.2, checklist: 1.25, splitlist: 1.1, bars: 1.25, process: 1.5, journey: 2.4, infzoom: 1.3, annotated: 1.35, callout: 1.05, chips: 1.0 };

const SECTIONS = [
  { key: "intro", start: 0.1, hue: "amber", beats: [
    c("impact", { image: IM("hv_huevo_frasco", "Un frasco de vidrio lleno de huevos blancos sumergidos en agua turbia con cal, sobre una mesa de campo."), setup: "Estos huevos los puso mi gallina hace 7 meses…", impact: "Y SIGUEN FRESCOS, SIN HELADERA", impactAccent: "danger", hitAt: 1.3 }),
    r(IM("hv_huevos_canasta", "Una canasta de huevos blancos de campo recién juntados, sobre una mesa de madera."), { kicker: "Solo agua y cal", hold: true }),
    c("quote", { image: IM("hv_gallina_pone", "Una gallina de campo en su nido con huevos, ponedora, escena rural."), text: "En primavera ponen de sobra; en invierno casi *nada*." }),
    r(IM("hv_huevos_invierno", "Un plato con huevos cocidos en una mesa de campo en invierno, ventana con escarcha."), { kicker: "Guardás la abundancia para la escasez", w: 0.5 }),
    c("headline", { tokens: ["Huevos", "8", "meses", "sin", { t: "frío" }], eyebrow: "El método de la cal, casi olvidado", bg: "image", image: IM("hv_balde_cal", "Un balde con huevos sumergidos en agua de cal, tapado, en una despensa fresca.") }),
  ]},
  { key: "tomas", start: 60, hue: "blue", beats: [
    r(IM("hv_casa_gallinero", "Una casa de campo de madera con un gallinero al lado, gallinas, atardecer."), { kicker: "Las gallinas, mis primeras compañeras", hold: true }),
    c("quote", { image: IM("hv_manos_huevo", "Las manos curtidas de un hombre de campo sosteniendo un huevo con cuidado."), text: "Un viejo me preguntó por qué no los ponía en cal, como su *madre*." }),
    c("aged", { heading: "No se desperdicia un huevo", lines: ["Ni me falta en invierno.", "Un método de hace siglos, casi perdido."], image: IM("hv_despensa_huevos", "Una despensa de campo con baldes de huevos en cal guardados, estantes de madera.") }),
    r(IM("hv_hombre_gallinero", "Un hombre mayor juntando huevos en su gallinero al amanecer, de espaldas."), { hold: true }),
  ]},
  { key: "porque", start: 115, hue: "amber", beats: [
    c("headline", { tokens: ["¿Por", "qué", "se", { t: "arruina" }, "?"], eyebrow: "Entendé la cáscara", bg: "image", image: IM("hv_huevo_macro", "Primer plano de un huevo blanco mostrando la textura de su cáscara, luz suave.") }),
    dgb(DIA("dg_hv_poros", "Corte de la cáscara de un huevo: miles de POROS microscópicos por los que respira, y una capa natural (la 'flor' o cutícula) que los sella. Con el tiempo esa capa se va y entran las bacterias. Rótulos en español, ilustración clara.")),
    c("quote", { image: IM("hv_cascara_poros", "Macro de la superficie de un huevo, textura porosa, casi se ven los poros."), text: "La cal vuelve a sellar los poros y crea un ambiente que las bacterias *odian*." }),
    c("splitlist", { title: "La cal hace dos cosas", items: ["Sella los poros desde afuera", "Crea un ambiente alcalino"], palette: "A" }),
  ]},
  { key: "regla", start: 160, hue: "red", beats: [
    c("headline", { tokens: ["La", "regla", "de", { t: "oro" }], eyebrow: "De esto depende todo", bg: "image", image: IM("hv_huevos_limpios", "Huevos blancos limpios de campo, sin lavar, sobre un paño, primer plano.") }),
    c("quote", { image: IM("hv_no_lavar", "Un huevo con una manchita siendo limpiado en seco con un cepillo, no con agua."), text: "Limpios pero SIN lavar: si los lavás, les sacás la capa *protectora*." }),
    c("splitlist", { title: "Solo huevos así", items: ["Frescos, de pocos días", "Limpios en seco, sin lavar", "Sin una sola rajadura"], palette: "D", cross: true }),
    r(IM("hv_huevo_rajado", "Un huevo con una pequeña rajadura en la cáscara, descartado para el método."), { kicker: "Uno rajado arruina el agua", w: 0.6 }),
  ]},
  { key: "preparar", start: 205, hue: "amber", beats: [
    c("headline", { tokens: ["La", { t: "preparación" }], eyebrow: "De una simpleza que asombra", bg: "image", image: IM("hv_cal_bolsa", "Una bolsa de cal apagada (hidratada) junto a un balde y agua, sobre una mesa de campo.") }),
    r(IM("hv_cal_apagada", "Cal apagada blanca en polvo en un cuenco, la cal de encalar, primer plano."), { kicker: "Cal apagada, nunca cal viva", w: 0.6 }),
    c("process", { title: "Agua de cal", steps: [
      { title: "Una cucharada por litro", image: IM("hv_cucharada_cal", "Una cucharada colmada de cal apagada sobre un balde con agua.") },
      { title: "Revolver", image: IM("hv_revolver_cal", "Revolviendo la cal en el agua de un balde, se vuelve lechosa.") },
      { title: "Sedimento en el fondo", image: IM("hv_sedimento", "Un balde con agua de cal y un sedimento blanco en el fondo, saturada.") },
      { title: "Sumergir los huevos", image: IM("hv_sumergir", "Colocando huevos con cuidado dentro del balde con agua de cal, cubiertos.") },
    ]}),
    c("quote", { image: IM("hv_balde_tapado", "Un balde con huevos en cal tapado, guardado en un rincón fresco y oscuro."), text: "Tapado, en un lugar fresco, y se olvida. Hasta ocho *meses*." }),
  ]},
  { key: "injerto1", start: 270, hue: "amber", beats: [
    c("aged", { heading: "Uno de 35 sistemas", lines: ["La proporción según el clima,", "cuánto duran según la temperatura,", "cómo etiquetar las tandas."], image: IM("hv_cuaderno", "Un cuaderno viejo manuscrito con notas sobre conservar huevos y dibujos, sobre madera.") }),
    f(IM("hv_manual", "Un manual casero abierto con láminas dibujadas a mano sobre conservar huevos, papel envejecido."), { kicker: "Todo junto en el manual" }),
    c("quote", { image: IM("hv_huevos_estante", "Huevos y baldes de cal en un estante de despensa de campo."), text: "Pero quédese, que ahora viene cómo sacarlos y saber si están *buenos*." }),
  ]},
  { key: "aceite", start: 305, hue: "blue", beats: [
    r(IM("hv_aceite_huevo", "Una mano frotando un huevo con una fina capa de aceite, sellando los poros, método alternativo."), { kicker: "El método del aceite: igual de simple", hold: true }),
    c("splitlist", { title: "El método del aceite", items: ["Frotar cada huevo con aceite", "Sella los poros igual que la cal", "Práctico para guardar pocos"], palette: "A" }),
    c("quote", { image: IM("hv_huevos_aceite", "Huevos untados con aceite guardados en un cajón con la punta hacia abajo."), text: "Los dos métodos hacen lo mismo: sellar la *cáscara*." }),
  ]},
  { key: "sacar", start: 350, hue: "amber", beats: [
    c("headline", { tokens: ["Sacarlos", "y", { t: "usarlos" }], eyebrow: "Meses después", bg: "image", image: IM("hv_sacar_balde", "Una mano sacando huevos del balde de cal meses después, agua lechosa.") }),
    r(IM("hv_enjuagar", "Enjuagando un huevo guardado con agua limpia justo antes de usarlo, sacando la cal."), { kicker: "Enjuagar justo antes de usar", w: 0.6 }),
    c("annotated", { image: IM("hv_pinchar", "Pinchando con un alfiler un agujerito en la punta ancha de un huevo antes de hervirlo."), caption: "Si los vas a hervir", annotations: [
      { x: 50, y: 38, label: "Un agujerito en la punta ancha" },
      { x: 50, y: 75, label: "Para que no reviente" },
    ]}),
    c("quote", { image: IM("hv_huevo_frito", "Un huevo frito en una sartén de campo, igual que uno fresco."), text: "Saben igual que un huevo fresco, porque básicamente lo *son*." }),
  ]},
  { key: "prueba", start: 400, hue: "blue", beats: [
    c("headline", { tokens: ["La", "prueba", "del", { t: "agua" }], eyebrow: "Tranquilidad total", bg: "image", image: IM("hv_huevo_vaso", "Un huevo dentro de un vaso con agua para probar si está bueno, sobre una mesa.") }),
    dgb(DIA("dg_hv_prueba", "La prueba del agua con tres huevos en vasos: uno acostado en el fondo = FRESCO y bueno; uno parado en el fondo = más viejo pero se come; uno que FLOTA = malo, no se come. Rótulos en español, ilustración clara de los tres.")),
    c("quote", { image: IM("hv_huevo_flota", "Un huevo flotando en la superficie de un vaso con agua, señal de que está malo."), text: "Si flota, no se come. El olfato tampoco *miente*." }),
    r(IM("hv_huevo_fondo", "Un huevo acostado en el fondo de un vaso con agua, fresco y bueno."), { kicker: "En el fondo, acostado = bueno", w: 0.6 }),
  ]},
  { key: "cantidades", start: 445, hue: "amber", beats: [
    c("bars", { title: "Cuántos guardar", unit: "docenas", bars: [{ label: "Un balde de 15 L", value: 4 }, { label: "Una familia chica", value: 2 }] }),
    r(IM("hv_baldes_fecha", "Dos o tres baldes de huevos en cal etiquetados con la fecha, en una despensa."), { kicker: "Etiquetá la fecha, consumí del más viejo", hold: true }),
    c("quote", { image: IM("hv_punado_cal", "Un puñado de cal sobre una mesa, monedas de cal para todo un balde."), text: "Conservar medio invierno de huevos cuesta, en cal, *nada*." }),
  ]},
  { key: "injerto2", start: 490, hue: "red", beats: [
    c("headline", { tokens: ["¿Por", "qué", { t: "desapareció" }, "?"], eyebrow: "La parte que da que pensar", bg: "image", image: IM("hv_gondola_huevos", "Una góndola de supermercado con cajas de huevos, disponibles todo el año.") }),
    c("quote", { image: IM("hv_huevos_super", "Cajas de huevos lavados de supermercado, menos ideales para el método."), text: "Un saber que te hace independiente no le sirve al *negocio*." }),
    c("bars", { title: "Lo que cuesta", unit: "", bars: [{ label: "Cal: monedas", value: 1 }, { label: "Depender de la góndola", value: 12 }] }),
    c("aged", { heading: "Se pierde por olvido", lines: ["No de golpe, sino cuando deja de ser", "negocio para alguien. Por eso lo junté."], image: IM("hv_manual2", "Un manual grueso manuscrito con métodos viejos de conservación, mate al lado.") }),
  ]},
  { key: "preguntas", start: 535, hue: "amber", beats: [
    c("splitlist", { title: "¿No tengo gallinas?", items: ["Sirve con huevos de campo", "Frescos y sin lavar", "Comprados baratos en temporada"], palette: "G" }),
    r(IM("hv_huevos_feria", "Huevos de campo frescos comprados por docena en una feria rural."), { w: 0.6 }),
    c("quote", { image: IM("hv_huevo_seguro", "Un huevo cocido sano abierto, mostrando que está perfecto, prueba superada."), text: "Con la prueba del agua y el olfato, el riesgo es prácticamente *nulo*." }),
    r(IM("hv_huevos_cocidos", "Huevos cocidos y pelados sobre un plato, conservados meses, perfectos."), { w: 0.6 }),
  ]},
  { key: "panorama", start: 580, hue: "blue", beats: [
    c("quote", { image: IM("hv_gallina_primavera", "Una gallina entre flores de primavera, la abundancia de huevos de la estación."), text: "Guardar la abundancia para la escasez. Pensar en el invierno en *primavera*." }),
    r(IM("hv_despensa_huevos2", "Una despensa de campo con baldes de huevos en cal y provisiones, abundante."), { hold: true }),
    c("splitlist", { title: "El ritmo que perdimos", items: ["La góndola siempre llena nos lo borró", "La paz de tener lo que vas a necesitar", "El ingenio de la gente de antes"], palette: "A" }),
  ]},
  { key: "accion", start: 620, hue: "amber", beats: [
    c("checklist", { title: "Esta primavera", items: ["Una docena de huevos limpios sin lavar", "Cal apagada, una cucharada por litro", "Sumergir en un frasco tapado", "Anotar la fecha"] }),
    c("journey", { eyebrow: "Tu primera docena", title: "Probá y perdele el miedo", accent: "accent", waypoints: [
      { x: 0, y: 0, z: 0, image: IM("hv_jrn_huevos", "Huevos limpios sin lavar sobre un paño."), label: "Limpios", num: "1", dwell: 2.4, travel: 1.5 },
      { x: 1.2, y: -0.3, z: 0.3, image: IM("hv_jrn_cal", "Agua de cal lechosa en un frasco."), label: "Cal", num: "2", dwell: 2.4, travel: 1.5 },
      { x: 2.4, y: 0.2, z: -0.2, image: IM("hv_jrn_sumergir", "Huevos sumergidos en el frasco con cal, tapado."), label: "Sumergir", num: "3", dwell: 2.4, travel: 1.5 },
      { x: 3.6, y: -0.2, z: 0.2, image: IM("hv_jrn_invierno", "Un huevo fresco cocinado en invierno, meses después."), label: "Invierno", num: "4", dwell: 2.6, travel: 1.4 },
    ]}),
    r(IM("hv_orgullo", "Un hombre de campo sosteniendo orgulloso un huevo conservado meses, sonrisa leve."), { hold: true }),
  ]},
  { key: "injerto3", start: 660, hue: "red", beats: [
    c("aged", { heading: "Todo en el manual", lines: ["Las proporciones según el clima,", "el método del aceite,", "cómo organizar las tandas todo el año."], image: IM("hv_manual_abierto", "Un manual casero abierto con láminas de conservar huevos, papel envejecido.") }),
    c("bars", { title: "El precio de hoy", unit: "", bars: [{ label: "Por separado", value: 158 }, { label: "Hoy", value: 27 }] }),
    c("quote", { image: IM("hv_huevo_mano2", "Un huevo conservado meses en la mano de un agricultor, orgullo, gallinero de fondo."), text: "Si no es para usted, le devuelvo cada centavo. El riesgo lo pongo *yo*." }),
  ]},
  { key: "cierre", start: 700, hue: "blue", beats: [
    c("quote", { image: IM("hv_canasta_atardecer", "Una canasta de huevos sobre una mesa de campo al atardecer, tranquila."), text: "Ya tenés una colección de saberes que te hacen más *libre*." }),
    r(IM("hv_coleccion", "Sobre una mesa: jabón casero, frascos de despensa, huevos en cal, todo junto, la colección."), { kicker: "Jabón, despensa, huevos, plagas", hold: true }),
    c("quote", { image: IM("hv_oficio", "Las manos de un hombre de campo trabajando con dignidad, oficio, luz de taller."), text: "No es magia. Es *oficio*. Y todavía se puede aprender." }),
    r(IM("hv_atardecer_final", "Un campo al atardecer con una casa de madera y humo de chimenea, cierre tranquilo."), { hold: true }),
  ]},
];
const VIDEO_END = 740;

let CW = [];
try { const C = JSON.parse(fs.readFileSync("public/captions_huevos.json", "utf8")); CW = (C.words || C).map((x) => ({ t: x.text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(), s: (x.startMs || 0) / 1000 })); } catch { CW = []; }
const normTok = (p) => p.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
const matchAt = (p, i) => { let ok = 0; for (let j = 0; j < p.length; j++) if (CW[i + j] && CW[i + j].t === p[j]) ok++; return ok; };
const findMs = (phrase, after) => { if (!CW.length) return null; const full = normTok(phrase); for (const len of [6, 5, 4, 3]) { const p = full.slice(0, len); if (p.length < 3) continue; for (let i = 0; i < CW.length - p.length; i++) { if (CW[i].s < after) continue; if (matchAt(p, i) >= Math.ceil(p.length * 0.8)) return CW[i].s; } } return null; };
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si]; const start = sec.start; const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END; const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => { if (i === 0) return start; const ph = pinPhrase(b); if (!ph) return null; const ms = findMs(ph, start + 0.5); return ms != null && ms > start + 1 && ms < end - 1.5 ? ms : null; });
  let lastPin = start; for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.5) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i); fixed.push(n);
  const startT = new Array(n);
  for (let fx = 0; fx < fixed.length - 1; fx++) { const a = fixed[fx], b = fixed[fx + 1]; const ta = pin[a], tb = b === n ? end : pin[b]; let sw = 0; for (let i = a; i < b; i++) sw += ws[i]; let acc = ta; for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); } }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2); const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2); const dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`; const hue = b.hue || sec.hue || HUES[(si + i) % HUES.length];
    const beat = { id, start: +cursor.toFixed(2), dur };
    if (b.t === "raw") { beat.kind = "raw"; beat.src = b.src; beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.zoom) beat.zoom = b.zoom; }
    else { beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = +cursor.toFixed(2); beat.dur = dur;
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
const CLIP_SWAP = { hv_gallina_pone: "hv_hen_nest", hv_revolver_cal: "hv_stir_lime", hv_huevo_frito: "hv_fry_egg", hv_enjuagar: "hv_rinse_egg", hv_huevo_flota: "hv_egg_float2", hv_gallina_primavera: "hv_hen_spring", hv_huevos_canasta: "hv_eggs_basket" };
let swapped = 0, animated = 0;
for (const b of beats) { if (b.kind === "raw" && typeof b.src === "string" && b.src.startsWith("img/")) { const name = b.src.slice(4, -4); const clip = CLIP_SWAP[name]; if (clip && fs.existsSync(`public/broll/${clip}.mp4`)) { b.src = `broll/${clip}.mp4`; swapped++; } } }
for (const b of beats) { if (b.kind === "raw" && typeof b.src === "string" && b.src.startsWith("img/")) { const name = b.src.slice(4, -4); if (fs.existsSync(`public/vid/${name}.mp4`)) { b.src = `vid/${name}.mp4`; animated++; } } }

fs.writeFileSync("beatsheet/huevos.json", JSON.stringify({ video: "huevos", tutorial: true, beats }, null, 1));
fs.writeFileSync("public/img/prompts_huevos_imgs.json", JSON.stringify([...IMAGES.entries()].map(([name, prompt]) => ({ name, prompt })), null, 2));
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · imágenes: ${IMAGES.size} · captions: ${CW.length ? "sí" : "NO"} · swap YT:${swapped} LTX:${animated}`);
