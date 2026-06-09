// Hand-drawn SVG business icons for the entrepreneur video.
// Clean, rounded, logo-style to match the iOS glass aesthetic. No external assets.

type IconProps = { size?: number; color?: string };

// Sell — price tag
export const SellIcon: React.FC<IconProps> = ({ size = 64, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path
      d="M52 14 H80 a6 6 0 0 1 6 6 V48 a6 6 0 0 1 -1.7 4.2 L50 86.6 a6 6 0 0 1 -8.5 0 L13.4 58.5 a6 6 0 0 1 0 -8.5 L47.8 15.7 A6 6 0 0 1 52 14 Z"
      stroke={color}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <circle cx="70" cy="30" r="6" fill={color} />
  </svg>
);

// Validate — clipboard with check
export const ValidateIcon: React.FC<IconProps> = ({ size = 64, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <rect x="24" y="20" width="52" height="64" rx="8" stroke={color} strokeWidth={6} />
    <rect x="38" y="13" width="24" height="14" rx="5" fill={color} />
    <path
      d="M36 52 L46 62 L66 40"
      stroke={color}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Listen — ear with sound waves
export const ListenIcon: React.FC<IconProps> = ({ size = 64, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path
      d="M30 44 a18 18 0 1 1 36 0 c0 12 -12 14 -14 22 a8 8 0 0 1 -15 -2"
      stroke={color}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M76 34 a14 14 0 0 1 0 24" stroke={color} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
    <path d="M84 26 a26 26 0 0 1 0 40" stroke={color} strokeWidth={5} strokeLinecap="round" opacity={0.4} />
  </svg>
);

// Idea — lightbulb
export const IdeaIcon: React.FC<IconProps> = ({ size = 64, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path
      d="M50 16 a26 26 0 0 1 16 46 c-3 3 -4 6 -4 10 H38 c0 -4 -1 -7 -4 -10 A26 26 0 0 1 50 16 Z"
      stroke={color}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <path d="M40 80 H60 M43 88 H57" stroke={color} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

// Money — cash / box (caja)
export const CashIcon: React.FC<IconProps> = ({ size = 64, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <rect x="14" y="30" width="72" height="44" rx="8" stroke={color} strokeWidth={6} />
    <circle cx="50" cy="52" r="11" stroke={color} strokeWidth={6} />
    <path d="M28 30 v44 M72 30 v44" stroke={color} strokeWidth={4} opacity={0.5} />
  </svg>
);

// Clients — people
export const ClientsIcon: React.FC<IconProps> = ({ size = 64, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="38" cy="38" r="13" stroke={color} strokeWidth={6} />
    <path d="M16 80 c0 -16 12 -24 22 -24 s22 8 22 24" stroke={color} strokeWidth={6} strokeLinecap="round" />
    <circle cx="68" cy="42" r="10" stroke={color} strokeWidth={5} opacity={0.7} />
    <path d="M64 78 c0 -12 8 -18 16 -18 s10 4 12 10" stroke={color} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
  </svg>
);

// Repeat — circular arrows
export const RepeatIcon: React.FC<IconProps> = ({ size = 64, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path d="M24 50 a26 26 0 0 1 44 -19" stroke={color} strokeWidth={6} strokeLinecap="round" />
    <path d="M76 50 a26 26 0 0 1 -44 19" stroke={color} strokeWidth={6} strokeLinecap="round" />
    <path d="M68 18 L70 33 L55 31 Z" fill={color} />
    <path d="M32 82 L30 67 L45 69 Z" fill={color} />
  </svg>
);

// Heart-break (enamorarse de la idea)
export const HeartIcon: React.FC<IconProps> = ({ size = 64, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path
      d="M50 82 C20 60 16 40 28 30 C38 22 50 30 50 40 C50 30 62 22 72 30 C84 40 80 60 50 82 Z"
      stroke={color}
      strokeWidth={6}
      strokeLinejoin="round"
    />
  </svg>
);

// Mask / persona (parecer emprendedor)
export const MaskIcon: React.FC<IconProps> = ({ size = 64, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path
      d="M20 28 H80 c0 28 -10 48 -30 48 S20 56 20 28 Z"
      stroke={color}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <circle cx="38" cy="44" r="4" fill={color} />
    <circle cx="62" cy="44" r="4" fill={color} />
    <path d="M40 60 q10 8 20 0" stroke={color} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

// Flag / quit (abandonar)
export const QuitIcon: React.FC<IconProps> = ({ size = 64, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path d="M30 14 V86" stroke={color} strokeWidth={6} strokeLinecap="round" />
    <path d="M30 18 H74 L64 34 L74 50 H30 Z" stroke={color} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);

// Work / gears (trabajar en lo equivocado)
export const GearIcon: React.FC<IconProps> = ({ size = 64, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="16" stroke={color} strokeWidth={6} />
    <g stroke={color} strokeWidth={6} strokeLinecap="round">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1="50"
          y1="22"
          x2="50"
          y2="14"
          transform={`rotate(${a} 50 50)`}
        />
      ))}
    </g>
  </svg>
);
