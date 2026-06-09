import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { stagger, drift } from "../lib/anim";

export type Token = { t: string; hl?: boolean; danger?: boolean; good?: boolean };

// Rule 9C — kinetic typography. The punchline lands word-by-word with weight,
// key words popping in accent. Full-screen, on the moving tech background.
export const KineticHeadline: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  tokens: Token[];
  hue?: "blue" | "amber" | "red";
  size?: number;
  bg?: "grid" | "image" | "black" | "white";
  image?: string;
  imageBlur?: number;
  imageDarken?: number;
  imageTint?: string;
}> = ({ durationInFrames, eyebrow, tokens, hue = "blue", size = 92, bg, image, imageBlur, imageDarken, imageTint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // sobre FOTO/negro el texto va claro (la tinta oscura solo se lee sobre papel)
  const onImage = bg === "image" || bg === "black";

  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue={hue}
      glowY={46}
      zoom={[1.05, 1.13]}
      bg={bg}
      image={image}
      imageBlur={imageBlur}
      imageDarken={onImage ? imageDarken ?? 0.66 : imageDarken}
      imageTint={imageTint}
    >
      {/* scrim oscuro detrás del texto para garantizar contraste sobre la foto */}
      {onImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(70% 46% at 50% 50%, rgba(18,14,10,0.62), rgba(18,14,10,0) 72%)",
          }}
        />
      )}
      <div style={{ position: "relative", maxWidth: 1500, padding: "0 140px", textAlign: "center" }}>
        {eyebrow && (
          <Eyebrow frame={frame} fps={fps} onImage={onImage}>
            {eyebrow}
          </Eyebrow>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: `${size * 0.12}px ${size * 0.28}px`,
            lineHeight: 1.06,
          }}
        >
          {tokens.map((tok, i) => {
            const s = stagger(frame, fps, i, 7, 6);
            const d = drift(frame, i * 2.3, 0.8, 5);
            const op = interpolate(s, [0, 1], [0, 1]);
            const y = interpolate(s, [0, 1], [40, 0]) + d.y;
            const sc = interpolate(s, [0, 1], [0.7, 1]);
            const color = tok.danger
              ? onImage ? "#E08A6A" : COLORS.danger
              : tok.good
                ? onImage ? "#A9C46E" : COLORS.good
                : tok.hl
                  ? onImage ? "#FFF6E4" : COLORS.text
                  : onImage ? COLORS.bg0 : COLORS.textSoft;
            const emph = tok.hl || tok.danger || tok.good;
            // tracking que se cierra al entrar (cinético) + barrido de luz en énfasis
            const track = interpolate(s, [0, 1], [emph ? 14 : 7, emph ? 1 : 0.5]);
            const sweepX = interpolate(s, [0.45, 1], [-140, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <span
                key={i}
                style={{
                  position: "relative",
                  display: "inline-block",
                  overflow: "hidden",
                  opacity: op,
                  transform: `translateY(${y}px) scale(${sc})`,
                  fontSize: size,
                  fontWeight: emph ? 900 : 700,
                  letterSpacing: track,
                  color,
                  textShadow: onImage
                    ? `0 2px 14px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.95)${emph ? `, 0 6px 40px ${color}55` : ""}`
                    : emph
                      ? `0 6px 40px ${color}55`
                      : "0 4px 24px rgba(0,0,0,0.4)",
                }}
              >
                {tok.t}
                {emph && (
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(105deg, transparent 38%, rgba(255,248,225,0.7) 50%, transparent 62%)",
                      transform: `translateX(${sweepX}%)`,
                      mixBlendMode: "overlay",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};

const Eyebrow: React.FC<{ frame: number; fps: number; onImage?: boolean; children: React.ReactNode }> = ({
  frame,
  fps,
  onImage,
  children,
}) => {
  const s = stagger(frame, fps, 0, 1, 2);
  return (
    <div
      style={{
        opacity: interpolate(s, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(s, [0, 1], [-20, 0])}px)`,
        color: onImage ? "rgba(239,231,211,0.85)" : COLORS.textDim,
        textShadow: onImage ? "0 2px 10px rgba(0,0,0,0.85)" : "none",
        fontSize: 28,
        fontWeight: 800,
        letterSpacing: 8,
        textTransform: "uppercase",
        marginBottom: 36,
      }}
    >
      {children}
    </div>
  );
};
