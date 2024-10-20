import { NextFunction, Request, Response } from "express";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
	Auth,
	getAuth,
	signInWithEmailAndPassword,
	UserCredential,
} from "firebase/auth";

const firebaseConfig = {
	apiKey: process.env.FireBase_apiKey,
	authDomain: process.env.FireBase_authDomain,
	databaseURL: process.env.FireBase_databaseURL,
	projectId: process.env.FireBase_projectId,
	storageBucket: process.env.FireBase_storageBucket,
	messagingSenderId: process.env.FireBase_messagingSenderId,
	appId: process.env.FireBase_appId,
	measurementId: process.env.FireBase_mesurementId,
};
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

export async function authenticateRequest(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const email = req.header("user-email") as string;
	const password = req.header("user-password") as string;
	try {
		const userCredential: UserCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		console.log(userCredential.user.uid);
		next();
	} catch (error) {
		res.status(400).send(error);
	}
}
