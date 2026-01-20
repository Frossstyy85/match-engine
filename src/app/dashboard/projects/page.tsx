"use client";
import "@/components/table/table.css";
import TableView from "@/components/table/TableView";
import {Project} from "@/lib/types";

export default function Projekt() {

    return (
        <div>
            <TableView
                query={`query { projects { id name status } }`}
                schema={{
                    id: {label: "id"},
                    name: {label: "name"},
                    status: {label: "status"}
                }}
                itemUrl={(item: Project) => `projects/${item.id}`}
            />
        </div>
    );
}