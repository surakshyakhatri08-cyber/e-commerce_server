"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const image_model_1 = require("./image.model");
const enum_types_1 = require("../@types/enum.types");
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    description: {
        type: String,
        minLength: [5, 'Description length must be at least 5 character'],
        trim: true,
    },
    role: {
        type: String,
        enum: Object.values(enum_types_1.Role),
        default: enum_types_1.Role.USER,
    },
    image: {
        type: image_model_1.ImageSchema,
        required: [true, 'Image is required'],
        trim: true,
    },
});
const Category = mongoose_1.default.model('category', categorySchema);
exports.default = Category;
