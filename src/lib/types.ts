interface BaseEntity {
    readonly id: number
}

export interface Project extends BaseEntity {
    name?: string
    status: string
}

export interface Team extends BaseEntity {
    name?: string
}

export interface User extends BaseEntity {
    name?: string,
    email?: string,
    password_hash?: string,
    role?: string,
}

export interface Skill extends BaseEntity {
    name?: string
}

