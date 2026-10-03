import type {
    Task,
} from "../domain/task/entity.js";

import type {
    TaskRepository
} from "../domain/task/repository.js";
import { readJsonFile, updateJsonFile } from "../services/storage/jsonTools.js";

const fileUrl = new URL("../../data/tasks.json", import.meta.url);
const emptyTasks: Task[] = [];

export function createTaskRepository(): TaskRepository {
    return {
        async getAll(filters) {
            let tasks = await readJsonFile(fileUrl, emptyTasks);

            if (filters?.userId !== undefined) {
                tasks = tasks.filter(
                    (task) => task.userId === filters.userId
                );
            }

            if (filters?.status !== undefined) {
                tasks = tasks.filter(
                    (task) => task.status === filters.status
                );
            }

            if (filters?.priority !== undefined) {
                tasks = tasks.filter(
                    (task) => task.priority === filters.priority
                );
            }

            return tasks;
        },

        async getById(id) {
            return (await readJsonFile(fileUrl, emptyTasks)).find((task) => task.id === id);
        },

        async create(data) {
            return updateJsonFile(fileUrl, emptyTasks, (tasks) => {
                const nextId = tasks.reduce((largest, task) => Math.max(largest, task.id), 0) + 1;
                const now = new Date().toISOString();
                const task: Task = { ...data, id: nextId, createdAt: now, updatedAt: now };
                return { data: [...tasks, task], result: task };
            });
        },

        async update(id, data) {
            return updateJsonFile(fileUrl, emptyTasks, (tasks) => {
                const index = tasks.findIndex((task) => task.id === id);
                if (index < 0) {
                    return { data: tasks, result: undefined };
                }

                const existing = tasks[index]!;
                const updated: Task = { ...existing, ...data, updatedAt: new Date().toISOString() };
                const nextTasks = [...tasks];
                nextTasks[index] = updated;
                return { data: nextTasks, result: updated };
            });
        },

        async delete(id) {
            return updateJsonFile(fileUrl, emptyTasks, (tasks) => {
                const remaining = tasks.filter((task) => task.id !== id);
                return { data: remaining, result: remaining.length !== tasks.length };
            });
        },
    };
}
    