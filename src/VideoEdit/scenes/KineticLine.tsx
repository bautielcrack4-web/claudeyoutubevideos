import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";

// ── KINETIC LINE ──────────────────────────────────────────────────────────────
// Tipografía cinética SINCRONIZADA A LA TRANSCRIPT EXACTA: cada palabra aparece en
// el ms exacto en que el narrador la dice (blur→nítido + sube + scale). Palabras
// clave resaltadas (acento + glow). OVERLAY (encima del b-roll que sigue corriendo).
// Las palabras se quedan visibles y la línea hace fade al final.

type AccentKey = "danger" | "accent" | "amber" | "cold" | "good" | "ink";
const TONE: Record<AccentKey, string> = {
  danger: COLORS.danger, accent: COLORS.accent, amber: COLORS.amber,
  cold: COLORS.cold, good: COLORS.good, ink: COLORS.text,
};

export const KineticLine: React.FC<{
  durationInFrames: number;
  words: { t: string; at: number; hl?: boolean }[]; // at = segundos relativos al inicio (= ms exacto del caption)
  accent?: AccentKey;
}> = ({ durationInFrames, words, accent = "amber" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = TONE[accent];
  const out = interpolate(frame, [durationInFrames - sec(0.45), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, justifyContent: "flex-end", alignItems: "center", paddingBottom: 156, opacity: out }}>
      {/* scrim inferior para legibilidad (no tapa el b-roll de arriba) */}
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(15,12,9,0.8) 0%, rgba(15,12,9,0.32) 22%, rgba(0,0,0,0) 44%)" }} />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", gap: "6px 20px", maxWidth: 1560, padding: "0 110px", position: "relative" }}>
        {words.map((w, i) => {
          const f0 = sec(w.at);
          const s = spring({ frame: frame - f0, fps, config: { damping: 14, mass: 0.6, stiffness: 200 } });
          const op = interpolate(s, [0, 1], [0, 1]);
          const blur = interpolate(s, [0, 1], [11, 0]);
          const y = interpolate(s, [0, 1], [28, 0]);
          const sc = w.hl ? interpolate(s, [0, 1], [1.22, 1]) : 1;
          return (
            <span key={i} style={{
              fontSize: w.hl ? 110 : 82,
              fontWeight: w.hl ? 900 : 800,
              color: w.hl ? C : COLORS.bg0,
              opacity: op,
              filter: `blur(${blur}px)`,
              transform: `translateY(${y}px) scale(${sc})`,
              transformOrigin: "center bottom",
              lineHeight: 1.02,
              display: "inline-block",
              textShadow: w.hl
                ? `0 3px 26px rgba(0,0,0,0.85), 0 0 28px ${C}66`
                : "0 3px 22px rgba(0,0,0,0.9)",
            }}>{w.t}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
