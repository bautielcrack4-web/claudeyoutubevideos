// vstill.mjs — credit-saving verification still.
//
// Why: a full 1920x1080 PNG verification frame is ~0.5–2 MB and costs a LOT of
// vision tokens to Read. The blurred/darkened backgrounds and overall layout are
// perfectly judge-able at ~640px. This renders the still, then downscales it to a
// small JPG so the image I Read is ~10–25 KB instead of 1.5 MB.
//
// Usage:  node vstill.mjs <CompId> <frame> [width=640]
//   e.g.  node vstill.mjs VideoEditP2 4600
// Prints the small preview path on the last line; Read THAT, not the full PNG.

import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FFMPEG = join(__dirname, "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe");

const [comp = "VideoEditP2", frame = "0", width = "640"] = process.argv.slice(2);
const fullPng = join(tmpdir(), `vstill_${comp}_${frame}.png`);
const smallJpg = join(tmpdir(), `vstill_${comp}_${frame}_${width}.jpg`);

// 1) render the full still (the expensive, unavoidable part)
execFileSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["remotion", "still", comp, fullPng, `--frame=${frame}`],
  { cwd: __dirname, stdio: ["ignore", "ignore", "inherit"] },
);

// 2) downscale to a small JPG for cheap reading
execFileSync(
  FFMPEG,
  ["-y", "-i", fullPng, "-vf", `scale=${width}:-1`, "-q:v", "5", smallJpg],
  { stdio: ["ignore", "ignore", "ignore"] },
);

console.log(smallJpg);
