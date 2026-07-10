import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── CirculoVicioso (explainer animado del canal Dr. Federer Veterinario) ──────
// Molde PRO/sobrio (mismo espíritu que PizarraOjo): UN sujeto grande a la izquierda
// —un ANILLO con 4 nodos que giran en sentido horario— + una columna de PASOS a la
// derecha. Solo se enfatiza el paso activo; los pasados se atenúan. Paleta mínima
// (tinta + teal + coral), una tipografía, movimiento sobrio. El avatar NO va: ocupa
// todo el cuadro. Explica el ciclo picazón → lamido → humedad → hongo → más picazón.

const INTER = loadInter().fontFamily;
const C = {
  bg: "#F4FAFA",
  ink: "#12242E",
  sub: "#5A6B76",
  teal: "#12B3AE",
  tealDim: "#C6E9E7",
  coral: "#E4141B",
  line: "#D8E6E8",
};

const fade = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const draw = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// 4 pasos del ciclo, en orden HORARIO: top → right → bottom → left → (vuelve)
const STEPS = [
  { n: "1", head: "Pica", body: "El hongo hace arder la piel entre los dedos.", at: 34, ang: -90 },
  { n: "2", head: "Se lame", body: "El perro se muerde la pata para calmar la picazón.", at: 96, ang: 0 },
  { n: "3", head: "Humedad + calor", body: "La saliva deja el ambiente tibio y húmedo que el hongo ama.", at: 158, ang: 90 },
  { n: "4", head: "El hongo crece", body: "Con más hongo, pica todavía más… y vuelve a empezar.", at: 220, ang: 180 },
];

const CX = 500, CY = 560, R = 300;
const pos = (angDeg: number, radius = R) => {
  const a = (angDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
};

export const CirculoVicioso: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const active = STEPS.reduce((acc, s, i) => (frame >= s.at ? i : acc), 0);
  const looping = frame >= 250; // tras el paso 4: se enfatiza que es un CICLO

  // punto de flujo que viaja en sentido horario por el anillo (sutil; acelera al cerrar el ciclo)
  const speed = looping ? 2.4 : 1.1;
  const flowAng = -90 + frame * speed;
  const flow = pos(flowAng);

  const ringDraw = draw(frame, 12, 70); // el anillo se dibuja una vez

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: INTER }}>
      {/* etiqueta de sección */}
      <div style={{ position: "absolute", top: 70, left: 96, opacity: fade(frame, 4, 20) }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.teal }}>
          El mecanismo
        </div>
        <div style={{ fontSize: 52, fontWeight: 800, color: C.ink, marginTop: 8, letterSpacing: -0.5 }}>
          El círculo vicioso del lamido
        </div>
      </div>

      {/* ── ANILLO CON 4 NODOS (izquierda) ── */}
      <svg viewBox="0 0 1000 1080" width="52%" height="100%" style={{ position: "absolute", left: 20, top: 30 }}>
        {/* anillo base que se dibuja una vez */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={C.tealDim} strokeWidth="10"
          strokeDasharray={2 * Math.PI * R} strokeDashoffset={ringDraw * 2 * Math.PI * R} />

        {/* 4 chevrons horarios entre nodos (dirección del ciclo) */}
        {[-45, 45, 135, 225].map((a, i) => {
          const p = pos(a, R);
          const t = a + 90; // tangente horaria
          return (
            <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${t})`} opacity={fade(frame, 66, 84) * (looping ? 1 : 0.55)}>
              <path d="M -12 -12 L 12 0 L -12 12" fill="none" stroke={C.teal} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}

        {/* punto de flujo viajando por el anillo */}
        {frame >= 72 && <circle cx={flow.x} cy={flow.y} r="13" fill={looping ? C.coral : C.teal} opacity={0.9} />}

        {/* nodos */}
        {STEPS.map((s, i) => {
          const p = pos(s.ang);
          const isActive = i === active;
          const isDone = i < active;
          const app = spring({ frame: frame - (s.at - 8), fps, config: { damping: 16, stiffness: 120 } });
          if (frame < s.at - 12) {
            // nodo aún no revelado: aro tenue
            return <circle key={i} cx={p.x} cy={p.y} r="46" fill="#FFFFFF" stroke={C.line} strokeWidth="3" opacity={fade(frame, 40, 70) * 0.5} />;
          }
          const sc = interpolate(app, [0, 1], [0.6, 1]);
          const scale = isActive ? 1.12 : 1;
          return (
            <g key={i} transform={`translate(${p.x} ${p.y}) scale(${sc * scale})`}>
              <circle r="52" fill={isActive ? C.teal : "#FFFFFF"} stroke={C.teal} strokeWidth="4"
                opacity={isDone ? 0.5 : 1} />
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central"
                fontFamily={INTER} fontWeight={800} fontSize="42"
                fill={isActive ? "#FFFFFF" : C.teal} opacity={isDone ? 0.5 : 1}>{s.n}</text>
            </g>
          );
        })}

        {/* etiqueta central: "vuelta y vuelta" al cerrar */}
        {looping && (
          <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central"
            fontFamily={INTER} fontWeight={800} fontSize="40" fill={C.coral} opacity={fade(frame, 252, 274)}>
            ↻ y vuelve a empezar
          </text>
        )}
      </svg>

      {/* ── COLUMNA DE PASOS (derecha) ── */}
      <div style={{ position: "absolute", right: 110, top: 292, width: 620 }}>
        {STEPS.map((s, i) => {
          const isActive = i === active;
          const isDone = i < active;
          const app = spring({ frame: frame - s.at, fps, config: { damping: 18, stiffness: 110 } });
          if (frame < s.at - 6) return null;
          const op = isActive ? 1 : isDone ? 0.34 : 1;
          return (
            <div key={i} style={{
              display: "flex", gap: 24, marginBottom: 40,
              opacity: op * app, transform: `translateY(${interpolate(app, [0, 1], [16, 0])}px)`,
            }}>
              <div style={{
                flex: "0 0 auto", width: 54, height: 54, borderRadius: 30,
                background: isActive ? C.teal : "#FFFFFF", border: `2px solid ${C.teal}`,
                color: isActive ? "#FFFFFF" : C.teal, fontWeight: 800, fontSize: 25,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 39, fontWeight: 800, color: C.ink, lineHeight: 1.1 }}>{s.head}</div>
                <div style={{ fontSize: 24, color: C.sub, marginTop: 8, lineHeight: 1.4 }}>{s.body}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* takeaway final */}
      <div style={{
        position: "absolute", left: 96, bottom: 74, right: 96,
        opacity: fade(frame, 276, 300),
        borderTop: `2px solid ${C.line}`, paddingTop: 24,
      }}>
        <span style={{ fontSize: 33, fontWeight: 800, color: C.ink }}>
          El hongo lo hace lamer, y el lamido <span style={{ color: C.teal }}>alimenta al hongo</span>.
        </span>
      </div>
    </AbsoluteFill>
  );
};
