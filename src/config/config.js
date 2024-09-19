"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("../database/index"));
function ConfigureApp() {
    // Initialize .env files
    dotenv_1.default.config();
    // Initialize database
    const dbConnector = new index_1.default();
    // Initialize Express
    const app = (0, express_1.default)();
    return { app, dbConnector };
}
exports.default = ConfigureApp;
