// gen_gptimage.mjs — genera imágenes con gpt-image-2 (quality low) desde una lista JSON.
//   node gen_gptimage.mjs <lista.json> [outDir=public/img] [size=1536x1024] [quality=low]
// lista.json: [{ "name":"pulgones_s_01_a", "prompt":"..." }, ...]
// Requiere OPENAI_API_KEY en .env. Salta las que ya existen. Reintenta 429/5xx.
import fs from "fs";
import path from "path";

const [listArg, outArg = "public/img", sizeArg = "1792x1008", qualArg = "low"] = process.argv.slice(2);
if (!listArg) { console.error("Uso: node gen_gptimage.mjs <lista.json> [outDir] [size] [quality]"); process.exit(1); }

// .env
const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KEY = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;
if (!KEY) { console.error("falta OPENAI_API_KEY en .env"); process.exit(1); }

const MODEL = process.env.GPTIMG_MODEL || "gpt-image-2";
const list = JSON.parse(fs.readFileSync(listArg, "utf8"));
fs.mkdirSync(outArg, { recursive: true });
const has = (name) => ["png", "jpg", "jpeg", "webp"].some((e) => fs.existsSync(path.join(outArg, `${name}.${e}`)));
const todo = list.filter((it) => it.name && it.prompt && !has(it.name));
console.log(`gpt-image (${MODEL}, ${qualArg}, ${sizeArg}) · total ${list.length} · a generar ${todo.length} · ya existen ${list.length - todo.length}`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let done = 0, fail = 0;

async function gen(it, attempt = 1) {
  try {
    let res;
    if (it.ref && fs.existsSync(it.ref)) {
      // edits: mantiene la identidad de la foto de referencia (planos de Levi)
      const fd = new FormData();
      fd.set("model", MODEL); fd.set("prompt", it.prompt); fd.set("n", "1"); fd.set("size", sizeArg); fd.set("quality", qualArg);
      const rfn = it.ref.split(/[\\/]/).pop();
      const mime = /\.png$/i.test(rfn) ? "image/png" : /\.webp$/i.test(rfn) ? "image/webp" : "image/jpeg";
      fd.set("image", new Blob([fs.readFileSync(it.ref)], { type: mime }), rfn);
      res = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { "Authorization": `Bearer ${KEY}` }, body: fd });
    } else {
      res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, prompt: it.prompt, n: 1, size: sizeArg, quality: qualArg }),
      });
    }
    if (!res.ok) {
      const txt = await res.text();
      if ((res.status === 429 || res.status >= 500) && attempt <= 5) { await sleep(1500 * attempt + Math.floor(attempt * 500)); return gen(it, attempt + 1); }
      throw new Error(`${res.status} ${txt.slice(0, 160)}`);
    }
    const j = await res.json();
    const d = j.data && j.data[0];
    let buf;
    if (d?.b64_json) buf = Buffer.from(d.b64_json, "base64");
    else if (d?.url) buf = Buffer.from(await (await fetch(d.url)).arrayBuffer());
    else throw new Error("sin b64_json ni url");
    fs.writeFileSync(path.join(outArg, `${it.name}.png`), buf);
    done++;
    if (done % 10 === 0 || done + fail === todo.length) console.log(`  ${done + fail}/${todo.length} (ok ${done}, fail ${fail})`);
  } catch (e) {
    if (attempt <= 3) { await sleep(1200 * attempt); return gen(it, attempt + 1); }
    fail++; console.warn(`  ✗ ${it.name}: ${String(e.message || e).slice(0, 120)}`);
  }
}

// pool de concurrencia
const CONC = Number(process.env.GPTIMG_CONC || 5);
let idx = 0;
async function worker() { while (idx < todo.length) { const it = todo[idx++]; await gen(it); } }
await Promise.all(Array.from({ length: Math.min(CONC, todo.length) }, worker));
console.log(`=== LISTO · ok ${done} · fail ${fail} · saltadas ${list.length - todo.length} ===`);
