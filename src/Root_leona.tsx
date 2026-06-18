import "./index.css";
import { Composition } from "remotion";
import { MainLeona, TOTAL_FRAMES_LEONA } from "./VideoEdit/Main_leona";

// Root MÍNIMO solo-Leona → bundle chico → render confiable sin OOM.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition id="Leona" component={MainLeona} durationInFrames={TOTAL_FRAMES_LEONA} fps={30} width={1920} height={1080} />
  );
};
