'use client'

import { ColumnDef } from "@tanstack/table-core"
import type { SkillWithCategory } from "@/lib/types"
import DataTable from "@/components/table/DataTable"

const columns: ColumnDef<SkillWithCategory>[] = [
    { header: "Name", accessorKey: "name" },
    {
        header: "Category",
        accessorKey: "skill_categories",
        cell: ({ row }) => row.original.skill_categories?.name ?? "—",
    },
]

export default function SkillsTable({ data }: { data: SkillWithCategory[] }) {
    return <DataTable data={data} columns={columns} />
}
