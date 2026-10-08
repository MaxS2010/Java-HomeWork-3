import type { Task, TaskPriority, TaskStatus } from "../../domain/task/entity.js";
import type { TaskRepository } from "../../domain/task/repository.js";
import type { Repository as UserRepository } from "../../domain/user/repository.js";
import { ServiceError } from "../errors.js";
import type { TaskFilters, TaskService } from "./types.js";

const statuses: TaskStatus[] = ["todo", "in_progress", "done"];
const priorities: TaskPriority[] = ["low", "medium", "high"];

function objectInput(input: unknown): Record<string, unknown> {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw new ServiceError("Request body must be an object", 400);
    }
    return input as Record<string, unknown>;
}

export function createTaskService(taskRepository: TaskRepository, userRepository: UserRepository): TaskService {
    return {
        getAllTasks(filters?: TaskFilters) {
            return taskRepository.getAll(filters);
        },

        async getTaskById(id) {
            const task = await taskRepository.getById(id);
            if (!task) throw new ServiceError("Task not found", 404);
            return task;
        },

        async createTask(input) {
            const data = objectInput(input);
            const userId = data.userId;
            if (!Number.isInteger(userId) || (userId as number) < 1
                || typeof data.title !== "string" || !data.title.trim()
                || (data.description !== undefined && typeof data.description !== "string")) {
                throw new ServiceError("Valid userId and title are required", 400);
            }

            const status = data.status === undefined ? "todo" : data.status;
            const priority = data.priority === undefined ? "medium" : data.priority;
            if (typeof status !== "string" || !statuses.includes(status as TaskStatus)
                || typeof priority !== "string" || !priorities.includes(priority as TaskPriority)) {
                throw new ServiceError("Invalid task status or priority", 400);
            }
            if (!await userRepository.getById(userId as number)) {
                throw new ServiceError("User not found", 404);
            }

            return taskRepository.create({
                userId: userId as number,
                title: data.title.trim(),
                description: (data.description as string | undefined) ?? "",
                status: status as TaskStatus,
                priority: priority as TaskPriority,
            });
        },

        async updateTask(id, input) {
            const data = objectInput(input);
            const update: Partial<Pick<Task, "title" | "description" | "status" | "priority">> = {};
            if ("title" in data) {
                if (typeof data.title !== "string" || !data.title.trim()) throw new ServiceError("Title must not be empty", 400);
                update.title = data.title.trim();
            }
            if ("description" in data) {
                if (typeof data.description !== "string") throw new ServiceError("Description must be a string", 400);
                update.description = data.description;
            }
            if ("status" in data) {
                if (typeof data.status !== "string" || !statuses.includes(data.status as TaskStatus)) throw new ServiceError("Invalid task status", 400);
                update.status = data.status as TaskStatus;
            }
            if ("priority" in data) {
                if (typeof data.priority !== "string" || !priorities.includes(data.priority as TaskPriority)) throw new ServiceError("Invalid task priority", 400);
                update.priority = data.priority as TaskPriority;
            }
            if (Object.keys(data).some((key) => !["title", "description", "status", "priority"].includes(key))) {
                throw new ServiceError("Only title, description, status, and priority can be updated", 400);
            }
            if (Object.keys(update).length === 0) throw new ServiceError("At least one task field is required", 400);

            const task = await taskRepository.update(id, update);
            if (!task) throw new ServiceError("Task not found", 404);
            return task;
        },

        async deleteTask(id) {
            if (!await taskRepository.delete(id)) throw new ServiceError("Task not found", 404);
        },
    };
}