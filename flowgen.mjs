// flowgen.mjs — genera imágenes en Google Flow (Nano Banana) automatizando la UI NATIVA.
// Reemplazo "gratis" de gen_deapi.mjs. Lista public/img/<lista>.json [{name,prompt}]
// → baja a public/img/<name>.jpg. Sesión persistente (.flowprofile): login UNA vez.
// Corre oculto (ventana fuera de pantalla). NO usa la extensión: maneja Flow directo.
//
// MODOS
//   node flowgen.mjs --login                 (una vez: abrís sesión a mano, cerrás la ventana)
//   node flowgen.mjs public/img/prompts_cafe.json   (genera el lote, oculto)
//   FLOW_SHOW=1 ...                          (ver la ventana, debug)
//
// Aprendido en calibración: campo = div[contenteditable]; enviar = botón "arrow_forward";
// imagen lista = <img> nueva con naturalWidth grande y src .../media.getMediaUrlRedirect;
// descarga = page.request.get(src) (cookies, sin CORS).
import fs from "fs";
import path from "path";
import { chromium } from "patchright";

const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envFile)) for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) { const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ""); }

const ARGS = process.argv.slice(2);
const MODE = ARGS.includes("--login") ? "login" : "run";
const PROMPTS = ARGS.find((a) => !a.startsWith("--")) || "public/img/prompts.json";
const OUT = "public/img";
const PROFILE = path.resolve(process.env.FLOW_PROFILE || ".flowprofile");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = process.env.FLOW_URL || "https://labs.google/fx/es-419/tools/flow/project/b95344bd-77eb-4005-827a-c2fe92de8822";
const TIMEOUT = Number(process.env.FLOW_TIMEOUT_MS) || 240000;
const MINGAP = Number(process.env.FLOW_MINGAP_MS) || 3000;
const MAXGAP = Number(process.env.FLOW_MAXGAP_MS) || 9000;
const CONCURRENCY = Number(process.env.FLOW_CONCURRENCY) || 5; // máx generaciones en vuelo
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rnd = (a, b) => Math.floor(a + Math.random() * (b - a));

for (const f of ["SingletonLock", "SingletonCookie", "SingletonSocket"]) { try { fs.rmSync(path.join(PROFILE, f), { force: true }); } catch {} }

async function launch() {
  const show = process.env.FLOW_SHOW === "1" || MODE === "login";
  const headless = process.env.FLOW_HEADLESS === "1";
  const args = [];
  if (!show && !headless) args.push("--window-position=-32000,-32000", "--window-size=1400,950");
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    channel: "chrome", executablePath: fs.existsSync(CHROME) ? CHROME : undefined,
    headless, viewport: show ? null : { width: 1400, height: 950 }, acceptDownloads: true, args,
  });
  const page = ctx.pages()[0] || (await ctx.newPage());
  return { ctx, page };
}

// lista de imágenes-media actuales con su nombre (UUID), url y ancho natural
const mediaList = (page) => page.evaluate(() =>
  [...document.querySelectorAll("img")]
    .filter((i) => /media\.getMediaUrl|googleusercontent/i.test(i.src))
    .map((i) => ({ name: (i.src.match(/name=([^&]+)/) || [])[1] || i.src, url: i.src, w: i.naturalWidth }))
);

async function doLogin() {
  const { ctx, page } = await launch();
  await page.goto(URL, { waitUntil: "domcontentloaded" }).catch(() => {});
  console.log("\n→ Logueate y dejá abierto el proyecto de imágenes. CERRÁ la ventana cuando termines.\n");
  await new Promise((res) => { ctx.on("close", res); setTimeout(res, 20 * 60 * 1000); });
  await ctx.close().catch(() => {});
  console.log("Sesión guardada ✓");
  process.exit(0);
}

async function doRun() {
  if (!fs.existsSync(PROMPTS)) { console.error("No existe la lista:", PROMPTS); process.exit(1); }
  const list = JSON.parse(fs.readFileSync(PROMPTS, "utf8").replace(/^﻿/, ""));
  fs.mkdirSync(OUT, { recursive: true });
  const pending = list.filter((p) => p.name && p.prompt && !fs.existsSync(path.join(OUT, `${p.name}.jpg`)));
  console.log(`${pending.length}/${list.length} por generar (oculto, Flow nativo).`);
  if (!pending.length) { console.log("nada que hacer ✓"); process.exit(0); }

  const { ctx, page } = await launch();
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
  await sleep(8000);
  if (!(await page.locator('div[contenteditable="true"]').first().count())) { console.error("No encuentro el campo. ¿Logueado? Corré: node flowgen.mjs --login"); await ctx.close(); process.exit(2); }

  const t0 = Date.now();
  // ── FASE 1: disparar TODOS los prompts de corrido (Flow genera en paralelo) ──
  const seen = new Set((await mediaList(page)).map((m) => m.name));
  const jobs = []; // { name, url }
  for (let i = 0; i < pending.length; i++) {
    const { name, prompt } = pending[i];
    // throttle: no más de CONCURRENCY generaciones en vuelo (sin terminar).
    // ★ con TIMEOUT: en modo oculto/offscreen las <img> no siempre reportan naturalWidth>1000,
    // así que "ready" no sube y el throttle esperaría PARA SIEMPRE. Tras THROTTLE_MAX seguimos
    // igual (la fase 2 tiene su propio timeout para bajar). Evita el freno permanente.
    const THROTTLE_MAX = Number(process.env.FLOW_THROTTLE_MAX_MS) || 25000;
    const tThr = Date.now();
    while (true) {
      const ready = new Set((await mediaList(page)).filter((m) => m.w > 1000).map((m) => m.name));
      const inflight = jobs.filter((j) => j.url && !ready.has((j.url.match(/name=([^&]+)/) || [])[1])).length;
      if (inflight < CONCURRENCY) break;
      if (Date.now() - tThr > THROTTLE_MAX) break;
      await sleep(1500);
    }
    const inp = page.locator('div[contenteditable="true"]').first();
    await inp.click();
    await page.keyboard.press("Control+A").catch(() => {});
    await page.keyboard.press("Delete").catch(() => {});
    // insertText mete TODO el texto de una (el editor Slate es lentísimo tecla por
    // tecla → timeout con prompts largos). Fallback a type() corto si algo falla.
    try { await page.keyboard.insertText(prompt); } catch { await inp.type(prompt.slice(0, 240), { delay: 6 }).catch(() => {}); }
    await sleep(rnd(200, 450));
    const send = page.locator('button:has-text("arrow_forward")').last();
    if (await send.count()) await send.click().catch(() => {}); else await page.keyboard.press("Enter");
    // capturar la card nueva (su UUID) — aparece a los pocos seg, NO espero que termine
    let url = null;
    const CARDWAIT = Number(process.env.FLOW_CARDWAIT_MS) || 15000;
    const tw = Date.now();
    while (Date.now() - tw < CARDWAIT) {
      const cur = await mediaList(page);
      const fresh = cur.filter((m) => !seen.has(m.name));
      if (fresh.length) {
        await sleep(1200); // dejar aparecer el hermano x2
        const fresh2 = (await mediaList(page)).filter((m) => !seen.has(m.name));
        fresh2.forEach((m) => seen.add(m.name)); // marcar todas (evita re-mapear)
        url = (fresh2[0] || fresh[0]).url; // guard: si fresh2 quedó vacío, usar el primero detectado
        break;
      }
      await sleep(700);
    }
    if (!url) { // reintento: re-enviar una vez
      await inp.click(); await page.keyboard.press("Control+A").catch(() => {}); await page.keyboard.press("Delete").catch(() => {});
      try { await page.keyboard.insertText(prompt); } catch { await inp.type(prompt.slice(0, 240), { delay: 6 }).catch(() => {}); } await sleep(300);
      const s2 = page.locator('button:has-text("arrow_forward")').last(); if (await s2.count()) await s2.click().catch(() => {});
      const tw2 = Date.now();
      while (Date.now() - tw2 < (Number(process.env.FLOW_CARDWAIT_MS) || 15000)) { const fr = (await mediaList(page)).filter((m) => !seen.has(m.name)); if (fr.length) { fr.forEach((m) => seen.add(m.name)); url = fr[0].url; break; } await sleep(700); }
    }
    jobs.push({ name, url });
    console.log(`→ enviado ${name}  [${i + 1}/${pending.length}]${url ? "" : "  (sin card!)"}`);
    await sleep(rnd(MINGAP, MAXGAP)); // gap humano 3-9s
  }

  // ── FASE 2: esperar que terminen (full-res) y BAJAR todas ──
  const want = jobs.filter((j) => j.url).map((j) => (j.url.match(/name=([^&]+)/) || [])[1]);
  console.log(`Disparados ${jobs.length}. Esperando que generen…`);
  const tg = Date.now();
  while (Date.now() - tg < TIMEOUT) {
    const ready = new Set((await mediaList(page)).filter((m) => m.w > 1000).map((m) => m.name));
    const done = want.filter((n) => ready.has(n)).length;
    if (done >= want.length) break;
    if ((Date.now() - tg) % 10000 < 2600) console.log(`  generadas ${done}/${want.length}…`);
    await sleep(2500);
  }
  let ok = 0, fail = 0;
  for (const j of jobs) {
    if (!j.url) { fail++; console.log(`✗ ${j.name} (no se disparó)`); continue; }
    try {
      const resp = await page.request.get(j.url);
      const buf = await resp.body();
      if (buf.length < 20000) throw new Error("bytes chicos (no listo)");
      fs.writeFileSync(path.join(OUT, `${j.name}.jpg`), buf);
      ok++; console.log(`✓ ${j.name}`);
    } catch (e) { fail++; console.log(`✗ ${j.name}  ${String(e.message || e).slice(0, 50)}`); }
  }
  const onDisk = list.filter((p) => fs.existsSync(path.join(OUT, `${p.name}.jpg`))).length;
  console.log(`\n=== ${ok} ok · ${fail} fallos · ${onDisk}/${list.length} en disco · ${((Date.now() - t0) / 1000).toFixed(0)}s ===`);
  await ctx.close().catch(() => {});
  process.exit(0);
}

if (MODE === "login") await doLogin(); else await doRun();
