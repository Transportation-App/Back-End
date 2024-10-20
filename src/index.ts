import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Cities, Itineraries } from "./Routes";
import { Authentication, Validation } from "./Middlewares";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;
const base_url = "/api";

// Middlewares
// Configuration
app.use(cors(), express.json(), express.urlencoded({ extended: true }));

// Authentication
app.use(Authentication.authenticateRequest);

// Validation
app.get("*", Validation.checkUrlQueryExists);
app.post("*", Validation.checkRequestBodyExists);
app.patch("*", Validation.checkRequestBodyExists);
app.delete("*", Validation.checkRequestBodyExists);

// Initialization
app.use(base_url + "/cities", Cities.setTable);
app.use(base_url + "/itineraries", Itineraries.setTable);

// Endpoints
// Cities
app.get(base_url + "/cities", Cities.Get);
app.post(base_url + "/cities", Cities.Post);
app.patch(base_url + "/cities", Cities.Patch);
app.delete(base_url + "/cities", Cities.Delete);

// Itineraries
app.get(base_url + "/itineraries", Itineraries.Get);
app.post(base_url + "/itineraries", Itineraries.Post);
app.patch(base_url + "/itineraries", Itineraries.Patch);
app.delete(base_url + "/itineraries", Itineraries.Delete);

// Listeners
app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
