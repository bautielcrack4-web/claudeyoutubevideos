import { Composition } from "remotion";
import { MainCastores, TOTAL_FRAMES_CAS } from "./VideoEdit/Main_castores";

// Root MÍNIMO — solo la comp Castores, para revisar en Studio sin OOM.
export const RootCastores: React.FC = () => {
  return (
    <Composition
      id="Castores"
      component={MainCastores}
      durationInFrames={TOTAL_FRAMES_CAS}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
