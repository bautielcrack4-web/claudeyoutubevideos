import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, MONO, acc } from "../overlays/ui";

// GhostReconstruction — sobre la ruina/sitio REAL aparece una reconstrucción semitransparente
// revelada por una línea de barrido. "Así se veía." Conecta presente y pasado.
export const GhostReconstruction: React.FC<{
  durationInFrames: number;
  real: string;
  ghost: string;
  label?: string;
  accent?: string;
}> = ({ durationInFrames, real, ghost, label, accent }) => {
  const a = acc(accent || "cyan");
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = interpolate(f, [0, fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kb = interpolate(f, [0, durationInFrames], [1.05, 1.11]);
  // barrido que revela el fantasma (de arriba a abajo) + leve pulso
  const sweep = interpolate(f, [fps * 0.6, fps * 2.6], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ghostOp = interpolate(f, [fps * 0.6, fps * 2.6], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (0.9 + 0.1 * Math.sin(f / 9));
  return (
    <AbsoluteFill style={{ background: "#06080c", opacity: op }}>
      <AbsoluteFill style={{ transform: `scale(${kb})` }}>
        <Img src={staticFile(real)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.78) contrast(1.04)" }} />
      </AbsoluteFill>
      {/* fantasma revelado por máscara (clip hasta sweep%) */}
      <AbsoluteFill style={{ clipPath: `inset(0 0 ${100 - sweep}% 0)`, opacity: ghostOp }}>
        <AbsoluteFill style={{ transform: `scale(${kb})` }}>
          <Img src={staticFile(ghost)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `saturate(0.85) brightness(1.05) drop-shadow(0 0 6px ${a})` }} />
        </AbsoluteFill>
      </AbsoluteFill>
      {/* línea de barrido */}
      {sweep > 0 && sweep < 100 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: `${sweep}%`, height: 2, background: a, boxShadow: `0 0 16px ${a}, 0 0 32px ${a}`, opacity: 0.9 }} />
      )}
      <div style={{ position: "absolute", left: 84, bottom: 92 }}>
        <div style={{ fontFamily: MONO, color: a, fontSize: 14, fontWeight: 700, letterSpacing: 4, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>RECONSTRUCCIÓN</div>
        {label && <div style={{ fontFamily: SANS, color: "#fff", fontSize: 34, fontWeight: 800, marginTop: 6, maxWidth: 820, textShadow: "0 3px 16px rgba(0,0,0,0.85)" }}>{label}</div>}
      </div>
    </AbsoluteFill>
  );
};
