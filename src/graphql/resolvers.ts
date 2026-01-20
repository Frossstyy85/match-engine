import {
    createProject,
    getProjectById,
    getProjects,
    getProjectTeams,
    getRecommendedUsers
} from "@/db/repositories/ProjectRepository";
import {createTeam, getTeams, getTeamUsers} from "@/db/repositories/TeamRepository";
import {
    findUserById,
    getAllUsers,
    getRecommendedProjects,
    getUserById,
    getUserProjects,
    getUserSkills,
    getUserTeams
} from "@/db/repositories/UserRepository";
import {getSkills} from "@/db/repositories/SkillRepository";
import {Project, Skill, Team, User} from "@/lib/types";
import {Principal} from "@/lib/session";


export const resolvers = {

    Query: {

        me: async (_, _a, ctx): Promise<User> => {
            const principal: Principal = ctx.principal;
            const currentUser: User = await getUserById(principal.id);
            return currentUser;
        },

        projects: async (): Promise<Project[]> => {
            return getProjects()
        },

        teams: async (): Promise<Team[]> => {
            return getTeams()
        },

        users: async (): Promise<User[]> => {
            return getAllUsers()
        },

        skills: async (): Promise<Skill[]> => {
            return getSkills()
        },

        user: async (_, { userId }): Promise<User> => {
            return findUserById(userId);
        },

        project: async (_, { projectId }): Promise<Project> => {
            return getProjectById(projectId);
        }

    },

    Mutation: {

        createProject: async (_, args): Promise<Project> => {
            const {name} = args;
            return createProject(name);
        },

        createTeam: async (_, args): Promise<Team> => {
            const {name} = args;
            return createTeam(name);
        }

    },

    Project: {

        teams: async (project: Project): Promise<Team[]> => {
            return getProjectTeams(project.id);
        },

        recommendedUsers: async (project: Project): Promise<User[]> => {
            return getRecommendedUsers(project.id);
        },

    },

    Team: {
        users: async (team: Team): Promise<User[]> => {
            return getTeamUsers(team.id);
        },

    },

    User: {
        projects: async (user: User): Promise<Project[]> => {
            return getUserProjects(user.id)
        },

        teams: async (user: User): Promise<Team[]> => {
            return getUserTeams(user.id)
        },

        skills: async (user: User): Promise<Skill[]> => {
            return getUserSkills(user.id)
        },

        recommendedProjects: async (user: User, args): Promise<any> => {
            return getRecommendedProjects(user.id)
        },


    },

}