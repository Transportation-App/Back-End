import { Request } from "express";
import { PostgreConnector } from "../Database";
import { DatabasesTypes } from "../Types";

export function Get(req: Request, callback: DatabasesTypes.CallbackType): void {
	PostgreConnector.makeSelectQuery({
		table: req.res?.locals.table,
		columns: req.query.columns as string,
		where: req.query.where as string | undefined,
		callback: callback,
	});
}
export function Post(
	req: Request,
	callback: DatabasesTypes.CallbackType
): void {
	PostgreConnector.makeInsertQuery({
		table: req.res?.locals.table,
		insertMapList: JSON.parse(req.body.map),
		returning: req.body.returning,
		callback: callback,
	});
}
export function Patch(
	req: Request,
	callback: DatabasesTypes.CallbackType
): void {
	PostgreConnector.makeUpdateQuery({
		table: req.res?.locals.table,
		updateMapList: JSON.parse(req.body.map),
		where: req.body.where,
		returning: req.body.returning,
		callback: callback,
	});
}
export function Delete(
	req: Request,
	callback: DatabasesTypes.CallbackType
): void {
	PostgreConnector.makeDeleteQuery({
		table: req.res?.locals.table,
		where: req.body.where,
		returning: req.body.returning,
		callback: callback,
	});
}
