import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_barcos.gen";

// cross-dissolve sutil entre tomas (estética documental, no corte duro seco)
const DIS = 10; // ~0.33s
const FadeIn: React.FC<{ children: React.ReactNode; on: boolean }> = ({ children, on }) => {
  const f = useCurrentFrame();
  const op = on ? interpolate(f, [0, DIS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// ── 7 BARCOS QUE LA CIENCIA NO PUEDE EXPLICAR — Crónicas Perdidas · FACELESS ──
// SLICE 1 (cold-open + #7 Uluburún, ~7 min) para sign-off de estilo. Voz clonada
// (public/barcos.wav) como pista continua desde 0; cada beat anclado al ms real.
// SIN filtros de color (grano 0, viñeta 0). El video completo dura 34:06.
const SECONDS = 2048; // video completo (7 barcos + cierre); narración ~34:06
export const TOTAL_FRAMES_BAR = Math.round(SECONDS * 30);

export const MainBarcos: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0.8} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="cold" drift={0.5} />
          {CUES.map((cue, i) => {
            // cada toma entra cruzando-disolviendo sobre la anterior (se solapan DIS frames)
            const from = i === 0 ? sec(cue.start) : sec(cue.start) - DIS;
            const dur = i === 0 ? sec(cue.dur) : sec(cue.dur) + DIS;
            return (
              <Sequence key={cue.key} from={from} durationInFrames={dur}>
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

      {/* NARRACIÓN: voz clonada, pista continua desde 0 */}
      <Audio src={staticFile("barcos.wav")} />

      {/* MÚSICA: "Abyssal Archive" (Suno) en loop, MUY baja bajo la narración */}
      <Audio src={staticFile("barcos_music.mp3")} loop volume={0.08} />
    </AbsoluteFill>
  );
};
