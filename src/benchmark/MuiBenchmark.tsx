import * as React from 'react';

import { DataGrid, GridColDef, GridInitialState } from '@mui/x-data-grid';

import {
  BENCH_COLUMNS,
  BENCH_COLUMN_WIDTH,
  BENCH_HEADER_HEIGHT,
  BENCH_ROW_HEIGHT,
  BenchRow,
} from './data';
import { BenchAdapter } from './harness';
import { BenchGridProps, BenchmarkPage } from './BenchmarkPage';
import {
  BENCH_FILTER_FIELD,
  BENCH_FILTER_MIN,
  BENCH_SORT_DIR,
  BENCH_SORT_FIELD,
  BenchView,
  applyBenchUpdates,
} from './updates';

declare const __MUI_X_DATA_GRID_VERSION__: string;

// number columns show the value as it is, like the other grids - by default
// MUI formats them for the locale ("100,000.13")
const rawValue = (value: unknown) => String(value);

const columns: GridColDef<BenchRow>[] = BENCH_COLUMNS.map((c) => ({
  field: c.field,
  headerName: c.header,
  width: BENCH_COLUMN_WIDTH,
  ...(c.type === 'number'
    ? { type: 'number' as const, valueFormatter: rawValue }
    : null),
}));

const root = () =>
  document.querySelector<HTMLElement>(
    '[data-benchmark-grid="mui"] .MuiDataGrid-root',
  );

const scroller = () =>
  root()?.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller') ?? null;

const CELL = '.MuiDataGrid-cell[data-field]';

const adapter: BenchAdapter = {
  grid: 'mui',
  version: __MUI_X_DATA_GRID_VERSION__,
  getRoot: root,
  getVerticalScroller: scroller,
  getHorizontalScroller: scroller,
  getBodyRect: () => {
    const el = scroller();
    const header = root()?.querySelector<HTMLElement>(
      '.MuiDataGrid-columnHeaders',
    );
    if (!el || !header) {
      return null;
    }
    const rect = el.getBoundingClientRect();
    const top = header.getBoundingClientRect().bottom;
    // the scrollbars are separate elements, laid over the scroller
    const horizontal = root()?.querySelector<HTMLElement>(
      '.MuiDataGrid-scrollbar--horizontal',
    );
    const vertical = root()?.querySelector<HTMLElement>(
      '.MuiDataGrid-scrollbar--vertical',
    );
    return {
      left: rect.left + el.clientLeft,
      top,
      width: el.clientWidth - (vertical?.offsetWidth ?? 0),
      height:
        rect.top +
        el.clientTop +
        el.clientHeight -
        (horizontal?.offsetHeight ?? 0) -
        top,
    };
  },
  getRenderedColumnCells: (field) =>
    Array.from(
      scroller()?.querySelectorAll<HTMLElement>(
        `.MuiDataGrid-row .MuiDataGrid-cell[data-field="${field}"]`,
      ) ?? [],
    ),
  getRenderedRowCells: (rowIndex) =>
    Array.from(
      scroller()?.querySelectorAll<HTMLElement>(
        `.MuiDataGrid-row[data-rowindex="${rowIndex}"] ${CELL}`,
      ) ?? [],
    ),
  getCellRowIndex: (cell) =>
    Number(
      cell.closest('.MuiDataGrid-row')?.getAttribute('data-rowindex') ?? -1,
    ),
  getCellColumnId: (cell) => cell.getAttribute('data-field') ?? '',
  getCell: (rowIndex, field) =>
    scroller()?.querySelector<HTMLElement>(
      `.MuiDataGrid-row[data-rowindex="${rowIndex}"] .MuiDataGrid-cell[data-field="${field}"]`,
    ) ?? null,
  getHeaderCell: (field) =>
    root()?.querySelector<HTMLElement>(
      `.MuiDataGrid-columnHeader[data-field="${field}"]`,
    ) ?? null,
};

// The free DataGrid always paginates, with 100 rows on a page by default.
// A page size of -1 is its documented "all results" value: every row is on
// one page, which is scrolled through like in the other grids.
const pagination = { paginationModel: { page: 0, pageSize: -1 } };

// the views of the live-update scenarios - see updates.ts. The free
// DataGrid has no row grouping or aggregation (they are in the paid
// versions): it has no `grouped` view
const initialStates: Partial<Record<BenchView, GridInitialState>> = {
  plain: { pagination },
  sorted: {
    pagination,
    sorting: {
      sortModel: [
        { field: BENCH_SORT_FIELD, sort: BENCH_SORT_DIR === -1 ? 'desc' : 'asc' },
      ],
    },
  },
  filtered: {
    pagination,
    filter: {
      filterModel: {
        items: [
          { field: BENCH_FILTER_FIELD, operator: '>=', value: BENCH_FILTER_MIN },
        ],
      },
    },
  },
};

const style: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
};

/**
 * MUI X Data Grid (the free, MIT-licensed `DataGrid`) with defaults, except
 * for what makes the setup match the other grids:
 *  - same row height / header height / column widths
 *  - all the rows on one page (see `initialState` above)
 *  - the number formatting turned off
 *
 * Rows are changed through the `rows` prop: a new array, with the changed
 * rows in it. The free DataGrid's `apiRef.current.updateRows` takes one row
 * at a time (more is in the paid versions).
 */
function Mui({ data, view, onUpdater }: BenchGridProps) {
  if (view === 'grouped') {
    throw new Error('The free MUI X DataGrid has no row grouping');
  }
  const [rows, setRows] = React.useState(data);
  React.useEffect(() => {
    onUpdater((changed) => {
      setRows((rows) => applyBenchUpdates(rows, changed));
    });
  }, [onUpdater]);
  return (
    <div style={style}>
      <DataGrid<BenchRow>
        rows={rows}
        columns={columns}
        rowHeight={BENCH_ROW_HEIGHT}
        columnHeaderHeight={BENCH_HEADER_HEIGHT}
        initialState={initialStates[view]}
      />
    </div>
  );
}

export function MuiBenchmark({ rowCount }: { rowCount: number }) {
  return (
    <BenchmarkPage
      title={`MUI X Data Grid ${__MUI_X_DATA_GRID_VERSION__}`}
      rowCount={rowCount}
      adapter={adapter}
      renderGrid={(props) => <Mui {...props} />}
    />
  );
}
