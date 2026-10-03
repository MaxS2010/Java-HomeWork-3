import type { Task, TaskStatus, TaskPriority } from "../../domain/task/entity.js";

export interface TaskFilters {
    userId?: number;
    status?: TaskStatus;
    priority?: TaskPriority;
}

export interface TaskService{
    getAllTasks(filters?: TaskFilters): Promise<Task[]>;
    getTaskById(id: number): Promise<Task>;
    createTask(data: unknown): Promise<Task>;
    updateTask(id: number, data: unknown): Promise<Task>;
    deleteTask(id: number): Promise<void>;
}