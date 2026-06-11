import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { CUES } from "./cues_animales.gen";

// ── 7 ANIMALES MÁS RENTABLES PARA EL PATIO — homestead, con avatar (abuelo) ──
// Narración (animales_opt.mp4, audio provisto por AvatarLayer) + flujo denso de
// imágenes reales, tarjetas TOP7 de revelación con riel 1→7, cifras, barras, pasos,
// journeys y diagramas. Paleta terrosa serif. Cues anclados a captions reales
// (beatsheet/animales.json → cues_animales.gen).
const SECONDS = 1764.36;
export const TOTAL_FRAMES_ANIM = Math.round(SECONDS * 30); // 52931

// límites de sección (segundos) — para grade + stingers
const ACTS = [0, 74.32, 115.2, 168.13, 327, 534.76, 709.28, 836.72, 989.8, 1191.04, 1395.1, 1493.16, 1683.41];

// color-grade por mood de sección (wash suave, paleta terrosa)
const GRADE: GradeRange[] = [
  { from: 0, to: 74.32, tint: "#B0503C", strength: 0.07 },     // hook: el problema (terracota)
  { from: 74.32, to: 115.2, tint: "#A9794A", strength: 0.06 }, // abuelo: sepia nostálgico
  { from: 115.2, to: 168.13, tint: "#7C8A5A", strength: 0.06 },// promesa: salvia
  { from: 168.13, to: 327, tint: "#6E8B47", strength: 0.06 },  // 1 gallina: garden green
  { from: 327, to: 534.76, tint: "#A9794A", strength: 0.06 },  // 2 conejo: sepia
  { from: 534.76, to: 709.28, tint: "#7C8A5A", strength: 0.06 },// 3 codorniz: salvia
  { from: 709.28, to: 836.72, tint: "#6F8478", strength: 0.06 },// 4 pato: eucalipto
  { from: 836.72, to: 989.8, tint: "#6E8B47", strength: 0.06 },// 5 cabra: garden green
  { from: 989.8, to: 1191.04, tint: "#A9794A", strength: 0.06 },// 6 lombriz: tierra/sepia
  { from: 1191.04, to: 1395.1, tint: "#A9794A", strength: 0.07 },// 7 abeja: miel dorada
  { from: 1395.1, to: 1493.16, tint: "#7C8A5A", strength: 0.06 },// recap: salvia
  { from: 1493.16, to: 1683.41, tint: "#6F8478", strength: 0.06 },// reflexión: frío
  { from: 1683.41, to: SECONDS, tint: "#A9794A", strength: 0.07 },// cierre: sepia esperanzado
];

// ── posición del AVATAR (auto-derivada de los cues) ───────────────────────────
// Regla dura: lo PRIMERO es avatar full ~1.83s antes de la 1ª imagen.
const FIRST_IMG = 1.83;
const PIP_KINDS = new Set(["raw", "stat", "quote", "chips"]);
const OPENER = 4; // s de avatar full al inicio de cada sección
const OPENER_SPANS = ACTS.filter((t) => t > 0).map((t) => ({ s: t, e: t + OPENER }));

// ★ VARIEDAD DE POSICIÓN (regla dura #3): cada sección usa una posición distinta del
// avatar — esquinas ROTADAS (TR/TL/BR/BL) + splits laterales (left/right, avatar a un
// lado y el b-roll al otro). Cambia en los límites de sección, no beat a beat (no salta).
const SECTION_POS: AvatarWindow["mode"][] = [
  "cornerTR", "left", "cornerBR", "right", "cornerTL", "cornerBR", "left",
  "cornerTR", "right", "cornerBL", "cornerTL", "left", "cornerBR",
];
const sectionOf = (t: number) => { let i = 0; for (let k = 0; k < ACTS.length; k++) if (t >= ACTS[k]) i = k; return i; };

// beats "él haciendo X" (PA / gpt-image-ref): son fotos full-screen que YA lo muestran,
// así que el PiP del avatar se OCULTA en ellos (si no, sale dos veces).
const SELF_KEYS = new Set([
  "hk_fridge", "g_basket", "c_manure", "k_pen", "l_humus", "b_suit", "b_frame", "cl_soil",
  "q_hand", "g_him_coop", "c_him_hold", "q_him_egg", "p_him_garden", "k_him_milk", "l_him_bin", "b_him_honey", "recap_him",
]);

function modeAt(t: number): AvatarWindow["mode"] {
  if (t < FIRST_IMG) return "full"; // apertura obligatoria
  const c = CUES.find((c) => t >= c.start && t < c.start + c.dur);
  if (c && SELF_KEYS.has(c.key)) return "hidden"; // foto de él haciendo la acción → sin PiP
  if (c && c.kind === "half") return "halfL"; // split 50/50: avatar mitad izq, imagen der
  if (c && !PIP_KINDS.has(c.kind)) return "hidden"; // gráfico full-bleed oculta el avatar
  for (const a of OPENER_SPANS) if (t >= a.s && t < a.e) return "full";
  if (!c) return "full"; // hueco hablado → full
  // posición de la sección; los beats con TEXTO encima (stat/quote/chips) NO usan
  // split lateral (taparía el texto) → caen a la esquina sup-der segura.
  const pos = SECTION_POS[sectionOf(t)] ?? "cornerTR";
  if (c.kind !== "raw" && (pos === "left" || pos === "right")) return "cornerTR";
  return pos;
}
function buildAvatarWindows(): AvatarWindow[] {
  const marks = new Set<number>([0, FIRST_IMG, SECONDS]);
  for (const c of CUES) { marks.add(c.start); marks.add(+(c.start + c.dur).toFixed(2)); }
  for (const a of OPENER_SPANS) { marks.add(a.s); marks.add(+a.e.toFixed(2)); }
  const times = [...marks].filter((t) => t >= 0 && t < SECONDS).sort((a, b) => a - b);
  const w: AvatarWindow[] = [];
  let last = "";
  for (let i = 0; i < times.length; i++) {
    const t0 = times[i], t1 = times[i + 1] ?? SECONDS;
    const mode = modeAt((t0 + t1) / 2);
    if (mode !== last) { w.push({ start: +t0.toFixed(2), mode }); last = mode; }
  }
  w.push({ start: SECONDS, mode: "hidden" });
  return w;
}
const AVATAR_WINDOWS = buildAvatarWindows();

// (sin cama ambiental — el usuario la sacó). Solo golpe grave en cada revelación de
// animal (las 7 tarjetas TOP7) para que esos beats respiren.
const BOOM_AT = [168.13, 327, 534.76, 709.28, 836.72, 989.8, 1191.04];

export const MainAnimales: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap handheld={0.8} grain={0.06}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="amber" drift={0.5} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="animales_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          <SectionGrade ranges={GRADE} />
          {ACTS.filter((t) => t > 0).map((t) => (
            <Sequence key={"stg" + t} from={sec(t) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
              <SectionStinger />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"sw" + t} at={sec(t) - sec(0.4)} src={SFX.sectionSwell} volume={0.2} durationInFrames={sec(2)} />
      ))}
      {ACTS.filter((t) => t > 0).map((t) => (
        <SfxCue key={"st" + t} at={sec(t)} src={SFX.stingerHit} volume={0.22} durationInFrames={sec(1.6)} />
      ))}
      {BOOM_AT.map((t, i) => (
        <SfxCue key={"bm" + i} at={sec(t)} src={SFX.boom1} volume={0.36} durationInFrames={sec(2)} />
      ))}
    </AbsoluteFill>
  );
};
