import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { glass, SPRING_SOFT } from "../theme";

// A frosted-glass container that springs in, holds, then eases out.
// `durationInFrames` must match the wrapping <Sequence> so the exit lands on time.
export const GlassCard: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  style?: React.CSSProperties;
  variant?: "light" | "dark";
  fromY?: number;
}> = ({ children, durationInFrames, style, variant = "dark", fromY = 28 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: SPRING_SOFT });
  const exit = spring({
    frame: frame - (durationInFrames - 16),
    fps,
    config: { damping: 200 },
  });

  const opacity = enter * (1 - exit);
  const scale =
    interpolate(enter, [0, 1], [0.9, 1]) *
    interpolate(exit, [0, 1], [1, 0.96]);
  const y =
    interpolate(enter, [0, 1], [fromY, 0]) +
    interpolate(exit, [0, 1], [0, -14]);

  return (
    <div
      style={{
        ...glass(variant),
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        padding: "26px 32px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
