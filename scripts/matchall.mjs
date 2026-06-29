// matchall.mjs — matchea TODOS los clips de match_<slug>.json reintentando en RONDAS los
// que faltan. YouTube throttlea la IP en tandas grandes (6 shards × 240 clips), así que
// acá vamos suaves: pocos shards + cooldown entre rondas, y ACUMULAMOS sobre lo ya matcheado
// en clips_<slug>_matched.json (no se pierde nada). Corta cuando está todo o tras 3 rondas
// sin progreso.
//   node scripts/matchall.mjs <slug> [shards=3]
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [slug, shardsArg = "3"] = process.argv.slice(2);
if (!slug) { console.error("Uso: node scripts/matchall.mjs <slug> [shards]"); process.exit(1); }
const N = +shardsArg, ROUNDS = 60, COOL = +(process.env.MATCH_COOL || 120000); // cooldown entre rondas (ms). Override con MATCH_COOL. Default 2min; con proxies sanos ~20-30s va bien.
const listPath = `public/broll/match_${slug}.json`;
const outPath = `public/broll/clips_${slug}_matched.json`;
const tmpList = `public/broll/_match_${slug}_round.json`;
const YTDLP = path.join(process.cwd(), "bin", "yt-dlp.exe");
const FF = path.join(process.cwd(), "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe");
const load = (p) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return []; } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const all = load(listPath);
let matched = load(outPath); // arranca de lo ya matcheado (no lo pierde)
let noProg = 0;
for (let r = 1; r <= ROUNDS; r++) {
  const have = new Set(matched.map((c) => c.name));
  const missing = all.filter((c) => !have.has(c.name));
  console.log(`[ronda ${r}] faltan ${missing.length} / ${all.length}`);
  if (!missing.length) break;
  fs.writeFileSync(tmpList, JSON.stringify(missing, null, 1));
  fs.mkdirSync("out", { recursive: true });
  for (const f of fs.readdirSync("out").filter((f) => f.startsWith("match_part_"))) fs.rmSync(path.join("out", f));
  const env = { ...process.env, YTDLP, FFMPEG: FF, MATCH_MAXSPAN: "90", MATCH_CANDS: "3", MATCH_COARSE: "22", MATCH_POOL: "10" };
  await Promise.all(Array.from({ length: N }, (_, i) => new Promise((res) => {
    spawn(process.execPath, ["scripts/match_runner.mjs", slug, String(i), String(N), tmpList], { env, stdio: "ignore" }).on("close", () => res());
  })));
  let got = 0;
  for (const f of fs.readdirSync("out").filter((f) => f.startsWith("match_part_"))) {
    for (const c of load(path.join("out", f))) { if (!have.has(c.name)) { matched.push(c); have.add(c.name); got++; } }
  }
  fs.writeFileSync(outPath, JSON.stringify(matched, null, 2));
  console.log(`[ronda ${r}] +${got} → ${matched.length}/${all.length} matcheados`);
  if (got === 0) { if (++noProg >= 8) { console.log("8 rondas sin progreso — corto"); break; } } else noProg = 0;
  if (matched.length < all.length) await sleep(COOL);
}
console.log(`FIN matchall: ${matched.length}/${all.length} → ${outPath}`);
