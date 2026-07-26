"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWishlist = exports.getMyWishlist = exports.createWishlist = void 0;
const wishlist_model_1 = __importDefault(require("../models/wishlist.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const customError_utils_1 = __importDefault(require("../utils/customError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
exports.createWishlist = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const user = req.user._id;
    const { product } = req.body;
    if (!product) {
        throw new customError_utils_1.default("Product is required", 400);
    }
    const isProductExist = await product_model_1.default.findById(product);
    if (!isProductExist) {
        throw new customError_utils_1.default("Product not found", 404);
    }
    const alreadyExists = await wishlist_model_1.default.findOne({
        user,
        product,
    });
    if (alreadyExists) {
        throw new customError_utils_1.default("Product already exists in wishlist", 400);
    }
    const wishlist = new wishlist_model_1.default({
        user,
        product,
    });
    await wishlist.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product added to wishlist",
        data: wishlist,
        statusCode: 201,
    });
});
exports.getMyWishlist = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const user = req.user._id;
    const filter = {};
    const { page = 1, perPage = 10, sortBy = 'createdAt', order = 'DESC', } = req.query;
    const currentPage = Number(page);
    const limit = Number(perPage);
    const skip = (currentPage - 1) * limit;
    const wishlist = await wishlist_model_1.default.find({ user })
        .populate('user', 'name email role')
        .populate("product")
        .limit(limit)
        .skip(skip)
        .sort({ [sortBy]: order === 'DESC' ? -1 : 1 });
    const totalCount = await wishlist_model_1.default.countDocuments(filter);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Wishlist fetched successfully",
        data: {
            wishlist,
            pagination: (0, pagination_utils_1.getPaginationMetaData)(totalCount, limit, currentPage),
        },
        statusCode: 200,
    });
});
exports.deleteWishlist = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const user = req.user._id;
    const { id } = req.params;
    const wishlist = await wishlist_model_1.default.findOne({
        _id: id,
        user,
    });
    if (!wishlist) {
        throw new customError_utils_1.default("Wishlist item not found", 404);
    }
    await wishlist_model_1.default.deleteOne();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Wishlist item deleted successfully",
        data: null,
        statusCode: 200,
    });
});
