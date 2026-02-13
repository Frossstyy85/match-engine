'use client'

import { ColumnDef } from "@tanstack/table-core"
import { Team } from "@/lib/types"
import DataTable from "@/components/table/DataTable"
import Link from "next/link"

const columns: ColumnDef<Team>[] = [
    {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => {
            const { name, id } = row.original
            return (
                <Link href={`/dashboard/teams/${id}`} className="font-medium text-blue-600 hover:underline">
                    {name}
                </Link>
            )
        },
    },
]

export default function TeamsTable({ data }: { data: Team[] }) {
    return <DataTable data={data} columns={columns} />
}
