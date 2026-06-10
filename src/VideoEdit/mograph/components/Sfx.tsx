import { Audio, Sequence, staticFile } from "remotion";

// Kit-local sound. Files live in public/sfx/. `Cue` drops an SFX at an exact
// frame (relative to the enclosing Sequence), low volume so it sits under the
// narration. Kept self-contained so the kit stays portable.
export const Cue: React.FC<{
  at: number;
  src: string;
  volume?: number;
  durationInFrames?: number;
}> = ({ at, src, volume = 0.5, durationInFrames = 60 }) => (
  <Sequence from={at} durationInFrames={durationInFrames} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

// Roles the mograph components use. The two user-provided ones (counterUp,
// keyType) plus a few from the existing pack for motion accents.
export const MGFX = {
  counterUp: "sfx/counter_up.mp3", // contador subiendo (RangeCounter)
  keyType: "sfx/keyboard_type.mp3", // tecleo (MapReveal / QuoteCard typewriter)
  whoosh: "sfx/ksjsbwuil-whoosh3-481204.mp3",
  swish: "sfx/stereogenicstudio-swish-swoosh-woosh-sfx-36-357175.mp3",
  pop: "sfx/floraphonic-ui-pop-up-15-197897.mp3",
  lineDraw: "sfx/line_draw.mp3",
  nodeLand: "sfx/node_land.mp3",
  boom: "sfx/deep-cinematic-impact-1.mp3",
} as const;
