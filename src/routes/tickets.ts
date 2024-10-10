import express, { Router, Request, Response } from "express";
import { get } from "../services/tickets";
import { TicketType } from "../types/types";
import ConfigureApp from "../config/config";
import bodyParser from "body-parser";
import Stripe from "stripe";

const ticketsRouter: Router = express.Router();
const { stripe } = ConfigureApp();

// Use JSON body parser for non-webhook routes
ticketsRouter.use(bodyParser.raw({ type: "*/*" }));

// Example get route
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

// Create Payment Intent
ticketsRouter.post(
  "/create-payment-intent",
  async (req: Request, res: Response) => {
    const { amount } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: "Your Product Name",
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "http://192.168.2.5:3000/checkout",
        cancel_url: "http://192.168.2.5:3000/checkout",
      });
      res.json({ url: session.url });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

// Webhook route - must use raw body parser
ticketsRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }), // Raw body for Stripe verification
  (request: Request, response: Response) => {
    const payload = request.body;
    const payloadString = JSON.stringify(payload, null, 2);
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: process.env.STRIPE_WEBHOOK_SECRET || "no key",
    });

    let event: Stripe.Event;

    try {
      // Verify event from Stripe
      event = stripe.webhooks.constructEvent(
        payloadString,
        header,
        process.env.STRIPE_WEBHOOK_SECRET || "no key"
      );
      console.log("✅ Webhook verified successfully:", event.type);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      return response.status(400).send(`Webhook Error: ${err}`);
    }

    // Handle Stripe events
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("✅ PaymentIntent succeeded:", paymentIntent);
        break;
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("✅ Checkout Session completed:", session);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Acknowledge receipt of the event
    response.status(200).send();
  }
);

export default ticketsRouter;
