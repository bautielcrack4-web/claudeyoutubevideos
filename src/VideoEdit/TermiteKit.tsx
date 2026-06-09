import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  AbsoluteFill,
  Img,
  staticFile,
} from "remotion";
import { COLORS, FONT_STACK, glass } from "./theme";
import { SceneFrame } from "./components/SceneFrame";
import { stagger, drift } from "./lib/anim";
import { SfxCue, SFX } from "./components/Sfx";

// ─────────────────────────────────────────────────────────────────────────────
// TermiteKit — componentes BESPOKE para el video del borax/termitas (paleta cold:
// DORADO = borax/solución · ACERO = problema/colonia · ROJO = veneno/peligro ·
// VERDE = seguro/benéfico). Todo con movimiento constante (Regla 10) y micro-
// animaciones de ~2-3 s. Diagramas SVG que se dibujan solos y loopean.
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = COLORS.accent;
const STEEL = COLORS.cold;
const DANGER = COLORS.danger;
const GOOD = COLORS.good;

const loopT = (frame: number, period: number, offset = 0) =>
  ((((frame + offset) % period) + period) % period) / period;

const Eyebrow: React.FC<{ children: React.ReactNode; opacity: number }> = ({
  children,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      textAlign: "center",
      letterSpacing: 6,
      fontSize: 20,
      fontWeight: 800,
      textTransform: "uppercase",
      color: COLORS.textDim,
      opacity,
      zIndex: 4,
    }}
  >
    {children}
  </div>
);

const Caption: React.FC<{ children: React.ReactNode; opacity: number }> = ({
  children,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      bottom: -6,
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: 30,
      fontWeight: 700,
      color: COLORS.textSoft,
      opacity,
      zIndex: 4,
    }}
  >
    {children}
  </div>
);

// ── 1) TROFALAXIA — una obrera contaminada envenena la colonia entera ─────────
// Una termita obrera lleva borax desde la madera tratada (izq) al nido (der). El
// veneno se propaga de nodo a nodo (reina, larvas, soldados): cada uno pasa de
// ACERO → ROJO con un pulso. Loop continuo, lectura: "no hace falta hallar el nido".
export const TrofalaxiaDiagram: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  caption?: string;
}> = ({
  durationInFrames,
  eyebrow = "Trofalaxia",
  caption = "Una obrera contamina a toda la colonia",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.8 } });
  const BOX_W = 1560;
  const BOX_H = 760;

  // Nido: reina al centro-derecha + 6 satélites (larvas / soldados)
  const nestX = BOX_W * 0.72;
  const nestY = BOX_H * 0.5;
  const queen = { x: nestX, y: nestY, r: 56, label: "REINA", infect: 0.32 };
  const sats = Array.from({ length: 6 }).map((_, i) => {
    const a = (i / 6) * Math.PI * 2 + 0.4;
    return {
      x: nestX + Math.cos(a) * 200,
      y: nestY + Math.sin(a) * 175,
      r: 30,
      label: i % 2 === 0 ? "larva" : "soldado",
      infect: 0.46 + i * 0.07,
    };
  });

  // Obrera viaja de la madera (izq) a la reina, en loop de ~3.3s
  const period = 100;
  const t = loopT(frame, period);
  const woodX = BOX_W * 0.12;
  const woodY = BOX_H * 0.5;
  const wkX = interpolate(t, [0, 0.55, 1], [woodX, nestX, woodX]);
  const wkY = interpolate(
    t,
    [0, 0.55, 1],
    [woodY, nestY, woodY],
    { easing: Easing.inOut(Easing.quad) },
  );
  const carrying = t < 0.55; // lleva el polvo hacia el nido

  // progreso global de contaminación (0..1) a lo largo de la escena
  const spread = interpolate(
    frame,
    [period * 0.5, durationInFrames - 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const Bug: React.FC<{ x: number; y: number; r: number; infected: number; pulse: number }> = ({
    x,
    y,
    r,
    infected,
    pulse,
  }) => {
    const col = interpolate(infected, [0, 1], [0, 1]) > 0.5 ? DANGER : STEEL;
    const mix = infected < 0.5 ? STEEL : DANGER;
    return (
      <g transform={`translate(${x} ${y})`}>
        {pulse > 0 && (
          <circle r={r + pulse * 40} fill="none" stroke={DANGER} strokeWidth={3} opacity={(1 - pulse) * 0.8} />
        )}
        <ellipse rx={r} ry={r * 0.78} fill={mix} opacity={0.92} style={{ filter: `drop-shadow(0 0 10px ${col}aa)` }} />
        <ellipse cx={-r * 0.7} rx={r * 0.5} ry={r * 0.5} fill={mix} opacity={0.92} />
        {/* patitas */}
        {[-0.5, 0, 0.5].map((p, i) => (
          <line key={i} x1={-r * 0.2} y1={p * r} x2={r * 0.9} y2={p * r * 1.7} stroke={mix} strokeWidth={2.4} opacity={0.7} />
        ))}
      </g>
    );
  };

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="cold" glowX={60} glowY={50} drift={0.5}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={0} src={SFX.whoosh} volume={0.4} />
        <Eyebrow opacity={enter}>{eyebrow}</Eyebrow>

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* madera tratada (origen del borax) */}
          <g transform={`translate(${woodX} ${woodY})`} opacity={enter}>
            <rect x={-95} y={-70} width={150} height={140} rx={10} fill="url(#woodGrad)" stroke={`${GOLD}aa`} strokeWidth={2} />
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1={-95} x2={55} y1={-50 + i * 25} y2={-50 + i * 25} stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
            ))}
            {/* motas de polvo dorado */}
            {Array.from({ length: 6 }).map((_, i) => {
              const tt = loopT(frame, 60, i * 11);
              return <circle key={i} cx={-30 + (i % 3) * 30} cy={-40 + Math.floor(i / 3) * 70} r={3 + tt * 2} fill={GOLD} opacity={(1 - tt) * 0.9} />;
            })}
            <text y={108} textAnchor="middle" fontSize={22} fontWeight={800} fill={GOLD} fontFamily={FONT_STACK}>MADERA + BORAX</text>
          </g>
          <defs>
            <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7a5a32" />
              <stop offset="100%" stopColor="#4e3a20" />
            </linearGradient>
            <radialGradient id="nestGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={DANGER} stopOpacity={0.22} />
              <stop offset="100%" stopColor={DANGER} stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* halo del nido que se enrojece al contaminarse */}
          <circle cx={nestX} cy={nestY} r={300} fill="url(#nestGlow)" opacity={spread * enter} />

          {/* enlaces de reparto de comida (trofalaxia) entre reina y satélites */}
          {sats.map((s, i) => {
            const on = spread > s.infect - 0.18 ? 1 : 0;
            const flow = loopT(frame, 50, i * 9);
            return (
              <g key={"l" + i} opacity={enter * (0.25 + on * 0.6)}>
                <line x1={queen.x} y1={queen.y} x2={s.x} y2={s.y} stroke={on ? DANGER : "rgba(255,255,255,0.18)"} strokeWidth={on ? 3 : 1.5} />
                {on > 0 && (
                  <circle cx={interpolate(flow, [0, 1], [queen.x, s.x])} cy={interpolate(flow, [0, 1], [queen.y, s.y])} r={5} fill={DANGER} opacity={1 - flow} />
                )}
              </g>
            );
          })}

          {/* nodos: satélites + reina */}
          {sats.map((s, i) => {
            const inf = interpolate(spread, [s.infect - 0.1, s.infect + 0.05], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const pulse = loopT(frame, 40, i * 7) < 0.5 && inf > 0.4 && inf < 0.98 ? loopT(frame, 40, i * 7) * 2 : 0;
            return (
              <g key={"s" + i} opacity={enter}>
                <Bug x={s.x} y={s.y} r={s.r} infected={inf} pulse={pulse} />
                <text x={s.x} y={s.y + s.r + 26} textAnchor="middle" fontSize={18} fontWeight={700} fill={inf > 0.5 ? DANGER : COLORS.textSoft} fontFamily={FONT_STACK}>{s.label}</text>
              </g>
            );
          })}
          {(() => {
            const inf = interpolate(spread, [queen.infect - 0.1, queen.infect + 0.05], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <g opacity={enter}>
                <Bug x={queen.x} y={queen.y} r={queen.r} infected={inf} pulse={0} />
                <text x={queen.x} y={queen.y + queen.r + 30} textAnchor="middle" fontSize={24} fontWeight={900} fill={inf > 0.5 ? DANGER : GOLD} fontFamily={FONT_STACK}>{queen.label}</text>
              </g>
            );
          })()}

          {/* la obrera que viaja llevando el polvo */}
          <g opacity={enter}>
            {carrying && <circle cx={wkX} cy={wkY - 22} r={9} fill={GOLD} style={{ filter: `drop-shadow(0 0 8px ${GOLD})` }} />}
            <Bug x={wkX} y={wkY} r={26} infected={carrying ? 1 : 0.2} pulse={0} />
          </g>
        </svg>

        <Caption opacity={enter}>{caption}</Caption>
      </div>
    </SceneFrame>
  );
};

// ── 2) MECANISMO INTESTINAL — el borax destruye la flora → inanición ──────────
// Una cápsula "intestino" con microbios (VERDE) que digieren celulosa. Caen
// partículas de borax (DORADO) → los microbios se apagan uno a uno → contador
// "24–72 H" de inanición. Loop de partículas + apagado progresivo.
export const GutMechanism: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  caption?: string;
}> = ({
  durationInFrames,
  eyebrow = "El mecanismo",
  caption = "Sin su flora intestinal, no puede digerir: inanición",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.8 } });
  const BOX_W = 1520;
  const BOX_H = 720;

  const microbes = Array.from({ length: 22 }).map((_, i) => {
    const a = (i * 137.5 * Math.PI) / 180;
    const rr = 40 + (i / 22) * 250;
    return {
      x: BOX_W * 0.5 + Math.cos(a) * rr,
      y: BOX_H * 0.5 + Math.sin(a) * rr * 0.62,
      die: 0.25 + (i / 22) * 0.7,
      seed: i,
    };
  });

  const kill = interpolate(frame, [30, durationInFrames - 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="cold" glowX={50} glowY={48} drift={0.5}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={0} src={SFX.ui3} volume={0.4} />
        <Eyebrow opacity={enter}>{eyebrow}</Eyebrow>

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <radialGradient id="gutGrad" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#2a2230" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#16131b" stopOpacity={0.9} />
            </radialGradient>
          </defs>

          {/* cápsula intestino */}
          <ellipse cx={BOX_W * 0.5} cy={BOX_H * 0.5} rx={430 * (0.96 + enter * 0.04)} ry={290 * (0.96 + enter * 0.04)} fill="url(#gutGrad)" stroke="rgba(255,255,255,0.16)" strokeWidth={2} opacity={enter} />
          <text x={BOX_W * 0.5} y={BOX_H * 0.5 - 250} textAnchor="middle" fontSize={22} fontWeight={800} fill={COLORS.textSoft} fontFamily={FONT_STACK} opacity={enter}>INTESTINO DE LA TERMITA</text>

          {/* borax cayendo (partículas doradas en loop) */}
          {Array.from({ length: 10 }).map((_, i) => {
            const tt = loopT(frame, 56, i * 13);
            const x = BOX_W * 0.5 + (i - 5) * 70;
            const y = interpolate(tt, [0, 1], [BOX_H * 0.16, BOX_H * 0.5]);
            return <circle key={i} cx={x} cy={y} r={5} fill={GOLD} opacity={interpolate(tt, [0, 0.2, 0.9, 1], [0, 1, 1, 0]) * enter} style={{ filter: `drop-shadow(0 0 6px ${GOLD})` }} />;
          })}

          {/* microbios: vivos (verde, latiendo) → muertos (gris, apagados) */}
          {microbes.map((m, i) => {
            const dead = kill > m.die;
            const d = drift(frame, m.seed * 2.1, 1.1, 6);
            const beat = 1 + Math.sin(frame / 7 + i) * 0.12;
            const col = dead ? "rgba(120,120,130,0.45)" : GOOD;
            return (
              <g key={i} transform={`translate(${m.x + d.x} ${m.y + d.y})`} opacity={enter * (dead ? 0.5 : 1)}>
                <circle r={dead ? 9 : 13 * beat} fill={col} style={{ filter: dead ? "none" : `drop-shadow(0 0 8px ${GOOD}aa)` }} />
                {!dead && <circle r={5} fill="#fff" opacity={0.5} />}
              </g>
            );
          })}
        </svg>

        {/* contador de inanición */}
        <div style={{ position: "absolute", right: 30, top: BOX_H * 0.5 - 120, ...glass("dark"), padding: "20px 30px", borderRadius: 22, textAlign: "center", opacity: interpolate(kill, [0.2, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: COLORS.textDim, textTransform: "uppercase" }}>Tienen</div>
          <div style={{ fontSize: 88, fontWeight: 900, color: DANGER, lineHeight: 1, textShadow: `0 6px 30px ${DANGER}66` }}>24–72</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.text }}>horas</div>
        </div>

        <Caption opacity={enter}>{caption}</Caption>
      </div>
    </SceneFrame>
  );
};

// ── 3) SELECTIVIDAD — termita (bacterias → vulnerable) vs persona/perro (inmune) ─
export const SelectiveCompare: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
}> = ({ durationInFrames, eyebrow = "Por qué es selectivo" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.8 } });
  const lIn = spring({ frame: frame - 6, fps, config: { damping: 18, mass: 0.8 } });
  const rIn = spring({ frame: frame - 20, fps, config: { damping: 18, mass: 0.8 } });

  const Panel: React.FC<{
    inn: number;
    side: number;
    title: string;
    sub: string;
    verdict: string;
    col: string;
    emoji: string;
  }> = ({ inn, side, title, sub, verdict, col, emoji }) => {
    const d = drift(frame, side * 4 + 2, 0.5, 7);
    return (
      <div
        style={{
          ...glass("dark"),
          width: 600,
          padding: "44px 40px",
          borderRadius: 30,
          textAlign: "center",
          opacity: inn,
          transform: `translateY(${(1 - inn) * 50 + d.y}px) scale(${0.94 + inn * 0.06})`,
          border: `1px solid ${col}66`,
          boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${col}22`,
        }}
      >
        <div style={{ fontSize: 96, lineHeight: 1 }}>{emoji}</div>
        <div style={{ fontSize: 46, fontWeight: 900, color: COLORS.text, marginTop: 14 }}>{title}</div>
        <div style={{ fontSize: 28, fontWeight: 600, color: COLORS.textSoft, marginTop: 14, lineHeight: 1.3 }}>{sub}</div>
        <div style={{ marginTop: 26, padding: "12px 0", borderRadius: 16, background: `${col}1f`, border: `1.5px solid ${col}`, fontSize: 34, fontWeight: 900, color: col, letterSpacing: 1 }}>{verdict}</div>
      </div>
    );
  };

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="cold" glowY={46} bg="black">
      <div style={{ position: "relative", width: 1480, fontFamily: FONT_STACK }}>
        <Eyebrow opacity={enter}>{eyebrow}</Eyebrow>
        <div style={{ display: "flex", gap: 60, justifyContent: "center", alignItems: "stretch", marginTop: 60 }}>
          <Panel inn={lIn} side={0} emoji="🐜" title="TERMITA" sub="Digiere la celulosa con bacterias simbióticas en el intestino" verdict="VULNERABLE" col={DANGER} />
          <Panel inn={rIn} side={1} emoji="🐕" title="PERRO · PERSONA" sub="Digiere con ácidos y enzimas, no con bacterias" verdict="INMUNE" col={GOOD} />
        </div>
        <SfxCue at={6} src={SFX.ui2} volume={0.4} />
        <SfxCue at={20} src={SFX.ui5} volume={0.4} />
      </div>
    </SceneFrame>
  );
};

// ── 4) COSTO ACUMULADO — borax (una caja/década) vs fumigación (cada 3 meses) ──
// Eje de meses; la fumigación sube en escalera, el borax queda plano abajo.
export const CostCumulative: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  months?: number;
  visitCost?: number;
  boraxCost?: number;
}> = ({
  durationInFrames,
  eyebrow = "El número que no te cuentan",
  months = 24,
  visitCost = 1,
  boraxCost = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22, mass: 0.9 } });
  const BOX_W = 1500;
  const BOX_H = 720;
  const padL = 120;
  const padR = 80;
  const padT = 90;
  const padB = 90;
  const plotW = BOX_W - padL - padR;
  const plotH = BOX_H - padT - padB;

  // serie fumigación: +visitCost cada 3 meses (escalera). Normalizamos a "visitas".
  const fumiMax = Math.ceil(months / 3) * visitCost; // total al final
  const x = (m: number) => padL + (m / months) * plotW;
  const y = (v: number) => padT + plotH - (v / fumiMax) * plotH;

  const prog = interpolate(frame, [10, durationInFrames - 16], [0, months], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // construir el path escalera hasta `prog`
  let dFumi = `M ${x(0)} ${y(0)}`;
  let acc = 0;
  for (let m = 0; m <= months; m++) {
    if (m > prog) break;
    if (m > 0 && m % 3 === 0) {
      dFumi += ` L ${x(m)} ${y(acc)}`;
      acc += visitCost;
      dFumi += ` L ${x(m)} ${y(acc)}`;
    } else {
      dFumi += ` L ${x(Math.min(m, prog))} ${y(acc)}`;
    }
  }
  const visitsDone = Math.floor(prog / 3);

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="cold" glowY={42} bg="black">
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={0} src={SFX.whoosh} volume={0.4} />
        <Eyebrow opacity={enter}>{eyebrow}</Eyebrow>

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* ejes */}
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
          {[0, 6, 12, 18, 24].map((m) => (
            <text key={m} x={x(m)} y={padT + plotH + 36} textAnchor="middle" fontSize={20} fontWeight={700} fill={COLORS.textDim} fontFamily={FONT_STACK}>
              {m === 0 ? "hoy" : `${m}m`}
            </text>
          ))}

          {/* borax: una sola compra, luego plano */}
          <line x1={x(0)} y1={y(boraxCost / 5)} x2={x(Math.min(prog, months))} y2={y(boraxCost / 5)} stroke={GOLD} strokeWidth={6} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${GOLD}aa)` }} />
          <circle cx={x(0)} cy={y(boraxCost / 5)} r={9} fill={GOLD} />

          {/* fumigación: escalera roja que sube */}
          <path d={dFumi} fill="none" stroke={DANGER} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${DANGER}aa)` }} />
          {/* puntito en cada visita */}
          {Array.from({ length: Math.floor(months / 3) }).map((_, i) => {
            const m = (i + 1) * 3;
            if (m > prog) return null;
            return <circle key={i} cx={x(m)} cy={y((i + 1) * visitCost)} r={7} fill={DANGER} />;
          })}
        </svg>

        {/* leyendas */}
        <div style={{ position: "absolute", left: padL + 30, top: padT + 6, display: "flex", flexDirection: "column", gap: 14, opacity: enter }}>
          <Legend col={DANGER} label="Fumigación · cada 3 meses, para siempre" />
          <Legend col={GOLD} label="Una caja de borax · te dura una década" />
        </div>

        {/* contador de visitas pagadas */}
        <div style={{ position: "absolute", right: 40, top: padT + 10, ...glass("dark"), padding: "16px 26px", borderRadius: 20, textAlign: "center", opacity: enter }}>
          <div style={{ fontSize: 64, fontWeight: 900, color: DANGER, lineHeight: 1 }}>{visitsDone}×</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.textSoft }}>visitas pagadas</div>
        </div>
      </div>
    </SceneFrame>
  );
};

const Legend: React.FC<{ col: string; label: string }> = ({ col, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <span style={{ width: 26, height: 6, borderRadius: 6, background: col, boxShadow: `0 0 10px ${col}` }} />
    <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, fontFamily: FONT_STACK }}>{label}</span>
  </div>
);

// ── 5) MAPA — dónde es OBLIGATORIO tratar la madera con borato ─────────────────
export const WorldMapPins: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  caption?: string;
  pins?: { label: string; sub: string; x: number; y: number }[];
}> = ({
  durationInFrames,
  eyebrow = "No es un secreto",
  caption = "Donde el problema es grave, tratar la madera es obligatorio",
  pins = [
    { label: "Australia", sub: "obligatorio por ley", x: 0.78, y: 0.66 },
    { label: "Hawái", sub: "desde los años 70", x: 0.12, y: 0.5 },
    { label: "EE.UU.", sub: "madera ya tratada de fábrica", x: 0.26, y: 0.36 },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.9 } });
  const BOX_W = 1500;
  const BOX_H = 760;
  const cx = BOX_W * 0.5;
  const cy = BOX_H * 0.52;
  const R = 300;

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="cold" glowY={48} bg="black">
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={0} src={SFX.whoosh} volume={0.4} />
        <Eyebrow opacity={enter}>{eyebrow}</Eyebrow>

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* globo estilizado con meridianos/paralelos, rotación sutil */}
          <circle cx={cx} cy={cy} r={R} fill="rgba(155,182,198,0.06)" stroke="rgba(155,182,198,0.3)" strokeWidth={2} opacity={enter} />
          {[-0.6, -0.3, 0, 0.3, 0.6].map((p, i) => (
            <ellipse key={"lat" + i} cx={cx} cy={cy + p * R} rx={R * Math.cos(Math.asin(p))} ry={R * 0.14} fill="none" stroke="rgba(155,182,198,0.18)" strokeWidth={1.4} opacity={enter} />
          ))}
          {[0, 1, 2, 3].map((i) => {
            const rot = (i / 4) * Math.PI + frame / 240;
            return <ellipse key={"lon" + i} cx={cx} cy={cy} rx={Math.abs(R * Math.cos(rot)) + 1} ry={R} fill="none" stroke="rgba(155,182,198,0.16)" strokeWidth={1.4} opacity={enter} />;
          })}

          {/* dotted landmass suggestion */}
          {Array.from({ length: 120 }).map((_, i) => {
            const a = (i * 137.5 * Math.PI) / 180;
            const rr = Math.sqrt((i % 40) / 40) * R * 0.95;
            const px = cx + Math.cos(a) * rr;
            const py = cy + Math.sin(a) * rr;
            return <circle key={i} cx={px} cy={py} r={2.2} fill="rgba(155,182,198,0.22)" opacity={enter} />;
          })}
        </svg>

        {/* pines */}
        {pins.map((p, i) => {
          const s = stagger(frame, fps, i, 16, 14);
          const px = cx + (p.x - 0.5) * 2 * R * 0.82;
          const py = cy + (p.y - 0.5) * 2 * R * 0.82;
          const bob = Math.sin(frame / 18 + i) * 5;
          return (
            <div key={i} style={{ position: "absolute", left: px, top: py + bob - 70, transform: `translate(-50%, 0) scale(${0.7 + s * 0.3})`, opacity: s, transformOrigin: "bottom center" }}>
              <div style={{ ...glass("dark"), padding: "10px 18px", borderRadius: 16, textAlign: "center", border: `1.5px solid ${GOOD}88`, whiteSpace: "nowrap" }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: COLORS.text }}>{p.label}</div>
                <div style={{ fontSize: 19, fontWeight: 700, color: GOOD }}>{p.sub}</div>
              </div>
              <div style={{ width: 0, height: 0, margin: "0 auto", borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: `14px solid ${GOOD}` }} />
              <SfxCue at={14 + i * 16} src={SFX.pop1} volume={0.4} />
            </div>
          );
        })}

        <Caption opacity={enter}>{caption}</Caption>
      </div>
    </SceneFrame>
  );
};

// ── 6) INSPECCIÓN DE LA CASA — los puntos críticos donde mirar ────────────────
export const HouseInspection: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  caption?: string;
}> = ({
  durationInFrames,
  eyebrow = "Cinco minutos por mes",
  caption = "La termita siempre avisa antes — si sabés dónde mirar",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.9 } });
  const BOX_W = 1500;
  const BOX_H = 760;

  // puntos críticos en coords del dibujo
  const points = [
    { x: 360, y: 600, label: "Madera en contacto con el suelo", color: DANGER },
    { x: 1080, y: 470, label: "Cerca de humedad (canilla, bajada)", color: GOLD },
    { x: 720, y: 300, label: "Oscuro y sin ventilación", color: STEEL },
  ];

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="cold" glowY={44} bg="black">
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={0} src={SFX.ui4} volume={0.4} />
        <Eyebrow opacity={enter}>{eyebrow}</Eyebrow>

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* suelo */}
          <rect x={0} y={640} width={BOX_W} height={120} fill="#2a2118" opacity={enter} />
          <line x1={0} y1={640} x2={BOX_W} y2={640} stroke={`${GOLD}55`} strokeWidth={2} />
          {/* casa: cuerpo */}
          <g opacity={enter}>
            <rect x={300} y={360} width={900} height={280} fill="#1c1a22" stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
            {/* techo */}
            <path d={`M 270 360 L 750 180 L 1230 360 Z`} fill="#241f17" stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
            {/* vigas internas */}
            {[450, 600, 900, 1050].map((vx, i) => (
              <line key={i} x1={vx} y1={360} x2={vx} y2={640} stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
            ))}
            <line x1={300} y1={500} x2={1200} y2={500} stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
            {/* puerta */}
            <rect x={690} y={500} width={120} height={140} fill="#15131a" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
          </g>

          {/* puntos críticos pulsando */}
          {points.map((p, i) => {
            const s = spring({ frame: frame - (20 + i * 24), fps, config: { damping: 16, mass: 0.7 } });
            const pulse = loopT(frame, 46, i * 10);
            return (
              <g key={i} opacity={s}>
                <circle cx={p.x} cy={p.y} r={26 + pulse * 46} fill="none" stroke={p.color} strokeWidth={3} opacity={(1 - pulse) * 0.9} />
                <circle cx={p.x} cy={p.y} r={20} fill={`${p.color}33`} stroke={p.color} strokeWidth={3} />
                <text x={p.x} y={p.y + 7} textAnchor="middle" fontSize={26} fontWeight={900} fill={p.color} fontFamily={FONT_STACK}>{i + 1}</text>
              </g>
            );
          })}
        </svg>

        {/* leyenda de puntos */}
        <div style={{ position: "absolute", left: 40, top: 70, display: "flex", flexDirection: "column", gap: 14 }}>
          {points.map((p, i) => {
            const s = spring({ frame: frame - (26 + i * 24), fps, config: { damping: 18, mass: 0.8 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity: s, transform: `translateX(${(1 - s) * -24}px)` }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: `${p.color}22`, border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: p.color, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 26, fontWeight: 700, color: COLORS.text }}>{p.label}</span>
                <SfxCue at={26 + i * 24} src={SFX.pop2} volume={0.34} />
              </div>
            );
          })}
        </div>

        <Caption opacity={enter}>{caption}</Caption>
      </div>
    </SceneFrame>
  );
};

// ── 7) LÍNEA DE TIEMPO — el borato no es nuevo (1938 → hoy) ────────────────────
export const BoraxTimeline: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  milestones?: { year: string; label: string }[];
}> = ({
  durationInFrames,
  eyebrow = "Esto se sabe desde hace 80 años",
  milestones = [
    { year: "1938", label: "Primera patente de tratamiento con borato" },
    { year: "1940s", label: "El mecanismo ya era conocido" },
    { year: "1970s", label: "Hawái trata toda su madera estructural" },
    { year: "Hoy", label: "Mismo producto, distinto packaging y precio" },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22, mass: 0.9 } });
  const BOX_W = 1540;
  const BOX_H = 620;
  const y = BOX_H * 0.5;
  const x0 = 130;
  const x1 = BOX_W - 130;
  const line = interpolate(frame, [8, 46], [0, 1], { extrapolateRight: "clamp" }) * enter;

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="cold" glowY={46} bg="black">
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={0} src={SFX.whoosh} volume={0.4} />
        <Eyebrow opacity={enter}>{eyebrow}</Eyebrow>

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <line x1={x0} y1={y} x2={interpolate(line, [0, 1], [x0, x1])} y2={y} stroke={GOLD} strokeWidth={5} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${GOLD}aa)` }} />
        </svg>

        {milestones.map((m, i) => {
          const px = x0 + (i / (milestones.length - 1)) * (x1 - x0);
          const s = spring({ frame: frame - (40 + i * 18), fps, config: { damping: 16, mass: 0.7 } });
          const up = i % 2 === 0;
          const bob = Math.sin(frame / 20 + i) * 4;
          return (
            <div key={i}>
              <div style={{ position: "absolute", left: px, top: y - 13, width: 26, height: 26, borderRadius: 99, background: GOLD, transform: `translate(-50%,0) scale(${s})`, boxShadow: `0 0 18px ${GOLD}`, opacity: s }} />
              <div style={{ position: "absolute", left: px, top: up ? y - 150 + bob : y + 40 + bob, transform: `translate(-50%, 0) scale(${0.8 + s * 0.2})`, opacity: s, width: 280, textAlign: "center" }}>
                <div style={{ fontSize: 46, fontWeight: 900, color: GOLD }}>{m.year}</div>
                <div style={{ fontSize: 23, fontWeight: 700, color: COLORS.textSoft, marginTop: 4, lineHeight: 1.2 }}>{m.label}</div>
              </div>
              <SfxCue at={40 + i * 18} src={SFX.pop3} volume={0.34} />
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};

// ── 8) TRES MÉTODOS — tarjetas numeradas (líquido · polvo · cebo) ──────────────
export const ThreeMethods: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
}> = ({ durationInFrames, eyebrow = "Tres métodos · una sola caja" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.9 } });

  const methods = [
    { n: "1", title: "Líquido", sub: "Madera expuesta", desc: "300 g en 10 L · pulverizás dos manos", col: GOLD, icon: "spray" },
    { n: "2", title: "Polvo seco", sub: "Grietas y juntas", desc: "Fuelle: soplás el polvo en cada hueco", col: COLORS.amber, icon: "dust" },
    { n: "3", title: "Cebo", sub: "Colonia activa", desc: "2 azúcar : 1 borax · pasta junto a la galería", col: GOOD, icon: "bait" },
  ];

  const MiniIcon: React.FC<{ kind: string; col: string }> = ({ kind, col }) => {
    const wob = Math.sin(frame / 12) * 4;
    return (
      <svg width={110} height={110} viewBox="0 0 110 110">
        {kind === "spray" && (
          <g stroke={col} strokeWidth={4} fill="none" strokeLinecap="round">
            <rect x={42} y={40} width={30} height={50} rx={6} fill={`${col}22`} />
            <path d={`M 42 50 L 30 50 L 30 42 L 42 42`} />
            <rect x={50} y={24} width={14} height={16} rx={3} fill={`${col}22`} />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={20 - i * 4} cy={40 + i * 6 + wob} r={2.6} fill={col} stroke="none" />
            ))}
          </g>
        )}
        {kind === "dust" && (
          <g stroke={col} strokeWidth={4} fill="none" strokeLinecap="round">
            <path d={`M 35 55 Q 20 55 20 45 Q 20 35 35 40 L 60 48 L 60 62 Z`} fill={`${col}22`} />
            <line x1={60} y1={55} x2={88} y2={55} />
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={82 + (i % 2) * 6} cy={48 + i * 5 + wob} r={2.4} fill={col} stroke="none" />
            ))}
          </g>
        )}
        {kind === "bait" && (
          <g stroke={col} strokeWidth={4} fill="none" strokeLinecap="round">
            <ellipse cx={55} cy={70} rx={34} ry={10} fill={`${col}22`} />
            <path d={`M 30 70 Q 55 ${44 + wob} 80 70`} />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={42 + i * 13} cy={68} r={3} fill={col} stroke="none" />
            ))}
          </g>
        )}
      </svg>
    );
  };

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="cold" glowY={44} bg="grid">
      <div style={{ fontFamily: FONT_STACK, textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 6, textTransform: "uppercase", color: COLORS.textDim, marginBottom: 40, opacity: enter }}>{eyebrow}</div>
        <div style={{ display: "flex", gap: 44, justifyContent: "center" }}>
          {methods.map((m, i) => {
            const s = stagger(frame, fps, i, 18, 10);
            const d = drift(frame, i * 3 + 1, 0.5, 6);
            return (
              <div key={i} style={{ ...glass("dark"), width: 420, height: 470, borderRadius: 30, padding: "36px 32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", opacity: s, transform: `translateY(${(1 - s) * 60 + d.y}px) scale(${0.92 + s * 0.08})`, border: `1px solid ${m.col}55`, boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 50px ${m.col}1f` }}>
                <div style={{ width: 70, height: 70, borderRadius: 20, background: `${m.col}22`, border: `2px solid ${m.col}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 900, color: m.col, boxShadow: `0 0 24px ${m.col}55` }}>{m.n}</div>
                <div style={{ marginTop: 18 }}><MiniIcon kind={m.icon} col={m.col} /></div>
                <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.text, marginTop: 8 }}>{m.title}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: m.col, marginTop: 6, letterSpacing: 1, textTransform: "uppercase" }}>{m.sub}</div>
                <div style={{ fontSize: 25, fontWeight: 600, color: COLORS.textSoft, marginTop: 16, lineHeight: 1.3 }}>{m.desc}</div>
                <SfxCue at={10 + i * 18} src={SFX.pop1} volume={0.36} />
              </div>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};

// ── 9) SAFE-VS-TOXIC — borax seguro vs neurotóxicos de la fumigadora ──────────
export const SafetyGrid: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
}> = ({ durationInFrames, eyebrow = "Lo que mata · lo que NO mata" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.9 } });

  const safe = ["Perros", "Abejas", "Lombrices", "Chicos descalzos"];
  const toxic = ["Abejas", "Mariquitas", "Lombrices", "Pájaros"];

  const Col: React.FC<{
    title: string;
    chem: string;
    items: string[];
    col: string;
    ok: boolean;
    delay: number;
  }> = ({ title, chem, items, col, ok, delay }) => {
    const inn = spring({ frame: frame - delay, fps, config: { damping: 18, mass: 0.8 } });
    const d = drift(frame, delay, 0.5, 6);
    return (
      <div style={{ ...glass("dark"), width: 580, padding: "36px 36px 30px", borderRadius: 28, opacity: inn, transform: `translateY(${(1 - inn) * 44 + d.y}px)`, border: `1px solid ${col}66`, boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 50px ${col}1f` }}>
        <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.text }}>{title}</div>
        <div style={{ fontSize: 23, fontWeight: 700, color: col, marginTop: 4, marginBottom: 22 }}>{chem}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((it, i) => {
            const s = spring({ frame: frame - (delay + 10 + i * 8), fps, config: { damping: 18, mass: 0.7 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: s, transform: `translateX(${(1 - s) * -22}px)` }}>
                <span style={{ width: 40, height: 40, borderRadius: 10, background: `${col}22`, border: `2px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {ok ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 12.5l5 5L20 6.5" stroke={col} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={col} strokeWidth="3.4" strokeLinecap="round" /></svg>
                  )}
                </span>
                <span style={{ fontSize: 30, fontWeight: 700, color: COLORS.text }}>{it}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="cold" glowY={46} bg="black">
      <div style={{ fontFamily: FONT_STACK, position: "relative", width: 1340 }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 6, textTransform: "uppercase", color: COLORS.textDim, textAlign: "center", marginBottom: 40, opacity: enter }}>{eyebrow}</div>
        <div style={{ display: "flex", gap: 60, justifyContent: "center" }}>
          <Col title="BORAX" chem="No le hace nada a:" items={safe} col={GOOD} ok delay={6} />
          <Col title="Fumigación" chem="Fipronil · bifentrina · midacloprid — también matan a:" items={toxic} col={DANGER} ok={false} delay={22} />
        </div>
        <SfxCue at={6} src={SFX.ui2} volume={0.4} />
        <SfxCue at={22} src={SFX.ui5} volume={0.4} />
      </div>
    </SceneFrame>
  );
};

// ── 10) PHOTO BURST — ráfaga de fotos sincronizada al VO, con flash + shutter ──
// Para enumeraciones rápidas ("traté las vigas, los postes, los marcos…"): una
// foto por ítem, corte duro con punch-zoom + destello blanco + sonido de obturador.
// Fondo = la MISMA foto blureada y oscura (profundidad, Regla feedback). El sonido
// va horneado adentro (shutter por foto + whoosh2 al abrir) para que quede atado.
export const PhotoBurst: React.FC<{
  durationInFrames: number;
  shots: { name: string; label: string; at: number }[];
  eyebrow?: string;
}> = ({ durationInFrames, shots, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let active = 0;
  for (let i = 0; i < shots.length; i++) {
    if (frame >= Math.round(shots[i].at * fps)) active = i;
  }
  const s = shots[active];
  const startF = Math.round(s.at * fps);
  const local = frame - startF;

  const enter = spring({ frame: local, fps, config: { damping: 16, mass: 0.55 } });
  const scale = interpolate(enter, [0, 1], [1.16, 1.0]);
  const flash = interpolate(local, [0, 5], [0.85, 0], { extrapolateRight: "clamp" });
  const shake = Math.sin(local * 0.9) * Math.max(0, 1 - local / 8) * 6;
  const labelIn = spring({ frame: local - 3, fps, config: { damping: 18 } });

  const src = staticFile(`img/${s.name}.jpg`);
  const FRAME_W = 1240;
  const FRAME_H = 716;

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="amber" bg="black" zoom={[1.02, 1.07]} glowY={48}>
      {/* fondo: misma foto blureada y oscura → profundidad */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={src}
          style={{
            position: "absolute",
            inset: "-6%",
            width: "112%",
            height: "112%",
            objectFit: "cover",
            filter: "blur(34px) brightness(0.32) saturate(1.1)",
            transform: `scale(${1.08 + flash * 0.04})`,
          }}
        />
        <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 45%, transparent 40%, rgba(0,0,0,0.72) 100%)" }} />
      </AbsoluteFill>

      {/* contador + eyebrow */}
      {eyebrow && <Eyebrow opacity={0.9}>{eyebrow}</Eyebrow>}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 60,
          fontFamily: FONT_STACK,
          fontSize: 26,
          fontWeight: 900,
          letterSpacing: 2,
          color: GOLD,
          opacity: 0.95,
          zIndex: 6,
        }}
      >
        {active + 1}<span style={{ color: COLORS.textDim }}> / {shots.length}</span>
      </div>

      {/* foto nítida en marco con profundidad */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            width: FRAME_W,
            height: FRAME_H,
            transform: `scale(${scale}) translateY(${shake}px)`,
            borderRadius: 26,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow: `0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(242,169,59,${0.25 * enter})`,
          }}
        >
          <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {/* destello del obturador */}
          <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
          {/* viñeta inferior para que entre el label */}
          <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 38%)" }} />
        </div>
      </AbsoluteFill>

      {/* label del ítem */}
      <div
        style={{
          position: "absolute",
          bottom: 96,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_STACK,
          fontSize: 46,
          fontWeight: 800,
          color: "#fff",
          textShadow: "0 4px 24px rgba(0,0,0,0.8)",
          opacity: labelIn,
          transform: `translateY(${interpolate(labelIn, [0, 1], [18, 0])}px)`,
          zIndex: 6,
        }}
      >
        <span style={{ color: GOLD }}>›</span> {s.label}
      </div>

      {/* sonido: obturador por foto + whoosh al abrir */}
      {shots.map((sh, i) => (
        <SfxCue key={i} at={Math.round(sh.at * fps)} src={SFX.shutter} volume={0.55} durationInFrames={22} />
      ))}
      <SfxCue at={0} src={SFX.whoosh2} volume={0.45} durationInFrames={30} />
    </SceneFrame>
  );
};
