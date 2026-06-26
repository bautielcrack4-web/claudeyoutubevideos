import { useCurrentFrame, useVideoConfig, spring, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";

// ── COMPONENTE A MEDIDA (video carne) ────────────────────────────────────────
// Corte del CURADO: una pieza de carne enterrada en sal dentro de la caja. La sal
// es sedienta → tira gotas de agua DESDE la carne hacia afuera, que escurren y se
// juntan como salmuera abajo. Las bacterias (puntitos) se MUEREN al irse el agua.
// Sin agua, la carne se conserva un año. Todo SVG, siempre vivo. Hermano de
// ZeerPotDiagram / MassHeaterDiagram.

const mulberry32 = (a: number) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
// granos de sal alrededor de la carne
const SALT = (() => {
  const r = mulberry32(11);
  const pts: { x: number; y: number; s: number }[] = [];
  for (let i = 0; i < 120; i++) pts.push({ x: 430 + r() * 740, y: 300 + r() * 380, s: 2 + r() * 3 });
  return pts;
})();
// gotas que salen de la carne (origen en el borde + ángulo)
const DROPS = (() => {
  const r = mulberry32(5);
  const d: { x: number; y: number; dx: number; dy: number; ph: number }[] = [];
  for (let i = 0; i < 14; i++) {
    const edge = r();
    let x, y, dx, dy;
    if (edge < 0.5) { x = 560 + r() * 480; y = i % 2 ? 430 : 560; dx = 0; dy = i % 2 ? -1 : 1; }
    else { x = i % 2 ? 560 : 1040; y = 440 + r() * 110; dx = i % 2 ? -1 : 1; dy = 0; }
    d.push({ x, y, dx, dy, ph: r() });
  }
  return d;
})();

export const CureDiagram: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  saltTag?: string;
  waterTag?: string;
  keepTag?: string;
  hotColor?: string;
  coldColor?: string;
}> = ({
  durationInFrames,
  eyebrow,
  title,
  saltTag = "salt pulls the water out",
  waterTag = "bacteria can't live",
  keepTag = "keeps a year",
  hotColor = COLORS.danger,
  coldColor = COLORS.cold,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  const Label: React.FC<{ x: number; y: number; t: string; at: number; color?: string }> = ({ x, y, t, at, color = COLORS.text }) => {
    const s = lab(at);
    return (
      <text x={x} y={y + (1 - s) * 12} opacity={s} fontSize={36} fontWeight={900} fill={color} fontFamily={FONT_STACK} textAnchor="middle">{t}</text>
    );
  };

  // carne (slab) cuerpo
  const meat = "M 600 440 Q 800 410 1000 440 L 1010 560 Q 800 590 590 560 Z";

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={50} glowY={30} hue="amber" drift={0.3} />
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
              <clipPath id="cu_box"><rect x={420} y={290} width={760} height={420} rx={14} /></clipPath>
              <linearGradient id="cu_meat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b8434a" />
                <stop offset="100%" stopColor="#7e2d33" />
              </linearGradient>
            </defs>
            {/* mesa */}
            <rect x={0} y={730} width={1600} height={170} fill="#5c4a30" opacity={0.28} />
            <line x1={0} y1={730} x2={1600} y2={730} stroke={COLORS.bg2} strokeWidth={3} />
            {/* caja de sal (madera) */}
            <rect x={410} y={282} width={780} height={436} rx={16} fill="#6b4f2e" opacity={0.35} />
            <rect x={410} y={282} width={780} height={436} rx={16} fill="none" stroke="#5e3f22" strokeWidth={5} opacity={0.7} />
            {/* sal (granos) */}
            <g opacity={lab(0.4)} clipPath="url(#cu_box)">
              <rect x={420} y={290} width={760} height={420} fill="#e8e2d2" opacity={0.6} />
              {SALT.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.s} fill="#b9b09a" opacity={0.7} />)}
            </g>
            {/* salmuera juntándose abajo */}
            <g clipPath="url(#cu_box)">
              <rect x={420} y={690 - 14 * Math.min(1, lab(1.0))} width={760} height={40} fill={coldColor} opacity={0.18} />
            </g>
            {/* carne */}
            <g opacity={lab(0.55)}>
              <path d={meat} fill="url(#cu_meat)" stroke="#5e2128" strokeWidth={3} />
              {/* vetas */}
              <path d="M 660 470 Q 800 455 940 472" stroke="#e7c9b0" strokeWidth={4} fill="none" opacity={0.5} />
              <path d="M 650 520 Q 800 535 960 520" stroke="#e7c9b0" strokeWidth={4} fill="none" opacity={0.4} />
            </g>
            {/* bacterias que se mueren al irse el agua */}
            <g clipPath="url(#cu_box)">
              {[0, 1, 2, 3, 4].map((i) => {
                const die = Math.max(0, 1 - lab(0.8 + i * 0.25));
                const x = 660 + i * 80, y = i % 2 ? 500 : 480;
                return (
                  <g key={i} opacity={die} transform={`translate(${x} ${y})`}>
                    <circle r={9} fill={COLORS.good} opacity={0.7} />
                    <line x1={-12} y1={-12} x2={12} y2={12} stroke={hotColor} strokeWidth={3} opacity={1 - die} />
                    <line x1={12} y1={-12} x2={-12} y2={12} stroke={hotColor} strokeWidth={3} opacity={1 - die} />
                  </g>
                );
              })}
            </g>
            {/* gotas de agua saliendo de la carne hacia la sal */}
            <g opacity={lab(0.6)} clipPath="url(#cu_box)">
              {DROPS.map((d, i) => {
                const prog = ((frame * 1.6 + d.ph * 120) % 120) / 120;
                const x = d.x + d.dx * prog * 70;
                const y = d.y + d.dy * prog * 70 + (d.dx ? 0 : 0);
                const op = Math.sin(prog * Math.PI) * 0.85;
                return <circle key={i} cx={x} cy={y} r={5} fill={coldColor} opacity={op} />;
              })}
            </g>

            {/* etiquetas */}
            <Label x={290} y={400} t={saltTag} at={0.6} color={COLORS.amber} />
            <Label x={1310} y={470} t={waterTag} at={1.0} color={coldColor} />
            <line x1={250} y1={420} x2={430} y2={470} stroke={COLORS.amber} strokeWidth={2} opacity={0.4 * lab(0.7)} />
            {/* píldora keepTag */}
            <g opacity={lab(1.3)} transform="translate(800 250)">
              <rect x={-160} y={-34} width={320} height={68} rx={34} fill={COLORS.good} opacity={0.18} />
              <text x={0} y={12} fontSize={38} fontWeight={900} fill={COLORS.good} fontFamily={FONT_STACK} textAnchor="middle">{keepTag}</text>
            </g>
          </svg>
        </div>
      </AbsoluteFill>
      <SfxCue at={6} src={SFX.popUp} volume={0.4} />
      <SfxCue at={sec(1.1)} src={SFX.ui5} volume={0.4} />
    </AbsoluteFill>
  );
};
