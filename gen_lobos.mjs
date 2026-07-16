// gen_lobos.mjs — arma el beatsheet del documental "14 Lobos" (Planeta Reconstruido).
// Rutea cada ORACIÓN (mapa _v3/sentences_lobos.json, anclado al ms) a su clip por TEMA,
// con variedad; marca ventanas de AVATAR full; overlays de datos; componentes wow.
// Salida: public/lobos_beats.json  (lo consume Main_lobos.tsx)
import fs from "fs";
const FPS = 30;
const S = (ms) => Math.round((ms / 1000) * FPS);
const sents = JSON.parse(fs.readFileSync("_v3/sentences_lobos.json", "utf8"));

// ── pools temáticos (solo clips que existen en disco) ──────────────────────
const have = new Set(fs.readdirSync("public/broll").filter(f => /^lo_.*\.mp4$/.test(f)).map(f => f.replace(/\.mp4$/, "")));
// AUDITOR: clips con texto quemado / watermark / off-topic → NO usar
const BLOCK = new Set(["lo_lamar_grassland", "lo_wolf_winter_forest", "lo_elk_river_standing", "lo_elk_running_away", "lo_bald_eagle_fly", "lo_raven_snow", "lo_beaver_swim", "lo_trout_stream", "lo_pine_forest_wide", "lo_barren_overgrazed", "lo_valley_winter_wide", "lo_st_wolf4", "lo_st_elk3", "lo_st_meadow2", "lo_st_valley_river"]);
const P = (arr) => arr.filter(n => have.has(n) && !BLOCK.has(n));
const POOLS = {
  wolf: P(["lo_wolf_pack_running_snow","lo_wolf_walking_snow","lo_wolf_pack_line_snow","lo_wolf_closeup_stare","lo_wolf_pack_hill","lo_wolf_alpha_group","lo_wolf_run_camera","lo_wolf_face_snow","lo_st_wolf1","lo_st_wolf2","lo_st_wolf3","lo_st_wolf4"]),
  wolfDark: P(["lo_wolf_eyes_dark","lo_wolf_night_moon","lo_wolf_face_snow","lo_wolf_howl","lo_wolf_tracks_snow","lo_st_wolf2"]),
  wolfHunt: P(["lo_wolf_hunt_elk","lo_wolf_feeding_carcass","lo_wolf_ravens_carcass","lo_wolf_run_camera","lo_st_wolf3"]),
  wolfPups: P(["lo_wolf_pups_play","lo_wolf_alpha_group","lo_wolf_howl","lo_st_wolf4"]),
  elk: P(["lo_elk_herd_meadow","lo_elk_bull_antlers","lo_elk_winter_snow","lo_st_deer_river","lo_st_deer_forest","lo_st_elk2","lo_st_elk3","lo_st_deer2"]),
  beaver: P(["lo_beaver_dam","lo_beaver_carry_branch","lo_beaver_gnaw_tree","lo_beaver_pond_wetland","lo_st_beaver","lo_st_wetland_pond","lo_st_pond_life"]),
  river: P(["lo_st_aerial_river_forest","lo_st_river_bends_drone","lo_st_river_flow_forest","lo_st_river_meander2","lo_st_clear_creek","lo_st_forest_stream_calm","lo_st_waterfall","lo_willow_riverbank","lo_st_river2","lo_st_river3","lo_st_stream_moss","lo_st_valley_river"]),
  riverBad: P(["lo_st_muddy_river","lo_st_river_sediment"]),
  forest: P(["lo_aspen_grove","lo_willow_riverbank","lo_st_aspen_autumn","lo_st_forest_stream_calm","lo_st_pine_forest_aerial","lo_st_forest2","lo_st_forest3","lo_st_autumn","lo_st_aerial_forest","lo_st_dawn_forest"]),
  land: P(["lo_yellowstone_aerial_valley","lo_st_mountain_valley","lo_st_river_wide_valley","lo_dawn_valley_mist","lo_st_sunrise_mountains","lo_st_meadow_grass","lo_st_meadow2","lo_st_lake_reflect","lo_st_valley_river"]),
  snow: P(["lo_snow_falling_forest","lo_st_snow_falling_close","lo_st_snow_forest","lo_st_snowy_mountains","lo_st_snow2","lo_st_snow3"]),
  birds: P(["lo_songbird_branch","lo_st_bird_perched","lo_st_marsh_birds","lo_st_eagle_sky","lo_st_eagle2","lo_st_owl"]),
  fauna: P(["lo_st_grizzly","lo_fox_pounce_snow","lo_st_fox_snow","lo_st_trout_underwater","lo_st_otter","lo_st_fox2","lo_st_owl"]),
  human: P(["lo_st_cattle_ranch","lo_st_bison_snow","lo_wolf_night_moon"]),
};
POOLS.default = [...POOLS.land, ...POOLS.wolf];

// keyword → pool (orden = prioridad)
const RULES = [
  [/aull|howl/i, "wolfDark"],
  [/cazar|caz+ |caza|presa|matar|matan|mata|carro[ñn]a|resto|devor|come/i, "wolfHunt"],
  [/cachorr|cría|pups|criando/i, "wolfPups"],
  [/ojos|oscurid|noche|silueta|luna|miedo terror/i, "wolfDark"],
  [/lobo|lobos|depredador|manada|especie clave|piedra central|asesino/i, "wolf"],
  [/ciervo|siervo|wapit|elk|past/i, "elk"],
  [/castor|represa|ingenier|dique|estanqu/i, "beaver"],
  [/orilla.*derrumb|erosion|barro|sediment|desmoron|inútil|pelad|desierto|muert/i, "riverBad"],
  [/r[íi]o|r[íi]os|agua|cauce|meandro|caudal|corr[íi]a|fluir|fluy/i, "river"],
  [/sauce|[áa]lamo|[áa]rbol|brote|arbust|bosque|raíc|raíz/i, "forest"],
  [/p[áa]jaro|ave|aves|canto|cantor|[áa]guila|halc[óo]n/i, "birds"],
  [/oso|zorro|tejón|pez|peces|trucha|nutria|cuervo|escarabajo|insecto|anfibio/i, "fauna"],
  [/ganader|ganado|vaca|oveja|gobierno|recompensa|veneno|trampa|rifle|bounty|bison|búfal/i, "human"],
  [/yellowstone|parque|valle|paisaje|monta[ñn]a|llanura|pradera/i, "land"],
  [/nieve|invierno|fr[íi]o|helad/i, "snow"],
];
function poolFor(text) {
  for (const [re, k] of RULES) if (re.test(text)) return k;
  return "default";
}

// ── overlays de datos por cifra/lugar/frase ────────────────────────────────
function overlayFor(text) {
  const t = text.toLowerCase();
  if (/14 lobos|catorce lobos/.test(t)) return { type: "stat", value: "14", label: "LOBOS" };
  if (/1926/.test(t)) return { type: "stat", value: "1926", label: "EL ÚLTIMO LOBO" };
  if (/1995/.test(t)) return { type: "stat", value: "1995", label: "LA REINTRODUCCIÓN" };
  if (/setenta años|70 años/.test(t)) return { type: "stat", value: "70", label: "AÑOS SIN LOBOS" };
  if (/diecinueve mil|19\.?000|19 mil/.test(t)) return { type: "stat", value: "19.000", label: "CIERVOS" };
  if (/nueve colonias|9 colonias/.test(t)) return { type: "stat", value: "9", label: "COLONIAS DE CASTORES" };
  if (/(más de cien|cien lobos|100 lobos)/.test(t)) return { type: "stat", value: "100+", label: "LOBOS HOY" };
  if (/veinticinco años|25 años/.test(t)) return { type: "stat", value: "25", label: "AÑOS DESPUÉS" };
  if (/alberta|canad[áa]/.test(t)) return { type: "loc", label: "Alberta, Canadá" };
  if (/yellowstone/.test(t)) return { type: "loc", label: "Yellowstone, EE.UU." };
  if (/ecolog[íi]a del miedo/.test(t)) return { type: "phrase", text: "La *ecología* del *miedo*" };
  if (/cascada tr[óo]fica/.test(t)) return { type: "phrase", text: "Cascada *trófica*" };
  if (/especie clave/.test(t)) return { type: "phrase", text: "*Especie* clave" };
  return null;
}

// ── avatar full: frases de dirección + cadencia ────────────────────────────
const AV_TRIG = /quedate conmigo|tengo que ser honesto|por qué debería importarte|deténganse a pensar|la próxima vez que alguien|contame vos|conocías esta historia|suscr[íi]bete|nos vemos en el próximo|te voló la cabeza|piénsalo|escúchame/i;

// ── componentes wow en puntos narrativos ───────────────────────────────────
function compFor(text) {
  const t = text.toLowerCase();
  if (/cascada tr[óo]fica/.test(t)) return "cascade";
  if (/m[áa]s de cien lobos viven/.test(t)) return "spreadmap";
  if (/en 1926, los guardaparques/.test(t)) return "timeline";
  return null;
}

// ── construir beats ────────────────────────────────────────────────────────
const use = {}; const inc = (n) => (use[n] = (use[n] || 0) + 1);
function pick(pool, prev) {
  let cands = POOLS[pool] && POOLS[pool].length ? POOLS[pool] : POOLS.default;
  cands = cands.filter(n => n !== prev);
  if (!cands.length) cands = POOLS.default;
  cands.sort((a, b) => (use[a] || 0) - (use[b] || 0));
  const min = use[cands[0]] || 0;
  const top = cands.filter(n => (use[n] || 0) <= min + 1);
  return top[Math.floor((top.length) * ((use._n = (use._n || 0) + 0.61803) % 1))]; // jitter determinista
}

const beats = [];
let prev = null;
for (let i = 0; i < sents.length; i++) {
  const s = sents[i];
  const startMs = s.startMs, endMs = (sents[i + 1]?.startMs ?? s.endMs);
  const durF = Math.max(12, S(endMs) - S(startMs));
  const comp = compFor(s.text);
  const overlay = overlayFor(s.text);
  const isAvatar = AV_TRIG.test(s.text) || (i > 3 && i % 9 === 4 && !comp); // cadencia ~cada 9 oraciones
  if (comp) {
    beats.push({ from: S(startMs), dur: durF, kind: "comp", comp, overlay: null, text: s.text.slice(0, 60) });
  } else if (isAvatar) {
    beats.push({ from: S(startMs), dur: durF, kind: "avatar", overlay, text: s.text.slice(0, 60) });
  } else {
    const pool = poolFor(s.text);
    // partir oraciones largas: cada toma ≤~3.8s (evita cortes internos del clip + más dinámico)
    const parts = Math.max(1, Math.ceil(durF / S(3800)));
    const seg = Math.floor(durF / parts);
    for (let p = 0; p < parts; p++) {
      const src = pick(pool, prev); inc(src); prev = src;
      beats.push({ from: S(startMs) + p * seg, dur: p === parts - 1 ? durF - seg * p : seg, kind: "broll", src, pool, overlay: p === 0 ? overlay : null, text: s.text.slice(0, 50) });
    }
  }
}

const TOTAL = S(sents[sents.length - 1].endMs) + 30;
fs.writeFileSync("public/lobos_beats.json", JSON.stringify({ fps: FPS, total: TOTAL, beats }, null, 0));
// reporte
const cnt = {}; beats.forEach(b => b.src && (cnt[b.src] = (cnt[b.src] || 0) + 1));
const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 6);
console.log(`beats: ${beats.length} · avatar: ${beats.filter(b => b.kind === "avatar").length} · comp: ${beats.filter(b => b.kind === "comp").length} · broll: ${beats.filter(b => b.kind === "broll").length}`);
console.log(`overlays: ${beats.filter(b => b.overlay).length} · total frames: ${TOTAL} (${(TOTAL / FPS / 60).toFixed(1)} min)`);
console.log(`reuso máx:`, top.map(([n, c]) => `${n}:${c}`).join("  "));
