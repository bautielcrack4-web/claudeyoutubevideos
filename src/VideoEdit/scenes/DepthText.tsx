import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { Media } from "../components/Media";
import { SfxCue, SFX } from "../components/Sfx";

// ── DEPTH TEXT (texto DETRÁS del sujeto) ──────────────────────────────────────
// El efecto de profundidad de los canales top: el título aparece ENTRE el fondo y
// el sujeto, quedando parcialmente TAPADO por él. Necesita dos imágenes con el MISMO
// encuadre: `back` (la foto completa) y `fore` (un PNG con el sujeto RECORTADO sobre
// fondo TRANSPARENTE). Ambas reciben el mismo Ken-Burns para que se muevan juntas;
// el texto va en medio. Generá `fore` con gpt-image-2 pidiendo `background:transparent`
// (o recorte del sujeto de `back`).
export const DepthText: React.FC<{
  durationInFrames: number;
  back: string;
  fore: string;
  title: string;
  accent?: string;
  fontSize?: number;
}> = ({ durationInFrames, back, fore, title, accent = COLORS.bg0, fontSize = 220 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken-Burns COMPARTIDO (back y fore se mueven idénticos → el recorte calza)
  const kb = interpolate(frame, [0, durationInFrames], [1.05, 1.16], { extrapolateRight: "clamp" });
  const panX = interpolate(frame, [0, durationInFrames], [-14, 14], { extrapolateRight: "clamp" });
  const shared = `scale(${kb}) translateX(${panX}px)`;

  const tIn = spring({ frame: frame - sec(0.5), fps, config: { damping: 18, mass: 0.8, stiffness: 150 } });
  const titleY = interpolate(tIn, [0, 1], [40, 0]);
  const titleBlur = interpolate(tIn, [0, 1], [14, 0]);
  const sweepX = interpolate(frame - sec(0.8), [0, sec(0.8)], [-140, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, background: COLORS.ink, overflow: "hidden" }}>
      {/* FONDO (foto completa, algo oscurecida para que lea el texto) */}
      <AbsoluteFill style={{ transform: shared }}>
        <Media src={back} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 50%, rgba(12,9,6,0.35), rgba(12,9,6,0.62))" }} />

      {/* TEXTO (entre el fondo y el sujeto) */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", overflow: "hidden", fontSize, fontWeight: 900, color: accent, letterSpacing: interpolate(tIn, [0, 1], [10, 1]), opacity: interpolate(tIn, [0, 0.4], [0, 1]), transform: `translateY(${titleY}px)`, filter: `blur(${titleBlur}px)`, textShadow: "0 6px 40px rgba(0,0,0,0.6)" }}>
          {title}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 40%, rgba(255,248,225,0.6) 50%, transparent 60%)", transform: `translateX(${sweepX}%)`, mixBlendMode: "overlay" }} />
        </div>
      </AbsoluteFill>

      {/* SUJETO recortado ENCIMA (tapa parte del texto → profundidad) */}
      <AbsoluteFill style={{ transform: shared }}>
        <Media src={fore} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      <SfxCue at={sec(0.5)} src={SFX.textSlam} volume={0.5} />
    </AbsoluteFill>
  );
};
