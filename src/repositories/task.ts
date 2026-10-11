import type { TaskRepository } from "../domain/task/repository.js";
import type { db } from "../prisma/db.js";

type Database = typeof db;

export function createTaskRepository(database: Database): TaskRepository {
    return {
        async getAll(filters) {
            const where = {
                ...(filters?.userId === undefined ? {} : { userId: filters.userId }),
                ...(filters?.status === undefined ? {} : { status: filters.status }),
                ...(filters?.priority === undefined ? {} : { priority: filters.priority }),
            };
            const records = await database.orm.public.Task.where(where).all();
            return records;
        },

        async getById(id) {
            const record = await database.orm.public.Task.first({ id });
            return record ?? undefined;
        },

        async create(data) {
            const record = await database.orm.public.Task.create({
                userId: data.userId,
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
            });
            return record;
        },

        async update(id, data) {
            const current = await database.orm.public.Task.first({ id });
            if (!current) return undefined;

            await database.orm.public.Task.where({ id }).update(data);
            const updated = await database.orm.public.Task.first({ id });
            return updated ?? undefined;
        },

        async delete(id) {
            const current = await database.orm.public.Task.first({ id });
            if (!current) return false;

            await database.orm.public.Task.where({ id }).delete();
            return true;
        },
    };
}
