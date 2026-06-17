import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, MONO, acc } from "../overlays/ui";

// LoupeInspect — una LUPA se desliza sobre una imagen real y amplía un detalle. Sensación
// de "examinar la evidencia". focusX/focusY normalizados 0..1; zoom = aumento.
export const LoupeInspect: React.FC<{
  durationInFrames: number;
  image: string;
  focusX: number;
  focusY: number;
  zoom?: number;
  label?: string;
  accent?: string;
}> = ({ durationInFrames, image, focusX, focusY, zoom = 2.4, label, accent }) => {
  const a = acc(accent || "cyan");
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = interpolate(f, [0, fps * 0.5, durationInFrames - fps * 0.5, durationInFrames], [0, 1, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // la lupa entra desde una esquina hasta el foco
  const t = interpolate(f, [fps * 0.3, fps * 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cx = interpolate(t, [0, 1], [0.2, focusX]);
  const cy = interpolate(t, [0, 1], [0.78, focusY]);
  const D = 360; // diámetro de la lupa en px (a 1080)
  return (
    <AbsoluteFill style={{ background: "#06080c", opacity: op }}>
      <AbsoluteFill style={{ transform: "scale(1.05)" }}>
        <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6) saturate(0.9)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(4,7,11,0.28)" }} />
      {/* lente: misma imagen ampliada, recortada al círculo */}
      <div style={{ position: "absolute", left: `calc(${cx * 100}% - ${D / 2}px)`, top: `calc(${cy * 100}% - ${D / 2}px)`, width: D, height: D, borderRadius: "50%", overflow: "hidden", border: `2px solid ${a}`, boxShadow: `0 0 0 6px rgba(0,0,0,0.35), 0 18px 40px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.4)` }}>
        <Img src={staticFile(image)} style={{ position: "absolute", width: `${zoom * 100}%`, height: `${zoom * 100}%`, left: `${-(cx * zoom * 100 - 50)}%`, top: `${-(cy * zoom * 100 - 50)}%`, objectFit: "cover", filter: "contrast(1.08) saturate(1.05)" }} />
        {/* retícula */}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: `${a}55` }} />
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: `${a}55` }} />
      </div>
      <div style={{ position: "absolute", left: 84, bottom: 92 }}>
        <div style={{ fontFamily: MONO, color: a, fontSize: 14, fontWeight: 700, letterSpacing: 4, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>ANÁLISIS</div>
        {label && <div style={{ fontFamily: SANS, color: "#fff", fontSize: 34, fontWeight: 800, marginTop: 6, maxWidth: 820, textShadow: "0 3px 16px rgba(0,0,0,0.85)" }}>{label}</div>}
      </div>
    </AbsoluteFill>
  );
};
