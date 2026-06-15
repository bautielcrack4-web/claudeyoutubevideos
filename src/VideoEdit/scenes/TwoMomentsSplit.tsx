import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK, FONT_DISPLAY, sec } from "../theme_ben";
import { SfxCue, SFX } from "../components/Sfx";

// TwoMomentsSplit — LA pieza que explica el malentendido central: la MISMA casa, dos
// momentos. Izquierda VERDE "mientras vive = EXENTA, intocable"; derecha ROJA "al
// fallecer = EN LA MIRA". Las mitades entran desde los lados, un divisor las parte, y
// una marea roja cubre la casa de la derecha. Look alarma.
const House: React.FC<{ color: string; shadeRed?: number }> = ({ color, shadeRed = 0 }) => (
  <svg viewBox="0 0 120 100" style={{ width: 220, height: 184, overflow: "visible" }}>
    <polygon points="60,12 110,52 10,52" fill={color} />
    <rect x="22" y="52" width="76" height="44" fill={color} />
    <rect x="52" y="70" width="18" height="26" fill={COLORS.bg0} opacity={0.5} />
    {shadeRed > 0 && (
      <g opacity={shadeRed}>
        <polygon points="60,12 110,52 10,52" fill={COLORS.danger} />
        <rect x="22" y="52" width="76" height="44" fill={COLORS.danger} />
      </g>
    )}
  </svg>
);

export const TwoMomentsSplit: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  leftLabel?: string;
  leftSub?: string;
  rightLabel?: string;
  rightSub?: string;
}> = ({
  durationInFrames,
  eyebrow = "La misma casa, distinto momento",
  leftLabel = "MIENTRAS VIVE",
  leftSub = "Exenta · intocable",
  rightLabel = "AL FALLECER",
  rightSub = "En la mira del Estado",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inL = spring({ frame: frame - sec(0.2), fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });
  const inR = spring({ frame: frame - sec(0.5), fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });
  const tide = interpolate(frame, [sec(1.6), sec(2.8)], [0, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const half: React.CSSProperties = { position: "absolute", top: 0, bottom: 0, width: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SfxCue at={sec(0.2)} src={SFX.whoosh} volume={0.2} />
      <SfxCue at={sec(1.6)} src={SFX.boom2} volume={0.34} />

      {/* IZQUIERDA — verde / a salvo */}
      <div style={{ ...half, left: 0, background: `radial-gradient(circle at 50% 45%, ${COLORS.good}26, ${COLORS.bg0} 70%)`, transform: `translateX(${(1 - inL) * -90}px)`, opacity: inL }}>
        <div style={{ color: COLORS.good, letterSpacing: 4, fontSize: 26, fontWeight: 800, fontFamily: FONT_DISPLAY }}>{leftLabel}</div>
        <House color={COLORS.good} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: COLORS.good, fontSize: 30, fontWeight: 800 }}>
          <span style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.good, color: "#06210F", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>✓</span>
          {leftSub}
        </div>
      </div>

      {/* DERECHA — rojo / en la mira */}
      <div style={{ ...half, right: 0, background: `radial-gradient(circle at 50% 45%, ${COLORS.accent}26, ${COLORS.bg0} 70%)`, transform: `translateX(${(1 - inR) * 90}px)`, opacity: inR }}>
        <div style={{ color: COLORS.accent, letterSpacing: 4, fontSize: 26, fontWeight: 800, fontFamily: FONT_DISPLAY }}>{rightLabel}</div>
        <House color={COLORS.textSoft} shadeRed={tide} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: COLORS.accent, fontSize: 30, fontWeight: 800 }}>
          <span style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.accent, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>⚠</span>
          {rightSub}
        </div>
      </div>

      {/* divisor central */}
      <div style={{ position: "absolute", left: "50%", top: "10%", bottom: "10%", width: 4, transform: "translateX(-50%)", background: `linear-gradient(${COLORS.good}, ${COLORS.accent})`, boxShadow: "0 0 24px rgba(0,0,0,0.6)", opacity: Math.min(inL, inR) }} />

      {eyebrow && (
        <div style={{ position: "absolute", top: 64, left: 0, right: 0, textAlign: "center", color: COLORS.text, letterSpacing: 6, fontSize: 24, fontWeight: 800, textTransform: "uppercase" }}>{eyebrow}</div>
      )}
    </AbsoluteFill>
  );
};
