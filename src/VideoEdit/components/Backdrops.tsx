import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../theme";
import { Media } from "./Media";

// Rule 12B — full-screen PHOTO background, softly blurred + darkened, with its
// own slow Ken-Burns so the scene never sits still. Text/graphics go on top.
// NOTE: for fast renders, prefer feeding an ALREADY-blurred image asset and
// setting blur={0}; live blur on a full-frame photo is the expensive path.
export const ImageBackdrop: React.FC<{
  src: string; // staticFile path, e.g. "assets/broll_carpenter.jpg"
  blur?: number;
  darken?: number; // 0..1 black overlay
  tint?: string; // e.g. "rgba(255,178,62,0.18)" warm amber wash
  durationInFrames?: number;
}> = ({ src, blur = 7, darken = 0.55, tint, durationInFrames = 300 }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationInFrames], [1.08, 1.18], {
    extrapolateRight: "clamp",
  });
  // FAST PATH: si es una FOTO (png/jpg) y hay blur, usamos el hermano pre-horneado
  // <name>_blur.jpg (lo genera preblur.mjs) con blur 0 → el gaussiano sale del path
  // por-frame, pixel-idéntico. Para video (mp4/webm/mov) se mantiene el blur en vivo.
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  const useBaked = blur > 0 && !isVideo;
  const finalSrc = useBaked ? src.replace(/\.(png|jpe?g)$/i, "_blur.jpg") : src;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Media
          src={finalSrc}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: !useBaked && blur > 0 ? `blur(${blur}px)` : undefined }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${darken})` }} />
      {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: "overlay" }} />}
      {/* vignette for density */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(80% 80% at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Rule 12C — plain BLACK or WHITE base (with subtle dots) for variety away from
// the navy grid. Black = dramatic/loss; white = clean/positive/solution.
export const PlainBackdrop: React.FC<{
  tone: "black" | "white";
  glowHue?: "blue" | "amber" | "red" | "green";
  glowY?: number;
}> = ({ tone, glowHue = "blue", glowY = 42 }) => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  const breathe = interpolate(Math.sin(t * 0.9), [-1, 1], [0.85, 1.12]);
  const gridX = Math.sin(t * 0.25) * 12;
  const gridY = Math.cos(t * 0.2) * 9;

  const dark = tone === "black";
  const base = dark
    ? "radial-gradient(120% 90% at 50% 0%, #16181d 0%, #060709 100%)"
    : "radial-gradient(120% 90% at 50% 0%, #ffffff 0%, #e7ecf3 100%)";
  const dotColor = dark ? "rgba(255,255,255,0.13)" : "rgba(10,20,40,0.10)";
  const glow =
    glowHue === "amber"
      ? "rgba(255,178,62,0.22)"
      : glowHue === "red"
        ? "rgba(255,90,90,0.20)"
        : glowHue === "green"
          ? "rgba(52,211,153,0.20)"
          : dark
            ? "rgba(150,180,225,0.20)"
            : "rgba(90,130,210,0.16)";

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: base }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(50% 50% at 50% ${glowY}%, ${glow} 0%, rgba(0,0,0,0) 60%)`,
          transform: `scale(${breathe})`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${dotColor} 1.4px, transparent 1.4px)`,
          backgroundSize: "46px 46px",
          backgroundPosition: `${gridX}px ${gridY}px`,
          maskImage: "radial-gradient(75% 75% at 50% 45%, #000 30%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(75% 75% at 50% 45%, #000 30%, transparent 85%)",
          opacity: 0.9,
        }}
      />
      <AbsoluteFill
        style={{
          background: dark
            ? "radial-gradient(80% 80% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)"
            : "radial-gradient(80% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(120,140,170,0.25) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const onLightText = (tone: "black" | "white") =>
  tone === "white" ? "#0E1A38" : COLORS.text;
