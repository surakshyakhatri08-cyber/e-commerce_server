class AppError extends Error {
    status: "error" | "fail";
    isOperational: boolean;

    constructor(
        public message: string,
        public statusCode: number,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, AppError);
    }
 }

 export default AppError;