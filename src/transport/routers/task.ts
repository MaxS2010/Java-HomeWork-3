import { Router } from "express";
import type { TaskService } from "../../services/task/types.js";
import { createTaskHandlers } from "../handlers/task.js";

export function createTaskRouter(taskService: TaskService) {
	const router = Router();
	const handlers = createTaskHandlers(taskService);
	router.get("/", handlers.getAll);
	router.post("/", handlers.create);
	router.get("/:id", handlers.getById);
	router.patch("/:id", handlers.update);
	router.delete("/:id", handlers.remove);
	return router;
}
