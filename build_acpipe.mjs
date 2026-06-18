// build_acpipe.mjs — CLIPS-FIRST híbrido (estilo "barcos"/"peroxide"): cientos de
// clips reales de YouTube matcheados a la narración (~cada 5s), avatar Claudio en
// distintas posiciones. NICHO NUEVO: Amish DIY/off-grid cooling (earth tube / caño
// enterrado de PVC que enfría una casa sin AC). Tema build/DIY = MUCHOS clips limpios.
// Donde no haya clip → imagen IA (deAPI) estilo NATURAL (sin filtros). Datos/números =
// COMPONENTE gráfico sobre foto (no fondo sólido aburrido).
//
// Modo:
//   node build_acpipe.mjs match  → public/broll/match_acpipe.json (entrada matchclip/matchfarm)
//   node build_acpipe.mjs        → beatsheet/acpipe.json + avatar_acpipe.gen.ts (híbrido)
//
// Flujo: build match → matchfarm acpipe 24 → fetch_parallel → build → beatsheet.mjs → render farm.
import fs from "fs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1433.22;
const OPEN = 2.2;  // avatar abre full ≥1s antes del 1er clip (regla dura)
const DLDUR = 6;   // segundos a bajar por clip (matchclip)

// avatar a PANTALLA COMPLETA (beats personales/emotivos/CTA). Fuera de esto = clips.
const AV_FULL = [
  [105.8, 112.5],   // "My name is Claudio. I am Amish." (solo lo personal; el resto = clips)
  [1076.6, 1086.0], // "The first time I felt it, 14 years ago... I laughed"
  [1242.0, 1262.0], // "The Amish never made that trade... We covered it back up"
  [1334.7, 1347.9], // "I read every one of them. And tell me if you build one..."
  [1422.0, TOTAL],  // sign-off "remember the people who built this country with their hands"
];

// [t, name, query, concept]  — concept = lo que se debe VER (EN). Query ESPECÍFICA,
// visual, anclada al tema (NUNCA palabras literales del narrador).
const CLIPS = [
  // ── COLD OPEN (0–92): 95° afuera / 63° adentro, sin AC, el vent del piso, el caño ──
  [2.2, "ac_thermo_sun", ["outdoor thermometer in direct sunlight high temperature","analog thermometer reading hot in the sun"], "an outdoor thermometer in full sun reading a high temperature"],
  [5.5, "ac_farmhouse", ["white farmhouse exterior sunny summer day","old country farmhouse south wall sunlight"], "a white farmhouse wall in full afternoon sun"],
  [9.0, "ac_field_heat", ["heat haze shimmering over a farm field","hot summer sun over green pasture"], "heat shimmering over a sunny field"],
  [13.0, "ac_sweaty_farmer", ["farmer wiping sweat from forehead in field","man working hard in the heat sweating"], "a farmer sweating after working in the field"],
  [16.5, "ac_cool_room", ["dim cool rustic farmhouse room interior","quiet simple country house room indoors"], "a dim, cool, simple farmhouse room"],
  [20.0, "ac_indoor_thermo", ["indoor wall thermometer reading cool temperature","round dial thermometer on a wall indoors"], "an indoor thermometer reading a cool temperature"],
  [24.0, "ac_oil_lamp", ["oil lamp lit in amish home no electricity","kerosene lamp on a table dim room"], "an oil lamp in a house with no electricity"],
  [28.0, "ac_floor_vent", ["wooden floor air vent register close up","floor vent in a wooden plank floor"], "a small wooden vent set in the floor"],
  [31.5, "ac_hand_draft", ["hand held over a floor air vent feeling air","hand in front of an air vent"], "a hand held in front of a floor vent feeling cool air"],
  [35.5, "ac_ribbon_draft", ["thin ribbon fluttering in a draft from a vent","tissue moving in airflow from a vent"], "a ribbon fluttering in a cool draft from a vent"],
  [39.0, "ac_dark_soil", ["rich dark crumbly soil close up","hands holding fresh dark earth"], "fresh dark soil, close up"],
  [42.0, "ac_pipe_trench", ["white PVC pipe laid in a deep trench","4 inch plastic pipe buried in ground trench"], "a white plastic pipe buried in a deep trench"],
  [45.5, "ac_pipe_field", ["long pipe laid across a field in a trench","plastic drain pipe running across a pasture"], "a long pipe running across a pasture in a trench"],
  [49.0, "ac_intake_post", ["vertical pipe with screened cap standing outdoors","pvc pipe riser by a fence with mesh top"], "a screened vertical pipe standing by a fence line"],
  [52.5, "ac_oak_tree", ["large old oak tree in a green pasture","big shade tree by a fence in a field"], "a big old oak tree in the shade by a fence"],
  [56.0, "ac_pvc_store", ["stacks of white PVC pipe at a hardware store","rows of plastic pipe in a store aisle"], "stacks of cheap white PVC pipe"],
  [59.5, "ac_men_digging", ["men digging a long trench in a field with shovels","two workers digging a trench outdoors"], "men digging a trench across a field"],
  [62.5, "ac_mini_excavator", ["mini excavator digging a trench in a yard","compact excavator digging a trench in dirt"], "a mini excavator digging a trench"],
  [66.0, "ac_summer_farm", ["cozy farmhouse exterior on a summer day","country home with a green yard in summer"], "a farmhouse on a warm summer day"],
  [69.5, "ac_pipe_sections", ["white PVC pipe sections close up smooth","new plastic drain pipe pieces"], "smooth white PVC pipe sections"],
  [73.5, "ac_leaves_screen", ["dead leaves resting on an outdoor mesh screen","leaves on a wire screen vent cap"], "leaves caught on a mesh screen"],
  [83.0, "ac_heat_field2", ["100 degree heat shimmer over dry field","hot afternoon sun on a farm field"], "blistering heat over a field on a hot day"],
  [86.5, "ac_cold_vent_air", ["cold air blowing out of a floor vent","cool air vent in the floor of a house"], "cool air flowing up out of a floor vent"],
  // ── HISTORIA (92–105): Romanos, Persas, Amish ──
  [92.6, "ac_roman_ruins", ["ancient roman stone ruins architecture","old roman villa stone walls"], "ancient Roman stone ruins"],
  [95.8, "ac_persian_tower", ["ancient persian windcatcher tower architecture","traditional middle eastern wind tower building"], "a Persian windcatcher tower"],
  [99.5, "ac_amish_buggy", ["amish horse and buggy on a country road","amish farm with horse drawn buggy"], "an Amish horse and buggy on a country lane"],
  [102.8, "ac_amish_farm", ["amish farmstead barn and fields aerial","traditional amish farm buildings"], "an Amish farmstead with barns and fields"],
  // [105.8–135.8] AV_FULL intro
  // ── DESPUÉS DEL INTRO (135.8–190): empezar con el caño, AC, energía, overview ──
  [135.8, "ac_pipe_simple", ["white PVC drain pipe lying in a trench","plain plastic pipe in the dirt"], "a plain plastic pipe in a trench"],
  [139.5, "ac_diy_weekend", ["man working on a backyard diy project","person building something in the yard on a weekend"], "a man working on a weekend project"],
  [143.0, "ac_ac_unit_off", ["outdoor air conditioner condenser unit beside house","central ac unit outside a home"], "an outdoor air conditioner unit beside a house"],
  [146.5, "ac_talk_porch", ["neighbors talking in a backyard","two men chatting outside a country house"], "people talking outdoors in a backyard"],
  [150.0, "ac_power_meter", ["electric meter and power lines on a house","utility power line running to a home"], "power lines and an electric meter on a house"],
  [153.5, "ac_hand_drawing", ["hand sketching a diagram on paper with a pencil","drawing a simple plan on paper"], "a hand sketching a diagram on paper"],
  [157.0, "ac_hardware_aisle", ["hardware store plumbing aisle full of pipe","plumbing supply store shelves"], "the plumbing aisle of a hardware store"],
  [163.5, "ac_deep_trench", ["a deep trench dug into the soil","excavated trench in the ground close up"], "a deep trench dug into the soil"],
  [167.0, "ac_pipe_sloped", ["pvc pipe laid at a slight slope in a trench","plastic pipe sloping down in the dirt"], "a pipe laid sloping in a trench"],
  [170.5, "ac_corrugated_warn", ["black corrugated flexible drainage pipe close up","ribbed accordion drain pipe"], "ribbed corrugated drainage pipe"],
  [174.0, "ac_soil_cross", ["cross section of soil layers underground","exposed dirt wall showing soil layers"], "a cross-section of soil layers"],
  [177.5, "ac_open_land", ["open green pasture land on a farm","empty grassy field ready to dig"], "open land on a farm"],
  // ── FÍSICA DEL SUELO (190–300) ──
  [190.6, "ac_ground_feet", ["bare feet standing on the ground outdoors","standing on soil in a field"], "the ground beneath your feet"],
  [194.5, "ac_soil_layers2", ["deep soil profile layers in an excavation","underground dirt wall cross section"], "deep soil layers in an excavation"],
  [201.5, "ac_sun_ground", ["sun beating down on bare dry ground","hot sunlight on cracked earth"], "the sun beating down on bare ground"],
  [205.0, "ac_hot_field", ["hot midday sun over a dry field","heat on a sunny pasture"], "a field baking in the midday sun"],
  [208.5, "ac_frost_dawn", ["frost on the ground at dawn","frozen frosty field early morning"], "frost on the ground at dawn"],
  [212.0, "ac_winter_field", ["snow covered frozen field in winter","frozen ground under snow"], "a frozen field in winter"],
  [215.5, "ac_dig_down", ["shovel digging down into deep soil","digging into the dirt with a spade"], "digging down into the soil"],
  [222.5, "ac_underground_wall", ["underground soil wall in a deep hole","earth wall of a deep pit"], "the cool earth deep in a pit"],
  // cmp_soil ~226
  [231.5, "ac_pa_farmland", ["rolling pennsylvania farmland green hills","amish countryside rolling fields"], "rolling Pennsylvania farmland"],
  [243.0, "ac_deep_cave", ["cool dark underground rock cave","inside a deep cave constant temperature"], "a deep underground cave"],
  [246.5, "ac_cave_rock", ["damp cool cave rock walls","underground stone chamber"], "cool stone walls deep underground"],
  [256.0, "ac_earth_globe", ["planet earth from space","the globe seen from orbit"], "the whole planet, a vast reservoir"],
  [262.5, "ac_soil_probe", ["soil temperature probe pushed into the ground","thermometer probe in dirt"], "a temperature probe in the soil"],
  [266.0, "ac_lab_student", ["student measuring soil in a science lab","geology student with instruments"], "a student measuring soil in a lab"],
  [269.5, "ac_usda_map", ["soil survey map document on a table","usda agricultural map paper"], "a USDA soil survey map"],
  // cmp_region ~279
  [283.5, "ac_maine_forest", ["snowy northern maine forest landscape","cold snowy pine forest north"], "a cold snowy northern forest"],
  [286.8, "ac_florida_palms", ["sunny florida palm trees blue sky","warm tropical palms in the sun"], "warm Florida palms in the sun"],
  [290.5, "ac_thermo_outdoor", ["outdoor thermometer mounted on a post","weather thermometer outside"], "an outdoor thermometer"],
  [297.5, "ac_plumber_pipe", ["plumber laying white pvc pipe","worker connecting plastic pipe"], "a plumber laying plastic pipe"],
  [301.8, "ac_pipe_interior", ["looking down the inside of a long pipe","interior of a smooth plastic pipe tunnel"], "the long interior of a buried pipe"],
  // cmp_exchange ~313
  [327.5, "ac_pipe_floor", ["pvc pipe coming up through a wooden floor","plastic pipe rising through floorboards indoors"], "the pipe coming up through the floor"],
  [331.5, "ac_earth_tube_dia", ["diagram of an earth tube cooling system","buried pipe house cooling schematic"], "an earth-tube cooling diagram"],
  [338.0, "ac_qanat", ["ancient persian qanat underground water channel","old underground tunnel channel desert"], "a Persian qanat underground channel"],
  [342.0, "ac_canada_land", ["canadian countryside green landscape","rural canada open land"], "the Canadian countryside"],
  [349.0, "ac_hvac_blueprint", ["hvac engineer reading a blueprint","building plans and technical drawings"], "an HVAC blueprint"],
  [355.0, "ac_engineer_plan", ["engineer studying technical drawings at a desk","mechanical drawings on paper"], "an engineer studying technical plans"],
  [361.5, "ac_pipe_buried2", ["pvc pipe being buried with soil shoveled over it","covering a pipe with dirt in a trench"], "a plastic pipe being buried in the ground"],
  [365.0, "ac_pipe_shade", ["pipe end coming out of the ground under a tree","plastic pipe riser in tree shade"], "the pipe's end outdoors in the shade"],
  [368.5, "ac_floor_vent2", ["metal floor vent register in a room","floor air register close up indoors"], "a floor vent indoors"],
  // ── POR QUÉ LA INDUSTRIA LO OCULTA (374–501) ──
  [374.5, "ac_ac_units_row", ["row of air conditioner units outside a building","many condenser units lined up"], "a row of air conditioner units"],
  [378.5, "ac_install_ac", ["technician installing a central air conditioner","hvac crew setting an ac condenser"], "a technician installing central air conditioning"],
  [385.0, "ac_meter_spin", ["electricity meter dial spinning fast","power meter counting usage"], "an electric meter spinning"],
  [391.5, "ac_service_ac", ["hvac technician servicing an air conditioner","repairman working on an ac unit"], "a technician servicing an air conditioner"],
  [395.0, "ac_refill_coolant", ["ac technician with refrigerant gauges","charging air conditioner with coolant gauges"], "refilling air-conditioner coolant"],
  [399.0, "ac_compressor", ["air conditioner compressor unit close up","ac compressor internal parts"], "an air-conditioner compressor"],
  [409.5, "ac_money_stack", ["stack of dollar bills cash on a table","counting money hundred dollar bills"], "a stack of money"],
  [416.5, "ac_lay_pipe_cheap", ["man laying cheap pvc pipe in a trench","placing plastic pipe into the dirt"], "a man laying cheap pipe in a trench"],
  [427.0, "ac_solar_fan_small", ["small solar panel with a fan","tiny solar panel powering a fan"], "a small solar panel and fan"],
  [433.5, "ac_lightbulb", ["a single light bulb glowing","incandescent bulb lit in the dark"], "a single glowing light bulb"],
  [437.5, "ac_fittings_pile", ["pile of pvc pipe fittings and couplings","plastic pipe connectors heap"], "a pile of pipe fittings — nothing to break"],
  [447.0, "ac_sulphur_bag", ["bag of yellow sulphur powder garden product","sack of sulphur on a shelf"], "a cheap bag of sulphur — the same secret"],
  [454.0, "ac_pest_shelf", ["pest control products on a store shelf","garden pesticide bottles in a store"], "pest-control products on a shelf"],
  [460.5, "ac_cash_hand", ["hand holding cash dollar bills","money changing hands"], "money — the recurring revenue they want"],
  [464.0, "ac_pipe_ground3", ["buried pvc pipe in the soil","plastic pipe set in a trench"], "a pipe buried once, working forever"],
  [471.0, "ac_pvc_trench2", ["white pvc pipe lying in an open trench","plastic drain pipe in the ground"], "buried PVC doing the same job"],
  [481.0, "ac_textbook", ["engineering textbook with technical diagrams","open book with mechanical drawings"], "engineering textbooks"],
  [487.5, "ac_german_house", ["modern energy efficient german house exterior","passive house modern architecture"], "a modern German eco-house"],
  [491.0, "ac_canada_build", ["new house under construction on canadian prairie","home construction site framing"], "new construction subsidized in Canada"],
  // ── MATERIALES (501–593) ──
  [504.5, "ac_hardware_pipe", ["hardware store aisle of plumbing pipe","plumbing supply store with pvc pipe"], "a hardware store aisle of pipe"],
  [508.5, "ac_pvc_stack2", ["stacks of white pvc pipe in a store","bundles of plastic pipe for sale"], "stacks of PVC pipe — the first thing you need"],
  [515.5, "ac_4inch_pipe", ["4 inch white pvc drain pipe close up","large diameter white plastic pipe"], "4-inch white PVC drain pipe"],
  [518.5, "ac_corrugated2", ["black corrugated flexible drain pipe","ribbed accordion plastic pipe"], "corrugated pipe — the wrong choice"],
  [522.0, "ac_corrugated_ribs", ["close up of ribbed corrugated pipe interior","accordion bellows pipe texture"], "the ribs inside corrugated pipe"],
  [526.0, "ac_pipe_condensation", ["water droplets condensation inside a pipe","moisture beading inside plastic tubing"], "condensation collecting inside a pipe"],
  [529.5, "ac_mold_pipe", ["mold growing inside a dark pipe","slimy mold in plastic tubing"], "mould growing inside a pipe"],
  [539.0, "ac_smooth_pipe", ["smooth interior of a white pvc pipe end","clean smooth wall plastic pipe"], "smooth-walled solid PVC pipe"],
  [543.0, "ac_pipe_sticks", ["ten foot lengths of pvc pipe stacked","sticks of plastic pipe at a store"], "ten-foot sticks of pipe"],
  // cmp_materials ~576
  [552.5, "ac_price_tag", ["price tag on hardware store pipe","store receipt and pipe"], "the low price of the pipe"],
  [559.5, "ac_6inch_pipe", ["large 6 inch diameter pvc pipe","wide plastic drain pipe"], "wider 6-inch pipe — too slow"],
  [566.0, "ac_water_pool_pipe", ["water pooling inside a pipe low spot","liquid collected in plastic tubing"], "water pooling in a pipe"],
  [569.5, "ac_4inch_again", ["4 inch pvc pipe held in hand","measuring a 4 inch plastic pipe"], "4 inches — the sweet spot"],
  [576.5, "ac_couplings", ["pvc pipe couplings and connectors","white plastic pipe joiners"], "couplings to connect the sticks"],
  [580.0, "ac_elbow_fitting", ["pvc elbow fitting close up","plastic pipe 90 degree elbow"], "an elbow fitting for the intake"],
  [583.5, "ac_floor_register", ["metal floor vent register in floorboards","indoor floor air register"], "a floor vent for the indoor end"],
  // ── PROFUNDIDAD (593–622) ──
  [593.5, "ac_deep_pit", ["very deep trench dug into the earth","tall earth walls of a deep excavation"], "a deep trench in the ground"],
  [596.5, "ac_measure_depth", ["measuring the depth of a trench with a tape","tape measure in an excavated trench"], "measuring the depth of a trench"],
  [603.5, "ac_eight_ft_trench", ["man standing in a deep trench up to shoulders","person inside a tall dug trench"], "a trench eight feet deep"],
  [610.0, "ac_bedrock", ["rocky bedrock exposed in the ground","stony soil and rock layer"], "bedrock under the soil"],
  [616.5, "ac_shallow_trench", ["shallow trench dug in a yard","a few feet deep trench in soil"], "a shallower trench that still works"],
  // ── LARGO (626–664) ──
  [626.5, "ac_long_trench", ["a very long trench stretching across a field","ninety foot trench across a yard"], "a long trench stretching across the land"],
  [630.0, "ac_pipe_long_field", ["long plastic pipe laid out across a pasture","pipe running the length of a field trench"], "pipe running ninety feet across a field"],
  [637.5, "ac_pipe_curve", ["pvc pipe laid in a curving trench","plastic pipe following a trench line"], "pipe following the trench"],
  [657.5, "ac_german_eng", ["german engineers reviewing plans on site","engineers with blueprints outdoors"], "German engineers' recommendation"],
  [661.5, "ac_amish_aerial", ["aerial view of an amish farmstead","amish farm buildings from above"], "Amish farmsteads that built this"],
  // cmp_numbers ~665
  [668.5, "ac_excavator_trench", ["mini excavator digging a long trench in a yard","compact digger cutting a trench"], "a mini excavator cutting the trench"],
  // ── EXCAVAR EL TRENCH (671–747) ──
  [672.0, "ac_operate_excavator", ["man operating a mini excavator controls","person driving a compact excavator"], "operating a mini excavator"],
  [678.5, "ac_shovel_dig", ["man digging hard with a shovel sweating","hand digging soil with a spade"], "digging by hand — the hard way"],
  [685.5, "ac_soil_pile", ["large pile of excavated dirt beside a trench","mound of dug-up soil"], "a huge pile of excavated soil"],
  [689.0, "ac_two_shovels", ["two men digging a trench with shovels","workers shoveling dirt in a ditch"], "two men with shovels"],
  [702.5, "ac_rental_yard", ["mini excavator at an equipment rental yard","compact construction machines for rent"], "a mini excavator at the rental yard"],
  [709.5, "ac_excavator_afternoon", ["excavator digging a trench in an afternoon","digger cutting a long trench quickly"], "an afternoon's work with an excavator"],
  [716.0, "ac_excavator_deep", ["excavator bucket digging a deep trench","mini digger pulling up dirt"], "the excavator digging deep"],
  [723.0, "ac_learn_excavator", ["beginner practicing on a mini excavator","first time operating a small digger"], "learning the controls on a corner of the yard"],
  [729.5, "ac_backhoe", ["backhoe digging a trench in a yard","backhoe loader excavating soil"], "a backhoe operator digging the trench"],
  [740.0, "ac_backhoe_work", ["backhoe arm digging into the ground","tractor backhoe cutting a trench"], "a backhoe at work"],
  [747.5, "ac_trench_slope", ["trench with a gentle downward slope","sloped ditch dug in the ground"], "a trench sloping gently downward"],
  // ── SLOPE + DRAIN PIT (750–812) ──
  [754.5, "ac_level_check", ["checking slope with a level on the ground","builder using a level in a trench"], "checking the slope"],
  [762.0, "ac_condensation_pipe2", ["condensation droplets on the inside of a pipe","water beading inside cool tubing"], "warm air condensing inside the cool pipe"],
  [768.5, "ac_water_inside_pipe", ["water running down the inside of a pipe","droplets sliding inside plastic tubing"], "water on the inside walls"],
  [772.0, "ac_water_pooled", ["water pooled in the low spot of a pipe","standing water inside a pipe"], "water pooling and clogging a level pipe"],
  [778.5, "ac_water_drain_pipe", ["water draining out the end of a pipe","liquid running out of a pipe end"], "water draining out a sloped pipe"],
  [782.0, "ac_gravel_pit", ["hole filled with gravel for drainage","gravel drainage pit in the ground"], "a gravel-filled drain pit"],
  [785.5, "ac_gravel_close", ["close up of drainage gravel stones","crushed stone gravel pile"], "the gravel of the drain pit"],
  [792.5, "ac_water_into_gravel", ["water soaking down into gravel","liquid seeping into stones"], "condensation seeping into the gravel"],
  [806.5, "ac_pipe_under_house", ["pvc pipe running under a house foundation","pipe beneath a building crawlspace"], "the pipe running under the house"],
  // ── INTAKE (812–860) ──
  [813.0, "ac_intake_riser", ["vertical pvc pipe coming up out of the ground","plastic pipe riser standing in a yard"], "the intake pipe rising out of the ground"],
  [820.0, "ac_pipe_under_tree", ["pipe intake standing under a shade tree","plastic pipe riser beneath a tree"], "the intake under a tree"],
  [824.0, "ac_sun_bare_ground", ["hot sun on bare open ground","sunlight beating on dry dirt"], "full sun — the wrong place for an intake"],
  [830.5, "ac_tree_shade", ["cool shaded area under a large tree","deep shade beneath a big oak"], "deep shade under a tree"],
  [833.5, "ac_barn_north", ["north shaded side of a wooden barn","shady side of a farm building"], "the shaded north side of a barn"],
  [840.5, "ac_screen_cap", ["vertical pipe with a screened cap on top","mesh cap on a plastic pipe riser"], "a screened cap on the intake"],
  [844.0, "ac_mesh_screen", ["half inch wire mesh hardware cloth screen","metal mesh screen close up"], "a half-inch mesh screen"],
  [850.5, "ac_dusty_screen", ["dusty clogged mesh screen outdoors","dirt clogged wire screen"], "a screen clogged with dust"],
  [856.5, "ac_field_mouse", ["small field mouse in the grass","little mouse outdoors close up"], "a mouse that must be kept out"],
  // ── INDOOR END (860–881) ──
  [860.5, "ac_floor_vent3", ["floor vent register set in a wooden floor","indoor air vent in floorboards"], "the indoor end through the floor"],
  [867.0, "ac_basement", ["unfinished basement interior of a house","cool concrete basement room"], "the lowest level of the house"],
  [874.5, "ac_air_sink_room", ["cool air settling into a room near the floor","airflow low in a living room"], "cold air sinking into the room"],
  // ── MOVER EL AIRE (881–1014) ──
  [884.5, "ac_room_vent", ["air vent in the floor of a living room","floor register in a home interior"], "the vent that moves the air"],
  // cmp_airflow ~888
  [892.0, "ac_smoke_rising", ["thin smoke rising slowly in still air","warm air currents visible rising"], "warm air rising, cool air sinking"],
  [902.5, "ac_open_window", ["open upstairs window with a curtain blowing","breeze moving a curtain at a window"], "warm air leaving through a high window"],
  [909.5, "ac_curtain_breeze", ["white curtain billowing in a breeze by a window","airflow lifting a curtain indoors"], "a curtain lifting in the draft"],
  [920.0, "ac_black_stack", ["tall dark chimney stack on a roof in the sun","black vent pipe on top of a house"], "a tall black vent stack heating in the sun"],
  [926.5, "ac_dark_roof_sun", ["sun heating a dark metal roof","black roof baking in sunlight"], "the sun heating the dark stack"],
  [936.5, "ac_passive_house", ["modern european passive house exterior","energy efficient home architecture"], "a passive house in Europe"],
  [943.0, "ac_amish_roof_vent", ["roof vent on an amish farmhouse","cupola vent on a country house roof"], "the vent stack on Claudio's house"],
  [949.5, "ac_cool_living", ["cool comfortable farmhouse living room","calm tidy country home interior"], "a cool, comfortable room"],
  [956.5, "ac_computer_fan", ["small computer cooling fan spinning","12 volt dc fan close up spinning"], "a small computer fan"],
  [963.5, "ac_dc_fan", ["small dc duct fan close up","compact axial fan in hand"], "a 12-volt DC fan"],
  [966.5, "ac_fan_on_pipe", ["fan mounted at the end of a duct pipe","small fan attached to a vent pipe"], "the fan at the indoor end of the pipe"],
  [970.0, "ac_solar_wall", ["small solar panel mounted on a house wall","solar panel on the south side of a home"], "a small solar panel on the house"],
  [976.5, "ac_duct_fan2", ["small inline duct booster fan","4 inch duct fan close up"], "a small 4-inch duct fan"],
  [980.5, "ac_solar_panel20", ["small 20 watt solar panel in sunlight","portable solar panel on the ground"], "a 20-watt solar panel"],
  [987.0, "ac_solar_bright", ["solar panel gleaming in bright sun","photovoltaic panel in full sunlight"], "the panel in bright sun — power when you need it"],
  [997.5, "ac_battery_charge", ["12 volt battery with a small charger","small battery and trickle charger"], "a battery on a trickle charge"],
  [1004.0, "ac_wall_outlet", ["plugging a cord into a wall outlet","electrical wall socket close up"], "a plain wall outlet"],
  [1010.5, "ac_night_light", ["small night light glowing in a dark hallway","plug-in night light at night"], "a night light — less power than the fan"],
  // cmp_system ~1017
  [1031.5, "ac_fan_spin", ["small fan spinning fast close up","duct fan blades turning"], "the optional fan running"],
  // ── QUÉ SE SIENTE (1034–1076) ──
  [1035.0, "ac_hand_reach_vent", ["hand reaching toward a floor vent","person reaching for an air register"], "a hand reaching for the vent"],
  [1041.5, "ac_hand_cool_air", ["hand feeling cool air from a floor vent","fingers in the draft of an air vent"], "feeling the cold draft from the floor"],
  [1054.5, "ac_ac_vent_blow", ["air conditioner vent blowing cold air","ac register with airflow ribbons"], "sharp, dry air conditioning"],
  [1062.0, "ac_cave_wall_damp", ["cool damp stone cave wall close up","wet stone surface underground"], "moist air that smells of cool stone"],
  [1066.0, "ac_cave_mouth", ["mouth of a cave entrance cool dark","opening of a cave into darkness"], "the mouth of a cave"],
  [1069.5, "ac_inside_cave", ["inside a narrow cool cave passage","cave tunnel cool air"], "a narrow cave that breathes cool air"],
  // [1076.6–1090.4] AV_FULL emotional
  // ── DOS ERRORES (1090–1152) ──
  // cmp_mistakes ~1095
  [1097.5, "ac_corrugated3", ["black corrugated drainage pipe coil","ribbed flexible plastic pipe"], "corrugated pipe — mistake one"],
  [1103.5, "ac_smooth_pipe2", ["smooth white solid pvc pipe","clean walled plastic drain pipe"], "smooth, solid PVC instead"],
  [1107.5, "ac_mold_in_pipe2", ["mold and slime inside a plastic pipe","dark moldy buildup in tubing"], "mould inside corrugated pipe"],
  [1121.0, "ac_level_pipe", ["a level pipe with water sitting inside","flat pipe holding standing water"], "a level pipe with no drain — mistake two"],
  [1128.0, "ac_drip_pipe", ["water dripping from the end of a pipe","droplets falling from a pipe outlet"], "condensation that must drain"],
  [1138.5, "ac_mold_vent", ["mold around a floor air vent","mildew stains near a register"], "mildew creeping up through the vent"],
  [1145.5, "ac_gravel_pit2", ["gravel drainage pit being dug","stone filled drain hole in soil"], "building the drain pit, the right way"],
  // ── MANTENIMIENTO (1152–1165) ──
  [1156.0, "ac_spring_farm", ["green farm and garden in spring","springtime country landscape"], "spring, once a year"],
  [1162.5, "ac_clean_screen", ["brushing leaves off an outdoor screen","cleaning a mesh vent cap with a brush"], "brushing the intake screen clean"],
  // ── PANORAMA (1165–1239) ──
  [1169.5, "ac_ac_buildings", ["rows of air conditioners on apartment buildings","many ac units on a building wall"], "how a country cools its houses"],
  [1176.5, "ac_cooling_towers", ["power plant cooling towers steam","electrical power station towers"], "the electricity that runs it all"],
  [1183.5, "ac_suburb_ac", ["suburban houses with outdoor ac units","neighborhood homes air conditioning"], "half the summer power in the south"],
  [1190.5, "ac_coal_plant", ["coal power plant smokestacks emitting smoke","power station burning coal"], "power burned from coal"],
  [1193.8, "ac_gas_plant", ["natural gas power plant at dusk","gas fired power station"], "power burned from gas"],
  [1197.0, "ac_solar_farm", ["large solar panel farm in a field","field of photovoltaic panels"], "or captured from sunlight"],
  [1200.8, "ac_electric_bill", ["electricity utility bill on a table","power bill paper with charges"], "the cost on your monthly bill"],
  [1207.5, "ac_smoggy_city", ["smoggy hazy city skyline","polluted air over a city"], "the consequences in the air we breathe"],
  [1211.0, "ac_kids_field", ["children playing outdoors in a green field","kids running in a meadow"], "the climate the children inherit"],
  [1215.0, "ac_old_ruins2", ["ancient stone ruins weathered","old historic stone structure"], "coolness known for two thousand years"],
  [1222.5, "ac_compressors_row", ["row of modern air conditioner compressors","many condenser units outside"], "seventy years of mechanical compressors"],
  [1229.0, "ac_heat_haze_ac", ["heat shimmering off an air conditioner unit","hot exhaust above an ac condenser"], "pumping heat back into the air"],
  [1235.5, "ac_bill_money", ["electricity bill with money on top","paying a utility bill with cash"], "paying the utility to keep it running"],
  // [1239.1–1266.2] AV_FULL philosophical
  // ── CTA FIN DE SEMANA (1266–1331) ──
  [1266.5, "ac_walk_yard", ["man walking across his backyard property","person surveying open ground in a yard"], "walking your property"],
  [1273.5, "ac_open_yard", ["open grassy area in a large backyard","empty stretch of lawn ready to dig"], "a stretch of open ground"],
  [1277.0, "ac_yard_barn", ["large backyard with a barn and open space","country property house and barn"], "the space between the house and the barn"],
  [1283.5, "ac_pipe_truck", ["loading pvc pipe into a pickup truck","plastic pipe in the back of a truck"], "ordering a hundred feet of pipe"],
  [1290.5, "ac_rental_excavator", ["mini excavator on a rental trailer","reserving a compact excavator at a rental yard"], "reserving a mini excavator"],
  [1297.0, "ac_watch_phone", ["man watching a tutorial video on a phone","person learning from a video on a smartphone"], "watching a tutorial on Friday"],
  [1303.5, "ac_dig_saturday", ["excavator digging a trench on a sunny afternoon","compact digger cutting a long trench"], "Saturday — dig the trench"],
  [1307.0, "ac_lay_pipe_trench", ["men laying pvc pipe into a trench","placing plastic pipe into the dug ditch"], "Saturday evening — lay the pipe"],
  // cmp_weekend ~1300 (replaces near here)
  [1317.5, "ac_vent_cool_hand", ["hand feeling cold air from a floor vent on a hot day","person enjoying cool air from the floor"], "Sunday — 56° air on a 90° day"],
  [1324.5, "ac_happy_cool_home", ["family relaxing in a cool comfortable home","content people in a cozy farmhouse"], "payback: the rest of your life"],
  // [1331.1–1347.9] AV_FULL comments
  // ── TEASER PRÓXIMO VIDEO (1347–1419) ──
  [1348.0, "ac_amish_community", ["amish community barn raising gathering","amish neighbors working together"], "the folks in the community already know"],
  [1354.8, "ac_weathered_hands", ["weathered old hands working with tools","calloused hands holding a tool"], "what we know, we know by hand"],
  [1358.5, "ac_stream_hill", ["clear stream flowing at the bottom of a hill","creek running through a green valley"], "a stream at the bottom of a hill"],
  [1365.0, "ac_water_tank_hill", ["water storage tank on top of a hill","elevated farm water tank"], "a tank at the top"],
  [1372.5, "ac_old_pump", ["old hand water pump in a yard","antique cast iron water pump"], "no one pumping a handle"],
  [1376.5, "ac_old_valves", ["old rusty metal pipe and valves rustic","antique plumbing valves close up"], "pipe, two valves, a bicycle inner tube"],
  [1383.5, "ac_water_trough", ["water trough on a farm filling","livestock watering trough in a pasture"], "water up to the trough"],
  [1390.5, "ac_ram_pump", ["hydraulic ram pump device by a stream","old water ram pump mechanism"], "a ram pump untouched for decades"],
  [1394.5, "ac_spring_water", ["clear spring water flowing over rocks","fresh water bubbling from the ground"], "powered only by the weight of water"],
  [1401.0, "ac_antique_diagram", ["antique engineering diagram of a pump","old patent drawing of a water device"], "known since 1796"],
  [1408.0, "ac_water_bill", ["water utility bill on a table","monthly water bill paper"], "the monthly bill they prefer you pay"],
  [1414.5, "ac_ram_pump2", ["hydraulic ram pump working by a creek","water ram pump in operation outdoors"], "the next video — the Amish water pump"],
  // [1419–TOTAL] AV_FULL sign-off

  // ── RELLENOS anti-toma-larga (rompen huecos >9s; misma estética, queries visuales) ──
  [78.5, "ac_clear_screen", ["gloved hand brushing leaves off an outdoor screen","cleaning debris from a wire mesh vent"], "brushing leaves off the intake screen"],
  [181.0, "ac_box_label", ["close up of a product box label printing","information printed on a packaging box"], "the fact not printed on the box"],
  [185.0, "ac_pasture_wide", ["wide open green pasture on a farm","empty grassy farmland under blue sky"], "your own open land"],
  [235.0, "ac_soil_thermo", ["a thermometer pushed into cool dark soil","temperature gauge in the ground"], "a thermometer reading the cool soil"],
  [239.0, "ac_season_split", ["snowy winter field then green summer field","seasons changing over a farm field"], "winter and summer, two degrees apart"],
  [250.5, "ac_cave_deep", ["deep underground cavern with cool air","large cool limestone cave chamber"], "a vast cool reservoir underground"],
  [253.5, "ac_rock_strata", ["layered rock strata in the earth","geological rock layers underground"], "rock layers holding a constant temperature"],
  [420.0, "ac_pipe_dirt2", ["white pvc pipe half buried in a dirt trench","plastic pipe resting in excavated soil"], "the pipe that costs $42"],
  [424.0, "ac_old_pipe_intact", ["an old plastic pipe still intact in the ground","weathered but solid buried pipe"], "a pipe that lasts fifty years"],
  [441.0, "ac_pipe_end_capped", ["a capped pvc pipe end close up","sealed end of a plastic pipe"], "no compressor, nothing to service"],
  [444.5, "ac_hvac_van", ["an hvac service van parked at a house","repair company truck in a driveway"], "the service technician you never call"],
  [474.5, "ac_pipe_vs_ac", ["a plastic pipe next to an air conditioner unit","cheap pipe beside an expensive ac"], "ninety percent of the job, one percent of the price"],
  [478.0, "ac_manual_closed", ["a closed technical engineering manual","thick reference book on a shelf"], "buried in the textbooks"],
  [494.5, "ac_construction_site", ["new home construction site wood framing","house being built framing stage"], "built into new construction"],
  [498.0, "ac_blueprint2", ["building blueprints spread on a table","architectural plans rolled out"], "in the building codes"],
  [533.0, "ac_moldy_corrugated", ["mold inside a ribbed corrugated pipe","slime in an accordion drain pipe"], "mould in corrugated pipe"],
  [536.5, "ac_pipe_compare", ["smooth pvc pipe beside corrugated pipe","two types of drain pipe side by side"], "smooth versus ribbed pipe"],
  [546.5, "ac_pipe_bundle", ["a bundle of pvc pipe sticks strapped together","stacked lengths of plastic pipe"], "ten sticks of pipe"],
  [550.0, "ac_pipe_cart", ["pvc pipes loaded on a hardware store cart","plastic pipe on a flatbed store trolley"], "a cart of pipe from the discount aisle"],
  [587.0, "ac_vent_install", ["installing a metal floor vent register","fitting a floor air vent into floorboards"], "fitting the floor vent"],
  [590.5, "ac_materials_ready", ["pile of pvc pipe and fittings ready to use","plumbing materials laid out on the ground"], "all the materials, forty to sixty dollars"],
  [600.0, "ac_depth_chest", ["man standing chest deep in a dug trench","person inside a deep excavated trench"], "a trench eight feet down"],
  [620.0, "ac_trench_mid", ["a medium depth trench dug in a yard","partly dug trench in the soil"], "six feet still works"],
  [623.5, "ac_cool_hand2", ["hand feeling cool air from a vent","fingers in a gentle cool draft"], "still very cold air"],
  [641.0, "ac_pipe_tape", ["tape measure stretched along a long pipe","measuring the length of plastic pipe"], "measuring the run of pipe"],
  [645.0, "ac_short_pipe", ["a short length of pvc pipe on the ground","stubby plastic pipe section"], "too short — lukewarm air"],
  [649.0, "ac_pipe_opening", ["looking into the round opening of a pipe","airflow through a pipe mouth"], "airflow through the pipe"],
  [653.0, "ac_trench_90ft", ["a long completed trench stretching across a yard","ninety foot trench dug straight"], "ninety feet — the sweet spot"],
  [692.5, "ac_tired_digger", ["exhausted man resting on a shovel in a trench","worker leaning tired on a spade"], "thirty hours of digging by hand"],
  [696.0, "ac_shovel_deep", ["shoveling dirt out of a deep trench","tossing soil from a ditch with a spade"], "moving a cubic yard an hour"],
  [699.5, "ac_excavator_unload", ["mini excavator being unloaded from a trailer","compact digger delivered on a trailer"], "renting a mini excavator"],
  [733.0, "ac_backhoe_scoop", ["backhoe bucket scooping up soil","backhoe loader digging dirt"], "a backhoe scooping the trench"],
  [736.5, "ac_high_ac_bill", ["a high electricity bill from air conditioning","shocking power bill on a table"], "cheaper than one month of AC"],
  [796.0, "ac_gravel_trickle", ["water trickling down into a gravel pit","liquid soaking into drainage stones"], "condensation into the gravel"],
  [799.5, "ac_drainpit_pipe", ["a gravel drain pit beside a pipe end","stone filled pit at the low end of a pipe"], "the drain pit at the low end"],
  [803.0, "ac_crawlspace_water", ["a puddle of water under a house crawlspace","standing water beneath a building"], "a puddle living under your house"],
  [834.5, "ac_barn_shade", ["shaded north wall of a wooden barn","cool shady side of a farm building"], "the shaded side of a barn"],
  [838.0, "ac_vertical_riser", ["a vertical pvc pipe standing in a yard","plastic pipe riser sticking up from the ground"], "the vertical intake stand"],
  [878.0, "ac_cool_basement2", ["cool air settling in a basement room","calm cool concrete basement"], "gravity pulling cool air down"],
  [881.5, "ac_air_stairs", ["cool air drifting up a staircase","airflow moving up through a house"], "distributing cool air upward"],
  [895.5, "ac_cold_falls", ["cool air falling from a floor vent into a room","cold draft sinking from a register"], "cold air falls into the room"],
  [899.0, "ac_warm_ceiling", ["warm air rising toward a ceiling","heat drifting up to the top of a room"], "warm air rising to leave"],
  [913.0, "ac_high_wall_vent", ["a high wall vent near the ceiling","upper air vent in a room"], "out through a high vent"],
  [916.5, "ac_chimney_draw", ["warm air rising up a tall chimney","draft pulling up a chimney flue"], "the chimney effect"],
  [930.0, "ac_stack_draw", ["air drawn up a tall roof vent stack","ventilation stack pulling air up"], "the stack pulls air up and out"],
  [933.5, "ac_persian_arch2", ["traditional persian wind tower architecture","middle eastern building with wind catchers"], "Persian architecture's design"],
  [990.5, "ac_fan_solar_run", ["a small fan running powered by a solar panel","dc fan spinning on solar power"], "the fan running on sun"],
  [994.0, "ac_solar_summer", ["a solar panel under a bright summer sky","photovoltaic panel in strong sunshine"], "power exactly when you need cooling"],
  [1045.0, "ac_draft_face", ["person feeling cool air on their face","someone enjoying a cool draft"], "air colder than you've ever felt indoors"],
  [1049.0, "ac_cold_vent_close", ["close up of cool air flowing from a floor vent","cold air streaming out of a register"], "cold air pouring from the floor"],
  [1111.0, "ac_turbulent_pipe", ["turbulent airflow inside a ribbed pipe","disturbed air in a corrugated tube"], "turbulence in corrugated pipe"],
  [1114.5, "ac_cracked_pipe", ["an old cracked failed plastic pipe","broken degraded drain pipe"], "a system that fails in three years"],
  [1118.0, "ac_pristine_pipe", ["a clean pristine pvc pipe in the ground","solid intact buried pipe"], "fifty years of service"],
  [1131.5, "ac_level_standing_water", ["standing water inside a level pipe","trapped water in a flat pipe"], "water trapped in a level pipe"],
  [1135.0, "ac_mildew_floor", ["mildew stains around a floor vent","mold creeping near a floor register"], "mildew rising through the vent"],
  [1149.0, "ac_slope_level_check", ["checking pipe slope with a spirit level","builder leveling a pipe in a trench"], "sloping the pipe right"],
  [1152.5, "ac_pipe_covered", ["a buried pipe being covered with soil","backfilling a trench over a pipe"], "doing it right the first time"],
  [1310.5, "ac_pipe_dusk", ["pvc pipe laid in a trench at dusk","plastic pipe in a ditch evening light"], "Saturday evening, the pipe is laid"],

  // ── INTRO con dinamismo: clips de los temas que nombra (antes era avatar fijo 30s) ──
  [112.5, "ac_beekeeping", ["beekeeper tending wooden beehives","honeybees on a honeycomb frame"], "keeping the bees alive"],
  [116.0, "ac_kitchen_flies", ["rustic farmhouse kitchen interior","flies near a kitchen window screen"], "keeping the flies out of the kitchen"],
  [119.3, "ac_wasp_nest", ["paper wasp nest under a wooden eave","wasps on a nest outdoors"], "keeping the wasps off the children"],
  [122.6, "ac_winter_fire", ["cozy wood stove fire burning in a cabin","warm fireplace in a rustic home in winter"], "how a house stays warm in winter"],
  [125.8, "ac_summer_cool", ["cool shaded farmhouse porch in summer","calm cool country house interior summer"], "cool in summer"],
  [129.2, "ac_lamp_night", ["oil lamp glowing in a dark room at night","lantern light in an amish home at night"], "lit at night"],
  [132.4, "ac_water_well", ["hand water pump drawing water on a farm","old well pump with flowing water"], "supplied with water"],
  // ── clips para los huecos que abrí al recortar los bloques de avatar ──
  [1086.5, "ac_pipe_floor_last", ["pvc pipe coming up through a house floor","floor vent over a buried pipe indoors"], "the pipe in the floor that will outlast me"],
  [1262.5, "ac_cool_house_quiet", ["quiet cozy farmhouse interior cool and calm","peaceful country home living room"], "the house stayed cool, the bill never came"],
  [1331.5, "ac_yard_survey", ["man looking out over his backyard land","person surveying open ground for a project"], "looking at your own land"],

  // ── RELLENOS de tramos largos tras componentes (ubicados FUERA de su ventana de
  // consumo ~6s para que no los coma el componente). Cortan beats que el tiling
  // estiraría a 10–25s. (mayormente imágenes IA naturales.) ──
  [63.0, "ac_f_excav2", ["mini excavator digging a trench in a backyard","compact digger cutting soil in a yard"], "the borrowed mini-excavator digging"],
  [93.5, "ac_f_roman2", ["ancient roman hypocaust stone ruins","old roman underground stone vault"], "the Romans did this"],
  [96.5, "ac_f_persian2", ["persian windcatcher tower against desert sky","traditional middle eastern wind tower"], "the Persians did it longer"],
  [277.0, "ac_f_soilmap", ["a temperature map of the united states regions","color shaded map of the usa"], "the number for your county"],
  [309.5, "ac_f_floorpipe", ["a white pipe rising up through a wooden house floor","plastic pipe entering a room through the floor"], "air comes up into the house"],
  [314.5, "ac_f_ventcool", ["cool air flowing from a floor vent in a sunlit room","floor register with airflow in a home"], "56°F air in summer"],
  [320.0, "ac_f_warmroom", ["a cozy warm farmhouse room in winter, frost on the window","warm room with frosty window outside"], "pre-warmed air in winter"],
  [324.5, "ac_f_ventfloor2", ["a metal floor vent register set in floorboards","floor air vent close up in a house"], "the same simple vent"],
  [345.5, "ac_f_qanat2", ["ancient underground qanat water tunnel","stone underground channel tunnel"], "the qanat"],
  [406.5, "ac_f_money2", ["hand counting cash dollar bills on a table","money being counted"], "thousands over the years"],
  [607.0, "ac_f_trenchdeep2", ["measuring a deep trench with a tape measure","person checking the depth of a dug trench"], "checking the depth"],
  [846.0, "ac_f_screen2", ["close up of a wire mesh screen cap on a pipe","metal mesh over a pipe opening"], "the half-inch screen"],
  [889.0, "ac_f_ventroom", ["cool air drifting from a floor vent across a room","air moving low in a living room"], "cool air filling the room"],
  [1024.0, "ac_f_drainpit2", ["a gravel drain pit at the low end of a buried pipe","stone filled drainage pit in soil"], "the drain pit"],
  [1028.0, "ac_f_floorvent3", ["a floor vent register in a wooden floor close up","indoor floor air register"], "the floor vent"],
  [1094.0, "ac_f_corrbad", ["a cracked moldy black corrugated pipe","degraded ribbed drain pipe with mold"], "corrugated pipe fails"],
  [1125.0, "ac_f_pipewater2", ["water trapped standing inside a level pipe","puddle inside a plastic pipe"], "water with nowhere to drain"],
];

CLIPS.sort((a, b) => a[0] - b[0]);

const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = Number(process.env.AC_MINGAP) || 3.4; // ~5s/clip (pacing barcos/peroxide)
const clips = [];
let lastT = -99;
for (const c of CLIPS.filter((c) => !inFull(c[0]))) {
  if (c[0] - lastT < MINGAP) continue;
  clips.push(c);
  lastT = c[0];
}

if (MODE === "match") {
  const match = clips.map(([t, name, query, concept]) => ({ name, concept, query, dur: DLDUR }));
  fs.mkdirSync("public/broll", { recursive: true });
  fs.writeFileSync("public/broll/match_acpipe.json", JSON.stringify(match, null, 2));
  console.log(`match_acpipe.json: ${match.length} clips a matchear (avatar-full: ${AV_FULL.length} bloques)`);
  process.exit(0);
}

// ── MODO BUILD: beatsheet HÍBRIDO ────────────────────────────────────────────
const have = (name) => fs.existsSync(`public/broll/${name}.mp4`);
// Estilo NATURAL puro (regla dura: SIN filtros/paleta en las imágenes IA).
const IMG_STYLE = ", realistic color photograph, natural vivid colors, sharp focus, well lit, clean, no text, no captions, no watermark, no logo";
const nClip = clips.filter((c) => have(c[1])).length;

const avStarts = AV_FULL.map(([s]) => s);
const bounds = [...clips.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;

const OV = 0.5;
const beats = clips.map(([t, name, , concept]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  if (have(name)) return { id: name, start: t, dur, kind: "raw", src: `broll/${name}.mp4`, darken: 0 };
  return { id: name, start: t, dur, kind: "raw", src: `img/${name}.png`, darken: 0, gen: { type: "image", name, prompt: concept + IMG_STYLE } };
});

// ── COLD OPEN cinematográfico (0–52s): lo más importante del video. Reemplaza los
// clips de stock genéricos por imágenes HERO a medida (luz dramática, color natural,
// SIN filtro) + golpes en pantalla (ImpactReveal/KeyPhrase) que venden el contraste
// imposible (98° afuera / 63° adentro / sin AC / sin luz) y revelan el caño como payoff.
const HERO = ", realistic color photograph, natural color, cinematic lighting, shallow depth of field, sharp focus, highly detailed, no text, no captions, no watermark, no logo";
const COLD_END = 52.1;
const hero = (id, prompt) => ({ name: id, prompt: prompt + HERO });
const COLD_OPEN = [
  { id: "ac_h_sun", start: 2.2, dur: 2.8, kind: "raw", src: "img/ac_h_sun.png", darken: 0,
    gen: { type: "image", ...hero("ac_h_sun", "a lone Amish farmer in a straw hat and suspenders walking across a sun-scorched dry pasture at high noon, brutal heat shimmer rising off the ground, harsh overhead sunlight, deep shadows, cinematic wide shot") } },
  { id: "ac_h_thermo", start: 5.0, dur: 2.5, kind: "raw", src: "img/ac_h_thermo.png", darken: 0,
    gen: { type: "image", ...hero("ac_h_thermo", "extreme macro close-up of an old analog outdoor thermometer mounted on weathered white wood, the red needle pegged near one hundred degrees, harsh direct sunlight, glare on the glass") } },
  { id: "ac_h_sweat", start: 7.5, dur: 2.5, kind: "raw", src: "img/ac_h_sweat.png", darken: 0,
    gen: { type: "image", ...hero("ac_h_sweat", "tight close-up of a weathered older farmer's face dripping with sweat, squinting against blazing sun, sunburned skin, shadow of a straw hat brim across the eyes") } },
  { id: "ac_h_coolroom", start: 10.0, dur: 3.8, kind: "raw", src: "img/ac_h_coolroom.png", darken: 0,
    gen: { type: "image", ...hero("ac_h_coolroom", "interior of a dim cool simple Amish farmhouse room, a single soft shaft of daylight through a small window, plain wooden floor and bare walls, no electronics, calm and deeply shadowed, still air") } },
  { id: "ac_h_impact1", start: 13.8, dur: 4.2, kind: "impact", image: "img/ac_h_coolroom.png",
    setup: "98° in the sun outside.", impact: "63°F inside.", impactAccent: "cold", hitAt: 1.5, boom: 0, darken: 0.42 },
  { id: "ac_h_coolroom2", start: 18.0, dur: 3.0, kind: "keyphrase", text: "No air conditioner.", src: "img/ac_h_coolroom2.png", accent: "cold", fontSize: 104,
    gen: { type: "image", ...hero("ac_h_coolroom2", "a quiet empty corner of a cool Amish farmhouse room, plain wooden chair, no appliances, soft daylight, deep shadow, minimal") } },
  { id: "ac_h_lamp", start: 21.0, dur: 3.3, kind: "keyphrase", text: "No electricity. At all.", src: "img/ac_h_lamp.png", accent: "amber", fontSize: 100,
    gen: { type: "image", ...hero("ac_h_lamp", "an oil lamp glowing softly on a wooden table in a dim Amish room at dusk, no electric lights anywhere, warm flame, long evening shadows") } },
  { id: "ac_h_vent", start: 24.3, dur: 3.7, kind: "raw", src: "img/ac_h_vent.png", darken: 0,
    gen: { type: "image", ...hero("ac_h_vent", "a small simple wooden floor vent set into a plank farmhouse floor, soft low side light, low close angle, faint dust drifting in the draft above it") } },
  { id: "ac_h_hand", start: 28.0, dur: 3.0, kind: "raw", src: "img/ac_h_hand.png", darken: 0,
    gen: { type: "image", ...hero("ac_h_hand", "a weathered hand held just above a wooden floor vent, fingers spread feeling a cool draft rising, dim quiet room, intimate close-up") } },
  { id: "ac_h_flame", start: 31.0, dur: 4.0, kind: "raw", src: "img/ac_h_flame.png", darken: 0,
    gen: { type: "image", ...hero("ac_h_flame", "a single candle flame leaning hard sideways, bent by a steady cool draft rising from a floor vent, dark room, macro, the flame is the only light") } },
  { id: "ac_h_earth", start: 35.0, dur: 3.3, kind: "raw", src: "img/ac_h_earth.png", darken: 0,
    gen: { type: "image", ...hero("ac_h_earth", "rich dark cool crumbling earth in a weathered hand, close macro, soft natural light, fresh moist soil") } },
  { id: "ac_h_impact2", start: 38.3, dur: 3.7, kind: "impact", image: "img/ac_h_pipe.png",
    setup: "The cold air comes from", impact: "a pipe in the ground.", impactAccent: "accent", hitAt: 1.6, boom: 0, darken: 0.46 },
  { id: "ac_h_pipe_src", start: 42.0, dur: 3.3, kind: "raw", src: "img/ac_h_pipe.png", darken: 0,
    gen: { type: "image", ...hero("ac_h_pipe", "a four-inch white PVC pipe buried deep at the bottom of a freshly dug trench, tall dark soil walls rising on both sides, dramatic depth looking down into the cut earth") } },
  { id: "ac_h_pipefield", start: 45.3, dur: 3.7, kind: "raw", src: "img/ac_h_pipefield.png", darken: 0,
    gen: { type: "image", ...hero("ac_h_pipefield", "a long white pipe lying in a deep trench running straight across a green pasture toward a huge old oak tree, high diagonal aerial view, warm late afternoon light") } },
  { id: "ac_h_oak", start: 49.0, dur: 3.1, kind: "raw", src: "img/ac_h_oak.png", darken: 0,
    gen: { type: "image", ...hero("ac_h_oak", "a screened vertical white pipe standing beside a weathered wooden fence in the deep shade of an enormous ancient oak tree, green pasture, peaceful") } },
];
// reemplazar los beats auto del cold-open por los HERO
for (let i = beats.length - 1; i >= 0; i--) if (beats[i].start < COLD_END - 1e-6) beats.splice(i, 1);
beats.unshift(...COLD_OPEN);
beats.sort((a, b) => a.start - b.start);

// ── COMPONENTES (valor tutorial) — DIVERSOS (no solo checklists): cross-section,
// bars, stat, process, splitlist, callout, mistake, quote, chips, nextvideo. Datos
// del guion mapeados al formato que mejor los explica. Los que llevan foto de fondo
// (checklist/callout/mistake/quote/chips) generan <id>_bg.png natural; los gráficos
// puros (cross/bars/stat/process/splitlist/nextvideo) viven sobre el grid de marca.
const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const COMPONENTS = [
  // ── física del suelo ──
  { t: 226, id: "cmp_soil", kind: "cross", hue: "cold", title: "The deeper you go", eyebrow: "Under your feet",
    layers: [
      { label: "Surface — swings every day", color: "#c9a25c", weight: 1 },
      { label: "3 ft — daily swing gone", color: "#9c7b46", weight: 1 },
      { label: "8 ft — 54–56°F all year", color: "#6c5736", weight: 1.5 },
    ], marker: { label: "the pipe", atDepth: 0.5, color: "cold" } },
  { t: 297, id: "cmp_secret", kind: "quote", hue: "amber", accent: "amber", fontSize: 92,
    text: "That is the *whole secret*. Everything else is just *plumbing*.",
    bg: "a long white pipe running through an open trench in a field" },
  { t: 279, id: "cmp_region", kind: "checklist", hue: "amber", accent: "good",
    title: "Your soil temperature", eyebrow: "USDA soil survey",
    items: [ck("Most of the US: 50–60°F"), ck("Northern Maine: ~45°F"), ck("Southern Florida: ~70°F"), ck("Colder than summer, warmer than winter")],
    bg: "rolling green farmland seen from above" },
  // componente A MEDIDA: el mecanismo animado (reemplaza unas barras genéricas)
  { t: 305, id: "cmp_howitworks", kind: "earthtube", eyebrow: "How it works", title: "Air in, cooled by the earth, air out",
    intake: { text: "95°F in", sub: "hot outside air" }, soil: { text: "Soil ~55°F", sub: "never changes, all year" },
    out: { text: "56°F out", sub: "into the house" }, depthTag: "8 ft deep", lengthTag: "90 ft long" },
  // ── costo / industria ──
  { t: 388, id: "cmp_watts", kind: "stat", hue: "red", accent: "danger",
    value: 3000, suffix: " W", label: "a central AC pulls, every hour it runs", eyebrow: "The thing they sell you" },
  { t: 406, id: "cmp_cost", kind: "bars", hue: "amber", accent: "good",
    title: "Cost over 30 years", eyebrow: "Same job — cooling a house", unit: "USD",
    bars: [{ label: "Earth tube", value: 1, display: "$42 once", sub: "+ one weekend", winner: true }, { label: "Central AC", value: 80, display: "$20–40k", sub: "install + power + service" }] },
  // ── materiales / medidas ──
  { t: 520, id: "cmp_wrongpipe", kind: "splitlist", palette: "D", cross: true,
    title: "Wrong pipe", items: ["Corrugated / ribbed pipe", "Anything flexible", "6-inch (air moves too slow)"] },
  { t: 576, id: "cmp_materials", kind: "checklist", hue: "amber", accent: "good",
    title: "What to buy", eyebrow: "≈ $40–60 total",
    items: [ck("100 ft of 4-inch solid PVC"), ck("couplings to join the sticks"), ck("one screened intake cap"), ck("one floor vent")],
    bg: "white pvc pipe and fittings on a hardware store shelf" },
  { t: 600, id: "cmp_depth", kind: "stat", hue: "cold", accent: "cold",
    value: 8, suffix: " ft", label: "deep — where the soil stops changing", eyebrow: "How deep to dig" },
  { t: 644, id: "cmp_length", kind: "bars", hue: "amber", accent: "good", unit: "°F",
    title: "Length sets the temperature", eyebrow: "Air coming out",
    bars: [{ label: "60 ft pipe", value: 75, display: "75°F", tone: "amber" }, { label: "90 ft pipe", value: 56, display: "56°F", winner: true }] },
  { t: 665, id: "cmp_numbers", kind: "process", hue: "amber", accent: "amber",
    title: "The three numbers", eyebrow: "Memorize these",
    steps: [{ title: "4-inch pipe" }, { title: "8 feet deep" }, { title: "90 feet long" }] },
  // ── excavar / pendiente / toma ──
  { t: 678, id: "cmp_dig", kind: "splitlist", palette: "G",
    title: "Three ways to dig", items: ["By hand — 30 hours (don't)", "Mini excavator — one afternoon", "Backhoe operator — $400–800"] },
  { t: 750, id: "cmp_slope", kind: "callout", hue: "amber", accent: "danger",
    figure: "1 in / 10 ft", eyebrow: "The detail folks miss", caption: "Slope it downhill — or water pools and clogs the pipe",
    bg: "a white pvc pipe sloping gently downward in a dug trench" },
  { t: 790, id: "cmp_drain", kind: "callout", hue: "amber", accent: "danger",
    figure: "Drain pit", eyebrow: "Why most builds fail", caption: "A gravel pit at the low end — the piece nobody tells you about",
    bg: "a gravel filled drainage pit beside the low end of a pipe" },
  { t: 840, id: "cmp_intake", kind: "checklist", hue: "cold", accent: "good",
    title: "The intake", eyebrow: "Outdoor end",
    items: [ck("Shaded — under a tree or north of a barn"), ck("At least 20 ft from the house"), ck("Screened cap, half-inch mesh"), ck("Keeps out leaves, mice, wasps")],
    bg: "a vertical pvc pipe with a screened cap standing in tree shade" },
  // ── mover el aire ──
  { t: 888, id: "cmp_airflow", kind: "splitlist", palette: "B",
    title: "Move the air — two ways", items: ["Passive: warm rises, cool sinks (free)", "Black vent stack boosts the pull", "Active: 12V solar fan (~$70)"] },
  { t: 976, id: "cmp_fan", kind: "stat", hue: "cold", accent: "good",
    value: 12, suffix: " W", label: "the optional fan — less than a night light", eyebrow: "Active design" },
  // ── sistema / errores / impacto ──
  // componente A MEDIDA otra vez, en modo ANATOMÍA (etiquetas de obra) para el recap
  { t: 1017, id: "cmp_anatomy", kind: "earthtube", eyebrow: "The whole system", title: "Anatomy of the build",
    intake: { text: "Shaded screened intake", sub: "½-inch mesh, 20 ft out" }, soil: { text: "4-inch solid PVC", sub: "90 ft through cool soil" },
    out: { text: "Floor vent", sub: "lowest level — cold air sinks" }, depthTag: "8 ft", lengthTag: "slope 1 in / 10 ft", drainTag: "drain pit" },
  { t: 1095, id: "cmp_mistake1", kind: "mistake", number: "1", eyebrow: "MISTAKE",
    title: "Corrugated pipe", desc: "The ribs grow mould and choke the airflow. Use smooth, solid PVC.",
    bg: "black ribbed corrugated drainage pipe close up" },
  { t: 1124, id: "cmp_mistake2", kind: "mistake", number: "2", eyebrow: "MISTAKE",
    title: "No slope, no drain pit", desc: "Condensation pools and you'll smell mildew through the vent in 18 months.",
    bg: "standing water trapped inside a level pipe" },
  { t: 1180, id: "cmp_grid", kind: "stat", hue: "red", accent: "danger",
    value: 12, suffix: "%", label: "of all US home electricity is air conditioning", eyebrow: "Where the power goes" },
  { t: 1190, id: "cmp_sources", kind: "chips", hue: "red",
    title: "And all of it has a cost", chips: ["coal", "natural gas", "uranium", "sunlight"],
    bg: "coal power plant cooling towers and smokestacks at dusk" },
  // ── CTA / cierre ──
  { t: 1300, id: "cmp_weekend", kind: "process", hue: "amber", accent: "good",
    title: "Your weekend", eyebrow: "Payback: the rest of your life",
    steps: [{ title: "Sat AM — dig the trench" }, { title: "Sat PM — lay the pipe" }, { title: "Sunday — feel 56°F air" }] },
  { t: 1414, id: "cmp_next", kind: "nextvideo", kicker: "Next Tuesday",
    title: "The 200-year-old Amish pump that moves water uphill",
    sub: "No power. No pumping. Just the weight of the water." },

  // ── MÁS COMPONENTES (cold-open + datos del guion) ──
  // (el contraste 98°/63° ahora lo da el ImpactReveal del cold-open, más fuerte que barras)
  { t: 56, id: "cmp_buildcost", kind: "callout", hue: "amber", accent: "good",
    figure: "$42", eyebrow: "Built in one weekend", caption: "what the whole pipe cost — dug with a borrowed mini-excavator",
    bg: "white pvc pipe lying beside a freshly dug trench in a field" },
  { t: 68, id: "cmp_summers", kind: "stat", hue: "amber", accent: "good",
    value: 14, suffix: " summers", label: "cooling this house — no fuel, no moving parts, nothing to break", eyebrow: "Still going" },
  { t: 88, id: "cmp_open58", kind: "stat", hue: "cold", accent: "cold",
    value: 58, suffix: "°F", label: "the air it puts into the house when it's 100° outside", eyebrow: "In August" },
  { t: 99, id: "cmp_history", kind: "timeline", eyebrow: "Nobody invented this", title: "An old, old idea",
    events: [{ year: "Romans", label: "2,000 years ago", accent: "amber" }, { year: "Persians", label: "even longer", accent: "amber" }, { year: "Amish", label: "since the 1800s", accent: "accent" }] },
  { t: 243, id: "cmp_2deg", kind: "stat", hue: "cold", accent: "cold",
    value: 2, suffix: "°F", label: "between the coldest and hottest month — 8 feet down", eyebrow: "A constant reservoir" },
  { t: 338, id: "cmp_names", kind: "splitlist", palette: "B",
    title: "Same thing, many names", items: ["Earth tube", "Persian qanat", "Canadian well", "EAHX (engineer-speak)"] },
  { t: 381, id: "cmp_install", kind: "callout", hue: "red", accent: "danger",
    figure: "$5–12k", eyebrow: "What they sell you", caption: "just to install central air — then power, service and coolant on top",
    bg: "a technician installing an outdoor central air conditioner unit" },
  { t: 399, id: "cmp_compressor", kind: "callout", hue: "red", accent: "danger",
    figure: "$2–4k", eyebrow: "Every 12–15 years", caption: "to replace the compressor when it dies — and it will",
    bg: "the internal compressor of an air conditioner condenser unit" },
  { t: 543, id: "cmp_stickprice", kind: "callout", hue: "amber", accent: "good",
    figure: "$5–9", eyebrow: "The pipe", caption: "per 10-foot stick — you need about ten of them",
    bg: "stacked ten foot lengths of white pvc pipe at a hardware store" },
  { t: 949, id: "cmp_cfm", kind: "stat", hue: "cold", accent: "good",
    value: 150, suffix: " cfm", label: "passive flow — enough to cool a 30×30 room by 10–15°", eyebrow: "No moving parts" },
  { t: 983, id: "cmp_fancost", kind: "callout", hue: "cold", accent: "good",
    figure: "$70", eyebrow: "Optional upgrade", caption: "a DC fan plus a small solar panel — runs only when the sun is out",
    bg: "a small solar panel and a dc fan on a sunny wall" },
  { t: 1156, id: "cmp_maint", kind: "callout", hue: "amber", accent: "good",
    figure: "Once a year", eyebrow: "Maintenance", caption: "brush the leaves off the intake screen — that is the entire chore",
    bg: "a gloved hand brushing leaves off an outdoor mesh screen" },
  { t: 1283, id: "cmp_order", kind: "checklist", hue: "amber", accent: "good",
    title: "Order this week", eyebrow: "Then dig Saturday",
    items: [ck("100 ft of 4-inch solid PVC"), ck("couplings + a screened cap"), ck("one floor vent"), ck("reserve a mini excavator")],
    bg: "loading lengths of white pvc pipe into a pickup truck" },
  { t: 1320, id: "cmp_payback", kind: "callout", hue: "amber", accent: "good",
    figure: "$40–100", eyebrow: "Total cost · one weekend", caption: "payback is the rest of your life",
    bg: "a hand feeling cool air from a floor vent on a hot day" },
];
let nComp = 0;
const placed = new Set(); // ids de componentes ya colocados → NO se canibalizan entre sí
for (const c of [...COMPONENTS].sort((a, b) => a.t - b.t)) {
  // último beat RAW (no componente ya colocado) en/antes de t
  let idx = -1;
  for (let i = 0; i < beats.length; i++) {
    if (beats[i].start <= c.t + 0.01) { if (!placed.has(beats[i].id)) idx = i; }
    else break;
  }
  if (idx < 0) continue;
  const start = beats[idx].start;
  const D = 6.2;
  const { t, bg, kind, ...rest } = c;
  const ab = { id: c.id, start, dur: D, kind };
  delete rest.id;
  Object.assign(ab, rest);
  if (bg) {
    ab.image = `img/${c.id}_bg.png`;
    ab.gen = { type: "image", name: `${c.id}_bg`, prompt: bg + IMG_STYLE };
  }
  // absorbe beats RAW que caen dentro de su ventana, pero NUNCA come otro componente
  let rm = 1;
  while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placed.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab);
  placed.add(c.id);
  const next = beats[idx + 1];
  const nextAv = avStarts.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
  ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + 7.5) - start).toFixed(2);
  nComp++;
}

// ── PASE FINAL DE TILING: cero pantallas vacías ──────────────────────────────
// Tras meter componentes (que capan su dur y a veces dejan huecos), estiro CADA beat
// hasta el inicio del próximo, cortando en el borde de un bloque avatar-full (ahí el
// avatar va full, no debe haber beat). Así no queda ningún hueco negro/vacío.
beats.sort((a, b) => a.start - b.start);
const avStartsAll = AV_FULL.map(([s]) => s);
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  const avAfter = avStartsAll.filter((s) => s > b.start + 1e-6).sort((x, y) => x - y)[0] ?? Infinity;
  let end = Math.min(nextStart, TOTAL);
  if (avAfter < end) end = avAfter; // no rellenar la zona del avatar full
  const ov = b.kind === "raw" ? OV : 0; // solapamiento anti-destello solo para fotos/clips
  b.dur = +(Math.max(0.2, Math.min(end + ov, TOTAL) - b.start)).toFixed(2);
}

fs.mkdirSync("beatsheet", { recursive: true });
// clipsfirst: footage real es la espina dorsal (cientos de clips) → varcheck no aplica
// el tope de raw%, pero SÍ exige variedad de tipos de componente (anti-monotonía).
fs.writeFileSync("beatsheet/acpipe.json", JSON.stringify({ video: "acpipe", avatar: "acpipe_opt.mp4", clipsfirst: true, beats }, null, 2));

// ── ventanas de avatar: full en [0,OPEN) + AV_FULL; PiP rotando el resto ──
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = [];
let k = 0;
for (let i = 0; i < beats.length; i++) {
  if (i % 6 === 3) {
    pip.push([beats[i].start, beats[i].start + Math.min(beats[i].dur, 7), POS[k % POS.length]]);
    k++;
  }
}
const firstClip = clips.length ? clips[0][0] : OPEN;
const modeAt = (t) => {
  if (t < firstClip - 1e-6) return "full";
  if (AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
  return p ? p[2] : "hidden";
};
const pts = [...new Set([0, firstClip, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = [];
let cur = null;
for (const t of pts) {
  if (t >= TOTAL - 1e-6) break;
  const m = modeAt(t);
  if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; }
}
windows.push({ start: TOTAL, mode: "hidden" });

const avTs = `// avatar_acpipe.gen.ts — GENERADO por build_acpipe.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_ACPIPE = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_acpipe.gen.ts", avTs);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0) + OPEN;
console.log(`=== build_acpipe ===`);
console.log(`beats: ${beats.length} · clips reales: ${nClip} · imágenes IA: ${beats.length - nClip} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
console.log(`dur min/max: ${beats.length ? Math.min(...beats.map((b) => b.dur)) : 0}s / ${beats.length ? Math.max(...beats.map((b) => b.dur)) : 0}s`);
