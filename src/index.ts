import { Cities, Itineraries } from "./Routes";
import { Authentication, Validation } from "./Middlewares";
import ConfigureApp from "./Config/Config";
import cacheRouter from "./Routes/CacheRoute";
import { ticketsRouter } from "./Routes";
import { initWebSocketServer } from "./Middlewares/webServer";
import stripeRouter from "./Routes/StripeRoute";

const { app, server, wsServer } = ConfigureApp;

const port = process.env.PORT || 3000;
const base_url = "/api";
initWebSocketServer(wsServer);

// Middlewares
// Configuration

app.use("/tickets", ticketsRouter);
app.use("/stripe", stripeRouter);
app.use("/cache", cacheRouter);

// Validation
// app.get("*", Validation.checkUrlQueryExists);
// app.post("*", Validation.checkRequestBodyExists);
app.patch("*", Validation.checkRequestBodyExists);
app.delete("*", Validation.checkRequestBodyExists);

// Endpoints
// Cities
app.get(base_url + "/cities/:full?", Cities.Get);
app.post(base_url + "/cities", Cities.Post);
app.patch(base_url + "/cities", Cities.Patch);
app.delete(base_url + "/cities", Cities.Delete);

// Itineraries
app.get(base_url + "/itineraries/:full?", Itineraries.Get);
app.post(base_url + "/itineraries", Itineraries.Post);
app.patch(base_url + "/itineraries", Itineraries.Patch);
app.delete(base_url + "/itineraries", Itineraries.Delete);

// Listeners
server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
