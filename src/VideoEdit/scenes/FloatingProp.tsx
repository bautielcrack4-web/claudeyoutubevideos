import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_DISPLAY } from "../theme_ben";

// FloatingProp — la técnica "hermosa" del nicho: un PNG RECORTADO (fondo transparente:
// casa, billetes, sobre, sello) FLOTA con sombra larga suave + micro-movimiento, encima
// del avatar o de un footage blureado. Entrada amortiguada (sin pop). Opcional caption.
const TONES = { accent: COLORS.accent, amber: COLORS.amber, good: COLORS.good, cold: COLORS.cold, danger: COLORS.danger } as const;
const SOFT = { damping: 28, mass: 1, stiffness: 80 };

export const FloatingProp: React.FC<{
  durationInFrames: number;
  src: string; // PNG transparente (img/x.png)
  bg?: string; // opcional: imagen/clip de fondo (se blurea)
  caption?: string; // texto debajo, `*palabra*` en acento
  accent?: keyof typeof TONES;
  scale?: number; // tamaño del prop (def 1)
}> = ({ durationInFrames, src, bg, caption, accent = "amber", scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = TONES[accent];
  const isVideo = !!bg && /\.(mp4|webm|mov)$/i.test(bg);

  const e = spring({ frame, fps, config: SOFT });
  const float = Math.sin(frame / 38) * 10; // micro-flotación lenta
  const propScale = scale * (0.9 + e * 0.1);
  const bgBlur = bg ? interpolate(frame, [0, 14], [4, 13], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  const words = caption
    ? caption.split("*").map((seg, i) => ({ t: seg, em: i % 2 === 1 })).filter((s) => s.t)
    : [];

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: bg ? "transparent" : undefined }}>
      {bg && (
        <>
          <AbsoluteFill style={{ filter: `blur(${bgBlur}px)`, transform: `scale(${1.05 + interpolate(frame, [0, durationInFrames], [0, 0.04])})` }}>
            {isVideo
              ? <OffthreadVideo src={staticFile(bg)} muted playbackRate={0.85} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </AbsoluteFill>
          <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0.25), rgba(0,0,0,0.5))" }} />
        </>
      )}

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Img
          src={staticFile(src)}
          style={{
            maxWidth: `${52 * propScale}%`, maxHeight: `${64 * propScale}%`, objectFit: "contain",
            transform: `translateY(${float - (1 - e) * 30}px) scale(${propScale})`, opacity: e,
            filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.55)) drop-shadow(0 8px 18px rgba(0,0,0,0.4))",
          }}
        />
      </AbsoluteFill>

      {caption && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 90 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 64, textTransform: "uppercase", textAlign: "center", maxWidth: 1300, opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            {words.map((w, i) => (
              <span key={i} style={{ color: w.em ? C : "#F6F6F8", textShadow: w.em ? `0 0 24px ${C}88, 0 3px 10px rgba(0,0,0,0.6)` : "0 3px 14px rgba(0,0,0,0.75)", marginRight: "0.2em" }}>{w.t.trim()} </span>
            ))}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
