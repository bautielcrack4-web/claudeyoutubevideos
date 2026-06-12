import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";
import { SfxCue, SFX } from "./components/Sfx";
import { CUES } from "./cues_tick.gen";

// ── "KILL EVERY Tick On Your Land — The Amish Way ($4 Powder)" (Claudio, Amish) ──
// Documental EN INGLÉS con presentador. Narración + avatar (public/tick_opt.mp4)
// + flujo denso de fotos/clips reales + diagramas gpt-image-2 + texto cinético.
// Paleta terrosa/vintage. Narración real ~1476s (lo posterior es audio corrupto del
// bucket de mosquitos). Diagramas con clip= (avatar_clips/<id>.mp4, farm-safe).
const TOTAL = 1477;
export const TOTAL_FRAMES_TICK = Math.round(TOTAL * 30);

// Beats que abren sección (stinger + swell)
const SECTION_KEYS = new Set([
  "h01", "g01", "r01", "t01", "s01", "f01", "u01", "d01", "c01", "l01", "n01", "w01", "o01",
]);

// El avatar abre a pantalla completa (~5s) ANTES del 1er b-roll. Luego VARÍA mucho de
// posición; hidden en diagramas/journeys/ImpactReveals/tomas tk_av_* (para no duplicar
// a Claudio) y en el montaje denso del hook; full en beats personales/emotivos.
const AVATAR_WINDOWS: AvatarWindow[] = [
  { start: 0, mode: "full" },
  { start: 5.0, mode: "hidden" },     // HOOK montaje denso
  { start: 58.0, mode: "full" },      // "this is why I'm afraid… my grandfather"
  { start: 95.0, mode: "hidden" },    // g01 tk_av abuelo + polvo
  { start: 100.5, mode: "cornerTR" },
  { start: 111.0, mode: "hidden" },   // g04 tk_av dusting socks
  { start: 115.5, mode: "cornerTR" },
  { start: 134.5, mode: "hidden" },   // g08 tk_av "My name is Claudio"
  { start: 139.5, mode: "cornerTR" },
  { start: 152.0, mode: "full" },     // "this one is different" (personal)
  { start: 168.0, mode: "right" },    // r01 splitlist roadmap (lista a la izq)
  { start: 174.0, mode: "full" },
  { start: 195.0, mode: "cornerTR" }, // r02 quote / r03 impact
  { start: 206.0, mode: "full" },     // "let me start with what a tick is"
  { start: 235.0, mode: "hidden" },   // t01 diagrama anatomía
  { start: 243.0, mode: "cornerTR" },
  { start: 258.0, mode: "hidden" },   // t04 journey "the quest"
  { start: 278.0, mode: "full" },
  { start: 300.0, mode: "hidden" },   // t05 sizescale (full-screen vector)
  { start: 307.0, mode: "cornerTR" }, // t06 callout
  { start: 312.0, mode: "full" },
  { start: 348.0, mode: "hidden" },   // t07 + t08 diagramas
  { start: 378.0, mode: "hidden" },   // t09 riskclock (full-screen gauge)
  { start: 386.0, mode: "cornerTR" }, // t10 clock photo
  { start: 391.0, mode: "hidden" },   // t11 tk_av evening check
  { start: 396.0, mode: "full" },     // grandmother / evening check
  { start: 436.0, mode: "cornerTR" }, // s01-s03 sulfur reveal
  { start: 452.0, mode: "full" },
  { start: 460.0, mode: "hidden" },   // s04 journey historia
  { start: 482.0, mode: "full" },
  { start: 500.0, mode: "hidden" },   // s4b scent (full-screen vector)
  { start: 508.0, mode: "full" },
  { start: 521.0, mode: "hidden" },   // s05 diagrama why
  { start: 530.0, mode: "cornerTR" }, // s06 dust puff
  { start: 535.0, mode: "full" },
  { start: 563.0, mode: "hidden" },   // f01 diagrama safe
  { start: 572.0, mode: "cornerTR" }, // f02-f05
  { start: 612.0, mode: "full" },
  { start: 640.0, mode: "cornerTR" }, // f06 quote industry
  { start: 645.0, mode: "full" },     // "here is how you use it"
  { start: 668.0, mode: "hidden" },   // u01 rule + u02 tk_av slap
  { start: 684.0, mode: "cornerTR" },
  { start: 690.0, mode: "hidden" },   // u03 diagrama clothing
  { start: 699.0, mode: "cornerTR" }, // u04 sock cuff
  { start: 719.5, mode: "full" },
  { start: 740.0, mode: "hidden" },   // u05 rule 02
  { start: 746.0, mode: "cornerTR" }, // u06 boot
  { start: 757.0, mode: "hidden" },   // u07 rule 03 + u08 tk_av duster
  { start: 768.0, mode: "cornerTR" }, // u09 duster tool
  { start: 773.0, mode: "full" },
  { start: 798.0, mode: "right" },    // u10 splitlist twice a year
  { start: 804.5, mode: "full" },     // deer narration
  { start: 858.0, mode: "cornerTR" }, // d01 whitetail / d02 stat
  { start: 872.0, mode: "full" },
  { start: 880.0, mode: "hidden" },   // d03 cross tick line
  { start: 887.5, mode: "cornerTR" }, // d04 woodchip / d05 stat
  { start: 912.0, mode: "full" },
  { start: 938.0, mode: "cornerTR" }, // d06 aged study
  { start: 944.5, mode: "full" },     // daily check intro
  { start: 980.0, mode: "hidden" },   // c01 tk_av evening check kids
  { start: 985.0, mode: "full" },
  { start: 1010.0, mode: "hidden" },  // c02 journey + c03 diagrama removal
  { start: 1029.0, mode: "left" },    // c04 checklist removal
  { start: 1038.0, mode: "cornerTR" },// c05 tweezers / c06 dog
  { start: 1048.5, mode: "full" },    // big picture intro
  { start: 1110.0, mode: "cornerTR" },// l01 headline / l02 aged
  { start: 1122.5, mode: "full" },
  { start: 1130.0, mode: "hidden" },  // l03 journey lyme spread
  { start: 1148.0, mode: "cornerTR" },// l04 stat / l05 bars
  { start: 1163.0, mode: "full" },    // neighbor intro (personal)
  { start: 1175.0, mode: "cornerTR" },// n01 roofer / n02 quote
  { start: 1186.5, mode: "full" },
  { start: 1200.0, mode: "cornerTR" },// n03 bars
  { start: 1207.0, mode: "hidden" },  // n04 costtally (full-screen vector)
  { start: 1215.0, mode: "full" },
  { start: 1240.0, mode: "cornerTR" },// n05 bars / n06 quote
  { start: 1261.0, mode: "full" },    // "so this weekend" (personal CTA)
  { start: 1290.0, mode: "cornerTR" },// w01 feedstore / w02 chips
  { start: 1302.5, mode: "full" },
  { start: 1320.0, mode: "left" },    // w03 checklist whole system
  { start: 1329.0, mode: "full" },
  { start: 1340.0, mode: "hidden" },  // w04 tk_av dust socks payoff
  { start: 1345.0, mode: "full" },    // outro (personal)
  { start: 1395.0, mode: "hidden" },  // o01 quote sobre tk_av_portrait_close
  { start: 1400.5, mode: "full" },    // community
  { start: 1420.0, mode: "cornerTR" },// o02 winter / o03 teaser
  { start: 1446.0, mode: "full" },    // cierre
  { start: TOTAL, mode: "hidden" },
];

export const MainTick: React.FC = () => {
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
          {/* AVATAR encima del b-roll (provee el audio de la narración siempre) */}
          <AvatarLayer src="tick_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          <SectionGrade ranges={GRADE} />
          {CUES.filter((c) => SECTION_KEYS.has(c.key)).map((c) => (
            <Sequence key={"stg" + c.key} from={sec(c.start) - sec(0.25)} durationInFrames={sec(0.7)} layout="none">
              <SectionStinger />
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
      {CUES.filter((c) => SECTION_KEYS.has(c.key)).map((c) => (
        <SfxCue key={"sw" + c.key} at={sec(c.start) - sec(0.4)} src={SFX.sectionSwell} volume={0.2} durationInFrames={sec(2)} />
      ))}
      {CUES.filter((c) => SECTION_KEYS.has(c.key)).map((c) => (
        <SfxCue key={"st" + c.key} at={sec(c.start)} src={SFX.stingerHit} volume={0.22} durationInFrames={sec(1.6)} />
      ))}
    </AbsoluteFill>
  );
};

// color-grade por mood de sección (wash terroso suave)
const GRADE: GradeRange[] = [
  { from: 0, to: 58, tint: "#9A5238", strength: 0.06 },      // hook: terracota oscuro
  { from: 58, to: 168, tint: "#A9794A", strength: 0.05 },    // abuelo / identidad: sepia
  { from: 168, to: 235, tint: "#7C8A5A", strength: 0.05 },   // promesa: salvia
  { from: 235, to: 436, tint: "#6F8478", strength: 0.06 },   // qué es la garrapata: eucalipto frío
  { from: 436, to: 563, tint: "#C8904A", strength: 0.05 },   // azufre + historia: ámbar
  { from: 563, to: 668, tint: "#7C8A5A", strength: 0.05 },   // seguridad: verde
  { from: 668, to: 858, tint: "#B0833F", strength: 0.05 },   // aplicación: tierra
  { from: 858, to: 958, tint: "#7C8A5A", strength: 0.05 },   // deer / tick line: salvia
  { from: 958, to: 1110, tint: "#A9794A", strength: 0.05 },  // chequeo diario: sepia
  { from: 1110, to: 1175, tint: "#6F8478", strength: 0.06 }, // historia de Lyme: frío
  { from: 1175, to: 1290, tint: "#9A5238", strength: 0.06 }, // vecino / la estafa: terracota
  { from: 1290, to: 1395, tint: "#6E8B47", strength: 0.05 }, // CTA: verde
  { from: 1395, to: TOTAL, tint: "#6F8478", strength: 0.06 },// outro / teaser: frío
];
