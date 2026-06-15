import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONT_STACK, FONT_DISPLAY, sec } from "../theme_ben";
import { SfxCue, SFX } from "../components/Sfx";

// SignaturePhrase — la frase firma del cierre, tuiteable. Tipografía cinética: las líneas
// entran palabra por palabra, las partes `gold` aterrizan en amarillo con resplandor y un
// subrayado que se dibuja. Casi en silencio + un swell suave. Look alarma (negro/oro).
export const SignaturePhrase: React.FC<{
  durationInFrames: number;
  lines: { text: string; gold?: boolean }[]; // cada línea, marca gold las clave
  eyebrow?: string;
}> = ({ durationInFrames, lines, eyebrow }) => {
  const frame = useCurrentFrame();
  const GOLD = COLORS.amber;

  // repartir tokens en orden global para el stagger
  let tok = 0;
  const total = lines.reduce((a, l) => a + l.text.split(" ").length, 0);
  const goldLineIdx = lines.findIndex((l) => l.gold);
  const underline = goldLineIdx >= 0 ? interpolate(frame, [sec(1.6), sec(2.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${GOLD}12, ${COLORS.bg0} 60%)` }} />
      <SfxCue at={sec(0.3)} src={SFX.sectionSwell} volume={0.2} />

      <div style={{ textAlign: "center", maxWidth: 1400, padding: "0 80px" }}>
        {eyebrow && <div style={{ color: COLORS.textDim, letterSpacing: 8, fontSize: 22, fontWeight: 800, textTransform: "uppercase", marginBottom: 30 }}>{eyebrow}</div>}
        {lines.map((l, li) => (
          <div key={li} style={{ position: "relative", display: "inline-block", width: "100%" }}>
            <div style={{ fontFamily: l.gold ? FONT_DISPLAY : FONT_STACK, fontSize: l.gold ? 84 : 60, fontWeight: l.gold ? 400 : 800, color: l.gold ? GOLD : COLORS.text, lineHeight: 1.18, letterSpacing: l.gold ? 0.5 : -0.5, textShadow: l.gold ? `0 0 40px ${GOLD}44` : "none" }}>
              {l.text.split(" ").map((w, wi) => {
                const at = sec(0.4) + (tok++ / total) * sec(2.2);
                const op = interpolate(frame, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const y = (1 - op) * 18;
                return (
                  <span key={wi} style={{ display: "inline-block", opacity: op, transform: `translateY(${y}px)`, marginRight: "0.28em" }}>{w}</span>
                );
              })}
            </div>
            {l.gold && (
              <svg viewBox="0 0 600 30" style={{ width: "60%", height: 26, margin: "4px auto 0", display: "block", overflow: "visible" }}>
                <path d="M10 16 C 160 4, 320 26, 590 12" fill="none" stroke={GOLD} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - underline} style={{ filter: `drop-shadow(0 0 6px ${GOLD}aa)` }} />
              </svg>
            )}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
