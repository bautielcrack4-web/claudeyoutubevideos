// gen_medicaid.mjs — beatsheet/medicaid.json (canal "Ben retirado", look ALARMA).
// "¿Casa PAGADA? Medicaid se la QUEDA". VISUAL-PRIMERO (feedback usuario: menos texto,
// más DIBUJOS y GRÁFICAS). Anclaje por frase a captions_medicaid.json.
// Emite: beatsheet/medicaid.json · prompts_medicaid_diag.json (diagramas gpt-image-2) ·
//        public/broll/match_medicaid.json (clips reales → matchclip → fetch_clips).
import fs from "fs";

const IMPERF = "Como una foto real: imperfecciones, luz natural despareja, saturación baja, nada pulido, sin apariencia de IA.";
const P = (d) => `Foto documental realista, 16:9. ${d}. ${IMPERF}`;
const AV = "un hombre latino de unos 68 años, pelo gris, anteojos, camisa a cuadros, expresión cálida y preocupada";
const PAV = (d) => P(`${AV}, ${d}, en su casa`);
// DIAGRAMA ILUSTRADO (dibujo) — dark/alarma, iconos, MUY poco texto, esquina sup-der libre.
const DP = (d) => `Crear una ILUSTRACIÓN tipo infografía dibujada a mano pero profesional, RELACIÓN DE ASPECTO EXACTA 16:9 (1792x1024), estilo gráfico de noticias financiero de ALTO CONTRASTE. Fondo casi NEGRO, líneas blancas, acentos ROJO alarma y AMARILLO/oro, VERDE solo para lo "a salvo". ${d}. Comunicá con ICONOS y DIBUJOS simples y flechas, MÍNIMO texto (1-3 palabras por elemento, en español). DEJÁ LIBRE la esquina superior derecha (limpia) para el avatar. Se entiende en 1 segundo, premium, dramático, NADA escolar.`;

const HUES = ["red", "amber", "blue"];
const r = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: P(prompt) }, ...o });
const rav = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: PAV(prompt) }, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
const half = (name, prompt, o = {}) => ({ t: "half", name, side: "right", gen: { type: "image", name, prompt: P(prompt) }, ...o });

// CLIP REAL (movimiento) — se baja con matchclip+fetch_clips → public/broll/<name>.mp4
const CLIPS = [];
const real = (name, concept, query, o = {}) => { CLIPS.push({ name, concept, query, dur: o.dur || 5 }); return { t: "raw", name, broll: true, ...o }; };

// DIAGRAMAS ILUSTRADOS (gpt-image-2)
const DIAGRAMS = [];
const dg = (name, desc) => { if (!DIAGRAMS.find((x) => x.name === name)) DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };
const D = (name, eyebrow, desc) => c("diagram", { eyebrow, slides: [{ image: dg(name, desc), eyebrow }] });

const W = { raw: 1.3, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.2, aged: 1.4, checklist: 1.5, splitlist: 1.3, bars: 1.5, cross: 1.5, process: 1.8, journey: 2.8, infzoom: 1.4, annotated: 1.5, callout: 1.3, chips: 1.1, impact: 1.4, diagram: 2.0, float: 1.2,
  estateletter: 1.5, twomoments: 1.5, mistake: 1.4, goldvault: 1.3, lookback: 1.6, tool: 1.5, deed: 1.5, odometer: 1.4, signature: 1.7, vsmed: 1.6, action: 1.5, nextvideo: 1.4 };

const SECTIONS = [
  // ░░ HOOK ░░ — montaje rápido, movimiento real
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    real("rbc_casa_ext", "exterior of a modest suburban house, slow pan", "suburban house exterior slow", { w: 0.5 }),
    r("rb_llaves_casa", "a hand holding house keys in front of a home, ownership", { w: 0.45 }),
    c("infzoom", { images: [{ src: "img/rb_casa_pagada.png" }, { src: "img/rb_llaves_casa.png" }, { src: "img/rb_pareja_mayor_casa.png" }] }),
    c("estateletter", { amount: "$180,000", eyebrow: "Recuperación de bienes de Medicaid", label: "EL ESTADO RECLAMA", hitAt: 50 }),
    real("rbc_carta_abre", "hands opening an official letter envelope", "hands opening envelope letter", { kicker: "Una carta del gobierno", w: 0.6 }),
    D("dg_med_recovery", "Lo que hace Medicaid", "Una mano del Estado saca dinero de una casa después de una lápida (recuperación de bienes). Iconos: casa, lápida, mano con billetes."),
    c("goldvault", { state: "locked", label: "UN SOLO DOCUMENTO", caption: "El papel que la habría salvado — al final" }),
  ]},
  // ░░ BEN ░░
  { key: "benintro", phrase: "Soy Ben", beats: [
    rav("rb_ben_cocina", "sitting at his kitchen table looking at the camera, serious and warm", { kicker: "Soy Ben", hold: true }),
    real("rbc_cafe", "two coffee cups steaming on a kitchen table", "coffee cups kitchen table morning", { w: 0.6 }),
    rav("rb_ben_casa", "standing in front of his own paid-off house, calm", {}),
  ]},
  // ░░ RAFAEL — journey ░░
  { key: "rafael", phrase: "A dos casas de la mia", beats: [
    c("rule", { number: "01", title: "La historia de Don Rafael" }),
    real("rbc_barrio", "a quiet old neighborhood street, slow pan", "old neighborhood street slow pan", { w: 0.6 }),
    c("journey", { eyebrow: "Una vida entera", title: "Don Rafael", waypoints: [
      { x: 0, y: 0, z: 0, image: r("rb_rafael_fabrica", "an older latino man working in a factory decades ago, vintage").gen.name, label: "41 años trabajando", num: "1", dwell: 2.6, travel: 1.5, _genImg: "rb_rafael_fabrica", _prompt: P("an older latino man working in a factory decades ago, vintage") },
      { x: 1.3, y: -0.3, z: 0.3, image: r("rb_rafael_mecanico", "a man's greasy hands working as a mechanic, proud").gen.name, label: "Mecánico por su cuenta", num: "2", dwell: 2.6, travel: 1.5, _genImg: "rb_rafael_mecanico", _prompt: P("a man's greasy hands working as a mechanic, proud") },
      { x: 2.6, y: 0.3, z: -0.2, image: r("rb_rafael_casa", "a humble older man proud in front of his small house, sunset").gen.name, label: "Casa pagada a los 62", num: "3", dwell: 2.8, travel: 1.5, _genImg: "rb_rafael_casa", _prompt: P("a humble older man proud in front of his small house, sunset") },
      { x: 3.9, y: -0.2, z: 0.2, image: r("rb_rafael_porche", "an older man sitting on his porch with a beer, content smile, golden hour").gen.name, label: "“Es de mis hijos”", num: "4", dwell: 3.0, travel: 1.4, _genImg: "rb_rafael_porche", _prompt: P("an older man sitting on his porch with a beer, content smile, golden hour") },
    ] }),
    real("rbc_porche", "an older man relaxing on a porch, golden hour", "old man porch sunset relax", { w: 0.6 }),
    c("quote", { image: r("rb_rafael_sonrisa", "close-up of an older man's content proud smile, warm light").gen.name, text: "Ya nadie me la puede quitar. Es de *mis hijos*.", _genImg: "rb_rafael_sonrisa", _prompt: P("close-up of an older man's content proud smile, warm light") }),
  ]},
  // ░░ ALZHEIMER / ASILO ░░
  { key: "alzheimer", phrase: "le diagnosticaron Alzheimer", beats: [
    r("rb_carmen_ventana", "an elderly woman with a vacant gaze looking out a window, soft sad light", { kicker: "A Carmen le diagnosticaron Alzheimer" }),
    real("rbc_manos_ancianos", "two elderly hands holding each other tenderly", "elderly hands holding close up", { w: 0.8 }),
    r("rb_rafael_cansado", "an exhausted older man caregiver sitting tired at home, worn out", { kicker: "Rafael ya no daba abasto", w: 0.7 }),
    real("rbc_asilo", "an elderly person in a nursing home, caregiver", "elderly nursing home care room", { kicker: "Un hogar de ancianos" }),
  ]},
  // ░░ COSTO ░░
  { key: "costo", phrase: "sabe cuanto cuesta eso", beats: [
    c("odometer", { to: 100000, prefix: "$", suffix: "/año", eyebrow: "Lo que cuesta un asilo", label: "Más de 8.000 al mes. Año tras año tras año.", repeat: "AÑO TRAS AÑO" }),
    c("bars", { title: "Cuánto cuesta el cuidado", unit: "US$/mes", bars: [
      { label: "En casa", value: 6000 }, { label: "Asistida", value: 5000 }, { label: "Asilo", value: 9000, tone: "danger" } ] }),
    c("annotated", { image: "rb_factura_asilo", eyebrow: "8.000 a 10.000 al mes", caption: "Mes tras mes", annotations: [{ kind: "circle", x: 52, y: 48, label: "Cada mes" }], _genImg: "rb_factura_asilo", _prompt: P("a nursing home invoice with large numbers, stressful") }),
    real("rbc_dinero", "counting US dollar bills, money running out", "counting dollar bills money", { w: 0.7 }),
    r("rb_calendario_meses", "a wall calendar with many months marked, time and money passing", { w: 0.6 }),
  ]},
  // ░░ MEDICARE NO CUBRE ░░
  { key: "medicare", phrase: "Medicare no cubre el cuidado", beats: [
    rav("rb_ben_explica", "pointing seriously at the camera explaining, concerned", { kicker: "Medicare NO cubre el asilo" }),
    r("rb_tarjeta_medicare", "a medicare insurance card on a table, official", { w: 0.6 }),
    D("dg_med_medicare", "El primer golpe", "Comparación con iconos: tarjeta MEDICARE con una X roja grande sobre el dibujo de un asilo; tarjeta MEDICAID con un check verde sobre el asilo. Pocas palabras."),
    c("vsmed", { eyebrow: "Qué cubre cada uno", leftTitle: "MEDICARE", leftItems: [ { text: "Hospital", ok: true }, { text: "Médico", ok: true }, { text: "Asilo prolongado", ok: false } ], rightTitle: "MEDICAID", rightItems: [ { text: "Asilo prolongado", ok: true }, { text: "Solo bajos recursos", ok: false } ] }),
  ]},
  // ░░ GASTAR AHORROS ░░
  { key: "gastar", phrase: "Tiene que gastar casi todos", beats: [
    D("dg_med_spend", "El requisito", "Secuencia con iconos y flechas: una alcancía que se vacía → un formulario con check (calificar) → Medicaid paga el asilo. 3 pasos, pocas palabras."),
    c("process", { title: "Para que Medicaid pague", eyebrow: "El requisito", steps: [
      { title: "Gastar ahorros", desc: "quedar sin nada", image: r("rb_ahorros_vacios", "an empty wallet and bank statement on a table, low savings").gen.name, _genImg: "rb_ahorros_vacios", _prompt: P("an empty wallet and bank statement on a table, low savings") },
      { title: "Calificar", desc: "bajos recursos", image: r("rb_formulario_medicaid", "a medicaid application form being filled out by older hands").gen.name, _genImg: "rb_formulario_medicaid", _prompt: P("a medicaid application form being filled out by older hands") },
      { title: "Medicaid paga", desc: "el asilo", image: r("rb_asilo_pasillo", "a nursing home hallway, caregivers, clinical").gen.name, _genImg: "rb_asilo_pasillo", _prompt: P("a nursing home hallway, caregivers, clinical") } ] }),
    r("rb_cuenta_banco_baja", "a bank statement showing a near-zero balance, savings drained", { w: 0.6 }),
    r("rb_rafael_alivio", "an older man sighing in relief at a kitchen table, thinking the problem is solved", { kicker: "Pensó que lo peor pasó" }),
  ]},
  // ░░ LA CARTA $180k ░░
  { key: "carta", phrase: "llego un sobre del Estado", beats: [
    real("rbc_buzon", "a home mailbox with mail delivery", "mailbox mail delivery suburban", { kicker: "Entre las cuentas", w: 0.6 }),
    c("estateletter", { amount: "$180,000", eyebrow: "Semanas después", label: "EL ESTADO RECLAMA", hitAt: 48 }),
    c("callout", { image: r("rb_manos_temblando", "older man's trembling hands holding a letter, distress").gen.name, figure: "$180.000", caption: "Todo lo que Medicaid pagó.", accent: "danger", _genImg: "rb_manos_temblando", _prompt: P("older man's trembling hands holding a letter, distress") }),
    r("rb_casa_noche", "a small house at night, one light on, melancholic", { kicker: "Lo cobraban de la casa" }),
    r("rb_rafael_puerta", "an older distressed man knocking on a neighbor door at night, letter in hand", { w: 0.7 }),
  ]},
  // ░░ PROMESA ░░
  { key: "promesa", phrase: "le voy a explicar tres cosas", beats: [
    rav("rb_ben_promesa", "leaning toward the camera, earnest, promising to help", { kicker: "Hoy: 3 cosas" }),
    c("goldvault", { state: "locked", label: "EL ORO", caption: "Lo más importante, al final" }),
  ]},
  // ░░ SEC 1 — LA LEY ░░
  { key: "enemigo", phrase: "Empecemos por entender al enemigo", beats: [
    c("rule", { number: "", title: "El enemigo: la ley de 1993" }),
    real("rbc_capitolio", "a US government capitol building, institutional", "us capitol building government", { kicker: "Ley federal, todo el país", w: 0.7 }),
    D("dg_med_recover_what", "Qué puede recuperar", "Dibujo: una mano del Estado señalando 3 iconos que SÍ recupera — un asilo, una casa con cuidado, frascos de medicamentos. Pocas palabras."),
    c("callout", { image: "rb_oficina_medicaid", figure: "1993", caption: "Ley federal, sin excepción", _genImg: "rb_oficina_medicaid", _prompt: P("a government medicaid office desk, bureaucratic, papers") }),
  ]},
  // ░░ EDAD 55 ░░
  { key: "edad55", phrase: "a partir de los 55", beats: [
    c("stat", { value: 55, suffix: " años", label: "desde esta edad se puede recuperar", eyebrow: "El dato clave", accent: "danger", hue: "red" }),
    D("dg_med_55", "La edad gatillo", "Dibujo de una línea de edad: a la izquierda 'antes de 55' con un escudo VERDE (a salvo); a la derecha 'desde 55' en ROJO (en juego). Una persona mayor y un calendario."),
    c("callout", { image: "rb_jubilados_banco", figure: "55+", caption: "A los jubilados nos toca de lleno", _genImg: "rb_jubilados_banco", _prompt: P("older retirees sitting on a park bench, everyday seniors") }),
  ]},
  // ░░ CASA = OBJETIVO ░░
  { key: "objetivo", phrase: "la casa pagada es", beats: [
    D("dg_med_target", "El primer objetivo", "Dibujo: una casa con una DIANA / mira roja encima — es el primer blanco del Estado. Icono de casa + objetivo rojo."),
    c("annotated", { image: r("rb_casa_mira", "a modest house exterior, dramatic evening light").gen.name, eyebrow: "El primer objetivo", caption: "La que más te costó", annotations: [{ kind: "circle", x: 50, y: 55, label: "Tu casa" }], _genImg: "rb_casa_mira", _prompt: P("a modest house exterior, dramatic evening light") }),
    real("rbc_firma_papeles", "older hands signing official papers", "hands signing documents pen close", { kicker: "Está en la letra chica", w: 0.7 }),
  ]},
  // ░░ SEC 2 — EL MITO ░░
  { key: "mito", phrase: "Su casa esta exenta", beats: [
    rav("rb_ben_mito", "explaining with a raised finger, clarifying a misunderstanding", { kicker: "“Su casa está exenta”" }),
    c("headline", { tokens: ["Exenta", "no", "es", { t: "protegida" }], eyebrow: "El malentendido", bg: "image", image: "img/rb_casa_pagada.png", hue: "red" }),
  ]},
  // ░░ DOS MOMENTOS ░░
  { key: "dosmomentos", phrase: "El primer momento es mientras", beats: [
    c("twomoments", { eyebrow: "La misma casa, distinto momento", leftLabel: "MIENTRAS VIVE", leftSub: "Exenta · intocable", rightLabel: "AL FALLECER", rightSub: "En la mira del Estado" }),
    real("rbc_casa_atardecer", "a house at dusk, light fading", "house exterior dusk sunset", { w: 0.6 }),
    r("rb_casa_sol", "a house in bright daylight, safe warm feeling", { w: 0.5 }),
    r("rb_casa_sombra", "a similar house in cold shadow, ominous", { w: 0.5 }),
    c("quote", { image: r("rb_casa_dia_noche", "a house exterior at dusk, half light half shadow, conceptual").gen.name, text: "Misma casa. *Distinto destino*.", _genImg: "rb_casa_dia_noche", _prompt: P("a house exterior at dusk, half light half shadow, conceptual") }),
  ]},
  // ░░ PROBATE ░░
  { key: "probate", phrase: "se llama probate", beats: [
    D("dg_med_probate", "Por dónde te cobran", "Dibujo: una casa que pasa por una caja llamada 'herencia' donde una mano del Estado la agarra, VS una casa con una flecha verde que SALTA por encima y va directo a los hijos (a salvo)."),
    real("rbc_tribunal", "a courthouse building exterior", "courthouse building exterior", { w: 0.7 }),
  ]},
  // ░░ VARÍA POR ESTADO ░░
  { key: "estados", phrase: "Lo que es verdad en Florida", beats: [
    r("rb_mapa_usa", "a map of the united states, several states highlighted, news graphic style", { kicker: "Cada estado, distinto" }),
    c("chips", { bg: "image", image: "img/rb_mapa_usa.png", imageDarken: 0.6, title: "Las reglas cambian", chips: ["Florida", "Texas", "California"], hue: "blue" }),
  ]},
  // ░░ CTA ESTADO ░░
  { key: "cta_estado", phrase: "de que estado me esta viendo", beats: [
    rav("rb_ben_cta1", "warmly asking the viewer a question, friendly, inviting comments", { kicker: "¿De qué estado me ves?" }),
    real("rbc_comentarios", "a hand typing a comment on a phone", "typing comment on phone", { w: 0.6 }),
  ]},
  // ░░ SEC 3 — ERRORES ░░
  { key: "errores_intro", phrase: "que errores la activan", beats: [
    c("rule", { number: "02", title: "Los errores que entregan la casa" }),
    D("dg_med_errores", "4 errores", "Dibujo en grilla de 4 cuadros con iconos y X rojas: 1) casa con flecha a un hijo, 2) maletas (mudarse), 3) un reloj (no hacer nada), 4) dos personas charlando (mal consejo). Números 1-4."),
  ]},
  { key: "error1", phrase: "Le pongo la casa a nombre", beats: [
    c("mistake", { number: "1", title: "Poner la casa a nombre de un hijo", desc: "La trampa más cruel.", eyebrow: "ERROR" }),
    c("lookback", { eyebrow: "El período de revisión", title: "5 años hacia atrás", flags: ["Casa a un hijo", "Regalar dinero", "Vender barato"] }),
    r("rb_padre_hijo_casa", "an older parent and adult child in front of a house, transfer concept", { w: 0.6 }),
    real("rbc_penalidad", "a worried older person reading a denial letter", "senior reading bad news letter", { kicker: "Te penalizan meses o años", w: 0.7 }),
  ]},
  { key: "error2", phrase: "El segundo error es mudarse", beats: [
    c("mistake", { number: "2", title: "Mudarte y dejar la casa sin avisar", desc: "Deja de ser tu vivienda principal.", eyebrow: "ERROR" }),
    real("rbc_mudanza", "moving boxes in an empty house", "moving boxes empty house", { w: 0.6 }),
  ]},
  { key: "error3", phrase: "El tercer error es el mas silencioso", beats: [
    c("mistake", { number: "3", title: "No hacer nada", desc: "Cuando llega, las puertas se cerraron.", eyebrow: "ERROR" }),
    real("rbc_reloj", "an old clock ticking on a wall", "old wall clock ticking", { kicker: "El error de Rafael", w: 0.6 }),
  ]},
  { key: "error4", phrase: "el cuarto error", beats: [
    c("mistake", { number: "4", title: "Creerle a quien no sabe", desc: "Cada caso es distinto.", eyebrow: "ERROR" }),
  ]},
  // ░░ CTA SUB ░░
  { key: "cta_sub", phrase: "suscribase al canal", beats: [
    rav("rb_ben_sub", "warmly inviting the viewer to subscribe, hand near chest, sincere", { kicker: "De jubilado a jubilado" }),
  ]},
  // ░░ SOLUCIONES ░░
  { key: "soluciones", phrase: "vamos a las soluciones reales", beats: [
    c("goldvault", { state: "open", label: "EL ORO", caption: "Lo que protege tu casa" }),
    rav("rb_ben_soluciones", "leaning in, hopeful and serious, about to reveal solutions", { kicker: "Ahora sí: qué hacer" }),
    c("bars", { title: "Tu casa en riesgo", unit: "%", bars: [ { label: "Sin plan", value: 100, tone: "danger" }, { label: "Con plan a tiempo", value: 5, winner: true } ] }),
  ]},
  // ░░ ELDER LAW ░░
  { key: "elderlaw", phrase: "Elder Law Attorney", beats: [
    real("rbc_abogado", "a lawyer at a desk with a client, handshake", "elder law attorney office meeting", { kicker: "Un abogado de Elder Law" }),
    c("quote", { image: r("rb_mapa_camino", "a simple road map drawn on paper, the path forward").gen.name, text: "Yo te doy el *mapa*.", accent: "good", _genImg: "rb_mapa_camino", _prompt: P("a simple road map drawn on paper, the path forward") }),
  ]},
  // ░░ TOOL 1 — FIDEICOMISO ░░
  { key: "tool1", phrase: "fideicomiso irrevocable", beats: [
    c("tool", { number: "1", nameEs: "Fideicomiso irrevocable", nameEn: "Medicaid Asset Protection Trust", how: "La casa entra al fideicomiso, vos seguís viviendo, y el Estado no la toca.", eyebrow: "Herramienta" }),
    D("dg_med_trust", "Cómo blinda la casa", "Dibujo: una casa DENTRO de un escudo/caja fuerte ('fideicomiso'), la persona vive adentro feliz, y una mano del Estado REBOTA contra el escudo. Verde = protegido."),
    r("rb_documento_trust", "a legal trust document on a desk, official, important", { w: 0.6 }),
    r("rb_persona_mayor_casa_feliz", "an older person living happily in their own home, secure", { kicker: "Seguís viviendo en ella", w: 0.7 }),
  ]},
  // ░░ TOOL 2 — LADY BIRD ░░
  { key: "tool2", phrase: "Lady Bird", beats: [
    c("tool", { number: "2", nameEs: "Escritura de patrimonio vital", nameEn: "Lady Bird Deed", how: "Vivís en la casa, y al morir pasa directo a tus hijos sin herencia.", eyebrow: "Herramienta" }),
    D("dg_med_ladybird", "El salto", "Dibujo: una casa con una flecha verde curva que SALTA por encima de la caja 'herencia/probate' y aterriza en dos hijos. Una firma. Verde a salvo."),
    c("deed", { title: "ESCRITURA", stampText: "FUERA DEL ALCANCE", caption: "Un documento. Una firma.", hitAt: 54 }),
    real("rbc_firma", "a hand signing a property deed with a pen", "signing property deed pen", { w: 0.7 }),
    c("quote", { image: r("rb_rafael_papel", "an older man holding a single important document, relief").gen.name, text: "El papel que *salvaba* a Rafael.", accent: "good", _genImg: "rb_rafael_papel", _prompt: P("an older man holding a single important document, relief") }),
  ]},
  // ░░ TOOL 3 — HIJO CUIDADOR ░░
  { key: "tool3", phrase: "excepcion del hijo cuidador", beats: [
    c("tool", { number: "3", nameEs: "Excepción del hijo cuidador", nameEn: "Caregiver Child Exemption", how: "Un hijo que vivió 2+ años cuidándote puede recibir la casa sin penalidad.", eyebrow: "Herramienta" }),
    D("dg_med_caregiver", "Premia el amor", "Dibujo cálido: un hijo cuidando a un padre anciano en casa (2 años), y luego recibiendo la LLAVE de la casa. Un corazón. Verde."),
    real("rbc_caregiver", "an adult child caring for an elderly parent at home", "adult child caring elderly parent home", { kicker: "Dejó su vida para cuidarte", w: 0.8 }),
  ]},
  // ░░ OTRAS PROTECCIONES ░░
  { key: "otras", phrase: "Si usted tiene un conyuge", beats: [
    c("checklist", { title: "Otras protecciones", items: [
      { text: "Cónyuge en la casa", state: "done" },
      { text: "Hijo menor de 21 o con discapacidad", state: "done" },
      { text: "Hermano que vivió ahí", state: "done" },
      { text: "Dificultad excesiva (pedirla)", state: "done" } ] }),
    c("cross", { title: "Capas que protegen tu casa", eyebrow: "Las defensas", layers: [
      { label: "Cónyuge en la casa", color: "#1FBF4F", weight: 2 },
      { label: "Hijo cuidador", color: "#37B6FF", weight: 2 },
      { label: "Fideicomiso", color: "#FFC400", weight: 3 },
      { label: "Lady Bird Deed", color: "#1FBF4F", weight: 2 } ] }),
    r("rb_pareja_mayor_sofa", "an elderly couple sitting together on a sofa at home, tender", { w: 0.6 }),
    real("rbc_familia", "a multigenerational family together at home", "multigenerational family home warm", { w: 0.7 }),
  ]},
  // ░░ PASO CONCRETO ░░
  { key: "paso", phrase: "Busque en su zona un abogado", beats: [
    c("action", { eyebrow: "Esta semana", step: "Llamá a un abogado de Elder Law", question: "Tengo mi casa pagada, ¿cómo la protejo de Medicaid en mi estado?" }),
    real("rbc_telefono", "an older person making a phone call at home", "senior making phone call home", { w: 0.7 }),
    D("dg_med_act", "No es el dinero, es el tiempo", "Dibujo de dos relojes: uno VERDE 'sano y temprano = gana', otro ROJO 'enfermo y tarde = pierde'. Flecha del tiempo."),
  ]},
  // ░░ RECAP ░░
  { key: "recap", phrase: "Hagamos un repaso rapido", beats: [
    c("checklist", { title: "Repaso", items: [
      { text: "Medicaid reclama la casa al morir", state: "done" },
      { text: "Exenta ≠ protegida", state: "done" },
      { text: "Regalarla sale mal (5 años)", state: "done" },
      { text: "Fideicomiso · Lady Bird · hijo cuidador", state: "done" } ] }),
    real("rbc_rafael_salvado", "an older man smiling relieved in front of his house", "older man happy in front of house", { kicker: "Rafael conservó la casa", w: 0.8 }),
  ]},
  // ░░ FIRMA ░░
  { key: "firma", phrase: "el dinero no se gana de nuevo", beats: [
    c("signature", { eyebrow: "Para que te quede", lines: [
      { text: "En la jubilación" }, { text: "el dinero no se gana de nuevo," }, { text: "solo se deja de perder.", gold: true } ] }),
  ]},
  // ░░ CTA FINAL ░░
  { key: "cta_final", phrase: "ya tenia idea de que el estado", beats: [
    rav("rb_ben_cta2", "warmly asking the viewer a final question, curious, kind", { kicker: "¿Ya lo sabías?" }),
  ]},
  // ░░ TEASE ░░
  { key: "tease", phrase: "otra trampa todavia mas silenciosa", beats: [
    c("nextvideo", { kicker: "Próximo video", title: "La trampa de la viuda", sub: "Un impuesto que cae sobre el que queda." }),
  ]},
  // ░░ OUTRO ░░
  { key: "outro", phrase: "Cuidese, cuide lo suyo", beats: [
    rav("rb_ben_outro", "warm goodbye to camera at home, kind smile, golden hour", { hold: true, kicker: "Soy Ben, de Ben retirado" }),
  ]},
];

// ── ANCLAJE POR FRASE ────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_medicaid.json", "utf8"));
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1300) + 2;

let cursorSec = 0;
for (const s of SECTIONS) {
  if (s.start != null) { cursorSec = s.start; continue; }
  const ms = findMs(s.phrase, cursorSec + 1);
  if (ms == null) console.warn(`⚠ frase no encontrada: "${s.phrase}" (sección ${s.key})`);
  s.start = ms != null ? ms : cursorSec + 5;
  cursorSec = s.start;
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
    const dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`;
    const hue = b.hue || HUES[(si + i) % HUES.length];
    const beat = { id, start: cursor, dur };
    if (b.t === "raw") {
      beat.kind = "raw";
      beat.src = b.broll ? `broll/${b.name}.mp4` : b.clip ? `vid/${b.name}.mp4` : `img/${b.name}.png`;
      beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true;
      if (b.gen) beat.gen = b.gen;
    } else if (b.t === "half") {
      beat.kind = "half"; beat.src = `img/${b.name}.png`; beat.side = b.side || "right"; beat.hue = hue; if (b.gen) beat.gen = b.gen; if (b.kicker) beat.kicker = b.kicker;
    } else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur;
      delete beat._genImg; delete beat._prompt; delete beat.concept; delete beat.query;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (beat.kind === "journey") delete beat.accent;
      if (beat.kind !== "journey" && !beat.hue) beat.hue = hue;
    }
    beats.push(beat);
  });
}

const extraImgs = [];
const scan = (o) => { if (!o || typeof o !== "object") return; if (o._genImg && o._prompt) extraImgs.push({ name: o._genImg, prompt: o._prompt }); for (const k of Object.keys(o)) scan(o[k]); };
SECTIONS.forEach((s) => s.beats.forEach(scan));

const strip = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(strip); return; } delete o._genImg; delete o._prompt; for (const k of Object.keys(o)) strip(o[k]); };
beats.forEach(strip);
const fixImg = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(fixImg); return; } if (typeof o.image === "string" && !o.image.includes("/") && !o.image.includes(".")) o.image = `img/${o.image}.png`; for (const k of Object.keys(o)) { if (k === "gen") continue; fixImg(o[k]); } };
beats.forEach(fixImg);

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/medicaid.json", JSON.stringify({ video: "medicaid", avatar: "medicaid_opt.mp4", beats, extraImages: extraImgs }, null, 1));
fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync("public/img/prompts_medicaid_diag.json", JSON.stringify(DIAGRAMS.map((d) => ({ name: d.name, prompt: d.prompt })), null, 2));
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync("public/broll/match_medicaid.json", JSON.stringify(CLIPS, null, 1));

const raw = beats.filter((b) => b.kind === "raw").length;
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const long = beats.filter((b) => b.dur > 12).length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · diagramas: ${DIAGRAMS.length} · clips: ${CLIPS.length} · extraImgs: ${extraImgs.length} · dur: ${dur.toFixed(0)}s (${(dur / 60).toFixed(1)}min) · beats>12s: ${long}`);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
console.log("kinds:", JSON.stringify(kinds));
