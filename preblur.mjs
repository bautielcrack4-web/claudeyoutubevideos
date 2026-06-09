// preblur.mjs — STANDARD WORKFLOW STEP (run after generating all images, before render).
//
// Why: a full-screen photo with CSS `filter: blur(Npx)` is re-blurred on EVERY
// rendered frame — the single most expensive per-frame thing in these scenes. Blur is
// deterministic, so baking it into the asset ONCE (ffmpeg) is pixel-identical to live
// blur but moves the cost out of the per-frame path. Zero quality loss.
//
// Genera, para cada foto, un hermano `<name>_blur.jpg`. `ImageBackdrop` lo usa solo
// (con blur=0) cuando existe → los fondos blureados dejan de costar por frame.
//
// Usage:  node preblur.mjs
//   - escanea public/img/ (png+jpg) y public/assets/stock/ (jpg) si existe
//   - escribe <name>_blur.jpg al lado (salta los ya hechos y más nuevos que la fuente)
//   - SALTA: los *_blur, los diagramas (dg_*, se muestran NÍTIDOS en DiagramBoard) y
//     la referencia del avatar (_avatar_ref).
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FFMPEG = join(__dirname, "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe");

const DIRS = [join(__dirname, "public/img"), join(__dirname, "public/assets/stock")].filter((d) => existsSync(d));

// archivos que NUNCA van como fondo blureado (se muestran nítidos):
const skipName = (f) => /^dg_/i.test(f) || /^_avatar_ref/i.test(f) || /_blur\.(jpe?g|png)$/i.test(f);

// NOTE: el ffmpeg embebido de Remotion NO trae filtros de blur (no gblur/boxblur).
// Falsificamos un gaussiano con doble-escala: bajar duro (area = low-pass limpio) y
// subir (bilinear = reconstrucción suave). 64px ≈ imageBlur≈7 a 1920. Salida 1600px.
const SMALL = 64;
const FULL = 1600;
const QUALITY = 3;

let made = 0, skipped = 0;
for (const DIR of DIRS) {
  const files = readdirSync(DIR).filter((f) => /\.(jpe?g|png)$/i.test(f) && !skipName(f));
  for (const f of files) {
    const src = join(DIR, f);
    const out = join(DIR, f.replace(/\.(jpe?g|png)$/i, "_blur.jpg"));
    if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) {
      skipped++;
      continue;
    }
    execFileSync(
      FFMPEG,
      ["-y", "-i", src, "-vf", `scale=${SMALL}:-1:flags=area,scale=${FULL}:-1:flags=bilinear`, "-q:v", String(QUALITY), out],
      { stdio: ["ignore", "ignore", "ignore"] },
    );
    made++;
  }
}
console.log(`preblur: done (${made} baked, ${skipped} up-to-date).`);
