import { AbsoluteFill, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "../components/Media";
import { SANS, MONO, acc } from "../overlays/ui";

// FocusCard — el clip de fondo se DESENFOCA + OSCURECE y entra una FOTO grande + título +
// descripción que EXPLICAN. El recurso explicativo por excelencia. bg = clip o imagen.
export const FocusCard: React.FC<{
  durationInFrames: number;
  bg: string;
  image: string;
  eyebrow?: string;
  title: string;
  desc: string;
  accent?: string;
  imageSide?: "left" | "right";
}> = ({ durationInFrames, bg, image, eyebrow, title, desc, accent, imageSide = "left" }) => {
  const a = acc(accent || "amber");
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blur = interpolate(f, [0, fps * 0.6], [0, 13], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bright = interpolate(f, [0, fps * 0.6], [1, 0.42], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dark = interpolate(f, [0, fps * 0.6], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inImg = spring({ frame: f - Math.round(fps * 0.5), fps, config: { damping: 16, mass: 0.8 } });
  const inTxt = spring({ frame: f - Math.round(fps * 0.78), fps, config: { damping: 18, mass: 0.8 } });
  const op = interpolate(f, [0, fps * 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const left = imageSide === "left";
  return (
    <AbsoluteFill style={{ background: "#06080c", opacity: op }}>
      <AbsoluteFill style={{ transform: "scale(1.05)" }}>
        <Media src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px) brightness(${bright})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(4,7,11,${dark})` }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: left ? "row" : "row-reverse", alignItems: "center", justifyContent: "center", gap: 60, padding: "0 110px" }}>
        {/* FOTO enmarcada */}
        <div style={{ width: "40%", maxWidth: 760, opacity: inImg, transform: `translateX(${(1 - inImg) * (left ? -50 : 50)}px) scale(${0.94 + inImg * 0.06})` }}>
          <div style={{ position: "relative", width: "100%", paddingTop: "64%", borderRadius: 12, overflow: "hidden", border: `2px solid ${a}`, boxShadow: `0 26px 60px rgba(0,0,0,0.6), 0 0 0 6px rgba(0,0,0,0.25)` }}>
            <Img src={staticFile(image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        {/* TEXTO */}
        <div style={{ width: "46%", maxWidth: 720, opacity: inTxt, transform: `translateX(${(1 - inTxt) * (left ? 50 : -50)}px)` }}>
          {eyebrow && <div style={{ fontFamily: MONO, color: a, fontSize: 16, fontWeight: 700, letterSpacing: 4, marginBottom: 12 }}>{eyebrow.toUpperCase()}</div>}
          <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, lineHeight: 1.1, letterSpacing: 0.2, textShadow: "0 3px 18px rgba(0,0,0,0.7)" }}>{title}</div>
          <div style={{ width: 64, height: 3, background: a, margin: "18px 0", boxShadow: `0 0 12px ${a}` }} />
          <div style={{ fontFamily: SANS, color: "rgba(255,255,255,0.86)", fontSize: 24, fontWeight: 500, lineHeight: 1.5, textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>{desc}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
