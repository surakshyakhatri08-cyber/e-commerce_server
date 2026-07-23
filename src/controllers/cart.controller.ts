import { Request, Response, NextFunction } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import AppError from "../utils/customError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";


export const getMyCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user._id;

    let cart = await Cart.findOne({ user }).populate("items.product");

    if (!cart) {
        cart = await Cart.create({ user, items: [] });
    }

    sendResponse(res, {
        message: "Cart fetched successfully",
        data: cart,
        statusCode: 200,
    });
});

export const addToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user._id;
    const { product, quantity = 1 } = req.body;

    if (!product) {
        throw new AppError("Product is required", 400);
    }

    if (quantity < 1) {
        throw new AppError("Quantity must be at least 1", 400);
    }

    const isProductExist = await Product.findById(product);
    if (!isProductExist) {
        throw new AppError("Product not found", 404);
    }

    let cart = await Cart.findOne({ user });

    if (!cart) {
        cart = await Cart.create({
            user,
            items: [{ product, quantity }],
        });
    } else {
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === product.toString()
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += Number(quantity);
        } else {
            cart.items.push({ product, quantity: Number(quantity) });
        }

        await cart.save();
    }

    await cart.populate("items.product");

    sendResponse(res, {
        message: "Product added to cart successfully",
        data: cart,
        statusCode: 200,
    });
});

export const updateCartItemQuantity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user._id;
    const { product, quantity } = req.body;

    if (!product || quantity === undefined) {
        throw new AppError("Product and quantity are required", 400);
    }

    if (Number(quantity) < 1) {
        throw new AppError("Quantity must be at least 1", 400);
    }

    const cart = await Cart.findOne({ user });

    if (!cart) {
        throw new AppError("Cart not found", 404);
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === product.toString()
    );

    if (itemIndex === -1) {
        throw new AppError("Product not found in cart", 404);
    }

    cart.items[itemIndex].quantity = Number(quantity);

    await cart.save();
    await cart.populate("items.product");

    sendResponse(res, {
        message: "Cart item quantity updated successfully",
        data: cart,
        statusCode: 200,
    });
});

export const removeFromCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user._id;
    const { productId } = req.params;

    if (!productId) {
        throw new AppError("Product ID is required", 400);
    }

    const cart = await Cart.findOne({ user });

    if (!cart) {
        throw new AppError("Cart not found", 404);
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
        throw new AppError("Product not found in cart", 404);
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();
    await cart.populate("items.product");

    sendResponse(res, {
        message: "Item removed from cart successfully",
        data: cart,
        statusCode: 200,
    });
});

export const clearCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user._id;

    const cart = await Cart.findOne({ user });

    if (!cart) {
        throw new AppError("Cart not found", 404);
    }

    cart.items = [];

    await cart.save();

    sendResponse(res, {
        message: "Cart cleared successfully",
        data: cart,
        statusCode: 200,
    });
});