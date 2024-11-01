import { NextFunction, Request, Response, Router } from "express";
import { Models, Utils } from "../Databases/Postgres/Models";
import { Validation } from "../Middlewares";

const itinerariesRouter: Router = Router();

itinerariesRouter.get(
	"/:full?",
	(req: Request, res: Response, next: NextFunction) => {
		const full = req.params.full;
		if (full == "full" || !full) next();
		else res.status(404).send("Cannot GET " + req.baseUrl + req.url);
	},
	async (req: Request, res: Response) => {
		const full = req.params.full;
		if (full) res.json(await Models.Itinerary.findAll(Utils.fullObjectOption));
		else res.json(await Models.Itinerary.findAll());
	}
);

itinerariesRouter.post(
	"/",
	Validation.checkRequestBodyExists,
	async (req: Request, res: Response) => {}
);

itinerariesRouter.patch(
	"/",
	Validation.checkRequestBodyExists,
	async (req: Request, res: Response) => {}
);

itinerariesRouter.delete(
	"/",
	Validation.checkRequestBodyExists,
	async (req: Request, res: Response) => {}
);

export default itinerariesRouter;
