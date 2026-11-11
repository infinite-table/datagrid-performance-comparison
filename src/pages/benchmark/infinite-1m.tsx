// Infinite Table, 1,000,000 rows
// the stylesheet is imported here and not in _app, so the AG Grid pages
// don't load it
import '@infinite-table/infinite-react/index.css';

import { InfiniteBenchmark } from '../../benchmark/InfiniteBenchmark';
import { BENCH_SIZES } from '../../benchmark/data';

export default function Page() {
  return <InfiniteBenchmark rowCount={BENCH_SIZES['1m']} />;
}
