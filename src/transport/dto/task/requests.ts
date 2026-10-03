import type { TaskPriority, TaskStatus } from "../../../domain/task/entity.js";

export interface CreateTaskRequest {
	userId: number;
	title: string;
	description?: string;
	status?: TaskStatus;
	priority?: TaskPriority;
}

export interface UpdateTaskRequest {
	title?: string;
	description?: string;
	status?: TaskStatus;
	priority?: TaskPriority;
}

export interface TaskIdParams {
	id: string | string[] | undefined;
}

export interface TaskListQuery {
	userId?: string;
	status?: TaskStatus;
	priority?: TaskPriority;
}
