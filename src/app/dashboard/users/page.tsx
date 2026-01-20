"use client";

import "@/components/table/table.css";
import TableView from "@/components/table/TableView";

export default function Anvandare() {

    return (
        <div>
            <TableView
                query={`query { users { id name email } }`}
                schema={{
                    id: {label: "id"},
                    name: {label: "name"},
                    email: {label: "email"}
                }
                }
                itemUrl={(item) => `users/${item.id}`}
            />
        </div>
    );
}
