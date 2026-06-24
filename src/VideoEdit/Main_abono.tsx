import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_abono.gen";
import { AVATAR_WINDOWS, TOTAL_ABONO } from "./avatar_abono.gen";

// ── Levi Lapp Jardín (ES) · "7 Basuras de Cocina Que Son Abono GRATIS (Deja de Tirarlas)" ──
// Clips-first híbrido, modo AVATAR. Hook dinámico + cuerpo ~3s, pausa que respira.
// Sin filtros (handheld forzado a 0). Marca terrosa serif ámbar.
export const TOTAL_FRAMES_ABONO = Math.round(TOTAL_ABONO * 30);

export const MainAbono: React.FC = () => {
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
          <AvatarLayer src="abono_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
