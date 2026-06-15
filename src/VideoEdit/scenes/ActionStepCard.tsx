import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONT_STACK, FONT_DISPLAY, glass, sec } from "../theme_ben";
import { SfxCue, SFX } from "../components/Sfx";

// ActionStepCard — el paso concreto que el espectador puede dar esta semana: llamar a un
// abogado de Elder Law + la PREGUNTA exacta a hacer (en una caja de cita). Verde acción.
export const ActionStepCard: React.FC<{
  durationInFrames: number;
  eyebrow?: string; // "Esta semana"
  step: string; // "Llamá a un abogado de Elder Law"
  question: string; // la pregunta exacta a hacer
}> = ({ durationInFrames, eyebrow = "Esta semana", step, question }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const G = COLORS.good;

  const enter = spring({ frame, fps, config: { damping: 16, mass: 0.9, stiffness: 130 } });
  const qp = spring({ frame: frame - sec(0.7), fps, config: { damping: 15, mass: 0.8, stiffness: 150 } });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 44%, ${G}1c, ${COLORS.bg0} 62%)` }} />
      <SfxCue at={sec(0.1)} src={SFX.whoosh} volume={0.2} />
      <SfxCue at={sec(0.7)} src={SFX.chipPop3d} volume={0.3} />

      <div style={{ width: 1180, transform: `translateY(${(1 - enter) * 40}px)`, opacity: enter }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 28 }}>
          <div style={{ width: 86, height: 86, borderRadius: 20, background: G, color: "#06210F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, flexShrink: 0 }}>✆</div>
          <div>
            <div style={{ color: G, letterSpacing: 5, fontSize: 22, fontWeight: 800, fontFamily: FONT_DISPLAY }}>{eyebrow.toUpperCase()}</div>
            <div style={{ color: COLORS.text, fontSize: 50, fontWeight: 900, lineHeight: 1.05, marginTop: 6 }}>{step}</div>
          </div>
        </div>
        {/* caja con la pregunta exacta */}
        <div style={{ ...glass("dark"), borderLeft: `8px solid ${G}`, padding: "34px 40px", transform: `scale(${0.96 + qp * 0.04})`, opacity: qp }}>
          <div style={{ color: COLORS.textDim, fontSize: 22, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>LA PREGUNTA EXACTA:</div>
          <div style={{ color: COLORS.text, fontSize: 38, fontWeight: 700, lineHeight: 1.32, fontStyle: "italic" }}>“{question}”</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
