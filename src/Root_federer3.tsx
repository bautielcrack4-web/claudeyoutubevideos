import "./index.css";
import { Composition } from "remotion";
import { MainFederer3, TOTAL_FRAMES_FED3 } from "./VideoEdit/Main_federer3";

// Root MÍNIMO — solo el video OJOS (Dr. Federer, video 3). Para review/render sin OOM.
export const RootFederer3: React.FC = () => (
  <>
    <Composition id="Federer3" component={MainFederer3} durationInFrames={TOTAL_FRAMES_FED3} fps={30} width={1920} height={1080} />
  </>
);
