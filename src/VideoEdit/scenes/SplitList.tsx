import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// Rule 2 — presenter reframed to the right (by Main); left side shows a titled
// list with a typewriter title and staggered sparkle-bullet items.
export const SplitList: React.FC<{
  durationInFrames: number;
  title: string;
  items: string[];
  accent?: string;
  cross?: boolean; // render items as crossed-out (the "vanity" anti-list)
}> = ({ durationInFrames, title, items, accent = "#FFFFFF", cross = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame: frame - (durationInFrames - 16),
    fps,
    config: { damping: 200 },
  });
  const exitOp = interpolate(exit, [0, 1], [1, 0]);

  // typewriter title
  const charsShown = Math.floor(
    interpolate(frame, [6, 6 + title.length * 1.6], [0, title.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const caretOn = Math.floor(frame / 16) % 2 === 0;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 0,
          bottom: 0,
          width: 940,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 30,
          opacity: exitOp,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: COLORS.text,
            lineHeight: 1.1,
            minHeight: 70,
          }}
        >
          {title.slice(0, charsShown)}
          <span style={{ color: accent, opacity: caretOn ? 1 : 0 }}>|</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 10 }}>
          {items.map((it, i) => {
            const delay = 16 + title.length * 1.6 + i * 7;
            const s = spring({ frame: frame - delay, fps, config: { damping: 17, mass: 0.7 } });
            const x = interpolate(s, [0, 1], [-50, 0]);
            const op = interpolate(s, [0, 1], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  opacity: op,
                  transform: `translateX(${x}px)`,
                }}
              >
                <svg width={28} height={28} viewBox="0 0 24 24" style={{ flexShrink: 0, filter: `drop-shadow(0 0 8px ${(cross ? COLORS.danger : accent)}aa)` }}>
                  <path
                    d="M12 2 L13.6 9.2 L21 12 L13.6 14.8 L12 22 L10.4 14.8 L3 12 L10.4 9.2 Z"
                    fill={cross ? COLORS.danger : accent}
                  />
                </svg>
                <span
                  style={{
                    color: COLORS.text,
                    fontSize: 40,
                    fontWeight: 700,
                    textDecoration: cross ? "line-through" : "none",
                    textDecorationColor: COLORS.danger,
                    textDecorationThickness: cross ? 3 : undefined,
                  }}
                >
                  {it}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
