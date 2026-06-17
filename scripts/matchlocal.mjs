// matchlocal.mjs — matcher de clips en PARALELO LOCAL. El farm (match.yml) NO sirve para
// matchear: YouTube bloquea las IPs de GitHub Actions (ver memoria). Así que el paralelismo
// lo hacemos acá: spawnea N shards de match_runner.mjs con los binarios LOCALES (bin/yt-dlp.exe
// + ffmpeg de Remotion) y un temp propio por shard, espera a todos y mergea →
// public/broll/clips_<slug>_matched.json (listo para fetch_clips.mjs).
//
// Uso:  node scripts/matchlocal.mjs <slug> [shards=6]
// Tuning (env): MATCH_MAXSPAN (def 90), MATCH_CANDS (3), MATCH_COARSE (24), MATCH_POOL (10).
import { spawn, spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const [slug, shardsArg = "6"] = process.argv.slice(2);
if (!slug) { console.error("Uso: node scripts/matchlocal.mjs <slug> [shards]"); process.exit(1); }
const N = Math.max(1, +shardsArg);
const list = `public/broll/match_${slug}.json`;
if (!fs.existsSync(list)) { console.error("falta:", list); process.exit(1); }
const total = JSON.parse(fs.readFileSync(list, "utf8").replace(/^﻿/, "")).length;

const YTDLP = path.join(process.cwd(), "bin", "yt-dlp.exe");
const FF = path.join(process.cwd(), "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe");
fs.mkdirSync("out", { recursive: true });
for (const f of fs.readdirSync("out").filter((f) => f.startsWith("match_part_"))) fs.rmSync(path.join("out", f));

const env = {
  ...process.env,
  YTDLP, FFMPEG: FF,
  MATCH_MAXSPAN: process.env.MATCH_MAXSPAN || "90",
  MATCH_CANDS: process.env.MATCH_CANDS || "3",
  MATCH_COARSE: process.env.MATCH_COARSE || "24",
  MATCH_POOL: process.env.MATCH_POOL || "10",
};

const t0 = Date.now();
console.log(`matchlocal: ${total} clips en ${N} shards paralelos · MAXSPAN=${env.MATCH_MAXSPAN} CANDS=${env.MATCH_CANDS}`);
const done = new Array(N).fill(0);
const draw = () => process.stdout.write(`progreso por shard: [${done.join(" ")}]  total≈${done.reduce((a, b) => a + b, 0)}/${total}\r`);

const run = (i) => new Promise((res) => {
  const p = spawn(process.execPath, ["scripts/match_runner.mjs", slug, String(i), String(N), list], { env, stdio: ["ignore", "pipe", "pipe"] });
  p.stdout.on("data", (d) => { const m = d.toString().match(/  → /g); if (m) { done[i] += m.length; draw(); } });
  p.stderr.on("data", () => {});
  p.on("close", (code) => { console.log(`\nshard ${i} listo (code ${code})`); res(code); });
});
await Promise.all(Array.from({ length: N }, (_, i) => run(i)));

// merge → clips_<slug>_matched.json y copia a public/broll/
spawnSync(process.execPath, ["scripts/match_merge.mjs", slug, "out"], { stdio: "inherit" });
const merged = `clips_${slug}_matched.json`;
if (fs.existsSync(merged)) {
  fs.copyFileSync(merged, `public/broll/${merged}`);
  console.log(`\n✅ matchlocal en ${((Date.now() - t0) / 60000).toFixed(1)} min → public/broll/${merged}`);
  console.log(`Luego: node fetch_clips.mjs public/broll/${merged}`);
} else {
  console.error("✗ no se generó el merge");
  process.exit(1);
}
