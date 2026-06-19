// build_rampump.mjs — CLIPS-FIRST híbrido (EN) · canal off-grid de Claudio.
// "This 200-Year-Old Amish Pump Moves Water Uphill With No Power."
// 3 PASADAS: (1) clips reales (YouTube limpio EN + Pexels) · (2) componentes full +
// 2 diagramas a medida RamPumpCycle · (3) ★ OVERLAYS densos ENCIMA de los clips
// (overlay:true → data tags, nombres de partes, frases, fechas) sin tapar el footage.
//
// Modo: node build_rampump.mjs match | node build_rampump.mjs
import fs from "fs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1425.3;
const OPEN = 2.2;
const DLDUR = 6;

const AV_FULL = [
  [104.2, 124.7],   // "My name is Claudio... built by your great-grandfather"
  [666.8, 687.4],   // remate de la historia del abuelo: "nobody was grinning... for the rest of their lives"
  [1259.6, 1284.3], // "a different way of thinking... weight of the water"
  [1352.5, 1372.9], // "tell me in the comments... stay with me"
  [1413.5, TOTAL],  // sign-off
];

// [t, name, query, concepto]
const CLIPS = [
  // ── COLD OPEN: el sonido, el ariete, agua cuesta arriba ──
  [2.2, "rp_pump_mud", ["old hydraulic ram pump device by a spring","rusty iron ram pump in the mud"], "un viejo ariete de hierro junto al manantial"],
  [5.5, "rp_spring", ["clear spring water bubbling from the ground","natural spring at the bottom of a hill"], "el manantial al pie de la loma"],
  [9.0, "rp_pump_close", ["close up of a hydraulic ram pump valve","old brass valve on a water pump"], "la válvula del ariete, en primer plano"],
  [13.0, "rp_pasture_spring", ["green pasture with a stream at the bottom","farm field with a spring"], "el fondo de la pastura, junto al manantial"],
  [17.4, "rp_grandfather", ["old farmer working by a stream","elderly man kneeling by a water pump"], "el abuelo trabajando junto al agua"],
  [21.8, "rp_pipe_valves", ["metal pipe fittings and valves","plumbing valves and pipe on a workbench"], "un caño y dos válvulas"],
  [25.7, "rp_inner_tube", ["old bicycle inner tube rubber","black rubber inner tube"], "una cámara de bicicleta vieja"],
  [29.5, "rp_open_valve", ["hand opening a water valve outdoors","turning a valve on a pipe"], "abriendo la válvula"],
  [33.5, "rp_winter_farm", ["snowy winter farm landscape","frozen rural pasture in winter"], "el invierno en el campo"],
  [42.1, "rp_pump_running", ["water trickling from a working ram pump","ram pump in operation by a creek"], "el ariete funcionando solo"],
  [50.1, "rp_water_climb", ["water flowing up a pipe on a hillside","pipe running up a hill"], "el agua subiendo el caño por la loma"],
  [54.4, "rp_tank_hill", ["water tank on top of a hill","elevated farm water storage tank"], "el tanque en lo alto de la pastura"],
  [58.3, "rp_trough", ["water filling a livestock trough on a farm","animal watering trough"], "el bebedero del ganado llenándose"],
  [62.6, "rp_uphill_pipe", ["long pipe climbing a grassy slope","water line going up a hill"], "más de treinta pies cuesta arriba"],
  [71.1, "rp_water_weight", ["heavy water pouring close up","water gushing from a pipe"], "el peso del agua misma"],
  [75.2, "rp_flow_slow", ["water flowing in a stream slow motion","clear creek water close up"], "agua que corre cuesta abajo"],
  [83.5, "rp_uphill_magic", ["water moving uphill through a pipe","water defying gravity in a tube"], "agua subiendo, como un truco"],
  [91.8, "rp_water_bill2", ["a water utility bill on a table","monthly water bill paper"], "la factura que la industria prefiere que sigas pagando"],
  [95.8, "rp_diagram_hand", ["hand sketching a pipe diagram on paper","drawing a plan with a pencil"], "cómo funciona, dibujado a mano"],
  // [104.2-124.7] AV intro
  [124.7, "rp_cool_pipe", ["white pvc pipe buried in a trench","buried cooling pipe in soil"], "el caño que enfría la casa (video anterior)"],
  [132.5, "rp_stream_wide", ["a stream running through green farmland","creek flowing across a pasture"], "hoy hablamos de agua"],
  [141.4, "rp_spring_low", ["spring water at the bottom of a slope","low spring in a green field"], "agua abajo, en un arroyo o manantial"],
  [145.6, "rp_house_high", ["farmhouse on top of a hill","garden and house above a field"], "y la necesitás arriba: casa, huerta, animales"],
  [149.3, "rp_animals_drink", ["cattle drinking from a trough","cows at a water trough"], "los animales tomando agua"],
  [153.5, "rp_electric_pump", ["electric water pump and pressure tank","well pump system in a basement"], "una bomba eléctrica, una factura mensual"],
  [158.0, "rp_pump_broken", ["broken rusty water pump motor","old failed pump"], "una máquina que se rompe cada pocos años"],
  [162.1, "rp_pump_knock", ["hydraulic ram pump ticking by a stream","small ram pump working outdoors"], "el arietito que cuesta casi nada y dura para siempre"],
  // ── el problema: agua pesa, energía ──
  [173.4, "rp_gallon", ["pouring a heavy bucket of water","gallon of water being poured"], "el agua es pesada: ocho libras por galón"],
  [181.4, "rp_lift_water", ["carrying heavy water buckets uphill","person hauling water up a slope"], "subir agua es levantar peso"],
  [189.3, "rp_energy", ["fast flowing water with energy","rushing river current"], "y levantar peso necesita energía"],
  [201.5, "rp_plug_pump", ["plugging an electric pump into an outlet","electric pump wiring"], "la respuesta moderna: la comprás, enchufás la bomba"],
  [205.6, "rp_meter_spin", ["electricity meter dial spinning","power meter counting"], "le pagás a la compañía todos los meses"],
  [213.4, "rp_power_out", ["power lines in a storm","dark house during a blackout"], "y si se corta la luz, se corta el agua"],
  [222.2, "rp_water_energy2", ["energy of falling water close up","waterfall power"], "el ariete dice: la energía ya está, en el agua"],
  [234.7, "rp_flowing", ["stream flowing downhill","water running down a slope"], "agua que corre, agua que cae, tiene energía"],
  [242.9, "rp_mill_wheel", ["old water mill wheel turning","watermill on a river"], "la misma energía que mueve una rueda de molino"],
  [246.6, "rp_dam", ["hydroelectric dam releasing water","large dam with flowing water"], "la misma que mueve una represa"],
  [254.8, "rp_big_small", ["large volume of water falling a short way","water cascading over rocks"], "mucha agua cayendo poco..."],
  [258.6, "rp_push_up", ["a small jet of water shooting up","water spraying upward"], "...empuja poca agua muy alto"],
  // ── CÓMO FUNCIONA (diagrama) ──
  [266.6, "rp_no_moving", ["simple pipe fittings no motor","plumbing tee and valves"], "sin partes que se gasten, sin combustible"],
  // [270 cmp_cycle RamPumpCycle]
  [283.8, "rp_drive_pipe", ["water flowing down a sloped pipe","pipe carrying water downhill"], "el drive pipe: el agua baja y acelera"],
  [296.3, "rp_waste_valve", ["spring-loaded check valve close up","flap valve on a pipe"], "la válvula de descarga, una simple tapa"],
  [308.3, "rp_water_rush", ["water rushing out of an open pipe","water gushing from a valve"], "el agua sale cada vez más rápido"],
  [320.7, "rp_valve_slam", ["a valve snapping shut","mechanical flap closing fast"], "la válvula se cierra de golpe"],
  [336.4, "rp_pressure", ["pressure gauge spiking","high pressure in a pipe"], "una columna pesada de agua frenada de golpe = presión"],
  [344.4, "rp_faucet_bang", ["closing a faucet quickly","kitchen tap shutting off"], "el golpe en los caños al cerrar la canilla rápido"],
  [356.4, "rp_hammer", ["water hammer pressure wave in a pipe","pipe shaking from water hammer"], "golpe de ariete: el motor entero de la bomba"],
  [364.8, "rp_delivery_valve", ["one-way check valve close up","brass check valve"], "la válvula de entrega, de una sola vía"],
  [377.1, "rp_slug_up", ["a slug of water forced up a pipe","water pushed up a tube"], "un chorro forzado hacia arriba"],
  [385.1, "rp_valve_reset", ["valve flap reopening","check valve cycling"], "la válvula se reabre y vuelve a empezar"],
  [397.6, "rp_tick", ["ram pump ticking rhythmically","steady knocking water pump"], "tic, una vez por segundo, para siempre"],
  // [410 cmp_air explanation -> overlay/clip]
  [410.9, "rp_air_chamber", ["sealed air chamber on a pump","pressure vessel pipe"], "la cámara de aire, el toque inteligente"],
  [427.2, "rp_air_squeeze", ["air being compressed like a spring","trapped air cushion"], "el agua comprime el aire atrapado, como un resorte"],
  [439.1, "rp_smooth_push", ["steady continuous water flow up a pipe","smooth jet of water"], "el aire empuja parejo hacia arriba"],
  [455.8, "rp_inner_tube2", ["bicycle inner tube rubber close up","black rubber tube"], "la cámara que el abuelo hizo de un neumático de bici"],
  // [466 cmp_parts checklist 5 partes]
  [476.4, "rp_no_motor", ["plumbing parts no electronics","pipe and valves only"], "cinco partes, dos son tapas. Nada que enchufar"],
  // ── NÚMEROS ──
  [488.9, "rp_ten_gal", ["ten gallons of water flowing","large volume of stream water"], "diez galones bajan por el caño"],
  // [501 cmp_ratio bars]
  [509.1, "rp_waste_back", ["water spilling back to a stream","overflow returning to creek"], "nueve vuelven al arroyo, gratis"],
  [517.7, "rp_free_water", ["free flowing creek water","stream water close up"], "el agua que gasta era gratis igual"],
  [533.6, "rp_back_to_stream", ["water returning to a stream unchanged","creek flowing on"], "los nueve galones vuelven, sin gastarse nada"],
  // [545 cmp_lift stat 10x / 553 overlay]
  [549.9, "rp_fall_three", ["water falling three feet into a pump","small drop into a ram pump"], "si cae tres pies, sube treinta"],
  [558.0, "rp_fall_six", ["water falling six feet down a pipe","steeper water drop"], "si cae seis, sube sesenta o más"],
  [566.1, "rp_trough_high", ["water trough high above a spring","tank far above the source"], "el bebedero del abuelo, treinta pies arriba"],
  // [570 cmp_perday stat 1000 gal]
  [578.4, "rp_house_garden", ["water flowing to a house and garden","homestead with running water"], "más que suficiente para casa, huerta y animales"],
  [586.0, "rp_cheap_machine", ["cheap pipe and valves on a bench","simple plumbing parts"], "de una máquina de unos dólares"],
  // ── historia del abuelo (clips) ──
  [593.6, "rp_buckets", ["carrying water buckets by hand on a farm","hauling water in pails"], "acarreaban agua en baldes, dos viajes por día"],
  [606.0, "rp_hard_chore", ["tired man carrying water uphill","hard farm labor with water"], "la tarea más ingrata de la chacra"],
  [621.2, "rp_old_book", ["an old book with engineering diagrams","reading an antique technical book"], "lo leyó en un libro viejo"],
  [629.5, "rp_cut_pipe", ["cutting a length of metal pipe","sawing a pipe on a workbench"], "cortó un caño, montó dos válvulas"],
  [637.7, "rp_set_in_mud", ["placing a pump in the mud by a spring","installing a pump at a creek"], "lo plantó en el barro bajo el manantial"],
  [646.0, "rp_water_boots", ["water pouring onto boots","water spilling on the ground"], "el agua le mojaba las botas"],
  [654.1, "rp_men_watching", ["men standing around watching skeptically","farmers watching with doubt"], "los hombres alrededor empezaron a sonreír"],
  // [666.8-687.4] AV remate
  [687.4, "rp_water_walk", ["water climbing a pipe up a hill","stream of water rising"], "vieron al agua caminar cuesta arriba"],
  [691.4, "rp_pays_back", ["old ram pump still working decades later","long-lasting water pump"], "lo construís una vez y te paga por tres generaciones"],
  // ── historia / por qué se ocultó ──
  // [703 cmp_history timeline]
  [712.0, "rp_old_estate", ["grand old country estate house","historic manor with gardens"], "se usó en granjas y casonas de Europa y América"],
  [720.2, "rp_rooftop_tank", ["water tank on a rooftop old building","elevated cistern"], "bombeaban agua de ríos a tanques en los techos"],
  [724.4, "rp_village", ["old european village by a river","historic riverside town"], "pueblos enteros funcionaban con ellos"],
  [728.4, "rp_grid_came", ["electric power lines being installed","power grid towers"], "y llegó la red eléctrica"],
  [736.3, "rp_forgotten", ["dusty forgotten machine in a shed","old device covered in dust"], "casi todos olvidaron que existía"],
  [743.8, "rp_no_money", ["stack of cash money","counting bills"], "no hay plata en una máquina que dura cien años"],
  [752.5, "rp_catalog", ["old product catalog pages","vintage hardware catalog"], "desapareció de los catálogos"],
  [768.9, "rp_offgrid_folks", ["off-grid homestead by a stream","self-sufficient rural living"], "los que la mantuvieron viva: los off-grid, los plain folk"],
  // ── BUILD ──
  [784.7, "rp_hardware", ["hardware store plumbing aisle","pipe fittings on store shelves"], "casi todo en cualquier ferretería"],
  [789.3, "rp_source_water", ["a flowing stream with a slope","creek with a small drop"], "una fuente de agua que corra y caiga unos pies"],
  // [796 overlay: 3 ft]
  [797.4, "rp_solid_pipe", ["rigid metal drive pipe","solid steel pipe length"], "un drive pipe rígido desde la fuente"],
  [809.3, "rp_pump_body", ["plumbing tee with two valves","pump body fittings"], "el cuerpo: un tee y dos válvulas"],
  [821.1, "rp_check_valve", ["spring check valve close up","one-way valve"], "la válvula de descarga y la de entrega"],
  [833.7, "rp_capped_pipe", ["capped section of pipe air chamber","sealed pipe end"], "la cámara de aire: un caño tapado o una botella"],
  [841.9, "rp_delivery_line", ["thin water line going up a hill","small pipe climbing a slope"], "el delivery pipe, fino, sube a tu tanque"],
  [849.7, "rp_few_fittings", ["a handful of pipe fittings","plumbing parts in a hand"], "una chica se arma con unos pocos fittings"],
  [857.8, "rp_metal_valves", ["heavy duty brass valves","metal industrial valves"], "una grande con válvulas de metal"],
  // [869 cmp_sizing checklist]
  [885.5, "rp_drive_long", ["a long pipe running down a slope","steady sloped pipe"], "el drive pipe: 5 a 10 veces la caída"],
  [902.0, "rp_fat_thin", ["a fat pipe joined to a thin pipe","two pipe sizes connected"], "caño gordo abajo, fino arriba"],
  [922.6, "rp_air_volume", ["large air chamber on a pump","tall pressure vessel"], "la cámara de aire bien grande"],
  [935.0, "rp_tune_knock", ["adjusting a valve on a pump","tuning a ram pump"], "si golpea feo, agrandá la cámara o cargá aire"],
  [950.6, "rp_scrap_pump", ["ram pump built from scrap parts","homemade water pump"], "se hacen con chatarra hace dos siglos"],
  // ── costo ──
  [963.9, "rp_install_pump", ["installing an electric well pump system","plumber installing a pump"], "una bomba eléctrica: más de mil dólares instalarla"],
  // [971 overlay $1000+]
  [975.6, "rp_meter_daily", ["electric meter on a house","power usage meter"], "y consume electricidad todos los días"],
  [983.9, "rp_motor_burn", ["burned out pump motor","worn pump being replaced"], "el motor se quema cada 10 o 15 años"],
  [996.4, "rp_money_years", ["money spent over years bills","stacks of bills over time"], "miles de dólares en 30 años"],
  // [1008 cmp_cost bars]
  [1016.6, "rp_ram_cheap", ["cheap ram pump fittings","handful of valves and pipe"], "el ariete: un puñado de fittings y dos válvulas"],
  [1025.0, "rp_washer", ["replacing a rubber washer in a valve","small rubber seal"], "lo único que se gasta: una gomita, cada varios años"],
  // ── dónde usarlo ──
  [1045.4, "rp_falling_water", ["falling water down a hillside","water dropping down a slope"], "necesita agua que CAIGA"],
  [1057.6, "rp_higher_source", ["water source above the pump location","spring higher than a pump"], "la fuente más alta que la bomba, aunque sea poco"],
  [1069.6, "rp_flat_pond", ["flat still pond no flow","calm flat water"], "un estanque chato y sin caída no sirve"],
  [1081.4, "rp_small_drop", ["a small three foot waterfall","little drop in a creek"], "tres pies de caída alcanzan"],
  [1085.5, "rp_creek_dam", ["small dam on a creek","stones damming a stream"], "un dique chiquito en un arroyo crea la caída"],
  [1089.2, "rp_hillside_spring", ["spring on a hillside","stream on sloped land"], "un manantial en la ladera, un arroyo en pendiente"],
  [1097.1, "rp_walk_land2", ["walking along a stream on a property","surveying water on land"], "caminá tu terreno buscando agua que baje"],
  // ── 2 errores ──
  // [1105 cmp_mistakes checklist]
  [1117.6, "rp_garden_hose", ["a coiled flexible garden hose","soft rubber hose"], "error uno: usar manguera flexible"],
  [1125.6, "rp_rigid_pipe", ["rigid solid metal pipe","stiff straight pipe"], "el drive pipe TIENE que ser rígido"],
  [1138.2, "rp_hose_flex", ["a hose flexing under pressure","bulging soft pipe"], "una manguera blanda absorbe el golpe y perdés potencia"],
  [1150.6, "rp_waste_tune", ["adjusting the weight on a waste valve","tuning valve tension"], "error dos: no tunear la válvula de descarga"],
  [1166.6, "rp_valve_weight", ["weighted valve flap","spring tension on a valve"], "muy liviana cierra antes; muy pesada no cierra"],
  [1186.3, "rp_steady_knock", ["ram pump knocking steadily","rhythmic pump beat"], "ajustá hasta un golpe firme, una vez por segundo"],
  [1199.3, "rp_tuned_once", ["a ram pump running for years untouched","long-running pump"], "el abuelo la tuneó una vez en 1947"],
  // ── panorama ──
  [1211.2, "rp_tap_well", ["turning on a tap from a well","faucet running water"], "si estás en pozo, bombeás cada vez que abrís la canilla"],
  [1223.0, "rp_town_water", ["town water meter and pipes","municipal water connection"], "si estás en agua de red, pagás todos los meses"],
  [1235.2, "rp_blackout_water", ["dark house no water in a blackout","power outage at home"], "y si se corta la luz, te quedás sin agua"],
  [1243.2, "rp_dependence", ["electric pump and wires","machine dependent on power"], "atamos el agua a máquinas que necesitan luz y pago"],
  [1255.7, "rp_free_since", ["falling water doing work for free","natural waterfall"], "algo que el agua que cae hace gratis desde siempre"],
  // [1259.6-1284.3] AV philosophical
  [1284.3, "rp_water_redirect", ["water redirected up a pipe","clever water system"], "el peso del agua, redirigido por un hombre que lo entendió"],
  // ── CTA ──
  [1288.1, "rp_walk_property", ["walking a property looking for water","person surveying land near a stream"], "caminá tu terreno y encontrá tu agua"],
  [1296.5, "rp_creek_ditch", ["a ditch with flowing water","drainage ditch on a slope"], "un manantial, un arroyo, una zanja con pendiente"],
  [1304.7, "rp_picture_pump", ["sketching a water system on paper","drawing the pump and tank layout"], "imaginá la bomba abajo y el tanque arriba"],
  [1316.7, "rp_buy_valves", ["buying check valves at a hardware store","plumbing fittings purchase"], "comprá unos fittings y dos válvulas"],
  [1325.1, "rp_build_set", ["setting a small ram pump by water","installing a pump at a creek"], "armá una chica, ponela junto al agua"],
  [1333.3, "rp_boy_watching", ["a child watching water flow on a farm","boy by a stream"], "y mirá, como yo de chico, el agua subir sola"],
  [1344.8, "rp_laugh", ["person amazed watching water uphill","joyful reaction by a stream"], "te vas a reír en voz alta, te lo prometo"],
  // ── teaser próximo (luz) ──
  [1380.8, "rp_lamp_dark", ["oil lamp glowing in a dark room","candle light at night"], "la próxima: luz en casa después de oscurecer"],
  [1389.1, "rp_candle_jar", ["a candle behind a glass of water","candle and water jar"], "una sola llama y un truco olvidado"],
  [1401.3, "rp_warm_home", ["cozy lamplit farmhouse interior","warm home at night"], "la industria preferiría que no lo sepas"],
  [1405.9, "rp_community", ["amish community gathering","plain folk working together"], "los de mi comunidad ya lo saben"],
];

CLIPS.sort((a, b) => a[0] - b[0]);
const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = Number(process.env.RP_MINGAP) || 3.3;
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
  fs.writeFileSync("public/broll/match_rampump.json", JSON.stringify(match, null, 2));
  console.log(`match_rampump.json: ${match.length} clips a matchear`);
  process.exit(0);
}

// ── BUILD HÍBRIDO ──
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

// ── PASADA 2: COMPONENTES (full) + 2 diagramas a medida ──
const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const COMPONENTS = [
  { t: 83, id: "cmp_hook", kind: "impact", image: "img/cmp_hook_bg.png",
    setup: "Watch closely:", impact: "Water going uphill. With no power.", impactAccent: "cold", hitAt: 1.5, boom: 0, darken: 0.42,
    bg: "water flowing uphill through a pipe on a green hillside, impossible looking" },
  // ★ diagrama a medida — el ciclo
  { t: 270, id: "cmp_cycle", kind: "rampump", eyebrow: "How it works", title: "One knock at a time",
    driveTag: { text: "Drive pipe", sub: "water falls & speeds up" }, wasteTag: { text: "Waste valve", sub: "slams shut → hammer" },
    airTag: { text: "Air chamber", sub: "cushions the blow" }, tankTag: { text: "Up the hill", sub: "to your tank" }, ratioTag: "10 fall · 1 climbs" },
  { t: 466, id: "cmp_parts", kind: "checklist", hue: "cold", accent: "good",
    title: "The whole device", eyebrow: "5 parts · 2 are just flaps",
    items: [ck("Drive pipe"), ck("Waste valve"), ck("Delivery valve"), ck("Air chamber"), ck("Delivery pipe")],
    bg: "metal pipe fittings and two valves laid out on a workbench" },
  { t: 476, id: "cmp_anatomy", kind: "annotated", hue: "cold", eyebrow: "The five parts", image: "img/cmp_anatomy_bg.png",
    annotations: [
      { kind: "circle", x: 0.28, y: 0.40, w: 0.14, label: "Drive pipe", color: "accent" },
      { kind: "circle", x: 0.52, y: 0.78, w: 0.12, label: "Waste valve", color: "danger" },
      { kind: "arrow", x: 0.62, y: 0.30, fromX: 0.8, fromY: 0.12, label: "Air chamber", color: "cold" },
    ],
    bg: "a hydraulic ram pump made of metal pipe and valves sitting by a stream, side view" },
  { t: 1037, id: "cmp_runfree", kind: "callout", hue: "cold", accent: "good",
    figure: "$0 / year", eyebrow: "To run — forever", caption: "no electricity, no fuel, no bill; the only part that wears is a rubber washer",
    bg: "an old hydraulic ram pump still working by a clear stream after decades" },
  { t: 501, id: "cmp_ratio", kind: "bars", hue: "cold", accent: "good", unit: "gal",
    title: "Where the water goes", eyebrow: "Out of every 10",
    bars: [{ label: "Back to the stream", value: 9, display: "9 gal", tone: "amber" }, { label: "Up the hill", value: 1, display: "1 gal", winner: true }] },
  { t: 545, id: "cmp_lift", kind: "stat", hue: "cold", accent: "good",
    value: 10, suffix: "×", label: "higher than the distance the water falls", eyebrow: "The lift" },
  { t: 570, id: "cmp_perday", kind: "stat", hue: "amber", accent: "good",
    value: 1000, prefix: "+", suffix: " gal/day", label: "from a machine that costs a few dollars and runs on falling water", eyebrow: "All day, all night" },
  { t: 703, id: "cmp_history", kind: "timeline", eyebrow: "It is not new", title: "Why you never heard of it",
    events: [{ year: "1796", label: "perfected in France", accent: "amber" }, { year: "1800s", label: "farms & villages everywhere", accent: "amber" }, { year: "1900s", label: "the grid buried it", accent: "danger" }] },
  { t: 789, id: "cmp_materials", kind: "checklist", hue: "amber", accent: "good",
    title: "What to buy", eyebrow: "Any hardware store",
    items: [ck("Falling water source (3+ ft drop)"), ck("Rigid drive pipe"), ck("Two check valves"), ck("Air chamber + delivery pipe")],
    bg: "plumbing fittings and check valves on a hardware store shelf" },
  { t: 869, id: "cmp_sizing", kind: "checklist", hue: "cold", accent: "good",
    title: "Getting it right", eyebrow: "Roughly, then tune by ear",
    items: [ck("Drive pipe = 5–10× the fall"), ck("Fat pipe down, thin pipe up"), ck("Big air chamber = smooth knock")],
    bg: "a long rigid pipe running down a grassy slope to a small pump" },
  { t: 1008, id: "cmp_cost", kind: "bars", hue: "amber", accent: "good", unit: "USD",
    title: "Cost over 30 years", eyebrow: "Moving water uphill",
    bars: [{ label: "Electric pump", value: 80, display: "$1000s", sub: "install + power + replace", tone: "danger" }, { label: "Ram pump", value: 1, display: "a few $", sub: "once, runs free", winner: true }] },
  { t: 1045, id: "cmp_where", kind: "splitlist", palette: "B",
    title: "Where it works", items: ["Needs falling water (3+ ft drop)", "Spring, stream, pond above a field", "A small dam makes the drop"] },
  { t: 1105, id: "cmp_mistakes", kind: "checklist", hue: "amber", accent: "danger",
    title: "Two mistakes to avoid", eyebrow: "Then it runs day one",
    items: [ck("Never use flexible/soft drive pipe"), ck("Tune the waste valve to a steady knock")],
    bg: "a rigid metal drive pipe beside a coiled garden hose, comparison" },
  { t: 1288, id: "cmp_weekend", kind: "process", hue: "amber", accent: "good",
    title: "Your weekend", eyebrow: "Build a small one first",
    steps: [{ title: "Find falling water" }, { title: "Sketch source → pump → tank" }, { title: "Build it & tune the knock" }] },
  { t: 1276, id: "cmp_quote", kind: "quote", hue: "cold", accent: "cold", fontSize: 90,
    text: "Nothing burned. Nothing bought. *Nothing to break*.",
    bg: "a hydraulic ram pump working quietly by a clear stream" },
  { t: 1389, id: "cmp_next", kind: "nextvideo", kicker: "Next time",
    title: "Light a whole room with one small flame", sub: "No grid, no batteries — a forgotten trick that makes one candle shine like ten." },
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

// ── tiling (cero pantallas vacías) ──
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

// ── PASADA 3 ★ OVERLAYS densos ENCIMA de los clips (overlay:true, no tapan) ──
// data tags, nombres de partes, frases, fechas anclados al ms del narrador.
const st = (t, value, suffix, label, corner = "TL") => ({ id: `ov_${t}`, start: t, dur: 3.6, kind: "stattag", overlay: true, value, suffix, label, corner, accent: "cold" });
const stx = (t, text, label, corner = "TL") => ({ id: `ov_${t}`, start: t, dur: 3.6, kind: "stattag", overlay: true, text, label, corner, accent: "amber" });
const ph = (t, text, pos = "bottom", accent = "cold") => ({ id: `ovp_${t}`, start: t, dur: 3.4, kind: "phrasetag", overlay: true, text, pos, accent });
const dl = (t, label, sub, corner = "BL") => ({ id: `ovd_${t}`, start: t, dur: 3.4, kind: "doclabel", overlay: true, label, sub, corner, accent: "cold" });
const ds = (t, value, label, corner = "TR") => ({ id: `ovy_${t}`, start: t, dur: 3.6, kind: "datestamp", overlay: true, value, label, corner, accent: "amber" });
const OVERLAYS = [
  st(34, 79, " yrs", "still knocking"),
  st(59, 30, " ft", "straight up", "TR"),
  ph(80, "Water uphill — on its own", "bottom", "cold"),
  st(86, 200, " yrs", "old physics", "TL"),
  ph(67, "No power · no fuel · no battery", "top", "amber"),
  ph(189, "Lifting water takes energy", "bottom"),
  dl(284, "Drive pipe", "water falls & speeds up"),
  dl(297, "Waste valve", "open at rest"),
  ph(325, "It slams shut", "bottom", "danger"),
  ph(349, "Water hammer", "bottom", "danger"),
  dl(365, "Delivery valve", "one-way, up only"),
  dl(420, "Air chamber", "cushions every blow"),
  stx(503, "10 : 1", "fall vs lift", "TR"),
  st(548, 10, "×", "the lift", "TL"),
  ds(597, "1947", "still running"),
  st(556, 3, " ft", "drop is plenty", "TR"),
  ds(705, "1796", "perfected in France"),
  ph(744, "No money in a pump that lasts 100 years", "bottom", "amber"),
  stx(796, "3 ft", "minimum drop", "TR"),
  stx(880, "5–10×", "drive pipe vs fall", "TL"),
  stx(971, "$1000+", "just to install electric", "TR"),
  ph(1146, "Rigid drive pipe — always", "bottom", "danger"),
  ph(1186, "A steady knock, once a second", "bottom", "cold"),
  ph(1239, "Power out = water out", "top", "danger"),
  ph(1316, "Build it once. Free forever.", "bottom", "cold"),
];
// los overlays NO entran al tiling: se agregan tal cual (capa encima)
beats.push(...OVERLAYS.filter((o) => !inFull(o.start)));

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/rampump.json", JSON.stringify({ video: "rampump", avatar: "rampump_opt.mp4", clipsfirst: true, beats }, null, 2));

// ── ventanas de avatar (ignora overlays) ──
const timeline = beats.filter((b) => !b.overlay).sort((a, b) => a.start - b.start);
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = [];
let k = 0;
for (let i = 0; i < timeline.length; i++) {
  if (i % 6 === 3) { pip.push([timeline[i].start, timeline[i].start + Math.min(timeline[i].dur, 7), POS[k % POS.length]]); k++; }
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
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync("src/VideoEdit/avatar_rampump.gen.ts", `// avatar_rampump.gen.ts — GENERADO por build_rampump.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_RAMPUMP = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0) + OPEN;
console.log(`=== build_rampump ===`);
console.log(`beats: ${timeline.length} (+${beats.length - timeline.length} overlays) · clips: ${nClip} · imágenes: ${timeline.length - nClip - nComp} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
