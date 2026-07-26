"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authencate = void 0;
const customError_utils_1 = __importDefault(require("../utils/customError.utils"));
const jwt_utils_1 = require("../utils/jwt.utils");
const authencate = (role) => {
    return (req, res, next) => {
        try {
            const cookies = req.cookies;
            const access_token = cookies['access_token'];
            console.log(access_token);
            if (!access_token) {
                throw new customError_utils_1.default('Unauthorized Access Denied', 401);
            }
            // verify token -> 401
            const decodedData = (0, jwt_utils_1.verifyToken)(access_token);
            if (!decodedData) {
                throw new customError_utils_1.default('Invalid token.Access Denied', 401);
            }
            // check role -> 403
            if (role && !role.includes(decodedData.role)) {
                throw new customError_utils_1.default('Forbidden. Cannot access this resource', 403);
            }
            req.user = {
                _id: decodedData._id,
                email: decodedData.email,
                role: decodedData.role,
            };
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authencate = authencate;
