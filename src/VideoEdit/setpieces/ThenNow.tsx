import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, acc } from "../overlays/ui";

// ThenNow — dos imágenes reales con un divisor que barre (split). Cuenta una historia en
// un solo plano: "lo que quedó ↔ lo que era". left = before, right = after.
export const ThenNow: React.FC<{
  durationInFrames: number;
  before: { src: string; label?: string };
  after: { src: string; label?: string };
  accent?: string;
}> = ({ durationInFrames, before, after, accent }) => {
  const a = acc(accent || "amber");
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = interpolate(f, [0, fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // el divisor barre de 18% a 62% y se queda
  const p = interpolate(f, [fps * 0.5, fps * 2.6], [0.16, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kb = interpolate(f, [0, durationInFrames], [1.05, 1.11]);
  return (
    <AbsoluteFill style={{ background: "#06080c", opacity: op }}>
      {/* AFTER (derecha, fondo completo) */}
      <AbsoluteFill style={{ transform: `scale(${kb})` }}>
        <Img src={staticFile(after.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8) contrast(1.04)" }} />
      </AbsoluteFill>
      {/* BEFORE (izquierda, recortado por el divisor) */}
      <AbsoluteFill style={{ clipPath: `inset(0 ${100 - p * 100}% 0 0)` }}>
        <AbsoluteFill style={{ transform: `scale(${kb})` }}>
          <Img src={staticFile(before.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.74) saturate(0.92)" }} />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.35) 100%)" }} />
      {/* línea divisora con manija */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${p * 100}%`, width: 3, background: "#fff", boxShadow: `0 0 14px ${a}`, transform: "translateX(-50%)" }} />
      <div style={{ position: "absolute", top: "50%", left: `${p * 100}%`, transform: "translate(-50%,-50%)", width: 42, height: 42, borderRadius: "50%", background: "rgba(8,13,20,0.7)", border: `2px solid ${a}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 18 }}>↔</div>
      {/* etiquetas */}
      {before.label && <div style={{ position: "absolute", top: 70, left: 84, fontFamily: SANS, color: "#fff", fontSize: 22, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>{before.label}</div>}
      {after.label && <div style={{ position: "absolute", top: 70, right: 84, fontFamily: SANS, color: a, fontSize: 22, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>{after.label}</div>}
    </AbsoluteFill>
  );
};
