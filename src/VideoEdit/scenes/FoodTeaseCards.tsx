import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile, Video } from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// Tarjetas de COMIDA flotando, la mayoría "sin revelar" (blur + ?), una nítida a la vez.
// Hook open-loop hermoso: el ojo quiere ver qué hay debajo. Brand-native (serif terroso).
export type TeaseCard = { src: string; label?: string };

const isVid = (s: string) => /\.(mp4|webm|mov)$/i.test(s);

export const FoodTeaseCards: React.FC<{
  durationInFrames: number;
  cards: TeaseCard[];
  eyebrow?: string;
  title?: string;
}> = ({ durationInFrames, cards, eyebrow = "Algunas merecen volver…", title = "¿Cuántas te acordás?" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const n = cards.length;

  // qué tarjeta está "revelada" (nítida) — recorre lento, en loop
  const focusF = interpolate(frame, [0, durationInFrames], [0, n - 1], { extrapolateRight: "clamp" });

  // disposición en arco suave centrado
  const cw = Math.min(360, (width * 0.92) / n);
  const ch = cw * 1.18;
  const gap = cw * 0.28;
  const totalW = n * cw + (n - 1) * gap;
  const x0 = (width - totalW) / 2;

  const titleIn = spring({ frame: frame - 6, fps, config: { damping: 22 } });
  const titleOut = interpolate(frame, [durationInFrames - 22, durationInFrames - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleOp = titleIn * (1 - titleOut);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 120% at 50% 38%, ${COLORS.bg1} 0%, ${COLORS.bg2} 70%, ${COLORS.bg0} 100%)` }}>
      {/* eyebrow + título arriba */}
      <div style={{ position: "absolute", top: height * 0.1, width: "100%", textAlign: "center", opacity: titleOp }}>
        <div style={{ fontFamily: FONT_STACK, fontSize: 30, letterSpacing: 2, textTransform: "uppercase", color: COLORS.amber, marginBottom: 10 }}>{eyebrow}</div>
        <div style={{ fontFamily: FONT_STACK, fontSize: 76, fontWeight: 600, color: COLORS.ink }}>{title}</div>
      </div>

      {/* fila de tarjetas flotando */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: totalW, height: ch * 1.5, marginTop: height * 0.08 }}>
          {cards.map((c, i) => {
            const dist = Math.abs(i - focusF);
            const focused = Math.max(0, 1 - dist); // 1 enfocada -> 0
            const cardIn = spring({ frame: frame - 8 - i * 4, fps, config: { damping: 18 } });
            const bob = Math.sin((frame / fps) * 1.1 + i * 1.3) * 10;
            const tilt = Math.sin((frame / fps) * 0.7 + i) * 4;
            const z = interpolate(focused, [0, 1], [-90, 60]);
            const sc = interpolate(focused, [0, 1], [0.82, 1.08]) * interpolate(cardIn, [0, 1], [0.7, 1]);
            const blur = interpolate(focused, [0, 1], [9, 0]);
            const dim = interpolate(focused, [0, 1], [0.55, 0]); // scrim oscuro en las no reveladas
            const left = x0 - (width - totalW) / 2 + i * (cw + gap);
            const arc = -Math.cos(((i + 0.5) / n) * Math.PI) * 24; // leve arco
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left,
                  top: ch * 0.25 + arc + bob,
                  width: cw,
                  height: ch,
                  transform: `perspective(1400px) translateZ(${z}px) rotateY(${tilt}deg) scale(${sc})`,
                  transformStyle: "preserve-3d",
                  borderRadius: 22,
                  overflow: "hidden",
                  boxShadow: `0 ${18 + focused * 26}px ${40 + focused * 50}px rgba(42,38,32,${0.28 + focused * 0.2})`,
                  border: `3px solid ${focused > 0.5 ? COLORS.amber : "rgba(42,38,32,0.18)"}`,
                  opacity: cardIn,
                  zIndex: Math.round(focused * 100),
                }}
              >
                {isVid(c.src) ? (
                  <Video src={staticFile(c.src)} muted playbackRate={0.6} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px) saturate(${0.7 + focused * 0.4})` }} />
                ) : (
                  <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px) saturate(${0.7 + focused * 0.4})` }} />
                )}
                {/* scrim de "sin revelar" + signo de pregunta */}
                <AbsoluteFill style={{ background: `rgba(30,26,20,${dim})`, alignItems: "center", justifyContent: "center" }}>
                  {dim > 0.25 && (
                    <span style={{ fontFamily: FONT_STACK, fontSize: cw * 0.5, fontWeight: 600, color: "rgba(239,231,211,0.82)", textShadow: "0 4px 18px rgba(0,0,0,0.5)" }}>?</span>
                  )}
                </AbsoluteFill>
                {/* label de la enfocada */}
                {focused > 0.6 && c.label && (
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 14px", background: "linear-gradient(transparent, rgba(30,26,20,0.86))", color: COLORS.bg0, fontFamily: FONT_STACK, fontSize: 26, textAlign: "center", opacity: (focused - 0.6) / 0.4 }}>
                    {c.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
