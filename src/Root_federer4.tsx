import "./index.css";
import { Composition } from "remotion";
import { MainFederer4, TOTAL_FRAMES_FED4 } from "./VideoEdit/Main_federer4";

// Entry MÍNIMO (solo la comp principal, para no OOM en Studio/farm).
export const RootFederer4: React.FC = () => {
  return (
    <>
      <Composition id="Federer4" component={MainFederer4} durationInFrames={TOTAL_FRAMES_FED4} fps={30} width={1920} height={1080} />
    </>
  );
};
