// Built-in map silhouettes for MapReveal. Each entry is an SVG path string plus
// the viewBox it was authored in. These are STYLIZED / simplified silhouettes
// (recognizable, not survey-accurate) so the kit renders with zero assets — for
// production accuracy pass your own `pathD` + `viewBox` (export from a real
// SVG / GeoJSON of the country you need).

export type MapShape = { d: string; viewBox: string };

// Stylized Great Britain (mainland) — narrow jagged Scotland up top, a wide
// England belly with an East-Anglia bump on the right and a Cornwall tail down
// to the southwest, plus a small Wales nub on the left. Asymmetric so it reads
// as Britain at a glance (NOT survey-accurate — pass a real `pathD` for prod).
// Authored in a 0 0 300 560 box.
const GB: MapShape = {
  viewBox: "0 0 300 560",
  d: `M 150 20
      C 158 30 154 40 162 46
      C 176 56 170 74 158 80
      C 172 86 184 96 180 112
      C 176 128 158 128 162 146
      C 165 162 180 162 184 180
      C 188 200 168 206 176 226
      C 184 246 208 248 214 270
      C 220 292 240 298 248 322
      C 254 342 236 350 240 368
      C 243 384 224 388 214 402
      C 206 414 214 430 202 438
      C 190 446 176 438 168 448
      C 158 460 162 478 148 482
      C 134 486 128 470 118 478
      C 106 488 90 506 78 500
      C 68 495 82 478 92 470
      C 102 462 96 452 84 454
      C 72 456 64 446 72 436
      C 80 426 76 414 66 410
      C 54 405 62 390 58 378
      C 54 364 66 356 62 342
      C 58 326 44 322 50 304
      C 56 288 76 290 78 272
      C 80 256 64 250 70 232
      C 76 214 98 218 100 200
      C 102 184 86 178 94 162
      C 102 146 124 150 128 132
      C 132 116 116 110 124 96
      C 131 84 146 88 148 72
      C 149 58 140 46 144 34
      C 146 26 146 22 150 20 Z`,
};

// Simplified Scotland-only (the narrow, isle-fringed north) in a 0 0 300 360 box.
const SCOTLAND: MapShape = {
  viewBox: "0 0 300 360",
  d: `M 150 16
      C 170 30 160 54 176 66
      C 196 80 188 104 170 112
      C 192 124 214 132 214 156
      C 214 180 188 186 192 210
      C 196 234 222 240 216 266
      C 212 288 184 290 170 308
      C 158 322 162 344 144 344
      C 128 344 126 322 112 312
      C 94 300 70 304 66 282
      C 62 260 86 254 84 232
      C 82 210 58 208 62 184
      C 66 162 92 162 96 140
      C 100 118 80 108 92 88
      C 102 70 128 76 132 54
      C 135 38 138 26 150 16 Z`,
};

export const MAPS: Record<string, MapShape> = {
  uk: GB,
  gb: GB,
  scotland: SCOTLAND,
};
