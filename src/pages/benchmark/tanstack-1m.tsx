// TanStack Table + TanStack Virtual, 1,000,000 rows
import { TanStackBenchmark } from '../../benchmark/TanStackBenchmark';
import { BENCH_SIZES } from '../../benchmark/data';

export default function Page() {
  return <TanStackBenchmark rowCount={BENCH_SIZES['1m']} />;
}
