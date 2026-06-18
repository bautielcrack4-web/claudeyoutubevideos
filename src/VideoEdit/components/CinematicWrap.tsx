import { useCurrentFrame, AbsoluteFill } from "remotion";

// ── CINEMATIC WRAP (modo rápido) ──────────────────────────────────────────────
// Capa de "grado" que envuelve TODO el video y lo hace ver filmado, no renderizado.
// SOLO lo perceptible-y-barato (decisión del usuario jun 2026: sacar lo que cuesta
// render y es imperceptible):
//  · viñeta fílmica (gradiente, barato; enfoca la atención) — opt-in
//  · grano de película (textura estática tileada) — opt-in
// QUITADO: motas de polvo con blur y halación cálida (caro+imperceptible).
// ★ HANDHELD (temblor cámara-en-mano) ELIMINADO POR COMPLETO (jun 2026): el usuario
// notó un "temblor" en el avatar — era este jitter de translate/rotate aplicado a TODO
// el frame (avatar incluido). Default handheld=0 y SIN respiración cuando es 0 → el
// avatar y el footage quedan 100% quietos. NO reintroducir handheld en ningún video.

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export const CinematicWrap: React.FC<{ children: React.ReactNode; handheld?: number; grain?: number; vignette?: number }> = ({
  children,
  handheld = 0, // SIN temblor por defecto (el usuario lo notó en el avatar → eliminado)
  grain = 0, // SIN grano por defecto (preferencia del usuario: cero filtros)
  vignette = 0, // SIN viñeta por defecto
}) => {
  const frame = useCurrentFrame();

  // ★ TEMBLOR ELIMINADO POR COMPLETO (jun 2026): el usuario notó un "temblor" en el
  // avatar — era este micro-handheld aplicado a TODO el frame. Se fuerza a 0 en TODOS
  // los videos sin importar el valor pasado (avatar y footage 100% quietos). No reactivar.
  const hh = 0 * handheld;
  const dx = (Math.sin(frame / 37) * 1.1 + Math.sin(frame / 13.3) * 0.5 + Math.sin(frame / 5.7) * 0.2) * hh;
  const dy = (Math.cos(frame / 41) * 1.0 + Math.cos(frame / 11.7) * 0.45 + Math.sin(frame / 6.3) * 0.2) * hh;
  const rot = Math.sin(frame / 97) * 0.05 * hh;
  const breathe = hh > 0.001 ? 1.014 + Math.sin(frame / 130) * 0.004 : 1;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0b0907" }}>
      {/* CONTENIDO con vida de cámara */}
      <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${breathe})`, willChange: "transform" }}>
        {children}
      </AbsoluteFill>

      {/* viñeta filmica (escalable; vignette=0 la desactiva) */}
      {vignette > 0.001 && (
        <AbsoluteFill style={{ background: `radial-gradient(125% 105% at 50% 48%, rgba(0,0,0,0) 56%, rgba(8,6,4,${0.42 * vignette}) 100%)`, pointerEvents: "none" }} />
      )}

      {/* grano animado (jitter de posición). Desactivado si grain=0 */}
      {grain > 0.001 && (
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
      )}
    </AbsoluteFill>
  );
};
