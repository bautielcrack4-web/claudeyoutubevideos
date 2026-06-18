import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";

// ── COMPONENTE A MEDIDA (video acpipe / earth tube) ──────────────────────────
// Corte transversal animado del sistema: el sol castiga arriba, el aire CALIENTE
// entra por la toma sombreada (derecha), BAJA 8 ft, recorre el caño enterrado a
// través del suelo a temperatura constante (~55°F) y sale FRÍO por la rejilla del
// piso de la casa (izquierda). El aire se anima como guiones que fluyen por el caño
// y el color del caño va de rojo→azul (se enfría). Sirve en dos modos con las mismas
// piezas: "flow" (cómo funciona, con temperaturas) y "anatomy" (etiquetas de obra:
// pendiente, pozo de drenaje, malla). NO usa imágenes — todo SVG, siempre vivo.
type Tag = { text: string; sub?: string };
export const EarthTubeDiagram: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  intake?: Tag; // toma exterior (derecha)
  soil?: Tag; // banda de suelo
  out?: Tag; // salida en la casa (izquierda)
  depthTag?: string; // "8 ft"
  lengthTag?: string; // "90 ft"
  drainTag?: string; // opcional: "Drain pit" en el punto bajo
  hotColor?: string;
  coldColor?: string;
}> = ({
  durationInFrames,
  eyebrow,
  title,
  intake = { text: "95°F in", sub: "hot outside air" },
  soil = { text: "Soil ~55°F", sub: "never changes, all year" },
  out = { text: "56°F out", sub: "into the house" },
  depthTag = "8 ft deep",
  lengthTag = "90 ft long",
  drainTag,
  hotColor = COLORS.danger,
  coldColor = COLORS.cold,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });

  // geometría (viewBox 1600x900)
  const groundY = 360;
  const houseX = 250, ventX = 360, ventY = groundY;
  const intakeX = 1330;
  const pipeY = 660; // tramo horizontal enterrado
  // recorrido del aire: toma (arriba der) → baja → horizontal → sube a la rejilla
  const PIPE = `M ${intakeX} 250 L ${intakeX} ${pipeY} L ${ventX} ${pipeY} L ${ventX} ${ventY}`;
  const draw = spring({ frame: frame - 6, fps, config: { damping: 200, mass: 1, stiffness: 38 } });
  const flow = interpolate(frame, [0, fps * 4], [0, -240], { extrapolateRight: "extend" });

  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });
  const Label: React.FC<{ x: number; y: number; t: Tag | { text: string; sub?: string }; at: number; color?: string; anchor?: string }> = ({ x, y, t, at, color = COLORS.text, anchor = "middle" }) => {
    const s = lab(at);
    return (
      <g opacity={s} transform={`translate(${x} ${y + (1 - s) * 12})`} textAnchor={anchor as "middle"}>
        <text fontSize={40} fontWeight={900} fill={color} fontFamily={FONT_STACK}>{t.text}</text>
        {t.sub && <text y={34} fontSize={23} fontWeight={600} fill={COLORS.textDim} fontFamily={FONT_STACK}>{t.sub}</text>}
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={50} glowY={28} hue="amber" drift={0.3} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "92%", maxWidth: 1600, opacity: enter, transform: `translateY(${(1 - enter) * 26}px)` }}>
          {(eyebrow || title) && (
            <div style={{ textAlign: "center", marginBottom: 10, fontFamily: FONT_STACK }}>
              {eyebrow && <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 800, textTransform: "uppercase", color: COLORS.amber }}>{eyebrow}</div>}
              {title && <div style={{ fontSize: 52, fontWeight: 900, color: COLORS.text, marginTop: 4 }}>{title}</div>}
            </div>
          )}
          <svg viewBox="0 0 1600 900" style={{ width: "100%", height: "auto" }}>
            <defs>
              <linearGradient id="et_air" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={coldColor} />
                <stop offset="100%" stopColor={hotColor} />
              </linearGradient>
              <radialGradient id="et_sun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.95} />
                <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
              </radialGradient>
            </defs>

            {/* cielo / suelo */}
            <rect x={0} y={0} width={1600} height={groundY} fill={COLORS.bg1} opacity={0.45} />
            <rect x={0} y={groundY} width={1600} height={900 - groundY} fill="#5c4a30" opacity={0.32} />
            <rect x={0} y={groundY} width={1600} height={900 - groundY} fill="url(#et_air)" opacity={0.04} />
            <line x1={0} y1={groundY} x2={1600} y2={groundY} stroke={COLORS.bg2} strokeWidth={3} />
            {/* banda de suelo profundo a temperatura constante */}
            <rect x={0} y={pipeY - 46} width={1600} height={120} fill={coldColor} opacity={0.1 + 0.05 * Math.sin(frame / 18)} />

            {/* sol */}
            <circle cx={150} cy={120} r={120} fill="url(#et_sun)" opacity={lab(0.2)} />
            <circle cx={150} cy={120} r={46} fill={COLORS.amber} opacity={lab(0.2)} />

            {/* casa + rejilla de piso */}
            <g opacity={lab(0.4)}>
              <rect x={houseX - 120} y={groundY - 250} width={300} height={250} rx={8} fill={COLORS.bg2} opacity={0.5} stroke={COLORS.text} strokeWidth={2} />
              <path d={`M ${houseX - 140} ${groundY - 250} L ${houseX + 30} ${groundY - 350} L ${houseX + 200} ${groundY - 250} Z`} fill={COLORS.bg2} opacity={0.6} stroke={COLORS.text} strokeWidth={2} />
              <rect x={ventX - 34} y={ventY - 16} width={68} height={16} rx={3} fill={coldColor} />
            </g>

            {/* toma exterior sombreada (árbol simple) */}
            <g opacity={lab(0.3)}>
              <circle cx={intakeX} cy={170} r={86} fill={COLORS.good} opacity={0.28} />
              <rect x={intakeX - 16} y={210} width={32} height={56} fill="#6b4f2e" opacity={0.6} />
              <rect x={intakeX - 22} y={196} width={44} height={18} rx={4} fill={COLORS.text} opacity={0.5} />
            </g>

            {/* el caño (recorrido) — base + trazo de color que se dibuja */}
            <path d={PIPE} fill="none" stroke={COLORS.bg2} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
            <path
              d={PIPE}
              fill="none"
              stroke="url(#et_air)"
              strokeWidth={18}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - draw}
            />
            {/* aire que fluye (guiones en movimiento de la toma hacia la salida) */}
            <path
              d={PIPE}
              fill="none"
              stroke={COLORS.bg0}
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray="2 34"
              strokeDashoffset={flow}
              opacity={0.6 * draw}
            />

            {/* marcador de profundidad */}
            <g opacity={lab(0.9)} stroke={COLORS.textDim} strokeWidth={2}>
              <line x1={intakeX + 70} y1={groundY} x2={intakeX + 70} y2={pipeY} />
              <line x1={intakeX + 60} y1={groundY} x2={intakeX + 80} y2={groundY} />
              <line x1={intakeX + 60} y1={pipeY} x2={intakeX + 80} y2={pipeY} />
            </g>
            <text x={intakeX + 92} y={(groundY + pipeY) / 2 + 8} fontSize={30} fontWeight={800} fill={COLORS.textDim} fontFamily={FONT_STACK} opacity={lab(0.9)}>{depthTag}</text>

            {/* etiquetas */}
            <Label x={intakeX} y={300} t={intake} at={0.5} color={hotColor} />
            <Label x={800} y={pipeY + 92} t={soil} at={0.8} color={coldColor} />
            <Label x={ventX} y={ventY - 60} t={out} at={1.1} color={coldColor} />
            <text x={800} y={pipeY - 64} fontSize={26} fontWeight={800} fill={COLORS.textDim} fontFamily={FONT_STACK} textAnchor="middle" opacity={lab(1.0)}>{lengthTag}</text>
            {drainTag && (
              <g opacity={lab(1.3)}>
                <circle cx={ventX} cy={pipeY + 30} r={16} fill={COLORS.amber} opacity={0.8} />
                <text x={ventX + 28} y={pipeY + 40} fontSize={26} fontWeight={800} fill={COLORS.amber} fontFamily={FONT_STACK}>{drainTag}</text>
              </g>
            )}
          </svg>
        </div>
      </AbsoluteFill>
      <SfxCue at={6} src={SFX.popUp} volume={0.4} />
      <SfxCue at={sec(1.1)} src={SFX.ui5} volume={0.4} />
    </AbsoluteFill>
  );
};
