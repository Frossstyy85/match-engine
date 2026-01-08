import {integer, pgEnum, pgTable, varchar} from "drizzle-orm/pg-core";


const userRole = pgEnum("role",
    [
        "USER",
        "HR",
        "ADMIN",
        "PROJECT_LEAD"
    ]);

export type UserRole = typeof userRole.enumValues[number];

    export const usersTable = pgTable("users", {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        name: varchar({ length: 255 }).notNull(),
        email: varchar({ length: 255 }).notNull().unique(),
        password_hash: varchar({ length: 255 }).notNull(),
        role: userRole()
    });

