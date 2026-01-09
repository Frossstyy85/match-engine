import { defineConfig } from "drizzle-kit"

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema.ts",
    dbCredentials: {
        url: "postgres://app_user:app_password@localhost:5432/app_db?sslmode=disable",
    }
})