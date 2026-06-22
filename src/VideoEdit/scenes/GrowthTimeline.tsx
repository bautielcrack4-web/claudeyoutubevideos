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

// ── GROWTH TIMELINE ───────────────────────────────────────────────────────────
// Línea de tiempo animada del proceso de rebrote: una línea que se dibuja, un punto
// que viaja y ENCIENDE cada nodo (con pop + glow), labels que aparecen al pasar.
// Sobre un clip/imagen blureada de fondo. Fluida, llena de micro-animación.

type Stage = { label: string; sub?: string };

export const GrowthTimeline: React.FC<{
  durationInFrames: number;
  title?: string;
  stages: Stage[];
  bg?: string;
  accent?: string;
}> = ({ durationInFrames, title = "De un resto a una planta", stages, bg, accent = COLORS.good }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = accent;
  const n = stages.length;

  const titleS = spring({ frame, fps, config: { damping: 20 } });
  // progreso del punto: 0→1 a lo largo de casi toda la duración
  const t0 = sec(0.6), t1 = durationInFrames - sec(0.5);
  const prog = interpolate(frame, [t0, t1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const L = 0.10, Rr = 0.90; // márgenes de la línea (10%–90%)
  const xAt = (i: number) => L + (Rr - L) * (i / (n - 1));
  const dotX = L + (Rr - L) * prog;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, background: COLORS.ink, overflow: "hidden" }}>
      {bg && (
        <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, durationInFrames], [1.05, 1.12])})` }}>
          <Media src={bg} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.85) brightness(0.5) blur(3px)" }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(15,12,9,0.7), rgba(15,12,9,0.85))" }} />
      <AbsoluteFill style={{ background: `radial-gradient(60% 50% at ${dotX * 100}% 52%, ${C}22, rgba(0,0,0,0) 60%)` }} />

      {/* título */}
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontSize: 70, fontWeight: 900, color: COLORS.bg0, opacity: interpolate(titleS, [0, 1], [0, 1]), transform: `translateY(${interpolate(titleS, [0, 1], [22, 0])}px)`, textShadow: "0 3px 22px rgba(0,0,0,0.7)" }}>{title}</div>
      </div>

      {/* línea base + línea de progreso */}
      <div style={{ position: "absolute", left: `${L * 100}%`, right: `${(1 - Rr) * 100}%`, top: "52%", height: 6, marginTop: -3, background: "rgba(255,245,225,0.18)", borderRadius: 3 }} />
      <div style={{ position: "absolute", left: `${L * 100}%`, width: `${(Rr - L) * prog * 100}%`, top: "52%", height: 6, marginTop: -3, background: C, borderRadius: 3, boxShadow: `0 0 16px ${C}` }} />

      {/* nodos */}
      {stages.map((st, i) => {
        const reached = prog >= (i / (n - 1)) - 0.01;
        const pop = spring({ frame: frame - (t0 + (t1 - t0) * (i / (n - 1))), fps, config: { damping: 11, mass: 0.5, stiffness: 220 } });
        const r = reached ? pop : 0;
        return (
          <div key={i} style={{ position: "absolute", left: `${xAt(i) * 100}%`, top: "52%", transform: "translate(-50%,-50%)" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: reached ? C : "rgba(255,245,225,0.25)", border: `3px solid ${reached ? C : "rgba(255,245,225,0.35)"}`, transform: `scale(${0.8 + 0.5 * r})`, boxShadow: reached ? `0 0 18px ${C}AA` : "none" }} />
            <div style={{ position: "absolute", top: 46, left: "50%", transform: "translateX(-50%)", width: 220, textAlign: "center", opacity: interpolate(r, [0, 1], [0, 1]) }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: COLORS.bg0, lineHeight: 1.1 }}>{st.label}</div>
              {st.sub && <div style={{ fontSize: 22, fontWeight: 600, color: C, marginTop: 4 }}>{st.sub}</div>}
            </div>
          </div>
        );
      })}

      {/* punto-brote que viaja */}
      <div style={{ position: "absolute", left: `${dotX * 100}%`, top: "52%", transform: "translate(-50%,-50%)" }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: COLORS.bg0, boxShadow: `0 0 22px ${C}, 0 0 8px #fff` }} />
      </div>

      <AbsoluteFill style={{ opacity: 0.05, backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")", mixBlendMode: "overlay" }} />
    </AbsoluteFill>
  );
};
