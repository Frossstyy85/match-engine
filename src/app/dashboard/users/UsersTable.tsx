"use client";

import { ColumnDef } from "@tanstack/table-core";
import DataTable from "@/components/table/DataTable";
import type { PaginationState } from "@tanstack/react-table";

type Profile = {
    id: string;
    name?: string | null;
    email?: string | null;
};

const columns: ColumnDef<Profile>[] = [
    {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => row.original.name ?? "—",
    },
    {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => row.original.email ?? "—",
    },
];

export interface UsersTableProps {
    data: Profile[];
    rowCount: number;
    pageIndex: number;
    pageSize: number;
    onPaginationChange: (updater: (old: PaginationState) => PaginationState) => void;
    isLoading?: boolean;
}

export default function UsersTable({
    data,
    rowCount,
    pageIndex,
    pageSize,
    onPaginationChange,
    isLoading,
}: UsersTableProps) {
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
