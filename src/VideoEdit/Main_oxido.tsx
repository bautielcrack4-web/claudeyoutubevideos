import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_oxido.gen";
import { AVATAR_WINDOWS, TOTAL_OXIDO } from "./avatar_oxido.gen";

// ── "El Hierro Que NUNCA Se Oxida" — Constructor Libre · Tomás ──
// CLIPS-FIRST HÍBRIDO: ~80 clips reales de YouTube + ~142 imágenes reales de la web
// + 9 diagramas (IA). Avatar en distintas posiciones (full + PiP rotando). SIN filtros
// de color (footage natural). Cada beat anclado al ms exacto del Whisper.
export const TOTAL_FRAMES_OXIDO = Math.round(TOTAL_OXIDO * 30);

export const MainOxido: React.FC = () => {
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
          <AvatarLayer src="oxido_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {/* OVERLAYS a medida (OxCards) — encima de TODO, sobre el clip vivo borroso. */}
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
