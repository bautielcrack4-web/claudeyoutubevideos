import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { F_INTER, F_OSWALD } from "./premium/theme";

// ═══════════════════════════════════════════════════════════════════════════
// DR. FEDERER · KIT BROADCAST — overlays tipo noticiero (lower-thirds, alertas,
// tickers, antes/después, mito vs realidad, badge de dato, callout).
// Paleta oscura de alto contraste = autoridad "en vivo" sobre el b-roll.
// RENDER-SAFE: todo determinista (useCurrentFrame). Nada depende del reloj.
// ═══════════════════════════════════════════════════════════════════════════
const INK0 = "#071216";
const INK1 = "#0E1D23";
const TEAL = "#16C7C0";
const TEALd = "#0C8B86";
const TEALhi = "#63F2EA";
const ALERT = "#FF3B30";
const ALERTd = "#B81A11";
const GOLD = "#F0B44A";
const W = "#FFFFFF";
const WSOFT = "rgba(255,255,255,0.74)";
const sf = (s?: string) => (s ? (s.startsWith("http") || s.startsWith("data:") ? s : staticFile(s)) : undefined);

// entrada spring 0→1
const useIn = (delay = 0) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping: 200, mass: 0.6 } });
};

// ícono cruz médica + pulso
const PulseCross: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = W }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M4 21h7l3-7 5 14 3-7h9" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────
// 1) LOWER-THIRD FEDERER — barra tipo "breaking news" con marca médica
// ─────────────────────────────────────────────────────────────────────────
export const LowerThirdFederer: React.FC<{ kicker?: string; title: string; subtitle?: string; durationInFrames?: number }> = ({
  kicker = "DR. FEDERER", title, subtitle,
}) => {
  const p = useIn(0);
  const p2 = useIn(6);
  const x = interpolate(p, [0, 1], [-80, 0]);
  const barW = interpolate(p2, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER }}>
      <div style={{ position: "absolute", left: 96, bottom: 118, display: "flex", alignItems: "stretch", opacity: p, transform: `translateX(${x}px)`, filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.55))" }}>
        {/* tag marca (paralelogramo teal) */}
        <div style={{ background: `linear-gradient(135deg, ${TEAL}, ${TEALd})`, display: "flex", alignItems: "center", gap: 12, padding: "0 26px 0 22px", transform: "skewX(-9deg)", borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>
          <div style={{ transform: "skewX(9deg)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid rgba(255,255,255,0.35)" }}>
              <PulseCross />
            </div>
            <span style={{ color: W, fontWeight: 800, fontSize: 26, letterSpacing: 2 }}>{kicker}</span>
          </div>
        </div>
        {/* barra oscura título + subtítulo */}
        <div style={{ overflow: "hidden", transform: "skewX(-9deg)", transformOrigin: "left", width: barW * 900 }}>
          <div style={{ transform: "skewX(9deg)", background: `linear-gradient(180deg, ${INK1}, ${INK0})`, borderTop: `3px solid ${TEAL}`, padding: "12px 34px 14px 30px", minWidth: 620, height: "100%", boxSizing: "border-box" }}>
            <div style={{ color: W, fontWeight: 800, fontSize: 40, lineHeight: 1.04, letterSpacing: -0.5, whiteSpace: "nowrap" }}>{title}</div>
            {subtitle && <div style={{ color: TEALhi, fontWeight: 600, fontSize: 22, marginTop: 4, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{subtitle}</div>}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// 2) ALERTA ESQUINA (inferior-derecha) — titular super-alerta + descripción
// ─────────────────────────────────────────────────────────────────────────
export const AlertaCorner: React.FC<{ tag?: string; headline: string; desc?: string }> = ({ tag = "ALERTA", headline, desc }) => {
  const f = useCurrentFrame();
  const p = useIn(0);
  const p2 = useIn(8);
  const pulse = 0.5 + 0.5 * Math.sin(f / 6);
  const x = interpolate(p, [0, 1], [60, 0]);
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER }}>
      <div style={{ position: "absolute", right: 70, bottom: 110, width: 560, opacity: p, transform: `translateX(${x}px)`, filter: "drop-shadow(0 20px 46px rgba(0,0,0,0.6))" }}>
        {/* chip alerta pulsante */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: `linear-gradient(135deg, ${ALERT}, ${ALERTd})`, padding: "8px 20px 8px 16px", borderRadius: 10, marginBottom: -2, boxShadow: `0 0 ${18 + pulse * 26}px rgba(255,59,48,${0.35 + pulse * 0.4})` }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: W, boxShadow: `0 0 ${6 + pulse * 10}px ${W}` }} />
          <span style={{ color: W, fontWeight: 800, fontSize: 24, letterSpacing: 3, fontFamily: F_OSWALD }}>{tag}</span>
        </div>
        {/* cuerpo */}
        <div style={{ background: `linear-gradient(180deg, ${INK1}, ${INK0})`, borderRadius: 16, borderTopRightRadius: 4, border: `1.5px solid rgba(255,59,48,0.35)`, borderLeft: `5px solid ${ALERT}`, padding: "18px 24px 20px", opacity: p2 }}>
          <div style={{ color: W, fontWeight: 800, fontSize: 32, lineHeight: 1.1, letterSpacing: -0.3 }}>{headline}</div>
          {desc && <div style={{ color: WSOFT, fontWeight: 500, fontSize: 21, lineHeight: 1.32, marginTop: 8 }}>{desc}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// 3) TICKER ALERTA — franja inferior full-width con tag + texto en scroll
// ─────────────────────────────────────────────────────────────────────────
export const TickerAlerta: React.FC<{ tag?: string; items: string[] }> = ({ tag = "SALUD", items }) => {
  const f = useCurrentFrame();
  const p = useIn(0);
  const y = interpolate(p, [0, 1], [90, 0]);
  const text = items.join("      ✦      ");
  const scroll = ((f * 3.2) % 2400);
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 54, height: 66, display: "flex", alignItems: "stretch", opacity: p, transform: `translateY(${y}px)`, filter: "drop-shadow(0 -6px 24px rgba(0,0,0,0.4))" }}>
        <div style={{ background: `linear-gradient(135deg, ${TEAL}, ${TEALd})`, display: "flex", alignItems: "center", padding: "0 34px", zIndex: 2 }}>
          <span style={{ color: W, fontWeight: 800, fontSize: 28, letterSpacing: 3, fontFamily: F_OSWALD }}>{tag}</span>
        </div>
        <div style={{ flex: 1, background: `linear-gradient(180deg, ${INK1}, ${INK0})`, borderTop: `2px solid ${TEAL}`, overflow: "hidden", display: "flex", alignItems: "center", position: "relative" }}>
          <div style={{ position: "absolute", whiteSpace: "nowrap", transform: `translateX(${-scroll}px)`, color: W, fontWeight: 600, fontSize: 26, letterSpacing: 0.4 }}>
            {text}      ✦      {text}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// 4) ANTES / DESPUÉS — split con divisor animado + etiquetas (melasma)
// ─────────────────────────────────────────────────────────────────────────
export const AntesDespues: React.FC<{ before?: string; after?: string; labelA?: string; labelB?: string }> = ({
  before, after, labelA = "ANTES", labelB = "DESPUÉS",
}) => {
  const p = useIn(0);
  const split = interpolate(p, [0, 1], [50, 54], { extrapolateRight: "clamp" });
  const Chip: React.FC<{ t: string; c: string; side: "l" | "r" }> = ({ t, c, side }) => (
    <div style={{ position: "absolute", top: 60, [side === "l" ? "left" : "right"]: 60, background: c, color: W, fontFamily: F_OSWALD, fontWeight: 700, fontSize: 30, letterSpacing: 3, padding: "8px 26px", borderRadius: 8, boxShadow: "0 10px 26px rgba(0,0,0,0.5)" } as React.CSSProperties}>{t}</div>
  );
  const half = (side: "a" | "b"): React.CSSProperties => ({
    position: "absolute", inset: 0,
    background: side === "a"
      ? "radial-gradient(120% 100% at 60% 40%, #3a2a2e, #1a1013 75%)"   // ANTES: piel apagada/manchada
      : "radial-gradient(120% 100% at 40% 40%, #123b42, #061318 78%)",  // DESPUÉS: piel limpia/teal
  });
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER, opacity: p }}>
      {/* lado ANTES */}
      <div style={{ position: "absolute", inset: 0, clipPath: `polygon(0 0, ${split}% 0, ${split - 4}% 100%, 0 100%)`, overflow: "hidden" }}>
        {before && /\.(jpe?g|png|webp)$/i.test(before) ? <Img src={sf(before)!} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.85) brightness(0.9)" }} /> : <div style={half("a")} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(224,82,62,0.12), transparent)" }} />
      </div>
      {/* lado DESPUÉS */}
      <div style={{ position: "absolute", inset: 0, clipPath: `polygon(${split}% 0, 100% 0, 100% 100%, ${split - 4}% 100%)`, overflow: "hidden" }}>
        {after && /\.(jpe?g|png|webp)$/i.test(after) ? <Img src={sf(after)!} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={half("b")} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, rgba(22,199,192,0.14))" }} />
      </div>
      {/* divisor diagonal */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${split - 2}%`, width: 6, background: `linear-gradient(180deg, ${TEALhi}, ${TEAL})`, transform: "skewX(-3deg)", boxShadow: `0 0 30px ${TEAL}` }} />
      <Chip t={labelA} c="rgba(224,82,62,0.92)" side="l" />
      <Chip t={labelB} c={TEALd} side="r" />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// 5) MITO vs REALIDAD — dos filas (✕ rojo / ✓ teal)
// ─────────────────────────────────────────────────────────────────────────
export const MitoVsRealidad: React.FC<{ myth: string; fact: string }> = ({ myth, fact }) => {
  const p1 = useIn(0);
  const p2 = useIn(14);
  const Row: React.FC<{ p: number; icon: string; label: string; text: string; c: string; strike?: boolean }> = ({ p, icon, label, text, c, strike }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 24, background: `linear-gradient(180deg, ${INK1}, ${INK0})`, border: `1.5px solid ${c}55`, borderLeft: `6px solid ${c}`, borderRadius: 18, padding: "22px 30px", width: 1080, opacity: p, transform: `translateX(${interpolate(p, [0, 1], [-50, 0])}px)`, boxShadow: "0 16px 40px rgba(0,0,0,0.45)" }}>
      <div style={{ width: 62, height: 62, borderRadius: "50%", background: c, display: "flex", alignItems: "center", justifyContent: "center", color: W, fontSize: 40, fontWeight: 900, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ color: c, fontFamily: F_OSWALD, fontWeight: 700, fontSize: 22, letterSpacing: 3 }}>{label}</div>
        <div style={{ color: W, fontWeight: 700, fontSize: 34, lineHeight: 1.12, textDecoration: strike ? "line-through" : "none", textDecorationColor: "rgba(255,59,48,0.7)" }}>{text}</div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER, alignItems: "center", justifyContent: "center", gap: 30 }}>
      <AbsoluteFill style={{ background: `radial-gradient(130% 100% at 25% 15%, #123b42, ${INK0} 72%)` }} />
      <Row p={p1} icon="✕" label="MITO" text={myth} c={ALERT} strike />
      <Row p={p2} icon="✓" label="REALIDAD" text={fact} c={TEAL} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// 6) DATO CLAVE — badge de esquina con número count-up + etiqueta
// ─────────────────────────────────────────────────────────────────────────
export const DatoClaveBadge: React.FC<{ value: number; suffix?: string; label: string; corner?: "tl" | "tr" }> = ({
  value, suffix, label, corner = "tr",
}) => {
  const f = useCurrentFrame();
  const p = useIn(0);
  const n = Math.round(interpolate(f, [4, 26], [0, value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const pos: React.CSSProperties = corner === "tr" ? { top: 80, right: 80 } : { top: 80, left: 80 };
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER }}>
      <div style={{ position: "absolute", ...pos, display: "flex", alignItems: "center", gap: 20, background: `linear-gradient(180deg, ${INK1}, ${INK0})`, border: `1.5px solid ${TEAL}66`, borderRadius: 22, padding: "18px 30px 18px 22px", opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})`, boxShadow: `0 18px 44px rgba(0,0,0,0.5), 0 0 40px rgba(22,199,192,0.18)` }}>
        <div style={{ width: 70, height: 70, borderRadius: 16, background: `linear-gradient(135deg, ${TEAL}, ${TEALd})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 2px 8px rgba(255,255,255,0.25)" }}>
          <PulseCross size={40} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ color: W, fontWeight: 900, fontSize: 66, lineHeight: 0.9, letterSpacing: -2, fontVariantNumeric: "tabular-nums" }}>{n}</span>
            {suffix && <span style={{ color: TEALhi, fontWeight: 800, fontSize: 30 }}>{suffix}</span>}
          </div>
          <div style={{ color: WSOFT, fontWeight: 600, fontSize: 20, letterSpacing: 1, marginTop: 2, textTransform: "uppercase" }}>{label}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// 7) CALLOUT FLECHA — flecha animada + etiqueta señalando un punto del b-roll
// ─────────────────────────────────────────────────────────────────────────
export const CalloutFlecha: React.FC<{ text: string; tx?: number; ty?: number; from?: "tl" | "tr" | "bl" | "br" }> = ({
  text, tx = 0.5, ty = 0.5, from = "tl",
}) => {
  const p = useIn(0);
  const draw = interpolate(p, [0, 1], [0, 1]);
  const W_ = 1920, H_ = 1080;
  const X = tx * W_, Y = ty * H_;
  const OFF: Record<string, [number, number]> = { tl: [-260, -170], tr: [260, -170], bl: [-260, 170], br: [260, 170], top: [0, -230], bottom: [0, 230], left: [-320, 0], right: [320, 0] };
  const off = OFF[from as string] || OFF.tr;
  const lx = X + off[0], ly = Y + off[1];
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER }}>
      <svg width={W_} height={H_} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <marker id="fedArrow" markerWidth="12" markerHeight="12" refX="7" refY="6" orient="auto">
            <path d="M1 1 L10 6 L1 11" fill="none" stroke={TEAL} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
        <path d={`M ${lx} ${ly} Q ${(lx + X) / 2} ${(ly + Y) / 2 - 40} ${X} ${Y}`} fill="none" stroke={TEAL} strokeWidth={5} strokeLinecap="round" markerEnd="url(#fedArrow)" strokeDasharray={520} strokeDashoffset={520 * (1 - draw)} style={{ filter: `drop-shadow(0 0 8px ${TEAL})` }} />
        <circle cx={X} cy={Y} r={interpolate(p, [0, 1], [0, 16])} fill="none" stroke={TEALhi} strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", left: lx, top: ly, transform: "translate(-50%, -50%)", opacity: p }}>
        <div style={{ background: `linear-gradient(135deg, ${INK1}, ${INK0})`, border: `1.5px solid ${TEAL}`, borderRadius: 12, padding: "12px 22px", color: W, fontWeight: 800, fontSize: 30, whiteSpace: "nowrap", boxShadow: `0 12px 30px rgba(0,0,0,0.5), 0 0 24px rgba(22,199,192,0.2)` }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// DEMO — wrapper que dibuja un fondo clínico + monta un componente por `which`
// (para renderizar stills de aprobación)
// ─────────────────────────────────────────────────────────────────────────
export const BroadcastDemo: React.FC<{ which?: string }> = ({ which = "lowerthird" }) => {
  const bg = (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 30% 20%, #16323b, #0a171c 70%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.5))" }} />
      <div style={{ position: "absolute", right: 120, top: 120, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(22,199,192,0.10), transparent 70%)" }} />
    </AbsoluteFill>
  );
  let comp: React.ReactNode = null;
  if (which === "lowerthird") comp = <LowerThirdFederer title="El romero borra las manchas" subtitle="Melasma · manchas · arrugas — de noche" />;
  else if (which === "alerta") comp = <AlertaCorner headline="No lo uses de día sin protector" desc="El aceite de romero al sol puede oscurecer más la mancha. Aplícalo solo de noche." />;
  else if (which === "ticker") comp = <TickerAlerta items={["El romero mejora la microcirculación de la piel", "El frasco debe estar 100% seco o fermenta", "Prueba de alergia antes de aplicar en la cara"]} />;
  else if (which === "antesdespues") comp = <AntesDespues />;
  else if (which === "mito") comp = <MitoVsRealidad myth="Las cremas caras borran el melasma" fact="Sin tratar la causa, la mancha siempre vuelve" />;
  else if (which === "dato") comp = <DatoClaveBadge value={15} suffix="días" label="Maceración del aceite" />;
  else if (which === "callout") comp = <CalloutFlecha text="Aquí se acumula la melanina" tx={0.42} ty={0.5} from="tr" />;
  return (
    <AbsoluteFill>
      {bg}
      {comp}
    </AbsoluteFill>
  );
};
