import { Request, Response, NextFunction } from 'express';
import Brand from '../models/brand.model';
import AppError from '../utils/customError.utils';
import { sendResponse } from '../utils/sendResponse.utils';
import { catchAsync } from '../utils/catchAsync.utils';
import { deleteFileFromCloudinary, upload } from '../utils/cloudinary.utils';


export const createBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { name, description } = req.body;
    const file = req.file;
    console.log(file);

    if (!name) {
        throw new AppError('Name is required', 400);
    }

    if (!file) {
        throw new AppError('Logo image is required', 400);
    }

    const newBrand = new Brand({
        name,
        description,
    });

    if (file) {
        const { path, public_id } = await upload(file, '/logo_image');
        newBrand.logo = {
            path: path,
            public_id: public_id,
        };
    }

    await newBrand.save();

    // res.status(201).json({
    //     message: 'Brand Created Successfully',
    //     status: 'success',
    //     success: true,
    //     data: newBrand,
    // });

    sendResponse(res, {
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


export const getAllBrands = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const brands = await Brand.find({});

    // res.status(200).json({
    //     message: 'Brands Fetched Successfully',
    //     status: 'success',
    //     success: true,
    //     data: brands,
    // });

    sendResponse(res, {
        message: 'Brands Fetched Successfully',
        data: brands,
        statusCode: 200,
    });
});


export const getBrandById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    const brand = await Brand.findOne({ _id: id });

    if (!brand) {
        throw new AppError(`Brand with id: ${id} not found`, 404);
    }

    // res.status(200).json({
    //     message: 'Brand Fetched Successfully',
    //     status: 'success',
    //     success: true,
    //     data: brand,
    // });

    sendResponse(res, {
        message: 'Brand Fetched Successfully',
        data: brand,
        statusCode: 200,
    });
});

export const updateBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;

    const updatedBrand = await Brand.findOne(
        { _id: id },
        { name, description },
        { new: true, runValidators: true }
    );

    if (!updatedBrand) {
        throw new AppError(`Brand with id: ${id} not found`, 404);
    }

    if (name) updatedBrand.name = name;
    if (description) updatedBrand.description = description;


    if (file) {
        // delete image
        await deleteFileFromCloudinary(updatedBrand.logo.public_id);
        //uploaded new image
        const { path, public_id } = await upload(file, '/logo_image');
        updatedBrand.logo = {
            path: path,
            public_id: public_id,
        };
    }

    await updatedBrand.save();

    // res.status(200).json({
    //     message: 'Brand Updated Successfully',
    //     status: 'success',
    //     success: true,
    //     data: updatedBrand,
    // });

    sendResponse(res, {
        message: 'Brand Updated Successfully',
        data: updatedBrand,
        statusCode: 200,
    });

});

export const deleteBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    const deletedBrand = await Brand.findOne({ _id: id });

    if (!deletedBrand) {
        throw new AppError(`Brand with id: ${id} not found`, 404);
    }

    // delete image
    await deleteFileFromCloudinary(deletedBrand.logo.public_id);

    //delete brand
    await deletedBrand.deleteOne();

    // res.status(200).json({
    //     message: 'Brand Deleted Successfully',
    //     status: 'success',
    //     success: true,
    //     data: deletedBrand,
    // });

    sendResponse(res, {
        message: 'Brand Deleted Successfully',
        data: deletedBrand,
        statusCode: 200,
    });
});