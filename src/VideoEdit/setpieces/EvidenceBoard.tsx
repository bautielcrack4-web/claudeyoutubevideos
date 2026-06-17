import { AbsoluteFill, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, MONO, acc } from "../overlays/ui";

// EvidenceBoard — tablero de investigación: fotos reales CLAVADAS (con chinche), apareciendo
// una a una, conectadas por HILO ROJO. El look "conspiración/cover-up", dramático y compartible.
export const EvidenceBoard: React.FC<{
  durationInFrames: number;
  items: { src: string; label?: string }[];
  title?: string;
  accent?: string;
}> = ({ durationInFrames, items, title, accent }) => {
  const a = acc(accent || "red");
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // posiciones deterministas (arco suelto), con rotación leve por índice
  const n = items.length;
  const slots = items.map((_, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    return { x: 22 + col * 28 + (row % 2) * 6, y: 30 + row * 34, rot: ((i * 37) % 11) - 5 };
  });
  const pin = slots.map((s) => ({ x: s.x + 9, y: s.y - 2 }));
  const stringPts = pin.map((p) => `${p.x},${p.y}`).join(" ");
  const drawn = interpolate(f, [fps * (0.4 + n * 0.35), fps * (0.4 + n * 0.35) + fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kb = interpolate(f, [0, durationInFrames], [1, 1.04]); // drift suave para sostener los segundos largos
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 30%, #1a1410 0%, #0a0805 100%)", transform: `scale(${kb})` }}>
      {/* textura sutil del tablero */}
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "5px 5px", opacity: 0.5 }} />
      {/* hilo rojo entre chinches */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {n > 1 && <polyline points={stringPts} fill="none" stroke={a} strokeWidth={0.28} pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - drawn)} style={{ filter: `drop-shadow(0 0 0.6px ${a})` }} />}
      </svg>
      {title && (
        <div style={{ position: "absolute", top: 64, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontFamily: MONO, color: a, fontSize: 15, fontWeight: 700, letterSpacing: 5 }}>EXPEDIENTE</div>
          <div style={{ fontFamily: SANS, color: "#fff", fontSize: 34, fontWeight: 800, marginTop: 4, letterSpacing: 0.3, textShadow: "0 2px 14px rgba(0,0,0,0.8)" }}>{title}</div>
        </div>
      )}
      {items.map((it, i) => {
        const s = slots[i];
        const ap = spring({ frame: f - Math.round(fps * (0.3 + i * 0.35)), fps, config: { damping: 14, mass: 0.7 } });
        return (
          <div key={i} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: "16%", transform: `translate(-50%,-50%) rotate(${s.rot}deg) scale(${0.9 + ap * 0.1})`, opacity: ap, background: "#f4efe6", padding: "8px 8px 26px", boxShadow: "0 16px 34px rgba(0,0,0,0.6)" }}>
            <div style={{ position: "relative", width: "100%", paddingTop: "70%", overflow: "hidden" }}>
              <Img src={staticFile(it.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.9) contrast(1.05)" }} />
            </div>
            {it.label && <div style={{ fontFamily: SANS, color: "#1a1208", fontSize: 13, fontWeight: 700, textAlign: "center", marginTop: 6, letterSpacing: 0.2 }}>{it.label}</div>}
            {/* chinche */}
            <div style={{ position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)", width: 14, height: 14, borderRadius: "50%", background: a, boxShadow: `0 2px 6px rgba(0,0,0,0.6), inset 0 -2px 3px rgba(0,0,0,0.4)` }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
