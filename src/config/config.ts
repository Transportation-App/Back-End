import express from "express";
import dotenv from "dotenv";
import DBConnector from "../database/index";

function ConfigureApp() {
  // Initialize .env files
  dotenv.config();

  // Initialize database
  const dbConnector = new DBConnector();

  // Initialize Express
  const app = express();

  return { app, dbConnector };
}

export default ConfigureApp;
