import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONT_DISPLAY } from "../theme_ben";

// KeyPhrase — frase CLAVE sobre el footage (stock o avatar), revelada PALABRA POR PALABRA
// RÁPIDO, con la palabra importante en acento. El fondo se DESENFOCA justo cuando entra el
// texto (ramp), con un scrim para legibilidad. Técnica de canales de avatar virales.
//   `*palabra*` = palabra en acento (rojo/amarillo).
//   src = img/x.png | vid/x.mp4 | broll/x.mp4 | avatar_clips/x.mp4  (imagen o video de fondo)
//   blur=false → texto sobre footage NÍTIDO (solo scrim suave).
const TONES = { accent: COLORS.accent, amber: COLORS.amber, good: COLORS.good, cold: COLORS.cold, danger: COLORS.danger } as const;

const parse = (s: string) => {
  const out: { t: string; em: boolean }[] = [];
  let em = false, cur = "";
  const flush = () => { if (cur) { out.push({ t: cur, em }); cur = ""; } };
  for (const ch of s) { if (ch === "*") { flush(); em = !em; } else cur += ch; }
  flush();
  // separar en palabras conservando el énfasis
  return out.flatMap((seg) => seg.t.trim().split(/\s+/).filter(Boolean).map((w) => ({ t: w, em: seg.em })));
};

export const KeyPhrase: React.FC<{
  durationInFrames: number;
  text: string;
  src?: string;
  blur?: boolean;
  accent?: keyof typeof TONES;
  fontSize?: number;
  position?: "center" | "left" | "right"; // left/right = al costado del avatar (sin tapar)
  times?: number[]; // ★ offset (frames, relativo al beat) en que aparece CADA palabra → sync milimétrico
}> = ({ durationInFrames, text, src, blur = true, accent = "accent", fontSize = 96, position = "center", times }) => {
  const frame = useCurrentFrame();
  const C = TONES[accent];
  const words = parse(text);

  const isVideo = !!src && /\.(mp4|webm|mov)$/i.test(src);
  const textStart = 3; // el texto entra casi enseguida
  const STEP = 2.2; // frames por palabra → rápido
  // el fondo se desenfoca JUSTO cuando aparece el texto
  const bg = blur && src ? interpolate(frame, [textStart, textStart + 10], [0, 13], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const scrim = src ? interpolate(frame, [textStart, textStart + 10], [0, blur ? 0.5 : 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  // ken-burns muy sutil para que el fondo no quede muerto
  const camScale = interpolate(frame, [0, durationInFrames], [1.04, 1.09]);

  return (
    <AbsoluteFill style={{ backgroundColor: src ? "transparent" : "rgba(8,8,11,0.0)", overflow: "hidden" }}>
      {src && (
        <AbsoluteFill style={{ transform: `scale(${camScale})`, filter: bg > 0.3 ? `blur(${bg}px)` : undefined }}>
          {isVideo ? (
            <OffthreadVideo src={staticFile(src)} muted playbackRate={0.85} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </AbsoluteFill>
      )}
      {src && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(0,0,0,${scrim * 0.7}), rgba(0,0,0,${scrim}))` }} />}

      <AbsoluteFill style={{
        alignItems: position === "left" ? "flex-start" : position === "right" ? "flex-end" : "center",
        justifyContent: "center", padding: "0 110px",
      }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize, lineHeight: 1.06, textAlign: position === "center" ? "center" : position === "right" ? "right" : "left", maxWidth: position === "center" ? 1200 : 760, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {words.map((w, i) => {
            // sync milimétrico: si hay `times`, cada palabra aparece en su ms real; si no, paso fijo
            const at = times && times[i] != null ? times[i] : textStart + i * STEP;
            const op = interpolate(frame, [at, at + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const y = (1 - op) * 14;
            const b = (1 - op) * 6;
            return (
              <span key={i} style={{
                display: "inline-block", marginRight: "0.26em", opacity: op,
                transform: `translateY(${y}px)`, filter: b > 0.3 ? `blur(${b}px)` : undefined,
                color: w.em ? C : "#F6F6F8",
                textShadow: w.em ? `0 0 26px ${C}99, 0 3px 10px rgba(0,0,0,0.6)` : "0 3px 14px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.9)",
              }}>{w.t}</span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
