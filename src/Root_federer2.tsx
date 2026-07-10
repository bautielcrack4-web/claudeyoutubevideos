import "./index.css";
import { Composition } from "remotion";
import { MainFederer2, TOTAL_FRAMES_FED2 } from "./VideoEdit/Main_federer2";
import { PizarraOjo } from "./VideoEdit/scenes/PizarraOjo";

// Root MÍNIMO — video CAFÉ (video 2) + demo del diagrama-pizarra animado (video 3 ojos).
export const RootFederer2: React.FC = () => (
  <>
    <Composition id="Federer2" component={MainFederer2} durationInFrames={TOTAL_FRAMES_FED2} fps={30} width={1920} height={1080} />
    <Composition id="PizarraOjo" component={PizarraOjo} durationInFrames={330} fps={30} width={1920} height={1080} defaultProps={{ durationInFrames: 330 }} />
  </>
);
