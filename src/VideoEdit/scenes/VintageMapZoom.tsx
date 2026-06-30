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

// VintageMapZoom — mapa de pergamino que hace PUSH-IN hacia un punto, con pin que
// cae + late, ruta punteada que se traza y etiqueta. Aesthetic aged-paper.
//   image: mapa · pinX/pinY: 0..1 destino · label/eyebrow · zoom (escala final)
const COLD = "#7FB4D8";

export const VintageMapZoom: React.FC<{
  durationInFrames: number;
  image: string;
  pinX?: number;
  pinY?: number;
  label?: string;
  eyebrow?: string;
  zoom?: number;
}> = ({ durationInFrames, image, pinX = 0.62, pinY = 0.52, label = "", eyebrow = "", zoom = 1.85 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / durationInFrames;

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(t, [0, 0.85], [1.0, zoom], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const pinDrop = spring({ frame: frame - Math.round(durationInFrames * 0.32), fps, config: { damping: 11, mass: 0.7 }, durationInFrames: 16 });
  const pulse = 0.6 + 0.4 * Math.sin((frame / fps) * 4);
  const labO = interpolate(t, [0.42, 0.58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const route = interpolate(t, [0.2, 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const px = pinX * width;
  const py = pinY * height;

  return (
    <AbsoluteFill style={{ opacity: inO * outO, background: "#2A2620", overflow: "hidden" }}>
      {/* mapa con push-in hacia el pin */}
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: `${pinX * 100}% ${pinY * 100}%` }}>
        <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.35) saturate(0.85)" }} />
      </AbsoluteFill>
      {/* viñeta de pergamino */}
      <AbsoluteFill style={{ background: "radial-gradient(70% 70% at 50% 50%, rgba(0,0,0,0), rgba(30,22,14,0.55))", pointerEvents: "none" }} />

      {/* ruta punteada que se traza hacia el pin */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <line x1={width * 0.12} y1={height * 0.82} x2={px} y2={py}
          stroke={COLORS.danger} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round"
          pathLength={1} style={{ strokeDasharray: "10", strokeDashoffset: 1 - route }} opacity={0.85} />
        {/* pin */}
        <g transform={`translate(${px} ${py})`} opacity={pinDrop}>
          <circle cx={0} cy={0} r={26 + pulse * 18} fill="none" stroke={COLORS.danger} strokeWidth={2} opacity={(1 - pulse) * 0.7} />
          <path d={`M 0 ${interpolate(pinDrop, [0, 1], [-40, 0])} m 0 -34 a 17 17 0 1 1 -0.1 0 Z`} fill={COLORS.danger} transform={`translate(0 ${interpolate(pinDrop, [0, 1], [-40, 0])})`} />
          <circle cx={0} cy={-34} r={7} fill="#FBF1E0" />
        </g>
      </svg>

      {/* eyebrow / label */}
      {eyebrow ? <div style={{ position: "absolute", top: 80, width: "100%", textAlign: "center", fontFamily: FONT_STACK, color: "#F4E6CF", fontSize: 30, letterSpacing: 5, textTransform: "uppercase", fontWeight: 800, textShadow: "0 2px 10px #000", opacity: labO }}>{eyebrow}</div> : null}
      {label ? (
        <div style={{ position: "absolute", left: px, top: py + 18, transform: "translateX(-50%)", fontFamily: FONT_STACK, color: COLORS.ink, background: "rgba(244,230,207,0.95)", padding: "8px 22px", borderRadius: 12, fontSize: 34, fontWeight: 800, opacity: labO, boxShadow: "0 8px 24px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>{label}</div>
      ) : null}
    </AbsoluteFill>
  );
};
