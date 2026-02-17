"use client";

import { ColumnDef } from "@tanstack/table-core";
import { Team } from "@/lib/types";
import DataTable from "@/components/table/DataTable";
import Link from "next/link";
import type { PaginationState } from "@tanstack/react-table";
import TeamRowActions from "@/app/dashboard/teams/TeamRowActions";

const columns: ColumnDef<Team>[] = [
    {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => {
            const { name, id } = row.original;
            return (
                <Link href={`/dashboard/teams/${id}`} className="font-medium text-blue-600 hover:underline">
                    {name}
                </Link>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <TeamRowActions team={row.original} />,
    },
];

export interface TeamsTableProps {
    data: Team[];
    rowCount: number;
    pageIndex: number;
    pageSize: number;
    onPaginationChange: (updater: (old: PaginationState) => PaginationState) => void;
    isLoading?: boolean;
}

export default function TeamsTable({
    data,
    rowCount,
    pageIndex,
    pageSize,
    onPaginationChange,
    isLoading,
}: TeamsTableProps) {
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
