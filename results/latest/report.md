# MUI X Data Grid vs AG Grid vs TanStack Table vs Infinite Table — benchmark report

- Run: `ci` · 2026-11-25T01:21:52.818Z
- MUI X Data Grid 9.18.0 · AG Grid 36.3.0 · TanStack Table 9.3.1 · Infinite Table 10.2.1
- 300,000 rows (data checksum `300000:72377c6e`) · 1,000,000 rows (data checksum `1000000:19e5eebe`) × 20 columns, identical data for every grid
- Chrome 136.0.7103.25 · headless · CPU throttling 1× · viewport 1400×1000
- 7 measured runs per grid per scenario (+1 warmup, discarded), interleaved, fresh browser context per run
- Linux 7.0.0-1017-azure x64 · AMD EPYC 9V45 96-Core Processor × 4
- Served from http://localhost:5560/
- Grid body: 757-758 px high, with the same number of rows in view in every grid (to get there, the setup made the boxes taller: MUI X +14 px, Infinite +22 px)

The "Infinite vs ..." columns compare Infinite Table with one other grid: the ratio of the medians (Infinite / other, so < 1 means Infinite has the lower value), its 95% bootstrap confidence interval, and the grid that does better. A grid is only named when the interval excludes 1; "≈" means no significant difference. When the other grid has zeros among its values (e.g. 0% blank samples) a ratio means nothing, so the difference of the medians (Infinite − other) and its interval are shown instead, and a grid is only named when that interval excludes 0.

# 300,000 rows

Scroll range - browsers cap element sizes (Chrome ~16.7M-33.5M px, depending on the version), so a grid has to map the scrollbar onto the rows when the content is taller than that. One that doesn't can't reach its last rows: its scrolling results are for the rows it can reach, and the same wheel gesture goes over fewer rows in it.

| | MUI X | AG Grid | TanStack | Infinite |
|---|---:|---:|---:|---:|
| Last row reachable with the scrollbar | yes (300,000) | yes (300,000) | yes (300,000) | yes (300,000) |
| Native scroll range | 11,999,228 px | 11,999,243 px | 11,999,242 px | 11,999,242 px |
| Content px per scrollbar px | 1.000 | 1.000 | 1.000 | 1.000 |

## mount - 300,000 rows

Mount the grid with all the rows (data already in memory). "Visible" = from setState to the end of the first frame committed with the whole viewport (first/last visible row and column) showing the right content. "Settled" = until the first frame committed after the grid's last DOM mutation. Memory is the JS heap retained by the grid after GC (heap after mount - heap before mount).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Time to first rows painted (lower is better) | 230 ms (±8.69) | 248 ms (±4.32) | 180 ms (±3.27) | 194 ms (±10.5) | 0.84 × (0.80–0.91) **Infinite** | 0.78 × (0.74–0.81) **Infinite** | 1.08 × (1.02–1.12) **TanStack** |
| Time until settled (lower is better) | 230 ms (±8.69) | 350 ms (±4.33) | 180 ms (±3.27) | 198 ms (±6.38) | 0.86 × (0.83–0.91) **Infinite** | 0.57 × (0.55–0.58) **Infinite** | 1.10 × (1.06–1.12) **TanStack** |
| Main thread: scripting (lower is better) | 212 ms (±7.19) | 227 ms (±4.22) | 168 ms (±2.78) | 177 ms (±9.97) | 0.84 × (0.81–0.90) **Infinite** | 0.78 × (0.76–0.82) **Infinite** | 1.06 × (1.03–1.10) **TanStack** |
| Main thread: layout (lower is better) | 5.39 ms (±0.39) | 6.10 ms (±0.12) | 6.68 ms (±1.16) | 3.06 ms (±0.23) | 0.57 × (0.52–0.67) **Infinite** | 0.50 × (0.48–0.57) **Infinite** | 0.46 × (0.37–0.58) **Infinite** |
| Main thread: style recalc (lower is better) | 6.04 ms (±0.15) | 9.96 ms (±0.15) | 2.22 ms (±0.10) | 6.18 ms (±0.41) | 1.02 × (0.94–1.09) ≈ | 0.62 × (0.58–0.66) **Infinite** | 2.79 × (2.54–3.07) **TanStack** |
| Main thread: all tasks (lower is better) | 250 ms (±8.39) | 254 ms (±4.46) | 182 ms (±3.40) | 198 ms (±7.07) | 0.79 × (0.78–0.84) **Infinite** | 0.78 × (0.77–0.81) **Infinite** | 1.09 × (1.07–1.13) **TanStack** |
| JS heap retained by grid (lower is better) | 54.2 MB (±0.00) | 67.4 MB (±0.00) | 86.6 MB (±0.00) | 36.6 MB (±0.48) | 0.68 × (0.66–0.68) **Infinite** | 0.54 × (0.53–0.54) **Infinite** | 0.42 × (0.41–0.42) **Infinite** |
| DOM elements in grid (lower is better) | 529 (±0.00) | 637 (±0.00) | 352 (±0.00) | 609 (±0.00) | 1.15 × (1.15–1.15) **MUI X** | 0.96 × (0.96–0.96) **Infinite** | 1.73 × (1.73–1.73) **TanStack** |

## sort-string - 300,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 782 ms (±145) | 652 ms (±83.1) | 954 ms (±92.2) | 337 ms (±35.8) | 0.43 × (0.33–0.54) **Infinite** | 0.52 × (0.40–0.60) **Infinite** | 0.35 × (0.31–0.40) **Infinite** |
| Ascending: click to settled (lower is better) | 782 ms (±145) | 652 ms (±83.1) | 954 ms (±92.2) | 350 ms (±39.0) | 0.45 × (0.34–0.57) **Infinite** | 0.54 × (0.41–0.63) **Infinite** | 0.37 × (0.32–0.42) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 913 ms (±106) | 714 ms (±89.2) | 991 ms (±103) | 361 ms (±37.9) | 0.39 × (0.35–0.50) **Infinite** | 0.50 × (0.44–0.67) **Infinite** | 0.36 × (0.31–0.41) **Infinite** |
| Descending: click to settled (lower is better) | 913 ms (±106) | 714 ms (±89.2) | 991 ms (±103) | 361 ms (±37.9) | 0.39 × (0.35–0.50) **Infinite** | 0.50 × (0.44–0.67) **Infinite** | 0.36 × (0.31–0.41) **Infinite** |
| Ascending: main thread scripting (lower is better) | 772 ms (±144) | 636 ms (±82.6) | 946 ms (±91.8) | 322 ms (±36.1) | 0.42 × (0.32–0.53) **Infinite** | 0.51 × (0.39–0.59) **Infinite** | 0.34 × (0.30–0.39) **Infinite** |
| Descending: main thread scripting (lower is better) | 906 ms (±105) | 702 ms (±88.7) | 984 ms (±103) | 344 ms (±37.3) | 0.38 × (0.33–0.49) **Infinite** | 0.49 × (0.43–0.66) **Infinite** | 0.35 × (0.30–0.40) **Infinite** |

## sort-number - 300,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 404 ms (±37.4) | 606 ms (±52.7) | 638 ms (±77.5) | 154 ms (±2.78) | 0.38 × (0.35–0.39) **Infinite** | 0.25 × (0.24–0.28) **Infinite** | 0.24 × (0.20–0.25) **Infinite** |
| Ascending: click to settled (lower is better) | 404 ms (±37.4) | 606 ms (±52.7) | 638 ms (±77.5) | 165 ms (±1.35) | 0.41 × (0.37–0.41) **Infinite** | 0.27 × (0.26–0.30) **Infinite** | 0.26 × (0.21–0.27) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 537 ms (±40.8) | 547 ms (±59.1) | 615 ms (±38.7) | 148 ms (±3.43) | 0.27 × (0.24–0.28) **Infinite** | 0.27 × (0.24–0.28) **Infinite** | 0.24 × (0.22–0.25) **Infinite** |
| Descending: click to settled (lower is better) | 537 ms (±40.8) | 547 ms (±59.1) | 615 ms (±38.7) | 148 ms (±3.43) | 0.27 × (0.24–0.28) **Infinite** | 0.27 × (0.24–0.28) **Infinite** | 0.24 × (0.22–0.25) **Infinite** |
| Ascending: main thread scripting (lower is better) | 395 ms (±37.1) | 592 ms (±52.5) | 629 ms (±77.6) | 139 ms (±2.72) | 0.35 × (0.32–0.36) **Infinite** | 0.23 × (0.22–0.26) **Infinite** | 0.22 × (0.18–0.23) **Infinite** |
| Descending: main thread scripting (lower is better) | 530 ms (±40.4) | 535 ms (±59.0) | 607 ms (±38.9) | 131 ms (±3.09) | 0.25 × (0.21–0.25) **Infinite** | 0.24 × (0.22–0.25) **Infinite** | 0.22 × (0.20–0.22) **Infinite** |

## scroll-jump - 300,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 17.6 ms (±0.62) | 25.3 ms (±0.46) | 9.24 ms (±0.61) | 24.2 ms (±0.88) | 1.37 × (1.32–1.44) **MUI X** | 0.96 × (0.92–0.99) **Infinite** | 2.62 × (2.38–2.77) **TanStack** |
| Jump to rows painted (worst jump) (lower is better) | 28.9 ms (±1.43) | 43.3 ms (±2.61) | 17.3 ms (±1.79) | 31.8 ms (±11.8) | 1.10 × (1.05–1.19) **MUI X** | 0.74 × (0.71–0.78) **Infinite** | 1.84 × (1.71–1.95) **TanStack** |
| Jump to settled (median of jumps) (lower is better) | 17.6 ms (±0.62) | 25.3 ms (±0.46) | 9.24 ms (±0.61) | 24.2 ms (±0.88) | 1.37 × (1.32–1.44) **MUI X** | 0.96 × (0.92–0.99) **Infinite** | 2.62 × (2.38–2.77) **TanStack** |
| Main thread scripting (all jumps) (lower is better) | 113 ms (±6.00) | 161 ms (±4.80) | 63.0 ms (±5.02) | 134 ms (±16.3) | 1.19 × (1.08–1.23) **MUI X** | 0.83 × (0.81–0.86) **Infinite** | 2.12 × (1.97–2.42) **TanStack** |

## scroll-vertical - 300,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 50.3 % (±0.05) | 52.3 % (±6.68) | 100 % (±18.8) | 59.1 % (±1.78) | 1.17 × (1.17–1.21) **Infinite** | 1.13 × (1.05–1.17) **Infinite** | 0.59 × (0.59–0.61) **TanStack** |
| Frames presented without main-thread update (lower is better) | 49.5 % (±0.05) | 47.7 % (±6.71) | 0.00 % (±18.7) | 40.9 % (±1.85) | 0.83 × (0.78–0.83) **Infinite** | 0.86 × (0.81–0.94) **Infinite** | +40.9 (+38.7 to +41.2) **TanStack** |
| Frames dropped (lower is better) | 0.27 % (±0.00) | 0.29 % (±0.17) | 0.00 % (±0.10) | 0.00 % (±0.21) | 0.00 × (0.00–0.00) **Infinite** | -0.29 (-0.38 to -0.29) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.12) | 60.0 fps (±0.12) | 60.0 fps (±0.00) | 59.7 fps (±0.25) | 0.99 × (0.99–0.99) **MUI X** | 0.99 × (0.99–0.99) **AG Grid** | 0.99 × (0.99–0.99) **TanStack** |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.7 ms (±0.04) | 16.7 ms (±0.05) | 16.8 ms (±0.05) | 1.01 × (1.00–1.01) ≈ | 1.01 × (1.00–1.01) ≈ | 1.01 × (0.99–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±6.24) | 16.8 ms (±6.20) | 16.8 ms (±0.00) | 33.4 ms (±6.33) | 1.99 × (1.98–1.99) **MUI X** | 1.99 × (1.98–1.99) **AG Grid** | 1.99 × (1.98–1.99) **TanStack** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.21) | 0.00 % (±0.20) | 0.00 % (±0.00) | 0.54 % (±0.29) | +0.54 (+0.54 to +1.09) **MUI X** | +0.54 (+0.54 to +1.09) **AG Grid** | +0.54 (+0.54 to +1.09) **TanStack** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 517 ms (±42.2) | 479 ms (±22.4) | 260 ms (±32.0) | 489 ms (±44.4) | 0.95 × (0.86–1.13) ≈ | 1.02 × (0.95–1.16) ≈ | 1.89 × (1.56–2.14) **TanStack** |
| Main thread: layout (lower is better) | 55.9 ms (±2.52) | 80.8 ms (±5.50) | 66.9 ms (±7.87) | 69.6 ms (±9.99) | 1.24 × (1.10–1.52) **MUI X** | 0.86 × (0.74–1.04) ≈ | 1.04 × (0.82–1.28) ≈ |
| Main thread: style recalc (lower is better) | 76.2 ms (±3.66) | 218 ms (±7.72) | 37.0 ms (±3.82) | 155 ms (±13.4) | 2.04 × (1.84–2.31) **MUI X** | 0.71 × (0.66–0.80) **Infinite** | 4.20 × (3.59–4.73) **TanStack** |
| Main thread: all tasks (lower is better) | 1232 ms (±82.0) | 1224 ms (±60.1) | 692 ms (±69.9) | 1099 ms (±117) | 0.89 × (0.81–1.08) ≈ | 0.90 × (0.83–1.03) ≈ | 1.59 × (1.33–1.85) **TanStack** |

## scroll-horizontal - 300,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 80.3 % (±4.85) | 93.2 % (±9.18) | 89.8 % (±9.88) | 95.8 % (±3.50) | 1.19 × (1.11–1.33) **Infinite** | 1.03 × (0.89–1.18) ≈ | 1.07 × (0.89–1.20) ≈ |
| Frames presented without main-thread update (lower is better) | 19.0 % (±4.42) | 5.93 % (±8.96) | 9.45 % (±9.53) | 4.20 % (±3.50) | 0.22 × (0.16–0.58) **Infinite** | -1.74 (-14.3 to +11.0) ≈ | -5.25 (-15.5 to +11.0) ≈ |
| Frames dropped (lower is better) | 0.70 % (±0.44) | 0.00 % (±0.42) | 0.70 % (±0.39) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 (-0.74 to 0.00) ≈ | -0.70 (-0.71 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.8 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±0.04) | 1.00 × (0.99–1.00) ≈ | 0.99 × (0.99–1.00) ≈ | 1.00 × (0.99–1.00) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 320 ms (±19.6) | 225 ms (±8.02) | 145 ms (±7.46) | 121 ms (±3.29) | 0.38 × (0.35–0.39) **Infinite** | 0.54 × (0.53–0.57) **Infinite** | 0.83 × (0.81–0.86) **Infinite** |
| Main thread: layout (lower is better) | 42.1 ms (±2.16) | 64.2 ms (±2.74) | 47.1 ms (±2.14) | 10.7 ms (±0.20) | 0.25 × (0.24–0.27) **Infinite** | 0.17 × (0.16–0.17) **Infinite** | 0.23 × (0.22–0.24) **Infinite** |
| Main thread: style recalc (lower is better) | 22.4 ms (±1.30) | 38.3 ms (±0.98) | 14.4 ms (±0.68) | 42.6 ms (±1.50) | 1.91 × (1.80–1.97) **MUI X** | 1.11 × (1.06–1.14) **AG Grid** | 2.97 × (2.84–3.11) **TanStack** |
| Main thread: all tasks (lower is better) | 602 ms (±41.8) | 582 ms (±20.9) | 439 ms (±20.9) | 360 ms (±11.5) | 0.60 × (0.54–0.61) **Infinite** | 0.62 × (0.61–0.63) **Infinite** | 0.82 × (0.80–0.83) **Infinite** |

## correctness-vertical - 300,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 2.53 % (±0.75) | 1.54 % (±0.80) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 44.8 % (±2.35) | +44.8 (+41.0 to +46.0) **MUI X** | +44.8 (+41.0 to +46.0) **AG Grid** | +44.8 (+41.0 to +46.0) **TanStack** |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 12.7 % (±3.74) | 7.69 % (±4.02) | 88.9 % (±1.03) | +88.9 (+88.1 to +90.0) **MUI X** | 7.02 × (6.37–11.7) **AG Grid** | 11.6 × (6.29–14.1) **TanStack** |
| Worst frame: correct samples (higher is better) | 100 % (±0.00) | 80.0 % (±0.00) | 80.0 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **MUI X** | 0.00 × (0.00–0.00) **AG Grid** | 0.00 × (0.00–0.00) **TanStack** |

## correctness-horizontal - 300,000 rows

Same kind of horizontal wheel gesture. After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: correct samples (higher is better) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |

## visual-blank-vertical - 300,000 rows

Fast vertical wheel gesture (20000px/s) while recording what the compositor actually displays (CDP screencast). Each frame is checked for blank areas: vertical runs of the body with no text where rows should be. Unlike the correctness probe, this also catches the compositor scrolling ahead of the main thread. Screencast capture skips frames under load and adds overhead - compare the grids, not absolute numbers.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Captured frames with blank rows (lower is better) | 0.00 % (±0.00) | 4.48 % (±4.73) | 1.37 % (±0.74) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | -1.37 (-1.37 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 0.00 % (±0.00) | 0.91 % (±1.21) | 0.07 % (±0.13) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | -0.07 (-0.07 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 0.00 rows (±0.00) | 4.00 rows (±3.60) | 1.00 rows (±1.77) | 0.00 rows (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | -1.00 (-1.00 to 0.00) ≈ |
| Captured frames (higher is better) | 71.0 (±2.14) | 67.0 (±1.68) | 73.0 (±1.25) | 73.0 (±0.49) | 1.03 × (1.01–1.04) **Infinite** | 1.09 × (1.06–1.12) **Infinite** | 1.00 × (1.00–1.03) ≈ |

# 1,000,000 rows

Scroll range - browsers cap element sizes (Chrome ~16.7M-33.5M px, depending on the version), so a grid has to map the scrollbar onto the rows when the content is taller than that. One that doesn't can't reach its last rows: its scrolling results are for the rows it can reach, and the same wheel gesture goes over fewer rows in it.

| | MUI X | AG Grid | TanStack | Infinite |
|---|---:|---:|---:|---:|
| Last row reachable with the scrollbar | **no** - stops at row 838,860 | yes (1,000,000) | **no** - stops at row 838,860 | yes (1,000,000) |
| Native scroll range | 33,553,620 px | 31,999,242 px | 33,553,632 px | 31,999,242 px |
| Content px per scrollbar px | 1.000 | 1.250 | 1.000 | 1.250 |

## mount - 1,000,000 rows

Mount the grid with all the rows (data already in memory). "Visible" = from setState to the end of the first frame committed with the whole viewport (first/last visible row and column) showing the right content. "Settled" = until the first frame committed after the grid's last DOM mutation. Memory is the JS heap retained by the grid after GC (heap after mount - heap before mount).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Time to first rows painted (lower is better) | 471 ms (±17.2) | 577 ms (±6.79) | 459 ms (±6.62) | 347 ms (±22.0) | 0.74 × (0.71–0.74) **Infinite** | 0.60 × (0.58–0.61) **Infinite** | 0.75 × (0.73–0.77) **Infinite** |
| Time until settled (lower is better) | 471 ms (±17.2) | 679 ms (±6.86) | 459 ms (±6.62) | 347 ms (±22.0) | 0.74 × (0.71–0.74) **Infinite** | 0.51 × (0.49–0.52) **Infinite** | 0.75 × (0.73–0.77) **Infinite** |
| Main thread: scripting (lower is better) | 461 ms (±17.1) | 557 ms (±6.33) | 451 ms (±6.63) | 326 ms (±22.0) | 0.71 × (0.68–0.72) **Infinite** | 0.59 × (0.57–0.59) **Infinite** | 0.72 × (0.70–0.74) **Infinite** |
| Main thread: layout (lower is better) | 3.60 ms (±0.06) | 5.56 ms (±0.19) | 3.60 ms (±0.14) | 3.73 ms (±0.19) | 1.04 × (1.00–1.08) ≈ | 0.67 × (0.64–0.70) **Infinite** | 1.04 × (0.99–1.13) ≈ |
| Main thread: style recalc (lower is better) | 3.88 ms (±0.10) | 9.15 ms (±0.29) | 1.72 ms (±0.16) | 7.63 ms (±0.62) | 1.97 × (1.82–2.03) **MUI X** | 0.83 × (0.74–0.86) **Infinite** | 4.43 × (4.11–5.24) **TanStack** |
| Main thread: all tasks (lower is better) | 474 ms (±17.7) | 584 ms (±7.10) | 473 ms (±3.90) | 349 ms (±22.2) | 0.74 × (0.71–0.74) **Infinite** | 0.60 × (0.58–0.61) **Infinite** | 0.74 × (0.72–0.75) **Infinite** |
| JS heap retained by grid (lower is better) | 150 MB (±0.00) | 213 MB (±0.00) | 287 MB (±0.00) | 90.7 MB (±0.02) | 0.60 × (0.60–0.60) **Infinite** | 0.42 × (0.42–0.42) **Infinite** | 0.32 × (0.32–0.32) **Infinite** |
| DOM elements in grid (lower is better) | 529 (±0.00) | 637 (±0.00) | 352 (±0.00) | 609 (±0.00) | 1.15 × (1.15–1.15) **MUI X** | 0.96 × (0.96–0.96) **Infinite** | 1.73 × (1.73–1.73) **TanStack** |

## sort-string - 1,000,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 3869 ms (±324) | 3188 ms (±63.7) | 4298 ms (±296) | 1559 ms (±80.2) | 0.40 × (0.35–0.45) **Infinite** | 0.49 × (0.45–0.50) **Infinite** | 0.36 × (0.32–0.39) **Infinite** |
| Ascending: click to settled (lower is better) | 3869 ms (±324) | 3188 ms (±63.7) | 4298 ms (±296) | 1566 ms (±78.2) | 0.40 × (0.35–0.45) **Infinite** | 0.49 × (0.45–0.50) **Infinite** | 0.36 × (0.33–0.39) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 4146 ms (±267) | 3078 ms (±91.2) | 4418 ms (±351) | 1712 ms (±181) | 0.41 × (0.38–0.46) **Infinite** | 0.56 × (0.51–0.59) **Infinite** | 0.39 × (0.36–0.44) **Infinite** |
| Descending: click to settled (lower is better) | 4146 ms (±267) | 3078 ms (±91.2) | 4418 ms (±351) | 1712 ms (±181) | 0.41 × (0.38–0.46) **Infinite** | 0.56 × (0.51–0.59) **Infinite** | 0.39 × (0.36–0.44) **Infinite** |
| Ascending: main thread scripting (lower is better) | 3856 ms (±324) | 3171 ms (±63.4) | 4291 ms (±296) | 1544 ms (±80.4) | 0.40 × (0.35–0.45) **Infinite** | 0.49 × (0.45–0.49) **Infinite** | 0.36 × (0.32–0.38) **Infinite** |
| Descending: main thread scripting (lower is better) | 4139 ms (±265) | 3067 ms (±91.2) | 4412 ms (±351) | 1696 ms (±181) | 0.41 × (0.38–0.46) **Infinite** | 0.55 × (0.50–0.58) **Infinite** | 0.38 × (0.35–0.44) **Infinite** |

## sort-number - 1,000,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 2095 ms (±85.9) | 2846 ms (±116) | 3705 ms (±168) | 452 ms (±17.5) | 0.22 × (0.21–0.23) **Infinite** | 0.16 × (0.15–0.17) **Infinite** | 0.12 × (0.12–0.13) **Infinite** |
| Ascending: click to settled (lower is better) | 2095 ms (±85.9) | 2846 ms (±116) | 3705 ms (±168) | 464 ms (±18.3) | 0.22 × (0.21–0.24) **Infinite** | 0.16 × (0.16–0.17) **Infinite** | 0.13 × (0.12–0.13) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 2903 ms (±115) | 2865 ms (±106) | 3564 ms (±195) | 495 ms (±44.0) | 0.17 × (0.15–0.18) **Infinite** | 0.17 × (0.15–0.18) **Infinite** | 0.14 × (0.12–0.15) **Infinite** |
| Descending: click to settled (lower is better) | 2903 ms (±115) | 2865 ms (±106) | 3564 ms (±195) | 495 ms (±44.0) | 0.17 × (0.15–0.18) **Infinite** | 0.17 × (0.15–0.18) **Infinite** | 0.14 × (0.12–0.15) **Infinite** |
| Ascending: main thread scripting (lower is better) | 2085 ms (±85.6) | 2832 ms (±117) | 3698 ms (±168) | 438 ms (±17.4) | 0.21 × (0.20–0.22) **Infinite** | 0.15 × (0.15–0.16) **Infinite** | 0.12 × (0.11–0.12) **Infinite** |
| Descending: main thread scripting (lower is better) | 2895 ms (±114) | 2864 ms (±105) | 3556 ms (±195) | 478 ms (±44.4) | 0.17 × (0.14–0.18) **Infinite** | 0.17 × (0.15–0.18) **Infinite** | 0.13 × (0.12–0.14) **Infinite** |

## scroll-jump - 1,000,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 20.0 ms (±1.38) | 28.7 ms (±2.07) | 10.6 ms (±0.37) | 30.9 ms (±1.56) | 1.54 × (1.34–1.58) **MUI X** | 1.07 × (0.90–1.10) ≈ | 2.92 × (2.69–3.03) **TanStack** |
| Jump to rows painted (worst jump) (lower is better) | 38.5 ms (±2.27) | 56.3 ms (±2.64) | 29.0 ms (±2.08) | 41.2 ms (±3.49) | 1.07 × (1.05–1.24) **MUI X** | 0.73 × (0.69–0.81) **Infinite** | 1.42 × (1.28–1.60) **TanStack** |
| Jump to settled (median of jumps) (lower is better) | 20.0 ms (±1.38) | 28.7 ms (±2.07) | 10.6 ms (±0.37) | 30.9 ms (±1.56) | 1.54 × (1.34–1.58) **MUI X** | 1.07 × (0.90–1.10) ≈ | 2.92 × (2.69–3.03) **TanStack** |
| Main thread scripting (all jumps) (lower is better) | 135 ms (±8.15) | 192 ms (±13.0) | 71.8 ms (±4.39) | 175 ms (±8.32) | 1.30 × (1.19–1.37) **MUI X** | 0.91 × (0.85–0.97) **Infinite** | 2.43 × (2.34–2.63) **TanStack** |

## scroll-vertical - 1,000,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 50.3 % (±0.00) | 50.8 % (±1.43) | 100 % (±0.00) | 59.7 % (±1.52) | 1.19 × (1.16–1.20) **Infinite** | 1.17 × (1.15–1.19) **Infinite** | 0.60 × (0.58–0.60) **TanStack** |
| Frames presented without main-thread update (lower is better) | 49.5 % (±0.00) | 48.9 % (±1.33) | 0.00 % (±0.00) | 40.3 % (±1.52) | 0.81 × (0.80–0.84) **Infinite** | 0.82 × (0.81–0.85) **Infinite** | +40.3 (+39.7 to +41.6) **TanStack** |
| Frames dropped (lower is better) | 0.27 % (±0.00) | 0.28 % (±0.11) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | -0.28 (-0.28 to -0.28) **Infinite** | 0.00 (0.00 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.94) | 1.00 × (0.97–1.00) ≈ | 1.00 × (0.97–1.00) ≈ | 1.00 × (0.97–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.04) | 16.8 ms (±0.05) | 16.7 ms (±0.05) | 16.8 ms (±0.05) | 1.01 × (1.00–1.01) ≈ | 1.00 × (0.99–1.01) ≈ | 1.01 × (0.99–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±31.0) | 1.00 × (1.00–2.98) ≈ | 1.00 × (1.00–2.98) ≈ | 1.00 × (1.00–2.98) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.81) | 0.00 (0.00 to +1.64) ≈ | 0.00 (0.00 to +1.64) ≈ | 0.00 (0.00 to +1.64) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 409 ms (±11.0) | 541 ms (±28.1) | 222 ms (±9.68) | 554 ms (±15.8) | 1.36 × (1.30–1.43) **MUI X** | 1.02 × (0.94–1.05) ≈ | 2.50 × (2.35–2.53) **TanStack** |
| Main thread: layout (lower is better) | 50.6 ms (±1.26) | 83.4 ms (±5.04) | 59.1 ms (±2.89) | 73.5 ms (±4.32) | 1.45 × (1.39–1.58) **MUI X** | 0.88 × (0.83–0.98) **Infinite** | 1.24 × (1.19–1.37) **TanStack** |
| Main thread: style recalc (lower is better) | 70.5 ms (±1.21) | 325 ms (±17.2) | 32.7 ms (±1.17) | 195 ms (±3.77) | 2.76 × (2.72–2.85) **MUI X** | 0.60 × (0.55–0.62) **Infinite** | 5.95 × (5.72–6.13) **TanStack** |
| Main thread: all tasks (lower is better) | 1042 ms (±23.5) | 1429 ms (±63.5) | 666 ms (±23.5) | 1210 ms (±30.2) | 1.16 × (1.13–1.22) **MUI X** | 0.85 × (0.80–0.88) **Infinite** | 1.82 × (1.76–1.90) **TanStack** |

## scroll-horizontal - 1,000,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 92.7 % (±9.35) | 100 % (±3.44) | 100 % (±0.00) | 90.2 % (±3.69) | 0.97 × (0.90–1.20) ≈ | 0.90 × (0.89–0.97) **AG Grid** | 0.90 × (0.89–0.97) **TanStack** |
| Frames presented without main-thread update (lower is better) | 6.50 % (±9.12) | 0.00 % (±3.12) | 0.00 % (±0.00) | 8.50 % (±3.59) | +1.99 (-15.5 to +10.3) ≈ | +8.50 (+3.50 to +11.0) **AG Grid** | +8.50 (+3.50 to +11.0) **TanStack** |
| Frames dropped (lower is better) | 0.70 % (±0.37) | 0.00 % (±0.31) | 0.00 % (±0.00) | 0.00 % (±0.49) | -0.70 (-0.81 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.7 ms (±0.04) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 1.00 × (0.99–1.01) ≈ | 1.00 × (1.00–1.01) ≈ | 1.00 × (0.99–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 235 ms (±5.20) | 166 ms (±4.99) | 96.7 ms (±2.13) | 108 ms (±5.27) | 0.46 × (0.42–0.47) **Infinite** | 0.65 × (0.60–0.66) **Infinite** | 1.11 × (1.04–1.14) **TanStack** |
| Main thread: layout (lower is better) | 33.1 ms (±0.51) | 46.3 ms (±1.19) | 30.9 ms (±2.31) | 9.29 ms (±0.12) | 0.28 × (0.28–0.29) **Infinite** | 0.20 × (0.19–0.20) **Infinite** | 0.30 × (0.29–0.31) **Infinite** |
| Main thread: style recalc (lower is better) | 18.8 ms (±0.36) | 33.4 ms (±0.71) | 9.93 ms (±0.15) | 33.8 ms (±0.77) | 1.80 × (1.76–1.85) **MUI X** | 1.01 × (0.99–1.03) ≈ | 3.40 × (3.29–3.43) **TanStack** |
| Main thread: all tasks (lower is better) | 512 ms (±8.21) | 413 ms (±65.3) | 265 ms (±7.50) | 333 ms (±11.1) | 0.65 × (0.63–0.67) **Infinite** | 0.81 × (0.63–0.84) **Infinite** | 1.25 × (1.22–1.29) **TanStack** |

## correctness-vertical - 1,000,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 2.00 % (±0.65) | 2.82 % (±0.63) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 50.8 % (±1.75) | +50.8 (+50.3 to +52.3) **MUI X** | +50.8 (+50.3 to +52.3) **AG Grid** | +50.8 (+50.3 to +52.3) **TanStack** |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 10.0 % (±3.25) | 14.1 % (±3.17) | 89.1 % (±0.53) | +89.1 (+88.6 to +89.6) **MUI X** | 8.91 × (7.48–13.2) **AG Grid** | 6.32 × (4.88–7.73) **TanStack** |
| Worst frame: correct samples (higher is better) | 100 % (±0.00) | 80.0 % (±0.00) | 80.0 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **MUI X** | 0.00 × (0.00–0.00) **AG Grid** | 0.00 × (0.00–0.00) **TanStack** |

## correctness-horizontal - 1,000,000 rows

Same kind of horizontal wheel gesture. After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: correct samples (higher is better) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |

## visual-blank-vertical - 1,000,000 rows

Fast vertical wheel gesture (20000px/s) while recording what the compositor actually displays (CDP screencast). Each frame is checked for blank areas: vertical runs of the body with no text where rows should be. Unlike the correctness probe, this also catches the compositor scrolling ahead of the main thread. Screencast capture skips frames under load and adds overhead - compare the grids, not absolute numbers.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Captured frames with blank rows (lower is better) | 0.00 % (±0.00) | 16.7 % (±3.82) | 2.99 % (±2.50) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Blank body area (avg over frames) (lower is better) | 0.00 % (±0.00) | 7.74 % (±1.35) | 0.54 % (±0.59) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Worst frame: blank rows (lower is better) | 0.00 rows (±0.00) | 17.0 rows (±0.90) | 3.00 rows (±3.29) | 0.00 rows (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Captured frames (higher is better) | 69.0 (±1.51) | 59.0 (±2.30) | 70.0 (±1.51) | 73.0 (±0.76) | 1.06 × (1.03–1.09) **Infinite** | 1.24 × (1.20–1.30) **Infinite** | 1.04 × (1.01–1.07) **Infinite** |
