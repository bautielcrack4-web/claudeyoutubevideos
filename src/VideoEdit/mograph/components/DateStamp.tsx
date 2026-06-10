import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { MG, HEAD } from "../theme";
import { MediaBg } from "./_shared";

type Corner = "br" | "bl" | "tr" | "tl";

// #5 — DateStamp
// A bold date stamped in a corner over footage (big primary line + a smaller
// secondary line, e.g. "February" / "2025"). Slides + fades in. A lightweight
// overlay you drop on top of any clip.
export const DateStamp: React.FC<{
  date: string; // primary line, e.g. "February"
  sub?: string; // secondary line, e.g. "2025"
  corner?: Corner;
  bg?: string;
  startAt?: number;
  durationInFrames?: number;
}> = ({ date, sub, corner = "br", bg, startAt = 0, durationInFrames }) => {
  const frame = useCurrentFrame() - startAt;

  const appear = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const pos: Record<Corner, React.CSSProperties> = {
    br: { right: "5%", bottom: "8%", textAlign: "right", alignItems: "flex-end" },
    bl: { left: "5%", bottom: "8%", textAlign: "left", alignItems: "flex-start" },
    tr: { right: "5%", top: "8%", textAlign: "right", alignItems: "flex-end" },
    tl: { left: "5%", top: "8%", textAlign: "left", alignItems: "flex-start" },
  };

  return (
    <AbsoluteFill>
      <MediaBg src={bg} duration={durationInFrames} />
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          ...pos[corner],
          opacity: appear,
          transform: `translateY(${interpolate(appear, [0, 1], [22, 0])}px)`,
        }}
      >
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 800,
            fontSize: 76,
            color: MG.text,
            lineHeight: 0.95,
            textShadow: "0 3px 20px rgba(0,0,0,.75)",
          }}
        >
          {date}
        </div>
        {sub && (
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 600,
              fontSize: 40,
              color: MG.textSoft,
              letterSpacing: 2,
              textShadow: "0 2px 14px rgba(0,0,0,.7)",
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
