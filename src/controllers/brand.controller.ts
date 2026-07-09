import { Request, Response, NextFunction } from 'express';
import Brand from '../models/brand.model';


export const createBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, logo } = req.body;

        if (!name) {
            const error: any = new Error("Name is required");
            error.status = "fail";
            error.statusCode = 400;
            throw error;
        }

        if (!logo) {
            const error: any = new Error("Logo is required");
            error.status = "fail";
            error.statusCode = 400;
            throw error;
        }

        const newBrand = new Brand({
            name,
            description,
            logo,
        });

        await newBrand.save();

        res.status(201).json({
            message: 'Brand Created Successfully',
            status: 'success',
            success: true,
            data: newBrand,
        });
    } catch (error) {
        next(error);
    }
};


export const getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const brands = await Brand.find({});
        res.status(200).json({
            message: 'Brands Fetched Successfully',
            status: 'success',
            success: true,
            data: brands,
        });
    } catch (error) {
        next(error);
    }
};


export const getBrandById = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (error) {
        next(error);
    }
};

export const updateBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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
    } catch (error) {
        next(error);
    }
};

export const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (error) {
        next(error);
    }
};