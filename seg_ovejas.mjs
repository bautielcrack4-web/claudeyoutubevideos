import fs from "fs";
const caps = JSON.parse(fs.readFileSync("public/captions_ovejas.json", "utf8"));
let segs = [], cur = "", start = null;
for (const c of caps) {
  if (start === null) start = c.startMs;
  cur += c.text;
  if (/[.!?]["']?\s*$/.test(c.text) && cur.trim().length > 0) {
    segs.push({ t: +(start / 1000).toFixed(1), text: cur.trim() });
    cur = ""; start = null;
  }
}
if (cur.trim()) segs.push({ t: +(start / 1000).toFixed(1), text: cur.trim() });
const lines = segs.map((s) => `[${s.t}] ${s.text}`);
fs.writeFileSync("transcript_ovejas_segments.txt", lines.join("\n"));
fs.writeFileSync("public/segments_ovejas.json", JSON.stringify(segs, null, 2));
console.log("segments:", segs.length, "· last t:", segs[segs.length - 1].t);
