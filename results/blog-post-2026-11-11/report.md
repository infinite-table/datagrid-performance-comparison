# AG Grid vs Infinite Table — benchmark report

- Run: `2026-11-11` · 2026-11-11T16:52:14.998Z
- AG Grid 36.3.0 · Infinite Table 10.1.4
- 300,000 rows (data checksum `300000:72377c6e`) · 1,000,000 rows (data checksum `1000000:19e5eebe`) × 20 columns, identical data for both grids
- Chrome 136.0.7103.25 · headless · CPU throttling 1× · viewport 1400×1000
- 7 measured runs per grid per scenario (+1 warmup, discarded), A/B interleaved, fresh browser context per run
- Darwin 24.1.0 arm64 · Apple M1 Pro × 10
- Served from http://localhost:5560/
- Grid body: 757 px high in both grids (the Infinite box is 21 px taller to make up for what it renders outside the body - the footer Infinite Table shows without a license key)

"Infinite / AG" < 1 means Infinite has the lower value. "Better" is only set when the 95% bootstrap CI of the ratio of medians excludes 1. When AG Grid has zeros among its values (e.g. 0% blank samples) a ratio means nothing, so the difference of medians (Infinite − AG) and its CI are shown instead, and "Better" needs that CI to exclude 0.

# 300,000 rows

Scroll range - browsers cap element sizes (Chrome ~16.7M-33.5M px, depending on the version), so grids map the scrollbar onto the rows when the content is taller than that.

| | AG Grid | Infinite |
|---|---:|---:|
| Last row reachable with the scrollbar | yes (300,000) | yes (300,000) |
| Native scroll range | 11,999,243 px | 11,999,243 px |
| Content px per scrollbar px | 1.000 | 1.000 |

## mount - 300,000 rows

Mount the grid with all the rows (data already in memory). "Visible" = from setState to the end of the first frame committed with the whole viewport (first/last visible row and column) showing the right content. "Settled" = until the first frame committed after the grid's last DOM mutation. Memory is the JS heap retained by the grid after GC (heap after mount - heap before mount).

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Time to first rows painted (lower is better) | 199 ms (±5.95) | 139 ms (±7.38) | 0.70 × | 0.67–0.72 | Infinite |
| Time until settled (lower is better) | 303 ms (±5.91) | 142 ms (±2.87) | 0.47 × | 0.45–0.48 | Infinite |
| Main thread: scripting (lower is better) | 182 ms (±5.91) | 126 ms (±6.21) | 0.69 × | 0.66–0.71 | Infinite |
| Main thread: layout (lower is better) | 7.32 ms (±0.21) | 2.16 ms (±0.14) | 0.30 × | 0.28–0.31 | Infinite |
| Main thread: style recalc (lower is better) | 7.61 ms (±0.25) | 3.80 ms (±0.13) | 0.50 × | 0.47–0.51 | Infinite |
| Main thread: all tasks (lower is better) | 209 ms (±6.62) | 144 ms (±5.59) | 0.69 × | 0.66–0.70 | Infinite |
| JS heap retained by grid (lower is better) | 67.5 MB (±0.00) | 36.6 MB (±0.35) | 0.54 × | 0.54–0.54 | Infinite |
| DOM elements in grid (lower is better) | 637 (±0.00) | 609 (±0.00) | 0.96 × | 0.96–0.96 | Infinite |

## sort-string - 300,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Ascending: click to sorted rows painted (lower is better) | 793 ms (±66.6) | 344 ms (±6.98) | 0.43 × | 0.37–0.45 | Infinite |
| Ascending: click to settled (lower is better) | 793 ms (±66.6) | 347 ms (±8.21) | 0.44 × | 0.38–0.46 | Infinite |
| Descending: click to sorted rows painted (lower is better) | 832 ms (±16.9) | 346 ms (±10.3) | 0.42 × | 0.40–0.43 | Infinite |
| Descending: click to settled (lower is better) | 832 ms (±16.9) | 346 ms (±10.3) | 0.42 × | 0.40–0.43 | Infinite |
| Ascending: main thread scripting (lower is better) | 781 ms (±66.4) | 332 ms (±7.61) | 0.42 × | 0.36–0.44 | Infinite |
| Descending: main thread scripting (lower is better) | 822 ms (±17.1) | 332 ms (±10.9) | 0.40 × | 0.39–0.42 | Infinite |

## sort-number - 300,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Ascending: click to sorted rows painted (lower is better) | 694 ms (±28.5) | 288 ms (±7.71) | 0.41 × | 0.39–0.43 | Infinite |
| Ascending: click to settled (lower is better) | 694 ms (±28.5) | 294 ms (±9.49) | 0.42 × | 0.40–0.45 | Infinite |
| Descending: click to sorted rows painted (lower is better) | 705 ms (±16.3) | 288 ms (±8.54) | 0.41 × | 0.40–0.43 | Infinite |
| Descending: click to settled (lower is better) | 705 ms (±16.3) | 288 ms (±8.54) | 0.41 × | 0.40–0.43 | Infinite |
| Ascending: main thread scripting (lower is better) | 683 ms (±28.6) | 281 ms (±6.63) | 0.41 × | 0.38–0.42 | Infinite |
| Descending: main thread scripting (lower is better) | 696 ms (±16.2) | 274 ms (±8.21) | 0.39 × | 0.39–0.42 | Infinite |

## scroll-jump - 300,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Jump to rows painted (median of jumps) (lower is better) | 28.3 ms (±1.58) | 27.9 ms (±1.77) | 0.99 × | 0.95–1.14 | ≈ |
| Jump to rows painted (worst jump) (lower is better) | 39.4 ms (±5.32) | 34.1 ms (±8.58) | 0.87 × | 0.80–1.05 | ≈ |
| Jump to settled (median of jumps) (lower is better) | 28.3 ms (±1.58) | 27.9 ms (±1.77) | 0.99 × | 0.95–1.14 | ≈ |
| Main thread scripting (all jumps) (lower is better) | 155 ms (±6.65) | 169 ms (±7.45) | 1.09 × | 1.06–1.17 | AG Grid |

## scroll-vertical - 300,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for both grids). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Frames fully presented (higher is better) | 52.1 % (±2.21) | 56.6 % (±1.11) | 1.09 × | 1.07–1.09 | Infinite |
| Frames presented without main-thread update (lower is better) | 47.9 % (±2.21) | 43.4 % (±1.11) | 0.91 × | 0.90–0.93 | Infinite |
| Frames dropped (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % | 0.00 to 0.00 | ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.17) | 1.00 × | 0.99–1.00 | ≈ |
| p95 rAF frame interval (lower is better) | 17.3 ms (±0.17) | 17.2 ms (±0.22) | 1.00 × | 0.98–1.02 | ≈ |
| Worst rAF frame interval (lower is better) | 17.6 ms (±0.05) | 17.7 ms (±8.62) | 1.01 × | 0.99–1.94 | ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.29) | 0.00 % | 0.00 to +0.54 | ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms | 0.00 to 0.00 | ≈ |
| Main thread: scripting (lower is better) | 410 ms (±9.69) | 495 ms (±6.35) | 1.21 × | 1.18–1.25 | AG Grid |
| Main thread: layout (lower is better) | 77.9 ms (±1.50) | 55.9 ms (±0.82) | 0.72 × | 0.70–0.73 | Infinite |
| Main thread: style recalc (lower is better) | 179 ms (±4.38) | 126 ms (±1.07) | 0.71 × | 0.69–0.72 | Infinite |
| Main thread: all tasks (lower is better) | 1017 ms (±18.7) | 1063 ms (±11.4) | 1.04 × | 1.02–1.06 | AG Grid |

## scroll-horizontal - 300,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for both grids). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Frames fully presented (higher is better) | 85.3 % (±2.93) | 88.4 % (±5.01) | 1.04 × | 0.96–1.05 | ≈ |
| Frames presented without main-thread update (lower is better) | 14.7 % (±2.93) | 11.6 % (±5.01) | 0.79 × | 0.69–1.26 | ≈ |
| Frames dropped (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % | 0.00 to 0.00 | ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.01) | 60.0 fps (±0.01) | 1.00 × | 1.00–1.00 | ≈ |
| p95 rAF frame interval (lower is better) | 17.1 ms (±0.21) | 17.3 ms (±0.25) | 1.01 × | 0.99–1.02 | ≈ |
| Worst rAF frame interval (lower is better) | 17.6 ms (±0.05) | 17.7 ms (±0.08) | 1.01 × | 0.99–1.01 | ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % | 0.00 to 0.00 | ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms | 0.00 to 0.00 | ≈ |
| Main thread: scripting (lower is better) | 167 ms (±5.58) | 111 ms (±5.39) | 0.67 × | 0.62–0.70 | Infinite |
| Main thread: layout (lower is better) | 49.0 ms (±1.44) | 8.21 ms (±0.38) | 0.17 × | 0.16–0.18 | Infinite |
| Main thread: style recalc (lower is better) | 30.2 ms (±1.06) | 34.4 ms (±1.77) | 1.14 × | 1.07–1.21 | AG Grid |
| Main thread: all tasks (lower is better) | 416 ms (±9.51) | 319 ms (±20.9) | 0.77 × | 0.71–0.83 | Infinite |

## correctness-vertical - 300,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Blank samples (lower is better) | 2.60 % (±0.39) | 0.00 % (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 38.4 % (±0.71) | +38.4 % | +37.4 to +39.0 | AG Grid |
| Frames with any blank/wrong sample (lower is better) | 13.0 % (±1.93) | 90.8 % (±1.60) | 6.99 × | 6.52–8.89 | AG Grid |
| Worst frame: correct samples (higher is better) | 80.0 % (±0.00) | 12.6 % (±18.7) | 0.16 × | 0.14–0.61 | AG Grid |

## correctness-horizontal - 300,000 rows

Same kind of horizontal wheel gesture. After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % | 0.00 to 0.00 | ≈ |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % | 0.00 to 0.00 | ≈ |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % | 0.00 to 0.00 | ≈ |
| Worst frame: correct samples (higher is better) | 100 % (±0.00) | 100 % (±0.00) | 1.00 × | 1.00–1.00 | ≈ |

## visual-blank-vertical - 300,000 rows

Fast vertical wheel gesture (20000px/s) while recording what the compositor actually displays (CDP screencast). Each frame is checked for blank areas: vertical runs of the body with no text where rows should be. Unlike the correctness probe, this also catches the compositor scrolling ahead of the main thread. Screencast capture skips frames under load and adds overhead - compare the two grids, not absolute numbers.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Captured frames with blank rows (lower is better) | 4.17 % (±4.60) | 0.00 % (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Blank body area (avg over frames) (lower is better) | 0.45 % (±1.65) | 0.00 % (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Worst frame: blank rows (lower is better) | 3.00 rows (±5.35) | 0.00 rows (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Captured frames (higher is better) | 74.0 (±0.76) | 74.0 (±0.00) | 1.00 × | 1.00–1.00 | ≈ |

# 1,000,000 rows

Scroll range - browsers cap element sizes (Chrome ~16.7M-33.5M px, depending on the version), so grids map the scrollbar onto the rows when the content is taller than that.

| | AG Grid | Infinite |
|---|---:|---:|
| Last row reachable with the scrollbar | yes (1,000,000) | yes (1,000,000) |
| Native scroll range | 31,999,242 px | 31,999,243 px |
| Content px per scrollbar px | 1.250 | 1.250 |

## mount - 1,000,000 rows

Mount the grid with all the rows (data already in memory). "Visible" = from setState to the end of the first frame committed with the whole viewport (first/last visible row and column) showing the right content. "Settled" = until the first frame committed after the grid's last DOM mutation. Memory is the JS heap retained by the grid after GC (heap after mount - heap before mount).

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Time to first rows painted (lower is better) | 504 ms (±34.1) | 379 ms (±44.3) | 0.75 × | 0.72–0.88 | Infinite |
| Time until settled (lower is better) | 607 ms (±34.3) | 379 ms (±47.2) | 0.62 × | 0.60–0.75 | Infinite |
| Main thread: scripting (lower is better) | 485 ms (±33.1) | 368 ms (±44.5) | 0.76 × | 0.72–0.89 | Infinite |
| Main thread: layout (lower is better) | 7.40 ms (±0.35) | 2.32 ms (±0.14) | 0.31 × | 0.29–0.33 | Infinite |
| Main thread: style recalc (lower is better) | 7.79 ms (±0.72) | 3.73 ms (±0.18) | 0.48 × | 0.43–0.51 | Infinite |
| Main thread: all tasks (lower is better) | 511 ms (±34.1) | 382 ms (±44.9) | 0.75 × | 0.71–0.88 | Infinite |
| JS heap retained by grid (lower is better) | 213 MB (±0.00) | 90.7 MB (±0.37) | 0.42 × | 0.42–0.42 | Infinite |
| DOM elements in grid (lower is better) | 637 (±0.00) | 609 (±0.00) | 0.96 × | 0.96–0.96 | Infinite |

## sort-string - 1,000,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Ascending: click to sorted rows painted (lower is better) | 3350 ms (±166) | 1346 ms (±57.1) | 0.40 × | 0.36–0.43 | Infinite |
| Ascending: click to settled (lower is better) | 3350 ms (±166) | 1363 ms (±55.5) | 0.41 × | 0.36–0.43 | Infinite |
| Descending: click to sorted rows painted (lower is better) | 3510 ms (±174) | 1384 ms (±41.5) | 0.39 × | 0.38–0.43 | Infinite |
| Descending: click to settled (lower is better) | 3510 ms (±174) | 1384 ms (±41.5) | 0.39 × | 0.38–0.43 | Infinite |
| Ascending: main thread scripting (lower is better) | 3339 ms (±166) | 1333 ms (±57.3) | 0.40 × | 0.36–0.43 | Infinite |
| Descending: main thread scripting (lower is better) | 3502 ms (±174) | 1369 ms (±41.8) | 0.39 × | 0.37–0.43 | Infinite |

## sort-number - 1,000,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Ascending: click to sorted rows painted (lower is better) | 2913 ms (±79.2) | 1114 ms (±51.7) | 0.38 × | 0.37–0.39 | Infinite |
| Ascending: click to settled (lower is better) | 2913 ms (±79.2) | 1128 ms (±49.2) | 0.39 × | 0.37–0.40 | Infinite |
| Descending: click to sorted rows painted (lower is better) | 2948 ms (±87.4) | 1142 ms (±45.3) | 0.39 × | 0.37–0.41 | Infinite |
| Descending: click to settled (lower is better) | 2948 ms (±87.4) | 1142 ms (±45.3) | 0.39 × | 0.37–0.41 | Infinite |
| Ascending: main thread scripting (lower is better) | 2901 ms (±78.8) | 1101 ms (±52.2) | 0.38 × | 0.36–0.39 | Infinite |
| Descending: main thread scripting (lower is better) | 2940 ms (±87.6) | 1126 ms (±45.4) | 0.38 × | 0.37–0.41 | Infinite |

## scroll-jump - 1,000,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Jump to rows painted (median of jumps) (lower is better) | 21.1 ms (±1.33) | 24.6 ms (±1.31) | 1.16 × | 1.08–1.22 | AG Grid |
| Jump to rows painted (worst jump) (lower is better) | 34.8 ms (±2.04) | 35.5 ms (±4.40) | 1.02 × | 0.83–1.14 | ≈ |
| Jump to settled (median of jumps) (lower is better) | 21.1 ms (±1.33) | 24.6 ms (±1.31) | 1.16 × | 1.08–1.22 | AG Grid |
| Main thread scripting (all jumps) (lower is better) | 128 ms (±6.19) | 152 ms (±12.6) | 1.19 × | 1.06–1.30 | AG Grid |

## scroll-vertical - 1,000,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for both grids). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Frames fully presented (higher is better) | 52.2 % (±1.25) | 54.0 % (±1.99) | 1.03 × | 1.03–1.10 | Infinite |
| Frames presented without main-thread update (lower is better) | 47.8 % (±1.25) | 46.0 % (±1.99) | 0.96 × | 0.89–0.97 | Infinite |
| Frames dropped (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % | 0.00 to 0.00 | ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.38) | 60.0 fps (±0.26) | 1.00 × | 1.00–1.01 | ≈ |
| p95 rAF frame interval (lower is better) | 17.3 ms (±0.12) | 17.5 ms (±0.13) | 1.01 × | 1.00–1.01 | ≈ |
| Worst rAF frame interval (lower is better) | 17.7 ms (±18.7) | 17.7 ms (±6.01) | 1.00 × | 0.53–1.01 | ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.27) | 0.00 % (±0.41) | 0.00 % | -0.54 to 0.00 | ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms | 0.00 to 0.00 | ≈ |
| Main thread: scripting (lower is better) | 482 ms (±7.06) | 564 ms (±11.8) | 1.17 × | 1.13–1.19 | AG Grid |
| Main thread: layout (lower is better) | 80.1 ms (±1.57) | 62.8 ms (±1.05) | 0.78 × | 0.77–0.80 | Infinite |
| Main thread: style recalc (lower is better) | 265 ms (±3.78) | 141 ms (±2.07) | 0.53 × | 0.52–0.54 | Infinite |
| Main thread: all tasks (lower is better) | 1278 ms (±14.1) | 1180 ms (±22.5) | 0.92 × | 0.91–0.94 | Infinite |

## scroll-horizontal - 1,000,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for both grids). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Frames fully presented (higher is better) | 86.0 % (±1.79) | 89.7 % (±3.31) | 1.04 × | 1.00–1.12 | Infinite |
| Frames presented without main-thread update (lower is better) | 14.0 % (±1.79) | 10.3 % (±3.31) | 0.73 × | 0.30–0.97 | Infinite |
| Frames dropped (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % | 0.00 to 0.00 | ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.03) | 60.0 fps (±0.02) | 1.00 × | 1.00–1.00 | ≈ |
| p95 rAF frame interval (lower is better) | 17.4 ms (±0.13) | 17.4 ms (±0.16) | 1.00 × | 0.99–1.02 | ≈ |
| Worst rAF frame interval (lower is better) | 17.7 ms (±0.07) | 17.7 ms (±0.08) | 1.00 × | 0.99–1.01 | ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % | 0.00 to 0.00 | ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms | 0.00 to 0.00 | ≈ |
| Main thread: scripting (lower is better) | 166 ms (±2.81) | 110 ms (±2.56) | 0.66 × | 0.65–0.68 | Infinite |
| Main thread: layout (lower is better) | 49.3 ms (±1.00) | 8.42 ms (±0.16) | 0.17 × | 0.16–0.17 | Infinite |
| Main thread: style recalc (lower is better) | 31.7 ms (±0.71) | 34.1 ms (±0.60) | 1.07 × | 1.06–1.12 | AG Grid |
| Main thread: all tasks (lower is better) | 390 ms (±5.23) | 335 ms (±11.8) | 0.86 × | 0.84–0.87 | Infinite |

## correctness-vertical - 1,000,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Blank samples (lower is better) | 2.47 % (±0.30) | 0.00 % (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 55.1 % (±14.4) | +55.1 % | +51.2 to +77.7 | AG Grid |
| Frames with any blank/wrong sample (lower is better) | 12.3 % (±1.50) | 87.3 % (±4.19) | 7.08 × | 6.48–8.46 | AG Grid |
| Worst frame: correct samples (higher is better) | 80.0 % (±0.00) | 0.00 % (±0.00) | 0.00 × | 0.00–0.00 | AG Grid |

## correctness-horizontal - 1,000,000 rows

Same kind of horizontal wheel gesture. After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % | 0.00 to 0.00 | ≈ |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % | 0.00 to 0.00 | ≈ |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % | 0.00 to 0.00 | ≈ |
| Worst frame: correct samples (higher is better) | 100 % (±0.00) | 100 % (±0.00) | 1.00 × | 1.00–1.00 | ≈ |

## visual-blank-vertical - 1,000,000 rows

Fast vertical wheel gesture (20000px/s) while recording what the compositor actually displays (CDP screencast). Each frame is checked for blank areas: vertical runs of the body with no text where rows should be. Unlike the correctness probe, this also catches the compositor scrolling ahead of the main thread. Screencast capture skips frames under load and adds overhead - compare the two grids, not absolute numbers.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Captured frames with blank rows (lower is better) | 9.46 % (±3.37) | 0.00 % (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Blank body area (avg over frames) (lower is better) | 3.14 % (±2.10) | 0.00 % (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Worst frame: blank rows (lower is better) | 14.0 rows (±3.21) | 0.00 rows (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Captured frames (higher is better) | 74.0 (±0.38) | 74.0 (±0.58) | 1.00 × | 1.00–1.00 | ≈ |
