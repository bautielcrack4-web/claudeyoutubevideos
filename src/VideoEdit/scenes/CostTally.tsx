import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";

// CostTally — two running tabs side by side: an expensive recurring cost piles up
// fast while a cheap one barely moves. Stacked "bill" bars + counting totals + a
// verdict mark on the cheap side. Built for "pyrethrin $80/mo × 4 yrs vs sulfur $4".
// Reusable for the bargain/cost beat that recurs in every video.
const BOX_W = 1500;
const BOX_H = 820;

type Side = { label: string; note?: string; total: number; bad?: boolean };

export const CostTally: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  left: Side;
  right: Side;
  hue?: "blue" | "cold" | "amber" | "red";
}> = ({ durationInFrames, eyebrow, title, left, right, hue = "amber" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: SPRING_SOFT });

  const start = sec(0.7);
  const prog = interpolate(frame, [start, durationInFrames - sec(1.0)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const maxTotal = Math.max(left.total, right.total);
  const cols: { s: Side; cx: number }[] = [
    { s: left, cx: BOX_W * 0.3 },
    { s: right, cx: BOX_W * 0.7 },
  ];
  const floor = BOX_H - 150;
  const maxBarH = 470;

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={42} drift={0.4}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={Math.max(0, start - sec(0.3))} src={SFX.transition} volume={0.4} />
        {(eyebrow || title) && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", zIndex: 5, opacity: head, transform: `translateY(${(1 - head) * -12}px)` }}>
            {eyebrow && <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 700, textTransform: "uppercase", color: COLORS.textDim }}>{eyebrow}</div>}
            {title && <div style={{ fontSize: 50, fontWeight: 800, color: COLORS.text, marginTop: 8 }}>{title}</div>}
          </div>
        )}

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0 }}>
          <line x1={80} y1={floor} x2={BOX_W - 80} y2={floor} stroke="rgba(42,38,32,0.2)" strokeWidth={2} opacity={head} />
          {cols.map(({ s, cx }, ci) => {
            const cur = s.total * prog;
            const h = (cur / maxTotal) * maxBarH;
            const col = s.bad ? COLORS.danger : COLORS.good;
            const w = 230;
            // stacked "bills" as horizontal slabs
            const slabs = Math.max(1, Math.round((h / maxBarH) * 16));
            return (
              <g key={ci}>
                {Array.from({ length: slabs }).map((_, k) => (
                  <rect key={k} x={cx - w / 2} y={floor - (k + 1) * (h / slabs) + 2} width={w} height={Math.max(2, h / slabs - 3)} rx={4} fill={col} opacity={0.5 + 0.5 * (k / slabs)} />
                ))}
                <rect x={cx - w / 2} y={floor - h} width={w} height={h} rx={6} fill="none" stroke={col} strokeWidth={2} opacity={0.5} />
                {/* total */}
                <text x={cx} y={floor - h - 26} textAnchor="middle" fontSize={66} fontWeight={800} fill={col} fontFamily={FONT_STACK}>${Math.round(cur).toLocaleString()}</text>
                {/* labels */}
                <text x={cx} y={floor + 48} textAnchor="middle" fontSize={34} fontWeight={800} fill={COLORS.text} fontFamily={FONT_STACK}>{s.label}</text>
                {s.note && <text x={cx} y={floor + 84} textAnchor="middle" fontSize={24} fontWeight={600} fill={COLORS.textDim} fontFamily={FONT_STACK}>{s.note}</text>}
                {!s.bad && prog > 0.85 && (
                  <text x={cx} y={floor - h - 86} textAnchor="middle" fontSize={30} fontWeight={800} fill={COLORS.good} fontFamily={FONT_STACK} opacity={interpolate(prog, [0.85, 1], [0, 1])}>✓ same protection</text>
                )}
              </g>
            );
          })}
        </svg>

        <SfxCue at={durationInFrames - sec(1.0)} src={SFX.numberSlam} volume={0.4} />
      </div>
    </SceneFrame>
  );
};
