import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { MG, HEAD, navyBg } from "../theme";
import { useDraw, typed, blurIn } from "../lib/draw";
import { MAPS, MapShape } from "../maps/uk";
import { Cue, MGFX } from "./Sfx";

// #7 — MapReveal
// On the navy backdrop: a country silhouette draws its outline (stroke-dashoffset)
// then floods with cyan + glow, while a bold title types in above it. Full-screen
// "where this happened" beat.
export const MapReveal: React.FC<{
  title?: string;
  country?: keyof typeof MAPS | string; // built-in shape
  shape?: MapShape; // custom { d, viewBox }
  sound?: boolean; // keyboard SFX under the typed title (default true)
  startAt?: number;
  durationInFrames?: number;
}> = ({ title, country = "uk", shape, sound = true, startAt = 0 }) => {
  const frame = useCurrentFrame() - startAt;
  const map = shape ?? MAPS[country] ?? MAPS.uk;

  // generous length estimate for the outline draw
  const len = 2600;
  const draw = useDraw(frame, len, 6, 40, Easing.inOut(Easing.quad));
  const fill = interpolate(frame, [38, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const TYPE_AT = 4;
  const typeCps = 0.9;
  const shownTitle = title ? typed(frame, title, TYPE_AT, typeCps) : "";
  const typingDone = !title || shownTitle.length >= title.length;
  const titleBlur = blurIn(frame, TYPE_AT, 10, 8);

  // keyboard SFX runs while the title is typing
  const typeFrames = title ? Math.ceil(title.length / typeCps) : 0;

  return (
    <AbsoluteFill style={navyBg}>
      {sound && title && (
        <Cue at={TYPE_AT} src={MGFX.keyType} volume={0.4} durationInFrames={typeFrames + 6} />
      )}
      {title && (
        <div
          style={{
            position: "absolute",
            top: "9%",
            width: "100%",
            textAlign: "center",
            fontFamily: HEAD,
            fontWeight: 800,
            fontSize: 84,
            letterSpacing: 3,
            color: MG.text,
            filter: titleBlur > 0.2 ? `blur(${titleBlur}px)` : undefined,
          }}
        >
          {shownTitle}
          <span style={{ opacity: typingDone ? 0 : 1, color: MG.cyan }}>|</span>
        </div>
      )}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <svg
          viewBox={map.viewBox}
          style={{
            height: "74%",
            marginTop: "4%",
            overflow: "visible",
            filter: `drop-shadow(0 0 28px ${MG.cyan}77)`,
          }}
        >
          {/* glow fill */}
          <path d={map.d} fill={MG.cyan} opacity={fill * 0.95} />
          {/* drawing outline */}
          <path
            d={map.d}
            fill="none"
            stroke={MG.cyanGlow}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeDasharray={draw.strokeDasharray}
            strokeDashoffset={draw.strokeDashoffset}
            style={{ filter: `drop-shadow(0 0 6px ${MG.cyanGlow})` }}
          />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
