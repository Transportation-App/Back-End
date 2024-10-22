import express, { Request, Response, Router } from "express";
import { HomeService } from "../services/homeService";

const homeRouter: Router = express.Router();

homeRouter.post("/get", async (req: Request, res: Response) => {
  try {
    const stations = await HomeService.getStations(); // Fetch stations from the service
    console.log("Stations fetched:", stations); // Log the data fetched from Firebase
    res.status(200).json(stations); // Return stations as the response
  } catch (error) {
    console.error("Error fetching stations:", error); // Log any errors
    res.status(500).json({ message: "Error fetching stations" });
  }
});


export default homeRouter;
