// build_moho.mjs — CLIPS-FIRST HÍBRIDO (Constructor Libre, "El moho NUNCA vuelve con
// este líquido de $1"). Avatar Tomás + b-roll 100% REAL: clips de YouTube matcheados
// (matchfarm) + cientos de imágenes reales de la web (fetch_bing, DuckDuckGo, NO stock,
// NO solo Wikipedia). ÚNICO AI = diagramas explicativos (sin equivalente real en la web).
//
// REGLA #0: cada beat anclado al ms EXACTO del Whisper (captions_moho.json), cortando en
// frases reales (PHRASE_BOUNDS). NUNCA repartir por matemática pura.
// Pacing clips-first ~5s. Densidad alta = identidad (NO se aplica varcheck: es real-footage).
//
// Modos:
//   node build_moho.mjs match   → public/broll/match_moho.json (matchfarm) +
//                                  public/real/bing_moho.json (fetch_bing) +
//                                  public/img/prompts_moho_diag.json (gpt-image-2 diagramas)
//   node build_moho.mjs         → beatsheet/moho.json + avatar_moho.gen.ts
//
// Flujo: build match → matchfarm moho 20 + fetch_bing(ASPNG=1) + fix_img_format + gen diag
//        → fetch_parallel clips_moho_matched.json → build → beatsheet.mjs → farm.
import fs from "fs";

const SLUG = "moho";
const AVATAR = `${SLUG}_opt.mp4`;
const MODE = process.argv[2] === "match" ? "match" : "build";
const MINGAP = Number(process.env.MOHO_MINGAP) || 3.4; // pacing clips-first ~5s
const OPEN = 2.0;
const OV = 0.5;
const DLDUR = 6;

// ── CAPS / anclaje (REGLA #0) ────────────────────────────────────────────────
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));
const at = (phrase) => {
  const t = norm(phrase).split(" ").filter(Boolean);
  for (let i = 0; i <= Wc.length - t.length; i++) { let ok = 1; for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; } if (ok) return Wc[i].ms / 1000; }
  throw new Error("ANCHOR NOT FOUND: " + phrase);
};
const atc = (p) => { try { return at(p); } catch { console.warn("⚠ anchor missing:", p); return null; } };
const TOTAL = +((Wc[Wc.length - 1].e) / 1000 + 1.5).toFixed(2);
const PHRASE_BOUNDS = [];
for (let i = 0; i < caps.length; i++) {
  const prev = caps[i - 1];
  const punct = prev ? /[.,;:!?…"]$/.test(prev.text.trim()) : true;
  const gap = prev ? caps[i].startMs - prev.endMs : 9999;
  if (i === 0 || punct || gap > 260) PHRASE_BOUNDS.push(caps[i].startMs / 1000);
}

// ── helpers de autoría ───────────────────────────────────────────────────────
const C = (name, query, concept, o = {}) => ({ k: "c", name, query, concept, ...o }); // clip YouTube
const I = (name, query, concept, o = {}) => ({ k: "i", name, query, concept, ...o }); // imagen web
const X = (props) => ({ k: "comp", ...props });

const DP = (d) => `Crear una infografía horizontal, RELACIÓN DE ASPECTO EXACTA 16:9 (1792x1024), estilo lámina ilustrada hecha a mano pero muy profesional, limpia, premium y editorial. Fondo marfil claro con textura de papel muy sutil, líneas marrón oscuro casi negras, acentos en verde oliva/salvia y terracota apagado. ${d}. DEJÁ COMPLETAMENTE LIBRE la esquina superior derecha (limpia, sin texto ni dibujos) para colocar después el avatar. Composición minimalista, mucho espacio, pocos bloques grandes, ilustración de tinta fina con acuarela suave, se entiende en 1 segundo. Textos en español, breves y legibles. Estética: vintage botanical / archival textbook illustration, premium editorial, papel levemente envejecido. Evitá verse escolar/infantil/sobrecargado.`;
const DIAGRAMS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };

const HUES = ["amber", "red", "blue"]; // set seguro que aceptan todos los componentes

// ════════════════════════════════════════════════════════════════════════════
// SECCIONES — ancla por frase REAL del transcript (grafía Whisper). Densas (~5s/beat).
// ════════════════════════════════════════════════════════════════════════════
const SECTIONS = [
  // ░░ 1) HOOK — historia del vecino ░░
  { a: "mira te voy a contar", start: 0, beats: [
    I("mh_house_humble", "old humble house exterior countryside", "a humble old country house from outside"),
    I("mh_young_couple", "young couple new home keys", "a young newlywed couple at their first home"),
    C("mh_couple_movein", "couple moving into first house boxes", "a young couple moving into their first house"),
    I("mh_bedroom_corner", "black mold corner bedroom wall", "a black mold stain in a bedroom wall corner"),
    I("mh_crib_wall", "baby crib against bedroom wall", "a baby crib next to a bedroom wall"),
    C("mh_mold_spread", "black mold growing on wall timelapse", "black mold spreading across a wall"),
    I("mh_mold_coin", "small black mold spot wall", "a small coin-sized black mold spot"),
    I("mh_mold_plate", "large black mold patch green edges wall", "a plate-sized black mold patch with green edges"),
    C("mh_baby_cough", "baby congested stuffy nose crib", "a congested baby coughing in a crib"),
    I("mh_doctor_baby", "pediatrician examining baby", "a pediatrician checking a baby"),
    X({ kind: "headline", at: "era el moho", tokens: ["No", "era", "alergia.", "Era", "el", { t: "moho" }], eyebrow: "El enemigo escondido", bg: "image",
      _bg: { name: "mh_mold_bg1", query: "black mold on bedroom wall close", concept: "black mold on a bedroom wall, close up" } }),
  ]},
  // ░░ 2) la ferretería / productos que fallan ░░
  { a: "se fue a la ferreteria", beats: [
    C("mh_hardware_store", "hardware store aisle shelves walking", "walking through a hardware store aisle"),
    I("mh_bleach_bottle", "bleach bottle cleaning product", "a bottle of bleach cleaning product"),
    I("mh_antimold_spray", "anti mold spray bottle product", "an expensive anti-mold spray bottle"),
    I("mh_antimold_paint", "mold resistant paint bucket can", "a bucket of special anti-mold paint"),
    C("mh_cart_products", "shopping cart cleaning products store", "a cart loaded with cleaning products"),
    X({ kind: "bars", at: "gasto como cincuenta dolares", title: "Lo que gastó", eyebrow: "Una sola mancha", unit: "USD",
      bars: [{ label: "Agua oxigenada", value: 1, display: "$1", sub: "frasco marrón", winner: true }, { label: "La ferretería", value: 50, display: "$50", sub: "lavandina + spray + pintura" }] }),
    C("mh_scrub_wall", "scrubbing mold off wall sponge", "scrubbing mold off a wall"),
    C("mh_painting_wall", "painting wall with roller white", "painting over a wall with a roller"),
    C("mh_ventilate", "opening window airing out room", "opening a window to air out a room"),
    I("mh_stain_gone_temp", "freshly painted clean wall", "a freshly painted clean wall"),
  ]},
  // ░░ 3) vuelve más fuerte ░░
  { a: "a la tercera semana", beats: [
    C("mh_mold_returns", "mold coming back painted wall", "mold returning through fresh paint"),
    I("mh_mold_darker", "worse darker black mold wall", "a darker, bigger black mold stain"),
    I("mh_mold_through_paint", "mold bleeding through paint", "mold bleeding through a painted wall"),
    X({ kind: "headline", at: "pero esta vez volvio mas grande", tokens: ["Volvió.", "Más", "grande.", "Más", { t: "oscura" }], eyebrow: "Tres semanas después", bg: "image",
      _bg: { name: "mh_mold_bg2", query: "spreading black mold damp wall", concept: "spreading black mold on a damp wall" } }),
    I("mh_defeated_man", "frustrated tired man home", "a worn-out, defeated man at home"),
    C("mh_hand_on_wall", "man inspecting moldy wall close", "a man inspecting a moldy wall"),
  ]},
  // ░░ 4) el galpón / la botella marrón ░░
  { a: "baje una botella marron", beats: [
    I("mh_shed_shelf", "rustic shed shelf bottles tools", "a rustic shed shelf with bottles"),
    C("mh_reach_shelf", "hand reaching top shelf bottle", "a hand reaching for a bottle on a top shelf"),
    I("mh_brown_bottle", "brown hydrogen peroxide bottle", "a plain brown bottle of hydrogen peroxide"),
    C("mh_bottle_hand", "hand holding up brown bottle", "a hand holding up a brown bottle"),
    I("mh_firstaid_shelf", "first aid bandages cotton balls", "a shelf with bandages and cotton balls"),
    I("mh_pharmacy_bottle", "hydrogen peroxide pharmacy shelf", "a peroxide bottle on a pharmacy shelf"),
    I("mh_skinned_knee", "antiseptic on child knee", "antiseptic dabbed on a child's knee"),
  ]},
  // ░░ 5) IDENTIDAD — Tomás (avatar full) ░░
  { a: "mi nombre es tomas", full: true, beats: [] },
  // ░░ 6) presenta la heroína ░░
  { a: "es esa botella marron de agua", beats: [
    I("mh_brown_bottle2", "brown bottle hydrogen peroxide close", "close up of a brown peroxide bottle"),
    I("mh_bottle_label", "hydrogen peroxide bottle label", "a hydrogen peroxide bottle label"),
    C("mh_pour_peroxide", "pouring hydrogen peroxide liquid", "pouring clear peroxide from a bottle"),
    I("mh_cheap_pharmacy", "drugstore pharmacy shelf bottles", "a cheap drugstore pharmacy shelf"),
    C("mh_bottle_pickup", "hand picking bottle off shelf", "a hand picking up the brown bottle"),
  ]},
  // ░░ 7) promesa ░░
  { a: "y hoy te voy a mostrar", beats: [
    C("mh_spray_wall_intro", "spraying wall with spray bottle", "spraying a wall with a spray bottle"),
    I("mh_mold_gone_wall", "clean white wall no mold", "a clean white wall, mold gone"),
    X({ kind: "chips", at: "lo saca para siempre", title: "Lo que vas a saber", chips: ["Mata la raíz", "Para siempre", "Un dólar"], hue: "amber", imageDarken: 0.6,
      _bg: { name: "mh_chips_bg1", query: "clean fresh wall surface", concept: "a clean fresh wall surface" }, image: "real/mh_chips_bg1.png" }),
    C("mh_before_after", "mold wall before after cleaning", "a moldy wall cleaned, before and after"),
  ]},
  // ░░ 8) por qué la lavandina te miente ░░
  { a: "por que la lavandina ese producto", beats: [
    C("mh_pour_bleach", "pouring bleach onto moldy wall", "pouring bleach onto a moldy wall"),
    I("mh_stain_fades", "mold stain fading wall", "a mold stain fading on a wall"),
    I("mh_bleach_water", "chlorine bleach clear liquid", "clear chlorine bleach liquid"),
    C("mh_wipe_bleach", "wiping wall bleach cloth", "wiping a wall with bleach"),
    X({ kind: "diagram", at: "el cloro se queda arriba", eyebrow: "Por qué la lavandina falla", slides: [
      { image: dg("dg_moho_lavandina", "Diagrama en CORTE de una pared porosa atacada con lavandina: arriba, en la SUPERFICIE, una capa de cloro que solo BLANQUEA la mancha (etiqueta 'cloro: blanquea la superficie'); debajo, dentro de la pared, las RAÍCES del moho (hifas) vivas, y flechas de AGUA bajando hacia ellas (etiqueta 'el agua riega la raíz viva'). La mancha de arriba se ve limpia pero la raíz adentro sigue viva. Tono alerta, terracota apagado."), eyebrow: "Blanquea arriba, riega la raíz abajo" } ] }),
    I("mh_mold_roots", "mold hyphae roots microscope", "the root-like hyphae of mold, magnified"),
    C("mh_grass_cut", "lawn mower cutting grass", "cutting grass while the roots stay alive"),
    I("mh_grass_regrow", "green grass regrowing lawn", "grass growing back green"),
  ]},
  // ░░ 9) el moho tiene raíces / poroso ░░
  { a: "pero el moho no es una mancha", beats: [
    I("mh_mold_living", "black mold fungus macro close", "living black mold fungus, macro"),
    I("mh_tile_grout", "moldy bathroom tile grout", "moldy porous grout between tiles"),
    I("mh_drywall_porous", "porous drywall plaster surface", "a porous plaster drywall surface"),
    C("mh_water_absorb", "water soaking into porous surface", "water soaking into a porous surface"),
    I("mh_wood_mold", "mold on wooden surface beam", "mold growing on wood"),
    X({ kind: "headline", at: "por eso vuelve mas fuerte", tokens: ["Mataste", "arriba.", "Regaste", "la", { t: "raíz" }], eyebrow: "Por eso vuelve", bg: "image",
      _bg: { name: "mh_mold_bg3", query: "black mold corner wall damp", concept: "black mold in a damp wall corner" } }),
  ]},
  // ░░ 10) poroso vs liso (el secreto) ░░
  { a: "y aca viene lo importante", beats: [
    I("mh_safety_sheet", "product safety data sheet paper", "a product safety data sheet"),
    I("mh_steel_counter", "stainless steel kitchen counter", "a smooth stainless steel counter"),
    I("mh_toilet_clean", "clean white toilet bowl", "a smooth clean toilet"),
    C("mh_wipe_steel", "wiping steel surface clean cloth", "wiping a smooth steel surface clean"),
    I("mh_wall_ceiling", "damp ceiling wall corner mold", "a damp wall and ceiling corner"),
    C("mh_bleach_fail", "wiping moldy wall cloth fail", "wiping a moldy wall, bleach failing"),
  ]},
  // ░░ 11) la química H2O2 ░░
  { a: "el agua oxigenada en cambio hace", beats: [
    I("mh_peroxide_clear", "clear hydrogen peroxide liquid glass", "clear hydrogen peroxide in a glass"),
    X({ kind: "annotated", at: "vas a ver escrito ahi", eyebrow: "Leé la etiqueta", caption: "3% y H₂O₂: agua con un oxígeno de más",
      annotations: [{ kind: "circle", x: 36, y: 46, label: "3%" }, { kind: "arrow", x: 64, y: 52, label: "H₂O₂" }],
      _bg: { name: "mh_label_macro", query: "hydrogen peroxide bottle label 3 percent close", concept: "a 3% hydrogen peroxide label, close up" }, image: "real/mh_label_macro.png" }),
    I("mh_water_glass", "clear glass of plain water", "a clear glass of plain water"),
    I("mh_molecule", "water molecule model science", "a simple molecule model"),
    C("mh_fizz_bubbles", "hydrogen peroxide fizzing foam", "hydrogen peroxide fizzing into foam"),
    I("mh_oxygen_o", "oxygen bubbles in liquid macro", "oxygen bubbles in a liquid, macro"),
  ]},
  // ░░ 12) penetra a la raíz ░░
  { a: "el agua oxigenada por ser tan", beats: [
    C("mh_liquid_soak", "liquid soaking into wall surface", "liquid soaking deep into a wall"),
    C("mh_drop_absorb", "drop absorbing into porous material", "a drop absorbing into porous material"),
    X({ kind: "diagram", at: "va a buscar la raiz", eyebrow: "Por qué el agua oxigenada gana", slides: [
      { image: dg("dg_moho_peroxido", "Diagrama en CORTE de la misma pared porosa tratada con AGUA OXIGENADA: el líquido PENETRA hacia adentro siguiendo al moho (flechas entrando profundo), y en la RAÍZ libera burbujas de OXÍGENO que revientan al hongo (burbujas/estrellitas sobre las hifas, etiqueta 'el oxígeno mata la raíz'). Abajo queda solo AGUA (etiqueta 'queda agua y aire, nada tóxico'). Tono positivo, verde salvia."), eyebrow: "Penetra, el oxígeno revienta la raíz" } ] }),
    I("mh_oxygen_bubbles", "oxygen bubbles foam macro", "oxygen bubbles foaming, macro"),
    I("mh_mold_dead", "dead dried mold patch wall", "a dead, dried-out mold patch"),
    C("mh_bubbles_burst", "bubbles bursting foam surface", "bubbles bursting on a surface"),
  ]},
  // ░░ 13) la espuma = la prueba ░░
  { a: "lo vas a ver burbujear", beats: [
    C("mh_foam_wall", "white foam bubbling on surface", "white foam bubbling on a surface"),
    C("mh_foam_macro", "foam fizzing macro close up", "fizzing white foam, macro"),
    I("mh_white_foam", "white foam on wall stain", "white foam over a wall stain"),
  ]},
  // ░░ 14) sin veneno ░░
  { a: "nada de ese olor", beats: [
    I("mh_small_bathroom", "small bathroom no window", "a small windowless bathroom"),
    C("mh_bleach_fumes", "person bothered cleaning fumes", "someone bothered by harsh fumes"),
    I("mh_child_home", "child safe clean home playing", "a child safe in a clean home"),
    X({ kind: "splitlist", at: "se descompone en agua y aire", title: "Lavandina vs agua oxigenada", items: ["Lavandina: cloro en el aire", "Agua oxigenada: agua y oxígeno", "Sin veneno donde duermen los chicos"], palette: "G" }),
    C("mh_clean_air_home", "fresh clean home interior light", "a fresh, clean home interior"),
  ]},
  // ░░ 15) CÓMO USARLA — la de 3% ░░
  { a: "dejame mostrarte como ponerla", beats: [
    I("mh_3pct_bottle", "brown bottle 3 percent peroxide", "a 3% brown peroxide bottle"),
    I("mh_strong_chem", "strong chemical bottle warning label", "a stronger chemical bottle with warnings"),
    I("mh_gentle_bottle", "ordinary brown first aid bottle", "an ordinary gentle brown bottle"),
    C("mh_handle_bottle", "carefully handling brown bottle", "carefully handling a brown bottle"),
  ]},
  // ░░ 16) rociador sin diluir ░░
  { a: "conseguite un rociador un atomizador", beats: [
    I("mh_spray_bottle", "empty spray bottle atomizer", "an empty spray bottle"),
    C("mh_fill_spray", "filling spray bottle with liquid", "filling a spray bottle with liquid"),
    I("mh_undiluted", "pouring peroxide into spray bottle", "pouring undiluted peroxide into a spray bottle"),
  ]},
  // ░░ 17) PASO 1 — guantes / esporas ░░
  { a: "antes de tocar nada", beats: [
    C("mh_gloves_on", "putting on rubber gloves hands", "putting on rubber gloves"),
    I("mh_dust_mask", "simple dust mask face", "a simple dust mask"),
    I("mh_mold_spores_air", "mold spores floating in air macro", "mold spores floating in the air, macro"),
    C("mh_open_window2", "opening window fresh air room", "opening a window for fresh air"),
  ]},
  // ░░ 18) PASO 2 — rociar y esperar ░░
  { a: "rocia la mancha empapala", beats: [
    C("mh_spray_mold", "spraying moldy wall spray bottle", "spraying a moldy wall generously"),
    I("mh_wall_wet", "wet sprayed wall dripping", "a wall soaked and dripping"),
    X({ kind: "stat", at: "dejala actuar", value: 15, suffix: " min", label: "dejá que el oxígeno llegue hasta la raíz", eyebrow: "Lo que casi nadie hace" }),
    C("mh_foam_react", "foam fizzing on sprayed wall", "foam fizzing on a sprayed wall"),
    I("mh_wait_clock", "wall clock waiting minutes", "a clock marking the wait"),
    C("mh_foam_grow", "white foam growing on wall", "white foam growing over a wall stain"),
  ]},
  // ░░ 19) PASO 3 — refregar ░░
  { a: "ahora si agarra un cepillo", beats: [
    I("mh_scrub_brush", "scrub brush sponge cloth", "a scrub brush, sponge and cloth"),
    C("mh_scrub_clean", "scrubbing dead mold off wall", "scrubbing the dead mold off easily"),
    C("mh_wipe_clean", "wiping wall clean with cloth", "wiping a wall clean"),
    I("mh_clean_wall_dry", "clean dry wall no stain", "a clean dry wall, no stain"),
    C("mh_spray_again", "spraying wall second time", "spraying the wall a second time"),
  ]},
  // ░░ 20) INJERTO 1 — venta suave ░░
  { a: "apenas uno de los mas", beats: [
    X({ kind: "diagram", at: "en el manual del constructor", eyebrow: "35 sistemas, probados uno por uno", slides: [
      { image: dg("dg_moho_manual", "Lámina de un manual/libro de homestead abierto sobre una mesa de taller, con diagramas técnicos a mano (una pared en corte, medidas, una botella), regla y lápiz al lado, estilo archivo. Transmite 'sistemas caseros documentados y probados, paso a paso'. Sin texto legible específico."), eyebrow: "Todo escrito, paso a paso" } ] }),
    I("mh_manual_book", "open hand drawn manual book workbench", "an open hand-drawn home manual on a workbench"),
  ]},
  // ░░ 21) QUE NO VUELVA — síntoma vs humedad ░░
  { a: "como hacer que el moho no vuelva", beats: [
    I("mh_mold_corner2", "black mold ceiling corner", "black mold in a ceiling corner"),
    X({ kind: "headline", at: "el fuego es la humedad", tokens: ["El", "moho", "es", "el", "humo.", "El", "fuego", "es", "la", { t: "humedad" }], eyebrow: "La verdad que cambia todo", bg: "image",
      _bg: { name: "mh_damp_bg", query: "damp wet wall water damage", concept: "a damp wall with water damage" } }),
    C("mh_damp_wall", "water damp damage spreading wall", "damp damage spreading on a wall"),
    I("mh_wet_corner", "wet stained wall corner", "a wet, stained wall corner"),
  ]},
  // ░░ 22) las 3 cosas ░░
  { a: "necesita tres cosas", beats: [
    X({ kind: "diagram", at: "necesita tres cosas", eyebrow: "Qué necesita el moho", slides: [
      { image: dg("dg_moho_tres", "Diagrama tipo TRIÁNGULO con tres elementos que el moho necesita: 'SUPERFICIE' (una pared), 'COMIDA' (polvo, pintura, papel del yeso) y 'HUMEDAD' (una gota de agua). En el centro, una mancha de moho. Mostrar con una TIJERA o una X grande que se CORTA la 'HUMEDAD' → la mancha se seca y muere. Etiqueta 'cortá la humedad y el moho se muere de sed'. Verde salvia."), eyebrow: "Cortá una sola: la humedad" } ] }),
    I("mh_spore_macro", "single mold spore macro", "a single mold spore, macro"),
    I("mh_dust_wall", "dust grime on wall surface", "dust and grime on a wall"),
    C("mh_water_drop", "water droplet on wall surface", "a water droplet on a wall"),
    I("mh_dry_wall_safe", "dry healthy wall surface", "a dry, healthy wall"),
  ]},
  // ░░ 23) la fuente de agua ░░
  { a: "anda a buscar de donde viene", beats: [
    X({ kind: "diagram", at: "de donde viene el agua", eyebrow: "De dónde viene la humedad", slides: [
      { image: dg("dg_moho_fuente", "Diagrama de una CASA en corte señalando las fuentes de humedad que alimentan el moho: una FILTRACIÓN en el techo (gota cayendo), una CAÑERÍA que transpira detrás de la pared, un RINCÓN FRÍO sin aire detrás de un placard/cama, y un BAÑO SIN VENTANA lleno de vapor. Flechas a cada foco. Etiquetas breves 'techo', 'caño', 'rincón frío', 'baño sin aire'. Tono diagnóstico, claro."), eyebrow: "Techo, caño, rincón frío, baño sin aire" } ] }),
    I("mh_roof_leak", "water leak stain ceiling", "a water leak stain on a ceiling"),
    I("mh_pipe_wall", "pipe behind wall condensation", "a sweating pipe behind a wall"),
    I("mh_behind_furniture", "mold behind wardrobe cold corner", "mold behind a wardrobe in a cold corner"),
    C("mh_move_furniture", "pulling furniture from wall", "pulling furniture away from a wall"),
    C("mh_shower_steam", "steamy bathroom shower no window", "a steamy windowless bathroom"),
    C("mh_extractor_fan", "bathroom extractor fan vent running", "a bathroom extractor fan running"),
  ]},
  // ░░ 24) prevención mensual ░░
  { a: "un truco de prevencion", beats: [
    C("mh_spray_prevent", "lightly spraying wall corner", "lightly spraying a wall corner"),
    X({ kind: "stat", at: "una vez por mes", value: 1, suffix: "x / mes", label: "rociada liviana en los rincones de riesgo", eyebrow: "El guardia de la pared" }),
    I("mh_cold_wall", "cold exterior wall corner", "a cold exterior wall corner"),
    I("mh_bathroom_joint", "bathroom tile joints clean", "the joints of bathroom tiles"),
    C("mh_mist_corner", "misting corner spray bottle", "misting a corner with a spray bottle"),
  ]},
  // ░░ 25) honesto: mancha enorme ░░
  { a: "te voy a ser honesto", beats: [
    I("mh_big_damage", "severe mold whole wall damage", "severe mold covering a whole wall"),
    I("mh_soft_plaster", "rotten soft swollen drywall", "rotten, swollen drywall"),
    C("mh_replace_wall", "removing damaged drywall section", "removing a damaged wall section"),
    I("mh_small_corner_mold", "small mold corner manageable", "small everyday mold in a corner"),
  ]},
  // ░░ 26) usos extra ░░
  { a: "dejame darte un punado de usos", beats: [
    C("mh_grout_brush", "cleaning tile grout toothbrush", "scrubbing tile grout with a toothbrush"),
    I("mh_white_grout", "clean white tile grout bathroom", "bright white clean tile grout"),
    C("mh_wipe_counter", "wiping kitchen counter cloth", "disinfecting a kitchen counter"),
    I("mh_cutting_board", "clean wooden cutting board", "a clean wooden cutting board"),
    C("mh_spray_drain", "spraying kitchen sink drain", "spraying a sink drain"),
    I("mh_fridge_clean", "clean inside refrigerator", "a clean refrigerator interior"),
    I("mh_trash_can", "clean kitchen trash bin", "a clean kitchen trash bin"),
  ]},
  // ░░ 27) RE-HOOK (avatar full) + INJERTO 2 ░░
  { a: "y aca quiero que pares", full: true, beats: [] },
  { a: "por que si esto es tan", beats: [
    I("mh_store_shelf_pricey", "store shelf expensive cleaning products", "a shelf of pricey cleaning products"),
    C("mh_walk_past_shelf", "walking past store shelf products", "walking past a store shelf"),
    I("mh_pharmacy_hidden", "small brown bottle drugstore shelf", "the cheap little bottle on a drugstore shelf"),
    X({ kind: "costtally", at: "es el modelo de negocio", left: { label: "Su producto", note: "vuelve cada 3 semanas, comprás otra vez", total: 50, bad: true }, right: { label: "Agua oxigenada", note: "una vez, y listo", total: 1 } }),
    X({ kind: "quote", at: "un cliente con el problema", text: "Un cliente con el problema resuelto es un *cliente perdido*.", accent: "danger",
      _bg: { name: "mh_corp_bg", query: "corporate office building grey exterior", concept: "a faceless corporate office building" }, image: "real/mh_corp_bg.png" }),
  ]},
  // ░░ 28) viejas costumbres ░░
  { a: "las viejas costumbres", beats: [
    I("mh_old_farmhouse_shelf", "old farmhouse pantry shelf jars", "an old farmhouse shelf of simple jars"),
    X({ kind: "chips", at: "sabian que el agua oxigenada", title: "Cuatro cosas para todo", chips: ["Agua oxigenada", "Vinagre", "Bórax", "Sentido común"], hue: "amber", imageDarken: 0.6,
      _bg: { name: "mh_pantry_bg", query: "rustic pantry shelf vinegar bottles", concept: "a rustic pantry shelf with simple bottles" }, image: "real/mh_pantry_bg.png" }),
    I("mh_vinegar_bottle", "white vinegar bottle cleaning", "a bottle of white vinegar"),
    I("mh_borax_box", "borax powder box household", "a box of borax powder"),
    C("mh_old_hands_clean", "old hands cleaning home rag", "old hands cleaning with a rag"),
  ]},
  // ░░ 29) los 4 errores ░░
  { a: "los errores mas comunes", beats: [
    X({ kind: "checklist", at: "el primer error", title: "Los 4 errores que veo siempre", accent: "danger",
      items: [
        { text: "Usar lavandina y creer que resolviste", state: "todo" },
        { text: "Pintar arriba del moho vivo", state: "todo" },
        { text: "Matar la mancha y olvidar la humedad", state: "todo" },
        { text: "Guardar la botella con luz y calor", state: "todo" } ],
      _bg: { name: "mh_errors_bg", query: "moldy damp wall corner", concept: "a damp moldy wall corner" }, image: "real/mh_errors_bg.png" }),
    C("mh_paint_over_mold", "painting over mold stain wall", "painting over a mold stain"),
    I("mh_fresh_paint_mold", "mold under fresh paint", "mold under fresh paint"),
    I("mh_bottle_sun", "bottle in sunlight windowsill", "a bottle left in sunlight"),
    I("mh_bottle_dark_store", "bottle dark cupboard storage", "a bottle in a cool dark cupboard"),
  ]},
  // ░░ 30) HISTORIA DEL ABUELO (avatar full) + cierre ░░
  { a: "la primera vez que yo", full: true, beats: [] },
  { a: "fue hasta el galpon", beats: [
    I("mh_old_furniture_mold", "old wooden furniture green mold", "an old wooden cabinet covered in green mold"),
    C("mh_spray_furniture", "spraying old wooden furniture", "spraying down an old wooden cabinet"),
    I("mh_furniture_sun", "furniture drying in sun yard", "furniture drying in the sun"),
    I("mh_clean_furniture", "clean restored wooden furniture", "the cabinet clean and restored"),
    X({ kind: "aged", at: "el senor nos da respuestas", heading: "Lo que me dijo mi abuelo", lines: [{ text: "El Señor nos da respuestas simples, hijo.", mark: true }, { text: "Somos nosotros los que buscamos las complicadas." }],
      _bg: { name: "mh_grandpa_bg", query: "old man weathered hands workshop", concept: "an old man's weathered hands in a workshop" }, image: "real/mh_grandpa_bg.png" }),
  ]},
  // ░░ 31) RECAP + process ░░
  { a: "asi que ahi lo tenes", beats: [
    C("mh_spray_recap", "spraying wall spray bottle", "spraying a wall with peroxide"),
    I("mh_wait_recap", "spray bottle on wall waiting", "the sprayed wall left to act"),
    C("mh_scrub_recap", "scrubbing wall clean cloth", "scrubbing the wall clean"),
    X({ kind: "process", at: "rocia deja actuar", title: "El sistema, en 3 pasos", eyebrow: "Un frasco de $1", steps: [
      { title: "Rociá", desc: "agua oxigenada 3% pura", image: "real/mh_step_spray.png", _bg: { name: "mh_step_spray", query: "spraying wall spray bottle close", concept: "spraying a wall, close up" } },
      { title: "Esperá 15 min", desc: "que llegue a la raíz", image: "real/mh_step_wait.png", _bg: { name: "mh_step_wait", query: "foam fizzing on wall", concept: "foam fizzing on a wall" } },
      { title: "Refregá", desc: "y cortá la humedad", image: "real/mh_step_scrub.png", _bg: { name: "mh_step_scrub", query: "scrubbing clean wall cloth", concept: "scrubbing a wall clean" } } ] }),
    I("mh_dry_corner_clean", "clean dry wall corner", "a clean, dry wall corner"),
  ]},
  // ░░ 32) INJERTO 3 — CTA stack ░░
  { a: "que tengo reunidos en el manual", beats: [
    X({ kind: "diagram", at: "los dos tomos", eyebrow: "Todo, ordenado y probado", slides: [
      { image: dg("dg_moho_stack", "Lámina tipo 'oferta de valor' artesanal: dos tomos de un manual de construcción/homestead apilados, con diagramas técnicos, un plan y bonos, como una pila de valor. Estilo archivo, vintage, sin precios ni texto específico legible."), eyebrow: "Los dos tomos, 35 sistemas" } ] }),
    X({ kind: "bars", at: "te da mas de 150", title: "El valor", eyebrow: "Hoy", unit: "USD",
      bars: [{ label: "Por separado", value: 158, display: "$158", tone: "danger" }, { label: "Hoy", value: 27, display: "$27", winner: true }] }),
    X({ kind: "quote", at: "te devuelvo cada centavo", text: "Si no te sirve, te devuelvo *cada centavo*. El riesgo lo pongo yo.", accent: "good",
      _bg: { name: "mh_manual_phone", query: "phone showing ebook workbench", concept: "a phone showing an ebook on a workbench" }, image: "real/mh_manual_phone.png" }),
  ]},
  // ░░ 33) journey de cierre ░░
  { a: "quedate con el agua oxigenada", beats: [
    X({ kind: "journey", at: "quedate con el agua oxigenada", eyebrow: "Tu casa, sana de nuevo", title: "Empezá hoy", waypoints: [
      { x: 0, y: 0, z: 0, image: "real/mh_j_mancha.png", label: "La mancha", num: "1", dwell: 2.4, travel: 1.5, _bg: { name: "mh_j_mancha", query: "black mold wall corner", concept: "a black mold wall corner" } },
      { x: 1.2, y: -0.3, z: 0.3, image: "real/mh_j_rociar.png", label: "Rociá", num: "2", dwell: 2.4, travel: 1.5, _bg: { name: "mh_j_rociar", query: "spraying wall spray bottle", concept: "spraying a wall" } },
      { x: 2.4, y: 0.3, z: -0.2, image: "real/mh_j_seca.png", label: "Cortá la humedad", num: "3", dwell: 2.4, travel: 1.5, _bg: { name: "mh_j_seca", query: "dry clean wall corner", concept: "a dry clean wall corner" } },
      { x: 3.6, y: -0.2, z: 0.2, image: "real/mh_j_sana.png", label: "Casa sana", num: "4", dwell: 2.8, travel: 1.4, _bg: { name: "mh_j_sana", query: "clean bright healthy room home", concept: "a clean, bright, healthy home" } } ] }),
  ]},
  // ░░ 34) OUTRO (avatar full) ░░
  { a: "haceme la gambeta de suscribirte", full: true, beats: [] },
];

// ── resolver starts ───────────────────────────────────────────────────────
for (const s of SECTIONS) { if (s.start == null) s.start = atc(s.a); }
const SEC = SECTIONS.filter((s) => s.start != null).sort((a, b) => a.start - b.start);

// ── construir beats (snap a PHRASE_BOUNDS) ──────────────────────────────────
const beats = [];
const MATCH = [], BING = [];
const seenM = new Set(), seenB = new Set();
const addM = (name, query, concept) => { if (!seenM.has(name)) { seenM.add(name); MATCH.push({ name, concept, query: Array.isArray(query) ? query : [query], dur: DLDUR }); } };
const addB = (name, query, concept) => { if (name && !seenB.has(name)) { seenB.add(name); BING.push({ name, query, concept: concept || query, count: 1 }); } };

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
    if (t <= lastT + 0.4) t = lastT + Math.max(MINGAP * 0.6, 1.2);
    lastT = t;
    placed.push({ b, t: +t.toFixed(2) });
  }
  for (let i = 0; i < placed.length; i++) {
    const { b, t } = placed[i];
    const nextT = i + 1 < placed.length ? placed[i + 1].t : end;
    const dur = +Math.min(nextT - t + OV, TOTAL - t).toFixed(2);
    const hue = b.hue || HUES[(si + i) % HUES.length];
    if (b.k === "c") {
      beats.push({ id: b.name, start: t, dur, kind: "raw", src: `broll/${b.name}.mp4`, darken: 0, hue });
      addM(b.name, b.query, b.concept); addB(b.name, Array.isArray(b.query) ? b.query[0] : b.query, b.concept);
    } else if (b.k === "i") {
      beats.push({ id: b.name, start: t, dur, kind: "raw", src: `real/${b.name}.png`, darken: 0, hue });
      addB(b.name, Array.isArray(b.query) ? b.query[0] : b.query, b.concept);
    } else if (b.k === "comp") {
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

// ════════════════ SALIDA ════════════════
fs.mkdirSync("public/broll", { recursive: true });
fs.mkdirSync("public/real", { recursive: true });
fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(MATCH, null, 2));
fs.writeFileSync(`public/real/bing_${SLUG}.json`, JSON.stringify(BING, null, 2));
fs.writeFileSync(`public/img/prompts_${SLUG}_diag.json`, JSON.stringify(DIAGRAMS, null, 2));

if (MODE === "match") {
  console.log(`=== build_moho MATCH ===`);
  console.log(`match_${SLUG}.json: ${MATCH.length} clips · bing_${SLUG}.json: ${BING.length} imágenes reales · diagramas IA: ${DIAGRAMS.length}`);
  const proxN = 6; const cands = 2;
  console.log(`presupuesto proxy: ${cands}×${MATCH.length}÷${proxN} = ${(cands * MATCH.length / proxN).toFixed(0)}/IP (≤80 ok para 1 pasada)`);
  process.exit(0);
}

// ── MODO BUILD: resolver src real ───────────────────────────────────────────
const haveClip = (n) => fs.existsSync(`public/broll/${n}.mp4`);
const haveReal = (n) => fs.existsSync(`public/real/${n}.png`) || fs.existsSync(`public/real/${n}.jpg`);
let nClip = 0, nReal = 0, nMiss = 0; const miss = [];
for (const b of beats) {
  if (b.kind !== "raw") continue;
  if (b.src.startsWith("broll/")) {
    if (haveClip(b.id)) nClip++;
    else if (haveReal(b.id)) { b.src = `real/${b.id}.png`; nReal++; }
    else { nMiss++; miss.push(b.id); }
  } else if (b.src.startsWith("real/")) {
    if (haveReal(b.id)) nReal++; else { nMiss++; miss.push(b.id); }
  }
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));

// ── ventanas de avatar ──────────────────────────────────────────────────────
// Las secciones full:true (identidad, abuelo, rehook, outro) = avatar a pantalla
// completa TODA la sección (de su start al start de la próxima sección). Si no, queda
// b-roll congelado bajo el avatar oculto (bug que dejaba ~30s muertos).
const AVF = [[0, OPEN]];
for (let i = 0; i < SEC.length; i++) {
  if (!SEC[i].full) continue;
  const st = SEC[i].start;
  const end = i + 1 < SEC.length ? SEC[i + 1].start : TOTAL;
  AVF.push([st, end]);
}
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = [];
let k = 0;
for (let i = 0; i < beats.length; i++) {
  if (beats[i].kind !== "raw") continue;
  if (i % 5 === 2) { pip.push([beats[i].start, beats[i].start + Math.min(beats[i].dur, 7), POS[k % POS.length]]); k++; }
}
const firstClip = beats.length ? beats[0].start : OPEN;
const inAvf = (t) => AVF.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const modeAt = (t) => {
  if (t < firstClip - 1e-6) return "full";
  if (inAvf(t)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
  return p ? p[2] : "hidden";
};
const pts = [...new Set([0, firstClip, ...AVF.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = [];
let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_moho.gen.ts — GENERADO por build_moho.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_MOHO = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const avSecs = AVF.reduce((a, [s, e]) => a + (e - s), 0);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const dur = beats.length ? beats[beats.length - 1].start + beats[beats.length - 1].dur : 0;
const rawN = beats.filter((b) => b.kind === "raw").length;
console.log(`=== build_moho BUILD ===`);
console.log(`beats: ${beats.length} (raw ${rawN}, ${(100 * rawN / beats.length).toFixed(0)}%) · clips: ${nClip} · imgs reales: ${nReal} · faltan: ${nMiss} · dur: ${(dur / 60).toFixed(1)}min · pace ${(dur / beats.length).toFixed(1)}s`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
console.log(`kinds:`, JSON.stringify(kinds));
console.log(`MATCH: ${MATCH.length} · BING: ${BING.length} · DIAGRAMS: ${DIAGRAMS.length}`);
if (miss.length) console.log(`faltan (${miss.length}): ${miss.slice(0, 12).join(", ")}${miss.length > 12 ? "…" : ""}`);
