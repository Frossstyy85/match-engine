import {getProjects, getUserProjects} from "@/db/repositories/ProjectRepository";
import {getProjectTeams, getTeams, getUserTeams} from "@/db/repositories/TeamRepository";
import {getAllUsers, getTeamUsers} from "@/db/repositories/UserRepository";

export const resolvers = {

    Query: {
        projects: async () => await getProjects(),
        teams: async () => await getTeams(),
        users: async () => await getAllUsers()
    },

    Project: {
        teams: async (project) => await getProjectTeams(project.id)
    },

    Team: {
        users: async (team) => await getTeamUsers(team.id)
    },

    User: {
        projects: async (user) => await getUserProjects(user.id),
        teams: async (user) => await getUserTeams(user.id)
    }

}