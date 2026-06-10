import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_STACK } from "../theme";
import { TechBackground } from "./TechBackground";
import { ImageBackdrop, PlainBackdrop } from "./Backdrops";
import { useReveal, kenBurns } from "../lib/anim";

// Opaque full-screen scene wrapper. Covers the avatar, paints the background,
// and guarantees constant motion: a permanent Ken-Burns camera zoom (Rule 10A)
// plus a fluid zoom-blur enter/exit (Rule 6 #1 — no hard cuts).
// Rule 12 — `bg` varies the base so we don't always use the navy grid:
//   "grid"  (default) navy + white dots
//   "image" full-screen blurred+darkened photo (pass `image`)
//   "black" / "white" plain tone + subtle dots
export const SceneFrame: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
  hue?: "blue" | "cold" | "amber" | "red";
  glowX?: number;
  glowY?: number;
  zoom?: [number, number];
  drift?: number;
  contentStyle?: React.CSSProperties;
  bg?: "grid" | "image" | "black" | "white";
  image?: string; // staticFile path when bg="image"
  imageBlur?: number;
  imageDarken?: number;
  imageTint?: string;
  noReveal?: boolean; // RawShot: HARD-CUT, sin fade/blur de entrada NI salida (regla del nicho)
}> = ({
  durationInFrames,
  children,
  hue = "blue",
  glowX = 50,
  glowY = 42,
  zoom = [1.04, 1.12],
  drift = 0.7,
  contentStyle,
  bg = "grid",
  image,
  imageBlur,
  imageDarken,
  imageTint,
  noReveal = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = useReveal(frame, fps, durationInFrames);
  // noReveal = corte duro: opacidad plena, sin scale-spring ni blur de transición.
  // Se mantiene el Ken-Burns interno (cam), que NO es una transición sino movimiento vivo.
  const opacity = noReveal ? 1 : reveal.opacity;
  const scale = noReveal ? 1 : reveal.scale;
  const blur = noReveal ? 0 : reveal.blur;
  const cam = kenBurns(frame, durationInFrames, zoom[0], zoom[1]);

  // parallax 2.5D: deriva de perspectiva muy sutil → la foto se siente con profundidad
  const pRotY = Math.sin(frame / 115) * 1.1;
  const pRotX = Math.cos(frame / 137) * 0.7;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, opacity }}>
      {/* background gets its own slightly stronger parallax zoom + perspective for depth */}
      <AbsoluteFill style={{ transform: `perspective(1800px) rotateY(${pRotY}deg) rotateX(${pRotX}deg) scale(${cam * 1.06})`, transformOrigin: "center center" }}>
        {bg === "image" && image ? (
          <ImageBackdrop
            src={image}
            blur={imageBlur}
            darken={imageDarken}
            tint={imageTint}
            durationInFrames={durationInFrames}
          />
        ) : bg === "black" || bg === "white" ? (
          <PlainBackdrop
            tone={bg}
            glowHue={hue === "amber" || hue === "red" ? hue : "blue"}
            glowY={glowY}
          />
        ) : (
          <TechBackground glowX={glowX} glowY={glowY} hue={hue} drift={drift} />
        )}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          transform: `scale(${scale * cam})`,
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform, filter",
          ...contentStyle,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
