// MUI X Data Grid (community), 1,000,000 rows
import { MuiBenchmark } from '../../benchmark/MuiBenchmark';
import { BENCH_SIZES } from '../../benchmark/data';

export default function Page() {
  return <MuiBenchmark rowCount={BENCH_SIZES['1m']} />;
}
