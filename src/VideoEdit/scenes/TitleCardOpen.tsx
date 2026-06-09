import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { Media } from "../components/Media";
import { SfxCue, SFX } from "../components/Sfx";
import { LightRays } from "../components/LightRays";

// ── TITLE-CARD OPEN ───────────────────────────────────────────────────────────
// Apertura cinematográfica: la estufa en penumbra, un resplandor cálido CRECE
// desde su boca (el fuego prendiéndose), suben brasas, y el TÍTULO se revela con
// peso. Va sobre la primera línea de narración (no corta el audio). Hand-off limpio.
export const TitleCardOpen: React.FC<{
  durationInFrames: number;
  image: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  glowAt?: [number, number]; // posición del resplandor (0..1) sobre la imagen
}> = ({ durationInFrames, image, kicker = "Oficio que no se enseña", title, subtitle, glowAt = [0.5, 0.62] }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Ken Burns lento + el fuego (glow) que crece
  const kb = interpolate(frame, [0, durationInFrames], [1.08, 1.16], { extrapolateRight: "clamp" });
  const glow = interpolate(frame, [sec(0.3), sec(2.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const flick = 0.85 + 0.15 * Math.sin(frame / 5) * Math.sin(frame / 11);

  // título
  const tStart = sec(1.4);
  const tIn = spring({ frame: frame - tStart, fps, config: { damping: 18, mass: 0.8, stiffness: 150 } });
  const titleBlur = interpolate(tIn, [0, 1], [16, 0]);
  const subIn = spring({ frame: frame - tStart - sec(0.4), fps, config: { damping: 22 } });

  // oscurecido global que se abre un poco al prenderse el fuego
  const dark = interpolate(glow, [0, 1], [0.78, 0.58]);
  // salida (fade del texto al final para handoff limpio)
  const exitOp = interpolate(frame, [durationInFrames - sec(0.7), durationInFrames - sec(0.1)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const gx = glowAt[0] * width;
  const gy = glowAt[1] * height;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, background: COLORS.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${kb})` }}>
        <Media src={image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      {/* god-rays entrando por la ventana (arriba-izquierda) */}
      <LightRays x={0.18} y={0.06} count={6} strength={0.7 * glow + 0.25} angle={26} />

      {/* oscurecido + viñeta */}
      <AbsoluteFill style={{ background: `rgba(18,14,10,${dark})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 46%, rgba(0,0,0,0) 38%, rgba(12,9,6,0.7) 100%)" }} />

      {/* RESPLANDOR cálido del fuego que crece desde la boca de la estufa */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(${260 + glow * 220}px ${220 + glow * 180}px at ${gx}px ${gy}px, rgba(255,176,77,${0.55 * glow * flick}), rgba(255,140,60,${0.22 * glow}) 45%, rgba(0,0,0,0) 72%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* brasas subiendo */}
      {glow > 0.2 && Array.from({ length: 16 }).map((_, k) => {
        const sp = (k * 97) % 100 / 100;
        const life = (frame / 30 + sp) % 1;
        const ex = gx + Math.sin(k * 2.1 + frame / 40) * (40 + k * 6);
        const ey = gy - life * (260 + (k % 5) * 40);
        return <div key={k} style={{ position: "absolute", left: ex, top: ey, width: 6, height: 6, borderRadius: 3, background: "#FFC14D", opacity: (1 - life) * 0.8 * glow, boxShadow: "0 0 8px #FF8A3D" }} />;
      })}

      {/* TÍTULO */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: exitOp, padding: "0 120px", textAlign: "center" }}>
        {kicker && (
          <div style={{ fontSize: 30, fontWeight: 700, fontStyle: "italic", color: "rgba(239,231,211,0.82)", letterSpacing: 2, marginBottom: 24, opacity: interpolate(tIn, [0, 1], [0, 1]), textShadow: "0 2px 14px rgba(0,0,0,0.8)" }}>{kicker}</div>
        )}
        <div
          style={{
            fontSize: 118,
            fontWeight: 900,
            lineHeight: 1.04,
            color: "#FFF6E4",
            opacity: interpolate(frame - tStart, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(tIn, [0, 1], [26, 0])}px) scale(${interpolate(tIn, [0, 1], [1.1, 1])})`,
            filter: `blur(${titleBlur}px)`,
            textShadow: `0 3px 0 rgba(0,0,0,0.4), 0 16px 50px rgba(0,0,0,0.7), 0 0 ${30 * glow}px rgba(255,170,80,${0.5 * glow})`,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ marginTop: 26, fontSize: 44, fontWeight: 700, color: "#E9D6A8", opacity: subIn, transform: `translateY(${(1 - subIn) * 16}px)`, textShadow: "0 2px 16px rgba(0,0,0,0.8)" }}>{subtitle}</div>
        )}
      </AbsoluteFill>

      <SfxCue at={sec(0.4)} src={SFX.whoosh2} volume={0.4} />
      <SfxCue at={tStart} src={SFX.transition} volume={0.5} />
    </AbsoluteFill>
  );
};
