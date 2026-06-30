import { Composition } from "remotion";
import { MainAral, TOTAL_FRAMES_AR } from "./VideoEdit/Main_aral";

// Root MÍNIMO — solo la comp Aral, para revisar en Studio sin OOM.
export const RootAral: React.FC = () => {
  return (
    <Composition
      id="Aral"
      component={MainAral}
      durationInFrames={TOTAL_FRAMES_AR}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
