import { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";

// SpreadMap — an aged parchment map with a sepia "infection" stain that grows from
// an origin outward as a year counter ticks up. Built for "Lyme spread ~1 mile/year
// since 1975", brand-native (NOT the cyan mograph map). Reusable for any spread/
// expansion over time.
const BOX_W = 1520;
const BOX_H = 820;

export const SpreadMap: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  mapImage: string; // e.g. "img/tk_us_map_lyme.png"
  origin?: [number, number]; // % of box (default ~ Connecticut)
  yearFrom?: number;
  yearTo?: number;
  hue?: "blue" | "cold" | "amber" | "red";
}> = ({ durationInFrames, eyebrow, title, mapImage, origin = [78, 34], yearFrom = 1975, yearTo = 2026, hue = "red" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: SPRING_SOFT });

  const growStart = sec(0.8);
  const prog = interpolate(frame, [growStart, durationInFrames - sec(1.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const year = Math.round(yearFrom + (yearTo - yearFrom) * prog);
  const ox = (origin[0] / 100) * BOX_W;
  const oy = (origin[1] / 100) * BOX_H;
  const maxR = BOX_W * 0.62;
  const r = maxR * prog;

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={40} drift={0.3}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={sec(0.4)} src={SFX.transition} volume={0.4} />
        <SfxCue at={growStart} src={SFX.markerDrive} volume={0.32} durationInFrames={sec(1.2)} />
        {(eyebrow || title) && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", zIndex: 6, opacity: head, transform: `translateY(${(1 - head) * -12}px)` }}>
            {eyebrow && <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 700, textTransform: "uppercase", color: COLORS.textDim }}>{eyebrow}</div>}
            {title && <div style={{ fontSize: 50, fontWeight: 800, color: COLORS.text, marginTop: 8 }}>{title}</div>}
          </div>
        )}

        {/* parchment map */}
        <div style={{ position: "absolute", inset: 0, opacity: head, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile(mapImage)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="stain">
              <stop offset="0%" stopColor={COLORS.danger} stopOpacity={0.5} />
              <stop offset="60%" stopColor={COLORS.amber} stopOpacity={0.34} />
              <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
            </radialGradient>
          </defs>
          {/* spreading stain */}
          <circle cx={ox} cy={oy} r={r} fill="url(#stain)" />
          {/* leading ring */}
          <circle cx={ox} cy={oy} r={r} fill="none" stroke={COLORS.danger} strokeWidth={3} opacity={0.45} />
          {/* origin pin */}
          <circle cx={ox} cy={oy} r={9 + Math.sin(frame / 6) * 2} fill={COLORS.danger} opacity={head} />
          <text x={ox} y={oy - 22} textAnchor="middle" fontSize={24} fontWeight={800} fill={COLORS.text} fontFamily={FONT_STACK} opacity={head}>Lyme, CT · 1975</text>
        </svg>

        {/* year counter */}
        <div style={{ position: "absolute", left: 60, bottom: 48, opacity: head }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: COLORS.textDim }}>spreading ~1 mile / year</div>
          <div style={{ fontSize: 130, fontWeight: 800, color: COLORS.danger, lineHeight: 1 }}>{year}</div>
        </div>
      </div>
    </SceneFrame>
  );
};
