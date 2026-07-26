"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartItemQuantity = exports.addToCart = exports.getMyCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const customError_utils_1 = __importDefault(require("../utils/customError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
exports.getMyCart = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const user = req.user._id;
    let cart = await cart_model_1.default.findOne({ user })
        .populate('user', 'name email role')
        .populate({
        path: 'items.product',
        select: 'name stock price',
    });
    if (!cart) {
        cart = await cart_model_1.default.create({ user, items: [] });
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Cart fetched successfully",
        data: cart,
        statusCode: 200,
    });
});
exports.addToCart = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const user = req.user._id;
    const { product, quantity = 1 } = req.body;
    if (!product) {
        throw new customError_utils_1.default("Product is required", 400);
    }
    if (quantity < 1) {
        throw new customError_utils_1.default("Quantity must be at least 1", 400);
    }
    const isProductExist = await product_model_1.default.findById(product);
    if (!isProductExist) {
        throw new customError_utils_1.default("Product not found", 404);
    }
    let cart = await cart_model_1.default.findOne({ user });
    if (!cart) {
        cart = await cart_model_1.default.create({
            user,
            items: [{ product, quantity }],
        });
    }
    else {
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === product.toString());
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += Number(quantity);
        }
        else {
            cart.items.push({ product, quantity: Number(quantity) });
        }
        await cart.save();
    }
    await cart.populate("items.product");
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product added to cart successfully",
        data: cart,
        statusCode: 200,
    });
});
exports.updateCartItemQuantity = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const user = req.user._id;
    const { product, quantity } = req.body;
    if (!product || quantity === undefined) {
        throw new customError_utils_1.default("Product and quantity are required", 400);
    }
    if (Number(quantity) < 1) {
        throw new customError_utils_1.default("Quantity must be at least 1", 400);
    }
    const cart = await cart_model_1.default.findOne({ user });
    if (!cart) {
        throw new customError_utils_1.default("Cart not found", 404);
    }
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === product.toString());
    if (itemIndex === -1) {
        throw new customError_utils_1.default("Product not found in cart", 404);
    }
    cart.items[itemIndex].quantity = Number(quantity);
    await cart.save();
    await cart.populate("items.product");
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Cart item quantity updated successfully",
        data: cart,
        statusCode: 200,
    });
});
exports.removeFromCart = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const user = req.user._id;
    const { productId } = req.params;
    if (!productId) {
        throw new customError_utils_1.default("Product ID is required", 400);
    }
    const cart = await cart_model_1.default.findOne({ user });
    if (!cart) {
        throw new customError_utils_1.default("Cart not found", 404);
    }
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId.toString());
    if (itemIndex === -1) {
        throw new customError_utils_1.default("Product not found in cart", 404);
    }
    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate("items.product");
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Item removed from cart successfully",
        data: cart,
        statusCode: 200,
    });
});
exports.clearCart = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const user = req.user._id;
    const cart = await cart_model_1.default.findOne({ user });
    if (!cart) {
        throw new customError_utils_1.default("Cart not found", 404);
    }
    cart.items = [];
    await cart.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Cart cleared successfully",
        data: cart,
        statusCode: 200,
    });
});
