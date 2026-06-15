import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK, FONT_DISPLAY, sec } from "../theme_ben";
import { SfxCue, SFX } from "../components/Sfx";

// NextVideoEndcard — cliffhanger al próximo video (la "trampa de la viuda"). Tarjeta con
// kicker "PRÓXIMO", título grande y bajada, con una flecha que empuja hacia adelante.
export const NextVideoEndcard: React.FC<{
  durationInFrames: number;
  kicker?: string;
  title: string;
  sub?: string;
}> = ({ durationInFrames, kicker = "Próximo video", title, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const R = COLORS.accent;

  const enter = spring({ frame, fps, config: { damping: 16, mass: 0.9, stiffness: 130 } });
  const arrow = interpolate(frame, [sec(0.6), sec(1.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const nudge = Math.sin(frame / 16) * 8;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 60% 50%, ${R}18, ${COLORS.bg0} 65%)` }} />
      <SfxCue at={sec(0.2)} src={SFX.transition} volume={0.24} />

      <div style={{ display: "flex", alignItems: "center", gap: 50, opacity: enter, transform: `translateY(${(1 - enter) * 30}px)` }}>
        <div style={{ maxWidth: 1080 }}>
          <div style={{ color: R, letterSpacing: 7, fontSize: 26, fontWeight: 800, fontFamily: FONT_DISPLAY }}>{kicker.toUpperCase()}</div>
          <div style={{ color: COLORS.text, fontSize: 76, fontWeight: 900, lineHeight: 1.04, marginTop: 14, letterSpacing: -1 }}>{title}</div>
          {sub && <div style={{ color: COLORS.textSoft, fontSize: 34, fontWeight: 600, marginTop: 20, lineHeight: 1.3 }}>{sub}</div>}
        </div>
        {/* flecha hacia adelante */}
        <svg viewBox="0 0 160 160" style={{ width: 200, height: 200, flexShrink: 0, transform: `translateX(${nudge}px)`, overflow: "visible" }}>
          <circle cx={80} cy={80} r={70} fill="none" stroke={R} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow} opacity={0.5} />
          <path d="M50 80 H104 M84 58 L110 80 L84 102" fill="none" stroke={R} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow} style={{ filter: `drop-shadow(0 0 10px ${R}88)` }} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
