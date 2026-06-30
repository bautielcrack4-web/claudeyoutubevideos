import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { FONT_STACK } from "../theme";

// DoorColdFalls — el error de la puerta: por una puerta abierta el aire FRÍO (azul,
// pesado) CAE y se escapa por abajo, y el CÁLIDO (naranja) entra por arriba. Flujos
// animados a través del vano. Fondo oscuro.
const COLD = "#7FB4D8";
const WARM = "#E2933F";

export const DoorColdFalls: React.FC<{ durationInFrames: number; title?: string }> = ({
  durationInFrames,
  title = "Cold falls out. Warm rushes in.",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / durationInFrames;

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cx = width / 2, doorW = 280, doorH = 460, doorTop = height * 0.30;
  const doorIn = spring({ frame: frame - 10, fps, config: { damping: 16 }, durationInFrames: 16 });
  const labO = interpolate(t, [0.4, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // partículas de aire frío (caen y salen por abajo) y cálido (entra por arriba)
  const cold = Array.from({ length: 16 }, (_, i) => i);
  const warm = Array.from({ length: 12 }, (_, i) => i);

  return (
    <AbsoluteFill style={{ opacity: inO * outO, background: "linear-gradient(160deg, #141017 0%, #1B1622 60%, #20202f 100%)" }}>
      <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: FONT_STACK }}>
        <div style={{ color: "#C24736", fontSize: 28, letterSpacing: 4, textTransform: "uppercase", fontWeight: 800 }}>The one mistake</div>
        <div style={{ color: "#F4E6CF", fontSize: 50, fontWeight: 800, marginTop: 2 }}>{title}</div>
      </div>

      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* vano / puerta abierta */}
        <g style={{ opacity: doorIn }}>
          <rect x={cx - doorW / 2 - 16} y={doorTop - 16} width={doorW + 32} height={doorH + 16} rx={6} fill="#2A2118" stroke="#5A4630" strokeWidth={6} />
          <rect x={cx - doorW / 2} y={doorTop} width={doorW} height={doorH} fill="#0C0C12" />
          {/* puerta abierta (panel a un lado) */}
          <rect x={cx + doorW / 2 + 10} y={doorTop} width={26} height={doorH} rx={4} fill="#4A3A26" stroke="#6A5238" strokeWidth={3} transform={`rotate(-12 ${cx + doorW / 2 + 10} ${doorTop})`} />
        </g>

        {/* aire CÁLIDO entrando por arriba */}
        {warm.map((i) => {
          const p = ((t * 1.5 + (i % 6) / 6) % 1);
          const x = cx - doorW / 2 + 20 + (i * 22) % (doorW - 40);
          const y = doorTop + 10 + p * (doorH * 0.42);
          return <circle key={`w${i}`} cx={x} cy={y} r={6} fill={WARM} opacity={interpolate(p, [0, 0.2, 1], [0, 0.7, 0]) * doorIn} />;
        })}
        {/* aire FRÍO cayendo y saliendo por abajo */}
        {cold.map((i) => {
          const p = ((t * 1.7 + (i % 8) / 8) % 1);
          const x = cx - doorW / 2 + 18 + (i * 17) % (doorW - 36);
          const y = doorTop + doorH * 0.5 + p * (doorH * 0.55 + 60);
          return <circle key={`c${i}`} cx={x} cy={y} r={7} fill={COLD} opacity={interpolate(p, [0, 0.15, 0.85, 1], [0, 0.85, 0.85, 0]) * doorIn} />;
        })}
        {/* flechas grandes */}
        <g opacity={labO}>
          <path d={`M ${cx} ${doorTop + 30} l -16 -20 M ${cx} ${doorTop + 30} l 16 -20 M ${cx} ${doorTop + 30} l 0 -34`} stroke={WARM} strokeWidth={5} strokeLinecap="round" fill="none" />
          <path d={`M ${cx} ${doorTop + doorH + 28} l -16 20 M ${cx} ${doorTop + doorH + 28} l 16 20 M ${cx} ${doorTop + doorH + 28} l 0 34`} stroke={COLD} strokeWidth={5} strokeLinecap="round" fill="none" />
        </g>
      </svg>

      <div style={{ position: "absolute", right: width * 0.10, top: doorTop + 10, fontFamily: FONT_STACK, color: WARM, fontSize: 30, fontWeight: 700, opacity: labO, textAlign: "right", maxWidth: 260, textShadow: "0 2px 8px #000" }}>Warm air rushes in the top ↑</div>
      <div style={{ position: "absolute", left: width * 0.10, bottom: height * 0.16, fontFamily: FONT_STACK, color: COLD, fontSize: 30, fontWeight: 700, opacity: labO, maxWidth: 260, textShadow: "0 2px 8px #000" }}>↓ Heavy cold air pours out the bottom</div>
    </AbsoluteFill>
  );
};
