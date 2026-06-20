import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_replantar.gen";
import { AVATAR_WINDOWS, TOTAL_REPLANTAR } from "./avatar_replantar.gen";

// ── LeviLappJardín (ES) · "15 verduras del súper que puedes replantar gratis" ──
// Clips-first híbrido, modo AVATAR. Hook hiperdinámico (~1.5s) + cuerpo Amish calmo.
// Sin filtros (handheld ya forzado a 0 en CinematicWrap). Marca terrosa serif ámbar.
export const TOTAL_FRAMES_REPLANTAR = Math.round(TOTAL_REPLANTAR * 30);

export const MainReplantar: React.FC = () => {
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
          <AvatarLayer src="replantar_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {/* OVERLAYS (frases cinéticas sincronizadas a la transcript) — encima de todo */}
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
