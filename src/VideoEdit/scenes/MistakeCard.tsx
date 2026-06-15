import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK, FONT_DISPLAY, glass, sec } from "../theme_ben";
import { SfxCue, SFX } from "../components/Sfx";

// MistakeCard — tarjeta de ERROR numerada (recurrente ×4). Tarjeta oscura con borde
// rojo, número gigante, un sello ❌ que se estampa, título + descripción. Opcional una
// foto de fondo (oscurecida). Look alarma.
export const MistakeCard: React.FC<{
  durationInFrames: number;
  number: string; // "1"
  title: string;
  desc?: string;
  eyebrow?: string; // "ERROR"
  image?: string; // staticFile (foto de fondo oscurecida)
}> = ({ durationInFrames, number, title, desc, eyebrow = "ERROR", image }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 15, mass: 0.8, stiffness: 150 } });
  const stamp = spring({ frame: frame - sec(0.55), fps, config: { damping: 8, mass: 0.7, stiffness: 240 } });
  const stampScale = interpolate(stamp, [0, 0.6, 1], [2.4, 0.9, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      {image && (
        <AbsoluteFill>
          <img src={image} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(6px) saturate(0.7)" }} />
          <AbsoluteFill style={{ background: "rgba(8,8,11,0.72)" }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${COLORS.accent}1f, transparent 60%)` }} />
      <SfxCue at={sec(0.05)} src={SFX.whoosh} volume={0.2} />
      <SfxCue at={sec(0.55)} src={SFX.textSlam} volume={0.4} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            ...glass("dark"),
            borderLeft: `10px solid ${COLORS.accent}`,
            width: 1180,
            padding: "56px 70px",
            display: "flex",
            alignItems: "center",
            gap: 56,
            transform: `translateY(${(1 - enter) * 40}px) scale(${0.94 + enter * 0.06})`,
            opacity: enter,
          }}
        >
          {/* número gigante */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 220, lineHeight: 0.8, color: COLORS.accent, textShadow: `0 0 40px ${COLORS.accent}55` }}>{number}</div>
            {/* sello X */}
            <div style={{ position: "absolute", top: -8, right: -22, fontSize: 96, color: COLORS.danger, transform: `rotate(-14deg) scale(${stampScale})`, fontWeight: 900, textShadow: `0 0 20px ${COLORS.danger}aa` }}>✕</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: COLORS.accent, letterSpacing: 6, fontSize: 24, fontWeight: 800, fontFamily: FONT_DISPLAY, marginBottom: 14 }}>{eyebrow} {number}</div>
            <div style={{ color: COLORS.text, fontSize: 58, fontWeight: 900, lineHeight: 1.04, letterSpacing: -0.5 }}>{title}</div>
            {desc && <div style={{ color: COLORS.textSoft, fontSize: 30, fontWeight: 600, marginTop: 18, lineHeight: 1.3 }}>{desc}</div>}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
