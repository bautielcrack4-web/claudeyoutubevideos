import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_gallinas.gen";
import { AVATAR_WINDOWS, TOTAL_GALLINAS } from "./avatar_gallinas.gen";

// ── "Cuánto Dinero Te Dan 50 Gallinas Ponedoras" (Cosecha Prohibida · ES) ──
// Identidad Amish-avatar: calmo, terroso, que respira. El viejo abre/cierra y da las
// conclusiones a pantalla completa; el cuerpo es b-roll LITERAL real full-bleed
// (RawShot) anclado al ms del caption. Componentes escasos: stat (cifras de plata),
// quote (la frase del abuelo), annotated (los 3 errores), checklist (resumen).
// Look NATURAL: sin grade retro, sin grano, sin temblor handheld.
export const TOTAL_FRAMES_GALLINAS = Math.round(TOTAL_GALLINAS * 30);

export const MainGallinas: React.FC = () => {
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
          {/* AVATAR encima del b-roll: SIEMPRE provee el audio de la narración. */}
          <AvatarLayer src="gallinas_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
