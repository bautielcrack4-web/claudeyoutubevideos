import React from "react";
import {Composition} from "remotion";
import {
  MainVallerAceites7,
  TOTAL_FRAMES_VALLER_ACEITES7,
} from "./VideoEdit/Main_valler_aceites7";
import {
  MainVbb0rdkrfduo,
  TOTAL_FRAMES_VBB0RDKRFDUO,
} from "./VideoEdit/Main_vbb0rdkrfduo";
import {
  MainVd4f4gksltnz,
  TOTAL_FRAMES_VD4F4GKSLTNZ,
} from "./VideoEdit/Main_vd4f4gksltnz";
import {
  MainVbrhdsvzlyw5,
  TOTAL_FRAMES_VBRHDSVZLYW5,
} from "./VideoEdit/Main_vbrhdsvzlyw5";

export const VallerAceites7Root: React.FC = () => (
  <>
    <Composition
      id="Vbb0rdkrfduo"
      component={MainVbb0rdkrfduo}
      durationInFrames={TOTAL_FRAMES_VBB0RDKRFDUO}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="VallerAceites7"
      component={MainVallerAceites7}
      durationInFrames={TOTAL_FRAMES_VALLER_ACEITES7}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Vd4f4gksltnz"
      component={MainVd4f4gksltnz}
      durationInFrames={TOTAL_FRAMES_VD4F4GKSLTNZ}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Vbrhdsvzlyw5"
      component={MainVbrhdsvzlyw5}
      durationInFrames={TOTAL_FRAMES_VBRHDSVZLYW5}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
