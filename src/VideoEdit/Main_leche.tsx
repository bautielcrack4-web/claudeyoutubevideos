import { AbsoluteFill, Sequence, Audio, staticFile, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_leche.gen";
import { AVATAR_WINDOWS, TOTAL_LECHE } from "./avatar_leche.gen";

export const TOTAL_FRAMES_LECHE = Math.round(TOTAL_LECHE * 30);

// SFX sincronizado [segundo, archivo, volumen] — acentos atados a cada evento visual del hook.
const SFX: [number, string, number][] = [
  [4.95, "sfx_thump.mp3", 0.26],            // entra "la leche no es leche"
  [6.17, "sfx_chime.mp3", 0.26],            // keyphrase Thin/Grey/Watery
  [8.5, "sfx_whoosh_soft.mp3", 0.28],       // jug pour
  [10.7, "sfx_text_thud.mp3", 0.34],        // spoiled milk
  [14.32, "sfx_chime.mp3", 0.26],           // "wasn't supposed to be this way"
  [22.67, "sfx_thump.mp3", 0.22],           // jarra dorada (golden cream top)
  [35.84, "node_pop.mp3", 0.32], [37.68, "node_pop.mp3", 0.32], [38.39, "node_pop.mp3", 0.32], [39.6, "winner_chime.mp3", 0.26], // milk+cream+butter = fresh
  [41.97, "sfx_chime.mp3", 0.26],           // July/August keyphrase
  [47.6, "sfx_chime.mp3", 0.26],            // No fridge no bill
  [75.72, "stinger_hit.mp3", 0.3],          // "impossible"
  [103.21, "sfx_chime.mp3", 0.26],          // "they had to"
  [111.77, "winner_chime.mp3", 0.24],       // Precise. Clever.
  [126.4, "section_swell.mp3", 0.3],        // pivote "let me show you"
  [130.68, "node_land.mp3", 0.28],          // lowerthird abuelo
  [142.16, "stinger_hit.mp3", 0.32],        // redacted: one mistake
  [152.58, "sfx_whoosh_soft.mp3", 0.28],    // springhouse open loop
  [165.4, "stinger_hit.mp3", 0.3],          // redacted: tall tale
  [175.77, "text_slam.mp3", 0.4],           // SpoonInCream climax
];

export const MainLeche: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0} grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="cold" drift={0.4} />
          {CUES.filter((c) => c.kind !== "float").map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="leche_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {CUES.filter((c) => c.kind === "float").map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
      {/* música de fondo "Elmwood Ledger" — volumen MUY bajo, fade in/out */}
      <Audio
        src={staticFile("leche_music.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [0, 40, TOTAL_FRAMES_LECHE - 75, TOTAL_FRAMES_LECHE],
            [0, 0.06, 0.06, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {SFX.map(([at, file, vol], i) => (
        <Sequence key={`sfx${i}`} from={Math.round(at * 30)} durationInFrames={120}>
          <Audio src={staticFile(`sfx/${file}`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
