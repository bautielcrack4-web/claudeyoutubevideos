import { Fragment } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX, POPS } from "../components/Sfx";
import { Media } from "../components/Media";

// GENERIC "aged document / old book" text reveal. Topic-agnostic — pass a heading
// + lines (with optional highlighted phrases) over an aged-paper texture (or a
// real book photo via `image`). Rule 14: the page Ken-Burns drifts, the heading
// writes on, lines fade UP one by one, highlighted phrases get a drawn-on marker
// swipe — each beat staggered with its own SFX (page whoosh, ticks, marker scratch).
export type DocLine = { text: string; mark?: boolean };

const TONES = {
  accent: COLORS.accent,
  amber: COLORS.amber,
  good: COLORS.good,
  cold: COLORS.cold,
  danger: COLORS.danger,
} as const;

const BOX_W = 1360;
const BOX_H = 820;

export const AgedDoc: React.FC<{
  durationInFrames: number;
  heading: string;
  lines: DocLine[];
  eyebrow?: string;
  image?: string; // staticFile path to a book/parchment photo; else paper fallback
  accent?: keyof typeof TONES;
  hue?: "blue" | "cold" | "amber" | "red";
  startAt?: number;
  perLine?: number;
  markDelay?: number; // pausa tras aparecer la línea antes de dibujar el subrayado
}> = ({
  durationInFrames,
  heading,
  lines,
  eyebrow,
  image,
  accent = "accent",
  hue = "amber",
  startAt = sec(0.5),
  perLine = sec(0.6),
  markDelay = sec(1.2), // dramático: la línea se asienta, recién después se subraya
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = TONES[accent];

  const paperIn = interpolate(frame, [0, sec(0.7)], [0, 1], { extrapolateRight: "clamp" });
  const kb = 1.05 + (frame / Math.max(1, durationInFrames)) * 0.08;

  const headSpring = spring({ frame: frame - startAt, fps, config: SPRING_SOFT });
  const headWipe = interpolate(headSpring, [0, 1], [0, 100]);

  const linesStart = startAt + sec(0.6);

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={48} drift={0.35}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <SfxCue at={0} src={SFX.whoosh} volume={0.4} />

        {/* aged paper page (or book photo) with a slow drift */}
        <div
          style={{
            position: "relative",
            width: 1040,
            height: 700,
            transform: `scale(${0.96 + paperIn * 0.04}) rotate(-0.6deg)`,
            opacity: paperIn,
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, transform: `scale(${kb})` }}>
            {image ? (
              <Media src={image} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.3) contrast(1.04) brightness(0.96)" }} />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "radial-gradient(120% 120% at 30% 10%, #efe2c4, #e3d2ab 55%, #cdb685 100%)",
                }}
              />
            )}
          </div>
          {/* foxing / stain vignette + fibre lines for an aged feel */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(110% 110% at 50% 40%, transparent 55%, rgba(80,55,20,0.34) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.5, background: "repeating-linear-gradient(91deg, rgba(90,65,25,0.05) 0 1px, transparent 1px 7px)" }} />

          {/* text block on the page */}
          <div style={{ position: "absolute", inset: 0, padding: "78px 86px", color: "#3A2C16" }}>
            {eyebrow && (
              <div style={{ letterSpacing: 5, fontSize: 18, fontWeight: 700, textTransform: "uppercase", color: "rgba(58,44,22,0.6)", opacity: headSpring, marginBottom: 14 }}>
                {eyebrow}
              </div>
            )}
            <div
              style={{
                fontFamily: FONT_STACK,
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.06,
                marginBottom: 34,
                clipPath: `inset(0 ${100 - headWipe}% 0 0)`,
                WebkitClipPath: `inset(0 ${100 - headWipe}% 0 0)`,
              }}
            >
              {heading}
            </div>

            {lines.map((ln, i) => {
              const t0 = linesStart + i * perLine;
              const s = spring({ frame: frame - t0, fps, config: SPRING_SOFT });
              // subrayado lento y dramático: arranca markDelay después de la línea y
              // se dibuja despacio (stiffness baja + muy amortiguado).
              const markSwipe = interpolate(spring({ frame: frame - (t0 + markDelay), fps, config: { damping: 200, mass: 1, stiffness: 42 } }), [0, 1], [0, 100]);
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: FONT_STACK,
                    fontSize: 33,
                    fontWeight: ln.mark ? 700 : 500,
                    lineHeight: 1.5,
                    opacity: s,
                    transform: `translateY(${(1 - s) * 14}px)`,
                    display: "block",
                  }}
                >
                  {/* inner inline-block so the marker hugs the text, while each
                      line still stacks on its own row */}
                  <span style={{ position: "relative", display: "inline-block" }}>
                    {/* highlighter marker swipe behind marked lines */}
                    {ln.mark && (
                      <span
                        style={{
                          position: "absolute",
                          left: -6,
                          right: -6,
                          top: "16%",
                          bottom: "12%",
                          background: `${C}66`,
                          borderRadius: 4,
                          transform: "rotate(-0.6deg)",
                          clipPath: `inset(0 ${100 - markSwipe}% 0 0)`,
                          WebkitClipPath: `inset(0 ${100 - markSwipe}% 0 0)`,
                          zIndex: 0,
                        }}
                      />
                    )}
                    <span style={{ position: "relative", zIndex: 1 }}>{ln.text}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SFX: tick as each line fades up; marker scratch on highlighted lines */}
        <SfxCue at={startAt} src={SFX.ui7} volume={0.42} durationInFrames={sec(0.7)} />
        {lines.map((ln, i) => {
          const t0 = linesStart + i * perLine;
          return (
            <Fragment key={"sfx" + i}>
              <SfxCue at={t0} src={SFX.click} volume={0.32} />
              {ln.mark && <SfxCue at={t0 + markDelay} src={POPS[i % POPS.length]} volume={0.45} />}
            </Fragment>
          );
        })}
      </div>
    </SceneFrame>
  );
};
