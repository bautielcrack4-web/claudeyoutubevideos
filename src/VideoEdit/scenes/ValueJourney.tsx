import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT } from "../theme";
import { SceneFrame } from "../components/SceneFrame";

// GENERIC, data-driven "value-journey" line graph: a smooth curve travelling
// through numbered waypoints, with optional big start/end values. Topic-agnostic
// — pass the nodes/labels per video (earth-tube 85°F→68°F, thermal mass over 24h,
// a growth cycle, etc.). Palette-aware (reads COLORS), so it adapts per niche.
//
// The curve draws in (stroke dash), nodes pop in sequence, labels fade up.
export type JourneyNode = {
  label: string;
  sub?: string;
  level: number; // 0 (low) .. 1 (high) — vertical position on the curve
};

const ACCENTS = {
  accent: COLORS.accent,
  amber: COLORS.amber,
  good: COLORS.good,
  cold: COLORS.cold,
  danger: COLORS.danger,
} as const;

// Catmull-Rom → cubic bezier smooth path through points.
const smoothPath = (pts: { x: number; y: number }[]) => {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

const BOX_W = 1560;
const BOX_H = 760;

export const ValueJourney: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  nodes: JourneyNode[];
  startValue?: string;
  startLabel?: string;
  endValue?: string;
  endLabel?: string;
  accent?: keyof typeof ACCENTS;
  hue?: "blue" | "cold" | "amber" | "red";
}> = ({
  durationInFrames,
  eyebrow,
  title,
  nodes,
  startValue,
  startLabel,
  endValue,
  endLabel,
  accent = "good",
  hue = "cold",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: SPRING_SOFT });
  const C = ACCENTS[accent];

  const padX = 250;
  const top = 250;
  const bottom = 600;
  const n = nodes.length;
  const pts = nodes.map((nd, i) => ({
    x: padX + (i * (BOX_W - padX * 2)) / Math.max(1, n - 1),
    y: interpolate(nd.level, [0, 1], [bottom, top]),
  }));
  const path = smoothPath(pts);

  // draw-in progress (uses normalized pathLength=1)
  const draw = interpolate(enter, [0, 1], [0, 1]);

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={48} drift={0.5}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        {(eyebrow || title) && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", opacity: enter }}>
            {eyebrow && (
              <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 700, textTransform: "uppercase", color: COLORS.textDim }}>
                {eyebrow}
              </div>
            )}
            {title && (
              <div style={{ fontSize: 52, fontWeight: 800, color: COLORS.text, marginTop: 8 }}>{title}</div>
            )}
          </div>
        )}

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="vjFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C} stopOpacity="0.28" />
              <stop offset="100%" stopColor={C} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* soft area fill under the curve (fades in after the line draws) */}
          <path
            d={`${path} L ${pts[n - 1].x} ${bottom + 80} L ${pts[0].x} ${bottom + 80} Z`}
            fill="url(#vjFill)"
            opacity={interpolate(enter, [0.5, 1], [0, 1], { extrapolateLeft: "clamp" })}
          />

          {/* the journey line, drawing in */}
          <path
            d={path}
            fill="none"
            stroke={C}
            strokeWidth={9}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
            style={{ filter: `drop-shadow(0 6px 16px ${C}66)` }}
          />

          {/* node badges + labels, popping in sequence as the line reaches them */}
          {pts.map((p, i) => {
            const reach = i / Math.max(1, n - 1);
            const pop = interpolate(draw, [reach - 0.04, reach + 0.06], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const above = p.y > (top + bottom) / 2; // if node is low, label above
            const labelY = above ? p.y - 64 : p.y + 64;
            return (
              <g key={i} opacity={pop} transform={`scale(${0.6 + pop * 0.4})`} style={{ transformOrigin: `${p.x}px ${p.y}px` }}>
                <circle cx={p.x} cy={p.y} r={26} fill={C} stroke={COLORS.bg0} strokeWidth={5} />
                <text x={p.x} y={p.y + 8} textAnchor="middle" fontSize={26} fontWeight={900} fill={COLORS.bg0} fontFamily={FONT_STACK}>
                  {i + 1}
                </text>
                <text x={p.x} y={labelY} textAnchor="middle" fontSize={28} fontWeight={800} fill={COLORS.text} fontFamily={FONT_STACK}>
                  {nodes[i].label}
                </text>
                {nodes[i].sub && (
                  <text x={p.x} y={labelY + (above ? -30 : 30)} textAnchor="middle" fontSize={21} fontWeight={600} fill={COLORS.textSoft} fontFamily={FONT_STACK}>
                    {nodes[i].sub}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* big start / end values flanking the curve */}
        {startValue && (
          <SideValue value={startValue} label={startLabel} x={40} align="left" opacity={enter} color={COLORS.textSoft} />
        )}
        {endValue && (
          <SideValue value={endValue} label={endLabel} x={40} align="right" opacity={interpolate(enter, [0.6, 1], [0, 1], { extrapolateLeft: "clamp" })} color={C} />
        )}
      </div>
    </SceneFrame>
  );
};

const SideValue: React.FC<{
  value: string;
  label?: string;
  x: number;
  align: "left" | "right";
  opacity: number;
  color: string;
}> = ({ value, label, x, align, opacity, color }) => (
  <div
    style={{
      position: "absolute",
      [align]: x,
      top: "50%",
      transform: "translateY(-50%)",
      textAlign: align,
      opacity,
    }}
  >
    <div style={{ fontSize: 84, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
    {label && (
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.textDim, marginTop: 6, letterSpacing: 1 }}>
        {label}
      </div>
    )}
  </div>
);
