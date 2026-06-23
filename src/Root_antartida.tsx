import "./index.css";
import { Composition } from "remotion";
import { MainAntartida, TOTAL_FRAMES_ANT } from "./VideoEdit/Main_antartida";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Antartida"
      component={MainAntartida}
      durationInFrames={TOTAL_FRAMES_ANT}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
