// gen_borax.mjs — beatsheet/borax.json (Video 2, El Constructor Libre — madera/termitas).
// Narrador "Tomás". Anclaje por frase a captions_borax.json. ESTÁNDAR NUEVO:
// fotos = gpt-image-2 LOW (gen_images.mjs) con prompt CORTO-IMPERFECTO; deAPI solo anima.
// Literalidad de tutorial en las recetas (1 imagen por paso/ingrediente). Prefijo bx_.
import fs from "fs";

const IMPERF = "Que se vea como una foto casera real: leve desenfoque en algunas zonas, ligera inclinación de cámara, luz desigual, piel y texturas reales, manos naturales con dedos correctos, fondo algo desordenado, pequeñas imperfecciones, nada perfecto, nada pulido, sin apariencia de IA, estilo documental auténtico, saturación baja, colores suaves y ligeramente apagados. Sin texto legible.";
const P = (d) => `Foto documental muy realista, formato HORIZONTAL apaisado, relación de aspecto EXACTA 16:9 (1792x1024). ${d}. ${IMPERF}`;
const AV = "un hombre rural de unos 45 años, pelo oscuro y barba corta canosa, piel curtida, camisa de trabajo verde oliva y delantal de cuero marrón";
const PAV = (d) => P(`${AV}, ${d}, en una chacra rural de la Patagonia`);
const DP = (d) => `Crear una infografía horizontal, RELACIÓN DE ASPECTO EXACTA 16:9 (1792x1024), estilo lámina ilustrada hecha a mano pero muy profesional, limpia, premium y editorial. Fondo marfil claro con textura de papel muy sutil, líneas marrón oscuro casi negras, acentos en verde oliva/salvia y terracota apagado. ${d}. DEJÁ COMPLETAMENTE LIBRE la esquina superior derecha (limpia, sin texto ni dibujos) para el avatar. Composición minimalista, mucho espacio, pocos bloques grandes, tinta fina con acuarela suave, se entiende en 1 segundo. Textos en español, breves. Estética: vintage botanical / archival textbook illustration, papel levemente envejecido. Evitá verse escolar/sobrecargado.`;

const HUES = ["amber", "red", "blue"];
const r = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: P(prompt) }, ...o });
const rv = (name, prompt, o = {}) => ({ t: "raw", name, clip: true, gen: { type: "clip", image: name, prompt: P(prompt), frames: o.frames || 90 }, ...o });
const rav = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: PAV(prompt) }, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
let fSide = 0;
const fimg = (name, prompt, o = {}) => ({ t: "float", name, gen: { type: "image", name, prompt: P(prompt) }, side: (fSide++ % 2 ? "left" : "right"), ...o });
const half = (name, prompt, o = {}) => ({ t: "half", name, side: "right", gen: { type: "image", name, prompt: P(prompt) }, ...o });
const real = (name, o = {}) => ({ t: "raw", name, broll: true, ...o });

const DIAGRAMS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };

const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.0, stat: 1.0, aged: 1.2, checklist: 1.2, splitlist: 1.1, bars: 1.25, cross: 1.25, process: 1.5, journey: 2.6, infzoom: 1.3, annotated: 1.3, callout: 1.0, chips: 1.0, impact: 1.4, diagram: 2.4, half: 1.3 };

const SECTIONS = [
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    r("bx_viga_maciza", "una viga de madera vieja sosteniendo el techo de una casa de campo, madera maciza y sana pese a los años, cerca del suelo húmedo", { kicker: "20 años, intacta", at: "lleva veinte años" }),
    r("bx_viga_golpe", "una mano golpeando con los nudillos una viga de madera maciza, sin agujeros ni podredumbre"),
    r("bx_viga_sana_cerca", "primer plano de la superficie de una viga vieja pero sana, vetas firmes, sin daño"),
    r("bx_termita_madera", "termitas sobre un trozo de madera, primer plano, bichos pálidos"),
    r("bx_zona_humeda", "la base de una casa de madera en una zona húmeda con niebla de mañana, suelo mojado"),
    r("bx_caja_borax", "una caja de bórax en polvo blanco sobre una mesa de taller rural", { kicker: "Cuesta monedas" }),
    rv("bxv_aceite_cae", "aceite ámbar cayendo lento sobre una tabla de madera, brillo cálido", { frames: 90 }),
    r("bx_madera_podrida_otra", "una viga sin tratar comida y podrida, blanda y oscura, deshaciéndose", { kicker: "Lo normal sin tratar" }),
    r("bx_fumigadora_no", "un camión de fumigación con un signo de prohibido, concepto de no llamar a la empresa"),
    r("bx_casa_madera_full", "una casa de madera rústica construida a mano en el campo, tablas gastadas"),
  ]},
  { key: "ident", phrase: "Me llamo Tomás", beats: [
    rav("bx_tomas_retrato", "parado frente a su casa de madera hecha a mano, mirada tranquila", { hold: true, kicker: "Tomás" }),
    c("quote", { image: "bx_manos_madera", text: "No soy químico. Soy un *hombre que prueba cosas*.", _genImg: "bx_manos_madera", _prompt: P("manos curtidas apoyadas sobre una viga de madera, primer plano") }),
    rav("bx_tomas_incomoda", "inclinado hacia la cámara con gesto serio en su taller, lámpara de aceite detrás", { kicker: "La parte que te va a dar bronca" }),
  ]},
  { key: "promesa", phrase: "Quédate conmigo hasta el final", beats: [
    c("stat", { value: 2, prefix: "US$ ", label: "lo que cuesta tratar tu madera", eyebrow: "Te lo prometo" }),
    c("chips", { bg: "image", image: "img/bx_casa_madera_full.png", imageDarken: 0.6, title: "Lo que vas a saber", chips: ["Bórax contra termitas", "Aceite contra el agua", "Cal de 5000 años"], hue: "amber" }),
    r("bx_galpon_madera", "un galpón de madera rural en buen estado, tablas tratadas, día nublado"),
  ]},
  { key: "problema", phrase: "Empecemos por lo que casi todos", beats: [
    c("diagram", { eyebrow: "La madera tiene DOS enemigos", slides: [{ image: dg("dg_bx_dos", "Diagrama: una viga de madera en el centro con dos flechas de ataque. A la izquierda LOS BICHOS (termitas comiéndola desde adentro), a la derecha EL AGUA (humedad y hongos que la pudren). Dos defensas necesarias."), eyebrow: "Bichos por dentro, agua por fuera" }] }),
    c("annotated", { image: "bx_termita_galeria", eyebrow: "Por dentro", caption: "Las galerías que no ves", annotations: [{ kind: "circle", x: 45, y: 50, label: "Túneles" }, { kind: "arrow", x: 70, y: 65, label: "Polvillo" }], _genImg: "bx_termita_galeria", _prompt: P("galerías de termitas dentro de una madera carcomida, túneles y polvillo fino") }),
    r("bx_carcoma_bicho", "un escarabajo de carcoma sobre madera con agujeritos, primer plano", { kicker: "La carcoma" }),
    r("bx_hormiga_carpintera", "hormigas carpinteras grandes excavando un nido en una viga de madera", { kicker: "La hormiga carpintera" }),
    r("bx_madera_humeda", "una viga de madera mojada y oscura por la humedad cerca del suelo, gotas", { kicker: "Y la humedad", at: "la humedad" }),
    rv("bxv_madera_podrida", "una madera podrida y blanda deshaciéndose, manchas oscuras de hongo, húmeda", { frames: 80, kicker: "El agua y los hongos" }),
    r("bx_hongo_blanco", "hongos blancos de pudrición creciendo sobre madera húmeda, primer plano"),
    c("chips", { bg: "image", image: "img/bx_galpon_madera.png", imageDarken: 0.62, title: "Dos defensas, no una", chips: ["Una contra los bichos", "Otra contra el agua"], hue: "red" }),
    c("splitlist", { title: "Por qué fallan los productos caros", items: ["Atacan UNA sola cosa", "Se evaporan en meses", "Hay que comprar de nuevo"], palette: "D", cross: true }),
  ]},
  { key: "borax_que", phrase: "es el bórax", beats: [
    c("rule", { number: "01", title: "El bórax contra termitas y hongos" }),
    r("bx_borax_mineral", "polvo de bórax blanco mineral en un cuenco, textura granulada", { hold: true, kicker: "Un mineral natural" }),
    r("bx_borax_mina", "un depósito de mineral de bórax blanco en la tierra, de donde se extrae"),
    r("bx_borax_lavanderia", "una caja vieja de bórax en la sección de lavandería, producto de abuela"),
    r("bx_borax_mano", "una mano dejando caer polvo de bórax entre los dedos, textura fina"),
    c("callout", { image: "bx_borax_cucharada", figure: "US$ 2", caption: "Una caja te dura años.", accent: "amber", _genImg: "bx_borax_cucharada", _prompt: P("una cucharada de polvo de bórax sobre una mesa de madera, primer plano") }),
    c("chips", { bg: "image", image: "img/bx_borax_mineral.png", imageDarken: 0.62, title: "Mata bichos Y hongos", chips: ["No es de laboratorio", "Sal mineral", "Seguro para vos"], hue: "amber" }),
  ]},
  { key: "borax_como", phrase: "Funciona de dos maneras", beats: [
    c("diagram", { eyebrow: "Cómo actúa el bórax", slides: [
      { image: dg("dg_bx_mata", "Diagrama: una termita muerde madera tratada con bórax y se intoxica. Flecha simple, ilustración de tinta. Etiqueta: la termita que muerde, muere."), eyebrow: "La termita que muerde, muere" },
      { image: dg("dg_bx_queda", "Diagrama en corte de una tabla con cristales de bórax metidos en la fibra, quedándose adentro permanentes. Etiqueta: el bórax queda en la fibra."), eyebrow: "Y queda en la fibra, permanente" } ] }),
    r("bx_termita_come", "una termita mordiendo y comiendo una fibra de madera, macro"),
    r("bx_termita_muerta", "una termita muerta junto a una madera tratada, primer plano"),
    r("bx_carcoma_agujeros", "madera con agujeritos de carcoma y polvillo fino debajo"),
    r("bx_borax_cristales", "cristales de bórax metidos en la fibra de la madera vistos de cerca"),
  ]},
  { key: "borax_receta", phrase: "La receta es simple", beats: [
    c("annotated", { image: "bx_mesa_productos", eyebrow: "Lo que necesitás", caption: "Todo de ferretería, monedas", annotations: [{ kind: "circle", x: 25, y: 55, label: "Bórax" }, { kind: "circle", x: 55, y: 55, label: "Agua caliente" }, { kind: "circle", x: 80, y: 55, label: "Pincel" }], _genImg: "bx_mesa_productos", _prompt: P("una caja de bórax, una olla de agua y un pincel apoyados sobre una mesa de madera de taller, vista cenital") }),
    r("bx_agua_caliente", "una olla con agua bien caliente casi hirviendo sobre una cocina rural", { kicker: "1 · Agua bien caliente", at: "agua bien caliente" }),
    r("bx_caja_abrir", "una mano abriendo una caja de bórax en polvo, polvo blanco visible adentro"),
    r("bx_echar_borax", "una mano echando una cucharada de polvo de bórax dentro de la olla de agua caliente", { kicker: "2 · Echar el bórax" }),
    rv("bxv_revolver", "una cuchara de madera revolviendo bórax en agua caliente, el polvo disolviéndose", { frames: 80, kicker: "Revolver hasta disolver" }),
    r("bx_borax_fondo", "un poco de polvo de bórax sin disolver en el fondo de la olla, solución saturada", { kicker: "Hasta que quede polvo en el fondo" }),
    fimg("bx_balde_solucion", "un balde con la solución de bórax lista y un pincel apoyado al lado, taller"),
    real("rb_brush_wood", { kicker: "3 · Pincelar la madera" }),
    r("bx_puntas_madera", "el extremo de una viga de madera donde se ven los anillos, absorbiendo el líquido como un sorbete", { kicker: "Las puntas primero" }),
    r("bx_uniones", "las uniones y juntas de dos maderas, un pincel mojando bien el rincón", { kicker: "Y las uniones" }),
    c("annotated", { image: "bx_viga_tratada", eyebrow: "Dos manos", caption: "Dejá secar entre mano y mano", annotations: [{ kind: "arrow", x: 30, y: 40, label: "1ª mano" }, { kind: "arrow", x: 65, y: 60, label: "2ª mano" }], _genImg: "bx_viga_tratada", _prompt: P("una viga de madera mojada con solución de bórax, brillo húmedo en la superficie") }),
    rv("bxv_secar", "una viga tratada secándose al aire libre, la superficie evaporando despacio", { frames: 75, kicker: "Dejar secar" }),
    c("checklist", { title: "La receta del bórax", items: ["Agua caliente", "Bórax hasta saturar", "Mojar bien las puntas", "Dos manos, dejar secar"] }),
  ]},
  { key: "inject1", phrase: "uno de los", beats: [
    c("diagram", { eyebrow: "Los 35 sistemas, paso a paso", slides: [{ image: dg("dg_bx_manual", "Lámina de un manual abierto de homestead con diagramas de tratamiento de madera, regla y lápiz, estilo archivo. Sin texto legible."), eyebrow: "Las proporciones exactas, en el manual" }] }),
    half("bx_manual_madera", "un manual abierto con diagramas de tratamiento de madera sobre una mesa de taller", { kicker: "Todo documentado" }),
  ]},
  { key: "punto_debil", phrase: "tiene un solo punto débil", beats: [
    rv("bxv_lluvia_madera", "gotas de lluvia cayendo sobre una madera a la intemperie, el agua lavando la superficie", { frames: 80, kicker: "El agua puede lavar el bórax" }),
    c("headline", { tokens: ["Hace", "falta", "una", "segunda", { t: "defensa" }], eyebrow: "Contra el agua", bg: "image", image: "img/bx_galpon_madera.png" }),
  ]},
  { key: "aceite", phrase: "líquido de dos dólares", beats: [
    c("rule", { number: "02", title: "El líquido de $2 contra el agua" }),
    r("bx_lino_planta", "una planta de lino con flores azules en el campo, de donde sale el aceite"),
    r("bx_lino_semilla", "semillas de lino y una botella de aceite de linaza sobre madera, luz cálida", { kicker: "Aceite de linaza", at: "aceite de linaza" }),
    r("bx_pino_resina", "resina goteando del tronco de un pino, de donde sale la trementina"),
    r("bx_trementina", "una lata vieja de trementina junto a un pincel, taller rural", { kicker: "Trementina de los pinos" }),
    c("diagram", { eyebrow: "Cómo sella el aceite", slides: [{ image: dg("dg_bx_sella", "Diagrama en corte de una tabla: el aceite de linaza penetra en la fibra y al secarse se endurece como un plástico natural, sellándola desde adentro; la trementina lo lleva profundo y se evapora. Etiquetas: penetra, endurece, sella."), eyebrow: "Penetra, endurece, sella desde adentro" }] }),
  ]},
  { key: "aceite_receta", phrase: "La mezcla es mitad y mitad", beats: [
    r("bx_verter_aceite", "vertiendo aceite de linaza ámbar dentro de un frasco de vidrio, taller", { kicker: "Mitad aceite", at: "mitad y mitad" }),
    r("bx_verter_trementina", "vertiendo trementina transparente dentro del mismo frasco con aceite"),
    r("bx_mezcla_mitad", "un frasco con aceite de linaza y trementina, una varilla de madera revolviendo la mezcla", { kicker: "Mitad y mitad" }),
    fimg("bx_pincel_cargar", "un pincel cargándose con la mezcla de aceite y trementina del frasco"),
    real("rb_oil_wood", { kicker: "Pincelar sobre el bórax seco" }),
    r("bx_madera_bebe", "la madera bebiéndose el aceite, la mezcla penetrando en la fibra seca", { kicker: "La madera lo bebe" }),
    rv("bxv_gota_pato", "una gota de agua resbalando y cayendo de una madera sellada sin penetrar, como en la espalda de un pato", { frames: 80, kicker: "El agua resbala como en un pato" }),
    r("bx_madera_sellada", "una madera recién aceitada con brillo satinado parejo, sellada y protegida", { kicker: "Sellada por dentro" }),
    c("annotated", { image: "bx_dos_defensas", eyebrow: "Las dos juntas", caption: "El bórax mata, el aceite lo encierra", annotations: [{ kind: "circle", x: 35, y: 50, label: "Bórax adentro" }, { kind: "arrow", x: 70, y: 35, label: "Aceite sella" }], _genImg: "bx_dos_defensas", _prompt: P("una viga de madera tratada y sellada, superficie firme y protegida, taller") }),
  ]},
  { key: "cal", phrase: "tercera defensa", beats: [
    r("bx_cal_balde", "un balde con cal blanca disuelta y un pincel grueso al lado, finca vieja"),
    r("bx_cal_pintar", "un pincel pintando de blanco con cal el tronco de un árbol, finca vieja", { kicker: "La cal: 5000 años" }),
    r("bx_postes_blancos", "una hilera de postes de madera con la base pintada de cal blanca, campo"),
    rv("bxv_madera_quemada", "la superficie de una madera siendo quemada ligeramente con fuego hasta quedar negra, técnica shou sugi ban", { frames: 90, kicker: "Quemar la punta enterrada" }),
    r("bx_poste_enterrar", "un poste de madera con la punta quemada y aceitada, listo para enterrar en la tierra", { kicker: "Quemar, aceitar, enterrar" }),
    c("chips", { bg: "image", image: "img/bx_postes_blancos.png", imageDarken: 0.6, title: "La cal protege hace 5000 años", chips: ["Vuelve la madera alcalina", "Refleja el sol", "Templos antiguos"], hue: "amber" }),
    c("splitlist", { title: "Para la madera enterrada", items: ["Quemar la superficie", "Aceitar encima", "Enterrar"], palette: "A" }),
  ]},
  { key: "credibilidad", phrase: "Nada de esto me lo invento", beats: [
    c("aged", { heading: "Conocimiento viejo, probado", lines: [{ text: "El aceite de linaza protege barcos hace siglos." }, { text: "El bórax trata madera a nivel industrial.", mark: true }], image: "img/bx_barco_madera.png" }),
    r("bx_barco_madera", "un barco de madera viejo con casco aceitado y brillante, puerto rústico"),
    r("bx_herramientas_aceitadas", "herramientas viejas de mango de madera aceitado, colgadas en un taller"),
    r("bx_aserradero_industrial", "tablones de madera de construcción apilados tratados a nivel industrial"),
  ]},
  { key: "inject2", phrase: "no te ofrece esto", beats: [
    c("costtally", { left: { label: "El barniz que falla", note: "se descascara, comprás de nuevo", total: 120, bad: true }, right: { label: "Constructor Libre", note: "bórax + aceite, una vez", total: 4 } }),
    c("quote", { image: "bx_barniz_descascarado", text: "El negocio es que tu madera se arruine *cada dos años*.", accent: "danger", _genImg: "bx_barniz_descascarado", _prompt: P("un barniz industrial descascarándose de una madera vieja, lascas levantadas") }),
  ]},
  { key: "empezar", phrase: "por dónde empiezas", beats: [
    c("process", { title: "Empezá con una pieza", eyebrow: "Sin miedo", steps: [
      { title: "Bórax", desc: "agua caliente, 2 manos", image: "img/bx_echar_borax.png" },
      { title: "Secar", desc: "un día entero", image: "img/bx_viga_tratada.png" },
      { title: "Aceite", desc: "mitad y mitad, 2 manos", image: "img/bx_mezcla_mitad.png" } ] }),
    r("bx_pieza_practica", "una pequeña maceta o banquito de madera sin tratar, para practicar el tratamiento", { kicker: "Empezá con algo chico" }),
    r("bx_poste_cerca", "un poste de cerca de madera clavado en la tierra, tratado en la base", { kicker: "O un poste de cerca" }),
    r("bx_dos_tablas", "dos tablas de madera lado a lado a la intemperie, una tratada firme y una sin tratar gris y partida", { kicker: "Compará a los 2 meses", hold: true }),
    c("bars", { title: "Cuánto dura la madera", unit: "años", bars: [{ label: "Sin tratar", value: 3, tone: "danger" }, { label: "Barniz caro", value: 8 }, { label: "Bórax + aceite", value: 40, winner: true }] }),
  ]},
  { key: "objeciones", phrase: "preguntas que siempre me hacen", beats: [
    c("chips", { bg: "image", image: "img/bx_viga_tratada.png", imageDarken: 0.6, title: "¿Queda pegajoso o con olor?", chips: ["No, si seca bien", "Olor suave a madera", "Cura en días"], hue: "blue" }),
    r("bx_tabla_cocina", "una tabla de cocina de madera aceitada con aceite de linaza puro"),
    c("chips", { bg: "image", image: "img/bx_tabla_cocina.png", imageDarken: 0.6, title: "Seguro para comida", chips: ["Aceite de linaza puro", "Bien curado", "Sin químicos"], hue: "blue" }),
  ]},
  { key: "panorama", phrase: "Déjame dejarte el panorama grande", beats: [
    c("headline", { tokens: ["Lo", "más", "caro", "lo", "come", "un", { t: "bicho" }], eyebrow: "Una casa, un galpón", bg: "image", image: "img/bx_termita_madera.png" }),
    c("quote", { image: "bx_manos_viejas_madera", text: "Hacían durar una viga *cien años* con aceite y minerales.", _genImg: "bx_manos_viejas_madera", _prompt: P("manos viejas curtidas pasando aceite a una viga de madera, gesto de oficio") }),
  ]},
  { key: "plan", phrase: "esto es lo que quiero que hagas", beats: [
    c("checklist", { title: "Tu fin de semana", items: [
      { text: "Conseguir bórax, aceite, trementina", state: "todo" },
      { text: "Tratar una pieza de prueba", state: "todo" },
      { text: "Dejarla a la intemperie y comparar", state: "todo" } ] }),
    rav("bx_tomas_taller", "en su taller con una caja de bórax y una lata de aceite, listo para tratar madera"),
  ]},
  { key: "inject3", phrase: "si quieres todas las proporciones", beats: [
    c("diagram", { eyebrow: "Todo, ordenado y probado", slides: [{ image: dg("dg_bx_stack", "Lámina tipo oferta de valor artesanal: un manual de dos volúmenes, diagramas técnicos, plan de 90 días y bonos apilados. Estilo archivo, sin precios ni texto legible."), eyebrow: "Vale 158 — hoy 27, para siempre" }] }),
    c("bars", { title: "El valor", unit: "US$", bars: [{ label: "Por separado", value: 158, tone: "danger" }, { label: "Hoy", value: 27, winner: true }] }),
    c("quote", { image: "bx_manual_celular", text: "Si no te sirve, te devuelvo *todo*. El riesgo lo pongo yo.", accent: "good", _genImg: "bx_manual_celular", _prompt: P("un teléfono mostrando un manual digital abierto sobre un banco de taller, luz cálida") }),
  ]},
  { key: "coment", phrase: "Cuéntame en los comentarios", beats: [
    rav("bx_tomas_camara", "hablando cálido a la cámara en su taller, invitando", { kicker: "¿Qué querés proteger?" }),
  ]},
  { key: "cierre", phrase: "antes de irte", beats: [
    r("bx_techo_vigas", "el techo de una casa con vigas de madera sanas y macizas, vista desde abajo", { kicker: "El mismo techo" }),
    r("bx_hijo_madera", "un hombre joven mirando una viga de madera de la casa familiar, gesto de orgullo"),
    c("quote", { image: "bx_viga_maciza", text: "Esta viga la va a heredar mi hijo. Es *herencia*, no gasto." }),
    c("journey", { eyebrow: "Hacelo durar", title: "Tres generaciones", waypoints: [
      { x: 0, y: 0, z: 0, image: "img/bx_caja_borax.png", label: "Bórax", num: "1", dwell: 2.6, travel: 1.6 },
      { x: 1.2, y: -0.4, z: 0.3, image: "img/bx_mezcla_mitad.png", label: "Aceite de $2", num: "2", dwell: 2.6, travel: 1.6 },
      { x: 2.4, y: 0.3, z: -0.2, image: "img/bx_viga_maciza.png", label: "Madera para siempre", num: "3", dwell: 3.0, travel: 1.4 } ] }),
  ]},
  { key: "proximo", phrase: "truco de dos metales", beats: [
    r("bx_barrera_metales", "dos tiras de metal distinto rodeando una planta de huerta, cobre y zinc, primer plano", { kicker: "La próxima: 2 metales = 0 plagas" }),
    rav("bx_tomas_firma", "mirando cálido a la cámara en la puerta del taller, hora dorada", { hold: true }),
  ]},
];

// ── ANCLAJE POR FRASE ────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_borax.json", "utf8"));
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1130) + 2;

let cursorSec = 0;
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = sec.start; continue; }
  const ms = findMs(sec.phrase, cursorSec + 1);
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
    const ms = findMs(ph, start + 0.5);
    return ms != null && ms > start + 1 && ms < end - 1.5 ? ms : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.5) pin[i] = null; else lastPin = pin[i]; } }
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
    const hue = b.hue || HUES[(si + i) % HUES.length];
    const beat = { id, start: cursor, dur };
    if (b.t === "raw") {
      beat.kind = "raw";
      beat.src = b.broll ? `broll/${b.name}.mp4` : b.clip ? `vid/${b.name}.mp4` : `img/${b.name}.png`;
      beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true;
      if (b.gen) beat.gen = b.gen;
    } else if (b.t === "float") {
      beat.kind = "float"; beat.src = `img/${b.name}.png`; beat.side = b.side; beat.hue = hue; if (b.gen) beat.gen = b.gen; if (b.kicker) beat.kicker = b.kicker;
    } else if (b.t === "half") {
      beat.kind = "half"; beat.src = `img/${b.name}.png`; beat.side = b.side || "right"; beat.hue = hue; if (b.gen) beat.gen = b.gen; if (b.kicker) beat.kicker = b.kicker;
    } else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (beat.kind === "journey") delete beat.accent;
      if (beat.kind !== "journey" && !beat.hue) beat.hue = hue;
    }
    beats.push(beat);
  });
}

const strip = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(strip); return; } delete o._genImg; delete o._prompt; delete o._note; for (const k of Object.keys(o)) strip(o[k]); };
const extraImgs = [];
const scan = (o) => { if (!o || typeof o !== "object") return; if (o._genImg && o._prompt) extraImgs.push({ name: o._genImg, prompt: o._prompt }); for (const k of Object.keys(o)) scan(o[k]); };
SECTIONS.forEach((s) => s.beats.forEach(scan));
beats.forEach(strip);
const fixImg = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(fixImg); return; } if (typeof o.image === "string" && !o.image.includes("/") && !o.image.includes(".")) o.image = `img/${o.image}.png`; for (const k of Object.keys(o)) { if (k === "gen") continue; fixImg(o[k]); } };
beats.forEach(fixImg);

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/borax.json", JSON.stringify({ video: "borax", avatar: "borax_opt.mp4", tutorial: true, beats, extraImages: extraImgs }, null, 1));
fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync("public/img/prompts_borax_diag.json", JSON.stringify(DIAGRAMS.map((d) => ({ name: d.name, prompt: d.prompt })), null, 2));

const raw = beats.filter((b) => b.kind === "raw").length;
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · diagramas: ${DIAGRAMS.length} · extraImgs: ${extraImgs.length} · dur: ${(dur / 60).toFixed(1)}min`);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
console.log("kinds:", JSON.stringify(kinds));
