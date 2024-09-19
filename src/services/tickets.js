"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const config_1 = __importDefault(require("../config/config"));
const { dbConnector } = (0, config_1.default)();
const get = (id) => {
    return new Promise((resolve, reject) => {
        dbConnector.read("Ticket Service", id, (snapshot) => {
            if (snapshot.exists()) {
                resolve(snapshot.val());
            }
            else {
                resolve(null);
            }
        }, (error) => {
            reject(error);
        });
    });
};
exports.get = get;
