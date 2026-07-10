import "./index.css";
import { Composition } from "remotion";
import { MainVet1, TOTAL_FRAMES_VET1 } from "./VideoEdit/Main_vet1";

export const RootVet1: React.FC = () => (
  <>
    <Composition id="Vet1" component={MainVet1} durationInFrames={TOTAL_FRAMES_VET1} fps={30} width={1920} height={1080} />
  </>
);
