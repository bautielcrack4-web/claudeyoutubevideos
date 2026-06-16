import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";

// PhraseTag — OVERLAY de FRASE CLAVE sobre el footage (transparente, no lo tapa):
// aparece palabra por palabra, una palabra en *acento*. Centrada-abajo, con sombra fuerte.
export const PhraseTag: React.FC<{
  durationInFrames: number;
  text: string;            // "*Extinto* para siempre"
  accent?: "amber" | "danger" | "accent" | "cold";
  pos?: "center" | "lower";
}> = ({ durationInFrames, text, accent = "amber", pos = "lower" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = COLORS[accent] || COLORS.amber;
  const words = text.split(" ").map((w) => ({ hl: /^\*.*\*$/.test(w), w: w.replace(/\*/g, "") }));
  const outS = interpolate(frame, [durationInFrames - sec(0.5), durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", alignItems: "center", justifyContent: pos === "center" ? "center" : "flex-end" }}>
      <div style={{ maxWidth: 1300, textAlign: "center", padding: pos === "center" ? 0 : "0 0 150px", opacity: 1 - outS }}>
        {words.map((o, i) => {
          const t = spring({ frame: frame - i * 3 - sec(0.1), fps, config: { damping: 18, stiffness: 150 } });
          return (
            <span key={i} style={{
              display: "inline-block", margin: "0 9px",
              fontFamily: FONT_STACK, fontSize: 64, fontWeight: o.hl ? 800 : 600,
              color: o.hl ? col : COLORS.bg0,
              opacity: t, transform: `translateY(${(1 - t) * 18}px)`,
              textShadow: "0 3px 22px rgba(0,0,0,0.92), 0 1px 4px rgba(0,0,0,0.9)",
            }}>{o.w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
