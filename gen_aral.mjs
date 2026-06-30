// gen_aral.mjs — documental "El Mar de Aral" (faceless, voz clonada). CLIP-DRIVEN + SYNC POR FRASE.
// Clips reales multi-extraídos de documentales (docextract) + Pexels + imágenes Bing/IA.
import fs from "fs";
const fexists = (p) => fs.existsSync(`public/${p}`);
const img = (name) => `img/${name}.png`;
const P = (s) => `Foto documental real, 16:9 horizontal apaisado. ${s} Como un fotograma de un documental viejo: con imperfecciones, luz natural despareja, saturación baja, nada pulido, sin apariencia de IA.`;
const DP = (s) => `Infografía horizontal, relación de aspecto EXACTA 16:9 (1792x1024). Ilustración hecha a mano profesional, limpia, editorial, tipo lámina de atlas. ${s} Fondo marfil claro con textura de papel, líneas marrón oscuro, acentos celeste agua y terracota apagado, papel envejecido. Minimalista, muy clara. Textos en español, breves.`;
const MP = (s) => `Mapa ilustrado vintage, atlas antiguo, 16:9 horizontal. ${s} Papel crema envejecido, líneas de tinta marrón, relieve y ríos suaves, rosa de los vientos, hermoso, sin texto ilegible.`;

const rc = (name, o = {}) => ({ t: "rc", name, ...o });
const r = (name, scene, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: P(scene) }, ...o });
const dg = (name, scene, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: DP(scene) }, ...o });
const smap = (name, scene, props = {}) => ({ t: "spreadmap", mapImage: img(name), gen: { type: "image", name, prompt: MP(scene) }, ...props });
const c = (kind, props = {}, gi = null) => { const b = { t: kind, ...props }; if (gi) { b.image = img(gi[0]); b.gen = { type: "image", name: gi[0], prompt: P(gi[1]) }; } return b; };

const HUES = ["blue", "amber", "red"];
const W = { raw: 1.2, rc: 1.0, quote: 1.0, headline: 0.95, aged: 1.05, checklist: 1.05, splitlist: 1.0, bars: 1.1, process: 1.3, annotated: 1.2, spreadmap: 2.4, timeline: 2.8 };

const S = [
  { key: "intro", start: 0.2, fb: "ar_ship_sand1", beats: [
    rc("ar_desert_sand", { hold: true, w: 1.0 }),
    rc("ar_ship_sand1", { at: "el casco oxidado de un enorme barco" }),
    rc("ar_ship_aerial", { at: "Y mas alla otro" }),
    rc("ar_ship_people", { at: "a cientos de kilometros del mar", hold: true }),
  ] },
  { key: "noficcion", startAt: "No es una escena de una pelicula", fb: "ar_ship_sand2", beats: [
    rc("ar_ship_sand2", { at: "Es un lugar real" }),
    rc("ar_old_sea", { at: "exactamente donde vos estas parado", hold: true }),
    rc("ar_lake_waves", { at: "Habia un mar" }),
  ] },
  { key: "esaral", startAt: "Este es el Mar de Aral", fb: "ar_old_sea", beats: [
    rc("ar_old_sea", { hold: true }),
    c("headline", { tokens: ["El", "Mar", "de", { t: "Aral" }], eyebrow: "Esta es la historia de", bg: "image" }, ["ar_h_aral", "Un mar interior azul visto desde la orilla con montañas lejanas"]),
    rc("ar_ship_sunset", { at: "uno de los regresos mas sorprendentes" }),
  ] },
  { key: "murio", startAt: "Porque este mar murio", fb: "ar_dry_bed", beats: [
    rc("ar_dry_bed", { at: "Se seco", hold: true }),
    rc("ar_water_return", { at: "una parte de el volvio de entre los muertos" }),
  ] },
  { key: "tragedia", startAt: "primero tenemos que entender la tragedia", fb: "ar_old_port", beats: [
    rc("ar_old_port", { at: "uno de los lugares mas vivos y prosperos", hold: true }),
  ] },
  { key: "cuarto", startAt: "el Mar de Aral era el cuarto lago", fb: "ar_old_sea", beats: [
    rc("ar_old_sea", { hold: true }),
    c("annotated", { at: "entre lo que hoy son los paises", caption: "El cuarto lago más grande del mundo", image: "real/ar_map_aral.jpg", annotations: [{ x: 40, y: 45, label: "Kazajistán" }, { x: 48, y: 62, label: "Uzbekistán" }] }),
    rc("ar_lake_waves", { at: "era completamente imposible ver la otra" }),
  ] },
  { key: "vida", startAt: "ese mar estaba rebosante de vida", fb: "ar_old_fishing", beats: [
    rc("ar_old_fishing", { at: "famosas en toda la Union Sovietica por la pesca", hold: true }),
    rc("ar_fish_net2", { at: "Decenas de especies de peces" }),
    rc("ar_old_port", { at: "Puertos llenos de barcos" }),
    rc("ar_old_cannery", { at: "fabricas que enlataban el pescado" }),
  ] },
  { key: "riqueza", startAt: "en sus mejores anos", fb: "ar_old_cannery", beats: [
    rc("ar_old_cannery", { hold: true }),
    rc("ar_old_sea", { at: "Parecia tan eterno como las montanas" }),
  ] },
  { key: "rios", startAt: "Pero habia un detalle", fb: "ar_river_mtn2", beats: [
    rc("ar_old_sea", { at: "no tenia ninguna salida al oceano" }),
    rc("ar_river_mtn2", { at: "dos rios enormes que lo alimentaban", hold: true }),
    c("annotated", { at: "el Amu Daria y el Sir Daria", caption: "Dos arterias gigantes", image: "real/ar_map_aral.jpg", annotations: [{ x: 35, y: 70, label: "Amu Daria" }, { x: 60, y: 55, label: "Sir Daria" }] }),
    rc("ar_river_delta", { at: "desembocaban en el Aral" }),
  ] },
  { key: "equilibrio", startAt: "Era un equilibrio perfecto", fb: "ar_river_delta", beats: [
    rc("ar_river_delta", { hold: true }),
    c("quote", { text: "¿Qué pasaría si alguien le *robara* al mar sus ríos?" }, ["ar_h_arterias", "Un río cruzando el desierto hacia un mar lejano, vista aérea"]),
  ] },
  { key: "algodon", startAt: "los planificadores de la Union Sovietica", fb: "ar_soviet_plan", beats: [
    rc("ar_soviet_plan", { at: "miraron el mapa de Asia Central", hold: true }),
    c("headline", { tokens: ["Pensaron", "en", "una", "sola", "cosa:", { t: "algodón" }], eyebrow: "En lugar de un mar", bg: "image" }, ["ar_h_cotton", "Campos de algodón blanco en el desierto bajo sol fuerte"]),
    rc("ar_soviet_cotton", { at: "El algodon era lo que ellos llamaban el oro blanco" }),
    rc("ar_cotton2", { at: "un cultivo increiblemente sediento" }),
  ] },
  { key: "canales", startAt: "Empezaron a construir canales", fb: "ar_canal2", beats: [
    rc("ar_canal2", { at: "miles y miles de kilometros de canales", hold: true }),
    dg("dg_diversion", "Diagrama: dos ríos (Amu Daria y Sir Daria) que iban al Mar de Aral son desviados por canales de riego hacia campos de algodón; el mar, sin agua, se encoge. Flechas mostrando el agua robada. Título: El agua robada al mar.", { at: "desviar el agua del Amu Daria" }),
    rc("ar_canal2", { at: "muchos de esos canales eran de tierra" }),
    rc("ar_desert_sand", { at: "se perdia en la arena del camino" }),
  ] },
  { key: "sabian", startAt: "Los planificadores sovieticos sabian perfectamente", fb: "ar_soviet_plan", beats: [
    rc("ar_soviet_plan", { hold: true }),
    c("aged", { heading: "Lo sabían. No fue un accidente.", lines: ["Documentos de la época lo prueban.", "Consideraron secar un mar un “precio aceptable”."], image: img("ar_h_docs") }, ["ar_h_docs", "Documentos y planos soviéticos antiguos sobre un escritorio, blanco y negro"]),
    rc("ar_dry_bed", { at: "sacrificar un mar entero" }),
  ] },
  { key: "morir", startAt: "el mar sin sus rios empezo a morir", fb: "ar_retreat1", beats: [
    rc("ar_retreat1", { at: "La orilla empezo a retroceder", hold: true }),
    rc("ar_dry_bed", { at: "una franja cada vez mas ancha de fondo seco" }),
  ] },
  { key: "muelles", startAt: "La gente de los pueblos pesqueros", fb: "ar_pier_dry", beats: [
    rc("ar_pier_dry", { at: "El mar se estaba alejando de ellos", hold: true }),
    rc("ar_empty_boat", { at: "quedaban en seco" }),
    rc("ar_dry_bed", { at: "El mar huia mucho mas rapido" }),
  ] },
  { key: "sal", startAt: "pasaba algo todavia peor bajo la superficie", fb: "ar_salt_flat", beats: [
    rc("ar_salt_flat", { at: "la sal que quedaba atras no tenia a donde ir", hold: true }),
    rc("ar_cracked_earth", { at: "se volvia mas y mas salado" }),
  ] },
  { key: "peces", startAt: "los peces simplemente no pudieron soportarlo", fb: "ar_salt_flat", beats: [
    rc("ar_salt_flat2", { at: "se transformo en veneno puro para ellos" }),
    rc("ar_dead_tree", { at: "empezo a morir en masa" }),
    rc("ar_old_cannery", { at: "Las fabricas cerraron" }),
  ] },
  { key: "drama", startAt: "el drama humano detras de cada numero", fb: "ar_ghost_town", beats: [
    rc("ar_ghost_town", { at: "se quedaron sin absolutamente nada", hold: true }),
    rc("ar_village_poor", { at: "ahora estaba a decenas de kilometros" }),
  ] },
  { key: "moynaq", startAt: "Una de esas ciudades se llamaba Moynaq", fb: "ar_moynaq", beats: [
    rc("ar_moynaq", { at: "una de las joyas del Mar de Aral", hold: true }),
    rc("ar_ship_people", { at: "famosa en todo el mundo por una sola imagen" }),
    rc("ar_ship_closeup", { at: "varados para siempre sobre la arena" }),
    c("headline", { tokens: ["El", "cementerio", "de", { t: "barcos" }], eyebrow: "Moynaq", bg: "image" }, ["ar_h_moynaq", "Hilera de barcos pesqueros oxidados varados sobre la arena del desierto"]),
    rc("ar_ship_inside", { at: "convertidos en monumentos silenciosos" }),
    rc("ar_ship_sand2", { at: "algunos turistas se sacan fotos" }),
  ] },
  { key: "veneno", startAt: "Dejo al descubierto el viejo fondo del mar", fb: "ar_salt_flat", beats: [
    rc("ar_salt_flat", { at: "cubierto de sal y de algo muchisimo peor", hold: true }),
    rc("ar_rusty_metal", { at: "todo ese veneno acumulado quedo expuesto" }),
    c("headline", { tokens: ["El", { t: "Aralkum" }], eyebrow: "Un desierto que hace 60 años no existía", bg: "image" }, ["ar_h_aralkum", "Un desierto de sal blanca y polvo donde antes había un mar"]),
  ] },
  { key: "viento", startAt: "Y entonces llego el viento", fb: "ar_dust_storm", beats: [
    rc("ar_dust_storm", { at: "empezo a levantar ese polvo toxico", hold: true }),
    rc("ar_dust_storm2", { at: "tormentas de polvo salado y envenenado" }),
    rc("ar_dust_satellite", { at: "tan grandes que se podian ver desde el espacio" }),
  ] },
  { key: "salud", startAt: "La salud de las poblaciones", fb: "ar_sick_people", beats: [
    rc("ar_sick_people", { at: "Se dispararon las enfermedades respiratorias", hold: true }),
    rc("ar_village_poor", { at: "La mortalidad infantil subio" }),
    rc("ar_desert_sand", { at: "los veranos se volvieron mas abrasadores" }),
  ] },
  { key: "noventa", startAt: "el panorama era directamente apocaliptico", fb: "ar_sat_beforeafter", beats: [
    c("bars", { title: "Volumen de agua del Mar de Aral", unit: "%", bars: [{ label: "Antes", value: 100 }, { label: "Hoy", value: 10 }] }),
    rc("ar_dry_bed", { at: "transformandose en tierra firme por primera vez" }),
    rc("ar_ship_aerial", { at: "uno de los peores desastres ambientales" }),
  ] },
  { key: "satelite", startAt: "todo este desastre quedo documentado desde el cielo", fb: "ar_sat_beforeafter", beats: [
    rc("ar_earth_space2", { at: "los satelites que orbitaban la Tierra", hold: true }),
    smap("ar_map_shrink", "Mapa del Mar de Aral entre Kazajistán y Uzbekistán mostrando su contorno; estilo atlas antiguo.", { at: "se encogia sin parar", origin: [50, 45], yearFrom: 1960, yearTo: 2010, eyebrow: "Un mar desapareciendo", title: "El Aral, año tras año", hue: "blue", invert: true }),
    rc("ar_sat_beforeafter", { at: "para que el mundo entero pudiera verlo" }),
  ] },
  { key: "terminada", startAt: "parecia definitivamente terminada", fb: "ar_dry_bed", beats: [
    rc("ar_dry_bed", { at: "Un mar muerto para siempre", hold: true }),
  ] },
  { key: "giro", startAt: "esta historia da un giro", fb: "ar_north_water", beats: [
    rc("ar_north_water", { at: "casi nadie en el mundo esperaba", hold: true }),
  ] },
  { key: "dividido", startAt: "habia quedado dividido principalmente en dos", fb: "ar_map_split2", beats: [
    c("annotated", { at: "Un mar del sur enorme", caption: "El mar partido en dos", image: "real/ar_map_split2.png", annotations: [{ x: 50, y: 30, label: "Norte (Kazajistán)" }, { x: 50, y: 70, label: "Sur (condenado)" }] }),
    rc("ar_north_water", { at: "Todavia recibia algo de agua" }),
  ] },
  { key: "tapon", startAt: "esa agua que entraba por el norte no se quedaba", fb: "ar_dry_bed", beats: [
    rc("ar_dry_bed", { at: "Se escurria hacia el sur", hold: true }),
    dg("dg_tapon", "Diagrama: el agua del río Sir Daria entra al mar del NORTE pero se escurre al SUR perdiéndose; una represa-muro (tapón) separa norte de sur y atrapa el agua en el norte. Título: Poner el tapón.", { at: "construimos un muro una represa" }),
  ] },
  { key: "primerintento", startAt: "Hubo un primer intento", fb: "ar_dam_build", beats: [
    rc("ar_dam_build", { at: "un dique de arena improvisado", hold: true }),
    rc("ar_waves_shore", { at: "una gran tormenta termino por romperlo" }),
  ] },
  { key: "apuesta", startAt: "La apuesta era dificil y hasta dolorosa", fb: "ar_dam_aerial", beats: [
    rc("ar_dam_aerial", { at: "con la ayuda y el financiamiento del Banco Mundial", hold: true }),
  ] },
  { key: "kokaral", startAt: "en el ano dos mil cinco lo construyeron", fb: "ar_kokaral_dam", beats: [
    rc("ar_dam_build", { at: "Una represa solida", hold: true }),
    rc("ar_kokaral_dam", { at: "atravesando el mar de lado a lado" }),
    c("headline", { tokens: ["La", "represa", "de", { t: "Kokaral" }], eyebrow: "13 km de muro · 2005", bg: "image" }, ["ar_h_dam", "Una larga represa de tierra atravesando el agua, vista aérea"]),
    rc("ar_dam_aerial", { at: "Pusieron el tapon" }),
  ] },
  { key: "subio", startAt: "Lo que paso despues dejo sin palabras", fb: "ar_water_return", beats: [
    rc("ar_water_return", { at: "el mar empezo a subir", hold: true }),
    rc("ar_drone_water", { at: "Muchisimo mas rapido de lo que cualquiera habia previsto" }),
  ] },
  { key: "volver", startAt: "el nivel del agua del mar del norte trepo", fb: "ar_waves_shore", beats: [
    rc("ar_waves_shore", { at: "recuperando miles de kilometros cuadrados", hold: true }),
    rc("ar_lake_waves", { at: "empezo a volver" }),
  ] },
  { key: "salbaja", startAt: "llego la segunda parte del milagro", fb: "ar_drone_water", beats: [
    rc("ar_water_pour", { at: "La sal empezo a bajar", hold: true }),
    rc("ar_drone_water", { at: "se volvio otra vez habitable" }),
  ] },
  { key: "pecesvuelven", startAt: "Significa que los peces pueden volver", fb: "ar_fish_return", beats: [
    rc("ar_fish_return", { at: "Y volvieron", hold: true }),
    rc("ar_fish_underwater2", { at: "volvieron a nadar en ellas" }),
    c("headline", { tokens: ["El", "mar", "muerto", "se", "llenaba", "de", { t: "vida" }], eyebrow: "Otra vez", bg: "image" }, ["ar_h_fish", "Peces nadando en agua azul clara de un lago"]),
  ] },
  { key: "gente", startAt: "vuelve la gente", fb: "ar_fishermen_back", beats: [
    rc("ar_fishermen_back", { at: "Vuelven los pescadores", hold: true }),
    rc("ar_aralsk", { at: "que había quedado abandonada" }),
    rc("ar_fish_net_haul", { at: "volvieron a tirar sus redes" }),
    rc("ar_market_fish2", { at: "volvieron a abrir sus puertas" }),
    rc("ar_boat_out", { at: "podian volver a vivir de ese mismo mar" }),
  ] },
  { key: "honestos", startAt: "esta no es una historia de final", fb: "ar_south_dead", beats: [
    rc("ar_south_dead", { at: "el mar del sur el del lado de Uzbekistan", hold: true }),
    rc("ar_salt_flat", { at: "continua siendo en gran medida ese desierto toxico" }),
    c("quote", { text: "Tuvo que elegir. Y eligió salvar lo que *todavía* se podía." }, ["ar_h_choice", "Vista dividida: desierto seco de un lado, agua del otro"]),
  ] },
  { key: "reflexion", startAt: "Pensemos por un segundo en lo que significa", fb: "ar_ship_aerial", beats: [
    rc("ar_ship_aerial", { at: "a proposito sabiendo lo que hacia lo mato", hold: true }),
    rc("ar_water_return", { at: "traer una parte de ese mar de vuelta a la vida" }),
  ] },
  { key: "esperanza", startAt: "algo profundamente humano", fb: "ar_waves_shore", beats: [
    rc("ar_waves_shore", { at: "el dano que hacemos no siempre es para siempre", hold: true }),
    c("timeline", { eyebrow: "De la catástrofe al regreso", title: "La saga del Mar de Aral", events: [
      { year: "1960", label: "El 4º lago más grande", image: img("ar_t_full"), accent: "cold" },
      { year: "1960s", label: "Desvían los ríos por algodón", image: img("ar_t_cotton"), accent: "danger" },
      { year: "2000", label: "Pierde el 90% del agua", image: img("ar_t_dry"), accent: "danger" },
      { year: "2005", label: "Represa de Kokaral", image: img("ar_t_dam"), accent: "accent" },
      { year: "Hoy", label: "El norte revive", image: img("ar_t_water"), accent: "accent" } ] }),
  ] },
  { key: "creciendo", startAt: "El Mar de Aral del norte sigue creciendo", fb: "ar_drone_water", beats: [
    rc("ar_drone_water", { at: "un poco mas de agua", hold: true }),
    rc("ar_lake_waves", { at: "Pero esta vivo" }),
  ] },
  { key: "hoy", startAt: "si vas a las orillas del mar del norte", fb: "ar_ship_and_water", beats: [
    rc("ar_ship_and_water", { at: "los esqueletos oxidados de los viejos barcos", hold: true }),
    rc("ar_waves_shore", { at: "Vas a ver agua" }),
    rc("ar_seagulls2", { at: "Vas a escuchar gaviotas" }),
    rc("ar_boat_out", { at: "saliendo otra vez a buscar peces" }),
  ] },
  { key: "outro", startAt: "quedate con nosotros y suscribite", fb: "ar_waves_shore", beats: [
    rc("ar_water_return", { at: "estos regresos imposibles", hold: true }),
    rc("ar_boat_out", { at: "merece de verdad ser contada" }),
  ] },
];

// ── ANCLAJE (idéntico a gen_castores) ──
const CAPS = JSON.parse(fs.readFileSync("public/captions_aral_aligned.json", "utf8"));
const CW = (CAPS.words || CAPS).map((x) => ({ t: x.text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(), s: (x.startMs || 0) / 1000 }));
const LASTW = CW.length ? CW[CW.length - 1].s : 0;
const VIDEO_END = +(LASTW + 4).toFixed(1);
const findMs = (phrase, after) => {
  const p = phrase.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 3) return null;
  for (let i = 0; i < CW.length - p.length; i++) { if (CW[i].s < after) continue; let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; } if (ok) return CW[i].s; }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);
let prev = S[0].start ?? 0.2;
for (const sec of S) { if (sec.start != null) { prev = sec.start; continue; } const ms = sec.startAt ? findMs(sec.startAt, prev + 2) : null; sec.start = ms != null && ms > prev + 2 ? ms : prev + 8; if (!(ms != null)) console.error(`⚠ sección "${sec.key}": no encontré startAt="${sec.startAt}" → ${sec.start.toFixed(1)}s`); prev = sec.start; }
S.sort((a, b) => a.start - b.start);

const resolveRc = (name, fb) => {
  if (fexists(`broll/${name}.mp4`)) return `broll/${name}.mp4`;
  if (fexists(`real/${name}.jpg`)) return `real/${name}.jpg`;
  if (fexists(`real/${name}.png`)) return `real/${name}.png`;
  if (fexists(`real/${fb}.jpg`)) return `real/${fb}.jpg`;
  if (fexists(`broll/${fb}.mp4`)) return `broll/${fb}.mp4`;
  return `img/${fb}.png`;
};
const THEMES = {
  ship: /ship|moynaq|ghost|empty_boat|rusty|pier/i,
  sea_full: /old_sea|old_fishing|old_port|old_cannery|lake_waves|fish_net2|aral_1960/i,
  dry: /dry_bed|retreat|cracked|salt_flat|desert_sand|dead_tree|salt|south_dead/i,
  water_back: /water_return|water_aerial|waves_shore|drone_water|north_water|water_pour|seagull|boat_out|sunset_lake/i,
  fish_back: /fish_return|fish_underwater|fishermen|fish_net_haul|market_fish|aralsk/i,
  dam: /dam|kokaral/i,
  human: /sick|village|ghost_town/i,
  cause: /soviet|cotton|canal|river|delta|plan|map/i,
  dust: /dust|earth_space/i,
};
const themeOf = (src) => { const n = (src || "").toLowerCase(); for (const [k, re] of Object.entries(THEMES)) if (re.test(n)) return k; return "dry"; };
const AR_CLIP = /^ar_/;
const allClips = fexists("broll") ? fs.readdirSync("public/broll").filter((f) => f.endsWith(".mp4") && AR_CLIP.test(f)).map((f) => `broll/${f}`) : [];
const themePools = {}; for (const cl of allClips) { const t = themeOf(cl); (themePools[t] = themePools[t] || []).push(cl); }
const usage = {}; const REUSE_CAP = 5;
const bumpUse = (s) => { usage[s] = (usage[s] || 0) + 1; return s; };
const balance = (src) => { if (typeof src !== "string" || !src.startsWith("broll/")) return bumpUse(src); if ((usage[src] || 0) >= REUSE_CAP) { const pool = (themePools[themeOf(src)] || []).filter((s) => s.startsWith("broll/") && s !== src); const alt = pool.slice().sort((a, b) => (usage[a] || 0) - (usage[b] || 0))[0]; if (alt && (usage[alt] || 0) < (usage[src] || 0)) return bumpUse(alt); } return bumpUse(src); };
const swapStill = (p) => { if (typeof p !== "string" || !p.startsWith("img/")) return p; const name = p.slice(4).replace(/\.png$/, ""); if (fexists(`real/${name}.png`)) return `real/${name}.png`; return p; };
const swapBg = (p) => { if (typeof p !== "string" || !p.startsWith("img/")) return p; const name = p.slice(4).replace(/\.png$/, ""); if (fexists(`broll/${name}.mp4`)) return `broll/${name}.mp4`; if (fexists(`real/${name}.jpg`)) return `real/${name}.jpg`; if (fexists(`real/${name}.png`)) return `real/${name}.png`; return p; };

const beats = [];
let nClip = 0, nReal = 0, nAi = 0;
for (let si = 0; si < S.length; si++) {
  const sec = S[si]; const start = sec.start; const end = si + 1 < S.length ? S[si + 1].start : VIDEO_END; const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.0; if ((b.t === "raw" || b.t === "rc") && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => { if (i === 0) return start; if (b.atMs != null) return (b.atMs > start + 0.3 && b.atMs < end - 0.4) ? b.atMs : null; const ph = pinPhrase(b); if (!ph) return null; const ms = findMs(ph, start + 0.5); return ms != null && ms > start + 1 && ms < end - 1.5 ? ms : null; });
  let lastPin = start; for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.0) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i); fixed.push(n);
  const startT = new Array(n);
  for (let f = 0; f < fixed.length - 1; f++) { const a = fixed[f], b = fixed[f + 1]; const ta = pin[a], tb = b === n ? end : pin[b]; let sw = 0; for (let i = a; i < b; i++) sw += ws[i]; let acc = ta; for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); } }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2); const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2); const dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`; const hue = b.hue || HUES[(si + i) % HUES.length]; const beat = { id, start: +cursor.toFixed(2), dur };
    if (b.t === "rc") { beat.kind = "raw"; beat.src = balance(resolveRc(b.name, sec.fb)); beat.hue = hue; if (beat.src.startsWith("broll/")) nClip++; else if (beat.src.startsWith("real/")) nReal++; else nAi++; }
    else if (b.t === "raw") { beat.kind = "raw"; beat.src = swapBg(`img/${b.name}.png`); beat.hue = hue; if (b.gen && beat.src.startsWith("img/")) beat.gen = b.gen; if (beat.src.startsWith("broll/")) nClip++; else if (beat.src.startsWith("real/")) nReal++; else nAi++; }
    else { beat.kind = b.t; Object.assign(beat, b); delete beat.t; delete beat.atMs; beat.id = id; beat.start = +cursor.toFixed(2); beat.dur = dur; beat.hue = beat.hue || hue;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (beat.kind === "annotated" && Array.isArray(beat.annotations)) beat.annotations = beat.annotations.map((a) => ({ kind: a.kind || "circle", ...a }));
      if (["quote", "headline", "aged"].includes(beat.kind) && beat.image) beat.image = swapBg(beat.image);
      if (beat.kind === "annotated" && beat.image) beat.image = swapStill(beat.image);
      if (Array.isArray(beat.events)) beat.events = beat.events.map((e) => ({ ...e, image: e.image ? swapStill(e.image) : e.image }));
    }
    beats.push(beat);
  });
}
// densificación
const MAXSHOT = 7.0, TARGET = 4.6;
const held = (src) => typeof src === "string" && /dg_|ar_map_/.test(src);
const fullDur = new Set(["spreadmap", "timeline", "process"]);
const poolFor = (src) => (themePools[themeOf(src)] || allClips);
const dense = []; const lastSrc = () => (dense.length ? dense[dense.length - 1].src : null);
const pickSrc = (pool, avoid) => { const cands = pool.filter((s) => s !== avoid && s !== lastSrc()); if (!cands.length) return avoid; const best = cands.slice().sort((a, b) => (usage[a] || 0) - (usage[b] || 0))[0]; return bumpUse(best); };
for (const b of beats) {
  if (b.kind === "raw" && b.dur > MAXSHOT && !held(b.src)) { const k = Math.max(2, Math.round(b.dur / TARGET)); const pool = poolFor(b.src).filter((s) => s !== b.src); for (let j = 0; j < k; j++) { const sStart = +(b.start + b.dur * j / k).toFixed(2); const sEnd = +(b.start + b.dur * (j + 1) / k).toFixed(2); const src = j === 0 ? b.src : pickSrc(pool, b.src); dense.push({ id: `${b.id}_${j}`, start: sStart, dur: +(sEnd - sStart).toFixed(2), kind: "raw", src, hue: b.hue }); } }
  else if (b.kind !== "raw" && b.dur > 8 && !fullDur.has(b.kind)) { const keep = 6.0, bEnd = +(b.start + b.dur).toFixed(2), t0 = +(b.start + keep).toFixed(2); dense.push({ ...b, dur: +(t0 - b.start).toFixed(2) }); const span = bEnd - t0, nf = Math.max(1, Math.round(span / TARGET)); const prevS = lastSrc(); const pool = poolFor(prevS && prevS.startsWith("broll/") ? prevS : ""); for (let j = 0; j < nf; j++) { const fst = +(t0 + span * j / nf).toFixed(2), fen = +(t0 + span * (j + 1) / nf).toFixed(2); dense.push({ id: `${b.id}f${j}`, start: fst, dur: +(fen - fst).toFixed(2), kind: "raw", src: pickSrc(pool, null), hue: b.hue }); } }
  else dense.push(b);
}
beats.length = 0; beats.push(...dense);

// cold-open teaser + INTRO
const INTRO = 4.0;
for (const b of beats) b.start = +(b.start + INTRO).toFixed(2);
const tsrc = (n, fb) => fexists(`broll/${n}.mp4`) ? `broll/${n}.mp4` : fexists(`real/${n}.jpg`) ? `real/${n}.jpg` : fexists(`real/${fb}.jpg`) ? `real/${fb}.jpg` : `img/${fb}.png`;
const T = (i, s, e, n, fb, hue) => ({ id: `teaser_${i}`, start: +s.toFixed(2), dur: +(e - s).toFixed(2), kind: "raw", src: tsrc(n, fb), hue });
beats.unshift(
  T(0, 0.0, 1.5, "ar_ship_aerial", "ar_moynaq_ships", "amber"),
  T(1, 1.5, 2.8, "ar_ship_people", "ar_ship_sand1", "amber"),
  T(2, 2.8, 4.0, "ar_water_return", "ar_north_water", "blue"),
);

// ── OVERLAYS ──
const at = (phrase, fb) => { const m = findMs(phrase, 0); return m != null ? m : fb; };
const loc = (px, py, place, sub, atMs, dur) => ({ id: `loc_${Math.round(atMs)}`, start: +(atMs + INTRO).toFixed(2), dur, kind: "loctag", mapImage: img("ar_map_world"), pinX: px, pinY: py, place, sub, overlay: true, gen: { type: "image", name: "ar_map_world", prompt: MP("Mapa del mundo o de Asia Central mostrando la ubicación del Mar de Aral entre Kazajistán y Uzbekistán, estilo atlas antiguo.") } });
const otag = (props, atMs, dur) => ({ id: `stat_${Math.round(atMs)}`, start: +(atMs + INTRO).toFixed(2), dur, kind: "stattag", overlay: true, ...props });
const nt = (name, sub, accent, atMs, dur) => ({ id: `name_${Math.round(atMs)}`, start: +(atMs + INTRO).toFixed(2), dur, kind: "nametag", overlay: true, name, sub, accent });
const ph = (text, accent, atMs, dur) => ({ id: `ph_${Math.round(atMs)}`, start: +(atMs + INTRO).toFixed(2), dur, kind: "phrasetag", overlay: true, text, accent });
beats.push(
  loc(58, 40, "Mar de Aral", "Asia Central", at("Este es el Mar de Aral", 40), 6.0),
  otag({ text: "4º", eyebrow: "El", label: "lago más grande del planeta", accent: "cold", corner: "tr" }, at("era el cuarto lago mas grande", 150), 6.0),
  nt("Amu Daria & Sir Daria", "Los dos ríos que lo mantenían vivo", "cold", at("el Amu Daria y el Sir Daria", 360), 5.5),
  ph("El *oro blanco*: algodón", "amber", at("lo que ellos llamaban el oro blanco", 600), 4.0),
  otag({ value: 90, suffix: "%", eyebrow: "Perdió el", label: "de su volumen de agua", accent: "danger", corner: "tr" }, at("habia perdido alrededor del noventa", 1200), 6.0),
  otag({ text: "2005", eyebrow: "Represa de Kokaral", label: "13 km de muro que cambió todo", accent: "accent", corner: "bl" }, at("en el ano dos mil cinco lo construyeron", 1250), 6.0),
  ph("El agua *volvió*", "accent", at("empezo a volver", 1350), 4.0),
);
// barra de salinidad: sube (muerte) — la ponemos en la sección de sal
beats.push({ id: "meter_salt", start: +(at("se volvia mas y mas salado", 700) + INTRO).toFixed(2), dur: 7.0, kind: "metertag", overlay: true, label: "Salinidad del mar", fromPct: 20, toPct: 100, eyebrow: "El mar se envenena", corner: "tr", rising: true });

fs.writeFileSync("beatsheet/aral.json", JSON.stringify({ video: "aral", beats }, null, 1));
const raw = beats.filter((b) => b.kind === "raw").length;
const types = new Set(beats.filter((b) => b.kind !== "raw").map((b) => b.kind));
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · tipos no-raw: ${types.size}`);
console.log(`fondos: ${nClip} clips · ${nReal} reales · ${nAi} IA · VIDEO_END=${VIDEO_END}`);
