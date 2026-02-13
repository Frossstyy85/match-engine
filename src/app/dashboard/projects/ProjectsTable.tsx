'use client'

import { ColumnDef } from "@tanstack/table-core";
import { Project } from "@/lib/types";
import DataTable from "@/components/table/DataTable";
import { formatDate } from "@/lib/helpers";
import Link from "next/link";
import CreateProjectForm from "@/app/dashboard/projects/CreateProjectForm";

const columns: ColumnDef<Project>[] = [
    {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => {
            const { name, id } = row.original;
            return <Link href={`/dashboard/projects/${id}`} className="font-medium text-blue-600 hover:underline">{name}</Link>;
        },
    },
    { header: "Status", accessorKey: "status" },
    {
        header: "Start",
        accessorKey: "start_date",
        cell: ({ row }) => formatDate(row.original.start_date),
    },
    {
        header: "End",
        accessorKey: "end_date",
        cell: ({ row }) => formatDate(row.original.end_date),
    },
];

export default function ProjectsTable({ data }) {

    return (
        <>
            <DataTable
                data={data}
                columns={columns}
            />
        </>

    );
}
