import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK, SPRING_ZOOM } from "../theme";
import { TechBackground } from "../components/TechBackground";

// Rule 3 — glossy iOS app-icon card with big NUMBER + small label, title below.
// Full-screen scene. Fast push-in entrance, gentle float, zoom-out exit.
export const RuleNumberScene: React.FC<{
  durationInFrames: number;
  number: string; // "04"
  label?: string; // "REGLA"
  title: string; // "Trabajar mucho, en lo equivocado"
  hue?: "blue" | "amber" | "red";
}> = ({ durationInFrames, number, label = "REGLA", title, hue = "blue" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: SPRING_ZOOM });
  const exit = spring({
    frame: frame - (durationInFrames - 18),
    fps,
    config: { damping: 200 },
  });

  // push-in from slightly far + motion-blur feel via scale, then float
  const scale = interpolate(enter, [0, 1], [0.6, 1]) * interpolate(exit, [0, 1], [1, 1.18]);
  const opacity = interpolate(enter, [0, 1], [0, 1]) * interpolate(exit, [0, 1], [1, 0]);
  const float = Math.sin(frame / 26) * 10;
  const titleIn = spring({ frame: frame - 10, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <TechBackground glowX={50} glowY={38} hue={hue} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 54,
          opacity,
        }}
      >
        {/* volumetric god-ray glow behind the hero card (Rule 9E) */}
        <div
          style={{
            position: "absolute",
            top: "26%",
            width: 720,
            height: 720,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,138,90,0.4) 0%, rgba(0,0,0,0) 62%)",
            transform: `scale(${interpolate(enter, [0, 1], [0.6, 1.05])})`,
            filter: "blur(8px)",
          }}
        />
        {/* glossy card */}
        <div
          style={{
            transform: `scale(${scale}) translateY(${float}px)`,
            width: 360,
            height: 360,
            borderRadius: 84,
            position: "relative",
            background:
              "linear-gradient(160deg, #AEBA8C 0%, #7C8A5A 46%, #5C6A3E 100%)",
            boxShadow:
              "0 50px 120px rgba(124,138,90,0.55), 0 10px 30px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* glossy specular highlight */}
          <div
            style={{
              position: "absolute",
              top: -40,
              left: -40,
              right: -40,
              height: 260,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
              borderRadius: "50%",
              filter: "blur(2px)",
              transform: "scaleX(1.2)",
            }}
          />
          <div style={{ textAlign: "center", zIndex: 2 }}>
            <div
              style={{
                fontSize: 200,
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1,
                textShadow: "0 6px 24px rgba(0,0,0,0.35)",
              }}
            >
              {number}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: 10,
                color: "rgba(255,255,255,0.92)",
              }}
            >
              {label}
            </div>
          </div>
        </div>

        {/* title below */}
        <div
          style={{
            maxWidth: 1200,
            textAlign: "center",
            fontSize: 64,
            fontWeight: 800,
            fontStyle: "italic",
            color: COLORS.text,
            textShadow: "0 4px 30px rgba(255,255,255,0.22)",
            opacity: titleIn,
            transform: `translateY(${interpolate(titleIn, [0, 1], [26, 0])}px)`,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
