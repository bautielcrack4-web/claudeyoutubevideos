import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK, FONT_DISPLAY, sec } from "../theme_ben";
import { SfxCue, SFX } from "../components/Sfx";

// DeedStamp — la escritura (Lady Bird Deed) + firma + un SELLO VERDE que se estampa
// ("FUERA DEL ALCANCE"). Versión positiva/verde del EstateRecoveryLetter. Paga el
// open-loop del "un solo documento que salvaba la casa de Rafael".
export const DeedStamp: React.FC<{
  durationInFrames: number;
  title?: string; // encabezado de la escritura
  stampText?: string; // "FUERA DEL ALCANCE"
  caption?: string; // "Un documento. Una firma."
  hitAt?: number;
}> = ({ durationInFrames, title = "ESCRITURA", stampText = "FUERA DEL ALCANCE", caption = "Un documento. Una firma.", hitAt = sec(1.8) }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const G = COLORS.good;

  const enter = spring({ frame, fps, config: { damping: 16, mass: 0.9, stiffness: 120 } });
  // firma que se traza
  const sign = interpolate(frame, [sec(0.7), sec(1.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stamp = spring({ frame: frame - hitAt, fps, config: { damping: 9, mass: 0.8, stiffness: 220 } });
  const stampScale = interpolate(stamp, [0, 0.6, 1], [2.4, 0.92, 1], { extrapolateRight: "clamp" });
  const stampOp = interpolate(frame, [hitAt - 2, hitAt + 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const since = frame - hitAt;
  const flash = since >= 0 ? Math.max(0, 0.4 - since / 14) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, ${G}1c, ${COLORS.bg0} 62%)` }} />
      <SfxCue at={sec(0.7)} src={SFX.lineDraw} volume={0.26} />
      <SfxCue at={hitAt} src={SFX.boom2} volume={0.4} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 760, height: 540, background: "linear-gradient(180deg,#FBFBF6,#ECEADF)", borderRadius: 6, transform: `translateY(${(1 - enter) * 60}px) rotate(2deg)`, boxShadow: "0 40px 90px rgba(0,0,0,0.55)", padding: 50, opacity: enter }}>
          <div style={{ color: "#2A2620", fontFamily: FONT_DISPLAY, fontSize: 34, letterSpacing: 2, marginBottom: 22 }}>{title}</div>
          {[0.92, 0.8, 0.88].map((w, i) => (
            <div key={i} style={{ height: 12, width: `${w * 100}%`, background: "#D7D2C4", borderRadius: 3, marginBottom: 16 }} />
          ))}
          {/* línea de firma */}
          <div style={{ position: "absolute", left: 50, right: 50, bottom: 96 }}>
            <svg viewBox="0 0 600 80" style={{ width: "100%", height: 80, overflow: "visible" }}>
              <path d="M10 60 C 60 10, 110 70, 160 36 C 210 6, 250 64, 300 40 C 350 18, 400 60, 470 30" fill="none" stroke="#1A2E66" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sign} />
            </svg>
            <div style={{ borderTop: "2px solid #9A9A8A", marginTop: 6, paddingTop: 8, color: "#6A6458", fontSize: 20, fontWeight: 600 }}>Firma del propietario</div>
          </div>
        </div>

        {/* SELLO VERDE */}
        <div style={{ position: "absolute", transform: `rotate(-11deg) scale(${stampScale})`, opacity: stampOp, border: `7px solid ${G}`, color: G, background: `${G}1a`, padding: "12px 30px", borderRadius: 12, textAlign: "center", boxShadow: `0 0 60px ${G}66` }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 64, lineHeight: 1, letterSpacing: 1 }}>{stampText}</div>
        </div>
      </AbsoluteFill>

      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", color: COLORS.text, fontSize: 38, fontWeight: 800, opacity: interpolate(frame, [hitAt, hitAt + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{caption}</div>
      <AbsoluteFill style={{ background: G, opacity: flash, mixBlendMode: "screen", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
