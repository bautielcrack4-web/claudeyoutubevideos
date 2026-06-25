import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_gotera.gen";
import { AVATAR_WINDOWS, TOTAL_GOTERA } from "./avatar_gotera.gen";

// ── "Tapá La Gotera Para Siempre — El Truco Del Albañil" — Constructor Libre · Tomás ──
// CLIPS-FIRST HÍBRIDO: clips reales de YouTube + cientos de imágenes web + diagramas (IA).
// Avatar en distintas posiciones (full + PiP rotando). SIN filtros de color. Cada beat
// anclado al ms exacto del Whisper. OVERLAYS a medida encima del clip vivo.
export const TOTAL_FRAMES_GOTERA = Math.round(TOTAL_GOTERA * 30);

export const MainGotera: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="blue" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="gotera_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
