import * as React from 'react';

import '../global.css';

// Kept minimal on purpose: nothing is rendered next to the grids, and
// neither grid is imported here - each page loads only its own grid.
export default function BenchmarkApp({ Component, pageProps }: any) {
  return <Component {...pageProps} />;
}
