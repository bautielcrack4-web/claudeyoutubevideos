// build_comidas.mjs — arma beatsheet/comidas.json para "25 Comidas Olvidadas".
// Nicho de footage ESCASO → clip-forward por CONSTRUCCIÓN: cada beat con clip propio lo
// usa; los demás ROTAN por el pool ON-TOPIC de su comida (clips limpios de esa comida +
// fotos nostálgicas limpias), eligiendo el MENOS usado (variedad sin off-topic ni repetir).
// Overlays: topcomida (N.º N · de 25 · <comida>) al inicio de cada comida.
import fs from "fs";
import { execFileSync } from "child_process";

const R = "public/";
const has = (rel) => fs.existsSync(R + rel);
const FFPROBE = "node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe";
const _res = {};
function needsBlurFill(rel) {
  if (!/\.(mp4|webm|mov)$/i.test(rel)) return false;
  if (!(rel in _res)) {
    try {
      const out = execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", R + rel], { encoding: "utf8" }).trim();
      const [w, h] = out.split(",").map(Number); _res[rel] = w && h ? { w, h } : null;
    } catch { _res[rel] = null; }
  }
  const r = _res[rel];
  return r ? (r.h > r.w || r.w < 1280) : false;
}

const beats = JSON.parse(fs.readFileSync("_v3/comidas_authored.json", "utf8"));       // name, ms, dur, src, desc, shot
const mealStarts = JSON.parse(fs.readFileSync("_v3/comidas_meal_starts.json", "utf8")); // {n:{title,ms}}
const clean = new Set(JSON.parse(fs.readFileSync("_v3/comidas_clean.json", "utf8")));   // nombres de clips LIMPIOS
// fotos LIMPIAS (nostálgicas nost_ + vintage vin_, de sus verdicts de verificación)
const okPhotos = new Set();
if (fs.existsSync("_v3/nost_verdicts.json")) { const v = JSON.parse(fs.readFileSync("_v3/nost_verdicts.json", "utf8")); for (const k in v) if (v[k].ok) okPhotos.add(k); }
if (fs.existsSync("_v3/photo_verify")) for (const f of fs.readdirSync("_v3/photo_verify").filter((x) => /verdicts_\d+\.json/.test(x))) { const v = JSON.parse(fs.readFileSync("_v3/photo_verify/" + f, "utf8")); for (const k in v) if (v[k].ok) okPhotos.add(k); }
const PHOTOS_ALL = [...okPhotos].filter((k) => has("real/" + k)).map((k) => "real/" + k);

// ── comida de cada beat (por ms: la comida cuyo start es el último ≤ ms del beat) ──
const mealOf = (ms) => {
  let cur = 0;
  for (let n = 1; n <= 25; n++) { const s = mealStarts[n]; if (s && s.ms != null && s.ms <= ms + 300) cur = n; }
  return cur; // 0 = intro
};
// pool de clips limpios por comida (los beats con clip propio y limpio)
const clipOf = (name) => (clean.has(name) && has("broll/" + name + ".mp4")) ? "broll/" + name + ".mp4" : null;
const mealClips = {}; // n -> [broll/...]
for (const b of beats) { const c = clipOf(b.name); if (c) { const n = mealOf(b.ms); (mealClips[n] = mealClips[n] || []).push(c); } }

const useCount = {};
const pickLeast = (pool) => {
  if (!pool || !pool.length) return null;
  let best = null, bn = Infinity;
  for (const a of pool) { const c = useCount[a] || 0; if (c < bn) { bn = c; best = a; } }
  if (best) useCount[best] = (useCount[best] || 0) + 1;
  return best;
};

// ── capa RAW contigua (dur = hueco hasta el próximo beat) ──
const AUDIO_END = 1019;
const SAFE = [1.04, 1.06];
const sorted = [...beats].sort((a, z) => a.ms - z.ms);
const raw = [];
for (let i = 0; i < sorted.length; i++) {
  const b = sorted[i];
  const start = +(b.ms / 1000).toFixed(2);
  const nxt = i + 1 < sorted.length ? sorted[i + 1].ms / 1000 : AUDIO_END;
  const dur = +Math.max(0.5, nxt - b.ms / 1000).toFixed(2);
  const n = mealOf(b.ms);
  let src;
  const own = clipOf(b.name);
  if (own) src = own;                                        // 1) clip propio limpio
  else {
    // 2) pool on-topic de la comida (clips limpios de esa comida) + fotos nostálgicas
    const pool = [...(mealClips[n] || []), ...PHOTOS_ALL];
    src = pickLeast(pool) || PHOTOS_ALL[0] || (mealClips[n] && mealClips[n][0]);
  }
  const isClip = /\.(mp4|webm|mov)$/i.test(src);
  const beat = { id: b.name, kind: "raw", src, start, dur, hue: "amber" };
  if (isClip) { if (needsBlurFill(src)) beat.fit = "blur"; else beat.zoom = SAFE; }
  raw.push(beat);
}

// ── overlays: topcomida al inicio de cada comida (reusa el componente topdulce) ──
const overlays = [];
const bgForMeal = (n) => (mealClips[n] && mealClips[n][0]) || PHOTOS_ALL[0];
for (let n = 1; n <= 25; n++) {
  const s = mealStarts[n]; if (!s || s.ms == null) continue;
  overlays.push({
    id: `top_${n}`, kind: "topdulce", index: n, total: 25,
    title: s.title, image: bgForMeal(n), start: +Math.max(0, s.ms / 1000 - 1.0).toFixed(2), dur: 4, overlay: true,
  });
}

const all = [...raw, ...overlays.filter((o) => o.start + (o.dur || 4) <= AUDIO_END)];
const seen = new Set(); const out = [];
for (const b of all.sort((a, z) => a.start - z.start)) { let id = b.id, k = 1; while (seen.has(id)) id = `${b.id}_${k++}`; seen.add(id); out.push({ ...b, id }); }
fs.writeFileSync("beatsheet/comidas.json", JSON.stringify({ video: "comidas", beats: out }, null, 1));

const nClip = raw.filter((b) => /\.(mp4|webm|mov)$/i.test(b.src)).length;
const uniq = new Set(raw.map((b) => b.src)).size;
console.log("=== build_comidas ===");
console.log(`beats raw: ${raw.length} (clip: ${nClip}, foto: ${raw.length - nClip}) · assets únicos: ${uniq} · ratio ${(raw.length / uniq).toFixed(2)}`);
console.log(`clips limpios: ${clean.size} · fotos nostálgicas: ${PHOTOS_ALL.length} · overlays: ${overlays.length}`);
console.log("→ beatsheet/comidas.json");
