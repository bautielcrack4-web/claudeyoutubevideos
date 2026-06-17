import { AbsoluteFill } from "remotion";
import { SANS, acc, useTagReveal, interpolate } from "./ui";

// PlaceTag — sello de UBICACIÓN (lower-third de establecimiento) con pin y subrayado
// que se dibuja. Ancla geográficamente cada salto de lugar.
export const PlaceTag: React.FC<{
  durationInFrames: number;
  place: string;
  sub?: string;
  accent?: string;
}> = ({ durationInFrames, place, sub, accent }) => {
  const a = acc(accent);
  const { op, y, f, fps } = useTagReveal(durationInFrames);
  const lineW = interpolate(f, [Math.round(fps * 0.3), Math.round(fps * 0.95)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", bottom: 108, left: 86, opacity: op, transform: `translateY(${y}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="26" height="34" viewBox="0 0 24 32" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }}>
            <path d="M12 0C5.9 0 1 4.9 1 11c0 7.7 11 21 11 21s11-13.3 11-21C23 4.9 18.1 0 12 0z" fill={a} opacity="0.92" />
            <circle cx="12" cy="11" r="4" fill="#0a0e14" />
          </svg>
          <div>
            <div style={{ fontFamily: SANS, color: "#fff", fontSize: 35, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}>{place}</div>
            {sub && <div style={{ fontFamily: SANS, color: "rgba(255,255,255,0.72)", fontSize: 18, fontWeight: 600, letterSpacing: 0.5, marginTop: 2, textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}>{sub}</div>}
          </div>
        </div>
        <div style={{ height: 2, marginTop: 9, marginLeft: 38, width: `${lineW * 100}%`, maxWidth: 520, background: a, boxShadow: `0 0 12px ${a}` }} />
      </div>
    </AbsoluteFill>
  );
};
