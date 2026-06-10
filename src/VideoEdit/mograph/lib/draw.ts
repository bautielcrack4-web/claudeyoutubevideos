// SVG drawing + motion helpers for the mograph kit. Self-contained (no imports
// from the earthy theme) so the kit stays portable.
import { interpolate, spring, Easing } from "remotion";

// ── Self-drawing stroke ───────────────────────────────────────────────────────
// Returns the {strokeDasharray, strokeDashoffset} pair that animates a path
// "drawing itself" from 0→length over [delay, delay+dur]. Pass the measured
// path length (or a generous overestimate; SVG clamps visually fine).
export const useDraw = (
  frame: number,
  length: number,
  delay = 0,
  dur = 26,
  easing: (n: number) => number = Easing.inOut(Easing.cubic),
) => {
  const p = interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - p),
    progress: p,
  };
};

// ── Curved path between two points ─────────────────────────────────────────────
// Quadratic Bézier from A to B, bowed perpendicular to the A→B line by `curve`
// (px; sign flips the bow side). Used by DrawnCallout arrows and RouteMap lines.
export const curvedPath = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  curve = 60,
): string => {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  // unit normal
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * curve;
  const cy = my + ny * curve;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
};

// Approx length of a quadratic Bézier (chord + control average) — enough for
// stroke-dash animation. Slightly over-estimates, which is harmless.
export const curvedLen = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  curve = 60,
): number => {
  const chord = Math.hypot(to.x - from.x, to.y - from.y);
  return chord + Math.abs(curve) * 0.9;
};

// Point + tangent angle (deg) along the same quadratic Bézier at t∈[0,1].
// Used to place + rotate an arrowhead at the drawn tip.
export const pointOnCurve = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  curve: number,
  t: number,
) => {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * curve;
  const cy = my + (dx / len) * curve;
  const u = 1 - t;
  // position
  const x = u * u * from.x + 2 * u * t * cx + t * t * to.x;
  const y = u * u * from.y + 2 * u * t * cy + t * t * to.y;
  // derivative → tangent
  const tx = 2 * u * (cx - from.x) + 2 * t * (to.x - cx);
  const ty = 2 * u * (cy - from.y) + 2 * t * (to.y - cy);
  const angle = (Math.atan2(ty, tx) * 180) / Math.PI;
  return { x, y, angle };
};

// ── Motion ────────────────────────────────────────────────────────────────────
// Staggered item reveal — spring 0..1 for item i (kit-local copy of anim.stagger).
export const stagger = (
  frame: number,
  fps: number,
  i: number,
  gap = 12,
  delay = 6,
  config = { damping: 16, mass: 0.7, stiffness: 170 },
) => spring({ frame: frame - (delay + i * gap), fps, config });

// Pulsing scale for reticles / live dots — smooth 1↔amp breathing.
export const pulse = (frame: number, period = 36, amp = 0.18) =>
  1 + Math.sin((frame / period) * Math.PI * 2) * amp;

// ── Polish (all GPU-cheap: transform / opacity / short blur only) ─────────────
// Soft focus-in: blur(px) that eases from `max`→0 over [delay, delay+dur]. Pair
// with opacity for a "rack focus" entrance. Short + single-element = render-safe.
export const blurIn = (frame: number, delay = 0, dur = 10, max = 8) =>
  interpolate(frame, [delay, delay + dur], [max, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

// Idle drift — subtle perpetual micro-motion so a settled element never sits
// perfectly still (the "alive" look). Deterministic sin field, costs nothing.
export const idle = (frame: number, seed = 0, amp = 4, speed = 1) => {
  const t = (frame / 60) * speed;
  return {
    x: Math.sin(t * 1.7 + seed) * amp + Math.sin(t * 0.6 + seed * 2) * amp * 0.4,
    y: Math.cos(t * 1.3 + seed * 1.5) * amp + Math.sin(t * 0.5 + seed) * amp * 0.4,
    r: Math.sin(t * 0.9 + seed) * amp * 0.05,
  };
};

// Spring-like overshoot 0→1 with a little bounce past 1, settling back. For pops
// that should feel snappy/elastic without importing a spring. `bounce` = extra.
export const overshoot = (
  frame: number,
  delay = 0,
  dur = 16,
  bounce = 0.12,
) => {
  const p = interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // small damped sine kicker on top of the ease
  const k = Math.sin(p * Math.PI) * bounce * (1 - p);
  return p + k;
};

// Typewriter character count for a string over [delay, …] at cps chars/frame.
export const typed = (frame: number, text: string, delay = 0, cps = 0.7) => {
  const n = Math.floor(
    interpolate(frame, [delay, delay + text.length / cps], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  return text.slice(0, Math.max(0, n));
};
