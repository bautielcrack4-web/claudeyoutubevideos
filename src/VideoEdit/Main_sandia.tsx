import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_sandia.gen";
import { AVATAR_WINDOWS, TOTAL_SANDIA } from "./avatar_sandia.gen";

// ── "Cómo elegir la sandía más dulce — el método de los viejos" ──
// EL CONSTRUCTOR LIBRE (ES) · clips-first híbrido + 3 inyertos del manual $27.
// Sin filtros (handheld ya forzado a 0 en CinematicWrap).
export const TOTAL_FRAMES_SANDIA = Math.round(TOTAL_SANDIA * 30);

export const MainSandia: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="sandia_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
