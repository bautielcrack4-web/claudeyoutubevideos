import { useCurrentFrame, AbsoluteFill, interpolate } from "remotion";

// ── LIGHT RAYS (god-rays volumétricos) ────────────────────────────────────────
// Haces de luz cálida que entran desde una fuente (ventana/sol), con leve deriva y
// motas que cruzan. Drop-in encima de escenas con luz natural (apertura, galpón).
export const LightRays: React.FC<{
  x?: number; // 0..1 origen de la luz
  y?: number;
  count?: number;
  color?: string;
  strength?: number;
  angle?: number; // grados
}> = ({ x = 0.22, y = 0.1, count = 7, color = "rgba(255,220,160,1)", strength = 0.5, angle = 24 }) => {
  const frame = useCurrentFrame();
  const ox = x * 1920;
  const oy = y * 1080;
  const breathe = 0.8 + 0.2 * Math.sin(frame / 40);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", mixBlendMode: "screen" }}>
      {/* resplandor en la fuente */}
      <div style={{ position: "absolute", left: ox - 280, top: oy - 280, width: 560, height: 560, borderRadius: 560, background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 65%)`, opacity: 0.35 * strength * breathe, filter: "blur(20px)" }} />
      {/* haces */}
      {Array.from({ length: count }).map((_, i) => {
        const w = 60 + (i % 3) * 50;
        const drift = Math.sin(frame / (70 + i * 11) + i) * 14;
        const op = (0.05 + (i % 2) * 0.04) * strength * breathe;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: ox + (i - count / 2) * 70 + drift,
              top: oy,
              width: w,
              height: 1700,
              transformOrigin: "top center",
              transform: `rotate(${angle}deg)`,
              background: `linear-gradient(to bottom, ${color} 0%, rgba(0,0,0,0) 70%)`,
              opacity: op,
              filter: "blur(14px)",
            }}
          />
        );
      })}
      {/* leve oscurecido en el extremo opuesto para dar volumen */}
      <AbsoluteFill style={{ background: `radial-gradient(80% 80% at ${x * 100}% ${y * 100}%, rgba(0,0,0,0) 40%, rgba(10,8,5,${0.12 * strength}) 100%)`, mixBlendMode: "multiply" }} />
      {/* atenuación de entrada */}
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
    </AbsoluteFill>
  );
};
