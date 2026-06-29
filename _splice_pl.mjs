// Splice: reemplaza SECTIONS y OVL del clon build_plomeria.mjs con contenido del video plomería.
import fs from "fs";
const path = "build_plomeria.mjs";
let src = fs.readFileSync(path, "utf8");

const SECTIONS = `const SECTIONS = [
  // ░░ 1) COLD OPEN — el plomero que cobró una fortuna ░░
  { a: "la ultima vez que llame a un plomero", start: 0, beats: [
    C("pl_plumber_invoice", "plumber handing expensive invoice homeowner", "a plumber handing over an expensive bill", { at: "me cobro una fortuna por destapar" }),
    C("pl_clog_unclog_quick", "plumber clearing clogged sink drain fast", "a plumber clearing a clogged drain in minutes", { at: "destapar una caneria" }),
    C("pl_watch_clock", "stopwatch ten minutes timer close up", "ten minutes on a clock, that fast", { at: "diez minutos" }),
    C("pl_man_watching_plumber", "man watching plumber work under sink kitchen", "standing right next to him, watching the work", { at: "quede parado al lado mirando" }),
    I("pl_kitchen_cupboard", "open kitchen cupboard baking soda vinegar pantry", "the pantry that already held the fix", { at: "ya tenia en la alacena" }),
    I("pl_old_plumber_mate", "old man drinking mate argentine yard portrait", "an old plumber sharing mate and a secret", { at: "tomando unos mates" }),
    C("pl_money_handed", "handing cash money payment hand", "paying for knowledge, not work", { at: "no es por el trabajo" }),
    C("pl_plumber_knows", "experienced plumber confident hand on pipe", "what he knows is not magic", { at: "no es magia" }),
    G("pl_tomas_hook", { kicker: "Lo que el plomero no quiere que sepas" }),
    C("pl_cheap_tricks_tools", "simple plumbing hand tools on workbench", "four or five cheap tricks anyone can do", { at: "cuatro o cinco trucos baratos" }),
  ]},
  // ░░ 2) CONFIRMACIÓN — los síntomas ░░
  { a: "si entraste a este video", beats: [
    I("pl_sink_full_water", "kitchen sink full of dirty standing water clogged", "a sink filling up and not draining", { at: "la pileta que se tapa y no baja" }),
    I("pl_faucet_drip_night", "dripping faucet water drop close up night", "a faucet dripping all night long", { at: "la canilla que gotea toda la noche" }),
    I("pl_toilet_running", "toilet tank running water leak bathroom", "a toilet that seems to be leaking", { at: "el inodoro que parece que pierde" }),
    I("pl_water_bill_high", "shocking high water utility bill paper", "a water bill through the roof", { at: "la factura del agua que te llego por las nubes" }),
    C("pl_calling_plumber", "person phone calling plumber waiting frustrated", "calling the plumber, waiting half a day", { at: "llamas al plomero" }),
    C("pl_drain_cleaner_warning", "harsh chemical drain cleaner bottle pouring", "harsh drain chemicals that ruin pipes", { at: "te arruinan los canos" }),
  ]},
  // ░░ 3) ROADMAP / open loops ░░
  { a: "te voy a ensenar a destapar cualquier caneria", beats: [
    C("pl_clearing_drain_no_chem", "unclogging drain without chemicals home tools", "unclogging any pipe without expensive chemicals", { at: "sin un solo quimico caro" }),
    C("pl_dye_drop_tank", "blue dye drops into toilet tank water test", "the ink-drop trick that finds hidden leaks", { at: "el truco de la gota de tinta" }),
    I("pl_hidden_leak_meter", "water meter spinning hidden leak detection", "the hidden leak inflating your bill", { at: "esa perdida escondida" }),
    C("pl_faucet_washer_change", "replacing rubber washer in faucet repair", "swapping the cheap rubber washer", { at: "cambiar la goma de la canilla" }),
    C("pl_pipe_splits", "old pipe cracking splitting apart corrosion", "until one day the pipes split", { at: "se parten" }),
    C("pl_chemical_eating_pipe", "corroded pipe interior damage cutaway", "the mistake that eats pipes from inside", { at: "comiendo las canerias por dentro" }),
  ]},
  // ░░ 4) SOY TOMÁS ░░
  { a: "soy tomas", full: true, beats: [] },
  // ░░ 5) STAKES — lo que la plomería te cuesta ░░
  { a: "lo que la plomeria te cuesta", beats: [
    I("pl_bill_doubled", "water bill amount doubled invoice shock", "a water bill that doubled from a leak you never saw", { at: "que se duplico por una perdida" }),
    C("pl_toilet_silent_leak", "toilet bowl water trickling silently bathroom", "a toilet leaking in silence for months", { at: "perdiendo en silencio meses" }),
    C("pl_drip_bucket_summer", "faucet dripping into bucket steady drops", "drop by drop, buckets of water wasted", { at: "gota a gota" }),
    C("pl_emergency_plumber_triple", "emergency plumber night expensive charge", "the emergency plumber who wants triple", { at: "te queria cobrar el triple" }),
    C("pl_sink_overflow_night", "sink water rising overflow emergency night", "water rising in the sink on a Sunday night", { at: "se tapo un domingo a la noche" }),
    C("pl_damp_wall_stain", "water damp stain spreading on wall interior", "a damp stain on the wall, a pipe leaking inside", { at: "mancha de humedad en la pared" }),
    C("pl_pipe_leak_inside_wall", "burst pipe leaking inside wall cavity", "a pipe leaking inside the wall, rotting it", { at: "un cano perdiendo adentro" }),
    C("pl_rotted_wall", "wall ruined by water damage mold rot", "the whole wall rotted if you don't find it", { at: "pudre la pared entera" }),
  ]},
  // ░░ 6) EL PRINCIPIO — la mayoría son baratos ░░
  { a: "ahora viene lo que cambia todo", beats: [
    G("pl_tomas_principio", { kicker: "Tan simple que da bronca" }),
    X({ kind: "diagram", at: "tres o cuatro cosas chiquitas", eyebrow: "El 90% son tres cositas baratas", slides: [{ image: dg("dg_pl_causas", "Diagrama claro con tres bloques iconográficos de las causas reales de casi todo problema de plomería: 1) grasa y pelo acumulados en un codo del caño (corte de caño con un tapón pegajoso), 2) una goma o cuerito gastado (gomita chiquita partida), 3) una unión floja que gotea (dos caños enroscados con una gota). Etiquetas 'grasa y pelo', 'goma gastada', 'union floja'. Transmite 'no son caños rotos, son cositas de centavos'."), eyebrow: "Grasa y pelo, una goma, una unión floja" }] }),
    I("pl_grease_hair_elbow", "grease and hair clog inside pipe bend cutaway", "grease and hair packed in a pipe elbow", { at: "graza y pelo acumulados en un codo" }),
    I("pl_worn_washer", "old worn rubber washer plumbing close up", "a two-peso worn washer", { at: "una goma de dos pesos gastada" }),
    C("pl_loose_joint_drip", "loose pipe joint dripping under sink", "a loose joint where two pipes meet", { at: "o una union floja" }),
    C("pl_plumber_quick_fix", "plumber quick repair under sink ten minutes", "he fixes it in ten minutes and charges like an opera", { at: "lo resuelve en 10 minutos" }),
    C("pl_knowing_what_to_touch", "plumber pointing knowing exactly what to fix", "he charges for knowing what to touch", { at: "te cobra el saber que tocar" }),
  ]},
  // ░░ 7) REGLA #1 (va en OVL) ░░
  { a: "asi que la regla numero uno", beats: [
    C("pl_mechanical_first", "hand tools plunger wrench before chemicals", "attack the mechanical and cheap first", { at: "ataca siempre lo mecanico y lo barato primero" }),
    C("pl_methods_intro", "row of plumbing tools simple to powerful", "the methods, simplest to most powerful", { at: "vamos a los metodos" }),
  ]},
  // ░░ 8) MÉTODO 1 — destapar: sopapa ░░
  { a: "empecemos por lo mas comun de todo", beats: [
    C("pl_clogged_sink_slow", "kitchen sink draining slowly clogged water", "the most common one: the clogged sink", { at: "la caneria tapada" }),
    X({ kind: "diagram", at: "no esta en lo profundo del cano", eyebrow: "El tapón está cerca, lo sacás vos", slides: [{ image: dg("dg_pl_tapon", "Diagrama en corte del caño de desagüe bajo una pileta: el tapón (grasa, pelo) NO está en lo profundo sino justo en el primer codo, cerca del desagüe. Una flecha señala 'el 90% de las veces, el tapón está acá, cerca'. Estilo técnico limpio."), eyebrow: "El 90% de las veces, en el primer codo" }] }),
    I("pl_plunger_corner", "rubber plunger leaning in corner bathroom", "the plunger everyone has tossed in a corner", { at: "esa goma con el palo" }),
    C("pl_seal_overflow_rag", "wet rag blocking sink overflow hole", "plugging the overflow hole with a wet rag", { at: "tapalo con un trapo mojado" }),
    C("pl_water_covers_plunger", "water filling sink covering plunger rubber", "water covering the plunger cup", { at: "que cubra bien la goma del desatascador" }),
    C("pl_plunger_seal_drain", "plunger sealed around sink drain hole", "press it sealing tight around the drain", { at: "sellando bien alrededor del desague" }),
    C("pl_plunging_hard", "plunging sink drain vigorous short strokes", "short sharp strokes, up and down, with force", { at: "das tirones cortos y secos" }),
    C("pl_sink_draining_clear", "sink water draining clear unclogged success", "the clog breaks, the sink drains", { at: "afloja el tapon" }),
  ]},
  // ░░ 9) MÉTODO 2 — bicarbonato + vinagre + agua hirviendo ░░
  { a: "va el metodo de toda la vida", beats: [
    X({ kind: "oxstack", at: "media taza de bicarbonato de sodio", images: ["real/pl_baking_soda_box.png", "real/pl_vinegar_bottle.png", "real/pl_kettle_boiling.png"], captions: ["Bicarbonato", "Vinagre blanco", "Agua hirviendo"], accent: "blue" }),
    I("pl_baking_soda_box", "box of baking soda kitchen", "the same baking soda from the kitchen", { at: "ese mismo de la cocina" }),
    I("pl_vinegar_bottle", "white vinegar bottle kitchen", "a cup of plain white vinegar", { at: "una taza de vinagre blanco" }),
    I("pl_kettle_boiling", "kettle of boiling water steam", "a kettle of boiling water", { at: "le tiras de golpe" }),
    C("pl_baking_soda_drain", "pouring baking soda into sink drain", "half a cup of baking soda down the drain", { at: "media taza de bicarbonato de sodio ese mismo" }),
    C("pl_vinegar_pour_drain", "pouring white vinegar into drain fizzing", "a cup of white vinegar after it", { at: "una taza de vinagre blanco" }),
    C("pl_foam_fizz_drain", "foaming bubbling chemical reaction in drain", "it foams and bubbles, softening the grease", { at: "va a burbujear" }),
    C("pl_reaction_soften_grease", "vinegar baking soda reaction softening grease", "let it work, softening the grease", { at: "ablanda la grasa" }),
    C("pl_boiling_water_kettle", "pouring boiling water kettle into sink drain", "a kettle of boiling water to finish", { at: "una pava de agua bien hirviendo" }),
    C("pl_hot_water_melts_grease", "hot water melting grease inside drain pipe", "the hot water melts the grease that glues it all", { at: "derrite la grasa" }),
    I("pl_grease_soap_clog", "grease soap clog dissolving in pipe", "grease and soap clogs, the majority", { at: "tapones de grasa y jabon" }),
  ]},
  // ░░ 10) MÉTODO — el pelo: sonda / alambre ░░
  { a: "y si el tapon es de pelo", beats: [
    C("pl_hair_clog_ball", "tangled hair clog ball pulled from drain", "a tangled ball of hair in the drain", { at: "el pelo se enreda como una pelota" }),
    I("pl_drain_snake_tool", "plumber drain snake auger hand tool", "a cheap drain snake from the hardware store", { at: "una sonda de plomero" }),
    C("pl_wire_hook_hanger", "bent wire coat hanger hook for drain", "a coat-hanger wire with a hook bent on the end", { at: "un alambre de los de colgar ropa" }),
    C("pl_pull_hair_out", "pulling hair clog out of drain with hook", "hooking the hair mat and pulling it out", { at: "enganchas la marana de pelo" }),
  ]},
  // ░░ 11) EL SECRETO — el sifón / trampa ░░
  { a: "y ahora el secreto que vale el video entero", beats: [
    X({ kind: "diagram", at: "que se llama sifon", eyebrow: "El sifón: la trampa en S", slides: [{ image: dg("dg_pl_sifon", "Diagrama en corte del sifón bajo una pileta: el caño con forma de S/U que retiene siempre un poco de agua para tapar el olor de la cloaca. Mostrar que es el punto más bajo donde se junta el 80% de los tapones. Etiquetas 'sifon o trampa', 'el agua tapa el olor', 'aca se junta el 80% de la mugre'. Una tuerca que se desenrosca a mano."), eyebrow: "Se desenrosca con la mano y ahí está el tapón" }] }),
    C("pl_p_trap_under_sink", "p-trap pipe under sink curved drain", "the curved S-shaped trap under the sink", { at: "hay un cano con forma de s" }),
    C("pl_bucket_under_trap", "bucket placed under sink p-trap drain", "a bucket placed underneath", { at: "pones un balde abajo" }),
    C("pl_unscrew_trap", "unscrewing p-trap nut by hand under sink", "loosening and removing the trap", { at: "lo aflojas lo sacas" }),
    C("pl_pliers_loosen_trap", "using pliers to loosen stuck p-trap nut", "pliers if the nut is stuck tight", { at: "o con una pinza si esta duro" }),
    C("pl_gunk_in_trap", "gunk grease hair emptied from p-trap pipe", "all the filth that was clogging it", { at: "toda la porqueria que tapaba" }),
    C("pl_clean_reattach_trap", "cleaning and reattaching sink p-trap", "clean it, screw it back, done", { at: "lo limpias lo volves a enroscar" }),
  ]},
  // ░░ 12) INJERTO 1 — manual ░░
  { a: "ahora las medidas justas", beats: [
    X({ kind: "diagram", at: "todo eso lo tengo anotado", eyebrow: "Las dosis y medidas exactas, anotadas", slides: [{ image: dg("dg_pl_manual", "Lámina de un manual/cuaderno abierto sobre una mesa con recetas de arreglos de plomería: cantidades de bicarbonato y vinagre, qué sonda comprar, cómo desenroscar el sifón sin pasarse de rosca. Una regla y un lápiz al lado, estilo archivo artesanal. Transmite 'todo ordenado con las medidas justas'. Sin texto legible."), eyebrow: "El Manual de Reparaciones Caseras" }] }),
    C("pl_cracked_nut_trap", "cracked plastic plumbing nut over-tightened", "the plastic nut I cracked the first time", { at: "raje la tuerca" }),
    I("pl_manual_phone_steps", "phone showing home repair manual on table", "the steps written down in a manual I put together", { at: "en un manual que arme" }),
  ]},
  // ░░ 13) PÉRDIDA ESCONDIDA — intro ░░
  { a: "pero hay un problema mucho mas caro", beats: [
    I("pl_no_visible_leak", "dry pipe no visible leak mystery", "a leak you never see dripping", { at: "esa que no ves gotear por ningun lado" }),
    C("pl_bill_doubled_zoom", "water bill amount circled doubled red", "a bill that suddenly doubled", { at: "se duplico sin que cambiaras nada" }),
    C("pl_wall_damp_no_rain", "damp patch on wall no rain interior leak", "a damp stain with no rain, a pipe in the wall", { at: "una pared sin que haya llovido" }),
  ]},
  // ░░ 14) EL TRUCO DEL MEDIDOR ░░
  { a: "el truco del medidor", beats: [
    C("pl_water_meter_dial", "residential water meter dial close up", "go to your home water meter", { at: "anda al medidor de agua de tu casa" }),
    C("pl_close_all_taps", "turning off all faucets taps house", "close every tap, not a single drop running", { at: "cerra todas las canillas" }),
    C("pl_look_at_meter", "looking closely at water meter numbers dials", "now look at the meter dials", { at: "ahora mira el medidor" }),
    C("pl_meter_still_spinning", "water meter dial slowly spinning leak", "if the meter keeps turning, you have a leak", { at: "el medidor igual sigue girando" }),
  ]},
  // ░░ 15) EL INODORO — colorante ░░
  { a: "y cual es la perdida escondida mas comun", beats: [
    I("pl_toilet_silent", "toilet leaking silently bathroom close", "the toilet, leaking in silence", { at: "el inodoro que pierde en silencio" }),
    X({ kind: "diagram", at: "esa goma grande que esta en el fondo de la mochila", eyebrow: "El sapito: la goma del fondo del tanque", slides: [{ image: dg("dg_pl_sapito", "Diagrama en corte de la mochila (tanque) del inodoro: la goma grande del fondo (el 'sapito' o tapón de descarga) endurecida y gastada, dejando pasar un hilito de agua del tanque a la taza. Flecha del agua escapándose. Etiquetas 'goma del fondo gastada', 'deja pasar agua todo el dia', 'miles de litros al mes'."), eyebrow: "Endurecida, deja pasar agua día y noche" }] }),
    C("pl_thousands_liters", "water rushing down drain waste litres", "thousands of litres a month down the drain", { at: "miles de litros al mes" }),
    C("pl_dye_into_tank", "adding colored dye drops into toilet tank", "drops of dye into the tank, no flushing", { at: "unas gotas de colorante" }),
    C("pl_wait_no_touch", "toilet tank lid open waiting still water", "wait twenty minutes without touching", { at: "sin tocar nada" }),
    C("pl_colored_water_bowl", "colored water appearing in toilet bowl", "if the bowl turns colored, the seal leaks", { at: "se tino de color" }),
    C("pl_replace_flapper", "replacing toilet flapper valve seal by hand", "swap that two-peso seal by hand", { at: "cambiar esa goma cuesta dos pesos" }),
  ]},
  // ░░ 16) LA CANILLA — cuerito ░░
  { a: "lo mismo con la canilla que gotea", beats: [
    C("pl_dripping_faucet_close", "dripping tap single water drop macro", "that drip, buckets of water a month", { at: "ese goteo gota a gota" }),
    I("pl_faucet_washer_small", "small rubber faucet washer in fingers", "the tiny worn washer inside the tap", { at: "esa gomita chiquita" }),
    C("pl_shutoff_disassemble", "closing shutoff valve disassembling faucet", "close the stopcock, take the tap apart", { at: "cerras la llave de paso" }),
    C("pl_old_washer_out", "removing old worn washer from faucet stem", "pull out the old worn washer", { at: "sacas la gomita vieja" }),
    C("pl_new_washer_in", "installing new faucet washer repair", "a new washer that costs cents", { at: "pones una nueva que cuesta centavos" }),
  ]},
  // ░░ 17) EL AIREADOR ░░
  { a: "la canilla o la ducha que de golpe tira poca agua", beats: [
    C("pl_weak_water_flow", "weak trickle water from faucet low flow", "a weak trickle with no force", { at: "un chorrito flojo" }),
    I("pl_aerator_tip", "faucet aerator screen tip close up", "the aerator, the little screen on the tip", { at: "es el aireador" }),
    C("pl_unscrew_aerator", "unscrewing faucet aerator by hand pliers", "unscrew it, full of white grit inside", { at: "una mallita llena de tierra blanca" }),
    C("pl_aerator_soak_vinegar", "faucet aerator soaking in glass of vinegar", "soak it in vinegar to dissolve the scale", { at: "en un poco de vinagre" }),
    C("pl_showerhead_soak", "shower head soaking in vinegar overnight", "the shower head soaked overnight in vinegar", { at: "toda la noche en un recipiente con vinagre" }),
  ]},
  // ░░ 18) UNIONES — teflón / epoxi ░░
  { a: "y para las perdidas en las uniones de los canos", beats: [
    C("pl_teflon_tape_thread", "wrapping teflon tape on pipe threads", "wrap the thread well with teflon tape", { at: "con cinta de teflon" }),
    I("pl_epoxy_putty_pipe", "plumbing epoxy putty sealing pipe hole", "epoxy putty that hardens like stone over a pinhole", { at: "masilla epoxy para plomeria" }),
    C("pl_pipe_clamp_rubber", "rubber pipe repair clamp over leak", "a rubber clamp pressed right over the hole", { at: "una abrasadera con goma" }),
  ]},
  // ░░ 19) PREVENCIÓN — la grasa ░░
  { a: "la regla de oro de la prevencion", beats: [
    C("pl_pouring_grease_sink", "pouring used cooking grease into sink drain", "people pour grease down the sink", { at: "la grasa de las ollas por la pileta" }),
    X({ kind: "diagram", at: "se pega a las paredes", eyebrow: "Por qué la grasa tapa todo", slides: [{ image: dg("dg_pl_grasa", "Diagrama en corte de un caño de cocina: grasa caliente que entra líquida pero al enfriarse se pega a las paredes del caño como sebo, cerrando el paso de a poco hasta taparlo. Mostrar la progresión de caño limpio a caño tapado. Etiquetas 'entra caliente y liquida', 'se enfria y se pega como cebo', 'cierra el paso'."), eyebrow: "Se enfría y se pega como sebo" }] }),
    C("pl_grease_jar_trash", "pouring grease into jar for the trash", "let it cool in a jar, into the trash", { at: "deja que se enfrie en un frasco" }),
    C("pl_drain_strainer", "metal drain strainer catching food hair", "a strainer in every drain", { at: "una rejilla en cada desague" }),
    C("pl_clean_drain_prevent", "clean clear sink drain no clogs", "two habits that save 90% of clogs", { at: "te ahorran el 90 de los tapones" }),
  ]},
  // ░░ 20) LLAVE DE PASO + OLOR A CLOACA ░░
  { a: "dos cosas que tenes que saber", beats: [
    C("pl_main_shutoff_valve", "main water shutoff valve house close up", "find your main water shutoff valve now", { at: "la llave de paso general del agua" }),
    C("pl_burst_pipe_flood", "burst pipe water spraying flooding house", "the day a pipe bursts on a Sunday night", { at: "con el agua saliendo a chorros" }),
    C("pl_pour_water_drain", "pouring bucket of water down floor drain", "a dry trap lets sewer gas in: pour water", { at: "echale un balde de agua" }),
    C("pl_oil_drain_seal", "pouring oil into floor drain to seal", "a splash of oil so it lasts longer", { at: "tirale arriba un chorrito de aceite" }),
  ]},
  // ░░ 21) EL ERROR — soda cáustica ░░
  { a: "el error es tirarle soda caustica", beats: [
    I("pl_caustic_soda_bottle", "caustic soda lye drain cleaner bottle warning", "caustic soda, a corrosive poison", { at: "la soda caustica es un veneno corrosivo" }),
    C("pl_pipe_eaten_inside", "corroded metal pipe eaten from inside perforated", "it eats old metal pipes from the inside", { at: "se los come desde adentro" }),
    C("pl_plastic_pipe_warp", "plastic pipe deforming from heat damage", "the reaction warps plastic pipes", { at: "los puede deformar y ablandar" }),
    C("pl_chemical_skin_burn", "chemical splash hazard skin eyes warning", "it burns skin and eyes if it splashes", { at: "te quema la piel y los ojos" }),
    C("pl_toxic_vapors", "toxic fumes vapors warning chemical drain", "vapors you shouldn't breathe", { at: "larga vapores que no tenes que respirar" }),
    C("pl_clogged_caustic_pool", "clogged pipe full of caustic water hazard", "now a pipe full of caustic water, a bomb", { at: "que es una bomba" }),
  ]},
  // ░░ 22) REGLA FINAL (OVL) ░░
  { a: "la regla final", beats: [
    C("pl_mechanical_tools_row", "plunger trap snake baking soda laid out", "mechanical before chemical, always", { at: "lo mecanico antes que lo quimico siempre" }),
  ]},
  // ░░ 23) LÍMITES HONESTOS ░░
  { a: "y un par de honestidades", beats: [
    C("pl_pro_machine_plumber", "professional plumber with drain rooter machine", "that's a job for a plumber with a machine", { at: "un trabajo de plomero con maquina" }),
    C("pl_collapsed_pipe_roots", "collapsed sewer pipe tree roots invading", "a collapsed pipe or tree roots: call a pro", { at: "tomado por las raices de un arbol" }),
    C("pl_toilet_mechanism", "toilet tank fill valve mechanism replacement", "sometimes the whole tank mechanism must change", { at: "cambiar el mecanismo entero de la mochila" }),
    C("pl_hot_water_old_pipe", "hot water caution old thin plastic pipe", "careful with boiling water in old thin pipes", { at: "canos de plastico muy viejos o finitos" }),
  ]},
  // ░░ 24) INJERTO 2 — por qué nadie te lo enseña ░░
  { a: "cuando arme el manual", beats: [
    G("pl_tomas_pausa", { kicker: "Nadie te lo enseña" }),
    X({ kind: "chips", at: "le conviene que sigas levantando el telefono", title: "Por qué nadie te lo enseña", chips: ["Al plomero no le conviene", "que sepas que el 80% lo hacés solo", "que sigas levantando el teléfono"], hue: "red", imageDarken: 0.6, _bg: { name: "pl_phone_calling_bg", query: "person calling plumber on phone kitchen", concept: "a person on the phone calling a plumber again" }, image: "real/pl_phone_calling_bg.png" }),
    X({ kind: "splitlist", at: "lo dividi justo asi", title: "Los 40 arreglos, divididos así", items: ["Madera y metal que no mueren", "Plagas por centavos", "Goteras, humedad y moho", "Arreglos del hogar y el auto"], palette: "A" }),
  ]},
  // ░░ 25) RECAP ░░
  { a: "asi que recapitulemos", beats: [
    X({ kind: "checklist", at: "asi que recapitulemos", title: "El plan contra la plomería", items: [{ text: "Sopapa bien usada primero", state: "done" }, { text: "Bicarbonato, vinagre y agua hirviendo", state: "done" }, { text: "Desarmar el sifón: ahí está el tapón", state: "done" }, { text: "Medidor + colorante para la pérdida", state: "done" }, { text: "Grasa nunca a la pileta, nada de soda cáustica", state: "done" }] }),
    I("pl_fixed_sink_clean", "clean working kitchen sink draining well", "your home's water problems, solved", { at: "el 80 de los problemas de agua de tu casa" }),
  ]},
  // ░░ 26) INJERTO 3 + CIERRE ░░
  { a: "la casa entera y hasta el auto", beats: [
    X({ kind: "diagram", at: "junte los 40 en el manual de reparaciones caseras", eyebrow: "Los 40, ordenados y probados", slides: [{ image: dg("dg_pl_stack", "Lámina tipo colección de valor artesanal: el Manual de Reparaciones Caseras con 40 arreglos (madera, óxido, plagas, goteras, plomería) con planos y medidas, apilado como una pila de valor. Estilo archivo, sin precios ni texto legible."), eyebrow: "Con los planos y las medidas exactas" }] }),
    C("pl_plumber_again", "homeowner calling plumber expensive visit", "cheaper than a single plumber visit", { at: "cuesta menos que una sola visita del plomero" }),
    C("pl_grab_plunger_today", "person grabbing plunger to unclog sink", "next time, grab the plunger and open the trap", { at: "agarra la sopapa y desarma el sifon" }),
  ]},
  // ░░ 27) PRÓXIMO ░░
  { a: "en el proximo video me voy a meter con el auto", beats: [
    C("pl_yellow_headlights", "yellowed cloudy car headlights oxidized", "next: cloudy yellow headlights made clear again", { at: "los faros amarillos y opacos del auto" }),
    C("pl_restored_headlight", "clear restored car headlight polished new", "clear as new, in minutes, on the curb", { at: "otra vez transparentes" }),
  ]},
  { a: "la independencia no se compra", full: true, beats: [] },
];`;

const OVL = `const OVL = [
  // ── HOOK ──
  { kind: "oxquote", at: "no es por el trabajo", dur: 5.0, quote: "La mitad de lo que te cobra el plomero no es por el trabajo. *Es porque vos no sabés lo que él sabe*.", image: "real/pl_old_plumber_mate.png", attribution: "Un plomero de 65 años", side: "right", accent: "blue" },
  // ── CONFIRMACIÓN ──
  { kind: "oxstack", at: "la pileta que se tapa y no baja", dur: 4.4, images: ["real/pl_sink_full_water.png", "real/pl_faucet_drip_night.png", "real/pl_toilet_running.png"], captions: ["La pileta tapada", "La canilla que gotea", "El inodoro que pierde"], accent: "blue" },
  // ── PRINCIPIO ──
  { kind: "oxstat", at: "los mismos 5 una y otra vez", dur: 4.0, value: 90, suffix: " %", label: "de los problemas son los mismos cinco, una y otra vez", glyph: "💧", accent: "red" },
  { kind: "oxside", at: "graza y pelo acumulados en un codo", dur: 5.2, image: "real/pl_grease_hair_elbow.png", title: "Lo que tapa de verdad", lines: ["Grasa y pelo en un codo del caño", "Una goma de dos pesos gastada", "O una unión floja que gotea"], side: "right", accent: "red" },
  // ── REGLA #1 ──
  { kind: "oxrule", at: "ataca siempre lo mecanico y lo barato primero", dur: 4.6, text: "Antes de ningún químico: lo *mecánico* y lo *barato* primero.", accent: "amber" },
  // ── MÉTODO 1 — sopapa ──
  { kind: "oxmethod", at: "primero el desatascador", dur: 4.6, num: "01", title: "La sopapa, bien usada", chips: ["Tapar rebosadero", "Cubrir con agua", "Tirones secos"], cost: "gratis", accent: "amber" },
  { kind: "oxrule", at: "no es el aire es el agua", dur: 4.4, text: "Lo que empuja el tapón no es el *aire*, es el *agua*.", accent: "amber" },
  // ── MÉTODO 2 — bicarbonato ──
  { kind: "oxmethod", at: "va el metodo de toda la vida", dur: 4.6, num: "02", title: "Bicarbonato y vinagre", chips: ["½ taza bicarbonato", "1 taza vinagre", "Agua hirviendo"], cost: "centavos", accent: "blue" },
  // ── EL SIFÓN ──
  { kind: "oxmethod", at: "y ahora el secreto que vale el video entero", dur: 4.8, num: "03", title: "El sifón: el secreto", chips: ["Balde abajo", "Desenroscar", "Limpiar"], cost: "gratis", accent: "amber" },
  { kind: "oxstat", at: "se junta el 80 de los tapones", dur: 4.0, value: 80, suffix: " %", label: "de los tapones se juntan en el sifón, el punto más bajo", glyph: "🪣", accent: "amber" },
  // ── PÉRDIDA ESCONDIDA — medidor ──
  { kind: "oxmethod", at: "el truco del medidor", dur: 4.6, num: "04", title: "El truco del medidor", chips: ["Cerrar todo", "Mirar el medidor", "¿Sigue girando?"], cost: "gratis", accent: "blue" },
  { kind: "oxside", at: "el inodoro que pierde en silencio", dur: 5.2, image: "real/pl_toilet_silent.png", title: "La pérdida más cara", lines: ["La goma del fondo del tanque, gastada", "Pierde día y noche, sin ruido", "Miles de litros al mes al desagüe"], side: "right", accent: "red" },
  { kind: "oxstat", at: "puede ser la mitad de tu factura de agua", dur: 4.2, value: 50, suffix: " %", label: "una sola goma de dos pesos puede ser media factura", glyph: "🚽", accent: "red" },
  // ── AIREADOR ──
  { kind: "oxtag", at: "es el aireador", dur: 4.0, name: "El aireador", what: "Tapado de sarro: por eso tira poca agua", side: "left", accent: "blue" },
  // ── PREVENCIÓN ──
  { kind: "oxrule", at: "la grasa nunca va a la pileta", dur: 4.4, text: "La grasa *nunca* va a la pileta. Al frasco y a la basura.", accent: "amber" },
  // ── EL ERROR ──
  { kind: "oxstat", at: "es como apagar un incendio con nafta", dur: 4.2, value: 0, suffix: "", prefix: "", label: "la soda cáustica: arreglás hoy y arruinás el caño mañana", glyph: "☠️", accent: "red" },
  { kind: "oxrule", at: "la soda caustica nunca", dur: 4.6, text: "La soda cáustica, *nunca*. Lo mecánico antes que lo químico.", accent: "red" },
  // ── CIERRE ──
  { kind: "oxquote", at: "el link esta abajo", dur: 5.2, quote: "Cuesta menos que una sola visita del plomero. El link está *abajo*.", image: "real/pl_manual_phone_steps.png", attribution: "Igual, hacé lo de hoy", side: "right", accent: "green" },
];`;

src = src.replace(/const SECTIONS = \[[\s\S]*?\n\];/, SECTIONS);
src = src.replace(/const OVL = \[[\s\S]*?\n\];/, OVL);
fs.writeFileSync(path, src);
console.log("splice OK");
