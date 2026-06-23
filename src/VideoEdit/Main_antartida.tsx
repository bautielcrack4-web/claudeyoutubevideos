import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_antartida.gen";

// ── 7 ESTRUCTURAS BAJO EL HIELO DE LA ANTÁRTIDA — Crónicas Perdidas · FACELESS ──
// FLAGSHIP: clips densos (~corte 3.6s, NO_WATERMARK) + KIT de componentes, anclado al
// ms real de la narración Trevor (antartida_timing.json). SIN filtros de color.
const DIS = 10;
const FadeIn: React.FC<{ children: React.ReactNode; on: boolean }> = ({ children, on }) => {
  const f = useCurrentFrame();
  const op = on ? interpolate(f, [0, DIS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const endOf = (a: { start: number; dur: number }[]) => a.reduce((m, c) => Math.max(m, c.start + c.dur), 0);
const SECONDS = Math.max(endOf(CUES), endOf(OVERLAYS)) + 0.8;
export const TOTAL_FRAMES_ANT = Math.round(SECONDS * 30);

export const MainAntartida: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0.8} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="blue" drift={0.5} />
          {CUES.map((cue, i) => {
            const from = i === 0 ? sec(cue.start) : sec(cue.start) - DIS;
            const dur = i === 0 ? sec(cue.dur) : sec(cue.dur) + DIS;
            return (
              <Sequence key={cue.key} from={Math.max(0, from)} durationInFrames={dur}>
                <FadeIn on={i !== 0}>{cue.el(dur)}</FadeIn>
              </Sequence>
            );
          })}
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>

      {/* NARRACIÓN: voz clonada Trevor */}
      <Audio src={staticFile("antartida.wav")} />
      {/* MÚSICA: misterio en loop, muy baja */}
      <Audio src={staticFile("antartida_music.mp3")} loop volume={0.07} />
    </AbsoluteFill>
  );
};
