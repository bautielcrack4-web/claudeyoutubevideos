// clipsfirst_template.mjs — TEMPLATE CANÓNICO para videos CLIPS-FIRST (estilo "barcos",
// "hurón", "construcciones": documental/compilación de cientos de clips reales de YouTube
// matcheados a la narración, muy dinámico). Copialo a build_<slug>.mjs y llenalo.
//
// ▼▼ RECETA GANADORA (no reinventar — esto es lo que hizo el video de barcos "increíble") ▼▼
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
// 4b) ★ FALLBACK WEB-IMAGES (estándar, NO opcional): para TODO concepto que NO matcheó
//     clip (o cayó por _text>0.85), bajar una IMAGEN REAL de la web con fetch_bing.mjs
//     (DuckDuckGo, sin key) — castiga DURO texto/marca de agua (textMax>0.14 ⇒ ×0.06) y
//     rankea con CLIP por la frase, así "encaja perfecto y sin textos". Da variedad on-topic
//     en vez de REUSAR el mismo clip (queja del usuario: "dejás un clip 40s"). Receta:
//       node -e '... arma public/real/bing_<slug>.json = [{name,query,count:2}] de los
//                conceptos SIN public/broll/<name>.mp4 ...'
//       RANK_CANDS=12 node fetch_bing.mjs public/real/bing_<slug>.json   // → public/real/<name>.jpg
//     En el BUILD, prioridad por concepto (helper pickSrc): SU clip > SU imagen web > clip
//     ciclado del pool (último recurso). Así casi no se reusan clips y cae a ~0 IA de b-roll.
//     fetch_parallel y fetch_bing ambos por proxy/sin-IP. Incluir public/real/* en el tar del farm.
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

// ── AQUÍ van los clip()/img() del video, leyendo el guion beat por beat ──
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
