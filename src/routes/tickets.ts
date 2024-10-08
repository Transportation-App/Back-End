import express, { Router } from "express";
import { Request, Response } from "express";
import { get } from "../services/tickets";
import { TicketType } from "../types/types";
import ConfigureApp from "../config/config";

const ticketsRouter: Router = express.Router();

const { stripe } = ConfigureApp();

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

// ticketsRouter.put("/put", (req: Request, res: Response) => {});

ticketsRouter.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "eur",
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default ticketsRouter;
