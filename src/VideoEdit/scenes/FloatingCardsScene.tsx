import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import { TechBackground } from "../components/TechBackground";

export type FloatCard = {
  num: string;
  label: string;
  caption?: string;
  Icon: React.FC<{ size?: number; color?: string }>;
  accent: string;
};

// Rule 4 — a row of floating 3D cards, all blurred except the focused one.
// The camera travels/zooms to card 1, then 2, then 3 sequentially.
export const FloatingCardsScene: React.FC<{
  durationInFrames: number;
  cards: FloatCard[];
}> = ({ durationInFrames, cards }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const n = cards.length;
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.8 } });
  const exit = spring({
    frame: frame - (durationInFrames - 16),
    fps,
    config: { damping: 200 },
  });
  const sceneOpacity =
    interpolate(enter, [0, 1], [0, 1]) * interpolate(exit, [0, 1], [1, 0]);

  // which card is focused (continuous, so the camera glides between them)
  const holdStart = 12;
  const focusF = interpolate(
    frame,
    [holdStart, durationInFrames - 10],
    [0, n - 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );

  const CARD_W = 460;
  const GAP = 90;
  const step = CARD_W + GAP;
  // row is centered, so the middle card sits at screen center by default.
  // pan so the focused card returns to center; slight push-in zoom.
  const mid = (n - 1) / 2;
  const camX = (mid - focusF) * step;
  const camScale = 1.06 + interpolate(exit, [0, 1], [0, 0.12]);

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <TechBackground glowX={50} glowY={46} hue="blue" drift={0.6} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: sceneOpacity }}>
        <div
          style={{
            display: "flex",
            gap: GAP,
            transform: `translateX(${camX}px) scale(${camScale})`,
            willChange: "transform",
          }}
        >
          {cards.map((c, i) => {
            const dist = Math.abs(i - focusF);
            const focused = Math.max(0, 1 - dist); // 1 at focus -> 0
            const blur = interpolate(dist, [0, 1], [0, 14], { extrapolateRight: "clamp" });
            const op = interpolate(dist, [0, 1.2], [1, 0.32], { extrapolateRight: "clamp" });
            const sc = interpolate(focused, [0, 1], [0.86, 1.06]);
            const float = Math.sin((frame + i * 30) / 28) * 12;
            return (
              <div
                key={i}
                style={{
                  width: CARD_W,
                  height: 560,
                  borderRadius: 44,
                  filter: `blur(${blur}px)`,
                  opacity: op,
                  transform: `scale(${sc}) translateY(${float}px)`,
                  background: `linear-gradient(160deg, ${c.accent}26 0%, rgba(14,20,38,0.72) 60%)`,
                  border: "1px solid rgba(255,255,255,0.16)",
                  boxShadow: `0 40px 110px rgba(0,0,0,0.6), 0 0 60px ${c.accent}33, inset 0 1px 0 rgba(255,255,255,0.18)`,
                  padding: 48,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 22,
                    background: `${c.accent}2e`,
                    border: `1px solid ${c.accent}66`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: c.accent,
                    fontWeight: 800,
                    fontSize: 34,
                  }}
                >
                  {c.num}
                </div>
                <div style={{ alignSelf: "center" }}>
                  <c.Icon size={150} color={c.accent} />
                </div>
                <div>
                  <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.text, letterSpacing: 1 }}>
                    {c.label}
                  </div>
                  {c.caption && (
                    <div style={{ fontSize: 26, color: COLORS.textSoft, marginTop: 8 }}>
                      {c.caption}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
