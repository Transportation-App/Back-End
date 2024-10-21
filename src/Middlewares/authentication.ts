import { Request, Response, NextFunction } from "express";
import { firebaseAdminApp } from "../Config";
import { Logger } from "../Utilities";

const logger: Logger = new Logger("Authentication");

export async function verifyToken(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const idToken = req.cookies.access_token;
	if (!idToken) {
		res.status(400).json({ error: "No token provided" });
		return;
	}
	try {
		const decodedToken = await firebaseAdminApp.auth().verifyIdToken(idToken);
		res.locals.user = decodedToken;
		next();
	} catch (error: any) {
		logger.logError(
			"Error verifying token [%s]: %s",
			error.code,
			error.message
		);
		res.status(403).json({ error: "Unauthorized" });
	}
}
