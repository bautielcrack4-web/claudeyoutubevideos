// restock_bad.mjs — reemplaza clips de STOCK que quedaron FUERA DE TEMA (terreno seco,
// pájaros, etc.) por stock de Pexels con queries CURADAS océano/submarino. Sobrescribe
// broll/<name>.mp4 solo de los nombres listados. Reusa la lógica Pexels de stockfallback.
//   node restock_bad.mjs
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envFile)) for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const KEY = process.env.PEXELS_API_KEY;
if (!KEY) { console.error("falta PEXELS_API_KEY"); process.exit(1); }
const FF = path.join(process.cwd(), "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe");
const OUT = "public/broll";
const CUES = JSON.parse(fs.readFileSync("src/VideoEdit/ciudades_cues.json", "utf8"));
const durOf = (n) => Math.max(4, Math.ceil(CUES.find((c) => c.name === n)?.dur ?? 6) + 1);

// nombre → queries curadas (concretas, on-theme; NADA de terreno seco)
const FIX = {
  intro_hundieron: ["powerful ocean waves storm", "huge wave sea dramatic"],
  intro_edad_hielo: ["glacier ice arctic", "iceberg frozen sea"],
  intro_llanuras: ["rocky sea coast cliff", "ocean coastline waves"],
  pv_guardo: ["underwater ancient ruins", "submerged stone ruins sea"],
  pr_nombre: ["old harbor sailing ships", "tall ship sea sunset"],
  pr_puerto: ["old sailing ship sea", "pirate ship ocean"],
  he_nilo: ["nile river aerial", "river delta meeting sea aerial"],
  yo_diez_mil: ["deep blue ocean underwater", "sunlight underwater deep"],
  cu_eran_estructuras: ["underwater stone structure dark", "deep sea rocks dark"],
  cu_bloques: ["underwater megalith stones", "underwater ruins blocks"],
  cu_dos_posibilidades: ["deep dark ocean abyss", "deep sea darkness"],
  cl_port_royal: ["underwater sunken ruins", "submerged city ruins diver"],
  cl_respuestas: ["deep ocean dark mysterious", "underwater light rays deep"],
};

const pickVideoFile = (files) => {
  const ok = files.filter((f) => f.file_type === "video/mp4").map((f) => ({ ...f, w: f.width || 0 })).sort((a, b) => a.w - b.w);
  const upTo1080 = ok.filter((f) => f.w <= 1920);
  return (upTo1080.length ? upTo1080[upTo1080.length - 1] : ok[ok.length - 1]) || null;
};
const dl = async (url, dest) => { const r = await fetch(url); if (!r.ok) throw new Error("dl " + r.status); fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer())); };
const searchVideo = async (q) => {
  const u = new URL("https://api.pexels.com/videos/search");
  u.searchParams.set("query", q); u.searchParams.set("orientation", "landscape");
  u.searchParams.set("per_page", "5"); u.searchParams.set("size", "medium");
  const r = await fetch(u, { headers: { Authorization: KEY } });
  if (!r.ok) return null;
  return ((await r.json()).videos || [])[0] || null;
};

let ok = 0, fail = 0;
for (const [name, queries] of Object.entries(FIX)) {
  const dest = path.join(OUT, `${name}.mp4`);
  const tmp = path.join(OUT, `_tmp_${name}.mp4`);
  let done = false;
  for (const q of queries) {
    const vid = await searchVideo(q);
    if (!vid) continue;
    const file = pickVideoFile(vid.video_files || []);
    if (!file) continue;
    try {
      await dl(file.link, tmp);
      // recortar a la duración del cue (loop si hace falta) y normalizar a 1920x1080
      const dur = durOf(name);
      const r = spawnSync(FF, ["-y", "-stream_loop", "-1", "-i", tmp, "-t", String(dur),
        "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080",
        "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", dest], { encoding: "utf8" });
      fs.rmSync(tmp, { force: true });
      if (r.status === 0 && fs.existsSync(dest)) { console.log(`✓ ${name}  ← "${q}"`); ok++; done = true; break; }
    } catch (e) { /* siguiente query */ }
  }
  if (!done) { console.log(`✗ ${name}  (sin stock on-theme)`); fail++; }
}
console.log(`\n=== re-stock dirigido: ${ok} OK · ${fail} fallos ===`);
