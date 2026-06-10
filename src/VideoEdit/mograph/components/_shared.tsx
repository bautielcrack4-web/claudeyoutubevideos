import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import { MG, navyBg } from "../theme";

const VIDEO_RE = /\.(mp4|webm|mov)$/i;
export const isVideoSrc = (src?: string) => !!src && VIDEO_RE.test(src);

// Background media for a component. `src` may be an IMAGE (png/jpg) or a VIDEO
// CLIP (mp4/webm/mov) — so you can freely INTERCALATE AI-generated images
// (gen_deapi.mjs / FLUX), AI clips (gen_video.mjs / LTX) and REAL stock video
// (fetchstock.mjs / Pexels → public/broll). Both get a slow Ken-Burns zoom +
// optional darkening scrim / desaturation. Video plays muted; `speed` < 1 is
// slow-mo (default 0.6, matching the project's <Media> convention — short clips
// look better ralentizados). No `src` → the kit's navy gradient fallback.
// `src` may be a staticFile path ("broll/x.mp4", "img/x.png") or a remote URL.
export const MediaBg: React.FC<{
  src?: string;
  darken?: number; // 0..1 scrim over the media
  zoom?: number; // ken-burns target scale
  duration?: number;
  desaturate?: boolean;
  speed?: number; // video playbackRate; <1 = slow-mo (default 0.6)
  // ── dramatic "Google-Earth-Studio" push-in ──
  // When fromScale > ~1.5 the component does a fast centered push: scale eases
  // fromScale → 1 over zoomFrames, anchored at (originX,originY)% — instead of
  // the gentle ken-burns. Used by LocationPin/RouteMap `earthZoom`.
  fromScale?: number;
  zoomFrames?: number;
  originX?: number; // % transform-origin
  originY?: number;
}> = ({
  src,
  darken = 0,
  zoom = 1.08,
  duration = 150,
  desaturate = false,
  speed = 0.6,
  fromScale = 1.02,
  zoomFrames = 30,
  originX = 50,
  originY = 50,
}) => {
  const frame = useCurrentFrame();
  if (!src) return <AbsoluteFill style={navyBg} />;
  const isUrl = /^(https?:|data:|blob:)/.test(src) || src.startsWith("/");
  const resolved = isUrl ? src : staticFile(src);
  const isEarth = fromScale > 1.5;
  const scale = isEarth
    ? interpolate(frame, [0, zoomFrames], [fromScale, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : interpolate(frame, [0, duration], [1.02, zoom], { extrapolateRight: "clamp" });
  const mediaStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `scale(${scale})`,
    transformOrigin: `${originX}% ${originY}%`,
    filter: desaturate ? "saturate(0.35) contrast(1.02)" : "none",
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: MG.bg0 }}>
      {isVideoSrc(src) ? (
        <OffthreadVideo src={resolved} muted playbackRate={speed} style={mediaStyle} />
      ) : (
        <Img src={resolved} style={mediaStyle} />
      )}
      {darken > 0 && (
        <AbsoluteFill style={{ background: `rgba(7,9,13,${darken})` }} />
      )}
    </AbsoluteFill>
  );
};

// Percent (0..100) → pixel, against a 1920×1080 design canvas. Components draw
// SVG overlays in a viewBox="0 0 1920 1080" so callers think in friendly %.
export const VW = 1920;
export const VH = 1080;
export const px = (xPct: number) => (xPct / 100) * VW;
export const py = (yPct: number) => (yPct / 100) * VH;
