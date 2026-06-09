import { interpolate, useCurrentFrame, Easing } from "remotion";

// Animated number that eases from `from` to `to` over `duration` frames,
// starting at `delay` frames into the sequence.
export const CountUp: React.FC<{
  from: number;
  to: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  group?: boolean; // thousands separator (default true)
}> = ({
  from,
  to,
  duration = 32,
  delay = 6,
  decimals = 0,
  prefix = "",
  suffix = "",
  group = true,
}) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [delay, delay + duration], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const text = group
    ? value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : value.toFixed(decimals);
  return (
    <>
      {prefix}
      {text}
      {suffix}
    </>
  );
};
