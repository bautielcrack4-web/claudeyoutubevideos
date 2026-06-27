// build_molino.mjs — CLIPS-FIRST (estilo carne/calor). NICHO: homestead/off-grid (canal claudio yoder,
// ola del ariete). Windmill water pump — "grandfather's windmill, 80 years, no power". Anclado al ms del
// Whisper (captions_molino.json, TOTAL≈1697s). Componente A MEDIDA: WindmillDiagram.
// REGLAS NUEVAS (feedback carne): avatar SOLO en esquinas (sin right/left/half), match con NO_WATERMARK=1,
// filtro clips _text≤0.30 (en el filtrado post-match, no acá). Fixes zeer: realSrc _1, gen usa QUERY.
//
//   node build_molino.mjs match  → public/broll/match_molino.json
//   node build_molino.mjs        → beatsheet/molino.json + avatar_molino.gen.ts
import fs from "fs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1697.0;
const OPEN = 1.8;
const DLDUR = 6;

const AV_FULL = [
  [119.36, 130.0],   // "If you came here today... sit down a minute with me"
  [270.81, 281.0],   // "I want you to really look at this machine"
  [393.76, 412.0],   // "water is the one absolute boundary of life"
  [1210.9, 1226.0],  // "if they are so perfect... why did we stop using them"
  [1360.0, 1392.0],  // "we traded durability for convenience... a monthly bill forever"
  [1569.0, 1617.0],  // "you buy it once... children inherit... stand here and listen"
  [1686.56, TOTAL],  // "Thank you for listening... I'll see you out in the field"
];

// [t, name, [queries], concept] — query VISUAL específica (NUNCA palabra literal del narrador).
const CLIPS = [
  // ── COLD OPEN se cubre con HERO (0–52). Clips desde ~52. ──
  [54.6, "m_windmill_old_standing", ["an old steel farm windmill standing alone in a prairie field"], "the tower has stood 80 years"],
  [60.0, "m_homestead_trees", ["an old abandoned homestead with overgrown trees"], "trees grew up and fell, the tower remains"],
  [70.0, "m_drought_cracked", ["cracked dry drought soil baking in the sun"], "through every drought"],
  [76.0, "m_blizzard_fence", ["a snow blizzard burying a farm fence"], "through every blizzard"],
  [83.0, "m_summer_heat_field", ["blistering summer heat over a farm field"], "through every blistering summer"],
  [88.0, "m_water_from_pipe", ["cold clear water pouring from an old pipe"], "pulling cold clean water up"],
  [93.0, "m_no_wires_farm", ["a farm landscape with no power lines"], "no motor, no fuel, no wire"],
  [104.6, "m_wind_grass_plains", ["wind sweeping across tall prairie grass"], "runs on the wind across the plains"],
  // (AV_FULL 119.36–130 roadmap)
  [130.5, "m_cattle_trough", ["black cattle drinking at a full water trough"], "water your animals"],
  [136.0, "m_storage_tank_farm", ["a large water storage tank on a farm"], "fill your storage tanks"],
  [142.0, "m_windmill_dusk", ["a farm windmill turning slowly at dusk"], "water that pumps itself"],
  [150.0, "m_sleeping_house", ["a quiet farmhouse at night, one light on"], "while you are asleep"],
  [158.0, "m_old_workbench", ["a weathered wooden workbench with old tools"], "sit on the bench with me"],
  // ── WHAT YOU'RE SEEING (167–413) ──
  [167.2, "m_wheel_breeze", ["a multi-blade windmill wheel turning in a light breeze"], "the wheel turning in a breeze"],
  [178.0, "m_cottonwood_leaves", ["cottonwood leaves rustling in the wind"], "underneath the rustle of leaves"],
  [184.0, "m_windmill_clank_close", ["close up of a windmill gear head clanking"], "that slow clank clank clank"],
  [190.0, "m_deep_well_dark", ["looking down into a deep dark water well"], "water coming up from the dark"],
  [200.0, "m_limestone_well", ["a limestone rock well shaft underground"], "85 feet down through limestone"],
  [211.0, "m_water_up_pipe", ["water rising inside a steel pipe"], "lifting a gallon up the line"],
  [218.0, "m_stone_tank_hill", ["a stone water cistern tank on a hill"], "toward the stone tank on the hill"],
  [230.5, "m_cattle_herd_drink", ["a herd of black cattle drinking their fill"], "water thirty head of cattle"],
  [240.0, "m_tomato_patch", ["a heirloom tomato garden being watered"], "keep the tomato patch alive"],
  [246.0, "m_kitchen_faucet", ["water running from an old kitchen faucet"], "pressure for the kitchen faucet"],
  [250.0, "m_empty_hand_no_cost", ["an open empty weathered hand"], "the cost is nothing"],
  [271.0, "m_look_up_tower", ["looking up at a tall windmill tower against the sky"], "look at this machine"],
  [286.5, "m_windmill_classic", ["a classic american multi-blade water pumping windmill"], "a water-pumping windmill"],
  [292.0, "m_wind_turbines_highway", ["giant white three-blade wind turbines in rows"], "not those modern turbines"],
  [307.0, "m_turbine_generator", ["the generator nacelle of a modern wind turbine"], "those are wind generators"],
  [315.0, "m_circuit_boards", ["complex electronic circuit boards and wires"], "packed with electronics that fail"],
  [325.0, "m_lightning_storm", ["a lightning storm over a field at night"], "fail when lightning rolls through"],
  [339.5, "m_steel_blades_wheel", ["dozens of curved galvanized steel windmill blades"], "the old multi-bladed kind"],
  [354.0, "m_windmills_horizon", ["several old windmills dotting a prairie horizon"], "dotted every horizon"],
  [362.0, "m_dry_plains_settle", ["the dry open plains of the american west"], "settled the dry plains"],
  [370.0, "m_no_creek_dry_land", ["dry land with no creek or spring in sight"], "no creek, no spring"],
  [382.0, "m_one_job_water", ["water gushing from a windmill discharge pipe"], "it does one job"],
  [393.5, "m_thirsty_livestock", ["thirsty livestock at a dry trough"], "water is the boundary of life"],
  // ── THE MECHANISM TOP-DOWN (413–600) ──
  [413.0, "m_tower_top_down", ["looking up the length of a steel windmill tower"], "from the top of the mast down"],
  [426.0, "m_wheel_eight_foot", ["a large eight foot windmill wheel close up"], "the wheel, eight feet across"],
  [435.0, "m_small_wheel_shallow", ["a small six foot windmill over a shallow well"], "six feet for shallow wells"],
  [442.0, "m_huge_wheel_deep", ["a huge twelve foot windmill wheel"], "twelve feet for deep lifts"],
  [449.0, "m_wheel_silhouette_dusk", ["a windmill wheel silhouette against a purple dusk sky"], "the rosette, the steel sunflower"],
  [467.0, "m_wind_push_blades", ["wind pushing flat against windmill blades"], "wind pushes flat against the blades"],
  [475.0, "m_blade_angle_hub", ["curved windmill blades stamped at an angle around a hub"], "every blade at a precise angle"],
  [489.5, "m_wheel_light_draft", ["a windmill wheel beginning to turn in a faint draft"], "catches the lightest draft"],
  [495.0, "m_slow_heavy_turn", ["a windmill wheel turning slow and heavy"], "slow, heavy, deliberate, like an ox"],
  [505.0, "m_heavy_water_column", ["a heavy column of water in a pipe"], "lifting water that weighs hundreds of pounds"],
  [518.5, "m_tail_fin", ["the long flat tail vane behind a windmill wheel"], "the tail fin"],
  [534.0, "m_tail_aim_wind", ["a windmill tail swinging to face the wind"], "keeps the wheel facing the wind"],
  [548.0, "m_weather_shift_clouds", ["shifting storm clouds over a farm, changing wind"], "as the weather shifts"],
  [556.0, "m_mill_head_pivot", ["the cast iron head of a windmill pivoting on its base"], "pivots the head on its turntable"],
  [566.0, "m_wheel_face_wind", ["a windmill wheel facing straight into the wind"], "always looking the wind in the eye"],
  [587.0, "m_sunflower_field", ["a field of sunflowers following the sun"], "follows the wind like a sunflower"],
  // ── THE GENIUS: GEARS/ROD/PUMP (600–1004) ──
  [600.0, "m_old_engineering", ["antique mechanical engineering of cast iron gears"], "pure engineering genius, 150 years old"],
  [616.0, "m_wheel_spinning_useless", ["a windmill wheel spinning high above the ground"], "spinning in circles is useless by itself"],
  [624.0, "m_cow_corn_water", ["a cow and a row of corn needing water"], "you cannot water a cow with circles"],
  [632.0, "m_up_down_motion", ["a mechanism converting rotation to up and down motion"], "you need it moving up and down"],
  [640.0, "m_gearbox_oil", ["a cast iron gearbox filled with thick gear oil"], "gears bathed in gear oil"],
  [653.5, "m_pitman_arm", ["a pitman arm converting rotary to vertical motion"], "translate spin into vertical movement"],
  [667.0, "m_steel_rod_long", ["a long straight steel rod"], "a long galvanized steel rod"],
  [676.0, "m_ash_wood_rod", ["a straight grained ash wood rod"], "or straight-grained ash wood"],
  [685.5, "m_rod_down_tower", ["a rod running down the center of a tower"], "the sucker rod down the tower"],
  [700.0, "m_well_casing_top", ["the top of a steel well casing at ground level"], "entering the well casing"],
  [708.0, "m_rod_into_water", ["a rod plunging down into a dark well to the water"], "plunging into the water table"],
  [714.0, "m_pump_cylinder_deep", ["a brass pump cylinder deep in a well"], "the pump cylinder underwater"],
  [724.0, "m_brass_cylinder", ["a solid brass and bronze pump cylinder"], "a brass pump cylinder"],
  [731.0, "m_leather_cups", ["leather pump cup seals close up"], "leather cup seals"],
  [742.0, "m_oiled_leather", ["oiled tanned leather rings swelling tight"], "treated leather that swells to seal"],
  [753.5, "m_pump_valves", ["the valves inside an old water pump"], "two simple valves"],
  [768.0, "m_old_hand_pump", ["an old red cast iron hand water pump"], "the same as the old hand pump"],
  [780.0, "m_pump_handle_bucket", ["working a hand pump handle to fill a bucket"], "pumping by hand to fill a bucket"],
  [796.5, "m_physics_same", ["water flowing from an old pump, simple physics"], "the exact same physics"],
  [811.5, "m_wind_does_pumping", ["a windmill working tirelessly in the wind"], "the wind does the pumping"],
  [822.0, "m_strokes_minute", ["a windmill rod stroking up and down fast"], "thirty strokes a minute"],
  [831.0, "m_rain_midnight_mill", ["a windmill turning in the rain at night"], "through rain and midnight"],
  [846.0, "m_cylinder_stroke", ["the inside of a pump cylinder lifting water"], "what happens with each stroke"],
  [860.0, "m_rod_up_lift", ["a pump rod rising, lifting water"], "the rod rises and lifts"],
  [872.0, "m_piston_valve_shut", ["a pump piston valve snapping shut"], "the valve snaps shut, lifts the column"],
  [887.0, "m_foot_valve_open", ["a foot valve drawing in fresh water"], "draws fresh water in"],
  [897.0, "m_rod_down_stroke", ["a pump rod moving down"], "the rod moves down"],
  [902.0, "m_water_trapped", ["water trapped inside a pump cylinder"], "the foot valve slams shut"],
  [914.5, "m_piston_reload", ["a pump piston resetting for the next stroke"], "reloaded and ready"],
  [930.0, "m_water_climbs_pipe", ["water climbing higher inside a steel pipe"], "the column climbs higher"],
  [940.0, "m_discharge_head", ["water spilling out a windmill discharge head"], "spills out into the tank"],
  [956.5, "m_full_mill_system", ["a complete windmill from wheel to well"], "the entire machine, five elements"],
  [979.0, "m_no_wires_simple", ["the simple mechanical guts of a windmill, no wires"], "no wires, no magnets, no capacitors"],
  [990.0, "m_old_mill_lasting", ["a hundred year old windmill still pumping"], "pumps for a hundred years"],
  [997.0, "m_burnt_electric_pump", ["a burnt out electric submersible pump"], "electric pump lasts twelve"],
  // ── THE SECRET: THE TANK (1004–1210) ──
  [1004.7, "m_real_secret_setup", ["a windmill and its storage tank together"], "the real secret of the setup"],
  [1017.0, "m_sensible_farmer", ["a weathered farmer looking at his windmill"], "what every sensible farmer asks"],
  [1029.0, "m_calm_dead_air", ["a completely still windmill on a calm day"], "what happens on a calm day"],
  [1033.0, "m_still_leaves", ["completely still leaves on a windless day"], "the air goes dead"],
  [1045.0, "m_brilliant_part", ["a high stone water cistern on a hill"], "the most brilliant part"],
  [1057.0, "m_mill_is_engine", ["a windmill head, just the engine"], "the windmill is just the engine"],
  [1068.5, "m_tank_behind_barn", ["a large water tank on a rise behind a barn"], "a massive storage tank"],
  [1076.0, "m_fieldstone_cistern", ["a hand-built fieldstone and mortar cistern"], "fieldstone cisterns"],
  [1083.0, "m_cedar_stave_tank", ["a large cedar stave water tank with iron hoops"], "cedar stave tanks"],
  [1093.0, "m_poly_tank", ["a large food-grade poly water tank"], "a modern poly tank"],
  [1103.9, "m_core_philosophy", ["water filling a large reservoir tank"], "the philosophy engineers forgot"],
  [1110.5, "m_no_batteries", ["rotting old chemical batteries"], "don't store electricity in batteries"],
  [1119.5, "m_store_water", ["a tank full of clear stored water"], "you store the water itself"],
  [1121.5, "m_good_winds_west", ["strong west winds turning a windmill"], "when the good winds blow"],
  [1132.5, "m_overflow_pipe", ["water reaching the overflow pipe of a full tank"], "piling water up to the overflow"],
  [1150.9, "m_dead_still_august", ["a hot still August day on a farm, no wind"], "August turns dead still"],
  [1160.5, "m_no_worry_water", ["a calm farmer with a full water tank"], "not a worry in the world"],
  [1166.9, "m_gravity_falling", ["water flowing downhill by gravity"], "gravity never stops working"],
  [1177.7, "m_water_down_pipes", ["water flowing through buried supply pipes"], "pushed down the supply lines"],
  [1190.0, "m_tap_full_pressure", ["water gushing from a tap with good pressure"], "out of the kitchen tap"],
  [1202.0, "m_silent_water_battery", ["a still high water tank, a silent battery"], "a battery of water and elevation"],
  // ── WHY WE STOPPED (1210–1392) ──
  [1210.9, "m_perfect_machine", ["a perfect old windmill against blue sky"], "if they are so perfect, why stop"],
  [1226.0, "m_torn_down_mill", ["a fallen broken-down old windmill"], "why did we tear them down"],
  [1232.0, "m_empty_horizon_no_mill", ["an empty prairie horizon with no windmills"], "no longer crowned with steel sunflowers"],
  [1238.6, "m_convenience_switch", ["a hand flipping a light switch"], "convenience and low upfront cost"],
  [1248.5, "m_old_power_poles", ["old creosote power poles marching across country"], "the Rural Electrification Act"],
  [1259.0, "m_power_lines_valley", ["power lines crossing a remote rural valley"], "power lines marched across the country"],
  [1269.6, "m_submersible_pump", ["a slim stainless electric submersible well pump"], "cheap electric submersible pumps"],
  [1289.0, "m_cash_upfront", ["a farmer counting out cash"], "no big cash upfront"],
  [1305.0, "m_switch_instant_water", ["instant high pressure water from a tap"], "flip a switch, instant water"],
  [1318.0, "m_pump_down_hole", ["an electric pump hidden down a well, out of sight"], "out of sight, out of mind"],
  [1330.0, "m_no_tower_yard", ["a bare farm yard with no windmill tower"], "no tall tower to look at"],
  [1336.0, "m_climb_grease_mill", ["a man climbing a windmill tower to grease it"], "no climbing to grease it once a year"],
  [1345.7, "m_trade_deal", ["two hands shaking on a deal"], "we made a collective trade"],
  [1353.0, "m_durable_vs_fragile", ["a durable iron machine beside a fragile plastic one"], "durability for convenience"],
  [1366.0, "m_lightning_kills_pump", ["lightning striking near a farm"], "burns out when lightning hits"],
  [1381.0, "m_monthly_utility_bill", ["a monthly utility water bill on a table"], "pay a monthly bill forever"],
  // ── HOW TO GET ONE (1392–1594) ──
  [1392.9, "m_break_the_cycle", ["a windmill spinning over a family farm"], "break out of that cycle"],
  [1405.5, "m_back_roads_drive", ["driving down a rural back road"], "the scavenger and restorer path"],
  [1416.0, "m_abandoned_homestead", ["an abandoned fallen farmhouse with a windmill standing"], "old abandoned homesteads"],
  [1426.0, "m_mill_overgrown_vines", ["an old windmill overgrown with grapevines and briars"], "overgrown windmill in a pasture"],
  [1435.0, "m_landowner_deal", ["a handshake with a farmer in a field"], "offer the landowner a little cash"],
  [1445.0, "m_old_casting_workshop", ["an old windmill gear head in a workshop"], "bring the casting to your shop"],
  [1455.0, "m_scrape_grease_wasp", ["scraping old grease and wasp nests off cast iron"], "scrape away 40 years of grease"],
  [1465.0, "m_old_gears_pristine", ["pristine antique gears preserved in oil"], "the gears still pristine in oil"],
  [1473.4, "m_aermotor_702", ["an antique Aermotor windmill gear head"], "an old 1930s Aermotor 702"],
  [1484.0, "m_new_leather_cups", ["a new set of leather pump cups"], "order new leather cups for thirty bucks"],
  [1492.0, "m_beef_tallow_treat", ["treating leather with tallow and oil"], "treat them with beef tallow"],
  [1500.0, "m_rebuilt_head_run", ["a rebuilt windmill head bolted together"], "a world-class engine for weekend labor"],
  [1504.2, "m_new_windmill_factory", ["a brand new galvanized windmill being made in a foundry"], "buy new from a traditional maker"],
  [1517.4, "m_new_replica_mill", ["a brand new classic american windmill"], "new replicas of the 1915 design"],
  [1528.0, "m_galvanized_steel_mill", ["thick hot-dipped galvanized steel windmill parts"], "heavy galvanized steel"],
  [1540.0, "m_bronze_bearings", ["bronze and babbitt bearings"], "babbitt or bronze bearings"],
  [1548.5, "m_cost_more_upfront", ["a price tag on quality steel craftsmanship"], "costs more up front, but"],
  [1557.3, "m_buy_once", ["a windmill standing for generations"], "you buy it once in a lifetime"],
  [1561.0, "m_pour_footings", ["pouring concrete footings for a windmill tower"], "pour the footings once, done paying"],
  [1569.9, "m_children_inherit", ["children looking up at a family windmill"], "children inherit water debt-free"],
  [1580.0, "m_blades_against_clouds", ["silver windmill blades spinning against clouds"], "great-grandchildren's secure water"],
  // (AV_FULL 1594–1610)
  [1610.5, "m_rhythmic_clank", ["a windmill gear head clanking rhythmically"], "the clank clank clank"],
  [1617.0, "m_built_to_last", ["a sturdy old machine built of iron to last"], "built to last, repaired with a wrench"],
  [1630.5, "m_asks_nothing", ["a windmill turning peacefully, asking nothing"], "asks nothing from the modern world"],
  [1636.0, "m_cold_sweet_water", ["cold sweet water from the deep ground"], "cold and sweet from the deep stone"],
  [1653.0, "m_find_old_mill_brush", ["an old windmill hidden in brush"], "find one hidden in the brush"],
  [1664.0, "m_gravity_water_line", ["a gravity-fed water line to a house and garden"], "lay out a gravity water line"],

  // ── FILLERS (densidad; queries on-topic windmill/farm/water/well) ──
  [57.0, "m_f_rusty_tower", ["a rusty weathered windmill tower close up"], "old tower"],
  [64.0, "m_f_fallen_tree", ["a fallen old tree by an abandoned farm"], "trees fell"],
  [73.0, "m_f_dust_drought", ["dust blowing over cracked drought land"], "drought"],
  [79.0, "m_f_snow_drift_farm", ["deep snow drifts over a farm"], "blizzard"],
  [85.0, "m_f_heat_haze_field", ["heat haze over a dry summer field"], "summer heat"],
  [97.0, "m_f_clear_water_hand", ["cold clear water in cupped hands"], "clean water"],
  [100.0, "m_f_open_prairie", ["wide open empty prairie under big sky"], "the plains"],
  [108.0, "m_f_grass_wind_wave", ["wind making waves through prairie grass"], "wind across the land"],
  [133.0, "m_f_full_trough", ["a stock tank full of water for cattle"], "full trough"],
  [146.0, "m_f_mill_evening", ["a windmill silhouette in golden evening light"], "mill at dusk"],
  [154.0, "m_f_quiet_farmhouse", ["a quiet farmhouse at dusk, warm windows"], "the house"],
  [172.0, "m_f_wheel_spin_slow", ["a windmill wheel spinning slowly close up"], "wheel turning"],
  [195.0, "m_f_well_shaft_dark", ["a dark stone well shaft going down"], "the dark well"],
  [205.0, "m_f_rock_strata_well", ["layered limestone rock in a well wall"], "limestone"],
  [214.0, "m_f_pipe_water_inside", ["water rising in a metal pipe interior"], "water up the pipe"],
  [224.0, "m_f_stone_cistern2", ["an old stone cistern tank"], "stone tank"],
  [235.0, "m_f_black_cattle2", ["black angus cattle in a green pasture"], "cattle"],
  [243.0, "m_f_garden_water2", ["watering a vegetable garden by hand"], "garden water"],
  [277.0, "m_f_tower_up_sky", ["looking up a windmill tower into blue sky"], "look up"],
  [298.0, "m_f_turbine_row2", ["a row of giant white wind turbines"], "turbines"],
  [320.0, "m_f_wires_tangle", ["a tangle of electronic wires and boards"], "electronics"],
  [346.0, "m_f_galv_blades", ["galvanized curved windmill blades close up"], "steel blades"],
  [358.0, "m_f_prairie_horizon", ["a prairie horizon at sunset"], "horizon"],
  [375.0, "m_f_dry_sod", ["dry cracked sod on the open plains"], "dry sod"],
  [388.0, "m_f_water_gush_pipe", ["water gushing out of a farm pipe"], "water out"],
  [420.0, "m_f_tower_legs", ["the steel angle-iron legs of a windmill tower"], "tower"],
  [431.0, "m_f_wheel_hub_close", ["the center hub of a windmill wheel"], "wheel hub"],
  [445.0, "m_f_big_wheel_low", ["a large windmill wheel seen from below"], "big wheel"],
  [460.0, "m_f_wheel_against_sky", ["a windmill wheel against bright clouds"], "wheel sky"],
  [482.0, "m_f_blade_curve_macro", ["macro of a curved steel windmill blade"], "blade"],
  [500.0, "m_f_ox_power", ["a strong working ox in a field"], "ox strength"],
  [510.0, "m_f_water_weight_pour", ["a heavy stream of water pouring"], "heavy water"],
  [525.0, "m_f_tail_vane_close", ["the painted tail vane of a windmill"], "tail"],
  [542.0, "m_f_wind_direction_clouds", ["fast clouds showing wind direction"], "shifting wind"],
  [560.0, "m_f_iron_head_mill", ["the cast iron head of a windmill"], "mill head"],
  [575.0, "m_f_wheel_face_breeze", ["a windmill facing into a steady breeze"], "facing wind"],
  [592.0, "m_f_sunflower_track", ["sunflowers turning toward the sun"], "sunflower"],
  [608.0, "m_f_cast_iron_gears", ["antique cast iron gears meshing"], "gears"],
  [628.0, "m_f_corn_rows_water", ["rows of corn needing irrigation"], "corn"],
  [646.0, "m_f_gear_oil_pour", ["pouring thick gear oil into a casting"], "gear oil"],
  [660.0, "m_f_pitman_motion", ["a pitman arm moving up and down"], "pitman"],
  [678.0, "m_f_steel_rod_long2", ["a long straight steel rod close up"], "steel rod"],
  [695.0, "m_f_rod_in_tower", ["a rod running down inside a windmill tower"], "rod down tower"],
  [704.0, "m_f_well_head_ground", ["a steel well head at ground level"], "well head"],
  [718.0, "m_f_brass_cylinder2", ["a polished brass pump cylinder"], "brass cylinder"],
  [736.0, "m_f_leather_seal", ["a leather pump seal ring"], "leather"],
  [748.0, "m_f_oil_soak_leather", ["leather soaking in oil"], "oiled"],
  [762.0, "m_f_pump_valve_close", ["a check valve inside a pump"], "valve"],
  [775.0, "m_f_handpump_red", ["an old red cast iron hand pump"], "hand pump"],
  [787.0, "m_f_pump_bucket_fill", ["a bucket filling from a hand pump"], "fill bucket"],
  [805.0, "m_f_water_simple_flow", ["simple water flowing from a spout"], "physics"],
  [817.0, "m_f_mill_tireless", ["a windmill working steadily in wind"], "tireless"],
  [827.0, "m_f_rod_fast_stroke", ["the vertical pump shaft of a windmill moving up and down, mechanical motion"], "strokes"],
  [840.0, "m_f_mill_rain_night", ["a windmill turning in night rain"], "rain night"],
  [854.0, "m_f_cylinder_inside2", ["inside a water pump cylinder"], "cylinder"],
  [867.0, "m_f_rod_rise2", ["a pump rod rising"], "rod up"],
  [880.0, "m_f_water_lift_column", ["a column of water lifting in a pipe"], "lift"],
  [892.0, "m_f_fresh_water_draw", ["fresh water drawn into a pump"], "draw"],
  [908.0, "m_f_rod_descend", ["a pump rod descending"], "rod down"],
  [922.0, "m_f_water_trapped2", ["water trapped in a cylinder"], "trapped"],
  [935.0, "m_f_water_higher_pipe", ["water rising higher in a pipe"], "climbs"],
  [948.0, "m_f_spill_tank", ["water spilling into a storage tank"], "spill"],
  [968.0, "m_f_simple_mill_parts", ["the simple iron parts of a windmill laid out"], "parts"],
  [984.0, "m_f_old_mill_pump2", ["an old windmill still pumping water"], "still pumping"],
  [1000.0, "m_f_dead_electric_pump", ["a dead corroded electric pump"], "dead pump"],
  [1012.0, "m_f_mill_tank_pair", ["a windmill beside its water tank"], "mill and tank"],
  [1024.0, "m_f_farmer_squint", ["a weathered farmer squinting at the sky"], "farmer"],
  [1038.0, "m_f_still_air_flag", ["a flag hanging dead still, no wind"], "calm"],
  [1051.0, "m_f_high_cistern", ["a high water cistern on a hill"], "cistern"],
  [1063.0, "m_f_mill_engine_head", ["just the mechanical head of a windmill"], "engine"],
  [1072.0, "m_f_big_tank_barn", ["a big water tank on a rise by a barn"], "tank"],
  [1080.0, "m_f_stone_mortar_tank", ["a fieldstone and mortar water tank"], "stone tank"],
  [1088.0, "m_f_cedar_tank2", ["a cedar stave water tank with hoops"], "cedar tank"],
  [1098.0, "m_f_poly_tank2", ["a large black poly water tank"], "poly tank"],
  [1115.0, "m_f_dead_batteries", ["old corroded chemical batteries"], "batteries"],
  [1126.0, "m_f_strong_wind_mill", ["a windmill spinning fast in strong wind"], "good winds"],
  [1140.0, "m_f_overflow_water", ["water overflowing a full tank"], "overflow"],
  [1155.0, "m_f_hot_still_day", ["a hot still day with no wind on a farm"], "August still"],
  [1170.0, "m_f_water_downhill2", ["water running downhill in a channel"], "gravity"],
  [1182.0, "m_f_buried_pipe2", ["a buried water supply pipe in a trench"], "supply pipe"],
  [1195.0, "m_f_tap_pressure2", ["water from a tap at good pressure"], "tap"],
  [1218.0, "m_f_proud_mill_sky", ["a proud windmill against a blue sky"], "perfect machine"],
  [1234.0, "m_f_broken_mill", ["a broken collapsed windmill"], "torn down"],
  [1244.0, "m_f_switch_finger", ["a finger flipping a wall switch"], "switch"],
  [1254.0, "m_f_power_poles2", ["creosote power poles in a row"], "poles"],
  [1264.0, "m_f_lines_valley2", ["power lines across a rural valley"], "lines"],
  [1278.0, "m_f_submersible2", ["a stainless submersible well pump"], "submersible"],
  [1298.0, "m_f_cash_hand2", ["a hand holding a few dollar bills"], "cash"],
  [1310.0, "m_f_water_blast_tap", ["a strong blast of water from a tap"], "instant water"],
  [1323.0, "m_f_hidden_pump_well", ["a pump hidden down a well casing"], "hidden pump"],
  [1340.0, "m_f_climb_tower2", ["a man climbing a windmill tower"], "climb"],
  [1358.0, "m_f_iron_vs_plastic", ["sturdy iron next to flimsy plastic"], "durable vs fragile"],
  [1372.0, "m_f_lightning_field2", ["lightning striking near a farm field"], "lightning"],
  [1385.0, "m_f_bill_mailbox", ["a utility bill in a rural mailbox"], "bill"],
  [1410.0, "m_f_backroad_drive2", ["driving a back road past old farms"], "back roads"],
  [1422.0, "m_f_mill_in_briars", ["an old windmill overgrown with briars"], "overgrown"],
  [1440.0, "m_f_handshake_field2", ["a handshake in a pasture"], "deal"],
  [1450.0, "m_f_old_head_shop", ["an old windmill head on a workbench"], "casting"],
  [1460.0, "m_f_scrape_iron", ["scraping rust off old cast iron"], "scrape"],
  [1478.0, "m_f_antique_gears2", ["pristine antique gears in oil"], "gears pristine"],
  [1488.0, "m_f_new_leathers2", ["new leather pump cups in hand"], "leathers"],
  [1510.0, "m_f_foundry_pour", ["a steel foundry pouring molten metal"], "foundry"],
  [1522.0, "m_f_new_mill_shiny", ["a brand new shiny galvanized windmill"], "new mill"],
  [1534.0, "m_f_galv_steel2", ["thick galvanized steel parts"], "galvanized"],
  [1545.0, "m_f_bronze_bearing2", ["a bronze bearing close up"], "bearing"],
  [1565.0, "m_f_footing_concrete", ["concrete footings poured for a tower"], "footings"],
  [1575.0, "m_f_kids_look_up_mill", ["children looking up at a windmill"], "children"],
  [1585.0, "m_f_blades_clouds2", ["silver windmill blades against clouds"], "blades clouds"],
  [1620.0, "m_f_iron_built_last", ["sturdy old iron machinery"], "built to last"],
  [1640.0, "m_f_cold_water_glass", ["a glass of cold clear well water"], "sweet water"],
  [1658.0, "m_f_mill_brush_hidden", ["an old windmill half hidden in brush"], "hidden mill"],
  [1670.0, "m_f_gravity_line_farm", ["a gravity water line running to a farmhouse"], "gravity line"],
  // fillers anti-hueco antes de bloques de avatar / tramos ralos
  [258.0, "m_f_mill_proud2", ["a proud old windmill against the sky"], "the machine"],
  [264.0, "m_f_wheel_turn3", ["a windmill wheel turning steadily"], "turning"],
  [332.0, "m_f_storm_field2", ["a storm rolling over a farm field"], "storm"],
  [400.0, "m_f_dry_trough2", ["a dry empty livestock trough"], "thirst"],
  [406.0, "m_f_water_life2", ["fresh water flowing on a farm"], "water is life"],
  [1678.0, "m_f_windmill_farewell", ["a windmill turning at golden hour over a farm"], "farewell"],
];

// COLD OPEN (1.8–52): hero images bespoke. REGLA: slots grandes = IA limpia.
const HERO = ", realistic color photograph, natural color, cinematic lighting, shallow depth of field, sharp focus, highly detailed, no text, no captions, no watermark, no logo";
const IMG_STYLE = ", realistic color photograph, natural vivid colors, sharp focus, well lit, clean, no text, no captions, no watermark, no logo";
const COLD_END = 52.0;
const hero = (id, prompt) => ({ name: id, prompt: prompt + HERO });
const COLD_OPEN = [
  { id: "m_h_raise", start: 1.8, dur: 3.6, kind: "raw", src: "img/m_h_raise.png", darken: 0,
    gen: { type: "image", ...hero("m_h_raise", "a 1940s Amish family raising a steel windmill tower on a prairie homestead, mules and ropes and a block and tackle, men in suspenders and straw hats hauling the wheel up, sepia-warm afternoon light, vintage") } },
  { id: "m_h_wheel_dusk", start: 5.4, dur: 3.4, kind: "raw", src: "img/m_h_wheel_dusk.png", darken: 0,
    gen: { type: "image", ...hero("m_h_wheel_dusk", "a multi-blade steel farm windmill wheel turning slowly against a glowing purple and orange dusk sky, silhouette, peaceful, cinematic") } },
  { id: "m_h_impact1", start: 8.8, dur: 5.0, kind: "impact", image: "img/m_h_wheel_dusk.png",
    setup: "80 years turning.", impact: "Not one power bill.", impactAccent: "amber", hitAt: 2.0, boom: 0, darken: 0.46 },
  { id: "m_h_old_mill", start: 13.8, dur: 4.2, kind: "raw", src: "img/m_h_old_mill.png", darken: 0,
    gen: { type: "image", ...hero("m_h_old_mill", "an old weathered steel windmill standing alone in a vast prairie, decades of rust and patina, deep blue sky, no power lines anywhere, lonely and proud") } },
  { id: "m_h_keyphrase", start: 18.0, dur: 4.6, kind: "keyphrase", text: "It runs on the wind.", src: "img/m_h_wind_grass.png", accent: "cold", fontSize: 100,
    gen: { type: "image", ...hero("m_h_wind_grass", "wind sweeping in waves across tall golden prairie grass under a big sky, a windmill in the distance, motion and light") } },
  { id: "m_h_water_tank", start: 22.6, dur: 4.2, kind: "raw", src: "img/m_h_water_tank.png", darken: 0,
    gen: { type: "image", ...hero("m_h_water_tank", "cold clear water pouring from a windmill pipe into a stone tank on a hill, splashing, bright daylight, the wheel turning behind") } },
  { id: "m_h_cattle", start: 26.8, dur: 4.2, kind: "raw", src: "img/m_h_cattle.png", darken: 0,
    gen: { type: "image", ...hero("m_h_cattle", "black cattle drinking from a full stock tank on a green pasture, a windmill turning in the background, warm morning light") } },
  { id: "m_h_clank", start: 31.0, dur: 4.0, kind: "raw", src: "img/m_h_clank.png", darken: 0,
    gen: { type: "image", ...hero("m_h_clank", "extreme close up of an old cast iron windmill gear head and connecting rod mid-stroke, grease and patina, mechanical detail") } },
  { id: "m_h_impact2", start: 35.0, dur: 5.0, kind: "impact", image: "img/m_h_well.png",
    setup: "85 feet down.", impact: "Lifted by wind alone.", impactAccent: "amber", hitAt: 1.9, boom: 0, darken: 0.46 },
  { id: "m_h_well", start: 40.0, dur: 4.0, kind: "raw", src: "img/m_h_well.png", darken: 0,
    gen: { type: "image", ...hero("m_h_well", "looking straight down a deep dark stone water well, a steel pipe descending into blackness, a faint reflection of water far below") } },
  { id: "m_h_claudio_bench", start: 44.0, dur: 4.0, kind: "raw", src: "img/m_h_claudio_bench.png", darken: 0,
    gen: { type: "image", ...hero("m_h_claudio_bench", "a weathered wooden workbench and old hand tools in a barn, a windmill visible through the open door in the field beyond, warm light") } },
  { id: "m_h_grandfather", start: 48.0, dur: 4.1, kind: "raw", src: "img/m_h_grandfather.png", darken: 0,
    gen: { type: "image", ...hero("m_h_grandfather", "an old faded photograph of an Amish man standing proud beside a brand new windmill in the 1940s, vintage black and white, nostalgic") } },
];

CLIPS.sort((a, b) => a[0] - b[0]);
const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = Number(process.env.MOLINO_MINGAP) || 3.2;
const clips = [];
let lastT = -99;
for (const c of CLIPS.filter((c) => !inFull(c[0]) && c[0] >= COLD_END - 1e-6)) {
  if (c[0] - lastT < MINGAP) continue;
  clips.push(c);
  lastT = c[0];
}

if (MODE === "match") {
  const match = clips.map(([t, name, query, concept]) => ({ name, concept, query, dur: DLDUR }));
  fs.mkdirSync("public/broll", { recursive: true });
  fs.writeFileSync("public/broll/match_molino.json", JSON.stringify(match, null, 2));
  console.log(`match_molino.json: ${match.length} clips (avatar-full: ${AV_FULL.length} bloques)`);
  process.exit(0);
}

// ── BUILD ──
const have = (name) => fs.existsSync(`public/broll/${name}.mp4`);
const realSrc = (name) => {
  for (const suf of ["_1", "", "_2"]) for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    if (fs.existsSync(`public/real/${name}${suf}.${ext}`)) return `real/${name}${suf}.${ext}`;
  }
  return null;
};
const nClip = clips.filter((c) => have(c[1])).length;
const avStarts = AV_FULL.map(([s]) => s);
const bounds = [...clips.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;
const OV = 0.5;
const beats = clips.map(([t, name, query, concept]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  if (have(name)) return { id: name, start: t, dur, kind: "raw", src: `broll/${name}.mp4`, darken: 0 };
  const r = realSrc(name);
  if (r) return { id: name, start: t, dur, kind: "raw", src: r, darken: 0 };
  const vq = Array.isArray(query) ? query[0] : query;
  return { id: name, start: t, dur, kind: "raw", src: `img/${name}.png`, darken: 0, gen: { type: "image", name, prompt: vq + IMG_STYLE } };
});
for (let i = beats.length - 1; i >= 0; i--) if (beats[i].start < COLD_END - 1e-6) beats.splice(i, 1);
beats.unshift(...COLD_OPEN);
beats.sort((a, b) => a.start - b.start);

// ── COMPONENTS ──
const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const COMPONENTS = [
  { t: 88, id: "cmp_open", kind: "stat", hue: "good", accent: "good",
    value: 80, suffix: " years", label: "pulling water with no motor, no fuel, no bill — it runs on the wind", eyebrow: "Still turning" },
  { t: 200, id: "cmp_welldepth", kind: "cross", hue: "cold", title: "85 feet to water", eyebrow: "Straight down",
    layers: [
      { label: "Surface — the dry sod", color: "#c9a25c", weight: 0.7 },
      { label: "Soil & clay", color: "#9c7b46", weight: 1 },
      { label: "Limestone rock", color: "#8a8a8a", weight: 1.2 },
      { label: "Water table — cold & clean", color: "#3a6ea5", weight: 1 },
    ], marker: { label: "the pump", atDepth: 0.85, color: "cold" } },
  { t: 286, id: "cmp_notturbine", kind: "splitlist", palette: "D", cross: true,
    title: "Not the modern turbine", items: ["Modern turbine: makes electricity", "Wires, batteries, circuit boards", "Old windmill: lifts water, mechanically", "Five iron parts, lasts a century"] },
  { t: 449, id: "cmp_wheelsizes", kind: "bars", hue: "amber", accent: "good", unit: "gal/hr",
    title: "Bigger wheel, more water", eyebrow: "In a steady breeze",
    bars: [{ label: "6 ft (shallow)", value: 1, display: "~75 gal", tone: "amber" }, { label: "8 ft (common)", value: 3, display: "150–300 gal", winner: true }, { label: "12 ft (deep)", value: 5, display: "500+ gal" }] },
  // componente A MEDIDA: el sistema completo
  { t: 956, id: "cmp_howitworks", kind: "windmill", eyebrow: "How it works", title: "Wind in, water up, gravity out",
    wind: { text: "Wind", sub: "turns the wheel" }, pump: { text: "Pump 85 ft down", sub: "rod strokes up & down" },
    tank: { text: "Tank on the hill", sub: "fills when wind blows" }, out: { text: "Gravity to the house", sub: "pressure, always" }, partsTag: "5 iron parts" },
  { t: 860, id: "cmp_stroke", kind: "process", hue: "cold", accent: "cold",
    title: "Each stroke of the pump", eyebrow: "Up, down, up, down",
    steps: [{ title: "Up — valve shuts, lifts the column" }, { title: "Vacuum pulls fresh water in" }, { title: "Down — foot valve traps it" }, { title: "Piston reloads, ready again" }] },
  { t: 956, id: "cmp_fiveparts", kind: "process", hue: "amber", accent: "amber",
    title: "The whole machine — 5 iron parts", eyebrow: "Clouds to bedrock",
    steps: [{ title: "Wheel — harvests the wind" }, { title: "Tail — steers it into the weather" }, { title: "Gearbox — spins into strokes" }, { title: "Rod — carries it down the tower" }, { title: "Pump — lifts the water" }] },
  { t: 989, id: "cmp_lasts", kind: "bars", hue: "amber", accent: "good", unit: "years",
    title: "How long it lasts", eyebrow: "Same job: lift water",
    bars: [{ label: "Iron windmill", value: 8, display: "100+ yrs", winner: true }, { label: "Electric pump", value: 1, display: "~12 yrs", tone: "amber" }] },
  { t: 1103, id: "cmp_storewater", kind: "callout", hue: "cold", accent: "good",
    figure: "Store water, not wind", eyebrow: "The secret", caption: "no batteries to rot — the wind fills a high tank, and gravity feeds the house even on a dead-calm day",
    bg: "a high stone water tank full to the overflow on a hill" },
  { t: 1029, id: "cmp_calmday", kind: "checklist", hue: "cold", accent: "good",
    title: "What about a calm day?", eyebrow: "Why it never runs dry",
    items: [ck("The mill fills the tank when wind blows"), ck("The tank holds 2–3 days of water"), ck("Gravity feeds the house with no wind"), ck("Build the tank bigger than you think")],
    bg: "a still windmill above a full water tank on a calm day" },
  { t: 1238, id: "cmp_whystopped", kind: "callout", hue: "red", accent: "danger",
    figure: "A monthly bill", eyebrow: "Why we tore them down", caption: "the grid + cheap electric pumps traded a free 100-year machine for convenience — and a utility bill forever",
    bg: "old power lines marching across a rural valley at dusk" },
  { t: 1353, id: "cmp_trade", kind: "splitlist", palette: "B",
    title: "The trade we didn't read", items: ["Gave: generational durability", "Got: effortless convenience", "Gave: a machine that costs $0 to run", "Got: a bill to a utility for life"] },
  { t: 1259, id: "cmp_history", kind: "process", hue: "red", accent: "danger",
    title: "How we lost them", eyebrow: "1930s–1950s",
    steps: [{ title: "Subsidized power lines reach the farms" }, { title: "Cheap electric pumps arrive" }, { title: "Low upfront cost, instant water" }, { title: "Towers torn down for scrap" }] },
  { t: 1548, id: "cmp_lifecost", kind: "bars", hue: "amber", accent: "good", unit: "USD over 30 yrs",
    title: "Cost over a lifetime", eyebrow: "Same job: lift water",
    bars: [{ label: "Iron windmill", value: 1, display: "Buy once", sub: "+ grease yearly", winner: true }, { label: "Electric pump", value: 4, display: "pump × 3 + power bills", tone: "amber" }] },
  { t: 1336, id: "cmp_grease", kind: "checklist", hue: "amber", accent: "good",
    title: "The only chore", eyebrow: "Once a year",
    items: [ck("Climb the tower on a calm day"), ck("Fresh gear oil in the head"), ck("Check the leathers"), ck("Tighten loose bolts, climb down")],
    bg: "a man greasing the gear head of a windmill on a calm day" },
  { t: 1405, id: "cmp_paths", kind: "splitlist", palette: "G",
    title: "Two ways to get one", items: ["Restore an old mill from a pasture", "Mostly a weekend of your own labor", "Or buy new from a traditional maker", "Built once, never pay for water again"] },
  { t: 1455, id: "cmp_restorecheck", kind: "checklist", hue: "amber", accent: "good",
    title: "Restoring an old mill", eyebrow: "What to check",
    items: [ck("Gears preserved in old oil — usually fine"), ck("New leather cups — about $30"), ck("Treat leathers with tallow/oil"), ck("Fresh gasket, bolt it back up")],
    bg: "an old windmill gear head opened up on a workbench" },
  { t: 1473, id: "cmp_restore", kind: "process", hue: "amber", accent: "amber",
    title: "Restore an old mill", eyebrow: "Path 1 — for a weekend's labor",
    steps: [{ title: "Find an old tower in a pasture" }, { title: "Scrape the grease, pull the head" }, { title: "Gears still pristine in oil" }, { title: "$30 leather cups, bolt it up" }] },
  { t: 1557, id: "cmp_buyonce", kind: "callout", hue: "amber", accent: "good",
    figure: "Buy it once", eyebrow: "Path 2 — new, built to last", caption: "more up front than a cheap pump — but you pour the footings once and never pay for water again",
    bg: "a brand new galvanized steel windmill against a blue sky" },
  { t: 1664, id: "cmp_next", kind: "nextvideo", kicker: "Next time",
    title: "Running water in every room — no pump, no power",
    sub: "The old gravity system, the tank on the hill, and the one trick of the land. Water that runs itself." },
];
let nComp = 0;
const placed = new Set();
for (const c of [...COMPONENTS].sort((a, b) => a.t - b.t)) {
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
  if (bg) { ab.image = `img/${c.id}_bg.png`; ab.gen = { type: "image", name: `${c.id}_bg`, prompt: bg + IMG_STYLE }; }
  let rm = 1;
  while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placed.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab);
  placed.add(c.id);
  const next = beats[idx + 1];
  const nextAv = avStarts.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
  ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + 7.5) - start).toFixed(2);
  nComp++;
}

beats.sort((a, b) => a.start - b.start);
const avStartsAll = AV_FULL.map(([s]) => s);
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  const avAfter = avStartsAll.filter((s) => s > b.start + 1e-6).sort((x, y) => x - y)[0] ?? Infinity;
  let end = Math.min(nextStart, TOTAL);
  if (avAfter < end) end = avAfter;
  const ov = b.kind === "raw" ? OV : 0;
  b.dur = +(Math.max(0.2, Math.min(end + ov, TOTAL) - b.start)).toFixed(2);
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/molino.json", JSON.stringify({ video: "molino", avatar: "molino_opt.mp4", clipsfirst: true, beats }, null, 2));

// avatar windows — REGLA NUEVA: solo ESQUINAS (sin right/left/half → evita el split media-pantalla)
const POS = ["cornerTR", "cornerBL", "cornerTL", "cornerBR"];
// avatar SIEMPRE presente: PiP en esquina en TODOS los beats post-cold-open que no sean AV_FULL,
// rotando la esquina cada ~3 beats. Oculto solo durante el cold-open (1.8–52, hero images limpias).
const inAvF = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const pip = [];
let k = 0;
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  if (b.start < COLD_END - 1e-6 || inAvF(b.start)) continue;
  const end = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  pip.push([b.start, end, POS[Math.floor(k / 3) % POS.length]]);
  k++;
}
const firstHero = COLD_OPEN.length ? COLD_OPEN[0].start : OPEN;
const modeAt = (t) => {
  if (t < firstHero - 1e-6) return "full";
  if (AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
  return p ? p[2] : "hidden";
};
const pts = [...new Set([0, firstHero, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = [];
let cur = null;
for (const t of pts) {
  if (t >= TOTAL - 1e-6) break;
  const m = modeAt(t);
  if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; }
}
windows.push({ start: TOTAL, mode: "hidden" });
const avTs = `// avatar_molino.gen.ts — GENERADO por build_molino.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_MOLINO = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_molino.gen.ts", avTs);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0) + OPEN;
console.log(`=== build_molino ===`);
console.log(`beats: ${beats.length} · clips reales: ${nClip} · img/real: ${beats.length - nClip} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP(esquinas): ${pip.length} · windows: ${windows.length}`);
console.log(`dur min/max: ${beats.length ? Math.min(...beats.map((b) => b.dur)) : 0}s / ${beats.length ? Math.max(...beats.map((b) => b.dur)) : 0}s`);
