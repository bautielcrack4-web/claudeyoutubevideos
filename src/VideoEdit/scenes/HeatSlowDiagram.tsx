import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// HeatSlowDiagram — concepto central de "por qué funciona": el CALOR se cuela hacia
// el bloque de hielo desde TODOS lados (flechas cálidas que entran) y la AISLACIÓN
// de aire muerto (anillo de aserrín) lo FRENA. Fondo oscuro, alto contraste.
const COLD = "#8FB7D6";
const WARM = "#E2933F";
const SAW = "#D8B968";

export const HeatSlowDiagram: React.FC<{ durationInFrames: number; title?: string }> = ({
  durationInFrames,
  title = "Why it barely melts",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / durationInFrames;

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cx = width / 2, cy = height * 0.56;
  const iceR = 110, sawR = 200;
  const ringIn = spring({ frame: frame - 14, fps, config: { damping: 15 }, durationInFrames: 18 });
  const labO = interpolate(t, [0.5, 0.68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const arrows = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);

  return (
    <AbsoluteFill style={{ opacity: inO * outO, background: "linear-gradient(160deg, #201A14 0%, #2A2318 60%, #2F2719 100%)" }}>
      <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: FONT_STACK }}>
        <div style={{ color: COLD, fontSize: 28, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700 }}>The whole secret</div>
        <div style={{ color: "#F4E6CF", fontSize: 52, fontWeight: 800, marginTop: 2 }}>{title}</div>
      </div>

      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {arrows.map((a, i) => {
          const prog = ((t * 1.4 + (i % 6) / 6) % 1);
          const rStart = sawR + 230;
          const rEnd = sawR + 18;
          const r = interpolate(prog, [0, 1], [rStart, rEnd]);
          const op = interpolate(prog, [0, 0.15, 0.8, 1], [0, 1, 1, 0]) * 0.85;
          const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
          const x2 = cx + Math.cos(a) * (r - 26), y2 = cy + Math.sin(a) * (r - 26);
          return (
            <g key={i} opacity={op}>
              <line x1={x} y1={y} x2={x2} y2={y2} stroke={WARM} strokeWidth={4} strokeLinecap="round" />
              <path d={`M ${x2} ${y2} l ${Math.cos(a + 2.5) * 12} ${Math.sin(a + 2.5) * 12} M ${x2} ${y2} l ${Math.cos(a - 2.5) * 12} ${Math.sin(a - 2.5) * 12}`} stroke={WARM} strokeWidth={4} strokeLinecap="round" fill="none" />
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={sawR * ringIn} fill="none" stroke={SAW} strokeWidth={36} opacity={0.5} strokeDasharray="3 9" />
        <circle cx={cx} cy={cy} r={iceR * ringIn} fill="#D7ECF7" stroke={COLD} strokeWidth={4} />
        <text x={cx} y={cy + 8} textAnchor="middle" fontFamily={FONT_STACK} fontSize={30} fontWeight={800} fill="#2A4660" opacity={ringIn}>ICE</text>
      </svg>

      <div style={{ position: "absolute", left: width * 0.06, top: cy - 30, fontFamily: FONT_STACK, color: WARM, fontSize: 30, fontWeight: 700, opacity: labO, maxWidth: 280, textShadow: "0 2px 8px #000" }}>Heat sneaks in from every side</div>
      <div style={{ position: "absolute", right: width * 0.06, top: cy - 30, fontFamily: FONT_STACK, color: SAW, fontSize: 30, fontWeight: 700, opacity: labO, maxWidth: 280, textAlign: "right", textShadow: "0 2px 8px #000" }}>Dead-air sawdust slows it to a crawl</div>
    </AbsoluteFill>
  );
};
