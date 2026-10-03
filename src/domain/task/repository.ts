import type {
    Task,
} from "./entity.js";

export type CreateTaskInput = Omit<
    Task,
    'id' | "createdAt" | "updatedAt"
>;

export type UpdateTaskInput = Partial<
    Omit<Task, "id" | "userId" | "createdAt" | "updatedAt"> 
>;

export interface TaskFilters {
    userId?: number;
    status?: Task["status"];
    priority?: Task["priority"];
}

export interface TaskRepository {
    getAll(filters?: TaskFilters): Promise<Task[]>;
    getById(id: number): Promise<Task | undefined>;
    create(data: CreateTaskInput): Promise<Task>;
    update(id: number, data: UpdateTaskInput): Promise<Task | undefined>;
    delete(id: number): Promise<boolean>;
}