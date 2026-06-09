// build_assets_fly.mjs — emite los 4 archivos de prompts del video "fly" desde
// listas compactas (name + escena), agregando los tails de realismo/negativos.
//   public/img/prompts_fly.json       -> deAPI FLUX (fotos b-roll)
//   public/vid/clips_fly.json         -> deAPI LTX (clips img2video; image = una foto de prompts_fly)
//   public/img/prompts_fly_ref.json   -> gpt-image-2 edits (Claudio, con _avatar_ref.png)
//   public/img/prompts_fly_diag.json  -> gpt-image-2 (diagramas editoriales, esquina sup-der libre)
import fs from "fs";

// ── tails compartidos ────────────────────────────────────────────────────────
const REAL =
  " Natural soft daylight, muted earthy colors, weathered wood and old glass, realistic imperfect handheld camera angle, slightly tilted frame, practical documentary look, no cinematic lighting, no studio setup, natural video compression, low-resolution YouTube documentary screenshot look, casual rural homestead aesthetic, not staged, ultra realistic.";
const NEG =
  " Negative prompt: clean studio product photo, perfect packaging, cinematic lighting, oversaturated colors, fake labels, cartoon, CGI, 3D render, luxury advertisement, sharp perfect text, dramatic shadows, watermark, logo overlay, perfect symmetrical face, extra fingers, distorted hands, blurry face, neon, fantasy style.";
const PHOTO = (core) => "Realistic handheld 16:9 documentary-style video frame of " + core + REAL + NEG;

// avatar: el MISMO hombre de la referencia
const MAN =
  "the SAME older Amish man from the reference image (long grizzled gray beard and mustache, natural straw hat with a black band, off-white collared work shirt with black suspenders, weathered kind face)";
const REF = (core) =>
  "Realistic handheld 16:9 documentary video frame, " +
  MAN +
  ", " +
  core +
  ". Rustic 1903 Amish farmhouse, natural soft daylight, muted earthy colors, imperfect handheld angle, practical documentary look, not staged, ultra realistic. Any text in ENGLISH." +
  " Negative prompt: studio lighting, cinematic, CGI, cartoon, oversaturated, watermark, extra fingers, distorted hands, different person, perfect symmetrical face.";

const DIAG = (core) =>
  "Create a horizontal 16:9 infographic, handmade-but-very-professional illustrated plate, clean premium editorial look (NOT a school poster). " +
  core +
  ". Ivory/cream parchment background with very subtle paper texture, high contrast, dark warm-brown almost-black linework, accents in muted sage olive green and faded terracotta, soft sepia. LEAVE THE TOP-RIGHT CORNER COMPLETELY EMPTY (clean, bright, no text, no drawing) to place an avatar later. Minimalist beautiful composition, very clear, lots of breathing space, few large blocks (ideally 3-4 cards), each with a big number, short title, a simple refined illustration (fine ink, soft watercolor, subtle shadows) and minimal text. One big protagonist element center or center-left. Simple elegant arrows guiding the eye. Understandable in 1 second. All labels in ENGLISH. Vintage botanical / archival textbook illustration look, slightly aged paper. Avoid clutter, tiny text, childish icons.";

// ── FOTOS (FLUX) ─────────────────────────────────────────────────────────────
const PHOTOS = [
  // HOOK — la trampa
  ["fl_jar_sill_flies", "a glass pint mason jar sitting on a weathered wooden farmhouse kitchen windowsill, half an inch of dark brown liquid in the bottom, dozens of dead black houseflies floating in it, a cone of plain brown grocery paper sticking down into the jar, soft morning light, a blurred green garden visible through the old wavy-glass window behind"],
  ["fl_jar_flies_macro", "extreme close macro of the bottom of a glass jar, dark brown molasses water with many drowned black houseflies floating and sunk, brown paper cone edge above"],
  ["fl_dark_liquid_pour", "dark brown molasses being poured as a thin ribbon into a clear glass jar of water on a wooden table, swirling dark"],
  ["fl_brown_bag_table", "a brown paper grocery bag lying on a worn wooden farmhouse table next to a glass jar, plain unprinted brown kraft paper"],
  ["fl_sticky_paper_ceiling", "an old yellow sticky flypaper strip hanging from a farmhouse ceiling with a few flies stuck, dim corner"],
  ["fl_spray_can_counter", "a single red and white aerosol bug spray can standing on a kitchen counter, chemical product, slightly menacing"],
  ["fl_three_dollars", "three crumpled one-dollar bills and a few coins lying on rough weathered wood"],
  ["fl_first_frost", "a farmhouse window with the first autumn frost on the glass, cold morning, faded garden outside"],

  // CLAUDIO / identidad
  ["fl_farm_wide", "a wide establishing shot of a small Amish farm, white clapboard farmhouse built in 1903, a red barn, green pasture, no electric wires, soft overcast daylight"],
  ["fl_beehives_row", "a row of white wooden langstroth beehive boxes in a green meadow on an Amish farm, a few honeybees in the air, wildflowers"],
  ["fl_bees_clover", "close shot of honeybees working purple clover flowers in a sunny front yard"],
  ["fl_pie_stand", "a rustic wooden roadside farm stand with homemade pies under a cloth, handwritten chalk sign, summer"],
  ["fl_house_1903", "an old weathered white farmhouse built in 1903, tall single-pane windows with no screens, wooden porch, ivy, overcast light"],
  ["fl_old_window_noscreen", "an old farmhouse double-hung wooden window open with no insect screen, lace curtain, sunlight, a fly on the glass"],
  ["fl_blue_light_trap", "a blue ultraviolet electric bug zapper glowing in a dim corner, cold blue light, modern, out of place"],

  // EXPONENCIAL / la mosca incomprendida
  ["fl_swatter_hand", "a worn flyswatter lying on a wooden kitchen counter next to a single dead fly"],
  ["fl_flies_garbage_lip", "many houseflies crawling on the dirty metal lip of an open kitchen garbage can"],
  ["fl_flies_dog_dish", "houseflies on the rim of a dog's metal food dish on a wooden floor"],
  ["fl_sugar_bowl_fly", "a fly walking on the rim of an old ceramic sugar bowl on a farmhouse table"],
  ["fl_ripe_bananas", "overripe spotted bananas in a wooden fruit basket with a couple of fruit flies, kitchen"],
  ["fl_maggots_trash", "pale maggots in the bottom of a torn black trash bag under a sink, grimy, documentary, not gory"],
  ["fl_torn_trashbag_sink", "a torn black trash bag leaking under a kitchen sink cabinet, dark damp corner, pipes"],
  ["fl_bread_cooling", "a loaf of homemade bread cooling on a wooden board by a sunny kitchen window, a fly approaching"],

  // INGLESES vs AMISH
  ["fl_fly_on_sandwich", "a single housefly landed on a sandwich on a picnic plate outdoors, summer"],
  ["fl_spray_vs_jar", "a red aerosol spray can next to a simple glass jar trap on a wooden table, side by side comparison"],
  ["fl_cat_counter", "a farm cat licking a kitchen counter where spray residue was, soft worry"],

  // LA MOSCA SUCIA / peligrosa
  ["fl_fly_macro_eyes", "extreme macro of a common housefly head, big red compound eyes, sponge mouthparts, hairy legs, on a white surface"],
  ["fl_fly_proboscis_food", "macro of a housefly on a crumb of food extending its sponge proboscis, regurgitating a droplet, documentary"],
  ["fl_manure_field", "fresh animal manure in a farm field behind a barn, flies hovering, muted daylight"],
  ["fl_gas_station_trash", "an overflowing trash bag at a roadside gas station, flies, grimy urban"],
  ["fl_dead_mouse_garage", "a dead mouse in a dim dusty garage corner, a fly nearby, documentary, not gory"],
  ["fl_fly_coffee_rim", "a housefly walking on the rim of a ceramic coffee cup on a kitchen table, cream jug behind"],
  ["fl_fly_legs_hairs", "extreme macro of a housefly's sticky hairy legs and feet covered in tiny particles, white background"],
  ["fl_petri_bacteria", "several laboratory petri dishes with colorful bacterial colonies on a lab bench, scientific documentary"],
  ["fl_outhouse_old", "an old weathered wooden outhouse behind a farmhouse, tall grass, historic rural"],

  // BISABUELA 1903
  ["fl_grandmother_portrait", "a faded sepia 1900s portrait photograph of a stern Amish woman in a bonnet, antique"],
  ["fl_old_letter", "an old handwritten letter on yellowed paper in fountain-pen cursive, 1903, lying on a wooden table, archival"],
  ["fl_sick_child_bed_old", "a dim 1900s farmhouse bedroom, an empty child's iron bed with a quilt, soft mournful light, historic"],
  ["fl_six_children_sepia", "a faded sepia group photo of six Amish farm children in 1900s clothing standing by a porch, antique"],

  // INGREDIENTES
  ["fl_mason_jar_clean", "a clean empty glass pint mason jar standing on a sunny wooden windowsill, no label"],
  ["fl_pickle_jar", "an old empty glass pickle jar with the label half peeled off, on a wooden table"],
  ["fl_brown_paper_piece", "a torn piece of plain brown kraft grocery paper, no printing, on weathered wood"],
  ["fl_molasses_bottle", "a dark glass bottle of molasses with a simple cream label, thick black syrup visible, on a rustic pantry shelf"],
  ["fl_molasses_spoon", "a wooden spoon lifting thick dark molasses out of a jar, glossy black ribbon"],
  ["fl_honey_syrup_sugar", "a jar of honey, a bottle of maple syrup and a bowl of white sugar lined up on a wooden table"],
  ["fl_grocery_baking_aisle", "a grocery store baking aisle shelf with bottles of molasses, price tags, fluorescent store lighting"],

  // POR QUÉ MELAZA / ciencia
  ["fl_fermentation_bubbles", "macro of dark molasses water with tiny fermentation bubbles rising, in a glass jar, warm light"],
  ["fl_dog_porch_sleep", "an old farm dog asleep on a wooden porch in the afternoon sun"],
  ["fl_sugar_water_clear", "a glass of plain clear sugar water sitting untouched on a windowsill, no flies, boring"],
  ["fl_cornell_paper_1994", "an old academic research paper photocopy from 1994 about fly bait, typed pages on a desk, archival"],
  ["fl_commercial_bait_pack", "a colorful commercial chemical fly-bait product package on a hardware store shelf, plastic, fluorescent lighting"],

  // PASOS DE ARMADO
  ["fl_pour_molasses_jar", "a tablespoon of thick dark molasses being poured into an empty glass mason jar on a wooden counter"],
  ["fl_warm_water_kettle", "warm water being poured from a kettle into a jar of molasses, steam faint, kitchen"],
  ["fl_stir_wooden_spoon", "a hand stirring dark brown molasses water in a jar with the handle of a wooden spoon, uniformly dark"],
  ["fl_dish_soap_drop", "a single drop of yellow dish soap about to fall from a bottle into a jar of dark water, macro"],
  ["fl_fly_sinking_water", "macro of a housefly sunk in dark soapy water in a jar, drowning, surface tension broken"],
  ["fl_roll_paper_cone", "two hands rolling a piece of brown grocery paper into a cone on a wooden table"],
  ["fl_cone_tape", "a brown paper cone taped with a single piece of clear tape, narrow opening the size of a pencil eraser"],
  ["fl_cone_in_jar", "a brown paper cone set narrow-end-down into the mouth of a glass jar of dark molasses water, the tip an inch above the surface"],

  // RESULTADOS / cono genial
  ["fl_jar_sill_morning", "a finished jar trap with brown paper cone on a sunlit kitchen windowsill in the morning, garden outside"],
  ["fl_jar_evening_flies", "the same jar on the windowsill in evening light, a layer of dead flies now in the bottom"],
  ["fl_cone_diagram_real", "side view of a glass jar with a brown paper cone inside, a fly entering the narrow opening, documentary macro"],
  ["fl_fly_bumping_glass", "macro of a housefly bumping against the inside glass wall of a jar above the paper cone, trying to escape upward toward light"],
  ["fl_empty_jar_rinse", "a hand emptying a jar of drowned flies into an outdoor compost, rinsing under a pump, farm"],

  // UBICACIÓN
  ["fl_three_jars_row", "three glass jar fly traps lined up on a wooden shelf, brown paper cones, rustic kitchen"],
  ["fl_jar_high_windowsill", "a jar trap on a high kitchen windowsill catching afternoon light, away from the table"],
  ["fl_jar_on_fridge", "a jar trap sitting on top of an old refrigerator in a farmhouse kitchen, light from a window"],
  ["fl_jar_porch_outside", "a glass jar trap sitting on a wooden porch rail outside near a screen door, garden, ten feet from the house"],
  ["fl_back_door_flies", "flies near an open farmhouse back door, sunlight, threshold, garden beyond"],
  ["fl_jar_pantry_shelf", "a jar trap on a pantry shelf above where a kitchen trash can stands"],

  // SOURCE REDUCTION
  ["fl_walk_kitchen", "a farmhouse kitchen seen from the doorway, sunlight, inspecting for problems, homely clutter"],
  ["fl_lift_trash_lid", "a hand lifting the lid of a kitchen trash can to inspect, flies rising"],
  ["fl_fruit_bowl_apple", "a wooden fruit bowl with one forgotten rotting brown apple among fresh fruit"],
  ["fl_kitchen_drain", "a close shot of an old kitchen sink drain with food residue around it, the most common fly breeding spot"],
  ["fl_boiling_water_drain", "boiling water being poured from a kettle down a kitchen sink drain, steam"],
  ["fl_baking_soda_vinegar", "baking soda and white vinegar foaming in a kitchen sink drain, bubbles"],

  // EL HUMO / smudge
  ["fl_wood_stove_can", "an old black cast-iron wood stove with a battered tin coffee can sitting on the back of it, farmhouse"],
  ["fl_coffee_can_holes", "an old tin coffee can with its lid punched full of nail holes, smoke curling out, on a wood stove"],
  ["fl_dried_herbs_rafters", "bunches of dried herbs hanging from the wooden rafters of an Amish summer kitchen, bay laurel and lavender"],
  ["fl_bay_cloves_dish", "a small ceramic dish with dried bay leaves and whole cloves, spice rack, rustic"],
  ["fl_charcoal_disc", "a black charcoal disc glowing faintly in a ceramic dish, thin smoke rising"],
  ["fl_thin_smoke_kitchen", "thin wispy herb smoke drifting through a sunlit farmhouse kitchen, barely visible"],
  ["fl_flies_to_window", "houseflies gathering on a sunlit farmhouse window pane trying to get out"],
  ["fl_lavender_mint_dried", "dried lavender sprigs and dried mint leaves on a wooden table, muted"],

  // PANORAMA GRANDE
  ["fl_who_report_old", "an old public health pamphlet about flies and disease from the early 1900s, yellowed, archival"],
  ["fl_county_records_book", "an old leather-bound county records ledger open on a desk, handwritten death records, 1920s, archival"],
  ["fl_farmhouse_screens_old", "an old farmhouse window fitted with an early wire insect screen, 1920s, historic"],
  ["fl_aerosol_1968_ad", "a vintage 1968 magazine advertisement for an aerosol bug spray, retro colors, faded paper"],
  ["fl_songbird_yard", "a small songbird perched on a fence in a green farm yard, soft light"],
  ["fl_spray_residue_bread", "a slice of bread sitting on a kitchen counter that was just sprayed, faint chemical mist in the air"],

  // EL TRATO / sistema
  ["fl_system_flatlay", "a flat lay on weathered wood of the whole system: a glass jar, brown paper cone, molasses bottle, a smudge dish with bay and cloves, a kettle, arranged neatly"],
  ["fl_hands_work_wood", "an older man's weathered working hands resting on a rough wooden table, dignified"],

  // CTA / cierre
  ["fl_jar_tonight_sill", "a freshly made jar trap just set on a kitchen windowsill at dusk, hopeful, garden outside"],
  ["fl_comments_map_usa", "a hand-drawn map of the United States with pins, community concept, on a wooden table"],
  ["fl_quiet_kitchen_friday", "a calm tidy farmhouse kitchen on a quiet evening, warm lamplight, no flies, peaceful"],

  // WASP teaser
  ["fl_wasp_macro", "extreme macro of an aggressive paper wasp on weathered wood, yellow and black, menacing"],
  ["fl_wasp_nest_eaves", "a grey paper wasp nest under the wooden eaves of a barn, wasps crawling"],
  ["fl_big_jar_wasp_trap", "a large glass jar wasp trap twice the size of a mason jar on a fence post, brown paper cone, farm"],
  ["fl_porch_dusk_outro", "an Amish farmhouse porch at dusk, a glass jar trap on the rail, warm light in the window, peaceful closing shot"],
];

// ── CLIPS (LTX img2video) — image debe ser una foto de PHOTOS ────────────────
const CLIPS = [
  ["fl_jar_sill_flies", "subtle: dead flies drifting slightly in the dark liquid, soft light shifting, gentle handheld", 120],
  ["fl_dark_liquid_pour", "thick dark molasses pouring and swirling into the water", 90],
  ["fl_fermentation_bubbles", "tiny bubbles slowly rising through the dark molasses water", 120],
  ["fl_stir_wooden_spoon", "the spoon slowly stirring the dark water in a swirl", 90],
  ["fl_dish_soap_drop", "a single drop of dish soap falling and hitting the dark water, ripple", 60],
  ["fl_fly_sinking_water", "a fly slowly sinking beneath the surface of the soapy dark water", 90],
  ["fl_roll_paper_cone", "hands slowly rolling the brown paper into a cone", 90],
  ["fl_fly_bumping_glass", "a fly bumping repeatedly against the inside glass wall trying to escape upward", 90],
  ["fl_pour_molasses_jar", "thick molasses slowly dropping off a spoon into the jar", 75],
  ["fl_warm_water_kettle", "water pouring from the kettle into the jar, faint steam", 75],
  ["fl_thin_smoke_kitchen", "thin herb smoke drifting and curling slowly through sunlit air", 120],
  ["fl_charcoal_disc", "thin smoke rising and curling from the glowing charcoal disc", 120],
  ["fl_coffee_can_holes", "smoke curling out of the nail holes in the tin can lid", 120],
  ["fl_flies_to_window", "flies crawling and fluttering against the sunlit window pane", 90],
  ["fl_boiling_water_drain", "boiling water streaming down into the drain, steam rising", 75],
  ["fl_baking_soda_vinegar", "vinegar and baking soda foaming and bubbling up in the drain", 90],
  ["fl_bees_clover", "honeybees slowly moving over the clover flowers", 120],
  ["fl_beehives_row", "a few honeybees flying around the white hive boxes, grass swaying", 120],
  ["fl_fly_proboscis_food", "the fly's sponge proboscis dabbing at the food, legs shifting", 90],
  ["fl_manure_field", "flies hovering and landing over the manure in the field", 90],
  ["fl_fly_macro_eyes", "the housefly slowly rubbing its front legs together, twitching", 90],
  ["fl_jar_evening_flies", "warm evening light slowly shifting across the jar of flies", 120],
  ["fl_wasp_macro", "the wasp crawling slowly across the weathered wood, antennae moving", 90],
  ["fl_thin_smoke_kitchen2", "", 0], // placeholder removed below
];
CLIPS.pop(); // quitar placeholder

// ── AVATAR REF (gpt-image-2 edits, su cara) ──────────────────────────────────
const REFS = [
  ["fl_av_hold_jar", "holding up a glass jar full of dead flies toward the camera in his farmhouse kitchen, slight proud smile, a sunny window behind"],
  ["fl_av_windowsill", "standing by a sunlit kitchen windowsill where a jar fly-trap sits, looking at it, talking"],
  ["fl_av_beehives", "crouching next to his white wooden beehive boxes in a green meadow, calm, honeybees around"],
  ["fl_av_pie_stand", "standing beside a rustic roadside pie stand with his wife's homemade pies"],
  ["fl_av_roll_cone", "at a wooden table rolling a piece of brown grocery paper into a cone with his hands, focused"],
  ["fl_av_pour_molasses", "pouring thick dark molasses from a wooden spoon into a glass jar on the kitchen counter"],
  ["fl_av_set_jar_sill", "carefully setting the finished jar trap onto the kitchen windowsill in morning light"],
  ["fl_av_walk_trash", "lifting the lid of a kitchen trash can and looking inside, inspecting, serious"],
  ["fl_av_light_smudge", "leaning over a black wood stove lighting a tin coffee-can smudge with a match, thin smoke rising"],
  ["fl_av_hold_letter", "sitting at a table holding an old yellowed 1903 handwritten letter, reading it gently"],
  ["fl_av_talk_cabin", "talking directly to the camera inside his rustic wood-plank farmhouse, oil lantern and window behind, warm"],
  ["fl_av_porch_jar", "outside on the wooden porch placing a glass jar trap on the rail near the back door"],
  ["fl_av_grocery_bag", "holding an open brown paper grocery bag, taking out a piece of brown paper, kitchen"],
  ["fl_av_point_drain", "crouching at the kitchen sink pointing at the drain, explaining, serious"],
  ["fl_av_stir_jar", "stirring dark molasses water in a jar with a wooden spoon handle at the counter"],
  ["fl_av_closing_porch", "standing on his farmhouse porch at dusk looking out over the farm, warm low light, reflective closing portrait"],
];

// ── DIAGRAMAS (gpt-image-2) ──────────────────────────────────────────────────
const DIAGS = [
  ["dg_fly_exponential", "Title 'ONE FLY'. Show the exponential breeding of a housefly in 4 simple stages with big numbers and arrows: 1) one female fly lays '500 EGGS'; 2) eggs become 'MAGGOTS in 24 HOURS'; 3) 'ADULT FLIES in 7 DAYS'; 4) 'each one lays 500 more', a small multiplying swarm. A clean upward exponential curve in sage green"],
  ["dg_fly_contamination", "Title 'WHERE SHE WALKS'. Show a housefly's dirty journey with 3 small illustrated stops connected by arrows: animal manure, a trash bag, a dead mouse — then a big arrow to a slice of bread on a plate where the fly lands and a callout '351 bacteria species'. Simple, a little unsettling but tasteful"],
  ["dg_molasses_co2", "Title 'WHY MOLASSES'. Left: a jar of molasses water with rising bubbles labelled 'FERMENTATION', releasing little 'CO2' marks that drift right toward a flying fly that follows them. Below, a crossed-out plain glass labelled 'SUGAR WATER — nothing'. Show that the fly cannot tell the CO2 of the jar from a sleeping dog (tiny dog icon)"],
  ["dg_cone_trap", "Title 'HOW THE CONE WORKS'. A clean cross-section side view of a glass jar with a brown paper cone inside, narrow opening pointing down an inch above dark molasses water. Arrows: a fly goes DOWN through the narrow hole (green arrow), drowns in the water, then tries to leave by flying UP and OUTWARD toward the light (red arrows) and bumps the glass, never finding the small hole below it. Label 'enters here', 'drowns', 'looks up, never down'"],
  ["dg_placement", "Title 'THREE JARS'. A simple cut-away map of a farmhouse and yard from the side, with 3 numbered jar icons: 1) kitchen windowsill (not the table), 2) above the trash can / pantry, 3) outside on the porch ten feet from the back door. A small note 'intercept them outside' with an arrow at the yard jar"],
  ["dg_source_reduction", "Title 'FIND THE NURSERY'. A simple cut-away of a kitchen with 4 breeding hotspots circled and numbered: the trash can, under the sink, the fruit bowl, and the kitchen drain (largest, highlighted). Small checkmark list feel"],
  ["dg_smudge", "Title 'THE SMUDGE'. A tin coffee can with nail holes on a wood stove releasing thin smoke labelled 'clove + bay'. Arrows show flies fleeing toward a window and the door, and a portion turning toward a molasses jar on the windowsill. Note 'it does not kill — it drives them out'"],
  ["dg_bargain", "Title 'THE BARGAIN'. A two-column comparison. Left column 'THE JAR' in sage green: only kills flies, costs 3 dollars, lasts a summer, harms nothing — with small icons (jar, smudge dish, clean drain). Right column 'THE SPRAY' in faded terracotta: kills the one fly, but also a honeybee, a songbird and your gut, costs 9 dollars — small icons (aerosol can, dead bee, bird). Clear contrast"],
];

// ── emitir ───────────────────────────────────────────────────────────────────
const photos = PHOTOS.map(([name, core]) => ({ name, prompt: PHOTO(core) }));
const clips = CLIPS.map(([image, motion, frames]) => ({
  name: image,
  image,
  prompt: "Realistic documentary footage, " + motion + ", subtle natural motion, slow, handheld, ultra realistic.",
  frames,
}));
const refs = REFS.map(([name, core]) => ({ name, ref: ["_avatar_ref.png"], prompt: REF(core) }));
const diags = DIAGS.map(([name, core]) => ({ name, prompt: DIAG(core) }));

fs.writeFileSync("public/img/prompts_fly.json", JSON.stringify(photos, null, 2));
fs.mkdirSync("public/vid", { recursive: true });
fs.writeFileSync("public/vid/clips_fly.json", JSON.stringify(clips, null, 2));
fs.writeFileSync("public/img/prompts_fly_ref.json", JSON.stringify(refs, null, 2));
fs.writeFileSync("public/img/prompts_fly_diag.json", JSON.stringify(diags, null, 2));

console.log(`photos: ${photos.length}  clips: ${clips.length}  refs: ${refs.length}  diags: ${diags.length}`);
console.log(`total assets: ${photos.length + clips.length + refs.length + diags.length}`);
