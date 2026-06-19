import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_rampump.gen";
import { AVATAR_WINDOWS, TOTAL_RAMPUMP } from "./avatar_rampump.gen";

// ── "This 200-Year-Old Amish Pump Moves Water Uphill With No Power" ──
// Claudio · canal off-grid · clips-first + componentes a medida (RamPumpCycle) +
// ★ PASADA 3 de OVERLAYS densos ENCIMA del footage (data tags, partes, frases).
// Orden de capas: fondo → clips/componentes (CUES) → avatar PiP → OVERLAYS arriba de todo.
export const TOTAL_FRAMES_RAMPUMP = Math.round(TOTAL_RAMPUMP * 30);

export const MainRampump: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="cold" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="rampump_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {/* ★ OVERLAYS — capa de tags/datos/frases ENCIMA de los clips y el avatar */}
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
