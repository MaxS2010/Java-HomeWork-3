import type { RequestHandler } from "express";
import type { TaskPriority, TaskStatus } from "../../domain/task/entity.js";
import type { TaskService } from "../../services/task/types.js";
import type { CreateTaskRequest, TaskIdParams, TaskListQuery, UpdateTaskRequest } from "../dto/task/requests.js";
import type { TaskListResponse, TaskResponse } from "../dto/task/response.js";
import { ServiceError } from "../../services/errors.js";
import { parseId, sendError } from "./http.js";

const statuses: TaskStatus[] = ["todo", "in_progress", "done"];
const priorities: TaskPriority[] = ["low", "medium", "high"];

export function createTaskHandlers(taskService: TaskService) {
	const getAll: RequestHandler = async (request, response) => {
		try {
			const { userId, status, priority } = request.query as TaskListQuery;
			if (userId !== undefined && (typeof userId !== "string" || !/^\d+$/.test(userId) || Number(userId) < 1)) {
				throw new ServiceError("userId must be a positive integer", 400);
			}
			if (status !== undefined && (typeof status !== "string" || !statuses.includes(status as TaskStatus))) {
				throw new ServiceError("Invalid task status", 400);
			}
			if (priority !== undefined && (typeof priority !== "string" || !priorities.includes(priority as TaskPriority))) {
				throw new ServiceError("Invalid task priority", 400);
			}
			const result: TaskListResponse = await taskService.getAllTasks({
				...(userId === undefined ? {} : { userId: Number(userId) }),
				...(status === undefined ? {} : { status: status as TaskStatus }),
				...(priority === undefined ? {} : { priority: priority as TaskPriority }),
			});
			response.json(result);
		} catch (error) {
			sendError(response, error);
		}
	};

	const getById: RequestHandler = async (request, response) => {
		try {
			const params: TaskIdParams = { id: request.params.id };
			const result: TaskResponse = await taskService.getTaskById(parseId(params.id));
			response.json(result);
		} catch (error) {
			sendError(response, error);
		}
	};

	const create: RequestHandler = async (request, response) => {
		try {
			const body = request.body as CreateTaskRequest;
			const result: TaskResponse = await taskService.createTask(body);
			response.status(201).json(result);
		} catch (error) {
			sendError(response, error);
		}
	};

	const update: RequestHandler = async (request, response) => {
		try {
			const params: TaskIdParams = { id: request.params.id };
			const body = request.body as UpdateTaskRequest;
			const result: TaskResponse = await taskService.updateTask(parseId(params.id), body);
			response.json(result);
		} catch (error) {
			sendError(response, error);
		}
	};

	const remove: RequestHandler = async (request, response) => {
		try {
			const params: TaskIdParams = { id: request.params.id };
			await taskService.deleteTask(parseId(params.id));
			response.status(204).end();
		} catch (error) {
			sendError(response, error);
		}
	};

	return { getAll, getById, create, update, remove };
}
