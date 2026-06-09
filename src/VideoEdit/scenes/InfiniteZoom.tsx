import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { Media } from "../components/Media";
import { SfxCue, SFX } from "../components/Sfx";

// ── INFINITE ZOOM (match-cut / Droste) ────────────────────────────────────────
// Push-in CONTINUO e hipnótico: la cámara se mete sin parar en una imagen que, al
// llegar al centro, se convierte en la siguiente (la próxima nace chiquita en el
// centro y crece a ocupar todo mientras la anterior sigue agrandándose y se va).
// Sin cortes → muy adictivo. Pasale una lista de imágenes (y labels opcionales).
export const InfiniteZoom: React.FC<{
  durationInFrames: number;
  images: { src: string; label?: string }[];
  zoom?: number; // cuánto agranda cada paso (default 6)
  accent?: string;
}> = ({ durationInFrames, images, zoom = 6, accent = COLORS.bg0 }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const steps = images.length;
  const stepDur = durationInFrames / steps;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, background: COLORS.ink, overflow: "hidden" }}>
      {images.map((img, i) => {
        // progreso local de ESTA imagen (entra chica del centro, crece, se va grande)
        const t = (frame - i * stepDur) / stepDur; // <0 aún no, 0..1 su turno, >1 ya pasó
        if (t < -1.05 || t > 1.6) return null;
        // escala: de 1/zoom (chiquita) → 1 (llena) → zoom (la atravesamos)
        const scale = Math.pow(zoom, interpolate(t, [-1, 0, 1], [-1, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }));
        const opacity = interpolate(t, [-1, -0.6, 0.7, 1.1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const blur = interpolate(t, [-1, -0.5, 0.6, 1.1], [10, 0, 0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <AbsoluteFill key={i} style={{ transform: `scale(${scale})`, opacity, filter: `blur(${blur}px)`, zIndex: i }}>
            <Media src={img.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {/* viñeta-portal que ayuda a "meterse" por el centro */}
            <AbsoluteFill style={{ background: "radial-gradient(60% 55% at 50% 50%, rgba(0,0,0,0) 40%, rgba(10,8,5,0.55) 100%)" }} />
            {img.label && Math.abs(t) < 0.5 && (
              <AbsoluteFill style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: height * 0.16 }}>
                <div style={{ fontSize: 64, fontWeight: 900, color: accent, letterSpacing: 1, opacity: interpolate(Math.abs(t), [0, 0.4], [1, 0]), textShadow: "0 4px 30px rgba(0,0,0,0.8)" }}>{img.label}</div>
              </AbsoluteFill>
            )}
          </AbsoluteFill>
        );
      })}
      {/* leve grano de profundidad al frente */}
      <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 50%, rgba(0,0,0,0) 60%, rgba(10,8,5,0.4))", pointerEvents: "none" }} />
      {/* whoosh continuo por cada salto */}
      {images.map((_, i) => i > 0 && <SfxCue key={"z" + i} at={Math.round(i * stepDur - sec(0.2))} src={SFX.camTravel ?? SFX.whoosh2} volume={0.34} durationInFrames={sec(0.6)} />)}
    </AbsoluteFill>
  );
};
