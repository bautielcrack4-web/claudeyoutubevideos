// gen_federer3.mjs — beatsheet/federer3.json (Canal "Dr. Federer" · Video 3 OJOS).
// Avatar federer3_opt.mp4 (32min). Anclaje por FRASE a captions_federer3.json.
// Look CLÍNICO (THEME_MEDICO). Las imágenes YA EXISTEN (generadas en Flow por el
// usuario): fe3_*.jpg (59 fotos casuales) + dg_fe3_*.jpg (20 diagramas). NO se genera nada.
// Diagramas → pantalla completa con el avatar AFUERA (DiagramBoard). Mecanismo estrella
// → componente animado PizarraOjo. Emite federer3_beats.ts + federer3_hooks.ts.
import fs from "fs";

// helpers de beat (imágenes existentes, ext .jpg) ─────────────────────────────
const r  = (name, o = {}) => ({ t: "raw", name, ...o });        // foto fe3_*.jpg
const c  = (kind, props = {}) => ({ t: kind, ...props });
const dg = (name, eyebrow, o = {}) => ({ t: "diagram", slides: [{ image: `img/${name}.jpg`, eyebrow }], ...o }); // diagrama full-screen (avatar afuera)
const oj = (o = {}) => ({ t: "pizarraojo", ...o });             // explainer animado del mecanismo
const gl = (o = {}) => ({ t: "pizaraglic", ...o });             // explainer animado de la glicación (error #1)
const rl = (o = {}) => ({ t: "relojnoche", ...o });             // reloj/ventana de reparación de la noche
const ANIM = new Set(["pizarraojo", "pizaraglic", "relojnoche"]);

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, pizarraojo: 3.4, pizaraglic: 3.4, relojnoche: 3.2, talk: 1.0 };

// ── SECCIONES (ancladas a frases reales del transcript) ──────────────────────
const SECTIONS = [
  // ░░ HOOK ░░ — avatar abre ~1.3s; scrim "TUS OJOS" encima
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    r("fe3_desperta_borroso", { at: "te despertas a la manana", kicker: "¿Vista nublada al despertar?" }),
    r("fe3_ojos_pesados", { at: "los ojos pesados" }),
    r("fe3_manos_frias_cama", { at: "mirate las manos" }),
    r("fe3_taza_cafe_manana", { hold: true }),
  ]},
  { key: "reframe", phrase: "mucha gente cree que la vista borrosa", beats: [
    c("headline", { tokens: ["No", "son", "tus", "ojos.", "Es", "tu", { t: "circulación" }], eyebrow: "Lo que casi nadie te explica", bg: "image", image: "img/fe3_ojo_cerca.jpg" }),
    r("fe3_espejo_manana", {}),
  ]},
  { key: "danonoche", phrase: "el dano mas serio en tus ojos", beats: [
    c("headline", { tokens: ["El", "daño", "se", "hace", "de", { t: "noche" }], eyebrow: "Mientras dormís, en silencio", bg: "image", image: "img/fe3_dormir_noche.jpg" }),
    c("chips", { bg: "image", image: "img/fe3_ojos_pesados.jpg", imageDarken: 0.6, title: "Hoy vas a entender", chips: ["Por qué se te nubla", "Los 6 errores de la noche", "Cómo corregirlos hoy"] }),
  ]},
  // ░░ IDENTIDAD ░░
  { key: "presenta", phrase: "federer hace mas de", beats: [
    c("nametag", { name: "Dr. Federer", role: "Médico · más de una década de consultorio", image: "img/fe3_medico_consultorio.jpg" }),
    r("fe3_paciente_consulta", { at: "veo cada vez mas borroso", kicker: "«Doctor, veo cada vez más borroso»" }),
  ]},
  // ░░ MECANISMO ░░ — la parte más importante
  { key: "mecanismo", phrase: "tus ojos y sobre todo la retina", beats: [
    dg("dg_fe3_retina_oxigeno", "La retina consume muchísimo oxígeno"),
    c("annotated", { image: "img/fe3_ojo_cerca.jpg", eyebrow: "La retina", caption: "Al fondo del ojo: convierte la luz en imágenes", annotations: [{ kind: "circle", x: 62, y: 50, label: "Retina" }] }),
    dg("dg_fe3_capilares_retina", "Se lo llevan capilares finísimos"),
  ]},
  { key: "taller", phrase: "la noche es el taller de reparacion", beats: [
    dg("dg_fe3_dia_vs_noche", "De día vs. de noche"),
    rl({}), // RelojNoche — la ventana de reparación (avatar afuera)
    dg("dg_fe3_taller_nocturno", "La noche = el taller de reparación del ojo"),
  ]},
  { key: "hipoxia", phrase: "hipoxia de la retina", beats: [
    dg("dg_fe3_hipoxia", "Sin oxígeno, la retina no se repara"),
  ]},
  { key: "oxido", phrase: "cada vez menos oxido nitrico", beats: [
    oj({}), // PizarraOjo — mecanismo animado (retina + óxido nítrico), avatar afuera
    dg("dg_fe3_oxido_nitrico", "El óxido nítrico abre los capilares"),
  ]},
  // ░░ SELF-TEST (dipper / no-dipper) ░░
  { key: "selftest", phrase: "no todas las personas tienen la misma", beats: [
    dg("dg_fe3_dipper", "Los que bajan vs. los que no bajan"),
    c("board", { eyebrow: "¿Cuál es tu caso?", title: "Tu presión de noche", side: "left", items: [
      { title: "«Los que bajan»", sub: "la presión baja de noche → la retina descansa", tone: "teal" },
      { title: "«Los que NO bajan»", sub: "la presión sigue alta → la retina se castiga", tone: "coral" },
      { title: "Pistas", sub: "dolor de nuca al despertar, levantarte al baño, cara hinchada", tone: "blue" },
    ] }),
  ]},
  // ░░ ERROR 6 · deshidratación ░░
  { key: "err6", phrase: "error numero 6", beats: [
    c("rule", { number: "06", title: "Irte a dormir deshidratado", w: 4.0 }),
    dg("dg_fe3_sangre_espesa", "Poca agua = sangre espesa"),
    c("bars", { title: "Cómo circula la sangre de noche", unit: "", bars: [
      { label: "Bien hidratado (fluida)", value: 100, winner: true },
      { label: "Deshidratado (espesa)", value: 55, tone: "danger", note: "llega menos O₂" } ] }),
    r("fe3_no_toma_agua", { at: "dejan de tomar liquido" }),
    c("splitlist", { title: "Pistas de que te deshidratás", items: ["Orina oscura a la mañana", "Boca seca al despertar", "Calambres de madrugada"], palette: "D" }),
    r("fe3_boca_seca", { at: "la boca muy seca" }),
    r("fe3_calambre_pierna", { at: "calambres en las piernas" }),
    r("fe3_toma_ultimo_vaso", { at: "un ultimo vaso de agua", kicker: "Un vaso, 45 min antes" }),
    r("fe3_vaso_agua_noche", {}),
  ]},
  // ░░ ERROR 5 · café/mate tarde ░░
  { key: "err5", phrase: "error numero 5", beats: [
    c("rule", { number: "05", title: "El café o mate a la hora equivocada", w: 4.4 }),
    r("fe3_cafe_tarde", { at: "cafeina tomada a media tarde" }),
    dg("dg_fe3_cafeina_tiempo", "La cafeína dura 5-6 horas en la sangre"),
    dg("dg_fe3_fases_sueno", "Te roba el sueño profundo (donde se repara el ojo)"),
    c("bars", { title: "Sueño profundo = reparación del ojo", unit: "", bars: [
      { label: "Sin café a la tarde", value: 100, winner: true },
      { label: "Con café a la tarde", value: 50, tone: "danger", note: "no reparás" } ] }),
    r("fe3_mate_novela", { at: "el mate cebado", kicker: "Mate hasta las 10 = no reparás" }),
    r("fe3_desvelada_cama", {}),
    c("stat", { value: 4, prefix: "hasta las ", suffix: " pm", label: "café y mate hasta ahí; después, mejor no", eyebrow: "La regla del horario" }),
  ]},
  { key: "err5caso", phrase: "te cuento un caso rapido", beats: [
    c("quote", { image: "img/fe3_rosa_paciente.jpg", text: "Doctor, no sé qué me hizo, pero a la mañana veo la tele *clarita* de nuevo." }),
    r("fe3_reloj_madrugada", {}),
  ]},
  // ░░ ERROR 4 · pantalla + postura ░░
  { key: "err4", phrase: "error numero 4", beats: [
    c("rule", { number: "04", title: "La pantalla y la postura al dormir", w: 4.2 }),
    r("fe3_celular_cama", { at: "mirar el celular en la cama", kicker: "Luz azul a 10 cm de la cara" }),
    dg("dg_fe3_luz_azul", "La luz azul frena la melatonina"),
    dg("dg_fe3_melatonina_antiox", "Y la melatonina protege el ojo"),
  ]},
  { key: "err4b", phrase: "pero hay un segundo error", beats: [
    r("fe3_duerme_boca_abajo", { at: "dormis siempre boca abajo" }),
    dg("dg_fe3_presion_ocular", "Boca abajo = más presión en el ojo"),
    c("callout", { image: "img/fe3_celular_cama.jpg", figure: "½ hora", caption: "Sin pantallas la última media hora antes de dormir." }),
    r("fe3_un_ojo_molesto", { at: "un ojo mas nublado" }),
    c("splitlist", { title: "El fix de la noche", items: ["Nada de pantallas la última ½ hora", "Luz cálida y tenue, no blanca", "Dormí boca arriba o de costado"], palette: "G" }),
    r("fe3_velador_calido", {}),
    r("fe3_duerme_costado", {}),
  ]},
  { key: "rehook", phrase: "para un segundo porque quiero", beats: [
    c("headline", { tokens: ["Tu", "vista", "se", "juega", "cada", { t: "noche" }], eyebrow: "No una vez al año en el oculista", bg: "image", image: "img/fe3_dormir_noche.jpg" }),
  ]},
  // ░░ ERROR 3 · tensión nocturna ░░
  { key: "err3", phrase: "error numero 3", beats: [
    c("rule", { number: "03", title: "La tensión alta de noche", w: 3.8 }),
    r("fe3_tensiometro_brazo", { at: "la tension controlada" }),
    dg("dg_fe3_tension_capilares", "Tensión alta = capilares de la retina dañados"),
    r("fe3_dolor_nuca", { at: "dolor de cabeza al despertar" }),
    r("fe3_desvela_bano", {}),
    dg("dg_fe3_fondo_ojo", "La única circulación que un médico puede ver"),
    c("cross", { title: "El daño de la tensión nocturna", eyebrow: "Capa por capa", layers: [
      { label: "Tensión alta sostenida", color: "#E0523E", weight: 3 },
      { label: "Capilares de la retina", color: "#109C99", weight: 2 },
      { label: "Nervio óptico", color: "#2E7DB0", weight: 2 } ] }),
    r("fe3_cara_hinchada", {}),
  ]},
  // ░░ ERROR 2 · absorción ░░
  { key: "err2", phrase: "error numero 2", beats: [
    c("rule", { number: "02", title: "Comer los nutrientes del ojo mal", w: 4.2 }),
    dg("dg_fe3_luteina_macula", "Luteína y zeaxantina: el filtro de la mácula"),
    r("fe3_arandanos_yogur", { at: "junto con lacteos", kicker: "Con yogur = bloqueás el beneficio" }),
    dg("dg_fe3_calcio_bloquea", "El calcio bloquea la absorción (−30%)"),
    r("fe3_arandanos_nuez", { at: "una grasa saludable", kicker: "Con una nuez = se absorbe" }),
    c("bars", { title: "Absorción de luteína y zeaxantina", unit: "%", bars: [
      { label: "Con lácteos / sin grasa", value: 70, tone: "danger" },
      { label: "Con una grasa buena", value: 100, winner: true } ] }),
    r("fe3_palta_aceite", {}),
    dg("dg_fe3_grasa_absorcion", "Con grasa buena = mucha más absorción"),
    r("fe3_espinaca_plato", {}),
    r("fe3_leche_cereal", {}),
  ]},
  // ░░ ERROR 1 · azúcar / glicación ░░
  { key: "err1", phrase: "error numero uno", beats: [
    c("rule", { number: "★", title: "El pico de azúcar de la noche", w: 3.6 }),
    gl({}), // PizarraGlicacion — el cristalino que se opaca (avatar afuera)
    dg("dg_fe3_glicacion", "El azúcar se pega al cristalino y lo opaca"),
    c("callout", { image: "img/fe3_postre_noche.jpg", figure: "El error #1", caption: "Azúcar de noche → el cristalino se glica en silencio." }),
    r("fe3_postre_noche", { at: "termina en algo dulce" }),
    r("fe3_galletitas_te", {}),
    c("annotated", { image: "img/fe3_pan_fideos.jpg", eyebrow: "Cena pesada", caption: "Harinas + azúcar mantienen la glucosa alta toda la noche", annotations: [{ kind: "circle", x: 50, y: 55, label: "glucosa ↑ 8 h" }] }),
    r("fe3_pan_fideos", { at: "pesada en harinas" }),
    c("stat", { value: 1, prefix: "cristalino: proteínas de por ", suffix: " vida", label: "el daño por azúcar se ACUMULA, no se borra", eyebrow: "Por eso es tan grave" }),
    r("fe3_cena_liviana", { at: "la cena sea la comida mas liviana", kicker: "Cena liviana, sin azúcar de noche" }),
    r("fe3_sed_madrugada", {}),
  ]},
  { key: "err1caso", phrase: "te cuento el ultimo caso", beats: [
    c("quote", { image: "img/fe3_alberto_paciente.jpg", text: "A veces el ojo y el resto del cuerpo te mandan el *mismo mensaje*." }),
  ]},
  // ░░ PROTOCOLO ░░
  { key: "protocolo", phrase: "darte el otro lado", beats: [
    c("talk", {}),
    dg("dg_fe3_protocolo_noche", "Tu rutina de la noche, en 5 pasos"),
  ]},
  { key: "pasos", phrase: "paso 1 la cena", beats: [
    c("process", { title: "El protocolo de la noche", eyebrow: "5 pasos", steps: [
      { title: "Cena liviana", desc: "sin azúcar de noche", image: "img/fe3_cena_liviana.jpg" },
      { title: "Último vaso de agua", desc: "45 min antes", image: "img/fe3_toma_ultimo_vaso.jpg" },
      { title: "Frutos rojos + nuez", desc: "lejos de lácteos", image: "img/fe3_frutos_rojos_mesa.jpg" },
      { title: "Caminá 10-15 min", desc: "después de cenar", image: "img/fe3_camina_noche.jpg" } ] }),
    c("checklist", { title: "Antes de apagar la luz", items: [
      { text: "Pantallas apagadas, luz cálida", state: "done" },
      { text: "Dormí boca arriba o de costado", state: "done" },
      { text: "Un vaso de agua a mano", state: "done" } ] }),
    r("fe3_frutos_rojos_mesa", {}),
    r("fe3_chocolate_amargo", {}),
    r("fe3_camina_noche", { at: "camina diez o quince minutos", kicker: "Café/cena + caminata" }),
    r("fe3_apaga_celular", {}),
    r("fe3_duerme_tranquila", { hold: true }),
  ]},
  // ░░ DISCLAIMER (corto) ░░
  { key: "disclaimer", phrase: "y antes de despedirme", beats: [
    c("checklist", { title: "Importante", items: [
      { text: "Es información general, no un diagnóstico", state: "warn" },
      { text: "Vista que empeora rápido, manchas o destellos: al oftalmólogo", state: "warn" },
      { text: "Tensión, diabetes o medicación: tu médico", state: "warn" } ] }),
  ]},
  // ░░ CIERRE emocional ░░
  { key: "cierre", phrase: "la vista no es un detalle", beats: [
    c("talk", {}),
    r("fe3_cuento_nieto", { at: "leerle un cuento a tu nieto", hold: true }),
    r("fe3_reconoce_gente", {}),
    r("fe3_maneja_noche", {}),
    c("quote", { image: "img/fe3_mira_ventana_paz.jpg", text: "Cuidás la circulación de noche, *cuidás tu vista*." }),
  ]},
  // ░░ CTA ░░
  { key: "cta", phrase: "si esto te sirvio", beats: [
    c("chips", { bg: "image", image: "img/fe3_duerme_tranquila.jpg", imageDarken: 0.62, title: "Si te sirvió", chips: ["Dale me gusta", "Suscribite", "Compartilo"] }),
    c("nametag", { name: "Dr. Federer", role: "Cada semana, ciencia real para cuidarte después de los 60", image: "img/fe3_medico_consultorio.jpg" }),
  ]},
  { key: "close", phrase: "federer cuidate la vista", beats: [
    c("talk", {}),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer3.json", "utf8"));
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1922) + 2;

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
    else if (b.t === "raw") { beat.kind = "raw"; beat.src = `img/${b.name}.jpg`; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true; }
    else if (ANIM.has(b.t)) { beat.kind = b.t; }
    else { beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = sec.key;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
    }
    beats.push(beat);
  });
}

// ── PISO DE DURACIÓN de componentes ──
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "callout", "bars", "diagram", "rule", "nametag", "board", "pizarraojo", "pizaraglic", "relojnoche", "annotated", "cross", "process"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) {
  const i = compIx[k];
  const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END;
  const capDur = nextComp - beats[i].start - 0.1;
  beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2);
}

// ── ANCLAS del hook + close para el Main ──
const findWord = (w, after = 0) => { const t = norm(w); for (const cc of CW) if (cc.s >= after && cc.t === t) return cc.s; return null; };
const hookOjos = findWord("ojos", 3) ?? 4;

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/VideoEdit/federer3_beats.ts",
  `// AUTO-GENERADO por gen_federer3.mjs — beats crudos (imágenes fe3_*.jpg / dg_fe3_*.jpg ya en disco).\n` +
  `export const FED3_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/VideoEdit/federer3_hooks.ts",
  `// AUTO-GENERADO por gen_federer3.mjs — anclas del hook + rangos talk.\n` +
  `export const HOOKS3 = { ojos: ${hookOjos.toFixed(2)} };\n` +
  `export const TALKS3: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer3.json", JSON.stringify({ video: "federer3", avatar: "federer3_opt.mp4", theme: "medico", beats }, null, 1));

// ── QA: assets referenciados existen? ──
const need = new Set();
beats.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && need.add(s.image)); });
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));

if (missing.length) console.log(`⚠ frases no ancladas (${missing.length}):`, missing);
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100*raw/beats.length).toFixed(0)}%) · diagramas: ${kinds.diagram||0} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`assets referenciados: ${need.size} · faltantes: ${miss.length}`, miss.length ? miss : "");
