import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { DocClip } from "./doc/DocClip";
import { DocGrade } from "./doc/DocGrade";

// ── PROTOTIPO documental de fauna v2 (Serengeti · babuinos) ───────────────────
// 100% clips REALES (matchclip por VISIÓN). Narración RE-ESPACIADA + flujo DENSO de
// tomas con CORTE DURO (sin disolvencias), sin títulos ni imágenes — puro metraje.
// El look unificado entre fuentes distintas lo da DocGrade (grade + viñeta + grano).
const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);
const B = (n: string) => `broll/${n}.mp4`;

// cada oración (s..e del audio ORIGINAL) + aire (gap) + VARIAS tomas que la ilustran
type Beat = { clips: string[]; s: number; e: number; gap: number; jcut: number };
const BEATS: Beat[] = [
  { clips: ["doc_wild_dogs_run", "doc_wild_dogs_alert", "doc_baboon_troop_rocks"], s: 0.0, e: 6.9, gap: 1.6, jcut: 0.8 },
  { clips: ["doc_serengeti_sunrise", "doc_sun_through_mist", "doc_acacia_dawn", "doc_golden_grass", "doc_savanna_aerial_dawn"], s: 6.9, e: 19.1, gap: 1.2, jcut: 0.6 },
  { clips: ["doc_dew_grass", "doc_waterdrop_grass", "doc_spiderweb_dew"], s: 19.1, e: 27.0, gap: 1.2, jcut: 0.4 },
  { clips: ["doc_dust_wind", "doc_dry_grass_wind", "doc_heat_haze"], s: 27.0, e: 32.7, gap: 1.0, jcut: 0.4 },
  { clips: ["doc_baboon_outcrop", "doc_baboons_kopje", "doc_baboon_climb_rock"], s: 32.7, e: 40.2, gap: 1.2, jcut: 0.4 },
  { clips: ["doc_baboon_social", "doc_baboon_grooming", "doc_baboon_juveniles", "doc_baboon_mother_baby"], s: 40.2, e: 48.4, gap: 1.0, jcut: 0.4 },
  { clips: ["doc_baboon_alpha", "doc_baboon_portrait"], s: 48.4, e: 52.0, gap: 0.9, jcut: 0.4 },
  { clips: ["doc_baboon_watching", "doc_baboon_eyes"], s: 52.0, e: 56.5, gap: 0.9, jcut: 0.4 },
  { clips: ["doc_baboon_survey", "doc_baboon_high_rock", "doc_troop_from_above"], s: 56.5, e: 65.3, gap: 1.2, jcut: 0.4 },
  { clips: ["doc_baboon_canines", "doc_baboon_yawn"], s: 65.3, e: 69.7, gap: 0.9, jcut: 0.4 },
  { clips: ["doc_baboon_face", "doc_baboon_scan"], s: 69.7, e: 72.3, gap: 0.7, jcut: 0.35 },
  { clips: ["doc_baboon_hands", "doc_baboon_fingers"], s: 72.3, e: 75.6, gap: 0.9, jcut: 0.4 },
  { clips: ["doc_baboon_grip", "doc_baboon_forage_hands", "doc_baboon_walk"], s: 75.6, e: 79.5, gap: 1.8, jcut: 0.4 },
];

// timeline: acumular beats; dentro de cada beat, repartir las tomas a CORTE DURO
let acc = 0;
type Sub = { src: string; from: number; dur: number; kb: "in" | "out" | "none" };
const SUBS: Sub[] = [];
const AUDIO: { from: number; s: number; e: number; durF: number }[] = [];
BEATS.forEach((b, bi) => {
  const d = b.e - b.s;
  const beatDur = d + b.gap;
  const nt = acc;
  // audio de la oración, re-colocado con jcut
  AUDIO.push({ from: sec(nt + b.jcut), s: b.s, e: b.e, durF: sec(b.e - b.s) });
  // tomas a corte duro que llenan el beat
  const n = b.clips.length;
  const segF = Math.round(sec(beatDur) / n);
  b.clips.forEach((c, ci) => {
    const from = sec(nt) + ci * segF;
    const dur = ci === n - 1 ? sec(nt + beatDur) - from : segF; // la última cierra el beat
    SUBS.push({ src: c, from, dur, kb: ci % 2 === 0 ? "in" : "out" });
  });
  acc += beatDur;
});
const TOTAL = acc;
export const TOTAL_FRAMES_SABANA = sec(TOTAL);

export const MainSabana: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* CLIPS a corte duro (grade de contraste/saturación en el wrapper) */}
      <AbsoluteFill style={{ filter: "contrast(1.08) saturate(1.14) brightness(1.02)" }}>
        {SUBS.map((s, i) => (
          <Sequence key={"c" + i} from={s.from} durationInFrames={s.dur}>
            <DocClip durationInFrames={s.dur} src={B(s.src)} fade={0} kenburns={s.kb} />
          </Sequence>
        ))}
      </AbsoluteFill>

      {/* GRADE unificado (sin barras ni títulos: puro metraje) */}
      <DocGrade bars={false} />

      {/* NARRACIÓN re-espaciada: cada oración recortada del wav original y re-colocada */}
      {AUDIO.map((a, i) => (
        <Sequence key={"a" + i} from={a.from} durationInFrames={a.durF + 2} layout="none">
          <Audio src={staticFile("sabana_full.wav")} trimBefore={sec(a.s)} trimAfter={sec(a.e)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
