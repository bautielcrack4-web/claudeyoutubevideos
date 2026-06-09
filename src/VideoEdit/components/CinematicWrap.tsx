import { useCurrentFrame, AbsoluteFill } from "remotion";

// ── CINEMATIC WRAP (modo rápido) ──────────────────────────────────────────────
// Capa de "grado" que envuelve TODO el video y lo hace ver filmado, no renderizado.
// SOLO lo perceptible-y-barato (decisión del usuario jun 2026: sacar lo que cuesta
// render y es imperceptible):
//  · micro-handheld SIEMPRE activo (transform, barato; lo que más "vende" el filmado)
//  · viñeta fílmica (gradiente, barato; enfoca la atención)
//  · grano de película (textura estática tileada, barato; única textura perceptible)
// QUITADO por caro+imperceptible: motas de polvo con blur (22 capas blureadas/frame)
// y halación cálida (pasada mixBlendMode extra). ~25-30% menos de tiempo de render,
// sin pérdida visible. Envolvé el contenido del Main con esto.

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export const CinematicWrap: React.FC<{ children: React.ReactNode; handheld?: number; grain?: number }> = ({
  children,
  handheld = 0.8,
  grain = 0.06,
}) => {
  const frame = useCurrentFrame();

  // handheld orgánico: suma de senoidales incomensurables (no se repite, no es robótico)
  const dx = (Math.sin(frame / 37) * 1.1 + Math.sin(frame / 13.3) * 0.5 + Math.sin(frame / 5.7) * 0.2) * handheld;
  const dy = (Math.cos(frame / 41) * 1.0 + Math.cos(frame / 11.7) * 0.45 + Math.sin(frame / 6.3) * 0.2) * handheld;
  const rot = Math.sin(frame / 97) * 0.05 * handheld;
  const breathe = 1.014 + Math.sin(frame / 130) * 0.004; // leve respiración + margen para que el handheld no muestre bordes

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0b0907" }}>
      {/* CONTENIDO con vida de cámara */}
      <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${breathe})`, willChange: "transform" }}>
        {children}
      </AbsoluteFill>

      {/* viñeta filmica */}
      <AbsoluteFill style={{ background: "radial-gradient(125% 105% at 50% 48%, rgba(0,0,0,0) 56%, rgba(8,6,4,0.42) 100%)", pointerEvents: "none" }} />

      {/* grano animado (jitter de posición = grano que se mueve, barato) */}
      <AbsoluteFill
        style={{
          backgroundImage: NOISE,
          backgroundSize: "180px 180px",
          backgroundPosition: `${(frame * 17) % 180}px ${(frame * 29) % 180}px`,
          opacity: grain,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
