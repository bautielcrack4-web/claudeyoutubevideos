import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES } from "./cues_impuestos.gen";

// ── EXENCIÓN DEL IMPUESTO PREDIAL PARA ADULTOS MAYORES — finanzas, con avatar ──
// Narración (impuestos_opt.mp4, audio provisto por AvatarLayer) + flujo denso de
// imágenes reales, cifras, mapas, barras, pasos y diagramas. Paleta terrosa serif.
// Cues generados desde beatsheet/impuestos.json (build_impuestos.mjs).
const SECONDS = 748.56;
export const TOTAL_FRAMES_IMP = Math.round(SECONDS * 30); // 22457

// límites de sección (segundos) — para grade + stingers
const ACTS = [0, 79.5, 170.5, 234.1, 352.7, 430.9, 485.2, 613.8];

// color-grade por mood de sección (wash suave, paleta terrosa)
const GRADE: GradeRange[] = [
  { from: 0, to: 79.5, tint: "#B0503C", strength: 0.07 },    // hook: el problema (terracota)
  { from: 79.5, to: 170.5, tint: "#A9794A", strength: 0.06 },// Roberto: sepia cálido
  { from: 170.5, to: 234.1, tint: "#6F8478", strength: 0.07 },// por qué no avisan: eucalipto frío
  { from: 234.1, to: 352.7, tint: "#7C8A5A", strength: 0.06 },// 3 tipos: salvia
  { from: 352.7, to: 430.9, tint: "#6F8478", strength: 0.06 },// mito + estados: frío
  { from: 430.9, to: 485.2, tint: "#A9794A", strength: 0.06 },// Marta: sepia
  { from: 485.2, to: 613.8, tint: "#6E8B47", strength: 0.06 },// 5 pasos: verde acción
  { from: 613.8, to: SECONDS, tint: "#A9794A", strength: 0.07 },// Domingo + cierre: sepia nostálgico
];

// ── lógica de posición del AVATAR (auto-derivada de los cues) ─────────────────
// Regla dura: lo PRIMERO es avatar full ~1.6s antes de la 1ª imagen.
const FIRST_IMG = 1.6;
const PIP_KINDS = new Set(["raw", "stat", "quote", "chips"]);
const OPENER = 4; // s de avatar full al inicio de cada sección
const OPENER_SPANS = ACTS.filter((t) => t > 0).map((t) => ({ s: t, e: t + OPENER }));

function modeAt(t: number): AvatarWindow["mode"] {
  if (t < FIRST_IMG) return "full"; // apertura obligatoria
  const c = CUES.find((c) => t >= c.start && t < c.start + c.dur);
  // un gráfico full-bleed (diagrama/barras/proceso/headline/etc.) oculta el avatar
  if (c && !PIP_KINDS.has(c.kind)) return "hidden";
  for (const a of OPENER_SPANS) if (t >= a.s && t < a.e) return "full"; // apertura → full
  if (!c) return "full"; // hueco hablado → full
  return "cornerTR"; // raw/stat/quote/chips → PiP sobre el b-roll
}
function buildAvatarWindows(): AvatarWindow[] {
  const marks = new Set<number>([0, FIRST_IMG, SECONDS]);
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

// cama ambiental MUY baja bajo toda la narración (cohesión/inmersión, regla de
// niveles: ~0.025 — subliminal, la narración siempre manda). + golpes graves en
// las revelaciones de plata para que esos beats "respiren".
const BED = "sfx/amb_campo.mp3";
const BOOM_AT = [143.0, 303.0, 470.0, 693.0]; // bars Roberto · Florida/Texas · Marta · payoff

export const MainImpuestos: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {/* cama ambiental loopable, casi inaudible */}
      <Sequence from={0} durationInFrames={TOTAL_FRAMES_IMP} layout="none">
        <Audio src={staticFile(BED)} volume={0.025} loop />
      </Sequence>
      <CinematicWrap handheld={0.8} grain={0.06}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="amber" drift={0.5} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {/* AVATAR encima del b-roll (provee el audio de la narración siempre) */}
          <AvatarLayer src="impuestos_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          <SectionGrade ranges={GRADE} />
          {/* whip + light-leak en cada cambio de sección */}
          {ACTS.filter((t) => t > 0).map((t) => (
            <Sequence key={"stg" + t} from={sec(t) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
              <SectionStinger />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
      {/* cambio de sección: swell + golpe grave (niveles contenidos) */}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.2} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.22} durationInFrames={sec(1.6)} />
      ))}
      {/* golpes graves en revelaciones de plata (nivel contenido ≤0.4) */}
      {BOOM_AT.map((t, i) => (
        <SfxCue key={"bm" + i} at={sec(t)} src={SFX.boom1} volume={0.36} durationInFrames={sec(2)} />
      ))}
    </AbsoluteFill>
  );
};
