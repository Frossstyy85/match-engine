import "server-only";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
    user: "app_user",
    database: "app_db",
    host: "localhost",
    password: "app_password",
    port: 5432,
    max: 5,
});

const db = drizzle({ client: pool });

export default db;
