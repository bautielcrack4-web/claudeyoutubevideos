// build_carne.mjs — CLIPS-FIRST híbrido (estilo zeer/calor). NICHO: Amish off-grid —
// keep meat for a YEAR with no fridge (salt cure + smokehouse + cellar + confit + drying).
// Anclado al ms EXACTO del Whisper (captions_carne.json, TOTAL≈1482s). Fixes incorporados
// (realSrc _1, gen usa QUERY). Componente A MEDIDA: CureDiagram (la sal saca el agua).
//
//   node build_carne.mjs match  → public/broll/match_carne.json
//   node build_carne.mjs        → beatsheet/carne.json + avatar_carne.gen.ts
import fs from "fs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1482.0;
const OPEN = 1.8;
const DLDUR = 6;

const AV_FULL = [
  [147.68, 155.6],   // "let me tell you the hard truth about that freezer"
  [538.0, 549.6],    // "here is where I am going to stop and be more honest with you"
  [1210.86, 1224.6], // "let me be honest about the limits, and most of all about the safety"
  [1378.61, 1397.6], // CTA "if you do just one thing... start small and start safe"
  [1473.52, TOTAL],  // sign-off "milk next time... keep it plain"
];

const CLIPS = [
  // ── COLD OPEN tail / no machine (52–78) ──
  [52.5, "k_salt_smoke_cellar", ["coarse salt, wood smoke and a dark cellar"], "salt, smoke, a cool dark cellar"],
  [60.5, "k_old_hands_ham", ["weathered hands holding a cured ham"], "the knowing of how to use them"],
  [64.5, "k_side_pork_hanging", ["a whole side of cured pork hanging in a cellar"], "a whole side of pork, winter to winter"],
  [71.0, "k_meat_hanging_rafters", ["cured meats hanging from old barn rafters"], "carried through with no spoiling"],
  // ── FREEZER TRAP (78–280) ──
  [78.5, "k_chest_freezer", ["an open chest freezer full of frozen meat"], "the thing that ought to stop you cold"],
  [85.0, "k_freezer_garage", ["a humming chest freezer in a garage"], "the freezer humming in the garage"],
  [91.0, "k_spoiled_meat_bin", ["spoiled meat thrown into a bin"], "one storm from the ditch"],
  [95.5, "k_dependent_plug", ["a freezer power cord plugged into an outlet"], "we have gotten dependent"],
  [99.5, "k_salt_box_meat", ["a wooden box of salt with meat being cured"], "a five-dollar box of salt"],
  [110.0, "k_potted_meat_crock", ["a crock of potted meat sealed under fat"], "cooked meat kept a year on a shelf"],
  [120.0, "k_butcher_meat_block", ["a butcher working meat on a wooden block"], "the safest food turned dangerous"],
  [130.0, "k_warning_hand", ["a careful hand salting meat"], "and how to never make the mistake"],
  [138.5, "k_grandfather_smokehouse", ["an old man by a wooden smokehouse"], "with his own two hands"],
  [156.0, "k_frozen_meat_block", ["a solid block of frozen meat"], "a freezer only pauses the rot"],
  [161.0, "k_raw_meat_cut", ["a raw cut of red meat on a board"], "still perfectly spoilable"],
  [165.0, "k_freezer_open_frost", ["frost inside an open chest freezer"], "held at the edge of a cliff"],
  [172.0, "k_power_cord_meter", ["an electric meter and a power cord"], "a steady feed of electricity"],
  [177.0, "k_thawing_meat", ["meat thawing in a warm kitchen, water pooling"], "the whole thing thaws and turns"],
  [186.5, "k_side_beef_freezer", ["a side of beef packed into a freezer"], "food put in a trap"],
  [199.0, "k_ice_powerline_down", ["ice-coated power lines down in a storm"], "the grid blinks on the coldest night"],
  [208.0, "k_spoiled_freezer_loss", ["a freezer of spoiled thawed meat"], "two thousand dollars lost in a weekend"],
  [216.0, "k_freezer_bill", ["an electric bill beside a freezer"], "billing you all year long"],
  [225.0, "k_shelf_stable_meat", ["cured shelf-stable meat on a pantry shelf"], "shelf-stable for nothing"],
  [231.5, "k_thinking_old_man", ["a thoughtful older man in a farmhouse"], "the question nobody asks"],
  [236.0, "k_store_freezers_row", ["a row of freezers for sale in a store"], "the only way you are taught"],
  [248.0, "k_cash_register2", ["money changing hands at a register"], "a freezer sells electricity forever"],
  [253.5, "k_appliance_store", ["a showroom of appliances"], "the box, and the bigger box"],
  [261.5, "k_salt_sack", ["a burlap sack of salt"], "a sack of salt sells nobody anything"],
  [266.5, "k_ham_rafter", ["a single ham hanging from a wooden rafter"], "no monthly bill in a hanging ham"],
  [271.5, "k_humming_box", ["a humming white chest freezer alone"], "handed a humming box, called progress"],
  [279.5, "k_leash_chain", ["a chain or leash, a tether"], "it was a leash"],
  // ── THE SECRET: bacteria need water (281–361) ──
  [281.5, "k_old_family_meat", ["an old family preserving meat together"], "the plain folks were never that fragile"],
  [288.0, "k_cured_meats_variety", ["a variety of cured and smoked meats"], "the same simple secret"],
  [297.5, "k_raw_meat_macro", ["macro close up of raw meat texture"], "meat does not rot on its own"],
  [303.0, "k_microbes_concept", ["microscopic bacteria concept, tiny organisms"], "spoiled by tiny living things"],
  [309.5, "k_water_droplet_macro", ["a water droplet, life needs water"], "they must have water to live"],
  [311.5, "k_freezer_frost2", ["frost and ice crystals on frozen meat"], "cold only makes bacteria slow"],
  [316.0, "k_thawed_meat_turn", ["thawed meat going off"], "thawed meat turns fast"],
  [325.0, "k_salt_on_meat", ["coarse salt poured over a cut of meat"], "take away what they need to live"],
  [329.5, "k_salt_draw_water", ["salt drawing moisture out of meat, brine forming"], "pull the water out with salt"],
  [335.0, "k_smoke_meat_seal", ["wood smoke curling around hanging meat"], "smoke seals the surface"],
  [340.5, "k_fat_sealed_crock", ["meat sealed under a cap of white fat in a crock"], "buried under a cap of fat"],
  [348.0, "k_pantry_shelf_meat", ["cured meat sitting on a dark pantry shelf"], "not keeping it cold"],
  [354.0, "k_dark_cellar_meat", ["cured meat in a dark cellar, no machine"], "a place where rot cannot live"],
  // ── SALT CURE (361–538) ── CureDiagram ~370
  [361.5, "k_box_plain_salt", ["a five-dollar box of plain coarse salt"], "a five-dollar box of salt"],
  [376.5, "k_salt_pour_hand", ["salt pouring through a hand"], "the principle could not be simpler"],
  [380.0, "k_salt_crystals_macro", ["macro of coarse salt crystals"], "salt is thirsty"],
  [388.0, "k_meat_in_brine", ["meat sinking into a crock of salt brine"], "salt pulls the water straight out"],
  [398.0, "k_salt_pork_slab", ["a slab of salt pork"], "meat that will not spoil"],
  [402.5, "k_hams_bacon_history", ["traditional hams and bacon hanging"], "salt pork, hams, bacon through history"],
  [411.0, "k_two_methods_meat", ["a dry-salted cut beside a brine crock"], "two plain ways to do it"],
  [415.0, "k_salt_box_wood", ["a wooden salt box for curing meat"], "the dry cure, the salt box"],
  [428.5, "k_rub_salt_meat", ["hands rubbing salt hard into a cut of meat"], "rub the salt into every surface"],
  [435.0, "k_bury_meat_salt", ["a cut of meat buried completely in salt"], "bury it packed down in salt"],
  [440.5, "k_brine_drip_off", ["brine water dripping off curing meat"], "the salt draws the water out"],
  [446.5, "k_butcher_notebook", ["an old butcher's handwritten notebook"], "the rule worth writing down"],
  [457.0, "k_bacon_slab_cure", ["a slab of pork belly bacon curing in salt"], "a slab of bacon cures in a week"],
  [466.5, "k_ham_leg_salt", ["a whole ham leg buried in curing salt"], "a great ham, a month or six weeks"],
  [477.0, "k_resalt_meat", ["re-salting a curing ham with fresh salt"], "re-salt it part way through"],
  [488.0, "k_brine_barrel", ["a wooden barrel of salt brine for curing"], "the brine, the wet cure"],
  [497.0, "k_egg_float_brine", ["a fresh egg floating in strong salt brine"], "strong enough an egg floats"],
  [501.5, "k_plate_stone_brine", ["a plate and a stone holding meat under brine"], "held down beneath the surface"],
  [506.0, "k_sugar_spices_cure", ["brown sugar and spices for a meat cure"], "a little sugar and spices"],
  [516.5, "k_corned_beef", ["a brisket of corned beef in brine"], "this is how corned beef is made"],
  [525.5, "k_brine_soak_crock", ["meat soaking in a cold brine crock"], "soaks days to weeks, cured through"],
  // ── (AV_FULL 538–549) honest/safety ──
  [550.0, "k_cold_smoke_meat", ["meat hanging in cool wood smoke"], "anything you smoke low and cool"],
  [557.5, "k_table_salt_box", ["a box of plain table salt"], "plain table salt is not enough"],
  [564.5, "k_curing_salt_pink", ["pink curing salt with nitrite"], "a curing salt, the pink-tinted salt"],
  [579.0, "k_safety_warning_meat", ["a careful measured spoon of curing salt"], "guards against botulism"],
  [595.5, "k_measure_cure_salt", ["measuring curing salt by the package directions"], "follow the amount to the letter"],
  [611.5, "k_dont_guess_salt", ["a careful hand weighing curing salt on a scale"], "do not guess, do not skip it"],
  [616.0, "k_safe_cured_meats", ["a board of safely cured meats"], "among the safest foods there is"],
  [629.5, "k_respect_meat", ["an old hand carefully handling cured meat"], "respect it and it feeds you"],
  // ── SMOKE / SMOKEHOUSE (634–791) ──
  [636.5, "k_smoked_ham_glisten", ["a glistening smoked ham"], "made it last and taste worth waiting"],
  [645.5, "k_wood_smoke_rising", ["wood smoke rising softly"], "the second half is smoke"],
  [650.5, "k_smokehouse_exterior", ["a small wooden smokehouse building"], "the smokehouse"],
  [658.0, "k_barrel_smoker", ["a homemade barrel smoker with smoke"], "humble as an old barrel"],
  [665.5, "k_hang_meat_smoke", ["meat hung inside a smokehouse in smoke"], "hang it in the cool smoke"],
  [674.0, "k_hardwood_fire_low", ["a small smoldering hardwood fire"], "a low smoldering hardwood fire"],
  [681.0, "k_hickory_chips", ["hickory wood chips and chunks"], "hickory, oak, apple, maple, cherry"],
  [692.0, "k_smoke_curl_meat", ["smoke curling around hanging bacon"], "smoke does two things at once"],
  [699.0, "k_meat_skin_sealed", ["a tough smoked skin on hanging meat"], "a sealed skin flies cannot pass"],
  [708.0, "k_smoke_preserve", ["dense wood smoke preserving meat"], "smoke kills and holds back rot"],
  [716.5, "k_natures_preservative", ["smoke drifting through a smokehouse"], "smoke, nature's own preservative"],
  [721.0, "k_smoked_bacon_side", ["a side of deeply smoked bacon"], "hangs a year and grows finer"],
  [733.0, "k_two_smoke_types", ["a cool smoker beside a hot smoker"], "two kinds of smoking"],
  [739.0, "k_cold_smoke_gentle", ["gentle cool smoke around raw cured meat"], "cold smoking, cool and gentle, preserves"],
  [748.0, "k_cure_then_smoke", ["cured meat going into a cold smoker"], "cure and curing salt first, not optional"],
  [760.5, "k_hot_smoke_sausage", ["hot smoking sausages, cooking as they smoke"], "hot smoking cooks the meat"],
  [772.5, "k_cold_smoke_year", ["cold-smoked cured ham for the year"], "cold smoke on a good cure"],
  [781.0, "k_salt_smoke_hang", ["cured smoked meat hung to age"], "salt, then smoke, then hang"],
  // ── CELLAR (791–870) ──
  [791.5, "k_cellar_steps_meat", ["stone cellar steps down to hanging meat"], "the cool dark cellar"],
  [803.5, "k_rootcellar_apples_meat", ["a root cellar with apples and hanging meat"], "double duty for the meat"],
  [813.5, "k_sausage_coil_hang", ["a coil of dried sausage hanging in a cellar"], "a coil of dried sausage hung up"],
  [822.0, "k_wrapped_ham_cloth", ["a cured ham wrapped loose in cloth"], "wrapped in cloth to keep flies off"],
  [829.0, "k_cool_dark_cellar2", ["a cool dark airy cellar interior"], "the cool slows the spoiling"],
  [835.0, "k_airy_cellar_meat", ["air moving in a dim cellar of hanging meat"], "the air keeps it from going musty"],
  [843.0, "k_cellar_pantry_meat", ["a cellar pantry full of hanging cured meat"], "the cellar is just the pantry"],
  [856.5, "k_cut_ham_slice", ["cutting a rosy slice off a cured ham"], "a slice of ham cured last winter"],
  // ── CONFIT / POTTING (870–974) ──
  [870.5, "k_potted_meat_jar", ["a crock of potted meat under fat"], "the fourth way, told you to wait for"],
  [885.0, "k_confit_duck_fat", ["duck confit packed in fat in a jar"], "potting, the French call it confit"],
  [892.5, "k_lard_fat_white", ["white rendered lard, the secret"], "the whole secret is fat"],
  [901.0, "k_meat_in_fat_pot", ["meat cooking slowly submerged in fat"], "cook it submerged in fat"],
  [910.0, "k_pork_shoulder_confit", ["a pork shoulder confit falling apart"], "until it falls apart at a fork"],
  [921.5, "k_pack_crock_meat", ["packing cooked meat into a stoneware crock"], "pack it into a clean crock"],
  [930.5, "k_pour_fat_over", ["pouring warm fat over potted meat to seal"], "pour fat over until buried"],
  [938.5, "k_sealed_fat_cap", ["a solid white cap of fat sealing a crock"], "sealed beneath a cap of fat"],
  [950.0, "k_potted_cellar_shelf", ["a crock of potted meat on a cool cellar shelf"], "keeps months in a cool cellar"],
  [957.5, "k_crock_fat_dark", ["a sealed fat crock in the dark"], "just meat, fat, a crock, the dark"],
  [964.0, "k_rich_potted_dish", ["a rich dish of warmed potted meat"], "one of the richest foods forgotten"],
  // ── DRYING / JERKY (974–1036) ──
  [974.5, "k_drying_strips_air", ["thin strips of meat drying in moving air"], "the fifth, needs only moving air"],
  [984.0, "k_cut_thin_strips", ["cutting meat into thin strips for drying"], "cut into thin strips, salt well"],
  [992.0, "k_hang_strips_dry", ["salted meat strips hung in a dry breezy place"], "hang in a dry breezy place"],
  [999.5, "k_dried_jerky_hard", ["hard dark dried meat jerky"], "until hard and dark and dry"],
  [1006.5, "k_jerky_biltong", ["biltong and dried beef jerky"], "jerky, dried beef, biltong, pemmican"],
  [1014.0, "k_jerky_sack", ["dried meat stored in a clean cloth sack"], "keeps months in a clean sack"],
  [1023.0, "k_jerky_pocket_travel", ["dried meat carried for travel"], "the food carried in a coat"],
  // ── BUTCHERING DAY (1036–1105) ──
  [1037.0, "k_butchering_day", ["a traditional late-fall hog butchering day"], "the day it all began"],
  [1043.5, "k_late_fall_cold_farm", ["a cold late-autumn farm, first frost"], "butchering in the late fall cold"],
  [1051.0, "k_cold_butcher_work", ["men working meat in the cold"], "the cold gave them a few days"],
  [1058.0, "k_salting_fresh_meat", ["salting fresh-butchered meat quickly"], "get it salted before it spoils"],
  [1064.0, "k_borrow_cold_days", ["a frosty barn used for butchering"], "borrowing a few cold days"],
  [1068.5, "k_nothing_wasted_hog", ["a whole hog being fully used, nothing wasted"], "nothing was wasted"],
  [1076.0, "k_grind_sausage", ["grinding meat trimmings into sausage"], "trimmings ground into sausage"],
  [1083.0, "k_render_lard", ["rendering pork fat down into lard"], "the fat rendered down into lard"],
  [1090.0, "k_year_of_food", ["a pantry of a whole year's preserved meat"], "a year of breakfasts and suppers"],
  [1099.5, "k_fed_and_free", ["a content self-sufficient farm family"], "fed and free all year"],
  // ── NUMBERS RECAP (1105–1149) ──
  [1111.5, "k_salt_heap", ["a generous heap of curing salt"], "salt is the work, use plenty"],
  [1116.0, "k_cure_cold_cellar", ["meat curing cold just above freezing"], "cure it cold, just above freezing"],
  [1127.5, "k_pink_cure_salt2", ["pink curing salt measured out"], "use a proper curing salt"],
  [1135.5, "k_cold_vs_hot_smoke2", ["a cool smoker and a hot smoker side by side"], "cold smoke to preserve, hot to eat"],
  [1142.5, "k_hung_cool_dark", ["cured meat hung in a cool dark dry cellar"], "hung in the cool, dark and dry"],
  // ── SYSTEM TOGETHER (1149–1210) ──
  [1149.5, "k_whole_meat_system", ["a complete cured-meat pantry, no machine"], "the whole sensible system"],
  [1160.5, "k_salt_work2", ["salt doing the heavy work on meat"], "the salt, stopping the rot"],
  [1166.5, "k_smoke_seal2", ["smoke sealing a meat surface"], "the smoke, sealing the surface"],
  [1170.5, "k_cellar_hangs", ["cured meat hanging in a cellar"], "the cellar where it hangs and waits"],
  [1175.0, "k_fat_and_dry", ["potted fat crock beside drying strips"], "the fat cap and the drying strips"],
  [1181.5, "k_no_wire_meat", ["a cellar of preserved meat, no wires"], "not a wire running to it"],
  [1189.5, "k_blackout_neighbor_meat", ["a neighbor at a dark thawing freezer"], "neighbor racing a thawing freezer"],
  [1201.0, "k_hams_safe_cellar", ["hams hanging safe and quiet in a cellar"], "your hams hanging safe and quiet"],
  // ── SAFETY / LIMITS (1224–1309) ── (AV 1210–1224)
  [1224.5, "k_respect_preserving", ["careful respectful handling of cured meat"], "done with respect"],
  [1230.0, "k_cure_salt_hams", ["pink curing salt for hams and bacon"], "use a proper curing salt"],
  [1244.0, "k_meat_cold_cure2", ["meat curing cold in a winter cellar"], "keep it cold the whole time"],
  [1251.0, "k_cold_months_cure", ["snowy winter, the season for curing"], "only cured in the cold months"],
  [1260.0, "k_plenty_salt2", ["a heavy hand of salt on meat"], "use plenty of salt"],
  [1269.5, "k_clean_tools_meat", ["clean knives and tools for meat"], "keep everything clean"],
  [1273.0, "k_smell_check_meat", ["smelling a piece of cured meat to check"], "trust your nose, throw it out"],
  [1289.0, "k_discard_bad_meat", ["discarding a spoiled piece of meat"], "a hog is cheaper than a hospital"],
  [1295.5, "k_world_fed_safely", ["generations fed safely on cured meat"], "fed the world for a thousand years"],
  // ── THE MISTAKE (1309–1378) ──
  [1309.5, "k_one_mistake_meat", ["a correctly salted cut beside a spoiled one"], "the one mistake"],
  [1320.5, "k_not_enough_salt", ["a meagre sprinkle of salt on meat"], "not enough salt, or too warm"],
  [1326.5, "k_timid_salt", ["a timid pinch of salt on a large cut"], "timid with the salt"],
  [1337.0, "k_warm_room_spoil", ["meat curing in too warm a room, going off"], "curing in warm weather spoils it"],
  [1346.5, "k_full_salt_cold", ["a cut fully salted in a cold cellar"], "use the full salt, cure in the cold"],
  [1356.0, "k_one_true_idea", ["salt drawing water from meat, the idea"], "remember the one true idea"],
  [1362.5, "k_take_water_air", ["removing water and air from meat"], "take away the water and air"],
  [1370.5, "k_salt_well_cure_cold", ["salting well and curing cold"], "salt it well, cure it cold"],
  // ── CTA + NEXT (1397–1482) ── (AV 1378–1397, 1473–end)
  [1398.5, "k_fry_bacon_pan", ["frying a slice of home-cured bacon in a pan"], "fry a slice of bacon you cured"],
  [1410.0, "k_home_cured_pride", ["proud hands holding home-cured bacon"], "no factory, no freezer"],
  [1421.5, "k_carried_own_meat", ["a self-sufficient family with their own meat"], "they carried their own meat"],
  [1425.5, "k_almanac_book2", ["an old vintage almanac handbook on wood"], "the rest written down"],
  [1436.0, "k_recipes_plans", ["handwritten salt and brine recipes by weight"], "recipes, smokehouse plans, by weight"],
  [1449.5, "k_gathered_guide", ["a thick handbook in one place"], "gathered into one place"],
  [1459.0, "k_milk_butter_cream", ["fresh milk, butter and cream in summer"], "next: milk, butter and cream in summer"],
  [1467.0, "k_springhouse_milk", ["milk cans cooling in a spring house"], "fresh every day, no ice"],

  // ── FILLERS (densidad; queries on-topic en los huecos) ──
  [57.0, "k_f_smoke_wisp", ["a thin wisp of wood smoke"], "smoke"],
  [68.0, "k_f_bacon_hang", ["a side of bacon hanging in a cellar"], "bacon hang"],
  [82.5, "k_f_freezer_meat2", ["frozen packaged meat in a freezer drawer"], "frozen meat"],
  [88.0, "k_f_garage_freezer2", ["a chest freezer alone in a garage"], "garage freezer"],
  [105.0, "k_f_salt_scoop", ["a wooden scoop of coarse salt"], "salt scoop"],
  [115.0, "k_f_cured_board", ["a board of sliced cured meats"], "cured board"],
  [125.0, "k_f_butcher_hands", ["a butcher's hands trimming meat"], "butcher hands"],
  [133.0, "k_f_careful_salting", ["carefully salting a cut of meat"], "careful salt"],
  [143.0, "k_f_old_barn_meat", ["an old barn with hanging cured meat"], "barn meat"],
  [168.0, "k_f_frost_meat2", ["frost crystals on frozen meat"], "frost meat"],
  [181.0, "k_f_thaw_drip", ["meat thawing and dripping water"], "thaw drip"],
  [191.0, "k_f_freezer_full2", ["a chest freezer packed full of meat"], "freezer full"],
  [203.0, "k_f_storm_dark_house", ["a dark house in a snowstorm, no power"], "storm dark"],
  [211.0, "k_f_spoiled_pile", ["a pile of spoiled gray meat"], "spoiled pile"],
  [220.0, "k_f_meter_spin2", ["an electric meter spinning fast"], "meter spin"],
  [241.0, "k_f_appliance_aisle", ["an appliance store aisle of freezers"], "appliance aisle"],
  [257.0, "k_f_money_count", ["counting dollar bills"], "money"],
  [275.0, "k_f_lone_freezer", ["a single humming chest freezer"], "lone freezer"],
  [285.0, "k_f_old_pantry_full", ["an old well-stocked meat pantry"], "old pantry"],
  [292.0, "k_f_smoked_variety", ["a variety of smoked sausages and hams"], "smoked variety"],
  [306.0, "k_f_micro_concept", ["tiny microbes concept macro"], "microbes"],
  [313.0, "k_f_ice_crystal", ["ice crystals macro on frozen food"], "ice crystal"],
  [320.0, "k_f_meat_turning", ["raw meat starting to spoil"], "meat turning"],
  [332.0, "k_f_salt_meat2", ["salt poured generously over meat"], "salt meat"],
  [344.0, "k_f_fat_seal2", ["white fat sealing meat in a jar"], "fat seal"],
  [351.0, "k_f_dark_shelf_meat", ["cured meat on a dark pantry shelf"], "dark shelf"],
  [366.0, "k_f_salt_box2", ["an open wooden salt box"], "salt box"],
  [383.0, "k_f_salt_crystal2", ["macro coarse salt crystals glinting"], "salt crystal"],
  [393.0, "k_f_meat_brine2", ["meat lowered into brine"], "meat brine"],
  [406.0, "k_f_salt_pork2", ["a slab of white salt pork"], "salt pork"],
  [422.0, "k_f_rub_salt2", ["rubbing salt into a pork cut"], "rub salt"],
  [432.0, "k_f_bury_salt2", ["a cut buried in a box of salt"], "bury salt"],
  [443.0, "k_f_brine_run", ["brine running off curing meat"], "brine run"],
  [462.0, "k_f_bacon_curing2", ["pork belly curing in salt"], "bacon curing"],
  [471.0, "k_f_ham_salt2", ["a ham leg in curing salt"], "ham salt"],
  [482.0, "k_f_resalt2", ["adding fresh salt to a curing cut"], "resalt"],
  [493.0, "k_f_barrel_brine2", ["a barrel of curing brine"], "barrel brine"],
  [511.0, "k_f_spices_cure", ["peppercorns and bay for a cure"], "spices"],
  [521.0, "k_f_corned_beef2", ["corned beef brisket in brine"], "corned beef"],
  [531.0, "k_f_brine_crock2", ["meat soaking in a brine crock"], "brine crock"],
  [560.0, "k_f_cold_smoke2", ["cool smoke around hanging meat"], "cold smoke"],
  [571.0, "k_f_pink_salt2", ["pink curing salt in a dish"], "pink salt"],
  [587.0, "k_f_measure_scale", ["weighing curing salt on a scale"], "measure scale"],
  [604.0, "k_f_safe_meat2", ["safely cured hams on a board"], "safe meat"],
  [623.0, "k_f_respect_hands", ["careful hands with cured meat"], "respect hands"],
  [641.0, "k_f_smoked_ham2", ["a glistening smoked ham"], "smoked ham"],
  [654.0, "k_f_smokehouse_door", ["the open door of a wooden smokehouse"], "smokehouse door"],
  [669.0, "k_f_hang_smoke2", ["meat hung in a smoky smokehouse"], "hang smoke"],
  [677.0, "k_f_smolder_fire", ["a low smoldering hardwood fire"], "smolder fire"],
  [686.0, "k_f_wood_chunks", ["hardwood chunks for smoking"], "wood chunks"],
  [695.0, "k_f_smoke_meat3", ["smoke curling around a side of bacon"], "smoke meat"],
  [703.0, "k_f_sealed_skin2", ["a tough smoked skin on meat"], "sealed skin"],
  [712.0, "k_f_dense_smoke", ["dense smoke in a smokehouse"], "dense smoke"],
  [727.0, "k_f_smoked_side", ["a deeply smoked side of bacon"], "smoked side"],
  [744.0, "k_f_cool_smoke3", ["gentle cool smoke on cured meat"], "cool smoke"],
  [755.0, "k_f_cure_to_smoke", ["cured meat going into a smoker"], "cure to smoke"],
  [766.0, "k_f_hot_smoke2", ["hot smoking sausages cooking"], "hot smoke"],
  [777.0, "k_f_cold_smoke_ham", ["cold-smoked ham aging"], "cold smoke ham"],
  [786.0, "k_f_hang_age", ["cured meat hung to age"], "hang age"],
  [798.0, "k_f_cellar_steps2", ["stone steps to a meat cellar"], "cellar steps"],
  [808.0, "k_f_cellar_apples_meat", ["a cellar with apples and hanging meat"], "cellar apples"],
  [818.0, "k_f_sausage_hang", ["a coil of dried sausage hanging"], "sausage hang"],
  [826.0, "k_f_wrapped_meat", ["cured meat wrapped in cloth"], "wrapped meat"],
  [838.0, "k_f_dim_cellar2", ["a dim airy meat cellar"], "dim cellar"],
  [861.0, "k_f_ham_slice2", ["a rosy slice cut from a ham"], "ham slice"],
  [877.0, "k_f_potted_jar2", ["a crock of potted meat under fat"], "potted jar"],
  [888.0, "k_f_confit_jar", ["confit duck sealed in fat"], "confit"],
  [905.0, "k_f_meat_in_fat2", ["meat cooking submerged in fat"], "meat in fat"],
  [916.0, "k_f_shoulder_fork", ["pork shoulder falling apart at a fork"], "shoulder fork"],
  [926.0, "k_f_pack_crock2", ["packing meat into a crock"], "pack crock"],
  [934.0, "k_f_pour_fat2", ["pouring warm fat over potted meat"], "pour fat"],
  [945.0, "k_f_fat_cap2", ["a solid white fat cap on a crock"], "fat cap"],
  [960.0, "k_f_crock_shelf", ["a fat-sealed crock on a cellar shelf"], "crock shelf"],
  [979.0, "k_f_dry_strips2", ["thin meat strips drying in the air"], "dry strips"],
  [988.0, "k_f_cut_strips2", ["cutting meat into thin strips"], "cut strips"],
  [996.0, "k_f_hang_dry2", ["salted strips hung to dry"], "hang dry"],
  [1010.0, "k_f_jerky_dark", ["hard dark dried jerky"], "jerky dark"],
  [1018.0, "k_f_jerky_sack2", ["dried jerky in a cloth sack"], "jerky sack"],
  [1040.0, "k_f_butcher_fall", ["a late-fall butchering scene"], "butcher fall"],
  [1055.0, "k_f_cold_barn2", ["a frosty barn in late autumn"], "cold barn"],
  [1062.0, "k_f_salt_fresh2", ["salting fresh meat quickly"], "salt fresh"],
  [1072.0, "k_f_grind_sausage2", ["grinding meat into sausage"], "grind sausage"],
  [1080.0, "k_f_lard_render2", ["rendering fat into lard"], "lard render"],
  [1086.0, "k_f_full_pantry2", ["a full pantry of preserved meat"], "full pantry"],
  [1119.0, "k_f_salt_heap2", ["a heap of curing salt"], "salt heap"],
  [1131.0, "k_f_pink_measure", ["measuring pink curing salt"], "pink measure"],
  [1139.0, "k_f_two_smokers", ["a cool and a hot smoker"], "two smokers"],
  [1156.0, "k_f_pantry_system", ["a complete cured-meat pantry"], "pantry system"],
  [1163.0, "k_f_salt_work3", ["salt working on a cut of meat"], "salt work"],
  [1178.0, "k_f_fat_dry2", ["potted crock and drying strips"], "fat dry"],
  [1185.0, "k_f_no_wire2", ["a cellar of meat, no wires"], "no wire"],
  [1195.0, "k_f_dark_freezer2", ["a neighbor at a dark thawing freezer"], "dark freezer"],
  [1235.0, "k_f_cure_salt3", ["pink curing salt for hams"], "cure salt"],
  [1247.0, "k_f_meat_cold3", ["meat curing cold in winter"], "meat cold"],
  [1255.0, "k_f_winter_cure", ["snowy winter, curing season"], "winter cure"],
  [1264.0, "k_f_salt_plenty", ["a heavy hand of salt on meat"], "salt plenty"],
  [1278.0, "k_f_smell_meat", ["smelling cured meat to check it"], "smell meat"],
  [1300.0, "k_f_safe_cured3", ["safely cured meats on a table"], "safe cured"],
  [1314.0, "k_f_correct_vs_spoil", ["good cured meat beside spoiled"], "correct vs spoil"],
  [1331.0, "k_f_timid_salt2", ["a timid pinch of salt"], "timid salt"],
  [1341.0, "k_f_warm_spoil2", ["meat spoiling in a warm room"], "warm spoil"],
  [1351.0, "k_f_full_salt2", ["a cut fully salted in the cold"], "full salt"],
  [1366.0, "k_f_water_leaving", ["water leaving a cut of meat"], "water leaving"],
  [1404.0, "k_f_fry_bacon2", ["frying home-cured bacon"], "fry bacon"],
  [1416.0, "k_f_proud_meat", ["proud hands with home-cured meat"], "proud meat"],
  [1432.0, "k_f_recipes2", ["handwritten meat recipes"], "recipes"],
  [1444.0, "k_f_offgrid_family2", ["a self-sufficient family with meat"], "offgrid family"],
  [1463.0, "k_f_milk_cream2", ["fresh milk and cream"], "milk cream"],
];

// COLD OPEN (1.8–52): hero images.
const HERO = ", realistic color photograph, natural color, cinematic lighting, shallow depth of field, sharp focus, highly detailed, no text, no captions, no watermark, no logo";
const IMG_STYLE = ", realistic color photograph, natural vivid colors, sharp focus, well lit, clean, no text, no captions, no watermark, no logo";
const COLD_END = 52.0;
const hero = (id, prompt) => ({ name: id, prompt: prompt + HERO });
const COLD_OPEN = [
  { id: "k_h_ham", start: 1.8, dur: 3.6, kind: "raw", src: "img/k_h_ham.png", darken: 0,
    gen: { type: "image", ...hero("k_h_ham", "a beautiful aged cured ham hanging from a hook in a rustic Amish smokehouse, warm shaft of light, dark wood, a year old and perfectly good") } },
  { id: "k_h_smokehouse", start: 5.4, dur: 3.2, kind: "raw", src: "img/k_h_smokehouse.png", darken: 0,
    gen: { type: "image", ...hero("k_h_smokehouse", "the dim interior of an old wooden smokehouse, several hams and sides of bacon hanging in faint drifting smoke, no machinery anywhere, warm and shadowed") } },
  { id: "k_h_impact1", start: 8.6, dur: 5.2, kind: "impact", image: "img/k_h_slice.png",
    setup: "No fridge. No freezer.", impact: "Kept a whole year.", impactAccent: "good", hitAt: 2.0, boom: 0, darken: 0.46 },
  { id: "k_h_slice", start: 13.8, dur: 4.0, kind: "raw", src: "img/k_h_slice.png", darken: 0,
    gen: { type: "image", ...hero("k_h_slice", "a knife cutting a thin rosy slice from a cured smoked ham on a wooden board, rich color, warm kitchen light, mouthwatering") } },
  { id: "k_h_keyphrase", start: 17.9, dur: 4.6, kind: "keyphrase", text: "No machine. Just salt and smoke.", src: "img/k_h_nomachine.png", accent: "good", fontSize: 92,
    gen: { type: "image", ...hero("k_h_nomachine", "a plain dark smokehouse interior with hanging cured meat, not a single appliance or wire, only wood and smoke and salt, quiet and old") } },
  { id: "k_h_salt", start: 22.6, dur: 4.0, kind: "raw", src: "img/k_h_salt.png", darken: 0,
    gen: { type: "image", ...hero("k_h_salt", "coarse white curing salt being poured over a fresh cut of pork in a wooden box, macro, the old way of preserving") } },
  { id: "k_h_supper", start: 26.6, dur: 4.2, kind: "raw", src: "img/k_h_supper.png", darken: 0,
    gen: { type: "image", ...hero("k_h_supper", "an Amish family table at supper with sliced cured ham, warm lamplight, plain and content, winter evening") } },
  { id: "k_h_winterfarm", start: 30.8, dur: 4.0, kind: "raw", src: "img/k_h_winterfarm.png", darken: 0,
    gen: { type: "image", ...hero("k_h_winterfarm", "an Amish farmstead in deep snow, a small smokehouse with a wisp of smoke, the old self-sufficient way of life, cold blue winter") } },
  { id: "k_h_impact2", start: 34.8, dur: 5.0, kind: "impact", image: "img/k_h_cellar.png",
    setup: "The grid goes dark.", impact: "Your meat stays safe.", impactAccent: "good", hitAt: 1.9, boom: 0, darken: 0.46 },
  { id: "k_h_cellar", start: 39.8, dur: 4.2, kind: "raw", src: "img/k_h_cellar.png", darken: 0,
    gen: { type: "image", ...hero("k_h_cellar", "a cool dark stone cellar with cured hams and coils of sausage hanging from the rafters, dim and calm, a whole year of food") } },
  { id: "k_h_hands", start: 44.0, dur: 4.0, kind: "raw", src: "img/k_h_hands.png", darken: 0,
    gen: { type: "image", ...hero("k_h_hands", "weathered old hands lifting a cured ham down from a hook, intimate, warm light, generations of knowing") } },
  { id: "k_h_meats", start: 48.0, dur: 3.9, kind: "raw", src: "img/k_h_meats.png", darken: 0,
    gen: { type: "image", ...hero("k_h_meats", "a rustic table laid with cured meats, salt pork, smoked bacon, dried sausage and a crock of potted meat, abundance with no refrigeration") } },
];

CLIPS.sort((a, b) => a[0] - b[0]);
const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = Number(process.env.CARNE_MINGAP) || 3.2;
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
  fs.writeFileSync("public/broll/match_carne.json", JSON.stringify(match, null, 2));
  console.log(`match_carne.json: ${match.length} clips (avatar-full: ${AV_FULL.length} bloques)`);
  process.exit(0);
}

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

const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const COMPONENTS = [
  { t: 99, id: "cmp_methods", kind: "splitlist", palette: "B",
    title: "Five ways to keep meat — no power", items: ["Salt curing (the $5 box of salt)", "The smokehouse", "The cool cellar", "Potting in fat (confit)", "Drying (jerky)"] },
  { t: 158, id: "cmp_freezertrap", kind: "callout", hue: "red", accent: "danger",
    figure: "Pauses the rot", eyebrow: "A freezer doesn't preserve", caption: "every cut is still spoilable — only a steady feed of electricity holds it at the edge of the cliff",
    bg: "an open chest freezer full of frozen meat" },
  { t: 198, id: "cmp_blackout", kind: "callout", hue: "red", accent: "danger",
    figure: "$1–2k gone", eyebrow: "One winter storm", caption: "the grid blinks, the freezer thaws, and a weekend wipes out a whole side of beef and a hog",
    bg: "ice-coated power lines down in a snowstorm" },
  { t: 302, id: "cmp_secret", kind: "splitlist", palette: "D", cross: true,
    title: "The whole secret", items: ["Rot needs tiny living things — bacteria", "Bacteria must have water to live", "Cold only slows them (never kills)", "The old ways take the water away"] },
  { t: 401, id: "cmp_meatcross", kind: "cross", hue: "amber", title: "Inside a cured ham", eyebrow: "Why it keeps",
    layers: [
      { label: "Salty dry rind — no water left", color: "#e8e2d2", weight: 0.6 },
      { label: "Smoke-sealed skin — flies can't pass", color: "#6b4f2e", weight: 0.5 },
      { label: "Rosy cured meat — good for a year", color: "#b8434a", weight: 1.6 },
    ], marker: { label: "cured to the bone", atDepth: 0.5, color: "good" } },
  { t: 370, id: "cmp_cure", kind: "curediagram", eyebrow: "How the salt cure works", title: "Salt is thirsty",
    saltTag: "salt pulls the water out", waterTag: "bacteria can't live", keepTag: "keeps a year" },
  { t: 451, id: "cmp_curetime", kind: "stat", hue: "amber", accent: "good",
    value: 2, prefix: "1½–", suffix: " days / lb", label: "of curing — kept cold, just above freezing, the old butcher's rule", eyebrow: "How long to cure" },
  { t: 415, id: "cmp_twoways", kind: "splitlist", palette: "G",
    title: "Two ways to salt", items: ["DRY: bury the cut in a salt box", "Re-salt partway, pour off the water", "BRINE: salt water that floats an egg", "Sugar + spices = corned beef, hams"] },
  { t: 564, id: "cmp_curesalt", kind: "mistake", number: "⚠", eyebrow: "SAFETY — DO NOT SKIP",
    title: "Use real curing salt (pink, nitrite)", desc: "For anything smoked or aged, plain salt is NOT enough. The nitrite guards against botulism — invisible, no smell, no taste. Follow the package.",
    bg: "pink curing salt with nitrite measured on a scale" },
  { t: 681, id: "cmp_woods", kind: "chips", hue: "amber",
    title: "Best woods to smoke with", chips: ["hickory", "oak", "apple", "maple", "cherry"],
    bg: "hickory and applewood chips for smoking meat" },
  { t: 716, id: "cmp_smoke", kind: "callout", hue: "amber", accent: "good",
    figure: "Nature's preservative", eyebrow: "Why smoke works", caption: "it seals the surface into a tough skin AND its natural substances kill what causes spoiling",
    bg: "wood smoke drifting through hanging cured meat" },
  { t: 739, id: "cmp_smoketypes", kind: "splitlist", palette: "B",
    title: "Cold smoke vs hot smoke", items: ["COLD: cool, preserves, does NOT cook", "→ needs the cure + curing salt first", "HOT: warm, cooks as it smokes", "→ for sausage & fish you eat soon"] },
  { t: 849, id: "cmp_cellar", kind: "callout", hue: "cold", accent: "good",
    figure: "The pantry", eyebrow: "The cool cellar", caption: "the cellar isn't preserving — the salt and smoke already did. It's just where a year of meat hangs and waits",
    bg: "a cool dark cellar full of hanging cured meat" },
  { t: 884, id: "cmp_confit", kind: "callout", hue: "amber", accent: "good",
    figure: "Sealed in fat", eyebrow: "Potting / confit", caption: "cook the meat in fat, then bury it under a solid cap of fat — no air, no rot. Keeps cooked meat months on a shelf",
    bg: "potted meat sealed under a white cap of fat in a crock" },
  { t: 720, id: "cmp_keeps", kind: "bars", hue: "amber", accent: "good", unit: "months",
    title: "How long it keeps (no power)", eyebrow: "Cured & stored cool",
    bars: [{ label: "Smoked ham / bacon", value: 12, display: "~1 year", winner: true }, { label: "Potted in fat", value: 8, display: "~months", tone: "amber" }, { label: "Dried jerky", value: 8, display: "~months", tone: "amber" }] },
  { t: 225, id: "cmp_freezercost", kind: "bars", hue: "amber", accent: "good", unit: "USD",
    title: "Keeping a year of meat", eyebrow: "Same job",
    bars: [{ label: "Salt + smokehouse", value: 1, display: "~$5 + a build", sub: "no bill, ever", winner: true }, { label: "Chest freezer", value: 60, display: "$500+ & power", sub: "humming all year" }] },
  { t: 983, id: "cmp_drying", kind: "callout", hue: "amber", accent: "good",
    figure: "Just moving air", eyebrow: "Drying / jerky", caption: "thin strips, salted, hung in dry breezy air — the lightest, longest-keeping meat there is",
    bg: "thin strips of salted meat drying in the air" },
  { t: 1075, id: "cmp_butchering", kind: "callout", hue: "amber", accent: "good",
    figure: "Nothing wasted", eyebrow: "Butchering day, late fall", caption: "hams & bacon cured, trimmings to sausage, fat to lard — one hog became a whole year of suppers",
    bg: "a traditional fall hog butchering, nothing wasted" },
  { t: 1105, id: "cmp_numbers", kind: "process", hue: "amber", accent: "amber",
    title: "The numbers to remember", eyebrow: "Get these right",
    steps: [{ title: "Use plenty of salt" }, { title: "1½–2 days per pound" }, { title: "Cure cold, above freezing" }, { title: "Curing salt for smoked/aged" }, { title: "Hang in cool, dark, dry" }] },
  { t: 1149, id: "cmp_system", kind: "splitlist", palette: "G",
    title: "A whole plain system", items: ["Salt — pulls the water, stops the rot", "Smoke — seals the surface", "Cellar — where it hangs & waits", "Fat & dry air — the rest"] },
  { t: 1224, id: "cmp_safety", kind: "checklist", hue: "red", accent: "good",
    title: "Do it safe", eyebrow: "Respect the meat",
    items: [ck("Curing salt for smoked/aged — follow the package"), ck("Cure cold, just above freezing"), ck("Plenty of salt — under-salting is the #1 failure"), ck("Smells foul or slimy? Throw it out")],
    bg: "careful clean handling of curing meat" },
  { t: 1320, id: "cmp_mistake", kind: "mistake", number: "1", eyebrow: "THE ONE MISTAKE",
    title: "Too little salt, or too much warmth", desc: "Both leave water for the rot to take hold. Use the full salt the old recipes call for, and cure in the cold. That's the whole of it.",
    bg: "a meagre sprinkle of salt on a large cut of meat" },
  { t: 1425, id: "cmp_almanac", kind: "callout", hue: "amber", accent: "good",
    figure: "The Plain Almanac", eyebrow: "Below this video", caption: "the salt & brine recipes by weight, a barrel smokehouse, potting, drying, sausage — exactly how much & how long, safe",
    bg: "an old vintage almanac book on a wooden table, warm light" },
  { t: 1459, id: "cmp_next", kind: "nextvideo", kicker: "Next time",
    title: "Keep milk, butter & cream fresh all summer — no ice",
    sub: "Fresh every single day, no cold box of any kind. Meat today, milk next time." },
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
fs.writeFileSync("beatsheet/carne.json", JSON.stringify({ video: "carne", avatar: "carne_opt.mp4", clipsfirst: true, beats }, null, 2));

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
const avTs = `// avatar_carne.gen.ts — GENERADO por build_carne.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_CARNE = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_carne.gen.ts", avTs);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0) + OPEN;
console.log(`=== build_carne ===`);
console.log(`beats: ${beats.length} · clips reales: ${nClip} · img/real: ${beats.length - nClip} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
console.log(`dur min/max: ${beats.length ? Math.min(...beats.map((b) => b.dur)) : 0}s / ${beats.length ? Math.max(...beats.map((b) => b.dur)) : 0}s`);
