// build_barcos.mjs — FUENTE ÚNICA del video "7 Barcos" (Crónicas Perdidas).
// Estilo: documental de COMPILACIÓN, CLIPS-FIRST y muy dinámico (corte cada ~2.5-3.5s).
// Mayoría = clips reales de YouTube (broll/ vía matchclip); imágenes (real/ vía fetch_bing)
// solo para artefactos/mapas puntuales; componentes (stat/timeline/bars...) como ACENTOS.
//
// Emite:  beatsheet/barcos.json  +  public/broll/match_barcos.json  +  public/real/bing_barcos.json
// Luego:  node beatsheet.mjs beatsheet/barcos.json   (deriva cues_barcos.gen.tsx)
//
// SLICE 1 = cold-open + #7 Uluburún (0:00-~6:56) para sign-off de estilo.
import fs from "fs";

const B = [], M = [], I = [];
const seenM = new Set(), seenI = new Set();
let T = 0.1, _n = 0;
const nid = (p) => p + String(++_n).padStart(3, "0");

// clip real (broll/ vía matchclip). query = string o array de variantes.
const clip = (dur, name, query, concept, o = {}) => {
  B.push({ id: nid("c"), start: +T.toFixed(2), dur, kind: "raw", src: "broll/" + name + ".mp4", hue: o.hue || "cold", ...(o.kicker ? { kicker: o.kicker } : {}), ...(o.darken != null ? { darken: o.darken } : {}) });
  if (!seenM.has(name)) { seenM.add(name); M.push({ name, query: Array.isArray(query) ? query : [query], concept, dur: Math.max(4, Math.ceil(dur) + 1) }); }
  T += dur;
};
// imagen real (real/ vía fetch_bing) — para artefactos/mapas que el video no muestra bien.
const img = (dur, name, query, concept, o = {}) => {
  B.push({ id: nid("i"), start: +T.toFixed(2), dur, kind: "raw", src: "real/" + name + ".jpg", hue: o.hue || "amber", ...(o.kicker ? { kicker: o.kicker } : {}) });
  if (!seenI.has(name)) { seenI.add(name); I.push({ name, query, concept, count: 1 }); }
  T += dur;
};
// componente-acento (sin asset externo)
const C = (dur, o) => { B.push({ id: nid(o.kind), start: +T.toFixed(2), dur, ...o }); T += dur; };
const seek = (s) => { T = s; }; // re-anclar a un timestamp real de la narración
// overlay ENCIMA de los clips (capa documental): NO mueve el cursor T.
const ov = (start, dur, o) => B.push({ id: nid("o"), start: +start.toFixed(2), dur, overlay: true, ...o });
// tokens KineticHeadline: "palabra" o ["palabra","hl"|"danger"|"good"] (resaltado)
const tk = (arr) => arr.map((x) => (Array.isArray(x) ? { t: x[0], [x[1]]: true } : { t: x }));
// líneas AgedDoc: "texto" o ["texto","mark"] (resaltador encima)
const dl = (arr) => arr.map((x) => (Array.isArray(x) ? { text: x[0], mark: true } : { text: x }));

// ╔═══════════════ COLD OPEN (0:00 – ~2:50) ═══════════════╗
seek(0.1);
clip(3.0, "abyss_descend", ["descending into deep dark ocean abyss", "sinking into the deep sea dark"], "descending into the dark deep ocean", { darken: 0.18 });
clip(3.1, "wreck_intact_seabed", ["intact ancient wooden shipwreck on seabed", "ancient wreck on the ocean floor documentary"], "an intact ancient wooden shipwreck on the dark seabed", { darken: 0.16 });
seek(6.2);
clip(2.6, "wreck_mast", ["ancient shipwreck mast underwater", "old ship mast underwater"], "the mast of an old ship underwater");
clip(2.6, "wreck_rudder", ["ancient ship rudder underwater wreck", "wooden ship rudder underwater"], "the wooden rudder of an old shipwreck");
seek(11.4);
clip(2.9, "rowing_benches", ["wooden rowing benches ancient ship interior", "inside ancient ship hull wooden"], "wooden rowing benches inside an ancient ship");
clip(3.0, "wreck_deck_eerie", ["empty shipwreck deck underwater eerie", "deserted ship deck underwater"], "an eerie empty shipwreck deck underwater");
seek(17.3);
clip(3.3, "wreck_interior_dark", ["abandoned shipwreck interior dark underwater", "inside a sunken ship dark"], "the dark interior of an abandoned shipwreck", { darken: 0.14 });
clip(3.4, "diver_wreck_torch", ["diver exploring shipwreck flashlight beam", "scuba diver wreck torch light"], "a diver exploring a shipwreck with a flashlight");
seek(24.0);
clip(3.2, "research_vessel_deck", ["marine archaeology research ship deck equipment", "research vessel ocean deck"], "scientists working on a marine research vessel deck", { hue: "blue" });
clip(3.3, "sonar_lab_screens", ["scientists looking at sonar monitors lab", "marine sonar control room screens"], "scientists studying sonar monitors in a lab", { hue: "blue" });
seek(30.5);
clip(3.1, "rov_lights_wreck", ["ROV submersible lights up shipwreck deep sea", "remotely operated vehicle wreck deep"], "a submersible lighting up a shipwreck in the deep", { darken: 0.16 });
clip(3.2, "sonar_3d_wreck", ["3d sonar scan model of shipwreck", "multibeam sonar wreck model"], "a 3d sonar scan model of a shipwreck", { hue: "blue" });
clip(3.2, "wreck_timbers", ["preserved ancient ship timbers underwater", "old wooden ship planks underwater"], "preserved ancient ship timbers underwater");
seek(40.0);
clip(4.7, "stormy_ocean_omen", ["stormy dark ocean dramatic ominous", "dark sea storm waves"], "a dark stormy ominous ocean", { hue: "cold", darken: 0.2 });
seek(44.7);
img(2.8, "antikythera_fragment", "antikythera mechanism main fragment museum", "the corroded bronze antikythera mechanism fragment in a museum");
clip(2.9, "museum_bronze_case", ["ancient bronze artifact museum glass case", "museum display bronze object"], "an ancient bronze artifact in a museum case");
seek(50.4);
img(2.8, "antikythera_gears", "antikythera mechanism bronze gears close up", "intricate corroded bronze gears macro");
clip(3.0, "gears_model_turning", ["brass gears mechanism model turning", "antikythera reconstruction gears rotating"], "rotating brass gears of a mechanical model", { hue: "amber" });
clip(2.9, "planets_orbits", ["planets orbiting sun animation", "solar system planets motion"], "the planets orbiting in the solar system", { hue: "blue" });
clip(2.9, "solar_eclipse", ["solar eclipse sun moon", "total eclipse of the sun"], "a solar eclipse", { hue: "cold" });
seek(62.1);
C(6.0, { kind: "stat", value: 1400, suffix: " años", label: "hasta volver a fabricar algo igual", eyebrow: "Una computadora de bronce", accent: "accent", hue: "amber" });
clip(4.3, "astronomical_clock", ["medieval astronomical clock cathedral gears", "old astronomical clock mechanism"], "a medieval astronomical clock with brass gears", { hue: "amber" });
seek(72.4);
clip(3.0, "sink_dark_again", ["sinking into deep dark ocean", "object sinking into the sea"], "sinking into the dark deep ocean", { darken: 0.18 });
clip(3.0, "bronze_on_seabed", ["corroded bronze artifact on seabed", "old metal object on the sea floor"], "a corroded bronze artifact on the seabed");
seek(78.4);
clip(4.0, "guanabara_aerial", ["guanabara bay rio de janeiro aerial", "rio de janeiro coastline aerial"], "an aerial view of guanabara bay in rio", { hue: "blue" });
clip(4.1, "atlantic_crossing_ship", ["old sailing ship crossing rough atlantic", "tall ship open ocean waves"], "an old sailing ship crossing the rough atlantic", { hue: "cold" });
seek(86.5);
C(6.4, { kind: "stat", value: 1500, suffix: " años antes", label: "que Colón y los portugueses", eyebrow: "Un océano cruzado", accent: "danger", hue: "red" });
seek(93.2);
clip(3.1, "restricted_tape", ["restricted area tape barrier", "do not cross police tape"], "a restricted area barrier tape", { hue: "red" });
clip(3.1, "site_roped_divers", ["underwater site roped off marker buoys", "cordoned underwater archaeology site"], "an underwater site roped off with markers", { hue: "cold" });
clip(3.2, "officials_documents", ["officials sealing stamping documents", "government office sealing files"], "officials sealing and stamping documents", { hue: "red" });
seek(102.8);
C(4.5, { kind: "aged", heading: "ACCESO CLAUSURADO", lines: dl(["Investigación suspendida", ["Sitio cubierto por sedimento", "mark"], "Preguntas sin respuesta"]), eyebrow: "El hallazgo incómodo", accent: "danger", hue: "red" });
clip(2.8, "silt_settling", ["silt sediment settling underwater cloud", "mud cloud underwater"], "silt and sediment settling over the seabed", { darken: 0.14 });
clip(2.9, "archive_boxes", ["old archive boxes stored shelves", "dusty document boxes storage"], "old archive boxes stored away on shelves", { hue: "amber" });
seek(113.5);
clip(3.8, "primitive_engraving", ["old engraving of primitive ancient people", "antique illustration ancient tribe"], "an old engraving of primitive ancient people", { hue: "amber" });
clip(3.8, "ancients_on_shore", ["ancient people looking out to sea shore painting", "people on ancient coast horizon"], "ancient people looking out to sea from the shore", { hue: "amber" });
seek(121.1);
clip(4.3, "progress_line", ["rising progress line graph concept", "ascending timeline arrow"], "a rising straight progress line", { hue: "blue" });
clip(4.3, "modern_city_time", ["modern city skyline timelapse", "city lights timelapse night"], "a modern city skyline timelapse", { hue: "blue" });
seek(129.7);
clip(5.9, "deep_mystery_water", ["mysterious deep dark ocean water slow", "deep sea blackness slow"], "mysterious dark deep ocean water", { darken: 0.18 });
seek(135.6);
C(6.0, { kind: "headline", tokens: tk(["Barcos", ["imposibles.", "danger"], "Tecnología", ["perdida.", "danger"], "Silencios", ["incómodos.", "danger"]]), bg: "image", image: "real/dark_ocean.jpg", hue: "red", size: 92 });
seek(141.6);
C(9.5, { kind: "headline", tokens: tk([["7", "hl"], "barcos", "que", "la", "ciencia", "no", "puede", ["explicar", "hl"]]), bg: "image", image: "real/shipwreck_dramatic.jpg", hue: "amber", size: 96 });
seek(151.1);
clip(4.5, "wreck_montage_drama", ["dramatic shipwrecks underwater montage", "sunken ships god rays"], "dramatic shipwrecks underwater", { darken: 0.12 });
seek(155.7);
clip(5.9, "blue_descent_suspense", ["descending into deep blue ocean suspense", "slow descent blue water"], "a slow suspenseful descent into the blue deep", { darken: 0.14 });
seek(161.6);
clip(4.5, "old_world_map_unroll", ["ancient world map unrolling", "antique map close up"], "an ancient world map unrolling", { hue: "amber" });
clip(4.5, "ship_to_unknown_coast", ["old ship sailing toward unknown coastline", "tall ship approaching land"], "an old ship sailing toward an unknown coast", { hue: "cold" });

// ╔═══════════════ #7 — ULUBURÚN (~2:50 – 6:56) ═══════════════╗
seek(170.6);
C(4.5, { kind: "rule", number: "07", title: "El Barco de Uluburún", label: "Costa sur de Turquía", hue: "amber" });
clip(3.0, "turkey_coast_aerial", ["turquoise mediterranean coast turkey aerial", "southern turkey coastline aerial"], "the turquoise mediterranean coast of turkey", { hue: "blue" });
seek(178.1);
img(3.6, "map_turkey_kas", "antique vintage map southern turkey coast", "an antique map of the southern turkish coast", { kicker: "1982" });
seek(181.7);
clip(2.7, "free_diver_descend", ["free diver descending clear blue sea", "diver sinking into blue water"], "a diver descending in clear blue water");
clip(2.8, "sponge_diver_vintage", ["sponge diver underwater old footage", "traditional sponge diving"], "a sponge diver underwater");
seek(187.2);
clip(2.7, "diver_along_reef", ["scuba diver swimming along rocky reef", "diver exploring rocky seabed"], "a diver swimming along a rocky reef");
clip(2.7, "rocky_seabed_med", ["rocky sandy mediterranean seabed", "sea floor rocks sand"], "a rocky sandy mediterranean seabed");
seek(192.6);
img(3.0, "oxhide_ingots_seabed", "uluburun copper oxhide ingots underwater", "dark oxhide shaped metal ingots on the seabed");
clip(3.0, "objects_buried_sand", ["metal objects half buried in seabed sand", "artifacts in sand underwater"], "metal objects half buried in the seabed sand");
clip(3.0, "diver_finds_object", ["diver discovering object underwater excited", "diver uncovering artifact"], "a diver discovering an object underwater");
seek(201.6);
C(5.1, { kind: "loupe", image: "real/copper_oxhide_ingot.jpg", focusX: 0.52, focusY: 0.48, zoom: 2.6, label: "La marca del fundidor en el lingote", accent: "cyan" });
seek(206.7);
C(7.0, { kind: "termcard", bg: "broll/excavation_grid.mp4", image: "real/copper_oxhide_ingot.jpg", term: "Lingote 'oxhide'", definition: "Barras de cobre con forma de piel de buey: la 'moneda' del comercio en la Edad de Bronce.", accent: "amber" });
clip(3.9, "raising_artifact", ["raising ancient artifact to surface boat", "lifting artifact from sea"], "raising an ancient artifact to the surface");
seek(217.6);
C(3.3, { kind: "nametag", name: "Uluburun", sub: "La nave de la Edad de Bronce", accent: "accent" });
C(6.8, { kind: "scalecolossus", image: "real/bronze_age_ship_art.jpg", meters: 15, unit: "m", eyebrow: "La nave de Uluburún", label: "de eslora", accent: "cyan" });
seek(227.7);
C(6.2, { kind: "ghost", real: "real/bronze_age_shipwreck_site.jpg", ghost: "real/bronze_age_ship_art.jpg", label: "Así surcaba el Mediterráneo", accent: "cyan" });
seek(233.9);
C(3.2, { kind: "stat", value: 3300, prefix: "+", suffix: " años", label: "de antigüedad", eyebrow: "Se hundió ~1300 a.C.", accent: "accent", hue: "amber" });
seek(237.1);
C(7.5, { kind: "timeline", eyebrow: "Plena Edad de Bronce", title: "Mil años antes de Roma", events: [{ year: "1300 a.C.", label: "Uluburun" }, { year: "27 a.C.", label: "Imperio Romano" }] });
seek(244.6);
clip(5.1, "calm_deep_dark", ["calm dark deep sea slow", "still deep ocean water"], "calm dark deep sea water", { darken: 0.16 });
seek(249.7);
C(9.9, { kind: "focuscard", bg: "broll/cargo_hold_amphorae.mp4", image: "real/copper_ingots_stack.jpg", eyebrow: "La bodega", title: "Una carga de otro mundo", desc: "Diez toneladas de cobre, una de estaño y objetos de once culturas distintas — en una sola nave.", accent: "amber" });
seek(259.6);
C(5.0, { kind: "bars", title: "La carga de metal", unit: " t", bars: [{ label: "Cobre", value: 10 }, { label: "Estaño", value: 1 }], accent: "accent", hue: "amber" });
seek(264.6);
C(8.1, { kind: "splitexplain", bg: "broll/bronze_foundry.mp4", image: "real/copper_ingots_stack.jpg", eyebrow: "Por qué importaba", title: "Cobre + estaño = bronce", points: ["El metal más valioso de la era", "Armas, herramientas y lujo", "Por eso cruzaban mares por él"], accent: "amber" });
seek(272.7);
C(4.0, { kind: "stat", value: 11, suffix: " culturas", label: "en un solo barco", eyebrow: "La carga imposible", accent: "danger", hue: "red" });
clip(3.9, "artifacts_civilizations", ["ancient artifacts of various civilizations museum", "museum gallery ancient objects"], "ancient artifacts from various civilizations in a museum", { hue: "amber" });
seek(280.6);
C(24.0, { kind: "evidenceboard", title: "Una sola bodega · once culturas", accent: "red", items: [
  { src: "real/canaanite_jars.jpg", label: "Vasija cananea" },
  { src: "real/ebony_logs.jpg", label: "Ébano · África" },
  { src: "real/ivory_tusk.jpg", label: "Marfil" },
  { src: "real/egyptian_gold_jewelry.jpg", label: "Oro · Egipto" },
  { src: "real/mycenaean_pottery.jpg", label: "Cerámica micénica" },
  { src: "real/baltic_amber.jpg", label: "Ámbar · Báltico" },
] });
seek(304.6);
img(3.7, "old_mediterranean_map", "antique map mediterranean sea europe", "an antique map of the mediterranean and europe");
clip(3.8, "baltic_cold_coast", ["cold northern baltic sea coast", "grey northern european shore"], "the cold northern baltic coast", { hue: "cold" });
seek(312.7);
clip(3.3, "ocean_contemplative", ["dramatic ocean horizon contemplative slow", "vast sea pause"], "a vast contemplative ocean horizon", { hue: "cold" });
seek(316.0);
C(12.5, { kind: "expeditionmap", mapImage: "real/old_mediterranean_map.jpg", eyebrow: "Una red de comercio global", title: "Un solo barco conectaba el mundo conocido",
  route: [{ x: 0.64, y: 0.44 }, { x: 0.52, y: 0.5 }, { x: 0.42, y: 0.46 }, { x: 0.34, y: 0.28 }, { x: 0.2, y: 0.64 }],
  pins: [{ x: 0.64, y: 0.44, label: "Egipto" }, { x: 0.52, y: 0.5, label: "Grecia" }, { x: 0.42, y: 0.46, label: "Mesopotamia" }, { x: 0.34, y: 0.28, label: "Báltico" }, { x: 0.2, y: 0.64, label: "África" }], accent: "amber" });
seek(328.5);
clip(3.2, "ship_hold_mixed", ["ship hold full of jars and artifacts", "mixed cargo ancient ship"], "a ship hold full of mixed jars and artifacts");
clip(3.3, "amphorae_stacked", ["stacked amphorae cargo ancient", "rows of amphorae storage"], "stacked amphorae cargo");
clip(3.3, "ancient_port_goods", ["ancient port trade goods unloading", "harbor cargo ancient illustration"], "trade goods at an ancient port", { hue: "amber" });
seek(341.7);
C(8.6, { kind: "thennow", before: { src: "real/oxhide_ingots_seabed.jpg", label: "En el lecho marino" }, after: { src: "real/copper_oxhide_ingot.jpg", label: "Restaurado" }, accent: "amber" });
seek(350.3);
clip(5.3, "navigation_stars", ["celestial navigation stars night sea", "navigating by stars at night"], "navigating by the stars over the sea at night", { hue: "blue" });
seek(355.6);
C(7.6, { kind: "chips", bg: "image", image: "real/mediterranean_sea_wind.jpg", title: "Sabían leer", chips: ["los vientos", "las corrientes", "los puertos", "los idiomas"], hue: "amber" });
seek(363.2);
img(3.5, "ancient_coins", "ancient bronze age trade weights coins metal", "ancient metal trade weights and coins");
seek(366.7);
clip(3.8, "ancient_harbor_busy", ["busy ancient mediterranean harbor reconstruction", "crowded ancient port"], "a busy ancient mediterranean harbor", { hue: "amber" });
clip(3.8, "ships_docking_port", ["ancient trade ships docking at port", "wooden ships in harbor"], "ancient trade ships docking at a port", { hue: "amber" });
clip(3.8, "trade_routes_lines", ["animated trade routes map glowing lines", "map with connecting route lines"], "a map with animated glowing trade routes", { hue: "blue" });
seek(378.6);
clip(5.7, "ancient_scribe", ["ancient scribe writing on scroll", "scribe recording on papyrus"], "an ancient scribe writing on a scroll", { hue: "amber" });
seek(384.3);
img(6.4, "empty_archive_shelves", "empty old dusty archive library shelves", "empty dusty archive shelves with no records", { hue: "cold" });
seek(390.7);
clip(3.4, "ship_sinking_dark", ["wooden ship sinking into dark water", "ship going down at sea"], "a wooden ship sinking into the dark water", { darken: 0.18 });
clip(3.5, "shadows_underwater", ["fading shadows underwater dark", "dark silhouettes sinking"], "fading shadows sinking underwater", { darken: 0.2 });
seek(397.6);
clip(4.0, "stone_fissure", ["cracked stone fissure dramatic", "crack splitting rock"], "a dramatic crack splitting stone");
clip(4.0, "vast_deep_unknown", ["vast deep ocean unknown dark", "endless deep sea"], "the vast unknown deep ocean", { darken: 0.16 });
clip(4.1, "bronze_ship_sunset", ["ancient ship sailing into sunset sea", "tall ship golden hour ocean"], "an ancient ship sailing into the sunset", { hue: "amber" });
seek(409.7);
C(6.6, { kind: "headline", tokens: tk(["¿Qué", "más", "eran", ["capaces", "hl"], "de", ["hacer?", "hl"]]), bg: "image", image: "real/shipwreck_dramatic.jpg", hue: "amber", size: 100 });

// ── CAPA DOCUMENTAL (overlays suaves sobre los clips) ───────────────────────
ov(78.4, 6, { kind: "placetag", place: "Bahía de Guanabara", sub: "Brasil", accent: "ice" });
ov(170.6, 245, { kind: "countrail", rank: 7, total: 7, name: "Uluburún", accent: "amber" });
ov(178.1, 5, { kind: "datestamp", value: "1982", label: "AÑO", accent: "cyan", corner: "tr" });
ov(181.7, 6, { kind: "placetag", place: "Cabo Uluburún", sub: "Costa sur de Turquía · Mediterráneo", accent: "cyan" });
ov(192.6, 8, { kind: "sonarhud", depth: "PROF. 44 m", coords: "36.1°N 29.6°E", accent: "ice" });
ov(192.6, 6, { kind: "doclabel", label: "Lingotes de cobre", sub: "forma de 'piel de buey'", accent: "amber" });
ov(206.7, 6, { kind: "sourcechip", text: "Naufragio de Uluburun · Museo de Bodrum", accent: "cyan" });
ov(227.7, 6, { kind: "datestamp", value: "≈1300 a.C.", label: "ÉPOCA", accent: "amber", corner: "tr" });
// (las etiquetas de artefactos y los origin-pips ahora los cubren EvidenceBoard y ExpeditionMap)

// fondos de componentes (headline/chips) que referencian real/ directo (no pasan por img())
// → agregarlos a la lista de fetch_bing para que el pipeline sea autocontenido.
const compBg = [
  { name: "dark_ocean", query: "dark deep ocean water moody surface", concept: "dark moody deep ocean water" },
  { name: "shipwreck_dramatic", query: "dramatic shipwreck underwater god rays", concept: "a dramatic shipwreck underwater with rays of light" },
  { name: "mediterranean_sea_wind", query: "mediterranean sea waves wind open water", concept: "windy mediterranean sea waves on open water" },
];
for (const c of compBg) if (!seenI.has(c.name)) { seenI.add(c.name); I.push({ ...c, count: 1 }); }

// imágenes usadas SOLO por set pieces (van por C(), no por img()) → al bing list igual
const setImgs = [
  { name: "copper_oxhide_ingot", query: "copper oxhide ingot bronze age artifact", concept: "an oxhide shaped copper ingot" },
  { name: "bronze_age_ship_art", query: "bronze age trading ship illustration reconstruction", concept: "an illustration of a bronze age wooden trading ship" },
  { name: "bronze_age_shipwreck_site", query: "uluburun shipwreck excavation site underwater", concept: "the uluburun shipwreck excavation site underwater" },
  { name: "canaanite_jars", query: "canaanite storage jars bronze age pottery", concept: "ancient canaanite ceramic storage jars" },
  { name: "ebony_logs", query: "ebony wood dark logs raw", concept: "dark raw ebony wood logs" },
  { name: "ivory_tusk", query: "carved ancient ivory elephant tusk artifact", concept: "a carved ancient ivory tusk artifact" },
  { name: "egyptian_gold_jewelry", query: "ancient egyptian gold jewelry artifact", concept: "ancient egyptian gold jewelry" },
  { name: "mycenaean_pottery", query: "mycenaean pottery ancient greek vessel", concept: "an ancient mycenaean greek pottery vessel" },
  { name: "baltic_amber", query: "raw baltic amber pieces", concept: "raw pieces of baltic amber" },
  { name: "old_mediterranean_map", query: "antique map mediterranean sea europe", concept: "an antique map of the mediterranean and europe" },
  { name: "oxhide_ingots_seabed", query: "uluburun copper oxhide ingots underwater", concept: "dark oxhide shaped metal ingots on the seabed" },
  { name: "copper_ingots_stack", query: "stacked ancient copper ingots metal", concept: "a stack of ancient copper ingots" },
];
for (const c of setImgs) if (!seenI.has(c.name)) { seenI.add(c.name); I.push({ ...c, count: 1 }); }

// clips usados como FONDO de las fichas (van por bg, no por clip()) → al match list igual
const bgClips = [
  { name: "excavation_grid", query: ["underwater archaeology excavation grid", "measuring grid on shipwreck"], concept: "an underwater archaeology excavation grid", dur: 9 },
  { name: "cargo_hold_amphorae", query: ["shipwreck cargo hold amphorae underwater", "amphorae field on seabed"], concept: "a shipwreck cargo hold full of amphorae", dur: 11 },
  { name: "bronze_foundry", query: ["molten bronze pouring foundry", "casting bronze metal"], concept: "molten bronze being poured in a foundry", dur: 9 },
];
for (const c of bgClips) if (!seenM.has(c.name)) { seenM.add(c.name); M.push(c); }

// ── escribir las 3 salidas ───────────────────────────────────────────────────
const beatsheet = { video: "barcos", _nota: "SLICE 1 clip-driven (cold-open + #7 Uluburun). Faceless. ~" + B.length + " beats.", beats: B };
fs.writeFileSync("beatsheet/barcos.json", JSON.stringify(beatsheet, null, 1));
fs.writeFileSync("public/broll/match_barcos.json", JSON.stringify(M, null, 1));
fs.writeFileSync("public/real/bing_barcos.json", JSON.stringify(I, null, 1));
const clips = B.filter((b) => b.src?.startsWith("broll/")).length;
const imgs = B.filter((b) => b.src?.startsWith("real/")).length;
const comps = B.length - clips - imgs;
const last = B[B.length - 1];
console.log(`=== build barcos (SLICE) ===`);
console.log(`beats: ${B.length}  ·  clips: ${clips}  ·  imágenes: ${imgs}  ·  componentes: ${comps}`);
console.log(`clips únicos a matchear: ${M.length}  ·  imágenes únicas: ${I.length}`);
console.log(`fin del slice: ${(last.start + last.dur).toFixed(1)}s  ·  corte promedio: ${((last.start + last.dur) / B.length).toFixed(1)}s`);
console.log(`→ beatsheet/barcos.json · public/broll/match_barcos.json · public/real/bing_barcos.json`);
