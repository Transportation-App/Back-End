import express, { Router, Request, Response } from "express";
import { getBus, getMapCoords, updateSeats } from "../Services/TicketsService";
import { TicketType } from "../Types/types";

const ticketsRouter: Router = express.Router();

ticketsRouter.post("/get", async (req: Request, res: Response) => {
  try {
    const ticketId: string = req.body.id;
    const retrievedData: TicketType | null = await getBus(ticketId);

    if (retrievedData) {
      res.status(200).json(retrievedData);
    } else {
      res.status(404).json({ message: "Ticket not found" });
    }
  } catch (error) {
    console.error("Error retrieving ticket:", error);
    res.status(500).json({ message: "There is no itinerary with this id!" });
  }
});

ticketsRouter.put("/put", async (req: Request, res: Response) => {
  try {
    const {
      itinID,
      selectedSeats,
      lockType,
    }: {
      itinID: string;
      selectedSeats: number[];
      lockType: string;
    } = req.body;

    const response: { updated: boolean } | null = await updateSeats(
      itinID,
      selectedSeats,
      lockType
    );

    if (response) {
      res.status(200).json({
        success: true,
        message:
          "Your seats were succesfully booked temporarily for 8 minutes untill the payment is done!",
        data: response,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "something went wrong!" });
    }
  } catch (error) {
    console.error("Error retrieving ticket:", error);
    res.status(500).json({ message: "There is no itinerary with this id!" });
  }
});

ticketsRouter.post("/getCoords", async (req: Request, res: Response) => {
  const { deptCity, arrCity }: { deptCity: string; arrCity: string } = req.body;

  try {
    const response = await getMapCoords(deptCity, arrCity);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
  }
});

export default ticketsRouter;
