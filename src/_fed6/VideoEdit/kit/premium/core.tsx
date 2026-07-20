import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SPR, Theme, useTheme } from "./theme";

// ═══════════════════════════════════════════════════════════════════════════
// PREMIUM KIT — CORE: primitivas compartidas por todas las familias.
// Todo determinista (rand por índice, cero Date.now/Math.random), todo
// clampeado, todo themeable. Estas piezas son las que le dan a cada
// componente el LAYER MODEL (fondo texturado → midground → foreground),
// las sombras de contacto, el rim light y la jerarquía tipográfica.
// ═══════════════════════════════════════════════════════════════════════════

// Azar determinístico [0..1) por índice (mismo LCG que kit/depth).
export const rand = (i: number, salt = 0): number =>
  (((i * 37 + salt * 101 + 13) * 9301 + 49297) % 233280) / 233280;

export const wob = (i: number, frame: number, speed = 1): number =>
  Math.sin((frame * speed) / 14 + i * 1.7);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** miles con punto (es-AR) — determinista, sin toLocaleString. */
export const fmt = (n: number): string => {
  const neg = n < 0;
  const s = Math.abs(Math.round(n)).toString();
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const fromEnd = s.length - i;
    out += s[i];
    if (fromEnd > 1 && (fromEnd - 1) % 3 === 0) out += ".";
  }
  return (neg ? "-" : "") + out;
};

// ── useBeat — entrada con spring + salida con fade en los últimos frames ─────
export const useBeat = (
  durationInFrames: number,
  opts?: { outLen?: number; enterCfg?: (typeof SPR)[keyof typeof SPR] },
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const outLen = opts?.outLen ?? 12;
  const enter = spring({ frame, fps, config: opts?.enterCfg ?? SPR.soft });
  const exit = interpolate(
    frame,
    [durationInFrames - outLen, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return { frame, fps, enter, exit, op: enter * exit };
};

/** spring arrancando en `at` — helper NO-hook para usar dentro de .map() */
export const kick = (
  frame: number,
  fps: number,
  at: number,
  cfg: { damping: number; mass: number; stiffness: number } = SPR.snappy,
) => spring({ frame: frame - at, fps, config: cfg });

/**
 * spread — reparte `count` ítems A LO LARGO de la duración del beat (no en el
 * primer ~medio segundo). Devuelve el frame `at` del ítem `i`. Deja un HOLD al
 * final (holdFrac) donde ya está todo revelado. Así el ritmo sigue los timestamps
 * y cada ítem "se toma su tiempo" en beats largos, sin arruinar los cortos.
 */
export const spread = (
  durationInFrames: number,
  count: number,
  i: number,
  opts?: { start?: number; holdFrac?: number; minStep?: number; maxStep?: number },
) => {
  const start = opts?.start ?? 12;
  const holdFrac = opts?.holdFrac ?? 0.3;
  const minStep = opts?.minStep ?? 9;
  const maxStep = opts?.maxStep ?? 64;
  const end = durationInFrames * (1 - holdFrac);
  const raw = count > 1 ? (end - start) / count : 0;
  const step = Math.max(minStep, Math.min(maxStep, raw));
  return start + i * step;
};

// ── Texture — grano/papel según theme (multiply en claro, screen en oscuro) ──
export const Texture: React.FC<{ theme?: Theme; opacity?: number }> = ({
  theme,
  opacity,
}) => {
  const t = useTheme(theme);
  if (t.texture === "none") return null;
  const paper = t.texture === "paper";
  const op = opacity ?? (paper ? 0.1 : 0.09);
  const dark = t.mode === "dark";
  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        inset: 0,
        opacity: op,
        mixBlendMode: dark ? "screen" : "multiply",
        pointerEvents: "none",
      }}
    >
      <filter id={`pxtex-${t.name}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={paper ? 0.9 : 0.65}
          numOctaves={paper ? 3 : 2}
          seed={7}
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values={
            dark
              ? "0 0 0 0 0.85  0 0 0 0 0.83  0 0 0 0 0.75  0 0 0 0.6 0"
              : "0 0 0 0 0.16  0 0 0 0 0.13  0 0 0 0 0.09  0 0 0 0.55 0"
          }
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#pxtex-${t.name})`} />
    </svg>
  );
};

// ── Rays — haz de luz diagonal themeable (godrays de establo o de selva) ─────
export const Rays: React.FC<{
  theme?: Theme;
  x?: number;
  angle?: number;
  count?: number;
}> = ({ theme, x = 64, angle = 20, count = 6 }) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  if (!t.rays) return null;
  const breathe = interpolate(Math.sin(frame / 70), [-1, 1], [0.7, 1]);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: breathe,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${x + (i - count / 2) * 5}%`,
            top: "-12%",
            width: `${4 + rand(i) * 6}%`,
            height: "170%",
            background: `linear-gradient(to bottom, ${t.raysColor}, rgba(0,0,0,0))`,
            transform: `rotate(${angle}deg)`,
            transformOrigin: "top center",
            filter: "blur(16px)",
          }}
        />
      ))}
    </div>
  );
};

// ── Vignette — oscurece/aclara bordes para foco central ─────────────────────
export const Vignette: React.FC<{ theme?: Theme; strength?: number }> = ({
  theme,
  strength = 1,
}) => {
  const t = useTheme(theme);
  const c = t.mode === "dark" ? "0,0,0" : "42,38,32";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `radial-gradient(120% 90% at 50% 42%, rgba(${c},0) 55%, rgba(${c},${0.22 * strength}) 100%)`,
      }}
    />
  );
};

// ── Panel — el ESCENARIO de cada componente (capa fondo del LAYER MODEL): ────
//    gradiente profundo + rayos + textura + viñeta + hairline. Todo lo demás
//    (midground/foreground) vive encima de esto.
export const Panel: React.FC<{
  theme?: Theme;
  style?: React.CSSProperties;
  radius?: number;
  raysX?: number;
  children?: React.ReactNode;
  /** true = sin fondo (overlay puro sobre footage) */
  transparent?: boolean;
}> = ({ theme, style, radius, raysX = 66, children, transparent = false }) => {
  const t = useTheme(theme);
  const r = radius ?? t.radius + 10;
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: r,
        ...(transparent
          ? {}
          : {
              background: `radial-gradient(85% 70% at 42% 28%, ${t.color.bg1} 0%, ${t.color.bg0} 62%, ${t.mode === "dark" ? "#000" : t.color.bg2} 130%)`,
              border: `1.5px solid ${t.color.line}`,
              boxShadow: `inset 0 0 110px ${t.color.shadow}, 0 30px 70px ${t.color.shadow}`,
            }),
        ...style,
      }}
    >
      {!transparent && (
        <>
          <Rays theme={t} x={raysX} />
          <Texture theme={t} />
          <Vignette theme={t} />
        </>
      )}
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
};

// ── Card — superficie glass del theme, con sombra multicapa real ─────────────
export const Card: React.FC<{
  theme?: Theme;
  style?: React.CSSProperties;
  accent?: string;
  strong?: boolean;
  children?: React.ReactNode;
}> = ({ theme, style, accent, strong = false, children }) => {
  const t = useTheme(theme);
  const layers = Array.from({ length: 4 }, (_, i) => {
    const k = (i + 1) / 4;
    return `0 ${Math.round(k * 26)}px ${Math.round(k * 40)}px ${t.color.shadow}`;
  }).join(", ");
  return (
    <div
      style={{
        position: "relative",
        background: strong ? t.color.surfaceStrong : t.color.surface,
        border: accent
          ? `2.5px solid ${accent}`
          : `1.5px solid ${t.color.line}`,
        borderRadius: t.radius,
        boxShadow: `${layers}, inset 0 1px 0 ${t.mode === "dark" ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.5)"}`,
        backdropFilter: "blur(14px) saturate(120%)",
        WebkitBackdropFilter: "blur(14px) saturate(120%)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ── Jerarquía tipográfica ────────────────────────────────────────────────────
export const Eyebrow: React.FC<{
  theme?: Theme;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ theme, color, size = 24, style, children }) => {
  const t = useTheme(theme);
  return (
    <div
      style={{
        fontFamily: t.fontLabel,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: t.labelSpacing,
        textTransform: t.upperLabels ? "uppercase" : "none",
        color: color ?? t.color.accent,
        display: "flex",
        alignItems: "center",
        gap: 14,
        ...style,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 34,
          height: 3,
          background: color ?? t.color.accent,
          borderRadius: 2,
        }}
      />
      {children}
    </div>
  );
};

export const Display: React.FC<{
  theme?: Theme;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ theme, size = 58, color, style, children }) => {
  const t = useTheme(theme);
  return (
    <div
      style={{
        fontFamily: t.fontDisplay,
        fontSize: size,
        fontWeight: t.displayWeight,
        color: color ?? t.color.text,
        lineHeight: 1.06,
        textTransform: t.name === "alarm" ? "uppercase" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Support: React.FC<{
  theme?: Theme;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ theme, size = 28, color, style, children }) => {
  const t = useTheme(theme);
  return (
    <div
      style={{
        fontFamily: t.fontBody,
        fontSize: size,
        fontWeight: 500,
        color: color ?? t.color.textSoft,
        lineHeight: 1.3,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ── ImgOr — Img real si hay src; si no, "foto" placeholder determinista ──────
//    (paisaje abstracto themeado: cielo gradiente + sol + cordón montañoso).
//    Así el kit funciona SIN assets y la Gallery muestra composición real.
export const ImgOr: React.FC<{
  src?: string;
  seed?: number;
  theme?: Theme;
  style?: React.CSSProperties;
}> = ({ src, seed = 0, theme, style }) => {
  const t = useTheme(theme);
  if (src) {
    return (
      <Img
        src={src}
        style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
      />
    );
  }
  const sunX = 90 + rand(seed, 1) * 220;
  const sunY = 60 + rand(seed, 2) * 70;
  const dark = t.mode === "dark";
  // en dark las capas deben ser MÁS claras que el fondo para leerse (no bg0/bg1)
  const sky0 = t.color.accentSoft;
  const sky1 = dark ? t.color.bg2 : t.color.bg1;
  const ridge = dark ? t.color.accent2 : t.color.accent;
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      style={{ display: "block", ...style }}
    >
      <defs>
        <linearGradient id={`phsky${seed}${t.name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky0} />
          <stop offset="100%" stopColor={sky1} />
        </linearGradient>
      </defs>
      <rect width={400} height={300} fill={`url(#phsky${seed}${t.name})`} />
      <circle cx={sunX} cy={sunY} r={26 + rand(seed, 3) * 14} fill={t.color.gold} opacity={0.9} />
      <circle cx={sunX} cy={sunY} r={44 + rand(seed, 3) * 14} fill={t.color.gold} opacity={0.18} />
      <path
        d={`M 0 ${190 + rand(seed, 4) * 30} Q 100 ${140 + rand(seed, 5) * 40} 200 ${185 + rand(seed, 6) * 20} T 400 ${175 + rand(seed, 7) * 30} L 400 300 L 0 300 Z`}
        fill={ridge}
        opacity={0.55}
      />
      <path
        d={`M 0 ${225 + rand(seed, 8) * 20} Q 130 ${195 + rand(seed, 9) * 30} 260 ${228 + rand(seed, 10) * 14} T 400 ${222} L 400 300 L 0 300 Z`}
        fill={dark ? "#000" : t.color.text}
        opacity={dark ? 0.55 : 0.72}
      />
      <rect width={400} height={300} fill={t.color.gold} opacity={0.06} />
    </svg>
  );
};

// ── PhotoBlock — foto (o placeholder) con marco marcador + gradiente pie + ───
//    sombra de profundidad. El "recorte midground" estándar del kit.
export const PhotoBlock: React.FC<{
  theme?: Theme;
  src?: string;
  seed?: number;
  width: number;
  height: number;
  accent?: string;
  radius?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ theme, src, seed = 0, width, height, accent, radius, style, children }) => {
  const t = useTheme(theme);
  const r = radius ?? t.radius;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        filter: `drop-shadow(0 24px 30px ${t.color.shadow})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width,
          height,
          borderRadius: r,
          overflow: "hidden",
          border: `${Math.max(4, t.strokeW)}px solid ${accent ?? t.color.ink}`,
        }}
      >
        <ImgOr src={src} seed={seed} theme={t} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.42) 100%)",
          }}
        />
        {children}
      </div>
    </div>
  );
};

// ── ContactShadow — sombra elíptica bajo elementos flotantes (los "asienta") ─
export const ContactShadow: React.FC<{
  theme?: Theme;
  width?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ theme, width = 240, opacity = 0.4, style }) => {
  const t = useTheme(theme);
  return (
    <div
      style={{
        width,
        height: width * 0.16,
        borderRadius: "50%",
        background: `radial-gradient(50% 50% at 50% 50%, ${t.color.shadow} 0%, rgba(0,0,0,0) 70%)`,
        opacity,
        filter: "blur(4px)",
        ...style,
      }}
    />
  );
};

// ── Stroke — path que se dibuja a pluma (InkDraw themeado) ───────────────────
export const Stroke: React.FC<{
  d: string;
  at?: number;
  dur?: number;
  color: string;
  width?: number;
  length?: number;
  fill?: string;
  shadow?: boolean;
}> = ({ d, at = 0, dur = 22, color, width = 6, length = 1200, fill = "none", shadow = false }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <path
      d={d}
      fill={fill}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={length}
      strokeDashoffset={length * (1 - p)}
      style={shadow ? { filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.3))" } : undefined}
    />
  );
};

// ── Arrow — flecha curva que se dibuja + punta que aparece al final ──────────
export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  curve?: number; // px de curvatura perpendicular (+ = "arriba")
  at?: number;
  dur?: number;
  color: string;
  width?: number;
}> = ({ x1, y1, x2, y2, curve = 0, at = 0, dur = 20, color, width = 8 }) => {
  const frame = useCurrentFrame();
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;
  const cx = mx + nx * curve;
  const cy = my + ny * curve;
  // ángulo de llegada (tangente control→fin)
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const headL = width * 2.6;
  const ha = 0.5;
  const hx1 = x2 - Math.cos(ang - ha) * headL;
  const hy1 = y2 - Math.sin(ang - ha) * headL;
  const hx2 = x2 - Math.cos(ang + ha) * headL;
  const hy2 = y2 - Math.sin(ang + ha) * headL;
  const p = interpolate(frame - at, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headOp = interpolate(p, [0.78, 0.95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const len = dist * 1.35 + Math.abs(curve);
  return (
    <g style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.25))" }}>
      <path
        d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
      <path
        d={`M ${hx1} ${hy1} L ${x2} ${y2} L ${hx2} ${hy2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={headOp}
      />
    </g>
  );
};

// ── Tick / Cross — check y tacha dibujados (en un svg 40x40) ─────────────────
export const Tick: React.FC<{ at?: number; color: string; size?: number }> = ({
  at = 0,
  color,
  size = 56,
}) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={{ flexShrink: 0 }}>
    <circle cx={20} cy={20} r={17} fill="none" stroke={color} strokeWidth={2.6} opacity={0.55} />
    <Stroke d="M 11 21 L 18 28 L 30 12" at={at} dur={12} length={46} color={color} width={4.6} />
  </svg>
);

export const Cross: React.FC<{ at?: number; color: string; size?: number }> = ({
  at = 0,
  color,
  size = 56,
}) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={{ flexShrink: 0 }}>
    <circle cx={20} cy={20} r={17} fill="none" stroke={color} strokeWidth={2.6} opacity={0.55} />
    <Stroke d="M 12 12 L 28 28" at={at} dur={9} length={26} color={color} width={4.6} />
    <Stroke d="M 28 12 L 12 28" at={at + 5} dur={9} length={26} color={color} width={4.6} />
  </svg>
);

// ── Odo — odómetro themeado: dígitos que ruedan y ASIENTAN en el valor ───────
export const Odo: React.FC<{
  value: number;
  theme?: Theme;
  size?: number;
  color?: string;
  prefix?: string;
  suffix?: string;
  at?: number;
  dur?: number;
  grouped?: boolean; // separador de miles
}> = ({ value, theme, size = 96, color, prefix = "", suffix = "", at = 0, dur = 55, grouped = true }) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 200, mass: 1, stiffness: 55 }, durationInFrames: dur });
  // Layout FIJO desde el frame 0 (el string final define las columnas y los
  // puntos de miles); cada dígito rueda por separado hasta asentar. Así nunca
  // salta el ancho ni se desalinean los separadores durante la animación.
  const padded = grouped ? fmt(value) : Math.round(value).toString();
  const cellH = size * 1.14;
  const col = color ?? t.color.text;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        fontFamily: t.fontDisplay,
        color: col,
        fontSize: size,
        fontWeight: Math.max(t.displayWeight, 700),
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {prefix && <span style={{ marginRight: size * 0.06 }}>{prefix}</span>}
      {padded.split("").map((ch, i) => {
        if (ch === "." || ch === "," || ch === " ") {
          return (
            <span key={i} style={{ display: "inline-block", width: ch === " " ? size * 0.18 : size * 0.24, textAlign: "center" }}>
              {ch === " " ? "" : ch}
            </span>
          );
        }
        const target = parseInt(ch, 10);
        const roll = target + (1 - s) * (5 + (i % 3) * 2); // columnas ruedan distinto
        const off = (roll % 10) * cellH;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              height: cellH,
              width: size * 0.6,
              overflow: "hidden",
              position: "relative",
              textAlign: "center",
            }}
          >
            <span style={{ position: "absolute", top: -off, left: 0, right: 0 }}>
              {Array.from({ length: 20 }, (_, d) => (
                <span key={d} style={{ display: "block", height: cellH }}>
                  {d % 10}
                </span>
              ))}
            </span>
          </span>
        );
      })}
      {suffix && <span style={{ marginLeft: size * 0.08, fontSize: size * 0.5 }}>{suffix}</span>}
    </div>
  );
};

// ── Burst — explosión radial de motas en un instante (para sellos/slams) ─────
export const Burst: React.FC<{
  at: number;
  color: string;
  size?: number;
  count?: number;
}> = ({ at, color, size = 300, count = 14 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const half = size / 2;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {Array.from({ length: count }, (_, i) => {
        const a = rand(i, 3) * Math.PI * 2;
        const d = p * (half * 0.35 + rand(i, 1) * half * 0.62);
        const op = interpolate(p, [0, 0.14, 1], [0, 0.85, 0]);
        return (
          <circle
            key={i}
            cx={half + Math.cos(a) * d}
            cy={half + Math.sin(a) * d}
            r={2.5 + rand(i, 2) * 5}
            fill={color}
            opacity={op}
          />
        );
      })}
    </svg>
  );
};

// ── Motas — partículas ambiente sutiles flotando (atmósfera de midground) ────
export const Motas: React.FC<{
  theme?: Theme;
  count?: number;
  color?: string;
  opacity?: number;
}> = ({ theme, count = 16, color, opacity = 0.5 }) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  const col = color ?? t.color.gold;
  return (
    <svg
      viewBox="0 0 1600 900"
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}
    >
      {Array.from({ length: count }, (_, i) => {
        const span = 150 + Math.floor(rand(i, 1) * 130);
        const p = ((frame + rand(i, 2) * span) % span) / span;
        const x = rand(i) * 1600 + wob(i, frame, 1.1) * 24;
        const y = rand(i, 3) * 900 - p * 260;
        const life = Math.sin(p * Math.PI);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={1.6 + rand(i, 4) * 3.4}
            fill={col}
            opacity={life * (0.25 + rand(i, 5) * 0.45)}
          />
        );
      })}
    </svg>
  );
};

// ── Stage — AbsoluteFill raíz de cada componente (fuente body del theme) ─────
export const Stage: React.FC<{
  theme?: Theme;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ theme, style, children }) => {
  const t = useTheme(theme);
  return (
    <AbsoluteFill style={{ fontFamily: t.fontBody, ...style }}>
      {children}
    </AbsoluteFill>
  );
};
