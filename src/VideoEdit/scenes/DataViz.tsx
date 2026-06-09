import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { COLORS } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { CountUp } from "../components/CountUp";
import { Icon, IconName } from "../components/Icon";
import { SSABadge, MedicareBadge, DOLBadge } from "../components/Badges";
import { drift } from "../lib/anim";

type Accent = "neutral" | "danger" | "good" | "amber";
const accentColor = (a: Accent) =>
  a === "danger" ? COLORS.danger : a === "good" ? COLORS.good : a === "amber" ? COLORS.amber : COLORS.text;

// Rule 9F — single hero figure that DRAWS itself (animated counter), not static
// text. Optional icon + label + caption.
export const StatBig: React.FC<{
  durationInFrames: number;
  to: number;
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  caption?: string;
  icon?: IconName;
  accent?: Accent;
  hue?: "blue" | "amber" | "red";
  badge?: "ssa" | "medicare" | "dol";
  size?: number;
  bg?: "grid" | "image" | "black" | "white";
  image?: string;
  imageBlur?: number;
  imageDarken?: number;
  imageTint?: string;
}> = ({
  durationInFrames,
  to,
  from = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  label,
  caption,
  icon,
  accent = "neutral",
  hue = "blue",
  badge,
  size = 220,
  bg,
  image,
  imageBlur,
  imageDarken,
  imageTint,
}) => {
  const frame = useCurrentFrame();
  const col = accentColor(accent);
  const d = drift(frame, 3.1, 0.7, 8);
  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue={hue}
      glowY={44}
      zoom={[1.05, 1.13]}
      bg={bg}
      image={image}
      imageBlur={imageBlur}
      imageDarken={imageDarken}
      imageTint={imageTint}
    >
      <div style={{ textAlign: "center", transform: `translateY(${d.y}px)` }}>
        {icon && (
          <div style={{ marginBottom: 30, display: "flex", justifyContent: "center" }}>
            <Icon name={icon} size={120} glow={`${col}88`} />
          </div>
        )}
        {label && (
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 4, color: COLORS.textSoft, textTransform: "uppercase", marginBottom: 14 }}>
            {label}
          </div>
        )}
        <div style={{ fontSize: size, fontWeight: 900, color: col, lineHeight: 1, textShadow: `0 10px 70px ${col}66` }}>
          <CountUp from={from} to={to} duration={40} delay={6} decimals={decimals} prefix={prefix} suffix={suffix} />
        </div>
        {caption && (
          <div style={{ fontSize: 40, fontWeight: 600, color: COLORS.textSoft, marginTop: 18, maxWidth: 1200 }}>
            {caption}
          </div>
        )}
        {badge && (
          <div style={{ marginTop: 36, display: "flex", justifyContent: "center" }}>
            {badge === "ssa" && <SSABadge />}
            {badge === "medicare" && <MedicareBadge />}
            {badge === "dol" && <DOLBadge />}
          </div>
        )}
      </div>
    </SceneFrame>
  );
};

type Bar = { label: string; caption?: string; value: number; max: number; prefix?: string; color?: string; highlight?: boolean };

// Rule 9F — animated bar chart; bars rise one by one with their figure counting up.
export const BarChart: React.FC<{
  durationInFrames: number;
  title?: string;
  bars: Bar[];
  hue?: "blue" | "amber" | "red";
  footer?: React.ReactNode;
}> = ({ durationInFrames, title, bars, hue = "blue", footer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const H = 460;

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={40} zoom={[1.04, 1.1]}>
      <div style={{ textAlign: "center" }}>
        {title && (
          <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.text, marginBottom: 50 }}>{title}</div>
        )}
        <div style={{ display: "flex", gap: 90, alignItems: "flex-end", justifyContent: "center", height: H }}>
          {bars.map((b, i) => {
            const s = spring({ frame: frame - (16 + i * 22), fps, config: { damping: 18, mass: 0.8 } });
            const grow = interpolate(s, [0, 1], [0, 1], { easing: Easing.out(Easing.cubic) });
            const h = (b.value / b.max) * (H - 60) * grow;
            const col = b.color ?? (b.highlight ? COLORS.good : "rgba(124,138,90,0.55)");
            const d = drift(frame, i * 3 + 5, 0.5, 4);
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 230 }}>
                <div style={{ fontSize: 56, fontWeight: 900, color: col, marginBottom: 14, opacity: grow, textShadow: `0 6px 30px ${col}66` }}>
                  <CountUp from={0} to={b.value} duration={36} delay={16 + i * 22} prefix={b.prefix ?? ""} />
                </div>
                <div
                  style={{
                    width: 150,
                    height: Math.max(h, 4),
                    borderRadius: 20,
                    background: `linear-gradient(180deg, ${col} 0%, ${col}55 100%)`,
                    boxShadow: `0 0 50px ${col}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
                    transform: `translateY(${d.y}px)`,
                  }}
                />
                <div style={{ fontSize: 34, fontWeight: 800, color: COLORS.text, marginTop: 22 }}>{b.label}</div>
                {b.caption && <div style={{ fontSize: 24, color: COLORS.textSoft, marginTop: 4 }}>{b.caption}</div>}
              </div>
            );
          })}
        </div>
        {footer && <div style={{ marginTop: 46 }}>{footer}</div>}
      </div>
    </SceneFrame>
  );
};

// The Ernesto comparison with a climax: two bars, then the quarter-million loss
// stamps in red.
export const ErnestoCompare: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const H = 420;
  // delays synced to the spoken figures (~$1,380 @ +3s, ~$2,460 @ +10s,
  // "casi un cuarto de millón" @ ~+18s into the scene at 30fps)
  const bars = [
    { label: "A los 62", value: 1380, color: "rgba(124,138,90,0.55)", delay: 90 },
    { label: "A los 70", value: 2460, color: COLORS.good, delay: 300 },
  ];
  const climax = spring({ frame: frame - 540, fps, config: { damping: 16 } });
  const cOp = interpolate(climax, [0, 1], [0, 1]);
  const cY = interpolate(climax, [0, 1], [40, 0]);

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="amber" glowY={38} zoom={[1.04, 1.1]}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: COLORS.textSoft, marginBottom: 90 }}>
          Ernesto · Seguro Social mensual
        </div>
        <div style={{ display: "flex", gap: 120, alignItems: "flex-end", justifyContent: "center", height: H }}>
          {bars.map((b, i) => {
            const s = spring({ frame: frame - b.delay, fps, config: { damping: 18, mass: 0.8 } });
            const grow = interpolate(s, [0, 1], [0, 1], { easing: Easing.out(Easing.cubic) });
            const h = (b.value / 2460) * (H - 50) * grow;
            const d = drift(frame, i * 3 + 2, 0.5, 4);
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 240 }}>
                <div style={{ fontSize: 60, fontWeight: 900, color: b.color, marginBottom: 14, opacity: grow, textShadow: `0 6px 30px ${b.color}66` }}>
                  <CountUp from={0} to={b.value} duration={36} delay={b.delay} prefix="$" />
                </div>
                <div
                  style={{
                    width: 160,
                    height: Math.max(h, 4),
                    borderRadius: 22,
                    background: `linear-gradient(180deg, ${b.color} 0%, ${b.color}55 100%)`,
                    boxShadow: `0 0 50px ${b.color}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
                    transform: `translateY(${d.y}px)`,
                  }}
                />
                <div style={{ fontSize: 36, fontWeight: 800, color: COLORS.text, marginTop: 22 }}>{b.label}</div>
              </div>
            );
          })}
        </div>

        {/* climax: quarter-million lost */}
        <div style={{ marginTop: 50, opacity: cOp, transform: `translateY(${cY}px)` }}>
          <div style={{ fontSize: 110, fontWeight: 900, color: COLORS.danger, lineHeight: 1, textShadow: `0 8px 50px ${COLORS.danger}66` }}>
            <CountUp from={0} to={250000} duration={40} delay={95} prefix="$" />
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.textSoft, marginTop: 12 }}>
            que Ernesto no va a ver <span style={{ color: COLORS.danger, fontWeight: 900 }}>nunca</span>
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
