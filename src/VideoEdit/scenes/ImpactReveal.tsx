import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { Media } from "../components/Media";
import { SfxCue, SFX, BOOMS } from "../components/Sfx";

// ── IMPACT REVEAL ───────────────────────────────────────────────────────────
// El beat de HOOK que pidió el usuario: una imagen full-bleed hace un zoom lento
// hacia adelante, en el "golpe" se OSCURECE de golpe y aparece un texto impactante
// (blur→nítido + scale-punch) con un golpe suave cinematográfico de sonido.
// Ideal para revelaciones: setup line + palabra/línea fuerte ("TE MINTIERON").
//
// Adaptado a la marca: serif EB Garamond, tinta marrón, acento terroso, un
// destello cálido sepia (no neón). Mejoras sobre la referencia (ver notas abajo):
//   · flash de luz cálido + viñeta que respira en el impacto (golpe de luz, no neón)
//   · micro camera-shake que decae (vende el golpe físico)
//   · texto en DOS partes: setup suave arriba + palabra fuerte que "aterriza"
//   · subrayado/*stroke* de acento que se dibuja bajo la palabra al caer
//   · sombra tipo prensado/emboss + grano de papel → se siente impreso, no digital
//   · audio en capas: whoosh de aproximación → transición + golpe grave suave
//
// REPLAY: si pasás `holdThenLoop` no; es un one-shot pensado para 3.5–6s.

type AccentKey = "danger" | "accent" | "amber" | "cold" | "good" | "ink";

const TONE: Record<AccentKey, string> = {
  danger: COLORS.danger,
  accent: COLORS.accent,
  amber: COLORS.amber,
  cold: COLORS.cold,
  good: COLORS.good,
  ink: COLORS.text,
};

export const ImpactReveal: React.FC<{
  durationInFrames: number;
  image: string; // "img/..." o "vid/..." (acepta foto o clip)
  setup?: string; // línea chica de arranque (aparece antes, suave)
  impact: string; // la línea fuerte que golpea
  impactAccent?: AccentKey; // color de la palabra fuerte (default terracota)
  hitAt?: number; // segundos hasta el golpe (default 0.95s)
  zoom?: [number, number]; // escala de la imagen [inicio, fin]
  darken?: number; // opacidad final del oscurecido (0–1, default 0.72)
  align?: "center" | "bottom";
  fontSize?: number; // tamaño de la línea fuerte
  boom?: 0 | 1 | 2; // cuál golpe grave usar (default 0 → boom1)
  boomVolume?: number;
}> = ({
  durationInFrames,
  image,
  setup,
  impact,
  impactAccent = "danger",
  hitAt = 0.95,
  zoom = [1.06, 1.26],
  darken = 0.72,
  align = "center",
  fontSize = 150,
  boom = 0,
  boomVolume = 0.85,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = TONE[impactAccent];
  const hit = sec(hitAt);

  // ── imagen: SPEED-RAMP — el zoom ACELERA hacia el golpe y FRENA en seco ─────
  // antes del hit: ease-in fuerte (acelera) hasta el ~92% del recorrido; en el
  // hit queda casi congelado y completa lo último lentísimo (el parón seco pega).
  const approach = interpolate(frame, [0, hit], [0, 0.92], {
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const settle = interpolate(frame, [hit, durationInFrames], [0.92, 1], {
    extrapolateLeft: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const zoomT = frame < hit ? approach : settle;
  const baseZoom = interpolate(zoomT, [0, 1], zoom);
  const kick = spring({ frame: frame - hit, fps, config: { damping: 9, mass: 0.5, stiffness: 200 } });
  const kickScale = interpolate(kick, [0, 1], [0, 0.05]); // golpe de +5% que rebota
  const imgScale = baseZoom + kickScale;

  // ── micro camera-shake decae tras el golpe (vende el impacto físico) ───────
  const shakeAmp = interpolate(frame - hit, [0, 10, 22], [0, 7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = Math.sin((frame - hit) * 2.1) * shakeAmp;
  const shakeY = Math.cos((frame - hit) * 2.7) * shakeAmp * 0.7;

  // ── oscurecido de golpe (scrim de tinta) ───────────────────────────────────
  const darkOp = interpolate(frame, [hit - 3, hit + 6], [0.12, darken], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // desaturación leve del fondo para empujar foco al texto
  const sat = interpolate(frame, [hit - 3, hit + 8], [1, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── flash cálido sepia que florece en el golpe y decae (golpe de LUZ) ──────
  const flash = interpolate(frame - hit, [0, 4, 18], [0, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── texto fuerte: blur→nítido + scale-punch + sube un toque ────────────────
  const tIn = spring({ frame: frame - hit, fps, config: { damping: 16, mass: 0.7, stiffness: 190 } });
  const impactBlur = interpolate(tIn, [0, 1], [16, 0]);
  const impactScale = interpolate(tIn, [0, 1], [1.14, 1]);
  const impactOp = interpolate(frame - hit, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const impactY = interpolate(tIn, [0, 1], [26, 0]);

  // setup line: entra antes del golpe, suave
  const sStart = hit - sec(0.5);
  const setupS = spring({ frame: frame - sStart, fps, config: { damping: 20 } });
  const setupOp = interpolate(setupS, [0, 1], [0, 1]) * interpolate(frame, [hit + sec(0.1), hit + sec(0.4)], [1, 0.78], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // subrayado de acento que se dibuja bajo la palabra fuerte tras caer
  const underline = interpolate(frame - (hit + sec(0.28)), [0, sec(0.45)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, background: COLORS.ink, overflow: "hidden" }}>
      {/* imagen / clip de fondo */}
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px) scale(${imgScale})`, filter: `saturate(${sat})` }}>
        <Media src={image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      {/* viñeta vintage permanente (bordes en sombra) */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(120% 100% at 50% 46%, rgba(0,0,0,0) 40%, rgba(20,16,12,0.55) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* oscurecido de golpe — scrim de tinta cálida */}
      <AbsoluteFill style={{ background: `rgba(20,16,12,${darkOp})` }} />

      {/* flash cálido sepia (golpe de luz, on-brand) */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(60% 50% at 50% 48%, rgba(233,210,160,1), rgba(233,210,160,0) 70%)",
          opacity: flash,
          mixBlendMode: "soft-light",
        }}
      />

      {/* grano de papel sutil para que el texto se sienta impreso */}
      <AbsoluteFill
        style={{
          opacity: 0.06,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          mixBlendMode: "overlay",
        }}
      />

      {/* TEXTO */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: align === "bottom" ? "flex-end" : "center",
          paddingBottom: align === "bottom" ? 160 : 0,
          textAlign: "center",
          padding: "0 120px",
        }}
      >
        {setup && (
          <div
            style={{
              fontSize: 52,
              fontWeight: 600,
              fontStyle: "italic",
              color: COLORS.bg0,
              opacity: setupOp,
              transform: `translateY(${interpolate(setupS, [0, 1], [16, 0])}px)`,
              marginBottom: 26,
              maxWidth: 1500,
              textShadow: "0 2px 18px rgba(0,0,0,0.7)",
            }}
          >
            {setup}
          </div>
        )}

        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              fontSize,
              fontWeight: 900,
              letterSpacing: interpolate(tIn, [0, 1], [10, 1]),
              lineHeight: 1.02,
              color: C,
              opacity: impactOp,
              transform: `translateY(${impactY}px) scale(${impactScale})`,
              filter: `blur(${impactBlur}px)`,
              // emboss/prensado: brillo arriba + sombra abajo, + halo cálido del flash
              textShadow: `0 1px 0 rgba(255,245,220,0.25), 0 3px 0 rgba(0,0,0,0.45), 0 14px 40px rgba(0,0,0,0.6), 0 0 ${28 * flash * 2}px ${C}`,
            }}
          >
            {impact}
          </div>
          {/* subrayado de acento que se dibuja */}
          <div
            style={{
              position: "absolute",
              left: "8%",
              right: "8%",
              bottom: -18,
              height: 7,
              borderRadius: 4,
              background: C,
              transformOrigin: "left center",
              transform: `scaleX(${underline})`,
              opacity: 0.9,
              boxShadow: `0 2px 10px ${C}88`,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* AUDIO — whoosh de aproximación → SUB-BOOM grave + transición en el golpe */}
      <SfxCue at={hit - sec(0.42)} src={SFX.whoosh2} volume={0.5} durationInFrames={sec(0.6)} />
      <SfxCue at={hit} src={BOOMS[boom]} volume={boomVolume} durationInFrames={sec(2.2)} />
      <SfxCue at={hit} src={SFX.textSlam} volume={0.5} durationInFrames={sec(1.0)} />
      <SfxCue at={hit} src={SFX.transition} volume={0.32} durationInFrames={sec(0.8)} />
    </AbsoluteFill>
  );
};
