import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_DISPLAY } from "../theme_ben";

// PngDiorama — escena "premium" tipo diorama: fondo degradé de marca + un PNG recortado
// flotando con glow/sombra + un titular grande arriba. Look limpio y caro (estilo "IF YOU
// BOUGHT THAT HOUSE FOR $50,000"). Todo suave, sin pops.
const TONES = { accent: COLORS.accent, amber: COLORS.amber, good: COLORS.good, cold: COLORS.cold, danger: COLORS.danger } as const;
const SOFT = { damping: 28, mass: 1, stiffness: 80 };

export const PngDiorama: React.FC<{
  durationInFrames: number;
  src: string; // PNG transparente del objeto protagonista
  text?: string; // titular arriba, `*palabra*` en acento
  accent?: keyof typeof TONES;
  tint?: string; // color base del degradé (def navy oscuro)
}> = ({ durationInFrames, src, text, accent = "amber", tint = "#0B1830" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = TONES[accent];

  const e = spring({ frame: frame - 4, fps, config: SOFT });
  const float = Math.sin(frame / 40) * 9;
  const glow = 0.5 + 0.5 * Math.sin(frame / 30);
  const words = text ? text.split("*").map((seg, i) => ({ t: seg, em: i % 2 === 1 })).filter((s) => s.t) : [];

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${tint}, ${COLORS.bg0} 95%)`, overflow: "hidden" }}>
      {/* halo suave detrás del prop */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 760, height: 760, borderRadius: "50%", background: `radial-gradient(circle, ${C}22, transparent 62%)`, opacity: 0.5 + glow * 0.3, filter: "blur(20px)", transform: `translateY(${float}px)` }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile(src)} style={{
          maxWidth: "56%", maxHeight: "60%", objectFit: "contain",
          transform: `translateY(${float + 40 - (1 - e) * 30}px) scale(${0.9 + e * 0.1})`, opacity: e,
          filter: `drop-shadow(0 44px 70px rgba(0,0,0,0.6)) drop-shadow(0 0 30px ${C}33)`,
        }} />
      </AbsoluteFill>

      {text && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 110 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 86, textTransform: "uppercase", textAlign: "center", maxWidth: 1400, lineHeight: 1.04, opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateY(${interpolate(frame, [6, 20], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)` }}>
            {words.map((w, i) => (
              <span key={i} style={{ color: w.em ? C : "#F6F6F8", textShadow: w.em ? `0 0 26px ${C}88` : "0 4px 16px rgba(0,0,0,0.6)", marginRight: "0.22em" }}>{w.t.trim()} </span>
            ))}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
