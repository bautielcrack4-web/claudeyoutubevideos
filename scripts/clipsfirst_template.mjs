// clipsfirst_template.mjs — TEMPLATE CANÓNICO para videos CLIPS-FIRST (estilo "barcos",
// "hurón", "construcciones": documental/compilación de cientos de clips reales de YouTube
// matcheados a la narración, muy dinámico). Copialo a build_<slug>.mjs y llenalo.
//
// ▼▼ RECETA GANADORA (no reinventar — esto es lo que hizo el video de barcos "increíble") ▼▼
//
// 0) ★★ REGLA #0, LA MÁS IMPORTANTE — ANCLAR TODO AL MS EXACTO DEL WHISPER ★★
//    CADA clip, imagen, componente y tarjeta cae en el milisegundo EXACTO donde el narrador
//    dice esa cosa, cortando en LÍMITES DE FRASE reales. NUNCA distribuir por matemática
//    (s0 + i*span/n) ni acumular dur a ojo (deriva) ni estimar. Usá los captions word-level:
//      const { at, seek, PHRASE_BOUNDS } = loadCaps(SLUG);  // ver helpers abajo
//      seek("frase exacta del guion");  // re-ancla T al ms real (estilo barcos seek)
//      clip(dur, name, query, concept); // y back-to-back desde ahí
//    El cuerpo: un clip por PHRASE_BOUNDS en orden de narración (shot[i]→frase[i]).
//    Hook/momentos clave: a mano frase→clip (si no hay exacto, el SIMILAR más cercano).
//    Esto es lo que distingue "editado a mano" de "robótico". Memoria: feedback_video_anchor_everything_ms.
//
// 1) PACING: corte cada ~2.5-5s. Dur PROMEDIO objetivo ~4.5-5s (barcos 5.1s, hurón 4.4s,
//    construcciones 3.6s). 7s+ se ve LENTO. Dos formas de lograrlo:
//      a) HAND-SET (estilo barcos): clip(dur, ...) con dur ~3s y back-to-back (T += dur).
//      b) GRILLA + MINGAP (estilo peroxide): ~3.2s de grilla y MINGAP ~3.4 → ~5s/clip.
//
// 2) QUERIES (lo MÁS importante): específicas, VISUALES y ancladas al TEMA. NUNCA la
//    palabra literal del narrador. "planté tomates el verano pasado" → query
//    "man planting tomatoes in a garden", NO "summer". query puede ser array de variantes.
//
// 3) MATCHEO = FARM EN LA NUBE con proxies (rápido y sin tu IP):
//      node scripts/matchfarm.mjs <slug> 24        # 24 runners; prepare cachea el modelo CLIP
//      # (matchfarm crashea en gh run watch por 401 → bajar a mano:
//      #  gh run download <RID> -n matched-<slug> -D public/broll )
//    El matcher (scripts/match_runner.mjs) ya RECHAZA texto quemado (subtítulos karaoke,
//    botón Subscribe) a nivel ventana, y música/lyric/cover por título.
//
// 4) DESCARGA: node scripts/fetch_parallel.mjs public/broll/clips_<slug>_matched.json
//    (por los 6 proxies). Filtrar antes _score<0.45 (matches malos).
//
// 5) AVATAR (si el video lo tiene): full en beats personales + PiP rotando en distintas
//    posiciones (cornerTR/BL/TL/L/R) sobre el b-roll → "avatar en distintas partes".
//
// 6) SIN filtros de color sobre el footage (regla dura). 7) Render = farm (render.yml).
//
// Memoria relacionada: feedback_video_clip_pacing, feedback_video_query_authoring,
// reference_matchclip_proxies, feedback_video_documental_clips_first, feedback_video_no_text_clips.
//
// ── HELPERS (de build_barcos.mjs) ────────────────────────────────────────────
import fs from "fs";

const SLUG = "REEMPLAZAR";       // <- slug del video
const AVATAR = `${SLUG}_opt.mp4`; // o null si es faceless
const B = [];                     // beats (cues)
const M = [];                     // match list (conceptos a matchear)
const seenM = new Set();
let T = 0, _id = 0;
const nid = (p) => `${p}${++_id}`;

// clip(dur, name, query, concept) — coloca un clip de YouTube de `dur` seg y avanza T.
// dur ~3-5s. query = string o array. concept = lo que se debe VER (anclado al tema).
const clip = (dur, name, query, concept, o = {}) => {
  B.push({ id: nid("c"), start: +T.toFixed(2), dur, kind: "raw", src: `broll/${name}.mp4`, hue: o.hue || "amber", ...(o.kicker ? { kicker: o.kicker } : {}) });
  if (!seenM.has(name)) { seenM.add(name); M.push({ name, query: Array.isArray(query) ? query : [query], concept, dur: Math.max(4, Math.ceil(dur) + 1) }); }
  T += dur;
};
// img(dur, name, query, concept) — foto real (public/real/*.jpg) en vez de clip.
const img = (dur, name, query, concept, o = {}) => {
  B.push({ id: nid("i"), start: +T.toFixed(2), dur, kind: "raw", src: `real/${name}.jpg`, hue: o.hue || "amber" });
  if (!seenM.has(name)) { seenM.add(name); M.push({ name, query: Array.isArray(query) ? query : [query], concept, dur: Math.max(4, Math.ceil(dur) + 1) }); }
  T += dur;
};

// ── ANCLAJE AL WHISPER (REGLA #0): captions word-level → at()/seek()/PHRASE_BOUNDS ──
// loadCaps(slug) lee public/captions_<slug>.json (whisper, con startMs/endMs/text):
//   at("frase")  → segundos EXACTOS donde arranca esa frase (throw si no está)
//   atc("frase") → igual pero null si no está (para componentes opcionales)
//   seek("frase")→ setea T = at("frase") (re-ancla la línea de tiempo, estilo barcos)
//   PHRASE_BOUNDS→ [seg] arranque de cada oración/cláusula (puntuación o pausa) = puntos de corte
const loadCaps = (slug) => {
  const caps = JSON.parse(fs.readFileSync(`public/captions_${slug}.json`, "utf8"));
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs }));
  const at = (phrase) => {
    const t = norm(phrase).split(" ");
    for (let i = 0; i <= Wc.length - t.length; i++) { let ok = 1; for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; } if (ok) return Wc[i].ms / 1000; }
    throw new Error("ANCHOR NOT FOUND: " + phrase);
  };
  const atc = (p) => { try { return at(p); } catch { console.warn("⚠ anchor missing:", p); return null; } };
  const seek = (p) => { T = at(p); return T; };
  const PHRASE_BOUNDS = [];
  for (let i = 0; i < caps.length; i++) {
    const prev = caps[i - 1];
    const punct = prev ? /[.,;:!?…]$/.test(prev.text.trim()) : true;
    const gap = prev ? caps[i].startMs - prev.endMs : 9999;
    if (i === 0 || punct || gap > 320) PHRASE_BOUNDS.push(caps[i].startMs / 1000);
  }
  return { caps, at, atc, seek, PHRASE_BOUNDS };
};

// ── AQUÍ van los clip()/img() del video, leyendo el guion beat por beat ──
// const { at, atc, seek, PHRASE_BOUNDS } = loadCaps(SLUG);
// seek("y entonces el barco desapareció");  // re-ancla al ms exacto
// clip(3.0, "abyss", ["descending into deep dark ocean"], "descending into the dark deep ocean");
// ...

// ── SALIDA: match list (modo match) o beatsheet (modo build) ─────────────────
const MODE = process.argv[2] === "match" ? "match" : "build";
fs.mkdirSync("public/broll", { recursive: true });
if (MODE === "match") {
  fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(M, null, 2));
  console.log(`match_${SLUG}.json: ${M.length} clips · dur prom ${(B.reduce((a, b) => a + b.dur, 0) / B.length).toFixed(1)}s`);
} else {
  // (en build real: filtrar a los broll/<name>.mp4 presentes, armar avatar windows, etc.)
  fs.mkdirSync("beatsheet", { recursive: true });
  fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, beats: B }, null, 2));
  console.log(`beatsheet/${SLUG}.json: ${B.length} beats`);
}
