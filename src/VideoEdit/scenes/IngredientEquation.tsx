import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// IngredientEquation — "He did it with three things": 3 tarjetas con imagen que
// entran una por una (ancladas al ms de su palabra) con un "+" entre cada una, y
// al final "= cold all summer" con copo. Aditivo (NO tachado, distinto a StruckCards).
const COLD = "#7FB4D8";

const Snow: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    {Array.from({ length: 6 }).map((_, i) => (
      <g key={i} transform={`rotate(${i * 60})`}>
        <line x1={0} y1={0} x2={0} y2={-44} stroke={color} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={-20} x2={-12} y2={-30} stroke={color} strokeWidth={5} strokeLinecap="round" />
        <line x1={0} y1={-20} x2={12} y2={-30} stroke={color} strokeWidth={5} strokeLinecap="round" />
        <line x1={0} y1={-34} x2={-10} y2={-42} stroke={color} strokeWidth={5} strokeLinecap="round" />
        <line x1={0} y1={-34} x2={10} y2={-42} stroke={color} strokeWidth={5} strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

export const IngredientEquation: React.FC<{
  durationInFrames: number;
  items: { image: string; label: string; at?: number }[];
  resultLabel?: string;
}> = ({ items, durationInFrames, resultLabel = "Cold all summer" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const resAt = (items[items.length - 1]?.at ?? 2) + 1.0;
  const resSpr = spring({ frame: frame - Math.round(resAt * fps), fps, config: { damping: 13, mass: 0.8 }, durationInFrames: 18 });

  return (
    <AbsoluteFill style={{ opacity: inO * outO, alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 210, width: "100%", textAlign: "center", fontFamily: FONT_STACK }}>
        <div style={{ color: COLORS.cold, fontSize: 26, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700 }}>That's all it took</div>
        <div style={{ color: COLORS.ink, fontSize: 56, fontWeight: 800, marginTop: 2 }}>He did it with three things</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 60 }}>
        {items.map((it, i) => {
          const at = it.at ?? i * 0.9;
          const spr = spring({ frame: frame - Math.round(at * fps), fps, config: { damping: 15, mass: 0.7, stiffness: 150 }, durationInFrames: 16 });
          const y = interpolate(spr, [0, 1], [40, 0]);
          const sc = interpolate(spr, [0, 1], [0.85, 1]);
          // "+" entre tarjetas, aparece tras la siguiente
          const plus = i > 0
            ? interpolate(frame - Math.round((it.at ?? 0) * fps), [-2, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 0;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22 }}>
              {i > 0 && (
                <span style={{ fontFamily: FONT_STACK, fontSize: 72, fontWeight: 800, color: COLORS.ink, opacity: plus, transform: `scale(${plus})` }}>+</span>
              )}
              <div style={{
                width: 304, height: 372, transform: `translateY(${y}px) scale(${sc})`, opacity: spr,
                borderRadius: 26, overflow: "hidden", position: "relative",
                boxShadow: "0 24px 56px rgba(20,16,10,0.42)", border: "3px solid rgba(255,250,240,0.92)", background: COLORS.bg2,
              }}>
                <Img src={staticFile(it.image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,12,8,0.85) 0%, rgba(15,12,8,0.1) 45%, transparent 70%)" }} />
                <div style={{ position: "absolute", top: 12, left: 12, width: 40, height: 40, borderRadius: "50%", background: COLORS.danger, color: "#FBF6EC", fontFamily: FONT_STACK, fontSize: 26, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 24, textAlign: "center", fontFamily: FONT_STACK, fontSize: 32, fontWeight: 700, color: "#FBF6EC", textShadow: "0 2px 8px rgba(0,0,0,0.8)", padding: "0 12px" }}>{it.label}</div>
              </div>
            </div>
          );
        })}

        {/* = resultado */}
        <span style={{ fontFamily: FONT_STACK, fontSize: 72, fontWeight: 800, color: COLD, opacity: resSpr, transform: `scale(${resSpr})` }}>=</span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: resSpr, transform: `scale(${interpolate(resSpr, [0, 1], [0.6, 1])})` }}>
          <Snow size={120} color={COLD} />
          <div style={{ fontFamily: FONT_STACK, fontSize: 30, fontWeight: 800, color: COLORS.ink, marginTop: 6, maxWidth: 200, textAlign: "center" }}>{resultLabel}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
