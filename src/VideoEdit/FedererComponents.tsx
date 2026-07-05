import React from "react";
import { staticFile } from "remotion";
import {
  THEME_MEDICO,
  HookCaption,
  BigStatReveal,
  PullQuote,
  BulletCascade,
  ChecklistReveal,
  NumberedSteps,
  FlowSteps,
  LayerStack,
  CutawayCallouts,
  SplitPanel,
  ChapterTitle,
} from "./kit/premium";
import { BlurExplainer } from "./scenes/BlurExplainer";
import { DocNameCard } from "./scenes/DocNameCard";
import { BenefitLockReveal } from "./scenes/BenefitLockReveal";
import { Pizarra } from "./scenes/Pizarra";

const BENEFIT_IDX: Record<string, number> = { arrugas: 0, varices: 1, dolores: 2 };

const T = THEME_MEDICO;
const strip = (s?: string) => (s || "").replace(/\*/g, "");
// el kit premium (ImgOr) usa <Img src> SIN staticFile → hay que pasar la URL resuelta
const sf = (p?: string) => (p ? staticFile(p) : undefined);

// diagramas conceptuales → vectores del kit premium (sin imágenes IA)
function diagramFor(beat: any, d: number): React.ReactNode {
  switch (beat.key) {
    case "oxidacion":
      return <FlowSteps durationInFrames={d} theme={T} title="Envejecer, en el fondo" nodes={[{ label: "Inflamación", sub: "células irritadas" }, { label: "Oxidación", sub: "como una manzana" }]} />;
    case "compuestos":
      return <BulletCascade durationInFrames={d} theme={T} eyebrow="Un ejército de escudos" bullets={[{ key: "Ácido carnósico" }, { key: "Ácido rosmarínico" }, { pre: "Frenan la ", key: "oxidación", post: " que te envejece" }]} />;
    case "arrugas_mec":
      return <LayerStack durationInFrames={d} theme={T} title="La piel, por dentro" layers={[{ label: "Piel + colágeno" }, { label: "Más circulación de sangre" }, { label: "Células nutridas" }]} />;
    case "varices_porque":
      return <FlowSteps durationInFrames={d} theme={T} title="Por qué aparecen las várices" nodes={[{ label: "La sangre sube" }, { label: "Válvula débil" }, { label: "Se estanca" }]} />;
    case "dolores_infl":
      return <BulletCascade durationInFrames={d} theme={T} eyebrow="El apellido del dolor" bullets={[{ key: "Inflamación" }, { pre: "El romero es ", key: "antiinflamatorio" }]} />;
    default: {
      const eb = beat.slides?.[0]?.eyebrow || beat.eyebrow || "";
      return <HookCaption durationInFrames={d} theme={T} words={eb.split(" ").map((w: string) => ({ text: w }))} />;
    }
  }
}

// mapea un beat de COMPONENTE → componente premium Fable 5 (themeado MEDICO)
export function renderFedererComp(beat: any, d: number): React.ReactNode {
  switch (beat.kind) {
    case "headline":
      return <HookCaption durationInFrames={d} theme={T} words={(beat.tokens || []).map((t: any) => ({ text: t.t, boxed: !!t.hl }))} sub={beat.eyebrow} />;
    case "stat":
      return <BigStatReveal durationInFrames={d} theme={T} eyebrow={beat.eyebrow} value={beat.value} prefix={beat.prefix} suffix={beat.suffix} support={beat.label} />;
    case "quote":
      return <PullQuote durationInFrames={d} theme={T} quote={strip(beat.text)} image={sf(beat.image)} />;
    case "chips":
      return <SplitPanel durationInFrames={d} theme={T} title={beat.title} image={sf(beat.image)} bullets={beat.chips || []} />;
    case "splitlist":
      return <BulletCascade durationInFrames={d} theme={T} eyebrow={beat.title} bullets={(beat.items || []).map((i: string) => ({ key: i }))} />;
    case "checklist":
      return <ChecklistReveal durationInFrames={d} theme={T} title={beat.title} items={(beat.items || []).map((i: any) => (typeof i === "string" ? i : i.text))} />;
    case "process":
      return <NumberedSteps durationInFrames={d} theme={T} eyebrow={beat.eyebrow} title={beat.title} steps={(beat.steps || []).map((s: any) => ({ title: s.title, sub: s.desc, image: sf(s.image) }))} />;
    case "ingredients":
      return <FlowSteps durationInFrames={d} theme={T} title={beat.title} nodes={(beat.items || []).map((i: any) => ({ label: i.name, sub: i.amount, image: sf(i.image) }))} />;
    case "annotated":
      return <CutawayCallouts durationInFrames={d} theme={T} eyebrow={beat.eyebrow} title={beat.caption} image={sf(beat.image)} callouts={(beat.annotations || []).map((a: any) => ({ text: a.label, tx: a.x / 100, ty: a.y / 100 }))} />;
    case "diagram":
      return diagramFor(beat, d);
    case "rule":
      if (beat.key in BENEFIT_IDX)
        return <BenefitLockReveal durationInFrames={d} index={BENEFIT_IDX[beat.key]} />;
      return <ChapterTitle durationInFrames={d} theme={T} number={beat.number} title={beat.title} />;
    case "nametag":
      return <DocNameCard durationInFrames={d} name={beat.name} role={beat.role} />;
    case "blurexplainer":
      return <BlurExplainer durationInFrames={d} clip={beat.clip} image={beat.image} eyebrow={beat.eyebrow} title={beat.title} body={beat.body} side={beat.side} />;
    case "pizarra":
      return <Pizarra durationInFrames={d} title={beat.title} slides={(beat.slides || []).map((s: any) => ({ ...s, image: s.image }))} />;
    default:
      return null;
  }
}

// kinds que son COMPONENTES (no b-roll ni talk)
export const COMP_KINDS = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "process", "ingredients", "annotated", "diagram", "rule", "nametag", "blurexplainer", "pizarra"]);
