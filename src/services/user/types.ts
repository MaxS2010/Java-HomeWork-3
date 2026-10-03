import type { User } from "../../domain/user/entity.js";

export type PublicUser = Omit<User, "password">;

export interface UserService{
    getUserById(id: number): Promise<PublicUser | undefined>;
    register(user: unknown): Promise<PublicUser>;
    login(credentials: unknown): Promise<PublicUser>;
}