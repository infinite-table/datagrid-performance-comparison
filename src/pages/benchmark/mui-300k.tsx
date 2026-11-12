// MUI X Data Grid (community), 300,000 rows
import { MuiBenchmark } from '../../benchmark/MuiBenchmark';
import { BENCH_SIZES } from '../../benchmark/data';

export default function Page() {
  return <MuiBenchmark rowCount={BENCH_SIZES['300k']} />;
}
