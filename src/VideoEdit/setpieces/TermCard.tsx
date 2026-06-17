import { AbsoluteFill, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "../components/Media";
import { SANS, MONO, acc } from "../overlays/ui";

// TermCard — el fondo se desenfoca/oscurece y aparece una FICHA tipo diccionario: término +
// definición corta (+ miniatura opcional). Para EXPLICAR un concepto en 2-3 líneas.
export const TermCard: React.FC<{
  durationInFrames: number;
  bg: string;
  term: string;
  definition: string;
  image?: string;
  accent?: string;
}> = ({ durationInFrames, bg, term, definition, image, accent }) => {
  const a = acc(accent || "cyan");
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blur = interpolate(f, [0, fps * 0.6], [0, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bright = interpolate(f, [0, fps * 0.6], [1, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inCard = spring({ frame: f - Math.round(fps * 0.45), fps, config: { damping: 16, mass: 0.8 } });
  const op = interpolate(f, [0, fps * 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#06080c", opacity: op }}>
      <AbsoluteFill style={{ transform: "scale(1.05)" }}>
        <Media src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px) brightness(${bright})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(4,7,11,0.5)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, maxWidth: 1180, padding: "30px 40px", background: "rgba(8,13,20,0.62)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.12)", borderLeft: `4px solid ${a}`, borderRadius: 16, boxShadow: "0 30px 70px rgba(0,0,0,0.6)", opacity: inCard, transform: `translateY(${(1 - inCard) * 26}px) scale(${0.97 + inCard * 0.03})` }}>
          {image && (
            <div style={{ width: 200, height: 200, flexShrink: 0, borderRadius: 12, overflow: "hidden", border: `2px solid ${a}66` }}>
              <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <div style={{ fontFamily: MONO, color: a, fontSize: 15, fontWeight: 700, letterSpacing: 4 }}>¿QUÉ ES?</div>
            <div style={{ fontFamily: SANS, color: "#fff", fontSize: 44, fontWeight: 800, margin: "6px 0 12px", letterSpacing: 0.2 }}>{term}</div>
            <div style={{ fontFamily: SANS, color: "rgba(255,255,255,0.85)", fontSize: 25, fontWeight: 500, lineHeight: 1.45, maxWidth: 760 }}>{definition}</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
