"use client";

import "@/components/table/table.css";
import TableView from "@/components/table/TableView";

export default function Kompetenser() {

    return (
        <div>
            <TableView
                query={`query { skills { id name } }`}
                schema={{
                    id: { label: "id" },
                    name: { label: "name" },
                }
            }
            />
        </div>
    );
}