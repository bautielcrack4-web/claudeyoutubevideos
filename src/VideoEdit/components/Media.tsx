import { CSSProperties } from "react";
import { Img, OffthreadVideo, staticFile } from "remotion";

// <Media> — drop-in para cualquier "foto real" de b-roll. Decide solo entre
// <Img> (png/jpg de public/img) y <OffthreadVideo> (mp4 de public/vid, generado
// con gen_video.mjs / LTX). Así cualquier escena que aceptaba una imagen ahora
// acepta también un clip: pasás "vid/estepa_pan.mp4" en vez de "img/estepa.png".
//
// - src: ruta RELATIVA dentro de public/ (sin staticFile; lo aplica adentro).
// - style: se respeta tal cual (objectFit, filter blur/sepia, etc.).
// - los clips van muted (b-roll sin audio).
// - CÁMARA LENTA por defecto (speed=0.6): los clips de LTX son cortos (2-4s) y
//   se ven mejor ralentizados — el movimiento queda suave y "dura" más en la
//   escena. playbackRate<1 = slow-mo (un clip de 4s a 0.6 rinde ~6.6s de timeline).
//   Subí speed a 1 por clip si querés velocidad real.
const VIDEO_RE = /\.(mp4|webm|mov)$/i;

export const isVideoSrc = (src?: string) => !!src && VIDEO_RE.test(src);

export const Media: React.FC<{
  src: string;
  style?: CSSProperties;
  muted?: boolean;
  speed?: number; // playbackRate del clip; <1 = cámara lenta (default 0.6)
}> = ({ src, style, muted = true, speed = 0.6 }) => {
  if (VIDEO_RE.test(src)) {
    return <OffthreadVideo src={staticFile(src)} style={style} muted={muted} playbackRate={speed} />;
  }
  return <Img src={staticFile(src)} style={style} />;
};
