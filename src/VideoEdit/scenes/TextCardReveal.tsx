import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK, glass } from "../theme";

// Rule 5 — presenter is pushed to the right by Main's reframe; here we render a
// soft blurred backing on the left and a stack of dark glass text bubbles that
// animate in one by one. Designed to occupy the freed left side.
export const TextCardReveal: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  lines: string[];
  accent?: string;
}> = ({ durationInFrames, eyebrow, lines, accent = "#FFFFFF" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({
    frame: frame - (durationInFrames - 16),
    fps,
    config: { damping: 200 },
  });
  const exitOp = interpolate(exit, [0, 1], [1, 0]);

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      {/* freed-left content column */}
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
          gap: 26,
          opacity: exitOp,
        }}
      >
        {eyebrow && (
          <Bubble index={0} frame={frame} fps={fps} accent={accent} eyebrow>
            {eyebrow}
          </Bubble>
        )}
        {lines.map((l, i) => (
          <Bubble
            key={i}
            index={(eyebrow ? 1 : 0) + i}
            frame={frame}
            fps={fps}
            accent={accent}
          >
            {l}
          </Bubble>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Bubble: React.FC<{
  index: number;
  frame: number;
  fps: number;
  accent: string;
  eyebrow?: boolean;
  children: React.ReactNode;
}> = ({ index, frame, fps, accent, eyebrow, children }) => {
  const delay = 8 + index * 9;
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.7 } });
  const x = interpolate(s, [0, 1], [-70, 0]);
  const op = interpolate(s, [0, 1], [0, 1]);
  const blur = interpolate(s, [0, 1], [10, 0]);

  if (eyebrow) {
    return (
      <div
        style={{
          opacity: op,
          transform: `translateX(${x}px)`,
          color: accent,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: 6,
          textTransform: "uppercase",
          filter: `blur(${blur}px)`,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        ...glass("light"),
        borderRadius: 26,
        padding: "26px 34px",
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: op,
        transform: `translateX(${x}px)`,
        filter: `blur(${blur}px)`,
        width: "fit-content",
        maxWidth: "100%",
      }}
    >
      {/* sparkle bullet */}
      <svg width={26} height={26} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        <path
          d="M12 2 L13.6 9.2 L21 12 L13.6 14.8 L12 22 L10.4 14.8 L3 12 L10.4 9.2 Z"
          fill={accent}
        />
      </svg>
      <span style={{ color: COLORS.text, fontSize: 40, fontWeight: 700, lineHeight: 1.15 }}>
        {children}
      </span>
    </div>
  );
};
