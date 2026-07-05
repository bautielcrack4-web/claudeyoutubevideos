import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { Theme } from "../kit/premium/theme";

// ── PREMIUM OVERLAY — encaja cualquier componente del kit premium (que internamente
// es un AbsoluteFill/Stage a pantalla completa) dentro de una TARJETA en la ZONA
// SEGURA del frame, dejando el b-roll visible alrededor y el avatar PiP abajo-derecha
// libre. El kit premium fue diseñado full-bleed (inset:60) → acá lo escalamos con
// CSS `transform: scale()` dentro de un contenedor recortado del tamaño de destino,
// así el componente se ve GRANDE y legible pero no tapa el resto del frame.
// `zone`:
//   · "topLeft"  (default) — cuadrante superior-izquierdo grande, deja abajo-derecha
//     libre para el avatar cornerBR y se ve b-roll en los bordes.
//   · "left"     — franja izquierda alta (2/3 ancho), para diagramas anchos.
//   · "top"      — franja superior ancha, para comparaciones/listas horizontales.
//   · "full"     — casi toda la pantalla (para el HOOK inicial / CTA final, sin avatar
//     compitiendo esos instantes).
const ZONES: Record<string, { left: number; top: number; w: number; h: number }> = {
  topLeft: { left: 48, top: 48, w: 1330, h: 760 },
  left: { left: 48, top: 48, w: 1260, h: 984 },
  top: { left: 48, top: 48, w: 1824, h: 660 },
  full: { left: 24, top: 24, w: 1872, h: 1032 },
};

// tamaño "de diseño" de los componentes premium (piensan en 1920x1080 full-bleed)
const DESIGN_W = 1920, DESIGN_H = 1080;

export const PremiumOverlay: React.FC<{
  durationInFrames: number;
  zone?: keyof typeof ZONES;
  theme?: Theme;
  children: React.ReactNode;
}> = ({ durationInFrames, zone = "topLeft", theme, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const z = ZONES[zone] || ZONES.topLeft;
  const scale = Math.min(z.w / DESIGN_W, z.h / DESIGN_H);
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.8, stiffness: 130 } });
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op = Math.min(enter * 1.15, 1) * out;
  const slide = (1 - enter) * -26;
  const bg = theme?.color.surface || "rgba(245,238,220,0.92)";
  const line = theme?.color.line || "rgba(42,38,32,0.16)";
  const shadow = theme?.color.shadow || "rgba(42,38,32,0.2)";
  const radius = theme?.radius ?? 26;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: z.left,
          top: z.top,
          width: z.w,
          height: z.h,
          opacity: op,
          transform: `translateY(${slide}px)`,
          borderRadius: radius + 10,
          overflow: "hidden",
          background: bg,
          border: `1.5px solid ${line}`,
          boxShadow: `0 30px 70px ${shadow}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: (z.w - DESIGN_W * scale) / 2,
            top: (z.h - DESIGN_H * scale) / 2,
            width: DESIGN_W,
            height: DESIGN_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};
