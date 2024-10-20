import { NextFunction, Request, Response } from "express";

export async function authenticateRequest(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
}
