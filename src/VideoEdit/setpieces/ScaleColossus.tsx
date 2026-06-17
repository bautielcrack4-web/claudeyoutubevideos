import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, MONO, acc } from "../overlays/ui";

// ScaleColossus — imagen real del objeto colosal + silueta humana diminuta + medida que
// cuenta. Mete DENTRO del video la fórmula de miniatura que gana (humano vs lo imposible).
export const ScaleColossus: React.FC<{
  durationInFrames: number;
  image: string;
  meters: number;
  unit?: string;
  label?: string;
  eyebrow?: string;
  accent?: string;
}> = ({ durationInFrames, image, meters, unit = "m", label, eyebrow, accent }) => {
  const a = acc(accent || "cyan");
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = interpolate(f, [0, durationInFrames], [1.04, 1.1]);
  const grow = interpolate(f, [fps * 0.5, fps * 1.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const count = Math.round(interpolate(f, [fps * 0.6, fps * 2.0], [0, meters], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const op = interpolate(f, [0, fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#06080c", opacity: op }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.72) contrast(1.05)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 40%)" }} />
      {/* barra de medida + ticks a la izquierda */}
      <div style={{ position: "absolute", left: 120, top: "22%", bottom: "22%", width: 2, background: a, opacity: grow, boxShadow: `0 0 12px ${a}`, transformOrigin: "top", transform: `scaleY(${grow})` }} />
      <div style={{ position: "absolute", left: 110, top: "20%", width: 22, height: 2, background: a, opacity: grow }} />
      <div style={{ position: "absolute", left: 110, top: "80%", width: 22, height: 2, background: a, opacity: grow }} />
      {/* silueta humana diminuta para escala */}
      <svg viewBox="0 0 20 50" style={{ position: "absolute", left: 150, bottom: "22%", height: "11%", opacity: grow, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.8))" }}>
        <circle cx="10" cy="7" r="5" fill="#fff" />
        <path d="M10 12 C5 12 4 20 4 30 L7 50 L9 50 L10 34 L11 50 L13 50 L16 30 C16 20 15 12 10 12 Z" fill="#fff" />
      </svg>
      <div style={{ position: "absolute", left: 188, bottom: "20%", opacity: grow }}>
        <span style={{ fontFamily: MONO, color: "rgba(255,255,255,0.8)", fontSize: 14, letterSpacing: 1 }}>1 persona</span>
      </div>
      {/* número de medida grande */}
      <div style={{ position: "absolute", right: 96, top: "50%", transform: "translateY(-50%)", textAlign: "right" }}>
        {eyebrow && <div style={{ fontFamily: MONO, color: a, fontSize: 15, fontWeight: 700, letterSpacing: 4, marginBottom: 6, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>{eyebrow.toUpperCase()}</div>}
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 132, fontWeight: 900, lineHeight: 1, letterSpacing: -2, textShadow: "0 6px 30px rgba(0,0,0,0.8)" }}>
          {count}<span style={{ fontSize: 56, fontWeight: 800, color: a }}>{" " + unit}</span>
        </div>
        {label && <div style={{ fontFamily: SANS, color: "rgba(255,255,255,0.82)", fontSize: 24, fontWeight: 600, marginTop: 8, textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}>{label}</div>}
      </div>
    </AbsoluteFill>
  );
};
