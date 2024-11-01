import { NextFunction, Request, Response, Router } from "express";
import { Models, Utils } from "../Database/Postgres/Models";
import { Validation } from "../Middlewares";

const citiesRouter: Router = Router();

citiesRouter.get(
	"/:full?",
	(req: Request, res: Response, next: NextFunction) => {
		const full = req.params.full;
		if (full == "full" || !full) next();
		else res.status(404).send("Cannot GET " + req.baseUrl + req.url);
	},
	async (req: Request, res: Response) => {
		const full = req.params.full;
		if (full) res.json(await Models.City.findAll(Utils.fullObjectOption));
		else res.json(await Models.City.findAll());
	}
);

citiesRouter.post(
	"/",
	Validation.checkRequestBodyExists,
	async (req: Request, res: Response) => {}
);
citiesRouter.patch(
	"/",
	Validation.checkRequestBodyExists,
	async (req: Request, res: Response) => {}
);
citiesRouter.delete(
	"/",
	Validation.checkRequestBodyExists,
	async (req: Request, res: Response) => {}
);

export default citiesRouter;
