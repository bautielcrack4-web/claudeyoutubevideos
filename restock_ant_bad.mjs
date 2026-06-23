import fs from "fs"; import path from "path"; import { spawnSync } from "child_process";
const env=path.join(process.cwd(),".env"); if(fs.existsSync(env))for(const l of fs.readFileSync(env,"utf8").split(/\r?\n/)){const m=l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,"");}
const KEY=process.env.PEXELS_API_KEY; const FF=path.join(process.cwd(),"node_modules","@remotion","compositor-win32-x64-msvc","ffmpeg.exe"); const OUT="public/broll";
const CUES=JSON.parse(fs.readFileSync("src/VideoEdit/antartida_cues.json","utf8")); const durOf=n=>Math.max(4,Math.ceil(CUES.find(c=>c.name===n)?.dur??6)+1);
// clips con texto/branding/promo/presentador quemado → stock LIMPIO on-theme
const FIX={
 mg_anomalia:["abstract magnetic energy dark","glowing energy field dark"],
 mg_masivo:["deep underground dark cave","dark abstract depth"],
 rd_barridos:["sonar radar screen sweep","dark ocean sonar"],
 rd_contornos:["abstract scan lines dark blue","digital grid dark"],
 rd_estructuras:["deep ice cross section blue","glacier ice deep dark"],
 rd_perforar:["ice core drilling rig","deep ice drilling antarctica"],
 vk_perforando:["ice drilling machine snow","ice core drilling"],
 hj_huecos:["vintage paper documents close","old archive papers"],
};
const pick=fs2=>{const ok=(fs2||[]).filter(f=>f.file_type==="video/mp4").map(f=>({...f,w:f.width||0})).sort((a,b)=>a.w-b.w);const u=ok.filter(f=>f.w<=1920);return (u.length?u[u.length-1]:ok[ok.length-1])||null;};
const search=async q=>{const u=new URL("https://api.pexels.com/videos/search");u.searchParams.set("query",q);u.searchParams.set("orientation","landscape");u.searchParams.set("per_page","5");u.searchParams.set("size","medium");const r=await fetch(u,{headers:{Authorization:KEY}});if(!r.ok)return null;return ((await r.json()).videos||[])[0]||null;};
let ok=0,fail=0;
for(const [name,qs] of Object.entries(FIX)){const dest=path.join(OUT,`${name}.mp4`),tmp=path.join(OUT,`_t_${name}.mp4`);let done=false;
 for(const q of qs){const v=await search(q);if(!v)continue;const f=pick(v.video_files);if(!f)continue;try{const r=await fetch(f.link);if(!r.ok)continue;fs.writeFileSync(tmp,Buffer.from(await r.arrayBuffer()));const dur=durOf(name);const rr=spawnSync(FF,["-y","-stream_loop","-1","-i",tmp,"-t",String(dur),"-vf","scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080","-an","-c:v","libx264","-pix_fmt","yuv420p",dest],{encoding:"utf8"});fs.rmSync(tmp,{force:true});if(rr.status===0&&fs.existsSync(dest)){console.log(`✓ ${name} ← "${q}"`);ok++;done=true;break;}}catch(e){}}
 if(!done){console.log(`✗ ${name}`);fail++;}}
console.log(`\n=== ${ok} OK · ${fail} fallos ===`);
