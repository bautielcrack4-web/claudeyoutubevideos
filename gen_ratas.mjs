// gen_ratas.mjs — "Saca Las Ratas Con $1" (Constructor Libre v6, FACELESS, voz Tomás).
// gpt-image-2 matcheado + diagramas + clips reales + LTX. Guard de captions. Clon.
import fs from "fs";

const IMAGES = new Map();
const P = (s) =>
  `Foto documental muy realista, formato horizontal apaisado 16:9. ${s} Que parezca una foto casera real sacada con el celular: leve desenfoque, encuadre algo torcido, luz despareja y natural, texturas reales, manos naturales, fondo algo desordenado, pequeñas imperfecciones, nada perfecto, nada pulido, sin apariencia de IA, estilo documental auténtico de campo, saturación baja, colores suaves y apagados. Negative prompt: foto de estudio limpia, producto perfecto, brillante, cinematográfico, CGI, render 3D, ilustración, cartoon, texto legible, logo, marca de agua, cara perfecta simétrica, dedos de más, manos deformadas, rata caricaturesca.`;
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
  { key: "intro", start: 0.1, hue: "red", beats: [
    r(IM("rt_rata_pared", "Una rata gris asomando de un agujero en la pared de un galpón de campo, penumbra, primer plano."), { kicker: "Ese ruido en la pared, de noche", w: 0.7 }),
    r(IM("rt_bolsa_mordida", "Una bolsa de alimento de animales mordida y vaciada por ratas en un granero, granos desparramados."), { kicker: "Bolsas mordidas, cables roídos", w: 0.6 }),
    r(IM("rt_bolitas", "Bolitas negras de excremento de rata sobre una repisa de madera en un galpón."), { w: 0.5 }),
    c("quote", { image: IM("rt_veneno_caja", "Una caja de veneno para ratas de colores sobre un estante, advertencia, luz fría."), text: "El veneno puede matar a tu perro, a tus gallinas, a un *chico*." }),
    r(IM("rt_perro_campo", "Un perro de campo olfateando el piso de un galpón, riesgo del veneno."), { kicker: "Y nunca soluciona el fondo", w: 0.5 }),
    r(IM("rt_galpon_limpio", "Un galpón de campo ordenado y limpio, sin ratas, granos en tachos de metal."), { hold: true }),
    c("headline", { tokens: ["Ratas", "fuera", "con", { t: "$1" }], eyebrow: "Sin veneno, sin trampas, sin gato", bg: "image", image: IM("rt_granero", "El interior de un granero de campo con grano guardado y luz entrando por una ventana.") }),
  ]},
  { key: "tomas", start: 70, hue: "blue", beats: [
    r(IM("rt_casa_campo", "Una casa de madera en el campo con un galpón al lado, atardecer rural."), { kicker: "Hace veinte años dejé la ciudad", hold: true }),
    c("quote", { image: IM("rt_manos_tomas", "Las manos curtidas de un hombre de campo apoyadas sobre una mesa de madera."), text: "Entendí cómo piensa una rata y cómo se la saca de verdad, para *siempre*." }),
    c("aged", { heading: "Lo más importante", lines: ["No es matarlas.", "Es lo que viene después, y casi nadie lo hace."], image: IM("rt_galpon_interior", "El interior de un galpón rural con herramientas, baldes y leña, luz cálida.") }),
    r(IM("rt_hombre_galpon", "Un hombre mayor de campo revisando su galpón con una linterna, de espaldas."), { hold: true }),
  ]},
  { key: "enemigo", start: 125, hue: "amber", beats: [
    c("headline", { tokens: ["Entendé", "a", "tu", { t: "enemigo" }], eyebrow: "Vienen por tres cosas", bg: "image", image: IM("rt_rata_mira", "Una rata gris quieta mirando, sobre el piso de un granero, primer plano realista.") }),
    dgb(DIA("dg_rt_tres", "Tres cosas que busca una rata, en tres íconos simples con rótulos en español: COMIDA (granos), AGUA (gota), REFUGIO (nido escondido). Y abajo el orden del sistema: 1 quitar lo que buscan, 2 sacar las que están, 3 cerrar para que no vuelvan.")),
    c("splitlist", { title: "Una rata viene por", items: ["Comida fácil", "Agua para beber", "Un refugio calentito"], palette: "D" }),
    c("quote", { image: IM("rt_nido", "Un nido de ratas hecho de papel y trapos en un rincón oscuro de un galpón."), text: "Mientras tu casa les convenga, van a venir *nuevas* siempre." }),
  ]},
  { key: "comida", start: 170, hue: "blue", beats: [
    c("headline", { tokens: ["Primero", ":", "quitá", "la", { t: "comida" }], eyebrow: "Esto cambia todo", bg: "image", image: IM("rt_grano_suelto", "Granos de maíz desparramados en el piso de un granero, comida fácil para ratas.") }),
    r(IM("rt_tacho_metal", "Alimento de animales guardado en tachos de metal con tapa a presión, en un galpón."), { kicker: "Todo en metal con tapa", hold: true }),
    r(IM("rt_plato_perro", "Un plato de comida de perro lleno dejado en el piso de noche, atrae ratas."), { kicker: "Levantá el plato de noche", w: 0.6 }),
    c("checklist", { title: "Cortarles el suministro", items: ["Granos en metal con tapa", "Comida del perro: levantar de noche", "Arreglar canillas que gotean", "Tapar el compost"] }),
    r(IM("rt_canilla_gotea", "Una canilla vieja goteando agua en un galpón, fuente de agua para las ratas."), { kicker: "Sin agua, se mudan", w: 0.6 }),
    c("quote", { image: IM("rt_galpon_orden", "Un galpón ordenado con todo guardado en metal, sin comida a la vista."), text: "Sin comida ni agua, la rata se muda sola sin matar a *nadie*." }),
  ]},
  { key: "cebo", start: 225, hue: "red", beats: [
    c("headline", { tokens: ["El", "cebo", "de", { t: "$1" }], eyebrow: "Sin veneno químico", bg: "image", image: IM("rt_harina_yeso", "Harina y yeso en polvo sobre una mesa de madera, ingredientes del cebo casero.") }),
    c("process", { title: "El cebo de harina y yeso", steps: [
      { title: "Mitad harina", image: IM("rt_harina", "Un puñado de harina blanca sobre una cuchara de madera.") },
      { title: "Mitad yeso", image: IM("rt_yeso", "Yeso blanco en polvo de construcción en un cuenco.") },
      { title: "Un poco de azúcar", image: IM("rt_azucar", "Azúcar cayendo sobre la mezcla seca de harina y yeso.") },
      { title: "En tapitas, junto a agua", image: IM("rt_tapitas", "Tapitas con la mezcla seca puestas pegadas a la pared de un galpón, junto a un recipiente con agua.") },
    ]}),
    r(IM("rt_pared_camino", "El rincón de un galpón donde las ratas caminan pegadas a la pared, marcas de paso."), { kicker: "Pegado a la pared, por donde pasan", w: 0.6 }),
    c("quote", { image: IM("rt_agua_recip", "Un recipiente con agua junto a las tapitas del cebo, en el galpón."), text: "Come la mezcla, toma agua, el yeso fragua adentro. Sin sangre, sin *cadáver*." }),
    c("splitlist", { title: "Otra versión casera", items: ["Bicarbonato + harina + azúcar", "La rata no puede largar los gases", "También de centavos"], palette: "A" }),
  ]},
  { key: "injerto1", start: 280, hue: "amber", beats: [
    c("aged", { heading: "Uno de 35 sistemas", lines: ["Las proporciones de cada cebo,", "dónde ponerlos y dónde es inútil,", "cada cuánto renovarlos. Todo probado."], image: IM("rt_cuaderno", "Un cuaderno viejo manuscrito con notas sobre cómo sacar ratas, sobre una mesa de madera.") }),
    f(IM("rt_manual", "Un manual casero abierto con láminas dibujadas a mano sobre plagas, papel envejecido."), { kicker: "Todo junto en el manual" }),
    c("quote", { image: IM("rt_galpon_tarde", "Un galpón de campo a la tarde, ordenado, con la luz entrando."), text: "Pero quédese, que ahora viene cómo hacer que se vayan *solas*." }),
  ]},
  { key: "olores", start: 315, hue: "blue", beats: [
    r(IM("rt_menta", "Hojas de menta fresca y aceite esencial de menta sobre una mesa de campo."), { kicker: "La menta las espanta", w: 0.6 }),
    r(IM("rt_algodon_menta", "Bolitas de algodón con gotas de aceite de menta puestas en un rincón de galpón."), { kicker: "Algodón con menta en los rincones", hold: true }),
    c("chips", { bg: "image", image: IM("rt_rincon_galpon", "Un rincón oscuro de galpón donde anidan las ratas, con telarañas y sombras."), title: "Olores que no soportan", chips: ["menta fuerte", "amoníaco", "laurel", "olor a gato"], hue: "blue" }),
    c("quote", { image: IM("rt_gato_arena", "Arena usada de la caja de un gato puesta cerca de una entrada de galpón."), text: "El olor del depredador las pone nerviosas y las hace *irse*." }),
  ]},
  { key: "trampa", start: 360, hue: "amber", beats: [
    c("headline", { tokens: ["La", "trampa", "de", { t: "balde" }], eyebrow: "La más justa, de $1", bg: "image", image: IM("rt_balde_trampa", "Un balde grande con un alambre atravesado y una lata en el medio, trampa casera para ratas, con una rampa de madera.") }),
    dgb(DIA("dg_rt_trampa", "Diagrama de la trampa de balde: un balde, un alambre que cruza la boca con una lata untada de manteca de maní en el medio, una rampa desde el suelo. La rata sube, se estira, la lata gira y cae adentro. Flechas del movimiento, rótulos en español.")),
    r(IM("rt_lata_cebo", "Una lata untada con manteca de maní ensartada en un alambre sobre un balde."), { kicker: "Lata giratoria con cebo", w: 0.6 }),
    c("quote", { image: IM("rt_balde_rampa", "El balde trampa con la rampita apoyada, listo en un galpón."), text: "La lata vuelve sola: una trampa atrapa varias en una *noche*." }),
  ]},
  { key: "cerrar", start: 405, hue: "blue", beats: [
    c("headline", { tokens: ["Cerrá", "la", { t: "casa" }], eyebrow: "Lo que casi nadie hace", bg: "image", image: IM("rt_agujero_pared", "Un agujero del tamaño de una moneda en la base de una pared de galpón, entrada de ratas.") }),
    r(IM("rt_agujero_cano", "El hueco por donde entra un caño a la pared, sin sellar, entrada de ratas."), { kicker: "Por un agujero del tamaño de una moneda", w: 0.6 }),
    r(IM("rt_lana_acero", "Lana de acero gris metálica siendo apretada dentro de un agujero de pared."), { kicker: "Lana de acero, no la pueden roer", hold: true }),
    c("process", { title: "Sellar las entradas", steps: [
      { title: "Encontrá el agujero", image: IM("rt_buscar_agujero", "Una linterna iluminando una grieta en los cimientos de un galpón.") },
      { title: "Rellená con lana de acero", image: IM("rt_rellenar", "Una mano apretando lana de acero dentro de un hueco en la pared.") },
      { title: "Tapá con cemento", image: IM("rt_cemento", "Aplicando un poco de cemento sobre la lana de acero en la pared.") },
    ]}),
    c("quote", { image: IM("rt_pared_sellada", "Una pared de galpón con los agujeros tapados y sellados, prolija."), text: "Cada agujero que cerrás es una puerta menos para *siempre*." }),
  ]},
  { key: "detective", start: 460, hue: "amber", beats: [
    r(IM("rt_marca_grasa", "Una mancha oscura y aceitosa de grasa de rata a lo largo del borde de una pared, autopista de ratas."), { kicker: "Marcas de grasa = autopista", w: 0.6 }),
    c("annotated", { image: IM("rt_rastros", "Rastros de ratas en un galpón: bolitas, marcas de grasa y un camino pelado."), caption: "Leé los rastros", annotations: [
      { x: 28, y: 40, label: "Bolitas: por dónde pasan" },
      { x: 70, y: 38, label: "Grasa: autopista" },
      { x: 50, y: 78, label: "Olor a amoníaco: dónde orinan" },
    ]}),
    c("quote", { image: IM("rt_linterna", "Una linterna iluminando un rincón de galpón buscando rastros de ratas, de noche."), text: "Un buen cazador primero rastrea, después *actúa*." }),
  ]},
  { key: "injerto2", start: 505, hue: "red", beats: [
    c("headline", { tokens: ["El", "negocio", "del", { t: "veneno" }], eyebrow: "La parte incómoda", bg: "image", image: IM("rt_gondola_veneno", "Una góndola con cajas de veneno para ratas de colores, etiquetas brillantes, luz fría.") }),
    c("quote", { image: IM("rt_caja_veneno2", "Una caja de veneno para ratas en la mano de alguien en una ferretería."), text: "Te da un alivio corto y te garantiza que volvés a *comprar*." }),
    c("bars", { title: "Alivio corto vs solución", unit: "", bars: [{ label: "Veneno: vuelven al mes", value: 12 }, { label: "Cerrar y limpiar: una vez", value: 1 }] }),
    c("aged", { heading: "El remedio real es gratis", lines: ["Sacar la comida, cerrar los agujeros.", "Eso no le deja ganancia a nadie."], image: IM("rt_lana_cemento", "Lana de acero y un poco de cemento sobre una mesa, la solución barata.") }),
  ]},
  { key: "preguntas", start: 550, hue: "amber", beats: [
    c("splitlist", { title: "¿Sirve en la ciudad?", items: ["El principio es el mismo", "Comida, agua, refugio, sellar", "Cerrando tu casa, no anidan adentro"], palette: "G" }),
    r(IM("rt_casa_ciudad", "Una casa urbana con un sótano o garaje donde podrían entrar ratas."), { w: 0.6 }),
    c("quote", { image: IM("rt_empezar", "Una persona guardando alimento en tachos de metal, empezando el sistema."), text: "Empezá por la comida y el agua hoy: en una semana ya se nota *menos*." }),
    r(IM("rt_metal_tachos", "Varios tachos de metal con tapa guardando alimento y granos, ordenados."), { w: 0.6 }),
  ]},
  { key: "gallinero", start: 595, hue: "blue", beats: [
    c("headline", { tokens: ["Gallinero", "y", { t: "granero" }], eyebrow: "Los más difíciles", bg: "image", image: IM("rt_gallinero", "Un gallinero de campo con gallinas y comederos, escena rural.") }),
    r(IM("rt_comedero", "Un comedero de gallinas levantado al atardecer para no dejar comida de noche."), { kicker: "Levantá el comedero de noche", hold: true }),
    r(IM("rt_alambre_enterrado", "El alambre de un gallinero enterrado en el suelo para que las ratas no caven."), { kicker: "Alambre enterrado: cavan", w: 0.6 }),
    c("checklist", { title: "Granero a prueba de ratas", items: ["Grano en silos o tambores de metal", "Nada en bolsa en el piso", "Todo despegado de la pared"] }),
    c("quote", { image: IM("rt_silo", "Un silo o tambor de metal sellado guardando grano en un granero."), text: "Si el grano es inalcanzable, la rata se cansa y se *va*." }),
  ]},
  { key: "panorama", start: 650, hue: "blue", beats: [
    c("quote", { image: IM("rt_rata_sola", "Una rata gris sola sobre el piso de un granero, mirando, realista."), text: "No te tiene rencor. Te tiene de *proveedor*." }),
    r(IM("rt_granero_viejo", "Un granero antiguo de campo bien mantenido, con grano guardado en silos."), { hold: true }),
    c("splitlist", { title: "Curá la causa, no el síntoma", items: ["No pelees cada rata", "Quitales la razón de venir", "Una vez, no para siempre"], palette: "A" }),
  ]},
  { key: "accion", start: 690, hue: "amber", beats: [
    c("checklist", { title: "Esta semana", items: ["Todo el alimento en metal con tapa", "Lana de acero en cada agujero", "Cebo de harina y yeso, o menta"] }),
    c("journey", { eyebrow: "El sistema completo", title: "En este orden", accent: "accent", waypoints: [
      { x: 0, y: 0, z: 0, image: IM("rt_jrn_comida", "Alimento guardado en tachos de metal con tapa."), label: "Quitar comida", num: "1", dwell: 2.4, travel: 1.5 },
      { x: 1.2, y: -0.3, z: 0.3, image: IM("rt_jrn_sellar", "Lana de acero tapando un agujero en la pared."), label: "Sellar", num: "2", dwell: 2.4, travel: 1.5 },
      { x: 2.4, y: 0.2, z: -0.2, image: IM("rt_jrn_cebo", "Tapitas con cebo casero junto a la pared."), label: "Cebo $1", num: "3", dwell: 2.4, travel: 1.5 },
      { x: 3.6, y: -0.2, z: 0.2, image: IM("rt_jrn_limpio", "Un galpón limpio y recuperado, sin ratas."), label: "Recuperar", num: "4", dwell: 2.6, travel: 1.4 },
    ]}),
    r(IM("rt_galpon_recuperado", "Un hombre de campo satisfecho en su galpón limpio y ordenado, sin ratas."), { hold: true }),
  ]},
  { key: "injerto3", start: 730, hue: "red", beats: [
    c("aged", { heading: "Todo en el manual", lines: ["Las recetas de cada cebo, el mapa de entradas,", "los olores repelentes,", "cómo proteger gallinero y granero."], image: IM("rt_manual_abierto", "Un manual casero abierto con láminas de cómo sacar plagas, papel envejecido.") }),
    c("bars", { title: "El precio de hoy", unit: "", bars: [{ label: "Por separado", value: 158 }, { label: "Hoy", value: 27 }] }),
    c("quote", { image: IM("rt_manos_lana", "Las manos de un hombre sosteniendo lana de acero y cemento, la solución barata."), text: "Si no es para usted, le devuelvo cada centavo. El riesgo lo pongo *yo*." }),
  ]},
  { key: "cierre", start: 770, hue: "blue", beats: [
    c("quote", { image: IM("rt_galpon_paz", "Un galpón de campo tranquilo y limpio al atardecer, en paz, sin plagas."), text: "No pelees el síntoma. Curá la *causa*." }),
    c("headline", { tokens: ["Comida", "6", "meses", "sin", { t: "heladera" }], eyebrow: "La próxima vez", bg: "image", image: IM("rt_despensa", "Una despensa de campo con verduras y frascos guardados, insinuando conservar sin frío.") }),
    r(IM("rt_zanahorias", "Zanahorias y verduras guardadas en un cajón con arena, conservación sin heladera."), { kicker: "Sin enchufar nada", hold: true }),
    c("quote", { image: IM("rt_oficio", "Las manos de un hombre de campo trabajando con dignidad, oficio, luz de taller."), text: "No es magia. Es *oficio*. Y todavía se puede aprender." }),
  ]},
];
// tiempos REALES de sección (de tu lectura del avatar, 27.3 min)
const REAL = { intro: 11, tomas: 180.2, enemigo: 272.97, comida: 365.3, cebo: 484.59, injerto1: 650.5, olores: 701.3, trampa: 790.6, cerrar: 874.2, detective: 1004, injerto2: 1081.47, preguntas: 1175.47, gallinero: 1271.67, panorama: 1364.6, accion: 1445.26, injerto3: 1504.5, cierre: 1566.1 };
for (const s of SECTIONS) if (REAL[s.key] != null) s.start = REAL[s.key];
const VIDEO_END = 1639;
const FLUX = [
  { sec: "comida", src: "img/rf_tacho_metal.png", at: "guardados en recipientes de metal", kicker: "En metal con tapa" },
  { sec: "comida", src: "img/rf_plato_perro.png", at: "La comida del perro no la deje", kicker: "Levantá el plato de noche" },
  { sec: "comida", src: "img/rf_canilla_gotea.png", at: "arregle las canillas que gotean", kicker: "Cortá el agua" },
  { sec: "cebo", src: "img/rf_harina_yeso.png", at: "harina o avena o semola", kicker: "Mitad harina, mitad yeso" },
  { sec: "cebo", src: "img/rf_cebo_tapita.png", at: "lo pone en tapitas", kicker: "Pegado a la pared" },
  { sec: "cebo", src: "img/rf_bicarbonato.png", at: "con bicarbonato de sodio mezclado", kicker: "O con bicarbonato" },
  { sec: "olores", src: "img/rf_menta_algodon.png", at: "unas gotas en bolitas de algodon", kicker: "Algodón con menta" },
  { sec: "trampa", src: "img/rf_lata_manteca.png", at: "una lata vacia", kicker: "Lata con manteca de maní" },
  { sec: "cerrar", src: "img/rf_agujero_moneda.png", at: "del tamano de una moneda", kicker: "Del tamaño de una moneda" },
  { sec: "cerrar", src: "img/rf_lana_acero.png", at: "rellenandolos bien apretados con lana", kicker: "Lana de acero" },
  { sec: "cerrar", src: "img/rf_cemento_sella.png", at: "un poco de cemento", kicker: "Y cemento encima" },
  { sec: "detective", src: "img/rf_bolitas.png", at: "Busque las bolitas negras", kicker: "Las bolitas" },
  { sec: "detective", src: "img/rf_marca_grasa.png", at: "Busque las marcas de grasa", kicker: "Marcas de grasa = autopista" },
  { sec: "injerto2", src: "img/rf_veneno_caja.png", at: "vuelve a la ferreteria y compra otra", kicker: "El negocio del veneno" },
  { sec: "gallinero", src: "img/rf_comedero_gallinas.png", at: "levante los comederos al atardecer", kicker: "Comedero arriba de noche" },
  { sec: "gallinero", src: "img/rf_silo_grano.png", at: "el grano va en silos", kicker: "Grano en metal sellado" },
];

let CW = [];
try { const C = JSON.parse(fs.readFileSync("public/captions_ratas.json", "utf8")); CW = (C.words || C).map((x) => ({ t: x.text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(), s: (x.startMs || 0) / 1000 })); } catch { CW = []; }
const normTok = (p) => p.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
const matchAt = (p, i) => { let ok = 0; for (let j = 0; j < p.length; j++) if (CW[i + j] && CW[i + j].t === p[j]) ok++; return ok; };
const findMs = (phrase, after) => { if (!CW.length) return null; const full = normTok(phrase); for (const len of [6, 5, 4, 3]) { const p = full.slice(0, len); if (p.length < 3) continue; for (let i = 0; i < CW.length - p.length; i++) { if (CW[i].s < after) continue; if (matchAt(p, i) >= Math.ceil(p.length * 0.8)) return CW[i].s; } } return null; };
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);

// insertar FLUX (con at:) y re-ordenar cada sección por tiempo de ancla
for (const fx of FLUX) { const s = SECTIONS.find((x) => x.key === fx.sec); if (s) s.beats.push({ t: "raw", src: fx.src, at: fx.at, w: 0.42, ...(fx.kicker ? { kicker: fx.kicker } : {}) }); }
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const eff = sec.beats.map((b, i) => { if (i === 0) return sec.start; const ph = pinPhrase(b); const t = ph ? findMs(ph, sec.start + 0.3) : null; return t != null && t > sec.start && t < end ? t : sec.start + ((i + 0.5) / n) * (end - sec.start); });
  const order = sec.beats.map((b, i) => i).sort((a, b) => eff[a] - eff[b] || a - b);
  sec.beats = order.map((i) => sec.beats[i]);
}

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
const CLIP_SWAP = { rt_grano_suelto: "rt_grain_spill", rt_canilla_gotea: "rt_drip_tap", rt_lana_acero: "rt_steel_wool", rt_menta: "rt_mint", rt_gallinero: "rt_chickens", rt_rata_mira: "rt_rat", rt_linterna: "rt_flashlight", rt_cemento: "rt_cement", rt_silo: "rt_grain_bin", rt_balde_trampa: "rt_bucket_trap" };
let swapped = 0, animated = 0;
for (const b of beats) { if (b.kind === "raw" && typeof b.src === "string" && b.src.startsWith("img/")) { const name = b.src.slice(4, -4); const clip = CLIP_SWAP[name]; if (clip && fs.existsSync(`public/broll/${clip}.mp4`)) { b.src = `broll/${clip}.mp4`; swapped++; } } }
for (const b of beats) { if (b.kind === "raw" && typeof b.src === "string" && b.src.startsWith("img/")) { const name = b.src.slice(4, -4); if (fs.existsSync(`public/vid/${name}.mp4`)) { b.src = `vid/${name}.mp4`; animated++; } } }

fs.writeFileSync("beatsheet/ratas.json", JSON.stringify({ video: "ratas", tutorial: true, beats }, null, 1));
fs.writeFileSync("public/img/prompts_ratas_imgs.json", JSON.stringify([...IMAGES.entries()].map(([name, prompt]) => ({ name, prompt })), null, 2));
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · imágenes: ${IMAGES.size} · captions: ${CW.length ? "sí" : "NO"} · swap YT:${swapped} LTX:${animated}`);
