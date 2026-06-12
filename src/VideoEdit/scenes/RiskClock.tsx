import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";

// RiskClock — semicircular gauge whose needle sweeps as time-attached rises, the
// arc colouring green→amber→red. Built for the tick "24h / 48h / 5 days" beat, but
// reusable for any time-based risk. Each step lands with a tick; the last with a boom.
export type RiskStep = { label: string; desc?: string; risk: number };

const BOX_W = 1500;
const BOX_H = 820;
const CX = BOX_W / 2;
const CY = 560;
const R = 360;

const pol = (deg: number, r = R) => {
  const a = ((deg - 180) * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
};
const arc = (t0: number, t1: number, r = R) => {
  const a = pol(180 * t0, r);
  const b = pol(180 * t1, r);
  const large = t1 - t0 > 0.5 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
};
const mix = (c1: string, c2: string, t: number) => {
  const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [r1, g1, b1] = h(c1);
  const [r2, g2, b2] = h(c2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
};

export const RiskClock: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  steps: RiskStep[];
  hue?: "blue" | "cold" | "amber" | "red";
  startAt?: number;
  stagger?: number;
}> = ({ durationInFrames, eyebrow, title, steps, hue = "red", startAt = sec(0.6), stagger = sec(1.7) }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: SPRING_SOFT });

  // which step are we on + smooth needle position
  let cur = 0;
  for (let i = 0; i < steps.length; i++) if (frame >= startAt + i * stagger) cur = i;
  const segT = spring({ frame: frame - (startAt + cur * stagger), fps, config: { damping: 16, mass: 0.9, stiffness: 90 } });
  const prevRisk = cur > 0 ? steps[cur - 1].risk : 0;
  const risk = prevRisk + (steps[cur].risk - prevRisk) * segT;

  const GREEN = COLORS.good.replace("#", "");
  const AMBER = COLORS.amber.replace("#", "");
  const RED = COLORS.danger.replace("#", "");
  const arcColor = risk < 0.5 ? mix("#" + GREEN, "#" + AMBER, risk / 0.5) : mix("#" + AMBER, "#" + RED, (risk - 0.5) / 0.5);
  const needle = pol(180 * risk, R - 36);

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={42} drift={0.4}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={Math.max(0, startAt - sec(0.3))} src={SFX.transition} volume={0.4} />
        {(eyebrow || title) && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", zIndex: 5, opacity: head, transform: `translateY(${(1 - head) * -12}px)` }}>
            {eyebrow && <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 700, textTransform: "uppercase", color: COLORS.textDim }}>{eyebrow}</div>}
            {title && <div style={{ fontSize: 50, fontWeight: 800, color: COLORS.text, marginTop: 8 }}>{title}</div>}
          </div>
        )}

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0 }}>
          {/* track */}
          <path d={arc(0, 1)} fill="none" stroke="rgba(42,38,32,0.12)" strokeWidth={40} strokeLinecap="round" opacity={head} />
          {/* filled risk arc */}
          <path d={arc(0, Math.max(0.001, risk))} fill="none" stroke={arcColor} strokeWidth={40} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${arcColor}88)` }} />
          {/* ticks for each step */}
          {steps.map((s, i) => {
            const p1 = pol(180 * s.risk, R + 26);
            const p2 = pol(180 * s.risk, R - 56);
            const on = frame >= startAt + i * stagger;
            return (
              <g key={i} opacity={on ? 1 : 0.3}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={COLORS.text} strokeWidth={on ? 4 : 2} />
                <text x={pol(180 * s.risk, R + 70).x} y={pol(180 * s.risk, R + 70).y} textAnchor="middle" fontSize={30} fontWeight={800} fill={on ? COLORS.text : COLORS.textDim} fontFamily={FONT_STACK}>{s.label}</text>
              </g>
            );
          })}
          {/* needle */}
          <line x1={CX} y1={CY} x2={needle.x} y2={needle.y} stroke={arcColor} strokeWidth={12} strokeLinecap="round" />
          <circle cx={CX} cy={CY} r={22} fill={COLORS.text} />
          {/* center read-out */}
          <text x={CX} y={CY - 110} textAnchor="middle" fontSize={92} fontWeight={800} fill={arcColor} fontFamily={FONT_STACK}>{Math.round(risk * 100)}%</text>
          <text x={CX} y={CY - 56} textAnchor="middle" fontSize={26} fontWeight={700} fill={COLORS.textDim} fontFamily={FONT_STACK}>chance she passed it on</text>
        </svg>

        {/* current step caption */}
        <div style={{ position: "absolute", bottom: 36, left: 0, right: 0, textAlign: "center", opacity: segT }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.text }}>{steps[cur].label}</div>
          {steps[cur].desc && <div style={{ fontSize: 26, color: COLORS.textSoft, marginTop: 4 }}>{steps[cur].desc}</div>}
        </div>

        {steps.map((s, i) => (
          <SfxCue key={"t" + i} at={startAt + i * stagger} src={i === steps.length - 1 ? SFX.boom1 : SFX.digitTick} volume={i === steps.length - 1 ? 0.45 : 0.3} />
        ))}
      </div>
    </SceneFrame>
  );
};
