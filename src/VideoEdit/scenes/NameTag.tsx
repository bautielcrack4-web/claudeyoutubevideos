import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";

// NameTag — OVERLAY lower-third estilo documental de naturaleza: nombre + subtítulo
// (ej. especie + nombre científico) abajo-izquierda, con una barra de acento que se dibuja.
export const NameTag: React.FC<{
  durationInFrames: number;
  name: string;
  sub?: string;
  accent?: "amber" | "danger" | "accent" | "cold";
}> = ({ durationInFrames, name, sub, accent = "amber" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = COLORS[accent] || COLORS.amber;
  const inS = spring({ frame, fps, config: { damping: 20, stiffness: 130 } });
  const outS = interpolate(frame, [durationInFrames - sec(0.5), durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(inS, 1 - outS);
  const bar = interpolate(inS, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 80, bottom: 110, opacity: op, fontFamily: FONT_STACK, transform: `translateX(${(1 - inS) * -30}px)` }}>
        <div style={{ display: "flex", alignItems: "stretch", gap: 18 }}>
          <div style={{ width: 6, background: col, borderRadius: 3, transform: `scaleY(${bar})`, transformOrigin: "top", boxShadow: `0 0 12px ${col}` }} />
          <div>
            <div style={{ fontSize: 52, fontWeight: 800, color: COLORS.bg0, lineHeight: 1.02, textShadow: "0 3px 16px rgba(0,0,0,0.85)" }}>{name}</div>
            {sub && <div style={{ fontSize: 26, fontStyle: "italic", color: col, opacity: 0.95, marginTop: 4, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>{sub}</div>}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
