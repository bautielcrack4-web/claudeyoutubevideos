import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// RedactedReveal — open loop. La respuesta al "one mistake" aparece CENSURADA
// (barra negra que titila intentando revelarse) → intriga máxima sin spoilear.
// Goteo de agua para reforzar "melts". Sobre la imagen de hielo derritiéndose.
const RED = "#CC3B26";

export const RedactedReveal: React.FC<{
  durationInFrames: number;
  image: string;
  eyebrow?: string;
  title?: string;
  redacted?: string;
  sub?: string;
}> = ({ durationInFrames, image, eyebrow = "By the 4th of July", title = "One mistake melts it all", redacted = "THE MISTAKE", sub = "I'll show you how to avoid it" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / durationInFrames;

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleSpr = spring({ frame, fps, config: { damping: 14, mass: 0.7 }, durationInFrames: 16 });
  const barIn = spring({ frame: frame - 16, fps, config: { damping: 16 }, durationInFrames: 14 });
  // la barra negra "titila" tratando de revelarse pero no lo logra
  const flicker = 0.86 + 0.14 * Math.sin((frame / fps) * 18);

  // gotas que caen
  const drips = Array.from({ length: 9 }, (_, i) => i);

  return (
    <AbsoluteFill style={{ opacity: inO * outO }}>
      {/* fondo: hielo derritiéndose, oscurecido */}
      <Img src={staticFile(image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(10,8,6,0.55), rgba(10,8,6,0.78))" }} />

      {/* gotas */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {drips.map((i) => {
          const x = (i + 0.5) * (width / drips.length) + Math.sin(i) * 20;
          const phase = ((frame * 5 + i * 40) % 150) / 150;
          const y = phase * height;
          return <ellipse key={i} cx={x} cy={y} rx={3} ry={8} fill="#9FC4DA" opacity={(1 - phase) * 0.5} />;
        })}
      </svg>

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT_STACK }}>
        {/* eyebrow con triángulo de alerta */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: RED, fontSize: 30, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase" }}>
          <span style={{ fontSize: 34 }}>⚠</span>{eyebrow}
        </div>
        {/* título */}
        <div style={{ color: "#FBF1E0", fontSize: 78, fontWeight: 900, marginTop: 10, textAlign: "center", textShadow: "0 4px 22px rgba(0,0,0,0.8)", transform: `scale(${interpolate(titleSpr, [0, 1], [0.8, 1])})`, opacity: titleSpr }}>
          {title}
        </div>

        {/* línea con la respuesta CENSURADA */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 40, opacity: barIn }}>
          <span style={{ color: "#E9DCC6", fontSize: 40, fontWeight: 700 }}>The mistake:</span>
          <div style={{ position: "relative", transform: `scaleX(${interpolate(barIn, [0, 1], [0.3, 1])})` }}>
            <div style={{ background: "#0A0A0A", border: `3px solid ${RED}`, borderRadius: 8, padding: "8px 40px", opacity: flicker, display: "flex", gap: 8 }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ width: 28, height: 38, background: "#1A1A1A" }} />
              ))}
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: RED, fontSize: 30, fontWeight: 900, letterSpacing: 4 }}>
              REVEALED INSIDE
            </div>
          </div>
        </div>

        {/* sub */}
        <div style={{ marginTop: 40, color: COLORS.cold === "#6F8478" ? "#CFE0D6" : "#CFE0D6", fontSize: 36, fontWeight: 700, opacity: interpolate(t, [0.45, 0.65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          → {sub}
        </div>
      </div>
    </AbsoluteFill>
  );
};
