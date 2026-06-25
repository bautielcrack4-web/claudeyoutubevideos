// build_oxido.mjs — CLIPS-FIRST HÍBRIDO (Constructor Libre, "El Hierro Que NUNCA Se Oxida").
// Avatar Tomás + b-roll dominante REAL: clips YouTube (matchfarm proxies) + cientos de imágenes
// web (fetch_bing). AI solo diagramas. Queries ANALIZADAS del guion (específicas, EN inglés,
// ancladas al tema) — no random. Pacing ~4-5s (denso). REGLA #0: cada beat al ms exacto.
// Modos:  node build_oxido.mjs match  |  node build_oxido.mjs
import fs from "fs";

const SLUG = "oxido";
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
  // ░░ 1) HOOK ░░
  { a: "si entraste a este video", start: 0, beats: [
    C("ox_rust_wrench", "rusty adjustable wrench close up macro", "an adjustable wrench covered in orange rust", { at: "algo de metal en tu vida" }),
    C("ox_rust_macro1", "orange rust eating metal extreme macro", "orange rust eating into metal, macro", { at: "el oxido se esta comiendo" }),
    C("ox_rust_gate", "rusty iron gate fence outdoors", "a rusty iron fence eaten by rust", { at: "una reja" }),
    I("ox_rust_garage", "rusty tools garage shelf workbench", "rusty tools in a garage", { at: "las herramientas" }),
    C("ox_rust_railing", "rusty metal gate flaking paint", "a rusty metal gate", { at: "el porton" }),
    C("ox_rust_chassis", "rusty car underbody chassis corrosion", "the rusty underside of a truck", { at: "el chasis" }),
    C("ox_rust_grill", "rusty old barbecue grill grate", "a rusty barbecue grill", { at: "la parrilla" }),
    G("ox_tomas_hook", { at: "el lugar correcto", kicker: "Estás en el lugar correcto" }),
    C("ox_before_after", "rusty metal restored clean before after", "rusty metal turned clean, before and after", { at: "darlo vuelta" }),
    C("ox_sand_hard", "sanding rust off metal by hand effort", "sanding rust the hard old way", { at: "sin lijar" }),
    C("ox_metal_shop_shelf", "hardware store rust remover products shelf", "branded rust products on a store shelf", { at: "productos de marca" }),
    I("ox_new_tool", "brand new wrench tool in package store", "buying a brand new tool", { at: "cambiar la pieza" }),
    I("ox_youtube_tutorials", "phone screen youtube tutorial list videos", "endless online tutorials on a phone", { at: "la internet esta llena" }),
    C("ox_show_camera", "man holding rusty object up to camera demo", "showing the rusty tool to you right now", { at: "te lo voy a probar" }),
    C("ox_rust_wrench2", "extreme close rusty wrench jaws detail", "a close look at the rusty wrench", { at: "mira esta llave" }),
    C("ox_wrench_jaws", "seized rusty wrench jaws stuck shut", "rusty wrench jaws stuck shut", { at: "las mordazas" }),
    C("ox_rust_macro2", "rough flaking orange rust texture macro", "rough flaking rust, condemned", { at: "condenada a la basura" }),
    C("ox_dunk_wrench", "lowering rusty tool into bucket of water", "lowering the wrench into a bucket of water", { at: "un balde con agua" }),
    I("ox_powder_spoon", "white powder two spoonfuls jar", "two spoonfuls of a cheap powder", { at: "dos cucharadas" }),
    I("ox_few_coins", "few small coins cents in palm hand", "just a few cents, cheap", { at: "cuesta centavos" }),
    C("ox_electro_bucket", "rust removal electrolysis bucket battery charger", "the bucket with an old battery charger", { at: "cargador de bateria" }),
    C("ox_bubbles_hook", "bubbles rising electrolysis bucket closeup", "bubbles rising in the bucket overnight", { at: "toda la noche" }),
    C("ox_electro_pull", "clean steel tool out of electrolysis no rust", "pulling the clean bare-steel tool out", { at: "salio asi" }),
    I("ox_wrench_clean_hand", "clean bare steel wrench held hand", "the clean wrench, rust gone", { at: "se desprendio solo" }),
    X({ kind: "headline", at: "sin lijar durante horas", tokens: ["Sin", "lijar.", "Sin", "gastar.", "Sin", { t: "cambiarla" }], eyebrow: "Lo que el negocio no quiere que sepas", bg: "image", _bg: { name: "ox_hook_bg", query: "rusty metal surface corrosion close", concept: "a rusty corroded metal surface" }, image: "real/ox_hook_bg.png" }),
  ]},
  // ░░ 2) STAKES ░░
  { a: "lo que el oxido ya te costo", beats: [
    I("ox_broken_shovel", "rusted through garden shovel head", "a rusted-through garden shovel", { at: "la pala que tiraste" }),
    C("ox_throw_tool", "throwing away old rusty tool trash", "tossing a rusty tool in the trash", { at: "porque ya estaba" }),
    I("ox_rusty_padlock", "rusty padlock seized stuck", "a rusty padlock that no longer turns", { at: "el candado que reventaste" }),
    C("ox_hammer_lock", "hitting stuck padlock hammer", "smashing a seized padlock with a hammer", { at: "a martillazos" }),
    C("ox_hinge_creak", "rusty squeaky door hinge old gate", "a rusty creaking hinge on a gate", { at: "la bisagra del porton" }),
    I("ox_hinge_rust", "rusty door hinge orange streaks", "a rusty hinge with orange streaks", { at: "se va a partir" }),
    C("ox_rust_spread", "rust spreading under paint macro", "rust spreading and bubbling under old paint", { at: "levanta la pintura" }),
    X({ kind: "stat", at: "puede estar perforado", value: 3, suffix: " años", label: "y un metal sin tratar puede estar perforado", eyebrow: "El óxido no se detiene", hue: "red" }),
    I("ox_perforated_metal", "rusted hole corroded metal sheet", "a rust hole eaten through metal", { at: "en dos o tres anos" }),
    C("ox_flaking_rust", "rust flaking off metal surface", "rust flaking off a metal surface", { at: "avanza come metal" }),
    I("ox_scrap_pile", "pile of rusty scrap metal junk", "a pile of rusty scrap that used to be tools", { at: "se convierte en chatarra" }),
    X({ kind: "headline", at: "es el negocio", tokens: ["Se", "vuelve", "chatarra.", "Y", "comprás", "de", { t: "nuevo" }], eyebrow: "Eso es el negocio", bg: "image", _bg: { name: "ox_scrap_bg", query: "rusty corroded metal junk pile", concept: "rusty corroded scrap metal" }, image: "real/ox_scrap_bg.png" }),
  ]},
  // ░░ 3) PRINCIPIO ░░
  { a: "lo que cambia todo", beats: [
    G("ox_tomas_explica", { kicker: "Tan simple que da bronca" }),
    X({ kind: "diagram", at: "necesita tres cosas", eyebrow: "El óxido necesita SOLO tres cosas", slides: [{ image: dg("dg_ox_triada", "Diagrama tipo TRIÁNGULO simple y elegante: en cada vértice un ícono claro — HIERRO (una barra de metal), OXÍGENO (aire/nubecita) y AGUA (una gota). En el centro, el óxido (mancha naranja). Una TIJERA o X grande cortando uno de los lados (el agua) y la mancha desaparece. Etiqueta 'sacá uno solo y el óxido no nace'. Líneas marrón, acento terracota."), eyebrow: "Sacá uno solo y el óxido no nace" }] }),
    C("ox_water_drop_steel", "water droplet on bare steel macro", "a water droplet on bare steel", { at: "si le sacas una de las tres" }),
    C("ox_rust_forming", "iron rusting oxidation macro", "iron slowly turning orange with rust", { at: "el oxido rojo el que destruye" }),
    I("ox_iron_bar", "clean grey iron metal bar", "a clean bar of raw iron", { at: "hierro oxigeno y agua" }),
    I("ox_old_iron_tool", "antique wrought iron tool dark patina", "a hundred-year-old iron tool still intact", { at: "todavia esta entero" }),
    C("ox_old_vs_new", "old tool vs new rusty tool compare", "an old intact tool vs a rusty modern one", { at: "el tuyo se deshace" }),
    X({ kind: "bars", at: "el hierro de tu bisabuelo", title: "Cuánto dura el hierro", unit: "años", bars: [{ label: "Sin tratar, a la intemperie", value: 5, display: "5", tone: "danger" }, { label: "Con una barrera de aceite", value: 50, display: "50", winner: true }] }),
    C("ox_oil_rag_metal", "wiping metal tool with oily rag", "wiping a tool with an oily rag, the barrier", { at: "una barrera aceite" }),
    I("ox_wax_block", "beeswax block on wood", "a block of wax, a cheap barrier", { at: "una capa negra una grasa" }),
    X({ kind: "splitlist", at: "le ponian una barrera", title: "Por qué el hierro de antes dura", items: ["Menos impurezas en el metal", "Le ponían una barrera: aceite, cera, grasa", "Cosas que costaban centavos"], palette: "G" }),
    I("ox_humid_shed", "condensation humid metal shed damp", "humid condensation on metal in a shed", { at: "entre el metal y el aire humedo" }),
    C("ox_air_humid", "moist air fog cold metal", "moist air on cold metal, the enemy", { at: "el aire lejos del hierro" }),
  ]},
  // ░░ 4) ABUELO ░░
  { a: "con mis propios ojos", full: true, beats: [] },
  { a: "tenia un formon", beats: [
    G("ox_formon_viejo", { kicker: "Más de cien años" }),
    C("ox_chisel_wood", "wood chisel carving cutting close", "an old chisel still cutting wood", { at: "de cortar madera" }),
    I("ox_chisel_old", "antique chisel heirloom dark steel", "an antique heirloom chisel", { at: "habia sido de su padre" }),
    G("ox_abuelo_trapo", { kicker: "El trapo con aceite" }),
    C("ox_wipe_tool_rag", "wiping tool with rag put away", "wiping a tool with a rag before storing", { at: "un trapito con aceite" }),
    I("ox_tools_drawer_rust", "modern tools rusting in drawer", "modern tools rusting in a drawer", { at: "se nos pudren en un cajon" }),
    X({ kind: "callout", at: "fue el trapo", figure: "100 años", caption: "La diferencia nunca fue el metal. Fue el trapo.", _bg: { name: "ox_chisel_hand", query: "old chisel weathered hand heirloom", concept: "the old chisel in a weathered hand" }, image: "real/ox_chisel_hand.png" }),
    C("ox_hands_tool_old", "weathered hands holding old tool", "weathered hands holding the old tool", { at: "le gano al tiempo" }),
    X({ kind: "aged", at: "la regla numero uno", heading: "REGLA NÚMERO UNO", eyebrow: "Aunque te olvides de todo lo demás", lines: ["Sacale el agua al hierro", "y el óxido se queda sin de qué vivir", { text: "Un trapo con aceite. Treinta segundos.", mark: true }], accent: "good", hue: "amber" }),
  ]},
  // ░░ 5) MÉTODO 1 — cera/aceite/tiza ░░
  { a: "una vela de cumpleanos", beats: [
    I("ox_candle_wax", "white candle beeswax block workbench", "a candle and a block of beeswax", { at: "un pedazo de cera de abeja" }),
    C("ox_light_candle", "lighting a plain candle hand", "a plain candle, cheap as it gets", { at: "una vela comun de parafina" }),
    C("ox_wax_screw", "rubbing wax on screw threads", "rubbing wax on screw threads", { at: "la cera sobre la rosca" }),
    I("ox_screws_jar", "jar of screws workbench", "a jar of screws on a workbench", { at: "antes de ponerlos" }),
    C("ox_screw_drive", "driving screw into wood drill", "driving a waxed screw into wood", { at: "la mitad de la fuerza" }),
    C("ox_saw_blade_wax", "waxing hand saw blade", "waxing a saw blade so it won't rust", { at: "las hojas de la sierra" }),
    C("ox_hinge_pin_out", "removing door hinge pin", "removing a hinge pin to oil it", { at: "herramientas de jardin" }),
    C("ox_oil_hinge", "oiling door hinge drop oil", "oiling a hinge so it stops squeaking", { at: "gotas de aceite de maquina" }),
    C("ox_oil_blade", "wiping oil garden tool blade", "wiping oil on a garden tool blade", { at: "una vez por mes" }),
    I("ox_graphite_lock", "graphite pencil lock keyhole", "graphite from a pencil in a lock", { at: "esa pelicula es la barrera" }),
    X({ kind: "splitlist", at: "la mitad de la fuerza", title: "La barrera más barata", items: ["Cera en tornillos y filos", "Trapo con aceite una vez por mes", "Grafito de lápiz en cerraduras"], palette: "A" }),
    I("ox_chalk_sticks", "white blackboard chalk sticks", "white blackboard chalk sticks", { at: "de esas comunes" }),
    C("ox_chalk_box", "chalk in metal toolbox", "chalk placed inside a toolbox", { at: "de la caja de herramientas" }),
    I("ox_silica_packets", "silica gel packets among tools", "silica gel packets among tools", { at: "absorbe la humedad del aire" }),
    C("ox_dry_tools_hang", "clean dry tools hanging shed wall", "clean dry tools hanging in a shed", { at: "el juego de llaves" }),
    X({ kind: "chips", at: "a precio de perfume", title: "Por qué no te lo venden", chips: ["Te ofrecen aerosol de marca", "A precio de perfume", "Para algo que resuelve una vela"], hue: "red", imageDarken: 0.6, _bg: { name: "ox_aerosol_bg", query: "anti rust spray can hardware shelf", concept: "an anti-rust aerosol can on a shelf" }, image: "real/ox_aerosol_bg.png" }),
    I("ox_aerosol_cans", "spray cans hardware store shelf", "rows of branded spray cans", { at: "anticorrosion en aerosol" }),
  ]},
  // ░░ 6) MÉTODO 2 — vinagre ░░
  { a: "el vinagre blanco", beats: [
    G("ox_tomas_vinagre", { kicker: "Lo que cuesta una botella de vinagre" }),
    I("ox_vinegar_bottle", "white vinegar bottle kitchen", "a bottle of plain white vinegar", { at: "comun el de la cocina" }),
    C("ox_pour_vinegar", "pouring vinegar over rusty parts jar", "pouring vinegar over rusty parts", { at: "en vinagre blanco puro" }),
    C("ox_bolts_soak", "rusty bolts soaking in vinegar jar", "rusty bolts soaking in a jar of vinegar", { at: "que la cubra del todo" }),
    I("ox_jar_soak_window", "jar bolts soaking windowsill", "a jar of bolts soaking on a windowsill", { at: "dos o tres horas" }),
    I("ox_coarse_salt", "coarse salt handful spoon", "a handful of coarse salt", { at: "tirale un punado" }),
    C("ox_add_salt", "adding salt to liquid jar", "adding salt to the vinegar to speed it up", { at: "la sal acelera la reaccion" }),
    C("ox_brush_rust_off", "wire brushing rust off bolt", "brushing loosened rust off a bolt", { at: "se va con un cepillo" }),
    C("ox_wipe_rust_cloth", "wiping rust off metal cloth", "wiping rust off with a cloth", { at: "con un simple trapo" }),
    C("ox_rinse_water", "rinsing metal part under water", "rinsing the cleaned part with water", { at: "la enjuagas con agua" }),
    C("ox_hairdryer_dry", "drying metal part hair dryer", "drying a metal piece with a hair dryer", { at: "un secador de pelo" }),
    X({ kind: "callout", at: "se vuelve a oxidar", figure: "minutos", caption: "Sale del vinagre y se re-oxida si la dejás húmeda.", accent: "danger", _bg: { name: "ox_grey_piece", query: "freshly cleaned grey steel piece", concept: "a freshly de-rusted grey steel piece" }, image: "real/ox_grey_piece.png" }),
    C("ox_oil_after", "wiping oil on cleaned metal protect", "wiping oil on the just-cleaned metal", { at: "le pasas aceite enseguida" }),
    I("ox_oily_cloth", "oily rag cloth on tool", "an oily rag over a clean tool", { at: "ahora sacale el agua" }),
    X({ kind: "splitlist", at: "el limite", title: "El límite, honesto", items: ["Ataca el metal sano si lo olvidás dos días", "No la abandones en el vinagre", "Para lo grande, no sirve"], palette: "A" }),
  ]},
  // ░░ 7) MÉTODO 3 — ácido tánico ░░
  { a: "el acido tanico", beats: [
    X({ kind: "diagram", at: "tanato de hierro", eyebrow: "No lo saques: transformalo", slides: [{ image: dg("dg_ox_tanico", "Diagrama de conversión del óxido: a la izquierda metal con óxido rojo/naranja activo; en el medio una mano con pincel aplica ácido tánico (mostrar una taza de té negro cargado como fuente); a la derecha el mismo metal con una capa NEGRA azulada estable, lista para pintar. Flecha de transformación. Etiquetas 'óxido rojo', 'ácido tánico', 'capa negra estable'."), eyebrow: "El óxido rojo se vuelve una capa negra que protege" }] }),
    I("ox_strong_tea", "strong black tea brewing dark glass", "ten tea bags steeping in hot water", { at: "el te negro bien cargado" }),
    C("ox_tea_pour", "pouring dark strong tea glass", "dark strong tea, the home tannic acid", { at: "10 saquitos de te negro" }),
    C("ox_wire_brush_loose", "wire brush loose rust metal", "brushing off the loose rust first", { at: "un cepillo de alambre" }),
    C("ox_brush_tannic", "brushing dark liquid on rusty metal", "brushing dark tannic liquid over rust", { at: "pincelas eso sobre el oxido" }),
    C("ox_rust_darken", "rust turning black on metal", "the orange rust darkening to black", { at: "empieza a oscurecer" }),
    I("ox_black_coated", "black coated metal piece converted", "metal with a stable blue-black coating", { at: "se vuelve un escudo" }),
    C("ox_paint_enamel", "painting enamel over treated metal", "painting enamel over the converted metal", { at: "pintar con esmalte" }),
    I("ox_painted_protected", "painted metal protected finish", "the painted, protected piece", { at: "protegida por anos" }),
    X({ kind: "chips", at: "diez veces el precio", title: "Por qué no te lo venden", chips: ["Lo venden como 'convertidor'", "Otro nombre", "Diez veces el precio"], hue: "red", imageDarken: 0.6, _bg: { name: "ox_converter_shelf", query: "rust converter bottle hardware shelf", concept: "a branded rust converter bottle on a shelf" }, image: "real/ox_converter_shelf.png" }),
    I("ox_converter_bottle", "rust converter product bottle", "an expensive rust converter bottle", { at: "diez veces el precio" }),
  ]},
  // ░░ 8) INJERTO 1 ░░
  { a: "lo tengo anotado", beats: [
    X({ kind: "diagram", at: "manual de reparaciones", eyebrow: "Las medidas exactas, anotadas", slides: [{ image: dg("dg_ox_manual", "Lámina de un manual/cuaderno abierto sobre una mesa de taller con diagramas de arreglos caseros y medidas, regla y lápiz al lado, estilo archivo. Transmite 'todo ordenado con las cantidades justas'. Sin texto legible."), eyebrow: "El Manual de Reparaciones Caseras" }] }),
    G("ox_manual_celu", { kicker: "Para lo de hoy no te hace falta" }),
    C("ox_notebook_pencil", "old notebook pencil measurements", "a worn notebook with measurements", { at: "me olvidaba las proporciones" }),
  ]},
  // ░░ 9) MÉTODO 4 — electrólisis (densísimo) ░░
  { a: "se llama electrolisis", beats: [
    X({ kind: "diagram", at: "la pinza negra", eyebrow: "Lo más cercano a la magia", slides: [{ image: dg("dg_ox_electro", "Diagrama claro del montaje de electrólisis casera: un balde con agua y soda de lavar, dentro la pieza oxidada conectada al cable NEGRO (negativo) de un cargador de batería, y separado un trozo de hierro de sacrificio conectado al cable ROJO (positivo). Burbujas subiendo. Flechas de corriente. Etiquetas grandes 'NEGRO a tu pieza', 'ROJO al sacrificio', 'soda de lavar'."), eyebrow: "Negro a lo que salvás, rojo a lo que se sacrifica" }] }),
    I("ox_bucket_water", "plastic bucket of water garage", "a plastic bucket of water", { at: "dos cucharadas de soda de lavar" }),
    I("ox_washing_soda", "washing soda box sodium carbonate", "a box of washing soda", { at: "carbonato de sodio" }),
    C("ox_spoon_soda", "two spoonfuls powder measured", "two spoonfuls of washing soda", { at: "cinco litros de agua" }),
    I("ox_battery_charger", "old car battery charger clamps", "an old car battery charger", { at: "de seis o doce volts" }),
    I("ox_scrap_iron", "scrap iron bar piece metal", "a scrap iron bar for sacrifice", { at: "que vas a sacrificar" }),
    X({ kind: "checklist", at: "necesitas cuatro cosas", title: "Cuatro cosas", items: [{ text: "Balde con agua", state: "done" }, { text: "2 cucharadas de soda de lavar / 5 L", state: "done" }, { text: "Un hierro de sacrificio", state: "done" }, { text: "Cargador de batería 6-12V", state: "done" }] }),
    C("ox_dissolve_soda", "stirring powder into bucket water", "dissolving washing soda in the water", { at: "disolves la soda de lavar" }),
    C("ox_submerge_tool", "submerging rusty tool in bucket", "submerging the rusty tool", { at: "metes adentro la pieza oxidada" }),
    C("ox_clamp_black", "battery charger black clamp on metal", "clamping the black lead to the rusty tool", { at: "va a la pieza que queres limpiar" }),
    C("ox_clamp_red", "battery charger red clamp iron bar", "clamping the red lead to the sacrificial iron", { at: "la pinza roja el positivo" }),
    X({ kind: "quote", at: "se come tu pieza buena", text: "Si las invertís, se come *tu pieza buena*. Repetilo en tu cabeza.", accent: "danger", _bg: { name: "ox_clamps_bg", query: "battery charger clamps red black", concept: "battery charger red and black clamps" }, image: "real/ox_clamps_bg.png" }),
    C("ox_charger_on", "turning on battery charger dial", "switching the charger on", { at: "encendes el cargador" }),
    C("ox_bubbles_rise", "bubbles rising electrolysis bucket", "bubbles rising from the tool, working", { at: "vas a ver burbujas subir" }),
    I("ox_bucket_overnight", "bucket setup left overnight garage", "the bucket left to work overnight", { at: "muy comida toda la noche" }),
    X({ kind: "stat", at: "entre cuatro y doce", value: 12, prefix: "4-", suffix: " h", label: "según el óxido; lo muy comido, toda la noche", eyebrow: "Y lo dejás" }),
    C("ox_lift_tool", "lifting tool out of dark bucket", "lifting the tool out the next morning", { at: "a la manana la sacas" }),
    C("ox_brush_black_residue", "brushing black residue off metal", "brushing off the black residue", { at: "un residuo negro" }),
    C("ox_pull_clean", "clean bare steel tool no rust", "clean bare steel underneath", { at: "aparece el metal sano" }),
    X({ kind: "bars", at: "geles removedores", title: "Lo que te ahorrás", unit: "USD", bars: [{ label: "Gel removedor de marca", value: 15, display: "$15", tone: "danger" }, { label: "Electrólisis casera", value: 0, display: "$0", winner: true }] }),
    X({ kind: "diagram", at: "tres limites", eyebrow: "Los límites, sin vender humo", slides: [{ image: dg("dg_ox_limites", "Lámina de seguridad simple con tres bloques: 1) suelta gas hidrógeno inflamable → hacelo al aire libre, sin llamas (ícono ventilación + llama tachada); 2) NO sirve para acero inoxidable ni aluminio (íconos tachados); 3) el metal sale desnudo → aceitalo enseguida (gota de aceite). Estilo manual de seguridad artesanal."), eyebrow: "Tres cosas que tenés que saber" }] }),
    C("ox_oil_clean_tool", "oiling freshly cleaned metal tool", "immediately oiling the cleaned tool", { at: "aceite o cera como en el metodo" }),
  ]},
  // ░░ 10) MÉTODO 5 — pavonado ░░
  { a: "se llama pavonado", beats: [
    X({ kind: "diagram", at: "una capa de oxido negro", eyebrow: "Combatir el óxido malo con el bueno", slides: [{ image: dg("dg_ox_pavonado", "Diagrama del pavonado: una herramienta de acero, calor/llama debajo (150-200°), y un trapo con aceite formando una CAPA NEGRA (magnetita) sobre el metal. Corte mostrando esa capa negra protectora que impide el óxido rojo. Etiquetas 'calor 150-200°', 'aceite', 'capa negra que protege'."), eyebrow: "Una capa de óxido negro que frena al rojo" }] }),
    I("ox_blued_tools", "blued steel tools blue black finish", "tools with a blue-black bluing finish", { at: "negro azulado tan lindo" }),
    C("ox_clean_steelwool", "cleaning steel tool steel wool", "cleaning the tool to bright metal", { at: "lo desengrasas con alcohol" }),
    C("ox_heat_tool", "heating steel tool over flame torch", "heating a steel tool over a flame", { at: "calentas la pieza pareja" }),
    C("ox_oil_smoke", "oil smoking on hot metal rag", "wiping oil on hot metal, it smokes", { at: "humea al tocarla" }),
    C("ox_bluing_form", "steel turning black bluing process", "the steel turning black, bluing forming", { at: "esa capa negra protectora" }),
    X({ kind: "process", at: "limpias el metal", title: "El pavonado", eyebrow: "Como los herreros", steps: [{ title: "Limpiar", desc: "al brillo, desengrasar", image: "real/ox_pav1.png", _bg: { name: "ox_pav1", query: "cleaning steel tool steel wool", concept: "cleaning a steel tool to bright metal" } }, { title: "Calentar", desc: "150-200°, hasta humear", image: "real/ox_pav2.png", _bg: { name: "ox_pav2", query: "heating steel over flame", concept: "heating a steel tool over a flame" } }, { title: "Aceitar", desc: "linaza, 2-3 veces", image: "real/ox_pav3.png", _bg: { name: "ox_pav3", query: "oiling hot steel black layer", concept: "wiping oil on hot steel, black layer" } }] }),
    C("ox_wipe_dry_cool", "wiping cooled black tool dry", "wiping the cooled blued tool", { at: "pasas un trapo seco" }),
    I("ox_blued_knife", "blued steel knife black finish", "a beautifully blued steel blade", { at: "muchisimo mejor" }),
    C("ox_blacksmith", "old blacksmith forge iron work", "an old blacksmith working iron", { at: "los herreros durante siglos" }),
    X({ kind: "splitlist", at: "es una proteccion ligera", title: "Lo honesto", items: ["Es protección ligera, no blindaje", "En mucha humedad, refrescá el aceite", "Lo usaron los herreros durante siglos"], palette: "G" }),
  ]},
  // ░░ 11) INJERTO 2 ░░
  { a: "cuando arme el manual", beats: [
    G("ox_tomas_pausa", { kicker: "Nadie te lo enseña" }),
    X({ kind: "chips", at: "venderte uno nuevo", title: "Por qué nadie te lo enseña", chips: ["Al negocio no le conviene", "que recuperes lo que tenés", "Le conviene venderte uno nuevo"], hue: "red", imageDarken: 0.6, _bg: { name: "ox_store_bg", query: "hardware store tools shelf aisle", concept: "a hardware store tool shelf" }, image: "real/ox_store_bg.png" }),
    X({ kind: "splitlist", at: "lo dividi", title: "Los 40 arreglos, divididos así", items: ["Madera y metal que no mueren", "Plagas por centavos", "Goteras, humedad y moho", "Arreglos del hogar y el auto"], palette: "A" }),
    I("ox_manual_sections", "home repair manual chapters open", "the manual's sections, open", { at: "cuarenta arreglos" }),
  ]},
  // ░░ 12) METAL DE AFUERA ░░
  { a: "herramientas y piezas chicas", beats: [
    G("ox_tomas_afuera", { kicker: "¿Y lo grande?" }),
    I("ox_iron_fence_rain", "wrought iron fence rain rusting", "an iron fence rusting in the rain", { at: "la reja del frente" }),
    C("ox_fence_weather", "weathered iron fence outdoors", "a weathered iron fence outdoors", { at: "vive a la intemperie" }),
    I("ox_metal_gate_posts", "metal gate steel posts weather", "a metal gate and steel posts weathering", { at: "los postes de metal" }),
    C("ox_car_underside", "rusty car underside chassis look up", "looking up at the rusty car underside", { at: "que nunca miras" }),
    I("ox_chassis_hole", "rust hole car frame underbody", "a rust hole in a car frame", { at: "con un agujero" }),
    X({ kind: "splitlist", at: "para la reja", title: "Para la reja y el portón", items: ["Primero frená el óxido con el ácido tánico", "Después sellá con aceite de linaza", "O un buen esmalte sintético"], palette: "A" }),
    C("ox_brush_railing", "brushing oil iron railing fence", "brushing linseed oil over an iron railing", { at: "con aceite de linaza" }),
    I("ox_linseed_can", "linseed oil can brush", "a can of linseed oil and a brush", { at: "penetra en el metal" }),
    C("ox_paint_fence", "painting iron fence enamel brush", "painting an iron fence with enamel", { at: "un buen esmalte sintetico" }),
    X({ kind: "diagram", at: "la gente de campo", eyebrow: "El secreto del chasis", slides: [{ image: dg("dg_ox_lanolina", "Diagrama del chasis de un auto en corte con una capa de aceite/lanolina cubriendo el metal de abajo, formando una película que el agua y la sal de la calle no atraviesan, metiéndose en cada doblez. Flechas de agua rebotando. Etiquetas 'lanolina', 'el agua no entra', 'cada rincón'."), eyebrow: "Una capa de lanolina que el agua no cruza" }] }),
    I("ox_lanolin_tub", "lanolin wool grease tub", "a tub of lanolin, wool grease", { at: "la grasa natural de la lana" }),
    C("ox_sheep_wool", "sheep wool farm close", "sheep wool, where lanolin comes from", { at: "la lana de oveja" }),
    C("ox_spray_underbody", "spraying car underbody rust protection", "spraying the car underbody", { at: "sellando el chasis con aceite" }),
    C("ox_brush_seams", "brushing oil into metal seams", "working oil into every seam", { at: "cada rincon y cada doblez" }),
    C("ox_salt_road", "salt spread snowy road winter", "salt spread on a snowy winter road", { at: "sal sobre la nieve" }),
    X({ kind: "quote", at: "aceite de motor quemado", text: "Aceite de motor quemado contamina. Usá *lanolina o aceite limpio*.", accent: "danger", _bg: { name: "ox_usedoil_bg", query: "dirty used motor oil container", concept: "a container of dirty used motor oil" }, image: "real/ox_usedoil_bg.png" }),
    I("ox_soil_clean", "clean soil garden children", "clean soil where children play", { at: "donde caminan tus hijos" }),
    X({ kind: "splitlist", at: "regla para lo grande", title: "Regla para lo grande", items: ["Primero frenás el óxido", "Después una barrera de aceite", "Que el agua no pueda cruzar"], palette: "G" }),
  ]},
  // ░░ 13) EL ERROR ░░
  { a: "el unico error que hace", full: true, beats: [] },
  { a: "tratar el oxido", beats: [
    C("ox_rust_return", "rust returning on cleaned metal damp", "rust returning on a cleaned metal piece", { at: "el oxido volvio" }),
    I("ox_clean_then_rust", "metal cleaned rusting again spots", "a cleaned metal starting to rust again", { at: "dejaste intacta la causa" }),
    C("ox_damp_corner_tool", "tool in damp dark corner", "a tool left in a damp corner", { at: "un rincon humedo" }),
    X({ kind: "diagram", at: "dos de los tres", eyebrow: "Por qué vuelve", slides: [{ image: dg("dg_ox_error", "Diagrama del error: alguien saca el óxido (metal limpio) pero deja la fuente de humedad (una gota, un rincón húmedo, una gotera). Resultado: el óxido vuelve, a veces peor. Mostrar el ciclo limpio → humedad presente → óxido otra vez, y volver a los tres ingredientes resaltando que dejó el AGUA. Etiquetas 'sacó el óxido', 'dejó el agua', 'vuelve peor'."), eyebrow: "Le devolviste dos de los tres ingredientes" }] }),
    C("ox_leak_drip", "water leak dripping onto metal", "a leak dripping right onto metal", { at: "la gotera que cae" }),
    I("ox_standing_water", "standing water near metal tools", "standing water near tools", { at: "el agua estancada" }),
    X({ kind: "checklist", at: "una sola pregunta", title: "Antes de cualquier método", items: [{ text: "¿De dónde viene la humedad?", state: "todo" }, { text: "Mové la herramienta a un lugar seco", state: "todo" }, { text: "Tapá la gotera, mejorá el drenaje", state: "todo" }, { text: "Recién después sacá el óxido y aceitá", state: "todo" }] }),
    C("ox_move_dry_shelf", "placing tools on dry shelf shed", "moving tools to a dry shelf", { at: "a un lugar seco" }),
    C("ox_fix_leak", "fixing a roof leak drip", "fixing the leak, the real cause", { at: "tapa la gotera" }),
    X({ kind: "headline", at: "el agua de la que vive", tokens: ["No", "pelees", "el", "óxido", "que", "ves.", "Sacale", "el", { t: "agua" }], eyebrow: "La regla final", bg: "image", _bg: { name: "ox_drysafe_bg", query: "dry clean tools rack workshop", concept: "dry well-kept tools that never rust" }, image: "real/ox_drysafe_bg.png" }),
  ]},
  // ░░ 14) CIERRE ░░
  { a: "todo lo del oxido", beats: [
    G("ox_tomas_cierre", { kicker: "Salvá lo que ibas a tirar" }),
    C("ox_restored_tools", "restored clean tools laid out", "a set of restored clean tools laid out", { at: "salvar las herramientas" }),
    I("ox_saved_wrench", "clean restored wrench shining", "a clean restored wrench, saved", { at: "que ibas a tirar" }),
    C("ox_wipe_proud", "wiping a clean tool with cloth", "wiping down a saved tool", { at: "de la vela a la electrolisis" }),
    I("ox_clean_fence_done", "freshly painted iron fence clean", "a clean restored fence", { at: "y un monton de cosas" }),
  ]},
  // ░░ 15) INJERTO 3 ░░
  { a: "junte los cuarenta", beats: [
    X({ kind: "diagram", at: "los planos y las medidas", eyebrow: "Los 40, ordenados y probados", slides: [{ image: dg("dg_ox_stack", "Lámina tipo 'colección de valor' artesanal: un manual ilustrado con 40 arreglos caseros, mostrando madera, óxido, plagas, goteras como secciones, con planos y medidas, apilado como una pila de valor. Estilo archivo, sin precios ni texto legible."), eyebrow: "Con los planos y las medidas exactas" }] }),
    X({ kind: "splitlist", at: "la casa entera", title: "La casa entera, resuelta", items: ["La madera que no se pudre con un líquido de $2", "La gotera que se tapa para siempre", "Las plagas por centavos", "La humedad que sube, cortada por $5"], palette: "A" }),
    X({ kind: "quote", at: "el link esta abajo", text: "Cuesta menos que una visita del fumigador. El link está *abajo*.", accent: "good", _bg: { name: "ox_manual_bg", query: "phone showing ebook manual workbench", concept: "a phone showing a repair manual on a workbench" }, image: "real/ox_manual_bg.png" }),
    G("ox_tomas_igual_hacelo", { kicker: "Igual hacé lo de hoy" }),
  ]},
  // ░░ 16) PRÓXIMO + FIRMA ░░
  { a: "en el proximo video", beats: [
    C("ox_wood_rot", "weathered rotting wood outdoors", "rotting weathered wood", { at: "se pudre en cinco" }),
    I("ox_old_wood_solid", "old solid wood beam intact", "old wood still solid after a century", { at: "cien anos a la intemperie" }),
  ]},
  { a: "se construye un arreglo", full: true, beats: [] },
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
  // ── HOOK / STAKES ──
  { kind: "oxbefore", at: "darlo vuelta", dur: 4.5, before: "real/ox_rust_macro2.png", after: "real/ox_wrench_clean_hand.png", accent: "green" },
  { kind: "oxstack", at: "la pala que tiraste", dur: 4.4, images: ["real/ox_broken_shovel.png", "real/ox_rusty_padlock.png", "real/ox_hinge_rust.png"], captions: ["La pala", "El candado", "La bisagra"], accent: "red" },
  { kind: "oxquote", at: "te lo voy a probar", dur: 4.8, quote: "No te lo *cuento*. Te lo pruebo.", image: "real/ox_dunk_wrench.png", side: "right", accent: "ice" },
  { kind: "oxnote", at: "condenada a la basura", dur: 5.2, image: "real/ox_rust_wrench.png", title: "Lo que el óxido ya hizo", notes: [{ x: 30, y: 38, lx: 12, ly: 20, text: "Naranja y áspero" }, { x: 62, y: 55, lx: 86, ly: 30, text: "Mordazas trabadas" }, { x: 48, y: 72, lx: 70, ly: 88, text: "Picaduras en el metal" }], accent: "red" },
  // ── PRINCIPIO ──
  { kind: "oxside", at: "le ponian una barrera", dur: 5.0, image: "real/ox_oil_rag_metal.png", title: "La barrera de siempre", lines: ["Aceite, cera o grasa", "Entre el metal y el aire húmedo", "Costaba centavos"], side: "right", accent: "amber" },
  { kind: "oxrule", at: "sacale el agua al hierro", dur: 4.6, text: "Sacale el *agua* al hierro y se queda sin de qué vivir", accent: "amber" },
  // ── ABUELO ──
  { kind: "oxside", at: "tenia un formon", dur: 5.0, image: "real/ox_chisel_old.png", title: "El formón del abuelo", lines: ["Más de cien años, y cortaba", "Un trapo con aceite, siempre", "La diferencia no fue el metal"], side: "left", accent: "amber" },
  // ── MÉTODO 1 — cera/tiza ──
  { kind: "oxmethod", at: "una vela de cumpleanos", dur: 4.6, num: "01", title: "Que no aparezca nunca", chips: ["Cera", "Aceite", "Tiza"], cost: "centavos", accent: "amber" },
  { kind: "oxtag", at: "frota la cera sobre", dur: 4.0, name: "Cera / vela", what: "Sella la rosca: no se oxida", side: "left", accent: "amber" },
  { kind: "oxstack", at: "los tornillos las bisagras", dur: 4.4, images: ["real/ox_wax_screw.png", "real/ox_oil_hinge.png", "real/ox_saw_blade_wax.png"], captions: ["Tornillos", "Bisagras", "Filos"], accent: "amber" },
  { kind: "oxside", at: "cuatro o cinco tizas", dur: 4.8, image: "real/ox_chalk_sticks.png", title: "La tiza", lines: ["Chupa la humedad del aire", "En la caja de herramientas", "Cambiala al desmenuzarse"], side: "right", accent: "amber" },
  { kind: "oxspec", at: "cuesta monedas", dur: 5.0, image: "real/ox_candle_wax.png", kicker: "Método 1 — la ficha", title: "Cera y tiza", rows: [{ k: "Costo", v: "monedas" }, { k: "Tiempo", v: "2 min" }, { k: "Dónde", v: "cualquier ferretería" }, { k: "Dura", v: "meses" }], side: "left", accent: "amber" },
  // ── MÉTODO 2 — vinagre ──
  { kind: "oxmethod", at: "el vinagre blanco", dur: 4.4, num: "02", title: "Vinagre para lo chico", chips: ["Vinagre", "Sal gruesa", "Cepillo"], cost: "una botella", accent: "amber" },
  { kind: "oxside", at: "tiene acido acetico", dur: 5.0, image: "real/ox_vinegar_bottle.png", title: "El vinagre", lines: ["Tiene ácido acético", "Disuelve el óxido", "2-3 h leve · toda la noche pesado"], side: "right", accent: "amber" },
  { kind: "oxtag", at: "un punado de sal gruesa", dur: 3.8, name: "Sal gruesa", what: "Acelera la reacción", side: "left", accent: "amber" },
  { kind: "oxstat", at: "hasta veinticuatro horas", dur: 3.8, value: 24, suffix: " h", label: "para óxido pesado, toda la noche", glyph: "🕛", accent: "amber" },
  // ── MÉTODO 3 — ácido tánico ──
  { kind: "oxmethod", at: "el acido tanico", dur: 4.4, num: "03", title: "Convertir el óxido en escudo", chips: ["Ácido tánico", "Té negro", "Pincel"], cost: "centavos", accent: "blue" },
  { kind: "oxtag", at: "el mismo acido que tiene", dur: 4.2, name: "Ácido tánico", what: "El mismo del té negro cargado", price: "centavos", side: "left", accent: "amber" },
  { kind: "oxspec", at: "convertidor de oxido", dur: 5.2, image: "real/ox_converter_bottle.png", kicker: "Lo que te venden vs. lo que es", title: "Convertidor de óxido", rows: [{ k: "En la ferretería", v: "caro" }, { k: "Qué tiene adentro", v: "ácido tánico" }, { k: "En tu casa", v: "té negro cargado" }, { k: "Costo real", v: "centavos" }], side: "right", accent: "blue" },
  { kind: "oxbefore", at: "negro y firme", dur: 4.4, before: "real/ox_rust_darken.png", after: "real/ox_black_coated.png", accent: "green" },
  // ── MÉTODO 4 — electrólisis ──
  { kind: "oxmethod", at: "se llama electrolisis", dur: 4.6, num: "04", title: "Electrólisis", chips: ["Balde", "Soda de lavar", "Cargador"], cost: "centavos de luz", accent: "blue" },
  { kind: "oxstack", at: "necesitas cuatro cosas", dur: 4.4, images: ["real/ox_bucket_water.png", "real/ox_washing_soda.png", "real/ox_battery_charger.png"], captions: ["Balde + agua", "Soda de lavar", "Cargador"], accent: "blue" },
  { kind: "oxside", at: "dos cucharadas de soda", dur: 5.0, image: "real/ox_washing_soda.png", title: "Soda de lavar", lines: ["2 cucharadas por 5 L de agua", "Conduce la corriente", "La de la ropa, común"], side: "right", accent: "blue" },
  { kind: "oxclamp", at: "repetilo en tu cabeza", dur: 4.6, accent: "red" },
  // ── MÉTODO 5 — pavonado ──
  { kind: "oxmethod", at: "se llama pavonado", dur: 4.4, num: "05", title: "Pavonado: el óxido bueno", chips: ["Calor", "Aceite", "Capa negra"], cost: "casi nada", accent: "red" },
  { kind: "oxstat", at: "el aceite humea", dur: 4.0, value: 200, prefix: "150-", suffix: "°", label: "hasta que el aceite humea", glyph: "🔥", accent: "red" },
  { kind: "oxbefore", at: "negro azulado estable", dur: 4.4, before: "real/ox_clean_steelwool.png", after: "real/ox_blued_tools.png", accent: "green" },
  // ── METAL DE AFUERA ──
  { kind: "oxstack", at: "la reja del frente", dur: 4.4, images: ["real/ox_iron_fence_rain.png", "real/ox_metal_gate_posts.png", "real/ox_chassis_hole.png"], captions: ["La reja", "El portón", "El chasis"], accent: "red" },
  { kind: "oxside", at: "la parte de abajo del auto", dur: 5.0, image: "real/ox_car_underside.png", title: "El chasis", lines: ["Donde el óxido trabaja oculto", "Lanolina: el agua no entra", "Una mano al año"], side: "right", accent: "red" },
  { kind: "oxtag", at: "mejor todavia de lanolina", dur: 4.2, name: "Lanolina", what: "Grasa de lana: el agua no la cruza", side: "right", accent: "green" },
  // ── EL ERROR ──
  { kind: "oxstack", at: "tratar el oxido", dur: 4.4, images: ["real/ox_rust_return.png", "real/ox_leak_drip.png", "real/ox_damp_corner_tool.png"], captions: ["Vuelve", "La gotera", "El rincón húmedo"], accent: "red" },
  { kind: "oxside", at: "de donde viene la humedad", dur: 4.8, image: "real/ox_fix_leak.png", title: "Resolvé la causa", lines: ["¿De dónde viene la humedad?", "Lugar seco, tapá la gotera", "Recién después, sacá el óxido"], side: "left", accent: "amber" },
  // ── CIERRE ──
  { kind: "oxquote", at: "la independencia no se compra", dur: 5.4, quote: "La independencia no se *compra*, se construye.", image: "real/ox_restored_tools.png", attribution: "Un arreglo a la vez", side: "right", accent: "green" },
];
let nOv = 0;
for (const o of OVL) { const s = atc(o.at); if (s == null) continue; const { kind, at: _a, dur = 4.2, ...props } = o; beats.push({ id: `ov_${kind}_${Math.round(s)}`, start: +s.toFixed(2), dur, kind, overlay: true, hue: "amber", ...props }); nOv++; }
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
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, clipsfirst: true, beats }, null, 1));
const AVF = [[0, OPEN]];
for (let i = 0; i < SEC.length; i++) { if (!SEC[i].full) continue; const st = SEC[i].start; const end = i + 1 < SEC.length ? SEC[i + 1].start : TOTAL; AVF.push([st, end]); }
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = []; let k = 0;
for (let i = 0; i < beats.length; i++) { if (beats[i].kind !== "raw") continue; if (i % 5 === 2) { pip.push([beats[i].start, beats[i].start + Math.min(beats[i].dur, 7), POS[k % POS.length]]); k++; } }
const firstClip = beats.length ? beats[0].start : OPEN;
const inAvf = (t) => AVF.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const modeAt = (t) => { if (t < firstClip - 1e-6) return "full"; if (inAvf(t)) return "full"; const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6); return p ? p[2] : "hidden"; };
const pts = [...new Set([0, firstClip, ...AVF.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_oxido.gen.ts — GENERADO por build_oxido.mjs. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_OXIDO = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);
const avSecs = AVF.reduce((a, [s, e]) => a + (e - s), 0);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const dur = beats.length ? beats[beats.length - 1].start + beats[beats.length - 1].dur : 0;
const rawN = beats.filter((b) => b.kind === "raw").length;
console.log(`=== build_oxido BUILD ===`);
console.log(`beats ${beats.length} (raw ${rawN}, ${(100 * rawN / beats.length).toFixed(0)}%) · clips ${nClip} · imgs ${nReal} · gpt ${nImg} · faltan ${nMiss} · dur ${(dur / 60).toFixed(1)}min · pace ${(dur / beats.length).toFixed(1)}s`);
console.log(`avatar-full ${(avSecs / 60).toFixed(1)}min · PiP ${pip.length} · windows ${windows.length} · MATCH ${MATCH.length} · BING ${BING.length} · DIAG ${DIAGRAMS.length}`);
if (miss.length) console.log(`faltan (${miss.length}): ${miss.slice(0, 12).join(", ")}`);
