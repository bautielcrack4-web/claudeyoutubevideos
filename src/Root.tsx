import "./index.css";
import { Composition } from "remotion";
import { MainEstiercol, TOTAL_FRAMES_EST } from "./VideoEdit/Main_estiercol";
import { MainWasp, TOTAL_FRAMES_WASP } from "./VideoEdit/Main_wasp";
import { MainTick, TOTAL_FRAMES_TICK } from "./VideoEdit/Main_tick";
import { MainMeriendas, TOTAL_FRAMES_MER } from "./VideoEdit/Main_meriendas";

// ── SOLO los videos ACTIVOS quedan registrados ──
// Las composiciones viejas (Fly, Hipos, Bisontes, Objetos, Civil, Top7Demo,
// Mograph, MographShowcase, etc.) quedan DESREGISTRADAS para que Studio no las
// cargue ni tire 404 de audios que ya no están en disco. Sus archivos siguen en
// src/VideoEdit/ — para reactivar una, volvé a importarla y agregá su <Composition>.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* VIDEO ACTIVO — KILL EVERY Wasp On Your Property (The Amish Way) */}
      <Composition
        id="Wasp"
        component={MainWasp}
        durationInFrames={TOTAL_FRAMES_WASP}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — KILL EVERY Tick On Your Land (The Amish Way · $4 Powder) */}
      <Composition
        id="Tick"
        component={MainTick}
        durationInFrames={TOTAL_FRAMES_TICK}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* VIDEO ACTIVO — 25 Meriendas Caseras Que Ya Nadie Prepara (voz anciana, faceless) */}
      <Composition
        id="Meriendas"
        component={MainMeriendas}
        durationInFrames={TOTAL_FRAMES_MER}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Reviví tu tierra muerta con $1 (estiércol, bajo esfuerzo) */}
      <Composition
        id="Estiercol"
        component={MainEstiercol}
        durationInFrames={TOTAL_FRAMES_EST}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
