import "./index.css";
import { Composition } from "remotion";
import { MainCeniza, TOTAL_FRAMES_CENIZA } from "./VideoEdit/Main_ceniza";

export const RootCeniza: React.FC = () => (
  <>
    <Composition id="Ceniza" component={MainCeniza} durationInFrames={TOTAL_FRAMES_CENIZA} fps={30} width={1920} height={1080} />
  </>
);
