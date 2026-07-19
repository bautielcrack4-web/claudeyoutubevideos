// gen_vj7hqe8koadv.mjs — "Los 50 Sitios Más Misteriosos" (Crónicas Perdidas, AVATAR).
// El avatar real (HeyGen) se cortó a mitad de guion: cubre ~27 sitios y termina en
// "...la Jemer y la Maya" sin cierre. Este script arma el beatsheet ANCLADO a la
// transcripción REAL (Whisper), no al guion largo original, + agrega un cierre
// visual SILENCIOSO (sin voz nueva) al final: recap rápido + tarjeta de suscripción.
import fs from "fs";
const SLUG = "vj7hqe8koadv";
const AVATAR = `${SLUG}_opt.mp4`;
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/(\d)\.(\d{3})\b/g, "$1$2").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));
const at = (phrase, maxTok = 10) => {
  const t = norm(phrase).split(" ").filter(Boolean).slice(0, maxTok);
  for (let i = 0; i <= Wc.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return Wc[i].ms / 1000;
  }
  return null;
};
const atc = (p, m) => { const v = at(p, m); if (v == null) console.warn("⚠ anchor missing:", p.slice(0, 60)); return v; };
const LAST_MS = Wc[Wc.length - 1].e;
const REAL_END = +(LAST_MS / 1000 + 1.0).toFixed(2); // fin del audio real (avatar corta acá)
const TAIL = 11; // cierre visual silencioso agregado (sin voz nueva)
const TOTAL = +(REAL_END + TAIL).toFixed(2);

const P = (s) => `Realistic documentary photo, 16:9. ${s} Natural daylight, slightly imperfect handheld framing, muted colors, authentic travel-documentary look, no text, no watermark, no people looking at camera.`;

// ── RAW: un plano real/IA por momento concreto de la narración (ancla EXACTA tal como Whisper la transcribió) ──
const RAW = [
  ["hook_1", "hay un agujero en turkmenistan que lleva ardiendo desde 1971", "hook_darvaza1", P("A massive glowing orange gas crater burning at night in the middle of the desert, seen from a distance, smoke rising."), "amber"],
  ["hook_2", "los geologos que se acercaron al borde con trajes especiales", "hook_darvaza2", P("Two scientists in protective suits standing cautiously near the glowing edge of a huge burning crater at night."), "amber"],
  ["hook_3", "parece la boca de otra cosa no un pozo de gas", "hook_darvaza3", P("Extreme close-up of fire and flames glowing deep inside a circular crater in the desert at night."), "amber"],
  ["intro_1", "yo empece a interesarme en este tipo de lugares por un mapa viejo que tenia mi abuelo", "intro_mapa1", P("An old weathered hand-drawn map on a wooden desk, vintage ink annotations, warm lamp light, close up."), "amber"],
  ["intro_2", "lleno de anotaciones a mano en sitios que ni siquiera existian en los atlas normales", "intro_mapa2", P("Close up of handwritten notes and circles in ink on an antique paper map."), "amber"],
  ["intro_3", "hoy quiero llevarlos por 50 de esos lugares uno detras de otro", "intro_mundo", P("A vintage style world map with several pinned locations and a red route line connecting them."), "amber"],
  ["richat_1", "en medio del sahara resulto ser real", "richat_1", P("Vast golden Sahara desert sand dunes from above, endless and empty."), "amber"],
  ["richat_2", "se llama el ojo del sahara la estructura de richard", "richat_2", P("Aerial satellite view of the Richat Structure, concentric circular rock rings in the middle of the desert, Mauritania."), "amber"],
  ["richat_3", "y desde el aire parece un blanco de tiro perfecto casi 100 kilometros de anillos concentricos", "richat_3", P("Wide drone aerial shot of giant concentric desert rings, like a bullseye carved into the earth."), "amber"],
  ["richat_4", "durante anos se penso que era un crater de meteorito no lo es", "richat_4", P("Close up of exposed layered rock strata eroded in a desert landscape."), "amber"],
  ["stonehenge_1", "en inglaterra esta el mas famoso de todos stonehenge", "stonehenge_1", P("Stonehenge megalithic stone circle in England at sunrise, dramatic sky."), "amber"],
  ["stonehenge_2", "un circulo de piedras de varias toneladas cada una traidas desde canteras", "stonehenge_2", P("Massive gray standing stones close up, weathered texture, English countryside."), "amber"],
  ["stonehenge_3", "sin ruedas sin metal sin animales de carga como los conocemos hoy", "stonehenge_3", P("An illustration-like realistic scene of ancient people dragging a huge stone block on wooden logs and ropes."), "amber"],
  ["stonehenge_4", "alinearon exactamente esas piedras con la salida del sol del solsticio de verano", "stonehenge_4", P("The sun rising perfectly aligned between ancient standing stones, golden light, solstice."), "amber"],
  ["zimbabue_1", "mas al sur en zimbabue hay una ciudad de piedra", "zimbabue_1", P("Great Zimbabwe stone ruins, massive dry-stacked granite walls, aerial view, African savanna."), "blue"],
  ["zimbabue_2", "muros de granito apilados sin una sola gota de mortero algunos de mas de 10 metros de alto", "zimbabue_2", P("Close up of a tall dry-stone granite wall with no mortar, ancient African architecture, intricate stacking."), "blue"],
  ["nazca_1", "en peru hay algo parecido con las lineas de nazca", "nazca_1", P("Aerial view of giant line drawings etched into the desert floor of Peru, Nazca lines."), "amber"],
  ["nazca_2", "un colibri una arana o un mono de 300 metros de largo", "nazca_2", P("The Nazca hummingbird geoglyph seen from directly above, dry desert ground."), "amber"],
  ["nazca_3", "la gente que los dibujo nunca volo caminaban la linea entera paso a paso", "nazca_3", P("A lone tiny figure walking across a vast empty desert line, seen from far above."), "amber"],
  ["nazca_4", "eso para mi es mas inquietante que cualquier teoria extraterrestre", "nazca_4", P("A wide empty desert horizon at dusk, dramatic long shadows."), "amber"],
  ["atacama_1", "en el desierto de atacama en chile hay otros geoglifos gigantes", "atacama_1", P("Giant ancient geoglyphs of llama caravans carved into a hillside in the Atacama desert, Chile."), "amber"],
  ["atacama_2", "tan parecido a marte que la nasa prueba ahi sus vehiculos antes de mandarlos al espacio", "atacama_2", P("A red rocky Mars-like desert landscape with a small rover vehicle testing equipment."), "amber"],
  ["gobekli_1", "en turquia esta gobekli tepe y esto si les cambia la cabeza a los arqueologos", "gobekli_1", P("Gobekli Tepe ancient stone pillar site in Turkey, circular arrangement of carved megaliths."), "amber"],
  ["gobekli_2", "mas viejos que la rueda mas viejos que la escritura mas viejos que stonehenge", "gobekli_2", P("Close up of an ancient carved stone pillar with animal relief engravings."), "amber"],
  ["gobekli_3", "alguien decidio enterrar el sitio entero a proposito", "gobekli_3", P("Archaeologists carefully excavating a buried ancient stone structure with brushes and tools."), "amber"],
  ["newgrange_1", "en irlanda hay una tumba todavia mas vieja que stonehenge new grange", "newgrange_1", P("Newgrange ancient passage tomb mound in Ireland, white quartz stone facade, green hill."), "cold"],
  ["newgrange_2", "un rayo de sol entra exacto por una abertura sobre la puerta y camina hasta el fondo de esa camara", "newgrange_2", P("A thin beam of sunlight entering a dark ancient stone passage tomb corridor."), "cold"],
  ["carnac_1", "en francia en carnac hay casi", "carnac_1", P("Long rows of ancient standing stones stretching across a green field in Brittany, France."), "blue"],
  ["silbury_1", "en el sur de inglaterra esta silbury hill la colina artificial mas grande de europa", "silbury_1", P("Silbury Hill, a large grassy artificial mound rising from the English countryside, aerial view."), "blue"],
  ["rehook_1", "vamos apenas por una parte de la lista y ya se van a dar cuenta de un patron", "rehook_1", P("A hand tracing a route with a finger across an old paper map covered in pins."), "amber"],
  ["derinkuyu_1", "bajo la region de cappadocia hay ciudades enteras excavadas hacia abajo", "derinkuyu_1", P("Derinkuyu underground city, carved tunnels and rock chambers descending into darkness, Cappadocia Turkey."), "amber"],
  ["derinkuyu_2", "con establos bodegas capillas y puertas de piedras circulares que solo se podian cerrar desde adentro", "derinkuyu_2", P("A massive round flat stone disc used as an ancient door sealing a dark underground tunnel."), "amber"],
  ["derinkuyu_3", "la construyeron para esconderse de algo", "derinkuyu_3", P("A dark narrow underground stone corridor descending, lit by a single warm light."), "amber"],
  ["pumapunku_1", "esta puma punku un sitio en ruinas", "pumapunku_1", P("Puma Punku ruins, large precisely cut stone blocks scattered on high altitude Andean ground, Bolivia."), "cold"],
  ["pumapunku_2", "cortados con angulos rectos tan precisos que parecen hechos con maquina", "pumapunku_2", P("Close up of a perfectly cut stone block with sharp right angle edges and grooves."), "cold"],
  ["pumapunku_3", "como si varias generaciones hubieran intentado terminar algo que nunca lograron completar del todo", "pumapunku_3", P("Scattered ancient stone blocks of different finishing styles lying unfinished on rocky ground."), "cold"],
  ["machupicchu_1", "no muy lejos esta machu picchu la ciudadela inca escondida entre montanas", "machupicchu_1", P("Machu Picchu Inca citadel among green misty mountains at sunrise, wide aerial view."), "blue"],
  ["machupicchu_2", "las piedras de sus muros encajan tan perfecto que ni una hoja de afeitar entra en las juntas", "machupicchu_2", P("Close up of an Inca stone wall with perfectly fitted polygonal stones, no mortar visible."), "blue"],
  ["machupicchu_3", "resistio terremotos que tumbaron construcciones coloniales hechas siglos despues", "machupicchu_3", P("An ancient stone wall standing intact beside cracked modern colonial ruins."), "blue"],
  ["sacsayhuaman_1", "en cusco la capital del imperio esta sacsayhuaman con bloques de piedra caliza de mas de 100 toneladas", "sacsayhuaman_1", P("Sacsayhuaman massive zigzag stone walls made of huge fitted boulders, Cusco Peru."), "blue"],
  ["tiwanaku_1", "cerca del lago titicaca esta tiwanaku una ciudad que llego a tener decenas de miles de habitantes", "tiwanaku_1", P("Tiwanaku ruins with the carved stone Gate of the Sun monolith, high altitude plain, Bolivia."), "cold"],
  ["yonaguni_1", "frente a la isla de yonaguni en japon hay una formacion rocosa con escalones", "yonaguni_1", P("Underwater rock formation with straight stepped edges and terraces, clear blue ocean water, Japan."), "cold"],
  ["yonaguni_2", "otros insisten en que no hay manera de que la naturaleza sola produzca esas terrazas perfectas", "yonaguni_2", P("A diver exploring underwater stepped stone terraces in clear turquoise water."), "cold"],
  ["bimini_1", "algo parecido pasa con el camino de bimini en las bahamas una hilera de bloques de piedra caliza bajo el agua", "bimini_1", P("Bimini Road, underwater rectangular flat stone blocks arranged like a road, shallow turquoise water."), "cold"],
  ["bermuda_1", "esta justo dentro del area que la gente bautizo triangulo de las bermudas", "bermuda_1", P("A stormy dark ocean seen from above, dramatic clouds over open Atlantic water."), "cold"],
  ["bermuda_2", "las estadisticas dicen que no hay mas desapariciones ahi que en cualquier otra ruta maritima", "bermuda_2", P("A cargo ship sailing through open ocean under a cloudy sky, wide shot."), "cold"],
  ["baltico_1", "en el fondo del mar baltico entre suecia y finlandia un equipo de buceadores encontro en el sonar una formacion circular", "baltico_1", P("A sonar scan screen showing a mysterious large circular shape on the dark seafloor."), "cold"],
  ["pascua_1", "sigamos con la isla de pascua ahi los moai no son solo cabezas", "pascua_1", P("Easter Island Moai stone statues standing in a row against the sky, some buried to the neck."), "amber"],
  ["pascua_2", "del misterio de como caminaron esas estatuas de varias toneladas hasta su posicion final", "pascua_2", P("A row of large Moai statues on a grassy coastal hill, Easter Island."), "amber"],
  ["pascua_3", "la civilizacion que las tallo colapso probablemente por haber talado cada arbol de la isla", "pascua_3", P("A barren treeless volcanic island landscape with rolling green hills, no trees."), "amber"],
  ["malta_1", "en malta hay templos incluso mas viejos que las piramides de egipto", "malta_1", P("Ancient megalithic limestone temple ruins in Malta, large curved stone blocks."), "amber"],
  ["nanmadol_1", "en micronesia esta nan madol un conjunto de casi 100 islotes artificiales", "nanmadol_1", P("Nan Madol ruins, tall basalt log walls rising from shallow water among small jungle islets, Micronesia."), "blue"],
  ["skarabrae_1", "en escocia en las islas orcadas el viento descubrio por accidente un pueblo entero enterrado bajo la arena", "skarabrae_1", P("Skara Brae ancient stone village ruins on a green coastal cliff in Scotland, stone huts."), "cold"],
  ["longyou_1", "en china cerca de la ciudad de longyu unos pescadores vaciaron unos estanques", "longyou_1", P("Longyou caves, massive man-made underground stone cavern with parallel chisel marks on the walls, warm lighting."), "amber"],
  ["mohenjodaro_1", "en pakistan esta mohenjo daro una de las ciudades mas antiguas y mejor planificadas", "mohenjodaro_1", P("Mohenjo-daro ancient city ruins, brick walls and streets laid out in a grid, dusty excavation site."), "amber"],
  ["gunungpadang_1", "en indonesia en la montana de gunung padang hay una estructura escalonada de terrazas de piedra", "gunungpadang_1", P("Gunung Padang stepped stone terraces on a misty jungle hillside, Indonesia."), "blue"],
  ["rehook_2", "ya llevamos como 20 lugares y todavia nos queda selva hielo y desierto por recorrer", "rehook_2", P("A dense green jungle canopy seen from above with mist rising between the trees."), "blue"],
  ["angkor_1", "en camboya la selva se trago angkor durante siglos", "angkor_1", P("Angkor temple ruins in Cambodia covered by giant tree roots growing over the stone walls, jungle."), "blue"],
  ["angkor_2", "templos de piedra tan grandes como una ciudad quedaron cubiertos por raices de arboles gigantes", "angkor_2", P("Massive tree roots wrapping over an ancient stone temple wall, close up, Ta Prohm style."), "blue"],
  ["angkor_3", "la gente local siempre supo que estaba ahi nunca se habia perdido para ellos", "angkor_3", P("A local person walking calmly along an ancient jungle temple path, wide shot, back to camera."), "blue"],
  ["jemermaya_1", "en camboya y en mexico coinciden en algo curioso ambas civilizaciones perdidas la jemer y la maya", "jemermaya_1", P("A split feeling wide shot of an overgrown ancient stone pyramid rising from dense jungle."), "blue"],
];

// ── COMPONENTES (variedad — plan del DIRECTOR) ───────────────────────────────
const COMP = [
  { id: "c_darvaza_stat", at: "hay un agujero en turkmenistan que lleva ardiendo desde 1971", dur: 5.4, kind: "numcard", hue: "amber",
    number: "55", name: "años ardiendo sin parar", bg: "img/hook_darvaza1.png", eyebrow: "Cráter de Darvaza · Turkmenistán", total: "desde 1971",
    gen: { type: "image", name: "hook_darvaza1", prompt: P("A massive glowing orange gas crater burning at night in the middle of the desert, seen from a distance, smoke rising.") } },
  { id: "c_richat_map", at: "se llama el ojo del sahara la estructura de richard", dur: 6, kind: "mapzoom", hue: "amber",
    image: "img/richat_2.png", pinX: 0.42, pinY: 0.5, label: "Estructura de Richat · Mauritania", eyebrow: "El Ojo del Sahara", zoom: 1.15,
    gen: { type: "image", name: "richat_2", prompt: P("Aerial satellite view of the Richat Structure, concentric circular rock rings in the middle of the desert, Mauritania.") } },
  { id: "c_richat_stat", at: "y desde el aire parece un blanco de tiro perfecto casi 100 kilometros de anillos concentricos", dur: 5.2, kind: "numcard", hue: "amber",
    number: "100", name: "km de anillos concéntricos", bg: "img/richat_3.png", eyebrow: "Escala real", total: "en pleno desierto" },
  { id: "c_stonehenge_bars", at: "traidas desde canteras a mas de 200 kilometros de distancia sin ruedas sin metal", dur: 6.4, kind: "bars", hue: "amber",
    title: "Cómo movieron piedras de varias toneladas", eyebrow: "Stonehenge, Inglaterra",
    bars: [{ label: "Distancia recorrida", value: 200, display: "200 km" }, { label: "Ruedas disponibles", value: 0 }, { label: "Metal disponible", value: 0 }, { label: "Animales de carga", value: 0 }] },
  { id: "c_zimbabue_vs", at: "muros de granito apilados sin una sola gota de mortero algunos de mas de 10 metros de alto", dur: 6.2, kind: "vs", hue: "blue",
    title: "Sin una gota de mortero", eyebrow: "Gran Zimbabue",
    left: { label: "Gran Zimbabue", value: "800 años en pie", sub: "granito apilado a seco, sin una gota de mortero", good: true },
    right: { label: "Construcción moderna", value: "necesita mortero", sub: "y refuerzo estructural para durar", good: false } },
  { id: "c_nazca_num", at: "un colibri una arana o un mono de 300 metros de largo", dur: 5.6, kind: "numcard", hue: "amber",
    number: "300", name: "metros de largo", bg: "img/nazca_2.png", eyebrow: "Líneas de Nazca", total: "solo se entiende desde el aire" },
  { id: "c_gobekli_bars", at: "mas viejos que la rueda mas viejos que la escritura mas viejos que stonehenge", dur: 6.6, kind: "bars", hue: "amber",
    title: "Qué es más viejo que Göbekli Tepe", eyebrow: "Turquía · 6.000 años antes que Stonehenge", unit: "años atrás",
    bars: [{ label: "Göbekli Tepe", value: 11600 }, { label: "La rueda", value: 6000 }, { label: "La escritura", value: 5200 }, { label: "Stonehenge", value: 5000 }] },
  { id: "c_newgrange_aged", at: "un rayo de sol entra exacto por una abertura sobre la puerta y camina hasta el fondo de esa camara", dur: 6.6, kind: "aged", hue: "cold",
    heading: "Newgrange, Irlanda", eyebrow: "Una sola vez al año", image: "img/newgrange_2.png",
    lines: [{ text: "Cámara de piedra sellada" }, { text: "Solsticio de invierno: el sol entra exacto", mark: true }, { text: "Construida hace más de 5.000 años" }],
    gen: { type: "image", name: "newgrange_2", prompt: P("A thin beam of sunlight entering a dark ancient stone passage tomb corridor.") } },
  { id: "c_derinkuyu_process", at: "con establos bodegas capillas y puertas de piedras circulares que solo se podian cerrar desde adentro", dur: 7.2, kind: "process", hue: "amber",
    title: "Derinkuyu, ciudad bajo tierra", eyebrow: "Capadocia, Turquía",
    steps: [{ title: "Entrada", desc: "un pozo angosto en la superficie" }, { title: "Establos y bodegas", desc: "los primeros niveles" }, { title: "Capillas", desc: "más abajo todavía" }, { title: "Puerta circular", desc: "se cerraba solo desde adentro" }] },
  { id: "c_pumapunku_vs", at: "cortados con angulos rectos tan precisos que parecen hechos con maquina", dur: 6, kind: "vs", hue: "cold",
    title: "Precisión imposible", eyebrow: "Puma Punku, Bolivia",
    left: { label: "El corte de los bloques", value: "ángulos rectos tipo máquina", sub: "precisión casi milimétrica", good: false },
    right: { label: "Herramientas de la época", value: "sin metales duros", sub: "ni herramientas de precisión conocidas", good: false } },
  { id: "c_machupicchu_num", at: "las piedras de sus muros encajan tan perfecto que ni una hoja de afeitar entra en las juntas", dur: 5.4, kind: "numcard", hue: "blue",
    number: "0", name: "mm entre bloques", bg: "img/machupicchu_2.png", eyebrow: "Machu Picchu, Perú", total: "sin argamasa" },
  { id: "c_sacsayhuaman_num", at: "con bloques de piedra caliza de mas de 100 toneladas cada uno", dur: 5.6, kind: "numcard", hue: "blue",
    number: "100+", name: "toneladas por bloque", bg: "img/sacsayhuaman_1.png", eyebrow: "Sacsayhuamán, Cusco", total: "cuesta arriba, sin explicación" },
  { id: "c_yonaguni_vs", at: "otros insisten en que no hay manera de que la naturaleza sola produzca esas terrazas perfectas", dur: 6.4, kind: "vs", hue: "cold",
    title: "¿Natural o construido?", eyebrow: "Monumento de Yonaguni, Japón",
    left: { label: "Hipótesis natural", value: "arenisca que se fractura sola", sub: "así lo explican algunos geólogos", good: true },
    right: { label: "Hipótesis artificial", value: "terrazas demasiado perfectas", sub: "para ser puro azar geológico", good: false } },
  { id: "c_bermuda_stat", at: "las estadisticas dicen que no hay mas desapariciones ahi que en cualquier otra ruta maritima", dur: 5.8, kind: "stat", hue: "cold",
    value: 0, prefix: "+", suffix: "% extra", label: "desapariciones vs. otras rutas marítimas", eyebrow: "Triángulo de las Bermudas", accent: "cold" },
  { id: "c_pascua_chips", at: "del misterio de como caminaron esas estatuas de varias toneladas hasta su posicion final", dur: 5.6, kind: "chips", hue: "amber",
    bg: "image", image: "img/pascua_2.png", title: "Los Moái de Isla de Pascua", chips: ["cuerpo enterrado hasta el cuello", "varias toneladas cada uno", "isla sin un solo árbol"],
    gen: { type: "image", name: "pascua_2", prompt: P("A row of large Moai statues on a grassy coastal hill, Easter Island.") } },
  { id: "c_asia_split", at: "en pakistan esta mohenjo daro una de las ciudades mas antiguas y mejor planificadas", dur: 6.4, kind: "splitlist", hue: "amber",
    title: "Tres sitios, un mismo misterio", palette: "A",
    items: ["Longyou (China): cuevas talladas sin un solo registro histórico", "Mohenjo-Daro (Pakistán): cañerías más avanzadas que ciudades de hace un siglo", "Gunung Padang (Indonesia): antigüedad todavía en discusión"] },
  { id: "c_nazca_quote", at: "eso para mi es mas inquietante que cualquier teoria extraterrestre", dur: 5.8, kind: "quote", hue: "amber",
    image: "img/nazca_3.png", eyebrow: "Líneas de Nazca", text: "Alguien que dedica su vida a un *dibujo* que nunca va a poder *mirar*.", accent: "amber", fontSize: 92 },
  { id: "c_cierre_journey", at: "en camboya y en mexico coinciden en algo curioso ambas civilizaciones perdidas la jemer y la maya", dur: 7, kind: "journey", hue: "blue", dark: true,
    eyebrow: "El recorrido sigue", title: "De Angkor a las ruinas Maya",
    gen: { type: "image", name: "jemermaya_1", prompt: P("A split feeling wide shot of an overgrown ancient stone pyramid rising from dense jungle.") },
    waypoints: [
      { x: 0.28, y: 0.42, z: 0, image: "img/angkor_1.png", label: "Angkor, Camboya", num: "1", dwell: 2.6, travel: 1.6 },
      { x: 0.72, y: 0.55, z: 0.3, image: "img/jemermaya_1.png", label: "Ruinas Maya, México", num: "2", dwell: 2.6, travel: 1.6 },
    ] },
  { id: "c_nazca_checklist", at: "la gente que los dibujo nunca volo caminaban la linea entera paso a paso", dur: 5.6, kind: "checklist", hue: "amber",
    title: "Las figuras de Nazca", items: [{ text: "Un colibrí de decenas de metros" }, { text: "Una araña gigante" }, { text: "Un mono de 300 metros de largo" }],
    gen: { type: "image", name: "nazca_3", prompt: P("A lone tiny figure walking across a vast empty desert line, seen from far above.") } },
  { id: "c_newgrange_num", at: "en irlanda hay una tumba todavia mas vieja que stonehenge new grange", dur: 5.4, kind: "numcard", hue: "cold",
    number: "5000", name: "años de precisión astronómica", bg: "img/newgrange_1.png", eyebrow: "Newgrange, Irlanda", total: "más vieja que Stonehenge",
    gen: { type: "image", name: "newgrange_1", prompt: P("Newgrange ancient passage tomb mound in Ireland, white quartz stone facade, green hill.") } },
  { id: "c_tiwanaku_map", at: "cerca del lago titicaca esta tiwanaku una ciudad que llego a tener decenas de miles de habitantes", dur: 5.8, kind: "mapzoom", hue: "cold",
    image: "img/tiwanaku_1.png", pinX: 0.3, pinY: 0.62, label: "Tiwanaku · Bolivia", eyebrow: "A orillas del lago Titicaca", zoom: 1.1,
    gen: { type: "image", name: "tiwanaku_1", prompt: P("Tiwanaku ruins with the carved stone Gate of the Sun monolith, high altitude plain, Bolivia.") } },
  { id: "c_malta_bars", at: "en malta hay templos incluso mas viejos que las piramides de egipto", dur: 6, kind: "bars", hue: "amber",
    title: "Más viejos que las pirámides", eyebrow: "Templos de Malta", unit: "años de antigüedad",
    bars: [{ label: "Templos de Malta", value: 5600 }, { label: "Pirámides de Egipto", value: 4500 }, { label: "Stonehenge", value: 5000 }],
    gen: { type: "image", name: "malta_1", prompt: P("Ancient megalithic limestone temple ruins in Malta, large curved stone blocks.") } },
  { id: "c_skarabrae_quote", at: "en escocia en las islas orcadas el viento descubrio por accidente un pueblo entero enterrado bajo la arena", dur: 5.8, kind: "quote", hue: "cold",
    image: "img/skarabrae_1.png", eyebrow: "Skara Brae, Escocia", text: "Una *tormenta* de 1850 mostró en un día lo que nadie había visto en *miles de años*.", accent: "cold", fontSize: 88,
    gen: { type: "image", name: "skarabrae_1", prompt: P("Skara Brae ancient stone village ruins on a green coastal cliff in Scotland, stone huts.") } },
  { id: "c_angkor_process", at: "templos de piedra tan grandes como una ciudad quedaron cubiertos por raices de arboles gigantes", dur: 6.6, kind: "process", hue: "blue",
    title: "Cómo la selva se comió Angkor", eyebrow: "Camboya",
    steps: [{ title: "Semilla", desc: "cae sobre la piedra del templo" }, { title: "Raíz", desc: "se cuela entre las juntas" }, { title: "Crecimiento", desc: "la raíz se vuelve tronco" }, { title: "Fusión", desc: "el árbol es parte del muro" }],
    gen: { type: "image", name: "angkor_2", prompt: P("Massive tree roots wrapping over an ancient stone temple wall, close up, Ta Prohm style.") } },
  { id: "c_nanmadol_chips", at: "en micronesia esta nan madol un conjunto de casi 100 islotes artificiales", dur: 5.6, kind: "chips", hue: "blue",
    bg: "image", image: "img/nanmadol_1.png", title: "Nan Madol, Micronesia", chips: ["casi 100 islotes artificiales", "columnas de basalto de toneladas", "la 'ciudad de los espíritus'"],
    gen: { type: "image", name: "nanmadol_1", prompt: P("Nan Madol ruins, tall basalt log walls rising from shallow water among small jungle islets, Micronesia.") } },
  { id: "c_atacama_num", at: "en el desierto de atacama en chile hay otros geoglifos gigantes", dur: 5.4, kind: "numcard", hue: "amber",
    number: "1000+", name: "años de antigüedad", bg: "img/atacama_1.png", eyebrow: "Geoglifos de Atacama", total: "marcando rutas comerciales",
    gen: { type: "image", name: "atacama_1", prompt: P("Giant ancient geoglyphs of llama caravans carved into a hillside in the Atacama desert, Chile.") } },
  { id: "c_baltico_map", at: "en el fondo del mar baltico entre suecia y finlandia un equipo de buceadores encontro en el sonar una formacion circular", dur: 5.8, kind: "mapzoom", hue: "cold",
    image: "img/baltico_1.png", pinX: 0.55, pinY: 0.35, label: "Anomalía del Báltico", eyebrow: "Entre Suecia y Finlandia", zoom: 1.1,
    gen: { type: "image", name: "baltico_1", prompt: P("A sonar scan screen showing a mysterious large circular shape on the dark seafloor.") } },
  { id: "c_bimini_aged", at: "algo parecido pasa con el camino de bimini en las bahamas una hilera de bloques de piedra caliza bajo el agua", dur: 6, kind: "aged", hue: "cold",
    heading: "Camino de Bimini, Bahamas", eyebrow: "Bajo el agua", image: "img/bimini_1.png",
    lines: [{ text: "Bloques rectangulares bajo el agua" }, { text: "Parece una calle empedrada", mark: true }, { text: "La mayoría de los geólogos: formación natural" }],
    gen: { type: "image", name: "bimini_1", prompt: P("Bimini Road, underwater rectangular flat stone blocks arranged like a road, shallow turquoise water.") } },
  { id: "c_derinkuyu_quote", at: "la construyeron para esconderse de algo", dur: 5, kind: "quote", hue: "amber",
    image: "img/derinkuyu_3.png", eyebrow: "Derinkuyu, Turquía", text: "La construyeron para *esconderse* de algo.", accent: "amber", fontSize: 96,
    gen: { type: "image", name: "derinkuyu_3", prompt: P("A dark narrow underground stone corridor descending, lit by a single warm light.") } },
  { id: "c_angkor_quote", at: "la gente local siempre supo que estaba ahi nunca se habia perdido para ellos", dur: 5.4, kind: "quote", hue: "blue",
    image: "img/angkor_3.png", eyebrow: "Angkor, Camboya", text: "Nunca se había *perdido* para ellos.", accent: "accent", fontSize: 92,
    gen: { type: "image", name: "angkor_3", prompt: P("A local person walking calmly along an ancient jungle temple path, wide shot, back to camera.") } },
];

// ── construir beats RAW ──────────────────────────────────────────────────────
const rawBeats = [];
for (const [id, phrase, img, prompt, hue] of RAW) {
  const t = atc(phrase);
  if (t == null) continue;
  rawBeats.push({ id, start: +t.toFixed(2), kind: "raw", src: `img/${img}.png`, hue, darken: 0.14,
    gen: { type: "image", name: img, prompt } });
}
rawBeats.sort((a, b) => a.start - b.start);
for (let i = 0; i < rawBeats.length; i++) {
  const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : REAL_END;
  rawBeats[i].dur = +Math.max(1.2, next - rawBeats[i].start + 0.3).toFixed(2);
}

// ── construir beats COMPONENTE (reemplazan el raw de ese instante, se paran encima) ──
const compBeats = [];
for (const c of COMP) {
  const t = atc(c.at);
  if (t == null) continue;
  const { id, at: _at, dur, kind, ...props } = c;
  compBeats.push({ id, start: +t.toFixed(2), dur, kind, ...props });
}

// los componentes "pisan" el raw que ocupaba ese instante (evita 2 planos simultáneos)
const compRanges = compBeats.map((c) => [c.start, c.start + c.dur]);
const rawFiltered = rawBeats.filter((r) => !compRanges.some(([s, e]) => r.start < e - 0.15 && r.start + r.dur > s + 0.15) || compRanges.every(([s, e]) => Math.abs(r.start - s) > 0.05));
// (más simple y seguro: descartar raw cuyo START cae DENTRO de un rango de componente)
const rawFinal = rawBeats.filter((r) => !compRanges.some(([s, e]) => r.start >= s - 0.05 && r.start < e - 0.05));

// re-tiling: los RAW se auto-tilean para llegar justo hasta el próximo beat (como antes).
// ★ FIX (bug detectado por el AUDITOR): los COMPONENTES NUNCA estiran su dur — se
// quedaban en pantalla decenas de segundos de más (hasta el próximo beat sobreviviente),
// desincronizados de la narración que ya había avanzado a otro sitio. Ahora cada comp
// dura EXACTO lo que se lo authoreó, y el cursor avanza en serie: si el beat siguiente
// (raw o comp) estaba anclado ANTES de que el actual termine, se corre apenas al frente
// (J-cut leve, nunca atrás) — nunca se pisan dos planos ni queda un componente clavado.
const timeline = [...rawFinal.map((r) => ({ ...r, _t: "raw" })), ...compBeats.map((c) => ({ ...c, _t: "comp" }))].sort((a, b) => a.start - b.start);
{
  let cursor = 0;
  for (let i = 0; i < timeline.length; i++) {
    const b = timeline[i];
    const anchored = b.start;
    const displayStart = Math.max(anchored, cursor);
    const nextAnchored = i + 1 < timeline.length ? timeline[i + 1].start : REAL_END;
    const dur = b._t === "comp" ? b.dur : Math.max(1.2, nextAnchored - displayStart + 0.3);
    b.start = +displayStart.toFixed(2);
    b.dur = +dur.toFixed(2);
    cursor = displayStart + dur;
    delete b._t;
  }
}

// ── CIERRE SILENCIOSO (sin voz nueva): recap rápido + tarjeta de suscripción ─
const closingImgs = ["hook_darvaza1", "stonehenge_1", "nazca_1", "machupicchu_1", "angkor_1"];
const closingBeats = [];
const lastEnd = timeline.length ? timeline[timeline.length - 1].start + timeline[timeline.length - 1].dur : REAL_END;
let cursor = Math.max(REAL_END, lastEnd);
for (const img of closingImgs) {
  closingBeats.push({ id: `close_${img}`, start: +cursor.toFixed(2), dur: 1.3, kind: "raw", src: `img/${img}.png`, hue: "amber", darken: 0.35, noSplit: true });
  cursor += 1.3;
}
closingBeats.push({
  id: "close_card", start: +cursor.toFixed(2), dur: +(TOTAL - cursor).toFixed(2), kind: "headline", hue: "amber",
  bg: "image", image: "img/hook_darvaza1.png", eyebrow: "Quedan muchos lugares más en el mapa",
  tokens: [{ t: "Seguí" }, { t: "el" }, { t: "mapa" }, { t: "—" }, { t: "suscribite", hl: true }],
});

const beats = [...timeline, ...closingBeats];

// duplicados de id (sanity)
{ const seen = new Map(); for (const b of beats) seen.set(b.id, (seen.get(b.id) || 0) + 1); const dups = [...seen.entries()].filter(([, c]) => c > 1); if (dups.length) { console.error("✖ ids repetidos:", dups); process.exit(1); } }

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, maxRawDur: 6, total: TOTAL, beats }, null, 1));
console.log(`beats ${beats.length} (raw ${rawFinal.length} · comp ${compBeats.length} · cierre ${closingBeats.length}) · REAL_END ${REAL_END}s · TOTAL ${TOTAL}s`);

// ── AVATAR WINDOWS (full ↔ hidden, sin PiP de esquina) ───────────────────────
// Usa el timeline YA REACOMODADO (start/dur finales, post cursor-fix) — no los
// anchors originales — para que las ventanas de avatar coincidan con lo que
// realmente se ve en pantalla.
// comps = rangos que DEBEN verse (componentes gráficos) → avatar hidden ahí.
// El resto (planos raw = b-roll genérico) son candidatos a full-avatar (variedad).
const timelineRaw = timeline.filter((b) => b.kind === "raw");
const timelineComp = timeline.filter((b) => b.kind !== "raw");
const comps2 = timelineComp.map((c) => [c.start, c.start + c.dur]);
const overlapsComp = (a, b) => comps2.some(([s, e]) => a < e && b > s);
const snapWord = (tt) => { for (const c of caps) if (c.startMs / 1000 >= tt - 0.05) return c.startMs / 1000; return tt; };
const HOOK_END = 11, PERIOD = 22, SLOT = 4.5, SEARCH = 16;
const fulls = [[0, snapWord(HOOK_END)]];
for (const r of timelineRaw) {
  if (/^(intro_|rehook_)/.test(r.id)) continue; // dejamos esos como visual (mapa/transición)
  const s = r.start, e = snapWord(s + 4);
  if (e - s >= 2 && !overlapsComp(s, e)) fulls.push([+s.toFixed(2), e]);
}
for (let target = HOOK_END + PERIOD; target < REAL_END - 10; target += PERIOD) {
  for (let t = target; t < target + SEARCH; t += 0.5) {
    const s = snapWord(t), e = snapWord(s + SLOT);
    if (e - s >= 3 && e - s <= 6 && !overlapsComp(s, e)) { fulls.push([s, e]); break; }
  }
}
fulls.sort((a, b) => a[0] - b[0]);
// merge overlaps + descartar los que se superponen entre sí, tomando 1 cada ~6s min
const merged = [];
for (const f of fulls) { if (!merged.length || f[0] > merged[merged.length - 1][1] + 0.3) merged.push(f); }
const windows = [];
let cur = 0;
for (const [s, e] of merged) {
  if (s > cur + 0.2) windows.push({ start: +cur.toFixed(2), mode: "hidden" });
  windows.push({ start: +s.toFixed(2), mode: "full" });
  cur = e;
}
if (cur < REAL_END - 0.1) windows.push({ start: +cur.toFixed(2), mode: "hidden" });
windows.push({ start: REAL_END, mode: "hidden" }); // cierre silencioso: avatar afuera
if (windows[0].start !== 0) windows.unshift({ start: 0, mode: windows[0].mode });

fs.writeFileSync(
  `src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`
);
console.log(`avatar windows: ${windows.length} (full: ${windows.filter((w) => w.mode === "full").length})`);
