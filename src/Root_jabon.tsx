import "./index.css";
import { Composition } from "remotion";
import { MainJabon, TOTAL_FRAMES_JABON } from "./VideoEdit/Main_jabon";

// Root MÍNIMO — solo Video v4 (jabón de ceniza). Para Studio sin OOM del Root completo.
export const RootJabon: React.FC = () => (
  <>
    <Composition id="Jabon" component={MainJabon} durationInFrames={TOTAL_FRAMES_JABON} fps={30} width={1920} height={1080} />
  </>
);
