import express from "express";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import cors from "cors";
import Stripe from "stripe";
import http from "http";
import { Server as WebSocketServer } from "ws";
import { FirebaseApp, initializeApp } from "firebase/app";
import admin from "firebase-admin";
import cookieParser from "cookie-parser";
import { FirebaseConnector, PostgreConnector } from "../Database";
import { FirebaseAuthController } from "../Authentication";
import { Auth, getAuth } from "firebase/auth";

// Initialize .env files
dotenvExpand.expand(dotenv.config());

// Initialize database
// Initialize Firebase and Database
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
const serviceAccount: any = {
	type: process.env.FireBase_Auth_Type,
	project_id: process.env.FireBase_Auth_Project_Id,
	private_key_id: process.env.FireBase_Auth_Private_Key_Id,
	private_key: process.env.FireBase_Auth_Private_Key,
	client_email: process.env.FireBase_Auth_Client_Email,
	client_id: process.env.FireBase_Auth_Client_Id,
	auth_uri: process.env.FireBase_Auth_Auth_Uri,
	token_uri: process.env.FireBase_Auth_Token_Uri,
	auth_provider_x509_cert_url:
		process.env.FireBase_Auth_Auth_Provider_x509_Cert_Url,
	client_x509_cert_url: process.env.FireBase_Auth_Client_x509_Cert_Url,
	universe_domain: process.env.FireBase_Auth_Universe_Domain,
};
// Initialize Firebase
const fireBase: FirebaseApp = initializeApp(firebaseConfig);
const fireBaseAdmin = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});
// Initialize Firebase Realtime
const fbConnector = new FirebaseConnector();
// Initialize Firebase Auth
const fbAuth: Auth = getAuth(fireBase);
// Initialize PostgreSQL
const pgConnector = new PostgreConnector();

// Initialize Express
const app = express();
app.use(
	cors({
		origin: "*", // Allow requests from all origins, or specify specific origins
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"], // Allow Content-Type header
	}),
	express.json(),
	express.urlencoded({ extended: true }),
	cookieParser()
);

const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });

// Initialize Stripe
const stripe = new Stripe(process.env.Stripe_sec_key || "no key", {
	apiVersion: "2024-09-30.acacia",
});

export {
	app,
	server,
	wsServer,
	fireBase,
	fireBaseAdmin,
	fbAuth,
	fbConnector,
	pgConnector,
	stripe,
};
