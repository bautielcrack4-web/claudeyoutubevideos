import "./index.css";
import React from "react";
import {Composition, registerRoot} from "remotion";
import {MainCmellave, TOTAL_FRAMES_CMELLAVE} from "./cmellave/Main_cmellave";
const RootCmellave: React.FC = () => (
  <Composition id="Cmellave" component={MainCmellave} durationInFrames={TOTAL_FRAMES_CMELLAVE} fps={30} width={1920} height={1080} />
);
registerRoot(RootCmellave);
