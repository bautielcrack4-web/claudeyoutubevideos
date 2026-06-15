// theme_ben.ts — IDENTIDAD VISUAL del canal "Ben retirado" (finanzas jubilados US).
//
// ★★ Look "ALARMA FINANCIERA" (elegido por el usuario, jun 2026) ★★
// NO es la marca terrosa-serif del resto del proyecto. Acá: fondo casi negro,
// acentos ROJO alarma + AMARILLO/oro, verde para estados "a salvo", y tipografía
// SANS PESADA condensada en mayúsculas (Anton para titulares, Montserrat para cuerpo).
// Calca el estilo de los canales competidores en inglés (urgencia + alto contraste)
// y matchea las miniaturas del canal. Ver memoria project_canal_ben_retirado.
//
// Exporta EXACTAMENTE las mismas claves que theme.ts (COLORS, FONT_STACK, glass, sec,
// springs, Palette) → mis componentes nuevos importan de "../theme_ben" y son drop-in.
// Suma FONT_DISPLAY (Anton) para los titulares de impacto.

import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadMont } from "@remotion/google-fonts/Montserrat";
import type { Palette } from "./theme";

export { FPS, sec, SPRING_SOFT, SPRING_SNAPPY, SPRING_ZOOM } from "./theme";

// Anton: sans display condensada, pesada, perfecta para titulares de alarma en MAYÚSCULAS.
export const { fontFamily: DISPLAY } = loadAnton();
// Montserrat: cuerpo / chips / cifras (tiene ExtraBold/Black).
export const { fontFamily: SANS } = loadMont();

// ── PALETA ALARMA ─────────────────────────────────────────────────────────────
// negro + rojo alarma + amarillo oro + verde "a salvo". Alto contraste, urgencia.
export const PALETTE_BEN: Palette = {
  mode: "dark",
  text: "#F6F6F8", // casi blanco (titulares/cuerpo sobre negro)
  textSoft: "rgba(246,246,248,0.70)",
  textDim: "rgba(246,246,248,0.42)",
  accent: "#E11507", // ROJO alarma (peligro: Estado/Medicaid/la carta/errores)
  accentSoft: "#FF5A4D",
  amber: "#FFC400", // AMARILLO / oro (cifras gigantes, "el oro", soluciones)
  cold: "#37B6FF", // azul info (secundario, datos neutros)
  coldSoft: "#8FD6FF",
  danger: "#FF2A1F", // rojo alerta brillante (slams/sellos)
  good: "#1FBF4F", // VERDE "a salvo" (exenta-en-vida, protecciones)
  bg0: "#0E0E12", // negro base
  bg1: "#16161C",
  bg2: "#20212B", // tarjeta oscura
  ink: "#08080B",
};

export const COLORS = PALETTE_BEN;

// Tarjeta de alarma. `dark` (default) = tarjeta casi negra con borde tenue (acento rojo
// sutil); `light` = panel claro raro. NADA de parchment terroso.
export const glass = (
  variant: "light" | "dark" = "dark",
): React.CSSProperties => ({
  background:
    variant === "light" ? "rgba(245,245,248,0.96)" : "rgba(20,20,26,0.86)",
  backdropFilter: "blur(16px) saturate(120%)",
  WebkitBackdropFilter: "blur(16px) saturate(120%)",
  border:
    variant === "light"
      ? "1px solid rgba(10,10,14,0.14)"
      : "1px solid rgba(255,255,255,0.10)",
  borderRadius: 18,
  boxShadow:
    variant === "light"
      ? "0 18px 44px rgba(0,0,0,0.35)"
      : "0 22px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
});

// Stack de cuerpo = Montserrat (sans pesada). Para titulares usar FONT_DISPLAY (Anton).
export const FONT_STACK = `${SANS}, 'Helvetica Neue', Arial, sans-serif`;
export const FONT_DISPLAY = `${DISPLAY}, 'Arial Black', 'Helvetica Neue', sans-serif`;

// caja de resaltado roja detrás de palabras clave (firma del look, como las miniaturas).
export const highlightBox = (color: string = COLORS.accent): React.CSSProperties => ({
  background: color,
  color: "#FFFFFF",
  padding: "0.02em 0.22em",
  borderRadius: 4,
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
});
