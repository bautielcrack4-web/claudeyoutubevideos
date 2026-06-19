import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";

// ── COMPONENTE A MEDIDA (video luz) ──────────────────────────────────────────
// La llama (izq) tira rayos que se ABREN en todas direcciones (débiles); un GLOBO
// de agua en el medio actúa de lente: los rayos se DOBLAN y CONVERGEN en una poza
// de luz brillante sobre el trabajo (der). Animado: los rayos crecen desde la llama,
// pasan por el globo, y la poza pulsa brillante. Etiquetas. Sin imágenes — SVG.
export const WaterLensLight: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  flameLabel?: string;
  lensLabel?: string;
  poolLabel?: string;
}> = ({
  durationInFrames,
  eyebrow,
  title,
  flameLabel = "One small flame",
  lensLabel = "Globe of water = a lens",
  poolLabel = "Bright pool of light",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });
  const flicker = 1 + Math.sin(frame / 5) * 0.06 + Math.sin(frame / 3.3) * 0.03;

  // geometría (viewBox 1600x900)
  const flameX = 320, flameY = 450;
  const lensX = 800, lensY = 450, lensR = 120;
  const poolX = 1300, poolY = 450;
  const draw = spring({ frame: frame - 8, fps, config: { damping: 200, mass: 1, stiffness: 30 } });

  // rayos: desde la llama se abren; tras el globo convergen a la poza
  const rays = [-1, -0.5, 0, 0.5, 1];
  const conv = Math.min(1, draw); // 0..1 cuánto convergen

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={50} glowY={40} hue="amber" drift={0.3} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "92%", maxWidth: 1600, opacity: enter, transform: `translateY(${(1 - enter) * 26}px)` }}>
          {(eyebrow || title) && (
            <div style={{ textAlign: "center", marginBottom: 8, fontFamily: FONT_STACK }}>
              {eyebrow && <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 800, textTransform: "uppercase", color: COLORS.amber }}>{eyebrow}</div>}
              {title && <div style={{ fontSize: 50, fontWeight: 900, color: COLORS.text, marginTop: 4 }}>{title}</div>}
            </div>
          )}
          <svg viewBox="0 0 1600 900" style={{ width: "100%", height: "auto" }}>
            <defs>
              <radialGradient id="wl_pool" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.95} />
                <stop offset="70%" stopColor={COLORS.amber} stopOpacity={0.3} />
                <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
              </radialGradient>
              <radialGradient id="wl_flame" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.9} />
                <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
              </radialGradient>
            </defs>

            {/* rayos llama→globo (se abren) y globo→poza (convergen) */}
            {rays.map((r, i) => {
              const yL = lensY + r * lensR * 0.9; // entrada al globo
              const yEnd = poolY + r * 8 * (1 - conv); // tras converger ~al punto
              const op = (0.18 + 0.12 * Math.abs(r === 0 ? 1 : 0.6)) * draw;
              return (
                <g key={i}>
                  <line x1={flameX + 20} y1={flameY} x2={lensX - lensR} y2={yL} stroke={COLORS.amber} strokeWidth={3} opacity={op * 0.6} />
                  <line x1={lensX + lensR} y1={yL} x2={poolX - 60} y2={yEnd} stroke={COLORS.amber} strokeWidth={4} opacity={op} />
                </g>
              );
            })}

            {/* la llama */}
            <g opacity={lab(0.2)}>
              <circle cx={flameX} cy={flameY} r={70 * flicker} fill="url(#wl_flame)" />
              <ellipse cx={flameX} cy={flameY - 6} rx={14} ry={26 * flicker} fill={COLORS.amber} />
              <rect x={flameX - 10} y={flameY + 20} width={20} height={70} rx={4} fill={COLORS.bg2} />
            </g>

            {/* el globo de agua (lente) */}
            <g opacity={lab(0.5)}>
              <circle cx={lensX} cy={lensY} r={lensR} fill={COLORS.cold} opacity={0.16} stroke={COLORS.cold} strokeWidth={3} />
              <ellipse cx={lensX - 34} cy={lensY - 38} rx={26} ry={40} fill="#ffffff" opacity={0.18} />
            </g>

            {/* la poza de luz brillante sobre el trabajo */}
            <g opacity={lab(1.0) * draw}>
              <ellipse cx={poolX} cy={poolY + 70} rx={150 * (0.9 + 0.1 * flicker)} ry={44} fill="url(#wl_pool)" />
              <rect x={poolX - 150} y={poolY + 60} width={300} height={120} rx={8} fill={COLORS.bg2} opacity={0.5} />
              {/* "renglones" del libro iluminados */}
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={poolX - 110} y={poolY + 84 + i * 22} width={220 - (i % 2) * 50} height={6} rx={3} fill={COLORS.text} opacity={0.5 * lab(1.2)} />
              ))}
            </g>

            {/* etiquetas */}
            <g fontFamily={FONT_STACK} textAnchor="middle">
              <text x={flameX} y={flameY + 130} fontSize={26} fontWeight={900} fill={COLORS.amber} opacity={lab(0.3)}>{flameLabel}</text>
              <text x={lensX} y={lensY + lensR + 56} fontSize={26} fontWeight={900} fill={COLORS.cold} opacity={lab(0.6)}>{lensLabel}</text>
              <text x={poolX} y={poolY - 90} fontSize={26} fontWeight={900} fill={COLORS.text} opacity={lab(1.0)}>{poolLabel}</text>
            </g>
          </svg>
        </div>
      </AbsoluteFill>
      <SfxCue at={8} src={SFX.popUp} volume={0.4} />
    </AbsoluteFill>
  );
};
