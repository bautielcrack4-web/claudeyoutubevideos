import { AbsoluteFill, Series } from "remotion";
import { FPS, MG } from "./theme";
import {
  MapReveal,
  LocationPin,
  Timeline,
  QuoteCard,
  RangeCounter,
  DrawnCallout,
  ArchiveFrame,
  SourceChip,
} from "./components";

// Showcase — a real mini-sequence wiring the kit over REAL downloaded footage:
// Mairi McAllan's real portrait (Wikimedia) + Knapdale photos, with earthZoom,
// auto-attribution SourceChips (from public/real/credits.json), the counter +
// keyboard SFX, and the archival treatment. This is the competitor look, end to
// end, on real assets — NOT a synthetic demo.
const S = (sec: number) => Math.round(sec * FPS);

// real assets (downloaded by fetch_real.mjs → public/real/)
const MAIRI = "real/mairi_mcallan.jpg";
const KNAP1 = "real/knapdale_1.jpg"; // sea loch / coastline
const KNAP2 = "real/knapdale_2.jpg"; // forested valley + track

const BEATS = [S(3.5), S(5), S(4), S(6), S(4.5), S(4), S(4)];
export const TOTAL_FRAMES_SHOWCASE = BEATS.reduce((a, b) => a + b, 0);

export const MographShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: MG.bg0 }}>
      <Series>
        {/* 1 · where — map reveal (keyboard SFX on the typed title) */}
        <Series.Sequence durationInFrames={BEATS[0]}>
          <MapReveal durationInFrames={BEATS[0]} title="SCOTLAND" country="uk" />
        </Series.Sequence>

        {/* 2 · the place — Google-Earth push-in + pulsing pin + auto credit */}
        <Series.Sequence durationInFrames={BEATS[1]}>
          <LocationPin
            durationInFrames={BEATS[1]}
            bg={KNAP1}
            x={58}
            y={40}
            label="Knapdale"
            labelSide="right"
            earthZoom
          />
          <SourceChip asset={KNAP1} />
        </Series.Sequence>

        {/* 3 · when — chronology bar over the valley */}
        <Series.Sequence durationInFrames={BEATS[2]}>
          <Timeline
            durationInFrames={BEATS[2]}
            bg={KNAP2}
            from={2009}
            to={2024}
            active={3}
            label="May 2024"
            marks={[
              { label: "2009", value: 2009, major: true },
              { label: "2014", value: 2014 },
              { label: "2019", value: 2019 },
              { label: "2024", value: 2024, major: true },
            ]}
          />
          <SourceChip asset={KNAP2} />
        </Series.Sequence>

        {/* 4 · who — the REAL person, named, with her real portrait + typed quote */}
        <Series.Sequence durationInFrames={BEATS[3]}>
          <QuoteCard
            quote="There are few species that have such a significant, and largely positive, influence on the health of our ecosystems."
            cite="Mairi McAllan, Scotland's Environment Secretary"
            portrait={MAIRI}
            accentWord="species"
            type
          />
          <SourceChip asset={MAIRI} corner="br" />
        </Series.Sequence>

        {/* 5 · the data — count-up over the range (counter SFX) */}
        <Series.Sequence durationInFrames={BEATS[4]}>
          <RangeCounter
            durationInFrames={BEATS[4]}
            bg={KNAP1}
            value={1133}
            label="Beavers in 1900"
            legend="Eurasian Beaver · Castor Fiber"
            patches={[
              { x: 30, y: 38, r: 70, at: 0.1 },
              { x: 60, y: 30, r: 48, at: 0.35 },
              { x: 70, y: 52, r: 58, at: 0.6 },
            ]}
          />
        </Series.Sequence>

        {/* 6 · the evidence — hand-drawn callout on the real valley */}
        <Series.Sequence durationInFrames={BEATS[5]}>
          <DrawnCallout durationInFrames={BEATS[5]} bg={KNAP2} label="Beaver Dam" target={{ x: 40, y: 70 }} />
        </Series.Sequence>

        {/* 7 · archive — the same real photo treated as historical footage */}
        <Series.Sequence durationInFrames={BEATS[6]}>
          <ArchiveFrame durationInFrames={BEATS[6]} src={KNAP2} year={2009} tag="ARCHIVE" />
          <SourceChip asset={KNAP2} corner="br" />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
