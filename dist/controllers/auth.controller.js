"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.changePassword = exports.getProfile = exports.changeProfile = exports.login = exports.signup = void 0;
const auth_model_1 = __importDefault(require("../models/auth.model"));
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const customError_utils_1 = __importDefault(require("../utils/customError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
const sendEmail_utils_1 = require("../utils/sendEmail.utils");
const emailTemplate_utils_1 = require("../utils/emailTemplate.utils");
exports.signup = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const file = req.file;
    console.log(file);
    if (!name)
        throw new customError_utils_1.default('Name is required', 400);
    if (!email)
        throw new customError_utils_1.default('Email is required', 400);
    if (!password)
        throw new customError_utils_1.default('Password is required', 400);
    const newUser = new auth_model_1.default({
        name,
        email,
        password,
        role,
    });
    //hash password
    const hash = await (0, bcrypt_utils_1.hashPassword)(password);
    newUser.password = hash;
    if (file) {
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, '/profile_image');
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
    await (0, sendEmail_utils_1.sendEmail)({
        to: newUser.email,
        subject: 'Account Created',
        html: (0, emailTemplate_utils_1.newAccountCreatedHtml)({
            fullName: newUser.name,
            email: newUser.email,
        }),
        attachments: [],
    });
    //success response
    (0, sendResponse_utils_1.sendResponse)(res, {
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
exports.login = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email)
        throw new customError_utils_1.default('Email is required', 400);
    if (!password)
        throw new customError_utils_1.default('Password is required', 400);
    //find user by email
    const user = await auth_model_1.default.findOne({ email }).select("+password");
    if (!user)
        throw new customError_utils_1.default('Invalid Credentials', 400);
    //check password
    const isPasswordMatched = await (0, bcrypt_utils_1.comparePassword)(password, user.password);
    if (!isPasswordMatched)
        throw new customError_utils_1.default('Invalid Credentials', 400);
    // jwt token
    const access_token = (0, jwt_utils_1.generateJwtToken)({
        _id: user._id,
        email: user.email,
        role: user.role
    });
    //set cookie
    res.cookie('access_token', access_token, {
        secure: env_config_1.default.NODE_ENV === 'development' ? false : true,
        httpOnly: env_config_1.default.NODE_ENV === 'development' ? false : true,
        maxAge: env_config_1.default.COOKIE_EXPIRY * 24 * 60 * 60 * 1000,
        sameSite: env_config_1.default.NODE_ENV === 'development' ? 'lax' : 'none',
    });
    const { password: p, __v, ...rest } = user.toObject();
    await (0, sendEmail_utils_1.sendEmail)({
        to: user.email,
        subject: 'New Login Alert',
        html: (0, emailTemplate_utils_1.newLoginDetectedHtml)({
            email: user.email,
            fullName: user.name,
            loginAt: new Date(Date.now()),
            userAgent: req.headers['user-agent'],
        }),
        attachments: []
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
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
exports.changeProfile = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const file = req.file;
    const userId = req.user._id;
    if (!file) {
        throw new customError_utils_1.default('Image is required', 400);
    }
    const user = await auth_model_1.default.findOne({ _id: userId });
    if (!user) {
        throw new customError_utils_1.default('User not found', 404);
    }
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, '/profile_image');
    if (user.profile) {
        (0, cloudinary_utils_1.deleteFileFromCloudinary)(user.profile.public_id);
    }
    user.profile = {
        path,
        public_id,
    };
    await user.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Profile image updated',
        data: user,
        statusCode: 200,
    });
});
// get profile
exports.getProfile = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const id = req.user._id;
    const user = await auth_model_1.default.findOne({ _id: id });
    if (!user) {
        throw new customError_utils_1.default('User not found', 400);
    }
    await user.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'User profile fetched successfully',
        data: user,
        statusCode: 200,
    });
});
// change password
exports.changePassword = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const id = req.user._id;
    const { password, newPassword } = req.body;
    if (!newPassword) {
        throw new customError_utils_1.default('New password is required', 400);
    }
    if (!password) {
        throw new customError_utils_1.default('Old password is required', 400);
    }
    const user = await auth_model_1.default.findOne({ _id: id }).select('+password');
    if (!user) {
        throw new customError_utils_1.default('USer not found', 400);
    }
    const isOldPassword = await (0, bcrypt_utils_1.comparePassword)(password, user.password);
    if (!isOldPassword) {
        throw new customError_utils_1.default('Password is not matched', 400);
    }
    const hash = await (0, bcrypt_utils_1.hashPassword)(newPassword);
    user.password = hash;
    await user.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Password is changed',
        data: null,
        statusCode: 200,
    });
});
// logout
exports.logout = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    res.clearCookie('access_token', {
        secure: env_config_1.default.NODE_ENV === 'development' ? false : true,
        httpOnly: env_config_1.default.NODE_ENV === 'development' ? false : true,
        maxAge: Date.now(),
        sameSite: env_config_1.default.NODE_ENV === 'development' ? 'lax' : 'none',
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: 'Logout Successfully',
        data: null,
        statusCode: 200,
    });
});
// 
