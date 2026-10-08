export interface User {
    id: number;
    email: string;
    username?: string | null;
    name: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateUser = Omit<User, "id" | "createdAt" | "updatedAt">;