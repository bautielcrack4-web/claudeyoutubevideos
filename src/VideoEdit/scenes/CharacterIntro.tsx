import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Trail } from "@remotion/motion-blur";
import { COLORS, FONT_STACK } from "../theme";
import { ImageBackdrop } from "../components/Backdrops";
import { DepthCard } from "../components/DepthCard";
import { SfxCue, SFX } from "../components/Sfx";

// Rule 13 — cinematic "character intro" (documentary lower-third).
// Beat 1: full-screen photo + push  -> whoosh
// Beat 2: photo blurs + darkens into the BACKGROUND
// Beat 3: framed portrait card flies in on the right (color frame, parallax) -> pop
// Beat 4: name + role text animates in on the left -> pop
// Each beat staggered, each with its own SFX (Rule 7 pacing + Rule 9J sound).
export const CharacterIntro: React.FC<{
  durationInFrames: number;
  bgImage: string; // wide establishing shot (staticFile path)
  portraitImage: string; // the framed portrait (staticFile path)
  name: string;
  role: string;
  accent?: string;
  tint?: string; // warm wash over the bg
  withSfx?: boolean;
  motionBlur?: boolean; // Rule 6 #6 — smear the portrait fly-in
}> = ({
  durationInFrames,
  bgImage,
  portraitImage,
  name,
  role,
  accent = COLORS.amber,
  tint = "rgba(255,178,62,0.16)",
  withSfx = true,
  motionBlur = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beat 2: the establishing photo blurs in over the first ~0.8s
  const blurIn = interpolate(frame, [0, 24], [0, 7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const darkenIn = interpolate(frame, [0, 24], [0.25, 0.58], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 3: portrait card enters from the right
  const cardS = spring({ frame: frame - 26, fps, config: { damping: 18, mass: 0.9 } });
  const cardX = interpolate(cardS, [0, 1], [140, 0]);
  const cardOp = interpolate(cardS, [0, 1], [0, 1]);
  const cardScale = interpolate(cardS, [0, 1], [0.86, 1]);

  // Beat 4: text enters from the left
  const txtS = spring({ frame: frame - 46, fps, config: { damping: 20 } });
  const txtX = interpolate(txtS, [0, 1], [-70, 0]);
  const txtOp = interpolate(txtS, [0, 1], [0, 1]);
  const roleS = spring({ frame: frame - 56, fps, config: { damping: 20 } });

  // exit
  const exit = spring({ frame: frame - (durationInFrames - 14), fps, config: { damping: 200 } });
  const exitOp = interpolate(exit, [0, 1], [1, 0]);

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, opacity: exitOp }}>
      <ImageBackdrop src={bgImage} blur={blurIn} darken={darkenIn} tint={tint} durationInFrames={durationInFrames} />

      {/* framed portrait, right */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {(() => {
          const card = (
            <div
              style={{
                position: "absolute",
                right: 150,
                opacity: cardOp,
                transform: `translateX(${cardX}px) scale(${cardScale})`,
              }}
            >
              <DepthCard accent={accent} image={portraitImage} width={520} height={680} radius={26} blur={0} darken={0.12} seed={2.2} />
            </div>
          );
          // motion blur only during the fly-in window (Beat 3); after it settles
          // the trailing copies overlap so there is no smear when static.
          return motionBlur && frame < 44 ? (
            <Trail layers={6} lagInFrames={1.3} trailOpacity={0.55}>
              {card}
            </Trail>
          ) : (
            card
          );
        })()}
      </AbsoluteFill>

      {/* name + role, left */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: "50%",
          transform: "translateY(-50%)",
          maxWidth: 760,
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            letterSpacing: 4,
            color: "#fff",
            opacity: txtOp,
            transform: `translateX(${txtX}px)`,
            textShadow: "0 6px 40px rgba(0,0,0,0.6)",
          }}
        >
          {name}
        </div>
        <div
          style={{
            width: interpolate(roleS, [0, 1], [0, 240]),
            height: 4,
            background: accent,
            borderRadius: 2,
            margin: "18px 0 22px",
            boxShadow: `0 0 18px ${accent}`,
          }}
        />
        <div
          style={{
            fontSize: 44,
            fontWeight: 600,
            color: COLORS.textSoft,
            opacity: interpolate(roleS, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(roleS, [0, 1], [-50, 0])}px)`,
          }}
        >
          {role}
        </div>
      </div>

      {withSfx && (
        <>
          <SfxCue at={0} src={SFX.whoosh} volume={0.5} />
          <SfxCue at={26} src={SFX.popUp} volume={0.55} />
          <SfxCue at={46} src={SFX.pop2} volume={0.5} />
        </>
      )}
    </AbsoluteFill>
  );
};
