import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// SplitBeforeAfter — pantalla partida: imagen "antes" cubre todo y un DIVISOR
// vertical barre revelando el "después" en la otra mitad. Línea con tirador. Labels.
const COLD = "#7FB4D8";

export const SplitBeforeAfter: React.FC<{
  durationInFrames: number;
  beforeImg: string;
  afterImg: string;
  beforeLabel?: string;
  afterLabel?: string;
  eyebrow?: string;
  title?: string;
}> = ({ durationInFrames, beforeImg, afterImg, beforeLabel = "Before", afterLabel = "After", eyebrow = "", title = "" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // divisor barre de 96% (antes cubre todo) a 46% (revela el después), con un leve drift
  const sweep = interpolate(frame, [10, Math.round(durationInFrames * 0.55)], [96, 46], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const drift = Math.sin((frame / fps) * 0.9) * 1.2;
  const dx = sweep + drift; // % del ancho

  const titleSpr = spring({ frame, fps, config: { damping: 14 }, durationInFrames: 14 });
  const afterLabO = interpolate(frame, [Math.round(durationInFrames * 0.4), Math.round(durationInFrames * 0.55)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: inO * outO, background: "#000" }}>
      {/* DESPUÉS (full, debajo) */}
      <Img src={staticFile(afterImg)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {/* ANTES (clip a la izquierda del divisor) */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - dx}% 0 0)` }}>
        <Img src={staticFile(beforeImg)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.7) brightness(0.82)" }} />
        <AbsoluteFill style={{ background: "rgba(20,12,10,0.25)" }} />
      </div>

      {/* línea divisora + tirador */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${dx}%`, width: 4, background: "#FBF6EC", boxShadow: "0 0 18px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", top: "50%", left: `${dx}%`, transform: "translate(-50%,-50%)", width: 54, height: 54, borderRadius: "50%", background: "#FBF6EC", border: `3px solid ${COLD}`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.ink, fontFamily: FONT_STACK, fontWeight: 900, fontSize: 26, boxShadow: "0 6px 20px rgba(0,0,0,0.5)" }}>⇆</div>

      {/* título */}
      {(eyebrow || title) && (
        <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: FONT_STACK, opacity: titleSpr }}>
          {eyebrow ? <div style={{ color: COLD, fontSize: 26, letterSpacing: 4, textTransform: "uppercase", fontWeight: 800, textShadow: "0 2px 8px #000" }}>{eyebrow}</div> : null}
          {title ? <div style={{ color: "#FBF6EC", fontSize: 54, fontWeight: 900, textShadow: "0 3px 14px rgba(0,0,0,0.8)" }}>{title}</div> : null}
        </div>
      )}

      {/* labels en chip */}
      <div style={{ position: "absolute", left: 50, bottom: 60, fontFamily: FONT_STACK, fontSize: 34, fontWeight: 800, color: "#FBF6EC", background: "rgba(176,80,60,0.92)", padding: "8px 22px", borderRadius: 12, textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>{beforeLabel}</div>
      <div style={{ position: "absolute", right: 50, bottom: 60, fontFamily: FONT_STACK, fontSize: 34, fontWeight: 800, color: COLORS.ink, background: "rgba(207,230,244,0.95)", padding: "8px 22px", borderRadius: 12, opacity: afterLabO }}>{afterLabel}</div>
    </AbsoluteFill>
  );
};
