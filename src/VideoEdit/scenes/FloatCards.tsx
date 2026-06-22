import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { Media } from "../components/Media";

// ── FLOAT CARDS ───────────────────────────────────────────────────────────────
// Tarjetas flotantes que MUESTRAN las cosas a medida que el narrador las NOMBRA:
// cada tarjeta (clip/imagen del ítem + etiqueta) entra flotando en el ms EXACTO en
// que dice esa palabra (spring: sube + scale + tilt), se acumulan y hacen fade al
// final. OVERLAY (encima del b-roll que sigue). Marca terrosa, sombra, profundidad.

type Card = { label: string; src: string; at: number }; // at = seg relativos (= ms del caption)

export const FloatCards: React.FC<{
  durationInFrames: number;
  cards: Card[];
  accent?: string;
}> = ({ durationInFrames, cards, accent = COLORS.amber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - sec(0.6), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const n = cards.length;
  // posiciones: fila centrada, leve arco/tilt alterno
  const CW = 320, CH = 250, GAP = 36;
  const totalW = n * CW + (n - 1) * GAP;
  const startX = (1920 - totalW) / 2;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, opacity: out }}>
      {cards.map((c, i) => {
        const f0 = sec(c.at);
        const s = spring({ frame: frame - f0, fps, config: { damping: 13, mass: 0.8, stiffness: 150 } });
        const op = interpolate(s, [0, 1], [0, 1]);
        const y = interpolate(s, [0, 1], [70, 0]);
        const sc = interpolate(s, [0, 1], [0.7, 1]);
        const tilt = (i % 2 === 0 ? -1 : 1) * 2.5 * Math.min(1, s);
        const float = Math.sin((frame - f0) / 32 + i) * 5 * Math.min(1, Math.max(0, s));
        const x = startX + i * (CW + GAP);
        const yBase = 300 + (i % 2 === 0 ? 0 : 26); // leve escalonado
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: yBase,
            width: CW, height: CH, borderRadius: 20, overflow: "hidden",
            opacity: op,
            transform: `translateY(${y + float}px) scale(${sc}) rotate(${tilt}deg)`,
            background: COLORS.ink,
            border: `3px solid ${accent}`,
            boxShadow: `0 22px 50px rgba(0,0,0,0.55), 0 0 26px ${accent}33`,
          }}>
            <Media src={c.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(15,12,9,0.92) 0%, rgba(15,12,9,0.1) 42%, rgba(0,0,0,0) 70%)" }} />
            <div style={{
              position: "absolute", left: 0, right: 0, bottom: 16, textAlign: "center",
              fontSize: 38, fontWeight: 800, color: COLORS.bg0, textShadow: "0 2px 14px rgba(0,0,0,0.8)",
            }}>{c.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
