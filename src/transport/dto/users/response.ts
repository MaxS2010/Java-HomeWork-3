import type { User } from "../../../domain/user/entity.js";

export type UserResponse = Omit<User, "password">;
