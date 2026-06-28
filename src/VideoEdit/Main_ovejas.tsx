import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_ovejas.gen";
import { AVATAR_WINDOWS, TOTAL_OVEJAS } from "./avatar_ovejas.gen";

// ── "Invertí $2.500 en Ovejas y Hoy Vale $225.000" (Cosecha Prohibida · ES) ──
// B-roll mixto: imágenes IA casuales (foto de celu real) + clips reales, con el avatar
// amish abriendo/cerrando y en el teaser de la guía. Componentes over-footage en los picos.
export const TOTAL_FRAMES_OVEJAS = Math.round(TOTAL_OVEJAS * 30);

export const MainOvejas: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0} grain={0} vignette={0.18}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="ovejas_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
