import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES } from "./cues_estiercol.gen";

// ── REVIVÍ TU TIERRA MUERTA CON $1 — documental con avatar (~31.8 min) ──
// EDICIÓN DE BAJO ESFUERZO (pedido del usuario: canal "muerto"): el avatar habla
// SOLO a pantalla completa la mayor parte del video; pocos apoyos = clips REALES
// de YouTube (public/broll/, bajados con fetch_clips.mjs) + 2 checklists. Paleta
// terrosa. Cues desde beatsheet/estiercol.json.
const SECONDS = 1906.48;
export const TOTAL_FRAMES_EST = Math.round(SECONDS * 30); // 57194

// límites de acto (segundos) — para grade + stingers (pocos, montaje respirado)
const ACTS = [0, 205, 360, 700, 1040, 1480];

// color-grade por mood de sección (wash suave, paleta terrosa)
const GRADE: GradeRange[] = [
  { from: 0, to: 205, tint: "#C8904A", strength: 0.06 },     // hook/intro: ámbar cálido
  { from: 205, to: 360, tint: "#7C8A5A", strength: 0.06 },   // la tierra viva: salvia
  { from: 360, to: 700, tint: "#A9794A", strength: 0.06 },   // los 5 ingredientes: sepia
  { from: 700, to: 1040, tint: "#6F8478", strength: 0.06 },  // el método por capas: eucalipto
  { from: 1040, to: 1480, tint: "#6E8B47", strength: 0.06 }, // los 7 días / sistema: verde
  { from: 1480, to: SECONDS, tint: "#A9794A", strength: 0.06 }, // historia + cierre: sepia
];

// SIN cama ambiental de fondo (pedido del usuario: el "viento" persistente suena
// muy mal). Solo narración + SFX puntuales de sección.

// el avatar va en PiP esquina solo sobre b-roll; OCULTO bajo gráficos full-bleed
// (checklists). En todo hueco sin cue → habla a pantalla completa (la mayoría).
const PIP_KINDS = new Set(["raw", "stat", "quote", "chips"]);
const OPENER = 4; // s de avatar full al inicio de cada acto
const OPENER_SPANS = ACTS.filter((t) => t > 0).map((t) => ({ s: t, e: t + OPENER }));

// ── Cronograma del AVATAR ────────────────────────────────────────────────────
function modeAt(t: number): AvatarWindow["mode"] {
  const c = CUES.find((c) => t >= c.start && t < c.start + c.dur);
  // gráfico full-bleed (checklist) → oculta el avatar (la tarjeta llena la pantalla)
  if (c && !PIP_KINDS.has(c.kind)) return "hidden";
  for (const a of OPENER_SPANS) if (t >= a.s && t < a.e) return "full"; // apertura → full
  if (!c) return "full"; // hueco → habla full (la mayor parte del video)
  return "cornerTR"; // raw → PiP sobre el b-roll
}
function buildAvatarWindows(): AvatarWindow[] {
  const marks = new Set<number>([0, SECONDS]);
  for (const c of CUES) { marks.add(c.start); marks.add(+(c.start + c.dur).toFixed(2)); }
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

export const MainEstiercol: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0.8} grain={0.06}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="amber" drift={0.5} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {/* AVATAR encima del b-roll (provee el audio de la narración siempre) */}
          <AvatarLayer src="estiercol_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          <SectionGrade ranges={GRADE} />
          {ACTS.filter((t) => t > 0).map((t) => (
            <Sequence key={"stg" + t} from={sec(t) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
              <SectionStinger />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.2} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.22} durationInFrames={sec(1.6)} />
      ))}
    </AbsoluteFill>
  );
};
