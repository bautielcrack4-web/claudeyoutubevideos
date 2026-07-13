// gen_federer4.mjs — beatsheet/federer4.json (Canal "Federer Archivos" · Video 4 PIERNAS).
// Avatar federer4_opt.mp4 (26:43). Anclaje por FRASE a captions_federer4.json.
// Look CLÍNICO (THEME_MEDICO). Imágenes gpt-image-2 (.png): fe4_*.png (fotos casuales) +
// dg_fe4_*.png (diagramas/láminas). Kit premium COMPLETO (≥90%). 3 injertos de venta a la guía.
// Diagramas → pantalla completa con el avatar AFUERA (DiagramBoard). Emite federer4_beats.ts + federer4_hooks.ts.
import fs from "fs";

// helpers de beat (imágenes gpt-image-2, ext .png) ────────────────────────────
const r  = (name, o = {}) => ({ t: "raw", name, ...o });        // foto fe4_*.png
const c  = (kind, props = {}) => ({ t: kind, ...props });
const dg = (name, _eyebrow, o = {}) => ({ t: "diagram", slides: [{ image: `img/${name}.png` }], ...o }); // diagrama full-screen; SIN eyebrow (el diagrama ya trae su texto adentro)
// ── KIT PREMIUM ──
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "warn", ...o });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o }); // o.flipPhrase = frase donde hace el flip
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "warn", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) }); // items:[{word,sub?,image?,tone,atPhrase}]
const ap = (items, o = {}) => ({ t: "avatarpizarra", items, ...o, at: o.at || (items[0] && items[0].atPhrase) }); // items:[{image?,caption?,card?,sub?,atPhrase}]
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const ge = (title, items, o = {}) => ({ t: "guardaesto", title, items, ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image: `img/${image}.png`, ...o });
const KIT = new Set(["errorstinger", "mitoverdad", "frasecinetica", "avatarkeyword", "avatarpizarra", "lowerthird", "guardaesto", "freezezoom"]);

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6 };

// ── SECCIONES (ancladas a frases reales del transcript) ──────────────────────
const SECTIONS = [
  // ░░ HOOK ░░ — avatar abre ~1.3s; scrim "PIERNAS" encima
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    r("fe4_piernas_pesadas_sillon", { at: "las piernas pesadas" }),
    r("fe4_masajea_pantorrilla", { at: "masajear las pantorrillas" }),
    r("fe4_tobillo_marca_media", { at: "la marca del elastico" }),
    r("fe4_pies_frios_manta", { at: "se te enfrian las piernas" }),
    r("fe4_calambre_madrugada", { at: "un calambre en el gemelo", hold: true }),
  ]},
  { key: "reframe", phrase: "la mayoria de la gente cree", beats: [
    mv("Es la edad, hay que aguantarse", "Es tu circulación de retorno", { flipPhrase: "esta en tu circulacion" }),
    r("fe4_mira_piernas_preocupado", {}),
  ]},
  { key: "contramano", phrase: "tus piernas son el lugar", beats: [
    fc([{ t: "La" }, { t: "sangre" }, { t: "baja" }, { t: "fácil" }, { t: "subir" }, { t: "es" }, { t: "el", }, { t: "drama", hl: true }], { tone: "warn", at: "en contra de la gravedad" }),
    c("chips", { bg: "image", image: "img/fe4_piernas_pesadas_sillon.png", imageDarken: 0.6, title: "Hoy vas a entender", chips: ["Por qué se hinchan y enfrían", "Los 6 errores", "Los 5 pasos para reactivarlas"] }),
  ]},
  // ░░ IDENTIDAD ░░
  { key: "presenta", phrase: "federer hace mas de una", beats: [
    c("nametag", { name: "Dr. Federer", role: "Médico · más de una década de consultorio", image: "img/fe4_medico_consultorio.png" }),
    c("quote", { image: "img/fe4_paciente_piernas.png", text: "Doctor, se me hinchan las piernas y las siento *cansadas* todo el día." }),
    r("fe4_don_ernesto_plaza", { at: "no salia a caminar", kicker: "«Ya no llego a la plaza»" }),
  ]},
  { key: "comentario", phrase: "antes de seguir te pido", beats: [
    lt("Contame: ¿a qué hora se te hinchan?", { kicker: "En los comentarios", desc: "¿A la mañana o a la tarde? Me dice qué tipo de hinchazón tenés.", tone: "teal", at: "a que hora del dia" }),
  ]},
  // ░░ MECANISMO ░░ — la parte más importante
  { key: "mecanismo", phrase: "tu corazon empuja la sangre", beats: [
    dg("dg_fe4_gravedad_sangre", "Baja fácil; subir es el drama"),
    fz("fe4_pantorrilla_musculo", { x: 0.5, y: 0.6, label: "La pantorrilla", zoom: 1.9, tone: "teal", at: "esa segunda bomba" }),
    dg("dg_fe4_segundo_corazon", "La pantorrilla = tu «segundo corazón»"),
  ]},
  { key: "valvulas", phrase: "unas valvulas chiquititas", beats: [
    ap([
      { image: "img/fe4_camina_bombea.png", eyebrow: "Al caminar", caption: "Los gemelos exprimen las venas hacia arriba", atPhrase: "cada vez que caminas" },
      { card: "Válvulas", sub: "puertitas de una sola dirección que suben la sangre", atPhrase: "puertitas de una sola" },
      { card: "Con los años", sub: "cierran mal → la sangre cae y se estanca", atPhrase: "vuelve a caer" },
    ], {}),
    dg("dg_fe4_valvulas", "Válvulas que se aflojan = sangre que retrocede"),
  ]},
  { key: "capilares", phrase: "cuando la sangre llega", beats: [
    dg("dg_fe4_capilares_oxido", "El óxido nítrico abre los capilares"),
    r("fe4_pies_frios_manta", { at: "pies frios aunque estes" }),
  ]},
  { key: "linfa", phrase: "circula otro liquido", beats: [
    dg("dg_fe4_linfa", "La linfa: el otro drenaje que se estanca"),
  ]},
  { key: "mechpay", phrase: "significa todo esto", beats: [
    fc([{ t: "Reactivá" }, { t: "la" }, { t: "bomba" }, { t: "abrí" }, { t: "los", }, { t: "capilares", hl: true }], { tone: "teal" }),
  ]},
  // ░░ INJERTO DE VENTA #1 (tras el mecanismo) ░░
  { key: "cta1", phrase: "todo esto que te voy a ensenar", beats: [
    lt("La Guía Completa de la Salud +60", { kicker: "Todo esto, ordenado", desc: "El enlace está abajo, en la descripción y el primer comentario.", tone: "teal", at: "el enlace abajo" }),
  ]},
  // ░░ SELF-TEST (dos tipos de hinchazón) ░░
  { key: "selftest", phrase: "los medicos dividimos la hinchazon", beats: [
    dg("dg_fe4_dos_tipos", "Dos tipos de hinchazón"),
    c("board", { eyebrow: "¿Cuál es tu caso?", title: "Tu hinchazón", side: "left", items: [
      { title: "«La de la tarde»", sub: "aparece de día, mejora al descansar → venosa (la de hoy)", tone: "teal" },
      { title: "Señal roja", sub: "UNA pierna, dura, caliente, dolorosa → al médico YA", tone: "coral" },
      { title: "Pistas", sub: "marca de la media, zapato apretado a la tarde", tone: "blue" },
    ] }),
  ]},
  // ░░ ERRORES (6 → 1) ░░
  { key: "err6", phrase: "error numero 6", beats: [
    es("06", "Pies quietos y colgando todo el día", { w: 4.0 }),
    r("fe4_sentado_tv_pies", { at: "estas sentado horas" }),
    dg("dg_fe4_bomba_apagada", "Bomba apagada = sangre que se junta abajo"),
    c("bars", { title: "La sangre se acumula abajo", unit: "", bars: [
      { label: "Moviéndote (bomba activa)", value: 100, winner: true },
      { label: "Quieto (bomba apagada)", value: 50, tone: "danger", note: "se estanca" } ] }),
    r("fe4_zapato_apretado", { at: "el zapato" }),
    c("splitlist", { title: "Cómo corregirlo", items: ["Mové los tobillos cada media hora", "Subí y bajá las puntas 20-30 veces", "Levantate y caminá 1 minuto"], palette: "G" }),
    r("fe4_bombeo_tobillos", { at: "subi y baja las puntas", kicker: "El bombeo de tobillos" }),
  ]},
  { key: "err5", phrase: "error numero 5", beats: [
    es("05", "Cruzar las piernas por horas", { w: 4.0 }),
    r("fe4_cruza_piernas", { at: "cruzas una pierna" }),
    dg("dg_fe4_manguera", "Cruzar = pisar la manguera"),
    c("callout", { image: "img/fe4_cruza_piernas.png", figure: "Como pisar una manguera", caption: "Apretás las venas y frenás el retorno de la sangre." }),
    r("fe4_pierna_dormida", { at: "se te duerme" }),
  ]},
  { key: "err4", phrase: "error numero 4", beats: [
    es("04", "La sal escondida", { w: 4.2 }),
    dg("dg_fe4_sal_agua", "La sal retiene agua → más hinchazón"),
    c("annotated", { image: "img/fe4_fiambre_pan_mesa.png", eyebrow: "La sal escondida", caption: "Fiambre, pan, caldito, conservas: ahí está el 90% de la sal", annotations: [{ kind: "circle", x: 50, y: 52, label: "sodio oculto" }] }),
    ap([
      { image: "img/fe4_fiambre_embutidos.png", eyebrow: "El error", caption: "Fiambre y comida de paquete", atPhrase: "el fiambre" },
      { image: "img/fe4_banana_papa_palta.png", eyebrow: "El contrapeso", caption: "Potasio: banana, papa, palta, tomate", atPhrase: "ricos en potasio" },
    ], {}),
    c("splitlist", { title: "Bajá la hinchazón", items: ["Menos fiambre y de paquete", "Cociná más en casa", "Sumá potasio (banana, papa, palta)"], palette: "D" }),
    r("fe4_banana_papa_palta", {}),
  ]},
  { key: "err3", phrase: "error numero 3", beats: [
    es("03", "Tomar poca agua «para no hincharte»", { w: 4.0 }),
    dg("dg_fe4_poca_agua", "Poca agua = sangre espesa + más retención"),
    c("bars", { title: "Cómo circula la sangre", unit: "", bars: [
      { label: "Bien hidratado (fluida)", value: 100, winner: true },
      { label: "Deshidratado (espesa)", value: 55, tone: "danger", note: "y retenés más" } ] }),
    r("fe4_orina_clara_vaso", { at: "tu orina es amarilla" }),
    r("fe4_vaso_agua_dia", { at: "agua a lo largo", kicker: "Hasta que la orina salga clara" }),
  ]},
  { key: "err2", phrase: "error numero 2", beats: [
    es("02", "No descansar nunca las piernas en alto", { w: 4.2 }),
    c("headline", { tokens: ["Tus", "piernas", "pelean", "contra", "la", { t: "gravedad" }], eyebrow: "Todo el día, cada minuto", bg: "image", image: "img/fe4_piernas_gravedad.png", at: "durante todo el dia cada hora" }),
    r("fe4_piernas_en_alto_pared", { at: "poné las piernas en alto", kicker: "Pies más altos que el corazón" }),
    dg("dg_fe4_gravedad_favor", "Ahora la gravedad drena a tu favor"),
    c("callout", { image: "img/fe4_piernas_en_alto_pared.png", figure: "15 min", caption: "Una o dos veces al día, sobre todo a la tarde." }),
    r("fe4_piernas_vacian_sillon", {}),
  ]},
  { key: "err1", phrase: "error numero uno", beats: [
    es("★", "La vida cada vez más quieta", { w: 3.6 }),
    ak([{ word: "CÍRCULO VICIOSO", sub: "te pesan → te movés menos → te pesan más", tone: "warn", atPhrase: "un circulo" }], {}),
    fc([{ t: "Te" }, { t: "pesan" }, { t: "te" }, { t: "movés", hl: true }, { t: "menos" }, { t: "te" }, { t: "pesan" }, { t: "más", hl: true }], { tone: "warn" }),
    dg("dg_fe4_circulo_vicioso", "El círculo que se muerde la cola"),
    r("fe4_menos_caminatas", { at: "caminas claramente menos" }),
  ]},
  // ░░ INJERTO DE VENTA #2 (antes de los pasos) ░░
  { key: "cta2", phrase: "estos cinco pasos que te voy a dar", beats: [
    c("chips", { bg: "image", image: "img/fe4_guia_celular.png", imageDarken: 0.62, title: "La Guía Completa de la Salud +60", chips: ["150 remedios y rutinas", "Sección de señales de alerta", "archivos-federer.vercel.app"] }),
  ]},
  // ░░ PROTOCOLO — 5 pasos ░░
  { key: "pasos", phrase: "aca van los cinco pasos", beats: [
    c("process", { title: "Reactivá tus piernas", eyebrow: "5 pasos", steps: [
      { title: "Bombeo de tobillos", desc: "varias veces al día", image: "img/fe4_bombeo_tobillos.png" },
      { title: "Caminá repartido", desc: "10 min, 3 veces", image: "img/fe4_camina_cuadra.png" },
      { title: "Piernas en alto", desc: "15 min, a la tarde", image: "img/fe4_piernas_en_alto_pared.png" },
      { title: "Agua + potasio", desc: "menos sal", image: "img/fe4_banana_papa_palta.png" } ] }),
    ge("Reactivá tus piernas", [
      { text: "Bombeo de tobillos varias veces al día", image: "img/fe4_bombeo_tobillos.png" },
      { text: "Caminá 10 min, 3 veces", image: "img/fe4_camina_cuadra.png" },
      { text: "Piernas en alto 15 min", image: "img/fe4_piernas_en_alto_pared.png" },
      { text: "Agua hasta orina clara", image: "img/fe4_vaso_agua_dia.png" },
      { text: "Menos sal + más potasio", image: "img/fe4_banana_papa_palta.png" },
    ], { at: "cinco pasos" }),
    r("fe4_verduras_verdes_remolacha", { at: "verduras de hoja verde" }),
    r("fe4_medias_lana_pies", { at: "abrigar bien los pies" }),
    r("fe4_camina_cuadra", { at: "caminar diez minutos", kicker: "Repartido, no todo junto" }),
  ]},
  { key: "misma", phrase: "fijate algo hermoso", beats: [
    c("headline", { tokens: ["Cuidás", "las", "piernas", "cuidás", { t: "todo" }], eyebrow: "Es todo la misma circulación", bg: "image", image: "img/fe4_cuerpo_entero_sano.png" }),
    c("quote", { image: "img/fe4_cuerpo_entero_sano.png", text: "Es todo *la misma circulación*." }),
  ]},
  // ░░ SEÑALES DE ALERTA (alimenta el bono) ░░
  { key: "senales", phrase: "volver si o si a las", beats: [
    lt("Señales de alerta — al médico", { kicker: "Importante", desc: "Una pierna hinchada, dura, caliente y dolorosa: no esperes.", tone: "warn", at: "una sola pierna" }),
    c("checklist", { title: "No lo trates en casa", items: [
      { text: "Una pierna hinchada de golpe, dura, caliente y dolorosa", state: "warn" },
      { text: "Hinchazón con falta de aire o corazón acelerado", state: "warn" },
      { text: "Una llaga en el pie o el tobillo que no cierra", state: "warn" },
      { text: "Dolor en la pantorrilla al caminar que te obliga a parar", state: "warn" } ] }),
  ]},
  // ░░ INJERTO DE VENTA #3 + cierre ░░
  { key: "cta3", phrase: "junte todo lo que enseno", beats: [
    c("chips", { bg: "image", image: "img/fe4_guia_celular.png", imageDarken: 0.62, title: "La Guía Completa de la Salud +60", chips: ["150 remedios, recetas y rutinas", "Sección de señales de alerta", "archivos-federer.vercel.app"] }),
    ge("En la guía tenés", [
      { text: "Los pasos para las piernas, el corazón y la vista", image: "img/fe4_guia_celular.png" },
      { text: "La circulación entera, con recetas", image: "img/fe4_banana_papa_palta.png" },
      { text: "Una sección de señales de alerta", image: "img/fe4_medico_consultorio.png" },
    ], { at: "la guia completa" }),
  ]},
  { key: "cta", phrase: "decime en los comentarios", beats: [
    c("chips", { bg: "image", image: "img/fe4_camina_plaza_feliz.png", imageDarken: 0.62, title: "Si te sirvió", chips: ["Dale me gusta", "Suscribite", "Compartilo"] }),
    c("nametag", { name: "Dr. Federer", role: "Cada semana, ciencia real para cuidarte después de los 60", image: "img/fe4_medico_consultorio.png" }),
  ]},
  { key: "cierre", phrase: "cuida esas piernas", beats: [
    c("talk", {}),
    r("fe4_camina_plaza_feliz", { hold: true }),
    r("fe4_piernas_livianas", {}),
    c("quote", { image: "img/fe4_piernas_livianas.png", text: "Reactivás la bomba, *te movés liviano* de nuevo." }),
  ]},
  { key: "close", phrase: "pronto un abrazo", beats: [
    c("talk", {}),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado federer3) ────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer4.json", "utf8"));
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1603) + 2;

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

// ── POST-PASS "MILIMÉTRICO": resolver sub-ítems al ms EXACTO del avatar ───────
const KIT_CLIPS = []; // avatarpizarra/keyword → clip de avatar pre-extraído (farm-safe)
for (const beat of beats) {
  if (beat.kind === "avatarpizarra" || beat.kind === "avatarkeyword") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...rest } = it; return { ...rest, at: atF };
    });
    // clamp: si los ítems quedaron muy separados (>11s por atPhrase lejano), re-espaciar parejo (~3s c/u)
    const GAP = 90;
    if (last > 300) {
      beat.items = beat.items.map((it, i) => ({ ...it, at: i * GAP }));
      last = (beat.items.length - 1) * GAP;
    }
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
    beat.flipAt = f;
    delete beat.flipPhrase;
  }
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_federer4.json", JSON.stringify(KIT_CLIPS, null, 1));

// ── PISO DE DURACIÓN de componentes ──
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "callout", "bars", "diagram", "rule", "nametag", "board", "annotated", "cross", "process", "lowerthird", "guardaesto", "errorstinger", "mitoverdad", "frasecinetica", "freezezoom"]);
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
const hookPiernas = findWord("piernas", 2) ?? 3;

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/VideoEdit/federer4_beats.ts",
  `// AUTO-GENERADO por gen_federer4.mjs — beats crudos (imágenes fe4_*.png / dg_fe4_*.png).\n` +
  `export const FED4_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/VideoEdit/federer4_hooks.ts",
  `// AUTO-GENERADO por gen_federer4.mjs — anclas del hook + rangos talk.\n` +
  `export const HOOKS4 = { piernas: ${hookPiernas.toFixed(2)} };\n` +
  `export const TALKS4: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer4.json", JSON.stringify({ video: "federer4", avatar: "federer4_opt.mp4", theme: "medico", beats }, null, 1));

// ── QA: assets referenciados + resumen ──
const need = new Set();
beats.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && need.add(s.image)); if (Array.isArray(b.items)) b.items.forEach((it) => it && it.image && need.add(it.image)); if (Array.isArray(b.steps)) b.steps.forEach((s) => s.image && need.add(s.image)); });
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));

if (missing.length) console.log(`⚠ frases no ancladas (${missing.length}):`, missing);
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100*raw/beats.length).toFixed(0)}%) · diagramas: ${kinds.diagram||0} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`assets referenciados: ${need.size} · faltantes: ${miss.length}`);
