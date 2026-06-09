import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, glass } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { Icon } from "../components/Icon";
import { SSABadge, MedicareBadge, DOLBadge } from "../components/Badges";
import { stagger, drift } from "../lib/anim";

// Green "what to do" action card — the payoff after each error. Checklist items
// reveal one by one (~1s, Rule 11A), optional official badge + hero line.
export const ActionCard: React.FC<{
  durationInFrames: number;
  kicker?: string;
  items: string[];
  badge?: "ssa" | "medicare" | "dol";
  hero?: string; // e.g. a phone number / url, big
}> = ({ durationInFrames, kicker = "Qué hacer", items, badge, hero }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame, fps, config: { damping: 20, mass: 0.9 } });
  const d = drift(frame, 6.6, 0.5, 6);

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="blue" glowY={46} zoom={[1.03, 1.09]}>
      <div
        style={{
          ...glass("dark"),
          borderRadius: 40,
          padding: "56px 64px",
          width: 1180,
          border: `1px solid ${COLORS.good}55`,
          boxShadow: `0 40px 110px rgba(0,0,0,0.55), 0 0 80px ${COLORS.good}22, inset 0 1px 0 rgba(255,255,255,0.16)`,
          transform: `translateY(${d.y}px) scale(${interpolate(card, [0, 1], [0.94, 1])})`,
          opacity: card,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 30 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: COLORS.good, boxShadow: `0 0 18px ${COLORS.good}` }} />
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 6, textTransform: "uppercase", color: COLORS.good }}>
            {kicker}
          </div>
        </div>

        {hero && (
          <div style={{ fontSize: 78, fontWeight: 900, color: "#fff", marginBottom: 34, letterSpacing: 1, textShadow: "0 6px 40px rgba(52,211,153,0.3)" }}>
            {hero}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {items.map((it, i) => {
            const s = stagger(frame, fps, i, 24, 14);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  opacity: interpolate(s, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(s, [0, 1], [-40, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    background: `${COLORS.good}22`,
                    border: `1px solid ${COLORS.good}66`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="check" size={28} />
                </div>
                <span style={{ fontSize: 42, fontWeight: 600, color: "#fff" }}>{it}</span>
              </div>
            );
          })}
        </div>

        {badge && (
          <div style={{ marginTop: 40, opacity: interpolate(card, [0.4, 1], [0, 1]) }}>
            {badge === "ssa" && <SSABadge scale={1.1} />}
            {badge === "medicare" && <MedicareBadge scale={1.1} />}
            {badge === "dol" && <DOLBadge scale={1.1} />}
          </div>
        )}
      </div>
    </SceneFrame>
  );
};
