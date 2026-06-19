import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { Media } from "../components/Media";
import { SfxCue, SFX } from "../components/Sfx";

// ── REGROW SPLIT ──────────────────────────────────────────────────────────────
// Componente CUSTOM del hook de LeviLappJardín: el antes/después que define el video.
// Izquierda = el resto que tirás ("Basura"); a la derecha BARRE un reveal y aparece
// lo que ese mismo resto produce ("Cosecha"), con una flecha que se dibuja y un
// número-insignia (ej. "11"). On-brand: serif EB Garamond, tinta cálida, acento
// terroso/verde, destello sepia (no neón). Pensado para 5–7s.

type AccentKey = "danger" | "accent" | "amber" | "cold" | "good" | "ink";
const TONE: Record<AccentKey, string> = {
  danger: COLORS.danger, accent: COLORS.accent, amber: COLORS.amber,
  cold: COLORS.cold, good: COLORS.good, ink: COLORS.text,
};

export const RegrowSplit: React.FC<{
  durationInFrames: number;
  leftImage: string;   // "img/..." el resto / basura
  rightImage: string;  // "img/..." la cosecha
  number?: string;     // insignia (ej "11")
  title?: string;      // línea inferior
  leftLabel?: string;  // default "Basura"
  rightLabel?: string; // default "Cosecha"
  hue?: string;
  accent?: AccentKey;  // color de la cosecha/flecha (default good)
}> = ({
  durationInFrames,
  leftImage,
  rightImage,
  number,
  title,
  leftLabel = "Basura",
  rightLabel = "Cosecha",
  accent = "good",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = TONE[accent];

  // izquierda entra ya; la derecha la BARRE un reveal a ~0.55s
  const leftOp = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const leftKB = interpolate(frame, [0, durationInFrames], [1.06, 1.12]); // ken-burns lento
  const revStart = sec(0.55);
  const reveal = interpolate(frame - revStart, [0, sec(0.7)], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const rightKB = interpolate(frame, [0, durationInFrames], [1.1, 1.02]);
  // flash sepia en el barrido
  const flash = interpolate(frame - revStart, [0, 5, 20], [0, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // insignia número pop
  const badge = spring({ frame: frame - (revStart + sec(0.2)), fps, config: { damping: 11, mass: 0.6, stiffness: 200 } });
  // flecha que se dibuja izq→der
  const arrow = interpolate(frame - (revStart + sec(0.1)), [0, sec(0.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  // título inferior
  const titleS = spring({ frame: frame - (revStart + sec(0.55)), fps, config: { damping: 20 } });

  const chip = (text: string, color: string, side: "L" | "R") => (
    <div style={{
      position: "absolute", top: 54, [side === "L" ? "left" : "right"]: 60,
      fontFamily: FONT_STACK, fontSize: 34, fontWeight: 800, letterSpacing: 3,
      textTransform: "uppercase", color: COLORS.bg0, background: `${color}E6`,
      padding: "10px 22px", borderRadius: 6, boxShadow: "0 6px 22px rgba(0,0,0,0.45)",
    }}>{text}</div>
  );

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, background: COLORS.ink, overflow: "hidden" }}>
      {/* IZQUIERDA — el resto / basura */}
      <div style={{ position: "absolute", left: 0, top: 0, width: "50%", height: "100%", overflow: "hidden", opacity: leftOp }}>
        <Media src={leftImage} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${leftKB})`, filter: "saturate(0.82) brightness(0.9)" }} />
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(20,16,12,0.15), rgba(20,16,12,0.45))" }} />
        {chip(leftLabel, COLORS.ink, "L")}
      </div>

      {/* DERECHA — la cosecha (revelada por el barrido) */}
      <div style={{ position: "absolute", right: 0, top: 0, width: "50%", height: "100%", overflow: "hidden", clipPath: `inset(0 0 0 ${(1 - reveal) * 100}%)` }}>
        <Media src={rightImage} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${rightKB})` }} />
        <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(20,16,12,0.35), rgba(20,16,12,0.08))` }} />
        <div style={{ position: "absolute", top: 54, right: 60, opacity: reveal }}>{/* chip derecho */}
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: COLORS.bg0, background: `${C}E6`, padding: "10px 22px", borderRadius: 6, boxShadow: "0 6px 22px rgba(0,0,0,0.45)" }}>{rightLabel}</div>
        </div>
      </div>

      {/* línea divisoria + flash sepia */}
      <div style={{ position: "absolute", left: "50%", top: 0, width: 4, height: "100%", marginLeft: -2, background: `linear-gradient(${COLORS.bg0}, ${C})`, opacity: 0.9, boxShadow: `0 0 26px ${C}` }} />
      <AbsoluteFill style={{ background: "radial-gradient(40% 60% at 50% 50%, rgba(233,210,160,1), rgba(233,210,160,0) 70%)", opacity: flash, mixBlendMode: "soft-light" }} />

      {/* flecha izq→der sobre la divisoria */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 360, height: 8 }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${arrow * 100}%`, background: C, borderRadius: 4, boxShadow: `0 0 16px ${C}AA`, transformOrigin: "left" }} />
          <div style={{ position: "absolute", left: `calc(${arrow * 100}% - 6px)`, top: -13, width: 0, height: 0, borderTop: "17px solid transparent", borderBottom: "17px solid transparent", borderLeft: `26px solid ${C}`, opacity: arrow > 0.6 ? 1 : 0 }} />
        </div>
      </AbsoluteFill>

      {/* insignia número */}
      {number && (
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: `translate(-50%,-50%) scale(${interpolate(badge, [0, 1], [0.2, 1])})`,
          opacity: interpolate(badge, [0, 1], [0, 1]),
          width: 132, height: 132, borderRadius: "50%", background: COLORS.ink,
          border: `4px solid ${C}`, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 10px 40px rgba(0,0,0,0.6), 0 0 30px ${C}66`, marginTop: -96,
        }}>
          <span style={{ fontSize: 76, fontWeight: 900, color: COLORS.bg0 }}>{number}</span>
        </div>
      )}

      {/* título inferior */}
      {title && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 80, textAlign: "center", padding: "0 120px",
          fontSize: 64, fontWeight: 800, color: COLORS.bg0,
          opacity: interpolate(titleS, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(titleS, [0, 1], [24, 0])}px)`,
          textShadow: "0 3px 22px rgba(0,0,0,0.8)",
        }}>{title}</div>
      )}

      {/* grano de papel */}
      <AbsoluteFill style={{ opacity: 0.06, backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")", mixBlendMode: "overlay" }} />

      {/* sfx del barrido */}
      <SfxCue at={revStart} src={SFX.whoosh2} volume={0.42} durationInFrames={sec(0.6)} />
      <SfxCue at={revStart + sec(0.2)} src={SFX.transition} volume={0.3} durationInFrames={sec(0.7)} />
    </AbsoluteFill>
  );
};
