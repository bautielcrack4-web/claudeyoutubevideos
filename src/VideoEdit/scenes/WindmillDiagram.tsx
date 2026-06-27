import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";

// ── COMPONENTE A MEDIDA (video molino) ───────────────────────────────────────
// Corte del sistema de agua eólico: el VIENTO gira la rueda → engranajes →
// la varilla (sucker rod) baja por la torre y bombea agua del pozo (85 ft) →
// el agua sube y llena el TANQUE en la colina cuando sopla → la GRAVEDAD
// alimenta la casa siempre (aunque no haya viento). Todo SVG, siempre vivo.
type Tag = { text: string; sub?: string };

export const WindmillDiagram: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  wind?: Tag;
  pump?: Tag;
  tank?: Tag;
  out?: Tag;
  partsTag?: string;
  coldColor?: string;
}> = ({
  durationInFrames,
  eyebrow,
  title,
  wind = { text: "Wind", sub: "turns the wheel" },
  pump = { text: "Pump 85 ft down", sub: "rod strokes up & down" },
  tank = { text: "Tank on the hill", sub: "fills when wind blows" },
  out = { text: "Gravity to the house", sub: "pressure, always" },
  partsTag = "5 iron parts",
  coldColor = COLORS.cold,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });
  const flow = interpolate(frame, [0, fps * 4], [0, -240], { extrapolateRight: "extend" });
  const wheelRot = (frame * 2.2) % 360;
  const rodY = Math.sin(frame / 6) * 14; // sucker rod stroke

  const Label: React.FC<{ x: number; y: number; t: Tag; at: number; color?: string; anchor?: string }> = ({ x, y, t, at, color = COLORS.text, anchor = "middle" }) => {
    const s = lab(at);
    return (
      <g opacity={s} transform={`translate(${x} ${y + (1 - s) * 12})`} textAnchor={anchor as "middle"}>
        <text fontSize={34} fontWeight={900} fill={color} fontFamily={FONT_STACK}>{t.text}</text>
        {t.sub && <text y={30} fontSize={20} fontWeight={600} fill={COLORS.textDim} fontFamily={FONT_STACK}>{t.sub}</text>}
      </g>
    );
  };

  const towerX = 340, groundY = 600, wheelY = 150;
  const wellBot = 830;
  // discharge pipe: well head → up over the hill → tank
  const PIPE_UP = `M ${towerX} ${groundY} L ${towerX} 470 L 760 470 L 760 430`;
  const TANK_X = 1080, TANK_Y = 360, TANK_W = 300, TANK_H = 150;
  const GRAV = `M ${TANK_X + 40} ${TANK_Y + TANK_H} L ${TANK_X + 40} 660 L ${TANK_X + 220} 660`;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={50} glowY={28} hue="amber" drift={0.3} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "92%", maxWidth: 1600, opacity: enter, transform: `translateY(${(1 - enter) * 26}px)` }}>
          {(eyebrow || title) && (
            <div style={{ textAlign: "center", marginBottom: 8, fontFamily: FONT_STACK }}>
              {eyebrow && <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 800, textTransform: "uppercase", color: COLORS.amber }}>{eyebrow}</div>}
              {title && <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.text, marginTop: 4 }}>{title}</div>}
            </div>
          )}
          <svg viewBox="0 0 1600 900" style={{ width: "100%", height: "auto" }}>
            <defs>
              <radialGradient id="wm_sun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.9} />
                <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
              </radialGradient>
            </defs>

            {/* sky/ground */}
            <rect x={0} y={0} width={1600} height={groundY} fill={COLORS.bg1} opacity={0.25} />
            <path d={`M 0 ${groundY} L 900 ${groundY} Q 1000 ${groundY} 1040 510 L 1420 510 L 1420 900 L 0 900 Z`} fill="#5c4a30" opacity={0.3} />
            <line x1={0} y1={groundY} x2={920} y2={groundY} stroke={COLORS.bg2} strokeWidth={3} />

            {/* wind arrows into the wheel */}
            <g opacity={0.7 * lab(0.3)} stroke={COLORS.good} strokeWidth={5} fill="none" strokeLinecap="round">
              {[0, 1, 2].map((i) => {
                const y = 110 + i * 40;
                const x = 60 + (frame * 3 + i * 40) % 130;
                return <g key={i}><line x1={x} y1={y} x2={x + 70} y2={y} /><path d={`M ${x + 70} ${y} l -14 -8 M ${x + 70} ${y} l -14 8`} /></g>;
              })}
            </g>

            {/* TOWER */}
            <g opacity={lab(0.4)} stroke={COLORS.text} strokeWidth={4} fill="none">
              <line x1={towerX - 90} y1={groundY} x2={towerX - 26} y2={wheelY + 60} />
              <line x1={towerX + 90} y1={groundY} x2={towerX + 26} y2={wheelY + 60} />
              {[0, 1, 2, 3].map((i) => {
                const y0 = groundY - i * 112, y1 = groundY - (i + 1) * 112;
                const w0 = 90 - i * 16, w1 = 90 - (i + 1) * 16;
                return <g key={i} strokeWidth={2} opacity={0.7}>
                  <line x1={towerX - w0} y1={y0} x2={towerX + w1} y2={y1} />
                  <line x1={towerX + w0} y1={y0} x2={towerX - w1} y2={y1} />
                </g>;
              })}
            </g>

            {/* WHEEL (rotating blades) + tail */}
            <g opacity={lab(0.2)}>
              {/* tail */}
              <path d={`M ${towerX + 20} ${wheelY} L ${towerX + 180} ${wheelY - 30} L ${towerX + 180} ${wheelY + 30} Z`} fill={COLORS.bg2} opacity={0.55} stroke={COLORS.text} strokeWidth={2} />
              <g transform={`rotate(${wheelRot} ${towerX} ${wheelY})`}>
                {Array.from({ length: 18 }).map((_, i) => {
                  const a = (i / 18) * Math.PI * 2;
                  const x1 = towerX + Math.cos(a) * 24, y1 = wheelY + Math.sin(a) * 24;
                  const x2 = towerX + Math.cos(a) * 80, y2 = wheelY + Math.sin(a) * 80;
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.amber} strokeWidth={6} strokeLinecap="round" opacity={0.9} />;
                })}
                <circle cx={towerX} cy={wheelY} r={84} fill="none" stroke={COLORS.amber} strokeWidth={3} opacity={0.5} />
              </g>
              <circle cx={towerX} cy={wheelY} r={16} fill={COLORS.bg2} stroke={COLORS.text} strokeWidth={2} />
            </g>

            {/* WELL + sucker rod (stroking) + pump */}
            <rect x={towerX - 16} y={groundY} width={32} height={wellBot - groundY} fill={COLORS.bg2} opacity={0.5} stroke={COLORS.text} strokeWidth={2} />
            {/* water in well rising */}
            <line x1={towerX} y1={wellBot - 20} x2={towerX} y2={groundY} stroke={coldColor} strokeWidth={10} strokeDasharray="3 26" strokeDashoffset={flow} opacity={0.7 * lab(0.6)} />
            {/* rod */}
            <line x1={towerX} y1={wheelY + 20 + rodY} x2={towerX} y2={wellBot - 60 + rodY} stroke={COLORS.text} strokeWidth={5} opacity={0.7 * lab(0.5)} />
            <rect x={towerX - 22} y={wellBot - 70} width={44} height={56} rx={6} fill="#7d3f18" opacity={0.7} stroke="#5e2f12" strokeWidth={2} />

            {/* discharge pipe up to tank */}
            <path d={PIPE_UP} fill="none" stroke={COLORS.bg2} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
            <path d={PIPE_UP} fill="none" stroke={coldColor} strokeWidth={9} strokeLinecap="round" strokeDasharray="3 22" strokeDashoffset={flow} opacity={0.7 * lab(0.8)} />

            {/* TANK on the hill */}
            <g opacity={lab(0.9)}>
              <rect x={TANK_X} y={TANK_Y} width={TANK_W} height={TANK_H} rx={12} fill={COLORS.bg2} opacity={0.45} stroke={COLORS.text} strokeWidth={3} />
              {/* water level */}
              <rect x={TANK_X + 6} y={TANK_Y + 34 + Math.sin(frame / 20) * 4} width={TANK_W - 12} height={TANK_H - 40} rx={6} fill={coldColor} opacity={0.3} />
              <line x1={TANK_X + 6} y1={TANK_Y + 36} x2={TANK_X + TANK_W - 6} y2={TANK_Y + 36} stroke={coldColor} strokeWidth={3} opacity={0.6} />
            </g>

            {/* gravity to house */}
            <path d={GRAV} fill="none" stroke={COLORS.bg2} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
            <path d={GRAV} fill="none" stroke={coldColor} strokeWidth={8} strokeLinecap="round" strokeDasharray="3 20" strokeDashoffset={-flow} opacity={0.7 * lab(1.2)} />
            {/* HOUSE */}
            <g opacity={lab(1.2)}>
              <rect x={TANK_X + 200} y={620} width={150} height={120} rx={6} fill={COLORS.bg2} opacity={0.5} stroke={COLORS.text} strokeWidth={2} />
              <path d={`M ${TANK_X + 190} 620 L ${TANK_X + 275} 560 L ${TANK_X + 360} 620 Z`} fill={COLORS.bg2} opacity={0.6} stroke={COLORS.text} strokeWidth={2} />
            </g>

            {/* labels */}
            <Label x={150} y={70} t={wind} at={0.3} color={COLORS.good} />
            <Label x={towerX} y={880} t={pump} at={0.6} color={coldColor} />
            <Label x={TANK_X + TANK_W / 2} y={330} t={tank} at={0.9} color={coldColor} />
            <Label x={TANK_X + 275} y={790} t={out} at={1.2} color={COLORS.amber} />
            <g opacity={lab(1.4)} transform={`translate(${towerX} 250)`}>
              <rect x={-110} y={-30} width={220} height={60} rx={30} fill={COLORS.amber} opacity={0.16} />
              <text x={0} y={10} fontSize={30} fontWeight={900} fill={COLORS.amber} fontFamily={FONT_STACK} textAnchor="middle">{partsTag}</text>
            </g>
          </svg>
        </div>
      </AbsoluteFill>
      <SfxCue at={6} src={SFX.popUp} volume={0.4} />
      <SfxCue at={sec(1.1)} src={SFX.ui5} volume={0.4} />
    </AbsoluteFill>
  );
};
