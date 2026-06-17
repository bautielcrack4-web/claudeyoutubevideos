// gen_construcciones.mjs — video 2 Crónicas Perdidas (mismo flujo que leona/huron).
// 1 clip REAL por idea, anclado al ms exacto de la narración. Lee captions_construcciones.json
// → emite public/broll/match_construcciones.json + src/VideoEdit/construcciones_cues.json.
import fs from "fs";

// frase → toma. name(único) · first(primeras palabras p/ anclar) · concept(qué se ve) · query(búsqueda YT)
const PH = [
  // ── COLD OPEN ──
  { name: "piedras_imposibles", first: "hay piedras sobre", concept: "massive ancient megalithic stone blocks, dramatic, monumental", query: ["giant ancient megalithic stones", "massive stone blocks ruins"] },
  { name: "bloque_edificio", first: "bloques del tamano", concept: "a colossal cut stone block the size of a building, ancient quarry", query: ["giant quarried stone block ancient", "huge megalith block"] },
  { name: "muro_encaja", first: "muros que encajan", concept: "ancient polygonal stone wall with perfectly fitted blocks, no mortar", query: ["polygonal masonry wall perfect fit", "inca stone wall tight joints"] },
  { name: "templo_enterrado", first: "templos enterrados", concept: "ancient buried temple ruins being excavated from the earth", query: ["buried ancient temple excavation", "archaeological dig stone temple"] },
  { name: "mil_toneladas_q", first: "como movieron una", concept: "a colossal multi-ton stone block, tiny people for scale", query: ["massive stone block people scale", "thousand ton megalith"] },
  { name: "cobre_blando", first: "como cortaron granito", concept: "ancient copper chisel tools next to hard granite stone", query: ["ancient copper tools stone", "bronze age chisel granite"] },
  { name: "patron_mundo", first: "y por que en", concept: "a world map highlighting ancient megalithic sites on different continents", query: ["world map ancient sites", "megalithic sites map continents"] },
  { name: "linea_historia", first: "durante demasiado tiempo", concept: "a timeline illustration of human history, cave man to modern", query: ["human evolution timeline", "history of civilization illustration"] },
  { name: "piedra_no_miente", first: "pero la piedra", concept: "extreme close up of ancient carved stone surface, tool marks", query: ["ancient carved stone close up", "stone tool marks surface"] },
  { name: "siete_construcciones", first: "hoy vamos a recorrer", concept: "sweeping aerial of ancient stone ruins at golden hour", query: ["aerial ancient ruins drone", "megalithic site aerial"] },
  { name: "sospecha", first: "siete lugares repartidos", concept: "mysterious ancient ruins in fog, eerie", query: ["mysterious ancient ruins fog", "eerie stone ruins atmosphere"] },
  { name: "guia_intro", first: "soy tu guia", concept: "dramatic dark ancient temple interior with light beams", query: ["ancient temple interior light beams", "dark stone temple atmospheric"] },

  // ── 7 · GÖBEKLI TEPE ──
  { name: "gt_intro", first: "numero siete gobekli", concept: "Göbekli Tepe ancient T-shaped stone pillars in Turkey", query: ["Gobekli Tepe pillars", "Gobekli Tepe site Turkey"] },
  { name: "gt_linea_vieja", first: "durante casi un siglo", concept: "ancient humans farming primitive agriculture illustration", query: ["neolithic farming illustration", "early agriculture ancient"] },
  { name: "gt_pan_religion", first: "primero el pan", concept: "primitive hunter gatherers around a fire at dusk", query: ["hunter gatherers fire prehistoric", "stone age people campfire"] },
  { name: "gt_rompe", first: "gobekli tepe agarro", concept: "Göbekli Tepe stone circles excavation aerial", query: ["Gobekli Tepe excavation aerial", "Gobekli Tepe stone circles"] },
  { name: "gt_colina", first: "en una colina", concept: "archaeological excavation on a dusty hill in Turkey", query: ["archaeology dig hill turkey", "excavation dusty hillside"] },
  { name: "gt_pilares", first: "enormes pilares de", concept: "the massive T-shaped carved limestone pillars of Göbekli Tepe", query: ["Gobekli Tepe T pillars carved", "T shaped stone pillar megalith"] },
  { name: "gt_animales", first: "y no eran piedras", concept: "ancient stone carvings of animals, foxes snakes vultures relief", query: ["ancient stone animal carvings relief", "Gobekli Tepe animal carvings"] },
  { name: "gt_once_mil", first: "gobekli tepe tiene", concept: "ancient prehistoric stone monument, sense of deep age", query: ["ancient prehistoric stone monument", "oldest temple ruins"] },
  { name: "gt_mas_antiguo", first: "es mas antiguo", concept: "the pyramids of Giza compared with much older ruins, time", query: ["pyramids giza ancient", "ancient egypt pyramids desert"] },
  { name: "gt_cazadores", first: "segun la propia ciencia", concept: "prehistoric hunter gatherers hunting with spears illustration", query: ["prehistoric hunters spears", "stone age hunting illustration"] },
  { name: "gt_organizo", first: "y sin embargo esa", concept: "large group of ancient people building a megalithic structure", query: ["ancient people building megalith", "many workers moving stone ancient"] },
  { name: "gt_da_vuelta", first: "para muchos investigadores", concept: "archaeologists studying Göbekli Tepe pillars", query: ["archaeologists studying ruins", "researchers ancient site"] },
  { name: "gt_enterraron", first: "en cierto momento", concept: "ancient site being buried under earth and rubble, soil filling", query: ["site buried under soil", "earth burying ruins"] },
  { name: "gt_porque", first: "por que alguien construiria", concept: "Göbekli Tepe pillar half buried in earth, mysterious", query: ["Gobekli Tepe buried pillar", "half buried megalith earth"] },
  { name: "gt_sin_respuesta", first: "no hay respuesta solo", concept: "lone ancient stone pillar at dusk, mysterious silhouette", query: ["ancient pillar dusk silhouette", "lone megalith twilight"] },

  // ── 6 · SACSAYHUAMÁN ──
  { name: "sx_intro", first: "numero seis sacsayhuaman", concept: "Sacsayhuaman massive zigzag stone walls in Peru", query: ["Sacsayhuaman walls peru", "Sacsayhuaman zigzag stone"] },
  { name: "sx_fortaleza", first: "a mas de tres", concept: "aerial view of Sacsayhuaman fortress above Cusco", query: ["Sacsayhuaman aerial fortress", "Cusco ancient walls aerial"] },
  { name: "sx_bloques", first: "los muros de sacsayhuaman", concept: "colossal fitted stone blocks of Sacsayhuaman, person for scale", query: ["Sacsayhuaman giant blocks person", "huge inca stones person scale"] },
  { name: "sx_calzan", first: "las piedras simplemente", concept: "close up of perfectly fitted polygonal inca stones, no gaps", query: ["inca polygonal stones perfect fit", "tight stone joints inca wall"] },
  { name: "sx_rompecabezas", first: "y no calzan como", concept: "irregular many-sided stone blocks interlocking like a puzzle", query: ["interlocking polygonal stones", "many angled inca stone"] },
  { name: "sx_papel", first: "la prueba clasica", concept: "hand testing a knife blade in a tight ancient stone joint", query: ["knife test stone joint inca", "hand on ancient wall joint"] },
  { name: "sx_terremoto", first: "despues de mas de", concept: "ancient inca walls standing intact, earthquake resistant", query: ["inca walls standing intact", "earthquake proof stone wall"] },
  { name: "sx_paciencia", first: "la explicacion oficial dice", concept: "stone being shaped by hand with a hammerstone", query: ["shaping stone hammerstone hand", "ancient stone working by hand"] },
  { name: "sx_cien_ton", first: "hablamos de bloques de", concept: "moving a massive stone block with ropes and many men, ancient", query: ["moving giant stone ropes men", "ancient transport megalith ramp"] },
  { name: "sx_sin_rueda", first: "todo esto sin gruas", concept: "andes mountains steep terrain with ancient stone ruins", query: ["andes mountains ruins steep", "peru highlands ancient site"] },
  { name: "sx_vinieron_antes", first: "los propios incas cuando", concept: "ancient cyclopean stone wall, sense of unknown builders", query: ["cyclopean stone wall ancient", "mysterious megalithic wall"] },

  // ── 5 · BAALBEK ──
  { name: "bk_intro", first: "numero cinco baalbek", concept: "Baalbek roman temple of Jupiter giant columns Lebanon", query: ["Baalbek temple columns lebanon", "Baalbek roman ruins"] },
  { name: "bk_columnas", first: "en este lugar hay", concept: "towering ancient roman columns of Baalbek against sky", query: ["Baalbek giant columns sky", "huge roman columns ruins"] },
  { name: "bk_debajo", first: "pero el verdadero misterio", concept: "the massive foundation stones beneath Baalbek temple", query: ["Baalbek foundation megalith stones", "Baalbek trilithon base"] },
  { name: "bk_trilithon", first: "se las conoce como", concept: "the Trilithon of Baalbek, three enormous stone blocks in a wall", query: ["Baalbek trilithon three stones", "Baalbek megalith wall"] },
  { name: "bk_avion", first: "para que te hagas", concept: "comparison of a giant stone block to the size of an airplane", query: ["giant stone block size comparison", "megalith scale comparison"] },
  { name: "bk_embarazada", first: "pero la pieza que", concept: "the Stone of the Pregnant Woman, huge block lying in quarry Baalbek", query: ["stone of pregnant woman Baalbek", "Baalbek quarry giant block"] },
  { name: "bk_mas_grande", first: "y todavia hay mas", concept: "the largest ancient cut stone block in a quarry, people on top", query: ["largest ancient stone block quarry", "biggest megalith people on top"] },
  { name: "bk_grua_hoy", first: "hoy en pleno siglo", concept: "the largest modern crane lifting an enormous load", query: ["largest crane heavy lift", "giant crane lifting load"] },
  { name: "bk_pregunta", first: "la pregunta entonces es", concept: "ancient quarry with a partially cut colossal stone", query: ["ancient quarry cut stone", "unfinished megalith quarry"] },
  { name: "bk_silencio", first: "baalbek sigue ahi en", concept: "Baalbek megalithic foundation stones at sunset, silent", query: ["Baalbek ruins sunset", "megalithic foundation dusk"] },

  // ── 4 · LONGYOU ──
  { name: "lg_intro", first: "numero cuatro las cuevas", concept: "the Longyou Caves, massive man-made cavern in China", query: ["Longyou caves china", "Longyou grottoes cavern"] },
  { name: "lg_campesinos", first: "en el ano mil", concept: "a still pond in a rural chinese village", query: ["rural pond china village", "still green pond countryside"] },
  { name: "lg_bombearon", first: "pusieron bombas y", concept: "water being pumped out, draining a pond", query: ["pumping water out pond", "draining water pump"] },
  { name: "lg_caverna", first: "cuando el agua finalmente", concept: "the giant interior of a Longyou man-made cave", query: ["Longyou cave interior giant", "huge man made cavern"] },
  { name: "lg_veinte", first: "y no estaba sola", concept: "multiple massive carved underground caverns", query: ["large carved cave chambers", "underground man made caverns"] },
  { name: "lg_colosal", first: "cada una es colosal", concept: "towering carved cave pillars and high ceiling, person for scale", query: ["Longyou cave pillars scale", "carved cave ceiling person"] },
  { name: "lg_donde_roca", first: "primero donde esta", concept: "huge pile of excavated rock debris, quarry spoil", query: ["pile of excavated rock", "quarry rubble debris"] },
  { name: "lg_marcas", first: "segundo las paredes estan", concept: "parallel uniform chisel marks covering a cave wall", query: ["parallel chisel marks cave wall", "uniform tool marks stone"] },
  { name: "lg_sin_registro", first: "y tercero lo mas", concept: "ancient chinese scrolls and historical records", query: ["ancient chinese scrolls records", "old chinese manuscript"] },
  { name: "lg_olvidaran", first: "una obra que habria", concept: "dark empty man-made cave, mysterious silence", query: ["dark empty cave mysterious", "abandoned cavern atmospheric"] },

  // ── 3 · PUMA PUNKU ──
  { name: "pp_intro", first: "numero tres puma punku", concept: "Puma Punku scattered precisely cut stone blocks Bolivia", query: ["Puma Punku blocks bolivia", "Puma Punku stones tiahuanaco"] },
  { name: "pp_altiplano", first: "a casi cuatro mil", concept: "windswept high altitude bolivian altiplano with ruins", query: ["bolivian altiplano ruins wind", "high altitude andes ruins"] },
  { name: "pp_maquina", first: "puma punku parte del", concept: "field of scattered broken precision stone blocks", query: ["scattered cut stone blocks ruins", "Puma Punku scattered stones"] },
  { name: "pp_hbloques", first: "hay bloques en forma", concept: "the famous identical H-shaped stone blocks of Puma Punku", query: ["Puma Punku H blocks", "H shaped stone block precise"] },
  { name: "pp_ranuras", first: "tienen ranuras perfectamente", concept: "extreme close up of precise straight grooves and right angles in stone", query: ["precise straight cut grooves stone", "right angle stone cut close"] },
  { name: "pp_diorita", first: "y todo esto esta", concept: "hard dark andesite diorite stone surface, polished", query: ["andesite stone polished dark", "hard diorite stone surface"] },
  { name: "pp_sin_metal", first: "los constructores de puma", concept: "ancient andean people without metal tools, illustration", query: ["ancient andean people illustration", "tiahuanaco people ancient"] },
  { name: "pp_industrial", first: "y sin embargo lograron", concept: "machine-precision cuts in stone, modern CNC comparison", query: ["precision machined stone", "CNC cut comparison stone"] },
  { name: "pp_prefab", first: "cuando miras esas piezas", concept: "modular interlocking stone components fitting together", query: ["modular stone blocks interlock", "prefabricated stone pieces ancient"] },
  { name: "pp_techo_mundo", first: "y mientras tanto las", concept: "Puma Punku ruins under dramatic altiplano sky", query: ["Puma Punku ruins sky", "tiahuanaco ruins dramatic sky"] },

  // ── 2 · GRAN PIRÁMIDE ──
  { name: "gp_intro", first: "numero dos la gran", concept: "the Great Pyramid of Giza, full majestic view", query: ["great pyramid giza full view", "pyramid giza majestic"] },
  { name: "gp_conocemos", first: "se exactamente lo que", concept: "tourists tiny at the base of the Great Pyramid for scale", query: ["people base great pyramid scale", "tourists giza pyramid huge"] },
  { name: "gp_dos_millones", first: "la gran piramide esta", concept: "the massive stone blocks of the Great Pyramid up close", query: ["great pyramid stone blocks close", "pyramid blocks massive"] },
  { name: "gp_cuenta", first: "se construyo segun la", concept: "ancient egyptians moving pyramid blocks on sledges, illustration", query: ["egyptians moving pyramid blocks", "ancient egypt building pyramid"] },
  { name: "gp_precision", first: "pero lo que de", concept: "precise corner and base of the Great Pyramid, alignment", query: ["great pyramid precise corner", "pyramid base alignment"] },
  { name: "gp_cardinal", first: "esta alineada con los", concept: "aerial of the pyramids aligned, cardinal directions", query: ["pyramids aerial alignment", "giza pyramids from above"] },
  { name: "gp_espejo", first: "sus cuatro caras estaban", concept: "smooth white limestone casing of a pyramid gleaming in sun", query: ["pyramid white casing stones", "smooth limestone pyramid sun"] },
  { name: "gp_cobre", first: "todo esto segun nos", concept: "ancient ropes wooden sledges and copper tools building", query: ["ancient building tools ropes", "wooden sledge stone egypt"] },
  { name: "gp_estrellas", first: "en el interior de", concept: "narrow internal shaft of the pyramid pointing to stars, night sky", query: ["pyramid internal shaft", "star alignment ancient night sky"] },
  { name: "gp_como", first: "la pregunta nunca fue", concept: "the Great Pyramid silhouetted at sunset, monumental", query: ["great pyramid sunset silhouette", "giza pyramid dusk"] },

  // ── 1 · SERAPEUM ──
  { name: "se_intro", first: "numero uno el serapeum", concept: "the underground tunnel of the Serapeum of Saqqara", query: ["Serapeum Saqqara tunnel", "Serapeum underground boxes"] },
  { name: "se_tunel", first: "cerca de la antigua", concept: "long dark carved rock tunnel underground, niches on sides", query: ["dark underground rock tunnel", "carved tunnel niches"] },
  { name: "se_caja", first: "a medida que avanzas", concept: "a giant granite box inside a niche in the Serapeum", query: ["Serapeum granite box niche", "giant granite sarcophagus"] },
  { name: "se_granito", first: "son enormes contenedores", concept: "an enormous polished granite box with its lid, huge", query: ["huge polished granite box lid", "massive granite container"] },
  { name: "se_toros", first: "la explicacion oficial dice", concept: "ancient egyptian Apis bull relief carving", query: ["apis bull egyptian relief", "egyptian sacred bull carving"] },
  { name: "se_precision", first: "el granito es una", concept: "extreme close up of perfectly flat polished granite surface", query: ["flat polished granite surface close", "precision granite finish"] },
  { name: "se_miden", first: "cuando los ingenieros modernos", concept: "engineer measuring a granite box with precision tools", query: ["engineer measuring stone precision", "measuring ancient artifact tools"] },
  { name: "se_angulos", first: "las esquinas internas en", concept: "perfect right angle inside corner of a granite box", query: ["perfect inside corner granite", "right angle cut granite box"] },
  { name: "se_cnc", first: "para lograr algo asi", concept: "modern CNC machine cutting granite with diamond tools", query: ["CNC machine cutting granite", "diamond tool cutting stone"] },
  { name: "se_mover", first: "ahora pensemos paso a", concept: "moving a huge granite block through a narrow tunnel, impossible", query: ["moving granite block tunnel", "transport huge stone narrow"] },
  { name: "se_silencio", first: "no se trata de", concept: "the dark Serapeum tunnel with the row of granite boxes", query: ["Serapeum row of boxes tunnel", "underground granite boxes row"] },

  // ── CIERRE ──
  { name: "cl_hilo", first: "y entonces volvemos a", concept: "montage feeling of ancient megalithic sites around the world", query: ["ancient megalithic sites montage", "world ancient ruins"] },
  { name: "cl_supieron", first: "y si supieron mucho", concept: "mysterious ancient advanced technology concept, lost knowledge", query: ["lost ancient technology concept", "ancient advanced knowledge"] },
  { name: "cl_perdio", first: "y si en algun", concept: "ancient civilization collapsing, catastrophe, ruins in storm", query: ["ancient civilization collapse", "ruins storm catastrophe"] },
  { name: "cl_patron", first: "pero junta todas las", concept: "split montage of megaliths from different continents", query: ["megaliths different continents", "ancient sites comparison world"] },
  { name: "cl_medio", first: "tal vez no estamos", concept: "ruins half buried in sand jungle and underwater, hidden", query: ["ruins buried sand jungle", "hidden ancient ruins overgrown"] },
  { name: "cl_cronicas", first: "esto fue cronicas perdidas", concept: "dramatic ancient ruins at golden sunset, contemplative", query: ["ancient ruins golden sunset", "epic ruins sunset wide"] },
  { name: "cl_teaser", first: "y la proxima vez", concept: "underwater ruins of a sunken city, divers exploring", query: ["underwater sunken city ruins", "submerged ancient ruins divers"] },
  { name: "cl_final", first: "hasta entonces segui mirando", concept: "lone ancient megalith silhouette against starry night sky", query: ["megalith night sky stars", "ancient stone starry night"] },
];

// ★ ANCLAJE EXACTO desde el TIMING de gen_tts (MI texto, no whisper) → ancla casi todo.
const TM = JSON.parse(fs.readFileSync("public/construcciones_timing.json", "utf8"));
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
fs.writeFileSync("public/broll/match_construcciones.json", JSON.stringify(match, null, 1));
fs.writeFileSync("src/VideoEdit/construcciones_cues.json", JSON.stringify(cues, null, 1));
console.log(`frases: ${PH.length} · ancladas exactas: ${found}/${PH.length} · dur total ~${END.toFixed(0)}s (${(END/60).toFixed(1)} min)`);
console.log("→ match_construcciones.json + construcciones_cues.json");
