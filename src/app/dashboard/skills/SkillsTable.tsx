"use client";

import { ColumnDef } from "@tanstack/table-core";
import type { SkillWithCategory } from "@/lib/types";
import DataTable from "@/components/table/DataTable";
import type { PaginationState } from "@tanstack/react-table";

const columns: ColumnDef<SkillWithCategory>[] = [
    { header: "Name", accessorKey: "name" },
    {
        header: "Category",
        accessorKey: "skill_categories",
        cell: ({ row }) => row.original.skill_categories?.name ?? "—",
    },
];

export interface SkillsTableProps {
    data: SkillWithCategory[];
    rowCount: number;
    pageIndex: number;
    pageSize: number;
    onPaginationChange: (updater: (old: PaginationState) => PaginationState) => void;
    isLoading?: boolean;
}

export default function SkillsTable({
    data,
    rowCount,
    pageIndex,
    pageSize,
    onPaginationChange,
    isLoading,
}: SkillsTableProps) {
    return (
        <DataTable
            data={data}
            columns={columns}
            pagination={{
                rowCount,
                pageIndex,
                pageSize,
                onPaginationChange,
                isLoading,
            }}
        />
    );
}
