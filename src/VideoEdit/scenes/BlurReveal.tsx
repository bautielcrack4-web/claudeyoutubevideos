import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";

// ── BLUR REVEAL ─────────────────────────────────────────────────────────────
// OVERLAY: el b-roll que sigue corriendo por DEBAJO se DIFUMINA (backdrop-filter)
// y se oscurece suave, mientras emerge un eyebrow + un título serif grande, centrado.
// Entra (blur sube + texto aparece) y sale (todo se aclara y el texto hace fade),
// devolviéndote el clip nítido. Pensado para frases-ancla cortas sobre el footage.

type AccentKey = "danger" | "accent" | "amber" | "cold" | "good" | "ink";
const TONE: Record<AccentKey, string> = {
  danger: COLORS.danger, accent: COLORS.accent, amber: COLORS.amber,
  cold: COLORS.cold, good: COLORS.good, ink: COLORS.text,
};

export const BlurReveal: React.FC<{
  durationInFrames: number;
  title: string;
  eyebrow?: string;
  accent?: AccentKey;
}> = ({ durationInFrames, title, eyebrow, accent = "amber" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = TONE[accent];

  // curva de presencia: sube rápido, se sostiene, baja al final
  const inS = spring({ frame, fps, config: { damping: 16, mass: 0.7, stiffness: 150 } });
  const out = interpolate(
    frame,
    [durationInFrames - sec(0.5), durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const pres = inS * out;

  const blur = interpolate(pres, [0, 1], [0, 9]);
  const scrim = interpolate(pres, [0, 1], [0, 0.42]);

  // texto
  const tY = interpolate(inS, [0, 1], [26, 0]);
  const tBlur = interpolate(inS, [0, 1], [12, 0]);
  const ebOp = interpolate(frame, [sec(0.12), sec(0.45)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * out;
  const lineW = interpolate(inS, [0, 1], [0, 132]);

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      {/* capa que difumina y oscurece el b-roll de abajo */}
      <AbsoluteFill
        style={{
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          background: `radial-gradient(120% 90% at 50% 50%, rgba(12,10,7,${scrim * 0.5}) 0%, rgba(12,10,7,${scrim}) 100%)`,
        }}
      />
      {/* texto centrado */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 140px" }}>
        {eyebrow ? (
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: C,
              opacity: ebOp,
              marginBottom: 18,
              textShadow: "0 2px 14px rgba(0,0,0,0.8)",
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            height: 4,
            width: lineW,
            background: C,
            borderRadius: 2,
            marginBottom: 26,
            opacity: out,
            boxShadow: `0 0 18px ${C}88`,
          }}
        />
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            lineHeight: 1.06,
            textAlign: "center",
            color: COLORS.bg0,
            maxWidth: 1240,
            opacity: inS * out,
            filter: `blur(${tBlur}px)`,
            transform: `translateY(${tY}px)`,
            textShadow: "0 4px 30px rgba(0,0,0,0.9)",
          }}
        >
          {title}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
