import { Composition } from "remotion";
import { MainHuron, TOTAL_FRAMES_HUR } from "./VideoEdit/Main_huron";

// Root MÍNIMO — solo la comp Huron, para revisar en Studio sin OOM.
export const RootHuron: React.FC = () => {
  return (
    <Composition
      id="Huron"
      component={MainHuron}
      durationInFrames={TOTAL_FRAMES_HUR}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
