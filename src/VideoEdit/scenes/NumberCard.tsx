import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { Media } from "../components/Media";

// ── NUMBER CARD ───────────────────────────────────────────────────────────────
// Tarjeta de número del listicle: número GIGANTE + nombre del ítem, sobre el clip
// del ítem (con zoom lento), reveal animado. Se clava justo cuando el narrador dice
// "el número X". Recurso clásico del nicho → estructura + ritmo. Marca terrosa serif.

type AccentKey = "danger" | "accent" | "amber" | "cold" | "good" | "ink";
const TONE: Record<AccentKey, string> = {
  danger: COLORS.danger, accent: COLORS.accent, amber: COLORS.amber,
  cold: COLORS.cold, good: COLORS.good, ink: COLORS.text,
};

export const NumberCard: React.FC<{
  durationInFrames: number;
  number: string;       // "1".."16"
  name: string;         // "Cebolla de verdeo"
  bg?: string;          // clip ("broll/x.mp4") o imagen del ítem
  eyebrow?: string;     // pequeño arriba
  total?: string;       // "16"
  accent?: AccentKey;
}> = ({ durationInFrames, number, name, bg, eyebrow = "Replántalo gratis", total = "16", accent = "amber" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = TONE[accent];

  const bgScale = interpolate(frame, [0, durationInFrames], [1.05, 1.14]);
  const numS = spring({ frame, fps, config: { damping: 12, mass: 0.8, stiffness: 170 } });
  const lineW = interpolate(frame - sec(0.25), [0, sec(0.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const nameS = spring({ frame: frame - sec(0.4), fps, config: { damping: 20 } });
  const ebS = spring({ frame: frame - sec(0.2), fps, config: { damping: 22 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, background: COLORS.ink, overflow: "hidden" }}>
      {/* fondo: clip/imagen del ítem con push-in */}
      {bg && (
        <AbsoluteFill style={{ transform: `scale(${bgScale})` }}>
          <Media src={bg} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.95) brightness(0.82)" }} />
        </AbsoluteFill>
      )}
      {/* scrim oscuro inferior-izquierda para el texto */}
      <AbsoluteFill style={{ background: "linear-gradient(105deg, rgba(20,16,12,0.82) 0%, rgba(20,16,12,0.5) 42%, rgba(0,0,0,0) 78%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 120% at 25% 75%, rgba(0,0,0,0) 45%, rgba(20,16,12,0.45) 100%)", mixBlendMode: "multiply" }} />

      {/* bloque número + nombre, abajo-izquierda */}
      <div style={{ position: "absolute", left: 96, bottom: 120, display: "flex", alignItems: "flex-end", gap: 40 }}>
        {/* número gigante */}
        <div style={{
          fontSize: 300, fontWeight: 900, lineHeight: 0.82, color: C,
          transform: `translateY(${interpolate(numS, [0, 1], [40, 0])}px) scale(${interpolate(numS, [0, 1], [0.7, 1])})`,
          opacity: interpolate(numS, [0, 1], [0, 1]),
          textShadow: `0 6px 40px rgba(0,0,0,0.7), 0 0 2px ${C}`,
          letterSpacing: -6,
        }}>{number}</div>

        <div style={{ paddingBottom: 44 }}>
          {/* eyebrow */}
          <div style={{
            fontSize: 26, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: C,
            opacity: interpolate(ebS, [0, 1], [0, 0.95]),
            transform: `translateX(${interpolate(ebS, [0, 1], [-18, 0])}px)`,
            marginBottom: 10,
          }}>{eyebrow} · {number} de {total}</div>
          {/* línea de acento que se dibuja */}
          <div style={{ height: 5, width: 220 * lineW, background: C, borderRadius: 3, marginBottom: 18, boxShadow: `0 1px 8px ${C}99` }} />
          {/* nombre del ítem */}
          <div style={{
            fontSize: 92, fontWeight: 800, lineHeight: 1.0, color: COLORS.bg0,
            opacity: interpolate(nameS, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(nameS, [0, 1], [26, 0])}px)`,
            textShadow: "0 3px 24px rgba(0,0,0,0.8)",
            maxWidth: 1100,
          }}>{name}</div>
        </div>
      </div>

      {/* grano */}
      <AbsoluteFill style={{ opacity: 0.05, backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")", mixBlendMode: "overlay" }} />
    </AbsoluteFill>
  );
};
