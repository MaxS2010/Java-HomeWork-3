import type { RequestHandler } from "express";
import type { UserService } from "../../services/user/types.js";
import type { RegisterUserRequest, LoginRequest } from "../dto/users/requests.js";
import type { UserResponse } from "../dto/users/response.js";
import { sendError } from "./http.js";

export function createAuthHandlers(userService: UserService) {
	const register: RequestHandler = async (request, response) => {
		try {
			const body = request.body as RegisterUserRequest;
			const result: UserResponse = await userService.register(body);
			response.status(201).json(result);
		} catch (error) {
			sendError(response, error);
		}
	};

	const login: RequestHandler = async (request, response) => {
		try {
			const body = request.body as LoginRequest;
			const result: UserResponse = await userService.login(body);
			response.json(result);
		} catch (error) {
			sendError(response, error);
		}
	};

	return { register, login };
}
