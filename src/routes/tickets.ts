import express, { Router } from "express";
import { Request, Response } from "express";
import { get } from "../services/tickets";
import { TicketType } from "../types/types";

const ticketsRouter: Router = express.Router();

ticketsRouter.post("/get", async (req: Request, res: Response) => {
  try {
    const ticketId: string = req.body.id;
    const retrievedData: TicketType | null = await get(ticketId);

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

ticketsRouter.put("/put", (req: Request, res: Response) => {});

export default ticketsRouter;
