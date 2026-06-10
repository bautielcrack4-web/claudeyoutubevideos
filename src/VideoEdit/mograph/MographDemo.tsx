import { AbsoluteFill, Series } from "remotion";
import { FPS, MG, BODY } from "./theme";
import {
  HookHighlight,
  MarkerText,
  QuoteCard,
  SplitPanelList,
  DateStamp,
  Timeline,
  MapReveal,
  RangeCounter,
  LocationPin,
  RouteMap,
  DrawnCallout,
  SourceChip,
  ArchiveFrame,
} from "./components";

// Preview / smoke-test composition: each of the 11 mograph components in turn
// with placeholder content (no media → navy fallback). Render a still anywhere
// to eyeball a component, or play it in Studio. NOT a real video edit.
const SEG = FPS * 4; // 4s per component

const Tag: React.FC<{ n: number; name: string }> = ({ n, name }) => (
  <div
    style={{
      position: "absolute",
      top: 24,
      left: 24,
      zIndex: 50,
      fontFamily: BODY,
      fontWeight: 700,
      fontSize: 22,
      color: MG.textDim,
      letterSpacing: 1,
    }}
  >
    {String(n).padStart(2, "0")} · {name}
  </div>
);

export const TOTAL_FRAMES_MOGRAPH = SEG * 13;

export const MographDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: MG.bg0 }}>
      <Series>
        <Series.Sequence durationInFrames={SEG}>
          <Tag n={1} name="HookHighlight" />
          <HookHighlight
            durationInFrames={SEG}
            lines={[
              { text: "They found something" },
              { text: "truly SHOCKING", hl: "magenta" },
              { text: "11 beavers revived", hl: "cyan" },
              { text: "a dead river." },
            ]}
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SEG}>
          <Tag n={2} name="MarkerText" />
          <MarkerText
            durationInFrames={SEG}
            text="With beavers gone, Scotland's rivers were straightened, wetlands drained and *biodiversity declined* — a slow unraveling few remembered."
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SEG}>
          <Tag n={3} name="QuoteCard" />
          <QuoteCard
            quote="There are few species that have such a significant, and largely positive, influence on the health of our ecosystems."
            cite="Mairi McAllan, Scotland's Environment Secretary"
            accentWord="species"
            type
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SEG}>
          <Tag n={4} name="SplitPanelList" />
          <SplitPanelList
            durationInFrames={SEG}
            title="Valley Reborn by Beavers"
            bullets={[
              "Patched leaks and rebuilt after storms",
              "Shifted efforts as water found new paths",
              "Transformed river into ponds & wetlands",
              "Astonished rangers and engineers",
            ]}
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SEG}>
          <Tag n={5} name="DateStamp" />
          <DateStamp durationInFrames={SEG} date="February" sub="2025" corner="br" />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SEG}>
          <Tag n={6} name="Timeline" />
          <Timeline
            durationInFrames={SEG}
            from={2018}
            to={2024}
            active={4}
            label="May 2024"
            marks={[
              { label: "2018", value: 2018, major: true },
              { label: "2019", value: 2019 },
              { label: "2020", value: 2020 },
              { label: "2021", value: 2021 },
              { label: "2024", value: 2024, major: true },
            ]}
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SEG}>
          <Tag n={7} name="MapReveal" />
          <MapReveal durationInFrames={SEG} title="SCOTLAND" country="uk" />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SEG}>
          <Tag n={8} name="RangeCounter" />
          <RangeCounter
            durationInFrames={SEG}
            value={1133}
            label="Beavers in 1900"
            legend="Eurasian Beaver · Castor Fiber"
            patches={[
              { x: 28, y: 40, r: 70, at: 0.1 },
              { x: 62, y: 32, r: 48, at: 0.3 },
              { x: 72, y: 52, r: 60, at: 0.5 },
              { x: 45, y: 60, r: 40, at: 0.7 },
            ]}
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SEG}>
          <Tag n={9} name="LocationPin + earthZoom + SourceChip" />
          <LocationPin durationInFrames={SEG} x={42} y={48} label="Knapdale" labelSide="right" earthZoom />
          <SourceChip author="Wikimedia contributor" license="CC BY-SA 2.0" via="Wikimedia Commons" />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SEG}>
          <Tag n={10} name="RouteMap" />
          <RouteMap
            durationInFrames={SEG}
            from={{ x: 18, y: 78 }}
            to={{ x: 74, y: 30 }}
            label="Dundee · Tay River"
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SEG}>
          <Tag n={11} name="DrawnCallout" />
          <DrawnCallout durationInFrames={SEG} label="Beaver Dam" target={{ x: 40, y: 64 }} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SEG}>
          <Tag n={12} name="ArchiveFrame" />
          <ArchiveFrame durationInFrames={SEG} year={1903} tag="ARCHIVE" />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SEG}>
          <Tag n={13} name="SourceChip (standalone)" />
          <SourceChip author="A. Naturalist" license="Public domain" via="Library of Congress" corner="br" />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
