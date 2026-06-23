// gen_antartida.mjs — video 4 Crónicas Perdidas (mismo flujo que ciudades).
// 1 clip REAL por idea, anclado al ms EXACTO del timing de gen_tts (MI texto, no whisper).
// Lee public/antartida_timing.json → emite public/broll/match_antartida.json + src/VideoEdit/antartida_cues.json.
import fs from "fs";

const PH = [
  // ── COLD OPEN ──
  { name: "intro_continente", first: "hay un continente entero", concept: "vast empty Antarctic ice sheet from the air, endless white", query: ["antarctica ice sheet aerial", "endless antarctic ice drone"] },
  { name: "intro_europa", first: "mas grande que europa", concept: "the immense scale of Antarctica, satellite view of the white continent", query: ["antarctica from space satellite", "white continent globe"] },
  { name: "intro_capa", first: "cubierto por una capa", concept: "a towering wall of thick antarctic ice, kilometers deep", query: ["antarctic ice cliff wall", "thick glacier ice wall"] },
  { name: "intro_oficial", first: "la version oficial es sencilla", concept: "an antarctic research station in the snow", query: ["antarctic research station", "antarctica base snow"] },
  { name: "intro_detalle", first: "pero hay un detalle", concept: "dark ominous crevasse going down into the ice", query: ["dark ice crevasse deep", "glacier crevasse abyss"] },
  { name: "intro_debajo", first: "debajo de ese hielo", concept: "hidden rocky landscape beneath the ice, cross-section concept", query: ["land beneath ice cross section", "bedrock under glacier illustration"] },
  { name: "intro_montanas", first: "montanas valles lagos", concept: "hidden mountains and valleys under ice, subglacial terrain", query: ["mountains under ice antarctica", "subglacial mountains illustration"] },
  { name: "intro_datos", first: "y segun algunos de los datos", concept: "ice-penetrating radar scan data on a screen", query: ["ice penetrating radar data", "radar scan glacier screen"] },
  { name: "intro_acerca", first: "cada vez que alguien se acerca", concept: "a blurred censored satellite image of snowy terrain", query: ["blurred satellite image", "censored map area pixelated"] },
  { name: "intro_borrosas", first: "las imagenes se vuelven borrosas", concept: "pixelated blurry spot on an otherwise sharp map", query: ["pixelated blur satellite map", "glitch censored aerial"] },
  { name: "intro_cancelan", first: "las expediciones se cancelan", concept: "a polar expedition team packing up and leaving in a storm", query: ["polar expedition leaving storm", "antarctic team evacuation"] },
  { name: "intro_pregunta", first: "y la pregunta que queda", concept: "a lone figure standing on the vast ice, tiny", query: ["lone figure antarctic ice", "person tiny vast ice"] },
  { name: "intro_bajar", first: "hoy vamos a bajar", concept: "descending into a deep blue ice tunnel", query: ["descending ice tunnel blue", "going down glacier cave"] },
  { name: "intro_siete", first: "vamos a recorrer siete", concept: "montage of mysterious antarctic anomalies, ominous", query: ["antarctica mystery montage", "strange antarctic phenomena"] },
  { name: "intro_guia", first: "soy tu guia en", concept: "atmospheric blue ice cave with light beams", query: ["blue ice cave light beams", "glacier cave atmospheric"] },
  { name: "intro_final", first: "quedate hasta el final", concept: "vintage 1940s navy warships in icy waters", query: ["vintage navy ships ice", "1940s warship arctic archival"] },
  { name: "intro_historia", first: "es una historia real", concept: "old black and white military polar expedition footage", query: ["archival polar military expedition", "1940s antarctica expedition bw"] },
  { name: "intro_respira", first: "respira hondo empecemos", concept: "calm pristine antarctic ice surface at dawn", query: ["antarctic ice dawn calm", "pristine snow surface morning"] },

  // ── PRÓLOGO: el continente bajo el hielo ──
  { name: "intro_mapa", first: "antes de bajar", concept: "a map of Antarctica, the white continent outline", query: ["antarctica map continent", "antarctic continent outline"] },
  { name: "intro_llanura", first: "lo que ves cuando pensas", concept: "infinite flat snow plain, featureless white horizon", query: ["endless snow plain horizon", "flat antarctic ice field"] },
  { name: "intro_relieve", first: "debajo hay un relieve", concept: "dramatic mountain ranges hidden under ice, illustration", query: ["mountain range under ice illustration", "subglacial relief 3d"] },
  { name: "intro_cadenas", first: "cadenas montanosas", concept: "sharp antarctic mountain peaks rising from ice", query: ["antarctic mountains peaks", "transantarctic mountains aerial"] },
  { name: "intro_enterrado", first: "todo eso esta enterrado", concept: "ice core sample being pulled from deep drilling", query: ["ice core sample drilling", "glacier ice core extraction"] },
  { name: "intro_ecos", first: "es decir casi todo lo que sabemos", concept: "radar echo readout, wavy lines on a dark screen", query: ["radar echo readout screen", "sonar radar waveform dark"] },
  { name: "intro_raras", first: "y los ecos a veces", concept: "a strange unexpected blip on a radar display", query: ["strange radar blip screen", "anomaly on radar display"] },

  // ── 7 · LAGO VOSTOK ──
  { name: "vk_intro", first: "numero siete empecemos", concept: "a remote Russian antarctic station in deep snow", query: ["russian antarctic station vostok", "remote polar research base"] },
  { name: "vk_perforando", first: "a finales del siglo veinte", concept: "an ice drilling rig boring into the glacier", query: ["ice drilling rig antarctica", "deep ice borehole machine"] },
  { name: "vk_core", first: "perforando el hielo en una base", concept: "long cylindrical ice cores laid out", query: ["ice core cylinders lab", "glacier core samples row"] },
  { name: "vk_agua", first: "habia agua liquida", concept: "liquid water hidden under thick ice, concept", query: ["water under ice concept", "subglacial liquid water"] },
  { name: "vk_lago", first: "no un charco un lago", concept: "a vast subglacial lake illustration sealed under ice", query: ["subglacial lake illustration", "lake under ice cross section"] },
  { name: "vk_nombre", first: "lo llamaron lago vostok", concept: "Lake Vostok diagram beneath the ice sheet", query: ["lake vostok diagram", "vostok subglacial lake map"] },
  { name: "vk_no_solo", first: "y no esta solo", concept: "a network of subglacial lakes and rivers map", query: ["subglacial lakes network map", "rivers under antarctic ice"] },
  { name: "vk_detectado", first: "bajo el hielo antartico se han detectado", concept: "scientific diagram of hundreds of lakes under ice", query: ["antarctic subglacial lakes diagram", "hidden lakes ice map science"] },
  { name: "vk_oscuridad", first: "pensalo un segundo", concept: "pitch black underwater scene, total darkness deep lake", query: ["pitch black underwater dark", "deep dark lake water"] },
  { name: "vk_muestras", first: "cuando finalmente lograron tomar muestras", concept: "scientists handling water samples in a lab", query: ["scientists water samples lab", "lab sample analysis gloves"] },
  { name: "vk_vida", first: "encontraron rastros de vida", concept: "extremophile microbes under a microscope", query: ["microbes microscope extremophile", "bacteria microscope science"] },
  { name: "vk_puerta", first: "y eso abre la puerta", concept: "a dark mysterious ice tunnel leading down", query: ["dark ice tunnel down", "mysterious glacier passage"] },

  // ── 6 · ANOMALÍA MAGNÉTICA ──
  { name: "mg_intro", first: "numero seis y el lago vostok", concept: "frozen surface of Lake Vostok under ice", query: ["frozen lake ice surface", "vostok ice surface antarctica"] },
  { name: "mg_medir", first: "a principios de los anos dos mil", concept: "scientists with measuring instruments on the ice", query: ["scientists instruments ice field", "researchers measuring antarctica"] },
  { name: "mg_campo", first: "al medir el campo magnetico", concept: "a magnetometer and a spinning compass", query: ["magnetometer compass science", "compass needle instrument"] },
  { name: "mg_anomalia", first: "detectaron una anomalia", concept: "a glowing magnetic field anomaly visualization", query: ["magnetic field anomaly visualization", "magnetic map heat anomaly"] },
  { name: "mg_region", first: "una region enorme", concept: "a large red anomaly zone on a survey map", query: ["anomaly zone map red", "geophysical survey map heat"] },
  { name: "mg_masivo", first: "era como si algo masivo", concept: "a huge dense buried object concept under ice", query: ["massive buried object concept", "dense mass under ground illustration"] },
  { name: "mg_mineral", first: "la explicacion mas prudente", concept: "a vein of dark metallic mineral ore in rock", query: ["metallic mineral ore rock", "iron ore deposit vein"] },
  { name: "mg_brujula", first: "pero el tamano de la anomalia", concept: "a compass needle spinning wildly out of control", query: ["compass spinning erratic", "compass needle going crazy"] },
  { name: "mg_enloquece", first: "porque una brujula que enloquece", concept: "close up of a compass in the middle of nowhere", query: ["compass close up snow", "compass needle macro"] },

  // ── 5 · LAS PIRÁMIDES ──
  { name: "pi_intro", first: "numero cinco subamos", concept: "rocky antarctic mountain surface emerging from ice", query: ["antarctic rocky mountain surface", "mountain emerging ice rock"] },
  { name: "pi_montanas", first: "en ciertas zonas de la antartida se levantan", concept: "a pyramid-shaped mountain in Antarctica", query: ["antarctica pyramid mountain", "pyramid shaped peak snow"] },
  { name: "pi_caras", first: "tienen cuatro caras", concept: "a strikingly symmetrical four-sided peak", query: ["symmetrical pyramid peak mountain", "four sided mountain snow"] },
  { name: "pi_llamo", first: "la gente inevitablemente las llamo", concept: "the famous antarctic pyramid photo, dramatic", query: ["antarctica pyramid photo dramatic", "ice pyramid mountain viral"] },
  { name: "pi_fotos", first: "y las fotos dieron la vuelta", concept: "a viral mysterious image spreading concept", query: ["viral mystery photo concept", "mysterious image news"] },
  { name: "pi_geologos", first: "la explicacion de los geologos", concept: "a geologist examining eroded rock formations", query: ["geologist examining rock", "geology erosion study"] },
  { name: "pi_relieve", first: "un tipo de relieve", concept: "a naturally pyramid-shaped weathered peak elsewhere", query: ["natural pyramid peak erosion", "weathered pyramidal mountain"] },
  { name: "pi_otras", first: "existen en otras partes", concept: "similar sharp triangular peaks in mountains", query: ["sharp triangular mountain peaks", "horn pyramidal peak alps"] },
  { name: "pi_interesante", first: "pero lo interesante de la antartida", concept: "a lone mysterious peak in the antarctic mist", query: ["mysterious peak antarctic mist", "lone mountain fog ice"] },

  // ── 4 · GOOGLE EARTH / BORROSO ──
  { name: "ge_intro", first: "numero cuatro y si hablamos", concept: "a satellite map application on a screen", query: ["satellite map screen earth", "google earth screen map"] },
  { name: "ge_computadora", first: "cualquiera con una computadora", concept: "a person exploring satellite maps on a laptop", query: ["person laptop satellite map", "exploring earth map computer"] },
  { name: "ge_rincones", first: "en distintos rincones del continente", concept: "a strange circle highlighted on a snowy satellite image", query: ["circle anomaly satellite snow", "highlighted feature aerial ice"] },
  { name: "ge_circular", first: "una estructura circular perfecta", concept: "a perfect circular structure half buried in snow", query: ["circular structure snow buried", "perfect circle ice aerial"] },
  { name: "ge_hallazgos", first: "y junto a esos hallazgos", concept: "a dark entrance-like shape on a mountainside", query: ["dark entrance mountainside snow", "cave opening ice satellite"] },
  { name: "ge_borroneadas", first: "zonas borroneadas", concept: "a deliberately blurred pixelated patch on a sharp map", query: ["blurred patch map censored", "pixelated censorship satellite"] },
  { name: "ge_empresas", first: "las empresas que hacen estos mapas", concept: "a data center with map servers", query: ["data center servers", "map technology server room"] },
  { name: "ge_patron", first: "pero el patron se repite", concept: "a magnifying glass over a suspicious map spot", query: ["magnifying glass map", "loupe over satellite image"] },

  // ── 3 · CUEVAS ──
  { name: "cv_intro", first: "numero tres volvamos", concept: "the entrance of an ice cave in a glacier", query: ["ice cave entrance glacier", "glacier cave mouth blue"] },
  { name: "cv_cuevas", first: "en varias zonas de la antartida se han encontrado", concept: "stunning blue ice cave interior", query: ["blue ice cave interior", "glacier cave inside antarctica"] },
  { name: "cv_talladas", first: "algunas talladas por el propio", concept: "smooth ice tunnel carved by glacier movement", query: ["ice tunnel smooth glacier", "carved ice passage"] },
  { name: "cv_calor", first: "otras alimentadas por el calor", concept: "steam rising from volcanic vents in snow", query: ["volcanic steam vents snow", "fumarole steam ice"] },
  { name: "cv_erebus", first: "el mas famoso de ellos el monte erebus", concept: "Mount Erebus, the active antarctic volcano", query: ["mount erebus volcano antarctica", "antarctic volcano steaming"] },
  { name: "cv_tuneles", first: "ese calor crea redes de tuneles", concept: "warm ice cave tunnels lit from within", query: ["ice cave tunnel warm glow", "glacier tunnel network"] },
  { name: "cv_imaginacion", first: "y aca la imaginacion", concept: "a dark sheltered cave, refuge atmosphere", query: ["dark sheltered cave refuge", "cave interior dark mysterious"] },
  { name: "cv_calidas", first: "si bajo el hielo hay cuevas calidas", concept: "an explorer with a headlamp inside an ice cave", query: ["explorer headlamp ice cave", "caver inside glacier"] },
  { name: "cv_afirmando", first: "no estoy afirmando", concept: "total darkness inside a cave, fading light", query: ["cave darkness fading light", "dark cave depth"] },
  { name: "cv_expedicion", first: "y que cada vez que entra una expedicion", concept: "an expedition team entering an ice cave", query: ["expedition team ice cave", "explorers entering glacier cave"] },

  // ── 2 · ECOS DE RADAR ──
  { name: "rd_intro", first: "numero dos y llegamos", concept: "a survey plane flying low over the ice", query: ["survey plane over ice antarctica", "research aircraft low ice"] },
  { name: "rd_decadas", first: "durante decadas distintos equipos", concept: "an aircraft with ice-penetrating radar antennas", query: ["aircraft radar antarctica survey", "plane radar ice mapping"] },
  { name: "rd_barridos", first: "y en algunos de esos barridos", concept: "a radar cross-section showing layers under ice", query: ["radar cross section ice layers", "ice sheet radar profile"] },
  { name: "rd_contornos", first: "ecos que devolvian contornos", concept: "an unusually straight geometric shape on radar", query: ["geometric shape radar", "straight lines radar anomaly"] },
  { name: "rd_estructuras", first: "estructuras enterradas con bordes", concept: "a buried structure outline revealed by radar", query: ["buried structure radar outline", "subsurface anomaly radar"] },
  { name: "rd_simetricas", first: "en un par de casos", concept: "a large symmetric anomaly under hundreds of meters of ice", query: ["symmetric anomaly under ice", "large buried mass radar"] },
  { name: "rd_crater", first: "la ciencia tiene candidatos", concept: "a buried impact crater concept under ice", query: ["buried impact crater illustration", "meteor crater under ice"] },
  { name: "rd_perforar", first: "pero hay un problema practico", concept: "the extreme difficulty of drilling kilometers of ice", query: ["deep ice drilling difficult", "drilling rig harsh antarctica"] },
  { name: "rd_siguen", first: "asi que ahi siguen esas formas", concept: "a lone blip waiting on a dark radar screen", query: ["radar blip dark screen waiting", "lone anomaly radar monitor"] },

  // ── 1 · OPERACIÓN HIGHJUMP ──
  { name: "hj_intro", first: "y llegamos al numero uno", concept: "a vintage 1940s navy fleet in formation", query: ["vintage navy fleet 1940s", "wwii era warships formation archival"] },
  { name: "hj_verano", first: "en el verano de mil novecientos cuarenta y seis", concept: "black and white 1946 military footage", query: ["1946 military archival footage", "post war navy black white"] },
  { name: "hj_envio", first: "estados unidos envio al continente", concept: "navy ships pushing through antarctic pack ice", query: ["navy ships antarctic ice vintage", "icebreaker ships polar archival"] },
  { name: "hj_nombre", first: "la llamaron operacion highjump", concept: "Operation Highjump archival imagery", query: ["operation highjump 1947", "byrd antarctic expedition archival"] },
  { name: "hj_escala", first: "y la escala es lo primero", concept: "an aerial of a huge fleet of ships", query: ["huge fleet ships aerial", "massive naval fleet ocean"] },
  { name: "hj_flota", first: "mandaron una flota de mas", concept: "an aircraft carrier with planes on deck, vintage", query: ["aircraft carrier planes vintage", "carrier deck 1940s archival"] },
  { name: "hj_cinco_mil", first: "cinco mil", concept: "thousands of sailors gathered on a ship deck", query: ["thousands sailors ship deck", "navy crew formation vintage"] },
  { name: "hj_militar", first: "eso no es una expedicion cientifica", concept: "soldiers in formation on the ice, military", query: ["soldiers formation snow", "military troops ice vintage"] },
  { name: "hj_byrd", first: "estaba al mando el almirante byrd", concept: "portrait of Admiral Richard Byrd, polar explorer", query: ["admiral richard byrd portrait", "byrd explorer vintage photo"] },
  { name: "hj_plan", first: "la operacion estaba planeada", concept: "an old expedition plan map with routes", query: ["old expedition plan map", "vintage military map routes"] },
  { name: "hj_cancelo", first: "se cancelo y se replego", concept: "navy ships abruptly turning back through ice", query: ["ships turning back ice", "fleet retreating sea vintage"] },
  { name: "hj_fuerza", first: "una fuerza enorme", concept: "a powerful fleet sailing away, vintage", query: ["fleet sailing away vintage", "ships leaving formation archival"] },
  { name: "hj_clima", first: "las explicaciones oficiales hablan", concept: "a brutal antarctic blizzard whiteout", query: ["antarctic blizzard whiteout", "polar storm extreme snow"] },
  { name: "hj_despiadada", first: "y es cierto que la antartida", concept: "harsh frozen ships covered in ice", query: ["ships covered ice frozen", "frozen ship harsh polar"] },
  { name: "hj_declaraciones", first: "se le atribuyen al almirante byrd", concept: "a vintage newspaper headline, dramatic", query: ["vintage newspaper headline", "old newspaper front page dramatic"] },
  { name: "hj_diario", first: "aparecio con los anos un supuesto diario", concept: "an old handwritten diary, mysterious", query: ["old handwritten diary", "vintage journal pages"] },
  { name: "hj_material", first: "mucho de ese material", concept: "stamped classified documents", query: ["classified documents stamp", "top secret file vintage"] },
  { name: "hj_huecos", first: "pero los huecos estan", concept: "a heavily redacted document with black bars", query: ["redacted document black bars", "censored classified paper"] },
  { name: "hj_desproporcionada", first: "la escala militar desproporcionada", concept: "a massive military deployment on the ice", query: ["massive military deployment ice", "large naval operation vintage"] },
  { name: "hj_ochenta", first: "y la sensacion casi ochenta anos", concept: "the antarctic horizon, unanswered questions", query: ["antarctic horizon vast lonely", "ice horizon dramatic"] },
  { name: "hj_sensacion", first: "esa sensacion tambien esta", concept: "a lone figure staring out at the endless ice", query: ["figure staring at ice horizon", "lone person vast snow back"] },

  // ── CIERRE ──
  { name: "cl_bajado", first: "hemos bajado a traves del hielo", concept: "montage of descending through ice layers", query: ["descending ice layers montage", "glacier depth montage"] },
  { name: "cl_agua", first: "vimos un mundo de agua", concept: "a hidden subglacial lake glowing", query: ["subglacial lake glow", "water under ice blue"] },
  { name: "cl_magnetica", first: "una anomalia magnetica", concept: "a compass needle spinning", query: ["compass spinning needle", "compass anomaly close"] },
  { name: "cl_piramide", first: "montanas con forma de piramide", concept: "the pyramid mountain of Antarctica", query: ["antarctica pyramid mountain", "pyramidal peak snow"] },
  { name: "cl_borrosas", first: "imagenes que se vuelven borrosas", concept: "a blurred censored map spot", query: ["blurred map censored spot", "pixelated satellite patch"] },
  { name: "cl_cuevas", first: "cuevas templadas", concept: "a glowing warm ice cave", query: ["warm ice cave glow", "blue ice cave interior"] },
  { name: "cl_radar", first: "ecos de radar", concept: "a geometric anomaly on a radar screen", query: ["geometric radar anomaly screen", "radar buried structure"] },
  { name: "cl_militar", first: "y una operacion militar", concept: "vintage navy fleet in icy waters", query: ["vintage navy fleet ice", "warships polar archival"] },
  { name: "cl_juntalas", first: "pero juntalas todas", concept: "a sweeping ominous shot of the white continent", query: ["antarctica ominous aerial wide", "vast ice continent dramatic"] },
  { name: "cl_desierto", first: "que la antartida no es el desierto", concept: "the vast ice sheet under a dark sky", query: ["ice sheet dark sky dramatic", "antarctica moody wide"] },
  { name: "cl_kilometros", first: "que bajo esos cuatro kilometros", concept: "a hidden world under deep ice, concept", query: ["hidden world under ice concept", "deep beneath glacier illustration"] },
  { name: "cl_razon", first: "y que la verdadera razon", concept: "a locked gate or barrier in the snow, forbidden", query: ["locked gate snow forbidden", "barrier antarctica restricted"] },
  { name: "cl_canal", first: "si llegaste hasta aca", concept: "a dramatic cinematic antarctic vista", query: ["cinematic antarctic vista", "epic ice landscape dramatic"] },
  { name: "cl_arena", first: "porque si el hielo guarda", concept: "transition from ice to desert dunes", query: ["ice to desert transition", "snow and sand contrast"] },
  { name: "cl_proximo", first: "en el proximo viaje vamos a cruzar", concept: "vast desert sand dunes from the air", query: ["desert dunes aerial vast", "sahara dunes drone"] },
  { name: "cl_ciudades", first: "a esas estructuras y ciudades que el desierto", concept: "ruins half buried in desert sand", query: ["ruins buried desert sand", "ancient city under dunes"] },
  { name: "cl_acompanarme", first: "si queres acompanarme", concept: "an epic lone shot of the ice at golden hour", query: ["epic ice golden hour", "antarctic sunset wide"] },
  { name: "cl_suscribite", first: "suscribite a cronicas perdidas", concept: "a cinematic sweeping antarctic landscape", query: ["sweeping antarctic landscape cinematic", "ice continent epic"] },
  { name: "cl_curiosidad", first: "cuidate manten la curiosidad", concept: "hopeful light breaking over the ice", query: ["light over ice hopeful", "sunrise antarctic ice calm"] },
  { name: "cl_respuestas", first: "a veces las respuestas mas grandes", concept: "a forbidden closed door, restricted area", query: ["forbidden closed door", "restricted area sign cold"] },
  { name: "cl_final", first: "estan simplemente en el lugar", concept: "final haunting shot of the silent endless ice", query: ["silent endless ice haunting", "lonely antarctic ice final"] },
];

// ★ ANCLAJE EXACTO desde el TIMING de gen_tts (MI texto, no whisper).
const TM = JSON.parse(fs.readFileSync("public/antartida_timing.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
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
fs.writeFileSync("public/broll/match_antartida.json", JSON.stringify(match, null, 1));
fs.writeFileSync("src/VideoEdit/antartida_cues.json", JSON.stringify(cues, null, 1));
console.log(`frases: ${PH.length} · ancladas exactas: ${found}/${PH.length} · dur total ~${END.toFixed(0)}s (${(END / 60).toFixed(1)} min)`);
console.log("→ match_antartida.json + antartida_cues.json");
