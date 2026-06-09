import { Fragment } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, SPRING_SNAPPY, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { Media } from "../components/Media";
import { SfxCue, SFX } from "../components/Sfx";

// PROCESS / how-to timeline — ahora VIVO: camino CURVO FLOTANTE (pseudo-3D) con
// nodos que son IMÁGENES reales flotantes (zoom al aparecer), y una FOLLOW-CAM que
// pana + hace zoom hacia el nodo que se está revelando en tiempo real, y al final
// se aleja para mostrar todo el recorrido. Si un Step trae `image`, el nodo es una
// tarjeta-foto flotante; si no, un círculo numerado.
export type Step = { title: string; desc?: string; image?: string };

const TONES = {
  accent: COLORS.accent,
  amber: COLORS.amber,
  good: COLORS.good,
  cold: COLORS.cold,
  danger: COLORS.danger,
} as const;

const BOX_W = 1560;
const BOX_H = 820;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeIO = Easing.inOut(Easing.cubic);

// Catmull-Rom → bezier para un camino suave que pasa por todos los puntos
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export const ProcessSteps: React.FC<{
  durationInFrames: number;
  steps: Step[];
  eyebrow?: string;
  title?: string;
  orientation?: "horizontal" | "vertical";
  accent?: keyof typeof TONES;
  hue?: "blue" | "cold" | "amber" | "red";
  startAt?: number;
  stagger?: number;
}> = ({
  durationInFrames,
  steps,
  eyebrow,
  title,
  orientation = "horizontal",
  accent = "accent",
  hue = "cold",
  startAt = sec(0.7),
  stagger = sec(1.9),
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = TONES[accent];
  const head = spring({ frame, fps, config: SPRING_SOFT });
  const n = steps.length;
  const vertical = orientation === "vertical";

  const topPad = title || eyebrow ? 210 : 90;

  // ── posiciones base de los nodos (camino flotante, ondulado) ───────────────
  const pts: { x: number; y: number }[] = [];
  if (vertical) {
    const railX = BOX_W * 0.30;
    const top = topPad + 40;
    const gap = (BOX_H - 90 - top) / Math.max(1, n - 1 || 1);
    for (let i = 0; i < n; i++) pts.push({ x: railX + Math.sin(i * 1.1) * 70, y: top + gap * i });
  } else {
    const padX = 250;
    const midY = topPad + (BOX_H - topPad) * 0.42;
    for (let i = 0; i < n; i++) {
      const x = padX + (i * (BOX_W - padX * 2)) / Math.max(1, n - 1);
      const y = midY + Math.sin(i * 1.6 + 0.5) * 90; // ondulación → flotante
      pts.push({ x, y });
    }
  }

  // ── tiempos de revelado + dibujo del camino ────────────────────────────────
  const reveals = steps.map((_, i) => startAt + i * stagger);
  const lastAt = reveals[n - 1] ?? startAt;
  const lineDraw = interpolate(frame, [startAt, lastAt + sec(0.5)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── FOLLOW-CAM cinematográfica: al APARECER cada nodo hace un GRAN zoom limpio
  // y lo SOSTIENE; después la cámara VIAJA siguiendo la línea hasta el siguiente
  // (con un leve pull-back para ver el camino) y vuelve a hacer zoom. Al final se
  // aleja para mostrar todo. ───────────────────────────────────────────────────
  const CXC = BOX_W / 2;
  const CYC = BOX_H / 2 + 30;
  let active = 0;
  for (let k = 0; k < n; k++) if (frame >= reveals[k]) active = k;
  const endStart = lastAt + sec(1.3);
  const endEnd = lastAt + sec(2.6);
  const HOLD = sec(0.85); // cuánto sostiene el zoom sobre el nodo recién llegado
  const Z_PUNCH = 1.46; // gran zoom al aterrizar
  const Z_HOLD = 1.24; // zoom sostenido
  const Z_TRAVEL = 1.08; // pull-back mientras viaja por la línea

  let fx: number, fy: number, z: number, camBlur = 0;
  const la = frame - reveals[active]; // tiempo local desde que llegó el nodo activo
  const wide = frame >= endStart; // plano abierto final → todo nítido
  if (frame < reveals[0]) {
    fx = CXC; fy = CYC; z = 1.04;
  } else if (wide) {
    const e = easeIO(interpolate(frame, [endStart, endEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    fx = lerp(pts[active].x, CXC, e); fy = lerp(pts[active].y, CYC, e); z = lerp(Z_HOLD, 1.0, e);
  } else if (la < HOLD || active === n - 1) {
    // ATERRIZAJE: la cámara EMPUJA hacia adentro a la vez que la imagen aparece
    // (zoom y aparición coinciden), llega al gran zoom y luego decae a sostenido.
    fx = pts[active].x; fy = pts[active].y;
    z = interpolate(la, [0, sec(0.3), sec(0.62), HOLD], [Z_TRAVEL, Z_PUNCH, Z_HOLD, Z_HOLD], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  } else {
    // VIAJE por la línea hacia el siguiente nodo, con pull-back + MOTION BLUR
    const tp = easeIO(interpolate(frame, [reveals[active] + HOLD, reveals[active + 1]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    fx = lerp(pts[active].x, pts[active + 1].x, tp);
    fy = lerp(pts[active].y, pts[active + 1].y, tp);
    z = lerp(Z_HOLD, Z_TRAVEL, Math.sin(tp * Math.PI)); // baja a la mitad del viaje y sube al llegar
    camBlur = Math.sin(tp * Math.PI) * 5; // se desenfoca al pasar rápido entre nodos
  }
  const camTransform = `scale(${z}) translate(${CXC - fx}px, ${CYC - fy}px)`;

  const pathD = smoothPath(pts);

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={44} drift={0.4}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={Math.max(0, startAt - sec(0.3))} src={SFX.transition} volume={0.4} />

        {/* título FIJO (fuera de la follow-cam) */}
        {(eyebrow || title) && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", zIndex: 5, opacity: head, transform: `translateY(${(1 - head) * -12}px)` }}>
            {eyebrow && <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 700, textTransform: "uppercase", color: COLORS.textDim }}>{eyebrow}</div>}
            {title && <div style={{ fontSize: 50, fontWeight: 800, color: COLORS.text, marginTop: 8 }}>{title}</div>}
          </div>
        )}

        {/* DIAGRAMA bajo la follow-cam */}
        <div style={{ position: "absolute", inset: 0, transformOrigin: "center center", transform: camTransform, perspective: 1400, filter: camBlur > 0.2 ? `blur(${camBlur}px)` : undefined }}>
          <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0 }}>
            {/* camino base tenue + camino acentuado que se dibuja */}
            <path d={pathD} fill="none" stroke="rgba(42,38,32,0.12)" strokeWidth={5} strokeLinecap="round" />
            <path
              d={pathD}
              fill="none"
              stroke={C}
              strokeWidth={5}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - lineDraw}
              style={{ filter: `drop-shadow(0 0 9px ${C}88)` }}
            />
          </svg>

          {steps.map((st, i) => {
            const t0 = reveals[i];
            const s = spring({ frame: frame - t0, fps, config: SPRING_SNAPPY });
            // opacidad rápida e independiente del spring → visible cuando llega el zoom
            const appear = interpolate(frame - t0, [sec(0.04), sec(0.34)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const floatY = Math.sin(frame / 28 + i * 1.7) * 9;
            const floatX = Math.cos(frame / 34 + i) * 5;
            const tilt = Math.sin(frame / 46 + i) * 5; // rotateY sutil → 3D
            const popScale = interpolate(s, [0, 1], [0.4, 1]);
            const isActive = i === active && frame < endStart;
            const emphasis = isActive ? 1.06 : 1;
            const p = pts[i];
            // DEPTH OF FIELD: el nodo activo nítido; los demás con blur + desaturados
            // (foco selectivo de lente real). En el plano abierto final, todo nítido.
            const focused = isActive || wide;
            const dofBlur = focused ? 0 : 4.5;
            const dofSat = focused ? 1 : 0.66;
            const dofDim = focused ? 1 : 0.82;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: p.x + floatX,
                  top: p.y + floatY,
                  transform: `translate(-50%, -50%) scale(${popScale * emphasis})`,
                  opacity: appear * dofDim,
                  filter: `blur(${dofBlur}px) saturate(${dofSat})`,
                  transformStyle: "preserve-3d",
                  willChange: "transform, filter",
                }}
              >
                {st.image ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `rotateY(${tilt}deg)`, transformStyle: "preserve-3d" }}>
                    <div
                      style={{
                        position: "relative",
                        width: 240,
                        height: 168,
                        borderRadius: 20,
                        overflow: "hidden",
                        border: `3px solid ${C}`,
                        boxShadow: `0 26px 60px rgba(0,0,0,0.5), 0 0 ${14 + (isActive ? 18 : 0)}px ${C}66`,
                        background: COLORS.bg2,
                      }}
                    >
                      <Media src={st.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 -40px 50px rgba(0,0,0,0.35)" }} />
                      {/* badge numerado */}
                      <div
                        style={{
                          position: "absolute",
                          top: -14,
                          left: -14,
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          background: COLORS.bg0,
                          border: `3px solid ${C}`,
                          color: C,
                          fontSize: 26,
                          fontWeight: 900,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: `0 6px 16px rgba(0,0,0,0.4)`,
                        }}
                      >
                        {i + 1}
                      </div>
                    </div>
                    <div style={{ marginTop: 16, fontSize: 34, fontWeight: 800, color: COLORS.text, textAlign: "center" }}>{st.title}</div>
                    {st.desc && <div style={{ marginTop: 4, fontSize: 22, fontWeight: 600, color: COLORS.textSoft, textAlign: "center", maxWidth: 280 }}>{st.desc}</div>}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: 74,
                        height: 74,
                        borderRadius: 40,
                        background: COLORS.bg1,
                        border: `4px solid ${C}`,
                        color: C,
                        fontSize: 34,
                        fontWeight: 900,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 0 ${12 + (isActive ? 18 : 0)}px ${C}66`,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ marginTop: 14, fontSize: 32, fontWeight: 800, color: COLORS.text, textAlign: "center" }}>{st.title}</div>
                    {st.desc && <div style={{ marginTop: 4, fontSize: 21, fontWeight: 600, color: COLORS.textSoft, textAlign: "center", maxWidth: 320 }}>{st.desc}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {steps.map((_, i) => (
          <Fragment key={"sfx" + i}>
            {/* aproximación de cámara → GRAN zoom + aterrizaje del nodo (madera) */}
            <SfxCue at={reveals[i] - sec(0.32)} src={SFX.camTravel} volume={0.4} durationInFrames={sec(0.5)} />
            <SfxCue at={reveals[i]} src={SFX.camZoomPunch} volume={0.5} durationInFrames={sec(1.2)} />
            <SfxCue at={reveals[i]} src={SFX.nodeLand} volume={0.5} durationInFrames={sec(0.9)} />
            <SfxCue at={reveals[i] + sec(0.06)} src={SFX.nodePop} volume={0.3} />
            {/* la LÍNEA que se traza hacia el siguiente nodo, con su sonido propio */}
            {i < n - 1 && <SfxCue at={reveals[i] + Math.round(HOLD)} src={SFX.lineDraw} volume={0.42} durationInFrames={Math.max(sec(0.3), Math.round(stagger - HOLD))} />}
            {i > 0 && <SfxCue at={reveals[i]} src={SFX.lineArrive} volume={0.4} />}
          </Fragment>
        ))}
      </div>
    </SceneFrame>
  );
};
