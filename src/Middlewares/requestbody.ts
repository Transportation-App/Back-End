import { NextFunction, Request, Response } from "express";

function checkRequestBody(req: Request, res: Response, next: NextFunction) {
	if (Object.keys(req.body).length === 0)
		res.status(404).send("No request body");
	else next();
}

export { checkRequestBody };
