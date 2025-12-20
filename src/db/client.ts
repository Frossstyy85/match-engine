
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "mydb",
    password: "secret",
    port: 5432,
});



export const db = drizzle({ client: pool });
