// gen_federer6.mjs — beatsheet/federer6.json (Canal "Federer Archivos" · Video 6 REMEDIOS).
// Avatar federer6_opt.mp4 (~25.5min). Anclaje por FRASE a captions_federer6.json.
// Look CLÍNICO. Imágenes gpt-image-2 (.png): fe6_*.png + dg_fe6_*.png. Kit premium COMPLETO.
// Estructura: HISTORIA de Amelia (emotiva) → 7 REMEDIOS (cada uno: número, ingrediente,
// preparación, diagrama, LowerThird "cantidades en la descripción") → cierre + guía.
// 3 injertos de venta. Diagramas SIN eyebrow (ya traen texto). Emite federer6_beats.ts + hooks.
import fs from "fs";

const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const dg = (name, _eyebrow, o = {}) => ({ t: "diagram", slides: [{ image: `img/${name}.png` }], ...o }); // SIN eyebrow
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "teal", ...o }); // "REMEDIO 0X" (teal)
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o });
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "teal", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const ap = (items, o = {}) => ({ t: "avatarpizarra", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const ge = (title, items, o = {}) => ({ t: "guardaesto", title, items, ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image: `img/${image}.png`, ...o });

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6 };

// helper "cantidades en la descripción" (el embudo de venta) — LowerThird teal
const desc = (at) => lt("Cantidades exactas 👇 en la descripción", { kicker: "Importante", desc: "Abrí la descripción y seguí la receta.", tone: "teal", at });

const SECTIONS = [
  // ░░ HOOK ░░
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    r("fe6_remedios_abuela_cocina", { at: "que tu abuela tenia en la cocina", kicker: "Los remedios de la abuela" }),
    mv("Los remedios caseros son puro cuento", "Un puñado tiene ciencia de verdad", { flipPhrase: "tienen ciencia de verdad" }),
  ]},
  { key: "promesa", phrase: "hoy te los voy a dar", beats: [
    c("chips", { bg: "image", image: "img/fe6_remedios_abuela_cocina.png", imageDarken: 0.6, title: "7 remedios que un médico SÍ aprueba", chips: ["Piernas · Sueño · Dolores", "Presión · Digestión", "Memoria · Defensas"] }),
    c("bars", { title: "De todos los remedios caseros…", unit: "", bars: [
      { label: "Puro cuento / sin respaldo", value: 80, tone: "danger" },
      { label: "Con ciencia real (estos 7)", value: 100, winner: true } ] }),
  ]},
  // ░░ EL EMBUDO A LA DESCRIPCIÓN (regla del video) ░░
  { key: "mecanica", phrase: "una cantidad exacta", beats: [
    lt("Las cantidades exactas están en la DESCRIPCIÓN", { kicker: "Importante", desc: "Abrila ahora y seguí cada receta ahí.", tone: "warn", at: "en la descripcion de este video" }),
    r("fe6_abre_descripcion_celular", { at: "abri la descripcion" }),
  ]},
  { key: "presenta", phrase: "mas de una decada que veo", beats: [
    c("nametag", { name: "Dr. Federer", role: "Médico · más de una década de consultorio", image: "img/fe6_federer_pizarra.png" }),
  ]},
  { key: "comentario", phrase: "comentarios cual de estos", beats: [
    lt("Contame: ¿cuál te molesta más?", { kicker: "En los comentarios", desc: "Piernas, sueño, dolores, presión, digestión, memoria o defensas.", tone: "teal", at: "cual de estos 7" }),
  ]},
  // ░░ HISTORIA DE AMELIA (emotiva) ░░
  { key: "story_intro", phrase: "dejame contarte una historia", beats: [
    c("talk", {}),
  ]},
  { key: "story_llega", phrase: "llego a mi consultorio dona amelia", beats: [
    r("fe6_amelia_llora_consultorio", { at: "se largo a llorar", hold: true }),
    r("fe6_amelia_manos_temblando", {}),
  ]},
  { key: "story_hospital", phrase: "de un hospital grande", beats: [
    r("fe6_hospital_grande_frio", { at: "de esos de piso brillante" }),
    r("fe6_amelia_espera_sala", { at: "dos horas y media de espera" }),
    r("fe6_medico_frio_computadora", { at: "sin despegar los ojos de la computadora" }),
    c("quote", { image: "img/fe6_medico_frio_computadora.png", text: "Va a perder la vista por completo. *Vaya haciéndose a la idea.*" }),
  ]},
  { key: "story_nieta", phrase: "mi primera nieta nace", beats: [
    r("fe6_calendario_febrero", {}),
    c("quote", { image: "img/fe6_amelia_llora_consultorio.png", text: "Doctor, mi primera nieta nace en febrero. Yo solo quiero *verle la carita*. Una vez." }),
    r("fe6_medico_frio_computadora", { at: "no se haga ilusiones" }),
  ]},
  { key: "story_bronca", phrase: "me dio bronca", beats: [
    fc([{ t: "Tenía" }, { t: "el" }, { t: "título" }, { t: "pero" }, { t: "le", }, { t: "faltaba" }, { t: "humanidad", hl: true }], { tone: "warn", at: "le faltaba lo unico" }),
  ]},
  { key: "story_brava", phrase: "amelia era brava", beats: [
    r("fe6_amelia_joven_vela", { at: "aprendio a leer sola", kicker: "De joven aprendió a leer sola", hold: true }),
    r("fe6_amelia_determinada", {}),
  ]},
  { key: "story_pelea", phrase: "hizo lo que hay que hacer", beats: [
    ap([
      { card: "Los buenos médicos", sub: "buscó otros y siguió el tratamiento al pie de la letra", atPhrase: "buscar medicos de los buenos" },
      { card: "Y su cuerpo", sub: "circulación, presión, descanso, remedios, cada día", atPhrase: "cuidar el cuerpo" },
    ], {}),
    r("fe6_amelia_llora_consultorio", { at: "no hubo milagro" }),
  ]},
  { key: "story_martina", phrase: "y llego febrero", beats: [
    r("fe6_bebe_martina_brazos", { at: "le vio la carita", hold: true }),
    c("quote", { image: "img/fe6_bebe_martina_brazos.png", text: "Y le vio la carita. Los ojitos, la nariz… y *lloró como no lloraba en años*." }),
  ]},
  { key: "story_vuelta", phrase: "meses despues amelia volvio", beats: [
    r("fe6_amelia_pasillo_bebe", { at: "se cruzo con aquel", hold: true }),
    c("quote", { image: "img/fe6_amelia_pasillo_bebe.png", text: "Doctor, ¿se acuerda de mí? La que no iba a ver a su nieta. *Mírela. Se llama Martina.*" }),
    r("fe6_medico_verguenza", { at: "colorado mirando el piso" }),
  ]},
  { key: "story_leccion", phrase: "por que te cuento todo esto", beats: [
    c("talk", {}),
    fc([{ t: "Cuidarse" }, { t: "no" }, { t: "es" }, { t: "una" }, { t: "cosa" }, { t: "mágica" }, { t: "es" }, { t: "todo", hl: true }, { t: "junto", hl: true }], { tone: "teal", at: "es todo junto" }),
  ]},
  // ░░ REMEDIO 1 · Jengibre ░░
  { key: "rem1", phrase: "el remedio numero uno", beats: [
    es("01", "Jengibre — circulación y piernas", { w: 3.6 }),
    r("fe6_jengibre_raiz", { at: "el jengibre" }),
    r("fe6_verduleria_jengibre", {}),
    dg("dg_fe6_jengibre_circulacion", "Jengibre → circulación"),
    r("fe6_p1_rallar", { at: "cuanto rallar" }),
    r("fe6_cocina_ralla", {}),
    r("fe6_p1_hierve", {}),
    r("fe6_p1_cuela", {}),
    c("process", { title: "Agua de jengibre", eyebrow: "Preparación", steps: [
      { title: "Rallar", desc: "jengibre fresco", image: "img/fe6_p1_rallar.png" },
      { title: "Hervir", desc: "en agua, a fuego bajo", image: "img/fe6_p1_hierve.png" },
      { title: "Colar", desc: "en una taza", image: "img/fe6_p1_cuela.png" } ] }),
    fz("fe6_agua_jengibre_taza", { x: 0.5, y: 0.5, label: "Agua de jengibre", zoom: 1.7, tone: "teal", at: "en cuanta agua" }),
    desc("la medida justa"),
    r("fe6_libro_jengibre", { hold: true }),
    r("fe6_piernas_livianas", { at: "las piernas mas livianas" }),
  ]},
  // ░░ REMEDIO 2 · Leche dorada ░░
  { key: "rem2", phrase: "remedio numero dos", beats: [
    es("02", "Leche dorada — para el sueño", { w: 3.6 }),
    r("fe6_curcuma_polvo", { at: "con curcuma" }),
    r("fe6_p2_calienta", {}),
    r("fe6_cocina_revuelve", {}),
    r("fe6_p2_curcuma", {}),
    ak([{ word: "LA PIMIENTA", sub: "sin ella, la cúrcuma casi no se absorbe", tone: "warn", atPhrase: "la pizca de pimienta" }], {}),
    r("fe6_p2_pimienta", {}),
    dg("dg_fe6_curcuma_pimienta", "La pimienta multiplica la absorción"),
    c("bars", { title: "Absorción de la cúrcuma", unit: "%", bars: [
      { label: "Sin pimienta", value: 15, tone: "danger", note: "se desperdicia" },
      { label: "Con pimienta negra", value: 100, winner: true } ] }),
    r("fe6_leche_dorada_taza", { at: "una taza de leche tibia" }),
    desc("las proporciones exactas"),
    r("fe6_libro_leche_dorada", { hold: true }),
    r("fe6_duerme_bien", {}),
  ]},
  // ░░ REMEDIO 3 · Pasta de cúrcuma ░░
  { key: "rem3", phrase: "numero tres para los dolores", beats: [
    es("03", "Pasta de cúrcuma — articulaciones", { w: 3.6 }),
    r("fe6_manos_articulaciones", { at: "los dolores de las articulaciones" }),
    dg("dg_fe6_curcuma_articulacion", "Cúrcuma → baja la inflamación"),
    r("fe6_p3_cocina", { at: "una pasta de curcuma" }),
    r("fe6_p3_aceite", {}),
    c("process", { title: "Pasta de cúrcuma", eyebrow: "Preparación", steps: [
      { title: "Cocinar", desc: "cúrcuma + agua a fuego bajo", image: "img/fe6_p3_cocina.png" },
      { title: "Sumar", desc: "pimienta negra y aceite", image: "img/fe6_p3_aceite.png" },
      { title: "Guardar", desc: "en frasco, en la heladera", image: "img/fe6_pasta_curcuma_frasco.png" } ] }),
    r("fe6_pasta_curcuma_frasco", {}),
    c("callout", { image: "img/fe6_cuchara_pasta_curcuma.png", figure: "Se guarda en heladera", caption: "Bien hecha dura semanas; mal hecha no sirve." }),
    desc("la proporcion exacta"),
  ]},
  // ░░ REMEDIO 4 · Hibisco ░░
  { key: "rem4", phrase: "remedio numero 4", beats: [
    es("04", "Hibisco — la presión", { w: 3.6 }),
    r("fe6_flor_hibisco", { at: "el hibisco" }),
    dg("dg_fe6_hibisco_presion", "Hibisco → relaja los vasos, suelta sodio"),
    r("fe6_p4_vierte", {}),
    r("fe6_p4_reposa", {}),
    c("process", { title: "Té de hibisco", eyebrow: "Preparación", steps: [
      { title: "Verter", desc: "agua caliente sobre las flores", image: "img/fe6_p4_vierte.png" },
      { title: "Reposar", desc: "tapado unos minutos", image: "img/fe6_p4_reposa.png" },
      { title: "Colar", desc: "y tomar", image: "img/fe6_te_hibisco_rubi.png" } ] }),
    r("fe6_te_hibisco_rubi", { at: "un color rubi" }),
    lt("¿Tomás medicación para la presión? Consultá", { kicker: "Ojo, este es potente", desc: "El hibisco puede potenciarla y bajártela de más.", tone: "warn", at: "ya tomas pastillas para la presion" }),
    desc("la medida exacta"),
    r("fe6_libro_hibisco", { hold: true }),
    r("fe6_presion_tensiometro", {}),
  ]},
  // ░░ REMEDIO 5 · Agua tibia limón + jengibre ░░
  { key: "rem5", phrase: "remedio numero 5", beats: [
    es("05", "Agua con limón — digestión e hígado", { w: 3.6 }),
    r("fe6_agua_limon_jengibre", { at: "agua tibia con limon" }),
    r("fe6_p5_exprime", {}),
    dg("dg_fe6_limon_digestion", "En ayunas, despierta la digestión"),
    c("splitlist", { title: "Dos detalles que importan", items: ["Agua TIBIA, no hirviendo", "En ayunas, apenas te levantás", "Esperá antes de desayunar"], palette: "G" }),
    c("process", { title: "Agua con limón", eyebrow: "En ayunas", steps: [
      { title: "Exprimir", desc: "medio limón", image: "img/fe6_p5_exprime.png" },
      { title: "Mezclar", desc: "agua tibia + jengibre", image: "img/fe6_agua_limon_jengibre.png" },
      { title: "Tomar", desc: "en ayunas", image: "img/fe6_toma_ayunas_manana.png" } ] }),
    desc("cuantos minutos esperar"),
    r("fe6_toma_ayunas_manana", {}),
  ]},
  // ░░ REMEDIO 6 · Romero ░░
  { key: "rem6", phrase: "remedio numero 6", beats: [
    es("06", "Romero — memoria y concentración", { w: 3.6 }),
    r("fe6_romero_ramita", { at: "el romero" }),
    dg("dg_fe6_romero_cerebro", "Romero → circulación al cerebro"),
    r("fe6_p6_vierte_romero", {}),
    r("fe6_cocina_sirve_te", {}),
    r("fe6_te_romero_taza", { at: "un te de romero suave" }),
    desc("el mejor momento del dia"),
  ]},
  // ░░ REMEDIO 7 · Jarabe ░░
  { key: "rem7", phrase: "remedio numero 7", beats: [
    es("07", "Jarabe de miel, jengibre y limón — defensas", { w: 3.8 }),
    r("fe6_miel_jengibre_limon", { at: "miel jengibre y limon" }),
    dg("dg_fe6_jarabe_defensas", "Miel + jengibre + limón → defensas"),
    r("fe6_p7_mezcla", {}),
    r("fe6_cocina_jarabe", {}),
    c("process", { title: "Jarabe casero", eyebrow: "Preparación", steps: [
      { title: "Mezclar", desc: "miel, jengibre y limón", image: "img/fe6_p7_mezcla.png" },
      { title: "Reposar", desc: "en frasco, en la heladera", image: "img/fe6_jarabe_frasco.png" },
      { title: "Tomar", desc: "1 cucharada a la mañana", image: "img/fe6_cucharada_jarabe.png" } ] }),
    r("fe6_jarabe_frasco", { at: "un jarabe casero" }),
    c("callout", { image: "img/fe6_cucharada_jarabe.png", figure: "1 cucharada", caption: "Por la mañana, sobre todo en época de frío." }),
    desc("la proporcion justa"),
    r("fe6_libro_jarabe", { hold: true }),
    r("fe6_persona_mayor_energia", {}),
  ]},
  // ░░ CIERRE + GUÍA ░░
  { key: "cierre_idea", phrase: "cada uno para un problema", beats: [
    c("talk", {}),
    r("fe6_cocina_muestra_taza", {}),
    ge("Los 7 remedios (guardá esto)", [
      { text: "Jengibre — circulación y piernas", image: "img/fe6_jengibre_raiz.png" },
      { text: "Leche dorada — sueño", image: "img/fe6_leche_dorada_taza.png" },
      { text: "Pasta de cúrcuma — articulaciones", image: "img/fe6_pasta_curcuma_frasco.png" },
      { text: "Hibisco — presión", image: "img/fe6_te_hibisco_rubi.png" },
      { text: "Agua con limón — digestión", image: "img/fe6_agua_limon_jengibre.png" },
      { text: "Romero — memoria", image: "img/fe6_te_romero_taza.png" },
      { text: "Jarabe miel+jengibre+limón — defensas", image: "img/fe6_jarabe_frasco.png" },
    ], { at: "tienen todos algo en comun" }),
  ]},
  { key: "cta_guia", phrase: "el enlace a mi guia", beats: [
    r("fe6_libro_guia", { hold: true }),
    c("chips", { bg: "image", image: "img/fe6_guia_celular.png", imageDarken: 0.62, title: "La Guía Completa de la Salud +60", chips: ["+150 remedios y rutinas", "Señales de alerta", "archivos-federer.vercel.app"] }),
    lt("El enlace está ARRIBA de todo en la descripción", { kicker: "La guía completa", desc: "Más de 150 remedios explicados por un médico.", tone: "teal", at: "arriba de todo en la descripcion" }),
  ]},
  { key: "disclaimer", phrase: "estos remedios acompanan", beats: [
    c("checklist", { title: "Importante", items: [
      { text: "Acompañan y dan alivio, NO curan", state: "warn" },
      { text: "No reemplazan tu medicación ni la consulta", state: "warn" },
      { text: "Hibisco, cúrcuma y jengibre pueden interactuar: consultá", state: "warn" } ] }),
  ]},
  { key: "cta_final", phrase: "comentarios cual vas a probar", beats: [
    c("chips", { bg: "image", image: "img/fe6_remedios_abuela_cocina.png", imageDarken: 0.62, title: "Si te sirvió", chips: ["Dale me gusta", "Suscribite", "Compartilo"] }),
    c("nametag", { name: "Dr. Federer", role: "Cada semana, salud real para después de los 60", image: "img/fe6_federer_pizarra.png" }),
  ]},
  { key: "close", phrase: "pronto un abrazo", beats: [
    c("talk", {}),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer6.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);
const VIDEO_END = (CW[CW.length - 1]?.s || 1530) + 2;

let cursorSec = 0;
const missing = [];
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = sec.start; continue; }
  const ms = findMs(sec.phrase, cursorSec + 1);
  if (ms == null) missing.push(sec.phrase);
  sec.start = ms != null ? ms : cursorSec + 5;
  cursorSec = sec.start;
}
SECTIONS.sort((a, b) => a.start - b.start);

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b); if (!ph) return null;
    const ms = findMs(ph, start + 0.4);
    return ms != null && ms > start + 0.8 && ms < end - 1.2 ? ms : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.2) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i);
  fixed.push(n);
  const startT = new Array(n);
  for (let f = 0; f < fixed.length - 1; f++) {
    const a = fixed[f], b = fixed[f + 1];
    const ta = pin[a], tb = b === n ? end : pin[b];
    let sw = 0; for (let i = a; i < b; i++) sw += ws[i];
    let acc = ta;
    for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); }
  }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2);
    const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2);
    let dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`;
    const beat = { id, start: cursor, dur, key: sec.key };
    if (b.t === "talk") { beat.kind = "talk"; }
    else if (b.t === "raw") { beat.kind = "raw"; beat.src = `img/${b.name}.png`; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true; }
    else { beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = sec.key;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
    }
    beats.push(beat);
  });
}

// ── POST-PASS MILIMÉTRICO (avatarpizarra/keyword + mitoverdad) ───────
const KIT_CLIPS = [];
for (const beat of beats) {
  if (beat.kind === "avatarpizarra" || beat.kind === "avatarkeyword") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...rest } = it; return { ...rest, at: atF };
    });
    const GAP = 90;
    if (last > 300) { beat.items = beat.items.map((it, i) => ({ ...it, at: i * GAP })); last = (beat.items.length - 1) * GAP; }
    const hold = beat.kind === "avatarpizarra" ? 4.2 : 2.8;
    beat.dur = +(last / 30 + hold).toFixed(2);
    beat.clip = `avatar_clips/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) {
    const ms = findMs(beat.flipPhrase, beat.start - 1);
    const lastSafe = Math.round(beat.dur * 30) - 26;
    let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42);
    beat.flipAt = f; delete beat.flipPhrase;
  }
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_federer6.json", JSON.stringify(KIT_CLIPS, null, 1));

// ── PISO DE DURACIÓN ──
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "callout", "bars", "diagram", "rule", "nametag", "board", "annotated", "cross", "process", "lowerthird", "guardaesto", "errorstinger", "mitoverdad", "frasecinetica", "freezezoom"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) {
  const i = compIx[k];
  const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END;
  const capDur = nextComp - beats[i].start - 0.1;
  beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2);
}

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/VideoEdit/federer6_beats.ts",
  `// AUTO-GENERADO por gen_federer6.mjs — beats (imágenes fe6_*.png / dg_fe6_*.png).\n` +
  `export const FED6_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/VideoEdit/federer6_hooks.ts",
  `// AUTO-GENERADO por gen_federer6.mjs — rangos talk.\n` +
  `export const TALKS6: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer6.json", JSON.stringify({ video: "federer6", avatar: "federer6_opt.mp4", theme: "medico", beats }, null, 1));

// ── QA ──
const need = new Set();
beats.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && need.add(s.image)); if (Array.isArray(b.items)) b.items.forEach((it) => it && it.image && need.add(it.image)); });
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));
if (missing.length) console.log(`⚠ frases no ancladas (${missing.length}):`, missing);
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100*raw/beats.length).toFixed(0)}%) · diagramas: ${kinds.diagram||0} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`assets referenciados: ${need.size} · faltantes: ${miss.length}`);
