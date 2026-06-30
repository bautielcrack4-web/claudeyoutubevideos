import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { FONT_STACK } from "../theme";

// SpoonInCream — clímax/open-loop del hook de LECHE. "Cream thick enough to stand a
// spoon in, on a night the air never dropped below 70°F". Sobre una foto de una cuchara
// parada en crema espesa: un termómetro a la derecha clava la aguja en 70°F (calor),
// y aun así un titular se dibuja "and the spoon still stood". Intriga: ¿cómo?
const COLD = "#7FB2CE";
const WARM = "#E8A23C";

export const SpoonInCream: React.FC<{
  durationInFrames: number;
  image: string;
  temp?: string;
  headline?: string;
  sub?: string;
}> = ({
  durationInFrames,
  image,
  temp = "70°F",
  headline = "And the spoon still stood.",
  sub = "On a night that never once froze",
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const t = frame / durationInFrames;

  const inO = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // termómetro: la columna sube hasta lo "caliente" (70°F) y queda titilando
  const fill = spring({ frame: frame - 8, fps, config: { damping: 18, mass: 0.9 }, durationInFrames: 26 });
  const pulse = 0.9 + 0.1 * Math.sin((frame / fps) * 5);

  // titular tipo "se dibuja" palabra a palabra
  const words = headline.split(" ");
  const subIn = interpolate(t, [0.5, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // medidas del termómetro
  const tubeTop = height * 0.26;
  const tubeBot = height * 0.66;
  const bulbY = tubeBot + 34;
  const colTop = interpolate(fill, [0, 1], [tubeBot, tubeTop]);

  return (
    <AbsoluteFill style={{ opacity: inO * outO, fontFamily: FONT_STACK }}>
      <Img src={staticFile(image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "linear-gradient(to right, rgba(8,10,14,0.78) 0%, rgba(8,10,14,0.35) 45%, rgba(8,10,14,0.15) 100%)" }} />

      {/* termómetro a la derecha */}
      <svg width={220} height={height} style={{ position: "absolute", right: 70, top: 0 }}>
        {/* tubo */}
        <rect x={96} y={tubeTop - 14} width={28} height={tubeBot - tubeTop + 28} rx={14} fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.5)" strokeWidth={3} />
        {/* columna */}
        <rect x={101} y={colTop} width={18} height={tubeBot - colTop + 6} fill={WARM} opacity={pulse} />
        {/* bulbo */}
        <circle cx={110} cy={bulbY} r={26} fill={WARM} opacity={pulse} />
        {/* marcas */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line key={i} x1={124} y1={tubeBot - p * (tubeBot - tubeTop)} x2={140} y2={tubeBot - p * (tubeBot - tubeTop)} stroke="rgba(255,255,255,0.6)" strokeWidth={2} />
        ))}
      </svg>
      <div style={{ position: "absolute", right: 120, top: tubeTop - 78, textAlign: "center", opacity: fill }}>
        <div style={{ color: WARM, fontSize: 64, fontWeight: 900, textShadow: "0 3px 16px rgba(0,0,0,0.8)" }}>{temp}</div>
        <div style={{ color: "#E9DCC6", fontSize: 24, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>air, all night</div>
      </div>

      {/* texto a la izquierda */}
      <div style={{ position: "absolute", left: 90, top: 0, bottom: 0, width: "52%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: COLD, fontSize: 30, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16, opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>
          <span style={{ fontSize: 30 }}>❄</span> No ice. No freezer.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 18px" }}>
          {words.map((w, i) => {
            const wIn = spring({ frame: frame - 14 - i * 4, fps, config: { damping: 16 }, durationInFrames: 14 });
            return (
              <span key={i} style={{ color: "#FBF1E0", fontSize: 78, fontWeight: 900, lineHeight: 1.05, textShadow: "0 4px 22px rgba(0,0,0,0.85)", opacity: wIn, transform: `translateY(${interpolate(wIn, [0, 1], [22, 0])}px)` }}>
                {w}
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: 30, color: COLD, fontSize: 38, fontWeight: 700, opacity: subIn }}>
          → {sub}
        </div>
      </div>
    </AbsoluteFill>
  );
};
