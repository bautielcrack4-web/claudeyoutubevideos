import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, SPRING_SNAPPY, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";

// SizeScale — real size comparison on a fingertip. Circles of growing diameter pop
// in one by one (poppy seed → sesame → engorged pea), each labelled. The smallest
// can be flagged (emphasis) — "the one you don't see". Reusable for any scale beat.
const BOX_W = 1500;
const BOX_H = 820;

export const SizeScale: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  items: { label: string; sub?: string; d: number; flag?: boolean }[];
  hue?: "blue" | "cold" | "amber" | "red";
  startAt?: number;
  stagger?: number;
}> = ({ durationInFrames, eyebrow, title, items, hue = "cold", startAt = sec(0.7), stagger = sec(1.5) }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: SPRING_SOFT });

  const baseY = 560;
  const n = items.length;
  const gap = BOX_W / (n + 1);

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
          {/* fingertip — a soft skin-toned rounded shape as the scale reference */}
          <g opacity={head}>
            <path d={`M ${BOX_W / 2 - 360} ${baseY + 150} Q ${BOX_W / 2} ${baseY - 70} ${BOX_W / 2 + 360} ${baseY + 150} Z`} fill="#D9B79A" stroke="#B98F6F" strokeWidth={3} />
            <path d={`M ${BOX_W / 2 - 200} ${baseY - 6} Q ${BOX_W / 2} ${baseY - 40} ${BOX_W / 2 + 200} ${baseY - 6}`} fill="none" stroke="#B98F6F" strokeWidth={2} opacity={0.5} />
          </g>

          {items.map((it, i) => {
            const t0 = startAt + i * stagger;
            const s = spring({ frame: frame - t0, fps, config: SPRING_SNAPPY });
            const x = gap * (i + 1);
            const r = (it.d / 2) * s;
            const col = it.flag ? COLORS.danger : "#3a2a1d";
            return (
              <g key={i} opacity={s}>
                <circle cx={x} cy={baseY} r={Math.max(0.5, r)} fill={col} />
                {it.flag && <circle cx={x} cy={baseY} r={Math.max(0.5, r) + 8 + Math.sin(frame / 6) * 3} fill="none" stroke={COLORS.danger} strokeWidth={3} opacity={0.6} />}
                <text x={x} y={baseY + 120} textAnchor="middle" fontSize={32} fontWeight={800} fill={COLORS.text} fontFamily={FONT_STACK}>{it.label}</text>
                {it.sub && <text x={x} y={baseY + 156} textAnchor="middle" fontSize={23} fontWeight={600} fill={it.flag ? COLORS.danger : COLORS.textDim} fontFamily={FONT_STACK}>{it.sub}</text>}
              </g>
            );
          })}
        </svg>

        {items.map((_, i) => (
          <SfxCue key={"p" + i} at={startAt + i * stagger} src={SFX.chipPop3d} volume={0.32} />
        ))}
      </div>
    </SceneFrame>
  );
};
