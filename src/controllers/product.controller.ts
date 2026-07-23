import { Request, Response, NextFunction } from 'express';
import Product from '../models/product.model';
import { sendResponse } from '../utils/sendResponse.utils';
import { catchAsync } from '../utils/catchAsync.utils';
import AppError from '../utils/customError.utils';
import { deleteFileFromCloudinary, upload } from '../utils/cloudinary.utils';


const folder = '/products';

export const getAllProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const filter: Record<string, any> = {};
    const { query, category, brand, Price, minPrice, maxPrice, neqPrice } = req.query;

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
    if (
        Price !== undefined ||
        minPrice !== undefined ||
        maxPrice !== undefined ||
        neqPrice !== undefined
    ) {
        filter.price = {};

        if (
            Price !== undefined) {
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

    const products = await Product.find(filter)
        .populate('category')
        .populate('brand');

    sendResponse(res, {
        message: 'Products Fetched Successfully',
        data: products,
        statusCode: 200,
    });
});


export const getProductById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;
    const product = await Product.findOne({ _id: id })
        .populate('category')
        .populate('brand');

    if (!product) {
        throw new AppError(`Product with id: ${id} is not found`, 404);
    }

    sendResponse(res, {
        message: 'Product Fetched Successfully',
        data: product,
        statusCode: 200,
    });
});


export const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const {
        name,
        description,
        stock,
        price,
        is_featured,
        newArrival,
        brand,
        category
    } = req.body;

    const { cover_image, images } = req.files as {
        cover_image: Express.Multer.File[];
        images: Express.Multer.File[];
    };

    if (!name) {
        throw new AppError('Name is required', 400);
    }

    if (!stock) {
        throw new AppError('Stock is required', 400);
    }

    if (!price) {
        throw new AppError('Price is required', 400);
    }

    if (!cover_image[0]) {
        throw new AppError('Cover Image is required', 400);
    }

    if (!brand) {
        throw new AppError('Brand is required', 400);
    }

    if (!category) {
        throw new AppError('Category is required', 400);
    }

    const product = new Product({
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
    const { path, public_id } = await upload(cover_image[0], folder);
    product.cover_image = {
        path,
        public_id,
    };

    //image
    if (images && images.length > 0) {
        const promises = images.map((file) => upload(file, folder));
        const files = await Promise.allSettled(promises);
        const successImage = files
            .filter((file) => file.status == 'fulfilled')
            .map((file) => file.value);

        product.set('images', successImage);
    }

    await product.save();

    sendResponse(res, {
        message: 'Product Created Successfully',
        data: product,
        statusCode: 201,
    });
});


export const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    const {
        name,
        description,
        stock,
        price,
        is_featured,
        newArrival,
        brand,
        category,
        deleted_images,
    } = req.body;

    const { cover_image, images } = req.files as {
        cover_image?: Express.Multer.File[];
        images?: Express.Multer.File[];
    };

    const product = await Product.findOne({ _id: id });

    if (!product) {
        throw new AppError(`Product with id: ${id} is not found`, 404);
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (stock) product.stock = stock;
    if (price) product.price = price;
    if (is_featured !== undefined) product.is_featured = is_featured;
    if (newArrival !== undefined) product.newArrival = newArrival;
    if (brand) product.brand = brand;
    if (category) product.category = category;

    if (cover_image && cover_image.length > 0) {

        await deleteFileFromCloudinary(product.cover_image.public_id);

        const { path, public_id } = await upload(cover_image[0], folder);
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

        await Promise.all(
            product.images.map((img) =>
                deleteFileFromCloudinary(img.public_id)
            )
        );

        const promises = images.map((file) => upload(file, folder));

        const files = await Promise.allSettled(promises);

        const successImage = files
            .filter((file) => file.status == 'fulfilled')
            .map((file) => file.value);

        product.set("images", successImage);
    }

    await product.save();

    sendResponse(res, {
        message: "Product Updated Successfully",
        data: product,
        statusCode: 200,
    });
});


export const deleteProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    const product = await Product.findOne({ _id: id });

    if (!product) {
        throw new AppError(`Product with id: ${id} is not found`, 404);
    }

    if (product.cover_image) {
        await deleteFileFromCloudinary(product.cover_image.public_id);
    }

    if (product.images && product.images.length > 0) {

        await Promise.all(
            product.images.map((img) =>
                deleteFileFromCloudinary(img.public_id)
            )
        );
    }

    await product.deleteOne();

    sendResponse(res, {
        message: "Product Deleted Successfully",
        data: null,
        statusCode: 200,
    });
}
);