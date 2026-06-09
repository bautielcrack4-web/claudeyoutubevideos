import React from "react";

// Articulated stick-figure rig (white-background "doodle" style).
// Clean, confident ink lines (no nervous "boil" by default), an expressive head
// with optional glasses / tie / eyebrows, neat hair, real hands and knees.
// Parametric limbs via trig so any pose is reachable from props.

export type HandKind = "open" | "fist" | "point";
export type Hair = "neat" | "messy" | "none";

export type Pose = {
  width?: number;
  scale?: number;
  lean?: number;
  // Arms: swing = deg raised from hanging-straight-down, bend = elbow curl.
  lSwing?: number;
  lBend?: number;
  rSwing?: number;
  rBend?: number;
  lHand?: HandKind;
  rHand?: HandKind;
  // Legs: hip swing + knee bend.
  lLegSwing?: number;
  rLegSwing?: number;
  lKnee?: number;
  rKnee?: number;
  mouth?: number; // 0 smile -> 1 open
  frown?: number; // 0 none -> 1 sad/worried (overrides smile downward)
  brows?: number; // -1 worried(up-inner) .. 0 neutral .. 1 angry(down-inner)
  blink?: number;
  // Look-and-feel
  hair?: Hair;
  glasses?: boolean;
  tie?: string | false; // tie color, e.g. C.green
  boil?: boolean; // hand-drawn wobble (default off = clean lines)
  frame: number;
};

const INK = "#1A1A1A";
const SKIN = "#FFFFFF";

// Two-segment limb. Returns elbow/wrist points + forearm angle (for hands).
function limb(
  sx: number,
  sy: number,
  baseAngleDeg: number,
  bendDeg: number,
  side: 1 | -1,
  upperLen: number,
  foreLen: number,
) {
  const a1 = (baseAngleDeg * Math.PI) / 180;
  const ex = sx + Math.cos(a1) * upperLen;
  const ey = sy + Math.sin(a1) * upperLen;
  const a2 = a1 - (side * bendDeg * Math.PI) / 180;
  const hx = ex + Math.cos(a2) * foreLen;
  const hy = ey + Math.sin(a2) * foreLen;
  return { ex, ey, hx, hy, a2, d: `M${sx},${sy} L${ex},${ey} L${hx},${hy}` };
}

function Hand({ x, y, ang, kind }: { x: number; y: number; ang: number; kind: HandKind }) {
  if (kind === "open") {
    return <circle cx={x} cy={y} r={11} fill={SKIN} stroke={INK} strokeWidth={6} />;
  }
  const fx = x + Math.cos(ang) * 24;
  const fy = y + Math.sin(ang) * 24;
  return (
    <g>
      {kind === "point" && (
        <line x1={x} y1={y} x2={fx} y2={fy} stroke={INK} strokeWidth={9} strokeLinecap="round" />
      )}
      <circle cx={x} cy={y} r={13} fill={SKIN} stroke={INK} strokeWidth={6} />
    </g>
  );
}

// Everything drawn twice: a fat PAPER pass for the sticker halo, then INK on top.
const Skeleton: React.FC<Pose & { stroke: string; pad: number; faces: boolean }> = ({
  stroke,
  pad,
  faces,
  lSwing = 8,
  lBend = 14,
  rSwing = 8,
  rBend = 14,
  lHand = "open",
  rHand = "open",
  lLegSwing = 16,
  rLegSwing = 16,
  lKnee = 10,
  rKnee = 10,
  mouth = 0,
  frown = 0,
  brows = 0,
  blink = 0,
  hair = "neat",
  glasses = false,
  tie = false,
}) => {
  const SHX = 150;
  const SHY = 196;
  const HX = 150;
  const HY = 338;

  const rArm = limb(SHX, SHY, 90 - rSwing, rBend, 1, 60, 56);
  const lArm = limb(SHX, SHY, 90 + lSwing, lBend, -1, 60, 56);
  const rLeg = limb(HX, HY, 90 - rLegSwing, rKnee, 1, 78, 78);
  const lLeg = limb(HX, HY, 90 + lLegSwing, lKnee, -1, 78, 78);

  const sw = 9 + pad;
  // mouth shape: smile by default, can morph to frown
  const mc = 112 + frown * 14; // baseline y
  const curve = (1 - frown * 2) * 14; // positive = smile, negative = frown
  const smilePath = `M120,${mc} Q150,${mc + curve} 180,${mc}`;

  const HEADCX = 150, HEADCY = 96, HRX = 60, HRY = 64;

  return (
    <g fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {/* legs + little feet */}
      <path d={lLeg.d} />
      <path d={rLeg.d} />
      <path d={`M${lLeg.hx},${lLeg.hy} l-22,2`} />
      <path d={`M${rLeg.hx},${rLeg.hy} l22,2`} />
      {/* spine */}
      <path d={`M${SHX},${SHY - 26} L${HX},${HY}`} />
      {/* arms */}
      <path d={lArm.d} />
      <path d={rArm.d} />

      {/* tie (drawn on the chest, under the head) */}
      {faces && tie && (
        <g stroke="none">
          <path d={`M${SHX - 9},${SHY - 18} L${SHX + 9},${SHY - 18} L${SHX},${SHY - 4} Z`} fill={tie} />
          <path d={`M${SHX - 11},${SHY + 2} L${SHX + 11},${SHY + 2} L${SHX + 7},${SHY + 46} L${SHX},${SHY + 56} L${SHX - 7},${SHY + 46} Z`} fill={tie} />
        </g>
      )}

      {/* head */}
      <ellipse cx={HEADCX} cy={HEADCY} rx={HRX} ry={HRY} fill={faces ? SKIN : stroke} />

      {/* hands on top of body */}
      <Hand x={lArm.hx} y={lArm.hy} ang={lArm.a2} kind={lHand} />
      <Hand x={rArm.hx} y={rArm.hy} ang={rArm.a2} kind={rHand} />

      {faces && (
        <g>
          {/* hair */}
          {hair === "neat" && (
            <path
              d="M92,74 C88,42 116,26 150,26 C184,26 212,42 208,74 C198,52 176,44 150,44 C124,44 102,52 92,74 Z"
              fill={INK}
              stroke="none"
            />
          )}
          {hair === "messy" && (
            <path
              d="M90,76 C92,40 120,18 150,22 C158,8 176,10 182,24 C200,22 214,40 210,70 C204,52 192,48 184,60 C178,42 162,40 154,54 C146,38 126,40 120,56 C112,44 98,52 90,76 Z"
              fill={INK}
              stroke="none"
            />
          )}

          {/* eyebrows (expression) */}
          {brows !== 0 && (
            <g stroke={INK} strokeWidth={6} strokeLinecap="round">
              <line x1={120} y1={brows > 0 ? 76 : 72} x2={142} y2={brows > 0 ? 72 : 78} />
              <line x1={158} y1={brows > 0 ? 72 : 78} x2={180} y2={brows > 0 ? 76 : 72} />
            </g>
          )}

          {/* eyes */}
          {blink > 0.5 ? (
            <>
              <path d="M120,92 q12,8 24,0" stroke={INK} strokeWidth={6} fill="none" />
              <path d="M156,92 q12,8 24,0" stroke={INK} strokeWidth={6} fill="none" />
            </>
          ) : (
            <>
              <circle cx={132} cy={92} r={8} fill={INK} stroke="none" />
              <circle cx={168} cy={92} r={8} fill={INK} stroke="none" />
            </>
          )}

          {/* glasses */}
          {glasses && (
            <g stroke={INK} strokeWidth={5} fill="none">
              <circle cx={132} cy={92} r={17} fill="#ffffff" fillOpacity={0.15} />
              <circle cx={168} cy={92} r={17} fill="#ffffff" fillOpacity={0.15} />
              <line x1={149} y1={92} x2={151} y2={92} />
              <line x1={115} y1={90} x2={104} y2={86} />
              <line x1={185} y1={90} x2={196} y2={86} />
            </g>
          )}

          {/* mouth */}
          <path d={smilePath} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
          {mouth > 0.05 && frown < 0.3 && (
            <ellipse cx={150} cy={118} rx={15} ry={4 + mouth * 11} fill={INK} stroke="none" />
          )}
        </g>
      )}
    </g>
  );
};

export const StickFigure: React.FC<Pose> = (props) => {
  const { width = 300, scale = 1, lean = 0, frame, boil = false } = props;
  const HX = 150;
  const HY = 338;
  const seed = Math.floor(frame / 5) % 8;

  const inner = (
    <g
      transform={`translate(10 10) rotate(${lean} ${HX} ${HY}) scale(${scale})`}
      style={{ transformOrigin: `${HX}px ${HY}px` }}
      {...(boil ? { filter: `url(#boil${seed})` } : {})}
    >
      <Skeleton {...props} stroke="#FBFBF8" pad={9} faces={false} />
      <Skeleton {...props} stroke={INK} pad={0} faces />
    </g>
  );

  return (
    <svg
      width={width}
      height={(width / 320) * 560}
      viewBox="0 0 320 560"
      style={{ overflow: "visible" }}
    >
      {boil && (
        <defs>
          <filter id={`boil${seed}`} x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={2} seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={1.6} />
          </filter>
        </defs>
      )}
      {inner}
    </svg>
  );
};

// Tiny shoulder buddy: angel (halo + wings) or devil (horns + tail).
export const MiniBuddy: React.FC<{ variant: "angel" | "devil"; width?: number; frame: number }> = ({
  variant,
  width = 120,
}) => {
  const red = "#E63329";
  return (
    <svg width={width} height={(width / 200) * 240} viewBox="0 0 200 240" style={{ overflow: "visible" }}>
      <g fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
        {variant === "angel" ? (
          <>
            <ellipse cx={100} cy={28} rx={34} ry={11} stroke="#E8B400" strokeWidth={7} />
            <path d="M70,120 C30,100 28,150 64,150" />
            <path d="M130,120 C170,100 172,150 136,150" />
          </>
        ) : (
          <>
            <path d="M74,52 L62,22 L86,46" fill={red} stroke={red} />
            <path d="M126,52 L138,22 L114,46" fill={red} stroke={red} />
            <path d="M132,170 C168,178 168,210 150,214" stroke={red} />
            <path d="M150,214 l12,-8 m-12,8 l10,10" stroke={red} />
          </>
        )}
        <ellipse cx={100} cy={70} rx={36} ry={38} fill="#FFFFFF" />
        <path d="M100,108 L100,180" />
        <path d="M100,130 L72,160" />
        <path d="M100,130 L128,160" />
        <path d="M100,180 L80,224" />
        <path d="M100,180 L120,224" />
        <circle cx={88} cy={66} r={5} fill={INK} stroke="none" />
        <circle cx={112} cy={66} r={5} fill={INK} stroke="none" />
        <path d="M84,82 q16,12 32,0" strokeWidth={5} />
      </g>
    </svg>
  );
};
