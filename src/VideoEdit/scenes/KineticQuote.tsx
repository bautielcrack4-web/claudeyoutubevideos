import { Fragment } from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONT_STACK, SPRING_SNAPPY, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX, POPS } from "../components/Sfx";

// GENERIC, data-driven kinetic typography. Pass any sentence + which words to
// EMPHASIZE — topic-agnostic. Words rise in ONE BY ONE; emphasized words land
// bigger, in the accent color, with a small pop + a held glow ("its own life").
// A subtle paper/plaster texture sits behind. Rule 14: every word is animated and
// every word's arrival carries a tick SFX (emphasis words get a brighter pop).
export type QuoteWord = { text: string; em?: boolean };

const TONES = {
  accent: COLORS.accent,
  amber: COLORS.amber,
  good: COLORS.good,
  cold: COLORS.cold,
  danger: COLORS.danger,
} as const;

const BOX_W = 1480;
const BOX_H = 720;

// split a plain string into words, marking the ones inside *asterisks* as emphasized.
// Soporta énfasis MULTI-PALABRA: *exención para adultos mayores* marca TODAS las
// palabras entre el * de apertura y el de cierre (no solo palabras sueltas), y
// nunca deja un asterisco literal en pantalla.
export const parseQuote = (s: string): QuoteWord[] => {
  const out: QuoteWord[] = [];
  let em = false;
  let cur = "";
  const flush = () => { if (cur) { out.push({ text: cur, em }); cur = ""; } };
  for (const ch of s) {
    if (ch === "*") { flush(); em = !em; continue; } // toggle énfasis (sirve pegado a puntuación)
    if (/\s/.test(ch)) { flush(); continue; }
    cur += ch;
  }
  flush();
  // fusionar puntuación suelta (ej. "?" que quedó tras un *cierre*) con la palabra previa
  const merged: QuoteWord[] = [];
  for (const w of out) {
    if (/^[?!.,;:»)]+$/.test(w.text) && merged.length) merged[merged.length - 1].text += w.text;
    else merged.push({ ...w });
  }
  return merged;
};

export const KineticQuote: React.FC<{
  durationInFrames: number;
  words: QuoteWord[];
  eyebrow?: string;
  cite?: string; // small attribution under the quote
  accent?: keyof typeof TONES;
  hue?: "blue" | "cold" | "amber" | "red";
  startAt?: number;
  perWord?: number; // frames between each word (default sec(0.32))
  fontSize?: number;
  image?: string; // staticFile path → the quote sits over a blurred+darkened real photo
  imageBlur?: number;
  imageDarken?: number;
}> = ({
  durationInFrames,
  words,
  eyebrow,
  cite,
  accent = "accent",
  hue = "cold",
  startAt = sec(0.4),
  perWord = sec(0.32),
  fontSize = 78,
  image,
  imageBlur,
  imageDarken,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = TONES[accent];
  const onImage = !!image; // sobre foto → texto CLARO (crema) + scrim + sombra fuerte
  // ANCHO SEGURO: el texto se mantiene en una columna central angosta y SIEMPRE
  // envuelve a 2-3 líneas (bloque vertical-centrado) → nunca invade la esquina
  // sup-der donde va el PiP del avatar (cornerTR). Antes, con maxWidth ancho, una
  // cita larga quedaba en una línea que se metía bajo el avatar y se cortaba.
  const SAFE_W = 1120;
  const charCount = words.reduce((a, w) => a + w.text.length + 1, 0);
  // auto-fit: para citas muy largas, achica para no pasar de ~3 líneas
  const fitFs = Math.min(fontSize, Math.max(42, Math.round((SAFE_W * 6) / Math.max(charCount, 12))));
  const head = spring({ frame, fps, config: SPRING_SNAPPY });

  const lastWordAt = startAt + (words.length - 1) * perWord;
  const citeStart = lastWordAt + sec(0.5);
  const citeSpring = spring({ frame: frame - citeStart, fps, config: SPRING_SNAPPY });

  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue={hue}
      glowY={46}
      drift={0.4}
      bg={image ? "image" : "grid"}
      image={image}
      imageBlur={image ? imageBlur ?? 7 : undefined}
      imageDarken={image ? imageDarken ?? 0.72 : undefined}
    >
      <div
        style={{
          width: BOX_W,
          height: BOX_H,
          position: "relative",
          fontFamily: FONT_STACK,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* paper/plaster texture: faint warm wash + fibre noise via layered gradients */}
        <div
          style={{
            position: "absolute",
            inset: -40,
            borderRadius: 28,
            opacity: head * 0.5,
            background:
              "radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.04), transparent 60%)," +
              "repeating-linear-gradient(92deg, rgba(255,255,255,0.018) 0 2px, transparent 2px 6px)",
            mixBlendMode: "screen",
          }}
        />

        {/* scrim oscuro radial detrás del texto SOLO sobre foto (legibilidad) */}
        {onImage && (
          <div
            style={{
              position: "absolute",
              inset: -70,
              borderRadius: 44,
              opacity: head,
              background: "radial-gradient(72% 62% at 50% 50%, rgba(0,0,0,0.6), rgba(0,0,0,0) 76%)",
              pointerEvents: "none",
            }}
          />
        )}

        {eyebrow && (
          <div style={{ letterSpacing: 7, fontSize: 19, fontWeight: 700, textTransform: "uppercase", color: onImage ? "rgba(255,247,232,0.92)" : COLORS.textDim, marginBottom: 26, opacity: head, textShadow: onImage ? "0 2px 12px rgba(0,0,0,0.85)" : "none" }}>
            {eyebrow}
          </div>
        )}

        {/* the quote — words flow & wrap, each rises in independently */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "baseline",
            gap: "0.18em 0.5em",
            maxWidth: SAFE_W,
            lineHeight: 1.18,
            textAlign: "center",
          }}
        >
          {words.map((w, i) => {
            const t0 = startAt + i * perWord;
            const s = spring({ frame: frame - t0, fps, config: SPRING_SNAPPY });
            // emphasized words keep a gentle breathing glow after landing
            const glow = w.em ? 0.5 + 0.5 * Math.sin((frame - t0) / 18) : 0;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontSize: w.em ? fitFs * 1.06 : fitFs,
                  fontWeight: w.em ? 900 : 600,
                  color: w.em ? C : onImage ? COLORS.bg0 : COLORS.text,
                  opacity: s,
                  transform: `translateY(${(1 - s) * 26}px) scale(${0.86 + s * 0.14})`,
                  textShadow: w.em
                    ? `0 0 ${18 + glow * 16}px ${C}88${onImage ? ", 0 2px 16px rgba(0,0,0,0.9)" : ""}`
                    : onImage
                    ? "0 2px 18px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.95)"
                    : "none",
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>

        {cite && (
          <div
            style={{
              marginTop: 40,
              fontSize: 26,
              fontWeight: 700,
              color: COLORS.textSoft,
              letterSpacing: 1,
              opacity: citeSpring,
              transform: `translateY(${(1 - citeSpring) * 16}px)`,
            }}
          >
            {cite}
          </div>
        )}

        {/* SFX: a tick as EACH word lands; emphasis words get a brighter pop */}
        {words.map((w, i) => {
          const t0 = startAt + i * perWord;
          return (
            <Fragment key={"sfx" + i}>
              <SfxCue at={t0} src={w.em ? POPS[i % POPS.length] : SFX.click} volume={w.em ? 0.5 : 0.34} />
            </Fragment>
          );
        })}
        {cite && <SfxCue at={citeStart} src={SFX.ui3} volume={0.4} />}
      </div>
    </SceneFrame>
  );
};
