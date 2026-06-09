import React from "react";

// Articulated stick-figure rig (white-background "doodle" style).
// Parametric limbs with real hands, knees + feet, an expressive head, and a
// white "sticker" outline. A gentle feTurbulence gives the hand-drawn line boil.

export type HandKind = "open" | "fist" | "point";

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
  blink?: number;
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

function Hand({
  x,
  y,
  ang,
  kind,
}: {
  x: number;
  y: number;
  ang: number;
  kind: HandKind;
}) {
  if (kind === "open") {
    return <circle cx={x} cy={y} r={11} fill={SKIN} stroke={INK} strokeWidth={6} />;
  }
  // fist + optional pointing finger along the forearm direction
  const fx = x + Math.cos(ang) * 22;
  const fy = y + Math.sin(ang) * 22;
  return (
    <g>
      {kind === "point" && (
        <line x1={x} y1={y} x2={fx} y2={fy} stroke={INK} strokeWidth={9} strokeLinecap="round" />
      )}
      <circle cx={x} cy={y} r={14} fill={SKIN} stroke={INK} strokeWidth={6} />
      {/* knuckle hint */}
      <path d={`M${x - 8},${y - 4} q8,-7 16,0`} fill="none" stroke={INK} strokeWidth={3} />
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
  blink = 0,
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
  const smileY = 120 - mouth * 4;

  return (
    <g
      fill="none"
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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

      {/* head */}
      <ellipse cx={150} cy={96} rx={62} ry={66} fill={faces ? SKIN : stroke} />

      {/* hands (drawn after head so they sit on top of body) */}
      <Hand x={lArm.hx} y={lArm.hy} ang={lArm.a2} kind={lHand} />
      <Hand x={rArm.hx} y={rArm.hy} ang={rArm.a2} kind={rHand} />

      {faces && (
        <g>
          {/* hair — spiky scribble */}
          <path
            d="M90,76 C92,40 120,18 150,22 C158,8 176,10 182,24 C200,22 214,40 210,70 C204,52 192,48 184,60 C178,42 162,40 154,54 C146,38 126,40 120,56 C112,44 98,52 90,76 Z"
            fill={INK}
            stroke="none"
          />
          {/* eyes */}
          {blink > 0.5 ? (
            <>
              <path d="M120,90 q14,8 28,0" stroke={INK} strokeWidth={6} fill="none" />
              <path d="M156,90 q14,8 28,0" stroke={INK} strokeWidth={6} fill="none" />
            </>
          ) : (
            <>
              <circle cx={130} cy={92} r={8} fill={INK} stroke="none" />
              <circle cx={172} cy={92} r={8} fill={INK} stroke="none" />
            </>
          )}
          {/* smile */}
          <path d={`M120,112 Q150,${smileY + 12} 180,112`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
          {mouth > 0.05 && (
            <ellipse cx={150} cy={118} rx={16} ry={4 + mouth * 11} fill={INK} stroke="none" />
          )}
        </g>
      )}
    </g>
  );
};

export const StickFigure: React.FC<Pose> = (props) => {
  const { width = 300, scale = 1, lean = 0, frame } = props;
  const HX = 150;
  const HY = 338;
  const seed = Math.floor(frame / 5) % 8;

  return (
    <svg
      width={width}
      height={(width / 320) * 560}
      viewBox="0 0 320 560"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id={`boil${seed}`} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={2} seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={2.4} />
        </filter>
      </defs>
      <g
        filter={`url(#boil${seed})`}
        transform={`translate(10 10) rotate(${lean} ${HX} ${HY}) scale(${scale})`}
        style={{ transformOrigin: `${HX}px ${HY}px` }}
      >
        {/* sticker halo pass */}
        <Skeleton {...props} stroke="#FBFBF8" pad={9} faces={false} />
        {/* ink pass */}
        <Skeleton {...props} stroke={INK} pad={0} faces />
      </g>
    </svg>
  );
};

// Tiny shoulder buddy: angel (halo + wings) or devil (horns + tail).
export const MiniBuddy: React.FC<{
  variant: "angel" | "devil";
  width?: number;
  frame: number;
}> = ({ variant, width = 120, frame }) => {
  const seed = Math.floor(frame / 6) % 8;
  const red = "#E63329";
  return (
    <svg width={width} height={(width / 200) * 240} viewBox="0 0 200 240" style={{ overflow: "visible" }}>
      <defs>
        <filter id={`mb${variant}${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={2} />
        </filter>
      </defs>
      <g
        filter={`url(#mb${variant}${seed})`}
        fill="none"
        stroke={INK}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {variant === "angel" ? (
          <>
            {/* halo */}
            <ellipse cx={100} cy={28} rx={34} ry={11} stroke="#E8B400" strokeWidth={7} />
            {/* wings */}
            <path d="M70,120 C30,100 28,150 64,150" />
            <path d="M130,120 C170,100 172,150 136,150" />
          </>
        ) : (
          <>
            {/* horns */}
            <path d="M74,52 L62,22 L86,46" fill={red} stroke={red} />
            <path d="M126,52 L138,22 L114,46" fill={red} stroke={red} />
            {/* tail */}
            <path d="M132,170 C168,178 168,210 150,214" stroke={red} />
            <path d="M150,214 l12,-8 m-12,8 l10,10" stroke={red} />
          </>
        )}
        {/* head */}
        <ellipse cx={100} cy={70} rx={36} ry={38} fill="#FFFFFF" />
        {/* body */}
        <path d="M100,108 L100,180" />
        <path d="M100,130 L72,160" />
        <path d="M100,130 L128,160" />
        <path d="M100,180 L80,224" />
        <path d="M100,180 L120,224" />
        {/* face */}
        <circle cx={88} cy={66} r={5} fill={INK} stroke="none" />
        <circle cx={112} cy={66} r={5} fill={INK} stroke="none" />
        <path d="M84,82 q16,12 32,0" strokeWidth={5} />
      </g>
    </svg>
  );
};
