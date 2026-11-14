# MUI X Data Grid vs AG Grid vs TanStack Table vs Infinite Table — benchmark report

- Run: `ci` · 2026-11-14T07:05:03.926Z
- MUI X Data Grid 9.18.0 · AG Grid 36.3.0 · TanStack Table 9.3.1 · Infinite Table 10.1.5
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
| Time to first rows painted (lower is better) | 257 ms (±4.23) | 288 ms (±6.57) | 198 ms (±19.6) | 214 ms (±18.4) | 0.83 × (0.74–0.86) **Infinite** | 0.74 × (0.66–0.76) **Infinite** | 1.08 × (0.92–1.12) ≈ |
| Time until settled (lower is better) | 257 ms (±4.23) | 390 ms (±6.74) | 198 ms (±19.6) | 214 ms (±11.9) | 0.83 × (0.80–0.86) **Infinite** | 0.55 × (0.53–0.56) **Infinite** | 1.08 × (1.01–1.12) **TanStack** |
| Main thread: scripting (lower is better) | 238 ms (±4.17) | 265 ms (±6.75) | 185 ms (±19.5) | 197 ms (±16.7) | 0.83 × (0.73–0.86) **Infinite** | 0.74 × (0.65–0.77) **Infinite** | 1.07 × (0.93–1.11) ≈ |
| Main thread: layout (lower is better) | 6.22 ms (±0.60) | 7.52 ms (±0.90) | 5.64 ms (±2.79) | 3.25 ms (±0.43) | 0.52 × (0.48–0.65) **Infinite** | 0.43 × (0.40–0.55) **Infinite** | 0.58 × (0.53–0.75) **Infinite** |
| Main thread: style recalc (lower is better) | 6.09 ms (±0.14) | 9.90 ms (±0.32) | 2.30 ms (±0.68) | 5.55 ms (±0.84) | 0.91 × (0.89–1.01) ≈ | 0.56 × (0.53–0.62) **Infinite** | 2.41 × (2.34–3.02) **TanStack** |
| Main thread: all tasks (lower is better) | 284 ms (±4.26) | 294 ms (±6.86) | 200 ms (±19.5) | 217 ms (±13.0) | 0.76 × (0.72–0.79) **Infinite** | 0.74 × (0.69–0.76) **Infinite** | 1.09 × (1.01–1.13) **TanStack** |
| JS heap retained by grid (lower is better) | 54.2 MB (±0.00) | 67.4 MB (±0.00) | 86.6 MB (±0.00) | 36.6 MB (±0.46) | 0.67 × (0.66–0.67) **Infinite** | 0.54 × (0.53–0.54) **Infinite** | 0.42 × (0.41–0.42) **Infinite** |
| DOM elements in grid (lower is better) | 529 (±0.00) | 637 (±0.00) | 352 (±0.00) | 609 (±0.00) | 1.15 × (1.15–1.15) **MUI X** | 0.96 × (0.96–0.96) **Infinite** | 1.73 × (1.73–1.73) **TanStack** |

## sort-string - 300,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 849 ms (±15.4) | 688 ms (±25.6) | 916 ms (±30.8) | 339 ms (±12.6) | 0.40 × (0.39–0.42) **Infinite** | 0.49 × (0.46–0.52) **Infinite** | 0.37 × (0.35–0.39) **Infinite** |
| Ascending: click to settled (lower is better) | 849 ms (±15.4) | 688 ms (±25.6) | 916 ms (±30.8) | 347 ms (±13.0) | 0.41 × (0.40–0.43) **Infinite** | 0.50 × (0.48–0.53) **Infinite** | 0.38 × (0.36–0.39) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 858 ms (±19.0) | 717 ms (±48.9) | 923 ms (±15.2) | 356 ms (±12.3) | 0.42 × (0.40–0.43) **Infinite** | 0.50 × (0.47–0.53) **Infinite** | 0.39 × (0.37–0.40) **Infinite** |
| Descending: click to settled (lower is better) | 858 ms (±19.0) | 717 ms (±48.9) | 923 ms (±15.2) | 356 ms (±12.3) | 0.42 × (0.40–0.43) **Infinite** | 0.50 × (0.47–0.53) **Infinite** | 0.39 × (0.37–0.40) **Infinite** |
| Ascending: main thread scripting (lower is better) | 838 ms (±15.2) | 671 ms (±25.6) | 908 ms (±30.8) | 325 ms (±12.4) | 0.39 × (0.38–0.41) **Infinite** | 0.48 × (0.46–0.52) **Infinite** | 0.36 × (0.34–0.38) **Infinite** |
| Descending: main thread scripting (lower is better) | 850 ms (±19.0) | 704 ms (±48.8) | 916 ms (±15.2) | 342 ms (±12.7) | 0.40 × (0.39–0.42) **Infinite** | 0.49 × (0.46–0.52) **Infinite** | 0.37 × (0.36–0.39) **Infinite** |

## sort-number - 300,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 503 ms (±9.32) | 648 ms (±40.9) | 736 ms (±24.8) | 293 ms (±8.58) | 0.58 × (0.57–0.60) **Infinite** | 0.45 × (0.42–0.48) **Infinite** | 0.40 × (0.39–0.41) **Infinite** |
| Ascending: click to settled (lower is better) | 503 ms (±9.32) | 648 ms (±40.9) | 736 ms (±24.8) | 300 ms (±12.6) | 0.60 × (0.59–0.63) **Infinite** | 0.46 × (0.43–0.51) **Infinite** | 0.41 × (0.40–0.43) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 617 ms (±14.1) | 620 ms (±37.7) | 709 ms (±32.0) | 291 ms (±16.5) | 0.47 × (0.46–0.52) **Infinite** | 0.47 × (0.45–0.53) **Infinite** | 0.41 × (0.40–0.47) **Infinite** |
| Descending: click to settled (lower is better) | 617 ms (±14.1) | 620 ms (±37.7) | 709 ms (±32.0) | 291 ms (±16.5) | 0.47 × (0.46–0.52) **Infinite** | 0.47 × (0.45–0.53) **Infinite** | 0.41 × (0.40–0.47) **Infinite** |
| Ascending: main thread scripting (lower is better) | 492 ms (±9.36) | 632 ms (±40.8) | 729 ms (±24.8) | 280 ms (±9.23) | 0.57 × (0.56–0.58) **Infinite** | 0.44 × (0.41–0.47) **Infinite** | 0.38 × (0.37–0.40) **Infinite** |
| Descending: main thread scripting (lower is better) | 609 ms (±13.9) | 607 ms (±37.9) | 702 ms (±31.4) | 276 ms (±16.9) | 0.45 × (0.44–0.50) **Infinite** | 0.45 × (0.43–0.51) **Infinite** | 0.39 × (0.38–0.45) **Infinite** |

## scroll-jump - 300,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 20.6 ms (±1.54) | 29.1 ms (±1.99) | 10.3 ms (±0.46) | 28.8 ms (±0.94) | 1.40 × (1.31–1.50) **MUI X** | 0.99 × (0.94–1.09) ≈ | 2.79 × (2.66–2.85) **TanStack** |
| Jump to rows painted (worst jump) (lower is better) | 30.5 ms (±1.60) | 47.8 ms (±1.04) | 22.3 ms (±0.95) | 37.4 ms (±0.67) | 1.23 × (1.16–1.29) **MUI X** | 0.78 × (0.77–0.82) **Infinite** | 1.68 × (1.66–1.87) **TanStack** |
| Jump to settled (median of jumps) (lower is better) | 20.6 ms (±1.54) | 29.1 ms (±1.99) | 10.3 ms (±0.46) | 28.8 ms (±0.94) | 1.40 × (1.31–1.50) **MUI X** | 0.99 × (0.94–1.09) ≈ | 2.79 × (2.66–2.85) **TanStack** |
| Main thread scripting (all jumps) (lower is better) | 135 ms (±10.7) | 189 ms (±11.9) | 70.2 ms (±4.37) | 173 ms (±6.71) | 1.28 × (1.19–1.43) **MUI X** | 0.91 × (0.88–1.04) ≈ | 2.46 × (2.33–2.54) **TanStack** |

## scroll-vertical - 300,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 50.3 % (±0.00) | 68.2 % (±21.3) | 100 % (±18.8) | 60.1 % (±1.37) | 1.20 × (1.17–1.23) **Infinite** | 0.88 × (0.60–1.18) ≈ | 0.60 × (0.59–0.62) **TanStack** |
| Frames presented without main-thread update (lower is better) | 49.5 % (±0.00) | 31.8 % (±21.3) | 0.00 % (±18.7) | 39.9 % (±1.37) | 0.81 × (0.77–0.83) **Infinite** | +8.05 (-9.24 to +39.9) ≈ | +39.9 (+38.2 to +41.0) **TanStack** |
| Frames dropped (lower is better) | 0.27 % (±0.00) | 0.00 % (±0.17) | 0.00 % (±0.10) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 (-0.29 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 59.4 fps (±0.41) | 0.99 × (0.98–0.99) **MUI X** | 0.99 × (0.98–0.99) **AG Grid** | 0.99 × (0.98–0.99) **TanStack** |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.03) | 16.7 ms (±0.05) | 16.7 ms (±0.00) | 16.7 ms (±0.05) | 1.00 × (1.00–1.01) ≈ | 1.00 × (0.99–1.01) ≈ | 1.00 × (1.00–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 50.0 ms (±6.27) | 2.98 × (2.97–2.98) **MUI X** | 2.98 × (2.97–2.98) **AG Grid** | 2.98 × (2.97–2.98) **TanStack** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.55 % (±0.44) | +0.55 (+0.54 to +1.10) **MUI X** | +0.55 (+0.54 to +1.10) **AG Grid** | +0.55 (+0.54 to +1.10) **TanStack** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 419 ms (±5.39) | 446 ms (±7.61) | 245 ms (±11.4) | 575 ms (±19.9) | 1.37 × (1.34–1.43) **MUI X** | 1.29 × (1.26–1.35) **AG Grid** | 2.35 × (2.31–2.47) **TanStack** |
| Main thread: layout (lower is better) | 48.2 ms (±0.48) | 74.8 ms (±1.16) | 63.5 ms (±0.89) | 59.9 ms (±2.10) | 1.24 × (1.21–1.28) **MUI X** | 0.80 × (0.78–0.83) **Infinite** | 0.94 × (0.91–0.97) **Infinite** |
| Main thread: style recalc (lower is better) | 71.6 ms (±0.86) | 225 ms (±4.13) | 31.4 ms (±0.39) | 143 ms (±1.27) | 2.00 × (1.96–2.01) **MUI X** | 0.64 × (0.63–0.65) **Infinite** | 4.56 × (4.48–4.60) **TanStack** |
| Main thread: all tasks (lower is better) | 1108 ms (±11.9) | 1169 ms (±27.6) | 701 ms (±13.8) | 1253 ms (±40.7) | 1.13 × (1.10–1.16) **MUI X** | 1.07 × (1.04–1.11) **AG Grid** | 1.79 × (1.73–1.85) **TanStack** |

## scroll-horizontal - 300,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 80.3 % (±0.00) | 100 % (±6.72) | 80.3 % (±9.31) | 96.5 % (±2.60) | 1.20 × (1.19–1.20) **Infinite** | 0.97 × (0.96–0.97) **AG Grid** | 1.20 × (0.97–1.20) ≈ |
| Frames presented without main-thread update (lower is better) | 19.0 % (±0.00) | 0.00 % (±6.72) | 19.0 % (±8.98) | 3.50 % (±2.60) | 0.18 × (0.18–0.22) **Infinite** | +3.50 (+3.42 to +4.17) **AG Grid** | -15.5 (-15.6 to +3.50) ≈ |
| Frames dropped (lower is better) | 0.70 % (±0.00) | 0.00 % (±0.00) | 0.70 % (±0.38) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | -0.70 (-0.70 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±0.04) | 1.00 × (0.99–1.00) ≈ | 1.00 × (0.99–1.00) ≈ | 1.00 × (0.99–1.00) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 267 ms (±3.14) | 185 ms (±6.27) | 118 ms (±5.29) | 124 ms (±2.78) | 0.47 × (0.46–0.48) **Infinite** | 0.67 × (0.65–0.71) **Infinite** | 1.05 × (0.99–1.09) ≈ |
| Main thread: layout (lower is better) | 33.7 ms (±1.12) | 47.9 ms (±1.31) | 35.0 ms (±1.82) | 8.60 ms (±0.41) | 0.26 × (0.25–0.27) **Infinite** | 0.18 × (0.17–0.19) **Infinite** | 0.25 × (0.23–0.26) **Infinite** |
| Main thread: style recalc (lower is better) | 19.1 ms (±0.48) | 34.4 ms (±0.77) | 10.5 ms (±0.57) | 36.2 ms (±0.96) | 1.89 × (1.81–1.93) **MUI X** | 1.05 × (1.01–1.08) **AG Grid** | 3.43 × (3.32–3.58) **TanStack** |
| Main thread: all tasks (lower is better) | 552 ms (±22.7) | 488 ms (±11.3) | 382 ms (±11.2) | 353 ms (±6.58) | 0.64 × (0.63–0.68) **Infinite** | 0.72 × (0.70–0.74) **Infinite** | 0.92 × (0.89–0.94) **Infinite** |

## correctness-vertical - 300,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 2.03 % (±0.34) | 2.31 % (±0.85) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 42.0 % (±6.32) | +42.0 (+41.5 to +43.4) **MUI X** | +42.0 (+41.5 to +43.4) **AG Grid** | +42.0 (+41.5 to +43.4) **TanStack** |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 10.1 % (±1.70) | 11.5 % (±4.25) | 88.1 % (±1.19) | +88.1 (+87.9 to +88.6) **MUI X** | 8.70 × (7.71–11.5) **AG Grid** | 7.63 × (6.85–13.8) **TanStack** |
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
| Captured frames with blank rows (lower is better) | 0.00 % (±0.00) | 4.35 % (±2.51) | 0.00 % (±0.76) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | -4.35 (-6.06 to -2.90) **Infinite** | 0.00 (-1.43 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 0.00 % (±0.00) | 0.57 % (±0.42) | 0.00 % (±0.06) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | -0.57 (-1.05 to -0.16) **Infinite** | 0.00 (-0.08 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 0.00 rows (±0.00) | 4.00 rows (±2.71) | 0.00 rows (±0.79) | 0.00 rows (±0.00) | 0.00 (0.00 to 0.00) ≈ | -4.00 (-7.00 to -1.00) **Infinite** | 0.00 (-1.00 to 0.00) ≈ |
| Captured frames (higher is better) | 73.0 (±0.95) | 67.0 (±1.25) | 70.0 (±2.12) | 73.0 (±0.69) | 1.00 × (1.00–1.03) ≈ | 1.09 × (1.06–1.11) **Infinite** | 1.04 × (1.00–1.06) ≈ |

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
| Time to first rows painted (lower is better) | 628 ms (±17.3) | 743 ms (±16.3) | 595 ms (±10.3) | 470 ms (±17.1) | 0.75 × (0.70–0.77) **Infinite** | 0.63 × (0.60–0.66) **Infinite** | 0.79 × (0.75–0.82) **Infinite** |
| Time until settled (lower is better) | 628 ms (±17.3) | 845 ms (±16.4) | 595 ms (±10.3) | 470 ms (±17.1) | 0.75 × (0.70–0.77) **Infinite** | 0.56 × (0.52–0.58) **Infinite** | 0.79 × (0.75–0.82) **Infinite** |
| Main thread: scripting (lower is better) | 615 ms (±17.3) | 720 ms (±16.1) | 586 ms (±10.4) | 443 ms (±17.1) | 0.72 × (0.68–0.75) **Infinite** | 0.62 × (0.58–0.64) **Infinite** | 0.76 × (0.72–0.79) **Infinite** |
| Main thread: layout (lower is better) | 5.00 ms (±0.38) | 7.38 ms (±0.84) | 3.92 ms (±0.23) | 4.78 ms (±0.18) | 0.96 × (0.90–1.05) ≈ | 0.65 × (0.60–0.71) **Infinite** | 1.22 × (1.18–1.30) **TanStack** |
| Main thread: style recalc (lower is better) | 4.13 ms (±0.05) | 10.2 ms (±0.17) | 1.33 ms (±0.19) | 8.41 ms (±0.91) | 2.04 × (2.00–2.07) **MUI X** | 0.83 × (0.81–0.84) **Infinite** | 6.35 × (4.87–6.52) **TanStack** |
| Main thread: all tasks (lower is better) | 630 ms (±17.5) | 752 ms (±12.2) | 598 ms (±5.80) | 474 ms (±17.1) | 0.75 × (0.70–0.78) **Infinite** | 0.63 × (0.60–0.65) **Infinite** | 0.79 × (0.75–0.82) **Infinite** |
| JS heap retained by grid (lower is better) | 150 MB (±0.00) | 213 MB (±0.01) | 287 MB (±0.00) | 90.6 MB (±0.02) | 0.60 × (0.60–0.60) **Infinite** | 0.42 × (0.42–0.42) **Infinite** | 0.32 × (0.32–0.32) **Infinite** |
| DOM elements in grid (lower is better) | 529 (±0.00) | 637 (±0.00) | 352 (±0.00) | 609 (±0.00) | 1.15 × (1.15–1.15) **MUI X** | 0.96 × (0.96–0.96) **Infinite** | 1.73 × (1.73–1.73) **TanStack** |

## sort-string - 1,000,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 3911 ms (±273) | 3347 ms (±222) | 4452 ms (±216) | 1450 ms (±58.1) | 0.37 × (0.35–0.41) **Infinite** | 0.43 × (0.41–0.48) **Infinite** | 0.33 × (0.31–0.35) **Infinite** |
| Ascending: click to settled (lower is better) | 3911 ms (±273) | 3347 ms (±222) | 4452 ms (±216) | 1461 ms (±59.0) | 0.37 × (0.35–0.42) **Infinite** | 0.44 × (0.41–0.48) **Infinite** | 0.33 × (0.31–0.35) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 3976 ms (±251) | 3253 ms (±212) | 4463 ms (±258) | 1547 ms (±70.0) | 0.39 × (0.37–0.44) **Infinite** | 0.48 × (0.43–0.51) **Infinite** | 0.35 × (0.33–0.38) **Infinite** |
| Descending: click to settled (lower is better) | 3976 ms (±251) | 3253 ms (±212) | 4463 ms (±258) | 1547 ms (±70.0) | 0.39 × (0.37–0.44) **Infinite** | 0.48 × (0.43–0.51) **Infinite** | 0.35 × (0.33–0.38) **Infinite** |
| Ascending: main thread scripting (lower is better) | 3893 ms (±273) | 3331 ms (±222) | 4444 ms (±216) | 1438 ms (±58.1) | 0.37 × (0.35–0.41) **Infinite** | 0.43 × (0.41–0.48) **Infinite** | 0.32 × (0.31–0.35) **Infinite** |
| Descending: main thread scripting (lower is better) | 3968 ms (±251) | 3240 ms (±212) | 4456 ms (±257) | 1536 ms (±70.2) | 0.39 × (0.37–0.43) **Infinite** | 0.47 × (0.43–0.51) **Infinite** | 0.34 × (0.33–0.38) **Infinite** |

## sort-number - 1,000,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 2196 ms (±97.2) | 3405 ms (±127) | 3814 ms (±96.2) | 1251 ms (±39.6) | 0.57 × (0.55–0.60) **Infinite** | 0.37 × (0.36–0.38) **Infinite** | 0.33 × (0.32–0.34) **Infinite** |
| Ascending: click to settled (lower is better) | 2196 ms (±97.2) | 3405 ms (±127) | 3814 ms (±96.2) | 1264 ms (±39.2) | 0.58 × (0.55–0.60) **Infinite** | 0.37 × (0.36–0.38) **Infinite** | 0.33 × (0.32–0.34) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 3091 ms (±193) | 3452 ms (±90.7) | 3901 ms (±120) | 1351 ms (±44.3) | 0.44 × (0.41–0.47) **Infinite** | 0.39 × (0.38–0.40) **Infinite** | 0.35 × (0.33–0.36) **Infinite** |
| Descending: click to settled (lower is better) | 3091 ms (±193) | 3452 ms (±90.7) | 3901 ms (±120) | 1351 ms (±44.3) | 0.44 × (0.41–0.47) **Infinite** | 0.39 × (0.38–0.40) **Infinite** | 0.35 × (0.33–0.36) **Infinite** |
| Ascending: main thread scripting (lower is better) | 2185 ms (±97.0) | 3387 ms (±128) | 3806 ms (±96.1) | 1238 ms (±39.6) | 0.57 × (0.54–0.59) **Infinite** | 0.37 × (0.36–0.38) **Infinite** | 0.33 × (0.32–0.34) **Infinite** |
| Descending: main thread scripting (lower is better) | 3082 ms (±193) | 3440 ms (±91.8) | 3894 ms (±120) | 1336 ms (±44.7) | 0.43 × (0.41–0.46) **Infinite** | 0.39 × (0.38–0.40) **Infinite** | 0.34 × (0.33–0.36) **Infinite** |

## scroll-jump - 1,000,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 21.6 ms (±0.59) | 30.3 ms (±0.63) | 10.8 ms (±0.16) | 33.5 ms (±0.38) | 1.55 × (1.50–1.56) **MUI X** | 1.11 × (1.10–1.13) **AG Grid** | 3.10 × (3.07–3.17) **TanStack** |
| Jump to rows painted (worst jump) (lower is better) | 43.0 ms (±1.86) | 65.3 ms (±2.40) | 28.3 ms (±2.48) | 50.1 ms (±3.09) | 1.17 × (1.10–1.29) **MUI X** | 0.77 × (0.73–0.83) **Infinite** | 1.77 × (1.67–1.93) **TanStack** |
| Jump to settled (median of jumps) (lower is better) | 21.6 ms (±0.59) | 30.3 ms (±0.63) | 10.8 ms (±0.16) | 33.5 ms (±0.38) | 1.55 × (1.50–1.56) **MUI X** | 1.11 × (1.10–1.13) **AG Grid** | 3.10 × (3.07–3.17) **TanStack** |
| Main thread scripting (all jumps) (lower is better) | 150 ms (±4.76) | 207 ms (±2.81) | 72.2 ms (±1.85) | 207 ms (±3.50) | 1.38 × (1.33–1.43) **MUI X** | 1.00 × (0.97–1.03) ≈ | 2.86 × (2.81–2.98) **TanStack** |

## scroll-vertical - 1,000,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 50.3 % (±0.05) | 50.1 % (±0.10) | 100 % (±13.9) | 61.5 % (±0.33) | 1.22 × (1.22–1.23) **Infinite** | 1.23 × (1.22–1.23) **Infinite** | 0.62 × (0.61–0.85) **TanStack** |
| Frames presented without main-thread update (lower is better) | 49.4 % (±0.05) | 49.4 % (±0.07) | 0.00 % (±13.7) | 38.5 % (±0.33) | 0.78 × (0.77–0.78) **Infinite** | 0.78 × (0.77–0.78) **Infinite** | +38.5 (+11.2 to +38.6) **TanStack** |
| Frames dropped (lower is better) | 0.28 % (±0.11) | 0.28 % (±0.11) | 0.00 % (±0.19) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 (-0.39 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.12) | 60.0 fps (±0.12) | 60.0 fps (±0.00) | 57.1 fps (±0.52) | 0.95 × (0.95–0.95) **MUI X** | 0.95 × (0.95–0.95) **AG Grid** | 0.95 × (0.95–0.95) **TanStack** |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.8 ms (±0.05) | 16.8 ms (±0.05) | 16.8 ms (±0.03) | 1.01 × (1.00–1.01) **MUI X** | 1.00 × (1.00–1.01) **AG Grid** | 1.00 × (1.00–1.01) **TanStack** |
| Worst rAF frame interval (lower is better) | 16.8 ms (±6.24) | 16.8 ms (±6.27) | 16.8 ms (±0.00) | 117 ms (±18.5) | 6.94 × (5.95–6.94) **MUI X** | 6.94 × (5.95–6.94) **AG Grid** | 6.94 × (5.95–6.94) **TanStack** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.21) | 0.00 % (±0.21) | 0.00 % (±0.00) | 1.69 % (±0.22) | +1.69 (+1.69 to +1.70) **MUI X** | +1.69 (+1.69 to +1.70) **AG Grid** | +1.69 (+1.69 to +1.70) **TanStack** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 534 ms (±28.4) | 628 ms (±18.2) | 296 ms (±13.7) | 746 ms (±10.9) | 1.40 × (1.34–1.53) **MUI X** | 1.19 × (1.14–1.22) **AG Grid** | 2.52 × (2.41–2.63) **TanStack** |
| Main thread: layout (lower is better) | 57.1 ms (±1.99) | 90.0 ms (±3.24) | 75.2 ms (±5.22) | 82.1 ms (±2.09) | 1.44 × (1.40–1.51) **MUI X** | 0.91 × (0.86–0.96) **Infinite** | 1.09 × (1.06–1.15) **TanStack** |
| Main thread: style recalc (lower is better) | 80.6 ms (±3.71) | 371 ms (±8.27) | 36.3 ms (±1.52) | 208 ms (±3.84) | 2.58 × (2.44–2.67) **MUI X** | 0.56 × (0.53–0.58) **Infinite** | 5.73 × (5.53–5.96) **TanStack** |
| Main thread: all tasks (lower is better) | 1312 ms (±47.5) | 1635 ms (±43.7) | 856 ms (±27.7) | 1645 ms (±33.7) | 1.25 × (1.20–1.34) **MUI X** | 1.01 × (0.96–1.02) ≈ | 1.92 × (1.84–2.00) **TanStack** |

## scroll-horizontal - 1,000,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 80.3 % (±4.86) | 100 % (±5.10) | 100 % (±10.6) | 95.9 % (±0.02) | 1.19 × (1.19–1.25) **Infinite** | 0.96 × (0.96–0.96) **AG Grid** | 0.96 × (0.96–1.19) ≈ |
| Frames presented without main-thread update (lower is better) | 19.0 % (±4.67) | 0.00 % (±4.80) | 0.00 % (±10.2) | 4.14 % (±0.27) | 0.22 × (0.18–0.22) **Infinite** | +4.14 (+4.11 to +4.14) **AG Grid** | +4.14 (-14.9 to +4.14) ≈ |
| Frames dropped (lower is better) | 0.70 % (±0.27) | 0.00 % (±0.30) | 0.00 % (±0.38) | 0.00 % (±0.26) | 0.00 × (0.00–0.00) **Infinite** | 0.00 (0.00 to 0.00) ≈ | 0.00 (-0.70 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±0.05) | 16.7 ms (±0.04) | 1.00 × (0.99–1.00) ≈ | 1.00 × (0.99–1.00) ≈ | 1.00 × (0.99–1.00) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.04) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 259 ms (±9.31) | 175 ms (±8.24) | 110 ms (±3.94) | 134 ms (±3.48) | 0.52 × (0.50–0.54) **Infinite** | 0.77 × (0.72–0.80) **Infinite** | 1.21 × (1.16–1.24) **TanStack** |
| Main thread: layout (lower is better) | 33.5 ms (±2.37) | 47.4 ms (±1.82) | 33.0 ms (±1.58) | 9.09 ms (±0.51) | 0.27 × (0.25–0.31) **Infinite** | 0.19 × (0.19–0.21) **Infinite** | 0.28 × (0.26–0.30) **Infinite** |
| Main thread: style recalc (lower is better) | 19.4 ms (±1.25) | 33.9 ms (±1.05) | 9.85 ms (±0.57) | 37.6 ms (±0.47) | 1.94 × (1.87–2.09) **MUI X** | 1.11 × (1.06–1.12) **AG Grid** | 3.82 × (3.54–3.95) **TanStack** |
| Main thread: all tasks (lower is better) | 591 ms (±19.5) | 422 ms (±16.5) | 310 ms (±8.88) | 418 ms (±7.31) | 0.71 × (0.70–0.75) **Infinite** | 0.99 × (0.94–1.02) ≈ | 1.35 × (1.30–1.40) **TanStack** |

## correctness-vertical - 1,000,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 2.22 % (±0.72) | 2.28 % (±0.72) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 69.7 % (±7.29) | +69.7 (+65.2 to +71.5) **MUI X** | +69.7 (+65.2 to +71.5) **AG Grid** | +69.7 (+65.2 to +71.5) **TanStack** |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 11.1 % (±3.60) | 11.4 % (±3.58) | 84.4 % (±3.38) | +84.4 (+79.1 to +86.4) **MUI X** | 7.60 × (6.45–8.88) **AG Grid** | 7.41 × (5.46–11.2) **TanStack** |
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
| Captured frames with blank rows (lower is better) | 0.00 % (±0.00) | 20.4 % (±2.91) | 2.99 % (±2.44) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | -2.99 (-4.35 to -1.39) **Infinite** |
| Blank body area (avg over frames) (lower is better) | 0.00 % (±0.00) | 9.72 % (±1.24) | 0.31 % (±0.63) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | -0.31 (-0.56 to -0.07) **Infinite** |
| Worst frame: blank rows (lower is better) | 0.00 rows (±0.00) | 18.0 rows (±0.00) | 2.00 rows (±3.05) | 0.00 rows (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | -2.00 (-6.00 to -1.00) **Infinite** |
| Captured frames (higher is better) | 67.0 (±1.00) | 56.0 (±1.50) | 67.0 (±2.51) | 72.0 (±0.69) | 1.07 × (1.04–1.09) **Infinite** | 1.29 × (1.26–1.33) **Infinite** | 1.07 × (1.00–1.07) ≈ |
