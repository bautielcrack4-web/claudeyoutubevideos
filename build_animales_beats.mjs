// build_animales_beats.mjs — autoría densa y ANCLADA a captions de "El Abuelo Revela
// los 7 Animales Más Rentables que Puedes Criar en Tu Patio" (29.4 min reales).
// Cada beat se ancla a una FRASE textual de la narración (sync exacto). Densidad alta
// (~1 visual cada 5-6s): pods de b-roll real (deAPI) + clips de movimiento (LTX) +
// MUCHOS componentes (top7/stat/bars/cross/process/checklist/journey/diagram/aged/
// annotated/callout/chips/splitlist/quote/headline) + 8 tomas "él haciendo X" (PA).
// Identidad: tarjeta TOP7 de revelación + riel 1→7. Marca terrosa serif. El avatar
// lo posiciona el Main (full al abrir/cerrar, cornerTR sobre b-roll, hidden en gráficos).

export function authorBeats(ctx) {
  const { P, PA, HALF, C, ST, D, Q, HEAD, AGED, IMP, CH, SPL, BARS, CROSS, PROC, CHK, ANN, CALL, JNY, INFZ, TOP7 } = ctx;

  // ════════════════ HOOK — el supermercado (terracota, tenso) ════════════════
  IMP("Entras al supermercado", "img/hk_eggs_price.png", "el DOBLE que hace un año", { setup: "Doce huevos…", impactAccent: "danger", hitAt: 0.9, boom: 2, darken: 0.45, _dur: 4 });
  P("Agarras el cartón", "hk_eggs_price", "a hand reaching for a carton of a dozen eggs on a supermarket shelf, a price tag below, refrigerated dairy aisle, NO readable text, price not legible", { hue: "red", kicker: "Doce huevos, lo que cueste", light: "indoor fluorescent supermarket lighting, muted colors" });
  C("medio lleno", "hk_cart", "point of view pushing a half-full shopping cart down a bright supermarket aisle, slow motion", { hue: "red", frames: 90 });
  P("la sección de los huevos", "hk_eggshelf", "rows of egg cartons on a refrigerated supermarket shelf, a small price sign, NO readable text", { hue: "red", kicker: "Mirás el precio" });
  P("por la carnicería", "hk_meat", "packages of fresh ground beef and a whole raw chicken in a refrigerated supermarket meat case, price stickers, NO readable text", { hue: "red", kicker: "Lo que cueste", light: "indoor fluorescent supermarket lighting, muted colors" });
  P("Queso fresco", "hk_cheese", "a block of fresh white cheese in plastic wrap on a refrigerated supermarket shelf, NO readable text", { hue: "red" });
  C("la cajera te pasa", "hk_scanner", "close up of a barcode scanner beeping groceries at a supermarket checkout, items sliding, slow motion", { hue: "red", frames: 90 });
  P("el número en la pantalla", "hk_checkout", "an older customer's hands holding a worn wallet at a supermarket checkout, a small payment terminal screen, NO readable numbers", { hue: "red", kicker: "Te duele un poco", light: "indoor fluorescent supermarket lighting, muted colors" });
  Q("pero pagas porque no hay otra opción", "Pagas porque *no hay otra opción*. O eso te dijeron", { image: "img/hk_checkout.png", accent: "danger", hue: "red", fontSize: 76 });

  // el patio vacío que vale más
  PA("Guardas todo en el refrigerador", "hk_fridge", "guardando las bolsas de la compra del supermercado en la heladera de su cocina modesta", { hue: "amber", kicker: "Volvés a tu casa" });
  P("hay un pedazo de tierra", "hk_yard", "an empty unused corner of a suburban backyard against a fence, overgrown weeds and grass, a strip of bare dirt, ordinary documentary", { hue: "cold", kicker: "Que no usás para nada" });
  P("contra la barda", "hk_fence", "a fence corner in a backyard where tall weeds grow, neglected ground, documentary", { hue: "cold", kicker: "Donde crece la hierba mala" });
  P("costado del garaje", "hk_garage", "the narrow side of a home garage where a car does not fit, a strip of unused ground with weeds, documentary", { hue: "cold" });
  P("un fondo con pasto", "hk_lawn", "a plain backyard lawn that is mowed but unused, ordinary grass, documentary", { hue: "cold", kicker: "Que cortás cada quince días" });
  HEAD("vale más que todo lo que acabas de comprar", [{ t: "Ese" }, { t: "espacio" }, { t: "vale" }, { t: "más", good: true }, { t: "que" }, { t: "todo" }, { t: "el" }, { t: "súper" }], { eyebrow: "Y nadie te lo dijo", hue: "amber", bg: "image", image: "img/hk_yard.png" });

  // ════════════════ ABUELO — crecí en el campo ════════════════
  P("Crecí en el campo", "ab_campo", "a faded vintage archival photograph of a rural country house yard decades ago, chickens pecking, a simple wooden fence, warm nostalgic", { hue: "amber", arch: true, kicker: "Yo soy viejo" });
  P("para comprar azúcar", "ab_store_old", "a faded vintage photo of a tiny old general store counter with sacks of sugar, salt and a tin of oil, sepia", { hue: "amber", arch: true, kicker: "Azúcar, sal y aceite" });
  P("venían de las gallinas", "ab_eggs_basket", "an old enamel bowl of fresh eggs on a rustic wooden table in a country kitchen, documentary", { hue: "amber" });
  P("La carne venía de los conejos", "ab_rabbits_old", "rabbits in a simple old wooden hutch in a rural backyard, documentary", { hue: "amber" });
  P("La leche venía de la cabra", "ab_goat_old", "a goat being milked by hand into a metal pail in a rustic farmyard, documentary", { hue: "amber" });
  CH("venía de las lombrices", ["Huevos → gallinas", "Carne → conejos", "Leche → cabra", "Abono → lombrices", "Miel → abejas"], { title: "Todo venía del fondo de la casa", image: "img/ab_campo.png", hue: "amber" });
  Q("pagarle a una corporación", "Lo *raro* es pagarle a una corporación lo que tu abuelo hacía solo", { eyebrow: "Eso era lo normal", accent: "danger", hue: "red", fontSize: 60 });

  // ════════════════ PROMESA — los 7 ════════════════
  HALF("criar en tu patio", "pr_patio", "a modest backyard with space for animals, a small coop and a vegetable garden, golden light, hopeful documentary", { hue: "amber", kicker: "En tu patio, tu terraza, tu balcón" });
  CH("huevos, carne, leche, fertilizante y miel", ["Huevos", "Carne", "Leche", "Fertilizante", "Miel"], { title: "Siete animales para tu patio", image: "img/pr_patio.png", hue: "amber" });
  INFZ("Algunos los conoces", [
    { src: "img/t7_gallina.png", label: "Gallina" },
    { src: "img/t7_conejo.png", label: "Conejo" },
    { src: "img/t7_codorniz.png", label: "Codorniz" },
    { src: "img/t7_abeja.png", label: "Abeja" },
  ], { accent: "amber", _dur: 7 });
  Q("el último de la lista es el más rentable", "El último es el *más rentable* — y casi nadie lo cría", { eyebrow: "Requiere paciencia y un poco de coraje", accent: "danger", hue: "red", fontSize: 66 });
  HEAD("cuál de estos siete crees que es el más rentable", [{ t: "¿Cuál" }, { t: "crees" }, { t: "que" }, { t: "es" }, { t: "el" }, { t: "más", good: true }, { t: "rentable?" }], { eyebrow: "Anótalo mentalmente", hue: "amber", bg: "black" });
  P("me cuentas en los comentarios", "pr_comments", "a hand writing a single word on a small notepad on a kitchen table, documentary close up, NO readable text", { hue: "amber", kicker: "Al final te digo cuál es" });

  // ════════════════════════ 1 · GALLINA ════════════════════════
  TOP7("Empecemos por el que todo el mundo conoce", 1, "La gallina ponedora", "Huevos todo el año — la puerta de entrada", "t7_gallina", "a healthy brown Isa Brown laying hen standing on green grass in a backyard, close documentary portrait, soft daylight", { accent: "good", hue: "amber", _dur: 5.5 });
  HALF("es el animal de entrada", "g_coop", "three brown laying hens inside a simple small backyard wooden coop with wire mesh, documentary", { hue: "amber", kicker: "Es la puerta" });
  C("empiezas por acá", "g_hen_grass", "a brown hen pecking and scratching in green grass in a backyard, free range, slow motion documentary", { hue: "amber", frames: 90 });
  CH("una Issa Brown, una Rhode Island", ["Isa Brown", "Rhode Island", "Sussex"], { title: "Razas ponedoras de verdad", image: "img/t7_gallina.png", hue: "amber" });
  ST("trescientos huevos por año", 300, { prefix: "250–", label: "huevos por año, de buena raza", eyebrow: "Una gallina ponedora", accent: "good", hue: "amber" });
  CALL("veinticinco huevos por mes", "20–25", { image: "img/g_hen_grass_src.png", eyebrow: "Por gallina, al mes", caption: "Tres gallinas = 5–6 docenas", accent: "amber", hue: "amber" });
  BARS("más de lo que una familia de cuatro necesita", [
    { label: "Lo que pone 1 gallina/mes", value: 25, display: "20–25", tone: "amber" },
    { label: "Lo que come una familia/mes", value: 60, display: "lo cubre", winner: true, tone: "good" },
  ], { title: "Te sobra", eyebrow: "Familia de cuatro", orientation: "horizontal", hue: "amber" });
  PA("El sobrante lo vendes", "g_basket", "sosteniendo una canasta de mimbre llena de huevos frescos recién juntados, parado en el patio, con una leve sonrisa", { hue: "amber", kicker: "El vecino te toca la puerta" });
  // lo que nadie te dice — el alimento
  P("lo que nadie te dice de las gallinas", "g_feedbag", "a large bag of commercial poultry feed pellets in a pet store, expensive feed, NO readable text, price not legible", { hue: "red", kicker: "Alimento balanceado comprado", light: "indoor store lighting, muted colors" });
  C("Y ese alimento es caro", "g_feed_pour", "commercial feed pellets pouring from a scoop into a metal feeder, slow motion close up", { hue: "red", frames: 80 });
  Q("los números no cierran", "Gastas *más* en alimento de lo que ahorras en huevos", { image: "img/g_feedbag.png", eyebrow: "Y ahí la mayoría se frustra", accent: "danger", hue: "red", fontSize: 60 });
  HEAD("el problema no es la gallina", [{ t: "El" }, { t: "problema" }, { t: "es" }, { t: "lo" }, { t: "que" }, { t: "le" }, { t: "das", danger: true }, { t: "de" }, { t: "comer" }], { eyebrow: "No es la gallina", hue: "red", bg: "image", image: "img/g_feed_pour_src.png" });
  SPL("come pasto, come insectos", "De qué se alimenta GRATIS", ["Pasto y trébol", "Insectos y larvas", "Restos de cocina", "Verdura pasada y cáscaras", "Semillas"], { palette: "G" });
  C("come restos de cocina", "g_scraps", "kitchen vegetable scraps being tossed to hens in a backyard, the hens rushing to peck, slow motion", { hue: "amber", frames: 90 });
  D("El secreto es la tierra donde la gallina camina", "El secreto NO es la gallina: es la tierra", [
    { name: "g_soil", title: "Se alimenta casi sola", panel: "Una lámina con una gallina en el centro picoteando el suelo, y alrededor flechas simples hacia lo que come gratis del patio: pasto y trébol verde, lombrices e insectos bajo la tierra, restos de cocina y cáscaras. Etiqueta grande: 'tierra fértil = alimento gratis'. Pocos bloques, muy clara." },
  ], { hue: "amber", accent: "accent", _dur: 9 });
  P("si tiene trébol y pasto verde", "g_clover", "close up of green clover and grass with worms and insects in fertile dark soil, a hen's feet nearby, documentary macro", { hue: "cold", kicker: "Lombrices, insectos, trébol" });
  // open loop al próximo video
  Q("revivir cualquier tierra muerta por un dólar", "Revivir tierra muerta por *un dólar*… pero eso es otro tema", { image: "img/g_clover.png", eyebrow: "Algo que vamos a ver más adelante", accent: "danger", hue: "red", fontSize: 58 });
  CHK("un metro cuadrado de gallinero techado", "Lo que necesitas para arrancar", [
    { text: "3 gallinas de buena raza", state: "done" },
    { text: "1 m² de gallinero techado y ventilado", state: "done" },
    { text: "Acceso a un pedazo de pasto", state: "done" },
    { text: "Los restos de tu cocina", state: "done" },
  ], { eyebrow: "Inversión baja, mantenimiento casi nulo", hue: "amber", image: "img/g_coop.png" });
  Q("pero no es la más rentable", "La base. Pero *no* es la más rentable", { image: "img/t7_gallina.png", accent: "amber", hue: "amber", fontSize: 82 });

  // ════════════════════════ 2 · CONEJO ════════════════════════
  TOP7("Segundo animal", 2, "El conejo", "Carne + fertilizante — la máquina más eficiente", "t7_conejo", "a calm grey-brown meat rabbit sitting in a clean wire hutch in a backyard, documentary portrait, soft daylight", { accent: "amber", hue: "amber", _dur: 5.5 });
  HALF("el animal más subestimado del mundo", "c_hutch", "a backyard rabbit hutch with several rabbits, wooden and wire construction, documentary", { hue: "amber", kicker: "El más subestimado" });
  P("algo tierno que compran los niños", "c_pet", "a cute pet rabbit held by a child at a fair, documentary", { hue: "cold", kicker: "La gente lo ve como mascota" });
  HEAD("una máquina de producir carne", [{ t: "Una" }, { t: "máquina", good: true }, { t: "de" }, { t: "producir" }, { t: "carne" }], { eyebrow: "De la forma más eficiente de la naturaleza", hue: "amber", bg: "image", image: "img/c_hutch.png" });
  ST("entre veinticinco y cuarenta crías por año", 40, { prefix: "25–", label: "crías por año, de UNA sola coneja", eyebrow: "Escúchame este número", accent: "amber", hue: "amber" });
  C("llega a peso de faena en tres meses", "c_grow", "young rabbits growing in a clean hutch, time of growth, slow motion documentary", { hue: "amber", frames: 80 });
  BARS("Un novillo tarda dos años", [
    { label: "Conejo", value: 3, display: "3 meses", winner: true, tone: "good" },
    { label: "Cerdo", value: 6, display: "6 meses", tone: "amber" },
    { label: "Novillo", value: 24, display: "2 años", tone: "danger" },
  ], { title: "Tiempo hasta peso de faena", eyebrow: "El conejo: 90 días", orientation: "horizontal", unit: "", hue: "amber" });
  CALL("un kilo y medio y dos kilos y medio", "1,5–2,5 kg", { image: "img/t7_conejo.png", eyebrow: "Carne limpia por conejo", caption: "Haz la cuenta", accent: "amber", hue: "amber" });
  BARS("Con dos conejas madre tienes doscientos kilos", [
    { label: "1 coneja madre", value: 100, display: "40–100 kg/año", tone: "amber" },
    { label: "2 conejas madre", value: 200, display: "≈200 kg/año", winner: true, tone: "good" },
  ], { title: "Carne al año", eyebrow: "Más de la que una familia necesita", orientation: "horizontal", unit: " kg", hue: "amber" });
  // la carne más sana
  D("la carne de conejo es la más sana", "La carne más sana que existe", [
    { name: "c_health", title: "Conejo vs pollo vs res", panel: "Una lámina comparativa de tres columnas simples: CONEJO (más proteína, menos grasa, menos colesterol) destacado en verde salvia; POLLO y CARNE ROJA al lado. Tildes y cruces grandes. Texto pequeño: 'la recomiendan para problemas cardíacos, diabéticos y gente mayor'. Muy clara." },
  ], { hue: "amber", accent: "accent", _dur: 9 });
  P("una carne blanca, tierna", "c_meat", "lean fresh rabbit meat on a wooden cutting board in a home kitchen, documentary, healthy white meat", { hue: "amber", kicker: "Tierna, sabor suave" });
  // espacio
  P("una jaula de un metro por sesenta", "c_cage1", "a single wire breeding cage for a rabbit, one meter by sixty centimeters, in a backyard, documentary", { hue: "amber", kicker: "Por conejo reproductor" });
  CROSS("tres metros por dos metros", [
    { label: "2 conejas madre", color: "#7C8A5A", weight: 2 },
    { label: "1 macho reproductor", color: "#A9794A", weight: 1 },
    { label: "Crías en jaulas de engorde", color: "#6E8B47", weight: 3 },
  ], { title: "Un plantel en 3 × 2 metros", eyebrow: "Menos que un armario grande", marker: { label: "entra en un garaje", atDepth: 3, color: "accent" }, hue: "amber" });
  CH("come alfalfa, come diente de león", ["Alfalfa", "Diente de león", "Hojas de zanahoria", "Tallos de apio", "Heno y pasto"], { title: "Alimento: gratis del patio", image: "img/c_hutch.png", hue: "amber" });
  C("come los tallos de apio que tú tiras", "c_feedleaves", "fresh dandelion greens and carrot tops being placed into a rabbit hutch, a rabbit nibbling, slow motion", { hue: "cold", frames: 80 });
  // estiércol — dos productos en uno
  PA("el estiércol del conejo", "c_manure", "agachado, esparciendo con la mano estiércol de conejo (pellets oscuros) directamente sobre la tierra del huerto", { hue: "cold", kicker: "No quema las plantas" });
  Q("dos productos en uno", "El conejo te da carne *y* fertilizante", { image: "img/c_manure.png", accent: "good", hue: "amber", fontSize: 70 });
  // la frase del abuelo
  AGED("me dijo mi abuelo cuando era niño", "Lo que me dijo mi abuelo", [
    { text: "La diferencia entre depender y no depender…", mark: false },
    { text: "…es una sola habilidad que te da vergüenza aprender", mark: true },
  ], { eyebrow: "A alguno le da impresión faenar", accent: "amber", hue: "amber", _dur: 8 });
  Q("sin pagar un centavo en la carnicería", "Carne de primera todo el año, *sin pagar* en la carnicería", { image: "img/c_meat.png", accent: "good", hue: "amber", fontSize: 60 });

  // ════════════════════════ 3 · CODORNIZ ════════════════════════
  TOP7("Tercer animal", 3, "La codorniz", "Huevos premium en mínimo espacio", "t7_codorniz", "a small Coturnix japonica quail held gently in a person's open hands, tiny brown speckled bird the size of a fist, documentary", { accent: "accent", hue: "amber", _dur: 5.5 });
  PA("del tamaño de tu puño", "q_hand", "sosteniendo una codorniz diminuta en la palma de su mano, mostrándola a la cámara, primer plano", { hue: "amber", kicker: "Del tamaño de tu puño" });
  C("que pone un huevo por día", "q_lay", "a quail in a small cage with a freshly laid speckled egg beneath it, slow motion documentary", { hue: "amber", frames: 80 });
  ST("trescientos sesenta huevos al año", 360, { label: "huevos al año — uno por día", eyebrow: "Una sola codorniz", accent: "good", hue: "amber" });
  BARS("Una gallina te da doscientos cincuenta con suerte", [
    { label: "Codorniz", value: 360, display: "360", winner: true, tone: "good" },
    { label: "Gallina", value: 250, display: "250", tone: "amber" },
  ], { title: "Huevos al año, por ave", eyebrow: "Y en una fracción del espacio", orientation: "horizontal", unit: "", hue: "amber" });
  HALF("caja de zapatos grande", "q_cage", "five small quails inside a compact wire cage the size of a large shoebox, on a shelf in a garage, documentary", { hue: "amber", kicker: "Cinco en una caja de zapatos" });
  ANN("Diez codornices caben en el espacio", "img/q_cage.png", [
    { kind: "circle", x: 50, y: 50, w: 30, label: "10 = el espacio de 1 gallina" },
    { kind: "arrow", x: 28, y: 28, fromX: 10, fromY: 12, label: "10 huevos por día" },
  ], { eyebrow: "Setenta huevos por semana", hue: "amber" });
  P("se venden al doble o al triple", "q_eggs_market", "tiny speckled quail eggs in a small premium carton at a natural food market, NO readable text", { hue: "amber", kicker: "Producto premium" });
  D("más hierro, más vitamina B12", "Por qué es premium", [
    { name: "q_premium", title: "Más nutrientes, proporcional", panel: "Una lámina simple: un huevo de codorniz dibujado grande con tres etiquetas alrededor — 'más hierro', 'más vitamina B12', 'más proteína (proporcional)'. Abajo: 'lo buscan tiendas naturistas y restaurantes'. Tinta fina, acuarela suave, muy clara." },
  ], { hue: "amber", accent: "accent", _dur: 8.5 });
  CHK("no necesita sol directo", "Dónde se puede criar", [
    { text: "En un departamento", state: "done" },
    { text: "En un lavadero o garaje cerrado", state: "done" },
    { text: "Con luz artificial y ventilación", state: "done" },
    { text: "Sin sol, sin tierra, sin patio", state: "done" },
  ], { eyebrow: "El animal perfecto para la ciudad", hue: "amber", image: "img/q_cage.png" });
  CALL("veinte y veinticinco gramos por día", "20–25 g", { image: "img/q_hand.png", eyebrow: "Lo que come por día", caption: "Diez comen menos que una gallina", accent: "accent", hue: "amber" });
  Q("Coturnix japónica", "La *Coturnix Japonica* merece su propio video entero", { image: "img/t7_codorniz.png", eyebrow: "El animal más eficiente por m²", accent: "amber", hue: "amber", fontSize: 58 });

  // ════════════════════════ 4 · PATO ════════════════════════
  TOP7("Cuarto animal", 4, "El pato", "Huevos + control de plagas del huerto", "t7_pato", "a Khaki Campbell duck standing in a backyard vegetable garden near a water basin, brown plumage, documentary portrait", { accent: "cold", hue: "cold", _dur: 5.5 });
  HALF("para tener en una laguna", "p_pond", "a duck on a decorative garden pond, the common cliché, documentary", { hue: "cold", kicker: "Todos creen que es decorativo" });
  C("come plagas del huerto", "p_garden", "a brown duck walking between rows of vegetable plants in a backyard garden, hunting pests, slow motion", { hue: "cold", frames: 90 });
  ST("entre 280 y 320 huevos por año", 320, { prefix: "280–", label: "huevos por año — más que la gallina", eyebrow: "Una pata Khaki Campbell", accent: "good", hue: "cold" });
  BARS("más que la mayoría de las gallinas ponedoras", [
    { label: "Pato (Khaki Campbell)", value: 320, display: "280–320", winner: true, tone: "good" },
    { label: "Gallina ponedora promedio", value: 270, display: "≈250–280", tone: "amber" },
  ], { title: "Mejor ponedor de lo que crees", orientation: "horizontal", unit: "", hue: "cold" });
  P("el huevo de pato es más grande", "p_egg", "a large duck egg next to a chicken egg on a wooden table for size comparison, documentary macro", { hue: "amber", kicker: "Más grande, más yema" });
  CH("para hacer pan y repostería", ["Pan artesanal", "Repostería", "Más estructura en la masa"], { title: "Los panaderos lo buscan", image: "img/p_egg.png", hue: "amber" });
  // pesticida con patas
  C("come babosas, come caracoles", "p_slug", "a duck eating a slug among garden plants, close documentary shot, pest control in action, slow motion", { hue: "cold", frames: 80, kicker: "Babosas, caracoles, larvas" });
  D("dos patos resuelven el problema", "Un pesticida con patas", [
    { name: "p_pest", title: "Se come las plagas, no las plantas", panel: "Una lámina: un pato caminando entre plantas de huerto con flechas hacia lo que se come — babosas, caracoles, larvas de mosquito, insectos. Etiqueta clara: 'no rasca la tierra como la gallina, no destroza los cultivos'. Verde salvia, muy clara." },
  ], { hue: "cold", accent: "accent", _dur: 9 });
  HEAD("sin tocar las plantas", [{ t: "Camina" }, { t: "entre" }, { t: "las" }, { t: "plantas" }, { t: "comiendo" }, { t: "bichos", good: true }], { eyebrow: "No rasca la tierra como la gallina", hue: "amber", bg: "image", image: "img/p_garden_src.png" });
  // agua
  PROC("el pato necesita agua", [
    { title: "Un recipiente con agua", desc: "una tina, una pileta o un balde cortado", image: "img/p_water_src.png" },
    { title: "Mete la cabeza y chapotea", desc: "no necesita laguna", image: "img/p_garden_src.png" },
    { title: "El agua sucia riega las plantas", desc: "llena de nutrientes", image: "img/p_egg.png" },
  ], { title: "Eso sí: necesita agua", eyebrow: "Todo se conecta", hue: "cold", accent: "cold", _dur: 8 });
  C("meter la cabeza y chapotear", "p_water", "a brown duck splashing and dunking its head in a half plastic tub of water in a backyard, slow motion", { hue: "cold", frames: 90 });

  // ════════════════════════ 5 · CABRA ENANA ════════════════════════
  TOP7("Quinto animal", 5, "La cabra enana", "Leche y queso fresco todos los días", "t7_cabra", "a small friendly Nigerian dwarf goat standing in a backyard pen, the size of a medium dog, documentary portrait", { accent: "good", hue: "amber", _dur: 5.5 });
  PA("del tamaño de un perro mediano", "k_pen", "agachado junto a una pequeña cabra enana nigeriana en un corral modesto del patio, acariciándola", { hue: "amber", kicker: "Te da leche todos los días" });
  C("produce entre uno y dos litros", "k_milk_pour", "fresh goat milk being poured from a metal pail into a glass jar in a rustic kitchen, slow motion", { hue: "amber", frames: 80 });
  ST("entre uno y dos litros de leche por día", 2, { prefix: "1–", suffix: " L", label: "de leche por día — alcanza para tu familia", eyebrow: "Una cabra enana nigeriana", accent: "good", hue: "amber" });
  // leche más digestiva
  D("la leche de cabra es más digestiva", "Por qué cae mejor que la de vaca", [
    { name: "k_milk", title: "Sin caseína A1", panel: "Una lámina comparativa de dos columnas: LECHE DE VACA (con caseína A1, le cae mal a mucha gente) y LECHE DE CABRA (sin A1, más ácidos grasos de cadena corta, se absorbe mejor) destacada en verde. Un vaso de leche dibujado en cada lado, tildes y cruces grandes." },
  ], { hue: "amber", accent: "accent", _dur: 9 });
  HALF("con la leche haces queso", "k_cheese", "a round of fresh white goat cheese on a wooden board in a farmers market stall, documentary", { hue: "amber", kicker: "Producto premium" });
  BARS("vale una fortuna", [
    { label: "Leche cruda", value: 30, display: "barata", tone: "amber" },
    { label: "Queso fresco de cabra", value: 100, display: "se vende caro", winner: true, tone: "good" },
  ], { title: "Con 2 litros, un queso de 200 g", eyebrow: "Que en la tienda vale una fortuna", orientation: "horizontal", hue: "amber" });
  // desbrozadora
  C("la mejor desbrozadora natural", "k_brush", "a dwarf goat eating weeds and brush in an overgrown corner of a yard, natural brush clearing, slow motion", { hue: "cold", frames: 80, kicker: "Te limpia el terreno gratis" });
  SPL("come lo que otros animales no comen", "La cabra come lo que otros no", ["Pasto y maleza", "Ramas y hojas", "Hierbas malas", "Te limpia el terreno gratis"], { palette: "G" });
  P("un animal sociable, cariñoso", "k_kids", "a friendly dwarf goat being petted by children in a backyard, affectionate, documentary", { hue: "amber", kicker: "Los niños la adoran" });
  // cuidados
  CHK("necesitas al menos dos", "El único cuidado especial", [
    { text: "Necesitas al menos DOS", state: "done", note: "la sola se deprime" },
    { text: "Un corral de ~4 m² con techito", state: "done" },
    { text: "Pasto y maleza para comer", state: "done" },
    { text: "Estiércol directo a la tierra", state: "done" },
  ], { eyebrow: "Menos que un cajón de estacionamiento", hue: "amber", image: "img/k_pen.png" });

  // ════════════════════════ 6 · LOMBRIZ ════════════════════════
  TOP7("Sexto animal", 6, "La lombriz roja", "Fertilizante que se multiplica solo", "t7_lombriz", "a handful of dark rich soil full of red California earthworms held in two cupped hands, macro documentary, vermicompost", { accent: "danger", hue: "amber", _dur: 5.5 });
  HEAD("no tiene ojos, no tiene patas", [{ t: "Sin" }, { t: "ojos." }, { t: "Sin" }, { t: "patas." }, { t: "Cabe" }, { t: "en" }, { t: "un" }, { t: "balde", good: true }], { eyebrow: "El que nadie espera en una lista así", hue: "amber", bg: "image", image: "img/t7_lombriz.png" });
  Q("el animal más rentable por metro cuadrado", "El *más rentable por metro cuadrado* del planeta", { eyebrow: "No carne ni huevos: fertilizante", accent: "danger", hue: "red", fontSize: 62 });
  // qué hace
  C("come residuos orgánicos", "l_feed", "kitchen scraps, vegetable peels and coffee grounds being added on top of a worm bin, worms underneath, slow motion macro", { hue: "amber", frames: 80, kicker: "Restos de cocina, cáscaras, café" });
  D("los transforma en humus de lombriz", "De residuo a humus de lombriz", [
    { name: "l_humus_d", title: "Come tu basura, hace oro negro", panel: "Una lámina de proceso en 3 pasos con flechas elegantes: 1) restos de cocina, cáscaras, hojas secas, cartón húmedo y borra de café; 2) una caja con lombrices rojas trabajando la tierra; 3) humus de lombriz oscuro y rico. Etiqueta: 'el fertilizante orgánico más completo y caro del mercado'. Muy clara." },
  ], { hue: "amber", accent: "accent", _dur: 9 });
  ST("entre 500 gramos y un kilo de humus por semana", 1, { suffix: " kg", label: "de humus por m² cada SEMANA", eyebrow: "Sin hacer nada más", accent: "good", hue: "amber" });
  PA("se vende bien en cualquier vivero", "l_humus", "sosteniendo en sus dos manos humus de lombriz oscuro y rico sobre un cantero del huerto, mostrándolo a la cámara", { hue: "amber", kicker: "Un kilo de humus" });
  // se multiplica
  BARS("en un año tienes dieciséis mil", [
    { label: "Hoy", value: 1, display: "1.000", tone: "amber" },
    { label: "6 meses", value: 4, display: "4.000", tone: "good" },
    { label: "1 año", value: 16, display: "16.000", winner: true, tone: "good" },
  ], { title: "Se duplica cada 3 meses", eyebrow: "Y las lombrices también se venden", orientation: "horizontal", unit: "", hue: "amber" });
  P("para pesca, para otros lombriceros", "l_sell", "red worms in a small container ready to sell for fishing and composting, documentary macro", { hue: "cold", kicker: "Un negocio que se multiplica solo" });
  // el lombricero
  CROSS("una caja de madera de sesenta por cuarenta", [
    { label: "Restos de cocina encima", color: "#A9794A", weight: 1 },
    { label: "Lombrices trabajando", color: "#B0503C", weight: 2 },
    { label: "Tierra y humus abajo", color: "#2A2620", weight: 3 },
  ], { title: "Una caja de 60 × 40 cm con agujeros", eyebrow: "En un balcón, un garaje, bajo el fregadero", marker: { label: "humus en 3 meses", atDepth: 3, color: "good" }, hue: "amber" });
  CHK("no necesita cuidado veterinario", "Todo lo que necesita", [
    { text: "Una caja de madera con agujeros abajo", state: "done" },
    { text: "Tierra y restos de cocina", state: "done" },
    { text: "Mil lombrices para arrancar", state: "done" },
    { text: "Un rincón oscuro y húmedo", state: "done" },
  ], { eyebrow: "Sin sol, sin ruido, sin veterinario, sin olor", hue: "amber", image: "img/l_humus.png" });

  // ★ EL CÍRCULO — journey continuo (el dispositivo estrella)
  JNY("Cada animal alimenta al siguiente", "Cada animal alimenta al siguiente", "El sistema se alimenta solo", [
    { x: 0.18, y: 0.30, z: 0, image: "img/t7_lombriz.png", num: "1", label: "Lombrices", sub: "hacen el fertilizante", dwell: 3.0, travel: 1.8 },
    { x: 0.55, y: 0.20, z: 0.1, image: "img/g_soil_world.png", num: "2", label: "Tierra fértil", sub: "pasto y verduras", dwell: 3.0, travel: 1.8 },
    { x: 0.82, y: 0.42, z: 0, image: "img/t7_gallina.png", num: "3", label: "Los animales", sub: "comen del patio", dwell: 3.0, travel: 1.8 },
    { x: 0.60, y: 0.70, z: 0.1, image: "img/c_manure.png", num: "4", label: "El estiércol", sub: "vuelve a la tierra", dwell: 3.0, travel: 1.8 },
    { x: 0.25, y: 0.62, z: 0, image: "img/l_humus.png", num: "5", label: "Y otra vez", sub: "no se tira nada", dwell: 3.2, travel: 1.6 },
  ], { accent: "good", _dur: 19 });
  P("La tierra fértil produce el pasto", "g_soil_world", "a top-down view of dark fertile garden soil with green seedlings sprouting, rich healthy earth, documentary", { hue: "amber" });
  AGED("No le ponía nombre", "Mi abuelo no le ponía nombre", [
    { text: "No lo llamaba permacultura ni economía circular", mark: false },
    { text: "Simplemente así se hacía", mark: true },
    { text: "Lo que sobraba de un lado iba al otro", mark: true },
  ], { eyebrow: "Es un círculo", accent: "amber", hue: "amber", _dur: 8 });

  // ════════════════════════ 7 · ABEJA ════════════════════════
  TOP7("Ahora el séptimo", 7, "La abeja", "Miel, cera, propóleo… y poliniza todo", "t7_abeja", "a beekeeper's gloved hands holding a wooden hive frame covered in honeybees in a backyard apiary, documentary", { accent: "amber", hue: "amber", label: "EL TOP 7 · LA CORONA", _dur: 6 });
  Q("Antes de que cierres esto", "Las abejas *no* son lo que piensas", { image: "img/t7_abeja.png", eyebrow: "El más rentable por hora de trabajo", accent: "danger", hue: "red", fontSize: 64 });
  SPL("no te atacan si sabes lo que haces", "Lo que nadie te dice de las abejas", ["No te atacan si sabes lo que haces", "No necesitan un campo", "No necesitan flores especiales", "Se cuidan solas el 90% del tiempo"], { palette: "G" });
  HALF("Una colmena estándar", "b_hive", "a single white wooden beehive box standing in a backyard corner near flowers, documentary", { hue: "amber", kicker: "Una sola colmena" });
  ST("entre 20 y 40 kilos de miel por año", 40, { prefix: "20–", suffix: " kg", label: "de miel por año, una sola colmena", eyebrow: "Según zona y floración", accent: "good", hue: "amber" });
  C("Un kilo de miel pura", "b_honey_jar", "golden honey being poured into a glass jar in a backyard, thick slow pour, slow motion macro", { hue: "amber", frames: 80, kicker: "Se vende muy bien" });
  // la cuenta que sorprende
  BARS("más dinero por año que 10 gallinas juntas", [
    { label: "Trabajo de 10 gallinas", value: 100, display: "todo el año", tone: "amber" },
    { label: "Una colmena", value: 100, display: "más $ / año", winner: true, tone: "good" },
  ], { title: "Más que 10 gallinas juntas", eyebrow: "Y solo 15–20 horas… AL AÑO", orientation: "horizontal", hue: "amber" });
  CALL("son unas 15 o 20 horas por año", "15–20 h", { image: "img/b_hive.png", eyebrow: "Trabajo real de manejo", caption: "Por año. No por mes", accent: "amber", hue: "amber" });
  // polinización
  C("las abejas polinizan", "b_flower", "a honeybee landing on a flower in a backyard garden, pollination close up, slow motion macro", { hue: "amber", frames: 80, kicker: "Van de flor en flor" });
  D("produce entre un 30 y un 50% más", "El bonus: polinizan el huerto", [
    { name: "b_pollin", title: "+30 a 50% de producción", panel: "Una lámina comparativa: a la izquierda un huerto sin abejas (pocas frutas), a la derecha el mismo huerto CON abejas cerca (mucha más fruta y verdura), una abeja yendo de flor en flor con una flecha. Número grande: '+30–50%'. Texto: 'gratis, mientras buscan su alimento'. Verde salvia, muy clara." },
  ], { hue: "amber", accent: "accent", _dur: 9 });
  // los otros productos
  CH("está la cera, que se usa para velas", ["Miel", "Cera (velas, cosmética)", "Propóleo (antibiótico natural)", "Polen (superalimento)", "Jalea real (lo más caro por gramo)"], { title: "La miel no es lo único", image: "img/b_hive.png", hue: "amber" });
  P("la jalea real", "b_products", "honeycomb, a block of beeswax, a small jar of propolis and bee pollen arranged on a rustic table, documentary", { hue: "amber", kicker: "Cuatro productos más" });
  // requiere aprender
  PA("Requieren un traje, un ahumador", "b_suit", "vestido con un traje blanco de apicultor con velo, sosteniendo un ahumador al lado de una colmena en el patio", { hue: "amber", kicker: "Requiere aprender" });
  PROC("la inversión es baja", [
    { title: "Un traje y un ahumador", desc: "inversión baja", image: "img/b_suit.png" },
    { title: "Un núcleo y una colmena armada", desc: "y un poco de conocimiento", image: "img/b_hive.png" },
    { title: "Una revisión cada 2–3 semanas", desc: "en invierno las dejas tranquilas", image: "img/b_frame.png" },
  ], { title: "Qué necesitás para arrancar", eyebrow: "El mantenimiento es mínimo", hue: "amber", accent: "amber", _dur: 8 });
  PA("el broche final del sistema", "b_frame", "levantando con las dos manos enguantadas un cuadro de panal lleno de miel dorada operculada desde una colmena abierta", { hue: "amber", kicker: "La corona" });
  Q("la mayor paciencia y el mayor respeto", "La *corona*. El último porque pide la mayor paciencia", { image: "img/t7_abeja.png", accent: "amber", hue: "amber", fontSize: 62 });

  // ════════════════ RECAP — los 7 ════════════════
  JNY("mires lo que acabamos de recorrer", "Lo que acabamos de recorrer", "Siete animales, un sistema", [
    { x: 0.14, y: 0.28, z: 0, image: "img/t7_gallina.png", num: "1", label: "Gallina", sub: "huevos", dwell: 2.4, travel: 1.3 },
    { x: 0.40, y: 0.18, z: 0.1, image: "img/t7_conejo.png", num: "2", label: "Conejo", sub: "carne", dwell: 2.4, travel: 1.3 },
    { x: 0.66, y: 0.26, z: 0, image: "img/t7_codorniz.png", num: "3", label: "Codorniz", sub: "huevos premium", dwell: 2.4, travel: 1.3 },
    { x: 0.86, y: 0.46, z: 0.1, image: "img/t7_pato.png", num: "4", label: "Pato", sub: "huevos + plagas", dwell: 2.4, travel: 1.3 },
    { x: 0.64, y: 0.66, z: 0, image: "img/t7_cabra.png", num: "5", label: "Cabra", sub: "leche y queso", dwell: 2.4, travel: 1.3 },
    { x: 0.38, y: 0.72, z: 0.1, image: "img/t7_lombriz.png", num: "6", label: "Lombriz", sub: "fertilizante", dwell: 2.4, travel: 1.3 },
    { x: 0.16, y: 0.56, z: 0, image: "img/t7_abeja.png", num: "7", label: "Abeja", sub: "miel + poliniza", dwell: 3.0, travel: 1.3 },
  ], { accent: "good", _dur: 21 });
  HEAD("lo que tienes es lo que tenía mi abuelo", [{ t: "Junta" }, { t: "tres" }, { t: "o" }, { t: "cuatro…" }, { t: "y" }, { t: "tienes" }, { t: "lo" }, { t: "de" }, { t: "tu" }, { t: "abuelo", good: true }], { eyebrow: "Cada desecho alimenta al siguiente", hue: "amber", bg: "image", image: "img/g_soil_world.png" });
  SPL("los huevos, la carne, la leche, el queso", "Lo que sale de tu patio", ["Huevos", "Carne", "Leche y queso", "Miel", "Fertilizante"], { palette: "G" });
  Q("el azúcar, la sal y el aceite los vas a seguir comprando", "El azúcar, la sal y el aceite los seguís comprando. *El resto, no*", { eyebrow: "Tu dependencia cae a la mitad", accent: "good", hue: "amber", fontSize: 56 });

  // ════════════════ REFLEXIÓN ════════════════
  HEAD("la gente piensa que es complicado", [{ t: "Crees" }, { t: "que" }, { t: "es" }, { t: "complicado", danger: true }], { eyebrow: "Y nada de eso es verdad", hue: "red", bg: "black" });
  P("Hace cien años, cualquier casa", "rf_oldhouse", "a faded vintage archival photograph of an ordinary town house a hundred years ago with a few chickens in the back yard, sepia", { hue: "amber", arch: true, kicker: "Tenía gallinas en el fondo" });
  P("La maestra, el tendero, el carpintero", "rf_people_old", "a faded vintage group photo of ordinary townspeople a century ago — a teacher, a shopkeeper, a carpenter, sepia", { hue: "amber", arch: true, kicker: "Personas normales" });
  AGED("Esa cadena se cortó", "La cadena se cortó", [
    { text: "Cuando el súper se puso en la esquina", mark: false },
    { text: "Cuando dejamos de hablar con los viejos", mark: true },
    { text: "Cuando el progreso fue no ensuciarse las manos", mark: true },
  ], { eyebrow: "Antes se aprendía mirando al vecino", image: "img/rf_oldhouse.png", accent: "danger", hue: "red", _dur: 8 });
  HALF("comida cada vez peor", "rf_badfood", "a pale flavorless supermarket tomato and a pale egg on a plate, food that traveled thousands of kilometers, documentary", { hue: "cold", kicker: "Pagamos más por comida peor" });
  P("un camión refrigerado", "rf_truck", "a refrigerated freight truck on a highway carrying produce thousands of kilometers, documentary", { hue: "cold", kicker: "Tres mil kilómetros" });
  Q("el campo puede volver a tu casa", "No vuelvas al campo: el *campo puede volver a tu casa*", { image: "img/pr_patio.png", eyebrow: "Con poco espacio y poco dinero", accent: "good", hue: "amber", fontSize: 58 });

  // ════════════════ PAYOFF del engagement + CTA ════════════════
  P("La mayoría de la gente dice la gallina", "rf_guess", "a hand holding a notepad with a single word written, deciding, documentary, NO readable text", { hue: "amber", kicker: "¿Qué anotaste?" });
  TOP7("La respuesta correcta es la abeja", 7, "La abeja", "Por kilo y por hora, no hay nada igual", "t7_abeja", "a beekeeper's gloved hands holding a wooden hive frame covered in honeybees in a backyard apiary, documentary", { accent: "good", hue: "amber", label: "LA MÁS RENTABLE", _dur: 6 });
  Q("la lombriz le pisa los talones", "Pero la *lombriz* le pisa los talones", { image: "img/t7_lombriz.png", eyebrow: "Humus + venta de lombrices", accent: "amber", hue: "amber", fontSize: 60 });
  CH("Cuéntame de qué país", ["¿De qué país nos ves?", "¿Ya tenés alguno?", "¿Estás pensando en arrancar?"], { title: "Contame en los comentarios", image: "img/g_basket.png", hue: "amber" });

  // ════════════════ CIERRE + open loop al próximo video ════════════════
  Q("Todo lo que te conté hoy es la superficie", "Todo esto es la *superficie*. Cada animal da para un video", { eyebrow: "El manual está abajo, en la descripción", accent: "amber", hue: "amber", fontSize: 58 });
  HALF("lo puse junto en un manual", "cl_manual", "a printed homestead manual booklet on a rustic wooden table next to fresh eggs and a jar of honey, documentary, NO readable text", { hue: "amber", kicker: "El plan de 90 días" });
  IMP("hacer tu propia tierra fértil", "img/cl_soil.png", "por UN dólar", { setup: "Tierra fértil, rica, negra, viva…", impactAccent: "good", hitAt: 1.3, boom: 1, darken: 0.4, _dur: 5.5 });
  PA("un solo dólar", "cl_soil", "levantando con sus dos manos tierra negra, rica y viva sobre un cantero del huerto, a la luz dorada de la tarde, con gesto esperanzado", { hue: "amber" });
  C("revive cualquier tierra muerta en 7 días", "cl_grass", "dry dead soil transforming as green grass sprouts and grows, time lapse feel, slow motion, hopeful", { hue: "cold", frames: 90, kicker: "Pasto donde no crecía nada" });
  D("la tierra es la base de todo", "De nada sirven los animales sin la tierra", [
    { name: "cl_next", title: "La mezcla de un dólar", panel: "Una lámina teaser: una pala con tierra negra y rica en el centro, con tres etiquetas alrededor — 'revive cualquier tierra muerta en 7 días', 'pasto donde no crecía nada', 'lombrices e insectos para tus gallinas'. Un gran signo de interrogación elegante. Verde salvia y sepia, intrigante pero clara." },
  ], { hue: "amber", accent: "good", _dur: 8.5 });
  HEAD("la industria lo esconde", [{ t: "Lo" }, { t: "que" }, { t: "la" }, { t: "tierra" }, { t: "sabe," }, { t: "la" }, { t: "industria" }, { t: "lo" }, { t: "esconde", danger: true }], { eyebrow: "La tierra es la base de todo", hue: "amber", bg: "image", image: "img/cl_soil.png" });
  Q("la tierra no se olvida", "Pero la tierra *no se olvida*. Y nosotros tampoco", { image: "img/cl_soil.png", accent: "good", hue: "amber", fontSize: 80 });

  // ════════════════════════════════════════════════════════════════════════════
  // DENSIFICACIÓN — rellenos anclados en los huecos donde el avatar hablaba solo
  // (el build ordena por start; estas anclas caen entre las de arriba). Mezcla de
  // b-roll, clips de movimiento y algún componente para no pasar 55% de raw.
  // ════════════════════════════════════════════════════════════════════════════

  // ── 1 GALLINA ──
  P("necesita muy poco alimento comprado", "g_forage", "a brown hen foraging freely in a lush green backyard, finding bugs and seeds in the grass, content, documentary", { hue: "amber", kicker: "Casi nada de alimento comprado" });
  P("Mantenimiento casi nulo", "g_coop_morning", "soft morning light on a tidy small backyard chicken coop, hens stirring, an egg in the nest box, documentary", { hue: "amber", kicker: "Mantenimiento casi nulo" });

  // ── 2 CONEJO ──
  ANN("para gente con problemas cardíacos", "img/c_meat.png", [
    { kind: "circle", x: 50, y: 52, w: 34, label: "más proteína, menos grasa" },
  ], { eyebrow: "La recomiendan los médicos", caption: "Cardíacos · diabéticos · gente mayor", hue: "amber" });
  P("En un balcón amplio entra", "c_balcony", "rabbit hutches fitting neatly on a small apartment balcony, compact backyard setup, documentary", { hue: "amber", kicker: "En un balcón, en un garaje" });
  C("hojas de árboles frutales", "c_eat_leaves", "a rabbit nibbling fresh fruit tree leaves and dandelion greens held in a hand, slow motion macro", { hue: "cold", frames: 80 });
  P("directo en la tierra y funciona", "c_garden_grow", "lush vegetables growing in a dark, rich garden bed fertilized with rabbit manure, documentary", { hue: "cold", kicker: "El estiércol va directo" });
  P("Eso aplica para muchas cosas", "c_wisdom", "an old man's weathered hands resting calmly, a quiet rustic moment, documentary close up", { hue: "amber", kicker: "Una habilidad que da vergüenza aprender" });
  C("más fácil que un pollo", "c_calm", "a calm rabbit being held gently in a backyard, slow motion documentary", { hue: "amber", frames: 80 });

  // ── 3 CODORNIZ ──
  C("que tiene poco espacio", "q_flock", "several small speckled quail moving and pecking inside a compact cage, slow motion documentary", { hue: "amber", frames: 80 });
  P("en un lavadero", "q_laundry", "a small quail cage sitting in a tiny home laundry room, compact urban setup, documentary", { hue: "amber", kicker: "En un lavadero, un garaje" });
  P("Con luz artificial", "q_light", "quail cage under a warm artificial light in a closed garage at night, documentary", { hue: "amber" });
  CH("para gente que vive en ciudad", ["Departamento", "Lavadero", "Garaje cerrado", "Una habitación que no uses"], { title: "El animal perfecto para la ciudad", image: "img/q_laundry.png", hue: "amber" });
  C("El alimento de la codorniz es barato", "q_feed", "fine poultry feed crumble being poured into a quail feeder, the birds eating, slow motion macro", { hue: "amber", frames: 80 });
  CALL("tres veces más huevos", "×3", { image: "img/q_eggs_market.png", eyebrow: "Huevos, proporcionalmente", caption: "Comen menos que una gallina", accent: "good", hue: "amber" });
  P("una raza japonesa", "q_coturnix", "a close documentary portrait of a Coturnix japonica quail, brown speckled feathers, soft daylight", { hue: "amber", kicker: "Coturnix Japonica" });
  ANN("el animal más eficiente por metro cuadrado", "img/q_cage.png", [
    { kind: "circle", x: 50, y: 50, w: 36, label: "más huevos por m² que nada" },
  ], { eyebrow: "Más que la gallina. Mucho más", hue: "amber" });

  // ── 4 PATO ──
  P("no es solo el huevo", "p_eggs_basket", "a basket of large pale duck eggs on a rustic wooden table, documentary", { hue: "amber", kicker: "Pero la gracia no es solo el huevo" });
  P("además te pone huevos", "p_eggs_nest", "duck eggs in a simple straw nest in a backyard, documentary", { hue: "cold", kicker: "Un pesticida con patas" });
  C("regar las plantas", "p_water_plants", "nutrient-rich greenish duck water being poured from a bucket onto thriving garden plants, slow motion", { hue: "cold", frames: 80, kicker: "El agua sucia riega el huerto" });

  // ── 5 CABRA ──
  P("demasiado grande o demasiado complicado", "k_doubt", "a person looking unsure at a large goat, misconception, documentary", { hue: "cold", kicker: "La gente piensa que es complicado" });
  P("la cabra nigeriana", "k_nigerian", "a close documentary portrait of a small Nigerian dwarf goat in a backyard pen, friendly, soft daylight", { hue: "amber" });
  P("no tolera la leche de vaca", "k_milk_glass", "a glass of fresh goat milk on a rustic kitchen table, soft natural light, documentary", { hue: "amber", kicker: "Más digestiva que la de vaca" });
  C("un queso fresco de 200 gramos", "k_cheese_make", "hands shaping and pressing fresh white goat cheese in a rustic kitchen, slow motion documentary", { hue: "amber", frames: 80 });
  P("cuatro metros cuadrados con un techito", "k_corral", "a small simple goat pen of about four square meters with a little wooden roof in a backyard, documentary", { hue: "amber", kicker: "Menos que un cajón de estacionamiento" });
  Q("se encariña con la familia como un perro", "Sociable, cariñosa, inteligente — *como un perro*", { image: "img/k_kids.png", eyebrow: "Los niños la adoran", accent: "good", hue: "amber", fontSize: 56 });

  // ── 6 LOMBRIZ ──
  HALF("Si arrancas con mil lombrices", "l_bin_full", "a wooden worm bin teeming with red California earthworms in dark moist soil, macro documentary", { hue: "amber", kicker: "Mil → cuatro mil → dieciséis mil" });
  C("se duplica cada tres meses", "l_worms_move", "red California earthworms moving and writhing in rich dark soil, macro slow motion", { hue: "cold", frames: 80 });
  P("no necesita silencio", "l_corner", "a small worm bin tucked in a dark damp corner under a kitchen sink, documentary", { hue: "amber", kicker: "Sin sol, sin ruido, sin olor" });
  C("humus para tu huerto", "l_humus_garden", "dark worm humus being spread over a thriving green garden bed, slow motion documentary", { hue: "cold", frames: 80 });
  P("lombrices de sobra para vender", "l_jar", "a jar full of red worms ready to sell for fishing and composting, documentary macro", { hue: "cold", kicker: "Para pesca, para compostaje" });
  P("Los animales producen estiércol", "l_manure_bin", "animal manure and kitchen scraps being added on top of a worm composting bin, documentary", { hue: "amber" });
  P("del otro lado volvían al primero", "ab_circle_old", "a faded vintage photo of a self-sufficient old country homestead where nothing is wasted, sepia", { hue: "amber", arch: true, kicker: "Nada se tira, nada se compra" });
  Q("Nadie le pagaba a nadie de afuera", "Nadie le pagaba a nadie de afuera, porque *no hacía falta*", { eyebrow: "Economía circular sin nombre", accent: "good", hue: "amber", fontSize: 58 });

  // ── 7 ABEJA ──
  C("al principio da respeto", "b_swarm", "honeybees crawling densely over the frames of an open hive, slightly intimidating, slow motion macro", { hue: "amber", frames: 80 });
  P("vale más por kilo", "b_honey_gold", "rows of glowing golden honey jars on a rustic table, premium product, warm light, documentary", { hue: "amber", kicker: "Más por kilo que todo lo demás" });
  C("Más fruta, más verdura", "b_orchard", "fruit trees heavy with ripe fruit in a backyard orchard, abundant, slow motion documentary", { hue: "amber", frames: 80 });
  P("Porque la abeja lo hace", "b_garden_lush", "a lush, highly productive backyard vegetable garden with bees visiting flowers, documentary", { hue: "amber", kicker: "+30 a 50% de producción" });
  P("un antibiótico natural", "b_propolis", "a small jar of dark bee propolis on a natural products shelf, documentary, NO readable text", { hue: "amber", kicker: "Propóleo" });
  P("el polen, que es un superalimento", "b_pollen", "colorful bee pollen granules in a small wooden bowl, macro documentary", { hue: "amber", kicker: "Polen: superalimento" });
  C("Una revisión cada dos o tres semanas", "b_inspect", "a beekeeper in a white suit lifting and inspecting a honeycomb frame from a hive in spring, slow motion", { hue: "amber", frames: 80 });
  P("en invierno prácticamente las dejas", "b_winter_hive", "a quiet beehive in a frosty winter backyard, dormant, soft cold light, documentary", { hue: "cold", kicker: "En invierno, tranquilas" });

  // ── RECAP / REFLEXIÓN / CIERRE ──
  P("Si juntas tres o cuatro", "recap_yard", "a backyard with hens, a rabbit hutch, a small goat and a beehive together, a complete home system, documentary", { hue: "amber", kicker: "Lo que tenía tu abuelo" });
  BARS("tu dependencia del supermercado cae a la mitad", [
    { label: "Hoy: del supermercado", value: 100, display: "todo", tone: "danger" },
    { label: "Con tu patio", value: 45, display: "la mitad o menos", winner: true, tone: "good" },
  ], { title: "Tu dependencia del súper", eyebrow: "Azúcar, sal y aceite los seguís comprando", orientation: "horizontal", hue: "cold" });
  P("tu pedazo de tierra que hoy no usas", "rf_empty", "an empty unused backyard corner with bare soil and weeds, full of unrealized potential, documentary", { hue: "cold", kicker: "Hoy, vacío" });
  P("Lo aprendías mirando al vecino", "rf_neighbor_old", "a faded vintage photo of neighbors chatting over a backyard fence with chickens, knowledge passed along, sepia", { hue: "amber", arch: true, kicker: "De boca en boca" });
  P("Tu madre te enseñaba", "rf_teach_old", "a faded vintage photo of an old woman teaching a child to feed hens in a backyard, sepia nostalgic", { hue: "amber", arch: true });
  P("la televisión te mostró", "rf_tv", "a faded vintage photo of a family watching an old TV showing idealized modern urban life, sepia", { hue: "cold", arch: true, kicker: "La buena vida era urbana" });
  P("la comida empaquetada", "rf_packaged", "shelves of brightly packaged processed supermarket food, sterile and uniform, documentary, NO readable text", { hue: "cold", kicker: "La comida empaquetada" });
  P("cuando eras niño", "rf_child_food", "a faded vintage photo of a child happily eating fresh food from the family garden, warm nostalgic, sepia", { hue: "amber", arch: true });
  CHK("las tablas de alimentación", "Lo que viene en el manual", [
    { text: "Los números exactos de cada animal", state: "done" },
    { text: "Tablas de alimentación", state: "done" },
    { text: "El plan de 90 días paso a paso", state: "done" },
    { text: "Armado del espacio", state: "done" },
  ], { eyebrow: "El link está abajo, en la descripción", hue: "amber", image: "img/cl_manual.png" });
  HEAD("lo que mata la rentabilidad", [{ t: "El" }, { t: "alimento" }, { t: "comprado" }, { t: "mata", danger: true }, { t: "la" }, { t: "rentabilidad" }], { eyebrow: "Todos estos animales necesitan comer", hue: "red", bg: "image", image: "img/g_feedbag.png" });
  C("rascan el suelo", "cl_hen_find", "a hen scratching rich dark fertile soil and finding worms and insects, slow motion documentary", { hue: "cold", frames: 80, kicker: "Lombrices e insectos al rascar" });
  P("alfalfa y diente de león", "cl_alfalfa", "fresh alfalfa and dandelion growing abundantly from rich soil in a backyard, documentary macro", { hue: "cold", kicker: "Sin comprar una sola semilla" });

  // ════════════════════════════════════════════════════════════════════════════
  // MÁS TOMAS DE ÉL (PA) — identidad de canal: alternar objeto ↔ él haciéndolo.
  // gpt-image-2 con su cara (diferidas/generadas con gen_images_ref). El Main oculta
  // el PiP del avatar en estos beats (SELF_KEYS) para no mostrarlo dos veces.
  // ════════════════════════════════════════════════════════════════════════════
  PA("un metro cuadrado de gallinero", "g_him_coop", "abriendo la puerta de madera de su gallinero y mirando a sus gallinas adentro, en el patio", { hue: "amber", kicker: "Su gallinero" });
  PA("menos que un armario grande", "c_him_hold", "sosteniendo un conejo tranquilo en sus brazos, junto a las jaulas de cría en el patio", { hue: "amber", kicker: "Su plantel de conejos" });
  PA("diez codornices te dan diez huevos", "q_him_egg", "recogiendo con cuidado huevitos de codorniz moteados de la bandeja de la jaula", { hue: "amber", kicker: "Diez huevos por día" });
  PA("Los sueltas en el huerto", "p_him_garden", "parado en su huerto, observando a dos patos comer plagas entre las plantas", { hue: "cold", kicker: "Sus patos en el huerto" });
  PA("Una cabra enana nigeriana produce", "k_him_milk", "ordeñando a mano a su cabra enana nigeriana en el corral, balde de metal abajo", { hue: "amber", kicker: "Ordeñando la cabra" });
  PA("mil lombrices. Eso es todo", "l_him_bin", "con las dos manos en su lombricero de madera, revisando la tierra oscura llena de lombrices", { hue: "amber", kicker: "Su lombricero" });
  PA("Un kilo de miel pura", "b_him_honey", "envasando miel dorada en frascos de vidrio sobre una mesa rústica de su taller", { hue: "amber", kicker: "Su miel" });
  PA("en el fondo de tu casa", "recap_him", "parado orgulloso en su patio, con el gallinero, las jaulas de conejos y la colmena detrás, sistema completo", { hue: "amber", kicker: "El sistema completo" });

  // ── RELLENO de huecos >8s (#3 polish) ──
  C("minimizan el trabajo", "q_stack", "a tall efficient stacked quail breeding rack with many cages, slow motion documentary", { hue: "amber", frames: 80, kicker: "Máxima producción, mínimo trabajo" });
  P("se multiplica sola", "recap_table", "a rustic wooden table laid with fresh eggs, meat, a wheel of cheese, a jar of honey and dark worm humus, everything from the backyard, documentary", { hue: "amber", kicker: "Todo sale de tu patio" });
  P("no ensuciarse las manos", "rf_hands", "close up of an older man's weathered hands working dark garden soil, honest labor, documentary", { hue: "cold", kicker: "Ensuciarse las manos" });
  P("esos videos van a venir", "cl_series", "a rustic chalkboard with simple chalk drawings of a hen, rabbit, quail, duck, goat, worm and bee in a row, documentary, NO readable text", { hue: "amber", kicker: "Un video por cada animal" });
  C("Todos estos animales necesitan comer", "cl_feedall", "feeding time in a backyard, hens rabbits and a goat eating greens and kitchen scraps, slow motion montage", { hue: "amber", frames: 90, kicker: "Todos necesitan comer" });
}
