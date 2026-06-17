// ui.tsx — cimiento compartido de la CAPA DOCUMENTAL (overlays sobre los clips).
// Tipografía, paleta de acentos, animación de entrada/salida y panel translúcido,
// para que los 7 overlays se vean coherentes, suaves y profesionales.
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_STACK } from "../theme";

export const SANS = FONT_STACK;
export const MONO = "'SFMono-Regular', ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace";

// acentos por sección: cyan/ice = submarino/frío · amber = antiguo · red = alarma
export const ACCENTS: Record<string, string> = {
  cyan: "#6fe0ff", ice: "#bfe6ff", amber: "#f3b765", red: "#ff6f6f", green: "#5fd6a4",
};
export const acc = (a?: string) => ACCENTS[a || "cyan"] || a || ACCENTS.cyan;

// aparece (fade+slide) · sostiene · se va. slide<0 = entra desde arriba.
export const useTagReveal = (durationInFrames: number, slide = 14) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inEnd = Math.round(fps * 0.45);
  const outStart = Math.max(inEnd + 1, durationInFrames - Math.round(fps * 0.5));
  const op = interpolate(f, [0, inEnd, outStart, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(f, [0, inEnd], [slide, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { op, y, f, fps };
};

// panel de cristal oscuro con barra de acento a la izquierda (look iOS glass sobrio)
export const panel = (a: string): React.CSSProperties => ({
  background: "rgba(8,13,20,0.50)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderLeft: `3px solid ${a}`,
  borderRadius: 10,
  boxShadow: "0 12px 34px rgba(0,0,0,0.45)",
});

export { interpolate, useCurrentFrame, useVideoConfig };
