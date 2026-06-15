// gen_hormiga.mjs — beatsheet/hormiga.json (canal "Ben retirado", look ALARMA). Video 4:
// "Los gastos hormiga que se comen tu jubilación". TEMA UNIVERSAL hispano (sin
// instituciones de un país: "el banco", "la tarjeta", genérico). Clon de gen_estafas:
// sync milimétrico (captions ALINEADAS), KeyPhrase palabra-por-palabra, PNGs flotando,
// 8 "HORMIGAS" (MistakeCard), el MÉTODO como process/checklist/tool, journeys oscuros.
import fs from "fs";

const IMPERF = "Como una foto real: imperfecciones, luz natural despareja, saturación baja, nada pulido, sin apariencia de IA.";
const P = (d) => `Foto documental realista, 16:9. ${d}. ${IMPERF}`;
const AV = "un hombre latino de unos 68 años, pelo gris, anteojos, camisa a cuadros, expresión cálida";
const PAV = (d) => P(`${AV}, ${d}, en su casa`);
const DP = (d) => `Crear una ILUSTRACIÓN tipo infografía/captura dibujada a mano profesional, 16:9 EXACTO (1792x1024), gráfico financiero ALTO CONTRASTE. Fondo casi NEGRO, líneas blancas, acentos ROJO alarma, AMARILLO/oro (dinero) y VERDE (recuperado/a salvo). ${d}. Iconos y dibujos simples, flechas, MÍNIMO texto (1-4 palabras, español). DEJÁ LIBRE la esquina superior derecha para el avatar. Se entiende en 1 segundo, premium.`;
const PP = (d) => `${d}. Objeto AISLADO sobre FONDO TRANSPARENTE (PNG cutout, sin fondo, sin escenario), iluminación de estudio suave, sombra propia mínima, recorte limpio, estilo realista premium 3D/render limpio.`;

const HUES = ["red", "amber", "blue"];
const r = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: P(prompt) }, ...o });
const rav = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: PAV(prompt) }, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
const CLIPS = [];
const real = (name, concept, query, o = {}) => { if (!CLIPS.find((x) => x.name === name)) CLIPS.push({ name, concept, query, dur: o.dur || 5 }); return { t: "raw", name, broll: true, ...o }; };
const clip = (name, o = {}) => ({ t: "raw", name, broll: true, ...o });
const DIAGRAMS = [];
const dg = (name, desc) => { if (!DIAGRAMS.find((x) => x.name === name)) DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };
const D = (name, eyebrow, desc, at) => c("diagram", { eyebrow, slides: [{ image: dg(name, desc), eyebrow }], ...(at ? { at } : {}) });
const PROPS = [];
const prop = (name, desc) => { if (!PROPS.find((x) => x.name === name)) PROPS.push({ name, prompt: PP(desc) }); return `img/${name}.png`; };
const RAWEXTRA = [];
const ri = (name, desc) => { if (!RAWEXTRA.find((x) => x.name === name)) RAWEXTRA.push({ name, prompt: P(desc) }); return `img/${name}.png`; };
let fpi = 0;
const FP_BG = ["hc_papeles", "hc_monedas", "hc_telefono_apps", "hc_calendario", "hc_alcancia", "hc_tijera", "hc_hormigas", "hc_gimnasio"];
const fp = (name, desc, o = {}) => { prop(name, desc); return c("floatprop", { src: `img/${name}.png`, ...o, bg: o.bg || `broll/${FP_BG[fpi++ % FP_BG.length]}.mp4` }); };
const kp = (text, o = {}) => c("keyphrase", { text, ...o });

const W = { raw: 1.25, keyphrase: 1.15, talk: 1.0, rule: 1.1, diagram: 1.7, floatprop: 1.4, mistake: 1.5, goldvault: 1.3, splitlist: 1.4, tool: 1.6, checklist: 1.5, action: 1.5, signature: 1.7, nextvideo: 1.4, statpills: 1.2, journey: 2.6, annotated: 1.7, callout: 1.6, bars: 1.6, process: 1.8, odometer: 1.5 };

// clips de fondo/relleno (FP_BG + FILLER) → registrar TODOS
real("hc_hormigas", "macro of ants crawling on a table, closeup", "ants crawling closeup macro");
real("hc_canilla", "a dripping faucet, a single water drop falling, closeup", "dripping faucet water drop closeup");
real("hc_gimnasio", "an empty gym, treadmills, nobody", "empty gym treadmills nobody");
real("hc_monedas", "hands counting coins and small bills on a table, closeup", "hands counting coins money closeup");
real("hc_telefono_apps", "a phone screen scrolling through apps and subscriptions", "phone screen apps subscriptions scrolling");
real("hc_calendario", "a wall calendar, pages turning, closeup", "wall calendar pages turning closeup");
real("hc_alcancia", "a piggy bank with coins, saving money, closeup", "piggy bank coins saving closeup");
real("hc_tijera", "scissors cutting a credit card, closeup", "scissors cutting credit card closeup");

const SECTIONS = [
  // ════ HOOK ════
  { key: "hook", phrase: null, start: 1.5, beats: [
    c("talk", {}),
    kp("No te lo roban de golpe. Te lo *gotean*.", { w: 0.5 }),
    real("hc_papeles", "an older person at a kitchen table reviewing paper bills and statements", "older person reviewing bills paperwork table", { w: 0.45, at: "todos los meses con su propio permiso" }),
    kp("Cobros tan *chiquitos* que ni los mirás", { src: "broll/hc_papeles.mp4", w: 0.5, at: "ni se molesta en mirarlos" }),
    c("statpills", { pills: ["EN SILENCIO", "TODOS LOS MESES"], slider: false, at: "todos los meses ano tras ano" }),
    real("hc_hormigas", "macro of ants crawling, closeup", "ants crawling closeup", { w: 0.45, at: "les dicen gastos hormiga" }),
    fp("hb_hormiga_billete", "a single ant carrying a coin / a small bill", { caption: "Una hormiga es *nada*…", accent: "amber", scale: 0.55, at: "una hormiga sola no es nada" }),
    kp("…pero un año entero te *vacían la alacena*", { src: "broll/hc_hormigas.mp4", w: 0.5, at: "no le queda nada" }),
    c("goldvault", { state: "locked", label: "EL MÉTODO", caption: "Una tarde para cazarlas a todas — al final", at: "le voy a dar el metodo" }),
    kp("Una tarde, un lápiz y *tres preguntas*", { src: "broll/hc_papeles.mp4", w: 0.45, at: "una tarde un lapiz y tres preguntas" }),
  ]},
  // ════ BEN ════
  { key: "benintro", phrase: "yo soy ben soy jubilado", beats: [
    rav("hb_ben_camara", "talking warmly to camera, honest and caring", { kicker: "Soy Ben, también jubilado", hold: true }),
    kp("Me senté a hacer una cuenta que me dio *vergüenza*", { src: "img/hb_ben_camara.png", w: 0.6, at: "una cuenta que me dio verguenza" }),
    kp("Hoy te muestro dónde se *esconden*", { src: "broll/hc_papeles.mp4", w: 0.5, at: "donde se esconden" }),
    kp("Y al final, el *método* para cazarlas a todas", { src: "broll/hc_papeles.mp4", w: 0.5, at: "le voy a dar el metodo" }),
    kp("La plata que no se pierde es plata que se *gana*", { src: "broll/hc_monedas.mp4", w: 0.55, at: "la plata que no se pierde" }),
  ]},
  // ════ ANÉCDOTA BEN ════
  { key: "anecben", phrase: "dejeme contarle mi historia", beats: [
    c("rule", { number: "", title: "La tarde de la vergüenza" }),
    real("hc_papeles", "an older man reading credit card statements line by line at a table, lamp light", "man reading statements table lamp", { w: 0.5, at: "me puse a leer renglon por renglon" }),
    kp("Empecé a *encontrar cosas*", { src: "broll/hc_papeles.mp4", w: 0.5, at: "empece a encontrar cosas" }),
    // journey: lo que encontró (dark)
    c("journey", { dark: true, eyebrow: "Renglón por renglón, lo que aparecía", accent: "amber", waypoints: [
      { x: 0, y: 0, image: ri("hb_j_serie", "a tv streaming service on a screen, unused, dusty remote"), label: "Una serie que vi hace 2 años", num: "1", dwell: 2.3, travel: 1.3 },
      { x: 1.3, y: -0.3, image: ri("hb_j_musica", "a music app on a phone, never opened"), label: "Música que ni sabía que tenía", num: "2", dwell: 2.3, travel: 1.3 },
      { x: 2.6, y: 0.3, image: ri("hb_j_seguro", "an insurance fine print document, a phone call"), label: "Un “seguro” que dije sí por teléfono", num: "3", dwell: 2.4, travel: 1.3 },
      { x: 3.9, y: -0.2, image: ri("hb_j_frio", "an older man staring shocked at a number on paper"), label: "Sumé todo… y me dejó frío", num: "4", dwell: 2.6, travel: 1.3 } ] }),
    kp("Nadie me robó. Yo les firmé el *permiso*.", { src: "img/hb_ben_camara.png", w: 0.6, at: "les firme el permiso" }),
  ]},
  // ════ DON TITO ════
  { key: "tito", phrase: "le cuento la de un amigo", beats: [
    r("hb_tito", "an older latino man, neat and organized, sure of himself, at home", { kicker: "Don Tito, “lo tengo todo controlado”", w: 0.7 }),
    kp("Ordenado. De los que *anotan todo*.", { src: "img/hb_tito.png", w: 0.45, at: "de los que anotan todo" }),
    kp("“A mí no, Ben. Yo tengo todo *controlado*.”", { src: "img/hb_tito.png", w: 0.55, at: "yo tengo todo controlado" }),
    c("journey", { dark: true, eyebrow: "Don Tito, el “ordenado”", accent: "accent", waypoints: [
      { x: 0, y: 0, image: ri("hb_t_seguro2", "a confident organized older man who pays on time"), label: "“Lo tengo todo controlado”", num: "1", dwell: 2.2, travel: 1.2 },
      { x: 1.3, y: -0.3, image: ri("hb_t_papeles", "an older man sitting down with his statements, surprised"), label: "Se sentó con los papeles", num: "2", dwell: 2.3, travel: 1.3 },
      { x: 2.6, y: 0.2, image: ri("hb_almacenamiento", "a cloud storage icon on a phone, empty, unused, dusty"), label: "4 años por una caja vacía", num: "3", dwell: 2.4, travel: 1.3 },
      { x: 3.9, y: -0.2, image: ri("hb_t_frio", "an organized older man shocked, couldn't believe it"), label: "“No se podía creer”", num: "4", dwell: 2.4, travel: 1.2 } ], at: "habia encontrado que pagaba" }),
    kp("Le pasa al *desprolijo* y al más *cuidadoso*", { src: "img/hb_tito.png", w: 0.55, at: "le pasa al desprolijo" }),
  ]},
  // ════ POR QUÉ NOS PEGA ════
  { key: "porque", phrase: "los que ya peinamos canas", beats: [
    rav("hb_ben_explica", "explaining seriously, raised finger, three reasons", { kicker: "Por qué a nosotros nos pega más" }),
    c("process", { eyebrow: "Tres razones", title: "Por qué nos pega más fuerte", steps: [
      { title: "Ingreso fijo", desc: "lo que se va, no vuelve" },
      { title: "Años acumulando", desc: "15, 20 servicios viejos" },
      { title: "Todo es automático", desc: "lo que no se ve, no se controla" } ], at: "vivimos con un ingreso fijo" }),
    kp("Cada peso que se escapa, *no se repone*", { src: "broll/hc_monedas.mp4", w: 0.5, at: "no se repone nunca" }),
    kp("Podés tener *15, 20* servicios viejos", { src: "broll/hc_telefono_apps.mp4", w: 0.5, at: "15 20 repartidas por todos lados" }),
    kp("Lo que no se *ve*, no se *controla*", { src: "broll/hc_telefono_apps.mp4", w: 0.55, at: "lo que no se ve no se controla" }),
  ]},
  // ════ 8 HORMIGAS ════
  { key: "cat1", phrase: "el primero el mas comun", beats: [
    c("mistake", { number: "1", title: "Suscripciones acumuladas", desc: "Películas, música, apps, revistas. La contrataste por algo puntual y te olvidaste.", eyebrow: "HORMIGA" }),
    c("annotated", { image: dg("dg_hb_resumen", "Captura de un resumen de tarjeta/banco, alto contraste, varios renglones. Tres cobros repetidos idénticos están RODEADOS con círculo rojo. Texto simulado genérico: 'servicio', 'suscripción', mismo monto cada mes."), eyebrow: "Tu resumen", caption: "Lo mismo, todos los meses", annotations: [
      { kind: "circle", x: 0.5, y: 0.4, w: 0.32, label: "Se repite cada mes" } ], at: "todos los meses por igual" }),
    c("splitlist", { title: "La señal", items: ["Mismo monto, todos los meses", "No lo abriste en 2-3 meses", "Si no lo usás, no lo necesitás"], palette: "D", cross: true, at: "si no lo uso en tres meses" }),
  ]},
  { key: "cat2", phrase: "el segundo es hermano", beats: [
    c("mistake", { number: "2", title: "La prueba “gratis” que se renueva sola", desc: "“Gratis por un mes”… pero te piden la tarjeta. Cuando te olvidás, empieza a cobrar.", eyebrow: "HORMIGA" }),
    c("annotated", { image: dg("dg_hb_renovacion", "Línea de tiempo simple: 'GRATIS 1 mes' (verde) → flecha → 'se cobra SOLO' (rojo) sin avisar. Iconos de calendario y tarjeta."), eyebrow: "Cómo te agarran", caption: "Gratis hasta que te olvides", annotations: [
      { kind: "arrow", x: 0.72, y: 0.5, fromX: 0.3, fromY: 0.5, label: "y ahí, para siempre" } ], at: "se empieza a cobrar solo" }),
    c("splitlist", { title: "La señal: prueba gratis", items: ["Es “gratis”… pero piden la tarjeta", "Cuando te olvidás, empieza a cobrar", "Sin avisar, sin preguntar de nuevo"], palette: "D", cross: true, at: "le pidan la tarjeta" }),
  ]},
  { key: "cat3", phrase: "el tercero son los servicios duplicados", beats: [
    c("mistake", { number: "3", title: "Servicios duplicados", desc: "Dos de películas, dos para guardar fotos, dos seguros que cubren lo mismo. Plata doble.", eyebrow: "HORMIGA" }),
    real("hc_telefono_apps", "two streaming apps on a phone screen, redundant", "two streaming apps phone screen", { w: 0.45, at: "plata tirada dos veces" }),
    c("splitlist", { title: "La señal: duplicado", items: ["Dos servicios que hacen lo mismo", "Casi todo está en uno solo", "El otro lo regalás cada mes"], palette: "D", cross: true, at: "si tiene dos servicios que hacen practicamente lo mismo" }),
  ]},
  { key: "cat4", phrase: "el cuarto son las membresias", beats: [
    c("mistake", { number: "4", title: "Membresías que ya no usás", desc: "El gimnasio de enero, el club, la cuota anual. Pagás por la culpa de no ir.", eyebrow: "HORMIGA" }),
    real("hc_gimnasio", "an empty gym with treadmills, nobody using it", "empty gym treadmills nobody", { w: 0.45, at: "no pisa desde febrero" }),
    c("splitlist", { title: "La pregunta honesta", items: ["¿Cuántas veces fui en el año?", "Si es “casi nunca”…", "Pagás la culpa de no ir, no el uso"], palette: "D", cross: true, at: "cuantas veces lo use en el ultimo ano" }),
  ]},
  { key: "cat5", phrase: "el quinto son los extras", beats: [
    c("mistake", { number: "5", title: "Los “extras” y “premium” pegados", desc: "Protecciones, garantías, seguros que te sumaron sin pedirlos. Te sacan un poquito siempre.", eyebrow: "HORMIGA" }),
    fp("hb_etiqueta_extra", "a price tag that says PREMIUM stuck on something", { caption: "“Protección”, “premium”, “plus”…", accent: "amber", scale: 0.55, at: "premium plus seguro de" }),
    c("callout", { image: ri("hb_letra_chica", "fine print contract with an extra add-on charge highlighted"), figure: "“premium” · “plus” · “seguro de”", caption: "Lo que no buscaste activamente", accent: "amber", at: "que usted no recuerde haber buscado activamente" }),
  ]},
  { key: "cat6", phrase: "el sexto son los cargos", beats: [
    c("mistake", { number: "6", title: "Comisiones del banco que nadie pregunta", desc: "“Mantenimiento”, “administración”. Muchas se bajan o se sacan… si lo pedís.", eyebrow: "HORMIGA" }),
    c("callout", { image: ri("hb_comision", "a bank statement with a confusing fee line highlighted"), figure: "¿Qué es esto?", caption: "Si no entendés un cargo, preguntá", accent: "cold", at: "cargo fijo del banco que usted no entienda" }),
  ]},
  { key: "cat7", phrase: "el septimo el mas invisible", beats: [
    c("mistake", { number: "7", title: "Aumentos automáticos silenciosos", desc: "El precio sube de a poquito, una vez al año. Nunca lo notás… hasta que comparás.", eyebrow: "HORMIGA" }),
    kp("Lo que pagás *hoy* vs cuando lo *contrataste*", { src: "broll/hc_monedas.mp4", w: 0.5, at: "compara lo que paga hoy" }),
    c("splitlist", { title: "La señal: aumento silencioso", items: ["Un servicio viejo, de hace años", "Que nunca volviste a mirar", "El precio subió de a poquito"], palette: "D", cross: true, at: "cualquier servicio viejo" }),
  ]},
  { key: "cat8", phrase: "el octavo", beats: [
    c("mistake", { number: "8", title: "Servicios compartidos sin dueño", desc: "El plan familiar, lo que se pagaba “entre varios”. Termina pagándolo usted solo.", eyebrow: "HORMIGA" }),
    real("hc_telefono_apps", "a phone showing a family phone plan with several lines", "family phone plan screen lines", { w: 0.45, at: "el plan del telefono que abarca a toda la familia" }),
    c("callout", { image: ri("hb_familia_plan", "a family phone plan bill, several lines, unclear who pays"), figure: "“Es de todos”…", caption: "…y al final lo paga usted solo", accent: "accent", at: "termina siendo de su bolsillo" }),
  ]},
  // ════ LA CUENTA ════
  { key: "cuenta", phrase: "que es la cuenta", beats: [
    rav("hb_ben_cuenta", "explaining the math, intense, pointing", { kicker: "La cuenta que nos ganan", hold: true }),
    c("bars", { eyebrow: "La cosita chica…", title: "…por 12, por los años", unit: "x", bars: [
      { label: "Un mes", value: 1, display: "1", tone: "good" },
      { label: "Un año", value: 12, display: "×12" },
      { label: "Cinco años", value: 60, display: "×60", winner: true } ], at: "multipliquela ahora por los anos" }),
    c("odometer", { to: 60, suffix: " cobros", eyebrow: "Lo que no mirás", label: "cobritos al año, repitiéndose", repeat: "y el año que viene, otra vez", at: "no le pega un golpe le hace un goteo" }),
    D("dg_hb_goteo", "El goteo llena el balde", "Una canilla goteando una GOTA (moneda) que cae a un balde. El balde, con el año, está LLENO de monedas. Texto: 'una gota por mes = un balde por año'. Amarillo/oro.", "una canilla que pierde una gota"),
    kp("Nunca ves el *balde lleno*. Solo la gota.", { src: "broll/hc_canilla.mp4", w: 0.55, at: "usted nunca ve el balde lleno" }),
    c("cross", { eyebrow: "Hoy lo traemos a la mesa", title: "El balde, de una vez", hue: "amber", layers: [
      { label: "La gota que ves (un mes)", color: "#FFC400", weight: 1 },
      { label: "Lo que se juntó (un año)", color: "#E11507", weight: 4 } ], marker: { label: "el balde lleno", atDepth: 0.5, color: "accent" }, at: "ir a buscar ese balde" }),
  ]},
  // ════ NO TE SIENTAS MAL ════
  { key: "nosientas", phrase: "no quiero que se sienta mal", beats: [
    rav("hb_ben_apoyo", "reassuring kind expression, no blame", { kicker: "No es ser distraído", hold: true }),
    kp("No es ser *distraído*. Está armado para que no mires.", { src: "img/hb_ben_apoyo.png", w: 0.55, at: "no es un problema de ser distraido" }),
    kp("El que *mira*, encuentra. El que no, *regala*.", { src: "img/hb_ben_apoyo.png", w: 0.6, at: "el que mira encuentra" }),
  ]},
  // ════ CTA ════
  { key: "ctashare", phrase: "quiero pedirle dos cosas", beats: [
    rav("hb_ben_share", "warmly asking to share, caring gesture", { kicker: "Mandáselo a quien vive con lo justo" }),
    kp("¿Cuántos servicios pagás *ahora mismo*? Adiviná.", { src: "img/hb_ben_share.png", w: 0.55, at: "cuantos servicios automaticos cree que esta pagando" }),
  ]},
  { key: "ctasub", phrase: "suscribase al canal", beats: [
    rav("hb_ben_sub", "warmly inviting to subscribe, hand near chest", { kicker: "De jubilado a jubilado" }),
  ]},
  // ════ EL MÉTODO (oro) ════
  { key: "metodo", phrase: "el metodo la tarde de la caceria", beats: [
    c("goldvault", { state: "open", label: "EL MÉTODO", caption: "La tarde de la cacería de hormigas" }),
    c("process", { eyebrow: "En una tarde, sin apps", title: "La cacería, paso a paso", steps: [
      { title: "Juntá tus resúmenes", desc: "banco + tarjeta, 3 meses" },
      { title: "Marcá lo que se repite", desc: "mismo nombre, mismo monto" },
      { title: "Hacé 3 preguntas", desc: "por cada cobro" } ], at: "junte sus resumenes" }),
    kp("Tres meses alcanzan: las hormigas se *repiten*", { src: "broll/hc_papeles.mp4", w: 0.5, at: "tres meses alcanzan" }),
    kp("Marcá todo cobro que aparezca *igual*", { src: "broll/hc_papeles.mp4", w: 0.5, at: "marque con el lapiz todo cobro que se repita" }),
    kp("Ahí están todas, esperando que las *mires*", { src: "broll/hc_papeles.mp4", w: 0.5, at: "esperando que usted las mire" }),
    c("checklist", { title: "La cacería, en 3 pasos", items: [
      { text: "Juntá resúmenes (banco + tarjeta, 3 meses)", state: "done" },
      { text: "Marcá todo cobro que se repita", state: "done" },
      { text: "Por cada uno, 3 preguntas", state: "done" } ], at: "viene el corazon del metodo" }),
  ]},
  { key: "pregunta3", phrase: "hagase tres preguntas", beats: [
    c("splitlist", { title: "Tres preguntas por cada cobro", items: ["¿Qué es esto?", "¿Lo usé, de verdad, este mes?", "¿Lo contrataría hoy de nuevo?"], palette: "D", at: "primera pregunta que es esto" }),
    kp("¿No sabés qué es? Ya es un *problema*", { src: "broll/hc_papeles.mp4", w: 0.5, at: "si no sabe que es" }),
    kp("¿Lo usaste *de verdad* este mes?", { src: "broll/hc_telefono_apps.mp4", w: 0.5, at: "lo use de verdad en el ultimo mes" }),
    kp("Si es “*ni loco*”, no hay razón para pagarlo", { src: "broll/hc_papeles.mp4", w: 0.55, at: "no ni loco" }),
    kp("Costumbre y olvido no son razones para *regalar plata*", { src: "broll/hc_monedas.mp4", w: 0.55, at: "no son razones para regalar plata" }),
  ]},
  { key: "regla", phrase: "corte sin culpa todo lo dudoso", beats: [
    c("tool", { number: "", nameEs: "Cortá sin culpa", nameEn: "Cancelar no es para siempre", how: "Si lo extrañás, lo volvés a poner en 2 minutos. Pero casi nunca lo vas a extrañar.", eyebrow: "La regla de oro" }),
    fp("hb_tijera_tarjeta", "a pair of scissors cutting a subscription card", { caption: "Nadie extraña lo que *no usaba*", accent: "good", scale: 0.6, at: "nadie extrana lo que no estaba usando" }),
    kp("Si tenés dudas… *cortalo*", { src: "broll/hc_tijera.mp4", w: 0.5, at: "si tiene dudas cortelo" }),
    kp("La plata que vuelve, esa *sí la sentís*", { src: "broll/hc_monedas.mp4", w: 0.5, at: "la plata que vuelve" }),
  ]},
  { key: "movimientos", phrase: "todavia hay dos movimientos mas", beats: [
    c("tool", { number: "", nameEs: "Pedí que te saquen comisiones", how: "Llamá y preguntá: ¿qué es este cargo y se puede sacar? Muchas veces, con pedirlo, lo quitan.", eyebrow: "Movimiento extra" }),
    kp("Con solo *pedirlo*, muchas veces lo sacan", { src: "broll/hc_papeles.mp4", w: 0.5, at: "con solo pedirlo" }),
    c("tool", { number: "", nameEs: "Anotá las renovaciones anuales", how: "Lo que se cobra una vez al año no está en este resumen. Ponete un recordatorio antes de que se renueve.", eyebrow: "Movimiento extra", at: "una sola vez al ano" }),
    kp("Decidís *vos*, antes de que se renueve sola", { src: "broll/hc_calendario.mp4", w: 0.5, at: "asi decide usted si sigue o no" }),
  ]},
  { key: "ritual", phrase: "conviertalo en un ritual", beats: [
    c("action", { eyebrow: "Una vez al año", step: "La tarde de la cacería", question: "Elegí una fecha fácil de recordar —tu cumpleaños, el primero de enero— y revisá todo. Las hormigas vuelven." }),
    fp("hb_calendario_marca", "a wall calendar with one date circled in red", { caption: "Una tarde al año = la *cerradura* más barata", accent: "good", scale: 0.6, at: "una vez al ano" }),
    kp("Las hormigas *vuelven*. Por eso, cada año.", { src: "broll/hc_hormigas.mp4", w: 0.5, at: "porque las hormigas vuelven" }),
  ]},
  // ════ PASO CONCRETO ════
  { key: "paso", phrase: "el paso concreto", beats: [
    c("action", { eyebrow: "Hoy mismo", step: "Un resumen, una hormiga", question: "Agarrá el resumen más reciente y cortá UN solo gasto que no uses. Uno. Hoy." }),
    c("bars", { eyebrow: "Lo que está en juego", title: "Una tarde vs todo el año", unit: "", bars: [
      { label: "Si no mirás", value: 12, sub: "se va, mes a mes", display: "todo el año", winner: true },
      { label: "Una tarde al año", value: 1, sub: "y lo recuperás", display: "1 tarde", tone: "good" } ], at: "un resumen una hormiga" }),
    real("hc_monedas", "hands holding coins and a statement, a small win, relief", "hands coins statement saving", { w: 0.45, at: "recupero una plata que estaba perdiendo" }),
  ]},
  // ════ REPASO ════
  { key: "repaso", phrase: "hagamos un repaso rapido", beats: [
    c("infzoom", { accent: "amber", images: [
      { src: "img/dg_hb_resumen.png", label: "Suscripciones" },
      { src: "img/hb_j_musica.png", label: "Pruebas gratis" },
      { src: "img/hb_j_serie.png", label: "Duplicados" },
      { src: ri("hb_gimnasio_full", "an empty gym with an abandoned membership card, nobody"), label: "Membresías" },
      { src: "img/hb_etiqueta_extra.png", label: "Extras / premium" },
      { src: "img/hb_comision.png", label: "Comisiones" },
      { src: "img/hb_j_seguro.png", label: "Aumentos" },
      { src: "img/hb_almacenamiento.png", label: "Compartidos" } ], at: "las suscripciones olvidadas las pruebas gratis" }),
    c("splitlist", { title: "Las 8 hormigas", items: ["Suscripciones", "Pruebas gratis", "Duplicados", "Membresías", "Extras / premium", "Comisiones", "Aumentos silenciosos", "Compartidos"], palette: "D", at: "las suscripciones olvidadas las pruebas gratis" }),
    c("checklist", { title: "Para no olvidar", items: [
      { text: "Los gastos hormiga no gritan, susurran", state: "done" },
      { text: "Juntá resúmenes, marcá lo que se repite", state: "done" },
      { text: "3 preguntas: ¿qué es? ¿lo usé? ¿lo pondría hoy?", state: "done" },
      { text: "Cortá sin culpa lo dudoso", state: "done" } ], at: "junta los resumenes marca lo que se repite" }),
  ]},
  // ════ FIRMA ════
  { key: "firma", phrase: "el gasto hormiga no le roba de golpe", beats: [
    c("signature", { eyebrow: "Para llevarte", lines: [
      { text: "El gasto hormiga no te roba de golpe," }, { text: "te gotea en silencio." }, { text: "Defendete con una tarde de atención.", gold: true } ] }),
    kp("El único que puede prender la *luz* sos *vos*", { src: "img/hb_ben_camara.png", w: 0.6, at: "el unico que puede prender la luz" }),
  ]},
  // ════ EPÍLOGO ════
  { key: "epi", phrase: "aquella tarde de la verguenza", beats: [
    r("hb_ben_alegria", "an older man content and relieved, a small smile, peace with his finances", { kicker: "La alegría de recuperar lo tuyo", w: 0.7, at: "me agarro una alegria rara" }),
    kp("Esa plata no estaba perdida. Estaba *esperándote*.", { src: "img/hb_ben_alegria.png", w: 0.6, at: "esa plata no estaba perdida" }),
  ]},
  // ════ CTA final + TEASE ════
  { key: "tease", phrase: "le hago una promesa para la proxima", beats: [
    rav("hb_ben_final", "warm curious question to the viewer, kind", { kicker: "¿Cuántas hormigas encontraste?", at: "digame en los comentarios cuantas hormigas" }),
    c("nextvideo", { kicker: "Próximo video", title: "El método de la hoja", sub: "Un truco viejo, de una sola hoja de papel, para que la plata del mes nunca se acabe antes de tiempo.", at: "hay un metodo viejo" }),
  ]},
  // ════ OUTRO ════
  { key: "outro", phrase: "cuidese cuide sus ahorros", beats: [
    rav("hb_ben_outro", "warm goodbye, kind smile to camera", { hold: true, kicker: "Soy Ben, de Ben retirado" }),
  ]},
];

// ── ANCLAJE POR FRASE (captions ALINEADAS) ──
const CAP_PATH = fs.existsSync("public/captions_hormiga_aligned.json") ? "public/captions_hormiga_aligned.json" : "public/captions_hormiga.json";
const CAPS = JSON.parse(fs.readFileSync(CAP_PATH, "utf8"));
console.log("captions:", CAP_PATH);
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let jx = 0; jx < p.length; jx++) if (CW[i + jx].t !== p[jx]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "keyphrase" && b.text ? b.text.replace(/\*/g, "") : null);
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1638) + 2;

let cursorSec = 0;
for (const s of SECTIONS) {
  if (s.start != null) { cursorSec = s.start; continue; }
  const ms = findMs(s.phrase, cursorSec + 1);
  if (ms == null) console.warn(`⚠ sección no anclada: "${s.phrase}" (${s.key})`);
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
    return ms != null && ms > start + 1 && ms < end - 1.2 ? Math.max(start + 0.5, ms - 0.3) : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.0) pin[i] = null; else lastPin = pin[i]; } }
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
    const cur = +startT[i].toFixed(2);
    const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2);
    const dur = +(nextR - cur).toFixed(2);
    const id = `${sec.key}_${i}`;
    const hue = b.hue || HUES[(si + i) % HUES.length];
    const beat = { id, start: cur, dur };
    if (b.t === "raw") {
      beat.kind = "raw"; beat.src = b.broll ? `broll/${b.name}.mp4` : `img/${b.name}.png`;
      beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true;
      if (b.broll) beat.broll = true;
      if (b.gen) beat.gen = b.gen;
    } else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cur; beat.dur = dur;
      delete beat.broll; delete beat.w; delete beat.at;
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (beat.kind !== "journey" && !beat.hue) beat.hue = hue;
    }
    if (beat.kind === "keyphrase" && beat.text) {
      const wsx = findWords(beat.text.replace(/\*/g, ""), beat.start - 0.6);
      if (wsx) beat.times = wsx.map((s) => Math.max(0, Math.round((s - beat.start) * 30)));
    }
    beats.push(beat);
  });
}

const extraImgs = [];
const scan = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(scan); return; } if (o._genImg && o._prompt) extraImgs.push({ name: o._genImg, prompt: o._prompt }); for (const k of Object.keys(o)) scan(o[k]); };
SECTIONS.forEach((s) => s.beats.forEach(scan));
for (const e of RAWEXTRA) if (!extraImgs.find((x) => x.name === e.name)) extraImgs.push(e);
const strip = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(strip); return; } delete o._genImg; delete o._prompt; for (const k of Object.keys(o)) strip(o[k]); };
beats.forEach(strip);

// romper beats largos en chunks de ~7.5s con clips (densidad, nada estático)
const FILLER = ["hc_papeles", "hc_monedas", "hc_telefono_apps", "hc_calendario", "hc_alcancia", "hc_tijera", "hc_hormigas", "hc_canilla", "hc_gimnasio"];
const CHUNK = 11;
let fi = 0; const broken = [];
for (const b of beats) {
  broken.push(b);
  const cap = b.kind === "journey" ? 17 : b.kind === "diagram" ? 13 : b.kind === "raw" ? 13 : 12;
  if (b.dur > cap + 2.2) {
    let pos = +(b.start + cap).toFixed(2);
    const e2 = +(b.start + b.dur).toFixed(2);
    b.dur = cap;
    let k = 0;
    while (e2 - pos > 0.4) {
      const d = +Math.min(CHUNK, e2 - pos).toFixed(2);
      broken.push({ id: `${b.id}_f${k++}`, start: pos, dur: d, kind: "raw", broll: true, src: `broll/${FILLER[fi++ % FILLER.length]}.mp4`, hue: b.hue || "red" });
      pos = +(pos + d).toFixed(2);
    }
  }
}
beats.length = 0; beats.push(...broken);

// fotos reales (bing): raw beats con gen (no dg_) + RAWEXTRA + extraImgs no-dg
const rawImgs = [];
for (const b of beats) if (b.kind === "raw" && b.gen && b.gen.name && !b.gen.name.startsWith("dg_")) if (!rawImgs.find((x) => x.name === b.gen.name)) rawImgs.push({ name: b.gen.name, prompt: b.gen.prompt });
for (const e of RAWEXTRA) if (!rawImgs.find((x) => x.name === e.name)) rawImgs.push(e);
for (const e of extraImgs) if (!e.name.startsWith("dg_") && !rawImgs.find((x) => x.name === e.name)) rawImgs.push(e);

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/hormiga.json", JSON.stringify({ video: "hormiga", avatar: "hormiga_opt.mp4", beats, extraImages: extraImgs }, null, 1));
fs.mkdirSync("public/img", { recursive: true }); fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync("public/img/prompts_hormiga.json", JSON.stringify(rawImgs, null, 2));
fs.writeFileSync("public/img/prompts_hormiga_diag.json", JSON.stringify(DIAGRAMS.map((d) => ({ name: d.name, prompt: d.prompt })), null, 2));
fs.writeFileSync("public/img/prompts_hormiga_props.json", JSON.stringify(PROPS.map((d) => ({ name: d.name, prompt: d.prompt, transparent: true })), null, 2));
fs.writeFileSync("public/broll/match_hormiga.json", JSON.stringify(CLIPS, null, 1));

const rawN = beats.filter((b) => b.kind === "raw").length;
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const long = beats.filter((b) => b.dur > 12).length;
console.log(`beats: ${beats.length} · raw: ${rawN} (${(100 * rawN / beats.length).toFixed(0)}%) · realImgs: ${rawImgs.length} · diag: ${DIAGRAMS.length} · props: ${PROPS.length} · clips: ${CLIPS.length} · dur: ${dur.toFixed(0)}s (${(dur / 60).toFixed(1)}min) · >12s: ${long}`);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
console.log("kinds:", JSON.stringify(kinds));
