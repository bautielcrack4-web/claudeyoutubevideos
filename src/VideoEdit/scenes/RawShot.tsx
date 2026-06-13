import { COLORS, FONT_STACK, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

// RAW full-bleed real photo / clip. Topic-agnostic b-roll: shows the actual thing
// the narration is talking about, CLEAN — no darkening text card over it. Accepts
// either an image ("img/x.png") or a generated clip ("vid/x.mp4"); the backdrop is
// video-aware (Media) so clips animate in slow-mo. Optional tiny corner kicker only
// if you really want a label — default is fully raw. Gentle Ken-Burns keeps it alive.
export const RawShot: React.FC<{
  durationInFrames: number;
  src: string; // "img/name.png" or "vid/name.mp4"
  hue?: "blue" | "cold" | "amber" | "red";
  darken?: number; // keep low: this is RAW. default 0.08
  blur?: number;
  zoom?: [number, number];
  kicker?: string; // optional small top-left tag; omit for fully raw
  accent?: string;
}> = ({
  durationInFrames,
  src,
  hue = "amber",
  darken = 0.08,
  blur = 0,
  zoom,
  kicker,
  accent = COLORS.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kIn = spring({ frame: frame - sec(0.2), fps, config: { damping: 18, mass: 0.7 } });
  // ★ VARIEDAD de cámara: cada foto/clip recibe un Ken-Burns distinto (dirección
  // in/out, magnitud y ORIGEN del zoom) según un hash del src → no se siente
  // repetitivo. Si el caller pasa `zoom` explícito, se respeta.
  let seed = 0;
  for (let i = 0; i < src.length; i++) seed = (seed * 31 + src.charCodeAt(i)) >>> 0;
  // Ken-Burns SUAVE (feedback usuario: los zooms eran muy fuertes y rápidos).
  // Magnitud máx ~+7% (antes +20%) → movimiento lento y sutil, no un punch.
  const MOTIONS: [number, number][] = [
    [1.015, 1.055], // in muy suave
    [1.055, 1.015], // out muy suave
    [1.02, 1.065], // in suave
    [1.065, 1.02], // out suave
    [1.01, 1.045], // in mínimo
    [1.05, 1.012], // out leve
    [1.03, 1.07], // in medio
    [1.04, 1.008], // out medio
  ];
  const ORIGINS = ["50% 50%", "32% 30%", "70% 38%", "38% 70%", "66% 62%", "30% 55%", "60% 30%", "50% 72%"];
  const motion = zoom ?? MOTIONS[seed % MOTIONS.length];
  const camOrigin = ORIGINS[(seed >> 3) % ORIGINS.length];
  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue={hue}
      bg="image"
      image={src}
      imageBlur={blur}
      imageDarken={darken}
      zoom={motion}
      camOrigin={camOrigin}
      noReveal
      contentStyle={{ alignItems: "flex-start", justifyContent: "flex-start" }}
    >
      {kicker && (
        <div
          style={{
            margin: "70px 0 0 80px",
            fontFamily: FONT_STACK,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: accent,
            opacity: kIn,
            transform: `translateY(${(1 - kIn) * 18}px)`,
            textShadow: "0 2px 18px rgba(0,0,0,0.7)",
          }}
        >
          {kicker}
        </div>
      )}
    </SceneFrame>
  );
};
