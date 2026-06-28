// shots_ollas.mjs — Levi Lapp Jardín (ES) · "Enterrás una olla de barro y tu huerta se riega sola"
// Riego con ollas/ollas de barro (clay pot / olla irrigation). Shotlist DENSO CLIPS-FIRST:
// queries LIMPIAS, visuales, con movimiento (barro, terracota, enterrar, agua, raíces, sequía,
// huerta, manos, abuelo, desierto, oasis), NO la palabra literal del narrador.
export const SHOTS = {
  // ░░ HOOK1 — promesa imposible: enterrás una olla, riega sola, −70% agua ░░
  hook1: [
    ["ollas_h_watering_daily", ["person watering a vegetable garden every day with a hose", "tired gardener watering plants under the sun"], "regar la huerta todos los días"],
    ["ollas_h_water_evaporating", ["water splashing on dry soil evaporating in sunlight", "steam rising from hot garden soil"], "el agua que se evapora al instante"],
    ["ollas_h_wilting_plants", ["wilting vegetable plants drooping in summer heat", "thirsty tomato plant with limp leaves"], "plantas que pasan sed en verano"],
    ["ollas_h_terracotta_pot", ["a plain unglazed terracotta clay pot on soil", "rustic clay pot close up"], "una simple olla de barro"],
    ["ollas_h_bury_pot_garden", ["burying a clay pot in garden soil up to the rim", "placing a terracotta pot into a dug hole in a garden"], "enterrar la olla al lado de las plantas"],
    ["ollas_h_fill_pot_water", ["pouring water into a buried clay pot in a garden", "filling a terracotta vessel with water"], "llenar la olla de agua"],
    ["ollas_h_stone_lid", ["a flat stone covering the top of a clay pot", "placing a lid on a clay vessel"], "tapar la olla con una piedra"],
    ["ollas_h_roots_water_soil", ["plant roots growing in moist dark soil underground", "cross section of roots in wet earth"], "el agua que sube a la raíz desde abajo"],
    ["ollas_h_lush_garden_thriving", ["lush thriving vegetable garden full of tomatoes", "healthy green backyard garden rows"], "una huerta cargada y verde"],
    ["ollas_h_old_farmer_relaxed", ["old farmer resting in the shade of a garden", "elderly man drinking from a cup in his garden"], "el abuelo descansando a la sombra"],
    ["ollas_h_water_drop_slow", ["a single drop of water on dry cracked earth", "slow water droplet soaking into soil"], "una gota de agua, justa"],
    ["ollas_h_neighbors_buckets", ["man carrying heavy buckets of water across a garden", "exhausted gardener hauling water"], "los vecinos regando con baldes"],
    ["ollas_h_ancient_pottery", ["ancient clay pottery vessel buried in earth", "old earthenware jar in the ground"], "algo que tiene dos mil años"],
    ["ollas_h_tomatoes_heavy", ["ripe red tomatoes heavy on the vine", "thriving tomato plant loaded with fruit"], "tomates parados y cargados"],
  ],
  // ░░ HOOK2 — el error que arruina todo + quedate hasta el final ░░
  hook2: [
    ["ollas_h2_glazed_pot", ["a shiny glazed colorful ceramic pot", "glossy painted flower pot"], "la olla linda y esmaltada"],
    ["ollas_h2_dry_dead_plant", ["dead dried up plant in a pot", "withered seedling in dry soil"], "la planta seca igual"],
    ["ollas_h2_hand_make_pot", ["hands sealing the hole of a terracotta pot", "preparing a clay pot for the garden"], "cómo fabricar la olla casi gratis"],
    ["ollas_h2_question_mark_garden", ["confused gardener looking at a plant", "person scratching head in a garden"], "por qué a algunos no les funciona"],
    ["ollas_h2_clock_waiting", ["sun setting over a quiet vegetable garden", "time passing over a garden timelapse"], "quedate hasta el final"],
  ],
  // ░░ LEVI intro (AV_FULL) — me crié a la antigua, el abuelo Amós, 2000 años ░░
  levi: [
    ["ollas_lv_country_farm", ["peaceful old country farm at golden hour", "rural homestead with vegetable garden"], "criado a la antigua en el campo"],
    ["ollas_lv_grandfather_teach", ["old farmer hands showing a clay pot to a boy", "elder teaching a child in a garden"], "lo aprendí de mi abuelo Amós"],
    ["ollas_lv_old_book_farming", ["very old farming manuscript with drawings", "ancient agricultural text pages"], "de las cosas más viejas de la agricultura"],
    ["ollas_lv_desert_oasis", ["green oasis with palms in a dry desert", "lush crops growing in arid land"], "huertas donde no debería crecer nada"],
  ],
  // ░░ VILLANO — cómo regás hoy desperdicia: evaporación, escurrimiento, profundo ░░
  villain: [
    ["ollas_v_hose_surface", ["watering garden soil surface with a hose", "spraying water over a vegetable bed"], "tirás el agua arriba de la tierra"],
    ["ollas_v_evaporation_sun", ["water vapor rising off wet soil under hot sun", "puddle evaporating on hot ground"], "una parte se evapora al instante"],
    ["ollas_v_runoff_water", ["water running off and pooling beside a garden bed", "rainwater draining away from soil"], "otra parte escurre y se pierde"],
    ["ollas_v_water_deep_soil", ["water sinking deep into a soil profile", "cross section of water draining below roots"], "se va más profundo que las raíces"],
    ["ollas_v_weeds_growing", ["weeds growing in a wet vegetable garden", "weedy garden bed"], "alimentando a los yuyos"],
    ["ollas_v_wet_topsoil", ["wet glistening topsoil surface in a garden", "soaked surface of a garden bed"], "mojás toda la superficie"],
    ["ollas_v_frequent_watering", ["gardener watering again and again with a can", "repeatedly watering the same plants"], "por eso regás tanto y tan seguido"],
  ],
  // ░░ INDUSTRIA — el riego por goteo caro que te venden ░░
  industry: [
    ["ollas_in_drip_tubes", ["drip irrigation tubing laid across a garden", "thin black irrigation hoses among plants"], "el riego por goteo que te venden"],
    ["ollas_in_irrigation_pump", ["an irrigation pump and timer device", "garden water timer controller"], "la bomba, el programador que se rompe"],
    ["ollas_in_store_shelves", ["shelves of irrigation supplies in a garden store", "garden center aisle with hoses and timers"], "una pequeña fortuna en el vivero"],
    ["ollas_in_clogged_emitter", ["clogged dripper emitter dripping unevenly", "blocked drip irrigation nozzle"], "las mangueritas que se tapan"],
    ["ollas_in_cheap_clay_pot", ["a single cheap terracotta pot held in a hand", "inexpensive clay pot on a table"], "una olla de cinco pesos lo resuelve sola"],
    ["ollas_in_money_garden_store", ["paying money at a garden center counter", "hand giving cash at a store"], "gastar plata en aparatos"],
  ],
  // ░░ ABUELA — la primera olla rajada, "dar de tomar a la tierra" ░░
  abuela: [
    ["ollas_ab_cracked_pot", ["an old cracked terracotta cooking pot", "broken clay pot with a crack"], "una olla de barro rajada de la cocina"],
    ["ollas_ab_old_woman_garden", ["old woman kneeling beside tomato plants", "elderly farm woman working in a garden"], "la abuela al lado de los tomates"],
    ["ollas_ab_bury_beside_tomato", ["burying a clay pot next to a tomato plant", "placing a pot in soil by vegetables"], "la enterró al lado de los tomates"],
    ["ollas_ab_flat_stone_lid", ["a flat stone placed over a buried pot", "covering a pot with a stone slab"], "le puso una piedra plana de tapa"],
    ["ollas_ab_boy_watching", ["young boy watching a woman garden", "curious child in a straw hat in a garden"], "el abuelo de chico, mirando"],
    ["ollas_ab_pour_into_pot", ["pouring water into a clay pot beside plants", "filling a buried vessel with water"], "darle de tomar a la tierra"],
  ],
  // ░░ MECÁNICA — barro poroso, los poros, sale solo cuando la tierra está seca ░░
  mech: [
    ["ollas_m_porous_clay_close", ["extreme close up of rough porous unglazed clay", "macro texture of raw terracotta surface"], "el barro cocido sin esmaltar, poroso"],
    ["ollas_m_water_seep_clay", ["water seeping through the wall of a clay pot", "moisture beading on outside of a terracotta pot"], "el agua sale por los poros"],
    ["ollas_m_dry_vs_wet_soil", ["dry soil next to dark moist soil", "boundary between wet and dry earth"], "solo sale cuando la tierra está seca"],
    ["ollas_m_roots_wrap_pot", ["plant roots wrapping around a buried clay pot", "roots clinging to a terracotta surface underground"], "las raíces se enroscan al barro"],
    ["ollas_m_water_absorb_soil", ["dry soil absorbing water slowly", "water soaking into parched earth"], "la tierra chupa el agua de a poco"],
    ["ollas_m_cross_section_soil", ["cross section diagram of soil layers and roots", "underground view of plant roots in earth"], "directo en la raíz, bajo tierra"],
    ["ollas_m_water_pot_macro", ["macro of water droplets on damp terracotta", "sweating clay surface with water beads"], "millones de poros microscópicos"],
  ],
  // ░░ MECÁNICA 2 — agua exacta, cero evaporación, la despensa ░░
  mech2: [
    ["ollas_m2_healthy_roots", ["healthy white roots in rich moist soil", "strong root system underground"], "el agua exacta que la planta necesita"],
    ["ollas_m2_no_evaporation", ["shaded moist soil under a leafy plant", "cool damp earth protected from sun"], "donde el sol no la evapora"],
    ["ollas_m2_thriving_pepper", ["thriving pepper plant full of fruit", "lush green pepper plants in a garden"], "la planta come cuando tiene hambre"],
    ["ollas_m2_water_meter_low", ["a slowly turning water meter", "low water usage dial"], "setenta por ciento menos de agua"],
    ["ollas_m2_full_garden_wide", ["wide view of a flourishing vegetable garden", "abundant garden beds in summer"], "ya no se desperdicia casi nada"],
  ],
  // ░░ NATURALEZA — como la lluvia que se filtra en el bosque ░░
  nature: [
    ["ollas_n_rain_forest_floor", ["rain soaking slowly into a mossy forest floor", "water droplets on damp forest ground"], "el agua de lluvia se filtra despacio"],
    ["ollas_n_moss_wet_log", ["wet moss on a log in a humid forest", "damp green forest undergrowth"], "la tierra del bosque húmeda por semanas"],
    ["ollas_n_water_seep_earth", ["water slowly percolating through dark earth", "moisture spreading through soil"], "así guarda y entrega el agua la tierra"],
  ],
  // ░░ HISTORIA — 2000 años, China antigua, norte de África, desierto ░░
  history: [
    ["ollas_hi_ancient_china_field", ["ancient Chinese farmland with terraces", "old illustration of Chinese agriculture"], "en la China antigua, hace dos milenios"],
    ["ollas_hi_old_scroll", ["ancient scroll with old writing and drawings", "weathered manuscript pages"], "ya escribían sobre enterrar vasijas"],
    ["ollas_hi_desert_oasis_palms", ["green oasis with palm trees in the desert", "crops growing among sand dunes"], "en el norte de África, en el desierto"],
    ["ollas_hi_clay_jars_buried", ["rows of buried clay jars in dry ground", "earthenware pots half buried in sandy soil"], "regaban así sus huertos y árboles"],
    ["ollas_hi_dry_land_green", ["green crops growing in the middle of arid land", "life thriving in a dry landscape"], "vida verde en medio de la arena"],
    ["ollas_hi_ancient_hands_pot", ["ancient hands shaping a clay vessel", "potter forming an earthenware jar"], "lo más eficiente que se inventó nunca"],
  ],
  // ░░ ABUELA 2 — el verano seco, los tomates parados, "vale más enterrada" ░░
  abuela2: [
    ["ollas_a2_drought_summer", ["harsh dry summer with cracked ground", "drought stricken landscape under hot sun"], "vino un verano seco, de los duros"],
    ["ollas_a2_neighbor_wilted", ["wilted drooping plants with limp leaves at midday", "vegetables collapsing from heat"], "las plantas de los vecinos dobladas de sed"],
    ["ollas_a2_standing_tomatoes", ["upright green tomato plants loaded with red fruit", "healthy tomato plants in a dry garden"], "los tomates de la abuela, parados y verdes"],
    ["ollas_a2_lift_stone_fill", ["lifting a stone lid and filling a buried pot", "refilling a clay pot once a week"], "una vez por semana llenaba la olla"],
    ["ollas_a2_buried_better", ["a cracked clay pot buried beside a healthy plant", "old broken pot reused in a garden"], "vale más enterrada que entera en la cocina"],
  ],
  // ░░ BUILD intro — dos caminos según lo que tengas ░░
  build: [
    ["ollas_b_two_pots_table", ["two terracotta pots side by side on a workbench", "clay pots and tools laid out"], "tenés dos caminos"],
    ["ollas_b_hands_pot_work", ["hands working on a terracotta pot at a table", "preparing garden pots on a bench"], "armar el tuyo, de lo más simple"],
  ],
  // ░░ BUILD 1 — maceta de terracota, tapar el agujero, la tapa ░░
  build1: [
    ["ollas_b1_terracotta_plain", ["a plain unglazed terracotta flower pot", "common cheap clay garden pot"], "una maceta común de terracota"],
    ["ollas_b1_hole_bottom", ["the drainage hole at the bottom of a clay pot", "underside of a terracotta pot with a hole"], "el agujero del fondo"],
    ["ollas_b1_plug_hole_cork", ["plugging a pot hole with a cork or clay", "sealing the bottom of a flower pot"], "tapás el agujero con un corcho o cemento"],
    ["ollas_b1_saucer_lid", ["a clay saucer turned upside down as a lid", "small dish covering a pot opening"], "un plato de barro de tapa"],
  ],
  // ░░ BUILD 2 — dos macetas boca con boca, la olla tradicional ░░
  build2: [
    ["ollas_b2_two_pots_join", ["two clay pots joined rim to rim", "stacking two terracotta pots mouth to mouth"], "dos macetas pegadas boca con boca"],
    ["ollas_b2_seal_cement", ["sealing the joint of two pots with cement", "applying tape or mortar to a clay vessel"], "sellás la unión con cemento"],
    ["ollas_b2_finished_olla", ["a sealed clay vessel with a small top opening", "traditional olla irrigation jar"], "te queda una vasija cerrada con un pico"],
  ],
  // ░░ INSTALL — cavar, enterrar hasta el cuello, llenar, tapar, plantar en círculo ░░
  install: [
    ["ollas_i_dig_hole", ["digging a hole in a garden bed with a trowel", "shoveling a planting hole in soil"], "cavás un pozo al lado"],
    ["ollas_i_bury_to_neck", ["burying a clay pot up to its neck in soil", "pot set into the ground with rim showing"], "enterrás la olla hasta el cuello"],
    ["ollas_i_press_soil", ["pressing soil firmly around a buried pot", "firming earth around a planted vessel"], "la tierra apretada alrededor del barro"],
    ["ollas_i_fill_to_top", ["filling a buried clay pot to the brim with water", "pouring water into an in-ground olla"], "la llenás de agua hasta arriba"],
    ["ollas_i_plant_circle", ["planting seedlings in a ring around a central pot", "young plants arranged in a circle in a bed"], "plantás en círculo alrededor"],
    ["ollas_i_seedlings_soil", ["pressing a seedling into garden soil", "transplanting young vegetable plants"], "las raíces la encuentran enseguida"],
  ],
  // ░░ PLANTAS — qué plantar, el tamaño, la cuadrícula de ollas ░░
  plants: [
    ["ollas_p_tomatoes_peppers", ["rows of tomato and pepper plants in a garden", "thriving peppers and tomatoes"], "tomates, pimientos, los que más agradecen"],
    ["ollas_p_squash_melon", ["squash and melon vines sprawling in a garden", "pumpkin plant with big leaves"], "zapallos, melones, pepinos"],
    ["ollas_p_lettuce_bed", ["a bed of fresh green lettuce heads", "rows of leafy lettuce"], "lechugas que crecen como nunca"],
    ["ollas_p_hand_span_soil", ["open hands measuring space over a garden bed", "spacing plants apart by hand"], "el ancho de tus brazos abiertos"],
    ["ollas_p_grid_garden", ["a neat grid pattern vegetable garden from above", "well organized garden plot aerial"], "la huerta cuadriculada de ollas"],
    ["ollas_p_walk_watering_can", ["farmer walking through a garden with a watering can", "person watering beds with a can, whistling"], "caminaba llenándolas, silbando"],
  ],
  // ░░ ERROR — el barro poroso vs el esmaltado (error #1) ░░
  error: [
    ["ollas_e_glazed_shiny", ["a shiny glazed ceramic pot reflecting light", "glossy painted decorative pot"], "la olla esmaltada, brillante, pintada"],
    ["ollas_e_dry_dead_seedling", ["a dead seedling in dry soil", "wilted plant that did not survive"], "la planta se seca igual"],
    ["ollas_e_glaze_surface_macro", ["macro of a smooth glossy glazed ceramic surface", "sealed shiny pottery glaze close up"], "esa capa vidriada sella los poros"],
    ["ollas_e_raw_clay_matte", ["macro of rough matte unglazed terracotta", "porous raw clay texture close up"], "barro crudo, mate, áspero, poroso"],
    ["ollas_e_water_test_clay", ["splashing water on terracotta turning it dark", "wetting raw clay so it darkens"], "mojá el barro: el bueno se oscurece y chupa"],
  ],
  // ░░ REGLAS — tapar, invierno vaciar, raíces/rellenar ░░
  rules: [
    ["ollas_r_lid_cover", ["covering a buried clay pot with a lid", "placing a cap on an olla opening"], "tapá siempre la olla"],
    ["ollas_r_mosquito_water", ["mosquito larvae in still water", "mosquito hovering over stagnant water"], "se llena de mosquitos en el agua quieta"],
    ["ollas_r_frozen_cracked", ["a clay pot cracked by ice and frost", "frozen broken terracotta in winter"], "en invierno el hielo te raja la olla"],
    ["ollas_r_empty_pots_shed", ["empty clay pots stacked in a shed", "terracotta pots stored away dry"], "vacías y a la sombra pasan el invierno"],
    ["ollas_r_roots_check", ["checking roots around a buried pot in soil", "inspecting an olla in the garden"], "revisá que las raíces no la tapen"],
  ],
  // ░░ CUENTA — lo que ganás: 1 vez/semana, −70%, dura años, gratis ░░
  count: [
    ["ollas_c_calendar_week", ["a weekly calendar with one watering day marked", "filling a pot once a week"], "llenás una olla una vez por semana"],
    ["ollas_c_water_bill_saving", ["a water meter dial barely moving", "saving water concept in a garden"], "hasta setenta por ciento menos de agua"],
    ["ollas_c_durable_pot", ["a sturdy terracotta olla lasting for years", "old clay pot still intact in a garden"], "una olla que dura años, sin piezas que se rompan"],
    ["ollas_c_free_cracked_pot", ["a cracked old clay pot about to be thrown away", "discarded broken terracotta pot"], "esa maceta rajada que ibas a tirar"],
    ["ollas_c_trash_to_tool", ["reusing a broken pot in a vegetable garden", "old pot repurposed in the soil"], "en la huerta es un sistema de riego"],
  ],
  // ░░ AMISH — no estamos contra lo moderno, no desperdiciar, agua despacio ░░
  amish: [
    ["ollas_am_amish_farm_wide", ["peaceful Amish farm with garden and barn", "rolling Amish farmland at golden hour"], "la gente escucha amish y piensa mal"],
    ["ollas_am_hand_soil_care", ["weathered hands gently cupping dark soil", "caring hands holding rich earth"], "no nos gusta desperdiciar"],
    ["ollas_am_slow_water_root", ["water dripping slowly at the base of a plant", "gentle watering at plant roots"], "el agua se da despacio, abajo, en la raíz"],
    ["ollas_am_baby_care", ["gentle hands watering a tiny seedling", "tending a delicate young plant"], "como se le da de tomar a un recién nacido"],
  ],
  // ░░ CIERRE — la maceta rajada es lo que tu huerta necesita ░░
  close: [
    ["ollas_cl_broken_pot_corner", ["a broken clay pot lying in a corner", "discarded terracotta pot in a yard"], "esa maceta rajada tirada en un rincón"],
    ["ollas_cl_bury_fill_cover", ["burying, filling and covering a clay pot by a plant", "installing an olla beside a vegetable"], "enterrarla, llenarla y taparla"],
    ["ollas_cl_thriving_drought", ["a green thriving plant in dry surroundings", "healthy garden during a drought"], "para no volver a pasar sed nunca más"],
  ],
  // ░░ CTA — esta semana enterrá una, dejá tu truco en comentarios ░░
  cta: [
    ["ollas_ct_plant_pot_garden", ["person installing a clay pot in a home garden", "gardener burying an olla beside plants"], "esta semana, enterrá una al lado de una planta"],
    ["ollas_ct_grandmother_hands", ["old hands holding a cracked clay pot", "elderly hands with an old terracotta pot"], "lo que entendió la abuela hace cien años"],
    ["ollas_ct_comments_share", ["old farmer talking to camera in a garden", "person sharing a story outdoors"], "dejame tu truco viejo en los comentarios"],
  ],
  // ░░ NEXT — el próximo: sacar agua del aire (pozo de rocío) ░░
  next: [
    ["ollas_nx_dew_drops_dawn", ["dew drops on plants at dawn", "morning dew glistening on leaves"], "sacar agua del aire, sin lluvia"],
    ["ollas_nx_stone_well", ["an old stone well in a dry field", "ancient stone structure in arid land"], "un pozo viejo que junta el agua del aire"],
    ["ollas_nx_misty_night_field", ["misty foggy field at night", "humid air over a field before dawn"], "el agua que flota en el aire de la noche"],
  ],
  // ░░ OUTRO — cuídense, vale más enterrada que entera ░░
  outro: [
    ["ollas_o_pot_garden_sunset", ["a buried clay olla in a garden at sunset", "peaceful garden with a terracotta pot at dusk"], "vale más enterrada en la huerta"],
    ["ollas_o_farmer_walk_away", ["old farmer walking away through a green garden", "elderly man leaving his thriving garden"], "cuídense entre ustedes"],
  ],
};
