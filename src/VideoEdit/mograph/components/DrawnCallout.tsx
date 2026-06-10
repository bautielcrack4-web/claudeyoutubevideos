import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { MG, BODY, pill, glow, Accent, accentHex } from "../theme";
import { MediaBg, VW, VH, px, py } from "./_shared";
import { curvedPath, curvedLen, pointOnCurve, useDraw, idle, pulse } from "../lib/draw";

// #11 — DrawnCallout
// A hand-drawn curved arrow that draws itself from a label pill toward a target
// point in the footage, with an arrowhead that appears at the tip. The pill pops
// in first, then the arrow draws. Annotates a subject in a photo/clip.
//
// Coords are PERCENT (0..100) of the frame. `target` = the point being pointed
// at; `label` pill sits at `labelPos` (defaults to up-left of the target).
export const DrawnCallout: React.FC<{
  label: string;
  target: { x: number; y: number };
  labelPos?: { x: number; y: number };
  curve?: number; // bow of the arrow (px on the 1920×1080 canvas)
  accent?: Accent | "white";
  bg?: string;
  startAt?: number;
  durationInFrames?: number;
}> = ({
  label,
  target,
  labelPos,
  curve = 90,
  accent = "white",
  bg,
  startAt = 0,
  durationInFrames,
}) => {
  const frame = useCurrentFrame() - startAt;
  const { fps } = useVideoConfig();
  const stroke = accent === "white" ? "#FFFFFF" : accentHex(accent);

  const lp = labelPos ?? { x: target.x + 14, y: target.y - 16 };
  // arrow starts just under the pill, ends a touch short of the target dot
  const from = { x: px(lp.x), y: py(lp.y) + 26 };
  const to = { x: px(target.x), y: py(target.y) };
  const d = curvedPath(from, to, curve);
  const len = curvedLen(from, to, curve);

  // pill pop
  const pop = spring({ frame, fps, config: { damping: 13, mass: 0.6, stiffness: 200 } });
  // arrow draws after pill
  const draw = useDraw(frame, len, 8, 22);
  // arrowhead + target dot appear once the line is ~drawn
  const headIn = interpolate(frame, [26, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tip = pointOnCurve(from, to, curve, 1);

  return (
    <AbsoluteFill>
      <MediaBg src={bg} duration={durationInFrames} />
      <AbsoluteFill>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          <path
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={draw.strokeDasharray}
            strokeDashoffset={draw.strokeDashoffset}
            style={{ filter: `drop-shadow(0 2px 6px rgba(0,0,0,.55))` }}
          />
          {/* arrowhead */}
          <g
            transform={`translate(${tip.x} ${tip.y}) rotate(${tip.angle}) scale(${headIn})`}
            opacity={headIn}
          >
            <path
              d="M 0 0 L -24 -10 M 0 0 L -24 10"
              stroke={stroke}
              strokeWidth={5}
              strokeLinecap="round"
              fill="none"
              style={{ filter: `drop-shadow(0 2px 6px rgba(0,0,0,.55))` }}
            />
          </g>
          {/* target dot — gentle breathing glow once it lands */}
          <circle
            cx={to.x}
            cy={to.y}
            r={7 * headIn * (headIn >= 1 ? pulse(frame, 40, 0.14) : 1)}
            fill={stroke}
            opacity={headIn}
            style={{ filter: `drop-shadow(0 0 ${6 * headIn}px ${stroke})` }}
          />
        </svg>

        {/* label pill */}
        <div
          style={{
            position: "absolute",
            left: `${lp.x}%`,
            top: `${lp.y}%`,
            transform: `translate(calc(-50% + ${idle(frame, 1, 3).x}px), calc(-50% + ${idle(frame, 1, 3).y}px)) scale(${interpolate(pop, [0, 1], [0.8, 1])})`,
            opacity: pop,
            ...pill(10),
            padding: "12px 20px",
            color: MG.text,
            fontFamily: BODY,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            textShadow: accent !== "white" ? glow(stroke, 0.5) : undefined,
          }}
        >
          {label}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
