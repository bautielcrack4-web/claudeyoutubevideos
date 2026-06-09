import fs from "fs";
const caps = JSON.parse(fs.readFileSync("public/captions_estufa.json", "utf8"));
const fmt = (ms) => {
  const s = ms / 1000, m = Math.floor(s / 60), r = (s - m * 60).toFixed(1);
  return `${String(m).padStart(2, "0")}:${r.padStart(4, "0")}`;
};
let segs = [], cur = "", start = null;
for (const c of caps) {
  if (start === null) start = c.startMs;
  cur += c.text;
  if (/[.!?]\s*$/.test(c.text) && cur.trim().length > 0) {
    segs.push(`[${fmt(start)}] ${(start / 1000).toFixed(1)}s  ${cur.trim()}`);
    cur = ""; start = null;
  }
}
if (cur.trim()) segs.push(`[${fmt(start)}] ${(start / 1000).toFixed(1)}s  ${cur.trim()}`);
fs.writeFileSync("transcript_estufa_segments.txt", segs.join("\n"));
console.log("segments:", segs.length);
