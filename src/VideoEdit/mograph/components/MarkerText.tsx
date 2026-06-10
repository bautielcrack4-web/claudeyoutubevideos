import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { MG, BODY } from "../theme";
import { MediaBg } from "./_shared";

type Token = { t: string; mark?: "yellow" | "green" | "magenta" | "cyan" };

const MARK_COLORS: Record<NonNullable<Token["mark"]>, string> = {
  yellow: MG.yellow,
  green: MG.green,
  magenta: MG.magenta,
  cyan: MG.cyan,
};

// Parse "plain *marked* text" → tokens. `*...*` = yellow highlight by default.
export const parseMarks = (s: string, defaultMark: Token["mark"] = "yellow"): Token[] => {
  const out: Token[] = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ t: s.slice(last, m.index) });
    out.push({ t: m[1], mark: defaultMark });
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push({ t: s.slice(last) });
  return out;
};

// #2 — MarkerText
// A paragraph of light text where flagged phrases get a HIGHLIGHTER stroke that
// sweeps left→right (clip-path width 0→100%). Marks animate one after another.
// Pass either `tokens` or a `text` string with `*emphasis*`.
export const MarkerText: React.FC<{
  text?: string;
  tokens?: Token[];
  defaultMark?: Token["mark"];
  bg?: string;
  onDark?: boolean; // light text on footage (true) vs dark text on navy card (false)
  fontSize?: number;
  perMark?: number; // frames between successive highlights
  startAt?: number;
  durationInFrames?: number;
}> = ({
  text,
  tokens,
  defaultMark = "yellow",
  bg,
  onDark = true,
  fontSize = 46,
  perMark = 14,
  startAt = 0,
  durationInFrames,
}) => {
  const frame = useCurrentFrame() - startAt;
  const toks = tokens ?? parseMarks(text ?? "", defaultMark);

  // body fades in first
  const bodyIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let markIdx = 0;
  const textColor = onDark ? MG.text : MG.bg0;

  return (
    <AbsoluteFill>
      <MediaBg src={bg} darken={onDark ? 0.42 : 0} duration={durationInFrames} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 12%" }}>
        <p
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            fontSize,
            lineHeight: 1.5,
            color: textColor,
            opacity: bodyIn,
            textShadow: onDark ? "0 2px 12px rgba(0,0,0,.6)" : "none",
            margin: 0,
          }}
        >
          {toks.map((tk, i) => {
            if (!tk.mark) return <span key={i}>{tk.t}</span>;
            const start = 16 + markIdx * perMark;
            markIdx++;
            const sweep = interpolate(frame, [start, start + 12], [0, 100], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const col = MARK_COLORS[tk.mark];
            return (
              <span key={i} style={{ position: "relative", display: "inline", whiteSpace: "pre-wrap" }}>
                <span
                  style={{
                    position: "absolute",
                    left: -3,
                    right: -3,
                    top: "12%",
                    bottom: "8%",
                    background: col,
                    opacity: onDark ? 0.9 : 0.62,
                    clipPath: `inset(0 ${100 - sweep}% 0 0)`,
                    borderRadius: 3,
                    zIndex: 0,
                  }}
                />
                <span style={{ position: "relative", zIndex: 1, color: onDark ? MG.bg0 : MG.bg0, fontWeight: 800 }}>
                  {tk.t}
                </span>
              </span>
            );
          })}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
