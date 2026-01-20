"use client";

import "@/components/table/table.css";
import TableView from "@/components/table/TableView";

export default function Team() {

    return (
        <div>
            <TableView
                query={`query { teams { id name } }`}
                schema={{
                    id: {label: "id"},
                    name: {label: "name"},
                }}
                itemUrl={null}
            />
        </div>
    );


}
