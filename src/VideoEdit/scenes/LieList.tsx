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

// ── LIE LIST ────────────────────────────────────────────────────────────────
// Lista de "la trampa": una imagen a la DERECHA hace push-in lento (el zoom que
// entra ANTES del texto), un panel oscuro barre desde la izquierda, y cada ítem
// se TACHA en rojo uno por uno (la mentira que se cae). Reemplaza al splitlist
// plano sobre beige. Cinematográfico, on-brand (serif terroso, acento rojo).

type AccentKey = "danger" | "accent" | "amber" | "cold" | "good" | "ink";
const TONE: Record<AccentKey, string> = {
  danger: COLORS.danger, accent: COLORS.accent, amber: COLORS.amber,
  cold: COLORS.cold, good: COLORS.good, ink: COLORS.text,
};

export const LieList: React.FC<{
  durationInFrames: number;
  title: string;
  items: string[];
  image?: string;     // img/... (a la derecha)
  accent?: AccentKey; // color del tachado (default danger)
  hue?: string;
}> = ({ durationInFrames, title, items, image, accent = "danger" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = TONE[accent];

  // imagen: push-in lento desde el frame 0 → hay un instante de "solo imagen con zoom"
  const imgScale = interpolate(frame, [0, durationInFrames], [1.05, 1.16]);
  const imgOp = interpolate(frame, [0, sec(0.3)], [0, 1], { extrapolateRight: "clamp" });
  // panel oscuro barre desde la izquierda (0–0.5s) — el texto entra DESPUÉS del zoom
  const panel = interpolate(frame, [sec(0.25), sec(0.7)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const titleS = spring({ frame: frame - sec(0.6), fps, config: { damping: 22 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, background: COLORS.ink, overflow: "hidden" }}>
      {/* imagen a la derecha, push-in */}
      {image && (
        <AbsoluteFill style={{ transform: `scale(${imgScale})`, opacity: imgOp }}>
          <Media src={image} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.92) brightness(0.9)" }} />
        </AbsoluteFill>
      )}
      {/* gradiente oscuro izq→der (panel para el texto, imagen visible a la derecha) */}
      <AbsoluteFill style={{ background: `linear-gradient(100deg, ${COLORS.ink} 0%, ${COLORS.ink}F0 30%, ${COLORS.ink}77 58%, rgba(0,0,0,0) 86%)` }} />
      {/* viñeta cálida */}
      <AbsoluteFill style={{ background: "radial-gradient(130% 100% at 28% 50%, rgba(0,0,0,0) 42%, rgba(20,16,12,0.5) 100%)", mixBlendMode: "multiply" }} />

      {/* panel izquierdo: título + items tachados */}
      <div style={{
        position: "absolute", left: 0, top: 0, width: "54%", height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 96px",
        transform: `translateX(${interpolate(panel, [0, 1], [-44, 0])}px)`, opacity: panel,
      }}>
        <div style={{
          fontSize: 80, fontWeight: 800, lineHeight: 1.05, color: COLORS.bg0, marginBottom: 50,
          opacity: interpolate(titleS, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(titleS, [0, 1], [22, 0])}px)`,
          textShadow: "0 3px 22px rgba(0,0,0,0.7)",
        }}>{title}</div>

        {items.map((it, i) => {
          const t0 = sec(1.0 + i * 0.6);
          const inS = spring({ frame: frame - t0, fps, config: { damping: 20 } });
          const strike = interpolate(frame - (t0 + sec(0.4)), [0, sec(0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 22, marginBottom: 34,
              opacity: interpolate(inS, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(inS, [0, 1], [-26, 0])}px)`,
            }}>
              <span style={{ color: C, fontSize: 44, fontWeight: 800, lineHeight: 1, marginTop: -4 }}>✗</span>
              <span style={{ position: "relative", fontSize: 48, fontWeight: 600, color: COLORS.bg0, opacity: interpolate(strike, [0, 1], [1, 0.5]) }}>
                {it}
                <span style={{
                  position: "absolute", left: -6, right: -6, top: "54%", height: 6, borderRadius: 3,
                  background: C, transformOrigin: "left center", transform: `scaleX(${strike})`,
                  boxShadow: `0 1px 8px ${C}AA`,
                }} />
              </span>
            </div>
          );
        })}
      </div>

      {/* grano de papel */}
      <AbsoluteFill style={{ opacity: 0.06, backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")", mixBlendMode: "overlay" }} />
    </AbsoluteFill>
  );
};
