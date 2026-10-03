import { Router } from "express";
import type { UserService } from "../../services/user/types.js";
import { createAuthHandlers } from "../handlers/auth.js";

export function createAuthRouter(userService: UserService) {
	const router = Router();
	const handlers = createAuthHandlers(userService);
	router.post("/register", handlers.register);
	router.post("/login", handlers.login);
	return router;
}
