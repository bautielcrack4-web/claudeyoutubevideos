import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { MG, HEAD, BODY, pill, glow } from "../theme";
import { MediaBg, VW, VH, px, py } from "./_shared";
import { blurIn, overshoot } from "../lib/draw";
import { Cue, MGFX } from "./Sfx";

// #8 — RangeCounter
// A big number counts up in the lower-left while range "patches" grow on a map
// behind it (each patch appears at its own progress threshold). Optional legend
// chip top-left. A data-over-time beat (e.g. "1,133 beavers in 1900").
export const RangeCounter: React.FC<{
  value: number;
  label: string; // caption under the number, e.g. "BEAVERS IN 1900"
  bg?: string; // map image
  patches?: { x: number; y: number; r: number; at?: number }[]; // %/% , r in px, at∈0..1
  legend?: string;
  countFrames?: number;
  decimals?: number;
  sound?: boolean; // play the counter-up SFX (default true)
  startAt?: number;
  durationInFrames?: number;
}> = ({
  value,
  label,
  bg,
  patches = [],
  legend,
  countFrames = 40,
  decimals = 0,
  sound = true,
  startAt = 0,
  durationInFrames,
}) => {
  const frame = useCurrentFrame() - startAt;

  const COUNT_AT = 8;
  const prog = interpolate(frame, [COUNT_AT, COUNT_AT + countFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const shown = (value * prog).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  // number entrance: rack-focus blur + tiny elastic scale, then a settle "land"
  const numBlur = blurIn(frame, COUNT_AT, 12, 10);
  const numScale = 0.94 + overshoot(frame, COUNT_AT, countFrames, 0.06) * 0.06;

  return (
    <AbsoluteFill>
      {sound && <Cue at={COUNT_AT} src={MGFX.counterUp} volume={0.45} durationInFrames={countFrames + 10} />}
      <MediaBg src={bg} darken={0.18} duration={durationInFrames} />
      {/* range patches */}
      <AbsoluteFill>
        <svg width="100%" height="100%" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none">
          {patches.map((p, i) => {
            const at = p.at ?? i / Math.max(1, patches.length);
            const g = interpolate(prog, [at, Math.min(1, at + 0.18)], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <circle
                key={i}
                cx={px(p.x)}
                cy={py(p.y)}
                r={p.r * g}
                fill="#A9794A"
                opacity={0.78 * g}
                style={{ filter: "blur(2px)" }}
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* legend chip */}
      {legend && (
        <div
          style={{
            position: "absolute",
            top: "7%",
            left: "4%",
            ...pill(8),
            padding: "8px 16px",
            color: MG.textSoft,
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 24,
            opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {legend}
        </div>
      )}

      {/* big number + label, lower-left */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 60px 60px" }}>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 800,
            fontSize: 150,
            lineHeight: 0.95,
            color: MG.text,
            textShadow: `0 4px 24px rgba(0,0,0,.7), ${glow(MG.cyan, 0.2)}`,
            transform: `scale(${numScale})`,
            transformOrigin: "left bottom",
            filter: numBlur > 0.2 ? `blur(${numBlur}px)` : undefined,
          }}
        >
          {shown}
        </div>
        <div
          style={{
            marginTop: 10,
            ...pill(8),
            padding: "8px 18px",
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: MG.text,
          }}
        >
          {label}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
