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
    "/add",
    Validation.checkRequestBodyExists,
    async (req: Request, res: Response) => {
        const {
            DepartureCity,
            ArrivalCity,
            DepartureDate,
            ArrivalDate,
            DepartureTime,
            ArrivalTime,
            Price,
            Stops,
        } = req.body;

        try {
            // Ensure both DepartureCity and ArrivalCity are valid cities by their IDs
            const departureCityExists = await Models.City.findByPk(DepartureCity);
            const arrivalCityExists = await Models.City.findByPk(ArrivalCity);

            if (!departureCityExists || !arrivalCityExists) {
                return res.status(400).json({ error: "Invalid Departure or Arrival City ID" });
            }

            // Create new itinerary record
            const newItinerary = await Models.Itinerary.create({
                DepartureCity,
                ArrivalCity,
                DepartureDate,
                ArrivalDate,
                DepartureTime,
                ArrivalTime,
                Price,
                Stops,
            });

            res.status(201).json(newItinerary);
        } catch (error) {
            console.error("Error creating new itinerary:", error);
            res.status(500).json({ error: "Failed to create itinerary" });
        }
    }
);


itinerariesRouter.patch(
	"/",
	Validation.checkRequestBodyExists,
	async (req: Request, res: Response) => {}
);

itinerariesRouter.delete(
    "/:id",
    async (req: Request, res: Response) => {
        const itineraryId = parseInt(req.params.id, 10);  // Ensure itineraryId is an integer

        if (isNaN(itineraryId)) {
            return res.status(400).json({ error: "Invalid itinerary ID" });
        }

        try {
            const deletedCount = await Models.Itinerary.destroy({
                where: { Id: itineraryId }
            });

            if (deletedCount === 0) {
                return res.status(404).json({ error: "Itinerary not found" });
            }

            res.status(200).json({ message: "Itinerary deleted successfully" });
        } catch (error) {
            console.error("Error deleting itinerary:", error);
            res.status(500).json({ error: "Failed to delete itinerary" });
        }
    }
);


export default itinerariesRouter;
