import "./index.css";
import { Composition } from "remotion";
import { MainFederer6, TOTAL_FRAMES_FED6 } from "./VideoEdit/Main_federer6";

export const RootFederer6: React.FC = () => {
  return (
    <>
      <Composition id="Federer6" component={MainFederer6} durationInFrames={TOTAL_FRAMES_FED6} fps={30} width={1920} height={1080} />
    </>
  );
};
