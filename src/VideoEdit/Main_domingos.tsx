import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES } from "./cues_domingos.gen";

// ── 15 COSTUMBRES DE LOS DOMINGOS QUE YA NADIE RESPETA — FACELESS (~21 min) ──
// Video 3 de la cadena. Voz anciana (public/domingos.wav) + 90% stock real + componentes.
const SECONDS = 1249;
export const TOTAL_FRAMES_DOM = Math.round(SECONDS * 30); // 37470

const ACTS = [0, 68.08, 128.72, 188.98, 249.9, 308.57, 365.28, 419.96, 480.3, 536.8, 594.15, 653.3, 714.76, 774.97, 826.84, 882.32, 947.1, 1149.73];
const TINTS = ["#A9794A", "#6F8478", "#6E8B47", "#C8904A"];
const EMOTIONAL = new Set([16, 17]); // extras + cierre
const GRADE: GradeRange[] = ACTS.map((from, i) => ({ from, to: ACTS[i + 1] ?? SECONDS, tint: EMOTIONAL.has(i) ? "#6F8478" : TINTS[i % TINTS.length], strength: EMOTIONAL.has(i) ? 0.08 : 0.06 }));

export const MainDomingos: React.FC = () => {
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
      <Audio src={staticFile("domingos.wav")} />
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.18} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.2} durationInFrames={sec(1.6)} />
      ))}
    </AbsoluteFill>
  );
};
