import { Fragment } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";

// GENERIC big animated STAT / counter. Topic-agnostic — pass the figure per video
// (a temperature drop, a count, a saving, a %). The number COUNTS UP from 0 with
// ticking SFX, lands with an impact, a ring/underline draws under it, a caption
// rises. Rule 14: number animates, ring draws, caption rises, faint breathing
// glow — each beat with its own SFX (counter ticks + a landing impact).
const TONES = {
  accent: COLORS.accent,
  amber: COLORS.amber,
  good: COLORS.good,
  cold: COLORS.cold,
  danger: COLORS.danger,
} as const;

export const StatBig: React.FC<{
  durationInFrames: number;
  value: number; // numeric target for the count-up
  prefix?: string; // e.g. "−", "$"
  suffix?: string; // e.g. "°F", "%", "×"
  decimals?: number;
  label?: string; // caption under the number
  eyebrow?: string;
  accent?: keyof typeof TONES;
  hue?: "blue" | "cold" | "amber" | "red";
  startAt?: number;
  countFrames?: number; // how long the count-up runs (default sec(1.1))
  ticks?: number; // number of audible ticks during the count (default 6)
}> = ({
  durationInFrames,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  eyebrow,
  accent = "accent",
  hue = "cold",
  startAt = sec(0.5),
  countFrames = sec(1.1),
  ticks = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = TONES[accent];

  const enter = spring({ frame: frame - startAt, fps, config: SPRING_SOFT });
  const count = interpolate(frame, [startAt, startAt + countFrames], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shown = count.toFixed(decimals);

  // pop on landing
  const landAt = startAt + countFrames;
  const land = spring({ frame: frame - landAt, fps, config: { damping: 11, mass: 0.7, stiffness: 200 } });
  const landScale = 1 + interpolate(land, [0, 0.5, 1], [0, 0.08, 0], { extrapolateRight: "clamp" });

  // ring + caption after landing
  const ring = spring({ frame: frame - (landAt + sec(0.1)), fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const cap = spring({ frame: frame - (landAt + sec(0.35)), fps, config: SPRING_SOFT });
  const glow = 0.5 + 0.5 * Math.sin(frame / 22);

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={48} drift={0.4}>
      <div
        style={{
          position: "relative",
          fontFamily: FONT_STACK,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SfxCue at={startAt} src={SFX.numberRoll} volume={0.4} durationInFrames={countFrames} />

        {eyebrow && (
          <div style={{ letterSpacing: 7, fontSize: 22, fontWeight: 700, textTransform: "uppercase", color: COLORS.textDim, marginBottom: 18, opacity: enter }}>
            {eyebrow}
          </div>
        )}

        <div style={{ position: "relative", transform: `scale(${(0.7 + enter * 0.3) * landScale * interpolate(frame, [startAt, landAt], [1, 1.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }}>
          <div
            style={{
              fontSize: 280,
              fontWeight: 900,
              lineHeight: 0.95,
              color: C,
              textShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 ${30 + glow * 26}px ${C}66`,
              display: "flex",
              alignItems: "baseline",
            }}
          >
            {prefix && <span style={{ fontSize: 150, fontWeight: 800 }}>{prefix}</span>}
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{shown}</span>
            {suffix && <span style={{ fontSize: 130, fontWeight: 800, marginLeft: 6 }}>{suffix}</span>}
          </div>

          {/* underline ring drawing on under the number */}
          <svg viewBox="0 0 600 60" style={{ position: "absolute", left: "50%", top: "100%", width: 520, height: 60, transform: "translate(-50%, -6px)", overflow: "visible" }}>
            <path
              d="M 20 34 C 170 10, 320 52, 470 24 C 520 14, 560 28, 580 32"
              fill="none"
              stroke={C}
              strokeWidth={9}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - ring}
              style={{ filter: `drop-shadow(0 0 8px ${C}aa)` }}
            />
          </svg>
        </div>

        {label && (
          <div
            style={{
              marginTop: 56,
              fontSize: 34,
              fontWeight: 700,
              color: COLORS.textSoft,
              letterSpacing: 0.5,
              textAlign: "center",
              maxWidth: 900,
              opacity: cap,
              transform: `translateY(${(1 - cap) * 18}px)`,
            }}
          >
            {label}
          </div>
        )}

        {/* SFX: ticks during the count-up, then an impact when it lands */}
        {Array.from({ length: ticks }).map((_, i) => (
          <Fragment key={"tk" + i}>
            <SfxCue at={Math.round(startAt + (countFrames * (i + 1)) / ticks)} src={SFX.digitTick} volume={0.3} durationInFrames={sec(0.2)} />
          </Fragment>
        ))}
        <SfxCue at={landAt} src={SFX.numberSlam} volume={0.55} />
      </div>
    </SceneFrame>
  );
};
