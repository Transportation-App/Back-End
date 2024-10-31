import { Request, Response, NextFunction } from "express";
import { Logger } from "../Utilities";
import Configuration from "../Config";

const logger: Logger = new Logger("Authentication");

export async function verifyToken(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const idToken = req.cookies.access_token;
	try {
		res.locals.user = await Configuration.fireBaseAdmin
			.auth()
			.verifyIdToken(idToken);
		next();
	} catch (error: any) {
		const { errorInfo } = error;
		logger.logError(
			"Error verifying token [%s]: %s",
			errorInfo.code,
			errorInfo.message
		);
		if (!idToken) res.status(400).json({ error: "No token provided" });
		else res.status(403).json({ error: "Unauthorized" });
	}
}
