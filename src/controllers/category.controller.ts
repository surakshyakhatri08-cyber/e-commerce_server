import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.utils';
import AppError from '../utils/customError.utils';
import Category from '../models/category.model';
import { deleteFileFromCloudinary, upload } from '../utils/cloudinary.utils';
import { sendResponse } from '../utils/sendResponse.utils';


export const createCategory = catchAsync(async( req: Request, res: Response, next: NextFunction ) => {
    const { name, description } = req.body;
    const file = req.file;


    if(!name) {
        throw new AppError('Name is required', 400);
    }

    if(!file) {
        throw new AppError('File Image is required', 400);
    }

    const category = new Category({
        name,
        description,
    });

    if(file) {
        const {path, public_id} = await upload(file, '/image');
        category.image = {
            path: path,
            public_id: public_id,
        };
    }

    await category.save();

    sendResponse(res, {
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

export const getAllCategory = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.find({});

    sendResponse(res, {
        message: 'Category fetched successfully',
        data: categories,
        statusCode: 200,
    });
});

export const getCategoryById = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id });

    if(!category) {
        throw new AppError(`Category with id: ${id} is not found`, 404);
    }

    sendResponse(res, {
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

export const updateCategory = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;

    const category = await Category.findOne(
        { _id: id },
    );

    if(!category) {
        throw new AppError(`Category with id: ${id} is not found`, 400);
    }

    if(name) category.name = name;
    if(description) category.description = description;

    if(file) {
       await deleteFileFromCloudinary(category.image.public_id);
        const { path, public_id } = await upload(file, '/image');
        category.image = {
            path: path,
            public_id: public_id,
        };
    }

    await category.save();
    console.log(category);

    sendResponse(res, {
        message: 'Category updated successfully',
        data: {
            _id: category._id,
            name: category.name,
            description: category.description,
            image: category.image,
        },
        statusCode: 200,
    })
});

export const deleteCategory = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    const category = await Category.findOne({ _id: id});

    if(!category) {
        throw new AppError(`Category with id: ${id} is not found`, 404);
    }

    await deleteFileFromCloudinary(category.image.public_id);

    await category.deleteOne();

    sendResponse(res, {
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