import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";

// MeterTag — OVERLAY de barra que se VACÍA en vivo sobre el footage (no lo tapa).
// Muestra un antes→después dramático (ej. perritos de las praderas: 100% → 5%).
export const MeterTag: React.FC<{
  durationInFrames: number;
  label: string;
  fromPct?: number;        // 100
  toPct?: number;          // 5
  eyebrow?: string;
  corner?: "tr" | "br" | "tl" | "bl";
}> = ({ durationInFrames, label, fromPct = 100, toPct = 5, eyebrow, corner = "tr" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inS = spring({ frame, fps, config: { damping: 18, stiffness: 130 } });
  const outS = interpolate(frame, [durationInFrames - sec(0.5), durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(inS, 1 - outS);
  // el drenaje
  const drain = interpolate(frame, [sec(0.5), durationInFrames - sec(0.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pct = fromPct + (toPct - fromPct) * drain;
  const lost = Math.round(fromPct - pct);
  const W = 520;
  const col = drain > 0.5 ? COLORS.danger : COLORS.good || COLORS.accent;

  const pos: React.CSSProperties =
    corner === "tr" ? { top: 86, right: 80 } : corner === "br" ? { bottom: 110, right: 80 } :
    corner === "bl" ? { bottom: 110, left: 80 } : { top: 86, left: 80 };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", width: W, opacity: op, fontFamily: FONT_STACK, transform: `translateY(${(1 - inS) * 18}px)`, ...pos }}>
        {eyebrow && <div style={{ fontSize: 20, letterSpacing: 2, textTransform: "uppercase", color: COLORS.bg0, opacity: 0.85, textShadow: "0 2px 10px rgba(0,0,0,0.85)", marginBottom: 6 }}>{eyebrow}</div>}
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 88, fontWeight: 800, color: COLORS.danger, lineHeight: 0.9, textShadow: "0 4px 18px rgba(0,0,0,0.85)" }}>-{lost}%</span>
          <span style={{ fontSize: 26, color: COLORS.bg0, opacity: 0.92, textShadow: "0 2px 10px rgba(0,0,0,0.85)" }}>{label}</span>
        </div>
        {/* barra que se vacía */}
        <div style={{ width: "100%", height: 22, borderRadius: 11, background: "rgba(0,0,0,0.55)", border: `1px solid ${COLORS.bg0}33`, overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,0.4)" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${col}, ${col}cc)`, borderRadius: 11, transition: "none" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 17, color: COLORS.bg0, opacity: 0.7, textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}>
          <span>Antes: {fromPct}%</span><span>Hoy: {Math.round(pct)}%</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
