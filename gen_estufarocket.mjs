// gen_estufarocket.mjs — construye beatsheet/estufarocket.json (Video 1, El Constructor Libre).
// Narrador "Tomás". Anclaje por frase a captions_estufarocket.json (sync fino).
// Emite además public/img/prompts_estufarocket_diag.json (diagramas gpt-image-2, names dg_er_*).
//
// Flujo:
//   node gen_estufarocket.mjs
//   node beatsheet.mjs beatsheet/estufarocket.json
//   node gen_deapi.mjs public/img/prompts_estufarocket.json     # fotos FLUX
//   node gen_video.mjs public/vid/clips_estufarocket.json       # clips LTX
//   OPENAI_IMAGE_MODEL=gpt-image-2-2026-04-21 node gen_images.mjs public/img/prompts_estufarocket_diag.json
import fs from "fs";

// ── PROMPT DE FOTOS = gpt-image-2 LOW, fórmula CORTA-IMPERFECTA (estándar jun 2026) ──
// La clave del realismo es pedir imperfecciones, NO detalle técnico. Ver skill
// "LA CLAVE ES EL PROMPT". Estas fotos se generan con gen_images.mjs (gpt-image-2 low),
// NO con FLUX/deAPI. deAPI (LTX) solo anima las stills.
const IMPERF = "Que se vea como una foto casera real: leve desenfoque en algunas zonas, ligera inclinación de cámara, luz desigual, piel y texturas reales, manos naturales con dedos correctos, fondo algo desordenado, pequeñas imperfecciones, nada perfecto, nada pulido, sin apariencia de IA, estilo documental auténtico, saturación baja, colores suaves y ligeramente apagados. Sin texto legible.";
const P = (d) => `Foto documental muy realista, 16:9. ${d}. ${IMPERF}`;
// Tomás como sujeto (look fijo y consistente). Encuadre abierto/medio, manos no protagonistas.
const AV = "un hombre rural de unos 45 años, pelo oscuro y barba corta canosa, piel curtida, camisa de trabajo verde oliva y delantal de cuero marrón";
const PAV = (d) => P(`${AV}, ${d}, en una chacra rural de la Patagonia`);
// diagrama gpt-image-2 (paleta de marca, esquina sup-der libre para el avatar)
const DP = (d) => `Crear una infografía horizontal, RELACIÓN DE ASPECTO EXACTA 16:9 (1792x1024), estilo lámina ilustrada hecha a mano pero muy profesional, limpia, premium y editorial. Fondo marfil claro con textura de papel muy sutil, líneas marrón oscuro casi negras, acentos en verde oliva/salvia y terracota apagado. ${d}. DEJÁ COMPLETAMENTE LIBRE la esquina superior derecha (limpia, sin texto ni dibujos) para colocar después el avatar. Composición minimalista, mucho espacio, pocos bloques grandes, ilustración de tinta fina con acuarela suave, se entiende en 1 segundo. Textos en español, breves. Estética: vintage botanical / archival textbook illustration, premium editorial, papel levemente envejecido. Evitá verse escolar/infantil/sobrecargado.`;

const HUES = ["amber", "red", "blue"];
let clipFrames = {};
// helpers de beat
const r = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: P(prompt) }, ...o });
const rv = (name, prompt, o = {}) => ({ t: "raw", name, clip: true, gen: { type: "clip", image: name, prompt: P(prompt), frames: o.frames || 90 }, ...o });
const rav = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: PAV(prompt) }, ...o }); // Tomás haciendo la acción
const c = (kind, props = {}) => ({ t: kind, ...props });
let fSide = 0;
const fimg = (name, prompt, o = {}) => ({ t: "float", name, gen: { type: "image", name, prompt: P(prompt) }, side: (fSide++ % 2 ? "left" : "right"), ...o });
// split 50/50 al ras: imagen a un lado (default derecha), avatar al otro, SIN marco
const half = (name, prompt, o = {}) => ({ t: "half", name, side: "right", gen: { type: "image", name, prompt: P(prompt) }, ...o });
// CLIP REAL ya en disco (public/broll/<name>.mp4) — sin gen. Reemplaza gen FLUX de
// manos/acción/fuego (donde FLUX deforma) + da el "toque" documental real.
const real = (name, o = {}) => ({ t: "raw", name, broll: true, ...o });

// diagramas (gpt-image-2) — se juntan acá y se emiten aparte
const DIAGRAMS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };

const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.0, stat: 1.0, aged: 1.2, checklist: 1.2, splitlist: 1.1, bars: 1.25, cross: 1.25, process: 1.5, journey: 2.6, infzoom: 1.3, annotated: 1.3, callout: 1.0, chips: 1.0, impact: 1.4, diagram: 2.4, float: 1.2, depthtext: 1.2 };

// ── SECCIONES (cada una ancla por una frase del guion) ───────────────────────
const SECTIONS = [
  // ░░ HOOK ░░ — avatar abre ~1.3s, después entra el ImpactReveal
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}), // ABRE el avatar a pantalla completa; el Main pone el texto "Afuera 2° / Adentro 22°" ENCIMA, oscureciéndolo (AvatarScrimText)
    real("rb_kindling_hand", { kicker: "Un puñado de ramitas", at: "puñado de ramitas", hold: true }),
    r("er_estufa_brasas", "a glowing rusty rocket stove burning a tiny handful of thin twigs inside a cozy dim cabin, warm fire glow", { kicker: "Calienta toda la casa" }),
    rv("erv_nieve_ventana", "frost and snow building on a small cabin window from inside, cold blue outside warm inside", { frames: 75 }),
    r("er_ramitas_caben", "a single open palm holding just a few thin twigs, close-up, that's all the fuel"),
    r("er_termometro_22", "an old analog room thermometer on a wooden cabin wall reading a warm temperature, frost on the window behind"),
    rav("er_tomas_mangas", "in shirt sleeves inside a warm wooden cabin while snow falls outside the window, relaxed", { kicker: "En mangas de camisa" }),
    r("er_garrafa_polvo", "a dusty unused gas cylinder bottle in a corner of a shed, cobwebs, untouched all winter"),
    c("headline", { tokens: ["La", "cuenta", "de", "gas:", { t: "cero" }], eyebrow: "Todo el invierno", bg: "image", image: r("er_factura_gas", "an old crumpled gas utility bill on a rough wooden table, numbers not legible, dim kitchen light").gen.name, _genImg: "er_factura_gas", _prompt: P("an old crumpled gas utility bill on a rough wooden table, numbers not legible, dim kitchen light") }),
    r("er_estufa_barro_full", "a finished cob rocket mass heater with a metal drum top in a rustic cabin, the whole system, warm"),
    real("rb_snow_cabin", {}),
    rav("er_tomas_hook_senala", "pointing at his rocket stove with a confident look, inviting the viewer to watch", { kicker: "Mirá esto" }),
  ]},
  // ░░ IDENTIDAD ░░
  { key: "ident", phrase: "Me llamo Tomás", beats: [
    rav("er_tomas_retrato", "documentary portrait standing in front of a hand-built wooden house he made, calm confident gaze", { hold: true, kicker: "Tomás" }),
    rav("er_tomas_construyo", "younger version building a wooden cabin wall by hand twenty years ago, sawdust, tools"),
    c("quote", { image: r("er_manos_trabajo", "close-up of rough calloused working hands resting on a wooden beam, dirt under nails").gen.name, text: "No soy ingeniero. Soy un *hombre que prueba cosas*.", _genImg: "er_manos_trabajo", _prompt: P("close-up of rough calloused working hands resting on a wooden beam, dirt under nails") }),
    rav("er_tomas_incomoda", "leaning toward camera with a serious knowing look inside his workshop, oil lamp behind", { kicker: "La parte que te va a incomodar" }),
    c("headline", { tokens: ["Probé", "lo", "que", "funciona.", "El", "resto", "lo", { t: "tiré" }], eyebrow: "20 años", bg: "grid", hue: "amber" }),
  ]},
  // ░░ PROMESA ░░
  { key: "promesa", phrase: "Quédate conmigo hasta el final", beats: [
    r("er_pila_lena_fina", "a neat pile of thin dry kindling twigs gathered next to a stone wall, soft daylight"),
    c("stat", { value: 1, prefix: "< ", suffix: " mes de gas", label: "lo que cuesta armar todo el sistema", eyebrow: "Te lo prometo" }),
    c("chips", { bg: "image", image: "img/er_estufa_barro_full.png", imageDarken: 0.6, title: "Lo que vas a saber al final", chips: ["Estufa rocket", "Muro Trombe", "Sin combustible que comprar"], hue: "amber" }),
    r("er_cabana_humo", "a small wooden patagonian cabin with a thin wisp of smoke from its chimney, snowy field, overcast"),
  ]},
  // ░░ REFRAME DEL PROBLEMA ░░
  { key: "problema", phrase: "Empecemos por lo que casi todos", beats: [
    rv("erv_chimenea_humo", "thick smoke pouring out of a tall metal chimney into a grey sky, heat escaping", { frames: 90, kicker: "Pagás por calentar el cielo" }),
    c("diagram", { eyebrow: "A dónde se va tu calor", slides: [{ image: dg("dg_er_perdida", "Diagrama de una casa en corte mostrando cómo el calor de una estufa común se ESCAPA por la chimenea hacia el cielo (flechas de calor saliendo arriba) y solo una parte chica queda en la habitación. Una casa, una estufa, flechas de calor subiendo y perdiéndose."), eyebrow: "El calor se escapa antes de quedarse" }] }),
    c("bars", { title: "Cuánto calor aprovechás", unit: "%", bars: [
      { label: "Hogar abierto", value: 10, tone: "danger" },
      { label: "Salamandra común", value: 50 },
      { label: "Estufa rocket", value: 90, winner: true } ] }),
    real("rb_woodstove_fire", { kicker: "La salamandra común" }),
    r("er_hogar_abierto", "an open fireplace with a roaring fire, most heat visibly going up the chimney, drafty old room"),
    rv("erv_humo_caño", "smoke and heat shimmer rising fast out of a stovepipe into cold air, wasted warmth", { frames: 75 }),
    c("chips", { bg: "image", image: "img/er_hogar_abierto.png", imageDarken: 0.62, title: "El problema no es el frío", chips: ["El calor", "se escapa", "antes de quedarse"], hue: "red" }),
    r("er_lena_apilada", "a large pile of chopped thick firewood logs stacked by a wall, the old expensive way"),
  ]},
  // ░░ SOLUCIÓN ANCESTRAL ░░
  { key: "ancestral", phrase: "La solución que usaban nuestros abuelos", beats: [
    c("aged", { heading: "La pared que abriga", lines: [{ text: "Quemar poco, muy caliente." }, { text: "Guardar el calor en una masa de barro." }], image: r("er_abuelo_pared", "a very old sepia photo feel of an elderly man beside a massive masonry heating wall in an old farmhouse").gen.name, _genImg: "er_abuelo_pared", _prompt: P("a very old sepia photo feel of an elderly man beside a massive masonry heating wall in an old farmhouse") }),
    c("chips", { bg: "image", image: "img/er_estufa_europa.png", imageDarken: 0.62, title: "El secreto de siempre", chips: ["Quemar poco", "Muy caliente", "Guardar en masa"], hue: "amber" }),
    r("er_estufa_europa", "a traditional european masonry tile stove (kachelofen) in an old alpine home, centuries old"),
    r("er_pared_masa", "a massive earthen thermal mass wall in an old farmhouse, thick and warm, hand worn"),
    c("callout", { image: r("er_piso_coreano", "a traditional korean ondol heated floor room, warm stone floor, old house").gen.name, figure: "2.000 años", caption: "Calentar la casa con el humo del fuego.", _genImg: "er_piso_coreano", _prompt: P("a traditional korean ondol heated floor room, warm stone floor, old house") }),
    rv("erv_brasa_barro", "embers glowing inside a thick earthen mass, heat slowly radiating, warm", { frames: 75 }),
  ]},
  // ░░ SISTEMA 1 — ROCKET: materiales ░░
  { key: "rocket_mat", phrase: "Vamos con el primer sistema", beats: [
    c("rule", { number: "01", title: "La estufa rocket de barro" }),
    r("er_ladrillos_pila", "a stack of common red clay bricks and a pile of mud mortar on the ground of a rural yard"),
    real("rb_adobe_brick", { kicker: "Adobe del propio patio" }),
    real("rb_cob_mix", { kicker: "Barro, arena y paja" }),
    r("er_tambor_metal", "an old empty 200-liter metal oil drum lying in a rural shed, rusty, reused"),
    r("er_materiales_juntos", "bricks, an old metal drum, stovepipe and a bucket of mud laid out together on the ground, ready to build"),
    c("chips", { bg: "image", image: "img/er_materiales_juntos.png", imageDarken: 0.6, title: "Casi todo recuperado", chips: ["Ladrillos / adobe", "Tambor viejo", "Caño de chapa", "Barro del patio"], hue: "amber" }),
    half("er_cano_chapa", "a length of galvanized sheet metal stovepipe leaning against a wooden wall", { kicker: "El caño de chapa" }),
  ]},
  // ░░ ROCKET: la jota de fuego / tiro ░░
  { key: "rocket_jota", phrase: "El corazón de la estufa rocket", beats: [
    c("diagram", { eyebrow: "El corazón: la jota de fuego", slides: [
      { image: dg("dg_er_jota", "Diagrama en corte de la cámara de combustión en forma de J de una estufa rocket: tubo vertical donde entra la leña, garganta horizontal (túnel de combustión), y chimenea interna vertical caliente (el riser) por donde sube la llama con fuerza. Flechas mostrando el recorrido del aire y la llama. Etiquetas: 'leña', 'túnel', 'riser caliente'."), eyebrow: "El aire entra, baja y sube con fuerza" },
      { image: dg("dg_er_tiro", "Diagrama simple mostrando el tiro fuerte de una estufa rocket: la chimenea interna caliente succiona la llama horizontalmente, combustión casi completa a 1000 grados, casi sin humo. Comparación visual: mucho calor de pocas ramitas."), eyebrow: "Quema casi completo, casi sin humo" } ] }),
    real("rb_rocket_burn", { kicker: "Suena como un cohete", hold: true }),
    real("rb_feed_twigs", { kicker: "Ramitas finas, paradas" }),
    c("annotated", { image: "er_riser_caliente", eyebrow: "El riser caliente", caption: "Acá quema casi sin humo, a 1000°", annotations: [{ kind: "arrow", x: 50, y: 34, label: "Llama hacia arriba" }], _genImg: "er_riser_caliente", _prompt: P("the inner heat riser of a rocket stove glowing hot, clean flame rising fast, almost no smoke") }),
    c("annotated", { image: r("er_jota_corte", "a clean side cutaway of a brick rocket stove J-shaped firebox, feed tube, tunnel and riser visible").gen.name, eyebrow: "La jota de fuego", caption: "El aire entra, baja y sube con fuerza", annotations: [ { kind: "arrow", x: 24, y: 30, label: "Entra la leña" }, { kind: "circle", x: 50, y: 70, label: "Túnel" }, { kind: "arrow", x: 72, y: 28, label: "Riser caliente" } ], _genImg: "er_jota_corte", _prompt: P("a clean side cutaway of a brick rocket stove J-shaped firebox, feed tube, tunnel and riser visible") }),
    r("er_ramitas_vs_tronco", "a small handful of thin twigs next to one big log on a wooden surface, size comparison"),
    r("er_chimenea_sin_humo", "a chimney top of a rocket stove emitting only faint clear heat shimmer, no smoke, clean burn"),
  ]},
  // ░░ ROCKET: tambor + banco de masa ░░
  { key: "rocket_banco", phrase: "Arriba de ese corazón", beats: [
    rav("er_tomas_tambor", "placing an upturned metal drum over the brick heat riser of a rocket mass heater he is building"),
    c("cross", { title: "El banco de masa térmica", eyebrow: "Por dónde viaja el calor", layers: [
      { label: "Tambor (calor inmediato)", color: "#A9794A", weight: 2 },
      { label: "Caño serpenteando", color: "#7C8A5A", weight: 3 },
      { label: "Banco de barro macizo", color: "#6F8478", weight: 4 },
      { label: "Chimenea (humo frío)", color: "#6E8B47", weight: 1 } ] }),
    r("er_cano_serpentea", "a stovepipe snaking back and forth inside a half-built cob bench before being covered with clay"),
    real("rb_mass_heater", { hold: true, kicker: "El banco de barro" }),
    rv("erv_mano_banco_tibio", "a hand resting on a warm earthen bench surface, feeling the gentle heat, cozy night", { frames: 75 }),
    c("stat", { value: 12, suffix: " horas", label: "sigue tibio después de que el fuego se apagó", eyebrow: "El banco de masa" }),
    rav("er_tomas_banco_sentado", "sitting relaxed on a warm earthen mass bench at night, calm, cabin lit by lamp", { hold: true, kicker: "Tibio 10-12 horas después" }),
  ]},
  // ░░ INJERTO 1 — venta suave ░░
  { key: "inject1", phrase: "uno de los", beats: [
    c("diagram", { eyebrow: "Los 35 sistemas, paso a paso", slides: [{ image: dg("dg_er_manual", "Lámina mostrando un manual/libro abierto de homestead con diagramas técnicos de medidas de una estufa, regla y lápiz al lado, estilo archivo. Transmite 'medidas exactas documentadas, paso a paso'. Sin texto legible."), eyebrow: "Las medidas exactas, en el manual" }] }),
    r("er_manual_medidas", "an open hand-drawn technical manual page with stove measurement diagrams, ruler and pencil, warm desk light, text not legible"),
  ]},
  // ░░ SEGURIDAD ░░
  { key: "seguridad", phrase: "sé lo que algunos están pensando", beats: [
    r("er_detector_co", "a small round carbon monoxide detector mounted on a wooden cabin wall, simple, practical"),
    c("checklist", { title: "Reglas que NO se negocian", items: [
      { text: "Chimenea que saca bien los gases", state: "done" },
      { text: "Detector de monóxido a pilas", state: "done" },
      { text: "Quema limpia y caliente", state: "done" } ] }),
    rav("er_tomas_chimenea", "checking a metal chimney pipe going through a cabin roof, practical safety check"),
    c("splitlist", { title: "El fuego se respeta", items: ["Quema limpia = menos monóxido", "Recorrido sellado", "Detector siempre"], palette: "G" }),
  ]},
  // ░░ SISTEMA 2 — MURO TROMBE ░░
  { key: "trombe", phrase: "El segundo sistema es para el día", beats: [
    c("rule", { number: "02", title: "El muro Trombe solar" }),
    rv("erv_sol_invierno", "bright winter sun low over a snowy field hitting the wall of a rural house, cold clear day", { frames: 90, kicker: "El sol calienta gratis" }),
    c("diagram", { eyebrow: "Cómo funciona el muro Trombe", slides: [
      { image: dg("dg_er_trombe1", "Diagrama de un muro Trombe en corte: pared maciza pintada de oscuro mirando al sol, un vidrio por delante con cámara de aire, el sol atraviesa el vidrio y carga de calor la pared oscura durante el día. Flechas de sol entrando. Etiquetas: 'sol', 'vidrio', 'muro oscuro', 'cámara de aire'."), eyebrow: "El muro se carga de sol todo el día" },
      { image: dg("dg_er_trombe2", "Diagrama del muro Trombe de noche: el muro macizo cargado devuelve el calor hacia adentro de la casa, con dos aberturas (arriba y abajo) por donde el aire circula solo: entra frío por abajo, sale tibio por arriba. Flechas de circulación de aire. Sin ventilador."), eyebrow: "De noche te lo devuelve, sin electricidad" } ] }),
    r("er_muro_oscuro", "a house wall painted dark, almost black, on the sunny side of a rural home, glass panel in front"),
    r("er_vidrio_marco", "a simple wooden-framed glass panel mounted a few centimeters in front of a dark wall, air gap visible"),
    real("rb_sun_window", { kicker: "El sol entra por el vidrio" }),
    r("er_aberturas_muro", "two vents, one high one low, in a Trombe wall, warm air rising out the top into a room"),
    c("chips", { bg: "image", image: "img/er_muro_oscuro.png", imageDarken: 0.6, title: "Combustible: el sol", chips: ["Muro oscuro", "Vidrio delante", "Cámara de aire", "Cero electricidad"], hue: "amber" }),
    c("infzoom", { images: [ { src: "img/er_muro_oscuro.png" }, { src: "img/er_vidrio_marco.png" }, { src: "img/er_aberturas_muro.png" } ] }),
    rav("er_tomas_mano_muro", "placing a palm on a dark Trombe wall at dusk feeling the stored warmth, satisfied expression", { kicker: "Caliente al atardecer, sin gastar nada" }),
  ]},
  // ░░ INJERTO 2 — anti-corporación ░░
  { key: "inject2", phrase: "le pagas a una empresa", beats: [
    c("costtally", { left: { label: "El sistema actual", note: "factura cada mes, para siempre", total: 480, bad: true }, right: { label: "Constructor Libre", note: "sol y barro, gratis", total: 0 } }),
    c("quote", { image: r("er_corporacion_factura", "a faceless utility company office building, cold corporate, grey overcast, NO readable signage").gen.name, text: "Que dejes de *depender de ellos*.", accent: "danger", _genImg: "er_corporacion_factura", _prompt: P("a faceless utility company office building, cold corporate, grey overcast, NO readable signage") }),
  ]},
  // ░░ POR DÓNDE EMPEZAR ░░
  { key: "empezar", phrase: "por dónde empiezas si en tu vida", beats: [
    c("process", { title: "Empezá chico", eyebrow: "Sin miedo", steps: [
      { title: "Estufa de prueba", desc: "4 ladrillos y una lata", image: r("er_prueba_ladrillos", "a tiny test rocket stove made of four stacked bricks and a tin can in a backyard, small flame").gen.name, _genImg: "er_prueba_ladrillos", _prompt: P("a tiny test rocket stove made of four stacked bricks and a tin can in a backyard, small flame") },
      { title: "Sentí el tiro", desc: "3 ramitas, mucho calor", image: r("er_prueba_llama", "a small strong flame roaring up from a four-brick test rocket stove, hand feeling the heat").gen.name, _genImg: "er_prueba_llama", _prompt: P("a small strong flame roaring up from a four-brick test rocket stove, hand feeling the heat") },
      { title: "La pared del sol", desc: "tu futuro muro Trombe", image: r("er_pared_sol", "a sunny exterior wall of a rural house at midday, marked spot, the future Trombe wall").gen.name, _genImg: "er_pared_sol", _prompt: P("a sunny exterior wall of a rural house at midday, the future Trombe wall") } ] }),
    c("aged", { heading: "Dale tiempo al barro", lines: [{ text: "Mi primera estufa la apuré y se rajó.", mark: true }, { text: "La segunda la dejé secar dos semanas: 15 años entera." }], image: r("er_barro_secando", "a freshly built cob rocket stove drying slowly, cracks avoided, earthen surface").gen.name, _genImg: "er_barro_secando", _prompt: P("a freshly built cob rocket stove drying, earthen surface") }),
  ]},
  // ░░ LEÑA / TAMAÑO ░░
  { key: "lena", phrase: "Dos consejos más", beats: [
    rv("erv_juntar_lena", "gathering thin fallen branches in a field after pruning, slow motion, hands picking sticks", { frames: 90, kicker: "Lo que el campo te regala" }),
    c("splitlist", { title: "La leña de la rocket", items: ["Ramitas finas y secas", "Palitos del grosor de un dedo", "NO troncos gruesos"], palette: "A" }),
    c("chips", { bg: "image", image: "img/er_banco_largo.png", imageDarken: 0.6, title: "El tamaño manda", chips: ["Pieza chica = banco corto", "Pieza grande = más masa", "En la duda, más masa"], hue: "blue" }),
    r("er_banco_largo", "a long massive cob heating bench in a larger room vs a short one in a small room, mass comparison"),
  ]},
  // ░░ PANORAMA GRANDE ░░
  { key: "panorama", phrase: "Déjame dejarte el panorama grande", beats: [
    c("stat", { value: 480, prefix: "US$ ", suffix: "/año", label: "lo que se va en gas de calefacción", eyebrow: "El gasto que no vuelve" }),
    c("headline", { tokens: ["El", "gasto", "que", "no", { t: "vuelve" }], eyebrow: "Medio año, toda la vida", bg: "image", image: r("er_billetes_humo", "money bills dissolving into smoke rising from a chimney, concept of wasted heating money").gen.name, _genImg: "er_billetes_humo", _prompt: P("money bills dissolving into smoke rising from a chimney") }),
    c("quote", { image: r("er_manos_viejas_fuego", "old weathered hands warming over a small efficient fire, dignified, rural").gen.name, text: "Los que construyeron este país lo hacían con *barro y sol*.", _genImg: "er_manos_viejas_fuego", _prompt: P("old weathered hands warming over a small efficient fire, dignified, rural") }),
  ]},
  // ░░ PLAN DE FIN DE SEMANA ░░
  { key: "plan", phrase: "esto es lo que quiero que hagas", beats: [
    c("checklist", { title: "Tu fin de semana", items: [
      { text: "Estufa de prueba (4 ladrillos)", state: "todo" },
      { text: "Encontrar la pared del sol", state: "todo" },
      { text: "Juntar ladrillos, tambor y caño", state: "todo" } ] }),
    rav("er_tomas_taller_plan", "in his workshop gathering bricks, an old drum and stovepipe, ready to build, determined"),
    c("headline", { tokens: ["No", "tenés", "que", "terminar.", "Tenés", "que", { t: "empezar" }], eyebrow: "Este fin de semana", bg: "grid", hue: "amber" }),
  ]},
  // ░░ INJERTO 3 — CTA stack ░░
  { key: "inject3", phrase: "si quieres todo esto escrito", beats: [
    c("diagram", { eyebrow: "Todo, ordenado y probado", slides: [{ image: dg("dg_er_stack", "Lámina tipo 'oferta de valor' artesanal: un manual de dos volúmenes, 50 diagramas técnicos, un plan de 90 días, calendario y bonos, apilados como una pila de valor. Estilo archivo, sin precios legibles, sin texto legible."), eyebrow: "Vale 158 — hoy 27, para siempre" }] }),
    c("bars", { title: "El valor", unit: "US$", bars: [{ label: "Por separado", value: 158, tone: "danger" }, { label: "Hoy", value: 27, winner: true }] }),
    c("quote", { image: r("er_manual_celular", "a phone showing an open ebook manual on a wooden workbench, warm light").gen.name, text: "Si no te sirve, te devuelvo *todo*. El riesgo lo pongo yo.", accent: "good", _genImg: "er_manual_celular", _prompt: P("a phone showing an open ebook manual on a wooden workbench, warm light") }),
  ]},
  // ░░ COMENTARIOS ░░
  { key: "coment", phrase: "Cuéntame en los comentarios", beats: [
    rav("er_tomas_camara", "talking warmly to camera in his workshop, inviting, friendly", { kicker: "¿Cuánto pagás de calefacción?" }),
    c("headline", { tokens: ["Contame", "de", "dónde", { t: "sos" }], eyebrow: "Leo todos los comentarios", bg: "grid", hue: "amber" }),
  ]},
  // ░░ CIERRE EMOCIONAL ░░
  { key: "cierre", phrase: "una última cosa", beats: [
    c("quote", { image: r("er_noche_banco", "a man sleeping peacefully in a warm cabin at night, glow of embers, snow outside window, serene").gen.name, text: "El calor de mi casa era *mío*. No dependía de nadie.", _genImg: "er_noche_banco", _prompt: P("a man sleeping peacefully in a warm cabin at night, glow of embers, snow outside window, serene") }),
    c("journey", { eyebrow: "Tu camino a la independencia", title: "Empezá hoy", waypoints: [
      { x: 0, y: 0, z: 0, image: r("er_j_prueba", "a four-brick test rocket stove with a small flame, first step").gen.name, label: "La estufa de prueba", num: "1", dwell: 2.6, travel: 1.6, _genImg: "er_j_prueba", _prompt: P("a four-brick test rocket stove with a small flame") },
      { x: 1.2, y: -0.4, z: 0.3, image: r("er_j_muro", "a dark Trombe wall on a sunny house wall", { }).gen.name, label: "El muro del sol", num: "2", dwell: 2.6, travel: 1.6, _genImg: "er_j_muro", _prompt: P("a dark Trombe wall on a sunny house wall") },
      { x: 2.4, y: 0.3, z: -0.2, image: r("er_j_estufa", "a finished cob rocket mass heater with bench, warm fire").gen.name, label: "La estufa grande", num: "3", dwell: 2.6, travel: 1.6, _genImg: "er_j_estufa", _prompt: P("a finished cob rocket mass heater with bench, warm fire") },
      { x: 3.6, y: -0.2, z: 0.2, image: r("er_j_libre", "a man standing content in front of his warm self-sufficient cabin in winter").gen.name, label: "Libre", num: "4", dwell: 3.0, travel: 1.4, _genImg: "er_j_libre", _prompt: P("a man content in front of his warm self-sufficient cabin in winter") } ] }),
  ]},
  // ░░ PRÓXIMO + FIRMA ░░
  { key: "proximo", phrase: "La próxima vez te voy a mostrar", beats: [
    real("rb_oven_fire", { kicker: "La próxima: el horno de barro" }),
    rav("er_tomas_firma", "looking warmly at camera at the cabin door, closing the video, golden hour", { hold: true }),
  ]},
];

// ── ANCLAJE POR FRASE ────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_estufarocket.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);
const VIDEO_END = (CW[CW.length - 1]?.s || 1160) + 2;

// resolver starts de sección por su phrase
let cursorSec = 0;
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = sec.start; continue; }
  const ms = findMs(sec.phrase, cursorSec + 1);
  sec.start = ms != null ? ms : cursorSec + 5;
  cursorSec = sec.start;
}
SECTIONS.sort((a, b) => a.start - b.start);

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b); if (!ph) return null;
    const ms = findMs(ph, start + 0.5);
    return ms != null && ms > start + 1 && ms < end - 1.5 ? ms : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.5) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i);
  fixed.push(n);
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
    const beat = { id, start: cursor, dur };
    if (b.t === "raw") {
      beat.kind = "raw";
      beat.src = b.broll ? `broll/${b.name}.mp4` : b.clip ? `vid/${b.name}.mp4` : `img/${b.name}.png`;
      beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true;
      if (b.gen) beat.gen = b.gen;
    } else if (b.t === "float") {
      beat.kind = "float"; beat.src = `img/${b.name}.png`; beat.side = b.side; beat.hue = hue; if (b.gen) beat.gen = b.gen; if (b.kicker) beat.kicker = b.kicker;
    } else if (b.t === "half") {
      beat.kind = "half"; beat.src = `img/${b.name}.png`; beat.side = b.side || "right"; beat.hue = hue; if (b.gen) beat.gen = b.gen; if (b.kicker) beat.kicker = b.kicker;
    } else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur;
      // limpiar campos auxiliares de prompt embebido
      delete beat._genImg; delete beat._prompt;
      if (beat.kind === "impact") { /* image ya es el name */ }
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (beat.kind === "journey") delete beat.accent;
      if (beat.kind !== "journey" && !beat.hue) beat.hue = hue;
    }
    beats.push(beat);
  });
}

// ── recolectar gen blocks de imágenes embebidas en props (impact/quote/headline/etc) ──
const extraImgs = [];
const scan = (o) => {
  if (!o || typeof o !== "object") return;
  if (o._genImg && o._prompt) extraImgs.push({ name: o._genImg, prompt: o._prompt });
  for (const k of Object.keys(o)) scan(o[k]);
};
SECTIONS.forEach((s) => s.beats.forEach(scan));

// strip recursivo de campos auxiliares de prompt (no deben llegar al beatsheet/cues)
const strip = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(strip); return; } delete o._genImg; delete o._prompt; delete o._note; for (const k of Object.keys(o)) strip(o[k]); };
beats.forEach(strip);
// ★ normalizar TODA `image` que sea nombre pelado → "img/<name>.png" (bug: el
// componente no encontraba la foto y se veía vacío). slides/dg_ ya traen ruta.
const fixImg = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(fixImg); return; } if (typeof o.image === "string" && !o.image.includes("/") && !o.image.includes(".")) o.image = `img/${o.image}.png`; for (const k of Object.keys(o)) { if (k === "gen") continue; fixImg(o[k]); } };
beats.forEach(fixImg);

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/estufarocket.json", JSON.stringify({ video: "estufarocket", avatar: "estufarocket_opt.mp4", beats, extraImages: extraImgs }, null, 1));

// diagramas (gpt-image-2) a su propia lista
fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync("public/img/prompts_estufarocket_diag.json", JSON.stringify(DIAGRAMS.map((d) => ({ name: d.name, prompt: d.prompt })), null, 2));

const raw = beats.filter((b) => b.kind === "raw").length;
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · diagramas: ${DIAGRAMS.length} · extraImgs: ${extraImgs.length} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
console.log("kinds:", JSON.stringify(kinds));
