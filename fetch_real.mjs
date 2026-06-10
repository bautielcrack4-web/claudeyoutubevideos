// fetch_real.mjs — baja IMÁGENES REALES (no IA, no stock genérico) sobre el tema
// concreto del documental: retratos de figuras PÚBLICAS por nombre exacto, más
// fotos reales de lugares/eventos/históricas. Prioriza fuentes con LICENCIA LIBRE
// (seguras para monetizar) y guarda la atribución que cada licencia exige.
//
// Fuentes, en orden de preferencia:
//   1) Wikidata  → retrato oficial de una persona/entidad (propiedad P18).      [libre]
//   2) Wikimedia Commons → buscador de archivos por tema.                        [libre]
//   3) Openverse → agregador de imágenes Creative Commons.                       [libre]
//   4) Google Custom Search (searchType=image, rights=cc_*) — capa GRIS opcional [filtrada por licencia]
//        requiere GOOGLE_CSE_KEY + GOOGLE_CSE_CX. Aun filtrado, REVISÁ la licencia
//        real de cada imagen antes de monetizar: el filtro de Google no es perfecto.
//
// Salida:
//   public/real/<name>.<ext>           (la/s imagen/es)
//   public/real/credits.json           (atribución: autor, licencia, fuente, URL)
//
// Requisitos:
//   - (opcional) GOOGLE_CSE_KEY + GOOGLE_CSE_CX en .env para la capa gris.
//   - nada más: Wikidata/Commons/Openverse no piden API key.
//
// Lista de tomas — public/real/real_shots.json:
//   [
//     { "name": "mairi_mcallan", "query": "Mairi McAllan", "type": "person" },
//     { "name": "knapdale",      "query": "Knapdale Scotland", "type": "topic", "count": 3 },
//     { "name": "beaver_dam",    "query": "beaver dam river",  "type": "topic", "count": 2, "grey": true }
//   ]
//
// Uso:
//   node fetch_real.mjs [real_shots.json=public/real/real_shots.json] [outDir=public/real]
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

// Wikimedia EXIGE un User-Agent descriptivo o devuelve 403.
const UA = "reppo-doc-mograph/1.0 (https://reppo.app; bautielcrack4@gmail.com)";
const H = { "User-Agent": UA, Accept: "application/json" };

const [shotsArg, outArg] = process.argv.slice(2);
const SHOTS = shotsArg || "public/real/real_shots.json";
const OUT = outArg || "public/real";
fs.mkdirSync(OUT, { recursive: true });

if (!fs.existsSync(SHOTS)) {
  console.error("No existe la lista de tomas:", SHOTS);
  console.error('Creá una con: [{ "name":"x", "query":"...", "type":"person|topic", "count":1, "grey":false }]');
  process.exit(1);
}
const shots = JSON.parse(fs.readFileSync(SHOTS, "utf8"));

const creditsPath = path.join(OUT, "credits.json");
const credits = fs.existsSync(creditsPath) ? JSON.parse(fs.readFileSync(creditsPath, "utf8")) : {};

const jget = async (url) => {
  const r = await fetch(url, { headers: H });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
};

const extFromUrl = (u) => {
  const m = u.split("?")[0].match(/\.(jpg|jpeg|png|webp|gif)$/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
};

const download = async (url, dest) => {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`download ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
};

// Limpia HTML de los campos extmetadata de Commons.
const strip = (s) => (s ? String(s).replace(/<[^>]+>/g, "").trim() : "");

// ── 1) Wikidata: nombre → entidad → P18 (imagen en Commons) ───────────────────
const wikidataImage = async (query) => {
  const s = await jget(
    `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&limit=1&search=${encodeURIComponent(query)}`,
  );
  const ent = s.search?.[0];
  if (!ent) return null;
  const claims = await jget(
    `https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&property=P18&entity=${ent.id}`,
  );
  const file = claims.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
  if (!file) return null;
  return { file: `File:${file}`, label: ent.label, entity: ent.id };
};

// extmetadata de un File: de Commons → url + atribución.
const commonsFileInfo = async (fileTitle, width = 1600) => {
  const j = await jget(
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=${width}`,
  );
  const pages = j.query?.pages || {};
  const page = Object.values(pages)[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) return null;
  const ex = ii.extmetadata || {};
  return {
    url: ii.thumburl || ii.url,
    artist: strip(ex.Artist?.value) || "Unknown",
    license: strip(ex.LicenseShortName?.value) || "see source",
    credit: strip(ex.Credit?.value),
    source: ii.descriptionshorturl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(fileTitle)}`,
    via: "Wikimedia Commons",
  };
};

// ── 2) Wikimedia Commons: buscador de archivos por tema ───────────────────────
const commonsSearch = async (query, count) => {
  const j = await jget(
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=${count * 2}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1600`,
  );
  const pages = Object.values(j.query?.pages || {});
  const out = [];
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii?.thumburl) continue;
    if (!/\.(jpg|jpeg|png|webp)$/i.test(ii.url)) continue; // saltea svg/pdf/tif
    const ex = ii.extmetadata || {};
    out.push({
      url: ii.thumburl,
      artist: strip(ex.Artist?.value) || "Unknown",
      license: strip(ex.LicenseShortName?.value) || "see source",
      credit: strip(ex.Credit?.value),
      source: ii.descriptionshorturl || p.title,
      via: "Wikimedia Commons",
    });
    if (out.length >= count) break;
  }
  return out;
};

// ── 3) Openverse: agregador Creative Commons (uso comercial) ──────────────────
const openverseSearch = async (query, count) => {
  const j = await jget(
    `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&license_type=commercial&page_size=${count}&mature=false`,
  );
  return (j.results || []).map((r) => ({
    url: r.url,
    artist: r.creator || "Unknown",
    license: `${r.license || ""} ${r.license_version || ""}`.trim(),
    credit: r.attribution || "",
    source: r.foreign_landing_url || r.url,
    via: `Openverse / ${r.source || "?"}`,
  }));
};

// ── 4) Google Custom Search (capa GRIS, filtrada por licencia) ────────────────
const googleSearch = async (query, count) => {
  const key = process.env.GOOGLE_CSE_KEY;
  const cx = process.env.GOOGLE_CSE_CX;
  if (!key || !cx) {
    console.warn(`    (capa gris saltada: faltan GOOGLE_CSE_KEY / GOOGLE_CSE_CX)`);
    return [];
  }
  const rights = "cc_publicdomain|cc_attribute|cc_sharealike";
  const j = await jget(
    `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&searchType=image&num=${Math.min(count, 10)}&rights=${encodeURIComponent(rights)}&q=${encodeURIComponent(query)}`,
  );
  return (j.items || []).map((it) => ({
    url: it.link,
    artist: it.displayLink || "web",
    license: "cc-filtered (VERIFICAR licencia real)",
    credit: "",
    source: it.image?.contextLink || it.link,
    via: "Google CSE (gris)",
  }));
};

// ── runner ────────────────────────────────────────────────────────────────────
const run = async () => {
  for (const shot of shots) {
    const { name, query, type = "topic", count = 1, grey = false } = shot;
    if (!name || !query) {
      console.warn("Toma inválida (falta name/query):", JSON.stringify(shot));
      continue;
    }
    process.stdout.write(`• ${name}  [${type}] "${query}" … `);
    try {
      let hits = [];

      if (type === "person") {
        const wd = await wikidataImage(query);
        if (wd) {
          const info = await commonsFileInfo(wd.file);
          if (info) hits.push(info);
        }
        if (!hits.length) {
          // sin retrato oficial en Wikidata → probamos Commons por nombre
          hits = await commonsSearch(query, count);
        }
      } else {
        hits = await commonsSearch(query, count);
        if (hits.length < count) {
          const more = await openverseSearch(query, count - hits.length);
          hits.push(...more);
        }
        if (grey && hits.length < count) {
          const g = await googleSearch(query, count - hits.length);
          hits.push(...g);
        }
      }

      if (!hits.length) {
        console.log("✗ sin resultados libres");
        continue;
      }

      let i = 0;
      for (const h of hits.slice(0, count)) {
        const ext = extFromUrl(h.url);
        const fname = count > 1 ? `${name}_${i + 1}.${ext}` : `${name}.${ext}`;
        const dest = path.join(OUT, fname);
        const bytes = await download(h.url, dest);
        credits[`real/${fname}`] = {
          query,
          type,
          artist: h.artist,
          license: h.license,
          credit: h.credit,
          source: h.source,
          via: h.via,
        };
        i++;
        process.stdout.write(`\n    ✓ real/${fname}  (${(bytes / 1024).toFixed(0)} KB) — ${h.license} · ${h.via}`);
      }
      console.log("");
    } catch (e) {
      console.log(`✗ ${e.message}`);
    }
    // cortesía con las APIs públicas
    await new Promise((r) => setTimeout(r, 350));
  }

  fs.writeFileSync(creditsPath, JSON.stringify(credits, null, 2));
  console.log(`\nAtribución guardada en ${creditsPath}`);
  console.log("⚠ CC-BY/SA exigen CRÉDITO en pantalla o descripción. La capa 'gris' (Google) puede traer copyright: verificá antes de monetizar.");
};

run();
