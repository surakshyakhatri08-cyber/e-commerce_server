"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategory = exports.createCategory = void 0;
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const customError_utils_1 = __importDefault(require("../utils/customError.utils"));
const category_model_1 = __importDefault(require("../models/category.model"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
exports.createCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { name, description } = req.body;
    const file = req.file;
    if (!name) {
        throw new customError_utils_1.default('Name is required', 400);
    }
    if (!file) {
        throw new customError_utils_1.default('File Image is required', 400);
    }
    const category = new category_model_1.default({
        name,
        description,
    });
    if (file) {
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, '/image');
        category.image = {
            path: path,
            public_id: public_id,
        };
    }
    await category.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Category created successfully',
        data: {
            _id: category.id,
            name: category.name,
            description: category.description,
            image: category.image,
        },
        statusCode: 200,
    });
});
exports.getAllCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const filter = {};
    const { query, page = 1, perPage = 10, sortBy = 'createdAt', order = 'DESC', } = req.query;
    const currentPage = Number(page);
    const limit = Number(perPage);
    const skip = (currentPage - 1) * limit;
    if (query) {
        filter.$or = [
            {
                name: {
                    $regex: query,
                    $options: 'i',
                },
            },
            {
                description: {
                    $regex: query,
                    $options: 'i',
                },
            },
        ];
    }
    const categories = await category_model_1.default.find(filter)
        .limit(limit)
        .skip(skip)
        .sort({ [sortBy]: order === 'DESC' ? -1 : 1 });
    const totalCount = await category_model_1.default.countDocuments(filter);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Category fetched successfully',
        data: {
            categories,
            pagination: (0, pagination_utils_1.getPaginationMetaData)(totalCount, limit, currentPage),
        },
        statusCode: 200,
    });
});
exports.getCategoryById = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const category = await category_model_1.default.findOne({ _id: id });
    if (!category) {
        throw new customError_utils_1.default(`Category with id: ${id} is not found`, 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Category fetched successfully',
        data: {
            _id: category.id,
            name: category.name,
            description: category.description,
            image: category.image,
        },
        statusCode: 200,
    });
});
exports.updateCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;
    const category = await category_model_1.default.findOne({ _id: id });
    if (!category) {
        throw new customError_utils_1.default(`Category with id: ${id} is not found`, 400);
    }
    if (name)
        category.name = name;
    if (description)
        category.description = description;
    if (file) {
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(category.image.public_id);
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, '/image');
        category.image = {
            path: path,
            public_id: public_id,
        };
    }
    await category.save();
    console.log(category);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Category updated successfully',
        data: {
            _id: category._id,
            name: category.name,
            description: category.description,
            image: category.image,
        },
        statusCode: 200,
    });
});
exports.deleteCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const category = await category_model_1.default.findOne({ _id: id });
    if (!category) {
        throw new customError_utils_1.default(`Category with id: ${id} is not found`, 404);
    }
    await (0, cloudinary_utils_1.deleteFileFromCloudinary)(category.image.public_id);
    await category.deleteOne();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Category deleted successfully',
        data: {
            _id: category.id,
            name: category.name,
            description: category.description,
            image: category.image,
        },
        statusCode: 200,
    });
});
