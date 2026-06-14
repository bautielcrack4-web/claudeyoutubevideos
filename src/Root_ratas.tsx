import "./index.css";
import { Composition } from "remotion";
import { MainRatas, TOTAL_FRAMES_RATAS } from "./VideoEdit/Main_ratas";

export const RootRatas: React.FC = () => (
  <Composition id="Ratas" component={MainRatas} durationInFrames={TOTAL_FRAMES_RATAS} fps={30} width={1920} height={1080} />
);
