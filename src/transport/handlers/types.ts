import type { Request, Response } from "express";

// params, body, query, response
export type Handler<P = {}, B = {}, Q = {}, R = unknown> = (
	request: Request<P, R, B, Q>,
	response: Response<R>,
) => Promise<void>;
