# MUI X Data Grid vs AG Grid vs TanStack Table vs Infinite Table — benchmark report

- Run: `ci` · 2026-11-27T21:29:04.487Z
- MUI X Data Grid 9.18.0 · AG Grid 36.3.0 · TanStack Table 9.3.1 · Infinite Table 11.0.1
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
| Time to first rows painted (lower is better) | 638 ms (±33.2) | 814 ms (±13.6) | 666 ms (±9.99) | 487 ms (±23.7) | 0.76 × (0.68–0.81) **Infinite** | 0.60 × (0.56–0.63) **Infinite** | 0.73 × (0.69–0.78) **Infinite** |
| Time until settled (lower is better) | 638 ms (±33.2) | 916 ms (±13.5) | 666 ms (±9.99) | 487 ms (±23.7) | 0.76 × (0.68–0.81) **Infinite** | 0.53 × (0.50–0.56) **Infinite** | 0.73 × (0.69–0.78) **Infinite** |
| Main thread: scripting (lower is better) | 625 ms (±32.9) | 789 ms (±13.9) | 656 ms (±9.70) | 457 ms (±23.4) | 0.73 × (0.66–0.79) **Infinite** | 0.58 × (0.55–0.62) **Infinite** | 0.70 × (0.66–0.75) **Infinite** |
| Main thread: layout (lower is better) | 4.40 ms (±0.20) | 7.02 ms (±0.23) | 4.20 ms (±0.13) | 5.07 ms (±0.92) | 1.15 × (1.08–1.63) **MUI X** | 0.72 × (0.69–1.02) ≈ | 1.21 × (1.18–1.70) **TanStack** |
| Main thread: style recalc (lower is better) | 4.57 ms (±0.12) | 11.3 ms (±0.29) | 1.76 ms (±0.26) | 10.1 ms (±0.21) | 2.22 × (2.12–2.32) **MUI X** | 0.89 × (0.87–0.94) **Infinite** | 5.77 × (4.54–6.45) **TanStack** |
| Main thread: all tasks (lower is better) | 642 ms (±33.4) | 822 ms (±13.4) | 668 ms (±10.3) | 491 ms (±19.4) | 0.77 × (0.70–0.81) **Infinite** | 0.60 × (0.57–0.63) **Infinite** | 0.74 × (0.71–0.78) **Infinite** |
| JS heap retained by grid (lower is better) | 150 MB (±0.00) | 213 MB (±0.00) | 287 MB (±0.00) | 90.7 MB (±0.02) | 0.60 × (0.60–0.60) **Infinite** | 0.42 × (0.42–0.42) **Infinite** | 0.32 × (0.32–0.32) **Infinite** |
| DOM elements in grid (lower is better) | 529 (±0.00) | 637 (±0.00) | 352 (±0.00) | 609 (±0.00) | 1.15 × (1.15–1.15) **MUI X** | 0.96 × (0.96–0.96) **Infinite** | 1.73 × (1.73–1.73) **TanStack** |

## sort-string - 1,000,000 rows

Click the "code" column header (string column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 4380 ms (±111) | 3476 ms (±93.7) | 4561 ms (±209) | 1637 ms (±52.0) | 0.37 × (0.36–0.40) **Infinite** | 0.47 × (0.46–0.52) **Infinite** | 0.36 × (0.33–0.38) **Infinite** |
| Ascending: click to settled (lower is better) | 4380 ms (±111) | 3476 ms (±93.7) | 4561 ms (±209) | 1647 ms (±53.4) | 0.38 × (0.36–0.40) **Infinite** | 0.47 × (0.47–0.52) **Infinite** | 0.36 × (0.33–0.38) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 4554 ms (±221) | 3620 ms (±40.9) | 4478 ms (±205) | 1814 ms (±87.5) | 0.40 × (0.39–0.47) **Infinite** | 0.50 × (0.50–0.55) **Infinite** | 0.40 × (0.37–0.45) **Infinite** |
| Descending: click to settled (lower is better) | 4554 ms (±221) | 3620 ms (±40.9) | 4478 ms (±205) | 1814 ms (±87.5) | 0.40 × (0.39–0.47) **Infinite** | 0.50 × (0.50–0.55) **Infinite** | 0.40 × (0.37–0.45) **Infinite** |
| Ascending: main thread scripting (lower is better) | 4368 ms (±111) | 3458 ms (±93.7) | 4553 ms (±209) | 1624 ms (±52.7) | 0.37 × (0.36–0.40) **Infinite** | 0.47 × (0.46–0.51) **Infinite** | 0.36 × (0.33–0.38) **Infinite** |
| Descending: main thread scripting (lower is better) | 4546 ms (±221) | 3606 ms (±40.7) | 4471 ms (±205) | 1797 ms (±87.6) | 0.40 × (0.39–0.47) **Infinite** | 0.50 × (0.49–0.55) **Infinite** | 0.40 × (0.37–0.45) **Infinite** |

## sort-number - 1,000,000 rows

Click the "salary" column header (number column, unique-ish values) - first click sorts ascending (cold), second click descending. Measured from pointerdown to the end of the first frame committed with all visible rows sorted (and each row consistent: its cells belong to the same data row).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ascending: click to sorted rows painted (lower is better) | 2092 ms (±89.9) | 2890 ms (±23.6) | 3784 ms (±86.3) | 531 ms (±26.4) | 0.25 × (0.23–0.27) **Infinite** | 0.18 × (0.17–0.19) **Infinite** | 0.14 × (0.13–0.15) **Infinite** |
| Ascending: click to settled (lower is better) | 2092 ms (±89.9) | 2890 ms (±23.6) | 3784 ms (±86.3) | 549 ms (±28.7) | 0.26 × (0.24–0.28) **Infinite** | 0.19 × (0.17–0.20) **Infinite** | 0.14 × (0.13–0.15) **Infinite** |
| Descending: click to sorted rows painted (lower is better) | 2957 ms (±51.1) | 2923 ms (±166) | 3592 ms (±74.1) | 559 ms (±19.8) | 0.19 × (0.18–0.20) **Infinite** | 0.19 × (0.17–0.20) **Infinite** | 0.16 × (0.15–0.16) **Infinite** |
| Descending: click to settled (lower is better) | 2957 ms (±51.1) | 2923 ms (±166) | 3592 ms (±74.1) | 559 ms (±19.8) | 0.19 × (0.18–0.20) **Infinite** | 0.19 × (0.17–0.20) **Infinite** | 0.16 × (0.15–0.16) **Infinite** |
| Ascending: main thread scripting (lower is better) | 2081 ms (±89.9) | 2874 ms (±22.1) | 3776 ms (±86.1) | 517 ms (±26.3) | 0.25 × (0.23–0.26) **Infinite** | 0.18 × (0.17–0.19) **Infinite** | 0.14 × (0.13–0.15) **Infinite** |
| Descending: main thread scripting (lower is better) | 2947 ms (±50.5) | 2910 ms (±173) | 3583 ms (±74.0) | 544 ms (±19.8) | 0.18 × (0.17–0.19) **Infinite** | 0.19 × (0.17–0.19) **Infinite** | 0.15 × (0.14–0.16) **Infinite** |

## scroll-jump - 1,000,000 rows

Programmatic jumps to 10 far-away scroll positions (like dragging the scrollbar thumb). Measured from setting scrollTop to the end of the first frame committed with the first and last visible rows showing the right content, at the right position.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Jump to rows painted (median of jumps) (lower is better) | 22.3 ms (±0.35) | 33.3 ms (±0.41) | 12.0 ms (±0.22) | 33.7 ms (±0.45) | 1.51 × (1.47–1.55) **MUI X** | 1.01 × (0.99–1.04) ≈ | 2.80 × (2.75–2.90) **TanStack** |
| Jump to rows painted (worst jump) (lower is better) | 45.1 ms (±1.53) | 63.7 ms (±2.95) | 33.8 ms (±1.27) | 47.9 ms (±1.86) | 1.06 × (1.02–1.13) **MUI X** | 0.75 × (0.70–0.80) **Infinite** | 1.41 × (1.35–1.51) **TanStack** |
| Jump to settled (median of jumps) (lower is better) | 22.3 ms (±0.35) | 33.3 ms (±0.41) | 12.0 ms (±0.22) | 33.7 ms (±0.45) | 1.51 × (1.47–1.55) **MUI X** | 1.01 × (0.99–1.04) ≈ | 2.80 × (2.75–2.90) **TanStack** |
| Main thread scripting (all jumps) (lower is better) | 157 ms (±3.84) | 222 ms (±6.60) | 79.5 ms (±5.27) | 203 ms (±3.74) | 1.29 × (1.27–1.36) **MUI X** | 0.91 × (0.88–0.96) **Infinite** | 2.55 × (2.25–2.64) **TanStack** |

## scroll-vertical - 1,000,000 rows

Wheel-scroll down 24000px at 8000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 50.3 % (±0.12) | 49.7 % (±0.15) | 50.3 % (±0.27) | 62.3 % (±0.79) | 1.24 × (1.23–1.27) **Infinite** | 1.25 × (1.24–1.28) **Infinite** | 1.24 × (1.23–1.27) **Infinite** |
| Frames presented without main-thread update (lower is better) | 49.4 % (±0.12) | 48.9 % (±0.16) | 49.5 % (±0.27) | 37.7 % (±0.79) | 0.76 × (0.73–0.77) **Infinite** | 0.77 × (0.74–0.78) **Infinite** | 0.76 × (0.73–0.77) **Infinite** |
| Frames dropped (lower is better) | 0.28 % (±0.25) | 1.40 % (±0.31) | 0.27 % (±0.54) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.29) | 58.7 fps (±0.35) | 60.0 fps (±0.63) | 56.8 fps (±0.60) | 0.95 × (0.94–0.96) **MUI X** | 0.97 × (0.96–0.98) **AG Grid** | 0.95 × (0.94–0.97) **TanStack** |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.05) | 16.8 ms (±0.04) | 16.7 ms (±0.04) | 16.8 ms (±0.00) | 1.01 × (1.00–1.01) ≈ | 1.00 × (1.00–1.01) ≈ | 1.01 × (1.00–1.01) **TanStack** |
| Worst rAF frame interval (lower is better) | 16.8 ms (±9.09) | 33.4 ms (±7.42) | 16.8 ms (±32.4) | 117 ms (±21.7) | 6.94 × (2.99–6.94) **MUI X** | 3.49 × (2.00–3.49) **AG Grid** | 6.94 × (1.20–6.94) **TanStack** |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.49) | 2.20 % (±0.40) | 0.00 % (±0.30) | 1.70 % (±0.53) | +1.70 (+0.62 to +2.87) **MUI X** | 0.78 × (0.61–1.31) ≈ | +1.70 (+1.16 to +2.87) **TanStack** |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 608 ms (±53.1) | 778 ms (±43.1) | 352 ms (±18.3) | 753 ms (±30.3) | 1.24 × (1.11–1.38) **MUI X** | 0.97 × (0.84–1.00) ≈ | 2.14 × (1.95–2.25) **TanStack** |
| Main thread: layout (lower is better) | 61.4 ms (±4.71) | 105 ms (±14.1) | 81.8 ms (±3.43) | 94.2 ms (±3.68) | 1.53 × (1.32–1.58) **MUI X** | 0.89 × (0.72–0.99) **Infinite** | 1.15 × (1.06–1.22) **TanStack** |
| Main thread: style recalc (lower is better) | 89.4 ms (±4.90) | 414 ms (±9.61) | 44.6 ms (±6.33) | 250 ms (±11.3) | 2.79 × (2.51–2.89) **MUI X** | 0.60 × (0.55–0.62) **Infinite** | 5.60 × (4.36–6.02) **TanStack** |
| Main thread: all tasks (lower is better) | 1451 ms (±90.9) | 1881 ms (±94.0) | 947 ms (±30.3) | 1660 ms (±56.6) | 1.14 × (1.02–1.21) **MUI X** | 0.88 × (0.77–0.90) **Infinite** | 1.75 × (1.64–1.87) **TanStack** |

## scroll-horizontal - 1,000,000 rows

Wheel-scroll right/left over all columns, 4 sweeps at 4000px/s (Input.synthesizeScrollGesture - real input pipeline, same gesture for every grid). Frame outcomes come from Chrome's compositor (PipelineReporter): "partial" = frame shown without the main thread's update, "dropped" = no new frame. rAF frame intervals and Long Animation Frames come from the page.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frames fully presented (higher is better) | 65.7 % (±1.86) | 100 % (±10.8) | 80.3 % (±0.00) | 89.0 % (±3.78) | 1.35 × (1.32–1.48) **Infinite** | 0.89 × (0.89–1.18) ≈ | 1.11 × (1.11–1.19) **Infinite** |
| Frames presented without main-thread update (lower is better) | 32.6 % (±1.67) | 0.00 % (±10.2) | 19.0 % (±0.00) | 11.0 % (±3.78) | 0.34 × (0.12–0.35) **Infinite** | +11.0 (-12.2 to +11.2) ≈ | 0.58 × (0.22–0.59) **Infinite** |
| Frames dropped (lower is better) | 1.62 % (±0.27) | 0.00 % (±0.81) | 0.70 % (±0.00) | 0.00 % (±0.00) | 0.00 × (0.00–0.00) **Infinite** | 0.00 (-1.59 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** |
| Main thread frame rate (rAF) (higher is better) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 60.0 fps (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| p95 rAF frame interval (lower is better) | 16.7 ms (±0.00) | 16.7 ms (±0.00) | 16.7 ms (±0.04) | 16.8 ms (±0.05) | 1.01 × (1.00–1.01) **MUI X** | 1.01 × (1.00–1.01) ≈ | 1.01 × (1.00–1.01) ≈ |
| Worst rAF frame interval (lower is better) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 16.8 ms (±0.00) | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ | 1.00 × (1.00–1.00) ≈ |
| rAF intervals > 25ms (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Long animation frames: total blocking (lower is better) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ | 0.00 (0.00 to 0.00) ≈ |
| Main thread: scripting (lower is better) | 336 ms (±15.5) | 238 ms (±6.73) | 150 ms (±2.86) | 161 ms (±6.33) | 0.48 × (0.43–0.49) **Infinite** | 0.68 × (0.63–0.71) **Infinite** | 1.07 × (1.00–1.12) ≈ |
| Main thread: layout (lower is better) | 44.6 ms (±1.99) | 64.7 ms (±3.97) | 46.5 ms (±1.55) | 11.4 ms (±0.42) | 0.26 × (0.23–0.28) **Infinite** | 0.18 × (0.16–0.19) **Infinite** | 0.24 × (0.24–0.27) **Infinite** |
| Main thread: style recalc (lower is better) | 23.1 ms (±1.24) | 42.5 ms (±0.42) | 13.3 ms (±0.26) | 46.6 ms (±2.80) | 2.02 × (1.82–2.21) **MUI X** | 1.10 × (1.05–1.20) **AG Grid** | 3.50 × (3.35–3.84) **TanStack** |
| Main thread: all tasks (lower is better) | 719 ms (±27.9) | 563 ms (±18.9) | 392 ms (±6.83) | 475 ms (±20.7) | 0.66 × (0.61–0.72) **Infinite** | 0.84 × (0.81–0.93) **Infinite** | 1.21 × (1.18–1.31) **TanStack** |

## correctness-vertical - 1,000,000 rows

Same kind of vertical wheel gesture, faster (20000px/s). After every painted frame, samples points across the body and checks the cell there is the one that should be there for the current scroll position: "blank" = no cell, "wrong" = a cell for another row/column (stale content, or position lagging behind the scroll). This is the main thread's view of the frame; it reads layout, so it is never combined with the timing passes.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Blank samples (lower is better) | 0.00 % (±0.00) | 2.00 % (±0.63) | 2.03 % (±0.49) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Wrong/stale samples (lower is better) | 0.00 % (±0.00) | 0.00 % (±0.00) | 0.00 % (±0.00) | 74.8 % (±1.79) | +74.8 (+74.0 to +78.0) **MUI X** | +74.8 (+74.0 to +78.0) **AG Grid** | +74.8 (+74.0 to +78.0) **TanStack** |
| Frames with any blank/wrong sample (lower is better) | 0.00 % (±0.00) | 10.0 % (±3.15) | 10.1 % (±2.43) | 82.9 % (±0.97) | +82.9 (+82.1 to +84.6) **MUI X** | 8.29 × (5.06–10.3) **AG Grid** | 8.19 × (5.46–9.36) **TanStack** |
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
| Captured frames with blank rows (lower is better) | 0.00 % (±0.00) | 50.0 % (±6.23) | 11.7 % (±2.81) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Blank body area (avg over frames) (lower is better) | 0.00 % (±0.00) | 18.9 % (±2.79) | 4.04 % (±0.69) | 0.00 % (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Worst frame: blank rows (lower is better) | 0.00 rows (±0.00) | 18.0 rows (±0.00) | 12.0 rows (±2.24) | 0.00 rows (±0.00) | 0.00 (0.00 to 0.00) ≈ | 0.00 × (0.00–0.00) **Infinite** | 0.00 × (0.00–0.00) **Infinite** |
| Captured frames (higher is better) | 63.0 (±1.92) | 40.0 (±2.35) | 63.0 (±2.88) | 65.0 (±2.68) | 1.03 × (0.98–1.11) ≈ | 1.63 × (1.57–1.86) **Infinite** | 1.03 × (0.98–1.15) ≈ |

## updates-low - 1,000,000 rows

Live updates, low frequency. The grid shows the rows in the order of the data. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 464 ms (±15.1) | 105 ms (±4.50) | 467 ms (±14.7) | 292 ms (±14.6) | 0.63 × (0.61–0.70) **Infinite** | 2.78 × (2.54–3.03) **AG Grid** | 0.63 × (0.59–0.69) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 683 ms (±69.6) | 125 ms (±4.59) | 728 ms (±6.01) | 396 ms (±22.4) | 0.58 × (0.52–0.69) **Infinite** | 3.18 × (2.99–3.49) **AG Grid** | 0.54 × (0.52–0.60) **Infinite** |
| Update to settled (median of updates) (lower is better) | 464 ms (±15.1) | 105 ms (±4.50) | 467 ms (±14.7) | 292 ms (±14.6) | 0.63 × (0.61–0.70) **Infinite** | 2.78 × (2.54–3.03) **AG Grid** | 0.63 × (0.59–0.69) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 3.14 ms (±0.19) | 3.13 ms (±0.19) | 4.20 ms (±0.30) | 2.69 ms (±0.26) | 0.86 × (0.73–0.96) **Infinite** | 0.86 × (0.73–0.96) **Infinite** | 0.64 × (0.55–0.71) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 1.89 ms (±0.07) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.23 ms (±0.05) | 0.12 × (0.11–0.17) **Infinite** | +0.23 (+0.21 to +0.32) **AG Grid** | +0.23 (+0.21 to +0.32) **TanStack** |
| Main thread: all tasks (all updates) (lower is better) | 2675 ms (±56.9) | 687 ms (±22.7) | 2619 ms (±54.9) | 1561 ms (±84.2) | 0.58 × (0.57–0.65) **Infinite** | 2.27 × (2.13–2.50) **AG Grid** | 0.60 × (0.57–0.65) **Infinite** |

## updates-low-sorted - 1,000,000 rows

Live updates, low frequency. The grid shows sorted by salary, highest first - the updates change the salaries, so rows move. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 2247 ms (±48.7) | 3747 ms (±79.6) | 4504 ms (±108) | 484 ms (±16.6) | 0.22 × (0.21–0.23) **Infinite** | 0.13 × (0.12–0.14) **Infinite** | 0.11 × (0.10–0.11) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 2575 ms (±101) | 3824 ms (±113) | 4781 ms (±323) | 590 ms (±38.4) | 0.23 × (0.21–0.25) **Infinite** | 0.15 × (0.14–0.17) **Infinite** | 0.12 × (0.11–0.14) **Infinite** |
| Update to settled (median of updates) (lower is better) | 2247 ms (±48.7) | 3747 ms (±79.6) | 4504 ms (±108) | 484 ms (±16.6) | 0.22 × (0.21–0.23) **Infinite** | 0.13 × (0.12–0.14) **Infinite** | 0.11 × (0.10–0.11) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 5.35 ms (±0.63) | 4.65 ms (±0.19) | 7.79 ms (±1.30) | 10.4 ms (±0.80) | 1.95 × (1.56–2.22) **MUI X** | 2.24 × (2.11–2.55) **AG Grid** | 1.34 × (0.98–1.52) ≈ |
| Main thread: style recalc (all updates) (lower is better) | 13.2 ms (±1.96) | 14.5 ms (±0.35) | 5.94 ms (±0.28) | 0.26 ms (±0.02) | 0.02 × (0.02–0.02) **Infinite** | 0.02 × (0.02–0.02) **Infinite** | 0.04 × (0.04–0.05) **Infinite** |
| Main thread: all tasks (all updates) (lower is better) | 11501 ms (±305) | 18785 ms (±492) | 23138 ms (±1059) | 2511 ms (±63.8) | 0.22 × (0.21–0.23) **Infinite** | 0.13 × (0.13–0.14) **Infinite** | 0.11 × (0.10–0.11) **Infinite** |

## updates-low-filtered - 1,000,000 rows

Live updates, low frequency. The grid shows filtered to a salary of at least 115,000 (about half of the rows) - the updates change the salaries, so rows go in and out of the filter. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 683 ms (±16.4) | 322 ms (±6.17) | 1696 ms (±67.7) | 286 ms (±12.2) | 0.42 × (0.39–0.44) **Infinite** | 0.89 × (0.82–0.92) **Infinite** | 0.17 × (0.16–0.17) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 825 ms (±33.8) | 363 ms (±7.02) | 2166 ms (±84.3) | 377 ms (±10.2) | 0.46 × (0.42–0.47) **Infinite** | 1.04 × (0.99–1.06) ≈ | 0.17 × (0.16–0.18) **Infinite** |
| Update to settled (median of updates) (lower is better) | 683 ms (±16.4) | 322 ms (±6.17) | 1696 ms (±67.7) | 287 ms (±12.3) | 0.42 × (0.39–0.44) **Infinite** | 0.89 × (0.83–0.93) **Infinite** | 0.17 × (0.16–0.18) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 4.21 ms (±0.08) | 5.08 ms (±0.30) | 3.94 ms (±0.23) | 4.44 ms (±0.40) | 1.05 × (1.00–1.22) **MUI X** | 0.87 × (0.80–1.02) ≈ | 1.13 × (1.01–1.31) **TanStack** |
| Main thread: style recalc (all updates) (lower is better) | 3.59 ms (±0.04) | 2.00 ms (±0.45) | 1.28 ms (±0.05) | 0.45 ms (±0.02) | 0.12 × (0.12–0.13) **Infinite** | 0.22 × (0.15–0.24) **Infinite** | 0.35 × (0.32–0.37) **Infinite** |
| Main thread: all tasks (all updates) (lower is better) | 3554 ms (±68.2) | 1777 ms (±28.4) | 8521 ms (±79.8) | 1514 ms (±60.2) | 0.43 × (0.40–0.45) **Infinite** | 0.85 × (0.79–0.89) **Infinite** | 0.18 × (0.17–0.19) **Infinite** |

## updates-low-grouped - 1,000,000 rows

Live updates, low frequency. The grid shows grouped by department (10 collapsed groups), with the sum of the salaries of each group - the updates change the salaries, so the sums change. 5 updates of 1,000 random rows each, one at a time: each update is sent 500 ms after the previous one is painted. An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. Measured from sending the update to the end of the first frame committed with the viewport showing it (the right rows, with the new values, in the right order).

| Metric | TanStack median (sd) | Infinite median (sd) | Infinite vs TanStack |
|---|---:|---:|---:|
| Update to rows painted (median of updates) (lower is better) | 1804 ms (±53.9) | 941 ms (±32.8) | 0.52 × (0.51–0.56) **Infinite** |
| Update to rows painted (worst update) (lower is better) | 2690 ms (±400) | 1113 ms (±36.4) | 0.41 × (0.33–0.45) **Infinite** |
| Update to settled (median of updates) (lower is better) | 1804 ms (±53.9) | 941 ms (±32.8) | 0.52 × (0.51–0.56) **Infinite** |
| Main thread: layout (all updates) (lower is better) | 2.08 ms (±0.14) | 1.41 ms (±0.11) | 0.68 × (0.56–0.71) **Infinite** |
| Main thread: style recalc (all updates) (lower is better) | 0.00 ms (±0.00) | 0.38 ms (±2.29) | +0.38 (+0.32 to +5.49) **TanStack** |
| Main thread: all tasks (all updates) (lower is better) | 9928 ms (±815) | 4865 ms (±363) | 0.49 × (0.43–0.57) **Infinite** |

## updates-high - 1,000,000 rows

Live updates, high frequency. The grid shows the rows in the order of the data. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 977 ms (±65.5) | 132 ms (±25.3) | 768 ms (±24.8) | 330 ms (±79.0) | 0.34 × (0.27–0.49) **Infinite** | 2.50 × (2.00–3.64) **AG Grid** | 0.43 × (0.35–0.62) **Infinite** |
| Update delay, p95 (lower is better) | 544 ms (±14.5) | 95.9 ms (±6.38) | 658 ms (±12.2) | 319 ms (±28.7) | 0.59 × (0.52–0.66) **Infinite** | 3.32 × (2.94–3.78) **AG Grid** | 0.48 × (0.43–0.55) **Infinite** |
| Frames committed per second (higher is better) | 3.03 fps (±0.10) | 10.0 fps (±0.66) | 1.90 fps (±0.01) | 5.80 fps (±0.44) | 1.92 × (1.66–2.01) **Infinite** | 0.58 × (0.50–0.64) **AG Grid** | 3.06 × (2.66–3.20) **Infinite** |
| Gap between frames, p95 (lower is better) | 611 ms (±11.0) | 129 ms (±12.2) | 768 ms (±9.88) | 374 ms (±28.3) | 0.61 × (0.60–0.71) **Infinite** | 2.91 × (2.65–3.59) **AG Grid** | 0.49 × (0.47–0.56) **Infinite** |
| Longest gap between frames (lower is better) | 617 ms (±15.3) | 203 ms (±9.49) | 798 ms (±10.7) | 465 ms (±37.5) | 0.75 × (0.65–0.81) **Infinite** | 2.29 × (1.97–2.55) **AG Grid** | 0.58 × (0.50–0.62) **Infinite** |
| Long tasks: total blocking time (lower is better) | 4277 ms (±62.3) | 1767 ms (±142) | 4272 ms (±25.1) | 3483 ms (±87.1) | 0.81 × (0.80–0.85) **Infinite** | 1.97 × (1.80–2.20) **AG Grid** | 0.82 × (0.81–0.86) **Infinite** |
| Main thread: layout (lower is better) | 2.77 ms (±0.32) | 25.8 ms (±3.37) | 6.54 ms (±0.16) | 6.36 ms (±0.26) | 2.30 × (1.81–2.31) **MUI X** | 0.25 × (0.20–0.29) **Infinite** | 0.97 × (0.90–1.02) ≈ |
| Main thread: style recalc (lower is better) | 1.85 ms (±0.11) | 0.00 ms (±0.00) | 0.00 ms (±0.00) | 0.29 ms (±0.03) | 0.16 × (0.14–0.18) **Infinite** | +0.29 (+0.28 to +0.34) **AG Grid** | +0.29 (+0.28 to +0.34) **TanStack** |
| Main thread: all tasks (lower is better) | 4958 ms (±65.5) | 4077 ms (±23.5) | 4749 ms (±29.5) | 4317 ms (±80.0) | 0.87 × (0.86–0.90) **Infinite** | 1.06 × (1.04–1.09) **AG Grid** | 0.91 × (0.89–0.94) **Infinite** |

## updates-high-sorted - 1,000,000 rows

Live updates, high frequency. The grid shows sorted by salary, highest first - the updates change the salaries, so rows move. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 2744 ms (±35.1) | 7546 ms (±258) | 5200 ms (±62.8) | 625 ms (±105) | 0.23 × (0.21–0.30) **Infinite** | 0.08 × (0.07–0.11) **Infinite** | 0.12 × (0.11–0.16) **Infinite** |
| Update delay, p95 (lower is better) | 2223 ms (±30.6) | 3845 ms (±98.9) | 4643 ms (±103) | 555 ms (±38.8) | 0.25 × (0.22–0.26) **Infinite** | 0.14 × (0.13–0.15) **Infinite** | 0.12 × (0.10–0.13) **Infinite** |
| Frames committed per second (higher is better) | 0.59 fps (±0.00) | 0.26 fps (±0.01) | 0.22 fps (±0.00) | 3.04 fps (±0.10) | 5.11 × (4.79–5.24) **Infinite** | 11.7 × (10.9–12.2) **Infinite** | 14.0 × (13.1–14.3) **Infinite** |
| Gap between frames, p95 (lower is better) | 2418 ms (±23.8) | 7136 ms (±139) | 4841 ms (±95.8) | 662 ms (±37.0) | 0.27 × (0.24–0.28) **Infinite** | 0.09 × (0.08–0.09) **Infinite** | 0.14 × (0.12–0.14) **Infinite** |
| Longest gap between frames (lower is better) | 2447 ms (±29.2) | 7502 ms (±144) | 4869 ms (±103) | 678 ms (±43.5) | 0.28 × (0.26–0.31) **Infinite** | 0.09 × (0.08–0.10) **Infinite** | 0.14 × (0.13–0.16) **Infinite** |
| Long tasks: total blocking time (lower is better) | 6450 ms (±34.6) | 11133 ms (±253) | 9064 ms (±62.4) | 4069 ms (±82.8) | 0.63 × (0.62–0.65) **Infinite** | 0.37 × (0.35–0.38) **Infinite** | 0.45 × (0.44–0.47) **Infinite** |
| Main thread: layout (lower is better) | 3.07 ms (±0.05) | 3.38 ms (±0.11) | 3.91 ms (±0.38) | 16.3 ms (±0.47) | 5.29 × (5.03–5.43) **MUI X** | 4.80 × (4.56–5.04) **AG Grid** | 4.16 × (3.50–4.42) **TanStack** |
| Main thread: style recalc (lower is better) | 5.74 ms (±0.80) | 10.5 ms (±0.67) | 2.56 ms (±0.30) | 0.25 ms (±0.03) | 0.04 × (0.03–0.05) **Infinite** | 0.02 × (0.02–0.03) **Infinite** | 0.10 × (0.08–0.12) **Infinite** |
| Main thread: all tasks (lower is better) | 6725 ms (±35.1) | 11524 ms (±255) | 9182 ms (±62.8) | 4606 ms (±107) | 0.68 × (0.68–0.72) **Infinite** | 0.40 × (0.38–0.42) **Infinite** | 0.50 × (0.49–0.52) **Infinite** |

## updates-high-filtered - 1,000,000 rows

Live updates, high frequency. The grid shows filtered to a salary of at least 115,000 (about half of the rows) - the updates change the salaries, so rows go in and out of the filter. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | MUI X median (sd) | AG Grid median (sd) | TanStack median (sd) | Infinite median (sd) | Infinite vs MUI X | Infinite vs AG Grid | Infinite vs TanStack |
|---|---:|---:|---:|---:|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 772 ms (±43.6) | 431 ms (±87.6) | 2290 ms (±46.0) | 305 ms (±84.5) | 0.40 × (0.34–0.57) **Infinite** | 0.71 × (0.53–1.08) ≈ | 0.13 × (0.11–0.19) **Infinite** |
| Update delay, p95 (lower is better) | 668 ms (±3.31) | 321 ms (±5.97) | 1830 ms (±44.1) | 253 ms (±15.7) | 0.38 × (0.36–0.42) **Infinite** | 0.79 × (0.76–0.87) **Infinite** | 0.14 × (0.13–0.15) **Infinite** |
| Frames committed per second (higher is better) | 2.10 fps (±0.02) | 2.96 fps (±0.05) | 0.64 fps (±0.00) | 6.55 fps (±0.27) | 3.11 × (3.00–3.33) **Infinite** | 2.21 × (2.10–2.37) **Infinite** | 10.3 × (9.89–11.0) **Infinite** |
| Gap between frames, p95 (lower is better) | 732 ms (±3.69) | 501 ms (±11.1) | 1994 ms (±35.5) | 314 ms (±20.1) | 0.43 × (0.41–0.48) **Infinite** | 0.63 × (0.59–0.70) **Infinite** | 0.16 × (0.15–0.17) **Infinite** |
| Longest gap between frames (lower is better) | 733 ms (±7.34) | 742 ms (±28.5) | 2038 ms (±41.5) | 389 ms (±20.5) | 0.53 × (0.50–0.57) **Infinite** | 0.52 × (0.48–0.56) **Infinite** | 0.19 × (0.18–0.20) **Infinite** |
| Long tasks: total blocking time (lower is better) | 4259 ms (±45.2) | 3521 ms (±68.0) | 6053 ms (±46.2) | 3376 ms (±57.0) | 0.79 × (0.77–0.81) **Infinite** | 0.96 × (0.93–0.99) **Infinite** | 0.56 × (0.55–0.57) **Infinite** |
| Main thread: layout (lower is better) | 4.72 ms (±0.18) | 8.62 ms (±4.09) | 3.38 ms (±0.19) | 10.5 ms (±0.39) | 2.22 × (2.08–2.36) **MUI X** | 1.22 × (0.59–1.29) ≈ | 3.10 × (2.99–3.52) **TanStack** |
| Main thread: style recalc (lower is better) | 3.80 ms (±0.13) | 2.84 ms (±0.13) | 1.10 ms (±0.18) | 0.85 ms (±0.07) | 0.22 × (0.20–0.24) **Infinite** | 0.30 × (0.27–0.34) **Infinite** | 0.78 × (0.56–0.85) **Infinite** |
| Main thread: all tasks (lower is better) | 5040 ms (±191) | 4382 ms (±86.9) | 6275 ms (±46.2) | 4288 ms (±83.8) | 0.85 × (0.84–0.93) **Infinite** | 0.98 × (0.95–1.01) ≈ | 0.68 × (0.68–0.71) **Infinite** |

## updates-high-grouped - 1,000,000 rows

Live updates, high frequency. The grid shows grouped by department (10 collapsed groups), with the sum of the salaries of each group - the updates change the salaries, so the sums change. A feed of 50 updates a second, of 100 random rows each, for 4 s (200 updates). An update changes salary, bonus, hours, score (by up to ±1%) in new copies of the rows: random rows, plus all the rows in the viewport, so that every update changes what is on screen. Every grid gets the same updates, through the API it documents for changing rows. The page hands the grid the updates once per animation frame: all the ones that arrived since the previous frame, as one update - so a grid that keeps the main thread busy gets them later, and more at once. "Lag at the end" = from the arrival of the last update to the end of the first frame committed with the viewport showing it. "Update delay" = from the arrival of an update to the frame that hands it to the grid. Frames, gaps and blocking time come from the trace, from the first update until the last one is painted: the frames the main thread committed, and the part over 50 ms of every task.

| Metric | TanStack median (sd) | Infinite median (sd) | Infinite vs TanStack |
|---|---:|---:|---:|
| Lag at the end: last update to painted (lower is better) | 3307 ms (±104) | 2189 ms (±536) | 0.66 × (0.30–0.68) **Infinite** |
| Update delay, p95 (lower is better) | 1884 ms (±66.7) | 931 ms (±22.1) | 0.49 × (0.47–0.52) **Infinite** |
| Frames committed per second (higher is better) | 0.55 fps (±0.01) | 1.44 fps (±0.12) | 2.63 × (2.35–2.95) **Infinite** |
| Gap between frames, p95 (lower is better) | 2054 ms (±59.8) | 1227 ms (±76.5) | 0.60 × (0.53–0.63) **Infinite** |
| Longest gap between frames (lower is better) | 2105 ms (±66.7) | 1296 ms (±84.4) | 0.62 × (0.55–0.65) **Infinite** |
| Long tasks: total blocking time (lower is better) | 7077 ms (±104) | 5833 ms (±511) | 0.82 × (0.66–0.83) **Infinite** |
| Main thread: layout (lower is better) | 1.50 ms (±0.03) | 1.46 ms (±0.15) | 0.97 × (0.82–1.11) ≈ |
| Main thread: style recalc (lower is better) | 0.00 ms (±0.00) | 0.21 ms (±0.05) | +0.21 (+0.16 to +0.29) **TanStack** |
| Main thread: all tasks (lower is better) | 8029 ms (±474) | 6171 ms (±533) | 0.77 × (0.62–0.86) **Infinite** |
