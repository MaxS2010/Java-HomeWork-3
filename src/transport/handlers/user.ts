import type { RequestHandler } from "express";
import type { UserService } from "../../services/user/types.js";
import type { UserIdParams } from "../dto/users/requests.js";
import type { UserResponse } from "../dto/users/response.js";
import type { ErrorResponse } from "../dto/errors.js";
import { parseId, sendError } from "./http.js";

export function createUserHandlers(userService: UserService) {
	const getById: RequestHandler = async (request, response) => {
		try {
			const params: UserIdParams = { id: request.params.id };
			const user: UserResponse | undefined = await userService.getUserById(parseId(params.id));
			if (!user) {
				const body: ErrorResponse = { error: "User not found" };
				response.status(404).json(body);
				return;
			}
			response.json(user);
		} catch (error) {
			sendError(response, error);
		}
	};

	return { getById };
}
