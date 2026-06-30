import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { FONT_STACK } from "../theme";

// ImpossibleStamp — "Sounds impossible": la palabra entra como SELLO de goma rojo
// (slam con overshoot) y luego se AGRIETA (vamos a romper el mito). Sobre el rostro
// escéptico. Teaser del open loop del hielo imposible.
const RED = "#CC3B26";

export const ImpossibleStamp: React.FC<{
  durationInFrames: number;
  image: string;
  word?: string;
}> = ({ durationInFrames, image, word = "IMPOSSIBLE" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / durationInFrames;

  const inO = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // sello: slam con overshoot
  const slam = spring({ frame, fps, config: { damping: 9, mass: 0.6, stiffness: 170 }, durationInFrames: 18 });
  const scale = interpolate(slam, [0, 1], [2.4, 1]);
  const stampO = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: "clamp" });

  // grieta a ~0.55
  const crack = interpolate(t, [0.52, 0.78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const orIsIt = interpolate(t, [0.74, 0.92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: inO * outO }}>
      <Img src={staticFile(image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(8,8,10,0.5), rgba(8,8,10,0.72))" }} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {/* sello */}
        <div
          style={{
            position: "relative",
            transform: `rotate(-7deg) scale(${scale})`,
            opacity: stampO,
            border: `8px solid ${RED}`,
            borderRadius: 14,
            padding: "10px 44px",
            boxShadow: `inset 0 0 0 4px ${RED}`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_STACK,
              fontSize: 130,
              fontWeight: 900,
              letterSpacing: 4,
              color: RED,
              textShadow: "0 3px 18px rgba(0,0,0,0.6)",
            }}
          >
            {word}
          </div>
          {/* grieta */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <polyline
              points="2,40 22,52 38,34 55,58 72,40 88,56 99,44"
              fill="none"
              stroke="#FBF1E0"
              strokeWidth={2.4}
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - crack}
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.7))" }}
            />
          </svg>
        </div>

        {/* "...or is it?" */}
        <div style={{ marginTop: 36, fontFamily: FONT_STACK, fontSize: 46, fontStyle: "italic", color: "#FBF1E0", opacity: orIsIt, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
          …or is it?
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
