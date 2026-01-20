import {useRouter} from "next/navigation";

export default function TableRenderer({rows, columns, loading, refetch, itemUrl}) {

    const router = useRouter();

    return (
        <div className={"table-container"}>
            <div className={"table-controls"}>
                <button onClick={refetch}>refresh</button>
            </div>
            <table className={"table"}>
                <thead>
                <tr>
                    {columns.map((col, key) => (<th key={key}>{col.header}</th>))}
                </tr>
                </thead>
                <tbody>
                {!loading && rows.map((row, idx) => (
                    <tr key={idx} onClick={() => router.push(itemUrl(row))}>
                        {columns.map((col, key) => (
                            <td key={key}>{col.cell(row)}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            {loading && <p>loading...</p>}
        </div>
    );

}