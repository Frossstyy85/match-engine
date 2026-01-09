import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

    export const usersTable = pgTable("users", {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        name: varchar().notNull(),
        email: varchar().notNull().unique(),
        password_hash: varchar().notNull(),
    });

    export const teamsTable = pgTable("teams", {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        name: varchar().notNull(),
    });

    export const teamUsers = pgTable("teamUsers", {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        teamId: integer().notNull().references(() => teamsTable.id, { onDelete: "cascade"}),
        userId: integer().notNull().references(() => usersTable.id, { onDelete: "cascade"}),
    })

    export const projectsTable = pgTable("projects", {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        name: varchar().notNull(),
    });

    export const projectTeams = pgTable("projectTeams", {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        teamId: integer().notNull().references(() => teamsTable.id, { onDelete: "cascade"}),
        projectId: integer().notNull().references(() => projectsTable.id, { onDelete: "cascade"}),
    });

    export const rolesTable = pgTable("role", {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        name: varchar().notNull(),
    });

    export const userRolesTable = pgTable("userRole", {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        userId: integer().notNull().references(() => usersTable.id, { onDelete: "cascade"}),
        roleId: integer().notNull().references(() => rolesTable.id, { onDelete: "cascade"}),
    })

