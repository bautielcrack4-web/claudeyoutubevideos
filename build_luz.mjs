// build_luz.mjs — CLIPS-FIRST híbrido (EN) · canal off-grid de Claudio.
// "Light a whole room with one small flame — the trick the lightbulb companies buried."
// 3 PASADAS: clips (Pexels + YT limpio) · componentes + WaterLensLight a medida ·
// ★ OVERLAYS densos encima de los clips. Sin texto quemado, sin temblor, sin filtros.
import fs from "fs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1332.8;
const OPEN = 2.2;
const DLDUR = 6;

const AV_FULL = [
  [91.1, 115.6],    // intro Claudio
  [375.7, 412.1],   // historia de la bisabuela (personal)
  [1154.7, 1183.0], // "we have been taught... it was never true" (filosófico)
  [1270.9, 1290.0], // "tell me in the comments"
  [1315.4, TOTAL],  // sign-off
];

const CLIPS = [
  // ── COLD OPEN: una vela + un frasco de agua = luz ──
  [2.2, "lz_candle_dark", ["a single candle flame in a dark room","lit candle in darkness close up"], "una sola vela en un cuarto oscuro"],
  [8.2, "lz_candle_table", ["a candle burning on a wooden table","candlelight on a rustic table"], "la vela sobre la mesa"],
  [16.2, "lz_weak_flame", ["a small flickering candle flame macro","dim weak candle flame"], "una llamita débil y temblorosa"],
  [20.4, "lz_fine_print", ["trying to read small print in dim light","hands holding a book in low light"], "no se puede leer letra chica"],
  [28.8, "lz_jar_water", ["a round glass jar full of clear water","clear water in a round glass globe"], "un frasco redondo lleno de agua"],
  [36.8, "lz_same_flame", ["close up of a steady candle flame","candle flame burning calm"], "la misma llama, el mismo fuego"],
  [44.8, "lz_light_pool", ["a bright focused pool of light on a table","concentrated light spot on paper"], "una poza de luz brillante y enfocada"],
  [53.1, "lz_thread_needle", ["threading a needle by lamplight","hands threading a needle close up"], "tan brillante que enhebrás una aguja"],
  [57.3, "lz_handwork", ["fine needlework by candlelight","delicate handwork in warm light"], "el trabajo más fino, con una vela"],
  [66.1, "lz_lacemaker_old", ["antique lacemaking by candlelight","old lace work in dim light"], "lo que entendían las encajeras hace 200 años"],
  [74.0, "lz_lightbulb", ["a glowing electric light bulb","incandescent bulb turning on"], "lo olvidamos cuando llegó la lamparita"],
  [78.2, "lz_old_home_night", ["a rustic home interior lit by an oil lamp at night","warm lamplit cabin at night"], "así iluminaban las casas, de noche, generaciones"],
  // [91-115] AV intro
  [115.6, "lz_great_grandpa", ["old tools and a rustic farmhouse interior","heritage homestead room"], "nada que no pudiera construir tu bisabuelo"],
  [120.3, "lz_cool_pipe", ["white pvc pipe buried in a trench","cooling pipe in soil"], "el caño que enfría (video anterior)"],
  [124.6, "lz_lamp_glow", ["an oil lamp glowing warmly in a room","lantern light in the dark"], "hoy: la luz"],
  [128.4, "lz_switch_wall", ["flipping a light switch on a wall","hand on a light switch"], "lo que nos enseñaron a enchufar y pagar"],
  [141.9, "lz_room_lit", ["a whole room softly lit by a single lamp","cozy room glowing from one lamp"], "una llama, entendida bien, ilumina un cuarto entero"],
  // ── el problema: 3 ladrones ──
  [153.8, "lz_candle_macro2", ["macro of a bright candle flame","candle flame detail"], "¿por qué una vela parece tan débil?"],
  [161.8, "lz_lots_light", ["a candle casting light in all directions","glowing flame radiating light"], "una vela tira bastante luz"],
  [170.4, "lz_light_spread", ["light rays spreading out from a source","glow radiating outward"], "el problema es qué pasa con esa luz"],
  [178.4, "lz_ripples", ["ripples spreading on water surface","concentric ripples from a stone"], "la luz se abre como ondas, en una esfera"],
  [190.6, "lz_far_dim", ["a candle dim across a large dark room","faint light far away"], "lejos del trabajo, llega apenas un hilito"],
  [202.3, "lz_ceiling_waste", ["light glowing on a ceiling and corners","lamplight on the walls and roof"], "la mayoría se va al techo y los rincones"],
  [210.7, "lz_dark_wall", ["a dark sooty wall absorbing light","dark wood wall in shadow"], "segundo ladrón: paredes oscuras"],
  [218.8, "lz_soot_wall", ["dark blackened plaster wall","sooty old wall"], "la pared oscura se traga la luz"],
  [227.0, "lz_concentrate", ["a focused beam of light on work","concentrated light on hands"], "el ojo necesita la luz concentrada donde trabajás"],
  [240.0, "lz_gather_aim", ["focusing light onto a small spot","directing a beam of light"], "juntarla, reflejarla, concentrarla"],
  // ── la lente de agua (custom) ──
  // [255 cmp_lens WaterLensLight]
  [259.6, "lz_round_globe", ["a round clear glass globe","spherical glass flask of water"], "un globo redondo, claro, lleno de agua"],
  [272.9, "lz_lens_spectacles", ["a magnifying lens close up","spectacles lens refracting light"], "lo que hiciste es una lente de verdad"],
  [285.6, "lz_refraction", ["light bending through a glass of water","refraction through a water globe"], "la luz se dobla al pasar por el agua curva"],
  [296.8, "lz_focus_pool", ["light focused into a bright spot","converging light beam"], "los rayos convergen en una poza brillante"],
  [305.1, "lz_lace_europe", ["antique european lace making","historic lacework by candlelight"], "las encajeras de Europa vivían de esto"],
  [313.5, "lz_lace_detail", ["extreme close up of fine lace","delicate handmade lace"], "encaje, el trabajo más delicado que hay"],
  [321.7, "lz_condensing_globe", ["lacemaker condensing globe lamp antique","candle surrounded by water globes"], "el globo condensador: una vela, varios globos"],
  [337.9, "lz_women_sewing", ["women doing needlework by lamplight at night","group sewing in candlelight"], "cuatro mujeres cosiendo de noche con una vela"],
  [346.0, "lz_watchmaker", ["a watchmaker working under a lamp","close watch repair by light"], "relojeros, zapateros, grabadores la usaban"],
  [359.4, "lz_jar_cheap", ["a simple glass jar of water on a table","ordinary jar and water"], "y no cuesta nada: un frasco y agua"],
  // [375-412] AV bisabuela
  [412.1, "lz_grandma_window", ["an old woman sewing by a window at night","elderly woman with needlework by lamplight"], "su lámpara y su botella de agua junto a la ventana"],
  [420.0, "lz_needle_night", ["threading a needle in warm lamplight","fine stitching at night"], "enhebrar la aguja más chica, en pleno invierno"],
  [423.7, "lz_white_cottage_in", ["whitewashed cottage interior bright","white lime washed room"], "y las paredes encaladas, la luz andaba por todos lados"],
  [435.8, "lz_mother_daughter", ["an old woman teaching a child handwork","passing down a skill by lamplight"], "saber común, de madre a hija"],
  [444.8, "lz_bulb_on", ["a bare electric bulb switching on","light bulb glowing"], "y en una generación, llegó la lamparita y se perdió"],
  // ── inverse square ──
  [457.3, "lz_physics_light", ["beam of light fanning out in the dark","light cone spreading"], "una ley: el brillo cae con el cuadrado de la distancia"],
  [469.3, "lz_double_distance", ["candle near a book vs far away","comparing light near and far"], "el doble de lejos, un cuarto de luz"],
  [481.4, "lz_candle_book", ["a candle held right against an open book","reading by a close candle"], "pegada al libro, alcanza; lejos, inútil"],
  [494.2, "lz_spread_thin", ["light spreading thin over a large area","faint glow over a wide space"], "la luz se reparte fina en mucho espacio"],
  [505.9, "lz_reflector_back", ["a curved reflector behind a flame","polished tin behind a lamp"], "el reflector manda hacia vos la mitad de atrás"],
  [518.2, "lz_white_bounce", ["light bouncing off white walls","glow filling a white room"], "las paredes blancas rebotan la luz al cuarto"],
  // ── reflector ──
  [537.9, "lz_light_backward", ["light shining backward off a lamp","glow behind a candle"], "la mitad de la luz se va para atrás, perdida"],
  [555.0, "lz_shiny_tin", ["a piece of polished tin reflector","shiny curved metal sheet"], "algo brilloso detrás de la llama"],
  [563.8, "lz_mirror_behind", ["a mirror reflecting candlelight","candle in front of a mirror"], "un espejo, una chapa, hasta papel aluminio curvado"],
  [575.7, "lz_old_lantern", ["an antique lantern with a reflector","old oil lamp with metal back"], "los faroles viejos tenían reflector atrás"],
  [588.1, "lz_double_light", ["a reflector doubling lamp light brightness","brighter focused lamplight"], "casi duplicás la luz útil hacia vos"],
  [603.6, "lz_lens_reflector", ["lamp with reflector behind and lens in front","focused doubled work light"], "reflector atrás + lente adelante = luz fuerte"],
  // ── whitewash ──
  [612.7, "lz_whitewash_wall", ["brushing white limewash onto a wall","painting a wall white"], "el tercer truco no es la lámpara, es el cuarto"],
  [624.8, "lz_lime_brush", ["whitewashing a stone wall with a brush","applying lime wash"], "encalá las paredes, blancas, con cal barata"],
  [637.4, "lz_white_room_glow", ["a bright whitewashed room full of soft light","glowing white interior"], "el blanco devuelve casi toda la luz al cuarto"],
  [650.1, "lz_dark_swallow", ["a dark room absorbing light","gloomy dark walled room"], "la pared oscura no devuelve casi nada"],
  [662.6, "lz_old_dairy", ["a whitewashed old dairy interior","lime washed farm building inside"], "por eso las casas y tambos viejos eran blancos por dentro"],
  [679.8, "lz_bag_lime", ["a bag of lime and a bucket","slaked lime for limewash"], "una bolsa de cal: la mejora de luz más barata del mundo"],
  // ── todo junto: el candil de aceite ──
  [700.3, "lz_oil_lamp", ["a simple olive oil lamp burning","small oil lamp with a wick"], "una sola llama chica, segura: un candil de aceite"],
  [717.3, "lz_olive_oil", ["pouring olive oil into a lamp","olive oil and a wick"], "aceite de oliva: barato, limpio, casi sin humo"],
  [733.7, "lz_lamp_safe", ["an oil lamp tipped over not spreading fire","safe contained oil lamp"], "si lo volcás, el aceite apaga la mecha, no esparce fuego"],
  [752.9, "lz_setup_all", ["oil lamp with reflector and water globe set up","complete old lighting setup"], "candil + reflector + globo de agua + paredes blancas"],
  [764.9, "lz_bright_work", ["a bright pool of working light from one lamp","focused work light in a room"], "esa llamita ilumina el cuarto y enfoca el trabajo"],
  [780.5, "lz_fine_work_hist", ["historic fine craftsmanship by lamplight","detailed work in old light"], "así se hizo el trabajo más fino por siglos"],
  // ── build details ──
  [797.3, "lz_jam_jar_lamp", ["a homemade oil lamp from a jam jar","diy jar lamp with a wick"], "un candil: un frasco, aceite y una mecha"],
  [813.4, "lz_wick_float", ["a wick floating on oil in a jar","oil lamp wick on a cork"], "la mecha flota y chupa el aceite sola"],
  [829.7, "lz_trim_wick", ["trimming a lamp wick for a small flame","adjusting a wick"], "mecha corta = llama chica y limpia, más brillo"],
  [846.6, "lz_round_bottle", ["a round clear bottle of water as a lens","spherical bottle lens"], "la lente: cuanto más redondo y claro, mejor"],
  [859.0, "lz_clear_water", ["clean clear water in a glass globe","crystal clear water lens"], "agua limpia; el agua turbia dispersa la luz"],
  [875.4, "lz_spoon_reflector", ["a polished spoon reflecting light","curved shiny surface reflecting"], "reflector curvo, como el interior de una cuchara pulida"],
  // [869? cmp_reflector?]
  [895.9, "lz_limewash_again", ["whitewashing a wall bright white","fresh lime wash on a wall"], "la cal: cal y agua, como leche fina"],
  [916.2, "lz_white_dry", ["a freshly whitewashed bright wall","chalky white wall"], "seca a un blanco tiza brillante"],
  [932.1, "lz_white_workshop", ["a bright whitewashed workshop","white walled work room"], "talleres, sótanos, graneros: blancos por la misma razón"],
  [944.9, "lz_pale_walls", ["pale bright room interior","light colored walls glowing"], "antes de mejores lámparas, hacé las paredes claras"],
  [961.5, "lz_dark_vs_white", ["comparing a dark room and a white room","dim vs bright interior"], "cuarto oscuro con lámpara fuerte vs blanco con débil"],
  // ── costo ──
  [978.0, "lz_oil_pennies", ["a little olive oil in a lamp burning","cheap lamp fuel"], "el candil gasta centavos por hora"],
  [994.4, "lz_jar_tin_lime", ["a jar a piece of tin and lime","cheap lighting materials"], "frasco, chapita, cal: unos dólares todo"],
  [1006.6, "lz_blackout_lamp", ["an oil lamp glowing during a power outage","lamplight in a blackout"], "y funciona en un apagón, en una tormenta, sin red"],
  [1019.3, "lz_grid_bill", ["an electricity bill on a table","power utility bill"], "lo moderno: cableado a la red, pagando todos los meses"],
  [1027.6, "lz_dead_flashlight", ["a flashlight with dead batteries in the dark","useless torch in darkness"], "y cuando se corta, a buscar la linterna con pilas muertas"],
  [1035.4, "lz_skill_lost", ["hands lighting an oil lamp skillfully","old lighting know-how"], "cambiamos una destreza nuestra por una factura eterna"],
  // ── 2 errores ──
  [1056.2, "lz_dark_clutter", ["a dark cluttered dim room","gloomy crowded dark room"], "error uno: todo oscuro y amontonado alrededor"],
  [1071.9, "lz_white_behind", ["a white cloth behind the work area","pale board behind a lamp"], "poné una superficie clara detrás del trabajo"],
  [1088.2, "lz_flat_jar_bad", ["a flat sided jar not focusing light","square jar of water"], "error dos: un frasco de lados planos no enfoca"],
  [1099.6, "lz_round_focus", ["a round globe focusing light to a point","spherical lens focusing"], "tiene que ser redondo, una curva real"],
  [1108.2, "lz_slide_focus", ["sliding a lens to focus a bright spot","adjusting lens distance"], "deslizalo hasta que la poza se vuelva nítida"],
  // ── panorama ──
  [1137.7, "lz_warm_capable", ["a warm well-lit cozy old home","comfortable lamplit interior"], "nos dijeron que la vida cómoda se compra, para siempre"],
  [1162.3, "lz_ancestors_read", ["a person reading by lamplight long ago","writing letters by candlelight"], "los que vinieron antes leían y cosían por su propia luz"],
  [1186.9, "lz_three_methods", ["an oil lamp a water globe and a white wall","old lighting elements together"], "el caño, la bomba, la vela: la misma lección"],
  [1203.2, "lz_make_own", ["hands making a simple oil lamp","building your own light"], "casi todo lo podés entender, hacer y poseer"],
  [1211.4, "lz_dark_pushed", ["darkness pushed back by lamplight","light filling a dark room"], "la luz es lo más fácil de sentir: lo hacés esta noche"],
  // ── CTA ──
  [1218.9, "lz_turn_off", ["turning off electric lights at home","switching off a lamp"], "esta noche, apagá la luz eléctrica"],
  [1226.6, "lz_light_one", ["lighting a single candle","striking a match to a candle"], "prendé una vela, mirá lo poco que parece dar"],
  [1234.7, "lz_jar_book", ["a jar of water between a candle and a book","water globe focusing on a page"], "poné el frasco de agua entre la vela y el libro"],
  [1247.4, "lz_print_jumps", ["print becoming clear and bright in a light pool","readable page in focused light"], "deslizá hasta que la letra salte, nítida"],
  [1255.3, "lz_foil_behind", ["foil behind a candle reflecting light","shiny foil reflector"], "ponele papel aluminio atrás y mirá cómo crece"],
  [1263.3, "lz_paint_white", ["painting a room wall white","whitewashing a cabin"], "y la próxima que pintes, hacelo blanco"],
  // ── teaser (comida fría) ──
  [1290.0, "lz_root_cellar", ["a cool root cellar with food","cellar shelves with produce"], "la próxima: comida fría sin heladera"],
  [1298.8, "lz_milk_butter", ["milk butter and meat kept cool","fresh dairy in a cool place"], "leche, manteca, carne, sin electricidad ni hielo"],
  [1303.2, "lz_clay_pot", ["a clay evaporative cooler pot","earthen pot keeping food cool"], "solo tierra, barro y cómo se porta el agua al evaporar"],
];

CLIPS.sort((a, b) => a[0] - b[0]);
const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = Number(process.env.LZ_MINGAP) || 3.0;
const clips = [];
let lastT = -99;
for (const c of CLIPS.filter((c) => !inFull(c[0]))) { if (c[0] - lastT < MINGAP) continue; clips.push(c); lastT = c[0]; }

if (MODE === "match") {
  const match = clips.map(([t, name, query, concept]) => ({ name, concept, query, dur: DLDUR }));
  fs.mkdirSync("public/broll", { recursive: true });
  fs.writeFileSync("public/broll/match_luz.json", JSON.stringify(match, null, 2));
  console.log(`match_luz.json: ${match.length} clips`); process.exit(0);
}

const have = (name) => fs.existsSync(`public/broll/${name}.mp4`);
const IMG_STYLE = ", realistic color photograph, natural vivid colors, sharp focus, well lit, clean, no text, no captions, no watermark, no logo";
const nClip = clips.filter((c) => have(c[1])).length;
const avStarts = AV_FULL.map(([s]) => s);
const bounds = [...clips.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;
const OV = 0.5;
let beats = clips.map(([t, name, , concept]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  if (have(name)) return { id: name, start: t, dur, kind: "raw", src: `broll/${name}.mp4`, darken: 0 };
  return { id: name, start: t, dur, kind: "raw", src: `img/${name}.png`, darken: 0, gen: { type: "image", name, prompt: concept + IMG_STYLE } };
});

const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const COMPONENTS = [
  { t: 44, id: "cmp_hook", kind: "impact", image: "img/cmp_hook_bg.png",
    setup: "One candle. One jar of water.", impact: "Bright enough to thread a needle.", impactAccent: "amber", hitAt: 1.6, boom: 0, darken: 0.4,
    bg: "a candle behind a round jar of water throwing a bright focused pool of light on a table at night" },
  { t: 178, id: "cmp_thieves", kind: "checklist", hue: "amber", accent: "danger",
    title: "Three thieves of light", eyebrow: "Why one candle seems dim",
    items: [ck("Spreading — light fans out in a sphere"), ck("Dark walls — they swallow it"), ck("Not concentrated where you work")],
    bg: "a single candle in a dim dark room, light fading into the corners" },
  // ★ componente a medida — la lente de agua
  { t: 255, id: "cmp_lens", kind: "waterlens", eyebrow: "The masterpiece", title: "A globe of water is a lens",
    flameLabel: "One small flame", lensLabel: "Globe of water = a lens", poolLabel: "Bright pool of light" },
  { t: 247, id: "cmp_art", kind: "process", hue: "amber", accent: "good",
    title: "The whole art", eyebrow: "Not more fire",
    steps: [{ title: "Gather the light" }, { title: "Reflect it forward" }, { title: "Concentrate it on the work" }] },
  { t: 321, id: "cmp_lacemaker", kind: "callout", hue: "amber", accent: "good",
    figure: "1 candle · 4 workers", eyebrow: "The lacemaker's lamp", caption: "water globes around one flame let four women do the finest needlework at night",
    bg: "an antique lacemaker condensing lamp, one candle ringed by glass globes of water" },
  { t: 300, id: "cmp_bright", kind: "bars", hue: "amber", accent: "good", unit: "light",
    title: "Same flame, on your work", eyebrow: "Bare vs through the lens",
    bars: [{ label: "Bare candle", value: 1, display: "dim", tone: "danger" }, { label: "Through the water lens", value: 9, display: "bright", winner: true }] },
  { t: 752, id: "cmp_setup", kind: "annotated", hue: "amber", eyebrow: "Put the three together", image: "img/cmp_setup_bg.png",
    annotations: [
      { kind: "circle", x: 0.30, y: 0.55, w: 0.13, label: "Reflector behind", color: "cold" },
      { kind: "circle", x: 0.50, y: 0.55, w: 0.10, label: "One flame", color: "amber" },
      { kind: "arrow", x: 0.70, y: 0.50, fromX: 0.88, fromY: 0.2, label: "Water globe in front", color: "cold" },
    ],
    bg: "an oil lamp with a curved tin reflector behind it and a round glass globe of water in front, on a whitewashed wall table at night" },
  { t: 469, id: "cmp_invsq", kind: "stat", hue: "cold", accent: "danger",
    value: 4, suffix: "×", label: "dimmer at double the distance — light falls off with the square", eyebrow: "The law" },
  { t: 555, id: "cmp_reflector", kind: "callout", hue: "amber", accent: "good",
    figure: "≈ 2×", eyebrow: "The reflector", caption: "a shiny curved surface behind the flame turns the wasted backward light forward",
    bg: "a polished curved tin reflector behind a candle flame, doubling the light" },
  { t: 612, id: "cmp_whitewash", kind: "checklist", hue: "amber", accent: "good",
    title: "Whitewash the walls", eyebrow: "Free light",
    items: [ck("White reflects most of the light"), ck("Dark walls eat it"), ck("Lime + water, brushed on"), ck("Makes every candle worth 2–3")],
    bg: "a bright whitewashed cottage interior glowing with soft light" },
  { t: 700, id: "cmp_lamp", kind: "checklist", hue: "amber", accent: "good",
    title: "The safe little flame", eyebrow: "Olive oil lamp",
    items: [ck("A jar, some olive oil, a wick"), ck("Cheap, clean, barely any soot"), ck("Won't flash or spread fire if spilled"), ck("Trim the wick small & steady")],
    bg: "a simple olive oil lamp made from a glass jar, small clean flame" },
  { t: 752, id: "cmp_together", kind: "rampump", eyebrow: "", title: "" }, // placeholder removed below
  { t: 978, id: "cmp_cost", kind: "bars", hue: "amber", accent: "good", unit: "cost",
    title: "What light costs", eyebrow: "Old way vs modern",
    bars: [{ label: "Grid + bulbs", value: 80, display: "$/month forever", tone: "danger" }, { label: "Lamp + jar + lime", value: 1, display: "a few $ once", winner: true }] },
  { t: 1056, id: "cmp_mistakes", kind: "checklist", hue: "amber", accent: "danger",
    title: "Two mistakes", eyebrow: "Then it just works",
    items: [ck("Dark, cluttered surroundings — give light something white to bounce off"), ck("A flat jar — the globe must be ROUND to focus")],
    bg: "a round glass globe of water focusing candlelight versus a flat jar" },
  { t: 1186, id: "cmp_lesson", kind: "splitlist", palette: "G",
    title: "The same lesson", items: ["The buried cooling pipe", "The pump that climbs the hill", "The candle through a globe of water"] },
  { t: 1218, id: "cmp_tonight", kind: "process", hue: "amber", accent: "good",
    title: "Tonight, in 10 minutes", eyebrow: "Try it",
    steps: [{ title: "Light one candle" }, { title: "Set a jar of water in front" }, { title: "Slide it until the print snaps clear" }] },
  { t: 1290, id: "cmp_next", kind: "nextvideo", kicker: "Next time",
    title: "Keep food cold with no refrigerator", sub: "Milk, meat, butter — with the ground, some clay, and how water behaves when the air is dry." },
];
// quitar el placeholder mal puesto (cmp_together no aplica acá)
const COMPS = COMPONENTS.filter((c) => c.id !== "cmp_together");

let nComp = 0;
const placed = new Set();
for (const c of [...COMPS].sort((a, b) => a.t - b.t)) {
  let idx = -1;
  for (let i = 0; i < beats.length; i++) { if (beats[i].start <= c.t + 0.01) { if (!placed.has(beats[i].id)) idx = i; } else break; }
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

// tiling
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

// ── PASADA 3 ★ OVERLAYS densos encima de los clips ──
const st = (t, value, suffix, label, corner = "TL", accent = "amber") => ({ id: `ov_${t}`, start: t, dur: 3.6, kind: "stattag", overlay: true, value, suffix, label, corner, accent });
const stx = (t, text, label, corner = "TL") => ({ id: `ov_${t}`, start: t, dur: 3.6, kind: "stattag", overlay: true, text, label, corner, accent: "cold" });
const ph = (t, text, pos = "bottom", accent = "amber") => ({ id: `ovp_${t}`, start: t, dur: 3.4, kind: "phrasetag", overlay: true, text, pos, accent });
const dl = (t, label, sub, corner = "BL") => ({ id: `ovd_${t}`, start: t, dur: 3.4, kind: "doclabel", overlay: true, label, sub, corner, accent: "amber" });
const ds = (t, value, label, corner = "TR") => ({ id: `ovy_${t}`, start: t, dur: 3.6, kind: "datestamp", overlay: true, value, label, corner, accent: "amber" });
const OVERLAYS = [
  st(57, 1, " candle", "+ a jar of water", "TR"),
  ph(82, "How the old folks lit their homes", "bottom"),
  ds(67, "200 yrs", "ago — then forgotten"),
  ph(170, "It's not the flame — it's wasted light", "bottom", "amber"),
  dl(180, "Thief #1", "spreading"),
  dl(211, "Thief #2", "dark walls"),
  dl(228, "Thief #3", "not concentrated"),
  ph(247, "Gather · reflect · concentrate", "bottom", "cold"),
  dl(260, "The water lens", "a real magnifying lens"),
  stx(323, "1 : 4", "one candle, four workers", "TR"),
  ph(316, "The lacemaker's lamp", "top", "amber"),
  stx(469, "½ → ¼", "double the distance", "TR"),
  stx(485, "×3 → 1/9", "triple it", "TL"),
  dl(540, "The reflector", "shiny, curved, behind"),
  st(588, 2, "×", "useful light", "TR", "amber"),
  dl(620, "Whitewash", "white walls = free light"),
  ph(683, "A bag of lime is a lighting upgrade", "bottom", "amber"),
  dl(704, "Olive oil lamp", "safe · clean · cheap"),
  ph(745, "Won't spread fire if spilled", "bottom", "cold"),
  stx(1002, "a few $", "once, then pennies/night", "TR"),
  ph(1035, "We traded a skill for a bill", "bottom", "danger"),
  ph(1099, "The globe must be ROUND", "bottom", "danger"),
  ph(1211, "Push back the dark with your own hands", "bottom", "amber"),
  ph(1247, "Watch the print snap clear", "bottom", "cold"),
];
beats.push(...OVERLAYS.filter((o) => !inFull(o.start)));

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/luz.json", JSON.stringify({ video: "luz", avatar: "luz_opt.mp4", clipsfirst: true, beats }, null, 2));

const timeline = beats.filter((b) => !b.overlay).sort((a, b) => a.start - b.start);
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = [];
let k = 0;
for (let i = 0; i < timeline.length; i++) { if (i % 6 === 3) { pip.push([timeline[i].start, timeline[i].start + Math.min(timeline[i].dur, 7), POS[k % POS.length]]); k++; } }
const firstClip = clips.length ? clips[0][0] : OPEN;
const modeAt = (t) => {
  if (t < firstClip - 1e-6) return "full";
  if (AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6); return p ? p[2] : "hidden";
};
const pts = [...new Set([0, firstClip, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync("src/VideoEdit/avatar_luz.gen.ts", `// avatar_luz.gen.ts — GENERADO por build_luz.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_LUZ = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);
console.log(`=== build_luz ===`);
console.log(`beats: ${timeline.length} (+${beats.length - timeline.length} overlays) · clips: ${nClip} · imágenes: ${timeline.length - nClip - nComp} · componentes: ${nComp}`);
