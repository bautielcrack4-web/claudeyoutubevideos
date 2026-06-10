import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { MG, BODY, pill, Accent, accentHex } from "../theme";
import { MediaBg, VW, VH, px, py } from "./_shared";
import { curvedPath, curvedLen, pointOnCurve, useDraw, pulse } from "../lib/draw";

// #10 — RouteMap
// A curved route line draws itself across a (usually desaturated) map from an
// origin to a destination, leaving a pulsing dot + a label pill at the end.
export const RouteMap: React.FC<{
  bg?: string;
  from: { x: number; y: number }; // %
  to: { x: number; y: number };
  label: string;
  curve?: number;
  accent?: Accent;
  earthZoom?: boolean; // push-in toward the route midpoint before drawing
  startAt?: number;
  durationInFrames?: number;
}> = ({
  bg,
  from,
  to,
  label,
  curve = 120,
  accent = "red",
  earthZoom = false,
  startAt = 0,
  durationInFrames,
}) => {
  const frame = useCurrentFrame() - startAt;
  const { fps } = useVideoConfig();
  const col = accentHex(accent);

  const a = { x: px(from.x), y: py(from.y) };
  const b = { x: px(to.x), y: py(to.y) };
  const d = curvedPath(a, b, curve);
  const len = curvedLen(a, b, curve);
  const drawDelay = earthZoom ? 26 : 0;
  const draw = useDraw(frame, len, 6 + drawDelay, 34);
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  const tip = pointOnCurve(a, b, curve, Math.min(1, draw.progress));
  const endIn = spring({
    frame: frame - (36 + drawDelay),
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 200 },
  });
  const breathe = pulse(frame, 32, 0.22);
  const originIn = interpolate(frame, [4 + drawDelay, 12 + drawDelay], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill>
      <MediaBg
        src={bg}
        desaturate
        duration={durationInFrames}
        zoom={1.06}
        fromScale={earthZoom ? 2.6 : 1.02}
        zoomFrames={30}
        originX={midX}
        originY={midY}
      />
      {/* light wash so the red line reads on a busy map */}
      <AbsoluteFill style={{ background: "rgba(245,245,245,0.18)" }} />
      <AbsoluteFill>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          {/* origin dot */}
          <circle cx={a.x} cy={a.y} r={9 * originIn} fill={col} opacity={originIn} />
          {/* route */}
          <path
            d={d}
            fill="none"
            stroke={col}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={draw.strokeDasharray}
            strokeDashoffset={draw.strokeDashoffset}
            style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.4))" }}
          />
          {/* moving leading dot */}
          <circle cx={tip.x} cy={tip.y} r={7} fill={col} opacity={draw.progress < 1 ? 1 : 0} />
          {/* destination pulsing dot */}
          <g transform={`translate(${b.x} ${b.y})`} opacity={endIn}>
            <circle r={22 * breathe} fill="none" stroke={col} strokeWidth={3} opacity={0.5} />
            <circle r={9} fill={col} />
          </g>
        </svg>

        {/* destination pill */}
        <div
          style={{
            position: "absolute",
            left: `${to.x + 1.5}%`,
            top: `${to.y - 1}%`,
            transform: `translateY(-50%) scale(${interpolate(endIn, [0, 1], [0.8, 1])})`,
            opacity: endIn,
            ...pill(8),
            padding: "9px 16px",
            color: MG.text,
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 26,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
