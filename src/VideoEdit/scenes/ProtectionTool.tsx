import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK, FONT_DISPLAY, glass, sec } from "../theme_ben";
import { SfxCue, SFX } from "../components/Sfx";

// ProtectionTool — tarjeta premium reutilizable para CADA herramienta legal (fideicomiso,
// lady bird deed, hijo cuidador). Escudo verde que se dibuja + nombre ES grande + nombre
// EN chico + cómo funciona en 1 línea. Verde = "a salvo / protección".
export const ProtectionTool: React.FC<{
  durationInFrames: number;
  number?: string; // "1"
  nameEs: string; // "Fideicomiso irrevocable"
  nameEn?: string; // "Medicaid Asset Protection Trust"
  how: string; // cómo funciona en 1 frase
  eyebrow?: string; // "Herramienta"
  image?: string; // foto de fondo opcional
}> = ({ durationInFrames, number, nameEs, nameEn, how, eyebrow = "Herramienta", image }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const G = COLORS.good;

  const enter = spring({ frame, fps, config: { damping: 16, mass: 0.9, stiffness: 140 } });
  const draw = interpolate(frame, [sec(0.4), sec(1.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const check = spring({ frame: frame - sec(1.1), fps, config: { damping: 11, mass: 0.7, stiffness: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      {image && (
        <AbsoluteFill>
          <img src={image} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(7px) saturate(0.7)" }} />
          <AbsoluteFill style={{ background: "rgba(8,8,11,0.74)" }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 50%, ${G}22, transparent 60%)` }} />
      <SfxCue at={sec(0.4)} src={SFX.lineDraw} volume={0.28} />
      <SfxCue at={sec(1.1)} src={SFX.winnerChime} volume={0.26} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...glass("dark"), borderTop: `8px solid ${G}`, width: 1240, padding: "52px 64px", display: "flex", alignItems: "center", gap: 56, transform: `translateY(${(1 - enter) * 40}px) scale(${0.94 + enter * 0.06})`, opacity: enter }}>
          {/* escudo que se dibuja */}
          <svg viewBox="0 0 120 140" style={{ width: 200, height: 234, flexShrink: 0, overflow: "visible" }}>
            <path d="M60 8 L110 30 V72 C110 110 86 128 60 134 C34 128 10 110 10 72 V30 Z" fill={`${G}1c`} stroke={G} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{ filter: `drop-shadow(0 0 10px ${G}66)` }} />
            <path d="M40 70 L55 88 L84 50" fill="none" stroke={G} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ color: G, letterSpacing: 5, fontSize: 23, fontWeight: 800, fontFamily: FONT_DISPLAY, marginBottom: 10 }}>{eyebrow}{number ? ` ${number}` : ""}</div>
            <div style={{ color: COLORS.text, fontSize: 56, fontWeight: 900, lineHeight: 1.02, letterSpacing: -0.5 }}>{nameEs}</div>
            {nameEn && <div style={{ color: G, fontSize: 26, fontWeight: 700, marginTop: 6, fontStyle: "italic" }}>{nameEn}</div>}
            <div style={{ color: COLORS.textSoft, fontSize: 29, fontWeight: 600, marginTop: 20, lineHeight: 1.3, maxWidth: 820 }}>{how}</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
