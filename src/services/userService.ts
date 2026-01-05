import * as bcrypt from "bcrypt";
import userRepository from "@/lib/repositories/UserRepository";

const SALT_ROUNDS = 12;

async function hashPassword(rawPassword: string) {
    if (!rawPassword) throw new Error("no password supplied");
    return bcrypt.hash(rawPassword, SALT_ROUNDS);
}

const userService = {

    getUserWithProfile: async (id: number) => userRepository.getById(id),

    createUser: async (name: string, email: string, rawPassword: string) =>
        userRepository.create({
            name,
            email,
            password_hash: await hashPassword(rawPassword),
        }),
    getPasswordHash: async (id: number) => userRepository.getPasswordHash(id),
    findUserCredentials: async (email: string) => userRepository.getUserCredentials(email),
    updatePassword: async (rawPassword: string, id: number) =>
        userRepository.update(id, { password_hash: await hashPassword(rawPassword) }),
    emailExists: async (email: string) => userRepository.emailExists(email),
};

export default userService;
