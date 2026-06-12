import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";

// TickLineMoat — top-down view of the "tick line": damp woods (top) → a dry sunny
// 3-ft strip (middle) → the lawn where children play (bottom). Ticks crawl up from
// the woods, hit the dry strip, dry out and die there. The signature beat of the
// tick video. Reusable for any "barrier the pest can't cross" idea.
const BOX_W = 1520;
const BOX_H = 820;

export const TickLineMoat: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  hue?: "blue" | "cold" | "amber" | "red";
}> = ({ durationInFrames, eyebrow, title, hue = "amber" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: SPRING_SOFT });

  const woodsH = 300, stripH = 150, lawnH = BOX_H - woodsH - stripH;
  const stripY = woodsH, lawnY = woodsH + stripH;
  const stripMid = stripY + stripH / 2;

  // ticks: deterministic columns; each crawls up, stalls at the strip, dies.
  const ticks = [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const x = 150 + i * 180 + (i % 2) * 40;
    const t0 = sec(0.8) + i * sec(0.45);
    const s = spring({ frame: frame - t0, fps, config: { damping: 26, mass: 1, stiffness: 26 } });
    const startY = BOX_H - 50;
    const stopY = stripMid + 10; // dies at the dry strip
    const y = startY + (stopY - startY) * s;
    const dead = s > 0.92;
    const wob = Math.sin((frame - t0) / 5 + i) * 3;
    return { x: x + wob, y, dead, s, i };
  });

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={40} drift={0.35}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={sec(0.4)} src={SFX.transition} volume={0.4} />
        {(eyebrow || title) && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", zIndex: 6, opacity: head, transform: `translateY(${(1 - head) * -12}px)` }}>
            {eyebrow && <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 700, textTransform: "uppercase", color: COLORS.textDim }}>{eyebrow}</div>}
            {title && <div style={{ fontSize: 50, fontWeight: 800, color: COLORS.text, marginTop: 8 }}>{title}</div>}
          </div>
        )}

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <pattern id="grassW" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
              <rect width="22" height="22" fill="#4F5B3C" />
              <line x1="6" y1="22" x2="6" y2="10" stroke="#3C4630" strokeWidth="2" />
              <line x1="15" y1="22" x2="15" y2="6" stroke="#3C4630" strokeWidth="2" />
            </pattern>
          </defs>

          {/* woods (damp/shady) */}
          <rect x={0} y={0} width={BOX_W} height={woodsH} fill="url(#grassW)" opacity={head} />
          {/* dry sunny strip */}
          <rect x={0} y={stripY} width={BOX_W} height={stripH} fill="#C9A24A" opacity={0.92 * head} />
          <rect x={0} y={stripY} width={BOX_W} height={stripH} fill="url(#grassW)" opacity={0.06 * head} />
          {/* lawn */}
          <rect x={0} y={lawnY} width={BOX_W} height={lawnH} fill="#6E8B47" opacity={head} />

          {/* little home + child on the lawn */}
          <g opacity={head} transform={`translate(${BOX_W - 250} ${lawnY + lawnH / 2 - 10})`}>
            <rect x={-30} y={-40} width={120} height={80} rx={6} fill="#E6DCC4" stroke="#2A2620" strokeWidth={3} />
            <path d="M -40 -40 L 30 -86 L 100 -40 Z" fill="#9A5238" stroke="#2A2620" strokeWidth={3} />
            <circle cx={150} cy={0} r={14} fill="#EFE7D3" stroke="#2A2620" strokeWidth={3} />
          </g>

          {/* ticks crawling up and dying at the strip */}
          {ticks.map((t) => (
            <g key={t.i} opacity={t.s > 0.02 ? 1 : 0} transform={`translate(${t.x} ${t.y})`}>
              {t.dead ? (
                <g opacity={interpolate(t.s, [0.92, 1], [0, 1], { extrapolateLeft: "clamp" })}>
                  <line x1={-9} y1={-9} x2={9} y2={9} stroke={COLORS.danger} strokeWidth={5} strokeLinecap="round" />
                  <line x1={9} y1={-9} x2={-9} y2={9} stroke={COLORS.danger} strokeWidth={5} strokeLinecap="round" />
                </g>
              ) : (
                <g>
                  <ellipse cx={0} cy={0} rx={11} ry={14} fill="#3a2a1d" />
                  {[-1, 1].map((sgn) => [0, 1, 2].map((k) => (
                    <line key={sgn + "-" + k} x1={sgn * 8} y1={-6 + k * 7} x2={sgn * 20} y2={-10 + k * 8} stroke="#3a2a1d" strokeWidth={2.4} strokeLinecap="round" />
                  )))}
                </g>
              )}
            </g>
          ))}
        </svg>

        {/* band labels */}
        {[
          { y: woodsH / 2, t: "Damp shady woods — she thrives", c: "#EFE7D3" },
          { y: stripMid, t: "3 ft dry sunny strip — the tick line", c: "#2A2620" },
          { y: lawnY + lawnH / 2 + 60, t: "Lawn where the children play — safe", c: "#EFE7D3" },
        ].map((b, i) => (
          <div key={i} style={{ position: "absolute", top: b.y - 18, left: 40, fontSize: 30, fontWeight: 800, color: b.c, opacity: head, textShadow: b.c === "#2A2620" ? "none" : "0 2px 10px rgba(0,0,0,0.5)" }}>{b.t}</div>
        ))}

        {ticks.map((t) => (
          <SfxCue key={"d" + t.i} at={sec(0.8) + t.i * sec(0.45) + sec(1.0)} src={SFX.layerDrop} volume={0.28} />
        ))}
      </div>
    </SceneFrame>
  );
};
