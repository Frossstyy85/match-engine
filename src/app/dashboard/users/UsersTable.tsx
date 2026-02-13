'use client'

import { ColumnDef } from "@tanstack/table-core"
import DataTable from "@/components/table/DataTable"

type Profile = {
    id: string
    name?: string | null
    email?: string | null
}

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
]

export default function UsersTable({ data }: { data: Profile[] }) {
    return <DataTable data={data} columns={columns} />
}
