import { Audio, Sequence, staticFile } from "remotion";

// Rule 9J / 11D — sound design. Drop an SFX at an exact frame, under the voice.
// Files live in public/sfx/. Volume defaults low so it sits below narration.
export const SfxCue: React.FC<{
  at: number; // frame to fire (relative to the enclosing Sequence)
  src: string; // e.g. "sfx/ksjsbwuil-whoosh3-481204.mp3"
  volume?: number;
  durationInFrames?: number;
}> = ({ at, src, volume = 0.5, durationInFrames = 45 }) => (
  <Sequence from={at} durationInFrames={durationInFrames} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

// Named map of the user's uploaded SFX pack so scenes reference roles, not files.
export const SFX = {
  whoosh: "sfx/ksjsbwuil-whoosh3-481204.mp3",
  whoosh2: "sfx/freesound_community-whoosh-blow-flutter-shortwav-14678.mp3",
  swish: "sfx/stereogenicstudio-swish-swoosh-woosh-sfx-36-357175.mp3",
  shutter: "sfx/universfield-camera-shutter-199580.mp3",
  transition: "sfx/juniorsoundays-motion-amp-tansitions-03-527739.mp3",
  popUp: "sfx/floraphonic-ui-pop-up-15-197897.mp3",
  pop1: "sfx/floraphonic-casual-click-pop-ui-2-262119.mp3",
  pop2: "sfx/floraphonic-casual-click-pop-ui-3-262120.mp3",
  pop3: "sfx/floraphonic-casual-click-pop-ui-4-262121.mp3",
  pop4: "sfx/floraphonic-casual-click-pop-ui-7-262127.mp3",
  click: "sfx/floraphonic-minimal-pop-click-ui-1-198301.mp3",
  ui1: "sfx/juniorsoundays-ui-sound-02-527862.mp3",
  ui2: "sfx/juniorsoundays-ui-sound-14-527823.mp3",
  ui3: "sfx/juniorsoundays-ui-sound-41-527814.mp3",
  ui4: "sfx/juniorsoundays-ui-sound-56-527824.mp3",
  ui5: "sfx/juniorsoundays-ui-sound-70-527837.mp3",
  ui6: "sfx/juniorsoundays-ui-sound-73-527841.mp3",
  ui7: "sfx/juniorsoundays-ui-sound-80-527880.mp3",
  ui8: "sfx/juniorsoundays-ui-sound-136-540452.mp3",
  ui9: "sfx/arnav_geddada-ui-sound-2-374229.mp3",
  close: "sfx/litupsubway-ui-close-sfx-513359.mp3",
  // golpes graves cinematográficos (sub-boom) para los IMPACT REVEAL / zoom hooks
  boom1: "sfx/deep-cinematic-impact-1.mp3",
  boom2: "sfx/deep-cinematic-impact-2.mp3",
  zoomHit: "sfx/deep-cinematic-zoom-3.mp3",
  // ── PACK A MEDIDA (ElevenLabs) — orgánico/vintage, por evento ──
  camZoomPunch: "sfx/cam_zoom_punch.mp3",
  camTravel: "sfx/cam_travel.mp3",
  camZoomOut: "sfx/cam_zoom_out.mp3",
  lineDraw: "sfx/line_draw.mp3",
  lineArrive: "sfx/line_arrive.mp3",
  nodeLand: "sfx/node_land.mp3",
  nodePop: "sfx/node_pop.mp3",
  barGrow: "sfx/bar_grow.mp3",
  barLand: "sfx/bar_land.mp3",
  winnerChime: "sfx/winner_chime.mp3",
  digitTick: "sfx/digit_tick.mp3",
  numberRoll: "sfx/number_roll.mp3",
  numberSlam: "sfx/number_slam.mp3",
  layerDrop: "sfx/layer_drop.mp3",
  markerDrive: "sfx/marker_drive.mp3",
  chipPop3d: "sfx/chip_pop3d.mp3",
  textSlam: "sfx/text_slam.mp3",
  kickerType: "sfx/kicker_type.mp3",
  sectionSwell: "sfx/section_swell.mp3",
  stingerHit: "sfx/stinger_hit.mp3",
  ambTaller: "sfx/amb_taller.mp3",
  ambFuego: "sfx/amb_fuego.mp3",
  ambCampo: "sfx/amb_campo.mp3",
  ambInvierno: "sfx/amb_invierno.mp3",
} as const;

// Golpes graves para revelaciones — rotar para que no suenen idénticos.
export const BOOMS = [SFX.boom1, SFX.boom2, SFX.zoomHit] as const;

// Rotate through the pop variants so staggered reveals don't sound identical.
export const POPS = [SFX.pop1, SFX.pop2, SFX.pop3, SFX.pop4, SFX.popUp] as const;
