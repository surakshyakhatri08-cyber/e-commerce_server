"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = (DB_URI) => {
    mongoose_1.default.connect(DB_URI, {
        autoCreate: true,
        dbName: 'e-commerce_db',
    })
        .then(() => {
        console.log("Database Connected");
    })
        .catch((error) => {
        console.log("Database Connection Failed");
        console.log(error);
    });
};
exports.connectDatabase = connectDatabase;
