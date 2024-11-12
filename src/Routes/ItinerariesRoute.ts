import { NextFunction, Request, Response, Router } from "express";
import { Models, Utils } from "../Database/Postgres/Models";
import { Validation } from "../Middlewares";

const itinerariesRouter: Router = Router();

itinerariesRouter.get(
    "/:full?",
    async (req: Request, res: Response, next: NextFunction) => {
        const full = req.params.full;

        try {
            const itineraries = full
                ? await Models.Itinerary.findAll(Utils.fullObjectOption)  // Fetches itineraries with full data (foreign keys)
                : await Models.Itinerary.findAll();  // Fetches itineraries without additional related data
            
			// Log the data before sending it
			// console.log('Data sent from backend:', JSON.stringify(itineraries, null, 2));
			
            res.json(itineraries);
        } catch (error) {
            console.error("Error fetching itineraries:", error);
            res.status(500).json({ error: "Failed to fetch itineraries" });
        }
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
