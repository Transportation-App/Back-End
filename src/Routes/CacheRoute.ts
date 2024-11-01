import express, { Router, Request, Response } from "express";
import { paymentInfo } from "../Types/types";
import { Cache } from "../Middlewares";

const baseCacheRouter: Router = Router();

baseCacheRouter.use(express.json());

baseCacheRouter.post(
	"/get",
	(
		req: Request<{}, {}, { sessionID: string; getSeats?: boolean }>,
		res: Response
	) => {
		const { sessionID, getSeats } = req.body;

		const data: { id: string; data: paymentInfo | undefined } =
			Cache.getSessionData(sessionID);

		if (data.data) {
			if (getSeats) {
				const seats: string[] = Object.keys(data.data.formData);
				res.status(200).json({ id: data.data.itinID, seats: seats });
			} else {
				const receiptData = { id: data.id, totalPrice: data.data.totalPrice };
				res.status(200).json(receiptData);
			}
		} else {
			res
				.status(400)
				.json({ message: "Data either expired or the weren't found!" });
		}
	}
);

baseCacheRouter.post(
	"/check",
	(req: Request<{}, {}, { sessionID: string }>, res: Response) => {
		const { sessionID } = req.body;

		const isStored: boolean = Cache.checkDataInCache(sessionID);

		if (isStored) {
			res.status(200).json({ isStored: isStored });
		} else {
			res.status(400).json({ message: "Data do not exist!" });
		}
	}
);

export default baseCacheRouter;
