import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { ROLES } from "@/lib/types";

export const userRole = pgEnum("user_role", ROLES);

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    role: userRole("role").notNull().default("employee"),
    createdAt: timestamp("created_at").defaultNow(),
});
