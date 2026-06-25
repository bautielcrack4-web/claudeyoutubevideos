// OxCards.tsx — overlays A MEDIDA del video "óxido" (Constructor Libre).
// ADN: el CLIP sigue corriendo detrás, BORROSO + scrim, y encima entra contenido
// (imagen/dato/regla) con animación moderna. Marca = serif EB Garamond + paleta terrosa.
// Se usan con overlay:true en build_oxido → se renderizan ENCIMA del beat de clip.
import { AbsoluteFill, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, acc, useTagReveal } from "./ui";

// ── scrim: difumina el clip vivo de fondo y lo oscurece (entra/sale suave) ──
const Scrim: React.FC<{ op: number; strength?: number }> = ({ op, strength = 16 }) => (
  <AbsoluteFill
    style={{
      backdropFilter: `blur(${strength * op}px) saturate(${1 - 0.25 * op})`,
      WebkitBackdropFilter: `blur(${strength * op}px)`,
      background: `radial-gradient(120% 120% at 50% 45%, rgba(20,14,8,${0.34 * op}), rgba(20,14,8,${0.62 * op}))`,
    }}
  />
);

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// ════ 1) OxStatPop — un DATO que aterriza (número que cuenta + subrayado dibujado) ════
export const OxStatPop: React.FC<{ durationInFrames: number; value: number; prefix?: string; suffix?: string; label: string; accent?: string; glyph?: string }> = ({ durationInFrames, value, prefix = "", suffix = "", label, accent, glyph }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames, 0), f = useCurrentFrame(), { fps } = useVideoConfig();
  const p = interpolate(f, [6, 6 + fps * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shown = Number.isInteger(value) ? Math.round(value * easeOut(p)) : (value * easeOut(p)).toFixed(1);
  const uw = interpolate(f, [fps * 0.7, fps * 1.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pop = spring({ frame: f - 4, fps, config: { damping: 12, stiffness: 140 } });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        {glyph && <div style={{ fontSize: 64, marginBottom: 6, opacity: 0.9, transform: `scale(${0.7 + 0.3 * pop})` }}>{glyph}</div>}
        <div style={{ fontFamily: SANS, fontWeight: 800, color: "#fff", fontSize: 168, lineHeight: 1, letterSpacing: -2, textShadow: "0 6px 30px rgba(0,0,0,0.6)", transform: `scale(${0.86 + 0.14 * pop})` }}>
          <span style={{ fontSize: 88, color: a, verticalAlign: "super" }}>{prefix}</span>
          <span style={{ color: a }}>{shown}</span>
          <span style={{ fontSize: 78, color: "rgba(255,255,255,0.92)" }}>{suffix}</span>
        </div>
        <div style={{ height: 5, width: 360 * uw, background: a, borderRadius: 3, marginTop: 14, boxShadow: `0 0 18px ${a}` }} />
        <div style={{ fontFamily: SANS, color: "rgba(255,255,255,0.9)", fontSize: 33, fontWeight: 500, marginTop: 20, maxWidth: 1000, textAlign: "center", textShadow: "0 2px 14px rgba(0,0,0,0.6)" }}>{label}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════ 2) OxMethodCard — ficha del método (badge nº + título + chips + costo) ════
export const OxMethodCard: React.FC<{ durationInFrames: number; num: string; title: string; chips?: string[]; cost?: string; accent?: string }> = ({ durationInFrames, num, title, chips = [], cost, accent }) => {
  const a = acc(accent), { op, y } = useTagReveal(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const ring = interpolate(f, [4, fps * 1.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const R = 52, C = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={13} />
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", paddingLeft: 110, transform: `translateY(${y}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ position: "relative", width: 132, height: 132 }}>
            <svg width="132" height="132" style={{ position: "absolute", inset: 0 }}>
              <circle cx="66" cy="66" r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="4" />
              <circle cx="66" cy="66" r={R} fill="none" stroke={a} strokeWidth="4" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ring)} transform="rotate(-90 66 66)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 800, fontSize: 58, color: "#fff" }}>{num}</div>
          </div>
          <div>
            <div style={{ fontFamily: SANS, color: a, fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Método</div>
            <div style={{ fontFamily: SANS, color: "#fff", fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 1100, textShadow: "0 3px 18px rgba(0,0,0,0.6)" }}>{title}</div>
            <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
              {chips.map((c, i) => {
                const cp = interpolate(f, [fps * (0.5 + i * 0.12), fps * (0.8 + i * 0.12)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return <div key={i} style={{ fontFamily: SANS, fontSize: 26, color: "#fff", padding: "8px 16px", borderRadius: 30, background: "rgba(8,13,20,0.5)", border: `1px solid ${a}`, opacity: cp, transform: `translateX(${(1 - cp) * 16}px)` }}>{c}</div>;
              })}
            </div>
          </div>
        </div>
        {cost && <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#1a140c", background: a, padding: "8px 20px", borderRadius: 8, marginTop: 26, marginLeft: 162 }}>{cost}</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════ 3) OxRuleStrip — la regla-ancla, palabra por palabra (*word* = acento) ════
export const OxRuleStrip: React.FC<{ durationInFrames: number; text: string; accent?: string }> = ({ durationInFrames, text, accent }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames, 0), f = useCurrentFrame();
  const words = text.split(" ");
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 160px" }}>
        <div style={{ width: 90, height: 2, background: a, opacity: 0.8, marginBottom: 26 }} />
        <div style={{ fontFamily: SANS, fontSize: 70, fontWeight: 700, color: "#fff", textAlign: "center", lineHeight: 1.18, textShadow: "0 3px 20px rgba(0,0,0,0.6)" }}>
          {words.map((w, i) => {
            const hl = w.startsWith("*") && w.endsWith("*");
            const clean = w.replace(/\*/g, "");
            const wp = interpolate(f, [4 + i * 3, 12 + i * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return <span key={i} style={{ display: "inline-block", marginRight: 18, opacity: wp, transform: `translateY(${(1 - wp) * 14}px)`, color: hl ? a : "#fff", borderBottom: hl ? `4px solid ${a}` : "none", paddingBottom: hl ? 2 : 0 }}>{clean}</span>;
          })}
        </div>
        <div style={{ width: 90, height: 2, background: a, opacity: 0.8, marginTop: 26 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════ 4) OxClampWarning — aviso de polaridad (electrólisis) ════
export const OxClampWarning: React.FC<{ durationInFrames: number; accent?: string }> = ({ durationInFrames }) => {
  const { op, y } = useTagReveal(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const shake = Math.sin(f * 0.7) * interpolate(f, [fps * 0.5, fps * 0.9], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const Pill: React.FC<{ color: string; tag: string; to: string; d: number }> = ({ color, tag, to, d }) => {
    const pp = interpolate(f, [fps * d, fps * (d + 0.35)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: pp, transform: `translateX(${(1 - pp) * (color === "#e23b2e" ? 30 : -30)}px) translateX(${shake}px)` }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: color, boxShadow: `0 0 16px ${color}` }} />
        <div style={{ fontFamily: SANS, fontSize: 46, fontWeight: 800, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}><b style={{ color }}>{tag}</b> → {to}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 28, transform: `translateY(${y}px)` }}>
        <Pill color="#1c1c1c" tag="NEGRO" to="tu pieza" d={0.3} />
        <Pill color="#e23b2e" tag="ROJO" to="al sacrificio" d={0.55} />
        <div style={{ fontFamily: SANS, fontSize: 30, color: "rgba(255,255,255,0.85)", marginTop: 10, fontStyle: "italic" }}>Si las invertís, se come tu pieza buena.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════ 5) OxMaterialTag — callout de material con flecha dibujada al objeto ════
export const OxMaterialTag: React.FC<{ durationInFrames: number; name: string; what: string; price?: string; accent?: string; side?: "left" | "right" }> = ({ durationInFrames, name, what, price, accent, side = "left" }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const arrow = interpolate(f, [fps * 0.5, fps * 1.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sx = side === "left" ? { left: 110 } : { right: 110 };
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={9} />
      <div style={{ position: "absolute", top: "32%", ...sx, maxWidth: 560 }}>
        <div style={{ background: "rgba(8,13,20,0.58)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)", borderLeft: `4px solid ${a}`, borderRadius: 12, padding: "20px 26px", boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50, color: "#fff", lineHeight: 1.05 }}>{name}</div>
          <div style={{ fontFamily: SANS, fontSize: 27, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>{what}</div>
          {price && <div style={{ display: "inline-block", marginTop: 14, fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#1a140c", background: a, padding: "5px 16px", borderRadius: 7 }}>{price}</div>}
        </div>
        <svg width="240" height="120" style={{ position: "absolute", top: "100%", [side]: 40 as number }}>
          <path d={`M 10 10 Q 120 30 ${150 * arrow + 10} ${90 * arrow + 10}`} fill="none" stroke={a} strokeWidth="3" strokeLinecap="round" strokeDasharray="300" strokeDashoffset={300 * (1 - arrow)} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ════ 6) OxBeforeAfter — barrido oxidado→limpio con labels ════
export const OxBeforeAfter: React.FC<{ durationInFrames: number; before: string; after: string; accent?: string }> = ({ durationInFrames, before, after, accent }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames, 0), f = useCurrentFrame(), { fps } = useVideoConfig();
  const wipe = interpolate(f, [fps * 0.4, fps * 1.6], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lab = (s: number) => interpolate(f, [fps * s, fps * (s + 0.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const L: React.CSSProperties = { position: "absolute", top: 70, fontFamily: SANS, fontWeight: 800, fontSize: 38, color: "#fff", letterSpacing: 2, textShadow: "0 2px 14px rgba(0,0,0,0.7)", padding: "6px 18px", borderRadius: 8, background: "rgba(8,13,20,0.5)" };
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Img src={staticFile(before)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${wipe}%)` }}>
        <Img src={staticFile(after)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${wipe}%`, width: 4, background: a, boxShadow: `0 0 20px ${a}` }} />
      <div style={{ ...L, left: 70, opacity: lab(0.3) }}>ANTES</div>
      <div style={{ ...L, right: 70, opacity: lab(1.4), color: a }}>DESPUÉS</div>
    </AbsoluteFill>
  );
};

// ════ 7) OxSidePanel — imagen + texto explicativo AL LADO (sobre clip borroso) ════
export const OxSidePanel: React.FC<{ durationInFrames: number; image: string; title: string; lines?: string[]; side?: "left" | "right"; accent?: string }> = ({ durationInFrames, image, title, lines = [], side = "right", accent }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames, 0), f = useCurrentFrame(), { fps } = useVideoConfig();
  const ip = spring({ frame: f - 3, fps, config: { damping: 14, stiffness: 120 } });
  const imgFirst = side === "left";
  const ImgBox = (
    <div style={{ flex: "0 0 44%", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.16)", boxShadow: "0 18px 50px rgba(0,0,0,0.55)", aspectRatio: "4/3", transform: `translateX(${(1 - ip) * (imgFirst ? -40 : 40)}px) scale(${0.94 + 0.06 * ip})` }}>
      <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
  const TextBox = (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, color: "#fff", fontSize: 54, lineHeight: 1.08, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
      <div style={{ width: 64, height: 4, background: a, borderRadius: 3, margin: "16px 0 20px" }} />
      {lines.map((l, i) => {
        const lp = interpolate(f, [fps * (0.4 + i * 0.18), fps * (0.7 + i * 0.18)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 13, opacity: lp, transform: `translateY(${(1 - lp) * 12}px)` }}><div style={{ color: a, fontSize: 26 }}>▸</div><div style={{ fontFamily: SANS, color: "rgba(255,255,255,0.93)", fontSize: 31, lineHeight: 1.3, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>{l}</div></div>;
      })}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 110px" }}>
        <div style={{ display: "flex", gap: 50, alignItems: "center", maxWidth: 1560, width: "100%" }}>
          {imgFirst ? <>{ImgBox}{TextBox}</> : <>{TextBox}{ImgBox}</>}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════ 9) OxSpecSheet — foto + FICHA TÉCNICA al lado (filas clave→valor, líder punteado) ════
export const OxSpecSheet: React.FC<{ durationInFrames: number; image: string; title: string; kicker?: string; rows: { k: string; v: string }[]; side?: "left" | "right"; accent?: string }> = ({ durationInFrames, image, title, kicker, rows, side = "left", accent }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames, 0), f = useCurrentFrame(), { fps } = useVideoConfig();
  const ip = spring({ frame: f - 3, fps, config: { damping: 15, stiffness: 110 } });
  const imgFirst = side === "left";
  const kb = 1 + 0.05 * easeOut(interpolate(f, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" }));
  const ImgBox = (
    <div style={{ flex: "0 0 42%", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.16)", boxShadow: "0 18px 50px rgba(0,0,0,0.55)", aspectRatio: "4/3", transform: `translateX(${(1 - ip) * (imgFirst ? -44 : 44)}px) scale(${0.94 + 0.06 * ip})` }}>
      <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }} />
    </div>
  );
  const Sheet = (
    <div style={{ flex: 1 }}>
      {kicker && <div style={{ fontFamily: SANS, color: a, fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>{kicker}</div>}
      <div style={{ fontFamily: SANS, fontWeight: 800, color: "#fff", fontSize: 56, lineHeight: 1.05, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
      <div style={{ width: 64, height: 4, background: a, borderRadius: 3, margin: "18px 0 22px" }} />
      {rows.map((r, i) => {
        const rp = interpolate(f, [fps * (0.45 + i * 0.16), fps * (0.78 + i * 0.16)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 16, opacity: rp, transform: `translateX(${(1 - rp) * 18}px)` }}>
            <div style={{ fontFamily: SANS, color: "rgba(255,255,255,0.75)", fontSize: 29, fontWeight: 500, whiteSpace: "nowrap" }}>{r.k}</div>
            <div style={{ flex: 1, borderBottom: "2px dotted rgba(255,255,255,0.28)", transform: "translateY(-6px)" }} />
            <div style={{ fontFamily: SANS, color: a, fontSize: 33, fontWeight: 800, whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>{r.v}</div>
          </div>
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 110px" }}>
        <div style={{ display: "flex", gap: 52, alignItems: "center", maxWidth: 1560, width: "100%" }}>
          {imgFirst ? <>{ImgBox}{Sheet}</> : <>{Sheet}{ImgBox}</>}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════ 10) OxAnnotatedPhoto — foto grande con ETIQUETAS dibujadas señalando partes ════
export const OxAnnotatedPhoto: React.FC<{ durationInFrames: number; image: string; title?: string; notes: { x: number; y: number; lx: number; ly: number; text: string }[]; accent?: string }> = ({ durationInFrames, image, title, notes, accent }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames, 0), f = useCurrentFrame(), { fps } = useVideoConfig();
  const ip = spring({ frame: f - 3, fps, config: { damping: 16, stiffness: 110 } });
  const pulse = 1 + 0.25 * Math.sin(f * 0.18);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={15} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {title && <div style={{ position: "absolute", top: 70, fontFamily: SANS, fontWeight: 800, fontSize: 46, color: "#fff", letterSpacing: 1, textShadow: "0 3px 16px rgba(0,0,0,0.7)" }}>{title}</div>}
        <div style={{ position: "relative", width: 1080, aspectRatio: "16/10", borderRadius: 16, overflow: "hidden", border: `1px solid rgba(255,255,255,0.18)`, boxShadow: "0 24px 70px rgba(0,0,0,0.6)", transform: `scale(${0.92 + 0.08 * ip})` }}>
          <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {/* conectores dibujados (coords en %) */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {notes.map((n, i) => {
              const dp = interpolate(f, [fps * (0.5 + i * 0.28), fps * (1.0 + i * 0.28)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const ex = n.x + (n.lx - n.x) * dp, ey = n.y + (n.ly - n.y) * dp;
              return <line key={i} x1={n.x} y1={n.y} x2={ex} y2={ey} stroke={a} strokeWidth="0.35" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 4px ${a})` }} />;
            })}
          </svg>
          {notes.map((n, i) => {
            const dp = interpolate(f, [fps * (0.5 + i * 0.28), fps * (1.0 + i * 0.28)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const lp = interpolate(f, [fps * (0.85 + i * 0.28), fps * (1.2 + i * 0.28)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const onRight = n.lx >= n.x;
            return (
              <div key={i}>
                <div style={{ position: "absolute", left: `${n.x}%`, top: `${n.y}%`, width: 16, height: 16, marginLeft: -8, marginTop: -8, borderRadius: "50%", background: a, boxShadow: `0 0 14px ${a}`, opacity: dp, transform: `scale(${pulse})` }} />
                <div style={{ position: "absolute", left: `${n.lx}%`, top: `${n.ly}%`, transform: `translate(${onRight ? 14 : "calc(-100% - 14px)"}, -50%) translateX(${(1 - lp) * (onRight ? 12 : -12)}px)`, opacity: lp, background: "rgba(8,13,20,0.72)", backdropFilter: "blur(8px)", border: `1px solid ${a}`, borderRadius: 9, padding: "9px 15px", maxWidth: 320 }}>
                  <div style={{ fontFamily: SANS, color: "#fff", fontSize: 26, fontWeight: 600, lineHeight: 1.2, textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>{n.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════ 11) OxQuoteSplit — frase clave tipo revista + imagen vertical (ken-burns) al lado ════
export const OxQuoteSplit: React.FC<{ durationInFrames: number; quote: string; image: string; attribution?: string; side?: "left" | "right"; accent?: string }> = ({ durationInFrames, quote, image, attribution, side = "right", accent }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames, 0), f = useCurrentFrame(), { fps } = useVideoConfig();
  const ip = spring({ frame: f - 3, fps, config: { damping: 16, stiffness: 105 } });
  const kb = 1.04 + 0.08 * easeOut(interpolate(f, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" }));
  const imgFirst = side === "left";
  const words = quote.split(" ");
  const ImgBox = (
    <div style={{ flex: "0 0 34%", borderRadius: 16, overflow: "hidden", aspectRatio: "3/4", border: `1px solid rgba(255,255,255,0.16)`, boxShadow: "0 22px 60px rgba(0,0,0,0.6)", transform: `translateX(${(1 - ip) * (imgFirst ? -40 : 40)}px) scale(${0.95 + 0.05 * ip})` }}>
      <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }} />
    </div>
  );
  const QuoteBox = (
    <div style={{ flex: 1, position: "relative" }}>
      <div style={{ position: "absolute", top: -70, left: -8, fontFamily: SANS, fontSize: 200, lineHeight: 1, color: a, opacity: 0.28, fontWeight: 800 }}>“</div>
      <div style={{ fontFamily: SANS, fontSize: 64, fontWeight: 700, color: "#fff", lineHeight: 1.16, textShadow: "0 3px 18px rgba(0,0,0,0.6)", position: "relative" }}>
        {words.map((w, i) => {
          const hl = w.startsWith("*") && w.endsWith("*");
          const clean = w.replace(/\*/g, "");
          const wp = interpolate(f, [6 + i * 3, 16 + i * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <span key={i} style={{ display: "inline-block", marginRight: 16, opacity: wp, transform: `translateY(${(1 - wp) * 16}px)`, color: hl ? a : "#fff", borderBottom: hl ? `4px solid ${a}` : "none", paddingBottom: hl ? 2 : 0 }}>{clean}</span>;
        })}
      </div>
      {attribution && <div style={{ fontFamily: SANS, color: "rgba(255,255,255,0.7)", fontSize: 30, fontStyle: "italic", marginTop: 26 }}>— {attribution}</div>}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={15} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 120px" }}>
        <div style={{ display: "flex", gap: 64, alignItems: "center", maxWidth: 1620, width: "100%" }}>
          {imgFirst ? <>{ImgBox}{QuoteBox}</> : <>{QuoteBox}{ImgBox}</>}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════ 8) OxPhotoStack — 2-3 fotos "encima" del clip, en ráfaga/collage ════
export const OxPhotoStack: React.FC<{ durationInFrames: number; images: string[]; captions?: string[]; accent?: string }> = ({ durationInFrames, images, captions = [], accent }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames, 0), f = useCurrentFrame(), { fps } = useVideoConfig();
  const rot = [-5, 3, -2];
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={12} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 26, flexDirection: "row" }}>
        {images.slice(0, 3).map((im, i) => {
          const pp = spring({ frame: f - (4 + i * 7), fps, config: { damping: 13, stiffness: 130 } });
          return (
            <div key={i} style={{ width: 430, background: "#fbf4e3", padding: 9, paddingBottom: captions[i] ? 9 : 9, borderRadius: 8, boxShadow: `0 22px 54px rgba(0,0,0,0.5)`, transform: `rotate(${rot[i % 3]}deg) translateY(${(1 - pp) * 60}px) scale(${0.8 + 0.2 * pp})`, opacity: pp, border: `2px solid ${a}` }}>
              <div style={{ width: "100%", aspectRatio: "4/3", borderRadius: 4, overflow: "hidden" }}>
                <Img src={staticFile(im)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {captions[i] && <div style={{ fontFamily: SANS, color: "#1a140c", fontSize: 23, fontWeight: 700, textAlign: "center", marginTop: 8 }}>{captions[i]}</div>}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
