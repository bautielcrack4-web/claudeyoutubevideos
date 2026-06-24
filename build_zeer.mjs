// build_zeer.mjs — CLIPS-FIRST híbrido (estilo "barcos"/"acpipe"): cientos de clips
// reales matcheados a la narración (~cada 5s) + avatar Claudio rotando + componentes
// densos. NICHO: Amish off-grid — keep food cold with NO fridge (zeer pot / pot-in-pot
// + cold pantry + root cellar + spring house). Componente A MEDIDA: ZeerPotDiagram.
// Todo ANCLADO al ms EXACTO del Whisper (captions_zeer.json, TOTAL=882s).
//
// Modo:
//   node build_zeer.mjs match  → public/broll/match_zeer.json (entrada matchfarm)
//   node build_zeer.mjs        → beatsheet/zeer.json + avatar_zeer.gen.ts
//
// Flujo: build match → matchfarm zeer 24 → fetch_parallel (+fetch_bing fallback) → build
//        → node beatsheet.mjs beatsheet/zeer.json → varcheck → render farm.
import fs from "fs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 882.0;
const OPEN = 1.8;   // avatar abre full ≥1s antes del 1er hero (regla dura)
const DLDUR = 6;

// avatar a PANTALLA COMPLETA (beats personales / directos / cierre). Resto = clips.
const AV_FULL = [
  [99.0, 105.4],   // "Let me say a hard thing about that box in your kitchen."
  [372.0, 379.0],  // "Now let me be honest with you about what this pot will and will not do"
  [411.0, 417.2],  // "But hear me clearly, this is not a freezer..."
  [836.0, 844.0],  // "If you do just one thing after this, build the pot."
  [874.5, TOTAL],  // sign-off "Cold today, warm next time... keep it plain."
];

// [t, name, [queries], concept] — concept = lo que se debe VER (EN). Query ESPECÍFICA,
// visual, anclada al TEMA (NUNCA palabra literal del narrador).
const CLIPS = [
  // ── ROADMAP (50–99): stay with me / science / build / 3 methods / system ──
  [52.2, "z_tools", ["old hand tools hanging on a barn wall"], "simple hand tools, nothing electric"],
  [56.3, "z_store", ["rustic general store wooden shelves of simple goods"], "a plain hardware store"],
  [59.5, "z_table", ["two clay flower pots and a bag of sand on a wooden table"], "simple materials on a table"],
  [63.5, "z_evap_macro", ["macro water droplets evaporating off a wet surface in sunlight"], "water evaporating, the science"],
  [67.5, "z_terracotta", ["close up porous unglazed terracotta clay texture"], "porous clay surface"],
  [71.5, "z_stack", ["hands stacking two terracotta flower pots one inside the other"], "nesting two clay pots"],
  [75.5, "z_garden_center", ["terracotta pots and bagged sand at a garden center"], "buying the materials"],
  [79.5, "z_jars_shelf", ["rows of mason jars on rustic cellar shelves"], "preserved food on shelves"],
  [88.5, "z_springhouse1", ["old stone spring house over a running creek in the woods"], "a stone spring house (teaser)"],
  [92.5, "z_cellar_full", ["a well stocked root cellar full of vegetables and jars"], "a full root cellar — the system"],
  [96.0, "z_powerlines", ["power lines silhouetted against a dark stormy sky"], "the grid that quits"],
  // ── THE FRIDGE TRAP (105–153) ──
  [105.8, "z_fridge_night", ["a refrigerator humming in a dark quiet kitchen at night"], "the fridge that never rests"],
  [112.0, "z_fridge_inside", ["interior of an open refrigerator full of food, cold light"], "a fridge running day and night"],
  [116.5, "z_meter", ["an electric utility meter dial spinning"], "a large draw on the power bill"],
  [120.5, "z_bills", ["a stack of utility bills on a kitchen table"], "costing you year after year"],
  [123.5, "z_fridge_mist", ["cold mist rolling out of an open refrigerator"], "the simple job of keeping cool"],
  [126.5, "z_storm", ["dark storm clouds gathering over a rural house"], "the storm most folks forget"],
  [133.0, "z_iceline", ["ice coated power lines sagging in winter"], "an ice line down"],
  [136.5, "z_darkfridge", ["opening a powerless dark refrigerator door"], "a warm closed cupboard"],
  [139.5, "z_spoiled", ["wilted spoiled vegetables being thrown into a bin"], "food beginning to spoil"],
  [142.5, "z_melting", ["melting ice and warm food on a kitchen counter"], "racing the clock"],
  [145.5, "z_farmhouse", ["a calm white amish farmhouse on a summer day"], "the plain folks, no problem"],
  [149.5, "z_nolines", ["a simple amish farm landscape with no power lines"], "cold that came from no wire"],
  // ── THE POT + SCIENCE (159–215) ──
  [159.0, "z_pot_porch", ["a single plain terracotta pot on a shaded wooden porch"], "the first method, the pot"],
  [163.0, "z_potinpot", ["cross section of two nested clay pots with sand between"], "a pot-in-pot cooler"],
  [166.5, "z_zeer_market", ["traditional clay pot evaporative cooler at an old market"], "the zeer, old country"],
  [169.5, "z_nesting", ["hands lowering a small clay pot inside a larger clay pot"], "one pot inside the other"],
  [172.5, "z_sand_pour", ["pouring sand into the gap between two clay pots"], "wet sand packed between"],
  [176.5, "z_law", ["heat shimmer rising off hot ground, a law of nature"], "a simple law of nature"],
  [180.5, "z_lake", ["a person stepping out of a lake, water dripping, a breeze"], "cold stepping out of a lake"],
  [184.5, "z_steam", ["steam rising off a wet stone surface in the sun"], "evaporation carries heat away"],
  [188.5, "z_drying", ["water droplets drying on a warm clay tile"], "water pulling warmth to dry"],
  [192.5, "z_skin", ["wet skin cooling in a breeze, water beading"], "heat pulled out of your skin"],
  [195.5, "z_pot_macro2", ["extreme macro of damp porous terracotta surface"], "out of a clay pot"],
  // ── (ZeerPotDiagram ~199, dur 8) ──
  [200.5, "z_sandwet", ["wet dark sand pressed against a clay pot wall, macro"], "wet sand doing the cooling"],
  [207.5, "z_vapor", ["faint vapor rising into dry warm air"], "moisture pulled off as vapour"],
  [211.5, "z_innerfood", ["crisp fresh vegetables sitting inside a cool clay pot"], "the inner pot left cool"],
  // ── BEST IN DRY HEAT / BUILD INTRO (215–246) ──
  [215.5, "z_dry_ground", ["cracked dry desert earth under a blazing sun"], "drier and hotter, harder it pulls"],
  [219.5, "z_blistering", ["blistering sun and heat waves over arid land"], "a blistering low-humidity day"],
  [228.0, "z_water_pour2", ["pouring water slowly over sand in a clay pot"], "just water doing the work"],
  [233.5, "z_build_intro", ["two clay pots, sand and a cloth laid out to build"], "let me show you how to build it"],
  [237.5, "z_materials_lay", ["building materials neatly laid out on a workbench"], "everything you need"],
  [242.0, "z_garden_pots", ["a display of orange terracotta pots at a garden center"], "from a garden center"],
  // ── MATERIALS (246–270) ──
  [246.5, "z_bigpot", ["a large orange unglazed terracotta pot close up"], "one large terracotta pot"],
  [255.0, "z_smallpot", ["a small terracotta pot held in a hand"], "one smaller pot that fits inside"],
  [260.0, "z_gap", ["measuring the gap between two nested clay pots"], "a gap of an inch or two"],
  [263.5, "z_sandbag", ["a bag of builders sand at a hardware store"], "a bag of plain sand"],
  [266.5, "z_burlap", ["a folded square of burlap cloth on rustic wood"], "burlap or a clean cloth"],
  [270.5, "z_jug", ["pouring water from a simple jug"], "and water — the whole list"],
  // ── STEPS (274–346) ──
  [279.5, "z_plug", ["plugging the drain hole of a clay pot with a cork"], "plug the hole in the outer pot"],
  [285.5, "z_hold", ["water held inside a sealed terracotta pot"], "hold moisture, not drain it"],
  [291.5, "z_sand_bottom", ["pouring a layer of sand into a large clay pot"], "an inch of sand in the bottom"],
  [297.5, "z_setpot", ["setting a small clay pot down onto a bed of sand"], "set the small pot in"],
  [302.5, "z_gap_top", ["top view of even gap around two nested clay pots"], "check the gap all around"],
  [306.5, "z_fillring", ["filling sand into the ring between two clay pots"], "fill the ring with sand"],
  [311.5, "z_pack", ["packing damp sand gently with fingers in a pot"], "pack it gently"],
  [313.5, "z_sponge", ["wet sand absorbing water, macro"], "the sand is your sponge"],
  [318.5, "z_soak", ["soaking sand with water poured into a clay pot"], "soak that sand"],
  [323.5, "z_darksand", ["water darkening dry sand as it soaks in"], "dark and wet all through"],
  [330.5, "z_innerempty", ["a clean empty inner terracotta pot"], "not the inner pot"],
  [335.5, "z_clothlid", ["a damp cloth draped over a clay pot as a lid"], "wet cloth over the top as a lid"],
  [340.5, "z_wetcloth", ["a wet cloth covering a vessel, macro droplets"], "damp cloth keeps the cool in"],
  // ── PLACEMENT + CHORE (346–372) ──
  [346.5, "z_shade_porch", ["a clay pot cooler in a shaded corner of a porch"], "where you put it matters"],
  [356.5, "z_breeze", ["a gentle breeze moving leaves in dappled shade"], "a little breeze can reach it"],
  [360.5, "z_shadyporch", ["a shady breezy farmhouse porch with hanging plants"], "shade and moving air"],
  [364.0, "z_fullsun", ["harsh full sun beating on a bare porch"], "full sun fights against it"],
  [369.0, "z_topup", ["watering the sand ring of a pot cooler with a can"], "top up the sand once or twice a day"],
  // ── WHAT IT KEEPS (379–411) ──
  [387.0, "z_freshvsspoil", ["fresh crisp produce beside wilted spoiled produce"], "food that turns vs food that keeps"],
  [391.5, "z_crisp", ["crisp fresh vegetables staying firm"], "keeps for days or weeks"],
  [394.5, "z_potkeeps", ["fresh produce staying crisp inside a clay pot"], "food keeping for days"],
  [401.0, "z_greens", ["fresh leafy green lettuce close up, dewy"], "leafy greens stay good a week"],
  [405.0, "z_rootveg", ["carrots, peppers and tomatoes on a wooden board"], "root vegetables, peppers, tomatoes"],
  [408.5, "z_eggsbutter", ["farm eggs, a pat of butter and soft cheese on a board"], "eggs, butter, soft cheeses"],
  // ── WARNINGS (417–445) ──
  [417.5, "z_rawmeat", ["raw meat and a jug of fresh milk on a counter"], "not for raw meat or fresh milk"],
  [420.5, "z_salesman", ["a slick salesman gesturing, untrustworthy"], "anyone who tells you different"],
  [428.5, "z_milkcans_tease", ["old milk cans standing in cold running water"], "a better method, coming to it"],
  [425.0, "z_milkjug", ["a jug of fresh milk set aside on a counter"], "milk needs a colder method"],
  [431.5, "z_arid", ["a dry arid landscape under a clear sky"], "the drier your air, the better"],
  [438.0, "z_humid", ["a damp humid foggy morning over wet ground"], "a damp humid climate slows it"],
  [442.5, "z_dryfield", ["bright sun over a dry summer field"], "fits the dry-heat day best"],
  // ── TRANSITION → PANTRY (446–468) ──
  [446.5, "z_reliable", ["a sturdy clay pot cooler on a porch, dependable"], "it will not let you down"],
  [450.5, "z_produce", ["a basket of fresh garden produce"], "cold for your produce"],
  [451.5, "z_oldpantry", ["an old amish cold pantry with stocked shelves"], "what the old families did"],
  [455.5, "z_longstore", ["crocks and jars for long term food storage"], "cold for months"],
  [460.0, "z_stonehouse", ["a thick walled old stone farmhouse"], "the house itself becomes the cooler"],
  // ── COLD PANTRY (461–525) ──
  [461.5, "z_pantry1", ["a cool dim pantry with deep wooden shelves"], "the cold pantry"],
  [466.0, "z_pantrycloset", ["a pantry closet built into a home"], "make one in your house"],
  [469.5, "z_sunarc", ["the sun arcing low over a house roof"], "heat comes from the sun"],
  [472.5, "z_northside", ["the cool shaded north side of a house"], "never the north side"],
  [478.5, "z_thickwall", ["the interior of a thick stone wall, cool"], "they built that wall thick"],
  [482.5, "z_masonry", ["stone and brick masonry wall close up"], "stone, brick, heavy plaster"],
  [485.5, "z_wallcross", ["cross section of a thick insulating wall"], "what a thin wall cannot"],
  [489.5, "z_coolwall", ["a cool stone wall at dawn"], "hold the cool of the night"],
  [492.5, "z_thermalmass", ["heavy stone blocks holding temperature"], "thermal mass"],
  [495.5, "z_sunwall", ["sun slowly warming a heavy stone wall"], "a heavy wall warms up slowly"],
  [501.5, "z_coolnight", ["a cool calm night over a farmhouse"], "the cool night resets it"],
  [506.5, "z_steadycool", ["a dim cool larder, steady and still"], "steady and cool all summer"],
  [513.5, "z_deepshelves", ["deep pantry shelves with a stone slab"], "deep shelves and stone slabs"],
  [519.5, "z_vents", ["a low wall vent and a high wall vent"], "a vent low and one up high"],
  [524.0, "z_larder", ["a still cool dim larder breathing out heat"], "quietly breathing out its heat"],
  // ── MAKE A PANTRY TODAY (525–568) ──
  [533.5, "z_closet", ["a cool dark storage closet"], "the coldest room or closet"],
  [538.5, "z_corner", ["a shaded corner of a room that never sees sun"], "a corner that never sees sun"],
  [540.5, "z_pantrydoor", ["closing a pantry door against the warm house"], "keep it shut"],
  [543.5, "z_lowshelf", ["jars and root vegetables on a low shelf"], "jars and root vegetables low"],
  [549.5, "z_cheesecrocks", ["wheels of cheese and stoneware crocks on stone"], "hard cheeses and crocks"],
  [555.5, "z_pantryfull", ["a well stocked cool pantry corner"], "how much a plain corner can hold"],
  [561.5, "z_cellarsteps", ["worn stone steps leading down into a cellar"], "true deep year-round cold"],
  [565.5, "z_undergroundcool", ["a cool dim underground cellar"], "holds through a heat wave"],
  // ── ROOT CELLAR (568–667) ──
  [568.5, "z_digearth", ["a shovel digging down into cool dark earth"], "you go into the ground"],
  [572.5, "z_rootcellar1", ["the interior of a classic stone root cellar"], "the root cellar"],
  [576.5, "z_cellarstore", ["a root cellar full of stored vegetables"], "this was the refrigerator"],
  [580.5, "z_earthwalls", ["cool earthen walls of an underground cellar"], "ran on the earth itself"],
  [584.5, "z_soillayers", ["a cross section of cool soil layers underground"], "the wonder of the ground"],
  [589.5, "z_soilpit", ["a deep soil profile exposed in a pit"], "dig down a few feet"],
  [593.5, "z_coolearth", ["cool damp dark earth deep underground"], "steady temperature all year"],
  [598.5, "z_seasons", ["a split of a summer field and a frozen winter field"], "not August, not January"],
  [601.5, "z_calmcellar", ["a calm quiet underground cellar"], "the same cool every day"],
  [605.5, "z_hillsidecellar", ["a stone room dug into a grassy hillside"], "a room in the steady cool"],
  [610.5, "z_cellardoor", ["a wooden cellar door set in a grassy hillside"], "into a hillside or under the barn"],
  [614.5, "z_earthshelves", ["cool earthen cellar shelves of food"], "the earth does the work"],
  [619.5, "z_nomachine", ["a quiet stone cellar with no machines"], "never sends a bill"],
  // ── (cmp_holds chips ~627) ──
  [627.5, "z_potatobins", ["wooden bins of potatoes, carrots and beets"], "potatoes, carrots, beets, months"],
  [632.5, "z_apples", ["apples stored in straw so they do not touch"], "apples and pears all winter"],
  [636.5, "z_hangveg", ["onions, garlic and winter squash hanging to store"], "cabbages, onions, garlic, squash"],
  [639.5, "z_buttercrock", ["a crock of butter set down in a cool cellar"], "crocks of butter and eggs"],
  [642.5, "z_cannedjars", ["shelves of home canned mason jars"], "every jar you ever canned"],
  [644.5, "z_autumnharvest", ["a full autumn harvest stored in a cellar"], "fill a cellar in the fall"],
  [652.5, "z_backyarddig", ["someone digging a small hole in a backyard"], "you do not need a barn to start"],
  [655.5, "z_barrelcellar", ["a clean barrel sunk into the ground with a lid"], "a barrel sunk in the ground"],
  [661.5, "z_straw", ["straw piled over a buried storage container"], "a lid and a bit of straw"],
  [663.5, "z_minipotatoes", ["potatoes stored in a small buried bin"], "a mini cellar of potatoes"],
  [667.5, "z_simplehole", ["a simple hole dug in a corner of a yard"], "start small"],
  // ── TRANSITION → SPRING HOUSE (668–702) ──
  [669.0, "z_hotsummer", ["a hot summer sun beating over a farm"], "the deep of summer"],
  [673.5, "z_milkcream", ["fresh milk and cream in a glass jug"], "milk, fresh meat, the cream"],
  [680.5, "z_springwater1", ["cold clear spring water flowing over rocks"], "the coldest method of all"],
  [684.5, "z_creek", ["a running creek over smooth stones"], "they let the water carry it"],
  [686.5, "z_springhouse2", ["a small stone spring house exterior in shade"], "the spring house"],
  [690.5, "z_spring_bubble", ["a cold clear spring bubbling up from the ground"], "a cold spring or year-round creek"],
  [695.5, "z_stonehouse_stream", ["a little stone building built over a stream"], "a stone house right over it"],
  [698.5, "z_flowing", ["fast flowing cold stream water"], "something clay nor earth can do"],
  // ── MOVING WATER (702–761) ──
  [702.5, "z_rushing", ["rushing clear cold stream water close up"], "moving water beats the rest"],
  [708.5, "z_springsource", ["spring water emerging cold from mossy rocks"], "steady fifty-some degrees"],
  [710.0, "z_springflow2", ["cold spring water flowing endlessly over rocks"], "running water never stops"],
  [714.5, "z_brook", ["an endless flowing brook in the woods"], "and it never stops"],
  [716.5, "z_stillwater", ["still standing water in a basin warming"], "a pot of standing water warms"],
  [719.5, "z_coldstream", ["a cold mountain stream flowing fast"], "running water brings fresh cold"],
  [722.5, "z_downstream", ["a stream carrying water away downstream"], "carrying the warmth downstream"],
  [727.5, "z_carryaway", ["water rushing over rocks carrying heat away"], "heat carried off and gone"],
  [732.5, "z_streamloop", ["a stream flowing steadily through a forest"], "hour after hour, day and night"],
  [737.5, "z_milkcans", ["old milk cans and crocks set beside flowing water"], "milk cans and cream crocks"],
  [743.5, "z_stonechannel", ["stoneware crocks in a stone water channel"], "down in a stone channel"],
  [749.5, "z_jugscool", ["jugs cooling in cold running water"], "the water held them chilled"],
  [754.5, "z_milkbutter", ["fresh cold milk and firm butter"], "milk sweet and butter firm"],
  [758.5, "z_springinterior", ["the cool dim interior of a stone spring house"], "the coldest spot on the farm"],
  // ── NO SPRING? (768–793) ──
  [768.0, "z_backyard", ["an ordinary suburban backyard"], "most of us have no spring"],
  [773.0, "z_well", ["a bucket lowered into an old stone well"], "a bucket in a cool well"],
  [777.0, "z_crockwater", ["a crock set in cold water at a cellar bottom"], "a crock in cold cellar water"],
  [781.0, "z_jugcloth", ["a jug standing in a tub with a wet cloth over it"], "a jug in a tub of cool water"],
  [789.0, "z_porchsystem", ["a clay pot and a water jug together on a porch"], "spring house and clay pot together"],
  // ── THE WHOLE SYSTEM (793–836) ──
  [796.5, "z_systemall", ["a homestead porch, pantry and cellar together"], "the whole system together"],
  [802.5, "z_potproduce", ["a clay pot cooler full of fresh produce on a porch"], "the clay pot for daily produce"],
  [807.5, "z_finishedpot", ["a finished pot-in-pot cooler with a cloth lid"], "built this weekend for $15"],
  [812.5, "z_northpantry", ["a cool north pantry stocked with jars and cheese"], "the cold north pantry"],
  [820.0, "z_stormproof", ["a calm amish farm under a clearing storm sky"], "no wire to fail"],
  [826.5, "z_winterharvest", ["a root cellar holding a whole winter's harvest"], "the root cellar for winter"],
  [830.5, "z_runningmilk", ["milk crocks cooling in cold running water"], "cold running water for the milk"],
  [833.5, "z_freshfast", ["fresh meat and milk kept cold"], "the things that spoil fastest"],
  // ── CLOSE (844–874) ──
  [844.5, "z_potquiet", ["a quiet clay pot cooler on a porch at dusk"], "cold, quiet, asking for nothing"],
  [850.5, "z_handbook", ["hands opening an old weathered handbook by lamplight"], "the old ways written down"],
  [858.5, "z_oldmethods", ["a montage of crocks, jars and a root cellar"], "dozens more old methods"],
  [868.5, "z_woodstove", ["a cast iron wood stove glowing in a stone hearth"], "next: heating with one stove"],
  [871.5, "z_stonewall_warm", ["a warm stone fireplace wall in a rustic cabin"], "a wall of stone, no furnace"],
];

// COLD OPEN (1.8–50): hero images bespoke (la parte más importante para la retención).
const HERO = ", realistic color photograph, natural color, cinematic lighting, shallow depth of field, sharp focus, highly detailed, no text, no captions, no watermark, no logo";
const IMG_STYLE = ", realistic color photograph, natural vivid colors, sharp focus, well lit, clean, no text, no captions, no watermark, no logo";
const COLD_END = 50.0;
const hero = (id, prompt) => ({ name: id, prompt: prompt + HERO });
const COLD_OPEN = [
  { id: "z_h_reveal", start: 1.8, dur: 3.2, kind: "raw", src: "img/z_h_reveal.png", darken: 0,
    gen: { type: "image", ...hero("z_h_reveal", "weathered hands lifting a damp cloth lid off a plain terracotta pot on a sunlit wooden porch, revealing crisp green vegetables, a pat of butter and brown eggs beaded with cool condensation inside, warm afternoon light") } },
  { id: "z_h_heat", start: 5.0, dur: 3.0, kind: "raw", src: "img/z_h_heat.png", darken: 0,
    gen: { type: "image", ...hero("z_h_heat", "a weathered wooden farmhouse porch baking in harsh afternoon sun, visible heat shimmer in the air, an old analog thermometer on the wall, no appliances anywhere, cinematic") } },
  { id: "z_h_impact1", start: 8.0, dur: 5.0, kind: "impact", image: "img/z_h_reveal.png",
    setup: "94° on the porch.", impact: "~50° in the pot.", impactAccent: "cold", hitAt: 1.9, boom: 0, darken: 0.42 },
  { id: "z_h_pot2", start: 13.0, dur: 5.0, kind: "keyphrase", text: "Nothing is plugged in.", src: "img/z_h_pot2.png", accent: "cold", fontSize: 104,
    gen: { type: "image", ...hero("z_h_pot2", "a lone plain terracotta pot-in-pot cooler sitting on a porch in full afternoon sun, no cord, no outlet, nothing electric anywhere around it") } },
  { id: "z_h_food", start: 18.0, dur: 4.0, kind: "raw", src: "img/z_h_food.png", darken: 0,
    gen: { type: "image", ...hero("z_h_food", "macro of crisp green lettuce, a firm pat of butter and brown eggs inside a cool clay pot, droplets of cold condensation on the produce") } },
  { id: "z_h_butter", start: 22.0, dur: 5.0, kind: "raw", src: "img/z_h_butter.png", darken: 0,
    gen: { type: "image", ...hero("z_h_butter", "extreme close-up of a firm pat of butter and fresh brown eggs resting on a cool clay surface, soft daylight, dewy") } },
  { id: "z_h_grandma", start: 27.0, dur: 7.0, kind: "raw", src: "img/z_h_grandma.png", darken: 0,
    gen: { type: "image", ...hero("z_h_grandma", "a vintage Amish farmhouse kitchen, an older woman's weathered hands lifting a stoneware crock, no refrigerator anywhere, soft window light, nostalgic") } },
  { id: "z_h_oldways", start: 34.0, dur: 7.0, kind: "raw", src: "img/z_h_oldways.png", darken: 0,
    gen: { type: "image", ...hero("z_h_oldways", "a dim root cellar lined with stoneware crocks and mason jars, earthen walls, a single soft shaft of light, deeply shadowed and calm") } },
  { id: "z_h_pot_on_table", start: 41.0, dur: 5.0, kind: "raw", src: "img/z_h_pot_on_table.png", darken: 0,
    gen: { type: "image", ...hero("z_h_pot_on_table", "a finished pot-in-pot clay cooler on a rustic wooden table with a damp burlap lid, warm documentary lighting, humble and real") } },
  { id: "z_h_springhouse", start: 46.0, dur: 4.0, kind: "raw", src: "img/z_h_springhouse.png", darken: 0,
    gen: { type: "image", ...hero("z_h_springhouse", "a small old stone spring house over a clear running creek in dappled shade, mossy stones, the coldest spot on a farm, cinematic") } },
];

CLIPS.sort((a, b) => a[0] - b[0]);
const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = Number(process.env.ZEER_MINGAP) || 3.4;
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
  fs.writeFileSync("public/broll/match_zeer.json", JSON.stringify(match, null, 2));
  console.log(`match_zeer.json: ${match.length} clips a matchear (avatar-full: ${AV_FULL.length} bloques)`);
  process.exit(0);
}

// ── MODO BUILD: beatsheet HÍBRIDO ────────────────────────────────────────────
// pickSrc de 3 niveles (clips-first estándar): clip real > imagen web real > imagen IA.
const have = (name) => fs.existsSync(`public/broll/${name}.mp4`);
const realSrc = (name) => {
  // fetch_bing guarda <name>_1.<ext>/<name>_2.<ext>; tomamos el _1 (mejor rankeado). Fallback sin sufijo.
  for (const suf of ["_1", "", "_2"]) for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    if (fs.existsSync(`public/real/${name}${suf}.${ext}`)) return `real/${name}${suf}.${ext}`;
  }
  return null;
};
const nClip = clips.filter((c) => have(c[1])).length;
const nReal = clips.filter((c) => !have(c[1]) && realSrc(c[1])).length;

const avStarts = AV_FULL.map(([s]) => s);
const bounds = [...clips.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;

const OV = 0.5;
const beats = clips.map(([t, name, query, concept]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  if (have(name)) return { id: name, start: t, dur, kind: "raw", src: `broll/${name}.mp4`, darken: 0 };
  const r = realSrc(name);
  if (r) return { id: name, start: t, dur, kind: "raw", src: r, darken: 0 };
  // para el gen de IA usamos la QUERY VISUAL (no el concept narrado, que puede ser abstracto)
  const vq = Array.isArray(query) ? query[0] : query;
  return { id: name, start: t, dur, kind: "raw", src: `img/${name}.png`, darken: 0, gen: { type: "image", name, prompt: vq + IMG_STYLE } };
});

// reemplazar beats del cold-open por los HERO bespoke
for (let i = beats.length - 1; i >= 0; i--) if (beats[i].start < COLD_END - 1e-6) beats.splice(i, 1);
beats.unshift(...COLD_OPEN);
beats.sort((a, b) => a.start - b.start);

// ── COMPONENTES (valor + variedad) mapeados al ms del guion ──────────────────
const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const COMPONENTS = [
  // roadmap: las 4 técnicas
  { t: 83, id: "cmp_methods", kind: "splitlist", palette: "B",
    title: "Four ways to keep food cold", items: ["The clay pot (zeer) — daily produce", "The cold north pantry", "The root cellar", "The spring house — milk & meat"] },
  // la heladera = trampa
  { t: 105.8, id: "cmp_fridge", kind: "callout", hue: "red", accent: "danger",
    figure: "24 / 7", eyebrow: "Never rests", caption: "the one appliance that runs day and night — one of the largest draws on your power bill",
    bg: "a refrigerator humming in a dark kitchen at night" },
  { t: 119, id: "cmp_fridgecost", kind: "bars", hue: "amber", accent: "good", unit: "USD",
    title: "Keeping food cold — 10 years", eyebrow: "Same job",
    bars: [{ label: "The clay pot", value: 1, display: "$15 once", sub: "+ a little water", winner: true }, { label: "A refrigerator", value: 55, display: "$800+", sub: "the unit + power, 24/7" }] },
  { t: 126.5, id: "cmp_blackout", kind: "callout", hue: "red", accent: "danger",
    figure: "1 day", eyebrow: "When the power dies", caption: "your fridge becomes a warm closed cupboard — the food inside begins to spoil",
    bg: "dark storm clouds gathering over a rural house" },
  { t: 154, id: "cmp_fournofail", kind: "chips", hue: "amber",
    title: "Cold that cannot fail", chips: ["clay", "earth", "water", "shade"],
    bg: "a simple amish farm landscape at golden hour, no power lines" },
  // el componente A MEDIDA: el mecanismo del zeer
  { t: 199, id: "cmp_zeer", kind: "zeerpot", eyebrow: "How the pot works", title: "Wet sand, dry air, cold food",
    inner: { text: "Food ~50°F", sub: "stays cool & crisp" }, sand: { text: "Wet sand", sub: "soaks the outer clay" },
    outer: { text: "95°F dry air", sub: "pulls the moisture out" }, dropTag: "15–25°F cooler", gapTag: "1–2 in" },
  // materiales
  { t: 250, id: "cmp_shoplist", kind: "checklist", hue: "amber", accent: "good",
    title: "What to buy", eyebrow: "≈ $15 total",
    items: [ck("Large unglazed terracotta pot", "$8–10"), ck("Smaller pot that nests inside", "$3–4"), ck("A bag of plain sand", "$2"), ck("Burlap or a clean cloth + water")],
    bg: "terracotta pots and a bag of sand at a garden center" },
  // pasos
  { t: 274.5, id: "cmp_steps", kind: "process", hue: "amber", accent: "amber",
    title: "The build, step by step", eyebrow: "One afternoon",
    steps: [{ title: "Plug the outer pot's hole" }, { title: "Sand bed + nest the inner pot" }, { title: "Fill the ring with sand" }, { title: "Soak the sand" }, { title: "Damp cloth lid" }] },
  // colocación + tarea
  { t: 352, id: "cmp_placement", kind: "callout", hue: "cold", accent: "good",
    figure: "Shade + breeze", eyebrow: "Where to put it", caption: "shade and moving air let the evaporation run — full sun fights against it",
    bg: "a clay pot cooler in the breezy shade of a porch" },
  { t: 366, id: "cmp_chore", kind: "stat", hue: "cold", accent: "good",
    value: 1, suffix: " min/day", label: "the only chore — top up the sand with water", eyebrow: "Maintenance" },
  // salto térmico + qué guarda
  { t: 381, id: "cmp_drop", kind: "stat", hue: "cold", accent: "cold",
    value: 25, suffix: "°F", label: "cooler than the air in dry heat — food that keeps for days or weeks", eyebrow: "How cold it runs" },
  { t: 388, id: "cmp_keepslong", kind: "bars", hue: "cold", accent: "good", unit: "days",
    title: "How long leafy greens last", eyebrow: "In summer heat",
    bars: [{ label: "Warm counter", value: 1, display: "~1 day", tone: "amber" }, { label: "In the pot", value: 6, display: "~6 days", winner: true }] },
  { t: 396, id: "cmp_keeps", kind: "checklist", hue: "good", accent: "good",
    title: "What it keeps", eyebrow: "Days to weeks",
    items: [ck("Leafy greens — most of a week"), ck("Root veg, peppers, tomatoes"), ck("Eggs — weeks"), ck("Butter firm, soft cheeses hold")],
    bg: "fresh greens, eggs, butter and vegetables on a wooden board" },
  // honestidad
  { t: 424, id: "cmp_notfreezer", kind: "mistake", number: "!", eyebrow: "BE HONEST",
    title: "Not a freezer", desc: "No raw meat or fresh milk in summer heat — it doesn't get cold enough, long enough, to keep those safe.",
    bg: "raw meat and a jug of fresh milk on a counter" },
  { t: 434, id: "cmp_dryair", kind: "callout", hue: "amber", accent: "good",
    figure: "Dry heat = best", eyebrow: "Know its limit", caption: "in a damp, humid climate the evaporation slows down — use it for what it's good at",
    bg: "a dry arid landscape under a clear blue sky" },
  // cold pantry
  { t: 474, id: "cmp_pantry", kind: "callout", hue: "cold", accent: "good",
    figure: "North wall", eyebrow: "The cold pantry", caption: "thick stone walls hold the night's cool through the heat of the day — thermal mass",
    bg: "the cool shaded north stone wall of an old farmhouse" },
  { t: 527, id: "cmp_pantrymake", kind: "checklist", hue: "amber", accent: "good",
    title: "Make one today — even renting", eyebrow: "Cold pantry",
    items: [ck("North, coldest room or closet"), ck("Keep it shut against the warm house"), ck("Jars, roots, cheese low on the outer wall"), ck("A corner that never sees sun")],
    bg: "a cool dim pantry corner with deep stocked shelves" },
  // root cellar
  { t: 584, id: "cmp_soil", kind: "cross", hue: "cold", title: "The deeper you go", eyebrow: "Under your feet",
    layers: [
      { label: "Surface — swings hot & cold", color: "#c9a25c", weight: 1 },
      { label: "A few feet — the swing fades", color: "#9c7b46", weight: 1 },
      { label: "Cellar depth — ~55°F all year", color: "#6c5736", weight: 1.5 },
    ],
    marker: { label: "the cellar", atDepth: 0.5, color: "cold" } },
  { t: 607, id: "cmp_cellar4", kind: "checklist", hue: "cold", accent: "good",
    title: "A good cellar wants four things", eyebrow: "Root cellar",
    items: [ck("Cool — from the earth"), ck("Dark — roots won't sprout"), ck("A little damp — won't shrivel"), ck("Breathing — a low and a high vent")],
    bg: "the cool earthen interior of a stocked root cellar" },
  { t: 627, id: "cmp_holds", kind: "chips", hue: "amber",
    title: "What a cellar holds", chips: ["potatoes", "apples", "cabbages", "onions", "squash", "jars"],
    bg: "a root cellar full of stored vegetables and canned jars" },
  { t: 654, id: "cmp_minicellar", kind: "callout", hue: "amber", accent: "good",
    figure: "Start small", eyebrow: "No barn? No hillside?", caption: "a clean barrel or tub sunk in the ground with a lid and straw holds a winter's potatoes",
    bg: "a clean barrel sunk into the ground with a straw covered lid" },
  // spring house
  { t: 705, id: "cmp_spring", kind: "callout", hue: "cold", accent: "good",
    figure: "Running water", eyebrow: "The coldest method", caption: "cold spring water comes out at ~50°F and never stops — forever carrying the warmth downstream",
    bg: "cold clear spring water rushing over mossy rocks" },
  { t: 762, id: "cmp_springuse", kind: "checklist", hue: "cold", accent: "good",
    title: "No spring? Borrow the trick", eyebrow: "Anywhere",
    items: [ck("A bucket in a cool well"), ck("A crock in cold cellar water"), ck("A jug in a tub you keep refilling"), ck("A wet cloth over the top")],
    bg: "a jug standing in a tub of cool water with a wet cloth over it" },
  // recap + cierre
  { t: 795, id: "cmp_system", kind: "splitlist", palette: "G",
    title: "A whole plain system", items: ["Clay pot — daily produce", "Cold pantry — jars & cheese", "Root cellar — winter harvest", "Running water — milk & meat"] },
  { t: 818, id: "cmp_blackoutproof", kind: "callout", hue: "amber", accent: "good",
    figure: "No wire to fail", eyebrow: "Storm-proof", caption: "never one blackout away from losing your food — cold from clay, earth, water and shade",
    bg: "a calm amish farmstead at dusk, no power lines" },
  { t: 852, id: "cmp_almanac", kind: "callout", hue: "amber", accent: "good",
    figure: "The Plain Almanac", eyebrow: "Below this video", caption: "the cellar plans, the pantry and dozens more old methods to keep more of what you earn",
    bg: "an old vintage almanac book on a wooden table, warm light" },
  { t: 864, id: "cmp_next", kind: "nextvideo", kicker: "Next time",
    title: "Heat a whole house with one stove and a wall of stone",
    sub: "No furnace. No propane. No bill. The other half of how we live." },
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

// ── PASE FINAL DE TILING: cero pantallas vacías ──────────────────────────────
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
fs.writeFileSync("beatsheet/zeer.json", JSON.stringify({ video: "zeer", avatar: "zeer_opt.mp4", clipsfirst: true, beats }, null, 2));

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

const avTs = `// avatar_zeer.gen.ts — GENERADO por build_zeer.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_ZEER = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_zeer.gen.ts", avTs);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0) + OPEN;
console.log(`=== build_zeer ===`);
console.log(`beats: ${beats.length} · clips reales: ${nClip} · imágenes IA: ${beats.length - nClip} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
console.log(`dur min/max: ${beats.length ? Math.min(...beats.map((b) => b.dur)) : 0}s / ${beats.length ? Math.max(...beats.map((b) => b.dur)) : 0}s`);
