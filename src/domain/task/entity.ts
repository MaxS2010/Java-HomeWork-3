import type { Temporal } from "temporal-spec";

export interface Task {
    id: number;
    userId: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: Temporal.Instant;
    updatedAt: Temporal.Instant;
}

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";