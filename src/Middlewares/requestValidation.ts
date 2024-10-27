import { NextFunction, Request, Response } from "express";

export function checkRequestBodyExists(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	if (Object.keys(req.body).length === 0)
		res.status(404).send("No request body");
	else next();
}

export function checkUrlQueryExists(
	req: Request,
	res: Response,
	next: NextFunction
): void {
    if(Object.keys(req.query).length === 0)
        res.status(400).send("No query parameters");
    else next();
}
