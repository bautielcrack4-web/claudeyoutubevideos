import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
  delayRender,
  continueRender,
  staticFile,
} from "remotion";
import { MG, BODY, pill } from "../theme";

type Corner = "br" | "bl" | "tr" | "tl";

type Credit = {
  artist?: string;
  license?: string;
  credit?: string;
  source?: string;
  via?: string;
};

// useCredit("real/mairi_mcallan.jpg") → reads public/real/credits.json (written by
// fetch_real.mjs) and returns that asset's attribution, so the chip fills itself.
// Returns null until loaded (chip just renders nothing that frame).
export const useCredit = (assetKey?: string): Credit | null => {
  const [data, setData] = useState<Record<string, Credit> | null>(null);
  useEffect(() => {
    if (!assetKey) return;
    const h = delayRender(`credits:${assetKey}`);
    fetch(staticFile("real/credits.json"))
      .then((r) => (r.ok ? r.json() : {}))
      .then((j) => setData(j))
      .catch(() => setData({}))
      .finally(() => continueRender(h));
  }, [assetKey]);
  if (!assetKey || !data) return null;
  return data[assetKey] ?? null;
};

// SourceChip — a small attribution / citation chip in a corner. Satisfies the
// CC-BY/SA credit requirement (and just looks documentary-pro). Either pass the
// fields directly, or pass `asset` (a key in real/credits.json) to auto-fill via
// useCredit. Slides + fades in; sits quietly bottom-left by default.
export const SourceChip: React.FC<{
  asset?: string; // key in real/credits.json
  author?: string;
  license?: string;
  via?: string; // e.g. "Wikimedia Commons"
  label?: string; // prefix, default "SOURCE"
  corner?: Corner;
  startAt?: number;
  durationInFrames?: number;
}> = ({ asset, author, license, via, label = "SOURCE", corner = "bl", startAt = 0 }) => {
  const frame = useCurrentFrame() - startAt;
  const auto = useCredit(asset);

  const a = author ?? auto?.artist;
  const lic = license ?? auto?.license;
  const v = via ?? auto?.via;
  // nothing to show yet (e.g. credits.json still loading) → render empty
  if (!a && !lic && !v) return null;

  const appear = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const pos: Record<Corner, React.CSSProperties> = {
    br: { right: "3.5%", bottom: "5%", alignItems: "flex-end" },
    bl: { left: "3.5%", bottom: "5%", alignItems: "flex-start" },
    tr: { right: "3.5%", top: "5%", alignItems: "flex-end" },
    tl: { left: "3.5%", top: "5%", alignItems: "flex-start" },
  };

  const detail = [a, v, lic].filter(Boolean).join(" · ");

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          ...pos[corner],
          opacity: appear * 0.92,
          transform: `translateY(${interpolate(appear, [0, 1], [10, 0])}px)`,
          ...pill(7),
          padding: "7px 13px",
          maxWidth: "44%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: BODY,
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 1.5,
              color: MG.cyan,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: BODY,
              fontWeight: 500,
              fontSize: 17,
              color: MG.textSoft,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {detail}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
