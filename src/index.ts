import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Cities, Itineraries } from "./Routes";
import { Authentication, Validation } from "./Middlewares";
import { expressApp, serverPort } from "./Config";
import { FirebaseAuth } from "./Authentication";

const base_api_url = "/api";
const base_auth_url = "/auth";

// Middlewares
// Configuration
expressApp.use(
	cors(),
	express.json(),
	express.urlencoded({ extended: true }),
	cookieParser()
);

// Authentication
expressApp.use(base_api_url + "/*", Authentication.verifyToken);

// Validation
expressApp.get(base_api_url + "/*", Validation.checkUrlQueryExists);
expressApp.post(base_api_url + "/*", Validation.checkRequestBodyExists);
expressApp.patch(base_api_url + "/*", Validation.checkRequestBodyExists);
expressApp.delete(base_api_url + "/*", Validation.checkRequestBodyExists);

// Initialization
expressApp.use(base_api_url + "/cities", Cities.setTable);
expressApp.use(base_api_url + "/itineraries", Itineraries.setTable);

// Endpoints
// Login
expressApp.post(
	base_auth_url + "/register",
	FirebaseAuth.AuthController.registerUser
);
expressApp.post(
	base_auth_url + "/login",
	FirebaseAuth.AuthController.loginUser
);
expressApp.post(
	base_auth_url + "/logout",
	FirebaseAuth.AuthController.logoutUser
);

// Cities
expressApp.get(base_api_url + "/cities", Cities.Get);
expressApp.post(base_api_url + "/cities", Cities.Post);
expressApp.patch(base_api_url + "/cities", Cities.Patch);
expressApp.delete(base_api_url + "/cities", Cities.Delete);

// Itineraries
expressApp.get(base_api_url + "/itineraries", Itineraries.Get);
expressApp.post(base_api_url + "/itineraries", Itineraries.Post);
expressApp.patch(base_api_url + "/itineraries", Itineraries.Patch);
expressApp.delete(base_api_url + "/itineraries", Itineraries.Delete);

// Listeners
expressApp.listen(serverPort, () => {
	console.log(`[server]: Server is running at http://localhost:${serverPort}`);
});
