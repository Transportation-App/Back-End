"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tickets_1 = require("../services/tickets");
const ticketsRouter = express_1.default.Router();
ticketsRouter.post("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticketId = req.body.id;
        const retrievedData = yield (0, tickets_1.get)(ticketId);
        if (retrievedData) {
            res.status(200).json(retrievedData);
        }
        else {
            res.status(404).json({ message: "Ticket not found" });
        }
    }
    catch (error) {
        console.error("Error retrieving ticket:", error);
        res.status(500).json({ message: "There is no itinerary with this id!" });
    }
}));
exports.default = ticketsRouter;
