import { Request, Response, NextFunction } from "express";
import WishList from "../models/wishlist.model";
import Product from "../models/product.model";
import AppError from "../utils/customError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { getPaginationMetaData } from "../utils/pagination.utils";


export const createWishlist = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user._id;
    const { product } = req.body;

    if (!product) {
        throw new AppError("Product is required", 400);
    }

    const isProductExist = await Product.findById(product);

    if (!isProductExist) {
        throw new AppError("Product not found", 404);
    }

    const alreadyExists = await WishList.findOne({
        user,
        product,
    });

    if (alreadyExists) {
        throw new AppError("Product already exists in wishlist", 400);
    }

    const wishlist = new WishList({
        user,
        product,
    });

    await wishlist.save();

    sendResponse(res, {
        message: "Product added to wishlist",
        data: wishlist,
        statusCode: 201,
    });
}
);

export const getMyWishlist = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user._id;
    const filter: Record<string, any> = {};
    const {
        page = 1,
        perPage = 10,
        sortBy = 'createdAt',
        order = 'DESC',
    } = req.query;

    const currentPage = Number(page);
    const limit = Number(perPage);
    const skip = (currentPage - 1) * limit;

    const wishlist = await WishList.find({ user })
        .populate('user', 'name email role')
        .populate("product")
        .limit(limit)
        .skip(skip)
        .sort({ [sortBy as string]: order === 'DESC' ? -1 : 1 });

    const totalCount = await WishList.countDocuments(filter);

    sendResponse(res, {
        message: "Wishlist fetched successfully",
        data: {
            wishlist,
            pagination: getPaginationMetaData(totalCount, limit, currentPage),
        },
        statusCode: 200,
    });
}
);

export const deleteWishlist = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user._id;
    const { id } = req.params;

    const wishlist = await WishList.findOne({
        _id: id,
        user,
    });

    if (!wishlist) {
        throw new AppError("Wishlist item not found", 404);
    }

    await WishList.deleteOne();

    sendResponse(res, {
        message: "Wishlist item deleted successfully",
        data: null,
        statusCode: 200,
    });
}
);