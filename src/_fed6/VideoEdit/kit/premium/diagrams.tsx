import React from "react";
import { interpolate } from "remotion";
import { SPR, Theme, useTheme } from "./theme";
import {
  Arrow,
  Card,
  ContactShadow,
  Display,
  Eyebrow,
  Motas,
  Panel,
  PhotoBlock,
  Stage,
  Support,
  kick,
  spread,
  useBeat,
} from "./core";

// ═══════════════════════════════════════════════════════════════════════════
// FAMILIA: DIAGRAMAS — CutawayCallouts · FlowSteps · CycleLoop · LayerStack
// ═══════════════════════════════════════════════════════════════════════════

// ── CutawayCallouts — lámina central + rótulos con líneas codo que se dibujan ─
export type Callout = {
  text: string;
  sub?: string;
  /** punto señalado dentro de la lámina, en fracción 0..1 */
  tx: number;
  ty: number;
  /** lado del rótulo */
  side?: "left" | "right";
};
export const CutawayCallouts: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  title?: string;
  image?: string;
  callouts?: Callout[];
}> = ({
  durationInFrames,
  theme,
  eyebrow = "Por dentro",
  title = "Dónde falla realmente",
  image,
  callouts = [
    { text: "Entrada de aire", sub: "acá se tapa primero", tx: 0.3, ty: 0.3, side: "left" },
    { text: "Sello de goma", sub: "se reseca en 2 años", tx: 0.72, ty: 0.42, side: "right" },
    { text: "Drenaje", sub: "el 80% de las fallas", tx: 0.5, ty: 0.78, side: "left" },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  // lámina central
  const PW = 760;
  const PH = 620;
  const PX = (1800 - PW) / 2; // coords dentro del panel (1800x960 aprox)
  const PY = 210;
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={50}>
        <div style={{ position: "absolute", top: 48, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Eyebrow theme={t}>{eyebrow}</Eyebrow>
          <Display theme={t} size={56}>{title}</Display>
        </div>
        {/* midground: la lámina */}
        <div style={{ position: "absolute", left: PX, top: PY }}>
          <PhotoBlock theme={t} src={image} seed={5} width={PW} height={PH} />
        </div>
        {/* foreground: leaders + rótulos */}
        <svg viewBox="0 0 1800 960" width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {callouts.map((c, i) => {
            const at = spread(durationInFrames, callouts.length, i);
            const px = PX + c.tx * PW;
            const py = PY + c.ty * PH;
            const left = (c.side ?? (c.tx < 0.5 ? "left" : "right")) === "left";
            const lx = left ? PX - 96 : PX + PW + 96;
            return (
              <g key={i}>
                <circle cx={px} cy={py} r={13} fill={t.color.gold} stroke={t.color.surfaceStrong} strokeWidth={4} opacity={kick(frame, fps, at, SPR.pop)} />
                <Arrow x1={lx} y1={py - 6} x2={px + (left ? -20 : 20)} y2={py} curve={left ? 26 : -26} at={at + 4} dur={16} color={t.color.ink} width={5} />
              </g>
            );
          })}
        </svg>
        {callouts.map((c, i) => {
          const at = spread(durationInFrames, callouts.length, i);
          const s = kick(frame, fps, at + 10, SPR.snappy);
          const py = PY + c.ty * PH;
          const left = (c.side ?? (c.tx < 0.5 ? "left" : "right")) === "left";
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: py - 58,
                ...(left ? { right: 1800 - PX + 100 } : { left: PX + PW + 100 }),
                opacity: s,
                transform: `translateX(${(1 - s) * (left ? 26 : -26)}px)`,
                maxWidth: 380,
              }}
            >
              <Card theme={t} accent={t.color.gold} style={{ padding: "16px 26px", textAlign: left ? "right" : "left" }}>
                <Display theme={t} size={32}>{c.text}</Display>
                {c.sub && <Support theme={t} size={23} style={{ marginTop: 4 }}>{c.sub}</Support>}
              </Card>
            </div>
          );
        })}
      </Panel>
    </Stage>
  );
};

// ── FlowSteps — proceso A→B→C con nodos que aterrizan y flechas dibujadas ────
export type FlowNode = { label: string; sub?: string; image?: string };
export const FlowSteps: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  nodes?: FlowNode[];
}> = ({
  durationInFrames,
  theme,
  title = "Del problema a la solución",
  nodes = [
    { label: "Juntar", sub: "ceniza fina" },
    { label: "Mezclar", sub: "con agua de lluvia" },
    { label: "Colar", sub: "y reposar 24 hs" },
    { label: "Aplicar", sub: "al pie de la planta" },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const n = Math.min(nodes.length, 5);
  const W = 1720;
  const cellW = W / n;
  const CY = 560;
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={16}>
        <div style={{ position: "absolute", top: 62, left: 0, right: 0, textAlign: "center" }}>
          <Display theme={t} size={58}>{title}</Display>
        </div>
        <svg viewBox="0 0 1800 960" width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {Array.from({ length: n - 1 }, (_, i) => {
            const x0 = 40 + cellW * (i + 0.5) + 128;
            const x1 = 40 + cellW * (i + 1.5) - 128;
            return <Arrow key={i} x1={x0} y1={CY - 90} x2={x1} y2={CY - 90} curve={-44} at={20 + i * 12} dur={16} color={t.color.accent} width={8} />;
          })}
        </svg>
        {nodes.slice(0, n).map((node, i) => {
          const at = spread(durationInFrames, nodes.length, i);
          const s = kick(frame, fps, at, SPR.settle);
          const cx = 40 + cellW * (i + 0.5);
          return (
            <div key={i} style={{ position: "absolute", left: cx - 150, top: CY - 240, width: 300, textAlign: "center", opacity: s, transform: `translateY(${(1 - s) * 44}px)` }}>
              <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto" }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `${t.strokeW}px solid ${t.color.ink}`,
                    boxShadow: `0 22px 40px ${t.color.shadow}`,
                    background: t.color.surfaceStrong,
                  }}
                >
                  <div style={{ position: "absolute", inset: 0 }}>
                    {node.image ? (
                      <PhotoBlock theme={t} src={node.image} width={220} height={220} radius={0} style={{ filter: "none" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(circle at 34% 28%, ${t.color.bg1}, ${t.color.bg0})`, fontFamily: t.fontDisplay, fontSize: 92, fontWeight: 900, color: t.color.accent }}>
                        {i + 1}
                      </div>
                    )}
                  </div>
                </div>
                {/* insignia de paso — solo si hay imagen (sin imagen el número YA es el centro) */}
                {node.image && (
                <div
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    width: 62,
                    height: 62,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 36% 30%, ${t.color.gold}, ${t.color.accent})`,
                    border: `3px solid ${t.color.surfaceStrong}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: t.color.onAccent,
                    fontWeight: 900,
                    fontSize: 30,
                    fontFamily: t.fontLabel,
                    boxShadow: `0 10px 20px ${t.color.shadow}`,
                  }}
                >
                  {i + 1}
                </div>
                )}
              </div>
              <ContactShadow theme={t} width={190} style={{ margin: "8px auto 0" }} />
              <Display theme={t} size={40} style={{ marginTop: 6 }}>{node.label}</Display>
              {node.sub && <Support theme={t} size={26} style={{ marginTop: 4 }}>{node.sub}</Support>}
            </div>
          );
        })}
      </Panel>
    </Stage>
  );
};

// ── CycleLoop — ciclo circular con cometa orbitando y nodos en stagger ───────
export type CycleNode = { label: string; sub?: string };
export const CycleLoop: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  center?: string;
  nodes?: CycleNode[];
}> = ({
  durationInFrames,
  theme,
  title = "El ciclo que se mantiene solo",
  center = "COMPOST",
  nodes = [
    { label: "Restos", sub: "de cocina" },
    { label: "Descompone", sub: "6 semanas" },
    { label: "Abono", sub: "listo" },
    { label: "Huerta", sub: "alimenta" },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const CX = 900;
  const CY = 545;
  const R = 310;
  const orbit = interpolate(frame, [12, durationInFrames], [0, 320], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const centerS = kick(frame, fps, 8, SPR.settle);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={84}>
        <Motas theme={t} count={12} opacity={0.35} />
        <div style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center" }}>
          <Display theme={t} size={54}>{title}</Display>
        </div>
        <svg viewBox="0 0 1800 960" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <circle cx={CX} cy={CY - 60} r={R} fill="none" stroke={t.color.line} strokeWidth={3} strokeDasharray="4 16" />
          {/* cometa orbital con estela */}
          {Array.from({ length: 7 }, (_, k) => {
            const a = ((orbit - k * 5) * Math.PI) / 180 - Math.PI / 2;
            return (
              <circle
                key={k}
                cx={CX + Math.cos(a) * R}
                cy={CY - 60 + Math.sin(a) * R}
                r={11 - k * 1.3}
                fill={t.color.gold}
                opacity={(1 - k / 7) * 0.9}
              />
            );
          })}
        </svg>
        {/* centro */}
        <div
          style={{
            position: "absolute",
            left: CX - 130,
            top: CY - 60 - 130,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: `radial-gradient(circle at 36% 28%, ${t.color.bg2}, ${t.color.bg0})`,
            border: `3px solid ${t.color.gold}`,
            boxShadow: `0 26px 50px ${t.color.shadow}, inset 0 0 40px ${t.color.shadow}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: centerS,
            transform: `scale(${0.8 + centerS * 0.2})`,
          }}
        >
          <Display theme={t} size={42} color={t.color.gold}>{center}</Display>
        </div>
        {nodes.slice(0, 6).map((node, i) => {
          const count = Math.min(nodes.length, 6);
          const a = (i / count) * Math.PI * 2 - Math.PI / 2;
          const nx = CX + Math.cos(a) * R;
          const ny = CY - 60 + Math.sin(a) * R;
          const at = 14 + i * 10;
          const s = kick(frame, fps, at, SPR.snappy);
          return (
            <div key={i} style={{ position: "absolute", left: nx - 132, top: ny - 62, width: 264, opacity: s, transform: `scale(${0.8 + s * 0.2})` }}>
              <Card theme={t} accent={t.color.accent} style={{ padding: "14px 22px", textAlign: "center" }}>
                <Display theme={t} size={33}>{node.label}</Display>
                {node.sub && <Support theme={t} size={23}>{node.sub}</Support>}
              </Card>
            </div>
          );
        })}
      </Panel>
    </Stage>
  );
};

// ── LayerStack — ensamblado por capas: planos 3D que caen y se apilan ────────
export type StackLayer = { label: string; color?: string };
export const LayerStack: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  layers?: StackLayer[];
}> = ({
  durationInFrames,
  theme,
  title = "Las capas, en orden",
  layers = [
    { label: "Tierra negra" },
    { label: "Compost maduro" },
    { label: "Ramas finas" },
    { label: "Troncos gruesos" },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const colors = [t.color.accent, t.color.gold, t.color.accent2, t.color.accentSoft, t.color.good];
  const n = layers.length;
  const CX = 660;
  const BASE_Y = 700;
  const LH = 92; // separación vertical entre capas apiladas
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={30}>
        <div style={{ position: "absolute", top: 58, left: 120 }}>
          <Eyebrow theme={t}>Cómo se arma</Eyebrow>
          <Display theme={t} size={58} style={{ marginTop: 10 }}>{title}</Display>
        </div>
        {/* las capas caen desde arriba, la de abajo primero (índice n-1) */}
        {layers.map((ly, i) => {
          const fromBottom = n - 1 - i; // 0 = capa de abajo
          const at = spread(durationInFrames, layers.length, fromBottom);
          const s = kick(frame, fps, at, SPR.settle);
          const y = BASE_Y - fromBottom * LH;
          const col = ly.color ?? colors[i % colors.length];
          const drop = (1 - s) * -260;
          const labelS = kick(frame, fps, at + 10, SPR.snappy);
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: CX - 330, top: y + drop, opacity: s, filter: `drop-shadow(0 ${18 + fromBottom * 4}px 24px ${t.color.shadow})` }}>
                {/* plano isométrico (rombo) con cara lateral = profundidad real */}
                <svg viewBox="0 0 660 210" width={660} height={210}>
                  <path d={`M 330 10 L 640 92 L 330 174 L 20 92 Z`} fill={col} stroke={t.color.ink} strokeWidth={3} />
                  <path d={`M 20 92 L 330 174 L 330 206 L 20 124 Z`} fill={col} style={{ filter: "brightness(0.72)" }} stroke={t.color.ink} strokeWidth={2} />
                  <path d={`M 640 92 L 330 174 L 330 206 L 640 124 Z`} fill={col} style={{ filter: "brightness(0.55)" }} stroke={t.color.ink} strokeWidth={2} />
                  <path d={`M 330 10 L 640 92 L 330 174 L 20 92 Z`} fill="rgba(255,255,255,0.14)" opacity={0.6} />
                </svg>
              </div>
              <div style={{ position: "absolute", left: CX + 380, top: y + 40, opacity: labelS, transform: `translateX(${(1 - labelS) * -24}px)`, display: "flex", alignItems: "center", gap: 18 }}>
                <svg viewBox="0 0 90 12" width={90} height={12}>
                  <line x1={0} y1={6} x2={86} y2={6} stroke={col} strokeWidth={5} strokeLinecap="round" />
                </svg>
                <div>
                  <Display theme={t} size={38}>{ly.label}</Display>
                  <Support theme={t} size={23} color={t.color.textDim}>capa {n - i} de {n}</Support>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <ContactShadow theme={t} width={720} opacity={0.5} style={{ position: "absolute", left: CX - 360, top: BASE_Y + 176 }} />
      </Panel>
    </Stage>
  );
};
