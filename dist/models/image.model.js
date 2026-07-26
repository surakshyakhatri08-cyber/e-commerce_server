"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.ImageSchema = new mongoose_1.default.Schema({
    path: {
        type: String,
        required: [true, 'Image path is required'],
    },
    public_id: {
        type: String,
        required: [true, 'Image public_id is required'],
    },
}, {
    _id: false
});
