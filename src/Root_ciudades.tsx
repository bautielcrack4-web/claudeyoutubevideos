import "./index.css";
import { Composition } from "remotion";
import { MainCiudades, TOTAL_FRAMES_CIUD } from "./VideoEdit/Main_ciudades";

// Root MÍNIMO: solo Ciudades → Studio bundlea poco → no se queda sin memoria.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Ciudades"
      component={MainCiudades}
      durationInFrames={TOTAL_FRAMES_CIUD}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
