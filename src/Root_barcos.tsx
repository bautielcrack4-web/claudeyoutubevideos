import { Composition } from "remotion";
import { MainBarcos, TOTAL_FRAMES_BAR } from "./VideoEdit/Main_barcos";

// Root MÍNIMO — solo la comp Barcos, para revisar en Studio sin OOM.
export const RootBarcos: React.FC = () => {
  return (
    <Composition
      id="Barcos"
      component={MainBarcos}
      durationInFrames={TOTAL_FRAMES_BAR}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
