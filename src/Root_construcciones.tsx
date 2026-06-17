import "./index.css";
import { Composition } from "remotion";
import { MainConstrucciones, TOTAL_FRAMES_CONS } from "./VideoEdit/Main_construcciones";

// Root MÍNIMO: solo Construcciones → Studio bundlea poco → no se queda sin memoria.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Construcciones"
      component={MainConstrucciones}
      durationInFrames={TOTAL_FRAMES_CONS}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
