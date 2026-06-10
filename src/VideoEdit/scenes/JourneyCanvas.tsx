import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { Media } from "../components/Media";
import { SfxCue, SFX } from "../components/Sfx";

// ── JOURNEY CANVAS ────────────────────────────────────────────────────────────
// El "continuous-camera journey" (plano-secuencia infográfico) llevado a motor
// reusable y LARGO: la cámara VUELA sin cortes por un lienzo 2.5D parando en cada
// waypoint, con:
//   · PROFUNDIDAD real (cada nodo a distinto z → parallax: cerca/lejos)
//   · RACK-FOCUS automático (lo que está al centro, nítido; el resto, blur)
//   · CHISPA que guía el ojo viajando por la línea ADELANTE de la cámara
//   · ANTICIPACIÓN (la cámara "mira" hacia el próximo nodo antes de arrancar)
//   · MUNDO de fondo que se desliza (parallax lento) → se siente explorar algo
//   · DURACIÓN libre: poné muchos waypoints con dwell/travel largos = 15-25s hipnóticos
// Generaliza/upgradea a ProcessSteps. Cada waypoint puede traer foto/clip + label.

export type Waypoint = {
  x: number; y: number; // posición en el MUNDO (coords grandes, ej. 0..5000)
  z?: number; // profundidad 0 (lejos) .. 1 (cerca). default 0.5
  image?: string; // foto/clip dentro de la tarjeta
  label?: string;
  sub?: string;
  num?: string; // badge (ej "1"); si se omite, índice+1
  dwell?: number; // seg que la cámara se queda (default 2.4)
  travel?: number; // seg de viaje DESDE el anterior (default 1.5)
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeIO = Easing.inOut(Easing.cubic);
function smoothPath(p: { x: number; y: number }[]) {
  if (p.length < 2) return "";
  let d = `M ${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
    d += ` C ${b.x + (c.x - a.x) / 6} ${b.y + (c.y - a.y) / 6}, ${c.x - (e.x - b.x) / 6} ${c.y - (e.y - b.y) / 6}, ${c.x} ${c.y}`;
  }
  return d;
}

export const JourneyCanvas: React.FC<{
  durationInFrames: number;
  waypoints: Waypoint[];
  worldImage?: string; // textura/mapa de fondo que se desliza
  eyebrow?: string;
  title?: string;
  accent?: string;
  focusScale?: number; // zoom al posarse (default 1.35)
  travelScale?: number; // zoom durante el viaje (default 0.92)
}> = ({ durationInFrames, waypoints, worldImage, eyebrow, title, accent = COLORS.accent, focusScale = 1.35, travelScale = 0.92 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const CX = width * 0.5, CY = height * 0.54;
  const n = waypoints.length;
  // centro/span del mundo (para un parallax de fondo ACOTADO que nunca muestre bordes)
  const wxs = waypoints.map((w) => w.x), wys = waypoints.map((w) => w.y);
  const wcx = (Math.min(...wxs) + Math.max(...wxs)) / 2;
  const wcy = (Math.min(...wys) + Math.max(...wys)) / 2;
  const wspanX = (Math.max(...wxs) - Math.min(...wxs)) || 1;
  const wspanY = (Math.max(...wys) - Math.min(...wys)) || 1;

  // tiempos de llegada (frames)
  const intro = sec(0.7);
  const arr: number[] = [];
  for (let i = 0; i < n; i++) {
    const dw = sec(waypoints[i - 1]?.dwell ?? 2.4);
    const tv = sec(waypoints[i]?.travel ?? 1.5);
    arr[i] = i === 0 ? intro : arr[i - 1] + dw + tv;
  }
  const lastDwell = sec(waypoints[n - 1]?.dwell ?? 2.4);
  const endStart = arr[n - 1] + lastDwell;
  const endEnd = durationInFrames - sec(0.4);

  // ── cámara: posición mundo + escala, continua a través de los waypoints ──
  let camX: number, camY: number, camS: number;
  if (frame < arr[0]) {
    // entrada: arranca un poco alejada mirando el primer nodo
    const e = easeIO(interpolate(frame, [0, arr[0]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    // entra "wide" (llega a travelScale); el punch-in lo hace el dwell → sin pop al posarse
    camX = waypoints[0].x; camY = waypoints[0].y; camS = lerp(travelScale * 0.85, travelScale, e);
  } else if (frame >= endStart) {
    // salida: pull-back para ver el recorrido entero
    const e = easeIO(interpolate(frame, [endStart, endEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    const midX = waypoints.reduce((a, w) => a + w.x, 0) / n;
    const midY = waypoints.reduce((a, w) => a + w.y, 0) / n;
    const spanX = Math.max(...waypoints.map((w) => w.x)) - Math.min(...waypoints.map((w) => w.x)) || 1;
    const fit = Math.min(0.9, (width * 0.78) / spanX);
    camX = lerp(waypoints[n - 1].x, midX, e); camY = lerp(waypoints[n - 1].y, midY, e); camS = lerp(focusScale, fit, e);
  } else {
    // encontrar fase activa
    let i = 0;
    for (let k = 0; k < n; k++) if (frame >= arr[k]) i = k;
    const dwell = sec(waypoints[i].dwell ?? 2.4);
    const la = frame - arr[i];
    if (la < dwell || i === n - 1) {
      // POSADO en nodo i (con leve push-in + anticipación al final del dwell)
      const look = i < n - 1 ? interpolate(la, [dwell - sec(0.45), dwell], [0, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
      camX = lerp(waypoints[i].x, waypoints[Math.min(n - 1, i + 1)].x, look);
      camY = lerp(waypoints[i].y, waypoints[Math.min(n - 1, i + 1)].y, look);
      camS = interpolate(la, [0, sec(0.4), dwell], [travelScale, focusScale, focusScale * 1.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    } else {
      // VIAJE de i → i+1 — CONTINUO con el dwell (sin saltos):
      // · la posición arranca desde la anticipación del dwell (0.12) y llega a 1.0
      // · el zoom sale de focusScale y baja monótono a travelScale (llega "wide");
      //   el próximo dwell hace el punch-in → ni pop de zoom ni snap de posición.
      const tp = easeIO(interpolate(frame, [arr[i] + dwell, arr[i + 1]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      const prog = lerp(0.12, 1, tp); // 0.12 = el `look` con el que terminó el dwell
      camX = lerp(waypoints[i].x, waypoints[i + 1].x, prog);
      camY = lerp(waypoints[i].y, waypoints[i + 1].y, prog);
      camS = lerp(focusScale, travelScale, tp);
    }
  }

  // mapeo mundo→pantalla con parallax por profundidad
  const df = (z: number) => 0.72 + (z ?? 0.5) * 0.6; // cerca se mueve más
  const map = (w: Waypoint) => {
    const z = w.z ?? 0.5;
    return { sx: CX + (w.x - camX) * camS * df(z), sy: CY + (w.y - camY) * camS * df(z), s: camS * (0.5 + z * 0.85), z };
  };
  const pts = waypoints.map(map);
  const pathD = smoothPath(pts.map((p) => ({ x: p.sx, y: p.sy })));
  // longitud de estela dibujada y posición de la chispa (un poco adelante)
  const reveal = interpolate(frame, [arr[0], endStart], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, background: COLORS.bg1, overflow: "hidden" }}>
      {/* MUNDO de fondo: parallax lento ACOTADO + sobre-escala → SIEMPRE cubre el cuadro */}
      {worldImage && (() => {
        const bgScale = 1.55 + (camS - 1) * 0.12; // sobre-escala: margen para desplazarse sin mostrar bordes
        const margin = (bgScale - 1) / 2; // fracción que puede correrse por lado
        const nx = Math.max(-1, Math.min(1, (camX - wcx) / (wspanX / 2))); // -1..1
        const ny = Math.max(-1, Math.min(1, (camY - wcy) / (wspanY / 2)));
        const bgX = -nx * width * margin * 0.7;
        const bgY = -ny * height * margin * 0.7;
        return (
          <AbsoluteFill style={{ transform: `translate(${bgX}px, ${bgY}px) scale(${bgScale})`, opacity: 0.5 }}>
            <Media src={worldImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        );
      })()}
      <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 50%, rgba(0,0,0,0) 55%, rgba(12,9,6,0.32))" }} />

      {/* PATH + chispa (SVG en coords de pantalla) */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs><filter id="jglow"><feGaussianBlur stdDeviation="5" /></filter></defs>
        <path d={pathD} fill="none" stroke="rgba(42,38,32,0.16)" strokeWidth={6 * camS} strokeLinecap="round" />
        <path d={pathD} fill="none" stroke={accent} strokeWidth={5 * camS} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - reveal} style={{ filter: "url(#jglow)" }} />
        {/* chispa guía sobre la estela */}
        <CometOnPath pts={pts} prog={Math.min(0.999, reveal + 0.04)} color={accent} scale={camS} />
      </svg>

      {/* NODOS (tarjetas-foto con DoF por distancia al centro) */}
      {waypoints.map((w, i) => {
        const m = pts[i];
        const dist = Math.hypot(m.sx - CX, m.sy - CY);
        const blur = Math.min(7, Math.max(0, dist / 230 - 0.4)); // rack-focus
        const dim = interpolate(blur, [0, 6], [1, 0.6]);
        const appear = interpolate(frame - (arr[i] - sec(0.5)), [0, sec(0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const float = Math.sin(frame / 30 + i * 1.7) * 6 * m.z;
        const cardW = 250 * m.s, cardH = 176 * m.s;
        return (
          <div key={i} style={{ position: "absolute", left: m.sx, top: m.sy + float, transform: "translate(-50%,-50%)", opacity: appear * dim, filter: `blur(${blur}px)`, zIndex: Math.round(m.z * 100), pointerEvents: "none" }}>
            {w.image ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ position: "relative", width: cardW, height: cardH, borderRadius: 20 * m.s, overflow: "hidden", border: `${3 * m.s}px solid ${accent}`, boxShadow: `0 ${22 * m.s}px ${50 * m.s}px rgba(0,0,0,0.5)`, background: COLORS.bg2 }}>
                  <Media src={w.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 -40px 50px rgba(0,0,0,0.35)" }} />
                  <div style={{ position: "absolute", top: -14 * m.s, left: -14 * m.s, minWidth: 46 * m.s, height: 46 * m.s, padding: `0 ${13 * m.s}px`, borderRadius: 23 * m.s, background: COLORS.bg0, border: `${3 * m.s}px solid ${accent}`, color: accent, fontSize: 24 * m.s, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", boxSizing: "border-box" }}>{w.num ?? i + 1}</div>
                </div>
                {w.label && <div style={{ marginTop: 14 * m.s, fontSize: 33 * m.s, fontWeight: 800, color: COLORS.text, textAlign: "center" }}>{w.label}</div>}
                {w.sub && <div style={{ marginTop: 3, fontSize: 21 * m.s, fontWeight: 600, color: COLORS.textSoft, textAlign: "center" }}>{w.sub}</div>}
              </div>
            ) : (
              w.label && <div style={{ fontSize: 40 * m.s, fontWeight: 900, color: COLORS.text }}>{w.label}</div>
            )}
          </div>
        );
      })}

      {/* título FIJO */}
      {(eyebrow || title) && (
        <div style={{ position: "absolute", top: 46, left: 0, right: 0, textAlign: "center", zIndex: 200 }}>
          {eyebrow && <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 700, textTransform: "uppercase", color: COLORS.textDim }}>{eyebrow}</div>}
          {title && <div style={{ fontSize: 48, fontWeight: 800, color: COLORS.text, marginTop: 6 }}>{title}</div>}
        </div>
      )}

      {/* SFX por nodo: whoosh de aproximación + golpe + click de la chispa */}
      {waypoints.map((_, i) => (
        <SfxCue key={"a" + i} at={arr[i] - sec(0.3)} src={SFX.camTravel ?? SFX.whoosh2} volume={0.36} durationInFrames={sec(0.5)} />
      ))}
      {waypoints.map((_, i) => (
        <SfxCue key={"l" + i} at={arr[i]} src={SFX.nodeLand ?? SFX.transition} volume={0.5} durationInFrames={sec(0.9)} />
      ))}
    </AbsoluteFill>
  );
};

// chispa-cometa que viaja sobre la estela (interpola entre los puntos de pantalla)
const CometOnPath: React.FC<{ pts: { sx: number; sy: number }[]; prog: number; color: string; scale: number }> = ({ pts, prog, color, scale }) => {
  if (pts.length < 2) return null;
  const seg = pts.length - 1;
  const f = Math.max(0, Math.min(seg - 0.001, prog * seg));
  const i = Math.floor(f), t = f - i;
  const a = pts[i], b = pts[i + 1];
  const x = a.sx + (b.sx - a.sx) * t, y = a.sy + (b.sy - a.sy) * t;
  return (
    <g>
      <circle cx={x} cy={y} r={16 * scale} fill={color} style={{ filter: "url(#jglow)" }} opacity={0.9} />
      <circle cx={x} cy={y} r={7 * scale} fill="#FFF6E4" />
    </g>
  );
};
