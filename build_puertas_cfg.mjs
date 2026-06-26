// Config de #6 puertas para build_dense.mjs
export default {
  headlineAt: "hoy vamos a pararnos frente a siete",
  headline: { tokens: [["7", "hl"], "puertas", "antiguas", "que", "nadie", "ha", "logrado", ["abrir", "hl"]], img: "pue_hero", q: "ancient sealed stone door mysterious dramatic", hue: "amber", size: 84 },
  cierreAt: "hemos estado durante este viaje",
  timelineAt: "comparten una misma",
  proximoAt: "en el proximo viaje vamos a desplegar",
  timeline: { eyebrow: "Construimos para mostrar, y para esconder", title: "Puertas hechas para no abrirse", events: [
    { year: "2.500 a.C.", label: "Falsa puerta" }, { year: "≈500 d.C.", label: "Puerta del Sol" }, { year: "210 a.C.", label: "Tumba de Qin" }, { year: "s. XVI", label: "Padmanabhaswamy" }, { year: "Hoy", label: "Bóveda B" },
  ] },
  teaser: { tokens: ["Mapas", "que", "muestran", "lo", ["imposible", "hl"]], img: "pue_map", q: "ancient antique world map old", hue: "blue", size: 84 },
  DATA: [
    { at: "numero siete para entender", n: "07", name: "La falsa puerta egipcia", loc: "Antiguo Egipto", age: "≈ 2.500 a.C.", img: "fp_door", imgq: "egyptian false door stela carved tomb", imgc: "an Egyptian false door carved in stone in a tomb", m: 4000, unit: "años", scl: "una puerta maciza, solo para los muertos", hue: "amber", stat: { value: 0, prefix: "0", suffix: " salida", label: "puerta de verdad, pero solo para el alma", eyebrow: "Umbral al más allá" } },
    { at: "numero seis vamos a peru", n: "06", name: "Naupa Iglesia", loc: "Andes, Perú", age: "Desconocida", img: "ni_portal", imgq: "Naupa Iglesia carved rock portal peru precise", imgc: "the precise rock-cut portal of Naupa Iglesia", m: 90, unit: "° rectos", scl: "superficies planas como un espejo, a mano", hue: "blue", stat: { value: 0, prefix: "±0", suffix: " mm", label: "precisión que hace pensar en máquinas", eyebrow: "¿Cinceles imposibles?" } },
    { at: "numero cinco nos quedamos en peru", n: "05", name: "Puerta de Hayu Marca", loc: "Lago Titicaca, Perú", age: "Leyenda", img: "hm_gate", imgq: "Hayu Marca gate of gods rock door peru", imgc: "the Hayu Marca gate carved into a cliff in Peru", m: 7, unit: "m", scl: "de puerta tallada en el acantilado", hue: "amber", stat: { value: 0, prefix: "¿", suffix: " portal?", label: "la leyenda dice que algunos la cruzaron", eyebrow: "La puerta de los dioses" } },
    { at: "numero cuatro cruzamos la frontera", n: "04", name: "La Puerta del Sol", loc: "Tiahuanaco, Bolivia", age: "≈ 500 d.C.", img: "ts_gate", imgq: "Gate of the Sun Tiwanaku monolith carved", imgc: "the monolithic Gate of the Sun at Tiwanaku", m: 10, unit: "toneladas", scl: "tallada de un solo bloque de roca durísima", hue: "blue", stat: { value: 1, suffix: " bloque", label: "símbolos astronómicos cortados con precisión", eyebrow: "Sin metal duro ni rueda" } },
    { at: "numero tres volvemos a egipto", n: "03", name: "Las cámaras de la Esfinge", loc: "Giza, Egipto", age: "Sin abrir", img: "es_sphinx", imgq: "Great Sphinx Giza radar hidden chamber", imgc: "the Great Sphinx of Giza hiding sealed chambers below", m: 0, unit: "abiertas", scl: "cavidades detectadas que no nos dejan ver", hue: "red", stat: { value: 0, prefix: "?", suffix: " permisos", label: "cámaras bajo el monumento, selladas", eyebrow: "Excavación negada" } },
    { at: "numero dos vamos a china", n: "02", name: "La tumba de Qin Shi Huang", loc: "Xi'an, China", age: "210 a.C.", img: "qn_tomb", imgq: "Qin Shi Huang tomb mound terracotta sealed", imgc: "the sealed unexcavated burial mound of Qin Shi Huang", m: 2200, unit: "años", scl: "sellada, con ríos de mercurio adentro", hue: "red", stat: { value: 2200, suffix: " años", label: "nadie se atreve a abrir la cámara del emperador", eyebrow: "Veneno de mercurio real" } },
    { at: "y llegamos al numero uno", n: "01", name: "La Bóveda B", loc: "Padmanabhaswamy, India", age: "Sigue sellada", img: "pb_door", imgq: "sealed metal door two serpents temple india", imgc: "the sealed metal Vault B door with two carved serpents", m: 20, unit: "mil M USD", scl: "ya hallado · y la Bóveda B sigue cerrada", hue: "amber", stat: { value: 0, prefix: "¿", suffix: " la abrís?", label: "una puerta de oro que nadie se atreve a tocar", eyebrow: "Sellada con 2 serpientes" } },
  ],
  // ── COMPONENTES ESTRUCTURADOS EXTRA (variedad + valor por momento; ≥6% del metraje) ──
  EXTRA: [
    { at: "repartidas por el mundo", dur: 12.0, kind: "journey", eyebrow: "Un misterio en 4 continentes", title: "Siete puertas selladas", accent: "amber", worldImage: "real/pue_worldmap.jpg", waypoints: [
      { x: 0.55, y: 0.42, label: "Egipto", dwell: 1.3, travel: 0.7 }, { x: 0.27, y: 0.66, label: "Perú", dwell: 1.3, travel: 0.7 }, { x: 0.29, y: 0.69, label: "Bolivia", dwell: 1.3, travel: 0.7 }, { x: 0.79, y: 0.40, label: "China", dwell: 1.3, travel: 0.7 }, { x: 0.69, y: 0.53, label: "India", dwell: 1.3, travel: 0.7 },
    ] },
    { at: "algunas llevan siglos cerradas", dur: 7.0, kind: "bars", eyebrow: "Antigüedad", title: "Cuánto llevan cerradas", unit: " años", accent: "accent", hue: "amber", bars: [
      { label: "Falsa puerta", value: 4500, display: "~2500 a.C." }, { label: "Pta. del Sol", value: 1500, display: "~500 d.C." }, { label: "Tumba de Qin", value: 2235, display: "210 a.C." }, { label: "Bóveda B", value: 500, display: "s. XVI" },
    ] },
    { at: "la llamamos la falsa puerta", dur: 7.0, kind: "annotated", image: "real/fp_door.jpg", eyebrow: "Una puerta para los muertos", caption: "La falsa puerta egipcia · piedra maciza detrás", hue: "amber", annotations: [
      { kind: "circle", x: 0.5, y: 0.5, w: 0.17, label: "Marco, columnas y dinteles tallados" }, { kind: "underline", x: 0.5, y: 0.82, w: 0.22, label: "No se abre: es roca maciza" },
    ] },
    { at: "planas como un espejo", dur: 7.0, kind: "annotated", image: "real/ni_portal.jpg", eyebrow: "Precisión sin metal", caption: "Naupa Iglesia · cortes imposibles a mano", hue: "blue", annotations: [
      { kind: "circle", x: 0.5, y: 0.45, w: 0.16, label: "Ángulos rectos perfectos" }, { kind: "arrow", x: 0.36, y: 0.62, fromX: 0.12, fromY: 0.82, label: "Superficie como espejo" },
    ] },
    { at: "la puerta de los dioses", dur: 7.0, kind: "aged", heading: "La Puerta de los Dioses", eyebrow: "Hayu Marca · Perú", accent: "accent", hue: "amber", lines: [
      { text: "La leyenda dice que sacerdotes la cruzaban" }, { text: "para pasar a la tierra de los dioses.", mark: true }, { text: "Algunos de los que entraron" }, { text: "nunca volvieron.", mark: true },
    ] },
    { at: "simbolos finamente grabados", dur: 6.5, kind: "annotated", image: "real/ts_gate.jpg", eyebrow: "Un calendario en piedra", caption: "Puerta del Sol · símbolos astronómicos de un solo bloque", hue: "blue", annotations: [
      { kind: "circle", x: 0.5, y: 0.34, w: 0.13, label: "Figura central radiante" }, { kind: "underline", x: 0.5, y: 0.52, w: 0.3, label: "Friso astronómico grabado" },
    ] },
    { at: "camaras y pasadizos", dur: 7.0, kind: "cross", eyebrow: "Detectadas por radar", title: "Bajo la Esfinge", hue: "red", layers: [
      { label: "Cuerpo de la Esfinge", depth: "monumento", color: "#c2a878", weight: 1.0 }, { label: "Roca madre", depth: "meseta de Giza", color: "#9c855c", weight: 1.2 }, { label: "Cavidad detectada", depth: "anomalía en el radar", color: "#7d5a3a", weight: 1.0 }, { label: "Pasadizos sellados", depth: "permiso negado", color: "#5b4026", weight: 0.9 },
    ] },
    { at: "miles y miles de guerreros", dur: 7.0, kind: "bars", eyebrow: "Solo la guardia exterior", title: "El ejército de terracota", unit: "", accent: "accent", hue: "red", bars: [
      { label: "Guerreros", value: 8000, display: "~8.000" }, { label: "Caballos", value: 670, display: "~670" }, { label: "Carros", value: 130, display: "~130" },
    ] },
    { at: "un palacio subterraneo", dur: 7.0, kind: "cross", eyebrow: "Sellada bajo tierra", title: "La tumba de Qin Shi Huang", hue: "red", layers: [
      { label: "Colina / túmulo", depth: "superficie", color: "#8a7a5c", weight: 1.1 }, { label: "Ejército de terracota", depth: "guardia exterior", color: "#b08d57", weight: 1.0 }, { label: "Cámara sellada del emperador", depth: "intacta 2.200 años", color: "#6b4f2a", weight: 1.4 }, { label: "Ríos de mercurio", depth: "veneno líquido", color: "#9aa6b2", weight: 0.8 },
    ] },
    { at: "el lugar de culto mas rico", dur: 7.0, kind: "bars", eyebrow: "El templo más rico de la Tierra", title: "El tesoro hallado", unit: " mil M USD", accent: "accent", hue: "amber", bars: [
      { label: "Tutankamón", value: 1, display: "~$1 mil M" }, { label: "Ya hallado", value: 20, display: "~$20 mil M" }, { label: "Bóveda B (sin abrir)", value: 20, display: "¿+?" },
    ] },
    { at: "dos enormes serpientes", dur: 6.0, kind: "callout", figure: "2", image: "real/pb_door.jpg", eyebrow: "Bóveda B · Padmanabhaswamy", caption: "serpientes custodian la puerta — sin cerradura ni bisagras", accent: "accent", hue: "amber" },
    { at: "un portal de un solo sentido", dur: 5.5, kind: "callout", figure: "1", image: "real/fp_door.jpg", eyebrow: "Falsa puerta egipcia", caption: "un solo sentido: solo el alma la cruza, nunca un vivo", accent: "accent", hue: "amber" },
    { at: "esto parece hecho con maquinas", dur: 5.5, kind: "callout", figure: "?", image: "real/ni_portal.jpg", eyebrow: "Naupa Iglesia", caption: "cortes tan limpios que parecen de máquina", accent: "accent", hue: "blue" },
    { at: "una hornacina mas pequena", dur: 6.0, kind: "annotated", image: "real/hm_gate.jpg", eyebrow: "Hayu Marca", caption: "el nicho central, del tamaño exacto de una persona", hue: "amber", annotations: [
      { kind: "circle", x: 0.5, y: 0.66, w: 0.1, label: "Hornacina del tamaño de una persona" },
    ] },
    { at: "un solo bloque de piedra", dur: 6.0, kind: "splitlist", title: "No tenían… y aun así la tallaron", cross: true, palette: "B", items: ["Sin hierro", "Sin la rueda", "Sin herramientas de metal duro"] },
    { at: "los permisos para excavar", dur: 6.5, kind: "checklist", eyebrow: "Bajo la Esfinge", title: "Por qué no las abren", accent: "danger", hue: "red", items: [
      { text: "Anomalías confirmadas por radar", state: "done" }, { text: "Permisos de excavación negados", state: "todo" }, { text: "¿Conservación… o algo más?", state: "doing" },
    ] },
    { at: "protegida por un mantra", dur: 6.5, kind: "aged", heading: "La advertencia", eyebrow: "Bóveda B", accent: "danger", hue: "red", lines: [
      { text: "Solo un mantra sagrado la abre sin daño." }, { text: "Quien la fuerce", mark: true }, { text: "desatará una desgracia", mark: true }, { text: "imposible de deshacer." },
    ] },
    { at: "tambien construyo para esconder", dur: 7.0, kind: "checklist", eyebrow: "Una misma lección", title: "Lo que comparten las 7", accent: "accent", hue: "amber", items: [
      { text: "Selladas a propósito, no por descuido", state: "done" }, { text: "Una advertencia que cruzó los siglos", state: "done" }, { text: "Precisión o riqueza que no sabemos explicar", state: "done" }, { text: "Podemos abrirlas… y elegimos no hacerlo", state: "doing" },
    ] },
  ],
};
