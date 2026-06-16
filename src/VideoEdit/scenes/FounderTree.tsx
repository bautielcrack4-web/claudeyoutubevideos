import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";

// FounderTree — componente FULL-SCREEN animado: de 7 nodos fundadores arriba se RAMIFICA
// en vivo hacia abajo (7 → 21 → 63) hasta una población ancha. Visualiza "de 7 a miles".
// Brand-native (crema/tinta/salvia/ámbar).
const W = 1792, H = 1008;
const ROOTS = 7, FAN = 3;

type Node = { x: number; y: number; lvl: number; parent?: number };
function build(): Node[] {
  const nodes: Node[] = [];
  const rowY = [185, 500, 815];
  const spread = (count: number, m: number) => (i: number) => m + (i * (W - 2 * m)) / (count - 1);
  const xs0 = spread(ROOTS, 230);
  for (let i = 0; i < ROOTS; i++) nodes.push({ x: xs0(i), y: rowY[0], lvl: 0 });
  const xs1 = spread(ROOTS * FAN, 150);
  for (let i = 0; i < ROOTS * FAN; i++) nodes.push({ x: xs1(i), y: rowY[1], lvl: 1, parent: Math.floor(i / FAN) });
  const base1 = ROOTS;
  const xs2 = spread(ROOTS * FAN * FAN, 90);
  for (let i = 0; i < ROOTS * FAN * FAN; i++) nodes.push({ x: xs2(i), y: rowY[2], lvl: 2, parent: base1 + Math.floor(i / FAN) });
  return nodes;
}
const NODES = build();

export const FounderTree: React.FC<{ durationInFrames: number; eyebrow?: string }> = ({ durationInFrames, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: { damping: 20, stiffness: 90 } });
  const prog = interpolate(frame, [sec(0.6), durationInFrames - sec(0.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // umbrales por nivel
  const lvlA = (lvl: number) => interpolate(prog, [lvl * 0.3, lvl * 0.3 + 0.32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const COL = [COLORS.amber, COLORS.accent, COLORS.good || COLORS.accent];
  const counter = Math.round(interpolate(prog, [0.55, 1], [63, 4000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <SceneFrame durationInFrames={durationInFrames} hue="amber" glowY={36} drift={0.2}>
      <SfxCue at={sec(0.6)} src={SFX.transition} volume={0.3} />
      <SfxCue at={sec(2.2)} src={SFX.barGrow} volume={0.26} durationInFrames={sec(2)} />
      <div style={{ position: "absolute", inset: 0, fontFamily: FONT_STACK }}>
        {eyebrow && <div style={{ position: "absolute", top: 54, left: 0, right: 0, textAlign: "center", fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: COLORS.amber, opacity: head, zIndex: 4 }}>{eyebrow}</div>}
        <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {/* aristas */}
          {NODES.filter((n) => n.parent != null).map((n, i) => {
            const p = NODES[n.parent as number];
            const a = lvlA(n.lvl);
            if (a <= 0.01) return null;
            const mx = (p.x + n.x) / 2;
            const d = `M ${p.x} ${p.y} C ${mx} ${p.y + 70}, ${mx} ${n.y - 70}, ${n.x} ${n.y}`;
            return <path key={"e" + i} d={d} fill="none" stroke={`${COLORS.text}`} strokeOpacity={0.22 * a} strokeWidth={n.lvl === 1 ? 2.4 : 1.4} />;
          })}
          {/* nodos */}
          {NODES.map((n, i) => {
            const a = lvlA(n.lvl);
            if (a <= 0.01) return null;
            const r = (n.lvl === 0 ? 18 : n.lvl === 1 ? 9 : 5.5) * Math.min(1, a * 1.3);
            return <circle key={"n" + i} cx={n.x} cy={n.y} r={r} fill={COL[n.lvl]} opacity={a} style={n.lvl === 0 ? { filter: `drop-shadow(0 0 10px ${COLORS.amber})` } : undefined} />;
          })}
        </svg>
        {/* etiqueta arriba: 7 fundadores */}
        <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", opacity: head, zIndex: 4 }}>
          <span style={{ fontSize: 52, fontWeight: 800, color: COLORS.amber, textShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>7</span>
          <span style={{ fontSize: 28, color: COLORS.text, opacity: 0.85, marginLeft: 12 }}>fundadores</span>
        </div>
        {/* etiqueta abajo: miles hoy */}
        <div style={{ position: "absolute", bottom: 70, left: 0, right: 0, textAlign: "center", opacity: interpolate(prog, [0.6, 0.85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), zIndex: 4 }}>
          <span style={{ fontSize: 56, fontWeight: 800, color: COLORS.good || COLORS.accent }}>+{counter.toLocaleString("es")}</span>
          <span style={{ fontSize: 28, color: COLORS.text, opacity: 0.85, marginLeft: 12 }}>hurones, todos sus descendientes</span>
        </div>
      </div>
    </SceneFrame>
  );
};
