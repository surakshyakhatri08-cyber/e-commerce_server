import { Request, Response, NextFunction } from 'express';
import AuthUser from '../models/auth.model';
import { comparePassword, hashPassword } from '../utils/bcrypt.utils';


export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        // const user = await AuthUser.findOne({ email });
        // if (user) {
        //     res.status(400).json({
        //         message: 'Email is already registered',
        //         status: 'failed',
        //         success: false,
        //         data: null,
        //     });
        //     return;
        // }

        if (!name) {
            const error: any = new Error("Name is required");
            error.status = "fail";
            error.statusCode = 400;
            throw error;
        }
        if (!email) {
            const error: any = new Error("Email is required");
            error.status = "fail";
            error.statusCode = 400;
            throw error;
        }
        if (!password) {
            const error: any = new Error("Password is required");
            error.status = "fail";
            error.statusCode = 400;
            throw error;
        }


        const newUser = new AuthUser({
            name,
            email,
            password,
        });

        //hash password
        const hash = await hashPassword(password);
        newUser.password = hash;

        //save user
        await newUser.save();

        //success response
        res.status(201).json({
            message: 'User registered successfully',
            status: 'success',
            success: true,
            // data: newUser,
            //if password is hidden in repsonse
            data: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                profile: newUser.profile,
            },
        });
    } catch (error) {
        next(error);
    }
};


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            const error: any = new Error("Email is required");
            error.status = "fail";
            error.statusCode = 400;
            throw error;
        }

        if (!password) {
            const error: any = new Error("Password is required");
            error.status = "fail";
            error.statusCode = 400;
            throw error;
        }

        //find user by email
        const user = await AuthUser.findOne({ email }).select("+password");
        if (!user) {
            const error: any = new Error("Invalid Credentials");
            error.status = "fail";
            error.statusCode = 400;
            throw error;
        }

        //check password
        const isPasswordMatched = await comparePassword(password, user.password);

        if (!isPasswordMatched) {
            const error: any = new Error("Invalid Credentials");
            error.status = "fail";
            error.statusCode = 400;
            throw error;
        }

        // if (password !== user.password) {
        //     res.status(401).json({
        //         message: 'Invalid email or password',
        //         status: 'failed',
        //         success: false,
        //         data: null,
        //     });
        //     return;
        // }

        res.status(200).json({
            message: 'Login successful',
            status: 'success',
            success: true,
            // data: user,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
            },
        });
    } catch (error) {
        next(error);
    }
};