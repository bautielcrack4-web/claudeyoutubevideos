import { Fragment } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { Media } from "../components/Media";
import { SfxCue, SFX } from "../components/Sfx";

// GENERIC annotated REAL PHOTO — the heart of the garden/build niche: a real image
// (the actual material / step) with hand-drawn annotations that DRAW themselves on:
// circles, arrows, underlines + small labels pointing at parts of the photo.
// Topic-agnostic: pass the image + annotations [{kind,x,y,...,label}] in NORMALIZED
// 0..1 coords. Rule 14: photo Ken-Burns-zooms in, each annotation strokes ON in
// sequence with its label popping, marker scratch SFX per annotation.
export type Annotation = {
  kind: "circle" | "arrow" | "underline";
  x: number; // 0..1 anchor (circle center / arrow head / underline center)
  y: number;
  w?: number; // circle radius / underline half-width (0..1 of width), default 0.12
  h?: number; // circle radius y (0..1 of height), default = w*aspect
  fromX?: number; // arrow tail (0..1) — required for arrows
  fromY?: number;
  label?: string;
  color?: keyof typeof TONES;
};

const TONES = {
  accent: COLORS.accent,
  amber: COLORS.amber,
  good: COLORS.good,
  cold: COLORS.cold,
  danger: COLORS.danger,
} as const;

const BOX_W = 1500;
const BOX_H = 840;
const IMG_W = 1500;
const IMG_H = 760;

export const AnnotatedImage: React.FC<{
  durationInFrames: number;
  image?: string; // staticFile path; falls back to a neutral photo placeholder
  eyebrow?: string;
  caption?: string;
  annotations: Annotation[];
  hue?: "blue" | "cold" | "amber" | "red";
  startAt?: number;
  stagger?: number;
}> = ({
  durationInFrames,
  image,
  eyebrow,
  caption,
  annotations,
  hue = "cold",
  startAt = sec(0.8),
  stagger = sec(0.9),
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const photoIn = interpolate(frame, [0, sec(0.7)], [0, 1], { extrapolateRight: "clamp" });
  const kb = 1.05 + (frame / Math.max(1, durationInFrames)) * 0.1;
  const head = spring({ frame, fps, config: SPRING_SOFT });

  const px = (x: number) => x * IMG_W;
  const py = (y: number) => y * IMG_H;

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={46} drift={0.4}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={0} src={SFX.whoosh} volume={0.42} />

        {eyebrow && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", letterSpacing: 6, fontSize: 19, fontWeight: 700, textTransform: "uppercase", color: COLORS.textDim, opacity: head, zIndex: 3 }}>
            {eyebrow}
          </div>
        )}

        {/* the real photo, framed, Ken Burns */}
        <div
          style={{
            position: "absolute",
            top: eyebrow ? 44 : 0,
            left: 0,
            width: IMG_W,
            height: IMG_H,
            borderRadius: 24,
            overflow: "hidden",
            opacity: photoIn,
            transform: `scale(${0.97 + photoIn * 0.03})`,
            boxShadow: "0 36px 90px rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, transform: `scale(${kb})` }}>
            {image ? (
              <Media src={image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "radial-gradient(120% 120% at 40% 30%, #3a4a3a, #232c22 60%, #15190f)" }} />
            )}
          </div>
          {/* slight darken for annotation contrast */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.32))" }} />
        </div>

        {/* annotation layer (same coordinate space as the photo) */}
        <svg
          viewBox={`0 0 ${IMG_W} ${IMG_H}`}
          width={IMG_W}
          height={IMG_H}
          style={{ position: "absolute", top: eyebrow ? 44 : 0, left: 0, overflow: "visible", zIndex: 2 }}
        >
          {annotations.map((a, i) => {
            const t0 = startAt + i * stagger;
            const draw = spring({ frame: frame - t0, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
            const lab = spring({ frame: frame - (t0 + sec(0.3)), fps, config: SPRING_SOFT });
            const C = TONES[a.color ?? "accent"];
            const w = (a.w ?? 0.12) * IMG_W;
            const h = (a.h ?? a.w ?? 0.12) * IMG_H;
            const cx = px(a.x);
            const cy = py(a.y);

            return (
              <g key={i}>
                {a.kind === "circle" && (
                  <ellipse
                    cx={cx}
                    cy={cy}
                    rx={w}
                    ry={h}
                    fill="none"
                    stroke={C}
                    strokeWidth={7}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - draw}
                    transform={`rotate(-6 ${cx} ${cy})`}
                    style={{ filter: `drop-shadow(0 0 8px ${C}aa)` }}
                  />
                )}
                {a.kind === "arrow" && (
                  <g>
                    <line
                      x1={px(a.fromX ?? a.x)}
                      y1={py(a.fromY ?? a.y - 0.18)}
                      x2={interpolate(draw, [0, 1], [px(a.fromX ?? a.x), cx])}
                      y2={interpolate(draw, [0, 1], [py(a.fromY ?? a.y - 0.18), cy])}
                      stroke={C}
                      strokeWidth={7}
                      strokeLinecap="round"
                      style={{ filter: `drop-shadow(0 0 6px ${C}aa)` }}
                    />
                    {/* arrowhead appears once the line nearly lands */}
                    <g opacity={interpolate(draw, [0.8, 1], [0, 1], { extrapolateLeft: "clamp" })}>
                      <path d={`M ${cx} ${cy} l -22 -8 M ${cx} ${cy} l -8 -22`} stroke={C} strokeWidth={7} strokeLinecap="round" fill="none" />
                    </g>
                  </g>
                )}
                {a.kind === "underline" && (
                  <path
                    d={`M ${cx - w} ${cy} C ${cx - w * 0.4} ${cy - 14}, ${cx + w * 0.4} ${cy + 14}, ${cx + w} ${cy}`}
                    fill="none"
                    stroke={C}
                    strokeWidth={8}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - draw}
                    style={{ filter: `drop-shadow(0 0 8px ${C}aa)` }}
                  />
                )}

                {/* label chip near the annotation */}
                {a.label && (
                  <g opacity={lab} transform={`translate(0 ${(1 - lab) * 10})`}>
                    <rect
                      x={cx - 8}
                      y={cy + h + 14}
                      width={a.label.length * 16 + 36}
                      height={48}
                      rx={12}
                      fill="rgba(18,17,22,0.82)"
                      stroke={`${C}cc`}
                      strokeWidth={2}
                    />
                    <text x={cx + 10} y={cy + h + 45} fontSize={26} fontWeight={800} fill={COLORS.text} fontFamily={FONT_STACK}>{a.label}</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {caption && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, textAlign: "center", fontSize: 28, fontWeight: 700, color: COLORS.textSoft, opacity: head, zIndex: 3 }}>
            {caption}
          </div>
        )}

        {/* SFX: a marker scratch as each annotation draws; soft tick when its label pops */}
        {annotations.map((a, i) => {
          const t0 = startAt + i * stagger;
          return (
            <Fragment key={"sfx" + i}>
              <SfxCue at={t0} src={SFX.ui6} volume={0.46} durationInFrames={sec(0.7)} />
              {a.label && <SfxCue at={t0 + sec(0.3)} src={SFX.click} volume={0.32} />}
            </Fragment>
          );
        })}
      </div>
    </SceneFrame>
  );
};
