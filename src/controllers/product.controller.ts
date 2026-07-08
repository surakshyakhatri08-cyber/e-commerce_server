import { Request, Response, NextFunction } from 'express';
import Product from '../models/product.model';


export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            message: 'Products Fetched Successfully',
            status: 'success',
            success: true,
            data: products,
        });
        
    } catch (error) {
        next(error);
    }
};


export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ _id: id });

        if (!product) {
            res.status(404).json({
                message: `Product by id: ${id} not found`,
                status: 'failed',
                success: false,
                data: null,
            });
            return;
        }

        res.status(200).json({
            message: 'Product Fetched Successfully',
            status: 'success',
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};


export const createProduct = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const { name, quantity, price } = req.body;
        const product = await Product.create({ name, quantity, price });

        res.status(201).json({
            message: 'Product Created Successfully',
            status: 'success',
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};


export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, quantity, price } = req.body;

        const product = await Product.findByIdAndUpdate(
            { _id: id },
            { name, quantity, price },
            { new: true, runValidators: true }
        );

        if (!product) {
            res.status(404).json({
                message: `Product by id: ${id} not found`,
                status: 'failed',
                success: false,
                data: null,
            });
            return;
        }

        res.status(200).json({
            message: 'Product Updated Successfully',
            status: 'success',
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};


export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete({ _id: id });

        if (!product) {
            res.status(404).json({
                message: `Product by id: ${id} not found`,
                status: 'failed',
                success: false,
                data: null,
            });
            return;
        }

        res.status(200).json({
            message: 'Product Deleted Successfully',
            status: 'success',
            success: true,
            data: product,
        });
    } catch (error: any) {
        next(error);
    }
};
