// Canal Claudio Mendoza — VLOG CRUDO. Sin componentes, sin texto, sin subtítulos.
// Avatar PARCIAL: lipsync real 0..AVATAR_END, luego en bucle (tapado por planos).
// Cues generados por build_cmestacion.mjs. Ken-Burns aleatorio por plano (regla dura).
import React from "react";
import {Audio} from "@remotion/media";
import {AbsoluteFill, Img, Loop, OffthreadVideo, Sequence, staticFile, interpolate, random, useCurrentFrame, useVideoConfig} from "remotion";
import {CUES_CMESTACION, TOTAL_FRAMES_CMESTACION, AVATAR_FRAMES_CMESTACION} from "./cues_cmestacion.gen";

// Ken-Burns DISTINTO en cada plano: sentido/amplitud/origen/deriva al azar (determinista por seed).
const useKB = (seed: number, base: number, ampMax: number) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const r1 = random(seed * 1.7 + 11.3), r2 = random(seed * 3.1 + 37.7), r3 = random(seed * 5.3 + 71.1);
  const r4 = random(seed * 7.9 + 113.9), r5 = random(seed * 11.3 + 167.3);
  const acerca = r1 < 0.5;
  const amp = 0.045 + r2 * (ampMax - 0.045);
  const lo = base, hi = base + amp;
  const desde = acerca ? lo : hi, hasta = acerca ? hi : lo;
  const ox = 30 + r3 * 40, oy = 30 + r4 * 40;
  const techo = Math.min(ox, 100 - ox, oy, 100 - oy) * (Math.min(desde, hasta) - 1);
  const dMax = Math.min(1.2, Math.max(0, techo));
  const ang = r5 * Math.PI * 2;
  const k = interpolate(frame, [0, n], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const z = desde + (hasta - desde) * k;
  return {
    width: "100%", height: "100%", objectFit: "cover" as const,
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

// Avatar de fondo: bucle a lo largo de toda la comp, push lento (nunca estático).
const AvatarFloor: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = 1.02 + Math.sin(frame / 1300) * 0.008;
  return (
    <AbsoluteFill style={{backgroundColor: "#10120d", overflow: "hidden"}}>
      <Loop durationInFrames={AVATAR_FRAMES_CMESTACION}>
        <OffthreadVideo src={staticFile("cmestacion_opt.mp4")} muted style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale.toFixed(4)})`}} />
      </Loop>
    </AbsoluteFill>
  );
};

const Foto: React.FC<{src: string; seed: number}> = ({src, seed}) => (
  <AbsoluteFill style={{backgroundColor: "#10120d", overflow: "hidden"}}>
    <Img src={staticFile(src)} style={useKB(seed, 1.06, 0.12)} />
  </AbsoluteFill>
);

// Clip: NUNCA loop (repetiría el clip). Para cubrir un slot largo se RALENTIZA (piso 0,5×).
const Clip: React.FC<{src: string; rate: number; seed: number}> = ({src, rate, seed}) => (
  <AbsoluteFill style={{backgroundColor: "#10120d", overflow: "hidden"}}>
    <AbsoluteFill style={useKB(seed, 1.03, 0.05)}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{width: "100%", height: "100%", objectFit: "cover"}} />
    </AbsoluteFill>
  </AbsoluteFill>
);

// CTA: cuadro QUIETO (QR escaneable), sin Ken-Burns.
const CtaStill: React.FC<{src: string}> = ({src}) => (
  <AbsoluteFill style={{backgroundColor: "#10120d"}}>
    <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
  </AbsoluteFill>
);

export {TOTAL_FRAMES_CMESTACION};

export const MainCmestacion: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: "#10120d"}}>
    <AvatarFloor />
    {CUES_CMESTACION.map((c) => (
      <Sequence key={c.key} from={c.start} durationInFrames={c.dur} premountFor={30}>
        {c.kind === "clip" ? (
          <Clip src={c.src} rate={c.rate ?? 1} seed={c.seed} />
        ) : c.kind === "cta" ? (
          <CtaStill src={c.src} />
        ) : (
          <Foto src={c.src} seed={c.seed} />
        )}
      </Sequence>
    ))}
    <Audio src={staticFile("cmestacion.m4a")} />
  </AbsoluteFill>
);
