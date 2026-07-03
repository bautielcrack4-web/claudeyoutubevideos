// fetch_parallel.mjs — baja los clips en PARALELO repartiendo la carga entre cuentas.
// N workers, cada uno = 1 cookie (COOKIE_DIR con 1 archivo) + 1 proxy (YTPROXY) + una tanda
// DISJUNTA de tomas. Así cada cuenta baja ~total/N clips con pacing → rápido SIN volver a
// quemar ninguna cuenta (el opuesto de bajar los 302 con una sola cuenta = rate-limit).
//
//   node fetch_parallel.mjs [clips_<slug>_matched.json] [outDir=public/broll] [workers]
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const listArg = process.argv[2] || "public/broll/clips_artefactos_matched.json";
const outDir = process.argv[3] || "public/broll";
const cookieDir = process.env.COOKIE_DIR || "cookies";
const cookies = (() => { try { return fs.readdirSync(cookieDir).filter((f) => f.endsWith(".txt") && f !== "proxies.txt").sort(); } catch { return []; } })();
const proxies = (() => { try { return fs.readFileSync(path.join(cookieDir, "proxies.txt"), "utf8").split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#")); } catch { return []; } })();
const N = Math.max(1, Math.min(+(process.argv[4] || process.env.FETCH_WORKERS || cookies.length || 4), cookies.length || 99));
if (!cookies.length) { console.error("⚠ sin cookies en", cookieDir, "— corré fetch_clips.mjs normal"); process.exit(1); }

const clips = JSON.parse(fs.readFileSync(listArg, "utf8"));
// solo los que faltan bajar (idempotente: no re-baja lo ya en disco)
const pending = clips.filter((c) => !fs.existsSync(path.join(outDir, `${c.name}.mp4`)));
console.log(`fetch paralelo: ${pending.length}/${clips.length} pendientes · ${N} workers (1 cookie+1 proxy c/u) · ${proxies.length} proxies`);
if (!pending.length) { console.log("✓ todo ya bajado"); process.exit(0); }

// repartir en N tandas disjuntas (round-robin → cada worker mezcla clips de todo el video)
const slices = Array.from({ length: N }, () => []);
pending.forEach((c, i) => slices[i % N].push(c));

const tmp = fs.mkdtempSync(path.join(process.cwd(), "_fetchpw_"));
function runWorker(k) {
  return new Promise((resolve) => {
    const wdir = path.join(tmp, `w${k}`); fs.mkdirSync(wdir, { recursive: true });
    fs.copyFileSync(path.join(cookieDir, cookies[k % cookies.length]), path.join(wdir, "acct.txt")); // COOKIE_DIR con 1 cookie
    const sliceFile = path.join(tmp, `slice${k}.json`); fs.writeFileSync(sliceFile, JSON.stringify(slices[k]));
    const proxy = proxies.length ? proxies[k % proxies.length] : "";
    const env = { ...process.env, COOKIE_DIR: wdir, FETCH_SLEEP_MIN: process.env.FETCH_SLEEP_MIN || "2", FETCH_SLEEP_MAX: process.env.FETCH_SLEEP_MAX || "6" };
    if (proxy) env.YTPROXY = proxy;
    console.log(`  ▶ worker ${k}: ${slices[k].length} clips · cookie ${cookies[k % cookies.length]} · proxy ${proxy ? proxy.replace(/\/\/[^@]*@/, "//***@") : "IP local"}`);
    const p = spawn("node", ["fetch_clips.mjs", sliceFile, outDir], { env, stdio: ["ignore", "pipe", "pipe"] });
    let ok = 0, fail = 0; let buf = "";
    const onData = (d) => { buf += d; let nl; while ((nl = buf.indexOf("\n")) >= 0) { const line = buf.slice(0, nl); buf = buf.slice(nl + 1); if (line.includes("✓ broll/")) ok++; else if (line.includes("✗ ERROR")) fail++; } };
    p.stdout.on("data", onData); p.stderr.on("data", onData);
    p.on("close", () => { console.log(`  ✓ worker ${k} terminó: ${ok} ok · ${fail} fallidos`); resolve({ k, ok, fail }); });
  });
}

const res = await Promise.all(Array.from({ length: N }, (_, k) => runWorker(k)));
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
const have = clips.filter((c) => fs.existsSync(path.join(outDir, `${c.name}.mp4`))).length;
console.log(`\n✅ fetch paralelo listo → ${have}/${clips.length} clips en disco (${res.reduce((s, r) => s + r.fail, 0)} fallidos, reintentables re-corriendo)`);
