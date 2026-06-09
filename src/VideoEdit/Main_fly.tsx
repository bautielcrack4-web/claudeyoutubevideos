import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { RawShot } from "./scenes/RawShot";
import { ImpactReveal } from "./scenes/ImpactReveal";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { ChipsCluster } from "./scenes/ReframeContent";
import { CalloutMark } from "./scenes/CalloutMark";
import { StatBig } from "./scenes/StatBig";
import { BarCompare } from "./scenes/BarCompare";
import { SplitList } from "./scenes/SplitList";
import { TextCardReveal } from "./scenes/TextCardReveal";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { Checklist } from "./scenes/Checklist";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { AgedDoc } from "./scenes/AgedDoc";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { JourneyCanvas } from "./scenes/JourneyCanvas";
import { TitleCardOpen } from "./scenes/TitleCardOpen";
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";

// ── "KILL EVERY Fly In Your Kitchen The Amish Way" (Claudio, Amish) ───────────
// Documental EN INGLÉS con presentador. Narración + avatar (public/fly_opt.mp4)
// + flujo denso de fotos/clips reales + diagramas gpt-image-2 + texto cinético.
// Paleta terrosa/vintage. ~24 min (corta en 1446s; lo posterior es audio corrupto).
const T = (img: string) => `img/${img}.png`;
const V = (clip: string) => `vid/${clip}.mp4`;

const TOTAL = 1446;
export const TOTAL_FRAMES_FLY = Math.round(TOTAL * 30); // 43380

const RD = COLORS.danger;
const GD = COLORS.good;

type Cue = { key: string; start: number; el: (d: number) => React.ReactNode };

const C: Cue[] = [
  // ════════════ HOOK · la trampa (0:00–0:45) ════════════
  { key: "h01", start: 0.0, el: (d) => <TitleCardOpen durationInFrames={d} image={T("fl_jar_sill_flies")} kicker="On my kitchen windowsill · right now" title="47 flies in 4 hours" subtitle="One jar. One pantry ingredient. $3." glowAt={[0.5, 0.55]} /> },
  { key: "h02", start: 6.5, el: (d) => <RawShot durationInFrames={d} src={V("fl_jar_sill_flies")} hue="amber" kicker="Half an inch of dark liquid" /> },
  { key: "h03", start: 11.8, el: (d) => <ImpactReveal durationInFrames={d} image={T("fl_jar_flies_macro")} setup="In the last four hours" impact="47 FLIES" impactAccent="good" hitAt={1.1} boom={1} /> },
  { key: "h04", start: 17.5, el: (d) => <SplitList durationInFrames={d} title="No store-bought anything" items={["No electric trap", "No sticky paper", "No can of spray"]} accent={RD} cross /> },
  { key: "h05", start: 25.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_molasses_bottle")} eyebrow="The dark liquid is" words={parseQuote("One *ingredient* from your pantry tonight")} accent="amber" hue="amber" /> },
  { key: "h06", start: 32.4, el: (d) => <RawShot durationInFrames={d} src={T("fl_brown_bag_table")} hue="amber" kicker="Paper from a brown grocery bag" /> },
  { key: "h07", start: 37.6, el: (d) => <RawShot durationInFrames={d} src={T("fl_three_dollars")} hue="amber" kicker="Under three dollars to build" /> },
  { key: "h08", start: 41.6, el: (d) => <RawShot durationInFrames={d} src={T("fl_first_frost")} hue="cold" kicker="Works until the first frost" /> },

  // ════════════ QUIÉN ES CLAUDIO (0:45–1:30) ════════════
  { key: "i01", start: 44.9, el: (d) => <RawShot durationInFrames={d} src={T("fl_av_talk_cabin")} hue="amber" kicker="My name is Claudio" /> },
  { key: "i02", start: 48.2, el: (d) => <RawShot durationInFrames={d} src={V("fl_beehives_row")} hue="amber" kicker="Nine hives of honeybees" /> },
  { key: "i03", start: 51.9, el: (d) => <RawShot durationInFrames={d} src={T("fl_pie_stand")} hue="amber" kicker="My wife's roadside pie stand" /> },
  { key: "i04", start: 56.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_av_beehives")} hue="amber" kicker="11 years · no swatter in my kitchen" /> },
  { key: "i05", start: 61.4, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("fl_spray_can_counter")} imageDarken={0.6} title="We do not own" chips={["bug spray", "blue light traps", "window screens"]} hue="red" /> },
  { key: "i06", start: 69.4, el: (d) => <RawShot durationInFrames={d} src={T("fl_house_1903")} hue="amber" kicker="A house my great-grandfather built · 1903" /> },
  { key: "i07", start: 75.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_old_window_noscreen")} hue="amber" kicker="The windows were never made for screens" /> },
  { key: "i08", start: 79.4, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("fl_jar_sill_flies")} imageDarken={0.62} tokens={[{ t: "A jar, brown paper, and " }, { t: "one ingredient", good: true }]} /> },

  // ════════════ PROMESA + tease (1:30–2:08) ════════════
  { key: "p01", start: 90.0, el: (d) => <Checklist durationInFrames={d} eyebrow="In this video" title="I will show you" items={[{ text: "How to build the trap", state: "doing" }, { text: "Where to set it", state: "doing" }, { text: "Why it works", state: "doing" }]} accent="good" /> },
  { key: "p02", start: 99.2, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_fly_macro_eyes")} eyebrow="And something that should worry you" words={parseQuote("The housefly is one of the most *dangerous* animals in your kitchen")} accent="danger" hue="red" /> },
  { key: "p03", start: 111.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_spray_can_counter")} hue="red" kicker="The way we're told to fight it makes it worse" /> },
  { key: "p04", start: 119.4, el: (d) => <TextCardReveal durationInFrames={d} eyebrow="Stay with me" lines={["A working trap on your counter", "by the end of tonight"]} accent={GD} /> },

  // ════════════ LA MOSCA INCOMPRENDIDA · matemática (2:08–4:07) ════════════
  { key: "r1", start: 128.0, el: (d) => <RuleNumberScene durationInFrames={d} number="01" label="WHAT MOST FOLKS GET WRONG" title="A fly is not what you think" hue="red" /> },
  { key: "e01", start: 132.5, el: (d) => <RawShot durationInFrames={d} src={T("fl_swatter_hand")} hue="amber" kicker="You see one. You reach for the swatter" /> },
  { key: "e02", start: 138.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "You kill one. You feel " }, { t: "satisfied", hl: true }]} /> },
  { key: "e03", start: 142.5, el: (d) => <RawShot durationInFrames={d} src={T("fl_flies_garbage_lip")} hue="red" kicker="What you didn't see: 16 more" /> },
  { key: "e04", start: 147.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_flies_dog_dish")} hue="red" kicker="On the dog dish" /> },
  { key: "e05", start: 150.5, el: (d) => <RawShot durationInFrames={d} src={T("fl_sugar_bowl_fly")} hue="red" kicker="On the sugar bowl" /> },
  { key: "e06", start: 153.5, el: (d) => <RawShot durationInFrames={d} src={T("fl_ripe_bananas")} hue="amber" kicker="Under the too-ripe bananas" /> },
  { key: "e07", start: 158.0, el: (d) => <StatBig durationInFrames={d} value={500} suffix=" eggs" label="from one female housefly, at a time" eyebrow="She lays" accent="danger" hue="red" /> },
  { key: "e08", start: 168.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_fly_macro_eyes")} hue="red" kicker="Six batches in her short life" /> },
  { key: "e09", start: 173.0, el: (d) => <DiagramBoard durationInFrames={d} pages={[{ image: T("dg_fly_exponential") }]} avatar="fly_opt.mp4" avatarFrom={sec(173.0)} /> },
  { key: "e10", start: 187.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_maggots_trash")} hue="red" kicker="Maggots in 24 hours" /> },
  { key: "e11", start: 192.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_torn_trashbag_sink")} eyebrow="Exponential math" words={parseQuote("In the cabinet under your *sink* where the bag tore")} accent="danger" hue="red" /> },
  { key: "e12", start: 201.0, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("fl_swatter_hand")} imageDarken={0.6} tokens={[{ t: "The swatter is " }, { t: "theater", danger: true }]} /> },
  { key: "e13", start: 207.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_av_talk_cabin")} hue="amber" kicker="What my grandmother did: think like the fly" /> },
  { key: "e14", start: 213.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_bread_cooling")} eyebrow="She smells food half a mile away" words={parseQuote("Antennae more sensitive than any *instrument* we've built")} accent="amber" hue="amber" /> },
  { key: "e15", start: 226.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_bees_clover")} hue="cold" kicker="Trap her on the way in · end the cycle" /> },
  { key: "e16", start: 232.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Swat her late and you " }, { t: "inherit a thousand", danger: true }]} /> },

  // ════════════ INGLESES vs AMISH (4:07–4:31) ════════════
  { key: "n01", start: 247.8, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_fly_on_sandwich")} eyebrow="What the English get backwards" words={parseQuote("They kill the fly on the *sandwich*")} accent="amber" hue="amber" /> },
  { key: "n02", start: 254.0, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("fl_jar_sill_flies")} imageDarken={0.6} tokens={[{ t: "We trap her " }, { t: "before", good: true }, { t: " she sees it" }] } /> },
  { key: "n03", start: 258.0, el: (d) => <BarCompare durationInFrames={d} eyebrow="Two ways to fight a fly" title="The honest cost" orientation="horizontal" hue="amber" bars={[{ label: "A glass jar", value: 3, display: "$3", tone: "good", winner: true, sub: "harms nothing" }, { label: "A can of spray", value: 9, display: "$9", tone: "danger", sub: "kills the cat too" }]} /> },
  { key: "n04", start: 266.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_cat_counter")} hue="red" kicker="Kills the cat if she licks the counter" /> },

  // ════════════ LA MOSCA SUCIA / PELIGROSA (4:31–6:42) ════════════
  { key: "r2", start: 271.5, el: (d) => <RuleNumberScene durationInFrames={d} number="02" label="WHAT A FLY ACTUALLY IS" title="The dirtiest creature in your house" hue="red" /> },
  { key: "d01", start: 276.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_fly_macro_eyes")} hue="red" kicker="She cannot chew · she has no teeth" /> },
  { key: "d02", start: 284.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_fly_proboscis_food")} eyebrow="To eat anything solid" words={parseQuote("She has to *vomit* on it, then sip it back up")} accent="danger" hue="red" /> },
  { key: "d03", start: 297.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_fly_proboscis_food")} hue="red" kicker="On every piece of bread you were about to eat" /> },
  { key: "d04", start: 308.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_manure_field")} hue="amber" kicker="Before your bread: the manure behind the barn" /> },
  { key: "d05", start: 313.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_gas_station_trash")} hue="red" kicker="The trash at the gas station" /> },
  { key: "d06", start: 317.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_dead_mouse_garage")} hue="red" kicker="The dead mouse in your garage" /> },
  { key: "d07", start: 321.0, el: (d) => <DiagramBoard durationInFrames={d} pages={[{ image: T("dg_fly_contamination") }]} avatar="fly_opt.mp4" avatarFrom={sec(321.0)} /> },
  { key: "d08", start: 334.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_fly_legs_hairs")} hue="red" kicker="Every hair carries where she's been" /> },
  { key: "d09", start: 345.7, el: (d) => <RawShot durationInFrames={d} src={T("fl_petri_bacteria")} hue="cold" kicker="University of Pennsylvania counted them" /> },
  { key: "d10", start: 357.2, el: (d) => <ImpactReveal durationInFrames={d} image={T("fl_petri_bacteria")} setup="The average fly carried" impact="351 BACTERIA SPECIES" impactAccent="danger" hitAt={1.2} boom={2} /> },
  { key: "d11", start: 364.0, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("fl_fly_coffee_rim")} imageDarken={0.62} title="On your coffee cup rim" chips={["E. coli", "Salmonella", "Listeria", "Typhoid"]} hue="red" /> },
  { key: "d12", start: 374.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_outhouse_old")} hue="amber" kicker="How disease moved from the outhouse to the kitchen" /> },
  { key: "d13", start: 384.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Plumbing helped. The flies just moved to your " }, { t: "garbage can", hl: true }]} /> },
  { key: "d14", start: 392.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_jar_sill_flies")} eyebrow="One pantry ingredient" words={parseQuote("The difference between a clean kitchen and a *sick household*")} accent="good" hue="amber" /> },

  // ════════════ LA BISABUELA · 1903 (6:42–7:11) ════════════
  { key: "g01", start: 402.9, el: (d) => <RawShot durationInFrames={d} src={T("fl_grandmother_portrait")} hue="amber" kicker="Not a quaint Amish hobby" /> },
  { key: "g02", start: 408.0, el: (d) => <CalloutMark durationInFrames={d} figure="1903" image={T("fl_sick_child_bed_old")} eyebrow="She lost her first child to a summer fever" caption="And set a trap every summer after" accent="amber" hue="amber" /> },
  { key: "g03", start: 418.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_six_children_sepia")} hue="amber" kicker="Six other children · never sick from a fly again" /> },
  { key: "g04", start: 424.0, el: (d) => <AgedDoc durationInFrames={d} eyebrow="A letter to her sister" heading="We still have it" lines={[{ text: "She wrote down what she did" }, { text: "What we know, we know by hand", mark: true }]} accent="amber" hue="amber" /> },

  // ════════════ INGREDIENTES (7:11–8:01) ════════════
  { key: "r3", start: 431.0, el: (d) => <RuleNumberScene durationInFrames={d} number="03" label="HERE IS WHAT YOU DO" title="Three things, all in your house" hue="amber" /> },
  { key: "b01", start: 435.0, el: (d) => <ProcessSteps durationInFrames={d} eyebrow="You already own all of it" title="The three things" orientation="horizontal" accent="good" hue="amber" steps={[{ title: "A glass jar", image: T("fl_mason_jar_clean") }, { title: "Brown paper", image: T("fl_brown_paper_piece") }, { title: "Molasses", image: T("fl_molasses_spoon") }]} /> },
  { key: "b02", start: 444.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_mason_jar_clean")} hue="amber" kicker="A pint mason jar is perfect" /> },
  { key: "b03", start: 448.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_pickle_jar")} hue="amber" kicker="An old pickle jar works just as well" /> },
  { key: "b04", start: 453.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_av_grocery_bag")} hue="amber" kicker="Plain brown paper · not printed" /> },
  { key: "b05", start: 459.0, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("fl_brown_paper_piece")} imageDarken={0.6} tokens={[{ t: "The " }, { t: "ink", danger: true }, { t: " confuses them" }]} /> },
  { key: "b06", start: 463.5, el: (d) => <SplitList durationInFrames={d} title="One tablespoon of molasses — not" items={["Honey", "Maple syrup", "White sugar water"]} accent={RD} cross /> },
  { key: "b07", start: 471.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_grocery_baking_aisle")} hue="amber" kicker="Baking aisle · about $4 a bottle" /> },
  { key: "b08", start: 476.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_molasses_bottle")} hue="amber" kicker="Lasts you all summer and into next year" /> },

  // ════════════ POR QUÉ MELAZA · la ciencia (8:01–9:51) ════════════
  { key: "r4", start: 481.0, el: (d) => <RuleNumberScene durationInFrames={d} number="04" label="WHY MOLASSES" title="A fly is not drawn to sweetness" hue="amber" /> },
  { key: "w01", start: 485.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_fly_proboscis_food")} eyebrow="She is drawn to" words={parseQuote("*Fermentation* — something already breaking down")} accent="amber" hue="amber" /> },
  { key: "w02", start: 495.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_molasses_spoon")} hue="amber" kicker="Molasses: the byproduct of sugar refining" /> },
  { key: "w03", start: 503.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_fermentation_bubbles")} hue="amber" kicker="Warm water · and it starts to ferment" /> },
  { key: "w04", start: 514.0, el: (d) => <DiagramBoard durationInFrames={d} pages={[{ image: T("dg_molasses_co2") }]} avatar="fly_opt.mp4" avatarFrom={sec(514.0)} /> },
  { key: "w05", start: 527.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_dog_porch_sleep")} hue="amber" kicker="She can't tell your sleeping dog from the jar" /> },
  { key: "w06", start: 537.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "She is going to fly " }, { t: "toward the jar", good: true }]} /> },
  { key: "w07", start: 543.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_sugar_water_clear")} hue="cold" kicker="Sugar water just sits there" /> },
  { key: "w08", start: 551.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_jar_sill_flies")} eyebrow="Sugar water won't call her" words={parseQuote("*Molasses* calls her")} accent="good" hue="amber" /> },
  { key: "w09", start: 558.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_cornell_paper_1994")} hue="cold" kicker="Cornell · entomologist Bridges · 1994" /> },
  { key: "w10", start: 567.0, el: (d) => <BarCompare durationInFrames={d} eyebrow="Attractive power, measured" title="Molasses vs. every commercial bait" orientation="horizontal" hue="amber" bars={[{ label: "Molasses", value: 90, display: "3× better", tone: "good", winner: true }, { label: "Commercial bait", value: 30, display: "1×", tone: "danger" }]} /> },
  { key: "w11", start: 578.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_commercial_bait_pack")} hue="red" kicker="12¢ a gram to make · sold for $90 a pound" /> },
  { key: "w12", start: 585.0, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("fl_molasses_bottle")} imageDarken={0.6} tokens={[{ t: "$4 a bottle, and it " }, { t: "works better", good: true }]} /> },

  // ════════════ ARMADO PASO A PASO (9:51–11:12) ════════════
  { key: "r5", start: 591.0, el: (d) => <RuleNumberScene durationInFrames={d} number="05" label="NOW BUILD IT" title="Five minutes, three dollars" hue="amber" /> },
  { key: "k01", start: 595.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_av_pour_molasses")} hue="amber" kicker="One tablespoon of molasses into the jar" /> },
  { key: "k02", start: 600.0, el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="The whole build" title="Jar to finished trap" worldImage={T("fl_walk_kitchen")} waypoints={[
    { x: 600, y: 840, z: 0.7, image: T("fl_pour_molasses_jar"), label: "1 · Molasses", num: "1", dwell: 3.2, travel: 2 },
    { x: 1680, y: 470, z: 0.45, image: T("fl_warm_water_kettle"), label: "2 · ½ cup warm water", num: "2", dwell: 3.2, travel: 2.2 },
    { x: 2760, y: 1040, z: 0.8, image: T("fl_stir_wooden_spoon"), label: "3 · Stir it dark", num: "3", dwell: 3.2, travel: 2.2 },
    { x: 3820, y: 520, z: 0.5, image: T("fl_dish_soap_drop"), label: "4 · One drop of soap", num: "4", dwell: 3.4, travel: 2.2 },
  ]} /> },
  { key: "k03", start: 627.0, el: (d) => <StatBig durationInFrames={d} value={1} prefix="" suffix=" drop" label="of dish soap — the size of a small pea" eyebrow="Not two, not a squirt" accent="amber" hue="amber" /> },
  { key: "k04", start: 636.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_dish_soap_drop")} eyebrow="It breaks the surface tension" words={parseQuote("She lands, she sinks, she *drowns* in three seconds")} accent="danger" hue="red" /> },
  { key: "k05", start: 648.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_fly_sinking_water")} hue="red" kicker="The water can no longer hold her up" /> },
  { key: "k06", start: 653.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_av_roll_cone")} hue="amber" kicker="Now roll the brown paper into a cone" /> },
  { key: "k07", start: 660.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_cone_tape")} hue="amber" kicker="Narrow end: the size of a pencil eraser" /> },
  { key: "k08", start: 666.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_cone_in_jar")} hue="amber" kicker="Narrow end down · one inch above the water" /> },

  // ════════════ RESULTADOS + EL CONO (11:12–12:37) ════════════
  { key: "c01", start: 672.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_av_set_jar_sill")} hue="amber" kicker="That is the whole trap" /> },
  { key: "c02", start: 678.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_jar_sill_morning")} hue="amber" kicker="Set it on the windowsill in the morning" /> },
  { key: "c03", start: 684.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_jar_evening_flies")} hue="amber" kicker="By evening · flies in the bottom" /> },
  { key: "c04", start: 690.0, el: (d) => <CalloutMark durationInFrames={d} figure="200 yrs" image={T("fl_cone_diagram_real")} eyebrow="The cone is the genius — and it's not mine" caption="At least two centuries old" accent="amber" hue="amber" /> },
  { key: "c05", start: 700.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_cone_in_jar")} hue="amber" kicker="She flies down · she smells the fermentation" /> },
  { key: "c06", start: 706.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_fly_sinking_water")} hue="red" kicker="She lands. She drowns." /> },
  { key: "c07", start: 712.0, el: (d) => <DiagramBoard durationInFrames={d} pages={[{ image: T("dg_cone_trap") }]} avatar="fly_opt.mp4" avatarFrom={sec(712.0)} /> },
  { key: "c08", start: 726.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_fly_bumping_glass")} hue="red" kicker="She looks up toward the light — never down" /> },
  { key: "c09", start: 733.0, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("fl_jar_flies_macro")} imageDarken={0.62} tokens={[{ t: "No swatter. No poison. " }, { t: "No sound", good: true }]} /> },
  { key: "c10", start: 740.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_empty_jar_rinse")} hue="cold" kicker="Empty it once a week · fresh batch" /> },
  { key: "c11", start: 748.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "The whole maintenance for the " }, { t: "entire season", hl: true }]} /> },

  // ════════════ UBICACIÓN (12:37–14:18) ════════════
  { key: "r6", start: 757.0, el: (d) => <RuleNumberScene durationInFrames={d} number="06" label="WHERE TO SET IT" title="One jar is good. Three is better." hue="amber" /> },
  { key: "u01", start: 761.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_three_jars_row")} hue="amber" kicker="Three jars, three places" /> },
  { key: "u02", start: 766.0, el: (d) => <DiagramBoard durationInFrames={d} pages={[{ image: T("dg_placement") }]} avatar="fly_opt.mp4" avatarFrom={sec(766.0)} /> },
  { key: "u03", start: 779.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_jar_high_windowsill")} hue="amber" kicker="Kitchen windowsill · not the table" /> },
  { key: "u04", start: 785.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_jar_pantry_shelf")} hue="amber" kicker="The pantry · above the trash can" /> },
  { key: "u05", start: 792.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_av_porch_jar")} hue="amber" kicker="And one outside · ten feet from the door" /> },
  { key: "u06", start: 803.7, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_back_door_flies")} eyebrow="The one most folks skip" words={parseQuote("Intercept them in the *yard* before they cross the threshold")} accent="good" hue="amber" /> },
  { key: "u07", start: 815.0, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("fl_jar_porch_outside")} imageDarken={0.6} tokens={[{ t: "Shut the door on the problem, not " }, { t: "fight it inside", danger: true }]} /> },
  { key: "u08", start: 826.0, el: (d) => <SplitList durationInFrames={d} title="Do not put the jar" items={["Next to where you eat", "On the prep counter"]} accent={RD} cross /> },
  { key: "u09", start: 832.6, el: (d) => <RawShot durationInFrames={d} src={T("fl_jar_evening_flies")} hue="amber" kicker="50 drowned flies is not appetizing to look at" /> },
  { key: "u10", start: 840.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_jar_on_fridge")} hue="amber" kicker="High windowsill · on top of the fridge" /> },
  { key: "u11", start: 848.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_jar_high_windowsill")} eyebrow="Same principle as the mosquito trap" words={parseQuote("Bait belongs *away* from camp")} accent="amber" hue="amber" /> },

  // ════════════ SOURCE REDUCTION · caminá la cocina (14:18–15:43) ════════════
  { key: "r7", start: 858.0, el: (d) => <RuleNumberScene durationInFrames={d} number="07" label="TONIGHT, ALSO" title="Find where the flies are breeding" hue="amber" /> },
  { key: "s01", start: 862.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_av_walk_trash")} hue="amber" kicker="She lays her eggs in something rotting" /> },
  { key: "s02", start: 869.0, el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="Walk your kitchen" title="Where the nursery hides" worldImage={T("fl_walk_kitchen")} waypoints={[
    { x: 600, y: 850, z: 0.7, image: T("fl_lift_trash_lid"), label: "Every trash lid", num: "1", dwell: 3, travel: 2 },
    { x: 1680, y: 480, z: 0.45, image: T("fl_torn_trashbag_sink"), label: "The bag under the sink", num: "2", dwell: 3, travel: 2.2 },
    { x: 2760, y: 1040, z: 0.8, image: T("fl_fruit_bowl_apple"), label: "The forgotten apple", num: "3", dwell: 3, travel: 2.2 },
    { x: 3820, y: 520, z: 0.5, image: T("fl_kitchen_drain"), label: "The kitchen drain", num: "4", dwell: 3.4, travel: 2.2 },
  ]} /> },
  { key: "s03", start: 896.0, el: (d) => <DiagramBoard durationInFrames={d} pages={[{ image: T("dg_source_reduction") }]} avatar="fly_opt.mp4" avatarFrom={sec(896.0)} /> },
  { key: "s04", start: 908.4, el: (d) => <ProcessSteps durationInFrames={d} eyebrow="Once a week · the clogged drain" title="Clean the nursery" orientation="horizontal" accent="good" hue="cold" steps={[{ title: "Boiling water", image: T("fl_boiling_water_drain") }, { title: "Soda + vinegar", image: T("fl_baking_soda_vinegar") }, { title: "Rinse hot", image: T("fl_kitchen_drain") }]} /> },
  { key: "s05", start: 920.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_boiling_water_drain")} hue="cold" kicker="Let it foam ten minutes · rinse hot" /> },
  { key: "s06", start: 927.4, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_kitchen_drain")} eyebrow="They call it source reduction now" words={parseQuote("My grandmother called it *keeping a clean house*")} accent="good" hue="amber" /> },
  { key: "s07", start: 938.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "The fly starts in something rotting. " }, { t: "End her there", good: true }]} /> },

  // ════════════ EL HUMO · the smudge (15:43–18:30) ════════════
  { key: "r8", start: 943.0, el: (d) => <RuleNumberScene durationInFrames={d} number="08" label="THE STUBBORN ONES" title="My grandmother lit the smudge" hue="amber" /> },
  { key: "m01", start: 947.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_fly_coffee_rim")} hue="amber" kicker="Adult flies that won't walk into the jar" /> },
  { key: "m02", start: 955.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_quiet_kitchen_friday")} eyebrow="The warm kitchen is more interesting" words={parseQuote("So we *push* them toward the trap or out the door")} accent="amber" hue="amber" /> },
  { key: "m03", start: 968.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_wood_stove_can")} hue="amber" kicker="A tin coffee can on the back of the wood stove" /> },
  { key: "m04", start: 976.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_coffee_can_holes")} hue="amber" kicker="The lid punched full of nail holes" /> },
  { key: "m05", start: 982.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_dried_herbs_rafters")} hue="amber" kicker="Dried herbs from the rafters" /> },
  { key: "m06", start: 988.0, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("fl_lavender_mint_dried")} imageDarken={0.55} title="Inside the can" chips={["Bay laurel", "Cloves", "Dried mint", "Crushed lavender"]} hue="amber" /> },
  { key: "m07", start: 996.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_av_light_smudge")} hue="amber" kicker="Lit with a match · smolders ten minutes" /> },
  { key: "m08", start: 1004.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_thin_smoke_kitchen")} hue="amber" kicker="The smoke is thin · you can barely see it" /> },
  { key: "m09", start: 1013.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_flies_to_window")} hue="cold" kicker="Every fly left within five minutes" /> },
  { key: "m10", start: 1019.9, el: (d) => <DiagramBoard durationInFrames={d} pages={[{ image: T("dg_smudge") }]} avatar="fly_opt.mp4" avatarFrom={sec(1019.9)} /> },
  { key: "m11", start: 1034.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "A portion went straight to the " }, { t: "molasses jar", good: true }]} /> },
  { key: "m12", start: 1040.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_thin_smoke_kitchen")} eyebrow="Smudge does not kill flies" words={parseQuote("It drives them from one place *into another*")} accent="amber" hue="amber" /> },
  { key: "m13", start: 1050.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_bay_cloves_dish")} hue="amber" kicker="A ceramic dish · a $2 charcoal disc" /> },
  { key: "m14", start: 1056.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_charcoal_disc")} hue="amber" kicker="A teaspoon of cloves and bay leaves" /> },
  { key: "m15", start: 1063.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_av_talk_cabin")} hue="amber" kicker="Light it Friday, before supper" /> },
  { key: "m16", start: 1070.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_dried_herbs_rafters")} eyebrow="Not folklore" words={parseQuote("*Eugenol* — documented repellents since the 1950s")} accent="good" hue="amber" /> },
  { key: "m17", start: 1082.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_beehives_row")} hue="cold" kicker="They do not harm honeybees in their hives" /> },
  { key: "m18", start: 1090.0, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("fl_thin_smoke_kitchen")} imageDarken={0.6} tokens={[{ t: "To a human, like Christmas. To a fly, " }, { t: "a warning", danger: true }]} /> },
  { key: "m19", start: 1097.0, el: (d) => <CalloutMark durationInFrames={d} figure="68 yrs" image={T("fl_grandmother_portrait")} eyebrow="She lit a smudge every Friday" caption="No fly ever spoiled a Sunday roast" accent="amber" hue="amber" /> },

  // ════════════ EL PANORAMA GRANDE (18:30–20:14) ════════════
  { key: "r9", start: 1110.0, el: (d) => <RuleNumberScene durationInFrames={d} number="09" label="SOMETHING LARGER" title="The housefly is not a small problem" hue="red" /> },
  { key: "v01", start: 1115.0, el: (d) => <StatBig durationInFrames={d} value={65} prefix="" suffix="+ diseases" label="the WHO counts the housefly as a vector for" eyebrow="A mechanical vector" accent="danger" hue="red" /> },
  { key: "v02", start: 1126.9, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_outhouse_old")} eyebrow="Rural US, before plumbing" words={parseQuote("The leading cause of death for children was carried by *flies*")} accent="danger" hue="red" /> },
  { key: "v03", start: 1140.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_county_records_book")} hue="amber" kicker="A death rate in the records before 1925" /> },
  { key: "v04", start: 1151.0, el: (d) => <ProcessSteps durationInFrames={d} eyebrow="What actually stopped it" title="Not pesticide" orientation="horizontal" accent="good" hue="amber" steps={[{ title: "Plumbing", image: T("fl_kitchen_drain") }, { title: "Screens", image: T("fl_farmhouse_screens_old") }, { title: "The jar trap", image: T("fl_jar_sill_morning") }]} /> },
  { key: "v05", start: 1165.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "In the last 60 years, we " }, { t: "stopped setting the trap", danger: true }]} /> },
  { key: "v06", start: 1172.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_aerosol_1968_ad")} hue="red" kicker="The aerosol can replaced the jar · 1968" /> },
  { key: "v07", start: 1182.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_spray_can_counter")} eyebrow="The spray kills the fly in the room" words={parseQuote("It does not stop the next *500* in the garbage")} accent="danger" hue="red" /> },
  { key: "v08", start: 1196.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_dead_bee_spray")} hue="red" kicker="It also kills the honeybees on your clover" /> },
  { key: "v09", start: 1203.0, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("fl_songbird_yard")} imageDarken={0.6} title="In small, accumulating doses" chips={["The bees", "The songbirds", "Your own gut"]} hue="red" /> },

  // ════════════ EL TRATO · el sistema (20:14–21:51) ════════════
  { key: "r10", start: 1214.0, el: (d) => <RuleNumberScene durationInFrames={d} number="10" label="THE BARGAIN" title="Most folks don't know they made it" hue="amber" /> },
  { key: "t01", start: 1219.0, el: (d) => <DiagramBoard durationInFrames={d} pages={[{ image: T("dg_bargain") }]} avatar="fly_opt.mp4" avatarFrom={sec(1219.0)} /> },
  { key: "t02", start: 1232.0, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("fl_jar_sill_flies")} imageDarken={0.6} tokens={[{ t: "The molasses trap only kills " }, { t: "flies", good: true }]} /> },
  { key: "t03", start: 1239.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_system_flatlay")} hue="amber" kicker="Jar, paper, molasses, smudge, clean drain" /> },
  { key: "t04", start: 1247.0, el: (d) => <ImpactReveal durationInFrames={d} image={T("fl_system_flatlay")} setup="The whole system, the first time" impact="UNDER $5" impactAccent="good" hitAt={1.0} boom={1} /> },
  { key: "t05", start: 1255.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_hands_work_wood")} hue="amber" kicker="This is what we have always done" /> },
  { key: "t06", start: 1262.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_house_1903")} eyebrow="Not because we were clever" words={parseQuote("Because we had *no choice*")} accent="amber" hue="amber" /> },
  { key: "t07", start: 1272.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_old_window_noscreen")} hue="amber" kicker="A window built before screens existed" /> },
  { key: "t08", start: 1280.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Flies are not a fly problem. They're a " }, { t: "smell problem", good: true }]} /> },
  { key: "t09", start: 1290.5, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_jar_sill_morning")} eyebrow="Replace the smell with something stronger" words={parseQuote("They go where you want them — and they *die*")} accent="good" hue="amber" /> },
  { key: "t10", start: 1300.6, el: (d) => <ImpactReveal durationInFrames={d} image={T("fl_molasses_spoon")} setup="One jar, one spoon of something dark" impact="THE WHOLE SECRET" impactAccent="amber" hitAt={1.0} boom={2} /> },

  // ════════════ HACELO ESTA NOCHE (21:51–23:01) ════════════
  { key: "r11", start: 1311.0, el: (d) => <RuleNumberScene durationInFrames={d} number="11" label="TONIGHT" title="Here is what I want you to do" hue="blue" /> },
  { key: "y01", start: 1315.0, el: (d) => <Checklist durationInFrames={d} eyebrow="Less than 10 minutes · less than $3" title="Do this tonight" items={[{ text: "Jar + paper cone", state: "done" }, { text: "Molasses + warm water + 1 drop soap", state: "done" }, { text: "Set it on the windowsill", state: "done" }, { text: "Walk the kitchen, clean the drain", state: "doing" }]} accent="good" /> },
  { key: "y02", start: 1327.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_av_set_jar_sill")} hue="amber" kicker="Set it on your windowsill" /> },
  { key: "y03", start: 1335.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_boiling_water_drain")} hue="cold" kicker="Boiling water and vinegar down the drain" /> },
  { key: "y04", start: 1339.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_jar_tonight_sill")} hue="amber" kicker="By tomorrow morning · flies in the jar" /> },
  { key: "y05", start: 1344.5, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("fl_quiet_kitchen_friday")} imageDarken={0.6} tokens={[{ t: "By next Friday, your kitchen will be " }, { t: "quiet", good: true }]} /> },
  { key: "y06", start: 1349.7, el: (d) => <RawShot durationInFrames={d} src={T("fl_comments_map_usa")} hue="cold" kicker="Tell me where you live in the comments" /> },
  { key: "y07", start: 1360.0, el: (d) => <ImpactReveal durationInFrames={d} image={T("fl_jar_flies_macro")} setup="Come back and tell me" impact="CAN YOU BEAT 47?" impactAccent="good" hitAt={1.0} boom={0} /> },
  { key: "y08", start: 1370.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_av_talk_cabin")} eyebrow="For the folks who were never told" words={parseQuote("What we know, we know *by hand*")} accent="amber" hue="amber" /> },

  // ════════════ WASP TEASER + OUTRO (23:01–24:06) ════════════
  { key: "z01", start: 1381.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Next week: the same idea, " }, { t: "scaled up", hl: true }]} /> },
  { key: "z02", start: 1390.0, el: (d) => <RawShot durationInFrames={d} src={V("fl_wasp_macro")} hue="red" kicker="A wasp stings 40 times a minute — and survives" /> },
  { key: "z03", start: 1397.9, el: (d) => <RawShot durationInFrames={d} src={T("fl_wasp_nest_eaves")} hue="red" kicker="A nest of 2,000 on your property right now" /> },
  { key: "z04", start: 1406.0, el: (d) => <RawShot durationInFrames={d} src={T("fl_big_jar_wasp_trap")} hue="amber" kicker="A jar twice this size · one ingredient" /> },
  { key: "z05", start: 1413.0, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_big_jar_wasp_trap")} eyebrow="Empties a nest of half a mile in two days" words={parseQuote("And does not kill a single *honeybee*")} accent="good" hue="amber" /> },
  { key: "z06", start: 1425.3, el: (d) => <TextCardReveal durationInFrames={d} eyebrow="Goes up next Tuesday" lines={["The $4 Amish Jar", "That Traps Every Wasp for Half a Mile"]} accent={GD} /> },
  { key: "z07", start: 1435.2, el: (d) => <KineticQuote durationInFrames={d} image={T("fl_porch_dusk_outro")} eyebrow="Set the jar, keep the door shut" words={parseQuote("They knew things we are only just starting to *remember*")} accent="amber" hue="amber" /> },
];

// dur de cada cue = inicio del siguiente − el suyo (último hasta el final)
const CUES = C.map((c, i) => ({ ...c, dur: (i < C.length - 1 ? C[i + 1].start : TOTAL) - c.start }));

const SECTION_KEYS = new Set(["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10", "r11"]);

// ── Cronograma del AVATAR (presente ~55%: cornerTR sobre b-roll, full en beats
// personales, hidden en hook/diagramas/journeys/pods densos) ──
const AVATAR_WINDOWS: AvatarWindow[] = [
  { start: 0, mode: "hidden" },        // HOOK: title-card + ImpactReveal mandan
  { start: 44.9, mode: "full" },       // "My name is Claudio. I am Amish."
  { start: 56.0, mode: "cornerTR" },   // a partir de acá presente casi siempre
  { start: 90.0, mode: "right" },      // promesa: avatar derecha, checklist izquierda
  { start: 99.2, mode: "cornerTR" },
  { start: 128.0, mode: "hidden" },    // RuleNumber 01
  { start: 132.5, mode: "cornerTR" },
  { start: 158.0, mode: "hidden" },    // StatBig 500 + diagrama exponencial
  { start: 186.5, mode: "cornerTR" },
  { start: 207.0, mode: "full" },      // "what my grandmother did"
  { start: 213.0, mode: "cornerTR" },
  { start: 271.5, mode: "hidden" },    // RuleNumber 02
  { start: 276.0, mode: "cornerTR" },
  { start: 321.0, mode: "hidden" },    // diagrama contaminación
  { start: 334.0, mode: "cornerTR" },
  { start: 357.2, mode: "hidden" },    // ImpactReveal 351 bacteria
  { start: 364.0, mode: "cornerTR" },
  { start: 402.9, mode: "full" },      // bisabuela (beat emotivo)
  { start: 418.0, mode: "cornerTR" },
  { start: 431.0, mode: "hidden" },    // RuleNumber 03 + ProcessSteps
  { start: 444.0, mode: "cornerTR" },
  { start: 481.0, mode: "hidden" },    // RuleNumber 04
  { start: 485.0, mode: "cornerTR" },
  { start: 514.0, mode: "hidden" },    // diagrama molasses/CO2
  { start: 527.0, mode: "cornerTR" },
  { start: 567.0, mode: "right" },     // BarCompare molasses vs bait
  { start: 578.0, mode: "cornerTR" },
  { start: 591.0, mode: "hidden" },    // RuleNumber 05
  { start: 595.0, mode: "cornerTR" },
  { start: 600.0, mode: "hidden" },    // JourneyCanvas build
  { start: 627.0, mode: "cornerTR" },
  { start: 712.0, mode: "hidden" },    // diagrama cono
  { start: 726.0, mode: "cornerTR" },
  { start: 757.0, mode: "hidden" },    // RuleNumber 06
  { start: 761.0, mode: "cornerTR" },
  { start: 766.0, mode: "hidden" },    // diagrama placement
  { start: 779.0, mode: "cornerTR" },
  { start: 858.0, mode: "hidden" },    // RuleNumber 07
  { start: 862.0, mode: "cornerTR" },
  { start: 869.0, mode: "hidden" },    // JourneyCanvas walk + diagrama source
  { start: 908.4, mode: "cornerTR" },
  { start: 943.0, mode: "hidden" },    // RuleNumber 08
  { start: 947.0, mode: "cornerTR" },
  { start: 1019.9, mode: "hidden" },   // diagrama smudge
  { start: 1034.0, mode: "cornerTR" },
  { start: 1063.0, mode: "full" },     // "light it Friday" (personal)
  { start: 1070.0, mode: "cornerTR" },
  { start: 1110.0, mode: "hidden" },   // RuleNumber 09 + StatBig 65
  { start: 1126.9, mode: "cornerTR" },
  { start: 1214.0, mode: "hidden" },   // RuleNumber 10 + diagrama bargain
  { start: 1232.0, mode: "cornerTR" },
  { start: 1300.6, mode: "hidden" },   // ImpactReveal "the whole secret"
  { start: 1311.0, mode: "hidden" },   // RuleNumber 11
  { start: 1315.0, mode: "left" },     // CTA checklist (avatar izquierda)
  { start: 1327.0, mode: "cornerTR" },
  { start: 1360.0, mode: "hidden" },   // ImpactReveal "beat 47?"
  { start: 1370.0, mode: "full" },     // "what we know, by hand"
  { start: 1381.0, mode: "cornerTR" }, // wasp teaser (PiP sobre b-roll)
  { start: 1435.2, mode: "full" },     // cierre emotivo en el porche
  { start: TOTAL, mode: "hidden" },
];

// camas ambientales loopables (vol bajo) por mood de sección
// camas MUY suaves (corrección del usuario: quedaban fuertísimas). Bed de fondo
// apenas audible bajo la narración.
const AMBIENT: { from: number; to: number; src: string; vol: number }[] = [
  { from: 0, to: 128, src: "sfx/amb_campo.mp3", vol: 0.04 },     // granja/cocina hook+identidad
  { from: 128, to: 402, src: "sfx/amb_taller.mp3", vol: 0.04 },  // la mosca / peligro (interior)
  { from: 402, to: 591, src: "sfx/amb_campo.mp3", vol: 0.04 },   // bisabuela + ingredientes + ciencia
  { from: 591, to: 858, src: "sfx/amb_taller.mp3", vol: 0.04 },  // armado + cono + ubicación
  { from: 858, to: 1110, src: "sfx/amb_fuego.mp3", vol: 0.035 }, // drenaje + el humo (fuego/brasas)
  { from: 1110, to: 1311, src: "sfx/amb_taller.mp3", vol: 0.04 },// panorama + el trato
  { from: 1311, to: TOTAL, src: "sfx/amb_campo.mp3", vol: 0.04 },// CTA + wasp + cierre
];

export const MainFly: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {/* camas ambientales (audio, fuera del grado) */}
      {AMBIENT.map((a, i) => (
        <Sequence key={"amb" + i} from={sec(a.from)} durationInFrames={sec(a.to - a.from)} layout="none">
          <Audio src={staticFile(a.src)} volume={a.vol} loop />
        </Sequence>
      ))}
      <CinematicWrap handheld={0.8} grain={0.06}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={44} hue="amber" drift={0.5} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          {/* AVATAR encima del b-roll (provee el audio de la narración siempre) */}
          <AvatarLayer src="fly_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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

// color-grade por mood de sección (wash suave)
const GRADE: GradeRange[] = [
  { from: 0, to: 128, tint: "#C8904A", strength: 0.05 },     // hook/identidad: ámbar cálido
  { from: 128, to: 271, tint: "#B0503C", strength: 0.06 },   // la mosca/matemática: terracota
  { from: 271, to: 402, tint: "#9A5238", strength: 0.07 },   // mosca sucia/peligro: terracota oscuro
  { from: 402, to: 591, tint: "#A9794A", strength: 0.05 },   // bisabuela/ingredientes/ciencia: sepia
  { from: 591, to: 757, tint: "#B0833F", strength: 0.05 },   // armado/cono: tierra
  { from: 757, to: 943, tint: "#7C8A5A", strength: 0.05 },   // ubicación/cocina: salvia
  { from: 943, to: 1110, tint: "#C8904A", strength: 0.06 },  // el humo: cálido brasa
  { from: 1110, to: 1214, tint: "#6F8478", strength: 0.08 }, // panorama: eucalipto frío
  { from: 1214, to: 1311, tint: "#A9794A", strength: 0.05 }, // el trato: sepia
  { from: 1311, to: TOTAL, tint: "#7C8A5A", strength: 0.05 },// CTA/cierre: salvia/verde
];
