// rematch_ciudades.mjs — arma match_ciudadesB.json SOLO para los conceptos que el farm
// no matcheó (o matcheó con score bajo), con queries MÁS AMPLIAS (genéricas de buceo/
// ruinas/océano por sección) → mucho más fáciles de encontrar en YouTube. Mantiene el
// concept original (lo usa el CLIP para puntuar). Luego: matchfarm ciudadesB → merge.
import fs from "fs";

const THR = 0.30; // por debajo de esto lo tratamos como "no matcheado"
const all = JSON.parse(fs.readFileSync("public/broll/match_ciudades.json", "utf8")); // 181 con concept+query
const matched = JSON.parse(fs.readFileSync("public/broll/clips_ciudades_matched.json", "utf8"));
const score = new Map(matched.map((m) => [m.name, m._score ?? 0]));

const sec = (n) => { for (const k of ["pv", "pr", "ba", "dw", "he", "yo", "cu", "cl"]) if (n.startsWith(k + "_")) return k; return "intro"; };

// pools genéricos por sección — footage que SÍ abunda en YouTube
const BROAD = {
  intro: ["underwater ancient ruins", "scuba diver deep blue ocean", "sunken city underwater", "ocean floor seabed", "aerial ocean coast"],
  pv: ["underwater ancient ruins clear water", "submerged stone ruins diver", "scuba diver over ruins", "ancient greek ruins", "shallow turquoise sea aerial"],
  pr: ["underwater ruins murky", "old town earthquake destruction", "shipwreck underwater", "stormy dark sea", "colonial ruins"],
  ba: ["underwater roman ruins", "submerged statue underwater", "scuba diver stone columns", "roman ruins mediterranean", "underwater mosaic"],
  dw: ["underwater stone blocks", "marine archaeology divers", "submerged ruins ocean", "ancient india temple", "diver discovering ruins"],
  he: ["underwater statue seabed", "submerged temple ruins", "ancient egyptian statue", "diver colossal statue", "shipwreck seabed"],
  yo: ["underwater rock formation", "diver underwater cliff terraces", "rocky seabed structure", "underwater monument", "deep blue ocean rocks"],
  cu: ["deep dark ocean abyss", "sonar seabed scan", "underwater pyramid structure", "deep sea exploration dark", "geometric ruins underwater"],
  cl: ["underwater ruins cinematic", "deep ocean light rays", "sunken ruins seabed", "antarctica ice aerial", "ocean abyss dark"],
};

const out = [];
for (const a of all) {
  const s = score.get(a.name);
  if (s != null && s >= THR) continue; // ya tiene clip bueno
  const k = sec(a.name);
  const broad = BROAD[k];
  // 2 queries originales + 3 amplias de la sección (rotando por hash del nombre para variar)
  const h = [...a.name].reduce((x, c) => x + c.charCodeAt(0), 0);
  const picks = [broad[h % broad.length], broad[(h + 2) % broad.length], broad[(h + 4) % broad.length]];
  out.push({ name: a.name, query: [...new Set([...(a.query || []).slice(0, 1), ...picks])], concept: a.concept, dur: a.dur });
}
fs.writeFileSync("public/broll/match_ciudadesB.json", JSON.stringify(out, null, 1));
console.log(`re-match: ${out.length} conceptos faltantes → match_ciudadesB.json (queries amplias)`);
