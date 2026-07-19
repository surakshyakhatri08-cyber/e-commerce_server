import { NextFunction, Request, Response } from "express";
import { Role } from "../@types/enum.types";
import AppError from "../utils/customError.utils";
import { verifyToken } from "../utils/jwt.utils";


export const authencate = (role?: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {

            const cookies = req.cookies;
            const access_token = cookies['access_token'];
            console.log(access_token);

            if(!access_token) {
                throw new AppError('Unauthorized Access Denied', 401);
            }


            // verify token -> 401
            const decodedData = verifyToken(access_token);
            
            if(!decodedData) {
                throw new AppError('Invalid token.Access Denied', 401);
            }

            // check role -> 403
            if(role && !role.includes(decodedData.role)) {
                throw new AppError('Forbidden. Cannot access this resource', 403);
            }

            req.user = {
                _id: decodedData._id,
                email: decodedData.email,
                role: decodedData.role,
            };

            next();
            
        } catch (error) {
            next(error);
        }
    }

}