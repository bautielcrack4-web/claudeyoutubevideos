import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// SaltPlunge — "the salt trick": un termómetro grande arranca en 32°F (apenas
// congela); cae SAL y el mercurio se DESPLOMA por debajo de 0°F (número contando),
// frío suficiente para congelar crema. Física hecha visible, dinámica.
const COLD = "#7FB4D8";
const RED = "#CC3B26";

export const SaltPlunge: React.FC<{ durationInFrames: number; from?: number; to?: number }> = ({
  durationInFrames,
  from = 32,
  to = -6,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / durationInFrames;

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // sal cae a ~0.30; el mercurio se desploma 0.38→0.78
  const saltIn = interpolate(t, [0.26, 0.40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const plunge = interpolate(t, [0.38, 0.78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const temp = from + (to - from) * plunge;

  // geometría del termómetro
  const cx = width * 0.30;
  const tubeTop = height * 0.22;
  const tubeBot = height * 0.70;
  const tubeH = tubeBot - tubeTop;
  // mapeo temp→y: 40°F arriba, -15°F abajo (input range creciente para interpolate)
  const tY = (temp) => interpolate(temp, [-15, 40], [tubeBot, tubeTop]);
  const mercY = tY(temp);

  const frost = interpolate(plunge, [0.4, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: inO * outO, background: "linear-gradient(to bottom, #0C1620 0%, #122433 60%, #1A3043 100%)" }}>
      {/* título */}
      <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", fontFamily: FONT_STACK }}>
        <div style={{ color: COLD, fontSize: 28, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700 }}>The salt trick</div>
        <div style={{ color: "#F4E6CF", fontSize: 56, fontWeight: 800, marginTop: 2 }}>Colder than ice itself</div>
      </div>

      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* marcas de escala */}
        {[32, 0, -10].map((m) => (
          <g key={m}>
            <line x1={cx + 40} y1={tY(m)} x2={cx + 70} y2={tY(m)} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
            <text x={cx + 80} y={tY(m) + 8} fontFamily={FONT_STACK} fontSize={28} fill="rgba(255,255,255,0.75)">{m}°F</text>
          </g>
        ))}
        {/* tubo */}
        <rect x={cx - 22} y={tubeTop} width={44} height={tubeH} rx={22} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.85)" strokeWidth={5} />
        {/* mercurio */}
        <rect x={cx - 13} y={mercY} width={26} height={tubeBot - mercY + 30} fill={plunge > 0.5 ? COLD : "#D98A3D"} />
        {/* bulbo */}
        <circle cx={cx} cy={tubeBot + 28} r={40} fill={plunge > 0.5 ? COLD : "#D98A3D"} stroke="rgba(255,255,255,0.85)" strokeWidth={5} />

        {/* sal cayendo */}
        {saltIn > 0 && Array.from({ length: 18 }).map((_, i) => {
          const px = cx - 60 + (i * 7);
          const fall = ((frame * 6 + i * 23) % 120) / 120;
          return <rect key={i} x={px} y={tubeTop - 60 + fall * 120} width={4} height={4} rx={1} fill="#FFFFFF" opacity={saltIn * (1 - fall) * 0.9} transform={`rotate(${i * 20} ${px} ${tubeTop})`} />;
        })}
        {/* escarcha en el bulbo */}
        {frost > 0.1 && Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <line key={i} x1={cx} y1={tubeBot + 28} x2={cx + Math.cos(a) * 56} y2={tubeBot + 28 + Math.sin(a) * 56} stroke="#FFF" strokeWidth={1.5} opacity={frost * 0.5} />;
        })}
      </svg>

      {/* número grande contando */}
      <div style={{ position: "absolute", right: width * 0.12, top: "38%", textAlign: "center", fontFamily: FONT_STACK }}>
        <div style={{ fontSize: 150, fontWeight: 900, color: plunge > 0.5 ? COLD : "#F4E6CF", lineHeight: 1, textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          {Math.round(temp)}°F
        </div>
        <div style={{ marginTop: 10, fontSize: 34, fontWeight: 700, color: "#F4E6CF", opacity: saltIn }}>
          <span style={{ color: "#FFFFFF", background: RED, padding: "2px 16px", borderRadius: 10 }}>+ SALT</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 30, color: "#CFE0D6", opacity: interpolate(plunge, [0.6, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          cold enough to freeze cream solid
        </div>
      </div>
    </AbsoluteFill>
  );
};
