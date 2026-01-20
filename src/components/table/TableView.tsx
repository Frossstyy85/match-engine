import "@/components/table/table.css"
import TableRenderer from "@/components/table/TableRenderer";
import {useGraph} from "@/lib/hooks";

export default function TableView({query, schema, itemUrl}) {

    const {data, loading, error, refetch} = useGraph(query);


    const columns = Object.keys(schema).map(key => ({
        header: schema[key]?.label,
        cell: row => row[key]
    }))

    const rows = data ? Object.values(data)[0] : [];

    return (
        <TableRenderer
            rows={rows}
            columns={columns}
            loading={loading}
            refetch={refetch}
            itemUrl={itemUrl}
        />
    )


}
