// shots_hugel.mjs — Levi Lapp Jardín (ES) · "Mi abuelo enterró troncos podridos... huerta no regó 20 años"
// Hugelkultur. Shotlist DENSO CLIPS-FIRST: queries LIMPIAS, visuales, con movimiento (madera, troncos,
// enterrar, huerta, regar, sequía, hongos, manos en la tierra, abuelo), NO la palabra literal del narrador.
export const SHOTS = {
  // ░░ HOOK1 — promesa imposible: enterrás madera 1 vez, riega y abona solo 20 años ░░
  hook1: [
    ["hugel_h_watering_can_daily", ["person watering a vegetable garden with a watering can", "watering garden plants every day"], "regando la huerta todos los días"],
    ["hugel_h_dry_wilting_garden", ["wilting vegetable garden in summer heat", "dry stressed garden plants"], "huerta marchitándose en verano"],
    ["hugel_h_fertilizer_bag", ["pouring fertilizer from a bag onto garden soil", "hands holding a bag of garden fertilizer"], "echando fertilizante de bolsa"],
    ["hugel_h_logs_pile", ["pile of fallen logs and branches on a farm", "stack of old logs in a field"], "una pila de troncos y ramas"],
    ["hugel_h_bury_log_trench", ["men burying logs in a trench in a garden", "placing a log into a dug trench"], "enterrando un tronco en una zanja"],
    ["hugel_h_lush_mound", ["lush raised garden mound full of vegetables", "thriving hugelkultur mound with squash"], "un montículo cargado de verduras"],
    ["hugel_h_old_farmer_garden", ["old Amish farmer standing in a green garden", "elderly farmer in a vegetable garden"], "el abuelo en la huerta verde"],
    ["hugel_h_rich_dark_soil", ["weathered hands holding rich dark crumbly soil", "dark fertile garden soil close up"], "tierra negra y rica en las manos"],
    ["hugel_h_rotting_log_forest", ["rotting mossy log on a damp forest floor", "decomposing log covered in moss"], "un tronco podrido en el bosque"],
    ["hugel_h_rain_on_garden", ["rain falling on a vegetable garden", "raindrops on garden plants"], "la lluvia sobre la huerta"],
    ["hugel_h_drought_cracked", ["cracked dry earth in a drought", "parched cracked soil"], "tierra seca y agrietada"],
    ["hugel_h_squash_vine", ["big squash leaves and vines growing over a mound", "pumpkin plant sprawling in a garden"], "el zapallo cubriendo el montículo"],
    ["hugel_h_axe_log", ["an axe stuck in a log of firewood", "splitting firewood with an axe"], "el hacha en un tronco"],
    ["hugel_h_shovel_soil", ["shoveling dark soil in a garden", "digging garden soil with a shovel"], "cavando la tierra con pala"],
    ["hugel_h_tomatoes_vine", ["ripe tomatoes on the vine in a garden", "healthy tomato plants heavy with fruit"], "tomates cargados en la planta"],
    ["hugel_h_hand_plant_seedling", ["hands planting a seedling into a soil mound", "pressing a seedling into garden soil"], "plantando un plantín en el montículo"],
  ],
  // ░░ HOOK2 — el error que arruina + quedate ░░
  hook2: [
    ["hugel_h2_yellow_plants", ["yellowing nitrogen deficient garden plants", "pale yellow vegetable leaves"], "plantas amarillas y flacas"],
    ["hugel_h2_old_hands_soil", ["old farmer hands crumbling soil", "weathered hands working garden earth"], "manos viejas en la tierra"],
    ["hugel_h2_mound_cross_dig", ["digging into a garden mound revealing buried wood", "cross section of soil and buried branches"], "abriendo el montículo, la madera adentro"],
    ["hugel_h2_garden_wide", ["wide shot of a thriving backyard vegetable garden", "lush summer garden rows"], "una huerta próspera de fondo"],
    ["hugel_h2_amish_farm", ["Amish farm with garden and barn", "rolling Amish farmland"], "una granja amish"],
  ],
  // ░░ LEVI intro (AV_FULL) ░░
  levi: [
    ["hugel_lv_lancaster_farm", ["aerial of an Amish farm in summer", "rolling Amish farmland with barn"], "la granja en Lancaster"],
    ["hugel_lv_old_hands_teach", ["old farmer hands showing soil to a boy", "elder teaching a child in a garden"], "el abuelo enseñando"],
    ["hugel_lv_buggy_field", ["Amish horse and buggy by a cornfield", "horse drawn buggy on a country road"], "un carruaje amish"],
  ],
  // ░░ VILLANO — por qué tu huerta no retiene agua/comida + la industria ░░
  villain: [
    ["hugel_v_water_runoff", ["water running off dry garden soil", "water pooling and draining from a bed"], "el agua que se escurre"],
    ["hugel_v_dry_topsoil", ["cracked dry topsoil in a vegetable bed", "sun baked garden surface"], "la capa superficial reseca"],
    ["hugel_v_roots_shallow", ["shallow plant roots in thin soil", "vegetable roots near the surface"], "raíces en los primeros centímetros"],
    ["hugel_v_buying_fertilizer", ["customer buying bags of fertilizer at a garden store", "shelves of fertilizer at a nursery"], "comprando fertilizante en el vivero"],
    ["hugel_v_drip_system", ["drip irrigation hoses in a vegetable garden", "garden watering system with tubes"], "el riego por goteo que te venden"],
    ["hugel_v_raised_bed_kit", ["a store bought raised garden bed kit", "plastic raised garden bed in a yard"], "el cantero elevado comprado"],
    ["hugel_v_money_garden", ["hand paying money at a garden center", "spending money on garden supplies"], "gastando plata en la huerta"],
    ["hugel_v_empty_bag", ["empty fertilizer bag in a garden", "discarded fertilizer packaging"], "la bolsa vacía, otra vez"],
    ["hugel_v_hose_watering", ["watering a garden with a hose under hot sun", "spraying a vegetable bed with a hose"], "regando con manguera bajo el sol"],
  ],
  // ░░ ABUELO — el roble caído, el bisabuelo, "vale más enterrado que quemado" ░░
  abuelo: [
    ["hugel_a_fallen_tree_storm", ["large tree fallen in a field after a storm", "uprooted oak tree on farmland"], "el roble caído tras la tormenta"],
    ["hugel_a_man_axe_log", ["man with an axe beside a fallen log", "preparing to chop a fallen tree for firewood"], "el hacha lista para hacer leña"],
    ["hugel_a_old_man_stern", ["stern old Amish farmer with white beard", "old farmer giving advice in a field"], "el viejo, serio"],
    ["hugel_a_dig_long_trench", ["men digging a long trench with shovels", "digging a deep garden trench"], "cavando una zanja larga"],
    ["hugel_a_log_into_trench", ["lowering a big log into a trench", "burying a tree trunk in the ground"], "el tronco entero adentro"],
    ["hugel_a_branches_leaves", ["piling branches and leaves into a trench", "filling a trench with brush"], "ramas y hojas encima"],
    ["hugel_a_manure_shovel", ["shoveling manure onto a garden bed", "spreading compost over soil"], "el estiércol arriba"],
    ["hugel_a_cover_with_soil", ["covering a trench with dark soil to make a mound", "shoveling earth over buried wood"], "tapando con tierra"],
    ["hugel_a_boy_watching", ["young Amish boy watching work in a field", "child in a straw hat on a farm"], "el chico mirando sin entender"],
    ["hugel_a_plant_on_mound", ["planting vegetables on top of a soil mound", "seedlings on a raised garden mound"], "plantando encima"],
  ],
  // ░░ MECANISMO — esponja de agua + despensa + calor (momentos de DIAGRAMA) ░░
  mech: [
    ["hugel_m_wet_sponge_wood", ["water soaking into a piece of rotting wood", "wet decomposing log absorbing water"], "la madera empapándose como esponja"],
    ["hugel_m_water_drip_roots", ["water dripping slowly onto plant roots in soil", "moisture reaching roots underground"], "el agua bajando a las raíces"],
    ["hugel_m_log_holds_water", ["squeezing water from a piece of rotten wood", "saturated punky wood dripping"], "el tronco soltando agua"],
    ["hugel_m_minerals_soil", ["rich mineral dark soil close up", "nutrient rich crumbly earth"], "los minerales en la tierra"],
    ["hugel_m_slow_release", ["compost slowly breaking down in soil", "decomposing organic matter in a garden"], "el alimento liberándose de a poco"],
    ["hugel_m_steam_compost", ["steam rising from a compost pile in winter", "warm compost heap steaming"], "el vapor del compost (calor)"],
    ["hugel_m_frost_garden", ["light frost on garden plants at dawn", "frosty vegetable leaves morning"], "la helada liviana de la mañana"],
    ["hugel_m_thriving_roots", ["healthy white plant roots spreading in soil", "strong root system in dark earth"], "raíces sanas extendiéndose"],
  ],
  // ░░ BOSQUE — copiar al monte ░░
  forest: [
    ["hugel_f_forest_floor_logs", ["damp forest floor with fallen rotting logs", "mossy logs and leaves on forest ground"], "el suelo del bosque con troncos"],
    ["hugel_f_moss_log_macro", ["moss and fungi growing on a decaying log", "macro of a rotting log in the woods"], "musgo y hongos sobre la madera"],
    ["hugel_f_sun_through_trees", ["sunlight streaming through a green forest", "light beams in the woods"], "el sol entre los árboles"],
    ["hugel_f_damp_woodland_soil", ["dark damp soil on a forest floor", "rich woodland earth close up"], "la tierra húmeda del bosque"],
  ],
  // ░░ SEQUÍA — el verano sin lluvia, el cantero verde ░░
  drought: [
    ["hugel_d_dead_garden", ["dead brown wilted vegetable garden in drought", "dried up garden under harsh sun"], "la huerta muerta por la sequía"],
    ["hugel_d_cracked_field", ["wide cracked dry field in a heatwave", "parched farmland in drought"], "el campo seco y rajado"],
    ["hugel_d_yellow_neighbors", ["yellowing dying vegetable plants", "brown crops failing in heat"], "las huertas amarillas de los vecinos"],
    ["hugel_d_buckets_water", ["carrying water buckets from a stream to a garden", "hauling water by hand in drought"], "acarreando agua con baldes"],
    ["hugel_d_green_mound", ["one lush green garden in the middle of a dry field", "thriving mound full of tomatoes in drought"], "el cantero verde en medio de lo seco"],
    ["hugel_d_tomatoes_drought", ["ripe tomatoes on a healthy plant", "abundant tomatoes on the vine"], "los tomates cargados"],
  ],
  // ░░ ARMADO — pasos (madera, zanja, troncos, ramas, verde, estiércol, tierra) ░░
  build: [
    ["hugel_b_gather_wood", ["gathering logs and branches in a wheelbarrow", "collecting fallen wood on a farm"], "juntando la madera"],
    ["hugel_b_choose_spot", ["sunny open spot in a backyard garden", "clear ground for a new garden bed"], "eligiendo el lugar al sol"],
    ["hugel_b_dig_trench2", ["digging a shallow trench with a spade", "breaking ground for a garden bed"], "cavando la zanja"],
    ["hugel_b_big_logs_base", ["laying big logs side by side as a base", "row of logs on the ground"], "los troncos gruesos de base"],
    ["hugel_b_branches_fill", ["filling gaps between logs with branches", "stacking smaller branches on logs"], "las ramas rellenando huecos"],
    ["hugel_b_grass_leaves", ["piling grass clippings and leaves on a bed", "adding green material to a garden pile"], "el pasto y las hojas verdes"],
    ["hugel_b_manure_layer", ["spreading manure over a garden layer", "shoveling compost onto a bed"], "la capa de estiércol"],
    ["hugel_b_cover_topsoil", ["covering a mound with a thick layer of topsoil", "shaping a raised garden mound with soil"], "tapando con tierra"],
    ["hugel_b_finished_mound", ["a finished tall garden mound ready to plant", "newly built raised soil mound"], "el montículo terminado"],
    ["hugel_b_plant_squash", ["planting squash seedlings on a mound", "young squash plants on a raised bed"], "plantando zapallo encima"],
  ],
  // ░░ TAMAÑO / HONGOS — alto, se asienta, micelio ░░
  size: [
    ["hugel_s_tall_mound", ["a tall raised hugelkultur garden mound", "high garden berm covered in plants"], "un montículo alto"],
    ["hugel_s_settling_mound", ["a garden mound sinking and settling over time", "compacting raised bed"], "el montículo asentándose"],
    ["hugel_s_add_leaves_autumn", ["adding autumn leaves on top of a garden bed", "mulching a bed with fallen leaves"], "agregando hojas en otoño"],
    ["hugel_s_mycelium_white", ["white fungal mycelium threads in dark soil", "mushroom mycelium on rotting wood"], "el micelio blanco en la madera"],
    ["hugel_s_mushrooms_log", ["mushrooms growing on a buried rotting log", "fungi sprouting from decaying wood"], "hongos saliendo de la madera"],
    ["hugel_s_soil_web", ["close up of soil full of life and roots", "living garden soil macro"], "la tierra viva por dentro"],
  ],
  // ░░ ERROR — el nitrógeno del primer año ░░
  error: [
    ["hugel_e_yellow_leaves", ["yellowing nitrogen starved plant leaves", "pale chlorotic vegetable leaves"], "hojas amarillas por falta de nitrógeno"],
    ["hugel_e_fresh_cut_wood", ["freshly cut pale wood logs", "fresh sawn timber light color"], "madera fresca recién cortada"],
    ["hugel_e_manure_pile", ["a pile of aged manure on a farm", "compost and manure heap"], "el montón de estiércol"],
    ["hugel_e_lettuce_mound", ["lettuce growing on a raised garden mound", "leafy greens on a bed"], "lechuga en el montículo (año 1)"],
    ["hugel_e_strong_tomato_y2", ["very healthy tall tomato plants", "vigorous tomato plants second year"], "tomates fuertes (año 2)"],
  ],
  // ░░ MADERA A EVITAR ░░
  wood: [
    ["hugel_w_cedar_log", ["a cedar log with reddish wood", "aromatic cedar wood close up"], "el cedro (evitar)"],
    ["hugel_w_walnut_tree", ["a black walnut tree with green husks", "walnut tree foliage"], "el nogal negro (veneno para tomates)"],
    ["hugel_w_treated_wood", ["green pressure treated lumber boards", "chemically treated wood planks"], "madera tratada (nunca)"],
    ["hugel_w_oak_logs", ["oak logs ready for the garden", "stack of hardwood oak logs"], "roble (perfecto)"],
    ["hugel_w_old_fruit_wood", ["pruned branches from old fruit trees", "apple tree prunings pile"], "ramas de frutales viejos"],
  ],
  // ░░ AÑO POR AÑO ░░
  yearplan: [
    ["hugel_y_squash_year1", ["squash and pumpkins sprawling over a mound", "year one squash on a hugel bed"], "zapallo el primer año"],
    ["hugel_y_potatoes_dig", ["digging up potatoes from a garden mound", "harvesting potatoes by hand"], "papas en el montículo"],
    ["hugel_y_tomatoes_peppers", ["abundant tomatoes and peppers in a garden", "second year heavy harvest"], "tomates y pimientos (año 2)"],
    ["hugel_y_overflowing_harvest", ["basket overflowing with garden vegetables", "huge homegrown vegetable harvest"], "una cosecha desbordante"],
  ],
  // ░░ COSTO / SUSCRIPCIÓN ░░
  cost: [
    ["hugel_c_drip_kit_store", ["irrigation kit and tubing for sale in a store", "drip system box on a shelf"], "el kit de goteo en la tienda"],
    ["hugel_c_raised_bed_store", ["expensive raised garden beds for sale", "garden center raised bed display"], "los canteros caros en venta"],
    ["hugel_c_fertilizer_shelf", ["shelves stacked with fertilizer bags", "garden store fertilizer aisle"], "la góndola de fertilizantes"],
    ["hugel_c_money_hand", ["counting money in hand", "paying cash bills"], "contando la plata"],
    ["hugel_c_free_logs", ["free pile of logs and brush in a yard", "wood debris ready to be hauled away"], "los troncos gratis del fondo"],
  ],
  // ░░ EMOCIONAL ░░
  emotional: [
    ["hugel_em_old_hands_soil", ["old weathered hands cradling rich soil", "elder holding dark earth golden hour"], "manos viejas con tierra rica"],
    ["hugel_em_fallen_to_new", ["a seedling growing from a rotting log", "new life from decaying wood"], "lo que cae alimenta lo que viene"],
    ["hugel_em_amish_garden_evening", ["Amish vegetable garden at golden hour", "peaceful homestead garden at dusk"], "la huerta amish al atardecer"],
    ["hugel_em_grandfather_grandson", ["old farmer and young boy walking a garden", "elder and child in a homestead"], "abuelo y nieto en la huerta"],
    ["hugel_em_full_basket", ["arms full of freshly harvested vegetables", "basket of homegrown produce"], "los brazos llenos de cosecha"],
  ],
  // ░░ CTA + teaser ollas ░░
  cta: [
    ["hugel_ct_mound_lush_final", ["a lush productive garden mound in summer", "thriving hugelkultur bed full of vegetables"], "el montículo próspero"],
    ["hugel_ct_burn_pile", ["a pile of branches about to be burned", "brush fire pile in a field"], "la pila de ramas que ibas a quemar"],
    ["hugel_ct_clay_pot", ["a buried unglazed clay pot in a garden bed", "olla terracotta pot in soil"], "la olla de barro (teaser)"],
    ["hugel_ct_clay_pot_water", ["pouring water into a buried clay pot in a garden", "filling an olla irrigation pot"], "llenando la olla de barro"],
    ["hugel_ct_farmer_wave", ["Amish farmer in a garden at dusk", "friendly farmer waving in a field"], "el granjero despidiéndose"],
  ],
};
