import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";

// ── COMPONENTE A MEDIDA (video ollas / riego con olla de barro enterrada) ───────
// Corte transversal animado: una olla de barro porosa enterrada hasta el cuello,
// llena de agua, tapada con una piedra, con dos plantas alrededor cuyas raíces se
// enroscan al barro. Dos modos con las MISMAS piezas:
//   "anatomy" → etiqueta cada parte (tapa, barro poroso, agua, raíces).
//   "flow"    → el agua sale por los poros hacia la tierra SECA y las raíces beben;
//                la tierra húmeda frena la salida. Cartel "−70% agua".
const CLAY = "#b5703f", CLAY2 = "#9a5a30", CLAY_DK = "#7a4628";
const WATER = COLORS.cold, GREEN = COLORS.good, SOIL = "#3a2b1c", SOIL_DRY = "#7a5a36", STONE = "#8d8378";

export const OllaDiagram: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  mode?: "anatomy" | "flow";
}> = ({ durationInFrames, eyebrow, title, mode = "anatomy" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });

  // geometría (viewBox 1600x900)
  const groundY = 470;
  const cx = 800;
  // contorno de la olla (vasija) — boca arriba (en el cuello), panza abajo
  const POT = `M ${cx - 95} ${groundY + 10}
    C ${cx - 150} ${groundY + 70}, ${cx - 170} ${groundY + 250}, ${cx - 120} ${groundY + 360}
    C ${cx - 70} ${groundY + 440}, ${cx + 70} ${groundY + 440}, ${cx + 120} ${groundY + 360}
    C ${cx + 170} ${groundY + 250}, ${cx + 150} ${groundY + 70}, ${cx + 95} ${groundY + 10} Z`;
  const potTop = groundY + 10, potBot = groundY + 430;

  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });
  const Label: React.FC<{ x: number; y: number; text: string; at: number; color?: string; anchor?: "start" | "middle" | "end" }> = ({ x, y, text, at, color = COLORS.text, anchor = "start" }) => {
    const s = lab(at);
    return (
      <g opacity={s} transform={`translate(${x} ${y + (1 - s) * 12})`} textAnchor={anchor}>
        <text fontSize={36} fontWeight={900} fill={color} fontFamily={FONT_STACK} style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 6 }}>{text}</text>
      </g>
    );
  };
  const Lead: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; color: string }> = ({ x1, y1, x2, y2, at, color }) => {
    const s = lab(at);
    return <line x1={x1} y1={y1} x2={interpolate(s, [0, 1], [x1, x2])} y2={interpolate(s, [0, 1], [y1, y2])} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={s} />;
  };

  // poros en la pared de la olla
  const pores: [number, number][] = [];
  for (let r = 0; r < 7; r++) for (const sgn of [-1, 1]) {
    const yy = potTop + 70 + r * 48;
    const xx = cx + sgn * (150 - Math.abs(r - 3) * 10);
    pores.push([xx, yy]);
  }
  // animación
  const waterFill = interpolate(frame, [sec(0.6), sec(2.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seep = interpolate(frame, [sec(2.4), sec(5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const waterTopY = interpolate(waterFill, [0, 1], [potBot - 20, potTop + 60]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={50} glowY={24} hue="amber" drift={0.3} />
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
            {/* sol suave */}
            <circle cx={1360} cy={120} r={52} fill={COLORS.amber} opacity={0.85} />
            {/* aire arriba del suelo */}
            <rect x={0} y={0} width={1600} height={groundY} fill="none" />
            {/* suelo: seco arriba, más húmedo cerca de la olla en modo flow */}
            <rect x={0} y={groundY} width={1600} height={900 - groundY} fill={mode === "flow" ? SOIL_DRY : SOIL} />
            {mode === "flow" && (
              <ellipse cx={cx} cy={groundY + 230} rx={interpolate(seep, [0, 1], [180, 430])} ry={interpolate(seep, [0, 1], [120, 280])} fill={SOIL} opacity={0.7 * seep} />
            )}
            <line x1={0} y1={groundY} x2={1600} y2={groundY} stroke="#1d160d" strokeWidth={4} />

            <defs>
              <clipPath id="potClip"><path d={POT} /></clipPath>
            </defs>

            {/* agua dentro de la olla */}
            <g clipPath="url(#potClip)">
              <rect x={cx - 200} y={potTop} width={400} height={potBot - potTop + 20} fill={CLAY_DK} />
              <rect x={cx - 200} y={waterTopY} width={400} height={potBot - waterTopY + 20} fill={WATER} opacity={0.7} />
              {/* brillo del agua */}
              <ellipse cx={cx - 30} cy={waterTopY + 30} rx={70} ry={14} fill="#fff" opacity={0.18 * waterFill} />
            </g>
            {/* pared de la olla */}
            <path d={POT} fill="none" stroke={CLAY} strokeWidth={26} />
            <path d={POT} fill="none" stroke={CLAY2} strokeWidth={6} opacity={0.7} />
            {/* poros */}
            {pores.map(([x, y], i) => (
              <circle key={"p" + i} cx={x} cy={y} r={4} fill={CLAY_DK} opacity={0.9} />
            ))}

            {/* tapa de piedra sobre la boca */}
            <ellipse cx={cx} cy={potTop - 6} rx={120} ry={26} fill={STONE} stroke="#6f665c" strokeWidth={4} />
            <ellipse cx={cx} cy={potTop - 12} rx={120} ry={22} fill="#9b9085" />

            {/* plantas alrededor (izq y der) con raíces hacia la olla */}
            {[-1, 1].map((sgn) => {
              const px = cx + sgn * 340;
              return (
                <g key={"pl" + sgn}>
                  <line x1={px} y1={groundY} x2={px} y2={groundY - 120} stroke="#2f5a23" strokeWidth={7} />
                  <path d={`M ${px} ${groundY - 120} C ${px - 40} ${groundY - 150}, ${px - 55} ${groundY - 195}, ${px - 20} ${groundY - 215} C ${px - 5} ${groundY - 175}, ${px - 2} ${groundY - 150}, ${px} ${groundY - 120}`} fill={GREEN} />
                  <path d={`M ${px} ${groundY - 120} C ${px + 40} ${groundY - 150}, ${px + 55} ${groundY - 195}, ${px + 20} ${groundY - 215} C ${px + 5} ${groundY - 175}, ${px + 2} ${groundY - 150}, ${px} ${groundY - 120}`} fill={GREEN} opacity={0.92} />
                  {/* raíces que se enroscan hacia la olla */}
                  {[0, 1, 2].map((k) => (
                    <path key={k} d={`M ${px} ${groundY} C ${px - sgn * 60} ${groundY + 120 + k * 40}, ${cx + sgn * (210 + k * 6)} ${potTop + 120 + k * 70}, ${cx + sgn * (150 - k * 4)} ${potTop + 150 + k * 80}`} fill="none" stroke="#caa46a" strokeWidth={3.5} opacity={0.9} />
                  ))}
                </g>
              );
            })}

            {/* MODO FLOW: gotas que salen por los poros hacia la tierra y a las raíces */}
            {mode === "flow" && (
              <g>
                {pores.map(([x, y], i) => {
                  const sgn = x > cx ? 1 : -1;
                  const p = ((frame * 2.4 + i * 18) % 90) / 90;
                  const xx = x + sgn * p * 70;
                  const op = seep * (1 - p) * 0.85;
                  return <circle key={"s" + i} cx={xx} cy={y + p * 8} r={5} fill={WATER} opacity={op} />;
                })}
              </g>
            )}

            {/* ETIQUETAS */}
            {mode === "anatomy" ? (
              <g>
                <Lead x1={cx + 150} y1={potTop - 12} x2={cx + 120} y2={potTop - 10} at={0.4} color={STONE} />
                <Label x={cx + 170} y={potTop - 4} text="Tapa (sin evaporación)" at={0.4} color="#b8ada0" />
                <Lead x1={cx - 200} y1={potTop + 160} x2={cx - 150} y2={potTop + 160} at={1.1} color={CLAY} />
                <Label x={cx - 220} y={potTop + 170} text="Barro poroso" at={1.1} color={CLAY} anchor="end" />
                <Lead x1={cx + 210} y1={potTop + 260} x2={cx + 60} y2={potTop + 260} at={1.8} color={WATER} />
                <Label x={cx + 230} y={potTop + 270} text="Agua adentro" at={1.8} color={WATER} />
                <Lead x1={cx - 470} y1={potTop + 330} x2={cx - 320} y2={potTop + 330} at={2.5} color="#caa46a" />
                <Label x={cx - 490} y={potTop + 340} text="Raíces pegadas al barro" at={2.5} color="#caa46a" anchor="end" />
              </g>
            ) : (
              <g>
                <Label x={cx} y={groundY - 250} text="−70% de agua" at={2.6} color={WATER} anchor="middle" />
                <Lead x1={cx + 210} y1={potTop + 220} x2={cx + 80} y2={potTop + 220} at={0.8} color={WATER} />
                <Label x={cx + 230} y={potTop + 230} text="Sale solo si la tierra está seca" at={0.8} color={WATER} />
              </g>
            )}
          </svg>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
