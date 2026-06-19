// build_replantar.mjs — LeviLappJardín (ES) · "15 verduras del súper que puedes replantar".
// CLIPS-FIRST híbrido modo AVATAR: clips reales matcheados + imágenes deAPI de relleno.
// Hook 0-72s HIPERDINÁMICO (~1.5s/clip) · cuerpo Amish calmo (~6s, tomas clave sostenidas).
// Avatar full en intro personal + cierre. Anclado al transcript por frases (captions).
//
// Modo:  node build_replantar.mjs match  → public/broll/match_replantar.json
//        node build_replantar.mjs        → beatsheet/replantar.json + avatar_replantar.gen.ts
import fs from "fs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1334.94;
const SLUG = "replantar", AVATAR = "replantar_opt.mp4";
const OPEN = 2.0; // avatar abre full
const IMG_STYLE = ", realistic color photograph, natural soft daylight, sharp focus, shallow depth of field, rustic kitchen or garden, no text, no captions, no watermark, no logo";

// ── anclaje por captions ──
const caps = JSON.parse(fs.readFileSync("public/captions_replantar.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const W = caps.map((c) => ({ n: norm(c.text), ms: c.startMs }));
function at(phrase) {
  const t = norm(phrase).split(" ");
  for (let i = 0; i <= W.length - t.length; i++) {
    let ok = 1; for (let j = 0; j < t.length; j++) if (W[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return W[i].ms / 1000;
  }
  throw new Error("ANCHOR NOT FOUND: " + phrase);
}

// ── secciones (start de cada una; end = start de la próxima) ──
const SECT = [
  ["hook1", at("para cuando termines")],
  ["hook2", at("quedate conmigo hasta el final")],
  ["levi", at("me llamo levi")],                 // AV_FULL
  ["truth", at("pero antes dejame contarte")],
  ["i1", at("empecemos por el numero uno")],
  ["i2", at("el numero dos es la lechuga")],
  ["i3", at("el numero tres es el apio")],
  ["i4", at("el numero cuatro es el bok choy")],
  ["i5", at("el numero cinco es el puerro")],
  ["i6", at("el numero seis es la albahaca")],
  ["i7", at("el numero siete es la menta")],
  ["err", at("contarte el error")],
  ["i8", at("el numero ocho es el cilantro")],
  ["i9", at("el numero nueve es el ajo")],
  ["i10", at("el numero diez es el jengibre")],
  ["i11", at("llegamos al numero once")],
  ["i12", at("el numero doce es la prima dulce")],
  ["i13", at("el numero trece es la zanahoria")],
  ["i14", at("el numero catorce es el tomate")],
  ["i15", at("llegamos al numero 15")],
  ["i16", at("aqui esta tu regalo")],
  ["close", at("asi que hagamos la cuenta")],
  ["action", at("esto es lo que quiero que hagas hoy")],
  ["cta", at("suscribete al canal")],            // AV_FULL → cierre
];
const SECSTART = Object.fromEntries(SECT.map(([k, s]) => [k, s]));
const secEnd = (k) => { const i = SECT.findIndex((x) => x[0] === k); return i + 1 < SECT.length ? SECT[i + 1][1] : TOTAL; };

// ── avatar a PANTALLA COMPLETA (apertura + intro personal + cierre/CTA) ──
const AV_FULL = [
  [0, OPEN],
  [SECSTART.levi, SECSTART.truth],   // "Me llamo Levi... casi un pecado"
  [SECSTART.cta, TOTAL],             // suscríbete + próximo video + firma
];

// ── SHOTS por sección: [name, query(string|array), concepto] ──
// queries EN, visuales, ancladas al tema, anti-texto. concepto = qué se ve (ES).
const S = {
  // ░░ HOOK 1 (0-72s) — "tiras comida viva / está viva / vuelve a crecer gratis" — DENSO ~1.5s ░░
  hook1: [
    ["rpl_trash_scraps", ["vegetable scraps and peels dropped into a kitchen trash bin"], "restos de verdura a la basura"],
    ["rpl_bin_scraps", ["kitchen compost bin full of vegetable scraps"], "el cubo lleno de restos"],
    ["rpl_lettuce_stump", ["cut romaine lettuce base stump on a wooden cutting board"], "el tallo de la lechuga cortado"],
    ["rpl_onion_roots", ["white root end of green onions with dangling roots close up"], "la base de la cebolla con raíces"],
    ["rpl_garlic_sprout", ["garlic clove with a green sprout shooting out macro"], "un diente de ajo brotado"],
    ["rpl_pineapple_crown", ["twisting the leafy green crown off a pineapple"], "la corona de la piña"],
    ["rpl_grocery_pay", ["paying for vegetables at a supermarket checkout counter"], "pagando en el súper"],
    ["rpl_toss_slow", ["vegetable peelings falling in slow motion against dark background"], "restos cayendo en cámara lenta"],
    ["rpl_scallion_water", ["green onions regrowing in a glass of water on a sunny windowsill"], "cebolla rebrotando en agua"],
    ["rpl_roots_timelapse", ["time lapse of white roots growing from a vegetable cutting in water"], "raíces creciendo (timelapse)"],
    ["rpl_sprout_macro", ["macro of a tiny green sprout emerging from a seed"], "un brote diminuto asomando"],
    ["rpl_jars_window", ["row of jars with vegetable cuttings sprouting on a windowsill"], "frascos rebrotando en la ventana"],
    ["rpl_hand_plant", ["hands pressing a sprouted vegetable scrap into dark soil"], "plantando un resto en la tierra"],
    ["rpl_coins_palm", ["a few small coins in an open palm close up"], "unas pocas monedas (gratis)"],
    ["rpl_harvest_basket", ["hands holding a wicker basket full of fresh homegrown vegetables"], "una canasta de cosecha propia"],
    ["rpl_celery_regrow", ["celery base regrowing green leaves from the center in water"], "el apio rebrotando del centro"],
    ["rpl_potato_eyes", ["sprouting potato with growing eyes in a dim pantry"], "una papa brotada en la despensa"],
    ["rpl_ginger_buds", ["knob of fresh ginger root showing growth buds macro"], "un trozo de jengibre con yemas"],
    ["rpl_basil_roots", ["basil stem cuttings growing white roots in a glass of water"], "esquejes de albahaca echando raíces"],
    ["rpl_carrot_tops", ["carrot tops sprouting feathery green leaves in a shallow dish of water"], "las hojas de zanahoria rebrotando"],
    ["rpl_fridge_wilt", ["wilted vegetables forgotten in a refrigerator drawer"], "verduras olvidadas en la heladera"],
    ["rpl_market_stall", ["person picking vegetables at a busy farmers market stall"], "comprando en el mercado"],
    ["rpl_compost_toss", ["tossing kitchen scraps onto a backyard compost pile"], "restos al montón de compost"],
    ["rpl_seedling_soil", ["a green seedling emerging from dark soil macro"], "un brote saliendo de la tierra"],
    ["rpl_lettuce_regrow", ["lettuce regrowing tender new leaves from its base in a bowl of water"], "la lechuga rebrotando hojas nuevas"],
    ["rpl_roots_underwater", ["white roots growing underwater from a plant cutting close up"], "raíces blancas bajo el agua"],
    ["rpl_counter_scraps", ["pile of fresh vegetable scraps on a rustic kitchen counter"], "restos sobre la mesada"],
    ["rpl_cash_grocery", ["hand holding cash bills at a grocery store"], "el dinero del supermercado"],
    ["rpl_potted_thrive", ["a thriving leafy green vegetable plant in a pot by a window"], "una planta sana junto a la ventana"],
    ["rpl_hands_soil", ["weathered hands working crumbly dark garden soil"], "manos curtidas en la tierra"],
    ["rpl_scallion_cut", ["snipping green onion shoots with scissors over a glass"], "cortando los brotes con tijera"],
    ["rpl_sprout_row", ["row of vegetable scraps sprouting roots lined up on a sill"], "una fila de restos rebrotando"],
    ["rpl_pineapple_plant", ["a rooted pineapple crown growing as a potted plant"], "la corona de piña ya como planta"],
    ["rpl_garden_abundance", ["lush abundant backyard vegetable garden in summer"], "una huerta abundante"],
    ["rpl_water_glass_sun", ["a simple glass of water with a green cutting backlit by the sun"], "un vaso de agua a contraluz"],
    ["rpl_handful_harvest", ["hands full of freshly picked leafy greens and herbs"], "un puñado de verdura recién cortada"],
  ],
  // ░░ HOOK 2 (72-121s) — los 3 loops + teaser #11 + bonus #16 — medio ~2.5s ░░
  hook2: [
    ["rpl_potato_dig", ["hands digging up a cluster of potatoes from the soil"], "desenterrando un montón de papas"],
    ["rpl_potato_pile", ["a pile of freshly harvested potatoes in a basket"], "una bolsa llena de papas"],
    ["rpl_wilt_water", ["a yellowing plant cutting wilting in cloudy stagnant water"], "un esqueje amarillo en agua turbia"],
    ["rpl_roots_clear", ["healthy white roots in a glass of clean clear water"], "raíces sanas en agua limpia"],
    ["rpl_transplant_soil", ["transplanting a rooted cutting from water into a pot of soil"], "pasando el esqueje del agua a la tierra"],
    ["rpl_pepper_seeds", ["cutting open a red bell pepper revealing seeds inside"], "un pimiento abierto, lleno de semillas"],
    ["rpl_pepper_seedlings", ["tray of pepper seedlings sprouting in soil"], "plantines de pimiento brotando"],
    ["rpl_window_lineup", ["windowsill lined with regrowing vegetable cuttings in jars"], "la ventana llena de frascos"],
    ["rpl_clock_calendar", ["calendar pages turning days passing time lapse"], "los días pasando"],
    ["rpl_satisfied_garden", ["a person smiling holding a basket of homegrown produce"], "alguien feliz con su cosecha"],
  ],
  // ░░ LA VERDAD (159-217s) — "la planta no sabe / no necesitas nada caro / vaso, tierra, ventana" ░░
  truth: [
    ["rpl_cutting_roots", ["a vegetable cutting growing roots in a jar of water close up"], "un esqueje echando raíces"],
    ["rpl_root_tip_macro", ["macro of a living white root tip growing"], "la punta de una raíz viva"],
    ["rpl_seed_rack", ["expensive seed packets displayed on a garden store rack"], "sobres de semillas caros en la tienda"],
    ["rpl_grow_lights", ["purple artificial grow lights over indoor plants"], "luces de cultivo artificiales"],
    ["rpl_greenhouse", ["interior of a glass greenhouse full of plants"], "un invernadero"],
    ["rpl_glass_sill", ["a plain glass of water with a cutting on a kitchen windowsill"], "un simple vaso en la ventana"],
    ["rpl_soil_hands", ["a handful of rich dark soil held in two hands"], "un puñado de tierra"],
    ["rpl_sun_window", ["warm sunlight streaming through a kitchen window onto plants"], "el sol entrando por la ventana"],
    ["rpl_scraps_ready", ["various vegetable scraps lined up ready to be regrown"], "restos listos para rebrotar"],
  ],
  // ░░ #1 CEBOLLA DE VERDEO (217-272) ~55s ░░
  i1: [
    ["rpl_o1_roots", ["white root base of green onions held in fingers macro"], "la base blanca con raíces"],
    ["rpl_o1_glass", ["placing green onion roots into a glass with an inch of water"], "metiendo las raíces en un vaso"],
    ["rpl_o1_window", ["glass of green onions regrowing on a sunny kitchen windowsill"], "el vaso en la ventana"],
    ["rpl_o1_shoots", ["time lapse of green onion shoots growing taller from cut stalks"], "los brotes verdes creciendo"],
    ["rpl_o1_change", ["changing the water in a glass of regrowing green onions"], "cambiando el agua"],
    ["rpl_o1_snip", ["snipping fresh green onion tops with scissors"], "cortando lo que necesitás"],
    ["rpl_o1_bunch", ["a fresh bunch of green onions on a wooden board"], "un manojo fresco de cebolla de verdeo"],
    ["rpl_o1_cook", ["chopped green onions sprinkled over a dish"], "cebolla fresca sobre la comida"],
  ],
  // ░░ #2 LECHUGA (272-358) ~86s ░░
  i2: [
    ["rpl_o2_core", ["the cut core base of a romaine lettuce on a board"], "el corazón de la lechuga"],
    ["rpl_o2_dish", ["lettuce base in a shallow dish with an inch of water cut side up"], "la base en un plato con agua"],
    ["rpl_o2_window", ["lettuce base regrowing on a bright windowsill"], "en la ventana con luz"],
    ["rpl_o2_leaves", ["tender new lettuce leaves sprouting from the center of a stump"], "hojas tiernas del centro"],
    ["rpl_o2_timelapse", ["time lapse of lettuce regrowing leaves from its base"], "la lechuga rebrotando (timelapse)"],
    ["rpl_o2_salad", ["fresh green salad leaves in a bowl"], "hojas frescas para ensalada"],
    ["rpl_o2_supermarket", ["heads of romaine lettuce on a supermarket shelf"], "lechugas en el súper"],
    ["rpl_o2_roots", ["small roots forming under a lettuce base in water"], "raicitas formándose abajo"],
    ["rpl_o2_pot", ["transplanting a regrown lettuce base into a pot of soil"], "pasándola a una maceta"],
    ["rpl_o2_honest", ["comparing a small regrown lettuce to a full store head"], "comparando con la del súper (honesto)"],
  ],
  // ░░ #3 APIO (358-402) ~44s ░░
  i3: [
    ["rpl_o3_base", ["the cut bottom base of a celery bunch on a board"], "la base del apio"],
    ["rpl_o3_water", ["celery base in a glass with water cut side up"], "la base en agua"],
    ["rpl_o3_center", ["yellow green celery leaves sprouting from the center base"], "brotes del centro"],
    ["rpl_o3_roots", ["roots forming at the bottom of a celery base in water"], "raíces naciendo por debajo"],
    ["rpl_o3_soil", ["transplanting a sprouting celery base into garden soil"], "pasándolo a la tierra"],
    ["rpl_o3_shelf", ["celery stalks growing in a kitchen herb shelf in jars"], "apio en la repisa de la cocina"],
  ],
  // ░░ #4 BOK CHOY (402-427) ~25s ░░
  i4: [
    ["rpl_o4_base", ["the cut base of a bok choy cabbage on a board"], "la base del bok choy"],
    ["rpl_o4_water", ["bok choy base regrowing a green heart in a dish of water"], "el cogollo rebrotando en agua"],
    ["rpl_o4_grow", ["time lapse of bok choy regrowing from its base"], "rebrotando rápido (timelapse)"],
    ["rpl_o4_soil", ["transplanting a regrown bok choy into soil"], "a la tierra cuando tiene raíces"],
  ],
  // ░░ #5 PUERRO (427-493) ~66s ░░
  i5: [
    ["rpl_o5_roots", ["the white rooted end of a leek held in hand"], "la parte blanca con raíces"],
    ["rpl_o5_glass", ["leek base regrowing upward in a glass of water"], "el puerro creciendo en agua"],
    ["rpl_o5_window", ["leeks regrowing in a jar on a windowsill"], "en la ventana de la cocina"],
    ["rpl_o5_grow", ["time lapse of a leek growing back from its base"], "rebrotando hacia arriba"],
    ["rpl_o5_cut", ["cutting the green top of a regrown leek for cooking"], "cortando para la sopa"],
    ["rpl_o5_soup", ["leeks and vegetables in a rustic soup pot"], "puerro en un guiso"],
    ["rpl_o5_renew", ["a jar of leeks regrowing endlessly on a sill"], "comida que se renueva sola"],
  ],
  // ░░ #6 ALBAHACA (493-533) ~39s · pivote hierbas ░░
  i6: [
    ["rpl_o6_bunch", ["an expensive small bunch of fresh basil on a counter"], "un manojo carísimo de albahaca"],
    ["rpl_o6_cutting", ["cutting a basil stem and removing lower leaves"], "cortando un tallo y sacando hojas de abajo"],
    ["rpl_o6_glass", ["a basil cutting in a glass of water on a windowsill"], "el tallo en un vaso de agua"],
    ["rpl_o6_roots", ["white roots growing from a basil stem in water macro"], "raíces blancas del tallo"],
    ["rpl_o6_pot", ["transplanting a rooted basil cutting into a pot of soil"], "pasándola a la maceta"],
    ["rpl_o6_plants", ["several healthy basil plants growing on a sunny windowsill"], "varias plantas de albahaca"],
  ],
  // ░░ #7 MENTA (533-578) ~45s ░░
  i7: [
    ["rpl_o7_sprig", ["a fresh sprig of mint held in hand"], "una ramita de menta"],
    ["rpl_o7_cutting", ["mint cuttings with lower leaves removed in a glass of water"], "esquejes de menta en agua"],
    ["rpl_o7_roots", ["mint cutting rooting quickly in water close up"], "menta enraizando rápido"],
    ["rpl_o7_pot", ["a vigorous mint plant growing in its own pot"], "menta en su propia maceta"],
    ["rpl_o7_spread", ["mint spreading aggressively across a garden bed"], "la menta apoderándose del cantero"],
    ["rpl_o7_tea", ["fresh mint leaves in a cup of tea"], "hojas de menta frescas"],
  ],
  // ░░ EL ERROR (578-658) ~80s — el error que mata la mitad ░░
  err: [
    ["rpl_e_wilt", ["a pale wilting plant cutting dying in a glass of old water"], "un esqueje muriéndose en el vaso"],
    ["rpl_e_murky", ["cloudy murky stagnant water in a glass with a cutting"], "agua estancada y turbia"],
    ["rpl_e_rotroots", ["slimy rotting roots on a cutting in dirty water macro"], "raíces podridas en agua sucia"],
    ["rpl_e_change", ["pouring out old water and refilling a glass with a cutting fresh"], "cambiando el agua cada dos días"],
    ["rpl_e_clear", ["bright healthy white roots in clean clear water"], "raíces sanas en agua limpia"],
    ["rpl_e_transplant", ["hands transplanting a rooted cutting into rich soil"], "pasando a la tierra al ver raíces"],
    ["rpl_e_soil_feed", ["a healthy thriving plant established in dark fertile soil"], "la tierra que la alimenta"],
    ["rpl_e_compare", ["a thriving potted plant next to a wilted one in water"], "la sana vs la del vaso eterno"],
  ],
  // ░░ #8 CILANTRO (666-716) ~50s ░░
  i8: [
    ["rpl_o8_stems", ["cilantro stems with a bit of root in a glass of water"], "tallos de cilantro con raíz en agua"],
    ["rpl_o8_regrow", ["cilantro regrowing fresh leaves in water on a sill"], "rebrotando hojas frescas"],
    ["rpl_o8_flower", ["cilantro plant flowering with small white flowers bolting"], "cilantro florecido"],
    ["rpl_o8_seeds", ["round coriander seeds on a dried cilantro plant macro"], "las bolitas: semilla de cilantro"],
    ["rpl_o8_plant_seeds", ["planting coriander seeds in soil by hand"], "sembrando las semillas"],
    ["rpl_o8_fresh", ["a lush pot of fresh cilantro growing"], "cilantro fresco sin fin"],
  ],
  // ░░ #9 AJO (716-762) ~46s ░░
  i9: [
    ["rpl_o9_sprout", ["a garlic clove with a long green sprout found in a drawer"], "un diente brotado en el cajón"],
    ["rpl_o9_plant", ["planting a sprouted garlic clove pointed end up in soil"], "plantando el diente, brote arriba"],
    ["rpl_o9_greens", ["green garlic shoots growing in a pot of soil"], "brotes de ajo tiernos"],
    ["rpl_o9_cook", ["chopped green garlic shoots in an omelette"], "ajetes en una tortilla"],
    ["rpl_o9_bulb", ["a full head of garlic split into many cloves"], "una cabeza entera de ajo"],
    ["rpl_o9_field", ["garlic plants growing in rows in a garden"], "ajo creciendo en la huerta"],
  ],
  // ░░ #10 JENGIBRE (762-821) ~59s ░░
  i10: [
    ["rpl_o10_buds", ["macro of a ginger root showing small growth bud nodes"], "las yemas del jengibre"],
    ["rpl_o10_cut", ["cutting a piece of ginger with a visible bud"], "cortando un trozo con yema"],
    ["rpl_o10_dry", ["a cut piece of ginger drying on a wooden surface"], "dejándolo secar un día"],
    ["rpl_o10_plant", ["planting a ginger piece shallow in well draining soil bud up"], "enterrándolo poco profundo"],
    ["rpl_o10_sprout", ["a green ginger shoot emerging from soil in a pot"], "el brote de jengibre asomando"],
    ["rpl_o10_harvest", ["harvesting fresh ginger rhizomes from a pot of soil"], "cosechando jengibre fresco"],
    ["rpl_o10_turmeric", ["fresh orange turmeric root rhizomes close up"], "la cúrcuma, lo mismo"],
  ],
  // ░░ #11 PAPA (821-898) ~76s — el favorito ░░
  i11: [
    ["rpl_o11_wrinkle", ["a wrinkled sprouting potato with pale shoots in a pantry"], "una papa arrugada y brotada"],
    ["rpl_o11_eyes", ["close up of the eyes and sprouts on a seed potato"], "los ojos de la papa"],
    ["rpl_o11_cut", ["cutting a sprouting potato into pieces each with an eye"], "cortándola en trozos con ojos"],
    ["rpl_o11_dry", ["cut potato pieces drying on a tray"], "dejando secar los cortes"],
    ["rpl_o11_plant", ["planting potato pieces in a trench of dark soil"], "enterrándolos a un palmo"],
    ["rpl_o11_grow", ["healthy green potato plants growing in a garden row"], "la planta de papa creciendo"],
    ["rpl_o11_dig", ["hands digging up many fresh potatoes from the earth"], "desenterrando muchas papas"],
    ["rpl_o11_bounty", ["a big pile of freshly harvested potatoes from one plant"], "una cosecha de una sola papa"],
  ],
  // ░░ #12 BATATA (898-959) ~62s ░░
  i12: [
    ["rpl_o12_sweet", ["a whole sweet potato on a kitchen counter"], "una batata"],
    ["rpl_o12_toothpicks", ["a sweet potato suspended by toothpicks over a glass of water"], "suspendida con palillos sobre un vaso"],
    ["rpl_o12_slips", ["leafy slips sprouting from the top of a sweet potato in water"], "los esquejes brotando arriba"],
    ["rpl_o12_pull", ["pulling a rooted slip off a sweet potato"], "arrancando un esqueje con cuidado"],
    ["rpl_o12_root", ["sweet potato slips rooting in a glass of water"], "enraizando los esquejes en agua"],
    ["rpl_o12_plant", ["planting sweet potato slips into garden soil"], "plantándolos en la tierra"],
  ],
  // ░░ #13 ZANAHORIA (959-1035) ~75s — honesto ░░
  i13: [
    ["rpl_o13_tops", ["cutting the leafy tops off a bunch of carrots"], "cortando los sombreritos de la zanahoria"],
    ["rpl_o13_water", ["carrot tops placed cut side down in a dish of water"], "los tops en un dedo de agua"],
    ["rpl_o13_regrow", ["carrot tops regrowing feathery green foliage in water"], "rebrotando un penacho de hojas"],
    ["rpl_o13_greens", ["chopped carrot greens added to a soup"], "hojas de zanahoria en la sopa"],
    ["rpl_o13_plant", ["planting a carrot top in garden soil"], "plantando el sombrerito en tierra"],
    ["rpl_o13_flower", ["white umbel flowers of a carrot plant gone to seed"], "flores y semillas al año"],
    ["rpl_o13_seeds", ["tiny carrot seeds collected in a hand"], "semillas para sembrar de verdad"],
  ],
  // ░░ #14 TOMATE (1035-1095) ~60s ░░
  i14: [
    ["rpl_o14_ripe", ["a ripe red tomato on a kitchen counter"], "un tomate maduro y jugoso"],
    ["rpl_o14_slice", ["slicing a ripe tomato into thin rounds full of seeds"], "rodajas finas con semillas"],
    ["rpl_o14_lay", ["laying tomato slices on top of moist soil in a pot"], "apoyando las rodajas sobre la tierra"],
    ["rpl_o14_cover", ["covering tomato slices with a thin layer of soil"], "cubriendo con un dedo de tierra"],
    ["rpl_o14_sprout", ["a row of tiny tomato seedlings sprouting in a pot"], "una fila de plantitas de tomate"],
    ["rpl_o14_seedlings", ["dozens of tomato seedlings growing in a tray"], "decenas de plantas de un tomate"],
    ["rpl_o14_sun", ["ripe tomatoes ripening on the vine in the sun"], "tomate madurado al sol"],
  ],
  // ░░ #15 PIÑA (1095-1173) ~79s — divertido ░░
  i15: [
    ["rpl_o15_crown", ["the green leafy crown of a pineapple about to be twisted off"], "la corona de la piña"],
    ["rpl_o15_twist", ["twisting the crown off a pineapple with both hands"], "arrancándola con un giro"],
    ["rpl_o15_strip", ["stripping the lower leaves off a pineapple crown to reveal root bumps"], "sacando hojas hasta ver las raíces dormidas"],
    ["rpl_o15_dry", ["a pineapple crown drying on a counter"], "dejándola secar un par de días"],
    ["rpl_o15_water", ["a pineapple crown rooting in a glass of water"], "la corona enraizando en agua"],
    ["rpl_o15_pot", ["a young pineapple plant growing in a pot of soil"], "la corona ya como planta de piña"],
    ["rpl_o15_grow", ["a mature pineapple plant with a fruit forming in the center"], "una planta de piña de verdad"],
  ],
  // ░░ #16 PIMIENTO bonus (1173-1223) ~49s ░░
  i16: [
    ["rpl_o16_cut", ["cutting open a fresh bell pepper showing the seeds inside"], "abriendo un pimiento, las semillas"],
    ["rpl_o16_seeds", ["scooping out pepper seeds onto a paper towel to dry"], "secando las semillas un día"],
    ["rpl_o16_plant", ["pressing pepper seeds into a pot of soil"], "sembrándolas en una maceta"],
    ["rpl_o16_sprout", ["pepper seedlings germinating in soil"], "germinando fácil"],
    ["rpl_o16_plant_grown", ["a healthy pepper plant with fruits in a sunny spot"], "una planta con pimientos frescos"],
  ],
  // ░░ CIERRE — la cuenta (1223-1262) ~39s ░░
  close: [
    ["rpl_c_sill_full", ["a windowsill completely full of jars with regrowing vegetables"], "el alféizar lleno de brotes"],
    ["rpl_c_store_one", ["a single vegetable being scanned at a supermarket checkout"], "la tienda vendiendo de a uno"],
    ["rpl_c_harvest", ["hands gathering a generous harvest from a home garden"], "la tierra devolviendo para siempre"],
    ["rpl_c_grandfather", ["an old farmer teaching a child to plant in the garden"], "así vivían los míos"],
    ["rpl_c_return_soil", ["kitchen scraps being returned to garden soil"], "todo vuelve a la tierra"],
  ],
  // ░░ ACCIÓN — empezá hoy (1262-1296) ~34s ░░
  action: [
    ["rpl_a_scallion", ["placing a green onion base into a glass of water on a sill"], "poné la cebolla en un vaso hoy"],
    ["rpl_a_shoots4d", ["green onion shoots growing after a few days in water"], "los brotes en cuatro días"],
    ["rpl_a_comments", ["a hand writing in a garden journal"], "contámelo (comentarios)"],
  ],
};

// ── densidad por sección (seg/clip): hook hiperdinámico, cuerpo Amish calmo ──
const PACE = {
  hook1: 1.3, hook2: 2.2, truth: 5.0,
  i1: 5.0, i2: 5.5, i3: 5.0, i4: 4.5, i5: 5.5, i6: 5.0, i7: 5.0,
  err: 5.5, i8: 5.0, i9: 5.0, i10: 5.0, i11: 5.5, i12: 5.5, i13: 5.5, i14: 5.0, i15: 5.5, i16: 5.0,
  close: 5.0, action: 5.0,
};
// ── construir CLIPS desde las secciones (densidad = repetir clips curados de la sección) ──
const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const CLIPS = [];
let _bid = 0;
for (const [key, list] of Object.entries(S)) {
  let s0 = SECSTART[key], e0 = secEnd(key);
  if (s0 < OPEN) s0 = OPEN; // recortar dentro del AV_FULL de apertura
  const span = e0 - s0;
  const pace = PACE[key] || 5.5;
  const desired = Math.max(list.length, Math.round(span / pace));
  for (let i = 0; i < desired; i++) {
    const t = +(s0 + (i + 0.04) * (span / desired)).toFixed(2);
    if (inFull(t)) continue;
    const [name, query, concept] = list[i % list.length];
    const id = `b${++_bid}_${name}`; // id único; reusa el mismo archivo/clip
    CLIPS.push([t, id, name, Array.isArray(query) ? query : [query], concept]);
  }
}
CLIPS.sort((a, b) => a[0] - b[0]);

// ── modo MATCH ──
if (MODE === "match") {
  const seen = new Set();
  const M = [];
  for (const [, , name, query, concept] of CLIPS) {
    if (seen.has(name)) continue; seen.add(name);
    M.push({ name, query, concept, dur: 6 });
  }
  fs.mkdirSync("public/broll", { recursive: true });
  fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(M, null, 2));
  const durs = CLIPS.map((c, i) => (i + 1 < CLIPS.length ? CLIPS[i + 1][0] - c[0] : TOTAL - c[0]));
  console.log(`match_${SLUG}.json: ${M.length} clips · beats ${CLIPS.length} · dur prom ${(durs.reduce((a, b) => a + b, 0) / durs.length).toFixed(1)}s`);
  process.exit(0);
}

// ── modo BUILD ──
const have = (name) => fs.existsSync(`public/broll/${name}.mp4`);
const avStarts = AV_FULL.map(([s]) => s);
const bounds = [...CLIPS.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;
const OV = 0.5;
let beats = CLIPS.map(([t, id, name, , concept]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  if (have(name)) return { id, start: t, dur, kind: "raw", src: `broll/${name}.mp4`, darken: 0 };
  return { id, start: t, dur, kind: "raw", src: `img/${name}.png`, darken: 0, gen: { type: "image", name, prompt: concept + IMG_STYLE } };
});

// ── COMPONENTES (escasos · custom en el hook + recaps) ──
const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const atc = (p) => { try { return at(p); } catch { console.warn("⚠ comp anchor missing:", p); return null; } };
const COMPONENTS = [
  // HOOK — los mejores, custom:
  { t: atc("esa con las raices todavia colgando"), id: "cmp_alive", kind: "impact", hitAt: 1.2, boom: 0, darken: 0.4,
    setup: "Eso que llamas basura...", impact: "sigue VIVA.", impactAccent: "good",
    bg: "a vegetable scrap with fresh roots glowing in sunlight on a windowsill" },
  { t: atc("vuelve a crecer"), id: "cmp_tally", kind: "stat", hue: "amber", accent: "good",
    value: 16, suffix: " plantas · 0€", label: "comida nueva, gratis, desde tu basura", eyebrow: "Lo que vas a sacar hoy",
    bg: "a windowsill full of regrowing vegetable cuttings in jars backlit" },
  { t: atc("cerca del numero once"), id: "cmp_teaser11", kind: "regrow", hue: "amber", number: "11",
    title: "Una sola te da una bolsa de comida", leftLabel: "Basura", rightLabel: "Cosecha",
    leftBg: "a wrinkled sprouting potato in a dim pantry", rightBg: "a big pile of freshly dug potatoes from one plant" },
  { t: atc("el error silencioso que mata"), id: "cmp_loop_error", kind: "mistake", number: "!", eyebrow: "EN ESTE VIDEO",
    title: "El error que mata la mitad de tus plantas", desc: "Casi todos lo cometen, y creen que no funcionó.",
    bg: "a wilting plant cutting dying in cloudy stagnant water" },
  // LA VERDAD — lo que NO necesitas
  { t: atc("no necesitas semillas caras"), id: "cmp_nonecesitas", kind: "splitlist", palette: "D", cross: true,
    title: "No necesitas nada de esto", items: ["Semillas caras", "Luces de cultivo", "Invernadero"] },
  { t: atc("un vaso de agua un punado de tierra"), id: "cmp_solo", kind: "checklist", hue: "amber", accent: "good",
    title: "Solo necesitas", eyebrow: "En tu cocina",
    items: [ck("Un vaso de agua"), ck("Un puñado de tierra"), ck("Una ventana con luz")],
    bg: "a glass of water with a cutting and a pot of soil on a sunny windowsill" },
  // EL ERROR — la explicación
  { t: atc("hay dos partes en el secreto"), id: "cmp_error_fix", kind: "process", hue: "amber", accent: "good",
    title: "Cómo evitar que mueran", eyebrow: "Las 2 reglas",
    steps: [{ title: "Cambia el agua cada 2-3 días" }, { title: "En cuanto veas raíces, pásala a la tierra" }] },
  // CIERRE — recap de las 16
  { t: atc("asi que hagamos la cuenta"), id: "cmp_recap", kind: "checklist", hue: "amber", accent: "good",
    title: "16 restos = 16 plantas", eyebrow: "Gratis · desde tu basura",
    items: [ck("Cebolla, lechuga, apio, bok choy, puerro"), ck("Albahaca, menta, cilantro"), ck("Ajo, jengibre, papa, batata"), ck("Zanahoria, tomate, piña + pimiento")],
    bg: "a wooden table covered with sprouting vegetable scraps and small plants" },

  // ── COMPONENTES EXTRA (variedad + valor: diagramas del método, ahorro, cita) ──
  // el negocio de la tienda (cross)
  { t: atc("la tienda te lo vende"), id: "cmp_business", kind: "lielist", accent: "danger",
    title: "Por qué te lo vende suelto", items: ["Para que vuelvas cada semana", "Lo usás una vez y lo tirás", "El negocio es la dependencia"],
    bg: "a busy supermarket checkout aisle, a cashier scanning groceries, shelves of vegetables in the background, slightly cold tone" },
  // barras: lo que se va al año comprando lo que podrías replantar
  { t: atc("una planta no sabe que la compraste"), id: "cmp_savings_bars", kind: "bars", hue: "amber", accent: "good", unit: "EUR",
    title: "Hierbas y verduras de hoja", eyebrow: "Lo que se va al año",
    bars: [{ label: "Comprándolas todo el año", value: 160, display: "~160€", tone: "danger" }, { label: "Replantando los restos", value: 0, display: "0€", winner: true }] },
  // diagrama anotado #1 cebolla de verdeo
  { t: atc("empecemos por el numero uno"), id: "cmp_anno_cebolla", kind: "annotated", hue: "amber", eyebrow: "Cómo se hace",
    annotations: [
      { kind: "circle", x: 0.5, y: 0.78, w: 0.18, label: "Raíces al agua", color: "good" },
      { kind: "arrow", x: 0.5, y: 0.32, fromX: 0.78, fromY: 0.12, label: "Dejá 3 dedos de tallo", color: "amber" },
      { kind: "circle", x: 0.5, y: 0.9, w: 0.4, label: "1 dedo de agua", color: "accent" },
    ],
    bg: "green onion root ends standing in a glass with shallow water on a windowsill, side view" },
  // chips de hierbas (pivote)
  { t: atc("entramos en las hierbas"), id: "cmp_herbs", kind: "chips", hue: "amber",
    title: "Las hierbas: donde más ahorrás", chips: ["Albahaca", "Menta", "Cilantro"],
    bg: "fresh basil mint and cilantro herb cuttings rooting in glasses of water on a windowsill" },
  // barras: el robo de la albahaca
  { t: atc("cuesta una pequena fortuna"), id: "cmp_basil_bars", kind: "bars", hue: "amber", accent: "good", unit: "EUR",
    title: "Albahaca fresca", eyebrow: "Comprarla vs replantarla",
    bars: [{ label: "Comprada cada semana", value: 60, display: "60€/año", tone: "danger" }, { label: "De 1 manojo replantado", value: 0, display: "0€", winner: true }] },
  // recap los que van solo en agua (midpoint)
  { t: atc("vamos por la mitad"), id: "cmp_water_crew", kind: "checklist", hue: "amber", accent: "good",
    title: "Solo agua y ventana", eyebrow: "Los 5 más fáciles",
    items: [ck("Cebolla de verdeo"), ck("Lechuga"), ck("Apio"), ck("Bok choy"), ck("Puerro")],
    bg: "several vegetable bases regrowing in glasses of water on a sunny windowsill" },
  // diagrama anotado #10 jengibre
  { t: atc("el numero diez es el jengibre"), id: "cmp_anno_jengibre", kind: "annotated", hue: "amber", eyebrow: "Buscá la yema",
    annotations: [
      { kind: "circle", x: 0.42, y: 0.4, w: 0.16, label: "Yema (como un ojo)", color: "good" },
      { kind: "arrow", x: 0.6, y: 0.6, fromX: 0.85, fromY: 0.85, label: "Cortá con una yema", color: "amber" },
    ],
    bg: "a knob of fresh ginger root with visible growth bud nodes, macro on a wooden board" },
  // diagrama anotado #11 papa
  { t: atc("llegamos al numero once"), id: "cmp_anno_papa", kind: "annotated", hue: "amber", eyebrow: "Cada trozo, un ojo",
    annotations: [
      { kind: "circle", x: 0.35, y: 0.4, w: 0.14, label: "Los ojos / brotes", color: "good" },
      { kind: "circle", x: 0.66, y: 0.55, w: 0.14, label: "", color: "good" },
      { kind: "arrow", x: 0.5, y: 0.82, fromX: 0.8, fromY: 0.95, label: "Cortá en trozos y dejá secar", color: "amber" },
    ],
    bg: "a sprouting potato with several pale eyes and shoots on a rustic table, macro" },
  // callout rendimiento de la papa
  { t: atc("esa sola papa"), id: "cmp_potato_yield", kind: "callout", hue: "amber", accent: "good",
    figure: "10–15", eyebrow: "De una sola papa", caption: "papas nuevas, de una que ibas a tirar" },
  // diagrama anotado #12 batata
  { t: atc("el numero doce es la prima dulce"), id: "cmp_anno_batata", kind: "annotated", hue: "amber", eyebrow: "El truco de los palillos",
    annotations: [
      { kind: "arrow", x: 0.5, y: 0.45, fromX: 0.8, fromY: 0.2, label: "Palillos: mitad en agua", color: "amber" },
      { kind: "circle", x: 0.5, y: 0.2, w: 0.3, label: "Salen los esquejes", color: "good" },
    ],
    bg: "a sweet potato suspended by toothpicks over a jar of water sprouting leafy slips on top" },
  // diagrama anotado #15 piña
  { t: atc("llegamos al numero 15"), id: "cmp_anno_pina", kind: "annotated", hue: "amber", eyebrow: "La corona = una planta",
    annotations: [
      { kind: "arrow", x: 0.5, y: 0.7, fromX: 0.82, fromY: 0.9, label: "Sacá las hojas de abajo", color: "amber" },
      { kind: "circle", x: 0.5, y: 0.66, w: 0.16, label: "Raíces dormidas", color: "good" },
    ],
    bg: "a pineapple crown with lower leaves removed showing small root bumps, on a table" },
  // cita de cierre (la frase del guion)
  { t: atc("no conoce la palabra basura"), id: "cmp_quote", kind: "quote", hue: "amber", accent: "amber", fontSize: 96,
    text: "La naturaleza no conoce la palabra *basura*.",
    bg: "weathered hands holding rich dark soil with a green sprout, golden hour" },
  // callout cero euros (cierre)
  { t: atc("mientras la tienda te vende"), id: "cmp_zero", kind: "callout", hue: "amber", accent: "good",
    figure: "0€", eyebrow: "16 plantas", caption: "comida que se siembra a sí misma, desde tu basura" },
].filter((c) => c.t != null);

let nComp = 0;
const placed = new Set();
for (const c of [...COMPONENTS].sort((a, b) => a.t - b.t)) {
  let idx = -1;
  for (let i = 0; i < beats.length; i++) {
    if (beats[i].start <= c.t + 0.01) { if (!placed.has(beats[i].id)) idx = i; } else break;
  }
  if (idx < 0) continue;
  const start = beats[idx].start;
  const D = 6.0;
  const { t, bg, leftBg, rightBg, kind, ...rest } = c;
  const ab = { id: c.id, start, dur: D, kind };
  delete rest.id;
  Object.assign(ab, rest);
  if (bg) { ab.image = `img/${c.id}_bg.png`; ab.gen = { type: "image", name: `${c.id}_bg`, prompt: bg + IMG_STYLE }; }
  if (leftBg) { ab.leftImage = `img/${c.id}_l.png`; ab.genL = { type: "image", name: `${c.id}_l`, prompt: leftBg + IMG_STYLE }; }
  if (rightBg) { ab.rightImage = `img/${c.id}_r.png`; ab.genR = { type: "image", name: `${c.id}_r`, prompt: rightBg + IMG_STYLE }; }
  let rm = 1;
  while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placed.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab);
  placed.add(c.id);
  const next = beats[idx + 1];
  const nextAv = avStarts.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
  ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + 7.0) - start).toFixed(2);
  nComp++;
}

// ── tope de imágenes IA (~95): descarte seguro (hueco resultante ≤8s) ──
beats.sort((a, b) => a.start - b.start);
const IMGCAP = Number(process.env.RPL_IMGCAP) || 170; // match rate baja → conservar densidad (imgs ~$0.006 c/u)
const isImg = (b) => b && b.kind === "raw" && b.gen;
let safety = 600;
while (beats.filter(isImg).length > IMGCAP && safety-- > 0) {
  let dropped = false;
  for (let i = 1; i < beats.length - 1; i++) {
    if (!isImg(beats[i])) continue;
    if (beats[i + 1].start - beats[i - 1].start <= 8) { beats.splice(i, 1); dropped = true; break; }
  }
  if (!dropped) break;
}

// ── tiling final: cero pantallas vacías ──
beats.sort((a, b) => a.start - b.start);
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  const avAfter = avStarts.filter((s) => s > b.start + 1e-6).sort((x, y) => x - y)[0] ?? Infinity;
  let end = Math.min(nextStart, TOTAL); if (avAfter < end) end = avAfter;
  const gap = end - b.start;
  const ov = b.kind === "raw" ? Math.min(OV, gap * 0.25) : 0; // overlap proporcional (hook corto no se super-solapa)
  b.dur = +(Math.max(0.2, Math.min(end + ov, TOTAL) - b.start)).toFixed(2);
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, clipsfirst: true, beats }, null, 2));

// ── ventanas de avatar (full en apertura/intro/cierre · PiP rotando · resto hidden) ──
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = [];
let k = 0;
for (let i = 0; i < beats.length; i++) {
  if (i % 6 === 4 && !inFull(beats[i].start)) { pip.push([beats[i].start, beats[i].start + Math.min(beats[i].dur, 6), POS[k % POS.length]]); k++; }
}
const firstClip = CLIPS.length ? Math.max(CLIPS[0][0], OPEN) : OPEN;
const modeAt = (t) => {
  if (t < OPEN - 1e-6) return "full";
  if (AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
  return p ? p[2] : "hidden";
};
const pts = [...new Set([0, OPEN, firstClip, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = [];
let cur = null;
for (const t of pts) {
  if (t >= TOTAL - 1e-6) break;
  const m = modeAt(t);
  if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; }
}
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync("src/VideoEdit/avatar_replantar.gen.ts", `// avatar_replantar.gen.ts — GENERADO por build_replantar.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_REPLANTAR = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const nClip = beats.filter((b) => b.kind === "raw" && !b.gen).length;
const nImg = beats.filter(isImg).length;
const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0);
console.log(`=== build_replantar ===`);
console.log(`beats: ${beats.length} · clips reales: ${nClip} · imágenes IA: ${nImg} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
console.log(`dur min/max: ${Math.min(...beats.map((b) => b.dur))}s / ${Math.max(...beats.map((b) => b.dur))}s`);
