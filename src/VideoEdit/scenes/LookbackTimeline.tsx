import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK, FONT_DISPLAY, sec } from "../theme_ben";
import { SfxCue, SFX } from "../components/Sfx";

// LookbackTimeline — el "período de revisión de 5 años". Línea de tiempo horizontal:
// a la derecha HOY (pedís Medicaid), y una VENTANA roja de 5 años que barre hacia atrás
// marcando en rojo los regalos/transferencias que te penalizan. Look alarma.
export const LookbackTimeline: React.FC<{
  durationInFrames: number;
  years?: number;
  eyebrow?: string;
  title?: string;
  flags?: string[]; // cosas penalizadas dentro de la ventana
}> = ({
  durationInFrames,
  years = 5,
  eyebrow = "El período de revisión",
  title = "5 años hacia atrás",
  flags = ["Le pasás la casa a un hijo", "Regalás dinero", "Vendés barato"],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });
  const sweep = interpolate(frame, [sec(0.8), sec(2.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const TRACK_L = 180;
  const TRACK_R = 1740;
  const W = TRACK_R - TRACK_L;
  const winLeft = TRACK_R - W * 0.78 * sweep; // la ventana crece desde HOY hacia atrás

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 50%, ${COLORS.accent}16, ${COLORS.bg0} 65%)` }} />
      <SfxCue at={sec(0.8)} src={SFX.whoosh} volume={0.22} />
      <SfxCue at={sec(2.3)} src={SFX.boom2} volume={0.3} />

      <div style={{ position: "absolute", top: 92, left: 0, right: 0, textAlign: "center", opacity: enter }}>
        <div style={{ color: COLORS.accent, letterSpacing: 6, fontSize: 24, fontWeight: 800, fontFamily: FONT_DISPLAY }}>{eyebrow.toUpperCase()}</div>
        <div style={{ color: COLORS.text, fontSize: 56, fontWeight: 900, marginTop: 8 }}>{title}</div>
      </div>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <svg viewBox="0 0 1920 360" style={{ width: 1640, height: 308, overflow: "visible", opacity: enter }}>
          {/* ventana roja del lookback */}
          <rect x={winLeft} y={120} width={TRACK_R - winLeft} height={120} fill={`${COLORS.accent}22`} stroke={COLORS.accent} strokeWidth={3} rx={10} />
          {/* track */}
          <line x1={TRACK_L} y1={180} x2={TRACK_R} y2={180} stroke={COLORS.textDim} strokeWidth={6} strokeLinecap="round" />
          {/* marcas de año */}
          {Array.from({ length: years + 1 }).map((_, i) => {
            const x = TRACK_R - (W * 0.78 * i) / years;
            return (
              <g key={i}>
                <line x1={x} y1={168} x2={x} y2={192} stroke={COLORS.textSoft} strokeWidth={4} />
                <text x={x} y={232} fill={COLORS.textSoft} fontSize={26} fontWeight={700} textAnchor="middle" fontFamily={FONT_STACK}>{i === 0 ? "HOY" : `-${i}a`}</text>
              </g>
            );
          })}
          {/* HOY marker */}
          <circle cx={TRACK_R} cy={180} r={16} fill={COLORS.amber} />
          <text x={TRACK_R} y={120} fill={COLORS.amber} fontSize={28} fontWeight={800} textAnchor="middle" fontFamily={FONT_DISPLAY}>PEDÍS MEDICAID</text>
        </svg>
      </AbsoluteFill>

      {/* flags dentro de la ventana (aparecen escalonados) */}
      <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26 }}>
        {flags.map((f, i) => {
          const fp = spring({ frame: frame - sec(1.0 + i * 0.45), fps, config: { damping: 13, mass: 0.7, stiffness: 200 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: `${COLORS.accent}1c`, border: `2px solid ${COLORS.accent}`, color: COLORS.text, borderRadius: 12, padding: "14px 22px", fontSize: 26, fontWeight: 700, transform: `translateY(${(1 - fp) * 24}px) scale(${0.9 + fp * 0.1})`, opacity: fp }}>
              <span style={{ color: COLORS.danger, fontSize: 24, fontWeight: 900 }}>✕</span>{f}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
