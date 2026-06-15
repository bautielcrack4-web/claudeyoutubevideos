import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK, FONT_DISPLAY, sec } from "../theme_ben";
import { SfxCue, SFX } from "../components/Sfx";

// EstateRecoveryLetter — el dispositivo emocional firma del video: el sobre/carta del
// Estado cae sobre la mesa, se abre, y un SELLO ROJO con la cifra ($180.000) se estampa
// con un golpe grave + sacudida + flash. Look ALARMA (negro/rojo). Reusable para el hook
// y para el pago de la anécdota de Rafael.
export const EstateRecoveryLetter: React.FC<{
  durationInFrames: number;
  amount: string; // "$180,000"
  eyebrow?: string; // "Recuperación de bienes de Medicaid"
  label?: string; // "EL ESTADO RECLAMA"
  hitAt?: number; // frame del estampado (def sec(1.7))
}> = ({ durationInFrames, amount, eyebrow, label = "EL ESTADO RECLAMA", hitAt = sec(1.7) }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // la carta entra (cae + se endereza)
  const drop = spring({ frame, fps, config: { damping: 16, mass: 0.9, stiffness: 120 } });
  const letterY = interpolate(drop, [0, 1], [-260, 0]);
  const letterRot = interpolate(drop, [0, 1], [-9, -2.4]);

  // sello
  const stamp = spring({ frame: frame - hitAt, fps, config: { damping: 9, mass: 0.8, stiffness: 220 } });
  const stampScale = interpolate(stamp, [0, 0.6, 1], [2.6, 0.92, 1], { extrapolateRight: "clamp" });
  const stampOp = interpolate(frame, [hitAt - 2, hitAt + 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // sacudida + flash al estampar
  const since = frame - hitAt;
  const shakeAmt = since >= 0 ? Math.exp(-since / 7) * 16 : 0;
  const shakeX = Math.sin(since * 1.7) * shakeAmt;
  const shakeY = Math.cos(since * 2.1) * shakeAmt * 0.6;
  const flash = since >= 0 ? Math.max(0, 0.5 - since / 14) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK, overflow: "hidden" }}>
      {/* vignette + brasa roja de fondo */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 44%, ${COLORS.bg1} 0%, ${COLORS.bg0} 60%, #000 100%)` }} />
      <SfxCue at={hitAt} src={SFX.boom1} volume={0.45} />
      <SfxCue at={Math.max(0, hitAt - 8)} src={SFX.whoosh} volume={0.22} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translate(${shakeX}px, ${shakeY}px)` }}>
        {/* la carta */}
        <div
          style={{
            position: "relative",
            width: 820,
            height: 560,
            background: "linear-gradient(180deg,#FBFBF6,#ECEadf)",
            borderRadius: 6,
            transform: `translateY(${letterY}px) rotate(${letterRot}deg)`,
            boxShadow: "0 40px 90px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.7)",
            padding: 54,
            opacity: drop,
          }}
        >
          {/* membrete: sello oficial + barra */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 26 }}>
            <div style={{ width: 74, height: 74, borderRadius: "50%", border: `4px solid ${COLORS.accent}`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.accent, fontWeight: 900, fontSize: 30, fontFamily: FONT_DISPLAY }}>$</div>
            <div style={{ flex: 1 }}>
              <div style={{ height: 16, width: "62%", background: "#3A3A3A", borderRadius: 3, marginBottom: 10 }} />
              <div style={{ height: 11, width: "40%", background: "#9A9A9A", borderRadius: 3 }} />
            </div>
          </div>
          {/* cuerpo: líneas redactadas */}
          {[0.96, 0.9, 0.94, 0.82, 0.7].map((w, i) => (
            <div key={i} style={{ height: 13, width: `${w * 100}%`, background: i === 3 ? "#C9C2B0" : "#D7D2C4", borderRadius: 3, marginBottom: 17 }} />
          ))}
        </div>

        {/* SELLO ROJO con la cifra */}
        <div
          style={{
            position: "absolute",
            transform: `rotate(-13deg) scale(${stampScale})`,
            opacity: stampOp,
            border: `7px solid ${COLORS.danger}`,
            color: COLORS.danger,
            background: "rgba(225,21,7,0.10)",
            padding: "14px 34px",
            borderRadius: 12,
            textAlign: "center",
            boxShadow: `0 0 60px ${COLORS.danger}66`,
          }}
        >
          <div style={{ fontFamily: FONT_DISPLAY, letterSpacing: 2, fontSize: 30, lineHeight: 1 }}>{label}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 120, lineHeight: 1, fontVariantNumeric: "tabular-nums", textShadow: `0 4px 18px ${COLORS.danger}55` }}>{amount}</div>
        </div>
      </AbsoluteFill>

      {eyebrow && (
        <div style={{ position: "absolute", top: 78, left: 0, right: 0, textAlign: "center", color: COLORS.textSoft, letterSpacing: 8, fontSize: 22, fontWeight: 800, textTransform: "uppercase" }}>{eyebrow}</div>
      )}
      {/* flash rojo */}
      <AbsoluteFill style={{ background: COLORS.danger, opacity: flash, mixBlendMode: "screen", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
