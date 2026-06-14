import { Composition } from "remotion";
import { Thumb } from "./VideoEdit/Thumb";

// Root MÍNIMO solo para renderizar miniaturas (still). Props por --props al renderizar.
export const RootThumb: React.FC = () => (
  <Composition
    id="Thumb"
    component={Thumb}
    durationInFrames={1}
    fps={30}
    width={1280}
    height={720}
    defaultProps={{
      image: "img/th_jabon.png",
      lines: ["NUNCA MÁS", "COMPRES", "JABÓN"],
      arrow: { x1: 300, y1: 420, x2: 250, y2: 600, curve: 0.25 },
      textX: 48,
      textY: 40,
      fontSize: 112,
    }}
  />
);
