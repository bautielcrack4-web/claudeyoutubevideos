// gen_comida.mjs — "Cómo Guardar Comida 6 Meses Sin Heladera" (Constructor Libre v7,
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
    c("impact", { image: IM("cm_zanahoria_mano", "Una zanahoria firme y jugosa sostenida en la mano de un hombre de campo, cosechada hace meses, primer plano."), setup: "Esta zanahoria la coseché hace 5 meses…", impact: "Y NUNCA TOCÓ UNA HELADERA", impactAccent: "danger", hitAt: 1.3 }),
    r(IM("cm_verduras_mesa", "Papas, remolachas, cebollas, manzanas y un zapallo sobre una mesa de madera, cosecha guardada."), { kicker: "Todo el invierno, sin enchufar nada", hold: true }),
    c("quote", { image: IM("cm_despensa_vieja", "Una despensa de campo antigua con estantes llenos de verduras y frascos, luz cálida."), text: "Pueblos enteros guardaron su comida sin un solo *refrigerador*." }),
    r(IM("cm_heladera_apagada", "Una heladera vieja con la puerta abierta y vacía, electrodependencia."), { kicker: "Si se corta la luz, te quedás sin nada", w: 0.5 }),
    c("headline", { tokens: ["Comida", "6", "meses", "sin", { t: "heladera" }], eyebrow: "Como guardaban los abuelos", bg: "image", image: IM("cm_canasta_cosecha", "Una canasta de mimbre llena de verduras recién cosechadas, huerta de fondo.") }),
  ]},
  { key: "tomas", start: 60, hue: "blue", beats: [
    r(IM("cm_casa_campo", "Una casa de madera en el campo con una huerta al lado, atardecer rural."), { kicker: "Hace veinte años dejé la ciudad", hold: true }),
    c("quote", { image: IM("cm_manos_tierra", "Las manos de un hombre de campo sosteniendo verduras con tierra, primer plano."), text: "Aprendí a usar el frío, la tierra, la arena y la oscuridad que ya tengo *gratis*." }),
    c("aged", { heading: "Una despensa para el invierno", lines: ["Sin gastar un peso de luz.", "Sin depender de que el motor nunca falle."], image: IM("cm_sotano", "El interior de un sótano de raíces de campo con estantes y verduras guardadas, penumbra fresca.") }),
    r(IM("cm_hombre_huerta", "Un hombre mayor cosechando en su huerta al atardecer, de espaldas."), { hold: true }),
  ]},
  { key: "porque", start: 115, hue: "amber", beats: [
    c("headline", { tokens: ["¿Por", "qué", "se", { t: "pudre" }, "?"], eyebrow: "Entendé esto y todo es lógico", bg: "image", image: IM("cm_verdura_podrida", "Una verdura empezando a pudrirse y otra sana al lado, comparación, sobre madera.") }),
    dgb(DIA("dg_cm_enemigos", "Los tres enemigos de la comida guardada, en tres íconos con rótulos en español: CALOR (sol), HUMEDAD equivocada (gota), MICROBIOS y HONGOS. Abajo: el frío, la humedad justa y la oscuridad los frenan, gratis bajo la tierra.")),
    c("splitlist", { title: "La heladera solo hace dos cosas", items: ["Da frío", "Controla la humedad"], palette: "A" }),
    c("quote", { image: IM("cm_tierra_fresca", "Tierra oscura y fresca de un sótano, manos tocándola, frío natural."), text: "La naturaleza te da el frío gratis: bajo la *tierra*." }),
  ]},
  { key: "sotano", start: 165, hue: "blue", beats: [
    c("headline", { tokens: ["El", "sótano", "de", { t: "raíces" }], eyebrow: "La heladera natural", bg: "image", image: IM("cm_sotano_lleno", "Un sótano de raíces de campo lleno de verduras, papas, frascos y quesos en estantes de madera.") }),
    dgb(DIA("dg_cm_sotano", "Corte transversal de un sótano de raíces bajo tierra: a un metro de profundidad la temperatura es fresca y estable todo el año. Mostrar estantes con verduras, la tierra como manta aislante, ventilación. Rótulos en español.")),
    r(IM("cm_tacho_enterrado", "Un tacho de metal enterrado en un pozo con verduras adentro, versión simple del sótano."), { kicker: "La versión del pobre: un tacho enterrado", w: 0.6 }),
    r(IM("cm_monton_paja", "Un montículo de papas cubierto con paja y tierra en un patio, el clamp de los abuelos."), { kicker: "O un montón con paja y tierra", w: 0.6 }),
    c("chips", { bg: "image", image: IM("cm_balcon_fresco", "El rincón más fresco y oscuro de una casa, un placard contra pared exterior, despensa improvisada."), title: "Sin patio también", chips: ["el rincón más fresco", "un placard al norte", "un balcón al sur"], hue: "blue" }),
  ]},
  { key: "metodos", start: 220, hue: "amber", beats: [
    r(IM("cm_arena_cajon", "Un cajón de madera con zanahorias enterradas en arena, separadas, conservación."), { kicker: "Raíces en arena apenas húmeda", hold: true }),
    c("process", { title: "Zanahorias en arena", steps: [
      { title: "Capa de arena", image: IM("cm_arena_fondo", "Una capa de arena en el fondo de un cajón de madera, cenital.") },
      { title: "Zanahorias sin tocarse", image: IM("cm_zanahorias_arena", "Zanahorias acomodadas sobre la arena sin tocarse entre sí.") },
      { title: "Cubrir con arena", image: IM("cm_cubrir_arena", "Cubriendo las zanahorias con más arena en el cajón.") },
      { title: "Firmes en invierno", image: IM("cm_zanahoria_firme", "Una zanahoria firme y jugosa sacada de la arena meses después.") },
    ]}),
    c("splitlist", { title: "Cada verdura a su modo", items: ["Papas: a oscuras, sin luz", "Cebollas y ajos: secos y colgados", "Zapallos: frescos y secos"], palette: "D" }),
    r(IM("cm_cebollas_trenza", "Cebollas y ajos colgados en trenzas en un lugar seco y aireado de campo."), { kicker: "Cebollas y ajos: colgados", w: 0.6 }),
    r(IM("cm_papas_bolsa", "Papas guardadas en una bolsa de tela a oscuras, en una despensa fresca."), { w: 0.5 }),
    r(IM("cm_zapallos", "Zapallos de cáscara dura guardados en un estante, sin tocarse, despensa rústica."), { kicker: "Zapallos: meses y meses", w: 0.5 }),
  ]},
  { key: "juntos", start: 290, hue: "red", beats: [
    c("headline", { tokens: ["Lo", "que", "NO", "va", { t: "junto" }], eyebrow: "El secreto que arruina despensas", bg: "image", image: IM("cm_manzana_papa", "Manzanas y papas cerca, mostrando que no se pueden guardar juntas, sobre madera.") }),
    dgb(DIA("dg_cm_juntos", "Qué alimentos NO guardar juntos: MANZANAS largan un gas que BROTA las PAPAS. CEBOLLAS y PAPAS se arruinan mutuamente. Mostrar con flechas el gas y rótulos en español, dos columnas de buenos y malos vecinos.")),
    c("quote", { image: IM("cm_manzanas_cajon", "Manzanas guardadas en un cajón separadas con papel, despensa fresca."), text: "Una manzana cerca de las papas las hace *brotar*." }),
    c("aged", { heading: "Curar antes de guardar", lines: ["Dejar que la piel se endurezca al aire.", "Una verdura curada dura el doble."], image: IM("cm_curar_zapallo", "Zapallos curándose al sol sobre una mesa, endureciendo la cáscara.") }),
    r(IM("cm_papas_curar", "Papas secándose unos días en un lugar fresco y oscuro antes de guardarlas, sin lavar."), { kicker: "Las papas no se lavan", w: 0.6 }),
  ]},
  { key: "injerto1", start: 345, hue: "amber", beats: [
    c("aged", { heading: "Uno de 35 sistemas", lines: ["Qué verdura con qué método y cuánto dura,", "los planos del cajón de arena y el sótano,", "cómo curar cada cosa."], image: IM("cm_cuaderno", "Un cuaderno viejo manuscrito con notas sobre conservar comida y dibujos, sobre madera.") }),
    f(IM("cm_manual", "Un manual casero abierto con láminas de despensas dibujadas a mano, papel envejecido."), { kicker: "Todo junto en el manual" }),
    c("quote", { image: IM("cm_despensa2", "Una despensa de campo bien organizada con verduras y frascos."), text: "Ahora viene la forma de conservar que multiplica por *mucho*." }),
  ]},
  { key: "fermentar", start: 380, hue: "blue", beats: [
    c("headline", { tokens: ["Transformar", "para", { t: "conservar" }], eyebrow: "La reina: la fermentación", bg: "image", image: IM("cm_chucrut_frasco", "Un frasco de chucrut, repollo fermentado, sobre una mesa de campo, conservado.") }),
    c("process", { title: "Chucrut (repollo)", steps: [
      { title: "Repollo finito", image: IM("cm_repollo_cortar", "Cortando repollo bien fino sobre una tabla de madera.") },
      { title: "Con sal, apretar", image: IM("cm_repollo_sal", "Apretando el repollo con sal en un frasco hasta que larga su jugo.") },
      { title: "Cubierto del aire", image: IM("cm_frasco_tapado", "Un frasco de repollo cubierto por su líquido, tapado del aire, fermentando.") },
      { title: "Semanas: chucrut", image: IM("cm_chucrut_listo", "El chucrut listo en el frasco, conservado meses sin heladera.") },
    ]}),
    c("chips", { bg: "image", image: IM("cm_conservas_estante", "Un estante con frascos de conserva, mermeladas y verduras secas, despensa."), title: "Más formas viejas", chips: ["fermentar", "secar al sol", "conserva en frasco"], hue: "amber" }),
    r(IM("cm_tomates_secar", "Tomates cortados secándose al sol sobre una rejilla, conservación por secado."), { kicker: "Secar: sin agua no hay microbios", w: 0.6 }),
  ]},
  { key: "regla", start: 435, hue: "red", beats: [
    c("headline", { tokens: ["La", "regla", "de", { t: "oro" }], eyebrow: "El error que arruina todo", bg: "image", image: IM("cm_manzana_podrida", "Una manzana podrida entre manzanas sanas en un cajón, contagio.") }),
    c("quote", { image: IM("cm_revisar", "Manos revisando cada verdura antes de guardarla, descartando las golpeadas."), text: "Una manzana podrida pudre el cajón *entero*." }),
    c("splitlist", { title: "Solo se guarda", items: ["Lo sano y entero", "Lo golpeado se come primero", "Revisar la despensa cada tanto"], palette: "D", cross: true }),
    r(IM("cm_despensa_cuidada", "Una despensa ordenada y revisada, verduras sanas separadas, prolija."), { w: 0.6 }),
  ]},
  { key: "injerto2", start: 480, hue: "red", beats: [
    c("headline", { tokens: ["¿Por", "qué", "creés", "que", "no", { t: "podés" }, "?"], eyebrow: "La parte incómoda", bg: "image", image: IM("cm_gondola_comida", "Una góndola de supermercado llena de comida fresca, dependencia diaria.") }),
    c("quote", { image: IM("cm_super_carro", "Un carro de supermercado lleno, comprando comida fresca cada semana."), text: "Una familia que sabe conservar depende menos, y *compra* menos." }),
    c("bars", { title: "Quién depende menos", unit: "", bars: [{ label: "Despensa propia", value: 10 }, { label: "Góndola cada semana", value: 2 }] }),
    c("aged", { heading: "El saber más peligroso", lines: ["Te hace independiente en lo más básico:", "el comer. Por eso se dejó de enseñar."], image: IM("cm_manual2", "Un manual grueso manuscrito abierto con métodos de conservación, mate al lado.") }),
  ]},
  { key: "preguntas", start: 525, hue: "amber", beats: [
    c("splitlist", { title: "¿Vivo en departamento?", items: ["El rincón más fresco y oscuro", "Un placard al norte, un balcón al sur", "Fermentar en cualquier cocina"], palette: "G" }),
    r(IM("cm_depto_fresco", "El rincón fresco de un departamento con zapallos, cebollas y frascos guardados."), { w: 0.6 }),
    c("quote", { image: IM("cm_chucrut_seguro", "Un frasco de chucrut bien hecho, cubierto de líquido, seguro."), text: "La fermentación, bien hecha, es muy *segura*: el ácido protege." }),
    r(IM("cm_empezar_arena", "Una persona guardando zanahorias en un cajón con arena, empezando chico."), { kicker: "Empezá con un cajón y arena", w: 0.6 }),
  ]},
  { key: "panorama", start: 575, hue: "blue", beats: [
    c("quote", { image: IM("cm_familia_despensa", "Una familia de campo frente a una despensa llena, seguridad alimentaria."), text: "Si la luz se corta una semana, alimentás a tu familia con lo que *guardaste*." }),
    r(IM("cm_despensa_invierno", "Una despensa de campo llena de provisiones para el invierno, abundante."), { hold: true }),
    c("splitlist", { title: "La paz del que sabe", items: ["No la da un electrodoméstico", "La da el saber", "Independencia en lo más básico"], palette: "A" }),
  ]},
  { key: "accion", start: 615, hue: "amber", beats: [
    c("checklist", { title: "Esta temporada", items: ["El rincón más fresco = tu despensa", "Zanahorias en arena", "Cebollas y ajos colgados", "Tu primer frasco de chucrut"] }),
    c("journey", { eyebrow: "Empezá chico", title: "Tu primera despensa", accent: "accent", waypoints: [
      { x: 0, y: 0, z: 0, image: IM("cm_jrn_arena", "Un cajón con zanahorias en arena, primer plano."), label: "Arena", num: "1", dwell: 2.4, travel: 1.5 },
      { x: 1.2, y: -0.3, z: 0.3, image: IM("cm_jrn_colgar", "Cebollas colgadas en trenza en un lugar seco."), label: "Colgar", num: "2", dwell: 2.4, travel: 1.5 },
      { x: 2.4, y: 0.2, z: -0.2, image: IM("cm_jrn_chucrut", "Un frasco de chucrut fermentando."), label: "Fermentar", num: "3", dwell: 2.4, travel: 1.5 },
      { x: 3.6, y: -0.2, z: 0.2, image: IM("cm_jrn_despensa", "Una despensa llena para el invierno."), label: "Despensa", num: "4", dwell: 2.6, travel: 1.4 },
    ]}),
    r(IM("cm_observar", "Un hombre de campo mirando satisfecho su despensa llena."), { hold: true }),
  ]},
  { key: "injerto3", start: 655, hue: "red", beats: [
    c("aged", { heading: "Todo en el manual", lines: ["La tabla de qué guardar con qué método,", "los planos del cajón y el sótano,", "las recetas seguras de fermentado."], image: IM("cm_manual_abierto", "Un manual casero abierto con láminas de despensas y métodos, papel envejecido.") }),
    c("bars", { title: "El precio de hoy", unit: "", bars: [{ label: "Por separado", value: 158 }, { label: "Hoy", value: 27 }] }),
    c("quote", { image: IM("cm_zanahoria_orgullo", "Una zanahoria firme guardada meses, en la mano, orgullo del campo."), text: "Si no es para usted, le devuelvo cada centavo. El riesgo lo pongo *yo*." }),
  ]},
  { key: "cierre", start: 695, hue: "blue", beats: [
    c("quote", { image: IM("cm_despensa_atardecer", "Una despensa de campo en penumbra al atardecer, llena, tranquila."), text: "Guardá la abundancia para la *escasez*." }),
    c("headline", { tokens: ["Huevos", "8", "meses", "sin", { t: "frío" }], eyebrow: "La próxima vez", bg: "image", image: IM("cm_huevos_frasco", "Un frasco de vidrio con huevos sumergidos en agua con cal, conservación sin heladera.") }),
    r(IM("cm_gallinas", "Gallinas de campo en un gallinero, ponedoras, escena rural."), { kicker: "El método de la cal", hold: true }),
    c("quote", { image: IM("cm_oficio", "Las manos de un hombre de campo trabajando con dignidad, oficio."), text: "No es magia. Es *oficio*. Y todavía se puede aprender." }),
  ]},
];
const VIDEO_END = 735;

let CW = [];
try { const C = JSON.parse(fs.readFileSync("public/captions_comida.json", "utf8")); CW = (C.words || C).map((x) => ({ t: x.text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(), s: (x.startMs || 0) / 1000 })); } catch { CW = []; }
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
const CLIP_SWAP = { cm_repollo_cortar: "cm_cut_cabbage", cm_tomates_secar: "cm_dry_tomato", cm_cebollas_trenza: "cm_onion_braid", cm_gallinas: "cm_chickens2", cm_super_carro: "cm_supermarket2", cm_tierra_fresca: "cm_soil_hands", cm_repollo_sal: "cm_saltcabbage" };
let swapped = 0, animated = 0;
for (const b of beats) { if (b.kind === "raw" && typeof b.src === "string" && b.src.startsWith("img/")) { const name = b.src.slice(4, -4); const clip = CLIP_SWAP[name]; if (clip && fs.existsSync(`public/broll/${clip}.mp4`)) { b.src = `broll/${clip}.mp4`; swapped++; } } }
for (const b of beats) { if (b.kind === "raw" && typeof b.src === "string" && b.src.startsWith("img/")) { const name = b.src.slice(4, -4); if (fs.existsSync(`public/vid/${name}.mp4`)) { b.src = `vid/${name}.mp4`; animated++; } } }

fs.writeFileSync("beatsheet/comida.json", JSON.stringify({ video: "comida", tutorial: true, beats }, null, 1));
fs.writeFileSync("public/img/prompts_comida_imgs.json", JSON.stringify([...IMAGES.entries()].map(([name, prompt]) => ({ name, prompt })), null, 2));
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · imágenes: ${IMAGES.size} · captions: ${CW.length ? "sí" : "NO"} · swap YT:${swapped} LTX:${animated}`);
