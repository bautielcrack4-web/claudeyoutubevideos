// Splice: reemplaza SECTIONS y OVL del clon build_mosquitos.mjs con contenido del video mosquitos.
import fs from "fs";
const path = "build_mosquitos.mjs";
let src = fs.readFileSync(path, "utf8");

const SECTIONS = `const SECTIONS = [
  // ░░ 1) COLD OPEN — la historia del viejo ░░
  { a: "a mi viejo", start: 0, beats: [
    C("mq_mosquito_skin_macro", "mosquito biting human skin macro slow", "a mosquito biting skin, feeding on blood", { at: "los mosquitos casi lo matan" }),
    C("mq_hospital_bed_iv", "sick patient hospital bed iv drip", "a man in a hospital bed with dengue", { at: "dos semanas en el hospital" }),
    C("mq_fever_thermometer", "high fever sweating patient sick bed", "a fever that would not break", { at: "una fiebre que no bajaba" }),
    I("mq_doctor", "doctor serious talking in hospital", "the doctor who told us the truth", { at: "yo lo miraba en esa cama" }),
    X({ kind: "bars", at: "todas las guerras juntas", title: "Muertes humanas por año", unit: "por año", bars: [{ label: "Tiburón", value: 10, display: "~10", tone: "cold" }, { label: "Víbora", value: 50000, display: "50.000" }, { label: "Mosquito", value: 725000, display: "725.000", winner: true, tone: "danger" }] }),
    C("mq_shark_underwater", "great white shark swimming underwater", "the shark, not the deadliest", { at: "no es el tiburon" }),
    C("mq_aedes_macro", "aedes mosquito striped legs extreme macro", "the mosquito, the deadliest animal", { at: "es el mosquito" }),
    C("mq_backyard_dusk", "suburban backyard at dusk golden light", "your own backyard at dusk", { at: "en tu patio" }),
    C("mq_man_searching_yard", "man inspecting backyard corners looking", "searching the yard for the source", { at: "fuimos al fondo" }),
  ]},
  // ░░ 2) CONFIRMACIÓN ░░
  { a: "si entraste a este video", beats: [
    C("mq_swatting_dusk", "person swatting mosquitoes annoyed patio evening", "swatting mosquitoes, cannot enjoy the patio", { at: "te comen vivo" }),
    C("mq_scratching_ankles", "scratching mosquito bites on ankles", "scratching bitten ankles", { at: "rascandote los tobillos" }),
    C("mq_neighbor_calm_patio", "man relaxing outdoor patio evening drink calm", "the neighbor sitting outside, calm", { at: "el vecino esta sentado afuera" }),
    I("mq_two_coins", "two small coins in palm of hand", "a secret that costs two pesos", { at: "que cuesta dos pesos" }),
  ]},
  // ░░ 3) PRUEBA SHOCK — el balde ░░
  { a: "mira este balde", beats: [
    C("mq_bucket_corner_yard", "old bucket of water in shady garden corner", "a bucket of water left in a corner", { at: "un rincon del patio" }),
    C("mq_larvae_wriggling", "mosquito larvae wriggling water surface macro", "wriggling mosquito larvae in the water", { at: "son larvas" }),
    I("mq_larvae_hundreds", "many mosquito larvae floating in water closeup", "hundreds of larvae at the surface", { at: "cientos" }),
    C("mq_larva_single_macro", "single mosquito larva macro detail water", "every larva that will not become a mosquito", { at: "ninguna te va a picar" }),
  ]},
  // ░░ 4) ROADMAP / loops ░░
  { a: "pero antes de armar esa trampa", beats: [
    C("mq_two_species_compare", "two different mosquito species macro", "the two kinds of mosquito you have", { at: "los dos mosquitos que tenes" }),
    C("mq_oil_on_water_film", "oil film shimmer on still water surface", "the two-peso liquid that kills larvae", { at: "el liquido de dos pesos" }),
    C("mq_hidden_container_water", "forgotten container holding water in yard", "the hidden breeders nobody checks", { at: "los criaderos escondidos" }),
  ]},
  // ░░ 5) SOY TOMÁS ░░
  { a: "soy tomas", full: true, beats: [] },
  // ░░ 6) STAKES ░░
  { a: "lo que el mosquito te roba", beats: [
    C("mq_family_indoors_hot", "family indoors summer night windows closed", "stuck inside on a summer night", { at: "terminas encerrado adentro" }),
    C("mq_bbq_leaving_dusk", "people leaving backyard barbecue at dusk", "the barbecue that ends indoors", { at: "termina adentro" }),
    C("mq_child_bites_scratch", "child with mosquito bites scratching arm", "kids covered in itchy bites", { at: "los chicos llenos de ronchas" }),
    C("mq_aedes_on_skin", "aedes mosquito biting human skin", "the same mosquito that spreads dengue", { at: "transmite el dengue" }),
    I("mq_coils_aerosol", "mosquito coil burning and aerosol spray cans", "money spent on coils and aerosol", { at: "gastas en espirales" }),
    C("mq_fumigator_yard", "pest control technician fogging yard", "the exterminator who keeps coming back", { at: "llamas al fumigador" }),
  ]},
  // ░░ 7) EL PRINCIPIO — ciclo de vida ░░
  { a: "el mosquito que te pica no vino del campo", beats: [
    C("mq_female_blood_macro", "female mosquito engorged with blood macro", "only the female bites, for her eggs", { at: "necesita tu sangre" }),
    X({ kind: "diagram", at: "los pone en agua quieta", eyebrow: "El mosquito SOLO nace en agua quieta", slides: [{ image: dg("dg_mq_ciclo", "Diagrama del ciclo de vida del mosquito en 4 etapas sobre la superficie de un charco: 1) huevos flotando en balsa, 2) larva colgando de la superficie con un tubito de respirar, 3) pupa enroscada, 4) mosquito adulto saliendo y volando. Flechas circulares uniendo las etapas. Etiqueta grande 'todo empieza en un dedo de agua quieta' y 'de huevo a mosquito en 7 dias'."), eyebrow: "De huevo a mosquito en 7 días" }] }),
    C("mq_female_laying_water", "female mosquito laying eggs on water surface macro", "the female laying her eggs on still water", { at: "los pone en agua quieta" }),
    C("mq_bottle_cap_water", "rainwater collected in a bottle cap", "a bottle cap of water is enough", { at: "la tapita de una botella" }),
    C("mq_pot_saucer_water", "water in plant pot saucer dish", "the saucer under the flowerpot", { at: "el platito de abajo de la maceta" }),
    C("mq_dog_bowl_stale", "dog water bowl stale outdoors", "the pet bowl you have not changed", { at: "bebedero del perro" }),
    X({ kind: "diagram", at: "arriba de la linea del agua", eyebrow: "Por qué vuelven después de vaciar", slides: [{ image: dg("dg_mq_huevos", "Diagrama de un recipiente en corte con agua: huevos de mosquito pegados a la pared SECA del recipiente, justo arriba de la linea del agua. Una lluvia hace subir el nivel del agua y los huevos eclosionan. Etiquetas 'huevos pegados sobre la linea del agua', 'aguantan secos meses', 'con la lluvia, nacen'."), eyebrow: "Los huevos secos esperan la lluvia" }] }),
    X({ kind: "bars", at: "iba a poner doscientos huevos mas", title: "Matar dónde rinde", bars: [{ label: "Matar un adulto que vuela", value: 1, display: "1", tone: "cold" }, { label: "Matar una larva en el agua", value: 200, display: "200", winner: true }] }),
  ]},
  // ░░ 8) LOS DOS MOSQUITOS ░░
  { a: "en tu casa no hay un mosquito", beats: [
    X({ kind: "diagram", at: "son distintos", eyebrow: "Tenés DOS mosquitos, y son distintos", slides: [{ image: dg("dg_mq_dos", "Diagrama comparativo de dos mosquitos lado a lado, dividido por una linea. IZQUIERDA: el comun de noche, gris, parado sobre agua sucia verdosa, con un icono de luna; etiqueta 'noche, agua sucia'. DERECHA: el del dengue, oscuro con rayas blancas en las patas, parado sobre agua limpia en un florero, con un icono de sol; etiqueta 'de dia, agua LIMPIA, cerca de la casa'. Titulo arriba 'no es el mismo'."), eyebrow: "El de noche (agua sucia) y el del dengue (agua limpia)" }] }),
    C("mq_culex_on_wall", "common house mosquito resting on wall night", "the common night mosquito", { at: "el de la noche" }),
    C("mq_aedes_stripes_macro", "aedes aegypti white striped legs macro", "the dengue mosquito, striped legs", { at: "rayas blancas en las patas" }),
    I("mq_clean_vase_water", "clear clean water in a glass flower vase", "it breeds in clean water near the house", { at: "cria en agua limpia" }),
  ]},
  // ░░ 9) REGLA #1 (texto puro, va en OVL) ░░
  { a: "no pelees con el mosquito que vuela", beats: [
    C("mq_still_water_calm", "perfectly still stagnant water reflection", "still water is where they are born", { at: "seca el agua donde nace" }),
  ]},
  // ░░ 10) MÉTODO 1 — la ronda del agua ░░
  { a: "le llamo la ronda del agua", beats: [
    C("mq_tipping_bucket", "person tipping over bucket emptying water yard", "tipping out everything that holds water", { at: "dar vuelta o vaciar" }),
    C("mq_scrub_bucket_brush", "scrubbing inside of a bucket with a brush", "scrubbing the walls to remove stuck eggs", { at: "restrega las paredes" }),
    I("mq_saucers_emptied", "empty plant saucers stacked dry", "saucers emptied and dried", { at: "vacialos y restrega" }),
  ]},
  // ░░ 11) CRIADEROS ESCONDIDOS ░░
  { a: "hay criaderos que casi nadie revisa", beats: [
    X({ kind: "checklist", at: "presta atencion a esta lista", title: "Criaderos escondidos", items: [{ text: "Canaleta del techo tapada", state: "todo" }, { text: "Bandeja del aire acondicionado", state: "todo" }, { text: "Lonas, cubiertas y neumáticos", state: "todo" }, { text: "Rejillas y desagües tapados", state: "todo" }, { text: "Caños huecos de la reja", state: "todo" }] }),
    I("mq_yard_breeders", "messy backyard with buckets tires containers", "a yard full of hidden breeding spots", { at: "seguro tenes varios" }),
    C("mq_clogged_gutter", "clogged roof gutter full of leaves standing water", "the clogged gutter, breeder number one", { at: "la canaleta del techo tapada" }),
    C("mq_ac_drip_tray", "air conditioner unit dripping water outdoors", "the AC drip tray", { at: "el aire acondicionado" }),
    C("mq_old_tires_water", "old stacked tires holding rainwater", "old tires full of water", { at: "los neumaticos viejos" }),
    C("mq_tarp_puddle", "wrinkled tarp cover holding rainwater pool", "tarps that form pools", { at: "las lonas y las cubiertas" }),
    C("mq_hollow_fence_pipe", "hollow metal fence post open top", "hollow gate pipes fill with water inside", { at: "los canos huecos" }),
  ]},
  // ░░ 12) MÉTODO 2 — el larvicida ░░
  { a: "va el metodo 2", beats: [
    C("mq_oil_film_spread", "drop of oil spreading film on water surface", "a thin film of oil over the water", { at: "una pelicula finita" }),
    X({ kind: "diagram", at: "como un snorkel", eyebrow: "Por qué la larva se ahoga", slides: [{ image: dg("dg_mq_snorkel", "Diagrama en corte de la superficie del agua: una larva de mosquito colgando boca abajo justo bajo la superficie, sacando su tubo respiratorio como un snorkel hacia el aire. Una pelicula de aceite cubre la superficie y bloquea el tubo. Etiquetas 'la larva respira aire en la superficie', 'el aceite le tapa el tubo', 'se ahoga en horas'."), eyebrow: "El aceite le tapa el tubo de respirar" }] }),
    I("mq_bti_dunk", "mosquito dunk bti briquette larvicide", "a Bti dunk, a biological larvicide", { at: "se llama bti" }),
    C("mq_municipal_fogging_pond", "treating a pond standing water larvicide", "what the towns use to treat the water", { at: "usan los municipios" }),
  ]},
  // ░░ 13) INJERTO 1 ░░
  { a: "las cantidades exactas", beats: [
    X({ kind: "diagram", at: "un manual que arme", eyebrow: "Las dosis exactas, anotadas", slides: [{ image: dg("dg_mq_manual", "Lamina de un manual o cuaderno abierto sobre una mesa con recetas de arreglos caseros, dosis y medidas escritas, una regla y un lapiz al lado, estilo archivo artesanal. Transmite que esta todo ordenado con las cantidades justas. Sin texto legible."), eyebrow: "El Manual de Reparaciones Caseras" }] }),
    I("mq_notebook_doses", "handwritten notebook with measurements and pencil", "the exact doses written down", { at: "le erre a las dosis" }),
  ]},
  // ░░ 14) MÉTODO 3 — la trampa del balde ░░
  { a: "la trampa del balde", beats: [
    X({ kind: "diagram", at: "un lugar irresistible", eyebrow: "Convertí el rincón en una trampa", slides: [{ image: dg("dg_mq_trampa", "Diagrama de la trampa del balde: un balde oscuro con agua y pasto cortado pudriendose adentro, en un rincon con sombra. Flechas de hembras de mosquito viniendo de todo el patio, atraidas por el olor a estancado. Adentro del balde, gotas de larvicida. Etiquetas 'el olor a estancado las atrae', 'ponen los huevos aca', 'el larvicida mata todas las larvas'."), eyebrow: "Las atraés a TU balde y ahí mueren" }] }),
    C("mq_black_bucket_shade", "black bucket of water in shaded garden corner", "a dark bucket in the shade", { at: "mejor si es oscuro o negro" }),
    C("mq_grass_in_water", "grass clippings rotting in bucket water", "grass clippings fermenting in the water", { at: "un punado de pasto cortado" }),
  ]},
  // ░░ 15) PARA ESTA NOCHE ░░
  { a: "para la zona donde te sentas", beats: [
    C("mq_fan_on_patio", "electric fan on outdoor table patio", "a fan on the patio keeps them off", { at: "un ventilador" }),
    C("mq_long_sleeves_evening", "person in light long sleeves garden evening", "light long sleeves at dusk", { at: "ropa de manga larga y clara" }),
    C("mq_window_screen_mesh", "window mosquito screen mesh installation", "a screen on the windows", { at: "pone mosquitero" }),
  ]},
  // ░░ 16) EL ERROR ░░
  { a: "el error es atacar solamente", beats: [
    C("mq_spraying_aerosol", "spraying aerosol insecticide indoors night", "spraying the adults, the wrong target", { at: "agarras el aerosol" }),
    X({ kind: "diagram", at: "vaciar un bote que tiene un agujero", eyebrow: "El error que arruina todo", slides: [{ image: dg("dg_mq_bote", "Diagrama metafora claro: una persona sacando agua de un bote con un balde, mientras el bote tiene un agujero abajo por donde sigue entrando agua. Al lado, el paralelo: una mano matando mosquitos adultos con aerosol mientras un charco de agua sigue lleno de larvas. Etiquetas 'sacas agua sin tapar el agujero', 'matas adultos sin tocar el agua', 'nunca termina'."), eyebrow: "Matar adultos sin tocar el agua = no terminás nunca" }] }),
    C("mq_fumigator_returns", "pest control worker spraying garden", "the exterminator returns every month", { at: "vuelve el mes que viene" }),
  ]},
  // ░░ 17) LÍMITES ░░
  { a: "un par de honestidades", beats: [
    C("mq_repellent_arm", "applying mosquito repellent spray on arm", "repellent on skin, a patch not a fix", { at: "el repelente en la piel" }),
    I("mq_citronella_candle", "citronella candle and plant outdoors", "citronella barely works", { at: "la citronela" }),
    C("mq_fence_two_yards", "fence dividing two suburban backyards", "the neighbor's water crosses to you too", { at: "el vecino tiene su propia fabrica" }),
  ]},
  // ░░ 18) INJERTO 2 ░░
  { a: "cuando arme el manual", beats: [
    G("mq_tomas_pausa", { kicker: "Nadie te lo enseña" }),
    X({ kind: "chips", at: "le conviene que ataques", title: "Por qué nadie te lo enseña", chips: ["Al negocio del aerosol", "y del fumigador", "le conviene que ataques el aire"], hue: "red", imageDarken: 0.6, _bg: { name: "mq_store_shelf", query: "supermarket shelf full of insecticide sprays", concept: "a store shelf full of insecticide sprays" }, image: "real/mq_store_shelf.png" }),
    X({ kind: "splitlist", at: "lo dividi justo asi", title: "Los 40 arreglos, divididos así", items: ["Madera y metal que no mueren", "Plagas por centavos", "Goteras, humedad y moho", "Arreglos del hogar y el auto"], palette: "A" }),
  ]},
  // ░░ 19) RECAP ░░
  { a: "recapitulemos", beats: [
    X({ kind: "checklist", at: "recapitulemos", title: "El plan contra el mosquito", items: [{ text: "La ronda del agua cada semana", state: "done" }, { text: "Revisar los criaderos escondidos", state: "done" }, { text: "Larvicida de $2 en el agua que queda", state: "done" }, { text: "La trampa del balde en los rincones", state: "done" }, { text: "Ventilador y mosquitero para hoy", state: "done" }] }),
    I("mq_clean_patio_family", "family enjoying clean backyard patio summer evening", "your patio back, your summer nights back", { at: "recuperar tu patio" }),
  ]},
  // ░░ 20) INJERTO 3 + CIERRE ░░
  { a: "la casa entera esta llena de estos", beats: [
    X({ kind: "diagram", at: "el manual de reparaciones caseras", eyebrow: "Los 40, ordenados y probados", slides: [{ image: dg("dg_mq_stack", "Lamina tipo coleccion de valor artesanal: un manual ilustrado con 40 arreglos caseros (madera, oxido, plagas, goteras) con planos y medidas, apilado como una pila de valor. Estilo archivo, sin precios ni texto legible."), eyebrow: "Con las dosis y las medidas exactas" }] }),
    I("mq_manual_phone", "phone showing a home repair manual on table", "the manual on your phone", { at: "ordenado el dia que lo necesites" }),
    C("mq_empty_round_yard", "person walking yard emptying water containers", "go do it today: empty everything", { at: "da una vuelta al patio" }),
  ]},
  // ░░ 21) PRÓXIMO ░░
  { a: "en el proximo video", beats: [
    C("mq_ceiling_water_stain", "brown water stain on ceiling from leak", "next: the ceiling leak that always comes back", { at: "esa mancha de humedad en el techo" }),
    C("mq_old_bricklayer_roof", "old bricklayer working on a roof", "the trick of the sixty-year-old bricklayer", { at: "un albanil de sesenta anos" }),
  ]},
  { a: "la independencia no se compra", full: true, beats: [] },
];`;

const OVL = `const OVL = [
  // ── HOOK ──
  { kind: "oxquote", at: "nacio en tu casa", dur: 5.0, quote: "El mosquito que lo picó no vino de afuera. *Nació en tu casa*.", image: "real/mq_doctor.png", attribution: "Lo que me dijo el médico", side: "right", accent: "red" },
  // ── PRINCIPIO ──
  { kind: "oxstat", at: "doscientos huevos por vez", dur: 4.2, value: 200, label: "huevos por vez, tanda tras tanda, toda su vida", glyph: "🥚", accent: "red" },
  { kind: "oxstat", at: "siete dias nada mas", dur: 4.0, value: 7, suffix: " días", label: "de un dedo de agua a una nube de mosquitos", glyph: "🦟", accent: "red" },
  // ── DOS MOSQUITOS ──
  { kind: "oxtag", at: "pica de dia", dur: 4.2, name: "El del dengue", what: "Rayas blancas, pica de día, agua limpia", side: "right", accent: "red" },
  // ── REGLA #1 ──
  { kind: "oxrule", at: "seca el agua donde nace", dur: 4.6, text: "No pelees con el que *vuela*. Secá el *agua* donde nace.", accent: "amber" },
  // ── MÉTODO 1 ──
  { kind: "oxmethod", at: "le llamo la ronda del agua", dur: 4.6, num: "01", title: "La ronda del agua", chips: ["Vaciar", "Refregar", "Cada semana"], cost: "gratis", accent: "amber" },
  { kind: "oxstat", at: "el ciclo del mosquito es de siete dias", dur: 4.0, value: 7, suffix: " días", label: "cortá el agua cada semana y matás el ciclo", glyph: "📅", accent: "amber" },
  // ── CRIADEROS ──
  { kind: "oxnote", at: "seguro tenes varios", dur: 5.4, image: "real/mq_yard_breeders.png", title: "Dónde se esconden", notes: [{ x: 22, y: 40, lx: 6, ly: 22, text: "Canaleta tapada" }, { x: 55, y: 60, lx: 80, ly: 32, text: "Neumáticos y lonas" }, { x: 40, y: 78, lx: 64, ly: 90, text: "Platos y baldes" }], accent: "red" },
  // ── MÉTODO 2 ──
  { kind: "oxmethod", at: "va el metodo 2", dur: 4.4, num: "02", title: "El larvicida de $2", chips: ["Aceite", "o Bti", "en el agua"], cost: "centavos", accent: "blue" },
  { kind: "oxside", at: "no le hace absolutamente nada", dur: 5.2, image: "real/mq_bti_dunk.png", title: "El Bti", lines: ["Bacteria que solo mata larvas", "Inofensivo para peces, mascotas y chicos", "Lo que usan los municipios"], side: "right", accent: "blue" },
  { kind: "oxstat", at: "durante treinta dias", dur: 4.0, value: 30, suffix: " días", label: "un pedacito mata larvas por un mes entero", glyph: "🛡️", accent: "blue" },
  // ── MÉTODO 3 ──
  { kind: "oxmethod", at: "agarra un balde", dur: 4.6, num: "03", title: "La trampa del balde", chips: ["Balde oscuro", "Pasto / hojas", "Larvicida"], cost: "$2", accent: "amber" },
  { kind: "oxstat", at: "doscientos mosquitos que no nacen", dur: 4.0, value: 200, label: "mosquitos menos por cada hembra que cae en la trampa", glyph: "🪤", accent: "amber" },
  // ── ESTA NOCHE ──
  { kind: "oxtag", at: "un volador pesimo", dur: 4.0, name: "El ventilador", what: "Una brisa floja y no pueden acercarse", side: "left", accent: "green" },
  // ── ERROR ──
  { kind: "oxrule", at: "no mates mosquitos", dur: 4.6, text: "No mates mosquitos. Matá *criaderos*.", accent: "red" },
  // ── CIERRE ──
  { kind: "oxbefore", at: "da una vuelta al patio", dur: 4.4, before: "real/mq_yard_breeders.png", after: "real/mq_clean_patio_family.png", accent: "green" },
  { kind: "oxquote", at: "el link esta abajo", dur: 5.0, quote: "Cuesta menos que dos visitas del fumigador. El link está *abajo*.", image: "real/mq_manual_phone.png", attribution: "Igual, hacé lo de hoy", side: "right", accent: "green" },
];`;

src = src.replace(/const SECTIONS = \[[\s\S]*?\n\];/, SECTIONS);
src = src.replace(/const OVL = \[[\s\S]*?\n\];/, OVL);
fs.writeFileSync(path, src);
console.log("splice OK");
