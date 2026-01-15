import "server-only";
import { Pool } from "pg";

const db = new Pool({
  user: "app_user",
  database: "app_db",
  host: "localhost",
  password: "app_password",
  port: 5432,
  max: 5,
});

export default db;





