import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";

// ── GRID REVEAL ───────────────────────────────────────────────────────────────
// Finale del listicle: grilla 4×4 con los 16 ítems que entran en CASCADA diagonal
// (spring: scale+fade+y), número que salta, línea de acento que se dibuja, glow que
// pulsa, y un flotar continuo sutil. Hermoso, fluido, lleno de micro-animación.

type Tile = { number: string; name: string };

export const GridReveal: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  tiles: Tile[];
  accent?: string;
}> = ({ durationInFrames, title = "16 restos = 16 plantas", subtitle = "Gratis · desde tu basura", tiles, accent = COLORS.amber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = accent;
  const cols = 4;

  const titleS = spring({ frame, fps, config: { damping: 20 } });
  const subS = spring({ frame: frame - sec(0.3), fps, config: { damping: 22 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, background: COLORS.ink, overflow: "hidden" }}>
      {/* glow de fondo que respira */}
      <AbsoluteFill style={{ background: `radial-gradient(70% 60% at 50% 42%, ${C}22, rgba(0,0,0,0) 70%)`, opacity: interpolate(Math.sin(frame / 22), [-1, 1], [0.5, 1]) }} />
      <AbsoluteFill style={{ background: "radial-gradient(130% 120% at 50% 50%, rgba(0,0,0,0) 50%, rgba(15,12,9,0.6) 100%)" }} />

      {/* título */}
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center" }}>
        <div style={{
          fontSize: 76, fontWeight: 900, color: COLORS.bg0, letterSpacing: -1,
          opacity: interpolate(titleS, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(titleS, [0, 1], [24, 0])}px)`,
          textShadow: "0 3px 24px rgba(0,0,0,0.6)",
        }}>{title}</div>
        <div style={{
          fontSize: 30, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C,
          opacity: interpolate(subS, [0, 1], [0, 0.95]), marginTop: 8,
        }}>{subtitle}</div>
      </div>

      {/* grilla */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 248, bottom: 70, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridAutoRows: "1fr", gap: 18 }}>
        {tiles.slice(0, 16).map((tl, i) => {
          const row = Math.floor(i / cols), col = i % cols;
          const delay = sec(0.5 + (row + col) * 0.085); // cascada diagonal
          const s = spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.7, stiffness: 170 } });
          const op = interpolate(s, [0, 1], [0, 1]);
          const sc = interpolate(s, [0, 1], [0.82, 1]);
          const ty = interpolate(s, [0, 1], [22, 0]);
          const float = Math.sin((frame - delay) / 30 + i) * 3 * Math.min(1, Math.max(0, s));
          const numPop = spring({ frame: frame - delay - sec(0.12), fps, config: { damping: 10, mass: 0.5, stiffness: 220 } });
          const line = interpolate(frame - delay - sec(0.2), [0, sec(0.35)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          return (
            <div key={i} style={{
              position: "relative", borderRadius: 16, overflow: "hidden",
              opacity: op, transform: `translateY(${ty + float}px) scale(${sc})`,
              background: `linear-gradient(150deg, #221b14, #16110c)`,
              border: `1.5px solid ${C}44`,
              boxShadow: `0 10px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,240,210,0.06)`,
              display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 26px",
            }}>
              <div style={{
                fontSize: 64, fontWeight: 900, color: C, lineHeight: 1,
                transform: `scale(${interpolate(numPop, [0, 1], [0.3, 1])})`, transformOrigin: "left center",
                textShadow: `0 2px 14px ${C}55`,
              }}>{tl.number}</div>
              <div style={{ height: 3, width: `${60 * line}px`, background: C, borderRadius: 2, margin: "8px 0 8px" }} />
              <div style={{ fontSize: 27, fontWeight: 700, color: COLORS.bg0, lineHeight: 1.05 }}>{tl.name}</div>
            </div>
          );
        })}
      </div>

      {/* grano */}
      <AbsoluteFill style={{ opacity: 0.05, backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")", mixBlendMode: "overlay" }} />
    </AbsoluteFill>
  );
};
