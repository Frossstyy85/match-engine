import { getProjects} from "@/db/repositories/ProjectRepository";
import { getProjectTeams, getTeams, getUserTeams, getTeamUsers } from "@/db/repositories/TeamRepository";
import { getAllUsers, getUserSkills, getUserProjects } from "@/db/repositories/UserRepository";
import { getSkills } from "@/db/repositories/SkillRepository";

export const resolvers = {

    Query: {
        projects: async () => await getProjects(),
        teams: async () => await getTeams(),
        users: async () => await getAllUsers(),
        skills: async () => await getSkills(),
    },

    Project: {
        teams: async (parent) =>  {
            return await getProjectTeams(parent.id);
        },


        status: (parent) => {
           return parent.project_status
        }

    },

    Team: {
        users: async (parent) => {
            return getTeamUsers(parent.id);
        },




    },

    User: {
        projects: async (parent) => await getUserProjects(parent.id),
        teams: async (parent) => await getUserTeams(parent.id),
        skills: async (parent) => await getUserSkills(parent.id)
    },



}