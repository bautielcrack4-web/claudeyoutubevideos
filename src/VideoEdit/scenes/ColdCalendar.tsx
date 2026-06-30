import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// ColdCalendar — "9 months of cold". Tira de meses ENE→SEP; un playhead barre de
// izquierda a derecha mientras un bloque de hielo sobrevive (se achica apenas pero
// no se derrite), aunque Jul/Ago calienten. Cierra con "9 MONTHS OF COLD".
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP"];
const COLD = "#7FB4D8";

export const ColdCalendar: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const t = frame / durationInFrames;

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const trackW = 1180;
  const cellW = trackW / MONTHS.length;
  const x0 = (width - trackW) / 2;
  const trackY = 470;

  // playhead 0..1 sobre el primer 75% del beat
  const sweep = interpolate(t, [0.08, 0.75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const headX = x0 + sweep * trackW;
  const blockShrink = interpolate(sweep, [0, 1], [1, 0.82]);

  const bigIn = spring({ frame: frame - Math.round(durationInFrames * 0.72), fps, config: { damping: 14, mass: 0.8 }, durationInFrames: 18 });

  return (
    <AbsoluteFill style={{ opacity: inO * outO, alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom, #0B1422 0%, #122334 60%, #18324a 100%)" }}>
      <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center", fontFamily: FONT_STACK }}>
        <div style={{ color: "#9FC4DA", fontSize: 28, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700 }}>From one January cut</div>
        <div style={{ color: "#F4E6CF", fontSize: 58, fontWeight: 800, marginTop: 4 }}>Ice that lasts into the fall</div>
      </div>

      <svg width={width} height={300} style={{ position: "absolute", top: trackY - 70 }}>
        {/* celdas de meses */}
        {MONTHS.map((m, i) => {
          const cx = x0 + i * cellW;
          const warm = interpolate(i, [4, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // verano hacia la derecha
          const passed = headX >= cx + cellW * 0.5;
          return (
            <g key={i}>
              <rect x={cx + 5} y={70} width={cellW - 10} height={70} rx={12}
                fill={`rgba(${Math.round(176 + warm * 40)},${Math.round(120 - warm * 30)},${Math.round(70 - warm * 30)},${passed ? 0.22 : 0.10})`}
                stroke={passed ? COLORS.danger : "rgba(120,100,70,0.35)"} strokeWidth={passed ? 2.5 : 1.5} />
              <text x={cx + cellW / 2} y={114} textAnchor="middle" fontFamily={FONT_STACK} fontSize={30} fontWeight={700}
                fill={passed ? "#F4E6CF" : "rgba(200,188,160,0.45)"}>{m}</text>
            </g>
          );
        })}

        {/* bloque de hielo que avanza */}
        <g transform={`translate(${headX}, ${105})`}>
          <rect x={-34 * blockShrink} y={-34 * blockShrink} width={68 * blockShrink} height={68 * blockShrink} rx={8}
            fill="#D7ECF7" stroke={COLD} strokeWidth={3} transform="translate(0,-40)" />
          <line x1={-18 * blockShrink} y1={-58} x2={6 * blockShrink} y2={-30} stroke="#FFF" strokeWidth={2} opacity={0.8} transform="translate(0,-2)" />
          {/* playhead */}
          <line x1={0} y1={-78} x2={0} y2={48} stroke={COLORS.danger} strokeWidth={3} />
          <circle cx={0} cy={-82} r={6} fill={COLORS.danger} />
        </g>
      </svg>

      {/* cierre: 9 MONTHS OF COLD */}
      <div style={{ position: "absolute", top: trackY + 120, width: "100%", textAlign: "center", fontFamily: FONT_STACK, transform: `scale(${interpolate(bigIn, [0, 1], [0.7, 1])})`, opacity: bigIn }}>
        <span style={{ fontSize: 120, fontWeight: 900, color: COLD, textShadow: "0 3px 0 rgba(0,0,0,0.08)" }}>9</span>
        <span style={{ fontSize: 56, fontWeight: 800, color: "#F4E6CF", marginLeft: 14 }}>MONTHS OF COLD</span>
      </div>
    </AbsoluteFill>
  );
};
