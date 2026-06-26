// gen_shotlist_llm.mjs — shotlist DENSO automático (estilo barcos: 1 clip por mini-frase,
// SIN reuso). Lee public/<slug>_timing.json, lo parte en ventanas de ~WIN segundos, y para
// CADA ventana pide a OpenAI una query visual de YouTube b-roll con SENTIDO a lo que se narra
// en ese instante (reglas: específica, visual, temática, NUNCA la palabra literal del narrador).
//   node gen_shotlist_llm.mjs <slug> "<tema del video>"
// → public/broll/match_<slug>.json + src/VideoEdit/<slug>_cues.json (cues w001.. densos)
import fs from "fs";
import path from "path";
const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envFile)) for (const l of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) { const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ""); }
const KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";
const [slug, topic = ""] = process.argv.slice(2);
if (!slug) { console.error("Uso: node gen_shotlist_llm.mjs <slug> \"<tema>\""); process.exit(1); }
const WIN = +(process.env.SHOT_WIN || 3.7); // segundos por clip

const wins = [];
let END;
const capPath = `public/captions_${slug}.json`;
if (fs.existsSync(capPath)) {
  // ★ EXACTO (método barcos): ventanas ancladas al ms REAL de cada palabra (Whisper word-level),
  //   cortando en PAUSAS reales del narrador → cada clip cae justo donde se narra ese concepto.
  const W = JSON.parse(fs.readFileSync(capPath, "utf8"))
    .map((c) => ({ t: (c.text || "").trim(), s: c.startMs / 1000, e: c.endMs / 1000 }))
    .filter((c) => c.t);
  END = W.length ? W[W.length - 1].e + 1.0 : 0;
  let cur = null;
  for (let k = 0; k < W.length; k++) {
    const w = W[k];
    if (!cur) cur = { start: w.s, end: w.e, words: [w.t] };
    else { cur.end = w.e; cur.words.push(w.t); }
    const len = cur.end - cur.start;
    const gap = k + 1 < W.length ? W[k + 1].s - w.e : 99; // pausa hasta la próxima palabra
    // cerrá la ventana al pasar el target SI hay una pausa real, o si se estiró demasiado, o al final
    if (k === W.length - 1 || (len >= WIN * 0.7 && gap >= 0.18) || len >= WIN * 1.45) {
      wins.push({ start: cur.start, end: cur.end, text: cur.words.join(" ") });
      cur = null;
    }
  }
  console.log(`${wins.length} ventanas EXACTAS (Whisper word-level, corte en pausas, ~${WIN}s) sobre ${(END / 60).toFixed(1)} min`);
} else {
  // fallback (menos preciso): interpolar el timing por-chunk del TTS
  const TM = JSON.parse(fs.readFileSync(`public/${slug}_timing.json`, "utf8"));
  END = TM[TM.length - 1].start + (TM[TM.length - 1].text.length / 14) + 1.5;
  for (let i = 0; i < TM.length; i++) {
    const start = TM[i].start;
    const next = i + 1 < TM.length ? TM[i + 1].start : END;
    const dur = Math.max(0.1, next - start);
    const text = (TM[i].text || "").trim();
    const k = Math.max(1, Math.round(dur / WIN));
    const words = text.split(/\s+/);
    for (let j = 0; j < k; j++) {
      const a = start + (dur * j) / k, b = start + (dur * (j + 1)) / k;
      const w0 = Math.floor((words.length * j) / k), w1 = Math.floor((words.length * (j + 1)) / k);
      const slice = words.slice(w0, Math.max(w1, w0 + 1)).join(" ");
      wins.push({ start: a, end: b, text: slice || text });
    }
  }
  console.log(`${wins.length} ventanas (INTERPOLADAS ~${WIN}s, sin Whisper) sobre ${(END / 60).toFixed(1)} min`);
}

const SYS = `Sos un director de fotografía de documentales de misterio/arqueología (canal "Crónicas Perdidas", español). Para cada fragmento de NARRACIÓN te doy el texto que se escucha en ese instante. Devolvé el clip de B-ROLL REAL (de YouTube) que hay que poner JUSTO ahí.
REGLAS DE ORO:
- La query debe tener SENTIDO con lo que se narra en ese fragmento (mostrar eso, o algo muy relacionado y visual).
- NUNCA uses la palabra literal del narrador; traducí la idea a una imagen concreta y filmable.
- Específica, visual, en INGLÉS (para buscar en YouTube), 2-5 palabras.
- Pensá en metraje documental real que exista: lugares, objetos, gente trabajando, tomas aéreas, primeros planos, etc.
- Mantené coherencia con el TEMA del video.
Devolvé SOLO JSON: {"items":[{"i":<indice>,"c":"<concepto visual en inglés, 1 frase>","q":["query1","query2"]}, ...]} con un item por fragmento, en orden.`;

async function batch(items) {
  const user = `TEMA DEL VIDEO: ${topic}\n\nFRAGMENTOS:\n` + items.map((w) => `${w.i}. "${w.text.trim().slice(0, 240)}"`).join("\n");
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST", headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, messages: [{ role: "system", content: SYS }, { role: "user", content: user }], response_format: { type: "json_object" }, temperature: 0.6 }),
      });
      if (!r.ok) { const t = await r.text(); if (r.status === 429 || r.status >= 500) { await new Promise((x) => setTimeout(x, 4000 * (attempt + 1))); continue; } throw new Error(t.slice(0, 200)); }
      const j = await r.json();
      return JSON.parse(j.choices[0].message.content).items || [];
    } catch (e) { if (attempt === 3) throw e; await new Promise((x) => setTimeout(x, 3000)); }
  }
  return [];
}

const indexed = wins.map((w, i) => ({ ...w, i }));
const out = new Map();
const B = 40;
for (let i = 0; i < indexed.length; i += B) {
  const chunk = indexed.slice(i, i + B);
  const res = await batch(chunk);
  for (const it of res) if (it && it.i != null) out.set(it.i, it);
  process.stdout.write(`\r  ${Math.min(i + B, indexed.length)}/${indexed.length}`);
}
console.log("");

const cues = [], match = [];
for (let i = 0; i < wins.length; i++) {
  const w = wins[i], it = out.get(i) || {};
  const name = "w" + String(i + 1).padStart(3, "0");
  const start = +w.start.toFixed(2), dur = +Math.max(1.5, w.end - w.start).toFixed(2);
  const q = Array.isArray(it.q) && it.q.length ? it.q : [it.c || topic];
  cues.push({ name, start, dur });
  match.push({ name, query: q, concept: it.c || topic, dur: Math.max(4, Math.ceil(dur) + 1) });
}
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync(`public/broll/match_${slug}.json`, JSON.stringify(match, null, 1));
fs.writeFileSync(`src/VideoEdit/${slug}_cues.json`, JSON.stringify(cues, null, 1));
console.log(`✓ ${cues.length} clips densos · ${(END / 60).toFixed(1)} min → match_${slug}.json + ${slug}_cues.json`);
