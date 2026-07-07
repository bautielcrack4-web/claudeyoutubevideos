// gen_federer2.mjs — beatsheet/federer2.json (Canal "Dr. Federer" · Video 2 CAFÉ).
// Avatar médico (federer2_opt.mp4 provee el audio). Anclaje por FRASE al ms exacto
// de captions_federer2.json. Look CLÍNICO (THEME_MEDICO, blanco/teal). Clona la
// arquitectura del Video 1 (gen_federer.mjs): emite federer2_beats.ts + federer2_hooks.ts
// + prompts (gpt-image fotos) + prompts_diag (diagramas) + clips LTX + stock (Pexels).
//
// Flujo:
//   node gen_federer2.mjs
//   node gen_images.mjs public/img/prompts_federer2.json         # fotos gpt-image-2 low
//   OPENAI_IMAGE_MODEL=gpt-image-2-2026-04-21 node gen_images.mjs public/img/prompts_federer2_diag.json
//   node fetch_pexels.mjs public/broll/stock_federer2.json       # clips reales
//   node gen_video.mjs public/vid/clips_federer2.json            # anima stills
import fs from "fs";

// ── PROMPT DE FOTOS = gpt-image-2 LOW, fórmula CORTA-IMPERFECTA ──
const IMPERF = "Que se vea como una foto casera real: leve desenfoque en algunas zonas, ligera inclinación de cámara, luz desigual, piel y texturas reales, manos naturales con dedos correctos, fondo algo desordenado, pequeñas imperfecciones, nada perfecto, nada pulido, sin apariencia de IA, estilo documental auténtico, saturación baja, colores suaves y ligeramente apagados. Sin texto legible.";
const P = (d) => `Foto documental muy realista, 16:9. ${d}. ${IMPERF}`;
// persona mayor (paciente) — sujeto recurrente para hook/beneficios (NO es Federer)
const OLD = (d) => P(`una persona mayor sana de unos 70 años, ${d}, luz natural suave de interior`);
// diagrama médico CLÍNICO (paleta THEME_MEDICO: blanco/teal, esquina sup-der libre)
const DP = (d) => `Crear una infografía médica horizontal, RELACIÓN DE ASPECTO EXACTA 16:9 (1792x1024), estilo lámina científica editorial limpia y premium. Fondo blanco/gris muy claro, líneas azul-petróleo oscuro, acentos en verde-agua/teal (#109C99) y un toque de coral apagado. ${d}. DEJÁ COMPLETAMENTE LIBRE la esquina superior derecha (limpia, sin dibujos ni texto) para colocar el avatar. Composición minimalista, mucho espacio en blanco, pocos bloques grandes, ilustración de trazo fino y suave, se entiende en 1 segundo. Textos en español, breves. Estética: ilustración médica moderna, infografía de salud premium, limpia y confiable. Evitá verse escolar/infantil/sobrecargado.`;

// helpers de beat ────────────────────────────────────────────────────────────
const r  = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: P(prompt) }, ...o });
const ro = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: OLD(prompt) }, ...o }); // paciente mayor
const st = (name, o = {}) => ({ t: "raw", name, ...o }); // clip REAL de Pexels (name ∈ STOCK) — sin gen IA
const rv = (name, prompt, o = {}) => ({ t: "raw", name, clip: true, gen: { type: "clip", image: name, prompt: P(prompt), frames: o.frames || 90 }, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
let fSide = 0;
const fimg = (name, prompt, o = {}) => ({ t: "float", name, gen: { type: "image", name, prompt: P(prompt) }, side: (fSide++ % 2 ? "left" : "right"), ...o });
const half = (name, prompt, o = {}) => ({ t: "half", name, side: "right", gen: { type: "image", name, prompt: P(prompt) }, ...o });
// BlurExplainer — clip de fondo (se difumina) + imagen inset + texto que se tipea.
let beCnt = 0;
const blur = (bg, ins, { eyebrow = "", title = "", body = "", side = beCnt++ % 2 ? "left" : "right", at } = {}) => ({
  t: "blurexplainer",
  clip: `img/${bg.name}.png`, image: `img/${ins.name}.png`,
  eyebrow, title, body, side, at,
  _gens: [bg.gen, ins.gen].filter(Boolean),
});
const g  = (name, prompt) => ({ name, gen: { type: "image", name, prompt: P(prompt) } });

// diagramas (gpt-image-2 clínicos)
const DIAGRAMS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };

// ── STOCK/CLIP-FIRST: beats de acción/personas/objetos = footage REAL (broll/).
// name → query en inglés. fetch_pexels baja a public/broll/<name>.mp4. NO IA.
const STOCK = {
  // hook — manos/pies fríos, café mañana
  fe2_manos_frias: "elderly cold hands rubbing together", fe2_pies_hielo: "senior feet cold under blanket at night", fe2_piernas_pesadas: "tired senior legs sitting on sofa",
  fe2_cafe_manana: "pouring black coffee into cup morning", fe2_taza_vapor: "steaming cup of black coffee closeup", fe2_mano_taza: "elderly hands holding warm coffee mug",
  // consultorio / doctor
  fe2_paciente_sienta: "senior patient sitting in doctor office", fe2_medico_escucha: "doctor listening to elderly patient",
  // café / preparación
  fe2_granos_cafe: "roasted coffee beans falling closeup", fe2_cafe_filtro: "pour over coffee filter dripping", fe2_espresso_maquina: "espresso machine pouring shot",
  fe2_azucar_cuchara: "spoon of sugar into coffee cup", fe2_cafe_sirve: "black coffee being poured slow motion", fe2_cafetera: "moka pot coffee brewing on stove",
  fe2_cold_brew: "cold brew coffee pouring over ice", fe2_mate: "argentine mate being poured hot water",
  // cuerpo / circulación
  fe2_lab_micro: "scientist looking through microscope lab", fe2_corazon_late: "human heart anatomy medical animation", fe2_sangre_flujo: "blood flowing through vein animation",
  fe2_caminar_manana: "senior couple walking in park morning", fe2_dormir_mal: "elderly person awake in bed at night", fe2_agua_vaso: "senior drinking glass of water",
  fe2_pastillas: "elderly hand holding pills medication", fe2_verduras_hierro: "lentils and spinach on kitchen table",
  // clips de acción (motion real)
  fe2_verter_cafe: "slow motion pouring coffee into white cup", fe2_revolver_cafe: "stirring coffee with spoon closeup", fe2_gotas_filtro: "coffee dripping from filter closeup",
};

const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.0, stat: 1.0, aged: 1.2, checklist: 1.2, splitlist: 1.1, bars: 1.25, cross: 1.25, process: 1.5, journey: 2.6, infzoom: 1.3, annotated: 1.3, callout: 1.1, chips: 1.1, ingredients: 1.4, diagram: 2.4, blurexplainer: 2.8, float: 1.2, half: 1.6, depthtext: 1.2, nametag: 1.3, pizarra: 2.2, board: 3.0 };

// ── SECCIONES (cada una ancla por una frase real del transcript) ─────────────
const SECTIONS = [
  // ░░ HOOK ░░ — avatar abre ~1.3s; Main pone AvatarScrimText "CAFÉ" encima
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    st("fe2_manos_frias", { at: "mirate las manos", kicker: "¿Manos frías?" }),
    st("fe2_pies_hielo", { at: "los pies como si fueran de hielo" }),
    st("fe2_piernas_pesadas", { at: "te pesan las piernas" }),
    ro("fe2_vecino_consejo", "a worried adult child telling an older parent to stop drinking coffee, kitchen", { at: "que dejes el cafe", kicker: "«Dejá el café»" }),
    r("fe2_taza_negra_hook", "a single cup of black coffee steaming on a table, morning light, inviting", { at: "va exactamente en contra", hold: true }),
  ]},
  { key: "detalle", phrase: "hay un detalle sobre el cafe", beats: [
    c("headline", { tokens: ["No", "es", "solo", "el", { t: "azúcar" }], eyebrow: "El detalle que casi nadie sabe", bg: "image", image: "img/fe2_taza_negra_hook.png" }),
    c("chips", { bg: "image", image: r("fe2_cafe_rutina", "someone preparing their morning coffee out of habit, kitchen counter").gen.name, imageDarken: 0.6, title: "Cada mañana, sin pensarlo", chips: ["Cómo lo tomás", "Cuándo lo tomás", "Cuál café tomás"], _genImg: "fe2_cafe_rutina", _prompt: P("someone preparing their morning coffee out of habit, kitchen counter") }),
  ]},
  { key: "promesa", phrase: "si llegas hasta el final", beats: [
    r("fe2_taza_vapor_i", "a close macro of steam rising from a hot cup of black coffee, dark background"),
    c("stat", { value: 3, prefix: "", suffix: " o 4 errores", label: "que hacés con tu café sin darte cuenta", eyebrow: "Y se corrigen desde mañana" }),
  ]},
  // ░░ IDENTIDAD ░░
  { key: "presenta", phrase: "dejame que me presente", beats: [
    c("talk", {}),
    c("nametag", { name: "Dr. Federer", role: "Médico · más de una década de consultorio" }),
    r("fe2_consultorio", "a warm doctor's consulting room with a desk and a window, natural light, welcoming"),
  ]},
  { key: "confieso", phrase: "yo tomo todos los dias", beats: [
    r("fe2_federer_cafe", "a friendly 38 year old doctor calmly drinking a cup of black coffee at his desk, white coat, natural light", { kicker: "Yo también lo tomo, sin culpa" }),
    c("headline", { tokens: ["La", "ciencia", "de", "HOY.", "No", "la", "de", "hace", { t: "20 años" }], eyebrow: "Lo que cambió", bg: "image", image: "img/fe2_consultorio.png" }),
  ]},
  { key: "pacientes", phrase: "perdi la cuenta de los pacientes", beats: [
    { ...ro("fe2_paciente_susurro", "an older patient leaning in and asking the doctor a question quietly, almost ashamed, clinic", { kicker: "«Doctor, ¿puedo seguir tomando café?»" }) },
    c("quote", { image: r("fe2_paciente_culpa", "an older person looking guilty holding a coffee cup, soft indoor light").gen.name, text: "Como si estuviera pidiendo *permiso* para algo malo.", _genImg: "fe2_paciente_culpa", _prompt: P("an older person looking guilty holding a coffee cup, soft indoor light") }),
  ]},
  { key: "angulo", phrase: "no el de que le echas al cafe", beats: [
    c("splitlist", { title: "El ángulo que casi nunca escuchás", items: ["No QUÉ le echás", "Sino CÓMO lo tomás", "CUÁNDO y CUÁL café"], palette: "G" }),
  ]},
  // ░░ CÓMO ENVEJECE LA CIRCULACIÓN ░░
  { key: "circ60", phrase: "para que entiendas todo lo que viene", beats: [
    ro("fe2_circ_40vs60", "a thoughtful older person looking at their hands, contemplative, window light"),
    c("headline", { tokens: ["A", "los", "60", "no", "es", "como", "a", "los", { t: "40" }], eyebrow: "Tu circulación cambió", bg: "image", image: "img/fe2_circ_40vs60.png" }),
  ]},
  { key: "arterias", phrase: "con los anos las arterias", beats: [
    c("diagram", { eyebrow: "Qué le pasa a tus arterias", slides: [{ image: dg("dg_fe2_arteria_rigida", "Diagrama médico limpio de una arteria que con la edad pierde elasticidad: a la izquierda una arteria joven flexible y abierta, a la derecha una arteria mayor más rígida y estrecha, como una goma reseca. Comparación simple izquierda-derecha, etiquetas 'arteria joven' y 'arteria con la edad'."), eyebrow: "Pierden elasticidad, se vuelven rígidas" }] }),
    r("fe2_goma_sol", "an old rubber band left in the sun, dried and stiff, macro on a wooden surface"),
  ]},
  { key: "endotelio", phrase: "hay una capa de celulas finisima", beats: [
    c("annotated", { image: r("fe2_endotelio_ins", "a soft medical illustration of the smooth inner lining of an artery, thin cell layer, teal tones").gen.name, eyebrow: "El endotelio", caption: "La capa que recubre cada arteria, más fina que un papel", annotations: [{ kind: "circle", x: 50, y: 50, label: "Endotelio" }], _genImg: "fe2_endotelio_ins", _prompt: P("a soft medical illustration of the smooth inner lining of an artery, thin cell layer, teal tones") }),
  ]},
  { key: "tuberia", phrase: "imaginate el interior de una tuberia", beats: [
    blur(
      g("fe2_tuberia_bg", "the inside of an old metal pipe, one half smooth and clean, the other half clogged with buildup, macro"),
      g("fe2_placa_ins", "a stylized medical illustration of fatty plaque building up inside an artery wall, teal and coral"),
      { eyebrow: "Aterosclerosis", title: "Como una cañería que se tapa", body: "La grasa y el calcio se pegan a la pared. Es la 1ª causa de infartos y ACV.", at: "imaginate el interior de una tuberia" }
    ),
    c("diagram", { eyebrow: "Tubería lisa vs. tapada", slides: [{ image: dg("dg_fe2_placa", "Diagrama médico de dos tubos en corte lado a lado: uno LISO y limpio por dentro con sangre fluyendo libre, y otro con placas de grasa y calcio pegadas a las paredes obstruyendo el paso. Flechas de flujo. Etiquetas 'sangre fluye libre' y 'placa: aterosclerosis'. Limpio, médico."), eyebrow: "Cuando se tapa: aterosclerosis" }] }),
  ]},
  { key: "oxidonitrico", phrase: "pero aca esta la clave", beats: [
    c("diagram", { eyebrow: "El endotelio está vivo", slides: [
      { image: dg("dg_fe2_no1", "Diagrama médico: el endotelio fabrica una molécula llamada óxido nítrico que le ordena a la arteria RELAJARSE y ABRIRSE. Una arteria abriéndose con flechas hacia afuera, la sangre pasa mejor, manos y pies calientes. Etiqueta 'óxido nítrico = arteria abierta'. Limpio, teal."), eyebrow: "Óxido nítrico: abre la arteria" },
      { image: dg("dg_fe2_no2", "Diagrama médico contraste: cuando falta óxido nítrico la arteria se CIERRA y estrecha, la sangre cuesta más, aparecen manos frías y tensión alta. Una arteria estrechada con flechas hacia adentro. Etiqueta 'sin óxido nítrico = manos frías, tensión alta'."), eyebrow: "Sin él: manos frías, tensión alta" } ] }),
    ro("fe2_manos_calientes", "an older person's hands feeling warm and comfortable, relaxed, warm light"),
  ]},
  { key: "menosno", phrase: "produce cada vez menos oxido nitrico", beats: [
    c("board", { eyebrow: "El endotelio decide", title: "Qué hace el óxido nítrico", side: "left", items: [
      { image: "img/fe2_manos_calientes.png", title: "Con óxido nítrico", sub: "la arteria se abre · manos y pies calientes", tone: "teal" },
      { image: "img/fe2_dedos_frios.png", title: "Sin óxido nítrico", sub: "la arteria se cierra · manos frías, tensión alta", tone: "coral" },
      { title: "Después de los 60", sub: "tu cuerpo fabrica cada vez menos, solo", tone: "blue" },
    ] }),
  ]},
  // ░░ EFECTO 1 — ENDOTELIO / COMPUESTOS ░░
  { key: "aguanta", phrase: "aguanta este dato", beats: [
    c("rule", { number: "01", title: "El café y tu endotelio", w: 3.4 }),
    r("fe2_taza_ciencia", "a cup of black coffee next to a subtle science notebook, warm desk, no legible text"),
  ]},
  { key: "compuestos", phrase: "el cafe no es agua sucia", beats: [
    c("stat", { value: 1000, suffix: "+", label: "compuestos distintos en una sola taza de café", eyebrow: "No es solo cafeína" }),
    c("annotated", { image: r("fe2_grano_macro", "a macro shot of a single roasted coffee bean split open, rich detail, warm").gen.name, eyebrow: "El ácido clorogénico", caption: "Un polifenol de la familia del vino tinto y el aceite de oliva", annotations: [{ kind: "circle", x: 50, y: 50, label: "Ácido clorogénico" }], _genImg: "fe2_grano_macro", _prompt: P("a macro shot of a single roasted coffee bean split open, rich detail, warm") }),
  ]},
  { key: "revision20", phrase: "una revision que junto mas de veinte", beats: [
    c("bars", { title: "Lo que dicen los estudios", unit: "", bars: [
      { label: "Estudios revisados", value: 20, tone: "cold" },
      { label: "Mejoran el endotelio", value: 17, winner: true } ] }),
    c("headline", { tokens: ["Mejora", "la", "función", "del", { t: "endotelio" }], eyebrow: "La mayoría de los estudios", bg: "image", image: r("fe2_estudios_bg", "stacked medical research papers on a desk, soft light, no legible text").gen.name, _genImg: "fe2_estudios_bg", _prompt: P("stacked medical research papers on a desk, soft light, no legible text") }),
  ]},
  { key: "microvasos", phrase: "y hay mas algo todavia mas fino", beats: [
    c("diagram", { eyebrow: "Los microvasos", slides: [{ image: dg("dg_fe2_microvasos", "Diagrama médico de los vasos sanguíneos más finos (microvasos) del cuerpo, finos como un cabello, llegando a las zonas alejadas: dedos de las manos, dedos de los pies, riñones y retina del ojo. Silueta simple de un cuerpo con esas 4 zonas señaladas con líneas finas. Etiqueta 'microvasos: donde la circulación falla primero'."), eyebrow: "Dedos, pies, riñones, retina" }] }),
    c("board", { eyebrow: "Donde se nota primero", title: "Los microvasos que fallan", side: "left", items: [
      { title: "Los dedos de las manos", sub: "se enfrían, se entumecen", tone: "teal" },
      { title: "Los pies", sub: "helados aunque haga calor", tone: "teal" },
      { title: "Los riñones", sub: "filtran menos que antes", tone: "blue" },
      { title: "La vista", sub: "la retina se cansa", tone: "blue" },
    ] }),
  ]},
  // ░░ CASO MARTA ░░
  { key: "marta", phrase: "te cuento el caso de marta", beats: [
    ro("fe2_marta_retrato", "a documentary portrait of a 66 year old widow, kind tired face, sitting in a clinic", { hold: true, kicker: "Marta, 66 años" }),
    ro("fe2_marta_medias", "an older woman wearing two pairs of thick socks in summer, feet cold, bedroom"),
    c("quote", { image: r("fe2_marta_sonrisa", "a 66 year old woman smiling gently and relieved in a clinic, warm light").gen.name, text: "Doctor, ya no necesito las medias en *enero*.", _genImg: "fe2_marta_sonrisa", _prompt: P("a 66 year old woman smiling gently and relieved in a clinic, warm light") }),
  ]},
  // ░░ GENÉTICA CAFEÍNA ░░
  { key: "cyp1a2", phrase: "no todos metabolizamos la cafeina", beats: [
    c("diagram", { eyebrow: "Por qué a cada uno le cae distinto", slides: [{ image: dg("dg_fe2_cyp1a2", "Diagrama médico simple de un gen (CYP1A2) que hace que dos personas procesen la cafeína distinto: a la izquierda 'metabolizador RÁPIDO' (la elimina en pocas horas, reloj corto), a la derecha 'metabolizador LENTO' (tarda el doble o triple, reloj largo). Dos columnas con una figurita y un reloj cada una. Limpio."), eyebrow: "Metabolizador rápido vs. lento" }] }),
    c("callout", { image: r("fe2_cafe_tarde_desvela", "an older person lying awake in bed at night after an afternoon coffee, alarm clock glowing").gen.name, figure: "La pista", caption: "Si un café a la tarde te desvela, sos de los lentos.", _genImg: "fe2_cafe_tarde_desvela", _prompt: P("an older person lying awake in bed at night after an afternoon coffee, alarm clock glowing") }),
  ]},
  // ░░ EFECTO 2 — TENSIÓN ░░
  { key: "tension_duda", phrase: "mas me plantean en consultorio", beats: [
    c("rule", { number: "02", title: "El café y la tensión", w: 3.4 }),
    ro("fe2_tensiometro", "a blood pressure cuff on an older person's arm, home health check, soft light"),
  ]},
  { key: "tolerancia", phrase: "es como cuando alguien prueba", beats: [
    c("headline", { tokens: ["El", "cuerpo", "desarrolla", { t: "tolerancia" }], eyebrow: "En cuestión de días", bg: "image", image: r("fe2_picante", "a person tasting something spicy for the first time reacting, then unfazed, warm kitchen").gen.name, _genImg: "fe2_picante", _prompt: P("a person tasting something spicy for the first time reacting, warm kitchen") }),
  ]},
  { key: "estudios_tension", phrase: "los grandes estudios lo confirman", beats: [
    c("bars", { title: "Consumo habitual y tensión alta", unit: "", bars: [
      { label: "Seguimiento (mil personas)", value: 100, tone: "cold" },
      { label: "Años de seguimiento", value: 10, tone: "cold" },
      { label: "Riesgo si tomás más café", value: 0, winner: true, note: "menor, no mayor" } ] }),
    c("stat", { value: 25, suffix: " estudios", label: "más café se asoció a un riesgo algo MENOR de tensión alta", eyebrow: "Un análisis de" }),
  ]},
  { key: "matiz_hora", phrase: "pero aca viene el matiz nuevo", beats: [
    c("diagram", { eyebrow: "El factor que sí importa: la HORA", slides: [{ image: dg("dg_fe2_hora", "Diagrama de una línea de tiempo de un día (mañana a noche): un café tomado a las 5 de la tarde y una barra que muestra que la cafeína sigue en la sangre 5 a 6 horas después, llegando a las 11 de la noche cuando la persona quiere dormir. Reloj, taza a las 5pm, cama a las 11pm. Etiqueta 'la cafeína tarda 5-6 h en irse'."), eyebrow: "Un café de las 5 sigue a las 11 de la noche" }] }),
    rv("fe2_cafe_tarde_clip", "a cup of coffee on a table late afternoon, long shadows, warm", { frames: 75 }),
  ]},
  { key: "dormir", phrase: "dormir mal estropea la circulacion", beats: [
    c("diagram", { eyebrow: "El sueño repara tus arterias", slides: [{ image: dg("dg_fe2_sueno", "Diagrama médico: durante el sueño la tensión baja de forma natural y las arterias descansan y se reparan. Una silueta durmiendo tranquila con una línea de tensión que baja, y al lado una persona que duerme mal con la línea alta y arterias más castigadas. Contraste noche buena vs mala. Limpio."), eyebrow: "Dormir mal = tensión peor controlada" }] }),
    st("fe2_dormir_mal", {}),
  ]},
  { key: "regla_hora", phrase: "la regla es simple", beats: [
    c("checklist", { title: "La regla del horario", items: [
      { text: "Café de la mañana al mediodía", state: "done" },
      { text: "Después de las 3-4 pm: mejor no", state: "warn" },
      { text: "Tensión muy alta o arritmia: consultá", state: "warn" } ] }),
  ]},
  // ░░ EFECTO 3 — HIDRATACIÓN (MITO) ░░
  { key: "deshidrata", phrase: "tercer efecto y este va contra", beats: [
    c("rule", { number: "03", title: "El mito de que deshidrata", w: 4.0 }),
    c("headline", { tokens: ["«El", "café", "te", "quita", { t: "agua" }, "»"], eyebrow: "El mito de siempre", bg: "image", image: r("fe2_vaso_agua_cafe", "a glass of water next to a cup of coffee on a table, soft light").gen.name, _genImg: "fe2_vaso_agua_cafe", _prompt: P("a glass of water next to a cup of coffee on a table, soft light") }),
  ]},
  { key: "sangre_espesa", phrase: "la sangre se vuelve mas espesa", beats: [
    c("diagram", { eyebrow: "Por qué importa a tu edad", slides: [{ image: dg("dg_fe2_espesa", "Diagrama médico: con la edad se apaga la sensación de sed; si se bebe poco la sangre se vuelve más espesa y densa, circula más lento por los vasos finos y aumenta el riesgo de coágulos. Comparación: sangre fluida (agua) vs sangre espesa (lenta) en un vaso fino. Etiqueta 'poca agua = sangre espesa'."), eyebrow: "Sangre espesa = mala circulación" }] }),
    ro("fe2_toma_agua", "an older person drinking a glass of water at home, healthy habit, daylight", { kicker: "El café suma agua, no resta" }),
  ]},
  // ░░ EFECTO 4 — ACV ░░
  { key: "acv", phrase: "cuarto efecto y para mi el mas importante", beats: [
    c("rule", { number: "04", title: "El café y el ACV", w: 3.4 }),
    c("diagram", { eyebrow: "La circulación más delicada", slides: [{ image: dg("dg_fe2_cerebro", "Diagrama médico del cerebro y sus vasos finísimos: consume mucha sangre y oxígeno; cuando uno de esos vasos se tapa o se rompe ocurre el ACV (ictus). Silueta de cabeza con red de vasos finos, uno marcado como obstruido. Limpio, serio, teal y coral."), eyebrow: "Vasos finísimos que se deterioran" }] }),
  ]},
  { key: "acv_menor", phrase: "un riesgo algo menor de sufrir", beats: [
    c("stat", { value: 1, prefix: "", suffix: "", label: "consumo moderado = riesgo algo MENOR de ACV que no tomar nada", eyebrow: "Cientos de miles de personas" }),
    c("splitlist", { title: "Por qué protege", items: ["Cuida el endotelio", "Baja la inflamación", "Menos riesgo de diabetes"], palette: "G" }),
  ]},
  { key: "moderado", phrase: "la palabra clave es moderado", beats: [
    c("stat", { value: 3, prefix: "", suffix: " tazas", label: "unas pocas al día: más NO es más protección", eyebrow: "La palabra clave: moderado" }),
    ro("fe2_dos_tazas", "two cups of coffee on a table through the day, moderate amount, warm home light"),
  ]},
  { key: "descafeinado", phrase: "y para quien no tolera", beats: [
    c("callout", { image: r("fe2_descafeinado", "a cup of decaf coffee, calm evening table, warm light").gen.name, figure: "Descafeinado", caption: "Conserva casi todos los polifenoles: se saca la cafeína, no el beneficio.", _genImg: "fe2_descafeinado", _prompt: P("a cup of decaf coffee, calm evening table, warm light") }),
  ]},
  // ░░ EFECTO 5 — HIERRO ░░
  { key: "hierro", phrase: "quinto efecto", beats: [
    c("rule", { number: "05", title: "El café y el hierro", w: 3.4 }),
    c("diagram", { eyebrow: "El error silencioso", slides: [{ image: dg("dg_fe2_hierro", "Diagrama médico: los polifenoles del café, tomado JUSTO después de comer, dificultan que el cuerpo absorba el hierro de las verduras, legumbres y cereales. Un plato de lentejas y espinaca con una flecha de hierro que intenta entrar al cuerpo pero una taza de café la bloquea. Etiqueta 'café pegado a la comida = menos hierro'. Limpio."), eyebrow: "Bloquea el hierro de la comida" }] }),
    st("fe2_verduras_hierro", {}),
  ]},
  { key: "delia", phrase: "paciente delia 72", beats: [
    ro("fe2_delia_cansada", "a tired 72 year old woman with low energy sitting at home, pale, honest light", { kicker: "Delia, 72 años · cansancio sin causa" }),
    c("stat", { value: 1, prefix: "", suffix: " hora", label: "de diferencia entre comer y el café: el hierro mejoró solo", eyebrow: "La solución sencilla" }),
  ]},
  { key: "medicacion", phrase: "si tomas la pastilla del tiroides", beats: [
    c("checklist", { title: "Café y pastillas: separalos", items: [
      { text: "Tiroides (levotiroxina) en ayunas", state: "warn" },
      { text: "Esperá 30-45 min antes del café", state: "done" },
      { text: "Tensión/corazón: consultá siempre", state: "warn" } ] }),
    st("fe2_pastillas", {}),
  ]},
  // ░░ DIABETES + INFLAMACIÓN ░░
  { key: "diabetes", phrase: "la relacion entre el cafe y la diabetes", beats: [
    c("bars", { title: "Café habitual y diabetes tipo 2", unit: "", bars: [
      { label: "No toma café", value: 100, tone: "danger", note: "más riesgo" },
      { label: "Toma café habitual", value: 70, winner: true, note: "menos riesgo" } ] }),
    c("annotated", { image: r("fe2_inflamacion_ins", "a soft medical illustration of low-grade inflammation calming down inside a blood vessel, teal").gen.name, eyebrow: "Menos inflamación", caption: "El mismo compuesto calma el fueguito inflamatorio de fondo", annotations: [{ kind: "circle", x: 50, y: 50, label: "Proteína C reactiva ↓" }], _genImg: "fe2_inflamacion_ins", _prompt: P("a soft medical illustration of low-grade inflammation calming down inside a blood vessel, teal") }),
  ]},
  // ░░ CAFÉ + CAMINATA ░░
  { key: "caminata", phrase: "si podes despues del cafe", beats: [
    c("process", { title: "El truco de la mañana", eyebrow: "Se recetan juntos", steps: [
      { title: "Café sin azúcar", desc: "abre los vasos", image: r("fe2_cam_cafe", "a cup of black coffee on a kitchen table in the morning, bright").gen.name, _genImg: "fe2_cam_cafe", _prompt: P("a cup of black coffee on a kitchen table in the morning, bright") },
      { title: "Caminar 10 minutos", desc: "el movimiento lo potencia", image: r("fe2_cam_camina", "an older person walking outdoors in the morning, light exercise, park").gen.name, _genImg: "fe2_cam_camina", _prompt: P("an older person walking outdoors in the morning, park") } ] }),
    rv("fe2_caminar_clip", "a senior walking slowly in a park in the morning light, gentle exercise", { frames: 90, kicker: "Lo más barato para la circulación" }),
  ]},
  // ░░ COLD BREW / MATE ░░
  { key: "coldbrew", phrase: "el cafe frio preparado en frio", beats: [
    r("fe2_coldbrew_i", "a glass of cold brew coffee over ice on a summer table, condensation, bright", { kicker: "Cold brew: más suave para el estómago" }),
  ]},
  { key: "mate", phrase: "y ya que estamos en nuestra tierra", beats: [
    c("splitlist", { title: "¿Y el mate?", items: ["Comparte los polifenoles del café", "Cafeína más gradual", "El riesgo: el agua muy caliente"], palette: "A" }),
    rv("fe2_mate_clip", "pouring hot water into an argentine mate gourd with a metal straw, close, warm", { frames: 90, at: "el mate", kicker: "Mate o café: misma lógica" }),
  ]},
  // ░░ PREPARACIÓN ░░
  { key: "preparacion", phrase: "como lo preparas tambien cuenta", beats: [
    c("diagram", { eyebrow: "El filtro cuida tu colesterol", slides: [{ image: dg("dg_fe2_filtro", "Diagrama médico: el café hervido y SIN filtrar deja pasar sustancias naturales (diterpenos) que pueden subir el colesterol malo; un simple filtro de papel las atrapa. Comparación: taza de café de olla sin filtrar (con partículas) vs café de filtro de papel (limpio). Etiqueta 'filtro de papel = retiene lo que sube el colesterol'."), eyebrow: "Filtrado vs. hervido sin filtrar" }] }),
    c("board", { eyebrow: "El café que te cuida", title: "Bien tomado, se resume así", side: "left", items: [
      { image: "img/fe2_metodos_cafe.png", title: "De filtro, cápsula o espresso", sub: "el papel retiene lo que sube el colesterol", tone: "teal" },
      { image: "img/fe2_cafe_ardiendo.png", title: "Caliente, no ardiendo", sub: "dejalo reposar 2 minutos (OMS: 65°)", tone: "coral" },
      { image: "img/fe2_descafeinado.png", title: "¿No tolerás cafeína?", sub: "el descafeinado conserva los polifenoles", tone: "blue" },
    ] }),
  ]},
  { key: "temperatura", phrase: "y la temperatura", beats: [
    c("stat", { value: 65, suffix: "°", label: "arriba de esta temperatura la OMS asocia daño en el esófago", eyebrow: "Bebidas muy calientes" }),
    c("callout", { image: r("fe2_cafe_ardiendo", "a cup of very hot steaming coffee, someone about to sip too soon, kitchen").gen.name, figure: "2 minutos", caption: "Dejalo reposar. Caliente y rico, pero no ardiendo.", _genImg: "fe2_cafe_ardiendo", _prompt: P("a cup of very hot steaming coffee, someone about to sip, kitchen") }),
  ]},
  // ░░ AZÚCAR ░░
  { key: "azucar", phrase: "y por supuesto si el azucar", beats: [
    c("rule", { number: "★", title: "El azúcar", w: 2.6 }),
    c("diagram", { eyebrow: "Por qué se anula el beneficio", slides: [{ image: dg("dg_fe2_azucar", "Diagrama médico metafórico: el café es antiinflamatorio pero el azúcar INFLAMA las arterias y genera picos de glucosa; las dos cosas se anulan como un tira y afloja. Una balanza: de un lado 'café: antiinflamatorio', del otro 'azúcar: inflama'. Etiqueta 'se anulan'. Limpio, teal y coral."), eyebrow: "Antiinflamatorio vs. algo que inflama" }] }),
    st("fe2_azucar_cuchara", { kicker: "Una montaña de azúcar por día" }),
  ]},
  { key: "azucar_frase", phrase: "yo creia que tomaba cafe", beats: [
    c("quote", { image: r("fe2_azucar_sabor", "a very sweet milky coffee with lots of sugar on a table, indulgent, warm light").gen.name, text: "Yo creía que tomaba café, y resulta que tomaba *azúcar con sabor a café*.", _genImg: "fe2_azucar_sabor", _prompt: P("a very sweet milky coffee with lots of sugar on a table, warm light") }),
    c("stat", { value: 1, prefix: "½ cuchara", suffix: "/semana", label: "bajala de a poco: en un mes lo tomás solo", eyebrow: "Sin sufrir" }),
  ]},
  // ░░ EL CONJUNTO ░░
  { key: "conjunto", phrase: "no hace milagro solo", beats: [
    c("splitlist", { title: "El café es una pieza", items: ["Moverte cada día", "Tomar agua", "Dormir bien", "Menos ultraprocesados"], palette: "G" }),
    r("fe2_rompecabezas", "puzzle pieces coming together on a table, concept of the whole picture, warm light"),
  ]},
  // ░░ CIERRE EMOCIONAL ░░
  { key: "cierre_emo", phrase: "quiero cerrar con algo", beats: [
    c("talk", {}),
    r("fe2_bar_esquina", "an old neighborhood cafe bar with people chatting over coffee, warm nostalgic light, spain argentina", { hold: true }),
    c("quote", { image: r("fe2_cortado_amigos", "two older friends sharing coffee at a cafe table, laughing, warm afternoon").gen.name, text: "El café es el ritual que *ordena el día*.", _genImg: "fe2_cortado_amigos", _prompt: P("two older friends sharing coffee at a cafe table, laughing, warm afternoon") }),
  ]},
  { key: "sin_culpa", phrase: "hacelo con tranquilidad", beats: [
    ro("fe2_disfruta_cafe", "an older person enjoying a cup of coffee calmly by a window, peaceful, morning light", { kicker: "Sin culpa. Te estás cuidando." }),
  ]},
  // ░░ DISCLAIMER ░░
  { key: "disclaimer", phrase: "antes de despedirme una ultima cosa", beats: [
    c("checklist", { title: "Importante", items: [
      { text: "Es información general, no un consejo para tu caso", state: "warn" },
      { text: "Tensión alta, arritmia o medicación: tu médico", state: "warn" },
      { text: "Él conoce tu historia clínica", state: "done" } ] }),
  ]},
  // ░░ CTA ░░
  { key: "cta", phrase: "si esto te sirvio", beats: [
    c("chips", { bg: "image", image: "img/fe2_taza_negra_hook.png", imageDarken: 0.62, title: "Si te sirvió", chips: ["Dale me gusta", "Suscribite", "Compartilo"] }),
    c("nametag", { name: "Dr. Federer", role: "Cada semana, ciencia real para cuidarte después de los 60" }),
  ]},
  { key: "cierre", phrase: "federer cuidate la circulacion", beats: [
    c("talk", {}),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer2.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);
const VIDEO_END = (CW[CW.length - 1]?.s || 1590) + 2;

let cursorSec = 0;
const missing = [];
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = sec.start; continue; }
  const ms = findMs(sec.phrase, cursorSec + 1);
  if (ms == null) missing.push(sec.phrase);
  sec.start = ms != null ? ms : cursorSec + 5;
  cursorSec = sec.start;
}
SECTIONS.sort((a, b) => a.start - b.start);

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b); if (!ph) return null;
    const ms = findMs(ph, start + 0.4);
    return ms != null && ms > start + 0.8 && ms < end - 1.2 ? ms : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.2) pin[i] = null; else lastPin = pin[i]; } }
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
    let dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`;
    const beat = { id, start: cursor, dur, key: sec.key };
    if (b.t === "talk") {
      beat.kind = "talk";
    } else if (b.t === "raw") {
      beat.kind = "raw";
      const stq = STOCK[b.name];
      beat.src = b.existing ? `img/${b.name}.png` : stq ? `broll/${b.name}.mp4` : b.clip ? `vid/${b.name}.mp4` : `img/${b.name}.png`;
      if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true;
      if (b.gen && !stq) beat.gen = b.gen;
    } else if (b.t === "float") {
      beat.kind = "float"; beat.src = `img/${b.name}.png`; beat.side = b.side; if (b.gen) beat.gen = b.gen; if (b.kicker) beat.kicker = b.kicker;
    } else if (b.t === "half") {
      beat.kind = "half"; beat.src = `img/${b.name}.png`; beat.side = b.side || "right"; if (b.gen) beat.gen = b.gen; if (b.kicker) beat.kicker = b.kicker;
    } else if (b.t === "blurexplainer") {
      beat.kind = "blurexplainer"; beat.clip = b.clip; beat.image = b.image;
      if (b.eyebrow) beat.eyebrow = b.eyebrow; if (b.title) beat.title = b.title; if (b.body) beat.body = b.body; if (b.side) beat.side = b.side;
    } else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = sec.key;
      delete beat._genImg; delete beat._prompt;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
    }
    beats.push(beat);
  });
}

// ── recolectar gen blocks embebidos (quote/process/annotated/callout + blur _gens) ──
const extraImgs = [];
const scan = (o) => {
  if (!o || typeof o !== "object") return;
  if (o._genImg && o._prompt) extraImgs.push({ name: o._genImg, prompt: o._prompt });
  if (Array.isArray(o._gens)) o._gens.forEach((gg) => gg && gg.type === "image" && extraImgs.push({ name: gg.name, prompt: gg.prompt }));
  for (const k of Object.keys(o)) scan(o[k]);
};
SECTIONS.forEach((s) => s.beats.forEach(scan));

// strip auxiliares + normalizar image pelada → img/<name>.png
const strip = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(strip); return; } delete o._genImg; delete o._prompt; delete o._gens; for (const k of Object.keys(o)) strip(o[k]); };
beats.forEach(strip);
const fixImg = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(fixImg); return; } if (typeof o.image === "string" && !o.image.includes("/") && !o.image.includes(".")) o.image = `img/${o.image}.png`; for (const k of Object.keys(o)) { if (k === "gen") continue; fixImg(o[k]); } };
beats.forEach(fixImg);

// ── prompts de FOTOS (gpt-image-2) desde beats con gen.type image + extraImgs ──
const photoPrompts = [];
const seen = new Set();
const pushPhoto = (name, prompt) => { if (name && prompt && !seen.has(name)) { seen.add(name); photoPrompts.push({ name, prompt }); } };
beats.forEach((b) => { if (b.gen && b.gen.type === "image") pushPhoto(b.gen.name, b.gen.prompt); });
extraImgs.forEach((e) => pushPhoto(e.name, e.prompt));
const clips = [];
// name = el nombre del still (= src del beat: vid/<image>.mp4) para que gen_video escriba el archivo que el beat espera
beats.forEach((b) => { if (b.gen && b.gen.type === "clip") { pushPhoto(b.gen.image, b.gen.prompt); clips.push({ name: b.gen.image, image: b.gen.image, prompt: b.gen.prompt, frames: b.gen.frames || 90 }); } });

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer2.json", JSON.stringify({ video: "federer2", avatar: "federer2_opt.mp4", theme: "medico", beats, extraImages: extraImgs }, null, 1));
fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync("public/img/prompts_federer2.json", JSON.stringify(photoPrompts, null, 2));
fs.writeFileSync("public/img/prompts_federer2_diag.json", JSON.stringify(DIAGRAMS.map((d) => ({ name: d.name, prompt: d.prompt })), null, 2));
fs.mkdirSync("public/vid", { recursive: true });
fs.writeFileSync("public/vid/clips_federer2.json", JSON.stringify(clips, null, 2));
const usedNames = new Set(beats.map((b) => (b.src || "").replace(/^broll\//, "").replace(/\.mp4$/, "")));
const stockMap = Object.fromEntries(Object.entries(STOCK).filter(([n]) => usedNames.has(n)));
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync("public/broll/stock_federer2.json", JSON.stringify(stockMap, null, 2));

// ── ANCLAS DEL HOOK (para overlays scrim en Main_federer2) ───────────────────
const findWord = (w, after = 0) => { const t = norm(w); for (const c of CW) if (c.s >= after && c.t === t) return c.s; return null; };
const hookCafe = findWord("cafe", 28) ?? 30;
const hookFederer = findWord("federer", 90) ?? 96;
// ── PISO DE DURACIÓN de componentes ──
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "process", "ingredients", "annotated", "callout", "bars", "diagram", "rule", "nametag", "blurexplainer", "pizarra"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) {
  const i = compIx[k];
  const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END;
  const capDur = nextComp - beats[i].start - 0.1;
  beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2);
}

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/VideoEdit/federer2_beats.ts",
  `// AUTO-GENERADO por gen_federer2.mjs — beats crudos para el mapeador premium.\n` +
  `export const FED2_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/VideoEdit/federer2_hooks.ts",
  `// AUTO-GENERADO por gen_federer2.mjs — anclas (seg) de overlays del hook + rangos talk.\n` +
  `export const HOOKS2 = { cafe: ${hookCafe.toFixed(2)}, federer: ${hookFederer.toFixed(2)} };\n` +
  `export const TALKS2: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);

if (missing.length) console.log(`⚠ frases no ancladas (${missing.length}):`, missing);
console.log(`hooks → cafe ${hookCafe.toFixed(1)}s · federer ${hookFederer.toFixed(1)}s`);
const raw = beats.filter((b) => b.kind === "raw").length;
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
console.log(`beats: ${beats.length} · raw: ${raw} (${(100*raw/beats.length).toFixed(0)}%) · stock: ${Object.keys(stockMap).length} · fotos IA: ${photoPrompts.length} · diagramas: ${DIAGRAMS.length} · clips LTX: ${clips.length} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
console.log("kinds:", JSON.stringify(kinds));
