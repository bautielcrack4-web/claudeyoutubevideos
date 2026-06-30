import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { FONT_STACK } from "../theme";

// ColdRadiationSky — EL clímax del hook: visualiza el enfriamiento radiativo nocturno.
// El agua de una bandeja poco profunda IRRADIA su calor hacia el cielo despejado
// (líneas que suben y se pierden en el negro), el aire sigue a 40°F (termómetro
// fijo), y de madrugada el agua CRISTALIZA en hielo. "Imposible" hecho visible.
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 37.7) % 100,
  y: (i * 53.3) % 56,
  r: ((i * 7) % 3) * 0.6 + 0.7,
  ph: (i % 7) / 7,
}));
const COLD = "#7FB4D8";

export const ColdRadiationSky: React.FC<{ durationInFrames: number; airTemp?: string }> = ({
  durationInFrames,
  airTemp = "40°F",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / durationInFrames; // 0..1

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // hielo cristaliza en el último ~40%
  const freeze = interpolate(t, [0.55, 0.95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const trayCx = width * 0.56;
  const trayCy = height * 0.78;
  const trayRx = 240;
  const trayRy = 56;

  // 7 columnas de calor que suben desde la bandeja
  const cols = Array.from({ length: 7 }, (_, i) => trayCx - 180 + i * 60);

  return (
    <AbsoluteFill style={{ opacity: inO * outO }}>
      {/* cielo nocturno */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, #070B16 0%, #0B1426 38%, #122036 66%, #1b2a3c 100%)",
        }}
      />
      {/* estrellas */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {STARS.map((s, i) => {
          const tw = 0.55 + 0.45 * Math.sin((frame / fps) * 1.6 + s.ph * 6.28);
          return (
            <circle
              key={i}
              cx={(s.x / 100) * width}
              cy={(s.y / 100) * height}
              r={s.r}
              fill="#EAF2FF"
              opacity={tw * 0.9}
            />
          );
        })}

        {/* líneas de calor irradiando hacia arriba */}
        {cols.map((cx, i) => {
          const seg = 9;
          const pts = [];
          for (let k = 0; k <= seg; k++) {
            const yy = trayCy - (k / seg) * (trayCy - height * 0.1);
            const wobble = Math.sin((frame / fps) * 2.2 + k * 0.7 + i) * (6 + k * 1.4);
            pts.push(`${cx + wobble},${yy}`);
          }
          return (
            <polyline
              key={i}
              points={pts.join(" ")}
              fill="none"
              stroke="#E8B36A"
              strokeWidth={2.4}
              strokeLinecap="round"
              opacity={interpolate(t, [0, 0.5, 1], [0.0, 0.55, 0.2]) * (1 - freeze * 0.7)}
            />
          );
        })}
        {/* puntas de flecha hacia el cielo */}
        {cols.map((cx, i) => {
          const yTip = height * 0.12 + Math.sin((frame / fps) * 2 + i) * 4;
          const a = interpolate(t, [0.1, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - freeze * 0.7);
          return (
            <path
              key={i}
              d={`M ${cx - 7} ${yTip + 12} L ${cx} ${yTip} L ${cx + 7} ${yTip + 12}`}
              fill="none"
              stroke="#E8B36A"
              strokeWidth={2.4}
              strokeLinecap="round"
              opacity={a * 0.8}
            />
          );
        })}

        {/* bandeja (elipse) */}
        <ellipse cx={trayCx} cy={trayCy} rx={trayRx} ry={trayRy} fill="#0E1A2C" stroke="#2E4660" strokeWidth={6} />
        {/* agua → hielo */}
        <ellipse cx={trayCx} cy={trayCy} rx={trayRx - 10} ry={trayRy - 8}
          fill={freeze > 0.5 ? "#CFE6F4" : "#1C3A57"} opacity={0.92} />
        {/* facetas de hielo al cristalizar */}
        {freeze > 0.15 && Array.from({ length: 9 }).map((_, i) => {
          const ang = (i / 9) * Math.PI * 2;
          const rr = (trayRx - 16) * Math.min(1, freeze * 1.2);
          return (
            <line key={i}
              x1={trayCx} y1={trayCy}
              x2={trayCx + Math.cos(ang) * rr} y2={trayCy + Math.sin(ang) * rr * (trayRy / trayRx)}
              stroke="#FFFFFF" strokeWidth={1.6} opacity={freeze * 0.7} />
          );
        })}
      </svg>

      {/* termómetro fijo en 40°F */}
      <div style={{ position: "absolute", left: width * 0.14, top: height * 0.30, textAlign: "center", fontFamily: FONT_STACK }}>
        <div style={{ width: 26, height: 200, borderRadius: 14, background: "rgba(255,255,255,0.1)", border: "3px solid rgba(255,255,255,0.85)", position: "relative", margin: "0 auto" }}>
          <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", width: 12, height: 96, borderRadius: 8, background: "#D98A3D" }} />
          <div style={{ position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)", width: 34, height: 34, borderRadius: "50%", background: "#D98A3D", border: "3px solid rgba(255,255,255,0.85)" }} />
        </div>
        <div style={{ color: "#F4E6CF", fontSize: 40, fontWeight: 700, marginTop: 22, textShadow: "0 2px 8px #000" }}>Air {airTemp}</div>
        <div style={{ color: "#C9B79A", fontSize: 24 }}>never freezes</div>
      </div>

      {/* labels */}
      <div style={{ position: "absolute", left: trayCx + 60, top: height * 0.30, fontFamily: FONT_STACK, color: "#E8B36A", fontSize: 30, fontWeight: 700, opacity: interpolate(t, [0.1, 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 2px 8px #000" }}>
        Heat escapes ↑ to the cold sky
      </div>
      <div style={{ position: "absolute", left: trayCx - 120, top: trayCy + 72, width: 360, textAlign: "center", fontFamily: FONT_STACK, color: COLD, fontSize: 38, fontWeight: 800, opacity: freeze, textShadow: "0 2px 10px #000", letterSpacing: 1 }}>
        Water freezes by dawn
      </div>
    </AbsoluteFill>
  );
};
