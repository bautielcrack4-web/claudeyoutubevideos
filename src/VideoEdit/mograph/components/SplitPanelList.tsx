import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { MG, HEAD, BODY, glow } from "../theme";
import { MediaBg } from "./_shared";
import { stagger } from "../lib/draw";

// #4 — SplitPanelList
// Left half = footage (Ken-Burns); right half = dark grid panel with a bold
// title and a bulleted list whose items pop in one-by-one with a cyan dot.
// A "here's what happened" summary card.
export const SplitPanelList: React.FC<{
  title: string;
  bullets: string[];
  media?: string;
  side?: "left" | "right"; // which side the media is on
  startAt?: number;
  durationInFrames?: number;
}> = ({ title, bullets, media, side = "left", startAt = 0, durationInFrames }) => {
  const frame = useCurrentFrame() - startAt;
  const { fps } = useVideoConfig();

  const panel = (
    <div
      style={{
        flex: 1,
        height: "100%",
        position: "relative",
        background: MG.bg1,
        backgroundImage: `linear-gradient(${MG.grid} 1px, transparent 1px), linear-gradient(90deg, ${MG.grid} 1px, transparent 1px)`,
        backgroundSize: "46px 46px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 70px",
      }}
    >
      <div
        style={{
          fontFamily: HEAD,
          fontWeight: 800,
          fontSize: 60,
          lineHeight: 1.08,
          color: MG.text,
          marginBottom: 44,
          opacity: interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [0, 14], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}
      >
        {title}
      </div>
      {bullets.map((b, i) => {
        const s = stagger(frame, fps, i, 11, 14);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 18,
              marginBottom: 22,
              opacity: s,
              transform: `translateX(${interpolate(s, [0, 1], [26, 0])}px)`,
            }}
          >
            <span
              style={{
                marginTop: 14,
                width: 12,
                height: 12,
                borderRadius: 6,
                background: MG.cyan,
                boxShadow: glow(MG.cyanGlow, 0.8),
                flexShrink: 0,
              }}
            />
            <span style={{ fontFamily: BODY, fontWeight: 500, fontSize: 36, lineHeight: 1.3, color: MG.textSoft }}>
              {b}
            </span>
          </div>
        );
      })}
    </div>
  );

  const mediaPane = (
    <div style={{ flex: 1, height: "100%", position: "relative", overflow: "hidden" }}>
      <MediaBg src={media} duration={durationInFrames} zoom={1.12} />
    </div>
  );

  return (
    <AbsoluteFill style={{ background: MG.bg0 }}>
      <AbsoluteFill style={{ flexDirection: "row" }}>
        {side === "left" ? (
          <>
            {mediaPane}
            {panel}
          </>
        ) : (
          <>
            {panel}
            {mediaPane}
          </>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
