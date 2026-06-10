import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { MG, BODY, pill, glow } from "../theme";
import { MediaBg } from "./_shared";
import { idle, stagger } from "../lib/draw";

export type TimelineMark = {
  label: string; // shown under the tick (e.g. "1900", "May 2024", "Q3")
  value?: number; // optional numeric position; needs from/to to be placed
  major?: boolean; // taller tick / always bold (e.g. decade marks)
};

// #6 — Timeline (rich)
// A proper animated chronology bar over footage: a track wipes in, every mark is
// ticked + LABELLED, then a glowing cyan playhead travels across — LIGHTING each
// mark as it passes — a progress line fills behind it, the destination mark pops
// to "active", and a date pill rides the playhead. Marks are placed evenly, or by
// `value` when `from`/`to` are given (true-to-scale years).
export const Timeline: React.FC<{
  marks: TimelineMark[];
  active?: number; // index the playhead lands on (default = last)
  from?: number; // value at the left end (with marks[].value → real scale)
  to?: number; // value at the right end
  label?: string; // pill text override (default = active mark's label)
  bg?: string;
  y?: number; // % vertical position of the track
  accent?: "cyan" | "magenta";
  travelFrames?: number;
  startAt?: number;
  durationInFrames?: number;
}> = ({
  marks,
  active,
  from,
  to,
  label,
  bg,
  y = 70,
  accent = "cyan",
  travelFrames = 40,
  startAt = 0,
  durationInFrames,
}) => {
  const frame = useCurrentFrame() - startAt;
  const { fps } = useVideoConfig();
  const col = accent === "magenta" ? MG.magenta : MG.cyan;
  const colGlow = accent === "magenta" ? MG.magentaSoft : MG.cyanGlow;

  const n = marks.length;
  const activeIdx = active == null ? n - 1 : Math.max(0, Math.min(n - 1, active));
  const scaled = from != null && to != null && to !== from;

  // position 0..1 of a mark along the track
  const posOf = (m: TimelineMark, i: number) =>
    scaled && m.value != null
      ? Math.max(0, Math.min(1, (m.value - from!) / (to! - from!)))
      : n > 1
        ? i / (n - 1)
        : 0.5;

  const positions = marks.map(posOf);
  const startP = positions[0] ?? 0;
  const targetP = positions[activeIdx] ?? 1;

  // entrance + travel
  const trackWipe = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const TRAVEL_AT = 18;
  const headP = interpolate(frame, [TRAVEL_AT, TRAVEL_AT + travelFrames], [startP, targetP], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const pillPop = spring({
    frame: frame - (TRAVEL_AT + travelFrames - 6),
    fps,
    config: { damping: 13, mass: 0.6, stiffness: 200 },
  });
  const bob = idle(frame, 3, 1.8);

  const marginPct = 6;
  const trackW = 100 - marginPct * 2;
  const pillText = label ?? marks[activeIdx]?.label ?? "";

  // a mark lights as the playhead reaches it (ramps over the last 2% of approach)
  const litOf = (p: number) =>
    interpolate(headP, [p - 0.02, p], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <MediaBg src={bg} darken={0.18} duration={durationInFrames} />
      <AbsoluteFill>
        {/* track container */}
        <div style={{ position: "absolute", left: `${marginPct}%`, top: `${y}%`, width: `${trackW}%`, height: 0 }}>
          {/* base track */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 4,
              width: `${trackWipe * 100}%`,
              background: "rgba(255,255,255,0.28)",
              borderRadius: 2,
            }}
          />
          {/* progress fill */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 4,
              width: `${headP * 100}%`,
              background: col,
              borderRadius: 2,
              boxShadow: glow(colGlow, 0.9),
              opacity: trackWipe,
            }}
          />

          {/* marks: tick + label */}
          {marks.map((m, i) => {
            const p = positions[i];
            const mIn = stagger(frame, fps, i, 3, 8); // quick staggered appear
            const lit = litOf(p);
            const isActive = i === activeIdx;
            const tall = m.major || isActive ? 26 : 16;
            const tickH = 10 + (tall - 10) * (0.5 + 0.5 * lit);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${p * 100}%`,
                  top: 0,
                  transform: `translateX(-50%) translateY(${interpolate(mIn, [0, 1], [8, 0])}px)`,
                  opacity: mIn,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* tick (grows downward from the track) */}
                <div
                  style={{
                    width: lit > 0.5 || isActive ? 3 : 2,
                    height: tickH,
                    marginTop: 6,
                    background: `rgba(${lit > 0 ? "55,225,232" : "255,255,255"}, ${0.4 + 0.6 * lit})`,
                    boxShadow: lit > 0.4 ? glow(colGlow, 0.5 * lit) : undefined,
                    borderRadius: 2,
                  }}
                />
                {/* label */}
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: BODY,
                    fontWeight: isActive ? 800 : 600,
                    fontSize: m.major || isActive ? 24 : 20,
                    letterSpacing: 0.5,
                    color: lit > 0.2 ? MG.text : MG.textDim,
                    transform: `scale(${1 + 0.12 * lit})`,
                    textShadow: lit > 0.4 ? `0 0 10px ${col}66` : "0 1px 6px rgba(0,0,0,.6)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.label}
                </div>
              </div>
            );
          })}

          {/* playhead */}
          <div
            style={{
              position: "absolute",
              left: `${headP * 100}%`,
              top: -7,
              transform: "translateX(-50%)",
              opacity: trackWipe,
            }}
          >
            {/* glow dot */}
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 18,
                background: col,
                boxShadow: glow(colGlow, 1.4),
                border: "2px solid rgba(255,255,255,0.9)",
              }}
            />
          </div>

          {/* date pill riding the playhead */}
          <div
            style={{
              position: "absolute",
              left: `${headP * 100}%`,
              top: 0,
              transform: `translate(calc(-50% + ${bob.x}px), calc(-100% - 18px + ${bob.y}px)) scale(${interpolate(pillPop, [0, 1], [0.8, 1])})`,
              opacity: pillPop,
              ...pill(10),
              border: `1px solid ${col}`,
              padding: "9px 20px",
              color: MG.text,
              fontFamily: BODY,
              fontWeight: 800,
              fontSize: 32,
              whiteSpace: "nowrap",
              boxShadow: `0 10px 30px rgba(0,0,0,.5), ${glow(colGlow, 0.4)}`,
            }}
          >
            {pillText}
            {/* little pointer under the pill */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: -6,
                transform: "translateX(-50%) rotate(45deg)",
                width: 12,
                height: 12,
                background: MG.panel,
                borderRight: `1px solid ${col}`,
                borderBottom: `1px solid ${col}`,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
