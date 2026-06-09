import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import { TechBackground } from "../components/TechBackground";

// Rule 1 — full-screen cinematic closing. Layered, slow push-in zoom, the key
// line revealed in parts with the most important words highlighted.
export const ClosingScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 30, mass: 1 } });
  const exit = spring({
    frame: frame - (durationInFrames - 20),
    fps,
    config: { damping: 200 },
  });
  const op = interpolate(enter, [0, 1], [0, 1]) * interpolate(exit, [0, 1], [1, 0]);

  // slow continuous push-in (parallax sense of depth)
  const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.12]);

  // staged reveal of the three phrases
  const p1 = spring({ frame: frame - 6, fps, config: { damping: 22 } });
  const p2 = spring({ frame: frame - 42, fps, config: { damping: 20 } });
  const p3 = spring({ frame: frame - 96, fps, config: { damping: 18 } });

  const line = (s: number, dy = 30) => ({
    opacity: s,
    transform: `translateY(${interpolate(s, [0, 1], [dy, 0])}px)`,
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <TechBackground glowX={50} glowY={48} hue="blue" drift={1.2} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 18,
          opacity: op,
          padding: "0 220px",
          textAlign: "center",
        }}
      >
        <div style={{ ...line(p1), fontSize: 50, fontWeight: 600, color: COLORS.textSoft }}>
          Emprender no es tener una idea…
        </div>
        <div
          style={{
            ...line(p2),
            fontSize: 92,
            fontWeight: 900,
            color: COLORS.text,
            lineHeight: 1.05,
            textShadow: "0 6px 50px rgba(255,255,255,0.28)",
          }}
        >
          Es resistir el caos
          <br /> el tiempo suficiente
        </div>
        <div
          style={{
            ...line(p3),
            marginTop: 14,
            fontSize: 40,
            fontWeight: 600,
            color: COLORS.textSoft,
          }}
        >
          hasta encontrar algo que el mercado{" "}
          <span style={{ color: COLORS.good, fontWeight: 800 }}>quiera de verdad</span>.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
