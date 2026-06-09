import { useCurrentFrame } from "remotion";
import { drift } from "../lib/anim";
import { Media } from "./Media";

// Depth card (feedback_video_design UPDATE 2): NOT a flat glass rectangle.
// A photo sits BEHIND, softly blurred + darkened, with a color tint + glow
// border + glossy specular + INTERNAL PARALLAX (the photo drifts differently
// than the foreground content) so the card feels 3D and dense — App-Store-tile
// quality. Pass `image` (staticFile path); children render on top.
export const DepthCard: React.FC<{
  accent: string;
  image?: string;
  width: number;
  height: number;
  radius?: number;
  blur?: number;
  darken?: number;
  seed?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  accent,
  image,
  width,
  height,
  radius = 32,
  blur = 5,
  darken = 0.5,
  seed = 1,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const bgD = drift(frame, seed, 0.5, 10); // photo parallax
  const fgD = drift(frame, seed + 10, 0.5, 4); // content parallax (opposite-ish)

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        border: `2px solid ${accent}`,
        boxShadow: `0 40px 110px rgba(0,0,0,0.6), 0 0 60px ${accent}3a, inset 0 1px 0 rgba(255,255,255,0.22)`,
        ...style,
      }}
    >
      {/* photo behind, blurred + parallax */}
      {image && (
        <div style={{ position: "absolute", inset: -40, transform: `translate(${bgD.x}px, ${bgD.y}px) scale(1.12)` }}>
          <Media
            src={image}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: blur > 0 ? `blur(${blur}px)` : undefined }}
          />
        </div>
      )}
      {/* darken + tint + vignette for density */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, rgba(0,0,0,${darken * 0.7}) 0%, rgba(0,0,0,${darken}) 100%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `${accent}1f`, mixBlendMode: "overlay" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(75% 75% at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)" }} />
      {/* glossy specular highlight */}
      <div
        style={{
          position: "absolute",
          top: -height * 0.2,
          left: -20,
          right: -20,
          height: height * 0.55,
          background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 100%)",
          borderRadius: "50%",
          filter: "blur(2px)",
          transform: "scaleX(1.2)",
        }}
      />
      {/* content with its own parallax */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${fgD.x}px, ${fgD.y}px)` }}>
        {children}
      </div>
    </div>
  );
};
