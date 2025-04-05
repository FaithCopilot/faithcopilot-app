import { useEffect, useState } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";

import { ButtonMenu } from "@/components/ButtonMenu";
import { Search } from "@/components/fields/Search";
import { Select } from "@/components/fields/Select";

import {
  SortIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@/components/Icons";

const columnHelper = createColumnHelper();

const Row = ({
  idx,
  variant,
  row,
  actionItems
}: {
  idx: number;
  variant?: "none" | undefined;
  row: any;
  actionItems?: (item: any, idx: number) => Array<any>;
}) => {
  if (!row || !row?.original) return null;
  const items = actionItems?.(row.original, idx);
  return (
    <tr
      className={[
        "border-b border-b-1 border-b-neutral-400 dark:border-b-neutral-600 text-neutral-900 dark:text-neutral-200 text-sm text-left mb-2 w-full md:w-60",
        //"h-[12px] max-h-[12px]",
        variant === "none"
          ? "border-b-neutral-200 dark:border-b-neutral-900"
          : idx % 2 === 0
          ? "bg-neutral-300 dark:bg-black"
          : "bg-neutral-200 dark:bg-neutral-900"
      ].join(" ")}
    >
      {row.getVisibleCells().map((cell: any, idx: number) => (
        <td key={idx} className="px-2" style={{ width: cell.column.getSize() }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
      {items && (
        <td key="actions" className="w-16">
          <ButtonMenu offset={80} variant="none" items={items} />
        </td>
      )}
    </tr>
  );
};

  //<th key={header.id} colSpan={header.colSpan} className="px-1">
const Header = ({ header }: { header: any }) => (
  <th key={header.id} className="px-2" style={{ width: header.column.getSize() }}> 
    {header.isPlaceholder ? null : (
      <div
        className={[
          "flex flex-row space-x-1 items-center",
          header.column.getCanSort() ? "cursor-pointer select-none" : ""
        ].join(" ")}
        onClick={header.column.getToggleSortingHandler()}
        title={
          header.column.getCanSort()
            ? header.column.getNextSortingOrder() === "asc"
              ? "Sort ascending" // TODO: i18n support
              : header.column.getNextSortingOrder() === "desc"
              ? "Sort descending"
              : "Clear sort"
            : undefined
        }
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
        {{
          asc: <ChevronUpIcon size={16} />,
          desc: <ChevronDownIcon size={16} />
        }[header.column.getIsSorted() as string] ??
          (header.column.getCanSort() ? <SortIcon size={16} /> : null)}
      </div>
    )}
  </th>
);

const Footer = ({
  table,
  count
}: {
  table: any;
  count: number | undefined;
}) => {
  if (!table) return null;
  if (!count) count = 0;
  const displayCountItems = [];
  if (count > 0) displayCountItems.push({ value: "10", label: "Show 10" });
  if (count > 10) displayCountItems.push({ value: "100", label: "Show 100" });
  if (count > 100)
    displayCountItems.push({ value: "1000", label: "Show 1000" });
  return (
    <div>
      <div className="h-2" />
      <div>
        <span className="text-xl font-bold">
          {table.getPrePaginationRowModel()?.rows?.length}
        </span>{" "}
        Records
      </div>
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16 inputs"
          />
        </span>
        <div className="max-w-32">
          <Select
            items={displayCountItems}
            value={table.getState().pagination.pageSize}
            onChange={(value: string) => {
              table.setPageSize(Number(value));
            }}
            className="rounded texts p-2 w-32"
          />
        </div>
      </div>
      <div>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
    </div>
  );
};

type ColumnItemType = {
  accessor: string;
  header: string;
  sortingFn?: any;
  sortDescFirst?: boolean;
  enableSorting?: boolean;
  size?: number;
  minSize?: number;
  maxSize?: number;
};

export const FilterTable = ({
  variant,
  search,
  columnItems,
  initialState,
  data,
  renderRow,
  actionItems,
  componentStart,
  componentEnd,
  pageSize
}: {
  variant?: "none" | undefined;
  search?: boolean;
  columnItems: Array<any>;
  initialState: any;
  data: Array<any>;
  renderRow?: (item: any, idx: number) => React.ReactNode;
  actionItems?: (item: any, idx: number) => Array<any>;
  componentStart?: React.ReactNode;
  componentEnd?: React.ReactNode;
  pageSize?: number;
}) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: Array<any> = columnItems?.map((item: ColumnItemType) => {
    return columnHelper.accessor(item.accessor, {
      cell: (info) => info.getValue(),
      header: () => <span>{item.header}</span>,
      sortingFn: item?.sortingFn ?? "basic",
      sortDescFirst: false, //item?.sortDescFirst ?? true,
      enableSorting: item?.enableSorting ?? true,
      size: item?.size,
      minSize: item?.minSize,
      maxSize: item?.maxSize
    });
  });

  const table = useReactTable({
    data,
    columns,
    initialState,
    state: {
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: pageSize ? getPaginationRowModel() : undefined
  });

  useEffect(() => {
    if (!data?.length) return;
    if (pageSize) {
      table.setPageSize(pageSize);
    };
    return;
  }, [data?.length, pageSize]);

  // TODO: better display when no data
  //if (!data) return null;
  return (
    <div className="h-full w-full flex flex-col space-y-1 md:pr-6">
      <div className="flex flex-row space-x-1">
        {componentStart}
        {search && (
          <Search
            //placeholder="Search"
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
          />
        )}
        <div className="ms-auto">{componentEnd}</div>
      </div>
      {search && <div className="h-2" />}
      {table?.getHeaderGroups()?.length > 0 && (
        <table>
          <thead className="border-b-4 border-b-primary-700 texts text-sm text-left font-bold uppercase">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="py-1">
                {headerGroup.headers.map((header, idx) => (
                  <Header key={idx} header={header} />
                ))}
                {/*<th key="actions" className="text-right w-16 pe-2">Actions</th>*/}
                <th key="actions" className="w-16 pe-2">Actions</th>
              </tr>
            ))}
          </thead>
        </table>
      )}
      {data?.length > 0 && (
        <table className="overflow-y-scroll">
          <tbody>
            {table
              .getRowModel()
              .rows.map(
                renderRow
                  ? renderRow
                  : (row, idx) => (
                      <Row
                        key={idx}
                        idx={idx}
                        row={row}
                        actionItems={actionItems}
                        variant={variant}
                      />
                    )
              )}
          </tbody>
        </table>
      )}
      <div className="py-2">
        {pageSize && <Footer table={table} count={data?.length} />}
      </div>
    </div>
  );
};
