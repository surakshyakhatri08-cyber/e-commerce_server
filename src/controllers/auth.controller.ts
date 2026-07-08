import { Request, Response, NextFunction } from 'express';
import AuthUser from '../models/auth.model';


export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, profile } = req.body;

        const user = await AuthUser.findOne({ email });
        if (user) {
            res.status(400).json({
                message: 'Email is already registered',
                status: 'failed',
                success: false,
                data: null,
            });
            return;
        }

        const newUser = await AuthUser.create({
            name,
            email,
            password, 
            profile,
        });

        res.status(201).json({
            message: 'User registered successfully',
            status: 'success',
            success: true,
            data: newUser,
        });
    } catch (error) {
        next(error);
    }
};


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await AuthUser.findOne({ email });
        if (!user) {
            res.status(404).json({
                message: 'Invalid email or password',
                status: 'failed',
                success: false,
                data: null,
            });
            return;
        }

        if (password !== user.password) {
            res.status(401).json({
                message: 'Invalid email or password',
                status: 'failed',
                success: false,
                data: null,
            });
            return;
        }

        res.status(200).json({
            message: 'Login successful',
            status: 'success',
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};