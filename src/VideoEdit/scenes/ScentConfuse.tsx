import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";

// ScentConfuse — micro-animation pattern interrupt: a sulfur-dusted sock gives off
// yellow scent waves; a tick approaches with questing front legs, her sensors
// scramble (?), she loses orientation and drops off. Reusable as a "repellent at
// distance" beat.
const BOX_W = 1500;
const BOX_H = 820;

export const ScentConfuse: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  hue?: "blue" | "cold" | "amber" | "red";
}> = ({ durationInFrames, eyebrow, title, hue = "amber" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: SPRING_SOFT });

  const sockX = 380, sockY = BOX_H - 230;
  // tick approaches from the right, stalls, then drops
  const approach = spring({ frame: frame - sec(0.6), fps, config: { damping: 24, mass: 1, stiffness: 24 } });
  const confuseAt = sec(2.6);
  const confuse = interpolate(frame, [confuseAt, confuseAt + sec(1.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tx = 1080 + (sockX + 230 - 1080) * approach;
  const ty = sockY - 30 + confuse * 260; // drops after confusion
  const wob = Math.sin(frame / 4) * (3 + confuse * 10);
  const tilt = confuse * 220;

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={42} drift={0.4}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={sec(0.4)} src={SFX.transition} volume={0.4} />
        {(eyebrow || title) && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", zIndex: 6, opacity: head, transform: `translateY(${(1 - head) * -12}px)` }}>
            {eyebrow && <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 700, textTransform: "uppercase", color: COLORS.textDim }}>{eyebrow}</div>}
            {title && <div style={{ fontSize: 50, fontWeight: 800, color: COLORS.text, marginTop: 8 }}>{title}</div>}
          </div>
        )}

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0 }}>
          {/* dusted sock */}
          <g opacity={head}>
            <path d={`M ${sockX - 70} ${sockY - 150} L ${sockX + 70} ${sockY - 150} L ${sockX + 70} ${sockY + 40} L ${sockX + 200} ${sockY + 40} L ${sockX + 200} ${sockY + 150} L ${sockX - 70} ${sockY + 150} Z`} fill="#E6DCC4" stroke="#2A2620" strokeWidth={4} />
            {/* yellow dusting at the cuff */}
            <rect x={sockX - 70} y={sockY - 150} width={140} height={60} fill="#D4C24A" opacity={0.85} />
            {[...Array(20)].map((_, i) => (
              <circle key={i} cx={sockX - 60 + (i * 11) % 130} cy={sockY - 150 + ((i * 7) % 55)} r={3} fill="#C9A24A" />
            ))}
          </g>

          {/* scent waves emanating from the cuff */}
          {[0, 1, 2, 3].map((i) => {
            const phase = ((frame / 30) + i * 0.35) % 1.4;
            const rr = phase * 360;
            const op = interpolate(phase, [0, 0.2, 1.4], [0, 0.4, 0]) * head;
            return <circle key={i} cx={sockX + 30} cy={sockY - 120} r={rr} fill="none" stroke="#C9A24A" strokeWidth={4} opacity={op} />;
          })}

          {/* tick */}
          <g transform={`translate(${tx} ${ty + wob}) rotate(${tilt})`} opacity={approach > 0.02 ? 1 : 0}>
            <ellipse cx={0} cy={0} rx={26} ry={32} fill="#3a2a1d" />
            <ellipse cx={0} cy={-22} rx={12} ry={12} fill="#2a1d12" />
            {/* questing front legs (toward the sock = left) */}
            {[0, 1, 2].map((k) => {
              const wave = Math.sin(frame / 5 + k) * (10 + confuse * 14);
              return <line key={"l" + k} x1={-18} y1={-14 + k * 10} x2={-54} y2={-26 + k * 12 + wave} stroke="#3a2a1d" strokeWidth={5} strokeLinecap="round" />;
            })}
            {/* back legs */}
            {[0, 1, 2].map((k) => (
              <line key={"r" + k} x1={18} y1={-6 + k * 12} x2={48} y2={-2 + k * 14} stroke="#3a2a1d" strokeWidth={5} strokeLinecap="round" />
            ))}
          </g>

          {/* confusion marks */}
          {confuse > 0.05 && [0, 1, 2].map((k) => {
            const cp = (confuse + k * 0.2) % 1;
            return (
              <text key={k} x={tx + 30 + k * 26} y={ty - 40 - cp * 60} fontSize={40 + k * 6} fontWeight={800} fill={COLORS.danger} fontFamily={FONT_STACK} opacity={interpolate(cp, [0, 0.2, 1], [0, 0.9, 0])}>?</text>
            );
          })}
        </svg>

        <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", opacity: confuse }}>
          <div style={{ fontSize: 38, fontWeight: 800, color: COLORS.text }}>She cannot orient — she lets go.</div>
        </div>

        <SfxCue at={confuseAt} src={SFX.whoosh} volume={0.3} />
      </div>
    </SceneFrame>
  );
};
