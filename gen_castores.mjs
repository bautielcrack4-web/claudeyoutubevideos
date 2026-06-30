// gen_castores.mjs — documental "Los castores paracaidistas de Idaho (1948)" (faceless, voz clonada).
// CLIP-DRIVEN + SYNC POR FRASE: cada toma se ancla a la frase EXACTA del narrador (at:"verbatim"
// → ms de captions). Componentes = puntuación encima del video. Emite beatsheet/castores.json.
import fs from "fs";
const fexists = (p) => fs.existsSync(`public/${p}`);
const img = (name) => `img/${name}.png`;

const P = (s) => `Foto documental real, 16:9 horizontal apaisado. ${s} Como un fotograma de un documental viejo de naturaleza: con imperfecciones, luz natural despareja, saturación baja, nada pulido, sin apariencia de IA.`;
const DP = (s) => `Infografía horizontal, relación de aspecto EXACTA 16:9 (1792x1024). Ilustración hecha a mano profesional, limpia, editorial, tipo lámina de historia natural antigua. ${s} Fondo marfil claro con textura de papel sutil, líneas marrón oscuro, acentos verde oliva y celeste agua apagado, papel envejecido. Minimalista, muy clara, se entiende en un segundo. Textos en español, breves.`;
const MP = (s) => `Mapa ilustrado vintage, estilo cartografía de atlas antiguo, 16:9 horizontal apaisado. ${s} Papel de mapa envejecido color crema, líneas de tinta marrón, relieve y ríos suaves, una pequeña rosa de los vientos, hermoso y detallado, sin texto ilegible.`;

const rc = (name, o = {}) => ({ t: "rc", name, ...o });
const r = (name, scene, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: P(scene) }, ...o });
const dg = (name, scene, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: DP(scene) }, ...o });
const mapimg = (name, scene, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: MP(scene) }, ...o });
const smap = (name, scene, props = {}) => ({ t: "spreadmap", mapImage: img(name), gen: { type: "image", name, prompt: MP(scene) }, ...props });
const c = (kind, props = {}, gi = null) => {
  const b = { t: kind, ...props };
  if (gi) { b.image = img(gi[0]); b.gen = { type: "image", name: gi[0], prompt: P(gi[1]) }; }
  return b;
};

const HUES = ["amber", "blue", "red"];
const W = { raw: 1.2, rc: 1.0, quote: 1.0, headline: 0.95, stat: 0.95, aged: 1.05, checklist: 1.05,
  splitlist: 1.0, bars: 1.1, process: 1.3, journey: 2.6, infzoom: 1.1, annotated: 1.2, callout: 1.0, chips: 0.95,
  spreadmap: 2.4, timeline: 2.8, foundertree: 2.4 };

// ── SECCIONES — cada una arranca en startAt (frase verbatim → ms). Beats anclados por at:. ──
const S = [
  { key: "intro", start: 0.2, fb: "ca_valle_avion", beats: [
    rc("nw_old_plane", { hold: true, w: 1.0 }),
    rc("nw_cargo_parachute", { at: "colgando de pequenos paracaidas blancos" }),
    rc("nw_wood_crate", { at: "caian cajas de madera" }),
    rc("cv_beaver_face", { at: "viajaba un animal vivo", hold: true }),
    rc("nw_wwii_parachute", { at: "No eran soldados" }),
    rc("cv_beaver_swim", { at: "Eran castores", hold: true }),
    rc("nw_beaver_parachute", { at: "metidos en cajas lanzados desde aviones" }),
    rc("st_mountain_valley", { at: "un valle perdido en medio" }),
  ] },
  { key: "real", startAt: "Parece una broma", fb: "ca_archivo_film", beats: [
    rc("nw_old_map", { at: "documentada en los archivos del gobierno" }),
    rc("nw_fur_future_film", { at: "una vieja pelicula filmada en aquella epoca", hold: true }),
  ] },
  { key: "teaser2", startAt: "Y lo mas increible de toda esta historia", fb: "ca_humedal", beats: [
    rc("cv_beaver_dam", { at: "lo que esos animales hicieron despues", hold: true }),
    rc("nw_scientist_stream", { at: "los cientificos mas serios del mundo" }),
    rc("st_drone_wetland", { at: "el agua y hasta el fuego" }),
  ] },
  { key: "posguerra", startAt: "tenemos que retroceder", fb: "ca_pueblo_40s", beats: [
    rc("nw_wwii_parachute", { at: "al final de la Segunda Guerra Mundial", hold: true }),
    rc("nw_postwar_town", { at: "Se construian casas nuevas" }),
    rc("st_mountain_valley", { at: "cerca de un lago hermoso rodeado de montanas" }),
    rc("cv_irrigation_canal", { at: "cavaron canales de riego" }),
  ] },
  { key: "dueno", startAt: "Habian encontrado su pedacito de paraiso", fb: "ca_castor_retrato", beats: [
    rc("cv_beaver_portrait", { at: "ese dueno era el castor", hold: true }),
  ] },
  { key: "quees", startAt: "el castor no es un animal cualquiera", fb: "ca_castor_paisaje", beats: [
    rc("cv_beaver_dam_aerial", { at: "mas transforma el paisaje de todo el planeta", hold: true }),
  ] },
  { key: "biologia", startAt: "Pensemos en lo que es realmente un castor", fb: "ca_castor_dientes", beats: [
    rc("cv_beaver_walk", { at: "pesar mas de veinte kilos" }),
    c("annotated", { at: "tiene unos dientes anaranjados", caption: "Una herramienta viviente", annotations: [{ x: 44, y: 34, label: "Dientes anaranjados, más duros que el metal" }, { x: 30, y: 60, label: "Pelaje aceitoso e impermeable" }] }, ["ca_castor_ingeniero", "Un castor de perfil mostrando sus dientes y pelaje"]),
    rc("cv_beaver_face", { at: "nunca dejan de crecer en toda su vida" }),
    rc("cv_beaver_fell", { at: "tirar abajo un arbol entero en una noche" }),
  ] },
  { key: "construir", startAt: "El castor es un ingeniero obsesivo", fb: "ca_castor_construye", beats: [
    rc("cv_beaver_carry", { at: "Corta troncos y ramas" }),
    rc("cv_beaver_build", { at: "hasta levantar una represa" }),
    rc("st_pond_calm", { at: "el agua se acumula sube se expande" }),
    rc("cv_beaver_lodge", { at: "el castor construye su casa", hold: true }),
    rc("cv_beaver_under", { at: "la entrada escondida bajo el agua" }),
  ] },
  { key: "catastrofe", startAt: "Para un bosque salvaje", fb: "ca_campo_inundado", beats: [
    rc("cv_orchard", { at: "lleno de huertos casas y caminos" }),
    rc("cv_flooded_field", { at: "era una catastrofe", hold: true }),
  ] },
  { key: "plaga", startAt: "Los castores hacian lo unico que saben hacer", fb: "ca_campo_inundado", beats: [
    rc("cv_log_jam", { at: "Taponaban los canales de riego" }),
    rc("cv_flooded_field", { at: "Inundaban los campos recien sembrados" }),
    rc("cv_beaver_fell", { at: "Tumbaban los arboles frutales" }),
    c("headline", { tokens: ["Se", "convirtio", "en", "una", { t: "plaga" }], eyebrow: "El castor", bg: "image" }, ["ca_castor_plaga", "Un castor junto a un campo agrícola inundado, atardecer"]),
  ] },
  { key: "distinto", startAt: "La solucion facil", fb: "ca_oficina_40s", beats: [
    rc("st_dry_riverbed", { at: "Poner trampas eliminarlos a todos" }),
    rc("nw_scientist_stream", { at: "un pequeno grupo de personas penso distinto" }),
    c("splitlist", { title: "En vez de matarlos…", items: ["¿Y si los mudamos?", "Lejos, a las montañas salvajes", "Que hagan lo que mejor saben"], palette: "G" }),
  ] },
  { key: "como", startAt: "La idea era hermosa", fb: "ca_montanas_idaho", beats: [
    rc("st_forest_aerial", { at: "uno de los rincones mas remotos", hold: true }),
    rc("st_mountain_valley", { at: "sin un solo camino que la cruzara" }),
    rc("cv_mule_train", { at: "a caballo y a lomo de mula" }),
  ] },
  { key: "sufrian", startAt: "los castores en ese viaje brutal sufrian", fb: "ca_castor_agua", beats: [
    rc("cv_beaver_under", { at: "el castor es ante todo un animal de agua" }),
    rc("cv_beaver_portrait", { at: "doble capa de pelaje aceitoso" }),
    rc("cv_mule_train", { at: "morian de calor en el camino", hold: true }),
    rc("cv_horse_pack", { at: "las mulas detestaban cargar esas cajas" }),
  ] },
  { key: "fallaba", startAt: "El metodo no servia", fb: "ca_mula", beats: [
    c("aged", { heading: "El método fallaba", lines: ["Lento. Carísimo.", "Y mataba a los animales que querían salvar."], image: img("ca_mula_caja") }, ["ca_mula_caja", "Una mula cargando una caja de madera por un sendero de montaña, años 40"]),
  ] },
  { key: "heter", startAt: "aparece el hombre que convirtio esta historia", fb: "ca_elmo", beats: [
    r("ca_elmo", "Retrato de un funcionario de caza y pesca de los años 40, hombre con sombrero de ala, mirada decidida, en blanco y negro envejecido", { hold: true }),
    rc("nw_wwii_parachute", { at: "vio algo que sobraba por todas partes" }),
    rc("nw_wwii_parachute", { at: "Paracaidas militares de los que se habian usado" }),
  ] },
  { key: "idea", startAt: "Si no podemos llevar a los castores por tierra", fb: "ca_paracaidas_cielo", beats: [
    c("headline", { tokens: ["Los", "vamos", "a", "tirar", "desde", "el", { t: "cielo" }], eyebrow: "Si no se puede por tierra…", bg: "image" }, ["ca_paracaidas_cielo", "Un cielo enorme con un paracaídas blanco bajando, vista desde el suelo"]),
    rc("nw_plane_door_drop", { at: "se pueda tirar desde un avion" }),
    rc("nw_parachute_land", { at: "que se abra solo al tocar el suelo" }),
  ] },
  { key: "caja", startAt: "El primer intento fue con cajas tejidas", fb: "ca_caja_diagrama", beats: [
    rc("cv_beaver_teeth", { at: "masticaba la caja y se escapaba" }),
    dg("dg_caja", "Diagrama en 3 pasos de la caja de madera paracaidista de Elmo Heter: 1) cerrada mientras cae con el paracaídas, 2) toca el suelo, 3) las dos mitades se abren solas y el castor sale. Flechas claras. Título: La caja que se abre sola.", { at: "Inventó una caja de madera especial", hold: true }),
    rc("nw_wood_crate", { at: "las dos mitades de la caja se abrian solas" }),
  ] },
  { key: "geronimo", startAt: "necesitaba un voluntario", fb: "ca_geronimo", beats: [
    rc("cv_beaver_portrait", { at: "A ese castor lo llamaron Geronimo", hold: true }),
    rc("nw_beaver_parachute", { at: "lo subian al avion lo dejaban caer" }),
    rc("cv_beaver_walk", { at: "el animal ya ni se inmutaba" }),
    rc("nw_cargo_parachute", { at: "le habia perdido por completo el miedo a volar" }),
  ] },
  { key: "grandia", startAt: "llego el gran dia", fb: "ca_avion_carga", beats: [
    rc("nw_old_plane", { at: "Gracias a la valentia", hold: true }),
    c("process", { at: "cargaron los aviones con setenta y seis castores", title: "La operación, paso a paso", steps: [
      { title: "76 castores cargados al avión", image: img("ca_avion_t") },
      { title: "Caen bajo paracaídas", image: img("ca_paracaidas_cielo") },
      { title: "La caja se abre sola al tocar el suelo", image: img("dg_caja") },
      { title: "El castor sale libre", image: img("ca_castor_construir") } ] }),
    rc("nw_plane_door_drop", { at: "los fueron soltando por la puerta del avion" }),
  ] },
  { key: "escena", startAt: "Imaginate la escena", fb: "ca_paracaidas_bosque", beats: [
    rc("nw_cargo_parachute", { at: "Los pequenos paracaidas blancos abriendose", hold: true }),
    rc("nw_parachute_land", { at: "Las cajas de madera bajando despacio" }),
    rc("cv_beaver_walk", { at: "saliendo un castor confundido pero ileso" }),
  ] },
  { key: "soloUno", startAt: "solo uno murio", fb: "ca_castor_libre", beats: [
    c("bars", { title: "El resultado del lanzamiento", unit: "", bars: [{ label: "Sobrevivieron", value: 75 }, { label: "Murió", value: 1 }] }),
    rc("cv_beaver_swim", { at: "los otros setenta y cinco aterrizaron perfectamente" }),
    rc("cv_beaver_family", { at: "lo lanzaron en ese mismo grupo, acompanado de tres hembras" }),
  ] },
  { key: "exito", startAt: "La operacion fue un exito rotundo", fb: "ca_rio_bosque", beats: [
    rc("st_river_forest", { at: "el verdadero milagro recien estaba por empezar", hold: true }),
    c("headline", { tokens: ["Hace", "lo", "unico", "que", "sabe:", { t: "construir" }], eyebrow: "Un castor libre", bg: "image" }, ["ca_castor_construir", "Un castor arrastrando una rama hacia el agua al atardecer"]),
  ] },
  { key: "construyen", startAt: "empezaron a construir como locos", fb: "ca_laguna", beats: [
    rc("cv_beaver_dam", { at: "Levantaron represa tras represa" }),
    rc("st_pond_calm", { at: "empezaron a nacer lagunas" }),
    rc("st_wetland_aerial", { at: "humedales enteros extensos llenos de vida", hold: true }),
  ] },
  { key: "represa", startAt: "que es lo que realmente hace la represa", fb: "ca_corte_agua", beats: [
    dg("dg_napa", "Diagrama de corte transversal de una represa de castor: el agua se frena detrás de la represa, se acumula, y se filtra hacia abajo recargando la napa subterránea; el suelo alrededor actúa como esponja. Flechas de agua descendiendo. Título: El agua que se queda.", { at: "Provoca una reaccion en cadena", hold: true }),
    rc("st_water_closeup", { at: "el agua se frena. Queda retenida" }),
    rc("st_spring_source", { at: "empieza a filtrarse hacia abajo" }),
    c("checklist", { at: "se transforma en una esponja gigante", title: "Lo que hace UNA represa de castor", items: ["Frena y guarda el agua", "Recarga el agua subterránea", "Convierte el suelo en una esponja", "Hace volver toda la vida"] }),
  ] },
  { key: "vida", startAt: "Y donde hay agua, vuelve la vida", fb: "ca_humedal_vida", beats: [
    rc("cv_wildflowers", { at: "crecen las plantas y los pastos" }),
    rc("cv_dragonfly", { at: "llegan los insectos" }),
    rc("cv_fish_stream", { at: "aparecen los peces en la laguna" }),
    rc("cv_frog", { at: "las ranas los sapos" }),
    rc("cv_heron", { at: "las aves los patos las garzas" }),
    rc("cv_deer_water", { at: "los ciervos los alces" }),
  ] },
  { key: "ingeniero", startAt: "Un solo castor, con una sola represa", fb: "ca_oasis", beats: [
    rc("st_drone_wetland", { at: "Construye un oasis completo", hold: true }),
    c("headline", { tokens: ["Ingeniero", "de", { t: "ecosistemas" }], eyebrow: "El nombre del castor", bg: "image" }, ["ca_castor_ingeniero", "Un castor sobre su represa con un humedal lleno de vida detrás, luz dorada"]),
  ] },
  { key: "valle", startAt: "eso fue exactamente lo que ocurrio", fb: "ca_valle_verde", beats: [
    rc("cv_beaver_night", { at: "los descendientes de aquellos setenta y cinco" }),
    smap("ca_map_idaho", "Mapa del estado de Idaho y sus montañas salvajes del centro, con ríos y bosques, estilo atlas antiguo hermoso.", { at: "Fueron llenando lentamente todo el valle", origin: [50, 48], yearFrom: 1948, yearTo: 2020, eyebrow: "El agua se expande", title: "El valle, década tras década", hue: "blue" }),
  ] },
  { key: "tragedia", startAt: "tenemos que abrir los ojos y mirar el cuadro completo", fb: "ca_mapa_continente", beats: [
    rc("nw_old_map", { at: "una herida enorme que casi nadie conoce", hold: true }),
  ] },
  { key: "millones", startAt: "Hace unos pocos siglos", fb: "ca_castores_muchos", beats: [
    rc("cv_beaver_dam_aerial", { at: "cientos de millones de castores", hold: true }),
    rc("st_river_forest", { at: "casi todos los rios del continente" }),
    rc("st_wetland_aerial", { at: "una tierra mucho mas humeda" }),
  ] },
  { key: "pieles", startAt: "llego el comercio de pieles", fb: "ca_pieles", beats: [
    rc("nw_fur_pelts", { at: "cazados sin piedad hasta el borde", hold: true }),
    rc("nw_felt_hat", { at: "los sombreros de fieltro que se usaban" }),
    c("quote", { text: "Un continente entero, transformado para fabricar *sombreros*." }, ["ca_sombreros", "Una hilera de sombreros de fieltro antiguos en una vitrina"]),
  ] },
  { key: "desplome", startAt: "Mataron a tantos castores", fb: "ca_rio_seco", beats: [
    c("bars", { title: "La población de castores", unit: "", bars: [{ label: "Antes", value: 100 }, { label: "Después", value: 2 }] }),
    rc("st_dry_riverbed", { at: "miles de represas se rompieron" }),
    rc("st_drought_earth", { at: "Las lagunas se vaciaron" }),
  ] },
  { key: "cicatriz", startAt: "Buena parte del oeste seco y arido", fb: "ca_desierto", beats: [
    rc("st_dry_canyon", { at: "esa tierra polvorienta y reseca", hold: true }),
    rc("st_wetland_aerial", { at: "habian mantenido toda esa tierra humeda" }),
  ] },
  { key: "sentido", startAt: "todo cobra otro sentido", fb: "ca_paracaidas_semilla", beats: [
    rc("nw_beaver_parachute", { at: "mucho mas que mudar una plaga" }),
    rc("st_spring_source", { at: "las semillas del agua", hold: true }),
  ] },
  { key: "olvido", startAt: "casi nadie penso en aquella operacion", fb: "ca_archivo", beats: [
    rc("nw_old_plane", { at: "una anecdota loca y olvidada" }),
    rc("nw_fur_future_film", { at: "se perdio en el fondo de algun archivo" }),
  ] },
  { key: "encontro", startAt: "alguien la encontro", fb: "ca_film_restaurado", beats: [
    rc("nw_fur_future_film", { at: "Hallaron las viejas latas", hold: true }),
    rc("nw_beaver_parachute", { at: "Geronimo cayendo tranquilo desde las nubes" }),
  ] },
  { key: "satelite", startAt: "Lo mas impactante llego cuando los cientificos", fb: "ca_satelite", beats: [
    rc("st_satellite_earth", { at: "miraron desde el espacio", hold: true }),
    rc("st_satellite_green", { at: "fotografias tomadas desde orbita" }),
    rc("st_drone_wetland", { at: "cintas de un verde intenso y brillante", hold: true }),
  ] },
  { key: "crisis", startAt: "un problema nuevo y aterrador", fb: "ca_sequia", beats: [
    rc("st_drought_earth", { at: "La sequia. El cambio en el clima" }),
    rc("nw_wildfire", { at: "Incendios forestales cada vez mas enormes", hold: true }),
    rc("st_dry_riverbed", { at: "se mueren literalmente de sed" }),
  ] },
  { key: "conexion", startAt: "alguien finalmente hizo la conexion", fb: "ca_castor_represa", beats: [
    rc("cv_beaver_dam", { at: "la represa de un castor guarda agua" }),
    c("headline", { tokens: ["No", "es", "una", "plaga.", "Es", "la", { t: "solucion" }], eyebrow: "El castor", bg: "image" }, ["ca_castor_solucion", "Un castor sobre su represa, agua verde y viva alrededor"]),
  ] },
  { key: "ciencia", startAt: "la ciencia se puso a estudiarlo en serio", fb: "ca_humedal_fuego", beats: [
    rc("st_drone_wetland", { at: "resisten muchisimo mejor las sequias" }),
    rc("nw_wildfire", { at: "descubrieron algo sobre el fuego" }),
    rc("st_green_amid_burn", { at: "esos parches verdes empapados de agua", hold: true }),
  ] },
  { key: "vuelta", startAt: "ocurrio algo que parece sacado de un cuento", fb: "ca_castor_protegido", beats: [
    c("splitlist", { title: "El mismo castor, 70 años después", items: ["1948: plaga que se tiraba en paracaídas", "Hoy: buscado, protegido y reintroducido"], palette: "G", cross: true }),
    rc("cv_beaver_portrait", { at: "hoy en pleno siglo veintiuno es buscado" }),
    rc("nw_release_beaver", { at: "reintroducido a proposito" }),
  ] },
  { key: "rogando", startAt: "Equipos de cientificos y voluntarios", fb: "ca_restauracion", beats: [
    rc("nw_bda_build", { at: "construyen a mano represas falsas", hold: true }),
    c("quote", { text: "Estamos rogándoles a los castores que *vuelvan*." }, ["ca_rogando", "Personas construyendo una pequeña represa de palos en un arroyo seco"]),
  ] },
  { key: "cronologia", startAt: "empezo a tomar forma con aquella", fb: "ca_geronimo", beats: [
    c("timeline", { eyebrow: "De plaga a salvador", title: "La saga del castor", events: [
      { year: "1800s", label: "Casi extinto por las pieles", image: img("ca_pieles_t"), accent: "danger" },
      { year: "1948", label: "76 castores caen del cielo", image: img("ca_avion_t"), accent: "amber" },
      { year: "Décadas", label: "Llenan el valle de agua", image: img("ca_humedal_t"), accent: "accent" },
      { year: "Hoy", label: "Reintroducidos a propósito", image: img("ca_restaura_t"), accent: "accent" } ] }),
    rc("st_drone_wetland", { at: "lo convirtieron en un paraiso de agua" }),
  ] },
  { key: "ensena", startAt: "lo que esta historia nos ensena", fb: "ca_castor_reflexion", beats: [
    rc("cv_beaver_portrait", { at: "ese pequeno ingeniero peludo entendia", hold: true }),
    c("quote", { text: "Entendía cómo cuidar el agua mejor que *nosotros*." }, ["ca_castor_agua2", "Un castor nadando en agua dorada al atardecer, primer plano"]),
  ] },
  { key: "solucion", startAt: "la solucion a nuestros problemas mas grandes", fb: "ca_castor_construye", beats: [
    rc("cv_beaver_build", { at: "dejar que un animal haga", hold: true }),
  ] },
  { key: "cierre", startAt: "Los castores de Idaho cayeron del cielo", fb: "ca_atardecer_rio", beats: [
    rc("nw_beaver_parachute", { at: "un experimento desesperado improvisado" }),
    rc("st_sunset_water", { at: "una de las historias de recuperacion", hold: true }),
    rc("st_river_forest", { at: "agua que volvio a tierras secas" }),
  ] },
  { key: "outro", startAt: "Si esta historia te sorprendio", fb: "ca_castor_final", beats: [
    rc("cv_beaver_swim", { at: "un animal pequeno contra todo pronostico", hold: true }),
    rc("st_drone_wetland", { at: "merece de verdad ser contada" }),
  ] },
];

// ── ANCLAJE ────────────────────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_castores_aligned.json", "utf8"));
const CW = (CAPS.words || CAPS).map((x) => ({ t: x.text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(), s: (x.startMs || 0) / 1000 }));
const LASTW = CW.length ? CW[CW.length - 1].s : 0;
const VIDEO_END = +(LASTW + 4).toFixed(1);
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

// ── resolver el ms de inicio de cada sección desde startAt (las que no tienen start fijo) ──
let prev = S[0].start ?? 0.2;
for (const sec of S) {
  if (sec.start != null) { prev = sec.start; continue; }
  const ms = sec.startAt ? findMs(sec.startAt, prev + 2) : null;
  sec.start = ms != null && ms > prev + 2 ? ms : prev + 8;
  if (!(ms != null)) console.error(`⚠ sección "${sec.key}": no encontré startAt="${sec.startAt}" → fallback ${sec.start.toFixed(1)}s`);
  prev = sec.start;
}
S.sort((a, b) => a.start - b.start);

// ── resolver de clip rc: SU clip > SU imagen web (bing) > imagen real fb > IA fb ──
const resolveRc = (name, fb) => {
  if (fexists(`broll/${name}.mp4`)) return `broll/${name}.mp4`;
  if (fexists(`real/${name}.jpg`)) return `real/${name}.jpg`;
  if (fexists(`real/${name}.png`)) return `real/${name}.png`;
  if (fexists(`real/${fb}.png`)) return `real/${fb}.png`;
  return `img/${fb}.png`;
};

// ── POOLS TEMÁTICOS + BALANCEADOR DE REUSO (ningún clip > REUSE_CAP veces) ──
const THEMES = {
  beaver: /beaver|castor/i,
  water: /river|stream|pond|wetland|water|marsh|spring|aquifer|drone_wet|oasis|meadow|dawn|rain/i,
  dry: /dry|drought|canyon|desert|riverbed|reservoir/i,
  air: /parachute|plane|cargo|wwii|airdrop|wood_crate/i,
  history: /fur|felt|trapper|postwar|farm_1940|old_map|orchard|irrigation|mule|horse|elmo|log_jam|flooded/i,
  wildlife: /deer|elk|duck|heron|frog|fish|bird|dragonfly|insect|moose|wildflower/i,
  science: /satellite|scientist|bda|wildfire|smoke|green_amid|release/i,
};
const themeOf = (src) => { const n = (src || "").toLowerCase(); for (const [k, re] of Object.entries(THEMES)) if (re.test(n)) return k; return "water"; };
// ⚠ SOLO clips de ESTE video (broll/ es compartida → filtrar por prefijo o se cuela basura → 404).
const CA_CLIP = /^(cv_|nw_|st_|st2_|ca_)/;
const allClips = fexists("broll") ? fs.readdirSync("public/broll").filter((f) => f.endsWith(".mp4") && CA_CLIP.test(f)).map((f) => `broll/${f}`) : [];
const themePools = {}; for (const cl of allClips) { const t = themeOf(cl); (themePools[t] = themePools[t] || []).push(cl); }
const usage = {};
const REUSE_CAP = 5;
const bumpUse = (s) => { usage[s] = (usage[s] || 0) + 1; return s; };
const balance = (src) => {
  if (typeof src !== "string" || !src.startsWith("broll/")) return bumpUse(src);
  if ((usage[src] || 0) >= REUSE_CAP) {
    const pool = (themePools[themeOf(src)] || []).filter((s) => s.startsWith("broll/") && s !== src);
    const alt = pool.slice().sort((a, b) => (usage[a] || 0) - (usage[b] || 0))[0];
    if (alt && (usage[alt] || 0) < (usage[src] || 0)) return bumpUse(alt);
  }
  return bumpUse(src);
};

const swapStill = (p) => {
  if (typeof p !== "string" || !p.startsWith("img/")) return p;
  const name = p.slice(4).replace(/\.png$/, "");
  if (fexists(`real/${name}.png`)) return `real/${name}.png`;
  return p;
};
const swapBg = (p) => {
  if (typeof p !== "string" || !p.startsWith("img/")) return p;
  const name = p.slice(4).replace(/\.png$/, "");
  if (fexists(`broll/${name}.mp4`)) return `broll/${name}.mp4`;
  if (fexists(`real/${name}.jpg`)) return `real/${name}.jpg`;
  if (fexists(`real/${name}.png`)) return `real/${name}.png`;
  return p;
};

const beats = [];
let nClip = 0, nReal = 0, nAi = 0;
for (let si = 0; si < S.length; si++) {
  const sec = S[si];
  const start = sec.start;
  const end = si + 1 < S.length ? S[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.0; if ((b.t === "raw" || b.t === "rc") && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    if (b.atMs != null) return (b.atMs > start + 0.3 && b.atMs < end - 0.4) ? b.atMs : null;
    const ph = pinPhrase(b);
    if (!ph) return null;
    const ms = findMs(ph, start + 0.5);
    return ms != null && ms > start + 1 && ms < end - 1.5 ? ms : null;
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
    const cursor = +startT[i].toFixed(2);
    const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2);
    const dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`;
    const hue = b.hue || HUES[(si + i) % HUES.length];
    const beat = { id, start: +cursor.toFixed(2), dur };
    if (b.t === "rc") {
      beat.kind = "raw"; beat.src = balance(resolveRc(b.name, sec.fb)); beat.hue = hue;
      if (beat.src.startsWith("broll/")) nClip++; else if (beat.src.startsWith("real/")) nReal++; else nAi++;
    } else if (b.t === "raw") {
      beat.kind = "raw"; beat.src = swapBg(`img/${b.name}.png`); beat.hue = hue;
      if (b.gen && beat.src.startsWith("img/")) beat.gen = b.gen;
      if (beat.src.startsWith("broll/")) nClip++; else if (beat.src.startsWith("real/")) nReal++; else nAi++;
    } else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; delete beat.atMs; delete beat.kicker; beat.id = id; beat.start = +cursor.toFixed(2); beat.dur = dur; beat.hue = beat.hue || hue;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (beat.kind === "annotated" && Array.isArray(beat.annotations)) beat.annotations = beat.annotations.map((a) => ({ kind: a.kind || "circle", ...a }));
      if (["quote", "chips", "headline", "aged", "callout"].includes(beat.kind) && beat.image) beat.image = swapBg(beat.image);
      if (beat.kind === "annotated" && beat.image) beat.image = swapStill(beat.image);
      if (Array.isArray(beat.steps)) beat.steps = beat.steps.map((st) => ({ ...st, image: swapStill(st.image) }));
      if (Array.isArray(beat.events)) beat.events = beat.events.map((e) => ({ ...e, image: e.image ? swapStill(e.image) : e.image }));
    }
    beats.push(beat);
  });
}

// ── DENSIFICACIÓN: ninguna toma supera MAXSHOT; las largas se subdividen con clips del mismo tema ──
const MAXSHOT = 7.0, TARGET = 4.6;
const held = (src) => typeof src === "string" && /dg_|ca_map_/.test(src);
const fullDur = new Set(["journey", "spreadmap", "infzoom", "process", "timeline", "foundertree"]);
const poolFor = (src) => (themePools[themeOf(src)] || allClips);
const dense = [];
const lastSrc = () => (dense.length ? dense[dense.length - 1].src : null);
const pickSrc = (pool, avoid) => {
  const cands = pool.filter((s) => s !== avoid && s !== lastSrc());
  if (!cands.length) return avoid;
  const best = cands.slice().sort((a, b) => (usage[a] || 0) - (usage[b] || 0))[0];
  return bumpUse(best);
};
for (const b of beats) {
  if (b.kind === "raw" && b.dur > MAXSHOT && !held(b.src)) {
    const k = Math.max(2, Math.round(b.dur / TARGET));
    const pool = poolFor(b.src).filter((s) => s !== b.src);
    for (let j = 0; j < k; j++) {
      const sStart = +(b.start + b.dur * j / k).toFixed(2);
      const sEnd = +(b.start + b.dur * (j + 1) / k).toFixed(2);
      const src = j === 0 ? b.src : pickSrc(pool, b.src);
      dense.push({ id: `${b.id}_${j}`, start: sStart, dur: +(sEnd - sStart).toFixed(2), kind: "raw", src, hue: b.hue });
    }
  } else if (b.kind !== "raw" && b.dur > 8 && !fullDur.has(b.kind)) {
    const keep = 6.0, bEnd = +(b.start + b.dur).toFixed(2), t0 = +(b.start + keep).toFixed(2);
    dense.push({ ...b, dur: +(t0 - b.start).toFixed(2) });
    const span = bEnd - t0, nf = Math.max(1, Math.round(span / TARGET));
    const prevS = lastSrc(); const pool = poolFor(prevS && prevS.startsWith("broll/") ? prevS : "");
    for (let j = 0; j < nf; j++) {
      const fst = +(t0 + span * j / nf).toFixed(2), fen = +(t0 + span * (j + 1) / nf).toFixed(2);
      dense.push({ id: `${b.id}f${j}`, start: fst, dur: +(fen - fst).toFixed(2), kind: "raw", src: pickSrc(pool, null), hue: b.hue });
    }
  } else dense.push(b);
}
beats.length = 0; beats.push(...dense);

// ── COLD-OPEN TEASER (0–INTRO): gancho visual antes de la narración ──
const INTRO = 4.0;
for (const b of beats) b.start = +(b.start + INTRO).toFixed(2);
const tsrc = (n, fb) => fexists(`broll/${n}.mp4`) ? `broll/${n}.mp4`
  : fexists(`real/${n}.jpg`) ? `real/${n}.jpg`
  : fexists(`real/${n}.png`) ? `real/${n}.png`
  : fexists(`real/${fb}.jpg`) ? `real/${fb}.jpg`
  : `img/${fb}.png`;
const T = (i, s, e, n, fb, hue) => ({ id: `teaser_${i}`, start: +s.toFixed(2), dur: +(e - s).toFixed(2), kind: "raw", src: tsrc(n, fb), hue });
beats.unshift(
  T(0, 0.0, 1.5, "nw_beaver_parachute", "ca_valle_avion", "amber"),   // un castor cayendo en paracaídas
  T(1, 1.5, 2.8, "cv_beaver_face", "ca_castor_retrato", "amber"),     // su cara
  T(2, 2.8, 4.0, "st_drone_wetland", "ca_humedal", "blue"),           // el agua que crearon
);

// ── OVERLAYS (encima del clip) ──
const loc = (px, py, place, sub, atMs, dur, gen) => ({ id: `loc_${Math.round(atMs)}`, start: +(atMs + INTRO).toFixed(2), dur, kind: "loctag", mapImage: img("ca_map_us"), pinX: px, pinY: py, place, sub, overlay: true, ...(gen ? { gen } : {}) });
const otag = (props, atMs, dur) => ({ id: `stat_${Math.round(atMs)}`, start: +(atMs + INTRO).toFixed(2), dur, kind: "stattag", overlay: true, ...props });
const nt = (name, sub, accent, atMs, dur) => ({ id: `name_${Math.round(atMs)}`, start: +(atMs + INTRO).toFixed(2), dur, kind: "nametag", overlay: true, name, sub, accent });
const ph = (text, accent, atMs, dur) => ({ id: `ph_${Math.round(atMs)}`, start: +(atMs + INTRO).toFixed(2), dur, kind: "phrasetag", overlay: true, text, accent });
const at = (phrase, fb) => { const m = findMs(phrase, 0); return m != null ? m : fb; };

beats.push(
  loc(30, 44, "Idaho", "Estados Unidos", at("uno de los rincones mas remotos", 250), 6.0, { type: "image", name: "ca_map_us", prompt: MP("Mapa de los Estados Unidos continentales completo, con los límites de los estados marcados sutilmente y el estado de Idaho resaltado, estilo atlas antiguo hermoso.") }),
  nt("Castor americano", "Castor canadensis", "amber", at("ese dueno era el castor", 120), 6.0),
  nt("Geronimo", "El castor más lanzado de la historia", "amber", at("A ese castor lo llamaron Geronimo", 600), 5.5),
  otag({ value: 76, eyebrow: "Lanzados desde aviones", label: "castores en paracaídas", accent: "amber", corner: "tr" }, at("cargaron los aviones con setenta y seis", 640), 6.0),
  otag({ value: 75, eyebrow: "Aterrizaron sanos y salvos", label: "de 76 castores lanzados", accent: "accent", corner: "tr" }, at("los otros setenta y cinco aterrizaron", 700), 5.5),
  ph("Las *semillas* del agua, desde el cielo", "cold", at("las semillas del agua", 1050), 4.5),
  otag({ text: "1948", eyebrow: "El gran lanzamiento", label: "76 castores caen sobre Idaho", accent: "amber", corner: "bl" }, at("cargaron los aviones con setenta y seis", 640), 5.0),
  ph("Un *cortafuegos* natural", "accent", at("esos parches verdes empapados", 1300), 4.5),
);
// BARRA QUE SE VACÍA: el desplome de los castores por el comercio de pieles
beats.push({ id: "meter_fur", start: +(at("Mataron a tantos castores", 880) + INTRO).toFixed(2), dur: 7.0, kind: "metertag", overlay: true, label: "Castores en Norteamérica", fromPct: 100, toPct: 3, eyebrow: "Comercio de pieles", corner: "tr" });

fs.writeFileSync("beatsheet/castores.json", JSON.stringify({ video: "castores", beats }, null, 1));
const raw = beats.filter((b) => b.kind === "raw").length;
const types = new Set(beats.filter((b) => b.kind !== "raw").map((b) => b.kind));
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · tipos no-raw: ${types.size}`);
console.log(`fondos: ${nClip} clips · ${nReal} reales · ${nAi} IA`);
console.log(`dur total: ${(beats.filter(b=>!b.overlay).reduce((m,b)=>Math.max(m,b.start+b.dur),0)).toFixed(0)}s · VIDEO_END=${VIDEO_END}`);
