import { AbsoluteFill } from "remotion";
import { SANS, acc, useTagReveal, panel } from "./ui";

// DocLabel — lower-third que NOMBRA lo que se ve (artefacto, objeto, sujeto).
// El recurso doc por excelencia: el espectador sabe qué mira sin que lo diga el narrador.
export const DocLabel: React.FC<{
  durationInFrames: number;
  label: string;
  sub?: string;
  accent?: string;
  corner?: "bl" | "br";
}> = ({ durationInFrames, label, sub, accent, corner = "bl" }) => {
  const a = acc(accent);
  const { op, y } = useTagReveal(durationInFrames);
  const side = corner === "br" ? { right: 84, alignItems: "flex-end" as const } : { left: 84, alignItems: "flex-start" as const };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", bottom: 104, ...side, display: "flex", flexDirection: "column", opacity: op, transform: `translateY(${y}px)` }}>
        <div style={{ ...panel(a), padding: "11px 18px", maxWidth: 820 }}>
          <div style={{ fontFamily: SANS, color: "#fff", fontSize: 31, fontWeight: 800, letterSpacing: 0.2, lineHeight: 1.12, textShadow: "0 2px 14px rgba(0,0,0,0.55)" }}>{label}</div>
          {sub && <div style={{ fontFamily: SANS, color: "rgba(255,255,255,0.70)", fontSize: 18, fontWeight: 600, letterSpacing: 0.3, marginTop: 4 }}>{sub}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};
