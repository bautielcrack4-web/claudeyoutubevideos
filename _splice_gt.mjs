// Splice: reemplaza SECTIONS y OVL del clon build_gotera.mjs con contenido del video gotera.
import fs from "fs";
const path = "build_gotera.mjs";
let src = fs.readFileSync(path, "utf8");

const SECTIONS = `const SECTIONS = [
  // ░░ 1) COLD OPEN — el techo que se vino abajo ░░
  { a: "una noche de tormenta", start: 0, beats: [
    C("gt_storm_night_house", "heavy rain storm on house roof night", "a stormy night on the roof", { at: "una noche de tormenta" }),
    C("gt_ceiling_collapse", "collapsed ceiling debris on floor water damage", "a ceiling that came down", { at: "se vino abajo" }),
    C("gt_kitchen_table", "empty kitchen table family home", "the table where we had just eaten", { at: "sobre la mesa" }),
    I("gt_ceiling_stain_brown", "brown water stain on ceiling", "the little brown stain everyone ignored", { at: "una manchita marron" }),
    C("gt_painting_over_stain", "painting over ceiling stain roller", "painting over it to hide it", { at: "alguien pintaba" }),
    C("gt_rotten_beam", "rotten wooden roof beam water damage", "the beam rotted from the inside", { at: "le pudrio la viga" }),
    C("gt_old_bricklayer", "old mason bricklayer working trowel", "the sixty-year-old bricklayer who taught me", { at: "un albanil de sesenta" }),
  ]},
  // ░░ 2) CONFIRMACIÓN ░░
  { a: "si entraste a este video", beats: [
    I("gt_ceiling_leak_drip", "water dripping from ceiling leak", "the leak that drives you crazy", { at: "una gotera que te esta volviendo loco" }),
    C("gt_bucket_under_leak", "bucket catching roof leak indoors floor", "the bucket in the same spot every time", { at: "el balde que pones" }),
    C("gt_peeling_paint_ceiling", "paint peeling blistering on ceiling damp", "the paint that blisters and falls", { at: "la pintura que se ampolla" }),
    C("gt_sealing_roof_crack", "applying sealant on roof crack hand", "you already sealed it and it came back", { at: "le tiraste sellador" }),
  ]},
  // ░░ 3) EL SECRETO — no esta donde la ves ░░
  { a: "el secreto mas importante de todos", beats: [
    C("gt_water_running_roof", "water running across sloped roof surface", "water enters one place, appears in another", { at: "entra por un lado y aparece por otro" }),
    C("gt_patching_wrong_spot", "patching ceiling stain spot indoors", "patching the stain, the wrong spot", { at: "estuviste arreglando el lugar equivocado" }),
  ]},
  // ░░ 4) SOY TOMÁS ░░
  { a: "soy tomas", full: true, beats: [] },
  // ░░ 5) STAKES ░░
  { a: "lo que una gotera te esta costando", beats: [
    C("gt_wet_plaster_wall", "wet damaged plaster wall water stain", "water soaking the wall and structure", { at: "moja el reboque" }),
    C("gt_mold_ceiling_corner", "black mold on ceiling corner damp", "humidity and mold you breathe", { at: "moho que te enferma" }),
    C("gt_rotten_roof_structure", "rotten roof timber structure decay", "a rotted beam is a roof that falls", { at: "se come la viga" }),
    I("gt_expensive_repair", "major roof structural repair workers", "a cheap stain becomes a costly repair", { at: "un arreglo de estructura" }),
    C("gt_waterproofing_company", "roofing company workers waterproofing roof", "the company that charges a fortune", { at: "le cobra una fortuna" }),
  ]},
  // ░░ 6) EL PRINCIPIO ░░
  { a: "encontrar de donde entra el agua de verdad", beats: [
    X({ kind: "diagram", at: "todo techo tiene una pendiente", eyebrow: "La gotera NUNCA está donde la ves", slides: [{ image: dg("dg_gt_pendiente", "Diagrama en corte de un techo inclinado: el agua entra por una grieta en la parte ALTA (punto A), corre por la pendiente del techo por debajo, y recien gotea para adentro varios metros mas abajo, manchando el cielo raso en el punto B. Flechas siguiendo el recorrido del agua. Etiquetas 'entra arriba (A)', 'corre por la pendiente', 'gotea lejos, la mancha (B)'."), eyebrow: "El agua entra arriba y gotea lejos" }] }),
    C("gt_water_trail_roof", "water trickling down underside of roof", "the water is lazy and sly, it travels", { at: "el agua es vaga" }),
    C("gt_drip_following_beam", "water droplet running along roof beam", "it runs along a beam until it drips", { at: "una viga, un tornillo" }),
  ]},
  // ░░ 7) ENCONTRAR LA ENTRADA — los sospechosos ░░
  { a: "el agua deja pistas", beats: [
    C("gt_man_inspecting_roof", "man inspecting roof looking for damage", "go up on a dry day and trace uphill", { at: "subi al techo" }),
    X({ kind: "diagram", at: "salen de las uniones", eyebrow: "Los 5 sospechosos de toda gotera", slides: [{ image: dg("dg_gt_sospechosos", "Diagrama de un techo mostrando los 5 puntos por donde entra el agua, numerados: 1) la babeta, union entre el techo y una pared que sube (chimenea/medianera); 2) los caños que atraviesan el techo (ventilacion); 3) una teja partida o corrida; 4) los tornillos de la chapa con su arandela de goma rajada; 5) la canaleta tapada que rebalsa. Cada uno con un numero y una flecha. Estilo lamina tecnica."), eyebrow: "Casi nunca pierde por el medio: pierde en las uniones" }] }),
    C("gt_roof_wall_flashing", "roof to wall junction flashing chimney", "the flashing, where 80% of water enters", { at: "la babeta" }),
    C("gt_vent_pipe_roof", "vent pipe through roof sealing", "the pipes that cross the roof", { at: "los canos que atraviesan" }),
    C("gt_cracked_roof_tile", "cracked broken roof tile", "a cracked or shifted tile", { at: "una teja partida" }),
    C("gt_metal_roof_screws", "metal roof screws rubber washers rusty", "the screws on a metal roof", { at: "los tornillos" }),
    C("gt_clogged_gutter_overflow", "clogged gutter overflowing water leaves", "the clogged gutter that backs up", { at: "la canaleta o el desague tapado" }),
    X({ kind: "diagram", at: "un truco de detective", eyebrow: "El truco de la manguera", slides: [{ image: dg("dg_gt_manguera", "Diagrama del truco de la manguera para encontrar una gotera: una persona ARRIBA en el techo mojando con una manguera por zonas, empezando de abajo hacia arriba; otra persona ADENTRO mirando la mancha del cielo raso. Cuando aparece la humedad, esa es la zona de entrada. Flechas y etiquetas 'moja de abajo hacia arriba, zona por zona', 'el de adentro avisa', 'donde aparece, ahi entra'."), eyebrow: "Encontrá la entrada sin romper nada" }] }),
  ]},
  // ░░ 8) TERRAZA / AZOTEA ░░
  { a: "si tu techo es una terraza plana", beats: [
    X({ kind: "diagram", at: "tres lugares que son los que mas fallan", eyebrow: "La terraza falla en 3 lugares", slides: [{ image: dg("dg_gt_terraza", "Diagrama de una terraza plana en vista con 3 puntos de falla marcados: 1) el desague/embudo, donde la membrana se despega del borde del cano; 2) el zocalo, el encuentro con el muro del parapeto, donde la membrana debe subir 20cm; 3) las ampollas/globos de la membrana. Ademas mostrar la pendiente minima hacia el desague y un charco donde no hay pendiente. Etiquetas claras."), eyebrow: "Desagüe, zócalo del parapeto y ampollas" }] }),
    C("gt_roof_drain_flat", "flat roof drain outlet water", "the drain, where the membrane lifts", { at: "el desague" }),
    C("gt_parapet_wall_flashing", "parapet wall flashing flat roof edge", "the parapet junction, must go up 20cm", { at: "el zocalo" }),
    C("gt_membrane_blister", "blister bubble in roof membrane asphalt", "blisters of trapped moisture", { at: "las ampollas" }),
    C("gt_ponding_water_roof", "ponding standing water on flat roof", "where water sits, the membrane fails", { at: "la pendiente" }),
  ]},
  // ░░ 9) EL ARREGLO — sandwich asfalto ░░
  { a: "viene el arreglo", beats: [
    C("gt_cleaning_roof_crack", "wire brushing cleaning roof surface crack", "clean and dry, or nothing sticks", { at: "limpia bien la zona" }),
    C("gt_v_groove_crack", "opening crack into v groove chisel concrete", "open the crack into a V so it grips", { at: "abre la grieta en forma" }),
    C("gt_hydraulic_cement", "fast setting hydraulic cement plug leak", "fast-set cement stops an active drip", { at: "cemento de frague rapido" }),
    C("gt_brushing_asphalt", "brushing liquid asphalt membrane on roof", "a coat of liquid asphalt", { at: "membrana liquida o asfalto" }),
    C("gt_geotextile_fabric", "embedding geotextile fabric in asphalt roof", "a fabric embedded between two coats", { at: "un pedazo de tela" }),
  ]},
  // ░░ 10) INJERTO 1 ░░
  { a: "las cantidades exactas", beats: [
    X({ kind: "diagram", at: "un manual que arme", eyebrow: "Las medidas exactas, anotadas", slides: [{ image: dg("dg_gt_manual", "Lamina de un manual o cuaderno abierto sobre una mesa de obra con recetas de arreglos caseros, dosis y medidas, una regla y un lapiz al lado, estilo archivo artesanal. Transmite que esta todo ordenado con las cantidades justas. Sin texto legible."), eyebrow: "El Manual de Reparaciones Caseras" }] }),
    I("gt_notebook_measures", "handwritten notebook measurements pencil", "the exact amounts written down", { at: "selle sin esperar" }),
  ]},
  // ░░ 11) EL TRUCO DE LA GOMA ░░
  { a: "la grieta que se raja", beats: [
    X({ kind: "diagram", at: "el techo se mueve", eyebrow: "Por qué el sellador rígido se raja", slides: [{ image: dg("dg_gt_goma", "Diagrama en dos partes. ARRIBA: una junta de techo que se dilata con el sol y se contrae con el frio; un sellador rigido de cemento se parte en la union (mostrar la grieta). ABAJO: un parche de goma de cubierta flexible sobre la misma junta, que estira y vuelve acompanando el movimiento, sin rajarse. Etiquetas 'el cemento rigido se parte', 'la goma flexible acompana el movimiento'."), eyebrow: "La goma flexible acompaña, el cemento se parte" }] }),
    I("gt_tire_inner_tube", "old tire inner tube rubber piece", "a piece of old tire inner tube", { at: "la goma de una cubierta vieja" }),
    C("gt_rubber_patch_roof", "gluing rubber patch over roof joint sealant", "the flexible rubber patch over the joint", { at: "cortar un parche de esa goma" }),
    C("gt_sealing_metal_roof_screw", "sealing metal roof screw head sealant", "sealing the metal roof screws one by one", { at: "los tornillos no hace falta cambiar" }),
  ]},
  // ░░ 12) EL ERROR ░░
  { a: "el error que hace que la gotera vuelva", beats: [
    C("gt_sealing_over_stain", "applying sealant directly over ceiling stain", "sealing over the stain, the wrong spot", { at: "sella justo arriba de la mancha" }),
    X({ kind: "diagram", at: "una manguera pinchada adentro de la pared", eyebrow: "El error que arruina todo", slides: [{ image: dg("dg_gt_error", "Diagrama metafora: una manguera pinchada DENTRO de una pared sigue largando agua mientras una persona seca el piso con un trapo, sin tapar el pinchazo. Al lado, el paralelo: sellar la mancha del cielo raso mientras el agua sigue entrando metros mas arriba. Etiquetas 'secas el piso sin tapar el pinchazo', 'tapas la mancha sin tapar la entrada'."), eyebrow: "Tapar la salida mientras el agua sigue entrando" }] }),
    C("gt_sealing_wet_surface_rain", "applying sealant on wet roof in rain", "sealing on a wet surface, it peels", { at: "sellar sobre superficie mojada" }),
  ]},
  // ░░ 13) LÍMITES — las tres aguas ░░
  { a: "un par de honestidades", beats: [
    C("gt_destroyed_old_roof", "old ruined roof membrane cracked everywhere", "a roof truly shot needs redoing", { at: "ya esta realmente vencido" }),
    X({ kind: "diagram", at: "no toda mancha de humedad", eyebrow: "Tres aguas, tres arreglos distintos", slides: [{ image: dg("dg_gt_tres_aguas", "Diagrama comparativo de las TRES humedades de una casa, en tres columnas con una pared/techo en corte: 1) GOTERA: agua que baja del techo (flecha desde arriba), 'aparece cuando llueve'; 2) CONDENSACION: vapor que se junta en superficies frias (gotitas), 'aparece con el frio'; 3) CAPILARIDAD: agua que sube desde el piso por la pared (flecha desde abajo), 'siempre, desde abajo'. Iconos claros."), eyebrow: "Gotera (baja), condensación (frío), capilaridad (sube)" }] }),
    C("gt_condensation_window", "condensation water droplets on cold surface", "condensation is not a leak", { at: "es condensacion" }),
    C("gt_rising_damp_wall_base", "rising damp stain base of wall", "rising damp comes from below", { at: "la que sube" }),
  ]},
  // ░░ 14) INJERTO 2 ░░
  { a: "cuando arme el manual", beats: [
    G("gt_tomas_pausa", { kicker: "Nadie te lo enseña" }),
    X({ kind: "chips", at: "le conviene venderte el balde", title: "Por qué nadie te lo enseña", chips: ["A la impermeabilización", "le conviene venderte el balde", "no enseñarte el agujerito"], hue: "red", imageDarken: 0.6, _bg: { name: "gt_waterproof_products", query: "shelf of waterproofing products bucket", concept: "a shelf of expensive waterproofing buckets" }, image: "real/gt_waterproof_products.png" }),
    X({ kind: "splitlist", at: "lo dividi justo asi", title: "Los 40 arreglos, divididos así", items: ["Madera y metal que no mueren", "Plagas por centavos", "Goteras, humedad y moho", "Arreglos del hogar y el auto"], palette: "A" }),
  ]},
  // ░░ 15) RECAP ░░
  { a: "recapitulemos", beats: [
    X({ kind: "checklist", at: "recapitulemos", title: "El plan contra la gotera", items: [{ text: "Encontrá la entrada, no la mancha", state: "done" }, { text: "Limpiá y secá bien la zona", state: "done" }, { text: "Sellá la grieta en V con asfalto y tela", state: "done" }, { text: "Goma de cubierta donde el techo se mueve", state: "done" }, { text: "Mantené canaletas y desagües limpios", state: "done" }] }),
    C("gt_fixed_dry_ceiling", "clean dry ceiling no stain repaired", "your roof and structure saved", { at: "salvar tu techo" }),
  ]},
  // ░░ 16) INJERTO 3 + CIERRE ░░
  { a: "la casa entera esta llena de estos", beats: [
    X({ kind: "diagram", at: "el manual de reparaciones caseras", eyebrow: "Los 40, ordenados y probados", slides: [{ image: dg("dg_gt_stack", "Lamina tipo coleccion de valor artesanal: un manual ilustrado con 40 arreglos caseros (madera, oxido, plagas, goteras) con planos y medidas, apilado como una pila de valor. Estilo archivo, sin precios ni texto legible."), eyebrow: "Con la receta del sándwich y cómo hallar la entrada" }] }),
    I("gt_manual_phone", "phone showing home repair manual on table", "the manual on your phone", { at: "ordenado el dia que lo necesites" }),
    C("gt_rain_finding_leak", "person looking at rain finding water path", "next time it rains, find the entry", { at: "la proxima vez que llueva" }),
  ]},
  // ░░ 17) PRÓXIMO ░░
  { a: "en el proximo video", beats: [
    C("gt_wall_damp_no_rain", "damp stain on interior wall no rain", "next: water in a wall without rain", { at: "el agua que aparece en una pared" }),
    C("gt_old_plumber", "old plumber working on hidden pipe wall", "the trick of the sixty-five-year-old plumber", { at: "el plomero de sesenta y cinco" }),
  ]},
  { a: "la independencia no se compra", full: true, beats: [] },
];`;

const OVL = `const OVL = [
  // ── HOOK ──
  { kind: "oxquote", at: "esa manchita era una gotera", dur: 5.0, quote: "Una gotera no te moja el piso. Te *pudre la casa* desde adentro.", image: "real/gt_ceiling_stain_brown.png", side: "right", accent: "red" },
  // ── PRINCIPIO ──
  { kind: "oxrule", at: "busca la entrada no la mancha", dur: 4.8, text: "El agua viene de *más arriba*. Buscá la entrada, no la mancha.", accent: "amber" },
  // ── SOSPECHOSOS ──
  { kind: "oxstat", at: "la babeta", dur: 4.2, value: 80, suffix: " %", label: "del agua entra por la babeta, la unión techo-pared", glyph: "🧱", accent: "amber" },
  { kind: "oxside", at: "un truco de detective", dur: 5.2, image: "real/gt_man_inspecting_roof.png", title: "El truco de la manguera", lines: ["Uno arriba moja de abajo hacia arriba", "Otro adentro mira la mancha", "Donde aparece, ahí entra"], side: "left", accent: "blue" },
  // ── TERRAZA ──
  { kind: "oxtag", at: "charco que tarda dias en irse", dur: 4.2, name: "El charco", what: "Si el agua no escurre, la membrana se vence", side: "right", accent: "red" },
  // ── ARREGLO ──
  { kind: "oxspec", at: "limpia bien la zona", dur: 5.0, image: "real/gt_brushing_asphalt.png", kicker: "El parche del albañil", title: "Sándwich de asfalto", rows: [{ k: "Limpiar y secar", v: "siempre" }, { k: "Grieta", v: "abierta en V" }, { k: "Capas", v: "asfalto + tela + asfalto" }, { k: "Costo", v: "$2" }], side: "left", accent: "blue" },
  // ── GOMA ──
  { kind: "oxside", at: "la goma de una cubierta vieja", dur: 5.4, image: "real/gt_tire_inner_tube.png", title: "La goma de cubierta", lines: ["Flexible: acompaña el movimiento", "No se raja con el sol", "Dura 20 o 30 años, y es gratis"], side: "right", accent: "amber" },
  { kind: "oxtag", at: "una buna", dur: 4.2, name: "La buña", what: "Mete el borde dentro del muro: no se cuela", side: "left", accent: "blue" },
  // ── ERROR ──
  { kind: "oxrule", at: "no tapes la mancha", dur: 4.8, text: "No tapes la *mancha*. Tapá la *entrada*.", accent: "red" },
  // ── CIERRE ──
  { kind: "oxbefore", at: "salvar tu techo", dur: 4.4, before: "real/gt_ceiling_stain_brown.png", after: "real/gt_fixed_dry_ceiling.png", accent: "green" },
  { kind: "oxquote", at: "el link esta abajo", dur: 5.0, quote: "Cuesta menos que una visita de la empresa. El link está *abajo*.", image: "real/gt_manual_phone.png", attribution: "Igual, hacé lo de hoy", side: "right", accent: "green" },
];`;

src = src.replace(/const SECTIONS = \[[\s\S]*?\n\];/, SECTIONS);
src = src.replace(/const OVL = \[[\s\S]*?\n\];/, OVL);
fs.writeFileSync(path, src);
console.log("splice gotera OK");
