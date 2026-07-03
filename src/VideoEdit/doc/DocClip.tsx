import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate } from "remotion";

// ── DocClip ───────────────────────────────────────────────────────────────────
// Una toma de documental: clip REAL full-bleed. CORTE DURO por defecto (fade=0):
// se reproduce UNA vez (la duración en pantalla es menor que la del clip, así no se
// loopea ni se repite). Ken-Burns muy lento opcional. El look unificado lo da DocGrade.
// Los clips de fetch_clips vienen muteados y en cámara lenta.
//
// ★ OffthreadVideo (NO <Video>/Html5Video): en el render server-side el <video> del DOM
//   tiene que hacer SEEK al tiempo del clip en cada corte; si el frame no está listo cuando
//   Remotion captura → sale un FRAME NEGRO (el "destello" en las transiciones) y además
//   dispara delayRender timeouts que voltean chunks del farm. OffthreadVideo saca el frame
//   exacto con ffmpeg: determinista, sin seek, sin negro. loop = si el slot supera al clip,
//   reinicia en vez de congelar/negrear.
export const DocClip: React.FC<{
  durationInFrames: number;
  src: string; // "broll/x.mp4"
  fade?: number; // 0 = corte duro (default). >0 = disolvencia (no usar para este nicho)
  kenburns?: "in" | "out" | "none";
}> = ({ durationInFrames, src, fade = 0, kenburns = "in" }) => {
  const f = useCurrentFrame();
  const opacity =
    fade > 0
      ? interpolate(f, [0, fade, durationInFrames - fade, durationInFrames], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  const p = interpolate(f, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const scale =
    kenburns === "none"
      ? 1
      : kenburns === "out"
        ? interpolate(p, [0, 1], [1.06, 1.0])
        : interpolate(p, [0, 1], [1.0, 1.06]);
  return (
    <AbsoluteFill style={{ opacity, backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
        <OffthreadVideo src={staticFile(src)} muted loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
