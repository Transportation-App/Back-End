import express, { Router, Request, Response } from "express";
import { storeTickets, updateSeats } from "../Services/TicketsService";
import { paymentInfo } from "../Types/types";
import ConfigureApp from "../Config/Config";
import bodyParser from "body-parser";
import Stripe from "stripe";
import { getSessionData, storeInCache } from "../Middlewares/cacheMiddleware";

const stripeRouter: Router = express.Router();
const { stripe } = ConfigureApp;

stripeRouter.use(bodyParser.raw({ type: "*/*" }));

stripeRouter.post(
  "/create-payment-intent",
  async (req: Request<{}, {}, paymentInfo>, res: Response) => {
    const { itinID, totalPrice, formData } = req.body;
    try {
      const session = await stripe.checkout.sessions.create({
        expires_at: Math.floor(Date.now() / 1000) + 1800,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: "Your Product Name",
              },
              unit_amount_decimal: totalPrice.toString(),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `http://192.168.56.1:3000/receipt/{CHECKOUT_SESSION_ID}`,
        cancel_url: "http://192.168.56.1:3000/decline/{CHECKOUT_SESSION_ID}",
      });
      const isStored: boolean = storeInCache<paymentInfo>(session.id, {
        itinID,
        totalPrice,
        formData,
      });

      if (isStored) {
        res.status(200).json({ url: session.url });
      } else {
        res.status(400).json({
          message: "Payment session wasnt stored! Please try again later",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  }
);

stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }), // Raw body for Stripe verification
  async (request: Request, response: Response) => {
    const payload = request.body;
    const payloadString = JSON.stringify(payload, null, 2);
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: process.env.STRIPE_WEBHOOK_SECRET || "no key",
    });

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payloadString,
        header,
        process.env.STRIPE_WEBHOOK_SECRET || "no key"
      );
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err}`);
    }

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;

        const data: { data: paymentInfo | undefined } =
          getSessionData<paymentInfo>(session.id);

        if (data.data) {
          const seats: number[] = Object.keys(data.data.formData).map(
            Number
          ) as number[];

          const response: { updated: boolean } | null = await updateSeats(
            data.data?.itinID as string,
            seats,
            "locked"
          );

          if (response && response.updated) {
            await storeTickets(session.id, data.data);
          }
        }

      default:
        break;
    }

    // response.json({ received: true });
  }
);

export default stripeRouter;
