import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";

// ── FIRE-PATH DIORAMA ─────────────────────────────────────────────────────────
// Corte pseudo-3D de la estufa rocket: una corriente de FUEGO viaja por todo el
// sistema (boca → túnel → torre/riser 1000° → baja por la campana → zigzag del
// banco de masa → sale TIBIA por la chimenea). La cámara SIGUE la llama con zoom,
// el calor cambia de color naranja→gris al enfriarse, y cada parte se rotula al
// pasar el fuego. Inmersivo, ~16-20s. Reemplaza al diagrama estático del recorrido.

const BW = 1600;
const BH = 900;

// recorrido del fuego (puntos en coords del lienzo)
const PATH: [number, number][] = [
  [300, 210], // 0 boca (entra)
  [300, 470], // 1 baja
  [410, 520], // 2 túnel
  [470, 540], // 3 base del riser
  [470, 200], // 4 TOPE del riser (más caliente)
  [470, 540], // 5 vuelve a bajar
  [600, 575], // 6 entra al banco
  [770, 525], // 7 zigzag
  [930, 585], // 8
  [1090, 525], // 9
  [1250, 585], // 10
  [1360, 545], // 11 base chimenea
  [1360, 170], // 12 sale TIBIA
];

// longitudes acumuladas para mover la cabeza a velocidad pareja
const seg = PATH.slice(1).map((p, i) => Math.hypot(p[0] - PATH[i][0], p[1] - PATH[i][1]));
const totalLen = seg.length ? seg.reduce((a, b) => a + b, 0) : 1;
const cum = seg.reduce((acc, l) => { acc.push((acc[acc.length - 1] ?? 0) + l); return acc; }, [0]);

function pointAt(t: number): { x: number; y: number; hot: number } {
  const target = Math.max(0, Math.min(1, t)) * totalLen;
  let i = 0;
  while (i < cum.length - 1 && cum[i + 1] < target) i++;
  const segLen = seg[i] || 1;
  const f = (target - cum[i]) / segLen;
  const a = PATH[i], b = PATH[i + 1] || PATH[i];
  return {
    x: a[0] + (b[0] - a[0]) * f,
    y: a[1] + (b[1] - a[1]) * f,
    hot: i, // índice de segmento → para color
  };
}

const dPath = PATH.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

// rótulos que aparecen cuando el fuego pasa
const LABELS: { at: number; x: number; y: number; text: string; sub?: string; color: string }[] = [
  { at: 0.02, x: 300, y: 150, text: "La boca", sub: "entran 5 ramitas", color: COLORS.amber },
  { at: 0.18, x: 410, y: 620, text: "Túnel", sub: "el fuego entra", color: COLORS.amber },
  { at: 0.30, x: 600, y: 150, text: "Torre · 1000°C", sub: "combustión completa", color: COLORS.danger },
  { at: 0.55, x: 930, y: 690, text: "Banco de masa", sub: "guarda el calor", color: COLORS.accent },
  { at: 0.92, x: 1360, y: 110, text: "Chimenea tibia", sub: "sale ya fría", color: COLORS.cold },
];

export const FirePathDiorama: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
}> = ({ durationInFrames, eyebrow = "El recorrido del fuego", title = "Cómo viaja el calor" }) => {
  const frame = useCurrentFrame();
  useVideoConfig();

  const travelStart = sec(1.0);
  const travelEnd = durationInFrames - sec(3.2);
  const prog = interpolate(frame, [travelStart, travelEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const head = pointAt(prog);

  // calor según el segmento (riser = más caliente, chimenea = frío)
  const hotMix = head.hot <= 4 ? 1 : head.hot <= 6 ? 0.85 : head.hot <= 11 ? interpolate(head.hot, [6, 11], [0.8, 0.25]) : 0.1;
  const headColor = hotMix > 0.7 ? "#FFC14D" : hotMix > 0.4 ? COLORS.amber : COLORS.cold;

  // FOLLOW-CAM: sigue la cabeza con zoom; al final se aleja para ver todo
  const endStart = travelEnd;
  const endEnd = durationInFrames - sec(0.6);
  const ez = interpolate(frame, [endStart, endEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const camX = head.x + (BW / 2 - head.x) * ez;
  const camY = head.y + (BH / 2 - head.y) * ez;
  const camZ = interpolate(ez, [0, 1], [1.5, 0.92]);
  const cam = `scale(${camZ}) translate(${BW / 2 - camX}px, ${BH / 2 - camY}px)`;

  // longitud del trazo revelado (estela del fuego)
  const revealLen = prog;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
      <SfxCue at={travelStart} src={SFX.whoosh} volume={0.4} />

      {/* título fijo */}
      <div style={{ position: "absolute", top: 54, left: 0, right: 0, textAlign: "center", zIndex: 6 }}>
        {eyebrow && <div style={{ letterSpacing: 6, fontSize: 20, fontWeight: 700, textTransform: "uppercase", color: COLORS.textDim }}>{eyebrow}</div>}
        {title && <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.text, marginTop: 6 }}>{title}</div>}
      </div>

      {/* lienzo del diorama bajo la follow-cam */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: BW, height: BH, position: "relative", transformOrigin: "center center", transform: cam, perspective: 1600 }}>
          <svg viewBox={`0 0 ${BW} ${BH}`} width={BW} height={BH} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <linearGradient id="fireGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF8A3D" />
                <stop offset="28%" stopColor="#FFC14D" />
                <stop offset="55%" stopColor={COLORS.amber} />
                <stop offset="100%" stopColor={COLORS.cold} />
              </linearGradient>
              <filter id="fireGlow"><feGaussianBlur stdDeviation="6" /></filter>
              <filter id="fireBloom" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20" /></filter>
            </defs>

            {/* CUERPO de la estufa (corte de barro, pseudo-3D con capas) */}
            {/* sombra/base */}
            <ellipse cx={760} cy={760} rx={760} ry={70} fill="rgba(42,38,32,0.12)" />
            {/* banco de masa (cajón) */}
            <rect x={560} y={520} width={840} height={170} rx={26} fill={COLORS.bg2} stroke="rgba(42,38,32,0.25)" strokeWidth={3} />
            <rect x={560} y={520} width={840} height={28} rx={14} fill="rgba(255,255,255,0.18)" />
            {/* bloque de la torre/boca */}
            <rect x={250} y={170} width={300} height={520} rx={26} fill={COLORS.bg2} stroke="rgba(42,38,32,0.25)" strokeWidth={3} />
            <rect x={250} y={170} width={300} height={26} rx={13} fill="rgba(255,255,255,0.18)" />
            {/* chimenea */}
            <rect x={1330} y={150} width={64} height={400} rx={14} fill={COLORS.bg1} stroke="rgba(42,38,32,0.25)" strokeWidth={3} />
            {/* hueco del riser */}
            <rect x={448} y={190} width={44} height={360} rx={10} fill="rgba(42,38,32,0.18)" />

            {/* canal del recorrido (tubo oscuro) */}
            <path d={dPath} fill="none" stroke="rgba(42,38,32,0.30)" strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" />

            {/* BLOOM — halo ancho de la estela (la luz "sangra") */}
            <path
              d={dPath}
              fill="none"
              stroke="url(#fireGrad)"
              strokeWidth={54}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - revealLen}
              style={{ filter: "url(#fireBloom)", opacity: 0.55, mixBlendMode: "screen" }}
            />

            {/* ESTELA de fuego revelándose con gradiente caliente→frío */}
            <path
              d={dPath}
              fill="none"
              stroke="url(#fireGrad)"
              strokeWidth={22}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - revealLen}
              style={{ filter: "url(#fireGlow)" }}
            />
            <path
              d={dPath}
              fill="none"
              stroke="url(#fireGrad)"
              strokeWidth={11}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - revealLen}
            />

            {/* llamas grandes en el tope del riser cuando el fuego está ahí */}
            {prog > 0.22 && prog < 0.5 && (
              <g opacity={interpolate(prog, [0.22, 0.3, 0.46, 0.5], [0, 1, 1, 0])}>
                {[0, 1, 2].map((k) => {
                  const fl = Math.sin(frame / 5 + k) * 14;
                  return <path key={k} d={`M ${455 + k * 12} 210 q ${10 + fl} -60 0 -110 q -${10 + fl} 50 0 110`} fill={k === 1 ? "#FFC14D" : "#FF8A3D"} opacity={0.85} />;
                })}
              </g>
            )}
          </svg>

          {/* CABEZA del fuego + brasas (HTML para glow lindo) */}
          <div style={{ position: "absolute", left: head.x, top: head.y, transform: "translate(-50%,-50%)", pointerEvents: "none" }}>
            <div style={{ width: 46, height: 46, borderRadius: 30, background: headColor, boxShadow: `0 0 50px 16px ${headColor}, 0 0 90px 30px ${headColor}88`, opacity: prog > 0.001 && prog < 0.999 ? 1 : 0 }} />
            {[0, 1, 2, 3, 4].map((k) => {
              const a = frame / 7 + k * 1.4;
              return <div key={k} style={{ position: "absolute", left: Math.cos(a) * 22, top: -Math.abs(Math.sin(a)) * 40 - 6, width: 8, height: 8, borderRadius: 4, background: headColor, opacity: (prog > 0.001 && prog < 0.999 ? 0.8 : 0) * (0.5 + 0.5 * Math.sin(a)) }} />;
            })}
          </div>

          {/* rótulos por parte */}
          {LABELS.map((l, i) => {
            const show = interpolate(prog, [l.at, l.at + 0.05], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ position: "absolute", left: l.x, top: l.y, transform: `translate(-50%,-50%) translateY(${(1 - show) * 14}px)`, opacity: show, textAlign: "center", pointerEvents: "none" }}>
                <div style={{ display: "inline-block", padding: "8px 18px", borderRadius: 14, background: "rgba(34,30,26,0.86)", border: `2px solid ${l.color}`, color: COLORS.bg0, fontSize: 30, fontWeight: 900, boxShadow: "0 10px 28px rgba(0,0,0,0.45)" }}>{l.text}</div>
                {l.sub && <div style={{ marginTop: 6, fontSize: 21, fontWeight: 700, color: COLORS.textSoft, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>{l.sub}</div>}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* SFX por hito (placeholders con el pack actual; se reemplazan con los nuevos) */}
      <SfxCue at={travelStart + Math.round((travelEnd - travelStart) * 0.30)} src={SFX.ui5} volume={0.4} />
      <SfxCue at={travelStart + Math.round((travelEnd - travelStart) * 0.55)} src={SFX.pop2} volume={0.4} />
      <SfxCue at={endStart} src={SFX.whoosh2} volume={0.4} />
    </AbsoluteFill>
  );
};
