// import { NextFunction, Request, Response } from "express";
import ConfigureApp from "./config/config";
import cacheRouter from "./routes/cache";
import ticketsRouter from "./routes/tickets";
import { initWebSocketServer } from "./middlewares/webServer";

const { app, server, wsServer } = ConfigureApp;

const port = process.env.PORT;

app.use("/tickets", ticketsRouter);
app.use("/cache", cacheRouter);

initWebSocketServer(wsServer);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
