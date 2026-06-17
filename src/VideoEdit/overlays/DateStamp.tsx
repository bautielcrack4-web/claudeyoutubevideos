import { AbsoluteFill } from "remotion";
import { MONO, acc, useTagReveal, panel } from "./ui";

// DateStamp — sello de fecha/época en monoespaciada (look investigativo). Esquina.
export const DateStamp: React.FC<{
  durationInFrames: number;
  value: string;
  label?: string;
  accent?: string;
  corner?: "tr" | "tl";
}> = ({ durationInFrames, value, label = "AÑO", accent, corner = "tr" }) => {
  const a = acc(accent);
  const { op, y } = useTagReveal(durationInFrames, -10);
  const side = corner === "tl" ? { left: 84, textAlign: "left" as const } : { right: 84, textAlign: "right" as const };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 74, ...side, opacity: op, transform: `translateY(${y}px)`, ...panel(a), borderLeft: corner === "tl" ? `3px solid ${a}` : "1px solid rgba(255,255,255,0.10)", borderRight: corner === "tr" ? `3px solid ${a}` : "1px solid rgba(255,255,255,0.10)", padding: "8px 15px" }}>
        <div style={{ fontFamily: MONO, color: a, fontSize: 11, fontWeight: 700, letterSpacing: 3 }}>{label}</div>
        <div style={{ fontFamily: MONO, color: "#fff", fontSize: 25, fontWeight: 700, letterSpacing: 1, marginTop: 3, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{value}</div>
      </div>
    </AbsoluteFill>
  );
};
