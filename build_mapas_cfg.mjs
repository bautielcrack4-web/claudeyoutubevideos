// Config de #7 mapas para build_dense.mjs — "7 Mapas Antiguos Que No Deberían Existir"
export default {
  headlineAt: "hoy vamos a desplegar siete",
  headline: { tokens: [["7", "hl"], "mapas", "que", "no", "deberían", ["existir", "hl"]], img: "ma_hero", q: "ancient antique world map parchment mysterious", hue: "amber", size: 84 },
  cierreAt: "hemos desplegado durante este viaje",
  timelineAt: "parecen apuntar en silencio",
  proximoAt: "en el proximo viaje vamos a ir",
  timeline: { eyebrow: "Copias de copias de un saber perdido", title: "Mapas que llegaron de un mundo anterior", events: [
    { year: "≈15.000 a.C.", label: "Cielo en cuevas" }, { year: "1513", label: "Piri Reis" }, { year: "1531", label: "Oronteus Finaeus" }, { year: "1737", label: "Buache" }, { year: "1949", label: "Radar Antártida" },
  ] },
  teaser: { tokens: ["Máquinas", "que", "hoy", "no", "sabríamos", ["construir", "hl"]], img: "ma_world", q: "ancient mechanism bronze gears antikythera", hue: "blue", size: 84 },
  DATA: [
    { at: "numero siete para entender", n: "07", name: "La Tabula Peutingeriana", loc: "Imperio Romano", age: "copia s. XIII", img: "tp_map", imgq: "Tabula Peutingeriana long roman road map scroll", imgc: "the long narrow Roman road-map scroll Tabula Peutingeriana", m: 7, unit: "metros", scl: "el imperio entero en una tira de pergamino", hue: "amber", stat: { value: 1, suffix: " copia", label: "de toda esa cartografía romana, sobrevive una", eyebrow: "Un GPS de hace 2.000 años" } },
    { at: "numero seis ahora si empezamos", n: "06", name: "El mapa de Zeno", loc: "Venecia · 1558", age: "1558", img: "zn_map", imgq: "Zeno map north atlantic antique islands", imgc: "the 1558 Zeno map of the North Atlantic with phantom islands", m: 0, unit: "islas reales", scl: "islas fantasma dibujadas con costas reales", hue: "blue", stat: { value: 0, prefix: "¿", suffix: " existen?", label: "islas detalladas que nunca estuvieron ahí", eyebrow: "Groenlandia bajo el hielo" } },
    { at: "numero cinco hay un mapa", n: "05", name: "El mapa de Vinland", loc: "Norte de América", age: "¿medieval?", img: "vl_map", imgq: "Vinland map medieval north america parchment", imgc: "the Vinland map showing North America before Columbus", m: 500, unit: "años antes", scl: "América con nombre, antes de Colón", hue: "amber", stat: { value: 0, prefix: "", suffix: " ¿falso?", label: "la tinta lo delata, pero los vikingos sí llegaron", eyebrow: "Antes de Colón" } },
    { at: "numero cuatro y aca empezamos", n: "04", name: "El mapa de Buache", loc: "Francia · s. XVIII", age: "1737", img: "bu_map", imgq: "Buache map antarctica two landmasses antique", imgc: "the Buache map showing Antarctica split into two landmasses", m: 2, unit: "masas de tierra", scl: "la Antártida partida en dos, como bajo el radar", hue: "blue", stat: { value: 2, suffix: " masas", label: "el radar confirmó: dos tierras bajo el hielo", eyebrow: "Un siglo antes del descubrimiento" } },
    { at: "numero tres nos quedamos", n: "03", name: "Oronteus Finaeus", loc: "Francia · 1531", age: "1531", img: "of_map", imgq: "Oronteus Finaeus map antarctica 1531 antique", imgc: "the 1531 Oronteus Finaeus map with an ice-free Antarctica", m: 300, unit: "años antes", scl: "la Antártida con ríos y montañas, sin hielo", hue: "blue", stat: { value: 1531, suffix: "", label: "casi 300 años antes de que nadie la viera", eyebrow: "Un continente con ríos" } },
    { at: "numero dos antes de llegar", n: "02", name: "Las cuevas estelares", loc: "Europa paleolítica", age: "≈15.000 a.C.", img: "cv_stars", imgq: "Lascaux cave painting stars constellations dots", imgc: "Paleolithic cave paintings aligned with constellations", m: 17000, unit: "años", scl: "el cielo pintado en la roca, con su época exacta", hue: "amber", stat: { value: 17000, suffix: " años", label: "cartas del cielo, no de la tierra", eyebrow: "Cazadores mirando las estrellas" } },
    { at: "y llegamos al numero uno", n: "01", name: "El mapa de Piri Reis", loc: "Imperio Otomano · 1513", age: "1513", img: "pr_map", imgq: "Piri Reis map 1513 antique parchment coastline", imgc: "the 1513 Piri Reis map showing the ice-free Antarctic coast", m: 1949, unit: "", scl: "la costa antártica que recién vimos en 1949", hue: "red", stat: { value: 1513, suffix: "", label: "él confesó: solo copió mapas mucho más antiguos", eyebrow: "La Antártida sin hielo" } },
  ],
  EXTRA: [
    // intro — splitlist de las dos únicas explicaciones
    { at: "solo hay dos explicaciones", dur: 6.0, kind: "splitlist", title: "Solo hay dos explicaciones", cross: false, palette: "A", items: ["Una coincidencia imposible", "O alguien estuvo ahí antes", "Mucho antes de lo que creemos"] },
    // #7 annotated — el rollo largo de la Tabula
    { at: "una tira de pergamino larguisima", dur: 6.5, kind: "annotated", image: "real/tp_map.jpg", eyebrow: "Tabula Peutingeriana", caption: "7 metros de largo, 30 cm de alto: el imperio aplastado en una tira", hue: "amber", annotations: [
      { kind: "underline", x: 0.5, y: 0.5, w: 0.42, label: "Rutas, paradas y distancias" },
    ] },
    // intro — journey por dónde nacieron / qué muestran los mapas
    { at: "continentes que todavia", dur: 12.0, kind: "journey", eyebrow: "Mapas que no deberían existir", title: "Un saber repartido por el mundo", accent: "amber", worldImage: "real/pue_worldmap.jpg", waypoints: [
      { x: 0.50, y: 0.34, label: "Roma", dwell: 1.2, travel: 0.7 }, { x: 0.52, y: 0.31, label: "Venecia", dwell: 1.2, travel: 0.7 }, { x: 0.49, y: 0.33, label: "Francia", dwell: 1.2, travel: 0.7 }, { x: 0.60, y: 0.40, label: "Imperio otomano", dwell: 1.2, travel: 0.7 }, { x: 0.50, y: 0.92, label: "Antártida", dwell: 1.4, travel: 0.7 },
    ] },
    // bars — antigüedad de los mapas (cifra fuerte)
    { at: "alguien estuvo ahi antes", dur: 7.0, kind: "bars", eyebrow: "Cuándo se dibujaron", title: "Mapas demasiado viejos", unit: "", accent: "accent", hue: "amber", bars: [
      { label: "Piri Reis", value: 1513, display: "1513" }, { label: "Oronteus", value: 1531, display: "1531" }, { label: "Zeno", value: 1558, display: "1558" }, { label: "Buache", value: 1737, display: "1737" },
    ] },
    // #7 aged — el rollo romano como documento
    { at: "es un gps de hace dos mil", dur: 6.5, kind: "aged", heading: "Un GPS de hace 2.000 años", eyebrow: "Tabula Peutingeriana", accent: "accent", hue: "amber", lines: [
      { text: "Cada camino, cada parada, cada distancia" }, { text: "del Imperio Romano entero,", mark: true }, { text: "en una sola tira de pergamino." }, { text: "Sobrevivió una única copia.", mark: true },
    ] },
    // #6 callout — islas fantasma sobre el mapa de Zeno
    { at: "algunas de esas islas no existen", dur: 6.0, kind: "callout", figure: "0", image: "real/zn_map.jpg", eyebrow: "Mapa de Zeno", caption: "islas dibujadas con detalle… que nunca existieron", accent: "accent", hue: "blue" },
    // #6 splitlist — lo real vs lo fantasma
    { at: "dos misterios en uno", dur: 6.0, kind: "splitlist", title: "Lo real mezclado con lo imposible", cross: true, palette: "B", items: ["Islas fantasma con nombre", "Costas que sí existen", "Groenlandia como bajo el hielo"] },
    // #5 aged — Vinland y la honestidad sobre la falsificación
    { at: "considerado por la mayoria", dur: 6.5, kind: "aged", heading: "Lo que dice la ciencia", eyebrow: "Mapa de Vinland", accent: "danger", hue: "red", lines: [
      { text: "La tinta tiene compuestos modernos:" }, { text: "el mapa es, casi seguro, falso.", mark: true }, { text: "Pero los vikingos SÍ llegaron a América" }, { text: "siglos antes que Colón.", mark: true },
    ] },
    // #4 cross — la Antártida partida en dos bajo el hielo
    { at: "dividida en dos grandes masas", dur: 7.0, kind: "cross", eyebrow: "Lo que esconde el radar", title: "La Antártida bajo el hielo", hue: "blue", layers: [
      { label: "Capa de hielo", depth: "~2 km de espesor", color: "#dfe7ee", weight: 1.3 }, { label: "Tierra occidental", depth: "una masa", color: "#9c855c", weight: 1.0 }, { label: "Canal / mar interior", depth: "agua entre ambas", color: "#7e94a6", weight: 0.7 }, { label: "Tierra oriental", depth: "otra masa", color: "#8a7a5c", weight: 1.0 },
    ] },
    // #4 callout — Buache copió fuentes perdidas
    { at: "fuentes que hoy ya no tenemos", dur: 5.5, kind: "callout", figure: "?", image: "real/bu_map.jpg", eyebrow: "Mapa de Buache", caption: "él dijo: copié documentos antiguos que hoy ya no existen", accent: "accent", hue: "blue" },
    // #3 annotated — Antártida con ríos en Oronteus
    { at: "dibujo un gran continente", dur: 6.5, kind: "annotated", image: "real/of_map.jpg", eyebrow: "Oronteus Finaeus · 1531", caption: "un continente austral con costas, montañas y ríos", hue: "blue", annotations: [
      { kind: "circle", x: 0.5, y: 0.7, w: 0.18, label: "Forma similar a la Antártida real" }, { kind: "underline", x: 0.5, y: 0.55, w: 0.24, label: "Ríos: tierra sin hielo" },
    ] },
    // #2 annotated — el cielo en la cueva
    { at: "ciertos puntos pintados junto", dur: 6.5, kind: "annotated", image: "real/cv_stars.jpg", eyebrow: "Cuevas paleolíticas", caption: "puntos que coinciden con las constelaciones", hue: "amber", annotations: [
      { kind: "circle", x: 0.42, y: 0.4, w: 0.1, label: "Estrellas, no decoración" }, { kind: "circle", x: 0.62, y: 0.52, w: 0.08, label: "Una constelación reconocible" },
    ] },
    // #2 cross/aged — el cielo cambia con los milenios
    { at: "el cielo no es fijo", dur: 6.0, kind: "aged", heading: "El cielo de hace 17.000 años", eyebrow: "Cartas estelares", accent: "accent", hue: "amber", lines: [
      { text: "Las constelaciones se mueven con los milenios." }, { text: "Las marcas coinciden con el cielo" }, { text: "de aquella época,", mark: true }, { text: "no con el de ahora." },
    ] },
    // #1 annotated — la costa antártica en Piri Reis
    { at: "piri reis dibujo una franja", dur: 7.0, kind: "annotated", image: "real/pr_map.jpg", eyebrow: "Piri Reis · 1513", caption: "la franja inferior coincidiría con la costa antártica", hue: "red", annotations: [
      { kind: "arrow", x: 0.5, y: 0.78, fromX: 0.75, fromY: 0.9, label: "Costa de la Tierra de la Reina Maud" }, { kind: "underline", x: 0.4, y: 0.45, w: 0.2, label: "Sudamérica, con exactitud notable" },
    ] },
    // #1 bars — cuándo pudimos ver lo que él dibujó
    { at: "una expedicion de sismografos", dur: 6.5, kind: "bars", eyebrow: "Cuándo lo vimos nosotros", title: "Él lo dibujó en 1513", unit: "", accent: "danger", hue: "red", bars: [
      { label: "Piri Reis lo dibuja", value: 1513, display: "1513" }, { label: "Se descubre la Antártida", value: 1820, display: "1820" }, { label: "Mapeamos bajo el hielo", value: 1949, display: "1949" },
    ] },
    // #1 callout — él confesó que solo copió
    { at: "lo escribio el propio piri reis", dur: 6.0, kind: "callout", figure: "1513", image: "real/pr_map.jpg", eyebrow: "De su puño y letra", caption: "no inventé nada: copié mapas mucho más antiguos", accent: "danger", hue: "red" },
    // cierre — checklist de lo que comparten
    { at: "parecen apuntar en silencio", dur: 7.0, kind: "checklist", eyebrow: "Una misma idea perturbadora", title: "Lo que comparten los 7", accent: "accent", hue: "amber", items: [
      { text: "Muestran lo que su época no podía conocer", state: "done" }, { text: "Sus autores admiten copiar fuentes más viejas", state: "done" }, { text: "Esas fuentes originales se perdieron", state: "done" }, { text: "El saber no siempre avanza en línea recta", state: "doing" },
    ] },
    // cierre — aged sobre las bibliotecas perdidas
    { at: "la biblioteca de alejandria", dur: 6.5, kind: "aged", heading: "Lo que se quemó con ellas", eyebrow: "Bibliotecas perdidas", accent: "danger", hue: "red", lines: [
      { text: "Cuando ardía una gran biblioteca" }, { text: "no se perdían solo libros:", mark: true }, { text: "se perdían mapas, mediciones, siglos" }, { text: "de gente mirando el cielo.", mark: true },
    ] },
  ],
};
