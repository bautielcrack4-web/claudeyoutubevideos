import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";

// StatTag — OVERLAY de cifra/fecha en una esquina, ENCIMA del clip que sigue corriendo.
// Número que cuenta (value) o texto fijo (text, ej "1979"). Estilo documental, brand-native.
export const StatTag: React.FC<{
  durationInFrames: number;
  value?: number;          // cuenta de 0 → value
  text?: string;           // o un texto fijo (fecha)
  prefix?: string;
  suffix?: string;
  label?: string;          // "toda la especie"
  eyebrow?: string;        // "quedaban"
  corner?: "tr" | "br" | "bl" | "tl";
  accent?: "amber" | "danger" | "accent" | "cold";
}> = ({ durationInFrames, value, text, prefix = "", suffix = "", label, eyebrow, corner = "tr", accent = "amber" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = COLORS[accent] || COLORS.amber;

  const inS = spring({ frame, fps, config: { damping: 18, stiffness: 130 } });
  const outS = interpolate(frame, [durationInFrames - sec(0.5), durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(inS, 1 - outS);
  const dy = interpolate(inS, [0, 1], [24, 0]);

  // conteo del número
  const prog = interpolate(frame, [sec(0.2), Math.min(durationInFrames - sec(0.6), sec(1.6))], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shown = value != null ? `${prefix}${Math.round(value * prog)}${suffix}` : (text ?? "");

  const pos: React.CSSProperties =
    corner === "tr" ? { top: 80, right: 80, textAlign: "right", alignItems: "flex-end" } :
    corner === "br" ? { bottom: 96, right: 80, textAlign: "right", alignItems: "flex-end" } :
    corner === "bl" ? { bottom: 96, left: 80, textAlign: "left", alignItems: "flex-start" } :
    { top: 80, left: 80, textAlign: "left", alignItems: "flex-start" };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", transform: `translateY(${dy}px)`, opacity: op, fontFamily: FONT_STACK, ...pos }}>
        {eyebrow && <div style={{ fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: COLORS.bg0, opacity: 0.82, textShadow: "0 2px 10px rgba(0,0,0,0.8)", marginBottom: 2 }}>{eyebrow}</div>}
        <div style={{ fontSize: 150, fontWeight: 800, color: col, lineHeight: 0.95, textShadow: "0 6px 26px rgba(0,0,0,0.85)", letterSpacing: -2 }}>{shown}</div>
        {label && <div style={{ fontSize: 30, color: COLORS.bg0, opacity: 0.92, maxWidth: 560, textShadow: "0 2px 12px rgba(0,0,0,0.85)", marginTop: 4 }}>{label}</div>}
        <div style={{ height: 4, width: 96, background: col, marginTop: 12, borderRadius: 2, transform: `scaleX(${inS})`, transformOrigin: corner.includes("r") ? "right" : "left", boxShadow: `0 0 14px ${col}` }} />
      </div>
    </AbsoluteFill>
  );
};
