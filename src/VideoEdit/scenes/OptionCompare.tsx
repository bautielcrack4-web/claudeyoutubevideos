import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, glass } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { Icon, IconName } from "../components/Icon";
import { drift } from "../lib/anim";

type Opt = {
  tag: string;
  title: string;
  sub: string;
  note: string;
  icon: IconName;
  accent: string;
};

// Two-option comparison (Error 2: pension payout). Cards enter one at a time with
// a real zoom to each (Rule 11B); a glowing "VS" sits between them.
export const OptionCompare: React.FC<{
  durationInFrames: number;
  left: Opt;
  right: Opt;
}> = ({ durationInFrames, left, right }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const Card: React.FC<{ o: Opt; delay: number; seed: number }> = ({ o, delay, seed }) => {
    const s = spring({ frame: frame - delay, fps, config: { damping: 19, mass: 0.9 } });
    const d = drift(frame, seed, 0.5, 7);
    return (
      <div
        style={{
          ...glass("dark"),
          width: 560,
          minHeight: 540,
          borderRadius: 38,
          padding: 48,
          border: `1px solid ${o.accent}66`,
          boxShadow: `0 40px 110px rgba(0,0,0,0.55), 0 0 70px ${o.accent}22, inset 0 1px 0 rgba(255,255,255,0.16)`,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          opacity: interpolate(s, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(s, [0, 1], [60, 0]) + d.y}px) scale(${interpolate(s, [0, 1], [0.86, 1])})`,
        }}
      >
        <div
          style={{
            alignSelf: "flex-start",
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: o.accent,
            padding: "8px 18px",
            borderRadius: 14,
            background: `${o.accent}1f`,
            border: `1px solid ${o.accent}55`,
          }}
        >
          {o.tag}
        </div>
        <Icon name={o.icon} size={96} glow={`${o.accent}88`} />
        <div style={{ fontSize: 50, fontWeight: 900, color: "#fff", lineHeight: 1.05 }}>{o.title}</div>
        <div style={{ fontSize: 32, fontWeight: 600, color: COLORS.textSoft }}>{o.sub}</div>
        <div
          style={{
            marginTop: "auto",
            fontSize: 28,
            fontWeight: 600,
            color: o.accent,
            lineHeight: 1.25,
          }}
        >
          {o.note}
        </div>
      </div>
    );
  };

  const vs = spring({ frame: frame - 60, fps, config: { damping: 14 } });

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="blue" glowY={44} zoom={[1.03, 1.09]}>
      <div style={{ display: "flex", alignItems: "center", gap: 50 }}>
        <Card o={left} delay={10} seed={1.2} />
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: COLORS.text,
            opacity: interpolate(vs, [0, 1], [0, 1]),
            transform: `scale(${interpolate(vs, [0, 1], [0.4, 1])})`,
            textShadow: "0 0 40px rgba(124,138,90,0.6)",
          }}
        >
          VS
        </div>
        <Card o={right} delay={95} seed={3.7} />
      </div>
    </SceneFrame>
  );
};
