import { Request, Response } from "express";
import {
	Auth,
	createUserWithEmailAndPassword,
	sendEmailVerification,
	signInWithEmailAndPassword,
	signOut,
	User,
} from "firebase/auth";
import { Logger } from "../Utilities";
import Configuration from "../Config";

const auth: Auth = Configuration.fbAuth;
const logger: Logger = new Logger("FirebaseAuthController");

export default class FirebaseAuthController {
	static async registerUser(req: Request, res: Response): Promise<void> {
		const { email, password } = req.body;
		try {
			// const userCredential = await createUserWithEmailAndPassword()
			await createUserWithEmailAndPassword(auth, email, password);
			await sendEmailVerification(auth.currentUser as User);
			logger.logInfo("Registration successfull");
			res.status(201).json({
				message: "Verification email sent! User created successfully!",
			});
		} catch (error: any) {
			logger.logError(error.code);
			const authError = error.customData._tokenResponse.error;
			res.status(authError.code).json({ error: authError.message });
		}
	}

	static async loginUser(req: Request, res: Response) {
		const { email, password } = req.body;
		try {
			const userCredential: any = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const idToken = userCredential._tokenResponse.idToken;
			if (!idToken)
				throw {
					customData: {
						_tokenResponse: {
							error: { code: 500, message: "Internal server error" },
						},
					},
				};
			logger.logInfo("Login successfull");
			res.cookie("access_token", idToken, {
				httpOnly: true,
			});
			res
				.status(200)
				.json({ message: "User logged in successfully", userCredential });
		} catch (error: any) {
			logger.logError(error);
			const authError = error.customData._tokenResponse.error;
			res.status(authError.code).json({ error: authError.message });
		} finally {
		}
	}

	static async logoutUser(req: Request, res: Response) {
		try {
			await signOut(auth);
			logger.logInfo("Logout successfull");
			res.clearCookie("access_token");
			res.status(200).json({ message: "User logged out successfully" });
		} catch (error: any) {
			logger.logError(error);
			const authError = error.customData._tokenResponse.error;
			res.status(authError.code).json({ error: authError.message });
		}
	}
}
