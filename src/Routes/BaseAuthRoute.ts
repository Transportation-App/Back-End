import { Router } from "express";
import { Validation } from "../Middlewares";
import Configuration from "../Config";

const { fbAuthController } = Configuration;
const baseAuthRouter: Router = Router();

baseAuthRouter.post(
	"/register",
	Validation.checkCredentialsExists,
	fbAuthController.registerUser
);
baseAuthRouter.post(
	"/login",
	Validation.checkCredentialsExists,
	fbAuthController.loginUser
);
baseAuthRouter.post("/logout", fbAuthController.logoutUser);

export default baseAuthRouter;
