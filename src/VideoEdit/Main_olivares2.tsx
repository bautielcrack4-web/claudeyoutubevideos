// Main_olivares2.tsx — GENERADO por build_olivares2.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS, TOTAL_FRAMES_OLIVARES2 } from "./cues_olivares2.gen";
import { OlivAvatar } from "../olivares2/Piezas";

export const MainOlivares2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0C1412" }}>
    {/* L0 · el avatar REAL es el fondo garantizado de TODO el video (base FULL, regla anti-hueco).
        Dura los 29:25 completos, así que no hace falta bucle ni hay costuras que tapar.
        OffthreadVideo SIEMPRE: <Video> sirve cuadros equivocados en el render. */}
    <OlivAvatar src="olivares2_opt.mp4" />

    {/* L1 · b-roll opaco encima */}
    {CUES.map((c) => (
      <Sequence key={c.key} from={c.from} durationInFrames={c.dur} layout="none">
        <AbsoluteFill>{c.el()}</AbsoluteFill>
      </Sequence>
    ))}

    {/* L2 · componentes del kit, con su CAMA de foto debajo (si no, el marco muestra el fondo plano) */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={o.from} durationInFrames={o.dur} layout="none">
        <AbsoluteFill>
          <Img src={staticFile(o.cama)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {o.el(o.dur)}
        </AbsoluteFill>
      </Sequence>
    ))}

    {/* UN solo <Audio> con el máster. El avatar va muteado. */}
    <Audio src={staticFile("olivares2.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_OLIVARES2 };
