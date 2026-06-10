import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { MG, BODY, pill, navyBg } from "../theme";

// ArchiveFrame — wraps a historical photo in an "archival footage" treatment:
// sepia/desaturation, moving film grain, a soft vignette, a subtle gate-weave
// jitter (the image never sits perfectly still, like a film scan) and a small
// "ARCHIVE · <year>" tag. Use it on old photos/illustrations so they read as
// genuine archive material instead of a flat scan.
export const ArchiveFrame: React.FC<{
  src?: string;
  year?: string | number; // shown in the tag, e.g. 1903
  tag?: string; // override the tag text (default "ARCHIVE")
  intensity?: number; // 0..1 grain/vignette strength (default 0.7)
  startAt?: number;
  durationInFrames?: number;
}> = ({ src, year, tag = "ARCHIVE", intensity = 0.7, startAt = 0, durationInFrames = 150 }) => {
  const frame = useCurrentFrame() - startAt;
  const isUrl = src ? /^(https?:|data:|blob:)/.test(src) || src.startsWith("/") : false;

  // gate weave — tiny, organic, deterministic (no Date/random).
  const wx = Math.sin(frame * 0.31) * 3 + Math.sin(frame * 0.13) * 2;
  const wy = Math.cos(frame * 0.27) * 3 + Math.sin(frame * 0.07) * 2;
  const wr = Math.sin(frame * 0.05) * 0.18;
  const kb = interpolate(frame, [0, durationInFrames], [1.06, 1.12], { extrapolateRight: "clamp" });

  // grain flicker
  const grainOp = (0.10 + Math.abs(Math.sin(frame * 0.9)) * 0.06) * intensity;
  const seed = Math.floor(frame) % 100;
  // occasional brightness flutter (old projector)
  const flutter = 1 + Math.sin(frame * 1.7) * 0.015 + Math.sin(frame * 0.6) * 0.01;

  return (
    <AbsoluteFill style={{ background: MG.bg0, overflow: "hidden" }}>
      {src ? (
        <Img
          src={isUrl ? src : staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `translate(${wx}px, ${wy}px) scale(${kb}) rotate(${wr}deg)`,
            filter: `sepia(${0.45 * intensity}) saturate(${1 - 0.45 * intensity}) contrast(1.08) brightness(${flutter})`,
          }}
        />
      ) : (
        <AbsoluteFill style={navyBg} />
      )}

      {/* film grain */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: grainOp }}>
        <filter id={`arch-grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#arch-grain-${seed})`} />
      </svg>

      {/* vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(110% 90% at 50% 45%, rgba(0,0,0,0) 52%, rgba(0,0,0,${0.55 * intensity}) 100%)`,
        }}
      />

      {/* archive tag */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          left: "3.5%",
          opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          ...pill(6),
          padding: "7px 14px",
          display: "flex",
          alignItems: "center",
          gap: 9,
          fontFamily: BODY,
          fontWeight: 800,
          fontSize: 18,
          letterSpacing: 2.5,
          color: MG.text,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 8, background: MG.red, boxShadow: `0 0 8px ${MG.red}` }} />
        {tag}
        {year != null && <span style={{ color: MG.textDim, fontWeight: 600 }}>· {year}</span>}
      </div>
    </AbsoluteFill>
  );
};
