// gen_ciudades.mjs — video 3 Crónicas Perdidas (mismo flujo que construcciones/leona/huron).
// 1 clip REAL por idea, anclado al ms EXACTO del timing de gen_tts (MI texto, no whisper).
// Lee public/ciudades_timing.json → emite public/broll/match_ciudades.json + src/VideoEdit/ciudades_cues.json.
//   node gen_ciudades.mjs  →  matchclip farm  →  node build_ciudades.mjs
import fs from "fs";

// frase → toma. name(único, prefijo de sección) · first(primeras palabras p/ anclar al timing) · concept(qué se ve) · query(búsqueda YT)
const PH = [
  // ── COLD OPEN ──
  { name: "intro_ciudades", first: "hay ciudades enteras", concept: "aerial of a coastal city slowly disappearing under the sea, dramatic", query: ["sunken city aerial ocean", "underwater city ruins drone"] },
  { name: "intro_mercados", first: "un dia estaban llenas", concept: "a bustling ancient port city full of people and markets, illustration", query: ["ancient port city busy illustration", "ancient harbor city people"] },
  { name: "intro_hundieron", first: "algunas se hundieron en", concept: "a city being swallowed by the sea in minutes, catastrophe", query: ["city swallowed by sea", "tsunami flooding city dramatic"] },
  { name: "intro_bajando", first: "otras se fueron bajando", concept: "slowly rising sea level covering ruins, time lapse feel", query: ["rising sea covering ruins", "flooded ancient ruins water"] },
  { name: "intro_fondo", first: "y hay algunas las", concept: "mysterious stone structures on the dark ocean floor, eerie", query: ["mysterious structures ocean floor", "underwater ruins dark deep"] },
  { name: "intro_leyendas", first: "durante siglos las llamamos", concept: "old sea legend, antique map and storm, mythical atmosphere", query: ["old nautical legend map", "ancient sea myth illustration"] },
  { name: "intro_buzos", first: "y entonces los buzos", concept: "scuba divers descending into deep blue water", query: ["scuba divers descending deep", "divers going down ocean"] },
  { name: "intro_calles_lodo", first: "empezaron a encontrar calles", concept: "diver discovering submerged ancient streets and columns in silt", query: ["diver underwater ancient ruins", "submerged columns diver explore"] },
  { name: "intro_pregunta", first: "y de pronto la pregunta", concept: "diver examining a carved stone underwater, sense of discovery", query: ["diver examining underwater statue", "underwater archaeology discovery"] },
  { name: "intro_como_posible", first: "era como es posible", concept: "underwater ancient wall that should not exist, dramatic blue", query: ["impossible underwater wall ruins", "underwater megalith structure"] },
  { name: "intro_bajar", first: "hoy vamos a bajar", concept: "sweeping descent into deep ocean, light fading from surface", query: ["descending into deep ocean", "sinking into dark sea light"] },
  { name: "intro_siete", first: "vamos a recorrer siete", concept: "montage feel of underwater ruins around the world", query: ["underwater ruins montage world", "sunken cities compilation"] },
  { name: "intro_planeta", first: "siete lugares repartidos", concept: "spinning globe with ocean and coastlines, satellite earth", query: ["globe ocean satellite spinning", "earth from space oceans"] },
  { name: "intro_guia", first: "soy tu guia en", concept: "atmospheric deep underwater scene with light rays, mysterious", query: ["underwater light rays atmospheric", "deep blue ocean god rays"] },
  { name: "intro_final_teaser", first: "quedate hasta el final", concept: "a single colossal stone structure on the seabed in darkness", query: ["colossal structure seabed dark", "huge underwater monument deep"] },
  { name: "intro_estructura", first: "es una estructura que aparecio", concept: "sonar scan revealing geometric shapes on the ocean floor", query: ["sonar scan ocean floor structures", "seabed sonar mapping shapes"] },
  { name: "intro_respira", first: "respira hondo empecemos", concept: "calm ocean surface from below, light shimmering, breath", query: ["ocean surface from below light", "calm sea underwater surface"] },

  // ── PRÓLOGO: el mar 12.000 años atrás ──
  { name: "intro_nivel_mar", first: "antes de hundirnos", concept: "diagram-like coastline showing sea level, blue ocean horizon", query: ["coastline sea level horizon", "ocean coast wide aerial"] },
  { name: "intro_no_siempre", first: "el nivel del mar", concept: "waves on a shore, sense of changing tides over time", query: ["waves shore tide", "coast waves time lapse"] },
  { name: "intro_edad_hielo", first: "hace doce mil anos", concept: "ice age glaciers and frozen continents, vast ice sheets", query: ["ice age glaciers frozen", "vast ice sheet glacier"] },
  { name: "intro_cien_metros", first: "el mar estaba mucho", concept: "exposed seabed and lower shoreline, dry coastal plain", query: ["exposed seabed dry shore", "low tide vast mudflat"] },
  { name: "intro_regiones", first: "eso significa que regiones", concept: "map of ancient land now underwater, submerged continental shelf", query: ["submerged land map ancient", "continental shelf underwater map"] },
  { name: "intro_llanuras", first: "llanuras valles costas", concept: "prehistoric people living on a coastal plain, hunting fishing", query: ["prehistoric people coast hunting", "stone age coastal life illustration"] },
  { name: "intro_derritio", first: "cuando el hielo se", concept: "glaciers melting, ice calving into rising water", query: ["glacier melting calving water", "ice melting into sea"] },
  { name: "intro_oleadas", first: "a veces segun algunos", concept: "catastrophic flood wave surging over land, megaflood", query: ["catastrophic flood wave surge", "megaflood ocean rising fast"] },
  { name: "intro_atrapado", first: "y todo lo que estaba", concept: "ruins being submerged as water rises over them", query: ["ruins submerged rising water", "flooded ruins underwater"] },
  { name: "intro_nerviosos", first: "la pregunta que pone", concept: "archaeologist looking at a map, worried, thinking", query: ["archaeologist studying map", "researcher thinking map ruins"] },
  { name: "intro_que_construyo", first: "que construyo la humanidad", concept: "vast empty seabed hiding unknown ruins, mystery", query: ["empty seabed mystery dark", "unexplored ocean floor"] },
  { name: "intro_empecemos", first: "empecemos por una ciudad", concept: "clear turquoise shallow bay seen from above, inviting", query: ["clear turquoise bay aerial", "shallow tropical bay drone"] },

  // ── 7 · PAVLOPETRI (Grecia) ──
  { name: "pv_intro", first: "numero siete frente", concept: "clear shallow bay on the southern coast of Greece, turquoise water", query: ["greece clear shallow bay coast", "greek coastline turquoise aerial"] },
  { name: "pv_profundidad", first: "a apenas tres o", concept: "diver in very shallow clear water over sandy seabed", query: ["diver shallow clear water sand", "snorkeler shallow seabed clear"] },
  { name: "pv_nombre", first: "se llama pavlopetri", concept: "Pavlopetri underwater city layout on the seabed, Greece", query: ["Pavlopetri underwater city", "Pavlopetri submerged ruins greece"] },
  { name: "pv_no_piedras", first: "no es un monton", concept: "submerged ancient stone foundations forming a grid on the sand", query: ["underwater stone foundations grid", "submerged building outlines seabed"] },
  { name: "pv_trazado", first: "es una ciudad de verdad", concept: "aerial of a city street grid layout, urban plan", query: ["ancient city street grid aerial", "city plan layout from above"] },
  { name: "pv_calles", first: "se pueden ver las calles", concept: "diver swimming over submerged streets and house foundations", query: ["diver over underwater ruins streets", "submerged foundations diver"] },
  { name: "pv_plano", first: "es como mirar el plano", concept: "ancient city map drawn on sand, archaeological plan", query: ["ancient city map plan", "archaeological site plan drawing"] },
  { name: "pv_edad", first: "lo asombroso de pavlopetri", concept: "ancient bronze age ruins, sense of deep antiquity", query: ["bronze age ruins ancient", "ancient greek bronze age site"] },
  { name: "pv_cinco_mil", first: "estuvo habitada hace unos", concept: "bronze age pottery and artifacts, ancient daily life", query: ["bronze age pottery artifacts", "ancient greek pottery museum"] },
  { name: "pv_mas_antigua", first: "durante mucho tiempo se considero", concept: "Pavlopetri aerial of submerged city outlines in clear water", query: ["Pavlopetri aerial submerged", "underwater city outline clear water aerial"] },
  { name: "pv_antes_piramides", first: "caminaba gente por esas", concept: "Egyptian pyramids being compared with much older site, timeline", query: ["egypt pyramids ancient wide", "pyramids giza timeline"] },
  { name: "pv_terremotos", first: "y un dia probablemente", concept: "earthquake cracking the ground near the sea, land slipping", query: ["earthquake ground cracking", "coastal earthquake land collapse"] },
  { name: "pv_humilde", first: "la gente que vivia alli", concept: "humble ancient house ruins, intimate everyday spaces", query: ["humble ancient house ruins", "ancient home foundations stone"] },
  { name: "pv_casa", first: "dejo su casa su calle", concept: "diver tracing the outline of a submerged ancient doorway", query: ["diver underwater doorway ruins", "submerged ancient house diver"] },
  { name: "pv_guardo", first: "y el mar lo guardo", concept: "well preserved underwater ruins covered in fine sand, timeless", query: ["preserved underwater ruins sand", "ancient seabed ruins intact"] },
  { name: "pv_ensena", first: "pavlopetri nos ensena", concept: "wide shot of an entire submerged city on the seabed", query: ["entire submerged city seabed", "underwater city wide view"] },
  { name: "pv_intactas", first: "las ciudades enteras pueden", concept: "intact submerged structures glowing in clear blue water", query: ["intact underwater structures blue", "submerged ruins clear blue"] },
  { name: "pv_que_esconde", first: "que mas se esconde", concept: "descent into darker deeper water, sense of the unknown below", query: ["descending into darker water", "deep dark ocean descent"] },

  // ── 6 · PORT ROYAL (Jamaica) ──
  { name: "pr_intro", first: "numero seis saltamos", concept: "17th century Caribbean port town, tall ships, colonial", query: ["17th century caribbean port", "colonial caribbean harbor ships"] },
  { name: "pr_jamaica", first: "en la isla de jamaica", concept: "aerial of Jamaica coast and Kingston harbour, tropical", query: ["jamaica coast aerial", "kingston harbour jamaica aerial"] },
  { name: "pr_nombre", first: "se llamaba port royal", concept: "old engraving of Port Royal town, colonial port city", query: ["Port Royal jamaica engraving", "old colonial port town illustration"] },
  { name: "pr_puerto", first: "era un puerto enorme", concept: "pirates, gold, taverns in a rowdy colonial port, illustration", query: ["pirate port town taverns", "colonial port pirates gold illustration"] },
  { name: "pr_malvada", first: "muchos la llamaban sin", concept: "decadent pirate town at night, sin and excess, dramatic", query: ["pirate town night decadent", "colonial port night drunken"] },
  { name: "pr_fecha", first: "y entonces el siete", concept: "ominous sky over a colonial port, calm before disaster", query: ["ominous sky over harbor", "dark clouds over old port"] },
  { name: "pr_rugio", first: "la tierra rugio", concept: "earthquake shaking, ground rupturing violently", query: ["earthquake ground rupture", "violent earthquake shaking ground"] },
  { name: "pr_terremoto", first: "un terremoto brutal", concept: "buildings collapsing in an earthquake, dust and chaos", query: ["buildings collapsing earthquake", "earthquake destroying town"] },
  { name: "pr_arena", first: "el suelo sobre el que", concept: "waterlogged sandy ground, unstable wet soil by the sea", query: ["wet sandy ground sea", "waterlogged soil shore"] },
  { name: "pr_liquido", first: "con la sacudida esa arena", concept: "soil liquefaction, ground turning to liquid sand", query: ["soil liquefaction sand", "liquefaction earthquake ground"] },
  { name: "pr_olas", first: "las calles se volvieron", concept: "ground rippling like waves during a quake, surreal", query: ["ground rippling earthquake", "shaking street earthquake"] },
  { name: "pr_edificios", first: "edificios enteros con la gente", concept: "buildings sinking into the ground, swallowed by earth", query: ["buildings sinking into ground", "sinkhole swallowing buildings"] },
  { name: "pr_minutos", first: "en cuestion de minutos", concept: "a town disappearing under water rapidly, catastrophe aerial", query: ["town flooding rapidly aerial", "city sinking under sea"] },
  { name: "pr_murieron", first: "miles de personas murieron", concept: "stormy chaotic sea over a drowned town, dramatic dark", query: ["stormy sea dark dramatic", "rough sea drowning chaos"] },
  { name: "pr_atrapados", first: "algunos quedaron atrapados", concept: "hardened sand trapping objects, buried in solidified ground", query: ["objects buried in sand hardened", "trapped in solidified sand"] },
  { name: "pr_kingston", first: "hoy bajo las aguas", concept: "divers over the submerged ruins of Port Royal, murky water", query: ["Port Royal underwater ruins", "submerged colonial ruins divers"] },
  { name: "pr_relojes", first: "relojes parados a la hora", concept: "an old pocket watch stopped, frozen moment in time", query: ["old pocket watch stopped", "antique watch frozen time"] },
  { name: "pr_botellas", first: "botellas todavia cerradas", concept: "old sealed bottles recovered from underwater, encrusted", query: ["old bottles underwater shipwreck", "antique sealed bottle seabed"] },
  { name: "pr_capsula", first: "port royal es una capsula", concept: "submerged colonial town frozen in time, ghostly ruins", query: ["submerged town ruins ghostly", "underwater colonial ruins eerie"] },
  { name: "pr_suspiro", first: "a veces se las traga", concept: "the sea closing over a place in an instant, dark waves", query: ["dark waves closing over", "sea swallowing land waves"] },

  // ── 5 · BAIAE (Italia) ──
  { name: "ba_intro", first: "numero cinco volvemos", concept: "Bay of Naples coast, Italy, blue Mediterranean", query: ["bay of naples coast italy", "mediterranean coast naples aerial"] },
  { name: "ba_lujo", first: "existio un lugar que era", concept: "luxurious ancient Roman seaside villas, opulent resort", query: ["ancient roman seaside villa", "roman luxury villa coast illustration"] },
  { name: "ba_nombre", first: "se llamaba baiae", concept: "Baiae Roman ruins on the coast of Italy", query: ["Baiae roman ruins italy", "Baiae archaeological site"] },
  { name: "ba_vegas", first: "era una especie de las", concept: "opulent Roman party and feast, decadent luxury illustration", query: ["roman feast party decadent", "ancient roman banquet luxury"] },
  { name: "ba_poderosos", first: "los hombres mas poderosos", concept: "Roman emperors and senators, busts of powerful Romans", query: ["roman emperor bust statue", "roman senators powerful men"] },
  { name: "ba_villas", first: "tenian alli sus villas", concept: "Roman villa with thermal baths and mosaics by the sea", query: ["roman thermal baths mosaic", "roman villa seaside mosaic"] },
  { name: "ba_pecar", first: "era el lugar donde el poder", concept: "decadent Roman pleasure scene, wine and luxury, dim light", query: ["roman wine pleasure decadent", "ancient roman luxury night"] },
  { name: "ba_problema", first: "pero baiae tenia un problema", concept: "volcanic landscape near Naples, steaming ground", query: ["volcanic steaming ground naples", "fumarole volcanic field italy"] },
  { name: "ba_volcanica", first: "estaba construida sobre una", concept: "Campi Flegrei volcanic caldera, active volcanic zone", query: ["Campi Flegrei volcanic caldera", "volcanic crater field italy"] },
  { name: "ba_magma", first: "bajo el suelo el terreno", concept: "cross-section of magma moving under the ground, geology", query: ["magma underground cross section", "volcanic magma chamber diagram"] },
  { name: "ba_bradisismo", first: "un fenomeno que los cientificos", concept: "ground slowly rising and sinking, land deformation", query: ["ground deformation land sinking", "land subsidence coast slow"] },
  { name: "ba_descendiendo", first: "ese suelo cargado de", concept: "Roman buildings slowly slipping into the sea over centuries", query: ["roman ruins sinking sea", "buildings sinking into water"] },
  { name: "ba_hoy_agua", first: "hoy gran parte de aquella", concept: "underwater Roman ruins of Baiae in shallow water", query: ["Baiae underwater roman ruins", "submerged roman city baiae"] },
  { name: "ba_buzos", first: "los buzos nadan por encima", concept: "divers swimming over submerged Roman streets and columns", query: ["divers over roman ruins underwater", "diver submerged roman columns"] },
  { name: "ba_estatuas", first: "se detienen frente a estatuas", concept: "underwater Roman statue covered in algae, facing forward", query: ["underwater roman statue algae", "submerged statue seabed ancient"] },
  { name: "ba_mosaicos", first: "hay mosaicos completos", concept: "intact Roman mosaic floor underwater, colorful tiles", query: ["roman mosaic underwater floor", "submerged roman mosaic baiae"] },
  { name: "ba_verdad", first: "baiae nos muestra una", concept: "submerged Roman ruins glowing in clear blue water", query: ["submerged roman ruins blue", "underwater roman city wide"] },
  { name: "ba_cesar", first: "el agua no distingue", concept: "a fallen Roman column underwater beside humble stones", query: ["fallen roman column underwater", "roman ruins underwater dramatic"] },

  // ── 4 · DWARKA (India) ──
  { name: "dw_intro", first: "numero cuatro cruzamos", concept: "coast of Gujarat India, Arabian Sea, warm light", query: ["gujarat india coast sea", "arabian sea coast india aerial"] },
  { name: "dw_textos", first: "en los textos sagrados", concept: "ancient Indian sacred manuscript, Sanskrit texts, illuminated", query: ["ancient sanskrit manuscript", "indian sacred text old"] },
  { name: "dw_nombre", first: "se llamaba dwarka", concept: "golden mythical city of Krishna, divine ancient Indian city", query: ["mythical golden city india illustration", "ancient indian city krishna art"] },
  { name: "dw_urbe", first: "segun los relatos era una", concept: "magnificent ancient walled city with palaces, illustration", query: ["ancient walled city palaces illustration", "grand ancient indian city art"] },
  { name: "dw_tragada", first: "un dia tras la muerte", concept: "a great city swallowed by the ocean in one day, dramatic", query: ["city swallowed by ocean art", "ancient city flooded dramatic"] },
  { name: "dw_mitologia", first: "durante siglos los estudiosos", concept: "scholars dismissing a myth, old books and skepticism", query: ["old books scholars study", "ancient legend dismissed manuscript"] },
  { name: "dw_buceo", first: "hasta que los arqueologos", concept: "marine archaeologists diving off the Indian coast", query: ["marine archaeology divers india", "underwater archaeology survey divers"] },
  { name: "dw_encontraron", first: "y encontraron algo", concept: "diver finding a stone structure on a murky seabed", query: ["diver finding underwater structure", "discovery underwater stone diver"] },
  { name: "dw_estructuras", first: "bajo el agua aparecieron", concept: "submerged stone walls and dressed blocks underwater India", query: ["submerged stone walls underwater", "underwater dressed stone blocks ruins"] },
  { name: "dw_datacion", first: "la datacion de algunos", concept: "archaeologists dating ancient stone samples, lab", query: ["archaeology dating samples lab", "radiocarbon dating ancient stone"] },
  { name: "dw_borrosa", first: "de pronto la frontera", concept: "blurred line between myth and reality, ancient text over ruins", query: ["myth meets reality ancient", "legend and ruins overlay"] },
  { name: "dw_pregunta", first: "es dwarka exactamente", concept: "modern Dwarka temple by the sea, sacred Indian site", query: ["Dwarka temple sea india", "dwarkadhish temple coast"] },
  { name: "dw_algo_hubo", first: "pero algo hubo alli", concept: "submerged ancient blocks waiting on the seabed, India", query: ["submerged ancient blocks seabed", "underwater ruins waiting ocean floor"] },
  { name: "dw_leyendas", first: "cuantas otras leyendas", concept: "many ancient legends and ruins, sense of hidden truth", query: ["ancient legends ruins montage", "lost legends ancient sites"] },

  // ── 3 · THONIS-HERACLEION (Egipto) ──
  { name: "he_intro", first: "numero tres y si hablamos", concept: "ancient Egyptian coast at the Nile delta, Mediterranean", query: ["nile delta coast egypt", "egypt mediterranean coast aerial"] },
  { name: "he_griegos", first: "durante mas de mil anos", concept: "ancient Greek and Egyptian traders, legendary rich city art", query: ["ancient greek egyptian traders", "ancient rich port city illustration"] },
  { name: "he_nilo", first: "situada en la desembocadura", concept: "the mouth of the Nile meeting the sea, aerial delta", query: ["nile river mouth sea aerial", "river delta meeting ocean"] },
  { name: "he_templos", first: "una ciudad de templos", concept: "grand ancient Egyptian temple port with ships and treasure", query: ["ancient egyptian temple port", "egyptian harbor temple illustration"] },
  { name: "he_nombres", first: "algunos textos la llamaban", concept: "ancient inscriptions naming a lost city, hieroglyphs and greek", query: ["ancient hieroglyphs inscription stone", "egyptian inscription text close"] },
  { name: "he_desaparecio", first: "y luego sin mas desaparecio", concept: "a city vanishing from old maps, fading legend", query: ["old map fading city", "lost city vanished map"] },
  { name: "he_sombra", first: "pasaron los siglos y la", concept: "a forgotten ruin sinking into legend, time passing", query: ["forgotten ruins time", "ancient ruins fading mist"] },
  { name: "he_dudaban", first: "muchos dudaban de que", concept: "scholars skeptical of an ancient text, old documents", query: ["scholars skeptical old text", "historians debating manuscript"] },
  { name: "he_dos_mil", first: "hasta que en el ano dos mil", concept: "underwater archaeologists surveying Abukir bay Egypt", query: ["underwater archaeology egypt abukir", "marine survey divers egypt"] },
  { name: "he_perdida", first: "y alli enterrada bajo", concept: "Heracleion submerged ruins emerging from the silt", query: ["Heracleion underwater ruins egypt", "Thonis Heracleion submerged"] },
  { name: "he_entera", first: "no unos pocos restos", concept: "an entire submerged ancient city on the seabed, vast", query: ["entire submerged city seabed vast", "underwater ancient city wide egypt"] },
  { name: "he_estatuas", first: "estatuas colosales de varios", concept: "colossal Egyptian statue lying on the seabed, divers for scale", query: ["colossal egyptian statue underwater", "giant statue seabed divers heracleion"] },
  { name: "he_templos_hundidos", first: "templos hundidos", concept: "submerged Egyptian temple ruins underwater", query: ["submerged egyptian temple underwater", "underwater temple ruins egypt"] },
  { name: "he_barcos", first: "decenas de barcos antiguos", concept: "ancient shipwrecks resting on the seabed, many wrecks", query: ["ancient shipwrecks seabed many", "underwater ancient ships wrecks"] },
  { name: "he_tesoros", first: "inscripciones monedas joyas", concept: "ancient gold coins jewelry and artifacts recovered from sea", query: ["ancient gold coins jewelry underwater", "recovered artifacts gold seabed"] },
  { name: "he_alejandria", first: "que habia sido el principal", concept: "ancient Egyptian harbor before Alexandria, busy port art", query: ["ancient egyptian harbor port", "alexandria ancient harbor illustration"] },
  { name: "he_direccion", first: "cuando los textos antiguos", concept: "an ancient text pointing to a location, map and ruins", query: ["ancient text map location", "old manuscript pointing place"] },
  { name: "he_quizas", first: "quizas solo nos estan", concept: "submerged statue face emerging from the silt, haunting", query: ["underwater statue face silt", "submerged face statue haunting"] },

  // ── 2 · YONAGUNI (Japón) ──
  { name: "yo_intro", first: "numero dos y aqui", concept: "turbulent dark blue sea, mysterious and unsettling", query: ["dark turbulent sea mysterious", "deep blue ocean ominous"] },
  { name: "yo_japon", first: "nos vamos al sur de japon", concept: "Yonaguni island Japan coast, rocky shoreline", query: ["Yonaguni island japan coast", "japan remote island rocky coast"] },
  { name: "yo_buzo", first: "en mil novecientos ochenta", concept: "a diver in 1980s style exploring near a Japanese island, sharks", query: ["diver exploring japan reef", "diver near sharks ocean japan"] },
  { name: "yo_encontro", first: "se encontro a unos veinticinco", concept: "diver discovering a massive stone formation underwater", query: ["diver discovering underwater structure", "underwater stone formation diver"] },
  { name: "yo_estructura", first: "una enorme estructura de piedra", concept: "the Yonaguni Monument rising from the seabed, terraced rock", query: ["Yonaguni monument underwater", "Yonaguni rock formation diver"] },
  { name: "yo_terrazas", first: "tenia terrazas escalones", concept: "underwater stone terraces, steps and right angles, Yonaguni", query: ["Yonaguni terraces steps underwater", "underwater stone steps right angles"] },
  { name: "yo_geometria", first: "una mole gigantesca de roca", concept: "huge geometric underwater rock with sharp straight edges", query: ["geometric underwater rock edges", "Yonaguni straight edges stone"] },
  { name: "yo_monumento", first: "el llamado monumento de yonaguni", concept: "wide view of the Yonaguni Monument, diver for scale", query: ["Yonaguni monument wide diver", "Yonaguni underwater pyramid"] },
  { name: "yo_artificial", first: "por un lado los que defienden", concept: "diver pointing at carved-looking features of Yonaguni", query: ["diver examining Yonaguni features", "underwater carved rock diver"] },
  { name: "yo_tierra_seca", first: "si esa estructura fue construida", concept: "land that was once dry now underwater, ancient shoreline", query: ["ancient submerged shoreline", "land now underwater ancient"] },
  { name: "yo_diez_mil", first: "y eso nos lleva a una fecha", concept: "deep time concept, prehistoric era, ancient calendar", query: ["deep time prehistoric era", "ancient timeline ten thousand years"] },
  { name: "yo_oficial", first: "una epoca en la que segun", concept: "prehistoric people who supposedly could not build in stone", query: ["prehistoric stone age people", "stone age hunters illustration"] },
  { name: "yo_natural", first: "por el otro lado muchos", concept: "geologist examining natural rock fractures, sandstone", query: ["geologist examining rock fractures", "natural sandstone fracture layers"] },
  { name: "yo_fractura", first: "que ese tipo de roca", concept: "natural rock that fractures into straight blocks, layered stone", query: ["rock fracturing straight blocks", "natural layered sandstone cliff"] },
  { name: "yo_templo_o", first: "templo perdido de una", concept: "the Yonaguni Monument, ambiguous temple or natural, dramatic", query: ["Yonaguni monument dramatic", "mysterious underwater structure japan"] },
  { name: "yo_silencio", first: "y mientras los expertos", concept: "the silent underwater monument with perfect angles, eerie", query: ["silent underwater monument eerie", "Yonaguni angles underwater"] },
  { name: "yo_no_sabemos", first: "no sabemos con certeza", concept: "diver staring at the enigmatic Yonaguni structure, awe", query: ["diver staring at structure awe", "diver Yonaguni contemplating"] },

  // ── 1 · CUBA (clímax) ──
  { name: "cu_intro", first: "y llegamos al numero uno", concept: "deep dark ocean, descent into the abyss, dramatic", query: ["deep dark ocean abyss", "descending into deep sea dark"] },
  { name: "cu_no_encaja", first: "a la ciudad que no encaja", concept: "geometric shapes on a deep dark seabed, impossible structure", query: ["geometric shapes deep seabed", "impossible structure ocean floor"] },
  { name: "cu_caribe", first: "nos vamos al mar caribe", concept: "Caribbean sea off western Cuba, deep blue water aerial", query: ["caribbean sea cuba aerial", "cuba coast deep blue ocean"] },
  { name: "cu_sonar", first: "en el ano dos mil uno", concept: "research vessel scanning the seabed with sonar at sea", query: ["research vessel sonar survey", "ship scanning seabed sonar ocean"] },
  { name: "cu_galeones", first: "buscando restos de naufragios", concept: "sunken Spanish galleon and gold treasure on the seabed", query: ["sunken galleon treasure gold", "shipwreck spanish galleon underwater"] },
  { name: "cu_pantallas", first: "detecto algo en sus pantallas", concept: "sonar screen showing strange geometric shapes, control room", query: ["sonar screen shapes display", "ship control room sonar screen"] },
  { name: "cu_profundidad", first: "a una profundidad enorme", concept: "extreme deep ocean darkness, hundreds of meters down", query: ["extreme deep ocean dark", "deep sea abyss darkness"] },
  { name: "cu_formas", first: "el sonar dibujo un conjunto", concept: "3D sonar reconstruction of geometric structures on seabed", query: ["3d sonar reconstruction seabed", "sonar map geometric structures"] },
  { name: "cu_eran_estructuras", first: "eran estructuras", concept: "blocky geometric structures on the deep ocean floor, dark", query: ["blocky structures ocean floor", "geometric blocks deep seabed"] },
  { name: "cu_bloques", first: "bloques enormes y simetricos", concept: "huge symmetric stone blocks arranged in order, megalithic", query: ["huge symmetric stone blocks", "megalithic blocks ordered arrangement"] },
  { name: "cu_piramides", first: "algunos descritos como formas", concept: "pyramid-like shapes on the dark ocean floor, underwater", query: ["underwater pyramid shapes dark", "pyramid structure ocean floor"] },
  { name: "cu_complejo", first: "una especie de complejo", concept: "a complex of structures in total darkness on the seabed", query: ["structure complex dark seabed", "underwater complex deep dark"] },
  { name: "cu_problema", first: "y aqui esta el problema", concept: "depth gauge showing extreme depth, pressure of the deep", query: ["depth gauge extreme deep", "deep sea pressure gauge"] },
  { name: "cu_tierra_seca", first: "esas formas se encuentran", concept: "diagram of impossible depth vs ancient sea level, geology", query: ["sea level depth diagram", "ocean depth geology cross section"] },
  { name: "cu_mucho_bajo", first: "el mar tendria que haber", concept: "ancient low sea level exposing deep seabed, prehistoric coast", query: ["ancient low sea level seabed", "prehistoric exposed deep coast"] },
  { name: "cu_antiguedad", first: "estariamos hablando de una", concept: "deep geological time, layers of rock and age, vastness", query: ["geological time layers rock", "deep time geology strata"] },
  { name: "cu_dos_posibilidades", first: "las posibilidades son apenas", concept: "two diverging paths, a fork of explanations, conceptual", query: ["two diverging paths concept", "fork in road conceptual dark"] },
  { name: "cu_naturaleza", first: "o bien la naturaleza creo", concept: "natural rock formations that look man-made, geology", query: ["natural rock looks man made", "geometric natural rock formation"] },
  { name: "cu_manos_humanas", first: "o bien estamos ante los restos", concept: "ancient builders moving giant stones in a remote past", query: ["ancient builders moving stones", "ancient megalith construction illustration"] },
  { name: "cu_atlantida", first: "inevitablemente hubo quien", concept: "the lost city of Atlantis sinking, mythical underwater city", query: ["Atlantis lost city sinking", "mythical sunken city atlantis art"] },
  { name: "cu_platon", first: "la ciudad perdida de la que", concept: "ancient Greek philosopher Plato, classical bust and scrolls", query: ["plato philosopher bust", "ancient greek philosopher scrolls"] },
  { name: "cu_no_digo", first: "no estoy diciendo que esto", concept: "the dark mysterious seabed structure, unexplained", query: ["mysterious seabed structure dark", "unexplained underwater structure"] },
  { name: "cu_sin_explicar", first: "que en el fondo del oceano", concept: "the deep dark structures off Cuba still unexplained, eerie", query: ["deep dark underwater structures eerie", "unexplored deep seabed structures"] },
  { name: "cu_veinte_anos", first: "y que llevamos mas de veinte", concept: "research project abandoned, deep too costly to explore", query: ["deep sea expensive expedition", "abandoned deep sea research"] },
  { name: "cu_esperando", first: "asi que ahi sigue", concept: "the structures waiting in total darkness on the seabed", query: ["structures waiting dark seabed", "deep dark ruins waiting"] },
  { name: "cu_nada", first: "una posible ciudad en un lugar", concept: "wide eerie shot of geometric structures in the abyss", query: ["eerie geometric structures abyss", "underwater city abyss dark wide"] },

  // ── CIERRE ──
  { name: "cl_ventanas", first: "hemos bajado por siete", concept: "montage of the seven sunken sites, descent recap", query: ["sunken cities montage recap", "underwater ruins compilation"] },
  { name: "cl_pavlopetri", first: "hemos visto una ciudad de cinco", concept: "Pavlopetri submerged city streets, clear shallow water", query: ["Pavlopetri submerged city", "underwater city streets clear"] },
  { name: "cl_port_royal", first: "una metropolis tragada en minutos", concept: "Port Royal earthquake town sinking into sand", query: ["town sinking sand earthquake", "Port Royal sinking"] },
  { name: "cl_baiae", first: "el palacio de un emperador", concept: "Baiae Roman ruins underwater, statue as reef", query: ["Baiae roman ruins underwater", "submerged roman statue reef"] },
  { name: "cl_dwarka", first: "una leyenda hindu que", concept: "Dwarka submerged blocks, myth made real underwater", query: ["Dwarka submerged ruins", "underwater stone blocks india"] },
  { name: "cl_heracleion", first: "una ciudad mitica de egipto", concept: "Heracleion colossal statue rising from seabed", query: ["Heracleion statue underwater", "egyptian statue seabed"] },
  { name: "cl_yonaguni", first: "una estructura japonesa cuyos", concept: "Yonaguni monument angles underwater, ambiguous", query: ["Yonaguni monument angles", "Yonaguni underwater structure"] },
  { name: "cl_cuba", first: "y en lo mas hondo", concept: "the deep dark Cuba structures, the great enigma", query: ["deep dark seabed structure enigma", "mysterious deep ocean structure"] },
  { name: "cl_doce_mil", first: "si hace doce mil anos", concept: "ancient lower sea level revealing vast lost coastlines", query: ["ancient lower sea level coast", "lost coastline prehistoric"] },
  { name: "cl_museos", first: "entonces la mayor parte", concept: "empty museum halls vs the vast unexplored seabed", query: ["empty museum hall", "vast unexplored seabed dark"] },
  { name: "cl_bajo_agua", first: "estan bajo el agua sin", concept: "endless dark seabed hiding unexplored ruins, silence", query: ["endless dark seabed", "unexplored ocean floor silence"] },
  { name: "cl_tierra_seca", first: "la historia que conocemos", concept: "the line between dry land history and the hidden underwater", query: ["coastline land meets sea", "shore line land water boundary"] },
  { name: "cl_durmiendo", first: "la otra parte quizas", concept: "ancient ruins sleeping on the dark ocean floor, waiting", query: ["ancient ruins ocean floor sleeping", "submerged ruins dark waiting"] },
  { name: "cl_canal", first: "si llegaste hasta aqui", concept: "dramatic deep ocean scene, contemplative descent", query: ["dramatic deep ocean scene", "contemplative underwater descent"] },
  { name: "cl_hielo", first: "porque si el mar guarda", concept: "transition from dark ocean to vast frozen ice, foreshadow", query: ["transition ocean to ice", "frozen sea ice vast"] },
  { name: "cl_teaser_antartida", first: "en el proximo viaje", concept: "vast Antarctic ice sheet, frozen continent aerial", query: ["antarctica ice sheet aerial", "frozen continent vast ice"] },
  { name: "cl_estructuras_hielo", first: "a esas estructuras y formas", concept: "mysterious shapes under thick ice, ice cave structures", query: ["shapes under ice mysterious", "ice cave structure deep frozen"] },
  { name: "cl_suscribete", first: "suscribete a cronicas perdidas", concept: "epic underwater ruins at deep blue, contemplative wide", query: ["epic underwater ruins blue wide", "underwater ruins cinematic deep"] },
  { name: "cl_curiosidad", first: "cuidate manten la curiosidad", concept: "calm hopeful deep ocean light, curiosity and wonder", query: ["deep ocean light hopeful", "underwater light wonder calm"] },
  { name: "cl_respuestas", first: "a veces las respuestas mas", concept: "closed ancient books versus the open mysterious sea", query: ["old closed books library", "mysterious open sea horizon"] },
  { name: "cl_final", first: "estan esperando en silencio", concept: "final haunting shot of ruins resting on the silent seabed", query: ["ruins resting silent seabed", "underwater ruins final haunting"] },
];

// ★ ANCLAJE EXACTO desde el TIMING de gen_tts (MI texto, no whisper) → ancla casi todo.
const TM = JSON.parse(fs.readFileSync("public/ciudades_timing.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
// texto normalizado continuo + char→tiempo (interpolado DENTRO de cada chunk por fracción de char)
let full = ""; const pos2t = [];
for (let i = 0; i < TM.length; i++) {
  const seg = norm(TM[i].text) + " "; if (seg.length <= 1) continue;
  const t0 = TM[i].start;
  const t1 = i + 1 < TM.length ? TM[i + 1].start : t0 + seg.length / 14;
  for (let k = 0; k < seg.length; k++) pos2t.push(t0 + (t1 - t0) * (k / seg.length));
  full += seg;
}
const END = TM.length ? TM[TM.length - 1].start + norm(TM[TM.length - 1].text).length / 14 + 2 : 0;
const findMs = (first, afterChar) => { const q = norm(first); const idx = full.indexOf(q, afterChar); return idx < 0 ? null : { t: +pos2t[idx].toFixed(2), char: idx + q.length }; };

// cursor secuencial sobre MI texto exacto → matchea casi todo
let afterChar = 0, found = 0;
const anchors = PH.map((p) => { const r = findMs(p.first, afterChar); if (r) { afterChar = r.char; found++; return r.t; } return null; });
for (let i = 0; i < anchors.length; i++) if (anchors[i] == null) {
  const prev = [...anchors.slice(0, i)].reverse().find((x) => x != null) ?? 0;
  let ni = i + 1; while (ni < anchors.length && anchors[ni] == null) ni++;
  const next = anchors[ni] ?? END;
  anchors[i] = +(prev + (next - prev) / (ni - i + 1)).toFixed(2);
}

const cues = [], match = [];
for (let i = 0; i < PH.length; i++) {
  const start = +anchors[i].toFixed(2);
  const end = i + 1 < PH.length ? +anchors[i + 1].toFixed(2) : +END.toFixed(2);
  const dur = +Math.max(1.5, end - start).toFixed(2);
  cues.push({ name: PH[i].name, start, dur });
  match.push({ name: PH[i].name, query: PH[i].query, concept: PH[i].concept, dur: Math.max(4, Math.ceil(dur) + 1) });
}
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync("public/broll/match_ciudades.json", JSON.stringify(match, null, 1));
fs.writeFileSync("src/VideoEdit/ciudades_cues.json", JSON.stringify(cues, null, 1));
console.log(`frases: ${PH.length} · ancladas exactas: ${found}/${PH.length} · dur total ~${END.toFixed(0)}s (${(END / 60).toFixed(1)} min)`);
console.log("→ match_ciudades.json + ciudades_cues.json");
