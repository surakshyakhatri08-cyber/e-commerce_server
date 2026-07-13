import { Request, Response, NextFunction } from 'express';
import Brand from '../models/brand.model';
import AppError from '../utils/customError.utils';
import { sendResponse } from '../utils/sendResponse.utils';
import { catchAsync } from '../utils/catchAsync.utils';


export const createBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const { name, description, logo } = req.body;

        if (!name) {
            throw new AppError('Name is required', 400);
        }

        if (!logo) {
            throw new AppError('Logo is required', 400);
        }

        const newBrand = new Brand({
            name,
            description,
            logo,
        });

        await newBrand.save();

        // res.status(201).json({
        //     message: 'Brand Created Successfully',
        //     status: 'success',
        //     success: true,
        //     data: newBrand,
        // });

        sendResponse(res, {
            message: 'User registered successfully',
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
            const error: any = new Error(`Brand with id: ${id} not found`);
            error.status = "fail";
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Brand Fetched Successfully',
            status: 'success',
            success: true,
            data: brand,
        });
});

export const updateBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params;
        const { name, description, logo } = req.body;

        const updatedBrand = await Brand.findByIdAndUpdate(
            { _id: id },
            { name, description, logo },
            { new: true, runValidators: true }
        );

        if (!updatedBrand) {
            const error: any = new Error(`Brand with id: ${id} not found`);
            error.status = "fail";
            error.statusCode = 404;
            throw error;

        }

        res.status(200).json({
            message: 'Brand Updated Successfully',
            status: 'success',
            success: true,
            data: updatedBrand,
        });

});

export const deleteBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params;

        const deletedBrand = await Brand.findByIdAndDelete({ _id: id });

        if (!deletedBrand) {
            const error: any = new Error(`Brand with id: ${id} not found`);
            error.status = "fail";
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Brand Deleted Successfully',
            status: 'success',
            success: true,
            data: deletedBrand,
        });
});