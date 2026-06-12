// findbeats.mjs — dado un set de frases-ancla, devuelve el segundo EXACTO donde
// arranca cada una en captions_<slug>.json (sync imagen↔audio por caption, no a ojo).
// Uso: node findbeats.mjs <slug> "<id>=<frase>" "<id>=<frase>" ...
//   o:  node findbeats.mjs <slug> anchors.json   ([{id,phrase}])
import fs from "fs";

const slug = process.argv[2];
const caps = JSON.parse(fs.readFileSync(`public/captions_${slug}.json`, "utf8"));

// string completo + mapa charIndex -> startMs del token que lo contiene
let full = "";
const idx = []; // idx[charPos] = startMs
for (const c of caps) {
  const t = c.text;
  for (let k = 0; k < t.length; k++) idx.push(c.startMs);
  full += t;
}
const norm = (s) => s.toLowerCase().replace(/\s+/g, " ");
const fullN = norm(full);

let args = process.argv.slice(3);
if (args.length === 1 && args[0].endsWith(".json")) {
  args = JSON.parse(fs.readFileSync(args[0], "utf8")).map((a) => `${a.id}=${a.phrase}`);
}

// nota: el char-index de fullN difiere si hay colapsos de espacios; para robustez,
// buscamos sobre una versión "compacta sin espacios" y mapeamos a idx por conteo.
let compact = "";
const cidx = [];
for (let p = 0; p < full.length; p++) {
  const ch = full[p];
  if (/\s/.test(ch)) continue;
  compact += ch.toLowerCase();
  cidx.push(idx[p]);
}

for (const a of args) {
  const eq = a.indexOf("=");
  const id = a.slice(0, eq);
  const phrase = a.slice(eq + 1);
  const needle = phrase.toLowerCase().replace(/\s+/g, "");
  const pos = compact.indexOf(needle);
  if (pos < 0) {
    console.log(`${id}\tNOT FOUND\t"${phrase}"`);
    continue;
  }
  const ms = cidx[pos];
  console.log(`${id}\t${(ms / 1000).toFixed(2)}\t"${phrase}"`);
}
