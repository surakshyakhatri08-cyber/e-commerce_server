"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const customError_utils_1 = __importDefault(require("../utils/customError.utils"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
const folder = '/products';
exports.getAllProducts = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const filter = {};
    const { query, category, brand, Price, minPrice, maxPrice, neqPrice, page = 1, perPage = 10, sortBy = 'createdAt', order = 'DESC', } = req.query;
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
    if (category) {
        filter.category = category;
    }
    if (brand) {
        filter.brand = brand;
    }
    //todo: price range filter(lte, gte, neq, eq)
    if (Price !== undefined ||
        minPrice !== undefined ||
        maxPrice !== undefined ||
        neqPrice !== undefined) {
        filter.price = {};
        if (Price !== undefined) {
            filter.price.$eq = Number(Price);
        }
        if (minPrice !== undefined) {
            filter.price.$gte = Number(minPrice);
        }
        if (maxPrice !== undefined) {
            filter.price.$lte = Number(maxPrice);
        }
        if (neqPrice !== undefined) {
            filter.price.$ne = Number(neqPrice);
        }
    }
    const products = await product_model_1.default.find(filter)
        .populate('category')
        .populate('brand')
        .limit(limit)
        .skip(skip)
        .sort({ [sortBy]: order === 'DESC' ? -1 : 1 });
    const totalCount = await product_model_1.default.countDocuments(filter);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Products Fetched Successfully',
        data: {
            products,
            pagination: (0, pagination_utils_1.getPaginationMetaData)(totalCount, limit, currentPage),
        },
        statusCode: 200,
    });
});
exports.getProductById = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const product = await product_model_1.default.findOne({ _id: id })
        .populate('category')
        .populate('brand');
    if (!product) {
        throw new customError_utils_1.default(`Product with id: ${id} is not found`, 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Product Fetched Successfully',
        data: product,
        statusCode: 200,
    });
});
exports.createProduct = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { name, description, stock, price, is_featured, newArrival, brand, category } = req.body;
    const { cover_image, images } = req.files;
    if (!name) {
        throw new customError_utils_1.default('Name is required', 400);
    }
    if (!stock) {
        throw new customError_utils_1.default('Stock is required', 400);
    }
    if (!price) {
        throw new customError_utils_1.default('Price is required', 400);
    }
    if (!cover_image[0]) {
        throw new customError_utils_1.default('Cover Image is required', 400);
    }
    if (!brand) {
        throw new customError_utils_1.default('Brand is required', 400);
    }
    if (!category) {
        throw new customError_utils_1.default('Category is required', 400);
    }
    const product = new product_model_1.default({
        name,
        description,
        stock,
        price,
        is_featured,
        newArrival,
        brand,
        category,
    });
    //cover image 
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(cover_image[0], folder);
    product.cover_image = {
        path,
        public_id,
    };
    //image
    if (images && images.length > 0) {
        const promises = images.map((file) => (0, cloudinary_utils_1.upload)(file, folder));
        const files = await Promise.allSettled(promises);
        const successImage = files
            .filter((file) => file.status == 'fulfilled')
            .map((file) => file.value);
        product.set('images', successImage);
    }
    await product.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Product Created Successfully',
        data: product,
        statusCode: 201,
    });
});
exports.updateProduct = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, stock, price, is_featured, newArrival, brand, category, deleted_images, } = req.body;
    const { cover_image, images } = req.files;
    const product = await product_model_1.default.findOne({ _id: id });
    if (!product) {
        throw new customError_utils_1.default(`Product with id: ${id} is not found`, 404);
    }
    if (name)
        product.name = name;
    if (description)
        product.description = description;
    if (stock)
        product.stock = stock;
    if (price)
        product.price = price;
    if (is_featured !== undefined)
        product.is_featured = is_featured;
    if (newArrival !== undefined)
        product.newArrival = newArrival;
    if (brand)
        product.brand = brand;
    if (category)
        product.category = category;
    if (cover_image && cover_image.length > 0) {
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(product.cover_image.public_id);
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(cover_image[0], folder);
        product.cover_image = {
            path,
            public_id,
        };
    }
    // if deleted images
    if (deleted_images && Array.isArray(deleted_images) && deleted_images.length > 0) {
        //delete image from cloud
        // filter product images
    }
    //if new images
    //upload new images to cloud
    // add images on product.images
    if (images && images.length > 0) {
        await Promise.all(product.images.map((img) => (0, cloudinary_utils_1.deleteFileFromCloudinary)(img.public_id)));
        const promises = images.map((file) => (0, cloudinary_utils_1.upload)(file, folder));
        const files = await Promise.allSettled(promises);
        const successImage = files
            .filter((file) => file.status == 'fulfilled')
            .map((file) => file.value);
        product.set("images", successImage);
    }
    await product.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product Updated Successfully",
        data: product,
        statusCode: 200,
    });
});
exports.deleteProduct = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const product = await product_model_1.default.findOne({ _id: id });
    if (!product) {
        throw new customError_utils_1.default(`Product with id: ${id} is not found`, 404);
    }
    if (product.cover_image) {
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(product.cover_image.public_id);
    }
    if (product.images && product.images.length > 0) {
        await Promise.all(product.images.map((img) => (0, cloudinary_utils_1.deleteFileFromCloudinary)(img.public_id)));
    }
    await product.deleteOne();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product Deleted Successfully",
        data: null,
        statusCode: 200,
    });
});
