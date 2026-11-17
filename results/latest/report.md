# MUI X Data Grid vs AG Grid vs TanStack Table vs Infinite Table — benchmark report

- Run: `ci` · 2026-11-17T21:27:22.444Z
- MUI X Data Grid 9.18.0 · AG Grid 36.3.0 · TanStack Table 9.3.1 · Infinite Table 10.2.0
- 300,000 rows (data checksum `300000:72377c6e`) · 1,000,000 rows (data checksum `1000000:19e5eebe`) × 20 columns, identical data for every grid
- Chrome 136.0.7103.25 · headless · CPU throttling 1× · viewport 1400×1000
- 7 measured runs per grid per scenario (+1 warmup, discarded), interleaved, fresh browser context per run
- Linux 7.0.0-1014-aws x64 · Intel(R) Xeon(R) 6975P-C × 4
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
| Time to first rows painted (lower is better) | 244 ms (±11.7) | 284 ms (±4.36) | 196 ms (±2.83) | 209 ms (±10.5) | 0.86 × (0.80–0.91) **Infinite** | 0.74 × (0.71–0.76) **Infinite** | 1.07 × (1.03–1.10) **TanStack** |
| Time until settled (lower is better) | 244 ms (±11.7) | 385 ms (±4.62) | 196 ms (±2.83) | 210 ms (±6.94) | 0.86 × (0.83–0.91) **Infinite** | 0.54 × (0.54–0.56) **Infinite** | 1.07 × (1.06–1.10) **TanStack** |
| Main thread: scripting (lower is better) | 227 ms (±11.6) | 260 ms (±4.16) | 183 ms (±2.37) | 194 ms (±10.9) | 0.85 × (0.78–0.91) **Infinite** | 0.75 × (0.70–0.77) **Infinite** | 1.06 × (1.00–1.09) ≈ |
| Main thread: layout (lower is better) | 5.59 ms (±0.65) | 7.56 ms (±0.37) | 5.21 ms (±0.74) | 3.11 ms (±0.18) | 0.56 × (0.47–0.58) **Infinite** | 0.41 × (0.38–0.43) **Infinite** | 0.60 × (0.48–0.64) **Infinite** |
| Main thread: style recalc (lower is better) | 5.94 ms (±0.17) | 10.0 ms (±0.23) | 2.13 ms (±0.37) | 5.53 ms (±1.00) | 0.93 × (0.88–1.22) ≈ | 0.55 × (0.52–0.71) **Infinite** | 2.60 × (2.02–3.47) **TanStack** |
| Main thread: all tasks (lower is better) | 271 ms (±11.5) | 289 ms (±4.81) | 198 ms (±2.94) | 212 ms (±7.55) | 0.78 × (0.75–0.81) **Infinite** | 0.74 × (0.72–0.76) **Infinite** | 1.07 × (1.07–1.11) **TanStack** |
| JS heap retained by grid (lower is better) | 54.2 MB (±0.00) | 67.4 MB (±0.00) | 86.6 MB (±0.00) | 36.6 MB (±0.47) | 0.68 × (0.66–0.68) **Infinite** | 0.54 × (0.53–0.54) **Infinite** | 0.42 × (0.41–0.42) **Infinite** |
| DOM elements in grid (lower is better) | 529 (±0.00) | 637 (±0.00) | 352 (±0.00) | 609 (±0.00) | 1.15 × (1.15–1.15) **MUI X** | 0.96 × (0.96–0.96) **Infinite** | 1.73 × (1.73–1.73) **TanStack** |

## sort-string - 300,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 863 ms (±28.7) | 684 ms (±40.0) | 919 ms (±40.1) | 348 ms (±19.3) | 0.40 × (0.37–0.42) **Infinite** | 0.51 × (0.47–0.55) **Infinite** | 0.38 × (0.35–0.40) **Infinite** |
| Ascending: click to settled (lower is better) | 863 ms (±28.7) | 684 ms (±40.0) | 919 ms (±40.1) | 362 ms (±17.9) | 0.42 × (0.38–0.43) **Infinite** | 0.53 × (0.48–0.56) **Infinite** | 0.39 × (0.36–0.42) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 863 ms (±16.3) | 655 ms (±45.9) | 923 ms (±56.6) | 356 ms (±15.2) | 0.41 × (0.39–0.43) **Infinite** | 0.54 × (0.51–0.59) **Infinite** | 0.39 × (0.36–0.42) **Infinite** |
| Descending: click to settled (lower is better) | 863 ms (±16.3) | 655 ms (±45.9) | 923 ms (±56.6) | 356 ms (±15.2) | 0.41 × (0.39–0.43) **Infinite** | 0.54 × (0.51–0.59) **Infinite** | 0.39 × (0.36–0.42) **Infinite** |
| Ascending: main thread scripting (lower is better) | 850 ms (±28.4) | 667 ms (±40.2) | 911 ms (±40.1) | 334 ms (±19.6) | 0.39 × (0.36–0.41) **Infinite** | 0.50 × (0.46–0.54) **Infinite** | 0.37 × (0.34–0.39) **Infinite** |
| Descending: main thread scripting (lower is better) | 855 ms (±16.3) | 642 ms (±45.9) | 916 ms (±56.5) | 341 ms (±15.5) | 0.40 × (0.38–0.41) **Infinite** | 0.53 × (0.50–0.58) **Infinite** | 0.37 × (0.34–0.41) **Infinite** |

## sort-number - 300,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 539 ms (±9.72) | 801 ms (±62.1) | 788 ms (±42.9) | 319 ms (±12.3) | 0.59 × (0.57–0.62) **Infinite** | 0.40 × (0.38–0.46) **Infinite** | 0.41 × (0.36–0.42) **Infinite** |
| Ascending: click to settled (lower is better) | 539 ms (±9.72) | 801 ms (±62.1) | 788 ms (±42.9) | 330 ms (±14.1) | 0.61 × (0.59–0.66) **Infinite** | 0.41 × (0.38–0.47) **Infinite** | 0.42 × (0.37–0.44) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 665 ms (±24.5) | 757 ms (±56.4) | 784 ms (±46.9) | 337 ms (±17.8) | 0.51 × (0.48–0.54) **Infinite** | 0.45 × (0.41–0.49) **Infinite** | 0.43 × (0.40–0.46) **Infinite** |
| Descending: click to settled (lower is better) | 665 ms (±24.5) | 757 ms (±56.4) | 784 ms (±46.9) | 337 ms (±17.8) | 0.51 × (0.48–0.54) **Infinite** | 0.45 × (0.41–0.49) **Infinite** | 0.43 × (0.40–0.46) **Infinite** |
| Ascending: main thread scripting (lower is better) | 527 ms (±9.55) | 784 ms (±61.8) | 780 ms (±42.9) | 306 ms (±12.6) | 0.58 × (0.56–0.61) **Infinite** | 0.39 × (0.37–0.45) **Infinite** | 0.39 × (0.35–0.40) **Infinite** |
| Descending: main thread scripting (lower is better) | 657 ms (±24.6) | 744 ms (±56.5) | 777 ms (±46.6) | 322 ms (±18.1) | 0.49 × (0.46–0.52) **Infinite** | 0.43 × (0.40–0.47) **Infinite** | 0.41 × (0.39–0.45) **Infinite** |

## scroll-jump - 300,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 22.3 ms (±0.45) | 30.6 ms (±0.64) | 10.9 ms (±0.19) | 30.3 ms (±0.43) | 1.36 × (1.34–1.40) **MUI X** | 0.99 × (0.97–1.03) ≈ | 2.78 × (2.74–2.86) **TanStack** |
| Jump to rows painted (worst jump) (lower is better) | 30.9 ms (±0.45) | 50.3 ms (±1.46) | 22.0 ms (±1.75) | 38.7 ms (±0.86) | 1.25 × (1.21–1.27) **MUI X** | 0.77 × (0.75–0.79) **Infinite** | 1.76 × (1.58–1.92) **TanStack** |
| Jump to settled (median of jumps) (lower is better) | 22.3 ms (±0.45) | 30.6 ms (±0.64) | 10.9 ms (±0.19) | 30.3 ms (±0.43) | 1.36 × (1.34–1.40) **MUI X** | 0.99 × (0.97–1.03) ≈ | 2.78 × (2.74–2.86) **TanStack** |
| Main thread scripting (all jumps) (lower is better) | 144 ms (±1.99) | 196 ms (±1.86) | 75.1 ms (±1.98) | 179 ms (±2.88) | 1.24 × (1.23–1.27) **MUI X** | 0.91 × (0.90–0.93) **Infinite** | 2.38 × (2.32–2.48) **TanStack** |

## scroll-vertical - 300,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 50.3 % (±0.00) | 52.3 % (±5.35) | 100 % (±18.8) | 59.0 % (±1.63) | 1.17 × (1.17–1.18) **Infinite** | 1.13 × (1.12–1.13) **Infinite** | 0.59 × (0.59–0.59) **TanStack** |
| Frames presented without main-thread update (lower is better) | 49.4 % (±0.00) | 47.6 % (±5.43) | 0.00 % (±18.7) | 41.0 % (±1.63) | 0.83 × (0.82–0.83) **Infinite** | 0.86 × (0.86–0.87) **Infinite** | +41.0 (+40.8 to +41.1) **TanStack** |
| Frames dropped (lower is better) | 0.28 % (±0.00) | 0.29 % (±0.17) | 0.00 % (±0.10) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | -0.29 (-0.29 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 59.4 fps (±0.26) | 0.99 × (0.98–0.99) **MUI X** | 0.99 × (0.98–0.99) **AG Grid** | 0.99 × (0.98–0.99) **TanStack** |
| p95 rAF frame interval (lower is better) | 16.8 ms (±0.05) | 16.7 ms (±0.03) | 16.7 ms (±0.05) | 16.8 ms (±0.05) | 1.00 × (0.99–1.01) ≈ | 1.01 × (1.00–1.01) ≈ | 1.00 × (0.99–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 50.0 ms (±0.05) | 2.98 × (2.97–2.98) **MUI X** | 2.98 × (2.97–2.98) **AG Grid** | 2.98 × (2.97–2.98) **TanStack** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.55 % (±0.27) | +0.55 (+0.54 to +1.10) **MUI X** | +0.55 (+0.54 to +1.10) **AG Grid** | +0.55 (+0.54 to +1.10) **TanStack** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 435 ms (±20.9) | 469 ms (±10.0) | 257 ms (±16.0) | 613 ms (±12.6) | 1.41 × (1.29–1.42) **MUI X** | 1.31 × (1.28–1.36) **AG Grid** | 2.38 × (2.30–2.47) **TanStack** |
| Main thread: layout (lower is better) | 50.7 ms (±1.38) | 79.1 ms (±1.69) | 64.7 ms (±1.00) | 61.1 ms (±3.23) | 1.21 × (1.17–1.29) **MUI X** | 0.77 × (0.75–0.82) **Infinite** | 0.95 × (0.92–0.99) **Infinite** |
| Main thread: style recalc (lower is better) | 75.2 ms (±1.72) | 231 ms (±3.89) | 32.3 ms (±0.57) | 145 ms (±2.90) | 1.93 × (1.87–1.99) **MUI X** | 0.63 × (0.62–0.65) **Infinite** | 4.50 × (4.44–4.64) **TanStack** |
| Main thread: all tasks (lower is better) | 1146 ms (±34.7) | 1249 ms (±38.4) | 727 ms (±17.7) | 1317 ms (±28.1) | 1.15 × (1.09–1.18) **MUI X** | 1.05 × (1.02–1.11) **AG Grid** | 1.81 × (1.77–1.87) **TanStack** |

## scroll-horizontal - 300,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 80.3 % (±0.16) | 100 % (±6.95) | 100 % (±10.5) | 89.6 % (±5.81) | 1.12 × (1.11–1.20) **Infinite** | 0.90 × (0.89–0.97) **AG Grid** | 0.90 × (0.89–1.20) ≈ |
| Frames presented without main-thread update (lower is better) | 19.0 % (±0.17) | 0.00 % (±6.67) | 0.00 % (±10.2) | 10.4 % (±5.81) | 0.55 × (0.18–0.58) **Infinite** | +10.4 (+3.42 to +11.1) **AG Grid** | +10.4 (-15.6 to +11.1) ≈ |
| Frames dropped (lower is better) | 0.70 % (±0.00) | 0.00 % (±0.28) | 0.00 % (±0.38) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 (-0.70 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 16.8 ms (±0.05) | 1.01 × (0.99–1.01) ≈ | 1.01 × (0.99–1.01) ≈ | 1.01 × (0.99–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 263 ms (±10.8) | 180 ms (±7.97) | 115 ms (±9.75) | 125 ms (±8.17) | 0.47 × (0.45–0.50) **Infinite** | 0.69 × (0.68–0.72) **Infinite** | 1.09 × (0.98–1.17) ≈ |
| Main thread: layout (lower is better) | 31.7 ms (±1.96) | 47.6 ms (±1.89) | 33.9 ms (±2.44) | 8.34 ms (±0.87) | 0.26 × (0.23–0.29) **Infinite** | 0.18 × (0.17–0.19) **Infinite** | 0.25 × (0.22–0.27) **Infinite** |
| Main thread: style recalc (lower is better) | 18.0 ms (±1.06) | 34.7 ms (±1.02) | 10.2 ms (±0.87) | 36.5 ms (±1.86) | 2.02 × (1.82–2.12) **MUI X** | 1.05 × (1.00–1.09) ≈ | 3.57 × (3.22–3.76) **TanStack** |
| Main thread: all tasks (lower is better) | 551 ms (±7.45) | 483 ms (±17.4) | 374 ms (±20.2) | 354 ms (±19.0) | 0.64 × (0.63–0.66) **Infinite** | 0.73 × (0.72–0.76) **Infinite** | 0.95 × (0.88–0.98) **Infinite** |

## correctness-vertical - 300,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 2.53 % (±0.54) | 3.04 % (±0.78) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 45.4 % (±2.81) | +45.4 (+43.4 to +46.5) **MUI X** | +45.4 (+43.4 to +46.5) **AG Grid** | +45.4 (+43.4 to +46.5) **TanStack** |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 12.7 % (±2.72) | 15.2 % (±3.90) | 88.5 % (±0.68) | +88.5 (+87.5 to +88.9) **MUI X** | 6.99 × (6.20–8.78) **AG Grid** | 5.83 × (5.32–6.90) **TanStack** |
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
| Captured frames with blank rows (lower is better) | 0.00 % (±0.00) | 6.35 % (±1.61) | 1.41 % (±0.95) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | -1.41 (-1.45 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 0.00 % (±0.00) | 1.18 % (±0.49) | 0.15 % (±0.07) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | -0.15 (-0.15 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 0.00 rows (±0.00) | 6.00 rows (±3.91) | 1.00 rows (±0.90) | 0.00 rows (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | -1.00 (-2.00 to 0.00) ≈ |
| Captured frames (higher is better) | 71.0 (±0.58) | 64.0 (±1.41) | 71.0 (±1.95) | 74.0 (±1.21) | 1.04 × (1.03–1.06) **Infinite** | 1.16 × (1.12–1.19) **Infinite** | 1.04 × (1.00–1.09) ≈ |

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
| Time to first rows painted (lower is better) | 663 ms (±11.2) | 760 ms (±19.8) | 621 ms (±11.1) | 504 ms (±14.8) | 0.76 × (0.73–0.78) **Infinite** | 0.66 × (0.63–0.69) **Infinite** | 0.81 × (0.78–0.84) **Infinite** |
| Time until settled (lower is better) | 663 ms (±11.2) | 862 ms (±20.0) | 621 ms (±11.1) | 504 ms (±14.8) | 0.76 × (0.73–0.78) **Infinite** | 0.58 × (0.56–0.61) **Infinite** | 0.81 × (0.78–0.84) **Infinite** |
| Main thread: scripting (lower is better) | 650 ms (±11.2) | 736 ms (±19.2) | 612 ms (±11.2) | 479 ms (±14.3) | 0.74 × (0.71–0.76) **Infinite** | 0.65 × (0.62–0.68) **Infinite** | 0.78 × (0.76–0.81) **Infinite** |
| Main thread: layout (lower is better) | 4.39 ms (±0.17) | 7.37 ms (±0.63) | 4.01 ms (±0.24) | 4.86 ms (±0.06) | 1.11 × (1.04–1.13) **MUI X** | 0.66 × (0.61–0.71) **Infinite** | 1.21 × (1.15–1.25) **TanStack** |
| Main thread: style recalc (lower is better) | 4.26 ms (±0.08) | 10.6 ms (±0.28) | 1.41 ms (±0.20) | 8.69 ms (±0.33) | 2.04 × (1.97–2.17) **MUI X** | 0.82 × (0.80–0.89) **Infinite** | 6.15 × (4.92–6.63) **TanStack** |
| Main thread: all tasks (lower is better) | 666 ms (±11.0) | 781 ms (±19.8) | 623 ms (±12.2) | 507 ms (±14.3) | 0.76 × (0.74–0.79) **Infinite** | 0.65 × (0.63–0.69) **Infinite** | 0.81 × (0.79–0.84) **Infinite** |
| JS heap retained by grid (lower is better) | 150 MB (±0.00) | 213 MB (±0.01) | 287 MB (±0.00) | 90.7 MB (±0.02) | 0.60 × (0.60–0.60) **Infinite** | 0.42 × (0.42–0.42) **Infinite** | 0.32 × (0.32–0.32) **Infinite** |
| DOM elements in grid (lower is better) | 529 (±0.00) | 637 (±0.00) | 352 (±0.00) | 609 (±0.00) | 1.15 × (1.15–1.15) **MUI X** | 0.96 × (0.96–0.96) **Infinite** | 1.73 × (1.73–1.73) **TanStack** |

## sort-string - 1,000,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 3726 ms (±249) | 3417 ms (±154) | 4457 ms (±202) | 1443 ms (±50.9) | 0.39 × (0.36–0.42) **Infinite** | 0.42 × (0.41–0.46) **Infinite** | 0.32 × (0.32–0.36) **Infinite** |
| Ascending: click to settled (lower is better) | 3726 ms (±249) | 3417 ms (±154) | 4457 ms (±202) | 1450 ms (±50.7) | 0.39 × (0.37–0.42) **Infinite** | 0.42 × (0.41–0.46) **Infinite** | 0.33 × (0.32–0.36) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 3978 ms (±283) | 3355 ms (±114) | 4196 ms (±222) | 1489 ms (±66.3) | 0.37 × (0.34–0.41) **Infinite** | 0.44 × (0.43–0.48) **Infinite** | 0.35 × (0.33–0.38) **Infinite** |
| Descending: click to settled (lower is better) | 3978 ms (±283) | 3355 ms (±114) | 4196 ms (±222) | 1489 ms (±66.3) | 0.37 × (0.34–0.41) **Infinite** | 0.44 × (0.43–0.48) **Infinite** | 0.35 × (0.33–0.38) **Infinite** |
| Ascending: main thread scripting (lower is better) | 3714 ms (±249) | 3402 ms (±155) | 4449 ms (±202) | 1431 ms (±50.5) | 0.39 × (0.36–0.42) **Infinite** | 0.42 × (0.41–0.46) **Infinite** | 0.32 × (0.32–0.35) **Infinite** |
| Descending: main thread scripting (lower is better) | 3970 ms (±283) | 3342 ms (±114) | 4189 ms (±222) | 1473 ms (±66.3) | 0.37 × (0.34–0.41) **Infinite** | 0.44 × (0.43–0.48) **Infinite** | 0.35 × (0.33–0.38) **Infinite** |

## sort-number - 1,000,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 2159 ms (±104) | 3256 ms (±125) | 3652 ms (±121) | 1196 ms (±30.9) | 0.55 × (0.54–0.60) **Infinite** | 0.37 × (0.36–0.39) **Infinite** | 0.33 × (0.32–0.35) **Infinite** |
| Ascending: click to settled (lower is better) | 2159 ms (±104) | 3256 ms (±125) | 3652 ms (±121) | 1215 ms (±34.3) | 0.56 × (0.54–0.61) **Infinite** | 0.37 × (0.36–0.39) **Infinite** | 0.33 × (0.32–0.35) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 2974 ms (±149) | 3306 ms (±128) | 3579 ms (±125) | 1282 ms (±51.5) | 0.43 × (0.42–0.47) **Infinite** | 0.39 × (0.38–0.40) **Infinite** | 0.36 × (0.35–0.37) **Infinite** |
| Descending: click to settled (lower is better) | 2974 ms (±149) | 3306 ms (±128) | 3579 ms (±125) | 1282 ms (±51.5) | 0.43 × (0.42–0.47) **Infinite** | 0.39 × (0.38–0.40) **Infinite** | 0.36 × (0.35–0.37) **Infinite** |
| Ascending: main thread scripting (lower is better) | 2148 ms (±104) | 3245 ms (±123) | 3645 ms (±121) | 1184 ms (±30.9) | 0.55 × (0.53–0.60) **Infinite** | 0.36 × (0.35–0.39) **Infinite** | 0.32 × (0.32–0.34) **Infinite** |
| Descending: main thread scripting (lower is better) | 2966 ms (±149) | 3298 ms (±128) | 3572 ms (±125) | 1267 ms (±51.6) | 0.43 × (0.42–0.47) **Infinite** | 0.38 × (0.37–0.40) **Infinite** | 0.35 × (0.34–0.37) **Infinite** |

## scroll-jump - 1,000,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 22.7 ms (±0.30) | 31.0 ms (±1.11) | 11.2 ms (±0.28) | 34.1 ms (±0.38) | 1.51 × (1.48–1.53) **MUI X** | 1.10 × (1.04–1.13) **AG Grid** | 3.04 × (2.95–3.12) **TanStack** |
| Jump to rows painted (worst jump) (lower is better) | 44.1 ms (±2.19) | 68.0 ms (±2.34) | 29.5 ms (±0.94) | 50.6 ms (±1.49) | 1.15 × (1.09–1.23) **MUI X** | 0.75 × (0.73–0.78) **Infinite** | 1.72 × (1.66–1.83) **TanStack** |
| Jump to settled (median of jumps) (lower is better) | 22.7 ms (±0.30) | 31.0 ms (±1.11) | 11.2 ms (±0.28) | 34.1 ms (±0.38) | 1.51 × (1.48–1.53) **MUI X** | 1.10 × (1.04–1.13) **AG Grid** | 3.04 × (2.95–3.12) **TanStack** |
| Main thread scripting (all jumps) (lower is better) | 152 ms (±3.52) | 213 ms (±7.55) | 75.2 ms (±3.51) | 210 ms (±2.87) | 1.38 × (1.32–1.41) **MUI X** | 0.99 × (0.94–1.01) ≈ | 2.80 × (2.67–2.89) **TanStack** |

## scroll-vertical - 1,000,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 50.3 % (±0.16) | 50.3 % (±0.11) | 50.3 % (±24.3) | 61.7 % (±0.33) | 1.23 × (1.22–1.23) **Infinite** | 1.23 × (1.22–1.24) **Infinite** | 1.23 × (0.61–1.23) ≈ |
| Frames presented without main-thread update (lower is better) | 49.4 % (±0.05) | 49.4 % (±0.07) | 49.4 % (±24.1) | 38.3 % (±0.33) | 0.77 × (0.77–0.78) **Infinite** | 0.77 × (0.77–0.78) **Infinite** | -11.1 (-11.4 to +38.6) ≈ |
| Frames dropped (lower is better) | 0.28 % (±0.21) | 0.28 % (±0.11) | 0.27 % (±0.13) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | -0.27 (-0.28 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.12) | 60.0 fps (±0.12) | 60.0 fps (±0.00) | 56.8 fps (±0.17) | 0.95 × (0.95–0.95) **MUI X** | 0.95 × (0.95–0.95) **AG Grid** | 0.95 × (0.95–0.95) **TanStack** |
| p95 rAF frame interval (lower is better) | 16.8 ms (±0.05) | 16.8 ms (±0.05) | 16.8 ms (±0.05) | 16.8 ms (±0.04) | 1.00 × (0.99–1.01) ≈ | 1.00 × (1.00–1.01) ≈ | 1.00 × (0.99–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±6.27) | 16.8 ms (±6.24) | 16.8 ms (±0.00) | 117 ms (±6.30) | 6.95 × (5.95–6.95) **MUI X** | 6.95 × (6.94–6.95) **AG Grid** | 6.95 × (6.94–6.95) **TanStack** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.21) | 0.00 % (±0.21) | 0.00 % (±0.00) | 1.70 % (±0.01) | +1.70 (+1.69 to +1.70) **MUI X** | +1.70 (+1.69 to +1.70) **AG Grid** | +1.70 (+1.69 to +1.70) **TanStack** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 548 ms (±44.8) | 667 ms (±21.7) | 348 ms (±34.1) | 792 ms (±21.4) | 1.45 × (1.29–1.48) **MUI X** | 1.19 × (1.13–1.23) **AG Grid** | 2.28 × (2.11–2.75) **TanStack** |
| Main thread: layout (lower is better) | 60.0 ms (±4.96) | 94.7 ms (±3.22) | 80.7 ms (±5.11) | 93.3 ms (±5.66) | 1.55 × (1.39–1.65) **MUI X** | 0.98 × (0.89–1.02) ≈ | 1.16 × (1.05–1.25) **TanStack** |
| Main thread: style recalc (lower is better) | 81.9 ms (±6.24) | 374 ms (±7.33) | 40.4 ms (±3.05) | 223 ms (±9.39) | 2.73 × (2.48–2.86) **MUI X** | 0.60 × (0.56–0.62) **Infinite** | 5.53 × (5.24–6.48) **TanStack** |
| Main thread: all tasks (lower is better) | 1339 ms (±72.9) | 1712 ms (±54.6) | 935 ms (±53.7) | 1774 ms (±65.4) | 1.33 × (1.19–1.36) **MUI X** | 1.04 × (0.96–1.08) ≈ | 1.90 × (1.76–2.12) **TanStack** |

## scroll-horizontal - 1,000,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 67.5 % (±5.43) | 100 % (±0.00) | 80.7 % (±9.53) | 95.9 % (±4.69) | 1.42 × (1.21–1.44) **Infinite** | 0.96 × (0.89–0.97) **AG Grid** | 1.19 × (0.96–1.20) ≈ |
| Frames presented without main-thread update (lower is better) | 31.4 % (±5.52) | 0.00 % (±0.00) | 19.0 % (±9.25) | 4.11 % (±4.69) | 0.13 × (0.11–0.47) **Infinite** | +4.11 (+3.42 to +11.0) **AG Grid** | -14.9 (-15.6 to +4.14) ≈ |
| Frames dropped (lower is better) | 1.18 % (±0.09) | 0.00 % (±0.00) | 0.70 % (±0.38) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | -0.70 (-0.70 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±0.04) | 16.7 ms (±0.04) | 1.00 × (0.99–1.00) ≈ | 1.00 × (0.99–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 316 ms (±23.4) | 210 ms (±14.6) | 146 ms (±12.9) | 154 ms (±5.35) | 0.49 × (0.44–0.52) **Infinite** | 0.73 × (0.67–0.80) **Infinite** | 1.05 × (0.99–1.21) ≈ |
| Main thread: layout (lower is better) | 42.4 ms (±2.93) | 55.9 ms (±5.22) | 45.9 ms (±5.43) | 11.0 ms (±0.50) | 0.26 × (0.25–0.29) **Infinite** | 0.20 × (0.18–0.22) **Infinite** | 0.24 × (0.22–0.29) **Infinite** |
| Main thread: style recalc (lower is better) | 22.5 ms (±0.82) | 38.2 ms (±1.57) | 13.6 ms (±1.20) | 44.0 ms (±2.06) | 1.96 × (1.84–2.03) **MUI X** | 1.15 × (1.06–1.22) **AG Grid** | 3.24 × (3.00–3.71) **TanStack** |
| Main thread: all tasks (lower is better) | 679 ms (±35.0) | 523 ms (±45.5) | 399 ms (±35.0) | 479 ms (±15.5) | 0.71 × (0.66–0.74) **Infinite** | 0.91 × (0.85–1.00) **Infinite** | 1.20 × (1.13–1.39) **TanStack** |

## correctness-vertical - 1,000,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 1.94 % (±1.05) | 2.78 % (±0.38) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 70.0 % (±3.32) | +70.0 (+66.8 to +73.8) **MUI X** | +70.0 (+66.8 to +73.8) **AG Grid** | +70.0 (+66.8 to +73.8) **TanStack** |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 9.72 % (±5.26) | 13.9 % (±1.89) | 83.3 % (±2.01) | +83.3 (+81.8 to +85.7) **MUI X** | 8.57 × (5.41–15.3) **AG Grid** | 5.98 × (5.86–7.44) **TanStack** |
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
| Captured frames with blank rows (lower is better) | 0.00 % (±0.00) | 17.5 % (±3.72) | 3.08 % (±1.16) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Blank body area (avg over frames) (lower is better) | 0.00 % (±0.00) | 8.66 % (±0.66) | 0.69 % (±0.47) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Worst frame: blank rows (lower is better) | 0.00 rows (±0.00) | 18.0 rows (±0.49) | 5.00 rows (±3.15) | 0.00 rows (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Captured frames (higher is better) | 68.0 (±1.15) | 57.0 (±1.27) | 70.0 (±2.00) | 73.0 (±0.98) | 1.07 × (1.04–1.09) **Infinite** | 1.28 × (1.24–1.33) **Infinite** | 1.04 × (1.03–1.07) **Infinite** |
