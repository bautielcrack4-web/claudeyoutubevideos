import { Fragment } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  AbsoluteFill,
  OffthreadVideo,
} from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, SPRING_SNAPPY, sec } from "../theme";
import { Media } from "../components/Media";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX, POPS } from "../components/Sfx";

// AVATAR-PRESENTATION — the "explainer board" beat: the talking head shrinks to a
// SMALL box in the TOP-RIGHT corner while a PRESENTATION (one or more GPT-image
// generated láminas) plays big in the main area. Data-driven: pass slides[] (each a
// staticFile image path + optional title/note). Self-contained: it renders its OWN
// small avatar box (Video from @remotion/media, manual cover sizing like Main's
// ReframedVideo) so it can be developed/validated in KitDemo without touching Main.
// Avatar is OPTIONAL — without it a neutral portrait placeholder is shown.
// Rule 14: presentation Ken-Burns-zooms + crossfades between slides, avatar box
// springs in from the right and floats, slide dots tick — each motion gets an SFX.
export type Slide = {
  image?: string; // staticFile path of the GPT-generated lámina; fallback gradient
  title?: string; // optional caption chip over the slide
  note?: string;
};

const TONES = {
  accent: COLORS.accent,
  amber: COLORS.amber,
  good: COLORS.good,
  cold: COLORS.cold,
  danger: COLORS.danger,
} as const;

// presentation card (big, 16:9), biased slightly left so the avatar corner breathes
const CARD_W = 1560;
const CARD_H = 878;
const CARD_X = 70;
const CARD_Y = 150;

// small avatar box, top-right corner (portrait)
const AV_W = 372;
const AV_H = 496;
const AV_MARGIN = 54;

export const AvatarPresentation: React.FC<{
  durationInFrames: number;
  slides: Slide[];
  avatar?: string; // staticFile video src for the small box; placeholder if absent
  avatarFrom?: number; // GLOBAL frame where this cue starts — keeps the small box
  //                      lip-synced to the narration via Video trimBefore
  eyebrow?: string;
  hue?: "blue" | "cold" | "amber" | "red";
  accent?: keyof typeof TONES;
}> = ({ durationInFrames, slides, avatar, avatarFrom, eyebrow, hue = "cold", accent = "accent" }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const C = TONES[accent];

  // ── presentation card entrance ─────────────────────────────────────────────
  const cardIn = spring({ frame: frame - sec(0.3), fps, config: SPRING_SOFT });

  // ── slides: crossfade + per-slide Ken Burns ────────────────────────────────
  const n = Math.max(1, slides.length);
  const intro = sec(0.7);
  const slideDur = (durationInFrames - intro) / n;
  const active = Math.min(n - 1, Math.floor((frame - intro) / slideDur));

  // ── avatar box: springs in from the right + continuous float ───────────────
  const avIn = spring({ frame: frame - sec(0.5), fps, config: SPRING_SNAPPY });
  const avX = width - AV_W - AV_MARGIN + (1 - avIn) * (AV_W + AV_MARGIN + 40);
  const float = Math.sin(frame / 26) * 6;

  // avatar cover sizing (same idea as Main's ReframedVideo)
  const ratio = 16 / 9;
  let coverW = Math.max(AV_W, AV_H * ratio);
  let coverH = coverW / ratio;
  const kbA = interpolate(frame, [0, durationInFrames], [1.0, 1.07], { extrapolateRight: "clamp" });
  coverW *= kbA;
  coverH *= kbA;
  const offX = (AV_W - coverW) / 2;
  const offY = (AV_H - coverH) * 0.3; // bias toward the face

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <TechBackground glowX={38} glowY={42} hue={hue} drift={0.5} />
      <SfxCue at={sec(0.3)} src={SFX.whoosh} volume={0.45} />
      <SfxCue at={sec(0.5)} src={SFX.transition} volume={0.4} />

      {eyebrow && (
        <div
          style={{
            position: "absolute",
            top: 70,
            left: CARD_X,
            letterSpacing: 6,
            fontSize: 22,
            fontWeight: 800,
            textTransform: "uppercase",
            color: COLORS.textDim,
            opacity: cardIn,
            transform: `translateY(${(1 - cardIn) * -12}px)`,
          }}
        >
          {eyebrow}
        </div>
      )}

      {/* presentation card — premium editorial frame, holds the lámina */}
      <div
        style={{
          position: "absolute",
          left: CARD_X,
          top: CARD_Y,
          width: CARD_W,
          height: CARD_H,
          borderRadius: 28,
          overflow: "hidden",
          opacity: cardIn,
          transform: `scale(${0.96 + cardIn * 0.04}) translateY(${(1 - cardIn) * 24}px)`,
          boxShadow: "0 40px 110px rgba(0,0,0,0.62)",
          border: "1px solid rgba(255,255,255,0.14)",
          background: COLORS.bg2,
        }}
      >
        {slides.map((s, i) => {
          const t0 = intro + (i - 1) * slideDur; // crossfade starts a touch before its window
          const local = frame - (intro + i * slideDur);
          const inOp = interpolate(frame, [t0 + slideDur - sec(0.5), t0 + slideDur], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const op = i === 0 ? 1 : inOp;
          // Ken Burns per slide: slow zoom + drift, alternating pan direction
          const kb = 1.05 + Math.max(0, local) / Math.max(1, slideDur) * 0.12;
          const panX = (i % 2 === 0 ? 1 : -1) * Math.max(0, local) / Math.max(1, slideDur) * 26;
          return (
            <div key={i} style={{ position: "absolute", inset: 0, opacity: op }}>
              <div style={{ position: "absolute", inset: 0, transform: `scale(${kb}) translateX(${panX}px)` }}>
                {s.image ? (
                  <Media src={s.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background:
                        "radial-gradient(120% 120% at 35% 28%, #F6F0E2, #E3D7BC 55%, #C9B68C)",
                    }}
                  />
                )}
              </div>
              {/* soft bottom scrim for caption legibility */}
              {s.title && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.42))",
                  }}
                />
              )}
            </div>
          );
        })}

        {/* active slide caption chip (pops over the lámina) */}
        {slides[active]?.title && (
          <SlideCaption
            key={active}
            title={slides[active].title!}
            note={slides[active].note}
            color={C}
            startFrame={intro + active * slideDur}
          />
        )}
      </div>

      {/* slide-progress dots */}
      {n > 1 && (
        <div
          style={{
            position: "absolute",
            left: CARD_X,
            top: CARD_Y + CARD_H + 26,
            display: "flex",
            gap: 12,
            opacity: cardIn,
          }}
        >
          {slides.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === active ? 34 : 12,
                height: 12,
                borderRadius: 6,
                background: i === active ? C : "rgba(255,255,255,0.22)",
                boxShadow: i === active ? `0 0 14px ${C}aa` : "none",
                transition: "none",
              }}
            />
          ))}
        </div>
      )}

      {/* the avatar — small rounded box, top-right corner, floating */}
      <div
        style={{
          position: "absolute",
          left: avX,
          top: AV_MARGIN + float,
          width: AV_W,
          height: AV_H,
          borderRadius: 30,
          overflow: "hidden",
          opacity: avIn,
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 2px ${C}55, 0 0 40px ${C}33`,
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        {avatar ? (
          <OffthreadVideo
            src={staticFile(avatar)}
            trimBefore={avatarFrom}
            muted
            style={{ position: "absolute", left: offX, top: offY, width: coverW, height: coverH }}
          />
        ) : (
          <AvatarPlaceholder />
        )}
        {/* subtle inner vignette */}
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 -60px 80px rgba(0,0,0,0.45)" }} />
      </div>

      {/* SFX: a whoosh as each slide crosses in + a tick when the dot advances */}
      {slides.map((s, i) => {
        if (i === 0) return null;
        const at = intro + i * slideDur - sec(0.5);
        return (
          <Fragment key={"sfx" + i}>
            <SfxCue at={at} src={SFX.transition} volume={0.36} durationInFrames={sec(0.7)} />
            <SfxCue at={intro + i * slideDur} src={POPS[i % POPS.length]} volume={0.4} />
            {s.title && <SfxCue at={intro + i * slideDur + sec(0.25)} src={SFX.click} volume={0.32} />}
          </Fragment>
        );
      })}
      {slides[0]?.title && <SfxCue at={intro + sec(0.25)} src={SFX.click} volume={0.32} />}
    </AbsoluteFill>
  );
};

// caption chip that pops in over the lámina, with its own little life
const SlideCaption: React.FC<{ title: string; note?: string; color: string; startFrame: number }> = ({
  title,
  note,
  color,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - (startFrame + sec(0.2)), fps, config: SPRING_SNAPPY });
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        bottom: 40,
        right: 40,
        opacity: pop,
        transform: `translateY(${(1 - pop) * 18}px)`,
      }}
    >
      <div style={{ display: "inline-flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            display: "inline-block",
            padding: "12px 22px",
            borderRadius: 16,
            background: "rgba(34,30,26,0.82)", // dark ink chip (legible over any photo)
            border: `2px solid ${color}cc`,
            color: COLORS.bg0, // cream text on the dark chip
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: 0.3,
            boxShadow: `0 12px 36px rgba(0,0,0,0.5)`,
          }}
        >
          {title}
        </div>
        {note && (
          <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.textSoft, paddingLeft: 4 }}>{note}</span>
        )}
      </div>
    </div>
  );
};

const AvatarPlaceholder: React.FC = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: "radial-gradient(120% 100% at 50% 30%, #2a2f3a, #15171d 70%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {/* simple head/shoulders silhouette */}
    <svg width="200" height="240" viewBox="0 0 200 240">
      <circle cx="100" cy="78" r="48" fill="rgba(255,255,255,0.14)" />
      <path d="M30 240 C30 168 60 140 100 140 C140 140 170 168 170 240 Z" fill="rgba(255,255,255,0.14)" />
    </svg>
  </div>
);
