"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    message;
    statusCode;
    status;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, AppError);
    }
}
exports.default = AppError;
