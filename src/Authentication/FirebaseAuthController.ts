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

// const auth: Auth = Configuration.fbAuth;
// const logger: Logger = new Logger("FirebaseAuthController");

export default class FirebaseAuthController {
	private static controller: FirebaseAuthController;
	private auth: Auth;
	private logger: Logger;

	private constructor(auth: Auth) {
		this.auth = auth;
		this.logger = new Logger("FirebaseAuthController");
		this.logger.logWarning("created");
	}

	public static getInstance(auth: Auth) {
		return (
			this.controller ?? (this.controller = new FirebaseAuthController(auth))
		);
	}

	public async registerUser(req: Request, res: Response): Promise<void> {
		const { email, password } = req.body;
		try {
			// const userCredential = await createUserWithEmailAndPassword()
			await createUserWithEmailAndPassword(this.auth, email, password);
			await sendEmailVerification(this.auth.currentUser as User);
			this.logger.logInfo("Registration successfull");
			res.status(201).json({
				message: "Verification email sent! User created successfully!",
			});
		} catch (error: any) {
			this.logger.logError(error.code);
			const authError = error.customData._tokenResponse.error;
			res.status(authError.code).json({ error: authError.message });
		}
	}

	public async loginUser(req: Request, res: Response) {
		const { email, password } = req.body;
		try {
			const userCredential: any = await signInWithEmailAndPassword(
				this.auth,
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
			this.logger.logInfo("Login successfull");
			res.cookie("access_token", idToken, {
				httpOnly: true,
			});
			res
				.status(200)
				.json({ message: "User logged in successfully", userCredential });
		} catch (error: any) {
			this.logger.logError(error);
			const authError = error.customData._tokenResponse.error;
			res.status(authError.code).json({ error: authError.message });
		} finally {
		}
	}

	public async logoutUser(req: Request, res: Response) {
		try {
			await signOut(this.auth);
			this.logger.logInfo("Logout successfull");
			res.clearCookie("access_token");
			res.status(200).json({ message: "User logged out successfully" });
		} catch (error: any) {
			this.logger.logError(error);
			const authError = error.customData._tokenResponse.error;
			res.status(authError.code).json({ error: authError.message });
		}
	}
}
