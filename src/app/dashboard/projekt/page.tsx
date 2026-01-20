"use client";
import "@/components/table/table.css";
import TableView from "@/components/table/TableView";

export default function Projekt() {

    return (
        <div>
            <TableView
                query={`query { projects { id name status } }`}
                schema={{
                    id: {label: "id"},
                    name: {label: "name"},
                    status: {label: "status"}
                }
                }
            />
        </div>
    );
}