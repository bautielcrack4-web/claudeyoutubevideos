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
// helpers para set pieces: registran el asset (img→I / clip→M) y devuelven la ruta lista.
// Así cada ficha/set-piece deja su imagen/clip en el bing/match list automáticamente.
const spImg = (name, query, concept) => { if (!seenI.has(name)) { seenI.add(name); I.push({ name, query, concept, count: 1 }); } return "real/" + name + ".jpg"; };
const spClip = (name, query, concept, dur = 6) => { if (!seenM.has(name)) { seenM.add(name); M.push({ name, query: Array.isArray(query) ? query : [query], concept, dur }); } return "broll/" + name + ".mp4"; };

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

// ╔═══════════════ #6 — BARCA SOLAR DE KEOPS (~7:00 – 10:40) ═══════════════╗
seek(416.33);
clip(3.8, "giza_pyramids_aerial", ["giza pyramids aerial egypt", "great pyramid of giza drone"], "the great pyramids of giza from above", { hue: "amber" });
C(3.0, { kind: "rule", number: "06", title: "La Barca Solar de Keops", label: "Giza, Egipto", hue: "amber" });
seek(422.6);
clip(3.6, "archaeologist_giza_1954", ["vintage egypt archaeology excavation 1950s", "old archaeologist digging egypt"], "an archaeologist at an excavation in egypt", { hue: "amber" });
clip(3.6, "giza_base_excavation", ["excavation at base of great pyramid", "digging beside pyramid of giza"], "excavation at the base of the great pyramid");
seek(429.77);
clip(3.9, "clearing_sand_pyramid", ["clearing sand and rubble pyramid dig", "removing debris archaeology egypt"], "clearing sand and rubble at a pyramid dig");
clip(3.9, "archaeologist_discovery", ["archaeologist surprised at discovery", "researcher uncovering ancient find"], "an archaeologist making a surprising discovery");
seek(437.61);
img(4.5, "sealed_limestone_blocks", "row of massive sealed limestone blocks giza", "a row of sealed limestone blocks", { hue: "amber" });
clip(5.6, "ancient_sealed_chamber", ["sealed ancient stone chamber", "hidden chamber behind stone blocks"], "a sealed ancient stone chamber", { darken: 0.14 });
seek(447.7);
clip(5.5, "dark_chamber_torch", ["dark ancient chamber torchlight", "lantern light inside tomb"], "a dark ancient chamber lit by torchlight", { hue: "amber", darken: 0.16 });
clip(4.2, "cedar_wood_ancient", ["ancient cedar wood beams texture", "old aromatic wooden beams"], "ancient cedar wood", { hue: "amber" });
seek(457.33);
clip(3.6, "empty_stone_chamber", ["empty ancient stone chamber", "bare interior stone room"], "an empty stone chamber", { darken: 0.14 });
clip(4.1, "tomb_no_treasure", ["empty egyptian tomb interior", "bare burial chamber egypt"], "an empty egyptian tomb with no treasure", { darken: 0.12 });
seek(465.1);
C(5.7, { kind: "impact", image: spImg("khufu_boat_museum", "khufu solar boat museum giza hall", "the khufu solar barge in its museum hall"), impact: "Había un barco", setup: "Debajo no había una tumba…", impactAccent: "accent", hue: "amber" });
seek(472.4);
clip(6.2, "khufu_boat_pieces", ["disassembled ancient wooden boat parts", "ancient ship timbers laid out"], "the khufu boat in disassembled pieces");
seek(478.7);
clip(7.7, "boat_reconstruction_museum", ["reconstructing ancient wooden boat museum", "assembling old wooden ship"], "reconstructing the ancient wooden boat", { hue: "amber" });
seek(486.39);
C(8.3, { kind: "scalecolossus", image: spImg("khufu_solar_boat", "khufu solar boat full side view museum", "the full khufu solar barge"), meters: 43, unit: "m", eyebrow: "La barca de Keops", label: "de eslora · cedro del Líbano", accent: "cyan" });
seek(501.68);
clip(3.5, "ancient_wood_planks", ["ancient wooden ship planks close up", "old boat hull wood detail"], "ancient wooden ship planks");
seek(505.13);
clip(6.5, "wood_water_marks", ["water marks on old weathered wood", "worn ship timber"], "water marks on ancient wood", { hue: "amber" });
seek(511.6);
clip(6.5, "khufu_boat_hull", ["ancient wooden ship hull side", "old boat hull museum"], "the hull of an ancient wooden ship");
seek(518.1);
C(6.6, { kind: "quote", image: "real/khufu_boat_museum.jpg", text: "Una nave real… que de verdad había *navegado*", accent: "accent", hue: "amber", fontSize: 92 });
seek(524.7);
clip(2.0, "great_pyramid_close", ["great pyramid giza close up stones", "massive pyramid blocks"], "the great pyramid up close");
C(7.5, { kind: "quote", image: "real/sealed_limestone_blocks.jpg", text: "¿Por qué enterrar un barco *funcional* bajo toneladas de piedra?", accent: "danger", hue: "amber", fontSize: 78 });
seek(539.7);
C(8.0, { kind: "termcard", bg: spClip("sun_over_nile", ["sun over the nile golden egypt", "egyptian sky with sun rays"], "the sun over the nile in egypt", 9), image: "real/khufu_solar_boat.jpg", term: "Barca solar", definition: "Nave para que el faraón navegara junto al dios Sol en su viaje eterno al más allá.", accent: "amber" });
seek(554.34);
C(6.2, { kind: "quote", image: "real/khufu_boat_museum.jpg", text: "Hermosa teoría. Pero *solo* eso.", accent: "accent", hue: "cold", fontSize: 96 });
seek(560.59);
clip(5.3, "empty_chamber_wall", ["blank ancient chamber wall stone", "smooth bare tomb wall"], "a bare chamber wall with no inscription", { darken: 0.14 });
seek(565.91);
clip(4.7, "plain_stone_surface", ["plain smooth ancient stone surface", "blank egyptian stone wall"], "a plain ancient stone surface", { hue: "amber" });
seek(570.6);
clip(5.8, "boat_craftsmanship", ["ancient wooden boat joinery detail", "wooden ship construction craftsmanship"], "the craftsmanship of an ancient boat", { hue: "amber" });
seek(576.37);
C(11.0, { kind: "splitexplain", bg: spClip("rope_lashed_wood", ["wood lashed with rope boat", "vegetal rope tying timber"], "wood lashed together with rope", 12), image: spImg("khufu_hull_detail", "khufu boat hull rope joints close", "the rope-joined hull of the khufu boat"), eyebrow: "Ingeniería imposible", title: "Sin un solo clavo", points: ["Tablas cosidas con cuerda vegetal", "La cuerda se hincha con el agua", "Y sella el casco sin metal"], accent: "amber" });
seek(595.6);
clip(5.0, "replica_boat_water", ["replica wooden boat floating test water", "reconstructed ship launched on water"], "a replica wooden boat floating on water", { hue: "blue" });
clip(4.1, "wooden_boat_sailing", ["old style wooden boat sailing calm", "traditional wooden boat on water"], "a wooden boat sailing on calm water", { hue: "blue" });
seek(607.7);
C(5.5, { kind: "stat", value: 4500, suffix: " años", label: "después, la técnica seguía funcionando", eyebrow: "Y flotó", accent: "accent", hue: "amber" });
seek(613.18);
clip(4.4, "calm_water_surface", ["calm deep water surface reflection", "still water"], "calm deep water", { hue: "cold", darken: 0.14 });
seek(617.6);
C(7.1, { kind: "quote", image: "real/khufu_boat_museum.jpg", text: "Si esto enterraban para sus *muertos*…", accent: "accent", hue: "amber", fontSize: 88 });
seek(624.7);
clip(4.7, "pyramids_dusk", ["pyramids of giza at dusk", "giza pyramids sunset silhouette"], "the pyramids of giza at dusk", { hue: "amber" });
seek(629.38);
clip(5.0, "sealed_door_pyramid", ["sealed door inside pyramid passage", "blocked ancient stone passage"], "a sealed door inside a pyramid", { darken: 0.16 });
C(5.2, { kind: "headline", tokens: tk([["Cámaras", "hl"], "que", "nadie", "ha", "abierto"]), bg: "image", image: "real/sealed_limestone_blocks.jpg", hue: "amber", size: 84 });

// ╔═══════════════ #5 — EL BARCO FANTASMA DEL MAR NEGRO (~10:40 – 14:25) ═══════════════╗
seek(639.6);
clip(6.1, "dark_ocean_descend5", ["descending into dark ocean water", "sinking into black deep sea"], "descending into dark mysterious water", { hue: "cold", darken: 0.2 });
C(2.5, { kind: "rule", number: "05", title: "El Barco Fantasma del Mar Negro", label: "Mar Negro", hue: "blue" });
seek(648.2);
clip(4.1, "black_sea_surface", ["black sea dark moody water surface", "black sea coastline"], "the dark surface of the black sea", { hue: "cold" });
seek(652.31);
C(7.3, { kind: "termcard", bg: spClip("black_sea_deep_dark", ["deep black sea dark water no light", "abyssal dark water column"], "the lightless deep of the black sea", 8), image: spImg("anoxic_layer_diagram", "black sea anoxic layer cross section diagram", "a diagram of the black sea anoxic layer"), term: "Zona anóxica", definition: "Bajo cierta profundidad no hay oxígeno: nada se descompone. El tiempo, literalmente, se congela.", accent: "cyan" });
seek(659.1);
clip(3.7, "dead_zone_water", ["lifeless dark deep water", "empty black water"], "a lifeless dark water column", { hue: "cold", darken: 0.18 });
seek(666.7);
clip(5.2, "preserved_wood_underwater", ["preserved wood underwater dark", "intact timber deep water"], "perfectly preserved wood underwater", { hue: "cold" });
clip(5.2, "time_frozen_deep", ["still frozen deep sea", "motionless dark abyss"], "the frozen stillness of the deep", { hue: "cold", darken: 0.16 });
seek(677.6);
clip(3.5, "intact_object_underwater", ["intact ancient object underwater", "preserved artifact deep sea"], "an intact ancient object underwater", { hue: "cold" });
seek(681.1);
C(5.0, { kind: "quote", image: spImg("black_sea_abyss", "black sea abyss dark deep", "the dark abyss of the black sea"), text: "El tiempo, en cierto sentido, se *congela*.", accent: "accent", hue: "cold", fontSize: 96 });
seek(686.7);
clip(4.2, "research_ship_sonar5", ["research vessel sonar survey deck", "marine survey ship at sea"], "a research vessel surveying with sonar", { hue: "blue" });
clip(4.2, "sonar_screen_blip", ["sonar screen detecting object", "multibeam sonar display screen"], "a sonar screen detecting an object", { hue: "blue" });
seek(695.11);
C(5.5, { kind: "stat", value: 2000, prefix: "+", suffix: " m", label: "de profundidad", eyebrow: "Una silueta imposible", accent: "accent", hue: "cold" });
seek(700.6);
clip(6.1, "sonar_regular_shape", ["3d sonar model symmetrical shape seabed", "too regular shape sonar scan"], "a too-regular shape on the sonar scan", { hue: "blue" });
seek(706.7);
clip(3.6, "rov_descent_dark", ["ROV descending into dark abyss", "submersible diving deep dark"], "an ROV descending into the dark abyss", { darken: 0.18 });
clip(2.3, "rov_lights_on", ["submersible lights turning on underwater", "ROV floodlights deep sea"], "a submersible turning on its lights", { hue: "cold" });
seek(712.54);
clip(8.2, "wreck_revealed_lights", ["shipwreck revealed by submersible lights", "wreck appears in floodlights deep"], "a shipwreck revealed in the floodlights", { hue: "cold", darken: 0.12 });
seek(720.7);
C(6.6, { kind: "impact", image: spImg("black_sea_greek_ship", "black sea oldest intact greek shipwreck", "the intact ancient greek shipwreck of the black sea"), impact: "Un barco griego. Entero.", setup: "Y entonces…", impactAccent: "accent" });
seek(727.28);
clip(6.2, "ancient_greece_classical", ["ancient greece classical era ruins", "golden age of greece"], "the golden age of ancient greece", { hue: "amber" });
seek(733.5);
clip(6.1, "ancient_greek_map", ["ancient greek world map antique", "first maps of the world old"], "an ancient greek map of the world", { hue: "amber" });
seek(739.68);
C(5.5, { kind: "stat", value: 2400, suffix: " años", label: "el barco intacto más antiguo del mundo", eyebrow: "Mástil aún en pie", accent: "accent", hue: "cold" });
clip(5.9, "intact_ship_mast", ["intact ancient ship mast underwater", "shipwreck mast standing in deep"], "the standing mast of the intact ship", { hue: "cold" });
seek(751.11);
C(5.6, { kind: "loupe", image: "real/black_sea_greek_ship.jpg", focusX: 0.5, focusY: 0.58, zoom: 2.4, label: "Timón y bancos de remeros, intactos", accent: "cyan" });
seek(756.7);
clip(6.1, "ghost_ship_dark5", ["ghostly intact shipwreck dark water", "eerie preserved wreck deep sea"], "the eerie intact ghost ship in the dark", { hue: "cold", darken: 0.14 });
seek(762.81);
clip(9.8, "experts_studying_data", ["researchers studying shipwreck data screens", "marine archaeologists analyzing"], "experts studying the wreck data", { hue: "blue" });
seek(772.6);
clip(12.5, "greek_vase_ship_scene", ["ancient greek vase ship painting", "red figure greek pottery ship"], "an ancient greek vase showing a ship", { hue: "amber" });
seek(785.7);
clip(6.6, "historians_old_books", ["historians studying old books", "scholars ancient texts library"], "historians poring over old books", { hue: "amber" });
seek(798.7);
C(11.5, { kind: "thennow", before: { src: spImg("siren_vase", "siren vase odysseus tied mast greek pottery", "the greek siren vase showing odysseus tied to the mast"), label: "Lo que creían fantasía" }, after: { src: "real/black_sea_greek_ship.jpg", label: "La realidad" }, accent: "amber" });
seek(810.18);
clip(5.9, "ghost_ship_deck5", ["empty eerie shipwreck deck underwater", "deserted ancient ship deck dark"], "the eerie empty deck of the ghost ship", { hue: "cold", darken: 0.16 });
seek(816.1);
C(7.6, { kind: "quote", image: "real/black_sea_abyss.jpg", text: "¿Qué hacía a *dos kilómetros* de profundidad?", accent: "danger", hue: "cold", fontSize: 84 });
seek(823.7);
clip(5.9, "storm_dark_sea5", ["dark stormy sea waves night", "violent ocean storm at night"], "a dark violent storm at sea", { hue: "cold", darken: 0.2 });
seek(829.6);
C(7.0, { kind: "quote", image: "real/black_sea_greek_ship.jpg", text: "Ni un solo *resto humano* de la tripulación.", accent: "danger", hue: "cold", fontSize: 86 });
seek(841.7);
C(6.8, { kind: "stat", value: 60, prefix: "+", suffix: " naufragios", label: "más, en el mismo estado imposible", eyebrow: "Una flota fantasma", accent: "accent", hue: "cold" });
seek(848.56);
clip(8.1, "ghost_fleet_sonar", ["multiple shipwrecks sonar map seabed", "fleet of wrecks underwater"], "a ghost fleet of wrecks on the seabed", { hue: "blue", darken: 0.12 });
seek(856.7);
clip(8.4, "abyss_waiting5", ["vast dark deep sea", "endless black abyss"], "the vast dark deep, waiting", { hue: "cold", darken: 0.18 });

// ╔═══════════════ #4 — LA FLOTA DE KUBLAI KHAN (~14:25 – 18:15) ═══════════════╗
seek(865.11);
C(2.6, { kind: "rule", number: "04", title: "La Flota de Kublai Khan", label: "Japón · Siglo XIII", hue: "red" });
seek(868.71);
clip(5.0, "kublai_khan_portrait", ["kublai khan mongol emperor portrait", "mongol khan painting"], "a portrait of kublai khan", { hue: "amber" });
clip(4.5, "mongol_empire_map", ["mongol empire vast map", "mongol horde army marching"], "the vast mongol empire", { hue: "amber" });
seek(878.7);
clip(3.7, "mongol_army_horde", ["mongol cavalry army horde", "mongol warriors riding"], "the mongol army", { hue: "amber" });
clip(4.7, "japan_coast_aerial", ["japan coastline aerial sea", "japanese coast cliffs ocean"], "the coast of japan", { hue: "blue" });
seek(889.7);
clip(6.6, "mongol_fleet_illustration", ["huge ancient war fleet illustration", "medieval invasion fleet ships"], "a huge ancient invasion fleet", { hue: "cold" });
seek(896.37);
C(7.5, { kind: "stat", value: 4400, prefix: "+", suffix: " barcos", label: "y más de 100.000 soldados", eyebrow: "La mayor invasión naval de la historia", accent: "danger", hue: "red" });
clip(5.8, "war_fleet_sea", ["fleet of wooden warships at sea", "armada of ancient ships ocean"], "a fleet of warships at sea", { hue: "cold" });
seek(909.7);
clip(4.8, "fleet_approaching", ["war fleet approaching coast", "ships approaching shore invasion"], "the fleet approaching the coast", { hue: "cold" });
seek(914.53);
C(6.0, { kind: "expeditionmap", mapImage: spImg("east_asia_map", "antique map east asia japan korea china", "an antique map of east asia"), eyebrow: "La invasión de 1281", title: "Del imperio mongol a Japón", route: [{ x: 0.4, y: 0.42 }, { x: 0.55, y: 0.5 }, { x: 0.66, y: 0.46 }], pins: [{ x: 0.4, y: 0.42, label: "China / Corea" }, { x: 0.66, y: 0.46, label: "Japón" }], accent: "red" });
clip(4.6, "japan_islands_dark", ["japan islands stormy sea dark", "japanese coast ominous"], "the islands of japan under dark skies", { hue: "cold", darken: 0.14 });
seek(925.69);
clip(4.4, "calm_before_storm", ["calm sea before storm fleet anchored", "anchored ships dusk"], "the fleet anchored, calm before the storm", { hue: "cold" });
seek(930.13);
C(6.6, { kind: "impact", image: spImg("typhoon_from_space", "typhoon storm satellite view ocean", "a colossal typhoon over the ocean"), impact: "Un tifón colosal", setup: "Y en cuestión de horas…", impactAccent: "danger" });
seek(940.2);
clip(3.5, "giant_waves_storm", ["giant ocean waves storm dark", "huge waves crashing ships"], "giant waves in a storm", { hue: "cold", darken: 0.16 });
seek(943.7);
clip(4.2, "ships_crashing_storm", ["wooden ships crashing in storm", "ships breaking apart waves"], "wooden ships crashing in the storm", { hue: "cold", darken: 0.16 });
clip(4.3, "ships_sinking_night", ["ships sinking into stormy sea night", "fleet going down storm"], "ships sinking into the stormy sea", { hue: "cold", darken: 0.2 });
seek(956.1);
clip(7.6, "calm_aftermath_sea", ["calm empty sea after storm wreckage", "debris floating empty ocean"], "the calm, empty sea after the storm", { hue: "cold", darken: 0.14 });
seek(963.7);
C(8.4, { kind: "termcard", bg: spClip("divine_wind_storm", ["divine wind storm clouds dramatic", "powerful wind over sea sky"], "dramatic storm clouds over the sea", 9), image: spImg("kamikaze_woodblock", "kamikaze divine wind japanese woodblock art", "a japanese woodblock of the kamikaze divine wind"), term: "Kamikaze", definition: "«Viento divino». Japón creyó que los dioses mismos soplaron desde el cielo para salvar su tierra sagrada.", accent: "red" });
seek(976.6);
clip(5.0, "japan_temple_sacred", ["japanese temple sacred misty", "shinto shrine japan ancient"], "a sacred japanese temple", { hue: "amber" });
clip(5.0, "japan_culture_old", ["old japan culture woodblock scene", "feudal japan illustration"], "old japanese culture", { hue: "amber" });
seek(986.7);
clip(4.8, "takashima_seabed", ["underwater archaeology japan seabed wreck", "divers japanese shipwreck site"], "the seabed off takashima", { hue: "cold" });
seek(991.44);
clip(4.3, "wreck_timbers_japan", ["sunken fleet timbers underwater japan", "mongol shipwreck remains seabed"], "the timbers of the sunken fleet", { hue: "cold" });
seek(995.7);
clip(10.4, "wreck_excavation_japan", ["underwater excavation shipwreck timbers", "archaeologists recovering wreck wood"], "the excavation of the sunken fleet", { hue: "cold" });
seek(1006.15);
C(5.9, { kind: "loupe", image: spImg("weak_ship_hull", "broken weak wooden ship hull joint", "a poorly built, weak ship hull joint"), focusX: 0.5, focusY: 0.5, zoom: 2.6, label: "Cascos débiles, ensamblados a las apuradas", accent: "red" });
seek(1012.08);
clip(8.0, "river_boat_vs_sea", ["flat river boat unfit for ocean", "small river barge wooden"], "a flat-bottomed river boat", { hue: "cold" });
seek(1024.67);
C(10.0, { kind: "splitexplain", bg: spClip("sunken_fleet_dark", ["sunken war fleet wreckage seabed dark", "field of shipwreck timbers underwater"], "the wreckage of the sunken fleet", 11), image: spImg("mongol_shipwreck_dive", "diver mongol shipwreck takashima japan", "a diver at the mongol shipwreck off japan"), eyebrow: "¿Por qué barcos defectuosos?", title: "Dos teorías", points: ["Astilleros forzados a fabricar miles sin tiempo", "Carpinteros chinos esclavizados que sabotearon las naves"], accent: "red" });
seek(1037.6);
clip(7.2, "ancient_chinese_shipyard", ["ancient chinese shipyard workers building", "old wooden ship construction yard"], "an ancient chinese shipyard", { hue: "amber" });
seek(1044.78);
clip(7.3, "rushed_construction", ["workers building ships in a hurry old", "rushed wooden boat building"], "ships being built in a hurry", { hue: "amber" });
seek(1052.68);
clip(9.2, "resentful_workers", ["oppressed laborers ancient china", "enslaved workers forced labor old"], "resentful, enslaved workers", { hue: "amber", darken: 0.12 });
seek(1061.88);
clip(7.2, "sabotage_hidden", ["hands secretly weakening wood joint", "hidden sabotage craftsmanship"], "secret sabotage of the ships", { hue: "red", darken: 0.14 });
seek(1069.7);
C(5.6, { kind: "quote", image: "real/typhoon_from_space.jpg", text: "Una herida abierta en la historia.", accent: "danger", hue: "cold", fontSize: 92 });
seek(1075.36);
clip(3.7, "storm_sky_divine", ["dramatic storm sky divine light", "god rays through storm clouds"], "a dramatic divine storm sky", { hue: "cold" });
seek(1079.03);
clip(6.0, "broken_ship_timbers", ["broken ship timbers dark underwater", "shattered wooden hull wreck"], "broken ship timbers underwater", { hue: "cold", darken: 0.16 });
C(4.7, { kind: "headline", tokens: tk(["¿Viento", "divino…", "o", ["traición?", "hl"]]), bg: "image", image: "real/typhoon_from_space.jpg", hue: "red", size: 90 });
clip(5.5, "japan_sea_unsettled", ["dark restless sea off japan", "moody ocean japan coast"], "the unsettled sea off japan", { hue: "cold", darken: 0.14 });

// ╔═══════════════ #3 — LOS BARCOS DE CALÍGULA (NEMI) (~18:15 – 22:40) ═══════════════╗
seek(1095.25);
clip(5.0, "lake_nemi_italy", ["lake nemi italy calm misty", "small italian crater lake"], "the calm lake nemi in italy", { hue: "cold" });
C(2.6, { kind: "rule", number: "03", title: "Los Barcos de Calígula", label: "Lago Nemi, Italia", hue: "amber" });
seek(1105.7);
clip(4.7, "foggy_lake_legend", ["foggy mysterious lake at dawn", "misty lake eerie italy"], "a foggy, mysterious lake", { hue: "cold", darken: 0.12 });
clip(4.9, "fishing_nets_lake", ["old fishing nets on a lake", "fisherman net snag water"], "fishing nets on the lake", { hue: "cold" });
seek(1115.3);
C(5.4, { kind: "quote", image: spImg("dark_lake_depths", "dark lake underwater murky depths", "the murky depths of a dark lake"), text: "Dos *monstruos* de madera dormían en el fondo.", accent: "accent", hue: "cold", fontSize: 90 });
seek(1122.7);
clip(6.2, "net_snag_underwater", ["something large under murky lake water", "submerged shape lake bottom"], "a large shape snagging the nets underwater", { hue: "cold", darken: 0.14 });
seek(1128.91);
clip(8.3, "old_fishermen_tale", ["old italian fishermen vintage", "village elders telling story"], "fishermen passing down a legend", { hue: "amber" });
seek(1139.7);
clip(7.2, "lake_draining_pumps", ["giant pumps draining a lake 1930s", "vintage water pumps machinery"], "giant pumps draining the lake", { hue: "amber" });
seek(1148.45);
clip(7.7, "lake_water_lowering", ["lake water level dropping exposing bed", "receding water muddy bottom"], "the lake level dropping", { hue: "amber" });
seek(1156.1);
clip(5.6, "muddy_lake_bed", ["muddy lake bed exposed under sun", "drained lake floor mud"], "the muddy lake bed exposed", { hue: "amber" });
seek(1161.7);
clip(8.1, "ship_emerging_mud", ["ancient ship emerging from mud excavation", "wreck revealed in drained lake"], "an ancient ship emerging from the mud", { hue: "amber" });
seek(1169.78);
C(3.3, { kind: "impact", image: spImg("nemi_ship_recovered", "nemi ship caligula recovered 1929 huge", "one of caligula's giant nemi ships recovered"), impact: "Eran dos barcos", impactAccent: "accent" });
seek(1173.11);
C(8.5, { kind: "scalecolossus", image: "real/nemi_ship_recovered.jpg", meters: 70, unit: "m", eyebrow: "Los barcos de Nemi", label: "de eslora · palacios flotantes", accent: "amber" });
seek(1184.7);
clip(3.4, "caligula_bust", ["roman emperor caligula bust marble", "ancient roman emperor statue"], "a bust of the emperor caligula", { hue: "amber" });
seek(1188.13);
clip(3.5, "floating_palace_art", ["roman luxury barge illustration", "ancient floating palace ship art"], "an illustration of a floating palace", { hue: "amber" });
seek(1191.6);
clip(8.0, "roman_marble_luxury", ["ancient roman marble floor luxury", "roman baths columns mosaic"], "roman marble luxury", { hue: "amber" });
seek(1200.6);
clip(4.0, "bronze_statue_roman", ["ancient roman bronze statue", "roman bronze sculpture museum"], "an ancient roman bronze statue", { hue: "amber" });
seek(1204.67);
clip(4.3, "nemi_ship_model", ["nemi ship model reconstruction roman barge", "roman ship museum model"], "a model of the nemi ship", { hue: "amber" });
seek(1208.99);
clip(5.8, "engineers_studying_artifact", ["engineers examining ancient artifact lab", "researchers studying old mechanism"], "modern engineers studying the find", { hue: "blue" });
seek(1219.7);
C(8.0, { kind: "termcard", bg: spClip("rotating_gear_machine", ["rotating machinery bearing turning", "industrial bearing spinning"], "rotating machinery on a bearing", 9), image: spImg("ball_bearing_ancient", "ancient roman ball bearing nemi artifact", "an ancient roman ball bearing from the nemi ships"), term: "Cojinete de bolas", definition: "Permite que una pieza pesada gire casi sin fricción. La base de toda la maquinaria moderna… en un barco romano.", accent: "cyan" });
seek(1227.7);
C(6.5, { kind: "loupe", image: "real/ball_bearing_ancient.jpg", focusX: 0.5, focusY: 0.5, zoom: 2.8, label: "Rodamiento de bolas — en bronce, hace 2.000 años", accent: "cyan" });
seek(1237.7);
C(6.0, { kind: "stat", value: 1500, suffix: " años", label: "antes de que Leonardo lo 'inventara'", eyebrow: "Adelantado", accent: "danger", hue: "amber" });
clip(3.5, "davinci_sketch", ["leonardo da vinci mechanical sketch", "renaissance engineering drawing"], "a da vinci mechanical sketch", { hue: "amber" });
seek(1247.23);
clip(7.0, "rotating_platform_roman", ["rotating platform mechanism ancient", "turning deck mechanism roman ship"], "a rotating platform mechanism", { hue: "amber" });
seek(1258.7);
C(10.4, { kind: "splitexplain", bg: spClip("roman_engineering_detail", ["ancient roman engineering pipes detail", "roman plumbing lead pipes"], "ancient roman engineering detail", 11), image: spImg("roman_lead_pipes", "ancient roman lead water pipes", "ancient roman lead water pipes"), eyebrow: "Tecnología perdida", title: "No solo los rodamientos", points: ["Bombeo de agua a presión", "Cañerías de plomo selladas", "Carpintería que tardó siglos en volver"], accent: "amber" });
seek(1269.09);
clip(6.6, "knowledge_lost_dark", ["ancient knowledge fading dark", "burning library concept smoke"], "ancient knowledge evaporating", { hue: "cold", darken: 0.16 });
seek(1275.7);
clip(10.8, "rome_falling_ruins", ["fall of rome ruins decay", "roman empire collapse illustration"], "the fall of rome", { hue: "amber", darken: 0.12 });
seek(1289.6);
clip(4.5, "nemi_ships_museum_1930s", ["nemi ships museum vintage photo 1930s", "huge recovered roman ships hall"], "the nemi ships in their museum", { hue: "amber" });
seek(1294.09);
clip(5.6, "submerged_2000_years", ["ancient ship preserved in mud", "wreck buried two thousand years"], "the ships, submerged for 2000 years", { hue: "cold" });
seek(1299.7);
C(15.0, { kind: "thennow", before: { src: "real/nemi_ship_recovered.jpg", label: "1929 · Recuperados" }, after: { src: spImg("nemi_ships_burned_1944", "nemi ship museum fire ruins 1944 burned", "the burned ruins of the nemi ships after the 1944 fire"), label: "1944 · Cenizas" }, accent: "danger" });
seek(1315.7);
clip(6.4, "fire_at_night_dramatic", ["building fire at night flames dramatic", "museum burning flames"], "a dramatic fire at night", { hue: "red", darken: 0.1 });
seek(1322.07);
clip(8.1, "old_photos_blueprints", ["old photographs and blueprints archive", "vintage technical drawings plans"], "old photos and blueprints, all that remains", { hue: "amber" });
seek(1330.14);
C(8.5, { kind: "quote", image: spImg("roman_ruins_dusk", "roman ruins at dusk dramatic", "roman ruins at dusk"), text: "¿Cuánto conocimiento se perdió cuando *cayó* el mundo antiguo?", accent: "danger", hue: "amber", fontSize: 76 });
seek(1338.62);
clip(8.9, "invention_forgotten_loop", ["gears turning then stopping concept", "wheel of progress abstract"], "invention, forgotten, reinvented", { hue: "cold" });
seek(1347.6);
clip(3.5, "caligula_ship_whisper", ["ancient roman ship silhouette moody", "roman barge dark water"], "the silhouette of caligula's ship", { hue: "amber", darken: 0.14 });
C(9.6, { kind: "headline", tokens: tk(["El", "progreso", "en", "línea", "recta", "es", "una", ["mentira", "danger"]]), bg: "image", image: "real/roman_ruins_dusk.jpg", hue: "amber", size: 82 });

// ╔═══════════════ #2 — EL MECANISMO DE ANTIKYTHERA (~22:40 – 27:25) ═══════════════╗
seek(1360.68);
clip(5.0, "deep_sea_mystery2", ["deep blue sea light rays descending", "ocean depths sunbeams"], "the deep sea, full of mystery", { hue: "blue" });
C(2.6, { kind: "rule", number: "02", title: "El Mecanismo de Antikythera", label: "Mar Egeo · 1901", hue: "blue" });
seek(1371.52);
clip(2.0, "vintage_year_1901", ["vintage sea photo early 1900s", "old black and white ocean"], "the year 1901", { hue: "amber" });
clip(4.5, "greek_sponge_divers", ["traditional greek sponge divers vintage", "old hardhat diver sea"], "greek sponge divers", { hue: "amber" });
seek(1380.1);
clip(4.3, "storm_rocky_island", ["storm near rocky greek island", "rough sea rocky islet"], "a storm by a rocky island", { hue: "cold", darken: 0.14 });
clip(4.3, "antikythera_island", ["small rocky aegean island", "tiny greek island sea"], "the small island of antikythera", { hue: "blue" });
seek(1388.7);
clip(5.5, "diver_descending_aegean", ["diver descending clear aegean sea", "diver sinking blue mediterranean"], "a diver descending into the aegean", { hue: "cold" });
seek(1394.17);
clip(4.0, "diver_shock_underwater", ["scared diver underwater pointing", "diver alarmed deep"], "a diver shocked by what he sees", { hue: "cold", darken: 0.12 });
seek(1401.15);
clip(3.9, "statues_on_seabed", ["bronze statues lying on seabed", "ancient sculptures underwater wreck"], "statues scattered on the seabed", { hue: "cold", darken: 0.12 });
seek(1407.7);
clip(4.9, "roman_wreck_statues", ["roman shipwreck full of statues underwater", "ancient wreck bronze marble"], "a roman wreck full of statues", { hue: "cold" });
seek(1412.58);
clip(8.1, "bronze_statue_seabed", ["corroded bronze statue underwater eerie", "ancient statue on sea floor"], "a corroded bronze statue underwater", { hue: "cold", darken: 0.12 });
seek(1420.7);
clip(2.8, "underwater_treasure_haul", ["ancient artifacts recovered from sea", "treasure haul shipwreck"], "the immense archaeological treasure", { hue: "amber" });
seek(1423.54);
C(9.8, { kind: "focuscard", bg: spClip("museum_storage_artifacts", ["museum storage shelves artifacts crates", "archive of ancient artifacts boxes"], "museum storage full of artifacts", 10), image: "real/antikythera_fragment.jpg", eyebrow: "Ignorado por meses", title: "Un bulto sin valor", desc: "Corroído, verdoso, del tamaño de un libro. Parecía una simple piedra cubierta de mar.", accent: "amber" });
seek(1433.39);
clip(4.3, "corroded_green_lump", ["corroded green bronze lump artifact", "encrusted metal object sea"], "a corroded green lump", { hue: "amber" });
seek(1441.7);
clip(5.6, "stone_like_artifact", ["rock like encrusted artifact close", "sea incrusted object"], "what looked like a worthless stone", { hue: "amber" });
seek(1447.39);
C(8.3, { kind: "termcard", bg: spClip("museum_dark_display", ["dark museum artifact spotlight", "ancient object in display case dark"], "an ancient object under a museum spotlight", 9), image: "real/antikythera_fragment.jpg", term: "Mecanismo de Antikythera", definition: "Hoy, el objeto más enigmático de toda la antigüedad. Cuando se partió, reveló su interior.", accent: "cyan" });
seek(1455.7);
clip(4.0, "fragment_splitting", ["corroded artifact cracked open detail", "broken bronze fragment interior"], "the fragment, cracked open", { hue: "amber" });
seek(1464.88);
C(4.8, { kind: "impact", image: "real/antikythera_gears.jpg", impact: "Engranajes", setup: "Dentro había…", impactAccent: "accent" });
seek(1471.14);
C(7.0, { kind: "loupe", image: "real/antikythera_gears.jpg", focusX: 0.5, focusY: 0.5, zoom: 2.8, label: "Decenas de engranajes, precisión de reloj suizo", accent: "cyan" });
clip(3.5, "bronze_gears_macro", ["bronze clockwork gears macro", "interlocking metal gears close"], "interlocking bronze gears", { hue: "amber" });
seek(1481.7);
clip(4.4, "researchers_puzzled", ["scientists puzzled studying artifact", "researchers examining mystery object"], "researchers puzzled for decades", { hue: "blue" });
seek(1486.09);
C(10.1, { kind: "focuscard", bg: spClip("ct_scan_machine", ["ct scan x-ray machine lab", "industrial x-ray scanner"], "a CT and x-ray lab", 11), image: spImg("antikythera_xray_scan", "antikythera mechanism x-ray ct scan internal gears", "an x-ray scan revealing the internal gears of the antikythera mechanism"), eyebrow: "Tomografía y rayos X", title: "Reconstruir su función", desc: "Los escáneres revelaron lo que el bronce escondía dentro del bloque corroído.", accent: "cyan", imageSide: "right" });
seek(1500.1);
clip(4.6, "scientists_stunned", ["scientists stunned discovery faces", "researchers amazed result"], "scientists stunned by the result", { hue: "blue" });
seek(1504.7);
C(6.4, { kind: "impact", image: spImg("antikythera_recon_model", "antikythera mechanism reconstruction model brass", "a brass reconstruction of the antikythera mechanism"), impact: "Una computadora", setup: "Y la respuesta…", impactAccent: "danger" });
seek(1511.02);
clip(7.7, "orrery_planets", ["mechanical orrery planets turning", "solar system model brass gears"], "a mechanical model of the planets", { hue: "amber" });
seek(1518.69);
clip(3.4, "moon_planets_sky", ["moon and planets night sky", "celestial bodies dark sky"], "the moon and planets in the sky", { hue: "blue" });
seek(1522.1);
clip(5.0, "solar_eclipse2", ["solar eclipse sun corona", "total eclipse dramatic"], "a solar eclipse predicted years ahead", { hue: "cold" });
seek(1527.7);
clip(8.4, "moon_phases_calendar", ["moon phases time lapse", "lunar calendar cycle"], "the phases of the moon and the calendar", { hue: "blue" });
seek(1536.11);
C(11.0, { kind: "splitexplain", bg: spClip("brass_gears_turning", ["brass gears turning mechanism close", "clockwork mechanism spinning"], "a brass mechanism turning", 12), image: "real/antikythera_gears.jpg", eyebrow: "Lo que calculaba", title: "Más de 30 engranajes en armonía", points: ["Posición del Sol, la Luna y los planetas", "La fecha exacta de los eclipses", "Hasta el año de los Juegos Olímpicos"], accent: "cyan" });
seek(1547.67);
clip(6.8, "historians_awake_night", ["historian awake at night thinking", "scholar studying late dark"], "the detail that keeps historians awake", { hue: "amber", darken: 0.12 });
seek(1554.44);
clip(6.5, "cathedral_astro_clock", ["medieval astronomical cathedral clock", "old astronomical clock gears europe"], "a medieval astronomical cathedral clock", { hue: "amber" });
seek(1567.7);
C(9.0, { kind: "timeline", eyebrow: "1.400 años de silencio", title: "De la nada… y sin herederos", events: [{ year: "~70 a.C.", label: "Antikythera" }, { year: "Siglo XIV", label: "Relojes de catedral" }] });
seek(1579.75);
clip(7.7, "lost_knowledge_void", ["single light in vast darkness concept", "isolated object in void dark"], "a lone marvel, with no past or future", { hue: "cold", darken: 0.16 });
seek(1587.44);
clip(6.2, "antikythera_alone_dark", ["antikythera mechanism alone spotlight dark", "lone artifact in darkness"], "the mechanism, alone in the dark", { hue: "cold", darken: 0.14 });
seek(1593.7);
C(7.4, { kind: "quote", image: "real/antikythera_fragment.jpg", text: "¿Quién la diseñó? ¿Con qué *herramientas*?", accent: "danger", hue: "cold", fontSize: 84 });
seek(1601.1);
clip(7.6, "wreck_swallowed_dark", ["shipwreck swallowed by dark sea", "wreck sinking into abyss"], "what else sank with that ship", { hue: "cold", darken: 0.18 });
seek(1608.7);
clip(4.9, "empty_archive_no_names", ["empty archive no records dusty", "blank ledger old archive"], "no names, no records", { hue: "cold", darken: 0.14 });
seek(1613.37);
clip(5.1, "no_blueprints", ["blank old technical paper", "empty parchment desk"], "no blueprints, no school of masters", { hue: "amber" });
seek(1618.5);
C(7.5, { kind: "quote", image: "real/antikythera_fragment.jpg", text: "Sabían *muchísimo más* de lo que imaginamos.", accent: "accent", hue: "cold", fontSize: 88 });
seek(1630.7);
clip(6.2, "gears_to_ocean", ["bronze gears dissolving into ocean", "mechanism over deep sea"], "a single machine that rewrites history", { hue: "cold" });
seek(1636.91);
clip(5.8, "descend_to_finale", ["descending into deep blue ocean suspense", "sinking toward the unknown deep"], "descending toward the final mystery", { hue: "cold", darken: 0.14 });
seek(1642.7);
C(5.7, { kind: "headline", tokens: tk(["¿Quién", "llegó", ["primero?", "hl"]]), bg: "image", image: "real/shipwreck_dramatic.jpg", hue: "amber", size: 100 });

// ╔═══════════════ #1 — LAS ÁNFORAS DE GUANABARA (~27:28 – 32:01) ═══════════════╗
seek(1648.35);
clip(1.9, "guanabara_bay_aerial2", ["guanabara bay rio de janeiro aerial", "rio coastline aerial bay"], "guanabara bay in rio", { hue: "blue" });
C(2.6, { kind: "rule", number: "01", title: "Las Ánforas de Guanabara", label: "Río de Janeiro, Brasil", hue: "red" });
seek(1650.21);
clip(6.0, "rio_de_janeiro_coast", ["rio de janeiro coast bay boats", "brazil coastline fishing"], "the coast of rio de janeiro", { hue: "blue" });
clip(5.9, "fishermen_pulling_nets", ["fishermen pulling nets old jars", "fishing nets catching pottery"], "fishermen pulling up old jars", { hue: "amber" });
seek(1662.1);
clip(5.6, "barnacle_pottery", ["pottery covered in barnacles sediment", "encrusted ceramic jar sea"], "pottery covered in barnacles", { hue: "amber" });
seek(1667.7);
clip(8.4, "jars_as_decoration", ["old amphora as rustic decoration bar", "ceramic jar ornament shelf"], "the jars used as rustic decoration", { hue: "amber" });
seek(1679.7);
clip(6.0, "underwater_investigator", ["underwater archaeologist examining artifact", "diver inspecting pottery closely"], "an investigator examining the jars", { hue: "cold" });
clip(5.4, "amphora_recognized", ["close look ancient amphora shape", "examining ceramic vessel hands"], "recognizing the shape at once", { hue: "amber" });
seek(1691.16);
C(4.9, { kind: "impact", image: spImg("roman_amphora_museum", "roman amphora museum wine vessel", "a roman amphora in a museum"), impact: "Ánforas romanas", setup: "No eran cacharros…", impactAccent: "danger" });
seek(1698.1);
clip(6.1, "roman_amphorae_rows", ["rows of roman amphorae storage", "roman wine amphorae warehouse"], "rows of roman amphorae", { hue: "amber" });
seek(1704.28);
clip(4.4, "mediterranean_trade_ship", ["roman merchant ship mediterranean", "ancient trade vessel sea"], "a roman merchant ship in the mediterranean", { hue: "amber" });
seek(1708.68);
clip(5.9, "amphorae_underwater2", ["roman amphorae on the seabed underwater", "amphora field shipwreck"], "amphorae on the seabed", { hue: "cold" });
seek(1714.54);
clip(6.5, "portuguese_caravel_1500", ["portuguese caravel ship 1500 painting", "age of discovery ship brazil"], "a portuguese caravel of 1500", { hue: "amber" });
C(6.5, { kind: "stat", value: 1500, suffix: "", prefix: "año ", label: "los portugueses 'descubren' Brasil", eyebrow: "La historia oficial", accent: "accent", hue: "amber" });
seek(1727.7);
clip(8.0, "atlantic_storm_ship", ["old ship crossing stormy atlantic", "tall ship rough atlantic ocean"], "a ship crossing the stormy atlantic", { hue: "cold", darken: 0.12 });
seek(1735.67);
C(11.0, { kind: "expeditionmap", mapImage: spImg("atlantic_map", "antique map atlantic ocean europe south america", "an antique map of the atlantic between europe and south america"), eyebrow: "La hipótesis explosiva", title: "Roma → Brasil, 1.500 años antes", route: [{ x: 0.6, y: 0.34 }, { x: 0.45, y: 0.45 }, { x: 0.3, y: 0.58 }, { x: 0.24, y: 0.62 }], pins: [{ x: 0.6, y: 0.34, label: "Roma" }, { x: 0.24, y: 0.62, label: "Guanabara" }], accent: "red" });
seek(1746.7);
C(5.5, { kind: "stat", value: 1500, suffix: " años", prefix: "+", label: "antes de Colón y los portugueses", eyebrow: "Un océano cruzado", accent: "danger", hue: "red" });
seek(1752.2);
clip(5.9, "before_columbus_dark", ["ancient ship vast atlantic dusk", "lone ship endless ocean"], "before columbus, before all of it", { hue: "cold", darken: 0.14 });
seek(1758.11);
clip(4.6, "amphorae_cluster_seabed", ["cluster of amphorae shipwreck pattern seabed", "scattered amphorae wreck site"], "a cluster of amphorae in a wreck pattern", { hue: "cold" });
seek(1762.69);
clip(7.0, "wreck_pattern_sonar", ["sonar seabed survey wreck pattern", "underwater survey mapping wreck"], "the pattern of a destroyed hull", { hue: "blue" });
seek(1769.7);
clip(6.2, "diver_documenting_evidence", ["diver photographing artifacts evidence", "underwater documentation survey"], "divers documenting the evidence", { hue: "cold" });
seek(1775.91);
C(8.3, { kind: "evidenceboard", title: "Las pruebas se acumulaban", accent: "red", items: [
  { src: spImg("guanabara_bay_evi", "guanabara bay aerial rio", "guanabara bay from above"), label: "La bahía" },
  { src: "real/roman_amphora_museum.jpg", label: "Ánforas romanas" },
  { src: spImg("seabed_sonar_map", "sonar map seabed survey wreck", "a sonar map of the seabed"), label: "Patrón de naufragio" },
  { src: spImg("underwater_photos_evidence", "underwater archaeology photos documentation", "underwater documentation photos"), label: "Fotografías" },
] });
seek(1784.2);
clip(5.4, "everything_stopped", ["hand stop gesture dark dramatic", "red stop barrier ominous"], "and then, everything stopped", { hue: "red", darken: 0.16 });
seek(1789.7);
C(8.0, { kind: "aged", heading: "INVESTIGACIÓN CLAUSURADA", lines: dl(["Acceso al sitio prohibido", ["Buzo apartado de la zona", "mark"], "Naufragio cubierto por sedimento"]), eyebrow: "De un día para el otro", accent: "danger", hue: "red" });
seek(1800.09);
clip(7.0, "sediment_covering_site", ["sediment silt covering seabed site", "mud burying underwater site"], "sediment covering the site", { hue: "cold", darken: 0.16 });
seek(1809.7);
clip(4.9, "official_sealing_file", ["official stamping sealing document", "hand closing confidential file"], "an official sealing the file", { hue: "red" });
seek(1814.61);
C(12.0, { kind: "splitexplain", bg: spClip("brazil_national_archive", ["official government archive brazil", "national history books shelf"], "an official national archive", 13), image: spImg("portuguese_landing_art", "portuguese landing brazil 1500 painting cabral", "a painting of the portuguese landing in brazil 1500"), eyebrow: "El motivo del silencio", title: "Políticamente incómodo", points: ["Admitir romanos rompía el relato nacional", "El que celebra a los portugueses como descubridores"], accent: "red" });
seek(1836.7);
clip(3.4, "controversy_debate", ["heated academic debate concept", "controversy discussion abstract"], "a case wrapped in controversy", { hue: "amber" });
seek(1840.1);
clip(5.5, "modern_amphora_doubt", ["amphora replica modern pottery", "ceramic vessel workshop"], "some say the jars were modern", { hue: "amber" });
seek(1845.6);
clip(5.1, "amphora_question", ["single amphora dramatic spotlight", "ancient jar in shadow"], "fallen from a more recent ship?", { hue: "cold", darken: 0.12 });
seek(1850.7);
C(6.4, { kind: "quote", image: "real/roman_amphora_museum.jpg", text: "Otros insisten: eran auténticas, y fueron *silenciadas*.", accent: "danger", hue: "red", fontSize: 76 });
seek(1857.1);
clip(6.0, "amphorae_locked_storage", ["amphorae locked in dark storage room", "artifacts hidden in archive crates"], "the amphorae, locked away", { hue: "cold", darken: 0.16 });
seek(1863.28);
clip(3.8, "certainty_dark", ["dark empty room single light", "stark minimal dark scene"], "the only thing we know for certain", { hue: "cold", darken: 0.18 });
seek(1867.1);
clip(3.6, "site_never_excavated", ["abandoned underwater site dark", "untouched seabed dark"], "the site, never fully excavated", { hue: "cold", darken: 0.16 });
seek(1870.67);
C(7.0, { kind: "quote", image: spImg("amphorae_storage_shelf", "ancient amphorae stored archive shelf", "ancient amphorae on a storage shelf"), text: "Guardadas. Lejos de los laboratorios que dirían la *verdad*.", accent: "danger", hue: "cold", fontSize: 74 });
seek(1882.11);
clip(6.6, "deep_wound_sea", ["deep dark ocean somber slow", "melancholy deep sea"], "the deepest wound of this story", { hue: "cold", darken: 0.18 });
seek(1888.7);
clip(10.3, "impossible_ships_montage", ["montage ancient shipwrecks underwater", "various wrecks dramatic deep"], "not just that the sea hides impossible ships", { hue: "cold", darken: 0.12 });
seek(1898.96);
clip(8.1, "ship_threatens_truth", ["ancient wreck ominous dark depths", "wreck in shadow threatening"], "when a ship threatens what we believe", { hue: "cold", darken: 0.16 });
seek(1907.1);
C(10.6, { kind: "quote", image: spImg("buried_in_mud", "shipwreck buried in dark mud silt", "a shipwreck left to sleep in the mud"), text: "Alguien decide que es mejor dejarlo *dormir en el barro*.", accent: "danger", hue: "cold", fontSize: 76 });
seek(1917.7);
C(4.0, { kind: "quote", image: "real/dark_ocean.jpg", text: "¿El silencio cómodo… o la verdad *incómoda*?", accent: "danger", hue: "cold", fontSize: 80 });

// ╔═══════════════ CIERRE + CTA (~32:01 – 34:06) ═══════════════╗
seek(1921.6);
C(4.0, { kind: "headline", tokens: tk([["Siete", "hl"], "barcos.", "Siete", ["pruebas.", "hl"]]), bg: "image", image: "real/shipwreck_dramatic.jpg", hue: "amber", size: 96 });
seek(1925.6);
clip(6.0, "recap_montage_wrecks", ["epic shipwrecks montage underwater god rays", "ancient ships deep sea dramatic"], "seven proofs our ancestors knew more", { hue: "cold", darken: 0.1 });
seek(1938.7);
clip(5.3, "recap_black_sea_ship", ["intact ancient greek shipwreck underwater", "preserved wreck deep dark"], "a greek ship intact after 2400 years", { hue: "cold" });
seek(1944.0);
clip(4.1, "recap_antikythera", ["antikythera mechanism bronze gears", "ancient bronze clockwork"], "a bronze computer that shouldn't exist", { hue: "amber" });
seek(1948.1);
clip(6.0, "recap_nemi_bearing", ["ancient roman ball bearing mechanism", "roman engineering artifact"], "roman bearings, 1500 years early", { hue: "amber" });
seek(1954.14);
clip(6.6, "recap_guanabara", ["roman amphorae underwater brazil bay", "amphorae seabed mystery"], "a wreck in brazil buried, not explained", { hue: "cold", darken: 0.12 });
seek(1960.7);
C(7.7, { kind: "stat", value: 70, suffix: "%", prefix: "+", label: "del planeta es océano — apenas explorado", eyebrow: "Lo que falta encontrar", accent: "accent", hue: "cold" });
seek(1969.11);
clip(6.6, "earth_oceans_space", ["earth oceans from space blue", "planet ocean view space"], "we know the moon better than our seas", { hue: "blue" });
seek(1975.67);
clip(5.9, "abyss_unexplored", ["unexplored deep ocean darkness", "vast black abyss deep"], "imagine what still sleeps down there", { hue: "cold", darken: 0.2 });
seek(1981.6);
C(5.0, { kind: "headline", tokens: tk(["No", "los", "rompe.", "Los", "hace", ["pedazos.", "danger"]]), bg: "image", image: "real/dark_ocean.jpg", hue: "red", size: 92 });
seek(1993.8);
clip(6.0, "kindred_viewer", ["lone diver descending deep blue contemplative", "solitary figure deep sea"], "if you made it here, you're one of us", { hue: "cold" });
seek(2000.5);
clip(8.0, "questions_over_answers", ["mysterious deep sea slow contemplative", "dark ocean philosophical"], "those who prefer hard questions", { hue: "cold", darken: 0.14 });
seek(2012.0);
C(9.0, { kind: "nextvideo", title: "Ciudades enteras bajo el mar", kicker: "Próximo viaje", sub: "Que, según los libros, jamás deberían existir" });
seek(2024.0);
clip(8.0, "sunken_city_teaser", ["underwater ruins sunken city columns", "submerged ancient city ruins"], "entire cities found beneath the sea", { hue: "cold", darken: 0.12 });
seek(2034.0);
C(12.0, { kind: "headline", tokens: tk([["Crónicas", "hl"], "Perdidas"]), bg: "image", image: "real/shipwreck_dramatic.jpg", hue: "amber", size: 104 });

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
// — #6 Keops —
ov(416.33, 223, { kind: "countrail", rank: 6, total: 7, name: "Keops", accent: "amber" });
ov(421.0, 5, { kind: "datestamp", value: "1954", label: "AÑO", accent: "cyan", corner: "tr" });
ov(422.6, 6, { kind: "placetag", place: "Giza, Egipto", sub: "Base sur de la Gran Pirámide", accent: "amber" });
ov(437.61, 5, { kind: "datestamp", value: "4.500 años", label: "SELLADO", accent: "amber", corner: "tr" });
ov(466.7, 6, { kind: "doclabel", label: "Barca solar de Keops", sub: "~2500 a.C. · cedro del Líbano", accent: "amber" });
ov(478.7, 6, { kind: "sourcechip", text: "Museo de la Barca Solar · Giza", accent: "cyan" });
// — #5 Mar Negro —
ov(639.6, 225, { kind: "countrail", rank: 5, total: 7, name: "Mar Negro", accent: "cyan" });
ov(648.2, 6, { kind: "placetag", place: "Mar Negro", sub: "a +2.000 m de profundidad", accent: "cyan" });
ov(686.7, 5, { kind: "datestamp", value: "2018", label: "AÑO", accent: "cyan", corner: "tr" });
ov(720.7, 6, { kind: "doclabel", label: "Barco griego intacto", sub: "~400 a.C. · el más antiguo del mundo", accent: "cyan" });
ov(848.56, 7, { kind: "sourcechip", text: "Black Sea MAP · 2018", accent: "cyan" });
// — #4 Kublai —
ov(865.11, 230, { kind: "countrail", rank: 4, total: 7, name: "Kublai Khan", accent: "red" });
ov(889.7, 6, { kind: "datestamp", value: "1281", label: "AÑO", accent: "red", corner: "tr" });
ov(914.53, 6, { kind: "placetag", place: "Costas de Japón", sub: "Isla de Takashima", accent: "cyan" });
ov(986.7, 6, { kind: "doclabel", label: "Flota mongola hundida", sub: "~4.400 barcos · 1281", accent: "red" });
ov(995.7, 7, { kind: "sourcechip", text: "Restos frente a Takashima, Japón", accent: "cyan" });
// — #3 Nemi / Calígula —
ov(1095.25, 265, { kind: "countrail", rank: 3, total: 7, name: "Nemi · Calígula", accent: "amber" });
ov(1139.7, 6, { kind: "datestamp", value: "Años 1930", label: "DRENADO", accent: "amber", corner: "tr" });
ov(1173.11, 6, { kind: "placetag", place: "Lago Nemi, Italia", sub: "Naves de Calígula · Siglo I", accent: "amber" });
ov(1227.7, 6, { kind: "doclabel", label: "Cojinete de bolas romano", sub: "1.500 años antes de Da Vinci", accent: "cyan" });
ov(1306.75, 6, { kind: "datestamp", value: "1944", label: "INCENDIO", accent: "red", corner: "tr" });
ov(1322.07, 7, { kind: "sourcechip", text: "Museo de las Naves Romanas · Nemi", accent: "amber" });
// — #2 Antikythera —
ov(1360.68, 288, { kind: "countrail", rank: 2, total: 7, name: "Antikythera", accent: "cyan" });
ov(1371.52, 5, { kind: "datestamp", value: "1901", label: "AÑO", accent: "cyan", corner: "tr" });
ov(1380.1, 6, { kind: "placetag", place: "Isla de Antikythera", sub: "Mar Egeo, Grecia", accent: "cyan" });
ov(1464.88, 6, { kind: "doclabel", label: "Engranajes de bronce", sub: "precisión de relojería · ~70 a.C.", accent: "cyan" });
ov(1504.7, 6, { kind: "datestamp", value: "~70 a.C.", label: "ANTIGÜEDAD", accent: "cyan", corner: "tr" });
ov(1536.11, 7, { kind: "sourcechip", text: "Mecanismo de Antikythera · Museo Nacional, Atenas", accent: "cyan" });
// — #1 Guanabara —
ov(1648.35, 269, { kind: "countrail", rank: 1, total: 7, name: "Guanabara", accent: "red" });
ov(1650.21, 6, { kind: "placetag", place: "Bahía de Guanabara", sub: "Río de Janeiro, Brasil", accent: "red" });
ov(1691.16, 6, { kind: "doclabel", label: "Ánfora romana", sub: "vino y aceite · hace ~2.000 años", accent: "amber" });
ov(1789.7, 6, { kind: "datestamp", value: "CLASIFICADO", label: "EL SITIO", accent: "red", corner: "tr" });
ov(1857.1, 7, { kind: "sourcechip", text: "Bahía de Guanabara · caso en controversia", accent: "red" });

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
