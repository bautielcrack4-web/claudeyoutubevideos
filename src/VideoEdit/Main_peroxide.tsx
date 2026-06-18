import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_peroxide.gen";
import { AVATAR_WINDOWS, TOTAL_PEROXIDE } from "./avatar_peroxide.gen";

// ── "X Things Hydrogen Peroxide Does in Your Garden — The Old Amish Way" ──
// Claudio Yoder #2 · CLIPS-FIRST: ~168 clips reales de YouTube matcheados (CLIP) a la
// narración, avatar en distintas posiciones (full + PiP rotando). SIN filtros de color
// (regla dura: footage natural). Los COMPONENTES gráficos se suman en una 2ª pasada.
export const TOTAL_FRAMES_PEROXIDE = Math.round(TOTAL_PEROXIDE * 30);

export const MainPeroxide: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {/* SIN filtro: grain 0, vignette 0 (colores 100% naturales) */}
      <CinematicWrap handheld={0.5} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {/* AVATAR encima del b-roll: SIEMPRE provee el audio de la narración. */}
          <AvatarLayer src="peroxide_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
