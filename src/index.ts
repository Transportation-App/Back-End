import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { postCities } from "./Routes/cities";
import { checkRequestBody } from "./Middlewares/requestbody";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

// configuration
app.use(
	cors(),
	express.json(),
	express.urlencoded({ extended: true })
);

// Middlewares
app.use(checkRequestBody);

// Endpoints
app.post("/read/cities", postCities);

// Listeners
app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
