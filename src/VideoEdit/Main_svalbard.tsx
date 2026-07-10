import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONT_STACK, sec } from "./theme";
import { TitleCardKit } from "./kit/TitleCardKit";
import { ClosingCardKit } from "./kit/ClosingCardKit";
import data from "./svalbard_beats.json";

// ── SVALBARD — video de PRUEBA end-to-end del pipeline en la nube (jul 2026) ──
// Guion inventado, narración Chatterbox vía tts.yml (CPU), timestamps exactos
// vía align.yml (CPU), fotos reales CC/CC0 (Wikimedia) vía fetch_real.mjs.
// Estructura simple a propósito: TitleCardKit (intro) -> beats (foto Ken-Burns +
// captions karaoke, igual patrón que Main_cafe.tsx) -> ClosingCardKit (cierre).

const FPS = 30;
const ms2f = (ms: number) => Math.round((ms / 1000) * FPS);

type Word = { t: string; s: number; e: number };
type Beat = { img: string; startMs: number; endMs: number; words: Word[] };
const BEATS = (data as any).beats as Beat[];
const AUDIO_END = (data as any).audioEnd as number;

const INTRO_SEC = 3.5;
const OUTRO_SEC = 4.5;
export const TOTAL_FRAMES_SVB = ms2f(AUDIO_END) + sec(INTRO_SEC) + sec(OUTRO_SEC);

// foto full-bleed con Ken-Burns suave (mismo patrón que Main_cafe.tsx)
const KenBurnsPhoto: React.FC<{ beat: Beat; durF: number; seed: number }> = ({ beat, durF, seed }) => {
  const f = useCurrentFrame();
  const op = Math.min(
    interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [durF - 8, durF], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const p = f / durF;
  const zoomIn = seed % 2 === 0;
  const scale = zoomIn ? interpolate(p, [0, 1], [1.0, 1.08]) : interpolate(p, [0, 1], [1.08, 1.0]);
  const panX = interpolate(p, [0, 1], [seed % 3 === 0 ? -1.2 : 1.2, 0]);
  return (
    <AbsoluteFill style={{ opacity: op, backgroundColor: "#000" }}>
      <Img src={staticFile(beat.img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${panX}%) scale(${scale})` }} />
    </AbsoluteFill>
  );
};

// captions karaoke: la frase del beat actual, palabra activa resaltada al ms exacto de whisper
const Captions: React.FC<{ introOffsetMs: number }> = ({ introOffsetMs }) => {
  const f = useCurrentFrame();
  const ms = (f / FPS) * 1000 - introOffsetMs;
  const beat = BEATS.find((b) => ms >= b.startMs && ms < b.endMs);
  if (!beat || !beat.words.length) return null;
  const clean = (s: string) => s.replace(/^[¿¡"]+|["?!.,;:]+$/g, "");
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90 }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 320, background: "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0))" }} />
      <div style={{ position: "relative", maxWidth: 1450, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 16px", fontFamily: FONT_STACK, fontSize: 52, lineHeight: 1.25, padding: "0 60px" }}>
        {beat.words.map((w, i) => {
          const active = ms >= w.s && ms < w.e;
          const seen = ms >= w.s;
          return (
            <span key={i} style={{ color: active ? COLORS.amber : seen ? "#FFFFFF" : "rgba(255,255,255,0.45)", transform: active ? "translateY(-3px) scale(1.06)" : "none", fontWeight: 600, display: "inline-block", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
              {clean(w.t)}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const MainSvalbard: React.FC = () => {
  const introF = sec(INTRO_SEC);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={0} durationInFrames={introF}>
        <TitleCardKit
          durationInFrames={introF}
          eyebrow="ARCTIC CIRCLE"
          title="Longyearbyen"
          subtitle="The town where you're not allowed to die"
        />
      </Sequence>

      <Sequence from={introF} durationInFrames={ms2f(AUDIO_END)}>
        <AbsoluteFill>
          {BEATS.map((b, i) => {
            const from = ms2f(b.startMs);
            const durF = Math.max(1, ms2f(b.endMs) - ms2f(b.startMs));
            return (
              <Sequence key={i} from={from} durationInFrames={durF}>
                <KenBurnsPhoto beat={b} durF={durF} seed={i + 1} />
              </Sequence>
            );
          })}
          <Captions introOffsetMs={0} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={introF + ms2f(AUDIO_END)} durationInFrames={sec(OUTRO_SEC)}>
        <ClosingCardKit
          durationInFrames={sec(OUTRO_SEC)}
          heading="Svalbard"
          subtitle="A pipeline test — Claude Code + video2"
          cta="claudeyoutubevideos"
        />
      </Sequence>

      {/* narración: arranca después del cartón de apertura */}
      <Sequence from={introF}>
        <Audio src={staticFile("svalbard.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
