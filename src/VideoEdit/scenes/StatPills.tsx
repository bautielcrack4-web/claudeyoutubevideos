import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_DISPLAY } from "../theme_ben";

// StatPills — píldoras oscuras translúcidas con número en acento (glow suave) + un track
// tipo slider debajo. Va SOBRE el avatar (sin blur, fondo transparente). Entrada suave,
// sin pops. Para mostrar cifras mientras el presentador habla (ej. $8,000 vs $10,000).
const TONES = { accent: COLORS.accent, amber: COLORS.amber, good: COLORS.good, cold: COLORS.cold, danger: COLORS.danger } as const;
const SOFT = { damping: 26, mass: 1, stiffness: 90 };

export const StatPills: React.FC<{
  durationInFrames: number;
  pills: string[]; // texto de cada píldora, ej. ["$8,000", "$10,000"]
  accent?: keyof typeof TONES;
  slider?: boolean; // dibuja el track + perilla debajo
}> = ({ durationInFrames, pills, accent = "accent", slider = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = TONES[accent];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 150 }}>
      <div style={{ display: "flex", gap: 120, alignItems: "center" }}>
        {pills.map((p, i) => {
          const e = spring({ frame: frame - i * 6, fps, config: SOFT });
          const glow = 0.5 + 0.5 * Math.sin(frame / 26 + i);
          return (
            <div key={i} style={{
              opacity: e, transform: `translateY(${(1 - e) * 16}px) scale(${0.92 + e * 0.08})`,
              background: "rgba(14,14,18,0.78)", border: `1.5px solid ${C}66`,
              borderRadius: 999, padding: "14px 40px", backdropFilter: "blur(6px)",
              boxShadow: `0 14px 40px rgba(0,0,0,0.45), 0 0 ${18 + glow * 16}px ${C}55`,
              fontFamily: FONT_DISPLAY, fontSize: 58, color: C, letterSpacing: 1,
              textShadow: `0 0 18px ${C}88`,
            }}>{p}</div>
          );
        })}
      </div>
      {slider && (
        <svg viewBox="0 0 1200 40" style={{ width: 900, height: 30, marginTop: 26, overflow: "visible" }}>
          <line x1={20} y1={20} x2={1180} y2={20} stroke="rgba(255,255,255,0.55)" strokeWidth={4} strokeLinecap="round" />
          {(() => {
            const draw = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const knobX = interpolate(draw, [0, 1], [20, 760]);
            return (
              <>
                <line x1={20} y1={20} x2={20 + (knobX - 20)} y2={20} stroke={COLORS.cold} strokeWidth={6} strokeLinecap="round" />
                <circle cx={760} cy={20} r={14} fill="#fff" opacity={interpolate(frame, [28, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.7))" }} />
              </>
            );
          })()}
        </svg>
      )}
    </AbsoluteFill>
  );
};
