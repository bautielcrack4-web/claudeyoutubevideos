// build_cemento.mjs — CLIPS-FIRST DENSO (Constructor Libre, "El Constructor Libre").
// Remake re-angulado: "SECRETO PERDIDO — por qué el cemento romano duró 2000 años y el tuyo
// se agrieta en dos: el ingrediente perdido, la CAL". Avatar Tomás + b-roll dominante REAL:
// clips YouTube (matchfarm proxies) + cientos de imágenes web (fetch_bing). AI solo diagramas.
// Queries ANALIZADAS del guion (específicas, EN inglés, ancladas al TEMA: cemento/grietas/
// cal/curado/puzolana/romanos) — no random. Pacing ~4.5s (denso). REGLA #0: cada beat al ms exacto.
// Modos:  node build_cemento.mjs match  |  node build_cemento.mjs
import fs from "fs";

const SLUG = "cemento";
const AVATAR = `${SLUG}_opt.mp4`;
const MODE = process.argv[2] === "match" ? "match" : "build";
const MINGAP = Number(process.env.OX_MINGAP) || 2.2;
const OPEN = 1.6, OV = 0.4, DLDUR = 6;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); for (let i = 0; i <= Wc.length - t.length; i++) { let ok = 1; for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; } if (ok) return Wc[i].ms / 1000; } throw new Error("ANCHOR NOT FOUND: " + phrase); };
const atc = (p) => { try { return at(p); } catch { console.warn("⚠ anchor missing:", p); return null; } };
const TOTAL = +((Wc[Wc.length - 1].e) / 1000 + 1.5).toFixed(2);
const PHRASE_BOUNDS = [];
for (let i = 0; i < caps.length; i++) { const prev = caps[i - 1]; const punct = prev ? /[.,;:!?…"]$/.test(prev.text.trim()) : true; const gap = prev ? caps[i].startMs - prev.endMs : 9999; if (i === 0 || punct || gap > 200) PHRASE_BOUNDS.push(caps[i].startMs / 1000); }

const C = (name, query, concept, o = {}) => ({ k: "c", name, query, concept, ...o });
const I = (name, query, concept, o = {}) => ({ k: "i", name, query, concept, ...o });
const G = (name, o = {}) => ({ k: "g", name, ...o });
const X = (props) => ({ k: "comp", ...props });
const DP = (d) => `Crear una infografía horizontal, RELACIÓN DE ASPECTO EXACTA 16:9 (1792x1024), estilo lámina ilustrada hecha a mano pero muy profesional, limpia, premium y editorial. Fondo marfil claro con textura de papel muy sutil, líneas marrón oscuro casi negras, acentos en verde oliva/salvia y terracota apagado. ${d}. DEJÁ COMPLETAMENTE LIBRE la esquina superior derecha (limpia, sin texto) para colocar después el avatar. Composición minimalista, mucho espacio, pocos bloques grandes, tinta fina con acuarela suave, se entiende en 1 segundo. Textos en español, breves. Estética: vintage botanical / archival textbook illustration, premium editorial, papel levemente envejecido. Evitá verse escolar/infantil/sobrecargado.`;
const DIAGRAMS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };
const HUES = ["amber", "red", "blue"];

const SECTIONS = [
  // ░░ 1) COLD OPEN — Roma 2000 años vs tu vereda ░░
  { a: "mira bien esto", start: 0, beats: [
    C("cm_colosseum_ancient", "roman colosseum ancient concrete standing 2000 years", "the Colosseum of Rome, standing for 2000 years", { at: "mira bien esto" }),
    C("cm_pantheon_dome_concrete", "roman pantheon concrete dome interior ancient unreinforced", "the Pantheon dome, biggest unreinforced concrete, intact", { at: "el coliseo de roma dos mil anos parado" }),
    C("cm_roman_aqueduct_valley", "roman aqueduct crossing valley ancient concrete standing", "the roman aqueducts still crossing valleys, still standing", { at: "los acueductos romanos todavia cruzando valles" }),
    C("cm_your_cracked_sidewalk", "cracked concrete sidewalk crumbling split backyard", "and next to it, your sidewalk, made two summers ago", { at: "y al lado tu vereda" }),
    C("cm_smooth_slab_now_split", "smooth concrete slab cracked from end to end weathered", "smoothed nice and already split from end to end", { at: "la alisaste bien prolija" }),
    C("cm_same_rain_same_concrete", "concrete surface in rain weathering comparison outdoors", "the same material, more or less, the same rain", { at: "el mismo material mas o menos" }),
    C("cm_why_one_lasts", "hairline cracks concrete shrinkage forming on slab", "why does one last 2000 years and the other cracks in two", { at: "por que una cosa dura dos mil anos y la otra se te agrieta en dos" }),
    I("cm_homeowner_cracked_worry", "homeowner inspecting cracked concrete wall worried", "you're here because some concrete of yours is cracking", { at: "es porque tenes algo de cemento que se esta rajando" }),
    C("cm_wall_render_spider_cracks", "wall render full of spider web cracks plaster crazing", "the wall render full of spider-web cracks", { at: "el revoque de una pared que ya esta lleno de telaranas de grietas" }),
    C("cm_laundry_sink_lost_chunk", "homemade concrete laundry sink chipped lost a chunk", "the laundry sink you made, already lost a piece", { at: "la pileta de lavar que hiciste vos y ya perdio un pedazo" }),
    C("cm_old_folks_knew", "old mason hands working lime mortar traditional method", "the old folks knew something nobody taught you", { at: "la gente de antes sabia algo que a vos nadie te enseno" }),
    G("cm_tomas_hook", { kicker: "Lo que la industria no quiere que sepas" }),
  ]},
  // ░░ 2) LAS 3-4 COSAS / promesa ░░
  { a: "hacian tres o cuatro cosas", beats: [
    C("cm_cheap_simple_methods", "simple cheap ways to make concrete last decades no cracks", "three or four simple, dirt-cheap things, decades without a crack", { at: "hacian tres o cuatro cosas" }),
    I("cm_fake_internet_advice", "phone screen fake concrete hack video online skeptical", "the internet is full of people who just tell you", { at: "internet esta lleno de gente que te cuenta" }),
    C("cm_two_mortar_samples_hand", "two mortar test blocks in hands comparison same day", "look at these two samples of mortar", { at: "mira estas dos muestras" }),
    C("cm_both_mortar_outside", "two concrete blocks left outdoors same corner weathering", "both mortar, both made the same day, both left outside", { at: "las dos son mortero" }),
    C("cm_pure_cement_loaded", "pouring pure cement heavy mix for strength trowel", "this one made like most do today: pure, heavy cement", { at: "cemento puro bien cargado de cemento" }),
    C("cm_crumbles_in_hand", "concrete edge crumbling to powder in bare hand spalling", "press the edge and it crumbles, turns to dust in the hand", { at: "y si aprieto aca en el borde" }),
    I("cm_lost_ingredient_recipe", "old bricklayer recipe adding lime to mortar mix", "this one with the old recipe, a lost ingredient", { at: "con un ingrediente que la industria dejo de recomendarte" }),
    C("cm_hard_like_stone_sound", "solid sound concrete block hard like stone no cracks", "hard as a stone, sounds solid, not a single crack", { at: "y esta dura como una piedra" }),
    C("cm_cheap_bag_of_lime", "cheap bag of builders lime at a hardware yard", "the only difference: that cheap ingredient", { at: "la unica diferencia entre las dos" }),
    C("cm_stay_until_end", "finger pointing keep watching screen reminder", "stay till the end: the one error that ruins it all", { at: "quedate hasta el final" }),
  ]},
  // ░░ 3) SOY TOMÁS ░░
  { a: "soy tomas y esto es lo que la industria del cemento no quiere que sepas", full: true, beats: [] },
  // ░░ 4) STAKES — lo que el cemento rajado te costó ░░
  { a: "pensa un segundo en lo que el cemento rajado ya te costo", beats: [
    C("cm_sidewalk_split_weekend", "concrete sidewalk split in half grass growing through crack", "the sidewalk you leveled a whole weekend, split by year two", { at: "hablo de la vereda que emparejaste todo un fin de semana" }),
    C("cm_wall_render_map_cracks", "wall render covered in map-like cracks blowing off falling", "the wall render that filled with cracks like a map, then fell", { at: "del revoque de la pared que quedo lindo liso" }),
    C("cm_step_edge_chipped", "concrete entry step chipped and broken at the corner", "the step you made that chipped right at the edge", { at: "del escalon que hiciste con toda la ilusion" }),
    C("cm_subfloor_cracked_tiles", "cracked concrete subfloor lifting tiles above it", "the subfloor you cracked that now lifts the tiles above", { at: "del contrapiso que rajaste" }),
    C("cm_crack_doesnt_stop", "concrete crack spreading growing wider over time treacherous", "the treacherous thing about a crack: it doesn't stay still", { at: "no se queda quieta" }),
    C("cm_hairline_crack_thin", "hairline crack in concrete thin as a hair barely visible", "it starts as a hairline you can barely see", { at: "empieza como una linea de pelo" }),
    C("cm_water_freezes_pushes", "water entering concrete crack freezing pushing widening", "water gets in, freezes, pushes, dirt enters, the crack grows", { at: "el agua entra se congela empuja entra tierra la grieta crece" }),
    I("cm_crack_split_slab", "open crack that split a concrete slab letting water inside", "one day it's an open split that broke the slab", { at: "esa linea se abre un poquito mas" }),
    C("cm_buy_material_again", "buying new bags of cement to redo cracked work store", "you end up buying material again and working double", { at: "y vos terminas comprando material de nuevo" }),
  ]},
  // ░░ 5) EL SECRETO — por qué se raja (razón física) ░░
  { a: "el secreto", beats: [
    G("cm_tomas_secreto", { kicker: "Tan simple que da bronca" }),
    C("cm_so_simple_anger", "hardware store selling cement bags without explaining", "so simple it's maddening they don't explain it when you buy the bag", { at: "y es tan simple que da bronca" }),
    C("cm_one_physical_reason", "concrete cracking single physical cause explainer", "cement cracks for one physical reason, only one", { at: "el cemento se raja por una razon fisica una sola" }),
    C("cm_portland_bag_hard", "bag of portland cement at hardware yard very hard rigid", "modern Portland cement from the yard is very hard", { at: "el cemento portland que compras en el corralon" }),
    C("cm_rigid_brittle_no_flex", "rigid brittle concrete strong for load but no flexibility", "strong for load, yes, but rigid, brittle, no flexibility", { at: "es fuerte para aguantar peso si pero es rigido" }),
    X({ kind: "diagram", at: "todo se mueve siempre aunque no lo veas", eyebrow: "El cemento rígido no acompaña el movimiento", slides: [{ image: dg("dg_cm_rigid_vs_flex", "Diagrama comparativo de dos bloques de revoque sobre una pared que se mueve (flechas de dilatación y contracción a los lados). Izquierda: CEMENTO PURO, bloque gris RÍGIDO que ante el movimiento se PARTE con una grieta marcada en rojo ('rígido = se raja'). Derecha: MEZCLA CON CAL, bloque más claro y FLEXIBLE que se estira y acompaña el movimiento sin romperse ('flexible = respira, acompaña'). Etiquetas 'el cemento puro es rígido: se parte', 'la cal es flexible: acompaña'. Transmite que todo se mueve y solo lo flexible sobrevive."), eyebrow: "Cemento puro: se parte · Con cal: acompaña" }] }),
    C("cm_wall_moves_expands", "wall expanding with heat contracting with cold movement", "walls, sidewalks, render, they all move, expand and contract", { at: "se dilatan con el calor se contraen con el frio" }),
    C("cm_everything_moves", "house settling ground shifting concrete always moving", "everything moves, always, even if you don't see it", { at: "todo se mueve siempre aunque no lo veas" }),
    C("cm_it_snaps_not_stretch", "rigid concrete snapping cracking instead of stretching", "so it snaps, it doesn't stretch: it cracks", { at: "se parte no se estira se raja" }),
    C("cm_key_that_was_lost", "lost knowledge of flexible lime mortar old builders", "that's the key that was lost", { at: "esa es la clave que se perdio" }),
  ]},
  // ░░ 6) RETRACCIÓN — más cemento = más grietas ░░
  { a: "y hay algo mas todavia peor", beats: [
    C("cm_something_worse", "concrete shrinking as it cures losing volume cracks", "and there's something worse still", { at: "y hay algo mas todavia peor" }),
    X({ kind: "diagram", at: "y cuanto mas cemento le pongas a la mezcla", eyebrow: "Más cemento = más retracción = más grietas", slides: [{ image: dg("dg_cm_shrinkage", "Diagrama de dos losas de mortero secándose. Izquierda: mezcla con POCO cemento, encoge apenas, superficie sana ('poco cemento = poca retracción'). Derecha: mezcla con MUCHO cemento, flechas que tiran hacia adentro desde los cuatro lados (retracción fuerte) y una red de grietas finas en toda la cara ('más cemento = más se encoge = se raja solo'). Etiquetas 'el cemento al fraguar se encoge', 'cuanto más cemento, más tira de sí mismo y se agrieta solo'. Transmite que el exceso de cemento causa las fisuras."), eyebrow: "El cemento al secar se encoge y tira de sí mismo" }] }),
    C("cm_cement_shrinks_curing", "cement shrinking retracting losing volume as it sets", "cement, when it sets and dries, shrinks, loses volume", { at: "y cuanto mas cemento le pongas a la mezcla" }),
    C("cm_pulls_cracks_itself", "concrete pulling on itself cracking on its own drying", "the more cement, the more it pulls on itself and cracks alone", { at: "y mas tira de si mismo hasta que se agrieta solo" }),
    C("cm_fine_cracks_fresh_render", "fine hairline cracks on a freshly made render wall", "those fine cracks on fresh render aren't from too little cement", { at: "por eso las fisuras finitas que ves en un revoque recien hecho" }),
    C("cm_too_much_cement", "overloaded cement mix causing shrinkage cracks", "they're because there was too much of it", { at: "son porque le sobro" }),
  ]},
  // ░░ 7) LOS ROMANOS — flexible, no más duro ░░
  { a: "el hormigon romano no era mas duro que el tuyo", beats: [
    C("cm_roman_concrete_not_harder", "roman concrete ancient structure softer but flexible", "roman concrete wasn't harder than yours", { at: "el hormigon romano no era mas duro que el tuyo" }),
    C("cm_roman_softer_flexible", "flexible ancient roman mortar softer than modern cement", "often it was softer, but it was flexible", { at: "al reves muchas veces era mas blando" }),
    C("cm_didnt_crack_over_time", "ancient roman concrete intact not crumbling over centuries", "and above all, it didn't crack or fall apart over time", { at: "no se cuarteaba y no se desarmaba con el tiempo" }),
    C("cm_lasted_2000_years", "roman concrete structure lasting two thousand years intact", "it lasted 2000 years, built to live with water and movement", { at: "duro dos mil anos" }),
    C("cm_old_neighborhood_houses", "old thick-render neighborhood houses 100 years sound walls", "the old thick-render houses in your neighborhood, still sound", { at: "y las casas viejas de tu barrio" }),
    C("cm_not_pure_cement_other", "old builders using lime instead of pure cement render", "they didn't use pure cement, they used something else", { at: "no usaban cemento puro usaban otra cosa" }),
  ]},
  // ░░ 8) LA CAL — el ingrediente perdido ░░
  { a: "por que el revoque de antes duraba cien anos", beats: [
    C("cm_why_old_render_lasted", "old lime render wall lasting a hundred years sound", "why did the old render last 100 years and yours cracks in two", { at: "por que el revoque de antes duraba cien anos" }),
    C("cm_they_used_lime", "bag of builders lime and old mason mixing lime mortar", "the old folks barely used pure cement: they used lime", { at: "usaban cal" }),
    C("cm_lime_sand_little_cement", "lime sand and small part of cement mixed in a trough", "lime, sand and a small part of cement, or none at all", { at: "cal arena y una parte chica de cemento" }),
    C("cm_lime_opposite_flexible", "flexible lime mortar breathing letting water vapor through", "lime is the opposite of cement: flexible, soft, it breathes", { at: "y la cal es todo lo contrario del cemento" }),
    X({ kind: "diagram", at: "el mortero de cal se cura solo", eyebrow: "El mortero de cal se autorrepara", slides: [{ image: dg("dg_cm_self_heal", "Diagrama en tres pasos de una microfisura en un revoque de cal que se cierra sola. Paso 1: aparece una MICROFISURA fina en el revoque ('aparece una microfisura'). Paso 2: del aire entra un poco de DIÓXIDO DE CARBONO y humedad hacia la fisura (flechas y gotitas) ('la humedad del aire mete CO2'). Paso 3: la cal vuelve a formar CARBONATO DE CALCIO justo en la fisura y la CIERRA, cristales blancos sellando la grieta ('la cal se autorrepara, cierra la fisura sola'). Transmite que la cal cura sus propias grietas, algo que el cemento puro no hace."), eyebrow: "La microfisura se cierra sola con carbonato de calcio" }] }),
    C("cm_lime_self_heals", "lime mortar self healing microcrack closing calcium carbonate", "the lime mortar heals itself, it closes the microcrack", { at: "el mortero de cal se cura solo" }),
    C("cm_co2_forms_carbonate", "calcium carbonate crystals forming inside a lime crack macro", "air moisture brings CO2 and it forms calcium carbonate right there", { at: "la humedad del aire mete adentro un poco de dioxido de carbono" }),
    C("cm_pure_cement_stays_cracked", "pure cement crack that stays cracked forever no healing", "pure cement does none of that, it cracks and stays cracked forever", { at: "se raja y se queda rajado para siempre" }),
    C("cm_lost_secret_flexible", "old builder mixing flexible lime mortar the lost secret", "that's the lost secret: they mixed it flexible, with lime", { at: "ese es el secreto que se perdio" }),
    C("cm_you_pour_pure_leave", "person pouring pure cement smoothing and leaving problem", "today you pour pure cement, smooth it, leave, and there it starts", { at: "vos hoy tiras cemento puro" }),
  ]},
  // ░░ 9) REGLA MADRE — no es más cemento ░░
  { a: "asi que la regla numero uno", beats: [
    C("cm_rule_number_one", "rule number one lime less water keep it wet curing", "rule one, take it even if you forget everything else", { at: "asi que la regla numero uno" }),
    C("cm_never_more_cement", "myth that more cement is stronger busted", "it was never more cement", { at: "nunca fue mas cemento" }),
    C("cm_lime_little_water_wet", "lime little water keeping concrete wet while it sets", "it's lime, little water, and keeping it wet while it sets", { at: "es cal poca agua" }),
    C("cm_repeat_opposite_sold", "opposite of what they sold you about cement", "repeat it, it's the reverse of everything they sold you", { at: "repetila porque es al reves de todo lo que te vendieron" }),
    C("cm_old_folks_all_did_this", "old builders doing the same in different ways lime curing", "everything the old folks did was that, in different ways", { at: "todo lo que hacian los viejos era eso" }),
  ]},
  // ░░ 10) MÉTODO 1 — la cal (OVL kicker) ░░
  { a: "de mas simple a mas poderosa", beats: [
    C("cm_simplest_to_strongest", "from simplest to strongest concrete methods lineup", "let's go one by one, from simplest to strongest", { at: "de mas simple a mas poderosa" }),
    I("cm_lime_lost_ingredient", "bag of lime the lost ingredient for mortar", "the first and most important: the lost ingredient, lime", { at: "la cal" }),
    C("cm_add_lime_to_mix", "adding lime powder to a cement and sand mix trowel", "putting lime in the mix", { at: "meter cal en la mezcla" }),
    X({ kind: "diagram", at: "cuando le metes cal cambia todo", eyebrow: "La cal le da plasticidad y flexibilidad", slides: [{ image: dg("dg_cm_lime_plasticity", "Diagrama de dos porciones de mezcla en una fratacho. Izquierda: SOLO cemento y arena, masa gris áspera y rígida, se cuartea ('cemento + arena: dura pero rígida, áspera, se cuartea'). Derecha: MEZCLA CON CAL, masa cremosa que se estira como manteca sobre la pared, queda flexible ('con cal: plástica, se trabaja como manteca, agarra, queda flexible y respira'). Etiquetas 'sin cal: rígida y se raja', 'con cal: plástica y flexible'. Transmite que la cal transforma la mezcla."), eyebrow: "Sin cal: áspera y rígida · Con cal: plástica y flexible" }] }),
    C("cm_lime_changes_everything", "creamy plastic lime mortar spreading like butter on wall", "when you add lime, everything changes, it works like butter", { at: "cuando le metes cal cambia todo" }),
    C("cm_render_lasts_generations", "old lime render wall lasting generations sound", "it's the ingredient that made old render last generations", { at: "es el ingrediente que hacia que el reboque de antes durara generaciones" }),
    C("cm_cheap_bag_lime_yard", "cheap bag of lime at a hardware yard for coins", "you buy the bag of lime at any yard, for coins", { at: "y lo compras en cualquier corralon la bolsa de cal por monedas" }),
  ]},
  // ░░ 11) LA RECETA — 1:1:6 (LayeredReveal la maneja aparte) ░░
  { a: "para un reboque flexible y sano", beats: [
    C("cm_old_recipe_roughly", "old mortar recipe measured in a builders trough", "how it's done roughly, for a flexible healthy render", { at: "para un reboque flexible y sano" }),
    X({ kind: "diagram", at: "una parte de cemento una parte de cal y seis partes de arena", eyebrow: "La mezcla clásica: 1 cemento · 1 cal · 6 arena", slides: [{ image: dg("dg_cm_recipe_116", "Diagrama de la receta clásica del revoque que no se raja, tres montoncitos etiquetados en fila: 1 balde de CEMENTO ('agarre y velocidad'), 1 balde de CAL ('flexibilidad y se cura sola'), 6 baldes de ARENA ('el cuerpo'). Debajo un signo de suma y una porción de revoque sano sin grietas. Etiquetas grandes '1 : 1 : 6', 'cemento : cal : arena'. Transmite la proporción clásica del revoque flexible que respira."), eyebrow: "1 cemento : 1 cal : 6 arena" }] }),
    C("cm_one_cement_one_lime_six", "measuring one cement one lime six sand in buckets", "one part cement, one part lime, six parts sand", { at: "una parte de cemento una parte de cal y seis partes de arena" }),
    C("cm_classic_proportion", "classic mortar proportion render that breathes no cracks", "that's the classic proportion of render that breathes", { at: "esa es la proporcion clasica del reboque" }),
    C("cm_cement_grip_speed", "cement giving grip and speed to a mortar mix", "the cement gives grip and speed", { at: "el cemento le da agarre y velocidad" }),
    C("cm_sand_is_body", "sand as the body of a mortar mix pile", "and the sand is the body", { at: "y la arena es el cuerpo" }),
    C("cm_never_pure_cement_render", "pure cement render crazing a crack machine warning", "but never go to pure cement for a render, it's a crack machine", { at: "el reboque de puro cemento es una maquina de hacer grietas" }),
  ]},
  // ░░ 12) INJERTO 1 — manual (ManualCard en OVL, ~38%) ░░
  { a: "las tengo todas anotadas", beats: [
    C("cm_exact_proportions_noted", "handwritten exact mortar proportions notebook manual", "the exact proportions for each job, I have them all written", { at: "las tengo todas anotadas" }),
    C("cm_mixed_by_eye_failed", "mixing mortar by eye first time cracked lesson", "I mixed by eye the first time and it cracked anyway", { at: "porque a mi me paso de mezclar a ojo la primera vez" }),
    C("cm_start_today_nothing", "starting to mix with lime today basic supplies", "for today you need nothing, with 1:1:6 you can already start", { at: "con esta proporcion" }),
    C("cm_keep_watching_curing", "keep watching curing and the error that ruins all", "keep watching: the curing and the error come", { at: "segui mirando" }),
  ]},
  // ░░ 13) LÍMITE de la cal — endurece más lento ░░
  { a: "la cal endurece mas lento que el cemento", beats: [
    C("cm_lime_hardens_slower", "lime render taking more days to fully harden patience", "the limit: lime hardens slower than cement", { at: "la cal endurece mas lento que el cemento" }),
    C("cm_not_for_two_hours", "not for when you need it to set in two hours lime", "it's not for when you want it to set in two hours", { at: "no es para cuando queres que frague en dos horas" }),
  ]},
  // ░░ 14) MÉTODO 2 — el curado ░░
  { a: "este segundo metodo no es un ingrediente", beats: [
    C("cm_second_method_free", "curing concrete keeping wet no ingredient free method", "the second method costs nothing, yet 90% fail at it", { at: "este segundo metodo no es un ingrediente" }),
    C("cm_this_is_curing", "curing concrete slab keeping it damp covered", "it's the curing", { at: "es el curado" }),
    X({ kind: "diagram", at: "el cemento no se seca el cemento fragua", eyebrow: "Secar ≠ fraguar: la reacción necesita agua", slides: [{ image: dg("dg_cm_cure_vs_dry", "Diagrama de dos losas comparadas. Izquierda: SECARSE, una losa al sol con el agua evaporándose rápido y grietas de retracción ('secarse = perder agua = se raja'). Derecha: FRAGUAR, una losa tapada y húmeda donde el agua reacciona por dentro (engranajes/reacción química) y queda maciza y sana ('fraguar = reacción química que necesita agua y días'). Etiquetas 'secarse: perder agua rápido', 'fraguar: reacción que tarda días'. Transmite que el cemento no se seca, fragua, y que apurar el secado lo arruina."), eyebrow: "Secarse: perder agua · Fraguar: reacción química" }] }),
    C("cm_cement_doesnt_dry_sets", "cement setting curing chemical reaction not drying", "cement doesn't dry, cement sets, two different things", { at: "el cemento no se seca el cemento fragua" }),
    C("cm_setting_chemical_reaction", "cement chemical reaction needing water to harden", "setting is a chemical reaction, cement needs water to harden", { at: "fraguar es una reaccion quimica" }),
    C("cm_water_leaves_too_fast", "sun and wind drying concrete too fast before it sets", "if the water leaves too fast, at the sun, wind, heat", { at: "si vos dejas que el agua se le vaya rapido" }),
    C("cm_weak_porous_cracks", "weak porous concrete shrinking cracking all over drying", "it stays weak, porous, and cracks all over", { at: "queda debil poroso" }),
    C("cm_drying_crack_hot_sun", "drying shrinkage cracks appearing next day hot sun slab", "the drying crack you see next day on a slab made in hot sun", { at: "la grieta de secado" }),
    C("cm_keep_wet_several_days", "curing concrete keeping wet several days on purpose", "the old folks do the opposite: they keep it wet for days", { at: "en vez de dejar que el cemento se seque rapido lo mantienen humedo varios dias" }),
    C("cm_water_cover_shade", "watering covering and shading fresh concrete curing", "they water it, cover it, shade it on purpose", { at: "a proposito le tiran agua lo tapan le hacen sombra" }),
    C("cm_cured_wet_stronger", "wet-cured covered concrete much stronger no cracks", "concrete cured wet, covered a few days, comes out much stronger", { at: "un cemento curado humedo tapado unos dias queda mucho mas fuerte y sin grietas" }),
    C("cm_same_bag_different_care", "same bag of cement one dried one cured comparison", "same material, same bag, one dried in the sun, one was cared for", { at: "el mismo material la misma bolsa" }),
  ]},
  // ░░ 15) CÓMO CURAR — pasos (LayeredReveal aparte) ░░
  { a: "apenas el cemento tomo", beats: [
    C("cm_once_it_takes", "concrete just set no longer marks with finger start curing", "once it's set, no longer marks with a finger, you start caring", { at: "apenas el cemento tomo" }),
    C("cm_cover_it", "covering fresh concrete with plastic burlap wet sack", "and above all, don't leave it in bare sun or wind: cover it", { at: "lo tapas" }),
    C("cm_plastic_burlap_wet_sack", "concrete covered with plastic sheet or wet burlap sack curing", "with plastic, burlap, a wet sack, damp cardboard, whatever", { at: "con un plastico con una arpillera o una bolsa mojada" }),
    C("cm_shade_it", "shading fresh concrete slab from the sun while curing", "if you can, keep it in shade or make shade yourself", { at: "si podes lo dejas a la sombra" }),
    C("cm_keep_wet_days", "keeping concrete wet and covered for several days curing", "keep it wet and covered several days: three, five, seven", { at: "y asi lo mantenes humedo y tapado varios dias" }),
    C("cm_more_days_stronger", "more days of moisture stronger sounder concrete curing", "the more days of moisture, the stronger and sounder it gets", { at: "cuanto mas dias de humedad" }),
    C("cm_cheapest_water_tarp", "cheapest curing water and a tarp on concrete", "it's the cheapest thing there is: water and a tarp", { at: "es lo mas barato que existe" }),
  ]},
  // ░░ 16) LÍMITE del curado — hay que hacerlo ░░
  { a: "no hay atajo", beats: [
    C("cm_no_shortcut_curing", "no shortcut watering and covering concrete a few days", "no shortcut, a few days of watering and keeping it covered", { at: "no hay atajo" }),
    C("cm_sound_20_years", "sound concrete sidewalk lasting twenty years vs cracked", "the difference between a slab sound 20 years and one cracked the first summer", { at: "pero es la diferencia entre una vereda sana veinte anos y una rajada en el primer verano" }),
  ]},
  // ░░ 17) MÉTODO 3 — menos agua ░░
  { a: "el tercer metodo es el del agua", beats: [
    C("cm_third_method_water", "controlling water in a concrete mix less water method", "the third method is water, against everything people believe: less water", { at: "el tercer metodo es el del agua" }),
    C("cm_people_add_too_much", "person adding too much water to a soupy cement mix", "most people add too much water when they mix", { at: "casi todos le tiran agua de mas" }),
    C("cm_soupy_mix_easy_disaster", "soupy runny cement mix easy to work a disaster", "a wet mix is softer, easier to work, comfortable, and a disaster", { at: "porque una mezcla con mucha agua es mas blanda mas chirle" }),
    X({ kind: "diagram", at: "esa mezcla queda llena de agujeros microscopicos", eyebrow: "El agua de más se evapora y deja poros", slides: [{ image: dg("dg_cm_water_pores", "Diagrama en corte de dos morteros fraguados. Izquierda: mezcla con MUCHA agua, al fraguar el agua sobrante se evapora (vapor subiendo) y deja HUEQUITOS y poros por dentro, queda porosa y débil ('agua de más = poros = débil y se desgrana'). Derecha: mezcla con POCA agua, densa y maciza, sin huecos ('poca agua = macizo y fuerte'). Etiquetas 'cada gotita de más deja un poro', 'menos agua = más fuerte y menos grietas'. Transmite que el exceso de agua debilita el mortero."), eyebrow: "Agua de más: poroso y débil · Poca agua: macizo" }] }),
    C("cm_water_evaporates_leaves", "excess water evaporating from curing cement leaving voids", "all that extra water evaporates and leaves a hole, a pore", { at: "toda esa agua de mas cuando el cemento fragua no se usa" }),
    C("cm_porous_weak_crumbles", "porous weak concrete full of microscopic holes crumbling", "the mix ends full of microscopic holes: porous, weak", { at: "esa mezcla queda llena de agujeros microscopicos" }),
    C("cm_mix_as_dry_as_workable", "stiff mortar mix as dry as can still be worked firm", "the old rule is the opposite: as dry as can still be worked", { at: "la mezcla justa va lo mas seca que se pueda trabajar" }),
    C("cm_less_water_stronger", "less water denser stronger concrete no cracks", "the less water, the stronger and more solid, and the less it cracks", { at: "cuanta menos agua" }),
    C("cm_water_to_set_not_easy", "adding water little by little to the right firm point", "water is to make it set, not to make it easy to pour", { at: "el agua es para que frague no para que sea facil de tirar" }),
    C("cm_right_point_semi_dry", "mortar at the right semi-dry firm point workable not soup", "that just-right point, semi-dry, is the one that lasts", { at: "ese punto justo" }),
  ]},
  // ░░ 18) MÉTODO 4 / puzolana — el hormigón romano ░░
  { a: "y aca aparece la ultima pieza", beats: [
    C("cm_last_piece_roman", "roman concrete combining lime ash time and water legendary", "here's the last piece, what made roman concrete legendary", { at: "y aca aparece la ultima pieza" }),
    C("cm_volcanic_ash_pozzolana", "roman aqueduct pozzolana concrete volcanic ash gathered", "besides lime, the Romans added volcanic ash, pozzolana", { at: "le metian a la mezcla ceniza volcanica" }),
    X({ kind: "diagram", at: "y esa ceniza hacia algo increible", eyebrow: "La puzolana hace el hormigón MÁS fuerte con el tiempo", slides: [{ image: dg("dg_cm_pozzolana", "Diagrama de una línea de tiempo de un bloque de hormigón romano bajo agua de mar. A la izquierda 'hoy', bloque sano; flechas hacia la derecha marcando 'años, décadas, siglos' y el bloque se ve cada vez MÁS DURO y macizo, con cristales creciendo por dentro por la reacción de la CENIZA VOLCÁNICA (puzolana) + CAL + AGUA. Al final, un puerto romano bajo el agua salada más duro que nunca. Etiquetas 'ceniza + cal + agua', 'en vez de debilitarse, se hace más fuerte con el tiempo'. Transmite que la puzolana endurece el hormigón durante siglos."), eyebrow: "Ceniza + cal + agua: más fuerte con los siglos" }] }),
    C("cm_reacted_stronger_over_time", "roman concrete getting stronger with seawater over time", "that ash reacted with lime and water and made it stronger", { at: "y esa ceniza hacia algo increible" }),
    C("cm_roman_ports_underwater", "roman harbor concrete underwater 2000 years harder", "the roman ports underwater 2000 years got harder, not weaker", { at: "los puertos romanos que estuvieron dos mil anos bajo el agua salada" }),
    C("cm_pozzolanic_cement_today", "pozzolanic cement bag sold at hardware yard today", "today it's imitated by pozzolanic cement or added ashes", { at: "como cemento pusolanico" }),
    C("cm_lime_ash_time_moisture", "lime ash time and moisture working together vs rigid cement", "keep the idea: lime, ash, time and moisture working together", { at: "la cal la ceniza el tiempo y la humedad trabajando" }),
  ]},
  // ░░ 19) INJERTO 2 — por qué no te lo cuentan (chips + splitlist) ░░
  { a: "dejame parar un segundo porque esto es lo mismo de siempre", beats: [
    G("cm_tomas_pausa", { kicker: "Nadie te lo cuenta" }),
    C("cm_none_expensive", "cheap lime free water less material nobody explains yard", "none of this is expensive: lime is cheap, curing water is free", { at: "ninguna de estas cosas es cara" }),
    X({ kind: "chips", at: "le conviene venderte cemento y mas cemento", title: "Por qué no te lo cuentan", chips: ["Al negocio no le conviene", "que tu revoque dure 50 años", "le conviene venderte más cemento"], hue: "red", imageDarken: 0.6, _bg: { name: "cm_cement_bags_upsell_bg", query: "stacked bags of cement for sale at a hardware store yard", concept: "cement bags being sold to redo cracked work" }, image: "real/cm_cement_bags_upsell_bg.png" }),
    C("cm_more_cement_more_cracks", "more cement more shrinkage more cracks the big lie", "more cement is more retraction, more rigidity, more cracks", { at: "mas cemento es mas retraccion" }),
    X({ kind: "splitlist", at: "por eso cuando arme el manual lo dividi justo asi", title: "Los 40 arreglos, divididos así", items: ["Madera y metal que no se arruinan", "Plagas por centavos", "Goteras y humedad", "Arreglos del hogar y el auto"], palette: "A" }),
  ]},
  // === INJERTO 2 — punto de inserción del video-CTA ===
  // El beat anterior cubre "cuando armé el manual, lo dividí justo así... cuarenta arreglos,
  // todos con el mismo criterio: lo barato que funciona, y lo que la industria te oculta para
  // que sigas pagando." Aquí, entre esa frase y el siguiente beat ("Bien. Llegamos a lo que te
  // prometí al principio..."), se insertará después un clip aparte (video-CTA). NO editar de
  // forma rara: este comentario marca el límite exacto.
  // ░░ 20) EL ERROR — mucho cemento + mucha agua + secado rápido ░░
  { a: "bien llegamos a lo que te prometi al principio", beats: [
    C("cm_arrive_promised_error", "the one error that ruins all concrete work reveal", "we reach what I promised: the error that ruins it all", { at: "bien llegamos a lo que te prometi al principio" }),
    X({ kind: "diagram", at: "los tres juntos", eyebrow: "El error: 3 fuerzas tirando de la mezcla a la vez", slides: [{ image: dg("dg_cm_error_three", "Diagrama de una losa de mortero con TRES flechas rojas grandes tirando de ella al mismo tiempo, cada una etiquetada: 1) MUCHO CEMENTO → retracción, 2) MUCHA AGUA → porosidad, 3) SECADO RÁPIDO AL SOL → grietas de secado. En el centro la losa cuarteada con una red de grietas. Título grande 'la máquina perfecta de hacer grietas'. Transmite que el error común son las tres cosas juntas."), eyebrow: "Mucho cemento + mucha agua + secado al sol" }] }),
    C("cm_error_three_together", "too much cement too much water fast sun drying together", "the error: too much cement, too much water, fast sun drying", { at: "el error es este" }),
    C("cm_perfect_crack_machine", "perfect crack machine three forces on a concrete slab", "the three together, the perfect crack machine", { at: "los tres juntos" }),
    C("cm_puts_lots_of_cement", "person loading lots of cement thinking it'll be strong", "the common person thinks: I'll put lots of cement so it's strong", { at: "le pongo bien de cemento" }),
    C("cm_adds_more_water", "adding more water so the mix goes on easy and smooth", "then adds more water so it goes on easy: watered and weak", { at: "le tiro un poco mas de agua" }),
    C("cm_sun_wind_suck_water", "sun and wind sucking water from fresh slab in hours", "sun and wind suck the water in hours, before it sets", { at: "y el sol y el viento le chupan el agua en horas antes de que frague" }),
    C("cm_three_forces_pulling", "three forces pulling on a cracking concrete slab at once", "three forces pulling on the mix at the same time", { at: "las tres fuerzas tirando de la mezcla al mismo tiempo" }),
    C("cm_cracked_before_enjoy", "concrete slab cracked before you finish enjoying it", "that slab is cracked before you even finish enjoying it", { at: "esa vereda esta rajada antes de que la termines de disfrutar" }),
  ]},
  // ░░ 21) ES AL REVÉS — la regla más importante ░░
  { a: "es todo al reves de lo que te dijeron", beats: [
    I("cm_its_all_backwards", "everything backwards from what they told you about cement", "it's all backwards from what they told you", { at: "es todo al reves de lo que te dijeron" }),
    C("cm_more_cement_more_cracks2", "more cement means more cracks not more strength", "more cement isn't stronger: it's more cracks", { at: "mas cemento no es mas fuerte es mas grietas" }),
    C("cm_more_water_weaker", "more water means weaker porous concrete not better", "more water isn't easier and better: it's weaker", { at: "mas agua no es mas facil y mejor es mas debil" }),
    C("cm_strong_mix_lime_less", "strong mix lime little cement little water then cured wet", "the strong mix has lime, little cement, little water, then cured wet", { at: "la mezcla fuerte es la que tiene cal poco cemento" }),
    C("cm_boring_doesnt_sell_bags", "the boring method that doesn't sell bags of cement", "the boring stuff, the stuff that doesn't sell bags", { at: "lo aburrido lo que no vende bolsas" }),
    C("cm_the_most_important_rule", "the single most important rule engrave it lime less water", "the rule, the most important of the whole video, engrave it", { at: "entonces la regla y es la mas importante de todo el video" }),
  ]},
  // ░░ 22) REPARAR GRIETAS — flexible vs rígido ░░
  { a: "y una cosa mas sobre reparar", beats: [
    C("cm_one_more_on_repair", "repairing concrete cracks the wrong way smearing cement", "one more thing on repairing, because many cracks are fixed wrong", { at: "y una cosa mas sobre reparar" }),
    C("cm_moving_crack_rigid_fails", "rigid cement patch on a moving crack cracking again", "patching a moving crack with rigid cement is throwing away the work", { at: "tapar una grieta que se mueve con cemento rigido es tirar el trabajo" }),
    C("cm_open_crack_wedge", "opening a crack into a wedge shape so filler grips", "you open a moving crack into a wedge so it grips", { at: "la abris un poco en forma de cuna para que agarre" }),
    C("cm_flexible_filler_lime", "filling a crack with flexible lime mortar or sealant", "fill it with something elastic: lime mortar or a flexible sealer", { at: "y la rellenas con un material que tenga algo de elasticidad" }),
    C("cm_opens_closes_flexibility", "crack that opens and closes needing flexible filler", "if it opens and closes, you need flexibility, no way around it", { at: "si se abre y se cierra necesitas flexibilidad si o si" }),
  ]},
  // ░░ 23) HONESTIDAD FINAL — lo estructural NO ░░
  { a: "una ultima honestidad", beats: [
    C("cm_final_honesty", "honest builder disclaimer no snake oil concrete", "one last honesty, because I don't sell smoke, and this matters", { at: "una ultima honestidad" }),
    C("cm_for_render_floors_steps", "render floors sidewalks subfloors steps home repairs", "all this is for render, floors, sidewalks, steps and repairs", { at: "todo lo que te dije hoy es para reboques" }),
    C("cm_structural_columns_beams", "reinforced concrete columns beams slabs structural engineering", "but structural concrete, columns, beams, slabs with rebar, is not a home recipe", { at: "pero el hormigon que sostiene la casa las columnas" }),
    C("cm_structural_is_engineering", "structural concrete engineering calculation rebar placement", "that's engineering, with calculation and rebar in its place", { at: "eso es ingenieria con calculo" }),
    C("cm_structural_crack_warning", "wide structural crack crossing a beam growing warning", "if a crack is structural, growing, crossing a beam, don't patch it", { at: "y si una grieta que tenes es estructural" }),
    C("cm_call_a_professional", "calling a structural engineer to inspect a serious crack", "there you call a professional, someone who looks at it seriously", { at: "ahi llamas a un profesional" }),
    C("cm_dont_gamble_roof", "don't gamble with what holds the roof over your head", "don't gamble with what holds the roof over your head", { at: "no te la juegues con lo que aguanta el techo sobre tu cabeza" }),
  ]},
  // ░░ 24) RECAP ░░
  { a: "no era mejor material nada mas era que lo hacian flexible y lo cuidaban", beats: [
    C("cm_recap_flexible_cared", "montage lime little water curing flexible concrete recap", "not better material, they made it flexible and cared for it", { at: "no era mejor material nada mas era que lo hacian flexible y lo cuidaban" }),
    C("cm_lime_breathe_recap", "lime mortar breathing flexible not cracking recap", "the lime, the lost ingredient, so it breathes and doesn't crack", { at: "la cal el ingrediente perdido para que respire y no se raje" }),
    C("cm_less_water_solid_recap", "less water making concrete solid and strong recap", "little water, so it comes out solid and strong", { at: "poca agua para que quede macizo y fuerte" }),
    X({ kind: "checklist", at: "con esto solo ya podes hacer una vereda", title: "El plan contra las grietas", items: [{ text: "No es más cemento: es cal, poca agua y curado", state: "done" }, { text: "La cal: flexible, respira y se cura sola", state: "done" }, { text: "Menos agua: más macizo y fuerte", state: "done" }, { text: "Curar húmedo y tapado varios días", state: "done" }, { text: "El error: mucho cemento, mucha agua, secado al sol", state: "done" }] }),
    C("cm_save_sidewalk_render", "sound concrete sidewalk render step subfloor no cracks", "with this alone you can make a sidewalk that won't crack", { at: "con esto solo ya podes hacer una vereda" }),
    C("cm_last_years_not_months", "repairs lasting years not months like the old builders", "your repairs will last years, not months, like the old folks", { at: "como las de los viejos como las de los romanos a su manera" }),
  ]},
  // ░░ 25) INJERTO 3 + CIERRE ░░
  { a: "la casa entera esta llena de estos secretos que se perdieron", beats: [
    C("cm_house_full_lost_secrets", "old house full of cheap lost repair secrets damp rust wood", "the whole house is full of these lost secrets", { at: "la casa entera esta llena de estos secretos que se perdieron" }),
    C("cm_rust_eats_iron", "rust eating an old iron pipe cheap fix", "the rust that eats iron", { at: "el oxido que se come el hierro" }),
    C("cm_rising_damp_wall", "rising damp climbing a wall peeling paint cheap fix", "the damp that climbs the wall, cut for five pesos", { at: "la humedad que sube por la pared" }),
    C("cm_gathered_40_manual", "home repair manual with exact measures gathered forty fixes", "so I gathered the forty in the Manual, with exact measures", { at: "junte los 40 en el manual de reparaciones caseras" }),
    C("cm_curing_days_noted", "curing days and mortar proportions noted in a manual", "including the curing days and the exact cement, lime and sand", { at: "y los dias de curado" }),
    C("cm_cheaper_than_bag", "home repair manual cheaper than a single bag of cement", "it costs less than one bag of material you were going to waste", { at: "cuesta menos que una sola bolsa de material" }),
    C("cm_even_if_never_grab", "person mixing lime less water covering slab today", "even if you never grab it, do today's thing: add lime, less water", { at: "pero escuchame incluso si nunca lo agarras hacelo de hoy" }),
    C("cm_wall_pocket_thank_you", "restored concrete sidewalk lasting your pocket thanks you", "that render will last years it wasn't going to, your pocket too", { at: "tu pared te lo va a agradecer y tu bolsillo tambien" }),
  ]},
  // ░░ 26) PRÓXIMO ░░
  { a: "en el proximo video te voy a mostrar por que las casas de antes eran frescas en verano", beats: [
    C("cm_next_cool_houses", "old house naturally cool in summer no air conditioning", "next: why old houses were cool in summer with no air conditioning", { at: "en el proximo video te voy a mostrar por que las casas de antes eran frescas en verano" }),
    C("cm_lost_when_ac_came", "traditional passive cooling lost when air conditioning arrived", "all we lost when air conditioning came and told us there was no other way", { at: "todo lo que perdimos cuando llego el aire acondicionado" }),
  ]},
  { a: "se construye un arreglo a la vez", full: true, beats: [] },
];

// ── motor (anclaje + placement + salida + avatar windows) ───────────────────
for (const s of SECTIONS) { if (s.start == null) s.start = atc(s.a); }
const SEC = SECTIONS.filter((s) => s.start != null).sort((a, b) => a.start - b.start);
const beats = [];
const MATCH = [], BING = [];
const seenM = new Set(), seenB = new Set();
const addM = (name, query, concept) => { if (!seenM.has(name)) { seenM.add(name); MATCH.push({ name, concept, query: Array.isArray(query) ? query : [query], dur: DLDUR }); } };
const addB = (name, query, concept) => { if (name && !seenB.has(name)) { seenB.add(name); BING.push({ name, query: Array.isArray(query) ? query[0] : query, concept: concept || query, count: 1 }); } };
for (let si = 0; si < SEC.length; si++) {
  const sec = SEC[si];
  const start = sec.start;
  const end = si + 1 < SEC.length ? SEC[si + 1].start : TOTAL;
  if (sec.full || !sec.beats.length) continue;
  const N = sec.beats.length;
  let secB = PHRASE_BOUNDS.filter((b) => b >= start + 0.05 && b <= end - 0.3);
  if (!secB.length) secB = [start];
  const placed = [];
  let lastT = start - 99;
  for (let i = 0; i < N; i++) {
    const b = sec.beats[i];
    let t = null;
    if (b.at) { const a = atc(b.at); if (a != null && a >= start && a < end) t = a; }
    if (t == null) {
      const target = start + ((i + 0.5) / N) * (end - start);
      let best = null, bd = 1e9;
      for (const bb of secB) { if (bb <= lastT + 0.4) continue; const d = Math.abs(bb - target); if (d < bd) { bd = d; best = bb; } }
      t = best != null ? best : Math.max(target, lastT + MINGAP * 0.6);
    }
    if (t <= lastT + 0.4) t = lastT + Math.max(MINGAP * 0.6, 1.0);
    lastT = t;
    placed.push({ b, t: +t.toFixed(2) });
  }
  for (let i = 0; i < placed.length; i++) {
    const { b, t } = placed[i];
    const nextT = i + 1 < placed.length ? placed[i + 1].t : end;
    const dur = +Math.min(nextT - t + OV, TOTAL - t).toFixed(2);
    const hue = b.hue || HUES[(si + i) % HUES.length];
    if (b.k === "c") { beats.push({ id: b.name, start: t, dur, kind: "raw", src: `broll/${b.name}.mp4`, darken: 0, hue, ...(b.kicker ? { kicker: b.kicker } : {}) }); addM(b.name, b.query, b.concept); addB(b.name, b.query, b.concept); }
    else if (b.k === "i") { beats.push({ id: b.name, start: t, dur, kind: "raw", src: `real/${b.name}.png`, darken: 0, hue, ...(b.kicker ? { kicker: b.kicker } : {}) }); addB(b.name, b.query, b.concept); }
    else if (b.k === "g") { beats.push({ id: b.name, start: t, dur, kind: "raw", src: `img/${b.name}.png`, darken: 0, hue, ...(b.kicker ? { kicker: b.kicker } : {}) }); }
    else if (b.k === "comp") {
      const { kind, at: _at, _bg, ...props } = b;
      if (_bg) addB(_bg.name, _bg.query, _bg.concept);
      const scanBg = (o) => { if (!o || typeof o !== "object") return; if (o._bg) { addB(o._bg.name, o._bg.query, o._bg.concept); delete o._bg; } for (const k of Object.keys(o)) scanBg(o[k]); };
      scanBg(props);
      const beat = { id: `cmp_${kind}_${si}_${i}`, start: t, dur: +Math.min(dur, 7.2).toFixed(2), kind, hue, ...props };
      if (kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((x) => (typeof x === "string" ? { t: x } : { t: x.t, hl: true }));
      if (kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      beats.push(beat);
    }
  }
}
beats.sort((a, b) => a.start - b.start);

// ── OVERLAYS A MEDIDA encima del clip vivo (overlay:true → no roban slot, el clip corre detrás borroso) ──
// Diversificado a propósito: MUCHOS componentes DISTINTOS repartidos, casi nunca dos
// iguales seguidos. HEROES PROPIOS DE CEMENTO (CementoPolish): cmrecipe (1:1:6),
// cmyears (5 vs 2000), cmselfheal (autorreparación de la cal), cmcure (secar≠fraguar),
// cmerror (la máquina de grietas). Se reutilizan los genéricos que SÍ aplican del kit de
// madera (mdslider/mdname/mdtwoplanks(=2 muestras)/mdrecap/mdkicker/mdrulestamp/mdendcard/
// mdtrans + ox*/manualcard), re-angulados a cemento/cal/curado. Los kinds de madera fuera
// de tema (mdrotinside/mdfungus/mdsealtrap) fueron REEMPLAZADOS por los cm* on-topic.
const OVL = [
  // ── HOOK — comparador Roma vs tu vereda (hero) ──
  { kind: "mdslider", at: "por que una cosa dura dos mil anos y la otra se te agrieta en dos", dur: 5.2, beforeImg: "real/cm_your_cracked_sidewalk.png", afterImg: "real/cm_colosseum_ancient.png", beforeLabel: "Tu vereda", afterLabel: "Roma", beforeYears: "2 años", afterYears: "2000 años", eyebrow: "El mismo material, la misma lluvia", accent: "amber" },
  // ── SOY TOMÁS — lower-third rústico ──
  { kind: "mdname", at: "soy tomas y esto es lo que la industria del cemento no quiere que sepas", dur: 4.2, name: "Tomás", role: "El Constructor Libre", accent: "green" },
  // ── PRUEBA — las 2 muestras de mortero (el momento más viral) ──
  { kind: "mdtwoplanks", at: "mira estas dos muestras", dur: 6.5, title: "Del mismo día, mismo rincón", buried: "misma lluvia y sol", note: "La única diferencia: la cal", accent: "green" },
  // ── STAKES — la grieta que crece (cubierta por oxstat + STRUCT annotated; sin hero de madera acá) ──
  { kind: "oxstat", at: "esa linea se abre un poquito mas", dur: 4.0, value: 0, prefix: "", suffix: "", label: "una fisura de pelo termina siendo una raja que te parte la losa", glyph: "🧱", accent: "red" },
  // ── EL SECRETO / razón física ──
  { kind: "oxrule", at: "el cemento se raja por una razon fisica una sola", dur: 4.6, text: "El cemento no se raja por mala suerte. Se raja por *una razón física*: es rígido.", accent: "amber" },
  // ── RETRACCIÓN → más cemento = más grietas (cubierta por diagram dg_cm_shrinkage + STRUCT) ──
  // ── LA CAL — sello de tinta (regla) ──
  { kind: "mdrulestamp", at: "usaban cal", dur: 5.0, text: "NO ES MÁS CEMENTO. ES CAL.", num: "1", label: "Regla", accent: "amber" },
  { kind: "oxrule", at: "es cal poca agua", dur: 4.4, text: "La regla madre: *cal, poca agua, y mantenerlo húmedo mientras fragua*.", accent: "blue" },
  // ── POR QUÉ ANTES DURABA — barra de años (HERO cemento: 5 vs 2000, count-up) + panel ──
  { kind: "cmyears", at: "por que el revoque de antes duraba cien anos", dur: 5.4, title: "Cuánto dura, según cómo lo mezcles", low: { label: "Cemento puro, hoy", years: 5 }, high: { label: "Con cal, como los romanos", years: 2000 }, accent: "amber" },
  { kind: "oxside", at: "y la cal es todo lo contrario del cemento", dur: 5.2, image: "real/cm_old_neighborhood_houses.png", title: "Por qué antes duraba", lines: ["Antes: cal, flexible, respira, se cura sola", "Hoy: cemento puro, rígido, se raja solo", "No es mejor material: es cómo lo mezclaban"], side: "right", accent: "amber" },
  // ── LA CAL SE AUTORREPARA — HERO cemento: microfisura que se cierra sola con carbonato ──
  { kind: "cmselfheal", at: "el mortero de cal se cura solo", dur: 5.2, title: "La cal se cura sola", accent: "green" },
  // ── MÉTODO 1 — kicker de capítulo + ficha ──
  { kind: "mdkicker", at: "la cal", dur: 3.4, num: "1", kicker: "Método", title: "La cal", glyph: "🧱", accent: "amber" },
  { kind: "oxmethod", at: "es el ingrediente que hacia que el reboque de antes durara generaciones", dur: 4.6, num: "01", title: "La cal", chips: ["Le da plasticidad y flexibilidad", "Respira y no se raja", "Se cura sola: cierra microfisuras"], cost: "monedas la bolsa", accent: "amber" },
  { kind: "oxtag", at: "cuando le metes cal cambia todo", dur: 4.0, name: "La cal", what: "Convierte una masa rígida y áspera en una mezcla plástica y flexible que respira", side: "left", accent: "amber" },
  // ── LA RECETA 1:1:6 — HERO cemento: 3 baldes que se llenan (cemento → CAL secreto → arena).
  //    Se ancla al INTRO de la receta (justo antes del LayeredReveal que baja al detalle con fotos). ──
  { kind: "cmrecipe", at: "para un reboque flexible y sano", dur: 5.0, title: "La mezcla vieja del revoque", note: "1 : 1 : 6 — el revoque que no se raja", accent: "blue" },
  { kind: "oxrule", at: "el reboque de puro cemento es una maquina de hacer grietas", dur: 4.4, text: "El revoque de *puro cemento* es una máquina de hacer grietas. Nunca vayas a cemento puro.", accent: "red" },
  // ── INJERTO 1 — manual (mid, sin chip) ──
  { kind: "manualcard", at: "en un manual que arme", dur: 6.0, image: "real/manual_cover.png", title: "Manual de Reparaciones Caseras", desc: "Los 40 arreglos de $1 a $5 del hogar, con las proporciones justas de cemento, cal y arena y los días de curado.", accent: "amber" },
  // ── MÉTODO 2 — kicker de capítulo + curado ──
  { kind: "mdkicker", at: "es el curado", dur: 3.2, num: "2", kicker: "Método", title: "El curado", glyph: "💧", accent: "blue" },
  // ── EL CURADO — HERO cemento: secar (sol → grietas) vs fraguar (húmedo tapado → maciza) ──
  { kind: "cmcure", at: "el cemento no se seca el cemento fragua", dur: 5.4, title: "Secar ≠ fraguar", accent: "blue" },
  { kind: "mdchar", at: "en vez de dejar que el cemento se seque rapido lo mantienen humedo varios dias", dur: 5.0, title: "Curar = mantenerlo húmedo", chips: ["Lo mojás varias veces por día", "Lo tapás: plástico, arpillera, cartón", "Sombra, varios días"], accent: "blue" },
  { kind: "oxstat", at: "cuanto mas dias de humedad", dur: 4.0, value: 7, suffix: " días", label: "curado húmedo y tapado: cuantos más días, más fuerte y sano queda", glyph: "💧", accent: "blue" },
  // ── MÉTODO 3 — kicker + regla del agua ──
  { kind: "mdkicker", at: "el tercer metodo es el del agua", dur: 3.4, num: "3", kicker: "Método", title: "Menos agua", glyph: "🚱", accent: "green" },
  { kind: "oxrule", at: "el agua es para que frague no para que sea facil de tirar", dur: 4.6, text: "El agua es para que *fragüe*, no para que sea fácil de tirar. Cuanta menos, más fuerte.", accent: "green" },
  // ── MÉTODO 4 / puzolana — kicker + dato romano ──
  { kind: "mdkicker", at: "y aca aparece la ultima pieza", dur: 3.4, num: "4", kicker: "Método", title: "La puzolana romana", glyph: "🌋", accent: "amber" },
  { kind: "oxstat", at: "los puertos romanos que estuvieron dos mil anos bajo el agua salada", dur: 4.2, value: 2000, suffix: " años", label: "los puertos romanos bajo el agua salada se pusieron más duros, no menos", glyph: "🌊", accent: "amber" },
  // ── EL ERROR — clímax educativo ──
  { kind: "oxrule", at: "el error es este", dur: 4.8, text: "El error: *mucho cemento, mucha agua y secado rápido al sol*. Las tres fuerzas juntas.", accent: "red" },
  // ── EL ERROR — HERO cemento: 3 fuerzas rojas tirando de la losa → red de grietas + sello ──
  { kind: "cmerror", at: "esa vereda esta rajada antes de que la termines de disfrutar", dur: 6.2, title: "La máquina perfecta de hacer grietas", accent: "red" },
  // ── LA REGLA — sello de tinta (2da del set) ──
  { kind: "mdrulestamp", at: "entonces la regla y es la mas importante de todo el video", dur: 5.0, text: "CAL · POCA AGUA · CURADO HÚMEDO", num: "★", label: "La regla madre", accent: "green" },
  // ── CIERRE conceptual — sello de tinta (3ra del set) ──
  { kind: "mdrulestamp", at: "no era mejor material nada mas era que lo hacian flexible y lo cuidaban", dur: 4.8, text: "NO ERA MEJOR MATERIAL. LO HACÍAN FLEXIBLE.", num: "✓", label: "La lección", accent: "amber" },
  // ── RECAP de los métodos como fichas ──
  { kind: "mdrecap", at: "poca agua para que quede macizo y fuerte", dur: 5.4, title: "El secreto, en una", methods: [{ num: "1", name: "La cal", use: "flexible, respira, se cura sola", glyph: "🧱" }, { num: "2", name: "El curado", use: "húmedo y tapado varios días", glyph: "💧" }, { num: "3", name: "Menos agua", use: "macizo y fuerte, no una sopa", glyph: "🚱" }, { num: "4", name: "El orden", use: "cal, poco cemento, curado", glyph: "🛡" }], accent: "amber" },
  // ── CIERRE — manual ──
  { kind: "manualcard", at: "junte los 40 en el manual de reparaciones caseras", dur: 6.0, image: "real/manual_cover.png", title: "Manual de Reparaciones Caseras", desc: "Los 40 arreglos, incluidas las proporciones justas de cemento, cal y arena y los días de curado para cada trabajo.", chip: "Accedé en la descripción", accent: "amber" },
  // ── CIERRE PREMIUM — endcard combinado libro 3D + próximo video + lema ──
  { kind: "mdendcard", at: "en el proximo video te voy a mostrar por que las casas de antes eran frescas en verano", dur: 7.0, manualImg: "real/manual_cover.png", nextImg: "real/cm_next_cool_houses.png", manualTitle: "Manual de Reparaciones Caseras", nextKicker: "En el próximo video", nextTitle: "Casas frescas sin aire acondicionado", motto: "La independencia no se compra, se construye.", cta: "Accedé en la descripción", accent: "green" },
];
let nOv = 0;
for (const o of OVL) { const s = atc(o.at); if (s == null) continue; const { kind, at: _a, dur = 4.2, ...props } = o; beats.push({ id: `ov_${kind}_${Math.round(s)}`, start: +s.toFixed(2), dur, kind, overlay: true, hue: "amber", ...props }); nOv++; }
beats.sort((a, b) => a.start - b.start);

// ── TRANSICIONES DE MARCA entre capítulos (overlay corto, ~0.42s). SOLO en 6 saltos
// de sección. Se ancla al ARRANQUE de cada capítulo y arranca un pelín antes (offset).
// Variantes rotadas. NO tapan contenido.
const TRANS = [
  { at: "el secreto", variant: "ink", accent: "amber" },                        // → EL SECRETO
  { at: "de mas simple a mas poderosa", variant: "grain", accent: "amber" },     // → MÉTODOS
  { at: "es el curado", variant: "grain", accent: "blue" },                      // → curado
  { at: "el tercer metodo es el del agua", variant: "paper", accent: "green" },  // → agua
  { at: "bien llegamos a lo que te prometi al principio", variant: "ink", accent: "red" }, // → EL ERROR
  { at: "la casa entera esta llena de estos secretos que se perdieron", variant: "paper", accent: "green" }, // → cierre
];
let nTr = 0;
for (const tr of TRANS) { const s = atc(tr.at); if (s == null) continue; const st = +Math.max(0, s - 0.12).toFixed(2); beats.push({ id: `tr_${tr.variant}_${Math.round(s)}`, start: st, dur: 0.42, kind: "mdtrans", overlay: true, hue: "amber", variant: tr.variant, accent: tr.accent }); nTr++; }
beats.sort((a, b) => a.start - b.start);

// ── MAXIMUM DENSITY: imágenes ancladas en CADA mini-frase del shotlist aún sin cubrir ──
// [name, query EN visual, concept resuelto al contexto, frase ancla exacta de captions]
const FILL = [
  // ── COLD OPEN ──
  ["cm_fill_pantheon_dome_inside", "roman pantheon concrete dome from inside oculus ancient", "the Pantheon dome intact after twenty centuries", "el coliseo de roma dos mil anos parado"],
  ["cm_fill_sidewalk_two_summers", "concrete sidewalk cracked after two summers backyard", "your sidewalk, made two summers ago, already split", "y al lado tu vereda"],
  ["cm_fill_front_sidewalk_crack", "cracked front sidewalk of a house split concrete", "the front sidewalk", "el revoque de una pared que ya esta lleno de telaranas de grietas"],
  ["cm_fill_subfloor_step", "cracked concrete subfloor and chipped entry step corner", "the subfloor, the entry step chipped at the corner", "la pileta de lavar que hiciste vos y ya perdio un pedazo"],
  ["cm_fill_right_place", "reassuring old mason teaching how to mix mortar right", "you're in the right place, this is not bad luck", "la gente de antes sabia algo que a vos nadie te enseno"],
  ["cm_fill_copy_today_no_extra", "man copying an old cheap mortar method at home today", "to copy today, no extra bags, no pricey brand additives", "hacian tres o cuatro cosas"],
  ["cm_fill_prove_it_now", "man about to prove it with two mortar samples demo", "I'll prove it right now, in front of you", "internet esta lleno de gente que te cuenta"],
  ["cm_fill_both_same_corner", "two mortar blocks in the same backyard corner weathering", "both made the same day, both in the same corner", "las dos son mortero"],
  ["cm_fill_all_crazed_face", "concrete sample crazed with fine cracks all over the face", "all crazed, cracks across the whole face", "cemento puro bien cargado de cemento"],
  ["cm_fill_old_recipe_masons", "old bricklayers recipe adding lime the way they used to", "the old recipe the bricklayers of before used", "con un ingrediente que la industria dejo de recomendarte"],
  ["cm_fill_one_more_free", "something done while curing that cost nothing extra", "and one more thing I did while it cured, for free", "la unica diferencia entre las dos"],
  ["cm_fill_error_ruins_all", "concrete cracking the one error that ruins all work", "the one error that cracks your wall for sure", "quedate hasta el final"],
  // ── STAKES ──
  ["cm_fill_not_just_money", "pile of wasted cement bags money lost redo cracked work", "what cracked cement cost you, not just money", "pensa un segundo en lo que el cemento rajado ya te costo"],
  ["cm_fill_render_blows_off", "wall render blowing off and falling in pieces damaged", "the render that filled with cracks and fell in pieces", "del revoque de la pared que quedo lindo liso"],
  ["cm_fill_step_first_step", "concrete step chipped the first day someone stepped hard", "the step that chipped the first day someone stepped on it", "del escalon que hiciste con toda la ilusion"],
  ["cm_fill_crack_treacherous", "concrete crack spreading treacherous growing wider", "here's the treacherous thing about a concrete crack", "no se queda quieta"],
  ["cm_fill_wall_healthy_redo", "sound wall now a job of chipping it all and starting over", "a sound wall becomes chipping it all and starting over", "y vos terminas comprando material de nuevo"],
  // ── EL SECRETO ──
  ["cm_fill_da_bronca_bag", "hardware store cement bag no instructions maddening", "so simple it's maddening they don't explain it", "y es tan simple que da bronca"],
  ["cm_fill_modern_cement_hard", "modern portland cement very hard rigid gray block", "modern cement is very hard", "el cemento portland que compras en el corralon"],
  ["cm_fill_no_flexibility", "rigid brittle concrete no flexibility snapping", "brittle, no flexibility at all", "no tiene nada de flexibilidad"],
  ["cm_fill_ground_settles", "ground settling under a slab a millimeter house breathing", "the ground settles a millimeter, the house breathes", "todo se mueve siempre aunque no lo veas"],
  // ── RETRACCIÓN ──
  ["cm_fill_shrinks_retracts", "cement shrinking retracting losing volume as it dries", "cement shrinks, retracts, loses volume as it sets", "y hay algo mas todavia peor"],
  ["cm_fill_cracks_on_its_own", "concrete cracking on its own from shrinkage no load", "it pulls on itself and cracks alone, just from drying", "y mas tira de si mismo hasta que se agrieta solo"],
  ["cm_fill_fresh_render_cracks", "hairline shrinkage cracks on a freshly plastered wall", "the fine cracks on fresh render", "por eso las fisuras finitas que ves en un revoque recien hecho"],
  // ── ROMANOS ──
  ["cm_fill_lived_with_water", "roman concrete built to live with water and movement", "built to live with water and movement, not fight it", "duro dos mil anos"],
  ["cm_fill_old_thick_render", "old house thick lime render 100 years still sound wall", "the old thick-render houses, still sound at 100 years", "y las casas viejas de tu barrio"],
  // ── LA CAL ──
  ["cm_fill_lime_breathes", "flexible lime render breathing water vapor passing through", "lime breathes, lets water vapor pass, accompanies movement", "y la cal es todo lo contrario del cemento"],
  ["cm_fill_seems_like_magic", "lime mortar self healing seems like magic but isn't", "it has something that seems like magic and isn't", "el mortero de cal se cura solo"],
  ["cm_fill_you_leave_problem", "person smoothing pure cement leaving and the problem starts", "you smooth it, you leave, and there your problem starts", "vos hoy tiras cemento puro"],
  // ── REGLA MADRE ──
  ["cm_fill_repeat_reverse", "the rule reversed from what they sold you about cement", "repeat it, it's the reverse of what they sold you", "repetila porque es al reves de todo lo que te vendieron"],
  ["cm_fill_all_did_this", "old builders all doing lime and curing in different ways", "everything the old folks did was that", "todo lo que hacian los viejos era eso"],
  // ── MÉTODO 1 cal ──
  ["cm_fill_first_most_important", "adding lime the first and most important lost ingredient", "the first and most important: the lost ingredient", "meter cal en la mezcla"],
  ["cm_fill_works_like_butter", "creamy lime mortar spreading like butter gripping wall", "it works like butter, grips better, stays flexible", "cuando le metes cal cambia todo"],
  ["cm_fill_cheapest_there_is", "cheap bag of builders lime one of the cheapest things", "it's one of the cheapest things there is", "y lo compras en cualquier corralon la bolsa de cal por monedas"],
  // ── RECETA ──
  ["cm_fill_how_its_done", "how the old mortar mix is done in a builders trough", "how it's done, where almost nobody knows the option exists", "para un reboque flexible y sano"],
  ["cm_fill_one_one_six", "one cement one lime six sand measured in buckets", "one of cement, one of lime, six of sand", "una parte de cemento una parte de cal y seis partes de arena"],
  ["cm_fill_softer_more_lime", "adjusting mix softer more lime for an old moving wall", "want softer, drop cement and raise lime", "bajas el cemento y subis la cal"],
  // ── INJERTO 1 ──
  ["cm_fill_gathered_measures", "handwritten mortar measures gathered exact amounts manual", "I gathered those measures with the exact amounts", "porque a mi me paso de mezclar a ojo la primera vez"],
  ["cm_fill_nothing_needed_today", "man starting a lime mix today needing nothing extra", "for today you need nothing, you can start already", "con esta proporcion"],
  // ── LÍMITE cal ──
  ["cm_fill_patience_pays", "patience with lime pays off for lasting render walls", "for what really lasts, the patience with lime pays off", "no es para cuando queres que frague en dos horas"],
  // ── CURADO ──
  ["cm_fill_even_good_material", "even people with good material failing at curing concrete", "even those who buy good material fail here", "es el curado"],
  ["cm_fill_drying_is_losing", "concrete just losing water drying vs the chemical set", "drying is losing water and done", "fraguar es una reaccion quimica"],
  ["cm_fill_reaction_takes_days", "cement hydration reaction taking days to finish", "that reaction takes days to do its work", "si vos dejas que el agua se le vaya rapido"],
  ["cm_fill_half_way_weak", "cement left half-set weak porous from drying too fast", "the cement stays half-way, weak and porous", "queda debil poroso"],
  ["cm_fill_give_reaction_time", "giving the cement reaction time with all the water it needs", "they give the reaction time to finish, no rush", "a proposito le tiran agua lo tapan le hacen sombra"],
  ["cm_fill_one_dried_one_cared", "same bag one dried in sun one cured wet comparison", "one dried in the sun, the other was cared for", "el mismo material la misma bolsa"],
  // ── CÓMO CURAR ──
  ["cm_fill_no_finger_mark", "concrete surface no longer marks with a finger set enough", "once it no longer marks with a finger, start caring for it", "apenas el cemento tomo"],
  ["cm_fill_water_soft_times", "watering fresh concrete softly several times a day curing", "wet it, softly, several times a day", "con un plastico con una arpillera o una bolsa mojada"],
  ["cm_fill_shade_it_yourself", "making shade over a fresh concrete slab while curing", "keep it in shade or make shade yourself", "si podes lo dejas a la sombra"],
  ["cm_fill_seven_days_important", "keeping a slab wet seven days for something important", "three, five, seven days if it's important like a sidewalk", "y asi lo mantenes humedo y tapado varios dias"],
  ["cm_fill_most_prevents_cracks", "curing that prevents the most cracks water and a tarp", "it's what prevents the most cracks in your life", "es lo mas barato que existe"],
  // ── AGUA ──
  ["cm_fill_soupy_comfortable", "soupy wet cement mix comfortable to work but weak", "a wet mix is comfortable, and a disaster", "casi todos le tiran agua de mas"],
  ["cm_fill_each_drop_pore", "each drop of extra water leaving a pore inside concrete", "each little drop that leaves makes a hole, a pore", "toda esa agua de mas cuando el cemento fragua no se usa"],
  ["cm_fill_stiff_not_soup", "stiff plastic mortar workable but firm not a soup", "damp, plastic, workable, yes, but not a soup", "cuanta menos agua"],
  ["cm_fill_add_water_slowly", "adding water little by little to the right firm point mix", "add water little by little, stop when it's workable but firm", "ese punto justo"],
  // ── PUZOLANA ──
  ["cm_fill_ash_near_volcanoes", "volcanic ash gathered near volcanoes for roman concrete", "an earth they gathered near the volcanoes: pozzolana", "le metian a la mezcla ceniza volcanica"],
  ["cm_fill_kept_hardening", "roman concrete kept hardening for years decades centuries", "it kept hardening for years, decades, centuries", "y esa ceniza hacia algo increible"],
  ["cm_fill_pozzolanic_bag", "bag of pozzolanic cement sold at hardware yard today", "today it's imitated by pozzolanic cement or added ashes", "como cemento pusolanico"],
  // ── INJERTO 2 ──
  ["cm_fill_lime_cheap_free", "cheap lime and free curing water nobody explains yard", "lime is cheap, curing water is free, less water costs nothing", "ninguna de estas cosas es cara"],
  ["cm_fill_biggest_lie", "the biggest lie that more cement is stronger busted", "that more cement is stronger is the biggest lie of all", "mas cemento es mas retraccion"],
  ["cm_fill_sells_you_redo", "cracked work makes you buy cement again to redo it business", "it cracks, you buy again to redo it: that's the business", "por eso cuando arme el manual lo dividi justo asi"],
  // ── EL ERROR ──
  ["cm_fill_thinks_stronger", "person thinking more cement makes it stronger mistake", "the common person thinks: lots of cement so it's strong", "le pongo bien de cemento"],
  ["cm_fill_started_wrong", "overloaded cement mix already set to shrink and crack", "already started wrong: too much, it'll retract and crack", "le tiro un poco mas de agua"],
  ["cm_fill_watered_porous", "watering the mix made it porous and weak mistake", "worse: watered it, made it porous and weak", "y el sol y el viento le chupan el agua en horas antes de que frague"],
  ["cm_fill_sun_day_leaves", "applying mortar on a hot sunny day leaving it in the open", "applies it on a sunny day, leaves it in the open, walks away", "esa vereda esta rajada antes de que la termines de disfrutar"],
  // ── ES AL REVÉS ──
  ["cm_fill_engrave_the_rule", "engrave the rule lime little water keep it wet curing", "if you remember only that phrase, you'll beat 90% of people", "entonces la regla y es la mas importante de todo el video"],
  // ── REPARAR ──
  ["cm_fill_smear_cement_wrong", "smearing cement over a moving crack the wrong repair", "if you smear cement over a moving crack and leave it", "tapar una grieta que se mueve con cemento rigido es tirar el trabajo"],
  ["cm_fill_fine_still_crack", "a fine still hairline crack taken well by lime mortar", "a fine, still crack, lime mortar takes it well", "y la rellenas con un material que tenga algo de elasticidad"],
  // ── ESTRUCTURAL ──
  ["cm_fill_your_hands_home", "home concrete work with your own hands render floors steps", "for what you do at home, with your hands", "todo lo que te dije hoy es para reboques"],
  ["cm_fill_no_eyeball_video", "structural concrete not done by eye or copying a video", "structural is not done by eye or copying a video", "eso es ingenieria con calculo"],
  ["cm_fill_crack_crosses_beam", "structural crack crossing a beam or column growing warning", "if it crosses a beam or column, appears big and sudden", "y si una grieta que tenes es estructural"],
  ["cm_fill_crack_is_warning", "structural crack a warning not a finishing problem", "a structural crack is a warning, not a finishing problem", "ahi llamas a un profesional"],
  // ── RECAP ──
  ["cm_fill_and_the_error", "the error mucho cemento mucha agua secado rapido recap", "and above all, the error that ruins it all", "la cal el ingrediente perdido para que respire y no se raje"],
  ["cm_fill_wont_crack_winter", "sidewalk render step that won't crack the first winter", "a sidewalk, render, step or subfloor that won't crack", "con esto solo ya podes hacer una vereda"],
  // ── CIERRE ──
  ["cm_fill_wood_rots_borax", "wood rotting and ants gone with a bit of borax cheap fixes", "wood that rots, ants and woodworm gone with borax", "el oxido que se come el hierro"],
  ["cm_fill_leak_mason_trick", "roof leak sealed for good with an old bricklayer trick", "the leak sealed for good with the old mason's trick", "la humedad que sube por la pared"],
  ["cm_fill_no_rewind_notes", "manual so you don't stop the video to write down amounts", "so you don't have to stop the video and rewind for amounts", "y los dias de curado"],
  ["cm_fill_all_one_place", "forty cheap home repairs gathered in one ordered manual", "gathered in one place, ordered for the day you need it", "cuesta menos que una sola bolsa de material"],
  ["cm_fill_add_lime_less_water", "next mix add lime less water keep it wet and covered", "next mix: add lime, less water, keep it wet and covered a few days", "tu pared te lo va a agradecer y tu bolsillo tambien"],
  ["cm_fill_orient_house_walls", "old house orientation thick walls roof detail keeping cool", "how they oriented the house, the walls, that roof detail", "todo lo que perdimos cuando llego el aire acondicionado"],
];
for (const [name, query, concept, ph] of FILL) { const s = atc(ph); if (s == null) continue; beats.push({ id: name, start: +s.toFixed(2), dur: 3, kind: "raw", src: `real/${name}.png`, darken: 0, hue: HUES[Math.round(s) % 3] }); addB(name, query, concept); }
beats.sort((a, b) => a.start - b.start);

// ── BURSTS extra (oxstack) para flashes sub-1s en momentos de lista ──
const BURSTS = [
  { at: "hacian tres o cuatro cosas", images: ["real/cm_lime_lost_ingredient.png", "real/cm_water_cover_shade.png", "real/cm_mix_as_dry_as_workable.png"], captions: ["La cal", "El curado", "Menos agua"], accent: "amber" },
  { at: "aca hay tres cosas que se perdieron", images: ["real/cm_add_lime_to_mix.png", "real/cm_keep_wet_several_days.png", "real/cm_less_water_stronger.png"], captions: ["La mezcla justa", "El curado", "El agua"], accent: "blue" },
  { at: "una parte de cemento una parte de cal y seis partes de arena", images: ["real/cm_pure_cement_loaded.png", "real/cm_cheap_bag_of_lime.png", "real/cm_sand_is_body.png"], captions: ["1 cemento", "1 cal", "6 arena"], accent: "blue" },
  { at: "los tres juntos", images: ["real/cm_puts_lots_of_cement.png", "real/cm_adds_more_water.png", "real/cm_sun_wind_suck_water.png"], captions: ["Mucho cemento", "Mucha agua", "Secado al sol"], accent: "red" },
];
for (const b of BURSTS) { const s = atc(b.at); if (s == null) continue; beats.push({ id: `burst_${Math.round(s)}`, start: +s.toFixed(2), dur: 4.2, kind: "oxstack", overlay: true, hue: "amber", images: b.images, captions: b.captions, accent: b.accent }); }
beats.sort((a, b) => a.start - b.start);

// ── STRUCT — formatos estructurados (gate de variedad: ≥6 tipos, ≥6% peso, bars≥2) ──
const STRUCT = [
  { kind: "bars", at: "eso justamente es el negocio", hue: "red", title: "Lo que te cuesta el cemento rajado", bars: [{ label: "Picar todo y rehacerlo de nuevo", value: 100, display: "$$$", tone: "danger" }, { label: "Meterle cal y curarlo", value: 3, display: "monedas", winner: true }] },
  { kind: "bars", at: "por que el revoque de antes duraba cien anos", hue: "amber", title: "Antes vs hoy: cuánto dura", bars: [{ label: "Revoque de antes, con cal", value: 100, display: "100 años", winner: true }, { label: "Tu revoque de cemento puro", value: 5, display: "2 años", tone: "danger" }] },
  { kind: "bars", at: "un cemento curado humedo tapado unos dias queda mucho mas fuerte y sin grietas", hue: "blue", title: "El mismo material, curado o no", bars: [{ label: "Secado al sol", value: 20, display: "débil, rajado", tone: "danger" }, { label: "Curado húmedo", value: 100, display: "macizo, sano", winner: true }] },
  { kind: "process", at: "de mas simple a mas poderosa", hue: "amber", title: "Los métodos, de más simple a más poderoso", eyebrow: "Cada uno arregla un problema distinto", steps: [{ title: "La cal", desc: "flexibilidad: no se raja con el movimiento" }, { title: "El curado", desc: "mantenerlo húmedo mientras fragua" }, { title: "Menos agua", desc: "macizo y fuerte, no una sopa" }, { title: "La puzolana", desc: "cal + ceniza + tiempo, el truco romano" }] },
  { kind: "process", at: "no es mas cemento", hue: "blue", title: "La regla madre (al revés de lo que te vendieron)", eyebrow: "No es más cemento", steps: [{ title: "Cal", desc: "para que respire y acompañe el movimiento" }, { title: "Poca agua", desc: "para que quede macizo y no poroso" }, { title: "Curado húmedo", desc: "mantenerlo tapado y húmedo unos días" }] },
  { kind: "aged", at: "esa es la clave que se perdio", hue: "blue", heading: "LA RAZÓN FÍSICA", eyebrow: "Todo se mueve, siempre", lines: ["El cemento puro es rígido y frágil", "No acompaña el movimiento de la pared", { text: "Se parte, no se estira: se raja", mark: true }] },
  { kind: "aged", at: "el error es este", hue: "red", heading: "EL ERROR FATAL", eyebrow: "Justo cuando creés que la hacés más fuerte", lines: ["Mucho cemento: retracción", "Mucha agua: porosa y débil", { text: "Secado rápido al sol: rajada antes de disfrutarla", mark: true }] },
  // foto CON PARTES señaladas (AnnotatedImage) — la telaraña de grietas
  { kind: "annotated", at: "el revoque de una pared que ya esta lleno de telaranas de grietas", hue: "red", image: "real/cm_wall_render_spider_cracks.png", eyebrow: "El revoque que ya te está avisando", caption: "Las telarañas de grietas: el cemento se cuarteó al secar", annotations: [{ kind: "circle", x: 0.5, y: 0.5, w: 0.22, label: "fisuras de retracción", color: "danger" }] },
  { kind: "callout", at: "el mortero de cal se cura solo", figure: "Se cura sola", caption: "La cal vuelve a formar carbonato de calcio en la fisura y la cierra sola.", accent: "good", image: "real/cm_lime_self_heals.png" },
  { kind: "callout", at: "son porque le sobro", figure: "Le sobró", caption: "Las fisuras finitas de un revoque nuevo no son por falta de cemento: son por exceso.", accent: "danger", image: "real/cm_fine_cracks_fresh_render.png" },
  // cal = ecuación de 3 ingredientes (IngredientEquation, terrosa)
  { kind: "ingredients", at: "una parte de cemento una parte de cal y seis partes de arena", items: [{ image: "real/cm_pure_cement_loaded.png", label: "Cemento" }, { image: "real/cm_cheap_bag_of_lime.png", label: "Cal" }, { image: "real/cm_sand_is_body.png", label: "Arena" }], resultLabel: "1 : 1 : 6, el revoque que no se raja" },
  // dato duro de los romanos (StatBig, terrosa)
  { kind: "stat", at: "seguia endureciendo durante anos decadas siglos", value: 2000, suffix: " años", eyebrow: "Hormigón romano con puzolana", label: "bajo el agua salada se hizo más duro, no menos", accent: "amber", hue: "amber" },
  { kind: "callout", at: "cuesta menos que una sola bolsa de material", figure: "< 1 bolsa", caption: "El manual cuesta menos que una sola bolsa de material que ibas a tirar rehaciendo la pared.", accent: "good", image: "real/manual_cover.png" },
  // el error como REGLA numerada (RuleNumberScene, terrosa)
  { kind: "rule", at: "es todo al reves de lo que te dijeron", number: "!", title: "Es todo al revés", label: "más cemento no es más fuerte: es más grietas", hue: "red" },
  // reparar lo que se mueve = tarjeta-número (NumberCard, terrosa)
  { kind: "numcard", at: "si se abre y se cierra necesitas flexibilidad si o si", number: "±", name: "Grieta que se mueve", eyebrow: "Rellenala flexible", total: "1", bg: "real/cm_flexible_filler_lime.png", accent: "good" },
  { kind: "checklist", at: "como las de los viejos como las de los romanos a su manera", hue: "blue", title: "El plan contra las grietas", items: [{ text: "No es más cemento: es cal, poca agua y curado", state: "done" }, { text: "La cal: flexible, respira y se cura sola", state: "done" }, { text: "Menos agua: más macizo y fuerte", state: "done" }, { text: "Curar húmedo y tapado varios días", state: "done" }, { text: "El error: mucho cemento, mucha agua, secado al sol", state: "done" }] },
  { kind: "callout", at: "el cemento no se seca el cemento fragua", figure: "Fragua", caption: "El cemento no se seca: fragua. Es una reacción química que necesita agua y tiempo.", accent: "danger", image: "real/cm_cement_doesnt_dry_sets.png" },
  { kind: "splitlist", at: "no te la juegues con lo que aguanta el techo sobre tu cabeza", title: "Lo estructural NO es receta casera", items: ["Columnas, vigas y losas: ingeniería", "Con cálculo y el hierro en su lugar", "Grieta estructural = un aviso", "Ahí llamás a un profesional"], palette: "D" },
  { kind: "cross", at: "esa mezcla queda llena de agujeros microscopicos", hue: "cold", title: "Por qué el agua de más debilita", eyebrow: "En corte", layers: [{ label: "Poca agua", depth: "macizo, sin poros", color: "#c9b28a" }, { label: "Agua de más", depth: "el agua se evapora", color: "#7a8ca0" }, { label: "Resultado", depth: "poroso: se desgrana", color: "#c94f4f" }] },
];
for (const s of STRUCT) { const t = atc(s.at); if (t == null) continue; const { kind, at: _a, image, ...props } = s; const beat = { id: `cmp_${kind}_st_${Math.round(t)}`, start: +t.toFixed(2), dur: 6.5, kind, hue: s.hue || "blue", ...props, ...(image ? { image } : {}) }; if (kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l)); if (kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it)); beats.push(beat); }
beats.sort((a, b) => a.start - b.start);

// ── LAYERED REVEALS — momentos "hero" de REVELADO POR CAPAS con zoom (LayeredReveal) ──
// Patrón canónico (receta del bórax en madera → acá LA RECETA del revoque y los PASOS del curado):
// imagen PRINCIPAL con ken-burns zoom IN → cuando se nombra cada elemento, la principal hace
// zoom OUT + blur + rack-focus y entra UNA sub-imagen por vez (cada una anclada a SU palabra
// exacta en captions). Full-screen, opaco, y con avatar OCULTO (ver LAYERED_WINDOWS abajo).
const LR_MAX = 16; // s — techo de un revelado por capas
const LAYERED_WINDOWS = []; // [start,end] para ocultar el avatar grande en estos momentos
const LAYERS = [
  // 1) LA RECETA — cemento → cal → arena (patrón bórax de madera, aplicado a la mezcla)
  {
    at: "una parte de cemento una parte de cal y seis partes de arena", accent: "blue", tail: 2.2,
    eyebrow: "La mezcla vieja: 1 cemento · 1 cal · 6 arena",
    main: { image: "real/cm_old_recipe_roughly.png", caption: "La mezcla que no se raja" },
    subs: [
      { at: "el cemento le da agarre y velocidad", image: "real/cm_pure_cement_loaded.png", caption: "Cemento: agarre y velocidad" },
      { at: "la cal le da la flexibilidad", image: "real/cm_cheap_bag_of_lime.png", caption: "Cal: flexibilidad y se cura sola" },
      { at: "y la arena es el cuerpo", image: "real/cm_sand_is_body.png", caption: "Arena: el cuerpo" },
    ],
  },
  // 2) EL CURADO — mojar → tapar → sombra (los pasos, escalonados)
  {
    at: "empezas a cuidarlo", accent: "blue", tail: 2.4,
    eyebrow: "El curado: cómo se hace, gratis",
    main: { image: "real/cm_this_is_curing.png", caption: "Curar: mantenerlo húmedo" },
    subs: [
      { at: "con un plastico con una arpillera o una bolsa mojada", image: "real/cm_plastic_burlap_wet_sack.png", caption: "Tapalo: plástico, arpillera, bolsa" },
      { at: "si podes lo dejas a la sombra", image: "real/cm_shade_it.png", caption: "Sombra, para que no pierda agua" },
      { at: "y asi lo mantenes humedo y tapado varios dias", image: "real/cm_keep_wet_days.png", caption: "Húmedo y tapado, varios días" },
    ],
  },
  // 3) EL COMBO ROMANO — cal → ceniza → tiempo/humedad
  {
    at: "y aca aparece la ultima pieza", accent: "amber", tail: 2.4,
    eyebrow: "El hormigón romano: por qué era legendario",
    main: { image: "real/cm_last_piece_roman.png", caption: "Cal + ceniza + tiempo + humedad" },
    subs: [
      { at: "le metian a la mezcla ceniza volcanica", image: "real/cm_volcanic_ash_pozzolana.png", caption: "Ceniza volcánica: la puzolana" },
      { at: "los puertos romanos que estuvieron dos mil anos bajo el agua salada", image: "real/cm_roman_ports_underwater.png", caption: "Bajo el agua salada, más duro" },
    ],
  },
];
for (const L of LAYERS) {
  const t0 = atc(L.at);
  if (t0 == null) continue;
  const t = t0;
  const subs = [];
  for (const s of L.subs) {
    const sa = atc(s.at);
    if (sa == null) continue;
    const off = +(sa - t).toFixed(2);
    if (off < -0.05 || off > LR_MAX - 1.2) continue; // fuera del cap → se descarta
    subs.push({ image: s.image, caption: s.caption, atFrame: Math.max(0, Math.round(off * 30)) });
  }
  subs.sort((a, b) => a.atFrame - b.atFrame);
  const lastSub = subs.length ? Math.max(...subs.map((x) => x.atFrame)) / 30 : 0.5;
  const dur = +Math.min(lastSub + (L.tail || 2.0), LR_MAX).toFixed(2);
  beats.push({ id: `layered_${Math.round(t)}`, start: +t.toFixed(2), dur, kind: "layered", hue: L.accent || "amber", main: L.main, subs, accent: L.accent || "amber", eyebrow: L.eyebrow });
  LAYERED_WINDOWS.push([+t.toFixed(2), +(t + dur).toFixed(2)]);
}
beats.sort((a, b) => a.start - b.start);

fs.mkdirSync("public/broll", { recursive: true }); fs.mkdirSync("public/real", { recursive: true }); fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(MATCH, null, 2));
fs.writeFileSync(`public/real/bing_${SLUG}.json`, JSON.stringify(BING, null, 2));
fs.writeFileSync(`public/img/prompts_${SLUG}_diag.json`, JSON.stringify(DIAGRAMS, null, 2));
if (MODE === "match") { console.log(`=== build_cemento MATCH ===`); console.log(`match ${MATCH.length} · bing ${BING.length} · diag ${DIAGRAMS.length} · proxy ${(2 * MATCH.length / 6).toFixed(0)}/IP`); process.exit(0); }
const haveClip = (n) => fs.existsSync(`public/broll/${n}.mp4`);
const haveReal = (n) => fs.existsSync(`public/real/${n}.png`) || fs.existsSync(`public/real/${n}.jpg`);
const haveImg = (n) => fs.existsSync(`public/img/${n}.png`);
let nClip = 0, nReal = 0, nImg = 0, nMiss = 0; const miss = [];
for (const b of beats) { if (b.kind !== "raw") continue; if (b.src.startsWith("broll/")) { if (haveClip(b.id)) nClip++; else if (haveReal(b.id)) { b.src = `real/${b.id}.png`; nReal++; } else { nMiss++; miss.push(b.id); } } else if (b.src.startsWith("real/")) { if (haveReal(b.id)) nReal++; else { nMiss++; miss.push(b.id); } } else if (b.src.startsWith("img/")) { if (haveImg(b.id)) nImg++; else { nMiss++; miss.push(b.id); } } }
// DENSIDAD MÁXIMA: recomputar dur por beat raw (permite flashes sub-1s, min 0.8s).
{ const ord = beats.filter((b) => !b.overlay).sort((a, b) => a.start - b.start);
  for (let i = 0; i < ord.length; i++) { const b = ord[i]; if (b.kind !== "raw") continue; const next = i + 1 < ord.length ? ord[i + 1].start : TOTAL; b.dur = +Math.max(0.8, Math.min(next - b.start + 0.3, 7)).toFixed(2); } }
// SEGURIDAD: dropear beats raw cuyo asset no existe (evita 404 en el farm).
for (let i = beats.length - 1; i >= 0; i--) { const b = beats[i]; if (b.kind === "raw" && !fs.existsSync("public/" + b.src)) beats.splice(i, 1); }
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, clipsfirst: true, beats }, null, 1));
const AVF = [[0, OPEN]];
for (let i = 0; i < SEC.length; i++) { if (!SEC[i].full) continue; const st = SEC[i].start; const end = i + 1 < SEC.length ? SEC[i + 1].start : TOTAL; AVF.push([st, end]); }
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = []; let k = 0;
for (let i = 0; i < beats.length; i++) { if (beats[i].kind !== "raw") continue; if (i % 5 === 2) { pip.push([beats[i].start, beats[i].start + Math.min(beats[i].dur, 7), POS[k % POS.length]]); k++; } }
const firstClip = beats.length ? beats[0].start : OPEN;
const inAvf = (t) => AVF.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
// cobertura por beats raw; en huecos SIN clip el avatar va FULL (nunca negro)
const cov = beats.filter((b) => b.kind === "raw").map((b) => [b.start, b.start + b.dur]).sort((a, b) => a[0] - b[0]);
const covered = (t) => cov.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
// ★ HIDE: ventanas donde un COMPONENTE PROMINENTE manda a PANTALLA COMPLETA y el
// avatar GRANDE NO debe tapar/duplicar (DIAGRAMAS, LAYERED REVEALS, y el set de pulido
// hero de pantalla completa). Tiene PRIORIDAD MÁXIMA en modeAt y sus bordes entran en `pts`.
const PROMINENT = new Set(["diagram", "layered", "mdtwoplanks", "mdrulestamp", "mdslider", "mdkicker", "mdendcard", "cmrecipe", "cmyears", "cmselfheal", "cmcure", "cmerror"]);
const HIDE = [
  ...beats.filter((b) => PROMINENT.has(b.kind)).map((b) => [b.start, +(b.start + b.dur).toFixed(2)]),
].sort((a, b) => a[0] - b[0]);
const inHide = (t) => HIDE.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const modeAt = (t) => { if (inHide(t)) return "hidden"; if (t < firstClip - 1e-6) return "full"; if (inAvf(t)) return "full"; if (!covered(t)) return "full"; const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6); return p ? p[2] : "hidden"; };
const pts = [...new Set([0, firstClip, ...AVF.flat(), ...pip.flatMap((p) => [p[0], p[1]]), ...cov.flat(), ...HIDE.flat(), TOTAL].map((x) => +(+x).toFixed(2)))].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);
const avSecs = AVF.reduce((a, [s, e]) => a + (e - s), 0);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const dur = beats.length ? beats[beats.length - 1].start + beats[beats.length - 1].dur : 0;
const rawN = beats.filter((b) => b.kind === "raw").length;
console.log(`=== build_cemento BUILD ===`);
console.log(`beats ${beats.length} (raw ${rawN}, ${(100 * rawN / beats.length).toFixed(0)}%) · clips ${nClip} · imgs ${nReal} · gpt ${nImg} · faltan ${nMiss} · dur ${(dur / 60).toFixed(1)}min · pace ${(dur / beats.length).toFixed(1)}s`);
console.log(`avatar-full ${(avSecs / 60).toFixed(1)}min · PiP ${pip.length} · windows ${windows.length} · MATCH ${MATCH.length} · BING ${BING.length} · DIAG ${DIAGRAMS.length}`);
if (miss.length) console.log(`faltan (${miss.length}): ${miss.slice(0, 12).join(", ")}`);
