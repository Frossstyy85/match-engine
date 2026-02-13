type Project = {
    id: number
    name: string
    description?: string | null
    start_date?: string | null
    end_date?: string | null
    status?: string
}

type Team = {
    id: number
    name: string
}

type Skill = {
    id: number
    name: string
}

type SkillCategory = {
    id: number
    name: string
    skills: Skill[]
}

type SkillWithCategory = {
    id: number
    name: string
    skill_categories: { name: string } | null
}

export type { Project, Team, Skill, SkillCategory, SkillWithCategory }
