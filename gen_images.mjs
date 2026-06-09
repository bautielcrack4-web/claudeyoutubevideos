// gen_images.mjs — genera imágenes realistas con la API de OpenAI (gpt-image-2)
// POR TEXTO, en lote y en modo "low" (barato). Yo escribo los prompts, el script
// baja todas las imágenes a public/img/<nombre>.png y arma un índice. Así monto la
// edición leyendo SOLO nombres/prompts: 0 tokens de visión.
//
// Costo (low, jun 2026): ~US$0.006 por 1024x1024 · ~US$0.005 por 1536x1024 (16:9).
// 50 imágenes ≈ US$0.25–0.30.
//
// Requisitos:
//   - API key de OpenAI. Pasala por:  set OPENAI_API_KEY=sk-...   (o en .env)
//
// Lista de prompts — public/img/prompts.json:
//   [
//     { "name": "estepa_invierno", "prompt": "A realistic documentary 16:9 ..." },
//     { "name": "ger_noche",       "prompt": "...", "size": "1024x1024" }
//   ]
//
// Uso:
//   node gen_images.mjs [prompts.json=public/img/prompts.json] [outDir=public/img] [concurrency=4]
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

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error("Falta OPENAI_API_KEY (set OPENAI_API_KEY=sk-... o ponela en .env).");
  process.exit(1);
}

const [promptsArg, outArg, concArg] = process.argv.slice(2);
const PROMPTS = promptsArg || "public/img/prompts.json";
const OUT = outArg || "public/img";
const CONC = Number(concArg) || 4;
const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
const QUALITY = process.env.OPENAI_IMAGE_QUALITY || "low";
const DEFAULT_SIZE = process.env.OPENAI_IMAGE_SIZE || "1536x1024"; // 16:9

fs.mkdirSync(OUT, { recursive: true });

if (!fs.existsSync(PROMPTS)) {
  console.error("No existe la lista de prompts:", PROMPTS);
  process.exit(1);
}
const list = JSON.parse(fs.readFileSync(PROMPTS, "utf8"));

const genOne = async (item) => {
  const { name, prompt, size = DEFAULT_SIZE } = item;
  const dest = path.join(OUT, `${name}.png`);
  if (fs.existsSync(dest)) {
    console.log(`= ya existe  ${name}.png`);
    return { name, prompt, file: `${name}.png`, skipped: true };
  }
  const body = { model: MODEL, prompt, size, quality: QUALITY, n: 1 };
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = (await res.text()).slice(0, 200);
    throw new Error(`API ${res.status} ${txt}`);
  }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("respuesta sin b64_json");
  const buf = Buffer.from(b64, "base64");
  fs.writeFileSync(dest, buf);
  const usage = data.usage || {};
  console.log(`↓ ${name}.png  ${(buf.length / 1e6).toFixed(2)}MB  ${size}  tokens_out=${usage.output_tokens ?? "?"}`);
  return {
    name,
    prompt,
    file: `${name}.png`,
    size,
    quality: QUALITY,
    model: MODEL,
    output_tokens: usage.output_tokens,
    input_tokens: usage.input_tokens,
  };
};

// pool de concurrencia simple
const index = new Array(list.length);
let next = 0;
const worker = async () => {
  while (next < list.length) {
    const i = next++;
    const item = list[i];
    try {
      index[i] = await genOne(item);
    } catch (e) {
      console.error(`✗ ${item.name} — ${e.message}`);
      index[i] = { name: item.name, prompt: item.prompt, error: e.message };
    }
  }
};
await Promise.all(Array.from({ length: Math.min(CONC, list.length) }, worker));

fs.writeFileSync(path.join(OUT, "img_index.json"), JSON.stringify(index, null, 2));
const ok = index.filter((x) => x && !x.error).length;
console.log(`\n=== LISTO === ${ok}/${list.length} imágenes · índice en ${OUT}/img_index.json`);
