import React from "react";
import { AbsoluteFill, Img, interpolate, spring } from "remotion";
import { C, CAVEAT, HAND, POP, SOFT } from "./theme";

// Re-export theme tokens so scenes can import everything from the kit.
export { C, CAVEAT, HAND, POP, SOFT, sec, FPS } from "./theme";

// =============================================================================
// Stickman / doodle explainer component kit.
// Everything is drawn on a white "paper" with bold ink lines, a hand-drawn
// "boil" wobble, and spring-based motion. Compose these per scene — the goal is
// one punchy idea per scene, not a wall of widgets.
// =============================================================================

// A few-times-per-second seed shift drives the line "boil" so strokes look
// hand-drawn. Reuse this id inside any SVG and wrap drawn paths in <g filter>.
export const boilId = (frame: number) => `boil${Math.floor(frame / 5) % 8}`;
export const BoilDefs: React.FC<{ frame: number; scale?: number }> = ({
  frame,
  scale = 2.2,
}) => {
  const seed = Math.floor(frame / 5) % 8;
  return (
    <defs>
      <filter id={`boil${seed}`} x="-25%" y="-25%" width="150%" height="150%">
        <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={2} seed={seed} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} />
      </filter>
    </defs>
  );
};

// Off-white background. Optional faint grid like a notebook / whiteboard.
export const Paper: React.FC<{ grid?: boolean; children?: React.ReactNode }> = ({
  grid,
  children,
}) => (
  <AbsoluteFill style={{ background: C.paper }}>
    {grid && (
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(#0000000a 1px,transparent 1px),linear-gradient(90deg,#0000000a 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    )}
    {children}
  </AbsoluteFill>
);

// Element-level entrance: pop + rise + fade. Use for any card/text/figure so
// nothing just "appears". Returns a style object you spread onto a wrapper.
export const useReveal = (
  frame: number,
  fps: number,
  delay = 0,
  rise = 40,
): React.CSSProperties => {
  const s = spring({ frame: frame - delay, fps, config: SOFT });
  return {
    opacity: s,
    transform: `translateY(${interpolate(s, [0, 1], [rise, 0])}px) scale(${interpolate(
      s,
      [0, 1],
      [0.9, 1],
    )})`,
  };
};

// Handwritten line of text that pops in. Big = CAVEAT, small label = HAND.
export const HandText: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  font?: string;
  weight?: number;
  frame: number;
  fps: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 90, color = C.ink, font = CAVEAT, weight = 700, frame, fps, delay = 0, style }) => {
  const s = spring({ frame: frame - delay, fps, config: POP });
  return (
    <div
      style={{
        fontFamily: font,
        fontSize: size,
        color,
        fontWeight: weight,
        lineHeight: 1.05,
        transform: `scale(${s})`,
        transformOrigin: "left center",
        opacity: interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Hand-drawn underline that draws itself in. progress 0..1.
export const Underline: React.FC<{ progress: number; w: number; color?: string; thickness?: number }> = ({
  progress,
  w,
  color = C.ink,
  thickness = 7,
}) => {
  const len = 600;
  return (
    <svg width={w} height={26} viewBox="0 0 600 26" style={{ overflow: "visible" }}>
      <path
        d="M6,16 C140,4 320,24 480,10 C540,5 580,12 594,14"
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - Math.max(0, Math.min(1, progress)))}
      />
    </svg>
  );
};

// Pop-in speech bubble with a little tail. Great for reactions / multipliers.
export const SpeechBubble: React.FC<{
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  tail?: "left" | "right" | "bottom" | "none";
  size?: number;
  frame: number;
  fps: number;
  delay?: number;
}> = ({ children, color = C.amber, textColor = C.ink, tail = "bottom", size = 48, frame, fps, delay = 0 }) => {
  const s = spring({ frame: frame - delay, fps, config: POP });
  return (
    <div style={{ position: "relative", display: "inline-block", transform: `scale(${s})`, transformOrigin: "center bottom" }}>
      <div
        style={{
          background: color,
          border: `4px solid ${C.ink}`,
          borderRadius: 36,
          padding: "10px 30px",
          fontFamily: HAND,
          fontSize: size,
          fontWeight: 700,
          color: textColor,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>
      {tail !== "none" && (
        <div
          style={{
            position: "absolute",
            width: 22,
            height: 22,
            background: color,
            border: `4px solid ${C.ink}`,
            borderTop: "none",
            borderLeft: "none",
            transform: "rotate(45deg)",
            ...(tail === "bottom" && { bottom: -12, left: "50%", marginLeft: -11 }),
            ...(tail === "left" && { left: -12, top: "50%", marginTop: -11, transform: "rotate(135deg)" }),
            ...(tail === "right" && { right: -12, top: "50%", marginTop: -11, transform: "rotate(-45deg)" }),
          }}
        />
      )}
    </div>
  );
};

// Real brand logo. TWO ways to supply it:
//   slug  -> Simple Icons CDN (monochrome, brand-colored). Fast, but NOT every
//            brand is on Simple Icons — openai, microsoft, many AI labs 404.
//            A failing <Img> CRASHES the render, so VERIFY a slug exists first
//            (curl https://cdn.simpleicons.org/<slug>) before shipping it.
//   src   -> a staticFile("logos/foo.svg") you downloaded into public/. This is
//            the reliable, offline path — prefer it for anything important or
//            for full-color logos (Simple Icons is monochrome only).
// Pass color (hex w/o #) to tint a slug logo for contrast on the white paper.
export const Logo: React.FC<{
  slug?: string;
  src?: string;
  size?: number;
  color?: string;
}> = ({ slug, src, size = 80, color }) => {
  const url = src ?? `https://cdn.simpleicons.org/${slug}${color ? `/${color}` : ""}`;
  return <Img src={url} style={{ width: size, height: size, objectFit: "contain" }} />;
};

// Count-up number. Handles $ / B / % via prefix+suffix.
export const Counter: React.FC<{
  to: number;
  from?: number;
  frame: number;
  fps: number;
  delay?: number;
  dur?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  style?: React.CSSProperties;
}> = ({ to, from = 0, frame, fps, delay = 0, dur = 24, prefix = "", suffix = "", decimals = 0, style }) => {
  const t = interpolate(frame - delay, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const v = from + (to - from) * t;
  return (
    <span style={{ fontFamily: HAND, fontWeight: 700, ...style }}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export type BarSpec = {
  label?: string;
  logoSlug?: string; // Simple Icons slug (verify it exists!)
  logoSrc?: string; // staticFile("logos/x.svg") — reliable, full-color OK
  value: number;
  display: string; // shown above the bar, e.g. "$850B"
  color?: string;
  hatch?: boolean; // hollow/striped for secondary series
};

// Animated bar chart — the workhorse for "company X vs Y" graphics.
// Bars grow with a staggered spring; values fade in once a bar is mostly full;
// axis draws itself. Put real logos under bars with logoSlug.
export const BarChart: React.FC<{
  bars: BarSpec[];
  max: number;
  frame: number;
  fps: number;
  width?: number;
  height?: number;
  barW?: number;
  gap?: number;
}> = ({ bars, max, frame, fps, width = 1000, height = 600, barW = 130, gap = 90 }) => {
  const baseY = height - 90;
  const top = 60;
  const usableH = baseY - top;
  const axis = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const startX = 110;
  const xOf = (i: number) => startX + i * (barW + gap);

  // Logos must be HTML <Img> (Remotion waits for them via delayRender). SVG
  // <image href> from a remote CDN does NOT load reliably during render, so we
  // overlay logos as positioned HTML on top of the chart svg.
  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
        <BoilDefs frame={frame} scale={1.6} />
        <g filter={`url(#${boilId(frame)})`}>
          <line
            x1={startX - 20}
            y1={baseY}
            x2={startX - 20 + (width - startX) * axis}
            y2={baseY}
            stroke={C.ink}
            strokeWidth={5}
            strokeLinecap="round"
          />
          {bars.map((b, i) => {
            const g = spring({ frame: frame - 8 - i * 12, fps, config: SOFT });
            const h = (b.value / max) * usableH * g;
            const x = xOf(i);
            const col = b.color ?? C.green;
            return (
              <g key={i}>
                {b.hatch && (
                  <defs>
                    <pattern id={`hatch${i}`} width={12} height={12} patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                      <rect width={12} height={12} fill={C.paper} />
                      <line x1={0} y1={0} x2={0} y2={12} stroke={col} strokeWidth={6} />
                    </pattern>
                  </defs>
                )}
                <rect x={x} y={baseY - h} width={barW} height={h} rx={4} fill={b.hatch ? `url(#hatch${i})` : col} stroke={C.ink} strokeWidth={4} />
                <text x={x + barW / 2} y={baseY - h - 16} textAnchor="middle" fontFamily={HAND} fontSize={40} fill={C.ink} opacity={g > 0.85 ? 1 : 0}>
                  {b.display}
                </text>
                {!b.logoSlug && !b.logoSrc && (
                  <text x={x + barW / 2} y={baseY + 46} textAnchor="middle" fontFamily={HAND} fontSize={34} fill={C.ink}>
                    {b.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      {bars.map((b, i) =>
        b.logoSlug || b.logoSrc ? (
          <div key={i} style={{ position: "absolute", left: xOf(i) + barW / 2 - 28, top: baseY + 14, width: 56, height: 56 }}>
            <Logo slug={b.logoSlug} src={b.logoSrc} size={56} />
          </div>
        ) : null,
      )}
    </div>
  );
};

// Hand-drawn arrow that draws itself in. Curves slightly for an organic feel.
export const DrawnArrow: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  progress: number;
  color?: string;
  bow?: number; // sideways curve amount
  thickness?: number;
}> = ({ from, to, progress, color = C.ink, bow = 40, thickness = 7 }) => {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  // perpendicular offset for the control point
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * bow;
  const cy = my + (dx / len) * bow;
  const d = `M${from.x},${from.y} Q${cx},${cy} ${to.x},${to.y}`;
  const DASH = 1200;
  const p = Math.max(0, Math.min(1, progress));
  // arrowhead angle from control point -> tip
  const ang = Math.atan2(to.y - cy, to.x - cx);
  const ah = 26;
  const head = `M${to.x},${to.y} L${to.x - ah * Math.cos(ang - 0.5)},${to.y - ah * Math.sin(ang - 0.5)} M${to.x},${to.y} L${to.x - ah * Math.cos(ang + 0.5)},${to.y - ah * Math.sin(ang + 0.5)}`;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width="100%" height="100%">
      <BoilDefs frame={Math.floor(progress * 30)} scale={1.5} />
      <g fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round">
        <path d={d} strokeDasharray={DASH} strokeDashoffset={DASH * (1 - p)} />
        {p > 0.85 && <path d={head} />}
      </g>
    </svg>
  );
};

// Hand-drawn circle/ellipse that draws on to emphasize something.
export const CircleMark: React.FC<{
  x: number;
  y: number;
  rx: number;
  ry?: number;
  progress: number;
  color?: string;
  thickness?: number;
}> = ({ x, y, rx, ry, progress, color = C.red, thickness = 7 }) => {
  const r2 = ry ?? rx;
  const DASH = 2 * Math.PI * ((rx + r2) / 2);
  const p = Math.max(0, Math.min(1, progress));
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width="100%" height="100%">
      <BoilDefs frame={Math.floor(progress * 30)} scale={2} />
      <g filter={`url(#${boilId(Math.floor(progress * 30))})`}>
        <ellipse cx={x} cy={y} rx={rx} ry={r2} fill="none" stroke={color} strokeWidth={thickness} strokeDasharray={DASH} strokeDashoffset={DASH * (1 - p)} transform={`rotate(-8 ${x} ${y})`} />
      </g>
    </svg>
  );
};

// Checklist with hand-drawn checks that appear one by one (stagger).
// Also useful for "shopping list" / "what you need" beats.
export const Checklist: React.FC<{
  items: string[];
  frame: number;
  fps: number;
  delay?: number;
  gap?: number;
  size?: number;
  color?: string;
}> = ({ items, frame, fps, delay = 0, gap = 18, size = 46, color = C.green }) => (
  <div style={{ display: "flex", flexDirection: "column", gap }}>
    {items.map((it, i) => {
      const s = spring({ frame: frame - delay - i * 14, fps, config: POP });
      return (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, opacity: s }}>
          <svg width={size} height={size} viewBox="0 0 50 50" style={{ flexShrink: 0 }}>
            <path d="M6,8 h38 v38 h-38 Z" fill="none" stroke={C.ink} strokeWidth={4} />
            <path
              d="M12,26 L22,38 L40,12"
              fill="none"
              stroke={color}
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={70}
              strokeDashoffset={70 * (1 - s)}
            />
          </svg>
          <span style={{ fontFamily: HAND, fontSize: size, color: C.ink, fontWeight: 700 }}>{it}</span>
        </div>
      );
    })}
  </div>
);
