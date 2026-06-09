// Stickman / doodle explainer — shared look & feel.
// White "paper" background, bold ink lines with a sticker halo, hand-drawn
// boil, handwritten fonts. Keep the palette tiny so frames read instantly.

import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadPatrick } from "@remotion/google-fonts/PatrickHand";

export const { fontFamily: CAVEAT } = loadCaveat(); // headlines, big handwriting
export const { fontFamily: HAND } = loadPatrick(); // labels, small text

export const FPS = 30;

export const C = {
  paper: "#FBFBF8", // off-white background (never pure #fff — softer)
  ink: "#1A1A1A", // line + body text
  red: "#E63329", // emphasis / "bad" / loss
  green: "#3FA34D", // "good" / growth
  blue: "#2F6DF6", // neutral data
  amber: "#FFF4D6", // speech-bubble fill
  gold: "#E8B400", // halo / coins
} as const;

export const sec = (s: number) => Math.round(s * FPS);

// One spring config to rule most pops. Bouncy but settles fast.
export const POP = { damping: 12, mass: 0.6, stiffness: 170 };
export const SOFT = { damping: 18, mass: 0.8, stiffness: 130 };
