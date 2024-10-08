import express from "express";
import dotenv from "dotenv";
import DBConnector from "../database/index";
import cors from "cors";
import Stripe from "stripe";

function ConfigureApp() {
  // Initialize .env files
  dotenv.config();

  // Initialize database
  const dbConnector = new DBConnector();

  // Initialize Express
  const app = express();
  app.use(express.json());

  app.use(
    cors({
      origin: "*", // Allow requests from all origins, or specify specific origins
      methods: ["GET", "POST", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"], // Allow Content-Type header
    })
  );
  // Initialize Stripe
  const stripe = new Stripe(process.env.Stripe_sec_key || "no key", {
    apiVersion: "2024-09-30.acacia",
  });

  return { app, dbConnector, stripe };
}

export default ConfigureApp;
