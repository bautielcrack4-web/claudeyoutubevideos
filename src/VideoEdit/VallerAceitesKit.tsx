import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const INK = "#071014";
const IVORY = "#F5F1E8";
const MINT = "#A8D5C6";
const GOLD = "#D8B56D";
const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

const rgba = (hex: string, alpha: number) => {
  const raw = hex.replace("#", "");
  const n = Number.parseInt(raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
};

const fade = (frame: number, duration: number, edge = 16) =>
  interpolate(frame, [0, edge, Math.max(edge + 1, duration - edge), duration], [0, 1, 1, 0], CLAMP);

export const VallerFilmLayers: React.FC<{accent?: string}> = ({accent = MINT}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: "none", overflow: "hidden"}}>
      <div
        style={{
          position: "absolute",
          left: ((frame * 2.4) % 2500) - 360,
          top: -300,
          width: 210,
          height: 1600,
          transform: "rotate(17deg)",
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,.09),transparent)",
          filter: "blur(26px)",
          mixBlendMode: "screen",
          opacity: 0.34,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.065,
          background:
            "repeating-radial-gradient(circle at 17% 29%,rgba(255,255,255,.34) 0 1px,transparent 1px 4px)",
          transform: `translate(${(frame * 7) % 90 - 90}px,${(frame * 11) % 90 - 90}px) scale(1.18)`,
          mixBlendMode: "soft-light",
        }}
      />
      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 170px rgba(0,0,0,.54), inset 0 -100px 130px rgba(0,0,0,.32), inset 0 2px 0 ${rgba(accent, 0.12)}`,
        }}
      />
    </AbsoluteFill>
  );
};

const Eyebrow: React.FC<{children: React.ReactNode; accent?: string; dark?: boolean}> = ({
  children,
  accent = MINT,
  dark = false,
}) => (
  <div style={{display: "flex", alignItems: "center", gap: 14}}>
    <span style={{width: 54, height: 3, borderRadius: 99, background: accent}} />
    <span
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 15,
        fontWeight: 850,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: dark ? "rgba(7,16,20,.62)" : "rgba(255,255,255,.72)",
      }}
    >
      {children}
    </span>
  </div>
);

const MediaMotion: React.FC<{
  src: string;
  type?: "image" | "video";
  duration: number;
  position?: string;
  startFrom?: number;
  dim?: number;
}> = ({src, type = "video", duration, position = "center", startFrom = 0, dim = 0.2}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, Math.max(1, duration - 1)], [0, 1], CLAMP);
  const style: React.CSSProperties = {
    position: "absolute",
    inset: -32,
    width: "calc(100% + 64px)",
    height: "calc(100% + 64px)",
    objectFit: "cover",
    objectPosition: position,
    transform: `translate3d(${(p - 0.5) * 30}px,${Math.sin(frame / 43) * 5}px,0) scale(${1.055 + p * 0.045})`,
    filter: "saturate(.82) contrast(1.08)",
  };
  return (
    <AbsoluteFill style={{overflow: "hidden", background: INK}}>
      {type === "image" ? (
        <Img src={staticFile(src)} style={style} />
      ) : (
        <OffthreadVideo src={staticFile(src)} muted startFrom={startFrom} style={style} />
      )}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg,rgba(3,8,10,${0.35 + dim}) 0%,rgba(3,8,10,${dim}) 48%,rgba(3,8,10,${0.25 + dim}) 100%),linear-gradient(180deg,rgba(3,7,10,.04),rgba(3,7,10,.5))`,
        }}
      />
    </AbsoluteFill>
  );
};

export const HookSkinContrast: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 95, mass: 0.95}, durationInFrames: 34});
  const divider = interpolate(frame, [6, 36], [16, 50], {...CLAMP, easing: EASE});
  const f = fade(frame, duration, 12);
  return (
    <AbsoluteFill style={{opacity: f, overflow: "hidden", background: INK}}>
      <MediaMotion src="broll/va_skin_dry_macro.mp4" duration={duration} position="center" dim={0.28} />
      <div
        style={{
          position: "absolute",
          left: `${divider}%`,
          top: 0,
          bottom: 0,
          width: 2,
          background: "linear-gradient(transparent,rgba(255,255,255,.78),transparent)",
          boxShadow: `0 0 32px ${rgba(MINT, 0.5)}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 110,
          bottom: 120,
          width: 820,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 65}px)`,
        }}
      >
        <Eyebrow accent={MINT}>La pregunta correcta</Eyebrow>
        <div style={{marginTop: 20, fontFamily: "Arial, sans-serif", fontSize: 82, fontWeight: 900, lineHeight: 0.94, letterSpacing: -4, color: "white"}}>
          ¿ARRUGAS…
          <br />
          <span style={{color: MINT}}>O PÉRDIDA DE AGUA?</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 85,
          padding: "13px 18px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,.18)",
          background: "rgba(4,10,13,.42)",
          backdropFilter: "blur(12px)",
          fontFamily: "Arial, sans-serif",
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: ".2em",
          color: "rgba(255,255,255,.72)",
        }}
      >
        DR. VALLER · PIEL MADURA
      </div>
      <VallerFilmLayers />
    </AbsoluteFill>
  );
};

export const KitchenPromise: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duration], [0, 1], CLAMP);
  const switcher = interpolate(frame, [duration * 0.43, duration * 0.57], [0, 1], CLAMP);
  const enter = interpolate(frame, [5, 30], [0, 1], {...CLAMP, easing: EASE});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: INK, overflow: "hidden"}}>
      <Img
        src={staticFile("img/va_oils_1_4.png")}
        style={{position: "absolute", inset: -40, width: 2000, height: 1160, objectFit: "cover", opacity: 1 - switcher, transform: `scale(${1.03 + p * 0.04}) translateX(${-18 + p * 28}px)`}}
      />
      <Img
        src={staticFile("img/va_oils_5_olive.png")}
        style={{position: "absolute", inset: -40, width: 2000, height: 1160, objectFit: "cover", opacity: switcher, transform: `scale(${1.06 - p * 0.025}) translateX(${20 - p * 30}px)`}}
      />
      <AbsoluteFill style={{background: "linear-gradient(90deg,rgba(3,8,11,.86),rgba(3,8,11,.18) 64%,rgba(3,8,11,.38))"}} />
      <div style={{position: "absolute", left: 112, top: 230, width: 750, opacity: enter, transform: `translateX(${(1 - enter) * -65}px)`}}>
        <Eyebrow accent={GOLD}>Probablemente ya están en tu cocina</Eyebrow>
        <div style={{marginTop: 22, fontFamily: "Arial, sans-serif", fontSize: 84, fontWeight: 900, lineHeight: 0.94, letterSpacing: -4, color: IVORY}}>
          SIETE ACEITES.
          <br />
          <span style={{color: GOLD}}>UNA REGLA CLAVE.</span>
        </div>
        <div style={{marginTop: 28, width: 620, fontFamily: "Georgia, serif", fontSize: 26, fontStyle: "italic", lineHeight: 1.35, color: "rgba(255,255,255,.72)"}}>
          El aceite ayuda a conservar la humedad. No reemplaza el agua.
        </div>
      </div>
      <VallerFilmLayers accent={GOLD} />
    </AbsoluteFill>
  );
};

export const TruthCard: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 4, fps, config: {damping: 18, stiffness: 105}, durationInFrames: 38});
  const line = interpolate(frame, [20, 65], [0, 1], {...CLAMP, easing: EASE});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: "radial-gradient(circle at 72% 28%,#23423f 0%,#071014 43%,#03080a 100%)", overflow: "hidden"}}>
      <OffthreadVideo
        src={staticFile("broll/va_light_oil.mp4")}
        muted
        style={{position: "absolute", right: -70, top: -20, width: 980, height: 1120, objectFit: "cover", opacity: 0.5, filter: "saturate(.7) contrast(1.15)", transform: `scale(${1.04 + frame / duration * 0.05})`}}
      />
      <AbsoluteFill style={{background: "linear-gradient(90deg,#061014 0%,rgba(6,16,20,.9) 42%,rgba(6,16,20,.18) 100%)"}} />
      <div style={{position: "absolute", left: 118, top: 208, width: 920, opacity: enter, transform: `translateY(${(1 - enter) * 70}px)`}}>
        <Eyebrow accent={MINT}>Verdad dermatológica</Eyebrow>
        <div style={{marginTop: 22, fontFamily: "Arial, sans-serif", fontSize: 78, fontWeight: 900, lineHeight: 0.98, letterSpacing: -3.6, color: "white"}}>
          NINGÚN ACEITE
          <br />
          <span style={{color: MINT}}>ELIMINA ARRUGAS.</span>
        </div>
        <div style={{marginTop: 32, width: 700, fontFamily: "Georgia, serif", fontSize: 28, fontStyle: "italic", lineHeight: 1.35, color: "rgba(255,255,255,.74)"}}>
          Pero una barrera mejor protegida puede verse más suave, flexible y luminosa.
        </div>
        <div style={{marginTop: 30, width: `${520 * line}px`, height: 5, borderRadius: 99, background: `linear-gradient(90deg,${MINT},transparent)`}} />
      </div>
      <VallerFilmLayers />
    </AbsoluteFill>
  );
};

const OILS = [
  {n: "01", name: "GIRASOL", tag: "Barrera y suavidad", note: "Rico en ácido linoleico", accent: "#F2C94C", plate: "img/va_oils_1_4.png", x: 13},
  {n: "02", name: "CÁRTAMO", tag: "Ligero y reparador", note: "Ideal para piel seca", accent: "#E88B46", plate: "img/va_oils_1_4.png", x: 38},
  {n: "03", name: "COCO VIRGEN", tag: "Oclusivo y nutritivo", note: "Mejor en zonas muy secas", accent: "#EDE4CF", plate: "img/va_oils_1_4.png", x: 62},
  {n: "04", name: "ARGÁN", tag: "Sedoso y antioxidante", note: "Unas gotas son suficientes", accent: "#D8A45A", plate: "img/va_oils_1_4.png", x: 87},
  {n: "05", name: "ALMENDRAS", tag: "Flexible y emoliente", note: "Haz prueba de parche", accent: "#C98B55", plate: "img/va_oils_5_olive.png", x: 13},
  {n: "06", name: "SEMILLA DE UVA", tag: "Textura muy ligera", note: "Buena opción para el día", accent: "#A48AD4", plate: "img/va_oils_5_olive.png", x: 38},
  {n: "07", name: "AGUACATE", tag: "Denso y nutritivo", note: "Para áreas ásperas", accent: "#99B96B", plate: "img/va_oils_5_olive.png", x: 63},
] as const;

export const SevenOilOrbit: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const appear = spring({frame, fps, config: {damping: 19, stiffness: 92}, durationInFrames: 40});
  const active = Math.min(6, Math.floor(interpolate(frame, [26, Math.max(27, duration - 24)], [0, 7], CLAMP)));
  const plateSwitch = interpolate(frame, [duration * 0.46, duration * 0.54], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: INK, overflow: "hidden", perspective: 1200}}>
      <Img src={staticFile("img/va_oils_1_4.png")} style={{position: "absolute", inset: -55, width: 2030, height: 1190, objectFit: "cover", opacity: 0.24 * (1 - plateSwitch), filter: "blur(12px) saturate(.8)", transform: `scale(1.1) translateX(${Math.sin(frame / 60) * 16}px)`}} />
      <Img src={staticFile("img/va_oils_5_olive.png")} style={{position: "absolute", inset: -55, width: 2030, height: 1190, objectFit: "cover", opacity: 0.24 * plateSwitch, filter: "blur(12px) saturate(.8)", transform: `scale(1.1) translateX(${Math.cos(frame / 57) * 16}px)`}} />
      <AbsoluteFill style={{background: "radial-gradient(circle at 50% 45%,rgba(37,82,76,.42),rgba(4,10,13,.92) 68%)"}} />
      <div style={{position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", opacity: appear}}>
        <Eyebrow accent={GOLD}><span style={{display: "inline-block", width: 530, textAlign: "center"}}>La lista completa</span></Eyebrow>
        <div style={{marginTop: 14, fontFamily: "Arial, sans-serif", fontSize: 56, fontWeight: 900, letterSpacing: -2.5, color: IVORY}}>7 ACEITES QUE SÍ TIENEN SENTIDO</div>
      </div>
      <div style={{position: "absolute", left: 95, right: 95, top: 250, height: 650, transformStyle: "preserve-3d"}}>
        {OILS.map((oil, index) => {
          const row = index < 4 ? 0 : 1;
          const col = row === 0 ? index : index - 4;
          const count = row === 0 ? 4 : 3;
          const w = 355;
          const gap = row === 0 ? 58 : 90;
          const totalW = count * w + (count - 1) * gap;
          const left = (1730 - totalW) / 2 + col * (w + gap);
          const isActive = index === active;
          const pulse = isActive ? 1 + Math.sin(frame / 8) * 0.012 : 1;
          return (
            <div
              key={oil.n}
              style={{
                position: "absolute",
                left,
                top: row * 322 + Math.sin((frame + index * 18) / 28) * (isActive ? 5 : 11),
                width: w,
                height: 260,
                borderRadius: 22,
                overflow: "hidden",
                opacity: appear * (isActive ? 1 : 0.52),
                transform: `translateZ(${isActive ? 120 : -40}px) rotateX(${row ? -4 : 4}deg) rotateY(${(col - (count - 1) / 2) * -3.5}deg) scale(${pulse})`,
                background: isActive ? IVORY : "rgba(12,22,25,.72)",
                border: `1px solid ${isActive ? rgba(oil.accent, 0.82) : "rgba(255,255,255,.1)"}`,
                boxShadow: isActive ? `0 34px 90px rgba(0,0,0,.64),0 0 50px ${rgba(oil.accent, 0.28)}` : "0 22px 55px rgba(0,0,0,.38)",
              }}
            >
              <div style={{position: "absolute", inset: 0, background: `radial-gradient(circle at 80% 20%,${rgba(oil.accent, isActive ? 0.28 : 0.12)},transparent 42%)`}} />
              <div style={{position: "absolute", left: 24, top: 21, fontFamily: "Arial, sans-serif", fontSize: 62, fontWeight: 950, color: isActive ? rgba(INK, 0.12) : "rgba(255,255,255,.1)"}}>{oil.n}</div>
              <div style={{position: "absolute", left: 24, right: 20, bottom: 26}}>
                <div style={{fontFamily: "Arial, sans-serif", fontSize: oil.name.length > 13 ? 26 : 31, fontWeight: 900, lineHeight: 1, color: isActive ? INK : "white"}}>{oil.name}</div>
                <div style={{marginTop: 12, fontFamily: "Georgia, serif", fontSize: 18, fontStyle: "italic", color: isActive ? "rgba(7,16,20,.64)" : "rgba(255,255,255,.56)"}}>{oil.tag}</div>
              </div>
            </div>
          );
        })}
      </div>
      <VallerFilmLayers accent={OILS[active].accent} />
    </AbsoluteFill>
  );
};

export const SkinBarrierExplainer: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 20, stiffness: 95}, durationInFrames: 42});
  const seal = interpolate(frame, [35, 95], [0, 1], {...CLAMP, easing: EASE});
  const escape = interpolate(frame, [18, Math.max(45, duration - 25)], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: "radial-gradient(circle at 60% 45%,#183934 0%,#071014 68%)", overflow: "hidden"}}>
      <div style={{position: "absolute", left: 110, top: 150, width: 650, opacity: enter, transform: `translateX(${(1 - enter) * -55}px)`}}>
        <Eyebrow accent={MINT}>Cómo funciona</Eyebrow>
        <div style={{marginTop: 20, fontFamily: "Arial, sans-serif", fontSize: 72, fontWeight: 900, lineHeight: 0.98, letterSpacing: -3.4, color: IVORY}}>LA BARRERA<br /><span style={{color: MINT}}>RETIENTE EL AGUA</span></div>
        <div style={{marginTop: 27, width: 560, fontFamily: "Georgia, serif", fontSize: 26, fontStyle: "italic", lineHeight: 1.4, color: "rgba(255,255,255,.68)"}}>El aceite crea una película fina sobre una piel que ya está hidratada.</div>
      </div>
      <div style={{position: "absolute", right: 105, top: 125, width: 850, height: 760, opacity: enter, transform: `translateX(${(1 - enter) * 80}px)`}}>
        <div style={{position: "absolute", left: 80, right: 50, bottom: 84, height: 305, borderRadius: "42px 42px 24px 24px", overflow: "hidden", boxShadow: "0 32px 90px rgba(0,0,0,.44)"}}>
          {["#E7B7A0", "#D99A82", "#B97163"].map((color, i) => (
            <div key={color} style={{position: "absolute", left: 0, right: 0, top: i * 102, height: 104, background: color, borderTop: "1px solid rgba(255,255,255,.22)"}}>
              {Array.from({length: 12}).map((_, j) => <span key={j} style={{position: "absolute", left: 18 + j * 64 + (i % 2) * 24, top: 24 + Math.sin(j * 2.1) * 11, width: 38, height: 22, borderRadius: "50%", background: "rgba(255,255,255,.1)"}} />)}
            </div>
          ))}
        </div>
        {Array.from({length: 8}).map((_, i) => {
          const y = 510 - ((escape * 430 + i * 69) % 480);
          return <div key={i} style={{position: "absolute", left: 165 + i * 73 + Math.sin((frame + i * 17) / 19) * 18, top: y, width: 25, height: 34, borderRadius: "55% 55% 65% 65%", transform: "rotate(45deg)", background: "#A9E6EA", boxShadow: "0 0 24px rgba(169,230,234,.48)", opacity: 0.72 * (1 - seal)}} />;
        })}
        <div style={{position: "absolute", left: 58, right: 27, bottom: 371, height: 32, borderRadius: 999, transformOrigin: "left center", transform: `scaleX(${seal})`, background: "linear-gradient(90deg,#D8B56D,#F3D99D,#D8B56D)", boxShadow: "0 0 42px rgba(216,181,109,.46)"}} />
        <div style={{position: "absolute", right: 30, top: 142, padding: "18px 22px", borderRadius: 18, background: "rgba(245,241,232,.94)", color: INK, fontFamily: "Arial, sans-serif", fontSize: 20, fontWeight: 850, opacity: seal}}>PELÍCULA LIPÍDICA</div>
        <div style={{position: "absolute", left: 76, bottom: 28, display: "flex", gap: 14}}>
          {["AGUA", "LÍPIDOS", "BARRERA"].map((x, i) => <div key={x} style={{padding: "12px 18px", borderRadius: 999, background: i === 2 ? MINT : "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 850, letterSpacing: ".14em", color: i === 2 ? INK : "white"}}>{x}</div>)}
        </div>
      </div>
      <VallerFilmLayers />
    </AbsoluteFill>
  );
};

export const OilHero: React.FC<{duration: number; index: number}> = ({duration, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const oil = OILS[index - 1];
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 92, mass: 0.9}, durationInFrames: 38});
  const p = interpolate(frame, [0, duration], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: INK, overflow: "hidden"}}>
      <Img src={staticFile(oil.plate)} style={{position: "absolute", inset: -42, width: 2004, height: 1164, objectFit: "cover", transform: `scale(${1.03 + p * 0.055}) translateX(${(p - 0.5) * 24}px)`, filter: "saturate(.88) contrast(1.08) brightness(.78)"}} />
      <AbsoluteFill style={{background: `radial-gradient(circle at ${oil.x}% 67%,${rgba(oil.accent, 0.32)},transparent 22%),linear-gradient(90deg,rgba(3,8,10,.28),rgba(3,8,10,.08) 48%,rgba(3,8,10,.72))`}} />
      <div style={{position: "absolute", left: `calc(${oil.x}% - 155px)`, bottom: 88, width: 310, height: 4, borderRadius: 99, background: oil.accent, boxShadow: `0 0 38px ${rgba(oil.accent, 0.74)}`, transform: `scaleX(${enter})`}} />
      <div style={{position: "absolute", right: 105, top: 190, width: 630, minHeight: 500, padding: "52px 56px", borderRadius: 30, background: "rgba(245,241,232,.96)", boxShadow: "0 42px 110px rgba(0,0,0,.55)", opacity: enter, transform: `translate3d(${(1 - enter) * 100}px,${Math.sin(frame / 32) * 3}px,0) rotateY(${(1 - enter) * -8}deg)`}}>
        <div style={{fontFamily: "Arial, sans-serif", fontSize: 116, lineHeight: 0.8, fontWeight: 950, color: rgba(oil.accent, 0.22)}}>{oil.n}</div>
        <div style={{marginTop: 30, fontFamily: "Arial, sans-serif", fontSize: oil.name.length > 13 ? 58 : 70, fontWeight: 950, lineHeight: 0.92, letterSpacing: -3, color: INK}}>{oil.name}</div>
        <div style={{marginTop: 23, fontFamily: "Georgia, serif", fontSize: 29, fontStyle: "italic", color: "rgba(7,16,20,.68)"}}>{oil.tag}</div>
        <div style={{marginTop: 34, paddingTop: 24, borderTop: `1px solid ${rgba(oil.accent, 0.45)}`, fontFamily: "Arial, sans-serif", fontSize: 17, fontWeight: 850, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(7,16,20,.55)"}}>{oil.note}</div>
      </div>
      <div style={{position: "absolute", left: 96, top: 82, display: "flex", alignItems: "center", gap: 12}}>
        {OILS.map((x, i) => <span key={x.n} style={{width: i === index - 1 ? 52 : 12, height: 12, borderRadius: 99, background: i === index - 1 ? oil.accent : "rgba(255,255,255,.22)", boxShadow: i === index - 1 ? `0 0 18px ${rgba(oil.accent, .55)}` : "none"}} />)}
      </div>
      <VallerFilmLayers accent={oil.accent} />
    </AbsoluteFill>
  );
};

export const OilRibbon: React.FC<{duration: number; index: number}> = ({duration, index}) => {
  const frame = useCurrentFrame();
  const oil = OILS[index - 1];
  const enter = interpolate(frame, [0, 20], [0, 1], {...CLAMP, easing: EASE});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration, 10), pointerEvents: "none"}}>
      <div style={{position: "absolute", right: 76, bottom: 102, width: 600, padding: "28px 32px", borderRadius: 24, background: "rgba(5,12,15,.78)", backdropFilter: "blur(18px)", border: `1px solid ${rgba(oil.accent, 0.48)}`, boxShadow: "0 24px 70px rgba(0,0,0,.38)", opacity: enter, transform: `translateX(${(1 - enter) * 70}px)`}}>
        <div style={{display: "flex", alignItems: "center", gap: 22}}>
          <div style={{fontFamily: "Arial, sans-serif", fontSize: 70, fontWeight: 950, color: oil.accent}}>{oil.n}</div>
          <div><div style={{fontFamily: "Arial, sans-serif", fontSize: 33, fontWeight: 900, color: "white"}}>{oil.name}</div><div style={{marginTop: 7, fontFamily: "Georgia, serif", fontSize: 20, fontStyle: "italic", color: "rgba(255,255,255,.66)"}}>{oil.note}</div></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FullBleedBroll: React.FC<{duration: number; src: string; title: string; sub?: string; accent?: string; position?: string}> = ({duration, src, title, sub, accent = MINT, position}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [6, 28], [0, 1], {...CLAMP, easing: EASE});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), overflow: "hidden", background: INK}}>
      <MediaMotion src={src} duration={duration} position={position} dim={0.18} />
      <div style={{position: "absolute", left: 105, bottom: 105, width: 910, opacity: enter, transform: `translateY(${(1 - enter) * 55}px)`}}>
        <Eyebrow accent={accent}>Aplicación real</Eyebrow>
        <div style={{marginTop: 18, fontFamily: "Arial, sans-serif", fontSize: 64, fontWeight: 900, lineHeight: .98, letterSpacing: -2.7, color: "white"}}>{title}</div>
        {sub ? <div style={{marginTop: 19, fontFamily: "Georgia, serif", fontSize: 25, fontStyle: "italic", color: "rgba(255,255,255,.7)"}}>{sub}</div> : null}
      </div>
      <VallerFilmLayers accent={accent} />
    </AbsoluteFill>
  );
};

export const PatchTestExplainer: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 100}, durationInFrames: 36});
  const pulse = 1 + Math.sin(frame / 8) * 0.035;
  const clock = interpolate(frame, [35, Math.max(36, duration - 20)], [0, 360], CLAMP);
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: "radial-gradient(circle at 70% 42%,#1d3e3a,#071014 64%)", overflow: "hidden"}}>
      <div style={{position: "absolute", left: 110, top: 190, width: 700, opacity: enter}}>
        <Eyebrow accent={MINT}>Antes de usarlo en el rostro</Eyebrow>
        <div style={{marginTop: 20, fontFamily: "Arial, sans-serif", fontSize: 76, fontWeight: 900, lineHeight: .96, letterSpacing: -3.4, color: IVORY}}>HAZ UNA<br /><span style={{color: MINT}}>PRUEBA DE PARCHE</span></div>
        <div style={{marginTop: 28, fontFamily: "Georgia, serif", fontSize: 27, fontStyle: "italic", lineHeight: 1.4, color: "rgba(255,255,255,.7)"}}>Una gota en el antebrazo. Observa la reacción antes de continuar.</div>
      </div>
      <div style={{position: "absolute", right: 170, top: 115, width: 720, height: 820, opacity: enter, transform: `translateX(${(1 - enter) * 90}px)`}}>
        <div style={{position: "absolute", left: 160, top: 310, width: 500, height: 190, borderRadius: "50% 38% 42% 50%", transform: "rotate(-14deg)", background: "linear-gradient(165deg,#e8bca5,#c9826e)", boxShadow: "inset 0 18px 35px rgba(255,255,255,.2),0 34px 90px rgba(0,0,0,.45)"}} />
        <div style={{position: "absolute", left: 365, top: 348, width: 76, height: 100, borderRadius: "55% 55% 65% 65%", transform: `rotate(45deg) scale(${pulse})`, background: "linear-gradient(135deg,#ffe9a9,#c88428)", boxShadow: "0 0 45px rgba(232,180,88,.72)"}} />
        <div style={{position: "absolute", right: 0, top: 95, width: 220, height: 220, borderRadius: "50%", background: IVORY, boxShadow: "0 25px 70px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center"}}>
          <div style={{position: "absolute", width: 170, height: 170, borderRadius: "50%", border: "12px solid rgba(7,16,20,.1)", background: `conic-gradient(${MINT} ${clock}deg,transparent ${clock}deg)`}} />
          <div style={{position: "absolute", width: 138, height: 138, borderRadius: "50%", background: IVORY}} />
          <div style={{position: "relative", fontFamily: "Arial, sans-serif", fontSize: 43, fontWeight: 950, color: INK}}>24 h</div>
        </div>
        <div style={{position: "absolute", left: 185, bottom: 95, display: "flex", gap: 13}}>{["UNA GOTA", "ZONA PEQUEÑA", "OBSERVAR"].map((x, i) => <div key={x} style={{padding: "13px 16px", borderRadius: 999, background: i === 2 ? MINT : "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", fontFamily: "Arial, sans-serif", fontSize: 12, fontWeight: 850, letterSpacing: ".12em", color: i === 2 ? INK : "white"}}>{x}</div>)}</div>
      </div>
      <VallerFilmLayers />
    </AbsoluteFill>
  );
};

export const ApplicationSteps: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const active = Math.min(2, Math.floor(interpolate(frame, [18, Math.max(19, duration - 14)], [0, 3], CLAMP)));
  const steps = [
    {n: "01", title: "PIEL HÚMEDA", sub: "Primero agua o hidratante"},
    {n: "02", title: "2–3 GOTAS", sub: "Más cantidad no es mejor"},
    {n: "03", title: "PRESIONA", sub: "Sin frotar con fuerza"},
  ];
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: "linear-gradient(135deg,#071014,#142d2a)", overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 82, textAlign: "center"}}><Eyebrow accent={GOLD}><span style={{display: "inline-block", width: 500, textAlign: "center"}}>La técnica correcta</span></Eyebrow><div style={{marginTop: 16, fontFamily: "Arial, sans-serif", fontSize: 60, fontWeight: 900, color: IVORY}}>MENOS PRODUCTO. MEJOR CAPA.</div></div>
      <div style={{position: "absolute", left: 120, right: 120, top: 295, display: "flex", gap: 46}}>
        {steps.map((s, i) => {
          const e = spring({frame: frame - i * 8, fps, config: {damping: 18, stiffness: 100}, durationInFrames: 34});
          const is = i === active;
          return <div key={s.n} style={{position: "relative", width: 530, height: 470, borderRadius: 28, padding: "42px 40px", background: is ? IVORY : "rgba(255,255,255,.055)", border: `1px solid ${is ? rgba(GOLD, .75) : "rgba(255,255,255,.12)"}`, boxShadow: is ? "0 38px 100px rgba(0,0,0,.48)" : "0 20px 55px rgba(0,0,0,.25)", opacity: e * (is ? 1 : .62), transform: `translateY(${(1 - e) * 70 + Math.sin((frame + i * 17) / 30) * (is ? 3 : 8)}px) scale(${is ? 1.035 : .96})`}}>
            <div style={{fontFamily: "Arial, sans-serif", fontSize: 98, fontWeight: 950, color: is ? rgba(GOLD,.28) : "rgba(255,255,255,.1)"}}>{s.n}</div>
            <div style={{marginTop: 46, fontFamily: "Arial, sans-serif", fontSize: 38, fontWeight: 900, color: is ? INK : "white"}}>{s.title}</div>
            <div style={{marginTop: 18, fontFamily: "Georgia, serif", fontSize: 23, fontStyle: "italic", color: is ? "rgba(7,16,20,.62)" : "rgba(255,255,255,.6)"}}>{s.sub}</div>
            <div style={{position: "absolute", left: 40, right: 40, bottom: 38, height: 5, borderRadius: 99, background: is ? GOLD : "rgba(255,255,255,.1)"}} />
          </div>;
        })}
      </div>
      <VallerFilmLayers accent={GOLD} />
    </AbsoluteFill>
  );
};

export const OliveWarning: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 17, stiffness: 100}, durationInFrames: 36});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: INK, overflow: "hidden"}}>
      <Img src={staticFile("img/va_oils_5_olive.png")} style={{position: "absolute", inset: -35, width: 1990, height: 1150, objectFit: "cover", filter: "saturate(.62) brightness(.64) contrast(1.12)", transform: `scale(${1.04 + frame / duration * .05})`}} />
      <AbsoluteFill style={{background: "linear-gradient(90deg,rgba(8,8,7,.9),rgba(8,8,7,.38) 58%,rgba(8,8,7,.15))"}} />
      <div style={{position: "absolute", left: 112, top: 190, width: 850, opacity: enter, transform: `translateY(${(1 - enter) * 70}px)`}}>
        <Eyebrow accent="#E8A06A">Advertencia con matiz</Eyebrow>
        <div style={{marginTop: 22, fontFamily: "Arial, sans-serif", fontSize: 76, fontWeight: 950, lineHeight: .95, letterSpacing: -3.2, color: "white"}}>ACEITE DE OLIVA:<br /><span style={{color: "#E8A06A"}}>NO PARA TODAS LAS PIELES</span></div>
        <div style={{marginTop: 30, width: 680, padding: "23px 28px", borderLeft: "5px solid #E8A06A", background: "rgba(4,8,9,.55)", fontFamily: "Georgia, serif", fontSize: 27, fontStyle: "italic", lineHeight: 1.38, color: "rgba(255,255,255,.76)"}}>En piel sensible o con barrera alterada puede no ser la mejor opción.</div>
      </div>
      <div style={{position: "absolute", right: 116, bottom: 84, padding: "13px 18px", borderRadius: 999, background: "rgba(232,160,106,.18)", border: "1px solid rgba(232,160,106,.5)", fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 850, letterSpacing: ".16em", color: "white"}}>PRUEBA · OBSERVA · AJUSTA</div>
      <VallerFilmLayers accent="#E8A06A" />
    </AbsoluteFill>
  );
};

export const RoutineSystem: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = [
    {n: "01", title: "LIMPIEZA SUAVE", accent: "#A8D5C6"},
    {n: "02", title: "HIDRATACIÓN", accent: "#9FCFE4"},
    {n: "03", title: "ACEITE", accent: "#D8B56D"},
    {n: "04", title: "PROTECTOR SOLAR", accent: "#E8A06A"},
  ];
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: "radial-gradient(circle at 50% 36%,#244541,#071014 67%)", overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 92, textAlign: "center"}}><Eyebrow accent={MINT}><span style={{display: "inline-block", width: 520, textAlign: "center"}}>La rutina que sí protege</span></Eyebrow><div style={{marginTop: 16, fontFamily: "Arial, sans-serif", fontSize: 67, fontWeight: 950, color: IVORY}}>EL ACEITE ES UNA CAPA, NO EL SISTEMA</div></div>
      <div style={{position: "absolute", left: 110, right: 110, top: 355, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        {items.map((item, i) => {
          const e = spring({frame: frame - i * 11, fps, config: {damping: 18, stiffness: 95}, durationInFrames: 36});
          return <React.Fragment key={item.n}><div style={{width: 340, height: 340, borderRadius: "50%", background: "rgba(255,255,255,.055)", border: `2px solid ${rgba(item.accent,.66)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 65px ${rgba(item.accent,.13)},inset 0 0 45px rgba(255,255,255,.025)`, opacity: e, transform: `scale(${.72 + e * .28}) translateY(${Math.sin((frame + i * 22) / 32) * 7}px)`}}><div style={{fontFamily: "Arial, sans-serif", fontSize: 62, fontWeight: 950, color: item.accent}}>{item.n}</div><div style={{marginTop: 18, width: 240, textAlign: "center", fontFamily: "Arial, sans-serif", fontSize: 22, lineHeight: 1.15, fontWeight: 900, color: "white"}}>{item.title}</div></div>{i < items.length - 1 ? <div style={{width: 80, height: 3, borderRadius: 99, background: `linear-gradient(90deg,${item.accent},${items[i + 1].accent})`, transformOrigin: "left", transform: `scaleX(${e})`}} /> : null}</React.Fragment>;
        })}
      </div>
      <div style={{position: "absolute", left: 0, right: 0, bottom: 95, textAlign: "center", fontFamily: "Georgia, serif", fontSize: 26, fontStyle: "italic", color: "rgba(255,255,255,.66)"}}>La constancia supera a cualquier promesa rápida.</div>
      <VallerFilmLayers />
    </AbsoluteFill>
  );
};

export const AvatarCallout: React.FC<{duration: number; kicker: string; title: string; sub?: string; accent?: string; side?: "left" | "right"}> = ({duration, kicker, title, sub, accent = MINT, side = "right"}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [3, 22], [0, 1], {...CLAMP, easing: EASE});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration, 9), pointerEvents: "none"}}>
      <div style={{position: "absolute", [side]: 74, bottom: 98, width: 670, padding: "28px 32px 30px", borderRadius: 24, borderLeft: side === "left" ? `5px solid ${accent}` : undefined, borderRight: side === "right" ? `5px solid ${accent}` : undefined, background: "linear-gradient(145deg,rgba(3,9,12,.84),rgba(3,9,12,.56))", backdropFilter: "blur(16px)", boxShadow: "0 25px 80px rgba(0,0,0,.42)", opacity: enter, transform: `translateX(${(side === "right" ? 1 : -1) * (1 - enter) * 70}px)`}}>
        <div style={{fontFamily: "Arial, sans-serif", fontSize: 14, fontWeight: 850, letterSpacing: ".2em", textTransform: "uppercase", color: accent}}>{kicker}</div>
        <div style={{marginTop: 11, fontFamily: "Arial, sans-serif", fontSize: 43, fontWeight: 900, lineHeight: 1.02, letterSpacing: -1.5, color: "white"}}>{title}</div>
        {sub ? <div style={{marginTop: 14, fontFamily: "Georgia, serif", fontSize: 20, fontStyle: "italic", lineHeight: 1.35, color: "rgba(255,255,255,.64)"}}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

export type WordCaption = {text: string; startMs: number; endMs: number};

export const VallerCaptions: React.FC<{words: WordCaption[]; hide?: boolean}> = ({words, hide = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (hide) return null;
  const now = (frame / fps) * 1000;
  let lo = 0;
  let hi = words.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (words[mid].endMs < now) lo = mid + 1;
    else hi = mid - 1;
  }
  const center = Math.min(words.length - 1, Math.max(0, lo));
  let start = center;
  while (start > 0 && center - start < 3 && words[start - 1].startMs > now - 1400) start--;
  let end = center;
  while (end < words.length - 1 && end - start < 6 && words[end + 1].endMs < now + 1200) end++;
  const visible = words.slice(start, end + 1);
  const active = visible.findIndex((w) => now >= w.startMs && now <= w.endMs);
  if (!visible.length || now < visible[0].startMs - 450 || now > visible[visible.length - 1].endMs + 600) return null;
  return (
    <div style={{position: "absolute", left: "50%", bottom: 38, width: 1220, transform: "translateX(-50%)", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 10px", padding: "13px 24px 15px", borderRadius: 18, background: "rgba(2,7,9,.68)", backdropFilter: "blur(14px)", boxShadow: "0 14px 45px rgba(0,0,0,.28)", fontFamily: "Arial, sans-serif", fontSize: 31, lineHeight: 1.22, fontWeight: 800, letterSpacing: -0.4, color: "rgba(255,255,255,.76)", pointerEvents: "none"}}>
      {visible.map((word, i) => <span key={`${word.startMs}-${i}`} style={{color: i === active ? MINT : "rgba(255,255,255,.8)", textShadow: i === active ? `0 0 24px ${rgba(MINT,.5)}` : "0 3px 10px rgba(0,0,0,.35)"}}>{word.text.trim()}</span>)}
    </div>
  );
};

export const ALL_OILS = OILS;
