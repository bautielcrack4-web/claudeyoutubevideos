import { Fragment } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, SPRING_SNAPPY, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";
import { followCam } from "../lib/followcam";

// GENERIC illustrated layered CROSS-SECTION / cutaway. Topic-agnostic — pass the
// strata per video (soil horizons w/ roots; wall insulation layers; earth-tube
// burial depths). Each layer is a colored band with a label + depth tag and a
// guide line. Rule 14: bands slide/grow in ONE BY ONE, labels + guide lines draw
// on, an optional vertical MARKER (pipe / root / probe) draws down through them,
// everything keeps a faint drift — and each beat fires its own SFX.
export type Layer = {
  label: string;
  depth?: string; // small tag, e.g. "0–30 cm", "R-19"
  color: string; // band fill (hex/rgba)
  weight?: number; // relative thickness (default 1)
};

const BOX_W = 1500;
const BOX_H = 820;

export const CrossSection: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  layers: Layer[];
  marker?: { label?: string; atDepth?: number; color?: keyof typeof TONES } | null;
  hue?: "blue" | "cold" | "amber" | "red";
  startAt?: number;
  stagger?: number;
}> = ({
  durationInFrames,
  eyebrow,
  title,
  layers,
  marker = null,
  hue = "amber",
  startAt = sec(0.5),
  stagger = sec(1.25),
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: SPRING_SOFT });

  const plotTop = title || eyebrow ? 200 : 90;
  const plotBottom = BOX_H - 70;
  const plotH = plotBottom - plotTop;
  const colX = 230;
  const colW = 620;

  const totalW = layers.reduce((s, l) => s + (l.weight ?? 1), 0);
  let acc = 0;
  const bands = layers.map((l, i) => {
    const w = l.weight ?? 1;
    const y = plotTop + (acc / totalW) * plotH;
    const h = (w / totalW) * plotH;
    acc += w;
    return { ...l, y, h, i };
  });

  const markerStart = startAt + layers.length * stagger + sec(0.3);
  const markerDraw = marker
    ? spring({ frame: frame - markerStart, fps, config: { damping: 200, mass: 1, stiffness: 55 } })
    : 0;
  const markerColor = marker ? TONES[marker.color ?? "accent"] : COLORS.accent;
  const markerX = colX + colW * (marker?.atDepth ?? 0.5);

  // follow-cam: zoom capa por capa, y al final se aleja para ver el corte entero
  const camTargets = bands.map((b) => ({ at: startAt + b.i * stagger, x: colX + colW * 0.5, y: b.y + b.h / 2 }));
  const cam = followCam({ frame, fps, targets: camTargets, cx: BOX_W / 2, cy: BOX_H / 2, hold: 0.95, zPunch: 1.32, zHold: 1.18, zTravel: 1.05, endHold: marker ? 1.8 : 1.2 });

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={44} drift={0.4}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={Math.max(0, startAt - sec(0.3))} src={SFX.transition} volume={0.4} />

        {(eyebrow || title) && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", zIndex: 5, opacity: head, transform: `translateY(${(1 - head) * -12}px)` }}>
            {eyebrow && (
              <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 700, textTransform: "uppercase", color: COLORS.textDim }}>{eyebrow}</div>
            )}
            {title && <div style={{ fontSize: 50, fontWeight: 800, color: COLORS.text, marginTop: 8 }}>{title}</div>}
          </div>
        )}

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0, transformOrigin: "center center", transform: cam.transform, filter: cam.blur > 0.2 ? `blur(${cam.blur}px)` : undefined }}>
          <defs>
            <clipPath id="csClip">
              <rect x={colX} y={plotTop} width={colW} height={plotH} rx={20} />
            </clipPath>
          </defs>

          {/* column frame */}
          <rect x={colX} y={plotTop} width={colW} height={plotH} rx={20} fill="rgba(42,38,32,0.05)" stroke="rgba(42,38,32,0.14)" strokeWidth={1.5} opacity={head} />

          <g clipPath="url(#csClip)">
            {bands.map((b) => {
              const t0 = startAt + b.i * stagger;
              const s = spring({ frame: frame - t0, fps, config: SPRING_SNAPPY });
              // band wipes down into place
              const reveal = interpolate(s, [0, 1], [0, b.h], { extrapolateRight: "clamp" });
              const drift = Math.sin((frame - t0) / 30 + b.i) * 2;
              return (
                <g key={b.i} opacity={s}>
                  <rect x={colX} y={b.y + drift} width={colW} height={reveal} fill={b.color} />
                  {/* subtle inner hairline texture */}
                  <line x1={colX} x2={colX + colW} y1={b.y + b.h} y2={b.y + b.h} stroke="rgba(0,0,0,0.25)" strokeWidth={2} opacity={s} />
                </g>
              );
            })}
          </g>

          {/* vertical marker (pipe/root/probe) drawing DOWN through the layers */}
          {marker && (
            <g>
              <line
                x1={markerX}
                y1={plotTop}
                x2={markerX}
                y2={plotTop + plotH * markerDraw}
                stroke={markerColor}
                strokeWidth={12}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 10px ${markerColor}aa)` }}
              />
              <circle cx={markerX} cy={plotTop + plotH * markerDraw} r={10 * markerDraw} fill={markerColor} />
            </g>
          )}

          {/* labels + guide lines to the right of each band */}
          {bands.map((b) => {
            const t0 = startAt + b.i * stagger + sec(0.15);
            const s = spring({ frame: frame - t0, fps, config: SPRING_SOFT });
            const cy = b.y + b.h / 2;
            const lx = colX + colW + 30;
            return (
              <g key={"lbl" + b.i} opacity={s} transform={`translate(${(1 - s) * 20} 0)`}>
                <line x1={colX + colW} x2={lx} y1={cy} y2={cy} stroke={COLORS.textDim} strokeWidth={2} />
                <circle cx={colX + colW} cy={cy} r={5} fill={b.color} />
                <text x={lx + 12} y={cy - 4} fontSize={30} fontWeight={800} fill={COLORS.text} fontFamily={FONT_STACK}>{b.label}</text>
                {b.depth && (
                  <text x={lx + 12} y={cy + 28} fontSize={21} fontWeight={600} fill={COLORS.textDim} fontFamily={FONT_STACK}>{b.depth}</text>
                )}
              </g>
            );
          })}

          {/* marker label */}
          {marker?.label && (
            <text x={markerX} y={plotTop - 18} textAnchor="middle" fontSize={24} fontWeight={800} fill={markerColor} fontFamily={FONT_STACK} opacity={markerDraw}>
              {marker.label}
            </text>
          )}
        </svg>

        {/* SFX: a pop as each band lands; a whoosh as the marker drives down */}
        {bands.map((b) => (
          <Fragment key={"sfx" + b.i}>
            <SfxCue at={startAt + b.i * stagger} src={SFX.layerDrop} volume={0.48} />
          </Fragment>
        ))}
        {marker && <SfxCue at={markerStart} src={SFX.markerDrive} volume={0.5} durationInFrames={sec(1.0)} />}
      </div>
    </SceneFrame>
  );
};

const TONES = {
  accent: COLORS.accent,
  amber: COLORS.amber,
  good: COLORS.good,
  cold: COLORS.cold,
  danger: COLORS.danger,
} as const;
