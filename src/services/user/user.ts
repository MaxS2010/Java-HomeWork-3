import type { Repository } from "../../domain/user/repository.js";
import { EmailConflictError } from "../../domain/user/repository.js";
import { ServiceError } from "../errors.js";
import type { PublicUser, UserService } from "./types.js";

function toPublicUser(user: { id: number; name: string; email: string; createdAt: string; updatedAt: string }): PublicUser {
	return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
}

export function createUserService(userRepository: Repository): UserService {
	return {
		async getUserById(id) {
			const user = await userRepository.getById(id);
			return user ? toPublicUser(user) : undefined;
		},

		async register(input) {
			if (!input || typeof input !== "object") {
				throw new ServiceError("Request body must be an object", 400);
			}
			const data = input as Record<string, unknown>;
			if (typeof data.name !== "string" || !data.name.trim()
				|| typeof data.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
				|| typeof data.password !== "string" || !data.password) {
				throw new ServiceError("Valid name, email, and password are required", 400);
			}

			try {
				const user = await userRepository.create({
					name: data.name.trim(),
					email: data.email.trim().toLowerCase(),
					password: data.password,
				});
				return toPublicUser(user);
			} catch (error) {
				if (error instanceof EmailConflictError) {
					throw new ServiceError("Email is already registered", 409);
				}
				throw error;
			}
		},

		async login(input) {
			if (!input || typeof input !== "object") {
				throw new ServiceError("Request body must be an object", 400);
			}
			const data = input as Record<string, unknown>;
			if (typeof data.email !== "string" || typeof data.password !== "string") {
				throw new ServiceError("Email and password are required", 400);
			}
			const user = await userRepository.getByEmail(data.email.trim().toLowerCase());
			if (!user || user.password !== data.password) {
				throw new ServiceError("Invalid email or password", 401);
			}
			return toPublicUser(user);
		},
	};
}