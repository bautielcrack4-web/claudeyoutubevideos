import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../theme";

// Rule 9B — hand-drawn annotation. A rough marker circle that DRAWS itself around
// a word, like someone underlining a point live. Pure SVG stroke-dash reveal.
export const CircleAnnotation: React.FC<{
  delay?: number;
  color?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}> = ({ delay = 0, color = COLORS.danger, width = 560, height = 180, strokeWidth = 9 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 22, mass: 0.8 } });
  const draw = interpolate(s, [0, 1], [0, 1]);

  // a slightly irregular ellipse path (hand-drawn feel), overlapping ends
  const cx = width / 2;
  const cy = height / 2;
  const rx = width / 2 - strokeWidth;
  const ry = height / 2 - strokeWidth;
  const path = `M ${cx + rx * 0.96} ${cy - ry * 0.18}
    C ${cx + rx} ${cy - ry * 0.9}, ${cx - rx * 0.2} ${cy - ry * 1.04}, ${cx - rx * 0.86} ${cy - ry * 0.5}
    C ${cx - rx * 1.05} ${cy + ry * 0.05}, ${cx - rx * 0.7} ${cy + ry * 0.98}, ${cx + rx * 0.1} ${cy + ry * 0.96}
    C ${cx + rx * 0.92} ${cy + ry * 0.92}, ${cx + rx * 1.06} ${cy + ry * 0.1}, ${cx + rx * 0.84} ${cy - ry * 0.55}`;
  const len = 1700;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", left: -strokeWidth, top: -strokeWidth, overflow: "visible", pointerEvents: "none" }}
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={interpolate(draw, [0, 1], [len, 0])}
        style={{ filter: `drop-shadow(0 4px 18px ${color}88)` }}
      />
    </svg>
  );
};
