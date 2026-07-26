import { Request, Response, NextFunction } from 'express';
import AuthUser from '../models/auth.model';
import { comparePassword, hashPassword } from '../utils/bcrypt.utils';
import AppError from '../utils/customError.utils';
import { catchAsync } from '../utils/catchAsync.utils';
import { sendResponse } from '../utils/sendResponse.utils';
import { deleteFileFromCloudinary, upload } from '../utils/cloudinary.utils';
import { generateJwtToken } from '../utils/jwt.utils';
import ENV_CONFIG from '../config/env.config';
import { sendEmail } from '../utils/sendEmail.utils';
import { newAccountCreatedHtml, newLoginDetectedHtml } from '../utils/emailTemplate.utils';


export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;
    const file = req.file;

    console.log(file);

    if (!name) throw new AppError('Name is required', 400);

    if (!email) throw new AppError('Email is required', 400);

    if (!password) throw new AppError('Password is required', 400);


    const newUser = new AuthUser({
        name,
        email,
        password,
        role,
    });

    //hash password
    const hash = await hashPassword(password);
    newUser.password = hash;

    if (file) {
        const { path, public_id } = await upload(file, '/profile_image');
        newUser.profile = {
            path: path,
            public_id: public_id,
        };
    }

    //save user
    await newUser.save();

    // await sendEmail({
    //     to: newUser.email,
    //     subject: 'Account Created',
    //     html: `<div>
    //     <h3>Welcome, ${newUser.name || 'User'}! <h3>
    //     <p>Your account has been created successfully.</p>
    //     </div>`,
    //     attachments: []
    // });

    await sendEmail({
        to: newUser.email,
        subject: 'Account Created',
        html: newAccountCreatedHtml({
            fullName: newUser.name,
            email: newUser.email,
        }),
        attachments: [],
    })

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

    // jwt token
    const access_token = generateJwtToken({
        _id: user._id,
        email: user.email,
        role: user.role
    });

    //set cookie
    res.cookie('access_token', access_token, {
        secure: ENV_CONFIG.NODE_ENV === 'development' ? false : true,
        httpOnly: ENV_CONFIG.NODE_ENV === 'development' ? false : true,
        maxAge: ENV_CONFIG.COOKIE_EXPIRY * 24 * 60 * 60 * 1000,
        sameSite: ENV_CONFIG.NODE_ENV === 'development' ? 'lax' : 'none',
    });

    const { password: p, __v, ...rest } = user.toObject();

    await sendEmail({
        to: user.email,
        subject: 'New Login Alert',
        html: newLoginDetectedHtml({
            email: user.email,
            fullName: user.name,
            loginAt: new Date(Date.now()),
            userAgent: req.headers['user-agent'] as string,
        }),
        attachments: []
    });

    sendResponse(res, {
        message: 'Login successful',
        // data: {
        //     _id: user._id,
        //     name: user.name,
        //     email: user.email,
        //     role: user.role,
        //     profile: user.profile,
        // },

        data: { user: rest, access_token },
        statusCode: 201,
    });
});

export const changeProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
        throw new AppError('Image is required', 400);
    }


    const user = await AuthUser.findOne({ _id: userId });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const { path, public_id } = await upload(file, '/profile_image');
    if (user.profile) {
        deleteFileFromCloudinary(user.profile.public_id);
    }

    user.profile = {
        path,
        public_id,
    };

    await user.save();

    sendResponse(res, {
        message: 'Profile image updated',
        data: user,
        statusCode: 200,
    });
});

// get profile
export const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user._id;

    const user = await AuthUser.findOne({ _id: id });

    if (!user) {
        throw new AppError('User not found', 400);
    }

    await user.save();

    sendResponse(res, {
        message: 'User profile fetched successfully',
        data: user,
        statusCode: 200,
    });
});

// change password
export const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user._id;
    const { password, newPassword } = req.body;

    if (!newPassword) {
        throw new AppError('New password is required', 400);
    }

    if (!password) {
        throw new AppError('Old password is required', 400);
    }

    const user = await AuthUser.findOne({ _id: id }).select('+password');
    if (!user) {
        throw new AppError('USer not found', 400);
    }

    const isOldPassword = await comparePassword(password, user.password);
    if (!isOldPassword) {
        throw new AppError('Password is not matched', 400);
    }

    const hash = await hashPassword(newPassword);
    user.password = hash;

    await user.save();

    sendResponse(res, {
        message: 'Password is changed',
        data: null,
        statusCode: 200,
    });
});

// logout
export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('access_token', {
        secure: ENV_CONFIG.NODE_ENV === 'development' ? false : true,
        httpOnly: ENV_CONFIG.NODE_ENV === 'development' ? false : true,
        maxAge: Date.now(),
        sameSite: ENV_CONFIG.NODE_ENV === 'development' ? 'lax' : 'none',
    });

    sendResponse(res, {
        message: 'Logout Successfully',
        data: null,
        statusCode: 200,
    });
});
// 