import "./index.css";
import { Composition } from "remotion";
import { MainBarrera, TOTAL_FRAMES_BRR } from "./VideoEdit/Main_barrera";

// Root MÍNIMO — solo Video 3 (barrera galvánica). Para Studio sin OOM del Root completo.
export const RootBRR: React.FC = () => (
  <>
    <Composition id="Barrera" component={MainBarrera} durationInFrames={TOTAL_FRAMES_BRR} fps={30} width={1920} height={1080} />
  </>
);
