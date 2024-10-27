import express from "express";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import cors from "cors";
import Stripe from "stripe";
import http from "http";
import { Server as WebSocketServer } from "ws";
import { FirebaseConnector, PostgreConnector } from "../Database";

// Initialize .env files
dotenvExpand.expand(dotenv.config());

// Initialize database
const fbConnector = new FirebaseConnector();
const postgresConnector = new PostgreConnector();

// Initialize Express
const app = express();
app.use(
  cors({
    origin: "*", // Allow requests from all origins, or specify specific origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"], // Allow Content-Type header
  }),
  express.json(),
  express.urlencoded({ extended: true })
);

const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });

// Initialize Stripe
const stripe = new Stripe(process.env.Stripe_sec_key || "no key", {
  apiVersion: "2024-09-30.acacia",
});

export default {
  app,
  server,
  wsServer,
  fbConnector,
  postgresConnector,
  stripe,
};
