import "./index.css";
import { Composition } from "remotion";
import { MainBorax, TOTAL_FRAMES_BX } from "./VideoEdit/Main_borax";

// Root MÍNIMO — solo Video 2 (bórax/madera). Para Studio sin OOM del Root completo.
export const RootBX: React.FC = () => (
  <>
    <Composition id="Borax" component={MainBorax} durationInFrames={TOTAL_FRAMES_BX} fps={30} width={1920} height={1080} />
  </>
);
