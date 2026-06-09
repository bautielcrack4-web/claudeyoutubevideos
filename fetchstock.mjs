// fetchstock.mjs — baja b-roll de stock (videos y fotos) desde Pexels POR TEXTO.
// Yo armo la query desde el guion, así sé qué es cada clip sin mirarlo: 0 tokens
// de visión. Lee una lista de tomas y deja los archivos en public/broll/<nombre>.
//
// Requisitos:
//   - API key GRATIS de Pexels (https://www.pexels.com/api/). Pasala por:
//       set PEXELS_API_KEY=xxxx   (o en un archivo .env con PEXELS_API_KEY=xxxx)
//
// Lista de tomas — public/broll/shots.json:
//   [
//     { "name": "mosquito_larvas", "query": "mosquito larvae water", "type": "video", "orientation": "landscape" },
//     { "name": "abeja_flor",      "query": "honey bee flower",      "type": "photo" }
//   ]
//
// Uso:
//   node fetchstock.mjs [shots.json=public/broll/shots.json] [outDir=public/broll]
import fs from "fs";
import path from "path";

// .env mínimo (sin dependencias)
const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) {
  console.error("Falta PEXELS_API_KEY (gratis en https://www.pexels.com/api/).");
  process.exit(1);
}

const [shotsArg, outArg] = process.argv.slice(2);
const SHOTS = shotsArg || "public/broll/shots.json";
const OUT = outArg || "public/broll";
fs.mkdirSync(OUT, { recursive: true });

if (!fs.existsSync(SHOTS)) {
  console.error("No existe la lista de tomas:", SHOTS);
  process.exit(1);
}
const shots = JSON.parse(fs.readFileSync(SHOTS, "utf8"));

const headers = { Authorization: KEY };

// Elige el mejor archivo de video: HD, lo más cerca de 1920x1080 sin pasarse.
const pickVideoFile = (files) => {
  const ok = files
    .filter((f) => f.file_type === "video/mp4")
    .map((f) => ({ ...f, w: f.width || 0 }))
    .sort((a, b) => a.w - b.w);
  const upTo1080 = ok.filter((f) => f.w <= 1920);
  return (upTo1080.length ? upTo1080[upTo1080.length - 1] : ok[ok.length - 1]) || null;
};

const download = async (url, dest) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error("download " + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
};

const index = [];
for (const shot of shots) {
  const { name, query, type = "video", orientation = "landscape" } = shot;
  const ext = type === "video" ? "mp4" : "jpg";
  const dest = path.join(OUT, `${name}.${ext}`);
  if (fs.existsSync(dest)) {
    console.log(`= ya existe  ${name}.${ext}`);
    index.push({ name, query, type, file: `${name}.${ext}`, skipped: true });
    continue;
  }
  try {
    const base =
      type === "video"
        ? "https://api.pexels.com/videos/search"
        : "https://api.pexels.com/v1/search";
    const u = new URL(base);
    u.searchParams.set("query", query);
    u.searchParams.set("orientation", orientation);
    u.searchParams.set("per_page", "5");
    if (type === "video") u.searchParams.set("size", "medium");
    const res = await fetch(u, { headers });
    if (!res.ok) throw new Error("API " + res.status + " " + (await res.text()).slice(0, 120));
    const data = await res.json();

    if (type === "video") {
      const vid = (data.videos || [])[0];
      if (!vid) throw new Error("sin resultados");
      const vf = pickVideoFile(vid.video_files);
      if (!vf) throw new Error("sin mp4");
      const bytes = await download(vf.link, dest);
      console.log(`↓ video  ${name}.mp4  ${(bytes / 1e6).toFixed(1)}MB  ${vf.width}x${vf.height} ${vid.duration}s`);
      index.push({ name, query, type, file: `${name}.mp4`, pexels_id: vid.id, w: vf.width, h: vf.height, durationSec: vid.duration, by: vid.user?.name, url: vid.url });
    } else {
      const ph = (data.photos || [])[0];
      if (!ph) throw new Error("sin resultados");
      const link = ph.src?.large2x || ph.src?.original || ph.src?.large;
      const bytes = await download(link, dest);
      console.log(`↓ foto   ${name}.jpg  ${(bytes / 1e6).toFixed(1)}MB  ${ph.width}x${ph.height}`);
      index.push({ name, query, type, file: `${name}.jpg`, pexels_id: ph.id, w: ph.width, h: ph.height, by: ph.photographer, url: ph.url });
    }
  } catch (e) {
    console.error(`✗ ${name}  (${query}) — ${e.message}`);
    index.push({ name, query, type, error: e.message });
  }
}

fs.writeFileSync(path.join(OUT, "broll_index.json"), JSON.stringify(index, null, 2));
const ok = index.filter((x) => !x.error).length;
console.log(`\n=== LISTO === ${ok}/${shots.length} bajados · índice en ${OUT}/broll_index.json`);
