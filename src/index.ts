import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
var routesVersioning = require("express-routes-versioning")();
const port = process.env.PORT || 3000;

// Endpoint - get itineraries' list
app.get(
	"/itineraries",
	routesVersioning({
		"1.0.0": itinerariesV1,
        "2.0.0": itinerariesV2
	})
);

function itinerariesV1(req: Request, res: Response, next: NextFunction) {
    console.log(req.header("accept-version"));
	res.status(200).send("ok v1");
}

function itinerariesV2(req: Request, res: Response, next: NextFunction) {
    console.log(req.header("accept-version"));
	res.status(200).send("ok v2");
}

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
