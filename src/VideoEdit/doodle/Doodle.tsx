import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadPatrick } from "@remotion/google-fonts/PatrickHand";
import { StickFigure, MiniBuddy } from "./StickFigure";

const { fontFamily: CAVEAT } = loadCaveat();
const { fontFamily: HAND } = loadPatrick();

const INK = "#1A1A1A";
const RED = "#E63329";
const GREEN = "#3FA34D";
const PAPER = "#FBFBF8";

export const SCENE = 90;
export const FADE = 14;
export const DOODLE_FRAMES = SCENE * 3 - FADE * 2;

// Hand-written underline that draws itself in.
const Underline: React.FC<{ progress: number; w: number; color?: string }> = ({
  progress,
  w,
  color = INK,
}) => {
  const len = 600;
  return (
    <svg width={w} height={26} viewBox="0 0 600 26" style={{ overflow: "visible" }}>
      <path
        d="M6,16 C140,4 320,24 480,10 C540,5 580,12 594,14"
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - progress)}
      />
    </svg>
  );
};

// ---------- SCENE 1: HOOK ----------
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = spring({ frame, fps, config: { damping: 14, mass: 0.7 } });
  const figY = interpolate(rise, [0, 1], [180, 0]);
  // friendly wave on the right arm
  const wave = Math.sin(frame / 4) * 28;
  const titleIn = spring({ frame: frame - 16, fps, config: { damping: 16 } });
  const ulProg = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div
        style={{
          position: "absolute",
          top: 150,
          width: "100%",
          textAlign: "center",
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [40, 0])}px)`,
        }}
      >
        <div style={{ fontFamily: CAVEAT, fontSize: 120, color: INK, fontWeight: 700 }}>
          The Math Isn't <span style={{ color: RED }}>Mathing</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: -6 }}>
          <Underline progress={ulProg} w={760} color={RED} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 20,
          transform: `translate(-50%, ${figY}px)`,
        }}
      >
        <StickFigure
          width={360}
          frame={frame}
          rSwing={120}
          rBend={wave}
          rHand="open"
          lSwing={6}
          lBend={18}
          lHand="open"
          mouth={0.4 + Math.sin(frame / 6) * 0.3}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 2: BAR CHART ----------
const Bar: React.FC<{
  x: number;
  full: number;
  grow: number;
  color: string;
  hatch?: boolean;
  label: string;
  value: string;
}> = ({ x, full, grow, color, hatch, label, value }) => {
  const baseY = 620;
  const h = full * grow;
  const w = 120;
  return (
    <g>
      {hatch && (
        <defs>
          <pattern
            id={`h${x}`}
            width={12}
            height={12}
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <rect width={12} height={12} fill="#FFFFFF" />
            <line x1={0} y1={0} x2={0} y2={12} stroke={color} strokeWidth={6} />
          </pattern>
        </defs>
      )}
      <rect
        x={x}
        y={baseY - h}
        width={w}
        height={h}
        fill={hatch ? `url(#h${x})` : color}
        stroke={INK}
        strokeWidth={4}
        rx={3}
      />
      <text
        x={x + w / 2}
        y={baseY - h - 16}
        textAnchor="middle"
        fontFamily={HAND}
        fontSize={38}
        fill={INK}
        opacity={grow > 0.85 ? 1 : 0}
      >
        {value}
      </text>
      <text
        x={x + w / 2}
        y={baseY + 44}
        textAnchor="middle"
        fontFamily={HAND}
        fontSize={34}
        fill={INK}
      >
        {label}
      </text>
    </g>
  );
};

const SceneChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const g1 = spring({ frame: frame - 8, fps, config: { damping: 16, mass: 0.8 } });
  const g2 = spring({ frame: frame - 20, fps, config: { damping: 16, mass: 0.8 } });
  const axis = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const bubble = spring({ frame: frame - 52, fps, config: { damping: 11, mass: 0.6 } });

  const titleIn = spring({ frame, fps, config: { damping: 16 } });

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div
        style={{
          position: "absolute",
          top: 60,
          width: "100%",
          textAlign: "center",
          fontFamily: CAVEAT,
          fontSize: 80,
          fontWeight: 700,
          color: INK,
          opacity: titleIn,
        }}
      >
        OpenAI: Valuation vs Revenue
      </div>

      <svg
        width={1100}
        height={760}
        viewBox="0 0 1100 760"
        style={{ position: "absolute", left: 120, top: 150 }}
      >
        {/* axis */}
        <line
          x1={120}
          y1={620}
          x2={120 + 760 * axis}
          y2={620}
          stroke={INK}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <Bar
          x={240}
          full={460}
          grow={g1}
          color={GREEN}
          label="Valuation"
          value="$850B"
        />
        <Bar
          x={520}
          full={60}
          grow={g2}
          color={GREEN}
          hatch
          label="Revenue"
          value="$24B"
        />
      </svg>

      {/* multiplier speech bubble */}
      <div
        style={{
          position: "absolute",
          left: 250,
          top: 470,
          transform: `scale(${bubble})`,
          transformOrigin: "center",
        }}
      >
        <div
          style={{
            background: "#FFF4D6",
            border: `4px solid ${INK}`,
            borderRadius: 40,
            padding: "10px 34px",
            fontFamily: HAND,
            fontSize: 56,
            color: RED,
            fontWeight: 700,
          }}
        >
          ~35x 🤯
        </div>
      </div>

      {/* figure pointing at the chart */}
      <div style={{ position: "absolute", right: 80, bottom: 10 }}>
        <StickFigure
          width={340}
          frame={frame}
          lSwing={150}
          lBend={interpolate(g1, [0, 1], [60, 8])}
          lHand="point"
          rSwing={10}
          rBend={16}
          rHand="open"
          mouth={0.3 + Math.sin(frame / 5) * 0.25}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 3: PUNCHLINE ----------
const ScenePunch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const word2 = spring({ frame: frame - 14, fps, config: { damping: 12, mass: 0.6 } });
  const shake = frame > 28 ? Math.sin(frame / 1.5) * (4 * Math.max(0, 1 - (frame - 28) / 30)) : 0;
  const ulProg = interpolate(frame, [30, 56], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 300,
          transform: `translateX(${shake}px)`,
        }}
      >
        <div style={{ fontFamily: CAVEAT, fontSize: 200, fontWeight: 700, color: INK, lineHeight: 0.9 }}>
          <span style={{ display: "inline-block", transform: `scale(${pop})`, transformOrigin: "left" }}>
            It's a
          </span>
          <br />
          <span style={{ display: "inline-block", transform: `scale(${word2})`, transformOrigin: "left", color: RED }}>
            Bubble.
          </span>
        </div>
        <Underline progress={ulProg} w={620} color={RED} />
      </div>

      {/* figure with angel + devil on the shoulders (the FOMO decision) */}
      <div style={{ position: "absolute", right: 120, bottom: 10 }}>
        <div style={{ position: "relative" }}>
          <StickFigure
            width={380}
            frame={frame}
            lSwing={150}
            lBend={18}
            lHand="open"
            rSwing={150}
            rBend={18}
            rHand="open"
            lLegSwing={22}
            rLegSwing={22}
            lKnee={6}
            rKnee={6}
            mouth={interpolate(pop, [0, 1], [0.2, 1])}
          />
          <div
            style={{
              position: "absolute",
              left: -70,
              top: 150 + Math.sin(frame / 7) * 8,
              opacity: spring({ frame: frame - 22, fps, config: { damping: 12 } }),
            }}
          >
            <MiniBuddy variant="angel" frame={frame} width={130} />
          </div>
          <div
            style={{
              position: "absolute",
              right: -70,
              top: 150 + Math.sin(frame / 7 + 2) * 8,
              opacity: spring({ frame: frame - 30, fps, config: { damping: 12 } }),
            }}
          >
            <MiniBuddy variant="devil" frame={frame} width={130} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Doodle: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE}>
          <SceneHook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={linearTiming({ durationInFrames: FADE })} presentation={fade()} />
        <TransitionSeries.Sequence durationInFrames={SCENE}>
          <SceneChart />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={linearTiming({ durationInFrames: FADE })} presentation={fade()} />
        <TransitionSeries.Sequence durationInFrames={SCENE}>
          <ScenePunch />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
