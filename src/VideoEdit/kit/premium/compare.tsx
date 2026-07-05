import React from "react";
import { interpolate } from "remotion";
import { SPR, Theme, useTheme } from "./theme";
import {
  Burst,
  Card,
  ContactShadow,
  Cross,
  Display,
  Eyebrow,
  ImgOr,
  Odo,
  Panel,
  PhotoBlock,
  Stage,
  Support,
  Tick,
  kick,
  useBeat,
} from "./core";

// ═══════════════════════════════════════════════════════════════════════════
// FAMILIA: COMPARACIÓN — VsDuel · BeforeAfter · DuelColumns · TierRanking
// ═══════════════════════════════════════════════════════════════════════════

export type VsSide = {
  label: string;
  sub?: string;
  image?: string;
  value?: number;
  unit?: string;
  good?: boolean;
};

// ── VsDuel — dos contendientes cara a cara con medallón VS que ESTAMPA ───────
export const VsDuel: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  title?: string;
  left?: VsSide;
  right?: VsSide;
}> = ({
  durationInFrames,
  theme,
  eyebrow = "Frente a frente",
  title = "¿Cuál conviene de verdad?",
  left = { label: "Comprado", sub: "$60.000 por temporada", value: 60000, unit: "$", good: false },
  right = { label: "Casero", sub: "una tarde de trabajo", value: 900, unit: "$", good: true },
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const VS_AT = 22;
  const vsS = kick(frame, fps, VS_AT, SPR.slam);

  const Side: React.FC<{ side: VsSide; at: number; flip?: boolean }> = ({ side, at, flip }) => {
    const s = kick(frame, fps, at, SPR.settle);
    const accent = side.good === undefined ? t.color.accent : side.good ? t.color.good : t.color.danger;
    return (
      <div
        style={{
          opacity: s,
          transform: `translateX(${(1 - s) * (flip ? 70 : -70)}px)`,
          textAlign: "center",
          width: 560,
        }}
      >
        <PhotoBlock theme={t} src={side.image} seed={at} width={560} height={370} accent={accent}>
          {side.good !== undefined && (
            <div style={{ position: "absolute", top: 16, left: 16 }}>
              {side.good ? <Tick at={at + 16} color={t.color.good} size={64} /> : <Cross at={at + 16} color={t.color.danger} size={64} />}
            </div>
          )}
        </PhotoBlock>
        <Display theme={t} size={52} style={{ marginTop: 22 }}>{side.label}</Display>
        {side.value !== undefined && (
          <div style={{ marginTop: 6 }}>
            <Odo theme={t} value={side.value} prefix={side.unit === "$" ? "$" : ""} suffix={side.unit !== "$" ? side.unit : ""} size={68} color={accent} at={at + 10} />
          </div>
        )}
        {side.sub && <Support theme={t} size={27} style={{ marginTop: 6 }}>{side.sub}</Support>}
      </div>
    );
  };

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={30}>
        <div style={{ position: "absolute", top: 56, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Eyebrow theme={t}>{eyebrow}</Eyebrow>
          <Display theme={t} size={62}>{title}</Display>
        </div>
        <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 130 }}>
          <Side side={left} at={8} />
          <Side side={right} at={16} flip />
        </div>
        {/* medallón VS que cae y estampa con polvo */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 400,
            transform: `translateX(-50%) scale(${vsS}) rotate(${(1 - vsS) * -24}deg)`,
            opacity: Math.min(1, vsS * 2),
          }}
        >
          <div style={{ position: "relative", width: 150, height: 150 }}>
            <Burst at={VS_AT + 3} color={t.color.gold} size={150} />
            <div
              style={{
                position: "absolute",
                inset: 8,
                borderRadius: "50%",
                background: `radial-gradient(circle at 36% 30%, ${t.color.gold}, ${t.color.accent} 78%)`,
                border: `4px solid ${t.color.surfaceStrong}`,
                boxShadow: `0 20px 40px ${t.color.shadow}, inset 0 -8px 18px rgba(0,0,0,0.3)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: t.fontDisplay,
                fontWeight: 900,
                fontSize: 56,
                color: t.color.onAccent,
                textShadow: "0 2px 6px rgba(0,0,0,0.35)",
              }}
            >
              VS
            </div>
          </div>
        </div>
      </Panel>
    </Stage>
  );
};

// ── BeforeAfter — barrido: la cortina "después" cruza y revela el cambio ─────
export const BeforeAfter: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeImage?: string;
  afterImage?: string;
  caption?: string;
}> = ({
  durationInFrames,
  theme,
  eyebrow = "El cambio",
  beforeLabel = "Antes",
  afterLabel = "Después",
  beforeImage,
  afterImage,
  caption = "El mismo lugar, 3 semanas más tarde",
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const W = 1460;
  const H = 700;
  // el divisor barre de derecha a izquierda y se asienta al 50%
  const sweep = interpolate(frame, [14, 58], [0.985, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wipe = sweep * W;
  const tagB = kick(frame, fps, 20, SPR.snappy);
  const tagA = kick(frame, fps, 46, SPR.snappy);
  const capS = kick(frame, fps, 58, SPR.settle);

  const Tag: React.FC<{ label: string; accent: string; s: number; right?: boolean }> = ({ label, accent, s, right }) => (
    <div
      style={{
        position: "absolute",
        top: 26,
        ...(right ? { right: 26 } : { left: 26 }),
        opacity: s,
        transform: `translateY(${(1 - s) * -14}px)`,
        background: accent,
        color: t.color.onAccent,
        fontFamily: t.fontLabel,
        fontWeight: 800,
        fontSize: 30,
        letterSpacing: t.labelSpacing,
        textTransform: t.upperLabels ? "uppercase" : "none",
        padding: "10px 26px",
        borderRadius: t.radius * 0.6,
        boxShadow: `0 12px 26px ${t.color.shadow}`,
      }}
    >
      {label}
    </div>
  );

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={78}>
        <div style={{ position: "absolute", top: 48, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Eyebrow theme={t}>{eyebrow}</Eyebrow>
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 118,
            transform: "translateX(-50%)",
            width: W,
            height: H,
            borderRadius: t.radius + 6,
            overflow: "hidden",
            border: `${t.strokeW}px solid ${t.color.ink}`,
            boxShadow: `0 34px 70px ${t.color.shadow}`,
          }}
        >
          {/* capa DESPUÉS de base (se descubre a la derecha del divisor) */}
          <div style={{ position: "absolute", inset: 0 }}>
            <ImgOr src={afterImage} seed={31} theme={t} />
          </div>
          {/* capa ANTES clipeada hasta el divisor, con grade apagado */}
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${W - wipe}px 0 0)` }}>
            <div style={{ position: "absolute", inset: 0, filter: "saturate(0.45) brightness(0.82) sepia(0.22)" }}>
              <ImgOr src={beforeImage} seed={12} theme={t} />
            </div>
          </div>
          {/* divisor con manija */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: wipe - 3,
              width: 6,
              background: t.color.gold,
              boxShadow: `0 0 26px ${t.color.glow}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: wipe,
              transform: "translate(-50%, -50%)",
              width: 74,
              height: 74,
              borderRadius: "50%",
              background: `radial-gradient(circle at 36% 30%, ${t.color.gold}, ${t.color.accent})`,
              border: `4px solid ${t.color.surfaceStrong}`,
              boxShadow: `0 14px 30px ${t.color.shadow}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: t.color.onAccent,
              fontWeight: 900,
              fontSize: 30,
              fontFamily: t.fontLabel,
            }}
          >
            ⇄
          </div>
          <Tag label={beforeLabel} accent={t.color.danger} s={tagB} />
          <Tag label={afterLabel} accent={t.color.good} s={tagA} right />
        </div>
        <div style={{ position: "absolute", bottom: 44, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: capS, transform: `translateY(${(1 - capS) * 16}px)` }}>
          <Card theme={t} style={{ padding: "16px 42px" }}>
            <Support theme={t} size={30} color={t.color.text}>{caption}</Support>
          </Card>
        </div>
      </Panel>
    </Stage>
  );
};

// ── DuelColumns — tabla de atributos con ganador por fila (ticks/cruces) ─────
export type DuelRow = { attr: string; leftWins: boolean };
export const DuelColumns: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  leftName?: string;
  rightName?: string;
  rows?: DuelRow[];
}> = ({
  durationInFrames,
  theme,
  title = "Punto por punto",
  leftName = "Química",
  rightName = "Remedio casero",
  rows = [
    { attr: "Precio", leftWins: false },
    { attr: "Velocidad", leftWins: true },
    { attr: "Seguridad", leftWins: false },
    { attr: "Duración", leftWins: false },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }}>
        <div style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center" }}>
          <Display theme={t} size={60}>{title}</Display>
        </div>
        <div style={{ position: "absolute", top: 196, left: "50%", transform: "translateX(-50%)", width: 1280 }}>
          {/* header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px 300px", gap: 18, marginBottom: 16, alignItems: "center" }}>
            <div />
            {[leftName, rightName].map((n, i) => {
              const s = kick(frame, fps, 6 + i * 5, SPR.settle);
              return (
                <div key={i} style={{ opacity: s, transform: `translateY(${(1 - s) * -12}px)` }}>
                  <Card theme={t} accent={i === 0 ? t.color.accent2 : t.color.accent} style={{ padding: "14px 10px", textAlign: "center" }}>
                    <Display theme={t} size={33} color={i === 0 ? t.color.accent2 : t.color.accent}>{n}</Display>
                  </Card>
                </div>
              );
            })}
          </div>
          {rows.map((r, i) => {
            const at = 16 + i * 9;
            const s = kick(frame, fps, at, SPR.snappy);
            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 300px 300px",
                  gap: 18,
                  alignItems: "center",
                  opacity: s,
                  transform: `translateX(${(1 - s) * -34}px)`,
                  padding: "30px 0",
                  borderBottom: i < rows.length - 1 ? `1.5px solid ${t.color.line}` : "none",
                }}
              >
                <Display theme={t} size={44}>{r.attr}</Display>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {r.leftWins ? <Tick at={at + 6} color={t.color.good} /> : <Cross at={at + 6} color={t.color.danger} />}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {r.leftWins ? <Cross at={at + 9} color={t.color.danger} /> : <Tick at={at + 9} color={t.color.good} />}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </Stage>
  );
};

// ── TierRanking — podio S/A/B/C: filas de tier con items que aterrizan ───────
export type TierRow = { tier: string; color?: string; items: string[] };
export const TierRanking: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  rows?: TierRow[];
}> = ({
  durationInFrames,
  theme,
  title = "Ranking final",
  rows = [
    { tier: "S", items: ["Vinagre blanco", "Bicarbonato"] },
    { tier: "A", items: ["Bórax", "Cal apagada"] },
    { tier: "B", items: ["Sal gruesa"] },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const tierColors = [t.color.gold, t.color.accent, t.color.accent2, t.color.textDim];
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={22}>
        <div style={{ position: "absolute", top: 52, left: 110 }}>
          <Eyebrow theme={t}>Del mejor al peor</Eyebrow>
          <Display theme={t} size={62} style={{ marginTop: 10 }}>{title}</Display>
        </div>
        <div style={{ position: "absolute", top: 246, left: 110, right: 110, display: "flex", flexDirection: "column", gap: 34 }}>
          {rows.map((row, i) => {
            const at = 12 + i * 12;
            const s = kick(frame, fps, at, SPR.settle);
            const col = row.color ?? tierColors[i % tierColors.length];
            return (
              <div key={i} style={{ display: "flex", gap: 24, alignItems: "stretch", opacity: s, transform: `translateX(${(1 - s) * -50}px)` }}>
                <div
                  style={{
                    width: 152,
                    borderRadius: t.radius,
                    background: `linear-gradient(150deg, ${col}, ${col}CC)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: t.fontDisplay,
                    fontWeight: 900,
                    fontSize: 76,
                    color: t.color.onAccent,
                    boxShadow: `0 18px 36px ${t.color.shadow}, inset 0 -6px 14px rgba(0,0,0,0.25)`,
                    textShadow: "0 3px 8px rgba(0,0,0,0.3)",
                    flexShrink: 0,
                  }}
                >
                  {row.tier}
                </div>
                <Card theme={t} style={{ flex: 1, display: "flex", alignItems: "center", gap: 20, padding: "28px 36px" }}>
                  {row.items.map((it, j) => {
                    const js = kick(frame, fps, at + 8 + j * 6, SPR.pop);
                    return (
                      <div
                        key={j}
                        style={{
                          opacity: js,
                          transform: `scale(${0.7 + js * 0.3})`,
                          background: t.mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(42,38,32,0.06)",
                          border: `1.5px solid ${col}`,
                          borderRadius: t.radius * 0.7,
                          padding: "12px 28px",
                          fontFamily: t.fontBody,
                          fontWeight: 700,
                          fontSize: 36,
                          color: t.color.text,
                        }}
                      >
                        {it}
                      </div>
                    );
                  })}
                </Card>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <ContactShadow theme={t} width={900} opacity={0.25} />
        </div>
      </Panel>
    </Stage>
  );
};
