import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_ciudades.gen";

// ── 7 CIUDADES SUMERGIDAS QUE LA CIENCIA NO PUEDE EXPLICAR — Crónicas Perdidas · FACELESS ──
// FLAGSHIP (nivel barcos/construcciones): ~275 clips densos (corte ~3.6s) + KIT de componentes
// (rule/stat/timeline/scalecolossus + overlays doclabel/datestamp/countrail), todo anclado al
// ms real de la narración Trevor (ciudades_timing.json). SIN filtros de color (grano 0, viñeta 0).
const DIS = 10; // cross-dissolve ~0.33s entre tomas (documental, no corte seco)
const FadeIn: React.FC<{ children: React.ReactNode; on: boolean }> = ({ children, on }) => {
  const f = useCurrentFrame();
  const op = on ? interpolate(f, [0, DIS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// duración total = fin del último beat (cues + overlays), con colchón
const endOf = (a: { start: number; dur: number }[]) => a.reduce((m, c) => Math.max(m, c.start + c.dur), 0);
const SECONDS = Math.max(endOf(CUES), endOf(OVERLAYS)) + 0.8;
export const TOTAL_FRAMES_CIUD = Math.round(SECONDS * 30);

export const MainCiudades: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0.8} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="blue" drift={0.5} />
          {CUES.map((cue, i) => {
            // cada toma entra cruzando-disolviendo sobre la anterior (se solapan DIS frames)
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

      {/* NARRACIÓN: voz clonada Trevor, pista continua desde 0 */}
      <Audio src={staticFile("ciudades.wav")} />

      {/* MÚSICA: score tenso de misterio en loop, MUY baja bajo la narración */}
      <Audio src={staticFile("ciudades_music.mp3")} loop volume={0.07} />
    </AbsoluteFill>
  );
};
