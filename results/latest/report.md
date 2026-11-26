# MUI X Data Grid vs AG Grid vs TanStack Table vs Infinite Table — benchmark report

- Run: `ci` · 2026-11-26T21:44:41.104Z
- MUI X Data Grid 9.18.0 · AG Grid 36.3.0 · TanStack Table 9.3.1 · Infinite Table 11.0.0
- 1,000,000 rows (data checksum `1000000:19e5eebe`) × 20 columns, identical data for every grid
- Chrome 136.0.7103.25 · headless · CPU throttling 1× · viewport 1400×1000
- 5 measured runs per grid per scenario (+1 warmup, discarded), interleaved, fresh browser context per run
- Linux 7.0.0-1020-azure x64 · AMD EPYC 9V74 80-Core Processor × 4
- Served from http://localhost:5560/
- Grid body: 757-758 px high, with the same number of rows in view in every grid (to get there, the setup made the boxes taller: MUI X +14 px, Infinite +22 px)

The "Infinite vs ..." columns compare Infinite Table with one other grid: the ratio of the medians (Infinite / other, so < 1 means Infinite has the lower value), its 95% bootstrap confidence interval, and the grid that does better. A grid is only named when the interval excludes 1; "≈" means no significant difference. When the other grid has zeros among its values (e.g. 0% blank samples) a ratio means nothing, so the difference of the medians (Infinite − other) and its interval are shown instead, and a grid is only named when that interval excludes 0.

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
| Time to first rows painted (lower is better) | 648 ms (±20.2) | 796 ms (±17.0) | 657 ms (±12.8) | 519 ms (±19.5) | 0.80 × (0.75–0.85) **Infinite** | 0.65 × (0.62–0.69) **Infinite** | 0.79 × (0.75–0.84) **Infinite** |
| Time until settled (lower is better) | 648 ms (±20.2) | 898 ms (±16.9) | 657 ms (±12.8) | 519 ms (±19.5) | 0.80 × (0.75–0.85) **Infinite** | 0.58 × (0.55–0.61) **Infinite** | 0.79 × (0.75–0.84) **Infinite** |
| Main thread: scripting (lower is better) | 634 ms (±20.0) | 771 ms (±16.4) | 647 ms (±12.7) | 492 ms (±19.6) | 0.78 × (0.73–0.82) **Infinite** | 0.64 × (0.61–0.68) **Infinite** | 0.76 × (0.72–0.81) **Infinite** |
| Main thread: layout (lower is better) | 4.52 ms (±0.13) | 6.90 ms (±0.14) | 4.23 ms (±0.24) | 5.40 ms (±0.69) | 1.20 × (1.11–1.50) **MUI X** | 0.78 × (0.73–0.98) **Infinite** | 1.28 × (1.13–1.60) **TanStack** |
| Main thread: style recalc (lower is better) | 4.77 ms (±0.11) | 11.4 ms (±0.45) | 1.61 ms (±0.27) | 10.2 ms (±0.27) | 2.14 × (2.10–2.26) **MUI X** | 0.90 × (0.83–0.95) **Infinite** | 6.33 × (4.62–6.68) **TanStack** |
| Main thread: all tasks (lower is better) | 652 ms (±19.9) | 803 ms (±17.3) | 660 ms (±6.72) | 523 ms (±19.6) | 0.80 × (0.75–0.85) **Infinite** | 0.65 × (0.62–0.69) **Infinite** | 0.79 × (0.76–0.84) **Infinite** |
| JS heap retained by grid (lower is better) | 150 MB (±0.00) | 213 MB (±0.02) | 287 MB (±0.00) | 90.7 MB (±0.03) | 0.60 × (0.60–0.60) **Infinite** | 0.42 × (0.42–0.43) **Infinite** | 0.32 × (0.32–0.32) **Infinite** |
| DOM elements in grid (lower is better) | 529 (±0.00) | 637 (±0.00) | 352 (±0.00) | 609 (±0.00) | 1.15 × (1.15–1.15) **MUI X** | 0.96 × (0.96–0.96) **Infinite** | 1.73 × (1.73–1.73) **TanStack** |

## sort-string - 1,000,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 4435 ms (±102) | 3544 ms (±47.5) | 4704 ms (±92.5) | 1813 ms (±69.0) | 0.41 × (0.39–0.44) **Infinite** | 0.51 × (0.49–0.54) **Infinite** | 0.39 × (0.36–0.41) **Infinite** |
| Ascending: click to settled (lower is better) | 4435 ms (±102) | 3544 ms (±47.5) | 4704 ms (±92.5) | 1829 ms (±65.9) | 0.41 × (0.39–0.44) **Infinite** | 0.52 × (0.49–0.54) **Infinite** | 0.39 × (0.37–0.41) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 4472 ms (±153) | 3617 ms (±90.4) | 4765 ms (±173) | 2060 ms (±73.4) | 0.46 × (0.43–0.47) **Infinite** | 0.57 × (0.53–0.59) **Infinite** | 0.43 × (0.40–0.45) **Infinite** |
| Descending: click to settled (lower is better) | 4472 ms (±153) | 3617 ms (±90.4) | 4765 ms (±173) | 2060 ms (±73.4) | 0.46 × (0.43–0.47) **Infinite** | 0.57 × (0.53–0.59) **Infinite** | 0.43 × (0.40–0.45) **Infinite** |
| Ascending: main thread scripting (lower is better) | 4424 ms (±102) | 3527 ms (±48.5) | 4696 ms (±90.2) | 1796 ms (±69.3) | 0.41 × (0.39–0.43) **Infinite** | 0.51 × (0.49–0.54) **Infinite** | 0.38 × (0.36–0.40) **Infinite** |
| Descending: main thread scripting (lower is better) | 4464 ms (±153) | 3602 ms (±90.0) | 4758 ms (±173) | 2043 ms (±73.6) | 0.46 × (0.42–0.47) **Infinite** | 0.57 × (0.53–0.59) **Infinite** | 0.43 × (0.40–0.45) **Infinite** |

## sort-number - 1,000,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 2315 ms (±67.0) | 3024 ms (±33.7) | 3948 ms (±120) | 534 ms (±11.1) | 0.23 × (0.22–0.24) **Infinite** | 0.18 × (0.17–0.18) **Infinite** | 0.14 × (0.13–0.14) **Infinite** |
| Ascending: click to settled (lower is better) | 2315 ms (±67.0) | 3024 ms (±33.7) | 3948 ms (±120) | 548 ms (±8.90) | 0.24 × (0.23–0.25) **Infinite** | 0.18 × (0.18–0.18) **Infinite** | 0.14 × (0.13–0.14) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 3182 ms (±93.8) | 3084 ms (±19.8) | 3847 ms (±147) | 575 ms (±45.1) | 0.18 × (0.15–0.19) **Infinite** | 0.19 × (0.16–0.19) **Infinite** | 0.15 × (0.13–0.16) **Infinite** |
| Descending: click to settled (lower is better) | 3182 ms (±93.8) | 3084 ms (±19.8) | 3847 ms (±147) | 575 ms (±45.1) | 0.18 × (0.15–0.19) **Infinite** | 0.19 × (0.16–0.19) **Infinite** | 0.15 × (0.13–0.16) **Infinite** |
| Ascending: main thread scripting (lower is better) | 2300 ms (±66.6) | 3007 ms (±32.3) | 3939 ms (±120) | 521 ms (±11.2) | 0.23 × (0.22–0.24) **Infinite** | 0.17 × (0.17–0.18) **Infinite** | 0.13 × (0.13–0.14) **Infinite** |
| Descending: main thread scripting (lower is better) | 3174 ms (±94.0) | 3074 ms (±19.0) | 3840 ms (±147) | 558 ms (±45.0) | 0.18 × (0.15–0.18) **Infinite** | 0.18 × (0.16–0.19) **Infinite** | 0.15 × (0.13–0.15) **Infinite** |

## scroll-jump - 1,000,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 23.1 ms (±0.43) | 34.0 ms (±0.93) | 12.1 ms (±0.27) | 33.8 ms (±1.18) | 1.46 × (1.43–1.55) **MUI X** | 0.99 × (0.94–1.05) ≈ | 2.79 × (2.68–2.96) **TanStack** |
| Jump to rows painted (worst jump) (lower is better) | 43.3 ms (±1.86) | 67.0 ms (±2.76) | 34.1 ms (±2.27) | 48.7 ms (±1.53) | 1.13 × (1.06–1.18) **MUI X** | 0.73 × (0.69–0.77) **Infinite** | 1.43 × (1.33–1.59) **TanStack** |
| Jump to settled (median of jumps) (lower is better) | 23.1 ms (±0.43) | 34.0 ms (±0.93) | 12.1 ms (±0.27) | 33.8 ms (±1.18) | 1.46 × (1.43–1.55) **MUI X** | 0.99 × (0.94–1.05) ≈ | 2.79 × (2.68–2.96) **TanStack** |
| Main thread scripting (all jumps) (lower is better) | 155 ms (±2.15) | 227 ms (±6.01) | 79.4 ms (±3.21) | 204 ms (±1.90) | 1.32 × (1.28–1.33) **MUI X** | 0.90 × (0.87–0.93) **Infinite** | 2.57 × (2.36–2.60) **TanStack** |

## scroll-vertical - 1,000,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 50.3 % (±0.12) | 49.9 % (±0.12) | 50.0 % (±0.18) | 63.1 % (±1.01) | 1.26 × (1.24–1.29) **Infinite** | 1.27 × (1.25–1.30) **Infinite** | 1.26 × (1.25–1.30) **Infinite** |
| Frames presented without main-thread update (lower is better) | 49.5 % (±0.12) | 49.0 % (±0.12) | 49.2 % (±0.19) | 36.9 % (±1.01) | 0.75 × (0.71–0.76) **Infinite** | 0.75 × (0.71–0.77) **Infinite** | 0.75 × (0.71–0.77) **Infinite** |
| Frames dropped (lower is better) | 0.27 % (±0.25) | 1.11 % (±0.20) | 0.83 % (±0.37) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.29) | 59.0 fps (±0.23) | 59.4 fps (±0.43) | 56.8 fps (±0.56) | 0.95 × (0.92–0.96) **MUI X** | 0.96 × (0.94–0.97) **AG Grid** | 0.96 × (0.93–0.96) **TanStack** |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.8 ms (±0.00) | 16.7 ms (±0.04) | 16.8 ms (±0.00) | 1.01 × (1.00–1.01) ≈ | 1.00 × (1.00–1.00) ≈ | 1.01 × (1.00–1.01) **TanStack** |
| Worst rAF frame interval (lower is better) | 16.8 ms (±14.8) | 33.4 ms (±0.05) | 50.0 ms (±18.2) | 117 ms (±9.13) | 6.94 × (2.33–6.95) **MUI X** | 3.49 × (2.99–3.50) **AG Grid** | 2.33 × (2.00–6.94) **TanStack** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.30) | 1.64 % (±0.39) | 0.54 % (±0.46) | 1.70 % (±0.77) | +1.70 (+1.16 to +3.49) **MUI X** | 1.04 × (0.78–2.13) ≈ | +1.16 (+0.61 to +2.94) **TanStack** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 657 ms (±21.8) | 841 ms (±15.8) | 398 ms (±27.2) | 780 ms (±8.60) | 1.19 × (1.17–1.28) **MUI X** | 0.93 × (0.90–0.95) **Infinite** | 1.96 × (1.75–2.10) **TanStack** |
| Main thread: layout (lower is better) | 65.6 ms (±1.26) | 108 ms (±3.19) | 86.4 ms (±10.3) | 99.7 ms (±6.74) | 1.52 × (1.48–1.74) **MUI X** | 0.92 × (0.89–1.06) ≈ | 1.15 × (0.92–1.31) ≈ |
| Main thread: style recalc (lower is better) | 93.9 ms (±2.00) | 433 ms (±7.82) | 46.2 ms (±4.63) | 264 ms (±7.57) | 2.81 × (2.60–2.84) **MUI X** | 0.61 × (0.58–0.63) **Infinite** | 5.71 × (4.67–5.78) **TanStack** |
| Main thread: all tasks (lower is better) | 1534 ms (±22.8) | 2036 ms (±34.7) | 992 ms (±50.7) | 1738 ms (±23.4) | 1.13 × (1.11–1.17) **MUI X** | 0.85 × (0.83–0.88) **Infinite** | 1.75 × (1.60–1.81) **TanStack** |

## scroll-horizontal - 1,000,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 65.5 % (±2.46) | 90.9 % (±13.3) | 80.3 % (±4.16) | 95.1 % (±4.28) | 1.45 × (1.33–1.57) **Infinite** | 1.05 × (0.95–1.47) ≈ | 1.18 × (1.09–1.34) **Infinite** |
| Frames presented without main-thread update (lower is better) | 32.8 % (±2.38) | 8.26 % (±12.7) | 19.0 % (±3.92) | 4.90 % (±4.28) | 0.15 × (0.11–0.39) **Infinite** | -3.37 (-28.6 to +4.90) ≈ | 0.26 × (0.18–0.67) **Infinite** |
| Frames dropped (lower is better) | 1.68 % (±0.23) | 0.83 % (±0.61) | 0.70 % (±0.24) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | -0.83 (-1.73 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.04) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±0.04) | 1.00 × (1.00–1.01) ≈ | 1.00 × (0.99–1.01) ≈ | 1.00 × (0.99–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 382 ms (±10.7) | 245 ms (±9.33) | 160 ms (±2.78) | 165 ms (±4.00) | 0.43 × (0.42–0.46) **Infinite** | 0.67 × (0.64–0.71) **Infinite** | 1.03 × (1.01–1.09) **TanStack** |
| Main thread: layout (lower is better) | 48.4 ms (±4.86) | 69.9 ms (±3.05) | 51.3 ms (±3.92) | 12.3 ms (±0.83) | 0.25 × (0.21–0.29) **Infinite** | 0.18 × (0.16–0.20) **Infinite** | 0.24 × (0.21–0.27) **Infinite** |
| Main thread: style recalc (lower is better) | 24.5 ms (±0.31) | 44.0 ms (±3.59) | 14.6 ms (±0.29) | 50.4 ms (±0.75) | 2.06 × (2.01–2.10) **MUI X** | 1.15 × (0.98–1.19) ≈ | 3.46 × (3.38–3.61) **TanStack** |
| Main thread: all tasks (lower is better) | 776 ms (±23.8) | 597 ms (±23.7) | 432 ms (±10.6) | 513 ms (±8.27) | 0.66 × (0.64–0.69) **Infinite** | 0.86 × (0.80–0.89) **Infinite** | 1.19 × (1.15–1.23) **TanStack** |

## correctness-vertical - 1,000,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 2.41 % (±0.98) | 2.13 % (±0.92) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 76.9 % (±1.42) | +76.9 (+74.1 to +77.6) **MUI X** | +76.9 (+74.1 to +77.6) **AG Grid** | +76.9 (+74.1 to +77.6) **TanStack** |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 12.1 % (±4.91) | 10.7 % (±4.58) | 84.2 % (±2.93) | +84.2 (+77.8 to +84.6) **MUI X** | 6.98 × (4.74–16.6) **AG Grid** | 7.89 × (5.05–22.2) **TanStack** |
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
| Captured frames with blank rows (lower is better) | 0.00 % (±0.00) | 50.0 % (±5.96) | 8.33 % (±4.33) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Blank body area (avg over frames) (lower is better) | 0.00 % (±0.00) | 19.1 % (±2.26) | 2.74 % (±1.71) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Worst frame: blank rows (lower is better) | 0.00 rows (±0.00) | 18.0 rows (±0.00) | 16.0 rows (±2.70) | 0.00 rows (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Captured frames (higher is better) | 63.0 (±1.92) | 39.0 (±1.22) | 61.0 (±1.30) | 67.0 (±1.10) | 1.06 × (1.05–1.14) **Infinite** | 1.72 × (1.68–1.81) **Infinite** | 1.10 × (1.08–1.15) **Infinite** |

## updates-low - 1,000,000 rows

Live updates, low frequency. The grid shows the rows in the order of the data. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 469 ms (±22.2) | 105 ms (±2.45) | 481 ms (±13.7) | 337 ms (±28.2) | 0.72 × (0.67–0.83) **Infinite** | 3.19 × (2.98–3.62) **AG Grid** | 0.70 × (0.65–0.81) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 676 ms (±44.9) | 125 ms (±2.78) | 724 ms (±10.6) | 418 ms (±22.8) | 0.62 × (0.57–0.69) **Infinite** | 3.33 × (3.20–3.68) **AG Grid** | 0.58 × (0.56–0.64) **Infinite** |
| Update to settled (median of updates) (lower is better) | 469 ms (±22.2) | 105 ms (±2.45) | 481 ms (±13.7) | 337 ms (±28.2) | 0.72 × (0.67–0.83) **Infinite** | 3.19 × (2.98–3.62) **AG Grid** | 0.70 × (0.65–0.81) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 3.16 ms (±0.15) | 3.17 ms (±0.14) | 4.36 ms (±0.30) | 2.77 ms (±0.16) | 0.88 × (0.81–0.96) **Infinite** | 0.88 × (0.79–0.92) **Infinite** | 0.64 × (0.58–0.72) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 1.85 ms (±0.09) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.29 ms (±0.02) | 0.16 × (0.15–0.17) **Infinite** | +0.29 (+0.28 to +0.32) **AG Grid** | +0.29 (+0.28 to +0.32) **TanStack** |
| Main thread: all tasks (all updates) (lower is better) | 2703 ms (±41.0) | 687 ms (±12.6) | 2658 ms (±43.2) | 1792 ms (±106) | 0.66 × (0.62–0.71) **Infinite** | 2.61 × (2.43–2.78) **AG Grid** | 0.67 × (0.63–0.73) **Infinite** |

## updates-low-sorted - 1,000,000 rows

Live updates, low frequency. The grid shows sorted by salary, highest first - the updates change the salaries, so rows move. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 2401 ms (±23.6) | 3964 ms (±42.0) | 4754 ms (±76.0) | 494 ms (±14.2) | 0.21 × (0.20–0.22) **Infinite** | 0.12 × (0.12–0.13) **Infinite** | 0.10 × (0.10–0.11) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 2736 ms (±64.6) | 4049 ms (±72.7) | 5101 ms (±126) | 634 ms (±40.8) | 0.23 × (0.22–0.26) **Infinite** | 0.16 × (0.15–0.17) **Infinite** | 0.12 × (0.12–0.14) **Infinite** |
| Update to settled (median of updates) (lower is better) | 2401 ms (±23.6) | 3964 ms (±42.0) | 4754 ms (±76.0) | 494 ms (±14.2) | 0.21 × (0.20–0.22) **Infinite** | 0.12 × (0.12–0.13) **Infinite** | 0.10 × (0.10–0.11) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 5.57 ms (±0.26) | 4.71 ms (±0.21) | 7.74 ms (±0.46) | 10.8 ms (±0.80) | 1.94 × (1.75–2.16) **MUI X** | 2.29 × (2.12–2.55) **AG Grid** | 1.39 × (1.25–1.55) **TanStack** |
| Main thread: style recalc (all updates) (lower is better) | 13.6 ms (±9.92) | 14.8 ms (±0.82) | 6.33 ms (±0.31) | 0.28 ms (±0.02) | 0.02 × (0.01–0.02) **Infinite** | 0.02 × (0.02–0.02) **Infinite** | 0.04 × (0.04–0.05) **Infinite** |
| Main thread: all tasks (all updates) (lower is better) | 12300 ms (±168) | 19970 ms (±233) | 24894 ms (±528) | 2644 ms (±58.1) | 0.21 × (0.21–0.22) **Infinite** | 0.13 × (0.13–0.14) **Infinite** | 0.11 × (0.10–0.11) **Infinite** |

## updates-low-filtered - 1,000,000 rows

Live updates, low frequency. The grid shows filtered to a salary of at least 115,000 (about half of the rows) - the updates change the salaries, so rows go in and out of the filter. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 665 ms (±11.3) | 322 ms (±12.7) | 1697 ms (±13.1) | 268 ms (±5.27) | 0.40 × (0.39–0.41) **Infinite** | 0.83 × (0.78–0.85) **Infinite** | 0.16 × (0.15–0.16) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 820 ms (±7.74) | 374 ms (±10.9) | 2098 ms (±73.2) | 357 ms (±4.95) | 0.44 × (0.43–0.44) **Infinite** | 0.95 × (0.94–1.01) ≈ | 0.17 × (0.16–0.17) **Infinite** |
| Update to settled (median of updates) (lower is better) | 665 ms (±11.3) | 322 ms (±12.7) | 1697 ms (±13.1) | 269 ms (±5.90) | 0.40 × (0.39–0.41) **Infinite** | 0.84 × (0.78–0.86) **Infinite** | 0.16 × (0.15–0.16) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 4.16 ms (±0.06) | 4.92 ms (±0.33) | 4.04 ms (±0.14) | 4.33 ms (±0.48) | 1.04 × (0.96–1.26) ≈ | 0.88 × (0.80–1.07) ≈ | 1.07 × (0.99–1.30) ≈ |
| Main thread: style recalc (all updates) (lower is better) | 3.50 ms (±0.05) | 1.88 ms (±0.23) | 1.30 ms (±0.11) | 0.44 ms (±0.02) | 0.13 × (0.12–0.14) **Infinite** | 0.23 × (0.19–0.26) **Infinite** | 0.34 × (0.29–0.36) **Infinite** |
| Main thread: all tasks (all updates) (lower is better) | 3474 ms (±44.5) | 1762 ms (±56.1) | 8365 ms (±40.3) | 1449 ms (±23.0) | 0.42 × (0.40–0.42) **Infinite** | 0.82 × (0.77–0.84) **Infinite** | 0.17 × (0.17–0.18) **Infinite** |

## updates-low-grouped - 1,000,000 rows

Live updates, low frequency. The grid shows grouped by department (10 collapsed groups), with the sum of the salaries of each group - the updates change the salaries, so the sums change. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | Infinite median (sd) | Infinite vs TanStack |
|---|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 1791 ms (±39.0) | 955 ms (±10.3) | 0.53 × (0.51–0.54) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 2752 ms (±91.0) | 1152 ms (±16.6) | 0.42 × (0.40–0.44) **Infinite** |
| Update to settled (median of updates) (lower is better) | 1791 ms (±39.0) | 955 ms (±10.3) | 0.53 × (0.51–0.54) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 2.08 ms (±0.11) | 1.33 ms (±0.10) | 0.64 × (0.58–0.72) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 0.00 ms (±0.00) | 0.38 ms (±0.03) | +0.38 (+0.37 to +0.44) **TanStack** |
| Main thread: all tasks (all updates) (lower is better) | 10144 ms (±121) | 4995 ms (±36.3) | 0.49 × (0.48–0.50) **Infinite** |

## updates-high - 1,000,000 rows

Live updates, high frequency. The grid shows the rows in the order of the data. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 1125 ms (±70.3) | 129 ms (±30.8) | 512 ms (±122) | 382 ms (±149) | 0.34 × (0.26–0.59) **Infinite** | 2.97 × (1.82–5.18) **AG Grid** | 0.75 × (0.51–1.30) ≈ |
| Update delay, p95 (lower is better) | 559 ms (±6.04) | 94.6 ms (±5.10) | 659 ms (±17.5) | 339 ms (±28.3) | 0.61 × (0.56–0.69) **Infinite** | 3.59 × (3.31–4.10) **AG Grid** | 0.51 × (0.48–0.59) **Infinite** |
| Frames committed per second (higher is better) | 2.94 fps (±0.04) | 10.2 fps (±0.44) | 1.80 fps (±0.05) | 4.87 fps (±0.55) | 1.66 × (1.39–1.87) **Infinite** | 0.48 × (0.40–0.54) **AG Grid** | 2.71 × (2.28–3.06) **Infinite** |
| Gap between frames, p95 (lower is better) | 645 ms (±24.5) | 117 ms (±8.58) | 763 ms (±24.6) | 418 ms (±17.2) | 0.65 × (0.60–0.68) **Infinite** | 3.57 × (3.19–3.92) **AG Grid** | 0.55 × (0.51–0.58) **Infinite** |
| Longest gap between frames (lower is better) | 668 ms (±32.1) | 198 ms (±9.85) | 788 ms (±26.7) | 442 ms (±44.7) | 0.66 × (0.60–0.80) **Infinite** | 2.23 × (2.04–2.72) **AG Grid** | 0.56 × (0.54–0.68) **Infinite** |
| Long tasks: total blocking time (lower is better) | 4436 ms (±78.8) | 1726 ms (±90.3) | 4046 ms (±107) | 3585 ms (±176) | 0.81 × (0.78–0.90) **Infinite** | 2.08 × (1.92–2.30) **AG Grid** | 0.89 × (0.84–0.98) **Infinite** |
| Main thread: layout (lower is better) | 2.99 ms (±0.10) | 25.8 ms (±3.48) | 6.59 ms (±2.33) | 5.93 ms (±0.21) | 1.98 × (1.85–2.09) **MUI X** | 0.23 × (0.18–0.25) **Infinite** | 0.90 × (0.52–1.00) ≈ |
| Main thread: style recalc (lower is better) | 1.88 ms (±0.07) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.28 ms (±0.03) | 0.15 × (0.14–0.19) **Infinite** | +0.28 (+0.28 to +0.35) **AG Grid** | +0.28 (+0.28 to +0.35) **TanStack** |
| Main thread: all tasks (lower is better) | 5106 ms (±70.4) | 4069 ms (±30.6) | 4494 ms (±129) | 4368 ms (±149) | 0.86 × (0.83–0.91) **Infinite** | 1.07 × (1.05–1.14) **AG Grid** | 0.97 × (0.92–1.03) ≈ |

## updates-high-sorted - 1,000,000 rows

Live updates, high frequency. The grid shows sorted by salary, highest first - the updates change the salaries, so rows move. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 3156 ms (±98.9) | 8186 ms (±196) | 5627 ms (±217) | 839 ms (±142) | 0.27 × (0.21–0.33) **Infinite** | 0.10 × (0.08–0.13) **Infinite** | 0.15 × (0.12–0.18) **Infinite** |
| Update delay, p95 (lower is better) | 2414 ms (±44.9) | 4078 ms (±191) | 4876 ms (±177) | 570 ms (±38.6) | 0.24 × (0.21–0.25) **Infinite** | 0.14 × (0.12–0.15) **Infinite** | 0.12 × (0.10–0.13) **Infinite** |
| Frames committed per second (higher is better) | 0.56 fps (±0.01) | 0.25 fps (±0.00) | 0.21 fps (±0.00) | 2.91 fps (±0.09) | 5.18 × (4.99–5.42) **Infinite** | 11.8 × (11.3–12.3) **Infinite** | 14.0 × (13.4–14.8) **Infinite** |
| Gap between frames, p95 (lower is better) | 2600 ms (±33.5) | 7528 ms (±164) | 5071 ms (±146) | 686 ms (±44.7) | 0.26 × (0.23–0.27) **Infinite** | 0.09 × (0.08–0.09) **Infinite** | 0.14 × (0.12–0.14) **Infinite** |
| Longest gap between frames (lower is better) | 2633 ms (±38.9) | 7920 ms (±181) | 5102 ms (±154) | 697 ms (±55.0) | 0.26 × (0.25–0.30) **Infinite** | 0.09 × (0.08–0.10) **Infinite** | 0.14 × (0.13–0.15) **Infinite** |
| Long tasks: total blocking time (lower is better) | 6872 ms (±97.8) | 11760 ms (±195) | 9491 ms (±218) | 4282 ms (±146) | 0.62 × (0.59–0.65) **Infinite** | 0.36 × (0.35–0.38) **Infinite** | 0.45 × (0.42–0.47) **Infinite** |
| Main thread: layout (lower is better) | 3.09 ms (±0.13) | 3.25 ms (±0.10) | 3.92 ms (±0.16) | 16.5 ms (±0.67) | 5.34 × (4.98–5.74) **MUI X** | 5.07 × (4.85–5.38) **AG Grid** | 4.20 × (4.02–4.59) **TanStack** |
| Main thread: style recalc (lower is better) | 5.69 ms (±0.06) | 9.04 ms (±0.29) | 2.61 ms (±0.23) | 0.30 ms (±0.03) | 0.05 × (0.04–0.05) **Infinite** | 0.03 × (0.03–0.03) **Infinite** | 0.11 × (0.10–0.12) **Infinite** |
| Main thread: all tasks (lower is better) | 7137 ms (±98.9) | 12151 ms (±192) | 9609 ms (±217) | 4820 ms (±142) | 0.68 × (0.65–0.70) **Infinite** | 0.40 × (0.38–0.41) **Infinite** | 0.50 × (0.47–0.52) **Infinite** |

## updates-high-filtered - 1,000,000 rows

Live updates, high frequency. The grid shows filtered to a salary of at least 115,000 (about half of the rows) - the updates change the salaries, so rows go in and out of the filter. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 823 ms (±52.8) | 410 ms (±50.3) | 2255 ms (±107) | 334 ms (±86.4) | 0.41 × (0.32–0.58) **Infinite** | 0.81 × (0.65–1.19) ≈ | 0.15 × (0.12–0.21) **Infinite** |
| Update delay, p95 (lower is better) | 676 ms (±5.29) | 320 ms (±3.99) | 1823 ms (±14.1) | 276 ms (±13.8) | 0.41 × (0.39–0.43) **Infinite** | 0.86 × (0.81–0.91) **Infinite** | 0.15 × (0.14–0.16) **Infinite** |
| Frames committed per second (higher is better) | 2.08 fps (±0.02) | 2.96 fps (±0.03) | 0.64 fps (±0.01) | 6.51 fps (±0.17) | 3.13 × (3.03–3.23) **Infinite** | 2.20 × (2.12–2.27) **Infinite** | 10.1 × (9.83–10.6) **Infinite** |
| Gap between frames, p95 (lower is better) | 746 ms (±11.2) | 509 ms (±14.2) | 1976 ms (±16.2) | 326 ms (±8.62) | 0.44 × (0.42–0.45) **Infinite** | 0.64 × (0.61–0.66) **Infinite** | 0.17 × (0.16–0.17) **Infinite** |
| Longest gap between frames (lower is better) | 749 ms (±10.8) | 752 ms (±19.6) | 2029 ms (±12.1) | 418 ms (±18.4) | 0.56 × (0.51–0.58) **Infinite** | 0.56 × (0.51–0.58) **Infinite** | 0.21 × (0.19–0.21) **Infinite** |
| Long tasks: total blocking time (lower is better) | 4310 ms (±51.5) | 3501 ms (±49.0) | 6018 ms (±107) | 3406 ms (±70.0) | 0.79 × (0.77–0.81) **Infinite** | 0.97 × (0.95–1.00) ≈ | 0.57 × (0.55–0.58) **Infinite** |
| Main thread: layout (lower is better) | 4.69 ms (±0.23) | 8.78 ms (±0.18) | 3.22 ms (±0.15) | 10.3 ms (±0.25) | 2.19 × (1.99–2.26) **MUI X** | 1.17 × (1.13–1.23) **AG Grid** | 3.19 × (3.00–3.44) **TanStack** |
| Main thread: style recalc (lower is better) | 3.85 ms (±0.08) | 2.80 ms (±0.09) | 1.11 ms (±0.03) | 0.84 ms (±0.04) | 0.22 × (0.21–0.24) **Infinite** | 0.30 × (0.28–0.33) **Infinite** | 0.76 × (0.72–0.82) **Infinite** |
| Main thread: all tasks (lower is better) | 5103 ms (±53.6) | 4359 ms (±50.2) | 6237 ms (±107) | 4316 ms (±85.5) | 0.85 × (0.83–0.87) **Infinite** | 0.99 × (0.97–1.02) ≈ | 0.69 × (0.67–0.71) **Infinite** |

## updates-high-grouped - 1,000,000 rows

Live updates, high frequency. The grid shows grouped by department (10 collapsed groups), with the sum of the salaries of each group - the updates change the salaries, so the sums change. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | Infinite median (sd) | Infinite vs TanStack |
|---|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 3395 ms (±731) | 1068 ms (±579) | 0.31 × (0.30–0.69) **Infinite** |
| Update delay, p95 (lower is better) | 1934 ms (±91.9) | 941 ms (±15.6) | 0.49 × (0.47–0.53) **Infinite** |
| Frames committed per second (higher is better) | 0.54 fps (±0.01) | 1.58 fps (±0.11) | 2.93 × (2.55–3.04) **Infinite** |
| Gap between frames, p95 (lower is better) | 2103 ms (±89.3) | 1075 ms (±95.2) | 0.51 × (0.49–0.61) **Infinite** |
| Longest gap between frames (lower is better) | 2156 ms (±99.8) | 1125 ms (±141) | 0.52 × (0.50–0.66) **Infinite** |
| Long tasks: total blocking time (lower is better) | 7165 ms (±708) | 4759 ms (±558) | 0.66 × (0.65–0.85) **Infinite** |
| Main thread: layout (lower is better) | 1.70 ms (±0.24) | 1.42 ms (±0.06) | 0.84 × (0.79–1.24) ≈ |
| Main thread: style recalc (lower is better) | 0.00 ms (±0.00) | 0.24 ms (±0.02) | +0.24 (+0.20 to +0.26) **TanStack** |
| Main thread: all tasks (lower is better) | 7377 ms (±859) | 5050 ms (±579) | 0.68 × (0.62–0.87) **Infinite** |
