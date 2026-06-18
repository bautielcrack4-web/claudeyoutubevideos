import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_acpipe.gen";
import { AVATAR_WINDOWS, TOTAL_ACPIPE } from "./avatar_acpipe.gen";

// ── "Stop Running Your AC. Build This $40 Amish Pipe in One Weekend" ──
// Claudio · CANAL NUEVO (Amish off-grid cooling / earth tube) · CLIPS-FIRST:
// ~cientos de clips reales de YouTube matcheados a la narración, avatar en distintas
// posiciones (full + PiP rotando). SIN filtros de color (footage natural). Datos/números
// = COMPONENTES gráficos sobre foto real.
export const TOTAL_FRAMES_ACPIPE = Math.round(TOTAL_ACPIPE * 30);

export const MainAcpipe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {/* handheld=0: SIN temblor (el usuario lo notó en el avatar) */}
      <CinematicWrap handheld={0} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="acpipe_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
