// varcheck.mjs — FORCING FUNCTION de variedad de componentes (doc-broll-video).
// Razón de existir: históricamente ~85% de cada video terminaba siendo 5 formatos
// (foto full-screen + headline + quote + stat + diagram) y el resto del kit quedaba
// sin usar. Este script FRENA (exit 1) si la variedad es baja → hay que rebalancear
// el beatsheet ANTES de generar/renderizar. Correr SIEMPRE después de build + beatsheet:
//   node scripts/varcheck.mjs <slug>
import fs from "fs";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node scripts/varcheck.mjs <slug>"); process.exit(1); }
const bs = JSON.parse(fs.readFileSync(`beatsheet/${slug}.json`, "utf8"));
const beats = bs.beats || [];
const tot = beats.length;

// clasificar
const kindOf = (b) => {
  if (b.kind !== "raw") return b.kind;
  if (b.src?.startsWith("real/")) return "raw_real";
  if (b.src?.startsWith("broll/")) return "raw_stock";
  if (b.src?.includes("vid/")) return "raw_clip";
  return "raw_gen";
};
const count = {};
for (const b of beats) { const k = kindOf(b); count[k] = (count[k] || 0) + 1; }

const rawShare = ((count.raw_real || 0) + (count.raw_gen || 0) + (count.raw_stock || 0) + (count.raw_clip || 0)) / tot;
// grupo "estructurado" = los formatos que SIEMPRE se subusan
const STRUCT = ["bars", "cross", "process", "journey", "infzoom", "annotated", "callout", "checklist", "splitlist", "aged"];
const structKinds = STRUCT.filter((k) => count[k] > 0);
const structCount = STRUCT.reduce((a, k) => a + (count[k] || 0), 0);
const nonRawDistinct = Object.keys(count).filter((k) => !k.startsWith("raw")).length;

// ── umbrales (la regla dura) ────────────────────────────────────────────────
const RULES = [
  { ok: rawShare <= 0.55, msg: `fotos/clips full-screen = ${(rawShare * 100).toFixed(0)}% (debe ser ≤55% — no llenar todo de RawShot)` },
  { ok: nonRawDistinct >= 11, msg: `tipos NO-raw distintos = ${nonRawDistinct} (debe ser ≥11 — usá más del catálogo)` },
  { ok: structKinds.length >= 6, msg: `formatos estructurados presentes = ${structKinds.length}/${STRUCT.length} [${structKinds.join(",")}] (≥6; faltan: ${STRUCT.filter(k=>!count[k]).join(",")})` },
  { ok: structCount / tot >= 0.12, msg: `peso de estructurados = ${(100 * structCount / tot).toFixed(0)}% (≥12% — bars/cross/process/journey/etc. no pueden ser migajas)` },
  { ok: (count.bars || 0) >= 2 && (count.checklist || 0) >= 1, msg: `bars=${count.bars||0} (≥2), checklist=${count.checklist||0} (≥1)` },
];

console.log(`\n=== variedad de componentes: ${slug} (${tot} beats) ===`);
for (const [k, v] of Object.entries(count).sort((a, b) => b[1] - a[1]))
  console.log(String(v).padStart(3), (100 * v / tot).toFixed(0).padStart(3) + "%", k);

const fails = RULES.filter((r) => !r.ok);
console.log("");
if (fails.length === 0) {
  console.log("✅ variedad OK — pasa el gate.");
} else {
  console.error("❌ VARIEDAD INSUFICIENTE — rebalanceá el beatsheet antes de renderizar:");
  for (const f of fails) console.error("  · " + f.msg);
  console.error("\nIdea: por cada CIFRA→stat/bars, LUGAR→journey/map, CRONOLOGÍA→timeline/journey,");
  console.error("COMPARACIÓN→bars/cross/splitlist, PROCESO→process/checklist, FOTO con partes→annotated/callout.");
  process.exit(1);
}
