import {getProjects} from "@/db/repositories/ProjectRepository";
import {getProjectTeams, getTeams, getTeamUsers, getUserTeams} from "@/db/repositories/TeamRepository";
import {getAllUsers, getUserProjects, getUserSkills} from "@/db/repositories/UserRepository";
import {getSkills} from "@/db/repositories/SkillRepository";
import { Project, Team, User } from "@/lib/types";

export const resolvers = {

    Query: {
        me: async () => (null),
        projects: async () => await getProjects(),
        teams: async () => await getTeams(),
        users: async () => await getAllUsers(),
        skills: async () => await getSkills(),
    },

    Mutation: {

        createProject: async (_, args): PR => {
            const { name } = args;
        },

        createTeam: async (_, args) => {
            const { name } = args;
        }

    },



    Project: {
        teams: async (parent) => {
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