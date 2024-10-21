import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import admin from "firebase-admin";
import express from "express";

dotenv.config();

const serviceAccount = require("../../service.json");
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

export const postgreConfig = {
	user: process.env.Postgre_Username,
	password: process.env.Postgre_Password,
	host: process.env.Postgre_Host,
	post: process.env.Postgre_Port,
	database: process.env.Postgre_Database,
};

export const serverPort = process.env.PORT || 3000;
export const expressApp = express();
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAdminApp = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});
