import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { MG, HEAD, Accent, accentHex } from "../theme";
import { MediaBg } from "./_shared";

// #1 — HookHighlight
// Bottom-left bold headline that builds line-by-line (slide-up + mask reveal);
// a colored box (magenta/cyan) wipes in horizontally BEHIND the flagged lines a
// few frames after each line lands. The opening-hook caption.
export const HookHighlight: React.FC<{
  lines: { text: string; hl?: Accent }[];
  bg?: string;
  align?: "left" | "center";
  fontSize?: number;
  startAt?: number;
  durationInFrames?: number;
}> = ({
  lines,
  bg,
  align = "left",
  fontSize = 64,
  startAt = 0,
  durationInFrames,
}) => {
  const frame = useCurrentFrame() - startAt;
  const lineGap = 9;

  return (
    <AbsoluteFill>
      <MediaBg src={bg} darken={0.28} duration={durationInFrames} />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: align === "center" ? "center" : "flex-start",
          padding: "0 70px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6, textAlign: align }}>
          {lines.map((ln, i) => {
            const appear = i * lineGap;
            const rise = interpolate(frame, [appear, appear + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const wipe = interpolate(frame, [appear + 6, appear + 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const hl = ln.hl ? accentHex(ln.hl) : null;
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  display: "inline-block",
                  alignSelf: align === "center" ? "center" : "flex-start",
                  transform: `translateY(${interpolate(rise, [0, 1], [26, 0])}px)`,
                  opacity: rise,
                  clipPath: `inset(0 0 ${interpolate(rise, [0, 1], [100, 0])}% 0)`,
                }}
              >
                {/* highlight box wipes behind the text */}
                {hl && (
                  <span
                    style={{
                      position: "absolute",
                      left: -10,
                      top: 4,
                      bottom: 4,
                      width: `calc((100% + 20px) * ${wipe})`,
                      background: hl,
                      zIndex: 0,
                      overflow: "hidden",
                    }}
                  >
                    {/* one-shot light shimmer sweeps across once the box is filled */}
                    {wipe >= 1 && (
                      <span
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          width: "45%",
                          left: `${interpolate(
                            frame,
                            [appear + 18, appear + 34],
                            [-50, 150],
                            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                          )}%`,
                          background:
                            "linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)",
                          mixBlendMode: "overlay",
                        }}
                      />
                    )}
                  </span>
                )}
                <span
                  style={{
                    position: "relative",
                    zIndex: 1,
                    fontFamily: HEAD,
                    fontWeight: 800,
                    fontSize,
                    lineHeight: 1.12,
                    color: MG.text,
                    padding: hl ? "0 4px" : 0,
                    textShadow: hl ? "none" : "0 2px 16px rgba(0,0,0,.7)",
                  }}
                >
                  {ln.text}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
