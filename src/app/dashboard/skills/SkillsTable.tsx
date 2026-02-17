"use client";

import { ColumnDef } from "@tanstack/table-core";
import type { SkillWithCategory } from "@/lib/types";
import DataTable from "@/components/table/DataTable";
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
import Link from "next/link";
import {AlertDialog, AlertDialogCancel, AlertDialogTrigger} from "@/components/ui/alert-dialog";

const columns: ColumnDef<SkillWithCategory>[] = [
    { header: "Name", accessorKey: "name" },
    {
        header: "Category",
        accessorKey: "skill_categories",
        cell: ({ row }) => row.original.skill_categories?.name ?? "—",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const skill = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Link href={`/dashboard/projects/${skill.id}/edit`}>Edit skill</Link></DropdownMenuItem>
                        <DropdownMenuItem variant={"destructive"}>Delete skill</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
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
