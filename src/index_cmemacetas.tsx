import "./index.css";
import React from "react";
import {Composition, registerRoot} from "remotion";
import {MainCmemacetas, TOTAL_FRAMES_CMEMACETAS} from "./cmemacetas/Main_cmemacetas";
const RootCmemacetas: React.FC = () => (
  <Composition id="Cmemacetas" component={MainCmemacetas} durationInFrames={TOTAL_FRAMES_CMEMACETAS} fps={30} width={1920} height={1080} />
);
registerRoot(RootCmemacetas);
