import { Request, Response } from "express";
import { Models, Utils } from "../Database/Postgre/Models";

export async function Get(req: Request, res: Response): Promise<void> {
	const isFull = req.params.full === "full";
	if (isFull) res.json(await Models.Itinerary.findAll(Utils.fullObjectOption));
	else {
		if (req.params.full === undefined)
			res.json(await Models.Itinerary.findAll());
		else res.status(404).send();
	}
}

export async function Post(req: Request, res: Response): Promise<void> {}

export async function Patch(req: Request, res: Response): Promise<void> {}

export async function Delete(req: Request, res: Response): Promise<void> {}
