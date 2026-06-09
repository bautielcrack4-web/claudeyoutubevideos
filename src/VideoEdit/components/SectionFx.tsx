import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill } from "remotion";
import { sec } from "../theme";

// ── COLOR-GRADE POR SECCIÓN ───────────────────────────────────────────────────
// Un wash de color suave que cambia según el "mood" de cada tramo (cálido/dorado en
// el fuego, frío/eucalipto en las casas frías, sepia nostálgico en el cierre). Suma
// un LUT-feel sin tocar los componentes. Se cruza-fundea entre rangos.
export type GradeRange = { from: number; to: number; tint: string; strength: number; blend?: "soft-light" | "overlay" | "multiply" };

export const SectionGrade: React.FC<{ ranges: GradeRange[] }> = ({ ranges }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // rango activo + fundido en los bordes
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {ranges.map((r, i) => {
        const fade = 1.2; // s de cruce
        const op = interpolate(
          t,
          [r.from - fade, r.from, r.to - fade, r.to],
          [0, r.strength, r.strength, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        if (op <= 0.001) return null;
        return (
          <AbsoluteFill key={i} style={{ background: r.tint, opacity: op, mixBlendMode: r.blend ?? "soft-light" }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── SECTION STINGER (whip + light-leak) ───────────────────────────────────────
// Un barrido de luz cálida diagonal + bump de exposición de ~0.5s para los cambios
// de sección (en vez de corte seco). Encaja con la marca vintage (quemado de película).
export const SectionStinger: React.FC<{ durationInFrames?: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const dur = durationInFrames ?? sec(0.6);
  const p = interpolate(frame, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  if (p >= 1) return null;
  // banda de luz que cruza en diagonal
  const sweepX = interpolate(p, [0, 1], [-width * 0.6, width * 1.2]);
  const flash = interpolate(p, [0, 0.25, 1], [0, 0.5, 0]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {/* bump de exposición cálido */}
      <AbsoluteFill style={{ background: "rgba(255,225,170,1)", opacity: flash * 0.5, mixBlendMode: "screen" }} />
      {/* light-leak diagonal */}
      <div
        style={{
          position: "absolute",
          top: -height * 0.3,
          left: sweepX,
          width: width * 0.5,
          height: height * 1.6,
          transform: "rotate(14deg)",
          background: "linear-gradient(90deg, rgba(255,200,140,0) 0%, rgba(255,210,150,0.85) 45%, rgba(255,235,190,0.95) 55%, rgba(255,200,140,0) 100%)",
          filter: "blur(28px)",
          mixBlendMode: "screen",
          opacity: interpolate(p, [0, 0.15, 0.85, 1], [0, 1, 1, 0]),
        }}
      />
    </AbsoluteFill>
  );
};
