import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, Easing } from "remotion";
import { COLORS, FONT_STACK, glass, sec } from "../theme";
import { Icon, IconName } from "../components/Icon";
import { SceneFrame } from "../components/SceneFrame";
import { stagger, drift } from "../lib/anim";
import { SfxCue, SFX } from "../components/Sfx";

export type ListItem = { icon?: IconName; text: string; cross?: boolean };

// Rules 2 & 5/11C — left content column shown while Main reframes the presenter
// into a card on the RIGHT. Title settles first, then items reveal ONE BY ONE
// (~1s apart). Each item is a rich glass chip with a real icon (Rule 10).
export const ReframeList: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title: string;
  items: ListItem[];
  accent?: string;
}> = ({ durationInFrames, eyebrow, title, items, accent = "#FFFFFF" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = spring({ frame: frame - (durationInFrames - 14), fps, config: { damping: 200 } });
  const exitOp = interpolate(exit, [0, 1], [1, 0]);
  const titleS = spring({ frame: frame - 4, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 0,
          bottom: 0,
          width: 980,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 26,
          opacity: exitOp,
        }}
      >
        {eyebrow && (
          <div
            style={{
              color: accent === "#FFFFFF" ? COLORS.textDim : accent,
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 6,
              textTransform: "uppercase",
              opacity: interpolate(titleS, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(titleS, [0, 1], [-40, 0])}px)`,
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            color: COLORS.text,
            lineHeight: 1.08,
            opacity: interpolate(titleS, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(titleS, [0, 1], [-50, 0])}px)`,
            marginBottom: 8,
          }}
        >
          {title}
        </div>

        {items.map((it, i) => {
          const s = stagger(frame, fps, i, 24, 26); // ~0.8s apart after title
          const d = drift(frame, i * 2.5 + 1, 0.5, 4);
          return (
            <div
              key={i}
              style={{
                ...glass("light"),
                borderRadius: 24,
                padding: "20px 28px",
                display: "flex",
                alignItems: "center",
                gap: 22,
                width: "fit-content",
                maxWidth: "100%",
                opacity: interpolate(s, [0, 1], [0, 1]),
                transform: `translate(${interpolate(s, [0, 1], [-60, 0])}px, ${d.y}px)`,
                filter: `blur(${interpolate(s, [0, 1], [8, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: it.cross ? "rgba(176,80,60,0.16)" : "rgba(42,38,32,0.06)",
                  border: `1px solid ${it.cross ? "rgba(176,80,60,0.4)" : "rgba(42,38,32,0.16)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {it.cross ? <Icon name="x" size={26} /> : it.icon ? <Icon name={it.icon} size={32} /> : null}
              </div>
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: it.cross ? COLORS.textSoft : COLORS.text,
                  textDecoration: it.cross ? "line-through" : "none",
                  textDecorationColor: COLORS.danger,
                }}
              >
                {it.text}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// A centered cluster of word chips (full-screen) — e.g. the emotional state on
// retirement day: "emoción · alivio · miedo · papeles".
export const ChipsCluster: React.FC<{
  durationInFrames: number;
  title?: string;
  chips: string[];
  hue?: "blue" | "amber" | "red";
  bg?: "grid" | "image" | "black" | "white";
  image?: string;
  imageBlur?: number;
  imageDarken?: number;
  imageTint?: string;
}> = ({ durationInFrames, title, chips, hue = "blue", bg, image, imageBlur, imageDarken, imageTint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── layout determinista: fila centrada con ondulación (flotante) ───────────
  const BW = 1820;
  const BH = 760;
  const FS = 56;
  const PADX = 52;
  const GAP = 40;
  const widths = chips.map((c) => c.length * FS * 0.56 + PADX * 2);
  const total = widths.reduce((a, b) => a + b, 0) + GAP * (chips.length - 1);
  const midY = title ? BH * 0.56 : BH * 0.5;
  const centers = (() => {
    let x = (BW - total) / 2;
    return widths.map((w, i) => {
      const cx = x + w / 2;
      x += w + GAP;
      return { x: cx, y: midY + Math.sin(i * 1.5 + 0.4) * 46, w };
    });
  })();

  // ── tiempos + FOLLOW-CAM (zoom que sigue cada chip y al final se aleja) ─────
  const startAt = sec(0.5);
  const step = sec(1.05);
  const reveals = chips.map((_, i) => startAt + i * step);
  const lastAt = reveals[chips.length - 1] ?? startAt;
  const CXC = BW / 2;
  const CYC = midY;
  let active = 0;
  for (let k = 0; k < chips.length; k++) if (frame >= reveals[k]) active = k;
  const endStart = lastAt + sec(1.0);
  const endEnd = lastAt + sec(2.1);
  const HOLD = sec(0.7);
  const easeIO = Easing.inOut(Easing.cubic);
  const lp = (a: number, b: number, t: number) => a + (b - a) * t;
  let fx: number, fy: number, z: number;
  const la = frame - reveals[active];
  if (frame < reveals[0]) {
    fx = CXC; fy = CYC; z = 1.03;
  } else if (frame >= endStart) {
    const e = easeIO(interpolate(frame, [endStart, endEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    fx = lp(centers[active].x, CXC, e); fy = lp(centers[active].y, CYC, e); z = lp(1.18, 1.0, e);
  } else if (la < HOLD || active === chips.length - 1) {
    fx = centers[active].x; fy = centers[active].y;
    z = interpolate(la, [0, sec(0.28), sec(0.6), HOLD], [1.05, 1.34, 1.18, 1.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  } else {
    const tp = easeIO(interpolate(frame, [reveals[active] + HOLD, reveals[active + 1]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    fx = lp(centers[active].x, centers[active + 1].x, tp);
    fy = lp(centers[active].y, centers[active + 1].y, tp);
    z = lp(1.18, 1.04, Math.sin(tp * Math.PI));
  }
  const cam = `scale(${z}) translate(${CXC - fx}px, ${CYC - fy}px)`;

  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue={hue}
      glowY={46}
      zoom={[1.04, 1.1]}
      bg={bg}
      image={image}
      imageBlur={imageBlur}
      imageDarken={imageDarken}
      imageTint={imageTint}
    >
      <div style={{ position: "relative", width: BW, height: BH, fontFamily: FONT_STACK }}>
        {title && (
          <div style={{ position: "absolute", top: 36, left: 0, right: 0, textAlign: "center", zIndex: 5, fontSize: 46, fontWeight: 700, color: bg === "image" || bg === "black" ? COLORS.bg0 : COLORS.textSoft, textShadow: bg === "image" || bg === "black" ? "0 2px 14px rgba(0,0,0,0.8)" : "none" }}>{title}</div>
        )}
        <div style={{ position: "absolute", inset: 0, transformOrigin: "center center", transform: cam, perspective: 1400 }}>
          {chips.map((c, i) => {
            const s = spring({ frame: frame - reveals[i], fps, config: { damping: 14, mass: 0.7, stiffness: 170 } });
            const op = interpolate(frame - reveals[i], [sec(0.02), sec(0.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const d = drift(frame, i * 4 + 2, 0.7, 7);
            const tz = interpolate(s, [0, 1], [-260, 0]); // entra desde atrás (3D)
            const tilt = Math.sin(frame / 44 + i) * 4;
            const isActive = i === active && frame < endStart;
            const p = centers[i];
            return (
              <div
                key={i}
                style={{
                  ...glass("dark"),
                  position: "absolute",
                  left: p.x,
                  top: p.y + d.y,
                  transform: `translate(-50%, -50%) perspective(1200px) translateZ(${tz}px) rotateY(${tilt}deg) scale(${interpolate(s, [0, 1], [0.7, 1]) * (isActive ? 1.05 : 1)})`,
                  borderRadius: 30,
                  padding: `26px ${PADX}px`,
                  fontSize: FS,
                  fontWeight: 800,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  opacity: op,
                  boxShadow: isActive ? `0 26px 60px rgba(0,0,0,0.5), 0 0 30px ${COLORS.accent}55` : "0 18px 44px rgba(0,0,0,0.42)",
                }}
              >
                {c}
              </div>
            );
          })}
        </div>
        {/* sonido: whoosh + golpe grave al aterrizar cada chip */}
        {chips.map((_, i) => (
          <SfxCue key={"w" + i} at={reveals[i] - sec(0.28)} src={SFX.camTravel} volume={0.32} durationInFrames={sec(0.5)} />
        ))}
        {chips.map((_, i) => (
          <SfxCue key={"p" + i} at={reveals[i]} src={SFX.chipPop3d} volume={0.5} />
        ))}
        {chips.map((_, i) => (
          <SfxCue key={"z" + i} at={reveals[i]} src={SFX.camZoomPunch} volume={0.34} durationInFrames={sec(1.0)} />
        ))}
      </div>
    </SceneFrame>
  );
};
