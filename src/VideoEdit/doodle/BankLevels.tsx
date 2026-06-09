import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StickFigure, Pose } from "./components/StickFigure";
import {
  Paper,
  HandText,
  Underline,
  BarChart,
  SpeechBubble,
  CircleMark,
  DrawnArrow,
  Counter,
  C,
  CAVEAT,
  HAND,
} from "./components/DoodleKit";

// "Cómo te tratan los bancos en cada nivel de riqueza" — Nivel 1: saldo negativo.
// Dense, constantly-moving cut. Scenes locked to the narrator audio (68.1s @30fps).

const TOTAL = 2052;

// Recurring character look (consistent across scenes).
const GUY = { hair: "neat" as const, glasses: true, tie: C.blue };
const Guy: React.FC<Omit<Pose, "frame"> & { frame: number }> = (p) => (
  <StickFigure {...GUY} {...p} />
);

// Soft fade in/out per scene so cuts breathe but stay locked to the audio.
const Fade: React.FC<{ children: React.ReactNode; d?: number }> = ({ children }) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const o = Math.min(
    interpolate(f, [0, 7], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(f, [d - 6, d], [1, 0], { extrapolateLeft: "clamp" }),
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const usePop = (delay = 0, cfg: object = { damping: 12, mass: 0.6, stiffness: 170 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: cfg as never });
};

// ---------------------------------------------------------------- doodle props
const Phone: React.FC<{ children?: React.ReactNode; tilt?: number; scale?: number }> = ({
  children,
  tilt = 0,
  scale = 1,
}) => (
  <div
    style={{
      width: 300,
      height: 600,
      border: `9px solid ${C.ink}`,
      borderRadius: 46,
      background: "#fff",
      boxShadow: "0 16px 0 rgba(0,0,0,0.07)",
      transform: `rotate(${tilt}deg) scale(${scale})`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

// Recreated bank-app screen — looks like a real fintech UI, 100% reliable.
const BankScreen: React.FC<{ balance: string; flash?: number }> = ({ balance, flash = 0 }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 22 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: C.blue }} />
      <span style={{ fontFamily: HAND, fontSize: 28, color: C.ink }}>Mi Banco</span>
    </div>
    <span style={{ fontFamily: HAND, fontSize: 30, color: "#9aa0a6" }}>Saldo disponible</span>
    <div
      style={{
        fontFamily: CAVEAT,
        fontSize: 96,
        fontWeight: 700,
        color: C.red,
        lineHeight: 1.05,
        marginTop: 4,
        transform: `scale(${1 + flash * 0.06})`,
      }}
    >
      {balance}
    </div>
    <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
      {["Café  —  $4.00", "Suscripción", "Transferencia"].map((t, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #eee", paddingBottom: 8 }}>
          <span style={{ fontFamily: HAND, fontSize: 24, color: "#666" }}>{t}</span>
          <span style={{ fontFamily: HAND, fontSize: 24, color: i === 0 ? C.red : "#bbb" }}>{i === 0 ? "−$4" : "·"}</span>
        </div>
      ))}
    </div>
  </div>
);

const Polaroid: React.FC<{ src: string; w?: number; rot?: number; caption?: string; pop: number }> = ({
  src,
  w = 320,
  rot = -4,
  caption,
  pop,
}) => (
  <div
    style={{
      background: "#fff",
      padding: "14px 14px 14px",
      border: `3px solid ${C.ink}`,
      boxShadow: "0 14px 0 rgba(0,0,0,0.10)",
      transform: `rotate(${rot}deg) scale(${pop})`,
      width: w,
    }}
  >
    <Img src={src} style={{ width: "100%", height: w * 0.66, objectFit: "cover", display: "block", border: `2px solid ${C.ink}` }} />
    {caption && (
      <div style={{ fontFamily: HAND, fontSize: 30, color: C.ink, textAlign: "center", marginTop: 10 }}>{caption}</div>
    )}
  </div>
);

const LogoChip: React.FC<{ src: string; label: string; sub?: string; pop: number; rot?: number; subColor?: string }> = ({
  src,
  label,
  sub,
  pop,
  rot = 0,
  subColor = C.red,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      background: "#fff",
      border: `4px solid ${C.ink}`,
      borderRadius: 22,
      padding: "14px 28px",
      boxShadow: "0 8px 0 rgba(0,0,0,0.08)",
      transform: `rotate(${rot}deg) scale(${pop})`,
      whiteSpace: "nowrap",
    }}
  >
    <Img src={src} style={{ width: 58, height: 58, objectFit: "contain" }} />
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontFamily: HAND, fontSize: 38, color: C.ink, fontWeight: 700 }}>{label}</span>
      {sub && <span style={{ fontFamily: HAND, fontSize: 34, color: subColor, fontWeight: 700 }}>{sub}</span>}
    </div>
  </div>
);

const Stamp: React.FC<{ text: string; color?: string; rot?: number; pop: number; size?: number }> = ({
  text,
  color = C.red,
  rot = -11,
  pop,
  size = 76,
}) => (
  <div
    style={{
      border: `6px solid ${color}`,
      color,
      fontFamily: CAVEAT,
      fontWeight: 700,
      fontSize: size,
      padding: "2px 26px",
      borderRadius: 12,
      transform: `rotate(${rot}deg) scale(${pop})`,
      letterSpacing: 2,
      opacity: 0.96,
    }}
  >
    {text}
  </div>
);

const Notif: React.FC<{ icon: React.ReactNode; title: string; body: string; slide: number; amount?: string }> = ({
  icon,
  title,
  body,
  slide,
  amount,
}) => (
  <div
    style={{
      width: 620,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(4px)",
      border: `3px solid ${C.ink}`,
      borderRadius: 24,
      padding: "16px 22px",
      boxShadow: "0 12px 0 rgba(0,0,0,0.08)",
      transform: `translateY(${slide}px)`,
      display: "flex",
      gap: 16,
      alignItems: "center",
    }}
  >
    <div style={{ width: 56, height: 56, borderRadius: 14, background: "#fff", border: `3px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <span style={{ fontFamily: HAND, fontSize: 30, color: C.ink, fontWeight: 700 }}>{title}</span>
      <span style={{ fontFamily: HAND, fontSize: 26, color: "#666" }}>{body}</span>
    </div>
    {amount && <span style={{ fontFamily: CAVEAT, fontSize: 56, fontWeight: 700, color: C.red }}>{amount}</span>}
  </div>
);

const Note: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 60 }) => (
  <div style={{ position: "absolute", left: x, top: y, fontSize: s, opacity: o, fontFamily: HAND, color: C.ink }}>♪</div>
);

// ===========================================================================
// SCENES
// ===========================================================================

// 1 — Title
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = usePop(0, { damping: 14, mass: 0.7 });
  const ul = interpolate(frame, [22, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fade>
      <Paper grid>
        <div style={{ position: "absolute", top: 150, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: HAND, fontSize: 44, color: "#9aa0a6", letterSpacing: 6, opacity: rise }}>N I V E L  1</div>
          <HandText size={148} frame={frame} fps={fps} delay={7} style={{ transformOrigin: "center" }}>
            Saldo <span style={{ color: C.red }}>negativo</span>
          </HandText>
          <Underline progress={ul} w={820} color={C.red} />
        </div>
        <div style={{ position: "absolute", left: "50%", bottom: 6, transform: `translate(-50%, ${interpolate(rise, [0, 1], [220, 0])}px)` }}>
          <Guy width={340} frame={frame} mouth={0.1} lSwing={6} rSwing={6} blink={frame % 80 > 72 ? 1 : 0} />
        </div>
      </Paper>
    </Fade>
  );
};

// 2 — bank app: −$4.00, circle the minus sign
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = usePop(4, { damping: 13 });
  const circle = interpolate(frame, [40, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 360, top: 150, transform: `scale(${pop})`, transformOrigin: "center" }}>
          <Phone tilt={-3}>
            <BankScreen balance="−$4.00" />
          </Phone>
        </div>
        <CircleMark x={486} y={300} rx={48} ry={42} progress={circle} color={C.red} />
        <div style={{ position: "absolute", left: 470, top: 360, fontFamily: HAND, fontSize: 40, color: C.red, opacity: circle }}>
          un signo menos.
        </div>
        <div style={{ position: "absolute", right: 150, bottom: 6 }}>
          <Guy width={350} frame={frame} lSwing={66} lBend={42} lHand="point" mouth={0.05} brows={-1} lean={-3} />
        </div>
      </Paper>
    </Fade>
  );
};

// 3 — staring, exaggerated blinks, number won't vanish
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const blink = frame % 36 > 30 ? 1 : 0;
  const flick = 0.55 + 0.45 * Math.abs(Math.sin(frame / 7));
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 230, top: 280, fontFamily: CAVEAT, fontSize: 180, fontWeight: 700, color: C.red, opacity: flick }}>
          −$4.00
        </div>
        <div style={{ position: "absolute", left: 250, top: 500, fontFamily: HAND, fontSize: 42, color: "#888" }}>
          lo miras como si fuera a desaparecer…
        </div>
        <div style={{ position: "absolute", right: 150, bottom: 6 }}>
          <Guy width={350} frame={frame} mouth={0.0} brows={-1} blink={blink} lSwing={8} rSwing={8} />
        </div>
      </Paper>
    </Fade>
  );
};

// 4 — "No desaparece."
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = usePop(2, { damping: 9, mass: 0.5, stiffness: 200 });
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 220, top: 300, fontFamily: CAVEAT, fontSize: 170, fontWeight: 700, color: C.ink }}>
          −$4.00
        </div>
        <div style={{ position: "absolute", left: 620, top: 360, transform: `scale(${pop}) rotate(-6deg)` }}>
          <HandText size={120} frame={frame} fps={fps} color={C.red}>No desaparece.</HandText>
        </div>
        <div style={{ position: "absolute", right: 150, bottom: 6 }}>
          <Guy width={330} frame={frame} mouth={0.05} frown={0.5} brows={-1} lSwing={6} rSwing={6} />
        </div>
      </Paper>
    </Fade>
  );
};

// 5 — overdraft stamp
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = usePop(8, { damping: 8, mass: 0.5, stiffness: 220 });
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 180, top: 250, fontFamily: CAVEAT, fontSize: 110, fontWeight: 700, color: "#9aa0a6" }}>
          te sobregiraste
        </div>
        <div style={{ position: "absolute", left: 300, top: 400 }}>
          <Stamp text="SOBREGIRO −$4" pop={stamp} size={70} />
        </div>
        <div style={{ position: "absolute", right: 130, bottom: 6 }}>
          <Guy width={330} frame={frame} rSwing={40} rBend={70} rHand="open" mouth={0.2} brows={-1} />
        </div>
      </Paper>
    </Fade>
  );
};

// 6 — only $4 / a coffee (REAL photo polaroid)
const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const big = usePop(4, { damping: 12 });
  const pol = spring({ frame: frame - 60, fps, config: { damping: 12, mass: 0.7 } });
  const arrow = interpolate(frame, [70, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 150, top: 250, transform: `scale(${big})`, transformOrigin: "left", fontFamily: CAVEAT, fontSize: 150, fontWeight: 700, color: C.red }}>
          solo $4
        </div>
        <DrawnArrow from={{ x: 470, y: 360 }} to={{ x: 700, y: 320 }} progress={arrow} bow={-50} color={C.ink} />
        <div style={{ position: "absolute", left: 720, top: 200, opacity: pol > 0.02 ? 1 : 0 }}>
          <Polaroid src={staticFile("img/coffee2.jpg")} w={360} rot={5} caption="un café que olvidaste" pop={pol} />
        </div>
        <div style={{ position: "absolute", right: 120, bottom: 6 }}>
          <Guy width={320} frame={frame} mouth={0.25 + Math.sin(frame / 6) * 0.2} lSwing={20} />
        </div>
      </Paper>
    </Fade>
  );
};

// 7 — the bank doesn't care (real bank logo)
const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chip = usePop(6, { damping: 12 });
  const x = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 160, top: 150, fontFamily: CAVEAT, fontSize: 80, fontWeight: 700, color: C.ink, width: 700 }}>
          al banco no le importa.
        </div>
        <div style={{ position: "absolute", left: 220, top: 360 }}>
          <LogoChip src={staticFile("logos/chase.svg")} label="El banco" sub="no le importan tus $4" pop={chip} rot={-2} subColor="#888" />
        </div>
        {/* crossed-out little heart */}
        <svg style={{ position: "absolute", left: 760, top: 350, overflow: "visible" }} width={160} height={160}>
          <path d="M50,40 C50,20 20,20 20,44 C20,70 50,86 50,86 C50,86 80,70 80,44 C80,20 50,20 50,40 Z" fill="none" stroke={C.ink} strokeWidth={6} opacity={chip} />
          <line x1={14} y1={20} x2={90} y2={92} stroke={C.red} strokeWidth={8} strokeLinecap="round" strokeDasharray={120} strokeDashoffset={120 * (1 - x)} />
        </svg>
        <div style={{ position: "absolute", right: 130, bottom: 6 }}>
          <Guy width={320} frame={frame} mouth={0.1} brows={-1} lSwing={8} rSwing={8} />
        </div>
      </Paper>
    </Fade>
  );
};

// 8 — it cares about math
const S8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = usePop(6, { damping: 13 });
  return (
    <Fade>
      <Paper grid>
        <div style={{ position: "absolute", left: 0, top: 150, width: "100%", textAlign: "center", fontFamily: HAND, fontSize: 50, color: "#888" }}>
          le importan las matemáticas.
        </div>
        <div style={{ position: "absolute", left: 0, top: 300, width: "100%", textAlign: "center", transform: `scale(${t})`, fontFamily: CAVEAT, fontSize: 150, fontWeight: 700, color: C.ink }}>
          saldo − $4 = <span style={{ color: C.red }}>problema</span>
        </div>
        <div style={{ position: "absolute", right: 140, bottom: 6 }}>
          <Guy width={300} frame={frame} mouth={0.1} lSwing={8} rSwing={8} blink={frame % 70 > 64 ? 1 : 0} />
        </div>
      </Paper>
    </Fade>
  );
};

// 9 — number line drops below zero
const S9: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [20, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dotX = interpolate(t, [0, 1], [1020, 470]);
  const dotY = interpolate(t, [0, 1], [430, 520]);
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 0, top: 120, width: "100%", textAlign: "center", fontFamily: HAND, fontSize: 48, color: "#888" }}>
          quedaste por debajo de cero.
        </div>
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={700}>
          <line x1={300} y1={430} x2={1500} y2={430} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
          {[-2, -1, 0, 1, 2].map((n, i) => {
            const x = 470 + i * 230;
            return (
              <g key={n}>
                <line x1={x} y1={418} x2={x} y2={442} stroke={C.ink} strokeWidth={4} />
                <text x={x} y={478} textAnchor="middle" fontFamily={HAND} fontSize={36} fill={n === 0 ? C.ink : "#aaa"} fontWeight={n === 0 ? 700 : 400}>{n}</text>
              </g>
            );
          })}
          <circle cx={dotX} cy={dotY} r={20} fill={C.red} />
          {t > 0.9 && <text x={470} y={580} textAnchor="middle" fontFamily={CAVEAT} fontSize={70} fontWeight={700} fill={C.red}>−$4</text>}
        </svg>
        <div style={{ position: "absolute", right: 130, bottom: 6 }}>
          <Guy width={300} frame={frame} mouth={0.05} frown={0.4} lSwing={6} rSwing={6} />
        </div>
      </Paper>
    </Fade>
  );
};

// 10 — $35 fee slam
const S10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = usePop(0, { damping: 9, mass: 0.5, stiffness: 200 });
  const ul = interpolate(frame, [34, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 0, top: 250, width: "100%", textAlign: "center", transform: `scale(${interpolate(slam, [0, 1], [2.6, 1])})` }}>
          <div style={{ fontFamily: CAVEAT, fontSize: 230, fontWeight: 700, color: C.red }}>
            <Counter to={35} frame={frame} fps={fps} dur={9} prefix="$" />
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 560, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <HandText size={70} frame={frame} fps={fps} delay={20} style={{ transformOrigin: "center" }}>esa es la comisión.</HandText>
          <Underline progress={ul} w={460} color={C.ink} />
        </div>
        <div style={{ position: "absolute", right: 110, bottom: 6 }}>
          <Guy width={290} frame={frame} blink={frame < 12 ? 1 : 0} mouth={0.5} brows={1} lSwing={120} lBend={30} />
        </div>
      </Paper>
    </Fade>
  );
};

// 11 — penalty for being broke is being more broke (spiral)
const S11: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = usePop(4, { damping: 14 });
  const b = usePop(34, { damping: 14 });
  const arrow = interpolate(frame, [50, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 180, top: 230, transform: `scale(${a})`, transformOrigin: "left", fontFamily: CAVEAT, fontSize: 90, fontWeight: 700, color: C.ink }}>
          estar quebrado
        </div>
        <DrawnArrow from={{ x: 400, y: 360 }} to={{ x: 560, y: 470 }} progress={arrow} bow={60} color={C.red} thickness={9} />
        <div style={{ position: "absolute", left: 560, top: 470, transform: `scale(${b})`, transformOrigin: "left", fontFamily: CAVEAT, fontSize: 100, fontWeight: 700, color: C.red }}>
          aún más quebrado
        </div>
        <div style={{ position: "absolute", right: 120, bottom: 6 }}>
          <Guy width={300} frame={frame} mouth={0.0} frown={0.6} brows={-1} lean={3} lSwing={4} rSwing={4} />
        </div>
      </Paper>
    </Fade>
  );
};

// 12 — bar chart: error vs fee
const S12: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const circle = interpolate(frame, [40, 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", fontFamily: CAVEAT, fontSize: 70, fontWeight: 700, color: C.ink }}>
          la comisión &gt; el error
        </div>
        <div style={{ position: "absolute", left: 200, top: 140 }}>
          <BarChart frame={frame} fps={fps} max={40} width={900} height={580} barW={150} gap={150}
            bars={[
              { display: "$4", value: 4, color: "#9aa0a6", label: "el error" },
              { display: "$35", value: 35, color: C.red, label: "la comisión" },
            ]}
          />
        </div>
        <CircleMark x={710} y={330} rx={130} ry={230} progress={circle} color={C.red} />
        <div style={{ position: "absolute", right: 90, bottom: 6 }}>
          <Guy width={300} frame={frame} lSwing={150} lBend={10} lHand="point" mouth={0.3 + Math.sin(frame / 5) * 0.25} />
        </div>
      </Paper>
    </Fade>
  );
};

// 13 — not anger, just tiredness
const S13: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dots = (i: number) => spring({ frame: frame - 16 - i * 10, fps, config: { damping: 12 } });
  const txt = interpolate(frame, [54, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: "50%", top: 230, transform: "translateX(-50%)", display: "flex", gap: 18 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 26, height: 26, borderRadius: 13, background: C.ink, opacity: dots(i) }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, top: 330, width: "100%", textAlign: "center", fontFamily: CAVEAT, fontSize: 110, fontWeight: 700, color: "#888", opacity: txt }}>
          solo cansancio.
        </div>
        <div style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)" }}>
          <Guy width={360} frame={frame} lean={5} lSwing={3} rSwing={3} lBend={6} rBend={6} mouth={0.0} frown={0.7} brows={-1} blink={frame % 80 > 50 ? 1 : 0} />
        </div>
      </Paper>
    </Fade>
  );
};

// 14 — another charge incoming (notification slides in)
const S14: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = usePop(4, { damping: 14 });
  const slide = interpolate(s, [0, 1], [-220, 0]);
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 0, top: 160, width: "100%", textAlign: "center", fontFamily: HAND, fontSize: 56, color: C.ink, opacity: interpolate(frame, [2, 16], [0, 1], { extrapolateRight: "clamp" }) }}>
          entonces… entra otro cargo.
        </div>
        <div style={{ position: "absolute", left: 360, top: 320 }}>
          <Notif icon={<span style={{ fontSize: 30 }}>💳</span>} title="Cargo nuevo" body="Pago procesado" slide={slide} amount="−$7" />
        </div>
        <div style={{ position: "absolute", right: 140, bottom: 6 }}>
          <Guy width={320} frame={frame} mouth={0.2} brows={-1} rSwing={30} rBend={50} />
        </div>
      </Paper>
    </Fade>
  );
};

// 15 — the $7 subscription (REAL logo)
const S15: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chip = usePop(4, { damping: 11 });
  const strike = interpolate(frame, [40, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 0, top: 130, width: "100%", textAlign: "center", fontFamily: HAND, fontSize: 50, color: "#888" }}>
          una suscripción que olvidaste cancelar
        </div>
        <div style={{ position: "absolute", left: 480, top: 320 }}>
          <LogoChip src={staticFile("logos/spotify.svg")} label="Suscripción" sub="−$7 / mes" pop={chip} rot={-2} />
        </div>
        <svg style={{ position: "absolute", left: 470, top: 470, overflow: "visible" }} width={500} height={80}>
          <text x={0} y={50} fontFamily={HAND} fontSize={44} fill="#aaa">olvidaste cancelarla</text>
          <line x1={0} y1={36} x2={460} y2={30} stroke={C.red} strokeWidth={6} strokeLinecap="round" strokeDasharray={470} strokeDashoffset={470 * (1 - strike)} />
        </svg>
        <div style={{ position: "absolute", right: 130, bottom: 6 }}>
          <Guy width={320} frame={frame} rSwing={150} rBend={70} rHand="open" mouth={0.0} frown={0.5} lean={3} />
        </div>
      </Paper>
    </Fade>
  );
};

// 16 — the system sees red and charges another $35
const S16: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scan = interpolate(frame % 50, [0, 25, 50], [0, 1, 0]);
  const slam = usePop(70, { damping: 9, mass: 0.5, stiffness: 200 });
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 150, top: 130, fontFamily: HAND, fontSize: 46, color: "#888" }}>
          el sistema ve que estás en rojo…
        </div>
        {/* scanning eye */}
        <svg style={{ position: "absolute", left: 260, top: 230, overflow: "visible" }} width={360} height={200}>
          <ellipse cx={180} cy={100} rx={150} ry={80} fill="none" stroke={C.ink} strokeWidth={6} />
          <circle cx={interpolate(scan, [0, 1], [80, 280])} cy={100} r={34} fill={C.red} />
          <circle cx={interpolate(scan, [0, 1], [80, 280])} cy={100} r={14} fill={C.ink} />
        </svg>
        <div style={{ position: "absolute", left: 720, top: 300, transform: `scale(${slam})` }}>
          <Stamp text="OTROS −$35" pop={slam} rot={-8} size={64} />
        </div>
        <div style={{ position: "absolute", right: 120, bottom: 6 }}>
          <Guy width={320} frame={frame} lSwing={150} rSwing={150} lBend={16} rBend={16} brows={1} mouth={interpolate(slam, [0, 1], [0.1, 0.9])} />
        </div>
      </Paper>
    </Fade>
  );
};

// 17 — running total to $77
const S17: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    { t: "error inicial", v: "$4", c: "#9aa0a6" },
    { t: "comisión", v: "+$35", c: C.red },
    { t: "suscripción", v: "+$7", c: C.red },
    { t: "comisión otra vez", v: "+$35", c: C.red },
  ];
  const total = usePop(110, { damping: 11 });
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 150, top: 90, fontFamily: CAVEAT, fontSize: 70, fontWeight: 700, color: C.ink }}>
          la cuenta final:
        </div>
        <div style={{ position: "absolute", left: 170, top: 200, display: "flex", flexDirection: "column", gap: 14, width: 620 }}>
          {rows.map((r, i) => {
            const s = spring({ frame: frame - 10 - i * 18, fps, config: { damping: 13 } });
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-30, 0])}px)`, borderBottom: "3px dashed #ddd", paddingBottom: 8 }}>
                <span style={{ fontFamily: HAND, fontSize: 46, color: "#555" }}>{r.t}</span>
                <span style={{ fontFamily: HAND, fontSize: 50, fontWeight: 700, color: r.c }}>{r.v}</span>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", right: 150, top: 320, transform: `scale(${total})`, textAlign: "right" }}>
          <div style={{ fontFamily: HAND, fontSize: 44, color: "#888" }}>ahora debes</div>
          <div style={{ fontFamily: CAVEAT, fontSize: 200, fontWeight: 700, color: C.red, lineHeight: 1 }}>
            <Counter to={77} frame={frame} fps={fps} delay={110} dur={22} prefix="−$" />
          </div>
        </div>
        <div style={{ position: "absolute", left: 120, bottom: 6 }}>
          <Guy width={300} frame={frame} lSwing={150} rSwing={150} lBend={18} rBend={18} brows={1} mouth={interpolate(total, [0, 1], [0.2, 1])} />
        </div>
      </Paper>
    </Fade>
  );
};

// 18 — you try to call
const S18: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = usePop(2, { damping: 13 });
  const ring = Math.sin(frame / 3) * 5;
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: "50%", top: 160, transform: `translateX(-50%) scale(${pop})`, fontFamily: CAVEAT, fontSize: 90, fontWeight: 700, color: C.ink }}>
          intentas llamar.
        </div>
        <div style={{ position: "absolute", left: "50%", top: 320, transform: `translateX(-50%) rotate(${ring}deg)`, fontSize: 150 }}>📞</div>
        <div style={{ position: "absolute", right: 150, bottom: 6 }}>
          <Guy width={330} frame={frame} rSwing={70} rBend={95} rHand="open" mouth={0.3} lean={-2} />
        </div>
      </Paper>
    </Fade>
  );
};

// 19 — hold music x3
const S19: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = usePop(2, { damping: 13 });
  const noteO = (i: number) => Math.max(0, Math.sin(frame / 10 - i)) * interpolate(frame, [16, 34], [0, 1], { extrapolateRight: "clamp" });
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 400, top: 150, transform: `scale(${pop})` }}>
          <Phone tilt={4}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <div style={{ fontSize: 90 }}>🎵</div>
              <div style={{ fontFamily: HAND, fontSize: 40, color: "#999" }}>música de espera</div>
              <div style={{ fontFamily: CAVEAT, fontSize: 90, color: C.ink, fontWeight: 700 }}>× 3</div>
            </div>
          </Phone>
        </div>
        <Note x={720} y={210} o={noteO(0)} />
        <Note x={780} y={300} o={noteO(1)} s={48} />
        <Note x={710} y={380} o={noteO(2)} s={70} />
        <div style={{ position: "absolute", right: 150, bottom: 6 }}>
          <Guy width={320} frame={frame} rSwing={62} rBend={92} rHand="open" mouth={0.1} frown={0.4} lean={-2} />
        </div>
      </Paper>
    </Fade>
  );
};

// 20 — a voice answers
const S20: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 180, top: 300 }}>
          <SpeechBubble frame={frame} fps={fps} delay={4} size={56} color="#EDEDED" tail="right">
            🤖 …gracias por llamar.
          </SpeechBubble>
        </div>
        <div style={{ position: "absolute", right: 150, bottom: 6 }}>
          <Guy width={340} frame={frame} mouth={0.1} blink={frame % 60 > 52 ? 1 : 0} lSwing={8} rSwing={8} />
        </div>
      </Paper>
    </Fade>
  );
};

// 21 — robotic script: fees can't be reversed
const S21: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 140, top: 250 }}>
          <SpeechBubble frame={frame} fps={fps} delay={6} size={50} color="#EDEDED" tail="right">
            🤖 "Las comisiones no pueden
          </SpeechBubble>
          <div style={{ marginTop: 16 }}>
            <SpeechBubble frame={frame} fps={fps} delay={26} size={50} color="#EDEDED" tail="none">
              revertirse en este momento."
            </SpeechBubble>
          </div>
          <div style={{ marginTop: 16, opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <span style={{ fontFamily: HAND, fontSize: 40, color: "#aaa" }}>(lee un guión)</span>
          </div>
        </div>
        <div style={{ position: "absolute", right: 120, bottom: 6 }}>
          <Guy width={340} frame={frame} mouth={0.0} frown={0.5} brows={-1} blink={frame % 80 > 50 ? 1 : 0} />
        </div>
      </Paper>
    </Fade>
  );
};

// 22 — ask for a manager
const S22: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", right: 110, top: 250 }}>
          <SpeechBubble frame={frame} fps={fps} delay={4} size={56} color={C.amber} tail="left">
            ¿puedo hablar con un gerente?
          </SpeechBubble>
        </div>
        <div style={{ position: "absolute", right: 150, bottom: 6 }}>
          <Guy width={340} frame={frame} lSwing={40} lBend={60} lHand="open" mouth={0.3 + Math.sin(frame / 5) * 0.25} brows={-1} />
        </div>
      </Paper>
    </Fade>
  );
};

// 23 — 48 hours
const S23: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = usePop(4, { damping: 12 });
  const hand = (frame / 30) * 1.4;
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 0, top: 130, width: "100%", textAlign: "center", fontFamily: HAND, fontSize: 46, color: "#888" }}>
          "alguien te devolverá la llamada en…"
        </div>
        <div style={{ position: "absolute", left: 280, top: 280, transform: `scale(${pop})`, fontFamily: CAVEAT, fontSize: 210, fontWeight: 700, color: C.ink }}>
          48 horas
        </div>
        {/* ticking clock */}
        <svg style={{ position: "absolute", left: 1180, top: 300, overflow: "visible" }} width={220} height={220}>
          <circle cx={110} cy={110} r={86} fill="#fff" stroke={C.ink} strokeWidth={7} />
          <line x1={110} y1={110} x2={110 + Math.cos(hand - Math.PI / 2) * 50} y2={110 + Math.sin(hand - Math.PI / 2) * 50} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
          <line x1={110} y1={110} x2={110 + Math.cos(hand * 12 - Math.PI / 2) * 70} y2={110 + Math.sin(hand * 12 - Math.PI / 2) * 70} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
          <circle cx={110} cy={110} r={7} fill={C.ink} />
        </svg>
        <div style={{ position: "absolute", left: 140, bottom: 6 }}>
          <Guy width={300} frame={frame} mouth={0.05} frown={0.5} lSwing={6} rSwing={6} />
        </div>
      </Paper>
    </Fade>
  );
};

// 24 — punchline
const S24: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = usePop(2, { damping: 11, mass: 0.6 });
  const ul = interpolate(frame, [18, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fade>
      <Paper>
        <div style={{ position: "absolute", left: 0, top: 320, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${pop})` }}>
          <HandText size={180} frame={frame} fps={fps} delay={2} color={C.red} style={{ transformOrigin: "center" }}>
            Nadie llama.
          </HandText>
          <Underline progress={ul} w={680} color={C.red} />
        </div>
        <div style={{ position: "absolute", right: 160, bottom: 6 }}>
          <Guy width={350} frame={frame} mouth={0.0} frown={0.5} lean={3} lSwing={6} rSwing={6} blink={frame % 90 > 64 ? 1 : 0} />
        </div>
      </Paper>
    </Fade>
  );
};

// ===========================================================================
const SCENES: { C: React.FC; d: number }[] = [
  { C: S1, d: 70 },
  { C: S2, d: 95 },
  { C: S3, d: 90 },
  { C: S4, d: 42 },
  { C: S5, d: 63 },
  { C: S6, d: 147 },
  { C: S7, d: 81 },
  { C: S8, d: 60 },
  { C: S9, d: 99 },
  { C: S10, d: 81 },
  { C: S11, d: 102 },
  { C: S12, d: 66 },
  { C: S13, d: 108 },
  { C: S14, d: 51 },
  { C: S15, d: 81 },
  { C: S16, d: 132 },
  { C: S17, d: 180 },
  { C: S18, d: 45 },
  { C: S19, d: 75 },
  { C: S20, d: 42 },
  { C: S21, d: 135 },
  { C: S22, d: 51 },
  { C: S23, d: 114 },
  { C: S24, d: 42 },
];

export const BANK_FRAMES = TOTAL;

export const BankLevels: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Audio src={staticFile("narradormp3.MP3")} />
      {SCENES.map((s, i) => {
        const el = (
          <Sequence key={i} from={from} durationInFrames={s.d}>
            <s.C />
          </Sequence>
        );
        from += s.d;
        return el;
      })}
    </AbsoluteFill>
  );
};
