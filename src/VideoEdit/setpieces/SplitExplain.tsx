import { AbsoluteFill, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "../components/Media";
import { SANS, MONO, acc } from "../overlays/ui";

// SplitExplain — fondo desenfocado/oscurecido; FOTO enmarcada a la izquierda y a la derecha
// un título + PUNTOS que aparecen uno a uno. Para explicaciones de 2-4 ideas.
export const SplitExplain: React.FC<{
  durationInFrames: number;
  bg: string;
  image: string;
  title: string;
  points: string[];
  eyebrow?: string;
  accent?: string;
}> = ({ durationInFrames, bg, image, title, points, eyebrow, accent }) => {
  const a = acc(accent || "amber");
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blur = interpolate(f, [0, fps * 0.6], [0, 13], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bright = interpolate(f, [0, fps * 0.6], [1, 0.42], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inImg = spring({ frame: f - Math.round(fps * 0.45), fps, config: { damping: 16, mass: 0.8 } });
  const inTitle = spring({ frame: f - Math.round(fps * 0.7), fps, config: { damping: 18, mass: 0.8 } });
  const op = interpolate(f, [0, fps * 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#06080c", opacity: op }}>
      <AbsoluteFill style={{ transform: "scale(1.05)" }}>
        <Media src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px) brightness(${bright})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(4,7,11,0.52)" }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 64, padding: "0 110px" }}>
        <div style={{ width: "42%", maxWidth: 760, opacity: inImg, transform: `translateX(${(1 - inImg) * -50}px) scale(${0.94 + inImg * 0.06})` }}>
          <div style={{ position: "relative", width: "100%", paddingTop: "66%", borderRadius: 12, overflow: "hidden", border: `2px solid ${a}`, boxShadow: "0 26px 60px rgba(0,0,0,0.6)" }}>
            <Img src={staticFile(image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        <div style={{ width: "46%", maxWidth: 700 }}>
          {eyebrow && <div style={{ fontFamily: MONO, color: a, fontSize: 15, fontWeight: 700, letterSpacing: 4, marginBottom: 10, opacity: inTitle }}>{eyebrow.toUpperCase()}</div>}
          <div style={{ fontFamily: SANS, color: "#fff", fontSize: 44, fontWeight: 800, lineHeight: 1.1, opacity: inTitle, transform: `translateX(${(1 - inTitle) * 40}px)`, textShadow: "0 3px 18px rgba(0,0,0,0.7)" }}>{title}</div>
          <div style={{ width: 64, height: 3, background: a, margin: "20px 0 24px", boxShadow: `0 0 12px ${a}` }} />
          {points.map((p, i) => {
            const ap = spring({ frame: f - Math.round(fps * (1.0 + i * 0.45)), fps, config: { damping: 18, mass: 0.7 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16, opacity: ap, transform: `translateX(${(1 - ap) * 30}px)` }}>
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: a, marginTop: 9, flexShrink: 0, boxShadow: `0 0 8px ${a}` }} />
                <div style={{ fontFamily: SANS, color: "rgba(255,255,255,0.9)", fontSize: 25, fontWeight: 600, lineHeight: 1.35, textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>{p}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
