import type { UserService } from "../../services/user/types.js";
import type { RegisterUserRequest, LoginRequest } from "../dto/users/requests.js";
import type { UserResponse } from "../dto/users/response.js";
import { sendError } from "./http.js";
import type { Handler } from "./types.js";

export type AuthHandlers = {
	register: Handler<{}, RegisterUserRequest, {}, UserResponse>;
	login: Handler<{}, LoginRequest, {}, UserResponse>;
};

export function createAuthHandlers(userService: UserService): AuthHandlers {
	return {
		async register(request, response) {
			try {
				const result: UserResponse = await userService.register(request.body);
				response.status(201).json(result);
			} catch (error) {
				sendError(response, error);
			}
		},

		async login(request, response) {
			try {
				const result: UserResponse = await userService.login(request.body);
				response.json(result);
			} catch (error) {
				sendError(response, error);
			}
		},
	};
}
