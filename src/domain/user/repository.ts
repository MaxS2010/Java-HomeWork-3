import type { User, CreateUser } from './entity.js';

export interface Repository{
    getAll(): Promise<User[]>;
    getById(id: number): Promise<User | undefined>;
    getByEmail(email: string): Promise<User | undefined>;
    create(user: CreateUser): Promise<User>;
}

export class EmailConflictError extends Error {}