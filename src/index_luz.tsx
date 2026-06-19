// Entry MÍNIMO solo-Luz para Remotion Studio.
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainLuz, TOTAL_FRAMES_LUZ } from "./VideoEdit/Main_luz";

const LuzRoot: React.FC = () => (
  <Composition id="Luz" component={MainLuz} durationInFrames={TOTAL_FRAMES_LUZ} fps={30} width={1920} height={1080} />
);
registerRoot(LuzRoot);
