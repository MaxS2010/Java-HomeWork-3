import type { UserService } from "../../services/user/types.js";
import type { UserIdParams } from "../dto/users/requests.js";
import type { UserResponse } from "../dto/users/response.js";
import type { ErrorResponse } from "../dto/errors.js";
import { parseId, sendError } from "./http.js";
import type { Handler } from "./types.js";

export type UserHandlers = {
	getById: Handler<UserIdParams, {}, {}, UserResponse | ErrorResponse>;
};

export function createUserHandlers(userService: UserService): UserHandlers {
	return {
		async getById(request, response) {
			try {
				const user: UserResponse | undefined = await userService.getUserById(parseId(request.params.id));
				if (!user) {
					const body: ErrorResponse = { error: "User not found" };
					response.status(404).json(body);
					return;
				}
				response.json(user);
			} catch (error) {
				sendError(response, error);
			}
		},
	};
}
