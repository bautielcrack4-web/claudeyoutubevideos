// ═══════════════════════════════════════════════════════════════════════════
// MOGRAPH KIT — "broadcast documentary" motion-graphics (competitor look)
// ═══════════════════════════════════════════════════════════════════════════
//
// ★★★ SEPARATE BRAND — DO NOT MIX WITH THE EARTHY SERIF THEME ★★★
// This kit deliberately CLONES a competitor channel's polished broadcast style:
//   electric CYAN + hot MAGENTA accents over a near-black NAVY background, with
//   a clean SANS-SERIF typeface, hand-drawn arrows/underlines, pulsing reticles
//   and lines that draw themselves.
// This is the OPPOSITE of the project's main `../theme.ts` (EB Garamond serif +
// earthy parchment palette). The two identities must NEVER be combined. Anything
// in `mograph/` reads ONLY from this file; nothing here leaks into the earthy brand.

import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMont } from "@remotion/google-fonts/Montserrat";

const { fontFamily: INTER } = loadInter();
const { fontFamily: MONT } = loadMont();

export const FPS = 30;

// ── Palette (sampled from the reference screenshots) ─────────────────────────
export const MG = {
  // backgrounds — near-black navy, subtle vertical gradient
  bg0: "#0B0E13",
  bg1: "#11151C",
  bg2: "#161B24",
  panel: "rgba(13,17,23,0.88)", // dark card / pill fill

  // text
  text: "#FFFFFF",
  textSoft: "rgba(255,255,255,0.74)",
  textDim: "rgba(255,255,255,0.46)",

  // accents
  cyan: "#37E1E8", // primary accent / map fill / playhead
  cyanGlow: "#5FF3FA",
  cyanDeep: "#13A7B4",
  magenta: "#FF1E7A", // hook highlight boxes
  magentaSoft: "#FF5AA0",
  red: "#FF3B30", // location reticle
  yellow: "#FFE14D", // highlighter marker
  green: "#A6E84D", // highlighter marker (alt)

  // hairlines / borders
  line: "rgba(255,255,255,0.16)",
  lineSoft: "rgba(255,255,255,0.10)",
  grid: "rgba(255,255,255,0.055)", // panel grid texture
} as const;

export type Accent = "cyan" | "magenta" | "red" | "yellow" | "green";
export const accentHex = (a: Accent): string => MG[a];

// ── Type stacks ──────────────────────────────────────────────────────────────
// Montserrat for big bold headlines/labels (the chunky broadcast look),
// Inter for body/quotes/captions (clean, legible).
export const HEAD = `${MONT}, "Helvetica Neue", Arial, sans-serif`;
export const BODY = `${INTER}, "Helvetica Neue", Arial, sans-serif`;

// ── Surfaces ───────────────────────────────────────────────────────────────
// Dark broadcast pill — the label chip used everywhere (date pills, callouts,
// map labels). Flat dark fill, thin light border, small radius, soft drop.
export const pill = (radius = 10): React.CSSProperties => ({
  background: MG.panel,
  border: `1px solid ${MG.line}`,
  borderRadius: radius,
  boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
});

// Glow text-shadow for accent elements (cyan playheads, map fills, pins).
export const glow = (hex: string, strength = 1): string =>
  `0 0 ${8 * strength}px ${hex}, 0 0 ${22 * strength}px ${hex}66`;

// The full-screen navy backdrop used by data-viz components.
export const navyBg: React.CSSProperties = {
  background: `radial-gradient(120% 100% at 50% 0%, ${MG.bg2} 0%, ${MG.bg1} 45%, ${MG.bg0} 100%)`,
};

// ── Spring presets ───────────────────────────────────────────────────────────
export const SPRING_POP = { damping: 13, mass: 0.6, stiffness: 200 };
export const SPRING_SOFT = { damping: 20, mass: 0.9, stiffness: 130 };
export const SPRING_SLIDE = { damping: 18, mass: 0.8, stiffness: 150 };

export const sec = (s: number) => Math.round(s * FPS);
