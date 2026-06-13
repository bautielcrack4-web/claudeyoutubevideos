import "./index.css";
import { Composition } from "remotion";
import { MainEstufaRocket, TOTAL_FRAMES_ER } from "./VideoEdit/Main_estufarocket";

// Root MÍNIMO — solo Video 1 (El Constructor Libre / estufa rocket).
// Sirve para abrir Studio sin bundlear los 7+ videos del Root principal
// (que hace OOM de V8 "invalid table size"). Para review/edición de este video.
export const RootER: React.FC = () => (
  <>
    <Composition id="EstufaRocket" component={MainEstufaRocket} durationInFrames={TOTAL_FRAMES_ER} fps={30} width={1920} height={1080} />
  </>
);
