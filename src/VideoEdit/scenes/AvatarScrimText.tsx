import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { COLORS, FONT_STACK } from "../theme";

type AccentKey = "accent" | "amber" | "good" | "cold" | "danger";

// ── AvatarScrimText ──────────────────────────────────────────────────────────
// Texto del HOOK / re-hook que va ENCIMA del avatar VIVO: oscurece la imagen del
// presentador (scrim radial) y pone el texto arriba, en vez de cortar a un color
// sólido o a una foto estática. Mucho más profesional: el avatar sigue hablando
// detrás, atenuado, y el texto resalta con scrim + sombra (siempre legible).
// Se renderiza DESPUÉS del <AvatarLayer> (full) en el Main.
export const AvatarScrimText: React.FC<{
  durationInFrames: number;
  setup?: string;       // línea chica arriba (serif itálica, crema)
  impact: string;       // línea grande (acento)
  impactAccent?: AccentKey;
  fontSize?: number;
  accentColor?: string; // override directo del color de acento (ej. teal clínico)
  font?: string;        // override de la tipografía (ej. Inter para el look médico)
}> = ({ durationInFrames, setup, impact, impactAccent = "amber", fontSize = 150, accentColor, font }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = accentColor ?? COLORS[impactAccent];
  const FONT = font ?? FONT_STACK;
  // fade in/out suave del scrim+texto (sin animar la imagen del avatar)
  const inP = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const outP = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const op = Math.min(inP, outP);
  // el texto grande aterriza (blur→nítido + leve subida), el scrim solo aparece
  const land = spring({ frame: frame - 4, fps, config: { damping: 200, mass: 0.7 } });
  const blur = interpolate(land, [0, 1], [10, 0]);
  const ty = interpolate(land, [0, 1], [26, 0]);
  const underline = interpolate(frame, [16, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      {/* SCRIM: oscurece al avatar (más oscuro en el centro para el texto) */}
      <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 56%, rgba(20,16,10,0.74) 0%, rgba(20,16,10,0.6) 45%, rgba(20,16,10,0.5) 100%)` }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: "0 12%" }}>
        {setup && (
          <div style={{ fontFamily: FONT, fontStyle: "italic", fontSize: 46, color: "rgba(255,247,232,0.92)", textAlign: "center", textShadow: "0 2px 18px rgba(0,0,0,0.8)" }}>
            {setup}
          </div>
        )}
        <div style={{ position: "relative", transform: `translateY(${ty}px)`, filter: `blur(${blur}px)` }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize, lineHeight: 1.02, color: accent, textAlign: "center", textShadow: "0 4px 30px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.6)" }}>
            {impact}
          </div>
          {/* subrayado que se dibuja */}
          <div style={{ height: 7, marginTop: 10, marginLeft: "14%", marginRight: "14%", background: accent, borderRadius: 6, transform: `scaleX(${underline})`, transformOrigin: "left center", boxShadow: `0 0 18px ${accent}99` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
