"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.getBrandById = exports.getAllBrands = exports.createBrand = void 0;
const brand_model_1 = __importDefault(require("../models/brand.model"));
const customError_utils_1 = __importDefault(require("../utils/customError.utils"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
exports.createBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { name, description } = req.body;
    const file = req.file;
    console.log(file);
    if (!name) {
        throw new customError_utils_1.default('Name is required', 400);
    }
    if (!file) {
        throw new customError_utils_1.default('Logo image is required', 400);
    }
    const newBrand = new brand_model_1.default({
        name,
        description,
    });
    if (file) {
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, '/logo_image');
        newBrand.logo = {
            path: path,
            public_id: public_id,
        };
    }
    await newBrand.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Brand created successfully',
        data: {
            _id: newBrand._id,
            name: newBrand.name,
            description: newBrand.description,
            logo: newBrand.logo,
        },
        statusCode: 201,
    });
});
exports.getAllBrands = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const filter = {};
    //pagination
    const { query, page = 1, perPage = 2, sortBy = 'createdAt', order = 'DESC' } = req.query;
    const currentPage = Number(page);
    const limit = Number(perPage);
    const skip = (currentPage - 1) * limit;
    if (query) {
        // for single object
        // filter.name = {
        //     $regex: query,
        //     $options: 'i',
        // };
        //for multiple
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
    const brands = await brand_model_1.default.find(filter)
        .limit(limit)
        .skip(skip)
        .sort({ [sortBy]: order === 'DESC' ? -1 : 1 });
    const totalCount = await brand_model_1.default.countDocuments(filter);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Brands Fetched Successfully',
        data: {
            brands,
            pagination: (0, pagination_utils_1.getPaginationMetaData)(totalCount, limit, currentPage),
        },
        statusCode: 200,
    });
});
exports.getBrandById = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const brand = await brand_model_1.default.findOne({ _id: id });
    if (!brand) {
        throw new customError_utils_1.default(`Brand with id: ${id} not found`, 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Brand Fetched Successfully',
        data: brand,
        statusCode: 200,
    });
});
exports.updateBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;
    const updatedBrand = await brand_model_1.default.findOne({ _id: id });
    if (!updatedBrand) {
        throw new customError_utils_1.default(`Brand with id: ${id} not found`, 404);
    }
    if (name)
        updatedBrand.name = name;
    if (description)
        updatedBrand.description = description;
    if (file) {
        // delete image
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(updatedBrand.logo.public_id);
        //uploaded new image
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, '/logo_image');
        updatedBrand.logo = {
            path: path,
            public_id: public_id,
        };
    }
    await updatedBrand.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Brand Updated Successfully',
        data: updatedBrand,
        statusCode: 200,
    });
});
exports.deleteBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const deletedBrand = await brand_model_1.default.findOne({ _id: id });
    if (!deletedBrand) {
        throw new customError_utils_1.default(`Brand with id: ${id} not found`, 404);
    }
    // delete image
    await (0, cloudinary_utils_1.deleteFileFromCloudinary)(deletedBrand.logo.public_id);
    //delete brand
    await deletedBrand.deleteOne();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Brand Deleted Successfully',
        data: deletedBrand,
        statusCode: 200,
    });
});
