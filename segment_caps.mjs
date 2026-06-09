import fs from "fs";
const caps = JSON.parse(fs.readFileSync("public/captions_beduinos.json","utf8"));
const fmt = (ms)=>{const s=ms/1000,m=Math.floor(s/60),r=Math.floor(s-m*60);return `${String(m).padStart(2,"0")}:${String(r).padStart(2,"0")}`};
let segs=[], cur="", start=null;
for(const c of caps){
  if(start===null) start=c.startMs;
  cur+=c.text;
  if(/[.!?]\s*$/.test(c.text) && cur.trim().length>0){
    segs.push(`[${fmt(start)}] ${cur.trim()}`);
    cur=""; start=null;
  }
}
if(cur.trim()) segs.push(`[${fmt(start)}] ${cur.trim()}`);
fs.writeFileSync("transcript_beduinos_segments.txt", segs.join("\n"));
console.log("segments:", segs.length);
