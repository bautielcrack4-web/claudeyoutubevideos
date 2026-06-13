import { Fragment } from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, SPRING_SNAPPY, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";

// GENERIC checklist / shopping-list card — the signature "homemade/honest" overlay
// of the garden niche (caps title + green ticks). Topic-agnostic: pass the items
// per video (compost recipe, tools needed, steps already done). Each item has a
// state: "done" (green ✓), "doing" (empty box, pulsing — the in-progress one), or
// "todo" (faint empty box). Rule 14: card pops in, items reveal ONE BY ONE, each
// ✓ DRAWS itself on, the active row pulses — each beat with its own SFX (ding on
// every check, soft tick on plain rows).
export type CheckItem = { text: string; state?: "done" | "doing" | "todo"; note?: string };

const TONES = {
  accent: COLORS.accent,
  amber: COLORS.amber,
  good: COLORS.good,
  cold: COLORS.cold,
  danger: COLORS.danger,
} as const;

const BOX_W = 1040;

export const Checklist: React.FC<{
  durationInFrames: number;
  title: string;
  items: CheckItem[];
  eyebrow?: string;
  accent?: keyof typeof TONES; // tick / highlight color (default good = green)
  hue?: "blue" | "cold" | "amber" | "red";
  startAt?: number;
  stagger?: number;
  image?: string; // staticFile path → card sits over a real full-bleed photo (Rule 3 — "real images")
  imageBlur?: number;
  imageDarken?: number;
  pin?: "left" | "right" | "center"; // where the card sits when over a photo
}> = ({
  durationInFrames,
  title,
  items,
  eyebrow,
  accent = "good",
  hue = "cold",
  startAt = sec(0.6),
  stagger = sec(0.7),
  image,
  imageBlur,
  imageDarken,
  pin,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = TONES[accent];
  const card = spring({ frame, fps, config: SPRING_SOFT });
  // Brand light: tarjeta PARCHMENT clara sobre fondo (tinta oscura legible); sobre
  // FOTO, tarjeta de tinta oscura + texto CREMA. Limpio y suave, sin glow pesado.
  const onImage = !!image;
  const cardBg = onImage
    ? { background: "rgba(26,22,18,0.82)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)", border: "1px solid rgba(255,247,232,0.14)" }
    : { background: COLORS.bg1, boxShadow: "0 26px 64px rgba(42,38,32,0.16)", border: `1px solid ${COLORS.bg2}` };
  const inkMain = onImage ? COLORS.bg0 : COLORS.text;
  const inkDim = onImage ? "rgba(255,247,232,0.55)" : COLORS.textDim;
  const rowH = 92;
  const cardH = 150 + items.length * rowH + 40;
  const side = pin ?? (image ? "right" : "center");
  const contentStyle =
    side === "right"
      ? { justifyContent: "flex-end" as const, paddingRight: 96 }
      : side === "left"
      ? { justifyContent: "flex-start" as const, paddingLeft: 96 }
      : undefined;

  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue={hue}
      glowY={46}
      drift={0.4}
      bg={image ? "image" : "grid"}
      image={image}
      imageBlur={image ? imageBlur ?? 5 : undefined}
      imageDarken={image ? imageDarken ?? 0.42 : undefined}
      contentStyle={contentStyle}
    >
      <div style={{ position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={0} src={SFX.popUp} volume={0.45} />

        <div
          style={{
            width: BOX_W,
            ...cardBg,
            borderRadius: 34,
            padding: "44px 52px",
            opacity: card,
            transform: `scale(${0.94 + card * 0.06}) translateY(${(1 - card) * 22}px)`,
            minHeight: cardH,
          }}
        >
          {/* header */}
          {eyebrow && (
            <div style={{ letterSpacing: 5, fontSize: 17, fontWeight: 700, textTransform: "uppercase", color: C, opacity: card }}>
              {eyebrow}
            </div>
          )}
          <div style={{ fontSize: 46, fontWeight: 900, color: inkMain, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 6, marginBottom: 26, opacity: card }}>
            {title}
          </div>

          {/* items */}
          {items.map((it, i) => {
            const t0 = startAt + i * stagger;
            const s = spring({ frame: frame - t0, fps, config: SPRING_SNAPPY });
            const state = it.state ?? "todo";
            const isDone = state === "done";
            const isDoing = state === "doing";
            // ✓ draws on shortly after the row appears
            const tick = spring({ frame: frame - (t0 + sec(0.2)), fps, config: { damping: 200, mass: 1, stiffness: 80 } });
            const pulse = isDoing ? 0.5 + 0.5 * Math.sin(frame / 10) : 0;
            const boxColor = isDone ? C : isDoing ? C : inkDim;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  height: rowH,
                  opacity: s,
                  transform: `translateX(${(1 - s) * 28}px)`,
                }}
              >
                {/* checkbox */}
                <svg width={52} height={52} viewBox="0 0 52 52" style={{ flex: "0 0 auto" }}>
                  <rect
                    x={4}
                    y={4}
                    width={44}
                    height={44}
                    rx={13}
                    fill={isDone ? C : "transparent"}
                    stroke={boxColor}
                    strokeWidth={3}
                    opacity={isDoing ? 0.55 + pulse * 0.45 : 1}
                  />
                  {isDone && (
                    <path
                      d="M 14 27 L 23 36 L 39 17"
                      fill="none"
                      stroke={onImage ? COLORS.bg0 : "#FBF6E9"}
                      strokeWidth={5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1 - tick}
                    />
                  )}
                </svg>

                {/* label */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      color: inkMain,
                    }}
                  >
                    {it.text}
                  </span>
                  {it.note && (
                    <span style={{ fontSize: 20, fontWeight: 600, color: inkDim, marginTop: 2 }}>{it.note}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* SFX: ding when a row that's DONE draws its check; soft tick otherwise */}
        {items.map((it, i) => {
          const t0 = startAt + i * stagger;
          const done = (it.state ?? "todo") === "done";
          return (
            <Fragment key={"sfx" + i}>
              <SfxCue at={t0 + (done ? sec(0.2) : 0)} src={done ? SFX.ui5 : SFX.click} volume={done ? 0.55 : 0.32} />
            </Fragment>
          );
        })}
      </div>
    </SceneFrame>
  );
};
