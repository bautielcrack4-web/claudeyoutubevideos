import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, glass } from "../theme";
import { SceneFrame } from "../components/SceneFrame";

// Animated physics diagram for the core thesis: "el frío no ENTRA — el calor SALE".
// A central insulation wall separates a warm glowing interior (right) from the
// cold exterior (left). GOLD heat arrows continuously escape outward; STEEL cold
// arrows approach the wall and are BLOCKED (deflect + fade). Premium, fluid, looped.
const BOX_W = 1520;
const BOX_H = 720;
const WALL_X = BOX_W * 0.5;
const WALL_W = 64;

// chevron "►/◄" arrow as an SVG group, pointing left or right
const Arrow: React.FC<{
  x: number;
  y: number;
  color: string;
  dir: "left" | "right";
  opacity: number;
  scale?: number;
}> = ({ x, y, color, dir, opacity, scale = 1 }) => {
  const s = 16 * scale;
  const f = dir === "left" ? -1 : 1;
  return (
    <g
      transform={`translate(${x} ${y})`}
      opacity={opacity}
      style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
    >
      <line x1={-s * 2.2 * f} y1={0} x2={s * 0.6 * f} y2={0} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <polyline
        points={`${-s * f},${-s} ${s * 0.7 * f},0 ${-s * f},${s}`}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </g>
  );
};

const loopT = (frame: number, period: number, offset: number) =>
  ((((frame + offset) % period) + period) % period) / period;

export const HeatFlowDiagram: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  coldLabel?: string;
  heatLabel?: string;
}> = ({
  durationInFrames,
  eyebrow = "La física",
  coldLabel = "El frío no ENTRA",
  heatLabel = "El calor SALE",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: SPRING_SOFT });

  const GOLD = COLORS.accent;
  const STEEL = COLORS.cold;

  // warm core breathing glow
  const breathe = interpolate(Math.sin(frame / 18), [-1, 1], [0.9, 1.08]);

  // heat arrows: escape from interior (right) outward to the left, crossing the wall
  const heatRows = [-200, -120, -40, 40, 120, 200];
  // cold arrows: approach wall from far left, get blocked
  const coldRows = [-160, -55, 55, 160];

  const wallReveal = interpolate(enter, [0, 1], [0, 1]);

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="cold" glowX={66} glowY={50} drift={0.5}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="warmCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.55" />
              <stop offset="45%" stopColor={GOLD} stopOpacity="0.18" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="wallGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={STEEL} stopOpacity="0.32" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0.42" />
            </linearGradient>
          </defs>

          {/* warm interior glow (right) */}
          <circle
            cx={BOX_W * 0.78}
            cy={BOX_H / 2}
            r={360 * breathe}
            fill="url(#warmCore)"
          />

          {/* the insulation wall (center), grows in on enter */}
          <g transform={`translate(${WALL_X} ${BOX_H / 2}) scale(1 ${wallReveal})`}>
            <rect
              x={-WALL_W / 2}
              y={-BOX_H * 0.46}
              width={WALL_W}
              height={BOX_H * 0.92}
              rx={WALL_W / 2}
              fill="url(#wallGrad)"
              stroke="rgba(42,38,32,0.22)"
              strokeWidth={1.5}
            />
            {/* felt texture: horizontal hairlines */}
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={i}
                x1={-WALL_W / 2 + 8}
                x2={WALL_W / 2 - 8}
                y1={-BOX_H * 0.4 + i * (BOX_H * 0.8) / 10}
                y2={-BOX_H * 0.4 + i * (BOX_H * 0.8) / 10}
                stroke="rgba(42,38,32,0.12)"
                strokeWidth={2}
              />
            ))}
          </g>

          {/* HEAT arrows escaping outward (gold), continuous loop */}
          {heatRows.map((dy, i) => {
            const t = loopT(frame, 70, i * 12);
            const x = interpolate(t, [0, 1], [BOX_W * 0.74, BOX_W * 0.3]);
            const op = interpolate(t, [0, 0.12, 0.78, 1], [0, 1, 1, 0]) * enter;
            return <Arrow key={"h" + i} x={x} y={BOX_H / 2 + dy} color={GOLD} dir="left" opacity={op} scale={1.05} />;
          })}

          {/* COLD arrows approaching + blocked at the wall (steel) */}
          {coldRows.map((dy, i) => {
            const t = loopT(frame, 84, i * 18);
            // approach to just before the wall, then bounce back & fade
            const phase = t < 0.5 ? t / 0.5 : 1 - (t - 0.5) / 0.5;
            const x = interpolate(phase, [0, 1], [BOX_W * 0.08, WALL_X - WALL_W * 0.9]);
            const op = interpolate(t, [0, 0.1, 0.45, 0.55, 0.95, 1], [0, 1, 1, 0.85, 0, 0]) * enter;
            // little impact flash near the wall
            const hit = t > 0.45 && t < 0.56;
            return (
              <g key={"c" + i}>
                <Arrow x={x} y={BOX_H / 2 + dy} color={STEEL} dir="right" opacity={op} />
                {hit && (
                  <circle
                    cx={WALL_X - WALL_W * 0.6}
                    cy={BOX_H / 2 + dy}
                    r={interpolate(t, [0.45, 0.56], [4, 22])}
                    fill="none"
                    stroke={STEEL}
                    strokeWidth={3}
                    opacity={interpolate(t, [0.45, 0.56], [0.9, 0])}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* eyebrow */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 0,
            right: 0,
            textAlign: "center",
            letterSpacing: 6,
            fontSize: 19,
            fontWeight: 700,
            textTransform: "uppercase",
            color: COLORS.textDim,
            opacity: enter,
          }}
        >
          {eyebrow}
        </div>

        {/* COLD label (left) */}
        <Label
          text={coldLabel}
          color={STEEL}
          style={{ left: 40, top: BOX_H * 0.5 - 250 }}
          delay={enter}
          blocked
        />
        {/* HEAT label (right) */}
        <Label
          text={heatLabel}
          color={GOLD}
          style={{ right: 40, top: BOX_H * 0.5 + 200 }}
          delay={enter}
        />
      </div>
    </SceneFrame>
  );
};

const Label: React.FC<{
  text: string;
  color: string;
  style: React.CSSProperties;
  delay: number;
  blocked?: boolean;
}> = ({ text, color, style, delay, blocked }) => (
  <div
    style={{
      position: "absolute",
      ...style,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 22px",
      ...glass("light"),
      borderRadius: 18,
      opacity: delay,
      transform: `translateY(${(1 - delay) * 18}px)`,
    }}
  >
    <span
      style={{
        width: 12,
        height: 12,
        borderRadius: 99,
        background: color,
        boxShadow: `0 0 14px ${color}`,
      }}
    />
    <span style={{ color: COLORS.text, fontSize: 30, fontWeight: 800, whiteSpace: "nowrap" }}>
      {text}
    </span>
    {blocked && (
      <span style={{ color, fontSize: 26, fontWeight: 900, marginLeft: 2 }}>⃠</span>
    )}
  </div>
);
