import { Request, Response } from "express";
import {
	Auth,
	createUserWithEmailAndPassword,
	getAuth,
	sendEmailVerification,
	signInWithEmailAndPassword,
	signOut,
	User,
} from "firebase/auth";
import { firebaseApp } from "../Config";
import { Logger } from "../Utilities";

const auth: Auth = getAuth(firebaseApp);

class FirebaseAuthController {
	logger: Logger = new Logger("FirebaseAuthController");

	registerUser(req: Request, res: Response): void {
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(422).json({
				email: "Email is required",
				password: "Password is required",
			});
			return;
		}

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				sendEmailVerification(auth.currentUser as User)
					.then(() => {
						res.status(201).json({
							message: "Verification email sent! User created successfully!",
						});
					})
					.catch((error) => {
						this.logger.logError(error);
						res.status(500).json({ error: "Error sending email verification" });
					});
			})
			.catch((error) => {
				const errorMessage =
					error.message || "An error occurred while registering user";
				res.status(500).json({ error: errorMessage });
			});
	}

	loginUser(req: Request, res: Response) {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(422).json({
				email: "Email is required",
				password: "Password is required",
			});
		}
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential: any) => {
				const idToken = userCredential._tokenResponse.idToken;
				if (idToken) {
					res.cookie("access_token", idToken, {
						httpOnly: true,
					});
					res
						.status(200)
						.json({ message: "User logged in successfully", userCredential });
				} else {
					res.status(500).json({ error: "Internal Server Error" });
				}
			})
			.catch((error) => {
				this.logger.logError(error);
				const errorMessage =
					error.message || "An error occurred while logging in";
				res.status(500).json({ error: errorMessage });
			});
	}

	logoutUser(req: Request, res: Response) {
		signOut(auth)
			.then(() => {
				res.clearCookie("access_token");
				res.status(200).json({ message: "User logged out successfully" });
			})
			.catch((error) => {
				this.logger.logError(error);
				res.status(500).json({ error: "Internal Server Error" });
			});
	}
}

export const AuthController = new FirebaseAuthController();