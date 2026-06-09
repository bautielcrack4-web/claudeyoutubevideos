import fs from "fs";
const caps = JSON.parse(fs.readFileSync("public/captions_fly.json", "utf8"));
const fmt = (ms) => {
  const s = ms / 1000, m = Math.floor(s / 60), r = (s - m * 60).toFixed(1).padStart(4, "0");
  return `${String(m).padStart(2, "0")}:${r}`;
};
let segs = [], cur = { start: null, text: "" };
for (const c of caps) {
  if (cur.start == null) cur.start = c.startMs;
  cur.text += c.text;
  if (/[.!?]$/.test(c.text.trim())) {
    cur.endMs = c.endMs ?? c.startMs;
    segs.push(cur);
    cur = { start: null, text: "" };
  }
}
if (cur.text.trim()) { cur.endMs = caps[caps.length - 1].endMs; segs.push(cur); }
const out = segs.map((s) => `[${fmt(s.start)}] ${s.text.trim()}`).join("\n");
fs.writeFileSync("transcript_fly_sentences.txt", out);
console.log("sentences:", segs.length, " last:", fmt(segs[segs.length - 1].start));
