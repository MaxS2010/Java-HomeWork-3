import type { User } from "../domain/user/entity.js";
import { EmailConflictError, type Repository } from "../domain/user/repository.js";
import { readJsonFile, updateJsonFile } from "../services/storage/jsonTools.js";

const fileUrl = new URL("../../data/users.json", import.meta.url);
const emptyUsers: User[] = [];

export function createUserRepository(): Repository {
    return {
        async getAll() {
            return readJsonFile(fileUrl, emptyUsers);
        },

        async getById(id) {
            return (await readJsonFile(fileUrl, emptyUsers)).find((user) => user.id === id);
        },

        async getByEmail(email) {
            return (await readJsonFile(fileUrl, emptyUsers)).find((user) => user.email === email);
        },

        async create(data) {
            return updateJsonFile(fileUrl, emptyUsers, (users) => {
                if (users.some((user) => user.email.toLowerCase() === data.email.toLowerCase())) {
                    throw new EmailConflictError("Email is already registered");
                }

                const id = users.reduce((largest, user) => Math.max(largest, user.id), 0) + 1;
                const user: User = { ...data, id, createdAt: new Date().toISOString() };
                return { data: [...users, user], result: user };
            });
        },
    };
}