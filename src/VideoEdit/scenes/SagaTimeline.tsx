import { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";

// SagaTimeline — componente FULL-SCREEN animado: una línea de tiempo horizontal por la que
// VIAJA la cámara parando en cada hito (año + título + miniatura), con un playhead que avanza.
// Brand-native (crema/tinta/salvia). Para la cronología del documental.
export const SagaTimeline: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  events: { year: string; label: string; image?: string; accent?: "amber" | "danger" | "accent" | "cold" }[];
}> = ({ durationInFrames, eyebrow, title, events }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = events.length;
  const head = spring({ frame, fps, config: { damping: 20, stiffness: 90 } });

  // progreso global 0→1 a lo largo de la duración (deja aire al inicio y final)
  const prog = interpolate(frame, [sec(0.8), durationInFrames - sec(0.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // índice "activo" (el hito al que llegó el playhead)
  const fpos = prog * (n - 1);
  const active = Math.round(fpos);

  // la cámara viaja: traslada el lienzo para centrar el hito activo
  const GAP = 560; // px entre hitos
  const camX = -fpos * GAP;

  const colOf = (a?: string) => (a ? (COLORS as Record<string, string>)[a] : undefined) || COLORS.amber;

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="amber" glowY={40} drift={0.2}>
      <SfxCue at={sec(0.5)} src={SFX.transition} volume={0.32} />
      <div style={{ position: "absolute", inset: 0, fontFamily: FONT_STACK, overflow: "hidden" }}>
        {(eyebrow || title) && (
          <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", opacity: head, zIndex: 5 }}>
            {eyebrow && <div style={{ fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: COLORS.amber, marginBottom: 4 }}>{eyebrow}</div>}
            {title && <div style={{ fontSize: 48, fontWeight: 700, color: COLORS.ink || COLORS.text }}>{title}</div>}
          </div>
        )}
        {/* lienzo que viaja */}
        <div style={{ position: "absolute", top: "54%", left: "50%", transform: `translate(${camX}px, -50%)`, width: 0, height: 0 }}>
          {/* línea base */}
          <div style={{ position: "absolute", top: 0, left: -GAP, width: GAP * (n + 1), height: 4, background: `${COLORS.text}33`, transform: "translateY(-2px)" }} />
          {/* línea recorrida (se traza con el playhead) */}
          <div style={{ position: "absolute", top: 0, left: 0, width: Math.max(0, fpos * GAP), height: 4, background: COLORS.amber, transform: "translateY(-2px)", boxShadow: `0 0 12px ${COLORS.amber}` }} />
          {events.map((e, i) => {
            const appear = interpolate(fpos, [i - 0.9, i - 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const isOn = i === active;
            const pop = isOn ? interpolate(Math.abs(fpos - i), [0, 0.5], [1, 0.86], { extrapolateRight: "clamp" }) : 0.82;
            const col = colOf(e.accent);
            const up = i % 2 === 0;
            return (
              <div key={i} style={{ position: "absolute", left: i * GAP, top: 0 }}>
                {/* nodo */}
                <div style={{ position: "absolute", left: -13, top: -13, width: 26, height: 26, borderRadius: "50%", background: isOn ? col : COLORS.bg1, border: `3px solid ${col}`, opacity: appear, transform: `scale(${appear * (isOn ? 1.25 : 1)})`, boxShadow: isOn ? `0 0 18px ${col}` : "none" }} />
                {/* tarjeta del hito (arriba/abajo alternado) */}
                <div style={{ position: "absolute", left: -200, top: up ? -250 : 40, width: 400, opacity: appear * pop, transform: `translateY(${(1 - appear) * (up ? -16 : 16)}px) scale(${0.92 + appear * 0.08})`, transformOrigin: "center" }}>
                  {e.image && (
                    <div style={{ width: "100%", height: 168, borderRadius: 12, overflow: "hidden", border: `2px solid ${col}55`, boxShadow: "0 12px 30px rgba(0,0,0,0.25)", marginBottom: up ? 0 : 10, order: up ? 2 : 0 }}>
                      <Img src={e.image.startsWith("http") ? e.image : staticFile(e.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ textAlign: "center", marginTop: up && e.image ? 8 : 0 }}>
                    <div style={{ fontSize: 46, fontWeight: 800, color: col, lineHeight: 1, textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>{e.year}</div>
                    <div style={{ fontSize: 23, color: COLORS.text, opacity: 0.92, marginTop: 2 }}>{e.label}</div>
                  </div>
                </div>
                {/* conector nodo↔tarjeta */}
                <div style={{ position: "absolute", left: -1, top: up ? -40 : 13, width: 2, height: 27, background: `${col}88`, opacity: appear }} />
              </div>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};
