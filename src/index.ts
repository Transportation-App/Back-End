import { baseApiRouter, baseAuthRouter, baseCacheRouter } from "./Routes";
import { WebServer } from "./Middlewares";
import Configuration from "./Config";

const { app, server, wsServer } = Configuration;

const port = process.env.PORT || 3000;
WebServer.initWebSocketServer(wsServer);

// Routes
app.use("/api", baseApiRouter);
app.use("/auth", baseAuthRouter);
app.use("/cache", baseCacheRouter);

// Listeners
server.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
