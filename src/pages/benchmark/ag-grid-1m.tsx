// AG Grid, 1,000,000 rows
import { AgGridBenchmark } from '../../benchmark/AgGridBenchmark';
import { BENCH_SIZES } from '../../benchmark/data';

export default function Page() {
  return <AgGridBenchmark rowCount={BENCH_SIZES['1m']} />;
}
