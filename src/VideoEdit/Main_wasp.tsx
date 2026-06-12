import { AbsoluteFill, Sequence } from "remotion";
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
import { SfxCue, SFX } from "./components/Sfx";
import { CinematicWrap } from "./components/CinematicWrap";
import { SectionGrade, SectionStinger, GradeRange } from "./components/SectionFx";

// ── "KILL EVERY Wasp On Your Property — The Amish Way" (Claudio, Amish) ────────
// Documental EN INGLÉS con presentador. Narración + avatar (public/wasp_opt.mp4)
// + flujo denso de fotos/clips reales + diagramas gpt-image-2 + texto cinético.
// Paleta terrosa/vintage. La narración real termina ~1224s (lo posterior es audio
// corrupto de otro video). Diagramas con clip= (avatar_clips/<id>.mp4, farm-safe).
const T = (img: string) => `img/${img}.png`;
const V = (clip: string) => `vid/${clip}.mp4`;
const B = (clip: string) => `broll/${clip}.mp4`; // clips REALES de YouTube (matchclip)
const DG = (id: string) => `avatar_clips/${id}.mp4`;

const TOTAL = 1224;
export const TOTAL_FRAMES_WASP = Math.round(TOTAL * 30);

const RD = COLORS.danger;
const GD = COLORS.good;

type Cue = { key: string; start: number; el: (d: number) => React.ReactNode };

const C: Cue[] = [
  // ════════════ HOOK · Aaron (0:00–0:52) ════════════
  { key: "h01", start: 5.0, el: (d) => <RawShot durationInFrames={d} src={V("wp_boy_barefoot_pasture")} hue="amber" kicker="Chasing the dog through the back pasture" /> },
  { key: "h02", start: 8.7, el: (d) => <RawShot durationInFrames={d} src={T("wp_log_hollow_nest")} hue="red" kicker="A nest he could not see — under a fallen log" /> },
  { key: "h03", start: 12.5, el: (d) => <RawShot durationInFrames={d} src={B("rb_yellowjacket_macro")} hue="red" kicker="Yellow jackets" /> },
  { key: "h04", start: 15.2, el: (d) => <RawShot durationInFrames={d} src={T("wp_ankle_sting_red")} hue="red" kicker="The first sting — on his ankle" /> },
  { key: "h05", start: 17.9, el: (d) => <ImpactReveal durationInFrames={d} image={T("wp_porch_farmhouse")} setup="By the time he reached the porch" impact="41 STINGS" impactAccent="danger" hitAt={1.1} boom={2} /> },
  { key: "h06", start: 23.0, el: (d) => <RawShot durationInFrames={d} src={T("wp_baking_soda_paste")} hue="amber" kicker="Baking soda paste on each one" /> },
  { key: "h07", start: 27.4, el: (d) => <RawShot durationInFrames={d} src={T("wp_boy_sleeping_quilt")} hue="amber" kicker="He was lucky — not allergic" /> },
  { key: "h08", start: 32.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "In the morning he was " }, { t: "a boy again", good: true }]} /> },
  { key: "h09", start: 36.2, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_epipen_table")} eyebrow="If he had been allergic" words={parseQuote("he would have been *dead* before we reached him")} accent="danger" hue="red" /> },
  { key: "h10", start: 40.9, el: (d) => <StatBig durationInFrames={d} value={60} suffix=" deaths a year" label="from wasp and hornet stings, in this country" eyebrow="About" accent="danger" hue="red" /> },
  { key: "h11", start: 46.8, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_er_sign")} eyebrow="Most of them children" words={parseQuote("they never knew they were *allergic* until the day it killed them")} accent="danger" hue="red" /> },

  // ════════════ THE JAR REVEAL (0:52–1:39) ════════════
  { key: "j01", start: 52.8, el: (d) => <RawShot durationInFrames={d} src={B("rb_jar_trap_wasps")} hue="amber" kicker="My grandfather's half-gallon jar · same week" /> },
  { key: "j02", start: 60.0, el: (d) => <ImpactReveal durationInFrames={d} image={T("wp_jar_yellowjackets_macro")} setup="It had caught" impact="400–500 YELLOW JACKETS" impactAccent="good" hitAt={1.1} boom={1} /> },
  { key: "j03", start: 66.3, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "I emptied it " }, { t: "twice that month", hl: true }]} /> },
  { key: "j04", start: 68.6, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_honeybee_on_flower2")} eyebrow="In that jar" words={parseQuote("*No honeybees.* Not one.")} accent="good" hue="amber" /> },
  { key: "j05", start: 72.4, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("wp_butterfly_garden")} imageDarken={0.5} title="Never in the jar" chips={["butterflies", "moths", "dragonflies", "honeybees"]} hue="amber" /> },
  { key: "j06", start: 78.0, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("wp_paper_wasp_eaves")} imageDarken={0.55} title="Only these" chips={["yellow jackets", "hornets", "paper wasps"]} hue="red" /> },
  { key: "j07", start: 85.4, el: (d) => <ImpactReveal durationInFrames={d} image={T("wp_four_dollars_wood")} setup="The whole thing costs" impact="FOUR DOLLARS" impactAccent="good" hitAt={1.0} boom={1} /> },
  { key: "j08", start: 91.0, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_jar_fencepost_field")} eyebrow="One secret nobody talks about" words={parseQuote("why bees never go near it — and every *wasp* will")} accent="good" hue="amber" /> },

  // ════════════ QUIÉN ES CLAUDIO (1:39–2:11) ════════════
  { key: "i01", start: 104.0, el: (d) => <RawShot durationInFrames={d} src={B("rb_beehive_boxes")} hue="amber" kicker="Nine hives of honeybees" /> },
  { key: "i02", start: 108.0, el: (d) => <RawShot durationInFrames={d} src={T("wp_pie_stand")} hue="amber" kicker="My wife's roadside pie stand" /> },
  { key: "i03", start: 110.3, el: (d) => <RawShot durationInFrames={d} src={B("rb_jar_trap_build")} hue="amber" kicker="Last video: the same idea, for flies" /> },
  { key: "i04", start: 115.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Same idea. " }, { t: "Different prey", hl: true }]} /> },
  { key: "i05", start: 120.3, el: (d) => <CalloutMark durationInFrames={d} figure="20 yrs" image={T("wp_av_build_trap")} eyebrow="The wasp trap I built first" caption="After my own son was stung at five" accent="amber" hue="amber" /> },
  { key: "i06", start: 127.0, el: (d) => <RawShot durationInFrames={d} src={T("wp_son_pasture_old")} hue="amber" kicker="The same pasture · he was five" /> },

  // ════════════ PROMESA + tease (2:11–2:58) ════════════
  { key: "p01", start: 131.7, el: (d) => <Checklist durationInFrames={d} eyebrow="In this video" title="I will show you" items={[{ text: "How to build the trap", state: "doing" }, { text: "Where to set it on your property", state: "doing" }, { text: "Spring vs. late-summer bait", state: "doing" }]} accent="good" /> },
  { key: "p02", start: 140.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "The bait " }, { t: "changes with the season", hl: true }]} /> },
  { key: "p03", start: 145.1, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_pest_truck_spray")} eyebrow="The part that should make you angry" words={parseQuote("they kill every *honeybee* on the block")} accent="danger" hue="red" /> },
  { key: "p04", start: 153.0, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_nest_over_porch")} eyebrow="While the wasps that sting your children" words={parseQuote("keep nesting under your *eaves* — untouched")} accent="danger" hue="red" /> },
  { key: "p05", start: 161.8, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Stay with me", good: true }]} /> },
  { key: "p06", start: 163.1, el: (d) => <BarCompare durationInFrames={d} eyebrow="By the end of this" title="The honest cost" orientation="horizontal" hue="amber" bars={[{ label: "The $4 jar", value: 4, display: "$4", tone: "good", winner: true, sub: "clears your property" }, { label: "One ER visit", value: 60, display: "$3,000+", tone: "danger", sub: "if you're unlucky" }]} /> },
  { key: "p07", start: 171.0, el: (d) => <RawShot durationInFrames={d} src={T("wp_tomatoes_garden")} hue="cold" kicker="The bees keep working — never knowing it's there" /> },

  // ════════════ RULE 01 · WASP ≠ BEE (2:58–4:37) ════════════
  { key: "r1", start: 178.9, el: (d) => <RuleNumberScene durationInFrames={d} number="01" label="WHAT ALMOST EVERYBODY GETS WRONG" title="A wasp is not a bee" hue="red" /> },
  { key: "a01", start: 184.9, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Sounds obvious. " }, { t: "I'll say it anyway", hl: true }]} /> },
  { key: "a02", start: 189.0, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_chemical_spray_shelf")} eyebrow="Folks treat wasps like bees" words={parseQuote("and they kill the *wrong thing*")} accent="danger" hue="red" /> },
  { key: "a03", start: 197.1, el: (d) => <RawShot durationInFrames={d} src={B("rb_bee_pollen")} hue="cold" kicker="A honeybee is a vegetarian" /> },
  { key: "a04", start: 200.0, el: (d) => <RawShot durationInFrames={d} src={B("rb_honeybee_flower")} hue="cold" kicker="Nectar and pollen — that's all she eats" /> },
  { key: "a05", start: 205.0, el: (d) => <RawShot durationInFrames={d} src={B("rb_honeybee_clover")} hue="cold" kicker="All her young eat, too" /> },
  { key: "a06", start: 209.8, el: (d) => <DiagramBoard durationInFrames={d} clip={DG("dgbeevswasp")} pages={[{ image: T("dg_wasp_bee_vs_wasp") }]} /> },
  { key: "a07", start: 222.0, el: (d) => <RawShot durationInFrames={d} src={T("wp_bee_sting_barbed")} hue="red" kicker="Her stinger is barbed — it tears out" /> },
  { key: "a08", start: 229.2, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "She does not want to sting you. " }, { t: "She wants a flower", good: true }]} /> },
  { key: "a09", start: 233.7, el: (d) => <ImpactReveal durationInFrames={d} image={T("wp_yellowjacket_macro")} setup="A wasp is a" impact="PREDATOR" impactAccent="danger" hitAt={1.0} boom={2} /> },
  { key: "a10", start: 240.3, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("wp_wasp_larvae_nest")} imageDarken={0.55} tokens={[{ t: "They are " }, { t: "carnivores", danger: true }]} /> },
  { key: "a11", start: 242.3, el: (d) => <RawShot durationInFrames={d} src={B("rb_wasp_larvae")} hue="red" kicker="The larvae eat meat" /> },
  { key: "a12", start: 245.3, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("wp_queen_laying_nest")} imageDarken={0.55} title="The adults bring home" chips={["flies", "caterpillars", "spiders"]} hue="red" /> },
  { key: "a13", start: 252.8, el: (d) => <RawShot durationInFrames={d} src={B("rb_wasp_on_food")} hue="red" kicker="On your hamburger — hunting meat for the nest" /> },
  { key: "a14", start: 260.4, el: (d) => <StatBig durationInFrames={d} value={30} suffix=" stings" label="a smooth stinger — she can use it 20 to 30 times without dying" eyebrow="For almost no reason" accent="danger" hue="red" /> },
  { key: "a15", start: 268.0, el: (d) => <RawShot durationInFrames={d} src={T("wp_wasp_stinger_smooth")} hue="red" kicker="Smooth — it never tears out" /> },
  { key: "a16", start: 271.8, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "She does not lose her life. " }, { t: "She just gets angrier", danger: true }]} /> },

  // ════════════ THE SECRET (4:37–5:10) ════════════
  { key: "s01", start: 277.4, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "This difference is " }, { t: "what makes the trap work", good: true }]} /> },
  { key: "s02", start: 282.1, el: (d) => <RawShot durationInFrames={d} src={T("wp_meat_in_jar")} hue="amber" kicker="You put meat in a jar of water" /> },
  { key: "s03", start: 286.8, el: (d) => <RawShot durationInFrames={d} src={V("wp_bee_flying_past_jar")} hue="cold" kicker="The honeybee flies right past — no interest" /> },
  { key: "s04", start: 293.3, el: (d) => <ImpactReveal durationInFrames={d} image={T("wp_wasp_flying_to_jar")} setup="The wasp smells it from" impact="300 YARDS AWAY" impactAccent="danger" hitAt={1.1} boom={1} /> },
  { key: "s05", start: 298.9, el: (d) => <DiagramBoard durationInFrames={d} clip={DG("dgsecret")} pages={[{ image: T("dg_wasp_secret_meat") }]} /> },
  { key: "s06", start: 308.0, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_spray_can_warning")} eyebrow="The Chemical Company has known for 40 years" words={parseQuote("if they told you, you would not *buy the spray*")} accent="danger" hue="red" /> },

  // ════════════ RULE 02 · WASPS KILL BEES (5:10–6:00) ════════════
  { key: "r2", start: 310.6, el: (d) => <RuleNumberScene durationInFrames={d} number="02" label="WHAT I LEARNED THE HARD WAY" title="A wasp does not just sting your child" hue="red" /> },
  { key: "b01", start: 318.9, el: (d) => <RawShot durationInFrames={d} src={B("rb_wasp_raid_hive")} hue="red" kicker="She raids your hive in late August" /> },
  { key: "b02", start: 325.0, el: (d) => <RawShot durationInFrames={d} src={B("rb_dead_bees")} hue="red" kicker="Steals honey · kills bees on her way out" /> },
  { key: "b03", start: 328.5, el: (d) => <StatBig durationInFrames={d} value={30} suffix=" honeybees" label="killed by a single yellow jacket in one raid" eyebrow="One wasp" accent="danger" hue="red" /> },
  { key: "b04", start: 333.8, el: (d) => <ImpactReveal durationInFrames={d} image={T("wp_weak_hive_frame")} setup="A small group wipes out a weak hive in" impact="THREE DAYS" impactAccent="danger" hitAt={1.0} boom={2} /> },
  { key: "b05", start: 339.2, el: (d) => <DiagramBoard durationInFrames={d} clip={DG("dgkills")} pages={[{ image: T("dg_wasp_kills_bees") }]} /> },
  { key: "b06", start: 347.0, el: (d) => <AgedDoc durationInFrames={d} eyebrow="Every Amish beekeeper I know" heading="We did not invent the trap" lines={[{ text: "We inherited it", mark: true }, { text: "Wasp traps since before I was born" }]} accent="amber" hue="amber" /> },
  { key: "b07", start: 356.0, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_old_jar_trap_inherited")} eyebrow="Generations ago we figured out" words={parseQuote("bait it right, and the wasps come to *you* — not the bees")} accent="good" hue="amber" /> },

  // ════════════ RULE 03 · THE SPRAY TRUTH (6:00–6:45) ════════════
  { key: "c01", start: 360.9, el: (d) => <SplitList durationInFrames={d} title="The trap protects, at once" items={["Your children", "Your hives"]} accent={GD} /> },
  { key: "c02", start: 366.9, el: (d) => <RawShot durationInFrames={d} src={B("rb_pest_spray_lawn")} hue="red" kicker="The pest truck does the opposite of both" /> },
  { key: "c03", start: 372.7, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("wp_woodpile_wasps")} imageDarken={0.55} title="The spray never reaches" chips={["under the eaves", "the woodpile", "the hollow log"]} hue="red" /> },
  { key: "c04", start: 380.0, el: (d) => <RawShot durationInFrames={d} src={T("wp_lawn_spray_lush")} hue="red" kicker="It kills the bees · leaves the wasps alone" /> },
  { key: "c05", start: 386.5, el: (d) => <RawShot durationInFrames={d} src={T("wp_bees_on_clover_spray")} hue="red" kicker="The bees walk the sprayed clover" /> },
  { key: "c06", start: 391.0, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_hive_collapse_october")} eyebrow="They carry the poison home" words={parseQuote("the hive *collapses* before October")} accent="danger" hue="red" /> },
  { key: "c07", start: 397.1, el: (d) => <DiagramBoard durationInFrames={d} clip={DG("dgspray")} pages={[{ image: T("dg_wasp_spray_truth") }]} /> },

  // ════════════ RULE 04 · FOUR THINGS + EL CONO (6:45–7:22) ════════════
  { key: "r3", start: 405.0, el: (d) => <RuleNumberScene durationInFrames={d} number="03" label="HERE IS WHAT YOU DO" title="You need four things" hue="amber" /> },
  { key: "d01", start: 408.8, el: (d) => <ProcessSteps durationInFrames={d} eyebrow="All four are in your house" title="The four things" orientation="horizontal" accent="good" hue="amber" steps={[{ title: "A half-gallon jar", image: T("wp_halfgallon_jar") }, { title: "Brown paper cone", image: T("wp_brown_paper_cone_nickel") }, { title: "Water + dish soap", image: T("wp_dish_soap_water_cup") }, { title: "The bait", image: T("wp_chicken_liver_thumb") }]} /> },
  { key: "d02", start: 419.3, el: (d) => <RawShot durationInFrames={d} src={T("wp_pickle_jar_restaurant")} hue="amber" kicker="A restaurant pickle jar · they toss them by the dozen" /> },
  { key: "d03", start: 424.0, el: (d) => <RawShot durationInFrames={d} src={T("wp_brown_paper_cone_nickel")} hue="amber" kicker="Cone the size of a nickel — a wasp is bigger" /> },
  { key: "d04", start: 430.0, el: (d) => <DiagramBoard durationInFrames={d} clip={DG("dgcone")} pages={[{ image: T("dg_wasp_cone_trap") }]} /> },
  { key: "d05", start: 439.9, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "And the bait — " }, { t: "this is the part that changes", hl: true }]} /> },

  // ════════════ RULE 05 · SPRING = MEAT (7:22–8:43) ════════════
  { key: "r4", start: 442.1, el: (d) => <RuleNumberScene durationInFrames={d} number="04" label="EARLY MAY – MID JULY" title="Spring: bait with meat" hue="amber" /> },
  { key: "e01", start: 447.0, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("wp_chicken_liver_thumb")} imageDarken={0.5} title="Spring bait = meat" chips={["chicken liver", "fatty bacon", "ground beef", "a fish head"]} hue="red" /> },
  { key: "e02", start: 456.0, el: (d) => <RawShot durationInFrames={d} src={B("rb_raw_liver")} hue="amber" kicker="The size of your thumb" /> },
  { key: "e03", start: 460.0, el: (d) => <RawShot durationInFrames={d} src={T("wp_av_drop_liver_jar")} hue="amber" kicker="Drop it into the jar" /> },
  { key: "e04", start: 465.5, el: (d) => <RawShot durationInFrames={d} src={V("wp_meat_floating_jar")} hue="amber" kicker="Floats a few hours · then sinks" /> },
  { key: "e05", start: 472.3, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("wp_meat_in_jar")} imageDarken={0.55} tokens={[{ t: "Either way — " }, { t: "it will smell", hl: true }]} /> },
  { key: "e06", start: 475.2, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_picnic_table_summer")} eyebrow="Most folks would never guess" words={parseQuote("*meat* in a jar")} accent="amber" hue="amber" /> },
  { key: "e07", start: 480.3, el: (d) => <SplitList durationInFrames={d} title="People expect sweet bait" items={["soda", "jam", "beer"]} accent={RD} cross /> },
  { key: "e08", start: 487.5, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "In spring, sweet bait " }, { t: "does not work", danger: true }]} /> },
  { key: "e09", start: 491.5, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_queen_wasp_macro")} eyebrow="The queens feed babies" words={parseQuote("and babies want *protein*")} accent="good" hue="amber" /> },
  { key: "e10", start: 497.8, el: (d) => <StatBig durationInFrames={d} value={1000} suffix=" yards" label="a piece of raw liver draws every founding queen within" eyebrow="In the spring" accent="amber" hue="amber" /> },
  { key: "e11", start: 502.8, el: (d) => <ImpactReveal durationInFrames={d} image={T("wp_swarm_defensive")} setup="Catch one queen in May —" impact="STOP 2,000 WASPS" impactAccent="good" hitAt={1.1} boom={2} /> },
  { key: "e12", start: 508.7, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Each queen you catch is " }, { t: "one nest that never gets built", good: true }]} /> },
  { key: "e13", start: 515.6, el: (d) => <CalloutMark durationInFrames={d} figure="MAY" image={T("wp_av_hang_jar_post")} eyebrow="The most powerful month to run the trap" caption="May and June — catch the queens" accent="amber" hue="amber" /> },

  // ════════════ RULE 05 · LATE SUMMER = SWEET (8:43–9:38) ════════════
  { key: "r5", start: 523.4, el: (d) => <RuleNumberScene durationInFrames={d} number="05" label="LATE JULY – OCTOBER" title="Late summer: bait turns sweet" hue="amber" /> },
  { key: "f01", start: 528.0, el: (d) => <DiagramBoard durationInFrames={d} clip={DG("dgcal")} pages={[{ image: T("dg_wasp_bait_calendar") }]} /> },
  { key: "f02", start: 537.6, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("wp_apple_butter_jar")} imageDarken={0.5} title="Late-summer bait" chips={["apple butter", "mashed peaches", "turning cider"]} hue="amber" /> },
  { key: "f03", start: 545.0, el: (d) => <RawShot durationInFrames={d} src={B("rb_apple_butter")} hue="amber" kicker="Anything fermenting" /> },
  { key: "f04", start: 548.7, el: (d) => <RawShot durationInFrames={d} src={V("wp_fermenting_bubbles")} hue="amber" kicker="Anything sweet sliding toward rotten" /> },
  { key: "f05", start: 554.6, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_apple_cider_turning")} eyebrow="The same fermentation principle" words={parseQuote("as the *molasses fly trap*")} accent="good" hue="amber" /> },
  { key: "f06", start: 560.1, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "By late summer they hunt " }, { t: "sugar", good: true }]} /> },
  { key: "f07", start: 563.8, el: (d) => <RawShot durationInFrames={d} src={B("rb_fallen_fruit_wasps")} hue="amber" kicker="The food that gets the colony to first frost" /> },
  { key: "f08", start: 572.5, el: (d) => <RawShot durationInFrames={d} src={T("wp_av_spoon_applebutter")} hue="amber" kicker="They go in — and they don't come out" /> },

  // ════════════ BEE PROOF (9:38–10:22) ════════════
  { key: "g01", start: 578.6, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "A honeybee does not eat " }, { t: "any of these baits", good: true }]} /> },
  { key: "g02", start: 584.7, el: (d) => <SplitList durationInFrames={d} title="She will not touch" items={["raw liver", "a jar of apple butter"]} accent={RD} cross /> },
  { key: "g03", start: 590.0, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_jar_near_hive")} eyebrow="No receptors for the smell" words={parseQuote("and the cone keeps her *out*")} accent="good" hue="amber" /> },
  { key: "g04", start: 600.8, el: (d) => <ImpactReveal durationInFrames={d} image={T("wp_av_inspect_jar_hive")} setup="20 years, ten feet from my hive —" impact="NOT ONE HONEYBEE" impactAccent="good" hitAt={1.1} boom={1} /> },
  { key: "g05", start: 611.1, el: (d) => <RawShot durationInFrames={d} src={B("rb_bees_hive_entrance")} hue="cold" kicker="Not in spring. Not in late summer." /> },
  { key: "g06", start: 616.6, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_bee_white_flower")} eyebrow="Bees do not lie about what they eat" words={parseQuote("they eat *nectar* — end of conversation")} accent="good" hue="amber" /> },

  // ════════════ RULE 06 · PLACEMENT (10:22–11:50) ════════════
  { key: "r6", start: 622.8, el: (d) => <RuleNumberScene durationInFrames={d} number="06" label="WHERE TO SET THEM" title="Bait belongs at the edges" hue="amber" /> },
  { key: "u01", start: 625.8, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Set them at the " }, { t: "edges", good: true }, { t: ", not the center", danger: true }]} /> },
  { key: "u02", start: 630.3, el: (d) => <RawShot durationInFrames={d} src={T("wp_jar_yard_center_bad")} hue="red" kicker="Middle of the yard → pulls wasps toward you" /> },
  { key: "u03", start: 635.0, el: (d) => <RawShot durationInFrames={d} src={B("rb_farm_field_fence")} hue="cold" kicker="Back fence line → pulls them away" /> },
  { key: "u04", start: 640.6, el: (d) => <DiagramBoard durationInFrames={d} clip={DG("dgplace")} pages={[{ image: T("dg_wasp_placement") }]} /> },
  { key: "u05", start: 651.7, el: (d) => <StatBig durationInFrames={d} value={3} suffix=" jars" label="on a small lot — one at each corner farthest from the house" eyebrow="That's all it takes" accent="good" hue="amber" /> },
  { key: "u06", start: 658.2, el: (d) => <JourneyCanvas durationInFrames={d} eyebrow="On a property like mine" title="Six or seven, around the edges" worldImage={T("wp_amish_farm_wide")} waypoints={[
    { x: 600, y: 840, z: 0.7, image: T("wp_three_jars_corners"), label: "Corners", num: "1", dwell: 2.6, travel: 1.8 },
    { x: 1680, y: 470, z: 0.45, image: T("wp_jar_woodpile"), label: "Woodpile", num: "2", dwell: 2.4, travel: 1.9 },
    { x: 2760, y: 1040, z: 0.8, image: T("wp_jar_compost"), label: "Compost", num: "3", dwell: 2.4, travel: 1.9 },
    { x: 3820, y: 520, z: 0.5, image: T("wp_jar_barn"), label: "Barn", num: "4", dwell: 2.6, travel: 1.9 },
  ]} /> },
  { key: "u07", start: 668.6, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_jar_on_stump")} eyebrow="Hit the bait before your back porch" words={parseQuote("intercept her *leaving the nest*")} accent="good" hue="amber" /> },
  { key: "u08", start: 676.3, el: (d) => <RawShot durationInFrames={d} src={T("wp_av_hang_jar_post")} hue="amber" kicker="Hang it on a post or set it on a stump" /> },
  { key: "u09", start: 680.5, el: (d) => <RawShot durationInFrames={d} src={T("wp_jar_fencepost_field")} hue="amber" kicker="Somewhere the dog and wind won't tip it" /> },
  { key: "u10", start: 686.8, el: (d) => <ProcessSteps durationInFrames={d} eyebrow="Every two weeks" title="Empty and refresh" orientation="horizontal" accent="good" hue="cold" steps={[{ title: "Pry out the cone", image: T("wp_brown_paper_cone_nickel") }, { title: "Bury the contents", image: T("wp_bury_hole_ground") }, { title: "Rinse + rebait", image: T("wp_halfgallon_jar") }]} /> },
  { key: "u11", start: 695.6, el: (d) => <RawShot durationInFrames={d} src={T("wp_bury_hole_ground")} hue="cold" kicker="Pour it into a hole at the back · bury it" /> },
  { key: "u12", start: 701.8, el: (d) => <RawShot durationInFrames={d} src={T("wp_av_set_jar_corner")} hue="amber" kicker="Rinse · refresh the bait · set it back out" /> },
  { key: "u13", start: 706.3, el: (d) => <CalloutMark durationInFrames={d} figure="10 min" image={T("wp_hands_table")} eyebrow="The whole maintenance" caption="Ten minutes every other Saturday" accent="amber" hue="amber" /> },

  // ════════════ RULE 07 · THE NEST · DUSK + SOAP (11:50–14:30) ════════════
  { key: "r7", start: 710.5, el: (d) => <RuleNumberScene durationInFrames={d} number="07" label="IF YOU FIND A NEST" title="Take it at dusk — never spray it" hue="red" /> },
  { key: "n01", start: 717.0, el: (d) => <RawShot durationInFrames={d} src={B("rb_wasp_nest_eaves")} hue="red" kicker="An established nest on your eaves" /> },
  { key: "n02", start: 722.6, el: (d) => <ImpactReveal durationInFrames={d} image={T("wp_spray_can_warning")} setup="Do not spray it" impact="DURING THE DAY" impactAccent="danger" hitAt={1.0} boom={1} /> },
  { key: "n03", start: 727.2, el: (d) => <RawShot durationInFrames={d} src={B("rb_wasp_swarm_nest")} hue="red" kicker="Midday spray → a defensive swarm, straight at you" /> },
  { key: "n04", start: 736.0, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("wp_swarm_defensive")} imageDarken={0.6} tokens={[{ t: "Straight at you, " }, { t: "ten feet away", danger: true }]} /> },
  { key: "n05", start: 744.2, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_er_waiting_room")} eyebrow="People die this way" words={parseQuote("not often — but *often enough*")} accent="danger" hue="red" /> },
  { key: "n06", start: 748.5, el: (d) => <RawShot durationInFrames={d} src={B("rb_nest_removal_night")} hue="cold" kicker="We do it at dusk · every wasp inside, slow with cold" /> },
  { key: "n07", start: 757.9, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Wait for " }, { t: "full dark", hl: true }]} /> },
  { key: "n08", start: 761.6, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("wp_protective_clothing")} imageDarken={0.55} title="Cover everything" chips={["long sleeves", "pants", "hat", "gloves", "a face cloth"]} hue="amber" /> },
  { key: "n09", start: 770.5, el: (d) => <RawShot durationInFrames={d} src={T("wp_bucket_soapy_water")} hue="cold" kicker="A five-gallon bucket of soapy water" /> },
  { key: "n10", start: 779.6, el: (d) => <RawShot durationInFrames={d} src={B("rb_nest_bucket")} hue="cold" kicker="Slip the bucket up over the nest · hold it" /> },
  { key: "n11", start: 789.6, el: (d) => <RawShot durationInFrames={d} src={B("rb_wasps_in_water")} hue="red" kicker="Every wasp sinks · dead in under a minute" /> },
  { key: "n12", start: 796.6, el: (d) => <DiagramBoard durationInFrames={d} clip={DG("dgdusk")} pages={[{ image: T("dg_wasp_dusk_bucket") }]} /> },
  { key: "n13", start: 805.2, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "No chemical. No spray. " }, { t: "No swarm", good: true }]} /> },
  { key: "n14", start: 809.3, el: (d) => <CalloutMark durationInFrames={d} figure="60 yrs" image={T("wp_grandfather_portrait")} eyebrow="My grandfather took down every nest" caption="Sixty years · never once got stung" accent="amber" hue="amber" /> },
  { key: "n15", start: 817.5, el: (d) => <SplitList durationInFrames={d} title="The whole trick" items={["Dusk", "Full coverage", "The soap"]} accent={GD} /> },
  { key: "n16", start: 823.5, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_watering_can_ground_nest")} eyebrow="In a wall void or underground" words={parseQuote("pour soapy water in the entrance — a *watering can*")} accent="cold" hue="cold" /> },
  { key: "n17", start: 837.4, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Two gallons, slowly. " }, { t: "By morning, it's dead", good: true }]} /> },
  { key: "n18", start: 844.3, el: (d) => <RawShot durationInFrames={d} src={T("wp_av_dusk_bucket")} hue="cold" kicker="Nothing reckless" /> },
  { key: "n19", start: 850.0, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Very large or unreachable? " }, { t: "Call a pro — at dusk, no fog", hl: true }]} /> },
  { key: "n20", start: 861.1, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("wp_bucket_soapy_water")} imageDarken={0.55} tokens={[{ t: "For most yard nests — " }, { t: "the soapy bucket", good: true }]} /> },

  // ════════════ THE LARGER PICTURE (14:30–15:59) ════════════
  { key: "r8", start: 869.7, el: (d) => <RuleNumberScene durationInFrames={d} number="08" label="THE LARGER PICTURE" title="There is a real cost to wasps" hue="red" /> },
  { key: "l01", start: 874.6, el: (d) => <RawShot durationInFrames={d} src={T("wp_picnic_panic")} hue="red" kicker="Not just the panic at a picnic" /> },
  { key: "l02", start: 881.9, el: (d) => <ImpactReveal durationInFrames={d} image={T("wp_hospital_hallway")} setup="Every year in this country" impact="1 MILLION ER VISITS" impactAccent="danger" hitAt={1.1} boom={2} /> },
  { key: "l03", start: 888.0, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_allergy_bracelet")} eyebrow="The human cost is worse" words={parseQuote("they never knew they were *allergic*")} accent="danger" hue="red" /> },
  { key: "l04", start: 899.7, el: (d) => <AgedDoc durationInFrames={d} eyebrow="Parents, after losing a child" heading="They thought wasps were like bees" lines={[{ text: "They did not want to disturb nature" }, { text: "They were never told the difference", mark: true }]} accent="amber" hue="amber" /> },
  { key: "l05", start: 915.0, el: (d) => <RawShot durationInFrames={d} src={T("wp_bee_working_garden")} hue="cold" kicker="A honeybee earns her place" /> },
  { key: "l06", start: 921.3, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "She pollinates, she feeds — " }, { t: "she earns her place", good: true }]} /> },
  { key: "l07", start: 926.2, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_wasp_on_flower")} eyebrow="A wasp pollinates a little, eats some pests" words={parseQuote("a small *ecological* argument")} accent="cold" hue="amber" /> },
  { key: "l08", start: 935.6, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_nest_eaves_children")} eyebrow="But over a house with children under it" words={parseQuote("she is not pulling her weight against the *risk*")} accent="danger" hue="red" /> },
  { key: "l09", start: 942.7, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "We have always made this distinction" }]} /> },
  { key: "l10", start: 945.4, el: (d) => <ImpactReveal durationInFrames={d} image={T("wp_bee_white_flower")} impact="BEES STAY" impactAccent="good" hitAt={0.6} boom={1} /> },
  { key: "l11", start: 947.3, el: (d) => <ImpactReveal durationInFrames={d} image={T("wp_wasp_silhouette")} impact="WASPS GO" impactAccent="danger" hitAt={0.6} boom={2} /> },
  { key: "l12", start: 948.9, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_av_closing_porch")} eyebrow="Not because we hate her" words={parseQuote("but we cannot put our *grandchildren* under it")} accent="amber" hue="amber" /> },

  // ════════════ RULE 09 · THE BARGAIN (15:59–17:04) ════════════
  { key: "r9", start: 959.5, el: (d) => <RuleNumberScene durationInFrames={d} number="09" label="THE BARGAIN" title="$90 spray vs. $4 jar" hue="amber" /> },
  { key: "t01", start: 965.0, el: (d) => <RawShot durationInFrames={d} src={T("wp_spray_invoice_90")} hue="red" kicker="$90 a visit" /> },
  { key: "t02", start: 971.4, el: (d) => <DiagramBoard durationInFrames={d} clip={DG("dgbargain")} pages={[{ image: T("dg_wasp_bargain") }]} /> },
  { key: "t03", start: 981.0, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_queen_laying_nest")} eyebrow="The queen keeps laying inside" words={parseQuote("the colony *rebuilds in a month*")} accent="danger" hue="red" /> },
  { key: "t04", start: 990.7, el: (d) => <Checklist durationInFrames={d} eyebrow="The whole system" title="Four dollars, all season" items={[{ text: "$4 in glass jars", state: "done" }, { text: "A piece of brown paper", state: "done" }, { text: "A spoonful of liver in May", state: "done" }, { text: "A spoonful of apple butter in August", state: "done" }, { text: "Soapy water at dusk for the nests", state: "done" }]} accent="good" /> },
  { key: "t05", start: 1006.8, el: (d) => <BarCompare durationInFrames={d} eyebrow="Costs less than one visit" title="The honest tally" orientation="horizontal" hue="amber" bars={[{ label: "The $4 system", value: 4, display: "$4", tone: "good", winner: true, sub: "all season · wasps only" }, { label: "One spray visit", value: 90, display: "$90", tone: "danger", sub: "3 days · kills bees" }]} /> },
  { key: "t06", start: 1014.7, el: (d) => <ChipsCluster durationInFrames={d} bg="image" image={T("wp_songbirds_feeder")} imageDarken={0.5} title="It saves" chips={["bees", "butterflies", "dragonflies", "your dog", "the songbirds", "your children"]} hue="amber" /> },

  // ════════════ PHILOSOPHY (17:04–17:33) ════════════
  { key: "ph1", start: 1024.9, el: (d) => <RawShot durationInFrames={d} src={T("wp_hands_table")} hue="amber" kicker="This is what we have always done" /> },
  { key: "ph2", start: 1030.2, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Not because we're clever. " }, { t: "Because we had no choice", hl: true }]} /> },
  { key: "ph3", start: 1037.4, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_wasp_crawl_cone")} eyebrow="Her biggest weakness" words={parseQuote("her own *appetite*")} accent="good" hue="amber" /> },
  { key: "ph4", start: 1043.6, el: (d) => <RawShot durationInFrames={d} src={V("wp_wasp_flying_to_jar")} hue="red" kicker="She'll fly into a jar if the food is there" /> },
  { key: "ph5", start: 1050.6, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "You let her " }, { t: "appetite kill her", danger: true }]} /> },

  // ════════════ RULE 10 · THIS WEEKEND (17:33–18:56) ════════════
  { key: "r10", start: 1053.1, el: (d) => <RuleNumberScene durationInFrames={d} number="10" label="THIS WEEKEND" title="Here is what to do" hue="blue" /> },
  { key: "y01", start: 1056.8, el: (d) => <Checklist durationInFrames={d} eyebrow="Spring or early summer" title="Build it this weekend" items={[{ text: "Half-gallon jar + paper cone", state: "done" }, { text: "Thumb of raw liver or bacon", state: "done" }, { text: "Cup of water + one drop of soap", state: "done" }, { text: "Fence post, back corner — walk away", state: "doing" }]} accent="good" /> },
  { key: "y02", start: 1072.0, el: (d) => <RawShot durationInFrames={d} src={T("wp_dish_soap_water_cup")} hue="cold" kicker="Cup of water · one drop of dish soap" /> },
  { key: "y03", start: 1076.2, el: (d) => <RawShot durationInFrames={d} src={T("wp_jar_post_corner_day")} hue="amber" kicker="Set it on a post at the back corner · walk away" /> },
  { key: "y04", start: 1084.2, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Late summer or fall — " }, { t: "apple butter, not meat", good: true }]} /> },
  { key: "y05", start: 1091.4, el: (d) => <RawShot durationInFrames={d} src={T("wp_nest_mark_day")} hue="cold" kicker="A nest? Mark it by day · come back at dusk with the bucket" /> },
  { key: "y06", start: 1101.9, el: (d) => <RawShot durationInFrames={d} src={T("wp_comments_map_usa")} hue="cold" kicker="Tell me where you live in the comments" /> },
  { key: "y07", start: 1111.2, el: (d) => <ImpactReveal durationInFrames={d} image={T("wp_queen_caught_jar")} setup="One queen caught in May was" impact="2,000 WASPS THAT NEVER HAPPENED" impactAccent="good" hitAt={1.1} boom={2} /> },
  { key: "y08", start: 1120.0, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_child_barefoot_yard")} eyebrow="You saved a child somewhere" words={parseQuote("from a sting they'd have remembered for *life*")} accent="good" hue="amber" /> },
  { key: "y09", start: 1125.1, el: (d) => <AgedDoc durationInFrames={d} eyebrow="For the folks who were never told" heading="What we know, we know by hand" lines={[{ text: "My community already knows this works" }, { text: "I make these for the folks outside it", mark: true }]} accent="amber" hue="amber" /> },

  // ════════════ TICK TEASER + OUTRO (18:56–20:24) ════════════
  { key: "z01", start: 1136.9, el: (d) => <KineticHeadline durationInFrames={d} tokens={[{ t: "Next week: " }, { t: "something far worse than a sting", hl: true }]} /> },
  { key: "z02", start: 1145.0, el: (d) => <RawShot durationInFrames={d} src={B("rb_tall_grass")} hue="cold" kicker="Hidden in the tall grass where your children play" /> },
  { key: "z03", start: 1154.2, el: (d) => <RawShot durationInFrames={d} src={B("rb_tick_grass")} hue="red" kicker="A tick waits three weeks on a blade of grass" /> },
  { key: "z04", start: 1162.2, el: (d) => <RawShot durationInFrames={d} src={B("rb_tick_skin")} hue="red" kicker="She doesn't sting — she latches on" /> },
  { key: "z05", start: 1168.3, el: (d) => <KineticHeadline durationInFrames={d} bg="image" image={T("wp_tick_on_skin")} imageDarken={0.6} tokens={[{ t: "Five days on your skin — " }, { t: "and you don't know it", danger: true }]} /> },
  { key: "z06", start: 1174.9, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_tall_grass_children")} eyebrow="What she leaves behind" words={parseQuote("an illness that takes *twenty years* to recognize")} accent="danger" hue="red" /> },
  { key: "z07", start: 1185.8, el: (d) => <RawShot durationInFrames={d} src={T("wp_feed_store_powder")} hue="amber" kicker="A $4 powder from any feed store" /> },
  { key: "z08", start: 1191.0, el: (d) => <RawShot durationInFrames={d} src={T("wp_av_dust_treatment")} hue="amber" kicker="Two ten-minute treatments a year" /> },
  { key: "z09", start: 1195.1, el: (d) => <SplitList durationInFrames={d} title="It does not harm" items={["bees", "earthworms", "anything in the soil but the tick"]} accent={GD} /> },
  { key: "z10", start: 1203.1, el: (d) => <TextCardReveal durationInFrames={d} eyebrow="Goes up next Tuesday" lines={["Kill Every Tick In Your Yard", "The Amish Way — Safe for Bees & Children"]} accent={GD} /> },
  { key: "z11", start: 1212.8, el: (d) => <KineticQuote durationInFrames={d} image={T("wp_porch_dusk_outro")} eyebrow="Until then — set the jar, watch where the children run" words={parseQuote("remember the people who built this with their *hands*")} accent="amber" hue="amber" /> },
];

// dur de cada cue = inicio del siguiente − el suyo (último hasta el final)
const CUES = C.map((c, i) => ({ ...c, dur: (i < C.length - 1 ? C[i + 1].start : TOTAL) - c.start }));

const SECTION_KEYS = new Set(["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10"]);

// ── Cronograma del AVATAR (presente ~55%: cornerTR sobre b-roll, full en beats
// personales, hidden en hook/diagramas/journeys/impacts/pods densos) ──
const AVATAR_WINDOWS: AvatarWindow[] = [
  { start: 0, mode: "full" },          // ABRE el video hablando (~5s) antes del 1er b-roll
  { start: 5.0, mode: "hidden" },      // HOOK montaje denso
  { start: 52.8, mode: "cornerTR" },   // reveal del jar (narra al abuelo)
  { start: 60.0, mode: "hidden" },     // ImpactReveals + chips del reveal
  { start: 91.0, mode: "cornerTR" },
  { start: 99.7, mode: "full" },       // "My name is Claudio, I am Amish"
  { start: 104.0, mode: "cornerTR" },
  { start: 120.3, mode: "cornerTR" },
  { start: 131.7, mode: "right" },     // promesa: avatar derecha, checklist izquierda
  { start: 140.0, mode: "cornerTR" },
  { start: 161.8, mode: "cornerTR" },
  { start: 178.9, mode: "hidden" },    // RuleNumber 01
  { start: 184.9, mode: "cornerTR" },
  { start: 209.8, mode: "hidden" },    // diagrama bee vs wasp
  { start: 222.0, mode: "cornerTR" },
  { start: 233.7, mode: "hidden" },    // ImpactReveal PREDATOR + StatBig
  { start: 245.3, mode: "cornerTR" },
  { start: 260.4, mode: "hidden" },    // StatBig 30 stings
  { start: 268.0, mode: "cornerTR" },
  { start: 293.3, mode: "hidden" },    // ImpactReveal 300yd + diagrama secreto
  { start: 308.0, mode: "cornerTR" },
  { start: 310.6, mode: "hidden" },    // RuleNumber 02
  { start: 318.9, mode: "cornerTR" },
  { start: 328.5, mode: "hidden" },    // StatBig 30 + ImpactReveal 3 days + diagrama
  { start: 347.0, mode: "cornerTR" },
  { start: 360.9, mode: "right" },     // SplitList protege dos cosas
  { start: 366.9, mode: "cornerTR" },
  { start: 397.1, mode: "hidden" },    // diagrama spray truth
  { start: 405.0, mode: "hidden" },    // RuleNumber 03
  { start: 408.8, mode: "cornerTR" },
  { start: 430.0, mode: "hidden" },    // diagrama cono
  { start: 439.9, mode: "cornerTR" },
  { start: 442.1, mode: "hidden" },    // RuleNumber 04
  { start: 447.0, mode: "cornerTR" },
  { start: 497.8, mode: "hidden" },    // StatBig 1000 + ImpactReveal 2000
  { start: 508.7, mode: "cornerTR" },
  { start: 523.4, mode: "hidden" },    // RuleNumber 05 + diagrama calendario
  { start: 537.6, mode: "cornerTR" },
  { start: 578.6, mode: "cornerTR" },
  { start: 600.8, mode: "hidden" },    // ImpactReveal NOT ONE HONEYBEE
  { start: 611.1, mode: "cornerTR" },
  { start: 622.8, mode: "hidden" },    // RuleNumber 06
  { start: 625.8, mode: "cornerTR" },
  { start: 640.6, mode: "hidden" },    // diagrama placement + journey
  { start: 668.6, mode: "cornerTR" },
  { start: 686.8, mode: "hidden" },    // ProcessSteps empty/refresh
  { start: 695.6, mode: "cornerTR" },
  { start: 710.5, mode: "hidden" },    // RuleNumber 07
  { start: 717.0, mode: "cornerTR" },
  { start: 722.6, mode: "hidden" },    // ImpactReveal + swarm
  { start: 748.5, mode: "cornerTR" },
  { start: 761.6, mode: "hidden" },    // chips ropa + bucket pods
  { start: 805.2, mode: "cornerTR" },
  { start: 823.5, mode: "cornerTR" },
  { start: 844.3, mode: "full" },      // "nothing reckless" (personal)
  { start: 850.0, mode: "cornerTR" },
  { start: 869.7, mode: "hidden" },    // RuleNumber 08
  { start: 874.6, mode: "cornerTR" },
  { start: 881.9, mode: "hidden" },    // ImpactReveal 1M + AgedDoc
  { start: 915.0, mode: "cornerTR" },
  { start: 945.4, mode: "hidden" },    // BEES STAY / WASPS GO impacts
  { start: 948.9, mode: "full" },      // "our grandchildren" (emotivo)
  { start: 959.5, mode: "hidden" },    // RuleNumber 09 + diagrama bargain
  { start: 981.0, mode: "cornerTR" },
  { start: 990.7, mode: "left" },      // Checklist sistema (avatar izquierda)
  { start: 1006.8, mode: "hidden" },   // BarCompare
  { start: 1014.7, mode: "cornerTR" },
  { start: 1024.9, mode: "full" },     // philosophy (personal)
  { start: 1037.4, mode: "cornerTR" },
  { start: 1053.1, mode: "hidden" },   // RuleNumber 10
  { start: 1056.8, mode: "left" },     // CTA checklist (avatar izquierda)
  { start: 1072.0, mode: "cornerTR" },
  { start: 1111.2, mode: "hidden" },   // ImpactReveal 2000 never happened
  { start: 1120.0, mode: "cornerTR" },
  { start: 1136.9, mode: "cornerTR" }, // tick teaser (PiP sobre b-roll)
  { start: 1212.8, mode: "full" },     // cierre emotivo en el porche
  { start: TOTAL, mode: "hidden" },
];

export const MainWasp: React.FC = () => {
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
          <AvatarLayer src="wasp_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
  { from: 0, to: 52, tint: "#9A5238", strength: 0.06 },     // hook Aaron: terracota oscuro
  { from: 52, to: 99, tint: "#C8904A", strength: 0.05 },    // jar reveal: ámbar cálido
  { from: 99, to: 178, tint: "#A9794A", strength: 0.05 },   // identidad + promesa: sepia
  { from: 178, to: 310, tint: "#B0503C", strength: 0.06 },  // wasp vs bee / el secreto: terracota
  { from: 310, to: 405, tint: "#9A5238", strength: 0.07 },  // matan abejas / spray: terracota oscuro
  { from: 405, to: 523, tint: "#B0833F", strength: 0.05 },  // 4 cosas / carnada primavera: tierra
  { from: 523, to: 622, tint: "#A9794A", strength: 0.05 },  // carnada verano / prueba abejas: sepia
  { from: 622, to: 710, tint: "#7C8A5A", strength: 0.05 },  // ubicación: salvia
  { from: 710, to: 869, tint: "#6F8478", strength: 0.06 },  // el nido al anochecer: eucalipto frío
  { from: 869, to: 959, tint: "#9A5238", strength: 0.06 },  // panorama / costo: terracota
  { from: 959, to: 1053, tint: "#A9794A", strength: 0.05 }, // el trato / philosophy: sepia
  { from: 1053, to: 1136, tint: "#7C8A5A", strength: 0.05 },// CTA: salvia/verde
  { from: 1136, to: TOTAL, tint: "#6F8478", strength: 0.06 },// tick teaser / cierre: frío
];
