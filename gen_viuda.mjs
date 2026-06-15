// gen_viuda.mjs — beatsheet/viuda.json (canal "Ben retirado", look ALARMA). Video 2:
// "La trampa de la viuda" (la penalidad fiscal del cónyuge sobreviviente). VISUAL-PRIMERO:
// KeyPhrase en frases clave + PNGs flotando (FloatingProp/PngDiorama) + componentes a medida.
// Sync MILIMÉTRICO: ancla a captions_viuda_aligned.json (forced alignment) si existe.
// Ritmo en OLAS: ráfagas (w bajo) → toma sostenida (hold) → tensión (avatar full+push-in en Main).
import fs from "fs";

const IMPERF = "Como una foto real: imperfecciones, luz natural despareja, saturación baja, nada pulido, sin apariencia de IA.";
const P = (d) => `Foto documental realista, 16:9. ${d}. ${IMPERF}`;
const AV = "un hombre latino de unos 68 años, pelo gris, anteojos, camisa a cuadros, expresión cálida";
const PAV = (d) => P(`${AV}, ${d}, en su casa`);
const DP = (d) => `Crear una ILUSTRACIÓN tipo infografía dibujada a mano profesional, 16:9 EXACTO (1792x1024), gráfico de noticias financiero ALTO CONTRASTE. Fondo casi NEGRO, líneas blancas, acentos ROJO alarma y AMARILLO/oro, VERDE solo para "a salvo". ${d}. Iconos y dibujos simples, flechas, MÍNIMO texto (1-3 palabras, español). DEJÁ LIBRE la esquina superior derecha para el avatar. Se entiende en 1 segundo, premium, dramático.`;
// PNG recortado transparente (para FloatingProp/PngDiorama)
const PP = (d) => `${d}. Objeto AISLADO sobre FONDO TRANSPARENTE (PNG cutout, sin fondo, sin escenario), iluminación de estudio suave, sombra propia mínima, recorte limpio de bordes, estilo realista premium 3D/render limpio.`;

const HUES = ["red", "amber", "blue"];
const r = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: P(prompt) }, ...o });
const rav = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: PAV(prompt) }, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });

const CLIPS = [];
const real = (name, concept, query, o = {}) => { CLIPS.push({ name, concept, query, dur: o.dur || 5 }); return { t: "raw", name, broll: true, ...o }; };
// reusa un clip YA bajado (no lo registra en CLIPS → no re-corre matchclip)
const clip = (name, o = {}) => ({ t: "raw", name, broll: true, ...o });
const DIAGRAMS = [];
const dg = (name, desc) => { if (!DIAGRAMS.find((x) => x.name === name)) DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };
const D = (name, eyebrow, desc) => c("diagram", { eyebrow, slides: [{ image: dg(name, desc), eyebrow }] });
const PROPS = [];
const prop = (name, desc) => { if (!PROPS.find((x) => x.name === name)) PROPS.push({ name, prompt: PP(desc) }); return `img/${name}.png`; };
// helpers de los componentes nuevos
const kp = (text, o = {}) => c("keyphrase", { text, ...o }); // frase clave
// FloatingProp: el PNG transparente SIEMPRE flota SOBRE un clip real blureado (nunca sobre
// fondo vacío). Si no se pasa bg, se asigna uno de un pool rotativo de clips ya bajados.
let fpi = 0;
const FP_BG = ["vc_pareja_feliz", "vc_calculadora", "vc_irs_form", "vc_persona_sola", "vc_pareja_charla", "vc_pareja_cafe", "vc_manos_pareja", "vc_ss_oficina"];
const fp = (name, desc, o = {}) => { prop(name, desc); return c("floatprop", { src: `img/${name}.png`, ...o, bg: o.bg || `broll/${FP_BG[fpi++ % FP_BG.length]}.mp4` }); };

const W = { raw: 1.3, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.2, aged: 1.4, checklist: 1.5, splitlist: 1.3, bars: 1.5, cross: 1.5, process: 1.8, journey: 2.8, infzoom: 1.4, annotated: 1.5, callout: 1.3, chips: 1.1, impact: 1.4, diagram: 2.0, float: 1.2,
  estateletter: 1.5, twomoments: 1.5, mistake: 1.4, goldvault: 1.3, lookback: 1.6, tool: 1.5, deed: 1.5, odometer: 1.4, signature: 1.7, vsmed: 1.6, action: 1.5, nextvideo: 1.4, keyphrase: 1.4, statpills: 1.4, floatprop: 1.5, diorama: 1.6 };

const SECTIONS = [
  // ░░ HOOK ░░ — PRIMER MINUTO DINÁMICO: ráfagas de clips + keyphrases + componentes, cortes rápidos
  { key: "hook", phrase: null, start: 1.4, beats: [
    c("talk", {}), // avatar abre ~1.5s
    clip("vc_pareja_feliz", { w: 0.4 }),
    kp("Si tu *PAREJA* falta…", { src: "broll/vc_pareja_feliz.mp4", w: 0.45 }),
    clip("vc_sello_gov", { w: 0.4, at: "una sorpresa del gobierno" }),
    kp("Una sorpresa del *gobierno*", { src: "broll/vc_sello_gov.mp4", w: 0.45 }),
    kp("*MILES* por año, toda la vida", { src: "broll/vc_calculadora.mp4", w: 0.45, at: "miles de dolares por año" }),
    clip("vc_persona_sola", { w: 0.4, at: "termina pagando mas impuestos" }),
    c("statpills", { pills: ["MENOS ingreso", "MÁS impuesto"], slider: false }),
    clip("vc_viuda_ventana", { w: 0.4, at: "la penalidad de la viuda" }),
    kp("La *penalidad de la viuda*", { src: "img/vd_viuda_sola.png", w: 0.5 }),
    clip("vc_manos_pareja", { w: 0.4, at: "una vecina a la que quiero" }),
    kp("Se podía *evitar*", { src: "broll/vc_pareja_cafe.mp4", w: 0.45, at: "se podia evitar" }),
    clip("vc_irs_form", { w: 0.4, at: "un papel que casi ningun asesor" }),
    c("goldvault", { state: "locked", label: "UNA DECISIÓN", caption: "Tomada a tiempo, salva decenas de miles — al final" }),
  ]},
  // ░░ BEN ░░
  { key: "benintro", phrase: "Soy Ben", beats: [
    rav("vd_ben_cocina", "sitting at his kitchen table, warm and serious, talking to camera", { kicker: "Soy Ben", hold: true }),
    kp("Lo primero que pensé fue en *mi esposa*", { src: "img/vd_ben_cocina.png", blur: true, w: 0.7 }),
  ]},
  { key: "tieprev", phrase: "vieron mi video sobre la casa", beats: [
    fp("vd_casa_prop", "a small house model next to a shield", { caption: "Aquel video: *la casa*", accent: "good", scale: 0.8 }),
    kp("Este: *la persona* que se queda", { src: "img/vd_ben_cocina.png", w: 0.7 }),
  ]},
  // ░░ ELENA — anécdota (journey de la pareja) ░░
  { key: "elena", phrase: "vivía doña Elena", beats: [
    c("rule", { number: "01", title: "Elena y Manuel" }),
    c("journey", { dark: true, eyebrow: "46 años juntos", title: "Elena y Manuel", waypoints: [
      { x: 0, y: 0, z: 0, image: r("vd_pareja_joven", "an older latino couple as a young married couple decades ago, vintage photo").gen.name, label: "Se casaron jóvenes", num: "1", dwell: 2.6, travel: 1.5, _genImg: "vd_pareja_joven", _prompt: P("an older latino couple as a young married couple decades ago, vintage photo") },
      { x: 1.3, y: -0.3, z: 0.3, image: r("vd_cartero", "an older man as a mailman / postal worker, proud, vintage").gen.name, label: "Él, cartero", num: "2", dwell: 2.5, travel: 1.5, _genImg: "vd_cartero", _prompt: P("an older man as a mailman postal worker, proud, vintage") },
      { x: 2.6, y: 0.3, z: -0.2, image: r("vd_pareja_casa", "an older latino couple proud in front of their modest paid-off house, sunset").gen.name, label: "La casa pagada", num: "3", dwell: 2.7, travel: 1.5, _genImg: "vd_pareja_casa", _prompt: P("an older latino couple proud in front of their modest paid-off house, sunset") },
      { x: 3.9, y: -0.2, z: 0.2, image: r("vd_pareja_porche", "an older couple holding hands on a porch, content, golden hour").gen.name, label: "“Hicimos los números”", num: "4", dwell: 2.9, travel: 1.4, _genImg: "vd_pareja_porche", _prompt: P("an older couple holding hands on a porch, content, golden hour") },
    ] }),
    real("vc_manos_pareja", "two elderly hands holding each other, wedding rings", "elderly couple holding hands rings", { w: 0.7 }),
    c("infzoom", { images: [{ src: "img/vd_pareja_joven.png" }, { src: "img/vd_pareja_casa.png" }, { src: "img/vd_pareja_porche.png" }] }),
  ]},
  // ░░ MANUEL FALLECE ░░
  { key: "manuel", phrase: "Manuel falleció", beats: [
    r("vd_silla_vacia", "an empty armchair by a window, soft melancholic light, absence", { kicker: "Una primavera", hold: true }),
    real("vc_viuda_ventana", "an elderly widow looking out a window, melancholic", "elderly woman alone window sad", { w: 0.8 }),
    kp("Ella creyó que del dinero iba a estar *bien*", { src: "img/vd_silla_vacia.png", w: 0.7 }),
  ]},
  // ░░ EL GOLPE FISCAL ░░
  { key: "shock", phrase: "Su contador le dijo", beats: [
    fp("vd_papeles_impuestos", "a stack of tax documents and a calculator", { caption: "“Vas a pagar *MÁS*”", accent: "accent" }),
    c("annotated", { image: r("vd_form_1040", "a US 1040 tax form with numbers, single filer, highlighted total").gen.name, eyebrow: "El mismo formulario", caption: "Ahora como soltera", annotations: [{ kind: "circle", x: 60, y: 45, label: "MÁS impuesto" }], _genImg: "vd_form_1040", _prompt: P("a US 1040 tax form with numbers, single filer, highlighted total") }),
    kp("¿*Más*? Si ahora entra *menos*…", { src: "img/vd_viuda_sola.png", w: 0.7 }),
  ]},
  // ░░ SEC: LA TRAMPA — filing status ░░
  { key: "trampa", phrase: "Empecemos por entender la trampa", beats: [
    rav("vd_ben_explica", "explaining seriously, raised finger, concerned", { kicker: "El primer golpe" }),
    real("vc_irs_form", "irs tax forms being filled, pen, close up", "irs tax form filling pen", { w: 0.5 }),
    D("dg_vd_filing", "Cómo te clasifican", "Dibujo: dos figuras (pareja) con una etiqueta 'CASADOS' en verde y tramos anchos; una flecha al lado a UNA figura sola con etiqueta 'SOLTERO' en rojo y tramos angostos."),
    real("vc_sello_gov", "a government stamp on a document", "government stamp document official", { w: 0.5 }),
  ]},
  { key: "pareja", phrase: "declaran impuestos como pareja", beats: [
    kp("Casados = tramos *anchos*, deducción *grande*", { src: "img/vd_pareja_porche.png", w: 0.8 }),
    real("vc_pareja_feliz", "an older married couple smiling together at home", "happy older married couple home", { w: 0.7 }),
  ]},
  { key: "soltero", phrase: "Pasa a declarar como una sola", beats: [
    c("twomoments", { eyebrow: "El mismo dinero, otra categoría", leftLabel: "EN PAREJA", leftSub: "Tramos anchos · deducción doble", rightLabel: "SOLTERO/A", rightSub: "Tramos a la mitad" }),
    real("vc_persona_sola", "a single elderly person sitting alone at a table with papers", "elderly person alone table papers", { w: 0.55 }),
    kp("No te bajan a la mitad: te cambian las *reglas en contra*", { src: "img/vd_papeles_impuestos.png", w: 0.7 }),
  ]},
  // ░░ DEDUCCIÓN A LA MITAD ░░
  { key: "deduccion", phrase: "La deducción estándar", beats: [
    c("statpills", { pills: ["$30,000", "$15,000"], accent: "accent" }),
    c("bars", { title: "Deducción estándar", unit: "US$", bars: [ { label: "En pareja", value: 30000, tone: "good" }, { label: "Soltero/a", value: 15000, tone: "danger" } ] }),
    c("callout", { image: r("vd_deduccion_doc", "a tax deduction worksheet, pencil, numbers").gen.name, figure: "−50%", caption: "La deducción, a la mitad", accent: "danger", _genImg: "vd_deduccion_doc", _prompt: P("a tax deduction worksheet, pencil, numbers") }),
    kp("Perdió *la mitad* de la deducción", { src: "img/vd_viuda_sola.png", w: 0.6 }),
  ]},
  // ░░ TRAMOS / TASA ░░
  { key: "tramos", phrase: "esos mismos escalones son la mitad", beats: [
    D("dg_vd_brackets", "Los escalones de impuestos", "Dibujo de escalones: para pareja los escalones son anchos (verde); para soltero la mitad de anchos (rojo) → el mismo ingreso sube de escalón. Flecha de 12% a 22%."),
    c("bars", { title: "El mismo ingreso, la tasa", unit: "%", bars: [ { label: "En pareja", value: 12, tone: "good" }, { label: "Soltero/a", value: 22, tone: "danger" } ] }),
    c("callout", { image: "vd_form_1040", figure: "22%", caption: "La tasa de soltero", accent: "danger" }),
    kp("No le subió el ingreso. Le subió *la tasa*.", { src: "img/vd_papeles_impuestos.png", w: 0.7 }),
  ]},
  // ░░ SEGURO SOCIAL (3er golpe) ░░
  { key: "ss", phrase: "Viene el tercer golpe", beats: [
    rav("vd_ben_ss", "pointing, serious, this hurts the most expression", { kicker: "El tercer golpe", w: 0.7 }),
    real("vc_ss_oficina", "a social security administration office sign or building", "social security administration office", { w: 0.5 }),
    D("dg_vd_ss", "Los dos cheques", "Dibujo: una casa que recibe DOS cheques del Seguro Social (uno grande, uno chico). Una flecha: al morir uno, queda SOLO el grande; el chico desaparece (X roja)."),
    c("statpills", { pills: ["2 cheques", "1 cheque"], slider: false }),
    real("vc_cheque", "a social security check / government check close up", "social security check government", { w: 0.7 }),
    c("callout", { image: r("vd_dos_cheques", "two social security checks on a table, one larger one smaller").gen.name, figure: "−1 cheque", caption: "Desaparece el más chico", accent: "danger", _genImg: "vd_dos_cheques", _prompt: P("two social security checks on a table, one larger one smaller") }),
    kp("Pierde *un tercio* de lo que entraba", { src: "img/vd_viuda_sola.png", w: 0.6 }),
  ]},
  { key: "resumen3", phrase: "Menos ingreso, más impuesto", beats: [
    kp("*Menos* ingreso. *Más* impuesto. Esa es la trampa.", { src: "broll/vc_calculadora.mp4", fontSize: 84 }),
    real("vc_calculadora", "hands using a calculator with bills and tax papers", "hands calculator bills taxes", { w: 0.7 }),
  ]},
  // ░░ CTA "los dos" ░░
  { key: "cta_dos", phrase: "escríbame aquí abajo en los comentarios", beats: [
    rav("vd_ben_cta1", "warmly asking the viewer to comment, friendly", { kicker: "Escriban “los dos”" }),
  ]},
  // ░░ IRMAA (4to golpe) ░░
  { key: "irmaa", phrase: "Hay un cuarto golpe", beats: [
    c("mistake", { number: "4°", title: "El recargo de Medicare (IRMAA)", desc: "El límite para soltero es casi la mitad → el mismo ingreso lo cruza.", eyebrow: "GOLPE" }),
    real("vc_medicare", "a medicare card and medical bills", "medicare card medical bills", { w: 0.7 }),
    c("callout", { image: "vd_deduccion_doc", figure: "÷2", caption: "El límite, a la mitad", accent: "danger" }),
  ]},
  // ░░ RMD (5to golpe) ░░
  { key: "rmd", phrase: "hay un quinto golpe", beats: [
    fp("vd_alcancia", "a piggy bank / retirement savings jar labeled IRA", { caption: "Retiros *obligatorios*, tasa de soltero", accent: "accent", scale: 0.8 }),
    kp("El ahorro se vuelve, en parte, una *carga*", { src: "img/vd_papeles_impuestos.png", w: 0.7 }),
  ]},
  // ░░ TODO JUNTO ░░
  { key: "todojunto", phrase: "Ahora ponga todo junto", beats: [
    c("checklist", { title: "La penalidad de la viuda", items: [
      { text: "Pierde un cheque del Seguro Social", state: "done" },
      { text: "Deducción a la mitad", state: "done" },
      { text: "Salta a un tramo más alto", state: "done" },
      { text: "Medicare más caro", state: "done" },
      { text: "Retiros obligatorios más gravados", state: "done" } ] }),
    c("bars", { title: "Lo que entra al hogar", unit: "%", bars: [ { label: "Con los dos", value: 100, tone: "good" }, { label: "Cuando queda uno", value: 65, tone: "danger" } ] }),
    kp("Todo, por pasar de *dos* a *una*", { src: "img/vd_viuda_sola.png", w: 0.6 }),
  ]},
  // ░░ PROMESA ░░
  { key: "promesa", phrase: "Hoy le voy a explicar tres cosas", beats: [
    rav("vd_ben_promesa", "earnest, leaning in, promising to help", { kicker: "Hoy: 3 cosas" }),
    c("goldvault", { state: "locked", label: "EL ORO", caption: "Lo más importante, al final" }),
  ]},
  // ░░ ERRORES ░░
  { key: "errores", phrase: "Vamos con los errores", beats: [
    c("rule", { number: "02", title: "Los errores que lo empeoran" }),
    real("vc_pareja_preocupada", "an older couple looking worried at paperwork", "older couple worried paperwork", { w: 0.7 }),
  ]},
  { key: "error1", phrase: "El primer error", beats: [
    c("mistake", { number: "1", title: "“Ya hicimos los números”", desc: "Pero los hicieron para DOS, no para el que queda solo.", eyebrow: "ERROR" }),
    real("vc_pareja_mesa", "an older couple doing finances at a kitchen table", "older couple finances kitchen table", { w: 0.7 }),
  ]},
  { key: "error2", phrase: "El segundo error es esperar", beats: [
    c("mistake", { number: "2", title: "Esperar", desc: "Casi todo solo se puede hacer mientras los DOS viven.", eyebrow: "ERROR" }),
    fp("vd_reloj", "an hourglass running out of sand", { caption: "Las puertas se *cierran*", accent: "accent", scale: 0.7 }),
  ]},
  { key: "error3", phrase: "El tercer error es tener todo", beats: [
    c("mistake", { number: "3", title: "Todo en cuentas sin gravar", desc: "Le dejás al que queda la cuenta más cara.", eyebrow: "ERROR" }),
    fp("vd_cuenta_pesada", "a retirement account jar overflowing with a tax weight on top", { caption: "La cuenta *más cara*", accent: "accent", scale: 0.7 }),
  ]},
  { key: "error4", phrase: "el cuarto error", beats: [
    c("mistake", { number: "4", title: "No hablarlo en pareja", desc: "El que queda no solo está de duelo: está perdido.", eyebrow: "ERROR" }),
    real("vc_pareja_charla", "an older couple talking seriously at home", "older couple serious talk home", { w: 0.7 }),
  ]},
  // ░░ CTA SUB ░░
  { key: "cta_sub", phrase: "suscríbase al canal", beats: [
    rav("vd_ben_sub", "warmly inviting to subscribe, hand near chest", { kicker: "De jubilado a jubilado" }),
  ]},
  // ░░ SOLUCIONES ░░
  { key: "soluciones", phrase: "vamos a las soluciones reales", beats: [
    c("goldvault", { state: "open", label: "EL ORO", caption: "Lo que protege al que queda" }),
    rav("vd_ben_sol", "hopeful, serious, about to reveal solutions", { kicker: "Ahora sí: qué hacer" }),
  ]},
  // ░░ TOOL 1 — ROTH (la decisión estrella) ░░
  { key: "tool1", phrase: "conversión a Roth", beats: [
    c("tool", { number: "1", nameEs: "Conversión a Roth", nameEn: "Roth Conversion", how: "Mientras los dos viven (tasa barata), pasás de a poco el ahorro a una cuenta Roth: libre de impuestos para siempre.", eyebrow: "Herramienta" }),
    D("dg_vd_roth", "Cómo blinda al que queda", "Dibujo: dinero que pasa de una cuenta 'tradicional' (gravada) a una cuenta 'ROTH' libre de impuestos, mientras hay DOS figuras (pareja, tasa 12% verde). Flecha: el sobreviviente lo usa sin pagar."),
    c("bars", { title: "Pagar el impuesto…", unit: "%", bars: [ { label: "Hoy, en pareja", value: 12, tone: "good", winner: true }, { label: "Mañana, viuda sola", value: 22, tone: "danger" } ] }),
    c("process", { title: "Cómo se hace", eyebrow: "Con tiempo", steps: [
      { title: "Cuenta tradicional", desc: "sin gravar", image: r("vd_cuenta_trad", "a traditional IRA retirement account statement").gen.name, _genImg: "vd_cuenta_trad", _prompt: P("a traditional IRA retirement account statement") },
      { title: "Convertir de a poco", desc: "años en pareja, tasa baja", image: r("vd_conversion", "money moving between two account jars, conversion concept").gen.name, _genImg: "vd_conversion", _prompt: P("money moving between two account jars, conversion concept") },
      { title: "Cuenta Roth", desc: "libre de impuestos", image: r("vd_roth", "a Roth account labeled, green checkmark, tax-free").gen.name, _genImg: "vd_roth", _prompt: P("a Roth account labeled, green checkmark, tax free") } ] }),
    kp("Hacelo con *5 años* de anticipación", { src: "img/vd_pareja_porche.png", w: 0.7 }),
  ]},
  // ░░ TOOL 2 — llenar escalones ░░
  { key: "tool2", phrase: "llenar los escalones bajos", beats: [
    c("tool", { number: "2", nameEs: "Llenar los escalones bajos", nameEn: "Bracket filling", how: "En los años de ingreso bajo, sacás un poco a tasa barata en vez de dejar el escalón vacío.", eyebrow: "Herramienta" }),
    kp("Pagás *barato hoy*, no caro mañana", { src: "img/vd_pareja_porche.png", w: 0.7 }),
  ]},
  // ░░ TOOL 3 — donación calificada ░░
  { key: "tool3", phrase: "donación calificada", beats: [
    c("tool", { number: "3", nameEs: "Donación calificada (QCD)", nameEn: "Qualified Charitable Distribution", how: "Donás directo desde la cuenta de retiro: no cuenta como ingreso y baja los retiros obligatorios.", eyebrow: "Herramienta" }),
    fp("vd_corazon", "a hand giving a heart / charity donation symbol", { accent: "good", scale: 0.6 }),
  ]},
  // ░░ TOOL 4 — seguro de vida ░░
  { key: "tool4", phrase: "un seguro de vida pensado", beats: [
    c("tool", { number: "4", nameEs: "Seguro de vida con cabeza", nameEn: "Life insurance", how: "Algo que el día que uno falte le dé al que queda una cantidad libre de impuestos, para tapar el cheque perdido.", eyebrow: "Herramienta" }),
    fp("vd_paraguas", "an umbrella protecting a small house and a person, shelter symbol", { caption: "Tapa el *cheque perdido*", accent: "good", scale: 0.7 }),
  ]},
  // ░░ TOOL 5 — estrategia SS ░░
  { key: "tool5", phrase: "La estrategia del seguro social", beats: [
    c("tool", { number: "5", nameEs: "Estrategia del Seguro Social", nameEn: "Claiming strategy", how: "El que ganó más espera hasta los 70: su cheque crece, y crece el que hereda el sobreviviente. Gratis.", eyebrow: "Herramienta" }),
    D("dg_vd_ss70", "Esperar hasta los 70", "Dibujo de una línea/escalera de edad 62→67→70 donde el cheque del Seguro Social CRECE en cada paso (flecha verde hacia arriba); el de 70 es el más grande y es el que hereda el sobreviviente."),
  ]},
  // ░░ PASO CONCRETO ░░
  { key: "paso", phrase: "el paso concreto", beats: [
    c("action", { eyebrow: "Esta semana", step: "Siéntense los dos con un café", question: "Si mañana falta uno de los dos, ¿cómo le quedan las cuentas al que se queda?" }),
    c("annotated", { image: "vd_pareja_porche", eyebrow: "La mejor protección", caption: "Hablarlo HOY, los dos", annotations: [{ kind: "circle", x: 50, y: 50, label: "Juntos" }], _genImg: "vd_pareja_porche", _prompt: P("an older couple holding hands on a porch, content, golden hour") }),
    real("vc_pareja_cafe", "an older couple talking over coffee at a table", "older couple coffee table talk", { w: 0.7 }),
    real("vc_abogado_pareja", "an older couple meeting a financial advisor at a desk", "older couple financial advisor meeting", { w: 0.6 }),
    kp("No es el dinero. Es el *tiempo*.", { src: "img/vd_pareja_porche.png", w: 0.7 }),
  ]},
  // ░░ RECAP ░░
  { key: "recap", phrase: "Hagamos un repaso rápido", beats: [
    c("splitlist", { title: "Pareja vs. el que queda", items: ["Deducción doble → a la mitad", "Tramos anchos → angostos", "Dos cheques → uno"], palette: "D", cross: true }),
    c("checklist", { title: "Repaso", items: [
      { text: "De pareja a soltero = deducción a la mitad + tramos angostos", state: "done" },
      { text: "Se pierde un cheque del Seguro Social", state: "done" },
      { text: "Medicare más caro + retiros más gravados", state: "done" },
      { text: "Arma: Roth, orden de cuentas, estrategia de SS", state: "done" } ] }),
  ]},
  // ░░ FIRMA ░░
  { key: "firma", phrase: "el dinero no se gana de nuevo", beats: [
    c("signature", { eyebrow: "Para que te quede", lines: [
      { text: "En la jubilación" }, { text: "el dinero no se gana de nuevo," }, { text: "solo se deja de perder.", gold: true } ] }),
    kp("Cuidarle las cuentas al que queda es decir *te amo*", { src: "img/vd_pareja_porche.png", w: 0.8 }),
  ]},
  // ░░ CTA FINAL ░░
  { key: "cta_final", phrase: "ya sabía que pasar de pareja a soltero", beats: [
    rav("vd_ben_cta2", "warm final question to the viewer, curious", { kicker: "¿Lo sabías?" }),
  ]},
  // ░░ TEASE ░░
  { key: "tease", phrase: "una última trampa en esta cadena", beats: [
    c("nextvideo", { kicker: "Próximo video", title: "La regla de los 10 años", sub: "Lo que el IRS hace con tu cuenta de retiro cuando la heredan tus hijos." }),
  ]},
  // ░░ OUTRO ░░
  { key: "outro", phrase: "Cuídese, cuide lo suyo", beats: [
    rav("vd_ben_outro", "warm goodbye, kind smile, golden hour", { hold: true, kicker: "Soy Ben, de Ben retirado" }),
  ]},
];

// ── ANCLAJE POR FRASE (usa captions ALINEADAS si existen → sync milimétrico) ──
const CAP_PATH = fs.existsSync("public/captions_viuda_aligned.json") ? "public/captions_viuda_aligned.json" : "public/captions_viuda.json";
const CAPS = JSON.parse(fs.readFileSync(CAP_PATH, "utf8"));
console.log("captions:", CAP_PATH);
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
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null) || (b.t === "keyphrase" && b.text ? b.text.replace(/\*/g, "") : null);
// ★ tiempos por palabra (sync milimétrico): devuelve el segundo de inicio de CADA palabra
// de la frase si aparece verbatim en las captions alineadas (si no, null → paso fijo).
const findWords = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after - 0.5) continue;
    let ok = true; for (let jx = 0; jx < p.length; jx++) if (CW[i + jx].t !== p[jx]) { ok = false; break; }
    if (ok) return p.map((_, jx) => CW[i + jx].s);
  }
  return null;
};
const VIDEO_END = (CW[CW.length - 1]?.s || 1360) + 2;

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
  // J-CUT: anclar beats de texto (keyphrase/quote) a su frase, ~0.3s ANTES (audio adelanta)
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b); if (!ph) return null;
    const ms = findMs(ph, start + 0.5);
    return ms != null && ms > start + 1 && ms < end - 1.5 ? Math.max(start + 0.5, ms - 0.3) : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.2) pin[i] = null; else lastPin = pin[i]; } }
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
      beat.kind = "raw"; beat.src = b.broll ? `broll/${b.name}.mp4` : `img/${b.name}.png`;
      beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true;
      if (b.gen) beat.gen = b.gen;
    } else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur;
      delete beat._genImg; delete beat._prompt; delete beat.concept; delete beat.query; delete beat.broll;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (beat.kind === "journey") delete beat.accent;
      if (beat.kind !== "journey" && !beat.hue) beat.hue = hue;
    }
    // ★ KeyPhrase: tiempos por palabra desde captions alineadas (sync milimétrico)
    if (beat.kind === "keyphrase" && beat.text) {
      const ws = findWords(beat.text.replace(/\*/g, ""), beat.start - 0.6);
      if (ws) beat.times = ws.map((s) => Math.max(0, Math.round((s - beat.start) * 30)));
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

// ★ A/C — ROMPER beats largos (texto/diagrama que se "sientan") insertando un CLIP de
// relleno de los ya bajados → ritmo dinámico, sin huecos muertos. (El usuario afina en Studio.)
const FILLER = ["vc_pareja_feliz", "vc_calculadora", "vc_persona_sola", "vc_manos_pareja", "vc_irs_form", "vc_sello_gov", "vc_cheque", "vc_pareja_mesa", "vc_pareja_charla", "vc_ss_oficina", "vc_abogado_pareja", "vc_pareja_preocupada", "vc_viuda_ventana", "vc_pareja_cafe"];
const TEXTY = new Set(["keyphrase", "floatprop", "statpills", "callout"]);
let fi = 0; const broken = [];
for (const b of beats) {
  broken.push(b);
  const cap = b.kind === "diagram" ? 11 : 7;
  if ((b.kind === "diagram" || TEXTY.has(b.kind)) && b.dur > cap + 2.5) {
    const fillStart = +(b.start + cap).toFixed(2);
    const fillDur = +(b.dur - cap).toFixed(2);
    b.dur = cap;
    broken.push({ id: `${b.id}_fill`, start: fillStart, dur: fillDur, kind: "raw", src: `broll/${FILLER[fi++ % FILLER.length]}.mp4`, hue: b.hue || "red" });
  }
}
beats.length = 0; beats.push(...broken);

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/viuda.json", JSON.stringify({ video: "viuda", avatar: "viuda_opt.mp4", beats, extraImages: extraImgs }, null, 1));
fs.mkdirSync("public/img", { recursive: true }); fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync("public/img/prompts_viuda_diag.json", JSON.stringify(DIAGRAMS.map((d) => ({ name: d.name, prompt: d.prompt })), null, 2));
fs.writeFileSync("public/img/prompts_viuda_props.json", JSON.stringify(PROPS.map((d) => ({ name: d.name, prompt: d.prompt, transparent: true })), null, 2));
fs.writeFileSync("public/broll/match_viuda.json", JSON.stringify(CLIPS, null, 1));

const raw = beats.filter((b) => b.kind === "raw").length;
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const long = beats.filter((b) => b.dur > 12).length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · diag: ${DIAGRAMS.length} · props: ${PROPS.length} · clips: ${CLIPS.length} · dur: ${dur.toFixed(0)}s (${(dur / 60).toFixed(1)}min) · >12s: ${long}`);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
console.log("kinds:", JSON.stringify(kinds));
