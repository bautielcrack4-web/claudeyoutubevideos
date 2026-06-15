import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK, FONT_DISPLAY, sec } from "../theme_ben";
import { SfxCue, SFX } from "../components/Sfx";

// GoldVault — motivo recurrente del open-loop "lo más importante lo dejé para el final =
// el oro". `state:"locked"` = caja fuerte cerrada con candado dorado (teaser, se planta);
// `state:"open"` = la puerta gira y estalla luz dorada (pago, al abrir las soluciones).
export const GoldVault: React.FC<{
  durationInFrames: number;
  state?: "locked" | "open";
  label?: string; // "EL ORO"
  caption?: string; // "Lo más importante, al final"
}> = ({ durationInFrames, state = "locked", label = "EL ORO", caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const GOLD = COLORS.amber;

  const enter = spring({ frame, fps, config: { damping: 16, mass: 0.9, stiffness: 130 } });
  const open = state === "open" ? spring({ frame: frame - sec(0.5), fps, config: { damping: 14, mass: 1, stiffness: 90 } }) : 0;
  const doorRot = interpolate(open, [0, 1], [0, -118]);
  const burst = interpolate(open, [0, 0.5, 1], [0, 0.7, 0.95], { extrapolateRight: "clamp" });
  const spin = (state === "locked" ? frame / 40 : interpolate(open, [0, 1], [0, 140]));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, ${GOLD}${state === "open" ? "33" : "14"}, ${COLORS.bg0} 65%)` }} />
      <SfxCue at={sec(0.1)} src={SFX.whoosh} volume={0.2} />
      {state === "open" && <SfxCue at={sec(0.5)} src={SFX.boom2} volume={0.4} />}
      {state === "open" && <SfxCue at={sec(0.7)} src={SFX.winnerChime} volume={0.3} />}

      <div style={{ position: "relative", width: 460, height: 460, transform: `scale(${0.8 + enter * 0.2})`, opacity: enter }}>
        {/* resplandor dorado detrás (estalla al abrir) */}
        <div style={{ position: "absolute", inset: -120, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}, transparent 60%)`, opacity: burst, filter: "blur(8px)" }} />
        {/* cuerpo de la caja */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "linear-gradient(145deg,#26262E,#14141A)", border: `6px solid ${GOLD}`, boxShadow: `0 30px 70px rgba(0,0,0,0.6), inset 0 0 40px ${GOLD}22` }} />
        {/* interior (visible al abrir) */}
        <div style={{ position: "absolute", inset: 26, borderRadius: 18, background: `radial-gradient(circle, ${GOLD}, #7a5a00)`, opacity: burst }} />
        {/* puerta que gira */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "linear-gradient(145deg,#2C2C36,#171720)", border: `6px solid ${GOLD}`, transformOrigin: "left center", transform: `perspective(1200px) rotateY(${doorRot}deg)`, display: "flex", alignItems: "center", justifyContent: "center", backfaceVisibility: "hidden" }}>
          {/* dial / volante */}
          <div style={{ width: 200, height: 200, borderRadius: "50%", border: `10px solid ${GOLD}`, transform: `rotate(${spin}deg)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `inset 0 0 30px ${GOLD}33` }}>
            <div style={{ width: 12, height: 90, background: GOLD, borderRadius: 6 }} />
            <div style={{ position: "absolute", width: 90, height: 12, background: GOLD, borderRadius: 6 }} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 50, textAlign: "center", opacity: enter }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 54, color: GOLD, letterSpacing: 3, textShadow: `0 0 30px ${GOLD}55` }}>{label}</div>
        {caption && <div style={{ color: COLORS.textSoft, fontSize: 28, fontWeight: 600, marginTop: 8 }}>{caption}</div>}
      </div>
    </AbsoluteFill>
  );
};
