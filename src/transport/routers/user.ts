import { Router } from "express";
import type { UserService } from "../../services/user/types.js";
import { createUserHandlers } from "../handlers/user.js";

export function createUserRouter(userService: UserService) {
	const router = Router();
	router.get("/:id", createUserHandlers(userService).getById);
	return router;
}
