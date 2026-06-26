// build_mosquitos.mjs — CLIPS-FIRST HÍBRIDO (Constructor Libre, "Por Qué Los Mosquitos No Entran Al Patio Del Vecino").
// Avatar Tomás + b-roll dominante REAL: clips YouTube (matchfarm proxies) + cientos de imágenes
// web (fetch_bing). AI solo diagramas. Queries ANALIZADAS del guion (específicas, EN inglés,
// ancladas al tema) — no random. Pacing ~4-5s (denso). REGLA #0: cada beat al ms exacto.
// Modos:  node build_mosquitos.mjs match  |  node build_mosquitos.mjs
import fs from "fs";

const SLUG = "mosquitos";
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
  // ░░ 1) COLD OPEN — la historia del viejo ░░
  { a: "a mi viejo", start: 0, beats: [
    C("mq_mosquito_skin_macro", "mosquito biting human skin macro slow", "a mosquito biting skin, feeding on blood", { at: "los mosquitos casi lo matan" }),
    C("mq_hospital_bed_iv", "sick patient hospital bed iv drip", "a man in a hospital bed with dengue", { at: "dos semanas en el hospital" }),
    C("mq_fever_thermometer", "high fever sweating patient sick bed", "a fever that would not break", { at: "una fiebre que no bajaba" }),
    I("mq_doctor", "doctor serious talking in hospital", "the doctor who told us the truth", { at: "yo lo miraba en esa cama" }),
    X({ kind: "bars", at: "todas las guerras juntas", title: "Muertes humanas por año", unit: "por año", bars: [{ label: "Tiburón", value: 10, display: "~10", tone: "cold" }, { label: "Víbora", value: 50000, display: "50.000" }, { label: "Mosquito", value: 725000, display: "725.000", winner: true, tone: "danger" }] }),
    C("mq_shark_underwater", "great white shark swimming underwater", "the shark, not the deadliest", { at: "no es el tiburon" }),
    C("mq_aedes_macro", "aedes mosquito striped legs extreme macro", "the mosquito, the deadliest animal", { at: "es el mosquito" }),
    C("mq_backyard_dusk", "suburban backyard at dusk golden light", "your own backyard at dusk", { at: "en tu patio" }),
    C("mq_man_searching_yard", "man inspecting backyard corners looking", "searching the yard for the source", { at: "fuimos al fondo" }),
  ]},
  // ░░ 2) CONFIRMACIÓN ░░
  { a: "si entraste a este video", beats: [
    C("mq_swatting_dusk", "person swatting mosquitoes annoyed patio evening", "swatting mosquitoes, cannot enjoy the patio", { at: "te comen vivo" }),
    C("mq_scratching_ankles", "scratching mosquito bites on ankles", "scratching bitten ankles", { at: "rascandote los tobillos" }),
    C("mq_neighbor_calm_patio", "man relaxing outdoor patio evening drink calm", "the neighbor sitting outside, calm", { at: "el vecino esta sentado afuera" }),
    I("mq_two_coins", "two small coins in palm of hand", "a secret that costs two pesos", { at: "que cuesta dos pesos" }),
  ]},
  // ░░ 3) PRUEBA SHOCK — el balde ░░
  { a: "mira este balde", beats: [
    C("mq_bucket_corner_yard", "old bucket of water in shady garden corner", "a bucket of water left in a corner", { at: "un rincon del patio" }),
    C("mq_larvae_wriggling", "mosquito larvae wriggling water surface macro", "wriggling mosquito larvae in the water", { at: "son larvas" }),
    I("mq_larvae_hundreds", "many mosquito larvae floating in water closeup", "hundreds of larvae at the surface", { at: "cientos" }),
    C("mq_larva_single_macro", "single mosquito larva macro detail water", "every larva that will not become a mosquito", { at: "ninguna te va a picar" }),
  ]},
  // ░░ 4) ROADMAP / loops ░░
  { a: "pero antes de armar esa trampa", beats: [
    C("mq_two_species_compare", "two different mosquito species macro", "the two kinds of mosquito you have", { at: "los dos mosquitos que tenes" }),
    C("mq_oil_on_water_film", "oil film shimmer on still water surface", "the two-peso liquid that kills larvae", { at: "el liquido de dos pesos" }),
    C("mq_hidden_container_water", "forgotten container holding water in yard", "the hidden breeders nobody checks", { at: "los criaderos escondidos" }),
  ]},
  // ░░ 5) SOY TOMÁS ░░
  { a: "soy tomas", full: true, beats: [] },
  // ░░ 6) STAKES ░░
  { a: "lo que el mosquito te roba", beats: [
    C("mq_family_indoors_hot", "family indoors summer night windows closed", "stuck inside on a summer night", { at: "terminas encerrado adentro" }),
    C("mq_bbq_leaving_dusk", "people leaving backyard barbecue at dusk", "the barbecue that ends indoors", { at: "termina adentro" }),
    C("mq_child_bites_scratch", "child with mosquito bites scratching arm", "kids covered in itchy bites", { at: "los chicos llenos de ronchas" }),
    C("mq_aedes_on_skin", "aedes mosquito biting human skin", "the same mosquito that spreads dengue", { at: "transmite el dengue" }),
    I("mq_coils_aerosol", "mosquito coil burning and aerosol spray cans", "money spent on coils and aerosol", { at: "gastas en espirales" }),
    C("mq_fumigator_yard", "pest control technician fogging yard", "the exterminator who keeps coming back", { at: "llamas al fumigador" }),
  ]},
  // ░░ 7) EL PRINCIPIO — ciclo de vida ░░
  { a: "el mosquito que te pica no vino del campo", beats: [
    C("mq_female_blood_macro", "female mosquito engorged with blood macro", "only the female bites, for her eggs", { at: "necesita tu sangre" }),
    X({ kind: "diagram", at: "los pone en agua quieta", eyebrow: "El mosquito SOLO nace en agua quieta", slides: [{ image: dg("dg_mq_ciclo", "Diagrama del ciclo de vida del mosquito en 4 etapas sobre la superficie de un charco: 1) huevos flotando en balsa, 2) larva colgando de la superficie con un tubito de respirar, 3) pupa enroscada, 4) mosquito adulto saliendo y volando. Flechas circulares uniendo las etapas. Etiqueta grande 'todo empieza en un dedo de agua quieta' y 'de huevo a mosquito en 7 dias'."), eyebrow: "De huevo a mosquito en 7 días" }] }),
    C("mq_female_laying_water", "female mosquito laying eggs on water surface macro", "the female laying her eggs on still water", { at: "los pone en agua quieta" }),
    C("mq_bottle_cap_water", "rainwater collected in a bottle cap", "a bottle cap of water is enough", { at: "la tapita de una botella" }),
    C("mq_pot_saucer_water", "water in plant pot saucer dish", "the saucer under the flowerpot", { at: "el platito de abajo de la maceta" }),
    C("mq_dog_bowl_stale", "dog water bowl stale outdoors", "the pet bowl you have not changed", { at: "bebedero del perro" }),
    X({ kind: "diagram", at: "arriba de la linea del agua", eyebrow: "Por qué vuelven después de vaciar", slides: [{ image: dg("dg_mq_huevos", "Diagrama de un recipiente en corte con agua: huevos de mosquito pegados a la pared SECA del recipiente, justo arriba de la linea del agua. Una lluvia hace subir el nivel del agua y los huevos eclosionan. Etiquetas 'huevos pegados sobre la linea del agua', 'aguantan secos meses', 'con la lluvia, nacen'."), eyebrow: "Los huevos secos esperan la lluvia" }] }),
    X({ kind: "bars", at: "iba a poner doscientos huevos mas", title: "Matar dónde rinde", bars: [{ label: "Matar un adulto que vuela", value: 1, display: "1", tone: "cold" }, { label: "Matar una larva en el agua", value: 200, display: "200", winner: true }] }),
  ]},
  // ░░ 8) LOS DOS MOSQUITOS ░░
  { a: "en tu casa no hay un mosquito", beats: [
    X({ kind: "diagram", at: "son distintos", eyebrow: "Tenés DOS mosquitos, y son distintos", slides: [{ image: dg("dg_mq_dos", "Diagrama comparativo de dos mosquitos lado a lado, dividido por una linea. IZQUIERDA: el comun de noche, gris, parado sobre agua sucia verdosa, con un icono de luna; etiqueta 'noche, agua sucia'. DERECHA: el del dengue, oscuro con rayas blancas en las patas, parado sobre agua limpia en un florero, con un icono de sol; etiqueta 'de dia, agua LIMPIA, cerca de la casa'. Titulo arriba 'no es el mismo'."), eyebrow: "El de noche (agua sucia) y el del dengue (agua limpia)" }] }),
    C("mq_culex_on_wall", "common house mosquito resting on wall night", "the common night mosquito", { at: "el de la noche" }),
    C("mq_aedes_stripes_macro", "aedes aegypti white striped legs macro", "the dengue mosquito, striped legs", { at: "rayas blancas en las patas" }),
    I("mq_clean_vase_water", "clear clean water in a glass flower vase", "it breeds in clean water near the house", { at: "cria en agua limpia" }),
  ]},
  // ░░ 9) REGLA #1 (texto puro, va en OVL) ░░
  { a: "no pelees con el mosquito que vuela", beats: [
    C("mq_still_water_calm", "perfectly still stagnant water reflection", "still water is where they are born", { at: "seca el agua donde nace" }),
  ]},
  // ░░ 10) MÉTODO 1 — la ronda del agua ░░
  { a: "le llamo la ronda del agua", beats: [
    C("mq_tipping_bucket", "person tipping over bucket emptying water yard", "tipping out everything that holds water", { at: "dar vuelta o vaciar" }),
    C("mq_scrub_bucket_brush", "scrubbing inside of a bucket with a brush", "scrubbing the walls to remove stuck eggs", { at: "restrega las paredes" }),
    I("mq_saucers_emptied", "empty plant saucers stacked dry", "saucers emptied and dried", { at: "vacialos y restrega" }),
  ]},
  // ░░ 11) CRIADEROS ESCONDIDOS ░░
  { a: "hay criaderos que casi nadie revisa", beats: [
    X({ kind: "checklist", at: "presta atencion a esta lista", title: "Criaderos escondidos", items: [{ text: "Canaleta del techo tapada", state: "todo" }, { text: "Bandeja del aire acondicionado", state: "todo" }, { text: "Lonas, cubiertas y neumáticos", state: "todo" }, { text: "Rejillas y desagües tapados", state: "todo" }, { text: "Caños huecos de la reja", state: "todo" }] }),
    I("mq_yard_breeders", "messy backyard with buckets tires containers", "a yard full of hidden breeding spots", { at: "seguro tenes varios" }),
    C("mq_clogged_gutter", "clogged roof gutter full of leaves standing water", "the clogged gutter, breeder number one", { at: "la canaleta del techo tapada" }),
    C("mq_ac_drip_tray", "air conditioner unit dripping water outdoors", "the AC drip tray", { at: "el aire acondicionado" }),
    C("mq_old_tires_water", "old stacked tires holding rainwater", "old tires full of water", { at: "los neumaticos viejos" }),
    C("mq_tarp_puddle", "wrinkled tarp cover holding rainwater pool", "tarps that form pools", { at: "las lonas y las cubiertas" }),
    C("mq_hollow_fence_pipe", "hollow metal fence post open top", "hollow gate pipes fill with water inside", { at: "los canos huecos" }),
  ]},
  // ░░ 12) MÉTODO 2 — el larvicida ░░
  { a: "va el metodo 2", beats: [
    C("mq_oil_film_spread", "drop of oil spreading film on water surface", "a thin film of oil over the water", { at: "una pelicula finita" }),
    X({ kind: "diagram", at: "como un snorkel", eyebrow: "Por qué la larva se ahoga", slides: [{ image: dg("dg_mq_snorkel", "Diagrama en corte de la superficie del agua: una larva de mosquito colgando boca abajo justo bajo la superficie, sacando su tubo respiratorio como un snorkel hacia el aire. Una pelicula de aceite cubre la superficie y bloquea el tubo. Etiquetas 'la larva respira aire en la superficie', 'el aceite le tapa el tubo', 'se ahoga en horas'."), eyebrow: "El aceite le tapa el tubo de respirar" }] }),
    I("mq_bti_dunk", "mosquito dunk bti briquette larvicide", "a Bti dunk, a biological larvicide", { at: "se llama bti" }),
    C("mq_municipal_fogging_pond", "treating a pond standing water larvicide", "what the towns use to treat the water", { at: "usan los municipios" }),
  ]},
  // ░░ 13) INJERTO 1 ░░
  { a: "las cantidades exactas", beats: [
    X({ kind: "diagram", at: "un manual que arme", eyebrow: "Las dosis exactas, anotadas", slides: [{ image: dg("dg_mq_manual", "Lamina de un manual o cuaderno abierto sobre una mesa con recetas de arreglos caseros, dosis y medidas escritas, una regla y un lapiz al lado, estilo archivo artesanal. Transmite que esta todo ordenado con las cantidades justas. Sin texto legible."), eyebrow: "El Manual de Reparaciones Caseras" }] }),
    I("mq_notebook_doses", "handwritten notebook with measurements and pencil", "the exact doses written down", { at: "le erre a las dosis" }),
  ]},
  // ░░ 14) MÉTODO 3 — la trampa del balde ░░
  { a: "la trampa del balde", beats: [
    X({ kind: "diagram", at: "un lugar irresistible", eyebrow: "Convertí el rincón en una trampa", slides: [{ image: dg("dg_mq_trampa", "Diagrama de la trampa del balde: un balde oscuro con agua y pasto cortado pudriendose adentro, en un rincon con sombra. Flechas de hembras de mosquito viniendo de todo el patio, atraidas por el olor a estancado. Adentro del balde, gotas de larvicida. Etiquetas 'el olor a estancado las atrae', 'ponen los huevos aca', 'el larvicida mata todas las larvas'."), eyebrow: "Las atraés a TU balde y ahí mueren" }] }),
    C("mq_black_bucket_shade", "black bucket of water in shaded garden corner", "a dark bucket in the shade", { at: "mejor si es oscuro o negro" }),
    C("mq_grass_in_water", "grass clippings rotting in bucket water", "grass clippings fermenting in the water", { at: "un punado de pasto cortado" }),
  ]},
  // ░░ 15) PARA ESTA NOCHE ░░
  { a: "para la zona donde te sentas", beats: [
    C("mq_fan_on_patio", "electric fan on outdoor table patio", "a fan on the patio keeps them off", { at: "un ventilador" }),
    C("mq_long_sleeves_evening", "person in light long sleeves garden evening", "light long sleeves at dusk", { at: "ropa de manga larga y clara" }),
    C("mq_window_screen_mesh", "window mosquito screen mesh installation", "a screen on the windows", { at: "pone mosquitero" }),
  ]},
  // ░░ 16) EL ERROR ░░
  { a: "el error es atacar solamente", beats: [
    C("mq_spraying_aerosol", "spraying aerosol insecticide indoors night", "spraying the adults, the wrong target", { at: "agarras el aerosol" }),
    X({ kind: "diagram", at: "vaciar un bote que tiene un agujero", eyebrow: "El error que arruina todo", slides: [{ image: dg("dg_mq_bote", "Diagrama metafora claro: una persona sacando agua de un bote con un balde, mientras el bote tiene un agujero abajo por donde sigue entrando agua. Al lado, el paralelo: una mano matando mosquitos adultos con aerosol mientras un charco de agua sigue lleno de larvas. Etiquetas 'sacas agua sin tapar el agujero', 'matas adultos sin tocar el agua', 'nunca termina'."), eyebrow: "Matar adultos sin tocar el agua = no terminás nunca" }] }),
    C("mq_fumigator_returns", "pest control worker spraying garden", "the exterminator returns every month", { at: "vuelve el mes que viene" }),
  ]},
  // ░░ 17) LÍMITES ░░
  { a: "un par de honestidades", beats: [
    C("mq_repellent_arm", "applying mosquito repellent spray on arm", "repellent on skin, a patch not a fix", { at: "el repelente en la piel" }),
    I("mq_citronella_candle", "citronella candle and plant outdoors", "citronella barely works", { at: "la citronela" }),
    C("mq_fence_two_yards", "fence dividing two suburban backyards", "the neighbor's water crosses to you too", { at: "el vecino tiene su propia fabrica" }),
  ]},
  // ░░ 18) INJERTO 2 ░░
  { a: "cuando arme el manual", beats: [
    G("mq_tomas_pausa", { kicker: "Nadie te lo enseña" }),
    X({ kind: "chips", at: "le conviene que ataques", title: "Por qué nadie te lo enseña", chips: ["Al negocio del aerosol", "y del fumigador", "le conviene que ataques el aire"], hue: "red", imageDarken: 0.6, _bg: { name: "mq_store_shelf", query: "supermarket shelf full of insecticide sprays", concept: "a store shelf full of insecticide sprays" }, image: "real/mq_store_shelf.png" }),
    X({ kind: "splitlist", at: "lo dividi justo asi", title: "Los 40 arreglos, divididos así", items: ["Madera y metal que no mueren", "Plagas por centavos", "Goteras, humedad y moho", "Arreglos del hogar y el auto"], palette: "A" }),
  ]},
  // ░░ 19) RECAP ░░
  { a: "recapitulemos", beats: [
    X({ kind: "checklist", at: "recapitulemos", title: "El plan contra el mosquito", items: [{ text: "La ronda del agua cada semana", state: "done" }, { text: "Revisar los criaderos escondidos", state: "done" }, { text: "Larvicida de $2 en el agua que queda", state: "done" }, { text: "La trampa del balde en los rincones", state: "done" }, { text: "Ventilador y mosquitero para hoy", state: "done" }] }),
    I("mq_clean_patio_family", "family enjoying clean backyard patio summer evening", "your patio back, your summer nights back", { at: "recuperar tu patio" }),
  ]},
  // ░░ 20) INJERTO 3 + CIERRE ░░
  { a: "la casa entera esta llena de estos", beats: [
    X({ kind: "diagram", at: "el manual de reparaciones caseras", eyebrow: "Los 40, ordenados y probados", slides: [{ image: dg("dg_mq_stack", "Lamina tipo coleccion de valor artesanal: un manual ilustrado con 40 arreglos caseros (madera, oxido, plagas, goteras) con planos y medidas, apilado como una pila de valor. Estilo archivo, sin precios ni texto legible."), eyebrow: "Con las dosis y las medidas exactas" }] }),
    I("mq_manual_phone", "phone showing a home repair manual on table", "the manual on your phone", { at: "ordenado el dia que lo necesites" }),
    C("mq_empty_round_yard", "person walking yard emptying water containers", "go do it today: empty everything", { at: "da una vuelta al patio" }),
  ]},
  // ░░ 21) PRÓXIMO ░░
  { a: "en el proximo video", beats: [
    C("mq_ceiling_water_stain", "brown water stain on ceiling from leak", "next: the ceiling leak that always comes back", { at: "esa mancha de humedad en el techo" }),
    C("mq_old_bricklayer_roof", "old bricklayer working on a roof", "the trick of the sixty-year-old bricklayer", { at: "un albanil de sesenta anos" }),
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
  { kind: "oxquote", at: "nacio en tu casa", dur: 5.0, quote: "El mosquito que lo picó no vino de afuera. *Nació en tu casa*.", image: "real/mq_doctor.png", attribution: "Lo que me dijo el médico", side: "right", accent: "red" },
  // ── PRINCIPIO ──
  { kind: "oxstat", at: "doscientos huevos por vez", dur: 4.2, value: 200, label: "huevos por vez, tanda tras tanda, toda su vida", glyph: "🥚", accent: "red" },
  { kind: "oxstat", at: "siete dias nada mas", dur: 4.0, value: 7, suffix: " días", label: "de un dedo de agua a una nube de mosquitos", glyph: "🦟", accent: "red" },
  // ── DOS MOSQUITOS ──
  { kind: "oxtag", at: "pica de dia", dur: 4.2, name: "El del dengue", what: "Rayas blancas, pica de día, agua limpia", side: "right", accent: "red" },
  // ── REGLA #1 ──
  { kind: "oxrule", at: "seca el agua donde nace", dur: 4.6, text: "No pelees con el que *vuela*. Secá el *agua* donde nace.", accent: "amber" },
  // ── MÉTODO 1 ──
  { kind: "oxmethod", at: "le llamo la ronda del agua", dur: 4.6, num: "01", title: "La ronda del agua", chips: ["Vaciar", "Refregar", "Cada semana"], cost: "gratis", accent: "amber" },
  { kind: "oxstat", at: "el ciclo del mosquito es de siete dias", dur: 4.0, value: 7, suffix: " días", label: "cortá el agua cada semana y matás el ciclo", glyph: "📅", accent: "amber" },
  // ── CRIADEROS ──
  { kind: "oxnote", at: "seguro tenes varios", dur: 5.4, image: "real/mq_yard_breeders.png", title: "Dónde se esconden", notes: [{ x: 22, y: 40, lx: 6, ly: 22, text: "Canaleta tapada" }, { x: 55, y: 60, lx: 80, ly: 32, text: "Neumáticos y lonas" }, { x: 40, y: 78, lx: 64, ly: 90, text: "Platos y baldes" }], accent: "red" },
  // ── MÉTODO 2 ──
  { kind: "oxmethod", at: "va el metodo 2", dur: 4.4, num: "02", title: "El larvicida de $2", chips: ["Aceite", "o Bti", "en el agua"], cost: "centavos", accent: "blue" },
  { kind: "oxside", at: "no le hace absolutamente nada", dur: 5.2, image: "real/mq_bti_dunk.png", title: "El Bti", lines: ["Bacteria que solo mata larvas", "Inofensivo para peces, mascotas y chicos", "Lo que usan los municipios"], side: "right", accent: "blue" },
  { kind: "oxstat", at: "durante treinta dias", dur: 4.0, value: 30, suffix: " días", label: "un pedacito mata larvas por un mes entero", glyph: "🛡️", accent: "blue" },
  // ── MÉTODO 3 ──
  { kind: "oxmethod", at: "agarra un balde", dur: 4.6, num: "03", title: "La trampa del balde", chips: ["Balde oscuro", "Pasto / hojas", "Larvicida"], cost: "$2", accent: "amber" },
  { kind: "oxstat", at: "doscientos mosquitos que no nacen", dur: 4.0, value: 200, label: "mosquitos menos por cada hembra que cae en la trampa", glyph: "🪤", accent: "amber" },
  // ── ESTA NOCHE ──
  { kind: "oxtag", at: "un volador pesimo", dur: 4.0, name: "El ventilador", what: "Una brisa floja y no pueden acercarse", side: "left", accent: "green" },
  // ── ERROR ──
  { kind: "oxrule", at: "no mates mosquitos", dur: 4.6, text: "No mates mosquitos. Matá *criaderos*.", accent: "red" },
  // ── CIERRE ──
  { kind: "oxbefore", at: "da una vuelta al patio", dur: 4.4, before: "real/mq_yard_breeders.png", after: "real/mq_clean_patio_family.png", accent: "green" },
  { kind: "oxquote", at: "el link esta abajo", dur: 5.0, quote: "Cuesta menos que dos visitas del fumigador. El link está *abajo*.", image: "real/mq_manual_phone.png", attribution: "Igual, hacé lo de hoy", side: "right", accent: "green" },
];
let nOv = 0;
for (const o of OVL) { const s = atc(o.at); if (s == null) continue; const { kind, at: _a, dur = 4.2, ...props } = o; beats.push({ id: `ov_${kind}_${Math.round(s)}`, start: +s.toFixed(2), dur, kind, overlay: true, hue: "amber", ...props }); nOv++; }
beats.sort((a, b) => a.start - b.start);

// ── FILL — imágenes ancladas extra para DENSIFICAR (pacing óxido ~6-8s). fetch_bing. ──
const FILL = [
  ["mq_dengue_rash", "dengue rash on skin arm", "the rash of dengue", "del que te hace sangrar"],
  ["mq_mosquito_fingertip", "tiny mosquito on a fingertip", "a tiny insect, nothing", "un bicho de nada"],
  ["mq_mosquito_swarm_dusk", "swarm of mosquitoes at dusk", "more than all the wars", "mata mas gente"],
  ["mq_flashlight_yard_night", "searching backyard with flashlight night", "looking for the source at night", "fuimos al fondo"],
  ["mq_sunset_backyard", "backyard patio at sunset summer", "when evening falls", "cuando cae la tarde"],
  ["mq_waving_hand_face", "person waving hand at mosquitoes face", "waving the air", "manoteando el aire"],
  ["mq_repellent_gadgets", "mosquito repellent bracelets gadgets", "useless bracelets and gadgets", "pulseras y aparatitos"],
  ["mq_larvae_surface_dots", "mosquito larvae dots rising in water", "the dots rising and sinking", "suben y bajan"],
  ["mq_pouring_into_bucket", "pouring liquid into bucket of water", "I put something in the bucket", "le puse algo"],
  ["mq_summer_night_family", "family outdoors summer night yard", "the summer nights with family", "noches de verano"],
  ["mq_kid_scratching_legs", "child scratching itchy legs bites", "scratching until it hurts", "rascandose hasta lastimarse"],
  ["mq_swamp_marsh", "distant marsh swamp landscape", "not from a far swamp", "un pantano lejano"],
  ["mq_plugin_tablets", "mosquito plugin repellent tablets", "tablets and plugins", "en tabletas"],
  ["mq_aerosol_room_spray", "spraying aerosol insecticide indoor room", "filling the house with poison", "respirando vos y tus hijos"],
  ["mq_money_invoice", "money cash bills invoice hand", "charges you a fortune", "te cobra una fortuna"],
  ["mq_female_mosquito_macro", "female mosquito closeup macro proboscis", "only the female bites", "solo la hembra pica"],
  ["mq_mosquito_on_flower", "mosquito feeding on flower nectar", "the male eats nectar", "come nectar de las flores"],
  ["mq_calendar_days", "calendar marking days red", "every few days", "cada pocos dias"],
  ["mq_tarp_wrinkled_water", "wrinkled plastic tarp holding rainwater", "a wrinkled tarp", "una lona arrugada"],
  ["mq_discarded_bottle", "discarded plastic bottle in grass water", "a thrown bottle", "una botella tirada"],
  ["mq_mosquitos_emerging", "mosquitoes emerging from water surface", "dozens fly out", "salen volando decenas"],
  ["mq_rain_filling_container", "rain filling outdoor container water", "the day it rains", "el dia que llueve"],
  ["mq_container_refilled", "container full of water again after rain", "full again", "esta lleno otra vez"],
  ["mq_mosquito_ear_night", "mosquito near ear in the dark", "the one buzzing in your ear", "zumba en tu oreja"],
  ["mq_dirty_ditch", "dirty stagnant ditch water", "the ditch, dirty water", "la zanja"],
  ["mq_green_barrel_water", "green stagnant water in barrel", "the green water in a drum", "el agua verde del tacho"],
  ["mq_flower_vase_clean", "clean water in flower vase indoor", "the vase, clean water", "el florero"],
  ["mq_water_near_door", "water container next to house door", "right next to your door", "al lado de tu puerta"],
  ["mq_weekly_calendar_check", "weekly calendar reminder check", "once a week", "una vez por semana"],
  ["mq_cloth_brush_clean", "cleaning container with cloth and brush", "with a cloth or a brush", "con un trapo o un cepillo"],
  ["mq_eggs_on_wall", "mosquito eggs stuck on container wall macro", "the eggs stuck to the wall", "los huevos que quedaron pegados"],
  ["mq_bromeliad_water", "bromeliad plant holding water center", "plants that hold water", "las plantas que juntan agua"],
  ["mq_yard_drain_grate", "backyard drain grate with water", "the yard drain", "la rejilla del patio"],
  ["mq_bathroom_floor_drain", "bathroom floor drain unused water", "the unused bathroom drain", "la rejilla del bano"],
  ["mq_water_tank_open", "open water tank no lid outdoors", "a tank with no lid", "el tanque de agua sin tapa"],
  ["mq_cooking_oil_bottle", "bottle of cooking oil kitchen", "any oil works", "cualquier aceite sirve"],
  ["mq_dish_soap_drops", "drops of dish soap detergent", "or detergent", "o de detergente"],
  ["mq_dead_larvae_oil", "dead mosquito larvae on oily water", "drowned in hours", "se ahoga en pocas horas"],
  ["mq_garden_store_shelf", "garden store farm supply shelf products", "in any garden store", "en un vivero"],
  ["mq_fish_pond_safe", "goldfish in a garden pond", "harmless to fish", "no le hace nada a los peces"],
  ["mq_pets_dog_cat", "dog and cat at home pets", "to your dog, your cat", "a tu perro a tu gato"],
  ["mq_park_pond", "city park pond public", "what towns use in the squares", "en las plazas"],
  ["mq_shady_corner", "shady quiet corner of a garden", "a quiet shaded corner", "un rincon tranquilo"],
  ["mq_dry_leaves_hand", "handful of dry leaves", "some dry leaves", "unas hojas secas"],
  ["mq_murky_green_water", "murky green stagnant water closeup", "the smell of stagnant water", "olor a estancado"],
  ["mq_buckets_in_corners", "buckets placed in garden corners", "two or three buckets", "dos o tres baldes"],
  ["mq_ankle_bites", "mosquito bites on ankles closeup", "they bite the ankles", "en los tobillos"],
  ["mq_tall_grass_yard", "tall overgrown grass in yard", "the long grass", "en el pasto largo"],
  ["mq_coil_smoke", "mosquito coil burning smoke closeup", "you light the coil", "prendes el espiral"],
  ["mq_fogging_plants", "fogging insecticide over garden plants", "sprays the plants", "rocia las plantas"],
  ["mq_paying_again", "handing money paying again", "charges you again", "te cobra de nuevo"],
  ["mq_bug_zapper", "electric bug zapper light night", "the electric zapper lamps", "las lamparas electricas"],
  ["mq_neighbor_wall", "wall between two backyards", "the other side of the wall", "del otro lado del muro"],
  ["mq_neighborhood_block", "aerial view suburban neighborhood block", "the whole block", "toda la cuadra"],
  ["mq_summer_relaxed", "person relaxing summer evening patio calm", "your summer nights back", "tus noches de verano"],
  ["mq_holding_bucket", "person holding a bucket in the yard", "grab a bucket", "agarra un balde"],
];
const FILL2 = [
  ["mq_enjoy_patio_free", "person relaxing patio evening no bugs", "outside without being eaten", "estar afuera sin que te coman"],
  ["mq_bucket_full_larvae", "bucket of water full of mosquito larvae", "hundreds caught in one bucket", "en un solo balde a cientos"],
  ["mq_mosquitos_back", "mosquitoes swarming back at dusk", "back as if nothing happened", "estan de vuelta como si nada"],
  ["mq_wasted_summer_money", "crumpled receipts wasted money", "you spend the whole summer", "gastas todo el verano"],
  ["mq_stagnant_pool", "small stagnant water pool ground", "needs standing water to be born", "agua estancada para nacer"],
  ["mq_egg_cluster_macro", "mosquito egg cluster on water macro", "200 eggs at a time", "doscientos huevos por vez"],
  ["mq_kids_pool_water", "kids inflatable pool stagnant water", "the kids paddling pool", "la pileta de lona de los chicos"],
  ["mq_forgotten_bucket", "forgotten bucket of rainwater in corner", "a forgotten bucket", "un balde olvidado"],
  ["mq_mosquito_cloud_air", "cloud of mosquitoes swarming in air", "appear out of nowhere", "aparecen de la nada"],
  ["mq_eggs_waiting_rain", "dry mosquito eggs waiting on surface", "stuck there waiting for water", "pegados esperando el agua"],
  ["mq_chasing_mosquito", "frustrated person chasing a mosquito", "chasing the one that flies", "correr atras de ellos"],
  ["mq_treating_water_source", "treating a source of standing water", "attack the water instead", "atacar el agua"],
  ["mq_new_clean_bucket", "new clean bucket with clear water", "the new bucket, clean water", "el balde nuevo"],
  ["mq_still_water_suspect", "still clear water in a container", "all still water is suspect", "toda agua quieta es sospechosa"],
  ["mq_weekly_yard_check", "person checking backyard weekly", "once a week, not once a month", "una vez por semana y no una vez por mes"],
  ["mq_dumping_water", "dumping water out of a container yard", "if you only dump the water", "si solo tiras el agua"],
  ["mq_gutter_breeding_water", "roof gutter clogged breeding water", "it breeds thousands", "cria miles"],
  ["mq_hollow_posts_open", "hollow metal fence posts open top", "the open hollow pipe posts", "los postes de cano que estan abiertos"],
  ["mq_inside_metal_pipe", "water inside a hollow metal pipe", "breeding inside the metal", "adentro del fierro"],
  ["mq_drill_hole_pipe", "drilling a small drainage hole in pipe", "make a little hole to drain", "haceles un agujerito"],
  ["mq_larva_breathing", "mosquito larva breathing tube at surface", "the larva lives in water breathes air", "la larva del mosquito vive en el"],
  ["mq_oil_thinning", "oil film thinning evaporating on water", "the oil lasts only days", "el aceite dura poco"],
  ["mq_bti_powder_granules", "bti granular larvicide powder", "in tablets or powder", "en pastillas o en polvo"],
  ["mq_child_dog_safe", "child and dog safe in garden", "to the kids, to the plants", "a los chicos ni a las plantas"],
  ["mq_bti_into_tank", "dropping larvicide tablet into water tank", "a piece in the tank", "tiras un pedacito de pastilla"],
  ["mq_cistern_well_water", "cistern well of water stored", "the tank, the cistern", "en el tanque en el aljibe"],
  ["mq_aerosol_vs_cheap", "expensive aerosol can vs cheap option", "a fraction of one aerosol can", "cuesta una fraccion"],
  ["mq_start_today_yard", "person starting to clean yard today", "you start clearing mosquitoes now", "ya empezas a sacar mosquitos"],
  ["mq_female_seeking", "female mosquito seeking water to lay", "a female looking where to lay", "una hembra que anda buscando"],
  ["mq_rotting_matter_water", "rotting organic matter in murky water", "the smell of rotting matter", "olor a materia pudriendose"],
  ["mq_refill_larvicide", "adding larvicide to a bucket of water", "refill the larvicide every two weeks", "reponeles el larvicida cada dos semanas"],
  ["mq_trap_system_yard", "several bucket traps placed around yard", "a mosquito control system", "un sistema de control de mosquitos"],
  ["mq_door_gap_screen", "screen mesh on a door to block bugs", "the door where they sneak in", "la puerta por donde se cuelan"],
  ["mq_spraying_corners", "spraying insecticide into corners", "the corners with strong poison", "los rincones con un veneno fuerte"],
  ["mq_water_still_yard", "standing water remaining in a yard", "but the water is still there", "pero el agua sigue"],
  ["mq_paying_forever", "person paying bills again and again", "you keep paying forever", "seguis pagando para siempre"],
  ["mq_repellent_outing", "applying repellent before going outside", "an outing, a walk", "una salida una caminata"],
  ["mq_mosquito_crossing", "mosquito flying across between yards", "they fly 100, 200 meters", "vuelan 100 200 metros"],
  ["mq_cheap_simple_items", "simple cheap household items on table", "none of these tricks is expensive", "ninguno de estos trucos es caro"],
];
for (const [name, query, concept, ph] of [...FILL, ...FILL2]) { const s = atc(ph); if (s == null) continue; beats.push({ id: name, start: +s.toFixed(2), dur: 4, kind: "raw", src: `broll/${name}.mp4`, darken: 0, hue: HUES[Math.round(s) % 3] }); addM(name, query, concept); addB(name, query, concept); }
beats.sort((a, b) => a.start - b.start);

// ── STRUCT — formatos estructurados inline (gate de variedad: ≥6 tipos, ≥6% peso) ──
const STRUCT = [
  { kind: "bars", at: "es el negocio", hue: "red", title: "Lo que gastás cada verano", bars: [{ label: "Espirales, aerosol, repelente", value: 100, display: "$$$", tone: "danger" }, { label: "Fumigador (vuelve cada mes)", value: 80, display: "$$$" }, { label: "Cortar el agua vos mismo", value: 5, display: "$2", winner: true }] },
  { kind: "callout", at: "transmite el dengue", figure: "Dengue", caption: "El mosquito que nace en tu patio es el que lo transmite.", accent: "danger", image: "real/mq_dengue_rash.png" },
  { kind: "callout", at: "mas de mil mosquitos", figure: "+1.000", caption: "Lo que deja una sola hembra en su vida.", accent: "danger", image: "real/mq_egg_cluster_macro.png" },
  { kind: "process", at: "se hace asi", hue: "amber", title: "La trampa del balde", eyebrow: "Tres pasos", steps: [{ title: "Balde oscuro", desc: "con agua, en un rincón con sombra" }, { title: "Pasto y hojas", desc: "el agua se pudre y atrae a las hembras" }, { title: "Larvicida", desc: "Bti o aceite: todas las larvas mueren" }] },
  { kind: "aged", at: "la regla numero uno", hue: "amber", heading: "REGLA NÚMERO UNO", eyebrow: "Aunque te olvides de todo lo demás", lines: ["No pelees con el mosquito que vuela", "Secá el agua donde nace", { text: "Matás una larva = 200 mosquitos menos", mark: true }] },
  { kind: "callout", at: "en una semana", figure: "7 días", caption: "De un dedo de agua a una nube de mosquitos.", accent: "danger", image: "real/mq_mosquitos_emerging.png" },
  { kind: "callout", at: "la poblacion a la mitad", figure: "−50%", caption: "Solo con la ronda del agua, una vez por semana.", accent: "good", image: "real/mq_saucers_emptied.png" },
  { kind: "callout", at: "vuelan 100 200 metros", figure: "100 m", caption: "Lo que vuela un mosquito: tu vecino también te pica.", accent: "amber", image: "real/mq_mosquito_crossing.png" },
];
for (const s of STRUCT) { const t = atc(s.at); if (t == null) continue; const { kind, at: _a, image, ...props } = s; if (image) { const nm = image.replace(/^real\//, "").replace(/\.png$/, ""); } const beat = { id: `cmp_${kind}_st_${Math.round(t)}`, start: +t.toFixed(2), dur: 6.5, kind, hue: s.hue || "blue", ...props, ...(image ? { image } : {}) }; if (kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l)); beats.push(beat); }
beats.sort((a, b) => a.start - b.start);

// ── recálculo GLOBAL de duraciones de beats raw (densificado): cada uno hasta el próximo ──
{ const ord = beats.filter((b) => !b.overlay).sort((a, b) => a.start - b.start);
  for (let i = 0; i < ord.length; i++) { const b = ord[i]; if (b.kind !== "raw") continue; const next = i + 1 < ord.length ? ord[i + 1].start : TOTAL; b.dur = +Math.max(1.5, Math.min(next - b.start + OV, 9)).toFixed(2); } }

fs.mkdirSync("public/broll", { recursive: true }); fs.mkdirSync("public/real", { recursive: true }); fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(MATCH, null, 2));
fs.writeFileSync(`public/real/bing_${SLUG}.json`, JSON.stringify(BING, null, 2));
fs.writeFileSync(`public/img/prompts_${SLUG}_diag.json`, JSON.stringify(DIAGRAMS, null, 2));
if (MODE === "match") { console.log(`=== build_oxido MATCH ===`); console.log(`match ${MATCH.length} · bing ${BING.length} · diag ${DIAGRAMS.length} · proxy ${(2 * MATCH.length / 6).toFixed(0)}/IP`); process.exit(0); }
const haveClip = (n) => fs.existsSync(`public/broll/${n}.mp4`);
const haveReal = (n) => fs.existsSync(`public/real/${n}.png`) || fs.existsSync(`public/real/${n}.jpg`);
const haveImg = (n) => fs.existsSync(`public/img/${n}.png`);
let nClip = 0, nReal = 0, nImg = 0, nMiss = 0; const miss = [];
for (const b of beats) { if (b.kind !== "raw") continue; if (b.src.startsWith("broll/")) { if (haveClip(b.id)) nClip++; else if (haveReal(b.id)) { b.src = `real/${b.id}.png`; nReal++; } else { nMiss++; miss.push(b.id); } } else if (b.src.startsWith("real/")) { if (haveReal(b.id)) { if (!fs.existsSync(`public/real/${b.id}.png`) && fs.existsSync(`public/real/${b.id}.jpg`)) b.src = `real/${b.id}.jpg`; nReal++; } else { nMiss++; miss.push(b.id); } } else if (b.src.startsWith("img/")) { if (haveImg(b.id)) nImg++; else { nMiss++; miss.push(b.id); } } }
// SEGURIDAD: dropear beats raw cuyo asset no existe (evita 404 en el farm). Solo afecta relleno faltante.
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
// cobertura por beats raw (cada beat cubre [start, start+dur]); en huecos SIN clip el avatar va FULL (nunca negro)
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
