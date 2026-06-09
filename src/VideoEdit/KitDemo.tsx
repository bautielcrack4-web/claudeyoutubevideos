import { Series } from "remotion";
import { sec } from "./theme";
import { BarCompare } from "./scenes/BarCompare";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { CalloutMark } from "./scenes/CalloutMark";
import { CrossSection } from "./scenes/CrossSection";
import { AgedDoc } from "./scenes/AgedDoc";
import { Checklist } from "./scenes/Checklist";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { StatBig } from "./scenes/StatBig";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { AvatarPresentation } from "./scenes/AvatarPresentation";

// Dev gallery for the data-driven niche component kit. Not a real video — a place
// to build & validate kit components in isolation (each shown with sample data).
// Render a still of any frame to inspect, or play to check motion + SFX timing.
const SEG = sec(7);

export const KitDemo: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={SEG}>
      <BarCompare
        durationInFrames={SEG}
        eyebrow="Eficiencia de enfriamiento"
        title="A/C vs Tubo de tierra"
        orientation="vertical"
        unit="×"
        accent="good"
        hue="cold"
        bars={[
          { label: "Aire acond.", value: 3, sub: "COP típico", tone: "cold" },
          { label: "Tubo tierra", value: 29, sub: "COP efectivo", winner: true },
        ]}
      />
    </Series.Sequence>

    <Series.Sequence durationInFrames={SEG}>
      <BarCompare
        durationInFrames={SEG}
        eyebrow="Instalaciones modernas"
        title="Tubo de tierra por país"
        orientation="horizontal"
        accent="amber"
        hue="amber"
        bars={[
          { label: "Alemania", value: 42, display: "42k" },
          { label: "Austria", value: 31, display: "31k" },
          { label: "Suiza", value: 24, display: "24k" },
          { label: "EE.UU.", value: 12, display: "12k", winner: true },
        ]}
      />
    </Series.Sequence>

    <Series.Sequence durationInFrames={SEG}>
      <KineticQuote
        durationInFrames={SEG}
        eyebrow="La idea"
        words={parseQuote("El frío no *entra* — el calor *sale*")}
        cite="— principio de aislación"
        accent="amber"
        hue="cold"
      />
    </Series.Sequence>

    <Series.Sequence durationInFrames={SEG}>
      <CalloutMark
        durationInFrames={SEG}
        eyebrow="Hace más de un siglo"
        figure="1903"
        caption="Los primeros pozos canadienses de aire"
        accent="amber"
        hue="amber"
      />
    </Series.Sequence>

    <Series.Sequence durationInFrames={SEG}>
      <CrossSection
        durationInFrames={SEG}
        eyebrow="Bajo tierra"
        title="Por qué el suelo aísla"
        hue="amber"
        layers={[
          { label: "Aire / superficie", depth: "0 cm", color: "#6E5B3E", weight: 0.7 },
          { label: "Tierra vegetal", depth: "0–30 cm", color: "#5A4527", weight: 1 },
          { label: "Subsuelo", depth: "30–150 cm", color: "#43331E", weight: 1.3 },
          { label: "Zona estable", depth: "1.5–3 m", color: "#322415", weight: 1.6 },
        ]}
        marker={{ label: "Tubo de aire", atDepth: 0.5, color: "accent" }}
      />
    </Series.Sequence>

    <Series.Sequence durationInFrames={SEG}>
      <AgedDoc
        durationInFrames={SEG}
        eyebrow="Del manual, 1909"
        heading="El aliento de la casa"
        accent="amber"
        hue="amber"
        lines={[
          { text: "Toda morada debe respirar con la tierra," },
          { text: "tomando su frescor en verano", mark: true },
          { text: "y su calor guardado en invierno." },
        ]}
      />
    </Series.Sequence>

    <Series.Sequence durationInFrames={SEG}>
      <Checklist
        durationInFrames={SEG}
        eyebrow="Sin venenos"
        title="Compost que sí funciona"
        accent="good"
        hue="cold"
        items={[
          { text: "Restos verdes (nitrógeno)", state: "done" },
          { text: "Restos secos (carbono)", state: "done" },
          { text: "Voltear cada semana", state: "doing", note: "en proceso" },
          { text: "Tamizar al final", state: "todo" },
        ]}
      />
    </Series.Sequence>

    <Series.Sequence durationInFrames={SEG}>
      <ProcessSteps
        durationInFrames={SEG}
        eyebrow="Paso a paso"
        title="Cómo armar el pozo"
        orientation="vertical"
        accent="accent"
        hue="cold"
        steps={[
          { title: "Excavar el conducto", desc: "1.5–3 m de profundidad" },
          { title: "Tender el tubo", desc: "pendiente para drenar" },
          { title: "Cubrir y compactar", desc: "tierra estable encima" },
          { title: "Conectar a la casa", desc: "entrada filtrada" },
        ]}
      />
    </Series.Sequence>

    <Series.Sequence durationInFrames={SEG}>
      <StatBig
        durationInFrames={SEG}
        eyebrow="La diferencia"
        prefix="−"
        value={17}
        suffix="°F"
        label="lo que baja el aire al cruzar la tierra"
        accent="cold"
        hue="cold"
      />
    </Series.Sequence>

    <Series.Sequence durationInFrames={SEG}>
      <AnnotatedImage
        durationInFrames={SEG}
        eyebrow="El material correcto"
        caption="No cualquier tierra sirve"
        hue="cold"
        annotations={[
          { kind: "circle", x: 0.32, y: 0.42, w: 0.13, label: "Restos verdes", color: "good" },
          { kind: "arrow", x: 0.68, y: 0.55, fromX: 0.86, fromY: 0.3, label: "Hojas secas", color: "amber" },
          { kind: "underline", x: 0.5, y: 0.86, w: 0.2, label: "Humedad justa", color: "accent" },
        ]}
      />
    </Series.Sequence>

    <Series.Sequence durationInFrames={SEG}>
      <AvatarPresentation
        durationInFrames={SEG}
        eyebrow="El sistema"
        hue="cold"
        accent="accent"
        slides={[
          { title: "EL TRUCO AMISH", note: "Enfriar la casa sin gastar de más" },
          { title: "Ventilación cruzada", note: "Abrí temprano, cerrá al mediodía" },
          { title: "Más sombra = menos calor", note: "Antes vs. después" },
        ]}
      />
    </Series.Sequence>
  </Series>
);

export const KIT_FRAMES = SEG * 11;
