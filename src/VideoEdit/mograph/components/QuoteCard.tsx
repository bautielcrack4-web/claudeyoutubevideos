import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { MG, BODY, navyBg } from "../theme";
import { typed } from "../lib/draw";
import { Cue, MGFX } from "./Sfx";

// #3 — QuoteCard
// A large pull-quote on the left (typed/faded in) with a portrait on the right
// that slides + scales in, and a dashed attribution beneath. Dark broadcast bg.
export const QuoteCard: React.FC<{
  quote: string;
  cite?: string; // e.g. "Mairi McAllan, Scotland's Environment Secretary"
  portrait?: string; // image src (staticFile path or URL)
  type?: boolean; // typewriter (true) vs fade (false)
  accentWord?: string; // a word to tint cyan, optional
  sound?: boolean; // keyboard SFX while typing (only when type=true; default true)
  startAt?: number;
  durationInFrames?: number;
}> = ({
  quote,
  cite,
  portrait,
  type = false,
  accentWord,
  sound = true,
  startAt = 0,
}) => {
  const frame = useCurrentFrame() - startAt;
  const { fps } = useVideoConfig();

  const quoteIn = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const TYPE_AT = 4;
  const typeCps = 0.85;
  const shown = type ? typed(frame, quote, TYPE_AT, typeCps) : quote;
  const portraitIn = spring({ frame: frame - 6, fps, config: { damping: 18, mass: 0.8, stiffness: 140 } });
  const citeIn = interpolate(frame, [22, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const isUrl = (s: string) => /^(https?:|data:|blob:|\/)/.test(s);

  // render quote with optional accent word tinted
  const renderQuote = () => {
    if (!accentWord) return shown;
    const parts = shown.split(new RegExp(`(${accentWord})`, "i"));
    return parts.map((p, i) =>
      p.toLowerCase() === accentWord.toLowerCase() ? (
        <span key={i} style={{ color: MG.cyan }}>{p}</span>
      ) : (
        <span key={i}>{p}</span>
      ),
    );
  };

  const typeFrames = Math.ceil(quote.length / typeCps);

  return (
    <AbsoluteFill style={navyBg}>
      {sound && type && (
        <Cue at={TYPE_AT} src={MGFX.keyType} volume={0.38} durationInFrames={typeFrames + 6} />
      )}
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center" }}>
        {/* quote */}
        <div style={{ flex: 1.4, padding: "0 60px 0 90px" }}>
          <div
            style={{
              fontFamily: BODY,
              fontWeight: 300,
              fontSize: 56,
              color: MG.cyan,
              opacity: quoteIn,
              lineHeight: 0.4,
              marginBottom: 18,
            }}
          >
            “
          </div>
          <div
            style={{
              fontFamily: BODY,
              fontWeight: 500,
              fontSize: 52,
              lineHeight: 1.34,
              color: MG.text,
              opacity: quoteIn,
            }}
          >
            {renderQuote()}
          </div>
          {cite && (
            <div
              style={{
                marginTop: 36,
                fontFamily: BODY,
                fontWeight: 700,
                fontSize: 30,
                color: MG.cyan,
                opacity: citeIn,
                transform: `translateY(${interpolate(citeIn, [0, 1], [10, 0])}px)`,
              }}
            >
              — {cite}
            </div>
          )}
        </div>

        {/* portrait */}
        <div style={{ flex: 1, height: "100%", position: "relative", overflow: "hidden" }}>
          {portrait && (
            <Img
              src={isUrl(portrait) ? portrait : staticFile(portrait)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: portraitIn,
                transform: `scale(${interpolate(portraitIn, [0, 1], [1.12, 1])}) translateX(${interpolate(portraitIn, [0, 1], [40, 0])}px)`,
              }}
            />
          )}
          {/* left feather so the portrait melts into the navy */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(90deg, ${MG.bg0} 0%, rgba(11,14,19,0) 28%)`,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
