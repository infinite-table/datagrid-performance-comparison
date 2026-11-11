# AG Grid vs Infinite Table — benchmark report

- Run: `ci` · 2026-11-11T17:48:25.714Z
- AG Grid 36.3.0 · Infinite Table 10.1.4
- 300,000 rows (data checksum `300000:72377c6e`) · 1,000,000 rows (data checksum `1000000:19e5eebe`) × 20 columns, identical data for both grids
- Chrome 136.0.7103.25 · headless · CPU throttling 1× · viewport 1400×1000
- 7 measured runs per grid per scenario (+1 warmup, discarded), A/B interleaved, fresh browser context per run
- Linux 7.0.0-1017-azure x64 · AMD EPYC 9V45 96-Core Processor × 4
- Served from http://localhost:5560/
- Grid body: 757 px high in both grids (to get there, the setup made the boxes taller: Infinite +21 px)

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
| Time to first rows painted (lower is better) | 254 ms (±13.0) | 196 ms (±26.1) | 0.77 × | 0.67–0.79 | Infinite |
| Time until settled (lower is better) | 356 ms (±12.9) | 196 ms (±21.7) | 0.55 × | 0.49–0.56 | Infinite |
| Main thread: scripting (lower is better) | 232 ms (±11.3) | 179 ms (±23.8) | 0.77 × | 0.66–0.79 | Infinite |
| Main thread: layout (lower is better) | 6.00 ms (±0.77) | 3.11 ms (±0.21) | 0.52 × | 0.50–0.55 | Infinite |
| Main thread: style recalc (lower is better) | 9.97 ms (±0.30) | 5.70 ms (±0.27) | 0.57 × | 0.55–0.60 | Infinite |
| Main thread: all tasks (lower is better) | 260 ms (±12.9) | 200 ms (±21.6) | 0.77 × | 0.68–0.78 | Infinite |
| JS heap retained by grid (lower is better) | 67.4 MB (±0.00) | 36.6 MB (±0.36) | 0.54 × | 0.54–0.54 | Infinite |
| DOM elements in grid (lower is better) | 637 (±0.00) | 609 (±0.00) | 0.96 × | 0.96–0.96 | Infinite |

## sort-string - 300,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Ascending: click to sorted rows painted (lower is better) | 732 ms (±54.1) | 353 ms (±13.5) | 0.48 × | 0.44–0.52 | Infinite |
| Ascending: click to settled (lower is better) | 732 ms (±54.1) | 364 ms (±14.9) | 0.50 × | 0.45–0.53 | Infinite |
| Descending: click to sorted rows painted (lower is better) | 703 ms (±57.0) | 343 ms (±9.26) | 0.49 × | 0.46–0.55 | Infinite |
| Descending: click to settled (lower is better) | 703 ms (±57.0) | 343 ms (±9.26) | 0.49 × | 0.46–0.55 | Infinite |
| Ascending: main thread scripting (lower is better) | 716 ms (±54.4) | 337 ms (±13.1) | 0.47 × | 0.43–0.51 | Infinite |
| Descending: main thread scripting (lower is better) | 691 ms (±56.7) | 327 ms (±9.16) | 0.47 × | 0.44–0.53 | Infinite |

## sort-number - 300,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Ascending: click to sorted rows painted (lower is better) | 628 ms (±14.2) | 288 ms (±10.8) | 0.46 × | 0.45–0.48 | Infinite |
| Ascending: click to settled (lower is better) | 628 ms (±14.2) | 300 ms (±7.11) | 0.48 × | 0.47–0.49 | Infinite |
| Descending: click to sorted rows painted (lower is better) | 632 ms (±31.6) | 287 ms (±13.0) | 0.45 × | 0.43–0.50 | Infinite |
| Descending: click to settled (lower is better) | 632 ms (±31.6) | 287 ms (±13.0) | 0.45 × | 0.43–0.50 | Infinite |
| Ascending: main thread scripting (lower is better) | 613 ms (±14.1) | 274 ms (±11.0) | 0.45 × | 0.43–0.47 | Infinite |
| Descending: main thread scripting (lower is better) | 619 ms (±31.7) | 270 ms (±12.9) | 0.44 × | 0.41–0.48 | Infinite |

## scroll-jump - 300,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Jump to rows painted (median of jumps) (lower is better) | 28.4 ms (±0.88) | 28.4 ms (±0.82) | 1.00 × | 0.96–1.04 | ≈ |
| Jump to rows painted (worst jump) (lower is better) | 46.8 ms (±1.89) | 38.7 ms (±2.38) | 0.83 × | 0.75–0.89 | Infinite |
| Jump to settled (median of jumps) (lower is better) | 28.4 ms (±0.88) | 28.4 ms (±0.82) | 1.00 × | 0.96–1.04 | ≈ |
| Main thread scripting (all jumps) (lower is better) | 181 ms (±5.59) | 164 ms (±7.10) | 0.91 × | 0.87–0.97 | Infinite |

## scroll-vertical - 300,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for both grids). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Frames fully presented (higher is better) | 52.0 % (±7.39) | 61.2 % (±2.47) | 1.18 × | 1.08–1.18 | Infinite |
| Frames presented without main-thread update (lower is better) | 47.7 % (±7.47) | 38.8 % (±2.47) | 0.81 × | 0.80–0.92 | Infinite |
| Frames dropped (lower is better) | 0.29 % (±0.16) | 0.00 % (±0.00) | -0.29 % | -0.29 to 0.00 | ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 59.4 fps (±0.24) | 0.99 × | 0.99–0.99 | AG Grid |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.04) | 16.8 ms (±0.05) | 1.01 × | 1.00–1.01 | ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 33.3 ms (±8.11) | 1.98 × | 1.98–2.97 | AG Grid |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.54 % (±0.29) | +0.54 % | +0.54 to +1.09 | AG Grid |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms | 0.00 to 0.00 | ≈ |
| Main thread: scripting (lower is better) | 501 ms (±9.01) | 574 ms (±19.0) | 1.15 × | 1.11–1.21 | AG Grid |
| Main thread: layout (lower is better) | 86.9 ms (±1.82) | 66.4 ms (±4.26) | 0.76 × | 0.72–0.81 | Infinite |
| Main thread: style recalc (lower is better) | 227 ms (±5.62) | 152 ms (±7.79) | 0.67 × | 0.63–0.69 | Infinite |
| Main thread: all tasks (lower is better) | 1288 ms (±29.8) | 1298 ms (±58.0) | 1.01 × | 0.97–1.06 | ≈ |

## scroll-horizontal - 300,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for both grids). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Frames fully presented (higher is better) | 94.0 % (±8.23) | 95.8 % (±6.42) | 1.02 × | 0.83–1.18 | ≈ |
| Frames presented without main-thread update (lower is better) | 3.45 % (±8.14) | 4.17 % (±6.42) | +0.72 % | -14.2 to +17.2 | ≈ |
| Frames dropped (lower is better) | 0.00 % (±1.04) | 0.00 % (±0.00) | 0.00 % | -1.68 to 0.00 | ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.19) | 60.0 fps (±0.18) | 1.00 × | 1.00–1.00 | AG Grid |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.7 ms (±0.04) | 1.00 × | 0.99–1.00 | ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±6.27) | 16.8 ms (±6.27) | 1.00 × | 1.00–1.00 | ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.31) | 0.00 % (±0.31) | 0.00 % | 0.00 to 0.00 | ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms | 0.00 to 0.00 | ≈ |
| Main thread: scripting (lower is better) | 225 ms (±5.64) | 136 ms (±3.68) | 0.60 × | 0.56–0.61 | Infinite |
| Main thread: layout (lower is better) | 66.6 ms (±2.54) | 10.9 ms (±0.34) | 0.16 × | 0.16–0.17 | Infinite |
| Main thread: style recalc (lower is better) | 39.0 ms (±1.19) | 42.5 ms (±1.73) | 1.09 × | 1.03–1.12 | AG Grid |
| Main thread: all tasks (lower is better) | 600 ms (±20.7) | 396 ms (±13.5) | 0.66 × | 0.64–0.70 | Infinite |

## correctness-vertical - 300,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Blank samples (lower is better) | 2.78 % (±1.11) | 0.00 % (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 42.3 % (±4.90) | +42.3 % | +41.4 to +51.2 | AG Grid |
| Frames with any blank/wrong sample (lower is better) | 13.9 % (±5.56) | 89.7 % (±2.03) | 6.44 × | 5.83–23.7 | AG Grid |
| Worst frame: correct samples (higher is better) | 80.0 % (±0.00) | 0.00 % (±0.00) | 0.00 × | 0.00–0.00 | AG Grid |

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
| Captured frames with blank rows (lower is better) | 8.96 % (±3.18) | 0.00 % (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Blank body area (avg over frames) (lower is better) | 1.29 % (±1.39) | 0.00 % (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Worst frame: blank rows (lower is better) | 7.00 rows (±4.32) | 0.00 rows (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Captured frames (higher is better) | 65.0 (±1.89) | 73.0 (±1.15) | 1.12 × | 1.07–1.14 | Infinite |

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
| Time to first rows painted (lower is better) | 611 ms (±6.67) | 411 ms (±35.0) | 0.67 × | 0.64–0.70 | Infinite |
| Time until settled (lower is better) | 714 ms (±6.70) | 411 ms (±32.4) | 0.58 × | 0.57–0.60 | Infinite |
| Main thread: scripting (lower is better) | 590 ms (±6.35) | 394 ms (±32.2) | 0.67 × | 0.63–0.70 | Infinite |
| Main thread: layout (lower is better) | 5.95 ms (±0.12) | 3.73 ms (±0.60) | 0.63 × | 0.58–0.67 | Infinite |
| Main thread: style recalc (lower is better) | 10.0 ms (±0.36) | 7.10 ms (±0.77) | 0.71 × | 0.67–0.77 | Infinite |
| Main thread: all tasks (lower is better) | 619 ms (±6.46) | 414 ms (±33.6) | 0.67 × | 0.64–0.70 | Infinite |
| JS heap retained by grid (lower is better) | 213 MB (±0.00) | 90.7 MB (±0.37) | 0.42 × | 0.42–0.42 | Infinite |
| DOM elements in grid (lower is better) | 637 (±0.00) | 609 (±0.00) | 0.96 × | 0.96–0.96 | Infinite |

## sort-string - 1,000,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Ascending: click to sorted rows painted (lower is better) | 3088 ms (±35.6) | 1380 ms (±78.8) | 0.45 × | 0.42–0.47 | Infinite |
| Ascending: click to settled (lower is better) | 3088 ms (±35.6) | 1398 ms (±79.7) | 0.45 × | 0.42–0.48 | Infinite |
| Descending: click to sorted rows painted (lower is better) | 3034 ms (±61.0) | 1586 ms (±84.8) | 0.52 × | 0.50–0.55 | Infinite |
| Descending: click to settled (lower is better) | 3034 ms (±61.0) | 1586 ms (±84.8) | 0.52 × | 0.50–0.55 | Infinite |
| Ascending: main thread scripting (lower is better) | 3078 ms (±35.9) | 1365 ms (±78.8) | 0.44 × | 0.41–0.47 | Infinite |
| Descending: main thread scripting (lower is better) | 3022 ms (±61.1) | 1570 ms (±88.4) | 0.52 × | 0.49–0.55 | Infinite |

## sort-number - 1,000,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Ascending: click to sorted rows painted (lower is better) | 2710 ms (±91.3) | 1140 ms (±64.5) | 0.42 × | 0.40–0.43 | Infinite |
| Ascending: click to settled (lower is better) | 2710 ms (±91.3) | 1153 ms (±65.1) | 0.43 × | 0.40–0.44 | Infinite |
| Descending: click to sorted rows painted (lower is better) | 2728 ms (±93.6) | 1142 ms (±92.2) | 0.42 × | 0.40–0.47 | Infinite |
| Descending: click to settled (lower is better) | 2728 ms (±93.6) | 1142 ms (±92.2) | 0.42 × | 0.40–0.47 | Infinite |
| Ascending: main thread scripting (lower is better) | 2696 ms (±91.4) | 1132 ms (±64.8) | 0.42 × | 0.39–0.43 | Infinite |
| Descending: main thread scripting (lower is better) | 2721 ms (±94.7) | 1125 ms (±92.0) | 0.41 × | 0.39–0.47 | Infinite |

## scroll-jump - 1,000,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Jump to rows painted (median of jumps) (lower is better) | 27.4 ms (±0.62) | 30.0 ms (±0.82) | 1.10 × | 1.08–1.15 | AG Grid |
| Jump to rows painted (worst jump) (lower is better) | 53.1 ms (±14.0) | 42.2 ms (±2.20) | 0.79 × | 0.76–0.85 | Infinite |
| Jump to settled (median of jumps) (lower is better) | 27.4 ms (±0.62) | 30.0 ms (±0.82) | 1.10 × | 1.08–1.15 | AG Grid |
| Main thread scripting (all jumps) (lower is better) | 177 ms (±9.67) | 179 ms (±4.84) | 1.01 × | 0.95–1.02 | ≈ |

## scroll-vertical - 1,000,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for both grids). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Frames fully presented (higher is better) | 50.7 % (±0.28) | 61.7 % (±1.73) | 1.22 × | 1.21–1.29 | Infinite |
| Frames presented without main-thread update (lower is better) | 48.9 % (±0.34) | 38.3 % (±1.65) | 0.78 × | 0.71–0.79 | Infinite |
| Frames dropped (lower is better) | 0.55 % (±0.15) | 0.00 % (±0.21) | 0.00 × | 0.00–0.00 | Infinite |
| Main thread frame rate (rAF) (higher is better) | 59.7 fps (±0.17) | 57.4 fps (±0.87) | 0.96 × | 0.94–0.97 | AG Grid |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.04) | 16.8 ms (±0.05) | 1.01 × | 1.00–1.01 | ≈ |
| Worst rAF frame interval (lower is better) | 33.2 ms (±8.82) | 100 ms (±0.06) | 3.01 × | 3.00–5.95 | AG Grid |
| rAF intervals > 25ms (lower is better) | 0.54 % (±0.29) | 1.69 % (±1.15) | +1.14 % | +0.58 to +3.45 | AG Grid |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms | 0.00 to 0.00 | ≈ |
| Main thread: scripting (lower is better) | 680 ms (±36.8) | 744 ms (±45.7) | 1.09 × | 0.99–1.13 | ≈ |
| Main thread: layout (lower is better) | 99.3 ms (±8.47) | 87.9 ms (±7.56) | 0.89 × | 0.79–0.99 | Infinite |
| Main thread: style recalc (lower is better) | 362 ms (±21.2) | 219 ms (±14.1) | 0.61 × | 0.53–0.63 | Infinite |
| Main thread: all tasks (lower is better) | 1725 ms (±110) | 1706 ms (±126) | 0.99 × | 0.88–1.04 | ≈ |

## scroll-horizontal - 1,000,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for both grids). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Frames fully presented (higher is better) | 100 % (±8.44) | 96.5 % (±2.34) | 0.96 × | 0.94–1.16 | ≈ |
| Frames presented without main-thread update (lower is better) | 0.00 % (±8.27) | 3.52 % (±1.90) | +3.52 % | -12.4 to +5.59 | ≈ |
| Frames dropped (lower is better) | 0.00 % (±0.29) | 0.00 % (±0.49) | 0.00 % | 0.00 to 0.00 | ≈ |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 1.00 × | 1.00–1.00 | ≈ |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.8 ms (±0.05) | 1.01 × | 1.00–1.01 | ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 1.00 × | 1.00–1.00 | ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % | 0.00 to 0.00 | ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms | 0.00 to 0.00 | ≈ |
| Main thread: scripting (lower is better) | 194 ms (±3.96) | 127 ms (±3.30) | 0.66 × | 0.63–0.67 | Infinite |
| Main thread: layout (lower is better) | 56.8 ms (±3.25) | 10.2 ms (±0.39) | 0.18 × | 0.18–0.19 | Infinite |
| Main thread: style recalc (lower is better) | 36.4 ms (±0.68) | 38.2 ms (±2.23) | 1.05 × | 0.99–1.09 | ≈ |
| Main thread: all tasks (lower is better) | 588 ms (±67.9) | 394 ms (±15.0) | 0.67 × | 0.63–0.85 | Infinite |

## correctness-vertical - 1,000,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | AG Grid median (sd) | Infinite median (sd) | Infinite / AG (or Infinite − AG) | 95% CI | Better |
|---|---:|---:|---:|---:|:---:|
| Blank samples (lower is better) | 2.19 % (±0.85) | 0.00 % (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 66.6 % (±5.84) | +66.6 % | +63.8 to +70.6 | AG Grid |
| Frames with any blank/wrong sample (lower is better) | 11.0 % (±4.26) | 85.4 % (±1.31) | 7.79 × | 5.26–9.16 | AG Grid |
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
| Captured frames with blank rows (lower is better) | 22.4 % (±5.98) | 0.00 % (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Blank body area (avg over frames) (lower is better) | 8.48 % (±2.16) | 0.00 % (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Worst frame: blank rows (lower is better) | 18.0 rows (±1.21) | 0.00 rows (±0.00) | 0.00 × | 0.00–0.00 | Infinite |
| Captured frames (higher is better) | 56.0 (±3.15) | 72.0 (±1.41) | 1.29 × | 1.24–1.38 | Infinite |
