import { AbsoluteFill, Sequence } from "remotion";
import { COLORS, sec } from "./theme";
import { Top7Card } from "./scenes/Top7Card";

// Top7Demo — preview SOLO de la tarjeta de revelación Top7Card (la idea central del
// video "7 Animales"). Recorre los 7 puestos para ver el diseño + el riel de progreso
// N/7 encendiéndose. Usa fotos PLACEHOLDER existentes (clover/farm) porque las fotos-
// héroe reales (t7_*) todavía no se generaron. Cada puesto ~3.5s.
const PH = ["img/fl_clover_field.png", "img/fl_farm_wide.png", "img/casa_rural.png"];

const ITEMS = [
  { rank: 1, name: "La gallina ponedora", benefit: "Huevos todo el año — la puerta de entrada", accent: "good" as const },
  { rank: 2, name: "El conejo", benefit: "Carne + fertilizante, la máquina más eficiente", accent: "amber" as const },
  { rank: 3, name: "La codorniz", benefit: "Huevos premium en mínimo espacio", accent: "accent" as const },
  { rank: 4, name: "El pato", benefit: "Huevos + control de plagas del huerto", accent: "cold" as const },
  { rank: 5, name: "La cabra enana", benefit: "Leche y queso fresco todos los días", accent: "good" as const },
  { rank: 6, name: "La lombriz roja", benefit: "Fertilizante que se multiplica solo", accent: "danger" as const },
  { rank: 7, name: "La abeja", benefit: "Miel, cera, propóleo… y poliniza todo", accent: "amber" as const, label: "EL TOP 7 · LA CORONA" },
];

const SEG = 3.5;
export const TOTAL_FRAMES_TOP7DEMO = sec(SEG * ITEMS.length);

export const Top7Demo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {ITEMS.map((it, i) => (
        <Sequence key={it.rank} from={sec(SEG * i)} durationInFrames={sec(SEG)}>
          <Top7Card
            durationInFrames={sec(SEG)}
            rank={it.rank}
            name={it.name}
            benefit={it.benefit}
            image={PH[i % PH.length]}
            accent={it.accent}
            hue="amber"
            label={it.label}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
