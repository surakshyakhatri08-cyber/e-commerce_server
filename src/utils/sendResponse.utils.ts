import { Response } from 'express';
interface IResponseData<T>  {
    message: string;
    statusCode: number;
    data: T;
    stack?: any;
}

export const sendResponse = <T>(res: Response, data: IResponseData<T>) => {
    const { data: resData, message, statusCode, stack } = data;
    res.status(statusCode).json({
        message,
        data: resData,
        success: String(statusCode).startsWith('2'),
        status: String(statusCode).startsWith('2') ? 'success' : String(statusCode).startsWith('4') ? 'fail' : 'error',
        stack,
    });
};