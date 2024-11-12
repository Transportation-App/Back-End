import { Router } from "express";
import citiesRouter from "./CitiesRoute";
import itinerariesRouter from "./ItinerariesRoute";
import ticketsRouter from "./TicketsRoute";
import { Authentication } from "../Middlewares";

const baseApiRouter: Router = Router();

// baseApiRouter.use(Authentication.verifyToken);

// Cities
baseApiRouter.use("/cities", citiesRouter);
// Itineraries
baseApiRouter.use("/itineraries", itinerariesRouter);
// Tickets
baseApiRouter.use("/tickets", ticketsRouter);

export default baseApiRouter;
