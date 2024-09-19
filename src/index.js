"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config/config"));
const tickets_1 = __importDefault(require("./routes/tickets"));
const cors_1 = __importDefault(require("cors"));
const { app } = (0, config_1.default)();
var routesVersioning = require("express-routes-versioning")();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*", // Allow requests from all origins, or specify specific origins
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allow Content-Type header
}));
app.use("/tickets", tickets_1.default);
// Endpoint - get itineraries' list
// app.get(
//   "/itineraries",
//   routesVersioning({
//     "1.0.0": itinerariesV1,
//     "2.0.0": itinerariesV2,
//   })
// );
// function itinerariesV1(req: Request, res: Response, next: NextFunction) {
//   console.log(req.header("accept-version"));
//   res.status(200).send("ok v1");
// }
// function itinerariesV2(req: Request, res: Response, next: NextFunction) {
//   console.log(req.header("accept-version"));
//   res.status(200).send("ok v2");
// }
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
