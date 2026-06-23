// gen_tuneles.mjs — video 5 Crónicas Perdidas. 1 clip real por idea, anclado al timing de gen_tts.
// Lee public/tuneles_timing.json → public/broll/match_tuneles.json + src/VideoEdit/tuneles_cues.json.
import fs from "fs";

const PH = [
  // ── COLD OPEN ──
  { name: "intro_pies", first: "debajo de tus pies", concept: "descending into dark underground passage, ominous", query: ["dark underground tunnel descent", "going down into dark cave"] },
  { name: "intro_arriba", first: "mientras la historia que nos contaron", concept: "looking up at grand ancient temples and cathedrals", query: ["ancient temple looking up grand", "cathedral interior looking up"] },
  { name: "intro_pueblos", first: "pueblos enteros que en algun", concept: "ancient people digging into the earth, illustration", query: ["ancient people digging earth", "workers excavating rock ancient"] },
  { name: "intro_escala", first: "y lo hicieron a una escala", concept: "a vast underground cavern, sense of scale", query: ["vast underground cavern huge", "giant cave chamber scale"] },
  { name: "intro_tuneles", first: "hablamos de tuneles", concept: "a hand-cut tunnel carved in solid rock", query: ["hand carved rock tunnel", "tunnel cut in stone ancient"] },
  { name: "intro_naturales", first: "pero no de cuevas naturales", concept: "a natural water-formed cave with stalactites", query: ["natural cave stalactites water", "limestone cave formation"] },
  { name: "intro_angulos", first: "camaras subterraneas con angulos", concept: "an underground chamber with sharp right angles cut in rock", query: ["square cut underground chamber", "right angle rock cut cave"] },
  { name: "intro_redes", first: "redes que se extienden por", concept: "a map diagram of an underground tunnel network", query: ["underground tunnel network map", "tunnel system diagram"] },
  { name: "intro_pregunta", first: "la pregunta que la arqueologia", concept: "an archaeologist examining a tunnel with a flashlight, puzzled", query: ["archaeologist tunnel flashlight", "researcher examining cave"] },
  { name: "intro_porque", first: "por que que llevo a tantos", concept: "people descending stairs into the earth, illustration", query: ["people descending into earth", "stairs going underground dark"] },
  { name: "intro_bajar", first: "hoy vamos a bajar", concept: "descent into a long dark tunnel", query: ["descending long dark tunnel", "walking into dark tunnel"] },
  { name: "intro_guia", first: "soy tu guia en", concept: "an atmospheric torch-lit ancient tunnel", query: ["torch lit ancient tunnel", "atmospheric stone passage light"] },
  { name: "intro_final", first: "quedate hasta el final", concept: "a vast carved underground city, awe", query: ["underground city carved rock", "ancient underground city vast"] },
  { name: "intro_ciudad", first: "es una ciudad entera excavada", concept: "underground rooms and passages carved into rock", query: ["carved underground rooms rock", "underground dwelling cave city"] },
  { name: "intro_respira", first: "respira hondo empecemos", concept: "a dark tunnel entrance into a hillside", query: ["dark tunnel entrance hillside", "cave mouth dark ominous"] },

  // ── 7 · HAL SAFLIENI (Malta) ──
  { name: "hs_intro", first: "numero siete empecemos en una pequena isla", concept: "aerial of Malta island in the Mediterranean", query: ["malta island aerial mediterranean", "mediterranean small island coast"] },
  { name: "hs_casa", first: "bajo una casa comun", concept: "workers digging a well shaft by hand", query: ["digging well shaft by hand", "workers excavating hole ground"] },
  { name: "hs_bajaron", first: "cuando bajaron a mirar", concept: "looking down into a dark hole in the rock", query: ["looking down dark hole rock", "peering into dark pit"] },
  { name: "hs_niveles", first: "tres niveles excavados en la piedra", concept: "carved limestone underground chambers descending", query: ["carved limestone chambers underground", "rock cut underground levels"] },
  { name: "hs_hipogeo", first: "lo llamaron el hipogeo", concept: "the Hal Saflieni Hypogeum carved interior, Malta", query: ["Hal Saflieni Hypogeum malta", "ancient carved underground temple malta"] },
  { name: "hs_anos", first: "tiene alrededor de cinco mil", concept: "ancient human bones and skulls in an underground chamber", query: ["ancient bones skulls underground", "prehistoric burial chamber bones"] },
  { name: "hs_piel", first: "pero lo que de verdad pone la piel", concept: "a mysterious carved niche in a dark chamber", query: ["carved niche dark chamber", "mysterious rock cut alcove"] },
  { name: "hs_oraculo", first: "conocida como la camara del oraculo", concept: "the oracle room, a small carved chamber with a niche", query: ["oracle chamber carved rock", "small ancient stone room niche"] },
  { name: "hs_voz", first: "si una persona habla dentro", concept: "sound waves resonance visualization, concept", query: ["sound waves resonance visualization", "acoustic vibration concept dark"] },
  { name: "hs_nadie", first: "nadie sabe con certeza como lograron", concept: "person examining an ancient carved wall by lamplight", query: ["examining ancient wall lamp", "hand on carved stone wall"] },

  // ── 6 · BAIAE / INFRAMUNDO (Italia) ──
  { name: "ba_intro", first: "numero seis volvemos a italia", concept: "the Bay of Naples coastline with ancient ruins", query: ["bay of naples ruins coast", "ancient roman ruins coast italy"] },
  { name: "ba_templo", first: "cerca de las ruinas de un antiguo templo", concept: "ancient temple ruins on a hillside in Italy", query: ["ancient temple ruins hillside italy", "roman temple ruins"] },
  { name: "ba_inframundo", first: "la entrada al inframundo", concept: "a dark ominous tunnel entrance in a hillside", query: ["dark ominous tunnel entrance", "cave entrance underworld dark"] },
  { name: "ba_estrecho", first: "es un tunel estrecho y bajo", concept: "a narrow low ancient tunnel", query: ["narrow low ancient tunnel", "tight stone passage"] },
  { name: "ba_recto", first: "esta cortado en linea perfectamente recta", concept: "an impossibly straight long tunnel into darkness", query: ["perfectly straight long tunnel", "straight stone corridor dark"] },
  { name: "ba_orientacion", first: "con una orientacion tan precisa", concept: "a tunnel aligned with a beam of sunlight", query: ["tunnel aligned sunlight beam", "light beam through corridor"] },
  { name: "ba_caliente", first: "el aire se vuelve mas caliente", concept: "steam rising inside a dark tunnel", query: ["steam inside dark tunnel", "hot steam rock passage"] },
  { name: "ba_rio", first: "un rio de agua hirviendo", concept: "a boiling underground hot spring river in darkness", query: ["underground hot spring river", "boiling water cave dark steam"] },
  { name: "ba_escena", first: "imagina la escena", concept: "a torch-lit figure walking down a dark sloping tunnel", query: ["figure torch dark tunnel walking", "person lantern descending passage"] },
  { name: "ba_muertos", first: "no es dificil entender por que creyeron", concept: "the dark underworld concept, ominous descent", query: ["underworld dark descent concept", "dark abyss tunnel ominous"] },

  // ── 5 · TAYOS (Ecuador) ──
  { name: "ta_intro", first: "numero cinco cruzamos el oceano", concept: "aerial over the dense Ecuadorian jungle", query: ["ecuador jungle aerial dense", "amazon rainforest canopy aerial"] },
  { name: "ta_cuevas", first: "un sistema de cuevas conocido como las cuevas", concept: "a huge jungle cave entrance, Tayos", query: ["huge jungle cave entrance", "Tayos cave ecuador"] },
  { name: "ta_enormes", first: "son enormes con galerias", concept: "a giant deep cave gallery", query: ["giant deep cave gallery", "huge cave chamber explorer"] },
  { name: "ta_profundo", first: "se decia que en lo mas profundo", concept: "a mysterious deep dark cave chamber", query: ["mysterious deep cave chamber dark", "hidden cave room dark"] },
  { name: "ta_biblioteca", first: "una biblioteca entera hecha de metal", concept: "stacks of engraved metal plates, concept", query: ["engraved metal plates ancient", "metal tablets symbols concept"] },
  { name: "ta_expediciones", first: "la historia atrajo expediciones", concept: "a caving expedition with ropes and lamps", query: ["caving expedition ropes lamps", "explorers descending cave rope"] },
  { name: "ta_nunca", first: "la famosa biblioteca de metal nunca", concept: "an empty dark cave chamber, nothing there", query: ["empty dark cave chamber", "bare cave interior dark"] },
  { name: "ta_reales", first: "pero las cuevas son absolutamente reales", concept: "a colossal cave interior, tiny explorer", query: ["colossal cave interior explorer", "massive cavern person scale"] },
  { name: "ta_regularidad", first: "una regularidad en las paredes", concept: "cave walls with oddly regular angles and surfaces", query: ["cave wall regular angles", "smooth flat cave wall mysterious"] },
  { name: "ta_leyenda", first: "a veces la leyenda es falsa", concept: "a dark mysterious cave mouth in the jungle", query: ["dark cave mouth jungle", "jungle cave entrance mysterious"] },

  // ── 4 · LONGYOU (China) ──
  { name: "lg_intro", first: "numero cuatro vamos a china", concept: "rural Chinese landscape with hills and ponds", query: ["rural china landscape hills", "china countryside pond village"] },
  { name: "lg_bombas", first: "unos campesinos decidieron vaciar", concept: "water being pumped out of a pond", query: ["pumping water out of pond", "draining pond water pump"] },
  { name: "lg_agua", first: "cuando el agua bajo", concept: "a drained pond revealing a dark cave entrance", query: ["drained pond cave entrance", "water revealing hidden hole"] },
  { name: "lg_caverna", first: "la entrada a una caverna gigantesca", concept: "a giant man-made underground cavern, Longyou", query: ["Longyou caves giant cavern", "huge man made cave china"] },
  { name: "lg_veinticuatro", first: "aparecieron veinticuatro de estas", concept: "multiple huge carved caverns side by side", query: ["multiple carved caverns", "man made cave chambers row"] },
  { name: "lg_catedral", first: "cada una es del tamano de una catedral", concept: "a cathedral-sized cave with carved pillars", query: ["Longyou cave pillars cathedral", "giant cave carved pillar"] },
  { name: "lg_marcas", first: "paredes cubiertas por marcas paralelas", concept: "parallel chisel tool marks covering a cave wall", query: ["parallel tool marks cave wall", "chisel marks rock pattern"] },
  { name: "lg_nombre", first: "las llamaron las cuevas de longyou", concept: "the Longyou caves interior, vast and dim", query: ["Longyou caves interior", "Longyou grottoes china"] },
  { name: "lg_titanica", first: "una obra titanica", concept: "the massive scale of rock excavation", query: ["massive rock excavation scale", "huge cave excavation work"] },
  { name: "lg_documento", first: "no existe ni un solo documento", concept: "a blank ancient scroll, no records concept", query: ["blank ancient scroll", "empty old manuscript concept"] },
  { name: "lg_olvidar", first: "es como si alguien hubiera querido", concept: "a mysterious empty carved cavern, forgotten", query: ["empty carved cavern mysterious", "abandoned man made cave"] },

  // ── 3 · RED EDAD DE PIEDRA (Europa) ──
  { name: "st_intro", first: "numero tres y si una obra borrada", concept: "an ancient narrow tunnel dug in earth", query: ["ancient narrow earth tunnel", "prehistoric dug tunnel"] },
  { name: "st_europa", first: "por toda europa desde escocia", concept: "a map of Europe with tunnel sites highlighted", query: ["map of europe sites highlighted", "europe map ancient sites"] },
  { name: "st_pasadizos", first: "pasadizos estrechos que conectan", concept: "a narrow stone-lined tunnel", query: ["narrow stone tunnel passage", "tight underground passage stone"] },
  { name: "st_datados", first: "han sido datados con una antiguedad", concept: "archaeologists dating an ancient tunnel", query: ["archaeology dating excavation", "scientists dating ancient site"] },
  { name: "st_edad", first: "estariamos hablando de la edad de piedra", concept: "Stone Age people, neolithic illustration", query: ["stone age people neolithic", "neolithic life illustration"] },
  { name: "st_docemil", first: "de hace unos doce mil", concept: "deep prehistoric time, ancient era concept", query: ["prehistoric era deep time", "ancient timeline concept dark"] },
  { name: "st_neolitico", first: "que pueblos del neolitico", concept: "a neolithic settlement of stone huts", query: ["neolithic settlement stone huts", "prehistoric village illustration"] },
  { name: "st_refugios", first: "eran refugios", concept: "people hiding inside a dark tunnel", query: ["people hiding in tunnel", "sheltering in cave dark"] },
  { name: "st_algo", first: "o eran algo que ni siquiera", concept: "a mysterious branching tunnel network in the dark", query: ["branching tunnel network dark", "maze of tunnels underground"] },
  { name: "st_cantidad", first: "la pura cantidad de tuneles", concept: "many tunnel entrances dotting a landscape, map", query: ["many tunnel entrances landscape", "tunnel sites map dots"] },

  // ── 2 · RAVNE (Bosnia) ──
  { name: "rv_intro", first: "numero dos volvemos al corazon", concept: "a forested hill in Bosnia, pyramid-shaped", query: ["forested hill bosnia pyramid", "green pyramid shaped hill"] },
  { name: "rv_sistema", first: "debajo de esa colina existe un sistema", concept: "an underground man-made tunnel system", query: ["underground tunnel system man made", "ravne tunnels bosnia"] },
  { name: "rv_pasadizos", first: "pasadizos hechos por el hombre", concept: "a rough man-made tunnel underground", query: ["rough man made tunnel", "dug tunnel underground dirt"] },
  { name: "rv_sellados", first: "rellenados y sellados con material", concept: "a tunnel filled and sealed with rock backfill", query: ["sealed filled tunnel rock", "blocked tunnel backfill"] },
  { name: "rv_bloques", first: "camaras con grandes bloques de piedra", concept: "large stone blocks inside a tunnel chamber", query: ["large stone blocks tunnel", "megalith block underground"] },
  { name: "rv_piramide", first: "la idea de que la colina entera", concept: "a pyramid-shaped hill, debated", query: ["pyramid shaped hill green", "bosnian pyramid hill"] },
  { name: "rv_tuneles", first: "pero los tuneles esos tuneles", concept: "a deep tunnel stretching into darkness for kilometers", query: ["deep tunnel kilometers dark", "long tunnel vanishing dark"] },
  { name: "rv_quien", first: "quien cavo todos esos kilometros", concept: "a tunnel disappearing into total darkness", query: ["tunnel into total darkness", "dark endless tunnel"] },

  // ── 1 · DERINKUYU (Turquía) ──
  { name: "dk_intro", first: "y llegamos al numero uno", concept: "the otherworldly rock landscape of Cappadocia", query: ["Cappadocia rock landscape turkey", "cappadocia fairy chimneys aerial"] },
  { name: "dk_capadocia", first: "estamos en turquia en la region", concept: "Cappadocia rock formations and cave dwellings", query: ["cappadocia rock formations caves", "cappadocia cave dwellings"] },
  { name: "dk_renovando", first: "un hombre estaba renovando su casa", concept: "a man renovating a house, breaking a wall", query: ["man renovating house wall", "breaking wall renovation"] },
  { name: "dk_pared", first: "al tirar abajo una pared", concept: "breaking through a wall revealing a hidden passage", query: ["hidden passage behind wall", "secret door revealed wall"] },
  { name: "dk_entrada", first: "la entrada a una ciudad subterranea", concept: "the entrance to an underground city, dark stairs down", query: ["underground city entrance stairs", "Derinkuyu entrance tunnel"] },
  { name: "dk_nombre", first: "la llamamos derinkuyu", concept: "Derinkuyu underground city carved passages", query: ["Derinkuyu underground city", "underground city turkey carved"] },
  { name: "dk_niveles", first: "desciende dieciocho niveles", concept: "deep vertical levels of an underground city", query: ["deep underground city levels", "vertical shaft underground city"] },
  { name: "dk_viviendas", first: "tiene viviendas establos", concept: "carved underground rooms and stables", query: ["underground carved rooms", "rock cut underground dwelling"] },
  { name: "dk_cocinas", first: "cocinas con chimeneas", concept: "an underground kitchen with a ventilation chimney", query: ["underground kitchen carved rock", "cave room ventilation shaft"] },
  { name: "dk_ventilacion", first: "un sistema de pozos de ventilacion", concept: "a deep ventilation shaft in an underground city", query: ["ventilation shaft underground city", "air shaft deep underground"] },
  { name: "dk_puertas", first: "enormes puertas circulares de piedra", concept: "a giant circular rolling stone door", query: ["giant round stone door", "rolling stone door cappadocia"] },
  { name: "dk_cerrar", first: "podian cerrarse desde adentro", concept: "a round stone door being rolled to seal a passage", query: ["rolling stone door close passage", "stone wheel door tunnel"] },
  { name: "dk_veintemil", first: "se calcula que derinkuyu podia albergar", concept: "the vast scale of an underground city, many rooms", query: ["vast underground city scale", "huge underground complex carved"] },
  { name: "dk_nosola", first: "y no esta sola", concept: "a map of many underground cities connected", query: ["underground cities map connected", "network underground cities"] },
  { name: "dk_respuesta", first: "la pregunta que sigue sin una respuesta", concept: "a dark deep underground tunnel, unanswered", query: ["dark deep underground tunnel", "mysterious underground passage"] },
  { name: "dk_escondian", first: "de que se escondian", concept: "people sheltering underground in fear, illustration", query: ["people sheltering underground fear", "hiding underground refuge illustration"] },
  { name: "dk_superficie", first: "que habia en la superficie", concept: "an ominous threat on the surface concept, dark sky", query: ["ominous threat surface dark sky", "danger coming concept ominous"] },
  { name: "dk_enterrada", first: "esa respuesta todavia esta enterrada", concept: "a sealed dark underground city, silent", query: ["sealed underground city dark", "silent empty underground city"] },

  // ── CIERRE ──
  { name: "cl_agujeros", first: "hemos bajado por siete agujeros", concept: "montage of tunnels and underground passages", query: ["tunnels montage underground", "cave passages compilation"] },
  { name: "cl_camara", first: "vimos una camara que moldea", concept: "the oracle chamber carved in rock", query: ["carved oracle chamber rock", "ancient stone room niche"] },
  { name: "cl_inframundo", first: "una entrada al inframundo", concept: "a dark sloping tunnel into the earth", query: ["dark sloping tunnel earth", "tunnel descending darkness"] },
  { name: "cl_biblioteca", first: "una leyenda de bibliotecas de metal", concept: "a deep jungle cave chamber", query: ["deep jungle cave chamber", "Tayos cave dark"] },
  { name: "cl_catedrales", first: "veinticuatro catedrales subterraneas", concept: "the giant Longyou carved caverns", query: ["Longyou carved cavern giant", "man made cave pillars"] },
  { name: "cl_continente", first: "una red de tuneles que cruza", concept: "a map of Europe tunnel network", query: ["europe tunnel network map", "map ancient tunnels europe"] },
  { name: "cl_sellados", first: "kilometros de pasadizos sellados", concept: "a sealed tunnel under a hill", query: ["sealed tunnel underground", "blocked passage rock"] },
  { name: "cl_ciudad", first: "una ciudad para veinte mil", concept: "Derinkuyu underground city vast", query: ["Derinkuyu underground city vast", "underground city carved turkey"] },
  { name: "cl_unaauna", first: "tomada de a una cada historia", concept: "a single dark tunnel", query: ["single dark tunnel", "lone cave passage"] },
  { name: "cl_patron", first: "pero todas juntas dibujan un patron", concept: "montage of underground sites worldwide", query: ["underground sites montage world", "caves tunnels compilation"] },
  { name: "cl_otravez", first: "una y otra vez en lugares", concept: "a world map with underground sites marked", query: ["world map sites marked dots", "global ancient sites map"] },
  { name: "cl_supiera", first: "como si supiera algo que nosotros", concept: "ancient people digging downward, illustration", query: ["ancient people digging down", "excavating into earth illustration"] },
  { name: "cl_pasado", first: "como si en algun momento del pasado", concept: "an ominous ancient sky over the earth, threat", query: ["ominous ancient sky concept", "dark threatening sky earth"] },
  { name: "cl_canal", first: "si llegaste hasta aca", concept: "a dramatic cinematic tunnel shot", query: ["cinematic tunnel dramatic", "epic underground passage"] },
  { name: "cl_puertas", first: "porque si los pueblos antiguos cavaron", concept: "a sealed ancient stone door", query: ["sealed ancient stone door", "closed rock door ancient"] },
  { name: "cl_otrolado", first: "que pusieron del otro lado", concept: "a mysterious locked ancient door, what's behind", query: ["mysterious locked ancient door", "sealed door curiosity dark"] },
  { name: "cl_proximo", first: "en el proximo viaje vamos a buscar", concept: "an ancient massive door that has never opened", query: ["ancient massive door closed", "giant sealed temple door"] },
  { name: "cl_acompanarme", first: "si queres acompanarme", concept: "an epic torch-lit tunnel vista", query: ["epic torch lit tunnel", "dramatic cave passage light"] },
  { name: "cl_suscribite", first: "suscribite a cronicas perdidas", concept: "a cinematic underground cavern", query: ["cinematic underground cavern", "epic cave interior dramatic"] },
  { name: "cl_curiosidad", first: "cuidate manten la curiosidad", concept: "a hopeful light at the end of a tunnel", query: ["light end of tunnel hopeful", "tunnel light glow calm"] },
  { name: "cl_final", first: "a veces la historia mas importante", concept: "final descent into a dark tunnel, silent", query: ["final descent dark tunnel", "dark tunnel silent end"] },
];

const TM = JSON.parse(fs.readFileSync("public/tuneles_timing.json", "utf8"));
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
fs.writeFileSync("public/broll/match_tuneles.json", JSON.stringify(match, null, 1));
fs.writeFileSync("src/VideoEdit/tuneles_cues.json", JSON.stringify(cues, null, 1));
console.log(`frases: ${PH.length} · ancladas: ${found}/${PH.length} · dur ~${END.toFixed(0)}s (${(END / 60).toFixed(1)} min)`);
console.log("→ match_tuneles.json + tuneles_cues.json");
