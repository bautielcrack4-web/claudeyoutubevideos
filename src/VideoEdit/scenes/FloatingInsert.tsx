import { COLORS, FONT_STACK } from "../theme";
import { Media } from "../components/Media";
import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";

// FloatingInsert — una foto/clip real ENMARCADO que flota al lado del avatar
// (izquierda o derecha) mientras el presentador habla a pantalla completa. Se
// renderiza POR ENCIMA del AvatarLayer (en Main: cues con key "f" van después del
// avatar). Antes de que la imagen aparezca se hace un "zoom al lugar": un anillo de
// foco + resplandor crecen en el punto, y la tarjeta entra escalando desde chico
// (de ese punto) con resorte, sombra y leve flotación. Acepta img o vid.
export const FloatingInsert: React.FC<{
  durationInFrames: number;
  src: string; // "img/x.png" | "vid/x.mp4"
  side?: "left" | "right";
  kicker?: string;
  hue?: "blue" | "cold" | "amber" | "red";
  accent?: string;
}> = ({ durationInFrames, src, side = "right", kicker, hue = "amber", accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const acc = accent || (hue === "red" ? COLORS.danger : hue === "amber" ? COLORS.amber : COLORS.cold);

  const W = 760, H = 428;
  const cx = side === "right" ? 1180 : 740; // centro X de la tarjeta
  const cy = 540;
  const left = cx - W / 2, top = cy - H / 2;

  // ── fase 1: zoom al lugar (anillo + glow) frames 0..16 ──
  const pull = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring = interpolate(frame, [0, 18], [0.2, 1.25], { extrapolateRight: "clamp" });
  const ringOp = interpolate(frame, [2, 14, 22], [0, 0.8, 0], { extrapolateRight: "clamp" });

  // ── fase 2: la tarjeta entra escalando desde el punto (resorte) ──
  const rev = spring({ frame: frame - 9, fps, config: { damping: 16, mass: 0.8, stiffness: 110 } });
  const scaleIn = interpolate(rev, [0, 1], [0.45, 1]);
  const xoff = (1 - rev) * (side === "right" ? 70 : -70);
  const rot = (1 - rev) * (side === "right" ? 3 : -3);
  // salida suave
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const op = Math.min(rev * 1.2, 1) * out;
  // flotación + ken-burns interno
  const bob = Math.sin((frame - 9) / 26) * 6 * rev;
  const kb = interpolate(frame, [0, durationInFrames], [1.06, 1.14]);

  return (
    <AbsoluteFill>
      {/* scrim suave del lado opuesto para destacar la tarjeta (muy leve) */}
      <AbsoluteFill
        style={{
          background:
            side === "right"
              ? `radial-gradient(60% 70% at 62% 50%, rgba(0,0,0,0.28), transparent 70%)`
              : `radial-gradient(60% 70% at 38% 50%, rgba(0,0,0,0.28), transparent 70%)`,
          opacity: pull * 0.9 * out,
        }}
      />
      {/* anillo de foco "zoom al lugar" */}
      <div
        style={{
          position: "absolute",
          left: cx - 130,
          top: cy - 130,
          width: 260,
          height: 260,
          borderRadius: "50%",
          border: `3px solid ${acc}`,
          transform: `scale(${ring})`,
          opacity: ringOp * out,
          boxShadow: `0 0 60px ${acc}55`,
        }}
      />
      {/* la tarjeta enmarcada */}
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: W,
          height: H,
          transform: `translateX(${xoff}px) translateY(${bob}px) scale(${scaleIn}) rotate(${rot}deg)`,
          transformOrigin: "center",
          opacity: op,
          borderRadius: 20,
          padding: 8,
          background: COLORS.bg0,
          boxShadow: `0 40px 90px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.4)`,
          border: `1px solid ${COLORS.bg2}`,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 14, overflow: "hidden" }}>
          <Media
            src={src}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }}
          />
          {/* línea de acento inferior */}
          <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 5, background: acc, opacity: 0.9 }} />
        </div>
        {kicker && (
          <div
            style={{
              position: "absolute",
              left: 8,
              bottom: -44,
              width: W - 16,
              textAlign: side === "right" ? "right" : "left",
              fontFamily: FONT_STACK,
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: COLORS.bg0,
              opacity: op,
              textShadow: "0 2px 18px rgba(0,0,0,0.85)",
            }}
          >
            {kicker}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
