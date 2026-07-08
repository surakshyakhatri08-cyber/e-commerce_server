import express, { Application, Request, Response, NextFunction } from 'express';
import productRouter from './routes/product.route';

const app: Application = express();

app.use(express.json());

//health route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ 
        message: "server is up and running",
        status: "success",
        success: true,
        data: null,
    });
});

app.use('/products', productRouter);

//path not found
app.use((req: Request, res: Response, next: NextFunction) => {
    const message = `Can not ${req.method} on ${req.path}`;

    next({
        message,
        status: "failed",
        statusCode: 404,
    });

    // res.status(404).json({
    //     message,
    //     status: "failed",
    //     success: false,
    //     data: null,
    // });
});

//error handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const message = error?.message ?? 'Something went wrong';
    const status = error?.status ?? "error";
    const statusCode = error?.statusCode ?? 500;

    console.log(error);

    res.status(statusCode).json({
        message,
        status,
        success: false,
        data: null,
    });
});

export default app;