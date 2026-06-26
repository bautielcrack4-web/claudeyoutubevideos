// build_gotera.mjs — CLIPS-FIRST HÍBRIDO (Constructor Libre, "Tapá La Gotera Para Siempre — El Truco Del Albañil").
// Avatar Tomás + b-roll dominante REAL: clips YouTube (matchfarm proxies) + cientos de imágenes
// web (fetch_bing). AI solo diagramas. Queries ANALIZADAS del guion (específicas, EN inglés,
// ancladas al tema) — no random. Pacing ~4-5s (denso). REGLA #0: cada beat al ms exacto.
// Modos:  node build_gotera.mjs match  |  node build_gotera.mjs
import fs from "fs";

const SLUG = "gotera";
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
  // ░░ 1) COLD OPEN — el techo que se vino abajo ░░
  { a: "una noche de tormenta", start: 0, beats: [
    C("gt_storm_night_house", "heavy rain storm on house roof night", "a stormy night on the roof", { at: "una noche de tormenta" }),
    C("gt_ceiling_collapse", "collapsed ceiling debris on floor water damage", "a ceiling that came down", { at: "se vino abajo" }),
    C("gt_kitchen_table", "empty kitchen table family home", "the table where we had just eaten", { at: "sobre la mesa" }),
    I("gt_ceiling_stain_brown", "brown water stain on ceiling", "the little brown stain everyone ignored", { at: "una manchita marron" }),
    C("gt_painting_over_stain", "painting over ceiling stain roller", "painting over it to hide it", { at: "alguien pintaba" }),
    C("gt_rotten_beam", "rotten wooden roof beam water damage", "the beam rotted from the inside", { at: "le pudrio la viga" }),
    C("gt_old_bricklayer", "old mason bricklayer working trowel", "the sixty-year-old bricklayer who taught me", { at: "un albanil de sesenta" }),
  ]},
  // ░░ 2) CONFIRMACIÓN ░░
  { a: "si entraste a este video", beats: [
    I("gt_ceiling_leak_drip", "water dripping from ceiling leak", "the leak that drives you crazy", { at: "una gotera que te esta volviendo loco" }),
    C("gt_bucket_under_leak", "bucket catching roof leak indoors floor", "the bucket in the same spot every time", { at: "el balde que pones" }),
    C("gt_peeling_paint_ceiling", "paint peeling blistering on ceiling damp", "the paint that blisters and falls", { at: "la pintura que se ampolla" }),
    C("gt_sealing_roof_crack", "applying sealant on roof crack hand", "you already sealed it and it came back", { at: "le tiraste sellador" }),
  ]},
  // ░░ 3) EL SECRETO — no esta donde la ves ░░
  { a: "el secreto mas importante de todos", beats: [
    C("gt_water_running_roof", "water running across sloped roof surface", "water enters one place, appears in another", { at: "entra por un lado y aparece por otro" }),
    C("gt_patching_wrong_spot", "patching ceiling stain spot indoors", "patching the stain, the wrong spot", { at: "estuviste arreglando el lugar equivocado" }),
  ]},
  // ░░ 4) SOY TOMÁS ░░
  { a: "soy tomas", full: true, beats: [] },
  // ░░ 5) STAKES ░░
  { a: "lo que una gotera te esta costando", beats: [
    C("gt_wet_plaster_wall", "wet damaged plaster wall water stain", "water soaking the wall and structure", { at: "moja el reboque" }),
    C("gt_mold_ceiling_corner", "black mold on ceiling corner damp", "humidity and mold you breathe", { at: "moho que te enferma" }),
    C("gt_rotten_roof_structure", "rotten roof timber structure decay", "a rotted beam is a roof that falls", { at: "se come la viga" }),
    I("gt_expensive_repair", "major roof structural repair workers", "a cheap stain becomes a costly repair", { at: "un arreglo de estructura" }),
    C("gt_waterproofing_company", "roofing company workers waterproofing roof", "the company that charges a fortune", { at: "le cobra una fortuna" }),
  ]},
  // ░░ 6) EL PRINCIPIO ░░
  { a: "encontrar de donde entra el agua de verdad", beats: [
    X({ kind: "diagram", at: "todo techo tiene una pendiente", eyebrow: "La gotera NUNCA está donde la ves", slides: [{ image: dg("dg_gt_pendiente", "Diagrama en corte de un techo inclinado: el agua entra por una grieta en la parte ALTA (punto A), corre por la pendiente del techo por debajo, y recien gotea para adentro varios metros mas abajo, manchando el cielo raso en el punto B. Flechas siguiendo el recorrido del agua. Etiquetas 'entra arriba (A)', 'corre por la pendiente', 'gotea lejos, la mancha (B)'."), eyebrow: "El agua entra arriba y gotea lejos" }] }),
    C("gt_water_trail_roof", "water trickling down underside of roof", "the water is lazy and sly, it travels", { at: "el agua es vaga" }),
    C("gt_drip_following_beam", "water droplet running along roof beam", "it runs along a beam until it drips", { at: "una viga, un tornillo" }),
  ]},
  // ░░ 7) ENCONTRAR LA ENTRADA — los sospechosos ░░
  { a: "el agua deja pistas", beats: [
    C("gt_man_inspecting_roof", "man inspecting roof looking for damage", "go up on a dry day and trace uphill", { at: "subi al techo" }),
    X({ kind: "diagram", at: "salen de las uniones", eyebrow: "Los 5 sospechosos de toda gotera", slides: [{ image: dg("dg_gt_sospechosos", "Diagrama de un techo mostrando los 5 puntos por donde entra el agua, numerados: 1) la babeta, union entre el techo y una pared que sube (chimenea/medianera); 2) los caños que atraviesan el techo (ventilacion); 3) una teja partida o corrida; 4) los tornillos de la chapa con su arandela de goma rajada; 5) la canaleta tapada que rebalsa. Cada uno con un numero y una flecha. Estilo lamina tecnica."), eyebrow: "Casi nunca pierde por el medio: pierde en las uniones" }] }),
    C("gt_roof_wall_flashing", "roof to wall junction flashing chimney", "the flashing, where 80% of water enters", { at: "la babeta" }),
    C("gt_vent_pipe_roof", "vent pipe through roof sealing", "the pipes that cross the roof", { at: "los canos que atraviesan" }),
    C("gt_cracked_roof_tile", "cracked broken roof tile", "a cracked or shifted tile", { at: "una teja partida" }),
    C("gt_metal_roof_screws", "metal roof screws rubber washers rusty", "the screws on a metal roof", { at: "los tornillos" }),
    C("gt_clogged_gutter_overflow", "clogged gutter overflowing water leaves", "the clogged gutter that backs up", { at: "la canaleta o el desague tapado" }),
    X({ kind: "diagram", at: "un truco de detective", eyebrow: "El truco de la manguera", slides: [{ image: dg("dg_gt_manguera", "Diagrama del truco de la manguera para encontrar una gotera: una persona ARRIBA en el techo mojando con una manguera por zonas, empezando de abajo hacia arriba; otra persona ADENTRO mirando la mancha del cielo raso. Cuando aparece la humedad, esa es la zona de entrada. Flechas y etiquetas 'moja de abajo hacia arriba, zona por zona', 'el de adentro avisa', 'donde aparece, ahi entra'."), eyebrow: "Encontrá la entrada sin romper nada" }] }),
  ]},
  // ░░ 8) TERRAZA / AZOTEA ░░
  { a: "si tu techo es una terraza plana", beats: [
    X({ kind: "diagram", at: "tres lugares que son los que mas fallan", eyebrow: "La terraza falla en 3 lugares", slides: [{ image: dg("dg_gt_terraza", "Diagrama de una terraza plana en vista con 3 puntos de falla marcados: 1) el desague/embudo, donde la membrana se despega del borde del cano; 2) el zocalo, el encuentro con el muro del parapeto, donde la membrana debe subir 20cm; 3) las ampollas/globos de la membrana. Ademas mostrar la pendiente minima hacia el desague y un charco donde no hay pendiente. Etiquetas claras."), eyebrow: "Desagüe, zócalo del parapeto y ampollas" }] }),
    C("gt_roof_drain_flat", "flat roof drain outlet water", "the drain, where the membrane lifts", { at: "el desague" }),
    C("gt_parapet_wall_flashing", "parapet wall flashing flat roof edge", "the parapet junction, must go up 20cm", { at: "el zocalo" }),
    C("gt_membrane_blister", "blister bubble in roof membrane asphalt", "blisters of trapped moisture", { at: "las ampollas" }),
    C("gt_ponding_water_roof", "ponding standing water on flat roof", "where water sits, the membrane fails", { at: "la pendiente" }),
  ]},
  // ░░ 9) EL ARREGLO — sandwich asfalto ░░
  { a: "viene el arreglo", beats: [
    C("gt_cleaning_roof_crack", "wire brushing cleaning roof surface crack", "clean and dry, or nothing sticks", { at: "limpia bien la zona" }),
    C("gt_v_groove_crack", "opening crack into v groove chisel concrete", "open the crack into a V so it grips", { at: "abre la grieta en forma" }),
    C("gt_hydraulic_cement", "fast setting hydraulic cement plug leak", "fast-set cement stops an active drip", { at: "cemento de frague rapido" }),
    C("gt_brushing_asphalt", "brushing liquid asphalt membrane on roof", "a coat of liquid asphalt", { at: "membrana liquida o asfalto" }),
    C("gt_geotextile_fabric", "embedding geotextile fabric in asphalt roof", "a fabric embedded between two coats", { at: "un pedazo de tela" }),
  ]},
  // ░░ 10) INJERTO 1 ░░
  { a: "las cantidades exactas", beats: [
    X({ kind: "diagram", at: "un manual que arme", eyebrow: "Las medidas exactas, anotadas", slides: [{ image: dg("dg_gt_manual", "Lamina de un manual o cuaderno abierto sobre una mesa de obra con recetas de arreglos caseros, dosis y medidas, una regla y un lapiz al lado, estilo archivo artesanal. Transmite que esta todo ordenado con las cantidades justas. Sin texto legible."), eyebrow: "El Manual de Reparaciones Caseras" }] }),
    I("gt_notebook_measures", "handwritten notebook measurements pencil", "the exact amounts written down", { at: "selle sin esperar" }),
  ]},
  // ░░ 11) EL TRUCO DE LA GOMA ░░
  { a: "la grieta que se raja", beats: [
    X({ kind: "diagram", at: "el techo se mueve", eyebrow: "Por qué el sellador rígido se raja", slides: [{ image: dg("dg_gt_goma", "Diagrama en dos partes. ARRIBA: una junta de techo que se dilata con el sol y se contrae con el frio; un sellador rigido de cemento se parte en la union (mostrar la grieta). ABAJO: un parche de goma de cubierta flexible sobre la misma junta, que estira y vuelve acompanando el movimiento, sin rajarse. Etiquetas 'el cemento rigido se parte', 'la goma flexible acompana el movimiento'."), eyebrow: "La goma flexible acompaña, el cemento se parte" }] }),
    I("gt_tire_inner_tube", "old tire inner tube rubber piece", "a piece of old tire inner tube", { at: "la goma de una cubierta vieja" }),
    C("gt_rubber_patch_roof", "gluing rubber patch over roof joint sealant", "the flexible rubber patch over the joint", { at: "cortar un parche de esa goma" }),
    C("gt_sealing_metal_roof_screw", "sealing metal roof screw head sealant", "sealing the metal roof screws one by one", { at: "los tornillos no hace falta cambiar" }),
  ]},
  // ░░ 12) EL ERROR ░░
  { a: "el error que hace que la gotera vuelva", beats: [
    C("gt_sealing_over_stain", "applying sealant directly over ceiling stain", "sealing over the stain, the wrong spot", { at: "sella justo arriba de la mancha" }),
    X({ kind: "diagram", at: "una manguera pinchada adentro de la pared", eyebrow: "El error que arruina todo", slides: [{ image: dg("dg_gt_error", "Diagrama metafora: una manguera pinchada DENTRO de una pared sigue largando agua mientras una persona seca el piso con un trapo, sin tapar el pinchazo. Al lado, el paralelo: sellar la mancha del cielo raso mientras el agua sigue entrando metros mas arriba. Etiquetas 'secas el piso sin tapar el pinchazo', 'tapas la mancha sin tapar la entrada'."), eyebrow: "Tapar la salida mientras el agua sigue entrando" }] }),
    C("gt_sealing_wet_surface_rain", "applying sealant on wet roof in rain", "sealing on a wet surface, it peels", { at: "sellar sobre superficie mojada" }),
  ]},
  // ░░ 13) LÍMITES — las tres aguas ░░
  { a: "un par de honestidades", beats: [
    C("gt_destroyed_old_roof", "old ruined roof membrane cracked everywhere", "a roof truly shot needs redoing", { at: "ya esta realmente vencido" }),
    X({ kind: "diagram", at: "no toda mancha de humedad", eyebrow: "Tres aguas, tres arreglos distintos", slides: [{ image: dg("dg_gt_tres_aguas", "Diagrama comparativo de las TRES humedades de una casa, en tres columnas con una pared/techo en corte: 1) GOTERA: agua que baja del techo (flecha desde arriba), 'aparece cuando llueve'; 2) CONDENSACION: vapor que se junta en superficies frias (gotitas), 'aparece con el frio'; 3) CAPILARIDAD: agua que sube desde el piso por la pared (flecha desde abajo), 'siempre, desde abajo'. Iconos claros."), eyebrow: "Gotera (baja), condensación (frío), capilaridad (sube)" }] }),
    C("gt_condensation_window", "condensation water droplets on cold surface", "condensation is not a leak", { at: "es condensacion" }),
    C("gt_rising_damp_wall_base", "rising damp stain base of wall", "rising damp comes from below", { at: "la que sube" }),
  ]},
  // ░░ 14) INJERTO 2 ░░
  { a: "cuando arme el manual", beats: [
    G("gt_tomas_pausa", { kicker: "Nadie te lo enseña" }),
    X({ kind: "chips", at: "le conviene venderte el balde", title: "Por qué nadie te lo enseña", chips: ["A la impermeabilización", "le conviene venderte el balde", "no enseñarte el agujerito"], hue: "red", imageDarken: 0.6, _bg: { name: "gt_waterproof_products", query: "shelf of waterproofing products bucket", concept: "a shelf of expensive waterproofing buckets" }, image: "real/gt_waterproof_products.png" }),
    X({ kind: "splitlist", at: "lo dividi justo asi", title: "Los 40 arreglos, divididos así", items: ["Madera y metal que no mueren", "Plagas por centavos", "Goteras, humedad y moho", "Arreglos del hogar y el auto"], palette: "A" }),
  ]},
  // ░░ 15) RECAP ░░
  { a: "recapitulemos", beats: [
    X({ kind: "checklist", at: "recapitulemos", title: "El plan contra la gotera", items: [{ text: "Encontrá la entrada, no la mancha", state: "done" }, { text: "Limpiá y secá bien la zona", state: "done" }, { text: "Sellá la grieta en V con asfalto y tela", state: "done" }, { text: "Goma de cubierta donde el techo se mueve", state: "done" }, { text: "Mantené canaletas y desagües limpios", state: "done" }] }),
    C("gt_fixed_dry_ceiling", "clean dry ceiling no stain repaired", "your roof and structure saved", { at: "salvar tu techo" }),
  ]},
  // ░░ 16) INJERTO 3 + CIERRE ░░
  { a: "la casa entera esta llena de estos", beats: [
    X({ kind: "diagram", at: "el manual de reparaciones caseras", eyebrow: "Los 40, ordenados y probados", slides: [{ image: dg("dg_gt_stack", "Lamina tipo coleccion de valor artesanal: un manual ilustrado con 40 arreglos caseros (madera, oxido, plagas, goteras) con planos y medidas, apilado como una pila de valor. Estilo archivo, sin precios ni texto legible."), eyebrow: "Con la receta del sándwich y cómo hallar la entrada" }] }),
    I("gt_manual_phone", "phone showing home repair manual on table", "the manual on your phone", { at: "ordenado el dia que lo necesites" }),
    C("gt_rain_finding_leak", "person looking at rain finding water path", "next time it rains, find the entry", { at: "la proxima vez que llueva" }),
  ]},
  // ░░ 17) PRÓXIMO ░░
  { a: "en el proximo video", beats: [
    C("gt_wall_damp_no_rain", "damp stain on interior wall no rain", "next: water in a wall without rain", { at: "el agua que aparece en una pared" }),
    C("gt_old_plumber", "old plumber working on hidden pipe wall", "the trick of the sixty-five-year-old plumber", { at: "el plomero de sesenta y cinco" }),
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
  { kind: "oxquote", at: "esa manchita era una gotera", dur: 5.0, quote: "Una gotera no te moja el piso. Te *pudre la casa* desde adentro.", image: "real/gt_ceiling_stain_brown.png", side: "right", accent: "red" },
  // ── PRINCIPIO ──
  { kind: "oxrule", at: "busca la entrada no la mancha", dur: 4.8, text: "El agua viene de *más arriba*. Buscá la entrada, no la mancha.", accent: "amber" },
  // ── SOSPECHOSOS ──
  { kind: "oxstat", at: "la babeta", dur: 4.2, value: 80, suffix: " %", label: "del agua entra por la babeta, la unión techo-pared", glyph: "🧱", accent: "amber" },
  { kind: "oxside", at: "un truco de detective", dur: 5.2, image: "real/gt_man_inspecting_roof.png", title: "El truco de la manguera", lines: ["Uno arriba moja de abajo hacia arriba", "Otro adentro mira la mancha", "Donde aparece, ahí entra"], side: "left", accent: "blue" },
  // ── TERRAZA ──
  { kind: "oxtag", at: "charco que tarda dias en irse", dur: 4.2, name: "El charco", what: "Si el agua no escurre, la membrana se vence", side: "right", accent: "red" },
  // ── ARREGLO ──
  { kind: "oxspec", at: "limpia bien la zona", dur: 5.0, image: "real/gt_brushing_asphalt.png", kicker: "El parche del albañil", title: "Sándwich de asfalto", rows: [{ k: "Limpiar y secar", v: "siempre" }, { k: "Grieta", v: "abierta en V" }, { k: "Capas", v: "asfalto + tela + asfalto" }, { k: "Costo", v: "$2" }], side: "left", accent: "blue" },
  // ── GOMA ──
  { kind: "oxside", at: "la goma de una cubierta vieja", dur: 5.4, image: "real/gt_tire_inner_tube.png", title: "La goma de cubierta", lines: ["Flexible: acompaña el movimiento", "No se raja con el sol", "Dura 20 o 30 años, y es gratis"], side: "right", accent: "amber" },
  { kind: "oxtag", at: "una buna", dur: 4.2, name: "La buña", what: "Mete el borde dentro del muro: no se cuela", side: "left", accent: "blue" },
  // ── ERROR ──
  { kind: "oxrule", at: "no tapes la mancha", dur: 4.8, text: "No tapes la *mancha*. Tapá la *entrada*.", accent: "red" },
  // ── CIERRE ──
  { kind: "oxbefore", at: "salvar tu techo", dur: 4.4, before: "real/gt_ceiling_stain_brown.png", after: "real/gt_fixed_dry_ceiling.png", accent: "green" },
  { kind: "oxquote", at: "el link esta abajo", dur: 5.0, quote: "Cuesta menos que una visita de la empresa. El link está *abajo*.", image: "real/gt_manual_phone.png", attribution: "Igual, hacé lo de hoy", side: "right", accent: "green" },
];
let nOv = 0;
for (const o of OVL) { const s = atc(o.at); if (s == null) continue; const { kind, at: _a, dur = 4.2, ...props } = o; beats.push({ id: `ov_${kind}_${Math.round(s)}`, start: +s.toFixed(2), dur, kind, overlay: true, hue: "amber", ...props }); nOv++; }
beats.sort((a, b) => a.start - b.start);

// ── FILL — imágenes ancladas extra para DENSIFICAR (pacing óxido ~6-8s). fetch_bing. ──
const FILL = [
  ["gt_family_shaken", "shaken family after home accident", "no one hurt by a miracle", "nadie salio lastimado"],
  ["gt_beam_gave_way", "wooden roof beam breaking giving way", "it could not hold any more", "no aguanto mas"],
  ["gt_lesson_reflecting", "man reflecting looking at ceiling damage", "what I learned that day", "que aprendi ese dia"],
  ["gt_leak_returns_rain", "ceiling leak stain returning after rain", "the first rain it came back", "la primera lluvia volvio"],
  ["gt_same_spot_stain", "same water stain spot on ceiling", "in the same place", "en el mismo lugar"],
  ["gt_finding_entry_roof", "man finding the leak entry on a roof", "find the real entry", "encontrar la entrada de verdad"],
  ["gt_20_year_repair", "durable old roof repair lasting years", "lasts twenty years", "aguanta veinte anos"],
  ["gt_cheap_vs_costly", "small cheap repair versus big damage", "cheapest to fix, costliest to ignore", "el mas caro de ignorar"],
  ["gt_small_hole_roof", "small ten centimeter hole in a roof", "a hole of ten centimeters", "un agujerito de diez centimetros"],
  ["gt_wrong_spot_fix", "failed roof repair still leaking", "they fixed the wrong spot", "el lugar equivocado"],
  ["gt_dripping_inside", "water dripping down inside a ceiling", "it drips to the inside", "gotea para adentro"],
  ["gt_stain_far_from_leak", "ceiling water stain far from the leak", "the stain you see on the ceiling", "la mancha que ves en tu cielo raso"],
  ["gt_tracing_slope", "tracing roof slope uphill inspecting", "following the slope upward", "siguiendo la pendiente"],
  ["gt_gutter_backup", "gutter overflowing backing up water", "the water builds up", "el agua se acumule"],
  ["gt_dry_day_roof", "inspecting roof on a dry clear day", "on a day without rain", "un dia sin lluvia"],
  ["gt_watching_stain_inside", "person watching ceiling stain indoors", "someone inside watching the stain", "pone a alguien adentro"],
  ["gt_moisture_appears", "moisture appearing on a ceiling", "as soon as the damp appears", "apenas aparece la humedad"],
  ["gt_membrane_blister_macro", "blister bubble in roof membrane closeup", "trapped moisture below", "humedad que quedo atrapada"],
  ["gt_cutting_blister_cross", "cutting roof membrane blister in a cross", "cut them in a cross", "cortarlas en cruz"],
  ["gt_fixing_slope_drain", "fixing roof slope toward drain", "fix the slope", "arregla la pendiente"],
  ["gt_wire_brush_loose", "wire brushing loose plaster off roof", "with a wire brush", "con un cepillo"],
  ["gt_moss_dirty_roof", "moss and dirt on a roof surface", "the dirt and the moss", "la mugre y el musgo"],
  ["gt_thin_hairline_crack", "thin hairline crack in concrete", "a thin crack", "una grieta finita"],
  ["gt_burlap_strip", "burlap fabric strip for roof patch", "even a strip of burlap", "una tira de arpillera"],
  ["gt_second_asphalt_coat", "brushing a second coat of asphalt roof", "another coat of asphalt on top", "otra mano de asfalto arriba"],
  ["gt_leak_stopped", "sealed roof crack no more leak", "you can stop your leak", "ya podes frenar tu gotera"],
  ["gt_roof_sun_expand", "roof under hot sun expanding heat", "it expands, it dilates", "se dilata se expande"],
  ["gt_roof_cold_contract", "roof at night cold contracting", "with the cold it contracts", "con el frio se contrae"],
  ["gt_cut_rubber_patch", "cutting a rubber patch from inner tube", "bigger than the crack", "mas grande que la grieta"],
  ["gt_glue_rubber_joint", "gluing rubber patch over a roof joint", "glue it over the joint", "pegarlo encima de la junta"],
  ["gt_rubber_strip_wall", "flexible membrane strip up a wall", "that goes up the wall", "que suba por la pared"],
  ["gt_grinder_groove_wall", "angle grinder cutting groove in wall", "with the grinder", "con la amoladora"],
  ["gt_screw_head_seal", "sealing a metal roof screw head", "the head of the screw", "la cabeza del tornillo"],
  ["gt_metal_roof_screws_rows", "rows of screws on a metal roof", "screw by screw", "tornillo por tornillo"],
  ["gt_water_enters_above", "water entering a roof higher up", "it enters meters higher", "entra metros mas arriba"],
  ["gt_mopping_floor_cloth", "mopping water off floor with a cloth", "drying the floor with a rag", "secando el piso con un trapo"],
  ["gt_sealing_wet_rain", "applying sealant on wet roof in rain", "throws sealant on the crack", "le tira el sellador a la grieta"],
  ["gt_peeling_sealant", "sealant peeling off after a week", "it peels off in a week", "se despega en una semana"],
  ["gt_condensation_ceiling", "condensation droplets on a cold ceiling", "gathers on the cold ceiling", "se junta en el techo frio"],
  ["gt_rising_damp_floor", "rising damp climbing from the floor", "rising from the floor up", "va subiendo desde el piso"],
  ["gt_foundation_moisture", "moisture from foundation base of wall", "moisture from the foundation", "humedad de cimiento"],
  ["gt_capillarity_brick", "moisture wicking up a brick wall", "it is capillarity", "es capilaridad"],
  ["gt_20kg_sealant_bucket", "large 20 kilo bucket of waterproof sealant", "the twenty kilo bucket", "el balde de veinte kilos"],
  ["gt_40_repairs", "manual with forty home repairs", "forty repairs same criteria", "cuarenta arreglos"],
];
for (const [name, query, concept, ph] of FILL) { const s = atc(ph); if (s == null) continue; beats.push({ id: name, start: +s.toFixed(2), dur: 4, kind: "raw", src: `broll/${name}.mp4`, darken: 0, hue: HUES[Math.round(s) % 3] }); addM(name, query, concept); addB(name, query, concept); }
beats.sort((a, b) => a.start - b.start);

// ── STRUCT — formatos estructurados inline (gate de variedad: ≥6 tipos, ≥6% peso, bars≥2) ──
const STRUCT = [
  { kind: "bars", at: "le cobra una fortuna", hue: "red", title: "El costo real de una gotera", bars: [{ label: "Empresa de impermeabilización", value: 100, display: "$$$", tone: "danger" }, { label: "Tu mano, asfalto y tela", value: 5, display: "$2", winner: true }] },
  { kind: "bars", at: "un agujerito de diez centimetros", hue: "amber", title: "Lo que arreglás vs lo que te cobran", bars: [{ label: "El problema real", value: 8, display: "10 cm", winner: true }, { label: "Lo que te cobran (techo entero)", value: 100, display: "$$$", tone: "danger" }] },
  { kind: "process", at: "viene el arreglo", hue: "blue", title: "El arreglo del albañil", eyebrow: "Tres pasos", steps: [{ title: "Encontrá la entrada", desc: "no la mancha: el agua viene de arriba" }, { title: "Limpiá y secá", desc: "nada pega sobre sucio o mojado" }, { title: "Sellá flexible", desc: "asfalto + tela, o goma donde se mueve" }] },
  { kind: "aged", at: "el agua siempre viene de mas arriba", hue: "amber", heading: "LA REGLA FINAL", eyebrow: "Aunque te olvides de todo lo demás", lines: ["La gotera nunca está donde la ves", "El agua entra arriba y gotea lejos", { text: "Buscá la entrada, no la mancha", mark: true }] },
  { kind: "callout", at: "aguanta veinte anos", figure: "20 años", caption: "Lo que dura el parche de goma de cubierta, gratis.", accent: "good", image: "real/gt_tire_inner_tube.png" },
  { kind: "callout", at: "casi nunca pierde por el medio", figure: "80%", caption: "Del agua entra por la babeta: la unión techo-pared.", accent: "danger", image: "real/gt_ceiling_stain_brown.png" },
];
for (const s of STRUCT) { const t = atc(s.at); if (t == null) continue; const { kind, at: _a, image, ...props } = s; const beat = { id: `cmp_${kind}_st_${Math.round(t)}`, start: +t.toFixed(2), dur: 6.5, kind, hue: s.hue || "blue", ...props, ...(image ? { image } : {}) }; if (kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l)); beats.push(beat); }
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
for (const b of beats) { if (b.kind !== "raw") continue; if (b.src.startsWith("broll/")) { if (haveClip(b.id)) nClip++; else if (haveReal(b.id)) { b.src = `real/${b.id}.png`; nReal++; } else { nMiss++; miss.push(b.id); } } else if (b.src.startsWith("real/")) { if (haveReal(b.id)) nReal++; else { nMiss++; miss.push(b.id); } } else if (b.src.startsWith("img/")) { if (haveImg(b.id)) nImg++; else { nMiss++; miss.push(b.id); } } }
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
