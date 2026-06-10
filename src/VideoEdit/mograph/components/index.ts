// ── mograph kit — broadcast documentary components (cyan/magenta/dark/sans) ──
// Import from here: `import { Timeline, LocationPin } from "../mograph/components";`
// Identity lives in ../theme.ts — DO NOT mix with the earthy serif brand.

// Overlays
export { HookHighlight } from "./HookHighlight";
export { MarkerText, parseMarks } from "./MarkerText";
export { QuoteCard } from "./QuoteCard";
export { SplitPanelList } from "./SplitPanelList";
export { DateStamp } from "./DateStamp";

// Data-viz
export { Timeline } from "./Timeline";
export { MapReveal } from "./MapReveal";
export { RangeCounter } from "./RangeCounter";
export { LocationPin } from "./LocationPin";
export { RouteMap } from "./RouteMap";

// Transition / annotation
export { DrawnCallout } from "./DrawnCallout";

// Polish layer (citation / archival treatment)
export { SourceChip, useCredit } from "./SourceChip";
export { ArchiveFrame } from "./ArchiveFrame";

// Shared helpers (background, percent→px)
export { MediaBg, isVideoSrc } from "./_shared";
