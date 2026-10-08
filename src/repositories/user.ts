import type { User } from "../domain/user/entity.js";
import { EmailConflictError, type Repository } from "../domain/user/repository.js";
import { db } from "../prisma/db.js";
import type { Models } from "../prisma/contract.d.js";

type UserRecord = Pick<Models.public_User,
    "id" | "email" | "username" | "name" | "password" | "createdAt" | "updatedAt">;

function toUser(record: UserRecord): User {
    return {
        id: record.id,
        email: record.email,
        username: record.username,
        name: record.name,
        password: record.password,
        createdAt: String(record.createdAt),
        updatedAt: String(record.updatedAt),
    };
}

function isUniqueViolation(error: unknown): boolean {
    return typeof error === "object"
        && error !== null
        && "sqlState" in error
        && error.sqlState === "23505";
}

export function createUserRepository(): Repository {
    return {
        async getAll() {
            const records = await db.orm.public.User.all();
            return records.map(toUser);
        },

        async getById(id) {
            const record = await db.orm.public.User.first({ id });
            return record === null ? undefined : toUser(record);
        },

        async getByEmail(email) {
            const record = await db.orm.public.User
                .where({ email })
                .first();
            return record === null ? undefined : toUser(record);
        },

        async create(data) {
            try {
                const record = await db.orm.public.User.create({
                    email: data.email,
                    username: data.username ?? null,
                    name: data.name,
                    password: data.password,
                });
                return toUser(record);
            } catch (error) {
                if (isUniqueViolation(error)) {
                    throw new EmailConflictError("Email is already registered");
                }
                throw error;
            }
        },
    };
}
