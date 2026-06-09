import { Img, staticFile } from "remotion";

// Professional icons fetched from Iconify (downloaded to public/assets as white
// SVGs). Rendered via <Img>. A soft glow can be applied for the iOS-glass look.
export type IconName =
  | "employer"
  | "gov"
  | "bank"
  | "accountant"
  | "retiree"
  | "advisor"
  | "lawyer"
  | "sscard"
  | "growth"
  | "calendar"
  | "moneyup"
  | "pension"
  | "couple"
  | "handshake"
  | "hospital"
  | "monthly"
  | "window"
  | "phone"
  | "lost"
  | "health"
  | "tired"
  | "bills"
  | "check"
  | "x"
  | "warn";

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  glow?: string; // glow color (rgba/hex) — set undefined for none
  style?: React.CSSProperties;
}> = ({ name, size = 64, glow, style }) => (
  <Img
    src={staticFile(`assets/ic_${name}.svg`)}
    style={{
      width: size,
      height: size,
      objectFit: "contain",
      filter: glow ? `drop-shadow(0 0 16px ${glow})` : undefined,
      ...style,
    }}
  />
);
