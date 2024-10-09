import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PostgresConnector } from "./Database";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const postgreDb = new PostgresConnector();

app.use(cors(), express.json(), express.urlencoded({ extended: true }));

// Endpoints

app.post(
	"/read",
	(req, res, next) => {
		if (Object.keys(req.body).length === 0)
			res.status(404).send("No request body");
		else next();
	},
	async (req, res) => {
		const data = await postgreDb.read(req.body.table, req.body.columns);
		res.send(data);
	}
);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
