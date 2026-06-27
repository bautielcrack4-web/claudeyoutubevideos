import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";

// ── COMPONENTE A MEDIDA (video hugel / cama de troncos enterrados) ──────────────
// Corte transversal animado del montículo: de abajo hacia arriba, troncos gruesos →
// ramas → verde (hojas/pasto) → estiércol → tierra, con una planta arriba y raíces
// que bajan. Dos modos con las MISMAS piezas:
//   "anatomy" → etiqueta cada capa en secuencia (qué hay debajo).
//   "flow"    → llueve, la MADERA se llena de agua (azul) como esponja y el agua
//                SUBE a las raíces de a gotas (wicking). Todo SVG, siempre vivo.
const WOOD = "#7a4f2a", WOOD2 = "#9a6a3a", BRANCH = "#8a5a30";
const GREEN = COLORS.good, MANURE = "#5a3f28", SOIL = "#3a2b1c", WATER = COLORS.cold;

export const HugelDiagram: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  mode?: "anatomy" | "flow";
}> = ({ durationInFrames, eyebrow, title, mode = "anatomy" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });

  // geometría (viewBox 1600x900)
  const groundY = 600;
  // contorno del montículo (loma) por encima del suelo
  const MOUND = `M 300 ${groundY} C 360 300, 620 200, 800 200 C 980 200, 1240 300, 1300 ${groundY} Z`;

  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });
  const Label: React.FC<{ x: number; y: number; text: string; at: number; color?: string; anchor?: "start" | "middle" | "end" }> = ({ x, y, text, at, color = COLORS.text, anchor = "start" }) => {
    const s = lab(at);
    return (
      <g opacity={s} transform={`translate(${x} ${y + (1 - s) * 12})`} textAnchor={anchor}>
        <text fontSize={38} fontWeight={900} fill={color} fontFamily={FONT_STACK} style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 6 }}>{text}</text>
      </g>
    );
  };
  // línea conectora etiqueta → punto
  const Lead: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; color: string }> = ({ x1, y1, x2, y2, at, color }) => {
    const s = lab(at);
    return <line x1={x1} y1={y1} x2={interpolate(s, [0, 1], [x1, x2])} y2={interpolate(s, [0, 1], [y1, y2])} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={s} />;
  };

  // logs (troncos) en la base
  const logs = [[520, 520], [640, 510], [760, 505], [880, 508], [1000, 515], [1090, 525]];
  // animación de agua (modo flow)
  const fill = interpolate(frame, [sec(0.8), sec(3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = interpolate(frame, [sec(2.6), sec(5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={50} glowY={26} hue="amber" drift={0.3} />
      <SfxCue at={0} src={SFX.whoosh} volume={0.4} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "92%", maxWidth: 1600, opacity: enter, transform: `translateY(${(1 - enter) * 24}px)`, fontFamily: FONT_STACK }}>
          {(eyebrow || title) && (
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              {eyebrow && <div style={{ letterSpacing: 5, fontSize: 20, fontWeight: 700, textTransform: "uppercase", color: COLORS.amber }}>{eyebrow}</div>}
              {title && <div style={{ fontSize: 50, fontWeight: 800, color: COLORS.text }}>{title}</div>}
            </div>
          )}
          <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
            {/* cielo / sol suave */}
            <circle cx={1340} cy={150} r={56} fill={COLORS.amber} opacity={0.85} />
            {/* suelo */}
            <rect x={0} y={groundY} width={1600} height={300} fill="#2e2316" />
            <line x1={0} y1={groundY} x2={1600} y2={groundY} stroke="#1d160d" strokeWidth={4} />

            <defs>
              <clipPath id="moundClip"><path d={MOUND} /></clipPath>
            </defs>

            {/* capas dentro del montículo (recortadas a la loma) */}
            <g clipPath="url(#moundClip)">
              {/* tierra (toda la loma de base) */}
              <rect x={250} y={180} width={1100} height={440} fill={SOIL} />
              {/* estiércol */}
              <rect x={250} y={300} width={1100} height={70} fill={MANURE} />
              {/* verde */}
              <rect x={250} y={370} width={1100} height={55} fill={GREEN} opacity={0.85} />
              {/* ramas */}
              {[[480, 440], [560, 455], [700, 448], [840, 452], [980, 446], [1080, 458]].map(([x, y], i) => (
                <line key={i} x1={x - 55} y1={y} x2={x + 55} y2={y + 6} stroke={BRANCH} strokeWidth={10} strokeLinecap="round" />
              ))}
              {/* troncos (esponja) — se llenan de agua en modo flow */}
              {logs.map(([x, y], i) => (
                <g key={i}>
                  <ellipse cx={x} cy={y} rx={62} ry={40} fill={WOOD} stroke={WOOD2} strokeWidth={4} />
                  <ellipse cx={x} cy={y} rx={30} ry={18} fill="none" stroke={WOOD2} strokeWidth={3} opacity={0.7} />
                  {mode === "flow" && (
                    <ellipse cx={x} cy={y} rx={62 * fill} ry={40 * fill} fill={WATER} opacity={0.45} />
                  )}
                </g>
              ))}
            </g>
            {/* contorno del montículo */}
            <path d={MOUND} fill="none" stroke="#1d160d" strokeWidth={4} />

            {/* planta arriba + raíces */}
            <g>
              <path d="M 800 200 C 770 150, 760 110, 800 70 C 840 110, 830 150, 800 200" fill={GREEN} />
              <path d="M 800 130 C 750 120, 730 95, 720 75 C 760 80, 790 100, 800 130" fill={GREEN} opacity={0.9} />
              <path d="M 800 130 C 850 120, 870 95, 880 75 C 840 80, 810 100, 800 130" fill={GREEN} opacity={0.9} />
              <line x1={800} y1={200} x2={800} y2={70} stroke="#2f5a23" strokeWidth={6} />
              {/* raíces bajando hacia los troncos */}
              {[[800, 740, 360], [760, 700, 470], [840, 700, 500]].map(([sx, sy, sxx], i) => (
                <path key={i} d={`M 800 205 C ${sx} 320, ${sxx} 420, ${sx} ${sy}`} fill="none" stroke="#caa46a" strokeWidth={3.5} opacity={0.9} />
              ))}
            </g>

            {/* MODO FLOW: lluvia que cae + gotas que SUBEN de la madera a las raíces */}
            {mode === "flow" && (
              <g>
                {[420, 560, 700, 900, 1050, 1180].map((x, i) => {
                  const t = (frame * 6 + i * 40) % 260;
                  const op = interpolate(frame, [sec(0.4), sec(0.9), sec(2.8), sec(3.3)], [0, 0.8, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return <line key={"r" + i} x1={x} y1={30 + t} x2={x} y2={70 + t} stroke={WATER} strokeWidth={4} strokeLinecap="round" opacity={op} />;
                })}
                {/* gotas subiendo (wicking) de los troncos a la planta */}
                {logs.slice(0, 5).map(([x, y], i) => {
                  const p = ((frame * 3 + i * 30) % 120) / 120;
                  const yy = interpolate(p, [0, 1], [y, 220]);
                  const xx = interpolate(p, [0, 1], [x, 800]);
                  return <circle key={"u" + i} cx={xx} cy={yy} r={6} fill={WATER} opacity={rise * (1 - p) * 0.9} />;
                })}
              </g>
            )}

            {/* ETIQUETAS */}
            {mode === "anatomy" ? (
              <g>
                <Lead x1={1150} y1={520} x2={1090} y2={520} at={0.5} color={WOOD2} />
                <Label x={1170} y={530} text="Troncos = esponja" at={0.5} color={WOOD2} />
                <Lead x1={1150} y1={450} x2={1080} y2={452} at={1.2} color={BRANCH} />
                <Label x={1170} y={460} text="Ramas" at={1.2} color={BRANCH} />
                <Lead x1={300} y1={395} x2={420} y2={397} at={1.9} color="#3f7a2a" />
                <Label x={290} y={405} text="Hojas y pasto" at={1.9} color="#3f7a2a" anchor="end" />
                <Lead x1={300} y1={330} x2={420} y2={332} at={2.5} color={MANURE} />
                <Label x={290} y={340} text="Estiércol" at={2.5} color="#6a4a2c" anchor="end" />
                <Lead x1={300} y1={250} x2={420} y2={252} at={3.1} color="#5a4632" />
                <Label x={290} y={260} text="Tierra — y plantás" at={3.1} color="#5a4632" anchor="end" />
              </g>
            ) : (
              <g>
                <Label x={800} y={150} text="El agua sube sola" at={2.8} color={WATER} anchor="middle" />
                <Lead x1={1150} y1={520} x2={1090} y2={520} at={0.6} color={WATER} />
                <Label x={1170} y={530} text="La madera bebe la lluvia" at={0.6} color={WATER} />
              </g>
            )}
          </svg>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
