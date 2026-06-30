import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// WinterBank — metáfora visual: "no cosechaban hielo, cosechaban INVIERNO y lo
// ponían en el banco para gastarlo en verano". Copos caen a una bóveda/caja fuerte,
// se acumulan, y una flecha → sol "spend in summer". Fondo frío oscuro.
const COLD = "#8FB7D6";
const GOLD = "#D8B968";

const flakes = Array.from({ length: 26 }, (_, i) => ({
  x: 0.30 + ((i * 53) % 100) / 100 * 0.16, // caen sobre la bóveda (~0.30-0.46)
  delay: (i % 13) / 13,
  drift: ((i * 31) % 20) - 10,
  r: ((i * 7) % 3) + 3,
}));

export const WinterBank: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / durationInFrames;

  const inO = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const vaultSpr = spring({ frame: frame - 6, fps, config: { damping: 15 }, durationInFrames: 16 });
  const fill = interpolate(t, [0.2, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const arrow = interpolate(t, [0.62, 0.82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const vx = width * 0.38, vy = height * 0.46, vw = 280, vh = 240;

  return (
    <AbsoluteFill style={{ opacity: inO * outO, background: "linear-gradient(to bottom, #0B1422 0%, #122334 60%, #18324a 100%)" }}>
      <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: FONT_STACK }}>
        <div style={{ color: COLD, fontSize: 28, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700 }}>The real harvest</div>
        <div style={{ color: "#F4E6CF", fontSize: 52, fontWeight: 800, marginTop: 2 }}>They weren't banking ice — they were banking winter</div>
      </div>

      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* copos cayendo */}
        {flakes.map((f, i) => {
          const p = ((t * 1.6 + f.delay) % 1);
          const fy = interpolate(p, [0, 1], [height * 0.28, vy]);
          const fo = interpolate(p, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);
          return <text key={i} x={f.x * width + f.drift} y={fy} fontSize={f.r * 6} fill="#EAF4FB" opacity={fo * 0.9} textAnchor="middle">❄</text>;
        })}

        {/* bóveda */}
        <g style={{ opacity: vaultSpr, transform: `scale(${interpolate(vaultSpr, [0, 1], [0.85, 1])})`, transformOrigin: `${vx + vw / 2}px ${vy + vh / 2}px` }}>
          <rect x={vx} y={vy} width={vw} height={vh} rx={16} fill="#1B2A3C" stroke={GOLD} strokeWidth={5} />
          {/* hielo acumulado adentro */}
          <rect x={vx + 14} y={vy + vh - 14 - (vh - 40) * fill} width={vw - 28} height={(vh - 40) * fill} rx={6} fill="#CFE6F4" opacity={0.9} />
          {/* puerta/dial */}
          <circle cx={vx + vw / 2} cy={vy + vh / 2} r={42} fill="none" stroke={GOLD} strokeWidth={5} opacity={0.6} />
          <circle cx={vx + vw / 2} cy={vy + vh / 2} r={8} fill={GOLD} opacity={0.7} />
          <text x={vx + vw / 2} y={vy + vh + 44} textAnchor="middle" fontFamily={FONT_STACK} fontSize={30} fontWeight={800} fill={GOLD}>THE BANK</text>
        </g>

        {/* flecha → sol */}
        <g style={{ opacity: arrow }}>
          <line x1={vx + vw + 30} y1={vy + vh / 2} x2={vx + vw + 200} y2={vy + vh / 2} stroke={GOLD} strokeWidth={4} strokeDasharray="2 9" strokeLinecap="round" />
          <path d={`M ${vx + vw + 192} ${vy + vh / 2 - 9} L ${vx + vw + 208} ${vy + vh / 2} L ${vx + vw + 192} ${vy + vh / 2 + 9}`} fill="none" stroke={GOLD} strokeWidth={4} strokeLinecap="round" />
          <circle cx={vx + vw + 270} cy={vy + vh / 2} r={34} fill="#E8A23D" />
          {Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2; return <line key={i} x1={vx + vw + 270 + Math.cos(a) * 42} y1={vy + vh / 2 + Math.sin(a) * 42} x2={vx + vw + 270 + Math.cos(a) * 54} y2={vy + vh / 2 + Math.sin(a) * 54} stroke="#E8A23D" strokeWidth={4} strokeLinecap="round" />; })}
          <text x={vx + vw + 270} y={vy + vh / 2 + 90} textAnchor="middle" fontFamily={FONT_STACK} fontSize={28} fontWeight={800} fill="#F4E6CF">spent in summer</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
