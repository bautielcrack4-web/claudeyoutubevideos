import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { MG, BODY, glow } from "../theme";
import { MediaBg, VW, VH, px, py } from "./_shared";
import { useDraw, pulse, blurIn } from "../lib/draw";

// #9 — LocationPin
// A pulsing red target reticle dropped on a satellite/photo background, with a
// hand-drawn underline that sweeps out to a place label. The reticle scales in
// then breathes; the underline draws; the label types/fades alongside it.
export const LocationPin: React.FC<{
  bg?: string;
  x: number; // % position of the pin
  y: number;
  label: string;
  labelSide?: "right" | "left";
  earthZoom?: boolean; // Google-Earth-Studio push-in toward the pin, then drop
  startAt?: number;
  durationInFrames?: number;
}> = ({
  bg,
  x,
  y,
  label,
  labelSide = "right",
  earthZoom = false,
  startAt = 0,
  durationInFrames,
}) => {
  const frame = useCurrentFrame() - startAt;
  const { fps } = useVideoConfig();

  // when zooming in from "space", hold the reticle until the push settles
  const dropDelay = earthZoom ? 28 : 0;
  const drop = spring({ frame: frame - dropDelay, fps, config: { damping: 11, mass: 0.6, stiffness: 220 } });
  const breathe = pulse(frame, 34, 0.16);
  const ringExpand = (frame % 40) / 40; // outward radar ping
  const cx = px(x);
  const cy = py(y);

  // underline from pin out to the label
  const dir = labelSide === "right" ? 1 : -1;
  const ux1 = cx + 26 * dir;
  const ux2 = cx + 250 * dir;
  const uline = useDraw(frame, Math.abs(ux2 - ux1), 10 + dropDelay, 16);

  const labelIn = interpolate(frame, [16 + dropDelay, 26 + dropDelay], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <MediaBg
        src={bg}
        duration={durationInFrames}
        zoom={1.12}
        fromScale={earthZoom ? 3 : 1.02}
        zoomFrames={32}
        originX={x}
        originY={y}
      />
      <AbsoluteFill>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          {/* radar ping ring */}
          <circle
            cx={cx}
            cy={cy}
            r={18 + ringExpand * 46}
            fill="none"
            stroke={MG.red}
            strokeWidth={3}
            opacity={(1 - ringExpand) * 0.7 * drop}
          />
          {/* reticle */}
          <g
            transform={`translate(${cx} ${cy}) scale(${drop * breathe})`}
            opacity={drop}
            style={{ filter: `drop-shadow(0 0 10px ${MG.red})` }}
          >
            <circle r={20} fill="none" stroke={MG.red} strokeWidth={4} />
            <circle r={6} fill={MG.red} />
            <path
              d="M 0 -30 L 0 -20 M 0 20 L 0 30 M -30 0 L -20 0 M 20 0 L 30 0"
              stroke={MG.red}
              strokeWidth={4}
              strokeLinecap="round"
            />
          </g>
          {/* underline */}
          <line
            x1={ux1}
            y1={cy + 4}
            x2={ux2}
            y2={cy + 4}
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={uline.strokeDasharray}
            strokeDashoffset={uline.strokeDashoffset}
            style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,.6))" }}
          />
        </svg>

        {/* label */}
        <div
          style={{
            position: "absolute",
            left: `${x + dir * 1.6}%`,
            top: `${y - 3.2}%`,
            transform: `translate(${labelSide === "right" ? "0" : "-100%"},-50%) translateX(${interpolate(labelIn, [0, 1], [dir * -20, 0])}px)`,
            opacity: labelIn,
            filter: (() => { const b = blurIn(frame, 16 + dropDelay, 10, 7); return b > 0.2 ? `blur(${b}px)` : undefined; })(),
            color: "#FFFFFF",
            fontFamily: BODY,
            fontWeight: 800,
            fontSize: 52,
            letterSpacing: 1,
            textShadow: `0 2px 14px rgba(0,0,0,.8), ${glow(MG.cyan, 0.25)}`,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
