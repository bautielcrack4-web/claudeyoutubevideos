import { AbsoluteFill } from "remotion";
import { MONO, acc, interpolate, useCurrentFrame, useVideoConfig } from "./ui";

// SonarHUD — lectura tipo expedición submarina (profundidad + coords) con un sweep de
// sonar girando. Esquina sup. derecha. Vende "footage de expedición real". Muy sutil.
export const SonarHUD: React.FC<{
  durationInFrames: number;
  depth: string;
  coords?: string;
  accent?: string;
}> = ({ durationInFrames, depth, coords, accent }) => {
  const a = acc(accent || "ice");
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = interpolate(f, [0, Math.round(fps * 0.5), durationInFrames - Math.round(fps * 0.5), durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * 0.85;
  const sweep = (f * 3) % 360;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 76, right: 86, display: "flex", alignItems: "center", gap: 14, opacity: op }}>
        <div style={{ position: "relative", width: 48, height: 48 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${a}55` }} />
          <div style={{ position: "absolute", inset: 17, borderRadius: "50%", border: `1px solid ${a}40` }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(from ${sweep}deg, ${a}00 0deg, ${a}66 38deg, ${a}00 64deg)` }} />
          <div style={{ position: "absolute", left: "50%", top: 0, width: 1, height: "50%", background: `${a}99`, transformOrigin: "bottom", transform: `rotate(${sweep}deg)` }} />
        </div>
        <div style={{ fontFamily: MONO, lineHeight: 1.45, textAlign: "right" }}>
          <div style={{ color: a, fontSize: 11, fontWeight: 700, letterSpacing: 2.5 }}>SONAR</div>
          <div style={{ color: "#fff", fontSize: 15, fontWeight: 600, textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}>{depth}</div>
          {coords && <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 12 }}>{coords}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};
