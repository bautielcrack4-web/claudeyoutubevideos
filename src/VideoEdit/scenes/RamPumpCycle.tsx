import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";

// ── COMPONENTE A MEDIDA (video rampump / ariete hidráulico) ──────────────────
// Corte lateral animado del CICLO: el manantial (arriba izq) cae por el DRIVE PIPE,
// el agua acelera, la VÁLVULA DE DESCARGA se cierra de golpe (water hammer, flash),
// el pico de presión empuja un chorro por la VÁLVULA DE ENTREGA a la CÁMARA DE AIRE
// (se comprime) y SUBE por el DELIVERY PIPE al TANQUE (arriba der). Loop ~1.4s que
// imita el "tick" del ariete. Etiquetas de las 5 partes. Todo SVG, sin imágenes.
type Tag = { text: string; sub?: string };
export const RamPumpCycle: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  driveTag?: Tag;
  wasteTag?: Tag;
  airTag?: Tag;
  tankTag?: Tag;
  ratioTag?: string; // ej "10 gal in → 1 gal up"
}> = ({
  durationInFrames,
  eyebrow,
  title,
  driveTag = { text: "Drive pipe", sub: "water falls & speeds up" },
  wasteTag = { text: "Waste valve", sub: "slams shut → water hammer" },
  airTag = { text: "Air chamber", sub: "cushions the blow" },
  tankTag = { text: "Up the hill", sub: "to your tank" },
  ratioTag = "10 fall · 1 climbs",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  // ciclo de ~1.4s: 0–0.55 cae el agua, 0.55 golpe (hammer), 0.55–1.0 sube el chorro, reset
  const CYC = Math.round(fps * 1.4);
  const ph = (frame % CYC) / CYC; // 0..1
  const hammer = ph > 0.5 && ph < 0.62 ? 1 - (ph - 0.5) / 0.12 : 0; // flash del golpe
  const wasteOpen = ph < 0.5 ? 1 : ph < 0.7 ? 0 : interpolate(ph, [0.7, 1], [0, 1]); // 1=abierta
  const driveFlow = interpolate(frame % CYC, [0, CYC], [0, -60], { extrapolateRight: "extend" });
  const climbing = ph > 0.5 && ph < 0.95; // sube el chorro

  // geometría (viewBox 1600x900)
  const springX = 250, springY = 150;
  const pumpX = 760, pumpY = 640;
  const tankX = 1360, tankY = 250;
  const DRIVE = `M ${springX} ${springY + 40} C ${springX + 80} ${springY + 260}, ${pumpX - 240} ${pumpY - 120}, ${pumpX - 40} ${pumpY}`;
  const DELIVERY = `M ${pumpX + 40} ${pumpY - 40} C ${pumpX + 280} ${pumpY - 120}, ${tankX - 180} ${tankY + 280}, ${tankX - 40} ${tankY + 120}`;
  const draw = spring({ frame: frame - 6, fps, config: { damping: 200, mass: 1, stiffness: 36 } });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={50} glowY={30} hue="cold" drift={0.3} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "92%", maxWidth: 1600, opacity: enter, transform: `translateY(${(1 - enter) * 26}px)` }}>
          {(eyebrow || title) && (
            <div style={{ textAlign: "center", marginBottom: 8, fontFamily: FONT_STACK }}>
              {eyebrow && <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 800, textTransform: "uppercase", color: COLORS.cold }}>{eyebrow}</div>}
              {title && <div style={{ fontSize: 50, fontWeight: 900, color: COLORS.text, marginTop: 4 }}>{title}</div>}
            </div>
          )}
          <svg viewBox="0 0 1600 900" style={{ width: "100%", height: "auto" }}>
            <defs>
              <linearGradient id="rp_w" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={COLORS.cold} />
                <stop offset="100%" stopColor={COLORS.accent} />
              </linearGradient>
            </defs>

            {/* terreno */}
            <path d={`M 0 ${springY + 80} L ${springX + 120} ${springY + 80} C ${pumpX - 200} ${pumpY - 60}, ${pumpX - 120} ${pumpY + 60}, 1600 ${pumpY + 80} L 1600 900 L 0 900 Z`} fill="#5c4a30" opacity={0.18} />

            {/* manantial */}
            <g opacity={lab(0.2)}>
              <ellipse cx={springX} cy={springY + 30} rx={90} ry={26} fill={COLORS.cold} opacity={0.4} />
              <text x={springX} y={springY - 30} fontSize={30} fontWeight={800} fill={COLORS.text} fontFamily={FONT_STACK} textAnchor="middle">The spring</text>
            </g>

            {/* tanque arriba */}
            <g opacity={lab(0.5)}>
              <rect x={tankX - 70} y={tankY} width={140} height={120} rx={10} fill={COLORS.bg2} opacity={0.6} stroke={COLORS.cold} strokeWidth={3} />
              <rect x={tankX - 64} y={tankY + 120 - 64 * (climbing ? 1 : 0.7)} width={128} height={64 * (climbing ? 1 : 0.7)} fill={COLORS.cold} opacity={0.5} />
            </g>

            {/* drive pipe + flujo que cae */}
            <path d={DRIVE} fill="none" stroke={COLORS.bg2} strokeWidth={30} strokeLinecap="round" opacity={0.9} />
            <path d={DRIVE} fill="none" stroke="url(#rp_w)" strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
            <path d={DRIVE} fill="none" stroke={COLORS.bg0} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 26" strokeDashoffset={driveFlow} opacity={0.6 * draw} />

            {/* delivery pipe + chorro que sube (solo en fase climbing) */}
            <path d={DELIVERY} fill="none" stroke={COLORS.bg2} strokeWidth={22} strokeLinecap="round" opacity={0.9} />
            <path d={DELIVERY} fill="none" stroke={COLORS.cold} strokeWidth={11} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - (climbing ? draw : 0.0)} opacity={climbing ? 1 : 0.25} />

            {/* cuerpo de la bomba */}
            <g opacity={lab(0.35)}>
              <rect x={pumpX - 50} y={pumpY - 30} width={120} height={90} rx={12} fill={COLORS.bg2} stroke={COLORS.text} strokeWidth={2} />
              {/* válvula de descarga (abajo) — golpea */}
              <circle cx={pumpX - 10} cy={pumpY + 70} r={20} fill={wasteOpen > 0.5 ? COLORS.good : COLORS.danger} opacity={0.85} />
              {/* cámara de aire (arriba) */}
              <rect x={pumpX + 10} y={pumpY - 150} width={44} height={120} rx={8} fill={COLORS.cold} opacity={0.25 + 0.2 * (climbing ? 1 : 0)} stroke={COLORS.cold} strokeWidth={2} />
            </g>

            {/* FLASH del golpe de ariete */}
            {hammer > 0 && (
              <g opacity={hammer}>
                <circle cx={pumpX} cy={pumpY + 30} r={70 + 40 * (1 - hammer)} fill="none" stroke={COLORS.danger} strokeWidth={6} />
                <text x={pumpX} y={pumpY + 150} fontSize={34} fontWeight={900} fill={COLORS.danger} fontFamily={FONT_STACK} textAnchor="middle">WATER HAMMER</text>
              </g>
            )}

            {/* etiquetas de partes */}
            <g opacity={lab(0.6)} fontFamily={FONT_STACK} textAnchor="middle">
              <text x={460} y={pumpY - 150} fontSize={28} fontWeight={900} fill={COLORS.accent}>{driveTag.text}</text>
              {driveTag.sub && <text x={460} y={pumpY - 120} fontSize={19} fontWeight={600} fill={COLORS.textDim}>{driveTag.sub}</text>}
            </g>
            <g opacity={lab(0.9)} fontFamily={FONT_STACK} textAnchor="middle">
              <text x={pumpX - 10} y={pumpY + 140} fontSize={26} fontWeight={900} fill={COLORS.danger}>{wasteTag.text}</text>
              {wasteTag.sub && <text x={pumpX - 10} y={pumpY + 168} fontSize={18} fontWeight={600} fill={COLORS.textDim}>{wasteTag.sub}</text>}
            </g>
            <g opacity={lab(1.2)} fontFamily={FONT_STACK} textAnchor="middle">
              <text x={pumpX + 32} y={pumpY - 170} fontSize={24} fontWeight={900} fill={COLORS.cold}>{airTag.text}</text>
            </g>
            <g opacity={lab(1.0)} fontFamily={FONT_STACK} textAnchor="middle">
              <text x={tankX} y={tankY - 24} fontSize={28} fontWeight={900} fill={COLORS.cold}>{tankTag.text}</text>
              {tankTag.sub && <text x={tankX} y={tankY + 4} fontSize={18} fontWeight={600} fill={COLORS.textDim}>{tankTag.sub}</text>}
            </g>

            {/* ratio */}
            <text x={800} y={870} fontSize={26} fontWeight={800} fill={COLORS.amber} fontFamily={FONT_STACK} textAnchor="middle" opacity={lab(1.4)}>{ratioTag}</text>
          </svg>
        </div>
      </AbsoluteFill>
      <SfxCue at={6} src={SFX.popUp} volume={0.4} />
    </AbsoluteFill>
  );
};
