import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// Odometer — un número que RUEDA mecánico (estilo cuentakilómetros) hasta su valor:
// cada dígito es una columna 0-9 que gira y aterriza, con stagger (el de la derecha
// frena último). prefix/suffix/label/eyebrow. Opcional bg image (oscurecida).
const COLD = "#7FB4D8";
const DH = 150; // alto de cada dígito (px)

const Digit: React.FC<{ d: number; prog: number; color: string }> = ({ d, prog, color }) => {
  // gira 2 vueltas + aterriza en d
  const spins = 2;
  const travel = (spins * 10 + d) * DH;
  const y = -travel * prog;
  const col = [];
  for (let k = 0; k <= spins * 10 + d + 1; k++) col.push(k % 10);
  return (
    <div style={{ width: 96, height: DH, overflow: "hidden", position: "relative", display: "inline-block" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, transform: `translateY(${y}px)` }}>
        {col.map((n, i) => (
          <div key={i} style={{ height: DH, lineHeight: `${DH}px`, textAlign: "center", fontFamily: FONT_STACK, fontSize: 130, fontWeight: 900, color }}>{n}</div>
        ))}
      </div>
    </div>
  );
};

export const Odometer: React.FC<{
  durationInFrames: number;
  value: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  eyebrow?: string;
  image?: string;
}> = ({ durationInFrames, value, prefix = "", suffix = "", label = "", eyebrow = "", image }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const digits = String(Math.round(Math.abs(value))).split("").map((c) => +c);
  const color = COLORS.ink;

  const labO = interpolate(frame, [Math.round(durationInFrames * 0.5), Math.round(durationInFrames * 0.62)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: inO * outO, background: image ? undefined : COLORS.bg0, alignItems: "center", justifyContent: "center" }}>
      {image ? (<><Img src={staticFile(image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /><AbsoluteFill style={{ background: "rgba(239,231,211,0.86)" }} /></>) : null}

      {eyebrow ? <div style={{ position: "absolute", top: "26%", fontFamily: FONT_STACK, color: COLD, fontSize: 30, letterSpacing: 5, textTransform: "uppercase", fontWeight: 800 }}>{eyebrow}</div> : null}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {prefix ? <span style={{ fontFamily: FONT_STACK, fontSize: 110, fontWeight: 900, color, marginRight: 6 }}>{prefix}</span> : null}
        {digits.map((d, i) => {
          // stagger: cada dígito (de izq a der) frena un poco más tarde
          const start = 0.08 + i * 0.08;
          const prog = interpolate(frame / durationInFrames, [start, start + 0.42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          return <Digit key={i} d={d} prog={prog} color={color} />;
        })}
        {suffix ? <span style={{ fontFamily: FONT_STACK, fontSize: 84, fontWeight: 800, color, marginLeft: 14 }}>{suffix}</span> : null}
      </div>

      {label ? <div style={{ position: "absolute", top: "66%", maxWidth: 1000, textAlign: "center", fontFamily: FONT_STACK, color: COLORS.ink, fontSize: 38, fontWeight: 600, opacity: labO, padding: "0 40px" }}>{label}</div> : null}
    </AbsoluteFill>
  );
};
