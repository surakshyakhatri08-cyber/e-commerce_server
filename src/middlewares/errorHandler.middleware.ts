import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
// import { sendResponse } from "../utils/sendResponse.utils";

//error handling middleware
export const errorHandler = ((error: any, req: Request, res: Response, next: NextFunction) => {
    let message = error?.message ?? 'Something went wrong';
    const status = error?.status ?? "error";
    let statusCode = error?.statusCode ?? 500;

    console.log(error);

    if(error instanceof JsonWebTokenError) {
        message = 'Invalid token. Access Denied.';
        statusCode = 401;
    }

    if(error instanceof TokenExpiredError) {
        message = 'Token expired. Access Denied.';
        statusCode= 403;
    }

    // sendResponse(res, {
    //             message,
    //             statusCode,
    //     data: null,
    //     stack: error?.stack,
    // });


    res.status(statusCode).json({
        message,
        status,
        success: false,
        data: null,
        stack: error?.stack,
    });
});