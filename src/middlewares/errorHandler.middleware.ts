import { Request, Response, NextFunction } from "express";

//error handling middleware
export const errorHandler = ((error: any, req: Request, res: Response, next: NextFunction) => {
    const message = error?.message ?? 'Something went wrong';
    const status = error?.status ?? "error";
    const statusCode = error?.statusCode ?? 500;

    console.log(error);

    res.status(statusCode).json({
        message,
        status,
        success: false,
        data: null,
        stack: error?.stack,
    });
});