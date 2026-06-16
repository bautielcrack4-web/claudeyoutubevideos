import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";

// ChapterTag — OVERLAY de CARTÓN DE CAPÍTULO sobre el footage (no lo tapa): numeral romano
// + título grande serif, con reglas que se dibujan a los lados. Cinematográfico, brand-native.
// Para los actos del documental ("I · El Fantasma de las Llanuras").
export const ChapterTag: React.FC<{
  durationInFrames: number;
  num?: string;            // "I" (omitir en el cartón de título)
  title: string;
  accent?: "amber" | "danger" | "accent" | "cold";
}> = ({ durationInFrames, num, title, accent = "amber" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = COLORS[accent] || COLORS.amber;
  const inS = spring({ frame, fps, config: { damping: 22, stiffness: 80 } });
  const outS = interpolate(frame, [durationInFrames - sec(0.6), durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(inS, 1 - outS);
  const rule = interpolate(inS, [0.2, 1], [0, 1], { extrapolateLeft: "clamp" });
  const track = interpolate(inS, [0, 1], [16, 6]); // letter-spacing que se cierra

  return (
    <AbsoluteFill style={{ pointerEvents: "none", alignItems: "center", justifyContent: "center" }}>
      {/* scrim radial muy suave SOLO detrás del texto para legibilidad (no es filtro de color) */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 42% at 50% 50%, rgba(0,0,0,0.42), rgba(0,0,0,0) 70%)", opacity: op }} />
      <div style={{ textAlign: "center", opacity: op, transform: `translateY(${(1 - inS) * 14}px)`, fontFamily: FONT_STACK }}>
        {num && (
          <div style={{ fontSize: 30, letterSpacing: 10, color: col, marginBottom: 14, textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}>
            CAPÍTULO {num}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
          <div style={{ height: 2, width: 120 * rule, background: `linear-gradient(90deg, transparent, ${col})`, opacity: 0.9 }} />
          <div style={{ fontSize: 78, fontWeight: 800, color: COLORS.bg0, lineHeight: 1.05, letterSpacing: track, textShadow: "0 4px 26px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.9)", maxWidth: 1200 }}>
            {title}
          </div>
          <div style={{ height: 2, width: 120 * rule, background: `linear-gradient(90deg, ${col}, transparent)`, opacity: 0.9 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
