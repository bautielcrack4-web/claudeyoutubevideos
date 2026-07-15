import React from "react";
import { interpolate } from "remotion";
import { SPR, Theme, useTheme } from "./theme";
import {
  Card,
  Display,
  Eyebrow,
  ImgOr,
  Motas,
  Panel,
  Stage,
  Stroke,
  Support,
  kick,
  spread,
  useBeat,
} from "./core";

// ═══════════════════════════════════════════════════════════════════════════
// FAMILIA: TEXTO / ÉNFASIS — HookCaption · PullQuote · KaraokePhrase ·
// HighlightSweep
// ═══════════════════════════════════════════════════════════════════════════

// ── HookCaption — gancho de apertura: palabras que golpean una a una, con ────
//    cajas de acento detrás de las claves.
export type HookWord = { text: string; boxed?: boolean };
export const HookCaption: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  words?: HookWord[];
  sub?: string;
}> = ({
  durationInFrames,
  theme,
  words = [
    { text: "Esto" },
    { text: "te está" },
    { text: "COSTANDO", boxed: true },
    { text: "plata" },
    { text: "todos los días", boxed: true },
  ],
  sub = "y se arregla con lo que ya tenés en tu casa",
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const subS = kick(frame, fps, spread(durationInFrames, words.length, words.length, { holdFrac: 0.45, maxStep: 16 }) + 6, SPR.settle);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={58}>
        <Motas theme={t} count={12} opacity={0.35} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 140px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", gap: "8px 26px", textAlign: "center" }}>
            {words.map((w, i) => {
              const at = spread(durationInFrames, words.length, i, { holdFrac: 0.45, maxStep: 16 });
              const s = kick(frame, fps, at, SPR.pop);
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: s,
                    transform: `translateY(${(1 - s) * 40}px) scale(${0.8 + s * 0.2})`,
                    fontFamily: t.fontDisplay,
                    fontWeight: t.displayWeight >= 800 ? 900 : t.displayWeight,
                    fontSize: w.boxed ? 108 : 92,
                    lineHeight: 1.12,
                    color: w.boxed ? t.color.onAccent : t.color.text,
                    background: w.boxed ? `linear-gradient(160deg, ${t.color.accent}, ${t.color.accent}DD)` : "none",
                    padding: w.boxed ? "2px 30px 8px" : 0,
                    borderRadius: w.boxed ? t.radius * 0.6 : 0,
                    boxShadow: w.boxed ? `0 20px 44px ${t.color.shadow}` : "none",
                    textShadow: w.boxed ? "0 3px 10px rgba(0,0,0,0.3)" : `0 6px 24px ${t.color.shadow}`,
                    transformOrigin: "bottom center",
                  }}
                >
                  {w.text}
                </span>
              );
            })}
          </div>
          {sub && (
            <div style={{ marginTop: 46, opacity: subS, transform: `translateY(${(1 - subS) * 16}px)` }}>
              <Support theme={t} size={40} color={t.color.textSoft}>{sub}</Support>
            </div>
          )}
        </div>
      </Panel>
    </Stage>
  );
};

// ── PullQuote — cita con retrato circular, comillas gigantes y atribución ────
export const PullQuote: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  quote?: string;
  author?: string;
  role?: string;
  image?: string;
}> = ({
  durationInFrames,
  theme,
  quote = "",
  author,
  role,
  image,
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const qS = kick(frame, fps, 6, SPR.settle);
  const portS = kick(frame, fps, 14, SPR.settle);
  const authS = kick(frame, fps, 30, SPR.snappy);
  const markS = kick(frame, fps, 2, SPR.pop);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={20}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 90, padding: "0 130px" }}>
          {/* retrato con doble anillo + rim — SOLO si hay imagen (evita retrato-placeholder falso) */}
          {image && (
            <div style={{ position: "relative", flexShrink: 0, opacity: portS, transform: `scale(${0.85 + portS * 0.15})` }}>
              <div
                style={{
                  width: 380,
                  height: 380,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `7px solid ${t.color.gold}`,
                  boxShadow: `0 30px 60px ${t.color.shadow}, 0 0 60px ${t.color.glow}`,
                }}
              >
                <ImgOr src={image} seed={77} theme={t} />
              </div>
              <div style={{ position: "absolute", inset: -18, borderRadius: "50%", border: `2px dashed ${t.color.line}` }} />
            </div>
          )}
          <div style={{ position: "relative", maxWidth: 900 }}>
            {/* comilla gigante de fondo */}
            <div
              style={{
                position: "absolute",
                top: -130,
                left: -60,
                fontFamily: t.fontDisplay,
                fontSize: 300,
                lineHeight: 1,
                color: t.color.accent,
                opacity: 0.22 * markS,
                transform: `scale(${markS})`,
                pointerEvents: "none",
              }}
            >
              &ldquo;
            </div>
            <div style={{ opacity: qS, transform: `translateY(${(1 - qS) * 24}px)` }}>
              <Display theme={t} size={58} style={{ fontStyle: t.name === "alarm" ? "normal" : "italic", fontWeight: 600, lineHeight: 1.25 }}>
                {quote}
              </Display>
            </div>
            {author && (
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 36, opacity: authS, transform: `translateX(${(1 - authS) * -20}px)` }}>
                <div style={{ width: 64, height: 4, background: t.color.gold, borderRadius: 2 }} />
                <div>
                  <Display theme={t} size={36} color={t.color.gold}>{author}</Display>
                  {role && <Support theme={t} size={25} color={t.color.textDim}>{role}</Support>}
                </div>
              </div>
            )}
          </div>
        </div>
      </Panel>
    </Stage>
  );
};

// ── KaraokePhrase — frase clave palabra por palabra, la activa se enciende ───
export const KaraokePhrase: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  phrase?: string;
  /** frames por palabra (default reparte en la duración) */
  wordDur?: number;
  eyebrow?: string;
}> = ({ durationInFrames, theme, phrase = "El error no es comprar mal. Es no medir nada.", wordDur, eyebrow = "Grabate esto" }) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const words = phrase.split(" ");
  const per = wordDur ?? Math.max(5, Math.floor((durationInFrames - 40) / words.length));
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={44}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 170px" }}>
          <div style={{ marginBottom: 44, opacity: kick(frame, fps, 2, SPR.settle) }}>
            <Eyebrow theme={t} size={30}>{eyebrow}</Eyebrow>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 22px" }}>
            {words.map((w, i) => {
              const at = 12 + i * per;
              const s = kick(frame, fps, at, SPR.snappy);
              const active = frame >= at && frame < at + per;
              const activeS = active ? 1 : 0;
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: t.fontDisplay,
                    fontWeight: t.displayWeight,
                    fontSize: 84,
                    lineHeight: 1.2,
                    opacity: 0.25 + s * 0.75,
                    color: frame >= at ? t.color.text : t.color.textDim,
                    transform: `translateY(${(1 - s) * 18}px) scale(${1 + activeS * 0.07})`,
                    textShadow: active ? `0 0 34px ${t.color.glow}` : "none",
                    transition: "none",
                    display: "inline-block",
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
          <svg viewBox="0 0 900 26" width={900} height={26} style={{ marginTop: 50 }}>
            <Stroke d="M 8 14 C 240 4, 620 24, 892 10" at={12 + words.length * per} dur={18} color={t.color.accent} width={6} length={920} />
          </svg>
        </div>
      </Panel>
    </Stage>
  );
};

// ── HighlightSweep — oración con marcador que BARRE detrás de la clave ───────
export const HighlightSweep: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  pre?: string;
  highlight?: string;
  post?: string;
  note?: string;
}> = ({
  durationInFrames,
  theme,
  pre = "La garantía cubre todo,",
  highlight = "menos lo que más se rompe",
  post = ".",
  note = "cláusula 14, letra chica",
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const enterS = kick(frame, fps, 4, SPR.settle);
  const sweep = interpolate(frame, [22, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const noteS = kick(frame, fps, 48, SPR.snappy);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={70}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 150px", textAlign: "center" }}>
          <div style={{ opacity: enterS, transform: `translateY(${(1 - enterS) * 26}px)`, fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontSize: 84, lineHeight: 1.28, color: t.color.text }}>
            <span style={{ color: t.color.textSoft, fontWeight: 500 }}>{pre} </span>
            <span style={{ position: "relative", display: "inline-block" }}>
              {/* trazo marcador con borde irregular (skew + radius asimétrico) */}
              <span
                style={{
                  position: "absolute",
                  left: -14,
                  right: -14,
                  top: "10%",
                  bottom: "4%",
                  background: `linear-gradient(92deg, ${t.color.accent}CC, ${t.color.accent}99)`,
                  borderRadius: "14px 6px 16px 8px",
                  transform: `scaleX(${sweep}) skewX(-3deg)`,
                  transformOrigin: "left center",
                  boxShadow: `0 10px 30px ${t.color.shadow}`,
                }}
              />
              <span style={{ position: "relative", color: sweep > 0.4 ? t.color.onAccent : t.color.text }}>{highlight}</span>
            </span>
            <span style={{ color: t.color.textSoft, fontWeight: 500 }}>{post}</span>
          </div>
          {note && (
            <div style={{ marginTop: 56, opacity: noteS, transform: `translateY(${(1 - noteS) * 14}px)` }}>
              <Card theme={t} style={{ padding: "12px 34px", display: "inline-block" }}>
                <Support theme={t} size={27} color={t.color.textDim}>{note}</Support>
              </Card>
            </div>
          )}
        </div>
      </Panel>
    </Stage>
  );
};
