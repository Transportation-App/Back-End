import { Cities, Itineraries } from "./Routes";
import { Authentication, Validation, WebServer } from "./Middlewares";
import Configuration from "./Config";
import cacheRouter from "./Routes/CacheRoute";
import ticketsRouter from "./Routes/TicketsRoute";
import { FirebaseAuthController } from "./Authentication";

const { app, server, wsServer } = Configuration;

const port = process.env.PORT || 3000;
const base_api_url = "/api";
const base_auth_url = "/auth";
WebServer.initWebSocketServer(wsServer);

// Middlewares
// Configuration

app.use("/tickets", ticketsRouter);
app.use("/cache", cacheRouter);

// Validation
// app.get("*", Validation.checkUrlQueryExists);
app.post(base_api_url + "/*", Validation.checkRequestBodyExists);
app.patch(base_api_url + "/*", Validation.checkRequestBodyExists);
app.delete(base_api_url + "/*", Validation.checkRequestBodyExists);

// Authentication
app.use(base_api_url + "/*", Authentication.verifyToken);

// Endpoints
// Login
app.post(
	base_auth_url + "/register",
	Validation.checkCredentialsExists,
	FirebaseAuthController.registerUser
);
app.post(
	base_auth_url + "/login",
	Validation.checkCredentialsExists,
	FirebaseAuthController.loginUser
);
app.post(base_auth_url + "/logout", FirebaseAuthController.logoutUser);

// Cities
app.get(base_api_url + "/cities/:full?", Cities.Get);
app.post(base_api_url + "/cities", Cities.Post);
app.patch(base_api_url + "/cities", Cities.Patch);
app.delete(base_api_url + "/cities", Cities.Delete);

// Itineraries
app.get(base_api_url + "/itineraries/:full?", Itineraries.Get);
app.post(base_api_url + "/itineraries", Itineraries.Post);
app.patch(base_api_url + "/itineraries", Itineraries.Patch);
app.delete(base_api_url + "/itineraries", Itineraries.Delete);

// Listeners
server.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
