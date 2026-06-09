// vsheet.mjs — contact sheet from an already-rendered mp4 (no re-bundle, no public copy).
// Frames are pulled straight from the finished mp4 by fast time-seek (instant), then
// composited into ONE grid image with sharp. This is the cheap+fast way to review a
// render: one image to look at instead of N stills, and zero Remotion bundling.
//
// Usage:
//   node vsheet.mjs <input.mp4> <output.jpg> <fps> <f1,f2,...> [cols] [thumbW]
//   node vsheet.mjs out/bank.mp4 out/sheet.jpg 30 35,180,400,650 4 460
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const FF = path.join(
  process.cwd(),
  "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe",
);

const [input, output, fpsArg, framesArg, colsArg, wArg] = process.argv.slice(2);
if (!input || !output || !fpsArg || !framesArg) {
  console.error("usage: node vsheet.mjs <in.mp4> <out.jpg> <fps> <f1,f2,...> [cols] [thumbW]");
  process.exit(1);
}
const fps = Number(fpsArg);
const frames = framesArg.split(",").map((s) => Number(s.trim()));
const cols = Number(colsArg) || 4;
const W = Number(wArg) || 460;
const PAD = 8;

const tmp = path.join(path.dirname(output), ".vsheet_tmp");
fs.mkdirSync(tmp, { recursive: true });

// 1) extract one frame per requested frame number (fast -ss seek before -i)
const thumbs = frames.map((fr, i) => {
  const sec = (fr / fps).toFixed(3);
  const out = path.join(tmp, `t${String(i).padStart(2, "0")}.jpg`);
  const r = spawnSync(FF, [
    "-y", "-ss", sec, "-i", input, "-frames:v", "1",
    "-vf", `scale=${W}:-1`, "-q:v", "5", out,
  ], { encoding: "utf8" });
  if (r.status !== 0) { console.error(r.stderr?.slice(-400)); throw new Error("ffmpeg extract failed @" + fr); }
  return out;
});

// 2) composite into a grid with sharp
const meta = await sharp(thumbs[0]).metadata();
const tw = meta.width, th = meta.height;
const rows = Math.ceil(thumbs.length / cols);
const canvasW = cols * tw + (cols + 1) * PAD;
const canvasH = rows * th + (rows + 1) * PAD;

const composites = await Promise.all(thumbs.map(async (t, i) => ({
  input: await sharp(t).toBuffer(),
  left: PAD + (i % cols) * (tw + PAD),
  top: PAD + Math.floor(i / cols) * (th + PAD),
})));

await sharp({ create: { width: canvasW, height: canvasH, channels: 3, background: "#ffffff" } })
  .composite(composites)
  .jpeg({ quality: 70 })
  .toFile(output);

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`wrote ${output} — ${thumbs.length} thumbs, ${cols}x${rows}, ${canvasW}x${canvasH}`);
