"use client";

import { ColumnDef } from "@tanstack/table-core";
import { Team } from "@/lib/types";
import DataTable from "@/components/table/DataTable";
import Link from "next/link";
import type { PaginationState } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";

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
        cell: ({ row }) => {
            const team = row.original

            return (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" avoidCollisions={false}>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Link href={`/dashboard/teams/${team.id}`}>View team</Link></DropdownMenuItem>
                        <DropdownMenuItem><Link href={`/dashboard/teams/${team.id}/edit`}>Edit team</Link></DropdownMenuItem>
                        <DropdownMenuItem>Delete team</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
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
