import Link from 'next/link';

import { BENCH_SIZES, BenchSize } from '../benchmark/data';

// defined in next.config.js - the installed versions
declare const __AG_GRID_VERSION__: string;
declare const __INFINITE_VERSION__: string;

const GRIDS = [
  { id: 'infinite', name: 'Infinite Table', version: __INFINITE_VERSION__ },
  { id: 'ag-grid', name: 'AG Grid', version: __AG_GRID_VERSION__ },
];

// the pages the benchmark measures - open them to scroll the grids yourself
export default function Index() {
  return (
    <main
      style={{
        padding: 32,
        font: '16px/1.6 system-ui, sans-serif',
        color: '#1b1b1b',
      }}
    >
      <h1 style={{ fontSize: 24 }}>
        Infinite Table vs AG Grid - benchmark pages
      </h1>
      <p>
        Each page renders one grid with the same generated data. The benchmark
        measures exactly these pages - see the README.
      </p>
      <ul>
        {(Object.keys(BENCH_SIZES) as BenchSize[]).flatMap((size) =>
          GRIDS.map((grid) => (
            <li key={`${grid.id}-${size}`}>
              <Link href={`/benchmark/${grid.id}-${size}`}>
                {grid.name} {grid.version} -{' '}
                {BENCH_SIZES[size].toLocaleString('en-US')} rows
              </Link>
            </li>
          )),
        )}
      </ul>
    </main>
  );
}
