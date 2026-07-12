import { Request, Response, NextFunction } from 'express';
import AuthUser from '../models/auth.model';
import { comparePassword, hashPassword } from '../utils/bcrypt.utils';
import AppError from '../utils/customError.utils';
import { catchAsync } from '../utils/catchAsync.utils';
import { sendResponse } from '../utils/sendResponse.utils';
import { userInfo } from 'os';


export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    const file = req.file;

    console.log(file);

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

    //long error throw
    // if (!name) {
    //     const error: any = new Error("Name is required");
    //     error.status = "fail";
    //     error.statusCode = 400;
    //     throw error;
    // }

    //in short error throw
    if (!name) throw new AppError('Name is required', 400);

    if (!email) throw new AppError('Email is required', 400);

    if (!password) throw new AppError('Password is required', 400);


    const newUser = new AuthUser({
        name,
        email,
        password,
    });

    //hash password
    const hash = await hashPassword(password);
    newUser.password = hash;

    if(file) {
        newUser.profile = file.path
    }

    //save user
    await newUser.save();

    //success response
    sendResponse(res, {
        message: 'User registered successfully',
        data: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            profile: newUser.profile,
        },
        statusCode: 201,
    });

    // res.status(201).json({
    //     message: 'User registered successfully',
    //     status: 'success',
    //     success: true,
    //     // data: newUser,
    //     //if password is hidden in repsonse
    //     data: {
    //         _id: newUser._id,
    //         name: newUser.name,
    //         email: newUser.email,
    //         role: newUser.role,
    //         profile: newUser.profile,
    //     },
    // });
});


export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = req.body;

    if (!email) throw new AppError('Email is required', 400);

    if (!password) throw new AppError('Password is required', 400)

    //find user by email
    const user = await AuthUser.findOne({ email }).select("+password");
    if (!user) throw new AppError('Invalid Credentials', 400);

    //check password
    const isPasswordMatched = await comparePassword(password, user.password);

    if (!isPasswordMatched) throw new AppError('Invalid Credentials', 400);

    // if (password !== user.password) {
    //     res.status(401).json({
    //         message: 'Invalid email or password',
    //         status: 'failed',
    //         success: false,
    //         data: null,
    //     });
    //     return;
    // }

    sendResponse(res, {
        message: 'Login successful',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile: user.profile,
        },
        statusCode: 201,
    });

    // res.status(200).json({
    //     message: 'Login successful',
    //     status: 'success',
    //     success: true,
    //     // data: user,
    //     data: {
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         role: user.role,
    //         profile: user.profile,
    //     },
    // });
});