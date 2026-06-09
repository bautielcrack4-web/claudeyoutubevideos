import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONT_STACK, glass } from "./theme";
import { SceneFrame } from "./components/SceneFrame";
import { DepthCard } from "./components/DepthCard";
import { stagger } from "./lib/anim";

// Kit de escenas con FOTO/diagrama para el video mongol. Las imágenes viven en
// public/img/<nombre>.jpg y se referencian por NOMBRE (no por número).
const img = (name: string) => `img/${name}.jpg`;

// ----- Lower-third caption sobre foto/diagrama a pantalla completa -----
export const PhotoScene: React.FC<{
  durationInFrames: number;
  name: string;
  caption?: string;
  kicker?: string;
  hue?: "blue" | "amber" | "red";
  darken?: number;
  accent?: string;
  tint?: string;
  blur?: number;
}> = ({
  durationInFrames,
  name,
  caption,
  kicker,
  hue = "blue",
  darken = 0.34,
  accent = COLORS.accent,
  tint,
  blur = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const capIn = spring({ frame: frame - 8, fps, config: { damping: 18, mass: 0.7 } });

  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue={hue}
      bg="image"
      image={img(name)}
      imageBlur={blur}
      imageDarken={darken}
      imageTint={tint}
      zoom={[1.05, 1.13]}
      contentStyle={{ alignItems: "flex-start", justifyContent: "flex-end" }}
    >
      {(kicker || caption) && (
        <div
          style={{
            margin: "0 0 78px 92px",
            maxWidth: 1180,
            display: "flex",
            gap: 26,
            alignItems: "stretch",
            transform: `translateY(${(1 - capIn) * 46}px)`,
            opacity: capIn,
          }}
        >
          <div style={{ width: 7, borderRadius: 8, background: accent, boxShadow: `0 0 24px ${accent}aa` }} />
          <div style={{ ...glass("dark"), padding: "22px 34px", borderRadius: 22 }}>
            {kicker && (
              <div
                style={{
                  fontFamily: FONT_STACK,
                  fontSize: 24,
                  fontWeight: 800,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: accent,
                  marginBottom: caption ? 10 : 0,
                }}
              >
                {kicker}
              </div>
            )}
            {caption && (
              <div
                style={{
                  fontFamily: FONT_STACK,
                  fontSize: 46,
                  fontWeight: 700,
                  lineHeight: 1.12,
                  color: COLORS.text,
                }}
              >
                {caption}
              </div>
            )}
          </div>
        </div>
      )}
    </SceneFrame>
  );
};

// ----- Trío/dúo de tarjetas flotantes con foto (look premium, profundidad) ----
export const PhotoCards: React.FC<{
  durationInFrames: number;
  title?: string;
  items: { name: string; label: string; caption?: string; accent?: string }[];
  hue?: "blue" | "amber" | "red";
}> = ({ durationInFrames, title, items, hue = "blue" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleIn = spring({ frame, fps, config: { damping: 18, mass: 0.7 } });
  const cardW = items.length >= 3 ? 470 : 560;
  const cardH = 600;

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} bg="grid">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        {title && (
          <div
            style={{
              fontFamily: FONT_STACK,
              fontSize: 50,
              fontWeight: 800,
              color: COLORS.text,
              textAlign: "center",
              transform: `translateY(${(1 - titleIn) * 30}px)`,
              opacity: titleIn,
            }}
          >
            {title}
          </div>
        )}
        <div style={{ display: "flex", gap: 40, justifyContent: "center" }}>
          {items.map((it, i) => {
            const s = stagger(frame, fps, i, 16, 10);
            const accent = it.accent ?? COLORS.accent;
            return (
              <div
                key={i}
                style={{
                  transform: `translateY(${(1 - s) * 60}px) scale(${0.9 + s * 0.1})`,
                  opacity: s,
                }}
              >
                <DepthCard accent={accent} image={img(it.name)} width={cardW} height={cardH} radius={30} blur={3} darken={0.42} seed={i + 1}>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: "30px 30px 34px",
                      fontFamily: FONT_STACK,
                    }}
                  >
                    <div style={{ fontSize: 38, fontWeight: 800, color: COLORS.text, lineHeight: 1.1 }}>{it.label}</div>
                    {it.caption && (
                      <div style={{ fontSize: 25, fontWeight: 500, color: COLORS.textSoft, marginTop: 8 }}>{it.caption}</div>
                    )}
                  </div>
                </DepthCard>
              </div>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};

// ----- Cita grande sobre foto oscura (momento emocional) -----
export const QuoteScene: React.FC<{
  durationInFrames: number;
  name: string;
  quote: string;
  attribution?: string;
  accent?: string;
}> = ({ durationInFrames, name, quote, attribution, accent = COLORS.amber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame: frame - 6, fps, config: { damping: 20, mass: 0.9 } });

  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      bg="image"
      image={img(name)}
      imageBlur={6}
      imageDarken={0.66}
      zoom={[1.06, 1.14]}
    >
      <div style={{ maxWidth: 1300, textAlign: "center", padding: "0 80px", opacity: inn, transform: `translateY(${(1 - inn) * 30}px)` }}>
        <div style={{ fontFamily: FONT_STACK, fontSize: 160, lineHeight: 0.6, color: accent, fontWeight: 900, marginBottom: 18 }}>“</div>
        <div style={{ fontFamily: FONT_STACK, fontSize: 56, fontWeight: 700, lineHeight: 1.25, color: COLORS.text, fontStyle: "italic" }}>
          {quote}
        </div>
        {attribution && (
          <div style={{ fontFamily: FONT_STACK, fontSize: 30, fontWeight: 600, color: COLORS.textSoft, marginTop: 34, letterSpacing: 1 }}>
            — {attribution}
          </div>
        )}
      </div>
    </SceneFrame>
  );
};

// ----- Checklist de ítems con tilde sobre foto/negro (recap, principios) -----
export const CheckList: React.FC<{
  durationInFrames: number;
  title?: string;
  items: string[];
  name?: string; // foto de fondo opcional
  accent?: string;
  hue?: "blue" | "amber" | "red";
}> = ({ durationInFrames, title, items, name, accent = COLORS.good, hue = "blue" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleIn = spring({ frame, fps, config: { damping: 18, mass: 0.7 } });

  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue={hue}
      bg={name ? "image" : "black"}
      image={name ? img(name) : undefined}
      imageBlur={name ? 8 : undefined}
      imageDarken={name ? 0.66 : undefined}
    >
      <div style={{ ...glass("dark"), padding: "44px 56px", borderRadius: 28, minWidth: 760, maxWidth: 1200 }}>
        {title && (
          <div
            style={{
              fontFamily: FONT_STACK,
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: COLORS.text,
              marginBottom: 30,
              transform: `translateY(${(1 - titleIn) * 20}px)`,
              opacity: titleIn,
            }}
          >
            {title}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {items.map((it, i) => {
            const s = stagger(frame, fps, i, 14, 12);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, opacity: s, transform: `translateX(${(1 - s) * -30}px)` }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: `${accent}22`,
                    border: `2px solid ${accent}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: `0 0 20px ${accent}55`,
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12.5l5 5L20 6.5" stroke={accent} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ fontFamily: FONT_STACK, fontSize: 36, fontWeight: 600, color: COLORS.text }}>{it}</div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};
