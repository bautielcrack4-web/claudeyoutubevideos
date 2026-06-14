import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_melon.gen";
import { AVATAR_WINDOWS, TOTAL_MELON } from "./avatar_melon.gen";

// ── "How to Pick the Sweetest Watermelon — The Old Amish Way" (Claudio Yoder, EN) ──
// PRIMER video del canal. Identidad Amish: calmo, terroso, que respira. PASADA 1 =
// flujo denso de fotos reales literales full-bleed (RawShot, SIN texto en pantalla);
// el avatar (melon_opt.mp4) abre a pantalla completa y vuelve en beats personales.
// La PASADA 2 sumará muchísimos clips de YouTube sobre esta base.
export const TOTAL_FRAMES_MELON = Math.round(TOTAL_MELON * 30);

export const MainMelon: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {/* Look NATURAL (sin grade retro): sin SectionGrade, sin grano, viñeta mínima. */}
      <CinematicWrap handheld={0.35} grain={0} vignette={0.18}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {/* AVATAR encima del b-roll: SIEMPRE provee el audio de la narración. */}
          <AvatarLayer src="melon_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
