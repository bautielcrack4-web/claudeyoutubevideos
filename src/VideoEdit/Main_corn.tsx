import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_corn.gen";
import { AVATAR_WINDOWS, TOTAL_CORN } from "./avatar_corn.gen";

// ── Levi Lapp Jardín (EN) · "How to Pick the Sweetest Corn... The Old Amish Way" ──
// Clips-first híbrido, modo AVATAR. Hook hiperdinámico (~1s) + cuerpo dinámico (~3.2s).
// Sin filtros (handheld forzado a 0). Marca terrosa serif ámbar.
export const TOTAL_FRAMES_CORN = Math.round(TOTAL_CORN * 30);

export const MainCorn: React.FC = () => {
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
          <AvatarLayer src="corn_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {/* OVERLAYS (frases cinéticas + blur reveals sincronizados) — encima de todo */}
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
