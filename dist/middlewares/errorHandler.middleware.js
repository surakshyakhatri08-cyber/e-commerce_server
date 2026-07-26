"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
// import { sendResponse } from "../utils/sendResponse.utils";
//error handling middleware
exports.errorHandler = ((error, req, res, next) => {
    let message = error?.message ?? 'Something went wrong';
    const status = error?.status ?? "error";
    let statusCode = error?.statusCode ?? 500;
    console.log(error);
    if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
        message = 'Invalid token. Access Denied.';
        statusCode = 401;
    }
    if (error instanceof jsonwebtoken_1.TokenExpiredError) {
        message = 'Token expired. Access Denied.';
        statusCode = 403;
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
