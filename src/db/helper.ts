import { Pool, PoolClient } from "pg";

export const runTransaction = async (
    pool: Pool,
    operation: (tx: PoolClient) => Promise<any>
): Promise<any> => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const res = await operation(client);

        await client.query("COMMIT");

        return res;
    } catch (err) {
        await client.query("ROLLBACK");
        throw new Error("Transaction failed", { cause: err });
    } finally {
        client.release();
    }
};