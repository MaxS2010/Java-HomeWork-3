import type { Response } from "express";
import { ServiceError } from "../../services/errors.js";
import type { ErrorResponse } from "../dto/errors.js";

export function parseId(value: string | string[] | undefined): number {
    if (typeof value !== "string" || !/^\d+$/.test(value) || Number(value) < 1) {
        throw new ServiceError("ID must be a positive integer", 400);
    }
    return Number(value);
}

export function sendError(response: Response, error: unknown): void {
    if (error instanceof ServiceError) {
        const body: ErrorResponse = { error: error.message };
        response.status(error.statusCode).json(body);
        return;
    }
    console.error(error);
    const body: ErrorResponse = { error: "Internal server error" };
    response.status(500).json(body);
}