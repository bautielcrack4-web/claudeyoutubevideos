// gen_barrera.mjs — beatsheet/barrera.json (Video 3, El Constructor Libre — plagas/huerta).
// Narrador "Tomás". Anclaje por frase a captions_barrera.json. ESTÁNDAR: gpt-image-2 LOW
// 16:9 imperfecto (gen_images), deAPI solo anima. Tutorial-literal. Prefijo bg_.
import fs from "fs";

const IMPERF = "Que se vea como una foto casera real: leve desenfoque en algunas zonas, ligera inclinación de cámara, luz desigual, piel y texturas reales, manos naturales con dedos correctos, fondo algo desordenado, pequeñas imperfecciones, nada perfecto, nada pulido, sin apariencia de IA, estilo documental auténtico, saturación baja, colores suaves y ligeramente apagados. Sin texto legible.";
const P = (d) => `Foto documental muy realista, formato HORIZONTAL apaisado, relación de aspecto EXACTA 16:9 (1792x1024). ${d}. ${IMPERF}`;
const AV = "un hombre rural de unos 45 años, pelo oscuro y barba corta canosa, piel curtida, camisa de trabajo verde oliva y delantal de cuero marrón";
const PAV = (d) => P(`${AV}, ${d}, en una huerta rural de la Patagonia`);
const DP = (d) => `Crear una infografía horizontal, RELACIÓN DE ASPECTO EXACTA 16:9 (1792x1024), estilo lámina ilustrada hecha a mano pero muy profesional, limpia, premium y editorial. Fondo marfil claro con textura de papel muy sutil, líneas marrón oscuro casi negras, acentos en verde oliva/salvia y terracota apagado. ${d}. DEJÁ COMPLETAMENTE LIBRE la esquina superior derecha (limpia, sin texto ni dibujos) para el avatar. Composición minimalista, mucho espacio, pocos bloques grandes, tinta fina con acuarela suave, se entiende en 1 segundo. Textos en español, breves. Estética: vintage botanical / archival textbook illustration, papel levemente envejecido. Evitá verse escolar/sobrecargado.`;

const HUES = ["amber", "red", "blue"];
const r = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: P(prompt) }, ...o });
const rv = (name, prompt, o = {}) => ({ t: "raw", name, clip: true, gen: { type: "clip", image: name, prompt: P(prompt), frames: o.frames || 90 }, ...o });
const rav = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: PAV(prompt) }, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
let fSide = 0;
const fimg = (name, prompt, o = {}) => ({ t: "float", name, gen: { type: "image", name, prompt: P(prompt) }, side: (fSide++ % 2 ? "left" : "right"), ...o });
const half = (name, prompt, o = {}) => ({ t: "half", name, side: "right", gen: { type: "image", name, prompt: P(prompt) }, ...o });
const real = (name, o = {}) => ({ t: "raw", name, broll: true, ...o });

const DIAGRAMS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };

const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.0, stat: 1.0, aged: 1.2, checklist: 1.2, splitlist: 1.1, bars: 1.25, cross: 1.25, process: 1.5, journey: 2.6, infzoom: 1.3, annotated: 1.3, callout: 1.0, chips: 1.0, impact: 1.4, diagram: 2.4, half: 1.3 };

const SECTIONS = [
  // ░░ HOOK ░░ — dos lechugas, una destruida, una perfecta con el anillo de $5
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    r("bg_dos_lechugas", "dos plantas de lechuga lado a lado en un cantero, la de la izquierda comida y llena de agujeros, la de la derecha sana y entera", { kicker: "Misma tierra, mismo sol", at: "dos plantas de lechuga", hold: true }),
    r("bg_lechuga_comida", "una lechuga destrozada por babosas, hojas hechas un encaje de agujeros"),
    r("bg_lechuga_sana", "una lechuga perfecta y sana, hojas firmes, lista para la mesa"),
    r("bg_anillo_metales", "un anillo de dos metales distintos (cobre y zinc) rodeando una planta en el cantero, primer plano", { kicker: "Un anillo de $5" }),
    r("bg_babosa_rastro", "el rastro plateado y los agujeros que deja una babosa en las hojas, de noche"),
    rv("bgv_babosa_retira", "una babosa tocando una cinta de metal y dándose media vuelta, retirándose, sobre tierra húmeda de noche", { frames: 90, kicker: "Se da media vuelta" }),
    r("bg_perro_huerta", "un perro tranquilo en la huerta y chicos descalzos al fondo, todo seguro sin veneno"),
    r("bg_abeja_flor", "una abeja trabajando una flor de la huerta, sana, sin veneno"),
  ]},
  { key: "ident", phrase: "Me llamo Tomás", beats: [
    rav("bg_tomas_huerta", "parado en su huerta llena de verduras, mirada tranquila", { hold: true, kicker: "Tomás" }),
    c("quote", { image: "bg_manos_tierra", text: "No soy agrónomo. Soy un *hombre que prueba cosas*.", _genImg: "bg_manos_tierra", _prompt: P("manos curtidas sosteniendo tierra oscura de huerta, primer plano") }),
    rav("bg_tomas_incomoda", "inclinado hacia la cámara con gesto serio entre las plantas", { kicker: "La parte que te va a dar bronca" }),
  ]},
  { key: "promesa", phrase: "Quédate conmigo hasta el final", beats: [
    c("stat", { value: 5, prefix: "US$ ", label: "lo que cuesta proteger tu huerta", eyebrow: "Te lo prometo" }),
    c("chips", { bg: "image", image: "img/bg_tomas_huerta.png", imageDarken: 0.6, title: "Lo que vas a saber", chips: ["Barrera de 2 metales", "Bórax para hormigas", "Spray de ajo", "Tierra de diatomeas"], hue: "amber" }),
    r("bg_frasco_veneno_no", "un frasco de veneno para plantas con un signo de prohibido, concepto de no usar veneno"),
  ]},
  { key: "problema", phrase: "Empecemos por lo que casi todos", beats: [
    c("diagram", { eyebrow: "Barrera, no batalla", slides: [{ image: dg("dg_bg_barrera", "Diagrama: a la izquierda 'LO QUE HACE TODO EL MUNDO' (rociar veneno sobre la planta, la plaga vuelve), a la derecha 'LO INTELIGENTE' (una barrera alrededor que la plaga no cruza). Flechas simples. Etiquetas en español."), eyebrow: "Defendé el territorio, no pelees cuerpo a cuerpo" }] }),
    r("bg_rociar_veneno", "una mano rociando veneno con un pulverizador sobre una planta, gotas en las hojas"),
    rv("bgv_plaga_vuelve", "pulgones volviendo a una hoja pocos días después, plaga que regresa", { frames: 80, kicker: "Y a los días vuelve" }),
    c("splitlist", { title: "La guerra sin fin", items: ["Rociás veneno", "Se evapora o lo lava la lluvia", "Volvés a comprar"], palette: "D", cross: true }),
    c("bars", { title: "Cuánto dura", unit: "", bars: [{ label: "Veneno (semanas)", value: 3, tone: "danger" }, { label: "Barrera (años)", value: 40, winner: true }] }),
  ]},
  // ░░ DEFENSA 1 — barrera galvánica ░░
  { key: "barrera_que", phrase: "dos metales distintos juntos", beats: [
    c("rule", { number: "01", title: "La barrera galvánica de $5" }),
    r("bg_babosa_baba", "una babosa con su cuerpo cubierto de baba húmeda y brillante, primer plano, sobre una hoja", { hold: true, kicker: "Babosas y caracoles" }),
    c("diagram", { eyebrow: "La física de la barrera", slides: [{ image: dg("dg_bg_fisica", "Diagrama: una babosa húmeda tocando al mismo tiempo cobre y zinc cierra un circuito eléctrico (como una pila). Recibe una pequeña corriente y se retira. Etiquetas: 'cobre', 'zinc', 'cuerpo húmedo = pila', 'pequeña descarga'."), eyebrow: "Su cuerpo húmedo cierra el circuito = una pila" }] }),
    r("bg_pila_natural", "dos metales distintos unidos por algo húmedo generando una corriente, concepto de pila natural"),
    c("callout", { image: "bg_anillo_macro", figure: "US$ 5", caption: "Una vez. Dura años.", accent: "amber", _genImg: "bg_anillo_macro", _prompt: P("primer plano del anillo de cobre y zinc alrededor de una planta, gotas de rocío") }),
  ]},
  // ░░ DEFENSA 1 — RECETA (tutorial literal) ░░
  { key: "barrera_receta", phrase: "Armarla es simple", beats: [
    c("annotated", { image: "bg_materiales_barrera", eyebrow: "Lo que necesitás", caption: "Cobre y zinc, monedas", annotations: [{ kind: "circle", x: 30, y: 55, label: "Cinta de cobre" }, { kind: "circle", x: 70, y: 55, label: "Chapa galvanizada (zinc)" }], _genImg: "bg_materiales_barrera", _prompt: P("una cinta de cobre y un pedazo de chapa galvanizada sobre una mesa de huerta, vista cenital") }),
    r("bg_cinta_cobre", "una cinta adhesiva de cobre brillante, rollo, primer plano", { kicker: "1 · Cobre" }),
    r("bg_chapa_zinc", "un pedazo de chapa galvanizada cubierta de zinc, gris mate", { kicker: "2 · Zinc (chapa galvanizada)" }),
    r("bg_pegar_cobre", "una mano pegando la cinta de cobre en el borde de una maceta de madera"),
    r("bg_pegar_zinc", "una mano colocando la tira de zinc justo al lado del cobre, paralelas"),
    real("rb_copper_tape", { kicker: "3 · Rodear el cantero" }),
    r("bg_anillo_cerrado", "un anillo cerrado de cobre y zinc juntos rodeando una maceta, sin huecos", { kicker: "Un anillo cerrado, los dos metales juntos" }),
    rv("bgv_babosa_calambre", "una babosa tocando los dos metales y retrocediendo de golpe por la pequeña descarga, de noche", { frames: 85, kicker: "Toca los dos, recibe el calambre, se va" }),
    fimg("bg_monedas_cobre", "monedas viejas de cobre como alternativa barata para la barrera"),
    c("checklist", { title: "La barrera galvánica", items: ["Cobre + zinc juntos", "Anillo cerrado sin huecos", "Alrededor de la planta", "Dura años, sin recomprar"] }),
  ]},
  { key: "inject1", phrase: "uno de los", beats: [
    c("diagram", { eyebrow: "Los 35 sistemas, paso a paso", slides: [{ image: dg("dg_bg_manual", "Lámina de un manual abierto de homestead con diagramas de la barrera galvánica y la huerta, regla y lápiz, estilo archivo. Sin texto legible."), eyebrow: "Las medidas exactas, en el manual" }] }),
    half("bg_manual_huerta", "un manual abierto con diagramas de huerta y barreras sobre una mesa de jardín", { kicker: "Todo documentado" }),
  ]},
  // ░░ DEFENSA 2 — bórax hormigas ░░
  { key: "hormigas", phrase: "el bórax", beats: [
    c("rule", { number: "02", title: "El bórax contra las hormigas" }),
    r("bg_fila_hormigas", "una fila de hormigas caminando por el borde de un cantero, primer plano", { kicker: "Las hormigas" }),
    r("bg_borax_azucar", "bórax blanco y azúcar sobre una cuchara, los dos ingredientes del cebo", { kicker: "Bórax + azúcar" }),
    r("bg_borax_cebo", "una mano mezclando bórax con azúcar y un poco de agua hasta hacer un cebo dulce pegajoso", { kicker: "Mezclar en una pasta dulce" }),
    r("bg_cebo_cerca", "el cebo dulce colocado cerca de donde entran las hormigas, en una tapita"),
    rv("bgv_hormigas_cebo", "hormigas llevándose el cebo dulce a su hormiguero, fila cargando", { frames: 80, kicker: "Se lo llevan al hormiguero" }),
    r("bg_borax_linea", "una línea de polvo de bórax seco como barrera alrededor del cantero", { kicker: "Y una línea seca de barrera" }),
    c("diagram", { eyebrow: "Cómo cae el hormiguero", slides: [{ image: dg("dg_bg_hormiga", "Diagrama: las hormigas obreras llevan el cebo de bórax al nido, lo reparten a la reina y a las otras, y el hormiguero colapsa desde adentro en días. Flechas simples. Etiquetas en español."), eyebrow: "Colapsa desde adentro, sin cavar" }] }),
  ]},
  // ░░ DEFENSA 3 — spray de ajo ░░
  { key: "ajo", phrase: "spray", beats: [
    c("rule", { number: "03", title: "El spray de ajo contra los pulgones" }),
    r("bg_dientes_ajo", "varios dientes de ajo pelados sobre la mesada, listos para machacar", { kicker: "Unos dientes de ajo", at: "ajo machacado" }),
    r("bg_ajo_machacar", "ajo machacado en un mortero, listo para el agua", { kicker: "Machacado" }),
    r("bg_ajo_reposar", "un frasco de agua con ajo reposando una noche sobre la mesada", { kicker: "Reposar una noche" }),
    r("bg_colar_spray", "colando el líquido de ajo en un pulverizador, para que no tape la boquilla", { kicker: "Colar y al pulverizador" }),
    real("rb_spray_leaves", { kicker: "Rociar el REVERSO de las hojas" }),
    c("annotated", { image: "bg_pulgon_reverso", eyebrow: "El truco", caption: "Abajo de la hoja, nunca las flores", annotations: [{ kind: "arrow", x: 40, y: 60, label: "Reverso: ahí están" }, { kind: "circle", x: 75, y: 30, label: "Flor: NO (las abejas)" }], _genImg: "bg_pulgon_reverso", _prompt: P("el reverso de una hoja con pulgones escondidos, primer plano de la parte de abajo") }),
    c("splitlist", { title: "La regla de oro del ajo", items: ["Rociar el reverso", "Nunca las flores abiertas", "Repetir tras la lluvia"], palette: "G" }),
  ]},
  // ░░ DEFENSA 4 — tierra de diatomeas ░░
  { key: "diatomeas", phrase: "tierra de diatomeas", beats: [
    c("rule", { number: "04", title: "La tierra de diatomeas" }),
    r("bg_diatomeas_polvo", "un polvo blanco finísimo como talco en la mano, tierra de diatomeas", { kicker: "Polvo finísimo" }),
    c("diagram", { eyebrow: "Por qué mata insectos", slides: [{ image: dg("dg_bg_diat", "Diagrama: el polvo de diatomeas visto al microscopio está hecho de partículas con bordes filosos como vidrio que rayan la cubierta del insecto y lo deshidratan. Etiquetas: 'suave para vos', 'filoso para el bicho'."), eyebrow: "Suave para vos, filoso para el bicho" }] }),
    r("bg_diat_espolvorear", "una mano espolvoreando el polvo blanco de diatomeas alrededor de las plantas", { kicker: "Espolvorear alrededor" }),
    r("bg_diat_linea", "una línea de polvo blanco de diatomeas alrededor de una planta en el cantero", { kicker: "Una barrera que no cruzan" }),
    rv("bgv_diat_lluvia", "lluvia apelmazando una línea de polvo blanco, recordando que hay que repetir", { frames: 70, kicker: "Repetir después de la lluvia" }),
  ]},
  // ░░ LAS 4 DEFENSAS ░░
  { key: "cuatro", phrase: "cuatro defensas", beats: [
    c("chips", { bg: "image", image: "img/bg_tomas_huerta.png", imageDarken: 0.6, title: "Cuatro defensas, ningún veneno", chips: ["Babosas → 2 metales", "Hormigas → bórax", "Pulgones → ajo", "Todo → diatomeas"], hue: "amber" }),
    r("bg_huerta_sana", "una huerta entera sana y productiva, abejas y mariposas, sin veneno", { hold: true, kicker: "Seguro para abejas, mariposas y chicos" }),
  ]},
  { key: "inject2", phrase: "no le deja ganancia", beats: [
    c("costtally", { left: { label: "El veneno", note: "se gasta, comprás de nuevo cada mes", total: 95, bad: true }, right: { label: "Constructor Libre", note: "barreras que duran años", total: 5 } }),
    c("quote", { image: "bg_veneno_abeja", text: "Ese veneno mata también a las *abejas* que dan tu comida.", accent: "danger", _genImg: "bg_veneno_abeja", _prompt: P("una abeja muerta junto a una flor rociada con veneno, primer plano triste") }),
  ]},
  { key: "empezar", phrase: "por dónde empiezas", beats: [
    c("process", { title: "Empezá por tu peor plaga", eyebrow: "Sin abrumarte", steps: [
      { title: "Babosas", desc: "la barrera de 2 metales", image: "img/bg_anillo_metales.png" },
      { title: "Hormigas", desc: "el cebo de bórax", image: "img/bg_borax_cebo.png" },
      { title: "Pulgones", desc: "el spray de ajo", image: "img/bg_ajo_machacar.png" } ] }),
    r("bg_huerta_castigada", "una planta castigada por plagas en la huerta, la peor del cantero", { kicker: "Ganá una batalla primero", hold: true }),
  ]},
  // ░░ ECOSISTEMA / aliados ░░
  { key: "aliados", phrase: "vuelven los aliados", beats: [
    r("bg_mariquita", "una mariquita (vaquita de San Antonio) comiendo pulgones en una hoja, primer plano", { kicker: "La mariquita come cientos por día" }),
    r("bg_sapo", "un sapo escondido bajo una maceta dada vuelta en la huerta, cazador de babosas"),
    r("bg_arana_jardin", "una araña de jardín en su tela entre las plantas, cazadora natural"),
    r("bg_pajaro_huerta", "un pájaro comiendo orugas en la huerta, aliado natural"),
    r("bg_refugio_sapo", "una piedra plana y una maceta rota puestas como refugio para sapos en la huerta", { kicker: "Dales un refugio" }),
    c("diagram", { eyebrow: "Una huerta viva se defiende sola", slides: [{ image: dg("dg_bg_ecos", "Diagrama: cuando dejás de envenenar, vuelven los aliados (mariquita, sapo, pájaro, araña) que cazan las plagas gratis. La huerta viva = su propio ejército. Ilustración de tinta, etiquetas en español."), eyebrow: "Cuando dejás el veneno, vuelve el ejército" }] }),
  ]},
  { key: "panorama", phrase: "Déjame dejarte el panorama grande", beats: [
    c("headline", { tokens: ["Comida", "sana", "a", "unos", "pasos", "de", "tu", { t: "cocina" }], eyebrow: "Lo más valioso", bg: "image", image: "img/bg_huerta_sana.png" }),
    c("quote", { image: "bg_manos_cosecha", text: "Cultivaban sin un solo químico de laboratorio. Y *comían*.", _genImg: "bg_manos_cosecha", _prompt: P("manos viejas cosechando tomates en una huerta, gesto de oficio") }),
  ]},
  { key: "plan", phrase: "esto es lo que quiero que hagas", beats: [
    c("checklist", { title: "Tu fin de semana", items: [
      { text: "Cobre y zinc para la barrera", state: "todo" },
      { text: "Una caja de bórax", state: "todo" },
      { text: "Ajo en agua esta noche", state: "todo" } ] }),
    rav("bg_tomas_arma_barrera", "armando el anillo de cobre y zinc alrededor de una planta en su huerta"),
  ]},
  { key: "inject3", phrase: "si quieres todo esto bien explicado", beats: [
    c("diagram", { eyebrow: "Todo, ordenado y probado", slides: [{ image: dg("dg_bg_stack", "Lámina tipo oferta de valor artesanal: un manual de dos volúmenes, diagramas técnicos, plan de 90 días y bonos apilados. Estilo archivo, sin precios ni texto legible."), eyebrow: "Vale 158 — hoy 27, para siempre" }] }),
    c("bars", { title: "El valor", unit: "US$", bars: [{ label: "Por separado", value: 158, tone: "danger" }, { label: "Hoy", value: 27, winner: true }] }),
    c("quote", { image: "bg_manual_celular", text: "Si no te sirve, te devuelvo *todo*. El riesgo lo pongo yo.", accent: "good", _genImg: "bg_manual_celular", _prompt: P("un teléfono mostrando un manual digital abierto sobre una mesa de jardín, luz cálida") }),
  ]},
  { key: "coment", phrase: "Cuéntame en los comentarios", beats: [
    rav("bg_tomas_camara", "hablando cálido a la cámara en su huerta, invitando", { kicker: "¿Qué plaga te arruina la huerta?" }),
  ]},
  { key: "cierre", phrase: "un último pensamiento", beats: [
    c("quote", { image: "bg_huerta_sana", text: "Dejás de ser un cliente y volvés a ser un *hombre que sabe*." }),
    c("journey", { eyebrow: "La verdadera cosecha", title: "Tu huerta libre", waypoints: [
      { x: 0, y: 0, z: 0, image: "img/bg_anillo_metales.png", label: "La barrera", num: "1", dwell: 2.6, travel: 1.6 },
      { x: 1.2, y: -0.4, z: 0.3, image: "img/bg_mariquita.png", label: "Los aliados", num: "2", dwell: 2.6, travel: 1.6 },
      { x: 2.4, y: 0.3, z: -0.2, image: "img/bg_huerta_sana.png", label: "La huerta sana", num: "3", dwell: 3.0, travel: 1.4 } ] }),
  ]},
  { key: "proximo", phrase: "tierra muerta", beats: [
    r("bg_tierra_negra", "tierra negra rica y esponjosa en las manos vs tierra muerta y dura, comparación", { kicker: "La próxima: revivir tierra muerta con $1" }),
    rav("bg_tomas_firma", "mirando cálido a la cámara en la huerta, hora dorada", { hold: true }),
  ]},
];

// ── ANCLAJE POR FRASE ────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_barrera.json", "utf8"));
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1120) + 2;

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
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (beat.kind === "journey") delete beat.accent;
      if (beat.kind !== "journey" && !beat.hue) beat.hue = hue;
    }
    beats.push(beat);
  });
}

const strip = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(strip); return; } delete o._genImg; delete o._prompt; delete o._note; for (const k of Object.keys(o)) strip(o[k]); };
const extraImgs = [];
const scan = (o) => { if (!o || typeof o !== "object") return; if (o._genImg && o._prompt) extraImgs.push({ name: o._genImg, prompt: o._prompt }); for (const k of Object.keys(o)) scan(o[k]); };
SECTIONS.forEach((s) => s.beats.forEach(scan));
beats.forEach(strip);
const fixImg = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(fixImg); return; } if (typeof o.image === "string" && !o.image.includes("/") && !o.image.includes(".")) o.image = `img/${o.image}.png`; for (const k of Object.keys(o)) { if (k === "gen") continue; fixImg(o[k]); } };
beats.forEach(fixImg);

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/barrera.json", JSON.stringify({ video: "barrera", avatar: "barrera_opt.mp4", tutorial: true, beats, extraImages: extraImgs }, null, 1));
fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync("public/img/prompts_barrera_diag.json", JSON.stringify(DIAGRAMS.map((d) => ({ name: d.name, prompt: d.prompt })), null, 2));

const raw = beats.filter((b) => b.kind === "raw").length;
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · diagramas: ${DIAGRAMS.length} · extraImgs: ${extraImgs.length} · dur: ${(dur / 60).toFixed(1)}min`);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
console.log("kinds:", JSON.stringify(kinds));
