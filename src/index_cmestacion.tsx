import "./index.css";
import React from "react";
import {Composition, registerRoot} from "remotion";
import {MainCmestacion, TOTAL_FRAMES_CMESTACION} from "./cmestacion/Main_cmestacion";
const RootCmestacion: React.FC = () => (
  <Composition id="Cmestacion" component={MainCmestacion} durationInFrames={TOTAL_FRAMES_CMESTACION} fps={30} width={1920} height={1080} />
);
registerRoot(RootCmestacion);
