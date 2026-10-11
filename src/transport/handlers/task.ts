import type { TaskPriority, TaskStatus } from "../../domain/task/entity.js";
import type { TaskService } from "../../services/task/types.js";
import type { CreateTaskRequest, TaskIdParams, TaskListQuery, UpdateTaskRequest } from "../dto/task/requests.js";
import type { TaskListResponse, TaskResponse } from "../dto/task/response.js";
import { ServiceError } from "../../services/errors.js";
import { parseId, sendError } from "./http.js";
import type { Handler } from "./types.js";

const statuses: TaskStatus[] = ["todo", "in_progress", "done"];
const priorities: TaskPriority[] = ["low", "medium", "high"];

export type TaskHandlers = {
	getAll: Handler<{}, {}, TaskListQuery, TaskListResponse>;
	getById: Handler<TaskIdParams, {}, {}, TaskResponse>;
	create: Handler<{}, CreateTaskRequest, {}, TaskResponse>;
	update: Handler<TaskIdParams, UpdateTaskRequest, {}, TaskResponse>;
	remove: Handler<TaskIdParams, {}, {}, void>;
};

export function createTaskHandlers(taskService: TaskService): TaskHandlers {
	return {
		async getAll(request, response) {
			try {
				const { userId, status, priority } = request.query;
				if (userId !== undefined && (typeof userId !== "string" || !/^\d+$/.test(userId) || Number(userId) < 1)) {
					throw new ServiceError("userId must be a positive integer", 400);
				}
				if (status !== undefined && (typeof status !== "string" || !statuses.includes(status as TaskStatus))) {
					throw new ServiceError("Invalid task status", 400);
				}
				if (priority !== undefined && (typeof priority !== "string" || !priorities.includes(priority as TaskPriority))) {
					throw new ServiceError("Invalid task priority", 400);
				}

				const result = await taskService.getAllTasks({
					...(userId === undefined ? {} : { userId: Number(userId) }),
					...(status === undefined ? {} : { status: status as TaskStatus }),
					...(priority === undefined ? {} : { priority: priority as TaskPriority }),
				});
				response.json(result);
			} catch (error) {
				sendError(response, error);
			}
		},

		async getById(request, response) {
			try {
				const result = await taskService.getTaskById(parseId(request.params.id));
				response.json(result);
			} catch (error) {
				sendError(response, error);
			}
		},

		async create(request, response) {
			try {
				const result = await taskService.createTask(request.body);
				response.status(201).json(result);
			} catch (error) {
				sendError(response, error);
			}
		},

		async update(request, response) {
			try {
				const result = await taskService.updateTask(parseId(request.params.id), request.body);
				response.json(result);
			} catch (error) {
				sendError(response, error);
			}
		},

		async remove(request, response) {
			try {
				await taskService.deleteTask(parseId(request.params.id));
				response.status(204).end();
			} catch (error) {
				sendError(response, error);
			}
		},
	};
}
