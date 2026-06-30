import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// StruckCards — tarjetas con bordes redondeados + imagen que ENTRAN una por una
// (spring) y se TACHAN una por una con una X roja que se dibuja + la tarjeta se
// apaga (desatura + dim). Anclado al ms: cada item trae `at` (seg desde el start
// del beat) = el momento exacto de su palabra ("no electricity… freezer… bill").
//   items: { image, label, at }[]
const RED = "#CC3B26"; // rojo vivo para el tachado (más punch que el terracota de marca)

export const StruckCards: React.FC<{
  durationInFrames: number;
  items: { image: string; label: string; at?: number }[];
}> = ({ items, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // salida global (fade) en los últimos 8 frames
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const n = items.length;
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 90% at 50% 40%, rgba(20,18,15,0.18), rgba(20,18,15,0.42))",
        alignItems: "center",
        justifyContent: "center",
        opacity: outO,
      }}
    >
      <div style={{ display: "flex", gap: 54, alignItems: "center" }}>
        {items.map((it, i) => {
          const at = it.at != null ? it.at : (i * 0.9);
          const revF = Math.round(at * fps);
          const strikeF = revF + Math.round(0.5 * fps);

          // entrada spring (escala + subida)
          const ent = spring({
            frame: frame - revF,
            fps,
            config: { damping: 16, mass: 0.7, stiffness: 140 },
            durationInFrames: 16,
          });
          const y = interpolate(ent, [0, 1], [46, 0]);
          const sc = interpolate(ent, [0, 1], [0.86, 1]);
          const op = interpolate(frame - revF, [0, 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // tachado: la X se dibuja en ~10 frames; la tarjeta se apaga
          const strike = interpolate(frame - strikeF, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const dim = interpolate(strike, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                width: 466,
                height: 556,
                transform: `translateY(${y}px) scale(${sc})`,
                opacity: op,
                borderRadius: 30,
                overflow: "hidden",
                position: "relative",
                boxShadow:
                  "0 30px 70px rgba(20,16,10,0.45), 0 4px 14px rgba(20,16,10,0.3)",
                border: `3px solid ${strike > 0.4 ? RED : "rgba(255,250,240,0.9)"}`,
                background: COLORS.bg2,
              }}
            >
              {/* imagen */}
              <Img
                src={staticFile(it.image)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: `saturate(${1 - dim * 0.85}) brightness(${1 - dim * 0.4})`,
                }}
              />
              {/* scrim inferior para el label */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(15,12,8,0.85) 0%, rgba(15,12,8,0.15) 42%, rgba(15,12,8,0) 70%)",
                }}
              />
              {/* tinte rojo al tachar */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: RED,
                  opacity: dim * 0.16,
                }}
              />
              {/* X roja dibujada (dos trazos) */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              >
                <line
                  x1="14" y1="16" x2="86" y2="84"
                  stroke={RED} strokeWidth={7} strokeLinecap="round"
                  pathLength={1} strokeDasharray={1}
                  strokeDashoffset={1 - Math.min(1, strike * 2)}
                />
                <line
                  x1="86" y1="16" x2="14" y2="84"
                  stroke={RED} strokeWidth={7} strokeLinecap="round"
                  pathLength={1} strokeDasharray={1}
                  strokeDashoffset={1 - Math.max(0, strike * 2 - 1)}
                />
              </svg>
              {/* label */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 34,
                  textAlign: "center",
                  fontFamily: FONT_STACK,
                  fontSize: 42,
                  fontWeight: 700,
                  color: "#FBF6EC",
                  textShadow: "0 2px 10px rgba(0,0,0,0.7)",
                  textDecoration: strike > 0.6 ? "line-through" : "none",
                  textDecorationColor: RED,
                  textDecorationThickness: 4,
                  letterSpacing: 0.3,
                  padding: "0 16px",
                }}
              >
                {it.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
