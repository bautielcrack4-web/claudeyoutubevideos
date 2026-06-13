import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES } from "./cues_cocina.gen";

// ── ASÍ SE COCINABA ANTES DE LOS SUPERMERCADOS — FACELESS (~16 min) ──
// Video 4 (cierra la cadena). Voz anciana (public/cocina.wav) + 90% stock real + componentes.
const SECONDS = 973;
export const TOTAL_FRAMES_COC = Math.round(SECONDS * 30); // 29190

const ACTS = [0, 65.51, 126.46, 186.11, 252, 308.44, 367.97, 431.76, 492.01, 557.82, 627.72, 730.13, 837.95];
const TINTS = ["#A9794A", "#6F8478", "#6E8B47", "#C8904A"];
const EMOTIONAL = new Set([11, 12]); // extras + cierre
const GRADE: GradeRange[] = ACTS.map((from, i) => ({ from, to: ACTS[i + 1] ?? SECONDS, tint: EMOTIONAL.has(i) ? "#6F8478" : TINTS[i % TINTS.length], strength: EMOTIONAL.has(i) ? 0.08 : 0.06 }));

export const MainCocina: React.FC = () => {
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
      <Audio src={staticFile("cocina.wav")} />
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.18} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.2} durationInFrames={sec(1.6)} />
      ))}
    </AbsoluteFill>
  );
};
