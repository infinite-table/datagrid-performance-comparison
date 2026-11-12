import * as React from 'react';

import {
  columnSizingFeature,
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  useTable,
} from '@tanstack/react-table';
import type {
  Cell,
  Header,
  HeaderGroup,
  ReactTable,
  Row,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual';

import {
  BENCH_COLUMNS,
  BENCH_COLUMN_WIDTH,
  BENCH_HEADER_HEIGHT,
  BENCH_ROW_HEIGHT,
  BenchRow,
} from './data';
import { BenchAdapter } from './harness';
import { BenchmarkPage } from './BenchmarkPage';

import styles from './TanStackBenchmark.module.css';

declare const __TANSTACK_TABLE_VERSION__: string;
declare const __TANSTACK_VIRTUAL_VERSION__: string;

/**
 * TanStack Table is headless: it has the row model and the sorting, and the
 * page renders the markup. This page follows the official
 * "virtualized-columns" example (rows and columns virtualized with TanStack
 * Virtual, same overscan), with what the benchmark needs changed:
 *  - fixed row height (no measuring), header height and column widths - the
 *    same as in the other grids
 *  - no column resizing
 *  - sortDescFirst: false - by default the first click on a number column
 *    sorts descending; in the other grids it sorts ascending
 *  - data-row-index / data-column-id on the cells, for the harness
 */
const features = {
  columnSizingFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
};

type Features = typeof features;

const columnHelper = createColumnHelper<Features, BenchRow>();

const columns = columnHelper.columns(
  BENCH_COLUMNS.map((c) =>
    columnHelper.accessor(c.field, {
      header: c.header,
      size: BENCH_COLUMN_WIDTH,
    }),
  ),
);

const getRowId = (row: BenchRow) => String(row.id);

type ColumnVirtualizer = Virtualizer<HTMLDivElement, HTMLTableCellElement>;

type VirtualPadding = {
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
};

function TanStackGrid({ data }: { data: BenchRow[] }) {
  const table = useTable(
    {
      features,
      columns,
      data,
      getRowId,
      sortDescFirst: false,
    },
    (state) => state,
  );

  const leafColumns = table.getAllLeafColumns();

  // the virtualizers need to know the scrollable container element
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const columnVirtualizer = useVirtualizer<
    HTMLDivElement,
    HTMLTableCellElement
  >({
    count: leafColumns.length,
    estimateSize: (index) => leafColumns[index].getSize(),
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 3,
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();

  // columns are virtualized with an empty cell to the left and to the right
  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;

  if (virtualColumns.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
    virtualPaddingRight =
      columnVirtualizer.getTotalSize() -
      (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }

  return (
    <div className={styles.container} ref={tableContainerRef}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableHeadRow
              columnVirtualizer={columnVirtualizer}
              headerGroup={headerGroup}
              key={headerGroup.id}
              virtualPaddingLeft={virtualPaddingLeft}
              virtualPaddingRight={virtualPaddingRight}
              table={table}
            />
          ))}
        </thead>
        <TableBody
          columnVirtualizer={columnVirtualizer}
          table={table}
          tableContainerRef={tableContainerRef}
          virtualPaddingLeft={virtualPaddingLeft}
          virtualPaddingRight={virtualPaddingRight}
        />
      </table>
    </div>
  );
}

function TableHeadRow({
  columnVirtualizer,
  headerGroup,
  virtualPaddingLeft,
  virtualPaddingRight,
  table,
}: VirtualPadding & {
  columnVirtualizer: ColumnVirtualizer;
  headerGroup: HeaderGroup<Features, BenchRow>;
  table: ReactTable<Features, BenchRow>;
}) {
  const virtualColumns = columnVirtualizer.getVirtualItems();
  return (
    <tr className={styles.tr} style={{ height: BENCH_HEADER_HEIGHT }}>
      {virtualPaddingLeft ? (
        <th className={styles.th} style={{ width: virtualPaddingLeft }} />
      ) : null}
      {virtualColumns.map((virtualColumn) => {
        const header = headerGroup.headers[virtualColumn.index];
        return <TableHeadCell key={header.id} header={header} table={table} />;
      })}
      {virtualPaddingRight ? (
        <th className={styles.th} style={{ width: virtualPaddingRight }} />
      ) : null}
    </tr>
  );
}

function TableHeadCell({
  header,
  table,
}: {
  header: Header<Features, BenchRow, unknown>;
  table: ReactTable<Features, BenchRow>;
}) {
  return (
    <th
      className={styles.th}
      data-column-id={header.column.id}
      style={{ width: header.getSize() }}
    >
      <div
        className={header.column.getCanSort() ? styles.sortable : undefined}
        onClick={header.column.getToggleSortingHandler()}
      >
        <table.FlexRender header={header} />
        {{
          asc: ' ▲',
          desc: ' ▼',
        }[header.column.getIsSorted() as string] ?? null}
      </div>
    </th>
  );
}

function TableBody({
  columnVirtualizer,
  table,
  tableContainerRef,
  virtualPaddingLeft,
  virtualPaddingRight,
}: VirtualPadding & {
  columnVirtualizer: ColumnVirtualizer;
  table: ReactTable<Features, BenchRow>;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { rows } = table.getRowModel();

  // fixed row height - nothing is measured
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => BENCH_ROW_HEIGHT,
    getScrollElement: () => tableContainerRef.current,
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <tbody
      className={styles.tbody}
      style={{
        // tells the scrollbar how big the table is
        height: `${rowVirtualizer.getTotalSize()}px`,
      }}
    >
      {virtualRows.map((virtualRow) => {
        const row = rows[virtualRow.index];
        return (
          <TableBodyRow
            columnVirtualizer={columnVirtualizer}
            key={row.id}
            row={row}
            virtualPaddingLeft={virtualPaddingLeft}
            virtualPaddingRight={virtualPaddingRight}
            virtualRow={virtualRow}
            table={table}
          />
        );
      })}
    </tbody>
  );
}

function TableBodyRow({
  columnVirtualizer,
  row,
  virtualPaddingLeft,
  virtualPaddingRight,
  virtualRow,
  table,
}: VirtualPadding & {
  columnVirtualizer: ColumnVirtualizer;
  row: Row<Features, BenchRow>;
  virtualRow: VirtualItem;
  table: ReactTable<Features, BenchRow>;
}) {
  const visibleCells = row.getAllCells();
  const virtualColumns = columnVirtualizer.getVirtualItems();
  return (
    <tr
      className={`${styles.tr} ${styles.bodyRow}`}
      style={{
        height: BENCH_ROW_HEIGHT,
        // always a style, as it changes on scroll
        transform: `translateY(${virtualRow.start}px)`,
      }}
    >
      {virtualPaddingLeft ? (
        <td className={styles.td} style={{ width: virtualPaddingLeft }} />
      ) : null}
      {virtualColumns.map((vc) => {
        const cell = visibleCells[vc.index];
        return (
          <TableBodyCell
            key={cell.id}
            cell={cell}
            rowIndex={virtualRow.index}
            table={table}
          />
        );
      })}
      {virtualPaddingRight ? (
        <td className={styles.td} style={{ width: virtualPaddingRight }} />
      ) : null}
    </tr>
  );
}

function TableBodyCell({
  cell,
  rowIndex,
  table,
}: {
  cell: Cell<Features, BenchRow, unknown>;
  rowIndex: number;
  table: ReactTable<Features, BenchRow>;
}) {
  return (
    <td
      className={styles.td}
      data-row-index={rowIndex}
      data-column-id={cell.column.id}
      style={{ width: cell.column.getSize() }}
    >
      <table.FlexRender cell={cell} />
    </td>
  );
}

// ---------------------------------------------------------------------------
// harness adapter
// ---------------------------------------------------------------------------

const root = () =>
  document.querySelector<HTMLElement>('[data-benchmark-grid="tanstack"] table');

const scroller = () => root()?.parentElement ?? null;

const body = () => root()?.querySelector<HTMLElement>('tbody') ?? null;

const adapter: BenchAdapter = {
  grid: 'tanstack',
  version: __TANSTACK_TABLE_VERSION__,
  getRoot: () => scroller(),
  getVerticalScroller: scroller,
  getHorizontalScroller: scroller,
  getBodyRect: () => {
    const el = scroller();
    const header = root()?.querySelector<HTMLElement>('thead');
    if (!el || !header) {
      return null;
    }
    const rect = el.getBoundingClientRect();
    const top = header.getBoundingClientRect().bottom;
    return {
      left: rect.left + el.clientLeft,
      top,
      width: el.clientWidth,
      height: rect.top + el.clientTop + el.clientHeight - top,
    };
  },
  getRenderedColumnCells: (field) =>
    Array.from(
      body()?.querySelectorAll<HTMLElement>(`td[data-column-id="${field}"]`) ??
        [],
    ),
  getRenderedRowCells: (rowIndex) =>
    Array.from(
      body()?.querySelectorAll<HTMLElement>(
        `td[data-row-index="${rowIndex}"]`,
      ) ?? [],
    ),
  getCellRowIndex: (cell) => Number(cell.getAttribute('data-row-index') ?? -1),
  getCellColumnId: (cell) => cell.getAttribute('data-column-id') ?? '',
  getCell: (rowIndex, field) =>
    body()?.querySelector<HTMLElement>(
      `td[data-row-index="${rowIndex}"][data-column-id="${field}"]`,
    ) ?? null,
  getHeaderCell: (field) =>
    root()?.querySelector<HTMLElement>(`th[data-column-id="${field}"]`) ?? null,
};

export function TanStackBenchmark({ rowCount }: { rowCount: number }) {
  return (
    <BenchmarkPage
      title={`TanStack Table ${__TANSTACK_TABLE_VERSION__} + TanStack Virtual ${__TANSTACK_VIRTUAL_VERSION__}`}
      rowCount={rowCount}
      adapter={adapter}
      renderGrid={(data) => <TanStackGrid data={data} />}
    />
  );
}
