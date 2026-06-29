// build_plomeria.mjs — CLIPS-FIRST DENSO (Constructor Libre, "El Plomero De 65 Años").
// Avatar Tomás + b-roll dominante REAL: clips YouTube (matchfarm proxies) + cientos de imágenes
// web (fetch_bing). AI solo diagramas. Queries ANALIZADAS del guion (específicas, EN inglés,
// ancladas al tema) — no random. Pacing ~4-5s (denso). REGLA #0: cada beat al ms exacto.
// Modos:  node build_oxido.mjs match  |  node build_oxido.mjs
import fs from "fs";

const SLUG = "plomeria";
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
    X({ kind: "oxstack", at: "media taza de bicarbonato de sodio", images: ["real/pl_baking_soda_box.png", "real/pl_vinegar_bottle.png", "real/pl_kettle_boiling.png"], captions: ["Bicarbonato", "Vinagre blanco", "Agua hirviendo"], accent: "cold" }),
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
const OVL = [
  // ── HOOK ──
  { kind: "oxquote", at: "no es por el trabajo", dur: 5.0, quote: "La mitad de lo que te cobra el plomero no es por el trabajo. *Es porque vos no sabés lo que él sabe*.", image: "real/pl_old_plumber_mate.png", attribution: "Un plomero de 65 años", side: "right", accent: "cold" },
  // ── CONFIRMACIÓN ──
  { kind: "oxstack", at: "la pileta que se tapa y no baja", dur: 4.4, images: ["real/pl_sink_full_water.png", "real/pl_faucet_drip_night.png", "real/pl_toilet_running.png"], captions: ["La pileta tapada", "La canilla que gotea", "El inodoro que pierde"], accent: "cold" },
  // ── PRINCIPIO ──
  { kind: "oxstat", at: "los mismos 5 una y otra vez", dur: 4.0, value: 90, suffix: " %", label: "de los problemas son los mismos cinco, una y otra vez", glyph: "💧", accent: "danger" },
  { kind: "oxside", at: "graza y pelo acumulados en un codo", dur: 5.2, image: "real/pl_grease_hair_elbow.png", title: "Lo que tapa de verdad", lines: ["Grasa y pelo en un codo del caño", "Una goma de dos pesos gastada", "O una unión floja que gotea"], side: "right", accent: "danger" },
  // ── REGLA #1 ──
  { kind: "oxrule", at: "ataca siempre lo mecanico y lo barato primero", dur: 4.6, text: "Antes de ningún químico: lo *mecánico* y lo *barato* primero.", accent: "amber" },
  // ── MÉTODO 1 — sopapa ──
  { kind: "oxmethod", at: "primero el desatascador", dur: 4.6, num: "01", title: "La sopapa, bien usada", chips: ["Tapar rebosadero", "Cubrir con agua", "Tirones secos"], cost: "gratis", accent: "amber" },
  { kind: "oxrule", at: "no es el aire es el agua", dur: 4.4, text: "Lo que empuja el tapón no es el *aire*, es el *agua*.", accent: "amber" },
  // ── MÉTODO 2 — bicarbonato ──
  { kind: "oxmethod", at: "va el metodo de toda la vida", dur: 4.6, num: "02", title: "Bicarbonato y vinagre", chips: ["½ taza bicarbonato", "1 taza vinagre", "Agua hirviendo"], cost: "centavos", accent: "cold" },
  // ── EL SIFÓN ──
  { kind: "oxmethod", at: "y ahora el secreto que vale el video entero", dur: 4.8, num: "03", title: "El sifón: el secreto", chips: ["Balde abajo", "Desenroscar", "Limpiar"], cost: "gratis", accent: "amber" },
  { kind: "oxstat", at: "se junta el 80 de los tapones", dur: 4.0, value: 80, suffix: " %", label: "de los tapones se juntan en el sifón, el punto más bajo", glyph: "🪣", accent: "amber" },
  // ── PÉRDIDA ESCONDIDA — medidor ──
  { kind: "oxmethod", at: "el truco del medidor", dur: 4.6, num: "04", title: "El truco del medidor", chips: ["Cerrar todo", "Mirar el medidor", "¿Sigue girando?"], cost: "gratis", accent: "cold" },
  { kind: "oxside", at: "el inodoro que pierde en silencio", dur: 5.2, image: "real/pl_toilet_silent.png", title: "La pérdida más cara", lines: ["La goma del fondo del tanque, gastada", "Pierde día y noche, sin ruido", "Miles de litros al mes al desagüe"], side: "right", accent: "danger" },
  { kind: "oxstat", at: "puede ser la mitad de tu factura de agua", dur: 4.2, value: 50, suffix: " %", label: "una sola goma de dos pesos puede ser media factura", glyph: "🚽", accent: "danger" },
  // ── AIREADOR ──
  { kind: "oxtag", at: "es el aireador", dur: 4.0, name: "El aireador", what: "Tapado de sarro: por eso tira poca agua", side: "left", accent: "cold" },
  // ── PREVENCIÓN ──
  { kind: "oxrule", at: "la grasa nunca va a la pileta", dur: 4.4, text: "La grasa *nunca* va a la pileta. Al frasco y a la basura.", accent: "amber" },
  // ── EL ERROR ──
  { kind: "oxstat", at: "es como apagar un incendio con nafta", dur: 4.2, value: 0, suffix: "", prefix: "", label: "la soda cáustica: arreglás hoy y arruinás el caño mañana", glyph: "☠️", accent: "danger" },
  { kind: "oxrule", at: "la soda caustica nunca", dur: 4.6, text: "La soda cáustica, *nunca*. Lo mecánico antes que lo químico.", accent: "danger" },
  // ── CIERRE ──
  { kind: "oxquote", at: "el link esta abajo", dur: 5.2, quote: "Cuesta menos que una sola visita del plomero. El link está *abajo*.", image: "real/pl_manual_phone_steps.png", attribution: "Igual, hacé lo de hoy", side: "right", accent: "green" },
];
let nOv = 0;
for (const o of OVL) { const s = atc(o.at); if (s == null) continue; const { kind, at: _a, dur = 4.2, ...props } = o; beats.push({ id: `ov_${kind}_${Math.round(s)}`, start: +s.toFixed(2), dur, kind, overlay: true, hue: "amber", ...props }); nOv++; }
beats.sort((a, b) => a.start - b.start);

// ── MAXIMUM DENSITY: imágenes ancladas en CADA mini-frase del shotlist aún sin cubrir ──
// [name, query EN visual, concept resuelto al contexto, frase ancla exacta de captions]
const FILL = [
  // ── COLD OPEN / confirmación ──
  ["pl_fill_invoice2", "expensive plumbing bill receipt hand", "the fortune charged for a quick unclog", "la ultima vez que llame a"],
  ["pl_fill_shame_face", "embarrassed man hand on forehead realization", "the shame of paying for something he had at home", "me cayo la cara de verguenza"],
  ["pl_fill_pass_all", "checklist of plumbing tricks notebook", "all the tricks, handed over today", "los voy a pasar todos si"],
  ["pl_fill_same_story", "frustrated homeowner waiting by phone", "the same story every time", "y cada vez que pasa la"],
  ["pl_fill_fortune_10min", "plumber leaving with cash quick job", "a fortune for ten minutes of work", "cobra una fortuna por diez minutos"],
  ["pl_fill_internet_scams", "phone screen drain cleaner ad online", "online sellers pushing pipe-wrecking chemicals", "y no te lo voy a"],
  ["pl_fill_show_real", "hands demonstrating drain repair step by step", "showing it for real, step by step", "lo voy a mostrar de verdad"],
  ["pl_fill_teach_unclog", "person unclogging drain with simple tools", "teaching to unclog any pipe", "te voy a ensenar a destapar"],
  ["pl_fill_cheap_parts", "small cheap rubber washers coins palm", "parts that cost pennies", "que cuestan monedas y que el"],
  ["pl_fill_stay_end", "finger pointing keep watching screen", "stay till the end for the big mistake", "y al final quedate hasta el"],
  ["pl_fill_seems_help", "chemical drain cleaner pouring deceptive", "the thing that seems to help but harms", "ese que parece que ayuda pero"],
  ["pl_fill_else_useless", "broken cracked pipe section discarded", "without it, all the rest is useless", "todo lo demas no sirve de"],
  // ── stakes ──
  ["pl_fill_plumber_secret", "old plumber gesturing knowing look", "what the plumber doesn't want you to know", "y esto es lo que el"],
  ["pl_fill_plumber_account", "stack of plumber invoices on table", "not just the plumber's bill", "no hablo solo de la cuenta"],
  ["pl_fill_toilet_months", "toilet leaking quietly bathroom months", "a toilet leaking silently for months", "del inodoro que estuvo perdiendo en"],
  ["pl_fill_liters_drain", "water gushing down floor drain waste", "thousands of litres down the drain", "miles de litros por el desague"],
  ["pl_fill_buckets_wasted", "buckets filling with dripped water", "buckets of water thrown away", "pero son baldes de agua tirados"],
  ["pl_fill_water_rising_sink", "water rising fast in clogged sink", "water rising in the sink, urgency", "agua subiendo en la pileta y"],
  ["pl_fill_grabbed_neck", "stressed homeowner overwhelmed plumbing", "plumbing has you by the neck", "agarrado del cuello y lo peor"],
  // ── principio ──
  ["pl_fill_changes_all", "lightbulb realization simple plumbing fix", "now the thing that changes everything", "ahora viene lo que cambia todo"],
  ["pl_fill_not_broken", "intact plumbing pipes under sink normal", "most problems aren't broken pipes", "la mayoria de los problemas de"],
  ["pl_fill_plumber_knows2", "plumber smirking knows the secret", "the plumber knows it perfectly", "es todo el plomero lo sabe"],
  ["pl_fill_free_knowledge", "open hand giving knowledge gift", "that knowledge, given free today", "y ese saber te lo voy"],
  ["pl_fill_rule_one_note", "rule number one written notebook", "rule number one to remember", "asi que la regla numero uno"],
  ["pl_fill_before_calling", "phone set down before calling plumber", "before calling anyone or any chemical", "antes de llamar a nadie y"],
  ["pl_fill_usually_enough", "simple tools solving drain problem", "usually that's enough; now the methods", "siempre con eso alcanza ahora vamos"],
  // ── método 1 sopapa ──
  ["pl_fill_clog_near", "clog close to drain opening cutaway", "good news: the clog is near, not deep", "la buena noticia es que ese"],
  ["pl_fill_you_remove", "homeowner removing clog himself sink", "you can pull it out yourself", "esta cerca y lo sacas vos"],
  ["pl_fill_used_wrong", "person using plunger incorrectly sink", "most people use it wrong", "pero la mayoria la usa mal"],
  ["pl_fill_overflow_hole", "sink overflow hole small opening top", "if the sink has an overflow hole on top", "usa asi si la pileta tiene"],
  ["pl_fill_rag_overflow", "wet rag stuffed into sink overflow", "plug the overflow so air can't escape", "el rebozadero ese que evita que"],
  // ── método pelo ──
  ["pl_fill_hair_clog_bath", "hair clog in bathroom drain tangled", "if the clog is hair, in the bathroom", "y si el tapon es de"],
  ["pl_fill_plunger_no_hair", "plunger failing on hair clog drain", "plunger and baking soda won't reach it", "ahi ni la sopapa ni el"],
  ["pl_fill_hook_grab", "hooked tool grabbing clog from drain", "you need something to hook and pull it", "para eso necesitas algo que lo"],
  ["pl_fill_gross_but_works", "messy hair clog pulled out drain", "gross, but free and definitive", "asqueroso si pero gratis y definitivo"],
  // ── sifón ──
  ["pl_fill_plumber_hides", "plumber hiding simple p-trap trick", "the one the plumber won't show you", "entero el que el plomero no"],
  ["pl_fill_trap_water_seal", "water sitting in p-trap bend seal", "water stays inside to block sewer smell", "para que quede siempre un poquito"],
  ["pl_fill_lowest_point", "lowest bend of drain p-trap pipe", "the lowest point, where clogs gather", "como es el punto mas bajo"],
  ["pl_fill_trap_unscrews", "unscrewing p-trap by hand under sink", "the trap unscrews by hand", "y lo mejor ese sifon se"],
  ["pl_fill_food_scraps", "food scraps grease pulled from trap", "hair, food scraps, even a lost ring", "pelo restos de comida a veces"],
  ["pl_fill_ten_min_fortune", "plumber invoice ten minute job expensive", "ten minutes, charged a fortune", "diez minutos por exactamente eso el"],
  // ── injerto 1 ──
  ["pl_fill_exact_amounts", "measuring baking soda vinegar exact dose", "the exact amounts, baking soda, vinegar", "las medidas justas cuanto bicarbonato cuanto"],
  ["pl_fill_which_snake", "drain snake tools choices hardware", "which snake to buy, not to overtighten", "cuanto vinagre que sonda comprar como"],
  ["pl_fill_keep_watching", "finger keep watching hidden leak next", "keep watching: the hidden leak next", "mirando que ahora viene lo de"],
  ["pl_fill_saves_money", "money saved coins jar plumbing", "what really saves you money", "es lo que de verdad te"],
  // ── pérdida escondida ──
  ["pl_fill_taught_unclog", "clean draining sink after unclog", "so far, how to unclog", "porque hasta aca te ensene a"],
  ["pl_fill_more_costly", "hidden leak inside wall costly", "a costlier, more treacherous problem", "pero hay un problema mucho mas"],
  ["pl_fill_wall_stain_norain", "damp stain wall no rain leak", "a wall stain with no rain", "o esa mancha de humedad que"],
  ["pl_fill_how_to_know", "person checking for hidden water leak", "how to know without breaking anything", "lo primero como saber si tenes"],
  ["pl_fill_leak_somewhere", "water meter still moving leak", "even slow, you have a leak somewhere", "aunque sea lento tenes una perdida"],
  ["pl_fill_water_leaving", "water escaping pipe unseen leak", "the water is leaving on its own", "el agua se esta yendo sola"],
  ["pl_fill_free_test", "free water meter leak test", "a free test tells you if it's real", "gratis te dice si el problema"],
  // ── inodoro ──
  ["pl_fill_most_common_leak", "toilet most common hidden water leak", "the most common hidden leak of all", "y cual es la perdida escondida"],
  ["pl_fill_inflates_bill", "water bill rising toilet leak", "the one inflating your bill", "todas la que te infla la"],
  ["pl_fill_seal_hardens", "hardened worn toilet flapper seal", "the seal hardens and lets water pass", "tiempo se endurece y se gasta"],
  ["pl_fill_day_and_night", "toilet trickling water all day", "all day, every day, no noise", "el dia todos los dias no"],
  ["pl_fill_magic_trick", "old plumber dye test toilet trick", "the old plumber's magic trick to catch it", "y aca esta el truco magico"],
  ["pl_fill_dye_no_flush", "dye drops into toilet tank no flush", "drops of dye in the tank, no flushing", "ponele a la mochila sin tirar"],
  ["pl_fill_dye_colors_water", "colored dye spreading in tank water", "anything that tints the water", "lo que sea que tina el"],
  ["pl_fill_five_min_fix", "quick toilet seal swap by hand", "five minutes, this seal is half your bill", "herramientas en cinco minutos esa sola"],
  // ── canilla / cuerito ──
  ["pl_fill_faucet_drips2", "faucet dripping steadily wasting water", "same with the dripping faucet", "lo mismo con la canilla que"],
  ["pl_fill_one_thing", "small worn faucet washer single cause", "almost always one thing: the washer", "y casi siempre es una sola"],
  ["pl_fill_worn_years", "worn old faucet washer years use", "worn over the years, no longer sealing", "con los anos se gasta y"],
  ["pl_fill_whole_visit", "plumber charging full visit small part", "a full visit for a ten-cent washer", "el plomero te cobra una visita"],
  // ── aireador ──
  ["pl_fill_another_problem", "weak faucet flow trickle problem", "another problem, fixed in two minutes", "y ya que estamos con la"],
  ["pl_fill_two_min_fix", "weak shower flow quick fix", "the faucet or shower with weak flow", "a todos y que se arregla"],
  ["pl_fill_scale_buildup", "limescale grit clogging faucet aerator", "clogging with scale and grit", "se va tapando con el sarro"],
  ["pl_fill_unscrew_hand", "unscrewing aerator by hand pliers", "unscrew it by hand or pliers", "con la mano o con una"],
  ["pl_fill_brush_rescrew", "brushing aerator screen rescrewing", "brush it, screw it back, flows like new", "cepillala enroscala de vuelta y la"],
  ["pl_fill_showerhead", "clogged shower head spraying sideways", "same with the shower head", "lo mismo con la flor de"],
  ["pl_fill_scale_holes", "limescale clogging shower head holes", "scale in the little holes", "es sarro en los agujeritos la"],
  ["pl_fill_holes_clear", "shower head holes clear after vinegar", "by morning the clogged holes cleared", "y a la manana los agujeritos"],
  // ── uniones / epoxi ──
  ["pl_fill_joint_leaks", "leaking threaded pipe joint drip", "leaks where two pipes screw together", "las perdidas en las uniones de"],
  ["pl_fill_teflon_wrap", "wrapping teflon tape on threads", "unscrew, wrap the thread with tape", "muchas veces alcanza con desenroscar enrollar"],
  ["pl_fill_pinhole_pipe", "tiny pinhole leak in pipe water", "a tiny pinhole leaking water", "sella la rosca y si lo"],
  ["pl_fill_temp_fix", "temporary epoxy patch on pipe", "a stopgap until you replace it", "cano un agujerito que larga agua"],
  ["pl_fill_minutes_solution", "quick plumbing fixes hand tools", "minute-long fixes, no one to call", "de minutos que te sacan del"],
  // ── prevención ──
  ["pl_fill_golden_rule", "golden rule prevention clean drain", "the golden rule of prevention", "y dejame darte la regla de"],
  ["pl_fill_number_one_cause", "kitchen grease number one clog cause", "the number one cause of kitchen clogs", "la que hace que nunca mas"],
  ["pl_fill_pour_grease", "pouring cooking grease down sink", "people pour grease down the sink", "la grasa la gente tira el"],
  ["pl_fill_grease_sticks", "grease cooling sticking inside pipe", "it cools and sticks like tallow", "que se va y si se"],
  ["pl_fill_strainer_catches", "drain strainer catching hair scraps", "a strainer keeps hair and scraps out", "que el pelo y los restos"],
  // ── llave de paso / olor ──
  ["pl_fill_two_things", "two essential plumbing must-knows", "two things you must know", "darte dos cosas que tenes que"],
  ["pl_fill_even_if_never", "homeowner learning plumbing basics", "even if you never fix a thing", "o si aunque nunca arregles nada"],
  ["pl_fill_most_important", "main shutoff valve most important", "the most important in the whole house", "y es la mas importante de"],
  ["pl_fill_go_now", "person going to find shutoff valve", "go right now and find it", "anda ahora si ahora mismo cuando"],
  ["pl_fill_cuts_all_water", "main valve cutting all house water", "the valve that cuts all the water", "corta toda el agua de golpe"],
  ["pl_fill_burst_sunday", "burst hose washing machine flooding", "the day a pipe or hose bursts", "porque el dia que se te"],
  ["pl_fill_house_flooding", "house floor flooding water fast", "every minute the house floods more", "cada minuto es la casa inundandose"],
  ["pl_fill_sewer_smell", "floor drain sewer smell unused", "an unused drain smelling of sewer", "si una rejilla del piso o"],
  ["pl_fill_trap_dried", "dry empty p-trap no water seal", "the trap dried out and let gas in", "se seco por falta de uso"],
  // ── EL ERROR ──
  ["pl_fill_promised_start", "the big mistake reveal pipe damage", "now the mistake I promised", "el agua y ahora si llegamos"],
  ["pl_fill_everyone_mistake", "common drain mistake caustic soda", "the mistake almost everyone makes", "error que comete casi todo el"],
  ["pl_fill_destroying_pipes", "caustic soda corroding pipe inside", "it's destroying your pipes inside", "que parece que ayuda pero que"],
  ["pl_fill_caustic_bottle2", "caustic soda strong drain chemical bottle", "caustic soda, the strong chemical in a bottle", "error es tirarle soda caustica o"],
  ["pl_fill_burns_everything", "caustic chemical burning pipe interior", "it burns everything it touches", "cuando la tiras por un cano"],
  ["pl_fill_eats_metal", "corroded metal pipe eaten thin", "it eats old metal pipes from inside", "que toca pero quema tambien el"],
  ["pl_fill_today_tomorrow", "ruined pipe trade-off damage", "fixing today, ruining the pipe tomorrow", "arreglando un tapon de hoy a"],
  ["pl_fill_dangerous_you", "chemical splash hazard gloves goggles", "dangerous to you if it splashes", "es peligrosisima para vos si salpica"],
  ["pl_fill_doesnt_unclog", "caustic soda failing to clear clog", "worst of all, often it doesn't even unclog", "peor de todo muchas veces ni"],
  ["pl_fill_caustic_bomb", "pipe full caustic water hazard plumber", "now a pipe full of caustic water, a bomb", "entonces ahora tenes un cano tapado"],
  // ── regla final / recap ──
  ["pl_fill_most_important_video", "mechanical first rule plumbing tools", "the most important of the whole video", "la mas importante de todo el"],
  ["pl_fill_tools_lineup", "plunger trap snake baking soda laid out", "plunger, trap, snake, baking soda", "la sopapa el sifon la sonda"],
  ["pl_fill_no_damage", "safe drain cleaning no pipe damage", "all of it unclogs without damage", "destapa sin danar nada la soda"],
  // ── límites ──
  ["pl_fill_collapsed_real", "collapsed crushed sewer pipe roots", "a truly collapsed or root-invaded pipe", "humo si el cano esta realmente"],
  ["pl_fill_toilet_still_leaks", "toilet still leaking after seal change", "if the toilet still leaks after the seal", "si el inodoro pierde y cambias"],
  ["pl_fill_hot_not_boiling", "hot water not boiling kettle careful", "hot water but not boiling for old pipes", "en ese caso agua bien caliente"],
  ["pl_fill_same_as_always", "old plumber honest explanation", "this is the same as always", "y dejame parar un segundo porque"],
  ["pl_fill_none_expensive", "cheap simple plumbing tricks none costly", "none of these tricks is expensive", "de estos trucos es caro ninguno"],
  // ── injerto 2/3 ──
  ["pl_fill_built_manual", "home repair manual assembled chapters", "when I built the manual, divided like this", "algo por eso cuando arme el"],
  ["pl_fill_leaks_section", "manual section leaks damp mold", "a section on leaks, damp and mold", "otra de goteras y humedad y"],
  ["pl_fill_same_criterion", "forty repairs cheap that work", "forty repairs, all the same criterion", "todos con el mismo criterio lo"],
  ["pl_fill_disassemble_trap", "disassembling p-trap under sink recap", "take apart the trap: that's where the clog is", "si no desarma el sifon de"],
  ["pl_fill_meter_detect", "water meter trick to detect leak", "the meter trick to detect it", "para la perdida escondida el truco"],
  ["pl_fill_dye_recap", "dye drops toilet tank recap", "the dye drop to catch the costliest leak", "de colorante en la mochila del"],
  ["pl_fill_grease_never_sink", "grease never down the sink jar", "grease never to the sink, a filter on each drain", "nunca a la pileta y un"],
  ["pl_fill_mechanical_chemical", "mechanical before chemical rule recap", "no caustic soda, mechanical before chemical", "soda caustica lo mecanico antes que"],
  ["pl_fill_solve_eighty", "solving home water problems confident", "solve 80% of your water problems alone", "con esto solo ya podes resolver"],
  ["pl_fill_honest_always", "honest plumber talking to camera", "honest, as always", "ahora te voy a ser honesto"],
  ["pl_fill_one_front", "whole house repairs car included", "plumbing is just one front of the house", "la plomeria es uno solo de"],
  ["pl_fill_rotting_wood", "rotting wood saved cheap liquid", "wood that rots, saved with a two-peso liquid", "la madera que se pudre y"],
  ["pl_fill_rust_pests", "rust eating iron pests cheap", "rust eating iron, pests gone for cents", "que se come el hierro las"],
  ["pl_fill_leak_forever", "roof leak sealed forever fix", "the leak sealed for good", "la gotera que se tapa para"],
  ["pl_fill_manual_steps", "manual steps disassemble trap swap seals", "steps to open the trap and swap seals", "uno incluidos los pasos para desarmar"],
  ["pl_fill_even_if_never2", "homeowner with plunger doing it today", "even if you never buy it, do today's fix", "pero escuchame incluso si nunca lo"],
  ["pl_fill_next_clog", "next clogged sink grab plunger", "next time the sink clogs, before calling", "la proxima vez que se te"],
  // ── próximo / cierre ──
  ["pl_fill_next_car", "car repair garage secrets next video", "next video: the car, more hidden secrets", "proximo video me voy a meter"],
  ["pl_fill_headlight_trick", "yellowed car headlights restored clear", "the coin trick for cloudy headlights", "te cuenta te voy a mostrar"],
  ["pl_fill_if_helped", "subscribe thumbs up helpful video", "if this helped, don't miss it", "si esto te sirvio no te"],
  ["pl_fill_one_repair_time", "independence built one repair at a time", "one repair at a time", "un arreglo a la vez nos"],
];
for (const [name, query, concept, ph] of FILL) { const s = atc(ph); if (s == null) continue; beats.push({ id: name, start: +s.toFixed(2), dur: 3, kind: "raw", src: `real/${name}.png`, darken: 0, hue: HUES[Math.round(s) % 3] }); addB(name, query, concept); }
beats.sort((a, b) => a.start - b.start);

// ── BURSTS extra (oxstack) para flashes sub-1s en momentos de lista ──
const BURSTS = [
  { at: "la pileta que se tapa y no baja", images: ["real/pl_sink_full_water.png", "real/pl_faucet_drip_night.png", "real/pl_toilet_running.png"], captions: ["Pileta tapada", "Canilla que gotea", "Inodoro que pierde"], accent: "cold" },
  { at: "para eso necesitas algo que lo", images: ["real/pl_fill_plunger_no_hair.png", "real/pl_drain_snake_tool.png", "real/pl_fill_hook_grab.png"], captions: ["Ni sopapa", "Una sonda", "O un alambre"], accent: "amber" },
  { at: "a todos y que se arregla", images: ["real/pl_faucet_washer_small.png", "real/pl_aerator_tip.png", "real/pl_fill_scale_holes.png"], captions: ["El cuerito", "El aireador", "Sarro y agujeritos"], accent: "cold" },
  { at: "es peligrosisima para vos si salpica", images: ["real/pl_caustic_soda_bottle.png", "real/pl_fill_dangerous_you.png", "real/pl_fill_eats_metal.png"], captions: ["Quema el caño", "Quema la piel", "Come el metal"], accent: "danger" },
];
for (const b of BURSTS) { const s = atc(b.at); if (s == null) continue; beats.push({ id: `burst_${Math.round(s)}`, start: +s.toFixed(2), dur: 4.2, kind: "oxstack", overlay: true, hue: "amber", images: b.images, captions: b.captions, accent: b.accent }); }
beats.sort((a, b) => a.start - b.start);

// ── STRUCT — formatos estructurados (gate de variedad: ≥6 tipos, ≥6% peso, bars≥2) ──
const STRUCT = [
  { kind: "bars", at: "no es por el trabajo", hue: "red", title: "Lo que pagás de más", bars: [{ label: "El plomero por 10 minutos", value: 100, display: "$$$", tone: "danger" }, { label: "Hacerlo vos mismo", value: 3, display: "$2", winner: true }] },
  { kind: "bars", at: "lo mecanico antes que lo quimico", hue: "amber", title: "Mecánico vs químico", bars: [{ label: "Soda cáustica: arruina el caño", value: 100, display: "✗", tone: "danger" }, { label: "Sopapa, sifón, bicarbonato", value: 5, display: "✓", winner: true }] },
  { kind: "process", at: "la cañeria tapada", hue: "blue", title: "Destapar la pileta", eyebrow: "Tres pasos, sin químicos", steps: [{ title: "La sopapa", desc: "tapá el rebosadero, agua que cubra, tirones secos" }, { title: "Bicarbonato + vinagre", desc: "y una pava de agua hirviendo" }, { title: "El sifón", desc: "desarmalo: ahí está el 80% del tapón" }] },
  { kind: "process", at: "el inodoro que pierde en silencio", hue: "blue", title: "Cazar la pérdida escondida", eyebrow: "Donde se va tu factura", steps: [{ title: "El medidor", desc: "cerrá todo: ¿sigue girando?" }, { title: "La gota de tinta", desc: "en la mochila, esperá 20 min" }, { title: "Cambiá la goma", desc: "cuesta $2 y se hace con la mano" }] },
  { kind: "aged", at: "antes de llamar a nadie", hue: "amber", heading: "REGLA NÚMERO UNO", eyebrow: "Aunque te olvides de todo lo demás", lines: ["Lo mecánico y lo barato, primero", "Casi siempre, con eso alcanza", { text: "El 80% lo resolvés solo en 10 minutos", mark: true }] },
  { kind: "aged", at: "la regla final", hue: "red", heading: "REGLA FINAL", eyebrow: "El error que destruye los caños", lines: ["Nunca soda cáustica", "Te come el caño desde adentro", { text: "Lo mecánico antes que lo químico", mark: true }] },
  { kind: "callout", at: "diez minutos", figure: "10 min", caption: "Lo que tarda el plomero, y te cobra una fortuna.", accent: "danger", image: "real/pl_fill_invoice2.png" },
  { kind: "callout", at: "una goma de dos pesos", figure: "$2", caption: "La gomita que arregla el problema entero.", accent: "good", image: "real/pl_faucet_washer_small.png" },
  { kind: "callout", at: "miles de litros", figure: "Miles de litros", caption: "Lo que tira el inodoro que pierde en silencio.", accent: "danger", image: "real/pl_fill_toilet_months.png" },
  { kind: "callout", at: "la soda caustica", figure: "Veneno", caption: "Te come los caños desde adentro y te quema.", accent: "danger", image: "real/pl_caustic_soda_bottle.png" },
  { kind: "callout", at: "la mitad de tu factura", figure: "½ factura", caption: "Una sola goma del inodoro puede ser la mitad de tu cuenta.", accent: "amber", image: "real/pl_fill_toilet_months.png" },
  { kind: "callout", at: "el sifon", figure: "10 min", caption: "Desarmar el sifón: por esto el plomero te cobra fortunas.", accent: "cold", image: "real/pl_clogged_sink_slow.png" },
  { kind: "checklist", at: "recapitulemos", hue: "blue", title: "El plan completo", items: [{ text: "Destapar: sopapa, bicarbonato, el sifón", state: "done" }, { text: "Pérdida: medidor + gota de tinta", state: "done" }, { text: "Cambiar la goma y el cuerito ($2)", state: "done" }, { text: "Grasa nunca a la pileta", state: "done" }, { text: "Nada de soda cáustica", state: "done" }] },
  { kind: "bars", at: "la factura del agua", hue: "red", title: "La factura del agua", bars: [{ label: "Con la pérdida escondida", value: 100, display: "×2", tone: "danger" }, { label: "Después de arreglarla", value: 50, display: "normal", winner: true }] },
  { kind: "callout", at: "la causa numero uno", figure: "La grasa", caption: "La causa #1 de las cañerías tapadas en la cocina.", accent: "danger", image: "real/pl_grease_hair_elbow.png" },
  { kind: "callout", at: "diez centavos", figure: "$0,10", caption: "El cuerito que el plomero te cobra una visita entera.", accent: "good", image: "real/pl_faucet_washer_small.png" },
  { kind: "callout", at: "todos los dias", figure: "Día y noche", caption: "El inodoro pierde en silencio, sin parar.", accent: "danger", image: "real/pl_fill_toilet_months.png" },
  { kind: "callout", at: "gratis y definitivo", figure: "Gratis", caption: "Sacar la maraña de pelo con un alambre.", accent: "good", image: "real/pl_clogged_sink_slow.png" },
];
for (const s of STRUCT) { const t = atc(s.at); if (t == null) continue; const { kind, at: _a, image, ...props } = s; const beat = { id: `cmp_${kind}_st_${Math.round(t)}`, start: +t.toFixed(2), dur: 6.5, kind, hue: s.hue || "blue", ...props, ...(image ? { image } : {}) }; if (kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l)); if (kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it)); beats.push(beat); }
beats.sort((a, b) => a.start - b.start);

fs.mkdirSync("public/broll", { recursive: true }); fs.mkdirSync("public/real", { recursive: true }); fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(MATCH, null, 2));
fs.writeFileSync(`public/real/bing_${SLUG}.json`, JSON.stringify(BING, null, 2));
fs.writeFileSync(`public/img/prompts_${SLUG}_diag.json`, JSON.stringify(DIAGRAMS, null, 2));
if (MODE === "match") { console.log(`=== build_oxido MATCH ===`); console.log(`match ${MATCH.length} · bing ${BING.length} · diag ${DIAGRAMS.length} · proxy ${(2 * MATCH.length / 6).toFixed(0)}/IP`); process.exit(0); }
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
const modeAt = (t) => { if (t < firstClip - 1e-6) return "full"; if (inAvf(t)) return "full"; if (!covered(t)) return "full"; const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6); return p ? p[2] : "hidden"; };
const pts = [...new Set([0, firstClip, ...AVF.flat(), ...pip.flatMap((p) => [p[0], p[1]]), ...cov.flat(), TOTAL].map((x) => +(+x).toFixed(2)))].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);
const avSecs = AVF.reduce((a, [s, e]) => a + (e - s), 0);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const dur = beats.length ? beats[beats.length - 1].start + beats[beats.length - 1].dur : 0;
const rawN = beats.filter((b) => b.kind === "raw").length;
console.log(`=== build_oxido BUILD ===`);
console.log(`beats ${beats.length} (raw ${rawN}, ${(100 * rawN / beats.length).toFixed(0)}%) · clips ${nClip} · imgs ${nReal} · gpt ${nImg} · faltan ${nMiss} · dur ${(dur / 60).toFixed(1)}min · pace ${(dur / beats.length).toFixed(1)}s`);
console.log(`avatar-full ${(avSecs / 60).toFixed(1)}min · PiP ${pip.length} · windows ${windows.length} · MATCH ${MATCH.length} · BING ${BING.length} · DIAG ${DIAGRAMS.length}`);
if (miss.length) console.log(`faltan (${miss.length}): ${miss.slice(0, 12).join(", ")}`);
