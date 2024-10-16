import express from "express";
import dotenv from "dotenv";
import DBConnector from "../database/index";
import cors from "cors";
import Stripe from "stripe";
import http from 'http';
import WebSocket, { Server as WebSocketServer } from 'ws';

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
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"], // Allow Content-Type header
    })
  );

  const server = http.createServer(app);
  const wsServer = new WebSocketServer({ server });

  // Initialize Stripe
  const stripe = new Stripe(process.env.Stripe_sec_key || "no key", {
    apiVersion: "2024-09-30.acacia",
  });

  return { app, server, wsServer, dbConnector, stripe };
}

export default ConfigureApp;
