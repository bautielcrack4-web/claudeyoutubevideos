import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// CutawayCallout — corte transversal VECTORIAL (dibujado, no foto → precisión total)
// de la ice house sobre fondo OSCURO (alto contraste), con líneas-guía que se trazan
// una por una hacia cada parte. Tras aparecer, cada etiqueta recibe un RESALTADO ROJO
// que barre por DEBAJO del texto (el texto queda intacto arriba).
const COLD = "#9FC4DA";
const ICE = "#D7ECF7";
const WOOD = "#C9A87A";   // trazos claros (pop sobre oscuro)
const SAW = "#D8B968";
const EARTH = "#7A5A3A";
const HLRED = "#C2412C";  // resaltado rojo fuerte (va DEBAJO del texto)

const CALLOUTS = [
  { ax: 560, ay: 92, lx: 285, ly: 76, label: "Vent — warm air out", at: 0.5, anchorR: true },
  { ax: 470, ay: 150, lx: 285, ly: 190, label: "Thick shaded roof", at: 1.1, anchorR: true },
  { ax: 800, ay: 320, lx: 1075, ly: 300, label: "Double walls + sawdust", at: 1.7, anchorR: true },
  { ax: 560, ay: 330, lx: 285, ly: 365, label: "A great mass of ice", at: 2.3, anchorR: true },
  { ax: 320, ay: 440, lx: 285, ly: 500, label: "North-facing bank", at: 3.5, anchorR: true },
  { ax: 545, ay: 560, lx: 285, ly: 600, label: "Slatted floor + drain", at: 2.9, anchorR: true },
];

export const CutawayCallout: React.FC<{ durationInFrames: number; title?: string }> = ({
  durationInFrames,
  title = "Inside the ice house",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const diagram = spring({ frame, fps, config: { damping: 16, mass: 0.9 }, durationInFrames: 18 });

  const iceBlocks = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) iceBlocks.push({ x: 430 + c * 60, y: 250 + r * 62 });

  return (
    <AbsoluteFill style={{ opacity: inO * outO, background: "linear-gradient(160deg, #221D16 0%, #2C2519 55%, #342B1C 100%)", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: FONT_STACK }}>
        <div style={{ color: COLD, fontSize: 26, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700 }}>Cross-section</div>
        <div style={{ color: "#F4E6CF", fontSize: 52, fontWeight: 800, marginTop: 2 }}>{title}</div>
      </div>

      <svg viewBox="0 0 1100 720" width={width * 0.94} height={height * 0.82} style={{ marginTop: 60 }}>
        <g style={{ opacity: diagram, transform: `scale(${interpolate(diagram, [0, 1], [0.96, 1])})`, transformOrigin: "center" }}>
          {/* tierra / banco norte */}
          <path d="M 300 200 Q 250 240 280 720 L 300 720 L 300 200 Z" fill={EARTH} opacity={0.85} />
          <rect x={300} y={180} width={520} height={520} fill="#F0E6CF" stroke={WOOD} strokeWidth={3} />
          {/* techo a dos aguas + vent */}
          <path d="M 300 180 L 560 80 L 820 180 Z" fill={WOOD} />
          <rect x={545} y={86} width={30} height={26} fill="#221D16" stroke={WOOD} strokeWidth={2} />
          {/* doble pared (gap = aserrín) */}
          {[[300, 318], [802, 820]].map(([x0, x1], i) => (
            <g key={i}>
              <rect x={x0} y={180} width={x1 - x0} height={520} fill={SAW} opacity={0.7} />
              <line x1={x0} y1={180} x2={x0} y2={700} stroke={WOOD} strokeWidth={3} />
              <line x1={x1} y1={180} x2={x1} y2={700} stroke={WOOD} strokeWidth={3} />
            </g>
          ))}
          {/* aserrín superior */}
          <rect x={318} y={200} width={484} height={46} fill={SAW} />
          {/* bloques de hielo */}
          {iceBlocks.map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={54} height={56} rx={4} fill={ICE} stroke="#9FC4DA" strokeWidth={2} />
          ))}
          {/* aserrín inferior */}
          <rect x={318} y={500} width={484} height={40} fill={SAW} />
          {/* piso de listones + drenaje */}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1={322 + i * 54} y1={540} x2={322 + i * 54} y2={580} stroke={WOOD} strokeWidth={3} />
          ))}
          <line x1={318} y1={580} x2={560} y2={600} stroke={WOOD} strokeWidth={4} />
          <line x1={802} y1={580} x2={560} y2={600} stroke={WOOD} strokeWidth={4} />
          <path d="M 555 600 L 560 640 L 565 600 Z" fill={COLD} />
          <path d="M 552 642 L 560 660 L 568 642" fill="none" stroke={COLD} strokeWidth={3} />
        </g>

        {/* callouts: línea que se traza + RESALTADO rojo (debajo) + etiqueta */}
        {CALLOUTS.map((c, i) => {
          const draw = interpolate(frame, [c.at * fps, c.at * fps + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const labO = interpolate(frame, [c.at * fps + 6, c.at * fps + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const x = interpolate(draw, [0, 1], [c.ax, c.lx]);
          const y = interpolate(draw, [0, 1], [c.ay, c.ly]);
          const tx = c.anchorR ? c.lx - 8 : c.lx + 8;
          const tw = c.label.length * 13.4 + 22; // ancho estimado del texto + padding
          // resaltado: barre DESPUÉS de la etiqueta, con borde fijo del lado del anclaje
          const hl = interpolate(frame, [c.at * fps + 15, c.at * fps + 27], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          const hx = c.anchorR ? tx - tw * hl : tx;
          return (
            <g key={i}>
              <circle cx={c.ax} cy={c.ay} r={5} fill={HLRED} opacity={draw} />
              <line x1={c.ax} y1={c.ay} x2={x} y2={y} stroke="#E6D9BE" strokeWidth={2} opacity={draw * 0.9} />
              {/* RESALTADO rojo (debajo del texto) */}
              <rect x={c.anchorR ? hx : tx} y={c.ly - 22} width={tw * hl} height={34} rx={7} fill={HLRED} opacity={0.92 * hl} />
              <text x={tx} y={c.ly + 4} textAnchor={c.anchorR ? "end" : "start"} fontFamily={FONT_STACK} fontSize={25} fontWeight={700} fill="#FBF4E4" opacity={labO}>{c.label}</text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
