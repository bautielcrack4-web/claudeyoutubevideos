import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainOlivares2, TOTAL_FRAMES_OLIVARES2 } from "./VideoEdit/Main_olivares2";
const Root: React.FC = () => (
  <Composition id="Olivares2" component={MainOlivares2} durationInFrames={TOTAL_FRAMES_OLIVARES2}
    fps={30} width={1920} height={1080} />
);
registerRoot(Root);
