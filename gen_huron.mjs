// gen_huron.mjs — documental "El hurón de patas negras" (faceless, voz clonada).
// CLIP-DRIVEN + SYNC POR FRASE: cada toma se ancla (atMs) al ms EXACTO en que el narrador
// dice esa idea, y muestra literalmente eso. Componentes = puntuación encima del video.
// Stock 4K (Pexels) con prioridad en paisaje/ciencia. Emite beatsheet/huron.json.
import fs from "fs";
const fexists = (p) => fs.existsSync(`public/${p}`);
const img = (name) => `img/${name}.png`;

const P = (s) => `Foto documental real, 16:9 horizontal apaisado. ${s} Como un fotograma de un documental viejo de naturaleza: con imperfecciones, luz natural despareja, saturación baja, nada pulido, sin apariencia de IA.`;
const DP = (s) => `Infografía horizontal, relación de aspecto EXACTA 16:9 (1792x1024). Ilustración hecha a mano profesional, limpia, editorial, tipo lámina de historia natural antigua. ${s} Fondo marfil claro con textura de papel sutil, líneas marrón oscuro, acentos verde oliva y terracota apagado, papel envejecido. Minimalista, muy clara, se entiende en un segundo. Textos en español, breves.`;
const MP = (s) => `Mapa ilustrado vintage, estilo cartografía de atlas antiguo, 16:9 horizontal apaisado. ${s} Papel de mapa envejecido color crema, líneas de tinta marrón, relieve y ríos suaves, una pequeña rosa de los vientos, hermoso y detallado, sin texto ilegible.`;

// rc = clip de relleno anclado. rc(name, {atMs, kicker, hold, w})
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

const HUES = ["amber", "red", "blue"];
const W = { raw: 1.2, rc: 1.0, quote: 1.0, headline: 0.95, stat: 0.95, aged: 1.05, checklist: 1.05,
  splitlist: 1.0, bars: 1.1, process: 1.3, journey: 2.6, infzoom: 1.1, annotated: 1.2, callout: 1.0, chips: 0.95 };

// ── SECCIONES — cada beat anclado (atMs) a la oración que ilustra (de captions) ──────
const S = [
  { key: "intro", start: 0.2, fb: "hu_pradera_noche", beats: [
    rc("cv_sunset_prairie", { hold: true, w: 1.0, kicker: "Una noche fría de septiembre" }), // 0.2
    rc("st_ranch", { at: "en un rancho perdido entre las", kicker: "Un rancho en las llanuras de Wyoming" }), // ~2.5
    rc("st_dusk_field", { atMs: 5.4, kicker: "La familia ya dormía" }),               // 5.4
    rc("cv_grass_wind", { atMs: 6.8, kicker: "El viento barría la hierba seca" }),     // 6.8
    rc("cv_night_stars", { at: "bajo un cielo enorme cargado", kicker: "Un cielo cargado de estrellas" }), // ~9
    rc("cv_ranch_dog", { atMs: 11.5, kicker: "El perro empezó a ladrar" }),           // 11.5
    rc("st_dog_farm", { atMs: 13.6, kicker: "No era un ladrido cualquiera" }),        // 13.6
    rc("cv_grass_wind", { atMs: 15.7, kicker: "Un ladrido tenso, insistente" }),      // 15.7
    rc("cv_ferret_eyeshine", { atMs: 21.3, kicker: "Algo que no debería estar ahí" }),// 21.3
    r("hu_porche_cuerpo", "Sobre las tablas de un porche al amanecer, un pequeño animal alargado sin vida, luz fría", { atMs: 25.5, hold: true, w: 0.9 }),
    c("quote", { text: "Su perro lo había dejado ahí, como un *regalo*." }, ["hu_perro_mira", "Un perro de campo sentado en un porche mirando a cámara"]), // 34.7
    rc("cv_ferret_body", { at: "Era un animal alargado del tamaño", kicker: "Del tamaño de una comadreja" }), // 38.7
    rc("cv_ferret_face", { at: "una mascara negra sobre los ojos", hold: true, kicker: "Una máscara negra, como un ladrón" }), // ~45
    rc("st_hands_animal", { at: "Lo levanto le dio vueltas", kicker: "Le dio vueltas entre las manos" }), // 52.9
    rc("cv_ferret_face", { atMs: 59.7, kicker: "Ese rostro enmascarado lo detuvo" }), // 59.7
    rc("hu_taxidermista", { at: "sugirio llevarlo al pueblo al", kicker: "Al taxidermista del pueblo" }), // 62.7
    rc("st_lab_blue", { atMs: 73.5, kicker: "Sacudir al mundo de la ciencia" }),       // 73.5
    rc("cv_ferret_night", { atMs: 83.5, kicker: "Una especie ya dada por extinguida" }), // 83.5
  ] },
  { key: "regreso", start: 92.6, fb: "hu_huron_ojos", beats: [
    rc("cv_ferret_eyeshine", { hold: true }),                                          // 92.6 había desaparecido
    c("headline", { tokens: ["Regresó", "de", "entre", "los", { t: "muertos" }], eyebrow: "Y acababa de", bg: "image" }, ["hu_huron_pasto", "Un hurón de patas negras entre el pasto al atardecer"]), // 95.4
    rc("cv_archival_prairie", { atMs: 98.5, kicker: "Tenemos que retroceder" }),       // 98.5
    rc("cv_ferret_portrait", { atMs: 102.8, kicker: "Una de las tragedias silenciosas más grandes" }), // 102.8
  ] },
  { key: "quien", start: 110.3, fb: "hu_huron_retrato", beats: [
    rc("cv_ferret_body", { kicker: "El único hurón nativo de América", hold: true }), // 110.3
    mapimg("hu_map_rango", "Mapa de Norteamérica y las Grandes Llanuras centrales, con la enorme franja de pastizal del centro del continente resaltada suavemente en verde salvia.", { atMs: 115.0, kicker: "Las grandes llanuras" }),
    rc("cv_ferret_night", { atMs: 121.1, kicker: "Un cazador nocturno, casi un fantasma" }),
    rc("cv2_ferret_night_wild", { at: "Pocos seres humanos llegaron a", kicker: "Pocos lo vieron con vida" }), // 124.7
    rc("cv_ferret_portrait", { atMs: 127.4, kicker: "Se deslizaba en silencio entre las sombras" }), // 127.4
    c("annotated", { caption: "Pero dependía de otro animal", annotations: [{ x: 50, y: 38, label: "Máscara" }, { x: 62, y: 70, label: "Patas negras" }] }, ["hu_huron_anat", "Hurón de patas negras de perfil sobre fondo neutro"]), // 132.7
    rc("cv_pdog_sentry", { atMs: 135.9, kicker: "Los perritos de las praderas" }),
  ] },
  { key: "perritos", start: 138.2, fb: "hu_perrito_pradera", beats: [
    rc("cv_pdog_town", { hold: true }),                                                // 138.2 colonias gigantescas
    rc("cv_burrow_holes", { atMs: 148.3, kicker: "Cientos de millones" }),
    c("splitlist", { title: "El hurón lo necesitaba TODO de ellos", items: ["Comía perritos de las praderas", "Vivía en sus túneles", "Criaba bajo su tierra"], palette: "G" }), // 158.9
    rc("cv_pdog_eat", { atMs: 162.7 }),                                                // comía perritos
    rc("cv_ferret_tunel", { atMs: 164.3 }),                                            // vivía en túneles
    rc("cv_ferret_kit", { atMs: 166.9 }),                                              // criaba bajo tierra
    rc("cv_ferret_hunt", { atMs: 170.8, kicker: "Sin ellos, no podía existir" }),
    rc("cv_homesteaders", { at: "cuando los colonos avanzaron sobre", kicker: "Llegaron los colonos y los arados" }), // 180.8
    rc("cv_cattle", { at: "abria agujeros en el suelo", kicker: "Los veían como una plaga" }), // 189.9
  ] },
  { key: "exterminio", start: 198.1, fb: "hu_pradera_vacia", beats: [
    rc("cv_homesteaders", { kicker: "Empezó el exterminio" }),                         // 198.1
    rc("cv_veneno_tunel", { atMs: 210.3, kicker: "Veneno en los túneles" }),
    rc("cv_empty_town", { atMs: 215.7, hold: true }),                                  // 215.7 — meter overlay encima (95%)
    rc("cv_empty_town", { atMs: 223.4, kicker: "Y con ellos, el hurón" }),
    rc("cv_dry_earth", { atMs: 230.2 }),                                               // despensa que se cerraba
    c("quote", { text: "El fantasma de las llanuras se quedaba sin praderas que *cazar*." }, ["hu_pradera_vacia", "Pradera vacía y silenciosa al atardecer"]), // 237.3
  ] },
  { key: "extincion", start: 240.7, fb: "hu_cientifico_busca", beats: [
    rc("cv_field_notebook", { kicker: "Los buscaban y no encontraban ninguno" }),      // 240.7
    rc("cv_archival_prairie", { atMs: 248.4 }),                                        // el intento fracasó
    rc("cv_archival_prairie", { atMs: 255.9, hold: true, kicker: "El último murió" }), // 1979 (overlay encima)
    c("aged", { heading: "Especie extinta", lines: ["Los expertos cerraron los libros.", "Una nota triste en la lista de lo que el hombre borró."], image: img("hu_archivo_ficha") }, ["hu_archivo_ficha", "Ficha científica antigua con la palabra extinto, papel amarillento"]), // 263.5
    rc("cv_ferret_night", { atMs: 282.2, kicker: "Un recuerdo, una foto vieja" }),
  ] },
  { key: "taxidermista", start: 289.5, fb: "hu_taxidermista", beats: [
    rc("hu_taxidermista", { kicker: "El taxidermista lo reconoció", hold: true }),     // 291.2
    rc("cv_ferret_face", { atMs: 300.3, kicker: "Esa máscara, esas patas" }),
    rc("cv_old_ranch", { atMs: 311.2, kicker: "Biólogos llegaron al rancho" }),
    { t: "annotated", atMs: 315.5, kicker: "En algún lugar de Wyoming", caption: "Tenía que haber más", image: img("hu_map_wyoming"), gen: { type: "image", name: "hu_map_wyoming", prompt: MP("Mapa del estado de Wyoming y las llanuras del norte de Estados Unidos, con sus límites, estilo atlas antiguo hermoso.") }, annotations: [{ x: 50, y: 44, label: "Wyoming" }] },
    rc("cv_ferret_burrow_night", { atMs: 325.2, kicker: "Una población viva, escondida" }),
  ] },
  { key: "busqueda", start: 331.1, fb: "hu_linterna_noche", beats: [
    rc("cv_spotlight_field", { kicker: "Una búsqueda emocionante", hold: true }),      // 331.1
    rc("cv_night_vehicle", { atMs: 336.3, kicker: "De noche, con linternas" }),
    rc("cv_ferret_eyeshine", { atMs: 346.8, hold: true, kicker: "Un destello verde esmeralda" }), // 346.8
    rc("cv_spotlight_eyes", { atMs: 361.3 }),                                          // dos puntos verdes
  ] },
  { key: "colonia", start: 367.1, fb: "hu_huron_familia", beats: [
    c("headline", { tokens: ["La", { t: "encontraron" }], eyebrow: "Dos puntos verdes", bg: "image" }, ["hu_huron_noche2", "Un hurón saliendo de una madriguera de noche, ojos brillando"]), // 367.1
    rc("cv_ferret_night", { atMs: 372.6, kicker: "La única del planeta" }),
    rc("cv_biologo_anota", { atMs: 379.6 }),                                           // contaron, censaron
    rc("cv_ferret_motherkits", { atMs: 382.8, hold: true }),                           // 129 (overlay encima)
    rc("cv_ferret_night", { atMs: 395.0, kicker: "El lugar más vigilado de la biología" }),
    rc("cv_ferret_portrait", { atMs: 405.3, kicker: "Por primera vez, esperanza" }),
  ] },
  { key: "doble", start: 415.7, fb: "hu_nubes_tormenta", beats: [
    rc("cv_storm_timelapse", { kicker: "La naturaleza puede ser cruel", hold: true }), // 415.7
    c("quote", { text: "Todos los huevos están en una sola *canasta*." }, ["hu_colonia_aislada", "Una pequeña colonia de madrigueras aislada en la llanura inmensa"]), // 428.7
    rc("cv_clouds_shadow", { atMs: 433.8, kicker: "El golpe llegó. Y llegó doble" }),
    rc("cv_empty_town", { atMs: 447.7 }),                                              // la colonia se encogía
  ] },
  { key: "moquillo", start: 461.4, fb: "hu_huron_enfermo", beats: [
    rc("hu_huron_enfermo", { kicker: "Moquillo canino: un virus letal" }),            // 461.4
    rc("cv_ferret_night", { atMs: 469.1, kicker: "Casi una sentencia de muerte" }),   // 469.1
    rc("cv_ferret_held", { atMs: 473.4, kicker: "Un infectado contagiaba a todos" }), // 473.4
    rc("cv_empty_town", { atMs: 476.7, kicker: "Mata a casi todos los que toca" }),   // 476.7
  ] },
  { key: "peste", start: 480.1, fb: "hu_perritos_muertos", beats: [
    rc("cv_empty_town", { kicker: "Peste selvática", hold: true }),                    // 480.1
    rc("cv_pdog_town", { atMs: 492.4, kicker: "¿Y si mueren los perritos?" }),
    rc("cv_burrow_holes", { atMs: 496.8 }),                                            // se cierra la despensa
    c("bars", { title: "La única colonia se derrumba", unit: "", bars: [{ label: "Antes", value: 129 }, { label: "Meses después", value: 20 }] }), // 504/513 desplomaron
    rc("cv_dry_earth", { atMs: 518.5 }),                                               // seguían cayendo
  ] },
  { key: "decision", start: 520.2, fb: "hu_biologos_debate", beats: [
    r("hu_biologos_debate", "Biólogos con caras preocupadas mirando mapas y planillas en una oficina rural de los ochenta", { hold: true }), // 520.2
    c("headline", { tokens: ["¿Qué", "hacés", "cuando", "todo", "se", { t: "muere" }], eyebrow: "La decisión más difícil", bg: "image" }, ["hu_pradera_gris", "Pradera bajo cielo gris plomizo"]), // 532.5
    c("splitlist", { title: "Dos caminos, ninguno seguro", items: ["No intervenir y rezar", "Capturar a TODOS los últimos"], palette: "B", cross: true }), // 535.6 / 556.7
    rc("cv_set_trap", { atMs: 587.3, kicker: "Decidieron atraparlos a todos" }),
  ] },
  { key: "captura", start: 594.1, fb: "hu_trampa_noche", beats: [
    rc("cv_set_trap", { kicker: "Carrera contra la muerte", hold: true }),            // 594.1
    rc("cv_spotlight_field", { atMs: 598.0, kicker: "Noches enteras en las llanuras heladas" }),
    rc("cv_ferret_held", { atMs: 608.5, kicker: "Cada captura, una victoria" }),
    rc("cv_snow_blow", { atMs: 617.1, kicker: "Uno por uno, en el frío" }),
  ] },
  { key: "los18", start: 630.1, fb: "hu_18_cajas", beats: [
    rc("hu_18_cajas", { hold: true, kicker: "El recuento final" }),                    // 630 — 18 (overlay encima)
    rc("hu_huron_caja", { atMs: 636.9, hold: true, kicker: "Todo su futuro, en 18 cuerpos" }),
    rc("cv_ferret_tube", { atMs: 644.7, kicker: "Pero era aún más duro" }),
  ] },
  { key: "los7", start: 661.4, fb: "hu_huron_solo", beats: [
    rc("cv_ferret_portrait", { hold: true }),                                          // 661 — 7 (overlay encima)
    c("foundertree", { atMs: 670.8, eyebrow: "De siete corazones, toda una especie" }), // árbol animado 7→miles
    rc("cv_ferret_portrait", { atMs: 682.6 }),                                          // siete corazones en Wyoming
  ] },
  { key: "cautiverio", start: 687.6, fb: "hu_centro_cria", beats: [
    rc("cv_conservation_center", { kicker: "La parte más delicada", hold: true }),    // 687.6
    rc("cv_lab_tech", { atMs: 701.7, kicker: "El intento anterior había fracasado" }),
    c("checklist", { title: "Lo que el programa controlaba", items: ["Los ciclos de las hembras", "La luz y la temperatura", "La alimentación", "Conteniendo la respiración"] }), // 715.0
    { t: "annotated", atMs: 720.3, caption: "Imitaron las madrigueras", image: img("hu_recinto_tubos"), gen: { type: "image", name: "hu_recinto_tubos", prompt: P("Recinto de cría de hurones con tubos de plástico imitando túneles") }, annotations: [{ x: 30, y: 45, label: "Tubos como túneles" }, { x: 65, y: 55, label: "Nido bajo tierra" }] },
  ] },
  { key: "camada", start: 730.8, fb: "hu_crias_recien", beats: [
    rc("cv_ferret_kit", { kicker: "Nació la primera camada", hold: true }),           // 730.8
    rc("cv_ferret_motherkits", { atMs: 734.9, kicker: "De una especie declarada muerta" }),
    c("headline", { tokens: ["Una", "bofetada", "a", "la", { t: "extinción" }], eyebrow: "Cada cría", bg: "image" }, ["hu_cria_mano", "Una cría diminuta de hurón en manos enguantadas"]), // 752.2
    rc("st_incubator", { atMs: 755.5, kicker: "El programa creció" }),
    rc("cv_ferret_kit", { atMs: 761.4 }),                                             // de 18 a una población
  ] },
  { key: "reintro", start: 796.3, fb: "hu_amanecer_pradera", beats: [
    rc("cv_sunrise_prairie", { hold: true, kicker: "Devolverlos a casa" }),            // 796.3 devolverlos a casa
    c("quote", { text: "Volver a ver esos ojos verdes brillar libres bajo las *estrellas*." }, ["hu_amanecer_pradera", "Amanecer dorado sobre la pradera abierta, rocío en el pasto"]), // 799.2
    rc("cv_ferret_curious", { atMs: 806.6, kicker: "Y ese sería un desafío nuevo" }),  // 806.6
  ] },
  { key: "escuela", start: 809.3, fb: "hu_corral_pradera", beats: [
    rc("cv_ferret_curious", { kicker: "No sabía nada del mundo real" }),               // 809.3
    rc("cv_owl", { atMs: 814.4, kicker: "Búhos, tejones, coyotes" }),
    c("process", { title: "Una escuela de supervivencia", steps: [
      { title: "Cazar de verdad", image: img("hu_huron_caza") }, { title: "Moverse bajo tierra", image: img("hu_huron_tunel") }, { title: "Esconderse del peligro", image: img("hu_huron_alerta") } ] }), // 829.5
    rc("cv_ferret_hunt", { atMs: 840.5, kicker: "Aprendían a cazar y sobrevivir" }),
  ] },
  { key: "liberacion", start: 850.5, fb: "hu_huron_corre", beats: [
    rc("cv_ferret_release_tube", { kicker: "Las primeras jaulas se abrieron", hold: true }), // 851.5
    rc("cv_ferret_run", { atMs: 854.3, kicker: "Libres en Norteamérica otra vez" }),
    c("aged", { heading: "No todo salió bien", lines: ["Muchos de los primeros no sobrevivieron.", "Pero con cada fracaso, aprendían."], image: img("hu_pradera_viento") }, ["hu_pradera_viento", "Pasto de la pradera meciéndose con el viento al atardecer"]), // 861.6
    rc("cv_ferret_kit", { atMs: 882.8, hold: true, kicker: "Crías nacidas en libertad" }), // 882.8
    rc("cv_ferret_wild2", { atMs: 893.2, kicker: "Un milagro a fuerza de terquedad" }),
  ] },
  { key: "cuello", start: 900.7, fb: "hu_huron_perfil", beats: [
    rc("cv_ferret_portrait", { kicker: "Un fantasma escondido en el éxito" }),         // 900.7
    rc("cv_ferret_night", { atMs: 903.3, kicker: "Un problema silencioso" }),          // 903.3
    rc("st_dna", { atMs: 907.5, kicker: "Escrito en la sangre de cada hurón" }),        // 907.5
  ] },
  { key: "los7rec", start: 910.4, fb: "hu_ladrillos", beats: [
    dg("dg_botella", "Diagrama de un cuello de botella: muchos hurones arriba pasan por un embudo estrecho de SOLO 7 y vuelven a multiplicarse abajo, todos iguales; poca diversidad genética", { atMs: 925.7, hold: true }), // 925.7 cuello de botella
    c("bars", { title: "Diversidad genética", unit: "", bars: [{ label: "Antes", value: 10 }, { label: "Desde los 7", value: 2 }] }), // 929.9
    { t: "annotated", atMs: 951.5, caption: "Como un edificio con un solo tipo de ladrillo", image: img("hu_ladrillos"), gen: { type: "image", name: "hu_ladrillos", prompt: P("Una pared de ladrillos todos idénticos, luz lateral") }, annotations: [{ x: 50, y: 30, label: "Una falla…" }, { x: 50, y: 70, label: "…la tienen todos" }] }, // 951.5
    rc("cv_ferret_sombra", { atMs: 967.9, kicker: "Una herida imposible de curar" }),
  ] },
  { key: "giro", start: 976.4, fb: "hu_banco_genetico", beats: [
    rc("cv_nitrogen_vapor", { kicker: "Un giro de ciencia ficción", hold: true }),     // 976.4
    rc("cv_ranch_dog", { atMs: 980.6, kicker: "Cuando el perro dejó aquel cuerpo" }),  // 980.6 callback al perro
    rc("cv_cryo_vials", { atMs: 991.0, kicker: "Guardaron muestras de tejido" }),       // 991
    rc("cv_cryo_bank", { atMs: 997.0, kicker: "Células congeladas, un tesoro" }),       // 997
    rc("st_test_tubes", { atMs: 1005.5, kicker: "Una cápsula del tiempo biológica" }), // 1005.5
  ] },
  { key: "willa", start: 1008.0, fb: "hu_willa", beats: [
    rc("cv_ferret_portrait", { kicker: "Una hembra llamada Willa", hold: true }),      // 1008.0
    c("aged", { heading: "Sus genes parecían perdidos", lines: ["Willa murió sin dejar descendientes.", "Pero sus células dormían en el frío."], image: img("hu_vial_willa") }, ["hu_vial_willa", "Un vial congelado etiquetado a mano en nitrógeno líquido, escarcha"]), // 1014.9
    rc("cv_cryo_vials", { atMs: 1022.7, hold: true, kicker: "Dormidas en el frío" }), // 30 años (overlay encima)
  ] },
  { key: "clonar", start: 1053.6, fb: "hu_laboratorio", beats: [
    dg("dg_clon", "Diagrama del proceso de clonación en 3 pasos: 1) célula congelada de Willa, 2) un óvulo, 3) un hurón idéntico nuevo; flechas claras; título Clonar a Willa", { hold: true }), // 1053.6
    rc("st_microscope", { atMs: 1057.7, kicker: "Células congeladas más de tres décadas" }),
    rc("st_dna", { atMs: 1064.4, kicker: "Un gemelo genético" }),                      // 1064.4
    rc("cv_lab_genetics", { atMs: 1068.3, kicker: "Una apuesta en el límite de lo posible" }), // 1068.3
    rc("cv_kits_incubator", { atMs: 1071.1, kicker: "Y entonces, en el invierno, nació" }), // 1071.1
  ] },
  { key: "elizabeth", start: 1074.1, fb: "hu_elizabeth", beats: [
    rc("nw_elizabeth_ann", { kicker: "La llamaron Elizabeth Ann", hold: true }),       // 1074.1
    c("headline", { tokens: ["El", "primer", "hurón", { t: "clonado" }, "de", "la", "historia"], eyebrow: "Nació", bg: "image" }, ["hu_elizabeth2", "Primer plano de una cría de hurón clonada, foto de prensa"]), // 1076.1
    rc("nw_elizabeth_ann2", { atMs: 1092.9, kicker: "Idéntica a Willa" }),
    rc("cv_ferret_kit", { atMs: 1098.4, kicker: "Y traía la diversidad perdida" }),
    c("quote", { text: "Una madre que nunca conoció a su *gemela*." }, ["hu_willa_eliz", "Dos hurones de patas negras casi idénticos en composición simbólica"]), // 1123.5
  ] },
  { key: "masclones", start: 1139.7, fb: "hu_clones_varios", beats: [
    rc("cv_ferret_play", { kicker: "No fue el final, fue el comienzo" }),              // 1139.7
    rc("cv_kits_incubator", { atMs: 1146.2, kicker: "Más copias de Willa" }),
    c("process", { title: "El plan de rescate genético", steps: [
      { title: "Clonar más copias de Willa", image: img("hu_clones_varios") }, { title: "Que se reproduzcan", image: img("hu_huron_pareja") }, { title: "Curar el cuello de botella", image: img("hu_huron_sano") } ] }), // 1158.2
    rc("cv_ferret_pareja", { atMs: 1175.0, kicker: "Reforzar los cimientos de la especie" }),
  ] },
  { key: "llanuras", start: 1183.8, fb: "hu_huron_libre", beats: [
    rc("cv_release_team", { kicker: "En las llanuras, el otro milagro", hold: true }), // 1183.8
    rc("st_syringe", { atMs: 1201.7, kicker: "Vacunando contra el moquillo" }),
    rc("cv_pdog_town", { atMs: 1203.3, kicker: "Cuidando a los perritos" }),
    smap("hu_map_reintro", "Mapa de las Grandes Llanuras del oeste de Estados Unidos con varios estados (Wyoming, Montana, las Dakotas, Colorado, Arizona), estilo atlas antiguo hermoso.", { atMs: 1212.3, origin: [42, 40], yearFrom: 1991, yearTo: 2024, eyebrow: "De vuelta a la naturaleza", title: "Sitios de reintroducción", hue: "amber" }), // 1212.3 miles de crías
    rc("cv_ferret_wild2", { atMs: 1220.7, kicker: "Cientos viven libres otra vez" }),
  ] },
  { key: "gente", start: 1234.5, fb: "hu_biologo_invierno", beats: [
    rc("cv_field_notebook", { kicker: "Detrás de cada número, personas", hold: true }), // 1234.5
    rc("cv_biologo_invierno", { atMs: 1240.8, kicker: "Inviernos arrodillados en la nieve" }),
    rc("cv_ferret_held", { atMs: 1248.6, kicker: "Le pusieron nombres a cada uno" }),
    rc("cv_voluntarios", { atMs: 1258.0, kicker: "Voluntarios, miles de kilómetros" }),
    rc("cv_release_team", { atMs: 1268.9, kicker: "Nunca verán el final de esta historia" }), // 1268.9
    rc("cv_homesteaders", { atMs: 1284.6, kicker: "Nuestros venenos los apagaron" }),
    rc("cv_gloved_hands", { atMs: 1291.3, kicker: "Pero nos arrodillamos a repararlo" }), // 1291.3
    c("quote", { text: "La misma especie que provocó la tragedia se negó a *aceptarla*." }, ["hu_manos_huron", "Manos de un biólogo sosteniendo un hurón"]), // 1297.5
    rc("cv_spotlight_field", { atMs: 1307.4, kicker: "Hoy, cuando cae la noche" }),     // 1307.4
    rc("cv_ferret_eyeshine", { atMs: 1316.3, hold: true, kicker: "Dos puntos verdes: el fantasma sigue acá" }), // 1316.3
  ] },
  { key: "nosalvo", start: 1328.9, fb: "hu_huron_atardecer", beats: [
    c("aged", { heading: "Todavía no está a salvo", lines: ["Sigue siendo de las especies más amenazadas.", "Pero está vivo. Sigue luchando."], image: img("hu_huron_atardecer") }, ["hu_huron_atardecer", "Un hurón recortado contra el atardecer de la pradera"]), // 1328.9
    rc("cv_ferret_wild2", { atMs: 1341.7, kicker: "Pero está vivo" }),
  ] },
  { key: "reflexion", start: 1347.7, fb: "hu_elizabeth", beats: [
    c("timeline", { eyebrow: "La cronología del milagro", title: "De la extinción al regreso", events: [
      { year: "1979", label: "Declarado extinto", image: img("hu_archivo_ficha"), accent: "danger" },
      { year: "1981", label: "Un perro lo redescubre", image: "real/nwi_meeteetse_1.png", accent: "amber" },
      { year: "1985", label: "Capturan a los últimos 18", image: img("hu_18_cajas"), accent: "danger" },
      { year: "1987", label: "Nace la primera camada", image: "real/nwi_kits_1.png", accent: "accent" },
      { year: "1991", label: "Primeras liberaciones", image: "real/nwi_release_1.png", accent: "accent" },
      { year: "2020", label: "Clonan a Elizabeth Ann", image: "real/nwi_elizabeth1_1.png", accent: "accent" },
      { year: "Hoy", label: "Cientos viven libres", image: img("hu_huron_libre"), accent: "accent" } ] }), // 1347-1395
  ] },
  { key: "sishep", start: 1374.3, fb: "hu_perro_atardecer", beats: [
    rc("cv_ranch_dog", { hold: true, kicker: "Si Shep no hubiera ladrado" }),          // 1374.3
    rc("cv_ferret_face", { atMs: 1381.3, kicker: "Si no reconocían la máscara" }),       // 1381.3
    rc("cv_spotlight_eyes", { atMs: 1384.7, kicker: "Si no salían con sus linternas" }), // 1384.7
    rc("hu_18_cajas", { atMs: 1391.1, kicker: "Si no capturaban a los últimos 18" }),   // 1391.1
    rc("cv_cryo_vials", { atMs: 1395.5, kicker: "Si no guardaban las células 30 años" }), // 1395.5
    c("infzoom", { images: [img("hu_perro_porche"), img("hu_huron_mascara"), img("hu_elizabeth"), img("hu_huron_libre")] }), // 1402.8 sería una foto vieja
    rc("cv_ferret_run", { atMs: 1411.2, kicker: "Pero no lo es. Está vivo" }),          // 1411.2
    rc("cv_ferret_hunt", { atMs: 1414.1, kicker: "Caza bajo las estrellas" }),          // 1414.1
  ] },
  { key: "ensena", start: 1421.1, fb: "hu_huron_amanece", beats: [
    rc("cv_sunrise_prairie", { hold: true }),                                          // 1421.1
    c("headline", { tokens: ["La", "extinción", "no", "siempre", "es", "el", { t: "final" }], eyebrow: "Esta historia enseña", bg: "image" }, ["hu_huron_amanece", "Un hurón al amanecer en la pradera, luz dorada naciente"]), // 1423.9
    rc("cv_burrow_holes", { atMs: 1432.5, kicker: "En una colonia secreta" }),         // 1432.5
    rc("cv_ranch_dog", { atMs: 1435.3, kicker: "En el instinto de un perro" }),         // 1435.3
    rc("cv_cryo_vials", { atMs: 1441.1, kicker: "En unas células dormidas en el frío" }), // 1441.1
    rc("cv_ferret_wild2", { atMs: 1450.9, kicker: "Con la clonación y miles de personas" }), // 1450.9
    rc("cv2_ferret_recovery", { atMs: 1459.2, kicker: "Tiene un futuro" }),             // 1459.2
  ] },
  { key: "cierre", start: 1461.0, fb: "hu_huron_estrellas", beats: [
    rc("cv_ferret_night", { hold: true, kicker: "Y todo empezó con un perro" }),       // 1461.0
    rc("cv_ranch_dog", { atMs: 1464.0 }),                                              // una noche fría, un porche
  ] },
  { key: "outro", start: 1467.3, fb: "hu_pradera_final", beats: [
    rc("cv_sunrise_prairie", { kicker: "Regresos imposibles como este" }),             // 1467.3
    rc("cv2_ferret_recovery", { atMs: 1474.1, kicker: "Especies que volvieron de los muertos" }), // 1474.1
    rc("cv_ferret_portrait", { atMs: 1476.7, hold: true, kicker: "Animales que se negaron a desaparecer" }),
  ] },
];

const VIDEO_END = 1482;

// ── STOCK PROFESIONAL (Pexels 4K) con PRIORIDAD para paisaje/ciencia/depredadores ──
const STOCK_PREF = {
  cv_plains_aerial: "st_aerial_grassland", cv_sunrise_prairie: "st_grassland_sunrise",
  cv_sunset_prairie: "st_grassland_sunset", cv_grass_wind: "st_grass_wind",
  cv_grass_backlit: "st_golden_grass", cv_storm_timelapse: "st_storm_clouds",
  cv_clouds_shadow: "st_clouds_timelapse", cv_snow_blow: "st_snow_field",
  cv_night_stars: "st_night_sky", cv_dawn_mist: "st_fog_field",
  cv_rain_prairie: "st_rain_field", cv_dry_earth: "st_dry_earth",
  cv_wildflowers: "st_wildflowers", cv_microscope: "st_microscope",
  cv_petri: "st_petri", cv_nitrogen_vapor: "st_nitrogen", cv_cryo_vials: "st_test_tubes",
  cv_cryo_bank: "st_test_tubes", cv_lab_tech: "st_lab_tech", cv_dna: "st_dna",
  cv_cloning: "st_lab_blue", cv_lab_genetics: "st_lab_blue", cv_owl: "st_owl",
  cv_hawk: "st_hawk", cv_eagle: "st_eagle", cv_coyote: "st_coyote", cv_bison: "st_bison",
  cv_pronghorn: "st_antelope", cv_field_notebook: "st_field_research",
  cv_spotlight_field: "st_flashlight_night", cv_gloved_hands: "st_hands_animal",
  cv_vaccinate: "st_syringe", cv_burrow_clip: "st_burrow_hole", cv_burrow_holes: "st_burrow_hole",
  hu_llanuras_dia: "st_grassland_wide", hu_amanecer_pradera: "st_grassland_sunrise",
  hu_ganado_pradera: "st_cattle", hu_ojos_verdes: "st_eyes_animal", hu_ojos_verdes2: "st_eyes_animal",
};
// supplement (cv2_*) — mejores clips de hurón frescos, prioridad sobre cv_ donde aplique
const SUP_PREF = {
  cv_ferret_face: "cv2_ferret_4k", cv_ferret_body: "cv2_ferret_4k", cv_ferret_night: "cv2_ferret_night_wild",
  cv_ferret_burrow_night: "cv2_ferret_head_out", cv_ferret_kit: "cv2_ferret_pups",
  cv_ferret_release_tube: "cv2_ferret_release_co", cv_ferret_run: "cv2_ferret_run_grass",
  cv_ferret_curious: "cv2_ferret_curious", cv_ferret_held: "cv2_ferret_handled",
  cv_pdog_town: "cv2_pdog_colony_4k", cv_pdog_sentry: "cv2_pdog_closeup", cv_pdog_eat: "cv2_pdog_closeup",
  cv_plains_aerial: "cv2_prairie_4k", cv_kits_incubator: "cv2_kits_incubator",
};
// ── resolver de clip rc: supplement 4k > stock pro > clip propio > imagen real > IA ──
const resolveRc = (name, fb) => {
  const sup = SUP_PREF[name];
  if (sup && fexists(`broll/${sup}.mp4`)) return `broll/${sup}.mp4`;
  const st = STOCK_PREF[name];
  if (st && fexists(`broll/${st}.mp4`)) return `broll/${st}.mp4`;
  if (fexists(`broll/${name}.mp4`)) return `broll/${name}.mp4`;
  if (fexists(`real/${fb}.png`)) return `real/${fb}.png`;
  return `img/${fb}.png`;
};

// ── POOLS TEMÁTICOS + BALANCEADOR DE REUSO (ningún clip > REUSE_CAP veces) ──────────
const THEMES = {
  ferret: /ferret|huron|nw_eliz|nw_shep|nw_willa|nwi_eliz|nwi_willa|nwi_face|nwi_wild|nwi_kits|nwi_breeding|nwi_handling|nwi_spotlight|nwi_shep|nwi_meeteetse/i,
  prairiedog: /pdog|prairie_dog|burrow|groundhog/i,
  predator: /owl|hawk|coyote|badger|eagle|fox|bison|pronghorn|antelope|deer|weasel/i,
  lab: /lab|cryo|nitrogen|microscope|petri|dna|vial|test_tube|incubator|clone|freezer|cell|genetic|bank|nwi_cryo/i,
  field: /spotlight|trap|field|notebook|vehicle|release|team|volunt|biolog|gloved|hands|vaccine|syringe|handl|counting|survey/i,
  archival: /archival|homesteader|ranch|cattle|taxiderm|veneno|dog_farm/i,
};
const themeOf = (src) => { const n = (src || "").toLowerCase(); for (const [k, re] of Object.entries(THEMES)) if (re.test(n)) return k; return "landscape"; };
const allClips = fexists("broll") ? fs.readdirSync("public/broll").filter((f) => f.endsWith(".mp4")).map((f) => `broll/${f}`) : [];
const newsImgs = fexists("real") ? fs.readdirSync("public/real").filter((f) => /^nwi_.*\.png$/.test(f)).map((f) => `real/${f}`) : [];
const themePools = {}; for (const c of [...allClips, ...newsImgs]) { const t = themeOf(c); (themePools[t] = themePools[t] || []).push(c); }
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

// ── ANCLAJE ────────────────────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_huron_aligned.json", "utf8"));
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

const swapStill = (p) => {
  if (typeof p !== "string" || !p.startsWith("img/")) return p;
  const name = p.slice(4).replace(/\.png$/, "");
  if (fexists(`real/${name}.png`)) return `real/${name}.png`;
  return p;
};
const CLIP_PREF = {
  hu_perro_porche: "nw_shep_dog", hu_huron_madriguera: "nw_ferret_burrow_wild",
  hu_pradera_vacia: "st_dry_earth", hu_ojos_verdes: "st_eyes_animal",
  hu_huron_noche2: "cv2_ferret_night_wild", hu_colonia_aislada: "cv_empty_town",
  hu_huron_caja: "cv_ferret_tube", hu_huron_solo: "cv_ferret_portrait",
  hu_cria_mano: "cv2_ferret_pups", hu_amanecer_pradera: "st_grassland_sunrise",
  hu_pradera_viento: "st_grass_wind", hu_vial_willa: "nw_willa_cells",
  hu_elizabeth2: "nw_elizabeth_ann2", hu_willa_eliz: "nw_elizabeth_ann",
  hu_manos_huron: "nw_biologist_handle", hu_huron_atardecer: "cv_ferret_wild2",
  hu_pradera_dorada: "st_golden_grass", hu_pradera_final: "st_grassland_sunrise",
  hu_huron_amanece: "cv_ferret_wild2", hu_perro_mira: "cv_ranch_dog",
  hu_huron_pasto: "cv2_ferret_4k", hu_pradera_gris: "st_storm_clouds",
};
const swapBg = (p) => {
  if (typeof p !== "string" || !p.startsWith("img/")) return p;
  const name = p.slice(4).replace(/\.png$/, "");
  const pref = CLIP_PREF[name];
  if (pref && fexists(`broll/${pref}.mp4`)) return `broll/${pref}.mp4`;
  if (fexists(`broll/${name}.mp4`)) return `broll/${name}.mp4`;
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
      // kicker (cartelito verde top-left) ELIMINADO — el usuario no lo quiere
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
      if (Array.isArray(beat.images)) beat.images = beat.images.map((im) => ({ src: swapStill(typeof im === "string" ? im : im.src) }));
      if (Array.isArray(beat.waypoints)) beat.waypoints = beat.waypoints.map((w) => ({ ...w, image: swapStill(w.image) }));
      if (Array.isArray(beat.steps)) beat.steps = beat.steps.map((st) => ({ ...st, image: swapStill(st.image) }));
      if (Array.isArray(beat.events)) beat.events = beat.events.map((e) => ({ ...e, image: e.image ? swapStill(e.image) : e.image }));
      if (beat.kind === "journey") delete beat.accent;
    }
    beats.push(beat);
  });
}
// ── DENSIFICACIÓN: ninguna toma supera MAXSHOT; las largas se subdividen con clips del
// pool de la sección (anclajes preservados). Diagramas/mapas/journey/spreadmap = enteros. ──
const MAXSHOT = 7.0, TARGET = 4.6;
const held = (src) => typeof src === "string" && /dg_|hu_map_/.test(src); // láminas: no subdividir
const fullDur = new Set(["journey", "spreadmap", "infzoom", "process", "timeline", "foundertree"]); // animados: no acortar
// (pools temáticos + usage + balance ya definidos arriba). El relleno usa el clip MENOS usado
// del mismo tema (balanceo global de reuso).
const poolFor = (src) => (themePools[themeOf(src)] || allClips);
const dense = [];
const lastSrc = () => (dense.length ? dense[dense.length - 1].src : null);
const pickSrc = (pool, avoid) => { // del pool temático, el MENOS usado, evitando base y anterior
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
      const src = j === 0 ? b.src : pickSrc(pool, b.src); // 1ra = literal; resto = variedad del mismo tema
      dense.push({ id: `${b.id}_${j}`, start: sStart, dur: +(sEnd - sStart).toFixed(2), kind: "raw", src, hue: b.hue });
    }
  } else if (b.kind !== "raw" && b.dur > 8 && !fullDur.has(b.kind)) {
    const keep = 6.0, bEnd = +(b.start + b.dur).toFixed(2), t0 = +(b.start + keep).toFixed(2);
    dense.push({ ...b, dur: +(t0 - b.start).toFixed(2) });
    const span = bEnd - t0, nf = Math.max(1, Math.round(span / TARGET));
    const prev = lastSrc(); const pool = poolFor(prev && prev.startsWith("broll/") ? prev : "");
    for (let j = 0; j < nf; j++) {
      const fst = +(t0 + span * j / nf).toFixed(2), fen = +(t0 + span * (j + 1) / nf).toFixed(2);
      dense.push({ id: `${b.id}f${j}`, start: fst, dur: +(fen - fst).toFixed(2), kind: "raw", src: pickSrc(pool, null), hue: b.hue });
    }
  } else dense.push(b);
}
beats.length = 0; beats.push(...dense);

// ── COLD-OPEN TEASER (0–INTRO): gancho visual antes de la narración (corre todo +INTRO) ──
const INTRO = 4.0;
for (const b of beats) b.start = +(b.start + INTRO).toFixed(2);
const tsrc = (n, fb) => fexists(`broll/${n}.mp4`) ? `broll/${n}.mp4` : (fexists(`real/${fb}.png`) ? `real/${fb}.png` : `img/${fb}.png`);
const T = (i, s, e, n, fb, hue) => ({ id: `teaser_${i}`, start: +s.toFixed(2), dur: +(e - s).toFixed(2), kind: "raw", src: tsrc(n, fb), hue });
beats.unshift(
  T(0, 0.0, 1.5, "st_eyes_animal", "hu_ojos_verdes", "red"),       // ojos verdes en la oscuridad
  T(1, 1.5, 2.8, "cv2_ferret_4k", "hu_huron_mascara", "amber"),    // la cara enmascarada (4k fresco si bajó)
  T(2, 2.8, 4.0, "cv_ferret_run", "hu_huron_libre", "amber"),      // hurón salvaje corriendo: el regreso
);

// ── OVERLAYS de UBICACIÓN (encima del clip): tarjeta abajo-izq con mini-mapa + pin ──
const loc = (px, py, place, sub, atMs, dur, gen) => ({ id: `loc_${Math.round(atMs)}`, start: +(atMs + INTRO).toFixed(2), dur, kind: "loctag", mapImage: img("hu_map_us"), pinX: px, pinY: py, place, sub, overlay: true, ...(gen ? { gen } : {}) });
beats.push(
  loc(26, 36, "Wyoming", "Estados Unidos", 4.5, 6.0, { type: "image", name: "hu_map_us", prompt: MP("Mapa de los Estados Unidos continentales completo, con los límites de los estados marcados sutilmente, estilo atlas antiguo hermoso.") }),
  loc(43, 46, "Grandes Llanuras", "Norteamérica", 113.0, 6.0),
  loc(31, 42, "Sitios de reintroducción", "Oeste de EE.UU.", 1216.0, 6.5),
);
// CIFRAS y FECHAS como OVERLAY sobre el footage (no lo tapan): la cifra cuenta sobre el clip real
const otag = (props, atMs, dur) => ({ id: `stat_${Math.round(atMs)}`, start: +(atMs + INTRO).toFixed(2), dur, kind: "stattag", overlay: true, ...props });
beats.push(
  otag({ text: "1979", eyebrow: "Declarado extinto", label: "murió el último hurón conocido", accent: "danger", corner: "bl" }, 256.5, 5.5),
  otag({ value: 129, eyebrow: "Quedaban", label: "toda la especie del planeta", accent: "amber", corner: "tr" }, 383.5, 6.0),
  otag({ value: 18, eyebrow: "Los últimos", label: "hurones del mundo entero", accent: "danger", corner: "tr" }, 630.6, 6.0),
  otag({ value: 7, eyebrow: "Solo", label: "fundadores de toda la especie", accent: "danger", corner: "tr" }, 666.0, 6.0),
  otag({ value: 30, suffix: " años", eyebrow: "Dormidas en el frío", label: "las células de Willa", accent: "cold", corner: "br" }, 1023.0, 5.5),
  otag({ text: "2021", eyebrow: "Nace", label: "Elizabeth Ann, el primer hurón clonado", accent: "accent", corner: "bl" }, 1074.5, 6.0),
  otag({ value: 1000, prefix: "+", eyebrow: "Desde solo 18 hurones", label: "crías nacidas en el programa", accent: "accent", corner: "tr" }, 1186.0, 6.0),
);
// NAME TAGS (lower-third estilo NatGeo) + FRASES CLAVE (énfasis), encima del footage
const nt = (n, sub, accent, atMs, dur) => ({ id: `name_${Math.round(atMs)}`, start: +(atMs + INTRO).toFixed(2), dur, kind: "nametag", overlay: true, name: n, sub, accent });
const ph = (text, accent, atMs, dur, pos) => ({ id: `ph_${Math.round(atMs)}`, start: +(atMs + INTRO).toFixed(2), dur, kind: "phrasetag", overlay: true, text, accent, ...(pos ? { pos } : {}) });
beats.push(
  nt("Hurón de patas negras", "Mustela nigripes", "amber", 111.0, 6.0),
  nt("Perrito de las praderas", "Cynomys ludovicianus", "accent", 139.0, 5.5),
  nt("Willa", "La hembra cuyos genes volverían", "cold", 1009.0, 5.5),
  nt("Elizabeth Ann", "El primer hurón clonado de la historia", "accent", 1075.5, 5.5),
  ph("El *fantasma* de las llanuras", "cold", 121.5, 4.0),
  ph("Una segunda *oportunidad*", "accent", 1426.9, 4.5),
);
// BARRA QUE SE VACÍA (before/after) sobre el footage del exterminio
beats.push({ id: "meter_pdog", start: +(215.7 + INTRO).toFixed(2), dur: 7.0, kind: "metertag", overlay: true, label: "Perritos de las praderas", fromPct: 100, toPct: 5, eyebrow: "Mediados del siglo XX", corner: "tr" });
// (Cartones de CAPÍTULO eliminados — el usuario: cortan la inmersión)

fs.writeFileSync("beatsheet/huron.json", JSON.stringify({ video: "huron", beats }, null, 1));
const raw = beats.filter((b) => b.kind === "raw").length;
const types = new Set(beats.filter((b) => b.kind !== "raw").map((b) => b.kind));
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · tipos no-raw: ${types.size}`);
console.log(`fondos: ${nClip} clips · ${nReal} reales · ${nAi} IA`);
console.log(`dur total: ${(beats[beats.length - 1].start + beats[beats.length - 1].dur).toFixed(0)}s`);
