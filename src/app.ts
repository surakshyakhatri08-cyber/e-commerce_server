import express, { Application, Request, Response, NextFunction } from 'express';
import productRouter from './routes/product.route';
import authRouter from './routes/auth.route';
import brandRouter from './routes/brand.route';
import categoryRouter from './routes/category.route';
import wishlistRouter from './routes/wishlist.route';
import cartRouter from './routes/cart.route';
import {errorHandler} from './middlewares/errorHandler.middleware';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

//health route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ 
        message: "server is up and running",
        status: "success",
        success: true,
        data: null,
    });
});

app.use('/api/products', productRouter);
app.use('/api/auth', authRouter);
app.use('/api/brands', brandRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/wishlists', wishlistRouter);
app.use('/api/carts', cartRouter);


//path not found
app.use((req: Request, res: Response, next: NextFunction) => {
    const message = `Can not ${req.method} on ${req.path}`;
    
    const error: any = new Error(message);
    error.status = 'failed';
    error.statusCode = 404;

    next(error);
});

//error handling middleware
app.use(errorHandler);

export default app;