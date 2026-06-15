import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK, FONT_DISPLAY, sec } from "../theme_ben";
import { SfxCue, SFX } from "../components/Sfx";

// CostOdometer — contador que SUBE y "no para": el costo del asilo ($8.000/mes →
// $100.000/año, año tras año). El número rueda hacia arriba, golpea el total, y un
// "AÑO TRAS AÑO" late detrás para dar la sensación de que nunca termina. Look alarma (rojo).
export const CostOdometer: React.FC<{
  durationInFrames: number;
  to: number; // valor final
  prefix?: string; // "$"
  suffix?: string; // "/año"
  eyebrow?: string;
  label?: string; // bajada
  repeat?: string; // texto que late detrás ("año tras año tras año")
}> = ({ durationInFrames, to, prefix = "$", suffix = "", eyebrow, label, repeat = "AÑO TRAS AÑO" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const R = COLORS.accent;

  const startAt = sec(0.4);
  const countFrames = sec(1.6);
  const enter = spring({ frame: frame - startAt, fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });
  const count = interpolate(frame, [startAt, startAt + countFrames], [0, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const landAt = startAt + countFrames;
  const land = spring({ frame: frame - landAt, fps, config: { damping: 10, mass: 0.7, stiffness: 210 } });
  const landScale = 1 + interpolate(land, [0, 0.5, 1], [0, 0.1, 0], { extrapolateRight: "clamp" });
  const shown = Math.round(count).toLocaleString("en-US");

  // el "año tras año" late tras aterrizar
  const pulse = frame > landAt ? 0.12 + 0.1 * (0.5 + 0.5 * Math.sin((frame - landAt) / 9)) : 0;

  const ticks = 7;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, ${R}1c, ${COLORS.bg0} 62%)` }} />
      {/* texto fantasma latiendo detrás */}
      <div style={{ position: "absolute", fontFamily: FONT_DISPLAY, fontSize: 200, color: R, opacity: pulse, letterSpacing: 6, transform: "rotate(-6deg)", whiteSpace: "nowrap", pointerEvents: "none" }}>{repeat}</div>

      <SfxCue at={startAt} src={SFX.numberRoll} volume={0.4} durationInFrames={countFrames} />
      {Array.from({ length: ticks }).map((_, i) => (
        <SfxCue key={i} at={Math.round(startAt + (countFrames * (i + 1)) / ticks)} src={SFX.digitTick} volume={0.28} durationInFrames={sec(0.2)} />
      ))}
      <SfxCue at={landAt} src={SFX.numberSlam} volume={0.5} />

      <div style={{ position: "relative", textAlign: "center", opacity: enter }}>
        {eyebrow && <div style={{ color: R, letterSpacing: 7, fontSize: 24, fontWeight: 800, fontFamily: FONT_DISPLAY, marginBottom: 14 }}>{eyebrow.toUpperCase()}</div>}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", color: R, fontFamily: FONT_DISPLAY, lineHeight: 0.9, transform: `scale(${(0.85 + enter * 0.15) * landScale})`, textShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 50px ${R}55` }}>
          <span style={{ fontSize: 130 }}>{prefix}</span>
          <span style={{ fontSize: 260, fontVariantNumeric: "tabular-nums" }}>{shown}</span>
          {suffix && <span style={{ fontSize: 110, marginLeft: 8 }}>{suffix}</span>}
        </div>
        {label && <div style={{ marginTop: 46, fontSize: 34, fontWeight: 700, color: COLORS.textSoft, maxWidth: 1000 }}>{label}</div>}
      </div>
    </AbsoluteFill>
  );
};
