import React from "react";
import { SPR, Theme, useTheme } from "./theme";
import {
  Card,
  Display,
  Eyebrow,
  Panel,
  PhotoBlock,
  Stage,
  Stroke,
  Support,
  Tick,
  kick,
  spread,
  useBeat,
} from "./core";

// ═══════════════════════════════════════════════════════════════════════════
// FAMILIA: LISTAS — NumberedSteps · ChecklistReveal · BulletCascade
// ═══════════════════════════════════════════════════════════════════════════

// ── NumberedSteps — pasos con espina de tinta vertical + medallas numeradas ──
export type Step = { title: string; sub?: string; image?: string };
export const NumberedSteps: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  title?: string;
  steps?: Step[];
}> = ({
  durationInFrames,
  theme,
  eyebrow = "Paso a paso",
  title = "Se hace una sola vez",
  steps = [
    { title: "Marcá el contorno", sub: "con estacas y soga" },
    { title: "Cavá 40 cm", sub: "guardando la tierra buena" },
    { title: "Rellená por capas", sub: "grueso abajo, fino arriba" },
    { title: "Regá y esperá", sub: "una semana antes de plantar" },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const rowH = 148;
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={82}>
        <div style={{ position: "absolute", top: 56, left: 130 }}>
          <Eyebrow theme={t}>{eyebrow}</Eyebrow>
          <Display theme={t} size={58} style={{ marginTop: 10 }}>{title}</Display>
        </div>
        <div style={{ position: "absolute", top: 224, left: 130, right: 130 }}>
          {/* espina de tinta que baja conectando los pasos */}
          <svg viewBox={`0 0 20 ${steps.length * rowH}`} width={20} height={steps.length * rowH} style={{ position: "absolute", left: 48, top: 10 }}>
            <Stroke d={`M 10 6 L 10 ${steps.length * rowH - rowH + 40}`} at={10} dur={46} color={t.color.accent} width={5} length={steps.length * rowH} />
          </svg>
          {steps.map((st, i) => {
            const at = spread(durationInFrames, steps.length, i);
            const s = kick(frame, fps, at, SPR.settle);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, height: rowH, opacity: s, transform: `translateX(${(1 - s) * -36}px)` }}>
                <div
                  style={{
                    position: "relative",
                    width: 104,
                    height: 104,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 34% 28%, ${t.color.gold}, ${t.color.accent} 82%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: t.fontDisplay,
                    fontWeight: 900,
                    fontSize: 48,
                    color: t.color.onAccent,
                    flexShrink: 0,
                    boxShadow: `0 16px 30px ${t.color.shadow}, inset 0 -6px 12px rgba(0,0,0,0.25)`,
                    textShadow: "0 2px 6px rgba(0,0,0,0.3)",
                    zIndex: 1,
                  }}
                >
                  <div style={{ position: "absolute", inset: -7, borderRadius: "50%", border: `2px solid ${t.color.accent}`, opacity: 0.4 }} />
                  {i + 1}
                </div>
                {st.image && (
                  <PhotoBlock theme={t} src={st.image} seed={i + 40} width={170} height={116} radius={t.radius * 0.6} style={{ flexShrink: 0 }} />
                )}
                <Card theme={t} style={{ flex: 1, padding: "18px 32px", display: "flex", alignItems: "baseline", gap: 22 }}>
                  <Display theme={t} size={40}>{st.title}</Display>
                  {st.sub && <Support theme={t} size={28} color={t.color.textDim}>{st.sub}</Support>}
                </Card>
              </div>
            );
          })}
        </div>
      </Panel>
    </Stage>
  );
};

// ── ChecklistReveal — tarjeta con tildes que se DIBUJAN una a una ────────────
export const ChecklistReveal: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  items?: string[];
  stamp?: string;
}> = ({
  durationInFrames,
  theme,
  title = "Antes de empezar, tené esto",
  items = ["Guantes gruesos", "Balde de 20 litros", "Vinagre blanco", "Un día sin lluvia"],
  stamp = "TODO LISTO",
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const stampAt = spread(durationInFrames, items.length, items.length) + 8;
  const stampS = kick(frame, fps, stampAt, SPR.slam);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={74}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative" }}>
            <Card theme={t} strong style={{ width: 1000, padding: "50px 64px" }}>
              <Display theme={t} size={52} style={{ marginBottom: 34 }}>{title}</Display>
              <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
                {items.map((it, i) => {
                  const at = spread(durationInFrames, items.length, i);
                  const s = kick(frame, fps, at, SPR.snappy);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, opacity: s, transform: `translateX(${(1 - s) * -26}px)` }}>
                      <Tick at={at + 6} color={t.color.good} size={58} />
                      <Display theme={t} size={40} style={{ fontWeight: 600 }}>{it}</Display>
                      <div style={{ flex: 1, borderBottom: `2px dotted ${t.color.line}`, marginLeft: 8, transform: "translateY(10px)" }} />
                    </div>
                  );
                })}
              </div>
            </Card>
            {/* sello diagonal al completar */}
            <div
              style={{
                position: "absolute",
                right: -60,
                top: -46,
                transform: `rotate(-14deg) scale(${stampS})`,
                opacity: Math.min(1, stampS * 1.6),
                border: `6px solid ${t.color.good}`,
                borderRadius: 14,
                padding: "10px 30px",
                fontFamily: t.fontLabel,
                fontWeight: 900,
                fontSize: 44,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: t.color.good,
                background: t.color.surface,
                boxShadow: `0 18px 40px ${t.color.shadow}`,
              }}
            >
              {stamp}
            </div>
          </div>
        </div>
      </Panel>
    </Stage>
  );
};

// ── BulletCascade — 3 ideas grandes en cascada con keyword acentuada ─────────
export type Bullet = { pre?: string; key: string; post?: string };
export const BulletCascade: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  bullets?: Bullet[];
}> = ({
  durationInFrames,
  theme,
  eyebrow = "Lo que tenés que saber",
  bullets = [
    { pre: "No es la humedad,", key: "es el drenaje", post: "" },
    { pre: "No es el precio,", key: "es la mezcla", post: "" },
    { pre: "No es magia,", key: "es química simple", post: "" },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={18}>
        <div style={{ position: "absolute", top: 92, left: 150 }}>
          <Eyebrow theme={t} size={30}>{eyebrow}</Eyebrow>
        </div>
        <div style={{ position: "absolute", top: 210, left: 150, right: 150, display: "flex", flexDirection: "column", gap: 62 }}>
          {bullets.map((b, i) => {
            const at = spread(durationInFrames, bullets.length, i);
            const s = kick(frame, fps, at, SPR.settle);
            const hl = kick(frame, fps, at + 10, SPR.soft);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 34, opacity: s, transform: `translateY(${(1 - s) * 34}px)` }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: t.color.gold,
                    boxShadow: `0 0 0 ${8 * s}px ${t.color.gold}22, 0 6px 14px ${t.color.shadow}`,
                    flexShrink: 0,
                  }}
                />
                <div style={{ fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontSize: 66, lineHeight: 1.15, color: t.color.text }}>
                  {b.pre && <span style={{ color: t.color.textSoft, fontWeight: 500 }}>{b.pre} </span>}
                  <span style={{ position: "relative", whiteSpace: "nowrap" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: -8,
                        right: -8,
                        bottom: 2,
                        height: "48%",
                        background: t.color.accent,
                        opacity: 0.32,
                        borderRadius: 8,
                        transform: `scaleX(${hl})`,
                        transformOrigin: "left center",
                      }}
                    />
                    <span style={{ position: "relative", color: t.color.text }}>{b.key}</span>
                  </span>
                  {b.post && <span style={{ color: t.color.textSoft, fontWeight: 500 }}> {b.post}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </Stage>
  );
};
