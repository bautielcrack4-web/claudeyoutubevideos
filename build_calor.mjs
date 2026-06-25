// build_calor.mjs — CLIPS-FIRST híbrido (estilo "barcos"/"zeer"). NICHO: Amish off-grid —
// heat the whole house with ONE fire + a wall of stone (masonry heater / rocket mass heater
// / sun wall / sealing). Anclado al ms EXACTO del Whisper (captions_calor.json, TOTAL≈1972s).
// Componente A MEDIDA: MassHeaterDiagram. Fixes de zeer ya incorporados (realSrc _1, gen usa QUERY).
//
//   node build_calor.mjs match  → public/broll/match_calor.json
//   node build_calor.mjs        → beatsheet/calor.json + avatar_calor.gen.ts
import fs from "fs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1972.0;
const OPEN = 1.8;
const DLDUR = 6;

// avatar FULL en beats personales/directos/cierre. Resto = clips.
const AV_FULL = [
  [236.28, 248.5],   // "let me tell you a hard truth about the way your house is heated"
  [793.16, 805.3],   // "let me be honest with you, I will not sell you a dream"
  [1101.9, 1119.3],  // "Now hear my caution... a real fire and a real chimney"
  [1782.31, 1805.1], // "a deep and quiet peace that no furnace ever gave to any man"
  [1868.68, 1885.5], // CTA "do this tonight"
  [1962.38, TOTAL],  // sign-off "keep it plain"
];

// [t, name, [queries], concept] — query VISUAL específica (NUNCA palabra literal del narrador).
const CLIPS = [
  // ── ROADMAP / WHY FURNACES (52–236) ──
  [52.5, "c_handstove", ["hand held near a warm wood stove feeling heat"], "barely-warm stove, heat from the stone"],
  [58.0, "c_stonewall_glow", ["warm stone fireplace wall in a rustic cabin at night"], "the wall of stone radiating heat"],
  [63.5, "c_coals", ["dying embers and glowing coals in a firebox close up"], "the fire is out, the coals barely glow"],
  [69.0, "c_cozy_winter_room", ["cozy warm rustic living room with snow outside the window"], "the whole house warm through the night"],
  [76.5, "c_chimney_smoke_snow", ["smoke rising from a farmhouse chimney in deep snow"], "not magic — old wisdom"],
  [82.5, "c_old_europe_stove", ["antique tiled masonry stove in an old european home"], "how cold countries heated for centuries"],
  [89.0, "c_electric_meter2", ["electric utility meter dial spinning fast"], "a meter on your warmth"],
  [95.5, "c_build_diy_stove", ["man building a brick stove with his hands"], "you can build it yourself"],
  [103.0, "c_cob_dirt", ["hands mixing clay and straw cob by hand"], "the cheap homemade version, mostly dirt"],
  [111.5, "c_old_farmhouse_winter", ["old amish farmhouse in winter snow, smoke from chimney"], "great-grandparents, no thermostat"],
  [119.5, "c_woodpile_small", ["a neat small stack of split firewood under cover"], "warm on a fraction of the fuel"],
  [127.0, "c_fire_hands_warm", ["weathered hands warming over a small fire"], "plain things about heat we forgot"],
  [135.0, "c_antique_stove2", ["very old well-used masonry heater in a farmhouse"], "still works as it did 200 years ago"],
  [141.5, "c_no_powerlines_winter", ["a snowy rural landscape with no power lines"], "needs no electricity"],
  [146.0, "c_storm_powerline", ["power lines in a heavy snowstorm at dusk"], "cannot be shut off by a storm"],
  [150.8, "c_plan_sketch", ["hand sketching a stove plan on paper by lamplight"], "here is the plan"],
  [157.0, "c_thin_steel_stove", ["a thin black steel wood stove glowing hot"], "the stove working against you"],
  [165.0, "c_furnace_basement", ["an old furnace in a basement with ducts"], "the furnace in your house"],
  [170.9, "c_masonry_heater_hero", ["large stone masonry heater in the center of a home"], "the heart of the system"],
  [176.0, "c_stone_mass_stack", ["a great mass of stacked fieldstone"], "a mass of stone holding a day of warmth"],
  [183.8, "c_rocket_bench", ["a cob bench rocket mass heater along a wall"], "the homemade version, a couple hundred dollars"],
  [188.5, "c_dirt_wheelbarrow", ["a wheelbarrow of clay soil for building"], "mostly dirt"],
  [193.0, "c_sun_through_window", ["low winter sun pouring through a south window onto a floor"], "the winter sun heating for free"],
  [198.5, "c_drafty_window", ["cold draft visible by a frosted old window"], "the piece everybody skips"],
  [206.9, "c_chimney_creosote", ["dark creosote tar inside a chimney flue"], "the mistake that lines your chimney with fire"],
  [216.0, "c_chimney_fire", ["a chimney at night with sparks, fire risk"], "wastes half your wood"],
  [223.0, "c_simple_fix_hand", ["a hand sealing a gap around a window frame"], "so simple to avoid"],
  [229.0, "c_grandfather_hands_tools", ["weathered old hands holding simple building tools"], "built with his own two hands"],
  // ── FURNACE = TRAP (248–437) ── (AV_FULL 236–248)
  [248.8, "c_furnace_flame", ["gas furnace burner flames igniting inside"], "the furnace does one foolish thing"],
  [254.0, "c_hot_air_vent", ["hot air blowing from a floor heating vent, ribbons"], "it heats the air"],
  [258.6, "c_furnace_roar", ["a furnace blower fan spinning fast"], "it roars to life"],
  [264.0, "c_warm_air_ceiling", ["warm air rising to a ceiling, thermal currents"], "hot air shoots to the ceiling"],
  [271.0, "c_thermostat_click", ["a hand turning up a wall thermostat dial"], "the furnace cycles on and off"],
  [277.0, "c_cold_floor_feet", ["cold bare feet on a cold floor in a house"], "cold air sinks back down"],
  [286.0, "c_sieve_water", ["water pouring straight through a sieve"], "like filling a bucket through a sieve"],
  [293.0, "c_money_drain", ["dollar bills and a spinning meter"], "the money walks out of your pocket"],
  [301.8, "c_question_mark_think", ["a thoughtful older man by a window in winter"], "the question nobody asks"],
  [308.0, "c_row_furnaces", ["a row of new furnaces and heat pumps in a store"], "every furnace built to heat the air"],
  [319.4, "c_salesman_handshake", ["a salesman shaking hands selling an appliance"], "the plain answer"],
  [325.0, "c_warm_family_fire", ["a family warm together by a fire"], "not the best way to keep you warm"],
  [329.5, "c_cash_register", ["cash changing hands, recurring payment"], "the best way to keep you paying"],
  [334.0, "c_propane_tank", ["a large propane tank beside a house in snow"], "a machine that sells fuel every minute"],
  [344.5, "c_service_tech", ["an hvac technician servicing a furnace"], "a tank to fill, a part to replace"],
  [351.0, "c_invoice", ["a heating bill invoice on a table"], "that is a subscription"],
  [356.0, "c_stone_wall_built", ["a finished stone wall built by hand"], "a wall of stone you build once"],
  [363.8, "c_storm_clouds_house", ["dark storm clouds over a rural house"], "the part that should worry you"],
  [371.5, "c_frozen_night", ["a frozen rural night under a full moon, deep snow"], "the coldest night it is most likely to fail"],
  [380.5, "c_ice_powerline", ["ice-coated sagging power lines in winter"], "the ice brings the line down"],
  [384.0, "c_grid_dark_town", ["a town at night during a blackout, dark houses"], "the grid buckles"],
  [389.5, "c_propane_truck_snow", ["a propane delivery truck on a snowy road"], "the truck cannot make it up your road"],
  [400.0, "c_cold_furnace_box", ["a silent cold furnace, no flame"], "a cold steel box in the basement"],
  [411.8, "c_frozen_pipes", ["frozen burst water pipe with ice"], "the pipes at risk of freezing"],
  [417.7, "c_coat_indoors_breath", ["a person in a winter coat indoors, breath visible cold"], "wearing your coat in your living room"],
  [423.6, "c_frozen_house_ext", ["a house encased in ice and snow"], "one storm from freezing solid"],
  [430.0, "c_news_winter_storm", ["a winter storm disaster scene"], "you have seen it on the news"],
  [432.0, "c_cold_empty_home", ["a cold dim empty home in winter"], "people die of it every winter"],
  // ── THE SECRET: MASS (437–533) ──
  [437.7, "c_plain_folks_hearth", ["an old family gathered around a stone hearth"], "the plain folks never lived under that sword"],
  [447.2, "c_glowing_stone", ["a warm glowing stone radiating heat"], "their warmth came from mass"],
  [455.5, "c_stone_brick_clay", ["close up of stone, brick and clay materials"], "heat soaks into heavy things slowly"],
  [461.5, "c_warm_stone_macro", ["macro of a warm stone surface giving off heat"], "heavy things give heat back slowly"],
  [471.8, "c_steel_stove_cold", ["a black steel stove cold and dark"], "a thin steel stove, cold 20 min later"],
  [481.7, "c_thin_metal", ["thin sheet metal stove wall close up"], "nothing there to hold the warmth"],
  [492.6, "c_stone_around_fire", ["a fire surrounded by a thick mass of stone"], "a thousand pounds of stone around the fire"],
  [500.0, "c_radiant_stone_room", ["a warm stone heater radiating into a room"], "the stone radiates gentle even heat"],
  [512.8, "c_warm_vs_cold_split", ["warm cozy room versus cold drafty room"], "heat the stone, not the air"],
  [522.2, "c_stone_heater_calm", ["a calm warm masonry heater in a quiet room"], "that is the whole game"],
  // ── MASONRY HEATER (533–793) ──
  [533.4, "c_masonry_heater_tall", ["a tall traditional masonry heater stove"], "this is a masonry heater"],
  [539.6, "c_kachelofen", ["an ornate tiled german kachelofen stove"], "the kachelofen, the Russian stove"],
  [546.4, "c_russian_stove", ["a whitewashed russian masonry stove in a cottage"], "every cold place reached the same answer"],
  [554.4, "c_firebox_low", ["a low firebox at the base of a masonry stove"], "firebox down low"],
  [560.0, "c_smoke_channels", ["brick smoke channels inside a masonry heater cutaway"], "a winding maze of channels for the smoke"],
  [567.0, "c_brick_laying", ["a mason laying firebricks for a stove"], "built of a ton of brick and stone"],
  [574.6, "c_light_fierce_fire", ["lighting a bright fierce fire in a firebox"], "watch what happens when you light it"],
  [580.0, "c_roaring_fire", ["a roaring bright hot wood fire with plenty of air"], "a small fierce fast fire"],
  [585.7, "c_smolder_vs_roar", ["a smoldering smoky fire versus a roaring clean fire"], "not a smoldering smoker — fierce"],
  [596.8, "c_chimney_heat_loss", ["heat shimmer escaping a chimney top into cold sky"], "in an ordinary stove heat dies up the chimney"],
  [611.6, "c_hot_gas_maze", ["hot gases winding through brick channels glowing"], "the gases cannot go straight up"],
  [616.7, "c_maze_channels2", ["a winding brick flue maze inside a stove"], "forced back and forth through the maze"],
  [623.5, "c_stone_absorb_heat", ["stone glowing as it absorbs heat"], "the cold stone drinks the heat"],
  [629.7, "c_cool_chimney_top", ["a chimney top with barely any heat or smoke"], "the smoke leaves nearly cool"],
  [640.6, "c_efficiency_glow", ["a fully heated mass of glowing stone"], "80-90% of the energy into the stone"],
  [646.4, "c_ordinary_stove_loss", ["a thin stove losing heat up a pipe"], "an ordinary stove keeps half"],
  [649.6, "c_fire_dying_coals", ["a fire dying down to coals, left alone"], "the fire goes out and you let it"],
  [653.5, "c_warm_stone_radiate", ["a warm masonry heater radiating into a cozy home"], "radiating heat for 12-24 hours"],
  [661.0, "c_soft_warm_glow", ["soft warm glow filling a rustic room"], "soft even sun-like heat"],
  [668.4, "c_harsh_stove_heat", ["a glowing red-hot iron stove, harsh heat"], "not the harsh blast of an iron stove"],
  [679.6, "c_radiant_wall_warm", ["a warm stone wall radiating into a room"], "warmth comes out of the walls"],
  [685.4, "c_hand_flat_stone", ["a bare hand resting flat on a warm stone heater"], "lay your hand flat and hold it"],
  [691.8, "c_warm_stone_sun", ["a sun-warmed stone, warm not scalding"], "warm like a stone in the sun"],
  [696.7, "c_bench_by_stove", ["a built-in bench beside a warm masonry stove"], "benches built right into them"],
  [701.6, "c_child_reading_fire", ["a child reading leaning against a warm stove"], "children leaned on them to read"],
  [704.1, "c_grandparent_sleep", ["an old person resting beside a warm stove"], "grandparents slept beside them"],
  [707.1, "c_cat_by_fire", ["a cat curled up asleep beside a warm stove"], "the cat will not leave"],
  [709.6, "c_numbers_stove", ["a single morning fire in a clean firebox"], "the numbers you came for"],
  [714.4, "c_armful_wood", ["an armful of split firewood carried to a stove"], "one armful of wood and a match"],
  [720.0, "c_one_match", ["striking a single match to light a fire"], "one fire, not 200 furnace cycles"],
  [729.5, "c_hot_complete_burn", ["a very hot complete wood fire, clean flames"], "burns so hot it wrings out every drop"],
  [741.4, "c_small_woodpile_vs_big", ["a small woodpile next to a huge one"], "burn a third of the firewood"],
  [750.6, "c_clean_flame_nosmoke", ["a clean burning fire with almost no smoke"], "clean and hot, almost no smoke"],
  [758.8, "c_creosote_tar", ["black creosote tar buildup in a chimney"], "no creosote, the black tar"],
  [768.4, "c_safe_stove_family", ["a safe warm stove in a family home"], "one of the safest cleanest ways to burn wood"],
  [775.3, "c_old_durable_stove", ["a very old still-working masonry stove"], "it does not wear out"],
  [778.5, "c_antique_euro_stove", ["a 150 year old tiled stove still in use in europe"], "stoves laid 150 years ago"],
  [788.0, "c_heirloom_hearth", ["a beautiful old family hearth, generations"], "heats your family for a century"],
  // ── MASONRY HARD PARTS (805–880) ── (AV_FULL 793–805)
  [805.5, "c_heavy_stone_pile", ["a heavy massive pile of building stone"], "a ton or more of stone"],
  [811.0, "c_concrete_footing", ["pouring a concrete footing foundation"], "needs its own strong footing"],
  [819.6, "c_stove_center_room", ["a stove standing in the center of an open room"], "belongs in the center of the house"],
  [826.0, "c_heat_leak_wall", ["heat leaking out an exterior wall into snow"], "not against an outside wall"],
  [832.6, "c_mason_craftsman", ["a skilled mason carefully laying stove channels"], "laid by a craftsman who knows the channels"],
  [845.4, "c_build_remodel", ["a house being built or remodeled, framing"], "built when you build or remodel"],
  [854.2, "c_not_weekend", ["a long careful masonry build in progress"], "not a Saturday project"],
  [858.4, "c_renter_small_room", ["a simple modest rented room"], "if you are renting, do not lose heart"],
  [872.0, "c_determined_builder", ["one determined person building a small stove"], "one person, a couple hundred dollars"],
  // ── ROCKET MASS HEATER (880–1129) ──
  [880.7, "c_rocket_heater_full", ["a rocket mass heater with barrel and cob bench"], "this is a rocket mass heater"],
  [884.0, "c_small_chapel_stove", ["a humble homemade cob stove"], "the plain little chapel"],
  [894.0, "c_burn_hot_store", ["a hot fire feeding into a thermal mass bench"], "burn hot, store the heat, give it back slow"],
  [905.9, "c_built_from_junk", ["a stove built from a barrel and salvaged parts"], "built out of junk, cleverly"],
  [912.4, "c_jtube_feed", ["wood sticks standing upright in a J-tube feed"], "wood stands upright in the feed"],
  [922.9, "c_burn_tunnel", ["flame pulled sideways through a burn tunnel"], "the flame pulled sideways"],
  [928.0, "c_heat_riser", ["a tall insulated heat riser glowing inside a barrel"], "shoots up the insulated heat riser"],
  [934.0, "c_riser_secret", ["the glowing internal chimney of a rocket stove"], "the heat riser, the secret"],
  [940.0, "c_double_burn", ["secondary combustion, smoke catching fire"], "the smoke itself catches fire"],
  [950.0, "c_clean_secondary_flame", ["clean blue secondary flames burning gases"], "burns a second time"],
  [958.2, "c_rocket_roar", ["a rocket stove roaring like a jet"], "you can hear it roar like a far-off jet"],
  [966.7, "c_warm_exhaust_hand", ["a hand over warm smokeless stove exhaust"], "warm near-smokeless air at the far end"],
  [979.8, "c_tiny_woodpile", ["a very small pile of scrap wood and branches"], "cut the woodpile by two-thirds to ninety percent"],
  [988.3, "c_branches_scraps", ["gathering scrap branches and twigs"], "heat a winter on scraps neighbors leave to rot"],
  [994.0, "c_mass_bench_store", ["a long cob bench storing heat from a stove"], "the mass is where the warmth gets stored"],
  [1003.0, "c_exhaust_pipe_bench", ["a metal pipe running inside a cob bench under construction"], "exhaust run sideways through a bench"],
  [1017.6, "c_cob_mixing_feet", ["mixing cob with bare feet, clay sand straw"], "build the bench out of cob"],
  [1028.5, "c_clay_digging", ["digging clay soil from the ground, free"], "the oldest building material, free for the digging"],
  [1033.0, "c_warm_bench_long", ["a long low warm heated cob bench along a wall"], "a heated seat warm for hours"],
  [1047.6, "c_sleeping_shelf", ["a traditional warm sleeping shelf above a stove"], "the old warm bench, the sleeping shelf"],
  [1055.0, "c_lying_warm_bench", ["a person resting on a warm bench by a stove"], "lie there like a cat on a warm rock"],
  [1062.5, "c_armful_scrap_burn", ["a small armful of scrap wood by a rocket stove"], "one armful, an hour of burning"],
  [1071.6, "c_rocket_parts_layout", ["barrel, pipe and cob materials laid out to build"], "the whole rig: feed, riser, barrel, bench"],
  [1085.0, "c_salvaged_materials", ["salvaged free building materials in a yard"], "from materials most folks throw away"],
  [1094.3, "c_warm_cob_home", ["a warm cozy home heated by a cob rocket stove"], "deep all-day warmth on a plain budget"],
  [1110.0, "c_real_fire_chimney", ["a real wood fire and a stove chimney indoors"], "a real fire and a real chimney"],
  [1120.0, "c_careful_stove_check", ["checking a stove and clearance carefully"], "build it careful, run it careful"],
  // ── THE SUN (1129–1311) ──
  [1129.2, "c_fire_stone_heart", ["a warm stone stove at the heart of a home"], "the fire and the stone, the heart"],
  [1135.2, "c_winter_sun_field", ["bright winter sun over a snowy field"], "another source of heat, free, every clear day"],
  [1151.0, "c_sun_wasted_house", ["sunlight falling past a house in winter"], "most houses let it go to waste"],
  [1153.8, "c_sun_rays_snow", ["winter sun rays over a snowy landscape"], "and that is the sun"],
  [1157.0, "c_back_to_sunny_wall", ["a person leaning against a sunlit brick wall in winter"], "back against a south-facing wall"],
  [1166.0, "c_warm_brick_sun", ["a sunlit brick wall warm to the touch in winter"], "the wall soaked up the winter sun"],
  [1172.0, "c_january_sun_snow", ["low january sun on a snowy brick house"], "warm in January with snow on the ground"],
  [1177.0, "c_old_builders_south", ["old builders orienting a house to the south"], "the old builders knew it in their bones"],
  [1183.0, "c_south_living_room", ["a sunlit south-facing living room in winter"], "main rooms face the south"],
  [1187.0, "c_big_south_windows", ["large south-facing windows with winter sun pouring in"], "big windows on the south side"],
  [1193.0, "c_north_wall_few_windows", ["a windowless cold north wall of a house in snow"], "few windows on the cold north side"],
  [1199.0, "c_mass_wall_glass", ["a thick masonry wall just inside a sunny window"], "a heavy wall of masonry inside the glass"],
  [1208.0, "c_sun_bake_wall", ["winter sun baking a thick interior stone wall"], "the sun bakes the mass full of heat"],
  [1216.0, "c_trombe_wall", ["a trombe thermal mass wall behind glass"], "they call it a trombe wall"],
  [1229.0, "c_wall_soak_day", ["a stone wall absorbing sunlight all day"], "soaks up sunshine all day"],
  [1238.0, "c_wall_give_back_evening", ["a warm wall radiating into a room at dusk"], "gives the heat back all evening, free"],
  [1247.5, "c_sunny_winter_home", ["a bright sunlit warm home on a winter day"], "supplies a quarter to a third of the heat"],
  [1260.5, "c_sun_no_bill", ["the sun rising over a peaceful winter farm"], "the sun does not send a bill"],
  [1266.5, "c_sun_eternal", ["the bright sun in a clear winter sky"], "the oldest furnace there ever was"],
  [1280.5, "c_overhang_window", ["a roof overhang shading a window from high sun"], "an overhang above the glass"],
  [1292.0, "c_deciduous_tree_house", ["a bare deciduous tree beside a house in winter"], "a leafy tree that drops its leaves"],
  [1300.0, "c_summer_shade_winter_sun", ["the same window shaded in summer, sunlit in winter"], "sun in winter, shade in summer"],
  [1306.5, "c_low_sun_high_sun", ["diagram-free low winter sun and high summer sun"], "low winter sun, high summer sun"],
  // ── THE HEAT YOU KEEP (1311–1508) ──
  [1311.9, "c_cold_house_big_fire", ["a big fire in a still-cold drafty room"], "the piece nobody talks about"],
  [1326.0, "c_fine_stove_cold_room", ["a fine stove in a house that still feels cold"], "you will still shiver"],
  [1332.0, "c_heat_escaping_night", ["warm air escaping a house into the cold night"], "heat thrown back out as fast as you make it"],
  [1345.5, "c_plain_truth_house", ["a tight snug warm cabin in deep winter"], "the plainest truth in this video"],
  [1351.5, "c_sealed_warm_home", ["a well-sealed cozy warm home interior"], "the cheapest heat is the heat you never lose"],
  [1359.3, "c_tight_old_house", ["a tight well-kept old farmhouse in winter"], "warm because they were tight"],
  [1368.6, "c_bank_foundation_straw", ["banking straw and earth against a house foundation"], "banked earth and straw against the foundation"],
  [1382.0, "c_heavy_curtains_dusk", ["drawing heavy curtains over a window at dusk"], "heavy curtains drawn at dusk"],
  [1391.1, "c_wooden_shutters_close", ["closing wooden shutters against a winter night"], "glass is a hole, a curtain worth a small fire"],
  [1403.3, "c_stuff_cracks", ["stuffing wool and rags into a window gap"], "stuff every crack the wind comes through"],
  [1412.7, "c_low_ceiling_room", ["a cozy low-ceilinged old farmhouse room"], "low ceilings keep warmth down low"],
  [1424.6, "c_close_unused_room", ["closing the door to an unused cold room"], "closed off the rooms they were not using"],
  [1432.0, "c_snug_around_stove", ["a family living close and snug around a stove"], "lived snug around the stove"],
  [1440.6, "c_wet_hand_window", ["a wet hand held to the edge of a window for drafts"], "wet your hand around windows and doors"],
  [1459.0, "c_draft_candle_flicker", ["a candle flame bending in a draft by a window"], "cold air sneaking across your skin"],
  [1464.5, "c_heat_money_leak", ["warmth and money leaking out a gap"], "heat and money walking out"],
  [1472.8, "c_invisible_drafts", ["cold drafts around an old door frame"], "a third of your heat lost to drafts"],
  [1482.0, "c_weatherstrip_door", ["applying weather-stripping to a door"], "plug them, stuff them, weather-strip them"],
  [1495.4, "c_boat_hole_bail", ["bailing water from a leaking boat"], "heating a leaky house is bailing a leaky boat"],
  [1502.0, "c_seal_gap_first", ["sealing a gap before anything else"], "plug the hole first, always"],
  [1505.6, "c_then_fire", ["then lighting the fire in a tight room"], "then you build the fire"],
  // ── DRY WOOD SECRET (1508–1608) ──
  [1508.7, "c_split_wood_secret", ["splitting and stacking firewood neatly"], "one more secret to save wood"],
  [1519.2, "c_seasoned_wood_stack", ["a well-seasoned covered woodpile, dry split logs"], "wood split and stacked one to two years"],
  [1531.5, "c_green_wet_log", ["a freshly cut wet green log dripping"], "green wet wood is a thief and a liar"],
  [1535.3, "c_steaming_wet_wood", ["wet wood steaming and smoking in a fire"], "half the heat wasted boiling the water out"],
  [1548.0, "c_smoky_chimney_creosote", ["a smoky chimney coating tar inside"], "smoke coats the chimney with creosote"],
  [1557.3, "c_folks_backward", ["a person damping down a stove for the night"], "the part folks get backward"],
  [1561.0, "c_choke_damper", ["closing a stove damper to choke the air"], "choke it down to make it last"],
  [1573.8, "c_smoldering_waste", ["a smoldering cold dirty fire"], "a smoldering fire wastes half its heat"],
  [1586.4, "c_hot_bright_fire2", ["a hot bright clean fire with plenty of air"], "the thrifty fire is a hot one"],
  [1600.2, "c_burn_hot_store_stone", ["a hot fire feeding a stone mass"], "burn hot, burn clean, store it in stone"],
  // ── NUMBERS + SYSTEM (1608–1732) ──
  [1614.9, "c_heat_mass_not_air", ["a warm stone mass versus blowing hot air"], "heat the mass, not the air"],
  [1618.6, "c_heavy_center", ["a heavy stove in the center of a home"], "build it heavy, in the center"],
  [1623.2, "c_south_sun_shade", ["a south wall sunlit in winter, shaded in summer"], "catch the winter sun, shade in summer"],
  [1626.3, "c_dry_wood_hot", ["dry wood burning hot and clean"], "burn dry wood hot, never wet slow"],
  [1630.6, "c_seal_leaks", ["sealing leaks around a house"], "plug every leak first"],
  [1641.8, "c_whole_system_home", ["a complete warm self-heated stone home in winter"], "the whole system together"],
  [1656.0, "c_mass_heart_fire", ["a mass heater at the heart of a home, one fire"], "the mass heater at the heart"],
  [1664.4, "c_sun_wall_south2", ["a sunlit south thermal wall in winter"], "the heavy sun wall on the south"],
  [1672.0, "c_dry_wood_tight_house", ["dry wood and a tight curtained house"], "dry wood and a tight house holding the warmth"],
  [1684.6, "c_no_wire_offgrid", ["an off-grid home with no wires in winter"], "not a wire running to any of it"],
  [1687.4, "c_no_tank_no_bill", ["no propane tank, no meter, a free-heated home"], "no tank, no truck, no company to pay"],
  [1699.0, "c_neighbors_dark_cold", ["neighbors huddled in coats in a dark cold house"], "neighbors around a dead furnace"],
  [1710.0, "c_warm_stone_home_night", ["a warm glowing stone home on the coldest night"], "just another night in a house of stone"],
  [1717.0, "c_morning_warm_stove", ["a still-warm stove and wall at sunrise"], "the wall is warm when the sun comes up"],
  // ── HONEST LIMITS (1732–1805) ──
  [1737.2, "c_slow_warm_house", ["a stone house slowly warming, patient"], "does not warm in ten minutes"],
  [1743.2, "c_steady_rhythm_fire", ["tending a fire in the steady rhythm of the day"], "living by an older steadier rhythm"],
  [1757.4, "c_masonry_build_cost", ["a serious masonry stove build, labor"], "real money and real labor"],
  [1764.5, "c_woodcutting_winter", ["chopping and stacking wood for winter"], "wood to cut and dry, a fire to tend"],
  // ── (AV_FULL 1782–1805 the peace) ──
  // ── THE MISTAKE (1805–1868) ──
  [1805.3, "c_three_mistakes", ["a warm correct stove versus common mistakes"], "really three small mistakes"],
  [1816.1, "c_stove_outside_wall", ["a stove built against an exterior wall losing heat"], "mass against an outside wall"],
  [1824.0, "c_stove_center_correct", ["a stove correctly in the center of a room"], "build it in the center"],
  [1826.3, "c_smolder_mistake", ["a choked smoldering smoky fire"], "burning low to make it last"],
  [1837.3, "c_burn_hot_correct", ["a hot clean fire stored in mass"], "burn it hot and store in the mass"],
  [1846.1, "c_leaky_house_cold", ["a drafty leaky cold house"], "pouring heat into a leaky house"],
  [1855.0, "c_seal_first2", ["sealing the house before heating"], "seal the house first"],
  [1862.3, "c_charge_the_stone", ["charging up a warm mass of stone"], "charge up the stone and hold the heat"],
  // ── CTA + NEXT (1885–1972) ── (AV_FULL 1868–1885, 1962–end)
  [1888.0, "c_seal_tonight", ["sealing window leaks in the evening by lamplight"], "begin this very evening"],
  [1897.5, "c_tight_house_small_fire", ["a tight house warmed by a small fire"], "works on a house that holds its heat"],
  [1905.2, "c_almanac_book", ["an old vintage almanac handbook on a wooden table"], "the old ways written down"],
  [1916.0, "c_plans_diagrams", ["hand-drawn stove and house plans on paper"], "real plans for the mass heater and bench"],
  [1925.0, "c_offgrid_family_winter", ["an off-grid amish family warm in winter"], "kept a home warm, fed and lit off the grid"],
  [1933.0, "c_gather_one_place", ["a thick handbook gathered in one place"], "gathered into one place"],
  [1938.5, "c_dark_house_night", ["a dark farmhouse interior at night"], "next time: light in a dark house"],
  [1944.6, "c_oil_lamp_glow", ["a warm oil lamp glowing in a dark room"], "real steady working light"],
  [1948.0, "c_reading_by_lamp", ["reading and sewing by lamplight at night"], "bright enough to read and sew by"],
  [1952.0, "c_cooking_lamplight", ["cooking supper by warm lamplight"], "no electricity, no batteries, no bill"],
  [1956.0, "c_simple_lamp_things", ["a few simple lamps and plain household things"], "a few plain things"],

  // ── FILLERS (densidad anti-toma-larga; queries on-topic en los huecos) ──
  [66.0, "c_f_flames_soft", ["soft warm flames flickering low in a stove"], "warm fire low"],
  [86.0, "c_f_old_tile_stove", ["antique tiled stove detail in a european home"], "old stove detail"],
  [92.0, "c_f_meter_close", ["close up of a spinning electricity meter dial"], "meter spinning"],
  [99.0, "c_f_bricklaying2", ["hands laying bricks for a stove"], "building by hand"],
  [107.0, "c_f_cob_ball", ["a ball of clay cob held in hands"], "cob in hand"],
  [115.0, "c_f_snowy_barn", ["a snowy amish barn and farm in winter"], "winter farm"],
  [123.0, "c_f_axe_splitting", ["an axe splitting a log of firewood"], "splitting wood"],
  [131.0, "c_f_warm_window_snow", ["a warm glowing window seen from snowy outside"], "warm window"],
  [160.0, "c_f_iron_stove_glow", ["a black iron stove glowing red hot"], "hot iron stove"],
  [180.0, "c_f_stone_pile2", ["a pile of fieldstone for building"], "stone pile"],
  [186.0, "c_f_cob_bench2", ["a finished cob bench along a wall"], "cob bench"],
  [196.0, "c_f_sun_floor", ["winter sunlight on a wooden floor through a window"], "sun on floor"],
  [202.0, "c_f_frost_window2", ["frost patterns on a cold window pane"], "frosty window"],
  [211.0, "c_f_chimney_tar", ["dark tar inside a sooty chimney"], "chimney tar"],
  [219.0, "c_f_sparks_night", ["sparks rising from a chimney at night"], "chimney sparks"],
  [233.0, "c_f_old_hands_wood", ["weathered hands stacking firewood"], "old hands wood"],
  [252.0, "c_f_vent_ribbons", ["hot air ribbons rising from a heat vent"], "vent air"],
  [260.0, "c_f_ceiling_warm", ["warm air gathering near a high ceiling"], "warm ceiling"],
  [268.0, "c_f_furnace_cycle", ["a furnace blower kicking on, dust in the light"], "furnace cycle"],
  [281.0, "c_f_cold_window_draft", ["a cold draft by a window, sheer curtain moving"], "cold draft"],
  [290.0, "c_f_bills_pile2", ["a pile of utility bills on a kitchen table"], "bills pile"],
  [298.0, "c_f_empty_wallet", ["an empty wallet and a few coins"], "empty wallet"],
  [314.0, "c_f_heatpump_row", ["rows of new heat pumps in a showroom"], "heat pumps"],
  [324.0, "c_f_salesman2", ["a salesman gesturing over a brochure"], "salesman"],
  [340.0, "c_f_propane_gauge", ["a propane tank gauge and regulator close up"], "propane gauge"],
  [348.0, "c_f_tech_tools", ["an hvac technician's tools and gauges"], "tech tools"],
  [359.0, "c_f_stone_wall_done", ["a finished dry-stone wall built by hand"], "stone wall done"],
  [367.0, "c_f_storm_dusk", ["heavy storm clouds over a farm at dusk"], "storm dusk"],
  [376.0, "c_f_frozen_moon", ["a frozen field under a cold full moon"], "frozen night"],
  [387.0, "c_f_blackout_candle", ["a candle lit in a dark powerless house"], "blackout candle"],
  [394.0, "c_f_snowy_road_block", ["a rural road blocked with deep snow"], "blocked road"],
  [406.0, "c_f_dark_basement", ["a dark cold basement with a silent furnace"], "dark basement"],
  [415.0, "c_f_ice_on_pipe", ["ice forming on an interior water pipe"], "icy pipe"],
  [421.0, "c_f_breath_cold_room", ["visible breath in a cold indoor room"], "cold breath"],
  [427.0, "c_f_icy_house2", ["icicles hanging from a frozen house roof"], "icy house"],
  [443.0, "c_f_old_hearth2", ["an old family stone hearth, warm"], "old hearth"],
  [451.0, "c_f_glowing_brick", ["a single warm glowing brick"], "glowing brick"],
  [459.0, "c_f_clay_lump", ["a lump of clay and earth in hand"], "clay lump"],
  [467.0, "c_f_warm_surface", ["macro of a warm radiating stone surface"], "warm surface"],
  [477.0, "c_f_cold_metal2", ["cold dark sheet metal of a stove"], "cold metal"],
  [488.0, "c_f_stove_dark2", ["a black wood stove cold with no fire"], "dark stove"],
  [496.0, "c_f_fire_in_stone", ["a fire glowing inside a thick stone surround"], "fire in stone"],
  [506.0, "c_f_warm_room_glow", ["warm even light filling a rustic room"], "warm room"],
  [511.0, "c_f_hands_warm_stove", ["hands warming against a stone heater"], "hands warm"],
  [528.0, "c_f_calm_stove2", ["a calm warm stove glowing in a quiet room"], "calm stove"],
  [543.0, "c_f_tiled_stove2", ["an ornate tiled masonry stove"], "tiled stove"],
  [550.0, "c_f_russian_stove2", ["a whitewashed russian stove in a cottage"], "russian stove"],
  [563.0, "c_f_firebrick", ["stacked firebricks for a stove firebox"], "firebrick"],
  [570.0, "c_f_brick_channels", ["brick smoke channels in a cutaway"], "brick channels"],
  [591.0, "c_f_roaring_clean", ["a bright roaring clean fire, plenty of air"], "roaring fire"],
  [603.0, "c_f_chimney_shimmer", ["heat shimmer rising off a chimney top"], "chimney shimmer"],
  [609.0, "c_f_wasted_roof_heat", ["warm air escaping a cold rooftop"], "wasted roof heat"],
  [620.0, "c_f_hot_gas_glow", ["hot glowing gases in a brick flue"], "hot gas glow"],
  [626.0, "c_f_stone_warming", ["stone slowly warming and glowing"], "stone warming"],
  [635.0, "c_f_cool_smoke", ["a faint cool wisp of smoke from a chimney"], "cool smoke"],
  [644.0, "c_f_full_mass_glow", ["a fully heated glowing stone mass"], "mass glow"],
  [658.0, "c_f_radiate_room2", ["a warm heater radiating into a cozy home"], "radiate room"],
  [664.0, "c_f_soft_light_room", ["soft warm light in a snug winter room"], "soft light"],
  [674.0, "c_f_red_hot_iron", ["a glowing red-hot iron stove"], "red hot iron"],
  [682.0, "c_f_warm_wall2", ["a warm radiant stone wall in a room"], "warm wall"],
  [688.0, "c_f_hand_on_warm", ["a hand resting on a warm stove face"], "hand on warm"],
  [716.0, "c_f_morning_fire2", ["a single morning fire in a firebox"], "morning fire"],
  [724.0, "c_f_match_strike", ["striking a match in the dark"], "match strike"],
  [735.0, "c_f_clean_hot_burn", ["a very hot clean complete wood fire"], "clean burn"],
  [746.0, "c_f_woodpile_compare", ["a tiny woodpile beside a huge woodpile"], "wood compare"],
  [754.0, "c_f_no_smoke_chimney", ["a chimney with almost no smoke"], "no smoke"],
  [764.0, "c_f_safe_warm_home2", ["a safe warm family home with a stove"], "safe home"],
  [783.0, "c_f_old_stove_europe", ["a 150 year old tiled stove still in use"], "old euro stove"],
  [810.0, "c_f_footing_pour", ["pouring a concrete footing"], "footing"],
  [824.0, "c_f_center_stove2", ["a stove in the open center of a room"], "center stove"],
  [840.0, "c_f_mason_channels", ["a mason carefully laying internal stove channels"], "mason channels"],
  [851.0, "c_f_remodel_frame", ["a house being framed during a remodel"], "remodel"],
  [866.0, "c_f_modest_room2", ["a simple modest rented room interior"], "modest room"],
  [900.0, "c_f_cob_stove_diy", ["a homemade cob stove being built"], "cob stove diy"],
  [918.0, "c_f_wood_upright", ["wood sticks standing upright in a feed tube"], "wood upright"],
  [930.0, "c_f_riser_glow2", ["a glowing insulated heat riser in a barrel"], "riser glow"],
  [946.0, "c_f_secondary_flame", ["clean blue secondary combustion flames"], "secondary flame"],
  [974.0, "c_f_warm_exhaust2", ["a hand over warm smokeless exhaust"], "warm exhaust"],
  [985.0, "c_f_branches_pile", ["a pile of scrap branches and twigs"], "branches"],
  [999.0, "c_f_bench_pipe2", ["a pipe running inside a cob bench"], "bench pipe"],
  [1010.0, "c_f_cob_pack", ["packing cob over a bench by hand"], "cob pack"],
  [1024.0, "c_f_clay_dig2", ["digging clay from the ground"], "clay dig"],
  [1040.0, "c_f_warm_bench_sit", ["someone sitting warm on a cob bench"], "warm bench sit"],
  [1050.0, "c_f_sleep_shelf2", ["a warm sleeping shelf above a stove"], "sleep shelf"],
  [1066.0, "c_f_rocket_burn2", ["a rocket stove burning with a roar"], "rocket burn"],
  [1080.0, "c_f_barrel_top", ["the top of a rocket stove barrel radiating heat"], "barrel top"],
  [1090.0, "c_f_salvage_yard", ["salvaged free building materials"], "salvage"],
  [1112.0, "c_f_stove_clearance", ["checking clearance around a wood stove"], "clearance"],
  [1124.0, "c_f_careful_fire", ["tending a fire carefully"], "careful fire"],
  [1143.0, "c_f_winter_sun_rays", ["bright winter sun rays over snow"], "sun rays"],
  [1162.0, "c_f_sunlit_brick", ["a sunlit brick wall warm in winter"], "sunlit brick"],
  [1192.0, "c_f_north_wall_snow", ["the cold shaded north wall of a house"], "north wall"],
  [1224.0, "c_f_wall_soaking", ["a stone wall soaking up sunlight"], "wall soak"],
  [1242.0, "c_f_dusk_warm_wall", ["a warm wall glowing at dusk"], "dusk wall"],
  [1274.0, "c_f_clear_sun_sky", ["the bright sun in a clear winter sky"], "clear sun"],
  [1296.0, "c_f_bare_tree_house", ["a bare deciduous tree by a house in winter"], "bare tree"],
  [1320.0, "c_f_cold_room_fire", ["a fire in a still-cold drafty room"], "cold room fire"],
  [1340.0, "c_f_heat_leak_night", ["warm air leaking from a house at night"], "heat leak"],
  [1355.0, "c_f_snug_cabin", ["a tight snug warm cabin in snow"], "snug cabin"],
  [1376.0, "c_f_bank_straw", ["banking straw against a house foundation"], "bank straw"],
  [1386.0, "c_f_curtain_draw", ["drawing a heavy curtain at dusk"], "curtain"],
  [1398.0, "c_f_shutter_close2", ["closing wooden shutters at night"], "shutter"],
  [1408.0, "c_f_stuff_gap", ["stuffing wool into a wall crack"], "stuff gap"],
  [1420.0, "c_f_low_beam_room", ["a low-beamed cozy farmhouse room"], "low beam room"],
  [1430.0, "c_f_close_door_cold", ["closing the door to a cold unused room"], "close door"],
  [1450.0, "c_f_draft_hand2", ["a wet hand feeling a draft at a window"], "draft hand"],
  [1468.0, "c_f_candle_draft2", ["a candle flame bent by a draft"], "candle draft"],
  [1488.0, "c_f_weatherstrip2", ["applying weather stripping to a door edge"], "weatherstrip"],
  [1498.0, "c_f_leaky_boat", ["bailing water from a leaky boat"], "leaky boat"],
  [1525.0, "c_f_dry_logs_ring", ["knocking two dry logs together"], "dry logs"],
  [1542.0, "c_f_steaming_log", ["a wet log steaming in a fire"], "steaming log"],
  [1552.0, "c_f_creosote_close", ["close up of creosote tar in a flue"], "creosote"],
  [1566.0, "c_f_damper_close2", ["closing a stove air damper"], "damper"],
  [1580.0, "c_f_smolder_smoke", ["a smoldering smoky choked fire"], "smolder"],
  [1594.0, "c_f_bright_air_fire", ["a hot fire burning bright with air"], "bright fire"],
  [1648.0, "c_f_self_heated_home", ["a complete self-heated stone home in winter"], "self heated"],
  [1660.0, "c_f_one_fire_mass", ["a mass heater warmed by one fire"], "one fire mass"],
  [1678.0, "c_f_tight_curtained", ["a tight curtained warm house"], "tight house"],
  [1693.0, "c_f_no_meter_home", ["an off-grid home with no meter in snow"], "no meter"],
  [1706.0, "c_f_dark_cold_neighbors", ["neighbors cold in a dark house"], "cold neighbors"],
  [1724.0, "c_f_sunrise_warm_home", ["a warm stone home at winter sunrise"], "sunrise home"],
  [1750.0, "c_f_tend_fire_rhythm", ["tending a fire in the rhythm of the day"], "tend rhythm"],
  [1772.0, "c_f_chop_stack_wood", ["chopping and stacking winter firewood"], "chop stack"],
  [1830.0, "c_f_stove_center_ok", ["a stove correctly centered in a home"], "center ok"],
  [1842.0, "c_f_hot_fire_mass2", ["a hot fire stored in stone mass"], "hot mass"],
  [1851.0, "c_f_seal_house2", ["sealing a house against drafts"], "seal house"],
  [1894.0, "c_f_seal_evening", ["sealing window leaks by lamplight"], "seal evening"],
  [1912.0, "c_f_handdrawn_plans", ["hand-drawn stove plans on paper"], "plans"],
  [1928.0, "c_f_offgrid_winter2", ["an off-grid family warm in winter"], "offgrid winter"],
];

// COLD OPEN (1.8–52): hero images bespoke + impacts/keyphrase.
const HERO = ", realistic color photograph, natural color, cinematic lighting, shallow depth of field, sharp focus, highly detailed, no text, no captions, no watermark, no logo";
const IMG_STYLE = ", realistic color photograph, natural vivid colors, sharp focus, well lit, clean, no text, no captions, no watermark, no logo";
const COLD_END = 52.0;
const hero = (id, prompt) => ({ name: id, prompt: prompt + HERO });
const COLD_OPEN = [
  { id: "c_h_house", start: 1.8, dur: 3.4, kind: "raw", src: "img/c_h_house.png", darken: 0,
    gen: { type: "image", ...hero("c_h_house", "an old Amish farmhouse buried in deep snow at dusk, warm golden light glowing in the windows, a thin ribbon of smoke from the stone chimney, brutal cold blue winter outside") } },
  { id: "c_h_thermo", start: 5.2, dur: 3.0, kind: "raw", src: "img/c_h_thermo.png", darken: 0,
    gen: { type: "image", ...hero("c_h_thermo", "extreme macro of an old outdoor thermometer mounted on frosted weathered wood, the needle pegged near nine degrees, snow and frost on the glass") } },
  { id: "c_h_impact1", start: 8.2, dur: 5.4, kind: "impact", image: "img/c_h_cozy.png",
    setup: "9°F outside.", impact: "71°F inside.", impactAccent: "good", hitAt: 2.0, boom: 0, darken: 0.46 },
  { id: "c_h_cozy", start: 13.6, dur: 4.2, kind: "raw", src: "img/c_h_cozy.png", darken: 0,
    gen: { type: "image", ...hero("c_h_cozy", "a warm cozy rustic farmhouse room in winter, soft lamplight, a large stone heater, deep snow piled against the window outside, calm and snug") } },
  { id: "c_h_keyphrase", start: 17.8, dur: 4.6, kind: "keyphrase", text: "No flame in 12 hours.", src: "img/c_h_coals.png", accent: "good", fontSize: 100,
    gen: { type: "image", ...hero("c_h_coals", "extreme close-up of cold grey ash and a few faint dying embers in a large stone firebox, no flames, the fire long dead") } },
  { id: "c_h_onefire", start: 22.4, dur: 4.0, kind: "raw", src: "img/c_h_onefire.png", darken: 0,
    gen: { type: "image", ...hero("c_h_onefire", "a single bright morning fire burning hard inside the low firebox of a massive stone masonry heater, warm light, early daylight") } },
  { id: "c_h_letdie", start: 26.4, dur: 4.0, kind: "raw", src: "img/c_h_letdie.png", darken: 0,
    gen: { type: "image", ...hero("c_h_letdie", "a fire burning down to glowing coals in a stone firebox, left alone, warm orange embers settling") } },
  { id: "c_h_handstone", start: 30.4, dur: 4.4, kind: "raw", src: "img/c_h_handstone.png", darken: 0,
    gen: { type: "image", ...hero("c_h_handstone", "a weathered bare hand laid flat against the warm stone face of a masonry heater, intimate, soft warm light, the stone giving off gentle heat") } },
  { id: "c_h_impact2", start: 34.8, dur: 5.2, kind: "impact", image: "img/c_h_wall.png",
    setup: "One fire a day.", impact: "Warm till tomorrow.", impactAccent: "good", hitAt: 1.9, boom: 0, darken: 0.46 },
  { id: "c_h_wall", start: 40.0, dur: 4.2, kind: "raw", src: "img/c_h_wall.png", darken: 0,
    gen: { type: "image", ...hero("c_h_wall", "a large warm stone wall behind a masonry stove radiating heat into a dim cozy room, soft glow, a person's silhouette warming nearby") } },
  { id: "c_h_snowout", start: 44.2, dur: 4.0, kind: "raw", src: "img/c_h_snowout.png", darken: 0,
    gen: { type: "image", ...hero("c_h_snowout", "deep snow halfway up wooden fence posts on an Amish farm, bitter blue winter light, wind-blown drifts, a warm-lit farmhouse in the distance") } },
  { id: "c_h_chimney", start: 48.2, dur: 3.9, kind: "raw", src: "img/c_h_chimney.png", darken: 0,
    gen: { type: "image", ...hero("c_h_chimney", "a stone farmhouse chimney with a faint wisp of clean smoke against a frozen winter sky, snow on the roof, dawn light") } },
];

CLIPS.sort((a, b) => a[0] - b[0]);
const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = Number(process.env.CALOR_MINGAP) || 3.2;
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
  fs.writeFileSync("public/broll/match_calor.json", JSON.stringify(match, null, 2));
  console.log(`match_calor.json: ${match.length} clips (avatar-full: ${AV_FULL.length} bloques)`);
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
  { t: 173, id: "cmp_methods", kind: "splitlist", palette: "B",
    title: "Four ways to heat off the grid", items: ["The masonry heater (one fire, all day)", "The rocket mass heater ($200, DIY)", "The sun wall (free winter sun)", "Sealing — the heat you keep"] },
  { t: 256, id: "cmp_furnace", kind: "callout", hue: "red", accent: "danger",
    figure: "Heats the air", eyebrow: "Why the furnace loses", caption: "hot air rises, cools, sinks — and it's gone the second the burner stops",
    bg: "hot air blowing from a furnace vent in a cold room" },
  { t: 353, id: "cmp_subscription", kind: "callout", hue: "red", accent: "danger",
    figure: "A subscription", eyebrow: "What they really sell", caption: "a machine that burns fuel every minute is a machine that sells fuel every minute",
    bg: "a propane tank and a heating bill on a table" },
  { t: 340, id: "cmp_furncost", kind: "bars", hue: "amber", accent: "good", unit: "USD",
    title: "Cost to stay warm — 20 years", eyebrow: "Same job: a warm house",
    bars: [{ label: "Mass / rocket heater", value: 1, display: "Built once", sub: "+ wood you cut", winner: true }, { label: "Furnace + propane", value: 70, display: "$30–50k", sub: "install + fuel + service" }] },
  { t: 471, id: "cmp_principle", kind: "splitlist", palette: "D", cross: true,
    title: "Thin metal vs heavy mass", items: ["Steel stove: hot in 20 min, cold in 20", "Holds nothing — heat is in the air", "Stone mass: soaks it, holds it", "Radiates gentle heat for a full day"] },
  { t: 399, id: "cmp_blackout", kind: "callout", hue: "red", accent: "danger",
    figure: "Coldest night", eyebrow: "When it fails", caption: "the night the grid drops is the night your furnace becomes a cold steel box — pipes freeze by morning",
    bg: "a dark cold house during a winter blackout" },
  { t: 574, id: "cmp_howitworks", kind: "massheater", eyebrow: "How it works", title: "Burn hot, store it in stone",
    fire: { text: "Fierce fire", sub: "1–2 hours, burns clean" }, mass: { text: "Stone drinks the heat", sub: "winding smoke channels" },
    out: { text: "Radiates 12–24 hrs", sub: "gentle, even warmth" }, coolTag: "smoke leaves cool", effTag: "80–90% kept" },
  { t: 640, id: "cmp_efficiency", kind: "bars", hue: "amber", accent: "good", unit: "%",
    title: "Heat kept from the fire", eyebrow: "Where your warmth goes",
    bars: [{ label: "Masonry heater", value: 88, display: "80–90%", winner: true }, { label: "Ordinary stove", value: 50, display: "~50%", tone: "amber" }] },
  { t: 741, id: "cmp_lesswood", kind: "stat", hue: "amber", accent: "good",
    value: 3, prefix: "⅓", suffix: " the wood", label: "burned by families who heat with mass — and they stay warmer", eyebrow: "Less fuel" },
  { t: 778, id: "cmp_century", kind: "stat", hue: "amber", accent: "good",
    value: 150, suffix: " years", label: "masonry stoves still heating homes in Europe — build it once", eyebrow: "It does not wear out" },
  { t: 819, id: "cmp_masonryhard", kind: "checklist", hue: "amber", accent: "good",
    title: "What a real one needs", eyebrow: "The honest hard parts",
    items: [ck("A ton+ of stone — a strong footing"), ck("Built in the center of the house"), ck("Channels laid by a craftsman"), ck("A build-once, 100-year investment")],
    bg: "a mason building a large stone heater in a home" },
  { t: 940, id: "cmp_rocket", kind: "massheater", eyebrow: "The $200 version", title: "Anatomy of a rocket mass heater", mode: "rocket",
    fire: { text: "J-tube feed", sub: "wood stands on end" }, mass: { text: "Cob bench", sub: "clay, sand, straw — free" },
    out: { text: "Heated seat", sub: "warm for hours" }, coolTag: "smoke burns twice", effTag: "−90% wood" },
  { t: 912, id: "cmp_rocketparts", kind: "process", hue: "amber", accent: "amber",
    title: "The rocket, part by part", eyebrow: "Burns its own smoke",
    steps: [{ title: "J-tube — wood stands on end" }, { title: "Burn tunnel — flame pulled sideways" }, { title: "Heat riser — smoke catches fire" }, { title: "Cob bench — stores the warmth" }] },
  { t: 979, id: "cmp_woodcost", kind: "bars", hue: "amber", accent: "good", unit: "cords / winter",
    title: "Firewood burned in a winter", eyebrow: "The same warm house",
    bars: [{ label: "Ordinary stove", value: 5, display: "4–5 cords", tone: "amber" }, { label: "Rocket mass heater", value: 1, display: "~1 cord", sub: "scraps & branches", winner: true }] },
  { t: 1187, id: "cmp_sunsteps", kind: "checklist", hue: "cold", accent: "good",
    title: "Catch the free winter sun", eyebrow: "Build a sun wall",
    items: [ck("Big windows facing south"), ck("Few or none on the cold north"), ck("Heavy mass just inside the glass"), ck("An overhang to shade the summer sun")],
    bg: "a south-facing window with winter sun on a thick stone wall" },
  { t: 1071, id: "cmp_rocketcost", kind: "callout", hue: "amber", accent: "good",
    figure: "$200–400", eyebrow: "A few weekends", caption: "barrel, pipe and a cob bench — mostly from materials folks throw away",
    bg: "a homemade cob rocket mass heater with a barrel" },
  { t: 1247, id: "cmp_sunwall", kind: "callout", hue: "amber", accent: "good",
    figure: "¼ to ⅓", eyebrow: "The free sun wall", caption: "a heavy south wall behind glass can supply this much of your heat before you light a match",
    bg: "winter sun pouring onto a thick stone wall behind a window" },
  { t: 1199, id: "cmp_wallcross", kind: "cross", hue: "amber", title: "The sun wall, in section", eyebrow: "South-facing mass",
    layers: [
      { label: "Glass — winter sun pours in", color: "#cfe0e8", weight: 0.5 },
      { label: "Heavy masonry — soaks heat all day", color: "#b9682f", weight: 1.7 },
      { label: "The room — warmed free at dusk", color: "#c9a25c", weight: 1 },
    ], marker: { label: "stored heat", atDepth: 0.5, color: "amber" } },
  { t: 1306, id: "cmp_overhang", kind: "callout", hue: "cold", accent: "good",
    figure: "Sun in, shade out", eyebrow: "The one trick", caption: "low winter sun reaches in; an overhang or a leafy tree blocks the high summer sun",
    bg: "a roof overhang over a south window in winter sun" },
  { t: 1472, id: "cmp_drafts", kind: "stat", hue: "red", accent: "danger",
    value: 33, suffix: "%", label: "of your heat lost to leaks and drafts you cannot even see", eyebrow: "The heat you throw away" },
  { t: 1391, id: "cmp_seal", kind: "checklist", hue: "amber", accent: "good",
    title: "Seal the house first", eyebrow: "Costs almost nothing",
    items: [ck("Bank the foundation with earth & straw"), ck("Heavy curtains & shutters at dusk"), ck("Stuff every crack and gap"), ck("Low ceilings, close unused rooms")],
    bg: "stuffing wool into a window gap, heavy curtains" },
  { t: 1535, id: "cmp_drywood", kind: "mistake", number: "!", eyebrow: "WOOD SECRET",
    title: "Wet wood steals half your heat", desc: "Half the energy in green wood is wasted boiling out the water — and it tars your chimney. Season it 1–2 years.",
    bg: "wet green wood steaming and smoking in a fire" },
  { t: 1573, id: "cmp_smolder", kind: "mistake", number: "✕", eyebrow: "BACKWARD",
    title: "Don't choke it down to 'save' wood", desc: "A smoldering fire wastes half its heat up the chimney as smoke and lines the flue with creosote. Burn hot.",
    bg: "a choked smoldering smoky wood fire" },
  { t: 1608, id: "cmp_numbers", kind: "process", hue: "amber", accent: "amber",
    title: "The five numbers", eyebrow: "Remember these",
    steps: [{ title: "Heat the mass, not the air" }, { title: "Heavy, in the center" }, { title: "Catch the south sun" }, { title: "Burn dry wood hot" }, { title: "Seal every leak first" }] },
  { t: 1641, id: "cmp_system", kind: "splitlist", palette: "G",
    title: "A whole plain system", items: ["Mass heater — a day of warmth, one fire", "Sun wall — free heat from the south", "Dry wood, burned hot", "A tight, sealed house holding it all"] },
  { t: 1757, id: "cmp_limits", kind: "splitlist", palette: "B",
    title: "The honest limits", items: ["Stone is slow — warms over hours, not minutes", "A rhythm of the day, not a thermostat", "A masonry heater is real money & labor", "But you owe no one, depend on nothing"] },
  { t: 1816, id: "cmp_mistake", kind: "mistake", number: "1·2·3", eyebrow: "THE COMMON MISTAKE",
    title: "Outside wall · smolder · leaky house", desc: "All three come from one wrong idea — that you heat the air right now. You don't. You charge the stone and hold its heat.",
    bg: "a stove built wrong against a cold outside wall" },
  { t: 1905, id: "cmp_almanac", kind: "callout", hue: "amber", accent: "good",
    figure: "The Plain Almanac", eyebrow: "Below this video", caption: "the mass-heater and rocket-bench plans, the sun wall, seasoning wood — dozens of old ways to keep more of what you earn",
    bg: "an old vintage almanac book on a wooden table, warm light" },
  { t: 1938, id: "cmp_next", kind: "nextvideo", kicker: "Next time",
    title: "Light a whole house at night with no electricity",
    sub: "Bright enough to read, sew and cook by. No batteries. No bill. The other half of how we live." },
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
  if (bg) {
    ab.image = `img/${c.id}_bg.png`;
    ab.gen = { type: "image", name: `${c.id}_bg`, prompt: bg + IMG_STYLE };
  }
  let rm = 1;
  while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placed.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab);
  placed.add(c.id);
  const next = beats[idx + 1];
  const nextAv = avStarts.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
  ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + 7.5) - start).toFixed(2);
  nComp++;
}

// tiling final
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
fs.writeFileSync("beatsheet/calor.json", JSON.stringify({ video: "calor", avatar: "calor_opt.mp4", clipsfirst: true, beats }, null, 2));

// avatar windows
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = [];
let k = 0;
for (let i = 0; i < beats.length; i++) {
  if (i % 6 === 3) { pip.push([beats[i].start, beats[i].start + Math.min(beats[i].dur, 7), POS[k % POS.length]]); k++; }
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
const avTs = `// avatar_calor.gen.ts — GENERADO por build_calor.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_CALOR = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_calor.gen.ts", avTs);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0) + OPEN;
console.log(`=== build_calor ===`);
console.log(`beats: ${beats.length} · clips reales: ${nClip} · img/real: ${beats.length - nClip} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
console.log(`dur min/max: ${beats.length ? Math.min(...beats.map((b) => b.dur)) : 0}s / ${beats.length ? Math.max(...beats.map((b) => b.dur)) : 0}s`);
