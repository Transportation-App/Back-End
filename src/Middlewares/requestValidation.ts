import { NextFunction, Request, Response } from "express";
import { Logger } from "../Utilities";

const logger: Logger = new Logger("RequestValidation");

export function checkRequestBodyExists(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	if (Object.keys(req.body).length === 0) {
		logger.logError("No request body");
		res.status(400).json({ error: "Bad Request" });
	} else next();
}

export function checkUrlQueryExists(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	if (Object.keys(req.query).length === 0) {
		logger.logError("No query parameters");
		res.status(400).json({ error: "Bad Request" });
	} else next();
}

export function checkCredentialsExists(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	if (!req.body.email || !req.body.password) {
		logger.logError("Undefined credentials");
		res.status(400).json({ error: "Undefined credentials" });
	} else {
		next();
	}
}
