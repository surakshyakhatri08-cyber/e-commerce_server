"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    const { data: resData, message, statusCode, stack } = data;
    res.status(statusCode).json({
        message,
        data: resData,
        success: String(statusCode).startsWith('2'),
        status: String(statusCode).startsWith('2') ? 'success' : String(statusCode).startsWith('4') ? 'fail' : 'error',
        stack,
    });
};
exports.sendResponse = sendResponse;
