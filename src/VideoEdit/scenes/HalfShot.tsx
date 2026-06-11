import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import { Media } from "../components/Media";

// HalfShot — split 50/50 estilo Elias Yoder: la imagen/clip llena UNA MITAD de la
// pantalla (por defecto la DERECHA) y la otra mitad queda libre para el avatar
// (el Main pone `AvatarLayer` en modo `halfL`/`halfR`). Borde recto, pegado (flush),
// con una división sutil (sombra en el canto interior). Ken-Burns suave, sin
// animación de entrada brusca (corte limpio). Acepta img o vid.
export const HalfShot: React.FC<{
  durationInFrames: number;
  src: string; // "img/x.png" | "vid/x.mp4"
  side?: "right" | "left"; // de qué lado va la IMAGEN (default derecha → avatar izq)
  kicker?: string;
  hue?: "blue" | "cold" | "amber" | "red";
}> = ({ durationInFrames, src, side = "right", kicker, hue = "amber" }) => {
  const frame = useCurrentFrame();
  const acc = hue === "red" ? COLORS.danger : hue === "cold" ? COLORS.cold : hue === "blue" ? COLORS.accent : COLORS.amber;

  const left = side === "right" ? "50%" : "0%";
  // Ken-Burns interno suave (sin reveal de entrada)
  const kb = interpolate(frame, [0, durationInFrames], [1.05, 1.12]);
  const driftX = interpolate(frame, [0, durationInFrames], [side === "right" ? -10 : 10, 0]);

  return (
    <AbsoluteFill>
      {/* la imagen en su mitad */}
      <div style={{ position: "absolute", left, top: 0, width: "50%", height: "100%", overflow: "hidden" }}>
        <Media
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb}) translateX(${driftX}px)` }}
        />
        {/* viñeta sutil para profundidad */}
        <AbsoluteFill style={{ background: "radial-gradient(75% 80% at 50% 45%, transparent 60%, rgba(42,38,32,0.28) 100%)" }} />
        {/* canto interior hacia el avatar: sombra suave + hairline de acento */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            [side === "right" ? "left" : "right"]: 0,
            width: 26,
            background:
              side === "right"
                ? "linear-gradient(90deg, rgba(42,38,32,0.34), transparent)"
                : "linear-gradient(270deg, rgba(42,38,32,0.34), transparent)",
          }}
        />
        <div style={{ position: "absolute", top: 0, bottom: 0, [side === "right" ? "left" : "right"]: 0, width: 3, background: acc, opacity: 0.5 }} />
        {kicker && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 44,
              textAlign: "center",
              fontFamily: FONT_STACK,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 1,
              color: COLORS.bg0,
              textShadow: "0 2px 18px rgba(0,0,0,0.85)",
              padding: "0 40px",
            }}
          >
            {kicker}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
