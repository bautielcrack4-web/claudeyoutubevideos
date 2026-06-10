import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES } from "./cues_bisontes.gen";

// ── LOS 28 BISONTES DE NAHANNI — documental con avatar (~25.5 min) ──
// Narración (public/bisontes.wav, la provee AvatarLayer vía bisontes_opt.mp4) +
// flujo denso de imágenes reales, clips, diagramas y journeys. Paleta terrosa.
// Cues generados desde beatsheet/bisontes.json (build_bisontes.mjs).
const SECONDS = 1530.5;
export const TOTAL_FRAMES_BI = Math.round(SECONDS * 30); // 45915

// límites de acto (segundos) — para grade + stingers
const ACTS = [0, 53, 122, 268, 368, 489, 685, 886, 1021, 1238];

// color-grade por mood de sección (wash suave, paleta terrosa)
const GRADE: GradeRange[] = [
  { from: 0, to: 53, tint: "#C8904A", strength: 0.06 },      // hook: ámbar cálido
  { from: 53, to: 122, tint: "#7C8A5A", strength: 0.06 },    // abundancia: salvia/vida
  { from: 122, to: 268, tint: "#B0503C", strength: 0.07 },   // matanza: terracota
  { from: 268, to: 368, tint: "#6F8478", strength: 0.07 },   // redescubrimiento: eucalipto frío
  { from: 368, to: 489, tint: "#A9794A", strength: 0.06 },   // plan/Elk Island: sepia
  { from: 489, to: 685, tint: "#A9794A", strength: 0.06 },   // operativo 1980: sepia cálido
  { from: 685, to: 886, tint: "#6E8B47", strength: 0.06 },   // explosión/vida: verde jardín
  { from: 886, to: 1021, tint: "#B0503C", strength: 0.07 },  // colapso: terracota
  { from: 1021, to: 1238, tint: "#6F8478", strength: 0.07 }, // clima/hielo: eucalipto frío
  { from: 1238, to: SECONDS, tint: "#A9794A", strength: 0.06 }, // cierre: sepia nostálgico
];

// camas ambientales loopables (vol muy bajo) — regla de niveles: 0.035–0.05
const WINTER = "sfx/cold_winter_wind,_lo_#1-1780924461333.mp3";
const AMBIENT: { from: number; to: number; src: string; vol: number }[] = [
  { from: 0, to: 53, src: WINTER, vol: 0.035 },          // viento ártico del hook
  { from: 53, to: 122, src: "sfx/amb_campo.mp3", vol: 0.04 }, // praderas
  { from: 122, to: 268, src: "sfx/amb_campo.mp3", vol: 0.038 }, // matanza (pradera)
  { from: 268, to: 489, src: WINTER, vol: 0.035 },        // bosque frío / plan
  { from: 489, to: 685, src: WINTER, vol: 0.038 },        // operativo norte
  { from: 685, to: 886, src: "sfx/amb_campo.mp3", vol: 0.04 }, // valle/vida
  { from: 886, to: 1238, src: WINTER, vol: 0.04 },        // colapso + clima (invierno)
  { from: 1238, to: SECONDS, src: WINTER, vol: 0.035 },   // cierre helado
];

// ── float inserts (kind "float"): se renderizan ENCIMA del avatar full-screen ──
const FLOAT_CUES = CUES.filter((c) => c.kind === "float");
const BASE_CUES = CUES.filter((c) => c.kind !== "float");
const FLOAT_SPANS = FLOAT_CUES.map((c) => ({ s: c.start, e: c.start + c.dur }));
// el avatar va en PiP esquina solo sobre b-roll/numeros/citas; OCULTO bajo cualquier
// gráfico full-bleed (diagramas, timeline, barras, proceso, headline, etc.).
const PIP_KINDS = new Set(["raw", "stat", "quote", "chips"]);
// aperturas de sección: el avatar ABRE cada acto a pantalla completa unos segundos.
const OPENER = 5; // s de avatar full al inicio de cada acto
const OPENER_SPANS = ACTS.filter((t) => t > 0).map((t) => ({ s: t, e: t + OPENER }));

// ── Cronograma del AVATAR ────────────────────────────────────────────────────
// Reglas: hidden en HOOK (0–53) y sobre DIAGRAMAS/IMPACT/JOURNEY (full-bleed).
// FULL en: aperturas de acto, durante un FLOAT (insert flotando al lado), y en
// huecos sin b-roll. cornerTR (PiP sobre b-roll) el resto del tiempo hablado.
function modeAt(t: number): AvatarWindow["mode"] {
  if (t < 53) return "hidden";
  for (const f of FLOAT_SPANS) if (t >= f.s && t < f.e) return "full";
  const c = BASE_CUES.find((c) => t >= c.start && t < c.start + c.dur);
  // un gráfico full-bleed (diagrama/timeline/barras/proceso/headline/etc.) SIEMPRE
  // oculta el avatar, aunque caiga en una apertura de acto (si no, lo taparía).
  if (c && !PIP_KINDS.has(c.kind)) return "hidden";
  for (const a of OPENER_SPANS) if (t >= a.s && t < a.e) return "full"; // apertura → full
  if (!c) return "full"; // hueco → habla full
  return "cornerTR"; // raw/stat/quote/chips → PiP sobre el b-roll
}
function buildAvatarWindows(): AvatarWindow[] {
  // muestreo en todas las fronteras (starts/ends de cues + spans + actos)
  const marks = new Set<number>([0, 53, SECONDS]);
  for (const c of BASE_CUES) { marks.add(c.start); marks.add(+(c.start + c.dur).toFixed(2)); }
  for (const f of FLOAT_SPANS) { marks.add(f.s); marks.add(+f.e.toFixed(2)); }
  for (const a of OPENER_SPANS) { marks.add(a.s); marks.add(+a.e.toFixed(2)); }
  const times = [...marks].filter((t) => t >= 0 && t < SECONDS).sort((a, b) => a - b);
  const w: AvatarWindow[] = [];
  let last = "";
  for (let i = 0; i < times.length; i++) {
    const t0 = times[i], t1 = times[i + 1] ?? SECONDS;
    const mid = (t0 + t1) / 2;
    const mode = modeAt(mid);
    if (mode !== last) { w.push({ start: +t0.toFixed(2), mode }); last = mode; }
  }
  w.push({ start: SECONDS, mode: "hidden" });
  return w;
}
const AVATAR_WINDOWS = buildAvatarWindows();

export const MainBisontes: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {/* camas ambientales debajo de todo */}
      {AMBIENT.map((a, i) => (
        <Sequence key={"amb" + i} from={sec(a.from)} durationInFrames={sec(a.to - a.from)} layout="none">
          <Audio src={staticFile(a.src)} volume={a.vol} loop />
        </Sequence>
      ))}
      <CinematicWrap handheld={0.8} grain={0.06}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="cold" drift={0.5} />
          {BASE_CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {/* AVATAR encima del b-roll (provee el audio de la narración siempre) */}
          <AvatarLayer src="bisontes_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {/* FLOAT inserts: imagen flotando al lado del avatar full → ENCIMA del avatar */}
          {FLOAT_CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <SectionGrade ranges={GRADE} />
          {/* whip + light-leak en cada cambio de acto */}
          {ACTS.filter((t) => t > 0).map((t) => (
            <Sequence key={"stg" + t} from={sec(t) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
              <SectionStinger />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
      {/* cambio de acto: swell + golpe grave (niveles contenidos) */}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.2} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.22} durationInFrames={sec(1.6)} />
      ))}
    </AbsoluteFill>
  );
};
