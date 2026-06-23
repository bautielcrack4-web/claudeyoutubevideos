import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";

// ── COMPONENTE A MEDIDA (video zeer / pot-in-pot cooler) ─────────────────────
// Corte transversal animado del enfriador de olla-en-olla (zeer): dos ollas de
// barro anidadas, con un ANILLO DE ARENA HÚMEDA entre ellas. El aire seco y
// caliente de afuera (derecha) tira la humedad de la arena a través del barro
// poroso → la evaporación (flechas que SUBEN y se desvanecen) se lleva el calor →
// la olla interior, donde está la comida, queda FRÍA (~50°F). Todo SVG, siempre
// vivo: la arena late húmeda, las gotas suben, el termómetro de la comida baja.
// NO usa imágenes. Hermano de EarthTubeDiagram (mismo lenguaje visual del canal).
type Tag = { text: string; sub?: string };

// PRNG determinista (sin Math.random — Remotion necesita render reproducible)
const mulberry32 = (a: number) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
// puntos de arena en el anillo (se fijan una vez)
const SAND = (() => {
  const r = mulberry32(7);
  const pts: { x: number; y: number; s: number }[] = [];
  for (let i = 0; i < 90; i++) pts.push({ x: 470 + r() * 660, y: 320 + r() * 400, s: 2.4 + r() * 3.2 });
  return pts;
})();
// columnas de evaporación que suben del borde de la olla
const EVAP = [560, 640, 720, 800, 880, 960, 1040];

export const ZeerPotDiagram: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  inner?: Tag; // olla interior (comida)
  sand?: Tag; // anillo de arena húmeda
  outer?: Tag; // aire seco caliente de afuera
  dropTag?: string; // "15–25°F cooler"
  gapTag?: string; // "1–2 in sand"
  hotColor?: string;
  coldColor?: string;
}> = ({
  durationInFrames,
  eyebrow,
  title,
  inner = { text: "Food ~50°F", sub: "stays cool & crisp" },
  sand = { text: "Wet sand", sub: "soaks the outer clay" },
  outer = { text: "95°F dry air", sub: "pulls the moisture out" },
  dropTag = "15–25°F cooler",
  gapTag = "1–2 in",
  hotColor = COLORS.danger,
  coldColor = COLORS.cold,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  // pulso de humedad de la arena
  const wet = 0.16 + 0.06 * Math.sin(frame / 16);

  const Label: React.FC<{ x: number; y: number; t: Tag; at: number; color?: string; anchor?: string }> = ({ x, y, t, at, color = COLORS.text, anchor = "middle" }) => {
    const s = lab(at);
    return (
      <g opacity={s} transform={`translate(${x} ${y + (1 - s) * 12})`} textAnchor={anchor as "middle"}>
        <text fontSize={38} fontWeight={900} fill={color} fontFamily={FONT_STACK}>{t.text}</text>
        {t.sub && <text y={32} fontSize={22} fontWeight={600} fill={COLORS.textDim} fontFamily={FONT_STACK}>{t.sub}</text>}
      </g>
    );
  };

  // siluetas de las ollas (trapecios: boca ancha, base angosta)
  const outerSil = "M470 318 L1130 318 L1040 730 L560 730 Z";
  const outerCav = "M508 338 L1092 338 L1012 712 L588 712 Z"; // cavidad de la olla externa (= arena)
  const innerSil = "M566 360 L1034 360 L968 700 L632 700 Z"; // olla interior (barro)
  const innerCav = "M598 378 L1002 378 L948 684 L652 684 Z"; // cavidad interior (comida)

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
              <clipPath id="zp_cav"><path d={outerCav} /></clipPath>
              <radialGradient id="zp_sun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.95} />
                <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
              </radialGradient>
              <linearGradient id="zp_clay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b9682f" />
                <stop offset="100%" stopColor="#7d3f18" />
              </linearGradient>
            </defs>

            {/* sol / aire seco caliente arriba a la derecha */}
            <circle cx={1430} cy={120} r={150} fill="url(#zp_sun)" opacity={lab(0.2)} />
            <circle cx={1430} cy={120} r={48} fill={COLORS.amber} opacity={lab(0.2)} />
            {/* ondas de calor (derecha, afuera) */}
            <g opacity={0.5 * lab(0.3)} stroke={hotColor} strokeWidth={4} fill="none" strokeLinecap="round">
              {[0, 1, 2].map((i) => {
                const x = 1230 + i * 46;
                const ph = frame / 12 + i;
                return <path key={i} d={`M ${x} 360 q 18 -26 0 -52 q -18 -26 0 -52`} transform={`translate(${Math.sin(ph) * 4} 0)`} />;
              })}
            </g>

            {/* mesa / superficie sombreada */}
            <rect x={0} y={730} width={1600} height={170} fill="#5c4a30" opacity={0.28} />
            <line x1={0} y1={730} x2={1600} y2={730} stroke={COLORS.bg2} strokeWidth={3} />

            {/* olla EXTERNA (barro) */}
            <path d={outerSil} fill="url(#zp_clay)" stroke="#5e2f12" strokeWidth={4} opacity={lab(0.35)} />
            {/* anillo de ARENA húmeda (cavidad externa) */}
            <g opacity={lab(0.5)}>
              <path d={outerCav} fill="#c9a25c" />
              <path d={outerCav} fill={coldColor} opacity={wet} />
              <g clipPath="url(#zp_cav)">
                {SAND.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={p.s} fill="#8a6d3b" opacity={0.55} />
                ))}
              </g>
            </g>
            {/* olla INTERIOR (barro) tapa el centro del anillo */}
            <path d={innerSil} fill="url(#zp_clay)" stroke="#5e2f12" strokeWidth={4} opacity={lab(0.6)} />
            {/* cavidad interior con comida, fresca */}
            <g opacity={lab(0.7)}>
              <path d={innerCav} fill={COLORS.bg1} />
              <path d={innerCav} fill={coldColor} opacity={0.18} />
              {/* comida: unos vegetales/huevos simples */}
              <g clipPath="url(#zp_cav)">
                <circle cx={760} cy={560} r={34} fill="#cf3b3b" opacity={0.85} />
                <circle cx={830} cy={585} r={30} fill="#3f8f4a" opacity={0.85} />
                <ellipse cx={700} cy={590} rx={26} ry={34} fill="#e7d7a6" opacity={0.9} />
                <circle cx={880} cy={560} r={24} fill="#e0a93b" opacity={0.85} />
                <rect x={770} y={520} width={70} height={26} rx={8} fill="#f1e6c4" opacity={0.9} />
              </g>
            </g>

            {/* paño húmedo (tapa) sobre la boca */}
            <g opacity={lab(0.85)}>
              <path d={`M 556 360 Q 800 ${330 + Math.sin(frame / 22) * 4} 1044 360 L 1060 338 Q 800 312 540 338 Z`} fill="#d8c1a0" stroke="#9c8358" strokeWidth={3} />
            </g>

            {/* EVAPORACIÓN: gotas/flechas que suben del borde y se desvanecen */}
            <g opacity={lab(0.6)}>
              {EVAP.map((x, i) => {
                const span = 150;
                const prog = ((frame * 2.2 + i * 33) % span) / span; // 0→1 sube
                const y = 326 - prog * 120;
                const op = Math.sin(prog * Math.PI) * 0.85;
                return (
                  <g key={i} transform={`translate(${x} ${y})`} opacity={op}>
                    <path d="M0 14 C -7 4 -7 -4 0 -12 C 7 -4 7 4 0 14 Z" fill={coldColor} opacity={0.8} />
                  </g>
                );
              })}
            </g>

            {/* marcador del hueco de arena (gap) a la izquierda */}
            <g opacity={lab(0.95)} stroke={COLORS.textDim} strokeWidth={2}>
              <line x1={508} y1={470} x2={566} y2={470} />
              <line x1={508} y1={462} x2={508} y2={478} />
              <line x1={566} y1={462} x2={566} y2={478} />
            </g>
            <text x={537} y={452} fontSize={24} fontWeight={800} fill={COLORS.textDim} fontFamily={FONT_STACK} textAnchor="middle" opacity={lab(0.95)}>{gapTag}</text>

            {/* etiquetas */}
            <Label x={800} y={770} t={inner} at={0.5} color={coldColor} />
            <Label x={300} y={360} t={sand} at={0.8} color={COLORS.amber} anchor="middle" />
            <Label x={1300} y={470} t={outer} at={1.1} color={hotColor} anchor="middle" />
            {/* línea guía arena → anillo */}
            <line x1={360} y1={386} x2={520} y2={470} stroke={COLORS.amber} strokeWidth={2} opacity={0.5 * lab(0.8)} />

            {/* píldora del salto térmico */}
            <g opacity={lab(1.25)} transform="translate(800 250)">
              <rect x={-180} y={-34} width={360} height={68} rx={34} fill={coldColor} opacity={0.16} />
              <text x={0} y={12} fontSize={40} fontWeight={900} fill={coldColor} fontFamily={FONT_STACK} textAnchor="middle">{dropTag}</text>
            </g>
          </svg>
        </div>
      </AbsoluteFill>
      <SfxCue at={6} src={SFX.popUp} volume={0.4} />
      <SfxCue at={sec(1.1)} src={SFX.ui5} volume={0.4} />
    </AbsoluteFill>
  );
};
