// match_v3/lib.mjs — plomería compartida del matcheo "editado a mano".
// Reusa las técnicas ya validadas de match_sb.mjs: YouTube Data API (multi-key + retry),
// storyboards de i.ytimg (CDN, no bloqueado), geometría de tiles. NO decide con CLIP.
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

// ── .env (raíz del repo video2) ──
export function loadEnv(root = ".") {
  try {
    for (const line of fs.readFileSync(path.join(root, ".env"), "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {}
}
loadEnv();

export const YT_API_KEYS = [
  process.env.YT_API_KEY, process.env.YT_API_KEY2, process.env.YT_API_KEY3,
  process.env.YT_API_KEY4, process.env.YT_API_KEY5, process.env.YT_API_KEY6,
].map((k) => (k || "").trim()).filter(Boolean);
export const YTDLP = process.env.YTDLP || "yt-dlp";
export const FF = process.env.FFMPEG || "ffmpeg";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = (b, s) => b + Math.floor(Math.random() * s);
export const vidId = (u) => (String(u).match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/) || String(u).match(/([A-Za-z0-9_-]{11})/) || [])[1];

// ── YouTube Data API con retry + multi-key + failover ──
let keyPtr = 0;
const deadKeys = new Set();
const nextKey = () => {
  for (let i = 0; i < YT_API_KEYS.length; i++) {
    const k = YT_API_KEYS[keyPtr % YT_API_KEYS.length]; keyPtr++;
    if (!deadKeys.has(k)) return k;
  }
  return null;
};
async function apiGet(buildUrl, ctx) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const key = nextKey();
    if (!key) { console.error(`  [API] ${ctx}: sin keys vivas`); return null; }
    try {
      await sleep(jitter(120, 220));
      const res = await fetch(buildUrl(key), { signal: AbortSignal.timeout(30000) });
      const j = await res.json().catch(() => ({}));
      if (!j.error) return j;
      const reason = j.error.errors?.[0]?.reason || j.error.code;
      if (reason === "quotaExceeded" || reason === "dailyLimitExceeded") { deadKeys.add(key); console.error(`  [API] ${ctx}: quota agotada …${key.slice(-4)} → rota`); continue; }
      if (res.status === 429 || reason === "rateLimitExceeded" || reason === "userRateLimitExceeded") { await sleep(jitter(1000 * 2 ** attempt, 500)); continue; }
      console.error(`  [API] ${ctx}: ${res.status} ${reason}`); return null;
    } catch (e) { await sleep(jitter(1000 * 2 ** attempt, 500)); }
  }
  return null;
}

const searchCache = new Map();
const qNorm = (q) => (q || "").trim().toLowerCase().replace(/\s+/g, " ");

// Fallback SIN API: yt-dlp ytsearch por la IP de casa (no toca cuota ni el rate-limit
// per-IP de la Data API). Más lento y algo menos preciso, pero no se traba cuando la
// API está saturada (429 en masa). flat-playlist = rápido (no extrae cada video).
let ytSearchOff = false;
export function ytSearch(q, n = 20) {
  const r = spawnSync(YTDLP, [`ytsearch${n}:${q}`, "--flat-playlist", "--no-warnings",
    "--print", "%(id)s\t%(title)s", "--socket-timeout", "30"], { encoding: "utf8", maxBuffer: 1 << 24 });
  if (r.status !== 0 || !r.stdout) return [];
  return r.stdout.trim().split("\n").map((line) => {
    const [id, ...t] = line.split("\t"); return { id: (id || "").trim(), title: (t.join("\t") || "").trim() };
  }).filter((x) => x.id && x.id.length === 11);
}

export async function apiSearch(q, maxResults = 20) {
  const key = qNorm(q);
  if (searchCache.has(key)) return searchCache.get(key);
  let rows = null;
  if (!ytSearchOff && !process.env.FORCE_YTSEARCH) {
    const j = await apiGet((k) => `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}`
      + `&relevanceLanguage=es&q=${encodeURIComponent(q)}&key=${k}`, `search "${q}"`);
    if (j) rows = (j.items || []).map((it) => ({ id: it.id?.videoId, title: it.snippet?.title || "" })).filter((r) => r.id);
  }
  // API vacía/muerta (429 en masa o quota) → caer a ytsearch (IP de casa, sin límite)
  if (rows == null) {
    if (!ytSearchOff && !process.env.FORCE_YTSEARCH) { console.error(`  [API→ytsearch] "${q}"`); ytSearchOff = true; }
    rows = ytSearch(q, maxResults);
  }
  searchCache.set(key, rows);
  return rows;
}
export const searchStats = () => ({ uniqueQueries: searchCache.size });

const iso8601ToSec = (s) => {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(s || "");
  return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
};
export async function apiDurations(ids) {
  const out = new Map();
  if (!YT_API_KEYS.length || !ids.length) return out;
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    const j = await apiGet((key) => `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${batch.join(",")}&key=${key}`, `videos.list (${batch.length})`);
    if (!j) continue;
    for (const it of (j.items || [])) out.set(it.id, iso8601ToSec(it.contentDetails?.duration));
  }
  return out;
}

// re-rank léxico por título + filtro BAD (mismo criterio que match_sb)
const STOP = new Set(("a an the de la el los las un una y o para con por en al del que se su su lo".split(" ")));
const kw = (s) => [...new Set((s || "").toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)))];
const BAD = /(reaction|react|podcast|full episode|interview|tier list|gameplay|trailer|unboxing|vlog|prank|lyric|music video|official music|\bsong\b|cover|remix|karaoke|instrumental|playlist|relaj|sue[ñn]o|dormir|8 horas|asmr sleep|meditaci)/i;
export function rerank(rows, queries, limit) {
  const want = new Set(queries.flatMap(kw));
  const seen = new Map();
  rows.forEach(({ id, title = "" }, ri) => {
    if (!id || seen.has(id)) { if (seen.has(id)) seen.get(id).rank = Math.min(seen.get(id).rank, ri); return; }
    const t = title.toLowerCase();
    const lex = [...want].reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
    const pen = BAD.test(t) ? 5 : 0;
    seen.set(id, { id, title, rank: ri, lex: lex - pen });
  });
  return [...seen.values()].sort((a, b) => (b.lex - a.lex) || (a.rank - b.rank)).slice(0, limit);
}

// ── STORYBOARD ──
export function ytInfo(id) {
  const r = spawnSync(YTDLP, [`https://youtu.be/${id}`, "-J", "--skip-download", "--no-warnings", "--socket-timeout", "30"],
    { encoding: "utf8", maxBuffer: 1 << 28, timeout: 60000, killSignal: "SIGKILL" });
  if (r.status !== 0 || !r.stdout) return null;
  try { return JSON.parse(r.stdout); } catch { return null; }
}
export function pickStoryboard(info) {
  const sbs = (info.formats || []).filter((f) => String(f.format_id || "").startsWith("sb") && (f.fragments || []).length && f.columns && f.rows);
  if (!sbs.length) return null;
  sbs.sort((a, b) => (a.format_id === "sb0" ? -1 : b.format_id === "sb0" ? 1 : (b.columns * b.rows * b.fragments.length) - (a.columns * a.rows * a.fragments.length)));
  return sbs[0];
}
export function curl(url, dest) {
  const r = spawnSync("curl", ["-s", "-L", "--max-time", "30", url, "-o", dest], { encoding: "utf8", timeout: 40000 });
  return r.status === 0 && fs.existsSync(dest) && fs.statSync(dest).size > 500;
}
// timestamp de un tile (0-idx global, row-major desde 0) dado interval
export const tileTs = (globalIdx, interval) => +((globalIdx + 0.5) * interval).toFixed(1);
