  import { Pool } from "pg";

  export const pool = new Pool({
    user: "app_user",
    database: "app_db",
    host: "localhost",
    password: "app_password",
    port: 5432,
    max: 5,
  });