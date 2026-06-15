import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONT_STACK, FONT_DISPLAY, glass, sec } from "../theme_ben";
import { SfxCue, SFX } from "../components/Sfx";

// MedicareVsMedicaid — el "primer golpe": comparación a dos columnas de qué cubre cada
// programa, con ✓ verde / ✗ rojo. Las columnas entran desde los lados y los ítems caen
// escalonados. Genérico: pasale los títulos e ítems.
type Item = { text: string; ok: boolean };
const Col: React.FC<{ title: string; items: Item[]; t: number; frame: number; fps: number; baseDelay: number; side: number }> = ({ title, items, t, frame, fps, baseDelay, side }) => (
  <div style={{ ...glass("dark"), width: 720, padding: "40px 44px", transform: `translateX(${(1 - t) * side * 70}px)`, opacity: t }}>
    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 46, color: COLORS.text, letterSpacing: 1, textAlign: "center", marginBottom: 28, borderBottom: `2px solid ${COLORS.textDim}`, paddingBottom: 16 }}>{title}</div>
    {items.map((it, i) => {
      const p = spring({ frame: frame - sec(baseDelay + i * 0.32), fps, config: { damping: 14, mass: 0.7, stiffness: 200 } });
      const C = it.ok ? COLORS.good : COLORS.accent;
      return (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
          <span style={{ flexShrink: 0, width: 42, height: 42, borderRadius: "50%", background: C, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900 }}>{it.ok ? "✓" : "✕"}</span>
          <span style={{ color: COLORS.text, fontSize: 30, fontWeight: 700 }}>{it.text}</span>
        </div>
      );
    })}
  </div>
);

export const MedicareVsMedicaid: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  leftTitle: string;
  leftItems: Item[];
  rightTitle: string;
  rightItems: Item[];
}> = ({ durationInFrames, eyebrow = "El primer golpe", leftTitle, leftItems, rightTitle, rightItems }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inL = spring({ frame: frame - sec(0.2), fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });
  const inR = spring({ frame: frame - sec(0.4), fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${COLORS.accent}14, ${COLORS.bg0} 65%)` }} />
      <SfxCue at={sec(0.2)} src={SFX.whoosh} volume={0.2} />
      <SfxCue at={sec(0.4)} src={SFX.whoosh2} volume={0.18} />

      <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", color: COLORS.accent, letterSpacing: 6, fontSize: 26, fontWeight: 800, fontFamily: FONT_DISPLAY, textTransform: "uppercase" }}>{eyebrow}</div>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 40, paddingTop: 40 }}>
        <Col title={leftTitle} items={leftItems} t={inL} frame={frame} fps={fps} baseDelay={0.7} side={-1} />
        <div style={{ color: COLORS.textDim, fontFamily: FONT_DISPLAY, fontSize: 60, opacity: Math.min(inL, inR) }}>vs</div>
        <Col title={rightTitle} items={rightItems} t={inR} frame={frame} fps={fps} baseDelay={0.9} side={1} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
