"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const image_model_1 = require("./image.model");
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, 'Name must be at least 3 character'],
        trim: true,
    },
    description: {
        type: String,
        minLength: [5, 'Description length must be at least 5 character'],
        trim: true,
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: 0,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        trim: true,
    },
    cover_image: {
        type: image_model_1.ImageSchema,
        required: [true, 'Cover Image is required'],
    },
    brand: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "brand",
        required: [true, "Brand is required"],
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "category",
        required: [true, "Category is required"],
    },
    images: [image_model_1.ImageSchema],
    is_featured: {
        type: Boolean,
        default: false,
    },
    newArrival: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const Product = mongoose_1.default.model('product', productSchema);
exports.default = Product;
