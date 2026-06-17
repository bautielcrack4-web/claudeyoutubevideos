import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, MONO, acc } from "../overlays/ui";

// ExpeditionMap — mapa vintage REAL + ruta que se DIBUJA + pins pulsantes + barco que
// recorre la ruta. El recurso "documental serio" para ubicar/conectar lugares.
// pins/route en coords NORMALIZADAS 0..1 (x: izq→der, y: arriba→abajo).
export const ExpeditionMap: React.FC<{
  durationInFrames: number;
  mapImage: string;
  route?: { x: number; y: number }[];
  pins?: { x: number; y: number; label?: string }[];
  eyebrow?: string;
  title?: string;
  accent?: string;
}> = ({ durationInFrames, mapImage, route = [], pins = [], eyebrow, title, accent }) => {
  const a = acc(accent || "amber");
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const VW = 100, VH = 56.25;
  const scale = interpolate(f, [0, durationInFrames], [1.05, 1.13]);
  const draw = interpolate(f, [fps * 0.5, fps * 0.5 + fps * 2.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pts = route.map((p) => `${p.x * VW},${p.y * VH}`).join(" ");
  // barco en la cabeza de la ruta
  const idx = draw * Math.max(0, route.length - 1);
  const i0 = Math.floor(idx), fr = idx - i0;
  const head = route.length > 1 ? { x: (route[i0].x + (route[Math.min(i0 + 1, route.length - 1)].x - route[i0].x) * fr) * VW, y: (route[i0].y + (route[Math.min(i0 + 1, route.length - 1)].y - route[i0].y) * fr) * VH } : null;
  return (
    <AbsoluteFill style={{ background: "#06080c" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Img src={staticFile(mapImage)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.78) brightness(0.66) contrast(1.06)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(85% 85% at 50% 42%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.6) 100%)" }} />
      <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {route.length > 1 && (
          <polyline points={pts} fill="none" stroke={a} strokeWidth={0.5} strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - draw)} style={{ filter: `drop-shadow(0 0 0.8px ${a})` }} />
        )}
        {pins.map((p, i) => {
          const appear = interpolate(f, [fps * (0.4 + i * 0.5), fps * (0.9 + i * 0.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const pulse = 1 + 0.35 * Math.sin(f / 7 + i);
          return (
            <g key={i} opacity={appear}>
              <circle cx={p.x * VW} cy={p.y * VH} r={1.6 * pulse} fill="none" stroke={a} strokeWidth={0.3} opacity={0.5} />
              <circle cx={p.x * VW} cy={p.y * VH} r={0.9} fill={a} />
            </g>
          );
        })}
        {head && (
          <circle cx={head.x} cy={head.y} r={1.1} fill="#fff" style={{ filter: `drop-shadow(0 0 2px ${a})` }} />
        )}
      </svg>
      {/* etiquetas de pin (HTML, nítidas) */}
      {pins.map((p, i) => {
        const appear = interpolate(f, [fps * (0.5 + i * 0.5), fps * (1.0 + i * 0.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return p.label ? (
          <div key={i} style={{ position: "absolute", left: `${p.x * 100}%`, top: `${p.y * 100}%`, transform: "translate(14px,-50%)", opacity: appear }}>
            <span style={{ fontFamily: SANS, color: "#fff", fontSize: 19, fontWeight: 700, letterSpacing: 0.5, textShadow: "0 2px 10px rgba(0,0,0,0.9)", background: "rgba(8,13,20,0.5)", padding: "3px 9px", borderRadius: 6, border: `1px solid ${a}55` }}>{p.label}</span>
          </div>
        ) : null;
      })}
      <div style={{ position: "absolute", left: 84, bottom: 92 }}>
        {eyebrow && <div style={{ fontFamily: MONO, color: a, fontSize: 14, fontWeight: 700, letterSpacing: 4, marginBottom: 8, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>{eyebrow.toUpperCase()}</div>}
        {title && <div style={{ fontFamily: SANS, color: "#fff", fontSize: 40, fontWeight: 800, letterSpacing: 0.3, maxWidth: 900, textShadow: "0 3px 18px rgba(0,0,0,0.85)" }}>{title}</div>}
      </div>
    </AbsoluteFill>
  );
};
