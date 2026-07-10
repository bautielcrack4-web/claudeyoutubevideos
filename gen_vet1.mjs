// gen_vet1.mjs — beatsheet/vet1.json (Canal "Dr. Federer Veterinario" · Video 1 PATAS).
// Avatar vet1_opt.mp4 (~21.4min). Anclaje por FRASE a captions_vet1.json.
// Look CLÍNICO (THEME_MEDICO). Las imágenes YA EXISTEN: vt1_*.jpg (fotos casuales) +
// dg_vt1_*.jpg (16 diagramas). NO se genera nada. Diagramas → pantalla completa con el
// avatar AFUERA (DiagramBoard). Mecanismo estrella → dg_vt1_ciclo_hongo (el círculo vicioso).
// NO se usan los explainers hardcodeados de OJOS (pizarraojo/pizaraglic/relojnoche): mostrarían
// un ojo. El mecanismo lo llevan los DIAGRAMAS. Emite vet1_beats.ts + vet1_hooks.ts.
import fs from "fs";

// helpers de beat (imágenes existentes, ext .jpg) ─────────────────────────────
const r  = (name, o = {}) => ({ t: "raw", name, ...o });        // foto vt1_*.jpg
const c  = (kind, props = {}) => ({ t: kind, ...props });
const dg = (name, eyebrow, o = {}) => ({ t: "diagram", slides: [{ image: `img/${name}.jpg`, eyebrow }], ...o }); // diagrama full-screen (avatar afuera)
const cv = (o = {}) => ({ t: "ciclovicioso", ...o }); // explainer ANIMADO del círculo vicioso (avatar afuera)
// ── KIT PREMIUM (jul 2026) ──
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "warn", ...o });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o }); // o.flipPhrase = frase donde hace el flip
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "warn", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) }); // items:[{word,sub?,image?,tone,atPhrase}]
const ap = (items, o = {}) => ({ t: "avatarpizarra", items, ...o, at: o.at || (items[0] && items[0].atPhrase) }); // items:[{image?,caption?,card?,sub?,atPhrase}]
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const ge = (title, items, o = {}) => ({ t: "guardaesto", title, items, ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image: `img/${image}.jpg`, ...o });
const ANIM = new Set(["pizarraojo", "pizaraglic", "relojnoche", "ciclovicioso"]);
const KIT = new Set(["errorstinger", "mitoverdad", "frasecinetica", "avatarkeyword", "avatarpizarra", "lowerthird", "guardaesto", "freezezoom"]);

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, pizarraojo: 3.4, pizaraglic: 3.4, relojnoche: 3.2, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6, ciclovicioso: 3.4 };

// ── SECCIONES (ancladas a frases reales del transcript vet1) ──────────────────
const SECTIONS = [
  // ░░ HOOK ░░ — el OLOR (avatar abre ~1.3s; scrim "TUS PATAS" encima)
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    fc([{ t: "Hay" }, { t: "un" }, { t: "OLOR", hl: true }], { tone: "warn" }),
    r("vt1_federer_huele_pata", { kicker: "Un olor muy particular en las patas" }),
    ak([{ word: "YA LO SÉ", sub: "antes de tocarlo, de revisarlo", tone: "teal", atPhrase: "ya se casi todo lo que" }], {}),
    fc([{ t: "Antes de" }, { t: "tocarlo", hl: true }, { t: "revisarlo", hl: true }, { t: "cualquier estudio", hl: true }], { tone: "warn", at: "antes de tocarlo antes de revisarlo" }),
    r("vt1_federer_vet", {}),
  ]},
  // ░░ ROCCO ░░
  { key: "rocco", phrase: "la semana pasada entro una senora", beats: [
    lt("Rocco · Golden Retriever", { kicker: "CASO REAL", tone: "teal" }),
    r("vt1_rocco_entrando_clinica", { kicker: "«Rocco», golden de mirada dulce" }),
    r("vt1_duena_manos_apretadas", {}),
    ak([{ word: "DÍA Y NOCHE", sub: "se lame y no la deja dormir", tone: "warn", atPhrase: "se lame las patas de dia" }], {}),
    r("vt1_golden_lame_pata", {}),
    fc([{ t: "No" }, { t: "DUERME", hl: true }, { t: "una" }, { t: "FORTUNA", hl: true }, { t: "y NADA", hl: true }], { tone: "warn", at: "no me deja dormir gaste una fortuna" }),
    r("vt1_casa_oscuras_duena_despierta", {}),
    r("vt1_mesa_luz_frascos", {}),
    fz("vt1_pata_golden_dedos", { x: 0.5, y: 0.5, label: "EL OLOR", zoom: 2.0, tone: "warn", at: "y antes de mirarla siquiera" }),
  ]},
  // ░░ TE PASA A VOS + "EMPEORANDO" ░░
  { key: "tepasa", phrase: "y si tu perro se lame", beats: [
    fc([{ t: "ROJAS", hl: true }, { t: "HÚMEDAS", hl: true }, { t: "MORDIDAS", hl: true }], { tone: "warn", at: "rojas humedas mordidas" }),
    r("vt1_pata_roja_mordida", {}),
    ak([{ word: "DE NOCHE", sub: "peor todavía a las 2 am", tone: "warn", atPhrase: "y peor todavia de noche" }], {}),
    r("vt1_reloj_2am", {}),
    r("vt1_rocco_golden", { kicker: "Lo mismo que le pasaba a Rocco" }),
    es("★", "LO ESTÁS EMPEORANDO", { tone: "warn", at: "con toda la buena intencion", w: 3.6 }),
    ak([{ word: "EMPEORANDO", sub: "sí, escuchaste bien", tone: "warn", atPhrase: "escuchaste bien empeorando" }], {}),
  ]},
  // ░░ IDENTIDAD + probaste de todo + slurp 2am ░░
  { key: "identidad", phrase: "soy en dr federer", beats: [
    c("nametag", { name: "Dr. Federer", role: "Veterinario · lo que más entra a mi consultorio", image: "img/vt1_federer_vet.jpg" }),
    ap([
      { image: "img/vt1_perro_cono_isabelino.jpg", eyebrow: "Ya lo probaste", caption: "El cono que el perro odia", atPhrase: "el collar isabelino ese cono" },
      { image: "img/vt1_crema_dedo.jpg", card: "Crema con corticoides", atPhrase: "la crema con corticoides" },
      { image: "img/vt1_blister_pastillas.jpg", card: "Pastilla carísima", atPhrase: "la pastilla carisima para la alergia" },
    ], {}),
    r("vt1_perro_tranquilo_duena", { kicker: "Mejora una semana... y el dueño respira" }),
    mv("La pastilla lo cura", "Vuelve siempre", { flipPhrase: "el perro vuelve exactamente a lo mismo" }),
    r("vt1_frasco_vacio", {}),
    fc([{ t: "SLURP", hl: true }, { t: "SLURP", hl: true }, { t: "SLURP", hl: true }], { tone: "warn", at: "slurp slurp slurp" }),
    ak([{ word: "2 DE LA MAÑANA", sub: "ese sonido que te parte el corazón", tone: "warn", atPhrase: "a las dos de la manana" }], {}),
    r("vt1_reloj_2am", {}),
  ]},
  // ░░ EL GIRO: PROBLEMA EQUIVOCADO ░░
  { key: "giro", phrase: "y aca esta el giro", beats: [
    lt("Lo que casi nadie te dice", { kicker: "EL GIRO", tone: "warn" }),
    mv("Es alergia al pasto", "NO es alergia", { flipPhrase: "no tiene una alergia al pasto" }),
    es("✕", "PROBLEMA EQUIVOCADO", { tone: "warn", at: "le estan tratando el problema", w: 3.4 }),
    dg("dg_vt1_alarma_incendio", "Apagás la alarma, el incendio sigue prendido", { at: "estan apagando una alarma" }),
  ]},
  // ░░ LAS TRES COSAS + SEÑAL DE URGENCIA ░░
  { key: "trescosas", phrase: "hoy te voy a dar tres", beats: [
    ge("Las 3 cosas de hoy", [
      { text: "Un test gratis, ahora", image: "img/vt1_persona_huele_pata_perro.jpg" },
      { text: "La verdadera causa", image: "img/vt1_pata_entre_dedos_pliegue.jpg" },
      { text: "El plan completo", image: "img/vt1_botella_vinagre_manzana.jpg" },
    ], {}),
    r("vt1_persona_huele_pata_perro", { kicker: "Un test gratis, ahora mismo" }),
    r("vt1_botella_vinagre_manzana", {}),
    ak([{ word: "UNA SEÑAL", sub: "no es hongo · no es alergia", tone: "warn", atPhrase: "una senal una sola" }], {}),
    r("vt1_bultito_entre_dedos", {}),
    lt("Una señal = veterinario HOY", { kicker: "ATENCIÓN", tone: "warn" }),
  ]},
  // ░░ EL TEST DEL OLFATO ░░
  { key: "test", phrase: "empecemos por el test", beats: [
    r("vt1_persona_huele_pata_perro", { kicker: "Olé la pata de tu perro" }),
    ap([
      { image: "img/vt1_pata_entre_dedos_pliegue.jpg", eyebrow: "El test", caption: "Entre los deditos, donde casi nunca mirás", atPhrase: "acerca la nariz al espacio entre los deditos" },
    ], {}),
    c("splitlist", { title: "El olor que estoy buscando", items: ["Humedad guardada, trapo mojado", "Queso viejo, a levadura", "Snacks de maíz, palitos, nachos"], palette: "D" }),
    r("vt1_snacks_maiz", { at: "huele a esos snacks de maiz", kicker: "«Doctor, huele a nachos»" }),
  ]},
  // ░░ RESULTADO: es un hongo ░░
  { key: "resultado", phrase: "si sentiste ese olor presta atencion", beats: [
    ak([{ word: "SOBREPOBLACIÓN", sub: "de un hongo en la piel de las patas", tone: "warn", atPhrase: "sobrepoblacion de un hongo" }], {}),
    r("vt1_pata_entre_dedos_pliegue", {}),
    c("callout", { image: "img/vt1_snacks_maiz.jpg", figure: "Buena noticia", caption: "Es de las cosas más comunes, fáciles y baratas de resolver que existen." }),
    c("annotated", { image: "img/vt1_pelo_marron_dedos.jpg", eyebrow: "El mapa de la batalla", caption: "El pelo teñido de marrón: saliva acumulada, no sangre", annotations: [{ kind: "circle", x: 50, y: 55, label: "hongo entre los dedos" }] }),
    r("vt1_pelo_marron_dedos", {}),
  ]},
  // ░░ EL VILLANO: MALASSEZIA ░░
  { key: "malassezia", phrase: "ese olor tiene nombre", beats: [
    ak([{ word: "MALASSEZIA", sub: "una levadura que vive en todos los perros", tone: "warn", atPhrase: "es un hongo una levadura" }], {}),
    dg("dg_vt1_donde_se_esconde", "Vive en cantidades chiquitas... hasta que se dispara"),
    r("vt1_pata_entre_dedos_pliegue", { at: "el espacio entre los dedos de las patas", kicker: "Tibio, oscuro y húmedo" }),
    dg("dg_vt1_anatomia_dedos", "Entre los dedos: el criadero perfecto"),
    c("cross", { title: "El criadero perfecto", eyebrow: "Capa por capa", layers: [
      { label: "Piel plegada, sin sol", color: "#E0523E", weight: 3 },
      { label: "Humedad atrapada", color: "#2E7DB0", weight: 2 },
      { label: "Malassezia que se multiplica", color: "#109C99", weight: 2 } ] }),
    r("vt1_oreja_perro_caida", { at: "las orejas caidas las axilas" }),
  ]},
  // ░░ LA PICAZÓN Y LA TRAMPA ░░
  { key: "picazon", phrase: "cuando ese hongo se dispara", beats: [
    r("vt1_perro_muerde_dedos", { at: "la piel se pone intensamente", kicker: "Una picazón que arde, que no da tregua" }),
    r("vt1_golden_lame_pata", { at: "se lame se muerde" }),
    c("callout", { image: "img/vt1_perro_muerde_dedos.jpg", figure: "La trampa", caption: "Se lame para calmar la tortura... y justo ahí está la trampa." }),
  ]},
  // ░░ EL CICLO VICIOSO (mecanismo estrella) ░░
  { key: "ciclo", phrase: "mira bien esto porque es el corazon", beats: [
    ak([{ word: "CÍRCULO VICIOSO", sub: "el que se muerde la cola", tone: "warn", atPhrase: "es un circulo vicioso" }], {}),
    cv({ at: "paso uno el hongo produce" }), // explainer ANIMADO del círculo vicioso (pieza estrella)
    r("vt1_golden_lame_pata", { at: "el hongo produce esa picazon" }),
    c("process", { title: "El círculo vicioso", eyebrow: "Paso a paso", steps: [
      { title: "El hongo pica", desc: "picazón terrible" },
      { title: "El perro se lame", desc: "para calmarse" },
      { title: "Saliva = humedad + calor", desc: "lo que ama el hongo" },
      { title: "El hongo crece más", desc: "y pica más" } ] }),
    r("vt1_pata_mojada_sin_secar", { at: "deja saliva" }),
    ap([
      { image: "img/vt1_pelo_marron_dedos.jpg", eyebrow: "Sin querer", caption: "Le está regando el jardín al enemigo", atPhrase: "le esta dando de comer al enemigo" },
    ], {}),
    r("vt1_pelo_marron_dedos", { at: "ese pelito entre los dedos", kicker: "No es sangre: es saliva acumulada" }),
  ]},
  // ░░ POR QUÉ FALLAN LAS PASTILLAS ░░
  { key: "pastillas", phrase: "ahora entendes por fin", beats: [
    dg("dg_vt1_pastilla_no_cura", "Apaga la señal de picazón, pero no mata el hongo"),
    mv("La pastilla mata el hongo", "Solo tapa la picazón", { flipPhrase: "no mata al hongo" }),
    c("bars", { title: "Defensas de la piel", unit: "", bars: [
      { label: "Piel sana y fuerte", value: 100, winner: true },
      { label: "Con pastillas que bajan defensas", value: 45, tone: "danger", note: "el hongo crece más rápido" } ] }),
    r("vt1_perro_decaido", { at: "muchas de esas pastillas y cremas bajan", kicker: "Cuanto más lo tratan solo con pastillas, peor" }),
    r("vt1_blister_pastillas", {}),
  ]},
  // ░░ EL ERROR DEL DUEÑO ░░
  { key: "error", phrase: "ahora hablemos del error", beats: [
    es("✕", "EL ERROR DEL DUEÑO", { tone: "warn", w: 3.2 }),
    r("vt1_pata_bajo_canilla", { at: "la lava", kicker: "La lava... y no la seca bien" }),
    r("vt1_pata_mojada_sin_secar", { at: "despues no la seca bien" }),
    dg("dg_vt1_secar_criadero", "Lavar sin secar = le construís el paraíso al hongo"),
    c("board", { eyebrow: "Con la mejor intención", title: "Otros errores que empeoran todo", side: "left", items: [
      { title: "Solo el cono isabelino", sub: "abajo el hongo sigue igual", tone: "coral" },
      { title: "Cremas de humanos", sub: "tóxicas si el perro las lame", tone: "coral" },
      { title: "Ignorar las orejas", sub: "desde ahí siempre vuelve", tone: "coral" } ], at: "ponerle solo el collar isabelino" }),
    r("vt1_perro_cono_isabelino", {}),
    r("vt1_oreja_perro_caida", { at: "ignorar las orejas" }),
  ]},
  // ░░ EL TEST DE 3 SEÑALES ░░
  { key: "senales", phrase: "crucemos las senales", beats: [
    dg("dg_vt1_test_3_senales", "Tres señales para saber qué tiene TU perro"),
    c("board", { eyebrow: "Cruzá las señales", title: "El test de 3 señales", side: "right", items: [
      { title: "Señal 1 · El olor", sub: "snack de maíz + pelo marrón = hongo", tone: "teal" },
      { title: "Señal 2 · El ritmo", sub: "4 patas + cara + orejas = alergia de fondo", tone: "blue" },
      { title: "Señal 3 · Una sola pata", sub: "de golpe + cojea = URGENTE", tone: "coral" } ], at: "senal numero 1 el olor" }),
    r("vt1_pelo_marron_dedos", {}),
  ]},
  // ░░ SEÑAL 2 · alergia de fondo ░░
  { key: "senal2", phrase: "senal numero 2", beats: [
    es("2", "¿Desde cuándo y con qué ritmo?", { tone: "blue", w: 3.0 }),
    r("vt1_cuatro_patas_lame", { at: "se lame las cuatro patas" }),
    r("vt1_perro_sacude_orejas", { at: "se sacude las orejas" }),
    mv("Es hongo O alergia", "Muy seguido van juntos"),
    r("vt1_perro_rasca_cara", {}),
  ]},
  // ░░ SEÑAL 3 · una sola pata = urgencia ░░
  { key: "senal3", phrase: "senal numero 3", beats: [
    es("3", "¿UNA SOLA PATA?", { tone: "warn", w: 3.4 }),
    r("vt1_una_pata_cojea", { at: "es una sola pata" }),
    dg("dg_vt1_senales_peligro", "Súbito, feroz, en una sola pata: eso es OTRA cosa"),
    ak([{ word: "OTRA COSA", sub: "no es hongo · puede ser urgencia", tone: "warn", atPhrase: "no la apoya bien cojea" }], {}),
  ]},
  // ░░ EL ESCALÓN DE PELIGRO: espiga / banderas rojas ░░
  { key: "espiga", phrase: "esto casi ningun video", beats: [
    c("headline", { tokens: ["Esto", "casi", "ningún", "video", "te", "lo", { t: "dice" }], eyebrow: "Lo más importante de hoy", bg: "image", image: "img/vt1_espiga_pasto_dedos.jpg" }),
    r("vt1_bultito_entre_dedos", { at: "un bultito una hinchazon" }),
    r("vt1_espiga_pasto_dedos", { at: "unas espigas unas semillas", kicker: "Espigas: semillas con forma de flecha" }),
    dg("dg_vt1_espiga_migra", "La espiga migra hacia adentro como una aguja"),
    r("vt1_pasto_alto", {}),
    es("!", "VETERINARIO, HOY", { tone: "danger", at: "eso es veterinario hoy", w: 3.4 }),
    c("checklist", { title: "Banderas rojas → al veterinario", items: [
      { text: "Cojea o no apoya la pata", state: "warn" },
      { text: "Zona muy caliente, hinchada o le duele al tocarla", state: "warn" },
      { text: "Bulto nuevo o un agujerito que supura", state: "warn" },
      { text: "Decaimiento, falta de apetito, fiebre", state: "warn" } ], at: "si la zona esta muy caliente" }),
    r("vt1_pata_hinchada_caliente", { at: "falta de apetito fiebre" }),
    r("vt1_telefono_turno_vet", { at: "pedir un turno", kicker: "Reconocer cuándo ya no es casero" }),
  ]},
  // ░░ DE DÓNDE SALE: terreno + dieta/almidón ░░
  { key: "terreno", phrase: "ahora una pregunta que a esta altura", beats: [
    r("vt1_dos_perros_terreno", { at: "el terreno", kicker: "¿Por qué el tuyo y no el del vecino?" }),
    dg("dg_vt1_terreno_jardin", "El terreno lo definen las defensas y la comida", { at: "pensalo como un jardin" }),
    r("vt1_plato_kibble", { at: "muchisimos alimentos balanceados secos" }),
    dg("dg_vt1_almidon_azucar", "Almidón → azúcar → la comida favorita del hongo", { at: "el azucar" }),
    r("vt1_bolsa_alimento_ingredientes", {}),
    c("bars", { title: "El terreno de la piel", unit: "", bars: [
      { label: "Terreno equilibrado (proteína)", value: 100, winner: true },
      { label: "Terreno débil (almidón/azúcar)", value: 45, tone: "danger", note: "le abonás el jardín al yuyo" } ] }),
  ]},
  // ░░ CURA TIEMPO 1: baño de vinagre + secado + timeline ░░
  { key: "tiempo1", phrase: "tiempo 1 el alivio inmediato", beats: [
    dg("dg_vt1_ph_acido", "El hongo no soporta lo ácido: le cambiamos el pH"),
    r("vt1_botella_vinagre_manzana", { at: "vinagre de manzana", kicker: "Del natural, sin filtrar, «con la madre»" }),
    dg("dg_vt1_receta_bano", "La receta: 1 parte de vinagre, 2 de agua tibia", { at: "una parte de vinagre con dos partes" }),
    r("vt1_mezcla_vinagre_agua", {}),
    c("stat", { value: 5, suffix: " min", label: "de remojo, una vez por día", eyebrow: "La receta" }),
    r("vt1_pata_muy_roja_carne_viva", {}),
    es("!", "SEGURIDAD PRIMERO", { tone: "warn", at: "dilui mucho mas una parte", w: 3.0 }),
    c("splitlist", { title: "Las advertencias que casi nadie te da", items: ["Carne viva → diluí más (1 de vinagre por 4 de agua)", "Heridas abiertas o sangre → eso es veterinario", "Nunca cerca de los ojos, que no tome el líquido"], palette: "G" }),
    r("vt1_palangana_pata_remojo", {}),
    es("★", "SECÁ ENTRE LOS DEDOS", { tone: "warn", at: "seca la pata completamente", w: 3.4 }),
    r("vt1_secado_toalla_pata", {}),
    r("vt1_secador_aire_frio", { at: "un secador en aire frio", kicker: "Aire FRÍO, nunca caliente" }),
    dg("dg_vt1_timeline_semana", "Día a día: 7 días de baño y el lamido de las 2am para", { at: "7 dias los primeros dias" }),
    c("bars", { title: "El lamido de las 2 de la mañana", unit: "", bars: [
      { label: "Con baño de vinagre (7 días)", value: 100, winner: true },
      { label: "Sin tratar", value: 30, tone: "danger", note: "sigue el ciclo vicioso" } ] }),
  ]},
  // ░░ CURA TIEMPO 2: dieta + probiótico + omega + prevención ░░
  { key: "tiempo2", phrase: "tiempo 2 la solucion permanente", beats: [
    dg("dg_vt1_2_reglas_cura", "Dos reglas de oro para que no vuelva"),
    es("1", "Dejar al hongo sin comida", { tone: "teal", at: "regla numero 1", w: 3.0 }),
    r("vt1_cambio_comida_mezcla", { at: "una proteina animal sea lo primero", kicker: "El cambio SIEMPRE gradual, 1-2 semanas" }),
    r("vt1_alimento_proteina", {}),
    es("2", "Reforzar el ejército bueno", { tone: "teal", at: "regla numero 2", w: 3.0 }),
    r("vt1_probiotico_perro", { at: "un probiotico especifico para perros" }),
    ak([{ word: "S. BOULARDII", sub: "una levadura buena vs la levadura mala", tone: "teal", atPhrase: "saccharomyces vulardi" }], {}),
    r("vt1_omega3_capsulas", { at: "aporte de omega 3", kicker: "Omega 3: barrera de la piel fuerte" }),
    ge("Rutina de prevención", [
      { text: "Secá las patas después de cada paseo", image: "img/vt1_secar_patas_paseo.jpg" },
      { text: "Revisá patas y orejas 1 vez por semana", image: "img/vt1_revisar_orejas.jpg" },
      { text: "Pelo entre las almohadillas, cortito", image: "img/vt1_pelo_almohadillas_corto.jpg" },
    ], { at: "secale bien las patas entre los dedos" }),
    r("vt1_secar_patas_paseo", {}),
    r("vt1_revisar_orejas", { at: "mantene el pelito entre las almohadillas" }),
    r("vt1_pelo_almohadillas_corto", {}),
    r("vt1_perro_duerme_tranquilo", { hold: true }),
  ]},
  // ░░ "MI VET DIJO ALERGIA" + emocional ░░
  { key: "vetalergia", phrase: "mi veterinario me dijo que era alergia", beats: [
    mv("Mi vet dijo: es alergia", "Falta la mitad: el hongo"),
    dg("dg_vt1_hongo_microscopio", "Una muestra al microscopio confirma el hongo", { at: "que tu veterinario tome una muestra" }),
    r("vt1_microscopio_muestra", { at: "mire al microscopio" }),
    c("quote", { image: "img/vt1_federer_vet.jpg", text: "No te quedes con la *mitad de la historia*." }),
    r("vt1_perro_muerde_dedos", { at: "mascandose las patas hasta lastimarse" }),
    c("quote", { image: "img/vt1_duena_mayor_angustia.jpg", text: "Tu perro te tiene *solo a vos*.", at: "te tiene solo a vos" }),
  ]},
  // ░░ RECAP DEL PLAN ░░
  { key: "recap", phrase: "asi que repasemos el plan", beats: [
    ge("El plan, guardalo", [
      { text: "1 · Olé la pata → si huele a maíz, es hongo", image: "img/vt1_persona_huele_pata_perro.jpg" },
      { text: "2 · Las 3 señales → 1 sola pata = veterinario hoy", image: "img/vt1_una_pata_cojea.jpg" },
      { text: "3 · Baño de vinagre + arreglá el terreno de fondo", image: "img/vt1_botella_vinagre_manzana.jpg" },
    ], {}),
    r("vt1_persona_huele_pata_perro", { at: "ole la pata" }),
    r("vt1_bultito_entre_dedos", { at: "revisa las 3 senales" }),
    r("vt1_botella_vinagre_manzana", { at: "el bano de vinagre de manzana" }),
  ]},
  // ░░ CIERRE emocional (callback Rocco) ░░
  { key: "cierre", phrase: "podes hacerlo no es dificil", beats: [
    c("talk", {}),
    r("vt1_perro_duerme_tranquilo", { kicker: "La primera noche que duerma tranquilo, entero" }),
    r("vt1_rocco_golden", { at: "rocco el golden del principio", kicker: "Rocco, el golden del principio" }),
    r("vt1_duena_feliz_foto_rocco", { at: "hoy duerme toda la noche" }),
    r("vt1_pata_sana_contraste", {}),
    c("quote", { image: "img/vt1_duena_feliz_foto_rocco.jpg", text: "Hoy Rocco *duerme toda la noche*. Esa es la meta." }),
  ]},
  // ░░ CTA ░░
  { key: "cta", phrase: "ahora contame vos", beats: [
    r("vt1_persona_huele_pata_perro", { kicker: "¿Patas con olor a maíz?" }),
    c("chips", { bg: "image", image: "img/vt1_duena_feliz_foto_rocco.jpg", imageDarken: 0.6, title: "Contame tu caso", chips: ["Qué raza es", "Qué señales tiene", "Hace cuánto le pasa"], at: "escribime tu caso alla abajo" }),
    c("chips", { bg: "image", image: "img/vt1_perro_duerme_tranquilo.jpg", imageDarken: 0.62, title: "Si te sirvió", chips: ["Dale like", "Suscribite", "Se vienen más temas así"], at: "dale like y suscribite" }),
    c("nametag", { name: "Dr. Federer", role: "Cada semana, lo que nadie te explica sobre tu perro", image: "img/vt1_federer_vet.jpg" }),
  ]},
  { key: "close", phrase: "nos vemos en el proximo video", beats: [
    c("talk", {}),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_vet1.json", "utf8"));
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1285) + 2;

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
    if (b.t === "talk") { beat.kind = "talk"; }
    else if (b.t === "raw") { beat.kind = "raw"; beat.src = `img/${b.name}.jpg`; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true; }
    else if (ANIM.has(b.t)) { beat.kind = b.t; }
    else { beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = sec.key;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
    }
    beats.push(beat);
  });
}

// ── POST-PASS "MILIMÉTRICO": resolver sub-ítems al ms EXACTO del avatar ───────
const KIT_CLIPS = []; // avatarpizarra/keyword → clip de avatar pre-extraído (farm-safe)
for (const beat of beats) {
  if (beat.kind === "avatarpizarra" || beat.kind === "avatarkeyword") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...rest } = it; return { ...rest, at: atF };
    });
    const hold = beat.kind === "avatarpizarra" ? 4.2 : 2.8;
    beat.dur = +(last / 30 + hold).toFixed(2); // la duración la marcan los ÍTEMS, no la sección
    beat.clip = `avatar_clips/${beat.id}.mp4`; // el avatar de este tramo, pre-extraído
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) {
    const ms = findMs(beat.flipPhrase, beat.start - 1);
    const lastSafe = Math.round(beat.dur * 30) - 26; // el flip debe caber DENTRO del beat + hold para leer la verdad
    let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42); // fuera de rango → fallback 42%
    beat.flipAt = f;
    delete beat.flipPhrase;
  }
  if (beat.at) delete beat.at; // ya se usó para anclar; no debe llegar al render
}
fs.writeFileSync("public/avatar_clips_vet1.json", JSON.stringify(KIT_CLIPS, null, 1));

// ── PISO DE DURACIÓN de componentes ──
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "callout", "bars", "diagram", "rule", "nametag", "board", "pizarraojo", "pizaraglic", "relojnoche", "ciclovicioso", "annotated", "cross", "process"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) {
  const i = compIx[k];
  const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END;
  const capDur = nextComp - beats[i].start - 0.1;
  beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2);
}

// ── ANCLAS del hook + close para el Main ──
const findWord = (w, after = 0) => { const t = norm(w); for (const cc of CW) if (cc.s >= after && cc.t === t) return cc.s; return null; };
const hookOlor = findWord("olor", 0) ?? 1;

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/VideoEdit/vet1_beats.ts",
  `// AUTO-GENERADO por gen_vet1.mjs — beats crudos (imágenes vt1_*.jpg / dg_vt1_*.jpg ya en disco).\n` +
  `export const VET1_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/VideoEdit/vet1_hooks.ts",
  `// AUTO-GENERADO por gen_vet1.mjs — anclas del hook + rangos talk.\n` +
  `export const HOOKSV1 = { olor: ${hookOlor.toFixed(2)} };\n` +
  `export const TALKSV1: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/vet1.json", JSON.stringify({ video: "vet1", avatar: "vet1_opt.mp4", theme: "medico", clipsfirst: true, beats }, null, 1));

// ── QA: assets referenciados existen? ──
const need = new Set();
beats.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && need.add(s.image)); if (Array.isArray(b.items)) b.items.forEach((it) => it && it.image && need.add(it.image)); });
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));

if (missing.length) console.log(`⚠ frases no ancladas (${missing.length}):`, missing);
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100*raw/beats.length).toFixed(0)}%) · diagramas: ${kinds.diagram||0} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`assets referenciados: ${need.size} · faltantes: ${miss.length}`, miss.length ? miss : "");
