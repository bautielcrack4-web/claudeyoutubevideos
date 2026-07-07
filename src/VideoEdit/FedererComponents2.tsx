import React from "react";
import { renderFedererComp, COMP_KINDS } from "./FedererComponents";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { BarCompare } from "./scenes/BarCompare";
import { CalloutMark } from "./scenes/CalloutMark";
import { PizarraExplica } from "./scenes/PizarraExplica";
import { DocNameCard } from "./scenes/DocNameCard";

// Video 2 (CAFÉ) suma kinds que el mapeador del Video 1 no tenía: bars, callout,
// diagram con IMAGEN gpt-image real (DiagramBoard), y "board" = avatar a la derecha
// + pizarra explicativa a la izquierda (PizarraExplica). Resto → renderFedererComp.
export const COMP2_KINDS = new Set<string>([...COMP_KINDS, "bars", "callout", "board"]);
// board mantiene el avatar VISIBLE a un lado (no lo oculta) → el Main lo pone en "right"/"left"
export const BOARD_KINDS = new Set<string>(["board"]);

export function renderFederer2Comp(beat: any, d: number): React.ReactNode {
  switch (beat.kind) {
    case "diagram": {
      // láminas gpt-image reales (DiagramBoard corta seco entre pages). Rutas CRUDAS
      // (Media resuelve staticFile internamente, como RawShot).
      const pages = (beat.slides || [])
        .filter((s: any) => s && s.image)
        .map((s: any) => ({ image: s.image, eyebrow: s.eyebrow || beat.eyebrow }));
      if (!pages.length) return null;
      return <DiagramBoard durationInFrames={d} pages={pages} />;
    }
    case "bars":
      return (
        <BarCompare
          durationInFrames={d}
          title={beat.title}
          eyebrow={beat.eyebrow}
          unit={beat.unit}
          accent="accent"
          bars={(beat.bars || []).map((b: any) => ({ label: b.label, value: b.value, tone: b.tone, winner: b.winner, note: b.note }))}
        />
      );
    case "callout":
      return (
        <CalloutMark
          durationInFrames={d}
          figure={beat.figure}
          caption={beat.caption}
          image={beat.image}
          eyebrow={beat.eyebrow}
          accent="accent"
        />
      );
    case "board":
      return (
        <PizarraExplica
          durationInFrames={d}
          eyebrow={beat.eyebrow}
          title={beat.title}
          items={beat.items || []}
          side={beat.side || "left"}
        />
      );
    case "nametag":
      // el default de DocNameCard es img/federer_casual.png (video 1, no existe acá) → pasar foto fe2
      return <DocNameCard durationInFrames={d} name={beat.name} role={beat.role} image="img/fe2_federer_cafe.png" />;
    default:
      return renderFedererComp(beat, d);
  }
}
