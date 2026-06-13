import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES } from "./cues_jabon.gen";

// ── NUNCA MÁS COMPRES JABÓN (ceniza + grasa) — documental FACELESS (~18 min) ──
// Voz clonada de Tomás (public/jabon.wav, pista continua) + flujo denso de clips/
// fotos REALES (Pexels + YouTube matchclip) + diagramas gpt-image-2 + componentes
// estructurados. SIN avatar. SIN camas ambientales: narración + SFX puntuales en
// cambios de sección. Cues generados desde beatsheet/jabon.json.
const SECONDS = 1072;
export const TOTAL_FRAMES_JABON = Math.round(SECONDS * 30); // 32160

// inicio de cada sección (de los captions, audio con silencios recortados) —
// para grade + stingers de sección
const ACTS = [
  0, 70.12, 133.62, 189.11, 264.9, 324.83, 419, 455, 545, 643.1, 716, 780.34,
  855, 907.53, 958, 1013.75,
];

// color-grade por sección: wash terroso que rota (sepia · eucalipto · verde · ámbar),
// con el cierre/injertos en eucalipto frío reflexivo.
const TINTS = ["#A9794A", "#6F8478", "#6E8B47", "#C8904A"];
const EMOTIONAL = new Set([10, 12, 15]); // injerto2, panorama, cierre
const GRADE: GradeRange[] = ACTS.map((from, i) => ({
  from,
  to: ACTS[i + 1] ?? SECONDS,
  tint: EMOTIONAL.has(i) ? "#6F8478" : TINTS[i % TINTS.length],
  strength: EMOTIONAL.has(i) ? 0.08 : 0.06,
}));

export const MainJabon: React.FC = () => {
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
          <SectionGrade ranges={GRADE} />
          {ACTS.filter((t) => t > 0).map((t) => (
            <Sequence key={"stg" + t} from={sec(t) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
              <SectionStinger />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>

      {/* NARRACIÓN: voz clonada de Tomás, pista continua desde 0 */}
      <Audio src={staticFile("jabon.wav")} />

      {/* SFX puntuales SOLO en cambios de sección (sin cama ambiental) */}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.18} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.2} durationInFrames={sec(1.6)} />
      ))}
    </AbsoluteFill>
  );
};
