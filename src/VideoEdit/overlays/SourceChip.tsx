import { AbsoluteFill } from "remotion";
import { MONO, acc, useTagReveal } from "./ui";

// SourceChip — crédito mínimo y discreto (esquina inf. derecha). Suma credibilidad
// en los claims fuertes, como los buenos canales doc. 1-2 por sección.
export const SourceChip: React.FC<{
  durationInFrames: number;
  text: string;
  accent?: string;
}> = ({ durationInFrames, text, accent }) => {
  const a = acc(accent);
  const { op } = useTagReveal(durationInFrames, 6);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", bottom: 72, right: 86, display: "flex", alignItems: "center", gap: 8, opacity: op * 0.82 }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: a, boxShadow: `0 0 6px ${a}` }} />
        <span style={{ fontFamily: MONO, color: "rgba(255,255,255,0.80)", fontSize: 13, fontWeight: 600, letterSpacing: 0.4, textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};
