import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_moho.gen";
import { AVATAR_WINDOWS, TOTAL_MOHO } from "./avatar_moho.gen";

// ── "El Moho De Las Paredes NUNCA Vuelve Con Este Líquido De $1" ──
// Constructor Libre · Tomás · CLIPS-FIRST HÍBRIDO: ~50 clips reales de YouTube + ~140
// imágenes reales de la web (sin IA salvo 6 diagramas), avatar en distintas posiciones
// (full + PiP rotando). SIN filtros de color (footage natural). Cada beat anclado al ms.
export const TOTAL_FRAMES_MOHO = Math.round(TOTAL_MOHO * 30);

export const MainMoho: React.FC = () => {
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
          {/* AVATAR encima del b-roll: SIEMPRE provee el audio de la narración. */}
          <AvatarLayer src="moho_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
