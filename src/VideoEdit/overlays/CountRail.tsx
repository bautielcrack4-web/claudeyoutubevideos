import { AbsoluteFill } from "remotion";
import { SANS, MONO, acc, useTagReveal } from "./ui";

// CountRail — marcador de listicle PERSISTENTE y discreto ("Nº 07 · ULUBURÚN" + riel de
// 7 ticks con el actual encendido). Recuerda que es un Top-7 → sostiene el open-loop.
export const CountRail: React.FC<{
  durationInFrames: number;
  rank: number;
  total?: number;
  name: string;
  accent?: string;
}> = ({ durationInFrames, rank, total = 7, name, accent }) => {
  const a = acc(accent);
  const { op, y } = useTagReveal(durationInFrames, -10);
  const lit = total - rank; // conteo 7→1: el #7 enciende el primer tick
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 74, left: 86, display: "flex", alignItems: "center", gap: 12, opacity: op * 0.92, transform: `translateY(${y}px)` }}>
        <span style={{ fontFamily: MONO, color: a, fontSize: 13, fontWeight: 700, letterSpacing: 2, textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}>Nº</span>
        <span style={{ fontFamily: SANS, color: "#fff", fontSize: 30, fontWeight: 900, letterSpacing: 1, textShadow: "0 2px 12px rgba(0,0,0,0.65)" }}>{String(rank).padStart(2, "0")}</span>
        <span style={{ fontFamily: SANS, color: "rgba(255,255,255,0.88)", fontSize: 18, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}>{name}</span>
        <span style={{ display: "flex", gap: 5, marginLeft: 6 }}>
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} style={{ width: i === lit ? 16 : 7, height: 4, borderRadius: 2, background: i === lit ? a : "rgba(255,255,255,0.28)", boxShadow: i === lit ? `0 0 8px ${a}` : "none" }} />
          ))}
        </span>
      </div>
    </AbsoluteFill>
  );
};
