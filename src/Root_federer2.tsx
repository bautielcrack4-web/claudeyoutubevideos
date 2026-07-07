import "./index.css";
import { Composition } from "remotion";
import { MainFederer2, TOTAL_FRAMES_FED2 } from "./VideoEdit/Main_federer2";

// Root MÍNIMO — solo el video CAFÉ (canal Dr. Federer, video 2). Para review/render
// sin bundlear los 7+ videos del Root principal (que hace OOM de V8).
export const RootFederer2: React.FC = () => (
  <>
    <Composition id="Federer2" component={MainFederer2} durationInFrames={TOTAL_FRAMES_FED2} fps={30} width={1920} height={1080} />
  </>
);
