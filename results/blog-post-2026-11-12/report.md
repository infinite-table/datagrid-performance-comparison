# AG Grid vs MUI X Data Grid vs TanStack Table vs Infinite Table — benchmark report

- Run: `blog-post-2026-11-12` · 2026-11-12T11:39:14.456Z
- AG Grid 36.3.0 · MUI X Data Grid 9.17.0 · TanStack Table 9.3.1 · Infinite Table 10.1.5
- 300,000 rows (data checksum `300000:72377c6e`) · 1,000,000 rows (data checksum `1000000:19e5eebe`) × 20 columns, identical data for every grid
- Chrome 136.0.7103.25 · headless · CPU throttling 1× · viewport 1400×1000
- 7 measured runs per grid per scenario (+1 warmup, discarded), interleaved, fresh browser context per run
- Darwin 24.1.0 arm64 · Apple M1 Pro × 10
- Served from http://localhost:5560/
- Grid body: 759 px high in every grid (to get there, the setup made the boxes taller: AG Grid +1 px, MUI X +68 px, TanStack +1 px, Infinite +23 px)

The "Infinite vs ..." columns compare Infinite Table with one other grid: the ratio of the medians (Infinite / other, so < 1 means Infinite has the lower value), its 95% bootstrap confidence interval, and the grid that does better. A grid is only named when the interval excludes 1; "≈" means no significant difference. When the other grid has zeros among its values (e.g. 0% blank samples) a ratio means nothing, so the difference of the medians (Infinite − other) and its interval are shown instead, and a grid is only named when that interval excludes 0.

MUI X Data Grid always paginates, with at most 100 rows on a page: all the rows are loaded and sorted, but only one page can be scrolled through. So it is in the mount and sort scenarios, and not in the scrolling ones.

# 300,000 rows

Scroll range - browsers cap element sizes (Chrome ~16.7M-33.5M px, depending on the version), so a grid has to map the scrollbar onto the rows when the content is taller than that. One that doesn't can't reach its last rows.

| | AG Grid | MUI X | TanStack | Infinite |
|---|---:|---:|---:|---:|
| Last row reachable with the scrollbar | yes (300,000) | **no** - 100 rows on a page | yes (300,000) | yes (300,000) |
| Native scroll range | 11,999,242 px | n/a | 11,999,242 px | 11,999,242 px |
| Content px per scrollbar px | 1.000 | n/a | 1.000 | 1.000 |

## mount - 300,000 rows

Mount the grid with all the rows (data already in memory). "Visible" = from setState to the end of the first frame committed with the whole viewport (first/last visible row and column) showing the right content. "Settled" = until the first frame committed after the grid's last DOM mutation. Memory is the JS heap retained by the grid after GC (heap after mount - heap before mount).

| Metric | AG Grid median (sd) | MUI X median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs MUI X | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Time to first rows painted (lower is better) | 192 ms (±3.24) | 94.0 ms (±3.13) | 109 ms (±2.87) | 135 ms (±2.88) | 0.70 × (0.68–0.72) **Infinite** | 1.44 × (1.37–1.48) **MUI X** | 1.24 × (1.19–1.28) **TanStack** |
| Time until settled (lower is better) | 295 ms (±3.25) | 94.0 ms (±3.13) | 109 ms (±2.87) | 136 ms (±3.42) | 0.46 × (0.45–0.47) **Infinite** | 1.45 × (1.39–1.48) **MUI X** | 1.25 × (1.21–1.30) **TanStack** |
| Main thread: scripting (lower is better) | 176 ms (±3.35) | 82.6 ms (±2.97) | 101 ms (±2.65) | 122 ms (±1.91) | 0.69 × (0.68–0.71) **Infinite** | 1.47 × (1.42–1.51) **MUI X** | 1.20 × (1.16–1.23) **TanStack** |
| Main thread: layout (lower is better) | 6.81 ms (±0.16) | 5.80 ms (±0.24) | 3.74 ms (±0.13) | 2.13 ms (±0.05) | 0.31 × (0.30–0.32) **Infinite** | 0.37 × (0.35–0.37) **Infinite** | 0.57 × (0.55–0.59) **Infinite** |
| Main thread: style recalc (lower is better) | 7.12 ms (±0.15) | 2.67 ms (±0.12) | 1.06 ms (±0.06) | 3.91 ms (±0.12) | 0.55 × (0.52–0.56) **Infinite** | 1.47 × (1.37–1.51) **MUI X** | 3.69 × (3.30–3.85) **TanStack** |
| Main thread: all tasks (lower is better) | 202 ms (±3.59) | 118 ms (±3.29) | 115 ms (±2.79) | 140 ms (±1.84) | 0.69 × (0.68–0.71) **Infinite** | 1.19 × (1.14–1.21) **MUI X** | 1.22 × (1.18–1.24) **TanStack** |
| JS heap retained by grid (lower is better) | 67.5 MB (±0.00) | 27.2 MB (±0.00) | 86.6 MB (±0.00) | 36.6 MB (±0.35) | 0.54 × (0.54–0.54) **Infinite** | 1.34 × (1.34–1.34) **MUI X** | 0.42 × (0.42–0.42) **Infinite** |
| DOM elements in grid (lower is better) | 637 (±0.00) | 535 (±0.00) | 352 (±0.00) | 609 (±0.00) | 0.96 × (0.96–0.96) **Infinite** | 1.14 × (1.14–1.14) **MUI X** | 1.73 × (1.73–1.73) **TanStack** |

## sort-string - 300,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | MUI X median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs MUI X | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 800 ms (±105) | 848 ms (±96.0) | 1005 ms (±68.2) | 340 ms (±38.8) | 0.42 × (0.36–0.47) **Infinite** | 0.40 × (0.34–0.44) **Infinite** | 0.34 × (0.30–0.39) **Infinite** |
| Ascending: click to settled (lower is better) | 800 ms (±105) | 848 ms (±96.0) | 1005 ms (±68.2) | 347 ms (±40.8) | 0.43 × (0.37–0.49) **Infinite** | 0.41 × (0.35–0.46) **Infinite** | 0.34 × (0.32–0.40) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 816 ms (±136) | 846 ms (±38.4) | 1040 ms (±114) | 333 ms (±31.0) | 0.41 × (0.31–0.48) **Infinite** | 0.39 × (0.36–0.44) **Infinite** | 0.32 × (0.30–0.39) **Infinite** |
| Descending: click to settled (lower is better) | 816 ms (±136) | 846 ms (±38.4) | 1040 ms (±114) | 333 ms (±31.0) | 0.41 × (0.31–0.48) **Infinite** | 0.39 × (0.36–0.44) **Infinite** | 0.32 × (0.30–0.39) **Infinite** |
| Ascending: main thread scripting (lower is better) | 787 ms (±104) | 839 ms (±96.0) | 1000 ms (±68.1) | 326 ms (±39.4) | 0.41 × (0.35–0.46) **Infinite** | 0.39 × (0.34–0.43) **Infinite** | 0.33 × (0.30–0.38) **Infinite** |
| Descending: main thread scripting (lower is better) | 807 ms (±135) | 840 ms (±38.3) | 1036 ms (±114) | 319 ms (±30.1) | 0.40 × (0.30–0.47) **Infinite** | 0.38 × (0.35–0.43) **Infinite** | 0.31 × (0.29–0.38) **Infinite** |

## sort-number - 300,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | MUI X median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs MUI X | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 653 ms (±39.6) | 346 ms (±16.4) | 760 ms (±25.0) | 277 ms (±5.96) | 0.42 × (0.39–0.44) **Infinite** | 0.80 × (0.75–0.84) **Infinite** | 0.36 × (0.35–0.37) **Infinite** |
| Ascending: click to settled (lower is better) | 653 ms (±39.6) | 346 ms (±16.4) | 760 ms (±25.0) | 286 ms (±7.42) | 0.44 × (0.41–0.45) **Infinite** | 0.82 × (0.78–0.86) **Infinite** | 0.38 × (0.36–0.38) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 645 ms (±33.5) | 427 ms (±9.82) | 728 ms (±29.3) | 280 ms (±10.8) | 0.43 × (0.41–0.46) **Infinite** | 0.66 × (0.63–0.69) **Infinite** | 0.38 × (0.36–0.41) **Infinite** |
| Descending: click to settled (lower is better) | 645 ms (±33.5) | 427 ms (±9.82) | 728 ms (±29.3) | 280 ms (±10.8) | 0.43 × (0.41–0.46) **Infinite** | 0.66 × (0.63–0.69) **Infinite** | 0.38 × (0.36–0.41) **Infinite** |
| Ascending: main thread scripting (lower is better) | 642 ms (±40.1) | 336 ms (±16.5) | 755 ms (±25.0) | 271 ms (±6.10) | 0.42 × (0.39–0.43) **Infinite** | 0.81 × (0.75–0.84) **Infinite** | 0.36 × (0.34–0.37) **Infinite** |
| Descending: main thread scripting (lower is better) | 636 ms (±33.4) | 422 ms (±9.66) | 723 ms (±29.4) | 271 ms (±10.9) | 0.43 × (0.40–0.46) **Infinite** | 0.64 × (0.62–0.69) **Infinite** | 0.37 × (0.35–0.40) **Infinite** |

## scroll-jump - 300,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 28.8 ms (±5.05) | 9.87 ms (±1.59) | 28.5 ms (±3.49) | 0.99 × (0.77–1.41) ≈ | 2.89 × (2.27–4.03) **TanStack** |
| Jump to rows painted (worst jump) (lower is better) | 46.5 ms (±9.31) | 12.9 ms (±8.04) | 34.3 ms (±2.89) | 0.74 × (0.65–1.10) ≈ | 2.65 × (1.26–3.03) **TanStack** |
| Jump to settled (median of jumps) (lower is better) | 28.8 ms (±5.05) | 9.87 ms (±1.59) | 28.5 ms (±3.49) | 0.99 × (0.77–1.41) ≈ | 2.89 × (2.27–4.03) **TanStack** |
| Main thread scripting (all jumps) (lower is better) | 161 ms (±21.0) | 79.8 ms (±4.12) | 173 ms (±23.8) | 1.07 × (0.82–1.33) ≈ | 2.17 × (1.64–2.36) **TanStack** |

## scroll-vertical - 300,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 52.3 % (±0.97) | 100 % (±23.2) | 56.4 % (±2.25) | 1.08 × (1.08–1.08) **Infinite** | 0.56 × (0.56–1.04) ≈ |
| Frames presented without main-thread update (lower is better) | 47.7 % (±0.97) | 0.00 % (±23.0) | 43.6 % (±2.25) | 0.91 × (0.91–0.92) **Infinite** | +43.6 (-1.66 to +43.7) ≈ |
| Frames dropped (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.22) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 59.7 fps (±0.17) | 0.99 × (0.99–1.00) **AG Grid** | 0.99 × (0.99–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 17.0 ms (±0.18) | 17.2 ms (±0.22) | 17.1 ms (±0.14) | 1.01 × (0.99–1.02) ≈ | 1.00 × (0.99–1.02) ≈ |
| Worst rAF frame interval (lower is better) | 17.6 ms (±0.11) | 17.7 ms (±0.05) | 33.3 ms (±8.36) | 1.89 × (1.00–1.90) **AG Grid** | 1.88 × (1.00–1.89) **TanStack** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.54 % (±0.29) | +0.54 (0.00 to +0.54) ≈ | +0.54 (0.00 to +0.54) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 438 ms (±26.4) | 282 ms (±23.2) | 507 ms (±17.0) | 1.16 × (1.11–1.31) **AG Grid** | 1.80 × (1.73–2.06) **TanStack** |
| Main thread: layout (lower is better) | 86.3 ms (±5.05) | 64.3 ms (±7.73) | 55.2 ms (±2.64) | 0.64 × (0.63–0.76) **Infinite** | 0.86 × (0.75–1.01) ≈ |
| Main thread: style recalc (lower is better) | 188 ms (±11.9) | 29.6 ms (±2.56) | 135 ms (±8.40) | 0.72 × (0.66–0.84) **Infinite** | 4.54 × (3.94–4.96) **TanStack** |
| Main thread: all tasks (lower is better) | 1099 ms (±52.8) | 689 ms (±44.4) | 1099 ms (±44.7) | 1.00 × (0.98–1.13) ≈ | 1.60 × (1.55–1.80) **TanStack** |

## scroll-horizontal - 300,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 87.0 % (±2.99) | 100 % (±0.95) | 88.8 % (±0.37) | 1.02 × (1.00–1.05) ≈ | 0.89 × (0.88–0.89) **TanStack** |
| Frames presented without main-thread update (lower is better) | 13.0 % (±2.99) | 0.00 % (±0.95) | 11.2 % (±0.37) | 0.86 × (0.73–1.03) ≈ | +11.2 (+11.1 to +11.6) **TanStack** |
| Frames dropped (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.01) | 60.0 fps (±0.02) | 60.0 fps (±0.01) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 17.5 ms (±0.21) | 17.6 ms (±0.06) | 17.6 ms (±0.24) | 1.00 × (0.98–1.01) ≈ | 1.00 × (0.98–1.00) ≈ |
| Worst rAF frame interval (lower is better) | 17.8 ms (±0.12) | 17.7 ms (±0.05) | 17.7 ms (±0.06) | 0.99 × (0.99–1.01) ≈ | 1.00 × (0.99–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 180 ms (±6.70) | 207 ms (±11.1) | 118 ms (±5.84) | 0.66 × (0.61–0.70) **Infinite** | 0.57 × (0.53–0.62) **Infinite** |
| Main thread: layout (lower is better) | 53.2 ms (±2.38) | 36.2 ms (±1.54) | 8.90 ms (±0.58) | 0.17 × (0.14–0.17) **Infinite** | 0.25 × (0.21–0.25) **Infinite** |
| Main thread: style recalc (lower is better) | 31.5 ms (±1.14) | 10.7 ms (±0.81) | 38.2 ms (±1.77) | 1.21 × (1.09–1.27) **AG Grid** | 3.57 × (3.13–3.79) **TanStack** |
| Main thread: all tasks (lower is better) | 456 ms (±15.7) | 403 ms (±11.5) | 342 ms (±17.7) | 0.75 × (0.69–0.80) **Infinite** | 0.85 × (0.77–0.88) **Infinite** |

## correctness-vertical - 300,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 1.84 % (±0.63) | 2.03 % (±0.91) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 64.7 % (±11.7) | +64.7 (+58.9 to +69.2) **AG Grid** | +64.7 (+58.9 to +69.2) **TanStack** |
| Frames with any blank/wrong sample (lower is better) | 9.21 % (±3.16) | 10.1 % (±4.56) | 86.4 % (±3.04) | 9.38 × (7.22–17.3) **AG Grid** | 8.53 × (5.16–9.94) **TanStack** |
| Worst frame: correct samples (higher is better) | 80.0 % (±0.00) | 80.0 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **AG Grid** | 0.00 × (0.00–0.00) **TanStack** |

## correctness-horizontal - 300,000 rows

Same kind of horizontal wheel gesture. After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: correct samples (higher is better) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |

## visual-blank-vertical - 300,000 rows

Fast vertical wheel gesture (20000px/s) while recording what the compositor actually displays (CDP screencast). Each frame is checked for blank areas: vertical runs of the body with no text where rows should be. Unlike the correctness probe, this also catches the compositor scrolling ahead of the main thread. Screencast capture skips frames under load and adds overhead - compare the grids, not absolute numbers.

| Metric | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|
| Captured frames with blank rows (lower is better) | 2.70 % (±9.15) | 0.00 % (±34.0) | 0.00 % (±0.00) | -2.70 (-14.9 to -1.35) **Infinite** | 0.00 (-61.6 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 0.44 % (±2.24) | 0.00 % (±3.36) | 0.00 % (±0.00) | -0.44 (-2.84 to -0.15) **Infinite** | 0.00 (-6.12 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 3.00 rows (±6.00) | 0.00 rows (±3.09) | 0.00 rows (±0.00) | -3.00 (-12.0 to -2.00) **Infinite** | 0.00 (-6.00 to 0.00) ≈ |
| Captured frames (higher is better) | 74.0 (±0.38) | 73.0 (±0.53) | 74.0 (±0.49) | 1.00 × (1.00–1.01) ≈ | 1.01 × (1.00–1.03) ≈ |

# 1,000,000 rows

Scroll range - browsers cap element sizes (Chrome ~16.7M-33.5M px, depending on the version), so a grid has to map the scrollbar onto the rows when the content is taller than that. One that doesn't can't reach its last rows.

| | AG Grid | MUI X | TanStack | Infinite |
|---|---:|---:|---:|---:|
| Last row reachable with the scrollbar | yes (1,000,000) | **no** - 100 rows on a page | **no** - stops at row 838,860 | yes (1,000,000) |
| Native scroll range | 31,999,240 px | n/a | 33,553,631 px | 31,999,241 px |
| Content px per scrollbar px | 1.250 | n/a | 1.000 | 1.250 |

## mount - 1,000,000 rows

Mount the grid with all the rows (data already in memory). "Visible" = from setState to the end of the first frame committed with the whole viewport (first/last visible row and column) showing the right content. "Settled" = until the first frame committed after the grid's last DOM mutation. Memory is the JS heap retained by the grid after GC (heap after mount - heap before mount).

| Metric | AG Grid median (sd) | MUI X median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs MUI X | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Time to first rows painted (lower is better) | 467 ms (±16.2) | 144 ms (±12.0) | 373 ms (±23.3) | 318 ms (±43.1) | 0.68 × (0.63–0.81) **Infinite** | 2.21 × (1.95–2.63) **MUI X** | 0.85 × (0.78–1.05) ≈ |
| Time until settled (lower is better) | 570 ms (±16.4) | 144 ms (±12.0) | 373 ms (±23.3) | 329 ms (±41.6) | 0.58 × (0.53–0.66) **Infinite** | 2.29 × (1.99–2.63) **MUI X** | 0.88 × (0.80–1.05) ≈ |
| Main thread: scripting (lower is better) | 449 ms (±15.6) | 131 ms (±11.7) | 366 ms (±22.6) | 307 ms (±42.3) | 0.68 × (0.65–0.82) **Infinite** | 2.34 × (2.07–2.80) **MUI X** | 0.84 × (0.78–1.04) ≈ |
| Main thread: layout (lower is better) | 7.05 ms (±0.21) | 6.18 ms (±0.41) | 3.63 ms (±0.66) | 2.26 ms (±0.09) | 0.32 × (0.30–0.33) **Infinite** | 0.37 × (0.33–0.38) **Infinite** | 0.62 × (0.51–0.64) **Infinite** |
| Main thread: style recalc (lower is better) | 7.66 ms (±0.37) | 2.89 ms (±0.22) | 0.89 ms (±0.05) | 3.95 ms (±0.20) | 0.52 × (0.49–0.56) **Infinite** | 1.37 × (1.25–1.47) **MUI X** | 4.44 × (4.18–4.76) **TanStack** |
| Main thread: all tasks (lower is better) | 477 ms (±15.7) | 219 ms (±14.9) | 375 ms (±24.5) | 321 ms (±42.2) | 0.67 × (0.64–0.80) **Infinite** | 1.47 × (1.37–1.82) **MUI X** | 0.86 × (0.79–1.05) ≈ |
| JS heap retained by grid (lower is better) | 213 MB (±0.00) | 78.8 MB (±0.00) | 287 MB (±0.00) | 90.7 MB (±0.37) | 0.42 × (0.42–0.42) **Infinite** | 1.15 × (1.15–1.15) **MUI X** | 0.32 × (0.32–0.32) **Infinite** |
| DOM elements in grid (lower is better) | 637 (±0.00) | 535 (±0.00) | 352 (±0.00) | 609 (±0.00) | 0.96 × (0.96–0.96) **Infinite** | 1.14 × (1.14–1.14) **MUI X** | 1.73 × (1.73–1.73) **TanStack** |

## sort-string - 1,000,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | MUI X median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs MUI X | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 3353 ms (±203) | 3493 ms (±269) | 4098 ms (±473) | 1305 ms (±138) | 0.39 × (0.36–0.46) **Infinite** | 0.37 × (0.34–0.42) **Infinite** | 0.32 × (0.28–0.36) **Infinite** |
| Ascending: click to settled (lower is better) | 3353 ms (±203) | 3493 ms (±269) | 4098 ms (±473) | 1312 ms (±137) | 0.39 × (0.37–0.46) **Infinite** | 0.38 × (0.34–0.42) **Infinite** | 0.32 × (0.28–0.36) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 3179 ms (±223) | 3590 ms (±267) | 4098 ms (±367) | 1338 ms (±113) | 0.42 × (0.37–0.47) **Infinite** | 0.37 × (0.34–0.41) **Infinite** | 0.33 × (0.31–0.36) **Infinite** |
| Descending: click to settled (lower is better) | 3179 ms (±223) | 3590 ms (±267) | 4098 ms (±367) | 1338 ms (±113) | 0.42 × (0.37–0.47) **Infinite** | 0.37 × (0.34–0.41) **Infinite** | 0.33 × (0.31–0.36) **Infinite** |
| Ascending: main thread scripting (lower is better) | 3341 ms (±201) | 3485 ms (±269) | 4092 ms (±472) | 1294 ms (±136) | 0.39 × (0.36–0.46) **Infinite** | 0.37 × (0.33–0.42) **Infinite** | 0.32 × (0.27–0.36) **Infinite** |
| Descending: main thread scripting (lower is better) | 3170 ms (±223) | 3585 ms (±267) | 4094 ms (±367) | 1324 ms (±112) | 0.42 × (0.37–0.46) **Infinite** | 0.37 × (0.34–0.41) **Infinite** | 0.32 × (0.30–0.36) **Infinite** |

## sort-number - 1,000,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | MUI X median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs MUI X | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 2893 ms (±126) | 1546 ms (±204) | 3584 ms (±187) | 1139 ms (±33.5) | 0.39 × (0.38–0.41) **Infinite** | 0.74 × (0.66–0.81) **Infinite** | 0.32 × (0.29–0.33) **Infinite** |
| Ascending: click to settled (lower is better) | 2893 ms (±126) | 1546 ms (±204) | 3584 ms (±187) | 1143 ms (±33.6) | 0.40 × (0.38–0.41) **Infinite** | 0.74 × (0.67–0.82) **Infinite** | 0.32 × (0.29–0.33) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 3016 ms (±97.1) | 2007 ms (±195) | 3516 ms (±196) | 1187 ms (±53.4) | 0.39 × (0.37–0.40) **Infinite** | 0.59 × (0.52–0.61) **Infinite** | 0.34 × (0.30–0.35) **Infinite** |
| Descending: click to settled (lower is better) | 3016 ms (±97.1) | 2007 ms (±195) | 3516 ms (±196) | 1187 ms (±53.4) | 0.39 × (0.37–0.40) **Infinite** | 0.59 × (0.52–0.61) **Infinite** | 0.34 × (0.30–0.35) **Infinite** |
| Ascending: main thread scripting (lower is better) | 2880 ms (±126) | 1537 ms (±203) | 3579 ms (±187) | 1132 ms (±32.3) | 0.39 × (0.38–0.40) **Infinite** | 0.74 × (0.66–0.81) **Infinite** | 0.32 × (0.29–0.33) **Infinite** |
| Descending: main thread scripting (lower is better) | 3007 ms (±96.5) | 2002 ms (±195) | 3512 ms (±196) | 1176 ms (±53.0) | 0.39 × (0.37–0.40) **Infinite** | 0.59 × (0.52–0.61) **Infinite** | 0.33 × (0.30–0.34) **Infinite** |

## scroll-jump - 1,000,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 20.1 ms (±0.74) | 7.18 ms (±0.71) | 24.1 ms (±0.75) | 1.20 × (1.13–1.24) **AG Grid** | 3.36 × (2.88–3.48) **TanStack** |
| Jump to rows painted (worst jump) (lower is better) | 34.4 ms (±6.58) | 14.6 ms (±1.09) | 30.6 ms (±4.53) | 0.89 × (0.80–1.09) ≈ | 2.09 × (1.86–2.63) **TanStack** |
| Jump to settled (median of jumps) (lower is better) | 20.1 ms (±0.74) | 7.18 ms (±0.71) | 24.1 ms (±0.75) | 1.20 × (1.13–1.24) **AG Grid** | 3.36 × (2.88–3.48) **TanStack** |
| Main thread scripting (all jumps) (lower is better) | 124 ms (±9.17) | 46.2 ms (±8.87) | 141 ms (±4.64) | 1.14 × (1.08–1.17) **AG Grid** | 3.06 × (2.21–3.12) **TanStack** |

## scroll-vertical - 1,000,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 53.7 % (±1.06) | 100 % (±0.00) | 54.1 % (±3.03) | 1.01 × (0.97–1.11) ≈ | 0.54 × (0.54–0.60) **TanStack** |
| Frames presented without main-thread update (lower is better) | 46.3 % (±1.06) | 0.00 % (±0.00) | 45.9 % (±3.03) | 0.99 × (0.87–1.04) ≈ | +45.9 (+40.5 to +46.4) **TanStack** |
| Frames dropped (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.26) | 60.0 fps (±0.02) | 60.0 fps (±0.30) | 1.00 × (0.99–1.00) ≈ | 1.00 × (0.99–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 17.4 ms (±0.16) | 17.5 ms (±0.15) | 17.4 ms (±0.18) | 1.00 × (0.98–1.02) ≈ | 1.00 × (0.98–1.02) ≈ |
| Worst rAF frame interval (lower is better) | 17.6 ms (±6.33) | 17.7 ms (±0.00) | 17.7 ms (±15.3) | 1.01 × (0.99–2.84) ≈ | 1.00 × (1.00–2.82) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.41) | 0.00 % (±0.00) | 0.00 % (±0.29) | 0.00 (0.00 to +0.54) ≈ | 0.00 (0.00 to +0.54) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 499 ms (±7.98) | 226 ms (±12.2) | 559 ms (±12.8) | 1.12 × (1.10–1.16) **AG Grid** | 2.48 × (2.27–2.58) **TanStack** |
| Main thread: layout (lower is better) | 85.2 ms (±1.33) | 58.0 ms (±3.32) | 63.4 ms (±2.53) | 0.74 × (0.73–0.79) **Infinite** | 1.09 × (1.01–1.18) **TanStack** |
| Main thread: style recalc (lower is better) | 266 ms (±5.82) | 26.2 ms (±1.46) | 151 ms (±5.16) | 0.57 × (0.54–0.58) **Infinite** | 5.75 × (5.30–6.15) **TanStack** |
| Main thread: all tasks (lower is better) | 1345 ms (±33.5) | 623 ms (±19.3) | 1181 ms (±39.0) | 0.88 × (0.87–0.95) **Infinite** | 1.90 × (1.82–2.04) **TanStack** |

## scroll-horizontal - 1,000,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 93.6 % (±4.49) | 100 % (±2.12) | 89.4 % (±0.30) | 0.96 × (0.94–1.04) ≈ | 0.89 × (0.89–0.90) **TanStack** |
| Frames presented without main-thread update (lower is better) | 6.38 % (±4.49) | 0.00 % (±2.12) | 10.6 % (±0.30) | 1.65 × (0.76–1.95) ≈ | +10.6 (+9.42 to +11.0) **TanStack** |
| Frames dropped (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.36) | 60.0 fps (±0.01) | 60.0 fps (±0.01) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 17.5 ms (±0.17) | 17.5 ms (±0.27) | 17.5 ms (±0.10) | 1.00 × (0.99–1.01) ≈ | 1.00 × (0.99–1.03) ≈ |
| Worst rAF frame interval (lower is better) | 17.6 ms (±5.97) | 17.7 ms (±0.12) | 17.7 ms (±0.05) | 1.01 × (0.99–1.01) ≈ | 1.00 × (0.99–1.01) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.62) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 170 ms (±13.1) | 138 ms (±27.4) | 111 ms (±9.95) | 0.65 × (0.58–0.76) **Infinite** | 0.81 × (0.72–1.16) ≈ |
| Main thread: layout (lower is better) | 48.7 ms (±3.64) | 36.7 ms (±5.76) | 8.50 ms (±0.61) | 0.17 × (0.15–0.19) **Infinite** | 0.23 × (0.18–0.27) **Infinite** |
| Main thread: style recalc (lower is better) | 28.9 ms (±3.67) | 10.3 ms (±1.58) | 36.7 ms (±3.13) | 1.27 × (0.98–1.41) ≈ | 3.55 × (2.79–4.28) **TanStack** |
| Main thread: all tasks (lower is better) | 402 ms (±26.2) | 331 ms (±42.2) | 355 ms (±23.2) | 0.88 × (0.77–0.97) **Infinite** | 1.07 × (0.95–1.37) ≈ |

## correctness-vertical - 1,000,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 2.22 % (±0.49) | 2.82 % (±0.78) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 77.3 % (±13.2) | +77.3 (+52.9 to +78.6) **AG Grid** | +77.3 (+52.9 to +78.6) **TanStack** |
| Frames with any blank/wrong sample (lower is better) | 11.1 % (±2.47) | 14.1 % (±3.92) | 86.8 % (±4.05) | 7.81 × (7.10–10.6) **AG Grid** | 6.15 × (5.44–7.10) **TanStack** |
| Worst frame: correct samples (higher is better) | 80.0 % (±0.00) | 80.0 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **AG Grid** | 0.00 × (0.00–0.00) **TanStack** |

## correctness-horizontal - 1,000,000 rows

Same kind of horizontal wheel gesture. After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Worst frame: correct samples (higher is better) | 100 % (±0.00) | 100 % (±0.00) | 100 % (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |

## visual-blank-vertical - 1,000,000 rows

Fast vertical wheel gesture (20000px/s) while recording what the compositor actually displays (CDP screencast). Each frame is checked for blank areas: vertical runs of the body with no text where rows should be. Unlike the correctness probe, this also catches the compositor scrolling ahead of the main thread. Screencast capture skips frames under load and adds overhead - compare the grids, not absolute numbers.

| Metric | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|
| Captured frames with blank rows (lower is better) | 21.6 % (±22.8) | 16.7 % (±28.3) | 0.00 % (±0.00) | -21.6 (-55.4 to -8.11) **Infinite** | -16.7 (-62.2 to 0.00) ≈ |
| Blank body area (avg over frames) (lower is better) | 9.53 % (±12.9) | 5.53 % (±3.31) | 0.00 % (±0.00) | -9.53 (-30.9 to -2.33) **Infinite** | -5.53 (-6.21 to 0.00) ≈ |
| Worst frame: blank rows (lower is better) | 16.0 rows (±6.78) | 3.00 rows (±8.31) | 0.00 rows (±0.00) | -16.0 (-18.0 to -9.00) **Infinite** | -3.00 (-18.0 to 0.00) ≈ |
| Captured frames (higher is better) | 74.0 (±0.38) | 74.0 (±0.79) | 74.0 (±1.70) | 1.00 × (1.00–1.01) ≈ | 1.00 × (1.00–1.03) ≈ |
