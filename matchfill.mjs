// matchfill.mjs — sube la COBERTURA del match re-corriendo el farm SOLO sobre las
// ventanas que aún no matchearon, y uniendo el resultado al master.
//   node matchfill.mjs <slug> prep            → escribe match_<slug>.json (cwd) con SOLO las faltantes
//   node matchfill.mjs <slug> merge <tmp.json> → une el nuevo matched al master (prefiere _score más alto)
import fs from "fs";
const slug = process.argv[2], mode = process.argv[3];
const FULL = `public/broll/match_${slug}.json`;            // todas las queries (name,query,concept,dur)
const MASTER = `public/broll/clips_${slug}_matched.json`;  // resultado acumulado (con url)

if (mode === "prep") {
  const full = JSON.parse(fs.readFileSync(FULL, "utf8"));
  const master = fs.existsSync(MASTER) ? JSON.parse(fs.readFileSync(MASTER, "utf8")) : [];
  const have = new Set(master.filter((x) => x.url).map((x) => x.name));
  const missing = full.filter((q) => !have.has(q.name));
  fs.writeFileSync(`match_${slug}.json`, JSON.stringify(missing, null, 1));
  console.log(`PREP: faltan ${missing.length}/${full.length} (ya hay ${have.size})`);
} else if (mode === "merge") {
  const tmp = JSON.parse(fs.readFileSync(process.argv[4], "utf8")).filter((x) => x.url);
  const master = fs.existsSync(MASTER) ? JSON.parse(fs.readFileSync(MASTER, "utf8")) : [];
  const by = new Map(master.filter((x) => x.url).map((x) => [x.name, x]));
  let add = 0;
  for (const n of tmp) {
    const cur = by.get(n.name);
    if (!cur || (n._score || 0) > (cur._score || 0)) { by.set(n.name, n); if (!cur) add++; }
  }
  const merged = [...by.values()];
  fs.writeFileSync(MASTER, JSON.stringify(merged, null, 1));
  const full = JSON.parse(fs.readFileSync(FULL, "utf8")).length;
  console.log(`MERGE: +${add} nuevas · cobertura ${merged.length}/${full}`);
}
