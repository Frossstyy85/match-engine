export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole
}

export const ROLES = [
    "admin",
    "HR",
    "employee",
    "project_lead",
] as const;

export type UserRole = typeof ROLES[number];
