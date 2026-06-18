// build_peroxide.mjs — CLIPS-FIRST (estilo "barcos"): cientos de clips reales de
// YouTube matcheados a la narración (~cada 3-6s), avatar Claudio en distintas
// posiciones. NADA de IA (salvo foto del avatar si hiciera falta, vía gpt-image-2).
//
// Modo:
//   node build_peroxide.mjs match   → escribe public/broll/match_peroxide.json
//                                      (entrada de matchclip.mjs)
//   node build_peroxide.mjs         → arma beatsheet/peroxide.json + avatar_peroxide.gen.ts
//                                      (usa solo los clips broll/<name>.mp4 ya bajados)
//
// Flujo: build match → matchclip peroxide → fetch_clips clips_peroxide_matched.json
//        → build → beatsheet.mjs → render farm.
import fs from "fs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1419.1;
const OPEN = 2.5; // avatar abre full antes del 1er clip
const DLDUR = 6;  // segundos a bajar por clip (matchclip)

// avatar a PANTALLA COMPLETA (beats personales/emotivos). Fuera de esto = clips.
const AV_FULL = [
  [110.1, 124.2],   // "My name is Claudio Yoder... raised the plain way"
  [179.0, 192.5],   // "before you raise an eyebrow at an old Amish man"
  [1220.0, 1233.5], // historia del abuelo (arranque)
  [1240.2, 1250.7],
  [1257.8, 1274.3],
  [1280.8, 1308.5], // "the Lord gives us simple answers, son"
  [1354.8, 1368.0],
  [1371.2, TOTAL],  // CTA + outro
];

// [t, name, query, concept]  — concept = lo que se debe VER (EN)
const CLIPS = [
  [2.5, "pe_lane", ["man walking through vegetable garden","farmer walking garden rows"], "an older farmer walking through his vegetable garden"],
  [5.0, "pe_farmhouse", "small farmhouse countryside", "a small farm property in the countryside"],
  [7.5, "pe_worried_farmer", "worried man outdoors farm", "a worried young farmer standing outdoors"],
  [10.5, "pe_seedlings_sill", "seedlings windowsill tray", "a tray of young seedlings on a windowsill"],
  [13.2, "pe_tomato_seedlings", "tomato pepper seedlings indoors tray", "young tomato and pepper seedlings in a tray"],
  [17.4, "pe_seedlings_many", "tray full of seedlings closeup", "dozens of small seedlings in a tray"],
  [20.7, "pe_true_leaves", "seedling first true leaves macro", "a seedling with its first true leaves, macro"],
  [24.1, "pe_damping_off", "damping off seedlings collapse", "seedlings collapsing from damping off disease"],
  [27.5, "pe_seedling_fallen", "wilted seedling fallen over", "a young seedling fallen over and limp"],
  [31.5, "pe_stem_pinch", "thin dark seedling stem soil line", "macro of a thin dark pinched seedling stem at the soil"],
  [34.8, "pe_dead_seedling", "dead collapsed seedling pot", "a dead collapsed seedling in a pot"],
  [38.1, "pe_drive_town", "driving truck rural road", "driving on a rural road toward town"],
  [41.4, "pe_garden_center", "garden center store shelves products", "shelves of products inside a garden center"],
  [44.8, "pe_garden_products", "fertilizer bottles store shelf", "rows of fertilizer bottles on a store shelf"],
  [48.2, "pe_hand_product", "hand taking product off store shelf", "a hand taking a product bottle off a shelf"],
  [51.5, "pe_pay_register", "paying cash store register", "paying money at a store register"],
  [55.0, "pe_lane2", ["person walking in vegetable garden","man walking backyard garden"], "a man walking in a backyard vegetable garden"],
  [58.4, "pe_two_men", "two men talking outside farm", "two men talking outdoors by a farmhouse"],
  [61.7, "pe_mudroom", "rustic mudroom shelf bottles", "a rustic mudroom shelf with bottles"],
  [65.5, "pe_brown_bottle", "brown bottle hydrogen peroxide", "a plain brown bottle of hydrogen peroxide"],
  [68.7, "pe_bottle_hand", "hand holding brown bottle", "a hand holding up a brown bottle"],
  [72.5, "pe_firstaid_shelf", "first aid shelf bandages supplies", "a shelf with bandages and first-aid supplies"],
  [76.0, "pe_medicine_cabinet", "medicine cabinet first aid", "a medicine cabinet with first-aid supplies"],
  [79.5, "pe_cotton_balls", "cotton balls antiseptic", "cotton balls and antiseptic on a shelf"],
  [89.4, "pe_healthy_tray", "healthy green seedlings tray", "a tray of healthy strong green seedlings"],
  [92.8, "pe_strong_seedlings", "strong deep green seedlings", "strong deep green seedlings"],
  [96.0, "pe_seedlings_row2", "row of healthy seedlings", "a row of healthy seedlings reaching up"],
  [99.8, "pe_tomato_plants", "healthy tomato plants garden", "healthy tomato plants in a garden"],
  [103.4, "pe_tomato_basket", "basket of ripe red tomatoes", "a basket full of ripe red tomatoes"],
  [106.7, "pe_veg_share", "baskets of vegetables harvest", "baskets of vegetables to give away"],
  [124.2, "pe_hand_tools", "simple old hand garden tools", "simple old hand garden tools"],
  [127.6, "pe_hands_soil", "weathered hands holding dark soil", "weathered hands holding dark crumbly soil"],
  [131.0, "pe_shelf_items", "rustic shelf household items", "a rustic shelf of simple household items"],
  [134.2, "pe_bottle_close", "hydrogen peroxide bottle closeup", "close up of a brown peroxide bottle"],
  [137.7, "pe_garden_work", "person working vegetable garden", "a person quietly working in a vegetable garden"],
  [141.0, "pe_garden_rows", "vegetable garden rows healthy", "rows of a healthy vegetable garden"],
  [144.2, "pe_bottle_pharmacy", "hydrogen peroxide pharmacy shelf", "a peroxide bottle on a drugstore shelf"],
  [150.9, "pe_bottle_label", "hydrogen peroxide bottle label closeup", "close up of a hydrogen peroxide bottle label"],
  [154.3, "pe_skinned_knee", "antiseptic cotton first aid knee", "first-aid antiseptic on cotton"],
  [157.6, "pe_drugstore_aisle", "drugstore pharmacy aisle", "a drugstore pharmacy aisle"],
  [161.3, "pe_cheap_bottle", "cheap brown bottle inexpensive", "a cheap inexpensive brown bottle"],
  [164.9, "pe_garden_tour", "walking through vegetable garden", "walking through a vegetable garden"],
  [168.6, "pe_raised_beds", "raised vegetable garden beds", "raised vegetable garden beds"],
  [171.8, "pe_expensive_products", "expensive garden products price tags", "expensive garden products with price tags"],
  [175.5, "pe_store_shelf2", "garden store product shelf", "a garden store product shelf"],
  [192.5, "pe_bottle_pickup", "hand picking up bottle", "a hand picking up a brown bottle"],
  [195.7, "pe_label_3pct", "bottle label three percent closeup", "close up of a 3% label on a bottle"],
  [199.4, "pe_chem_formula", "chemistry molecule model", "a simple chemistry molecule model"],
  [202.8, "pe_glass_water", "clear glass of water", "a clear glass of water"],
  [206.4, "pe_water_pour", "pouring clear water closeup", "pouring clear water, closeup"],
  [209.9, "pe_water_drops", "water droplets macro", "water droplets, macro"],
  [213.4, "pe_peroxide_pour", "pouring hydrogen peroxide dish", "pouring hydrogen peroxide into a dish"],
  [217.9, "pe_oxygen_bubbles", "oxygen bubbles rising liquid", "oxygen bubbles rising in a liquid"],
  [221.4, "pe_fizz", "hydrogen peroxide fizzing foaming", "hydrogen peroxide fizzing and foaming"],
  [225.5, "pe_bubbles_macro", "bubbles forming macro", "macro of bubbles forming"],
  [229.5, "pe_fizz2", "peroxide bubbling surface", "peroxide bubbling on a surface"],
  [233.5, "pe_bubbles_burst", "bubbles rising bursting", "bubbles rising and bursting"],
  [239.0, "pe_oxygen_release", "bubbles oxygen water", "fizzing bubbles releasing into water"],
  [243.0, "pe_clear_water2", "clear water droplets closeup", "clear water droplets, closeup"],
  [248.9, "pe_pure_water", "pure clean water pouring", "pure clean water pouring"],
  [252.5, "pe_rain_leaf", ["rain drops on tomato leaves close up","raindrops on garden plant leaves macro"], "raindrops on green tomato leaves, macro"],
  [256.2, "pe_dark_soil", "rich dark garden soil", "rich dark garden soil"],
  [259.7, "pe_soil_hands2", "soil in hands garden", "garden soil in hands"],
  [263.8, "pe_child_garden", "child in vegetable garden", "a child in a vegetable garden"],
  [267.0, "pe_garden_lush", "lush green garden plants", "lush green garden plants"],
  [270.3, "pe_thunderstorm", ["rain falling on vegetable garden","rain over garden plants"], "rain falling over a vegetable garden"],
  [273.6, "pe_green_after_rain", ["wet green vegetable garden after rain","lush garden after rain"], "a lush wet vegetable garden after rain"],
  [277.2, "pe_garden_dew", "garden plants morning dew", "garden plants glistening with morning dew"],
  [281.2, "pe_storm_clouds", ["rain clouds over farm field","dark clouds over vegetable garden"], "dark rain clouds over a garden field"],
  [284.4, "pe_hose_water", "watering garden with hose", "watering a garden with a hose"],
  [288.0, "pe_rain_garden", ["rain on vegetable plants garden","rain falling on garden plants"], "rain falling on garden vegetable plants"],
  [292.0, "pe_rain_drip", ["rain dripping off plant leaves close up","water dripping green leaves garden"], "rain dripping off green plant leaves, close up"],
  [296.0, "pe_wet_foliage", ["wet vegetable leaves after rain","wet green garden foliage"], "wet green vegetable plant leaves after rain"],
  [298.5, "pe_lightning", ["heavy rain pouring on garden plants","downpour on vegetable garden"], "heavy rain pouring on a garden"],
  [301.9, "pe_heavy_rain", ["heavy rain on garden plants","heavy rain on green plants"], "heavy rain on garden plants"],
  [305.7, "pe_raindrops_slowmo", ["water droplets on green leaf macro","water drops plant leaf slow motion"], "water droplets on a green leaf, macro"],
  [309.4, "pe_rain_air", ["rain falling on green plants garden","rain shower garden plants"], "rain falling on green garden plants"],
  [312.8, "pe_pour_plant", "pouring liquid on garden plant", "pouring liquid onto a garden plant"],
  [316.3, "pe_plants_thriving", "thriving green garden plants", "thriving green garden plants"],
  [319.6, "pe_plants_rain", ["vegetable plants in the rain","garden plants getting rained on"], "vegetable plants in the rain"],
  [322.8, "pe_fresh_veg", "fresh harvested vegetables", "fresh harvested vegetables"],
  [326.1, "pe_veg_food2", "vegetables food garden", "vegetables growing as food"],
  [329.8, "pe_sun_after_rain", ["sunlight on wet green garden plants","sun on wet vegetable garden"], "sunlight on a wet green vegetable garden"],
  [336.5, "pe_seed_packet", "opening seed packet", "opening a seed packet"],
  [339.8, "pe_seeds_palm", "vegetable seeds palm of hand", "vegetable seeds in the palm of a hand"],
  [343.2, "pe_sprout_timelapse", "seed sprouting time lapse", "a seed germinating and sprouting, time lapse"],
  [347.1, "pe_seedling_emerge", "seedling emerging from soil", "a seedling emerging from the soil"],
  [350.8, "pe_seed_macro", "single seed extreme macro", "a single seed, extreme macro"],
  [354.2, "pe_seed_coat", "hard seed coat closeup", "close up of a hard seed coat"],
  [358.5, "pe_seed_inside", "seed cross section sprout", "a seed with the sprout inside"],
  [361.0, "pe_seed_soil_dry", "seed buried in soil", "a seed buried in garden soil"],
  [364.4, "pe_winter_ground", "frozen winter ground", "cold winter ground"],
  [367.8, "pe_seeds_dormant", "seeds resting in soil", "seeds resting in garden soil"],
  [371.0, "pe_seed_wait", "seed in soil waiting", "a seed waiting in the soil"],
  [378.0, "pe_mold_spores", "mold spores macro surface", "mold spores on a surface, macro"],
  [381.3, "pe_moldy_seed", "moldy seed closeup", "a moldy seed, closeup"],
  [385.0, "pe_disease_macro", "plant disease spores macro", "plant disease spores, macro"],
  [388.0, "pe_seed_vulnerable", "sprout breaking seed coat", "a sprout breaking through a seed coat"],
  [391.4, "pe_seed_split", "seed splitting open sprouting", "a seed splitting open as it sprouts"],
  [395.5, "pe_hands_seeds_bowl", "hands seeds over bowl", "hands holding seeds over a bowl"],
  [398.8, "pe_seed_soak", "seeds soaking in water bowl", "seeds soaking in a bowl of water"],
  [402.0, "pe_tablespoon", "measuring tablespoon liquid", "a measuring tablespoon of liquid"],
  [406.1, "pe_pour_cup", "pouring liquid into cup of water", "pouring liquid into a cup of water"],
  [409.3, "pe_seeds_cup", "seeds in cup of water", "seeds in a cup of water"],
  [412.7, "pe_soak_close", "seeds soaking closeup", "close up of seeds soaking in water"],
  [416.3, "pe_bean_seeds", "large bean seeds closeup", "large bean seeds"],
  [419.6, "pe_squash_seeds", "squash pumpkin seeds", "squash and pumpkin seeds"],
  [423.2, "pe_seeds_soaking2", "seeds in water soaking", "seeds soaking in water"],
  [426.6, "pe_seed_germinate", "germinating seed first root", "a germinating seed with its first root"],
  [430.0, "pe_seed_swollen", "soaked swollen seed", "a soaked, swollen seed"],
  [433.5, "pe_sprout_push", "sprout pushing through soil", "a sprout pushing up through soil"],
  [437.1, "pe_sprout_fast", "seedlings sprouting quickly", "seedlings sprouting quickly"],
  [440.4, "pe_clean_seed", "clean healthy seed closeup", "a clean healthy seed"],
  [444.0, "pe_seedling_clean", "clean strong seedling", "a clean strong seedling"],
  [446.9, "pe_planting_seeds", "hands planting seeds soil", "hands planting seeds in soil"],
  [450.4, "pe_seedlings_emerge2", "seedlings emerging row garden", "seedlings emerging in a garden row"],
  [453.8, "pe_seedlings_strong2", "strong young seedlings", "strong young seedlings"],
  [457.2, "pe_seed_rows", "rows of seedlings garden", "rows of seedlings in a garden"],
  [460.9, "pe_two_rows", "two rows seedlings one taller", "two rows of seedlings, one ahead of the other"],
  [464.8, "pe_row_compare", "comparing seedling rows", "comparing two rows of seedlings"],
  [468.1, "pe_row_sprouted", "row sprouted seedlings sun", "a row of sprouted seedlings reaching for the sun"],
  [471.3, "pe_seedling_sun", "seedling reaching sunlight", "a seedling reaching toward sunlight"],
  [474.7, "pe_seedlings_thrive", "thriving seedlings tray", "thriving seedlings in a tray"],
  [478.0, "pe_wilted_plant", "wilted garden plant drooping", "a wilted, drooping garden plant"],
  [481.2, "pe_yellow_plant", "yellowing dying plant", "a yellowing, dying plant"],
  [484.5, "pe_root_rot", "root rot diseased roots", "root rot on plant roots"],
  [488.0, "pe_roots_pulled", "plant roots pulled from soil", "plant roots pulled from the soil"],
  [491.3, "pe_roots_dark", "roots in dark soil", "plant roots in dark soil"],
  [494.6, "pe_roots_closeup", "close up plant roots", "a close up of plant roots"],
  [498.0, "pe_roots_breathe2", "white healthy roots soil", "healthy white roots in soil"],
  [501.3, "pe_soil_airy", "loose airy crumbly soil", "loose airy crumbly garden soil"],
  [504.8, "pe_leaves_light", "green leaves sunlight", "green leaves in sunlight"],
  [508.2, "pe_plant_sun", "garden plant in sun", "a garden plant in the sun"],
  [511.6, "pe_overwater", "overwatering potted plant", "overwatering a potted plant"],
  [515.1, "pe_soggy_soil", "soggy waterlogged soil mud", "soggy, waterlogged soil"],
  [518.4, "pe_rain_nonstop", ["flooded garden bed heavy rain","waterlogged garden rain"], "heavy rain flooding a garden bed"],
  [521.7, "pe_waterlogged", "waterlogged flooded garden bed", "a flooded, waterlogged garden bed"],
  [524.9, "pe_roots_wet", "roots in saturated wet soil", "roots in saturated wet soil"],
  [528.4, "pe_muddy_ground", "cold wet muddy ground", "cold wet muddy ground"],
  [531.9, "pe_rotting_roots", "rotting brown plant roots", "rotting brown plant roots"],
  [535.3, "pe_soil_fungus", "fungus growing in soil", "fungus growing in soil"],
  [538.5, "pe_fungus_macro2", "soil fungus macro", "soil fungus, macro"],
  [541.9, "pe_yellow_droop", "yellow drooping plant", "a yellow, drooping plant"],
  [545.8, "pe_droop_leaves", "drooping wilting leaves", "drooping, wilting leaves"],
  [549.3, "pe_limp_plant", "limp wilted plant", "a limp, wilted plant"],
  [552.6, "pe_water_wilt", "watering a wilting plant", "watering a wilting plant"],
  [556.1, "pe_more_water", "pouring water on plant", "pouring more water on a struggling plant"],
  [559.4, "pe_wilt_wet", "wilted plant in wet soil", "a wilted plant in visibly wet soil"],
  [562.8, "pe_sign_wilt", "wilting yellow plant closeup", "a wilting, yellowing plant, closeup"],
  [567.4, "pe_tablespoon2", "tablespoon of liquid pour", "a tablespoon of liquid"],
  [570.6, "pe_mix_cup", "mixing liquid in cup water", "mixing liquid into a cup of water"],
  [574.0, "pe_watering_can", "watering can pouring water", "a watering can pouring water"],
  [577.4, "pe_pour_base", "pouring water base of plant", "pouring water at the base of a plant"],
  [580.8, "pe_soil_drench", "soil drench potted plant", "drenching the soil of a potted plant"],
  [584.1, "pe_water_into_soil", "water soaking into soil", "water soaking down into the soil"],
  [587.3, "pe_roots_revive", "healthy roots reviving", "healthy roots reviving in soil"],
  [590.7, "pe_soil_oxygen", "aerated soil bubbles", "aerated soil"],
  [594.0, "pe_plant_upright", "plant standing back up healthy", "a plant standing back upright, healthy"],
  [597.5, "pe_tomato_recover", "tomato plant garden healthy", "a healthy tomato plant in a garden"],
  [601.0, "pe_plant_green", "green recovered plant", "a green, recovered plant"],
  [604.2, "pe_plant_perk", "perked up green plant", "a perked-up green plant"],
  [608.0, "pe_breath_air", "plant leaves fresh", "fresh green plant leaves"],
  [610.8, "pe_garden_healthy2", "healthy green garden", "a healthy green garden"],
  [614.7, "pe_soil_healthy", "healthy aerated garden soil", "healthy aerated garden soil"],
  [618.0, "pe_dollar_bottle", "brown bottle on table cheap", "a cheap brown bottle on a table"],
  [625.0, "pe_mildew_leaf", "powdery mildew on leaf", "powdery mildew on a leaf"],
  [628.6, "pe_diseased_leaves", "diseased spotted plant leaves", "diseased, spotted plant leaves"],
  [631.8, "pe_leaf_trouble", "fungus on garden leaf", "fungus on a garden leaf"],
  [635.1, "pe_powdery_squash", "powdery mildew squash leaves", "white powdery mildew on squash leaves"],
  [638.9, "pe_cucumber_mildew", "powdery mildew cucumber leaves", "powdery mildew on cucumber leaves"],
  [642.2, "pe_zinnia", "zinnia flowers powdery leaves", "zinnia flowers with powdery leaves"],
  [645.8, "pe_mildew_spread", "powdery mildew spreading plant", "powdery mildew spreading on a plant"],
  [649.4, "pe_gray_mold", "gray fuzzy mold on plant", "gray fuzzy mold on a plant"],
  [652.9, "pe_tomato_blight", "tomato blight spots leaves", "tomato blight spots on leaves"],
  [656.3, "pe_blight_row", "blight on row of tomatoes", "blight running through a row of tomatoes"],
  [660.1, "pe_fungus_plant", "fungus on plant macro", "fungus on a plant, macro"],
  [663.4, "pe_green_leaf_health", "healthy green leaf", "a healthy green leaf"],
  [666.9, "pe_mix_spray", "mixing solution spray bottle", "mixing a solution in a spray bottle"],
  [670.4, "pe_spray_bottle", "garden spray bottle", "a garden spray bottle"],
  [673.7, "pe_pour_spray", "pouring liquid into spray bottle", "pouring liquid into a spray bottle"],
  [676.9, "pe_fill_spray", "filling spray bottle water", "filling a spray bottle with water"],
  [680.4, "pe_evening_garden", ["vegetable garden cloudy overcast day","shaded vegetable garden"], "a shaded vegetable garden on a cloudy day"],
  [683.9, "pe_cloudy_garden", "overcast cloudy garden", "an overcast garden"],
  [687.5, "pe_spray_leaves", "spraying plant leaves mist", "spraying a mist over plant leaves"],
  [691.0, "pe_mist_tops", "misting tops of leaves", "misting the tops of leaves"],
  [695.0, "pe_leaf_underside", "spraying underside of leaf", "spraying the underside of a leaf"],
  [698.4, "pe_mist_macro", "fine mist on leaf macro", "a fine mist settling on a leaf, macro"],
  [701.7, "pe_healthy_leaf2", "healthy green leaf closeup", "a healthy green leaf, closeup"],
  [705.1, "pe_leaf_clean", "clean green leaf no disease", "a clean, disease-free green leaf"],
  [708.6, "pe_spray_plant2", "spraying a garden plant", "spraying a garden plant"],
  [712.1, "pe_garden_spray_routine", "person spraying garden plants", "a person spraying garden plants"],
  [715.4, "pe_guard_plants", "healthy protected garden plants", "healthy, protected garden plants"],
  [719.2, "pe_white_plant", "plant covered powdery mildew", "a plant heavily covered in powdery mildew"],
  [722.6, "pe_first_patch", "first mildew patch on leaf", "a first small patch of mildew on a leaf"],
  [726.2, "pe_inspect_leaf", "inspecting plant leaf closely", "inspecting a plant leaf closely"],
  [730.6, "pe_row_plants", "row of garden plants", "a row of garden plants"],
  [734.0, "pe_mist_seedlings", "misting young seedlings", "misting young seedlings"],
  [737.4, "pe_spray_seedlings", "spraying tray of seedlings", "spraying a tray of seedlings"],
  [740.8, "pe_seedlings_save", "young seedlings recovering", "young seedlings recovering"],
  [744.1, "pe_seedling_upright", "seedling standing upright", "a seedling standing upright"],
  [750.7, "pe_tools_hang", "garden tools hanging shed", "garden tools hanging in a shed"],
  [754.3, "pe_pots_trays", "plant pots seed trays stack", "stacks of plant pots and seed trays"],
  [757.5, "pe_garden_shed", "garden shed tools pots", "a garden shed with tools and pots"],
  [761.0, "pe_diseased_row", "diseased plant in a row", "a diseased plant in a garden row"],
  [764.6, "pe_disease_travel", "hand touching plant row", "a hand moving along a row of plants"],
  [768.3, "pe_prune_tomato", "pruning tomato plant shears", "pruning a tomato plant with shears"],
  [771.5, "pe_pruning_row", "pruning down a row plants", "pruning down a row of plants"],
  [775.2, "pe_pruners_cut", "pruning shears cutting closeup", "close up of pruning shears cutting a stem"],
  [778.7, "pe_blade_plant", "garden blade cutting plant", "a blade cutting a plant stem"],
  [782.3, "pe_spread_hand", "hands working garden plants", "hands working among garden plants"],
  [785.8, "pe_old_pots", "old dirty plastic plant pots", "old dirty plastic plant pots"],
  [789.5, "pe_seed_trays2", "empty seed trays stack", "a stack of empty seed trays"],
  [792.9, "pe_dirty_tray", "dirty seed starting tray", "a dirty seed-starting tray"],
  [796.2, "pe_fill_pot", "filling pot with potting soil", "filling a pot with potting soil"],
  [799.9, "pe_seedlings_pots", "seedlings in small pots", "seedlings growing in small pots"],
  [803.3, "pe_damp_off2", "seedlings damping off pot", "seedlings damping off in a pot"],
  [806.9, "pe_dirty_pot", "dirty empty plant pot", "a dirty empty plant pot"],
  [810.6, "pe_pots_winter", "pots stored over winter", "plant pots stored over winter"],
  [814.0, "pe_potting_bench", "potting bench garden tools", "a potting bench with tools"],
  [817.2, "pe_pour_jar", "pouring liquid into glass jar", "pouring liquid into a glass jar"],
  [820.7, "pe_jar_bench", "jar of liquid on potting bench", "a jar of liquid on a potting bench"],
  [824.3, "pe_spray_bench", "spray bottle potting bench", "a spray bottle on a potting bench"],
  [827.6, "pe_wipe_pruners", "wiping pruning shears clean cloth", "wiping pruning shears clean with a cloth"],
  [831.0, "pe_wipe_blade", "wiping knife blade clean", "wiping a blade clean"],
  [834.2, "pe_clean_blade", "clean garden blade", "a clean garden blade"],
  [837.6, "pe_clean_pot", "cleaning empty plant pot", "cleaning an empty plant pot"],
  [841.0, "pe_spray_tray", "spraying seed tray clean", "spraying a seed tray to clean it"],
  [844.3, "pe_wipe_pot", "wiping down plant pot", "wiping down a plant pot"],
  [847.8, "pe_pot_clean", "clean empty pot ready", "a clean empty pot ready to use"],
  [851.2, "pe_clean_tools", "clean shiny garden tools", "clean shiny garden tools"],
  [855.0, "pe_water_rinse", "clear water rinsing", "clear water rinsing"],
  [858.4, "pe_clean_water3", "clean water pouring", "clean water pouring"],
  [861.7, "pe_fresh_pot", "fresh clean seedling pot", "a fresh clean seedling in a pot"],
  [865.0, "pe_clean_seedling", "clean healthy seedling", "a clean healthy seedling"],
  [869.2, "pe_disinfected_bench", "tidy clean potting bench", "a tidy clean potting bench"],
  [875.9, "pe_soil_pests", "pests in garden soil macro", "small pests in garden soil, macro"],
  [879.7, "pe_soil_surface", "top of soil potted plant", "the top of the soil in a potted plant"],
  [883.0, "pe_fungus_gnats", "fungus gnats houseplant", "fungus gnats flying around a houseplant"],
  [886.5, "pe_gnats_cloud", "cloud of small flies over plant", "a cloud of tiny flies over a plant"],
  [889.8, "pe_water_houseplant", "watering houseplant gnats", "watering a houseplant"],
  [893.2, "pe_potted_sill", "potted plants windowsill", "potted plants on a windowsill"],
  [896.4, "pe_gnat_macro", "fungus gnat macro insect", "a fungus gnat, macro"],
  [899.9, "pe_flies_buzz", "small flies buzzing plant", "small flies buzzing around a plant"],
  [903.6, "pe_larvae_soil", "larvae in soil macro", "larvae in soil, macro"],
  [906.9, "pe_young_roots", "young tender plant roots", "young tender plant roots"],
  [910.4, "pe_roots_eaten", "damaged plant roots", "damaged young plant roots"],
  [914.0, "pe_soil_drench2", "watering potted plant soil", "watering the soil of a potted plant"],
  [917.6, "pe_drench_pour", "pouring water into pot soil", "pouring water into a pot's soil"],
  [921.0, "pe_mix_can2", "mixing solution watering can", "mixing a solution in a watering can"],
  [924.3, "pe_pour_soil2", "pouring liquid into soil", "pouring liquid into soil"],
  [927.6, "pe_fizz_soil", "liquid fizzing on soil", "liquid fizzing on the soil surface"],
  [930.8, "pe_soil_bubbles", "bubbling soil surface", "the soil surface bubbling slightly"],
  [934.1, "pe_plant_unharmed", "healthy potted plant", "a healthy potted plant"],
  [937.6, "pe_clean_soil", "clean dark potting soil", "clean dark potting soil"],
  [941.0, "pe_food_soil", "vegetables growing in soil", "vegetables growing in soil"],
  [944.5, "pe_no_gnats", "clean houseplant no flies", "a clean houseplant with no flies"],
  [947.8, "pe_houseplants_clean", "healthy potted houseplants", "healthy potted houseplants"],
  [951.3, "pe_soil_pests_gone", "clean soil surface plant", "a clean soil surface around a plant"],
  [958.1, "pe_beetle", "beetle on plant leaf", "a hard-shelled beetle on a plant"],
  [961.5, "pe_bug_leaf", "bug crawling on leaf", "a bug crawling on a leaf"],
  [965.1, "pe_rabbit", "rabbit in vegetable garden", "a rabbit in a vegetable garden"],
  [968.4, "pe_deer_fence", ["deer in vegetable garden","deer eating garden plants"], "a deer in a vegetable garden"],
  [971.9, "pe_soil_rot", "rotting soil garden", "rot in garden soil"],
  [975.5, "pe_dollar_value", "single dollar bottle garden", "a cheap bottle in a garden"],
  [982.5, "pe_watering_garden", "watering vegetable garden can", "watering a vegetable garden with a can"],
  [986.1, "pe_green_garden_tonic", "healthy green vegetable garden", "a healthy green vegetable garden"],
  [989.3, "pe_plants_strong", "strong vegetable plants", "strong vegetable plants"],
  [992.6, "pe_plants_thrive2", "thriving vegetable plants garden", "thriving vegetable plants"],
  [996.2, "pe_garden_green3", "green garden all season", "a green, thriving garden"],
  [1000.0, "pe_tablespoon3", "tablespoon poured into water", "a tablespoon poured into water"],
  [1003.4, "pe_jar_water", "jar of water mixing", "a jar of water"],
  [1006.9, "pe_watering_can3", "watering can over garden", "a watering can over a garden"],
  [1010.8, "pe_water_potted2", "watering potted plants", "watering potted plants"],
  [1014.1, "pe_water_routine", "watering garden routine", "watering the garden as usual"],
  [1017.4, "pe_soil_rich", "rich crumbly garden soil", "rich crumbly garden soil"],
  [1020.9, "pe_roots_easy", "healthy roots in soil", "healthy roots in soil"],
  [1024.4, "pe_garden_no_disease", "healthy disease free garden", "a healthy, disease-free garden"],
  [1027.8, "pe_garden_prevent", "thriving prevented garden", "a thriving garden"],
  [1034.4, "pe_garden_well", "lush thriving vegetable garden", "a lush, thriving vegetable garden"],
  [1038.5, "pe_soft_rain", ["light rain on vegetable garden","gentle rain garden plants close up"], "light rain on vegetable garden plants"],
  [1041.9, "pe_rain_gentle", ["rain on garden plants close up","rain on green vegetable leaves"], "rain on green garden plants, close up"],
  [1045.3, "pe_garden_peace", ["healthy vegetable garden rows","thriving backyard vegetable garden"], "healthy green vegetable garden rows"],
  [1048.8, "pe_bottle_shelf2", "bottle on a shelf", "a bottle on a shelf"],
  [1052.2, "pe_cut_flowers", "fresh cut flowers in vase", "fresh cut flowers in a vase"],
  [1055.7, "pe_flowers_vase", "garden flowers vase fresh", "garden flowers in a vase"],
  [1059.0, "pe_flowers_bright", "bright fresh flowers bouquet", "a bright fresh bouquet"],
  [1062.6, "pe_vase_stems", "flower stems in vase water", "flower stems in a vase of water"],
  [1065.8, "pe_seed_potatoes", "seed potatoes cut planting", "seed potatoes cut for planting"],
  [1069.7, "pe_plant_potatoes", "planting seed potatoes soil", "planting seed potatoes in soil"],
  [1073.0, "pe_wash_veg", "washing vegetables in sink", "washing vegetables in a sink"],
  [1076.4, "pe_rinse_berries", "rinsing berries colander water", "rinsing berries in a colander"],
  [1079.7, "pe_veg_basket", "basket of fresh vegetables", "a basket of fresh garden vegetables"],
  [1083.1, "pe_clean_produce", "clean fresh produce water", "clean, fresh produce"],
  [1086.4, "pe_bottle_table", "brown bottle on table", "a brown bottle on a table"],
  [1096.5, "pe_handle_bottle", "carefully handling bottle", "carefully handling a bottle"],
  [1100.1, "pe_pour_careful", "carefully pouring liquid", "carefully pouring liquid"],
  [1103.5, "pe_3pct_bottle", "three percent peroxide brown bottle", "a 3% hydrogen peroxide brown bottle"],
  [1106.8, "pe_drugstore3", "drugstore shelf bottles", "a drugstore shelf of bottles"],
  [1110.4, "pe_ordinary_bottle", "ordinary brown bottle closeup", "an ordinary brown bottle, closeup"],
  [1113.7, "pe_cut_finger", "antiseptic on a finger", "dabbing antiseptic on a finger"],
  [1117.1, "pe_strong_chem", "chemical bottles warning", "stronger chemical bottles"],
  [1120.9, "pe_hazard_bottle", "hazard chemical bottle label", "a hazard-labeled chemical bottle"],
  [1124.4, "pe_no_splash", "warning do not splash chemical", "a strong chemical bottle, handle with care"],
  [1128.0, "pe_gloves", "wearing garden gloves", "wearing garden gloves"],
  [1131.2, "pe_skin_care", "protecting hands chemical", "protecting hands from a chemical"],
  [1134.7, "pe_3pct_pour", "pouring peroxide from brown bottle", "pouring peroxide from a brown bottle"],
  [1138.1, "pe_gentle_bottle", "gentle brown bottle closeup", "a gentle 3% brown bottle"],
  [1141.4, "pe_mix_jug", "mixing liquid with water jug", "mixing liquid with water in a jug"],
  [1145.0, "pe_dilute", "diluting solution water", "diluting a solution with water"],
  [1148.5, "pe_pour_plant_full", "pouring liquid onto plant", "pouring liquid directly onto a plant"],
  [1152.2, "pe_disinfect_tool", "disinfecting steel garden tool", "disinfecting a steel garden tool"],
  [1155.6, "pe_empty_pot2", "empty plant pot clean", "an empty plant pot"],
  [1158.8, "pe_morning_garden", ["vegetable garden morning dew","dew on garden plants morning"], "a vegetable garden with morning dew"],
  [1162.3, "pe_evening_garden2", ["vegetable garden soft light","backyard vegetable garden daytime"], "a vegetable garden in soft daylight"],
  [1166.1, "pe_midday_sun", ["sunny vegetable garden bright daylight","vegetable garden full sun"], "a sunny vegetable garden at midday"],
  [1169.4, "pe_hot_sun_leaf", "hot sun on plant leaves", "hot sun on plant leaves"],
  [1172.8, "pe_scorch_leaf", "sun scorched leaf damage", "a sun-scorched leaf"],
  [1176.0, "pe_test_leaf", "spraying a single leaf test", "spraying a single test leaf"],
  [1179.3, "pe_one_plant", "one potted plant test", "a single potted test plant"],
  [1182.7, "pe_wait_day", "garden plant next day", "a garden plant the next day"],
  [1185.9, "pe_mist_garden", "misting whole garden", "misting a whole garden"],
  [1189.3, "pe_cellar_shelf", "cool cellar storage shelf", "a cool cellar storage shelf"],
  [1192.6, "pe_cupboard", "cupboard with bottles", "a cupboard with bottles"],
  [1196.3, "pe_sunny_sill", "bottle on sunny windowsill", "a bottle on a sunny windowsill"],
  [1199.7, "pe_heat_bottle", "bottle in warm light", "a bottle in warm light"],
  [1203.2, "pe_bottle_weak", "old bottle on shelf", "an old bottle on a shelf"],
  [1206.5, "pe_brown_glass", "brown dark glass bottle", "a brown, dark-glass bottle"],
  [1209.9, "pe_dark_bottle", "bottle in dark cupboard", "a bottle stored in a dark cupboard"],
  [1213.3, "pe_bottle_stored", "bottle stored cool dark", "a bottle stored in a cool dark place"],
  [1233.5, "pe_pepper_tray", "wilted pepper seedlings tray", "a tray of wilted pepper seedlings"],
  [1236.9, "pe_wilted_rain", ["wilted pepper seedlings tray","yellow wilted seedlings tray"], "wilted yellow pepper seedlings in a tray"],
  [1250.7, "pe_mix_can3", "mixing into watering can", "mixing into a watering can"],
  [1254.0, "pe_soak_tray", "watering tray of seedlings", "watering a tray of seedlings"],
  [1274.3, "pe_recovered", "green recovered seedlings", "green, healthy recovered seedlings"],
  [1277.6, "pe_seedlings_reach", "seedlings reaching for light", "seedlings reaching for the light"],
  [1309.5, "pe_recap_soak", "seeds soaking in water", "seeds soaking in water"],
  [1312.9, "pe_recap_drench", "pouring water at plant base", "pouring water at the base of a plant"],
  [1316.5, "pe_recap_spray", "spraying plant leaves", "spraying plant leaves"],
  [1319.8, "pe_recap_leaves", "misting garden leaves", "misting garden leaves"],
  [1323.2, "pe_recap_tools", "wiping garden tools clean", "wiping garden tools clean"],
  [1326.9, "pe_recap_pots", "cleaning plant pots", "cleaning plant pots"],
  [1330.2, "pe_recap_gnats", "fungus gnats over soil", "fungus gnats over soil"],
  [1334.0, "pe_recap_tonic", "watering green garden can", "watering a green garden"],
  [1337.5, "pe_recap_garden", "lush thriving garden rows", "a lush thriving garden"],
  [1341.0, "pe_garden_green_wide", "lush green vegetable garden wide", "a wide lush green vegetable garden"],
  [1348.3, "pe_cheap_bottle2", "cheap brown bottle dollar", "a cheap brown bottle"],
  [1351.6, "pe_garden_center2", "garden center expensive shelf", "an expensive garden center shelf"],
];

CLIPS.sort((a, b) => a[0] - b[0]);

// quita clips que caen dentro de un intervalo de avatar full
const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
// espaciado mínimo entre clips → recorta el total a ~220 (presupuesto ~5h matchclip)
const MINGAP = Number(process.env.PE_MINGAP) || 4.4;
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
  fs.writeFileSync("public/broll/match_peroxide.json", JSON.stringify(match, null, 2));
  console.log(`match_peroxide.json: ${match.length} clips a matchear (avatar-full: ${AV_FULL.length} bloques)`);
  process.exit(0);
}

// ── MODO BUILD: beatsheet (solo clips ya bajados) ────────────────────────────
const have = (name) => fs.existsSync(`public/broll/${name}.mp4`);
const present = clips.filter(([t, name]) => have(name));
const missing = clips.filter(([t, name]) => !have(name)).map((c) => c[1]);

// boundaries: starts presentes + AV starts + TOTAL
const avStarts = AV_FULL.map(([s]) => s);
const bounds = [...present.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;

const beats = present.map(([t, name]) => ({
  id: name,
  start: t,
  dur: +(nextBound(t) - t).toFixed(2),
  kind: "raw",
  src: `broll/${name}.mp4`,
}));

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/peroxide.json", JSON.stringify({ video: "peroxide", avatar: "peroxide_opt.mp4", beats }, null, 2));

// ── ventanas de avatar: full en [0,OPEN) + AV_FULL; hidden el resto; PiP rotando
// cada ~6 clips para que el avatar aparezca en DISTINTAS posiciones sobre el b-roll
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = [];
let k = 0;
for (let i = 0; i < beats.length; i++) {
  if (i % 6 === 3) { // 1 de cada 6 clips lleva PiP del avatar
    pip.push([beats[i].start, beats[i].start + Math.min(beats[i].dur, 7), POS[k % POS.length]]);
    k++;
  }
}
const firstClip = present.length ? present[0][0] : OPEN;
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

const avTs = `// avatar_peroxide.gen.ts — GENERADO por build_peroxide.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_PEROXIDE = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_peroxide.gen.ts", avTs);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0) + OPEN;
console.log(`=== build_peroxide ===`);
console.log(`clips presentes: ${beats.length}/${clips.length}  ·  faltan: ${missing.length}`);
if (missing.length) console.log("  faltantes:", missing.slice(0, 20).join(", ") + (missing.length > 20 ? "…" : ""));
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
console.log(`dur min/max: ${beats.length ? Math.min(...beats.map((b) => b.dur)) : 0}s / ${beats.length ? Math.max(...beats.map((b) => b.dur)) : 0}s`);
