import { NextFunction, Request, Response } from "express";
import { DatabaseTypes } from "../Types";
import * as SimpleRoute from "./SimpleRoute";

export function setTable(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	res.locals.table = "Cities";
	next();
}
/**
 * Retrieves cities from the database based on query parameters and sends the result in the response.
 * @param {Request} req - The request object, containing query parameters for columns and conditions.
 * @param {Response} res - The response object used to send back the retrieved data or an error.
 * @returns {void} Sends the retrieved data as a response, or a 500 status if an error occurs.
 */
export function Get(req: Request, res: Response): void {
	SimpleRoute.Get(req, (data: DatabaseTypes.CallbackDataType) => {
		if (data) res.status(200).send(data);
		else res.status(500).send();
	});
}
/**
 * Inserts cities into the database based on the request body and sends the result in the response.
 * @param {Request} req - The request object, containing the data to insert and any returning parameters.
 * @param {Response} res - The response object used to send back the inserted data or an error.
 * @returns {void} Sends the inserted data as a response, or a 500 status if an error occurs.
 */
export function Post(req: Request, res: Response): void {
	SimpleRoute.Post(req, (data: DatabaseTypes.CallbackDataType) => {
		if (data) res.status(200).send(data);
		else res.status(500).send();
	});
}
/**
 * Updates cities in the database based on the request body and sends the result in the response.
 * @param {Request} req - The request object, containing the data to update, conditions, and any returning parameters.
 * @param {Response} res - The response object used to send back the updated data or an error.
 * @returns {void} Sends the updated data as a response, or a 500 status if an error occurs.
 */
export function Patch(req: Request, res: Response): void {
	SimpleRoute.Patch(req, (data: DatabaseTypes.CallbackDataType) => {
		if (data) res.status(200).send(data);
		else res.status(500).send();
	});
}
/**
 * Deletes cities from the database based on the request body and sends the result in the response.
 * @param {Request} req - The request object, containing the conditions for deletion and any returning parameters.
 * @param {Response} res - The response object used to send back the result of the deletion or an error.
 * @returns {void} Sends the deletion result as a response, or a 500 status if an error occurs.
 */
export function Delete(req: Request, res: Response): void {
	SimpleRoute.Delete(req, (data: DatabaseTypes.CallbackDataType) => {
		if (data) res.status(200).send(data);
		else res.status(500).send();
	});
}
