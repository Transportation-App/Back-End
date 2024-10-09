import { Request, Response } from "express";
import { postgreConnector } from "../Database";

function postCities(req: Request, res: Response) {
	postgreConnector.fromCities(
		req.body.columns,
		req.body.where,
		(data: any[]) => {
			res.send(data);
		}
	);
}

export { postCities };
