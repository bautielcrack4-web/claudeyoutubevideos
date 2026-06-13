// gen_meriendas.mjs — genera beatsheet/meriendas.json desde una tabla por sección.
// Distribuye duraciones variadas dentro de cada sección (holds largos en fotos clave,
// cards de texto más cortas), mezcla RawShot (stock+IA) con componentes estructurados
// para pasar el gate de varcheck (raw <=55% por conteo de beats).
import fs from "fs";

// ── resolver de assets (extensión correcta) ──────────────────────────────────
const PHOTOS = new Set([
  "mer_azucar_impalpable","mer_canela_rama","mer_coco_rallado","mer_durazno",
  "mer_frasco_dulce","mer_gelatina_fruta","mer_lata_galletas","mer_maiz_blanco",
  "mer_membrillo","mer_nuez","mer_pan_canasta","mer_pan_duro","mer_pasas_uva",
  "mer_queso_fresco",
]);
const srcOf = (name) => {
  if (name.startsWith("ai_")) return `img/${name}.png`;
  if (PHOTOS.has(name)) return `broll/${name}.jpg`;
  return `broll/${name}.mp4`;
};

// hue por sección — SOLO tokens válidos en todos los componentes (rule/headline = blue|amber|red)
const HUES = ["amber", "red", "blue"];

// ── helpers de beat ───────────────────────────────────────────────────────────
const r = (name, o = {}) => ({ t: "raw", name, ...o });            // foto/clip full-bleed
const c = (kind, props = {}) => ({ t: kind, ...props });            // componente
let fSide = 0;
const f = (name, o = {}) => ({ t: "float", src: srcOf(name), side: (fSide++ % 2 ? "left" : "right"), ...o }); // inserto flotante

// peso base por tipo (controla la duración relativa dentro de la sección)
const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.05, stat: 1.0, aged: 1.2,
  checklist: 1.2, splitlist: 1.1, bars: 1.25, process: 1.45, journey: 2.4, infzoom: 1.3,
  annotated: 1.3, callout: 1.0, chips: 1.0 };

// ── SECCIONES ────────────────────────────────────────────────────────────────
// start = inicio real (de captions). beats en orden. hold:true alarga una foto clave.
const SECTIONS = [
  { key: "intro", start: 0.1, beats: [
    // HOOK: tarjetas de comida flotando "sin revelar" (open-loop hermoso)
    c("teasecards", { w: 1.15, eyebrow: "Algunas merecen volver…", title: "¿Cuántas te acordás?", cards: [
      { src: srcOf("rc_tortas_fritas"), label: "Tortas fritas" },
      { src: srcOf("mer_arroz_leche"), label: "Arroz con leche" },
      { src: srcOf("rc_alfajores"), label: "Alfajores de maicena" },
      { src: srcOf("rc_flan"), label: "Flan casero" },
      { src: srcOf("mer_chocolate_caliente"), label: "Chocolate espeso" },
      { src: srcOf("rc_mazamorra"), label: "Mazamorra" },
      { src: srcOf("mer_dulce_leche_olla"), label: "Dulce de leche" },
    ]}),
    // arranque DINÁMICO: clips reales en movimiento + cortes CORTOS al inicio (w bajo)
    r("mer_harina_manos", { kicker: "Un sábado a la tarde", w: 0.42 }),
    f("mer_cuchara_madera", { w: 0.42 }),
    r("mer_abuela_cocina", { w: 0.45 }),
    c("quote", { image: srcOf("mer_abuela_manos"), text: "Estas manos ya no son las de antes, pero todavía se *acuerdan*.", w: 0.75 }),
    f("mer_horno_abrir", { w: 0.45 }),
    r("mer_amasar_pan", { w: 0.42 }),
    c("stat", { value: 82, suffix: "", label: "años — y me acuerdo de todo", eyebrow: "La que te habla" }),
    f("ai_abuela_retrato"),
    r("mer_cocina_vintage", { w: 0.8 }),
    c("headline", { tokens: ["Algo", "se", "está", { t: "perdiendo" }], eyebrow: "Hoy quiero contarte", bg: "image", image: srcOf("ai_abuela_cocina2") }),
    f("mer_pan_recien"),
    c("infzoom", { images: [srcOf("mer_cocina_vintage"), srcOf("ai_mesa_70s"), srcOf("mer_abuela_cocina")] }),
    r("mer_abuela_sonrie"),
  ]},
  { key: "riqueza", start: 88.04, beats: [
    r("ai_mesa_70s", { hold: true }),
    c("aged", { heading: "En casa no sobraba la plata", lines: ["Éramos muchos. Cada peso se cuidaba.", "Pero nunca faltó algo rico a media tarde."] }),
    r("mer_familia_70s"),
    c("splitlist", { title: "Con esto alcanzaba", items: ["Harina", "Azúcar", "Un poco de leche", "Manos que sabían"], palette: "G" }),
    r("mer_abuela_delantal"),
    r("mer_manos_viejas2", { hold: true }),
    c("bars", { title: "Dónde estaba la riqueza", unit: "", bars: [{ label: "El bolsillo", value: 2 }, { label: "Las manos", value: 10 }] }),
    c("quote", { image: srcOf("mer_ventana_luz"), text: "Comida que alimentaba el cuerpo y el *alma*." }),
    r("mer_ventana_luz"),
  ]},
  { key: "s01", start: 157.16, beats: [
    c("rule", { number: "01", title: "Pan con manteca y azúcar" }),
    f("mer_pan_rebanada"),
    r("mer_manteca_pan", { hold: true }),
    r("ai_pan_manteca_azucar2", { kicker: "Azúcar, la que había" }),
    r("mer_azucar_cae", { hold: true }),
    c("checklist", { title: "Pan con azúcar", items: ["Pan del día", "Manteca", "Azúcar", "Una gota de canela"] }),
    r("ai_pan_azucar"),
    c("quote", { image: srcOf("mer_canela"), text: "No se perdió el pan con azúcar. Se perdió que lo hicieran *para vos*." }),
  ]},
  { key: "s02", start: 220.04, beats: [
    c("rule", { number: "02", title: "Tortas fritas" }),
    r("mer_lluvia_ventana", { hold: true, kicker: "Día de lluvia" }),
    r("mer_masa_amasar"),
    r("mer_masa_estirar"),
    r("rc_fry_pan", { hold: true }),
    r("mer_freir_masa"),
    r("rc_tortas_fritas", { hold: true, kicker: "Con azúcar arriba" }),
    c("process", { title: "Cómo salían", steps: [
      { title: "Amasar", image: srcOf("mer_masa_amasar") },
      { title: "Estirar y tajear", image: srcOf("mer_masa_estirar") },
      { title: "A la grasa", image: srcOf("mer_freir_masa") },
      { title: "Azúcar arriba", image: srcOf("rc_tortas_fritas") },
    ]}),
    c("checklist", { title: "Lo que pedía la torta frita", items: ["Harina y grasa", "Agua tibia, sal", "La lluvia", "La abuela", "Paciencia"] }),
    c("quote", { image: srcOf("ai_tortas_lluvia"), text: "*Estilo casero*, dice la caja. Como si el estilo se metiera en una bolsa." }),
  ]},
  { key: "s03", start: 291.36, beats: [
    c("rule", { number: "03", title: "Pan casero" }),
    r("mer_amasar_pan"),
    r("mer_masa_bowl", { hold: true }),
    r("mer_pan_horneado"),
    r("mer_pan_recien", { hold: true, kicker: "Ese olor no se olvida" }),
    c("quote", { image: srcOf("mer_pan_cortar2"), text: "Un olor que si lo sentís una vez, no te lo olvidás *nunca*." }),
    f("mer_pan_cortar2"),
    c("bars", { title: "Una mañana entera en la cocina", unit: "min", bars: [{ label: "Antes", value: 180 }, { label: "Hoy", value: 5 }] }),
  ]},
  { key: "s04", start: 347.2, beats: [
    c("rule", { number: "04", title: "Alfajores de maicena" }),
    r("mer_galletas_bandeja"),
    c("annotated", { image: srcOf("rc_alfajores"), caption: "Tratar la masa con respeto", annotations: [
      { x: 50, y: 30, label: "Tapita de maicena" },
      { x: 50, y: 60, label: "Dulce de leche" },
      { x: 18, y: 55, label: "Coco rallado" },
    ]}),
    r("mer_coco_rallado", { kicker: "Bordes de coco" }),
    r("ai_alfajor_corte", { hold: true }),
    r("mer_dulce_leche_cuch"),
    c("quote", { image: srcOf("ai_alfajor_corte"), text: "El de la fábrica nunca va a tener lo que tenía el de mi tía: sus *manos*." }),
  ]},
  { key: "s05", start: 403.46, beats: [
    c("rule", { number: "05", title: "Arroz con leche" }),
    f("mer_leche_verter"),
    r("mer_arroz_leche", { hold: true }),
    r("mer_olla_revolver", { kicker: "Revolver y revolver" }),
    c("process", { title: "Arroz con leche", steps: [
      { title: "Al fuego", image: srcOf("mer_olla_vieja") },
      { title: "Revolver", image: srcOf("mer_cuchara_revolver2") },
      { title: "Canela", image: srcOf("mer_canela_rama") },
      { title: "Enfriar", image: srcOf("rc_arroz_leche") },
    ]}),
    r("rc_arroz_leche", { hold: true }),
    c("quote", { image: srcOf("mer_cuchara_revolver2"), text: "Revolver era la excusa para que alguien se quedara en la cocina *con vos*." }),
  ]},
  { key: "s06", start: 485.0, beats: [
    c("rule", { number: "06", title: "Las galletitas de la abuela" }),
    r("mer_nina_abuela", { hold: true }),
    r("mer_cortar_galletas", { kicker: "Con un vaso dado vuelta" }),
    r("mer_nino_cocina"),
    r("mer_horno_vidrio", { hold: true }),
    c("quote", { image: srcOf("mer_horno_vidrio"), text: "Se perdieron porque ya nadie le enseña a un chico a cocinar *a su lado*." }),
  ]},
  { key: "s07", start: 509.54, beats: [
    c("rule", { number: "07", title: "Mate cocido y tostadas" }),
    r("rc_mate", { hold: true }),
    f("mer_te_servir"),
    r("mer_tostada_manteca"),
    r("mer_mesa_familia", { hold: true, kicker: "Todos alrededor" }),
    c("splitlist", { title: "Lo que de verdad se murió", items: ["El ritual", "La mesa compartida", "Mirarse a la cara"], palette: "B", cross: true }),
    r("ai_mate_bizcochos"),
  ]},
  { key: "s08", start: 559.14, beats: [
    c("rule", { number: "08", title: "Budín de pan" }),
    r("mer_pan_duro", { kicker: "Nada se tiraba" }),
    r("mer_caramelo_dorado"),
    r("mer_pasas_uva"),
    r("ai_budin_molde", { hold: true }),
    r("rc_budin_pan", { hold: true }),
    c("aged", { heading: "Nada se desperdicia", lines: ["El pan duro no se tiraba jamás.", "El domingo era budín de pan."], image: srcOf("mer_budin_pan") }),
    c("quote", { image: srcOf("mer_budin_pan"), text: "Todo se transforma en algo bueno si le ponés *cariño*." }),
  ]},
  { key: "s09", start: 617.67, beats: [
    c("rule", { number: "09", title: "Bizcochitos de grasa" }),
    r("rc_bizcochitos", { hold: true }),
    r("mer_bizcochos"),
    f("mer_miel"),
    c("quote", { image: srcOf("mer_bizcochos"), text: "Hacerlos era el punto. No el comerlos. El *hacerlos*." }),
  ]},
  { key: "s10", start: 669.28, beats: [
    c("rule", { number: "10", title: "Leche con vainilla" }),
    r("mer_leche_tibia", { hold: true }),
    r("mer_azucar_quemada", { kicker: "Azúcar quemada arriba" }),
    r("ai_leche_vainilla", { hold: true }),
    r("mer_manos_taza"),
    c("quote", { image: srcOf("mer_manos_taza"), text: "Antes le dábamos una taza tibia y la falda de la madre. ¿Qué cura *más*?" }),
  ]},
  { key: "s11", start: 721.2, beats: [
    c("rule", { number: "11", title: "La torta de la abuela" }),
    r("mer_torta_amarilla", { hold: true }),
    r("mer_huevos_batir"),
    r("mer_limon_rallar", { kicker: "Ralladura de limón" }),
    r("ai_torta_abuela", { hold: true }),
    c("callout", { image: srcOf("mer_torta_porcion"), figure: "«Lo que la masa pida»", caption: "Sin balanza. Sin números. Solo sus manos." }),
    r("mer_torta_porcion"),
    c("aged", { heading: "Recetas que nunca se escribieron", lines: ["Vivían solo en la memoria de las manos.", "Murieron con sus dueñas, en silencio."] }),
  ]},
  { key: "s12", start: 782.56, beats: [
    c("rule", { number: "12", title: "Pan con tomate" }),
    r("mer_tomate_huerta", { hold: true }),
    r("rc_pan_tomate"),
    r("mer_pan_tomate", { kicker: "Aceite y sal gruesa" }),
    c("quote", { image: srcOf("mer_fruta_canasta"), text: "Todo se ve más lindo ahora y sabe a *menos*." }),
    r("mer_fruta_canasta"),
  ]},
  { key: "s13", start: 832.0, beats: [
    c("rule", { number: "13", title: "Masitas secas" }),
    r("rc_masitas", { hold: true }),
    r("mer_masitas_surtido"),
    r("mer_nuez"),
    r("mer_azucar_impalpable", { kicker: "Azúcar impalpable" }),
    c("splitlist", { title: "Recibir con la bandeja", items: ["Con dulce", "Con nuez", "Con azúcar"], palette: "A" }),
    c("quote", { image: srcOf("mer_mesa_mantel"), text: "Recibir con algo hecho por vos era decir: *valés* mis manos." }),
  ]},
  { key: "s14", start: 885.29, beats: [
    c("rule", { number: "14", title: "Dulce de leche casero" }),
    r("mer_leche_jarra"),
    r("rc_dulce_leche", { hold: true }),
    r("mer_dulce_leche_olla", { kicker: "Una hora revolviendo" }),
    c("checklist", { title: "Dulce de leche casero", items: ["Leche", "Azúcar", "Una hora de brazo", "El fondo tostado de la olla"] }),
    r("mer_frasco_dulce", { hold: true }),
    c("quote", { image: srcOf("mer_dulce_leche_olla"), text: "La pelea por el fondo de la olla: uno de mis recuerdos más *felices*." }),
  ]},
  { key: "s15", start: 936.91, beats: [
    c("rule", { number: "15", title: "Sándwich de miga tostado" }),
    r("ai_sandwich_miga", { hold: true }),
    r("mer_sandwich_plancha"),
    c("chips", { bg: "image", image: srcOf("mer_sandwich_plancha"), title: "Casi todo lo rico nacía de…", chips: ["no tirar nada", "aprovechar", "estirar"], hue: "amber" }),
    c("bars", { title: "Comida que se tira por semana", unit: "", bars: [{ label: "Antes", value: 1 }, { label: "Hoy", value: 9 }] }),
    c("quote", { image: srcOf("ai_sandwich_miga"), text: "La abundancia nos volvió *perezosos* en la cocina." }),
  ]},
  { key: "s16", start: 986.99, beats: [
    c("rule", { number: "16", title: "Manzana asada" }),
    r("mer_manzana_horno"),
    r("rc_manzana_asada", { hold: true }),
    r("mer_manzana_asada", { kicker: "Un juguito en el fondo" }),
    c("splitlist", { title: "Por qué se perdió", items: ["Demasiado trabajo, dicen", "El postre tiene que ser de chocolate", "La fruta quedó relegada"], palette: "D", cross: true }),
    c("quote", { image: srcOf("mer_canela_rama"), text: "Dejamos de mirar la fruta como un *postre*." }),
  ]},
  { key: "s17", start: 1040.2, beats: [
    c("rule", { number: "17", title: "Panqueques con dulce de leche" }),
    f("mer_panqueque_sarten"),
    r("mer_panqueque_voltear", { hold: true, kicker: "Dada vuelta por el aire" }),
    r("rc_panqueques", { hold: true }),
    c("callout", { image: srcOf("mer_panqueque_sarten"), figure: "«La del perro»", caption: "La primera siempre salía fea. Era parte del rito." }),
    c("quote", { image: srcOf("rc_panqueques"), text: "Sin esa primera fea, no es lo *mismo*." }),
  ]},
  { key: "s18", start: 1092.49, beats: [
    c("rule", { number: "18", title: "El vigilante" }),
    r("mer_queso_fresco"),
    r("mer_queso_cortar"),
    r("mer_membrillo", { kicker: "Queso y dulce" }),
    c("annotated", { image: srcOf("rc_vigilante"), caption: "El postre de los días de calor", annotations: [
      { x: 32, y: 45, label: "Queso fresco del tambo" },
      { x: 68, y: 50, label: "Dulce de membrillo" },
    ]}),
    c("quote", { image: srcOf("rc_vigilante"), text: "Cuando se apaga un ingrediente, se va todo un *cuarto* de recuerdos." }),
  ]},
  { key: "s19", start: 1145.14, beats: [
    c("rule", { number: "19", title: "Gelatina con frutas" }),
    r("mer_gelatina", { hold: true }),
    r("rc_gelatina", { hold: true }),
    r("mer_gelatina_fruta"),
    r("mer_durazno"),
    c("quote", { image: srcOf("rc_gelatina"), text: "Antes una gelatina que temblaba alcanzaba para una *fiesta*." }),
  ]},
  { key: "s20", start: 1196.0, beats: [
    c("rule", { number: "20", title: "Chocolate caliente espeso" }),
    r("mer_chocolate_caliente", { hold: true }),
    r("ai_chocolate_taza2", { kicker: "Casi le parabas la cuchara" }),
    r("mer_mojar_pan_choco"),
    r("rc_chocolate", { hold: true }),
    c("checklist", { title: "Chocolate de verdad", items: ["Chocolate o cacao", "Leche, no agua", "Una punta de almidón", "Pan duro para mojar"] }),
    c("aged", { heading: "Ese pan duro era oro", lines: ["Lo mojabas y chorreaba chocolate.", "Y hoy lo tiramos."], image: srcOf("mer_pan_partir_mano") }),
  ]},
  { key: "s21", start: 1251.0, beats: [
    c("rule", { number: "21", title: "Mazamorra" }),
    r("mer_maiz_blanco"),
    r("mer_olla_hervir", { hold: true }),
    r("ai_mazamorra2", { kicker: "Maíz blanco, horas al fuego" }),
    r("rc_mazamorra", { hold: true }),
    c("aged", { heading: "Cruzó siglos", lines: ["Mi bisabuela, mi abuela, mi madre…", "Mis nietos ni saben qué es."], image: srcOf("mer_campo_casa") }),
    c("quote", { image: srcOf("mer_humo_chimenea"), text: "Se pierde un pedazo de *quiénes somos*. Si no la cuento, se va conmigo." }),
  ]},
  { key: "s22", start: 1311.94, beats: [
    c("rule", { number: "22", title: "Buñuelos de manzana" }),
    r("mer_fruta_canasta"),
    r("rc_bunuelos", { hold: true }),
    r("mer_bunuelos", { kicker: "Chisporroteo del domingo" }),
    c("splitlist", { title: "Aprovechar lo que sobraba", items: ["Manzanas muy blandas", "Masa liviana", "A la sartén"], palette: "A" }),
    c("quote", { image: srcOf("mer_bunuelos"), text: "Se llevó una música que toda la casa *reconocía*." }),
    r("mer_cocina_humo"),
  ]},
  { key: "s23", start: 1384.36, beats: [
    c("rule", { number: "23", title: "Pan con ajo y aceite" }),
    r("mer_pan_ajo", { hold: true }),
    r("rc_pan_ajo"),
    r("mer_aceite_verter2", { kicker: "Un hilo de aceite" }),
    c("quote", { image: srcOf("mer_pan_ajo"), text: "Antes comíamos con el cuerpo, no con la *cabeza*." }),
    f("mer_aceite_oliva"),
  ]},
  { key: "s24", start: 1445.55, beats: [
    c("rule", { number: "24", title: "Flan casero" }),
    r("mer_huevos_batir"),
    r("mer_flan_caramelo", { hold: true }),
    r("rc_flan", { kicker: "Caramelo chorreando" }),
    r("mer_flan_temblar", { hold: true }),
    c("quote", { image: srcOf("rc_flan"), text: "Lo bueno casi siempre lleva tiempo. Y el tiempo es lo que ya no *damos*." }),
  ]},
  { key: "s25", start: 1508.48, beats: [
    c("rule", { number: "25", title: "El polvorón" }),
    r("rc_polvoron", { hold: true }),
    f("mer_polvoron"),
    r("mer_galleta_morder", { kicker: "Se deshacía en la boca" }),
    r("mer_lata_galletas"),
    c("quote", { image: srcOf("mer_lata_galletas"), text: "Lo descartable nos cambió hasta la forma de *querer* las cosas." }),
  ]},
  { key: "s26", start: 1578.98, beats: [
    c("headline", { tokens: ["La", "merienda", { t: "compartida" }], eyebrow: "Y la más importante", bg: "image", image: srcOf("mer_mesa_compartir") }),
    r("ai_mesa_compartida2", { hold: true }),
    r("mer_mesa_compartir"),
    r("mer_nieta_reir", { hold: true }),
    r("mer_velas_torta"),
    c("quote", { image: srcOf("mer_abuela_nietos"), text: "La comida era la excusa. Lo importante era la mesa *llena*." }),
    r("mer_abuela_nietos", { hold: true }),
  ]},
  { key: "cierre", start: 1643.7, beats: [
    c("quote", { image: srcOf("mer_ventana_luz"), text: "No te cuento esto para que sientas pena. Todavía estás a *tiempo*." }),
    r("mer_mesa_atardecer", { hold: true }),
    c("journey", { eyebrow: "Esta tarde, o el domingo", title: "Andá a la cocina", accent: "accent", waypoints: [
      { x: 0, y: 0, z: 0, image: srcOf("mer_abuela_delantal"), label: "Aunque salga fea", num: "1", dwell: 2.6, travel: 1.6 },
      { x: 1.2, y: -0.4, z: 0.3, image: srcOf("mer_olla_revolver"), label: "Revolvé un arroz", num: "2", dwell: 2.6, travel: 1.6 },
      { x: 2.4, y: 0.3, z: -0.2, image: srcOf("mer_mesa_compartir"), label: "Sentate con alguien", num: "3", dwell: 2.6, travel: 1.6 },
      { x: 3.6, y: -0.2, z: 0.2, image: srcOf("mer_manos_taza"), label: "Sin teléfono", num: "4", dwell: 2.8, travel: 1.6 },
      { x: 4.8, y: 0.1, z: 0, image: srcOf("ai_mesa_compartida2"), label: "Mirándola a los ojos", num: "5", dwell: 3.0, travel: 1.4 },
    ]}),
    c("aged", { heading: "Cociná algo para alguien hoy", lines: ["El cariño se pasa de mano en mano,", "mientras todavía estamos."] }),
    r("mer_manos_rezar", { hold: true }),
    c("quote", { image: srcOf("mer_abuela_sonrie"), text: "Comé algo hecho en casa, por favor. Hacelo *por mí*." }),
    r("mer_abuela_sonrie", { hold: true }),
  ]},
];

const VIDEO_END = 1713;

// ── ANCLAJE POR FRASE (sync fino) ─────────────────────────────────────────────
// Cada beat de texto (quote / o con `at`) se clava al ms EXACTO en que la voz dice
// esa frase; las fotos se reparten proporcionalmente en los huecos entre anclas.
const CAPS = JSON.parse(fs.readFileSync("public/captions_meriendas.json", "utf8"));
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
fs.writeFileSync("beatsheet/meriendas.json", JSON.stringify({ video: "meriendas", beats }, null, 1));
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100*raw/beats.length).toFixed(0)}%) · no-raw: ${beats.length-raw}`);
console.log(`dur total: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s`);
