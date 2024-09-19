import express from "express";
import { NextFunction, Request, Response } from "express";
import ConfigureApp from "./config/config";
import ticketsRouter from "./routes/tickets";
import cors from "cors";

const { app } = ConfigureApp();

var routesVersioning = require("express-routes-versioning")();
const port = process.env.PORT;

app.use(express.json());

app.use(
  cors({
    origin: "*", // Allow requests from all origins, or specify specific origins
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allow Content-Type header
  })
);

app.use("/tickets", ticketsRouter);

// Endpoint - get itineraries' list
// app.get(
//   "/itineraries",
//   routesVersioning({
//     "1.0.0": itinerariesV1,
//     "2.0.0": itinerariesV2,
//   })
// );

// function itinerariesV1(req: Request, res: Response, next: NextFunction) {
//   console.log(req.header("accept-version"));
//   res.status(200).send("ok v1");
// }

// function itinerariesV2(req: Request, res: Response, next: NextFunction) {
//   console.log(req.header("accept-version"));
//   res.status(200).send("ok v2");
// }

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
