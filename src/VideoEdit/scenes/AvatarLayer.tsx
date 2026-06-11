import { Video } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { COLORS } from "../theme";

// ── AVATAR LAYER ──────────────────────────────────────────────────────────────
// Una ÚNICA instancia del video del presentador (estufa_opt.mp4) que abarca todo
// el timeline: SIEMPRE provee el audio de la narración (aunque esté visualmente
// oculto), y su POSICIÓN se anima según un cronograma de modos para dar variedad:
//   · "full"     → pantalla entera (beats personales / cierre)
//   · "right"    → recuadro grande a la DERECHA (imagen/b-roll a la izquierda)
//   · "left"     → recuadro grande a la IZQUIERDA (imagen a la derecha)
//   · "cornerTR" → recuadro chico redondeado en la esquina superior derecha (PiP)
//   · "hidden"   → fuera de vista (solo se oye), el b-roll manda a pantalla completa
// Las transiciones entre modos hacen fade-in-place + lerp de geometría.

export type AvatarMode =
  | "full" | "right" | "left"
  | "halfL" | "halfR" // split 50/50 flush (avatar media pantalla, imagen la otra mitad)
  | "cornerTR" | "cornerTL" | "cornerBR" | "cornerBL"
  | "hidden";
export type AvatarWindow = { start: number; mode: AvatarMode }; // start en SEGUNDOS

const W = 1920;
const H = 1080;
const TRANS = 16; // frames de transición entre modos

type Geom = { x: number; y: number; w: number; h: number; r: number; op: number; chrome: number };

// PiP de esquina: mismo tamaño en las 4 esquinas (margen 54). Recuadros laterales
// grandes (left/right) = look "split" avatar a un lado + b-roll al otro.
const CW = 384, CH = 512, M = 54;
const G: Record<Exclude<AvatarMode, "hidden">, Geom> = {
  full: { x: 0, y: 0, w: W, h: H, r: 0, op: 1, chrome: 0 },
  right: { x: W - 760 - 70, y: 40, w: 760, h: 1000, r: 30, op: 1, chrome: 1 },
  left: { x: 70, y: 40, w: 760, h: 1000, r: 30, op: 1, chrome: 1 },
  // split 50/50 FLUSH (estilo Elias Yoder): avatar ocupa media pantalla, borde recto,
  // sin chrome → la imagen (HalfShot) llena la otra mitad pegada.
  halfL: { x: 0, y: 0, w: W / 2, h: H, r: 0, op: 1, chrome: 0 },
  halfR: { x: W / 2, y: 0, w: W / 2, h: H, r: 0, op: 1, chrome: 0 },
  cornerTR: { x: W - CW - M, y: M, w: CW, h: CH, r: 32, op: 1, chrome: 1 },
  cornerTL: { x: M, y: M, w: CW, h: CH, r: 32, op: 1, chrome: 1 },
  cornerBR: { x: W - CW - M, y: H - CH - M, w: CW, h: CH, r: 32, op: 1, chrome: 1 },
  cornerBL: { x: M, y: H - CH - M, w: CW, h: CH, r: 32, op: 1, chrome: 1 },
};

const geomOf = (m: AvatarMode): Geom => (m === "hidden" ? G.cornerTR : G[m]);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const AvatarLayer: React.FC<{
  src: string; // staticFile path del video del presentador (con su audio)
  windows: AvatarWindow[]; // ordenadas por start
  accent?: string;
  wav?: string; // wav para el borde audio-reactive; default = derivado del src
}> = ({ src, windows, accent = COLORS.accent, wav }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame; // frames

  // AUDIO-REACTIVE: el borde del recuadro late con la amplitud de la voz.
  // Derivado del src (fly_opt.mp4 → fly.wav) salvo que se pase `wav` explícito.
  const wavSrc = wav ?? src.replace(/_opt\.mp4$/i, ".wav").replace(/\.mp4$/i, ".wav");
  const audio = useAudioData(staticFile(wavSrc));
  let amp = 0;
  if (audio) {
    const bins = visualizeAudio({ fps, frame, audioData: audio, numberOfSamples: 16 });
    amp = Math.min(1, (bins.slice(0, 6).reduce((a, b) => a + b, 0) / 6) * 7);
  }

  // ventana activa
  const starts = windows.map((w) => Math.round(w.start * fps));
  let i = 0;
  for (let k = 0; k < windows.length; k++) if (t >= starts[k]) i = k;
  const curMode = windows[i].mode;
  const prevMode = i > 0 ? windows[i - 1].mode : "hidden";

  // geometrías "from" y "to" para fade-in-place (oculto = misma caja con op 0)
  const toGeom: Geom = curMode === "hidden" ? { ...geomOf(prevMode), op: 0 } : geomOf(curMode);
  const fromGeom: Geom = prevMode === "hidden" ? { ...geomOf(curMode), op: 0 } : geomOf(prevMode);

  const p = interpolate(t - starts[i], [0, TRANS], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const x = lerp(fromGeom.x, toGeom.x, p);
  const y = lerp(fromGeom.y, toGeom.y, p);
  const w = lerp(fromGeom.w, toGeom.w, p);
  const h = lerp(fromGeom.h, toGeom.h, p);
  const r = lerp(fromGeom.r, toGeom.r, p);
  const op = lerp(fromGeom.op, toGeom.op, p);
  const chrome = lerp(fromGeom.chrome, toGeom.chrome, p);

  // float sutil solo cuando NO está full (cuanto más chico, más flota)
  const smallness = 1 - w / W;
  const floatY = Math.sin(frame / 26) * 6 * smallness;
  const floatX = Math.cos(frame / 31) * 4 * smallness;

  // cover-sizing del video 16:9 dentro de la caja (sesgo a la cara)
  const ratio = 16 / 9;
  const kb = 1 + 0.05 * smallness * (0.5 + 0.5 * Math.sin(frame / 90));
  let coverW = Math.max(w, h * ratio) * kb;
  let coverH = coverW / ratio;
  const offX = (w - coverW) / 2;
  const offY = (h - coverH) * (0.28 + 0.04 * smallness); // mostrar la cara

  if (op < 0.001) {
    // invisible: igual hay que renderizar el Video para que SUENE la narración
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: -9999, top: 0, width: 384, height: 512, overflow: "hidden" }}>
          <Video src={staticFile(src)} style={{ width: 683, height: 384 }} />
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: x + floatX,
          top: y + floatY,
          width: w,
          height: h,
          borderRadius: r,
          overflow: "hidden",
          opacity: op,
          // PiP "inset" limpio: sombra suave + hairline crema fino + glow de acento
          // MUY sutil que respira con la voz (sin anillo neón pulsante).
          boxShadow:
            chrome > 0.02
              ? `0 ${26 * chrome}px ${70 * chrome}px rgba(0,0,0,${0.5 * chrome}), 0 0 0 ${1.5 * chrome}px rgba(255,247,232,${0.5 * chrome}), 0 0 ${(8 + amp * 18) * chrome}px ${accent}${Math.round(amp * 70).toString(16).padStart(2, "0")}`
              : "none",
          border: chrome > 0.02 ? `1px solid rgba(42,38,32,${0.22 * chrome})` : "none",
          willChange: "left, top, width, height",
        }}
      >
        <Video
          src={staticFile(src)}
          style={{ position: "absolute", left: offX, top: offY, width: coverW, height: coverH }}
        />
        {/* viñeta interna suave cuando es recuadro */}
        {chrome > 0.02 && (
          <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 -70px 90px rgba(0,0,0,${0.4 * chrome})` }} />
        )}
      </div>
    </AbsoluteFill>
  );
};
