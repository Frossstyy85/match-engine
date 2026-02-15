"use client";

import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    type ColumnDef,
    type PaginationState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "../ui/button";
import DataTableSkeleton from "@/components/table/DataTableSkeleton";

export interface DataTablePaginationProps {
    rowCount: number;
    pageIndex: number;
    pageSize: number;
    onPaginationChange: (updater: (old: PaginationState) => PaginationState) => void;
    isLoading?: boolean;
}

export interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    pagination?: DataTablePaginationProps;
}

export default function DataTable<TData>({ data, columns, pagination }: DataTableProps<TData>) {
    const isServerSide = pagination != null;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        ...(isServerSide
            ? {
                  manualPagination: true,
                  pageCount: Math.ceil(pagination.rowCount / pagination.pageSize) || 1,
                  state: {
                      pagination: {
                          pageIndex: pagination.pageIndex,
                          pageSize: pagination.pageSize,
                      },
                  },
                  onPaginationChange: pagination.onPaginationChange,
              }
            : {
                  getPaginationRowModel: getPaginationRowModel(),
              }),
    });

    const canPreviousPage = table.getCanPreviousPage();
    const canNextPage = table.getCanNextPage();
    const pageCount = table.getPageCount();
    const rowCount = isServerSide ? pagination!.rowCount : data.length;
    const startRow = (table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + 1;
    const endRow = Math.min(
        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
        rowCount
    );
    const isLoading = pagination?.isLoading ?? false;

    if (isLoading) {
        return (
            <div className="space-y-4">
                <DataTableSkeleton columnCount={columns.length} rowCount={pagination?.pageSize ?? 10} />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {(isServerSide || pageCount > 1) && (
                <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        {rowCount === 0
                            ? "No rows"
                            : `Showing ${startRow}–${endRow} of ${rowCount}`}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!canPreviousPage || isLoading}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {table.getState().pagination.pageIndex + 1} of {pageCount || 1}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!canNextPage || isLoading}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
