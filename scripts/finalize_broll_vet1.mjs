// finalize_broll_vet1.mjs — poda VET1_BROLL a los clips que EXISTEN en broll/vet1/
// y recalcula dur = (t del próximo clip existente) − t, para cerrar los huecos de los
// que Pexels no tenía (sin frames negros). Reescribe src/VideoEdit/vet1_broll.ts.
import fs from "fs";
const thin = JSON.parse(fs.readFileSync("public/broll/dense_thinned_v1.json", "utf8"));
const caps = (() => { const c = JSON.parse(fs.readFileSync("public/captions_vet1.json", "utf8")); return c.words || c; })();
const VEND = (caps[caps.length - 1].startMs / 1000) + 2;
const exists = (name) => fs.existsSync(`public/broll/vet1/${name}.mp4`);
const kept = thin.filter((k) => exists(k.name));
const broll = kept.map((k, i) => ({
  name: k.name, src: `broll/vet1/${k.name}.mp4`,
  start: k.t, dur: +(((i + 1 < kept.length ? kept[i + 1].t : VEND) - k.t)).toFixed(2),
  query: k.query,
}));

// ── RELLENO DE HUECOS: donde un clip queda >MAXHOLD, subdividir y reusar footage
// genérico (perro/vet/pata) del pool existente para que la capa cambie cada ~SEG s.
const MAXHOLD = 6, SEG = 4.4;
const pool = kept.filter((k) => /dog|golden|paw|vet|puppy|retriever|canine|owner/i.test(k.query));
let gi = 3;
const filled = [];
for (const c of broll) {
  const origEnd = +(c.start + c.dur).toFixed(2);
  if (c.dur > MAXHOLD && pool.length) {
    const n = Math.max(2, Math.round(c.dur / SEG));
    c.dur = SEG;
    filled.push(c);
    for (let s = 1; s < n; s++) {
      const g = pool[gi++ % pool.length];
      const start = +(c.start + s * SEG).toFixed(2);
      const dur = s === n - 1 ? +(origEnd - start).toFixed(2) : SEG;
      if (dur <= 0.3) continue;
      filled.push({ name: `${g.name}_f${filled.length}`, src: `broll/vet1/${g.name}.mp4`, start, dur, query: g.query });
    }
  } else filled.push(c);
}
const finalBroll = filled.sort((a, b) => a.start - b.start);
fs.writeFileSync("src/VideoEdit/vet1_broll.ts",
  `// AUTO-GENERADO por scripts/finalize_broll_vet1.mjs — b-roll denso podado a clips existentes.\n` +
  `export const VET1_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(finalBroll)};\n`);
const durs = finalBroll.map((c) => c.dur);
const maxHold = Math.max(...durs);
console.log(`podado: ${thin.length} → ${kept.length} clips reales; con relleno: ${finalBroll.length} slots · max hold ahora ${maxHold.toFixed(1)}s (antes 127s)`);
