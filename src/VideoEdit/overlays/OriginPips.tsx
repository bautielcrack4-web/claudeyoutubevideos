import { AbsoluteFill } from "remotion";
import { SANS, acc, panel, interpolate, useCurrentFrame, useVideoConfig } from "./ui";

// OriginPips — etiquetas que aparecen UNA A UNA conectadas por una línea (red comercial).
// Hace tangible "un solo barco con carga de 5 culturas" mientras corre el footage.
export const OriginPips: React.FC<{
  durationInFrames: number;
  items: string[];
  accent?: string;
}> = ({ durationInFrames, items, accent }) => {
  const a = acc(accent);
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = interpolate(f, [0, Math.round(fps * 0.4), durationInFrames - Math.round(fps * 0.5), durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const each = Math.max(1, (durationInFrames - fps * 1.2) / items.length);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", bottom: 116, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", opacity: op }}>
        {items.map((it, i) => {
          const ap = interpolate(f, [i * each, i * each + Math.round(fps * 0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <span key={i} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && <span style={{ width: 36, height: 2, background: a, opacity: ap * 0.55, margin: "0 3px" }} />}
              <span style={{ ...panel(a), padding: "7px 14px", opacity: ap, transform: `translateY(${(1 - ap) * 8}px)` }}>
                <span style={{ fontFamily: SANS, color: "#fff", fontSize: 19, fontWeight: 700, letterSpacing: 0.4, textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>{it}</span>
              </span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
